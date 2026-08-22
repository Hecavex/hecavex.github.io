---
title: "Signal Brief #2: N-central takeover, TeamCity exploitation and exposed management planes"
card_title: "Signal Brief #2: N-central, TeamCity and exposed management planes"
description: "Five actively exploited vulnerability priorities, the Adform JavaScript supply-chain incident and practical checks for defenders. Coverage: 3–9 August 2026."
date: 2026-08-09 12:00:00 +0300
lang: en
translation_key: hecavex-signal-brief-002
permalink: /en/briefings/2026-08-09/
author: deividas-lis
content_type: signal-brief
series: hecavex-signal-brief
issue: 2
coverage_start: 2026-08-03
coverage_end: 2026-08-09
information_cutoff: 2026-08-09 11:30:00 +0300
confidence: high
tlp: clear
categories: [security-briefings]
tags: [CISA KEV, N-able, N-central, Langflow, TeamCity, Progress LoadMaster, Apache Tomcat, Adform, supply-chain security]
featured: false
draft: false
toc: true
comments: false
leading_topics:
  - Five exploited vulnerabilities requiring action
  - Management and build infrastructure exposure
  - Adform JavaScript supply-chain compromise
critical_count: 4
high_count: 1
watch_count: 1
scope: "Defender-relevant developments added to CISA KEV or materially updated between 3 and 9 August 2026, plus one independently analysed supply-chain incident."
limitations: "This is a prioritisation brief, not a complete threat landscape. Exposure, affected versions, vendor guidance and compromise evidence must be verified in each environment."
key_findings:
  - "Remote management, CI/CD and load-balancing systems dominate the urgent queue because compromise can provide control beyond the vulnerable server itself."
  - "N-central shows why installing the first hotfix is not the same thing as closing an incident: CVE-2026-18577 followed an incomplete fix and required additional mitigation."
  - "The Adform case shows that a trusted browser-side dependency can modify transaction data without installing persistent malware on the visitor's device."
image:
  path: /assets/img/series/hecavex-signal-brief.svg
  social: /assets/img/social/hecavex-signal-brief-002-en.png
  alt: "An analytical signal crossing a radar of exposed management systems, build infrastructure and supply-chain dependencies"
  thumbnail: /assets/img/series/hecavex-signal-brief.svg
updates:
  - date: 2026-08-09
    note: "Initial publication. Information cut-off: 11:30 EEST."
---

This week is mostly about systems that defenders use to control other systems. Remote monitoring, CI/CD and load-balancing platforms are useful precisely because they have reach. That same reach becomes the attacker's multiplier when the management plane is left exposed.

## Vulnerabilities to triage

<section class="hx-signal-entry hx-signal-entry--critical" markdown="1">
<p class="hx-signal-label">CRITICAL · KNOWN EXPLOITED · INCOMPLETE FIX</p>

### CVE-2026-18577 and CVE-2026-18556: N-able N-central

<dl><div><dt>Affected surface</dt><dd>N-central remote monitoring and management servers</dd></div><div><dt>Attack result</dt><dd>Authentication bypass and account takeover</dd></div></dl>

CISA added both authentication-bypass vulnerabilities to KEV during the week. CVE-2026-18577 represents an alternate path left after the earlier CVE-2026-18556 fix. That distinction matters because an N-central compromise is not confined to one web application. The platform is designed to administer downstream endpoints.

**Do now:** follow N-able's latest guidance and deploy the current additional mitigation, not a superseded first hotfix. Confirm the installed build, reduce internet exposure, review newly created or modified accounts, remote sessions, scripts and activity targeting high-value systems. Treat an exposed, unpatched server as an incident-scoping problem.

<p class="hx-signal-source"><a href="https://status.n-able.com/2026/08/06/n-central-2026-3-hotfix-2-additional-mitigation-for-cve-2026-18577/">Read N-able's Hotfix 2 notice →</a> · <a href="https://www.cisa.gov/known-exploited-vulnerabilities-catalog?search_api_fulltext=CVE-2026-18577">CISA KEV entry →</a></p>
</section>

<section class="hx-signal-entry hx-signal-entry--critical" markdown="1">
<p class="hx-signal-label">CRITICAL · KNOWN EXPLOITED · UNAUTHENTICATED RCE</p>

### CVE-2026-9198: IBM Langflow

<dl><div><dt>Affected surface</dt><dd>Default Langflow deployments</dd></div><div><dt>Attack result</dt><dd>Code execution without authentication</dd></div></dl>

CISA describes an unauthenticated code-injection path leading to full remote code execution on default deployments. An AI workflow builder is still a server with credentials, integrations and access to data. Calling it an "AI tool" does not make ordinary exposure management optional.

**Do now:** identify reachable Langflow instances, apply IBM's fixed release guidance, remove unnecessary public access and review process execution, outbound connections, secrets and workflow changes. If the service was exposed before remediation, patching alone does not answer whether it was used.

<p class="hx-signal-source"><a href="https://www.ibm.com/support/pages/node/7278927">Read the IBM security bulletin →</a> · <a href="https://www.cisa.gov/known-exploited-vulnerabilities-catalog?search_api_fulltext=CVE-2026-9198">CISA KEV entry →</a></p>
</section>

<section class="hx-signal-entry hx-signal-entry--critical" markdown="1">
<p class="hx-signal-label">CRITICAL · ACTIVE EXPLOITATION · CI/CD</p>

