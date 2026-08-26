---
title: "When Fake News, Scams, and Cloaking All Meet in One Place"
description: "An investigation into how fake news, investment fraud, and cloaking combine into a single victim-selection and monetisation infrastructure."
seo_title: "Investment Scam Cloaking Infrastructure Investigation"
seo_keywords:
  - "investment scam cloaking infrastructure"
  - "fake news investment fraud"
  - "cloaked landing pages"
  - "victim filtering"
  - "Facebook investment scams"
date: 2026-06-15T14:21:51.923Z
lang: en
translation_key: substack-kai-fake-news-scamai-ir-cloaking
permalink: /en/research/when-fake-news-scams-and-cloaking-meet/
author: deividas-lis
content_type: investigation
confidence: moderate
tlp: clear
categories: ["fraud-scams", "information-operations"]
tags: ["cloaking", "investment fraud", "Facebook", "OSINT"]
featured: false
scope: "Analysis of fraud traffic, routing logic, and differential content delivery to audiences."
limitations: "The infrastructure changes quickly, so domains and redirect paths represent a point-in-time view."
key_findings:
  - "Cloaking separates potential victims from researchers and platform controls."
  - "Fake-news content acts as a trust and traffic-generation layer."
  - "Infrastructure and template overlaps connect campaigns more reliably than a single domain."
image:
  path: /assets/img/posts/substack/kai-fake-news-scamai-ir-cloaking/01.webp
  alt: "When Fake News, Scams, and Cloaking All Meet in One Place"
  thumbnail: /assets/img/posts/substack/kai-fake-news-scamai-ir-cloaking/01-card.webp
  width: 1600
  height: 900
source_url: https://deivlis.substack.com/p/kai-fake-news-scamai-ir-cloaking
---
![Cloaking diagram showing one URL serving a safe page to a researcher and a scam to a victim.](/assets/img/posts/substack/kai-fake-news-scamai-ir-cloaking/01.webp)

*WeRedirect APT is the label Debunk.org gave this operation. I am not convinced by the "APT" part: the infrastructure, operators, cloaking and advertising farms make it persistent and organised, but "financially motivated threat actor" or "persistent scam operation" is more precise. Fraudsters targeting Lithuania and other European countries created cloned news portals, fake Facebook accounts and investment-scam landing pages, then used cloaking to serve different content to different visitors. Part I of Debunk.org's report identified 93 Facebook accounts, 81 brand-impersonation pages, 568 fake ads and 7.5 million impressions; more than 5.1 million impressions reached Lithuanian users across Facebook and other Meta platforms. (Debunk.org, 2023 Part I)*

*The most important technical point is that the same URL is not the same proof, aka one person can see an empty page, another a bad one, and a person from Lithuania (with the right device, language, referrer and IP reputation) can see a fake Delfi/LRT/Ignitis investment page. Debunk part 3 described that WeRedirect used geolocation/IP-based redirection, different URL path variants, low-quality pages and selected content accordingly (Debunk.org, 2023 Part III)*

---

## What is Cloacking in the context of CTI

