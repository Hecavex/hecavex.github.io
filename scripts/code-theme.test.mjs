import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { codeColorClasses, codeTheme, codeThemeClasses } from '../src/lib/code-theme.mjs';

const theme = {
  colors: { 'editor.background': '#171b1d', 'editor.foreground': '#ece9e1' },
  tokenColors: [
    { name: 'keyword', settings: { foreground: '#55b9b1', fontStyle: 'bold' } },
    { name: 'function', settings: { foreground: '#ece9e1', fontStyle: 'bold' } }
  ]
};

test('inline Shiki styles become classes', () => {
  const span = { type: 'element', tagName: 'span', properties: { style: 'color:#55B9B1;font-weight:bold' }, children: [] };
  const pre = { type: 'element', tagName: 'pre', properties: { class: 'astro-code hecavex', style: 'background-color:#171b1d;color:#ece9e1; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word;' }, children: [span] };
  codeThemeClasses(theme).root(pre);
  assert.equal(pre.properties.style, undefined);
  assert.equal(pre.properties.class, 'astro-code hecavex hx-code-text');
  assert.equal(span.properties.style, undefined);
  assert.equal(span.properties.class, 'hx-code-keyword hx-code-bold');
});

test('an unknown inline style fails the build instead of needing unsafe-inline', () => {
  const node = { type: 'element', tagName: 'span', properties: { style: 'color:#123456' }, children: [] };
  assert.throws(() => codeThemeClasses(theme).root(node), /Unmapped Shiki inline style/);
});

test('every class the publication theme can emit has a stylesheet rule', () => {
  const css = readFileSync('public/assets/css/modules/foundation.css', 'utf8');
  const base = css.match(/\.astro-code \{([^}]*)\}/)?.[1] ?? '';
  for (const declaration of [`background-color: ${codeTheme.colors['editor.background']}`, 'overflow-x: auto', 'white-space: pre-wrap', 'overflow-wrap: break-word']) {
    assert(base.includes(declaration), `.astro-code restates ${declaration}`);
  }
  for (const className of [...codeColorClasses(codeTheme).values(), 'hx-code-bold', 'hx-code-italic', 'hx-code-underline', 'hx-code-nosel']) {
    assert(css.includes(`.${className} {`), `${className} has a rule`);
  }
});
