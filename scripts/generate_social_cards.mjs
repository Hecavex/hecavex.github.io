#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { mkdir, readFile, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import process from 'node:process';
import { chromium } from 'playwright-core';

const projectRoot = resolve(import.meta.dirname, '..');
const sourceRoot = join(projectRoot, 'src');
const publicRoot = join(projectRoot, 'public');
const postsRoot = join(sourceRoot, 'content', 'posts');
const outputRoot = join(publicRoot, 'assets', 'img', 'social');
const browserCandidates = [
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
].filter(Boolean);

const executablePath = browserCandidates.find((candidate) => existsSync(candidate));
if (!executablePath) {
  throw new Error('No Chromium browser found. Set PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH.');
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    if (entry.isFile() && entry.name.endsWith('.md')) files.push(path);
  }
  return files;
}

function scalar(frontMatter, key) {
  const raw = frontMatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1].trim();
  if (!raw) return '';
  if (raw.startsWith('"') && raw.endsWith('"')) {
    try {
      return JSON.parse(raw);
    } catch {
      return raw.slice(1, -1);
    }
  }
  if (raw.startsWith("'") && raw.endsWith("'")) return raw.slice(1, -1).replaceAll("''", "'");
  return raw;
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function titleSize(title) {
  if (title.length > 115) return 42;
  if (title.length > 88) return 48;
  if (title.length > 62) return 55;
  return 64;
}

const postFiles = (await walk(postsRoot)).sort();
const cards = [];
for (const file of postFiles) {
  const source = await readFile(file, 'utf8');
  const frontMatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
  if (!frontMatter || scalar(frontMatter, 'draft') === 'true' || scalar(frontMatter, 'published') === 'false') continue;

  const title = scalar(frontMatter, 'title');
  const lang = scalar(frontMatter, 'lang');
  const translationKey = scalar(frontMatter, 'translation_key');
  const date = scalar(frontMatter, 'date').slice(0, 10);
  const publicationClass = scalar(frontMatter, 'publication_class');
  const contentType = scalar(frontMatter, 'content_type');
  if (!title || !date || !['en', 'lt'].includes(lang) || !translationKey) {
    throw new Error(`Missing social-card metadata in ${file}`);
  }

  const isBrief = publicationClass === 'signal-brief' || file.includes(`${join('src', 'content', 'posts', lang, 'bulletins')}`);
  cards.push({
    date,
    file,
    filename: `${translationKey}-${lang}.png`,
    kind: isBrief ? 'brief' : contentType || 'research',
    label: isBrief
      ? (lang === 'lt' ? 'SIGNALŲ APŽVALGA' : 'SIGNAL BRIEF')
      : (lang === 'lt' ? 'HECAVEX TYRIMAS' : 'HECAVEX RESEARCH'),
    edition: lang === 'lt' ? 'LT' : 'EN',
    lang,
    title,
    titleSize: titleSize(title)
  });
}

const keys = new Set();
for (const card of cards) {
  if (keys.has(card.filename)) throw new Error(`Duplicate social-card target: ${card.filename}`);
  keys.add(card.filename);
}

const interLatin = (await readFile(join(publicRoot, 'assets', 'fonts', 'inter', 'inter-latin-700-normal.woff2'))).toString('base64');
const interLatinExt = (await readFile(join(publicRoot, 'assets', 'fonts', 'inter', 'inter-latin-ext-700-normal.woff2'))).toString('base64');
const monoLatin = (await readFile(join(publicRoot, 'assets', 'fonts', 'ibm-plex-mono', 'ibm-plex-mono-latin-600-normal.woff2'))).toString('base64');
const monoLatinExt = (await readFile(join(publicRoot, 'assets', 'fonts', 'ibm-plex-mono', 'ibm-plex-mono-latin-ext-600-normal.woff2'))).toString('base64');

await mkdir(outputRoot, { recursive: true });
const browser = await chromium.launch({ executablePath, headless: true });
const context = await browser.newContext({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
  colorScheme: 'dark',
  reducedMotion: 'reduce'
});
const page = await context.newPage();