Cloaking in the context of phishing and malvertising is the control of content presentation based on certain characteristics of the visitor. For security scanner, ad reviewer, cloud sandbox or researcher *(for researcher or whatever you call it, you won't spoil it)* the "normal" page is displayed. Phishing, scam, crypto drainer, fake investment platform, malware landing page, or some fake installer is displayed to the targeted user. Hero in 2026 the described case of 1Campaign shows that exactly the same model takes place in the Google Ads ecosystem, i.e. real users see scam content, while ad platform reviewers and automated scanners see a blank page or a harmless page. (Hero, 2026)

HUMAN Security 2025 in the malvertising analysis, cloaking presented it as a "split personality" advertising model, which is the same as 1Campaign. (HUMAN Security, 2025)

ZeroFox lists the typical characteristics of a cloaked phishing kit: JavaScript rendering requirement, User-Agent filtering, timing delays, IP blocklists, geo-blocking and domain rotation/DGA. He also mentions that phishing kits often block web crawlers, searchers, bots and other "undesirables". (ZeroFox, 2023)

Well, I'm going to intervene here too *(who else but a dog will lick itself...),* when I was still at NordVPN ThreatProtection, we also wrote a little about cloaking and caught 2024. *(my team wrote...only NordVPN experts are left...sad).* (NordVPN, 2024)

![Visitors receive legitimate or fraudulent content according to verification signals.](/assets/img/posts/substack/kai-fake-news-scamai-ir-cloaking/02.webp)

---

## Basic cloaking techniques

#### Techniques

| Technique | How it works | What the analyst sees | How to detect |
| --- | --- | --- | --- |
| Geo/IP filtering | Server resolves by IP country, region, ASN, and residential/mobile/datacenter type | From cloud or VPN infrastructure, the analyst may see a white page or 404 | Test from varied mobile, residential and datacenter profiles |
| ASN / hosting reputation filtering | Blocks Google, Microsoft, AWS, OVH, DigitalOcean, VPN and security vendors | Scanners receive a benign page | Compare cloud and residential/mobile responses |
| User-Agent filtering | Tests Chrome/Safari/Firefox, OS, mobile/desktop and bot UA | Headless Chrome or curl gets different HTML | Change UA, Accept-Language and platform headers |
| JavaScript rendering gate | Content is generated only with JS, cookies, localStorage and timers | A static scanner sees empty HTML | Use Playwright/Chrome with HAR and screenshots |
| Headless/browser fingerprint detection | Checks `navigator.webdriver`, plugins, fonts, WebGL, canvas and screen size | Automation gets the facade | Compare real-browser and headless results |
| Referer / ad-click gating | The real version is displayed only when coming from a Meta or Google ad click | Opening the URL directly does not work | Collect the full ad URL with parameters, referrer and redirect chain |
| Cookie/session gating | The first visit shows one page and a repeat visit another | After several checks, the page “closes” | Use clean sessions and new profiles, and capture the first request |
| Time delay | Scam content appears after 5–30 seconds or after a scroll/click | A fast scanner does not see it in time | Extend wait time and record DOM changes |
| Path-based landers | The same domain has many localized `/lander/lt...`, `/lander/se...` paths | One path fails while another displays the scam | Enumerate only publicly visible paths and compare their structure |
| Shield pages | The initial lander looks like a low-quality news or gossip page | The scanner sees a pseudo portal | Review JS, redirect initiators, form actions and hidden links |
| Sample-rate cloaking | The malicious version is displayed only for a portion of sessions | One test may show nothing | Repeat from different environments, safely and within defined limits |
| Anti-debugging / DevTools detection | JS checks debug or DevTools attributes | Opening DevTools changes the behavior | Collect HAR through a proxy or browser API, not only through manual DevTools |
| Localization gating | Checks `Accept-Language`, timezone, currency and browser locale | A non-target locale receives the facade | Test with different locale and timezone combinations |
| CAPTCHA / challenge gating | Phishing appears after a challenge or interaction | The scanner stops at the challenge stage | Document the challenge without entering personal data |
| Tracking / affiliate gating | The real lander is active only with `fbclid`, `gclid`, UTM or an affiliate ID | Removing parameters prevents the page from working | Preserve the original URL with every parameter |
{: .hx-table-wide }

What is important here is not that technique is not a problem, but that problems arise when there are already combinations.

**In real companies, not one logic works, but their combinations:** *Meta ad → fake news profile → tracking URL → Geo/IP check → UA check → cookie check → JS redirect → localized fake article → investment form → callback/CRM/Telegram/affiliate backend.*

Catch it where you missed it... Uhhh fun.

![Decision tree showing IP, device, browser, and behavior checks before content is selected.](/assets/img/posts/substack/kai-fake-news-scamai-ir-cloaking/03.webp)

---

## How to safely "decloak" and access real phishing/scam content

In short, the goal is to collect IOCs and screenshots and document the cloaking mechanism. We do not enter real personal data, buy anything, click downloads or execute payloads. We do not interact with operators beyond what is needed to confirm the phishing or scam. If a form requests a phone number or bank-card details, we use clearly synthetic test data, never our own or somebody else's. We record the form fields, endpoints, DOM, screenshots and network requests—and then we are done.

**Practical workflow** ***(it looks something like this):***

**Passive-first.** Let's start with passive sources:

```
domain age and registrar
WHOIS / RDAP
nameservers
A/AAAA/CNAME
passive DNS
certificate transparency
ASN / hosting provider
favicon hash
page title / OpenGraph
Meta Ad Library creative metadata
social profile creation / rename history
brand keywords domene
URL path structure
UTM / affiliate / tracking ID
```

Debunk.org described registration time and domain creation clusters as beneficial for WeRedirect *(it goes without saying that pivoting is The King)*. Some of the domains were created at a very similar time. Debunk also mentions Cloudflare, DigitalOcean, hosting providers, Namecheap, Tucows, URL Solutions, and privacy-protecting logging services as infrastructure layers that made the analysis difficult. (Debunk.org, 2023 Part III)

**Differential fetch.** We check the same URL under several conditions:

```
# Minimalus baseline
curl -i -L --max-redirs 10 "https://example[.]com/path" -o baseline.html

# More realistic Chrome desktop profile
curl -i -L --max-redirs 10 \
  -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36" \
  -H "Accept-Language: lt-LT,lt;q=0.9,en-US;q=0.8,en;q=0.7" \
  "https://example[.]com/path" -o chrome_lt.html

# Bot / scanner
curl -i -L --max-redirs 10 \
  -A "Googlebot/2.1 (+http://www.google.com/bot.html)" \
  "https://example[.]com/path" -o bot.html
```

In this case, we compare whether the same URL returns different codes, Location headers, HTML size, page title, JS Budle, cookies or final URL.

**Browser-rendered collection.** Static ***curl*** is often not enough. In this case, ZeroFox identifies JS rendering, timing delays and User-Agent filtering as typical cloaked phishing techniques, so browser-rendered analysis is also needed. (ZeroFox, 2023)

We use an isolated VM, Playwright/Chromium, a new browser profile for each test *(I actually have over several hundred browser profiles to catch cloaking)*, without real accounts and without real data:

```
from pathlib import Path
from playwright.sync_api import sync_playwright

target = "https://example[.]com/path"
out = Path("evidence")
out.mkdir(exist_ok=True)

profiles = [
    {
        "name": "lt_chrome_desktop",
        "locale": "lt-LT",
        "timezone_id": "Europe/Vilnius",
        "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        "viewport": {"width": 1366, "height": 768},
    },
    {
        "name": "mobile_android_lt",
        "locale": "lt-LT",
        "timezone_id": "Europe/Vilnius",
        "user_agent": "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36",
        "viewport": {"width": 390, "height": 844},
    },
]

with sync_playwright() as p:
    for prof in profiles:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context(
            locale=prof["locale"],
            timezone_id=prof["timezone_id"],
            user_agent=prof["user_agent"],
            viewport=prof["viewport"],
            record_har_path=str(OUT / f"{prof['name']}.har"),
        )
        page = context.new_page()
        page.goto(target, wait_until="networkidle", timeout=45000)
        page.wait_for_timeout(15000)

        (out / f"{prof['name']}.html").write_text(page.content(), encoding="utf-8")
        page.screenshot(path=str(out / f"{prof['name']}.png"), full_page=True)

        context.close()
        browser.close()
```

*(don't be offended by the "smart" python script, I'm not a developer..it's him..and there is no universal decoder suitable for everything, the situation is not the same)*

**Matrix-based decloaking**  
One of the most practical ways *(i think.. my opinion)* is not "I opened the URL and looked", but to create a matrix for testing, in other words.. the same URL must be checked through several profiles, the differences between the answers can already be proof that content decision logic is taking place.

**To put it simply (taking Lithuania):**

#### Tests

| Test | IP / location | Browser / UA | Language / timezone | Referer / parameters | What are we looking for? |
| --- | --- | --- | --- | --- | --- |
| In Baseline | Datacenter / EU | curl | default | none | Is the page live, what are the status codes |
| LT user | Lithuania | Chrome desktop | lt-LT / Europe/Vilnius | original URL | Does it show localized scam / fake news |
| LT mobile | Lithuania | Android/iOS mobile | lt-LT / Europe/Vilnius | original URL | Is the campaign mobile-first |
| Non-target user | US / NL / DE | Chrome | en-US | none | Does it show blank/facade/other content |
| Bot profile | anywhere | Googlebot/crawler UA | default | none | Are bots showing harmless content |
| Well, JS | Lithuania | Chrome, JS off | lt-LT | original URL | Do you need a JavaScript redirect? |
| Well, for days | Lithuania | Chrome | lt-LT | clip fbclid/utm | Are campaign tokens necessary? |
| Repeat visit | Lithuania | same in profile | lt-LT | original URL | Does the scam content close after a few times? |

From this point of view, not one test is important, but several *(of tests)* correlation. If ***curl*** gets 1.2KB HTML with empty ***<body>***, Googlebot receives some low-quality news page, LT mobile profile receives a fake investment page with a form... we can say that we have cloaking.

**Anyway, what else would be worth comparing this to:**

```
# HTML sizes
wc -c baseline.html chrome_lt.html bot.html 

# Hashs, if we want to quickly see if the content is identical
sha256sum baseline.html chrome_lt.html bot.html

# Fast grep of title / redirect / JS artifacts
grep -Eoi "<title>.*</title>|window.location|document.location|location.href|setTimeout|atob|eval|gtm|f
```

If one profile HTML has ***form, phone, firstname, lastname, submit, pixel, fbq, gtm*** *(I know swear words..)*, and the HTML of the other profile is empty or shows random bad *(eg mine)*, that paranoia can be thrown out the window, we have two faces on one page.

![CTI testing matrix compares website responses across different research environments.](/assets/img/posts/substack/kai-fake-news-scamai-ir-cloaking/04.webp)

---

## What exactly to compare

When we are already collecting certain evidence, just a screenshot is not enough *(this one is for managers and Linkedin only),* we need some technical analysis and more info.

**If I have to catch possible cloaking... I collect artifacts:**

#### Artifacts

| Artifact | Why is it important? |
| --- | --- |
| Final URL | Shows where the redirect chain actually ended |
| HTTP status codes | 200/302/403/404 differences between profiles indicate gating |
| Location headers | Helps to see server-side redirects |
| HTML body size | Blank vs full lander can be seen very quickly |
| Page title | Fake news / investment template identification |
| Cookies | Session gating may be used |
| localStorage/sessionStorage | JS based decision flags |
| HAR file | Complete request/response tree |
| Screenshot | Visual proof of brand impersonation |
| JS files | Redirect, fingerprinting, tracking logic |
| Form action endpoint | Where does user data go? |
| Tracking IDs | GA/GTM/Meta Pixel/affiliate clustering |
| Referrer chain | Does the user have to come from a Facebook/Google ad |
| DNS/ASN/SSL | Infrastructure pivoting |

Here, one of the best signals is not the domain, but the repetitive logic. We all know that domains change/rotate *(I hope everyone knows, if not, don't thank me for this info, it was hidden here under TLP:Amber)*, Landing pages will change. Beeeettt.. as I mentioned in that blog about pivoting, operators often leave the same redirect pattern, the same JS fragment, the same form field naming, the same GTM container, the same affiliate parameter or the same path structure *(I leave that big TLP:Amber at the bottom, who hasn't read it)*

In other words.. IOCs die and TTP lives on.

![A research workstation analyzes website code, traffic, and rendered content together.](/assets/img/posts/substack/kai-fake-news-scamai-ir-cloaking/05.webp)

---

## Basic cloaking techniques

I have already listed the main techniques in the mandram table above, and now let's get to the how-to.

There is not much mysticism here, cloaking is not some super elite "APT Magic", it is mundane *(and many uses)* web control layers are only combined into one decision engine.

**Geo/IP based cloaking.**  
The server checks which country the visitor is coming from. If the visitor is from Lithuania *(here I will use Lithuania everywhere, it will be easier to understand)* it shows him the fake Delfi / Ignitis / Orlen / Investment page. If a visitor from the USA or some cloud data center is shown a blank page, a harmless bad or low-quality random page.

This place is very convenient for scammers, because many security vendors, sandboxes and ad review systems operate from cloud infrastructures or from regions that are not the target of their campaign, so scanners see nothing, and real people fall for scams.

**ASN / Hosting reputation filtering.** At this point, not only the country but also the network type matters. The server can check whether the visitor's IP belongs to AWS, Google Cloud, Microsoft Azure, DigitalOcean, OVH, Hetzner, a VPN provider *(especially when VPN providers publish their IPs publicly)* or a well-known security vendor.

If the IP looks like an analyst or scanner environment, then harmless content is displayed.  
If the IP looks like a residential or mobile user, then the real page is displayed.

As a result, simply "I checked via VPS" often means that "I checked the way the attacker expected the researcher to check".

**User-Agent filtering**  
This is already a classic. The server or JavaScript checks whether the visitor comes with a realistic Chrome/Safari/Firefox User-Agent or with ***curl, python-requests, HeadlessChrome, GoogleBot, BingBot, facebookexternalhit, Go-http-client*** and similar mandri names.

**Some examples:**

```
curl/8.0 → blank page
Googlebot → facade page
Chrome on Windows → fake article
Mobile Chrome on Android → fake investment form
```

This is often where all research begins and ends ***curl***, gets a blank page and that's it.

**JavaScript rendering gate.** On some pages, the initial HTML is almost empty and the actual content appears only after JavaScript runs.

**This means that the static scanner will see:**

```
<html>
    <body>
        <script src="/assets/app.js"></script>
    </body>
</html>
```

And in reality, after a few seconds, the browser already has a full DOM with a fake article, form, tracking pixels and redirect.

Sooooooo.. Playwright/Chomium or other browser-rendered collections become necessary. Not because of the fancy automation that everyone loves so much, but because more modern scam content often doesn't exist in static HTML.

**Headless browser detection**  
When operators want to be even more annoying *(these are the ones that annoy me the most if anything)*, they check if the browser looks automated..

**Typical signals:**

```
navigator.webdriver
navigator.plugins.length
navigator.languages
screen.width / screen.height
WebGL vendor / renderer
canvas fingerprint
timezone
fonts
mouse movement
touch support
```

If the page already "sees" that the browser is headless or "too clean", it may show a fake page, so the goal here is not to "hack" cloaking, but to create several different collection profiles and document how the content changes according to the environment.

Here you don't have to become a developer master of automation and create some stealth bypass frameworks like QA for scammers. Relay is enough to emulate the conditions of a real user and collect the differences.

**Referer / ad-click gating**  
Some companies only show the real landing page when the user comes from advertising.

**Like for example:**

```
facebook.com → l.facebook.com → tracking URL → cloaking gate → fake article
```

If we open the same URL directly through the browser, we can get a blank page without referer and without campaign parameters.. And why does it allow through Ads.. That phone is a wonderful thing, you go to a scam page, say Delfi, and the URL itself does not show very well.

**Here it is important to save the original URL with all parameters:**

```
fbclid
gclid
utm_source
utm_campaign
utm_content
ad_id
campaign_id
affiliate_id
subid
clickid
```

If you don't wrap it in cotton wool, that's exactly it ***clickid*** or ***sit down*** may be the key to a real scam page, you left this .. no more page.

**Cookie/session gating**  
**Some systems decide based on whether the user has visited before.. these are:**

```
First time - scam.
Second time - scam
...
The fifth time is a fake page.
..
The tenth time is a blank page.
```

Why? Elementary Watson.. Because the researcher often repeats the tests, the real user usually comes once or twice. Too many visits from the same profile is a signal to the fraudster that there is no longer a future victim here *(and Deividas behind the screen :(.. )*.

As a result, I use clean sessions for every larger study or research I do, and they should really be used.

```
new browser context
nauji cookies
new localStorage
new profile
atskiras HAR
timestamp for each test
```

**Timing delay.** Some pages deliberately take their time. The content may appear after 5, 10, 15 or 30 seconds *(the longest I have seen was 34 seconds)*, and the redirect may happen only after a scroll, mouse movement or basic click.

What happens in the video is a scanner that waits for 3 seconds and closes the page, seeing nothing, the person who actually reads the fake article is directed to the registration form after 10 seconds.

**Here, if she is already using Playwright, she would have to wait longer:**

```
page.goto(target, wait_until="networkidle", timeout=45000)
page.wait_for_timeout(15000)
```

**And it is perfect to fix the DOM with a few time comments:**

```
for i in [3, 10, 20]:
    page.wait_for_timeout(i * 1000)
    (out / f"{prof['name']}_{i}s.html").write_text(page.content(), encoding="utf-8")
    page.screenshot(path=str(out / f"{prof['name']}_{i}s.png"), full_page=True)
```

You can see how the page changes after a delay or changes at all.

**Path-based landers**  
Returning to the case of WeRedirect, this quite interesting place is the path structure. The domain looks like a random low-quality page, but the specific path activates the scam template.

**For example:**

```
example[.]com/lander/lt9-vlad/
example[.]com/lander/se1-vlad/
example[.]com/igns/
example[.]com/oil-profit/
```

Bruteforcing paths would not be needed here, but by analyzing already publicly visible paths from advertisements, social posts, HAR files, URLscan, public sandbox results and the like.

If several different domains have the same path structure, the same naming convention or the same DOM template, we can say that we have clustering.

**Facade pages**  
A facade page is a page that exists only to look normal *(this is how I am at work meetings without a Dragon Ball mask, but with a normal one)*. Often there are poor quality news pages, lifestyle or some other e-commerce page.

**Most often, such pages have:**

```
random articles
inactive categories
copy-paste tekstus
generic stock images
fake author names
fake footer
jokio realaus brand history
poor language
daug tracking
strange domain age
```

The purpose of these pages is simple, when a Meta reviewer, scanner or researcher opens the page, he sees something that is not an obvious scam. Well, not a good page, but just not bad enough so that the domain is not immediately shot or a scam company.

---

## What a real research flow looks like

In practice, the study may look like this:

```
1. We find a fake Facebook ad or receive a message from a user
2. Save the screenshot and the original URL with all parameters
3. We check Meta Ad Library / social page history
4. We perform passive DNS / WHOIS / CT / ASN analysis
5. We run differential fetch through several profiles
6. We collect HAR, HTML, screenshots and final URL
7. We compare content differences between profiles
8. We extract form endpoints, JS artifacts, tracking IDs
9. Pivotinam per domenus, SSL, favicon, ASN, path’us, DOM similarity
10. We prepare IOCs
11. For reporting platform / mature / CERT-LT / OpenPhish / ScamAdvisor / GSB or something else
```

In my eyes, the flow here is very simple and separates a little "I found a scam page" from "I did research and found that it is a scam".

![Suspicious redirect chain from an advertisement and shortened link to a scam landing page.](/assets/img/posts/substack/kai-fake-news-scamai-ir-cloaking/06.webp)

---

## Technical indicators that are worth paying attention to

If I already did *(not saying I don't now)* similar to the analysis of a scam-type company, there would not be only domains in the IOC table... Domains die quickly, you need to get to broader indicators.

#### Artifacts

| IOC/Artifact | An example | Who benefits? |
| --- | --- | --- |
| Domain | fake brand / news domain | for blocking, takedown |
| URL path | /lander/lt..., /igns/ | template clustering |
| Registrar | Namecheap, Tucows, others | registration pattern |
| Nameserver | recurrent NS | infrastructure grouping |
| ASN | hosting / CDN | for blocking and pivoting |
| SSL cert | SAN, issuer, validity | certificate pivoting |
| HTML title | fake news headline | content clustering |
| OG tag | og:title, og:image | social preview abuse |
| JS hash | redirect / fingerprint script | campaign clustering |
| Favicon hash | copied brand favicon | brand impersonation detection |
| Form action | endpoint collecting leads | backend mapping |
| Tracking ID | GTM/GA/Meta Pixel | operator / affiliate link |
| For affiliate support | subid, clickid, affid | monetization chain |
| Social page ID | fake page / renamed page | distribution layer |
| Ad creative | headline/image/copy | social engineering narrative |
| Screenshot | fake brand evidence | reporting and takedown |

It should be emphasized here that the domain is disposable. Tracking ID, form endpoint, JS hash or path convention often live significantly longer.

**Infrastructure clustering.** Infrastructure clustering is very important in this topic because operators often create many disposable domains. If we look at only one URL, we see one scam. If we pivot, we can see the whole campaign.

**Domain registration time.** If 20 domains are created in the same week using the same registrar and a similar naming pattern, that is already a signal.

**Nameservers**  
The same nameservers between several brand impersonation domains can point to a common operator or the same setup.

**Certificate Transparency.** CT logs show which certificates have been issued to domains. If one certificate contains several related SAN records or multiple domains have a very similar issuance pattern, further pivoting is possible.

**Favicon hash.** If scammers copy the brand page, they often copy the favicon as well. A favicon hash allows you to search for other pages that use the same visual artifact.

**HTML/DOM similarity.** A very powerful method. **Even if the domains are different, the template can be the same:**

```
tas pats header layout
the same CSS class names
the same fake comments
tas pats footer
same form field names
tas pats countdown timer
tas pats review block
tas pats JavaScript redirect pattern
```

**Tracking IDs  
J**if several pages have the same GTM, GA, Meta Pixel, TikTok Pixel or affiliate tracking ID, this is one of the strongest clustering indicators.

Of course, caution is needed: sometimes the same third-party script can be generic and benign. But if the domain age, path structure, fake brand theme and form endpoints coincide, we have a very strong signal.

**Form endpoints.** Investment scams often have a lead collection mechanism. **A page form can send data to:**

```
/api/register
/lead
/send.php
/form.php
/api/v1/lead
/crm
```

If several different fake brand landers send data to the same endpoint or a similar backend pattern, we got jackpot.

![Cloaking techniques arranged around a content decision engine.](/assets/img/posts/substack/kai-fake-news-scamai-ir-cloaking/07.webp)

---

## Monetization.. Where is it?

It is important to understand that a WeRedirect-type campaign can have several participants. It is not necessarily the same person who creates a fake Facebook page, buys ads, writes a fake article, hosts the lander, manages the CRM and calls the victim.

**In most cases, the ecosystem is as follows:**

```
Traffic buyer / ad operator
  ↓
Cloaking / redirect operator
  ↓
Fake news / landing page template
  ↓
Affiliate / lead buyer
  ↓
Scam call center / fake broker
  ↓
Victim monetization
```

This is why affiliate parameters appear: ***subid, clickid, affid, utm\_campaign***. They help operators understand which traffic source brought the victim. In other words, even a scam has its own performance marketing *(you can't escape from corporate nonsense anywhere..)*. Because, of course, if you are already stealing money, then you want an attribution model.

How to say here... Marketing, only with the criminal code.

---

## MITRE ATT&CK mapping

I will emphasize here that this is not a perfect adaptation of ATT&CK, because MITRE is more oriented to the intrusion lifecycle, and here we are talking about the fraud/malvertising ecosystem. But the ATT&CK style brain helps me a bit in structuring the TTP.

#### Mapping is available

| Tactics | Technique / analogue | How it manifests |
| --- | --- | --- |
| Reconnaissance | Search Open Websites/Domains | Choice of mature, media, public figures |
| Resource Development | Acquire Infrastructure | Domains, hosting, redirect infrastructure |
| Resource Development | Establish Accounts | Fake Facebook accounts, advertising accounts |
| Resource Development | Develop Capabilities | Cloaking logic, lander templates |
| Initial Access / Delivery | An analogue of Phishing / Malvertising | Paid ads with fake news lure |
| Defense Evasion | Masquerading | Fake Delfi/LRT/Ignitis pages |
| Defense Evasion | An analogue of Impair Defenses | Bypassing scanners/ad review through cloaking |
| Analogue of Command and Control | Web Service / Redirector logic | Redirect chain and campaign routing |
| Collection | An analogue of Input Capture | Forms, lead collection |
| Impact | Financial Theft / Fraud | Fake investment scam monetization |

---

## Kill Chain

**Companies actually have quite similar kill chains, and they can be described somewhat similarly:**

```
1. Brand / narrative selection
   A well-known brand, news portal or public person is chosen.
2. Infrastructure setup
   Registering domains, preparing nameservers, SSL, hosting, CDN/proxy.
3. Content templating
   Sukuriamas fake article, fake comments, fake investment page, fake reviews.
4. Social distribution
   Facebook accounts are created or taken over, advertisements are launched.
5. Cloaking gate
   The server/JS decides what to display based on IP, UA, referer, cookies, locale.
6. Victim routing
   The right user is directed to a localized fake news/investment flow.
7. Lead capture
   The form collects name, phone, e-mail. mail, sometimes other financial data.
8. Monetization
   The victim is taken over by a fake broker / call center / scam operator.
9. Rotation
   Domains, ads, accounts and landers are changed when the blocks start.
10. Reuse
   The same template can be applied to another country, another age, another story.
```

![Fraud campaign chain from an advertisement to delivery of victim data to the operator.](/assets/img/posts/substack/kai-fake-news-scamai-ir-cloaking/08.webp)

---

## Risks

Now for the less cheerful part: the risks this creates for organisations.

**First**. Reputational. If a user sees your logo in a fake investment advertisement, it is not necessarily clear to him that you are not to blame. Brand impersonation always cuts through trust.

**Second.** Customer protection. Banks, energy companies, couriers, state institutions and the media often become "donors of trust" for this type of scam. A scammer doesn't have to build trust from scratch. He just steals your maturity.

**Third.** Incident response limits. Many organizations still think that if an incident does not occur in their infrastructure, it is "not our incident". Technically, maybe so. Reputationally no more.

**Fourth.** If your brand monitoring vendor checks URLs from one cloud region, it may not see cloaked content. Then you get a nice report that everything is clean, while users are filling out fake investment forms.

**Here is an unpleasant lesson.** Brand abuse monitoring without cloaking-aware collection is semi-blind.

![The same URL leads victims, researchers, and advertising platforms to different content.](/assets/img/posts/substack/kai-fake-news-scamai-ir-cloaking/09.webp)

---

## **Sources**

1. <span id="source-1"></span><span class="hx-source-entry"><a href="https://www.debunk.org/the-largest-disinformation-and-scam-attack-ever-recorded-in-lithuania-part-i">Debunk Part I</a> <span class="hx-source-type">External source</span></span>
2. <span id="source-2"></span><span class="hx-source-entry"><a href="https://www.debunk.org/weredirect-apt-the-large-scale-scam-attack-exposing-the-elaborate-tactics-of-online-scams-part-iii">Debunk Part III</a> <span class="hx-source-type">External source</span></span>
3. <span id="source-3"></span><span class="hx-source-entry"><a href="https://www.varonis.com/blog/1campaign">Hero</a> <span class="hx-source-type">External source</span></span>
4. <span id="source-4"></span><span class="hx-source-entry"><a href="https://nordvpn.com/blog/threat-protection-cloaking-techniques/">NordVPN</a> <span class="hx-source-type">External source</span></span>
5. <span id="source-5"></span><span class="hx-source-entry"><a href="https://www.zerofox.com/blog/phishing-kits-with-cloaked-techniques-the-next-generation-of-phishing-attacks/">ZeroFox</a> <span class="hx-source-type">External source</span></span>
6. <span id="source-6"></span><span class="hx-source-entry"><a href="https://www.humansecurity.com/learn/blog/digital-disguise-understanding-cloakings-role-in-malvertising/">HUMAN Security</a> <span class="hx-source-type">External source</span></span>
