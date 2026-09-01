#!/usr/bin/env node

import { readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { transform } from 'lightningcss';
import { applyArticleImagePolicy } from '../src/lib/html-image-policy.mjs';
import { buildImageDimensionMap } from '../src/lib/image-dimensions.mjs';

const root = resolve(process.argv[2] ?? 'dist');
await writeFile(join(root, '.nojekyll'), '', 'utf8');

// Public styles remain readable and lintable in source control. Compress only
// the deploy artifact so the publication keeps its strict transfer budgets.
const stylesheet = join(root, 'assets', 'css', 'hecavex.css');
const stylesheetSource = await readFile(stylesheet);
const { code: minifiedStylesheet } = transform({
  filename: stylesheet,
  code: stylesheetSource,
  minify: true,
});
await writeFile(stylesheet, minifiedStylesheet);

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
const imageDimensions = await buildImageDimensionMap(root);
for (const file of await htmlFiles(root)) {
  const source = await readFile(file, 'utf8');
  const finalized = applyArticleImagePolicy(source, imageDimensions);
  if (finalized === source) continue;
  await writeFile(file, finalized, 'utf8');
  imagePolicyDocuments += 1;
}

console.log(`Finalized GitHub Pages artifact (.nojekyll, minified publication CSS, localized 404 compatibility files, ${imageDimensions.size} intrinsic image records and ${imagePolicyDocuments} article image-policy documents).`);
