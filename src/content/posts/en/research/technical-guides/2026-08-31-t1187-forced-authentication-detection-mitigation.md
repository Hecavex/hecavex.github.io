---
title: "T1187 Forced Authentication: Detection and Mitigation for Windows Environments"
card_title: "T1187 Forced Authentication: Detection and Mitigation"
description: "A defensive guide to forced SMB and WebDAV authentication, Windows and network evidence, NTLM auditing, egress controls, triage, and identity hardening."
seo_title: "T1187 Forced Authentication Detection and Mitigation"
seo_description: "Detect T1187 forced SMB and WebDAV authentication with Windows, network and identity evidence, then contain exposure and harden NTLM egress."
seo_keywords:
  - "T1187 forced authentication"
  - "forced authentication detection"
  - "outbound NTLM detection"
  - "SMB credential coercion"
  - "WebDAV authentication detection"
  - "Net-NTLMv2 incident response"
date: 2026-08-31 18:15:00 +0300
lang: en
translation_key: t1187-forced-authentication
permalink: /en/research/t1187-forced-authentication-detection-mitigation/
author: deividas-lis
content_type: technical-guide
publication_class: technical-assessment
confidence: high
tlp: clear
categories: [threat-intelligence, identity-security, tradecraft]
tags: [T1187, Forced Authentication, NTLM, SMB, WebDAV, Windows, credential access, detection engineering, incident response]
featured: false
draft: false
published: true
toc: true
comments: false
prose_width: wide
scope: "Defensive detection, prevention and incident-response guidance for Windows authentication coercion over SMB or WebDAV, using endpoint, network and identity evidence."
limitations: "This guide does not provide credential-capture, relay, cracking, lure-construction or exploitation instructions. Product telemetry varies by Windows version, licence and sensor coverage, and an outbound authentication attempt alone does not prove credential compromise."
methods:
  - "MITRE ATT&CK technique and detection-strategy review"
  - "Microsoft Windows authentication and SMB-hardening documentation review"
  - "Government advisory comparison"
  - "Defensive evidence-chain modelling"
evidence_basis: "MITRE ATT&CK T1187, current Microsoft documentation for NTLM auditing and SMB hardening, Microsoft security guidance, and public government reporting on observed forced-authentication activity."
key_findings:
  - "The useful detection unit is a chain: an untrusted object or message is encountered, a Windows component resolves a remote resource, and the device attempts NTLM authentication to a destination outside its approved boundary."
  - "Outbound TCP 445 is a strong control point, but blocking it does not close the WebDAV path over HTTP or HTTPS and does not replace NTLM auditing."
  - "An authentication attempt is exposure evidence, not automatic proof that material was captured, cracked, relayed or used. Triage must preserve those confidence boundaries."
  - "The durable response combines egress restriction, NTLM reduction, strong passwords, phishing-resistant authentication for cloud access, endpoint visibility and a tested identity-containment playbook."
image:
  path: /assets/img/posts/2026-08-31-t1187-forced-authentication/t1187-forced-authentication-hero.svg
  social: /assets/img/social/t1187-forced-authentication-en.png
  thumbnail: /assets/img/posts/2026-08-31-t1187-forced-authentication/t1187-forced-authentication-hero.svg
  alt: "T1187 defensive evidence chain from an untrusted reference through outbound authentication to correlated endpoint, network and identity telemetry"
  width: 1600
  height: 900
---

## The dangerous action may be performed by Windows, not by the user