### CVE-2026-63077: JetBrains TeamCity

<dl><div><dt>Affected surface</dt><dd>TeamCity On-Premises reachable over HTTP(S)</dd></div><div><dt>Attack result</dt><dd>Unauthenticated operating-system command execution</dd></div></dl>

JetBrains now reports active and attempted exploitation against unpatched servers. The flaw is reached through the agent polling protocol. Successful exploitation can expose stored credentials, alter server state and undermine build artifacts or downstream pipelines.

**Do now:** upgrade to 2025.11.7 or 2026.1.3, or apply the security patch plugin where an immediate upgrade is impossible. Search logs for `com.thoughtworks.xstream.converters.ConversionException`, review unauthorized agents, especially names beginning with `scan`, and investigate credentials available to the server and its builds.

<p class="hx-signal-source"><a href="https://blog.jetbrains.com/teamcity/2026/08/cve-2026-63077-update/">Read JetBrains' exploitation update →</a> · <a href="https://www.cisa.gov/known-exploited-vulnerabilities-catalog?search_api_fulltext=CVE-2026-63077">CISA KEV entry →</a></p>
</section>

<section class="hx-signal-entry hx-signal-entry--critical" markdown="1">
<p class="hx-signal-label">CRITICAL · KNOWN EXPLOITED · EDGE INFRASTRUCTURE</p>

### CVE-2026-8037: Progress Kemp LoadMaster

<dl><div><dt>Affected surface</dt><dd>LoadMaster GA 7.2.63.1 and earlier; LTSF 7.2.54.17 and earlier</dd></div><div><dt>Attack result</dt><dd>Pre-authentication command injection</dd></div></dl>

The vulnerability permits arbitrary command execution through unsanitised input in multiple command endpoints. Load balancers live in a particularly useful part of the network: externally reachable, trusted and positioned in front of applications defenders actually care about.

**Do now:** apply the latest Progress fix, restrict administrative access and review appliance logs, configuration changes, new accounts, unexpected outbound traffic and signs of follow-on access to systems behind the load balancer.

<p class="hx-signal-source"><a href="https://community.progress.com/s/article/LoadMaster-Critical-Security-Bulletin-June-2026-CVE-2026-8037-CVE-2026-33691">Read the Progress bulletin →</a> · <a href="https://www.cisa.gov/known-exploited-vulnerabilities-catalog?search_api_fulltext=CVE-2026-8037">CISA KEV entry →</a></p>
</section>

<section class="hx-signal-entry hx-signal-entry--high" markdown="1">
<p class="hx-signal-label">HIGH PRIORITY · KNOWN EXPLOITED · CLUSTER SECURITY</p>

### CVE-2026-34486: Apache Tomcat EncryptInterceptor bypass

<dl><div><dt>Affected condition</dt><dd>Tomcat clustering using the affected EncryptInterceptor implementation</dd></div><div><dt>Why it matters</dt><dd>A prior security fix could be bypassed</dd></div></dl>

Apache states that an error in the CVE-2026-29146 fix allowed EncryptInterceptor protection to be bypassed. CISA also notes that the condition can be chained with CVE-2025-24813. This one is configuration-sensitive, so the useful question is not simply "do we run Tomcat?" but "do we use the affected clustering path, on which versions, across which trust boundary?"

**Do now:** inventory Tomcat clusters and versions, move to the fixed release for the maintained branch, verify EncryptInterceptor configuration and keep cluster traffic off untrusted networks.

<p class="hx-signal-source"><a href="https://tomcat.apache.org/security-9.html">Read Apache Tomcat's vulnerability record →</a> · <a href="https://www.cisa.gov/known-exploited-vulnerabilities-catalog?search_api_fulltext=CVE-2026-34486">CISA KEV entry →</a></p>
</section>

## Development worth watching

<section class="hx-signal-entry hx-signal-entry--watch" markdown="1">
<p class="hx-signal-label">WATCH · SOFTWARE SUPPLY CHAIN · BROWSER-SIDE IMPACT</p>

### Adform's shared JavaScript became a crypto clipper

The compromised `trackpoint-async.js` did not need to install malware on every visitor. While an affected page was open, the appended code could replace Bitcoin and Ethereum addresses in page text, form fields and clipboard-related events. My analysis recovered four payload variants and found 83 exact-hash observations across 59 hosts. Fifty-five hosts received at least one variant containing valid replacement wallets; four only received the early variant with invalid address strings.

**Do now:** identify where the script was loaded, search cached and edge-served responses beyond the central incident window, preserve affected JavaScript and browser evidence, and review cryptocurrency workflows that trusted browser-rendered addresses. A clean origin response today does not prove every intermediary cache was clean yesterday.

<p class="hx-signal-source"><a href="/en/research/adform-supply-chain-crypto-clipper/">Read the complete HECAVEX investigation →</a> · <a href="https://site.adform.com/resources/newsroom/security-incident-company-update/">Read Adform's incident update →</a></p>
</section>

## Bottom line

Start with **reach and blast radius**. N-central, TeamCity and LoadMaster can affect far more than the first compromised process. Confirm the latest fix actually installed, then look backwards for exploitation instead of declaring victory at the end of an upgrade wizard. For the Adform incident, include browser-side dependencies and stale caches in the investigation scope.

All vulnerability priorities above were present in CISA KEV by the stated information cut-off. Vendor guidance and exploitation details can change after publication.
