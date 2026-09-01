#!/usr/bin/env node

import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const imageRoot = join(root, 'public', 'assets', 'img', 'posts');

const palette = {
  bg: '#111416',
  panel: '#171b1d',
  panelStrong: '#1d2326',
  line: '#30383b',
  muted: '#8d969a',
  text: '#ece9e1',
  cyan: '#55b9b1',
  green: '#86b77e',
  amber: '#d2aa62',
  red: '#d06c65'
};

const escapeXml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

function shell(width, height, body, label = 'HECAVEX / DEFENSIVE RESEARCH', title = label, description = 'Evidence-led defensive research illustration') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
  <title id="title">${escapeXml(title)}</title>
  <desc id="desc">${escapeXml(description)}</desc>
  <defs>
    <marker id="arrow" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="10" markerHeight="10" orient="auto"><path d="M0 0 12 6 0 12Z" fill="${palette.cyan}"/></marker>
    <style>
      .sans{font-family:Inter,Arial,sans-serif}.mono{font-family:'IBM Plex Mono',Consolas,monospace}
      .title{font:700 52px Inter,Arial,sans-serif;fill:${palette.text};letter-spacing:-1.5px}
      .subtitle{font:400 25px Inter,Arial,sans-serif;fill:${palette.muted}}
      .eyebrow{font:600 18px 'IBM Plex Mono',Consolas,monospace;fill:${palette.cyan};letter-spacing:3px}
      .node-title{font:700 28px Inter,Arial,sans-serif;fill:${palette.text}}
      .node-copy{font:400 20px Inter,Arial,sans-serif;fill:${palette.muted}}
      .node-code{font:600 18px 'IBM Plex Mono',Consolas,monospace;fill:${palette.cyan}}
      .note{font:500 19px Inter,Arial,sans-serif;fill:${palette.muted}}
    </style>
  </defs>
  <rect width="${width}" height="${height}" fill="${palette.bg}"/>
  <path d="M0 8H${width}" stroke="${palette.cyan}" stroke-width="8"/>
  <text x="72" y="62" class="eyebrow">${escapeXml(label)}</text>
  ${body}
