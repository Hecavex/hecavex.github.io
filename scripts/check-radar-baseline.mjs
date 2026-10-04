import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { parse } from 'yaml';
import { citationDate } from '../src/lib/publication-citations.mjs';

// Frozen September research must remain discoverable and its evidence must be
// copied without alteration. This gate is offline: replay.py owns input retrieval.
const projectRoot = resolve(import.meta.dirname, '..');
const root = resolve(process.argv[2] ?? join(projectRoot, 'dist'));
const origin = 'https://hecavex.com';
const key = 'lithuania-phishing-infrastructure-radar-2026-09';
const bundlePath = '/assets/data/radar-september-2026-baseline';
const bundleFiles = [
  'README.md', 'summary.json', 'daily.csv', 'brands.csv',
  'source-manifest.json', 'replay.py', 'replay_test.py', 'LICENSE-CODE.txt'
];
const editions = [
  { lang: 'en', section: 'research', slug: 'lithuania-phishing-infrastructure-radar-september-2026' },
  { lang: 'lt', section: 'tyrimai', slug: 'phishing-infrastruktura-lietuvoje-radar-2026-rugsejis' }
].map(edition => ({
  ...edition,
  path: `/${edition.lang}/${edition.section}/${edition.slug}/`,
  source: `src/content/posts/${edition.lang}/research/technical-analyses/2026-10-04-${edition.slug}.md`
}));
const read = path => readFile(join(root, path.replace(/^\//, '')), 'utf8');
const readJson = async path => JSON.parse(await read(path));

// Read semantic attributes rather than depending on attribute order, minifier
// whitespace, classes, translated labels or a particular typographic treatment.
function attributes(source) {
  return Object.fromEntries([...source.matchAll(/([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)]
    .map(([, name, doubleQuoted, singleQuoted, unquoted]) => [name.toLowerCase(), doubleQuoted ?? singleQuoted ?? unquoted]));
}

function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b([^>]*)>`, 'gi'))].map(([, source]) => attributes(source));
}

function hasLink(html, path) {
  return tags(html, 'a').some(({ href }) => {
    if (!href) return false;
    try {
      const url = new URL(href, origin);
      return url.origin === origin && url.pathname === path;
    } catch { return false; }
  });
}

function structuredNodes(html) {
  return [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter(([, attrs]) => attributes(attrs).type === 'application/ld+json')
    .flatMap(([, , content]) => {
      const data = JSON.parse(content);
      return data['@graph'] ?? (Array.isArray(data) ? data : [data]);
    });
}

async function checkEvidence() {
  const sourceDirectory = join(projectRoot, 'public', bundlePath.slice(1));
  const outputDirectory = join(root, bundlePath.slice(1));
  for (const directory of [sourceDirectory, outputDirectory]) {
    const entries = await readdir(directory, { withFileTypes: true });
    assert(entries.every(entry => entry.isFile()), `${directory}: unexpected evidence subdirectory`);
    assert.deepEqual(entries.map(entry => entry.name).sort(), [...bundleFiles].sort(), `${directory}: exact aggregate-only file inventory`);
  }
  for (const name of bundleFiles) {
    const [source, output] = await Promise.all([
      readFile(join(sourceDirectory, name)), readFile(join(outputDirectory, name))
    ]);
    assert(source.length > 0, `${name}: evidence file is empty`);
    assert(source.equals(output), `${name}: built evidence differs from reviewed source bytes`);
  }

  const summary = await readJson(`${bundlePath}/summary.json`);
  const manifest = await readJson(`${bundlePath}/source-manifest.json`);
  assert.equal(summary.schemaVersion, 1, 'Monthly summary schema');
  assert.equal(summary.dataset, 'radar-september-2026-baseline', 'Monthly dataset identity');
  assert.equal(summary.version, '1.0', 'Frozen aggregate version');
  assert.deepEqual(summary.observationWindow, {
    startInclusive: '2026-09-01T00:00:00.000Z', endExclusive: '2026-10-01T00:00:00.000Z'
  }, 'Monthly observation window, not publication time');
  assert.equal(summary.releaseGeneratedAt, '2026-10-01T00:40:26.566Z', 'Frozen post-month source boundary');
  assert.equal(summary.publicationRevision, '3d80a765404f50afbe50c3dc49472751a2e13b65', 'Immutable data revision');
  assert.equal(summary.generatorRevision, '33075e4ca3fb5ab223fab61a92125bb2c797e2f5', 'Immutable generator revision');
  assert.equal(summary.inputDataRevision, 'e703afd425b4e0c74aac9f19efdc9d7b9dcbcae9', 'Declared input-data revision');
  assert.equal(summary.countingMethodVersion, 2, 'Discovery method');
  assert.equal(summary.coverageBoundsMethodVersion, 2, 'Coverage method');
  for (const field of ['version', 'observationWindow', 'releaseGeneratedAt', 'publicationRevision', 'generatorRevision', 'inputDataRevision']) {
    assert.deepEqual(manifest[field], summary[field], `Source manifest/summary agreement: ${field}`);
  }
  assert.equal(manifest.schemaVersion, 1, 'Input manifest schema');
  assert.equal(manifest.dataset, 'radar-september-2026-baseline-inputs', 'Input manifest identity');
  assert.equal(manifest.inputs.length, 39, 'Complete pinned input inventory');
  assert.equal(summary.inputFiles, manifest.inputs.length, 'Declared input count');
  assert.equal(new Set(manifest.inputs.map(input => `${input.revision}/${input.path}`)).size, 39, 'Unique pinned inputs');
  for (const input of manifest.inputs) {
    assert([summary.publicationRevision, summary.generatorRevision].includes(input.revision), `Unexpected input revision: ${input.path}`);
    assert(input.path && !input.path.split('/').includes('..'), 'Input path must not escape its pinned repository');
    assert.equal(input.url, `https://raw.githubusercontent.com/Hecavex/radar.hecavex.com/${input.revision}/${input.path}`, 'Immutable official input URL');
    assert(Number.isSafeInteger(input.bytes) && input.bytes > 0, `Input byte length: ${input.path}`);
    assert.match(input.sha256, /^[a-f0-9]{64}$/, `Input digest: ${input.path}`);
  }
  const activity = summary.monthlyActivity;
  assert.deepEqual([
    activity.uniqueObservedHosts, activity.firstPublicationMarkedHosts, activity.observationEvents,
    activity.firstPublicationMarkedEvents, activity.allEvents, activity.sumOfDailyUniqueHostsSignalDays
  ], [447, 437, 513, 437, 950, 508], 'Monthly candidates, event records and signal-days remain distinct');
  assert.equal(activity.monthlyEvidenceTierDistributionAvailable, false, 'Do not manufacture historical evidence tiers');
  assert.equal(summary.collection.recordedAttempts, 2419, 'Recorded collection attempts');
  assert.equal(summary.collection.scheduledSlots, 2880, 'Planned collection denominator');
  assert.equal(summary.collection.lowerListeningSeconds, 1160977.181, 'Published lower listening bound');
  assert.equal(summary.collection.upperListeningSeconds, 1161090.024, 'Published upper listening bound');
  assert.equal(summary.separatePostMonthSnapshot.signals, 105, 'Snapshot is not the monthly cohort');
  assert.equal(summary.separatePostMonthSnapshot.monthlyCohortOverlap, 103, 'Snapshot/month intersection');
  assert.equal(summary.publicReviewMetricsAtRelease.assessments, 0, 'Exported review denominator');
  assert.equal(summary.publicReviewMetricsAtRelease.precisionAvailable, false, 'No unsupported precision estimate');
}

await checkEvidence();
const [sitemap, gateway, llms, catalogue] = await Promise.all([
  read('/sitemap.xml'), read('/index.html'), read('/llms.txt'), readJson('/data/publications.json')
]);
assert.equal(catalogue.schemaVersion, 1, 'Publication metadata schema');
assert(llms.includes(`${origin}${bundlePath}/README.md`), 'LLM directory: evidence bundle discovery');
const sourceDates = [];

for (const edition of editions) {
  const { lang, section, path, source } = edition;
  const other = editions.find(candidate => candidate.lang !== lang);
  const markdown = await readFile(join(projectRoot, source), 'utf8');
  const frontmatter = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  assert(frontmatter, `${path}: source frontmatter`);
  const data = parse(frontmatter[1]);
  assert.equal(data.translation_key, key, `${path}: stable bilingual identity`);
  assert.equal(data.permalink, path, `${path}: explicit canonical source route`);
  assert.equal(data.lang, lang, `${path}: source language`);
  assert.equal(data.content_type, 'technical-analysis', `${path}: content type`);
  assert.equal(data.publication_class, 'primary-research', `${path}: research classification`);
  assert.equal(data.draft, false, `${path}: explicit draft clearance`);
  assert.equal(data.published, true, `${path}: explicit publication approval`);
  assert.equal(data.research_bundle, `${bundlePath}/README.md`, `${path}: source evidence link`);
  assert(data.research_version && data.last_reviewed_at, `${path}: recorded version and substantive review`);
  const publicationTimestamp = new Date(data.date).toISOString();
  const publicationDate = citationDate(data.date);
  assert.equal(publicationDate, '2026-10-04', `${path}: actual retrospective publication date`);
  sourceDates.push(publicationTimestamp);

  const [html, home, research, feed, search, dataPage] = await Promise.all([
    read(`${path}index.html`), read(`/${lang}/index.html`), read(`/${lang}/${section}/index.html`),
    read(`/${lang}/feed.xml`), readJson(`/${lang}/search.json`),
    read(lang === 'en' ? '/data/index.html' : '/lt/duomenys/index.html')
  ]);
  assert.equal(tags(html, 'html')[0]?.lang, lang, `${path}: HTML language`);
  const links = tags(html, 'link');
  assert.equal(links.filter(link => link.rel === 'canonical').length, 1, `${path}: exactly one canonical`);
  assert(links.some(link => link.rel === 'canonical' && link.href === origin + path), `${path}: canonical URL`);
  assert(links.some(link => link.rel === 'alternate' && link.hreflang === other.lang && link.href === origin + other.path), `${path}: alternate-language metadata`);
  assert(hasLink(html, other.path), `${path}: visible counterpart link`);
  for (const file of ['README.md', 'summary.json', 'brands.csv']) {
    assert(hasLink(html, `${bundlePath}/${file}`), `${path}: claim-bearing bundle link ${file}`);
  }
  assert(hasLink(research, path), `${path}: research-index discovery`);
  assert(sitemap.includes(`<loc>${origin}${path}</loc>`), `${path}: sitemap discovery`);
  assert(llms.includes(origin + path), `${path}: LLM directory discovery`);
  for (const file of ['README.md', 'summary.json']) {
    assert(hasLink(dataPage, `${bundlePath}/${file}`), `${lang}: data-catalogue link ${file}`);
  }
  const searchMatches = search.filter(record => record.url === path);
  assert.equal(searchMatches.length, 1, `${path}: exactly one search entry`);
  assert.equal(searchMatches[0].date, publicationTimestamp, `${path}: search publication timestamp`);
  assert.equal(searchMatches[0].title, data.title, `${path}: search title`);
  const records = catalogue.publications.filter(record => record.id === origin + path);
  assert.equal(records.length, 1, `${path}: exactly one publication catalogue entry`);
  const record = records[0];
  assert.equal(record.language, lang, `${path}: catalogue language`);
  assert.equal(record.publicationClass, 'primary-research', `${path}: catalogue classification`);
  assert.equal(record.published, publicationDate, `${path}: catalogue publication date`);
  assert.equal(record.researchVersion, data.research_version, `${path}: article version`);
  assert.equal(record.substantiveReview, citationDate(data.last_reviewed_at), `${path}: explicit review date`);
  assert.deepEqual(record.translations, [{ language: other.lang, url: origin + other.path }], `${path}: catalogue counterpart`);

  // September belongs on home while it is among the five latest research posts.
  // A future legitimate publication must be able to replace it in the lead slot.
  const researchIds = new Set(catalogue.publications
    .filter(item => item.language === lang && ['primary-research', 'technical-assessment'].includes(item.publicationClass))
    .map(item => new URL(item.id).pathname));
  const latestResearch = search.filter(item => researchIds.has(item.url));
  assert(latestResearch.length > 0, `${lang}: available research discovery`);
  for (const latest of latestResearch.slice(0, 5)) {
    assert(hasLink(home, latest.url), `${lang}: home discovery for ${latest.url}`);
  }
  if (latestResearch[0].url === path) {
    assert(hasLink(gateway, path) && hasLink(gateway, other.path), 'Root gateway: latest baseline and both editions');
  }

  const entries = [...feed.matchAll(/<entry>([\s\S]*?)<\/entry>/g)]
    .map(([, entry]) => entry).filter(entry => entry.includes(`<id>${origin}${path}</id>`));
  assert.equal(entries.length, 1, `${path}: exactly one general-feed entry`);
  assert(entries[0].includes(`<published>${publicationTimestamp}</published>`), `${path}: feed publication time is not its coverage endpoint`);
  const article = structuredNodes(html).find(node => node['@type'] === 'Article' && node.url === origin + path);
  assert(article, `${path}: structured Article record`);
  assert.equal(article.inLanguage, lang, `${path}: structured language`);
  assert.equal(article.datePublished, publicationTimestamp, `${path}: structured publication timestamp`);
  const socialPath = `/assets/img/social/${key}-${lang}.png`;
  assert(tags(html, 'meta').some(meta => meta.property === 'og:image' && meta.content === origin + socialPath), `${path}: localized social image`);
  const social = await readFile(join(root, socialPath.slice(1)));
  assert.equal(social.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', `${path}: social PNG signature`);
  assert.equal(social.readUInt32BE(16), 1200, `${path}: social width`);
  assert.equal(social.readUInt32BE(20), 630, `${path}: social height`);
}
assert.equal(new Set(sourceDates).size, 1, 'September editions share the real publication timestamp');
console.log('Radar September baseline passed: EN/LT articles, canonical/translation metadata, home/research/feed/search/sitemap/data/LLM discovery, structured chronology and eight byte-identical evidence files.');
