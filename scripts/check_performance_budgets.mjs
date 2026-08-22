#!/usr/bin/env node

import { readdir, readFile, stat } from 'node:fs/promises';
import { extname, join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { gzipSync } from 'node:zlib';

const KIB = 1024;
const MIB = 1024 * KIB;

const IMAGE_EXTENSIONS = new Set(['.avif', '.gif', '.ico', '.jpeg', '.jpg', '.png', '.svg', '.webp']);
const FONT_EXTENSIONS = new Set(['.otf', '.ttf', '.woff', '.woff2']);

// These limits include measured headroom over the 2026-08-22 production build.
// Change them only with a documented reason and a fresh production measurement.
export const DEFAULT_BUDGETS = Object.freeze({
  htmlFile: Object.freeze({ rawBytes: 180 * KIB, gzipBytes: 48 * KIB }),
  cssFile: Object.freeze({ rawBytes: 64 * KIB, gzipBytes: 12 * KIB }),
  jsFile: Object.freeze({ rawBytes: 24 * KIB, gzipBytes: 8 * KIB }),
  styleScriptBundle: Object.freeze({ rawBytes: 112 * KIB, gzipBytes: 24 * KIB }),
  fontFile: Object.freeze({ rawBytes: 48 * KIB, gzipBytes: 48 * KIB }),
  fontBundle: Object.freeze({ rawBytes: 512 * KIB, gzipBytes: 512 * KIB, files: 20 }),
  imageFile: Object.freeze({ rawBytes: 384 * KIB, gzipBytes: 384 * KIB }),
  svgFile: Object.freeze({ rawBytes: 32 * KIB, gzipBytes: 12 * KIB }),
  imageArchive: Object.freeze({ rawBytes: 32 * MIB, gzipBytes: 31 * MIB })
});

function normalizedRelative(root, path) {
  return relative(root, path).replaceAll('\\', '/');
}

function classify(path) {
  const extension = extname(path).toLowerCase();
  if (extension === '.html') return { group: 'html', extension };
  if (extension === '.css') return { group: 'css', extension };
  if (extension === '.js') return { group: 'js', extension };
  if (FONT_EXTENSIONS.has(extension)) return { group: 'font', extension };
  if (IMAGE_EXTENSIONS.has(extension)) return { group: 'image', extension };
  return { group: 'other', extension };
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  entries.sort((left, right) => (left.name < right.name ? -1 : left.name > right.name ? 1 : 0));
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    if (entry.isFile()) files.push(path);
  }

  return files;
}

export async function measureSite(siteRoot) {
  const root = resolve(siteRoot);
  const rootStats = await stat(root);
  if (!rootStats.isDirectory()) throw new Error(`Build path is not a directory: ${root}`);

  const measurements = [];
  for (const path of await walk(root)) {
    const content = await readFile(path);
    const { group, extension } = classify(path);
    measurements.push({
      path: normalizedRelative(root, path),
      group,
      extension,
      rawBytes: content.length,
      gzipBytes: gzipSync(content, { level: 9, mtime: 0 }).length
    });
  }

  return measurements;
}

function total(files, field) {
  return files.reduce((sum, file) => sum + file[field], 0);
}

function largest(files, field) {
  return files.reduce((current, file) => (!current || file[field] > current[field] ? file : current), null);
}

function addSizeFailures(failures, label, item, budget) {
  if (item.rawBytes > budget.rawBytes) {
    failures.push({ label, metric: 'raw', actual: item.rawBytes, limit: budget.rawBytes, path: item.path });
  }
  if (item.gzipBytes > budget.gzipBytes) {
    failures.push({ label, metric: 'gzip', actual: item.gzipBytes, limit: budget.gzipBytes, path: item.path });
  }
}

function requireGroup(failures, files, label) {
  if (files.length === 0) failures.push({ label, metric: 'files', actual: 0, limit: 'at least 1' });
}

