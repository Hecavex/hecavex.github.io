---
title: "Signal Brief #4: exposed PLCs, exploited Zimbra and trusted-platform phishing"
card_title: "Signal Brief #4: exposed PLCs, Zimbra and trusted-platform phishing"
description: "An active threat to exposed PLCs, nine known-exploited vulnerabilities, trusted-platform phishing, ransomware recovery fraud and a Lithuania pulse. Coverage: 15–22 August 2026."
date: 2026-08-22 00:30:00 +0300
lang: en
translation_key: hecavex-signal-brief-004
permalink: /en/briefings/2026-08-22/
author: deividas-lis
content_type: signal-brief
series: hecavex-signal-brief
issue: 4
coverage_start: 2026-08-15
coverage_end: 2026-08-22
information_cutoff: 2026-08-22 00:15:00 +0300
confidence: high
tlp: clear
categories: [security-briefings]
tags: [CISA KEV, operational technology, Siemens S7, Zimbra, Microsoft IKE, SharePoint, VMware vCenter, macOS, Ray, MLflow, TrueConf, phishing, ransomware, Lithuania]
featured: false
draft: false
toc: true
comments: false
leading_topics:
  - Active targeting of exposed Siemens S7 PLCs
  - Zimbra and perimeter software under exploitation
  - Ray and MLflow development infrastructure
  - Trusted-platform phishing and ransomware recovery fraud
critical_count: 2
high_count: 2
watch_count: 3
scope: "Defender-relevant developments published or added to CISA KEV between 15 and 22 August 2026, plus two Lithuanian police fraud reports from the same period."
limitations: "This is a prioritisation brief, not a complete threat landscape. U.S.-focused reporting does not establish Lithuanian targeting, and individual police reports do not establish a shared campaign or technical delivery chain."
key_findings:
  - "Internet exposure remains the decisive variable: PLCs, mail servers, identity-facing services and management systems deserve attention according to reach and role, not product-name familiarity."
  - "Local AI and data-science services are not isolated merely because a developer launched them on a workstation; browser and server-side request paths can cross that assumed boundary."
  - "A legitimate collaboration platform can carry the attack logic, so domain reputation must be combined with browser, endpoint and identity evidence."
image:
  path: /assets/img/series/hecavex-signal-brief.svg
  social: /assets/img/social/hecavex-signal-brief-004-en.png
  alt: "An analytical signal crossing exposed industrial systems, mail infrastructure and trusted-platform phishing paths"
  thumbnail: /assets/img/series/hecavex-signal-brief.svg
updates:
  - date: 2026-08-22
    note: "Initial publication. Information cut-off: 00:15 EEST."
---

This week's signal is less about one malware family than the places where access is created: a public PLC, a mail server, a management service, a locally launched AI tool or a document on a trusted platform. A familiar product and a reputable domain provide context. Neither provides a security guarantee.

## Operational technology

<section class="hx-signal-entry hx-signal-entry--critical" markdown="1">
<p class="hx-signal-label">CRITICAL · ACTIVE TARGETING · OPERATIONAL TECHNOLOGY</p>

### Exposed Siemens S7 PLCs are an active target

<dl><div><dt>Evidence</dt><dd>Joint CISA, NSA, FBI, DOE and EPA advisory issued 19 August</dd></div><div><dt>Observed scope</dt><dd>Activity against U.S.-based installations; the exposure pattern is relevant more broadly</dd></div></dl>

The agencies report reconnaissance and capability development against internet-exposed or poorly segmented Siemens S7 PLCs. The actors use AI-assisted scripts built around `snap7.dll` and `python-snap7`, present them as legitimate monitoring tools and interact with controller memory, configuration and ladder logic through S7comm. The advisory covers S7-200, S7-300, S7-400, S7-1200 and S7-1500 families and warns that the wider PLC-targeting activity is not limited to Siemens.

This is **not evidence that Lithuanian organisations were targeted**. It is still directly useful to Lithuanian manufacturing, energy, water and other industrial operators because discovery is driven by exposure and weak segmentation rather than geography alone.

