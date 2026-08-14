---
title: "OSINT Is Collection. CTI Is Decision Support."
card_title: "OSINT and CTI Are Not the Same Job"
date: 2023-10-18 14:00:00 +0300
last_modified_at: 2026-08-14 12:00:00 +0300
lang: en
translation_key: cti-osint-duo-001
categories: [threat-intelligence, osint]
image:
  path: /assets/img/posts/2023-10-18-cti-osint/1_img.png
  alt: "Illustration accompanying an analysis of OSINT and CTI workflows"
description: Why open-source collection and cyber threat intelligence are complementary disciplines, and how to turn public information into a defensible security decision.
tags: [osint, cti, intelligence-requirements, analysis]
author: deividas-lis
content_type: commentary
confidence: high
tlp: clear
featured: false
draft: false
comments: false
toc: true
---

OSINT and cyber threat intelligence are often placed in the same sentence as if they were interchangeable. They are not.

OSINT is a collection discipline. It provides methods for finding, preserving and evaluating information from publicly and commercially available sources. CTI is a decision-support function. It combines relevant evidence, including but not limited to OSINT, to reduce uncertainty for a specific security decision.

That distinction is not academic. It determines whether a team produces intelligence or an expensive pile of links.

## Collection starts with a requirement

"Monitor ransomware" is not an intelligence requirement. It has no protected asset, decision, time horizon or threshold for action.

A more useful requirement would be:

> Which ransomware groups have demonstrated the capability and intent to target European logistics organizations using technology present in our environment during the next 90 days?

Now collection has boundaries. The analyst can search public reporting, leak sites, malware repositories, vulnerability exploitation records and infrastructure data. Internal teams can contribute asset inventory, exposure, telemetry and incident history.

OSINT helps acquire external evidence. It does not decide what that evidence means for the organization.

## The CTI transformation

Consider a report that an organization in the same sector was compromised through a known vulnerability. Copying the CVE and threat-actor name into a feed is information movement. Intelligence work asks different questions:

- Is the affected product deployed here and externally reachable?
- Is the vulnerable function enabled in our build?
- Was exploitation observed before or after a patch became available?
- Does the actor target our sector, region or technology stack?
- Which behaviours can be hunted in our telemetry now?
- What decision changes if the assessment is correct?

The external report supplies a lead. Asset context, telemetry and operational ownership determine whether it becomes a priority.

## Where OSINT provides leverage

Strong open-source work can expose:

- aliases and relationships between publicly reported intrusion sets
- domains, certificates, hosting patterns and reused web content
- malware capabilities and delivery paths documented by multiple researchers
- targeting patterns visible in victim disclosures and legal records
- vulnerability exploitation timelines
- narratives and distribution infrastructure used in influence operations

It also creates traps. Vendor naming systems overlap imperfectly. Public indicators age quickly. A copied claim can appear independent after being repeated by ten sites. Search visibility favours what is popular and indexable, not what is representative.

An analyst needs collection skill and source scepticism in equal measure.

## Internal evidence changes the answer

Public reporting may say a technique is trending. Internal telemetry may show the relevant product is not deployed. A threat actor may target the sector globally while the organization's specific exposure remains low. Conversely, a weak external signal can become urgent when authentication logs, endpoint behaviour and network evidence align with it.

This is why a commercial feed, an OSINT search and a CTI product are not synonyms. The product should explain what was observed, what is reported, what is assessed, how confident the assessment is and what decision it supports.

## A practical workflow

```text
decision
→ intelligence requirement
→ collection plan
→ OSINT and internal collection
→ source and evidence evaluation
→ analysis of alternatives
→ assessment with confidence
→ action, feedback and review
```

The feedback step is frequently missing. If the consumer did not act, the analyst should ask whether the assessment arrived too late, lacked specificity or answered the wrong question. More collection is not automatically the cure.

## What good output looks like

A useful CTI assessment should make four things visible:

1. **What changed.** The new observation or development.
2. **Why it matters here.** The connection to assets, identity, technology or business exposure.
3. **How certain the assessment is.** Evidence quality, consistency, gaps and alternatives.
4. **What decision is available.** Patch, hunt, monitor, restrict, communicate or accept.

Indicators can support that output. They should not become the entire output.

## My position

A CTI analyst should be competent in OSINT because independent collection and verification reduce dependence on vendor summaries. But OSINT skill alone does not make the work intelligence. The job is finished only when collected information is evaluated in context and reduces uncertainty for someone who can act.

The useful pairing is therefore not a "dynamic duo" of tools. It is a disciplined chain from question to evidence to decision. Break any link and the team is either searching without purpose or assessing without facts.
