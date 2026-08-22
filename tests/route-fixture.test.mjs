import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const routes = (await readFile(new URL('./fixtures/production-sitemap-routes.txt', import.meta.url), 'utf8')).split(/\r?\n/).filter(Boolean);

test('production migration contract pins 128 unique indexed routes', () => {
  assert.equal(routes.length, 128);
  assert.equal(new Set(routes).size, 128);
});

test('both editions retain every Signal Brief date route', () => {
  for (const lang of ['en/briefings', 'lt/apzvalgos']) {
    for (const date of ['2026-08-02', '2026-08-09', '2026-08-14', '2026-08-22']) assert.ok(routes.includes(`/${lang}/${date}/`));
  }
});
