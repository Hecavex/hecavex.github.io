---
published: true
title: "Signal Brief #9: exploited gateways, stolen tokens and cloud destruction"
card_title: "Signal Brief #9: gateways, tokens and cloud access"
description: "F5 APM, SharePoint and NetScaler exploitation, EvilTokens device-code phishing, destructive Azure activity and ENISA's new threat landscape. Coverage: 21–27 September 2026."
seo_description: "Six defensive priorities covering exploited F5, SharePoint and NetScaler systems, EvilTokens, Azure workload identities and ENISA's 2026 threat report."
seo_title: "Gateways, Tokens and Cloud Access | Signal Brief #9"
seo_keywords: [CVE-2026-94127, CVE-2026-65660, CVE-2026-88771, CVE-2026-88772, EvilTokens, Storm-3168]
date: 2026-10-04 11:20:00 +0300
last_reviewed_at: 2026-10-04 11:20:00 +0300
lang: en
translation_key: hecavex-signal-brief-009
permalink: /en/briefings/2026-09-27/
author: deividas-lis
content_type: signal-brief
series: hecavex-signal-brief
issue: 9
coverage_start: 2026-09-21
coverage_end: 2026-09-27
information_cutoff: 2026-09-27 23:59:59 +0000
confidence: moderate
tlp: clear
categories: [security-briefings]
tags: [CISA KEV, phishing, SharePoint, network security, ENISA, CTI]
featured: false
draft: false
toc: true
comments: false
research_version: "1.0"
research_status: published
leading_topics:
  - Exploited F5, SharePoint and NetScaler systems need separate applicability decisions
  - Device-code phishing and workload identities expose different cloud trust boundaries
  - ENISA's new report describes 2025 observations, not a live attack probability
critical_count: 3
high_count: 2
watch_count: 1
scope: "Six selected developments published during 21–27 September 2026. Earlier vulnerabilities and activity are included only where a new advisory, exploitation assessment or research report appeared during the window."
evidence_basis: "Dated vendor research, CERT-EU and Canadian Cyber Centre advisories, ENISA's publication notice, and immutable official CISA KEV and vendor CNA records available before the cutoff."
methods: [primary-source review, advisory comparison, date-bounded catalogue review]
limitations: "Retrospective synthesis prepared on 4 October using the 27 September information boundary. Mutable advisories may contain later additions. These are not treated as historical evidence. No scanning, exploit execution, original victim telemetry or independent attribution was performed."
key_findings:
  - "F5's vulnerable OAuth role, SharePoint's authenticated entry point and NetScaler's configuration conditions must not be collapsed into one generic internet-facing vulnerability."
  - "A legitimate sign-in page does not prove a legitimate session request, and existing workload permissions can support destructive cloud operations without a new software exploit."
  - "Threat-report publication dates, observation periods and known denominators must remain visible when findings are used for local decisions."
image:
  path: /assets/img/series/hecavex-signal-brief.svg
  social: /assets/img/social/hecavex-signal-brief-009-en.png
  alt: "Signal Brief 9 covering exploited gateways, device-code phishing, cloud identities and European threat assessment"
  thumbnail: /assets/img/series/hecavex-signal-brief.svg
updates:
  - date: 2026-10-04
    note: "Initial retrospective publication covering 21–27 September. Information cutoff: 27 September 2026, 23:59:59 UTC."
---

This week put three different entry points into the urgent queue: an OAuth-serving gateway, an on-premises collaboration server and an application-delivery appliance. The cloud stories were different. There, the attacker could benefit from an authorised session or an already privileged application identity. Treating all five as a patching problem would leave important work unassigned.

**Coverage: 21–27 September 2026. Retrospectively prepared on 4 October, with an information cutoff of 27 September, 23:59:59 UTC.** Six priority blocks follow. They are editorial decisions, not CVSS categories or a complete vulnerability inventory. Version references describe the dated fixes. Readers responding now should consult current vendor guidance.

**Method and limits:** primary reporting was checked against dated advisories and pinned official catalogue records. Mutable pages were not assumed to preserve every historical detail. This is source-led analysis, not HECAVEX incident telemetry. No Lithuanian compromise, exploit reproduction or independent actor attribution is claimed.

## Exploited systems: establish the actual entry path

<section class="hx-signal-entry hx-signal-entry--critical" markdown="1">
<p class="hx-signal-label">CRITICAL · CONFIRMED EXPLOITATION · OAUTH GATEWAY</p>

### F5 BIG-IP APM: the OAuth role determines applicability

<dl><div><dt>Vulnerability</dt><dd>CVE-2026-94127</dd></div><div><dt>Relevant configuration</dt><dd>APM access policy with an OAuth authorisation-server profile</dd></div></dl>

