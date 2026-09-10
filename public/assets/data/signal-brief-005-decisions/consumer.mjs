/** Offline applicability aid, not a scanner, risk score or vulnerability verdict. */
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

export function parseVersion(value) {
  if (typeof value !== 'string' || !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(value)) return null;
  const parts = value.split('.').map(Number);
  return parts.every(Number.isSafeInteger) ? parts : null;
}
function compare(a, b) {
  for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
  return 0;
}
export function assessAsset(record, asset) {
  const boundary = { cve: record.id, asset: asset.asset, localAssessmentRequired: true, compromiseState: 'unknown' };
  if (record.excludedProducts.includes(asset.product)) return { ...boundary, applicability: 'excluded-product-in-cited-vendor-notice' };
  if (record.product !== asset.product) return { ...boundary, applicability: 'unknown-product' };
  const version = parseVersion(asset.version);
  if (!version) return { ...boundary, applicability: 'unknown-version' };
  const minimum = parseVersion(record.citedRange.minimum);
  const maximum = parseVersion(record.citedRange.maximum);
  if (!minimum || !maximum) throw new Error('Invalid cited range');
  const lower = compare(version, minimum);
  const upper = compare(version, maximum);
  const inRange = lower >= 0 && (upper < 0 || (upper === 0 && record.citedRange.maximumInclusive));
  return { ...boundary, applicability: inRange ? 'inside-cited-version-range' : 'outside-cited-version-range-not-a-safety-verdict' };
}
export function csvCell(value) {
  let text = value === null || value === undefined ? '' : String(value);
  if (/^[\s]*[=+@-]/.test(text) || /^[\t\r\n]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}
export function recordsCsv(bundle) {
  const columns = ['cve', 'product', 'affected_version_statement', 'historical_remediation', 'kev_state', 'kev_added', 'kev_checked', 'epss_state', 'epss_probability', 'epss_date', 'source_urls', 'prerequisites', 'local_assessment_required', 'information_cutoff'];
  const rows = bundle.records.map(record => [record.id, record.product, record.affectedVersionStatement,
    record.historicalFixedVersion, record.kev.state, record.kev.dateAdded, record.kev.checkedAt,
    record.epss.state, record.epss.probability, record.epss.scoreDate,
    record.sourceIds.map(id => bundle.sources.find(source => source.id === id)?.url ?? (() => { throw new Error(`Unknown source ${id}`); })()).join(' | '),
    record.prerequisites.join(' | '), true, bundle.sourceCutoff]);
  return [columns, ...rows].map(row => row.map(csvCell).join(',')).join('\n') + '\n';
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const bundle = JSON.parse(await readFile(new URL('records.json', import.meta.url), 'utf8'));
  const examples = JSON.parse(await readFile(new URL('worked-decisions.json', import.meta.url), 'utf8'));
  if (!examples.fictional) throw new Error('This demonstration accepts the fictional fixture only');
  console.log(JSON.stringify({ fictional: true, release: bundle.release, evaluations: examples.decisions.map(asset => {
    const record = bundle.records.find(item => item.id === asset.cve);
    if (!record) throw new Error(`Unknown fixture CVE ${asset.cve}`);
    return assessAsset(record, asset);
  }) }, null, 2));
}
