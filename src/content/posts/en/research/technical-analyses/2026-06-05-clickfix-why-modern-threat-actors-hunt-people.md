---
title: "ClickFix Attacks Explained: Fake CAPTCHA, PowerShell and Detection"
card_title: "ClickFix: Fake CAPTCHA to PowerShell"
description: "How ClickFix attacks use fake CAPTCHA prompts and copied commands to make victims launch PowerShell, with practical SOC detection and response signals."
seo_title: "ClickFix Attacks: Fake CAPTCHA, PowerShell and Detection"
seo_keywords:
  - "ClickFix social engineering attack"
  - "fake CAPTCHA malware"
  - "PowerShell execution"
  - "clipboard command execution"
  - "ClickFix detection"
date: 2026-06-05T20:56:58.749Z
lang: en
translation_key: substack-clickfix-kodel-siuolaikiniai-ta-nebeiesko
permalink: /en/research/clickfix-why-modern-threat-actors-hunt-people/
author: deividas-lis
content_type: technical-analysis
confidence: moderate
tlp: clear
categories: ["malware", "social-engineering"]
tags: ["ClickFix", "initial access", "PowerShell", "social engineering"]
featured: true
scope: "Analysis of ClickFix execution chains, infrastructure, detection opportunities, and organisational risk."
limitations: "Campaign tooling and commands evolve; the examples are not an exhaustive catalogue of ClickFix variants."
key_findings:
  - "Success depends on a convincing instruction rather than a software vulnerability."
  - "Browser-to-shell behaviour provides stronger detection signals than isolated domains."
  - "ClickFix is an execution-control and attack-surface problem, not merely an awareness issue."
image:
  path: /assets/img/posts/substack/clickfix-kodel-siuolaikiniai-ta-nebeiesko/01.webp
  alt: "ClickFix: Why Modern Threat Actors No Longer Look for Vulnerabilities—they Look for People"
  thumbnail: /assets/img/posts/substack/clickfix-kodel-siuolaikiniai-ta-nebeiesko/01-card.webp
  width: 1600
  height: 900
source_url: https://deivlis.substack.com/p/clickfix-kodel-siuolaikiniai-ta-nebeiesko
---
*During almost a decade working across cybercrime intelligence and cyber threat intelligence *(the same family, but definitely not the same job)* I have seen many different stages of threats such as:*

```
- Exploit kit'ai
- Office macros
- "Open file with invoice"
- Ransomware "industrializacija"
- Economics of MFA fatigue, session hijacking, infostealer logs and Initial Access Brokers
```

*oh… now we have ClickFix.*