**Do now:** inventory PLCs and their firmware, remove direct internet access, audit firewall exposure of TCP/102, separate IT and OT networks, restrict TIA Portal and STEP 7 access to authorised engineering workstations, and review third-party remote access. Hunt for S7comm connections from non-engineering systems, off-hours reads or writes, unapproved Snap7 libraries and configuration changes without a matching work order.

<p class="hx-signal-source"><a href="https://www.cisa.gov/news-events/cybersecurity-advisories/aa26-231a">Read joint advisory AA26-231A →</a></p>
</section>

## Exploited infrastructure

<section class="hx-signal-entry hx-signal-entry--critical" markdown="1">
<p class="hx-signal-label">CRITICAL · KNOWN EXPLOITED · MAIL INFRASTRUCTURE</p>

### CVE-2026-73570: Zimbra command injection

<dl><div><dt>Affected path</dt><dd>SNMP monitoring component when SNMP notifications are enabled</dd></div><div><dt>Attack result</dt><dd>Operating-system commands executed as the Zimbra user</dd></div></dl>

CISA added CVE-2026-73570 to KEV on 21 August. Its entry describes an unauthenticated attacker sending specially crafted SMTP requests that may lead to arbitrary command execution as the Zimbra user. Zimbra locates the flaw in the SNMP monitoring component when notifications are enabled and lists 10.1.20 as the fixed release.

**Do now:** check the installed and supported branch against current Zimbra guidance and move to a fixed release. Preserve MTA, mailbox and operating-system logs before rotating them; inspect child processes, new files, scheduled tasks and outbound connections associated with the Zimbra account. If the vulnerable service was exposed, upgrading answers the remediation question, not the compromise question.

<p class="hx-signal-source"><a href="https://www.cisa.gov/news-events/alerts/2026/08/21/cisa-adds-one-known-exploited-vulnerability-catalog">Read the CISA exploitation notice →</a> · <a href="https://wiki.zimbra.com/wiki/Zimbra_Security_Advisories">Check the Zimbra security advisory →</a> · <a href="https://blog.zimbra.com/2026/07/patch-release-update-zimbra-10-1-20/">Read the 10.1.20 release notice →</a></p>
</section>

<section class="hx-signal-entry hx-signal-entry--high" markdown="1">
<p class="hx-signal-label">HIGH PRIORITY · KNOWN EXPLOITED · EXPOSURE-LED TRIAGE</p>

### One date, four different perimeter questions

On 18 August, CISA added four vulnerabilities with evidence of active exploitation. They should not be handled as one generic patch batch:

- **CVE-2026-33824 — Microsoft IKE:** a double-free vulnerability that can enable remote code execution. Confirm where the IKE service is reachable and apply the relevant Microsoft update.
- **CVE-2026-55040 — Microsoft SharePoint:** weak authentication that can allow a network attacker to bypass a security feature. Prioritise reachable on-premises SharePoint and review authentication and administrative changes.
- **CVE-2026-59310 — VMware vCenter:** a path-traversal flaw in the Syslog server. Broadcom says a threat actor with network access to vCenter may execute arbitrary code; its advisory lists fixed versions and no workaround.
- **CVE-2026-65400 — macOS Screen Sharing:** Apple says an attacker on the network may authenticate to Screen Sharing without valid credentials. Update affected macOS systems and disable or restrict Screen Sharing where it is not required.

CISA then added **CVE-2026-72529** and **CVE-2026-72530** for TrueConf Server on 20 August. The first allows an unauthenticated attacker reaching TCP/4307 to invoke a critical function and execute a script; the second can turn code execution in the isolated environment into host-level command execution. TrueConf lists 5.3.9, 5.4.9 and 5.5.5 as the corresponding fixed releases.

**Do now:** map each CVE to an installed product, owner, version, network path and system role. Fix the reachable systems first and decide separately whether their prior exposure requires compromise assessment. CISA remediation dates govern covered U.S. federal agencies; other organisations should use the exploitation evidence, exposure and business role to set their own queue.

