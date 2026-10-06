import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { assessAsset, csvCell, parseVersion, recordsCsv } from '../public/assets/data/signal-brief-005-decisions/consumer.mjs';
import { exerciseOuterTimes, rehearse } from '../public/assets/data/cra-reporting-rehearsal/rehearsal.mjs';
import { build } from './build-decision-packs.mjs';

const base = new URL('../public/assets/data/', import.meta.url);
const json = async path => JSON.parse(await readFile(new URL(path, base), 'utf8'));
const bundle = await json('signal-brief-005-decisions/records.json');
const worked = await json('signal-brief-005-decisions/worked-decisions.json');
const scenario = await json('cra-reporting-rehearsal/scenario.json');
const [gitea, cloud] = bundle.records;
const asset = (product, version) => ({ asset: 'fixture.example.invalid', product, version });

test('version comparison is numeric, bounded and conservative about unknowns', () => {
  assert.deepEqual(parseVersion('10.10.0'), [10, 10, 0]);
  for (const value of [null, '', '1.2', 'v1.2.3', '1.2.3-rc1', '01.2.3', '999999999999999999999.2.3']) assert.equal(parseVersion(value), null);
  assert.equal(assessAsset(cloud, asset('ownCloud Server', '10.10.0')).applicability, 'inside-cited-version-range');
  assert.equal(assessAsset(cloud, asset('ownCloud Server', '10.13.0')).applicability, 'inside-cited-version-range');
  assert.equal(assessAsset(gitea, asset('Gitea', '1.27.1')).applicability, 'outside-cited-version-range-not-a-safety-verdict');
  assert.equal(assessAsset(gitea, asset('Gitea', '1.27.1-rc1')).applicability, 'unknown-version');
  assert.equal(assessAsset(gitea, asset('Different product', '1.27.0')).applicability, 'unknown-product');
  assert.equal(assessAsset(cloud, asset('ownCloud Infinite Scale', '10.10.0')).applicability, 'excluded-product-in-cited-vendor-notice');
});

test('dated sources and fictional decisions never become compromise verdicts', () => {
  assert.equal(bundle.records.length, 2);
  const sourceIds = bundle.sources.map(source => source.id);
  assert.equal(new Set(sourceIds).size, sourceIds.length);
  for (const record of bundle.records) {
    for (const id of record.sourceIds) assert.ok(sourceIds.includes(id));
    assert.equal(record.epss.probability, null);
    assert.equal(record.epss.state, 'not-collected');
    assert.equal(record.kev.checkedAt, bundle.sourceCutoff);
    assert.ok(record.kev.dateAdded <= record.kev.checkedAt);
  }
  assert.equal(worked.fictional, true);
  assert.equal(worked.notProductionInventory, true);
  assert.equal(worked.decisions.length, 3);
  for (const decision of worked.decisions) {
    const result = assessAsset(bundle.records.find(record => record.id === decision.cve), decision);
    assert.equal(result.compromiseState, 'unknown');
    assert.equal(result.localAssessmentRequired, true);
    assert.match(decision.asset, /\.example\.invalid$/);
  }
});

test('CSV protects spreadsheet cells and preserves source URLs', () => {
  for (const value of ['=SUM(A1)', ' +1', '-1', '@x', '\tvalue', '\nvalue']) assert.ok(csvCell(value).startsWith('"\''));
  assert.equal(csvCell('a,"b"'), '"a,""b"""');
  const csv = recordsCsv(bundle);
  assert.match(csv, /CVE-2026-60004/);
  assert.match(csv, /GHSA-rcr6-4jqh-j84m/);
  const invalid = structuredClone(bundle);
  invalid.records[0].sourceIds.push('missing-source');
  assert.throws(() => recordsCsv(invalid), /Unknown source/);
});

test('CRA exercise preserves distinct awareness, notification and corrective-measure anchors', () => {
  for (const record of scenario.cases) assert.deepEqual(exerciseOuterTimes(record), record.exerciseExpected);
  const changedWarning = { ...scenario.cases[0], earlyWarningSubmittedAt: '2026-09-15T09:00:00Z' };
  assert.deepEqual(exerciseOuterTimes(changedWarning), scenario.cases[0].exerciseExpected);
  const changedNotification = { ...scenario.cases[1], notificationSubmittedAt: '2026-09-17T10:00:00Z' };
  assert.equal(exerciseOuterTimes(changedNotification).finalReportNoLaterThan, '2026-10-17T10:00:00.000Z');
  assert.equal(rehearse(scenario).length, 2);
  assert.throws(() => rehearse({ ...scenario, fictional: false }), /fictional/);
});

test('CRA arithmetic rejects invalid dates and uncertain month-end rules; absent trigger stays null', () => {
  const record = scenario.cases[0];
  for (const value of ['2026-09-14', '2026-02-30T10:00:00Z', 'not-a-date', '2026-09-14T10:00:00+02:00']) assert.throws(() => exerciseOuterTimes({ ...record, awarenessAt: value }));
  assert.throws(() => exerciseOuterTimes({ ...record, kind: 'automatic-report' }), /Unknown/);
  assert.throws(() => exerciseOuterTimes({ ...record, notificationSubmittedAt: '2026-09-13T10:00:00Z' }), /precedes/);
  assert.equal(exerciseOuterTimes({ ...record, correctiveMeasureAvailableAt: null }).finalReportNoLaterThan, null);
  assert.equal(exerciseOuterTimes({ ...scenario.cases[1], notificationSubmittedAt: null }).finalReportNoLaterThan, null);
  assert.throws(() => exerciseOuterTimes({ ...scenario.cases[1], awarenessAt: '2026-01-31T08:00:00Z', notificationSubmittedAt: '2026-01-31T09:00:00Z' }), /Month-end/);
});

test('offline command-line demonstrations execute with their shipped fixtures', () => {
  for (const path of ['signal-brief-005-decisions/consumer.mjs', 'cra-reporting-rehearsal/rehearsal.mjs']) {
    const result = JSON.parse(execFileSync(process.execPath, [fileURLToPath(new URL(path, base))], { encoding: 'utf8', timeout: 10000 }));
    assert.ok(result.release);
  }
});

test('published CSV and SHA-256 manifests match every shipped fixture byte', async () => {
  await build({ check: true });
});
