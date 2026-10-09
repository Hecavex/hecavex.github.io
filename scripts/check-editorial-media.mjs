import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { parse } from 'yaml';
import { imageDimensions } from '../src/lib/image-dimensions.mjs';
import { isApprovedPublication } from '../src/lib/publication-state.mjs';

const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const safeImagePath = (path) => typeof path === 'string' && path.startsWith('/assets/img/posts/') && !/[\\%?#:\u0000-\u001f]/.test(path) && !path.split('/').some((segment) => segment === '.' || segment === '..');

export function generatedInlineCaptionIsAdjacent(source, path, lang) {
  const marker = `](${path})`;
  const prefix = lang === 'lt' ? 'DI sukurta redakcinė iliustracija, ne įrodymas' : 'AI-generated editorial illustration, not evidence';
  let offset = source.indexOf(marker);
  if (offset < 0) return false;
  while (offset >= 0) {
    const afterImage = source.slice(offset + marker.length).trimStart();
    const caption = afterImage.match(/^\*([^\n]*?)\*(?:\s*\n|$)/)?.[1];
    if (!caption?.startsWith(prefix)) return false;
    offset = source.indexOf(marker, offset + marker.length);
  }
  return true;
}

export async function mediaCatalogueErrors(catalogue, readAsset) {
  const errors = [];
  const ids = new Set();
  if (catalogue?.version !== 1 || !Array.isArray(catalogue?.records) || !catalogue.records.length) return ['Editorial media catalogue requires version 1 and non-empty records'];
  for (const record of catalogue.records) {
    const id = record?.id;
    if (typeof id !== 'string' || !id.trim() || ids.has(id)) errors.push(`Duplicate or missing media ID: ${id}`);
    ids.add(id);
    if (!['cover', 'inline'].includes(record.placement)) errors.push(`${id}: invalid placement`);
    if (!['illustration', 'evidence'].includes(record.presentation)) errors.push(`${id}: invalid presentation`);
    if (!['retained', 'generated', 'source-evidence'].includes(record.source_type)) errors.push(`${id}: invalid source type`);
    if (!record.translation_key || !record.rights) errors.push(`${id}: translation key and rights boundary are required`);
    if (record.source_type === 'generated') {
      const generation = record.generation;
      if (record.presentation !== 'illustration') errors.push(`${id}: generated artwork cannot be evidence`);
      if (!generation?.tool || !generation.request_id || !generation.prompt || !generation.processing || !Number.isFinite(Date.parse(generation.recorded_at)) || !/^[a-f0-9]{64}$/.test(generation.original_sha256 ?? '')) errors.push(`${id}: incomplete generation provenance`);
    }
    if (!Array.isArray(record.files) || !record.files.length) { errors.push(`${id}: no derivative files`); continue; }
    for (const file of record.files) {
      if (!safeImagePath(file.path)) { errors.push(`${id}: unsafe local asset path`); continue; }
      if (record.source_type === 'generated' && !file.path.endsWith('.webp')) errors.push(`${id}: generated publication derivatives must be WebP`);
      let bytes;
      try { bytes = await readAsset(file.path); } catch { errors.push(`${id}: missing asset ${file.path}`); continue; }
      const dimensions = imageDimensions(bytes);
      if (!dimensions || file.width !== dimensions.width || file.height !== dimensions.height) errors.push(`${id}: intrinsic dimensions differ for ${file.path}`);
      if (file.bytes !== bytes.length || sha256(bytes) !== file.sha256) errors.push(`${id}: bytes or SHA-256 differ for ${file.path}`);
      if (bytes.length > 384 * 1024) errors.push(`${id}: asset exceeds unchanged 384 KiB image budget`);
      if (record.source_type === 'generated' && !(bytes.toString('ascii',0,4)==='RIFF' && bytes.toString('ascii',8,12)==='WEBP')) errors.push(`${id}: generated derivative content is not WebP`);
    }
  }
  return errors;
}

async function posts(directory) {
  const output = [];
  for (const entry of await readdir(directory, {withFileTypes:true})) {
    const path = join(directory,entry.name);
    if (entry.isDirectory()) output.push(...await posts(path));
    else if (/\.md(?:arkdown)?$/.test(entry.name)) output.push(path);
  }
  return output;
}

export async function checkEditorialMedia(root = resolve(import.meta.dirname,'..')) {
  const catalogue = JSON.parse(await readFile(join(root,'src/data/editorial-media.json'),'utf8'));
  const errors = await mediaCatalogueErrors(catalogue,(path) => readFile(join(root,'public',path.slice(1))));
  const records = new Map(catalogue.records.map((record) => [record.id,record]));
  const inline = catalogue.records.filter((record) => record.placement === 'inline');
  let covers = 0;
  for (const path of await posts(join(root,'src/content/posts'))) {
    const source = await readFile(path,'utf8');
    const match = source.replace(/^\uFEFF/,'').match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) continue;
    const data = parse(match[1]);
    if (!isApprovedPublication(data)) continue;
    const image = data.image;
    if (image) {
      covers += 1;
      const record = records.get(image.provenance_id);
      if (!record || record.placement !== 'cover' || record.translation_key !== data.translation_key || record.presentation !== image.presentation || record.source_type !== image.source_type) errors.push(`${path}: image classification/provenance does not match the catalogue`);
      else {
        for (const [field,width,height] of [['path','width','height'],['hero','hero_width','hero_height'],['thumbnail','thumbnail_width','thumbnail_height']]) {
          if (!image[field]) continue;
          const file = record.files.find((file) => file.path === image[field]);
          const actualWidth = field === 'hero' ? image[width] ?? image.width : image[width];
          const actualHeight = field === 'hero' ? image[height] ?? image.height : image[height];
          if (!file || file.width !== actualWidth || file.height !== actualHeight) errors.push(`${path}: image.${field} dimensions or path do not match the catalogue`);
        }
      }
    }
    for (const record of inline.filter((record) => record.translation_key === data.translation_key)) {
      for (const file of record.files) {
        if (!source.includes(`](${file.path})`)) errors.push(`${path}: declared inline media ${record.id} is not used`);
        if (record.source_type === 'generated' && !generatedInlineCaptionIsAdjacent(source,file.path,data.lang)) errors.push(`${path}: generated inline media requires an adjacent localized non-evidence caption`);
      }
    }
  }
  if (errors.length) throw new Error(`Editorial media contract failed:\n- ${errors.join('\n- ')}`);
  console.log(`Editorial media contract passed (${catalogue.records.length} provenance records; ${covers} localized covers; generated derivatives only, originals private).`);
  return {records:catalogue.records.length,covers};
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(import.meta.filename)) checkEditorialMedia().catch((error) => {console.error(error.message);process.exitCode=1;});
