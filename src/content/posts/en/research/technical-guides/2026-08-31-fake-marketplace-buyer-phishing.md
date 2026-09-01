---
title: "Fake Marketplace Buyer Phishing: How the Payment-Link Scam Works"
card_title: "How Fake Marketplace Buyer Phishing Works"
description: "A practical guide to fake buyers, external courier and payment links, card and banking risks, Smart-ID approvals, evidence preservation and urgent response."
seo_title: "Fake Marketplace Buyer Phishing and Payment-Link Scams"
seo_description: "Learn how fake Vinted and Facebook Marketplace buyers use courier or payment links, what not to approve, what evidence to save and how to respond quickly."
seo_keywords:
  - "fake marketplace buyer phishing"
  - "Facebook Marketplace payment link scam"
  - "Vinted buyer phishing"
  - "fake courier payment page"
  - "Smart-ID marketplace scam"
  - "marketplace seller scam"
date: 2026-08-31 18:30:00 +0300
lang: en
translation_key: marketplace-buyer-phishing
permalink: /en/research/fake-marketplace-buyer-phishing/
author: deividas-lis
content_type: technical-guide
publication_class: technical-assessment
confidence: high
tlp: clear
categories: [fraud-scams, social-engineering, tradecraft]
tags: [phishing, social engineering, payment fraud, incident response, Lithuania, smishing]
featured: false
draft: false
published: true
toc: true
comments: false
prose_width: wide
scope: "A seller-focused defensive guide to marketplace phishing that moves a conversation to an external courier, payment or authentication page, including prevention, evidence preservation and incident response in Lithuania."
limitations: "Marketplace features and reporting interfaces can change. A suspicious message, external link or new account is not by itself proof of fraud. The guide assesses the transaction path and requested action rather than attributing an operator."
methods:
  - "Official marketplace and authentication-provider guidance review"
  - "Lithuanian police report review"
  - "Phishing transaction-flow modelling"
  - "Incident-response and evidence-preservation analysis"
evidence_basis: "A 26 August 2026 Panevėžys police report summarised in Signal Brief 005, official Meta and Vinted safety guidance, Smart-ID security guidance, Bank of Lithuania victim guidance and NKSC reporting routes."
key_findings:
  - "The decisive boundary is the handoff from a familiar marketplace conversation to a buyer-supplied external payment, courier or support page."
  - "A seller does not need to enter card, online-banking or Smart-ID data into a buyer's link to receive money through the platform's normal transaction flow."
  - "Smart-ID, Mobile-ID or OTP approval is an action, not a generic identity check. The text, amount and recipient must match an action the user initiated independently."
  - "After data entry or approval, contacting the bank through an official channel takes priority over further link analysis, while chat, URL and transaction evidence should be preserved."
image:
  path: /assets/img/posts/2026-08-31-marketplace-buyer-phishing/marketplace-buyer-phishing-hero.svg
  social: /assets/img/social/marketplace-buyer-phishing-en.png
  thumbnail: /assets/img/posts/2026-08-31-marketplace-buyer-phishing/marketplace-buyer-phishing-hero.svg
  alt: "A fake marketplace buyer moves a seller from a trusted chat to an external payment page, followed by a bank and incident-response path"
  width: 1600
  height: 900
---

## The 30-second rule for sellers

A buyer says the item is perfect, does not negotiate and has already arranged delivery. You only need to open a courier link, "accept the payment" and confirm your card or bank. The page looks familiar. A timer is running. The buyer is waiting.

Stop at the handoff.

<aside class="hx-callout warning"><strong>Do not use a buyer-supplied link to receive money.</strong>Open the marketplace through the installed app or an address you type yourself. Check whether the sale, payment and shipping instruction exist there. Do not enter card, online-banking or Smart-ID information into an external page. If you already entered data or approved a request, stop talking to the buyer and contact your bank immediately using its official number.</aside>

Marketplace buyer phishing succeeds because the beginning looks normal. A real item is listed. A real seller expects messages. The alleged buyer then moves one important step—payment, delivery, account verification or support—outside the platform's trusted flow.

