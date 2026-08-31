---
title: "Evilginx Detection: Finding Reverse-Proxy Phishing and Session Theft"
card_title: "Evilginx Detection for Identity Defenders"
description: "A defensive guide to reverse-proxy phishing indicators, identity and authentication telemetry, domain and HTTP clues, session containment, and phishing-resistant MFA."
seo_title: "Evilginx Detection: Reverse-Proxy Phishing Indicators"
seo_description: "Detect Evilginx and reverse-proxy phishing by correlating lure, domain, HTTP, sign-in and session telemetry, then contain stolen identity material."
seo_keywords:
  - "Evilginx detection"
  - "reverse proxy phishing detection"
  - "AiTM phishing indicators"
  - "session cookie theft detection"
  - "MFA bypass phishing"
  - "Microsoft 365 token theft response"
date: 2026-08-31 18:20:00 +0300
lang: en
translation_key: evilginx-detection
permalink: /en/research/evilginx-detection/
author: deividas-lis
content_type: technical-guide
publication_class: technical-assessment
confidence: high
tlp: clear
categories: [threat-intelligence, identity-security, social-engineering]
tags: [Evilginx, AiTM, reverse proxy, phishing, session theft, MFA, identity security, detection engineering, incident response]
featured: false
draft: false
published: true
toc: true
comments: false
prose_width: wide
scope: "Defensive identification and response for Evilginx-associated and tool-agnostic reverse-proxy phishing, using message, web, domain, certificate, authentication and post-access telemetry."
limitations: "No installation, phishlet, lure, credential collection or operational proxy configuration is included. Public infrastructure clues are mutable and non-exclusive, while identity logs depend on provider, licence, retention and policy coverage."
methods:
  - "MITRE ATT&CK software and technique review"
  - "Microsoft threat-intelligence and incident-response guidance review"
  - "Government phishing-resistant authentication guidance review"
  - "Cross-plane defensive evidence modelling"
evidence_basis: "MITRE ATT&CK records for evilginx2 and AiTM, Microsoft reporting on observed Evilginx and token-theft campaigns, Microsoft identity-response documentation, and CISA authentication guidance."
key_findings:
  - "Reverse-proxy phishing can display the legitimate service's current content and complete a real MFA ceremony while the browser remains connected to an attacker-controlled hostname."
  - "No stable favicon, certificate issuer, response header or hosting provider uniquely identifies Evilginx. Detection becomes reliable when lure, web and identity evidence are correlated."
  - "A successful MFA event does not establish that the resulting session is trustworthy. Follow-on sign-in, token, mailbox, OAuth and data-access telemetry must be reviewed."
  - "Containment must revoke sessions and inspect persistence as well as reset credentials. Phishing-resistant authentication and device-bound access materially reduce the reusable-proxy path."
image:
  path: /assets/img/posts/2026-08-31-evilginx-detection/evilginx-detection-hero.svg
  social: /assets/img/social/evilginx-detection-en.png
  thumbnail: /assets/img/posts/2026-08-31-evilginx-detection/evilginx-detection-hero.svg
  alt: "Reverse-proxy phishing evidence model connecting a user, deceptive proxy and legitimate identity provider with lure, web, sign-in and token telemetry"
  width: 1600
  height: 900
---

## The sign-in can be real while the browser is in the wrong place

Traditional phishing often presents a copied form and sends whatever the user enters to a collection endpoint. Reverse-proxy phishing changes the evidence. The intermediary relays traffic between the victim's browser and the real identity provider. The login page can therefore be current, tenant-branded and responsive. The password and MFA transaction may genuinely be accepted by the legitimate service. The hostile element is the hostname in the middle and its opportunity to observe or reuse the authenticated session.

