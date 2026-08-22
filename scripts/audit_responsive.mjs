#!/usr/bin/env node

import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { chromium } from 'playwright-core';

const siteRoot = resolve(process.argv[2] ?? 'dist');
const browserCandidates = [
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser'
].filter(Boolean);
const executablePath = browserCandidates.find((candidate) => existsSync(candidate));
if (!executablePath) throw new Error('No Chromium browser found. Set PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH.');

const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' };

const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://127.0.0.1').pathname);
    let target = join(siteRoot, normalize(pathname).replace(/^[/\\]+/, ''));
    if (!target.startsWith(`${siteRoot}${sep}`) && target !== siteRoot) throw new Error('path traversal');
    try { if ((await stat(target)).isDirectory()) target = join(target, 'index.html'); } catch { if (!extname(target)) target = join(target, 'index.html'); }
    const body = await readFile(target);
    response.writeHead(200, { 'Content-Type': mime[extname(target)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' });
    response.end(body);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.end('Not found');
  }
});
await new Promise((accept) => server.listen(0, '127.0.0.1', accept));
const address = server.address();
const baseUrl = `http://127.0.0.1:${address.port}`;

const routes = [
  '/', '/en/', '/lt/', '/en/research/', '/lt/tyrimai/', '/en/briefings/', '/en/projects/',
  '/en/about/', '/lt/apie/', '/en/speaker/', '/lt/pranesejas/', '/en/contact/', '/lt/kontaktai/',
  '/en/research/unipark-smishing-campaign-infrastructure/', '/lt/tyrimai/unipark-smishing-infrastrukturos-tyrimas/'
];
const factRoutes = new Set(['/en/research/', '/lt/tyrimai/', '/en/about/', '/lt/apie/', '/en/speaker/', '/lt/pranesejas/', '/en/contact/', '/lt/kontaktai/']);
const outlineRoutes = new Set(['/en/about/', '/lt/apie/', '/en/speaker/', '/lt/pranesejas/', '/en/research/unipark-smishing-campaign-infrastructure/', '/lt/tyrimai/unipark-smishing-infrastrukturos-tyrimas/']);
const researchRoutes = new Set(['/en/research/', '/lt/tyrimai/']);
const legacyCtaRoutes = new Set(['/en/about/', '/lt/apie/', '/en/contact/', '/lt/kontaktai/']);
const widths = [320, 390, 768, 1160, 1440];
const failures = [];
const browser = await chromium.launch({ executablePath, headless: true });
const fail = (route, width, message) => failures.push(`${route} @ ${width}px: ${message}`);