The [HECAVEX Signal Brief 005](/en/briefings/2026-08-30/) recorded a Lithuanian police report with that broad sequence: a person advertised an item on Facebook, a supposed buyer contacted the seller, the seller followed a possibly fake webpage and entered bank details, and a EUR 1,490 loss was later reported. The police summary does not name the URL, phishing kit or authentication flow. This guide does not add those missing facts. It explains the recurring defensive pattern.

## The fake-buyer flow

The wording and platform change, but the transaction often follows the same structure:

1. **A genuine listing creates context.** The seller is expecting a buyer and a delivery decision.
2. **A buyer responds quickly.** The person may avoid meaningful questions, accept the price immediately or claim to have paid already.
3. **The conversation introduces an external process.** A courier, payment service, bank or marketplace "support" page supposedly needs the seller's action.
4. **A link or QR code carries the seller away from the platform.** It can arrive in chat, SMS, email or an image.
5. **The external page requests something the real sale should not require.** Examples include card details, online-banking credentials, an account password, a one-time code or an authentication approval.
6. **Pressure prevents independent checking.** The payment will expire, the courier is waiting, the order will be cancelled or the account will be blocked.
7. **The conversation continues after capture.** The buyer may claim the first attempt failed and ask for another card, another approval or a "refund" step.

Each step can look plausible alone. The risk becomes clear when the whole chain is viewed as one system: **marketplace trust is used to authenticate a page the marketplace does not control**.

![Fake marketplace buyer handoff from trusted platform chat to an external payment or identity capture page](/assets/img/posts/2026-08-31-marketplace-buyer-phishing/marketplace-handoff-chain-en.svg)

*Figure: The decisive boundary crossing occurs when the buyer moves payment or delivery outside the marketplace.*

## Model the transaction, not the buyer's story

An investigator should separate five objects that the conversation tries to merge:

| Object | Authoritative source | Defensive question |
|---|---|---|
| listing and buyer contact | marketplace application | does this profile and conversation exist in the platform record? |
| order | marketplace order state | is there an order ID, item, buyer and status visible without the supplied link? |
| delivery | marketplace or courier reached independently | did the platform create this shipment and label? |
| payment or payout | marketplace ledger and bank ledger | is money pending, received, reversed or absent? |
| authentication | bank, email or marketplace identity telemetry | what login, payment or account change was actually approved? |

The buyer controls the conversation. The marketplace controls its order state. The bank controls its account and payment state. A courier controls its shipment record. Validation must query the authoritative source directly, not a screenshot or website selected by the buyer.

A common phishing page collapses the objects into one visual sequence. It claims that the marketplace order exists, the courier is waiting, the payment is funded and the bank needs authentication. The page can imitate all four systems while controlling none of their ledgers.

## Why sellers are asked to "verify" a payment

Receiving money normally does not require disclosing the security controls used to spend money. A legitimate marketplace may require account setup, identity verification or payout details inside its own application. That is not the same as a stranger sending a page that requests:

- full card number, expiry and CVV
- online-banking user ID or password
- PIN codes or an OTP
- Smart-ID or Mobile-ID confirmation
- a small "activation", "insurance" or "courier" payment
- email credentials to release the order
- a remote-support application.

Vinted's official [phishing guidance](https://www.vinted.com/help/15/628-fraudulent-messages-and-phishing-attempts-recognise) says users do not need to leave Vinted to confirm a payment or receive an order and recommends keeping checkout, shipping and conversation inside the platform. It also warns about links, QR attachments, requests for personal data and messages that pressure the recipient to act quickly.

