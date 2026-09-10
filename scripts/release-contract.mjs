export const releasePaths = Object.freeze(['/en/', '/lt/', '/en/research/', '/lt/tyrimai/', '/data/', '/lt/duomenys/', '/en/search.json', '/lt/search.json', '/en/feed.xml', '/lt/feed.xml', '/.well-known/security.txt', '/data/publications.json', '/assets/media/hecavex-media-kit-en.html', '/assets/media/hecavex-media-kit-lt.html', '/assets/media/hecavex-media-kit-en.txt', '/assets/media/hecavex-media-kit-lt.txt', '/assets/media/hecavex-media-kit-en.pdf', '/assets/media/hecavex-media-kit-lt.pdf', '/citations/en/research/adform-supply-chain-crypto-clipper.json', '/citations/lt/tyrimai/adform-supply-chain-crypto-clipper.bib']);
export function validateRelease(release, expectedRevision) {
  if (release.schemaVersion !== 1 || release.product !== 'hecavex-research' || release.revision !== expectedRevision) throw new Error('Live release identity does not match the deployed revision');
  if (!Array.isArray(release.files) || release.files.length !== releasePaths.length || new Set(release.files.map((file) => file.path)).size !== releasePaths.length) throw new Error('Release manifest has missing or repeated paths');
  for (const file of release.files) {
    if (!releasePaths.includes(file.path) || !Number.isSafeInteger(file.bytes) || file.bytes < 1 || !/^[a-f0-9]{64}$/.test(file.sha256)) throw new Error('Invalid release manifest entry');
  }
}
