---
title: "Signal Brief #5: exploited developer platforms, AI control planes and camera exposure"
card_title: "Signal Brief #5: developer platforms, AI control planes and exposed cameras"
description: "Eleven additions to CISA KEV, attacks on AI gateways and orchestration services, camera exposure guidance and a Lithuania phishing report. Coverage: 22–30 August 2026."
seo_description: "A defensive briefing on eleven CISA KEV additions, attacks on AI services, exposed cameras and a Lithuanian marketplace phishing case."
seo_title: "Gitea, ownCloud and AI Gateway Attacks | Brief #5"
seo_keywords:
  - "Gitea CVE-2026-60004 exploitation"
  - "ownCloud CVE-2023-49105"
  - "Oracle CVE-2026-21962"
  - "AI gateway attacks LiteLLM RAGFlow Kestra"
  - "CISA KEV August 2026"
date: 2026-08-30 15:30:00 +0300
lang: en
translation_key: hecavex-signal-brief-005
permalink: /en/briefings/2026-08-30/
author: deividas-lis
content_type: signal-brief
series: hecavex-signal-brief
issue: 5
coverage_start: 2026-08-22
coverage_end: 2026-08-30
information_cutoff: 2026-08-30 15:00:00 +0300
confidence: high
tlp: clear
categories: [security-briefings]
tags: [CISA KEV, CTI, phishing]
featured: false
draft: false
toc: true
comments: false
leading_topics:
  - Gitea, Oracle and ownCloud under known exploitation
  - Different remediation queues inside one KEV batch
  - AI gateways and orchestration services as credential stores
  - Camera exposure and a Lithuanian marketplace phishing report
critical_count: 3
high_count: 4
watch_count: 2
scope: "Defender-relevant developments published or added to CISA KEV between 22 and 30 August 2026, plus official Microsoft, Lithuanian institutional and police reporting from the same period."
limitations: "This is a prioritisation brief, not a complete threat landscape. A KEV entry confirms exploitation somewhere, not exploitation in a specific organisation. Vendor severity, CISA inclusion and Lithuanian relevance are assessed separately."
key_findings:
  - "Developer and content platforms are control planes: Gitea, Artifactory and ownCloud should be prioritised according to access, exposure and the secrets or data they can reach."
  - "AI gateways, retrieval services and workflow orchestrators concentrate provider keys, database access and execution capability, making an application compromise materially wider than one container."
  - "Physical-security telemetry can become intelligence collection, while a familiar marketplace conversation can still terminate at a credential-harvesting page."
image:
  path: /assets/img/series/hecavex-signal-brief.svg
  social: /assets/img/social/hecavex-signal-brief-005-en.png
  alt: "An analytical signal crossing developer platforms, AI control planes, cloud storage and exposed cameras"
  thumbnail: /assets/img/series/hecavex-signal-brief.svg
updates:
  - date: 2026-08-30
    note: "Initial publication. Information cut-off: 15:00 EEST."
---

This week's urgent queue is not one product family. It is a set of systems that sit unusually close to code, credentials and data: a source-code forge, an Oracle web tier, a file-sharing platform, an artifact repository and several AI control planes. CISA added eleven vulnerabilities to its Known Exploited Vulnerabilities catalogue during the coverage window. The entries share exploitation evidence, but they do not share the same prerequisites, impact or remediation path. CISA records known ransomware-campaign use as "Unknown" for all eleven.

That distinction matters. A critical score describes potential impact under defined conditions. KEV inclusion says exploitation has been observed. Neither tells you whether your instance was reachable, vulnerable or compromised. Inventory, exposure and evidence still have to complete the sentence.

## Developer and content platforms

<section class="hx-signal-entry hx-signal-entry--critical" markdown="1">
<p class="hx-signal-label">CRITICAL · KNOWN EXPLOITED · SOURCE-CODE INFRASTRUCTURE</p>

### CVE-2026-60004: a repository write becomes Gitea command execution

<dl><div><dt>Key prerequisites</dt><dd>Git 2.32+, enabled diffpatch route, writable and executable temporary filesystem</dd></div><div><dt>Required access</dt><dd>Repository write, while open registration only removes the need for a pre-existing account</dd></div></dl>

CISA added CVE-2026-60004 to KEV on 25 August. Gitea's advisory describes a code-injection path in which attacker-controlled patch content can place an executable Git hook inside a temporary bare clone. Git then invokes the hook while writing the index, executing arbitrary shell commands as the Gitea operating-system user.