<p class="hx-signal-source"><a href="https://www.cisa.gov/news-events/alerts/2026/08/18/cisa-adds-four-known-exploited-vulnerabilities-catalog">CISA's four-entry notice →</a> · <a href="https://msrc.microsoft.com/update-guide/en-US/vulnerability/CVE-2026-33824">Microsoft IKE advisory →</a> · <a href="https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-55040">Microsoft SharePoint advisory →</a> · <a href="https://support.broadcom.com/web/ecx/support-content-notification/-/external/content/SecurityAdvisories/0/38017">Broadcom VMSA-2026-0006 →</a> · <a href="https://support.apple.com/en-us/148170">Apple security notice →</a> · <a href="https://www.cisa.gov/news-events/alerts/2026/08/20/cisa-adds-two-known-exploited-vulnerabilities-catalog">CISA's TrueConf notice →</a> · <a href="https://trueconf.com/blog/news/security-fixes-updates-and-advisories">TrueConf advisory table →</a></p>
</section>

## Development and AI infrastructure

<section class="hx-signal-entry hx-signal-entry--high" markdown="1">
<p class="hx-signal-label">HIGH PRIORITY · KNOWN EXPLOITED · DEVELOPMENT SERVICES</p>

### Ray and MLflow break the "local means isolated" assumption

CISA added **CVE-2025-62593** in Ray on 17 August. The project advisory describes a DNS-rebinding path in which a developer using Firefox or Safari can expose a local Ray service to remote code execution after visiting a malicious site or receiving a malicious advertisement. Ray versions before 2.52.0 are affected.

On 19 August, CISA added **CVE-2026-64849** in MLflow. The default Tracking Server can expose an unauthenticated, full-read server-side request forgery path through model-registry webhooks. Redirect and DNS-rebinding behaviour can let an attacker reach internal services or cloud metadata and receive the upstream response. MLflow 3.15.0 contains the fix.

These are different bugs with the same architectural lesson: `localhost`, a development label and an internal hostname are not trust boundaries once a browser or server-side request feature can cross them.

**Do now:** update Ray and MLflow, identify who runs them outside managed production inventories, bind services only to intended interfaces, add authentication and network controls, and inspect whether cloud metadata or local secrets were reachable. If exposure cannot be excluded, rotate affected credentials rather than assuming the version upgrade removed the evidence.

<p class="hx-signal-source"><a href="https://www.cisa.gov/news-events/alerts/2026/08/17/cisa-adds-one-known-exploited-vulnerability-catalog">CISA's Ray notice →</a> · <a href="https://github.com/ray-project/ray/security/advisories/GHSA-q279-jhrf-cc6v">Ray project advisory →</a> · <a href="https://www.cisa.gov/news-events/alerts/2026/08/19/cisa-adds-one-known-exploited-vulnerability-catalog">CISA's MLflow notice →</a> · <a href="https://github.com/advisories/GHSA-7gwp-5pfp-969j">MLflow advisory →</a></p>
</section>

## Social engineering and incident response

<section class="hx-signal-entry hx-signal-entry--watch" markdown="1">
<p class="hx-signal-label">WATCH · TRUSTED-PLATFORM ABUSE · CASE STUDY</p>

### A legitimate Google Doc carried the infection workflow

Huntress documented a post-DEF CON approach that began in X direct messages with a fake conference-planning pretext. The actor supplied a Google Doc whose Apps Script sidebar presented ClickFix-style instructions and a manual download option. A second route imitated a DocSend installer. Huntress observed an AMOS infostealer on the macOS path and NetSupport RAT, a Ledger wallet implant and a traffic-intercepting proxy on the Windows path.

This is one investigated interaction, not evidence that every conference follow-up or Google document is malicious. The defensive point is narrower and more durable: a legitimate domain can host the document and script that performs the attack. Domain reputation alone will miss that distinction.

**Do now:** tell users and help desks that a shared document should never instruct them to paste commands into a terminal or Run dialog. Preserve the complete message thread, document URL, script and download chain when reporting it. Correlate browser, endpoint and identity activity; a phishing-domain feed is only one layer of that investigation.

