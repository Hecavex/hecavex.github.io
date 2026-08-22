#!/usr/bin/env node

import { createServer } from 'node:http';
import { existsSync, statSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';
import process from 'node:process';
import { chromium } from 'playwright-core';

const siteRoot = resolve(process.argv[2] || '_site');
const widths = [320, 360, 390, 768, 1024];
const routes = [
  '/',
  '/en/',
  '/lt/',
  '/en/projects/',
  '/lt/projektai/',
  '/en/glossary/',
  '/lt/zodynas/',
  '/en/briefings/2026-08-22/',
  '/en/research/unipark-smishing-campaign-infrastructure/'
];

const browserCandidates = [
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
].filter(Boolean);

const executablePath = browserCandidates.find((candidate) => existsSync(candidate));
if (!executablePath) {
  throw new Error(
    'No Chromium-based browser found. Set PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH to run the responsive audit.'
  );
}

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8'
};

function requestedFile(url) {
  const pathname = decodeURIComponent(new URL(url, 'http://127.0.0.1').pathname);
  const relative = normalize(pathname).replace(/^[/\\]+/, '');
  let file = resolve(siteRoot, relative);
  if (file !== siteRoot && !file.startsWith(`${siteRoot}${sep}`)) return null;
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!existsSync(file) && !extname(file)) file = join(file, 'index.html');
  return file;
}

const server = createServer(async (request, response) => {
  const file = requestedFile(request.url || '/');
  if (!file || !existsSync(file) || !statSync(file).isFile()) {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }

  response.writeHead(200, {
    'content-type': mimeTypes[extname(file).toLowerCase()] || 'application/octet-stream',
    'cache-control': 'no-store'
  });
  response.end(await readFile(file));
});

await new Promise((accept, reject) => {
  server.once('error', reject);
  server.listen(0, '127.0.0.1', accept);
});

const address = server.address();
const baseUrl = `http://127.0.0.1:${address.port}`;
const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: process.platform === 'linux' ? ['--no-sandbox'] : []
});
const failures = [];

function fail(route, width, message) {
  failures.push(`${route} @ ${width}px: ${message}`);
}

