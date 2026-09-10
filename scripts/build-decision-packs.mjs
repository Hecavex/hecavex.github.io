import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { recordsCsv } from '../public/assets/data/signal-brief-005-decisions/consumer.mjs';

export const packs = ['signal-brief-005-decisions', 'cra-reporting-rehearsal'];
const base = new URL('../public/assets/data/', import.meta.url);
export async function generatedFiles(pack) {
  if (!packs.includes(pack)) throw new Error('Unknown decision pack');
  const directory = new URL(`${pack}/`, base);
  const source = JSON.parse(await readFile(new URL(pack === packs[0] ? 'records.json' : 'scenario.json', directory), 'utf8'));
  const output = new Map();
  if (pack === packs[0]) output.set('records.csv', recordsCsv(source));
  const names = [...new Set([...(await readdir(directory)).filter(name => name !== 'manifest.json'), ...output.keys()])].sort();
  const files = [];
  for (const name of names) {
    const bytes = output.has(name) ? Buffer.from(output.get(name), 'utf8') : await readFile(new URL(name, directory));
    files.push({ path: name, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') });
  }
  output.set('manifest.json', JSON.stringify({
    schemaVersion: '1.0.0', release: source.release,
    preparedOn: source.preparedOn ?? '2026-09-10',
    purpose: 'Integrity manifest for an educational, offline companion; not a human review or production validation receipt',
    files
  }, null, 2) + '\n');
  return { directory, output };
}
export async function build({ check = false } = {}) {
  for (const pack of packs) {
    const { directory, output } = await generatedFiles(pack);
    for (const [name, content] of output) {
      const target = new URL(name, directory);
      if (check) {
        const actual = await readFile(target, 'utf8').catch(() => null);
        if (actual !== content) throw new Error(`Stale or missing generated file: ${fileURLToPath(target)}`);
      } else await writeFile(target, content, 'utf8');
    }
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await build({ check: process.argv.includes('--check') });
  console.log('Decision-pack CSV and integrity manifests are current.');
}
