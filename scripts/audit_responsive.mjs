#!/usr/bin/env node

import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { chromium } from 'playwright-core';
import { signalBriefEditions } from './signal-brief-editions.mjs';
import { parse } from 'yaml';
import { networkLabels } from './portfolio-registry.mjs';

// Expectations come from the data files, never from literals: card counts (home.yml) and copy (hecavex/{en,lt}.yml).
const readYaml = async (path) => parse(await readFile(new URL(path, import.meta.url), 'utf8'));
const homeCounts = await readYaml('../src/data/home.yml');
const copy = { en: await readYaml('../src/data/hecavex/en.yml'), lt: await readYaml('../src/data/hecavex/lt.yml') };
// Section bar = the copy-table navigation keys (nav_start ... nav_contact).
const sectionCount = Object.keys(copy.en).filter((key) => /^nav_(start|research|briefs|glossary|about|speaking|contact)$/.test(key)).length;
const startHereRoute = { en: '/en/start-here/', lt: '/lt/pradekite-cia/' };
const glossaryRoute = { en: '/en/glossary/', lt: '/lt/zodynas/' };
// Network links mark external targets with a trailing aria-hidden arrow that is not part of the label.
const linkLabels = (labels) => labels.map((label) => label.replace(/\s*↗$/u, '').trim());

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

const recentBriefRoutes = signalBriefEditions.flatMap(({ end }) => [
  `/en/briefings/${end}/`, `/lt/apzvalgos/${end}/`
]);
const monthlyRadarRoutes = [
  '/en/research/lithuania-phishing-infrastructure-radar-september-2026/',
  '/lt/tyrimai/phishing-infrastruktura-lietuvoje-radar-2026-rugsejis/'
];
const beginnerArticleRoutes = ['/en/research/how-to-check-a-suspicious-sms-link-safely/', '/lt/tyrimai/kaip-saugiai-patikrinti-itartina-sms-nuoroda/'];
const routes = [
  ...recentBriefRoutes,
  ...monthlyRadarRoutes,
  '/en/research/fakegit-ai-skills-mutable-downloads/', '/lt/tyrimai/fakegit-ai-igudziai-kintantys-atsisiuntimai/',
  '/', '/data/', '/lt/duomenys/', '/en/', '/lt/', '/en/research/', '/lt/tyrimai/', '/en/briefings/', '/lt/apzvalgos/', '/en/projects/', '/lt/projektai/',
  '/en/about/', '/lt/apie/', '/en/speaker/', '/lt/pranesejas/', '/en/contact/', '/lt/kontaktai/',
  '/en/research/unipark-smishing-campaign-infrastructure/', '/lt/tyrimai/unipark-smishing-infrastrukturos-tyrimas/',
  '/en/research/cra-article-14-vulnerability-incident-reporting-guide/', '/lt/tyrimai/infrastrukturos-pivoting-101/',
  '/en/research/adform-supply-chain-crypto-clipper/', '/lt/tyrimai/adform-supply-chain-crypto-clipper/',
  '/en/briefings/2026-08-22/', '/lt/apzvalgos/2026-08-22/',
  '/en/start-here/', '/lt/pradekite-cia/',
  ...beginnerArticleRoutes
];
const factRoutes = new Set(['/en/research/', '/lt/tyrimai/', '/en/about/', '/lt/apie/', '/en/speaker/', '/lt/pranesejas/', '/en/contact/', '/lt/kontaktai/']);
const outlineRoutes = new Set([
  '/en/research/fakegit-ai-skills-mutable-downloads/', '/lt/tyrimai/fakegit-ai-igudziai-kintantys-atsisiuntimai/',
  ...recentBriefRoutes,
  ...monthlyRadarRoutes,
  '/en/research/', '/lt/tyrimai/', '/en/about/', '/lt/apie/', '/en/speaker/', '/lt/pranesejas/',
  '/en/research/unipark-smishing-campaign-infrastructure/', '/lt/tyrimai/unipark-smishing-infrastrukturos-tyrimas/',
  '/en/research/cra-article-14-vulnerability-incident-reporting-guide/', '/lt/tyrimai/infrastrukturos-pivoting-101/',
  '/en/briefings/2026-08-22/', '/lt/apzvalgos/2026-08-22/'
]);
const researchRoutes = new Set(['/en/research/', '/lt/tyrimai/']);
const homeRoutes = new Set(['/en/', '/lt/']);
const aboutRoutes = new Set(['/en/about/', '/lt/apie/']);
const fullScreenRoutes = new Set([...homeRoutes, ...aboutRoutes, ...researchRoutes]);
const contactRoutes = new Set(['/en/contact/', '/lt/kontaktai/']);
const catalogueIntroRoutes = new Set(['/en/research/', '/lt/tyrimai/', '/en/about/', '/lt/apie/', '/en/speaker/', '/lt/pranesejas/', '/en/contact/', '/lt/kontaktai/']);
const briefingRoutes = new Set(['/en/briefings/', '/lt/apzvalgos/']);
const recordFooterRoutes = new Set(['/en/research/adform-supply-chain-crypto-clipper/', '/lt/tyrimai/adform-supply-chain-crypto-clipper/']);
const standardizedPageTitleRoutes = new Set([
  '/data/', '/en/', '/lt/', '/en/research/', '/lt/tyrimai/', '/en/briefings/', '/lt/apzvalgos/',
  '/en/projects/', '/en/about/', '/lt/apie/', '/en/speaker/', '/lt/pranesejas/', '/en/contact/', '/lt/kontaktai/',
  '/en/start-here/', '/lt/pradekite-cia/'
]);
const legacyCtaRoutes = new Set(['/en/about/', '/lt/apie/', '/en/contact/', '/lt/kontaktai/']);
const signalCounts = new Map([
  ['2026-08-22', 7], ...signalBriefEditions.map(({ end, counts }) => [end, counts.reduce((sum, count) => sum + count, 0)])
].flatMap(([date, count]) => [[`/en/briefings/${date}/`, count], [`/lt/apzvalgos/${date}/`, count]]));
const widths = [320, 390, 768, 1160, 1440];
const failures = [];
const cardPresentations = new Map();
const contactRails = new Map();
const browser = await chromium.launch({ executablePath, headless: true });
const fail = (route, width, message) => failures.push(`${route} @ ${width}px: ${message}`);