</svg>`;
}

function lines(items, x, y, className, gap = 30, anchor = 'start') {
  return `<text x="${x}" y="${y}" class="${className}" text-anchor="${anchor}">${items.map((item, index) => `<tspan x="${x}" dy="${index === 0 ? 0 : gap}">${escapeXml(item)}</tspan>`).join('')}</text>`;
}

function card(x, y, width, height, accent, title, copy = [], code = '') {
  const copyY = y + (code ? 172 : 138) + Math.max(0, title.length - 2) * 34;
  return `<g>
    <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${palette.panel}" stroke="${palette.line}" stroke-width="3"/>
    <rect x="${x}" y="${y}" width="10" height="${height}" fill="${accent}"/>
    ${code ? `<text x="${x + 38}" y="${y + 46}" class="node-code">${escapeXml(code)}</text>` : ''}
    ${lines(title, x + 38, y + (code ? 92 : 58), 'node-title', 34)}
    ${lines(copy, x + 38, copyY, 'node-copy', 30)}
  </g>`;
}

function arrow(x1, y1, x2, label = '') {
  const midX = (x1 + x2) / 2;
  return `<g><path d="M${x1} ${y1}H${x2}" stroke="${palette.cyan}" stroke-width="4" marker-end="url(#arrow)"/>${label ? `<text x="${midX}" y="${y1 - 18}" class="node-code" text-anchor="middle">${escapeXml(label)}</text>` : ''}</g>`;
}

function flowFigure(config) {
  const width = 1600;
  const height = 760;
  const margin = 72;
  const gap = 42;
  const nodeWidth = (width - margin * 2 - gap * (config.steps.length - 1)) / config.steps.length;
  const top = 236;
  const nodeHeight = 304;
  const nodes = config.steps.map((step, index) => {
    const x = margin + index * (nodeWidth + gap);
    return card(x, top, nodeWidth, nodeHeight, step.accent ?? palette.cyan, step.title, step.copy, step.code);
  }).join('');
  const arrows = config.steps.slice(0, -1).map((_, index) => {
    const start = margin + (index + 1) * nodeWidth + index * gap + 8;
    return arrow(start, top + nodeHeight / 2, start + gap - 16);
  }).join('');
  const body = `${lines([config.title], margin, 128, 'title')}${lines([config.subtitle], margin, 174, 'subtitle')}${nodes}${arrows}<rect x="72" y="596" width="1456" height="96" fill="${palette.panelStrong}" stroke="${palette.line}"/><circle cx="112" cy="644" r="8" fill="${config.noteAccent ?? palette.cyan}"/>${lines(config.note, 140, 636, 'note', 28)}`;
  return shell(width, height, body, config.label, config.title, `${config.subtitle}. ${config.note.join(' ')}`);
}

function comparisonFigure(config) {
  const width = 1600;
  const height = 820;
  const margin = 72;
  const top = 222;
  const colGap = 32;
  const colWidth = (width - margin * 2 - colGap * (config.columns.length - 1)) / config.columns.length;
  const columns = config.columns.map((column, index) => {
    const x = margin + index * (colWidth + colGap);
    return `<g><rect x="${x}" y="${top}" width="${colWidth}" height="430" fill="${palette.panel}" stroke="${palette.line}" stroke-width="3"/>
      <circle cx="${x + 42}" cy="${top + 44}" r="10" fill="${column.accent}"/>
      ${lines(column.title, x + 70, top + 54, 'node-title', 34)}
      ${column.items.map((item, itemIndex) => `<g><path d="M${x + 34} ${top + 132 + itemIndex * 72}H${x + colWidth - 34}" stroke="${palette.line}"/><text x="${x + 42}" y="${top + 172 + itemIndex * 72}" class="node-copy">${escapeXml(item)}</text></g>`).join('')}
    </g>`;
  }).join('');
  const body = `${lines([config.title], margin, 122, 'title')}${lines([config.subtitle], margin, 168, 'subtitle')}${columns}<rect x="72" y="688" width="1456" height="78" fill="${palette.panelStrong}" stroke="${palette.line}"/>${lines(config.note, 104, 730, 'note', 26)}`;
  return shell(width, height, body, config.label, config.title, `${config.subtitle}. ${config.note.join(' ')}`);
}

function timelineFigure(config) {
  const width = 1600;
  const height = 760;
  const margin = 180;
  const y = 392;
  const count = config.events.length;
  const spacing = (width - margin * 2) / (count - 1);
  const events = config.events.map((event, index) => {
    const x = margin + index * spacing;
    const up = index % 2 === 0;
    const boxY = up ? 220 : 438;
    return `<g><circle cx="${x}" cy="${y}" r="18" fill="${palette.bg}" stroke="${event.accent}" stroke-width="6"/><path d="M${x} ${up ? y - 18 : y + 18}V${up ? boxY + 112 : boxY}" stroke="${event.accent}" stroke-width="3"/>
      <rect x="${x - 142}" y="${boxY}" width="284" height="112" fill="${palette.panel}" stroke="${palette.line}" stroke-width="2"/>
      <text x="${x - 116}" y="${boxY + 34}" class="node-code">${escapeXml(event.code)}</text>
      ${lines(event.title, x - 116, boxY + 72, 'node-copy', 26)}
    </g>`;
  }).join('');
  const body = `${lines([config.title], 72, 122, 'title')}${lines([config.subtitle], 72, 168, 'subtitle')}<path d="M${margin} ${y}H${width - margin}" stroke="${palette.line}" stroke-width="8"/>${events}<rect x="84" y="626" width="1432" height="74" fill="${palette.panelStrong}" stroke="${palette.line}"/>${lines(config.note, 112, 670, 'note', 26)}`;
  return shell(width, height, body, config.label, config.title, `${config.subtitle}. ${config.note.join(' ')}`);
}

function heroScene(kind) {
  const common = `<circle cx="800" cy="450" r="320" fill="none" stroke="${palette.line}" stroke-width="3"/><circle cx="800" cy="450" r="220" fill="none" stroke="${palette.line}" stroke-width="2" stroke-dasharray="14 18"/>`;
  const scenes = {
    ct: `${common}<g transform="translate(330 235)"><rect width="350" height="430" rx="28" fill="${palette.panelStrong}" stroke="${palette.cyan}" stroke-width="8"/><path d="M60 100H286M60 164H286M60 228H226" stroke="${palette.muted}" stroke-width="20" stroke-linecap="round"/><rect x="58" y="294" width="228" height="74" rx="18" fill="none" stroke="${palette.green}" stroke-width="7"/><text x="172" y="344" text-anchor="middle" class="node-title">SAN</text></g><path d="M720 450H930" stroke="${palette.cyan}" stroke-width="12" marker-end="url(#arrow)"/><g transform="translate(980 270)"><rect width="290" height="360" rx="28" fill="${palette.panel}" stroke="${palette.amber}" stroke-width="8"/><path d="M52 84H238M52 150H238M52 216H238M52 282H190" stroke="${palette.amber}" stroke-width="14" stroke-linecap="round"/></g>`,
    evilginx: `<g transform="translate(180 270)"><circle cx="130" cy="80" r="64" fill="${palette.panelStrong}" stroke="${palette.green}" stroke-width="8"/><path d="M30 270c18-84 72-126 100-126s82 42 100 126" fill="none" stroke="${palette.green}" stroke-width="12"/></g><path d="M480 450H670" stroke="${palette.cyan}" stroke-width="12" marker-end="url(#arrow)"/><g transform="translate(690 190)"><path d="M180 0 340 82v168c0 118-80 198-160 240C100 448 20 368 20 250V82Z" fill="${palette.panelStrong}" stroke="${palette.red}" stroke-width="10"/><path d="M110 148H250M110 216H250M110 284H218" stroke="${palette.red}" stroke-width="15" stroke-linecap="round"/></g><path d="M1080 450H1270" stroke="${palette.cyan}" stroke-width="12" marker-end="url(#arrow)"/><g transform="translate(1310 310)"><rect width="170" height="280" rx="28" fill="${palette.panelStrong}" stroke="${palette.cyan}" stroke-width="8"/><circle cx="85" cy="90" r="38" fill="none" stroke="${palette.cyan}" stroke-width="8"/><path d="M52 184H118" stroke="${palette.cyan}" stroke-width="18" stroke-linecap="round"/></g><path d="M850 630c110 96 248 112 370 18" fill="none" stroke="${palette.amber}" stroke-width="8" stroke-dasharray="18 14"/><circle cx="1034" cy="686" r="34" fill="${palette.amber}"/>`,
    cloaking: `<g transform="translate(170 250)"><rect width="500" height="360" rx="26" fill="${palette.panelStrong}" stroke="${palette.cyan}" stroke-width="8"/><path d="M0 72H500" stroke="${palette.line}" stroke-width="8"/><circle cx="52" cy="36" r="12" fill="${palette.red}"/><circle cx="92" cy="36" r="12" fill="${palette.amber}"/><circle cx="132" cy="36" r="12" fill="${palette.green}"/><path d="M88 168H410M88 232H340" stroke="${palette.green}" stroke-width="18" stroke-linecap="round"/></g><path d="M670 430H840" stroke="${palette.cyan}" stroke-width="12"/><path d="M840 430 990 300M840 430 990 560" stroke="${palette.cyan}" stroke-width="12" marker-end="url(#arrow)"/><g transform="translate(1030 158)"><rect width="390" height="250" rx="24" fill="${palette.panel}" stroke="${palette.green}" stroke-width="8"/><circle cx="195" cy="125" r="58" fill="none" stroke="${palette.green}" stroke-width="12"/><path d="m158 126 26 28 52-62" fill="none" stroke="${palette.green}" stroke-width="14"/></g><g transform="translate(1030 492)"><rect width="390" height="250" rx="24" fill="${palette.panel}" stroke="${palette.red}" stroke-width="8"/><path d="M128 80H262V188H128Z" fill="none" stroke="${palette.red}" stroke-width="12"/><path d="M162 132H228" stroke="${palette.red}" stroke-width="16"/></g>`,
    marketplace: `<g transform="translate(160 260)"><path d="M0 0H430V270H150L70 342V270H0Z" fill="${palette.panelStrong}" stroke="${palette.cyan}" stroke-width="9"/><path d="M64 78H346M64 142H300M64 206H232" stroke="${palette.text}" stroke-width="18" stroke-linecap="round"/></g><path d="M650 450H880" stroke="${palette.amber}" stroke-width="12" marker-end="url(#arrow)"/><g transform="translate(920 224)"><rect width="510" height="420" rx="34" fill="${palette.panelStrong}" stroke="${palette.red}" stroke-width="10"/><rect x="66" y="82" width="378" height="228" rx="24" fill="none" stroke="${palette.red}" stroke-width="10"/><path d="M66 154H444" stroke="${palette.red}" stroke-width="24"/><circle cx="388" cy="354" r="50" fill="none" stroke="${palette.amber}" stroke-width="10"/><path d="M388 322V362M388 388v4" stroke="${palette.amber}" stroke-width="12" stroke-linecap="round"/></g>`,
    banking: `<g transform="translate(170 210)"><circle cx="300" cy="240" r="220" fill="${palette.panelStrong}" stroke="${palette.amber}" stroke-width="12"/><path d="M300 90V240L406 310" fill="none" stroke="${palette.amber}" stroke-width="18" stroke-linecap="round"/></g><path d="M730 450H930" stroke="${palette.cyan}" stroke-width="12" marker-end="url(#arrow)"/><g transform="translate(980 180)"><path d="M220 0 420 96v206c0 148-100 248-200 300C120 550 20 450 20 302V96Z" fill="${palette.panelStrong}" stroke="${palette.green}" stroke-width="12"/><path d="m126 294 70 72 126-154" fill="none" stroke="${palette.green}" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"/></g>`,
    radar: `${common}<path d="M800 450 1070 270A320 320 0 0 1 1120 450Z" fill="${palette.cyan}" opacity=".14"/><path d="M800 450 1070 270" stroke="${palette.cyan}" stroke-width="12"/><circle cx="982" cy="330" r="22" fill="${palette.green}"/><circle cx="622" cy="296" r="18" fill="${palette.amber}"/><circle cx="544" cy="512" r="14" fill="${palette.red}"/><circle cx="882" cy="644" r="20" fill="${palette.cyan}"/><circle cx="800" cy="450" r="30" fill="${palette.text}"/><path d="M240 730H1360" stroke="${palette.line}" stroke-width="4"/><path d="M240 730H944" stroke="${palette.cyan}" stroke-width="14"/><path d="M1010 730H1360" stroke="${palette.line}" stroke-width="14" stroke-dasharray="20 18"/>`,
    sms: `<g transform="translate(180 130)"><rect width="480" height="650" rx="62" fill="${palette.panelStrong}" stroke="${palette.cyan}" stroke-width="12"/><rect x="54" y="120" width="372" height="230" rx="28" fill="${palette.panel}" stroke="${palette.line}" stroke-width="5"/><path d="M94 184H350M94 246H298" stroke="${palette.text}" stroke-width="20" stroke-linecap="round"/><rect x="92" y="404" width="296" height="102" rx="24" fill="none" stroke="${palette.red}" stroke-width="8"/><path d="M142 455H338" stroke="${palette.red}" stroke-width="16" stroke-linecap="round"/><circle cx="240" cy="574" r="30" fill="none" stroke="${palette.green}" stroke-width="8"/></g><path d="M720 450H900" stroke="${palette.cyan}" stroke-width="12" marker-end="url(#arrow)"/><g transform="translate(960 220)"><circle cx="220" cy="220" r="210" fill="${palette.panelStrong}" stroke="${palette.green}" stroke-width="12"/><path d="m108 220 76 78 158-174" fill="none" stroke="${palette.green}" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/><path d="M220 430V570" stroke="${palette.green}" stroke-width="12"/><path d="M132 570H308" stroke="${palette.green}" stroke-width="12" stroke-linecap="round"/></g>`,
    t1187: `<g transform="translate(160 210)"><path d="M0 0H360L500 140V520H0Z" fill="${palette.panelStrong}" stroke="${palette.amber}" stroke-width="10"/><path d="M360 0V140H500" fill="none" stroke="${palette.amber}" stroke-width="10"/><path d="M80 240H410M80 320H350" stroke="${palette.text}" stroke-width="20" stroke-linecap="round"/></g><path d="M720 450H940" stroke="${palette.cyan}" stroke-width="12" marker-end="url(#arrow)"/><path d="M760 500c54 0 54 82 108 82s54-164 108-164 54 164 108 164 54-82 108-82" fill="none" stroke="${palette.cyan}" stroke-width="10"/><g transform="translate(1090 210)"><path d="M220 0 420 96v206c0 148-100 248-200 300C120 550 20 450 20 302V96Z" fill="${palette.panelStrong}" stroke="${palette.red}" stroke-width="12"/><path d="M142 226H298M142 300H298" stroke="${palette.red}" stroke-width="20" stroke-linecap="round"/></g>`
  };
  const descriptions = {
    ct: ['Certificate Transparency monitoring', 'A public certificate entry moves into a review queue'],
    evilginx: ['Reverse-proxy phishing detection', 'A user, reverse proxy, session token, and protected service are connected'],
    cloaking: ['Conditional-delivery comparison', 'One request path branches into a benign response and a phishing response'],
    marketplace: ['Marketplace buyer phishing', 'A chat message hands the recipient to a fraudulent payment page'],
    banking: ['Post-phishing response', 'A clock points to ordered containment and evidence-preservation actions'],
    radar: ['Phishing-infrastructure baseline', 'A coverage-aware radar view separates observed signals from collection gaps'],
    sms: ['Suspicious SMS link analysis', 'A suspicious message is inspected before a trust decision is made'],
    t1187: ['Forced-authentication detection', 'A crafted document can trigger an authentication path that defenders must observe']
  };
  const [title, description] = descriptions[kind];
  return shell(1600, 900, scenes[kind], 'HECAVEX / EDITORIAL RESEARCH VISUAL', title, description);
}