The phrase "requires repository write access" should not automatically lower the priority. Where open registration is enabled, a visitor may obtain that access by creating an ordinary account and repository. A successful compromise can expose `app.ini`, process secrets, mounted repositories, database credentials, OAuth material and services reachable from the Gitea host. The affected range is Gitea 1.17 through versions before 1.27.1.

**Do now:** identify every self-hosted Gitea instance, confirm its version, registration policy, internet exposure and whether the `diffpatch` route is available. Upgrade to 1.27.1 or later. Review repository-creation events, unusual patch requests, Git child processes, modifications under temporary Git directories and shell activity from the Gitea service account. If exploitation cannot be excluded, rotate application, database, OAuth and integration secrets after preserving evidence.

<p class="hx-signal-source"><a href="https://www.cisa.gov/news-events/alerts/2026/08/25/cisa-adds-one-known-exploited-vulnerability-catalog">Read the CISA exploitation notice →</a> · <a href="https://github.com/go-gitea/gitea/security/advisories/GHSA-rcr6-4jqh-j84m">Read the Gitea advisory →</a></p>
</section>

<section class="hx-signal-entry hx-signal-entry--critical" markdown="1">
<p class="hx-signal-label">CRITICAL · KNOWN EXPLOITED · ORACLE WEB TIER</p>

### CVE-2026-21962: exposed Oracle proxy components move to the front of the queue

<dl><div><dt>Affected component</dt><dd>Oracle HTTP Server and WebLogic Server Proxy Plug-in</dd></div><div><dt>Vendor severity</dt><dd>CVSS 10.0, remotely exploitable without authentication</dd></div></dl>

CISA added CVE-2026-21962 on 24 August. The KEV record describes improper access control in Oracle HTTP Server and the WebLogic Server Proxy Plug-in that can allow an unauthenticated remote attacker to obtain complete access to and modify data exposed through the affected component. Oracle addressed the flaw in its January 2026 Critical Patch Update and lists affected 12.2.1.4.0, 14.1.1.0.0 and 14.1.2.0.0 branches.

The proxy tier deserves separate inventory attention because it may be operated as web infrastructure rather than recorded beside the WebLogic applications it fronts. A patched backend does not answer whether an older HTTP Server or plug-in remains reachable at another ingress point.

**Do now:** enumerate Oracle HTTP Server and WebLogic proxy deployments from load-balancer, reverse-proxy and DNS records, not only application inventories. Confirm the exact installed component and patch level, remove unused public listeners, and preserve HTTP, proxy and WebLogic logs. Review unexpected administrative access, data changes and requests that reached protected application paths before the patch was applied.

<p class="hx-signal-source"><a href="https://www.cisa.gov/news-events/alerts/2026/08/24/cisa-adds-one-known-exploited-vulnerability-catalog">Read the CISA exploitation notice →</a> · <a href="https://www.oracle.com/security-alerts/cpujan2026.html">Read Oracle's January 2026 Critical Patch Update →</a></p>
</section>

<section class="hx-signal-entry hx-signal-entry--critical" markdown="1">
<p class="hx-signal-label">CRITICAL · KNOWN EXPLOITED · FILE-SHARING DATA</p>

### CVE-2023-49105: an old ownCloud flaw enters the active queue

<dl><div><dt>Affected versions</dt><dd>ownCloud Server 10.6.0 through 10.13.0</dd></div><div><dt>Possible result</dt><dd>Unauthenticated file access, modification or deletion</dd></div></dl>

CISA added CVE-2023-49105 on 27 August, almost three years after ownCloud published its advisory. If an attacker knows a victim's username and that account has no signing key configured, the WebDAV pre-signed URL flaw can permit access to, modification of or deletion of the user's files without authentication. ownCloud rates the issue 9.8 and recommends upgrading affected Server deployments to 10.13.3 or applying the vendor-provided patch.

Age is not a mitigating control. A legacy service may survive because it is quiet, belongs to a departed owner or sits behind a hostname absent from the current CMDB. KEV inclusion changes the triage question from "is this old?" to "does any vulnerable instance still exist, and what evidence remains?"

**Do now:** discover ownCloud Server through DNS, certificates, reverse proxies and package inventories. Distinguish classic ownCloud Server from Infinite Scale and managed services, which the vendor says are not affected. Upgrade or apply the patch, then review WebDAV access and file-change history for unusual pre-signed URL activity. Preserve audit records before retention jobs remove the period of exposure.

