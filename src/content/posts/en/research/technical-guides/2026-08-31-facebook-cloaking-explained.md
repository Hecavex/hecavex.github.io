---
title: "Facebook Cloaking Explained: How Scam Ads Hide Their Real Landing Pages"
card_title: "How Facebook Cloaking Hides Scam Landing Pages"
description: "A defensive explanation of Facebook cloaking, conditional redirects, clean and victim responses, and the evidence needed to investigate scam advertising safely."
seo_title: "Facebook Cloaking Explained: How Scam Ads Hide Pages"
seo_description: "Learn how Facebook cloaking routes reviewers and victims to different pages, which evidence matters, and how defenders can investigate it safely."
seo_keywords:
  - "Facebook cloaking explained"
  - "Facebook ad cloaking"
  - "scam ad landing pages"
  - "cloaked phishing page"
  - "conditional redirects"
  - "malvertising investigation"
date: 2026-08-31 18:10:00 +0300
lang: en
translation_key: facebook-cloaking-explained
permalink: /en/research/facebook-cloaking-explained/
author: deividas-lis
content_type: technical-guide
publication_class: technical-assessment
confidence: high
tlp: clear
categories: [fraud-scams, social-engineering, tradecraft]
tags: [cloaking, Facebook, phishing, redirect chains, OSINT, CTI, incident response]
featured: false
draft: false
published: true
toc: true
comments: false
prose_width: wide
scope: "A mechanism-first, defensive guide to conditional content delivery in scam advertising and phishing, with an evidence-preservation workflow for brand teams, investigators and incident responders."
limitations: "Different responses do not by themselves prove malicious intent, campaign membership or operator identity. This guide does not provide instructions for bypassing review systems, defeating access controls or reproducing a victim profile."
methods:
  - "Review of first-party HECAVEX case evidence"
  - "Standards and official documentation review"
  - "Comparative-response evidence modelling"
  - "Defensive collection-boundary analysis"
evidence_basis: "The existing HECAVEX Facebook investment-scam investigation, official Google cloaking and redirect guidance, urlscan documentation, HTTP standards, and preserved public observations described in the linked cases."
key_findings:
  - "Cloaking is a decision system: one URL can return a clean page, an error, a challenge or a scam page according to request and session context."
  - "Referrer, IP and location context, device characteristics, cookies, timing and automation signals can influence routing, but each signal also has legitimate uses."
  - "A clean response is evidence of what one observer received at one time, not proof that every visitor received the same page."
  - "Useful reporting preserves the original entry point, redirect chain, response artefacts, collection context and limitations without turning a technical difference into unsupported attribution."
image:
  path: /assets/img/posts/2026-08-31-facebook-cloaking-explained/facebook-cloaking-explained-hero-v2.webp
  social: /assets/img/social/facebook-cloaking-explained-en.png
  thumbnail: /assets/img/posts/2026-08-31-facebook-cloaking-explained/facebook-cloaking-explained-card-v2.webp
  alt: "One advertisement URL is conditionally routed to a clean response or a fraudulent victim response, with evidence preserved before interpretation"
  width: 1600
  height: 900
---

## Cloaking is a routing decision, not a special kind of webpage

A person clicks a sponsored Facebook post and sees a cloned news article, an investment form or a fake login. A reviewer opens what appears to be the same address and receives an empty page, a harmless blog, the real brand website or an error. Both observations can be genuine.

That is the practical problem behind **Facebook cloaking**. The entry URL is not a complete description of what the server will deliver. A redirector, server rule or client-side script evaluates context and selects a response. The harmful part may appear only after an advertising click, in a selected country, on a particular class of device, during a limited time window or on the first visit.

Google's official [spam policy defines cloaking](https://developers.google.com/search/docs/essentials/spam-policies#cloaking) as presenting different content to users and search engines with an intent to manipulate or mislead. The same documentation distinguishes malicious redirection from normal redirects used for moves, localisation and authenticated navigation. For threat intelligence, that distinction matters. **Different content is an observation. Deceptive intent is an assessment that needs context.**

