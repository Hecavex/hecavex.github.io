import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const header = await readFile(new URL('../src/components/SiteHeader.astro', import.meta.url), 'utf8');
const css = await readFile(new URL('../public/assets/css/hecavex.css', import.meta.url), 'utf8');
const home = await readFile(new URL('../src/pages/[lang]/index.astro', import.meta.url), 'utf8');

test('header exposes the canonical cross-portfolio structural hooks', () => {
  for (const marker of ['data-portfolio-shell="v1"', 'portfolio-navigation', 'product-navigation', 'mobile-product-navigation', 'mobile-portfolio-navigation']) assert.match(header, new RegExp(marker));
  const positions = ['Research', 'Radar', 'APT Notes', 'Labs', 'Data'].map((label) => header.indexOf(`name: '${label}'`));
  // Network data is imported, so the rendered order is also checked by the browser audit.
  assert.ok(header.includes('networkNavigation.map'));
  assert.equal(positions.filter((position) => position >= 0).length, 0);
  assert.doesNotMatch(header, /sidebar|navigation-rail|publication-rail/i);
});

test('portfolio geometry and heading cap match the v1 shell contract', () => {
  for (const [token, value] of [
    ['bg-elevated', '#0b1117'], ['surface', '#0b1117'], ['surface-strong', '#101923'], ['line', '#1e3440'],
    ['line-strong', '#1e3440'], ['text-soft', '#b6c6cf'], ['muted', '#8397a3'],
    ['faint', '#8397a3'], ['cyan', '#44c7dc'], ['cyan-bright', '#44c7dc']
  ]) assert.match(css, new RegExp(`--${token}:\\s*${value}`));
  assert.match(css, /--content:\s*94rem/);
  assert.match(css, /--network-row:\s*4rem/);
  assert.match(css, /--product-row:\s*3\.25rem/);
  assert.match(css, /--header-offset:\s*7\.25rem/);
  assert.match(css, /font-size:\s*clamp\(2\.5rem,\s*5vw,\s*4rem\)/);
  assert.match(css, /@media \(max-width:\s*1160px\)/);
  assert.match(css, /grid-template-columns:\s*max-content minmax\(0, 1fr\) 9rem/);
  assert.match(css, /\.mobile-navigation summary\s*\{[^}]*min-height:\s*2\.75rem/s);
  assert.match(css, /\.mobile-navigation-panel\s*\{[^}]*width:\s*min\(34rem, calc\(100vw - 2rem\)\)/s);
  assert.match(css, /\.portfolio-navigation a\[aria-current="page"\]::before\s*\{[^}]*width:\s*0\.28rem[^}]*height:\s*0\.28rem[^}]*margin-right:\s*0\.55rem/s);
});

test('duplicate lead-story artwork is hidden from the accessibility tree', () => {
  assert.match(home, /class="lead-story-image"[^>]*aria-hidden="true"/);
});