Forced authentication is easy to describe badly. It is sometimes reduced to “a file steals a password”, which hides both the Windows behaviour and the analytical uncertainty. In [MITRE ATT&CK T1187](https://attack.mitre.org/techniques/T1187/), an adversary causes a target system to authenticate to infrastructure the adversary can observe. The user may open a message or browse a folder, but the consequential network request can be generated automatically when Windows resolves a remote resource.

The material sent through NTLM challenge-response is not the user's plaintext password. It may nevertheless be valuable for offline guessing, relay or other follow-on abuse. Whether any of those outcomes happened is a separate question. A connection attempt, a completed NTLM exchange, possession of reusable material, successful cracking, successful relay and later account use are six different claims. Good incident handling does not compress them into one red box.

This is also why T1187 belongs in a defensive engineering guide rather than a collection of spectacular proofs of concept. The controls are ordinary and measurable: constrain egress, discover legitimate NTLM dependencies, correlate the originating object with the network request, reduce privilege exposure, and know what evidence would justify escalating from “attempt” to “compromise”.

<aside class="hx-callout warning"><strong>Defensive boundary</strong>This publication contains no instructions for constructing a coercion file, receiving challenge-response material, relaying authentication or recovering a password. The goal is to stop, detect and investigate the behaviour without reproducing it.</aside>

## What the authentication chain actually contains

A useful model has four stages:

1. **A trigger exists.** A message, document, shortcut, calendar item, shared folder entry or other object refers to a remote resource.
2. **A Windows component resolves it.** The shell, an application or a service tries to obtain an icon, template, image or other referenced content. The user may not see a separate credential prompt.
3. **A network protocol is selected.** SMB commonly uses TCP 445. When SMB is unavailable, some Windows workflows can reach a resource through WebDAV over HTTP or HTTPS.
4. **Authentication is attempted.** Depending on policy, destination and environment, Windows can negotiate NTLM and identify the current user or computer to the remote service.

This is conceptual, not a recipe. The important defensive observation is that the initiating process and the outbound connection may look individually ordinary. The suspicious property emerges from context: _why did this workstation attempt Windows authentication to that destination at that time?_

[Microsoft's NTLM overview](https://learn.microsoft.com/en-us/windows-server/security/kerberos/ntlm-overview) explains why the protocol still appears in modern estates. Kerberos is preferred in Active Directory, but workgroups, local accounts, legacy systems and applications can retain NTLM dependencies. Turning every NTLM event into an incident therefore produces noise. Leaving all outbound NTLM unmeasured produces a blind spot.

### SMB and WebDAV are related paths, not interchangeable evidence

Outbound SMB to an Internet address is often unusual enough to make a strong detection and prevention control. It is not the entire problem. MITRE notes WebDAV as a possible fallback path operating over ports commonly permitted for web traffic. A firewall rule that blocks TCP 445 can prevent one path while an HTTP or HTTPS request still reaches an untrusted server.

The inverse is also important. A connection to TCP 443 is not evidence of WebDAV, and WebDAV traffic is not automatically malicious. The detector needs protocol, process, destination, authentication and originating-object context. Port-only logic should be treated as a first filter, not a conclusion.

## Build a three-plane evidence chain

The best detections join endpoint, network and authentication telemetry within a short time window. No single product is required, but each plane should answer a different question.

| Evidence plane | Questions to answer | Examples of useful fields |
| --- | --- | --- |
| endpoint | what object was created, opened, previewed or enumerated, and by which process? | file origin, attachment identity, parent/child process, command-line context, user, device, zone or download provenance |
| network | which process contacted which destination using which protocol? | destination IP and hostname, port, URL or method where available, process, device, proxy action, firewall action |
| authentication | was NTLM attempted, allowed, blocked or followed by account activity? | account, workstation, target server, NTLM audit event, logon type, device and cloud sign-in or risk events |

[Microsoft documents `DeviceNetworkEvents`](https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-devicenetworkevents-table) as the Defender XDR table for device network connections. Equivalent EDRs expose similar records. The product name matters less than retaining the initiating process, target and timestamp. A perimeter firewall that logs only source NAT and destination can still block traffic, but it is much less useful for finding the exact file or application that caused it.

For NTLM visibility, Microsoft recommends auditing before blocking. Its [Defender for Identity event-collection guidance](https://learn.microsoft.com/en-us/defender-for-identity/deploy/configure-windows-event-collection) covers NTLM auditing and Event 8004 enrichment, while the Windows policy reference records audit and block activity in the `Microsoft-Windows-NTLM/Operational` log. Scope and event placement vary, so confirm collection on representative clients, servers and domain controllers instead of assuming one event source covers the estate.

### A correlation analytic worth operating

The detection question can be expressed without a vendor-specific query:

```text
Within a short window on the same device and user:
  an externally sourced or unusual object is accessed
  AND a process resolves a remote resource
  AND SMB or WebDAV reaches a non-approved destination
  AND NTLM is attempted, audited or blocked

Raise priority when:
  the destination is Internet-routed or newly observed
  the source object arrived by email, chat or download
  multiple users contact the same destination
  a privileged or administrative workstation is involved
  identity activity follows from a new device or network
```

This is detection logic, not exploit logic. It also gives responders a reason to preserve the source message or file instead of deleting the alert's “malicious URL” and losing the initiating evidence.

### False positives to plan for

Legitimate software deployment, document-management systems, remote file shares, intranet publishing, line-of-business applications and administrator workflows may use SMB, WebDAV or NTLM. False positives are not a reason to abandon the analytic. They are the input for a controlled allowlist with an owner, business purpose and review date.

Avoid broad exceptions such as “all cloud hosts” or “all TCP 443”. Approve the smallest stable identity you can govern: a named server, managed service, expected protocol, originating application and bounded device group. An exception without an owner becomes permanent shadow architecture.

## Prevention: stop unneeded authentication from leaving

### 1. Restrict outbound SMB at host and perimeter layers

Most user workstations do not need to initiate SMB sessions to the public Internet. Block outbound TCP 445 and legacy NetBIOS-related paths at the endpoint firewall and network boundary unless a documented business case exists. Monitor the blocks. A prevention event is also a high-value lead because it shows that something tried.

Remote work complicates perimeter-only control. A laptop on a home network may never traverse the corporate egress firewall, so host policy and secure web or network access controls matter. Test IPv4 and IPv6, split-tunnel VPN behaviour, guest networks and roaming devices.

### 2. Treat WebDAV as its own decision

Determine which managed endpoints genuinely require the Windows WebClient service or external WebDAV. Where it is unnecessary, disable or restrict the capability through tested change management. Where it is required, constrain destinations and collect enough web telemetry to distinguish approved repositories from arbitrary Internet hosts.

Do not claim that “445 is blocked” closes the finding. It closes one route.

### 3. Audit NTLM, then reduce it deliberately

Microsoft's [outgoing NTLM policy guidance](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/jj852213%28v%3Dws.11%29) explicitly recommends auditing first, reviewing required servers and only then moving to denial with narrow exceptions. Newer Windows releases also support [blocking NTLM for outbound SMB connections](https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-ntlm-blocking). Microsoft notes that this can protect SMB clients without disabling NTLM everywhere.

Inventory dependencies by application and service owner. Prefer Kerberos or modern authentication where supported. Record every exception as technical debt and retest it. An emergency “deny all” change without dependency data can break business workflows and drive administrators toward unsafe bypasses.

### 4. Harden the value of anything exposed

Strong, unique passwords make offline guessing harder, though they do not solve relay or every NTLM risk. Privileged accounts should not browse email or general file shares from administrative workstations. Local administrator passwords should be unique and managed. Service accounts need long random secrets, restricted logon rights and lifecycle ownership.

For cloud identity, use phishing-resistant authentication and conditional access rather than assuming password reset alone ends every credential incident. The related HECAVEX analysis, [MFA Is Not a Panacea](/en/research/mfa-is-not-a-panacea/), explains the distinction between a password, an MFA ceremony and a reusable session. That distinction matters if the same lure led to both forced Windows authentication and interactive phishing.

## Triage: classify what is known before containing

| Observation | Defensible statement | Immediate action |
| --- | --- | --- |
| outbound request blocked before authentication | a device attempted to reach an unapproved resource | preserve the trigger, scope identical objects and destinations, verify policy coverage |
| NTLM attempt audited to an untrusted destination | authentication material may have been exposed | isolate or restrict the endpoint as risk warrants, reset affected secrets based on account criticality, hunt for related activity |
| responder confirms a complete exchange | the destination had an opportunity to observe challenge-response material | escalate identity containment, identify every exposed user/computer identity, investigate relay and guessing outcomes |
| suspicious account or service activity follows | exposure may have progressed to use | treat as an identity incident, contain sessions and accounts, preserve logs, investigate persistence and impact |

Start with time, device, user and originating object. Preserve the message with full headers, the attachment or file hash, endpoint timeline, DNS and proxy records, firewall actions, NTLM events, and any later identity activity. Keep the suspicious object quarantined under normal evidence procedures. Do not open it on an analyst workstation to “confirm” the behaviour.

Ask four scope questions:

1. Did other recipients receive or access the same object?
2. Did other devices contact the same destination or certificate-linked infrastructure?
3. Which identities were active on those devices, including computer and privileged identities?
4. What happened after the attempt: password guessing, relay-like access, unusual sign-ins, new sessions, mailbox changes or lateral movement?

Resetting a password can be appropriate, but the response must match the evidence. If later cloud-session abuse is suspected, revoke sessions and follow the identity provider's token-theft playbook. If the evidence is limited to a blocked network attempt, state that. Overclaiming compromise weakens the incident record just as much as underreacting.

## Threat context without turning a technique into attribution

Public reporting has tied forced authentication to multiple actors and vulnerabilities. The APT Notes record for [APT28](https://apt.hecavex.com/actors/apt28/) preserves Microsoft's attribution and the observed use of CVE-2023-23397, while the supporting [Forced Authentication technique record](https://apt.hecavex.com/techniques/forced-authentication/) keeps the ATT&CK relationship explicit.

Those records are context, not a shortcut. Seeing T1187 in one environment does not identify APT28. A technique can be reproduced by different actors, security tools, misconfigurations and benign workflows. Attribution requires source-specific evidence beyond the behaviour itself. HECAVEX's [confidence framework](/en/research/confidence-is-a-field/) explains why the technique observation can be high confidence while an actor claim remains unsupported.

## A minimum operational standard

An organisation is in a materially better position when it can answer yes to these questions:

- Are outbound SMB attempts from managed endpoints blocked or tightly allowlisted and logged?
- Is external WebDAV use either disabled, constrained or visible?
- Is NTLM usage inventoried through audit data rather than assumptions?
- Can the SOC link an outbound connection back to the originating process and object?
- Are privileged identities separated from ordinary browsing and messaging?
- Are password, session and token containment procedures documented and tested?
- Do exceptions have owners, expiry dates and evidence of continued need?

The objective is not a dashboard that says “T1187 coverage: 100%”. It is a chain that prevents the common path, detects the remainder, preserves the right evidence and expresses confidence honestly.

## Official and primary sources

- [MITRE ATT&CK: Forced Authentication, T1187](https://attack.mitre.org/techniques/T1187/)
- [Microsoft Learn: NTLM overview in Windows Server](https://learn.microsoft.com/en-us/windows-server/security/kerberos/ntlm-overview)
- [Microsoft Learn: configure Windows event auditing for Defender for Identity](https://learn.microsoft.com/en-us/defender-for-identity/deploy/configure-windows-event-collection)
- [Microsoft Learn: restrict outgoing NTLM traffic to remote servers](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/jj852213%28v%3Dws.11%29)
- [Microsoft Learn: block NTLM connections on SMB](https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-ntlm-blocking)
- [Microsoft Learn: SMB security hardening](https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-security-hardening)
- [Microsoft Security Response Center: CVE-2023-23397](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2023-23397)
- [CISA and partners: Russian GRU targeting Western logistics entities and technology companies, AA25-141A](https://www.cisa.gov/news-events/cybersecurity-advisories/aa25-141a)

_Assessment date: 31 August 2026. Confidence is high for the documented Windows behaviour and defensive controls. Environment-specific detectability remains dependent on endpoint, network and identity telemetry coverage._
