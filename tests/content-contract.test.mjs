import test from 'node:test';
import assert from 'node:assert/strict';
import { validate } from '../scripts/validate-content.mjs';

test('all 42 localized publications satisfy the Astro content contract', async () => {
  const result = await validate();
  assert.equal(result.postCount, 42);
  assert.equal(result.languageRecords, 42);
});
