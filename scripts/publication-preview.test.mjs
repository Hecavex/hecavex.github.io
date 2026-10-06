import test from 'node:test';
import assert from 'node:assert/strict';
import { publicationPreview } from '../src/lib/publication-preview.mjs';

const post = { translationKey: 'research-record', lang: 'lt', contentType: 'investigation' };
test('illustrative and legacy covers are not promoted as evidence', () => {
  for (const image of [undefined, '/legacy.png', {path:'/cover.webp'}, {path:'/cover.webp',presentation:'illustration'}]) {
    assert.equal(publicationPreview({...post,image}), undefined);
    assert.equal(publicationPreview({...post,image},'thumbnail'), undefined);
  }
});
test('only explicit evidence preview is allowed, body content is untouched', () => {
  const evidence = {...post,image:{path:'/evidence.png',thumbnail:'/preview.webp',presentation:'evidence'}};
  assert.equal(publicationPreview(evidence), '/evidence.png');
  assert.equal(publicationPreview(evidence,'thumbnail'), '/preview.webp');
  assert.equal(publicationPreview({...evidence,contentType:'signal-brief'}), undefined);
});
test('every language edition uses its dedicated typographic social card', () => {
  assert.equal(publicationPreview(post,'social'),'/assets/img/social/research-record-lt.png');
  assert.equal(publicationPreview({...post,lang:'en',image:'/legacy.png'},'social'),'/assets/img/social/research-record-en.png');
});
