---
title: "Lithuania Phishing Infrastructure: Radar's August 2026 Baseline"
card_title: "Radar's August 2026 Phishing-Infrastructure Baseline"
description: "A coverage-aware baseline of 130 Lithuanian brand-impersonation candidates, their evidence tiers, collection health, and analytical limits."
seo_title: "Lithuania Phishing Infrastructure: August 2026 Radar Baseline"
seo_description: "HECAVEX Radar's August 2026 baseline: 130 Lithuanian brand-impersonation candidates, evidence tiers, collection coverage, and limitations."
seo_keywords:
  - "Lithuania phishing infrastructure"
  - "Lithuanian phishing domains"
  - "brand impersonation monitoring Lithuania"
  - "HECAVEX Radar"
  - "phishing domain monitoring"
  - "Certificate Transparency Lithuania"
date: 2026-08-31 18:40:00 +0300
lang: en
translation_key: lithuania-phishing-infrastructure-radar-2026-08
permalink: /en/research/lithuania-phishing-infrastructure-radar-august-2026/
author: deividas-lis
content_type: technical-analysis
publication_class: primary-research
confidence: moderate
tlp: clear
categories: [threat-intelligence, investigations, fraud-scams, osint]
tags: [phishing, Lithuania, HECAVEX Radar, brand impersonation, Certificate Transparency, URLScan, measurement, data quality]
featured: false
draft: false
published: true
toc: true
comments: false
prose_width: wide
scope: "A descriptive baseline of the deduplicated public HECAVEX Radar candidate view and aggregate collection-health record at the 30 August 2026 cutoff."
limitations: "Radar is a sampled discovery system. The snapshot has no completed analyst reviews and incomplete listening coverage, so it cannot estimate phishing prevalence, victim impact, recall, or candidate precision."
methods:
  - "Deterministic aggregation of the public Radar snapshot"
  - "Source and evidence-tier comparison"
  - "Coverage-aware collection-health review"
  - "Reproducible snapshot hashing"
evidence_basis: "The public radar.json and pipeline-health.json snapshots generated on 30 August 2026, plus the reviewed Radar brand registry and published methodology."
research_bundle: /assets/data/radar-august-2026-baseline/README.md
key_findings:
  - "The cutoff contained 130 deduplicated current candidates across 18 of 46 registry brands. The distribution describes this heuristic view, not Lithuanian phishing prevalence."
  - "Only two records were corroborated under the snapshot's evidence-tier rules, while 128 were name-only candidates and none had completed analyst review."
  - "CertStream supplied most records, but 24-hour listening coverage was 62.78% and seven-day coverage was 31.18%, making raw daily counts unsuitable for trend or rate claims."
  - "The baseline is operationally useful as a discovery queue when source, time, reason codes, evidence tier, freshness and review state remain visible beside every count."
image:
  path: /assets/img/posts/2026-08-31-radar-august-baseline/radar-august-baseline-hero.svg
  social: /assets/img/social/lithuania-phishing-infrastructure-radar-2026-08-en.png
  alt: "Coverage-aware HECAVEX Radar August 2026 baseline with candidate, brand, evidence, review, and collection-health counts"
  thumbnail: /assets/img/posts/2026-08-31-radar-august-baseline/radar-august-baseline-hero.svg
  width: 1600
  height: 900
---

## A baseline, not a league table of who is being attacked