for (const card of cards) {
  const accent = '#55b9b1';
  await page.setContent(`<!doctype html>
    <html lang="${card.lang}"><head><meta charset="utf-8"><style>
      @font-face{font-family:Inter;font-style:normal;font-weight:700;src:url(data:font/woff2;base64,${interLatinExt}) format("woff2");unicode-range:U+0100-024F,U+1E00-1EFF,U+20A0-20CF,U+2C60-2C7F,U+A720-A7FF}
      @font-face{font-family:Inter;font-style:normal;font-weight:700;src:url(data:font/woff2;base64,${interLatin}) format("woff2")}
      @font-face{font-family:"IBM Plex Mono";font-style:normal;font-weight:600;src:url(data:font/woff2;base64,${monoLatinExt}) format("woff2");unicode-range:U+0100-024F,U+1E00-1EFF,U+20A0-20CF,U+2C60-2C7F,U+A720-A7FF}
      @font-face{font-family:"IBM Plex Mono";font-style:normal;font-weight:600;src:url(data:font/woff2;base64,${monoLatin}) format("woff2")}
      *{box-sizing:border-box}html,body{width:1200px;height:630px;margin:0;overflow:hidden;background:#111416;color:#151719}body{font-family:Inter,Arial,sans-serif}
      .card{position:relative;width:1200px;height:630px;padding:58px 64px;border:18px solid #111416;background:#ece9e1}
      .card:before{position:absolute;top:0;right:0;left:0;height:8px;background:${accent};content:""}
      header{position:relative;display:flex;align-items:center;gap:22px;font:600 16px/1.3 "IBM Plex Mono",monospace;letter-spacing:.13em}.mark{width:48px;height:48px}.brand{font-family:Inter,sans-serif;font-size:23px;letter-spacing:.16em}.edition{margin-left:auto;padding:9px 12px;border:1px solid #30383b;color:#30383b;font-size:14px}
      main{position:relative;width:870px;margin-top:70px}.label{display:flex;align-items:center;gap:16px;margin:0 0 20px;color:#151719;font:600 16px/1.2 "IBM Plex Mono",monospace;letter-spacing:.14em}.label:before{width:42px;height:4px;background:${accent};content:""}.title{margin:0;font-size:${card.titleSize}px;line-height:1.03;letter-spacing:-.045em;text-wrap:balance}
      .folio{position:absolute;top:156px;right:64px;width:170px;height:270px;padding-left:24px;border-left:5px solid ${accent};font-family:"IBM Plex Mono",monospace}.folio span,.folio small{display:block;color:#30383b;font-size:13px;letter-spacing:.12em}.folio strong{display:block;margin:22px 0;color:#151719;font:700 66px/1 Inter,Arial,sans-serif;letter-spacing:-.06em}.folio small{margin-top:104px}
      .meta{position:absolute;left:64px;right:64px;bottom:46px;display:flex;align-items:center;gap:24px;padding-top:20px;border-top:1px solid #30383b;color:#30383b;font:600 15px/1.2 "IBM Plex Mono",monospace;letter-spacing:.08em}.meta strong{color:#151719}.meta .url{margin-left:auto;color:#151719;text-decoration:underline;text-decoration-color:${accent};text-decoration-thickness:4px;text-underline-offset:7px}
    </style></head><body><article class="card">
      <header><svg class="mark" viewBox="0 0 48 48" aria-hidden="true"><path d="M5 5v38M43 5v38M5 24h38M5 8l38 34M43 8 5 42" fill="none" stroke="${accent}" stroke-width="3"/><circle cx="24" cy="24" r="3" fill="#151719"/></svg><span class="brand">HECAVEX</span><span class="edition">${card.edition}</span></header>
      <main><p class="label">${escapeHtml(card.label)}</p><h1 class="title">${escapeHtml(card.title)}</h1></main>
      <aside class="folio" aria-hidden="true"><span>PUBLICATION</span><strong>H/X</strong><small>${card.edition} / ${card.date.slice(0, 4)}</small></aside>
      <footer class="meta"><strong>${card.date}</strong><span>CTI · OSINT · DIGITAL INVESTIGATIONS</span><span class="url">HECAVEX.COM</span></footer>
    </article></body></html>`, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const renderedEdition = await page.locator('.edition').textContent();
  if (renderedEdition !== card.edition) throw new Error(`Social-card edition mismatch for ${card.filename}: expected ${card.edition}, found ${renderedEdition}`);
  await page.screenshot({ path: join(outputRoot, card.filename), type: 'png' });
}

await browser.close();
console.log(`Generated ${cards.length} localized 1200x630 social cards in ${outputRoot}.`);
