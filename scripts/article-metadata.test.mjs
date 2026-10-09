import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { chromium } from 'playwright-core';

const cssRoot = new URL('../public/assets/css/modules/', import.meta.url);
const css = (await Promise.all(['article-reading.css', 'responsive.css'].map((name) => readFile(new URL(name, cssRoot), 'utf8')))).join('\n');
const template = await readFile(new URL('../src/pages/[lang]/[section]/[slug].astro', import.meta.url), 'utf8');
const browsers = [
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser'
].filter(Boolean);

test('shared research record keeps the classification as its final semantic row', () => {
  const record = template.match(/class="research-record"[\s\S]*?<dl>([\s\S]*?)<\/dl>/)?.[1];
  assert.ok(record, 'shared research record must exist');
  const rows = [...record.matchAll(/<div><dt>([\s\S]*?)<\/dt><dd(?:\s[^>]*)?>([\s\S]*?)<\/dd><\/div>/g)];
  assert.equal(rows.length, 9);
  assert.equal(rows.at(-1)[1], 'TLP');
  assert.match(rows.at(-1)[2], /data\.tlp/);
});

test('final research metadata row fills the grid in both languages and across its breakpoint', async () => {
  const executablePath = browsers.find((candidate) => existsSync(candidate));
  assert.ok(executablePath, 'No Chromium browser found. Set PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH.');
  const browser = await chromium.launch({ executablePath, headless: true });
  try {
    const page = await browser.newPage();
    await page.route('**/*', (route) => route.abort());
    for (const [lang, labels] of Object.entries({
      en: ['ID', 'Version', 'Status', 'Evidence basis', 'Scope', 'Limitations', 'Methods', 'Substantive review', 'TLP'],
      lt: ['ID', 'Versija', 'Būsena', 'Įrodymų pagrindas', 'Apimtis', 'Ribotumai', 'Metodai', 'Turinio peržiūra', 'TLP']
    })) {
      const rows = labels.map((label, index) => `<div><dt>${label}</dt><dd>${index === 8 ? 'CLEAR' : '2026-10-09'}</dd></div>`).join('');
      await page.setContent(`<!doctype html><html lang="${lang}"><head><style>*{box-sizing:border-box}body{margin:0;padding:16px}dl{margin:0}:root{--line:#333;--bg-elevated:#111;--text-soft:#ccc}${css}</style></head><body><section class="research-record"><dl>${rows}</dl></section></body></html>`);
      for (const width of [320, 390, 680, 681, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        const state = await page.locator('.research-record dl').evaluate((grid) => {
          const rect = grid.getBoundingClientRect();
          const style = getComputedStyle(grid);
          const last = grid.lastElementChild;
          const lastRect = last.getBoundingClientRect();
          return {
            gridLeft: rect.left + parseFloat(style.paddingLeft),
            gridRight: rect.right - parseFloat(style.paddingRight),
            lastLeft: lastRect.left,
            lastRight: lastRect.right,
            firstWidth: grid.firstElementChild.getBoundingClientRect().width,
            lastWidth: lastRect.width,
            columns: style.gridTemplateColumns.split(' ').length,
            label: last.querySelector('dt').textContent,
            value: last.querySelector('dd').textContent,
            overflow: document.documentElement.scrollWidth > innerWidth
          };
        });
        const context = `${lang} at ${width}px`;
        assert.ok(Math.abs(state.lastLeft - state.gridLeft) <= 1, `${context}: TLP must start at the grid's left edge`);
        assert.ok(Math.abs(state.lastRight - state.gridRight) <= 1, `${context}: TLP must reach the grid's right edge`);
        assert.equal(state.columns, width <= 680 ? 1 : 2, `${context}: preserve responsive columns`);
        assert.ok(width <= 680 || state.firstWidth < state.lastWidth * 0.51, `${context}: preceding metadata keeps two columns`);
        assert.equal(state.label, 'TLP', context);
        assert.equal(state.value, 'CLEAR', context);
        assert.equal(state.overflow, false, `${context}: no horizontal overflow`);
      }
    }
  } finally {
    await browser.close();
  }
});
