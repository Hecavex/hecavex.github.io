#!/usr/bin/env node

import { readFile, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

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

console.log('Finalized GitHub Pages artifact (.nojekyll and localized 404 compatibility files).');