<p class="hx-signal-source"><a href="https://www.cisa.gov/news-events/alerts/2026/08/27/cisa-adds-three-known-exploited-vulnerabilities-catalog">Read the CISA exploitation notice →</a> · <a href="https://owncloud.com/security-advisories/webdav-api-authentication-bypass-using-pre-signed-urls/">Read the ownCloud advisory →</a> · <a href="https://owncloud.com/blogs/immediate-action-required-critical-security-updates-for-owncloud/">Read ownCloud's remediation notice →</a></p>
</section>

<section class="hx-signal-entry hx-signal-entry--high" markdown="1">
<p class="hx-signal-label">HIGH PRIORITY · ARTIFACT REPOSITORY · TWO EVIDENCE QUEUES</p>

### Artifactory shows why severity and exploitation are different columns

<dl><div><dt>Known exploited</dt><dd>CVE-2026-66384, authenticated path restriction flaw</dd></div><div><dt>New critical advisory</dt><dd>CVE-2026-82329, potential authentication bypass</dd></div></dl>

CISA added **CVE-2026-66384** to KEV on 27 August. JFrog describes it as a medium-severity condition in which an authenticated user may write data outside the intended Docker cache path under specific remote-repository conditions. The modest vendor score does not erase the observed-exploitation signal.

On 28 August, JFrog separately published **CVE-2026-82329**, a critical potential authentication bypass leading to Artifactory administrative access across listed 7.111, 7.117, 7.125, 7.133, 7.146 and 7.161 release lines. At the information cut-off it was not listed in KEV. That absence is not proof of non-exploitation. It means the two issues enter the queue for different reasons: one has observed exploitation, while the other has higher potential impact according to the vendor.

**Do now:** compare the deployed Artifactory release with JFrog's current fixed versions, review anonymous and low-privilege access, and map remote Docker repositories and cache paths. Inspect new administrative users or tokens, permission changes, unexpected writes outside repository paths, modified artifacts and downstream builds that consumed them. Protect Artifactory credentials as software supply-chain credentials, not as a routine package-cache secret.

<p class="hx-signal-source"><a href="https://www.cisa.gov/news-events/alerts/2026/08/27/cisa-adds-three-known-exploited-vulnerabilities-catalog">Read the CISA exploitation notice →</a> · <a href="https://docs.jfrog.com/releases/docs/jfrog-security-advisories">Review JFrog security advisories →</a></p>
</section>

## One KEV batch, several remediation paths

<section class="hx-signal-entry hx-signal-entry--high" markdown="1">
<p class="hx-signal-label">HIGH PRIORITY · KNOWN EXPLOITED · PREREQUISITES MATTER</p>

### Seven more entries should not become one generic patch ticket

<dl><div><dt>Network-facing paths</dt><dd>NetScaler denial of service, SQL Server remote code execution and Ajax.NET deserialization</dd></div><div><dt>Local privilege paths</dt><dd>Two Red Hat flaws and two Linux kernel vulnerabilities</dd></div></dl>

The remaining seven KEV additions in the period have materially different starting points:

- **CVE-2026-8452, NetScaler ADC and Gateway:** an out-of-bounds memory condition that can cause denial of service. Cloud Software Group lists fixed builds for supported 13.1 and 14.1 branches.
- **CVE-2019-1068, Microsoft SQL Server:** improper handling of functions can allow remote code execution in the Database Engine service-account context.
- **CVE-2021-23758, Ajax.NET Professional:** unsafe deserialization can lead to unauthenticated remote code execution. Versions through 21.11.29 are affected and 21.11.29.1 contains the fix.
- **CVE-2015-3246 and CVE-2015-5287:** older Red Hat libuser and ABRT flaws provide local privilege or file-manipulation paths rather than unauthenticated internet entry.
- **CVE-2022-0995 and CVE-2026-53362:** Linux kernel vulnerabilities provide local privilege-escalation paths after some level of host access. Red Hat describes CVE-2026-53362 as an IPv6 fragmentation flaw that a local container user can chain into kernel memory access, SELinux bypass and host escape on affected RHEL 10 systems.

All seven have exploitation evidence, but "patch immediately" is not a complete operational instruction. The NetScaler and SQL Server questions begin with reachable services. The local Linux and Red Hat questions begin with affected kernels or packages plus an attacker's ability to execute locally. Unsupported Ajax.NET requires a retirement decision, not another indefinite exception.

**Do now:** create separate work items with product owner, exact version, exposure, required attacker position, fixed version and evidence-preservation needs. Prioritise externally reachable gateways and database services, but do not drop the local privilege flaws from endpoint and server baselines. For each exposed vulnerable service, decide whether logs and host telemetry support a compromise assessment before closing the ticket as "patched."