const topics = [
  {
    directory: '2026-08-31-certificate-transparency-brand-monitoring', hero: 'certificate-transparency-brand-monitoring-hero.svg', kind: 'ct', prefix: 'ct',
    locales: {
      en: {
        flow: ['From public log entry to reviewable lead', 'Keep every transformation visible and reversible', [
          ['OBSERVE', ['Log ID, index', 'SCT time, SANs']], ['NORMALIZE', ['Wildcard, case', 'A-label and U-label']], ['EXPLAIN', ['Rule IDs', 'Inputs and score']], ['ASSESS', ['Review state', 'Evidence and limits']]
        ], ['A CT timestamp records log acceptance. It is not a registration time or proof that a site was served.']],
        compare: ['Name normalization without losing evidence', 'Store the raw name before deriving comparison forms', [
          ['RAW', ['*.xn--exmple-cua.invalid', 'Certificate entry', 'Never overwrite']], ['DERIVED', ['wildcard removed', 'case folded', 'IDNA forms retained']], ['MATCH INPUT', ['registrable boundary', 'tokens and skeleton', 'brand model version']]
        ], ['Confusable matching is a review signal. Unicode similarity is not a maliciousness verdict.']],
        timeline: ['A publication state model that can be corrected', 'Historic observation and current assessment are separate fields', [
          ['01', ['Observed']], ['02', ['Suspected']], ['03', ['Corroborated']], ['04', ['Dismissed']], ['05', ['Retracted']]
        ], ['Do not delete the original observation when DNS changes or an assessment is corrected.']]
      },
      lt: {
        flow: ['Nuo viešo žurnalo įrašo iki peržiūrimo kandidato', 'Kiekviena transformacija turi likti matoma ir atkartojama', [
          ['STEBĖTI', ['Žurnalas, indeksas', 'SCT laikas, SAN vardai']], ['NORMALIZUOTI', ['Wildcard, raidžių|dydis', 'A-label ir U-label']], ['PAAIŠKINTI', ['Taisyklių ID', 'Įvestys ir balas']], ['ĮVERTINTI', ['Peržiūros būsena', 'Įrodymai ir ribos']]
        ], ['CT laikas rodo įrašo priėmimą į žurnalą. Tai nėra domeno registracijos ar puslapio veikimo įrodymas.']],
        compare: ['Vardo normalizavimas neprarandant įrodymų', 'Prieš kuriant palyginimo formas išsaugomas pradinis vardas', [
          ['PRADINIS', ['*.xn--exmple-cua.invalid', 'Sertifikato įrašas', 'Niekada neperrašyti']], ['IŠVESTINIS', ['wildcard atskirtas', 'raidės suvienodintos', 'IDNA formos paliktos']], ['PALYGINIMAS', ['registruojamo domeno riba', 'žodžiai ir skeleton forma', 'prekės ženklo modelio versija']]
        ], ['Confusable tipo sutapimas yra peržiūros signalas. Unicode panašumas nėra kenkėjiškumo įrodymas.']],
        timeline: ['Publikavimo būsenos, kurias galima taisyti', 'Istorinis stebėjimas ir dabartinis vertinimas yra atskiri laukai', [
          ['01', ['Stebėtas']], ['02', ['Įtariamas']], ['03', ['Papildomai', 'pagrįstas']], ['04', ['Atmestas']], ['05', ['Atšauktas']]
        ], ['DNS pokytis ar pataisytas vertinimas neturi ištrinti pradinio stebėjimo.']]
      }
    }
  },
  {
    directory: '2026-08-31-evilginx-detection', hero: 'evilginx-detection-hero.svg', kind: 'evilginx', prefix: 'evilginx',
    locales: {
      en: {
        flow: ['Reverse-proxy phishing changes the trust path', 'A valid upstream login can still pass through hostile infrastructure', [
          ['USER', ['Opens lure host', 'Browser trusts TLS']], ['PROXY', ['Relays HTTP', 'Sees credentials']], ['IDENTITY', ['Authenticates user', 'Issues session']], ['REPLAY', ['Token reused', 'New client context']]
        ], ['The strongest detections correlate the lure, sign-in, token use and post-authentication action.']],
        compare: ['Signals become useful when joined', 'No single field reliably identifies a reverse proxy', [
          ['EDGE', ['new lookalike host', 'TLS and DNS timing', 'redirect history']], ['IDENTITY', ['rapid IP change', 'device mismatch', 'token reuse']], ['WORKLOAD', ['mailbox access', 'new rule or OAuth', 'sensitive download']]
        ], ['Treat tool-specific strings as leads. Detect the behavior that remains when the kit changes.']],
        timeline: ['Contain the session, not only the password', 'Sequence matters when an authentication token may already exist', [
          ['T0', ['Revoke sessions']], ['T1', ['Disable access']], ['T2', ['Reset secrets']], ['T3', ['Inspect changes']], ['T4', ['Restore safely']]
        ], ['A password reset without token revocation can leave an active session usable.']]
      },
      lt: {
        flow: ['Reverse-proxy phishing pakeičia pasitikėjimo kelią', 'Teisėtas prisijungimas gali vykti per priešišką tarpinę infrastruktūrą', [
          ['NAUDOTOJAS', ['Atidaro jauko hostą', 'Naršyklė pasitiki TLS']], ['TARPININKAS', ['Persiunčia HTTP', 'Mato prisijungimo duomenis']], ['TAPATYBĖ', ['Patvirtina naudotoją', 'Išduoda sesiją']], ['PANAUDOJIMAS', ['Tokenas naudojamas|dar kartą', 'Naujas kliento kontekstas']]
        ], ['Stipriausias aptikimas sujungia jauką, prisijungimą, tokeno naudojimą ir vėlesnį veiksmą.']],
        compare: ['Signalai tampa vertingi tik juos sujungus', 'Vienas laukas patikimai neidentifikuoja reverse proxy', [
          ['PERIMETRAS', ['naujas panašus hostas', 'TLS ir DNS laikas', 'peradresavimo istorija']], ['TAPATYBĖ', ['greitas IP pokytis', 'įrenginio neatitikimas', 'tokeno pakartotinis naudojimas']], ['PASLAUGA', ['pašto dėžutės prieiga', 'nauja taisyklė arba OAuth', 'jautrių duomenų atsisiuntimas']]
        ], ['Įrankiui būdingos eilutės yra tik pradiniai signalai. Aptikite elgseną, kuri išlieka pakeitus phishing rinkinį.']],
        timeline: ['Sustabdykite sesiją, ne tik pakeiskite slaptažodį', 'Veiksmų seka svarbi, kai autentifikavimo tokenas jau galėjo būti išduotas', [
          ['T0', ['Atšaukti sesijas']], ['T1', ['Stabdyti prieigą']], ['T2', ['Keisti paslaptis']], ['T3', ['Tikrinti pokyčius']], ['T4', ['Saugiai atkurti']]
        ], ['Slaptažodžio keitimas be tokenų atšaukimo gali palikti aktyvią sesiją.']]
      }
    }
  },
  {
    directory: '2026-08-31-facebook-cloaking-explained', hero: 'facebook-cloaking-explained-hero.svg', kind: 'cloaking', prefix: 'cloaking',
    locales: {
      en: {
        flow: ['One URL can produce two defensible observations', 'Change one collection variable at a time', [
          ['CONTROL', ['Clean profile', 'Time and network']], ['REQUEST', ['Headers recorded', 'Redirects retained']], ['RESPONSE A', ['Decoy content', 'Body hash A']], ['RESPONSE B', ['Risk content', 'Body hash B']]
        ], ['Different responses establish conditional delivery. They do not identify an operator or motive.']],
        compare: ['A controlled request comparison', 'Preserve context beside every response', [
          ['CONSTANT', ['same URL', 'same time window', 'same capture policy']], ['VARIABLE', ['referrer', 'cookie state', 'network or device']], ['OUTPUT', ['status and headers', 'redirect chain', 'DOM and body hash']]
        ], ['A screenshot without request context cannot prove what another visitor received.']],
        timeline: ['The capture manifest is part of the evidence', 'Make the comparison reproducible before interpreting it', [
          ['01', ['Case identifier']], ['02', ['Profile and route']], ['03', ['Request record']], ['04', ['Response hashes']], ['05', ['Analyst claim']]
        ], ['Retain negative and blocked results. Missing responses are part of the observation set.']]
      },
      lt: {
        flow: ['Vienas URL gali pateikti du įrodymais pagrįstus stebėjimus', 'Vienu metu keiskite tik vieną rinkimo kintamąjį', [
          ['KONTROLĖ', ['Švari aplinka', 'Laikas ir tinklas']], ['UŽKLAUSA', ['Išsaugotos antraštės', 'Išsaugoti peradresavimai']], ['ATSAKAS A', ['Nekaltas turinys', 'Body hash A']], ['ATSAKAS B', ['Rizikingas turinys', 'Body hash B']]
        ], ['Skirtingi atsakymai patvirtina sąlyginį pateikimą. Jie neidentifikuoja operatoriaus ar motyvo.']],
        compare: ['Kontroliuojamas užklausų palyginimas', 'Kontekstas saugomas prie kiekvieno atsakymo', [
          ['NEKINTAMA', ['tas pats URL', 'tas pats laiko langas', 'ta pati rinkimo tvarka']], ['KINTA', ['referrer', 'cookie būsena', 'tinklas arba įrenginys']], ['REZULTATAS', ['statusas ir antraštės', 'peradresavimo grandinė', 'DOM ir body hash']]
        ], ['Ekrano kopija be užklausos konteksto neįrodo, ką gavo kitas lankytojas.']],
        timeline: ['Rinkimo aprašas yra įrodymo dalis', 'Pirma užtikrinkite atkartojamumą, tada interpretuokite', [
          ['01', ['Bylos identifikatorius']], ['02', ['Aplinka ir kelias']], ['03', ['Užklausos įrašas']], ['04', ['Atsakymų hash']], ['05', ['Analitiko teiginys']]
        ], ['Išsaugokite ir tuščius arba blokuotus rezultatus. Jie yra stebėjimų rinkinio dalis.']]
      }
    }
  },
  {
    directory: '2026-08-31-marketplace-buyer-phishing', hero: 'marketplace-buyer-phishing-hero.svg', kind: 'marketplace', prefix: 'marketplace',
    locales: {
      en: {
        flow: ['The decisive handoff happens outside the marketplace', 'The fake buyer converts a sale into a payment or identity event', [
          ['CHAT', ['Buyer initiates', 'Urgency and trust']], ['HANDOFF', ['External courier', 'Payment link']], ['CAPTURE', ['Card or login', 'Approval request']], ['MONETIZE', ['Payment or session', 'Follow-up fraud']]
        ], ['Receiving money does not require a seller to disclose card CVV, banking PINs or authentication codes.']],
        compare: ['Build one evidence ledger across systems', 'Chat, web and bank records use different clocks and identifiers', [
          ['CONVERSATION', ['account and message ID', 'full text', 'platform time']], ['WEB PATH', ['exact private URL', 'redirects', 'page and response hash']], ['FINANCIAL', ['approval text', 'transaction ID', 'payee and amount']]
        ], ['Correlation is stronger when independent records agree on sequence, recipient and requested action.']],
        timeline: ['Response follows the exposed asset', 'Do not spend the first minutes investigating the page', [
          ['CLICK', ['Preserve and stop']], ['CARD', ['Block and replace']], ['AUTH', ['Revoke sessions']], ['PAYMENT', ['Call bank now']], ['DEVICE', ['Isolate and inspect']]
        ], ['Use official platform, bank and police channels obtained independently from the conversation.']]
      },
      lt: {
        flow: ['Svarbiausias perėjimas vyksta už marketplace ribų', 'Netikras pirkėjas pardavimą paverčia mokėjimo arba tapatybės įvykiu', [
          ['POKALBIS', ['Pirkėjas pradeda', 'Skuba ir pasitikėjimas']], ['PERKĖLIMAS', ['Išorinis kurjeris', 'Mokėjimo nuoroda']], ['SURINKIMAS', ['Kortelė arba|prisijungimo|duomenys', 'Patvirtinimo prašymas']], ['PANAUDOJIMAS', ['Mokėjimas arba sesija', 'Tolesnis išnaudojimas']]
        ], ['Norint gauti pinigus, pardavėjui nereikia atskleisti CVV, banko PIN ar autentifikavimo kodo.']],
        compare: ['Vienas įrodymų žurnalas kelioms sistemoms', 'Pokalbio, web ir banko įrašai naudoja skirtingus laikus bei identifikatorius', [
          ['POKALBIS', ['paskyros ir žinutės ID', 'visas tekstas', 'platformos laikas']], ['WEB KELIAS', ['tikslus privatus URL', 'peradresavimai', 'puslapio ir atsakymo hash']], ['FINANSAI', ['patvirtinimo tekstas', 'operacijos ID', 'gavėjas ir suma']]
        ], ['Sąsaja stipresnė, kai nepriklausomi įrašai sutampa pagal seką, gavėją ir prašytą veiksmą.']],
        timeline: ['Veiksmai priklauso nuo atskleisto turto', 'Pirmųjų minučių neskirkite puslapio tyrimui', [
          ['PASPAUDIMAS', ['Išsaugoti ir sustoti']], ['KORTELĖ', ['Blokuoti ir keisti']], ['AUTENTIFIKAVIMAS', ['Atšaukti sesijas']], ['MOKĖJIMAS', ['Skambinti bankui']], ['ĮRENGINYS', ['Izoliuoti ir tirti']]
        ], ['Naudokite oficialius prekyvietės, banko ir policijos kanalus, gautus ne iš pokalbio.']]
      }
    }
  },
  {
    directory: '2026-08-31-post-phishing-banking-response', hero: 'post-phishing-banking-response-hero.svg', kind: 'banking', prefix: 'banking',
    locales: {
      en: {
        flow: ['Classify what crossed the boundary', 'Different exposed assets require different containment', [
          ['CARD', ['PAN, expiry, CVV', 'Replace instrument']], ['CREDENTIAL', ['Login secret', 'Reset from clean device']], ['SESSION', ['Cookie or token', 'Revoke active access']], ['DEVICE', ['App or profile', 'Isolate and inspect']]
        ], ['If money moved or an approval was made, contact the bank before continuing technical analysis.']],
        compare: ['The first response hour is an ordering model', 'It is not a promise that recovery remains possible for sixty minutes', [
          ['STOP LOSS', ['call official bank number', 'block instruments', 'request stop or recall']], ['STOP ACCESS', ['revoke sessions', 'secure email', 'remove trusted devices']], ['PRESERVE', ['message and URL', 'approval screen', 'transaction identifiers']]
        ], ['Use another trusted device when the original device may contain remote-access software or malware.']],
        timeline: ['A stolen session can outlive a password', 'Contain active trust before restoring credentials', [
          ['T0', ['Bank contacted']], ['T1', ['Sessions revoked']], ['T2', ['Account secured']], ['T3', ['Changes reviewed']], ['T4', ['Monitoring continues']]
        ], ['Record what the bank confirms. Do not promise a chargeback, recall or reimbursement outcome.']]
      },
      lt: {
        flow: ['Nustatykite, kas peržengė pasitikėjimo ribą', 'Skirtingam atskleistam turtui reikia skirtingo sustabdymo', [
          ['KORTELĖ', ['Numeris, galiojimas|ir CVV', 'Pakeisti kortelę']], ['PRISIJUNGIMAS', ['Prisijungimo|paslaptis', 'Pakeisti švariame įrenginyje']], ['SESIJA', ['Slapukas arba|tokenas', 'Atšaukti aktyvią prieigą']], ['ĮRENGINYS', ['Programa arba|profilis', 'Izoliuoti ir tirti']]
        ], ['Jei pinigai pajudėjo ar veiksmas patvirtintas, pirmiausia kreipkitės į banką.']],
        compare: ['Pirmoji valanda yra veiksmų eilės modelis', 'Tai nėra pažadas, kad lėšas visada galima atgauti per šešiasdešimt minučių', [
          ['STABDYTI NUOSTOLIUS', ['skambinti oficialiu numeriu', 'blokuoti priemones', 'prašyti stabdyti pervedimą']], ['STABDYTI PRIEIGĄ', ['atšaukti sesijas', 'apsaugoti el. paštą', 'šalinti patikimus įrenginius']], ['IŠSAUGOTI', ['žinutė ir URL', 'patvirtinimo ekranas', 'operacijų ID']]
        ], ['Naudokite kitą patikimą įrenginį, jei pirmame galėjo būti nuotolinės prieigos programa arba malware.']],
        timeline: ['Pavogta sesija gali išlikti pakeitus slaptažodį', 'Pirma atšaukite aktyvią prieigą, tada atkurkite prisijungimus', [
          ['T0', ['Susisiekti su banku']], ['T1', ['Atšaukti sesijas']], ['T2', ['Apsaugoti paskyrą']], ['T3', ['Tikrinti pokyčius']], ['T4', ['Tęsti stebėjimą']]
        ], ['Užrašykite, ką patvirtino bankas. Nežadėkite chargeback, recall ar kompensacijos rezultato.']]
      }
    }
  },
  {
    directory: '2026-08-31-radar-august-baseline', hero: 'radar-august-baseline-hero.svg', kind: 'radar', prefix: 'radar',
    locales: {
      en: {
        flow: ['Evidence profile at the August cutoff', 'The queue was dominated by name-only discovery', [
          ['130', ['current candidates', 'deduplicated records']], ['128', ['name-only leads', 'need enrichment']], ['2', ['corroborated', 'under tier rules']], ['0', ['completed reviews', 'no precision estimate']]
        ], ['Candidate counts describe the retained detector view. They do not measure Lithuanian phishing prevalence.']],
        compare: ['Coverage belongs beside every count', 'Healthy collection time was incomplete in both reporting windows', [
          ['24 HOURS', ['62.78% listening', '113 healthy attempts', '80 matches']], ['7 DAYS', ['31.18% listening', '405 healthy attempts', '208 matches']], ['SOURCE BOUNDARY', ['CertStream 122', 'URLScan 9', 'HECAVEX 1']]
        ], ['Source counts are not additive because one deduplicated record can retain evidence from multiple sources.']],
        timeline: ['Largest brand-associated candidate groups', 'Counts are detector outputs, not incidents or victims', [
          ['53', ['DHL']], ['17', ['Revolut']], ['9', ['Telia']], ['9', ['Vinted']], ['6', ['VMI']]
        ], ['Registry scope, matching rules, retention and collector health all shape this distribution.']]
      },
      lt: {
        flow: ['Įrodymų profilis rugpjūčio duomenų pjūvyje', 'Eilėje dominavo tik pagal pavadinimų sutapimus rasti kandidatai', [
          ['130', ['dabartinių kandidatų', 'deduplikuotų įrašų']], ['128', ['tik pavadinimo|signalai', 'reikia papildyti įrodymais']], ['2', ['papildomai pagrįsti', 'pagal įrodymų lygių taisykles']], ['0', ['užbaigtų peržiūrų', 'nėra tikslumo įverčio']]
        ], ['Kandidatų skaičiai apibūdina detektoriaus vaizdą, o ne phishing paplitimą Lietuvoje.']],
        compare: ['Aprėptis turi būti rodoma prie kiekvieno skaičiaus', 'Abiejuose languose sėkmingo rinkimo laikas buvo nepilnas', [
          ['24 VALANDOS', ['62,78 % klausymosi laiko', '113 sėkmingų bandymų', '80 sutapimų']], ['7 DIENOS', ['31,18 % klausymosi laiko', '405 sėkmingi bandymai', '208 sutapimai']], ['ŠALTINIŲ RIBA', ['CertStream 122', 'URLScan 9', 'HECAVEX 1']]
        ], ['Šaltinių skaičiai nesumuojami, nes vienas įrašas gali turėti kelių šaltinių įrodymų.']],
        timeline: ['Didžiausios kandidatų grupės pagal susietą prekės ženklą', 'Tai detektoriaus rezultatai, o ne incidentai ar aukos', [
          ['53', ['DHL']], ['17', ['Revolut']], ['9', ['Telia']], ['9', ['Vinted']], ['6', ['VMI']]
        ], ['Pasiskirstymą formuoja registras, taisyklės, saugojimo laikotarpis ir rinkimo būklė.']]
      }
    }
  },
  {
    directory: '2026-08-31-t1187-forced-authentication', hero: 't1187-forced-authentication-hero.svg', kind: 't1187', prefix: 't1187',
    locales: {
      en: {
        flow: ['Forced authentication is a chain, not one event', 'A crafted reference can cause an outbound authentication attempt', [
          ['TRIGGER', ['Message or file', 'Remote reference']], ['HANDLER', ['OS resolves target', 'Protocol selected']], ['EGRESS', ['SMB or WebDAV', 'External destination']], ['EVIDENCE', ['Process and host', 'Network and identity']]
        ], ['Do not reproduce the lure. Detect the unexpected reference, client path and outbound authentication together.']],
        compare: ['Join telemetry across control planes', 'Each source answers a different part of the incident question', [
          ['ENDPOINT', ['originating process', 'file and parent', 'network connection']], ['NETWORK', ['DNS and destination', 'port and protocol', 'proxy or firewall action']], ['IDENTITY', ['account involved', 'authentication type', 'later reuse or failure']]
        ], ['A blocked connection can still be a high-value signal that a crafted object reached a user.']],
        timeline: ['Controls should break more than one link', 'Prevention and detection overlap but are not interchangeable', [
          ['01', ['Sanitize content']], ['02', ['Restrict handlers']], ['03', ['Block egress']], ['04', ['Reduce NTLM']], ['05', ['Correlate alerts']]
        ], ['Validate controls with safe simulations and expected telemetry, not live credential exposure.']]
      },
      lt: {
        flow: ['Priverstinis autentifikavimas yra grandinė, o ne vienas įvykis', 'Specialiai sukurta nuoroda gali sukelti išorinį autentifikavimo bandymą', [
          ['PRADŽIA', ['Žinutė arba failas', 'Nuotolinė nuoroda']], ['TVARKYKLĖ', ['OS randa taikinį', 'Pasirenka protokolą']], ['IŠEINANTIS SRAUTAS', ['SMB arba WebDAV', 'Išorinis adresas']], ['ĮRODYMAI', ['Procesas ir hostas', 'Tinklas ir tapatybė']]
        ], ['Neatkurkite jauko. Kartu aptikite netikėtą nuorodą, kliento kelią ir išorinį autentifikavimą.']],
        compare: ['Sujunkite kelių kontrolės sluoksnių telemetriją', 'Kiekvienas šaltinis atsako į kitą incidento klausimo dalį', [
          ['ENDPOINT', ['pradinis procesas', 'failas ir tėvinis procesas', 'tinklo jungtis']], ['TINKLAS', ['DNS ir paskirtis', 'portas ir protokolas', 'proxy arba ugniasienė']], ['TAPATYBĖ', ['susijusi paskyra', 'autentifikavimo tipas', 'vėlesnis naudojimas']]
        ], ['Užblokuota jungtis vis tiek rodo, kad specialiai sukurtas objektas pasiekė naudotoją.']],
        timeline: ['Kontrolės turi nutraukti daugiau nei vieną grandies dalį', 'Prevencija ir aptikimas persidengia, bet nėra tas pats', [
          ['01', ['Valyti turinį']], ['02', ['Riboti tvarkykles']], ['03', ['Blokuoti išėjimą']], ['04', ['Mažinti NTLM']], ['05', ['Sieti įspėjimus']]
        ], ['Kontroles tikrinkite saugia simuliacija ir laukiamais telemetrijos signalais, o ne atskleisdami tikrus prisijungimo duomenis.']]
      }
    }
  }
];

