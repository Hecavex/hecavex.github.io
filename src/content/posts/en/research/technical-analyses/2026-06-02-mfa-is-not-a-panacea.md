---
title: "MFA Is Not a Panacea, and It's Time We Stopped Pretending It Is"
description: "Why MFA is essential but insufficient against session theft, AiTM, token replay, OAuth abuse, and modern account takeover."
seo_title: "MFA Bypass Through Adversary-in-the-Middle Phishing"
seo_keywords:
  - "MFA bypass with adversary-in-the-middle phishing"
  - "session cookie theft"
  - "token replay"
  - "OAuth abuse"
  - "phishing-resistant MFA"
date: 2026-06-02T07:30:41.443Z
lang: en
translation_key: substack-mfa-nera-panaceja-ir-laikas-nustoti
permalink: /en/research/mfa-is-not-a-panacea/
author: deividas-lis
content_type: technical-analysis
confidence: moderate
tlp: clear
categories: ["identity-security", "social-engineering"]
tags: ["MFA", "AiTM", "session theft", "OAuth", "identity security"]
featured: false
scope: "Analysis of public incidents and technical documentation covering MFA bypass and session-hijacking methods."
limitations: "MFA effectiveness depends on the method, implementation, and surrounding controls; this article does not assess one specific organisation."
key_findings:
  - "MFA sharply reduces password-based attacks but does not protect a stolen session."
  - "Phishing-resistant FIDO2 methods are stronger than push or TOTP models."
  - "Containment must cover tokens, OAuth grants, sessions, mailbox rules, and enrolled devices."
image:
  path: /assets/img/posts/substack/mfa-nera-panaceja-ir-laikas-nustoti/01.webp
  alt: "MFA Is Not a Panacea, and It's Time We Stopped Pretending It Is"
  thumbnail: /assets/img/posts/substack/mfa-nera-panaceja-ir-laikas-nustoti/01-card.webp
  width: 1280
  height: 719
source_url: https://deivlis.substack.com/p/mfa-nera-panaceja-ir-laikas-nustoti
---
![A sign-in screen and lightning fracture illustrate that MFA is necessary but not a panacea.](/assets/img/posts/substack/mfa-nera-panaceja-ir-laikas-nustoti/01.webp)

