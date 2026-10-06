export const releasePaths = Object.freeze([
  '/en/', '/lt/', '/en/research/', '/lt/tyrimai/', '/data/', '/lt/duomenys/',
  '/en/search.json', '/lt/search.json', '/en/feed.xml', '/lt/feed.xml',
  '/en/briefings/', '/lt/apzvalgos/', '/en/briefings/feed.xml', '/lt/apzvalgos/feed.xml',
  '/en/briefings/2026-08-30/', '/lt/apzvalgos/2026-08-30/',
  '/en/briefings/2026-09-06/', '/lt/apzvalgos/2026-09-06/',
  '/en/briefings/2026-09-13/', '/lt/apzvalgos/2026-09-13/',
  '/en/briefings/2026-09-20/', '/lt/apzvalgos/2026-09-20/',
  '/en/briefings/2026-09-27/', '/lt/apzvalgos/2026-09-27/',
  '/en/briefings/2026-10-04/', '/lt/apzvalgos/2026-10-04/',
  '/en/research/lithuania-phishing-infrastructure-radar-september-2026/',
  '/lt/tyrimai/phishing-infrastruktura-lietuvoje-radar-2026-rugsejis/',
  '/assets/data/radar-september-2026-baseline/README.md',
  '/assets/data/radar-september-2026-baseline/summary.json',
  '/assets/data/radar-september-2026-baseline/source-manifest.json',
  '/assets/data/radar-september-2026-baseline/replay.py',
  '/assets/data/radar-september-2026-baseline/replay_test.py',
  '/assets/data/radar-september-2026-baseline/daily.csv',
  '/assets/data/radar-september-2026-baseline/brands.csv',
  '/assets/data/radar-september-2026-baseline/LICENSE-CODE.txt',
  '/.well-known/security.txt', '/data/publications.json',
  '/assets/media/hecavex-media-kit-en.html', '/assets/media/hecavex-media-kit-lt.html',
  '/assets/media/hecavex-media-kit-en.txt', '/assets/media/hecavex-media-kit-lt.txt',
  '/assets/media/hecavex-media-kit-en.pdf', '/assets/media/hecavex-media-kit-lt.pdf',
  '/citations/en/research/adform-supply-chain-crypto-clipper.json',
  '/citations/lt/tyrimai/adform-supply-chain-crypto-clipper.bib'
]);
export function validateRelease(release, expectedRevision) {
  if (release.schemaVersion !== 1 || release.product !== 'hecavex-research' || release.revision !== expectedRevision) throw new Error('Live release identity does not match the deployed revision');
  if (!Array.isArray(release.files) || release.files.length !== releasePaths.length || new Set(release.files.map((file) => file.path)).size !== releasePaths.length) throw new Error('Release manifest has missing or repeated paths');
  for (const file of release.files) {
    if (!releasePaths.includes(file.path) || !Number.isSafeInteger(file.bytes) || file.bytes < 1 || !/^[a-f0-9]{64}$/.test(file.sha256)) throw new Error('Invalid release manifest entry');
  }
}
