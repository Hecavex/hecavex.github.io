---
title: "The Centre of Registers Data Theft — Part 2"
description: "Part two of the Centre of Registers data-theft analysis, examining stolen identity, legitimate access, and gaps in behavioural detection."
seo_title: "Centre of Registers Data Theft: Identity and Detection Gaps"
seo_keywords:
  - "Centre of Registers data theft analysis"
  - "stolen identity data"
  - "legitimate account abuse"
  - "behavioural detection"
  - "identity security"
date: 2026-06-02T07:23:26.412Z
lang: en
translation_key: substack-registru-centro-duomenu-vagyste-part
permalink: /en/research/centre-of-registers-data-theft-part-2/
author: deividas-lis
content_type: incident-analysis
confidence: moderate
tlp: clear
categories: ["data-breaches", "identity-security"]
tags: ["Centre of Registers", "data theft", "identity security", "incident analysis"]
featured: false
scope: "Analysis of potential access paths and the impact of a stolen employee digital identity, based on public information."
limitations: "Full technical incident data is not public, so some scenarios are analytical hypotheses rather than confirmed facts."
key_findings:
  - "A stolen identity can make unauthorised activity appear operationally legitimate."
  - "Antivirus controls are insufficient without behavioural and bulk-query monitoring."
  - "Assessment must correlate user, session, device, and data activity."
series_key: centre-of-registers-data-theft
series_part: 2
image:
  path: /assets/img/posts/substack/registru-centro-duomenu-vagyste-part/01.webp
  alt: "The Centre of Registers Data Theft — Part 2"
  thumbnail: /assets/img/posts/substack/registru-centro-duomenu-vagyste-part/01-card.webp
  width: 1280
  height: 719
source_url: https://deivlis.substack.com/p/registru-centro-duomenu-vagyste-part
---
![Centre of Registers incident dashboard combining the building, data, and intrusion indicators.](/assets/img/posts/substack/registru-centro-duomenu-vagyste-part/01.webp)

## **Recap from the first blog**

*In my last blog, I wrote that the Registry Center incident should not be seen as another "data leak". We are talking about more than 600 thousand. potentially copied records of the Register of Real Estate and Legal Entities, which can be useful not only for fraudsters, but also for intelligence context, social engineering and hybrid operations. The main point was a very simple aka modern attack often looks not like a "hacked system" but like a legitimate user doing very illegal things.*

Read [part one for the national-security and intelligence context](/en/research/centre-of-registers-data-theft-national-security/). For the identity layer behind this scenario, [the MFA analysis explains why a stolen session or token can outlive a successful sign-in challenge](/en/research/mfa-is-not-a-panacea/).

---

## **Latest known information for today**

Over the last few days, several very important details have emerged, which I believe make the incident much more serious than it initially seemed (*my bad.. by the way, I'm writing everything on the evening of 26/05/2026 after work, so it's likely that the information will spread in the coming days*).