At the cutoff on **30 August 2026 at 17:20:26 UTC**, the current public [HECAVEX Radar](https://radar.hecavex.com/) view contained **130 deduplicated candidates** associated by its matching rules with **18 of the 46 brands** in the reviewed registry. Two records met the snapshot's corroborated evidence tier. The remaining 128 were name-only candidates. None had completed analyst review.

Those four sentences are the useful result and the necessary warning. Radar is designed to find things worth looking at: recently observed domain names, public web observations and a small number of locally reviewed records that may be relevant to Lithuanian brand impersonation. A candidate is not automatically a phishing site. A count is not a victim count. A brand with more matches is not necessarily being attacked more often than a brand with fewer matches.

This publication establishes a reproducible August baseline before later reports attempt comparisons. It places collection coverage, source bias, evidence level, review state and retention beside the headline figures. Without those fields, a dashboard number is decoration. With them, it can become a defensible research queue.

<aside class="hx-callout warning"><strong>Do not read this as prevalence.</strong>The snapshot cannot tell us what share of phishing in Lithuania Radar observed, how many people encountered a page, whether credentials were submitted, who operated the infrastructure or how much harm occurred. Absence from Radar is not evidence that a URL is safe.</aside>

The publication-safe [aggregate summary and source hashes](/assets/data/radar-august-2026-baseline/README.md) are available separately. The live Radar datasets continue to change after this cutoff.

## What the August snapshot actually measured

The unit is a **deduplicated current candidate record** in Radar, not a certificate, DNS name, scan, incident or campaign. One candidate can retain evidence from more than one source. That is why the source inventory—122 CertStream records, nine URLScan records and one HECAVEX record—must not simply be added and presented as 132 separate domains.

| Field at the cutoff | Value | Defensible interpretation |
| --- | ---: | --- |
| current candidates | 130 | records retained by the current public heuristic and publication rules |
| unique domains | 130 | one current record per normalized domain in this snapshot |
| registry brands | 46 | public, reviewed starting scope. Explicitly non-exhaustive |
| represented brands | 18 | brands with at least one current candidate |
| name-only evidence | 128 | discovery rests on domain-name context rather than corroborating public content |
| corroborated evidence | 2 | more than a name-only match under the snapshot's evidence-tier rules |
| reviewed records | 0 | no completed human review from which precision can be estimated |
| records with hosting context | 8 | limited public host or network context was retained |
| records with screenshot/reference | 9 | an associated public observation was available |
| records with hash evidence | 5 | a response or artefact hash was retained |

![Three evidence tiers showing 128 name-only candidates, two corroborated records, and no completed analyst reviews](/assets/img/posts/2026-08-31-radar-august-baseline/radar-evidence-profile-en.svg)

*Figure 1. The dataset is broadest at discovery and narrowest where evidence is strongest. The diagram reports record state at the cutoff, not a maliciousness probability.*

The ratios make the evidence gap easier to audit. Corroborated records represented **1.54%** of the current view. Records with a public screenshot or source reference represented **6.92%**, hosting context **6.15%**, and retained hash evidence **3.85%**. These categories overlap and therefore must not be summed. More importantly, 0 completed reviews means the dataset has no labelled sample from which to calculate observed precision, false-positive rate, sensitivity, or specificity.

This creates two separate engineering questions. **Ranking quality** asks whether the highest-priority rows are more useful to analysts than lower-priority rows. **Classification quality** asks how often a final decision is correct against reviewed ground truth. Radar currently exposes enough data to inspect the first question. It does not yet have the reviewed denominator needed for the second. A future quality report should therefore publish a stratified review sample across brands, score bands, reason codes, sources, and evidence tiers instead of reviewing only the most obvious rows.

Every current row had the status `suspected`. That label represents workflow state, not a conclusion that all 130 domains were malicious. Radar's [methodology](https://radar.hecavex.com/methodology/) and [dataset contract](https://radar.hecavex.com/dataset/) make the separation deliberate: collection creates leads, enrichment adds context, and explicit analyst review is required for a reviewed assessment.

The distinction also explains why a score cannot substitute for a verdict. Match scores ranged from 85 to 100, with a mean of 95.47. They express strength under the matching heuristic. They do not represent an 85–100% probability of phishing, expected loss, or analyst confidence.

## Brand distribution: a property of the detector and the window

The 130 records were distributed as follows:

| Potential brand | Candidates | Potential brand | Candidates |
| --- | ---: | --- | ---: |
| DHL | 53 | DPD | 4 |
| Revolut | 17 | Smart-ID | 4 |
| Telia | 9 | Bitė | 4 |
| Vinted | 9 | MAXIMA | 4 |
| VMI | 6 | Tele2 | 3 |
| Swedbank | 3 | ESO | 3 |
| SEB | 3 | ERGO | 2 |
| Luminor | 2 | Bigbank | 2 |
| Artea | 1 | BTA | 1 |

![Five brand-associated candidate counts at the August cutoff, led by DHL and Revolut](/assets/img/posts/2026-08-31-radar-august-baseline/radar-brand-distribution-en.svg)

*Figure 2. Candidate concentration in the retained view. These are detector matches associated with potential brands, not measured attack, victim, or campaign shares.*

The visually obvious finding is DHL's 53 candidates. The analytically correct finding is narrower: **DHL-associated name patterns were particularly common in this retained snapshot**. Several alternative explanations remain open. The campaign volume may genuinely have been higher. The registered terms may match a productive naming template. A burst of automatically created domains may inflate one family. The retention window may preserve one campaign longer than another. Another brand may be impersonated through compromised sites, social-media pages, URL shorteners, IP addresses or words outside the registry and therefore appear less often.

DHL accounted for **40.77%** of retained candidates. The four largest groups, DHL, Revolut, Telia, and Vinted, accounted for **88 of 130 records, or 67.69%**. That concentration is useful for allocating enrichment work because a small number of naming families can consume most of the queue. It is not enough to claim campaign prevalence. A single automated naming template can create many certificate names while one high-impact campaign on compromised legitimate sites can contribute none.

The [Radar brand registry](https://radar.hecavex.com/brands/) is a public starting scope, not a census of every Lithuanian organisation. Its 46 records contain official domains and recognised names used to reduce obvious collisions. A detector cannot find a term it was never asked to observe, and a domain-name detector cannot see a brand that appears only in page content. Comparing brand totals without discussing registry and source design would turn collection bias into a false market ranking.

## Two corroborated records and 128 reasons to preserve uncertainty

The two corroborated records were `wildcard[.]revolut-account[.]com` and `revolut-casino-online[.]cz`. Both retained CertStream and URLScan context. Their presence in two source paths makes them more inspectable than a name-only lead, but even multi-source observation is not universal proof of a malicious page.

For example, a certificate observation establishes that a name appeared in Certificate Transparency data. A URLScan result can establish what that public scanning session requested and received at a particular time. It does not establish that every visitor received the same response, that a form was submitted, that credentials were collected, or that the certificate subscriber and page operator are the same person.

Reason codes reveal why candidates entered the queue. The most common were suspicious context, a TLD differing from an official domain, an exact brand token and multiple hyphens. Joined affixes, split tokens, Punycode and Unicode-confusable signals appeared less often. These are useful routing clues. They are also common sources of false positives:

- a reseller, review site or local business may use a brand word legitimately
- a brand name may also be a dictionary word, surname or unrelated acronym
- defensive, journalistic and abuse-reporting pages can contain suspicious-looking terms
- internationalized names and unusual TLDs are not inherently malicious
- an inactive or parked domain can look concerning without serving phishing content
- compromised legitimate infrastructure may serve phishing while its hostname looks ordinary.

Radar therefore needs a review queue, not a green/red oracle. At the cutoff, **129 records were unreviewed and one needed review**. Review coverage was 0%, so no observed precision estimate was available. "130 candidates" is valid. "130 phishing domains" would not be.

## Collection health changes what daily counts mean

The latest CertStream attempt listened for the expected 480 seconds and processed 147,776 messages containing 237,041 DNS names. It produced one match and one new archive record. That is useful operational telemetry because an empty or small result can then be distinguished from a collector that did not run.

The broader window was incomplete:

| Window | Healthy attempts | Listening coverage | Matches | New archive records |
| --- | ---: | ---: | ---: | ---: |
| preceding 24 hours | 113 | 62.78% | 80 | 47 |
| preceding 7 days | 405 | 31.18% | 208 | 125 |

![Comparison of CertStream, URLScan, and local review coverage at the August cutoff](/assets/img/posts/2026-08-31-radar-august-baseline/radar-source-coverage-en.svg)

*Figure 3. Each source answers a different question. Certificate-name observation, public page observation, and analyst review cannot be collapsed into one generic "coverage" percentage.*

Coverage is the proportion of expected listening time represented by successful attempts, not the share of the global certificate ecosystem observed. A 31.18% seven-day value means that raw day-to-day candidate counts cannot be treated as a stable rate. An increase can reflect more matching names, better collector uptime, timing of certificate issuance, source recovery or several of those factors together.

The sparse `lastSeen` distribution was four candidates on 21 August, two on the 22nd, one on the 23rd, three on the 25th, 15 on the 27th, 24 on the 28th, 41 on the 29th and 40 on the 30th. Missing dates do not mean "no phishing". This is a current-view distribution over retained rows, not a complete daily event series, and the collection health was uneven.

URLScan contributed nine current records. Its checkpoint covered 65 queries: 64 complete and one partial or backlogged. URLScan is a public-observation source with its own submission population and visibility limits. It is not a random sample of the web. The crt.sh search path ended in a provider timeout at the health cutoff. CertStream itself remained healthy, which is precisely why source states should be reported separately rather than collapsed into one "sync succeeded" badge.

## What can and cannot be inferred from the window

### Supported observations

- the public snapshot contained 130 deduplicated current candidates at the stated cutoff
- 18 registry brands were represented, with the displayed candidate distribution
- the majority of records entered through CertStream-derived discovery
- only two records met the snapshot's corroborated tier
- analyst review had not yet produced a measurable precision sample
- collection coverage was incomplete and source health differed by path.

### Reasonable assessments

- delivery, financial, telecommunications, marketplace and public-service themes remain productive priorities for Lithuanian impersonation monitoring
- name-only discovery is useful for early triage but needs disproportionately strong false-positive controls
- multi-source enrichment should be prioritised for high-volume clusters before any external claim is made
- future comparisons should normalise or at least display listening coverage and registry changes.

### Unsupported conclusions

- DHL received 40.8% of Lithuanian phishing attacks
- 130 incidents, campaigns or victims existed
- the two corroborated records were operated by the same actor
- a missing brand had no phishing exposure
- a domain absent from Radar was safe
- the August daily sequence proves an upward trend.

This evidence ladder follows the same principle used in the [UNIPARK smishing infrastructure investigation](/en/research/unipark-smishing-campaign-infrastructure/) and the [Hostinger Pages phishing-kit investigation](/en/research/hostinger-pages-phishing-infrastructure/): observations, derived relationships and attribution claims need separate proof. Radar can supply discovery leads to an investigation. The dashboard does not inherit the investigation's conclusions in reverse.

## How defenders can use this baseline

For a brand owner, the most useful workflow is not to block all 130 rows. It is to compare candidates with official domains, customer-facing names, current campaigns and internal telemetry. Then prioritise records with public content, response hashes, suspicious hosting, recent registration or user reports. A legal or abuse workflow should preserve exact URLs and evidence privately while publishing only defanged, necessary material.

For a SOC, Radar can enrich a report or seed a retrospective search. A matching hostname in DNS, proxy, email, SMS-reporting or identity logs is stronger than the public candidate alone. The incident question then becomes concrete: which user received it, what resolved, what response was returned, what data was entered, and what authentication or payment event followed?

For researchers and journalists, the [change record](https://radar.hecavex.com/changes/) is preferable to screenshots of a mutable homepage. It distinguishes first publication, later observation, status change and retraction. Detailed events are retained for 30 days and daily summaries for 730 days. That supports bounded chronology without pretending the current list preserves every historical state forever.

For ordinary recipients, Radar is not a substitute for the [safe suspicious-SMS workflow](/en/research/how-to-check-a-suspicious-sms-link-safely/). Do not visit a candidate merely because it appears in a research index. Verify the claimed event through the organisation's official application or independently typed website. If banking or authentication data was already entered, use the [post-phishing emergency response guide](/en/research/what-to-do-after-entering-banking-details-on-phishing-page/) rather than continuing to investigate the link.

## Reproducibility and the next comparison

The derived [summary JSON](/assets/data/radar-august-2026-baseline/summary.json) records the values used here, their definitions, the cutoff, retention, source-health fields and SHA-256 hashes of the two local source artifacts. The source `radar.json` was 113,912 bytes with SHA-256 `dcce36b0…83cce2`. `pipeline-health.json` was 4,604 bytes with SHA-256 `28063e26…057d7`. The complete hashes remain in the bundle.

A later baseline should compare like with like:

1. freeze a named cutoff and hash the inputs
2. disclose brand-registry additions or rule changes
3. show listening coverage and provider failures beside counts
4. separate current candidates, new events and retained history
5. report evidence tiers and analyst-review coverage
6. publish correction or retraction effects
7. avoid rates until the denominator and observation process are stable.

The August result is therefore not "Lithuania had 130 phishing domains". It is more modest and more useful: **a sampled, coverage-aware discovery system retained 130 review candidates, most with name-only evidence, at a reproducible cutoff**. That is enough to guide enrichment and future measurement. It is not enough to manufacture certainty.

For the next baseline, four quality measures would add more value than a larger headline count:

- **review yield by score band**, calculated as reviewed malicious or policy-relevant records divided by all reviewed records in that band
- **time to enrichment**, measured from first observation to the first independent public-content, network, or analyst evidence
- **duplicate-family pressure**, reporting both record count and clustered naming-template count so one generator does not masquerade as many unrelated campaigns
- **coverage-normalised event density**, published only for windows that meet a declared minimum listening threshold and always accompanied by the observed listening denominator.

## Sources and data

- [HECAVEX Radar overview](https://radar.hecavex.com/)
- [Radar methodology and publication boundaries](https://radar.hecavex.com/methodology/)
- [Radar dataset contract](https://radar.hecavex.com/dataset/)
- [Radar brand registry](https://radar.hecavex.com/brands/)
- [Radar public change record](https://radar.hecavex.com/changes/)
- [Publication-safe aggregate and provenance bundle](/assets/data/radar-august-2026-baseline/README.md)
