import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';
import { parse } from 'yaml';

const root = resolve(import.meta.dirname, '..');
const bundle = resolve(root, 'public/assets/data/radar-september-2026-baseline');
const publication = '3d80a765404f50afbe50c3dc49472751a2e13b65';
const generator = '33075e4ca3fb5ab223fab61a92125bb2c797e2f5';
const readJson = async name => JSON.parse(await readFile(resolve(bundle, name), 'utf8'));

test('monthly Radar provenance pins all 30 UTC daily partitions and exact input bytes', async () => {
  const manifest = await readJson('source-manifest.json');
  assert.equal(manifest.publicationRevision, publication);
  assert.equal(manifest.generatorRevision, generator);
  assert.equal(manifest.inputs.length, 39);
  assert.equal(new Set(manifest.inputs.map(input => input.path)).size, 39);
  for (const input of manifest.inputs) {
    assert([publication, generator].includes(input.revision));
    assert.equal(input.url, `https://raw.githubusercontent.com/Hecavex/radar.hecavex.com/${input.revision}/${input.path}`);
    assert.match(input.sha256, /^[a-f0-9]{64}$/);
    assert(Number.isSafeInteger(input.bytes) && input.bytes > 0 && input.bytes <= 4 * 1024 * 1024);
  }
  for (let day = 1; day <= 30; day += 1) {
    assert(manifest.inputs.some(input => input.path === `data/history/daily/2026-09-${String(day).padStart(2, '0')}/events.ndjson`));
  }
  assert.deepEqual(manifest.observationWindow, {
    startInclusive: '2026-09-01T00:00:00.000Z', endExclusive: '2026-10-01T00:00:00.000Z'
  });
});

test('monthly aggregate keeps host, event, snapshot and collection populations distinct', async () => {
  const summary = await readJson('summary.json');
  const activity = summary.monthlyActivity;
  assert.equal(activity.uniqueObservedHosts, 447);
  assert.equal(activity.sumOfDailyUniqueHostsSignalDays, 508);
  assert.equal(activity.firstPublicationMarkedHosts, 437);
  assert.equal(activity.allEvents, 950);
  assert.equal(activity.observationEvents, 513);
  assert.equal(activity.publishedReobservationClassificationEvents, 63);
  assert.equal(activity.monthlyEvidenceTierDistributionAvailable, false);
  assert.equal(summary.separatePostMonthSnapshot.signals, 105);
  assert.equal(summary.separatePostMonthSnapshot.monthlyCohortOverlap, 103);
  assert.equal(summary.publicReviewMetricsAtRelease.precisionAvailable, false);
  assert.equal(summary.collection.days, 30);
  assert.equal(summary.collection.recordedAttempts, 2419);
  assert.equal(summary.collection.scheduledSlots, 2880);
  assert.equal(summary.collection.lowerListeningSeconds, 1160977.181);
  assert.equal(summary.collection.upperListeningSeconds, 1161090.024);
  assert(summary.collection.lowerListeningSeconds < summary.collection.upperListeningSeconds);
  assert(summary.collection.lowerWallClockPercent < summary.collection.plannedListeningCeilingPercent);
});

test('bundle documents the exact generated summary and aggregate CSV bytes', async () => {
  const readme = await readFile(resolve(bundle, 'README.md'), 'utf8');
  for (const name of ['summary.json', 'daily.csv', 'brands.csv']) {
    const bytes = await readFile(resolve(bundle, name));
    assert(readme.includes(createHash('sha256').update(bytes).digest('hex')), `${name}: documented SHA-256`);
  }
  const daily = (await readFile(resolve(bundle, 'daily.csv'), 'utf8')).trim().split(/\r?\n/);
  assert.equal(daily.length, 31);
  assert(daily[1].startsWith('2026-09-01,'));
  assert(daily.at(-1).startsWith('2026-09-30,'));
});

test('September articles share approved scope, actual publication and aggregate-only bundle', async () => {
  const names = {
    en: 'lithuania-phishing-infrastructure-radar-september-2026',
    lt: 'phishing-infrastruktura-lietuvoje-radar-2026-rugsejis'
  };
  const pair = [];
  for (const [lang, slug] of Object.entries(names)) {
    const source = await readFile(resolve(root, `src/content/posts/${lang}/research/technical-analyses/2026-10-04-${slug}.md`), 'utf8');
    const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    assert(match);
    const data = parse(match[1]);
    const body = match[2];
    pair.push(data);
    assert.equal(data.lang, lang);
    assert.equal(data.published, true);
    assert.equal(data.draft, false);
    assert.equal(data.publication_class, 'primary-research');
    assert.equal(data.translation_key, 'lithuania-phishing-infrastructure-radar-2026-09');
    assert.equal(data.research_version, '1.0');
    assert.equal(new Date(data.date).toISOString().slice(0, 10), '2026-10-04');
    assert.equal(data.last_reviewed_at, data.date);
    assert.equal(data.research_bundle, '/assets/data/radar-september-2026-baseline/README.md');
    for (const metric of ['447', '508', '437', '105', lang === 'lt' ? '53,33' : '53.33']) assert(body.includes(metric), `${lang}: ${metric}`);
    for (const artifact of ['README.md', 'summary.json', 'brands.csv']) assert(body.includes(`/assets/data/radar-september-2026-baseline/${artifact}`));
    assert.doesNotMatch(body, /^##\s+(?:Bottom line|Esmė|Apibendrinimas)\s*$/mi);
  }
  assert.equal(pair[0].date, pair[1].date);
});