It has already been publicly confirmed that hundreds of thousands **The data of the registry center was stolen using the accounts of the Migration Department**. The head of the Lithuanian Criminal Police Bureau, Arūnas Maskoliūnas, directly confirmed to journalists that the information about the accounts of the Migration Department is correct. (**<https://www.lrytas.lt/lietuvosdiena/aktualijos/2026/05/26/news/po-skandalo-registru-centre-teisesaugos-zinia-del-migracijos-departamento-42580533>**, **<https://www.15min.lt/naujiena/aktualu/skandalas-registru-centre-nelegaliai-nusiurbti-daugiau-nei-600-tukst-duomenu-55-2689370>**)

At this point.. a very important point emerges that the whole story does not look like much of anything social. in the media (mostly on Facebook, because there are a lot of people who understand IT security, etc.) they screamed that "the Registry Center was hacked", and more often it goes to "someone got legal access and started to act very illegally".

And this is where the most unpleasant part of cyber security begins, because modern attacks often (I would say too often) look very.. normal (when viewed through the prism of RC or MD), such as:

- Signing in to Outlook.
- Opening SharePoint files.
- Formation of register extracts.
- Connections through Microsoft365.
- Common HTTPs traffic..

*(I make the assumption that Outlook, SharePoint, M365...)*

From the SIEM side, it looks like a normal working day, with one small difference... the person using the account is not its legitimate owner.

And that's exactly why... such operations (especially intelligence gathering) become very difficult to detect.

![An analyst assesses possible initial-access hypotheses and their evidence.](/assets/img/posts/substack/registru-centro-duomenu-vagyste-part/02.webp)

Another important detail I would say is that it is already clear that the state institutions knew about the incident much earlier than the public. The environment of the Prime Minister confirmed that the information about the data theft was known at the beginning of April, but was not made public due to the ongoing investigation. *(according to everything, the investigation is still ongoing.. but anyway.. it is better to suspend the director, and not take the blame for this critical incident and silence yourself.. here I will leave this place to the journalists, I do not have enough competence to comment on these events from that side, but I hope*  *and*  *already doing something..)*

Back to atagal.. this means that the investigation has likely been analyzing the chain of compromised accounts, the origin of the logins, the access methods used, the extent of the data collection and the possible wider infrastructure compromise for some time. *(.. how I would like to get a few IOCs to at least analyze the infrastructure, but it is likely that these things will not be seen by the public.. although in reality there is no need to hide them, it will not harm the investigation).*

And this is where a more fun aspect of CTI appears.. When personally monitoring Russian-speaking forums, Telegram channels, dark web marketplaces (let's call them that way) and Discord channels.. there is practically no active promotion or sale of RC data dumps, which is quite unusual.

If this was a classic "financially motivated" data theft, it is very likely, we would already see:

- "database for sale" posts.
- sample dump
- access auctions.
- attempts by initial access brokers to resell access.
- "exclusive access" offers
- and Telegram channels with "Lithuania DB leak" hype.

*(of course I'm not saying that I know and follow all the forums, all Telegram, Discord channels, but I'm silent in the main ones)*

Simple cybercriminals (let's call them that, I won't call them script kiddies or wannabeHackers, it will be easier to understand) love money very much, and love to be talked about loudly (take ShinyHunters.. oh those devils love to be talked about).

APT groups more often choose to quietly collect information, maintain access, operate for a long time, without making noise, use data later (which is already visible from public data.. that everything probably happened from January/February). This is not yet proof that a state pacification operation was already operating here, but I would say it is a very interesting indicator in that direction

![A researcher compares account, device, and network telemetry across several displays.](/assets/img/posts/substack/registru-centro-duomenu-vagyste-part/03.webp)

---

## **Preliminary data leakage scenarios**

According to the information already available (2026-05-26), one of the most realistic scenarios seems to be compromised institutions or third-party accounts (well, this has already been confirmed as a possibility).

This is no longer a Hollywood movie where a hacker sits and says "I'm in", no need for "zero day", no need for "super duper malware" or let alone hacking a satellite... in this case one person is enough.

One **possible scenario** I came up with is the classic one: an employee receives a **phishing** email. I do wonder who runs phishing training in state institutions—or whether anyone does, knowing the Seimas. The message most likely looks like this:

- Microsoft.
- VPN.
- Institution system.
- Team invitation.
- A SharePoint document.
- "security update".

Well, the person is uneducated, clicks on the link -> brings up logins -> maybe approves MFA/2FA (or some other devil) -> transfers data.

Maybe there is such a thing.. I would say for organizations.. and the understanding that having an MFA does not mean that "we are safe"

![Sign-in and user-behaviour data are examined for signs of a stolen identity.](/assets/img/posts/substack/registru-centro-duomenu-vagyste-part/04.webp)

**Another scenario is infostealers.** Here is a slightly more serious problem, because they are one of the most important parts of the ecosystem, let's call it "underground". *(I won't say too much here, but I checked how many possible state institutions have leaked login data, hijacked sessions... that's a lot).*

**About infostealers, in short, they steal:**

- Passwords.
- Browser cookies.
- VPN credentials.
- M365 tokens.
- Active session.
- Authentication artifacts.

Well, then the attacker (or the one who buys) does not get the "hacking" itself, but the entire "digital identity" of the employee, what does that mean?

- Outlook looks legit.
- SharePoint looks legit.
- OneDrive looks legit.
- Teams looks legit.

What the system sees is "login successful". It does not understand who logged in—whether it was Zose from finance or Sasha from Moscow.

Sometimes the worst attack looks like a normal employee—unless Zose is such an exemplary employee that she gets up at 3 a.m. to inspect hundreds of thousands of register statements, or suddenly wants to become the MVP of the quarter.

![Identity and access ecosystem dashboard showing relationships among accounts, sessions, and controls.](/assets/img/posts/substack/registru-centro-duomenu-vagyste-part/05.webp)

Another more interesting scenario is this **session hijacking**.

Here already MFA/2FA and other moose do not help.

If hackers steal:

- session cookies.
- OAuth tokens.
- Active M365 sessions.

In most cases, he can use the system as a legitimate user, i.e. no password, no additional login prompt, no "I'm in" movie moment.

After looking at the M365 environment and getting access to Outlook or SharePoint, you can:

- Read the letters.
- Collect documents.
- Monitor communication.
- Apparently contacts.
- Search for login instructions.
- Search for links to systems.
- And using the trust of the organization against itself.

![Session-hijacking detection dashboard highlights anomalous authenticated activity.](/assets/img/posts/substack/registru-centro-duomenu-vagyste-part/06.webp)

**Next, the "low and slow" scenario is very important.**

If data was pulled:

- In small quantities.
- Gradually.
- During normal business hours.
- Using legitimate accounts.
- From conventional systems.

all activity already looks like normal activity, then the problem becomes not "was there an antivirus?" (I stole this from Facebook comments), and whether the user behavior was monitored, whether anomalies were visible, whether the mass creation of registry extracts was visible, whether Outlook / Sharepoint activations were monitored, whether the system realized that the account started to behave like a "data pump".

![Wide incident timeline correlates user, data, and infrastructure events.](/assets/img/posts/substack/registru-centro-duomenu-vagyste-part/07.webp)

---

## **Preliminary TTPs based on latest information**

| Tactic | Technique | Assessment |
| --- | --- | --- |
| **Initial Access** | T1566 – Phishing | Fake Microsoft or institutional login links are available. |
| **Initial Access** | T1078 – Valid Accounts | Legitimate accounts compromised. |
| **Credential Access** | T1555 – Credentials from Password Stores | Infostealers could steal browser credentials and tokens. |
| **Credential Access** | T1539 – Steal Web Session Cookie | Hijacking of Microsoft 365 sessions is possible. |
| **Defense Evasion** | T1550 – Use Alternate Authentication Material | Use of tokens, cookies and active sessions. |
| **Collection** | T1114 – Email Collection | Collecting Outlook or Exchange mail. |
| **Collection** | T1213 – Data from Information Repositories | Collection of data from SharePoint, registries and other repositories. |
| **Persistence** | T1098 – Account Manipulation | OAuth apps, mail forwarding, additional sessions and delegations. |
{: .hx-table-wide }

![MITRE ATT&CK coverage matrix reveals detection gaps across tactics.](/assets/img/posts/substack/registru-centro-duomenu-vagyste-part/08.webp)

---

## **Interweaving of Russian factions in the TTP**

Well, here comes a more interesting moment.

The scenarios overlap very strongly with what Microsoft, CISA, etc. publicly describe about Russia-linked groups.

To reiterate, Microsoft has publicly described **Void Blizzard / Laundry Bear** actively using stolen logins from infostealer ecosystems and collecting large volumes of email and files from organisations in Europe and North America.

**APT28 / Fancy Bear** campaigns used:

- Spearphishing.
- Password spraying.
- Exchange mailbox permissions.
- EWS / IMAP data collection.
- Use of legitimate accounts.

**Secret Blizzard / Turla** scripts show:

- AITM phishing.
- Session hijacking.
- Token collection.
- Long-term silently supported accesses.

I think the most important thing here is to mention that the coincidence of TTP is not an attribution (without a larger context, infrastructure, all information research... you won't make much attribution, but there are possible scenarios...).

But when:

- We are seeing possible compromised accounts.
- Access through institutional systems.
- Microsoft 365 / Outlook logic.
- Silent behavior in cybercrime forums.
- and no active dump sales.

The APT or intelligence scenario is starting to look a lot more realistic than the classic "let's sell DB quickly" story.

![Identity-attack ecosystem connecting initial access, session, data, and impact.](/assets/img/posts/substack/registru-centro-duomenu-vagyste-part/09.webp)
