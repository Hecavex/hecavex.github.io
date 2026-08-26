---
title: "The Centre of Registers Data Theft: When “It’s Just Data” Suddenly Becomes a National Security Issue"
description: "Why large-scale theft from Lithuania's Centre of Registers is not merely a privacy incident but a potential intelligence and national-security issue."
seo_title: "Lithuania Centre of Registers Data Theft and National Security"
seo_keywords:
  - "Lithuania Centre of Registers data theft"
  - "national security data breach"
  - "stolen government data"
  - "identity data exposure"
  - "intelligence risk"
date: 2026-06-02T07:12:36.587Z
lang: en
translation_key: substack-registru-centro-duomenu-vagyste-kai
permalink: /en/research/centre-of-registers-data-theft-national-security/
author: deividas-lis
content_type: incident-analysis
confidence: moderate
tlp: clear
categories: ["data-breaches", "threat-intelligence"]
tags: ["Centre of Registers", "data theft", "national security", "CTI"]
featured: false
scope: "Analysis of publicly reported facts and the potential threat uses of stolen registry data."
limitations: "A complete timeline, technical indicators, and confirmed evidence of downstream data use are not publicly available."
key_findings:
  - "Registry data can support target selection, impersonation, and social engineering."
  - "Impact depends not only on record count but on how readily datasets can be linked."
  - "National-security assessment must distinguish confirmed facts from plausible use scenarios."
series_key: centre-of-registers-data-theft
series_part: 1
image:
  path: /assets/img/posts/substack/registru-centro-duomenu-vagyste-kai/01.webp
  alt: "The Centre of Registers Data Theft: When “It’s Just Data” Suddenly Becomes a National Security Issue"
  thumbnail: /assets/img/posts/substack/registru-centro-duomenu-vagyste-kai/01-card.webp
  width: 1280
  height: 719
source_url: https://deivlis.substack.com/p/registru-centro-duomenu-vagyste-kai
---
![Scale of the Center of Registers data theft and its possible path to national-security impact.](/assets/img/posts/substack/registru-centro-duomenu-vagyste-kai/01.webp)

*In other words, I wrote something a long time ago, I caught a whiff, I need to write something about such an interesting topic.. here we go, good reading, I looked at it through the prism of CTI (Cyber ​​Threat Intelligence), because well.. the same things keep sounding everywhere, but no attributions and other things.*

