import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validatePortfolio } from './validate-content.mjs';

const problems = (source) => { const errors = []; validatePortfolio(source, errors); return errors; };

test('the committed registry is valid', () => {
  assert.deepEqual(problems(readFileSync('src/data/portfolio.yml', 'utf8')), []);
});

test('an inconsistent registry is rejected', () => {
  const errors = problems(`projects:
  - { id: a, order: 1, kind: service, name: A, links: [], nav: { label: { en: A }, href: //evil.example/ } }
  - { id: a, order: 1, kind: hosted, name: '', links: [], card: { title: B, href: http://insecure.example/, summary: B } }
`);
  for (const expected of ['nav.label needs non-empty en and lt', 'links must be a non-empty list', 'purpose is missing', 'protocol-relative', 'id is missing or duplicated', 'order must be a unique integer', 'kind must be one of', 'name is empty', 'must start with / or https://']) {
    assert(errors.some((error) => error.includes(expected)), `${expected}: ${errors.join(' | ')}`);
  }
});