<p class="hx-signal-source"><a href="https://www.cisa.gov/news-events/alerts/2026/08/26/cisa-adds-six-known-exploited-vulnerabilities-catalog">Read CISA's six-entry notice →</a> · <a href="https://support.citrix.com/external/article/CTX696604/netscaler-adc-and-netscaler-gateway-secu.html">Read the NetScaler bulletin →</a> · <a href="https://msrc.microsoft.com/update-guide/vulnerability/CVE-2019-1068">Read the Microsoft SQL Server advisory →</a> · <a href="https://github.com/advisories/GHSA-6r7c-6w96-8pvw">Read the Ajax.NET advisory →</a> · <a href="https://access.redhat.com/security/vulnerabilities/RHSB-2026-009">Read the Red Hat IPv6 assessment →</a></p>
</section>

<section class="hx-signal-entry hx-signal-entry--high" markdown="1">
<p class="hx-signal-label">HIGH PRIORITY · ACTIVE TARGETING · OT AND EDGE EXPOSURE</p>

### UK incidents reinforce the exposure-first lesson

<dl><div><dt>Reporting authority</dt><dd>UK National Cyber Security Centre, 27 August</dd></div><div><dt>Observed outcome</dt><dd>Limited real-world disruption across several sectors</dd></div></dl>

The UK NCSC reports increased targeting of internet-exposed operational technology, including activity that caused limited real-world disruption across several sectors. It places those incidents in a broader pattern in which both state and non-state actors target exposed systems and edge devices. The publication does not name one vulnerability, and it does not establish a Lithuanian campaign. Its value is the repeated initial condition: systems became practical targets because control or management surfaces were reachable and weakly protected.

This extends the PLC warning in the previous Signal Brief beyond one manufacturer. A public HMI, remote engineering interface, VPN appliance or forgotten edge device can carry a different product name while exposing the same operational dependency. The remediation unit is the reachable path and its consequence, not the logo on the chassis.

**Do now:** build a definitive inventory from external discovery, firewall rules and engineering records. Verify that PLC, HMI and management interfaces are not directly public, remove default credentials, require MFA for remote access and segment OT, management and business networks. Retire Telnet and SNMPv1/v2, record expected engineering paths, alert on configuration changes from unexpected systems and test recovery against a real operational scenario.

<p class="hx-signal-source"><a href="https://www.ncsc.gov.uk/news/disruptive-cyber-activity-highlights-risk-from-internet-exposed-systems-and-edge-devices">Read the UK NCSC warning →</a></p>
</section>

## AI infrastructure becomes the target

<section class="hx-signal-entry hx-signal-entry--high" markdown="1">
<p class="hx-signal-label">HIGH PRIORITY · OBSERVED COMPROMISES · CREDENTIAL CONCENTRATION</p>

### LiteLLM, RAGFlow and Kestra were attacked as control planes

<dl><div><dt>Observed objectives</dt><dd>Secret theft, persistence and cryptomining</dd></div><div><dt>High-value material</dt><dd>Provider keys, database strings, virtual keys, workflow and container secrets</dd></div></dl>

Microsoft published three observed compromises on 26 August. In the LiteLLM case, it assesses with high confidence that initial access likely occurred through an exposed gateway surface involving CVE-2026-42271 and a possible chain with CVE-2026-48710. The attacker read the gateway process environment, accessed LiteLLM-backed PostgreSQL records, planted persistence and deployed XMRig. That process context contained model-provider credentials, master and virtual keys, database strings and tenant configuration.

The RAGFlow activity progressed from possible SSRF-style probing to application modification and interception of LLM credentials. Microsoft did not attribute that intrusion to one specific vulnerability. In the Kestra environment, workflow execution led to shell access, container and environment discovery, and cryptomining. Different entry paths produced the same broad result: an application designed to connect systems became a route into their credentials and compute.

This is not a reason to label every AI service "Tier 0" by branding alone. It is a reason to classify a deployment by what it can read, execute and reach. An AI gateway holding provider keys and database access has a different blast radius from an isolated inference endpoint.

**Do now:** inventory LiteLLM, RAGFlow, Kestra and comparable gateways or orchestrators, including developer deployments. Remove public management surfaces, patch supported software, enforce authentication, use scoped virtual keys and managed secret stores, isolate databases, restrict Docker-socket access and apply outbound filtering. Hunt for application-origin shells, reads of `/proc/1/environ`, changes to Python application files, SSH `authorized_keys`, cron entries, hidden executables and mining-pool connections.

