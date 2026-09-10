---
layout: page
lang: en
translation_key: corrections
title: Corrections
last_modified_at: 2026-09-10
description: HECAVEX corrections and update policy.
permalink: /en/corrections/
---

Material corrections are documented in the affected article's update history. Minor spelling or formatting changes may be corrected without an entry. Evidence that changes an assessment will be identified clearly, with the date and nature of the revision.

## Adform executable examples

**10 September 2026 · article 1.1 → 1.2.** The English [Adform investigation](/en/research/adform-supply-chain-crypto-clipper/#threat-hunting-where-to-look) lost mandatory separators in its KQL and Suricata examples. They have been restored. Both editions now include [the same versioned code](/assets/detections/adform/v1.0.0/README.md), with separate syntax, engine and operational-validation boundaries. Replace copied English examples. Incident counts, payload findings and attribution have not changed.

The native Suricata check also found missing continuation characters in the multiline rule in both editions. Those are now present in the shared source. Replace copied multiline rules from either edition, not only the English one. The seven synthetic cases are documented with the code, including a benign-intent case that still alerts.

## Labs browser-storage disclosure

**10 September 2026 · privacy notice dated 23 August → 10 September.** [Privacy](/en/privacy/#cookies-and-browser-storage) no longer describes the removed Labs readiness workspace as current. Transient filters, deliberate links and file downloads are distinct from localStorage. Legacy values may remain in an older browser. No automatic deletion or new data collection is claimed.

## Hostinger package integrity

**7 September 2026 · package 1.1.0 → 1.1.1.** The [Hostinger investigation](/en/research/hostinger-pages-phishing-infrastructure/#public-research-artifacts) links a [packaging correction](/assets/data/hostinger-pages-phishing-2026/CORRECTION.md). The old manifest hashed CRLF working-copy bytes while Git delivered LF bytes. Use the corrected canonical package for verified downloads. The domain observations and attribution did not change. Historical bytes remain preserved.

## Radar August baseline replay boundary

**7 September 2026 · original baseline retained.** The [baseline article](/en/research/lithuania-phishing-infrastructure-radar-august-2026/) and [bundle clarification](/assets/data/radar-august-2026-baseline/README.md) distinguish recovered, hash-matched input files from a complete tested aggregation replay. The original aggregate values remain unchanged. Do not describe the entire baseline as independently replayed from a retained command.
