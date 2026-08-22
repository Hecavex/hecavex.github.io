---
title: "Analytical Confidence Is a Field, Not a Feeling"
card_title: "Confidence Is a Field"
description: "How HECAVEX separates source reliability, evidence strength and analytical confidence without using a label to hide uncertainty."
date: 2026-08-01 13:00:00 +0300
last_modified_at: 2026-08-14 12:00:00 +0300
lang: en
translation_key: confidence-method-001
categories: [tradecraft]
tags: [analysis, confidence, methodology]
author: deividas-lis
content_type: threat-note
confidence: high
tlp: clear
featured: false
draft: false
toc: true
comments: false
image:
  path: /assets/img/posts/hecavex-editorial/confidence-field.svg
  social: /assets/img/social/confidence-method-001-en.png
  alt: "Analytical confidence plotted as evidence bands on a calibrated field"
  thumbnail: /assets/img/posts/hecavex-editorial/confidence-field.svg
---

Analytical confidence describes how well the available evidence supports an assessment. It does not describe how strongly an analyst likes the conclusion, how serious the topic sounds or how many times the same claim has been repeated.

HECAVEX uses low, moderate and high confidence when a label adds useful context. The label is never a substitute for showing the evidence, assumptions, alternatives and gaps behind it.

## Three questions that should not be collapsed

Analysts frequently compress different judgements into one confidence word:

1. **How reliable is the source?** Does it have access, competence and a history of accurate reporting?
2. **How credible is the information?** Is this particular claim direct, internally consistent and corroborated?
3. **How strongly does the evidence support the assessment?** Are plausible alternatives still open?

A normally reliable source can publish a weakly supported claim. An unknown source can provide an artefact that is independently verified. Several articles can appear to corroborate one another while all citing the same original report.

Counting sources without tracing provenance creates confidence theatre.

## Observation is not attribution

A precise indicator can be high-confidence evidence that a domain served a particular script at a recorded time. The same observation may support only low-confidence attribution to an operator.

Shared hosting, compromised infrastructure, resold phishing kits, copied code and deliberate imitation create overlap without common control. Correlation begins the next question. It does not automatically answer who did it.

<aside class="hx-callout"><strong>Analyst note</strong>Be specific about the object of confidence. "High confidence" in the payload behaviour and "low confidence" in the actor attribution can both be true.</aside>

## How the labels are used

**High confidence** means multiple strong and consistent pieces of evidence support the assessment, important alternatives have been considered and remaining gaps are unlikely to reverse the main conclusion.

**Moderate confidence** means the assessment is supported and useful, but material evidence gaps, source limitations or plausible alternatives remain.

**Low confidence** means the assessment is tentative. Evidence may be fragmentary, indirectly reported, difficult to corroborate or compatible with several explanations.

Low confidence does not mean useless. It means the consumer should understand the risk of acting as if the claim were settled.

## What changes confidence

Confidence can increase through independent corroboration, first-party artefacts, reproducible technical observations and evidence that rules out competing explanations. It can decrease when a source retracts a claim, infrastructure is shown to be shared, timestamps conflict or the assumed causal chain cannot be reproduced.

That is why HECAVEX publications include scope, limitations, methods and revision history. A conclusion should be capable of changing without pretending the earlier evidence never existed.

## The practical test

Before assigning a label, the analyst should be able to finish this sentence:

> I have **[confidence level]** confidence that **[specific assessment]** because **[strongest evidence]**, while **[main gap or alternative]** remains.

If the sentence cannot be completed without vague language, the problem is probably not the label. The assessment itself needs more work.
