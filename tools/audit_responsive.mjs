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

        return {
          documentOverflow: Math.max(root.scrollWidth, body.scrollWidth) - root.clientWidth,
          clipped,
          h1Height: h1?.getBoundingClientRect().height || 0,
          privacyPosition: privacy ? getComputedStyle(privacy).position : null,
          unsafeTables,
          unsafeCode
        };
      }, width);

      if (layout.documentOverflow > 1) fail(route, width, `page overflows horizontally by ${layout.documentOverflow}px`);
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
      await page.evaluate(() => document.activeElement?.blur());

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
      } else if (width <= 849) {
        const trigger = page.locator('#sidebar-trigger');
        if (!(await trigger.isVisible())) {
          fail(route, width, 'sidebar trigger is not visible');
        } else {
          await trigger.click();
          const sidebarVisible = await page.locator('#sidebar').evaluate((element) => {
            const rect = element.getBoundingClientRect();
            return rect.right > 0 && rect.left < innerWidth;
          });
          if (!sidebarVisible) fail(route, width, 'sidebar did not enter the viewport after activation');
          const projectLink = page.locator('#sidebar nav[aria-label="Primary navigation"] a[href$="/projects/"], #sidebar nav[aria-label="Primary navigation"] a[href$="/projektai/"]');
          if (!(await projectLink.first().isVisible())) fail(route, width, 'portfolio link is not reachable in mobile navigation');
          const workspace = page.locator('#sidebar .hx-workspace-switcher > summary');
          if (!(await workspace.isVisible())) {
            fail(route, width, 'workspace switcher is not reachable in mobile navigation');
          } else {
            await workspace.click();
            if (!(await page.locator('#sidebar .hx-workspace-switcher a[href="https://labs.hecavex.com/data/"]').isVisible())) {
              fail(route, width, 'Data destination is missing from the workspace switcher');
            }
          }
        }
      }

      await context.close();
    }
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
  `Responsive audit passed: ${routes.length} pages × ${widths.length} viewports; no page overflow, clipped primary layout, obstructive privacy notice or unreachable navigation.`
);
