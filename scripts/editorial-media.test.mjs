import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { generatedInlineCaptionIsAdjacent, mediaCatalogueErrors } from './check-editorial-media.mjs';

const catalogue = JSON.parse(await readFile(new URL('../src/data/editorial-media.json',import.meta.url),'utf8'));
const cover = catalogue.records.find((record) => record.source_type === 'generated' && record.placement === 'cover');
const asset = (path) => readFile(new URL(`../public${path}`,import.meta.url));
const sample = () => ({version:1,records:[structuredClone(cover)]});
test('generated derivatives carry exact public dimensions, bytes, hashes and a distinct provenance record', async () => {
  assert.deepEqual(await mediaCatalogueErrors(sample(),asset),[]);
});
test('changing a byte or declared dimensions cannot silently keep an accepted media record', async () => {
  const changed = sample();
  changed.records[0].files[0].width += 1;
  assert.match((await mediaCatalogueErrors(changed,asset)).join('\n'),/intrinsic dimensions differ/);
  const corrupted = (path) => asset(path).then((bytes) => {const clone=Buffer.from(bytes);clone[clone.length-1]^=1;return clone;});
  assert.match((await mediaCatalogueErrors(sample(),corrupted)).join('\n'),/SHA-256 differ/);
});
test('generated art can never be relabelled as evidence or published as a raw original', async () => {
  const evidence = sample();
  evidence.records[0].presentation='evidence';
  assert.match((await mediaCatalogueErrors(evidence,asset)).join('\n'),/cannot be evidence/);
  const raw = sample();
  raw.records[0].files[0].path=raw.records[0].files[0].path.replace('.webp','.png');
  assert.match((await mediaCatalogueErrors(raw,asset)).join('\n'),/must be WebP/);
});
test('missing provenance and unsafe asset paths fail before reading outside public image scope', async () => {
  const unsafe = sample();
  unsafe.records[0].files=[unsafe.records[0].files[0]];
  unsafe.records[0].files[0].path='/assets/img/posts/../../private.png';
  let invoked=false;
  assert.match((await mediaCatalogueErrors(unsafe,async () => {invoked=true;throw new Error('must not read');})).join('\n'),/unsafe local asset path/);
  assert.equal(invoked,false);
  const missing = sample();
  delete missing.records[0].generation.original_sha256;
  assert.match((await mediaCatalogueErrors(missing,asset)).join('\n'),/incomplete generation provenance/);
  const duplicate = sample();
  duplicate.records.push(structuredClone(cover));
  assert.match((await mediaCatalogueErrors(duplicate,asset)).join('\n'),/Duplicate or missing media ID/);
});
test('asset file-size budget catches a consistent but oversized derivative', async () => {
  const tooLarge=sample();
  const bytes=Buffer.concat([await asset(cover.files[0].path),Buffer.alloc(384*1024)]);
  tooLarge.records[0].files=[{...tooLarge.records[0].files[0],bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')}];
  assert.match((await mediaCatalogueErrors(tooLarge,async()=>bytes)).join('\n'),/exceeds unchanged/);
});
test('a non-evidence caption must accompany every generated inline image, not merely appear elsewhere', () => {
  const path='/assets/img/posts/example/illustration-v1.webp';
  const image=`![Fictional illustration](${path})`;
  const caption='AI-generated editorial illustration, not evidence or an incident screenshot.';
  assert.equal(generatedInlineCaptionIsAdjacent(`${image}\n\n*${caption}*\n`,path,'en'),true);
  assert.equal(generatedInlineCaptionIsAdjacent(`${image}\n\nAn unrelated paragraph.\n\n*${caption}*\n`,path,'en'),false);
  assert.equal(generatedInlineCaptionIsAdjacent(`*${caption}*\n\n${image}\n`,path,'en'),false);
  assert.equal(generatedInlineCaptionIsAdjacent(`${image}\n\n*${caption}*\n\n${image}\n`,path,'en'),false);
  assert.equal(generatedInlineCaptionIsAdjacent(`${image}\n\n*DI sukurta redakcinė iliustracija, ne įrodymas ar incidento ekrano kopija.*\n`,path,'lt'),true);
});
