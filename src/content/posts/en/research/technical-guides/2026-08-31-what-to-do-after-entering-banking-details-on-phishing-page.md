---
title: "Entered Banking Details on a Phishing Page? Do This Now"
card_title: "What to Do After Banking Phishing"
description: "An emergency response guide for exposed card details, online-banking credentials, Smart-ID or OTP approvals, stolen sessions, transfers, and installed apps."
seo_title: "Entered Bank Details on a Phishing Page? Act Now"
seo_description: "A practical emergency checklist for exposed cards, bank credentials, Smart-ID, OTP codes, transfers, sessions and apps after a phishing page."
seo_keywords:
  - "entered bank details on phishing page"
  - "what to do after phishing"
  - "bank phishing response"
  - "Smart-ID phishing"
  - "stolen card details"
  - "report phishing Lithuania"
date: 2026-08-31 18:25:00 +0300
lang: en
translation_key: post-phishing-banking-response
permalink: /en/research/what-to-do-after-entering-banking-details-on-phishing-page/
author: deividas-lis
content_type: technical-guide
publication_class: technical-assessment
confidence: high
tlp: clear
categories: [fraud-scams, identity-security, social-engineering]
tags: [phishing, smishing, incident response, payment fraud, identity security, Smart-ID, Lithuania]
featured: false
draft: false
published: true
toc: true
comments: false
prose_width: wide
scope: "Immediate defensive response after a person enters banking, card or authentication data on a phishing page, approves a fraudulent action, or installs software from that flow."
limitations: "This guide cannot determine whether a bank can reverse a payment, whether a particular device is compromised, or which contractual and legal remedies apply. The bank, police and incident responders make those decisions from case-specific evidence."
methods:
  - "Official guidance review"
  - "Exposure-based incident triage"
  - "Account and device containment modelling"
  - "Evidence-preservation boundary review"
evidence_basis: "Current official guidance from the Bank of Lithuania, Lithuania's National Cyber Security Centre, Smart-ID, the UK National Cyber Security Centre and relevant HECAVEX investigations."
key_findings:
  - "The first call should usually be to the bank or payment provider through an independently verified channel, because payment blocking and recall become harder with time."
  - "The response must follow the exposed asset: card data, online-banking credentials, reused passwords, an approval factor, an authenticated session, a transfer, and installed software are different incidents."
  - "Changing a password alone does not necessarily terminate stolen sessions, revoke trusted devices, reverse payments, or remove software installed on the device."
  - "Preserve the message, URL and transaction evidence without revisiting the phishing page or delaying containment."
image:
  path: /assets/img/posts/2026-08-31-post-phishing-banking-response/post-phishing-banking-response-hero.svg
  social: /assets/img/social/post-phishing-banking-response-en.png
  alt: "Emergency response paths for exposed cards, bank authentication, sessions, transfers and devices after phishing"
  thumbnail: /assets/img/posts/2026-08-31-post-phishing-banking-response/post-phishing-banking-response-hero.svg
  width: 1600
  height: 900
---

## First actions: contain the account before analysing the page

If banking details have just been entered on a phishing page, speed matters more than proving exactly how the page worked. Stop communicating with the sender. Do not approve another Smart-ID, Mobile-ID, banking-app or one-time-password request, even if the caller claims that approval will cancel the first one.

Use a different, trusted device if possible. Open the bank's official app, type its known address yourself, use the number printed on the card, or obtain the incident number from the bank's official website. Do not call a number supplied by the suspicious message or page.

<aside class="hx-callout warning"><strong>Emergency checklist</strong>1. Call the bank or payment provider through an independently verified channel. 2. Say exactly what was exposed or approved. 3. Ask the bank to block the relevant payment instrument, secure online banking, review active sessions and attempt a payment recall where applicable. 4. Change affected and reused passwords from a clean device. 5. Preserve evidence without reopening the phishing page. 6. Report financial loss or attempted theft to the Lithuanian Police and report the phishing message or site to NKSC.</aside>