The longer [HECAVEX Facebook cloaking investigation](/en/research/when-fake-news-scams-and-cloaking-meet/) documents a real investment-scam ecosystem built around cloned media, advertising traffic and conditional delivery. This guide has a narrower purpose. It explains the mechanism, the questions a defender should ask and the evidence that can support an answer without becoming a playbook for defeating the operator's controls.

## What can influence the response

A request reaches a web service with more context than the visible URL. Some context is sent directly. Some is inferred. Some appears only after the browser runs code or stores state.

| Context | What the service may observe | Legitimate explanation | Security relevance |
|---|---|---|---|
| referrer and campaign parameters | whether the visit followed an advert, search result or partner link | attribution and campaign measurement | direct visits may receive a decoy while ad clicks continue |
| IP and network | address, ASN, hosting or access-provider context | abuse prevention, rate limiting and regional delivery | known scanners or hosting networks may receive a clean response |
| location | country or approximate region inferred from network data | language, licensing, tax and availability | a campaign can limit delivery to likely victims in one market |
| device and client | browser family, operating system, screen class and request headers | compatibility and responsive design | mobile users may be routed differently from desktop reviewers |
| cookies and session state | previous visits, referral state and locally stored values | login state, consent and shopping baskets | a one-time page can disappear on a repeat visit |
| timing and interaction | time, request sequence and whether scripts execute | performance, anti-abuse and application workflow | content can appear only during an active campaign window |
| automation indicators | incomplete browser behaviour or characteristics associated with tools | bot management and fraud prevention | automated review may receive a challenge, blank page or substitute content |

None of these fields is inherently malicious. Banks use risk-based authentication. Shops localise prices. Advertising platforms measure campaigns. Content-delivery networks block abusive automation. The question is not whether a page varies. It is **whether variation is being used to conceal a materially different and harmful destination from reviewers, brands or potential victims**.

## Model the request path before naming the mechanism

The visible URL is only the first object. A defensible record separates the route into layers because each layer has different telemetry and a different owner.

| Layer | Evidence object | Useful fields | What it can establish |
|---|---|---|---|
| platform entry | advert, Page, post, message or library record | platform ID, creative, visible destination, timestamp | the claimed entry point and presentation |
| outbound request | browser request leaving the platform | exact URL, method, `Referer`, user agent, cookies sent, time | what the client requested |
| server redirect | HTTP response | status, `Location`, response headers, body hash, responder IP | where one server instructed the client to go |
| client navigation | browser-executed transition | initiating script, meta refresh, navigation timing, target URL | what browser-side code caused |
| rendered response | final document and subresources | final URL, title, screenshot, DOM hash, response hashes, form action | what that observer received |
| user action | form, download or authentication event | fields displayed, destination, time, endpoint observed by authorised telemetry | the requested or completed action |

