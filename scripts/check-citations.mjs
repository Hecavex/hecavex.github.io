#!/usr/bin/env node
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile, readdir, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { chromium } from 'playwright-core';
import { citationDate, toBibtex, toCslJson } from '../src/lib/publication-citations.mjs';

const root = resolve(process.argv[2] ?? 'dist');
const load = path => readFile(join(root, path), 'utf8');
const catalogue = JSON.parse(await load('/data/publications.json'));
const searches = (await Promise.all(['en', 'lt'].map(async lang => JSON.parse(await load(`/${lang}/search.json`))))).flat();
assert.equal(catalogue.schemaVersion, 1);
assert.equal(catalogue.languageEditionCount, searches.length);
assert.equal(catalogue.publications.length, searches.length);
assert(catalogue.publicationCount > 0 && catalogue.publicationCount <= searches.length);
assert.equal(new Set(catalogue.publications.map(item => item.id)).size, searches.length);
assert.deepEqual(catalogue.publications.map(item => new URL(item.id).pathname).sort(), searches.map(item => item.url).sort());

async function filesAt(path) {
  const entries = await readdir(path, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? filesAt(join(path, entry.name)) : [join(path, entry.name)]))).flat();
}
assert.equal((await filesAt(join(root, 'citations'))).length, searches.length * 2, 'No orphan/draft citation files');
for (const record of catalogue.publications) {
  const url = new URL(record.id);
  assert.equal(url.origin, 'https://hecavex.com');
  const search = searches.find(item => item.url === url.pathname);
  assert.equal(record.title, search.title);
  assert.equal(record.description, search.description);
  assert.equal(record.published, citationDate(search.date));
  const csl = JSON.parse(await load(new URL(record.citation.cslJson).pathname));
  assert.deepEqual(csl, toCslJson(record));
  assert.equal(await load(new URL(record.citation.bibtex).pathname), toBibtex(record));
  assert.equal(csl[0].id, csl[0].URL);
  for (const translation of record.translations) {
    const target = catalogue.publications.find(item => item.id === translation.url);
    assert(target, 'Translation must be public');
    assert.notEqual(target.language, record.language);
    assert(target.translations.some(item => item.url === record.id), 'Translation link must be reciprocal');
  }
}

const candidates = [process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser'].filter(Boolean);
const executablePath = candidates.find(path => existsSync(path));
if (!executablePath) throw new Error('No Chromium browser found');
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.bib': 'application/x-bibtex', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2' };
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
    let target = join(root, normalize(pathname).replace(/^[/\\]+/, ''));
    if (target !== root && !target.startsWith(root + sep)) throw new Error('Path traversal');
    if ((await stat(target)).isDirectory()) target = join(target, 'index.html');
    response.writeHead(200, { 'Content-Type': `${mime[extname(target)] ?? 'application/octet-stream'}; charset=utf-8` });
    response.end(await readFile(target));
  } catch { response.writeHead(404); response.end(); }
});
await new Promise(accept => server.listen(0, '127.0.0.1', accept));
const baseUrl = `http://127.0.0.1:${server.address().port}`;
let browser;
let browserCases = 0;
try {
  browser = await chromium.launch({ executablePath, headless: true });
  const parserPage = await browser.newPage();
  await parserPage.route('**/*', route => route.abort());
  for (const record of catalogue.publications) {
    const html = await load(`${new URL(record.id).pathname}index.html`);
    const metadata = await parserPage.evaluate(source => {
      const doc = new DOMParser().parseFromString(source, 'text/html');
      return {
        title: doc.querySelector('meta[name="DC.title"]')?.content,
        author: doc.querySelector('meta[name="DC.creator"]')?.content,
        date: doc.querySelector('meta[name="DC.date"]')?.content,
        language: doc.querySelector('meta[name="DC.language"]')?.content,
        canonical: doc.querySelector('meta[name="DC.identifier"]')?.content,
        type: doc.querySelector('meta[name="DC.type"]')?.content,
        highwire: Boolean(doc.querySelector('meta[name="citation_title"]')),
        links: [...doc.querySelectorAll('.citation-downloads a')].map(link => link.getAttribute('href'))
      };
    }, html);
    assert.deepEqual(metadata, {
      title: record.title, author: 'Lis, Deividas', date: record.published,
      language: record.language, canonical: record.id, type: 'Text', highwire: false,
      links: [new URL(record.citation.bibtex).pathname, new URL(record.citation.cslJson).pathname]
    });
  }
  await parserPage.close();
  for (const lang of ['en', 'lt']) for (const width of [320, 1440]) for (const enabled of [false, true]) {
    const context = await browser.newContext({ viewport: { width, height: 960 }, javaScriptEnabled: enabled, hasTouch: width === 320 });
    await context.route('**/*', route => new URL(route.request().url()).origin === baseUrl ? route.continue() : route.abort());
    try {
      const page = await context.newPage();
      const errors = []; page.on('pageerror', error => errors.push(error.message));
      const record = catalogue.publications.find(item => item.language === lang && item.id.endsWith('/adform-supply-chain-crypto-clipper/'));
      assert(record, 'Both language fixtures must exist');
      assert.equal((await page.goto(baseUrl + new URL(record.id).pathname)).status(), 200);
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
      const links = page.locator('.citation-downloads a');
      for (let index = 0; index < 2; index++) {
        const anchor = links.nth(index);
        const downloadPromise = page.waitForEvent('download');
        if (width === 320) await anchor.tap();
        else { await anchor.focus(); await page.keyboard.press('Enter'); }
        const download = await downloadPromise;
        const expected = await load(await anchor.getAttribute('href'));
        assert.equal(await readFile(await download.path(), 'utf8'), expected, 'Downloaded bytes must match the published citation');
      }
      const about = lang === 'lt' ? '/lt/apie/' : '/en/about/';
      await page.goto(baseUrl + about);
      const graph = await page.locator('script[type="application/ld+json"]').textContent();
      const nodes = JSON.parse(graph)['@graph'];
      assert.equal(nodes.find(node => node['@type'] === 'ProfilePage').mainEntity['@id'], 'https://hecavex.com/#deividas-lis');
      assert(nodes.find(node => node['@type'] === 'Person').sameAs.includes('https://www.linkedin.com/in/deilis'));
      assert(!nodes.find(node => node['@type'] === 'Organization').sameAs.includes('https://www.linkedin.com/in/deilis'));
      assert.deepEqual(errors, []);
      browserCases++;
    } finally { await context.close(); }
  }
  console.log(`Citation checks passed: ${catalogue.publications.length} localized records, ${catalogue.publications.length * 2} exact exports, ${browserCases} bilingual desktop/mobile JS/no-JS browser cases.`);
} finally {
  if (browser) await browser.close();
  await new Promise(accept => server.close(accept));
}
