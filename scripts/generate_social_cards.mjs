#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { mkdir, readFile, readdir } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';
import process from 'node:process';
import { chromium } from 'playwright-core';

const projectRoot = resolve(import.meta.dirname, '..');
const sourceRoot = join(projectRoot, 'src');
const postsRoot = join(sourceRoot, '_posts');
const outputRoot = join(sourceRoot, 'assets', 'img', 'social');
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

  const isBrief = publicationClass === 'signal-brief' || file.includes(`${join('src', '_posts', lang, 'bulletins')}`);
  cards.push({
    date,
    file,
    filename: `${translationKey}-${lang}.png`,
    kind: isBrief ? 'brief' : contentType || 'research',
    label: isBrief
      ? (lang === 'lt' ? 'SIGNALŲ APŽVALGA' : 'SIGNAL BRIEF')
      : (lang === 'lt' ? 'HECAVEX TYRIMAS' : 'HECAVEX RESEARCH'),
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

const interLatin = (await readFile(join(sourceRoot, 'assets', 'fonts', 'inter', 'inter-latin-700-normal.woff2'))).toString('base64');
const interLatinExt = (await readFile(join(sourceRoot, 'assets', 'fonts', 'inter', 'inter-latin-ext-700-normal.woff2'))).toString('base64');
const monoLatin = (await readFile(join(sourceRoot, 'assets', 'fonts', 'ibm-plex-mono', 'ibm-plex-mono-latin-600-normal.woff2'))).toString('base64');
const monoLatinExt = (await readFile(join(sourceRoot, 'assets', 'fonts', 'ibm-plex-mono', 'ibm-plex-mono-latin-ext-600-normal.woff2'))).toString('base64');

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
  const accent = card.kind === 'brief' ? '#ffc857' : card.kind === 'threat-note' ? '#a2da68' : '#44c7dc';
  await page.setContent(`<!doctype html>
    <html lang="${card.lang}"><head><meta charset="utf-8"><style>
      @font-face{font-family:Inter;font-style:normal;font-weight:700;src:url(data:font/woff2;base64,${interLatinExt}) format("woff2");unicode-range:U+0100-024F,U+1E00-1EFF,U+20A0-20CF,U+2C60-2C7F,U+A720-A7FF}
      @font-face{font-family:Inter;font-style:normal;font-weight:700;src:url(data:font/woff2;base64,${interLatin}) format("woff2")}
      @font-face{font-family:"IBM Plex Mono";font-style:normal;font-weight:600;src:url(data:font/woff2;base64,${monoLatinExt}) format("woff2");unicode-range:U+0100-024F,U+1E00-1EFF,U+20A0-20CF,U+2C60-2C7F,U+A720-A7FF}
      @font-face{font-family:"IBM Plex Mono";font-style:normal;font-weight:600;src:url(data:font/woff2;base64,${monoLatin}) format("woff2")}
      *{box-sizing:border-box}html,body{width:1200px;height:630px;margin:0;overflow:hidden;background:#05080b;color:#f2f8fb}body{font-family:Inter,Arial,sans-serif}
      .card{position:relative;width:1200px;height:630px;padding:58px 64px;border:1px solid #1e3440;border-top:8px solid ${accent};background:radial-gradient(circle at 88% 8%,rgb(68 199 220 / 13%),transparent 270px),linear-gradient(135deg,#05080b,#0b1117 60%,#101923)}
      .grid{position:absolute;inset:0;opacity:.26;background-image:linear-gradient(#1e3440 1px,transparent 1px),linear-gradient(90deg,#1e3440 1px,transparent 1px);background-size:64px 64px;mask-image:linear-gradient(90deg,transparent 46%,#000)}
      .axis{position:absolute;right:82px;top:116px;width:260px;height:260px;border:1px solid #1e3440;border-radius:50%}.axis:before,.axis:after{content:"";position:absolute;background:#1e3440}.axis:before{left:50%;top:-54px;width:1px;height:368px}.axis:after{top:50%;left:-54px;width:368px;height:1px}.pulse{position:absolute;right:159px;top:232px;width:106px;height:24px;border-top:3px solid ${accent};transform:skewX(-32deg);filter:drop-shadow(0 0 8px ${accent})}
      header{position:relative;display:flex;align-items:center;gap:22px;font:600 16px/1.3 "IBM Plex Mono",monospace;letter-spacing:.13em}.mark{width:48px;height:48px}.brand{font-family:Inter,sans-serif;font-size:23px;letter-spacing:.16em}.edition{margin-left:auto;padding:9px 12px;border:1px solid #1e3440;color:#b6c6cf;font-size:14px}
      main{position:relative;width:850px;margin-top:66px}.label{margin:0 0 18px;color:${accent};font:600 16px/1.2 "IBM Plex Mono",monospace;letter-spacing:.14em}.title{margin:0;font-size:${card.titleSize}px;line-height:1.03;letter-spacing:-.045em;text-wrap:balance}.meta{position:absolute;left:64px;right:64px;bottom:46px;display:flex;align-items:center;gap:24px;padding-top:20px;border-top:1px solid #1e3440;color:#8397a3;font:600 15px/1.2 "IBM Plex Mono",monospace;letter-spacing:.08em}.meta strong{color:#b6c6cf}.meta .url{margin-left:auto;color:${accent}}
    </style></head><body><article class="card"><div class="grid"></div><div class="axis"></div><div class="pulse"></div>
      <header><svg class="mark" viewBox="0 0 48 48" aria-hidden="true"><path d="M5 5v38M43 5v38M5 8l38 34M43 8L5 42" fill="none" stroke="#ff6b6b" stroke-width="3"/><circle cx="24" cy="24" r="3" fill="${accent}"/></svg><span class="brand">HECAVEX</span><span class="edition">${card.lang.toUpperCase()}</span></header>
      <main><p class="label">${escapeHtml(card.label)}</p><h1 class="title">${escapeHtml(card.title)}</h1></main>
      <footer class="meta"><strong>${card.date}</strong><span>CTI · OSINT · DIGITAL INVESTIGATIONS</span><span class="url">HECAVEX.COM</span></footer>
    </article></body></html>`, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: join(outputRoot, card.filename), type: 'png' });
}

await browser.close();
console.log(`Generated ${cards.length} localized 1200x630 social cards in ${outputRoot}.`);
