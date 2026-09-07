import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, sep } from 'node:path';

const publicRoot = resolve('public');
const manifest = JSON.parse(await readFile(resolve(publicRoot, 'assets/research/github-malicious-python-001/retained-evidence.json'), 'utf8'));
if (manifest.kind !== 'retained-publication-screenshots' || manifest.collectionTimestamp !== null || manifest.files.length !== 6) throw new Error('Unexpected historical evidence contract');
const seen = new Set();
for (const file of manifest.files) {
  const path = resolve(publicRoot, file.path.replace(/^\//, ''));
  if (!path.startsWith(publicRoot + sep) || seen.has(path) || !path.endsWith('.png')) throw new Error('Invalid or repeated retained evidence path');
  seen.add(path);
  const bytes = await readFile(path);
  if (bytes.length !== file.bytes || createHash('sha256').update(bytes).digest('hex') !== file.sha256) throw new Error(`Retained evidence mismatch: ${file.path}`);
}
console.log('Retained evidence verified: six historical PNGs, not sample hashes.');
