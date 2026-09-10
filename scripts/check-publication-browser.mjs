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


const browser = await chromium.launch({ executablePath, headless: true });
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const cases = [
 ['/en/research/what-to-do-after-entering-banking-details-on-phishing-page/', true],
 ['/lt/tyrimai/ka-daryti-suvedus-banko-duomenis-phishing-puslapyje/', true],
 ['/en/research/how-to-check-a-suspicious-sms-link-safely/', true],
 ['/lt/tyrimai/kaip-saugiai-patikrinti-itartina-sms-nuoroda/', true],
 ['/en/research/github-and-malware/', false],
 ['/lt/tyrimai/github-and-malware/', false],
 ['/en/research/facebook-cloaking-explained/', false],
 ['/en/research/adform-supply-chain-crypto-clipper/', false]
];
try {
 for (const width of [320, 390, 1440]) {
  for (const [route, actions] of cases) {
   const page = await browser.newPage({ viewport: { width, height: 844 } });
   await page.addInitScript(() => Object.defineProperty(navigator, 'doNotTrack', { value: '1' }));
   page.on('pageerror', error => failures.push(route + ': ' + error.message));
   const response = await page.goto(baseUrl + route);
   check(response.status() === 200, route + ': HTTP status');
   const state = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth > innerWidth + 1,
    actions: !!document.querySelector('.article-deck + .immediate-actions'),
    boxes: document.querySelectorAll('input[type=checkbox][disabled]').length,
    csp: !!document.querySelector('meta[http-equiv="Content-Security-Policy"]'),
    figures: [...document.querySelectorAll('.hx-evidence-figure')].map(f => ({ link: !!f.querySelector('a.evidence-original'), caption: !!f.querySelector('figcaption'), text: f.querySelector('a.evidence-original')?.textContent })),
    metadata: parseFloat(getComputedStyle(document.querySelector('.card-meta') ?? document.body).fontSize),
    proseAligned: [...document.querySelectorAll('.article-body > p')].every(p => getComputedStyle(p).textAlign !== 'justify')
   }));
   check(!state.overflow, route + ' @ ' + width + ': overflow');
   check(state.actions === actions, route + ': immediate action scope/order');
   check(!state.boxes, route + ': disabled checkboxes');
   check(state.csp, route + ': CSP missing');
   if (route.includes('sms') || route.includes('adform')) check(state.figures.length > 0 && state.figures.every(f => f.link && f.caption), route + ': inspectable figures');
   check(state.metadata >= 12, route + ': metadata below 12px');
   if (width <= 600) check(state.proseAligned, route + ': narrow prose remains justified');
   if (route.includes('github-and-malware')) {
    check(state.figures.length === 6 && state.figures.every(f => f.link && f.caption && /px/.test(f.text)), route + ': evidence links/captions/dimensions');
    await page.evaluate(() => document.fonts.ready);
    const link = page.locator('.evidence-original').nth(1);
    const originalUrl = new URL(await link.getAttribute('href'), page.url()).href;
    let departureScroll;
    await page.exposeFunction('recordEvidenceDeparture', value => { departureScroll = value; });
    // Click may scroll the link into view. Record the viewport at activation,
    // not the earlier position before Playwright has performed that scroll.
    await link.evaluate(element => element.addEventListener('click', () => {
     window.recordEvidenceDeparture(scrollY);
    }, { once: true }));
    await link.click();
    await page.waitForURL(originalUrl);
    check(Number.isFinite(departureScroll), route + ': evidence departure viewport captured');
    await page.goBack();
    const restoration = await page.evaluate(async expected => {
     await document.fonts.ready;
     const started = performance.now();
     let previous = scrollY;
     let stableSince = started;
     return await new Promise(resolve => {
      const sample = now => {
       const current = scrollY;
       if (Math.abs(current - previous) > 1) stableSince = now;
       previous = current;
       const withinTolerance = Math.abs(current - expected) < 120;
       if (withinTolerance && now - stableSince >= 150) return resolve({ scroll: current, settled: true });
       if (now - started >= 3000) return resolve({ scroll: current, settled: false });
       requestAnimationFrame(sample);
      };
      requestAnimationFrame(sample);
     });
    }, departureScroll);
    check(restoration.settled && Math.abs(restoration.scroll - departureScroll) < 120, route + ' @ ' + width + ': back scroll restoration ' + departureScroll + ' -> ' + restoration.scroll);
   }
   for (const mode of ['denied', 'missing', 'success']) {
    await page.evaluate(mode => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: mode === 'missing' ? undefined : { writeText: async value => { if (mode === 'denied') throw new DOMException('Denied', 'NotAllowedError'); window.copiedValue = value; } } }), mode);
    await page.locator('[data-copy-link]').click();
    if (mode !== 'success') check(await page.locator('[data-copy-fallback] input').inputValue() === 'https://hecavex.com' + route, route + ': canonical fallback');
    else check(await page.evaluate(() => window.copiedValue) === 'https://hecavex.com' + route, route + ': canonical copied');
   }
   await page.close();
  }
 }
 for (const lang of ['en', 'lt']) {
  const page = await browser.newPage();
  await page.addInitScript(() => Object.defineProperty(navigator, 'doNotTrack', { value: '1' }));
  await page.goto(baseUrl + '/' + lang + '/');
  const expected = lang === 'lt' ? '/lt/tyrimai/' : '/en/research/';
  check(await page.locator('.portfolio-navigation a').first().getAttribute('href') === expected, lang + ': navigation language');
  await page.evaluate(() => document.querySelector('[data-search-dialog]').showModal());
  const input = page.locator('[data-search-input]');
  for (const query of ['qMQ9By0xS9aF5IiNtG4neJTkGsJhNSYj3qNHWGt4MFE', 'smarxtech[.]store', 'abb9f700bbacca228df0cee3da36466c144034b0510b827fff1336775a1610b2']) {
   await input.fill(query);
   await page.waitForFunction(expected => document.querySelector('[data-search-results] a')?.getAttribute('href')?.includes(expected), query.startsWith('abb') ? 'adform' : 'github-and-malware');
   check((await page.locator('[data-search-results] a').first().getAttribute('href')).includes(query.startsWith('abb') ? 'adform' : 'github-and-malware'), lang + ': observable search ' + query);
  }
  await input.fill('phishing');
  await page.waitForTimeout(100);
  const count = await page.locator('[data-search-results] a').count();
  check(count > 10, lang + ': broad query does not expose all matches');
  check((await page.locator('[data-search-results] [role=status]').innerText()).includes(String(count)), lang + ': match count');
  await page.close();
 }
} finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log('Publication regression passed: EN/LT, 320/390/1440px, evidence originals/back, immediate actions, clipboard states, safe observable search, locale and CSP.');
