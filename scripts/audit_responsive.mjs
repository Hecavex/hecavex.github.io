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
  '/', '/data/', '/en/', '/lt/', '/en/research/', '/lt/tyrimai/', '/en/briefings/', '/lt/apzvalgos/', '/en/projects/',
  '/en/about/', '/lt/apie/', '/en/speaker/', '/lt/pranesejas/', '/en/contact/', '/lt/kontaktai/',
  '/en/research/unipark-smishing-campaign-infrastructure/', '/lt/tyrimai/unipark-smishing-infrastrukturos-tyrimas/',
  '/en/research/cra-article-14-vulnerability-incident-reporting-guide/', '/lt/tyrimai/infrastrukturos-pivoting-101/',
  '/en/briefings/2026-08-22/', '/lt/apzvalgos/2026-08-22/'
];
const factRoutes = new Set(['/en/research/', '/lt/tyrimai/', '/en/about/', '/lt/apie/', '/en/speaker/', '/lt/pranesejas/', '/en/contact/', '/lt/kontaktai/']);
const outlineRoutes = new Set([
  '/en/research/', '/lt/tyrimai/', '/en/about/', '/lt/apie/', '/en/speaker/', '/lt/pranesejas/',
  '/en/research/unipark-smishing-campaign-infrastructure/', '/lt/tyrimai/unipark-smishing-infrastrukturos-tyrimas/',
  '/en/research/cra-article-14-vulnerability-incident-reporting-guide/', '/lt/tyrimai/infrastrukturos-pivoting-101/',
  '/en/briefings/2026-08-22/', '/lt/apzvalgos/2026-08-22/'
]);
const researchRoutes = new Set(['/en/research/', '/lt/tyrimai/']);
const contactRoutes = new Set(['/en/contact/', '/lt/kontaktai/']);
const catalogueIntroRoutes = new Set(['/en/research/', '/lt/tyrimai/', '/en/speaker/', '/lt/pranesejas/', '/en/contact/', '/lt/kontaktai/']);
const briefingRoutes = new Set(['/en/briefings/', '/lt/apzvalgos/']);
const legacyCtaRoutes = new Set(['/en/about/', '/lt/apie/', '/en/contact/', '/lt/kontaktai/']);
const signalRoutes = new Set(['/en/briefings/2026-08-22/', '/lt/apzvalgos/2026-08-22/']);
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
        const signalEntry = document.querySelector('.hx-signal-entry');
        const signalFacts = signalEntry?.querySelector('dl');
        const signalFactItems = [...(signalFacts?.children ?? [])];
        const signalFactRects = signalFactItems.map((item) => item.getBoundingClientRect());
        const ctaButton = document.querySelector('.hx-page-cta .hx-button');
        const pageShell = document.querySelector('.page-shell');
        const pageShellRect = pageShell?.getBoundingClientRect();
        const pageShellStyle = pageShell ? getComputedStyle(pageShell) : undefined;
        const pageIntro = document.querySelector('.page-intro--with-facts');
        const pageIntroRect = pageIntro?.getBoundingClientRect();
        const briefingList = document.querySelector('.briefing-list');
        const briefingListRect = briefingList?.getBoundingClientRect();
        const briefingCards = [...(briefingList?.querySelectorAll(':scope > .post-card') ?? [])];
        const briefingCardRects = briefingCards.map((card) => card.getBoundingClientRect());
        const briefingImageRect = briefingCards[0]?.querySelector('.post-card-image')?.getBoundingClientRect();
        const oddDataLinkLists = [...document.querySelectorAll('.data-catalogue .data-product__links')]
          .filter((list) => list.children.length % 2 === 1);
        const oddDataLinksFillRow = oddDataLinkLists.every((list) => {
          const lastItem = list.lastElementChild;
          if (!lastItem) return false;
          return Math.abs(lastItem.getBoundingClientRect().width - list.getBoundingClientRect().width) <= 3;
        });
        const stylesheet = document.querySelector('link[href*="/assets/css/hecavex.css"]');
        const siteScript = document.querySelector('script[src*="/assets/js/site.js"]');
        const oddResearchGrid = [...document.querySelectorAll('.catalogue-section .post-grid')]
          .find((grid) => grid.querySelectorAll(':scope > .post-card').length % 2 === 1);
        const oddResearchCards = oddResearchGrid
          ? [...oddResearchGrid.querySelectorAll(':scope > .post-card')]
          : [];
        const oddResearchGridRect = oddResearchGrid?.getBoundingClientRect();
        const oddResearchLastCardRect = oddResearchCards.at(-1)?.getBoundingClientRect();
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
          outlineStatusVisible: desktopOutline ? !desktopOutline.querySelector('[data-outline-status]')?.hidden : false,
          signalEntryCount: document.querySelectorAll('.hx-signal-entry').length,
          signalEntryBorder: signalEntry ? getComputedStyle(signalEntry).borderLeftWidth : '0px',
          signalFactDisplay: signalFacts ? getComputedStyle(signalFacts).display : 'missing',
          signalFactCount: signalFactItems.length,
          signalFactsShareRow: signalFactRects.length > 1 ? Math.abs(signalFactRects[0].top - signalFactRects[1].top) < 1 : false,
          researchMapCount: document.querySelectorAll('.content-outline--desktop.content-outline--map [data-outline-item]').length,
          actionRouteCount: document.querySelectorAll('.page-action-rail li').length,
          actionLinkCount: document.querySelectorAll('.page-action-rail a').length,
          researchDescriptionCount: document.querySelectorAll('.catalogue-section .section-head p:not(.eyebrow)').length,
          oddResearchCardCount: oddResearchCards.length,
          oddResearchLastCardLeftGap: oddResearchGridRect && oddResearchLastCardRect
            ? oddResearchLastCardRect.left - oddResearchGridRect.left
            : -1,
          oddResearchLastCardRightGap: oddResearchGridRect && oddResearchLastCardRect
            ? oddResearchGridRect.right - oddResearchLastCardRect.right
            : -1,
          hasBriefingPath: Boolean(document.querySelector('.briefing-path h2')),
          pageUpdatedValue: document.querySelector('.page-facts > div:last-child dd')?.textContent.trim() ?? '',
          ctaButtonHeight: ctaButton?.getBoundingClientRect().height ?? 0,
          ctaButtonDisplay: ctaButton ? getComputedStyle(ctaButton).display : 'missing',
          pageShellInnerWidth: pageShellRect && pageShellStyle
            ? pageShellRect.width
              - Number.parseFloat(pageShellStyle.paddingLeft)
              - Number.parseFloat(pageShellStyle.paddingRight)
              - Number.parseFloat(pageShellStyle.borderLeftWidth)
              - Number.parseFloat(pageShellStyle.borderRightWidth)
            : 0,
          pageIntroWidth: pageIntroRect?.width ?? 0,
          pageIntroHeight: pageIntroRect?.height ?? 0,
          briefingListWidth: briefingListRect?.width ?? 0,
          briefingImageWidth: briefingImageRect?.width ?? 0,
          briefingCardsShareRow: briefingCardRects.length > 1
            ? Math.abs(briefingCardRects[0].top - briefingCardRects[1].top) < 1
            : false,
          oddDataLinkListCount: oddDataLinkLists.length,
          oddDataLinksFillRow,
          leadImageLinkName: document.querySelector('.lead-story-image')?.getAttribute('aria-label') ?? '',
          landingEditionCount: document.querySelectorAll('.landing-edition-rail a').length,
          landingCurrentCount: document.querySelectorAll('.landing-current-grid > *').length,
          landingNetworkCount: document.querySelectorAll('.landing-network-grid > a').length,
          versionedAssets: Boolean(stylesheet?.getAttribute('href')?.match(/\?v=[^&]+$/) && siteScript?.getAttribute('src')?.match(/\?v=[^&]+$/))
        };
      }, width);
      if (state.shell !== 'v2') fail(route, width, 'portfolio shell marker is missing');
      if (state.overflow > 1) fail(route, width, `horizontal overflow is ${state.overflow}px (${state.offscreen.join(', ')})`);
      if (state.h1Size > 80.1) fail(route, width, `h1 exceeds 80px (${state.h1Size}px)`);
      if (state.markWidth < 33.5 || state.markWidth > 36.5) fail(route, width, `brand mark is ${state.markWidth}px rather than 34–36px`);
      if (state.networkLabels.join('|') !== 'Research|Radar|APT Notes|Labs|Data') fail(route, width, 'network navigation order differs from the portfolio contract');
      if (Math.abs(state.bodyFontSize - 15.2) > 0.05 || state.bodyColor !== 'rgb(236, 233, 225)') fail(route, width, `body type/color changed (${state.bodyFontSize}px, ${state.bodyColor})`);
      if (state.tokens.join('|') !== '#171b1d|#171b1d|#1d2326|#30383b|#30383b|#ece9e1|#8d969a|#8d969a|#55b9b1|#55b9b1') fail(route, width, `shared HECAVEX tokens changed (${state.tokens.join('|')})`);
      if (state.dot && (Math.abs(Number.parseFloat(state.dot.width) - 4.48) > 0.02 || Math.abs(Number.parseFloat(state.dot.height) - 4.48) > 0.02 || Math.abs(Number.parseFloat(state.dot.marginRight) - 8.8) > 0.02 || state.dot.color !== 'rgb(85, 185, 177)')) fail(route, width, `active network dot geometry changed (${JSON.stringify(state.dot)})`);
      if (!state.versionedAssets) fail(route, width, 'core stylesheet or script is not cache-versioned');
      if (factRoutes.has(route) && state.pageFactCount !== 4) fail(route, width, `page fact rail contains ${state.pageFactCount} records instead of 4`);
      if (outlineRoutes.has(route)) {
        if (state.outlineLinkCount < 2) fail(route, width, `content outline contains only ${state.outlineLinkCount} links`);
        if (state.missingOutlineTargets.length) fail(route, width, `content outline has missing targets: ${state.missingOutlineTargets.join(', ')}`);
        if (route.includes('unipark') && state.outlineSubtitleCount < 1) fail(route, width, 'research outline does not expose H3 subtitles');
        if (width > 1160 && !state.outlineStatusVisible) fail(route, width, 'desktop reading position did not initialise');
        if (width <= 1160) {
          if (state.desktopOutlineDisplay !== 'none' || state.mobileOutlineDisplay === 'none') fail(route, width, `mobile outline mode is wrong (${state.desktopOutlineDisplay}/${state.mobileOutlineDisplay})`);
        } else if (state.desktopOutlineDisplay === 'none' || state.mobileOutlineDisplay !== 'none') fail(route, width, `desktop outline mode is wrong (${state.desktopOutlineDisplay}/${state.mobileOutlineDisplay})`);
      }
      if (researchRoutes.has(route) && (state.researchDescriptionCount < 4 || !state.hasBriefingPath || state.researchMapCount !== 5 || !/^\d{4}-\d{2}-\d{2}$/.test(state.pageUpdatedValue))) fail(route, width, `research catalogue context is incomplete (${state.researchDescriptionCount} descriptions, ${state.researchMapCount} map entries, briefing path ${state.hasBriefingPath}, updated ${state.pageUpdatedValue})`);
      if (researchRoutes.has(route)) {
        const oddCardFillsGrid = state.oddResearchCardCount > 0
          && Math.abs(state.oddResearchLastCardLeftGap - 1) <= 1
          && Math.abs(state.oddResearchLastCardRightGap - 1) <= 1;
        if (!oddCardFillsGrid) fail(route, width, `final odd research card does not fill its row (${state.oddResearchCardCount} cards, ${state.oddResearchLastCardLeftGap}px/${state.oddResearchLastCardRightGap}px edges)`);
      }
      if (contactRoutes.has(route) && (state.actionRouteCount !== 4 || state.actionLinkCount !== 5)) fail(route, width, `contact action rail is incomplete (${state.actionRouteCount} routes, ${state.actionLinkCount} links)`);
      if (catalogueIntroRoutes.has(route)) {
        if (Math.abs(state.pageIntroWidth - state.pageShellInnerWidth) > 1) fail(route, width, `fact intro width differs from the catalogue shell (${state.pageIntroWidth}px/${state.pageShellInnerWidth}px)`);
        if (width >= 900 && Math.abs(state.pageIntroHeight - 336) > 1) fail(route, width, `desktop fact intro is ${state.pageIntroHeight}px instead of 336px`);
        if (state.h1Size > 52.1) fail(route, width, `fact intro h1 exceeds the shared 52px scale (${state.h1Size}px)`);
      }
      if (briefingRoutes.has(route)) {
        if (width > 680 && (!state.briefingCardsShareRow || state.briefingImageWidth > state.briefingListWidth * 0.51)) fail(route, width, `briefing catalogue is not a two-column card grid (${state.briefingImageWidth}px image/${state.briefingListWidth}px list)`);
        if (width <= 680 && state.briefingCardsShareRow) fail(route, width, 'briefing catalogue remains two-column on a narrow screen');
      }
      if (route === '/data/' && (state.oddDataLinkListCount < 1 || !state.oddDataLinksFillRow)) fail(route, width, `odd data endpoint grids leave an empty cell (${state.oddDataLinkListCount} odd grids, fill ${state.oddDataLinksFillRow})`);
      if (legacyCtaRoutes.has(route) && (!['flex', 'inline-flex'].includes(state.ctaButtonDisplay) || state.ctaButtonHeight < 43 || state.ctaButtonHeight > 45)) fail(route, width, `restored page CTA is not a 44px flex control (${state.ctaButtonDisplay}, ${state.ctaButtonHeight}px)`);
      if (signalRoutes.has(route)) {
        if (state.signalEntryCount !== 7) fail(route, width, `Signal Brief contains ${state.signalEntryCount} signal records instead of 7`);
        if (state.signalEntryBorder !== '1px' || state.signalFactDisplay !== 'grid' || state.signalFactCount !== 2) fail(route, width, `signal record presentation is incomplete (${state.signalEntryBorder}, ${state.signalFactDisplay}, ${state.signalFactCount} facts)`);
        if (width <= 680 && state.signalFactsShareRow) fail(route, width, 'signal facts remain side-by-side on a narrow screen');
        if (width > 680 && !state.signalFactsShareRow) fail(route, width, 'signal facts do not share a row on a wide screen');
      }
      if (route === '/' && (state.landingEditionCount !== 2 || state.landingCurrentCount !== 3 || state.landingNetworkCount !== 4)) fail(route, width, `root gateway is incomplete (${state.landingEditionCount} editions, ${state.landingCurrentCount} current records, ${state.landingNetworkCount} network links)`);
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
        const mobileNetworkLabels = (await page.locator('.mobile-navigation[open] .mobile-portfolio-navigation a').allTextContents())
          .map((label) => label.trim());
        if (mobileNetworkLabels.join('|') !== 'Research|Radar|APT Notes|Labs|Data') {
          fail(route, width, `mobile network navigation differs from the portfolio contract (${mobileNetworkLabels.join('|')})`);
        }
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
    networkLabels: [...document.querySelectorAll('.mobile-navigation[open] .mobile-portfolio-navigation a')]
      .map((link) => link.textContent.trim()),
    purpose: document.querySelector('main h1')?.textContent.trim() ?? ''
  }));
  if (noScriptState.overflow > 1) fail('/en/ (no JavaScript)', 390, 'page overflows horizontally');
  if (
    noScriptState.productLinks < 7
    || noScriptState.networkLinks !== 5
    || noScriptState.networkLabels.join('|') !== 'Research|Radar|APT Notes|Labs|Data'
  ) fail('/en/ (no JavaScript)', 390, 'native details navigation is incomplete');
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

  const readingContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce', serviceWorkers: 'block' });
  const readingPage = await readingContext.newPage();
  const readingRoute = '/en/research/unipark-smishing-campaign-infrastructure/';
  await readingPage.goto(`${baseUrl}${readingRoute}`, { waitUntil: 'networkidle' });
  await readingPage.waitForFunction(() => !document.querySelector('.content-outline--desktop [data-outline-status]')?.hidden);
  const initialReading = await readingPage.evaluate(() => ({
    current: document.querySelector('.content-outline--desktop [data-outline-current]')?.textContent.trim(),
    active: document.querySelectorAll('.content-outline--desktop a[aria-current="location"]').length,
    headTop: document.querySelector('.article-head')?.getBoundingClientRect().top,
    outlineTop: document.querySelector('.content-outline--desktop')?.getBoundingClientRect().top
  }));
  if (initialReading.active !== 1) fail(readingRoute, 1440, `reading map has ${initialReading.active} current links instead of 1`);
  if (Math.abs((initialReading.headTop ?? 0) - (initialReading.outlineTop ?? 0)) > 2) fail(readingRoute, 1440, `article outline does not begin beside the title (${initialReading.headTop}/${initialReading.outlineTop})`);

  const anchorLink = readingPage.locator('.content-outline--desktop [data-outline-link]').nth(4);
  const anchorTarget = await anchorLink.getAttribute('href');
  await anchorLink.click();
  await readingPage.waitForTimeout(120);
  const anchorGeometry = await readingPage.evaluate((targetSelector) => {
    const target = targetSelector ? document.querySelector(targetSelector) : undefined;
    const header = document.querySelector('.site-header');
    return { targetTop: target?.getBoundingClientRect().top ?? -1, headerBottom: header?.getBoundingClientRect().bottom ?? 0 };
  }, anchorTarget);
  if (anchorGeometry.targetTop < anchorGeometry.headerBottom - 1) fail(readingRoute, 1440, `outline anchor landed under the sticky header (${JSON.stringify(anchorGeometry)})`);
  await readingPage.evaluate(() => window.scrollTo(0, 0));
  await readingPage.waitForTimeout(120);

  const trackedHeading = readingPage.locator('.article-body h3[id]').nth(1);
  const trackedLabel = (await trackedHeading.textContent())?.replace(/\s+/g, ' ').trim();
  await trackedHeading.evaluate((heading) => {
    const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 0;
    window.scrollTo(0, heading.getBoundingClientRect().top + window.scrollY - headerHeight - 48);
  });
  await readingPage.waitForTimeout(120);
  const progressedReading = await readingPage.evaluate(() => ({
    current: document.querySelector('.content-outline--desktop [data-outline-current]')?.textContent.trim(),
    active: document.querySelectorAll('.content-outline--desktop a[aria-current="location"]').length,
    past: document.querySelectorAll('.content-outline--desktop [data-outline-item].is-past').length,
    next: document.querySelector('.content-outline--desktop [data-outline-next]')?.textContent.trim(),
    value: document.querySelector('.content-outline--desktop [data-outline-progress]')?.getAttribute('aria-valuenow')
  }));
  if (progressedReading.current !== trackedLabel || progressedReading.active !== 1 || progressedReading.past < 1 || !progressedReading.next || Number(progressedReading.value) < 2) fail(readingRoute, 1440, `scroll-aware reading state is wrong (${JSON.stringify(progressedReading)}, expected ${trackedLabel})`);
  await readingPage.evaluate(() => window.scrollTo(0, 0));
  await readingPage.waitForTimeout(120);
  const returnedCurrent = await readingPage.locator('.content-outline--desktop [data-outline-current]').textContent();
  if (returnedCurrent?.trim() !== initialReading.current) fail(readingRoute, 1440, 'reading state did not move backward after scrolling to the beginning');

  const longRoute = '/lt/tyrimai/infrastrukturos-pivoting-101/';
  await readingPage.goto(`${baseUrl}${longRoute}`, { waitUntil: 'networkidle' });
  const longHeading = readingPage.locator('.article-body h3[id]').nth(10);
  const longHeadingLabel = (await longHeading.textContent())?.replace(/\s+/g, ' ').trim();
  await longHeading.evaluate((heading) => {
    const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 0;
    window.scrollTo(0, heading.getBoundingClientRect().top + window.scrollY - headerHeight - 48);
  });
  await readingPage.waitForTimeout(120);
  const longState = await readingPage.evaluate(() => ({
    current: document.querySelector('.content-outline--desktop [data-outline-current]')?.textContent.trim(),
    visibleSubtitles: document.querySelectorAll('.content-outline--desktop .content-outline__depth-3').length,
    visibleItems: document.querySelectorAll('.content-outline--desktop [data-outline-item]').length,
    trackedTotal: Number(document.querySelector('.content-outline--desktop [data-outline-progress]')?.getAttribute('aria-valuemax')),
    activeVisible: (() => {
      const nav = document.querySelector('.content-outline--desktop [data-outline-nav]');
      const active = document.querySelector('.content-outline--desktop [data-outline-item].is-current');
      if (!nav || !active) return false;
      const navRect = nav.getBoundingClientRect();
      const activeRect = active.getBoundingClientRect();
      return activeRect.top >= navRect.top - 1 && activeRect.bottom <= navRect.bottom + 1;
    })()
  }));
  if (longState.current !== longHeadingLabel || longState.visibleSubtitles !== 0 || longState.trackedTotal <= longState.visibleItems || !longState.activeVisible) fail(longRoute, 1440, `condensed guide tracking is wrong (${JSON.stringify(longState)}, expected ${longHeadingLabel})`);
  await readingContext.close();

  const tableRoute = '/en/research/cra-article-14-vulnerability-incident-reporting-guide/';
  const wideTableContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce', serviceWorkers: 'block' });
  const wideTablePage = await wideTableContext.newPage();
  await wideTablePage.goto(`${baseUrl}${tableRoute}`, { waitUntil: 'networkidle' });
  const wideTableState = await wideTablePage.evaluate(() => {
    const paragraph = document.querySelector('.article-body > p');
    const region = document.querySelector('.article-body .table-scroll-region--wide');
    const tableCell = region?.querySelector('td');
    const paragraphRect = paragraph?.getBoundingClientRect();
    const regionRect = region?.getBoundingClientRect();
    return {
      paragraphWidth: paragraphRect?.width ?? 0,
      paragraphLeft: paragraphRect?.left ?? 0,
      paragraphRight: paragraphRect?.right ?? 0,
      paragraphAlign: paragraph ? getComputedStyle(paragraph).textAlign : '',
      regionWidth: regionRect?.width ?? 0,
      regionLeft: regionRect?.left ?? 0,
      regionRight: regionRect?.right ?? 0,
      regionOverflows: region ? region.scrollWidth > region.clientWidth + 1 : false,
      tableCellAlign: tableCell ? getComputedStyle(tableCell).textAlign : '',
      dataLabel: region?.getAttribute('data-table-label'),
      role: region?.getAttribute('role'),
      tabIndex: region?.getAttribute('tabindex'),
      documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
    };
  });
  const desktopTableSemanticsMatch = wideTableState.regionOverflows
    ? wideTableState.role === 'region' && wideTableState.tabIndex === '0'
    : wideTableState.role === null && wideTableState.tabIndex === null;
  const desktopArticleEdgesMatch = Math.abs(wideTableState.paragraphLeft - wideTableState.regionLeft) <= 1
    && Math.abs(wideTableState.paragraphRight - wideTableState.regionRight) <= 1
    && Math.abs(wideTableState.paragraphWidth - wideTableState.regionWidth) <= 1;
  if (!desktopArticleEdgesMatch || wideTableState.paragraphAlign !== 'justify' || wideTableState.tableCellAlign !== 'left' || !wideTableState.dataLabel || !desktopTableSemanticsMatch || wideTableState.documentOverflow > 1) fail(tableRoute, 1440, `wide evidence track or article alignment is wrong (${JSON.stringify(wideTableState)})`);
  await wideTableContext.close();

  const wideArticleRoute = '/en/research/adform-supply-chain-crypto-clipper/';
  const wideArticleContext = await browser.newContext({ reducedMotion: 'reduce', serviceWorkers: 'block' });
  const wideArticlePage = await wideArticleContext.newPage();
  for (const width of [320, 390, 680, 900, 1160, 1440]) {
    await wideArticlePage.setViewportSize({ width, height: 900 });
    await wideArticlePage.goto(`${baseUrl}${wideArticleRoute}`, { waitUntil: 'networkidle' });
    const alignment = await wideArticlePage.evaluate(() => {
      const heading = document.querySelector('#methodology-and-safety-boundaries');
      const paragraph = heading?.nextElementSibling;
      const region = document.querySelector('.article-body .table-scroll-region--wide');
      const related = document.querySelector('.related-posts');
      const relatedGrid = related?.querySelector('.post-grid');
      const relatedCards = relatedGrid ? [...relatedGrid.querySelectorAll(':scope > .post-card')] : [];
      const finalRelatedCard = relatedCards.at(-1);
      const navigation = document.querySelector('.article-navigation');
      const headingRect = heading?.getBoundingClientRect();
      const paragraphRect = paragraph?.getBoundingClientRect();
      const regionRect = region?.getBoundingClientRect();
      const relatedRect = related?.getBoundingClientRect();
      const relatedGridRect = relatedGrid?.getBoundingClientRect();
      const finalRelatedCardRect = finalRelatedCard?.getBoundingClientRect();
      const navigationRect = navigation?.getBoundingClientRect();
      return {
        hasWideClass: document.querySelector('.article-body')?.classList.contains('article-body--wide'),
        headingLeft: headingRect?.left ?? 0,
        headingRight: headingRect?.right ?? 0,
        paragraphLeft: paragraphRect?.left ?? 0,
        paragraphRight: paragraphRect?.right ?? 0,
        regionLeft: regionRect?.left ?? 0,
        regionRight: regionRect?.right ?? 0,
        relatedCount: relatedCards.length,
        relatedLeft: relatedRect?.left ?? 0,
        relatedRight: relatedRect?.right ?? 0,
        relatedGridLeft: relatedGridRect?.left ?? 0,
        relatedGridRight: relatedGridRect?.right ?? 0,
        finalRelatedCardLeft: finalRelatedCardRect?.left ?? 0,
        finalRelatedCardRight: finalRelatedCardRect?.right ?? 0,
        navigationLeft: navigationRect?.left ?? 0,
        navigationRight: navigationRect?.right ?? 0,
        documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
      };
    });
    const aligned = alignment.hasWideClass
      && Math.abs(alignment.headingLeft - alignment.regionLeft) <= 1
      && Math.abs(alignment.headingRight - alignment.regionRight) <= 1
      && Math.abs(alignment.paragraphLeft - alignment.regionLeft) <= 1
      && Math.abs(alignment.paragraphRight - alignment.regionRight) <= 1;
    const footerAligned = alignment.relatedCount === 3
      && Math.abs(alignment.relatedLeft - alignment.navigationLeft) <= 1
      && Math.abs(alignment.relatedRight - alignment.navigationRight) <= 1
      && Math.abs(alignment.finalRelatedCardLeft - (alignment.relatedGridLeft + 1)) <= 1
      && Math.abs(alignment.finalRelatedCardRight - (alignment.relatedGridRight - 1)) <= 1;
    if (!aligned || !footerAligned || alignment.documentOverflow > 1) fail(wideArticleRoute, width, `wide article or footer alignment is wrong (${JSON.stringify(alignment)})`);
  }
  await wideArticleContext.close();

  const mobileTableContext = await browser.newContext({ viewport: { width: 390, height: 900 }, reducedMotion: 'reduce', serviceWorkers: 'block' });
  const mobileTablePage = await mobileTableContext.newPage();
  await mobileTablePage.goto(`${baseUrl}${tableRoute}`, { waitUntil: 'networkidle' });
  const mobileTableState = await mobileTablePage.locator('.article-body .table-scroll-region--wide').first().evaluate((region) => {
    region.focus();
    region.scrollLeft = 160;
    const hint = region.querySelector('.table-scroll-hint');
    return {
      clientWidth: region.clientWidth,
      scrollWidth: region.scrollWidth,
      scrollLeft: region.scrollLeft,
      focused: document.activeElement === region,
      hintDisplay: hint ? getComputedStyle(hint).display : 'missing',
      documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
    };
  });
  if (mobileTableState.clientWidth > 390 || mobileTableState.scrollWidth <= mobileTableState.clientWidth || mobileTableState.scrollLeft <= 0 || !mobileTableState.focused || mobileTableState.hintDisplay === 'none' || mobileTableState.documentOverflow > 1) fail(tableRoute, 390, `mobile table region is not independently inspectable (${JSON.stringify(mobileTableState)})`);
  await mobileTableContext.close();
} finally {
  await browser.close();
  await new Promise((accept) => server.close(accept));
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`Responsive audit passed: ${routes.length} pages × ${widths.length} viewports plus no-JavaScript navigation, scroll-aware reading maps and wide-table inspection.`);
