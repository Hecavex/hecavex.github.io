---
layout: page
lang: en
translation_key: analytical-methodology
title: Evidence and attribution framework
description: How HECAVEX separates observations, inferences and assessments, evaluates sources, handles infrastructure overlap, assigns confidence and corrects analytical conclusions.
permalink: /en/methodology/
last_modified_at: 2026-08-21 22:30:00 +0300
---

HECAVEX publishes research from incomplete, time-bound and often adversarial public information. This framework explains how that material is converted into an assessment. It is not a claim that public sources can answer every intelligence question.

## Four kinds of statement

Every material conclusion should be traceable to one of four statement types:

| Type | Meaning | Example |
| --- | --- | --- |
| Observation | Something directly present in collected evidence | A response archived at a stated time has a stated SHA-256 hash. |
| Reported fact | A claim made by an identified external source | A vendor states that it contained an incident at a stated time. |
| Inference | A relationship derived from one or more observations | Two pages downloaded a byte-identical script during the observed period. |
| Assessment | An analytical judgement that answers an intelligence question | The available evidence is consistent with shared campaign infrastructure. |

Reported facts are attributed to their source. An inference does not become an observation merely because it appears likely. An assessment should state its confidence and meaningful alternatives.

## Source reliability and information credibility

Source reliability and information credibility are evaluated separately. A generally reliable publisher can still make a weakly supported individual claim. A previously unknown source can provide authentic primary evidence.

HECAVEX considers:

- proximity to the event or evidence
- access to relevant telemetry
- authenticity and integrity of the material
- independence from other cited sources
- past reliability where it can be established
- whether the claim can be reproduced or corroborated
- incentives, conflicts and plausible bias

Primary technical evidence is preferred, but no source class is automatically correct.

## Confidence

- **High:** authoritative primary evidence or multiple independent, mutually reinforcing signals support the assessment. Material alternatives have been considered and are substantially less likely.
- **Moderate:** credible evidence supports the assessment, but an important collection gap or plausible alternative remains.
- **Low:** the assessment is plausible and relevant enough to record, but rests on limited, indirect or weakly discriminating evidence.

Confidence describes evidential strength, not impact, urgency or probability that an indicator is currently malicious.

## Infrastructure and code overlap

An IP address, certificate, analytics identifier, registrar, nameserver, hosting provider or code fragment is not sufficient on its own to attribute activity to an operator. Shared services, resale, compromised infrastructure, copied kits and coincidental reuse create false links.

Stronger relationships normally combine several of the following:

- rare or exact code similarity with compatible deployment context
- repeated infrastructure patterns across time
- matching configurations, paths, parameters or operator workflow
- consistent targeting and lure design
- temporally coherent observations
- corroborating passive DNS, certificate or registration history
- independently reported victim or incident telemetry

Every graph edge should distinguish a direct observation from an analytical relationship.

## Actor and cluster naming

HECAVEX may assign a temporary analytical label to a set of related observations so the research can discuss it consistently. Such a label is not a declaration of a new threat actor.

Named-actor attribution requires substantially more than shared commodity tooling or infrastructure. When HECAVEX records a vendor or government attribution, the original source, wording and confidence boundary are preserved. Conflicting naming systems are not silently collapsed.

## Indicator lifecycle

Indicators are time-bound observations. Cloud IP addresses, hosting, domains and shared services can change ownership or purpose. Published indicator sets should therefore include, where available:

- first and last observed times
- the indicator's role
- source and collection method
- confidence
- current, expired, revoked, benign-comparison or unknown status
- a warning when an indicator is unsuitable for permanent blocking

## Alternative hypotheses and limitations

Major investigations state what the evidence does not prove. Relevant alternative explanations are retained until evidence makes them unreasonable. Absence of evidence is not treated as evidence of absence when collection visibility is incomplete.

## Reproducibility and preservation

Where publication is safe and lawful, research releases include machine-readable observations, evidence hashes, source references, reproduction notes and a change history. Dangerous payloads, credentials, personal data and material that would create disproportionate harm are excluded or neutralised.

## Corrections and reassessment

New evidence can raise or lower confidence, split a cluster, invalidate an indicator or change an attribution. Material changes are dated in the article or research release and recorded on the [corrections page](/en/corrections/). Quietly replacing a conclusion is not an acceptable correction process.

This framework should be read together with the [editorial standards](/en/editorial/) and the [shared intelligence glossary](/en/glossary/), which defines how the same terms are applied across Research, Radar, APT Notes and Labs.
