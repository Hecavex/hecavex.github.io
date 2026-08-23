import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validate } from '../scripts/validate-content.mjs';

test('all 42 localized publications satisfy the Astro content contract', async () => {
  const result = await validate();
  assert.equal(result.postCount, 42);
  assert.equal(result.languageRecords, 42);
});

test('machine discovery exposes the reviewed content-use and portfolio boundaries', async () => {
  const [robots, llms] = await Promise.all([
    readFile(new URL('../public/robots.txt', import.meta.url), 'utf8'),
    readFile(new URL('../public/llms.txt', import.meta.url), 'utf8'),
  ]);
  assert.match(robots, /^Content-Signal: search=yes, ai-input=yes, ai-train=no$/m);
  assert.match(robots, /^User-agent: GPTBot$/m);
  assert.match(llms, /^# HECAVEX$/m);
  assert.match(llms, /does not provide accounts, transactions, authentication, MCP, A2A/);
  for (const url of [
    'https://hecavex.com/en/research/',
    'https://hecavex.com/lt/tyrimai/',
    'https://apt.hecavex.com/',
    'https://radar.hecavex.com/',
    'https://labs.hecavex.com/',
  ]) assert.match(llms, new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
});