[MITRE ATT&CK describes evilginx2 as S9003](https://attack.mitre.org/software/S9003/), an open-source adversary-in-the-middle framework capable of proxying a legitimate web service and intercepting credentials, authentication tokens and session cookies. The product name is useful threat context, but defenders should design for the behaviour class. Different frameworks, private modifications and managed phishing services can produce the same outcome.

This guide therefore does not answer “how do I fingerprint one Evilginx version?” It answers the more durable question: **what evidence shows that an authentication journey was relayed through a deceptive origin and that the resulting identity session may have left the user's control?**

<aside class="hx-callout warning"><strong>Defensive boundary</strong>This guide contains no installation steps, phishlet syntax, lure generation, credential interception, proxy configuration or evasion instructions. Do not reproduce a live authentication flow to test a suspicious site. Preserve evidence and use authorised controls.</aside>

## A reverse proxy changes what “fake page” means

In a simplified AiTM phishing flow:

1. a lure sends the user to an attacker-controlled hostname
2. that server opens its own connection to the legitimate identity provider
3. requests and responses are relayed between the two TLS sessions
4. the user completes the real provider's authentication sequence through the intermediary
5. the legitimate provider issues session material after successful authentication
6. the intermediary can observe material available in the proxied flow, and an attacker may try to replay it from another context.

[Microsoft's 2022 investigation](https://www.microsoft.com/en-us/security/blog/2022/07/12/from-cookie-theft-to-bec-attackers-use-aitm-phishing-sites-as-entry-point-to-further-financial-fraud/) documented Evilginx2-linked campaigns targeting more than 10,000 organisations and described subsequent mailbox access and payment fraud. The key lesson is not that MFA is useless. MFA still blocks large classes of password-only attack. The lesson is that a bearer session obtained _after_ successful MFA can become a different authentication problem.

The related HECAVEX article [MFA Is Not a Panacea](/en/research/mfa-is-not-a-panacea/) explains this boundary in depth. A password, an MFA factor and an authenticated session are different assets. Controls and incident actions must name the asset they protect.

## Detect across three truth planes

Reverse-proxy phishing rarely gives one universal signature. Reliable detection joins three planes that adversaries must traverse.

| Plane | What it can establish | Typical evidence |
| --- | --- | --- |
| lure and delivery | how the target was selected and sent toward the site | message headers, sender, rewritten link, attachment, QR code, click telemetry, recipient and delivery time |
| web and infrastructure | which origin the browser reached and how it behaved | exact URL, redirect chain, DNS, certificate, hosting, HTTP responses, page resources, proxy or browser telemetry |
| identity and impact | whether authentication and later account use departed from the user's normal context | sign-in and risk logs, token/session events, device claims, mailbox audit, OAuth grants, MFA changes, downloads and administrative actions |

The planes also protect the analysis from overclaiming. A suspicious domain without a target interaction is infrastructure evidence. A successful sign-in after a click is stronger, but it is not automatically token theft. A replay-like sign-in followed by mailbox rule creation and email deletion is a much more consequential chain.

### Preserve the exact journey

For a suspected recipient, preserve the original message with full headers and the exact URL privately. Record click time, browser and device, authentication prompts completed, destination shown after login, and any warnings. Retain secure web gateway, email-security and endpoint click records. Do not paste a recipient-specific live URL into arbitrary public scanners: query parameters can identify the target, and a public submission can become permanently discoverable.

HECAVEX's [suspicious SMS link guide](/en/research/how-to-check-a-suspicious-sms-link-safely/) distinguishes a lookup from a submission and explains safe defanging. The same evidence rule applies to email: retain an exact private original and create a neutralised, redacted working copy for tickets or reports.

## Domain, certificate and HTTP clues

The browser's address bar remains critical because the proxy needs its own reachable origin. Everything else on the page may be supplied by the legitimate service in real time.

### Domain and DNS observations

Look for a registrable domain that is not owned or approved by the claimed organisation, brand words placed in a subdomain, visually confusable characters, recently observed DNS, unusual authoritative nameservers, and hosting unrelated to the service being impersonated. Redirector and final proxy hosts may use different domains or providers.

None of these is a verdict. Young domains host legitimate launches. Commodity cloud infrastructure hosts both normal and abusive workloads. A brand string in a hostname is a lead, not proof of operation or attribution.

Compare infrastructure with known-good properties maintained by the identity or application owner. Passive discovery and Certificate Transparency can reveal adjacent names, but pivoting must be bounded by explicit evidence. The [HECAVEX infrastructure-pivoting guide](/en/research/infrastructure-pivoting-101/) shows how to separate exact matches, related observations and unsupported expansion.

### TLS certificate observations

A valid HTTPS certificate proves that the presented certificate was accepted for the hostname under browser trust rules. It does not prove that the hostname belongs to the brand displayed on the page. Review certificate names, issuance timing and continuity with DNS observations. A newly issued certificate shortly before a targeted campaign can strengthen a timeline, but certificate issuer alone is not an Evilginx signature.

Certificate Transparency is especially useful for discovery and chronology. It is not a maliciousness feed. That is the same candidate-versus-verdict boundary used by [HECAVEX Radar methodology](https://radar.hecavex.com/methodology/).

### HTTP and page-behaviour observations

Potential clues include:

- the page presents current tenant branding while the browser remains on an unrelated origin
- response content or scripts reference several legitimate authentication origins alongside one unapproved hostname
- cookies, redirects, `Origin` or `Referer` behaviour do not match the organisation's known login path
- the first request produces a benign page, denial or redirect while a target-specific link behaves differently
- the flow depends on a precise path or query token and cannot be reproduced from the bare domain
- automated scanners, non-target regions or unfamiliar user agents receive different content
- after authentication the user is redirected to a real document or harmless site, creating the impression that the earlier step merely failed.

These behaviours can also occur in legitimate federation, application proxies, WAFs, CDNs and marketing redirectors. Compare them to the organisation's approved architecture. Do not label a framework from one header or favicon.

## Identity telemetry is where the incident becomes visible

The most valuable evidence may appear after the phishing page has disappeared. Microsoft's [token-theft playbook](https://learn.microsoft.com/en-us/security/operations/token-theft-playbook) recommends access to Entra sign-in and audit logs, Office activity and relevant risk detections. Preserve them quickly because retention differs by licence and workload.

### Authentication and session signals

Correlate the click and user-reported authentication time with:

- a successful sign-in from the expected user followed closely by access from another IP, geography, device or user agent
- unfamiliar sign-in properties, anonymous infrastructure or a device claim inconsistent with the user's managed endpoint
- non-interactive activity or token use without the expected preceding device and interactive-authentication context
- changes in risk level, session properties or conditional-access evaluation
- attempts to access a different application using the same identity shortly after the lure.

Impossible-travel detections can help, but they are neither necessary nor sufficient. Corporate VPNs, mobile networks and global proxies generate location changes. A replay may also occur from infrastructure close to the victim. Device identity, token properties, application sequence and follow-on actions often carry more weight than distance alone.

### Post-access signals

Microsoft reporting on AiTM and BEC repeatedly identifies activity such as mailbox search, inbox or forwarding rule creation, deletion of sent messages, internal phishing, OAuth application changes and financial-conversation reconnaissance. Also examine:

- new authentication methods, devices or recovery details
- unusual consent grants, service principals or application permissions
- mailbox delegation and transport or inbox rules
- mass or unusual SharePoint, OneDrive and email access
- administrative role or conditional-access changes
- messages sent to trusted internal or external contacts and then deleted
- payment-thread access, altered invoices or lookalike reply chains.

The absence of one item does not clear the account. An attacker may use the session briefly, sell it, wait, or target a different application.

## A detection model that survives framework changes

Rather than maintain one brittle Evilginx IOC list, operate correlations such as:

```text
Delivery chain:
  suspicious or newly observed link delivered to a user
  followed by browser navigation to an unapproved authentication origin
  followed by a successful identity-provider authentication

Session chain:
  authentication associated with the user's device and time
  followed by session use from a materially different device/network context
  followed by sensitive application, mailbox, OAuth or data-access activity

Infrastructure chain:
  deceptive hostname or certificate appears shortly before delivery
  and serves authentication-shaped content or target-gated redirects
  and is observed in recipient or secure-gateway telemetry
```

Weight the combined chain. Do not make certificate age or one header a mandatory condition. Preserve the reason each signal contributed so an analyst can explain the alert and tune legitimate identity proxies without creating a blanket exclusion.

## Controls that change the outcome

### Phishing-resistant authentication

CISA recommends phishing-resistant MFA and identifies FIDO/WebAuthn as the widely available phishing-resistant approach. Microsoft Entra's [authentication strengths](https://learn.microsoft.com/en-us/entra/identity/authentication/concept-authentication-strengths) can require methods such as FIDO2 security keys, Windows Hello for Business or multifactor certificate-based authentication for sensitive resources.

The security property matters: the authenticator binds the ceremony to the legitimate origin rather than giving the user a transferable code to enter through an intermediary. Roll out to administrators and high-risk users first, then expand with measured device and recovery readiness. Keep break-glass accounts tightly controlled and monitored.

### Device and session controls

Where the application and platform support it, require managed or compliant devices for sensitive access, apply risk-based conditional access, and evaluate token protection or binding. These are layers, not slogans. Coverage, supported clients, legacy protocols and recovery paths need testing.

Restrict persistent sessions and require fresh phishing-resistant authentication for sensitive actions. Monitor changes to MFA methods, OAuth grants and devices. Disable legacy authentication that cannot satisfy modern controls.

### Delivery and web controls

Detonate or rewrite inbound links using approved security services, but retain original evidence. Flag authentication pages on newly observed or uncategorised domains. Teach users that the address bar, password-manager origin match and security-key prompt are stronger signals than page appearance. Provide a one-action reporting path that sends the original message to defenders without asking the recipient to investigate.

## Containment and evidence preservation

If a user authenticated through a suspected reverse proxy, assume that password and session material may be exposed until investigation shows otherwise.

1. **Preserve before expiry.** Export sign-in, audit, mailbox, OAuth, endpoint, email and secure-web records for the relevant window.
2. **Disable or restrict the account when risk justifies it.** Coordinate so the adversary cannot continue while evidence is collected.
3. **Revoke sessions and refresh tokens.** A password change alone does not invalidate every authenticated session.
4. **Reset credentials through a trusted device and channel.** Verify the user's recovery and MFA methods and remove unauthorised registrations.
5. **Inspect persistence and impact.** Review mailbox rules, delegates, OAuth grants, devices, applications, administrative changes, files and messages.
6. **Scope the campaign.** Search for the lure, sender, URL components, domain and click activity across recipients. Use infrastructure pivots only where evidence supports them.
7. **Record confidence separately.** Distinguish attempted visit, credential submission, successful MFA, possible session exposure, confirmed replay and confirmed impact.

Do not ask the user to revisit the page. Do not submit credentials to confirm the proxy. Do not depend on the site remaining online. Recipient telemetry and identity-provider logs are usually more durable than a later public scan.

## Threat context without tool-based attribution

APT Notes records [Evilginx](https://apt.hecavex.com/tools/evilginx/) as supporting software and links it to source-backed procedures. The [Star Blizzard](https://apt.hecavex.com/actors/star-blizzard/) and [Void Blizzard](https://apt.hecavex.com/actors/void-blizzard/) dossiers describe reported use against European, NATO and Ukraine-related targets. The supporting [Adversary-in-the-Middle technique record](https://apt.hecavex.com/techniques/adversary-in-the-middle/) preserves the behaviour separately from actor identity.

Finding Evilginx-like behaviour does not attribute an incident to either actor. Open tools, shared services and copied tradecraft are not unique fingerprints. Attribution requires victimology, chronology, infrastructure, operational behaviour and source-specific reporting that survives alternatives.

## Official and primary sources

- [MITRE ATT&CK: evilginx2, S9003](https://attack.mitre.org/software/S9003/)
- [MITRE ATT&CK: Adversary-in-the-Middle, T1557](https://attack.mitre.org/techniques/T1557/)
- [Microsoft Security: From cookie theft to BEC](https://www.microsoft.com/en-us/security/blog/2022/07/12/from-cookie-theft-to-bec-attackers-use-aitm-phishing-sites-as-entry-point-to-further-financial-fraud/)
- [Microsoft Security: Detecting and mitigating a multi-stage AiTM phishing and BEC campaign](https://www.microsoft.com/en-us/security/blog/2023/06/08/detecting-and-mitigating-a-multi-stage-aitm-phishing-and-bec-campaign/)
- [Microsoft Security: Token tactics](https://www.microsoft.com/en-us/security/blog/2022/11/16/token-tactics-how-to-prevent-detect-and-respond-to-cloud-token-theft/)
- [Microsoft Learn: Token theft playbook](https://learn.microsoft.com/en-us/security/operations/token-theft-playbook)
- [Microsoft Learn: Conditional Access authentication strengths](https://learn.microsoft.com/en-us/entra/identity/authentication/concept-authentication-strengths)
- [CISA: More than a Password](https://www.cisa.gov/ncas/tips/st05-012)

_Assessment date: 31 August 2026. Confidence is high for the reverse-proxy session-theft model and cited defensive guidance. A framework identification or account-compromise conclusion remains case-specific and must be supported by correlated evidence._
