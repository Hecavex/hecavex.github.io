import { isApprovedPublication } from './publication-state.mjs';

const origin = 'https://hecavex.com';
export const citationFormats = Object.freeze(['bib', 'json']);

/** Keep citation dates equal to the publication's visible Vilnius date. */
export function citationDate(value) {
  const date = new Date(value);
  if (!Number.isFinite(date.valueOf())) throw new Error('Invalid publication date');
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Vilnius', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(date).map(part => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

/** Only approved public records receive export routes. No body/private fields. */
export function publicationRecord(post, translations = []) {
  const data = post.entry.data;
  if (!isApprovedPublication(data)) throw new Error('Citation requires an approved publication');
  if (data.author !== 'deividas-lis') throw new Error('Citation author must be explicitly mapped');
  if (!/^\/(en|lt)\/[a-z0-9-]+\/[a-z0-9-]+\/$/.test(post.url)) throw new Error('Invalid canonical publication path');
  if (!['en', 'lt'].includes(post.lang) || !post.url.startsWith(`/${post.lang}/`)) throw new Error('Citation language/path mismatch');
  return {
    id: new URL(post.url, origin).href,
    title: post.title,
    description: post.description,
    author: { given: 'Deividas', family: 'Lis', url: `${origin}/en/about/` },
    publisher: 'HECAVEX',
    language: post.lang,
    publicationClass: post.publicationClass,
    published: citationDate(post.date),
    modified: post.updated ? citationDate(post.updated) : null,
    researchId: data.research_id ?? null,
    researchVersion: data.research_version ?? null,
    researchStatus: data.research_status ?? null,
    substantiveReview: data.last_reviewed_at ? citationDate(data.last_reviewed_at) : null,
    translations: translations.filter(other => other.lang !== post.lang && other.translationKey === post.translationKey && isApprovedPublication(other.entry.data))
      .map(other => ({ language: other.lang, url: new URL(other.url, origin).href })),
    citation: {
      bibtex: `${origin}${citationPath(post, 'bib')}`,
      cslJson: `${origin}${citationPath(post, 'json')}`
    }
  };
}

export function citationPath(post, format) {
  if (!citationFormats.includes(format)) throw new Error('Unsupported citation format');
  if (!/^\/(en|lt)\/[a-z0-9-]+\/[a-z0-9-]+\/$/.test(post.url)) throw new Error('Invalid canonical publication path');
  return `/citations${post.url.slice(0, -1)}.${format}`;
}

export function citationNote(record) {
  return [
    `Publication class: ${record.publicationClass}`,
    record.researchId ? `Research record: ${record.researchId}` : null,
    record.researchVersion ? `Research version: ${record.researchVersion}` : null,
    record.researchStatus ? `Research status: ${record.researchStatus}` : null,
    record.modified ? `Page updated: ${record.modified}` : null,
    record.substantiveReview ? `Substantive review recorded: ${record.substantiveReview}` : 'Substantive review: not recorded',
    'Publication and update dates are not substitutes for an analyst-review date. Article and evidence-package versions may differ.'
  ].filter(Boolean).join('. ');
}

export function toCslJson(record) {
  return [{
    id: record.id,
    type: 'webpage',
    title: record.title,
    author: [{ given: record.author.given, family: record.author.family }],
    'container-title': record.publisher,
    publisher: record.publisher,
    language: record.language,
    URL: record.id,
    issued: { 'date-parts': [record.published.split('-').map(Number)] },
    abstract: record.description,
    note: citationNote(record)
  }];
}

/** Escape TeX syntax without rewriting Lithuanian or title capitalization. */
export function bibtexEscape(value) {
  const escapes = { '\\': '\\textbackslash{}', '{': '\\{', '}': '\\}', '%': '\\%', '&': '\\&', '_': '\\_', '#': '\\#', '$': '\\$', '~': '\\textasciitilde{}', '^': '\\textasciicircum{}' };
  return String(value).replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/[\\{}%&_#$~^]/g, character => escapes[character]);
}

export function toBibtex(record) {
  const key = `hecavex-${new URL(record.id).pathname.slice(1, -1).replaceAll('/', '-')}`;
  const fields = [
    ['author', 'Lis, Deividas'], ['title', record.title], ['howpublished', record.publisher],
    ['year', record.published.slice(0, 4)], ['date', record.published],
    ['url', record.id], ['language', record.language === 'lt' ? 'Lithuanian' : 'English'],
    ['note', citationNote(record)]
  ];
  return `@misc{${key},\n${fields.map(([name, value]) => `  ${name} = {${name === 'title' ? `{${bibtexEscape(value)}}` : bibtexEscape(value)}}`).join(',\n')}\n}\n`;
}
