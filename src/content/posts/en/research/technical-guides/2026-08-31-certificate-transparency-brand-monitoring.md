---
title: "Certificate Transparency Brand Monitoring Without Turning Matches Into Verdicts"
card_title: "Certificate Transparency Brand Monitoring"
description: "A practical design for monitoring brand-like certificate names: SAN parsing, IDN handling, explainable heuristics, false positives, bounded enrichment and a GitHub-only publication pipeline."
seo_title: "Certificate Transparency Brand Monitoring Guide"
seo_description: "Build explainable Certificate Transparency brand monitoring with SAN parsing, fuzzy and affix rules, IDN handling, false-positive controls and GitHub Actions."
seo_keywords:
  - "Certificate Transparency brand monitoring"
  - "CT log domain monitoring"
  - "CertStream phishing detection"
  - "brand impersonation domains"
  - "punycode phishing detection"
  - "GitHub Actions threat intelligence"
date: 2026-08-31 18:35:00 +0300
lang: en
translation_key: certificate-transparency-brand-monitoring
permalink: /en/research/certificate-transparency-brand-monitoring/
author: deividas-lis
content_type: technical-guide
publication_class: technical-assessment
confidence: high
tlp: clear
categories: [threat-intelligence, osint, tradecraft]
tags: [Certificate Transparency, infrastructure pivoting, CTI, OSINT, phishing, RDAP, DNS, threat hunting]
featured: false
draft: false
published: true
toc: true
comments: false
prose_width: wide
scope: "A defensive, explainable pipeline for finding certificate DNS names that may resemble monitored brands and publishing reviewable candidates using GitHub-hosted automation."
limitations: "Certificate Transparency does not cover domains without publicly logged certificates, does not prove that a hostname resolves or serves content, and does not determine malicious intent. GitHub Actions schedules are best-effort and cannot provide real-time monitoring guarantees."
methods:
  - "Certificate Transparency and IDNA standards review"
  - "SAN normalisation and heuristic design"
  - "False-positive and evidence-boundary modelling"
  - "GitHub-only publication architecture review"
evidence_basis: "RFC 9162, RFC 5280, RFC 5890, Unicode security guidance, the Certificate Transparency project and GitHub Actions documentation, applied to HECAVEX Radar's defensive publication model."
key_findings:
  - "A CT entry is evidence that a certificate or precertificate containing a DNS name was submitted to a public log. It is not proof of a live site, phishing or brand ownership."
  - "Useful monitoring starts with correct SAN parsing and IDN normalisation, then applies explainable exact, affix, token and fuzzy rules against a curated brand model."
  - "Observed certificate facts, computed similarities and analyst assessments should remain separate fields so a candidate can be audited and corrected."
  - "A GitHub-only monitor can publish valuable periodic snapshots, but workflow delay, dropped jobs and state handling must be visible rather than presented as continuous coverage."
image:
  path: /assets/img/posts/2026-08-31-certificate-transparency-brand-monitoring/certificate-transparency-brand-monitoring-hero-v2.webp
  social: /assets/img/social/certificate-transparency-brand-monitoring-en.png
  alt: "A Certificate Transparency pipeline converts public log entries into parsed SAN names, explainable brand matches and reviewable GitHub records"
  thumbnail: /assets/img/posts/2026-08-31-certificate-transparency-brand-monitoring/certificate-transparency-brand-monitoring-card-v2.webp
  width: 1600
  height: 900
---

## The certificate is an observation, not a maliciousness verdict

Certificate Transparency (CT) is valuable for discovering DNS names earlier than many content-based feeds. It is also easy to overstate. A certificate or precertificate containing `brand-support.example` in a public log tells us that this name appeared in submitted certificate material. It does not by itself tell us that the name resolves, that a website was deployed, that credentials were collected, that the named brand owns it, or that the applicant is malicious.

