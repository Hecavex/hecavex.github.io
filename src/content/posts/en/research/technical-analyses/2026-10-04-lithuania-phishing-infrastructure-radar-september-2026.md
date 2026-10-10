---
title: "Phishing-Infrastructure Monitoring in Lithuania: Radar's September 2026 Baseline"
card_title: "Radar's September Baseline: Collection Recovery and the Review Gap"
description: "September Radar data: 447 observed candidates, improved collection continuity, and a review gap that still limits defensive conclusions."
seo_title: "Lithuania Phishing Monitoring: Radar September 2026"
seo_description: "447 September Radar candidates, collection recovery and the remaining review gap. Reproducible aggregates with explicit evidence and timing limits."
seo_keywords:
  - "Lithuania phishing monitoring"
  - "HECAVEX Radar September 2026"
  - "brand impersonation monitoring"
  - "Certificate Transparency coverage"
date: 2026-10-04 21:45:00 +0300
last_reviewed_at: 2026-10-04 21:45:00 +0300
lang: en
translation_key: lithuania-phishing-infrastructure-radar-2026-09
permalink: /en/research/lithuania-phishing-infrastructure-radar-september-2026/
author: deividas-lis
content_type: technical-analysis
publication_class: primary-research
confidence: moderate
tlp: clear
categories: [threat-intelligence, investigations, fraud-scams, osint]
tags: [phishing, Lithuania, HECAVEX Radar, brand impersonation, Certificate Transparency, measurement, data quality]
featured: false
draft: false
published: true
toc: true
comments: false
prose_width: wide
research_version: "1.0"
research_status: published
scope: "Retrospective aggregation of retained Radar source-history events with observation timestamps from 1 September inclusive to 1 October 2026 exclusive, frozen in the 1 October release. Collection telemetry and the separate current snapshot are analysed with their own denominators."
limitations: "Sampled, policy-dependent discovery is not phishing prevalence, victim impact or detection recall. Historical events do not retain a complete evidence-tier timeline. No exported completed analyst reviews support an estimate of classification precision. The October snapshot is not the September cohort."
methods:
  - "Immutable Git input selection and SHA-256 verification"
  - "UTC-bounded event aggregation and candidate-ID deduplication"
  - "Recorded CertStream-attempt comparison with the configured collection plan"
  - "Conservative listening-time bounds and separate snapshot evidence assessment"
evidence_basis: "Thirty September daily history partitions and generated public aggregates at Radar data revision 3d80a765404f50afbe50c3dc49472751a2e13b65, published by generator revision 33075e4ca3fb5ab223fab61a92125bb2c797e2f5. The frozen release was generated on 1 October 2026 at 00:40:26.566 UTC."
research_bundle: /assets/data/radar-september-2026-baseline/README.md
key_findings:
  - "September's retained source-history events contain 447 distinct candidate IDs across 30 registry brands. Adding daily unique counts produces 508 signal-days, not 508 different candidates."
  - "There were 2,419 recorded CertStream attempts against a plan of 2,880. Bounded listening covered approximately 44.791–44.795% of September's wall-clock time, against a planned 53.333% ceiling."
  - "Recorded attempts rose from 513 of 960 planned attempts on 1–10 September to 1,906 of 1,920 on 11–30 September. This supports an operational recovery finding, not an estimate of changes in criminal activity."
  - "The separate 1 October snapshot retained 105 name-only candidates, with no exported completed analyst reviews. Its evidence state cannot be assigned retrospectively to all 447 September candidates."
image:
  path: /assets/img/posts/2026-10-04-radar-september-baseline/radar-september-baseline-hero-v2.webp
  thumbnail: /assets/img/posts/2026-10-04-radar-september-baseline/radar-september-baseline-card-v2.webp
  alt: "A symbolic observation ring receiving certificate documents, with a separate queue of retained records awaiting review."
  presentation: illustration
  source_type: generated
  provenance_id: lithuania-phishing-infrastructure-radar-2026-09-cover-generated-v2
  width: 1600
  height: 900
  thumbnail_width: 720
  thumbnail_height: 405
---

## What September actually established

HECAVEX Radar's retained September history contains **447 distinct candidate IDs associated with 30 registry brands**. Collection became substantially more consistent after the first ten days. The stronger conclusion is operational: the system recorded more of its intended listening schedule. The data does not establish that phishing grew, that 447 malicious sites existed, or that every candidate targeted Lithuania.

