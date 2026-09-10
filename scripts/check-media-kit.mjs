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

const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' };

const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://127.0.0.1').pathname);
    let target = join(siteRoot, normalize(pathname).replace(/^[/\\]+/, ''));
    if (!target.startsWith(`${siteRoot}${sep}`) && target !== siteRoot) throw new Error('path traversal');
    try { if ((await stat(target)).isDirectory()) target = join(target, 'index.html'); } catch { if (!extname(target)) target = join(target, 'index.html'); }
    let body = await readFile(target);
    // Chromium native downloads bypass Playwright request interception. Mirror
    // the canonical origin only in served test HTML so the browser performs a
    // real same-origin download against local bytes. Raw/offline assets below
    // must still retain their absolute production URLs.
    if (extname(target) === '.html') body = Buffer.from(body.toString('utf8').replaceAll('https://hecavex.com/', `${baseUrl}/`));
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
const canonicalOrigin = 'https://hecavex.com';



import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';

const browser = await chromium.launch({ executablePath, headless: true });
let cases = 0;
try {
  for (const lang of ['en', 'lt']) {
    const filename = `hecavex-media-kit-${lang}`;
    const asset = `/assets/media/${filename}.html`;
    const html = await readFile(join(siteRoot, asset), 'utf8');
    const plain = await readFile(join(siteRoot, `/assets/media/${filename}.txt`), 'utf8');
    const speakerFile = resolve(import.meta.dirname, '..', 'src/content/pages', lang, lang === 'en' ? 'speaker.md' : 'pranesejas.md');
    const speaker = await readFile(speakerFile, 'utf8');
    const section = speaker.split(lang === 'en' ? '## Selected appearances' : '## Atrinkti pasirodymai')[1].split(lang === 'en' ? '## Media kit' : '## Medijos rinkinys')[0];
    const expectedLinks = [...section.matchAll(/\]\((https:[^)]+)\)/g)].map(match => match[1]);
    assert.equal(expectedLinks.length, 6);
    assert(html.trimStart().toLowerCase().startsWith('<!doctype html>'));
    assert(!html.includes('layout: null'));
    assert(!html.includes('50-word'));
    assert.equal((html.match(/<script\b/gi) ?? []).length, 0, 'Kits need no executable scripts');
    assert(speaker.includes(`/assets/media/${filename}.txt`), 'Speaker page exposes the text download');
    assert(html.includes(`href="${canonicalOrigin}/assets/media/${filename}.txt"`), 'Raw portable asset must link to the canonical online text file');
    for (const offline of [false, true]) {
      const ctx = await browser.newContext({ javaScriptEnabled: false, hasTouch: true });
      await ctx.route('**/*', route => {
        const url = new URL(route.request().url());
        if (!['GET', 'HEAD'].includes(route.request().method())) return route.abort();
        return url.origin === baseUrl || url.protocol === 'file:' ? route.continue() : route.abort();
      });
      try {
        const page = await ctx.newPage();
        for (const width of [320, 390, 1440]) {
          await page.setViewportSize({ width, height: 900 });
          await page.goto(offline ? pathToFileURL(join(siteRoot, asset)).href : baseUrl + asset);
          await page.evaluate(() => document.fonts.ready);
          assert.equal(await page.evaluate(() => document.compatMode), 'CSS1Compat');
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `${lang}/${width}/offline=${offline} overflow`);
          assert.equal(await page.locator('html').getAttribute('lang'), lang);
          assert.deepEqual(await page.locator('aside ul a').evaluateAll(links => links.map(link => link.href)), expectedLinks);
          for (const text of await page.locator('[data-biography]').allTextContents()) {
            assert(plain.includes(text.replace(/\s+/g, ' ').trim()), 'Plain text biography must match HTML exactly');
          }
          assert(plain.includes((await page.locator('[data-reuse-note]').innerText()).trim()), 'Reuse boundary travels with the download');
          for (const url of expectedLinks) assert(plain.includes(url));
          assert(await page.locator('a[href="mailto:info@hecavex.com"]').isVisible());
          assert.equal(await page.locator('script').count(), 0);
          assert.equal(await page.locator('a[download]').evaluate(link => link.href), `${offline ? canonicalOrigin : baseUrl}/assets/media/${filename}.txt`, offline ? 'Downloaded HTML must resolve its text link online, never as a filesystem path' : 'Hosted test mirror preserves same-origin download semantics');
          if (!offline && width === 390) {
            const downloadLink = page.locator('a[download]');
            const box = await downloadLink.boundingBox();
            assert(box.height >= 44, 'Download has a usable touch target');
            for (const interaction of ['keyboard', 'touch']) {
              const downloadReady = page.waitForEvent('download');
              if (interaction === 'keyboard') {
                await downloadLink.focus();
                await page.keyboard.press('Enter');
              } else await downloadLink.tap();
              const download = await downloadReady;
              assert.equal(download.suggestedFilename(), filename + '.txt');
              assert.equal(await download.failure(), null, `${lang}/${interaction}: text download completes`);
              assert.equal(await readFile(await download.path(), 'utf8'), plain, 'Downloaded UTF-8 bytes must match the artifact');
            }
          }
          cases += 1;
        }
        await page.emulateMedia({ media: 'print' });
        assert.equal(await page.locator('.actions').isVisible(), false, 'Screen-only download controls do not consume the printed page');
        const pdf = await page.pdf({ preferCSSPageSize: true });
        assert.equal((pdf.toString('latin1').match(/\/Type\s*\/Page\b/g) ?? []).length, 1, `${lang} A4 page count, offline=${offline}`);
      } finally { await ctx.close(); }
    }
  }
} finally {
  await browser.close();
  await new Promise(done => server.close(done));
}
console.log(`Media kits passed: ${cases} EN/LT online/offline no-JS viewport cases, six source links, matching UTF-8 biographies, keyboard/touch downloads and four single-page A4 renders.`);