*At first glance, ClickFix itself looks very simple (well, it certainly looks funny to many IT people). A fake error, CAPTCHA or verification window is shown to an ordinary user (well, everyone who actually uses a computer and the Internet.. if he doesn't go there), he convinces the user to copy the command, open Windows Run, PowerShell, Windows Terminal or a program that can do execution, paste the command... and off we go with Enter.*

*Everything is real. No zero-days. No exploit chain. No complex privilege escalation. Just a person, a browser, a clipboard and… a bad decision.*

*And that's why this technique deserves a serious CTI analysis.*

*ClickFix is ​​interesting to me personally, not because it is a magically technically super duper complex attack (...where you sit for a week and still don't understand where you end up), but on the contrary, because it shows very clearly where modern TAs are moving. Well, let's not call it some kind of technical complexity, but move towards cost-effective attacks.*

*In other words, TAs realized that it is cheaper not to bypass the system, but to ask a person to compromise it himself. And... in most cases, a person agrees, and sometimes even very neatly, according to the instructions given.*

![ClickFix overview showing how a user action becomes the code-execution layer.](/assets/img/posts/substack/clickfix-kodel-siuolaikiniai-ta-nebeiesko/01.webp)

---

## Why is ClickFix not talked about enough in Lithuania?

Here is my personal opinion.

In the Lithuanian cyber space, there is still a lot of talk about classic phishing, passwords, MFA, "don't click on links", "don't open attachments", "turn on 2FA" *(okay, I agree and I speak sometimes myself...)*.

In reality, all of these things are important.

But.. when looking at comments or discussions *(eye directly on the Registry Center incident)..* the discussion comments look like we are still trying to win the 2018 war with TAs in 2026.

When dealing with CTI *(well, at least those who do CTI outside of Lithuania)* ClickFix has not been such a niche thing for a long time. Microsoft, Proofpoint, ESET, Rapid7 and other researchers have described different use cases for ClickFix between 2024 and 2026, from TA571 and ClearFake to Booking.com impersonation campaigns, WordPress compromises, infostealer delivery and large-scale TDS-driven operations. (Proofpoint, 2024; Microsoft, 2025; ESET, 2025; Rapid7, 2026)

And what is happening in Lithuania?

I still see little in-depth discussion about this in the public space *(or time to start attending InfoSec meets..).*

Yes, general warnings sometimes appear. Yes, someone shares a "don't run commands from the internet" type post. But ClickFix is ​​rarely discussed as a broader phenomenon.. as a change in the cybercrime economy, as a human execution model, as an entry point to the infostealer ecosystem, as a CISO-level risk signal.

And right here *(in my opinion)* lies the problem.

ClickFix is ​​not just "another phishing technique". Here is already a signal that TAs are moving towards a model where a person becomes an active part of the compromising process *(well, here are the unintentional insider threats).* Not the victim who clicks on the phishing link, but the person who launched the command himself.

Very modern, almost like a self-service incident response, only in this case the incident is created by the person himself.

![A discussion scene set against a technical map of threats already executing code.](/assets/img/posts/substack/clickfix-kodel-siuolaikiniai-ta-nebeiesko/02.webp)

---

## What is ClickFix?

ClickFix in short is a social engineering technique where the user is convinced to execute a certain malicious command on their device.

**The scenarios are usually as follows:**

```
- The user enters the website:
  - Legitimate website compromised
  - Phishing page
  - Malvertising kampanijos landing page
  - Fake document review page
```

**What happens next in such a case? Elementary.. messages are displayed** ***(usually)*****:**

```
"Verify you are human."
"Browser check failed."
"Cloudflare verification required."
"Document cannot be displayed."
"Fix required to continue."
```

**A very quick "solution" is offered to the person:**

```
Press Windows + R
Press CTRL + V
Press Enter
```

If you already have macOS or Linux, the script will be adapted according to the OS. The ESET H1 2025 report notes that ClickFix has already targeted Linux and macOS users in addition to Windows, with some campaigns directing victims to different instructions based on operating system. ([ESET Threat Report H1 2025](https://web-assets.esetstatic.com/wls/en/papers/threat-reports/eset-threat-report-h12025.pdf))

**Technically everything is quite simple:**

```
The landing page contains JavaScript.
JavaScript waits for user action.
The user clicks "Verify", "Fix", "Continue" or some similar button
Malicious command is copied to the clipboard
```

The user is then shown instructions on how to run the command.

Microsoft has described that ClickFix can use navigator.clipboard.writeText() when the command is copied to the operating system clipboard. Older pages may still use document.execCommand(), now deprecated, but still visible (Microsoft, 2025).

The user thinks that he is "solving the problem", but in reality the execution has already been started.

This is where ClickFix is ​​genius, it doesn't ask the user (victim) to download some file *(which will be 100% blocked)*, and asks to "solve the problem".

Well, people like to deal with problems, especially if the problem is burning, preventing them from achieving something *(page, account or whatever)*.

It interferes with work - you need to decide quickly, preferably this second.. rather than writing to IT support and waiting for them to fix it the next day.. What will happen if I fix it myself.

![ClickFix attack chain from a fake website error to malicious code execution.](/assets/img/posts/substack/clickfix-kodel-siuolaikiniai-ta-nebeiesko/03.webp)

---

## Why is ClickFix so shady and fraudulent?

Okay ClickFix is ​​not effective because users are stupid *(here's a very cheap explanation, if you've seen it somewhere.. then mute me)*. It is effective because it uses normal human behavior, i.e. people want to continue working, open documents, get to the page, quickly finish the work they started. And when the "system" itself says .. "do these three steps", many.. people do it. Especially if the pop-up is familiar, especially since CAPTCHA has become part of our routine, Cloudflare checks happen frequently... and people stop reading what's going on, we just do it automatically.

ClickFix exploits exactly that. He attacks a person through routine, and as many know routine is a very powerful weapon.

The internet literally taught us to click "I'm not a robot" for years, but TA just added a few new steps to it *“Windows + R” → “CTRL + V” → “Enter” →* *Congratulations*.. now you really are not a robot, but simply running malware.

ESET described this phenomenon very precisely in its H1 2025 report *"users have become accustomed to various forms of reCAPTCHA, so few question a new type of challenge, even if it asks them to copy and run something on their device" (*ESET, 2025).

Well, here is the golden mean of social engineering.. *"strange enough to cause action, but familiar enough not to cause panic."*

![A fake CAPTCHA prompt persuades the user to copy and run a command.](/assets/img/posts/substack/clickfix-kodel-siuolaikiniai-ta-nebeiesko/04.webp)

---

## Technical anatomy. What happens after Verify?

**The ClickFix technical chain varies by campaign, but a typical model often looks like this:**

```
User clicks "Verify" or "Fix".
Landing page JavaScript copies the command to the clipboard.
The user is prompted to open the Run dialog, PowerShell, or Terminal.
The user pastes the command.
The command runs powershell, mshta, cmd, curl, wscript, rundll32, or another native execution tool.
The first stager downloads the second stage.
The second stage can be an obfuscated PowerShell, HTA, JavaScript, VBS, MSI or PE file.
Followed by loader, infostealer, RAT, backdoor or additional payload.
```

Proofpoint 2024 described a TA571 campaign where an HTML attachment mimicked a Microsoft Word/OneDrive type page. The "How to fix" button copied the Base64-encoded PowerShell command to the clipboard and instructed the user to open PowerShell and run it. Proofpoint also observed ClearFake chains in which compromised websites uploaded malicious scripts, used TDS filtering, PowerShell chains, sandbox checks via WMI, and were eventually able to deliver Lumma Stealer, Amadey, XMRig miner, clipboard hijacker and other payloads. (Proofpoint, 2024)

At this point, the important point is that ClickFix is ​​not malware, but ClickFix is ​​an execution pattern.

This means that the same social engineering model can present different ones *(different)* payloads.

Today "Lumma", tomorrow "StealC", the day after tomorrow "NetSupport RAT", and after a week already custom loader... well, after a month already ransomware pre-stage.

Therefore, talking about ClickFix only as "fake CAPTCHA phishing" is too narrow, it is a user-assisted execution framework.. this one sounds a bit more serious, and less convenient for security awareness presentation... well, the reality is not so convenient.

![Execution chain hidden behind a Verify button, involving the clipboard, Run dialog, and PowerShell.](/assets/img/posts/substack/clickfix-kodel-siuolaikiniai-ta-nebeiesko/05.webp)

---

## Real campaigns. From TA571 to Booking.com

So that ClickFix does not seem like a theoretical threat, it is worth looking at real campaigns.

Proofpoint described one of the earliest publicly documented ClickFix-type techniques in 2024. TA571 sent HTML attachments that mimicked Microsoft Word. The page claimed that the Word Online extension was missing and offered a "How to fix" button. Clicking it copied a PowerShell command; the user then initiated the infection chain. Proofpoint reported that TA571 had used the technique since 1 March 2024 in a campaign of more than 100,000 messages targeting thousands of organisations globally. (Proofpoint, 2024)

In the ClearFake samples, Proofpoint saw compromised websites, malicious JavaScript, EtherHiding via Binance Smart Chain contracts, Keitaro's TDS filtering, and a multi-step PowerShell chain. In one chain, PowerShell flushed the DNS cache, cleared the clipboard, displayed a decoy message, downloaded additional PowerShell scripts, performed a WMI-based sandbox / VM check based on system temperature data, and then led to an AES-encrypted PowerShell and a ZIP package with legitimate signed executables and trojanized DLL side-loading *(I hate DLL side-loading.. just me).*(Proofpoint, 2024)

***There is no such thing as "the user pressed the wrong button", but a multi-stage pipeline.***

Microsoft 2025 described a Storm-1865 campaign that mimicked Booking.com and targeted the hospitality sector. The emails impersonated Booking.com, used topics about negative guest reviews, account verification, potential guest inquiries or online promotion opportunities. After clicking on the link, the victim was taken to a page with a fake Booking.com page and a fake CAPTCHA. This CAPTCHA used ClickFix logic i.e. the user is instructed to open Windows Run and run a command that through **mshta.exe** initiates malicious code download. (Microsoft, 2025)

Microsoft said the campaign delivered several commodity malware families, including XWorm, Lumma Stealer, VenomRAT, AsyncRAT, Danabot and NetSupport RAT. The payloads supported credential theft, financial-data theft or other fraud-relevant activity. *(That is not surprising. When thinking about the Centre of Registers incident, though, it is still tempting to ask whether an APT used ClickFix. Tempting is not the same as proven.) (Microsoft, 2025)*

From CTI's point of view, not only malware names are very important here, but the most important thing is that ClickFix becomes a modular delivery technique that different actors can connect to different monetization models. Well, let's call it... as an adapter. Only instead of USB-C to HDMI we have fake CAPTCHA to infostealer.

![ClickFix campaign map links access channels, fake CAPTCHAs, and malware families.](/assets/img/posts/substack/clickfix-kodel-siuolaikiniai-ta-nebeiesko/06.webp)

---

## The problem with WordPress, Ghost CMS and legitimate websites

ClickFix becomes even more dangerous when it comes not from an obviously suspicious domain but from a legitimate website.

Rapid7 2026 described a large-scale campaign that compromised more than 250 WordPress sites. The reasons could be weak admin credentials, outdated plugins, themes or other widely exploited WordPress vulnerabilities. The compromised sites had a fake Cloudflare CAPTCHA element inserted. The site looked normal to the user, but on the first visit it presented a ClickFix-like prompt to copy and run the command through Windows Run. (Rapid7, 2026)

TechRadar summarizing Rapid7's research indicated that the campaign could have started in 2025. in December and hit a variety of sites, including regional media, small businesses, and even a US Senate candidate's page. (TechRadar/Rapid7, 2026)

Rapid7 also noted that by deobfuscating JavaScript snippets, more compromised websites, JavaScript hosting domains and fake CAPTCHA implant hosting domains could be discovered by hunting. (Rapid7, 2026)

Well, this is where my CTI comes into play.. if you see only one compromised website.. you can think **"wow incident isolated → blocklist"**, but if you see JS implant patterns, hosting patterns, repeated obfuscation, locale-based instruction generation and the same command delivery logic, you start to see a campaign.

This is a bit of a difference between a security alert and intelligence finding.

Some organisations still think that if a website is "legit", it is safe. That is like believing, as a child, that a Pokémon card must be valuable because it looks beautiful. *(I watch too many YouTube Pokémon-card unboxings.)*

ClickFix neatly buries this myth through compromised websites.

A legit website can become a malicious delivery surface. And this is especially relevant for organizations that have many marketing landing pages, WordPress installations, old microsites, event pages or forgotten project domains. Those pages often look like "marketing assets" to the management, and to TA they look like a free distribution network.

![Comparison of legitimate and compromised websites showing a fake verification layer.](/assets/img/posts/substack/clickfix-kodel-siuolaikiniai-ta-nebeiesko/07.webp)

---

## DriveSurge and TDS. When ClickFix becomes an infrastructure business

in 2026 June featured a DriveSurge campaign that demonstrated how ClickFix could be used in a large-scale Initial Access Broker operation. According to data compiled by Silent Push researchers and summarized by TechRadar, DriveSurge used thousands of compromised legitimate websites. Lightweight malicious scripts were inserted into them, which sent visitor data to the zTDS Traffic Distribution System. There, visitors would be profiled, and only those who seemed valuable would receive a ClickFix or FakeUpdates overlay. (TechRadar/Silent Push, 2026)

Bots and researchers were shown normal website content, and real targets were shown a social engineering overlay.

The maturity indicator already appears here, when ClickFix becomes not just one page, but the entire infrastructure, i.e. from cloaking, geo-fencing, profiling and so on.

TDS allows operators to filter traffic, avoid analytics, manage campaign effectiveness, show different lures to different victims, and rotate delivery logic. ClickFix may be available for some users. For others FakeUpdates. Nothing for others.

In other words, this model has become a marketing funnel for DriveSurge and TDS.

It sounds funny to a marketer, but.. why? **But, however, because:**

```
Lead generation.
Segmentation.
Conversion optimization.
```

Only.. that instead of product sales in this case we have backdoor installation and access resale.

I think if such a model came or I showed it to a marketing team... they would probably say "good funnel architecture" *(you need to find a marketer to comment...but anyway).*

If we show this model to the CISO... it becomes less funny.

Campaigns like DriveSurge show that ClickFix can be used not only to compromise a single victim, but as a scalable access acquisition model.

This is already directly related to the economics of the Initial Access Broker.

ClickFix → Backdoor → Access resale → Data theft / wire fraud / ransomware.

In this place, there is no more "fake CAPTCHA", but the entire supply chain, only the supply...no matter how criminal it sounds.

![DriveSurge operation flow from a compromised website to the final malicious payload.](/assets/img/posts/substack/clickfix-kodel-siuolaikiniai-ta-nebeiesko/08.webp)

---

## Malware families. Important, but not the main story

ClickFix companies are many malware families... Lumma, Vidar, StealC, DanaBot, DarkGate, Xworm, VenomRat, AsyncRat, and all the other smart stuff, and many ransomware pre-stagers.

The ESET H1 2025 report indicates that ClickFix has already been used to deliver infostealers, ransomware, RATs, cryptominers, post-exploitation tools and even custom malware from nation-state-aligned actors *(here I am again looking at the Registry Center data leak…)*. (ESET, 2025)

However, after nearly a decade in the CTI field, the name malware is often not the main issue for me.

Malware changes and operators stay the same.

If the campaign is distributed by Lumma today, you can switch to StealC tomorrow…  
If one loader becomes too visible, affiliates switch to another one.

Therefore, from CTI's point of view, the main question is not only "which malware family?". and the main questions should be "Who manages the infrastructure?", "Is it one operator or an affiliate?", "Are ClickFix landing pages generated by the builder?", "Are there campaign templates?", "Are the same JS implants repeated in other domains?", "Is the same TDS used?", "Does payload hosting match with other companies?", "Do Telegram channels, wallets, C2 or hosting providers show overlap?".

Malware/infostealer and all the other stuff are just really symptoms.

Infrastructure and monetization are often just a diagnosis.

And in this place, I often notice that the articles stop too early... They say "Lumma" that's it... but "Lumma" is only the last part in the whole chain.

If you want to understand the threat, you have to understand the path to "Lumma" and the path after "Lumma", because after "Lumma" there may be Initial Access Broker, and after access broker there may be ransomware, after ransomware there may be a Board meeting with a question ***"Why didn't we know about this before?"***. And then everyone suddenly remembers what was written in the PowerPoint presentation ***"CYBER RISK IS MANAGED".***

Nice.

![Malware ecosystem graph with ClickFix at its centre.](/assets/img/posts/substack/clickfix-kodel-siuolaikiniai-ta-nebeiesko/09.webp)

---

## What does a real CTI study look like after receiving a single ClickFix URL?

This is where the difference between IOC collecting and real intelligence is most apparent.

**After receiving a single ClickFix URL, a weak study often looks like this:**

```
Domain is taken.
Paimamas IP.
Paimamas hash.
Everything gets put on the block list.
```

The report is complete.  
Very tidy.  
Very fast.  
Very superficial.

**And a normal investigation goes like this..** The first question is not "what to block?" The first question is "what does this artifact unlock?" Several pivoting layers can be made from one URL:

```
The first layer is the domain.
When was it registered?
Koks registrar?
Is privacy protection used?
Is the domain fresh?
Does the history show previous DNS entries?
Does the domain have sibling domains according to the naming pattern?
Is the same registrar, TLD or naming convention repeated in other lures?

The second layer is DNS and hosting.
What A, AAAA, CNAME, NS records?
Is there shared hosting?
Are there signs of bulletproof hosting?
Does the domain only use Cloudflare as a reverse proxy?
Is the real origin hidden or still issued via historical DNS?

The third layer is TLS.
Koks sertifikato issuer?
What SAN records?
Ar sertifikatas self-signed?
Is Let's Encrypt issued together with other similar domains?
Does cert transparency show additional associated hosts?

The fourth layer is HTML and JavaScript.
What scripts are loaded?
Ar JavaScript obfuscated?
Is there anti-debugging?
Is there locale detection?
Is there browser/OS detection?
Is the command hardcoded or pulled from a remote resource?
Ar clipboard copy vyksta per navigator.clipboard.writeText()?
Is a hidden iframe, postMessage, event listener or simple click handler used?

The fifth layer is command analysis.
What does the team run?
PowerShell?
mshta?
cmd?
curl?
wscript?
rundll32?
Is Base64 used?
Is there a compressed / encrypted payload?
Is the command line shortened due to Windows Run MAX_PATH limitations?
```

*Microsoft's analysis notes that the Windows Run dialog is a trusted shell input UI in the context of Windows Explorer, and its input has a practical length limit of about 259 characters, so some ClickFix campaigns must accommodate this limitation. (Microsoft, 2025)*

```
The sixth layer is payload hosting.
Where does the stager apply?
GitHub?
Discord CDN?
Cloudflare Workers?
Compromised website?
Raw IP?
Paste service?
Object storage?
Telegram?

The seventh layer is post-compromise.
What does the payload steal?
Credentials?
Cookies?
Session tokens?
Crypto wallets?
Outlook data?
Browser profiles?
VPN artefaktus?
Is there persistence?
Is there a C2?
Is there an exfil endpoint?
Is there a Telegram bot token?
Is there a cryptocurrency wallet?

The eighth layer is campaign clustering.
Are the same components repeated elsewhere?
Does the favicon hash match?
Does the structure of JavaScript match?
Does the fake CAPTCHA template match?
Do the translations of the instructions match?
Are the same CSS class names used?
Are the same image assets?
Ar tas pats obfuscatorius?
Ar tas pats TDS?
```

It is at this point that a study can be grown from a single URL to an entire infrastructure cluster.

![CTI pivot graph expands one ClickFix URL into domains, certificates, and infrastructure links.](/assets/img/posts/substack/clickfix-kodel-siuolaikiniai-ta-nebeiesko/10.webp)

---

## Why does IOC-driven CTI fall short?

This is one of the most important lessons.

Many organizations still measure the maturity of the CTI function by the amount of IOC.

```
How many domains have we collected?
How many IPs have we added?
How many hashes did we send to the SOC team?
How many feeds have we integrated?
How many indicators have we uploaded to the SIEM?
```

All of this has value, but only a limited one.

ClickFix makes the problem with the IOC-centric model very clear:

- Domains change quickly.
- Payloads change rapidly.
- Teams change quickly.
- TDS decides who sees what.
- Researchers are shown one piece of content.
- Victims are shown another.

Some campaigns use compromised legitimate websites, which are not "malicious domains" in the classical sense... Then what am I blocking? Half the internet? Good plan.

Only users may not understand why so-and-so is blocked.

Therefore, mature CTI functionality must move from IOC to behavioral and infrastructure models.

***It is necessary to understand not only "what is evil", but also "how evil works".***

**In this case, it is important to analyze:**

```
ClickFix lure modelius.
Clipboard abuse patterns.
Browser-to-terminal execution flow.
TDS usage.
Compromised CMS patterns.
Payload hosting choices.
Malware-as-a-Service communications.
Access broker monetization.
Attribution-lite clustering based on technical artifacts.
```

This is intelligence of greater value because it helps not only to react, but also to predict *(well, I like to say "Hey guys, these are just assumptions that we have right now.. let's see how it the line)*.

**And this is the main difference between reporting and intelligence.**

**Reporting says -** *"This domain is bad."*

**Intelligence says -** *"This methodology will likely be adapted against our sector because it cheaply introduces infostealers, bypasses some of the awareness controls, and allows operators to quickly monetize access."*

One sentence blocks the domain.  
Another is changing the security strategy.

![Comparison of an IOC and strategic intelligence: yesterday's indicator versus long-term direction.](/assets/img/posts/substack/clickfix-kodel-siuolaikiniai-ta-nebeiesko/11.webp)

---

## ClickFix and the economics of cybercrime

ClickFix needs to be evaluated economically…not just technically.

In the world of cybercrime, as in any business, ROI is important *(ROI, KPIs, SLAs seem to me, and when I reach 60, I will be able to tell you what they are... if the intelligence doesn't go crazy):*

```
Kiek kainuoja ataka?
How many donations are available?
How many are converting?
How many windows are stolen?
How many passes are sold?
How far do ransomware or fraud operators go?
```

ClickFix is ​​economically attractive because it reduces the cost of initial access... No zero-day, no complicated exploit development, no need to bypass all browser protections, no expensive phishing kit with MFA proxy, and sometimes a compromised website, fake CAPTCHA template, JavaScript, clipboard copy and stager are enough.

It's cheap, it's scalable, it's easily adaptable and it can be sold as a builder.

The ESET H1 2025 report notes that due to the effectiveness of ClickFix, threat actors have started selling builders that allow other attackers to create ClickFix weaponized landing pages. (ESET, 2025)

When the technique moves to the ecosystem of builders, affiliates and MaaS, it ceases to be a trick of one operator, i.e. it becomes a service, and the cybercrime ecosystem loves services *(Malware-as-a-Service, Phishing-as-a-Service, Initial-Access-as-a-Service)..* and now we also have human-execution-as-a-Service logic.

**ClickFix can be the first step in the chain:**

```
ClickFix.
Infostealer.
Credential logs.
Access marketplace.
Initial Access Broker.
Ransomware affiliate.
Data extortion.
ICT Board-level incident.
```

It all started with "Verify you are human".

Somehow this place is very poetic... In a very bad way.

![Evolution of ClickFix from fake CAPTCHA prompts to identity and session compromise.](/assets/img/posts/substack/clickfix-kodel-siuolaikiniai-ta-nebeiesko/12.webp)

---

## Why is this a CISO problem and not just a SOC problem?

ClickFix is ​​often presented as a social engineering technique. It's true, I won't lie, but after looking at Board/Executive, it's too narrow a place.

At the CISO level, ClickFix should be viewed as a risk management issue.

**Why?**

Because it raises questions about the organization's security model.

```
Do employees understand that they should never execute commands from browser instructions?
Is the awareness program still focused only on "don't click on links"?
Can privileged users run PowerShell, mshta, or other living-off-the-land tools without a real need?
Does the organization have visibility into browser-to-shell behavior?
Does web filtering recognize compromised legit sites?
Is the risk of suppliers and marketing sites included in attack surface management?
Do incident response playbooks cover infostealer logs and session theft scenarios?
Does the risk committee understand that MFA does not necessarily protect against stolen sessions?
```

This is where security leadership begins.. not anymore ***"what hash to block?"***, oh ***"what control architecture doesn't work if an employee is persuaded to run a command via a browser?"***

**This is a much more important question.**

Some organisations have expensive EDR, XDR, SIEM, SOAR, TIP and several other acronyms that look nice in the budget. Then somebody sees a fake CAPTCHA and becomes an initial-access enabler in 15 seconds. The technology is not worthless; those controls are necessary. ClickFix simply reminds us that the human is still a privileged component of the system—and usually the least controlled. *(I shudder at the thought of BYOD.)*

CISOs should look at ClickFix as a test ie. not only the endpoint test, but the security culture test, the awareness maturity test, the privileged execution control test, the identity resilience test, the incident response maturity test.

If an organisation's only answer to ClickFix is "let's put the IOC in the SIEM", sorry, but it has failed the exam. Grade: two out of ten. *(The school maths exams were this week; apparently cybersecurity also has resits.)*

![A panel discusses why ClickFix is an access-control problem, not merely a SOC problem.](/assets/img/posts/substack/clickfix-kodel-siuolaikiniai-ta-nebeiesko/13.webp)

---

## The MFA myth, or why "turn on 2FA" isn't a strategy

Now for the slightly awkward part.

In Lithuanian security discussions, there is one phrase that appears almost everywhere.. "Needed an MFA.".. well, that's not bad advice. MFA is a necessary control, and the problem begins when MFA is treated as a strategy.

ClickFix often doesn't just aim to steal a password..it can introduce an infostealer, and an infostealer can steal browser cookies, session tokens, saved credentials, crypto wallets, VPN artifacts, developer secrets, cloud tokens, Outlook data, and other authentication artifacts.

This means that the attack does not necessarily fight MFA, it can bypass it during the session.

MFA preserves the same moment of authentication, but if artifacts are stolen after authentication, the discussion becomes more complicated.

***And that's where the magic of the LinkedIn comment "turn on 2FA" ends.***

**In reality, we need to talk about:**

```
phishing-resistant MFA
session protection
token lifetime
device compliance
conditional access
browser isolation
endpoint hardening
least privilege
privileged access workstations
infostealer telemetry
credential reset workflows
session revocation
post-compromise identity response
```

Yes, I know, this is definitely less convenient than writing "use MFA" *(it seems to me that the Registry Center incident will travel with me for the rest of these years..)*

***ClickFix is ​​a very clear reminder that security is not a single control. It is a control architecture. And if architecture depends on a person never doing a stupid thing, then it is not architecture.***

It is hope, and hope is not control, and we all know very well whose mother hope is.

![MFA and session-theft comparison showing that authentication is not absolute protection.](/assets/img/posts/substack/clickfix-kodel-siuolaikiniai-ta-nebeiesko/14.webp)

---

## What does ClickFix say about future threats?

In my estimation, ClickFix is ​​just the beginning *(here I wrote in Medium that we will see AI enhanced vulnerability scanning and exploitation in 2022... well, in 2026 we have Mythos)*.

Not the end.

This is indicative of a broader trend where social engineering is becoming increasingly productized, automated and tailored to the victim.

**We already see:**

```
OS detection.
Different instructions for Windows, macOS and Linux users.
Video instrukcijas.
Fake verification counters.
Timers.
Brand impersonation.
Malvertising.
SEO poisoning.
Compromised legit websites.
TDS profiling.
```

Microsoft's analysis notes that ClickFix campaigns targeted thousands of enterprise and end-user devices globally every day and were combined with phishing, malvertising and drive-by compromises (Microsoft, 2025).

Tom's Guide 2025 described ClickFix-type attacks as evolving to video instructions and operating system recognition to provide more tailored instructions to the victim (Tom's Guide, 2025).

AI is added to all this mess..

**This next stage might look like this:**

```
AI generated lure based on victim position.
Personalized fix based on browser, OS and language.
Real-time chat support imitacija.
Voice-assisted social engineering.
Deepfake IT support.
Localized ClickFix in Lithuanian.
Fake error pages are automatically generated according to the maturity of the organization.
```

And then it won't be enough to teach people "don't trust suspicious emails" *(Registry Center again.. okay I am done, but there.. they drop the info[at]rc[.]lt email and write that there is a scammer's email.. Okay Radio Center, what the hell are you doing there?? I will start making a meme page with such manifestations, I already have a well-chosen material)*.

Because an attack may not look like a suspicious email, it may look like a very normal technical glitch, and technical glitches are part of modern work.

People don't react to them as a threat..they react as an obstacle and that's exactly what attackers exploit.

The social engineering of the future will not only be more persuasive..it will be more contextual…more localized…more personalized…and unfortunately, much more human.

![Future phishing combines AI, trusted infrastructure, and user actions.](/assets/img/posts/substack/clickfix-kodel-siuolaikiniai-ta-nebeiesko/15.webp)

---

## What should organizations do?

I don't want to turn this blog into a detection engineering document *(although I could... I wrote maybe 30 detection rules here alone)*, but several principles are necessary.

**First principle:** awareness must change.."Don't click links" is no longer enough.  
**A clear rule is needed:** no website, email, document or chat message should ask a user to open Run, PowerShell or Terminal and execute a command. If it does, treat it as an incident—not an instruction.

**Second principle:** limit unnecessary execution.  
If an employee does not need Run dialog, PowerShell, mshta, wscript or other living-off-the-land surfaces for daily work, they should not be readily available without control.

**The third principle:** monitor browser-to-shell chains.  
chrome.exe → poweshell.exe, msedge.exe → mshta.exe, firefox.exe → cmd.exe.  
Tokei parent-child relationships are not always bad, but they are often rare enough to be worth investigating.

**Fourth principle:** take infostealer incidents seriously.  
Infostealer is not a "small virus", infostealer can be the beginning of ransomware.

**Fifth principle:** incident response must include session revocation.  
If cookies or tokens are stolen, changing the password may not be enough.

**Sixth principle:** attack surface management must include forgotten sites.  
A marketing landing page, an old WordPress, a test project, an abandoned subdomain - all this can become a delivery infrastructure.

**Seventh principle:** CTI *(well, in the case of Lithuania, SOC or others who look at these things)* must speak a language understandable to management.  
Not "HTML/FakeCaptcha detections increased", but "this technique reduces the efficiency of our awareness program, increases the risk of infostealer and can become the starting point of the access broker chain". In this case, one sentence is for analysts and the other is for management. Both are needed.

![Checklist of practical organisational defences against ClickFix.](/assets/img/posts/substack/clickfix-kodel-siuolaikiniai-ta-nebeiesko/16.webp)

---

## Sources

1. <span id="source-1"></span><span class="hx-source-entry"><a href="https://www.microsoft.com/en-us/security/blog/2025/08/21/think-before-you-clickfix-analyzing-the-clickfix-social-engineering-technique/">Microsoft Threat Intelligence. Think before you Click Fix : Analyzing the ClickFix social engineering technique. 2025</a> <span class="hx-source-type">Vendor research</span></span>
2. <span id="source-2"></span><span class="hx-source-entry"><a href="https://www.microsoft.com/en-us/security/blog/2025/03/13/phishing-campaign-impersonates-booking-com-delivers-a-suite-of-credential-stealing-malware/">Microsoft Security Blog. Phishing campaign impersonates Booking.com, delivers a suite of credential-stealing malware. 2025</a> <span class="hx-source-type">Vendor research</span></span>
3. <span id="source-3"></span><span class="hx-source-entry"><a href="https://www.proofpoint.com/us/blog/threat-insight/clipboard-compromise-powershell-self-pwn">Proofpoint Threat Research. From Clipboard to Compromise: A PowerShell Self-Pwn. 2024</a> <span class="hx-source-type">Vendor research</span></span>
4. <span id="source-4"></span><span class="hx-source-entry"><a href="https://web-assets.esetstatic.com/wls/en/papers/threat-reports/eset-threat-report-h12025.pdf">ESET Threat Report H1 2025. ClickFix: Fake errors, real threats. 2025</a> <span class="hx-source-type">External source</span></span>
5. <span id="source-5"></span><span class="hx-source-entry"><a href="https://www.rapid7.com/blog/post/tr-malicious-websites-wordpress-compromise-advances-global-stealer-operation/">Rapid7. When Trusted Websites Turn Malicious: WordPress Compromises Advance Global Stealer Operation. 2026</a> <span class="hx-source-type">External source</span></span>
6. <span id="source-6"></span><span class="hx-source-entry"><a href="https://www.techradar.com/pro/security/thousands-of-compromised-websites-abused-by-drivesurge-in-active-clickfix-and-fakeupdates-campaigns">TechRadar/Silent Push. Thousands of compromised websites abused by DriveSurge in active ClickFix and FakeUpdates campaigns. 2026</a> <span class="hx-source-type">External source</span></span>
7. <span id="source-7"></span><span class="hx-source-entry"><a href="https://www.techradar.com/pro/security/hackers-hijack-wordpress-sites-to-spread-malware-using-fake-captcha">TechRadar/Rapid7. Hackers hijack WordPress sites to spread malware using fake CAPTCHA. 2026</a> <span class="hx-source-type">External source</span></span>
8. <span id="source-8"></span><span class="hx-source-entry"><a href="https://www.tomsguide.com/computing/malware-adware/clickfix-attacks-just-got-a-major-upgrade-to-trick-you-into-infecting-your-computer-with-malware-dont-fall-for-this">Tom&#x27;s Guide. ClickFix attacks now include video instructions and can recognize your operating system. 2025</a> <span class="hx-source-type">External source</span></span>
9. <span id="source-9"></span><span class="hx-source-entry"><a href="https://www.microsoft.com/en-us/corporate-responsibility/cybersecurity/microsoft-digital-defense-report-2025/">Microsoft Digital Defense Report 2025</a> <span class="hx-source-type">Vendor research</span></span>

***Additionally, I recommend reading:***

1. <span class="hx-source-entry"><a href="https://www.hhs.gov/sites/default/files/clickfix-attacks-sector-alert-tlpclear.pdf">HHS HC3 ClickFix sector alert</a> <span class="hx-source-type">Primary source</span></span>
2. <span class="hx-source-entry"><a href="https://www.hhs.gov/sites/default/files/vidar-malware-analyst-note-tlpclear.pdf">HHS HC3 Vidar malware analyst note</a> <span class="hx-source-type">Primary source</span></span>
3. <span class="hx-source-entry"><a href="https://unit42.paloaltonetworks.com/preventing-clickfix-attack-vector/">Unit 42 ClickFix attack vector analysis</a> <span class="hx-source-type">Vendor research</span></span>
4. <span class="hx-source-entry"><a href="https://www.recordedfuture.com/research/clickfix-campaigns-targeting-windows-and-macos">Recorded Future ClickFix campaigns targeting Windows and macOS</a> <span class="hx-source-type">External source</span></span>
5. <span class="hx-source-entry"><a href="https://www.sekoia.io/en/homepage/">Sekoia — Homepage</a> <span class="hx-source-type">External source</span> <a href="https://www.huntress.com/">Huntress — Source</a> <span class="hx-source-type">External source</span> <a href="https://reliaquest.com/">Reliaquest — Source</a> <span class="hx-source-type">External source</span></span>