CERT-EU's 22 September alert records active exploitation. F5's dated CNA clarification limits the vulnerable configuration to APM acting as an OAuth **authorisation server**, not client/resource-server-only use. The unauthenticated code-execution issue affects the data plane, not the management plane. [CERT-EU alert](https://cert.europa.eu/publications/security-advisories/2026-013/), [F5 CNA revision](https://github.com/CVEProject/cvelistV5/blob/80247b1f62424a8110c2fdd447910e4b8f69de31/cves/2026/94xxx/CVE-2026-94127.json).

**Do now:** inspect the virtual-server configuration, then obtain the branch-specific engineering hotfix from F5. CERT-EU recommends evidence preservation before remediation and a compromise assessment. Its useful detection sequence combines OAuth failures, suspicious audit commands and a subsequent TMM crash. A crash alone does not establish exploitation. [Dated response guidance](https://cert.europa.eu/publications/security-advisories/2026-013/).

**Assessment:** a locked-down administration interface does not close a vulnerable service receiving intended application traffic. The handoff should name the affected listener, configuration, fix owner and evidence owner. If the inventory merely says "F5 installed," the applicability decision has not been completed.

</section>

<section class="hx-signal-entry hx-signal-entry--critical" markdown="1">
<p class="hx-signal-label">CRITICAL · KNOWN EXPLOITED · ON-PREMISES SHAREPOINT</p>

### SharePoint: an August patch becomes a September incident priority

<dl><div><dt>Vulnerability</dt><dd>CVE-2026-65660</dd></div><div><dt>New prioritisation</dt><dd>24 September national alert and 25 September KEV addition</dd></div></dl>

The Canadian Cyber Centre's 24 September alert confirms exploitation of an issue disclosed on 11 August. The basic flaw permits authenticated code execution. Its warning about a pre-authentication chain is conditional on other SharePoint vulnerabilities and anonymous access, not a property of every deployment. [Canadian alert](https://www.cyber.gc.ca/en/alerts-advisories/al26-023-vulnerability-impacting-microsoft-sharepoint-server-cve-2026-65660).

CISA added it on **25 September**, as the [pre-cutoff KEV revision](https://github.com/cisagov/kev-data/blob/4d1aff213a881341db8a276c89802e05bf69481c/known_exploited_vulnerabilities.json) records. The vendor CNA identifies fixed boundaries of 16.0.5565.1001 for Server 2016, 16.0.10417.20198 for Server 2019 and 16.0.19725.20522 for Subscription Edition. These are historical patch references, not a supported-lifecycle recommendation. [Microsoft CNA revision](https://github.com/CVEProject/cvelistV5/blob/1d0322c45d85b2435c572e56f0a1971061e79310/cves/2026/65xxx/CVE-2026-65660.json).

**Do now:** reopen deferred August tickets and record the actual installed farm build. Separate the update decision from the retrospective access review. Compare each server's patch time with retained authentication, IIS and endpoint evidence. An approved change request proves authorisation to patch. It does not prove installation or absence of earlier compromise. Assign an owner to unresolved evidence gaps instead of marking the entire farm clean because one node is current.

</section>

<section class="hx-signal-entry hx-signal-entry--critical" markdown="1">
<p class="hx-signal-label">CRITICAL · KNOWN EXPLOITED · APPLICATION DELIVERY</p>

### NetScaler: do not reduce two exploited flaws to a DTLS check

<dl><div><dt>Vulnerabilities</dt><dd>CVE-2026-88771 and CVE-2026-88772</dd></div><div><dt>Disclosure boundary</dt><dd>27 September advisories and same-day KEV entries</dd></div></dl>

Citrix's 27 September notice describes unauthenticated command execution through CVE-2026-88771 without an additional feature requirement. CVE-2026-88772 requires DTLS, enabled by default on VPN virtual servers. Both were in [CISA's 27 September catalogue](https://github.com/cisagov/kev-data/blob/4d1aff213a881341db8a276c89802e05bf69481c/known_exploited_vulnerabilities.json). [Citrix notice](https://community.citrix.com/techzone-blogs/110_security-updates/netscaler-adc-and-netscaler-gateway-security-bulletin-for-cve-2026-88771-through-cve-2026-88778/).

The pre-cutoff vendor records list 14.1-73.37 and 13.1-64.23 as fixed regular-branch boundaries, with separate FIPS/NDcPP builds. Use the applicable branch, not whichever version number looks newest. [NetScaler CNA record](https://github.com/CVEProject/cvelistV5/blob/6dee57bc64de2c78a5beaefa323ecfda583854b3/cves/2026/88xxx/CVE-2026-88771.json).

**Do now:** account for both members of each appliance pair, preserve available evidence and apply the relevant supported update. Record which business services lose access if isolation is necessary, and nominate the person authorised to make that decision. A negative DTLS finding does not exclude the first vulnerability. A completed software update is also not a retrospective compromise verdict: keep that question in a separate incident workstream with independent telemetry wherever available.

</section>

## Cloud access: the session and the identity both matter

<section class="hx-signal-entry hx-signal-entry--high" markdown="1">
<p class="hx-signal-label">HIGH PRIORITY · DEVICE-CODE PHISHING · ACCOUNT RECOVERY</p>

### EvilTokens: the genuine sign-in page can authorise the wrong session

<dl><div><dt>New reporting</dt><dd>Microsoft technical analysis and disruption announcement, 22 September</dd></div><div><dt>Defensive boundary</dt><dd>Requested session, tokens and post-login changes</dd></div></dl>

Microsoft describes EvilTokens abusing device-code authentication: the victim completes a legitimate sign-in flow for an attacker-initiated session. Its Digital Crimes Unit announced infrastructure disruption and associated more than 12,000 compromised inboxes with the service. That is Microsoft's observed scope, not a Lithuanian victim count. [Technical research](https://www.microsoft.com/en-us/security/blog/2026/09/22/unmasking-eviltokens-getting-to-the-root-of-device-code-phishing/), [disruption announcement](https://blogs.microsoft.com/on-the-issues/2026/09/22/disrupting-eviltokens-the-ai-chatbot-built-for-cybercrime/).

Microsoft recommends limiting device-code flow to necessary uses. Its response guidance warns that revoking refresh tokens may leave existing access tokens usable temporarily and calls for considering account disablement during containment. [Account-containment guidance](https://www.microsoft.com/en-us/security/blog/2026/09/22/unmasking-eviltokens-getting-to-the-root-of-device-code-phishing/).

**Assessment and action:** "the URL was Microsoft" is not a sufficient incident closure. Ask which application and device the employee intended to authorise. Put the sign-in event, subsequent device registrations and mailbox changes on one timeline. Classify unfamiliar entries before removing them. Record a responsible owner for every necessary authentication-flow exception. Service disruption does not demonstrate that a particular victim's access has been revoked or its mailbox restored.

</section>

<section class="hx-signal-entry hx-signal-entry--high" markdown="1">
<p class="hx-signal-label">HIGH PRIORITY · CLOUD WORKLOAD IDENTITIES · DESTRUCTIVE ACTIVITY</p>

### Storm-3168: measure what the application identity can delete

<dl><div><dt>Report date</dt><dd>25 September, describing tenant activity from June</dd></div><div><dt>Required review</dt><dd>Effective permissions and separately protected recovery</dd></div></dl>

Microsoft's Storm-3168 report describes compromised Azure service principals performing resource discovery, deletion and credential collection. The destructive sequence included roughly seven minutes of activity. Crucially, Microsoft did **not** confirm initial access, successful exfiltration or a ransom note. Its public-secret finding is a possible exposure, not a proven intrusion route. [Microsoft research](https://www.microsoft.com/en-us/security/blog/2026/09/25/storm-3168-agentic-driven-cloud-attacks-using-compromised-service-principals/).

**Assessment:** the practical issue is the permission set already attached to the identity. Neither fast execution nor a threat-actor label proves that every step was independently planned by an AI system. The usable defensive question is whether one application identity can destroy production data and impair the recovery path.

**Do now:** review effective permissions, including inherited grants, and compare them with the application's documented purpose. In an authorised test environment, exercise the containment handoff with a simulated identity compromise. Check who can suspend access, what dependent workloads stop, and whether recovery remains accessible to a separate trusted operator. Preserve cloud audit records outside the same administrative failure boundary. A backup job and an independently recoverable service are different test results.

</section>

## European threat assessment: keep the denominator attached

<section class="hx-signal-entry hx-signal-entry--watch" markdown="1">
<p class="hx-signal-label">WATCH · EUROPE · ANALYTICAL BASELINE</p>

### ENISA Threat Landscape 2026 is a report about 2025 observations

<dl><div><dt>Publication</dt><dd>22 September 2026</dd></div><div><dt>Observation window</dt><dd>1 January–31 December 2025</dd></div></dl>

ENISA's new report combines open-source events with anonymised contributions. Its accompanying release identifies exploitation in about 60% of unauthorised-access cases **where the entry vector was known**. That known-vector subset was only about 5% of unauthorised-access incidents. Dropping that qualifier turns a bounded observation into a misleading general rate. [ENISA publication](https://www.enisa.europa.eu/publications/enisa-threat-landscape-2026), [dated explanation](https://www.enisa.europa.eu/news/exploring-the-evolution-of-the-cyber-threat-landscape-how-dependencies-weaken-our-digital-resilience).

**Assessment and action:** use this as a source of questions for the local estate, not a probability calculator for a Lithuanian organisation. Pick one important business service and map its identity provider, hosting, remote administration and recovery dependencies. Require an owner and a tested fallback for each dependency. When presenting the report internally, retain observation dates, collection limits and denominator beside every percentage. Counted incidents, financial impact and the consequences of losing a particular service answer different management questions.

</section>
