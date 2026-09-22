---
published: true
title: "Signal Brief #8: exploited security appliances, hosting privileges and DNS availability"
card_title: "Signal Brief #8: security appliances, hosting and DNS"
description: "Exploited Cisco ISE and email gateways, Acronis hosting integrations, three Linux KEV additions, BIND fixes and Lithuania's CRA reporting route. Coverage: 14–20 September 2026."
seo_description: "Defender priorities for Cisco ISE, Secure Email Gateway, Acronis backup plugins, Linux and BIND, with Lithuania's CRA reporting guidance."
seo_title: "Cisco, Linux and DNS Priorities | Signal Brief #8"
seo_keywords: [CVE-2026-76460, CVE-2026-76461, CVE-2026-87886, Linux KEV, BIND, CRA Lithuania]
date: 2026-09-22 14:00:00 +0300
last_reviewed_at: 2026-09-22 14:00:00 +0300
lang: en
translation_key: hecavex-signal-brief-008
permalink: /en/briefings/2026-09-20/
author: deividas-lis
content_type: signal-brief
series: hecavex-signal-brief
issue: 8
coverage_start: 2026-09-14
coverage_end: 2026-09-20
information_cutoff: 2026-09-20 23:59:59 +0000
confidence: moderate
tlp: clear
categories: [security-briefings]
tags: [Cisco, Linux, DNS, hosting, CISA KEV, Cyber Resilience Act]
featured: false
draft: false
toc: true
comments: false
research_version: "1.0"
research_status: published
leading_topics:
  - Two exploited Cisco products require different recovery decisions
  - Hosting backup integrations and Linux kernel prerequisites
  - DNS availability and the Lithuanian CRA reporting route
critical_count: 2
high_count: 3
watch_count: 1
scope: "Six selected defensive developments from 14–20 September 2026, with older technical records used only to explain vulnerabilities whose prioritisation changed during the window."
evidence_basis: "Dated vendor and national-authority notices, Cisco PSIRT advisories, ISC advisories, NKSC guidance and official CISA/CVE repository revisions published before the cutoff."
methods: [primary-source review, advisory comparison, date-bounded catalogue review]
limitations: "Retrospective synthesis compiled on 22 September from material available by 20 September, not an original incident investigation. No local scanning, exploitation tests or victim telemetry. Exploitation somewhere does not establish compromise in Lithuania or the reader's organisation."
key_findings:
  - "ISE authentication bypass and email-parser exploitation have different entry paths, but both require a compromise decision as well as a patch decision."
  - "A local privilege requirement does not make a flaw marginal on multi-tenant hosting. Kernel findings must still be separated by reachable subsystem and attacker position."
  - "DNS remediation should preserve service continuity. Lithuanian manufacturers also need an operational reporting owner, not merely awareness of CRA deadlines."
image:
  path: /assets/img/series/hecavex-signal-brief.svg
  social: /assets/img/social/hecavex-signal-brief-008-en.png
  alt: "Signal Brief 8 covering security appliances, hosting privileges, DNS and reporting readiness"
  thumbnail: /assets/img/series/hecavex-signal-brief.svg
updates:
  - date: 2026-09-22
    note: "Initial retrospective publication covering 14–20 September. Information cutoff: 20 September 2026, 23:59:59 UTC."
---

The useful question this week is not "how many critical vulnerabilities?" It is "which trust boundary can fail, and what would remain trustworthy afterwards?" An identity service, a mail gateway, a backup integration and a DNS resolver sit in different inventories. Losing any of them can make several apparently unrelated services fail together.

**Coverage: 14–20 September 2026. Compiled on 22 September using material published by the cutoff.** The six priority labels below are editorial work queues, not six CVSS ratings or a complete list of that week's vulnerabilities. "Do now" describes the response justified by the dated evidence. Teams acting later should also check the vendor's current supported release.

**Method and limits:** dated vendor notices and national guidance were compared with pre-cutoff CISA and CVE repository revisions. This is a source-led assessment, not HECAVEX incident telemetry. No scanning, exploit reproduction, victim validation or independent campaign measurement was performed. Recommendations are analysis, not legal advice or a substitute for vendor recovery procedures.

## Security appliances: patching and recovery are separate decisions

<section class="hx-signal-entry hx-signal-entry--critical" markdown="1">
<p class="hx-signal-label">CRITICAL · CONFIRMED EXPLOITATION · IDENTITY INFRASTRUCTURE</p>

### Cisco ISE: an API bypass reaches beyond a login page

<dl><div><dt>Vulnerability</dt><dd>CVE-2026-76460</dd></div><div><dt>Entry condition</dt><dd>Unauthenticated access to an affected API endpoint</dd></div></dl>

Cisco's 16 September advisory confirms active exploitation of an authentication bypass affecting ISE and ISE-PIC regardless of configuration. It warns that successful exploitation can lead to root command execution. Restricting management traffic is a temporary mitigation, not a software fix. [Cisco PSIRT advisory](https://sec.cloudapps.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-ISE-ABP-VNSW7Tn5).

