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
  path: /assets/img/posts/2026-08-31-evilginx-detection/evilginx-detection-hero-v2.webp
  social: /assets/img/social/evilginx-detection-en.png
  thumbnail: /assets/img/posts/2026-08-31-evilginx-detection/evilginx-detection-card-v2.webp
  alt: "Reverse-proxy phishing evidence model connecting a user, deceptive proxy and legitimate identity provider with lure, web, sign-in and token telemetry"
  width: 1600
  height: 900
---

## The sign-in can be real while the browser is in the wrong place

Traditional phishing often presents a copied form and sends whatever the user enters to a collection endpoint. Reverse-proxy phishing changes the evidence. The intermediary relays traffic between the victim's browser and the real identity provider. The login page can therefore be current, tenant-branded and responsive. The password and MFA transaction may genuinely be accepted by the legitimate service. The hostile element is the hostname in the middle and its opportunity to observe or reuse the authenticated session.

[MITRE ATT&CK describes evilginx2 as S9003](https://attack.mitre.org/software/S9003/), an open-source adversary-in-the-middle framework capable of proxying a legitimate web service and intercepting credentials, authentication tokens and session cookies. The product name is useful threat context, but defenders should design for the behaviour class. Different frameworks, private modifications and managed phishing services can produce the same outcome.

This guide therefore does not answer "how do I fingerprint one Evilginx version?" It answers the more durable question: **what evidence shows that an authentication journey was relayed through a deceptive origin and that the resulting identity session may have left the user's control?**

<aside class="hx-callout warning"><strong>Defensive boundary</strong>This guide contains no installation steps, phishlet syntax, lure generation, credential interception, proxy configuration or evasion instructions. Do not reproduce a live authentication flow to test a suspicious site. Preserve evidence and use authorised controls.</aside>

## A reverse proxy changes what "fake page" means

In a simplified AiTM phishing flow:

1. a lure sends the user to an attacker-controlled hostname
2. that server opens its own connection to the legitimate identity provider
3. requests and responses are relayed between the two TLS sessions
4. the user completes the real provider's authentication sequence through the intermediary
5. the legitimate provider issues session material after successful authentication
6. the intermediary can observe material available in the proxied flow, and an attacker may try to replay it from another context.

[Microsoft's 2022 investigation](https://www.microsoft.com/en-us/security/blog/2022/07/12/from-cookie-theft-to-bec-attackers-use-aitm-phishing-sites-as-entry-point-to-further-financial-fraud/) documented Evilginx2-linked campaigns targeting more than 10,000 organisations and described subsequent mailbox access and payment fraud. The key lesson is not that MFA is useless. MFA still blocks large classes of password-only attack. The lesson is that a bearer session obtained _after_ successful MFA can become a different authentication problem.

![Reverse-proxy phishing request path from the user's browser through an intermediary to the legitimate identity provider](/assets/img/posts/2026-08-31-evilginx-detection/evilginx-request-path-en.svg)

*Figure: The browser authenticates through an unapproved origin while the identity provider can still complete a valid sign-in.*

### Two TLS connections do not create one trusted origin

The victim's browser terminates TLS at the deceptive hostname. The intermediary separately validates and connects to the legitimate identity provider. [RFC 9525](https://www.rfc-editor.org/rfc/rfc9525.html) is precise about the property TLS provides: the certificate identity is checked against the service identity the client expects. If the starting input is a phishing hyperlink, TLS can securely connect the browser to the wrong application. The padlock protects that connection from passive interception. It does not transfer the copied brand's authority to the hostname.

HTTP origin is the scheme, host, and port tuple. Every redirect destination must be evaluated as a separate origin under [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html). A reverse proxy can rewrite `Location` values and page references so that the browser continues to address the deceptive origin while the upstream connection follows the legitimate authentication flow.

Cookie language also needs precision. Under [RFC 6265](https://www.rfc-editor.org/info/rfc6265/), browser cookies are scoped by host or domain and path. The browser does not simply accept a legitimate-provider host-only cookie as a cookie for an unrelated phishing domain. A proxy can observe upstream `Set-Cookie` responses, retain server-side session state, rewrite cookie attributes where the application allows it, and issue separate browser-side state for its own origin. Which artifact is exposed depends on the application and flow.

In OpenID Connect Authorization Code Flow, the browser carries an authorization code back to the relying party, while the relying party normally exchanges that code with the token endpoint over a direct backchannel. [OpenID Connect Core](https://openid.net/specs/openid-connect-core-1_0.html) therefore does not support the blanket claim that every proxied login exposes every ID token, access token, and refresh token. A reverse proxy may obtain credentials, browser-visible cookies, codes, or application session material, but the actual artifact must be established from telemetry and application architecture.

Bearer semantics explain why the distinction matters. [RFC 6750](https://www.rfc-editor.org/rfc/rfc6750.html) defines a bearer token as usable by whoever possesses it. [OAuth 2.0 Security Best Current Practice](https://www.rfc-editor.org/rfc/rfc9700.html) recommends sender-constrained and audience-restricted access tokens where possible. A browser session cookie, an Entra sign-in session token, an OAuth access token, a refresh token, and an OIDC ID token are not interchangeable. Record which asset was observed before choosing containment.

The related HECAVEX article [MFA Is Not a Panacea](/en/research/mfa-is-not-a-panacea/) explains this boundary in depth. A password, an MFA factor and an authenticated session are different assets. Controls and incident actions must name the asset they protect.

## Grade the evidence before calling it session theft

| Level | Observation | Defensible conclusion |
| --- | --- | --- |
| 0 | a deceptive URL or certificate is found | candidate infrastructure exists |
| 1 | delivery or click telemetry links the user to that origin | the user was exposed to the journey |
| 2 | web and identity timestamps show authentication through the unapproved origin | a proxied authentication event is likely |
| 3 | the intermediary's opportunity to observe a specific session artifact is supported by the application flow | session exposure is plausible and the artifact can be named |
| 4 | the same session or token is redeemed from inconsistent context without the expected authentication | replay or session misuse is supported |
| 5 | mailbox, file, OAuth, or administrative actions are tied to that session | post-authentication impact is confirmed |

A cloned page screenshot is not level 2. A successful MFA event is not level 4. A location anomaly is not proof of replay. Severity should rise as independent evidence joins the chain, not because the tool name is fashionable.

## Detect across three truth planes

Reverse-proxy phishing rarely gives one universal signature. Reliable detection joins three planes that adversaries must traverse.

| Plane | What it can establish | Typical evidence |
| --- | --- | --- |
| lure and delivery | how the target was selected and sent toward the site | message headers, sender, rewritten link, attachment, QR code, click telemetry, recipient and delivery time |
| web and infrastructure | which origin the browser reached and how it behaved | exact URL, redirect chain, DNS, certificate, hosting, HTTP responses, page resources, proxy or browser telemetry |
| identity and impact | whether authentication and later account use departed from the user's normal context | sign-in and risk logs, token/session events, device claims, mailbox audit, OAuth grants, MFA changes, downloads and administrative actions |

The planes also protect the analysis from overclaiming. A suspicious domain without a target interaction is infrastructure evidence. A successful sign-in after a click is stronger, but it is not automatically token theft. A replay-like sign-in followed by mailbox rule creation and email deletion is a much more consequential chain.

![Reverse-proxy phishing evidence correlation across edge infrastructure, identity telemetry and workload activity](/assets/img/posts/2026-08-31-evilginx-detection/evilginx-signal-correlation-en.svg)

*Figure: A reverse-proxy assessment becomes stronger when independent web, identity and workload signals converge in time.*

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

[RFC 9162](https://www.rfc-editor.org/rfc/rfc9162.html) defines Certificate Transparency as an append-only publication and auditing mechanism for certificates and precertificates. A logged certificate or SCT supports issuance chronology and domain discovery. It does not show that a monitor detected abuse, that the certificate was used in the recipient's session, or that the CA has revoked it. Correlate certificate names and validity with passive DNS, recipient telemetry, and the exact observed TLS handshake.

For domain-validated certificates, the issuing process establishes control of the requested FQDN at issuance under the [CA/Browser Forum Baseline Requirements](https://cabforum.org/working-groups/server/baseline-requirements/about/). That is useful evidence of hostname control, not authorisation to represent the organisation copied by the page.

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

Capture HTTP facts as observations, not signatures. Record response status, redirect target, `Location`, `Set-Cookie` names and attributes, CSP, HSTS, HTML hash, script origins, favicon hash, and observation time. Do not publish recipient-specific query strings or live session identifiers. Headers, favicons, cookie names, ASN, hosting provider, and certificate issuer are mutable and shared by legitimate services. Their value comes from convergence and chronology.

## Identity telemetry is where the incident becomes visible

The most valuable evidence may appear after the phishing page has disappeared. Microsoft's [token-theft playbook](https://learn.microsoft.com/en-us/security/operations/token-theft-playbook) recommends access to Entra sign-in and audit logs, Office activity and relevant risk detections. Preserve them quickly because retention differs by licence and workload.

Start with immutable identifiers and clocks. In Entra sign-in records preserve `createdDateTime`, user, `appId`, resource, `ipAddress`, location, `deviceDetail`, `clientAppUsed`, `isInteractive`, `correlationId`, status, Conditional Access result, and risk fields. [Microsoft's sign-in log field guide](https://learn.microsoft.com/en-us/entra/identity/monitoring-health/concept-sign-in-log-activity-details) cautions that IP geolocation is best effort and authentication details can initially be incomplete while logs aggregate.

Where available, the [Microsoft Graph beta sign-in resource](https://learn.microsoft.com/en-us/graph/api/resources/signin?view=graph-rest-beta) adds fields such as `sessionId`, `uniqueTokenIdentifier`, `originalRequestId`, `ipAddressFromResourceProvider`, `authenticationDetails`, `incomingTokenType`, and token-protection status. This is a beta schema and interactive events are not the whole identity history. Preserve the raw export and explicitly request non-interactive event types when the collection method requires it.

On the delivery side, [Defender XDR `UrlClickEvents`](https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-urlclickevents-table) can retain the full clicked URL, account, workload, `NetworkMessageId`, click action, threat state at click time, IP address, click-through result, and URL chain. Microsoft notes that clicks from some Drafts or Sent contexts cannot always be joined to email tables by `NetworkMessageId`. A failed join is therefore missing linkage, not proof that no message existed.

Build a timeline with at least three clocks: message delivery and click, interactive authentication, and later token or application activity. Normalize time zones, retain raw timestamps, and record known ingestion delay. Compare the click IP and endpoint device to the identity-provider view. During proxied authentication the identity provider may see the proxy egress rather than the victim's public IP. Later replay can use the same infrastructure, nearby residential proxy space, or a completely different network.

### Authentication and session signals

Correlate the click and user-reported authentication time with:

- a successful sign-in from the expected user followed closely by access from another IP, geography, device or user agent
- unfamiliar sign-in properties, anonymous infrastructure or a device claim inconsistent with the user's managed endpoint
- non-interactive activity or token use without the expected preceding device and interactive-authentication context
- changes in risk level, session properties or conditional-access evaluation
- attempts to access a different application using the same identity shortly after the lure.

Impossible-travel detections can help, but they are neither necessary nor sufficient. Corporate VPNs, mobile networks and global proxies generate location changes. A replay may also occur from infrastructure close to the victim. Device identity, token properties, application sequence and follow-on actions often carry more weight than distance alone.

[Microsoft Entra risk detections](https://learn.microsoft.com/en-us/entra/id-protection/concept-identity-protection-risks) include Attacker in the Middle, anomalous token, token issuer anomaly, unfamiliar sign-in properties, anonymous IP, atypical travel, and suspicious browser signals. They are investigation leads with different precision and licensing requirements. Microsoft specifically warns that low and medium anomalous-token detections have a higher false-positive rate. Preserve the risk type, level, state, detection time, and linked sign-in rather than translating every risk event into confirmed theft.

A successful MFA detail proves that an authentication ceremony completed. It does not establish that the browser used an approved origin or that the resulting session remained with the user. A successful Conditional Access result proves that evaluated policies passed with the available claims. It is not a benign verdict. Likewise, a blank or unmanaged `deviceDetail` can be important, but device fields may be missing for valid clients and user agents are mutable.

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

Correlate the suspicious `sessionId` across sign-in and application activity when the platform exposes it. Microsoft's [Defender XDR session-cookie investigation guidance](https://learn.microsoft.com/en-us/defender-xdr/session-cookie-theft-alert) recommends comparing time and geography and tracing actions performed in that session across `AadSignInEventsBeta` and `CloudAppEvents`. High confidence comes from conjunction: session or token reuse, inconsistent device or client context, no expected fresh authentication, and sensitive activity in the same session.

For Microsoft 365, retain Unified Audit Log records for `New-InboxRule`, `UpdateInboxRules`, `Set-InboxRule`, mailbox reads and searches, sends, forwarding, deletion, and administrative changes. Review Entra audit activities such as `Consent to application`, `Add delegated permission grant`, and `Add app role assignment to the service principal` using [Microsoft's application-permission audit guidance](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/app-perms-audit-logs). OAuth persistence is not inherent to Evilginx. It is a separate post-compromise claim that needs its own event.

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

[WebAuthn Level 3](https://www.w3.org/TR/webauthn-3/) scopes a public-key credential to a relying-party identifier and requires the relying party to validate origin and RP ID. A credential registered for the legitimate relying party will not authenticate an unrelated deceptive origin. This is the protocol property behind phishing resistance. It is stronger than asking users to notice visual differences and stronger than a one-time code that can be relayed in real time.

### Device and session controls

Where the application and platform support it, require managed or compliant devices for sensitive access, apply risk-based conditional access, and evaluate token protection or binding. These are layers, not slogans. Coverage, supported clients, legacy protocols and recovery paths need testing.

[Microsoft Entra Token Protection](https://learn.microsoft.com/en-us/entra/identity/conditional-access/concept-token-protection) can bind supported sign-in session tokens to a device. Coverage is not universal. Native-app support is broader, while browser protection remains limited to selected applications, browsers, devices, and scenarios. Deploy in report-only mode, verify interactive and non-interactive sign-in effects, and describe the exact protected resource instead of claiming all browser cookies are device-bound.

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

Microsoft's [revoke user access guidance](https://learn.microsoft.com/en-us/entra/identity/users/users-revoke-access) distinguishes identity-provider access and refresh tokens from application-issued browser session cookies. Entra cannot directly revoke a cookie issued and controlled by a third-party application. Contact the application owner, revoke or deprovision the application session where supported, and account for token lifetime and propagation delay. Record when each containment action was issued and when access was actually denied.

![Session containment sequence beginning with revocation and access restriction before credential reset and impact review](/assets/img/posts/2026-08-31-evilginx-detection/evilginx-session-containment-en.svg)

*Figure: Session and application trust are revoked before password restoration because each artefact has a separate lifetime.*

## Validate the defensive path without operating a phishing proxy

1. Create synthetic lure, click, sign-in, risk, and cloud-activity records with shared test identifiers. Confirm the correlation preserves event time, ingestion time, user, device, application, session, and evidence level.
2. Exercise the approved phishing-reporting path with a harmless internal URL. Verify that the original message, headers, rewritten URL, click data, and analyst ticket remain linked.
3. Pilot phishing-resistant authentication and Conditional Access in report-only mode using [Microsoft's deployment guidance](https://learn.microsoft.com/en-us/entra/identity/authentication/how-to-deploy-phishing-resistant-passwordless-authentication). Measure readiness by user and device, including recovery and break-glass handling.
4. Run an incident-response tabletop with a synthetic compromised session. Time account block, Entra session revocation, application-side session invalidation, mailbox and OAuth review, and evidence export.
5. Submit suspicious URLs only through the organisation's approved security product or controlled detonation service. Query passive infrastructure before submission, redact recipient tokens, and record whether a result was looked up or newly submitted.
6. Confirm that analysts can state `not observed` when telemetry is absent. They must not convert it to `did not happen`.

Do not deploy Evilginx, create a phishlet, submit credentials, or proxy a real identity-provider session for validation. The control objective can be tested with synthetic telemetry, harmless reporting flows, policy evaluation, and containment timing.

## Threat context without tool-based attribution

APT Notes records [Evilginx](https://apt.hecavex.com/tools/evilginx/) as supporting software and links it to source-backed procedures. The [Star Blizzard](https://apt.hecavex.com/actors/star-blizzard/) and [Void Blizzard](https://apt.hecavex.com/actors/void-blizzard/) dossiers describe reported use against European, NATO and Ukraine-related targets. The supporting [Adversary-in-the-Middle technique record](https://apt.hecavex.com/techniques/adversary-in-the-middle/) preserves the behaviour separately from actor identity.

Finding Evilginx-like behaviour does not attribute an incident to either actor. Open tools, shared services and copied tradecraft are not unique fingerprints. Attribution requires victimology, chronology, infrastructure, operational behaviour and source-specific reporting that survives alternatives.

## Official and primary sources

- [MITRE ATT&CK: evilginx2, S9003](https://attack.mitre.org/software/S9003/)
- [MITRE ATT&CK: Adversary-in-the-Middle, T1557](https://attack.mitre.org/techniques/T1557/)
- [OpenID Foundation: OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html)
- [IETF: OAuth 2.0 Security Best Current Practice, RFC 9700](https://www.rfc-editor.org/rfc/rfc9700.html)
- [W3C: Web Authentication Level 3](https://www.w3.org/TR/webauthn-3/)
- [Microsoft Security: From cookie theft to BEC](https://www.microsoft.com/en-us/security/blog/2022/07/12/from-cookie-theft-to-bec-attackers-use-aitm-phishing-sites-as-entry-point-to-further-financial-fraud/)
- [Microsoft Security: Detecting and mitigating a multi-stage AiTM phishing and BEC campaign](https://www.microsoft.com/en-us/security/blog/2023/06/08/detecting-and-mitigating-a-multi-stage-aitm-phishing-and-bec-campaign/)
- [Microsoft Security: Token tactics](https://www.microsoft.com/en-us/security/blog/2022/11/16/token-tactics-how-to-prevent-detect-and-respond-to-cloud-token-theft/)
- [Microsoft Learn: Token theft playbook](https://learn.microsoft.com/en-us/security/operations/token-theft-playbook)
- [Microsoft Learn: sign-in log activity details](https://learn.microsoft.com/en-us/entra/identity/monitoring-health/concept-sign-in-log-activity-details)
- [Microsoft Learn: Entra risk detections](https://learn.microsoft.com/en-us/entra/id-protection/concept-identity-protection-risks)
- [Microsoft Learn: revoke user access](https://learn.microsoft.com/en-us/entra/identity/users/users-revoke-access)
- [Microsoft Learn: Conditional Access authentication strengths](https://learn.microsoft.com/en-us/entra/identity/authentication/concept-authentication-strengths)
- [CISA: More than a Password](https://www.cisa.gov/ncas/tips/st05-012)

_Assessment date: 31 August 2026. Confidence is high for the reverse-proxy session-theft model and cited defensive guidance. A framework identification or account-compromise conclusion remains case-specific and must be supported by correlated evidence._
