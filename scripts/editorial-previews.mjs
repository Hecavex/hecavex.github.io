// Render a private, local acceptance sheet. Never add review decisions to the
// publication merely because a file exists or an automated image check passes.
import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import { resolve, join, dirname, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parse } from 'yaml';
import { isApprovedPublication } from '../src/lib/publication-state.mjs';

const root = resolve(import.meta.dirname, '..');
const output = resolve(process.argv[2] ?? '');
if (!process.argv[2] || output === root || output.startsWith(root + sep)) throw new Error('Provide a private output .html path outside the publication repository');
if (!output.endsWith('.html')) throw new Error('Output must be an HTML file');
async function walk(path) {
  const files = [];
  for (const entry of await readdir(path, { withFileTypes: true })) {
    const file = join(path, entry.name);
    files.push(...(entry.isDirectory() ? await walk(file) : [file]));
  }
  return files;
}
const escape = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const cards = [];
for (const path of await walk(join(root, 'src/content/posts'))) {
  if (!path.endsWith('.md')) continue;
  const source = await readFile(path, 'utf8');
  const data = parse(source.replace(/^\uFEFF/, '').match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]);
  if (!isApprovedPublication(data)) continue;
  const image = typeof data.image === 'object' ? data.image : { path: data.image };
  const textLed = data.content_type === 'signal-brief';
  const variants = [
    ['Cover / viršelis', textLed ? undefined : image?.hero ?? image?.path, 600],
    ['Card / kortelė', textLed ? undefined : image?.thumbnail ?? image?.hero ?? image?.path, 320],
    ['Social / dalijimasis', image?.social ?? `/assets/img/social/${data.translation_key}-${data.lang}.png`, 600]
  ];
  cards.push(`<article><h2>${escape(data.title)} [${escape(data.lang)}]</h2><p>${escape(data.translation_key)} · Visual approval: pending owner review</p><div class="variants">${variants.filter(([,path]) => path).map(([label, path, width]) => `<figure><figcaption>${label} · ${width} CSS px</figcaption><img src="${pathToFileURL(join(root, 'public', path.slice(1))).href}" width="${width}" alt="${escape(image.alt)}"></figure>`).join('')}</div></article>`);
}
await mkdir(dirname(output), { recursive: true });
await writeFile(output, `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>HECAVEX private visual acceptance sheet</title><style>body{margin:32px;background:#ece9e1;color:#151719;font:16px/1.5 system-ui}article{border-top:1px solid #30383b;padding:24px 0}.variants{display:flex;gap:24px;flex-wrap:wrap}figure{margin:0;max-width:100%}img{height:auto;max-width:100%;border:1px solid #30383b}figcaption{margin-bottom:8px}</style><h1>HECAVEX private visual acceptance sheet</h1><p>Cover, 320 px card and 600 px social preview. Generated ${new Date().toISOString()}. This is not evidence of owner approval, a new investigation or improved CTR.</p><p>Check legibility, meaningful crop, accurate language, real versus illustrative content and caption-to-claim support. Preserve original evidence. Do not replace a series before approving representative examples.</p>${cards.join('')}</html>\n`);
console.log(`Private preview sheet: ${output} (${cards.length} localized publications)`);
