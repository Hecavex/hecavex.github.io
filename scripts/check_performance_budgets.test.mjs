import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { DEFAULT_BUDGETS, evaluateBudgets, measureSite } from './check_performance_budgets.mjs';

function measurement(path, group, rawBytes = 8, gzipBytes = 8, extension = `.${group}`) {
  return { path, group, extension, rawBytes, gzipBytes };
}

function completeFixture() {
  return [
    measurement('index.html', 'html', 8, 8, '.html'),
    measurement('assets/site.css', 'css', 8, 8, '.css'),
    measurement('assets/site.js', 'js', 8, 8, '.js'),
    measurement('assets/font.woff2', 'font', 8, 8, '.woff2'),
    measurement('assets/image.png', 'image', 8, 8, '.png')
  ];
}

test('accepts measurements below every default budget', () => {
  assert.deepEqual(evaluateBudgets(completeFixture()).failures, []);
});

test('reports the exact oversized HTML document and metric', () => {
  const files = completeFixture();
  files[0].rawBytes = DEFAULT_BUDGETS.htmlFile.rawBytes + 1;
  const failures = evaluateBudgets(files).failures;
  assert.equal(failures.length, 1);
  assert.deepEqual(failures[0], {
    label: 'HTML file',
    metric: 'raw',
    actual: DEFAULT_BUDGETS.htmlFile.rawBytes + 1,
    limit: DEFAULT_BUDGETS.htmlFile.rawBytes,
    path: 'index.html'
  });
});

test('enforces the combined CSS and JavaScript budget', () => {
  const files = completeFixture();
  files[1].rawBytes = 60 * 1024;
  files[2].rawBytes = 60 * 1024;
  const failure = evaluateBudgets(files).failures.find((item) => item.label === 'CSS + JavaScript bundle');
  assert.equal(failure.metric, 'raw');
  assert.equal(failure.actual, 120 * 1024);
});

test('applies the tighter SVG budget in addition to the image budget', () => {
  const files = completeFixture();
  files[4] = measurement('assets/diagram.svg', 'image', DEFAULT_BUDGETS.svgFile.rawBytes + 1, 8, '.svg');
  const failures = evaluateBudgets(files).failures;
  assert.equal(failures.length, 1);
  assert.equal(failures[0].label, 'SVG file');
  assert.equal(failures[0].path, 'assets/diagram.svg');
});

test('measures files in stable path order with repeatable gzip sizes', async () => {
  const root = await mkdtemp(join(tmpdir(), 'hecavex-performance-'));
  try {
    await mkdir(join(root, 'assets'));
    await writeFile(join(root, 'z.html'), '<!doctype html><title>Z</title>');
    await writeFile(join(root, 'assets', 'a.css'), 'body{color:#fff}');
    const first = await measureSite(root);
    const second = await measureSite(root);
    assert.deepEqual(first, second);
    assert.deepEqual(first.map((file) => file.path), ['assets/a.css', 'z.html']);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
