#!/usr/bin/env node

import { readFile, readdir, stat } from 'node:fs/promises';
import { extname, join, relative, resolve } from 'node:path';

const root = resolve(process.argv[2] ?? 'dist');
const failures = [];

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else files.push(path);
  }
  return files;
}

async function isFile(path) { try { return (await stat(path)).isFile(); } catch { return false; } }
const files = await walk(root);
const htmlFiles = files.filter((file) => extname(file) === '.html');
const canonicalOwners = new Map();
let wideTableClasses = 0;
let promptClasses = 0;
let tableRegions = 0;
let evidenceFigures = 0;

function attr(tag, name) {
  return tag.match(new RegExp(`\\s${name}=(?:"([^"]*)"|'([^']*)')`, 'i'))?.slice(1).find((value) => value !== undefined) ?? '';
}

function stripMarkup(value) { return value.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }

function resolveLocal(raw, currentFile) {
  if (!raw || /^(?:mailto:|tel:|data:|javascript:|#)/i.test(raw) || raw.startsWith('//')) return undefined;
  let url;
  try { url = new URL(raw, `https://hecavex.com/${relative(root, currentFile).replaceAll('\\', '/')}`); } catch { return { path: raw, target: '' }; }
  if (url.hostname !== 'hecavex.com') return undefined;
  const path = decodeURIComponent(url.pathname);
  const target = path.endsWith('/') ? join(root, path.slice(1), 'index.html') : join(root, path.slice(1));
  return { path, target };
}

for (const file of htmlFiles) {
  const route = `/${relative(root, file).replaceAll('\\', '/')}`;
  const html = await readFile(file, 'utf8');
  if (/\{:\s*[^}]+\}/i.test(html)) failures.push(`${route}: unprocessed legacy Markdown attribute marker`);
  if (/<p>\s*<img\b[^>]*>\s*<em>[\s\S]*?<\/em>\s*<\/p>/i.test(html)) failures.push(`${route}: evidence image and caption were not converted to a semantic figure`);
  wideTableClasses += (html.match(/class=["'][^"']*\bhx-table-wide\b/gi) ?? []).length;
  promptClasses += (html.match(/class=["'][^"']*\bprompt-(?:info|danger)\b/gi) ?? []).length;
  tableRegions += (html.match(/class=["'][^"']*\btable-scroll-region\b/gi) ?? []).length;
  evidenceFigures += (html.match(/class=["'][^"']*\bhx-evidence-figure\b/gi) ?? []).length;
  const shellDocument = !route.startsWith('/assets/media/');
  const articleDocument = /class=["'][^"']*\barticle-body\b[^"']*\bprose\b/i.test(html);
  const noindex = /<meta\s+[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html);
  if (/\{%|\{\{\s*(?:site|page|post)\./i.test(html)) failures.push(`${route}: unrendered template output remains`);
  const htmlTag = html.match(/<html\b[^>]*>/i)?.[0] ?? '';
  if (!attr(htmlTag, 'lang')) failures.push(`${route}: missing html lang`);
  if (!/<title>[^<]+<\/title>/i.test(html)) failures.push(`${route}: missing title`);
  const redirect = /http-equiv=["']refresh/i.test(html);
  if (!noindex && !redirect) {
    if (!/<meta\s+[^>]*name=["']description["'][^>]*content=["'][^"']+/i.test(html)) failures.push(`${route}: missing meta description`);
    const canonical = html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)/i)?.[1];
    if (!canonical) failures.push(`${route}: missing canonical`);
    else if (canonicalOwners.has(canonical)) failures.push(`${route}: duplicate canonical also used by ${canonicalOwners.get(canonical)}`);
    else canonicalOwners.set(canonical, route);
    for (const property of ['og:title', 'og:description', 'og:url', 'og:image', 'og:image:width', 'og:image:height', 'og:image:alt']) if (!new RegExp(`<meta\\s+[^>]*property=["']${property.replace(':', '\\:')}["'][^>]*content=["'][^"']+`, 'i').test(html)) failures.push(`${route}: missing ${property}`);
    for (const name of ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image', 'twitter:image:alt']) if (!new RegExp(`<meta\\s+[^>]*(?:name|property)=["']${name.replace(':', '\\:')}["'][^>]*content=["'][^"']+`, 'i').test(html)) failures.push(`${route}: missing ${name}`);
    if ((html.match(/<main\b/gi) ?? []).length !== 1) failures.push(`${route}: expected one main landmark`);
    if (!/<h1\b[^>]*>[\s\S]*?<\/h1>/i.test(html)) failures.push(`${route}: missing h1`);
    const graphSource = html.match(/<script\s+[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i)?.[1];
    if (!graphSource) failures.push(`${route}: missing JSON-LD graph`);
    else {
      try {
        const graph = JSON.parse(graphSource)['@graph'];
        const ids = new Set(Array.isArray(graph) ? graph.map((node) => node['@id']).filter(Boolean) : []);
        for (const id of ['https://hecavex.com/#organization', 'https://hecavex.com/#deividas-lis', 'https://hecavex.com/#website', 'https://apt.hecavex.com/#website', 'https://labs.hecavex.com/#website', 'https://radar.hecavex.com/#website']) if (!ids.has(id)) failures.push(`${route}: JSON-LD is missing ${id}`);
      } catch (error) { failures.push(`${route}: invalid JSON-LD (${error.message})`); }
    }
  }
  if (!redirect && shellDocument) {
    if (!/<header\b[^>]*class=["'][^"']*site-header[^"']*["'][^>]*data-portfolio-shell=["']v1["']/i.test(html)) failures.push(`${route}: missing portfolio shell contract marker`);
    const network = [...html.matchAll(/<nav\s+class=["']portfolio-navigation["'][\s\S]*?<\/nav>/gi)][0]?.[0] ?? '';
    let previous = -1;
    for (const label of ['Research', 'Radar', 'APT Notes', 'Labs', 'Data']) {
      const index = network.indexOf(`>${label}<`);
      if (index < previous || index < 0) failures.push(`${route}: portfolio navigation order is incorrect at ${label}`);
      previous = index;
    }
  }
  for (const image of html.match(/<img\b[^>]*>/gi) ?? []) {
    if (!/\salt=(?:"[^"]*"|'[^']*')/i.test(image)) failures.push(`${route}: image missing alt attribute`);
    if (articleDocument && !/\bsrc=["']\/assets\/img\/brand\//i.test(image)) {
      if (!/\swidth=(?:["']|[^\s>]+)/i.test(image) || !/\sheight=(?:["']|[^\s>]+)/i.test(image)) failures.push(`${route}: article image missing intrinsic dimensions`);
      if (!/\sloading=(?:["']|[^\s>]+)/i.test(image)) failures.push(`${route}: article image missing loading policy`);
      if (!/\sdecoding=(?:["']|[^\s>]+)/i.test(image)) failures.push(`${route}: article image missing decoding policy`);
    }
  }
  for (const tag of html.match(/<(?:a|link|script|img)\b[^>]*(?:href|src)=(?:"[^"]*"|'[^']*')[^>]*>/gi) ?? []) {
    const raw = attr(tag, tag.toLowerCase().startsWith('<a') || tag.toLowerCase().startsWith('<link') ? 'href' : 'src');
    const local = resolveLocal(raw, file);
    if (local && !(await isFile(local.target))) {
      const indexTarget = `${local.target}${extname(local.target) ? '' : '/index.html'}`;
      if (!(await isFile(indexTarget))) failures.push(`${route}: unresolved internal reference ${raw}`);
    }
  }
  if (!stripMarkup(html)) failures.push(`${route}: empty document`);
}

if (wideTableClasses === 0) failures.push('legacy wide-table classes were not restored');
if (promptClasses === 0) failures.push('legacy prompt classes were not restored');
if (tableRegions === 0) failures.push('semantic table overflow regions were not generated');
if (evidenceFigures === 0) failures.push('semantic evidence figures were not generated');

for (const file of files.filter((path) => ['.xml', '.json', '.txt'].includes(extname(path)))) {
  const source = await readFile(file, 'utf8');
  if (/\{%|\{\{\s*(?:site|page|post)\./.test(source)) failures.push(`${relative(root, file)}: unrendered template syntax remains`);
  if (extname(file) === '.json') { try { JSON.parse(source); } catch (error) { failures.push(`${relative(root, file)}: invalid JSON (${error.message})`); } }
  if (extname(file) === '.xml' && !/^<\?xml[\s\S]*<(?:feed|urlset)\b/.test(source)) failures.push(`${relative(root, file)}: malformed XML document`);
}

const css = await readFile(join(root, 'assets', 'css', 'hecavex.css'), 'utf8');
for (const [token, pattern] of [
  ['content width', /--content:\s*94rem/], ['network row', /--network-row:\s*4rem/], ['product row', /--product-row:\s*3\.25rem/],
  ['desktop header offset', /--header-offset:\s*7\.25rem/], ['mark size', /\.brand img\s*\{[^}]*width:\s*2\.25rem/s],
  ['product link height', /\.product-navigation a\s*\{[^}]*min-height:\s*3\.25rem/s], ['1160px collapse', /@media \(max-width:\s*1160px\)/],
  ['display heading', /font-size:\s*clamp\(2\.5rem,\s*5vw,\s*4rem\)/]
]) if (!pattern.test(css)) failures.push(`portfolio CSS contract missing ${token}`);

if (failures.length) {
  console.error([...new Set(failures)].join('\n'));
  process.exit(1);
}
console.log(`Site audit passed: ${htmlFiles.length} HTML documents; shell, SEO, schema, social metadata, assets and internal links are intact.`);
