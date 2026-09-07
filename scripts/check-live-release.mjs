import { createHash } from 'node:crypto';
import { releasePaths, validateRelease } from './release-contract.mjs';

const [base = 'https://hecavex.com', expectedRevision = process.env.GITHUB_SHA] = process.argv.slice(2);
if (!/^[a-f0-9]{40}$/.test(expectedRevision ?? '')) throw new Error('Provide the expected 40-character Git revision');
const site = new URL(base);
if (!['https:', 'http:'].includes(site.protocol)) throw new Error('Expected an HTTP(S) site');
const required = new Set(releasePaths);

async function fetchBytes(path) {
  const url = new URL(path, site);
  url.searchParams.set('release', expectedRevision);
  const response = await fetch(url, { signal: AbortSignal.timeout(15000), redirect: 'error', cache: 'no-store' });
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length > 2 * 1024 * 1024) throw new Error(`${path}: unexpected response size`);
  return bytes;
}

let failure;
for (let attempt = 1; attempt <= 12; attempt += 1) {
  try {
    const release = JSON.parse((await fetchBytes('/release.json')).toString('utf8'));
    validateRelease(release, expectedRevision);
    for (const file of release.files) {
      if (!required.has(file.path) || !Number.isSafeInteger(file.bytes) || !/^[a-f0-9]{64}$/.test(file.sha256)) throw new Error('Invalid release manifest entry');
      const bytes = await fetchBytes(file.path);
      if (bytes.length !== file.bytes || createHash('sha256').update(bytes).digest('hex') !== file.sha256) throw new Error(`${file.path}: deployed bytes differ from the release manifest`);
      if (file.path.endsWith('.json')) JSON.parse(bytes.toString('utf8'));
      if (file.path.endsWith('feed.xml') && !bytes.includes(Buffer.from('<feed'))) throw new Error('Invalid feed response');
      if (file.path.endsWith('security.txt') && !bytes.includes(Buffer.from('Contact: mailto:info@hecavex.com'))) throw new Error('Missing security contact');
    }
    console.log(`Verified live release ${expectedRevision}: ${required.size} EN/LT pages, data catalogues, search indexes, feeds and security contact.`);
    process.exit(0);
  } catch (error) {
    failure = error;
    console.warn(`Release check ${attempt}/12: ${error.message}`);
    if (attempt < 12) await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}
throw failure;
