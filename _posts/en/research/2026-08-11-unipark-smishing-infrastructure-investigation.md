---
title: "UNIPARK Smishing: From One SMS to 126 Phishing Hosts"
card_title: "UNIPARK Smishing: One Domain, a Much Larger Phishing Kit"
description: "A full CTI investigation into an UNIPARK smishing lure: domain rotation, exact-hash pivots, 126 related hosts, card and PIN collection, and an NKSC sinkhole."
date: 2026-08-11 11:30:00 +0300
last_modified_at: 2026-08-14 10:30:00 +0300
lang: en
translation_key: unipark-smishing-campaign-infrastructure
permalink: /en/research/unipark-smishing-campaign-infrastructure/
author: deividas-lis
content_type: investigation
confidence: high
tlp: clear
categories: [fraud-scams, threat-intelligence, investigations]
tags: [UNIPARK, smishing, phishing, SMS, payment fraud, infrastructure pivoting, OSINT, threat intelligence, Lithuania]
featured: false
draft: false
toc: true
comments: false
scope: "Analysis of an UNIPARK-themed SMS received on 11 August 2026, static examination of its phishing application, and infrastructure pivots across DNS, certificates and public URLScan data."
limitations: "No malicious JavaScript was executed, no forms were completed and the backend was not tested. The investigation does not identify a specific operator, count successful victims or establish the true user of the sending number."
key_findings:
- "fmqr.ink was registered less than a day before delivery, and the UNIPARK hostname already pointed to siena.nksc.lt during the investigation."
- "Static code analysis revealed a complete credential-theft flow covering a licence plate, personal data, payment card, CVV, OTP and even the four-digit PIN used at an ATM or payment terminal."
- "The card number, name, expiry and CVV support serious card-not-present fraud. Cloning an EMV chip would additionally require track data that this form did not collect."
- "Four primary JavaScript and CSS files were exact-hash matches for an earlier unipark.fxqro.xin deployment."
- "The shared core bundle hash appeared in 163 URLScan records across 126 unique hostnames impersonating RingGo, EyeParking, UNIPARK, EasyPark, Q-Park and other parking brands."
- "Of the 163 linked scans, 121 pages were delivered through Cloudflare and 42 directly from 12 AS132203 Aceville/Tencent Cloud IP addresses. All 163 contacted /console."
- "The +63 number fits the Philippine numbering plan but is not reliable evidence of the operator's location or identity."
- "Cisco Talos's JWR report describes strikingly similar tradecraft, but JWR-specific protocols, endpoints, session identifiers, encryption and published IOCs do not match the UNIPARK set. The evidence does not establish one campaign or operator."
image:
  path: /assets/img/posts/2026-08-11-unipark-smishing/unipark-smishing-hero.svg
  alt: "An UNIPARK-themed smishing message leads to a newly registered domain and a reusable parking payment phishing kit"
  thumbnail: /assets/img/posts/2026-08-11-unipark-smishing/unipark-smishing-hero.svg
  width: 1600
  height: 900
---

## In short: one SMS, definitely not one domain

At 11:01 on 11 August 2026, I received an SMS from `+63 951 976 1812`. It impersonated UNIPARK, claimed that a parking payment remained outstanding and directed me to `unipark.fmqr[.]ink/com`. It also instructed me to reply with the letter "T" if the link would not open, then reopen the message or paste the URL into Safari. I mistyped the domain suffix in an earlier note. The screenshot and every pivot in this investigation use only the `.ink` address shown here.

Nothing says official Lithuanian parking notice quite like a Philippine mobile number, a fresh `.ink` domain and a request to reply to the sender before paying.

The more important part was behind the lure. `fmqr[.]ink` was registered at **13:08 UTC on 10 August 2026**, less than a day before the message. The application did not stop at collecting a licence plate or a supposed €3.75 payment. Its code implemented a full flow from identity and card details through OTP, banking-app approval and the **four-digit card PIN used at an ATM or point-of-sale terminal**.

The infrastructure pivot went much further. Four primary static files were exact-hash matches for an earlier page at `unipark.fxqro[.]xin`. A shared core bundle appeared in **163 public URLScan records across 126 unique hostnames**, impersonating RingGo, EyeParking, UNIPARK, EasyPark, Q-Park, NCP and other parking services.

I use **HCVX-PARKING-KIT-2026** as a temporary analytical cluster label. It is not a threat-actor name. One JavaScript hash is not sufficient reason to invent a new group with an animal logo and merchandise.

> **Assessment:** confidence is high that this was an UNIPARK-themed smishing and payment-phishing campaign using a repeatedly deployed parking phishing kit. Confidence is medium that every related domain was controlled by one operator, and low for any geographic or personal attribution.
{: .prompt-danger }

## Update, 14 August 2026: is this Cisco Talos's JWR?

