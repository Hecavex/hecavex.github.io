#!/usr/bin/env node

import { access, readFile, readdir } from 'node:fs/promises';
import { extname, join, relative, resolve } from 'node:path';
import { parse } from 'yaml';

const root = resolve(import.meta.dirname, '..');
const postsRoot = join(root, 'src', 'content', 'posts');
const pagesRoot = join(root, 'src', 'content', 'pages');
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

function proseStyleViolations(source) {
  const violations = [];
  const curlyDoubleQuote = /[\u201c\u201d\u201e]/u;
  let fence = null;

  for (const [index, line] of source.split(/\r?\n/).entries()) {
    const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/);
    if (fenceMatch) {
      const marker = fenceMatch[1][0];
      if (fence === marker) fence = null;
      else if (fence === null) fence = marker;
      continue;
    }
    if (fence !== null) continue;

    const proseOnly = line
      .replace(/`+[^`]*`+/g, '')
      .replace(/(!?)\[([^\]]*)\]\([^)]*\)/g, '$1[$2]()')
      .replace(/<[^>]+>/g, '')
      .replace(/https?:\/\/[^\s<>'"]+/g, '')
      .replace(/&(?:#\d+|#x[\da-f]+|[a-z][\da-z]+);/gi, '');
    if (curlyDoubleQuote.test(proseOnly)) {
      violations.push({ line: index + 1, message: 'use ASCII double quotes instead of typographic quotation marks' });
    }
    if (proseOnly.includes(';')) {
      violations.push({ line: index + 1, message: 'replace prose semicolons with a full stop, comma, or separate sentence' });
    }
  }

  return violations;
}

async function exists(path) {
  try { await access(path); return true; } catch { return false; }
}

export async function validate() {
  const errors = [];
  const warnings = [];
  const keys = new Map();
  const referencedPostSvgs = new Set();
  const files = (await walk(postsRoot)).filter((path) => ['.md', '.markdown'].includes(extname(path))).sort();
  const pageFiles = (await walk(pagesRoot)).filter((path) => extname(path) === '.md').sort();

  const securityPaths = [join(publicRoot, 'security.txt'), join(publicRoot, '.well-known', 'security.txt')];
  const securityDocuments = await Promise.all(securityPaths.map((path) => readFile(path, 'utf8')));
  if (securityDocuments[0] !== securityDocuments[1]) errors.push('security.txt copies must remain byte-identical');
  const expiryValue = securityDocuments[0].match(/^Expires:\s*(.+)$/m)?.[1]?.trim();
  const expiryTime = Date.parse(expiryValue ?? '');
  if (!Number.isFinite(expiryTime)) errors.push('security.txt requires a valid RFC 3339 Expires field');
  else if (expiryTime - Date.now() < 45 * 24 * 60 * 60 * 1000) errors.push('security.txt expires in fewer than 45 days; renew it before release');

  if (files.length === 0 || files.length % 2 !== 0) errors.push(`expected a non-zero even number of bilingual Markdown posts, found ${files.length}`);

  for (const absolute of files) {
    const file = relative(root, absolute).replaceAll('\\', '/');
    const source = await readFile(absolute, 'utf8');
    const data = frontMatter(source, file, errors);
    for (const violation of proseStyleViolations(source)) {
      errors.push(`${file}:${violation.line}: ${violation.message}`);
    }
    if (data.draft === true) {
      if (data.published !== false) errors.push(`${file}: draft posts must also set published: false`);
      continue;
    }
    if (!allowedLanguages.has(data.lang)) errors.push(`${file}: lang must be en or lt`);
    for (const field of ['title', 'description', 'translation_key']) if (!String(data[field] ?? '').trim()) errors.push(`${file}: missing ${field}`);
    const searchDescription = String(data.seo_description ?? data.description ?? '').trim();
    if (searchDescription.length > 160) errors.push(`${file}: effective search description exceeds 160 characters (${searchDescription.length}); add a concise seo_description`);
    if (!allowedTypes.has(String(data.content_type))) errors.push(`${file}: missing or invalid content_type`);
    if (evidenceTypes.has(data.content_type)) {
      for (const field of ['key_findings', 'scope', 'limitations']) if (!data[field] || (Array.isArray(data[field]) && !data[field].length)) errors.push(`${file}: evidence-bearing publication missing ${field}`);
    }
    const pair = `${data.translation_key}:${data.lang}`;
    if (keys.has(pair)) errors.push(`${file}: duplicate translation_key ${data.translation_key} for ${data.lang}`);
    keys.set(pair, { file, data });
    for (const category of data.categories ?? []) if (!allowedCategories.has(category)) errors.push(`${file}: invalid category ${category}`);
    if (data.image && typeof data.image === 'object' && data.image.path && !String(data.image.alt ?? '').trim()) errors.push(`${file}: configured image requires alt text`);
    const social = `/assets/img/social/${data.translation_key}-${data.lang}.png`;
    if (!(await exists(join(publicRoot, social.slice(1))))) errors.push(`${file}: missing generated social card ${social}`);
    if (data.image && typeof data.image === 'object' && extname(String(data.image.path)).toLowerCase() === '.svg') {
      if (data.image.social !== social) errors.push(`${file}: SVG hero must declare PNG social metadata ${social}`);
      referencedPostSvgs.add(String(data.image.path));
    }
    for (const match of source.matchAll(/!\[([^\]]*)\]\((\/assets\/img\/[^)\s]+\.svg)\)/g)) {
      if (!match[1].trim()) errors.push(`${file}: inline SVG ${match[2]} requires descriptive alt text`);
      referencedPostSvgs.add(match[2]);
    }
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

  const parityFields = ['date', 'last_modified_at', 'content_type', 'categories', 'author', 'confidence', 'tlp', 'featured', 'draft', 'published', 'toc', 'comments', 'series', 'issue', 'coverage_start', 'coverage_end', 'information_cutoff', 'critical_count', 'high_count', 'watch_count'];
  for (const key of new Set([...keys.keys()].map((value) => value.split(':')[0]))) {
    const languages = ['en', 'lt'].filter((lang) => keys.has(`${key}:${lang}`));
    if (languages.length !== 2) {
      errors.push(`${key}: every public publication requires an English and Lithuanian edition; found ${languages.join(', ') || 'none'}`);
      continue;
    }
    const en = keys.get(`${key}:en`);
    const lt = keys.get(`${key}:lt`);
    for (const field of parityFields) {
      if (JSON.stringify(en.data[field] ?? null) !== JSON.stringify(lt.data[field] ?? null)) errors.push(`${key}: ${field} differs between ${en.file} and ${lt.file}`);
    }
    for (const field of ['path', 'thumbnail']) {
      if (JSON.stringify(en.data.image?.[field] ?? null) !== JSON.stringify(lt.data.image?.[field] ?? null)) errors.push(`${key}: image.${field} differs between language editions`);
    }
  }

  for (const publicPath of referencedPostSvgs) {
    const path = join(publicRoot, publicPath.replace(/^\/+/, ''));
    if (!(await exists(path))) {
      errors.push(`${publicPath}: referenced post SVG is missing`);
      continue;
    }
    const svg = await readFile(path, 'utf8');
    if (!/<title\b[^>]*>.+?<\/title>/s.test(svg)) errors.push(`${publicPath}: accessible SVG title is missing`);
    if (!/<desc\b[^>]*>.+?<\/desc>/s.test(svg)) errors.push(`${publicPath}: accessible SVG description is missing`);
  }

  const pageKeys = new Map();
  for (const absolute of pageFiles) {
    const file = relative(root, absolute).replaceAll('\\', '/');
    const data = frontMatter(await readFile(absolute, 'utf8'), file, errors);
    if (!allowedLanguages.has(data.lang)) errors.push(`${file}: lang must be en or lt`);
    for (const field of ['layout', 'title', 'description', 'translation_key', 'permalink']) {
      if (!String(data[field] ?? '').trim()) errors.push(`${file}: missing ${field}`);
    }
    if (typeof data.permalink === 'string' && !data.permalink.startsWith(`/${data.lang}/`)) {
      errors.push(`${file}: localized page permalink must start with /${data.lang}/`);
    }
    const pair = `${data.translation_key}:${data.lang}`;
    if (pageKeys.has(pair)) errors.push(`${file}: duplicate page translation_key ${data.translation_key} for ${data.lang}`);
    pageKeys.set(pair, { file, data });
  }

  for (const key of new Set([...pageKeys.keys()].map((value) => value.split(':')[0]))) {
    const languages = ['en', 'lt'].filter((lang) => pageKeys.has(`${key}:${lang}`));
    if (languages.length !== 2) {
      errors.push(`${key}: every localized static page requires an English and Lithuanian edition; found ${languages.join(', ') || 'none'}`);
      continue;
    }
    const en = pageKeys.get(`${key}:en`);
    const lt = pageKeys.get(`${key}:lt`);
    for (const field of ['layout', 'last_modified_at', 'sitemap', 'robots']) {
      if (JSON.stringify(en.data[field] ?? null) !== JSON.stringify(lt.data[field] ?? null)) {
        errors.push(`${key}: page ${field} differs between ${en.file} and ${lt.file}`);
      }
    }
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
  console.log(`Content validation passed (${files.length} public localized posts; ${pageFiles.length} localized static pages; ${keys.size + pageKeys.size} language records).`);
  return { postCount: files.length, pageCount: pageFiles.length, languageRecords: keys.size + pageKeys.size, warnings };
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(import.meta.filename)) {
  validate().catch((error) => { console.error(error.message); process.exitCode = 1; });
}
