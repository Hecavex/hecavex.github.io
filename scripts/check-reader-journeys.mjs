#!/usr/bin/env node

import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { chromium } from 'playwright-core';

const siteRoot = resolve(process.argv[2] ?? 'dist');
const browserCandidates = [
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser'
].filter(Boolean);
const executablePath = browserCandidates.find((candidate) => existsSync(candidate));
if (!executablePath) throw new Error('No Chromium browser found. Set PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH.');

const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' };

const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://127.0.0.1').pathname);
    let target = join(siteRoot, normalize(pathname).replace(/^[/\\]+/, ''));
    if (!target.startsWith(`${siteRoot}${sep}`) && target !== siteRoot) throw new Error('path traversal');
    try { if ((await stat(target)).isDirectory()) target = join(target, 'index.html'); } catch { if (!extname(target)) target = join(target, 'index.html'); }
    const body = await readFile(target);
    response.writeHead(200, { 'Content-Type': mime[extname(target)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' });
    response.end(body);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.end('Not found');
  }
});
await new Promise((accept) => server.listen(0, '127.0.0.1', accept));
const address = server.address();
const baseUrl = `http://127.0.0.1:${address.port}`;



import assert from 'node:assert/strict';
const browser = await chromium.launch({executablePath, headless: true});
let checked = 0;
try {
 for (const lang of ['en','lt']) for (const width of [320,390,1440]) for (const enabled of [false,true]) {
  const ctx=await browser.newContext({viewport:{width,height:900},javaScriptEnabled:enabled,hasTouch:width<768});
  await ctx.route('**/*',r=>new URL(r.request().url()).origin===baseUrl?r.continue():r.abort());
  try {
   for(const kind of ['research','contact','speaker']){
    const route=lang==='en'?kind:({research:'tyrimai',contact:'kontaktai',speaker:'pranesejas'})[kind];
    const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
    assert.equal((await page.goto(baseUrl+'/'+lang+'/'+route+'/')).status(),200);
    await page.evaluate(()=>document.fonts.ready);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,route+' overflow');
    if(kind==='research'){
     const summary=page.locator('.research-tasks summary').first();
     await summary.focus();await page.keyboard.press('Enter');
     assert.equal(await page.locator('.research-tasks').getAttribute('open'),'');
     if(width<768){await summary.tap();assert.equal(await page.locator('.research-tasks').getAttribute('open'),null);await summary.tap();}
     assert.equal(await page.locator('.research-tasks ol a').count(),4);
     assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,route+' expanded overflow');
     for(const href of await page.locator('.research-tasks ol a').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')))){
      assert(href.startsWith('/'+lang+'/'));
      assert.equal((await ctx.request.get(baseUrl+href)).status(),200);
     }
    }
    if(kind==='speaker')assert.equal(await page.locator('a[href*="?talk="]').count(),3);
    if(kind==='contact'){
     assert.equal(await page.locator('.enquiry-templates a').count(),3);
     for(const href of await page.locator('.enquiry-templates a').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')))){
      const link=new URL(href);assert.equal(link.pathname,'info@hecavex.com');assert(link.searchParams.get('body').length>60);
     }
     if(!enabled)assert.equal(await page.locator('[data-enquiry-editor]').isVisible(),false);
     else {
      const editorSummary=page.locator('[data-enquiry-editor] summary');
      if(width<768)await editorSummary.tap();else await editorSummary.click();
      const topic=page.locator('[data-field=topic]');
      await topic.fill('A & B <example> ? # ąčę');
      await page.locator('[data-field=date]').fill('2026-10-01 10:00 Europe/Vilnius');
      const traffic=[];page.on('request',r=>traffic.push(r.url()));
      await page.locator('[data-prepare]').focus();await page.keyboard.press('Enter');
      await page.locator('[data-enquiry-output]').waitFor();
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,route+' prepared draft overflow');
      assert((await page.locator('[data-draft]').inputValue()).includes('A & B <example> ? # ąčę'));
      const link=new URL(await page.locator('[data-open-email]').getAttribute('href'));
      assert.equal(link.pathname,'info@hecavex.com');
      assert(link.searchParams.get('body').includes('A & B <example> ? # ąčę'));
      assert.equal(await page.locator('[data-draft]').evaluate(e=>document.activeElement===e),true);
      assert.deepEqual(traffic,[]);
      await topic.fill('Changed');assert.equal(await page.locator('[data-enquiry-output]').isVisible(),false);
      assert.equal(await page.evaluate(()=>localStorage.length),0);
     }
    }
    assert.deepEqual(errors,[]);checked++;await page.close();
   }
   if(enabled){
    const page=await ctx.newPage();const route=lang==='en'?'contact':'kontaktai';
    for(const value of ['0','1','2','bad']){
     await page.goto(baseUrl+'/'+lang+'/'+route+'/?talk='+value+'#prepare-request');
     await page.locator('[data-enquiry-editor]').waitFor();
     const topic=await page.locator('[data-field=topic]').inputValue();
     assert.equal(Boolean(topic),value!=='bad');
    }
    await page.close();
   }
  }finally{await ctx.close();}
  console.log(`Reader journeys: ${lang}, ${width}px, JavaScript ${enabled ? 'on' : 'off'} passed.`);
 }
}finally{await browser.close();await new Promise(done=>server.close(done));}
console.log('Reader journeys passed: '+checked+' EN/LT route/viewport/JS cases, static templates, research links, keyboard drafts, privacy and bounded talk selection.');