Meta similarly collects Marketplace scam awareness, seller verification and reporting under its [shopping-safety guidance](https://www.facebook.com/help/123884166448529/). Platform-specific features differ by country and can change. The stable rule is simpler: start from the official app, inspect the order there and do not accept a replacement workflow invented by the other party.

## The external courier page is a security boundary

A courier name makes the request feel operational: a label must be printed, the buyer selected a delivery method, or the seller must receive a parcel payment. But the logo and design do not establish who controls the hostname.

Before acting, ask three questions without opening the supplied link:

1. Does the transaction appear in the marketplace's official app?
2. Does the platform itself instruct the seller to use this delivery method?
3. Can the same instruction be reached by navigating from the courier's or marketplace's independently verified website?

If the answer is no, the buyer's urgency does not create legitimacy. A courier does not need your online-banking password. A buyer does not need your card CVV to pay you. A support agent does not need an authentication code sent to your device.

If a link was delivered by SMS, use the [suspicious-SMS safety guide](/en/research/how-to-check-a-suspicious-sms-link-safely/) to preserve and defang it. Do not paste a recipient-specific path into a public scanner or social post: the URL can contain an email address, telephone number, listing ID or one-time token.

## Card, banking and Smart-ID risks are different

The response depends on what was disclosed or approved.

### Card data

The card number, expiry and CVV can support unauthorised card-not-present payments. A small charge can be a real theft, a validation attempt or a step before larger transactions. If these fields were entered, call the issuing bank immediately and ask it to block or replace the card and review recent activity. Deleting the chat does not invalidate captured card data.

### Online-banking credentials

A username, personal code or password can expose the bank login flow. Even if an attacker still needs another factor, the credential should be treated as compromised. Contact the bank, follow its containment instructions and change any reused password from a trusted device. Do not use the phishing page's "cancel" or "refund" button.

### Marketplace or email password

An email account can be the recovery path for the marketplace, bank notifications and other services. Change the affected password through the official service, terminate other sessions, review recovery methods and check for forwarding rules or changed contact details. Change every reused copy of that password.

### Smart-ID, Mobile-ID and one-time codes

An authentication prompt is not a harmless check that proves you are human. It authorises a login, signature or transaction. Smart-ID's official [security guidance](https://www.smart-id.com/security/scams/) says not to approve requests the user did not initiate and to check the action being confirmed. Never enter PIN codes into a website or disclose them in chat or by phone.

Read the approval screen: service, action, amount, recipient and control code. If it does not match an action you independently started in the official app, reject it. If you already approved, call the bank immediately and state the exact text, time and amount shown. Changing a password alone may not reverse an authorised payment or an already issued session.

## Warning signs in the conversation

No single writing mistake proves fraud, and polished Lithuanian does not prove legitimacy. Look for control of the process:

- the buyer accepts an unusually high price without relevant questions
- the buyer insists on a courier or payment method outside the listing
- the conversation is moved to SMS, email, WhatsApp or another service
- an external link or QR code is required to "receive" money
- the page asks the seller to pay a fee, unlock funds or confirm a refund
- the buyer asks for an email address, telephone number or bank details already handled by the platform
- urgency replaces an independently visible order status
- "support" appears only through the buyer's link
- each failed attempt produces another request for data or approval.

An old profile, profile photo, rating or friendly conversation can reduce suspicion but cannot validate an external hostname. Accounts can be newly created, copied, bought or compromised. Evaluate the requested action, not the confidence of the story.

## Keep the transaction inside the official path

For a seller, the safest workflow is deliberately boring:

1. Open the marketplace from the installed application or a trusted bookmark.
2. Confirm that the buyer, order, payment and shipping step exist in that application.
3. Use only the checkout and shipping flow presented there.
4. Read every platform warning before leaving for another site.
5. Never let the buyer choose the bank-support or account-recovery channel.
6. If uncertain, stop the transaction and contact platform support from inside the application.

A genuine buyer can wait while the seller verifies a payment. A genuine order remains visible without the buyer's link. Losing a sale is cheaper than giving a stranger control over the authentication path.

## Build an event ledger before blocking the account

Do not keep engaging to collect more evidence. Preserve what already exists, then report and block.

Preserve the sequence as an event ledger. Do not replace timestamps with a narrative written later.

| Event | Minimum fields | Likely source |
|---|---|---|
| listing created | listing ID, item, price, account, UTC time | marketplace record |
| buyer contact | profile ID or URL, message ID, complete message, UTC time | chat export or sequential screenshots |
| handoff delivered | exact URL or QR image, sending channel, message ID, UTC time | chat, SMS or email |
| page reached | original URL hash, final URL, browser-history time, screenshot, downloads | browser and device telemetry |
| data entered | classes of fields entered, not the secret values, UTC time | victim statement and authorised browser telemetry |
| authentication prompt | service, action, control code, amount, recipient, UTC time | Smart-ID, Mobile-ID or bank app record |
| payment event | transaction ID, status, amount, beneficiary, account, UTC time | bank ledger and alert |
| containment | card block, session revoke, password change, report ID, UTC time | bank, platform and incident record |

Useful supporting evidence includes:

- complete chat export or sequential screenshots, not one cropped message
- profile name, profile URL or member ID and listing URL
- exact message times and the platform used
- the original URL or QR image kept privately
- a defanged, redacted URL copy for ordinary sharing
- email sender, SMS sender and message headers where available
- screenshots of the external page without entering more data
- bank alerts, transaction time, amount, beneficiary and payment reference
- exact Smart-ID, Mobile-ID or OTP prompt text and time
- what was entered, downloaded or approved
- reports submitted to the platform, bank, NKSC and police.

Do not publish the victim's email, phone number, order token, card digits or transaction identifiers. A clean evidence package separates private incident material from a sanitised indicator that can be shared with a security team.

Hash exported chat, screenshots and browser-history files when they enter the case record. Preserve originals read-only. Record who collected each item and when. A screenshot of a chat is useful, but an export with stable IDs and timestamps is better when the platform provides one. If no export is available, use sequential captures that include visible account context and time.

For an organisation-managed device, correlate secure web gateway, DNS, endpoint, browser and identity records by user and UTC time. The redirect host can appear in web telemetry, the authentication can appear in identity logs and the payment can appear only in the bank ledger. No single system contains the entire chain.

![Marketplace phishing evidence ledger joining conversation, web path and financial records by identifiers and time](/assets/img/posts/2026-08-31-marketplace-buyer-phishing/marketplace-evidence-ledger-en.svg)

*Figure: One ledger aligns records from systems with different identifiers and clocks without pretending one source contains the whole event.*

## Emergency response after data entry or approval

The [Bank of Lithuania's victim guidance](https://www.lb.lt/en/sfi-information-for-users) puts two actions first: stop communicating with the scammers and contact the payment service provider immediately. A bank may still be able to stop some payments, and exposed card data requires rapid blocking.

| What happened | First actions |
|---|---|
| link opened, nothing entered or installed | close it, preserve time and hostname, check downloads and permissions, report the link |
| card data entered | call the issuing bank, block or replace the card, review transactions and alerts |
| banking credentials entered | call the bank, follow account-containment instructions, change reused passwords from a trusted device |
| Smart-ID, Mobile-ID, OTP or transaction approved | call the bank immediately, state exactly what was approved and when, ask about stopping the transaction and securing access |
| marketplace or email password entered | change it through the official service, revoke sessions, inspect recovery settings and secure reused accounts |
| file, profile or remote-support app installed | stop using the device for banking, disconnect it if safe and contact workplace IT or qualified incident response from another trusted device |
| money transferred or removed | contact the bank first, then report the crime to police with preserved transaction evidence |

Do not be ashamed of having clicked. Accurate timing is more valuable than a cleaner story. Tell the bank or security team exactly what happened, including approvals that seemed unsuccessful.

![Marketplace phishing response branches for a click, exposed card, authentication, payment or affected device](/assets/img/posts/2026-08-31-marketplace-buyer-phishing/marketplace-response-branches-en.svg)

*Figure: The first response follows the exposed asset and starts before further page investigation.*

## Reporting in Lithuania

Report each layer to the party that can act on it:

1. **Marketplace:** report the profile, message, listing and external link through the application's reporting flow. Vinted's guidance asks for screenshots, member details, sender information and bank-transfer details where relevant.
2. **Bank or payment provider:** use the telephone number in the official app, on the card or on a website you reached independently.
3. **NKSC:** use the [central reporting page](https://www.nksc.lt/pranesti.html) for a fraudulent website, suspicious message or cyber incident. Supply the exact URL to the intended private form, not a public comment.
4. **Police:** if money or data were stolen, report through [ePolicija](https://www.epolicija.lt/) and preserve the event number and attachments.
5. **Impersonated courier or brand:** use its official abuse or support channel, not contact details on the suspicious page.

[HECAVEX Radar](https://radar.hecavex.com/) can show sampled Lithuanian brand-impersonation candidates, but it is not a victim-reporting service and does not issue automatic verdicts. Absence from Radar is not proof that a page is safe.

## False-positive controls and practical validation

A cautious buyer, an external courier and a request to use a platform feature can all be legitimate. Do not label a person fraudulent solely because the account is new, the language is awkward or the transaction is urgent.

Validate the workflow through independent state:

1. open the marketplace application without the supplied link and locate the order ID
2. confirm payment status in the marketplace ledger and, where relevant, the bank ledger
3. reach the courier through its official application or manually entered domain and look up the shipment
4. compare the requested action with the platform's published process
5. verify whether any authentication prompt corresponds to an action the seller independently initiated.

Treat the case as high risk when the buyer-supplied path is the only place where the order, delivery or payment exists, especially when that path requests secrets or authorisation. Treat it as a confirmed phishing incident when preserved content impersonates a service and requests credentials, card data or an unrelated approval. Treat financial impact as confirmed only from bank or payment-provider records.

A legitimate external service does not automatically make the buyer legitimate. An open redirect, compromised site or abused form can place a recognised domain inside the chain. Conversely, a newly registered domain is supporting context, not proof. The requested transaction and authoritative ledgers carry more weight than domain age or visual quality.

## What one report cannot establish

A conversation and phishing page can establish the reported route and requested action. They do not automatically establish a wider campaign, the operator's country, the owner of an account, compromise of the marketplace or courier, or the total number of victims. Shared hosting, a common page template or the same payment logo is not enough for attribution.

Use precise language: "a supposed buyer sent", "the seller reported", "the page requested", "the bank alert recorded" and "not established". Preserve the distinction between the marketplace account, redirect service, final page, payment beneficiary and person controlling them. They may be related, but evidence must demonstrate each relationship.

## Seller checklist

- [ ] The order and payment are visible in the official marketplace app.
- [ ] Delivery instructions came from the platform, not only from the buyer.
- [ ] No external page received card, banking, email or marketplace credentials.
- [ ] No authentication request was approved unless independently initiated and fully understood.
- [ ] Buyer-supplied links and QR codes were not used to receive money.
- [ ] Suspicious chat, profile, URL and time were preserved before blocking.
- [ ] Exposed financial data or approvals were reported to the bank immediately.
- [ ] The marketplace and NKSC received the relevant phishing evidence.
- [ ] Financial loss was reported to police.
- [ ] Public sharing contains only defanged indicators without victim tokens or personal data.

## Sources and further reading

1. [Panevėžys Police: event summary for 26 August 2026](https://panevezys.policija.lrv.lt/lt/ivykiu-suvestines/2026-08-26-suvestine-4zp7/)
2. [Vinted Help Centre: recognise and report phishing](https://www.vinted.com/help/15/628-fraudulent-messages-and-phishing-attempts-recognise)
3. [Meta Help Center: tips for shopping safely](https://www.facebook.com/help/123884166448529/)
4. [Smart-ID: scams and security guidance](https://www.smart-id.com/security/scams/)
5. [Bank of Lithuania: information for people affected by scams](https://www.lb.lt/en/sfi-information-for-users)
6. [NKSC: report a fraudulent website, message or cyber incident](https://www.nksc.lt/pranesti.html)
7. [HECAVEX Signal Brief 005](/en/briefings/2026-08-30/)
8. [HECAVEX: how to check a suspicious SMS link safely](/en/research/how-to-check-a-suspicious-sms-link-safely/)

_This guide is defensive and intended for prevention, evidence preservation and incident response. It does not determine that a specific account or link is fraudulent without case evidence._
