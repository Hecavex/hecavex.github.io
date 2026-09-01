import { readdir, readFile } from 'node:fs/promises';
import { extname, join, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const authoredImageRoot = join(root, 'public', 'assets', 'img');
const standaloneAuthoredSvgs = [join(root, 'public', 'favicon.svg')];

// Evidence screenshots remain in their native raster colour. If source evidence
// is ever introduced as SVG, list the exact repository-relative path here so
// the exception is explicit and reviewable rather than directory-wide.
const evidenceSvgExceptions = new Set([]);

const approvedColours = new Set([
  '#111416',
  '#171b1d',
  '#1d2326',
  '#ece9e1',
  '#151719',
  '#55b9b1',
  '#8d969a',
  '#30383b',
  '#86b77e',
  '#d2aa62',
  '#d06c65',
]);

const forbiddenStructures = [
  ['linear gradient', /<linearGradient\b/i],
  ['radial gradient', /<radialGradient\b/i],
  ['decorative pattern', /<pattern\b/i],
  ['blur or glow filter', /<feGaussianBlur\b|filter=["']url\(#/i],
];

async function collectSvgs(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectSvgs(path));
    else if (entry.isFile() && extname(entry.name).toLowerCase() === '.svg') files.push(path);
  }
  return files;
}

const svgFiles = [...await collectSvgs(authoredImageRoot), ...standaloneAuthoredSvgs].sort();
const failures = [];

for (const file of svgFiles) {
  const repositoryPath = relative(root, file).replaceAll('\\', '/');
  if (evidenceSvgExceptions.has(repositoryPath)) continue;

  const source = await readFile(file, 'utf8');
  for (const [label, expression] of forbiddenStructures) {
    if (expression.test(source)) failures.push(`${repositoryPath}: contains ${label}`);
  }

  const colours = new Set([...source.matchAll(/#[0-9a-f]{3,8}\b/gi)].map((match) => match[0].toLowerCase()));
  const offSystemColours = [...colours].filter((colour) => !approvedColours.has(colour)).sort();
  if (offSystemColours.length > 0) {
    failures.push(`${repositoryPath}: off-system colours ${offSystemColours.join(', ')}`);
  }
}

if (failures.length > 0) {
  throw new Error(`Editorial SVG contract failed:\n- ${failures.join('\n- ')}`);
}

console.log(`Editorial SVG contract passed (${svgFiles.length} authored SVGs; raster evidence remains native).`);