*If there is one takeaway from this article, it is very simple. MFA and 2FA are required. Without them, organisations and individuals remain practically naked against password spraying, password reuse, credential stuffing and a large part of automatic account takeover. Microsoft has repeatedly emphasized in its documentation and blogs that MFA greatly reduces the risk of account compromise, and calls MFA one of the most important layers of identity hardening. That part is true. (**<https://www.microsoft.com/en-us/security/blog/2019/08/20/one-simple-action-you-can-take-to-prevent-99-9-percent-of-account-attacks/>**)*

*But that doesn't mean another, much-loved LinkedIn PowerPoint IAM school conclusion. No, "we have MFA" does not mean that account theft has ended, that unauthorized sign-ins are no longer possible, and that the entire identity security program now fits into one checkbox. Microsoft, MITRE, OWASP, Cloudflare, Cisco Talos and FIDO Alliance all show the same reality in blogs ie. modern attackers (TAs/APTs.. I would say even script kiddies) long ago learned not only to steal passwords... they steal session cookies, refresh tokens, access tokens, OAuth consent, or simply compromise the endpoint and take an already authenticated session. (**<https://www.microsoft.com/en-us/security/blog/2022/07/12/from-cookie-theft-to-bec-attackers-use-aitm-phishing-sites-as-entry-point-to-further-financial-fraud/>**)*

*Therefore, the serious answer to account takeover in 2026 is not "enable MFA". I would say the answer is layered defense. Phishing-resistant authentication, endpoint protection, token protection, session controls, OAuth app governance, sign-in monitoring, IR playbooks and fast containment. In other words, not LinkedIn comments from "wannabe Ethical hacker" or those "Cybersecurity specialists" (where the media claim not to have worked with cyber security in their life), but a real defense.*

---

## **Why we have an MFA is not a strategy**

in the Lithuanian media *(I'm looking directly at Delfi's articles and when members of the Seimas have recently spoken out about wannabe ethical hackers...)* is one wonderful tradition. Account compromise occurs. The mailbox is leaking. Invoice fraud emails are sent from the compromised account *(say)*. Someone loses their Teams, M365 or social account. And then the same digital philosopher always appears in the comments *(or what will you call him/them there..)*, which sums up all of IAM in seven words, "And 2FA was enabled." If it wasn't, everyone feels like they've solved the incident. If there was, silence begins, because then we have to talk about session hijacking, token replay, OAuth abuse and endpoint compromise *(well, this is where the swearing begins for them.. the unpleasant truth)*. And here, one or more buzzwords and "ethical hacker" in the bio description or LinkedIn title are no longer enough.

The problem is not that MFA is overpraised. The problem is that it is often praised as if it solves more than it actually does. MFA sharply reduces the success rate of classic credential-based attacks. Microsoft states that MFA can block more than 99.9% of account-compromise attacks that rely on passwords as the primary entry point. In other words, if an organisation still relies on password-only authentication, that is not even a "maturity gap". It is an unlocked door with a sign saying "please be ethical".

However, the modern identity threat landscape is no longer just about passwords. Microsoft Entra documentation very clearly separates sign-in session tokens from app sessions and explains that such artifacts as PRT and refresh token can live for weeks or months, while app auth cookies live according to the logic of the application itself. When such an artifact is stolen, the attacker does not need to "beat MFA" again. It only needs to successfully impersonate an already authenticated user. OWASP and MITRE describe this also directly. Session ID, web session cookie or application access token can allow to fully impersonate the user without a new login. (**<https://learn.microsoft.com/en-us/entra/identity/devices/concept-tokens-microsoft-entra-id>**)

And this is where the superficial "MFA is magic" narrative gets stuck. He is talking about the login screen. And real CTI and incident response often talk about what happens behind the login screen. Session reuse. Non-interactive sign-ins. Added MFA methods. Mailbox forwarding rules. OAuth grants. App permissions. Suspicious downloads. BEC follow-on activity. The Microsoft token theft playbook even clearly says that if the activity cannot be confirmed as valid, it should be considered a breach and go to containment, and not take comfort in the fact that "but we had MFA". (**<https://learn.microsoft.com/en-us/security/operations/token-theft-playbook>**)

![Comparison of the protection MFA provides and the attack paths that remain.](/assets/img/posts/substack/mfa-nera-panaceja-ir-laikas-nustoti/02.webp)

---

### **How modern account takeover works**

The easiest way to understand the problem is to separate three things that are often mixed into one smoothie in the LinkedIn pseudo-expert world.

***The first is authentication.***

***The second is session.***

***The third is a token.***

Authentication answers the question of whether you are who you say you are. Session and tokens answer a completely different question. Does the system already trust you and how long will that trust last? Microsoft clearly states that the PRT and refresh token can be updated in a rolling model, the access token usually lives for about 60-90 minutes, and the life of the app auth cookie depends on the application itself. This is why token theft is so valuable to an attacker. (**<https://learn.microsoft.com/en-us/entra/identity/devices/concept-tokens-microsoft-entra-id>**)

Even worse, session cookies can be found on disk, in browser process memory, and in network traffic, and MITRE directly notes that stealing them can bypass some MFA protocols. OWASP also emphasizes that an active session cannot be considered self-trusted simply because a user has successfully authenticated at some point. In other words, MFA does not necessarily "fail". An attacker simply steals that successful authentication. (**<https://attack.mitre.org/techniques/T1539/>**)

The link simplifies the AiTM flow, it's not a miracle.. it just makes very good use of the fact that people and some commenters still think in terms of logins, not sessions (**[FlowChart](https://mermaid.live/view#pako:eNpNkU1u2zAQha8y4FoxZEeSZS0K-DdxkQBGXHRR2YuxNJYZS6IwpPxTw8uepzfoKr1XacVpzA054PfezCNPIlEpiUisc7VPNsgGnl4WJdjVj7_bUhn1ihoyrEuEaiP1RpYZ5DXTEu7uvsAgfqFUMiVGMSCvsLmDCjNavvsMGm4Yj3cyz2R5ACMrBUw7Ym1BVofjlRw25Ch-okwamKazd8M54hxyZbW3tqMGHt8O-fZ7R6mdErXeK06v4LgBJ7dghWYn2Ugb6XnSv3KThnu4dtfEO5kQZPz26--fC6lJa6lKSJTaSgLJYNSWylpf9Q-N_jGeXRJBRSwLtAGMXGNi_lOPDTWN-8ZgsiX7ZmZbs_y017hTsGK1txMcXz_SThvZ1_gZZb5SB8AksbwD3wgLu83tz9FMydI4MBgPHUjRIJgNrc1SOCJjmYrIcE2OKIgLvJTidLFeCEsVtBCRPabI24VYlGerqbD8oVTxIWNVZxsRrTHXtqor24BGEjPGT4TKlHio6tKIqO13Gw8RncRBREG3FfqB67k93_PDXug54iiiThC02t1e1wv9e7_tBx3_7IifTVe31WsHHbftBl7ohe59Jzz_Ay_m3dU)**).

MITRE describes evilginx2 as an open-source AiTM framework that acts as a reverse proxy between the victim and the legit service and is able to intercept credentials, authentication tokens and session cookies. Microsoft's 2022 AiTM analysis showed the same logic in practice. A proxy is inserted between the user and the legit login, which collects not only the password, but also authenticated session artifacts, after which the attacker can sign in to Exchange Online or other resources as if he were the user himself. And if the word phishlets sounds like some cyber woodoo to someone... These are target-specific config files that define reverse proxy behavior for a specific login flow. It's just industrialized phishing... and I won't say where in Lithuania I tried it, how much I tried it.. but I removed all tokens/session cookies.. I only had to work with phishlets until I hacked it well.. *(maybe you already consider yourself an Ethical hacker, because I'm good at AiTM?? And register as an "Ethical Hacker" on LinkedIn..?)* (**<https://attack.mitre.org/software/S9003/>**, **<https://www.microsoft.com/en-us/security/blog/2022/07/12/from-cookie-theft-to-bec-attackers-use-aitm-phishing-sites-as-entry-point-to-further-financial-fraud/>**)

It is important to emphasize one nuance here, which Microsoft itself formulates very clearly. AiTM is not an MFA vulnerability. This is not a "cracked MFA". This is session theft. The attacker receives an authenticated session on behalf of the user, regardless of the method by which the user successfully logged in there. This distinction is very important, because otherwise the discussion turns into an elementary argument "that means MFA doesn't work". No. Works. Just not alone.

From the IR side, this also means another part... When you see an anomalous token, unfamiliar non-interactive sign-in, added MFA credential, mailbox forwarding rule or strange data download activity, it is no longer enough to tell the user "change your password and you will be safe".. The Microsoft token theft playbook recommends not only changing the password during containment, but also blocking the user, revoking access, marking the account as compromised, reviewing apps, devices, inbox rules, then revoke current tokens and remove unknown MFA options or device enrollments. In other words, if the session is stolen, a password reset alone is not a magical exorcism. (**<https://learn.microsoft.com/en-us/security/operations/token-theft-playbook>**)

![Adversary-in-the-middle phishing chain captures credentials, an MFA code, and a session cookie.](/assets/img/posts/substack/mfa-nera-panaceja-ir-laikas-nustoti/03.webp)

---

### **Incidents and campaigns that destroy the MFA myth**

Let's start with Microsoft's study, because it's one of the cleanest examples of what real-life AiTM looks like. In July 2022, Microsoft described a large campaign that attempted to target more than 10,000 organizations starting in September 2021. Flow was very (I would say..) "enterprise grade". Phishing lure, redirector pages, Evilginx2 phishing site, stolen credentials, stolen session, then mailbox access and follow-on BEC. This is no longer "a hacker sends a fake login page". This is the whole chain, with lures, gatekeeper pages, branding and session hijacking after a successful MFA. (**<https://www.microsoft.com/en-us/security/blog/2022/07/12/from-cookie-theft-to-bec-attackers-use-aitm-phishing-sites-as-entry-point-to-further-financial-fraud/>**)

![Methods for stealing authenticated artifacts and using them to bypass sign-in.](/assets/img/posts/substack/mfa-nera-panaceja-ir-laikas-nustoti/04.webp)

From TTP's point of view, the campaign was "nice". The redirector validated URL fragments, automatically filled in the user's email, and the phishing landing page proxyed the real Azure AD sign-in page, even with the organization's branding. User enters credentials, performs MFA, then background attacker receives credentials and authenticated session. Microsoft directly writes about access to mailboxes and follow-on financial fraud through BEC. The recommended mitigations are also not about "turn on one additional checkbox on MFA", but about advanced anti-phishing, suspicious sign-in monitoring, Identity Protection anomalous token alerts, Continuous Access Evaluation and Conditional Access signals, including IP, device state and other identity-driven conditions.

Next we have the Cisco 2022 incident, which shows very nicely that push-based MFA can be a very decent protection until the moment a person becomes an exhausted pop-up manager. Cisco became aware of the potential compromise on May 24, 2022. The investigation showed that employee credentials were compromised after an attacker took over a personal Google account in which the browser synchronized saved logins. Then vishing and MFA push bombardment followed, until the user finally confirmed the push request and the attacker got VPN access to the user context. This case is important because there was neither a zero-day exploit nor some mystical nation-state teleportation through the firewall. There were browser-synced creds, social engineering, push fatigue and a person who pressed the wrong button at one point. (**<https://blog.talosintelligence.com/recent-cyber-attack/>**)

![Fake sign-in and session theft compared with phishing-resistant secure sign-in.](/assets/img/posts/substack/mfa-nera-panaceja-ir-laikas-nustoti/05.webp)

Cloudflare's 2022 case is the opposite, which is why it is so valuable. After the Twilio wave, a very similar SMS-phishing campaign targeted more than 130 companies, including Cloudflare. Social engineering persuaded three employees to enter credentials into a phishing page. With TOTP, the story could have ended badly: Cloudflare found that credentials were relayed in real time through Telegram, and a TOTP code could have let the attacker authenticate before it expired. Cloudflare instead used FIDO2-compliant hardware security keys with origin binding, so the attacker could not log in. This is the perfect answer to anyone who says "MFA is MFA". No, it is not. TOTP would have been much weaker; FIDO2 with origin binding largely destroys the value of a real-time phishing proxy. (**<https://blog.cloudflare.com/making-phishing-defense-seamless-cloudflare-yubico/>**)

Another issue is OAuth consent abuse. In 2021, Microsoft wrote about growing phishing activity in which the user never enters a password on a fake page. Sign-in happens through a legitimate identity provider; the person simply clicks "Allow" and grants an attacker-controlled app permission. The app receives an access token and can make API calls on the user's behalf, reaching email, files, contacts and other data. Microsoft emphasises that such attacks may not involve password theft at all, yet can still establish persistence and support reconnaissance inside an organisation. That is why "but we have MFA"—there was no MFA in the Centre of Registers case—sounds like trying to extinguish a fire by pointing out that you own a very full water bottle. (**<https://www.microsoft.com/en-us/security/blog/2021/07/14/microsoft-delivers-comprehensive-solution-to-battle-rise-in-consent-phishing-emails/>**)

OAuth abuse did not disappear in 2021. In March 2026, Microsoft described phishing campaigns that exploited OAuth redirection, created malicious applications with redirect URIs pointing to attacker-controlled domains, and used intentionally invalid scopes with `prompt=none` to move users from a trusted identity-provider domain to phishing or malware-delivery pages. The mechanism did not try to steal tokens during silent authentication; it abused trusted redirect behaviour to enable follow-on phishing or endpoint compromise. Microsoft's recommendations are direct: limit user consent, review app permissions regularly, remove overprivileged or unused apps, use app governance and identity protection, correlate cross-domain detections and review consent grants weekly. (**<https://www.microsoft.com/en-us/security/blog/2026/03/02/oauth-redirection-abuse-enables-phishing-malware-delivery/>**)

And then we come to infostealers, who most beautifully break the myth that "MFA locks the account". No. Infostealer doesn't even try to "crack MFA". It comes to the endpoint and takes whatever is already keeping the authenticated session alive. Microsoft's 2025 and 2026 research on infostealers shows a very clear direction. Malware campaigns massively collect browser credentials, session cookies, authentication tokens, wallet data and other secrets, use phishing, malvertising, abuse of trusted platforms, ClickFix and even WhatsApp or fake PDF tools as delivery. The 2025 Microsoft malvertising campaign affected nearly a million devices, and the 2025 Lumma study described a fairly industrialized distribution ecosystem. (**<https://www.microsoft.com/en-us/security/blog/2025/03/06/malvertising-campaign-leads-to-info-stealers-hosted-on-github/>**)

If we look at specific families, the picture becomes even clearer. **Lumma**, according to Microsoft, steals saved passwords, session cookies and autofill data from Chromium, Mozilla and Gecko browsers, and the 2025 campaigns were distributed through malvertising, phishing, drive-by compromise and ClickFix fake CAPTCHA flow. Microsoft also states that between March and May 2025, it recorded more than 394,000 infected Windows devices worldwide. **RedLine** according to SonicWall, it targets saved passwords, cookies, VPN credentials, Discord tokens, wallets and browser SQLite data. **StealC**, according to Microsoft and Huntress, steals credential tokens, sessions and browser-stored data and can be used before initial access operations. **Vidar 2.0**, according to Trend Micro, switched to C rewrite in October 2025, used a multithreaded architecture, and even tried to bypass browser security features via direct memory injection. **Raccoon**, according to Microsoft, collects passwords, browser cookies, autofill, wallet data and screen captures. This is not a niche exotic. This is a commodity economy.

![Infostealer malware ecosystem and the browser and identity data it steals.](/assets/img/posts/substack/mfa-nera-panaceja-ir-laikas-nustoti/06.webp)

Impact is not just "stole one password" from such activities. Stolen cookies and refresh tokens can lead to SSO session takeover, mailbox access, document access, internal phishing, BEC, cloud compromise, developer secret theft and even ransomware follow-on activity. Microsoft directly writes that token theft can occur through anomalous tokens, unfamiliar non-interactive sign-ins, added MFA methods, mailbox rule changes and unusual downloads, and in the case of a successful compromise it is necessary not only to rotate secrets, but also to remediate the device, revoke tokens, remove unknown devices or MFA options and sometimes even completely reset the system. If someone still writes "just turn on MFA and don't choose" after that, the problem is no longer in technology, but in the fact that a person confuses an awareness poster with an incident response.

---

## **Which MFA is really strong**

A bit of sarcasm is sorely needed here, because some of the public discourse about MFA makes it seem like all technologies are the same, just different colors. Like SMS code, TOTP, push, number matching, FIDO2 and passkeys would be the same thing, just with different UX. No.

The table below is a synthesis of NCSC recommendations, Microsoft number matching guidance and the FIDO Alliance passkey model. It's not "the only truth in the universe", but it shows very well why the sentence "we have an MFA" without context is almost worthless.

![Table comparing MFA methods, phishing resistance, and residual risks.](/assets/img/posts/substack/mfa-nera-panaceja-ir-laikas-nustoti/07.webp)

The most important nuances here are two. **First**, Microsoft clearly says that number matching is a security upgrade compared to traditional push. **Second**, the NCSC is cautious about challenge-based apps and notes only partial phishing resistance, because prompt fatigue still exists. FIDO2 and passkeys are in a completely different league here, because they rely on public key cryptography, origin binding and do not have a reusable shared secret that can be transferred through a phishing proxy. The FIDO Alliance directly writes that passkeys are phishing resistant by design and more secure than the traditional authentication + MFA model. (**[Microsoft](https://learn.microsoft.com/en-us/entra/identity/authentication/how-to-mfa-number-match?tabs=iOS)**, **[FIDO](https://fidoalliance.org/passkeys/)**, **[NCSC](https://www.ncsc.gov.uk/collection/mfa-for-your-corporate-online-services/recommended-types-of-mfa)**)

This does not mean that everyone has to throw out TOTP tomorrow and run to buy hardware keys for every grandmother. This means that security controls need to be measured according to the threat model. If you are protecting high-value admin accounts, finance, M365 admins, privileged access, developer access and executives, FIDO2 or passkeys should not be "nice to have", but default. The Cloudflare case showed very well why. FIDO2 stopped the breach where TOTP would realistically have been weaker. (**<https://blog.cloudflare.com/2022-07-sms-phishing-attacks/>**)

---

## **In conclusion**

A short conclusion would be this. MFA is not a lie. The lie is that sugary, social media audience-friendly oversimplification that the MFA is the end. In reality, it is the beginning. If your entire cyber hygiene fits into the sentence "we have 2FA", you don't have a strategy.. You have a sentence.... And attackers, unfortunately, have a whole kill chain.