[RFC 9162](https://www.rfc-editor.org/rfc/rfc9162.html) defines CT as a system of publicly auditable, append-only logs for TLS certificate material. Logs accept and record entries. Monitors inspect those entries. Browsers and auditors can verify consistency. The log is therefore a source of certificate evidence, not a phishing detector.

That distinction should survive every stage of a monitoring pipeline:

| Layer | Defensible statement | Statement to avoid |
| --- | --- | --- |
| observed | a logged certificate entry contained this DNS name at this time | the domain was registered at the log timestamp |
| computed | the normalised name matched rule `brand-affix-v2` | the name is an impersonation domain |
| enriched | DNS or RDAP returned these values when queried | the infrastructure belongs to the threat actor |
| assessed | an analyst marked the candidate suspected, corroborated or dismissed with reasons | CT proved phishing |

This evidence contract is the core of [HECAVEX Radar](https://radar.hecavex.com/): every row is a lead, never a verdict. Monitoring becomes more useful when it explains why a candidate exists and less useful when one opaque score pretends to answer intent.

## What Certificate Transparency exposes

A CT entry can expose the certificate or precertificate, its log timestamp and the certificate fields submitted to the log. For brand monitoring, the most important input is normally the set of DNS names in the **Subject Alternative Name** extension. [RFC 5280 section 4.2.1.6](https://www.rfc-editor.org/rfc/rfc5280.html#section-4.2.1.6) defines the `dNSName` form used for host identities.

Useful recorded fields include:

- log identity and entry index or other stable log reference
- log timestamp
- certificate fingerprint when the final certificate is available
- issuing certification authority
- `notBefore` and `notAfter` validity values
- all DNS SAN values, not only the certificate subject/common name
- whether the material is a precertificate or final certificate
- the raw source reference needed to reproduce the observation.

One entry can contain a wildcard and many unrelated SAN names. One DNS name can appear in several logs and in repeated renewals. A monitor must therefore retain provenance while deduplicating publication records. "One message" is not necessarily one domain, and "ten log observations" are not necessarily ten separate campaigns.

A precertificate requires particular care. Under [RFC 9162 precertificate handling](https://www.rfc-editor.org/rfc/rfc9162.html#name-precertificates), a precertificate is constructed for logging before the corresponding final certificate is issued. The log observation proves submission of that precertificate material. It does not prove that a final certificate with an identical lifecycle was delivered to a subscriber or deployed on a server. Preserve `entry_type`, issuer information and the log reference instead of silently converting a precertificate event into a final-certificate claim.

### What CT does not expose

CT does not provide the registrant, current DNS answer, hosting account, webpage, redirect chain, JavaScript, credential receiver, victim count or operator identity. It does not establish when the underlying domain was registered. Certificate validity dates are not registration dates, and log timestamps are not proof of first use.

CT also misses important activity. A domain may have no TLS certificate, use a certificate not yet observed by the selected source, use an IP address, sit behind a compromised legitimate host, or appear only after a redirect. Conversely, a logged name may never resolve or may belong to a legitimate staging environment. Coverage must be described as sampled certificate visibility, not "all phishing domains".

## Logs, monitors and CertStream are different components

The [Certificate Transparency project](https://certificate.transparency.dev/howctworks/) separates append-only logs from monitors and auditors. A log records submitted material. A monitor watches logs for names or certificates of interest. A streaming service such as CertStream provides a convenient event interface over CT observations, but it is not itself the whole CT trust model and should not become the only recoverable source.

A resilient design records enough information to replay or backfill. Streaming collection can minimise delay, while a periodic bounded query can recover gaps. If a stream disconnects for eight minutes, the correct state is "collection gap" until backfill succeeds, not "zero matches". Health telemetry should therefore distinguish:

- workflow scheduled time and actual start time
- source connection time and expected listening window
- messages, certificates and DNS names processed
- parse failures and rejected records
- candidates produced
- cursor or checkpoint range covered
- last successful publication and last data change.

An empty result is healthy only when the expected input was processed successfully. A workflow that never connected is not a healthy empty collection.

![Certificate Transparency monitoring flow from a public log observation through normalisation, explainable matching and publication review](/assets/img/posts/2026-08-31-certificate-transparency-brand-monitoring/ct-observation-pipeline-en.svg)

*Figure: Each stage preserves its input, rule version and output so a reviewer can replay the candidate path.*

## Parse every SAN before matching

Matching the raw event string invites silent gaps and duplicates. Treat every certificate as a container, extract every `dNSName`, and normalise each candidate deterministically.

A practical normalisation sequence is:

1. preserve the raw SAN value exactly as observed
2. trim surrounding whitespace and a terminal root dot for comparison
3. lowercase the ASCII comparison form because DNS names are case-insensitive
4. remove only the leading wildcard marker `*.` into a separate `wildcard` field
5. convert internationalised labels into both their A-label and Unicode display forms
6. validate label and total-name lengths, but preserve invalid input as rejected evidence
7. derive the public suffix and registrable domain with a current Public Suffix List-aware library
8. deduplicate the normalised name within an entry, then across entries without losing source references.

Do not strip arbitrary punctuation, collapse every hyphen or concatenate all labels before retaining the original. Those transformations can be useful features, but they are not canonical hostnames. Store them as derived fields with a rule version.

### A concrete normalised observation

For an input SAN such as `*.XN--EXMPLE-CUA[.]example.`, a defensive parser should retain the raw value, remove only the comparison-only terminal dot and wildcard marker, decode IDNA through a standards-aware library, and derive the registrable boundary. A public record can be defanged for display while its machine field remains unambiguous.

```json
{
  "schema_version": "ct-observation/1.0",
  "raw_san": "*.XN--EXMPLE-CUA.example.",
  "wildcard": true,
  "a_label": "xn--exmple-cua.example",
  "u_label": "exämple.example",
  "registrable_domain": "xn--exmple-cua.example",
  "source": {
    "type": "precertificate",
    "log_id": "base64-log-id",
    "entry_index": 123456,
    "observed_at": "2026-08-31T15:00:00Z"
  },
  "normalizer_version": "idna-psl/3.2.0"
}
```

The example uses the reserved `.example` namespace. Production code should reject malformed IDNA conversions into a quarantine stream rather than repairing them silently. The rejected record still needs a source pointer, parser error and raw value so that a parser upgrade can replay it.

![Certificate name normalisation that keeps the raw SAN separate from derived IDNA forms and matching input](/assets/img/posts/2026-08-31-certificate-transparency-brand-monitoring/ct-name-normalization-en.svg)

*Figure: The raw certificate name remains immutable while comparison forms are derived and versioned.*

## IDN, Punycode and confusable characters need their own lane

[RFC 5890](https://www.rfc-editor.org/rfc/rfc5890.html) distinguishes the ASCII **A-label**, normally beginning with `xn--`, from the Unicode **U-label**. Store and compare both. Rendering only Unicode can hide the exact wire representation. Rendering only Punycode can hide a visual imitation that matters to a reviewer.

Unicode skeletons and confusable detection can identify names that resemble a protected label across scripts. However, [Unicode Technical Standard #39](https://www.unicode.org/reports/tr39/) describes multiple confusable classes and warns through its model that similarity checks are contextual. The [Unicode security FAQ](https://www.unicode.org/faq/security.html) also notes that confusable characters are only a small part of phishing. A simple ASCII name such as `brand-login-secure` may be more common than an elaborate homograph.

Use confusable matching as a reason for review, not as proof. Record the original U-label, A-label, skeleton, scripts present and exact rule that fired. Mixed-script and whole-script results deserve different explanations.

## Build a curated brand model before fuzzy matching

A brand is not one text string. A useful model contains:

- official registrable domains and known service subdomains
- canonical display name
- stable product names and accepted abbreviations
- high-risk words commonly combined with the brand, such as login, verify, support or payment
- tokens that are too generic to use alone
- known legitimate partners or delegated service domains
- language-specific forms where they are actually used
- explicit exclusions supported by repeated false-positive review.

Keep the official domains separate from matching tokens. An exact match to an official domain is often an inventory observation, not a phishing candidate. An official domain appearing as a left-hand subdomain beneath another registrable domain is very different: `bank.example.evil.invalid` is controlled at `evil.invalid`, not `bank.example`.

## Use explainable heuristic families

No single distance score should decide publication. Apply small, named rule families and retain their outputs.

### Exact and boundary-aware rules

- exact monitored registrable domain: expected inventory or unexpected certificate issuance for the real domain
- exact brand token as a label: `brand-login.example`
- official domain embedded before a different registrable boundary: `brand.example.verify.invalid`
- brand plus a high-risk action token: login, auth, secure, invoice, parcel or payment
- wildcard SAN covering a brand-like parent.

Boundary-aware tokenisation prevents `art` from matching every word containing those letters. Rules should know label, hyphen and registrable-domain boundaries rather than searching one flattened string.

### Affix and edit rules

Prefix/suffix forms catch names such as `mybrand`, `brand24` or `brand-support`. Damerau-Levenshtein distance can identify insertion, deletion, substitution and transposition, but thresholds should scale with label length. A distance of one is meaningful for a six-character distinctive name and almost meaningless for a two-character abbreviation.

Keyboard-adjacency and missing-character rules can be helpful when they state precisely what changed. Avoid generating enormous typo dictionaries and treating every result equally. Compute against observed names, preserve the matched canonical token and record the edit operations.

### Token and context rules

Generic words become useful in combinations. `secure-payment` alone may be ordinary. A distinctive monitored token plus `secure-payment`, a recent CT timestamp and a different registrable domain may deserve review. Scores can prioritise a queue, but the publication record should still list the contributing features rather than only "92/100".

### Score for ranking, never for truth

A score is useful when it orders analyst work and harmful when it is renamed probability without calibration. Keep the feature vector next to the score and treat thresholds as queue policy:

```yaml
candidate: brand-login.example
model_version: brand-model/2026-08-31
features:
  distinctive_label_exact: 35
  risky_action_token: 12
  different_registrable_domain: 20
  unicode_confusable: 0
  known_partner: -60
rank_score: 67
queue: analyst-review
verdict: null
```

Do not add values that describe the same fact twice. An exact token hit and its edit-distance-zero result are correlated. Either collapse them into one feature family or document the cap. Calibrate the queue against reviewed data by brand and language, not one global collection of convenient examples. Measure precision at the review budget, false-positive rate for each rule, time to review and the share of true cases missed by retrospective tests. A score of 90 has no probabilistic meaning unless the system has been calibrated and monitored as a probability model.

### False-positive tests belong beside the rules

Each brand definition should ship with positive and negative fixtures. Tests must cover registrable boundaries, short brands, partners, dictionary collisions, Unicode forms and renewal duplicates.

```yaml
tests:
  - name: brand token under foreign registrable domain
    input: login-brand.example
    expect_rules: [distinctive-label, risky-action]
  - name: official domain inventory event
    input: auth.brand.example
    expect_state: official-inventory
  - name: unrelated dictionary word
    input: art-gallery.example
    monitored_token: art
    expect_rules: []
  - name: approved service provider
    input: brand.partner.example
    expect_state: known-partner
  - name: repeated certificate renewal
    input: login-brand.example
    expect_new_candidate: false
    expect_new_observation: true
```

Run the fixture set whenever the Public Suffix List, IDNA library, brand model or matching code changes. A rule release should fail closed for publication if its negative fixtures regress, while still retaining raw observations for later replay.

## False positives are part of the product

Brand monitoring will find legitimate resellers, fan sites, affiliates, suppliers, documentation, security testing, staging systems and unrelated dictionary words. Shared hosting certificates can contain many customer names. Certificate renewals can resurface a dismissed name. A CA can log a precertificate for an issuance that is later abandoned.

Handle this with state, not deletion:

- **observed:** the logged fact is retained
- **suspected:** naming signals justify review but no independent corroboration exists
- **corroborated:** an additional public source supports the phishing or impersonation assessment
- **dismissed:** evidence supports a legitimate or irrelevant explanation
- **expired/unresolved:** current DNS state changed, while the historic observation remains
- **retracted:** a published assessment was wrong and the correction is visible.

Suppressions should be narrow, versioned and expiring where possible. "Ignore everything on this hosting provider" destroys coverage. "Suppress this exact partner domain until the contract review date" is inspectable.

### Separate observation dedupe from candidate state

Use different identifiers for the raw event and the analytical candidate. A raw observation key can combine log identity and entry index. A certificate key can use a DER fingerprint where a final certificate is available. A DNS candidate key should normally use the normalised A-label plus the monitored brand model, not the current IP address.

This separation allows a renewal or second log to append evidence to the same candidate without pretending that nothing changed. State transitions should be append-only events such as `first_observed`, `reobserved`, `corroborated`, `dismissed`, `dns_changed` and `retracted`. Rebuilding the current snapshot from those events should yield the same result as the published snapshot. If it does not, the publication is not reproducible.

![Candidate state model separating observed, suspected, corroborated, dismissed and retracted assessments](/assets/img/posts/2026-08-31-certificate-transparency-brand-monitoring/ct-publication-state-en.svg)

*Figure: The historical observation remains available when the current assessment changes or is corrected.*

## Enrichment adds context, not ownership

After a naming match, bounded enrichment can collect DNS answers, nameservers, RDAP registration data, certificate chains, autonomous system context and already-public scan observations. Each source has its own timestamp and limitations. Absence from a reputation service is not a clean verdict. Lack of an RDAP registrant is not evidence of concealment. A Cloudflare address is not the origin server.

Do not automatically visit every candidate from a personal or production network. A fresh remote scan contacts the target and may publish the URL. Unique query values can identify a recipient. Apply the OPSEC ladder described in [Infrastructure Pivoting 101](/en/research/infrastructure-pivoting-101/): begin with existing public records, separate third-party lookup from active scanning, and escalate only with authorisation and a defined evidence need.

The [Hostinger Pages investigation](/en/research/hostinger-pages-phishing-infrastructure/) demonstrates why exact document and JavaScript observations are stronger than a brand-like name alone. The [UNIPARK smishing investigation](/en/research/unipark-smishing-campaign-infrastructure/) similarly moved from one message to hash-linked infrastructure while preserving the boundary between shared artefacts and operator attribution.

## A GitHub-only monitoring and publication architecture

A no-VPS deployment can still be useful when it is designed as a periodic publication system rather than pretending to be a continuous sensor.

```text
scheduled/manual workflow
  → bounded CT input or replayable stream window
  → schema validation and SAN normalisation
  → versioned brand rules
  → candidate scoring and deduplication
  → bounded passive enrichment
  → immutable raw observation + public sanitised record
  → tests, snapshot build and static deployment
```

Keep configuration, schemas, brand definitions and publication code in the repository. Store a checkpoint that can be reviewed and recovered, such as the last covered source range and a compact deduplication index. Raw observations can be retained as release assets or a data branch if repository size permits. The public site should contain only sanitised fields. Never commit API secrets or recipient-specific URLs.

The workflow should have:

- `workflow_dispatch` for manual recovery and bounded backfill
- a schedule away from the top of the hour
- explicit timeouts and concurrency so overlapping collectors do not corrupt state
- least-privilege `permissions`, separating read/analysis from the small job that writes publication data
- pinned action revisions and dependency lockfiles
- schema, duplicate, link and build tests before deployment
- a no-change path that records collection health without creating noisy commits
- a visible stale state when collection or publication misses its expected window
- deterministic output so replaying the same input produces the same public record.

A minimal workflow skeleton makes the trust boundary explicit. The collection job reads public input and uploads an immutable intermediate artefact. A later job validates deterministic output before receiving write permission. Pin third-party actions to full commit SHAs in production rather than floating tags.

```yaml
name: ct-monitor
on:
  schedule:
    - cron: "17,47 * * * *"
  workflow_dispatch:
    inputs:
      from_cursor:
        required: false
permissions:
  contents: read
concurrency:
  group: ct-monitor
  cancel-in-progress: false
jobs:
  collect:
    timeout-minutes: 12
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@FULL_COMMIT_SHA
      - run: npm ci --ignore-scripts
      - run: npm run ct:collect -- --from "${{ inputs.from_cursor }}"
      - run: npm run ct:test-and-build
      - uses: actions/upload-artifact@FULL_COMMIT_SHA
        with:
          name: ct-publication
          path: out/
  publish:
    needs: collect
    permissions:
      contents: write
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@FULL_COMMIT_SHA
        with:
          name: ct-publication
      - run: ./scripts/publish-validated-output.sh
```

Do not execute strings derived from certificate names as shell code, paths, template fragments or workflow expressions. Treat every CT field as hostile input. Constrain output filenames to internal identifiers, validate JSON against a schema, cap certificate and SAN counts, and reject control characters before rendering. The write-enabled job should consume only a validated artefact and should not fetch or execute candidate-controlled content.

For reproducibility, record the source cursor range, source response hash, dependency lockfile hash, ruleset commit, normalizer version and build timestamp. A manual backfill using the same input range and versions should reproduce the same candidate IDs and rule outputs. Time-dependent enrichment must carry its own observation time and should not be allowed to rewrite the historical CT fact.

[GitHub's workflow-event documentation](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule) states that scheduled workflows can be delayed during high load and queued jobs may be dropped, particularly around the start of the hour. The shortest interval is five minutes, schedules run from the latest default branch, and public-repository schedules can be disabled after 60 days without repository activity. Therefore `cron` time is an intention, not evidence that collection ran.

Publish both `scheduled_at` and `started_at`, plus input counts, covered source range, last successful attempt and data-change time. A user can then distinguish stale automation from a valid empty result. Use a manual backfill job to recover a known range after failure rather than merely restarting "now".

## Publication fields that make a candidate auditable

At minimum, a record should retain:

- stable candidate ID and schema version
- raw and normalised DNS name, wildcard flag, A-label and U-label
- CT log/source reference, observation time, issuer and certificate fingerprint where available
- official brand model and version used
- every triggered rule with inputs and computed values
- enrichment facts with independent observation timestamps
- assessment state, confidence, reason and reviewer or automated-source label
- first-seen, last-seen and publication timestamps
- corrections, retractions and prior state.

Publicly display the safe hostname in defanged form where accidental navigation is a concern, while offering machine-readable data that remains syntactically unambiguous. Do not silently overwrite historic states. A candidate disappearing from today's DNS is a timeline event, not proof that it was malicious or that the threat is gone.

## A practical review order

Prioritise candidates that combine a distinctive brand match with a different registrable domain, risky action tokens, recent certificate activity and corroborating public evidence. Deprioritise known official domains, exact partners and generic-token matches. Review the registrable boundary before the page design. Confirm timestamps before claiming "new". Separate shared infrastructure from ownership. Record what would falsify the assessment.

CT monitoring is strongest as an early naming sensor feeding disciplined analysis. It is weakest when "certificate contains brand" is published as "phishing domain". Correct parsing, explicit rules, visible automation health and an evidence-aware review process turn a noisy public feed into defensible threat intelligence.

## Official standards and documentation

- [RFC 9162: Certificate Transparency Version 2.0](https://www.rfc-editor.org/rfc/rfc9162.html)
- [RFC 5280: Subject Alternative Name](https://www.rfc-editor.org/rfc/rfc5280.html#section-4.2.1.6)
- [Certificate Transparency: how CT works](https://certificate.transparency.dev/howctworks/)
- [Certificate Transparency: known logs](https://certificate.transparency.dev/logs/)
- [Certificate Transparency: monitoring](https://certificate.transparency.dev/monitors/)
- [RFC 5890: IDNA definitions](https://www.rfc-editor.org/rfc/rfc5890.html)
- [Unicode Technical Standard #39: Unicode Security Mechanisms](https://www.unicode.org/reports/tr39/)
- [GitHub Actions: scheduled workflow events](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule)
