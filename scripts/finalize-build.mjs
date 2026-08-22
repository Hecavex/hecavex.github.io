#!/usr/bin/env node

import { readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { applyArticleImagePolicy } from '../src/lib/html-image-policy.mjs';

const root = resolve(process.argv[2] ?? 'dist');
await writeFile(join(root, '.nojekyll'), '', 'utf8');

// Astro treats the localized 404 documents as regular static pages. Keep the
// historic `.html` URLs as exact files in addition to their generated source.
for (const lang of ['en', 'lt']) {
  const source = join(root, lang, '404.html', 'index.html');
  const target = join(root, lang, '404.html');
  const document = await readFile(source);
  await rm(target, { recursive: true });
  await writeFile(target, document);
}

async function htmlFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await htmlFiles(path));
    else if (extname(path) === '.html') files.push(path);
  }
  return files;
}

let imagePolicyDocuments = 0;
for (const file of await htmlFiles(root)) {
  const source = await readFile(file, 'utf8');
  const finalized = applyArticleImagePolicy(source);
  if (finalized === source) continue;
  await writeFile(file, finalized, 'utf8');
  imagePolicyDocuments += 1;
}

console.log(`Finalized GitHub Pages artifact (.nojekyll, localized 404 compatibility files and ${imagePolicyDocuments} article image-policy documents).`);