<p class="hx-signal-source"><a href="https://www.microsoft.com/en-us/security/blog/2026/08/26/when-ai-infrastructure-becomes-target-securing-gateways-control-points/">Read Microsoft's observed attack analysis →</a></p>
</section>

## Lithuania pulse

<section class="hx-signal-entry hx-signal-entry--watch" markdown="1">
<p class="hx-signal-label">WATCH · LITHUANIA · PHYSICAL-SECURITY TELEMETRY</p>

### A security camera can become an intelligence collector

<dl><div><dt>Guidance issued</dt><dd>26 August by NKSC with AOTD and VSD</dd></div><div><dt>Risk boundary</dt><dd>Privacy, network access and national-security intelligence</dd></div></dl>

Lithuania's NKSC, AOTD and VSD published joint guidance on video-surveillance cameras. The agencies warn that access to even one camera can reveal production, logistics, energy, transport or physical-security patterns. Repeated observation can expose routes, working times, process weaknesses, documents and screens, while a compromised device may also become an entry point into the surrounding network.

The guidance cites Russian use of internet-accessible cameras for intelligence collection related to Ukraine. That context does not prove that every exposed Lithuanian camera is currently targeted. It does show why a camera is not merely a low-value IoT device when its field of view or network placement reveals sensitive operations.

**Do now:** remove direct internet access, use a managed vendor path or VPN, set unique administrative passwords, apply firmware updates and replace end-of-life devices. Disable unused UPnP, SSH, Bonjour, FTP and Telnet services and insecure HTTP or RTSP access. Remove unused accounts, enable MFA where available, segment camera networks, review outbound connections and narrow the field of view or use privacy masking where unnecessary detail is captured.

<p class="hx-signal-source"><a href="https://www.nksc.lt/naujienos/nuo_privatumo_iki_nacionalinio_saugumo_ko_708b9bc5.html">Read the NKSC announcement →</a> · <a href="https://www.nksc.lt/rekomendacijos.html">Open the joint recommendations →</a></p>
</section>

<section class="hx-signal-entry hx-signal-entry--watch" markdown="1">
<p class="hx-signal-label">WATCH · LITHUANIA · MARKETPLACE PHISHING</p>

### A supposed Facebook buyer led to a possibly fake webpage

<dl><div><dt>Reported sequence</dt><dd>Buyer contact, possibly fake webpage link, bank details entered</dd></div><div><dt>Reported loss</dt><dd>EUR 1,490</dd></div></dl>

Panevėžys police recorded a report on 26 August involving a person born in 2008 who had advertised an item on Facebook. A supposed buyer contacted the seller, who followed a possibly fake webpage link and entered bank details. The victim later reported a EUR 1,490 loss.

The police summary establishes the reported sequence and loss. It does not identify the domain, phishing kit, beneficiary, authentication flow or a wider campaign. Those missing fields matter. Marketplace phishing often succeeds because the conversation begins inside a familiar platform and moves the seller to an external "payment" or "delivery" page at the moment a transaction feels expected.

The practical investigation path is covered in [One Scam Domain Is Rarely Alone](/en/research/one-scam-domain-is-rarely-alone/). Where social advertising, cloned media and visitor selection are involved, the [Facebook cloaking investigation](/en/research/when-fake-news-scams-and-cloaking-meet/) provides separate comparative context without asserting that this police report belongs to that campaign.

**Do now:** treat buyer-supplied payment and delivery links as hostile until independently verified. Sellers should open the bank or marketplace through a saved application or manually typed address, never through the conversation link. For investigation, preserve the full chat export, exact URL, page screenshots, SMS or app prompts, beneficiary and transaction identifiers, and browser history before deciding how credentials or approval were captured.

<p class="hx-signal-source"><a href="https://panevezys.policija.lrv.lt/lt/ivykiu-suvestines/2026-08-26-suvestine-4zp7/">Read the Panevėžys police summary →</a></p>
</section>

## Bottom line

Start with the systems that actually exist and sit closest to code, credentials or sensitive data. Gitea, Oracle HTTP Server, ownCloud and Artifactory require product-specific action, not one generic vulnerability ticket. The rest of the KEV batch needs the same discipline: distinguish internet entry from local privilege escalation, and distinguish a fixed version from evidence that the system was never used.

The longer signal is architectural. AI gateways and orchestrators inherit the value of every secret and execution path connected to them. Cameras inherit the sensitivity of what they can see and the networks they can reach. A marketplace conversation inherits no trust merely because it began on a familiar platform. Patch the named products, but also reduce the access and evidence gaps that made each path valuable.