try {
  for (const route of routes) {
    for (const width of fullScreenRoutes.has(route) ? [...widths, 1920] : widths) {
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
        const h1Style = h1 ? getComputedStyle(h1) : undefined;
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
        const documentIds = new Set([...document.querySelectorAll('[id]')].map((element) => element.id));
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
        const oddResearchLastCard = oddResearchCards.at(-1);
        const oddResearchLastCardRect = oddResearchLastCard?.getBoundingClientRect();
        const oddResearchLastCardStyle = oddResearchLastCard ? getComputedStyle(oddResearchLastCard) : undefined;
        const latestGrid = document.querySelector('.home-latest-grid');
        const latestGridRect = latestGrid?.getBoundingClientRect();
        const latestGridStyle = latestGrid ? getComputedStyle(latestGrid) : undefined;
        const latestCards = [...(latestGrid?.querySelectorAll(':scope > .post-card') ?? [])];
        const latestCardGeometry = latestCards.map((card) => {
          const rect = card.getBoundingClientRect();
          const title = card.querySelector('h3 a');
          const action = card.querySelector('.card-action');
          const image = card.querySelector('.post-card-image');
          const imageRect = image?.querySelector('img')?.getBoundingClientRect();
          const copyRect = card.querySelector('.post-card-copy')?.getBoundingClientRect();
          return {
            left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, width: rect.width,
            titleSize: title ? Number.parseFloat(getComputedStyle(title).fontSize) : 0,
            accessibleLinks: Boolean(title?.textContent.trim() && action?.textContent.trim()
              && action.getAttribute('aria-label')?.trim()
              && title.getAttribute('href') === action.getAttribute('href')
              && title.getAttribute('aria-hidden') !== 'true' && action.getAttribute('aria-hidden') !== 'true'
              && title.getAttribute('tabindex') !== '-1' && action.getAttribute('tabindex') !== '-1'),
            imageRatio: imageRect?.height ? imageRect.width / imageRect.height : 0,
            copyBelowImage: Boolean(imageRect && copyRect && copyRect.top >= imageRect.bottom - 1),
            preview: Boolean(['illustration', 'evidence'].includes(card.getAttribute('data-preview')) && image?.querySelector('img[width][height]') && image?.querySelector('figcaption')?.textContent.trim()),
            href: title?.getAttribute('href'),
            date: card.querySelector('time')?.getAttribute('datetime'),
            imageLoading: image?.querySelector('img')?.getAttribute('loading'),
            titleBottom: title?.getBoundingClientRect().bottom ?? 0,
            readingTime: Boolean(card.querySelector('.card-reading')?.textContent.trim())
          };
        });
        const latestRows = [];
        for (const card of latestCardGeometry) {
          const row = latestRows.find((candidate) => Math.abs(candidate.top - card.top) <= 1);
          if (row) {
            row.count += 1;
            row.bottom = Math.max(row.bottom, card.bottom);
          } else latestRows.push({ top: card.top, bottom: card.bottom, count: 1 });
        }
        const referenceGrid = document.querySelector('#primary .post-grid');
        const referenceCard = referenceGrid?.querySelector('.post-card');
        const referenceTitle = referenceCard?.querySelector('h3 a');
        const referenceImageRect = referenceCard?.querySelector('.post-card-image img')?.getBoundingClientRect();
        const referenceGridStyle = referenceGrid ? getComputedStyle(referenceGrid) : undefined;
        const standardProse = document.querySelector('.standard-page > .prose');
        const aboutParagraphs = [...(standardProse?.querySelectorAll(':scope > p:not(:has(> img:only-child))') ?? [])];
        const aboutHeading = standardProse?.querySelector('h2');
        const articleShell = document.querySelector('.article-shell');
        const articleShellRect = articleShell?.getBoundingClientRect();
        const articleShellStyle = articleShell ? getComputedStyle(articleShell) : undefined;
        const recordSections = [...document.querySelectorAll('.article-shell > :is(.update-history, .citation-block, .article-footer)')];
        const offscreen = [...document.querySelectorAll('main *, .site-header *')].filter((element) => {
          const style = getComputedStyle(element);
          if (style.display === 'none' || style.visibility === 'hidden' || style.position === 'fixed') return false;
          const rect = element.getBoundingClientRect();
          return rect.width > 0 && (rect.left < -1 || rect.right > viewportWidth + 1);
        }).slice(0, 6).map((element) => `${element.tagName}.${String(element.className).replace(/\s+/g, '.')}`);
        return {
          footerTypeMismatches: [...document.querySelectorAll('.site-footer nav a, .footer-brand strong')].filter((element) => {
            const style = getComputedStyle(element);
            const brand = element.matches('.footer-brand strong');
            const family = style.fontFamily.split(',')[0].replaceAll('"', '').toLowerCase();
            const tracking = Number.parseFloat(style.letterSpacing) || 0;
            return family !== (brand ? 'ibm plex mono' : 'inter')
              || Number.parseFloat(style.fontSize) !== 13
              || style.fontWeight !== (brand ? '600' : '500')
              || style.lineHeight !== 'normal'
              || Math.abs(tracking - (brand ? 1.56 : 0)) > 0.025
              || style.textTransform !== 'none';
          }).map((element) => element.textContent.trim()),
          undersizedFooterTargets: [...document.querySelectorAll('.site-footer nav a')].filter((link) => {
            const rect = link.getBoundingClientRect();
            return rect.width < 24 || rect.height < 24;
          }).map((link) => link.textContent.trim()),
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
          h1Size: h1Style ? Number.parseFloat(h1Style.fontSize) : 0,
          h1LineHeight: h1Style ? Number.parseFloat(h1Style.lineHeight) : 0,
          heroHeight: hero?.getBoundingClientRect().height ?? 0,
          heroChildOverflow: heroRect ? Math.max(0, ...[...hero.children].map((child) => child.getBoundingClientRect().bottom - heroRect.bottom)) : 0,
          bodyFontSize: Number.parseFloat(bodyStyle.fontSize),
          bodyColor: bodyStyle.color,
          publicationBackground: getComputedStyle(document.querySelector('.home-shell, .page-shell, .article-shell, .landing-portal, .not-found')).backgroundColor,
          tokens: ['--bg-elevated', '--surface', '--surface-strong', '--line', '--line-strong', '--text-soft', '--muted', '--faint', '--cyan', '--cyan-bright'].map((token) => rootStyle.getPropertyValue(token).trim()),
          dot: dotStyle ? { display: dotStyle.display, content: dotStyle.content } : undefined,
          displayFont: h1Style?.fontFamily ?? '',
          heroOpen: !hero || ['borderTopWidth','borderLeftWidth','borderRightWidth'].every((key) => getComputedStyle(hero)[key] === '0px'),
          htmlLang: document.documentElement.lang,
          networkLabels: [...document.querySelectorAll('.portfolio-navigation a')].map((link) => link.textContent.trim()),
          pageFactCount: document.querySelectorAll('.page-facts > div').length,
          desktopOutlineDisplay: desktopOutline ? getComputedStyle(desktopOutline).display : 'missing',
          mobileOutlineDisplay: mobileOutline ? getComputedStyle(mobileOutline).display : 'missing',
          outlineLinkCount: outlineLinks.length,
          outlineSubtitleCount: outlineLinks.filter((link) => link.closest('li')?.classList.contains('content-outline__depth-3')).length,
          missingOutlineTargets: outlineLinks.map((link) => decodeURIComponent(link.hash.slice(1))).filter((id) => !documentIds.has(id)),
          outlineStatusVisible: desktopOutline ? !desktopOutline.querySelector('[data-outline-status]')?.hidden : false,
          signalEntryCount: document.querySelectorAll('.hx-signal-entry').length,
          signalEntryBorder: signalEntry ? getComputedStyle(signalEntry).borderLeftWidth : '0px',
          signalFactDisplay: signalFacts ? getComputedStyle(signalFacts).display : 'missing',
          signalFactCount: signalFactItems.length,
          signalFactsShareRow: signalFactRects.length > 1 ? Math.abs(signalFactRects[0].top - signalFactRects[1].top) < 1 : false,
          researchMapCount: document.querySelectorAll('.content-outline--desktop.content-outline--map [data-outline-item]').length,
          researchSectionCount: document.querySelectorAll('#research-catalogue [data-outline-heading="true"]').length,
          actionRoutesWithoutLinks: [...document.querySelectorAll('.page-action-rail li')].filter((item) => !item.querySelector('a')).length,
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
          oddResearchLastCardBorders: oddResearchLastCardStyle
            ? [oddResearchLastCardStyle.borderTopWidth, oddResearchLastCardStyle.borderRightWidth, oddResearchLastCardStyle.borderBottomWidth, oddResearchLastCardStyle.borderLeftWidth]
            : [],
          articleShellInnerWidth: articleShellRect && articleShellStyle
            ? articleShellRect.width
              - Number.parseFloat(articleShellStyle.paddingLeft)
              - Number.parseFloat(articleShellStyle.paddingRight)
              - Number.parseFloat(articleShellStyle.borderLeftWidth)
              - Number.parseFloat(articleShellStyle.borderRightWidth)
            : 0,
          recordSectionWidths: recordSections.map((section) => section.getBoundingClientRect().width),
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
          latestGridWidth: latestGridRect?.width ?? 0,
          latestColumnGap: latestGridStyle ? Number.parseFloat(latestGridStyle.columnGap) : 0,
          latestRowGap: latestGridStyle ? Number.parseFloat(latestGridStyle.rowGap) : 0,
          latestCardGeometry,
          latestRows,
          hasOversizedHomeLead: Boolean(document.querySelector('.home-shell .lead-story')),
          referencePresentation: referenceTitle && referenceGridStyle ? {
            titleSize: Number.parseFloat(getComputedStyle(referenceTitle).fontSize),
            columnGap: Number.parseFloat(referenceGridStyle.columnGap),
            rowGap: Number.parseFloat(referenceGridStyle.rowGap),
            imageRatio: referenceImageRect ? referenceImageRect.width / referenceImageRect.height : 0
          } : null,
          aboutMarker: Boolean(document.querySelector('.standard-page--about')),
          aboutParagraphs: aboutParagraphs.map((paragraph) => {
            const style = getComputedStyle(paragraph);
            return { align: style.textAlign, lastAlign: style.textAlignLast, hyphens: style.hyphens,
              width: paragraph.getBoundingClientRect().width };
          }),
          aboutProseWidth: standardProse?.getBoundingClientRect().width ?? 0,
          aboutHeadingAlign: aboutHeading ? getComputedStyle(aboutHeading).textAlign : '',
          landingEditionCount: document.querySelectorAll('.landing-edition-rail a').length,
          landingCurrentCount: document.querySelectorAll('.landing-current-grid > *').length,
          landingIndexCount: document.querySelectorAll('.landing-index').length,
          landingNetworkGridCount: document.querySelectorAll('.landing-network-grid').length,
          landingNewcomerHrefs: [...document.querySelectorAll('.landing-current-grid > :nth-child(3) a[href]')].map((link) => link.getAttribute('href')),
          versionedAssets: Boolean(stylesheet?.getAttribute('href')?.match(/\?v=[^&]+$/) && siteScript?.getAttribute('src')?.match(/\?v=[^&]+$/))
        };
      }, width);
      if (outlineRoutes.has(route) && state.missingOutlineTargets.length) {
        await page.reload({ waitUntil: 'networkidle' });
        state.missingOutlineTargets = await page.evaluate(() => {
          const outline = document.querySelector('.content-outline--desktop');
          const documentIds = new Set([...document.querySelectorAll('[id]')].map((element) => element.id));
          return [...(outline?.querySelectorAll('a[href^="#"]') ?? [])]
            .map((link) => decodeURIComponent(link.hash.slice(1)))
            .filter((id) => !documentIds.has(id));
        });
      }
      if (state.shell !== 'v2') fail(route, width, 'portfolio shell marker is missing');
      if (state.undersizedFooterTargets.length) fail(route, width, `footer targets are smaller than 24px: ${state.undersizedFooterTargets.join(', ')}`);
      if (state.overflow > 1) fail(route, width, `horizontal overflow is ${state.overflow}px (${state.offscreen.join(', ')})`);
      if (state.h1Size > 64.1) fail(route, width, `h1 exceeds the 64px display ceiling (${state.h1Size}px)`);
      if (state.markWidth < 33.5 || state.markWidth > 36.5) fail(route, width, `brand mark is ${state.markWidth}px rather than 34–36px`);
      if (linkLabels(state.networkLabels).join('|') !== networkLabels(state.htmlLang).join('|')) fail(route, width, 'network navigation order differs from the portfolio contract');
      if (state.footerTypeMismatches.length) fail(route, width, `footer typography differs from the portfolio contract: ${state.footerTypeMismatches.join(', ')}`);
      if (Math.abs(state.bodyFontSize - 16) > 0.05 || state.bodyColor !== 'rgb(236, 233, 225)') fail(route, width, `body type/color changed (${state.bodyFontSize}px, ${state.bodyColor})`);
      if (state.publicationBackground !== 'rgb(17, 20, 22)') fail(route, width, `publication surface is not portfolio graphite (${state.publicationBackground})`);
      if (!state.displayFont.includes('Space Grotesk')) fail(route, width, 'shared self-hosted display type is missing');
      if (!state.heroOpen) fail(route, width, 'hero has reverted to a closed panel');
      if (state.tokens.join('|') !== '#171b1d|#171b1d|#1d2326|#30383b|#30383b|#ece9e1|#8d969a|#8d969a|#55b9b1|#55b9b1') fail(route, width, `shared HECAVEX tokens changed (${state.tokens.join('|')})`);
      if (state.dot && state.dot.display !== 'none' && !['none','normal'].includes(state.dot.content)) fail(route, width, 'decorative network dot returned');
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
      if (researchRoutes.has(route) && (state.researchDescriptionCount < 4 || !state.hasBriefingPath || state.researchSectionCount < 2 || state.researchMapCount !== state.researchSectionCount || !/^\d{4}-\d{2}-\d{2}$/.test(state.pageUpdatedValue))) fail(route, width, `research catalogue context is incomplete (${state.researchDescriptionCount} descriptions, ${state.researchMapCount} map entries for ${state.researchSectionCount} sections, briefing path ${state.hasBriefingPath}, updated ${state.pageUpdatedValue})`);
      if (researchRoutes.has(route)) {
        const oddCardFillsGrid = state.oddResearchCardCount > 0
          && Math.abs(state.oddResearchLastCardLeftGap - 1) <= 1
          && Math.abs(state.oddResearchLastCardRightGap - 1) <= 1;
        if (!oddCardFillsGrid) fail(route, width, `final odd research card does not fill its row (${state.oddResearchCardCount} cards, ${state.oddResearchLastCardLeftGap}px/${state.oddResearchLastCardRightGap}px edges)`);
        if (state.oddResearchLastCardBorders[0] !== '1px') fail(route, width, 'final odd research card lost its dividing rule');
      }
      if (contactRoutes.has(route)) {
        if (state.actionRouteCount < 1 || state.actionRoutesWithoutLinks > 0) fail(route, width, `contact action rail is incomplete (${state.actionRouteCount} routes, ${state.actionLinkCount} links, ${state.actionRoutesWithoutLinks} routes without a link)`);
        contactRails.set(`${route.slice(1, 3)}:${width}`, `${state.actionRouteCount}/${state.actionLinkCount}`);
      }
      if (catalogueIntroRoutes.has(route)) {
        if (Math.abs(state.pageIntroWidth - state.pageShellInnerWidth) > 1) fail(route, width, `fact intro width differs from the catalogue shell (${state.pageIntroWidth}px/${state.pageShellInnerWidth}px)`);
        if (width > 900 && state.pageIntroHeight < 319) fail(route, width, `desktop fact intro is below the 320px minimum (${state.pageIntroHeight}px)`);
        if (state.h1Size > 52.1) fail(route, width, `fact intro h1 exceeds the shared 52px scale (${state.h1Size}px)`);
      }
      if (recordFooterRoutes.has(route)) {
        const fullWidthRecordSections = state.recordSectionWidths.length === 3
          && state.recordSectionWidths.every((sectionWidth) => Math.abs(sectionWidth - state.articleShellInnerWidth) <= 1);
        if (!fullWidthRecordSections) fail(route, width, `article record footer does not span the article frame (${state.recordSectionWidths.join('/')}px versus ${state.articleShellInnerWidth}px)`);
      }
      if (standardizedPageTitleRoutes.has(route)) {
        if (state.h1Size > 52.1) fail(route, width, `standard page h1 exceeds the shared 52px scale (${state.h1Size}px)`);
        if (Math.abs(state.h1LineHeight - state.h1Size * 1.08) > 0.3) fail(route, width, `standard page h1 line-height differs from 1.08 (${state.h1LineHeight}px/${state.h1Size}px)`);
      }
      if (briefingRoutes.has(route)) {
        if (width > 680 && (!state.briefingCardsShareRow || state.briefingImageWidth > state.briefingListWidth * 0.51)) fail(route, width, `briefing catalogue is not a two-column card grid (${state.briefingImageWidth}px image/${state.briefingListWidth}px list)`);
        if (width <= 680 && state.briefingCardsShareRow) fail(route, width, 'briefing catalogue remains two-column on a narrow screen');
      }
      if (route === '/data/' && state.oddDataLinkListCount > 0 && !state.oddDataLinksFillRow) fail(route, width, `odd data endpoint grids leave an empty cell (${state.oddDataLinkListCount} odd grids, fill ${state.oddDataLinksFillRow})`);
      if (legacyCtaRoutes.has(route) && (!['flex', 'inline-flex'].includes(state.ctaButtonDisplay) || state.ctaButtonHeight < 43 || state.ctaButtonHeight > 45)) fail(route, width, `restored page CTA is not a 44px flex control (${state.ctaButtonDisplay}, ${state.ctaButtonHeight}px)`);
      if (signalCounts.has(route)) {
        const expectedCount = signalCounts.get(route);
        if (state.signalEntryCount !== expectedCount) fail(route, width, `Signal Brief contains ${state.signalEntryCount} signal records instead of ${expectedCount}`);
        if (state.signalEntryBorder !== '1px' || state.signalFactDisplay !== 'grid' || state.signalFactCount !== 2) fail(route, width, `signal record presentation is incomplete (${state.signalEntryBorder}, ${state.signalFactDisplay}, ${state.signalFactCount} facts)`);
        if (width <= 680 && state.signalFactsShareRow) fail(route, width, 'signal facts remain side-by-side on a narrow screen');
        if (width > 680 && !state.signalFactsShareRow) fail(route, width, 'signal facts do not share a row on a wide screen');
      }
      if (route === '/') {
        const newcomerLinksBoth = Object.values(startHereRoute).every((href) => state.landingNewcomerHrefs.includes(href));
        if (state.landingEditionCount !== 2 || state.landingCurrentCount !== 3 || !newcomerLinksBoth || state.landingIndexCount !== 0 || state.landingNetworkGridCount !== 0) fail(route, width, `root gateway is incomplete (${state.landingEditionCount} editions, ${state.landingCurrentCount} current records, newcomer card links ${state.landingNewcomerHrefs.join(' ')}, ${state.landingIndexCount} index, ${state.landingNetworkGridCount} network grids)`);
      }
      if (homeRoutes.has(route)) {
        const discovery = await page.evaluate(() => ({
          taskRoutes: [...document.querySelectorAll('.home-route-rail li a')].map(link => ({ href: link.getAttribute('href'), height: link.getBoundingClientRect().height, text: link.textContent.trim() })),
          updated: document.querySelector('.home-route-updated time')?.getAttribute('datetime'),
          heroPrimary: (() => {
            const button = document.querySelector('.home-discovery .button--primary');
            return { href: button?.getAttribute('href'), bottom: button ? button.getBoundingClientRect().bottom : Infinity };
          })(),
          discoveryPrimaryCount: document.querySelectorAll('.home-discovery .button--primary').length,
          discoveryTextHrefs: [...document.querySelectorAll('.home-discovery a:not(.button--primary)')].map(link => link.getAttribute('href')),
          pagePrimaryCount: [...document.querySelectorAll('.button--primary')].filter(button => !button.closest('header')).length,
          paths: [...document.querySelectorAll('.home-basics .research-path')].map(path => ({
            href: path.querySelector('h3 a')?.getAttribute('href'),
            title: path.querySelector('h3 a')?.textContent.trim(),
            summary: path.querySelector('.research-path-summary')?.textContent.trim(),
            date: path.querySelector('time')?.getAttribute('datetime'),
            hasDownload: Boolean(path.querySelector('a[download]')),
            targets: [...path.querySelectorAll('a')].map(link => link.getBoundingClientRect().height)
          }))
        }));
        const edition = route.slice(1, 3);
        const catalogue = JSON.parse(await readFile(join(siteRoot, 'data/publications.json'), 'utf8'));
        const ordinaryPaths = new Set(catalogue.publications.filter(item => item.language === edition && item.publicationClass !== 'signal-brief').map(item => new URL(item.id).pathname));
        // Citation dates are calendar-only and cannot order publications on the
        // same day. Search retains full timestamps and canonical exact-tie order.
        const search = JSON.parse(await readFile(join(siteRoot, edition, 'search.json'), 'utf8'));
        const expectedArticles = search.filter(item => ordinaryPaths.has(item.url)).sort((a, b) => new Date(b.date) - new Date(a.date));
        const cards = state.latestCardGeometry;
        const expectedLatest = Math.min(homeCounts.latest, expectedArticles.length);
        const expected = expectedArticles.slice(0, expectedLatest).map(item => item.url);
        // Start here lists every beginner post; the home basics are its first N cards.
        const startHereHtml = await readFile(join(siteRoot, startHereRoute[edition], 'index.html'), 'utf8');
        const beginnerHrefs = [...(startHereHtml.match(/<section id="basics"[\s\S]*?<\/section>/)?.[0] ?? '').matchAll(/<h3[^>]*>\s*<a[^>]*href="([^"]+)"/g)].map(match => match[1]);
        const expectedBasics = beginnerHrefs.slice(0, Math.min(homeCounts.basics, beginnerHrefs.length));
        const searchBeginner = search.filter(item => item.audience === 'beginner').map(item => item.url);
        const missingBeginner = searchBeginner.filter(href => !beginnerHrefs.includes(href));
        if (missingBeginner.length) fail(route, width, `Start here basics omit beginner search records: ${missingBeginner.join(' ')}`);
        if (discovery.taskRoutes.length !== 4 || discovery.taskRoutes.some(link => !link.href?.startsWith(`/${edition}/`) && !(edition === 'en' && link.href === '/data/') || link.height < 43.5 || !link.text) || !discovery.updated) fail(route, width, `localized task discovery is incomplete (${JSON.stringify(discovery.taskRoutes)})`);
        if (expectedBasics.length === 0 || JSON.stringify(discovery.paths.map(path => path.href)) !== JSON.stringify(expectedBasics)
          || discovery.paths.some(path => !path.href?.startsWith(`/${edition}/`) || !path.title || !path.summary || !path.date || path.hasDownload || path.targets.some(height => height < 43.5))) fail(route, width, `home basics differ from the first ${homeCounts.basics} Start here guides or lost their localized records/targets (${JSON.stringify(discovery.paths.map(path => path.href))} versus ${JSON.stringify(expectedBasics)})`);
        if (cards.length !== expectedLatest) fail(route, width, `home shows ${cards.length} latest cards instead of ${expectedLatest} (home.yml latest ${homeCounts.latest})`);
        if (discovery.heroPrimary.href !== startHereRoute[edition] || discovery.heroPrimary.bottom > (width <= 680 ? 570 : 480)) fail(route, width, `hero Start here button is not on the first screen (${discovery.heroPrimary.href}, bottom ${discovery.heroPrimary.bottom}px)`);
        if (discovery.discoveryPrimaryCount !== 1 || discovery.pagePrimaryCount !== 1) fail(route, width, `home must have exactly one primary button (${discovery.discoveryPrimaryCount} in the hero, ${discovery.pagePrimaryCount} on the page)`);
        const indexHrefs = edition === 'en' ? ['/en/research/', '/en/briefings/'] : ['/lt/tyrimai/', '/lt/apzvalgos/'];
        if (JSON.stringify(discovery.discoveryTextHrefs) !== JSON.stringify(indexHrefs)) fail(route, width, `hero text links are not the research and briefings indexes (${discovery.discoveryTextHrefs.join(' ')})`);
        const columns = width > 680 ? 2 : 1;
        const expectedCardWidth = (state.latestGridWidth - state.latestColumnGap * (columns - 1)) / columns;
        if (JSON.stringify(cards.map(card => card.href)) !== JSON.stringify(expected)) fail(route, width, `newest approved article order differs from full publication timestamps (${cards.map(card => card.href)})`);
        if (cards.some((card, index) => card.date !== expectedArticles[index]?.date)) fail(route, width, 'latest article datetimes differ from the full publication timestamps');
        if (cards.some(card => card.imageLoading !== 'lazy')) fail(route, width, 'latest article previews sit below the hero and must all load lazily');
        if (state.hasOversizedHomeLead || cards.length < 1) fail(route, width, `latest research has no ordinary cards (${cards.length} cards, oversized lead ${state.hasOversizedHomeLead})`);
        if (state.latestColumnGap < 16 || state.latestRowGap < 16) fail(route, width, `latest research gaps are below 16px (${state.latestColumnGap}px/${state.latestRowGap}px)`);
        if (cards.some((card) => Math.abs(card.width - expectedCardWidth) > 1)) fail(route, width, `latest research cards do not share the ordinary ${columns}-column width (${cards.map((card) => card.width).join('/')} versus ${expectedCardWidth}px)`);
        if (state.latestRows.length !== Math.ceil(cards.length / columns)
          || state.latestRows.some((row, index) => row.count !== Math.min(columns, cards.length - index * columns))) fail(route, width, `latest research row composition is wrong (${JSON.stringify(state.latestRows)})`);
        const rowGaps = state.latestRows.slice(1).map((row, index) => row.top - state.latestRows[index].bottom);
        if (rowGaps.some((gap) => gap < 15.5 || Math.abs(gap - state.latestRowGap) > 1)) fail(route, width, `latest research rows touch or have inconsistent spacing (${rowGaps.join('/')}px)`);
        if (columns === 2 && cards.length > 1 && Math.abs(cards[1].left - cards[0].right - state.latestColumnGap) > 1) fail(route, width, 'latest research columns do not have the declared visible gap');
        if (cards.some((card) => !card.accessibleLinks || !card.preview || !card.readingTime || card.titleSize <= 0 || card.titleSize > 26.1)) fail(route, width, `latest article image presentation/accessibility is wrong (${JSON.stringify(cards)})`);
        cardPresentations.set(`${route.slice(1, 3)}:${width}`, {
          cards, columnGap: state.latestColumnGap, rowGap: state.latestRowGap
        });
      }
      if (researchRoutes.has(route)) {
        const home = cardPresentations.get(`${route.slice(1, 3)}:${width}`);
        const reference = state.referencePresentation;
        if (!home || !reference || Math.abs(home.columnGap - reference.columnGap) > 0.1
          || Math.abs(home.rowGap - reference.rowGap) > 0.1
          || home.cards.some((card) => Math.abs(card.titleSize - reference.titleSize) > 0.1
            || Math.abs(card.imageRatio - reference.imageRatio) > 0.02)) fail(route, width, 'home card typography, image ratio or gaps differ from the Research catalogue');
      }
      if (aboutRoutes.has(route)) {
        if (!state.aboutMarker || state.aboutParagraphs.length < 2) fail(route, width, 'About paragraph scope is missing');
        const alignmentCorrect = state.aboutParagraphs.every((paragraph) => width > 600
          ? paragraph.align === 'justify' && paragraph.lastAlign === 'left' && paragraph.hyphens === 'auto'
          : ['left', 'start'].includes(paragraph.align));
        if (!alignmentCorrect) fail(route, width, `About paragraph alignment is wrong (${JSON.stringify(state.aboutParagraphs)})`);
        if (state.aboutHeadingAlign === 'justify') fail(route, width, 'About headings must not inherit paragraph justification');
        if (state.aboutParagraphs.some((paragraph) => Math.abs(paragraph.width - state.aboutProseWidth) > 1)) fail(route, width, 'About paragraphs no longer fill the available body column');
      }
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
        if (state.heroHeight <= 0 || state.heroHeight > 230) fail(route, width, `home hero is outside the compact open-intro range (${state.heroHeight}px)`);
        if (state.heroChildOverflow > 1) fail(route, width, `home hero child overflows its panel by ${state.heroChildOverflow}px`);
      }

      // Beginner-first contracts: type floor on every route, article measure and chrome, research newcomer link.
      const lang = route.slice(1, 3);
      const extra = await page.evaluate(() => {
        const tiny = [];
        for (const root of document.querySelectorAll('header, main, footer')) {
          const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
          for (let node = walker.nextNode(); node; node = walker.nextNode()) {
            const element = node.parentElement;
            if (!node.textContent.trim() || !element || element.closest('script, style, noscript, template')) continue;
            if (!element.checkVisibility({ visibilityProperty: true })) continue;
            const size = Number.parseFloat(getComputedStyle(element).fontSize);
            if (size < 12.9) tiny.push(`${element.tagName}.${String(element.className).replace(/\s+/g, '.')} ${size}px "${node.textContent.trim().slice(0, 24)}"`);
          }
        }
        const body = document.querySelector('.article-body');
        const paragraph = body?.querySelector(':scope > p:not(:has(> img:only-child))');
        let proseChars = 0;
        if (paragraph) {
          // 1ch in the paragraph's own font, so the measure is read in the unit the CSS contract uses.
          const probe = document.createElement('span');
          probe.style.cssText = 'position:absolute;visibility:hidden;width:1ch';
          paragraph.append(probe);
          proseChars = paragraph.getBoundingClientRect().width / probe.getBoundingClientRect().width;
          probe.remove();
        }
        const newcomer = document.querySelector('.article-newcomer');
        const featured = document.querySelector('#featured');
        return {
          tiny: [...new Set(tiny)].slice(0, 8),
          isArticle: Boolean(body),
          wide: Boolean(body?.classList.contains('article-body--wide')),
          proseChars,
          newcomerHrefs: [...(newcomer?.querySelectorAll('a') ?? [])].map((link) => link.getAttribute('href')),
          hasSummary: Boolean(document.querySelector('.article-summary')),
          hasRecordDetails: Boolean(document.querySelector('details.research-record-details')),
          hasOutline: Boolean(document.querySelector('.content-outline--mobile')),
          researchNewcomerHref: document.querySelector('.research-newcomer a')?.getAttribute('href'),
          featuredLabel: featured?.getAttribute('data-outline-label'),
          featuredHeading: featured?.querySelector('h2')?.textContent.trim(),
          featuredOutline: document.querySelector('.content-outline--desktop a[href="#featured"]')?.textContent.trim() ?? ''
        };
      });
      if (extra.tiny.length) fail(route, width, `visible text below the 13px floor: ${extra.tiny.join('; ')}`);
      const beginnerArticle = beginnerArticleRoutes.includes(route);
      if (extra.isArticle && width === 1440 && !extra.wide && extra.proseChars > (beginnerArticle ? 64.5 : 72.5)) fail(route, width, `article paragraphs run ${extra.proseChars.toFixed(1)}ch, past the ${beginnerArticle ? 64 : 72}ch measure`);
      if (extra.isArticle && width === 1440 && !extra.wide && extra.proseChars < (beginnerArticle ? 55 : 60)) fail(route, width, `article paragraphs run ${extra.proseChars.toFixed(1)}ch, under the ${beginnerArticle ? 55 : 60}ch lower bound`);
      if (extra.isArticle && beginnerArticle && (!extra.hasSummary || !extra.hasRecordDetails || extra.newcomerHrefs.length)) fail(route, width, `beginner article is missing its In short box or collapsed research record, or shows the newcomer line (${JSON.stringify(extra)})`);
      if (extra.isArticle && !beginnerArticle && JSON.stringify(extra.newcomerHrefs) !== JSON.stringify([startHereRoute[lang], glossaryRoute[lang]])) fail(route, width, `in-depth article newcomer line must link Start here and the glossary (${extra.newcomerHrefs.join(' ')})`);
      if (extra.isArticle && extra.hasOutline && width === 1440) {
        if (await page.locator('.back-to-contents').first().isVisible()) fail(route, width, 'back-to-contents link is visible on desktop where the outline is already in view');
      }
      if (extra.isArticle && extra.hasOutline && width <= 1160) {
        await page.evaluate(() => window.scrollTo(0, (document.documentElement.scrollHeight - innerHeight) / 2));
        const back = await page.evaluate(() => {
          const link = document.querySelector('.back-to-contents');
          const rect = link?.getBoundingClientRect();
          return {
            visible: Boolean(link?.checkVisibility({ visibilityProperty: true }) && rect && rect.top >= 0 && rect.bottom <= innerHeight),
            width: rect?.width ?? 0, height: rect?.height ?? 0,
            target: Boolean(link && document.getElementById(decodeURIComponent(link.hash.slice(1))))
          };
        });
        if (!back.visible || back.width < 43.5 || back.height < 43.5 || !back.target) fail(route, width, `back-to-contents link is missing, hidden or too small mid-article (${JSON.stringify(back)})`);
        if (back.visible && width === 390) {
          await page.locator('.back-to-contents').click();
          await page.waitForTimeout(400);
          const landed = await page.evaluate(() => {
            const link = document.querySelector('.back-to-contents');
            const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
            return { top: target.getBoundingClientRect().top, header: document.querySelector('.site-header').getBoundingClientRect().bottom };
          });
          if (landed.top < landed.header - 1) fail(route, width, `back-to-contents target hides under the sticky header (top ${landed.top}px, header bottom ${landed.header}px)`);
          await page.reload(); // the click moved the focus origin; the skip-link check below needs a fresh start
        }
        await page.evaluate(() => window.scrollTo(0, 0));
      }
      if (researchRoutes.has(route)) {
        const label = copy[lang].research_featured_h2;
        if (extra.researchNewcomerHref !== startHereRoute[lang] || extra.featuredLabel !== label || extra.featuredHeading !== label || !extra.featuredOutline.includes(label)) fail(route, width, `research index newcomer link or featured label is wrong (${JSON.stringify(extra)}, expected "${label}")`);
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
        if (linkLabels(mobileNetworkLabels).join('|') !== networkLabels(state.htmlLang).join('|')) {
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
      if (homeRoutes.has(route)) {
        const mobile = width <= 1160;
        const returnTarget = page.locator(mobile ? '.mobile-navigation > summary' : '.header-utilities [data-search-open]');
        if (mobile) {
          await returnTarget.focus();
          await page.keyboard.press('Enter');
        }
        const searchTrigger = page.locator(mobile ? '.mobile-navigation [data-search-open]' : '.header-utilities [data-search-open]');
        await searchTrigger.focus();
        await page.keyboard.press('Enter');
        await page.waitForFunction(() => document.activeElement?.matches('[data-search-input]'));
        if (mobile && await page.locator('.mobile-navigation').evaluate(node => node.open)) fail(route, width, 'opening search did not collapse mobile menu');
        await page.keyboard.press('Escape');
        await page.waitForFunction(selector => document.activeElement?.matches(selector), mobile ? '.mobile-navigation > summary' : '.header-utilities [data-search-open]');
        if (!(await returnTarget.evaluate(node => document.activeElement === node && node.checkVisibility({ visibilityProperty: true })))) fail(route, width, 'search dismissal lost visible keyboard focus');
      }
      await context.close();
    }
  }

  for (const language of ['en', 'lt']) {
    const shortPhone = await browser.newContext({ viewport: { width: 320, height: 568 }, reducedMotion: 'reduce' });
    const shortPage = await shortPhone.newPage();
    await shortPage.goto(`${baseUrl}/${language}/`, { waitUntil: 'networkidle' });
    const cta = await shortPage.locator('.home-discovery .button--primary').boundingBox();
    if (!cta || cta.y + cta.height > 568) fail(`/${language}/`, 320, 'hero Start here button is clipped below the short-phone arrival viewport');
    await shortPhone.close();
  }

  for (const [key, presentation] of cardPresentations) {
    const [edition, width] = key.split(':');
    const counterpart = cardPresentations.get(`${edition === 'en' ? 'lt' : 'en'}:${width}`);
    if (edition === 'en' && counterpart?.cards.length !== presentation.cards.length) fail('/en/ and /lt/', Number(width), `home latest-card counts differ between editions (${presentation.cards.length} versus ${counterpart?.cards.length})`);
  }
  for (const [key, rail] of contactRails) {
    const [edition, width] = key.split(':');
    const counterpart = contactRails.get(`${edition === 'en' ? 'lt' : 'en'}:${width}`);
    if (edition === 'en' && counterpart !== rail) fail('/en/contact/ and /lt/kontaktai/', Number(width), `contact action rail differs between editions (${rail} versus ${counterpart})`);
  }

  const noScript = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 }, reducedMotion: 'reduce', serviceWorkers: 'block' });
  const page = await noScript.newPage();
  await page.goto(`${baseUrl}/en/`, { waitUntil: 'domcontentloaded' });
  await page.locator('.mobile-navigation > summary').click();
  const noScriptState = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    productLinks: document.querySelectorAll('.mobile-navigation[open] .mobile-product-navigation a:not([hreflang])').length,
    firstProductHref: document.querySelector('.mobile-navigation[open] .mobile-product-navigation a:not([hreflang])')?.getAttribute('href'),
    networkLinks: document.querySelectorAll('.mobile-navigation[open] .mobile-portfolio-navigation a').length,
    networkLabels: [...document.querySelectorAll('.mobile-navigation[open] .mobile-portfolio-navigation a')]
      .map((link) => link.textContent.trim()),
    purpose: document.querySelector('main h1')?.textContent.trim() ?? ''
  }));
  if (noScriptState.overflow > 1) fail('/en/ (no JavaScript)', 390, 'page overflows horizontally');
  if (
    noScriptState.productLinks !== sectionCount
    || noScriptState.firstProductHref !== startHereRoute.en
    || noScriptState.networkLinks !== networkLabels('en').length
    || linkLabels(noScriptState.networkLabels).join('|') !== networkLabels('en').join('|')
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
  for (const route of ['/en/research/fakegit-ai-skills-mutable-downloads/', '/lt/tyrimai/fakegit-ai-igudziai-kintantys-atsisiuntimai/']) {
    await page.goto(baseUrl + route, { waitUntil: 'domcontentloaded' });
    const article = await page.evaluate(() => ({
      title: document.querySelector('main h1')?.textContent.trim(),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      codeExamples: document.querySelectorAll('.article-body pre code').length,
      figures: [...document.querySelectorAll('.hx-evidence-figure')].map(figure => ({
        caption: Boolean(figure.querySelector('figcaption')?.textContent.trim()),
        original: Boolean(figure.querySelector('a.evidence-original[href]')),
        alt: Boolean(figure.querySelector('img')?.alt.trim())
      }))
    }));
    if (!article.title || !article.codeExamples) fail(route + ' (no JavaScript)', 390, 'article or static-analysis code examples are unavailable');
    if (article.overflow > 1) fail(route + ' (no JavaScript)', 390, `page overflows horizontally by ${article.overflow}px`);
    if (article.figures.length !== 9 || article.figures.some(figure => !figure.caption || !figure.original || !figure.alt)) fail(route + ' (no JavaScript)', 390, 'evidence figures require readable captions, alt text and native original links');
  }
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
      paragraphChar: (() => {
        const probe = document.createElement('span');
        probe.style.cssText = 'position:absolute;visibility:hidden;width:1ch';
        paragraph.append(probe);
        const size = probe.getBoundingClientRect().width;
        probe.remove();
        return size;
      })(),
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
  // Prose keeps the 72ch reading measure; the wide evidence track still starts on the same left edge and may only be wider.
  const desktopArticleEdgesMatch = Math.abs(wideTableState.paragraphLeft - wideTableState.regionLeft) <= 1
    && wideTableState.paragraphWidth <= wideTableState.regionWidth + 1
    && wideTableState.paragraphWidth / wideTableState.paragraphChar <= 72.5;
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
  for (const language of ['en', 'lt']) {
    const context = await browser.newContext({ viewport: { width: 390, height: 900 } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    let requests = 0;
    await page.route(`**/${language}/search.json`, async (route) => {
      requests += 1;
      await new Promise((resolve) => setTimeout(resolve, 650));
      await route.continue();
    });
    await page.goto(`${baseUrl}/${language}/`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.querySelector('[data-search-dialog]').showModal());
    const input = page.locator('[data-search-input]');
    await input.fill('unipark');
    await input.fill('');
    await page.waitForTimeout(900);
    if (await page.locator('[data-search-results]').innerText()) fail('search', 390, `${language}: stale results appeared after clearing input`);
    if (requests !== 1) fail('search', 390, `${language}: duplicate in-flight index requests (${requests})`);
    await input.fill('unipark');
    await page.waitForTimeout(100);
    const first = await page.locator('[data-search-results] a').first().getAttribute('href');
    if (!first?.includes('unipark-smishing')) fail('search', 390, `${language}: dedicated title was not first (${first})`);
    if (language === 'lt') {
      await input.fill('itartina');
      await page.waitForTimeout(100);
      const accented = await page.locator('[data-search-results] a').first().getAttribute('href');
      if (!accented?.includes('sms-nuoroda')) fail('search', 390, 'LT accent-insensitive title match was lost');
    }
    await context.close();

    const retryContext = await browser.newContext({ viewport: { width: 390, height: 900 } });
    const retryPage = await retryContext.newPage();
    retryPage.on('pageerror', (error) => errors.push(error.message));
    let retryRequests = 0;
    await retryPage.route(`**/${language}/search.json`, async (route) => {
      retryRequests += 1;
      if (retryRequests === 1) await route.fulfill({ status: 503, body: 'unavailable' });
      else await route.continue();
    });
    await retryPage.goto(`${baseUrl}/${language}/`, { waitUntil: 'networkidle' });
    await retryPage.evaluate(() => document.querySelector('[data-search-dialog]').showModal());
    const retryInput = retryPage.locator('[data-search-input]');
    await retryInput.focus();
    await retryPage.waitForTimeout(150);
    await retryInput.fill('unipark');
    await retryPage.locator('[data-search-results] a').first().waitFor();
    if (retryRequests !== 2 || errors.length) fail('search', 390, `${language}: prefetch/retry failure (${retryRequests} requests, ${errors.join(', ')})`);
    await retryContext.close();
  }
} finally {
  await browser.close();
  await new Promise((accept) => server.close(accept));
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`Responsive audit passed: ${routes.length} pages × ${widths.length} viewports, ${fullScreenRoutes.size} full-screen checks, plus no-JavaScript navigation, scroll-aware reading maps and wide-table inspection.`);
