import assert from 'node:assert/strict';
import test from 'node:test';
import { bibtexEscape, citationDate, citationPath, publicationRecord, toBibtex, toCslJson } from '../src/lib/publication-citations.mjs';

const fixture = () => ({
  title: 'CTI & OSINT: ką rodo įrodymai?', description: 'A bounded, source-backed assessment.',
  url: '/lt/tyrimai/example/', lang: 'lt', translationKey: 'example', publicationClass: 'technical-assessment',
  date: new Date('2024-11-10T22:30:00Z'), updated: new Date('2026-09-07T00:00:00Z'),
  entry: { data: { author: 'deividas-lis', draft: false, published: true, research_version: '1.2', research_status: 'updated' } }
});

test('citations preserve original local publication date, author, language and version boundaries', () => {
  const post = fixture();
  const record = publicationRecord(post);
  assert.equal(record.published, '2024-11-11');
  assert.equal(record.modified, '2026-09-07');
  assert.equal(record.researchVersion, '1.2');
  assert.equal(record.researchId, null);
  assert.equal(record.substantiveReview, null);
  const [csl] = toCslJson(record);
  assert.deepEqual(csl.author, [{ given: 'Deividas', family: 'Lis' }]);
  assert.deepEqual(csl.issued, { 'date-parts': [[2024, 11, 11]] });
  assert.equal(csl.type, 'webpage');
  assert.equal(csl.title, post.title);
  assert.equal(csl.language, 'lt');
  assert.match(csl.note, /Research version: 1.2/);
  assert.match(csl.note, /Substantive review: not recorded/);
  assert(!Object.hasOwn(csl, 'DOI'));
  assert(!Object.hasOwn(csl, 'accessed'));
});

test('publication approval and author mapping fail closed', () => {
  for (const approval of [{ draft: true }, { published: false }, { published: undefined }, { draft: undefined }]) {
    const post = fixture(); Object.assign(post.entry.data, approval);
    assert.throws(() => publicationRecord(post), /approved/);
  }
  const post = fixture(); post.entry.data.author = 'unmapped-author';
  assert.throws(() => publicationRecord(post), /author/);
});

test('unsupported paths, formats and invalid dates do not create export routes', () => {
  for (const url of ['//example.test/', '/en/research/../private/', '/en/research/x/?secret=1', '/en/research/<script>/']) {
    assert.throws(() => citationPath({ url }, 'bib'), /path/);
  }
  assert.throws(() => citationPath(fixture(), 'html'), /format/);
  assert.throws(() => citationDate('not-a-date'), /date/);
  assert.throws(() => publicationRecord({ ...fixture(), lang: 'en' }), /mismatch/);
});

test('exports select known metadata only and do not promote updates to review dates', () => {
  const post = fixture();
  post.entry.body = 'PRIVATE BODY MUST NOT LEAK';
  post.entry.data.private_notes = 'PRIVATE NOTES MUST NOT LEAK';
  post.entry.data.last_reviewed_at = new Date('2026-09-01');
  const record = publicationRecord(post);
  assert.equal(record.substantiveReview, '2026-09-01');
  assert(!JSON.stringify(record).includes('PRIVATE'));
  const unknown = fixture(); delete unknown.entry.data.research_version; delete unknown.entry.data.research_status;
  assert.equal(publicationRecord(unknown).researchVersion, null);
  assert.equal(publicationRecord(unknown).researchStatus, null);
});

test('only approved counterparts with the same translation key are linked', () => {
  const lt = fixture();
  const en = { ...fixture(), lang: 'en', url: '/en/research/example/' };
  const withheld = { ...en, entry: { data: { ...en.entry.data, draft: true } } };
  const unrelated = { ...en, translationKey: 'different' };
  assert.deepEqual(publicationRecord(lt, [lt, en, withheld, unrelated]).translations, [{ language: 'en', url: 'https://hecavex.com/en/research/example/' }]);
});

test('BibTeX escapes control syntax once and preserves Unicode/title case', () => {
  assert.equal(bibtexEscape('a{b}%_&#$~^\\c\nĄ'), 'a\\{b\\}\\%\\_\\&\\#\\$\\textasciitilde{}\\textasciicircum{}\\textbackslash{}c Ą');
  const post = fixture(); post.title = 'CTI }\n@misc{injected, title={X}} \\input{secret}';
  const bib = toBibtex(publicationRecord(post));
  assert.equal((bib.match(/^@misc\{/gm) ?? []).length, 1);
  assert(!bib.includes('\\input{secret}'));
  assert(bib.startsWith('@misc{hecavex-lt-tyrimai-example,'));
  assert(bib.includes('year = {2024}'));
  assert(bib.includes('language = {Lithuanian}'));
  assert(toBibtex(publicationRecord(fixture())).includes('ką rodo įrodymai?'));
});
