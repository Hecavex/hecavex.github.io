import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { validateDataCatalogue, validateMessageTables } from './validate-content.mjs';

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
