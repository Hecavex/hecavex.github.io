import assert from 'node:assert/strict';
import test from 'node:test';
import { releasePaths, validateRelease } from './release-contract.mjs';
const revision = 'a'.repeat(40);
const fixture = () => ({ schemaVersion: 1, product: 'hecavex-research', revision, files: releasePaths.map((path) => ({ path, bytes: 100, sha256: 'b'.repeat(64) })) });
test('release verification rejects an old deployment even when it is reachable', () => {
  assert.doesNotThrow(() => validateRelease(fixture(), revision));
  assert.throws(() => validateRelease(fixture(), 'c'.repeat(40)), /identity/);
});
test('release inventory requires exact EN/LT representative paths', () => {
  const missing = fixture(); missing.files.pop();
  assert.throws(() => validateRelease(missing, revision), /missing/);
  const repeated = fixture(); repeated.files[0] = repeated.files[1];
  assert.throws(() => validateRelease(repeated, revision), /repeated/);
  const external = fixture(); external.files[0].path = 'https://example.com/';
  assert.throws(() => validateRelease(external, revision), /Invalid/);
});
test('release digests and lengths cannot be malformed', () => {
  for (const value of [0, -1, 1.5, '100']) {
    const release = fixture(); release.files[0].bytes = value;
    assert.throws(() => validateRelease(release, revision), /Invalid/);
  }
  const release = fixture(); release.files[0].sha256 = 'unverified';
  assert.throws(() => validateRelease(release, revision), /Invalid/);
});
