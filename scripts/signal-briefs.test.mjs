import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';
import { parse } from 'yaml';
import { coverageDate } from '../src/lib/briefing-record.mjs';

const root = resolve(import.meta.dirname, '..');
const batch = [
  { issue: 6, start: '2026-08-31', end: '2026-09-06', counts: [2, 2, 1] },
  { issue: 7, start: '2026-09-07', end: '2026-09-13', counts: [2, 2, 1] },
  { issue: 8, start: '2026-09-14', end: '2026-09-20', counts: [2, 3, 1] }
];

async function edition(issue, end, lang) {
  const number = String(issue).padStart(3, '0');
  const name = lang === 'lt' ? 'hecavex-signalu-apzvalga' : 'hecavex-signal-brief';
  const path = resolve(root, 'src/content/posts', lang, 'bulletins', `${end}-${name}-${number}.md`);
  const source = await readFile(path, 'utf8');
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  assert(match, path);
  return { data: parse(match[1]), body: match[2] };
}

const cves = (body) => [...new Set(body.match(/CVE-\d{4}-\d{4,}/g) ?? [])].sort();

test('coverage calendar dates are independent of YAML hydration and build timezone', () => {
  for (const day of ['2026-08-31', '2026-09-20', '2026-12-31', '2024-02-29']) {
    assert.equal(coverageDate(day), day);
    assert.equal(coverageDate(new Date(`${day}T00:00:00Z`)), day);
  }
  for (const value of [undefined, null, 0, '', '2026-02-30', '2026-9-20', new Date(NaN)]) {
    assert.equal(coverageDate(value), '—');
  }
});

for (const { issue, start, end, counts } of batch) {
  test(`brief ${issue}: matched editions preserve coverage, actual publication and signal counts`, async () => {
    const pair = await Promise.all(['en', 'lt'].map(lang => edition(issue, end, lang)));
    for (const [index, { data, body }] of pair.entries()) {
      assert.equal(data.published, true);
      assert.equal(data.draft, false);
      assert.equal(data.issue, issue);
      assert.equal(data.coverage_start, start);
      assert.equal(data.coverage_end, end);
      assert.equal(new Date(data.information_cutoff).toISOString(), `${end}T23:59:59.000Z`);
      assert.equal(new Date(data.date).toISOString(), '2026-09-22T11:00:00.000Z');
      assert(new Date(data.date) > new Date(data.information_cutoff), 'retrospectives must not be backdated');
      assert.match(body, /retrospective|retrospektyv|compiled on 22 September|parengta rugsėjo 22/i);
      assert.equal(data.permalink, `/${index === 0 ? 'en/briefings' : 'lt/apzvalgos'}/${end}/`);
      assert.equal(data.translation_key, `hecavex-signal-brief-${String(issue).padStart(3, '0')}`);
      for (const [priorityIndex, priority] of ['critical', 'high', 'watch'].entries()) {
        const actual = [...body.matchAll(new RegExp(`<section class="hx-signal-entry hx-signal-entry--${priority}"`, 'g'))].length;
        assert.equal(data[`${priority}_count`], counts[priorityIndex]);
        assert.equal(actual, counts[priorityIndex], `${data.lang}: ${priority} priority counts`);
      }
      assert.doesNotMatch(body, /^##\s+(?:Bottom line|Esmė|Apibendrinimas|Išvada)\s*$/mi);
      for (const [, section] of body.matchAll(/<section class="hx-signal-entry[^>]*>([\s\S]*?)<\/section>/g)) {
        const facts = section.match(/<dl>([\s\S]*?)<\/dl>/)?.[1] ?? '';
        assert.equal((facts.match(/<dt>/g) ?? []).length, 2, `${data.lang}: every signal needs two concise facts`);
        assert.equal((facts.match(/<dd>/g) ?? []).length, 2, `${data.lang}: every fact needs a value`);
      }
      assert(body.trimEnd().endsWith('</section>'), 'finish at the last substantive item, not a generic summary');
    }
    assert.deepEqual(cves(pair[0].body), cves(pair[1].body), 'translations must cover the same CVEs');
    assert.equal(pair[0].data.date, pair[1].data.date);
  });
}

test('brief 5 retains its original date and cutoff while linking dated follow-ups', async () => {
  for (const lang of ['en', 'lt']) {
    const { data, body } = await edition(5, '2026-08-30', lang);
    assert.equal(new Date(data.date).toISOString(), '2026-08-30T12:30:00.000Z');
    assert.equal(new Date(data.information_cutoff).toISOString(), '2026-08-30T12:00:00.000Z');
    for (const { end } of batch) assert(body.includes(`/${lang === 'en' ? 'en/briefings' : 'lt/apzvalgos'}/${end}/`));
    assert.doesNotMatch(body, /^##\s+(?:Bottom line|Esmė)\s*$/mi);
    assert(body.includes('/assets/data/signal-brief-005-decisions/'), 'retain the existing evidence companion');
  }
});

test('follow-up coverage is contiguous, with no overlapping or missing UTC day', () => {
  let previousEnd = '2026-08-30';
  for (const { start, end } of batch) {
    assert.equal(Date.parse(start) - Date.parse(previousEnd), 86400000);
    assert(Date.parse(end) >= Date.parse(start));
    previousEnd = end;
  }
  assert.equal(previousEnd, '2026-09-20');
});