A pre-trial investigation has been launched in Lithuania regarding possible illegal access to the systems of the Registry Center. It is publicly announced that more than 600 thousand may have been illegally copied. register entries. The Real Estate Register and the Legal Entities Register became the main targets. The initial damage is estimated at no less than 111 thousand. euros. (**<https://www.lrt.lt/naujienos/verslas/4/2936321/duomenu-vagyste-is-registru-centro-nusiurbta-daugiau-nei-600-tukst-duomenu-irasu>**)

***In other words... it wasn't the recipes for the zeppelins that were leaked.***

We're talking about data that can help uncover people's assets, corporate structures, connections, addresses, properties and businesses. Such data becomes very very.. useful for phishing, social engineering, target profiling and intelligence.

There is no publicly confirmed attribution yet. Therefore, it would be premature to say "the Russians did it". But to say that such a version is unrealistic would be... not very good either.

Especially when the research data suggests that some of the illegal logins and login attempts were carried out from a foreign country and through systems administered by other institutions. It has also been publicly stated that the user login data of one Real Estate Register data recipient could have been used (same source as above).

## **Let's look at the wider context (like real CTIs).**

European institutions, NATO member organizations, the public sector, logistics, defense, transport and diplomatic structures have been consistent targets of Russia-linked APT groups for some time. CERT-EU 2025 threat review indicates that 174 TAs were observed, with cyber espionage and prepositioning accounting for 38% of observed activity. In the analysis of partner organizations, public administration accounted for 60% of the observed activity (**<https://cert.europa.eu/publications/threat-intelligence/tlr2025/>**).

This does not mean that the Registry Center incident was committed by a specific APT group.

This means that data from state registers is the type of information that is of interest to more than just fraudsters. It may be interested in both reconnaissance and hybrid operations.

## **And now about reality..**

**Russian GRU Unit 26165**, commonly known as **APT28 / Fancy Bear / Forest Blizzard**, described in a joint CISA, NSA, FBI alert as having conducted an espionage campaign against Western logistics and technology organizations involved in the coordination, transportation and delivery of aid to Ukraine. Methods such as password spraying, spearphishing, Outlook NTLM and Roundcube vulnerabilities, changing Microsoft Exchange mailbox rights, EWS / IMAP data collection and use of IP cameras in Ukraine and bordering NATO countries (**<https://www.cisa.gov/news-events/cybersecurity-advisories/aa25-141a>**).

![Fancy Bear threat-group profile with a map of activity and targets.](/assets/img/posts/substack/registru-centro-duomenu-vagyste-kai/02.webp)

Microsoft also described the Russian-linked **Void Blizzard / Laundry Bear**, which targets NATO countries, Ukraine, state institutions, law enforcement, defense, transport, media, NGOs and the health sector. The most interesting thing is that "super hacks" or some 0day or CVSS 8-10 vulnerabilities are often used, but stolen login data, password sparing and access to Exchange, SharePoint, Microsoft Graph or other clouds (**<https://www.microsoft.com/en-us/security/blog/2025/05/27/new-russia-affiliated-actor-void-blizzard-targets-critical-sectors-for-espionage/>**).

![Void Blizzard threat-group profile showing cloud-access and intelligence links.](/assets/img/posts/substack/registru-centro-duomenu-vagyste-kai/03.webp)

**Secret Blizzard / Turla** case, Microsoft described a campaign against embassies in Moscow that used AiTM (adversary-in-the-middle) at the ISP level and ApolloShadow malware. It can be said that not only phishing emails are used against diplomatic or state targets, but also much more complex infrastructure control (**<https://www.microsoft.com/en-us/security/blog/2025/07/31/frozen-in-transit-secret-blizzards-aitm-campaign-against-diplomats/>**)

![Secret Blizzard threat-group profile showing targets and regions of activity.](/assets/img/posts/substack/registru-centro-duomenu-vagyste-kai/04.webp)

.***In other words, APT doesn't necessarily start with a hacked NASA satellite.***

Sometimes it starts with a stolen password. Sometimes from a phishing email. Sometimes from unattended access. Sometimes from a system that everyone knew needed to be fixed, but somehow it was always "next quarter" and oops that 7.8 CVSS or CVSS 10 announced two days ago will wait.

## **How it can be put together via the Diamond Model (the fun part in CTI)**

The Diamond Model of Intrusion Analysis evaluates the incident through four angles, i.e. **adversary**, **capability**, **infrastructure** and **victim**. In other words.. who could operate, by what methods, through what infrastructure and against what target.

In this case, the publicly known image would look like this for now:

**Victim** - Registers managed by the Register Center, especially the data of Real Estate and Legal Entities registers. This is not a simple database. It is the infrastructure of the state, where property, legal relations, companies and economic relations are visible.

**Capability (methods/opportunities)** - So far, there is public talk about possible illegal login, use of user login data and mass creation of registry extracts. This is very consistent with what we often see in real campaigns. Sometimes access, legitimate features and too little control are enough.

**Infrastructure** - It has been publicly stated that some of the actions could have been carried out from a foreign country and through systems administered by other institutions, attacks often do not use "direct" infrastructure, but intermediate jumps, compromised systems, legitimate accounts or third-party access.

**Adversary (character)** - You need to be careful here (CTI relies only on large data if anything..). There is no public attribution (pakolka). However, due to the nature of the target, the geopolitical context, and similar APT TTPs, the version of Russian or Russian-speaking cyber gangs is a realistic line of investigation (likely). But attribution is not "it seems to me". Attribution is logs, infrastructure, TTP, access roads, forensic analysis and intelligence context.

Anyway, everyone can be an intelligence analyst on Linkedin, but only until the first hearing "where's the evidence"?

![Diamond Model linking the adversary, infrastructure, capabilities, and victim.](/assets/img/posts/substack/registru-centro-duomenu-vagyste-kai/05.webp)

## **If we look through Cyber ​​Kill Chain**

The Lockheed Martin Cyber ​​Kill Chain model helps to assess an incident as a sequence, i.e. from reconnaissance, weaponization, delivery, exploitation, installation, command & control and actions on objectives. It's not a perfect model for every incident, but it does a good job of asking the right questions (**<https://www.lockheedmartin.com/en-us/capabilities/cyber/cyber-kill-chain.html>**).. and this is where the head of my former Commissioner Inspector comes into play, when I had to conduct investigations with crimes in the electronic space and especially with databases (I hope someone from the investigators will read and use the questions).

**Reconnaissance** - Were stolen credentials used? Was there password spraying? Was it phishing? Was it done through third-party access? Have systems from other institutions been used as an intermediate route?

**Exploitation -** Did TAs use only legitimate functions with unauthorized access, or was there a technical vulnerability? This is a very important distinction. Because one is "hacked the system", the other is when it says "logged in as a legitimate user, only that user shouldn't have been him".

**Persistence -** Has access been attempted? Were new users created, passwords, rights, API access, sessions or authentication mechanisms changed?

**Command & Control -** Was there a technical control infrastructure? Did the activity follow normal protocols and legitimate systems to appear like normal use?

**Actions on Objectives -** The ultimate goal seems to have been to read/copy data. And here the most important question should be whether it was a one-time data "sucking" or a longer, slower, more difficult to notice activity?

***Because the worst case scenario is often not someone breaking in very loudly.***

***The worst-case scenario is when someone quietly uses access for a long time and the organisation finds out only when the question is no longer "did it happen?" but "how much was taken?"***

![Cyber ​​Kill Chain stages from reconnaissance through actions on objectives.](/assets/img/posts/substack/registru-centro-duomenu-vagyste-kai/06.webp)

## **What is worth doing now?**

Elementary things..

**For residents:** check information against official sources; do not click suspicious links; do not disclose login details by phone or email; slow down when a request is "very urgent"; use MFA; and monitor bank accounts and potential new liabilities. I still remember the CityBee leak and people entering their details—come on.

**For companies:** prepare for more convincing social-engineering attacks, especially against accounting, administration, management, legal, HR, suppliers and customer service.

**For authorities:** look beyond one incident and examine the entire access chain. I do not think this should need explaining, but here we are.

Who has access? Why do you have access? When was it last viewed? Are logins tracked? Does the bulk data scan raise an alert to the SOC and it wakes up at 2am on a Saturday? Does Third-party have MFA? Is it possible to detect that a legitimate account suddenly starts pumping data, and what kind of alerts should there be for the SOC to wake up at 2 a.m. to check?

Basic access mono-tiering, audits, third-party controls, incident management/detection... and everyone's very fun question "Who actually has access to our systems?".

Because I feel... there will be such companies where "We installed the alarm system only after the theft" (well, this doesn't help...)
