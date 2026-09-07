import test from 'node:test';
import assert from 'node:assert/strict';
import figures from '../src/lib/rehype-evidence-figures.mjs';

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