The HTTP `Referer` field can disclose the referring URI, subject to privacy and referrer-policy controls, as specified by [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html#field.referer). Modern browsers can also send Fetch Metadata headers that describe request context such as site relationship, mode and destination. The [W3C Fetch Metadata specification](https://www.w3.org/TR/fetch-metadata/) defines those signals for server-side request isolation. Their presence explains what a service could evaluate. It does not prove which field a particular operator used.

Keep DNS and TLS observations separate from HTTP behaviour. A hostname can change address while serving the same document. A shared edge IP can serve unrelated customers. A certificate can prove that a key was presented for a name at a time, not that a specific page was delivered. Request-path claims require request-path evidence.

![Controlled comparison of one URL showing how recorded requests can produce separate response observations](/assets/img/posts/2026-08-31-facebook-cloaking-explained/cloaking-request-comparison-en.svg)

*Figure: A response difference is defensible only when the request context and every changed collection variable are recorded.*

## Clean response and victim response are analytical labels

A **clean response** is the harmless, unavailable or non-representative content received by a particular observer. It might be:

- a blank document or generic error
- a challenge or consent screen
- a harmless article or parked page
- a redirect to the impersonated organisation's real website
- an advertising-policy-compliant page with no visible scam form.

A **victim response** is the content associated with the suspected harmful objective: a cloned article, credential form, payment page, callback form, fake trading interface or download prompt.

These labels describe the role of a response in an investigation. They do not prove who operated it. A public scanner screenshot showing a harmless page does not invalidate a victim screenshot. A victim screenshot alone does not show the entire redirect chain, backend, campaign size or duration. A `403` does not prove that the analyst was identified. A redirect to the real brand can be a deliberate exit, a removed deployment, a platform interstitial or a normal application route.

Record what was returned before explaining why. That small discipline prevents the evidence from being rewritten to match a preferred theory.

## Why the Facebook context matters without authenticating the destination

The first interaction may occur inside a familiar platform: a sponsored post, a Page, a Messenger conversation or a shared article. That context lowers suspicion, but it does not transfer Facebook's identity or security boundary to an external website.

An advertisement can contain multiple layers:

1. the visible Page, creative and call to action
2. tracking and campaign parameters
3. one or more redirectors
4. conditional routing logic
5. the final page, form or handoff.

The visible link text may not be the final hostname. A legitimate analytics or shortening service can be present at the first hop. Conversely, a suspicious-looking chain can end at a harmless destination. Preserve the sequence. Do not infer the last page from the first domain or campaign membership from a shared platform.

Meta's [shopping-safety guidance](https://www.facebook.com/help/123884166448529/) places scam awareness, seller verification and reporting alongside Marketplace use. It is useful user guidance, but platform context still cannot validate an external payment, investment or credential page. The claimed event must survive independent verification through the organisation's official app or a separately typed address.

## A safe evidence-preservation workflow

Most recipients should not investigate a cloaked page. They should stop, preserve the message or advert, verify the claim through an official channel and report it. Active collection belongs to authorised security teams with an approved environment, retention rules and a reason the result will change a decision.

### 1. Preserve the entry point

Capture the advert or message as seen, including Page or account name, visible text, timestamp, platform placement and any advertising-library identifier available through the platform. Preserve the exact URL privately. If it contains an email address, telephone number or long token, create a redacted and defanged sharing copy rather than publishing the original.

### 2. Preserve each observation separately

For every retained observation, record:

- collection time and time zone
- original URL and final URL
- HTTP status and `Location` values where available
- screenshot, page title and response or DOM hash
- browser and device class used by the approved collection system
- whether scripts, cookies and redirects were permitted
- source of the observation: victim device, enterprise telemetry, advertising library or third-party archive
- visibility and privacy level if a third-party service was used.

The [urlscan API documentation](https://urlscan.io/docs/api/) confirms that scans can vary by country, user agent and referrer, and warns that public scans are public records. Those controls explain collection context. They are not an invitation to impersonate victims or defeat a site's gates. Search existing observations first, remove personal data and use the lowest visibility compatible with the authorised purpose.

### 3. Keep the chain, not only the last screenshot

HTTP redirects are normal. [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html#name-redirection-3xx) defines the `3xx` semantics that commonly move a client to another location. JavaScript, meta refresh, deep links and platform interstitials can add further steps. Record them as ordered observations:

```text
advert → tracking URL → redirector → conditional response → final page
```

Do not flatten that sequence into "Facebook hosted the phishing page" or "the shortener is the attacker". A service can be abused without being compromised, and the final page can change after the first report.

### 4. Hash artefacts that can be preserved lawfully

A screenshot is useful for brand abuse. A document or script hash is useful for exact reuse. A favicon, form field set or path pattern may help discover related material. State what the match means. An exact file hash can support code reuse. It does not automatically prove common ownership because kits, templates and compromised sites can be shared.

For the wider relationship model, use [Infrastructure Pivoting 101](/en/research/infrastructure-pivoting-101/). It separates a search result, a confirmed technical relationship, cluster membership and attribution instead of giving them one convenient label.

## A reproducible comparison protocol

The purpose of comparison is to test a bounded proposition such as "two preserved observations of the same entry URL returned materially different content within the stated window". It is not to force the server to reveal hidden content.

### Define the case and collection authority

Assign a case ID, owner, collection purpose, legal authority, start and stop time, retention class and abort conditions. Record whether each item came from a victim report, enterprise proxy, browser history, platform library, hosting provider or public archive. Do not mix a victim-provided screenshot and a fresh analyst request under one label.

### Freeze a comparison manifest

For each observation, retain a machine-readable manifest beside the evidence:

```text
case_id
observation_id
source_type
collected_at_utc
original_url_sha256
request_method
final_url
http_status_sequence
response_sha256
dom_sha256
screenshot_sha256
browser_family
network_context_class
referrer_state
cookie_state
javascript_state
collector_version
notes_and_unknowns
```

Store the exact sensitive URL in the restricted case record and hash it. Use a redacted, defanged value in an ordinary report. Hashes protect integrity and allow exact comparison, but they do not make sensitive URLs safe to publish.

![Cloaking capture manifest preserving case identity, collection context, request record and response hashes](/assets/img/posts/2026-08-31-facebook-cloaking-explained/cloaking-capture-manifest-en.svg)

*Figure: The manifest is collected before interpretation so another reviewer can reconstruct the comparison.*

### Compare like with like

First compare observations that share the same original URL, time window and collection class. Then state every uncontrolled variable. A victim mobile browser and a public cloud scanner differ in network, client, referral state, cookie history and likely time. That pair can prove a response difference. It cannot isolate the deciding variable.

| Field | Observation A | Observation B | Supported statement |
|---|---|---|---|
| source | enterprise report | public archive | provenance differs |
| original URL hash | same | same | the recorded entry value matches exactly |
| final host | `news.example` | `brand.example` | the routes ended at different hosts |
| content | cloned article | harmless brand page | materially different responses were preserved |
| response hash | hash A | hash B | the saved documents are not identical |
| uncontrolled state | referral known | cookie state unknown | the deciding rule is not isolated |

If several variables changed, do not assign causality to country, IP, device or referrer. "Conditional delivery observed" may be well supported. "The operator detects researchers using this exact rule" is a separate claim that requires controlled evidence unavailable in many public cases.

![Evidence boundary for a cloaking comparison separating constants, changed variables and preserved outputs](/assets/img/posts/2026-08-31-facebook-cloaking-explained/cloaking-evidence-boundary-en.svg)

*Figure: The comparison can establish different outputs without identifying which uncontrolled variable caused them.*

### Preserve negative results

A timeout, challenge, `403`, empty body or redirect to a legitimate site is part of the dataset. Record resolver outcome, connection state, status, content length and collection time. Do not silently discard clean or failed observations because they weaken the preferred explanation.

Do not repeatedly visit a recipient-specific link, alter parameters, automate interaction or defeat a challenge to make harmful content appear. Those actions can disclose the investigation, consume a one-time token, expose personal data or cross an authorisation boundary. A missing page is a limitation, not a contest.

## False-positive controls for ordinary variation

Several benign systems can create apparently inconsistent screenshots:

- geographic availability and language selection
- authenticated versus unauthenticated views
- A/B tests and staged releases
- consent and age gates
- anti-bot challenges
- an expired campaign or removed page
- cache differences and delayed platform enforcement.

To assess deception, combine response differences with purpose and context. Stronger evidence includes a harmful form or download, impersonated branding, a misleading advert-to-page mismatch, recipient-specific tokens, confirmed credential or payment collection, repeated exact artefacts and a consistent chain from the campaign entry point.

Before calling the pattern cloaking, test the explanations that require less malicious intent:

- compare cache headers, age and CDN response identifiers where retained
- determine whether one observation was authenticated and the other anonymous
- check whether language, consent, age or regional availability explains the page
- verify whether the campaign expired or enforcement occurred between observations
- distinguish a platform warning page from the destination response
- compare complete response or DOM hashes rather than visual similarity alone
- confirm that the original URL, including its path and token, is actually identical.

The separate [information-factories investigation](/en/research/information-factories-on-lithuanias-border/) defines another analytical boundary. Cloned media and coordinated distribution can support influence operations, financial fraud or both. Similar presentation does not justify collapsing them into one actor or mission. Name the observed behaviour first. Attribute only when evidence supports attribution.

## Practical defensive validation

Treat a cloaking assessment as supported when three elements are present:

1. a preserved entry relationship connects the advert, message or platform object to the request path
2. at least one preserved response contains the harmful or materially deceptive function
3. a comparison or rule artefact supports conditional delivery, with uncontrolled variables and benign alternatives stated.

If only the harmful response exists, report a phishing or scam page associated with the entry point, not necessarily cloaking. If only two different benign responses exist, report variation. If the route is reconstructed from separate public observations, label it as a reconstruction and retain the timestamps that constrain it.

For enterprise validation, correlate browser history, secure web gateway, DNS, endpoint and identity telemetry by user and UTC time. A redirect chain can be reconstructed from proxy events even after the page disappears. A submitted credential or completed authentication needs identity and incident-response telemetry, not another screenshot.

## What brand, advertising and security teams should retain

Different teams need different parts of the same record:

- **brand protection:** impersonated name, logos, screenshots, final hosts and customer impact
- **advertising trust and safety:** advert, Page/account identifiers, creative, destination, time and policy mismatch
- **hosting or platform abuse:** exact URLs, response evidence, timestamps, hashes and the service under their control
- **SOC and incident response:** affected user, browser/proxy/DNS telemetry, credentials or approvals entered, downloads and containment actions
- **threat intelligence:** provenance, temporal scope, relationships, alternative explanations and confidence.

If credentials, card data, an authentication code or a transaction approval were supplied, collection is no longer the first priority. Contain the account through official channels. The [suspicious-SMS guide](/en/research/how-to-check-a-suspicious-sms-link-safely/#8-what-to-do-after-a-click) separates the response for a click, password, payment data, approval or installed file.

## Claims this evidence cannot support by itself

Cloaking evidence can show that two observers received different material and that a harmful page was associated with a route. By itself it cannot establish:

- how many people received or acted on the page
- that every visitor in a country saw the same result
- who created the advert, redirector, page or backend
- that an advertising, hosting or CDN provider was compromised
- that two campaigns share an operator because they use the same common service
- why a specific observer received a clean response
- whether the content will remain available tomorrow.

Use time-bounded language: "observed at", "reported by", "preserved response", "candidate relationship" and "not established". Those phrases make the report reusable after the infrastructure changes.

## Defender checklist

- [ ] Preserve the advert or message, account/Page context, time and exact entry URL privately.
- [ ] Create a defanged, redacted working copy before sharing.
- [ ] Record every redirect and response as a separate, sourced observation.
- [ ] Keep collection context with the screenshot, DOM, response and hashes.
- [ ] Distinguish a clean response from proof of safety.
- [ ] Distinguish conditional delivery from proof of the rule that caused it.
- [ ] Verify the claimed event through an independently reached official channel.
- [ ] Escalate credentials, payments, approvals or downloads to incident response immediately.
- [ ] Report only to parties that can act, using the evidence relevant to their layer.
- [ ] State unknowns, alternative explanations and the time boundary.

## Sources and further reading

1. [Google Search Central: spam policies, cloaking and sneaky redirects](https://developers.google.com/search/docs/essentials/spam-policies)
2. [RFC 9110: HTTP redirection semantics](https://www.rfc-editor.org/rfc/rfc9110.html#name-redirection-3xx)
3. [urlscan.io API documentation and scan-visibility guidance](https://urlscan.io/docs/api/)
4. [W3C: Fetch Metadata Request Headers](https://www.w3.org/TR/fetch-metadata/)
5. [Meta Help Center: tips for shopping safely](https://www.facebook.com/help/123884166448529/)
6. [HECAVEX: Facebook cloaking, fake news and investment-scam infrastructure](/en/research/when-fake-news-scams-and-cloaking-meet/)
7. [HECAVEX: Information factories on Lithuania's border](/en/research/information-factories-on-lithuanias-border/)
8. [HECAVEX: Infrastructure Pivoting 101](/en/research/infrastructure-pivoting-101/)

_This guide is defensive. It describes how to preserve and interpret evidence already available to an authorised investigator. It does not instruct readers to bypass access controls, reproduce a victim identity or evade platform review._
