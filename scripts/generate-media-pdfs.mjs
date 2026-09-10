#!/usr/bin/env node

import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { readFile, stat, writeFile } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';

const siteRoot = resolve(process.argv[2] ?? 'dist');
if (siteRoot === resolve('public')) throw new Error('PDFs are build artifacts. Generate into dist, not public.');
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
let browser;
const generated = [];
try {
  browser = await chromium.launch({ executablePath, headless: true });
  const context = await browser.newContext({ javaScriptEnabled: false });
  await context.route('**/*', route => {
    const request = route.request();
    return new URL(request.url()).origin === baseUrl && ['GET', 'HEAD'].includes(request.method()) ? route.continue() : route.abort();
  });
  for (const lang of ['en', 'lt']) {
    const page = await context.newPage();
    await page.setViewportSize({ width: 1440, height: 1100 });
    const response = await page.goto(`${baseUrl}/assets/media/hecavex-media-kit-${lang}.html`);
    assert.equal(response.status(), 200);
    await page.emulateMedia({ media: 'print' });
    const source = await page.evaluate(async () => {
      await document.fonts.ready;
      return {
        mode: document.compatMode,
        fonts: [...document.fonts].filter(font => font.status === 'loaded').map(font => font.family.replaceAll('"', '')),
        author: document.querySelector('h1')?.textContent,
        biographies: [...document.querySelectorAll('[data-biography]')].map(node => node.textContent.replace(/\s+/g, ' ').trim()),
        sourceLinks: document.querySelectorAll('aside ul a').length,
        actionsHidden: getComputedStyle(document.querySelector('.actions')).display === 'none'
      };
    });
    assert.equal(source.mode, 'CSS1Compat');
    assert(source.fonts.includes('Inter'), 'Inter must load from the local artifact');
    assert(source.fonts.includes('IBM Plex Mono'), 'IBM Plex Mono must load from the local artifact');
    assert.equal(source.author, 'Deividas Lis');
    assert.equal(source.biographies.length, 2);
    assert(source.biographies.every(bio => bio.length > 100));
    assert.equal(source.sourceLinks, 6);
    assert(source.actionsHidden);
    const bytes = await page.pdf({ preferCSSPageSize: true, printBackground: true, displayHeaderFooter: false });
    const structure = bytes.toString('latin1');
    assert(structure.startsWith('%PDF-'));
    assert.equal((structure.match(/\/Type\s*\/Page\b/g) ?? []).length, 1, `${lang} kit must remain one A4 page`);
    assert(/\/FontFile[23]\b/.test(structure), 'PDF must embed font data');
    assert(/\/BaseFont\s*\/[^\s/]*Inter/.test(structure), 'PDF must include Inter');
    assert(/\/BaseFont\s*\/[^\s/]*IBMPlexMono/.test(structure), 'PDF must include IBM Plex Mono');
    generated.push({ lang, bytes, fonts: [...new Set(source.fonts)] });
    await page.close();
  }
} finally {
  try { await browser?.close(); } finally { await new Promise(done => server.close(done)); }
}
// Write only after both languages pass. No source PDFs or synthetic metadata.
for (const item of generated) {
  await writeFile(join(siteRoot, 'assets/media', `hecavex-media-kit-${item.lang}.pdf`), item.bytes);
  console.log(`Generated ${item.lang} media PDF: ${item.bytes.length} bytes, one A4 page, embedded ${item.fonts.join(' + ')}. Print-source biographies and six source links checked.`);
}
