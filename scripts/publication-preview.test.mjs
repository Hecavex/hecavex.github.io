import test from 'node:test';
import assert from 'node:assert/strict';
import { publicationPreview, publicationImageCaption, publicationImageDimensions, publicationImagePresentation, publicationImageSrcSet, publicationSocialAlt } from '../src/lib/publication-preview.mjs';

const post = { translationKey: 'research-record', lang: 'lt', contentType: 'investigation' };
test('unclassified and legacy covers stay text-led instead of implying evidence', () => {
  for (const image of [undefined, '/legacy.png', {path:'/cover.webp'}]) {
    assert.equal(publicationPreview({...post,image}), undefined);
    assert.equal(publicationPreview({...post,image},'thumbnail'), undefined);
  }
});
test('explicit evidence preview retains its separate meaning', () => {
  const evidence = {...post,image:{path:'/evidence.png',thumbnail:'/preview.webp',presentation:'evidence'}};
  assert.equal(publicationPreview(evidence), '/evidence.png');
  assert.equal(publicationPreview(evidence,'thumbnail'), '/preview.webp');
  assert.equal(publicationPreview({...evidence,contentType:'signal-brief'}), '/evidence.png');
});
test('approved editorial illustrations are visible and explicitly distinguished from evidence', () => {
  const illustration = {...post,image:{path:'/cover.webp',thumbnail:'/card.webp',presentation:'illustration'}};
  assert.equal(publicationPreview(illustration), '/cover.webp');
  assert.equal(publicationPreview(illustration,'thumbnail'), '/card.webp');
  assert.equal(publicationImagePresentation(illustration), 'illustration');
  assert.equal(publicationImageCaption(illustration), 'Redakcinė iliustracija · ne įrodymas');
  assert.equal(publicationImageCaption({...illustration,lang:'en'}), 'Editorial illustration · not evidence');
  assert.equal(publicationImageCaption({...illustration,lang:'en',image:{...illustration.image,source_type:'generated'}}), 'AI-generated illustration · not evidence');
  assert.equal(publicationImageCaption({...illustration,image:{...illustration.image,source_type:'generated'}}), 'DI sukurta iliustracija · ne įrodymas');
  assert.equal(publicationImageCaption({...illustration,image:{...illustration.image,presentation:'evidence'}}), 'Įrodymų peržiūra');
  assert.equal(publicationImageCaption({...illustration,image:undefined}), '');
  assert.equal(publicationImagePresentation({...illustration,contentType:'signal-brief'}), 'illustration');
});
test('intrinsic dimensions and responsive variants keep the actual crop and exclude social imagery', () => {
  const illustration = {...post,image:{path:'/hero.webp',thumbnail:'/card.webp',presentation:'illustration',width:1600,height:900,thumbnail_width:720,thumbnail_height:405}};
  assert.deepEqual(publicationImageDimensions(illustration), {width:1600,height:900});
  assert.deepEqual(publicationImageDimensions(illustration,'thumbnail'), {width:720,height:405});
  assert.equal(publicationImageSrcSet(illustration,'thumbnail'), '/card.webp 720w, /hero.webp 1600w');
  assert.equal(publicationImageSrcSet({...illustration,image:{...illustration.image,width:1280,height:719,thumbnail_height:404}},'thumbnail'), '/card.webp 720w, /hero.webp 1280w');
  assert.equal(publicationImageSrcSet({...illustration,image:{...illustration.image,thumbnail_height:540}},'thumbnail'), undefined);
  assert.equal(publicationImageSrcSet({...illustration,image:{...illustration.image,thumbnail:undefined}},'thumbnail'), undefined);
  assert.equal(publicationImageSrcSet(illustration,'social'), undefined);
});
test('classified Briefings share responsive covers and localized generated-art labels', () => {
  const brief = {...post,contentType:'signal-brief',image:{path:'/brief-hero.webp',thumbnail:'/brief-card.webp',presentation:'illustration',source_type:'generated',width:1600,height:900,thumbnail_width:720,thumbnail_height:405}};
  assert.equal(publicationPreview(brief), '/brief-hero.webp');
  assert.equal(publicationPreview(brief,'thumbnail'), '/brief-card.webp');
  assert.equal(publicationImageSrcSet(brief), '/brief-card.webp 720w, /brief-hero.webp 1600w');
  assert.equal(publicationImageCaption(brief), 'DI sukurta iliustracija · ne įrodymas');
  assert.equal(publicationImageCaption({...brief,lang:'en'}), 'AI-generated illustration · not evidence');
  assert.equal(publicationPreview({...brief,image:{path:'/legacy-brief.svg'}}), undefined);
  assert.equal(publicationPreview(brief,'social'), '/assets/img/social/research-record-lt.png');
});
test('every language edition uses its dedicated typographic social card', () => {
  assert.equal(publicationPreview(post,'social'),'/assets/img/social/research-record-lt.png');
  assert.equal(publicationPreview({...post,lang:'en',image:'/legacy.png'},'social'),'/assets/img/social/research-record-en.png');
});
test('social alt describes the typographic title card independently of the editorial hero', () => {
  const title='An actual approved article title';
  const illustrated={...post,title,image:{path:'/hero.webp',presentation:'illustration',alt:'A fictional archive and lens'}};
  assert.equal(publicationSocialAlt({...illustrated,lang:'en'}),'HECAVEX typographic social card: '+title);
  assert.equal(publicationSocialAlt(illustrated),'HECAVEX tipografinė dalijimosi kortelė: '+title);
  assert.doesNotMatch(publicationSocialAlt(illustrated),/archive|lens/);
});