The [Bank of Lithuania's victim guidance](https://www.lb.lt/lt/pakliuvau-sukciams-ka-daryti) puts the payment provider first because it may still be able to stop a transfer, block a card or restrict the account. Its separate [payment-recall statement](https://www.lb.lt/lt/naujienos/lietuvos-bankas-finansu-istaigos-turi-aktyviai-ir-greitai-reaguoti-i-klientu-prasymus-atsaukti-mokejimo-operacijas) stresses that quick handling is critical. A report does not guarantee recovery, but delay can close options.

### Tell the bank the event, not only “I was phished”

Prepare a short factual description:

- the time of the message, click, login, approval or transfer
- the bank account, card or service involved
- whether you entered a card number, expiry date and CVV
- whether you entered an online-banking user ID or password
- whether you disclosed or entered Smart-ID PIN1, PIN2, Mobile-ID PINs or an SMS code
- whether you approved an authentication or payment request and what amount/payee the confirmation screen showed
- whether money moved, a beneficiary was added, account details changed, or a new trusted device appeared
- whether an app, browser extension, configuration profile, remote-support tool or file was installed.

That distinction changes the bank's response. “I opened a link” and “I approved a €1,900 transfer with PIN2” are not the same incident.

## Match the action to what was exposed

| What happened | Immediate action | What remains at risk |
| --- | --- | --- |
| Link opened, no data entered and nothing installed | close it, preserve the message, verify the claim through the official channel, watch for follow-up | tracking, later social engineering or an unnoticed download |
| Card number, expiry and CVV entered | ask the issuer to freeze/block and replace the card; review authorisations and wallet enrolments | card-not-present payments, small verification charges, delayed attempts |
| Online-banking ID or password entered | secure online banking through the bank; change the password from a clean device; revoke sessions and trusted devices if available | login attempts, profile changes, beneficiary creation, session reuse |
| A reused password entered | change it first on the affected high-value account, then everywhere it was reused; use unique passwords | credential stuffing against email, shops, social media and work accounts |
| Smart-ID PIN, Mobile-ID PIN, OTP or push approval supplied | contact the bank and identity/authentication provider; review exactly what was approved; block/re-enrol if instructed | a completed login, account change, signature or payment; not merely a leaked code |
| Logged-in session may have been captured | sign out all sessions, revoke remembered devices/tokens and review security events | continued access even after a password change |
| Transfer or card payment completed | ask the provider to stop/recall it immediately; preserve transaction ID, payee, amount and timestamp; report to police | onward transfer, cash-out and recovery fraud |
| App, profile, extension or remote-access tool installed | disconnect the device from networks, stop using it for banking, contact IT/security or a qualified responder | credential capture, persistence, screen control and theft of new passwords |

This is why a generic “change your password” answer is incomplete. Password reset does not automatically replace a card, recall a transfer, invalidate every session or remove persistence from a device.

## Card details: replacement is safer than watching and hoping

Card number, expiry date and CVV are enough for many card-not-present attempts. A criminal may test the card with a small authorisation and return later. Use the bank's app to freeze the card if that function is available, but still contact the issuer and follow its replacement advice. Check whether the card was added to an unfamiliar mobile wallet and whether merchant authorisations are pending.

Do not publish a screenshot containing the full card number. Give the bank the affected card through its authenticated channel. Monitor statements for delayed transactions, but do not treat the absence of an immediate charge as evidence that the data was not collected.

## Online-banking credentials and reused passwords

Change the banking password through the bank's official application or address, preferably from a device that did not load or install anything from the phishing flow. If the service exposes a security page, terminate all sessions, remove unknown trusted devices, review contact details and inspect newly added beneficiaries or scheduled payments.

If the same password protected email, change the email password too. Email is often the recovery path for other accounts. Then replace the password everywhere else it was reused. Start with banking, email, government, work, cloud storage and mobile-provider accounts. Use a password manager to create a unique password for each service.

Changing the password on the phishing page, or through a link subsequently sent by the same “support agent”, does not contain the incident. Return to a channel obtained independently.

## Smart-ID, OTP and MFA approvals: identify the transaction you authorised

An authentication factor is not a universal safety stamp. An adversary-in-the-middle page can relay a real login and ask the victim to complete a real approval. The relevant question is not “did MFA succeed?” but “which operation did that approval authorise?” Our analysis of [why MFA is not a panacea](/en/research/mfa-is-not-a-panacea/) explains how relayed sessions and approvals can defeat simplistic assumptions.

[Smart-ID's scam guidance](https://www.smart-id.com/security/scams/) says never to share PINs and advises contacting the bank and police when accounts or authentication devices may have been accessed. If an unexpected request appears, reject it. Compare the verification code, service name and transaction details on the phone with the action you personally initiated. PIN1 is generally used for authentication and PIN2 for signing, but the displayed transaction context is what matters.

If PINs were entered into a fake page, an unsolicited request was approved, or repeated requests continue, contact both the bank and Smart-ID support and follow their blocking or re-enrolment instructions. Do not “approve once more to cancel”. A second approval is another authorised action.

## Session theft can survive a password reset

Some phishing flows proxy the genuine site and capture the authenticated session after the victim completes MFA. Others persuade the victim to enrol a device or hand over a recovery code. In these cases the attacker may possess a session cookie or trusted-device token rather than the reusable password.

Use the service's “sign out everywhere” or session-revocation function, remove unknown devices, regenerate recovery codes and inspect recent security events. Ask the bank whether it can invalidate online-banking sessions centrally. If email or a mobile account was involved, revoke sessions there as well. The visible phishing page may disappear while the stolen session remains usable.

## Transfers: request a stop or recall immediately

Contact the provider before spending time on screenshots, WHOIS records or a public URL scan. Give the transaction ID, amount, currency, beneficiary, time and the receiving institution if visible. Ask whether the payment is pending, can be stopped, or can be recalled through the receiving institution. Follow the bank's fraud-team instructions and obtain a case/reference number.

Preserve the confirmation screen and statement entry. Do not contact the beneficiary using details supplied by the attacker. Do not pay a “recovery agent” who promises guaranteed retrieval. Victims are frequently targeted again by people claiming to be a bank, police officer, lawyer or blockchain recovery specialist.

## Installed apps, profiles and remote-access tools

If the page told you to install an application, APK, browser extension, configuration profile, certificate, “security update” or remote-support tool, treat the device as potentially compromised. Disconnect it from Wi-Fi and mobile data. Do not use it to change passwords or contact the bank if another device is available.

Record the app/file name, download source, installation time and permissions shown. For a work device, contact the employer's IT or security team immediately rather than attempting cleanup. For a personal device, obtain qualified support or follow the platform vendor's recovery guidance, including removal of unknown device-management profiles and a reset where necessary. A superficial uninstall may not prove that all access was removed.

The [UK NCSC phishing recovery guidance](https://www.ncsc.gov.uk/section/respond-recover/phishing) similarly separates simple clicks from exposed passwords, banking information and installed software, recommending a full antivirus scan after installation and escalation to organisational IT for work devices. Its reporting links are UK-specific; Lithuanian reporting routes are below.

## Preserve useful evidence without revisiting the page

Containment comes first, but a compact evidence package helps the bank, police and incident responders. Keep:

- the complete message and sender as displayed
- receipt time and timezone
- the exact original URL privately, plus a defanged copy for sharing
- screenshots of the message, phishing page and approval screen already captured
- calls and messages from the purported “bank employee”
- transaction IDs, payees, amounts and account alerts
- names and hashes of downloaded files if a responder can collect them safely
- bank, police and NKSC reference numbers.

Do not reopen the link to obtain a better screenshot. Do not submit fake credentials, confront the operator or upload recipient-specific URLs to a public scanner. Tokens in SMS links can identify the recipient. Our [suspicious SMS link guide](/en/research/how-to-check-a-suspicious-sms-link-safely/) explains defanging, short-link disclosure and cloaking boundaries. The [UNIPARK smishing investigation](/en/research/unipark-smishing-campaign-infrastructure/) shows why a polished page, HTTPS and familiar brand story do not authenticate the destination.

## Reporting in Lithuania

Use this order without waiting for one organisation to answer another:

1. **Bank or payment provider:** secure the payment instrument/account and request a stop or recall.
2. **Lithuanian Police:** report financial loss, attempted theft or identity misuse through [ePolicija](https://www.epolicija.lt/) or the emergency channel appropriate to immediate danger.
3. **National Cyber Security Centre (NKSC):** use the [NKSC reporting page](https://www.nksc.lt/pranesti.html) for a suspicious website, fraudulent message/call or cyber incident. NKSC explicitly directs scam victims to the police and provides `cert@nksc.lt` when the correct route is unclear.
4. **Employer or service owner:** report any work account/device involvement and notify the impersonated organisation through a verified abuse or security channel.

The same evidence can support several reports, but each organisation has a different function. The bank protects payments, police investigate crime, NKSC processes cyber reports and the employer protects its environment.

## Monitor after the first call

For at least the following days, review bank activity, card authorisations, account-contact changes, new payees, password-reset messages, Smart-ID or banking-app prompts, unfamiliar devices and mobile-service changes. Turn on transaction and login alerts. Watch email because it can be used to reset other services.

Keep the case numbers and a timeline of actions. If an account was secured and an attacker calls claiming that the incident is still open, end the call and contact the institution independently. Legitimate staff do not need a PIN, OTP or new approval to “return” stolen money.

The most important principle is simple: **respond to the exposed asset, not to the appearance of the phishing page**. Bank first, contain authentication and sessions, isolate an affected device, preserve evidence, and report through official channels.

## Official guidance and further reading

- [Bank of Lithuania: Phishing / data solicitation](https://www.lb.lt/lt/duomenu-viliojimas)
- [Bank of Lithuania: I fell victim to scammers — what should I do?](https://www.lb.lt/lt/pakliuvau-sukciams-ka-daryti)
- [Bank of Lithuania: institutions must react quickly to payment-recall requests](https://www.lb.lt/lt/naujienos/lietuvos-bankas-finansu-istaigos-turi-aktyviai-ir-greitai-reaguoti-i-klientu-prasymus-atsaukti-mokejimo-operacijas)
- [NKSC Lithuania: report a cyber event](https://www.nksc.lt/pranesti.html)
- [Smart-ID: security and scams](https://www.smart-id.com/security/scams/)
- [UK NCSC: phishing response and recovery](https://www.ncsc.gov.uk/section/respond-recover/phishing)
