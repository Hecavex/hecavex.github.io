---
title: "Infrastructure Pivoting for CTI: DNS, URLScan, TLS and Hashes"
card_title: "Infrastructure Pivoting with DNS, URLScan and Hashes"
description: "A practical CTI guide to pivoting across DNS, RDAP, URLScan, TLS, JavaScript hashes and timelines without turning correlations into unsupported attribution."
seo_title: "CTI Infrastructure Pivoting: DNS, URLScan and Hashes"
seo_keywords:
  - "phishing infrastructure pivoting"
  - "URLScan hash pivoting"
  - "DNS and RDAP pivots"
  - "Certificate Transparency monitoring"
  - "CTI threat hunting"
date: 2026-08-13 18:00:00 +0300
last_modified_at: 2026-08-14 16:00:00 +0300
lang: en
translation_key: infrastructure-pivoting-101-unipark
permalink: /en/research/infrastructure-pivoting-101/
author: deividas-lis
content_type: technical-guide
confidence: high
tlp: clear
categories: [threat-intelligence, investigations, fraud-scams]
tags: [infrastructure pivoting, CTI, OSINT, OPSEC, active reconnaissance, phishing, malware research, URLScan, RDAP, DNS, Certificate Transparency, threat hunting]
featured: false
draft: false
toc: true
comments: false
scope: "Original, vendor-neutral CTI pivoting training material demonstrated with the August 2026 UNIPARK smishing case and public data preserved at the time."
limitations: "This is not a guide to active vulnerability scanning, testing third-party systems, executing malware or attributing activity from a single technical characteristic."
key_findings:
- "Pivoting begins with an intelligence requirement and a hypothesis, not a search box in a preferred portal."
- "Every graph edge needs a type, provenance, time and evidence. A search result is not a relationship until the analyst explains what it connects."
- "Candidate discovery, relationship confirmation, cluster membership and attribution are four distinct analytical levels."
- "An exact content hash can establish a strong deployment relationship, but cannot by itself prove a common operator when a kit may be sold or shared."
- "OpenPhish, URLhaus and MalwareBazaar are supporting sources for specific pivots. They are not automatic conclusions and this guide never downloads or detonates malware."
- "Authorised active reconnaissance can validate deployment and service relationships, but requires separate scope, rules of engagement, OPSEC, deconfliction and abort conditions."
image:
  path: /assets/img/posts/2026-08-13-pivoting-101/pivoting-101-hero.svg
  social: /assets/img/social/infrastructure-pivoting-101-unipark-en.png
  alt: "A CTI pivoting cycle from an intelligence requirement and seed through confirmed relationships, a cluster and reporting"
  thumbnail: /assets/img/posts/2026-08-13-pivoting-101/pivoting-101-hero.svg
  width: 1600
  height: 900
---

## Pivoting is not IOC multiplication

The [UNIPARK smishing investigation](/en/research/unipark-smishing-campaign-infrastructure/) began with one SMS URL:

```text
hxxps://unipark[.]fmqr[.]ink/com
```

Public data eventually connected 163 scan records, 126 unique hosts, several parking brands and a reused web kit. No portal supplied a "find the bad guys" button. Providers supplied observations. The relationships between them still had to be demonstrated.

Professional pivoting is a controlled analytical cycle:

```text
decision need
  -> intelligence requirement
  -> seed qualification
  -> hypothesis
  -> discriminating pivot
  -> collection
  -> evidence preservation
  -> relationship assessment
  -> competing explanation
  -> confidence update
  -> next pivot or stop
```

Putting a domain into several portals is enrichment. Enrichment is useful, but it is not the complete practice of pivoting.

This guide is written for CTI, incident-response, fraud, malware and security-research analysts. It is original and vendor-neutral. Interfaces change. Analytical discipline should survive longer than a free API tier.

