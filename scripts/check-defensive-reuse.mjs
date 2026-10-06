import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, resolve, sep } from 'node:path';
import { chromium } from 'playwright-core';
import { canonicalCode, readCanonicalCode } from '../src/lib/remark-canonical-code.mjs';

const root = resolve(process.argv[2] ?? 'dist');
const executablePath = [process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(path => path && existsSync(path));
assert(executablePath, 'A Chromium browser is required');
const types = {'.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.woff2':'font/woff2', '.svg':'image/svg+xml'};
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
    let path = resolve(root, '.' + pathname);
    if (!path.startsWith(root + sep)) throw new Error('Outside root');
    if ((await stat(path)).isDirectory()) path = join(path, 'index.html');
    response.writeHead(200, {'Content-Type': `${types[extname(path)] ?? 'text/plain'}; charset=utf-8`});
    response.end(await readFile(path));
  } catch { response.writeHead(404); response.end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
let browser;
let cases = 0;
try {
  browser = await chromium.launch({executablePath, headless:true});
  for (const lang of ['en','lt']) for (const width of [320,390,1440]) for (const javaScriptEnabled of [false,true]) {
    const context = await browser.newContext({viewport:{width,height:900}, javaScriptEnabled,
      forcedColors:'active', reducedMotion:'reduce'});
    await context.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const prefix = lang === 'en' ? '/en/research/' : '/lt/tyrimai/';
    await page.goto(origin + prefix + 'adform-supply-chain-crypto-clipper/');
    const blocks = await page.locator('pre code').allTextContents();
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Adform overflow ${width}`);
    for (const id of Object.keys(canonicalCode)) {
      const expected = readCanonicalCode(id).code;
      assert.equal(blocks.filter(text => text.replaceAll('\r\n','\n').trimEnd() === expected).length, 1, `${lang} rendered canonical ${id}`);
    }
    const corrections = lang === 'en' ? '/en/corrections/' : '/lt/pataisymai/';
    const correction = page.locator(`a[href="${corrections}#adform-executable-examples"]`).first();
    await correction.focus();
    await page.keyboard.press('Enter');
    await page.waitForURL(origin + corrections + '#adform-executable-examples');
    assert.equal(await page.locator('#adform-executable-examples').count(), 1);
    for (const route of [lang === 'en' ? '/en/now/' : '/lt/dabar/', lang === 'en' ? '/en/speaker/' : '/lt/pranesejas/', corrections]) {
      await page.goto(origin + route);
      assert(await page.locator('main').innerText());
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${route} overflow ${width}`);
      for (const href of await page.locator('main a[href^="/"]').evaluateAll(links => links.map(link => link.getAttribute('href')))) {
        const response = await context.request.get(origin + href.split('#')[0]);
        assert.equal(response.status(), 200, `${route}: ${href}`);
        if (href.includes('#')) {
          const id = decodeURIComponent(href.split('#')[1]);
          assert(await page.evaluate(({html,id}) => Boolean(new DOMParser().parseFromString(html,'text/html').getElementById(id)),
            {html:await response.text(),id}), `Missing fragment ${href}`);
        }
      }
    }
    assert.deepEqual(errors, []);
    await context.close();
    cases++;
  }
  console.log(`PASS defensive reuse: ${cases} EN/LT 320/390/1440 JS/no-JS cases, rendered code parity, keyboard correction handoff, forced colors/reduced motion and internal links. Not a screen-reader, literal browser-zoom or native-LT review.`);
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