**Do now:** enumerate every node, record its branch and patch level, and restrict administrative reachability while applying the appropriate update. The branch fixes are 3.1 Patch 12, 3.2 Patch 11, 3.3 Patch 12, 3.4 Patch 7 and ISE 3.5 Patch 4. Review access and external network logs, not only the appliance's current health screen. [Canadian Cyber Centre action guidance](https://www.cyber.gc.ca/en/alerts-advisories/al26-021-vulnerabilities-impacting-cisco-identity-services-engine-ise-cisco-ise-passive-identity-connector-ise-pic-cve-2026-20192-cve-2026-76423-cve-2026-76460).

There is a lifecycle trap: Cisco identifies 3.4 as the final supported ISE-PIC release, and says the older ISE 3.1/3.2 branches receive only critical fixes during their maintenance phase. An emergency patch and a supported migration plan are different deliverables. [Cisco hardening release](https://sec.cloudapps.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-hardening-ise-XU5EwX5T).

**Assessment:** an identity appliance should not be cleared because authentication still works. Establish who owns the compromise review, which independent logs survive, and what integrations must be revalidated if trust in a node is lost.

</section>

<section class="hx-signal-entry hx-signal-entry--critical" markdown="1">
<p class="hx-signal-label">CRITICAL · CONFIRMED EXPLOITATION · EMAIL PROCESSING</p>

### Cisco Secure Email Gateway: incoming mail is the entry path

<dl><div><dt>Vulnerability</dt><dd>CVE-2026-76461</dd></div><div><dt>Recovery boundary</dt><dd>Individual appliance and its cluster relationships</dd></div></dl>

The 14 September Cisco disclosure describes unauthenticated SQL injection through a crafted email, potentially ending in root command execution. Cisco confirmed exploitation. JPCERT/CC's 15 September notice explains why the gateway's own logs are insufficient when an attacker can remove traces. [JPCERT/CC advisory](https://www.jpcert.or.jp/at/2026/at260027.html).

The dated fixed releases are AsyncOS 15.5.5-014, 16.0.4-302 and 16.5.0-780. Confirm the product as well as its version rather than confusing Secure Email Gateway with the separate management product. [Canadian Cyber Centre bulletin](https://www.cyber.gc.ca/en/alerts-advisories/cisco-security-advisory-av26-921).

Cisco's 17 September update adds a recovery consequence: a compromised cluster member can expose the SSH keys used between appliances. Its guidance therefore extends secure restoration to the cluster. For virtual appliances with suspected exploitation, preserve forensic material before rebuilding and renewing credentials and cryptographic material. [Cisco advisory and recovery guidance](https://sec.cloudapps.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-esa-inj-2bLVGmhX).

**Do now:** connect the mail-service owner, incident responder and network team before changing the appliance. Capture the retained mail and network evidence, check each member, then distinguish a routine update from incident recovery. An inaccessible administration page does not neutralise an exploit delivered through the service's intended mail flow.

</section>

## Hosting: local access can already be part of the business model

<section class="hx-signal-entry hx-signal-entry--high" markdown="1">
<p class="hx-signal-label">HIGH PRIORITY · CONFIRMED EXPLOITATION · BACKUP INTEGRATIONS</p>

### Acronis: inventory the plugin, not just the backup brand

<dl><div><dt>Vulnerability</dt><dd>CVE-2026-87886</dd></div><div><dt>Required position</dt><dd>Low-privileged local access on affected Linux hosting</dd></div></dl>

Acronis reports limited targeted exploitation against its cPanel &amp; WHM backup plugin. This is a file-permission privilege-escalation issue, not unauthenticated internet code execution. Its advisory lists fixed builds for cPanel &amp; WHM (1.9.3.1021), Plesk (1.8.11.638) and DirectAdmin (1.2.3.238). Affected-product coverage is broader than the specifically reported exploitation. [Acronis SEC-10986](https://security-advisory.acronis.com/advisories/SEC-10986) and [dated Acronis CNA record](https://github.com/CVEProject/cvelistV5/blob/f79fe51ea817130bfc292a98b00a954943a445a7/cves/2026/87xxx/CVE-2026-87886.json).

**Assessment:** on shared hosting, a customer account or compromised website may already supply the local foothold. "Requires local access" must therefore be tested against the tenancy model, not treated as a reason to ignore the finding.

**Do now:** ask the hosting operator for the installed integration and build, including delegated or reseller services. Review unexpected privileged execution and backup configuration changes. Keep an independently protected recovery copy. A successful scheduled backup is not evidence that the host or its recovery path remained trustworthy.

</section>

<section class="hx-signal-entry hx-signal-entry--high" markdown="1">
<p class="hx-signal-label">HIGH PRIORITY · KNOWN EXPLOITED · KERNEL PREREQUISITES</p>

### Three Linux KEV additions are not one remote exploit

<dl><div><dt>Prioritisation change</dt><dd>Three CISA KEV additions on 18 September</dd></div><div><dt>Decision fields</dt><dd>Running kernel, subsystem, attacker access and distributor patch status</dd></div></dl>

The dated CISA catalogue includes CVE-2025-39964, CVE-2026-53266 and CVE-2025-39682 as known exploited. It does not name a campaign or Lithuanian victim. [CISA's pre-cutoff catalogue revision](https://github.com/cisagov/kev-data/blob/8f26120eca10ef7425d7dc4154754b9276a8200a/known_exploited_vulnerabilities.json).

The Linux CNA records separate their starting conditions:

- **CVE-2025-39964:** concurrent AF_ALG writes, reachable by a local unprivileged process. [Linux CNA record](https://github.com/CVEProject/cvelistV5/blob/30e3cd0ad298b1a308f341329800996ba1e2e525/cves/2025/39xxx/CVE-2025-39964.json).
- **CVE-2026-53266:** the ebtables SNAT path needs local control of the relevant bridge configuration and memory conditions. Namespace-local `CAP_NET_ADMIN` can matter. Remote ARP traffic alone is not the described prerequisite. [Linux CNA record](https://github.com/CVEProject/cvelistV5/blob/30e3cd0ad298b1a308f341329800996ba1e2e525/cves/2026/53xxx/CVE-2026-53266.json).
- **CVE-2025-39682:** the CNA describes a network-reachable receive path on a kTLS-enabled socket. Do not label the entire group local-only, or equate every HTTPS service with kTLS receive use. [Linux CNA record](https://github.com/CVEProject/cvelistV5/blob/30e3cd0ad298b1a308f341329800996ba1e2e525/cves/2025/39xxx/CVE-2025-39682.json).

**Do now:** make three applicability decisions. Match the running kernel to the distributor's fix, including backports and pending reboot state. Record whether untrusted workloads can reach the relevant interfaces. For appliances, obtain the supplier's assessment rather than substituting an upstream version comparison for product support.

</section>

## DNS availability and Lithuanian reporting readiness

<section class="hx-signal-entry hx-signal-entry--high" markdown="1">
<p class="hx-signal-label">HIGH PRIORITY · VENDOR FIXES · DNS CONTINUITY</p>

### BIND: a DoH crash and resolver exhaustion need different checks

<dl><div><dt>Advisory date</dt><dd>16 September</dd></div><div><dt>Evidence status</dt><dd>ISC reported no known active exploitation for these two flaws</dd></div></dl>

ISC describes CVE-2026-77692 as a remotely triggered `named` crash through malformed DNS-over-HTTPS traffic and premature connection closure. CVE-2026-81563 instead concerns resource exhaustion while a resolver processes particular SVCB/HTTPS record relationships. The first requires the DoH path. The second must not be dismissed merely because DoH is disabled. [ISC DoH advisory](https://kb.isc.org/docs/cve-2026-77692), [ISC resolver advisory](https://kb.isc.org/docs/cve-2026-81563).

ISC lists 9.20.29 and 9.21.26 as the corresponding fixed releases, with 9.20.29-S1 for the supported preview branch. Check the branch and distribution packaging rather than moving a production resolver to a different release line solely because its number is higher. The resolver advisory also identifies affected 9.18 versions without offering a new 9.18 fix.

**Do now:** separate authoritative servers, recursive resolvers and DoH listeners in the inventory. Stage updates so redundant DNS services are not restarted together. Verify name resolution from dependent applications and monitor unexpected exits, memory pressure and resolution failures. These are investigation leads, not exploit-specific proof.

</section>

<section class="hx-signal-entry hx-signal-entry--watch" markdown="1">
<p class="hx-signal-label">WATCH · LITHUANIA · REPORTING OPERATIONS</p>

### NKSC clarifies the manufacturer's reporting route

<dl><div><dt>New local guidance</dt><dd>NKSC, 14 September</dd></div><div><dt>Operational question</dt><dd>Who can submit an evidence-backed first report?</dd></div></dl>

The CRA reporting start was covered in [Brief #7](/en/briefings/2026-09-13/). This week's Lithuanian follow-up identifies NKSC as coordinator for manufacturers headquartered in Lithuania and directs reports through ENISA's CRA-SRP. NKSC says registration can be completed with the first early warning. [NKSC guidance](https://nksc.lrv.lt/lt/naujienos/keiciasi-kibernetinio-saugumo-taisykles-gamintojams-isigalioja-naujos-pranesimu-teikimo-pareigos-pagal-kibernetinio-atsparumo-akta-RBA/).

**Do now:** assign an owner and deputy, rehearse portal access without submitting a fictional incident, and prepare fields for product, versions, discovery time, exploitation evidence and unresolved questions. Keep observed facts separate from assessment. A vulnerability-management queue for software you use is not automatically the reporting workflow for a product you manufacture. Applicability needs its own documented review.

</section>
