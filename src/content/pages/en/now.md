---
layout: page
lang: en
translation_key: current-research-focus
title: Current Research Focus
description: What Deividas Lis is currently researching and publishing through HECAVEX.
permalink: /en/now/
last_modified_at: 2026-09-10
---

This is the working research agenda behind HECAVEX. It shows where I am currently spending attention, not a list of services or a promise to publish on a fixed deadline.

## Current lines of inquiry

- **Web and advertising supply-chain compromise.** Malicious JavaScript, third-party delivery paths, browser-side manipulation and the evidence needed to distinguish exposure from confirmed impact.
- **Fraud and phishing infrastructure.** Redirect chains, cloaking, related domains, hosting patterns and the operational systems that sit behind a single visible scam page.
- **Identity-centred intrusion.** Session theft, MFA bypass, social engineering and the point where a technically valid control stops being a complete security strategy.
- **Information operations.** The infrastructure, amplification mechanisms and increasingly AI-assisted workflows supporting influence activity around Lithuania and Europe.
- **Threat-actor knowledge.** Source-specific actor, campaign, malware and technique records maintained through [APT Notes](https://apt.hecavex.com/).

## Questions guiding the next investigation

These three working requirements make the broad themes above testable. They describe the intended reader and decision, not a promise of continuous coverage or a claim that representative readers have already validated the agenda.

### When does a browser supply-chain observation justify local incident scoping?

For defenders responsible for web exposure, the decision is which hosts, responses and dates to investigate before claiming compromise. I need retained response hashes, delivery paths, browser constraints and evidence separating exposure from execution and impact. [Adform](/en/research/adform-supply-chain-crypto-clipper/) supplies the worked example. Public scans and retained artifacts can bound a hypothesis, but cannot establish a visitor's execution or loss. Reassess when new response bytes, an affected-time correction or authorized local telemetry changes that boundary. This does not provide real-time victim monitoring.

### Which infrastructure link deserves the next analyst action?

For fraud investigators and CTI analysts, the decision is which pivot to pursue without treating shared infrastructure as common ownership. I need time-aligned observations, exact content matches, redirect evidence and plausible commodity-service alternatives. [UNIPARK](/en/research/unipark-smishing-campaign-infrastructure/) and [Hostinger](/en/research/hostinger-pages-phishing-infrastructure/) anchor the question. The [offline consumer adapter](/assets/reuse/investigation-consumer/v1.0.0/README.md) retains roles and unknown dates rather than exporting a universal block list. Reassess when a provider lifecycle change, contradictory evidence or a source gap weakens the link. Private attribution and population-wide phishing prevalence are outside this evidence base.

### What telemetry could distinguish an identity-attack hypothesis from a legitimate flow?

For detection engineers and identity owners, the decision is whether a proposed hunt can be tested on the available fields before deployment. I need explicit connector/native-field assumptions, harmless positive and negative examples, missing-data cases and named-engine results. [The Evilginx investigation](/en/research/evilginx-detection/) separates the attack explanation from experimental analytics. A portable fixture model is not a native query-engine pass or production efficacy evidence. Reassess when the connector, native schema or authentication flow changes. No claim of comprehensive AiTM detection follows from one rule.

Reader feedback on a concrete decision or missing source is welcome through [Contact](/en/contact/). It may change these requirements, but is not published as an endorsement.

## Publishing rhythm

HECAVEX publishes substantial investigations when the evidence is ready. [Signal Briefs](/en/briefings/) provide shorter prioritised updates, while APT Notes records structured changes to threat-actor knowledge. This page is reviewed as the research agenda changes.

For a curated introduction, visit the [Research index](/en/research/). Journalists and event organisers can use the [Speaking and media page](/en/speaker/).
