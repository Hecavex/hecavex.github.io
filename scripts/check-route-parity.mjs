#!/usr/bin/env node

import { readFile, readdir, stat } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';

const root = resolve(process.argv[2] ?? 'dist');
const contractPath = resolve(import.meta.dirname, 'production-sitemap-routes.txt');
const expectedSitemap = new Set((await readFile(contractPath, 'utf8')).split(/\r?\n/).map((line) => line.trim()).filter(Boolean));
const sitemap = await readFile(join(root, 'sitemap.xml'), 'utf8');
const actualSitemap = new Set([...sitemap.matchAll(/<loc>https:\/\/hecavex\.com([^<]*)<\/loc>/g)].map((match) => match[1] || '/'));
const failures = [];

for (const route of expectedSitemap) if (!actualSitemap.has(route)) failures.push(`sitemap dropped ${route}`);
for (const route of actualSitemap) if (!expectedSitemap.has(route)) failures.push(`sitemap added unreviewed route ${route}`);
if (actualSitemap.size !== expectedSitemap.size) failures.push(`sitemap route count differs from the reviewed manifest: expected ${expectedSitemap.size}, found ${actualSitemap.size}`);

const routeFile = (route) => route === '/' ? join(root, 'index.html') : route.endsWith('/') ? join(root, route.slice(1), 'index.html') : join(root, route.slice(1));
async function isFile(path) { try { return (await stat(path)).isFile(); } catch { return false; } }
for (const route of expectedSitemap) if (!(await isFile(routeFile(route)))) failures.push(`missing sitemap artifact ${route}`);

const essentials = [
  '/404.html', '/en/404.html', '/lt/404.html',
  '/en/feed.xml', '/lt/feed.xml', '/en/briefings/feed.xml', '/lt/apzvalgos/feed.xml',
  '/en/search.json', '/lt/search.json', '/robots.txt', '/llms.txt', '/security.txt', '/.well-known/security.txt', '/CNAME',
  '/assets/media/hecavex-media-kit-en.html', '/assets/media/hecavex-media-kit-lt.html',
  '/lt/research/',
  '/lt/research/registru-centro-duomenu-vagyste-kai/',
  '/lt/research/registru-centro-duomenu-vagyste-part/',
  '/lt/research/kai-fake-news-scamai-ir-cloaking/',
  '/lt/research/informacijos-gamyklos-prie-lietuvos/',
  '/lt/research/vienas-scam-domenas-retai-buna-vienas/',
  '/lt/research/mfa-nera-panaceja-ir-laikas-nustoti/',
  '/lt/research/clickfix-kodel-siuolaikiniai-ta-nebeiesko/'
];
for (const route of essentials) if (!(await isFile(routeFile(route)))) failures.push(`missing compatibility route ${route}`);

const slugify = (value) => String(value)
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/&/g, ' and ')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

async function directoryNames(path) {
  return new Set((await readdir(path, { withFileTypes: true })).filter((entry) => entry.isDirectory()).map((entry) => entry.name));
}

for (const [lang, tagPath, categoryPath] of [['en', 'en/tags', 'en/categories'], ['lt', 'lt/zymos', 'lt/kategorijos']]) {
  const searchRecords = JSON.parse(await readFile(join(root, lang, 'search.json'), 'utf8'));
  const expectedTags = new Set(searchRecords.flatMap((record) => record.tags ?? []).map(slugify).filter(Boolean));
  const expectedCategories = new Set(searchRecords.flatMap((record) => record.categories ?? []).map(slugify).filter(Boolean));
  for (const [path, expected] of [[tagPath, expectedTags], [categoryPath, expectedCategories]]) {
    const actual = await directoryNames(join(root, path));
    for (const slug of expected) if (!actual.has(slug)) failures.push(`${path} dropped generated taxonomy route ${slug}`);
    for (const slug of actual) if (!expected.has(slug)) failures.push(`${path} contains an unexpected taxonomy route ${slug}`);
  }
}

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else files.push(path);
  }
  return files;
}
const files = await walk(root);
const htmlCount = files.filter((file) => extname(file) === '.html').length;

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`Route parity passed: ${actualSitemap.size} reviewed indexed URLs, ${htmlCount} HTML artifacts, and all derived taxonomy, feed, search, 404, redirect and security routes are present.`);