const filenames = {
  flow: {
    ct: 'observation-pipeline', evilginx: 'request-path', cloaking: 'request-comparison', marketplace: 'handoff-chain', banking: 'exposure-classes', radar: 'evidence-profile', t1187: 'authentication-path'
  },
  compare: {
    ct: 'name-normalization', evilginx: 'signal-correlation', cloaking: 'evidence-boundary', marketplace: 'evidence-ledger', banking: 'first-hour', radar: 'source-coverage', t1187: 'telemetry-join'
  },
  timeline: {
    ct: 'publication-state', evilginx: 'session-containment', cloaking: 'capture-manifest', marketplace: 'response-branches', banking: 'session-containment', radar: 'brand-distribution', t1187: 'control-map'
  }
};

function mapSteps(input) {
  return input.map(([code, copy]) => ({ code, title: String(copy[0]).split('|'), copy: copy.slice(1), accent: palette.cyan }));
}

function mapColumns(input) {
  return input.map(([title, items]) => ({ title: [title], items, accent: palette.cyan }));
}

function mapEvents(input) {
  return input.map(([code, title]) => ({ code, title, accent: palette.cyan }));
}

for (const topic of topics) {
  const directory = join(imageRoot, topic.directory);
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, topic.hero), heroScene(topic.kind), 'utf8');
  for (const [lang, content] of Object.entries(topic.locales)) {
    const [flowTitle, flowSubtitle, flowSteps, flowNote] = content.flow;
    await writeFile(join(directory, `${topic.prefix}-${filenames.flow[topic.kind]}-${lang}.svg`), flowFigure({
      title: flowTitle, subtitle: flowSubtitle, steps: mapSteps(flowSteps), note: flowNote, label: `HECAVEX / ${topic.prefix.toUpperCase()} / FLOW`
    }), 'utf8');

    const [compareTitle, compareSubtitle, compareColumns, compareNote] = content.compare;
    await writeFile(join(directory, `${topic.prefix}-${filenames.compare[topic.kind]}-${lang}.svg`), comparisonFigure({
      title: compareTitle, subtitle: compareSubtitle, columns: mapColumns(compareColumns), note: compareNote, label: `HECAVEX / ${topic.prefix.toUpperCase()} / EVIDENCE`
    }), 'utf8');

    const [timelineTitle, timelineSubtitle, timelineEvents, timelineNote] = content.timeline;
    await writeFile(join(directory, `${topic.prefix}-${filenames.timeline[topic.kind]}-${lang}.svg`), timelineFigure({
      title: timelineTitle, subtitle: timelineSubtitle, events: mapEvents(timelineEvents), note: timelineNote, label: `HECAVEX / ${topic.prefix.toUpperCase()} / DECISION`
    }), 'utf8');
  }
}

const smsDirectory = join(imageRoot, '2026-08-31-suspicious-sms-guide');
await writeFile(join(smsDirectory, 'suspicious-sms-guide-hero.svg'), heroScene('sms'), 'utf8');

console.log(`Generated ${topics.length} editorial hero sets, ${topics.length * 6} localized technical figures, and the revised suspicious-SMS hero.`);
