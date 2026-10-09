import test from 'node:test';
import assert from 'node:assert/strict';
import figures, { removeRepeatedOpeningIllustration } from '../src/lib/rehype-evidence-figures.mjs';

const text = (value) => ({ type: 'text', value });
const element = (tagName, children = [], properties = {}) => ({ type: 'element', tagName, children, properties });
test('separate image and italic caption form a linked figure without consuming following prose', () => {
  const prose = element('p', [text('Unrelated narrative')]);
  const tree = { children: [element('p', [element('img', [], { src: '/assets/example.png' })]), text('\n'), element('p', [element('em', [text('Retained evidence')])]), prose] };
  figures()(tree, { path: '/posts/lt/example.md' });
  assert.equal(tree.children.length, 2);
  assert.equal(tree.children[1], prose);
  assert.equal(tree.children[0].tagName, 'figure');
  const link = tree.children[0].children[1].children.at(-1);
  assert.equal(link.properties.href, '/assets/example.png');
  assert.match(link.children[0].value, /Atverti/);
});
test('ordinary following prose stays separate and remote images are not promoted', () => {
  const tree = { children: [element('p', [element('img', [], { src: '/assets/example.png' })]), element('p', [text('Narrative'), element('em', [text('emphasis')])])] };
  figures()(tree);
  assert.equal(tree.children[0].tagName, 'p');
  assert.equal(tree.children.length, 2);
  const remote = { children: [element('p', [element('img', [], { src: 'https://example.invalid/image.png' }), element('em', [text('Caption')])])] };
  figures()(remote);
  assert.equal(remote.children[0].tagName, 'figure');
  assert.equal(remote.children[0].children[1].children.length, 1);
});
test('only the repeated opening illustration is removed and its caption and source anchor survive', () => {
  const caption = element('p', [element('em', [text('Original analytical introduction'),element('a',[text('Source')],{href:'#citation-1'})])]);
  const screenshot = element('p',[element('img',[],{src:'/assets/evidence.png'})]);
  const tree = {children:[text('\n'),element('p',[element('img',[],{src:'/assets/cover.webp'})]),caption,screenshot]};
  removeRepeatedOpeningIllustration(tree,{path:'/assets/cover.webp',presentation:'illustration'});
  assert.deepEqual(tree.children,[text('\n'),caption,screenshot]);
  assert.equal(caption.children[0].children[1].properties.href,'#citation-1');
});
test('evidence covers, later illustrations and mismatched opening images are never suppressed', () => {
  for (const [image,first] of [
    [{path:'/assets/cover.webp',presentation:'evidence'},element('p',[element('img',[],{src:'/assets/cover.webp'})])],
    [{path:'/assets/cover.webp',presentation:'illustration'},element('h2',[text('Actual heading')])],
    [{path:'/assets/cover.webp',presentation:'illustration'},element('p',[element('img',[],{src:'/assets/other.png'})])]
  ]) {
    const tree={children:[first]};
    removeRepeatedOpeningIllustration(tree,image);
    assert.deepEqual(tree.children,[first]);
  }
});
test('a generated figure opens the public full-size illustration without calling it the private original', () => {
  const tree={children:[element('p',[element('img',[],{src:'/assets/generated.webp'})]),element('p',[element('em',[text('AI-generated editorial illustration, not evidence.')])])]};
  figures()(tree,{path:'/posts/en/example.md'});
  assert.equal(tree.children[0].properties['data-presentation'],'illustration');
  const link=tree.children[0].children[1].children.at(-1);
  assert.equal(link.properties.href,'/assets/generated.webp');
  assert.equal(link.children[0].value,'Open full-size illustration');
});
