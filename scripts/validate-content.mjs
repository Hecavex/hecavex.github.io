#!/usr/bin/env node

import { access, readFile, readdir } from 'node:fs/promises';
import { extname, join, relative, resolve } from 'node:path';
import { parse } from 'yaml';

const root = resolve(import.meta.dirname, '..');
const postsRoot = join(root, 'src', 'content', 'posts');
const publicRoot = join(root, 'public');
const allowedLanguages = new Set(['en', 'lt']);
const allowedCategories = new Set(['threat-intelligence', 'investigations', 'fraud-scams', 'osint', 'malware', 'social-engineering', 'ai-security', 'information-operations', 'tradecraft', 'commentary', 'identity-security', 'data-breaches', 'security-briefings']);
const allowedTypes = new Set(['investigation', 'malware-analysis', 'incident-analysis', 'technical-analysis', 'technical-guide', 'commentary', 'threat-note', 'signal-brief']);
const evidenceTypes = new Set(['investigation', 'malware-analysis', 'incident-analysis', 'technical-analysis', 'technical-guide']);

async function walk(directory) {
  const output = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) output.push(...await walk(path));
    else output.push(path);
  }
  return output;
}

function frontMatter(source, file, errors) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) {
    errors.push(`${file}: missing YAML front matter`);
    return {};
  }
  try {
    return parse(match[1]) ?? {};
  } catch (error) {
    errors.push(`${file}: invalid YAML (${error.message})`);
    return {};
  }
}

async function exists(path) {
  try { await access(path); return true; } catch { return false; }
}

export async function validate() {
  const errors = [];
  const warnings = [];
  const keys = new Map();
  const files = (await walk(postsRoot)).filter((path) => ['.md', '.markdown'].includes(extname(path))).sort();

  if (files.length !== 42) errors.push(`expected exactly 42 canonical Markdown posts, found ${files.length}`);

  for (const absolute of files) {
    const file = relative(root, absolute).replaceAll('\\', '/');
    const source = await readFile(absolute, 'utf8');
    const data = frontMatter(source, file, errors);
    if (data.draft === true) {
      if (data.published !== false) errors.push(`${file}: draft posts must also set published: false`);
      continue;
    }
    if (!allowedLanguages.has(data.lang)) errors.push(`${file}: lang must be en or lt`);
    for (const field of ['title', 'description', 'translation_key']) if (!String(data[field] ?? '').trim()) errors.push(`${file}: missing ${field}`);
    if (!allowedTypes.has(String(data.content_type))) errors.push(`${file}: missing or invalid content_type`);
    if (evidenceTypes.has(data.content_type)) {
      for (const field of ['key_findings', 'scope', 'limitations']) if (!data[field] || (Array.isArray(data[field]) && !data[field].length)) errors.push(`${file}: evidence-bearing publication missing ${field}`);
    }
    const pair = `${data.translation_key}:${data.lang}`;
    if (keys.has(pair)) errors.push(`${file}: duplicate translation_key ${data.translation_key} for ${data.lang}`);
    keys.set(pair, file);
    for (const category of data.categories ?? []) if (!allowedCategories.has(category)) errors.push(`${file}: invalid category ${category}`);
    if (data.image && typeof data.image === 'object' && data.image.path && !String(data.image.alt ?? '').trim()) errors.push(`${file}: configured image requires alt text`);
    const social = `/assets/img/social/${data.translation_key}-${data.lang}.png`;
    if (!(await exists(join(publicRoot, social.slice(1))))) errors.push(`${file}: missing generated social card ${social}`);
    if (data.image && typeof data.image === 'object' && extname(String(data.image.path)).toLowerCase() === '.svg' && data.image.social !== social) errors.push(`${file}: SVG hero must declare PNG social metadata ${social}`);
    if (data.mermaid || /^```mermaid\s*$/m.test(source)) errors.push(`${file}: Mermaid runtime is unsupported; use a local static SVG`);
    if (data.math) errors.push(`${file}: mathematics runtime flags are unsupported; publish static accessible notation`);
    if (data.lang === 'lt' && String(data.permalink ?? '').startsWith('/lt/research/')) errors.push(`${file}: Lithuanian canonical URLs must use /lt/tyrimai/`);
    for (const redirect of data.redirect_from ?? []) if (!String(redirect).startsWith('/') || String(redirect).startsWith('//')) errors.push(`${file}: redirect_from must contain internal absolute paths`);
    if (data.content_type === 'signal-brief') {
      for (const field of ['series', 'issue', 'coverage_start', 'coverage_end', 'information_cutoff']) if (data[field] === undefined || data[field] === null || data[field] === '') errors.push(`${file}: signal brief missing ${field}`);
      if (!(data.categories ?? []).includes('security-briefings')) errors.push(`${file}: signal brief must use security-briefings category`);
    }
    if (/\{%|\{\{\s*(?:site|page|post)\./.test(source)) errors.push(`${file}: contains unrendered template syntax`);
  }

  for (const key of new Set([...keys.keys()].map((value) => value.split(':')[0]))) {
    const languages = ['en', 'lt'].filter((lang) => keys.has(`${key}:${lang}`));
    if (languages.length === 1) warnings.push(`${key}: translation available only in ${languages[0]}`);
  }

  for (const diagram of [
    'assets/img/posts/2026-08-02-cra-article-14/cra-article-14-decision-tree-en.svg',
    'assets/img/posts/2026-08-02-cra-article-14/cra-article-14-decision-tree-lt.svg'
  ]) {
    const path = join(publicRoot, diagram);
    if (!(await exists(path))) errors.push(`${diagram}: static CRA decision tree is missing`);
    else {
      const svg = await readFile(path, 'utf8');
      if (!/<title\b[^>]*>.+?<\/title>/s.test(svg)) errors.push(`${diagram}: accessible SVG title is missing`);
      if (!/<desc\b[^>]*>.+?<\/desc>/s.test(svg)) errors.push(`${diagram}: accessible SVG description is missing`);
    }
  }

  for (const message of warnings) console.warn(`WARNING: ${message}`);
  if (errors.length) throw new Error(`Content validation failed:\n- ${[...new Set(errors)].join('\n- ')}`);
  console.log(`Content validation passed (${files.length} public localized posts; ${keys.size} unique language records).`);
  return { postCount: files.length, languageRecords: keys.size, warnings };
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(import.meta.filename)) {
  validate().catch((error) => { console.error(error.message); process.exitCode = 1; });
}