For a shorter conceptual introduction, start with [why one scam domain is rarely alone](/en/research/one-scam-domain-is-rarely-alone/). The [Hostinger phishing-kit investigation](/en/research/hostinger-pages-phishing-infrastructure/) demonstrates an exact-hash and deployment-name pivot at larger scale, while [HECAVEX Radar](https://radar.hecavex.com/) keeps automated discovery separate from analytical conclusions.

![Hypothesis-led CTI pivoting cycle from an intelligence requirement to a decision or a justified stop](/assets/img/posts/2026-08-13-pivoting-101/analytical-control-loop.svg)

## 1. Begin with the decision the intelligence must support

A senior analyst does not first ask, "What else can I find?" The first question is, "What decision must this investigation support?"

| Decision need | Intelligence requirement | Minimum useful result |
| --- | --- | --- |
| block an active campaign | which hosts and URLs currently share the confirmed deployment | timestamped IOCs with confidence and expiry |
| expand incident scope | which objects relate to the seed during the organisation's telemetry window | confirmed and probable objects with relationship reasons |
| support takedown | who hosts and registers active objects, and through which abuse channels | evidence package, providers, registrar and observation times |
| produce a strategic assessment | is this one lure, a distributed kit or a sustained campaign | temporal and behavioural pattern plus alternatives |
| connect malware delivery | where was the same payload or loader distributed | exact hashes, delivery URLs and first/last seen |

### Bound the requirement

Record at least:

```yaml
pir: Which objects shared the same UNIPARK phishing deployment between 2026-07-15 and 2026-08-13?
decision: Blocking, scope expansion and public research
deadline: 2026-08-14T12:00:00Z
allowed_collection: Passive sources and already preserved public-scan artefacts
prohibited: Form submission, credential entry, WebSocket interaction, auth bypass, malware download
confidence_target: High for the confirmed core, moderate for broader candidates
stop_condition: New pivots do not alter blocking or assessment for two iterations
```

Without boundaries, an investigation has no brakes. The internet will always provide one more subdomain.

### Three analytical horizons

The same observable can be pivoted for different decisions. Know which horizon you are working in before opening a portal.

| Horizon | Typical question | Appropriate detail | Common failure |
| --- | --- | --- | --- |
| tactical | what should be blocked or hunted today | active URLs, hosts, files, certificates and expiry | retaining a stale IOC without a review date |
| operational | how does the campaign work and what else belongs to it | deployment, delivery, capability, victimology and chronology | calling a shared kit one operator |
| strategic | what does the pattern mean to an organisation or sector | trends, access models, dependencies and implications | extrapolating one incident into the whole threat landscape |

Senior work does not mean always reaching attribution. It means reaching the level required by the decision and stating precisely where the evidence ends.

## 2. Use the correct analytical objects

STIX represents CTI as a graph of objects and relationships. An investigation does not need to emit STIX JSON to benefit from the same discipline.

| Term | Meaning | Example |
| --- | --- | --- |
| observable | a technically observable value | URL, domain, IP, SHA-256, phone number |
| artefact | preserved bytes or an object | HTML, JavaScript, screenshot, HTTP response |
| observation | the fact that something was seen at a time and source | a public scan saw a host serving a response hash |
| indicator | a detection or hunting condition | exact hash combined with a path |
| entity | a higher-level object | infrastructure, campaign, malware, organisation |
| relationship | a defined edge between objects | domain `resolved-to` IP during a window |
| assessment | an analytical judgement derived from facts | hosts probably used the same deployment |
| cluster | an analytical grouping of related objects | HCVX-PARKING-KIT-2026 |

An observable is not automatically an IOC. An IOC is not an actor. A cluster is not attribution.

### Keep facts and assessments separate

**Fact:** two public scans contain the same response SHA-256.

**Assessment:** both hosts served byte-identical artefacts at the observation times.

**Not yet established:** one person operated both hosts.

This distinction belongs in every investigation. Otherwise a graph quickly becomes fan fiction with IP addresses.

## 3. Every edge must be auditable

A relationship table needs more than `source,target`.

| Field | Purpose |
| --- | --- |
| source | object ID and normalised value |
| relationship | precise verb such as `resolved-to`, `served` or `same-bytes-as` |
| target | second object ID and value |
| observed_at | when the source or sensor saw the relationship |
| collected_at | when the analyst retrieved the record |
| source_name | RDAP, passive DNS, URLScan, internal telemetry |
| source_record | URL, record ID or evidence file |
| evidence | field, hash or excerpt supporting the edge |
| confidence | confidence in this relationship, not the entire story |
| status | candidate, supported, confirmed, rejected or expired |
| analyst_note | why the edge exists and which alternative remains |

Useful relationship verbs include:

```text
resolved-to       domain -> IP
announced-by      prefix -> ASN
registered-by     domain -> registrar or registrant entity
used-nameserver   domain -> NS
issued-for        certificate -> domain
served            URL -> artefact hash
requested         page -> resource URL
redirected-to     URL -> URL
same-bytes-as     artefact -> artefact
similar-to        artefact -> artefact
communicated-with process or sample -> endpoint
delivered         URL -> file hash
observed-at       observable -> source observation
part-of           object -> analytical cluster
```

Reserve `related-to` for cases where the relationship is genuinely unknown. A graph dominated by `related-to` has not explained what it found.

## 4. Time is part of the relationship

Four times should not be collapsed:

1. **event time**, when activity happened
2. **observation time**, when a sensor or provider saw it
3. **collection time**, when the analyst retrieved the record
4. **publication time**, when a provider or researcher published it.

```json
{
  "source": "domain:example.invalid",
  "relationship": "resolved-to",
  "target": "ip:192.0.2.10",
  "first_observed": "2026-08-04T11:12:00Z",
  "last_observed": "2026-08-06T03:20:00Z",
  "collected_at": "2026-08-13T17:44:12Z",
  "provider": "passive-dns-example"
}
```

This does not claim that the relationship remained active on 13 August. It records a provider observation for 4–6 August.

Negative evidence is also bounded by time and coverage. "Not found" means only that the selected provider, plan and query did not return a record.

## 5. Qualify the seed before pivoting

A seed may come from an SMS, EDR telemetry, a file hash, a screenshot, a SIEM alert or a third-party report. These do not have equal provenance.

### Preserve the original

Capture:

- original text or bytes and SHA-256
- receipt time and timezone
- source and collection channel
- whether a user opened the URL
- whether a secure-email gateway rewrote it
- whether the screenshot was cropped
- TLP and legal restrictions.

### Normalise without destroying evidence

```python
from urllib.parse import parse_qsl, urlsplit
import tldextract

raw = "hxxps://unipark[.]fmqr[.]ink/com"
refanged = raw.replace("hxxps://", "https://").replace("[.]", ".")
u = urlsplit(refanged)
ext = tldextract.extract(u.hostname or "")

seed = {
    "raw": raw,
    "normalised_url": u.geturl(),
    "scheme": u.scheme.lower(),
    "host": (u.hostname or "").lower(),
    "apex": ".".join(x for x in (ext.domain, ext.suffix) if x),
    "port": u.port,
    "path": u.path or "/",
    "query": parse_qsl(u.query, keep_blank_values=True),
}
```

Keep both raw and canonical forms. Case-sensitive paths, query order and original encoding may be evidentially important.

### Assess contamination

Ask whether a security product visited the URL, a public submission exposed a private token, a sandbox introduced headers or cookies, a redirect belongs to the scanner, or the screenshot shows an anti-bot interstitial rather than the target.

Uncertain provenance does not require discarding the seed. It lowers reliability and must be documented.

## 6. The hypothesis-led pivot loop

### Gate A: state competing hypotheses

```text
H1: The host uses the same deployment as the seed.
H2: The host only shares common hosting or a CDN.
```

### Gate B: select a discriminating observable

Which characteristic best separates H1 from H2?

- exact response hash is better than the same ASN
- several exact asset hashes are better than a similar screenshot
- an uncommon application identifier is better than `nginx`
- path, bundle and time together are better than a path alone.

### Gate C: select the source

Evaluate what the provider measures, temporal and geographic coverage, whether results derive from the same upstream, whether a query exposes the seed, and whether the raw result can be preserved.

### Gate D: capture evidence

Preserve the raw response before transforming it. Record the query, headers, collection timestamp and hash.

### Gate E: assess the relationship

```text
candidate  -> warrants examination
supported  -> at least one meaningful relationship
confirmed  -> directly observed or repeatedly corroborated
rejected   -> a competing explanation better fits the evidence
expired    -> formerly useful operational IOC no longer treated as active
```

### Gate F: choose the next best pivot or stop

Choose based on expected information gain, not on which portal still has query credits.

### Maintain a pivot queue, not a collection of browser tabs

Keep each possible pivot in a queue with a short rationale:

| Field | Record |
| --- | --- |
| question | which uncertainty the pivot reduces |
| target hypothesis | which H1, H2 or H3 it can discriminate |
| expected result | which observable or edge should emerge |
| diagnosticity | whether that result would be rare if H1 were false |
| source coverage | time, region, protocol and data origin |
| collection risk | OPSEC, privacy, contamination and legal constraints |
| cost | time, API quota and analyst effort |
| decision impact | whether it changes blocking, scope, confidence or stopping |

This does not require false mathematical precision. Qualitative prioritisation is enough:

```text
P1  exact JavaScript SHA-256 in public-scan history
    high information gain, low collection risk, directly tests deployment reuse

P2  SPKI reuse across known hosts
    medium information gain, may distinguish a dedicated key from shared issuance

P3  expand across the complete hosting ASN
    low information gain, high shared-service noise
```

If I cannot describe a result that would change the assessment, the query is probably not worth running.

## 7. Six pivot families

### Infrastructure

Domains, IPs, prefixes, ASNs, nameservers, registrars, certificates and passive DNS answer **where and when infrastructure operated**. Shared Cloudflare, AWS or registrar data rarely establishes control.

### Content and code

HTML, JavaScript, CSS, images, source maps, favicon, DOM, exact hashes, TLSH, ssdeep, imphash and icon hashes answer **whether objects served identical or similar artefacts**. Exact bytes do not prove a common operator when a kit is distributed.

### Behaviour and protocol

Redirect order, API routes, WebSocket paths, form schemas, headers, cookies, request graphs and retry intervals answer **whether deployments behave alike**.

### Identity and account

Registrant details, email, phone, usernames, repositories, analytics IDs and code-signing subjects require strong privacy and attribution discipline. Reuse may represent a reseller, compromise, shared service or deception.

### Temporal

Registration bursts, certificate issuance, DNS changes, first seen, lure delivery, payload rotation, takedown and reactivation strengthen other relationships. Time proximity alone is rarely sufficient.

### Ecosystem

URLScan, VirusTotal, Censys, Shodan, OpenPhish, URLhaus, MalwareBazaar, passive DNS, CT logs, code search and internal telemetry provide observations. Provider verdicts do not replace analytical judgement.

### Audit pivot coverage

When a case stalls, ask which evidence family remains unexamined, not which tool has not been opened.

| Evidence family | Possible pivot objects | What it can test |
| --- | --- | --- |
| DNS and naming | A/AAAA, CNAME, NS, MX, TXT, CAA, SOA, wildcard and reverse DNS | hosting, delegation, mail and naming reuse through time |
| routing and service | prefix, origin ASN, ROA, port, banner, SSH key, TLS key and JA4 | infrastructure coexistence and dedicated-service reuse |
| web application | redirect state, cookies, CSP, form schema, API, WebSocket and source map | common build, backend contract or deployment |
| cloud and SaaS | tenant ID, cloud account ID, bucket name, OAuth app ID, analytics or support-widget ID | shared control plane or service-account reuse |
| code and build | repository, package, PDB path, compiler, source-map path, chunk ID and uncommon constant | source or build lineage |
| malware | exact hash, imports, configuration, mutex, named pipe, service, signer and endpoint | sample identity, family and campaign relationship |
| delivery | email headers, Message-ID pattern, sender infrastructure, SMS sender, shortener and QR destination | delivery cluster and targeting |
| content and lure | title, copy, language errors, OCR, images, favicon, DOM and payment flow | kit reuse and localisation pattern |
| identity | stable platform ID, email, phone, username, repository account and certificate subject | account reuse with attribution constraints |
| chronology | registration, issuance, resolution, scan, delivery, rotation, takedown and reactivation | activity thread and operational tempo |

Not every case needs every row. If an assessment rests on only one evidence family, confidence should say so.

### Analytical frames are not decoration

The **Diamond Model** helps identify which event facet a pivot expands: capability, infrastructure, victim or adversary. Technical pivots usually develop capability and infrastructure. They do not automatically populate the adversary vertex.

An **activity thread** connects events through time. Registration, certificate issuance, lure delivery, scan observation, payload rotation and takedown form a sequence that cannot be replaced by one attractive graph.

**MITRE ATT&CK** normalises behaviour and techniques. It is not an actor lookup table. Two groups using one technique do not become the same group.

In 2026, analysts must verify the current ATT&CK model rather than reproduce an old training slide. MITRE states that Data Sources were deprecated in ATT&CK v18 in October 2025. Mapping should use the current object and detection-guidance model, and the report should record the ATT&CK version used.

**Competing hypotheses** belong before the next pivot, not merely in the final report. The best query is the one most likely to distinguish plausible alternatives.

### Source reliability and information credibility are different

A generally reliable provider may lack coverage for the present question. A less established source may supply an original artefact that can be independently verified.

Evaluate separately:

| Dimension | Question |
| --- | --- |
| source reliability | has the source historically supplied accurate, auditable data |
| access | could it observe what it claims to have observed |
| information credibility | do raw evidence and other observations support this claim |
| independence | do multiple providers actually repeat one upstream |
| coverage | which times, regions, protocols and objects are visible |
| timeliness | is the information current enough for the decision |

Three portals importing one feed are one evidence lineage wearing three logos.

#### Maintain a source-lineage register

Count corroboration by independent collection, not by the number of search results. If a VirusTotal relationship, a vendor report and a downstream feed all derive from the same URLScan result, they do not represent three independent observations.

```json
{
  "claim_id": "claim-0042",
  "claim": "host served artefact sha256:...",
  "display_source": "vendor-report",
  "upstream_source": "urlscan-result:01abc...",
  "sensor_type": "public-web-scan",
  "observed_at": "2026-08-11T08:12:00Z",
  "published_at": "2026-08-12T10:00:00Z",
  "collected_at": "2026-08-13T17:44:12Z",
  "coverage_note": "single scan, one vantage point",
  "independence_group": "urlscan:01abc..."
}
```

Two sources are independent only when their observation paths do not depend on the same upstream record, submission or sensor.

## 8. Source selection by seed

| Seed | First questions | Higher-precision pivots | Broader candidate pivots |
| --- | --- | --- | --- |
| full URL | redirects, response, resources, path and query | exact response and asset hashes | path template, lure text, host pattern |
| domain | registration, DNS history, certificates, URLs | exact certificate fingerprint, rare NS plus time | ASN, registrar, TLD |
| IP | historical resolutions and services | dedicated certificate, unique banner | netblock, ASN |
| certificate | fingerprint, SAN and issuance | same fingerprint | issuer or subject pattern |
| JavaScript | exact bytes, source map, API routes | SHA-256, uncommon constant | fuzzy hash, framework chunk name |
| file hash | metadata, delivery and family | exact SHA-256 | imphash, TLSH, filename |
| email or phone | reuse and delivery context | rare exact reuse with corroboration | numbering plan, provider |
| screenshot | OCR, layout and resources | perceptual match plus code evidence | brand and colour similarity |

![CTI seed-to-pivot decision map from a URL, domain, IP, certificate, web artefact, file or account to the next defensible action](/assets/img/posts/2026-08-13-pivoting-101/seed-pivot-decision-map.svg)

### URL seed

A URL is not one string. Decompose it into scheme, userinfo, host, port, path segments, query keys, query values, fragment and encoding. Retain the original as evidence and use the canonical form for searching.

```text
raw URL
  -> timestamped redirect chain
  -> status, Location and IP for every hop
  -> final response SHA-256
  -> request graph and third-party resources
  -> exact asset hashes
  -> rare path, query-key schema and route pattern
  -> same artefact on other hosts
```

A query value may be a victim-specific token. Do not publish it, index it or submit it to a public scanner. Query **keys** and path shape are often sufficient for hunting.

### Domain or hostname seed

Separate the FQDN from the apex. Examine RDAP events and status, nameserver history, current and passive DNS, MX/TXT, CT SANs, URL observations and served artefacts.

Keep the relationships precise:

- `registered-with` is not `controlled-by`
- `resolved-to` applies during an observation window
- `issued-for` does not prove deployment
- wildcard SANs may generate names for hosts that never existed
- NXDOMAIN now does not disprove a historical record.

### IP, prefix or ASN seed

An IP without port, protocol and time is an over-broad seed. Add RIR RDAP, origin prefix, ASN, BGP history, pDNS, observed services, certificates, SSH host keys and banner artefacts.

IPv4-neighbour and netblock pivots generate candidates. A `/24`, ASN or cloud region is not an actor boundary. Blind IPv6 prefix expansion is even less useful. Find reused service artefacts, keys or certificates first, then determine whether the infrastructure was dedicated.

### Certificate or public-key seed

Distinguish three claims:

1. the same certificate SHA-256 identifies the same DER object
2. the same SPKI SHA-256 identifies the same public key even after certificate renewal
3. similar issuer, subject or validity patterns generate candidates only.

Issuance time comes from CT or the certificate. Deployment time comes from service observation. They may differ.

### HTML, JavaScript, CSS or media seed

Compare exact bytes first. Then examine normalised text, DOM structure, source maps, route and endpoint graphs, uncommon constants, form-field names, analytics identifiers, favicon and image hashes.

For a minified bundle, retain:

- raw SHA-256
- safely decoded offline text
- extracted URLs, hosts and paths
- string and identifier sets
- normalised DOM or AST fingerprint
- TLSH or ssdeep for candidate discovery only
- pHash or OCR for visual corroboration only.

### File or malware-metadata seed

Exact MD5, SHA-1 or SHA-256 searches for the same file. Imphash, import sets, TLSH, ssdeep, section layout, signer, icon hash and compiler artefacts search for related files. These are different claims.

```text
file hash
  -> first and last seen
  -> delivery URL and parent artefact
  -> contacted-endpoint metadata
  -> signer and certificate
  -> similar-sample candidates
  -> campaign time window
```

If metadata answers the intelligence requirement, downloading a sample is not a professional initiation ceremony.

### Email, phone, username or platform-account seed

Account reuse can be highly diagnostic, but attribution risk is greatest here. Examine exact reuse, stable platform IDs, creation and activity time, related repository or infrastructure artefacts, and whether the account may have been compromised, spoofed, resold or shared.

A telephone country code describes a numbering plan. A display name is user-controlled text. Neither reliably identifies an operator.

### Victim, brand or lure seed

Brand, language, currency, payment method, delivery channel and victim geography can reveal a campaign pattern. Popular brands also create substantial copycat noise. Combine a brand pivot with code, infrastructure, time or delivery evidence.

Model victim data separately from adversary infrastructure and minimise it. A public report does not need a victim token, telephone number, card data or unique URL merely because it was retained in the evidence package.

## 9. Web and phishing infrastructure playbook

This is not a mandatory tool chain. Select the step that most reduces current uncertainty.

### Registration and ownership context

RDAP provides registrar, status, registration events, nameservers and IP-resource ownership.

```python
import requests

record = requests.get("https://rdap.org/domain/fmqr.ink", timeout=30).json()
print(record.get("events"))
print(record.get("nameservers"))
```

A registration burst becomes useful when time, registrar, nameserver, naming pattern and content align. A registrar alone is weak evidence.

### DNS and passive DNS

Current DNS is a present-state lookup. Passive DNS is a provider's historical observation set.

```python
import dns.resolver

for record_type in ("A", "AAAA", "CNAME", "MX", "NS", "TXT"):
    try:
        print(record_type, [str(x) for x in dns.resolver.resolve("fmqr.ink", record_type)])
    except Exception as exc:
        print(record_type, type(exc).__name__)
```

The defensible edge is `domain resolved-to IP during a window`, not `domain belongs-to IP owner`.

### Certificate Transparency

CT can expose SANs, wildcard use and issuance time. It does not cover private certificates, prove deployment time or establish control when a shared platform automatically issues certificates.

### Public scans and response artefacts

Public scans can expose request graphs, DOM, screenshots and response hashes without revisiting a target. Check visibility before submitting anything. A private incident URL containing a token should not automatically become public.

Use a query ladder:

```text
1. exact complete-response SHA-256
2. several exact asset SHA-256 values
3. exact artefact in a narrow time window
4. artefact plus uncommon path or request
5. uncommon string plus technology
6. DOM, favicon or visual similarity
7. certificate, IP, NS or ASN only with another characteristic
```

Each step increases recall and generally reduces precision.

### Static code analysis

Analyse already preserved HTML and JavaScript for URLs, paths, WebSocket endpoints, API routes, form fields, analytics IDs and source maps. Do not execute it.

```python
from pathlib import Path
import hashlib
import re

body = Path("case/raw/app.js").read_bytes()
text = body.decode("utf-8", errors="replace")
print(hashlib.sha256(body).hexdigest())

for pattern in (
    r"https?://[^\s'\"<>]+",
    r"wss?://[^\s'\"<>]+",
    r"sourceMappingURL=([^\s]+)",
):
    print(sorted(set(re.findall(pattern, text))))
```

### Preserve reproducible evidence

A screenshot is useful communication but weak as the only evidence. Preserve the raw body, metadata and hash for every material response. A derived file never overwrites raw evidence.

```python
from datetime import datetime, timezone
from hashlib import sha256
from pathlib import Path
import json

def register_file(path: str, source: str, query: str) -> dict:
    item = Path(path)
    record = {
        "path": item.as_posix(),
        "sha256": sha256(item.read_bytes()).hexdigest(),
        "bytes": item.stat().st_size,
        "source": source,
        "query": query,
        "collected_at": datetime.now(timezone.utc).isoformat(),
    }
    with Path("case/evidence.jsonl").open("a", encoding="utf-8") as out:
        out.write(json.dumps(record, ensure_ascii=False) + "\n")
    return record
```

```text
case/
  00-case.yaml              # PIR, scope, TLP and constraints
  raw/                      # original provider responses and artefacts
  normalized/               # canonical URLs and extracted records
  derived/                  # graphs, timelines, hashes and screenshots
  queries/                  # query text and API parameters
  evidence.jsonl            # provenance register
  assessments/              # hypotheses, confidence and stop notes
```

### Pivot on TLS keys, not only certificates

Calculate certificate and SPKI fingerprints offline from a preserved PEM. SPKI reuse can survive certificate renewal, although a shared reverse proxy or management platform remains a competing explanation.

```python
from cryptography import x509
from cryptography.hazmat.primitives import serialization
from hashlib import sha256
from pathlib import Path

pem = Path("case/raw/server-cert.pem").read_bytes()
cert = x509.load_pem_x509_certificate(pem)
der = cert.public_bytes(serialization.Encoding.DER)
spki = cert.public_key().public_bytes(
    serialization.Encoding.DER,
    serialization.PublicFormat.SubjectPublicKeyInfo,
)

print("certificate_sha256", sha256(der).hexdigest())
print("spki_sha256", sha256(spki).hexdigest())
print("serial", hex(cert.serial_number))
print("not_before", cert.not_valid_before_utc.isoformat())
print("not_after", cert.not_valid_after_utc.isoformat())
```

Also examine SAN sets, issuer chains, key algorithms, validity length, serial patterns and CT issuance bursts. A common Let's Encrypt issuer is not a relationship. A rare SPKI reused within a relevant time window is more diagnostic.

### HTTP, redirect and application fingerprints

Response similarity should go beyond a page title. Model:

- status and redirect sequence
- header names, not only values
- cookie names and flags
- content type, length and compression
- body and individual asset hashes
- CSP, CORS and cache policy
- form actions and field schemas
- API, WebSocket, GraphQL and source-map paths
- error pages and framework-specific headers
- request dependency graph.

One `Server: nginx` header proves little. The same rare cookie name, identical redirect state machine and several exact asset hashes test common deployment more directly.

### Measure similarity at several layers

A similarity claim needs an explicit feature set. Jaccard similarity can support triage when the analyst can inspect which elements matched:

```python
def jaccard(left: set[str], right: set[str]) -> float:
    union = left | right
    return len(left & right) / len(union) if union else 1.0

a = {"/api/init", "/assets/app.js", "session_key", "parking_id"}
b = {"/api/init", "/assets/app.js", "session_key", "victim_id"}

print("similarity", round(jaccard(a, b), 3))
print("shared", sorted(a & b))
print("only_a", sorted(a - b))
print("only_b", sorted(b - a))
```

There is no universal threshold. Calibrate against known-positive and known-negative examples. Down-weight or remove libraries, boilerplate and CDN assets first. Otherwise, the algorithm will confidently rediscover that much of the internet uses Bootstrap.

### Add network and routing context

For an IP pivot, preserve more than the ASN name. Relevant context includes RIR allocation, origin prefix, BGP first and last observed, announcement changes, ROA state, reverse DNS and hosting model.

Ask whether the IP was announced by the same origin at the relevant time, whether the prefix changed operator, whether it was CDN, shared, VPS or dedicated infrastructure, whether suspicious services appeared in the same narrow window, and whether pDNS and service observations overlap.

A BGP relationship is control-plane context, not proof of the application operator. IP geolocation is a provider assessment and cannot identify a person's location.

### Keep passive, active and internal collection distinct

```text
passive    RDAP, CT, pDNS, existing scans, feeds and archived artefacts
active     analyst-initiated DNS, HTTP, TLS or service interaction
internal   SIEM, EDR, proxy, mail-gateway and resolver telemetry
reported   third-party claim without raw observation available to the analyst
```

Each method has different visibility and contamination risk. Examples in this guide use passive sources or already preserved artefacts. Authorisation for active collection must be defined separately.

### When active reconnaissance genuinely improves pivoting

Passive data often describes what another sensor observed yesterday. Active collection can establish what a target serves now, whether a candidate remains valid and whether two hosts respond identically to the same safe request. It is valuable when the answer changes cluster membership, incident scope or confidence.

Internet-facing does not mean authorised for testing. An active DNS, HTTP or TLS request is already an interaction. Port scanning, virtual-host enumeration, content discovery, malformed requests, authentication testing and exploitation increase impact. They require clear owner authorisation and rules of engagement.

#### Collection escalation ladder

Movement up the ladder is never automatic. Every level has a separate gate.

| Level | Collection type | Pivoting value | Required before collection |
| --- | --- | --- | --- |
| 0 | passive records, archives, CT, pDNS and existing scans | candidate discovery and historical context | case scope and source-handling rules |
| 1 | low-impact DNS, one TLS handshake and limited HEAD or GET | current resolution, certificate, redirect, header and artefact validation | target allowlist, window, rate limit and evidence plan |
| 2 | broader service, vhost, route or content discovery | hidden service, backend contract and attack-surface relationships | written owner permission, request budget, monitoring and abort contact |
| 3 | state-changing test using test accounts or synthetic data | workflow, access-boundary or backend validation | separate test plan, test data, rollback and incident coordination |
| 4 | exploitation, payload delivery or privilege testing | may establish practical capability and impact | explicit exploitation scope, isolated infrastructure and named accountable staff |

Most CTI investigations need only level 0 or 1. Levels 2–4 approach attack-surface assessment, penetration testing or red-team activity. They can enrich CTI, but must not appear silently because the analyst knows how to use Nmap or Burp.

#### Minimum rules of engagement

Record these controls before active collection:

```yaml
authorizing_party: Asset owner or explicitly delegated representative
scope:
  hosts: ["research.example.invalid"]
  ports: [443]
  protocols: ["dns", "tls", "https"]
allowed:
  - one DNS resolution
  - TLS certificate capture
  - HEAD and bounded GET to already known paths
prohibited:
  - credential guessing
  - form submission
  - file upload
  - persistence
  - denial of service
window_utc: "2026-08-14T18:00:00Z/2026-08-14T19:00:00Z"
rate_limit: "1 request/second, 100 requests maximum"
source_addresses: ["192.0.2.40"]
abort_contact: "security@example.invalid"
data_handling: "TLP:AMBER, encrypted evidence store, 30-day review"
```

Scope must define more than a domain. Include hosts, interpretation of resolved IPs, ports, protocols, cloud and CDN boundaries, test accounts, third-party dependencies and whether a redirect into another organisation may be followed. An automatic redirect can leave scope before the analyst finishes saying, "the requests library did it itself."

#### An OPSEC model for analysts

OPSEC does not mean impersonating a threat actor. It means controlling what collection reveals, avoiding harm and distinguishing analyst traffic from adversary or third-party research traffic.

| Area | Control | Failure prevented |
| --- | --- | --- |
| identity | no personal accounts, browser profile, telephone or daily email | disclosure of investigator identity and other cases |
| network | designated egress, fixed source IP, separate DNS resolver, IPv6 and WebRTC controls | accidental disclosure of organisation or home addresses |
| endpoint | isolated VM or container, separate browser profile and no personal cookies | cross-case contamination and drive-by risk |
| application | JavaScript disabled by default, no form submission, downloads blocked and redirect cap | state changes, payload retrieval and out-of-scope requests |
| credentials | test accounts and synthetic data only when authorised | contamination with real credentials or victim data |
| timing | rules-of-engagement window, UTC timestamps and agreed jitter only | unintended alerting and unexplained telemetry |
| attribution | stable collector ID in evidence and source-address deconfliction | treating analyst scans as threat activity |
| disclosure | verify public-scan visibility before submission | publication of tokens, victim data or private hostnames |

A VPN is a transport control, not authorisation or an invisibility cloak. DNS resolvers, browser fingerprints, TLS handshakes, cookies, API accounts, public-scan history, request timing and later publication may still correlate activity. Dedicated research egress should be coordinated with legal and incident-response stakeholders.

#### Offensive-security use cases in pivoting

| Use case | Active action | Relationship tested | Important boundary |
| --- | --- | --- | --- |
| candidate validation | bounded DNS, TLS and HTTP capture | `host currently-serves artefact` | present state does not replace historical observation |
| separating CDN from origin | authorised SNI and Host comparison on known endpoints | `hostname routed-to service` | do not bypass a security control without permission |
| virtual-host validation | specific hostnames derived from passive evidence | `IP served hostname during collection` | brute-force wordlists need broader scope |
| application fingerprinting | safe requests to already known paths | `deployment behaves-like deployment` | malformed and state-changing requests are a higher level |
| route and API mapping | validation of read-only endpoints found in JavaScript or source maps | `artefact references reachable endpoint` | do not create accounts or submit PII or fake payments |
| authentication boundary | test account and pre-approved workflow | `service shares identity backend` | no password spraying or real accounts |
| vulnerability correlation | version and configuration observation | `service may-be-affected-by CVE` | a version match is not exploitation evidence |
| controlled exploitation | one explicitly scoped proof with a stop condition | `exposure enables capability` | only within separate penetration-test or red-team authorisation |

An offensive technique adds the most value when it tests a specific competing explanation. A safe SNI comparison may demonstrate that two hosts share only a CDN edge, not a backend. Exact response and cookie-state comparison may support common deployment. Blindly scanning a complete prefix will usually create more noise than intelligence.

#### Example of a bounded active collector

This example is only for a pre-authorised host. It enforces a hard allowlist, refuses automatic redirects, caps the response body and does not execute JavaScript.

```python
from hashlib import sha256
from urllib.parse import urlsplit
import time
import requests

ALLOWED_HOSTS = {"research.example.invalid"}
MAX_BODY = 1_000_000

def collect(url: str) -> dict:
    parsed = urlsplit(url)
    if parsed.scheme != "https" or parsed.hostname not in ALLOWED_HOSTS:
        raise ValueError("target is outside the written allowlist")

    response = requests.get(
        url,
        headers={"User-Agent": "Authorised-Research/1.0"},
        timeout=(5, 15),
        allow_redirects=False,
        stream=True,
    )

    body = bytearray()
    for chunk in response.iter_content(16_384):
        body.extend(chunk)
        if len(body) > MAX_BODY:
            raise ValueError("response exceeded collection limit")

    time.sleep(1)
    return {
        "url": url,
        "status": response.status_code,
        "location": response.headers.get("Location"),
        "headers": dict(response.headers),
        "body_sha256": sha256(body).hexdigest(),
        "bytes": len(body),
    }
```

In a real case, the collector also records UTC collection time, source address, collector version, request ID and raw evidence path. Treat every redirect as a new target and follow it only when it remains inside the allowlist.

#### Reconnaissance contamination and deconfliction

Active collection may:

- create a new access-log observation
- consume a single-use token or modify kit state
- alter first-seen time at a downstream provider
- provoke payload rotation, geoblocking or takedown
- trigger WAF, IDS or fraud automation
- be observed by another provider and return later as a "new threat signal."

Keep source IPs, User-Agent, collection window and request IDs in a deconfliction register. Derived intelligence must identify which observations pre-dated analyst interaction and which may have resulted from it.

Abort collection when a target leaves scope, service health deteriorates, unexpected sensitive data appears, a provider or owner requests a stop, rate limits trigger or the next request no longer has decision value.

## 10. Supporting pivots in OpenPhish, URLhaus and MalwareBazaar

Use each source only when its coverage answers the question.

### OpenPhish

The free [OpenPhish Community Feed](https://openphish.com/phishing_feeds.html) is a limited active-phishing URL feed refreshed every 12 hours. It supports exact URL or host corroboration, additional paths on an apex domain, lure-pattern discovery and brand-abuse trend analysis.

Absence is not a clean verdict. The feed is not a complete historical archive. Do not visit listed URLs.

```python
from urllib.parse import urlsplit
import requests

feed = requests.get("https://openphish.com/feed.txt", timeout=30)
feed.raise_for_status()
hosts = {
    (urlsplit(line.strip()).hostname or "").lower()
    for line in feed.text.splitlines()
    if line.strip() and not line.startswith("#")
}
print("unipark.fmqr.ink" in hosts)
```

This makes one request to OpenPhish and none to feed entries.

### URLhaus

[URLhaus](https://urlhaus.abuse.ch/about/) tracks URLs directly distributing malware. A credential-phishing page without a payload is a different use case.

Use URLhaus after obtaining a payload URL, exact payload hash, delivery host, filename, signature, TLSH, ssdeep or imphash.

```text
download request
  -> URLhaus URL observation
  -> exact payload SHA-256
  -> other URLs serving the same payload
  -> delivery-host history
  -> MalwareBazaar metadata
```

Take API endpoints and authentication requirements from the current [URLhaus documentation](https://urlhaus.abuse.ch/api/). Do not retrieve the payload.

### MalwareBazaar

Use [MalwareBazaar](https://bazaar.abuse.ch/api/) only for metadata about an already observed MD5, SHA-1 or SHA-256.

```python
import os
import requests

sha256 = "0" * 64  # replace with a hash already observed
response = requests.post(
    "https://mb-api.abuse.ch/api/v1/",
    headers={"Auth-Key": os.environ["ABUSECH_AUTH_KEY"]},
    data={"query": "get_info", "hash": sha256},
    timeout=30,
)
response.raise_for_status()
metadata = response.json()
```

Pivot through exact SHA-256, imphash, TLSH, icon dhash, signatures, code-signing details and first/last seen. Exact hash identifies exact bytes. TLSH and imphash generate similarity candidates.

```text
DO NOT use query=get_file
DO NOT retrieve recent or batch samples
DO NOT visit payload URLs
DO NOT execute or detonate files
DO NOT describe a fuzzy match as an exact match
```

## 11. Candidate discovery is not cluster membership

Objects move through four analytical levels:

1. **Candidate:** one weak or moderate shared characteristic
2. **Supported relationship:** at least one meaningful edge
3. **Cluster membership:** evidence satisfies a documented inclusion rule
4. **Attribution:** the cluster is tied to an operator, persona or intrusion set.

Define the inclusion rule before clustering. For the UNIPARK confirmed core:

```text
CONFIRMED CORE if a public scan contains the exact core JavaScript SHA-256
AND at least two of:
  exact additional JavaScript or CSS SHA-256
  the same uncommon /console request pattern
  the same route and build structure
  the same deployment time window
```

A broader candidate may share a parking lure and one infrastructure or code characteristic but lack the exact core artefact. That candidate must remain outside the confirmed core.

## 12. Avoid blind scoring

`Same ASN = 1`, `same favicon = 2`, `same hash = 5` looks objective while hiding assumptions. Five correlated weak signals are not five independent sources.

| Evidence class | Example | Use |
| --- | --- | --- |
| direct | scan response contains exact hash | confirms an observation |
| strong | several exact deployment artefacts | core cluster membership |
| supporting | uncommon path aligned in time | strengthens a strong edge |
| contextual | ASN, registrar, TLD | explains environment |
| contradictory | different core code and time | reduces membership confidence |

Ask about diagnosticity: would this evidence also be likely if the preferred hypothesis were false?

## 13. Graph analysis without graph theatre

```python
import networkx as nx

g = nx.MultiDiGraph()
g.add_node("host:unipark.fmqr.ink", kind="hostname", status="seed")
g.add_node("sha256:7068...", kind="file-hash", status="observed")
g.add_edge(
    "host:unipark.fmqr.ink",
    "sha256:7068...",
    relationship="served",
    observed_at="2026-08-11T08:12:00Z",
    source="urlscan",
    evidence="case/raw/urlscan-result.json",
    confidence="high",
)
nx.write_graphml(g, "case/derived/pivot.graphml")
```

Quality checks:

- every edge has a verb, time, source and evidence
- candidate and confirmed nodes remain distinguishable
- shared providers do not create artificial mega-clusters
- transitive paths are not converted into direct relationships
- rejected candidates remain in the audit trail.

If A shares an IP with B and B shares a favicon with C, A is not thereby related to C. Graph traversal is not proof.

### Use typed, temporal and provenance-aware graphs

Putting domains, IPs, hashes, actors and reports into one undifferentiated plane produces attractive but analytically dirty spaghetti. Use object types and permitted edge verbs. Record `domain resolved-to IP`, not `domain linked-to actor` across three hidden steps.

Maintain at least three views:

1. an **evidence graph** containing observations, provider records and lineage
2. an **analytical graph** containing supported and confirmed relationships
3. an **operational view** containing only still-active detection and blocking objects.

This prevents an expired DNS edge from visually holding a cluster together forever.

### Down-weight high-degree nodes

A Cloudflare IP, analytics ID from a public template, popular favicon or public resolver may have thousands of edges. It is a hub because it is shared, not because it is the centre of a campaign.

Before projection or community detection:

- label shared-provider nodes
- measure feature prevalence in a background set
- favour rare features over common ones
- do not project host-to-host relationships through generic nodes
- inspect the exact edge that joins two communities.

A connected component answers only whether a path exists. Degree centrality may identify a popular service. Betweenness may identify the artefact that visually joins two groups. None of these metrics establishes attribution.

### Slice the graph through time before clustering

Choose windows that match operational tempo. Fast-flux or smishing may require hours or days. Longer-lived malware infrastructure may require weeks.

```python
from collections import defaultdict
from datetime import datetime, timezone

events = [
    {"object": "host:a", "observed_at": "2026-08-04T08:12:00Z"},
    {"object": "host:b", "observed_at": "2026-08-04T19:42:00Z"},
]

by_day = defaultdict(list)
for event in events:
    ts = datetime.fromisoformat(event["observed_at"].replace("Z", "+00:00"))
    by_day[ts.astimezone(timezone.utc).date().isoformat()].append(event["object"])

for day, objects in sorted(by_day.items()):
    print(day, sorted(objects))
```

Look for registration and issuance bursts, synchronised DNS changes, asset rotation, quiet periods and reactivation. Temporal co-occurrence strengthens another uncommon relationship. A common provider first-seen time may merely reflect batch ingestion.

### Bound negative evidence to its source

Replace "there is no pDNS" with "provider X returned no observation for query Y when collected on 2026-08-14." The value of a negative result depends on retention, sensor coverage, account tier, result limits, query normalisation, ingestion delay and whether the source observes the relevant protocol.

Negative evidence weakens a hypothesis only when the source had a realistic opportunity to observe the expected signal.

## 14. Competing hypotheses and disconfirmation

| Hypothesis | Expected observations | Evidence against it |
| --- | --- | --- |
| H1 one operator | account reuse, control artefacts and coordinated timing | a publicly distributed kit and separate operator identifiers |
| H2 one kit, several operators | exact code with different delivery and account infrastructure | shared private control artefacts |
| H3 hosting coincidence | same IP or ASN with different content | several exact uncommon artefacts |
| H4 scanner contamination | scanner-specific requests and headers | same evidence in internal telemetry or independent scans |

Actively seek evidence that would damage the preferred explanation. Confirmation bias can use URLScan too.

### Use an ACH-lite matrix for decisions

Place material evidence against every plausible hypothesis. The symbols describe consistency, not mathematical probability.

| Evidence | H1 same deployment | H2 shared kit | H3 shared provider | H4 scanner contamination |
| --- | --- | --- | --- | --- |
| four exact build artefacts | ++ | ++ | -- | - |
| different account identifiers | - | ++ | 0 | 0 |
| same dedicated SPKI in one window | ++ | + | - | - |
| same ASN only | 0 | 0 | ++ | 0 |
| signal exists only in one scanner's requests | 0 | 0 | 0 | ++ |
| internal telemetry confirms endpoint | ++ | + | - | -- |

`++` strongly consistent, `+` consistent, `0` non-discriminating, `-` inconsistent and `--` strongly inconsistent.

Do not select the hypothesis with the most plus signs. Look for the hypothesis with the fewest serious contradictions. Count one raw source once even when five portals repeat it.

## 15. Express confidence in a specific judgement

Confidence describes the strength of a judgement given evidence quality, corroboration, gaps and alternatives.

- **High:** several high-quality and sufficiently independent lines of evidence, with weaker alternatives
- **Moderate:** credible evidence but limited coverage, a missing relationship or a plausible alternative
- **Low:** fragmented, indirect or single-provider evidence useful mainly as a hypothesis.

Write:

> I assess with high confidence that 126 hosts served the same core web artefact during public scans. I assess with moderate confidence that many belonged to the same kit family. Available evidence is insufficient to conclude that a single operator controlled all hosts.

Those are three judgements. One global `confidence: high` cannot faithfully describe them all.

## 16. Attribution is a ladder

```text
same observable
  -> same artefact
  -> same deployment
  -> same infrastructure cluster
  -> same campaign
  -> same operational persona
  -> same operator or organisation
  -> state-sponsorship assessment
```

Each step requires a different class of evidence. An exact JavaScript hash may support the same deployment. It cannot jump directly to a person or state.

A phone country code identifies a numbering plan. IP geolocation records a database's assessment of an IP. Neither is especially good at reading passports.

## 17. Know when to stop

Stop when:

- the requirement is answered at sufficient confidence
- two iterations no longer change the decision
- only generic hosting or technology pivots remain
- the next step exceeds legal, OPSEC or authorisation boundaries
- collection cost exceeds expected information gain
- the candidate queue grows while precision does not
- operational IOCs have aged into a monitoring problem.

```text
Stopped 2026-08-13T20:30Z.
Reason: exact artefact set stabilised and ASN pivots produced only shared-hosting candidates.
Remaining gap: no reliable operator-identity evidence.
Revisit trigger: new exact core-hash sighting, payload hash or control-account reuse.
```

### Manage IOC and relationship lifecycle

An IOC is not a permanent tattoo.

```text
candidate -> validated -> active -> monitor -> expired
                         \-> sinkholed
                         \-> false-positive
                         \-> superseded
```

`last_seen` is not automatically the expiry date. Review cadence depends on observable type and infrastructure tempo. A URL may remain useful for hours, a dedicated certificate for months, and a technique belongs in a knowledge base longer. Retain historical relationships in the graph after removing them from blocking lists.

Revisit on a new sighting, DNS change, certificate issuance, payload relationship, source correction or material change in collection coverage.

## 18. UNIPARK case study

![UNIPARK smishing pivot graph from the seed into the broader kit cluster](/assets/img/posts/2026-08-13-pivoting-101/unipark-pivot-graph.svg)

1. **Seed qualification:** preserved the SMS URL and prohibited active form interaction.
2. **Infrastructure context:** RDAP, DNS and CT produced candidates, not a core cluster.
3. **Strongest artefact:** preserved HTML, JavaScript and CSS hashes from public scan records.
4. **Exact-hash expansion:** found 163 records and 126 hosts serving the core artefact.
5. **Behavioural corroboration:** the uncommon `/console` request mattered only with the specific bundle and other assets.
6. **Cluster separation:** exact-core members were separated from visual and shared-provider candidates.
7. **Alternative:** a multi-operator or sold-kit model remained plausible, preventing single-operator attribution.
8. **Stop:** broad ASN and registrar pivots reduced precision, so the case moved to monitoring.

The precise claim was:

> 126 hosts in public scan records served the same core artefact.

Not 126 victims, 126 operators or 126 stolen cards.

## 19. Structure the intelligence product

A useful deliverable contains:

- an executive judgement describing meaning, confidence and action
- an analytical body with evidence, chronology, alternatives and gaps
- an IOC annex with type, value, first/last observed, source, confidence and expiry
- an evidence index with raw filenames, hashes, queries and timestamps
- collection gaps describing what the available sources could not observe.

### Peer review and deconfliction

Before release, a second analyst should be able to reproduce decisive queries, explain every high-impact edge, identify non-independent sources, test inclusion and exclusion rules, understand confidence without reading the IOC annex, and find any point where a fact silently became an assessment.

Review must also ensure that the report does not expose victim data, private tokens or sensitive sources. Team deconfliction prevents duplicated collection, public-submission contamination and the particularly awkward outcome in which two teams report one another's scans as adversary activity.

## Analyst checklist

```text
[ ] Decision need and intelligence requirement are defined
[ ] Allowed and prohibited collection are recorded
[ ] Original seed and provenance are preserved
[ ] Observations remain separate from assessments
[ ] Every edge has a type, time, source and evidence
[ ] Candidates are not automatically cluster members
[ ] Current state is not described as complete history
[ ] Provider absence is not a clean verdict
[ ] Source independence has been assessed
[ ] At least one competing hypothesis is documented
[ ] Confidence belongs to a specific judgement
[ ] Exact artefact reuse has not become operator attribution
[ ] Operational IOCs have an expiry or review date
[ ] Stop reason and revisit trigger are documented
```

## The central lesson

Professional pivoting is not a contest to collect the most rows.

The best graph is not the largest. It is the graph in which every edge, time, source, alternative and relevance to the decision can be explained.

A tool returns a result. The analyst determines whether it is an observation, a relationship, cluster evidence or merely another neighbour on the internet.

## Methodology and source documentation

1. [Full HECAVEX UNIPARK smishing investigation](/en/research/unipark-smishing-campaign-infrastructure/)
2. [OASIS STIX 2.1 graph, observable and relationship model](https://docs.oasis-open.org/cti/stix/v2.1/stix-v2.1.html)
3. [ODNI ICD 203 Analytic Standards](https://www.odni.gov/files/documents/ICD/ICD-203.pdf)
4. [NIST SP 800-150 Guide to Cyber Threat Information Sharing](https://csrc.nist.gov/pubs/sp/800/150/final)
5. [FIRST Traffic Light Protocol 2.0](https://www.first.org/tlp/)
6. [RDAP.org usage documentation](https://about.rdap.org/)
7. [URLScan Search API documentation](https://urlscan.io/docs/search/)
8. [URLScan API and safe-submission guidance](https://urlscan.io/docs/api/)
9. [OpenPhish Community Feed description](https://openphish.com/phishing_feeds.html)
10. [OpenPhish coverage explanation](https://openphish.com/kb.html)
11. [URLhaus purpose and Community API](https://urlhaus.abuse.ch/api/)
12. [MalwareBazaar hash metadata API](https://bazaar.abuse.ch/api/)
13. [VirusTotal object relationships](https://docs.virustotal.com/reference/relationships)
14. [Censys Query Language](https://docs.censys.com/docs/censys-query-language)
15. [Shodan API documentation](https://developer.shodan.io/api)
16. [IETF RFC 9082 and RFC 9083, the standard RDAP query and JSON model](https://www.rfc-editor.org/rfc/rfc9082.html)
17. [IETF RFC 9162, Certificate Transparency 2.0](https://www.rfc-editor.org/rfc/rfc9162.html)
18. [MITRE ATT&CK Data & Tools](https://attack.mitre.org/resources/attack-data-and-tools/)
19. [Caltagirone, Pendergast and Betz, The Diamond Model of Intrusion Analysis](https://www.activeresponse.org/wp-content/uploads/2013/07/diamond.pdf)
20. [NIST SP 800-115 Technical Guide to Information Security Testing and Assessment](https://csrc.nist.gov/pubs/sp/800/115/final)
21. [OWASP Web Security Testing Guide, Attack Surface Identification](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/01-Information_Gathering/04-Attack_Surface_Identification)