On 13 August, [Cisco Talos published its analysis of the JWR phishing framework](https://blog.talosintelligence.com/dissecting-the-jwr-phishing-framework/). The parallels with this UNIPARK case are difficult to miss.

Both frameworks:

- arrive through SMS lures involving roads, parking, tolls or small administrative fees
- use a Vue-based, multi-screen victim application
- collect card number, expiry, CVV, PIN, OTP and device-fingerprint data
- maintain bidirectional WebSocket communication so an operator can choose the victim's next screen in real time
- support invalid-code, rejected-card and retry states
- separate a reusable engine from interchangeable brand layers
- retain Chinese-language developer or operator-facing strings
- place some deployments in Aceville and Tencent Cloud infrastructure
- use a `/com/` route or static assets beneath it.

That is close enough to make "JWR in Lithuania" an attractive headline. It is not close enough to make it a defensible assessment. The implementation details matter more than the theme.

### Where the implementations diverge

| Characteristic | HCVX-PARKING-KIT-2026 / UNIPARK | Cisco Talos JWR | Assessment |
| --- | --- | --- | --- |
| client framework | Vue, Vite-style hashed bundles, Socket.IO and Engine.IO | Vue 2.x with Host Bridge and Content Mode | common frontend choice, not a unique code relationship |
| real-time channel | same-origin Socket.IO on `/console` | binary WebSocket at `webSocket/QT/{sessionId}/khkjsahfjkwhakjlsdwdddddd88` | different protocol and path |
| session identity | `uuid` and `shopHost` query values | `JWRCID` and `JWRCVV-{timestamp}-{random}-{random}` | no JWR-specific identifier in the documented UNIPARK IOCs |
| client to server | `changleField`, `submitData`, `notice` | JWR envelopes, acknowledgements and `cvvform` | different event schema |
| server to client | `config`, `operation` and UNIPARK state names | more than 40 `to_*`, `tip_*` and `updata_*` commands | similar purpose, different command vocabulary |
| REST fallback | not documented in this investigation | `api/open/addClick`, `getSyncSettings`, `pollInstruction`, `addCvv`, `the_final_interface` | strong JWR markers were not found in the UNIPARK investigation |
| worker and iframe | no documented JWR Host Bridge model | `static/js/ws-worker.js`, parent bridge and phishing iframe | different architecture |
| encryption | AES-CBC with static client-side key material | AES-CTR through `JwrCrypto` and a new session key | different implementation |
| anti-analysis | broad headless score and a 0.31 `isSpider` threshold | self-referential regular-expression guard and decoy variable | both resist analysis, but differently |
| exact client hash | UNIPARK core `7068d7b0...` and other bundle hashes | four JWR SHA-256 values published by Talos | no exact match |

### IOC and infrastructure comparison

I compared the [JWR IOC set published by Talos](https://github.com/Cisco-Talos/IOCs/blob/main/2026/08/dissecting-the-jwr-phishing-framework.txt) with the hashes, domains and IPs documented in this investigation:

```text
exact SHA-256 overlap: 0
exact domain overlap:  0
exact IP overlap:      0
```

This does not prove that no relationship can exist. Published IOC sets are not complete infrastructure maps. It does mean that no exact overlap has currently been demonstrated.

There is one relevant supporting infrastructure signal. Two Talos JWR addresses, `43.156.227[.]15` and `43.160.241[.]151`, fall within the `ACEVILLEPTELTD-SG` ranges `43.156.0.0/16` and `43.160.0.0/16`. Exact-hash UNIPARK deployments also appeared in those provider ranges, including `43.156.224[.]182`, `43.160.226[.]55` and `43.160.238[.]159`.

That is shared cloud-provider and netblock context. It is not a shared address, server or operator. Alibaba and Tencent infrastructure can be popular across the same criminal ecosystem without every customer joining the same Telegram chat.

### What the evidence supports

| Judgement | Confidence | Basis |
| --- | --- | --- |
| UNIPARK and JWR use the same real-time, operator-driven payment-phishing tradecraft | high | SMS lures, Vue, live WebSocket control, multi-stage card, PIN and OTP collection, fingerprinting |
| both may sit within the same broader Chinese-language PhaaS ecosystem | moderate | operational model, language residues, multi-brand architecture and partially shared provider context |
| the UNIPARK kit is a JWR variant or shares direct code lineage | low | no exact hash or JWR-specific protocol marker and materially different implementation |
| one operator controls both the UNIPARK and Talos campaigns | low | no shared domain, address, account, session marker, backend endpoint or other control artefact |

Talos itself notes that JWR is behaviourally aligned with several other Chinese-language PhaaS families while lacking code-level implementation overlap with Lucid, Darcula and Lighthouse. The same discipline applies here: **behavioural convergence is not code lineage, and code lineage would still not establish one operator**.

Until a shared JWR-specific client marker, exact artefact, backend endpoint, operator account or another rare control artefact appears, HCVX-PARKING-KIT-2026 remains a separate analytical cluster. JWR is now a valuable comparison and hunting hypothesis, not a replacement name for the cluster.

## The SMS

![Reconstruction of the supplied UNIPARK smishing message](/assets/img/posts/2026-08-11-unipark-smishing/sms-lure-reconstruction.svg)
_This is a shortened redraw of the supplied screenshot. The malicious URL is deliberately defanged. It is not presented as a new original screenshot._

The lure combines several familiar pressure points:

1. a recognised local brand
2. an unspecified debt that cannot be checked from the message itself
3. urgency and threatened additional charges
4. a licence-plate prompt that looks like a low-risk first step
5. instructions to reply and manually open the link in Safari.

That last instruction is not merely user support. A reply confirms that the recipient number is active. [Apple also states](https://support.apple.com/en-gb/guide/iphone/iph3f94d910d/ios) that a message can no longer be submitted through its "Report Spam" control after the user replies. I cannot prove from one screenshot that replying would make the link clickable on every iOS and carrier combination. It is, however, clearly useful to the sender.

## Method and safety boundaries

> **Practical follow-up:** the separate [infrastructure pivoting 101 guide](/en/research/infrastructure-pivoting-101/) shows this case's complete workflow, PowerShell commands, URLScan queries, evidence grading and the path from one URL to a 126-host cluster.
{: .prompt-info }

I did not run the "let us click Submit and see what happens" experiment. The malicious JavaScript was **not executed** in a browser, a headless environment or Node. No form was completed, no WebSocket session was initiated and no test card data was sent to the backend.

I did not send random data just to see where it might surface either. That would contaminate the panel, warn the operator, create unnecessary interaction with someone else's system and still would not prove that any other records belonged to real victims. The collection path can be reconstructed from client code and public network artefacts without touching it.

The work consisted of:

- transcribing the supplied SMS and analysing the lure
- RDAP, DNS, Certificate Transparency and passive-source checks
- downloading raw HTML, JavaScript and CSS as bytes
- statically decoding obfuscated string tables without executing the application
- calculating SHA-256 values and searching URLScan for exact response hashes
- pivoting on asset names, hashes, brands, URL structure, registrar and name servers
- searching public sources for the telephone number and checking its numbering plan.

The investigation snapshot is **approximately 08:10 UTC on 11 August 2026**. The infrastructure changed while the campaign was active, so a later DNS view may be different.

## Timeline

| Time UTC | Event | Interpretation |
| --- | --- | --- |
| 2026-06-30 09:27 | URLScan first observed the shared core bundle hash | earliest public boundary I found, not necessarily the true start |
| 2026-07-16 15:36 | `unipark.cxmpvqtr[.]club/com/` was scanned | earliest earlier UNIPARK deployment found in this pivot |
| 2026-08-03 13:59 | `unipark.novorb[.]xyz/com/` was scanned | another UNIPARK host using the same core kit |
| 2026-08-04 07:00 | `unipark.fxqro[.]xin/com/` was scanned | later found to be an exact static-asset match for the current page |
| 2026-08-10 13:08 | `fmqr[.]ink` was registered | new root domain created |
| 2026-08-11 05:11 and 05:58 | wildcard certificates were issued for `*.fmqr.ink` | Cloudflare-edge deployment was prepared |
| 2026-08-11 06:03 | the RDAP record was changed | consistent with a rapid infrastructure change and containment window |
| about 2026-08-11 08:01 | SMS delivered, based on the supplied 11:01 local time | confirmed lure delivery in Lithuania |
| about 2026-08-11 08:10 | `unipark.fmqr[.]ink` already pointed to `siena.nksc.lt` | the hostname had been sinkholed or otherwise neutralised |

The certificate times come from Certificate Transparency rather than a server's own claims. The certificate covered a wildcard, so the CT record does not enumerate every hostname. It does show that the operator could quickly create multiple brand-specific subdomains beneath the root.

## Domain and infrastructure anatomy

The `fmqr[.]ink` registration snapshot was:

| Field | Value | Assessment |
| --- | --- | --- |
| registered | 10 Aug 2026 13:08:18 UTC | less than a day before delivery |
| expiry | 10 Aug 2027 | ordinary one-year registration |
| registrar | Dominet (HK) Limited | also used by the related UNIPARK roots |
| name servers | `trevor.ns.cloudflare.com`, `paris.ns.cloudflare.com` | Cloudflare concealed the origin and enabled rapid edge deployment |
| TLS | wildcard `*.fmqr.ink` and `fmqr.ink` | suitable for multiple branded subdomains |
| current CNAME | `siena.nksc.lt` | direction into Lithuania's NKSC domain, not the attacker origin |

Google Public DNS still retained the earlier Cloudflare edge addresses `104.21.54[.]13` and `172.67.222[.]52`. These are poor blocklist indicators because they are shared Cloudflare infrastructure. Likewise, `195.182.64[.]102`, reached through `siena.nksc.lt`, is **not malicious** and should not be blocked.

I did not identify a defensible origin server from public data. The domain had no useful MX or descriptive TXT records either. Cloudflare did its job. Pretending that a shared edge IP reveals the backend would only add noise.

## What the phishing application collected

The HTML was only 2,553 bytes. Most logic sat inside three JavaScript bundles. The page also hotlinked fonts and a chevron image from the legitimate `unipark.lt` site. That supports brand-cloning analysis, but it does not imply that UNIPARK infrastructure was compromised. An attacker can hotlink a public asset just like any other visitor.

![URLScan screenshot of the earlier exact-hash-matching UNIPARK phishing page](/assets/img/posts/2026-08-11-unipark-smishing/urlscan-unipark-fxqro.png)
_Public URLScan screenshot from the 4 August 2026 scan of `unipark.fxqro[.]xin`. This is an earlier exact-hash-matching deployment, not a form I completed or a live session with the operator._

Static decoding reconstructed this victim journey:

![Reconstructed collection flow from the SMS to the victim's card PIN](/assets/img/posts/2026-08-11-unipark-smishing/credential-theft-chain.svg)

1. **Vehicle details.** The first page asks for the licence plate and stores it in the browser.
2. **Fabricated debt.** The application displays €3.75 and the fixed reference `4947295570`.
3. **Personal data.** Full name, address, city, region, postal code, telephone and email.
4. **Payment card.** Cardholder, number, expiry and CVV.
5. **Verification.** Separate flows exist for telephone OTP, email code, banking-app approval and arbitrary custom codes.
6. **Card PIN.** The site explicitly requests a four-digit PIN and falsely presents it as part of 3-D Secure.

One decoded Lithuanian instruction translates to:

```text
Your PIN is the same PIN you use at ATMs or point-of-sale terminals.
```

That removes any ambiguity about whether the `pin` field could refer to an internal reference. The kit asks for the actual card PIN. It also contains an "incorrect PIN, try again" state, allowing the operator to collect more than one attempt.

### What the collected card data can actually enable

If the operator obtains the card number, cardholder name, expiry date and CVV, they have a near-complete set of static credentials for card-not-present transactions. [Visa describes card-not-present fraud](https://corporate.visa.com/en/solutions/visa-protect/insights/ecommerce-fraud.html) as transactions where the physical card is not required. The most immediate monetisation routes here are online purchases, low-value card testing and attempts to bypass or socially engineer an additional bank approval.

The PIN makes the dataset more dangerous, but the technical distinction matters. A card number, name, expiry, CVV and PIN alone are **not enough to clone an EMV chip**. [EMVCo explains](https://www.emvco.com/knowledge-hub/how-do-emv-chip-specifications-tackle-card-fraud/) that chip transactions use dynamic cryptographic data and that the embedded chip is very difficult to counterfeit.

A physical counterfeit card normally requires magnetic-stripe or complete track data. [PCI SSC](https://www.pcisecuritystandards.org/glossary/) distinguishes cardholder data from sensitive authentication data, which includes verification codes, full track data and PINs. In [skimming cases described by Europol](https://www.europol.europa.eu/crime-areas/online-fraud-schemes/fraud-against-payment-systems), counterfeit cards were produced from copied magnetic-stripe data, with the PIN enabling cash withdrawal or terminal use.

I found no collection of track data in this page. Saying "the attacker can clone your EMV card from this form" would therefore overstate the evidence. The accurate assessment is that the captured fields support serious online-payment fraud. If the same operator obtains track data through another channel, the stolen PIN may help use a counterfeit card where magnetic-stripe acceptance or fallback remains available.

## Reverse engineering the phishing kit

This required more than running `strings` and a few searches. I expanded both obfuscated application bundles, reconstructed their custom Base64 lookup tables and statically replaced **19,075 string-lookup calls**. That produced 3,495 decoded values. I did not import or execute either bundle. The mechanism was read without switching it on.

![Reverse-engineered parking phishing-kit architecture](/assets/img/posts/2026-08-11-unipark-smishing/kit-architecture.svg)

The application separates into three clear layers:

| File | Size | Role |
| --- | ---: | --- |
| `CMjzun1n.js` | 53,382 B | thin UNIPARK brand adapter containing copy, the €3.75 lure, routes and the selected personal-data fields |
| `BD53Kn13.js` | 684,970 B | shared phishing engine containing forms, validation, card artwork, storage, the operator state machine and anti-analysis logic |
| `DDXZMe5D.js` | 182,967 B | Vue runtime and the Socket.IO and Engine.IO client |

That distinction matters. This is not a one-off UNIPARK page assembled for a single message. UNIPARK is a skin placed over a common engine. The server can also deliver `userSiteConfig`, merge new settings and supply another `backUrl`. The same framework can therefore be repackaged cheaply as RingGo, EasyPark or another brand.

### Client-side validation and storage

The card-number field strips non-digits, accepts 15 or 16 digits and performs a Luhn check. It derives the displayed card brand from the BIN prefix. Expiry must use `MM/YY` and cannot be in the past. CVV accepts three or four digits. The forms expose the browser autocomplete values `cc-number`, `cc-exp` and `cc-csc`.

Captured values live in one reactive form object and are periodically persisted in the browser. The kit AES-CBC encrypts values stored in `localStorage` and `sessionStorage`, while replacing storage-key names with MD5 values. The encryption material is static and shipped to every client. It hides readable JSON from a casual glance at DevTools, but it does not protect the data from an analyst who has the bundle.

Unused components provide another reuse marker. The common engine contains bank-account, branch-number, SSN, American Express extra-CVV and custom-code flows that the UNIPARK adapter does not need. This framework was built for more than one parking lure.

### The operator selects the next screen

After submission, the frontend does not simply wait for one final success response. It accepts an `operation` status and maps that status to the victim's next page:

| Server status | Victim-facing result |
| --- | --- |
| `rejected` | card error and return to payment |
| `rejectedCode` | incorrect-code error |
| `waitVerificationPhone` | phone OTP |
| `waitVerificationEmail` | email code |
| `waitVerificationPin` | card PIN |
| `waitVerificationExpressCvv` | additional American Express CVV |
| `waitVerificationApp` | banking-app approval |
| `waitVerificationCustomCode` | operator-defined additional code |
| `completed` | success page |

Messages including `resendCode`, `confirmedApp` and `notReceivedApp` let the operator observe what the victim does between screens. This is not an automated checkout. It is an interactive credential-harvesting flow.

### Anti-analysis is part of the execution path

The engine calculates a headless-risk score using `navigator.webdriver`, ChromeDriver and CDP artefacts, Playwright and Puppeteer indicators, User-Agent values, the WebGL renderer, plugins, languages, worker inconsistencies, canvas, audio, WebRTC, media devices, permissions, battery information and window dimensions.

The important finding is not the length of that checklist. When the resulting score reaches **0.31**, the application classifies the visitor as `isSpider` and skips the normal configuration and Socket.IO initialisation path. An automated scanner may therefore retrieve the page assets without seeing the same backend flow presented to a real mobile visitor. I can update the earlier cautious assessment: in this build, the anti-analysis result demonstrably changes execution.

It also explains why a screenshot or DOM snapshot alone is insufficient. Static bundle analysis disclosed more than attempting to imitate a normal browser would have done.

## Backend and operator-controlled flow

The frontend defaults to the **same hostname** over Socket.IO, using WebSocket or polling transport and the `/console` path. It builds that address from `window.location.protocol` and `window.location.host`. There is no separate hardcoded C2 domain in the client. The connection query contains `uuid` and `shopHost`. The client sends `changleField`, `submitData` and `notice` events. Yes, `changleField` is spelled exactly that way.

Message bodies are encrypted with AES-CBC using static key material embedded in the bundle. A server `config` response can also provide `userSiteConfig` and `backUrl`, so the effective backend root can theoretically be changed at runtime, even though this static deployment did not expose a separate value.

That encryption does not make the site secure. It merely makes network telemetry less convenient to inspect while delivering the decryption material to every visitor inside the JavaScript.

Field changes are sent to the backend, while inbound `operation` messages let an operator switch the victim into:

- telephone OTP
- email OTP
- banking-app approval
- card PIN
- CVV or another custom-code request
- error and retry states.

This is consistent with an operator-supervised phishing panel rather than a single static form. The requested challenge can change after the victim submits a particular card or bank.

There is an important line between inference and evidence here. The victim bundle contains no dashboard URL, admin login or operator-side panel code. I infer an operator panel from the bidirectional `operation` flow, state control and the ability to move a victim between screens. `/console` is a Socket.IO collection and control path, not a proven public admin page.

URLScan provided a useful reality check. The query `filename:console AND filename:DDXZMe5D.js` returned **all 163** scans linked by the core hash. In other words, browsers contacted `/console` during every captured deployment. It was not merely dormant code.

The anti-analysis module's place in the execution chain is described above. It does not merely collect signals. Its result determines whether normal configuration and the `/console` connection are initialised.

### Telegram check

I decoded **3,495 strings** from the two obfuscated application bundles. They contained no `api.telegram.org`, bot token, `chat_id`, `sendMessage`, Telegram channel, admin URL or dashboard route. Combined URLScan searches for `api.telegram.org`, `telegram.org`, `sendMessage` and `bot` also returned zero matches.

There is therefore no client-side evidence of a Telegram integration. The server could still have forwarded stolen records to Telegram or another platform, but the backend code is unavailable. Treating that possibility as fact would be attribution by imagination.

### Can `/console` reveal the full infrastructure?

The `/console` path is not unique enough to use as a standalone IOC. Legitimate applications can use the same path, so a blind search would produce false positives. The useful result came from combining the path with a kit artefact:

```text
filename:console AND filename:DDXZMe5D.js
```

That URLScan query returned 163 records, exactly the same set obtained through the core bundle hash. The overlap confirms `/console` as an active network characteristic of this kit family. It does not turn the path into a magic window onto the entire backend.

A practical hunting combination is `/console`, the core response hash, static asset names, the `changleField` typo, URL routes, brand pattern, server header and a narrow time window. This can identify publicly scanned deployments and monitor new ones. It cannot guarantee "full infrastructure" because URLScan cannot show private hosts, unscanned domains, a Cloudflare-hidden origin, a server-side relay or an operator dashboard held on a separate network.

## How one domain became 126 hostnames

I compared raw SHA-256 values from the current deployment against URLScan's response-hash index.

| File | SHA-256 | Public match |
| --- | --- | --- |
| `CMjzun1n.js` | `8d5e6597ebac3ca5419ad4fe5c422fb59f98948d5fa32365b1730bdd06f005dc` | `unipark.fxqro[.]xin` |
| `BD53Kn13.js` | `0bdd6862589aeb9603ba1d3a8f3efe85ed987f16a954816ad85debd13c39919a` | `unipark.fxqro[.]xin` |
| `BbPeY660.css` | `34008efeed81b1f951e7ce4e95760293729ae1e84affe5115570317d3f2d4c26` | `unipark.fxqro[.]xin` |
| `C6NDXE1b.css` | `b38ea1ff18118191c1ccdd92a882ac5d2132e2393fddb4c2132476b25924e922` | `unipark.fxqro[.]xin` |
| `DDXZMe5D.js` | `7068d7b09a8afb99b051847dd65602e054f69c33d0cd8161ab986eae71538a2b` | 163 URLScan records |

The first four exact matches show that `unipark.fmqr[.]ink` and `unipark.fxqro[.]xin` were effectively the same frontend deployment. The fifth bundle is shared across the wider kit family.

![Pivot from the supplied UNIPARK hostname into the wider parking phishing kit](/assets/img/posts/2026-08-11-unipark-smishing/campaign-pivot.svg)

![Public URLScan screenshot of the RingGo variant using the same core kit](/assets/img/posts/2026-08-11-unipark-smishing/urlscan-ringgo-zqmk.png)
_The `ringgo.zqmk[.]cloud/com` variant captured by URLScan on 11 August 2026. The structure remained the same while the brand, colours and copy changed._

From 30 June through 11 August 2026, URLScan searches for the shared `DDXZMe5D.js` response hash returned:

| Branded hostname prefix | Scan records | Examples |
| --- | ---: | --- |
| RingGo | 59 | `ringgo.zqmk[.]cloud`, `ringgo.mqrka[.]ink` |
| EyeParking | 55 | `eyeparking.nqzro[.]ink`, `eyeparking.mxwle[.]club` |
| UNIPARK | 3 earlier scans | `cxmpvqtr[.]club`, `novorb[.]xyz`, `fxqro[.]xin` |
| other parking brands | 46 | EasyPark, Q-Park, NCP and generic parking hosts |

That is **163 scan records across 126 unique hostnames**. The current `unipark.fmqr[.]ink` host is not included because URLScan had not indexed it.

The earlier UNIPARK hosts were:

```text
hxxps://unipark[.]cxmpvqtr[.]club/com/
hxxps://unipark[.]novorb[.]xyz/com/
hxxps://unipark[.]fxqro[.]xin/com/
hxxps://unipark[.]fmqr[.]ink/com/      # this incident
```

All four root domains were registered through Dominet (HK) Limited and used Cloudflare name servers, random-looking root labels, a brand subdomain and the same `/com/` route. The three newest currently point at `siena.nksc.lt`. The oldest no longer resolves.

The application also retained this localStorage key:

```text
uk_ringgo_fine_plate
```

That `RingGo` residue and English RingGo fallback copy show that the Lithuanian build was not created from scratch. The brand changed, but much of the parking kit did not. Chinese developer labels such as `PIN验证页` also remain in the bundle, but they are **not attribution to China**. They may originate from a builder, developer, translator or copied component.

The analytical boundary matters: an exact hash reliably links software artefacts. It does not prove that one human controlled every one of the 126 hostnames. The kit could be rented, sold or copied. Confidence is high for the same kit family and only medium for a single operator.

## IP pivot: the layer behind Cloudflare

The hostname list alone does not show how the kit was delivered. Grouping all 163 URLScan records by ASN and web server exposed two distinct models:

| Delivery model | Scans | Unique hosts | Visible infrastructure |
| --- | ---: | ---: | --- |
| Cloudflare | 121 | 101 | AS13335 shared Cloudflare edges |
| direct OpenResty | 41 | 24 | AS132203 Aceville/Tencent Cloud |
| direct nginx | 1 | 1 | AS132203 Aceville/Tencent Cloud |

![Cloudflare and direct-hosting layers used by the parking phishing kit](/assets/img/posts/2026-08-11-unipark-smishing/infrastructure-layers.svg)

The RDAP objects for the AS132203 addresses are labelled `ACEVILLEPTELTD-SG`. [Tencent Cloud documentation](https://intl.cloud.tencent.com/document/product/1033/32281?lang=en&amp;pg=) lists Aceville Pte Limited as a Tencent Cloud service entity. That identifies hosting context, not the operator's nationality or location.

The hash-linked sample contained 12 directly exposed IP addresses:

```text
43.153.54[.]89      43.135.161[.]140    170.106.154[.]69
43.157.97[.]37      101.32.47[.]254     43.160.226[.]55
43.165.174[.]107    43.172.91[.]66      43.162.121[.]115
43.160.238[.]159    43.156.224[.]182    43.162.103[.]2
```

Several addresses hosted unusually focused domain groups:

| Direct IP | Hash-linked scans | All public neighbouring domains | Strongest pattern |
| --- | ---: | ---: | --- |
| `43.153.54[.]89` | 11 | 30 | parking, DPD, Australia Post, SingPost, government and traffic lures |
| `170.106.154[.]69` | 5 | 73 | large RingGo rotation, plus Evri and Royal Mail |
| `43.172.91[.]66` | 2 | 53 | almost entirely RingGo typo domains |
| `43.135.161[.]140` | 7 | 5 | EasyPark variants |
| `43.157.97[.]37` | 4 | 7 | Q-Park variants |
| `43.165.174[.]107` | 3 | 6 | Q-Park variants |
| `101.32.47[.]254` | 3 | 10 | EasyPark, GLS and tax-authority impersonation |
| `43.156.224[.]182` | 1 | 33 | RingGo and DPD Local impersonation |

Across all 12 addresses, the public IP pivot returned **402 scans and 249 unique neighbouring domains**. A name-based triage produced 121 RingGo, 29 Q-Park, 13 other parking, 27 delivery, 13 government, tax or police, and 46 other candidates.

Those are **not 249 confirmed campaign domains**. IP co-location is weaker than an exact file hash, particularly in public cloud ranges. A dense set of similarly constructed brand-typo domains on the same direct IP, during the same period and behind the same OpenResty stack is still a useful hunting queue. It is a lead, not a conviction.

### URL and DNS patterns

The kit was not tied to one route. Public captures used `/com/`, `/uk/`, `/dk/`, `/cz/`, `/pay/`, `/d/` and the root path. UNIPARK, RingGo and EyeParking frequently placed the brand in a subdomain above a random root. Other deployments put a typo of the brand directly into the root, such as `ringgo??-co[.]shop` or `q-park??[.]top`.

Direct AS132203 hosts commonly used `ns7.alidns.com` and `ns8.alidns.com`, or HiChina DNS pairs. The Cloudflare-fronted group more often combined the Dominet registrar with Cloudflare name servers. These are useful infrastructure templates, not unique actor fingerprints.

## Telephone-number pivot

Under the [ITU numbering plan](https://www.itu.int/oth/T0202.aspx?lang=en&parent=T0202), `+63` is assigned to the Philippines and the following `9` is consistent with a mobile number. Public searches for the exact `+639519761812` string returned no prior abuse reports, profiles or reliable subscriber record.

The defensible conclusions are limited:

- the displayed number fits a Philippine mobile-number format
- it may represent a physical SIM, SMS gateway, roaming number or spoofed sender identity
- the prefix does not establish the present carrier because mobile numbers can be ported
- it does not establish that the campaign operator is in the Philippines.

I treat the number as a **delivery IOC**, not an attribution IOC. Blocking and reporting it is reasonable. Building an operator biography around it is not.

## Attribution and confidence

| Assessment | Confidence | Basis |
| --- | --- | --- |
| the SMS and application are phishing | high | brand mismatch, fresh domain, credential flow and card-PIN collection |
| `fmqr` and `fxqro` use the same frontend build | high | four exact JavaScript and CSS hash matches |
| all 126 hostnames belong to the same kit family | high | identical core bundle hash and shared application structure |
| the UNIPARK domains form a coordinated rotation | medium-high | same brand, path, registrar, Cloudflare pattern and bundle |
| one operator controls the entire cluster | medium | a shared panel is plausible, but the kit may be resold |
| the operator is in the Philippines or China | low | telephone and developer-string residues do not establish geography |
| money was successfully stolen | unknown | no victim, bank or backend records were available |

## Indicators and research pivots

Malicious URLs remain defanged. Official and research-source links below are clickable.

| Type | Value | Note |
| --- | --- | --- |
| SMS sender | `+63 951 976 1812` | observed in this incident. Ownership unverified |
| URL | `hxxps://unipark[.]fmqr[.]ink/com` | supplied in the SMS |
| prior URL | `hxxps://unipark[.]fxqro[.]xin/com/` | full frontend exact-hash clone |
| prior URLs | `unipark[.]novorb[.]xyz/com/`, `unipark[.]cxmpvqtr[.]club/com/` | same core kit |
| Socket.IO path | `/console` | same-origin command and collection channel |
| client to server | `changleField`, `submitData`, `notice` | data and state events |
| server to client | `config`, `operation` | configuration and operator-controlled screens |
| localStorage key | `uk_ringgo_fine_plate` | RingGo kit-reuse residue |
| HTML marker | `Aff2dfwOEgleoYXZnKahKIPfXahqbYL3ErZahQ27wc00bAjz` | hidden page element |
| core SHA-256 | `7068d7b09a8afb99b051847dd65602e054f69c33d0cd8161ab986eae71538a2b` | broadest kit pivot |
| direct hosting | the 12 AS132203 addresses listed above | correlate with domain, SNI and time before acting |

I would not add Cloudflare edge addresses or `siena.nksc.lt` addresses to a blocklist. The former are shared infrastructure. The latter represents containment.

## Sources

1. Primary source: screenshot of the SMS received on 11 August 2026 and supplied for this investigation.
2. [RDAP record for fmqr.ink](https://rdap.org/domain/fmqr.ink)
3. [RDAP record for fxqro.xin](https://rdap.org/domain/fxqro.xin)
4. [RDAP record for novorb.xyz](https://rdap.org/domain/novorb.xyz)
5. [Certificate Transparency records through Cert Spotter](https://api.certspotter.com/v1/issuances?domain=fmqr.ink&amp;include_subdomains=true&amp;expand=dns_names&amp;expand=issuer)
6. [URLScan exact core-hash search](https://urlscan.io/search/#hash%3A7068d7b09a8afb99b051847dd65602e054f69c33d0cd8161ab986eae71538a2b)
7. [URLScan record for the earlier unipark.fxqro.xin deployment](https://urlscan.io/result/019fcb92-a594-7294-870a-6ddf2467fe86/)
8. [URLScan record for the earlier unipark.novorb.xyz deployment](https://urlscan.io/result/019fc7ec-3431-7364-9b50-04ae1b2830e3/)
9. [URLScan query linking the core bundle to the /console request](https://urlscan.io/search/#filename%3Aconsole%20AND%20filename%3ADDXZMe5D.js)
10. [URLScan public records for IP 43.153.54.89](https://urlscan.io/search/#ip%3A43.153.54.89)
11. [APNIC RDAP object for IP 43.153.54.89](https://rdap.apnic.net/ip/43.153.54.89)
12. [Tencent Cloud documentation listing Aceville Pte Limited](https://intl.cloud.tencent.com/document/product/1033/32281?lang=en&amp;pg=)
13. [NKSC form for reporting fraudulent websites](https://www.nksc.lt/pranesti-svetaine.html)
14. [UNIPARK contacts and official payment channels](https://unipark.lt/kontaktai-ir-duk/)
15. [Apple: recognising phishing messages](https://support.apple.com/en-gb/102568)
16. [Apple: reporting spam and blocking a sender](https://support.apple.com/en-gb/guide/iphone/iph3f94d910d/ios)
17. [ITU national numbering plans](https://www.itu.int/oth/T0202.aspx?lang=en&amp;parent=T0202)
18. [PCI SSC payment-card data glossary](https://www.pcisecuritystandards.org/glossary/)
19. [Visa on card-not-present fraud](https://corporate.visa.com/en/solutions/visa-protect/insights/ecommerce-fraud.html)
20. [EMVCo on how EMV chips resist counterfeit-card fraud](https://www.emvco.com/knowledge-hub/how-do-emv-chip-specifications-tackle-card-fraud/)
21. [Europol on card-not-present fraud, skimming and counterfeit cards](https://www.europol.europa.eu/crime-areas/online-fraud-schemes/fraud-against-payment-systems)
22. [URLScan record for the `ringgo.zqmk.cloud` variant](https://urlscan.io/result/019fef6c-3238-7223-9b8c-08efa2358ac9/)
23. [Cisco Talos: Dissecting the JWR phishing framework](https://blog.talosintelligence.com/dissecting-the-jwr-phishing-framework/)
24. [JWR IOC set published by Cisco Talos](https://github.com/Cisco-Talos/IOCs/blob/main/2026/08/dissecting-the-jwr-phishing-framework.txt)
25. [APNIC RDAP record for Talos JWR address `43.156.227.15`](https://rdap.apnic.net/ip/43.156.227.15)
26. [APNIC RDAP record for Talos JWR address `43.160.241.151`](https://rdap.apnic.net/ip/43.160.241.151)

_This investigation documents criminal-infrastructure indicators and defensive pivots. UNIPARK, RingGo, EyeParking, EasyPark, Q-Park, NCP, Cloudflare and other legitimate providers mentioned here are not treated as participants merely because their names or infrastructure were impersonated or abused._