export function evaluateBudgets(measurements, budgets = DEFAULT_BUDGETS) {
  const groups = {
    html: measurements.filter((file) => file.group === 'html'),
    css: measurements.filter((file) => file.group === 'css'),
    js: measurements.filter((file) => file.group === 'js'),
    font: measurements.filter((file) => file.group === 'font'),
    image: measurements.filter((file) => file.group === 'image')
  };
  const failures = [];

  for (const [name, files] of Object.entries(groups)) requireGroup(failures, files, name);
  for (const file of groups.html) addSizeFailures(failures, 'HTML file', file, budgets.htmlFile);
  for (const file of groups.css) addSizeFailures(failures, 'CSS file', file, budgets.cssFile);
  for (const file of groups.js) addSizeFailures(failures, 'JavaScript file', file, budgets.jsFile);
  for (const file of groups.font) addSizeFailures(failures, 'font file', file, budgets.fontFile);
  for (const file of groups.image) {
    addSizeFailures(failures, 'image file', file, budgets.imageFile);
    if (file.extension === '.svg') addSizeFailures(failures, 'SVG file', file, budgets.svgFile);
  }

  const styleScriptFiles = [...groups.css, ...groups.js];
  addSizeFailures(failures, 'CSS + JavaScript bundle', {
    path: 'all first-party CSS and JavaScript',
    rawBytes: total(styleScriptFiles, 'rawBytes'),
    gzipBytes: total(styleScriptFiles, 'gzipBytes')
  }, budgets.styleScriptBundle);

  addSizeFailures(failures, 'font bundle', {
    path: 'all self-hosted fonts',
    rawBytes: total(groups.font, 'rawBytes'),
    gzipBytes: total(groups.font, 'gzipBytes')
  }, budgets.fontBundle);
  if (groups.font.length > budgets.fontBundle.files) {
    failures.push({
      label: 'font bundle',
      metric: 'files',
      actual: groups.font.length,
      limit: budgets.fontBundle.files,
      path: 'all self-hosted fonts'
    });
  }

  addSizeFailures(failures, 'image archive', {
    path: 'all first-party images',
    rawBytes: total(groups.image, 'rawBytes'),
    gzipBytes: total(groups.image, 'gzipBytes')
  }, budgets.imageArchive);

  return {
    failures,
    groups,
    summary: {
      htmlRaw: largest(groups.html, 'rawBytes'),
      htmlGzip: largest(groups.html, 'gzipBytes'),
      cssRaw: largest(groups.css, 'rawBytes'),
      cssGzip: largest(groups.css, 'gzipBytes'),
      jsRaw: largest(groups.js, 'rawBytes'),
      jsGzip: largest(groups.js, 'gzipBytes'),
      svgRaw: largest(groups.image.filter((file) => file.extension === '.svg'), 'rawBytes'),
      svgGzip: largest(groups.image.filter((file) => file.extension === '.svg'), 'gzipBytes'),
      imageRaw: largest(groups.image, 'rawBytes'),
      imageGzip: largest(groups.image, 'gzipBytes'),
      styleScriptRawBytes: total(styleScriptFiles, 'rawBytes'),
      styleScriptGzipBytes: total(styleScriptFiles, 'gzipBytes'),
      fontRawBytes: total(groups.font, 'rawBytes'),
      fontGzipBytes: total(groups.font, 'gzipBytes'),
      imageRawBytes: total(groups.image, 'rawBytes'),
      imageGzipBytes: total(groups.image, 'gzipBytes')
    }
  };
}

export function formatBytes(bytes) {
  if (bytes >= MIB) return `${(bytes / MIB).toFixed(2)} MiB`;
  return `${(bytes / KIB).toFixed(1)} KiB`;
}

function formatMaximum(name, rawFile, gzipFile, budget) {
  if (!rawFile || !gzipFile) {
    console.log(`${name}: no matching files`);
    return;
  }
  console.log(`${name}:`);
  console.log(`  raw   ${formatBytes(rawFile.rawBytes)} / ${formatBytes(budget.rawBytes)}  ${rawFile.path}`);
  console.log(`  gzip  ${formatBytes(gzipFile.gzipBytes)} / ${formatBytes(budget.gzipBytes)}  ${gzipFile.path}`);
}

function printReport(siteRoot, result, budgets) {
  const { groups, summary } = result;
  console.log(`Performance budgets for ${resolve(siteRoot)}`);
  formatMaximum('Largest HTML document', summary.htmlRaw, summary.htmlGzip, budgets.htmlFile);
  formatMaximum('Largest CSS file', summary.cssRaw, summary.cssGzip, budgets.cssFile);
  formatMaximum('Largest JavaScript file', summary.jsRaw, summary.jsGzip, budgets.jsFile);
  formatMaximum('Largest SVG image', summary.svgRaw, summary.svgGzip, budgets.svgFile);
  formatMaximum('Largest image', summary.imageRaw, summary.imageGzip, budgets.imageFile);
  console.log(`CSS + JavaScript: ${formatBytes(summary.styleScriptRawBytes)} raw / ${formatBytes(budgets.styleScriptBundle.rawBytes)}, ${formatBytes(summary.styleScriptGzipBytes)} gzip / ${formatBytes(budgets.styleScriptBundle.gzipBytes)}`);
  console.log(`Fonts (${groups.font.length}/${budgets.fontBundle.files}): ${formatBytes(summary.fontRawBytes)} raw / ${formatBytes(budgets.fontBundle.rawBytes)}, ${formatBytes(summary.fontGzipBytes)} gzip / ${formatBytes(budgets.fontBundle.gzipBytes)}`);
  console.log(`Images (${groups.image.length}): ${formatBytes(summary.imageRawBytes)} raw / ${formatBytes(budgets.imageArchive.rawBytes)}, ${formatBytes(summary.imageGzipBytes)} gzip / ${formatBytes(budgets.imageArchive.gzipBytes)}`);
}

function printFailure(failure) {
  const actual = failure.metric === 'files' ? failure.actual : formatBytes(failure.actual);
  const limit = failure.metric === 'files' && typeof failure.limit === 'string' ? failure.limit : failure.metric === 'files' ? failure.limit : formatBytes(failure.limit);
  const path = failure.path ? ` (${failure.path})` : '';
  return `${failure.label} ${failure.metric} is ${actual}; budget is ${limit}${path}`;
}

export async function run(siteRoot = '_site') {
  const measurements = await measureSite(siteRoot);
  const result = evaluateBudgets(measurements);
  printReport(siteRoot, result, DEFAULT_BUDGETS);

  if (result.failures.length > 0) {
    for (const failure of result.failures) console.error(`ERROR: ${printFailure(failure)}`);
    return 1;
  }

  console.log(`Performance budget check passed for ${measurements.length} generated files.`);
  return 0;
}

const invokedDirectly = process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url;
if (invokedDirectly) {
  try {
    process.exitCode = await run(process.argv[2] || '_site');
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    process.exitCode = 1;
  }
}
