import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { signalBriefEditions } from './signal-brief-editions.mjs';

// Deliberate release regression: new issues must be discoverable, translated,
// correctly dated and ordered across all public publication surfaces.
const root = resolve(process.argv[2] ?? 'dist');
const editions = [...signalBriefEditions].reverse();
const read = (path) => readFile(join(root, path.replace(/^\//, '')), 'utf8');
const sitemap = await read('sitemap.xml');
const catalogue = JSON.parse(await read('data/publications.json'));

for (const [lang, section] of [['en', 'briefings'], ['lt', 'apzvalgos']]) {
  const list = await read(`${lang}/${section}/index.html`);
  const home = await read(`${lang}/index.html`);
  const feed = await read(`${lang}/${section}/feed.xml`);
  const allFeed = await read(`${lang}/feed.xml`);
  const search = JSON.parse(await read(`${lang}/search.json`));
  const archive = await read(`${lang}/${lang === 'en' ? 'archive' : 'archyvas'}/index.html`);
  const paths = editions.map(edition => `/${lang}/${section}/${edition.end}/`);
  for (const [label, source] of [['briefing list', list], ['briefing feed', feed], ['general feed', allFeed]]) {
    const positions = paths.map(path => source.indexOf(path));
    assert(positions.every(position => position >= 0), `${lang}: missing issue in ${label}`);
    assert(positions.every((position, index) => index === 0 || positions[index - 1] < position), `${lang}: newest-to-oldest issue order in ${label}`);
  }
  // Follow the current feed lead so a future issue can legitimately lead discovery.
  const latestEntry = feed.match(/<entry>[\s\S]*?<id>([^<]+)<\/id>/)?.[1];
  assert(latestEntry, `${lang}: latest briefing feed entry`);
  assert(home.includes(`href="${new URL(latestEntry).pathname}"`), `${lang}: home must link the latest briefing`);
  for (const [index, path] of paths.entries()) {
    const edition = editions[index];
    const publicationDate = edition.published.slice(0, 10);
    for (const [label, xml] of [['briefing feed', feed], ['general feed', allFeed]]) {
      const entry = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)]
        .find(([, content]) => content.includes(`<id>https://hecavex.com${path}</id>`))?.[1];
      assert(entry?.includes(`<published>${edition.published}</published>`), `${path}: actual publication timestamp in ${label}`);
    }
    assert(search.some(record => record.url === path), `${path}: search discovery`);
    assert(archive.includes(path), `${path}: archive discovery`);
    assert(sitemap.includes(`<loc>https://hecavex.com${path}</loc>`), `${path}: sitemap discovery`);
    const record = catalogue.publications.find(record => record.id === `https://hecavex.com${path}`);
    assert(record, `${path}: publication catalogue`);
    assert.equal(record.published, publicationDate, `${path}: real publication date`);
    assert.equal(record.translations.length, 1, `${path}: translated catalogue record`);
    const html = await read(`${path}index.html`);
    assert(html.includes(`href="https://hecavex.com${path}"`), `${path}: canonical URL`);
    const other = path.replace(`/${lang}/${section}/`, lang === 'en' ? '/lt/apzvalgos/' : '/en/briefings/');
    assert(html.includes(`href="https://hecavex.com${other}"`), `${path}: alternate edition`);
    assert.equal((html.match(/class="hx-signal-entry hx-signal-entry--/g) ?? []).length, edition.counts.reduce((sum, count) => sum + count, 0));
    const briefRecord = html.match(/<aside class="brief-record">([\s\S]*?)<\/aside>/)?.[1];
    assert(briefRecord?.includes(`${edition.start} — ${edition.end}`), `${path}: coverage window in the visible briefing record`);
    if (!edition.cutoff.endsWith('T23:59:59.000Z')) {
      assert(html.includes(`${edition.cutoff.slice(11, 16)} UTC`), `${path}: visible partial-day cutoff`);
    }
    assert.doesNotMatch(html, /<h2[^>]*>\s*(?:Bottom line|Esmė)\s*<\/h2>/i);
    const number = String(edition.issue).padStart(3, '0');
    const image = await readFile(join(root, `assets/img/social/hecavex-signal-brief-${number}-${lang}.png`));
    assert.equal(image.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', `${path}: social PNG`);
    const citation = JSON.parse(await read(`citations${path.slice(0, -1)}.json`));
    assert.deepEqual(citation[0].issued['date-parts'], [publicationDate.split('-').map(Number)], `${path}: citation date is not its coverage end`);
  }
}
console.log(`Signal Brief editions passed: ${editions.length * 2} articles, EN/LT ordering, home, feeds, search, archive, sitemap, citations, catalogue and social images.`);
