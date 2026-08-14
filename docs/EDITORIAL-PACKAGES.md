# Publication format

Not every HECAVEX post is research. A short opinion should not pretend to have the same evidential weight as an infrastructure investigation, and a weekly briefing should not look like a finished attribution assessment.

The site therefore uses four publication classes:

| Class | Used for |
|---|---|
| Primary research | Investigations and malware analysis based on collected or examined evidence |
| Technical assessment | Incident analysis, technical analysis and practitioner guides |
| Commentary | Opinions, publication notes and shorter threat notes |
| Signal Brief | Time-bounded weekly or fortnightly security briefings |

The folder normally sets the class. `content_type` gives the more specific label shown to readers.

## Minimum record for research

Primary research and technical assessments need:

- a stable `translation_key`
- a version and review date
- findings that are narrower than the evidence supporting them
- a clear scope and limitations section
- a short description of the evidence and methods used
- source links close to the claims they support
- a correction or update entry when a conclusion materially changes

A typical front matter block looks like this:

```yaml
title: "Precise title"
description: "What was examined and why the result matters."
date: YYYY-MM-DD HH:MM:SS +0300
last_modified_at: YYYY-MM-DD HH:MM:SS +0300
last_reviewed_at: YYYY-MM-DD HH:MM:SS +0300
lang: en
translation_key: stable-bilingual-key
categories: [investigations, threat-intelligence]
tags: [specific, useful, terms]
author: deividas-lis
content_type: investigation
confidence: moderate
tlp: clear
research_version: "1.0"
research_status: published
evidence_basis: "What was collected or reviewed."
methods: [static analysis, passive DNS, source validation]
```

Folder defaults fill in the usual values, but a case-specific description is better whenever the work differs from the default.

## Artefacts

Link a separate artefact package only when there is something useful to release, such as a dataset, sanitized sample metadata, a graph export or reproducible code. Do not create an empty archive so the article looks more serious. If all the evidence is already in the article, the publication record says so.

For a release with several files, use `research_artifacts` and label each item. `research_bundle` remains available for a single release page.

## Updates

Correct quiet formatting mistakes normally. When a source, finding, confidence level or conclusion changes, update `last_modified_at`, increase `research_version` and add a short entry to `updates` explaining what changed. Readers should not have to compare Git commits to discover that an assessment moved.

English and Lithuanian versions keep the same `translation_key`, but each language can have its own review date and update wording.
