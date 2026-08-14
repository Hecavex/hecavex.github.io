---
title: "Advanced Search for OSINT: A Reproducible Query Method"
card_title: "Advanced Search for OSINT"
date: 2023-10-12 14:00:00 +0300
last_modified_at: 2026-08-14 12:00:00 +0300
lang: en
translation_key: google-dorking-001
categories: [osint, tradecraft]
image:
  path: /assets/img/posts/2023-10-11-google-dorking/main/1_img.png
  alt: "Google search interface illustrating advanced OSINT queries"
description: A practical method for building, recording and validating advanced search queries during OSINT and cyber threat intelligence investigations.
tags: [osint, search, tradecraft, evidence]
author: deividas-lis
content_type: technical-guide
confidence: high
tlp: clear
featured: false
draft: false
comments: false
toc: true
research_version: "2.0"
research_status: updated
key_findings:
  - Advanced search is most useful when a broad research question is decomposed into entities, source boundaries, document types and time windows.
  - Search results are leads rather than evidence until the underlying page is opened, preserved and assessed in context.
  - Operator support, ranking and result counts change over time, so a defensible workflow records the query, engine, date and retrieved source.
scope: Public-web discovery using mainstream search operators for lawful OSINT and CTI collection.
limitations: Search engines expose an incomplete and changing index. An absent result does not establish that the material or relationship does not exist.
updates:
  - date: 2026-08-14
    note: Rewritten as a reproducible OSINT collection method with a search log, evidence-preservation guidance and current operator limitations.
---

## Search is a collection method, not a magic trick

Advanced search is often introduced as a list of "Google dorks". That is useful for remembering syntax and not much else. In an investigation, the real skill is turning a vague question into a sequence of small, testable queries and keeping enough records to explain how a result was found.

The same method works for threat actors, malware reports, exposed documentation, corporate records, infrastructure references and historical mentions. The search engine is only one collection surface.

## Start with a research question

Suppose the question is: *What credible public reporting described Rhysida ransomware activity against healthcare organizations during a defined period?*

Break it into components before writing a query:

- entities and aliases: `Rhysida`, possible campaign or malware names
- sector language: `healthcare`, `hospital`, `medical`
- source boundaries: government, vendor, victim notification or reputable reporting
- format: advisory, PDF report, incident notice
- time: publication or observation window

A first query can stay broad:

```text
"Rhysida" (healthcare OR hospital OR medical)
```

Then constrain one dimension at a time:

```text
site:cisa.gov "Rhysida"
```

```text
filetype:pdf "Rhysida" (healthcare OR hospital)
```

```text
"Rhysida" after:2024-01-01 before:2025-01-01
```

This sequencing matters. If five operators are added immediately and the query returns nothing, it is difficult to know which condition removed the useful results.

## Operators that carry most of the workload

### Exact phrases

```text
"unique error message"
```

Exact phrases are useful for malware strings, copied scam text, policy language and distinctive code. They are also brittle. A punctuation change or different translation can hide an otherwise relevant match.

### Source boundaries

```text
site:example.org "search phrase"
```

Use `site:` to search one domain or a domain suffix. Multiple domains can be grouped:

```text
(site:cisa.gov OR site:ncsc.gov.uk OR site:cert.europa.eu) "product name"
```

### Document types

```text
filetype:pdf "campaign name"
```

```text
(filetype:pdf OR filetype:docx OR filetype:pptx) "organization name"
```

Document searches are productive for advisories, presentations, procurement material and accidentally indexed files. A public result is not automatic permission to redistribute personal or sensitive information.

### Title, URL and page text

```text
intitle:"incident report"
```

```text
inurl:advisories "CVE-2026"
```

```text
intext:"distinctive infrastructure string"
```

These operators can reduce noise, but their behaviour is not perfectly consistent across engines.

### Date boundaries

```text
"campaign name" after:2026-01-01 before:2026-08-01
```

Date filters help collection. They do not guarantee the page was first published in that window because search engines can infer or replace dates.

## A defensible search log

For any result that may support a publication or intelligence assessment, record at least:

| Field | What to preserve |
|---|---|
| Research question | The decision or hypothesis being investigated |
| Query | The exact string submitted |
| Engine | Google, Bing or another index |
| Search time | Timestamp and timezone |
| Result URL | The underlying page, not only the result page |
| Retrieval | Local copy, archive reference or screenshot where lawful |
| Assessment | Why the source is relevant and how reliable it appears |

Search-result counts should rarely be treated as measurements. They fluctuate, can be approximate and often collapse after pagination. If a claim depends on a count, collect and deduplicate the actual records.

## From result to evidence

A result becomes useful only after the source is examined. Check who published it, when it was published, whether it cites primary material, whether the page has changed and whether independent evidence corroborates the claim.

![Google results before narrowing the query](/assets/img/posts/2023-10-11-google-dorking/blog_images/2_img.png)

![Google results with advanced search operators](/assets/img/posts/2023-10-11-google-dorking/blog_images/3_img.png)

![Google results narrowed to two matches](/assets/img/posts/2023-10-11-google-dorking/blog_images/4_img.png)

The screenshots show the practical effect of narrowing a query. The number displayed by the engine is not the finding. The retrieved and assessed documents are.

## Common failure modes

- **Over-constraining too early.** Useful synonyms and sources disappear before the analyst sees them.
- **Treating ranking as credibility.** The first result is optimized for relevance, not evidential quality.
- **Confusing absence with non-existence.** Index coverage, language, robots rules and dynamic pages create blind spots.
- **Using stale operators.** Search features change. The retired Google cache link is a good example. Use web archives directly when historical material is required.
- **Collecting without a question.** A folder full of links is not intelligence.
- **Ignoring safety.** Suspicious results should be handled through an isolated research workflow, not opened casually on a production workstation.

## Practical query pattern

For repeatable work, build queries in this order:

```text
entity or distinctive phrase
→ add alias or synonym
→ restrict source when needed
→ restrict format when needed
→ apply time boundary
→ retrieve and assess the source
→ record negative and positive results
```

Advanced search is simple to start and difficult to use rigorously. The operators take minutes to learn. The professional part is knowing what question each query tests, what the index cannot show and what must be preserved before the result can support an assessment.