<p class="hx-signal-source"><a href="https://www.huntress.com/blog/defcon-phishing-google-doc-malware">Read the Huntress case study →</a></p>
</section>

<section class="hx-signal-entry hx-signal-entry--watch" markdown="1">
<p class="hx-signal-label">WATCH · RANSOMWARE · SECONDARY EXTORTION</p>

### The unsolicited "recovery company" may be part of the intrusion

GuidePoint reports several ransomware cases in which a persona called **Ransom Busters** contacted victims before the incidents were public and offered to recover or delete stolen data for USD 20,000–60,000. Forensic work across two cases found overlapping reconnaissance, exfiltration, remote-management and persistence choices. GuidePoint assesses with moderate confidence that the persona is a ransomware affiliate working across multiple ransomware-as-a-service operations, not an independent recovery firm.

That assessment belongs to GuidePoint; the public evidence does not prove every unsolicited recovery approach has the same operator. It does show why a message containing non-public incident details should be treated as evidence, not as customer support.

**Do now:** preserve the message and headers, payment instructions and any proof-of-data material; route contact through the incident-response, legal and law-enforcement process already handling the case. Do not move the conversation to an unmanaged channel, and do not treat payment as proof that another copy of the data will be deleted.

<p class="hx-signal-source"><a href="https://www.guidepointsecurity.com/blog/beware-ransom-busters/">Read GuidePoint's Ransom Busters analysis →</a></p>
</section>

## Lithuania pulse

<section class="hx-signal-entry hx-signal-entry--watch" markdown="1">
<p class="hx-signal-label">WATCH · LITHUANIA · REPORTED FRAUD</p>

### Two losses, but no basis for one campaign story

Marijampolė police recorded a report on 18 August from a person who repeatedly failed to access online banking and then found EUR 700 transferred to an unknown account. The summary records the sequence and loss, but it does not establish the credential-theft method, a phishing domain or the full transaction-authorisation path.

The national police summary for 19 August separately records a Vilnius resident reporting EUR 15,145 lost while investing through an online platform between 3 and 18 August. The report does not connect that case to the banking incident or identify a shared technical campaign.

The useful lesson is evidentiary: loss reports show harm, not attribution. Preserve SMS and messaging conversations, the full URL, transaction and authentication prompts, beneficiary details and device/browser evidence before deciding how the fraud worked.

<p class="hx-signal-source"><a href="https://marijampole.policija.lrv.lt/lt/ivykiu-suvestines/2026-08-18-ivykiu-suvestine-CRHm/">Marijampolė police summary →</a> · <a href="https://policija.lrv.lt/lt/ivykiu-suvestines/2026-08-19-suvestine-sTI5/">Lithuanian Police summary →</a></p>
</section>

## The next 72 hours

1. **Find the exposure:** identify internet-reachable or externally traversable PLC, Zimbra, IKE, SharePoint, vCenter, TrueConf, Screen Sharing, Ray and MLflow services. Record an owner, version and network path for each.
2. **Fix by reach and role:** remove unnecessary access first, then apply current vendor fixes. Do not let a long CVE list displace the one exposed system that can control many others.
3. **Look backwards:** hunt for unusual S7comm on TCP/102, Snap7 outside engineering workstations, suspicious Zimbra child processes, vCenter or SharePoint administrative changes and unexpected requests from Ray or MLflow hosts.
4. **Close the human loop:** warn users about documents that request terminal commands and tell incident teams to retain unsolicited ransomware-recovery messages as evidence.
5. **Preserve Lithuanian fraud evidence:** capture the complete delivery and authorisation chain before links expire, messages disappear or a device is reset.

## Bottom line

The immediate queue is exposed PLCs, Zimbra and the products from this week's KEV additions that actually exist in your environment. The broader signal is that "internal" and "trusted" are conditional states. A browser can reach a local development service; a known document platform can carry malicious logic; a supposed recovery firm can be another extortion path.

Keep the evidence categories separate. U.S. targeting does not become Lithuanian targeting by analogy, and two Lithuanian fraud reports do not become a campaign because they appeared in the same week. Prioritise what is exposed, preserve what can prove the path and state what remains unknown.