This is a retrospective analysis published on 4 October. The observation window is **1 September 2026, 00:00 UTC, to 1 October, 00:00 UTC, excluding the endpoint**. Inputs are frozen at the release generated on **1 October at 00:40:26.566 UTC**. All 30 September daily archive partitions were present. That gives a reproducible retained record, not uninterrupted collection or an exhaustive view of threats. Counts and calculation inputs are preserved in the [September aggregate bundle](/assets/data/radar-september-2026-baseline/README.md).

## Three populations that should not be confused

| Measure | Count | Meaning |
| --- | ---: | --- |
| Distinct September candidate IDs | 447 | Deduplicated across the month's retained source-history observations |
| Sum of daily unique candidates | 508 | Candidate-days, including candidates appearing on more than one date |
| IDs with a retained first-publication transition in the window | 437 | First-publication-marked history, not proven domain registrations |
| Other observed candidate IDs | 10 | Previously known candidates represented in September |
| Retained source-history events | 950 | 513 observation records and 437 first-publication transitions |
| Separate current snapshot | 105 | The later retained view at the 1 October release |

These measures answer different questions. Adding daily unique counts double-counts a candidate that returns on another day. Adding observation and transition events counts different records about the same candidate. Neither calculation produces an incident count. In particular, subtracting 437 from 513 does not reconstruct the separately defined published reobservation metric. The [bundle's definitions and aggregates](/assets/data/radar-september-2026-baseline/summary.json) keep these quantities separate.

The history uses a candidate identity based on the normalized host. A first-publication transition carries the source observation boundary in `observedAt`, rather than a verified deployment or registration time. These timestamps cannot establish when an operator acquired a domain or when a victim first encountered it. The [pinned history contract](https://github.com/Hecavex/radar.hecavex.com/blob/33075e4ca3fb5ab223fab61a92125bb2c797e2f5/docs/HISTORY.md) also distinguishes retained history from a current-policy publication view.

The [August baseline](/en/research/lithuania-phishing-infrastructure-radar-august-2026/) counted 130 current candidates at a 30 August cutoff. Comparing that stock with September's 447 month-wide IDs would mix populations. A percentage-growth headline would therefore be misleading, even if both arithmetic totals were correct.

## Collection recovered, but the plan was never continuous

| UTC period | Recorded / planned attempts | Ratio to planned count | Wall-clock listening, conservative lower bound |
| --- | ---: | ---: | ---: |
| 1–10 September | 513 / 960 | 53.44% | 28.50% |
| 11–30 September | 1,906 / 1,920 | 99.27% | 52.94% |
| Full September | 2,419 / 2,880 | 83.99% | 44.79% |

The configured CertStream plan was an eight-minute listening window every fifteen minutes. Even perfectly executing it would cover **53.33% of wall-clock time**, not the whole day. September's bounded listening total was **1,160,977.181–1,161,090.024 seconds**, approximately **44.791–44.795%** of the month's 720 hours. These are listening-time bounds, not the percentage of relevant certificates detected. [Calculation record](/assets/data/radar-september-2026-baseline/summary.json).

All 2,419 retained CertStream attempt records report a healthy outcome: 2,001 returned no matching candidates and 418 returned matches. A healthy empty attempt is evidence of successful processing without a heuristic match. A missing attempt is different. This record does not prove that every possible failed launch was captured, and the attempt ratio alone does not prove attendance in distinct scheduled slots.

The [10 September recovery note](https://github.com/Hecavex/radar.hecavex.com/blob/33075e4ca3fb5ab223fab61a92125bb2c797e2f5/docs/COLLECTION-RECOVERY-2026-09-10.md) documents a relay defect: a duplicate completion event could cancel a valid waiting handoff before being skipped itself. Moving concurrency control to the admitted job addressed that failure. The later attempt record supports recovery over the remaining twenty days. It does not restore the missed September listening windows.

Counting also needs version control. A 7 September correction changed reobservation counting. A separate 10 September correction replaced sum-and-cap coverage with conservative interval bounds. Those bounds account for clipping and possible overlap without inventing reconnect timestamps. This report uses the pinned release's recorded methods, not percentages copied from older screenshots. [Method-change record](https://github.com/Hecavex/radar.hecavex.com/blob/33075e4ca3fb5ab223fab61a92125bb2c797e2f5/docs/TRENDS-CORRECTIONS.md).

## Brand concentration describes matching, not victim impact

| Registry brand | Distinct September candidates |
| --- | ---: |
| DHL | 79 |
| Revolut | 62 |
| Tele2 | 42 |
| Lidl Lietuva | 33 |
| Bitė | 30 |
| Vinted | 24 |
| SEB | 20 |
| DPD | 18 |
| ESO | 16 |
| MAXIMA | 15 |

These are the ten largest groups in the [monthly brand aggregate](/assets/data/radar-september-2026-baseline/brands.csv). The first five account for 246 of 447 candidates, or 55.03%. That is useful for distributing investigation work. It is not a ranking of organisational compromise, customer losses or successful impersonation.

Several explanations can produce concentration: productive naming templates, repeated certificate activity, the monitored vocabulary and genuine campaigns. This aggregate does not distinguish them. A useful next investigation would test whether many hosts share a page template or collection endpoint, rather than assuming that many matching names mean many independent operations.

All 447 candidates' September observations carry only the `CertStream` source label. That label does not resolve live-stream versus indexed-CT discovery lineage. It also does not demonstrate a month-long outage of other providers. Registry relevance is not proof of Lithuanian targeting. The [pinned data contract](https://github.com/Hecavex/radar.hecavex.com/blob/33075e4ca3fb5ab223fab61a92125bb2c797e2f5/docs/DATA-CONTRACT.md) keeps provider, discovery lineage and geographical relevance separate.

## Review remains the limiting step

The separate snapshot at the October release contained **105 name-only candidates**: 104 unreviewed and one marked as needing review. There were no exported completed analyst reviews supporting a precision estimate. Its source split was 104 CertStream and one HECAVEX record, covering 20 registry brands. [Snapshot aggregate](/assets/data/radar-september-2026-baseline/summary.json).

Only 103 of those IDs overlap the September cohort. The other two are an October observation and an older HECAVEX record. More importantly, the snapshot's evidence state is not a historical label for all 447 monthly candidates. Retained event rows do not provide a complete evidence-tier timeline. Saying all September candidates were name-only would therefore overstate what was reconstructed.

The practical gap is measurable without manufacturing a verdict. Collection produces candidates. Independent evidence and bounded analyst decisions are still needed before measuring classification quality. No exported review is not proof that a candidate is benign, nor proof that private investigation never occurred. It means this public record cannot support the missing conclusion.

## A frozen aggregate, not a screenshot of a moving dashboard

The [article evidence bundle](/assets/data/radar-september-2026-baseline/README.md) pins data revision `3d80a765404f50afbe50c3dc49472751a2e13b65` and generator revision `33075e4ca3fb5ab223fab61a92125bb2c797e2f5`. It records input identities, the UTC filter, aggregate definitions and the replay procedure. Discovery counts are reconstructed from daily history. Coverage aggregates the already-published method-2 bounds, without claiming to reconstruct every connection from raw worker logs. Public outputs are aggregate measurements, not a new candidate inventory or a copy of a private database.

This distinction matters when using [Radar Trends](https://radar.hecavex.com/trends/). Retention, corrections and current publication policy can change later projections. A later download is not automatically the same September evidence. Use the frozen package for this article, and the live [dataset guide](https://radar.hecavex.com/dataset/) and [methodology](https://radar.hecavex.com/methodology/) for current operational behaviour.

## Defensive work this record can support

For a brand-protection team, start with its own candidate group and exclude authorised domains, legitimate references and duplicates before escalating. Retain why a candidate matched. A certificate-name lead without page evidence should not inherit the language of a confirmed credential-harvesting incident.

For a SOC, compare candidate observations with relevant internal DNS, proxy, email or identity records under existing handling rules. An internal encounter changes the investigation question: which user received the lure, what resolved, what response was delivered and whether authentication or payment activity followed. Do not turn the whole monthly population into an automatic blocklist.

For the next review batch, sample across brands and collection periods, not only the most obvious names. Record the selection rule, inspected evidence, uncertainty and disposition. Report the reviewed denominator alongside any yield, and keep unavailable evidence separate from a negative finding. That would make a later precision statement auditable. Publishing another larger candidate count would not.
