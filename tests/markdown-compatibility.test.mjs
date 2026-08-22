import test from 'node:test';
import assert from 'node:assert/strict';
import { applyArticleImagePolicy } from '../src/lib/html-image-policy.mjs';
import rehypeEvidenceFigures from '../src/lib/rehype-evidence-figures.mjs';
import rehypeTableRegions from '../src/lib/rehype-table-regions.mjs';
import remarkKramdownAttributes from '../src/lib/remark-kramdown-attributes.mjs';

test('legacy table marker becomes a class instead of a bogus data row', () => {
  const table = {
    type: 'table',
    children: [
      { type: 'tableRow', children: [{ type: 'tableCell', children: [{ type: 'text', value: 'Heading' }] }] },
      { type: 'tableRow', children: [{ type: 'tableCell', children: [{ type: 'text', value: 'Value' }] }] },
      { type: 'tableRow', children: [{ type: 'tableCell', children: [{ type: 'text', value: '{:.hx-table-wide}' }] }, { type: 'tableCell', children: [] }] }
    ]
  };
  const tree = { type: 'root', children: [table] };
  remarkKramdownAttributes()(tree);
  assert.deepEqual(table.data.hProperties.className, ['hx-table-wide']);
  assert.equal(table.children.length, 2);
  assert.doesNotMatch(JSON.stringify(tree), /\{:/);
});

test('legacy prompt marker is removed from blockquote text and applied to the blockquote', () => {
  const quote = { type: 'blockquote', children: [{ type: 'paragraph', children: [{ type: 'text', value: 'Treat this as bounded evidence.\n{: .prompt-danger }' }] }] };
  const tree = { type: 'root', children: [quote] };
  remarkKramdownAttributes()(tree);
  assert.deepEqual(quote.data.hProperties.className, ['prompt-danger']);
  assert.equal(quote.children[0].children[0].value, 'Treat this as bounded evidence.');
});

test('standalone marker still attaches classes and ids to the preceding node', () => {
  const image = { type: 'image', url: '/evidence.svg' };
  const tree = { type: 'root', children: [image, { type: 'paragraph', children: [{ type: 'text', value: '{: .hx-evidence-figure #evidence-map }' }] }] };
  remarkKramdownAttributes()(tree);
  assert.equal(tree.children.length, 1);
  assert.deepEqual(image.data.hProperties, { className: ['hx-evidence-figure'], id: 'evidence-map' });
});

test('rendered tables are wrapped in a focusable named overflow region', () => {
  const table = {
    type: 'element', tagName: 'table', properties: {}, children: [
      { type: 'element', tagName: 'thead', properties: {}, children: [
        { type: 'element', tagName: 'tr', properties: {}, children: ['Indicator', 'Evidence', 'Assessment'].map((value) => ({ type: 'element', tagName: 'th', properties: {}, children: [{ type: 'text', value }] })) }
      ] }
    ]
  };
  const tree = { type: 'root', children: [table] };
  rehypeTableRegions()(tree);
  const region = tree.children[0];
  assert.equal(region.tagName, 'div');
  assert.equal(region.properties.role, 'region');
  assert.equal(region.properties.tabIndex, 0);
  assert.match(region.properties.ariaLabel, /Indicator · Evidence · Assessment/);
  assert.ok(region.properties.className.includes('table-scroll-region--wide'));
  assert.equal(region.children[1], table);
});

test('short tables avoid an unnecessary landmark and keyboard stop', () => {
  const table = {
    type: 'element', tagName: 'table', properties: {}, children: [
      { type: 'element', tagName: 'thead', properties: {}, children: [
        { type: 'element', tagName: 'tr', properties: {}, children: ['Field', 'Value'].map((value) => ({ type: 'element', tagName: 'th', properties: {}, children: [{ type: 'text', value }] })) }
      ] }
    ]
  };
  const tree = { type: 'root', children: [table] };
  rehypeTableRegions()(tree);
  const region = tree.children[0];
  assert.equal(region.properties.role, undefined);
  assert.equal(region.properties.tabIndex, undefined);
  assert.equal(region.properties.dataTableLabel, 'Field · Value');
});

test('an image followed by an italic caption becomes a semantic evidence figure', () => {
  const image = { type: 'element', tagName: 'img', properties: { src: '/evidence.svg', alt: 'Evidence map' }, children: [] };
  const tree = {
    type: 'root',
    children: [{
      type: 'element', tagName: 'p', properties: {}, children: [
        image,
        { type: 'text', value: '\n' },
        { type: 'element', tagName: 'em', properties: {}, children: [{ type: 'text', value: 'Public-source evidence captured on 22 August.' }] }
      ]
    }]
  };
  rehypeEvidenceFigures()(tree);
  const figure = tree.children[0];
  assert.equal(figure.tagName, 'figure');
  assert.deepEqual(figure.properties.className, ['hx-evidence-figure']);
  assert.equal(figure.children[0], image);
  assert.equal(figure.children[1].tagName, 'figcaption');
  assert.equal(figure.children[1].children[0].value, 'Public-source evidence captured on 22 August.');
});

test('final article HTML defers body images without overriding explicit loading policy', () => {
  const html = '<article><img src="/assets/img/brand/hecavex-mark.svg" alt=""><div class="article-body prose"><img src="/diagram.svg" alt="Diagram"><img src="/priority.svg" alt="Priority" loading="eager"></div></article>';
  const result = applyArticleImagePolicy(html);
  assert.match(result, /hecavex-mark\.svg" alt="">/);
  assert.match(result, /diagram\.svg" alt="Diagram" loading="lazy" decoding="async">/);
  assert.match(result, /priority\.svg" alt="Priority" loading="eager" decoding="async">/);
});