try {
  for (const route of routes) {
    for (const width of widths) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce', serviceWorkers: 'block' });
      const page = await context.newPage();
      const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
      if (!response || response.status() !== 200) {
        fail(route, width, `expected HTTP 200, received ${response?.status() ?? 'no response'}`);
        await context.close();
        continue;
      }
      const state = await page.evaluate((viewportWidth) => {
        const root = document.documentElement;
        const header = document.querySelector('.site-header');
        const network = document.querySelector('.network-bar');
        const product = document.querySelector('.product-bar');
        const mark = document.querySelector('.brand img');
        const h1 = document.querySelector('h1');
        const hero = document.querySelector('.home-hero');
        const heroRect = hero?.getBoundingClientRect();
        const utility = document.querySelector('.header-utilities');
        const menuTrigger = document.querySelector('.mobile-navigation > summary');
        const bodyStyle = getComputedStyle(document.body);
        const rootStyle = getComputedStyle(root);
        const activeNetwork = document.querySelector('.portfolio-navigation a[aria-current="page"]');
        const dotStyle = activeNetwork ? getComputedStyle(activeNetwork, '::before') : undefined;
        const desktopOutline = document.querySelector('.content-outline--desktop');
        const mobileOutline = document.querySelector('.content-outline--mobile');
        const outlineLinks = [...(desktopOutline?.querySelectorAll('a[href^="#"]') ?? [])];
        const ctaButton = document.querySelector('.hx-page-cta .hx-button');
        const offscreen = [...document.querySelectorAll('main *, .site-header *')].filter((element) => {
          const style = getComputedStyle(element);
          if (style.display === 'none' || style.visibility === 'hidden' || style.position === 'fixed') return false;
          const rect = element.getBoundingClientRect();
          return rect.width > 0 && (rect.left < -1 || rect.right > viewportWidth + 1);
        }).slice(0, 6).map((element) => `${element.tagName}.${String(element.className).replace(/\s+/g, '.')}`);
        return {
          shell: header?.getAttribute('data-portfolio-shell'),
          overflow: Math.max(root.scrollWidth, document.body.scrollWidth) - root.clientWidth,
          offscreen,
          networkHeight: network?.getBoundingClientRect().height ?? 0,
          productHeight: product?.getBoundingClientRect().height ?? 0,
          productDisplay: product ? getComputedStyle(product).display : 'none',
          mobileDisplay: getComputedStyle(document.querySelector('.mobile-navigation')).display,
          menuTriggerHeight: menuTrigger?.getBoundingClientRect().height ?? 0,
          utilityWidth: utility?.getBoundingClientRect().width ?? 0,
          markWidth: mark?.getBoundingClientRect().width ?? 0,
          h1Size: h1 ? Number.parseFloat(getComputedStyle(h1).fontSize) : 0,
          heroHeight: hero?.getBoundingClientRect().height ?? 0,
          heroChildOverflow: heroRect ? Math.max(0, ...[...hero.children].map((child) => child.getBoundingClientRect().bottom - heroRect.bottom)) : 0,
          bodyFontSize: Number.parseFloat(bodyStyle.fontSize),
          bodyColor: bodyStyle.color,
          tokens: ['--bg-elevated', '--surface', '--surface-strong', '--line', '--line-strong', '--text-soft', '--muted', '--faint', '--cyan', '--cyan-bright'].map((token) => rootStyle.getPropertyValue(token).trim()),
          dot: dotStyle ? { width: dotStyle.width, height: dotStyle.height, marginRight: dotStyle.marginRight, color: dotStyle.backgroundColor } : undefined,
          networkLabels: [...document.querySelectorAll('.portfolio-navigation a')].map((link) => link.textContent.trim()),
          pageFactCount: document.querySelectorAll('.page-facts > div').length,
          desktopOutlineDisplay: desktopOutline ? getComputedStyle(desktopOutline).display : 'missing',
          mobileOutlineDisplay: mobileOutline ? getComputedStyle(mobileOutline).display : 'missing',
          outlineLinkCount: outlineLinks.length,
          outlineSubtitleCount: outlineLinks.filter((link) => link.closest('li')?.classList.contains('content-outline__depth-3')).length,
          missingOutlineTargets: outlineLinks.map((link) => decodeURIComponent(link.hash.slice(1))).filter((id) => !document.getElementById(id)),
          researchDescriptionCount: document.querySelectorAll('.catalogue-section .section-head p:not(.eyebrow)').length,
          hasBriefingPath: Boolean(document.querySelector('.briefing-path h2')),
          pageUpdatedValue: document.querySelector('.page-facts > div:last-child dd')?.textContent.trim() ?? '',
          ctaButtonHeight: ctaButton?.getBoundingClientRect().height ?? 0,
          ctaButtonDisplay: ctaButton ? getComputedStyle(ctaButton).display : 'missing',
          leadImageLinkName: document.querySelector('.lead-story-image')?.getAttribute('aria-label') ?? ''
        };
      }, width);
      if (state.shell !== 'v1') fail(route, width, 'portfolio shell marker is missing');
      if (state.overflow > 1) fail(route, width, `horizontal overflow is ${state.overflow}px (${state.offscreen.join(', ')})`);
      if (state.h1Size > 64.1) fail(route, width, `h1 exceeds 64px (${state.h1Size}px)`);
      if (state.markWidth < 33.5 || state.markWidth > 36.5) fail(route, width, `brand mark is ${state.markWidth}px rather than 34–36px`);
      if (state.networkLabels.join('|') !== 'Research|Radar|APT Notes|Labs|Data') fail(route, width, 'network navigation order differs from the portfolio contract');
      if (Math.abs(state.bodyFontSize - 15.2) > 0.05 || state.bodyColor !== 'rgb(182, 198, 207)') fail(route, width, `body type/color changed (${state.bodyFontSize}px, ${state.bodyColor})`);
      if (state.tokens.join('|') !== '#0b1117|#0b1117|#101923|#1e3440|#1e3440|#b6c6cf|#8397a3|#8397a3|#44c7dc|#44c7dc') fail(route, width, `shared Cold Signal tokens changed (${state.tokens.join('|')})`);
      if (state.dot && (Math.abs(Number.parseFloat(state.dot.width) - 4.48) > 0.02 || Math.abs(Number.parseFloat(state.dot.height) - 4.48) > 0.02 || Math.abs(Number.parseFloat(state.dot.marginRight) - 8.8) > 0.02 || state.dot.color !== 'rgb(68, 199, 220)')) fail(route, width, `active network dot geometry changed (${JSON.stringify(state.dot)})`);
      if (factRoutes.has(route) && state.pageFactCount !== 4) fail(route, width, `page fact rail contains ${state.pageFactCount} records instead of 4`);
      if (outlineRoutes.has(route)) {
        if (state.outlineLinkCount < 2) fail(route, width, `content outline contains only ${state.outlineLinkCount} links`);
        if (state.missingOutlineTargets.length) fail(route, width, `content outline has missing targets: ${state.missingOutlineTargets.join(', ')}`);
        if (route.includes('unipark') && state.outlineSubtitleCount < 1) fail(route, width, 'research outline does not expose H3 subtitles');
        if (width <= 1024) {
          if (state.desktopOutlineDisplay !== 'none' || state.mobileOutlineDisplay === 'none') fail(route, width, `mobile outline mode is wrong (${state.desktopOutlineDisplay}/${state.mobileOutlineDisplay})`);
        } else if (state.desktopOutlineDisplay === 'none' || state.mobileOutlineDisplay !== 'none') fail(route, width, `desktop outline mode is wrong (${state.desktopOutlineDisplay}/${state.mobileOutlineDisplay})`);
      }
      if (researchRoutes.has(route) && (state.researchDescriptionCount < 4 || !state.hasBriefingPath || !/^\d{4}-\d{2}-\d{2}$/.test(state.pageUpdatedValue))) fail(route, width, `research catalogue context is incomplete (${state.researchDescriptionCount} descriptions, briefing path ${state.hasBriefingPath}, updated ${state.pageUpdatedValue})`);
      if (legacyCtaRoutes.has(route) && (!['flex', 'inline-flex'].includes(state.ctaButtonDisplay) || state.ctaButtonHeight < 43 || state.ctaButtonHeight > 45)) fail(route, width, `restored page CTA is not a 44px flex control (${state.ctaButtonDisplay}, ${state.ctaButtonHeight}px)`);
      if (['/en/', '/lt/'].includes(route) && !state.leadImageLinkName) fail(route, width, 'lead-story image link has no accessible name');
      if (width <= 1160) {
        if (Math.abs(state.networkHeight - 64) > 1) fail(route, width, `mobile header is ${state.networkHeight}px instead of 64px`);
        if (state.productDisplay !== 'none') fail(route, width, 'desktop product row remains visible below 1160px');
        if (state.mobileDisplay === 'none') fail(route, width, 'mobile navigation is hidden below 1160px');
        if (Math.abs(state.menuTriggerHeight - 44) > 1) fail(route, width, `mobile trigger is ${state.menuTriggerHeight}px instead of 44px`);
      } else {
        if (Math.abs(state.networkHeight - 64) > 1) fail(route, width, `network row is ${state.networkHeight}px instead of 64px`);
        if (Math.abs(state.productHeight - 52) > 1) fail(route, width, `product row is ${state.productHeight}px instead of 52px`);
        if (state.productDisplay === 'none') fail(route, width, 'desktop product row is hidden at or above 1160px');
        if (Math.abs(state.utilityWidth - 144) > 1) fail(route, width, `desktop utility is ${state.utilityWidth}px instead of 9rem`);
      }
      if (['/en/', '/lt/'].includes(route) && width === 1440) {
        if (state.heroHeight > 430.5) fail(route, width, `home hero exceeds 430px (${state.heroHeight}px)`);
        if (state.heroChildOverflow > 1) fail(route, width, `home hero child overflows its panel by ${state.heroChildOverflow}px`);
      }

      await page.keyboard.press('Tab');
      const focusedSkip = await page.evaluate(() => document.activeElement?.classList.contains('skip-link') && getComputedStyle(document.activeElement).outlineStyle !== 'none');
      if (!focusedSkip) fail(route, width, 'skip link is not the first visibly focused control');

      if (width <= 1160) {
        const summary = page.locator('.mobile-navigation > summary');
        await summary.click();
        if (!(await page.locator('.mobile-navigation[open] .mobile-product-navigation').isVisible())) fail(route, width, 'mobile product navigation did not open');
        if (width === 320) {
          const panelWidth = await page.locator('.mobile-navigation-panel').evaluate((node) => node.getBoundingClientRect().width);
          if (Math.abs(panelWidth - 288) > 1) fail(route, width, `mobile panel is ${panelWidth}px instead of 288px`);
        }
        if ((await page.locator('.mobile-navigation[open] .mobile-portfolio-navigation a').count()) !== 5) fail(route, width, 'mobile network navigation does not contain five destinations');
        await page.keyboard.press('Escape');
        if (await page.locator('.mobile-navigation').evaluate((node) => node.open)) fail(route, width, 'Escape does not close mobile navigation');
      } else {
        const trigger = page.locator('[data-search-open]').last();
        await trigger.click();
        if (!(await page.locator('[data-search-dialog]').evaluate((node) => node.open))) fail(route, width, 'search dialog did not open');
        if (!(await page.locator('[data-search-input]').evaluate((node) => document.activeElement === node))) fail(route, width, 'search input did not receive focus');
        await page.keyboard.press('Escape');
      }
      await context.close();
    }
  }

  const noScript = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 }, reducedMotion: 'reduce', serviceWorkers: 'block' });
  const page = await noScript.newPage();
  await page.goto(`${baseUrl}/en/`, { waitUntil: 'domcontentloaded' });
  await page.locator('.mobile-navigation > summary').click();
  const noScriptState = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    productLinks: document.querySelectorAll('.mobile-navigation[open] .mobile-product-navigation a').length,
    networkLinks: document.querySelectorAll('.mobile-navigation[open] .mobile-portfolio-navigation a').length,
    purpose: document.querySelector('main h1')?.textContent.trim() ?? ''
  }));
  if (noScriptState.overflow > 1) fail('/en/ (no JavaScript)', 390, 'page overflows horizontally');
  if (noScriptState.productLinks < 7 || noScriptState.networkLinks !== 5) fail('/en/ (no JavaScript)', 390, 'native details navigation is incomplete');
  if (!noScriptState.purpose) fail('/en/ (no JavaScript)', 390, 'page purpose is unavailable');

  await page.goto(`${baseUrl}/lt/tyrimai/unipark-smishing-infrastrukturos-tyrimas/`, { waitUntil: 'domcontentloaded' });
  const noScriptOutline = await page.evaluate(() => {
    const outline = document.querySelector('.content-outline--mobile');
    const links = [...(outline?.querySelectorAll('a[href^="#"]') ?? [])];
    return {
      exists: Boolean(outline),
      open: outline?.open ?? false,
      links: links.length,
      missingTargets: links.map((link) => decodeURIComponent(link.hash.slice(1))).filter((id) => !document.getElementById(id)),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
    };
  });
  if (!noScriptOutline.exists || noScriptOutline.links < 2) fail('/lt/tyrimai/unipark-smishing-infrastrukturos-tyrimas/ (no JavaScript)', 390, 'server-rendered outline is missing or empty');
  if (noScriptOutline.open) fail('/lt/tyrimai/unipark-smishing-infrastrukturos-tyrimas/ (no JavaScript)', 390, 'mobile outline should start collapsed');
  if (noScriptOutline.missingTargets.length) fail('/lt/tyrimai/unipark-smishing-infrastrukturos-tyrimas/ (no JavaScript)', 390, `outline targets are missing: ${noScriptOutline.missingTargets.join(', ')}`);
  if (noScriptOutline.overflow > 1) fail('/lt/tyrimai/unipark-smishing-infrastrukturos-tyrimas/ (no JavaScript)', 390, `page overflows horizontally by ${noScriptOutline.overflow}px`);
  await noScript.close();
} finally {
  await browser.close();
  await new Promise((accept) => server.close(accept));
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`Responsive audit passed: ${routes.length} pages × ${widths.length} viewports plus no-JavaScript navigation; portfolio geometry, 64px heading cap and 320px overflow gate are intact.`);
