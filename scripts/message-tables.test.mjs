import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';
import { validateDataCatalogue, validateMessageTables, validatePageContext } from './validate-content.mjs';

const read = (path) => readFileSync(path, 'utf8');

test('en.yml and lt.yml have identical keys and no empty values', () => {
  const errors = [];
  validateMessageTables(read('src/data/hecavex/en.yml'), read('src/data/hecavex/lt.yml'), errors);
  assert.deepEqual(errors, []);
  assert.deepEqual(Object.keys(parse(read('src/data/hecavex/en.yml'))).sort(), Object.keys(parse(read('src/data/hecavex/lt.yml'))).sort());
});

test('a message table with a missing or empty key is rejected', () => {
  const errors = [];
  validateMessageTables('a: A\nb: B\n', "a: ''\nc: C\n", errors);
  for (const expected of ['lt.yml: a must be a non-empty string', 'en.yml: b is missing from the lt table', 'lt.yml: c is missing from the en table']) {
    assert(errors.some((error) => error.includes(expected)), `${expected}: ${errors.join(' | ')}`);
  }
});

test('the data catalogue is complete', () => {
  const errors = [];
  validateDataCatalogue(read('src/data/data-catalogue.yml'), errors);
  assert.deepEqual(errors, []);
});

test('an incomplete data catalogue is rejected', () => {
  const errors = [];
  validateDataCatalogue(`catalogues:
  - { id: a, index: '01', cadence: { en: x }, description: { en: x, lt: y }, links: [{ label: { en: x, lt: y }, detail: { en: x, lt: y }, href: //evil.example/ }] }
  - { id: a, index: '', cadence: { en: x, lt: y }, description: { en: x, lt: y }, links: [{ label: { en: x, lt: y }, detail: { en: x, lt: y }, href: { en: /a/, lt: http://insecure.example/ } }] }
`, errors);
  for (const expected of ['cadence needs non-empty en and lt', 'must start with / or https://', 'id is missing or duplicated', 'index is missing']) {
    assert(errors.some((error) => error.includes(expected)), `${expected}: ${errors.join(' | ')}`);
  }
});

test('placeholders must match between languages', () => {
  const errors = [];
  validateMessageTables("count: '{n} posts'\n", "count: 'publikacijos'\n", errors);
  assert(errors.some((error) => error.includes('count placeholders differ')), errors.join(' | '));
});

test('every message key a template reads exists in both tables', () => {
  const tables = ['en', 'lt'].map((lang) => parse(read(`src/data/hecavex/${lang}.yml`)));
  const files = [];
  const walk = (directory) => { for (const entry of readdirSync(directory, { withFileTypes: true })) { const path = join(directory, entry.name); if (entry.isDirectory()) walk(path); else if (/\.(astro|ts)$/.test(entry.name)) files.push(path); } };
  walk('src');
  const missing = [];
  for (const file of files) {
    const source = read(file);
    // Only the variables these files bind to copy[lang]: `const c = copy[lang]`, `hx`, `t`.
    const names = [...source.matchAll(/const (\w+) = copy\[[^\]]+\]/g)].map((match) => match[1]);
    const usages = [...names.flatMap((name) => [...source.matchAll(new RegExp(`\\b${name}\\.([a-z][a-z0-9_]*)`, 'g'))]), ...source.matchAll(/copy\[[^\]]+\]\.([a-z][a-z0-9_]*)/g)];
    for (const [, key] of usages) for (const table of tables) if (!(key in table)) missing.push(`${file}: ${key}`);
  }
  assert.deepEqual([...new Set(missing)], []);
});

test('page context facts and contact routes line up in both languages', () => {
  const errors = [];
  validatePageContext(read('src/data/page-context.yml'), errors);
  assert.deepEqual(errors, []);
  const bad = [];
  validatePageContext("facts:\n  x:\n    en: [{ label: A, value: '{Updated}' }]\n    lt: []\ncontact_routes:\n  en: []\n  lt: []\n", bad);
  assert(bad.some((error) => error.includes('same length')), bad.join(' | '));
});

test('a data catalogue id must name a portfolio project', () => {
  const errors = [];
  validateDataCatalogue(read('src/data/data-catalogue.yml'), errors, new Set(['radar']));
  assert(errors.some((error) => error.includes('must match a project')), errors.join(' | '));
});
