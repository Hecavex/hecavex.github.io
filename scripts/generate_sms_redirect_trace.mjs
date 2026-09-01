#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { chromium } from 'playwright-core';

const projectRoot = resolve(import.meta.dirname, '..');
const outputRoot = join(projectRoot, 'public', 'assets', 'img', 'posts', '2026-08-31-suspicious-sms-guide');
const browserCandidates = [
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
].filter(Boolean);
const executablePath = browserCandidates.find((candidate) => existsSync(candidate));
if (!executablePath) throw new Error('A Chromium browser is required to render the controlled redirect trace.');

const locales = {
  en: {
    eyebrow: 'CONTROLLED EXAMPLE · ACTIVE ANALYST LANE',
    title: 'A short-link destination requires network contact.',
    subtitle: 'This trace was generated only against 127.0.0.1. It demonstrates the boundary without resolving or visiting any public host.',
    headers: ['STEP', 'REQUEST', 'RESPONSE', 'LOCATION'],
    observation: 'OBSERVATION',
    observationText: 'A redirect trace records what this client received at this time. It does not prove that another device, country, token or later visit will receive the same chain.',
    stop: 'STOP CONDITIONS',
    stopText: 'Download · credential form · authentication prompt · unexpected external host · browser challenge',
    footer: 'No live malicious infrastructure contacted · no form submitted · no recipient token used'
  },
  lt: {
    eyebrow: 'KONTROLIUOJAMAS PAVYZDYS · AKTYVI ANALITIKO ZONA',
    title: 'Trumposios nuorodos paskirties be tinklo užklausos nenustatysime.',
    subtitle: 'Ši grandinė sukurta tik 127.0.0.1 aplinkoje. Ji parodo ribą neatidarant ir nerezolvinant jokio viešo hosto.',
    headers: ['ŽINGSNIS', 'UŽKLAUSA', 'ATSAKYMAS', 'PASKIRTIS'],
    observation: 'KĄ TAI PARODO',
    observationText: 'Peradresavimų grandinė parodo, ką šis klientas gavo šiuo metu. Ji neįrodo, kad kitas įrenginys, šalis, žymuo ar vėlesnis apsilankymas gaus tą patį.',
    stop: 'STABDYMO SĄLYGOS',
    stopText: 'Atsisiuntimas · prisijungimo forma · autentifikavimo prašymas · netikėtas išorinis hostas · naršyklės patikra',
    footer: 'Nekontaktuota jokia vieša ar kenkėjiška infrastruktūra · forma nepateikta · gavėjo žymuo nenaudotas'
  }
};

function documentFor(copy) {
  const rows = [
    ['01', '/short/8Qv2', '302', '/gate?flow=sms-demo'],
    ['02', '/gate?flow=sms-demo', '302', '/landing?view=training'],
    ['03', '/landing?view=training', '200', '—']
  ];
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    *{box-sizing:border-box}html,body{margin:0;width:1600px;height:1000px;overflow:hidden;background:#111416;color:#ece9e1}
    body{font-family:Inter,"Segoe UI",Arial,sans-serif;padding:66px 72px;background:#111416}
    .mono,.eyebrow,.label,th,td:first-child,.brand,.lab{font-family:"IBM Plex Mono",Consolas,monospace}
    header{height:70px;display:flex;align-items:flex-start;justify-content:space-between;border-bottom:1px solid #30383b}
    .identity{display:flex;align-items:center;gap:20px}.mark{width:38px;height:42px}.brand{font-size:18px;font-weight:700;letter-spacing:5px;margin-bottom:6px}.edition{font:11px "IBM Plex Mono",Consolas,monospace;color:#8d969a;letter-spacing:2px}
    .lab{border:1px solid #30383b;padding:14px 20px;color:#ece9e1;font-size:13px;letter-spacing:1.2px}
    main{padding-top:42px}.eyebrow{color:#55b9b1;font-size:15px;font-weight:700;letter-spacing:2px}
    h1{font-size:54px;line-height:1.03;letter-spacing:-1.8px;max-width:1180px;margin:18px 0 20px}.subtitle{font-size:20px;line-height:1.55;color:#ece9e1;max-width:1400px;margin:0 0 34px}
    table{width:100%;border-collapse:collapse;background:#171b1d;font-size:15px}th,td{border:1px solid #30383b;text-align:left;padding:15px 16px}th{height:44px;background:#1d2326;color:#8d969a;font-size:12px;letter-spacing:1.2px}td{height:48px;font-weight:600}td:nth-child(3){color:#d2aa62}.ok{color:#86b77e!important}
    .panels{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:18px}.panel{min-height:132px;border:1px solid #30383b;background:#171b1d;padding:24px}.label{font-size:12px;color:#8d969a;letter-spacing:1.5px;margin-bottom:16px}.copy{font-size:17px;line-height:1.48;color:#ece9e1}
    footer{margin-top:18px;border-left:4px solid #86b77e;background:#171b1d;padding:17px 20px;color:#ece9e1;font:600 13px "IBM Plex Mono",Consolas,monospace;letter-spacing:.2px}
  </style></head><body>
    <header><div class="identity"><svg class="mark" viewBox="0 0 48 48" aria-hidden="true"><path d="M5 4v40M43 4v40M5 7l38 34M43 7 5 41" fill="none" stroke="#55b9b1" stroke-width="3"/></svg><div><div class="brand">HECAVEX</div><div class="edition">RESEARCH / CONTROLLED EVIDENCE</div></div></div><div class="lab">SMS LINK SAFETY LAB · 127.0.0.1</div></header>
    <main><div class="eyebrow">${copy.eyebrow}</div><h1>${copy.title}</h1><p class="subtitle">${copy.subtitle}</p>
      <table><thead><tr>${copy.headers.map((header) => `<th>${header}</th>`).join('')}</tr></thead><tbody>${rows.map((row, index) => `<tr>${row.map((cell, cellIndex) => `<td class="${index === 2 && cellIndex === 2 ? 'ok' : ''}">${cell}</td>`).join('')}</tr>`).join('')}</tbody></table>
      <div class="panels"><section class="panel"><div class="label">${copy.observation}</div><div class="copy">${copy.observationText}</div></section><section class="panel"><div class="label">${copy.stop}</div><div class="copy">${copy.stopText}</div></section></div>
      <footer>${copy.footer}</footer>
    </main></body></html>`;
}

const browser = await chromium.launch({ headless: true, executablePath });
try {
  for (const [lang, copy] of Object.entries(locales)) {
    const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
    await page.setContent(documentFor(copy), { waitUntil: 'load' });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
      path: join(outputRoot, `controlled-redirect-trace-${lang}.png`),
      animations: 'disabled'
    });
    await page.close();
  }
} finally {
  await browser.close();
}

console.log('Generated controlled redirect-trace screenshots for English and Lithuanian.');
