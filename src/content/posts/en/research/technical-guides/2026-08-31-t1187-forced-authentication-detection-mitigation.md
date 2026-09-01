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
  path: /assets/img/posts/2026-08-31-t1187-forced-authentication/t1187-forced-authentication-hero-v2.webp
  social: /assets/img/social/t1187-forced-authentication-en.png
  thumbnail: /assets/img/posts/2026-08-31-t1187-forced-authentication/t1187-forced-authentication-card-v2.webp
  alt: "T1187 defensive evidence chain from an untrusted reference through outbound authentication to correlated endpoint, network and identity telemetry"
  width: 1600
  height: 900
---

## The dangerous action may be performed by Windows, not by the user

Forced authentication is easy to describe badly. It is sometimes reduced to "a file steals a password", which hides both the Windows behaviour and the analytical uncertainty. In [MITRE ATT&CK T1187](https://attack.mitre.org/techniques/T1187/), an adversary causes a target system to authenticate to infrastructure the adversary can observe. The user may open a message or browse a folder, but the consequential network request can be generated automatically when Windows resolves a remote resource.

The material sent through NTLM challenge-response is not the user's plaintext password. It may nevertheless be valuable for offline guessing, relay or other follow-on abuse. Whether any of those outcomes happened is a separate question. A connection attempt, a completed NTLM exchange, possession of reusable material, successful cracking, successful relay and later account use are six different claims. Good incident handling does not compress them into one red box.

This is also why T1187 belongs in a defensive engineering guide rather than a collection of spectacular proofs of concept. The controls are ordinary and measurable: constrain egress, discover legitimate NTLM dependencies, correlate the originating object with the network request, reduce privilege exposure, and know what evidence would justify escalating from "attempt" to "compromise".

<aside class="hx-callout warning"><strong>Defensive boundary</strong>This publication contains no instructions for constructing a coercion file, receiving challenge-response material, relaying authentication or recovering a password. The goal is to stop, detect and investigate the behaviour without reproducing it.</aside>

## What the authentication chain actually contains

A useful model has four stages:

1. **A trigger exists.** A message, document, shortcut, calendar item, shared folder entry or other object refers to a remote resource.
2. **A Windows component resolves it.** The shell, an application or a service tries to obtain an icon, template, image or other referenced content. The user may not see a separate credential prompt.
3. **A network protocol is selected.** SMB commonly uses TCP 445. When SMB is unavailable, some Windows workflows can reach a resource through WebDAV over HTTP or HTTPS.
4. **Authentication is attempted.** Depending on policy, destination and environment, Windows can negotiate NTLM and identify the current user or computer to the remote service.

This is conceptual, not a recipe. The important defensive observation is that the initiating process and the outbound connection may look individually ordinary. The suspicious property emerges from context: _why did this workstation attempt Windows authentication to that destination at that time?_

[Microsoft's NTLM overview](https://learn.microsoft.com/en-us/windows-server/security/kerberos/ntlm-overview) explains why the protocol still appears in modern estates. Kerberos is preferred in Active Directory, but workgroups, local accounts, legacy systems and applications can retain NTLM dependencies. Turning every NTLM event into an incident therefore produces noise. Leaving all outbound NTLM unmeasured produces a blind spot.

![Forced-authentication chain from a remote reference through Windows resource handling to outbound SMB or WebDAV authentication](/assets/img/posts/2026-08-31-t1187-forced-authentication/t1187-authentication-path-en.svg)

*Figure: The suspicious property emerges from the full chain, not from the document, process or network request in isolation.*

### Read the protocol state, not only the destination port

An SMB observation becomes much more useful when the sensor can distinguish transport from authentication state. SMB2 commonly starts with `SMB2 NEGOTIATE`. The client and server then exchange `SMB2 SESSION_SETUP` messages. [Microsoft's SMB2 specification](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-smb2/c9efe8ca-ff34-44d0-bfbe-58a9b9db50d4) explains that `SESSION_SETUP` carries GSS security tokens and can return `STATUS_MORE_PROCESSING_REQUIRED` while authentication continues. [SMB2 uses SPNEGO](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-smb2/06451bf2-578a-4b9d-94c0-8ce531bf14c4) to select an authentication mechanism such as Kerberos or NTLM.

When NTLM is selected, [MS-NLMP defines three relevant message types](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-nlmp/907f519d-6217-45b1-b421-dca10fc8af0d): `NEGOTIATE_MESSAGE`, `CHALLENGE_MESSAGE`, and `AUTHENTICATE_MESSAGE`. The last message can contain the user's domain and account identity plus a response derived from the server challenge and the user's secret. [The NTLMv2 calculation includes server challenge, client challenge, time, and target information](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-nlmp/c0250a97-2940-40c7-82fb-20d208c71e96). It does not transmit the plaintext password or the NT password hash.

That distinction changes incident language. An outbound SYN is not an NTLM exchange. An SMB negotiation is not an `AUTHENTICATE_MESSAGE`. A Net-NTLMv2 response is not an NT hash and cannot be used as Pass-the-Hash. Microsoft makes the same distinction in its [CVE-2023-23397 investigation guidance](https://www.microsoft.com/en-us/security/blog/2023/03/24/guidance-for-investigating-attacks-using-cve-2023-23397/), while noting that a captured response can still be relayed or subjected to offline password guessing.

Treat packet captures containing an NTLM authentication response as sensitive identity evidence. Limit access, hash the capture, record acquisition time and sensor position, and avoid copying authentication payloads into tickets or public sandboxes.

### SMB and WebDAV are related paths, not interchangeable evidence

Outbound SMB to an Internet address is often unusual enough to make a strong detection and prevention control. It is not the entire technique family. MITRE notes WebDAV as another path that can operate over HTTP or HTTPS. The Windows WebDAV Redirector depends on the WebClient service, as described in [Microsoft's WebDAV Redirector documentation](https://learn.microsoft.com/en-us/iis/publish/using-webdav/using-the-webdav-redirector).

Do not infer that every external WebDAV request exposes NTLM. The WebClient uses WinHTTP security-zone decisions. [Microsoft documents that automatic credential use normally applies to intranet sites rather than dotted Internet FQDNs](https://learn.microsoft.com/en-us/troubleshoot/windows-server/networking/credentials-prompt-access-webdav-fqdn-sites), unless proxy bypass, `AuthForwardServerList`, or other policy changes the trust decision. Broad credential-forwarding exceptions are therefore both a compatibility fact and an investigation lead.

The boundary is especially important for CVE-2023-23397. Microsoft's investigation guidance states that the vulnerable Outlook reminder path could trigger external SMB authentication without user interaction. It also states that, for that specific path, an external WebDAV connection did not send Net-NTLMv2 because Internet-zone policy prevented it. Analysts should not turn a generic ATT&CK WebDAV possibility into a claim about credential exposure in every product-specific case.

A connection to TCP 443 is not evidence of WebDAV. A WebDAV method is not evidence that credentials were forwarded. A blocked TCP 445 attempt is not a completed exchange. The detector needs protocol state, process, destination, policy result, authentication state, and originating-object context.

## Use an evidence ladder before assigning severity

| Level | Evidence established | Claim that is justified |
| --- | --- | --- |
| 0 | a message or file contains a remote reference | a possible forced-authentication trigger exists |
| 1 | DNS resolution or a connection attempt is observed | the endpoint tried to reach the destination |
| 2 | SMB or WebDAV application traffic is confirmed | the endpoint negotiated the relevant service |
| 3 | an NTLM `AUTHENTICATE_MESSAGE` or equivalent audit evidence is present | challenge-response material was emitted |
| 4 | a relay acceptance or successful offline password recovery is independently demonstrated | exposed material was converted into usable access |
| 5 | authenticated actions are linked to the identity and incident | confirmed impact can be described and scoped |

Levels do not automatically imply the next level. A firewall block at level 1 can be a successful preventive control and a valuable detection. A complete level 3 exchange justifies identity containment, but it does not prove the destination retained the material or that later access succeeded. Level 4 and level 5 require evidence from the accepting service, identity provider, affected resource, or another independently preserved source.

## Build a three-plane evidence chain

The best detections join endpoint, network and authentication telemetry within a short time window. No single product is required, but each plane should answer a different question.

| Evidence plane | Questions to answer | Examples of useful fields |
| --- | --- | --- |
| endpoint | what object was created, opened, previewed or enumerated, and by which process? | file origin, attachment identity, parent/child process, command-line context, user, device, zone or download provenance |
| network | which process contacted which destination using which protocol? | destination IP and hostname, port, URL or method where available, process, device, proxy action, firewall action |
| authentication | was NTLM attempted, allowed, blocked or followed by account activity? | account, workstation, target server, NTLM audit event, logon type, device and cloud sign-in or risk events |

[Microsoft documents `DeviceNetworkEvents`](https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-devicenetworkevents-table) as the Defender XDR table for device network connections. Equivalent EDRs expose similar records. The product name matters less than retaining the initiating process, target and timestamp. A perimeter firewall that logs only source NAT and destination can still block traffic, but it is much less useful for finding the exact file or application that caused it.

For NTLM visibility, Microsoft recommends auditing before blocking. Its [Defender for Identity event-collection guidance](https://learn.microsoft.com/en-us/defender-for-identity/deploy/configure-windows-event-collection) covers NTLM auditing and Event 8004 enrichment, while the Windows policy reference records audit and block activity in the `Microsoft-Windows-NTLM/Operational` log. Scope and event placement vary, so confirm collection on representative clients, servers and domain controllers instead of assuming one event source covers the estate.

![Forced-authentication telemetry joined across endpoint, network and identity evidence planes](/assets/img/posts/2026-08-31-t1187-forced-authentication/t1187-telemetry-join-en.svg)

*Figure: Each telemetry plane answers a different incident question and only their time-bounded join reconstructs the state.*

### Collect fields that let an analyst reconstruct state

At endpoint level, [Sysmon Event ID 3](https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon) can record process-attributed network connections when that event type is enabled. Windows Filtering Platform auditing can record allowed connections in [Event 5156](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-5156) and blocked connections in Event 5157. These sources are verbose, so filter and route them deliberately. Preserve process path, process identifier, source and destination addresses, destination port, protocol, device, user context, and filter action.

In Defender XDR, `DeviceNetworkEvents` provides fields such as `DeviceId`, `DeviceName`, `InitiatingProcessAccountName`, `InitiatingProcessFileName`, `InitiatingProcessCommandLine`, `RemoteIP`, `RemoteUrl`, `RemotePort`, `Protocol`, `ActionType`, and `Timestamp`. The exact schema is product-specific, but the analytical requirement is stable: retain a process identity and a network destination on the same event, then correlate them with file, email, and authentication records.

On the Windows authentication side, collect the `Microsoft-Windows-NTLM/Operational` channel and validate that Event 8004 reaches the intended analytics platform. Record account, client workstation, target server, process or calling context where available, audit or block outcome, and event source host. Event 8004 enrichment can add the target server that received NTLM, but it does not replace the client-side network record.

Do not misuse Windows Security Event 4624 as a universal outbound signal. It is created by the system that accepts a logon. If the destination is outside your control, the initiating workstation may have no local 4624 proving what the remote server accepted. That is why client network telemetry, NTLM operational logs, and protocol-aware sensors matter.

For packet or NDR sensors, retain metadata that can separate TCP establishment, SMB negotiation, SPNEGO selection, the NTLM challenge, and the authentication response. A sensor alert that only says `SMB to Internet` should remain level 1 or 2 until another source establishes level 3.

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

This is detection logic, not exploit logic. It also gives responders a reason to preserve the source message or file instead of deleting the alert's "malicious URL" and losing the initiating evidence.

A practical correlation can start with process-attributed traffic rather than an IOC list:

```kusto
DeviceNetworkEvents
| where Timestamp > ago(14d)
| where RemotePort in (139, 445)
| project Timestamp, DeviceId, DeviceName, InitiatingProcessAccountName,
          InitiatingProcessFileName, InitiatingProcessCommandLine,
          RemoteIP, RemoteUrl, RemotePort, Protocol, ActionType, ReportId
```

Inspect the `ActionType` values present in your tenant and verify their meaning before operational use. Enrich public-address detection with your approved external SMB inventory. Join on `DeviceId` and a narrow time window to file, email, browser, and NTLM audit events. Do not require a malware verdict or young domain. The important question is whether the process and destination are expected for that device and user.

### False positives to plan for

Legitimate software deployment, document-management systems, remote file shares, intranet publishing, line-of-business applications and administrator workflows may use SMB, WebDAV or NTLM. False positives are not a reason to abandon the analytic. They are the input for a controlled allowlist with an owner, business purpose and review date.

Avoid broad exceptions such as "all cloud hosts" or "all TCP 443". Approve the smallest stable identity you can govern: a named server, managed service, expected protocol, originating application and bounded device group. An exception without an owner becomes permanent shadow architecture.

## Prevention: stop unneeded authentication from leaving

### 1. Restrict outbound SMB at host and perimeter layers

Most user workstations do not need to initiate SMB sessions to the public Internet. Block outbound TCP 445 and legacy NetBIOS-related paths at the endpoint firewall and network boundary unless a documented business case exists. Monitor the blocks. A prevention event is also a high-value lead because it shows that something tried.

Remote work complicates perimeter-only control. A laptop on a home network may never traverse the corporate egress firewall, so host policy and secure web or network access controls matter. Test IPv4 and IPv6, split-tunnel VPN behaviour, guest networks and roaming devices.

### 2. Treat WebDAV as its own decision

Determine which managed endpoints genuinely require the Windows WebClient service or external WebDAV. Where it is unnecessary, disable or restrict the capability through tested change management. Where it is required, constrain destinations and collect enough web telemetry to distinguish approved repositories from arbitrary Internet hosts.

Do not claim that "445 is blocked" closes the finding. It closes one route.

### 3. Audit NTLM, then reduce it deliberately

Microsoft's [outgoing NTLM policy guidance](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/jj852213%28v%3Dws.11%29) explicitly recommends auditing first, reviewing required servers and only then moving to denial with narrow exceptions. Newer Windows releases also support [blocking NTLM for outbound SMB connections](https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-ntlm-blocking). Microsoft notes that this can protect SMB clients without disabling NTLM everywhere.

Inventory dependencies by application and service owner. Prefer Kerberos or modern authentication where supported. Record every exception as technical debt and retest it. An emergency "deny all" change without dependency data can break business workflows and drive administrators toward unsafe bypasses.

Keep three controls distinct. Outbound NTLM blocking prevents the client from using NTLM on covered SMB connections. SMB signing protects SMB message integrity and reduces relay to SMB services that enforce signing. [Microsoft's SMB signing documentation](https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-signing) explains current default requirements on newer Windows releases. Signing does not stop the client from emitting an NTLM response, does not prevent offline guessing, and does not by itself stop relay to another protocol.

Services that accept Windows authentication need their own relay resistance. [Microsoft's IIS Extended Protection documentation](https://learn.microsoft.com/en-gb/iis/configuration/system.webserver/security/authentication/windowsauthentication/extendedprotection/) describes channel binding and service binding for Windows authentication. Extended Protection can make a relayed authentication invalid for a protected service when correctly configured. It is not an estate-wide switch. Test each accepting service, load balancer, TLS termination path, and legacy client before enforcement.

### 4. Harden the value of anything exposed

Strong, unique passwords make offline guessing harder, though they do not solve relay or every NTLM risk. Privileged accounts should not browse email or general file shares from administrative workstations. Local administrator passwords should be unique and managed. Service accounts need long random secrets, restricted logon rights and lifecycle ownership.

For cloud identity, use phishing-resistant authentication and conditional access rather than assuming password reset alone ends every credential incident. The related HECAVEX analysis, [MFA Is Not a Panacea](/en/research/mfa-is-not-a-panacea/), explains the distinction between a password, an MFA ceremony and a reusable session. That distinction matters if the same lure led to both forced Windows authentication and interactive phishing.

![Layered forced-authentication control map covering content handling, protocol restrictions, egress blocking and NTLM reduction](/assets/img/posts/2026-08-31-t1187-forced-authentication/t1187-control-map-en.svg)

*Figure: Prevention and detection overlap across the chain, but no single control proves that every route is closed.*

## Triage: classify what is known before containing

| Observation | Defensible statement | Immediate action |
| --- | --- | --- |
| outbound request blocked before authentication | a device attempted to reach an unapproved resource | preserve the trigger, scope identical objects and destinations, verify policy coverage |
| NTLM attempt audited to an untrusted destination | authentication material may have been exposed | isolate or restrict the endpoint as risk warrants, reset affected secrets based on account criticality, hunt for related activity |
| responder confirms a complete exchange | the destination had an opportunity to observe challenge-response material | escalate identity containment, identify every exposed user/computer identity, investigate relay and guessing outcomes |
| suspicious account or service activity follows | exposure may have progressed to use | treat as an identity incident, contain sessions and accounts, preserve logs, investigate persistence and impact |

Start with time, device, user and originating object. Preserve the message with full headers, the attachment or file hash, endpoint timeline, DNS and proxy records, firewall actions, NTLM events, and any later identity activity. Keep the suspicious object quarantined under normal evidence procedures. Do not open it on an analyst workstation to "confirm" the behaviour.

Ask four scope questions:

1. Did other recipients receive or access the same object?
2. Did other devices contact the same destination or certificate-linked infrastructure?
3. Which identities were active on those devices, including computer and privileged identities?
4. What happened after the attempt: password guessing, relay-like access, unusual sign-ins, new sessions, mailbox changes or lateral movement?

Resetting a password can be appropriate, but the response must match the evidence. If later cloud-session abuse is suspected, revoke sessions and follow the identity provider's token-theft playbook. If the evidence is limited to a blocked network attempt, state that. Overclaiming compromise weakens the incident record just as much as underreacting.

### Validate coverage without collecting authentication material

A safe control test does not need a credential receiver or a live coercion artifact.

1. Confirm effective firewall and SMB-client policy on representative Windows versions, device groups, VPN states, IPv4 and IPv6 paths.
2. Use a controlled test destination that records DNS and TCP connection attempts but closes the connection before SMB session setup. Verify that endpoint, firewall, proxy, SIEM, and case-management records agree on time and device.
3. Replay synthetic `DeviceNetworkEvents`, NTLM Operational, and file-origin fixtures through the analytic to test correlation and severity transitions.
4. Validate approved external SMB and WebDAV workflows separately. A policy can be secure and still fail operationally if a legitimate dependency is hidden.
5. Measure what the SOC can prove after the test. It should be able to distinguish blocked connection, protocol negotiation, and NTLM authentication without inspecting a credential response.
6. Retest after VPN, endpoint-firewall, authentication-policy, or EDR schema changes.

Never point a managed workstation at an authentication-capture service to demonstrate coverage. A test that deliberately receives an employee's challenge-response material creates the exposure the control is meant to prevent.

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

The objective is not a dashboard that says "T1187 coverage: 100%". It is a chain that prevents the common path, detects the remainder, preserves the right evidence and expresses confidence honestly.

## Official and primary sources

- [MITRE ATT&CK: Forced Authentication, T1187](https://attack.mitre.org/techniques/T1187/)
- [Microsoft Open Specifications: NTLM message syntax, MS-NLMP](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-nlmp/907f519d-6217-45b1-b421-dca10fc8af0d)
- [Microsoft Open Specifications: SMB2 SESSION_SETUP](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-smb2/c9efe8ca-ff34-44d0-bfbe-58a9b9db50d4)
- [Microsoft Learn: NTLM overview in Windows Server](https://learn.microsoft.com/en-us/windows-server/security/kerberos/ntlm-overview)
- [Microsoft Learn: configure Windows event auditing for Defender for Identity](https://learn.microsoft.com/en-us/defender-for-identity/deploy/configure-windows-event-collection)
- [Microsoft Learn: restrict outgoing NTLM traffic to remote servers](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/jj852213%28v%3Dws.11%29)
- [Microsoft Learn: block NTLM connections on SMB](https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-ntlm-blocking)
- [Microsoft Learn: SMB signing](https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-signing)
- [Microsoft Learn: Extended Protection for Windows authentication in IIS](https://learn.microsoft.com/en-gb/iis/configuration/system.webserver/security/authentication/windowsauthentication/extendedprotection/)
- [Microsoft Security: investigating CVE-2023-23397](https://www.microsoft.com/en-us/security/blog/2023/03/24/guidance-for-investigating-attacks-using-cve-2023-23397/)
- [Microsoft Security Response Center: CVE-2023-23397](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2023-23397)
- [CISA and partners: Russian GRU targeting Western logistics entities and technology companies, AA25-141A](https://www.cisa.gov/news-events/cybersecurity-advisories/aa25-141a)

_Assessment date: 31 August 2026. Confidence is high for the documented Windows behaviour and defensive controls. Environment-specific detectability remains dependent on endpoint, network and identity telemetry coverage._