try {
  for (const route of routes) {
    for (const width of widths) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        reducedMotion: 'reduce',
        serviceWorkers: 'block'
      });
      const page = await context.newPage();
      const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });

      if (!response || response.status() !== 200) {
        fail(route, width, `expected HTTP 200, received ${response?.status() || 'no response'}`);
        await context.close();
        continue;
      }

      const layout = await page.evaluate((viewportWidth) => {
        const root = document.documentElement;
        const body = document.body;
        const h1 = document.querySelector('h1');
        const privacy = document.querySelector('.hx-privacy-notice:not([hidden])');
        const selectors = [
          'main',
          'body > header',
          'body > footer',
          'main section',
          'main article',
          '.container',
          '.row',
          '.hx-project-card',
          '.hx-home-radar',
          '.hx-labs-grid',
          '.portal-edition',
          '.portal-radar'
        ];
        const clipped = [];
        document.querySelectorAll(selectors.join(',')).forEach((element) => {
          const style = getComputedStyle(element);
          if (style.display === 'none' || style.visibility === 'hidden') return;
          const rect = element.getBoundingClientRect();
          if (rect.width > 0 && (rect.left < -1 || rect.right > viewportWidth + 1)) {
            clipped.push(`${element.tagName.toLowerCase()}.${element.className || '(no-class)'}`);
          }
        });

        const unsafeTables = [...document.querySelectorAll('.table-wrapper')].filter(
          (wrapper) => wrapper.scrollWidth > wrapper.clientWidth + 1 &&
            !['auto', 'scroll'].includes(getComputedStyle(wrapper).overflowX)
        ).length;
        const unsafeCode = [...document.querySelectorAll('pre')].filter((block) => {
          const rect = block.getBoundingClientRect();
          if (rect.right <= viewportWidth + 1 && rect.left >= -1) return false;
          const scroller = block.closest('.highlight, .highlighter-rouge, .table-wrapper');
          if (!scroller) return true;
          const scrollerRect = scroller.getBoundingClientRect();
          const overflow = getComputedStyle(scroller).overflowX;
          return !['auto', 'scroll'].includes(overflow) || scrollerRect.left < -1 || scrollerRect.right > viewportWidth + 1;
        }).length;

        const overflowSources = [...document.querySelectorAll('body *')]
          .filter((element) => {
            const style = getComputedStyle(element);
            if (style.display === 'none' || style.visibility === 'hidden') return false;
            const rect = element.getBoundingClientRect();
            return rect.width > 0 && (rect.left < -1 || rect.right > viewportWidth + 1);
          })
          .slice(0, 8)
          .map((element) => {
            const rect = element.getBoundingClientRect();
            const identity = element.id ? `#${element.id}` : `.${String(element.className || 'no-class').trim().replace(/\s+/g, '.')}`;
            return `${element.tagName.toLowerCase()}${identity} [${Math.round(rect.left)}, ${Math.round(rect.right)}]`;
          });

        return {
          documentOverflow: Math.max(root.scrollWidth, body.scrollWidth) - root.clientWidth,
          overflowSources,
          clipped,
          h1Height: h1?.getBoundingClientRect().height || 0,
          privacyPosition: privacy ? getComputedStyle(privacy).position : null,
          unsafeTables,
          unsafeCode
        };
      }, width);

      if (layout.documentOverflow > 1) {
        const sources = layout.overflowSources.length ? `; sources: ${layout.overflowSources.join(', ')}` : '';
        fail(route, width, `page overflows horizontally by ${layout.documentOverflow}px${sources}`);
      }
      if (layout.clipped.length) fail(route, width, `important containers leave the viewport: ${layout.clipped.join(', ')}`);
      if (layout.h1Height > 630) fail(route, width, 'h1 consumes more than 70% of the first 900px viewport');
      if (['fixed', 'sticky'].includes(layout.privacyPosition)) fail(route, width, 'privacy notice overlays page content');
      if (layout.unsafeTables) fail(route, width, `${layout.unsafeTables} wide table wrapper(s) cannot scroll independently`);
      if (layout.unsafeCode) fail(route, width, `${layout.unsafeCode} code block(s) leave the viewport`);

      const skipLink = page.locator('.portal-skip, .hx-skip-link').first();
      await page.keyboard.press('Tab');
      const focusState = await skipLink.evaluate((active) => {
        const rect = active.getBoundingClientRect();
        const style = getComputedStyle(active);
        const visible = rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < innerHeight;
        const identified = Boolean(active.textContent?.trim() || active.getAttribute('aria-label'));
        const keyboardTarget = document.activeElement === active;
        const focusVisible = style.outlineStyle !== 'none' && Number.parseFloat(style.outlineWidth) >= 2;
        return {
          valid: visible && identified && keyboardTarget && focusVisible,
          reason: `${active.tagName}.${active.className || '(no-class)'} is not the visibly focused keyboard target ` +
            `(outline ${style.outlineStyle} ${style.outlineWidth}; active ${document.activeElement?.tagName || 'none'}.` +
            `${document.activeElement?.className || '(no-class)'})`
        };
      });
      if (!focusState.valid) fail(route, width, focusState.reason);
      if (route !== '/' && width <= 1024) {
        await page.keyboard.press('Tab');
        const nextFocus = await page.evaluate(() => ({
          id: document.activeElement?.id || '',
          label: document.activeElement?.getAttribute('aria-label') || document.activeElement?.textContent?.trim() || ''
        }));
        if (nextFocus.id !== 'rail-trigger') {
          fail(route, width, `closed navigation rail precedes the visible menu trigger in tab order (focused ${nextFocus.id || nextFocus.label || 'unknown'})`);
        }
      }
      await page.evaluate(() => document.activeElement?.blur());

      const searchTrigger = page.locator('#search-trigger');
      if (await searchTrigger.count()) {
        await searchTrigger.click();
        const searchInput = page.locator('#search-input');
        if (!(await searchInput.isVisible()) || !(await searchInput.evaluate((element) => document.activeElement === element))) {
          fail(route, width, 'opening search does not expose and focus its input');
        }
        await page.keyboard.press('Escape');
        if (await searchInput.isVisible()) fail(route, width, 'Escape does not close search');
        if (!(await searchTrigger.evaluate((element) => document.activeElement === element))) {
          fail(route, width, 'closing search does not restore focus to its trigger');
        }
        await searchTrigger.evaluate((element) => element.blur());
      }

      const topbarLanguage = page.locator('.hx-language--topbar');
      if (await topbarLanguage.count()) {
        const languageSummary = topbarLanguage.locator('summary');
        await languageSummary.click();
        const languageLink = topbarLanguage.locator('a').first();
        await languageLink.focus();
        await page.keyboard.press('Escape');
        if (await topbarLanguage.evaluate((element) => element.open)) {
          fail(route, width, 'Escape does not close the language disclosure');
        }
        if (!(await languageSummary.evaluate((element) => document.activeElement === element))) {
          fail(route, width, 'closing the language disclosure does not restore focus to its summary');
        }
        await languageSummary.evaluate((element) => element.blur());
      }

      if (route === '/en/' && width === 390) {
        await page.evaluate(() => {
          window.__hecavexScrollOptions = null;
          window.scrollTo = (options) => { window.__hecavexScrollOptions = options; };
          document.getElementById('page-top')?.click();
        });
        const scrollBehavior = await page.evaluate(() => window.__hecavexScrollOptions?.behavior);
        if (scrollBehavior !== 'auto') fail(route, width, 'back-to-top ignores the reduced-motion preference');
      }

      if (route === '/') {
        if (width <= 850) {
          const mobileMenu = page.locator('.portal-mobile-nav > summary');
          if (!(await mobileMenu.isVisible())) {
            fail(route, width, 'mobile landing-page navigation is not visible');
          } else {
            await mobileMenu.click();
            const visibleLinks = await page.locator('.portal-mobile-nav[open] nav a:visible').count();
            if (visibleLinks < 5) fail(route, width, 'mobile landing-page navigation does not expose every primary destination');
          }
        } else if (!(await page.locator('.portal-desktop-nav').isVisible())) {
          fail(route, width, 'desktop landing-page navigation is not visible');
        }
      } else if (width <= 1024) {
        const trigger = page.locator('#rail-trigger');
        if (!(await trigger.isVisible())) {
          fail(route, width, 'navigation rail trigger is not visible');
        } else {
          const closedState = await page.locator('#publication-rail').evaluate((element) => ({
            ariaHidden: element.getAttribute('aria-hidden'),
            inert: element.inert
          }));
          if (!closedState.inert || closedState.ariaHidden !== 'true') {
            fail(route, width, 'closed navigation rail remains exposed to assistive technology or keyboard navigation');
          }
          await trigger.click();
          const sidebarVisible = await page.locator('#publication-rail').evaluate((element) => {
            const rect = element.getBoundingClientRect();
            return rect.right > 0 && rect.left < innerWidth;
          });
          if (!sidebarVisible) fail(route, width, 'navigation rail did not enter the viewport after activation');
          const openState = await page.locator('#publication-rail').evaluate((element) => ({
            ariaHidden: element.getAttribute('aria-hidden'),
            inert: element.inert
          }));
          if (openState.inert || openState.ariaHidden !== null) {
            fail(route, width, 'open navigation rail is still hidden from keyboard or assistive technology');
          }
          const closeButton = page.locator('#rail-close');
          if (!(await closeButton.isVisible()) || !(await closeButton.evaluate((element) => document.activeElement === element))) {
            fail(route, width, 'opening the navigation rail does not expose and focus its close control');
          }
          const triggerLabel = await trigger.getAttribute('aria-label');
          if (!/close|uždaryti/i.test(triggerLabel || '')) fail(route, width, 'open sidebar trigger has no close label');
          const projectLink = page.locator('#publication-rail .sidebar-nav a[href$="/projects/"], #publication-rail .sidebar-nav a[href$="/projektai/"]');
          if (!(await projectLink.first().isVisible())) fail(route, width, 'portfolio link is not reachable in mobile navigation');
          const workspace = page.locator('#publication-rail .hx-workspace-switcher > summary');
          if (!(await workspace.isVisible())) {
            fail(route, width, 'workspace switcher is not reachable in mobile navigation');
          } else {
            await workspace.click();
            if (!(await page.locator('#publication-rail .hx-workspace-switcher a[href="https://labs.hecavex.com/data/"]').isVisible())) {
              fail(route, width, 'Data destination is missing from the workspace switcher');
            }
          }
          await closeButton.click();
          const closedAgain = await page.locator('#publication-rail').evaluate((element) => ({
            ariaHidden: element.getAttribute('aria-hidden'),
            inert: element.inert
          }));
          if (!closedAgain.inert || closedAgain.ariaHidden !== 'true') {
            fail(route, width, 'navigation rail does not leave the accessibility tree after closing');
          }
          if (!(await trigger.evaluate((element) => document.activeElement === element))) {
            fail(route, width, 'closing the navigation rail does not restore focus to the trigger');
          }
        }
      }

      await context.close();
    }
  }

  const noJavaScriptContext = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 900 },
    reducedMotion: 'reduce',
    serviceWorkers: 'block'
  });
  const noJavaScriptPage = await noJavaScriptContext.newPage();
  const noJavaScriptResponse = await noJavaScriptPage.goto(`${baseUrl}/en/`, { waitUntil: 'domcontentloaded' });
  if (!noJavaScriptResponse || noJavaScriptResponse.status() !== 200) {
    fail('/en/ (no JavaScript)', 390, `expected HTTP 200, received ${noJavaScriptResponse?.status() || 'no response'}`);
  } else {
    const noJavaScriptState = await noJavaScriptPage.evaluate(() => {
      const sidebar = document.getElementById('publication-rail');
      const trigger = document.getElementById('rail-trigger');
      const project = sidebar?.querySelector('.sidebar-nav a[href$="/projects/"]');
      const rect = sidebar?.getBoundingClientRect();
      return {
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        projectVisible: Boolean(project && project.getClientRects().length),
        sidebarPosition: sidebar ? getComputedStyle(sidebar).position : null,
        sidebarVisible: Boolean(rect && rect.right > 0 && rect.left < innerWidth),
        triggerVisible: Boolean(trigger && trigger.getClientRects().length)
      };
    });
    if (noJavaScriptState.overflow > 1) fail('/en/ (no JavaScript)', 390, 'page overflows horizontally');
    if (!noJavaScriptState.sidebarVisible || noJavaScriptState.sidebarPosition !== 'static') {
      fail('/en/ (no JavaScript)', 390, 'primary navigation is not presented as in-flow content');
    }
    if (!noJavaScriptState.projectVisible) fail('/en/ (no JavaScript)', 390, 'primary project navigation is unreachable');
    if (noJavaScriptState.triggerVisible) fail('/en/ (no JavaScript)', 390, 'non-functional menu trigger remains visible');
  }
  await noJavaScriptContext.close();

  const articleRoute = '/en/research/unipark-smishing-campaign-infrastructure/';
  const noJavaScriptArticleContext = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
    serviceWorkers: 'block'
  });
  const noJavaScriptArticle = await noJavaScriptArticleContext.newPage();
  await noJavaScriptArticle.goto(`${baseUrl}${articleRoute}`, { waitUntil: 'domcontentloaded' });
  const noJavaScriptOutline = await noJavaScriptArticle.evaluate(() => {
    const outline = document.querySelector('.hx-toc');
    const grid = document.querySelector('.site-content-grid.has-panel');
    return {
      hidden: Boolean(outline?.hidden),
      visible: Boolean(outline?.getClientRects().length),
      gridColumns: grid ? getComputedStyle(grid).gridTemplateColumns.split(' ').length : 0
    };
  });
  if (!noJavaScriptOutline.hidden || noJavaScriptOutline.visible) {
    fail(`${articleRoute} (no JavaScript)`, 1440, 'empty article outline is exposed without JavaScript');
  }
  if (noJavaScriptOutline.gridColumns !== 1) {
    fail(`${articleRoute} (no JavaScript)`, 1440, 'hidden outline still reserves a second layout column');
  }
  await noJavaScriptArticleContext.close();

  const articleOutlineContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
    serviceWorkers: 'block'
  });
  const articleOutlinePage = await articleOutlineContext.newPage();
  await articleOutlinePage.goto(`${baseUrl}${articleRoute}`, { waitUntil: 'networkidle' });
  const articleOutline = await articleOutlinePage.evaluate(() => ({
    links: document.querySelectorAll('#article-outline a').length,
    ready: document.querySelector('.site-content-grid')?.classList.contains('outline-ready') || false,
    visible: Boolean(document.querySelector('.hx-toc')?.getClientRects().length)
  }));
  if (!articleOutline.ready || !articleOutline.visible || articleOutline.links === 0) {
    fail(articleRoute, 1440, 'local article outline was not populated and revealed');
  }
  await articleOutlineContext.close();

  for (const colorScheme of ['light', 'dark']) {
    const contrastContext = await browser.newContext({
      colorScheme,
      viewport: { width: 1440, height: 900 },
      serviceWorkers: 'block'
    });
    const contrastPage = await contrastContext.newPage();
    await contrastPage.goto(`${baseUrl}/en/`, { waitUntil: 'networkidle' });
    const contrast = await contrastPage.evaluate(() => {
      const parse = (value) => {
        const hex = value.trim().match(/^#([0-9a-f]{6})$/i);
        if (hex) return [0, 2, 4].map((offset) => Number.parseInt(hex[1].slice(offset, offset + 2), 16));
        const rgb = value.match(/rgba?\((\d+(?:\.\d+)?)[, ]+(\d+(?:\.\d+)?)[, ]+(\d+(?:\.\d+)?)/i);
        return rgb ? rgb.slice(1, 4).map(Number) : null;
      };
      const luminance = (rgb) => {
        const values = rgb.map((channel) => {
          const value = channel / 255;
          return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * values[0] + 0.7152 * values[1] + 0.0722 * values[2];
      };
      const ratio = (foreground, background) => {
        const foregroundLuminance = luminance(parse(foreground));
        const backgroundLuminance = luminance(parse(background));
        return (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
          (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);
      };
      const rootStyle = getComputedStyle(document.documentElement);
      const backgrounds = ['--hx-bg', '--hx-paper'].map((name) => rootStyle.getPropertyValue(name));
      const secondary = ['--hx-muted', '--hx-faint'].map((name) => ({
        name,
        minimumRatio: Math.min(...backgrounds.map((background) => ratio(rootStyle.getPropertyValue(name), background)))
      }));
      const primary = document.querySelector('.hx-button--primary');
      const primaryStyle = getComputedStyle(primary);
      return {
        primaryRatio: ratio(primaryStyle.color, primaryStyle.backgroundColor),
        secondary
      };
    });
    if (contrast.primaryRatio < 4.5) {
      fail(`/en/ (${colorScheme} contrast)`, 1440, `primary button contrast is ${contrast.primaryRatio.toFixed(2)}:1`);
    }
    contrast.secondary.forEach(({ name, minimumRatio }) => {
      if (minimumRatio < 4.5) {
        fail(`/en/ (${colorScheme} contrast)`, 1440, `${name} contrast is ${minimumRatio.toFixed(2)}:1`);
      }
    });
    await contrastContext.close();
  }
} finally {
  await browser.close();
  await new Promise((accept) => server.close(accept));
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(
  `Responsive audit passed: ${routes.length} pages × ${widths.length} viewports plus no-JavaScript navigation and light/dark contrast; no page overflow, clipped primary layout, obstructive privacy notice or unreachable navigation.`
);
