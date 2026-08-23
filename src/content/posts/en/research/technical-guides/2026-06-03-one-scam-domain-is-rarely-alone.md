---
title: "One Scam Domain Is Rarely Alone: Using Pivoting to Trace Fraud Infrastructure"
card_title: "One Scam Domain Is Rarely Alone"
description: "A practical infrastructure-pivoting method for moving from one scam domain to related hosts, templates, and backend systems."
date: 2026-06-03T15:09:38.327Z
lang: en
translation_key: substack-vienas-scam-domenas-retai-buna-vienas
permalink: /en/research/one-scam-domain-is-rarely-alone/
author: deividas-lis
content_type: technical-guide
confidence: moderate
tlp: clear
categories: ["fraud-scams", "tradecraft"]
tags: ["pivoting", "fraud infrastructure", "RDAP", "DNS", "OSINT"]
featured: true
scope: "A methodology for passive infrastructure research and correlation of related objects."
limitations: "Shared hosting, certificates, or analytics IDs do not prove common control on their own; conclusions require multiple converging signals."
key_findings:
  - "The final URL often hides more valuable backend and redirect indicators."
  - "Favicon, DOM, TLS, DNS, and form-action overlaps help expand an investigation."
  - "Pivoting should produce an assessed relationship graph, not merely a longer IOC list."
image:
  path: /assets/img/posts/substack/vienas-scam-domenas-retai-buna-vienas/01.webp
  alt: "One Scam Domain Is Rarely Alone: Using Pivoting to Trace Fraud Infrastructure"
  thumbnail: /assets/img/posts/substack/vienas-scam-domenas-retai-buna-vienas/01-card.webp
  width: 1600
  height: 900
source_url: https://deivlis.substack.com/p/vienas-scam-domenas-retai-buna-vienas
---
![One scam URL pivots into related domains, IP addresses, certificates, and page artifacts.](/assets/img/posts/substack/vienas-scam-domenas-retai-buna-vienas/01.webp)

*I will talk mainly about fraud cases, how to catch more from one.. I would say more technical information. Although about frauds... everything can be used for brand impersonation and phishing infrastructure captures, a few nuances, but... I won't go into that for today.*

---

*We received a suspicious SMS link.  
We have verified the domain.  
We saw a fake login page.  
We've flagged it as phishing.  
We blocked it.  
We ticked the box.*


It looks like the job is already done.

The problem is that phishing infrastructure almost never stops at a single URL/Domain.

They often hide behind one scam link **redirection chain, tracking parameters, landing page, fake login form, credential collection endpoint, backup domains, Telegram bots, payment fraud pages, the same scam / phishing kits, the same hosting account, the same TLS artifacts, and a dozen more similar domains that have not yet been used.**

In other words, finding one scam domain does not mean the work is over. It is an **entry point into infrastructure analysis.**

APWG's summary of phishing activity in the first quarter of 2025 recorded more than one million monitored phishing attacks. Online payment and financial or banking targets together accounted for 30.9%. The same summary noted that criminals send millions of emails every day containing QR codes that lead to phishing pages or malware. This is not merely a "user awareness" problem. It is an infrastructure, operations, telemetry and threat-intelligence problem. (<https://www.apwg.org/trendsreports/>.)

According to the deposit, the pivoting of the fraud infrastructure starts from this point.

Not since *"is this URL bad"*?

And from *"How much more surface of the same fraud operation we have yet to see"*.

---

## What is infrastructure pivoting?

*(Well, we can call this case "What is scam infrastructure pivoting?")*

If, so to speak, Infrastructure pivoting is a CTI method, ***where one systematically moves from one known artifact to related objects until a broader view of the infrastructure emerges.***

There are plenty of possible starting points; here are a few:

#### Key points

| A Seed object | An example | First pivots |
| --- | --- | --- |
| Scam URL | hxxps://parcel-fee-check.example/pay | redirect chain, final URL, root domain |
| SMS link | shortened URL | unshorten, redirector, landing domain |
| Fake ad URL | promo-investment-example.tld | landing page, tracking support, form action |
| Phishing email link | secure-login-example.tld | URL path, domain, DNS, TLS |
| Fake payment page | payment-confirm-example.tld | form fields, payment endpoint, backend |
| Telegram bot link | t.me/example\_support\_bot | bot username, linked domains, campaign text |
| QR code destination | hidden URL | redirect chain, mobile landing page |
| Favicon hash | mmh3/hash | pages using the same visual asset |
| TLS certificate | SHA-256 fingerprint | related hosts and domains |
| HTML template | DOM / JS / CSS pattern | phishing kit reuse |

**A simple pivoting workflow looks something like this:**

```
URL
  -> unshorten / expand
  -> redirect chain
  -> final landing page
  -> root domain extraction
  -> RDAP / registration data
  -> DNS records
  -> passive DNS
  -> IP / ASN / hosting provider
  -> TLS certificate
  -> urlscan / screenshot / DOM
  -> HTML / JS / CSS / favicon
  -> form action endpoint
  -> related domains
  -> graph model
  -> cluster assessment
  -> detection / takedown / monitoring
```

The most important thing here is that the goal is not to collect as many IOCs as possible.

I will try to explain it more clearly, IOCs are like an inventory, and CTI begins when connections, timelines, confidence levels (low-mid-high) and some analytical explanation appear between those IOCs.

**Bad output would be:**

```
Found phishing / scam / brand impersonation URL. Blocked.
```

**A better (in my opinion) output would be something like:**

```
The observed URL is part of a candidate scam / phishing / brand impersonation infrastructure cluster.
We identified 23 related domains, 3 redirectors, 2 collection endpoints,
1 repeated favicon hash, 1 repeated phishing kit template and 2 hosting providers.
Confidence: medium-high.
```

In this place, it is not "simple blocking", but a little bit of intelligence gathering.

---

## Why doesn't one URL say anything?

Scam URLs can look like this (and this is quite common here, as I noticed in Lithuania):

```
hxxps://delivery-free-check.example/pay?id=839201
```

*(well, this URL is purely from a certain scam wave where I'm getting it now.. I have too much free time after work... but I won't reveal the full URL).*

On the surface, only one domain and one path to it are visible.

**But from a technical point of view, there may be several layers behind it:**

```
SMS link
  -> shortener
  -> redirector domain
  -> traffic filtering page
  -> geo / device check
  -> final landing page
  -> fake payment form
  -> card collection endpoint
  -> Telegram notification bot
```

**This means that several objects need to be distinguished in the research that is already underway:**

```
initial_url
expanded_url
redirect_urls
final_url
root_domain
subdomain
path
query parameters
landing_ip
asn
tls_certificate
page_title
favicon_hash
form_action
external_scripts
collection_backend
```

If already SOC / Analyst / IR or something else stops at **final\_url**.. we miss an important indicator, i.e. the actual backend.

**For example:**

```
The domain is visible in the browser:
hxxps://parcel-fee-check.example/pay

The form actually sends data to:
hxxps://api-collect-secure.example/submit

After submit, the user is redirected to:
hxxps://legitimate-courier.example/
```

**From the user side:** short payment process.

**From the CTI side, we have three pivot points:**

```
landing domain
collection endpoint
post-submit redirect
```

And each of them can connect the same scam campaign with other domains.

---

## First stage. URL Normalization

Well, before any pivoting, you need to fix the seed.

**URLs can come in various formats, such as:**

```
hxxps://parcel-fee[.]example/pay
https://parcel-fee.example/pay?session=abc123
parcel-fee.example/pay
HTTP://PARCEL-FEE.EXAMPLE/PAY
https://bit.ly/example
```

**The normalized object should look something like this:**

```
raw_input: hxxps://parcel-fee[.]example/pay?session=abc123
refanged_url: https://parcel-fee.example/pay?session=abc123
scheme: https
hostname: parcel-fee.example
root_domain: parcel-fee.example
path: /pay
query: session=abc123
is_shortener: false
```

**If the normalization is already bad, later the same domain will look like this in the graph:**

```
parcel-fee.example
http://parcel-fee.example
https://parcel-fee.example/
PARCEL-FEE.EXAMPLE
parcel-fee[.]example
```

And then the analyst will wonder why the correlation doesn't work.. *(been there done that, don't recommend it).* In other words.. it doesn't work because the data is dirty, like my rice cat running from the field after the rain *(I still don't understand where they are running in the woods and what kind of devils they are)*.

---

## The second stage. URL expansion and redirect chain

When looking at infrastructure, the initial URL or domain is often not the final destination.

**Especially if we are talking about SMS, QR, social media ads and fake marketplace scams, which often reflect:**

```
shortener
  -> redirector
  -> campaign tracking URL
  -> device / geo filter
  -> final scam landing page
```

**Redirection chain something like this:**

```
hxxps://short.example/a8sD9
  -> hxxps://track-campaign.example/click?id=839201
  -> hxxps://verify-device.example/check
  -> hxxps://parcel-fee-check.example/pay
```

You should understand that everyone **redirect** is a separate pivot object.

**We collect this:**

```
source_url
destination_url
status_code
location_header
timestamp
user_agent
final_url
redirect_count
```

**Elementary redirect mapper:**

```
import requests
from urllib.parse import urlparse

def map_redirects(url: str, timeout: int = 15):
    session = requests.Session()

    response = session.get(
        url,
        allow_redirects=True,
        timeout=timeout,
        headers={
            "User-Agent": "Mozilla/5.0 CTI-Research"
        }
    )

    chain = []

    for item in response.history:
        chain.append({
            "url": item.url,
            "status_code": item.status_code,
            "location": item.headers.get("Location", ""),
            "hostname": urlparse(item.url).hostname
        })

    chain.append({
        "url": response.url,
        "status_code": response.status_code,
        "location": "",
        "hostname": urlparse(response.url).hostname
    })

    return chain
```

Here I will throw in a little OPSEC about the map'er.. such a request is already an active touch to the infrastructure. In a real environment, we use an isolated VM, controlled egress, VPN / research network, or use public sandbox / URLscan results when we need them or can use them. URLscan itself allows you to get JSON, screenshot and DOM snapshot results after a scan UUID, and the Search API allows you to search for scans via ElasticSearch syntax (just fyi. <https://urlscan.io/docs/api/)>

---

## The third stage. RDAP and domain registration analyses

When we already have a domain, we go to registration data.

**How does registration data help? If it helps to answer briefly:**

```
When was the domain created?
When was it updated?
Koks registrar?
What nameservers?
Koks domain status?
Is there abuse contact?
Are multiple domains created in the same time window?
Are there duplicate nameservers?
Does the registration pattern look like a batch of domains?
```

**As for example:**

#### RDAP

| Domain | Created | Registrar | Nameserver | Pattern |
| --- | --- | --- | --- | --- |
| `parcel-fee-check.example` | 2026-05-01 | Registrar A | `ns1.host-x.example` | parcel + fee |
| `delivery-redelivery.example` | 2026-05-01 | Registrar A | `ns1.host-x.example` | delivery |
| `tax-refund-confirm.example` | 2026-05-02 | Registrar A | `ns1.host-x.example` | refund |
| `wallet-secure-check.example` | 2026-05-02 | Registrar A | `ns1.host-x.example` | wallet |
{:.hx-table-wide}

We have one registrar, but it is too weak a signal for full confirmation.

Same registrar + same nameserver + similar creation time + similar scam theme + same IP or TLS artifacts is a stronger signal.

**Weak signal:**

```
Same regisrar.
```

**The average would already be:**

```
Same registrar + same nameserver + created within 72 hours.
```

**And the strongest:**

```
Same registrar + same nameserver + same pDNS window + same favicon + same collection endpoint.
```

Here is a rather important part, because (for example, scam) operators often register domains in batches..i.e. today, one domain will be used, while the others are kept as a backup, and the third is used for A/B testing, the fourth has already been sent to the hosting abuse team and is being replaced with new ones.

---

## The fourth stage. DNS and passive DNS

Next, we move towards DNS and passive DNS, i.e. *"Where does the domain show now and where did it show before".*

**Active DNS:**

```
dig A parcel-fee-check.example
dig AAAA parcel-fee-check.example
dig NS parcel-fee-check.example
dig MX parcel-fee-check.example
dig TXT parcel-fee-check.example
```

When looking at infrastructure, it is important to check not only the A record.

MX can indicate email fraud or reply-chain scams.  
TXT may show verification artifacts.  
NS can show a common deploymnet pattern.  
CNAME can indicate hosting / platform layer.

**Passive DNS adds some time:**

```
domain -> historical IPs
IP -> historical domains
first_seen
last_seen
source
```

**pDNS should look like this:**

| Domain | IP | First seen | Last seen |
| --- | --- | --- | --- |
| parcel-fee-check[.]example | 203.0.113.10 | 2026-05-01 | 2026-05-05 |
| delivery-redelivery[.]example | 203.0.113.10 | 2026-05-01 | 2026-05-06 |
| tax-refund-confirm[.]example | 198.51.100.44 | 2026-05-02 | 2026-05-06 |
| wallet-secure-check[.]example | 198.51.100.44 | 2026-05-02 | 2026-05-07 |
{:.hx-table-wide}

Here is such a small disclaimer.. one IP does not mean a joint operation. If the IP belongs to a larger shared hosting or CDN, there will be hundreds of unrelated domains.

But if it already comes out..:

```
several scam-themed domains
same activity window
the same nameserver pattern
the same favicon
the same collection endpoint
```

then IP becomes a useful pivot point in the infrastructure.

**I will present the following principle** ***(well, whatever we call it, we won't spoil it)*****:** *"DNS connection without context is noise. DNS connection with temporal, visual, backend and template reuse context becomes strong intelligence"*.

---

## The fifth stage. IP, ASN and hosting context

IP analysis should not answer the question *"is the IP bad?"*, but must answer:

```
Is this IP part of the operation, shared hosting noise, CDN layer or short term scam deployment?
```

**We check:**

```
ASN
hosting provider
country
netblock
reverse DNS
open ports
HTTP title
TLS certificate
favicon
hosted domains
historical services
```

**Enrichment output (mini example):**

```
IP: 203.0.113.10
ASN: AS64500 Example Hosting
Ports: 80, 443
HTTP title: Secure Verification
TLS cert: 9f3b...aa1
Hosted suspicious domains: 7
First seen in cluster: 2026-05-01
Last seen in cluster: 2026-05-07
```

**Weak signal:**

```
same ASN
same country
same large cloud provider
same CDN
```

**Stronger signal:**

```
same small VPS IP
same HTTP title
same favicon hash
same TLS cert
same redirect behavior
same form action backend
same campaign timing
```

A very common mistake, apparently, is that *"All domains are in the same ASN, so they are related."*

These are simply popular and cheap VPS providers.

I personally formulate something similar *"ASN overlap is a weak contextual signal. It becomes more meaningful only when combined with stronger indicators such as shared TLS certificate, same backend endpoint, same page template, same redirect chain or same temporal activity window".*

---

## The sixth stage. TLS certificate pivoting

Personally, I consider TLS certificates one of the better pivoting "layers", but only when unique certs are not confused with shared CDN certs.

The Censys certificate host history endpoint returns host observations according to the certificate, so it is possible to see on which hosts a specific certificate fingerprint was observed. This is useful for threat hunting and timeline generation scenarios. (<https://docs.censys.com/reference/v3-threathunting-get-host-observations-with-certificate>)

**An example of a pivot:**

```
parcel-fee-check.example
  -> TLS cert fingerprint: 9f3b...aa1
  -> observed hosts:
      203.0.113.10
      198.51.100.44
      192.0.2.55
  -> related domains:
      delivery-redelivery.example
      tax-refund-confirm.example
      wallet-secure-check.example
```

**Strong TLS signal:**

```
certificate is not a large CDN wildcard cert
the certificate is visible on a limited set of hosts
hosts have associated scam domains
activity time coincides
the same cert appears on several scam landing pages
```

**Weak signal:**

```
Cloudflare / Akamai / Fastly / Google / Microsoft shared cert
wildcard cert on a big platform
the certificate is used on thousands of unrelated hosts
```

**Edge model that we got to see:**

```
src,dst,kind,weight,first_seen,last_seen,source
203.0.113.10,cert:9f3b-aa1,presents_certificate,0.75,2026-05-01,2026-05-06,censys
198.51.100.44,cert:9f3b-aa1,presents_certificate,0.75,2026-05-02,2026-05-07,censys
```

Well, the important thing here is not that there is a cert connection, but how unique it is.

---

## Seventh stage. URLscan, DOM, requests and screenshots

URLscan is one of the most practical tools for analyzing scam infrastructure, as it allows you to study not only the domain, but also the behavior of the page in the browser.

**My most used ones and I consider them to be the most useful artifacts:**

```
submitted_url
final_url
redirect chain
page title
IP
ASN
TLS info
requests
DOM snapshot
screenshot
favicon
loaded scripts
external assets
form actions
cookies
response hashes
```

Going back to URLscan, this:

- Result API allows to get scan result, screenshot and DOM snapshot according to UUID.
- The Search API allows searching for scans using ElasticSearch strings and syntax and returns high-level metadata and a link to the full scan result.

**Example:**

```
parcel-fee-check[.]example
  -> page title: Payment Confirmation
  -> loads JS: /static/app.js
  -> loads CSS: /assets/main.css
  -> favicon hash: abcd1234
  -> form action: hxxps://api-collect-secure[.]example/submit
  -> final redirect: hxxps://legitimate-courier[.]example/
```

Well, here are the questions that the analyst/researcher must ask:

```
Is the same favicon repeated on other domains?
Is the same JS path repeated?
Is the DOM structure similar?
Do form field names repeat?
Does the form send data to the same backend?
Is the user redirected to the legit page after submit?
Do page title and HTML comments show the same thing?
```

"Form action" is a very good pivot point, because the user can see one domain, but the credential or payment data can be sent to a completely different backend.

```
<form method="POST" action="https://api-collect-secure[.]example/submit">
  <input name="card_number">
  <input name="expiry">
  <input name="cvv">
</form>
```

If already these different scam domains send the form to the same backend, we have a strong connection... even if 15 domains:

```
have different IPs
uses different registrars
have different TLS certs
uses different TLDs
```

Beeeett.. they have a common form action backend, which might be stronger than DNS matching.

---

## Eighth stage: HTML, JS, favicon and screenshot similarity

Not all connections are visible through DNS or TLS.

Sometimes scam domains don't have a common IP, they don't have a common registrar, they don't have the same TLS cert. But they use the same scam on another.

Then you need to look inside the page:

```
HTML structure
DOM tree
CSS class names
JavaScript paths
form field names
hidden inputs
favicon hash
image asset names
logo filenames
comments in source code
page title
screenshot similarity
```

The dnstwist documentation states that the tool can generate domain permutations, detect Unicode IDN variants, use dictionary permutations, export CSV/JSON, check rogue MX, as well as perform HTML similarity through fuzzy hashes and screenshot visual similarity through perceptual hashes. (https://github.com/elceef/dnstwist)

**Sample pHash / HTML similarity use case:**

```
domain_a screenshot pHash: ffeedd001122
domain_b screenshot pHash: ffeedd001123
visual similarity: high

domain_a HTML fuzzy hash similarity to domain_b: 91%
```

This does not indicate infrastructure-level reuse, but **template / kit reuse**.

**Scam operators often overuse:**

```
the same login template
the same payment form template
the same JS validation script
the same Telegram bot notification code
the same CSS framework
the same fake loader animation
the same post-submit redirect
```

This is very valuable in scam analysis, because the operator can change domains and IPs, but is too lazy to change others. Well.. and reusable code is often used by scammers like normal devs, only their backlog is a little more criminal.

---

## The ninth stage. Analysis of phishing / scam kit signs

**Phishing kits and scam kits have repetitive artifacts, so look for:**

```
form action URLs
API endpoint paths
Telegram bot token pattern
hardcoded chat IDs
JavaScript validation logic
input field names
page flow
anti-bot checks
geo-fencing
mobile-only logic
base64 encoded config
obfuscated JS
asset directory structure
language strings
debug comments
```

**As for example:**

```
/assets/js/validator.js
/api/submit.php
/telegram/send.php
/check.php
/step1
/step2
/payment
/confirm
/loading
```

**Field form pattern:**

```
name="card"
name="exp"
name="cvv"
name="phone"
name="sms_code"
name="otp"
```

**Scam flow pattern:**

```
1. landing page
2. fake identity verification
3. card collection
4. fake 3DS / OTP
5. loading screen
6. redirect to legitimate website
```

---

## The tenth stage. Graph model

**For this second** ***(oil)*** **we have the IOC list as follows:**

```
parcel-fee-check[.]example
delivery-redelivery[.]example
203.0.113.10
198.51.100.44
cert:9f3b-aa1
favicon:abcd1234
api-collect-secure[.]example
```

But here.. not intelligence, just *(as I mentioned before)* list of items.

**And intelligence begins when we start showing connections:**

```
domain:parcel-fee-check[.]example
  -> redirects_from ->  short.example/a8sD9
  -> resolves_to ->  ip:203.0.113.10
  -> presents_cert ->  cert:9f3b-aa1
  -> has_favicon ->  favicon:abcd1234
  -> form_posts_to ->  domain:api-collect-secure.example
  -> has_template ->  kit:parcel-payment-v1

domain:delivery-redelivery[.]example
  -> resolves_to ->  ip:203.0.113.10
  -> has_favicon ->  favicon:abcd1234
  -> form_posts_to ->  domain:api-collect-secure.example
  -> has_template ->  kit:parcel-payment-v1

domain:tax-refund-confirm[.]example
  -> resolves_to ->  ip:198.51.100.44
  -> has_similar_screenshot ->  phash:ffeedd001122
  -> form_posts_to ->  domain:api-collect-secure[.]example
```

**Edge case:**

```
src,dst,kind,weight,first_seen,last_seen,source
parcel-fee-check[.]example,203.0.113.10,resolves_to,0.65,2026-05-01,2026-05-05,passive_dns
delivery-redelivery[.]example,203.0.113.10,resolves_to,0.65,2026-05-01,2026-05-06,passive_dns
203.0.113.10,cert:9f3b-aa1,presents_certificate,0.75,2026-05-01,2026-05-06,censys
parcel-fee-check[.]example,favicon:abcd1234,has_favicon,0.80,2026-05-01,2026-05-01,urlscan
delivery-redelivery[.]example,favicon:abcd1234,has_favicon,0.80,2026-05-01,2026-05-01,urlscan
parcel-fee-check[.]example,api-collect-secure.example,form_posts_to,0.95,2026-05-01,2026-05-01,urlscan
delivery-redelivery[.]example,api-collect-secure.example,form_posts_to,0.95,2026-05-01,2026-05-01,urlscan
parcel-fee-check[.]example,kit:parcel-payment-v1,uses_template,0.90,2026-05-01,2026-05-01,html_similarity
```

Well, in reality, everything can be moved to OpenCTI or MISP, I personally like MISP more because of automatic correlation, event graph, warning list... and REST API and PyMISP.

---

## The eleventh stage. Connection weights and confidence

Not all relationships are the same.

The same TLD is not the same as the form action backend.  
The same registrar is not the same as a phishing / scam kit.  
The same ASN is not the same as favicon + DOM + backend endpoint.

**Here is the minimal scoring model, in reality it can change for each case, but I have the following for several projects today:**

#### Scoring

| Signal | Weight | FP risk | Comment |
| --- | --- | --- | --- |
| Same form action backend | 0.95 | low | very strong operational reuse |
| Same scam kit / HTML template | 0.90 | low / medium | strong capability signal |
| Same Telegram bot/chat ID | 0.90 | low | very strong backend connection |
| Same favicon hash | 0.80 | medium | good asset reuse signal |
| High screenshot similarity | 0.80 | medium | strong visual template reuse |
| Same TLS certificate fingerprint | 0.75 | depends on certificate type | strong if not a CDN |
| Same redirect chain | 0.75 | medium | good workflow reuse |
| Same small-VPS IP | 0.65 | medium | useful with other signals |
| Same nameserver pattern | 0.55 | medium | deployment signal |
| Same registrar | 0.30 | high | weak signal |
| Same TLD | 0.20 | very high | almost noise |
| Only a scam keyword in the domain | 0.15 | very high | further evidence required |
{:.hx-table-wide}

**A simple formula:**

```
cluster_score =
  Σ(edge_weight × source_reliability × temporal_overlap × evidence_quality)
  - false_positive_penalty
```

**Well (I like python) python:**

```
BASE_WEIGHTS = {
    "same_form_action": 0.95,
    "same_telegram_bot": 0.90,
    "same_html_template": 0.90,
    "same_favicon": 0.80,
    "same_screenshot_phash": 0.80,
    "same_tls_cert": 0.75,
    "same_redirect_chain": 0.75,
    "same_small_vps_ip": 0.65,
    "same_nameserver": 0.55,
    "same_registrar": 0.30,
    "same_tld": 0.20,
    "keyword_overlap": 0.15,
}

SOURCE_RELIABILITY = {
    "internal_telemetry": 1.00,
    "urlscan": 0.85,
    "censys": 0.85,
    "passive_dns": 0.80,
    "rdap": 0.75,
    "phistank": 0.70,
    "manual_osint": 0.60,
    "unknown": 0.40,
}

def score_edge(kind, source, temporal_overlap=1.0, evidence_quality=1.0, fp_penalty=0.0):
    base = BASE_WEIGHTS.get(kind, 0.20)
    reliability = SOURCE_RELIABILITY.get(source, SOURCE_RELIABILITY["unknown"])
    score = (base * reliability * temporal_overlap * evidence_quality) - fp_penalty
    return max(round(score, 4), 0.0)
```

In this place.. the math is not perfect, it is impossible to catch perfectly scam domains with 0.01% or lower/higher in my opinion.

**The point here is analytical discipline, and every graph edge must have:**

```
relationship_type
source
first_seen
last_seen
confidence
false_positive_notes
analyst_comment
```

If there are only lines in the graph without context, then congratulations, it's a nice drawing. It's fun, but it's of zero use.

---

## Twelfth stage. Phishing feeds and verification sources

In scam analysis, feeds help, but they should not become the sole basis of the decision.

The PhishTank API allows you to check URLs via HTTP POST and get a response about the status of the URL in their database. The API can return whether the URL is in the database, whether it is verified or valid, as well as the phish detail page and timestamps, although I rarely find scams in Lithuania, but at least this kind of information. (https://phishtank.org/api\_info.php)

**As additional context is useful:**

```
Is the URL already known?
Ar jis verified?
When submitted?
Are you still valid?
```

**But here you need to have limits:**

```
Feed coverage is not the entire Internet.
New scam domains may not be in feeds yet.
Some feeds are delayed.
Some domains may be false positive.
Feed hit alone is not infrastructure analysis.
```

Better use of feeds is *"feed\_hit = supporting evidence"*, and not *"feed\_hit = final intelligence product".* In other words.. feed says that something was noticed, and pivoting tells what it is related to.

---

## Thirteenth stage. Takedown and abuse output

The result of Scam Pivoting must already be used, like this:

```
blocklist
SIEM hunting query
Sigma rule
proxy rule
DNS sinkhole rule
MISP event
abuse report
registrar takedown request
hosting provider report
brand protection escalation
law enforcement package
customer warning
```

I've seen abuse reports like this"*"Hello, this domain is scam. Please remove it"* *(damn reddit what are you doing)*.

**I would say the best abuse report is this** ***(of course, not all providers accept it as an abuse report, because they still need some unexplained things, or people just sit there with abuse reports that don't get caught anywhere.. but anyway..):***

```
Subject: Abuse report: scam infrastructure hosted on 203.0.113.10

We are reporting active scam infrastructure hosted on your network.

Observed domains:
- parcel-fee-check[.]example
- delivery-redelivery[.]example
- tax-refund-confirm[.]example

Evidence:
- active payment-themed landing pages
- HTTP POST forms collecting sensitive payment-like data
- shared collection endpoint: api-collect-secure[.]example
- shared favicon hash across multiple domains
- shared hosting IP: 203.0.113.10
- first observed: 2026-05-01
- last observed: 2026-05-06

Requested action:
- investigate and suspend abusive content
- preserve logs according to your policy
- confirm receipt of this report
```

---

## Fourteenth stage. False positive risk.

Not every domain with the word "*payment* is a scam.  
Not every newly registered domain is bad.  
Not every shared hosting IP shows a shared transaction.  
Not every similar page is phishing.

**Legit Scripts:**

```
marketing campaign
payment service provider landing page
affiliate tracking
temporary campaign domain
customer support portal
A/B testing domain
CDN-hosted landing page
legitimate redirector
domain parking
```

This is where you need to separate the levels..

**Weak:**

```
domain contains payment keyword
```

**Average:**

```
newly registered + payment keyword + suspicious redirect chain
```

**Strong:**

```
newly registered + scam landing page + same form action backend + same favicon + same HTML template + same active window
```

**The very best:**

```
internal user telemetry confirms access
+ page collected sensitive data
+ backend reused across multiple domains
+ infrastructure observed in public phishing reports
```

**And a genuinely useful CTI conclusion from pivoting needs an explicit confidence assessment:**

```
Low confidence:
- weak lexical similarity only
- no active page
- no infrastructure overlap

Medium confidence:
- suspicious page active
- domain recently registered
- some infrastructure overlap

High confidence:
- active scam form
- shared collection endpoint
- repeated template
- multiple related domains
- internal or external sightings
```

---

## My template, you can take it for sub

```
Title:
Candidate Scam Infrastructure Cluster – Parcel Redelivery / Payment Fraud Theme

Executive Summary:
We identified a candidate scam infrastructure cluster built around parcel redelivery and fake payment confirmation themes. The cluster includes 18 related domains, 3 redirector domains, 2 active VPS IPs, 1 repeated form collection backend, 1 repeated favicon hash and multiple pages using highly similar HTML templates.

Scope:
Analysis is based on passive DNS, RDAP, urlscan results, TLS certificate pivoting, screenshot similarity and controlled sandbox review.

Seed:
hxxps://parcel-fee-check[.]example/pay?id=839201

Pivot Path:
seed URL
-> redirect chain
-> final landing domain
-> RDAP
-> pDNS
-> IP/ASN
-> TLS cert
-> urlscan screenshot/DOM
-> form action
-> related domains
-> graph cluster

Infrastructure:
- 18 domains
- 3 redirectors
- 2 VPS IPs
- 1 collection endpoint
- 1 repeated favicon
- 2 repeated page templates

Evidence:
1. 11 domains registered within a 72-hour window.
2. 9 domains resolved to the same two VPS IPs.
3. 7 domains shared the same favicon hash.
4. 6 domains submitted forms to the same backend.
5. 5 domains used highly similar HTML/JS structure.
6. 3 domains shared the same redirector pattern.

Assessment:
We assess with medium-high confidence that the observed infrastructure represents a coordinated scam infrastructure cluster rather than isolated phishing URLs.

Confidence:
Medium-high for infrastructure clustering.
Low for operator attribution.
```

---

## OPSEC and boundaries

Well... pivoting must remain within defensive limits.

**Appropriate actions:**

```
passive DNS
RDAP lookup
urlscan analysis
analysis of your DNS/proxy/email telemetry
sandboxed page rendering
screenshot comparison
HTML/DOM parsing
MISP / TIP koreliacija
abuse reporting
takedown coordination
```

**What not to do without permission:**

```
active scanning against third-party systems
connection attempts
filling out forms with real data
credential collection testavimo
aggressive enumeration
neautorizuoto exploitation
```

I'll just put a few things here about this.. Who am I to explain to you what to do and what not to do.. if it's a 100% scam domain.. guess how many Telegram / Discord bots I've already posted.

The reading estimate is already at 17 minutes. There is much more that could be investigated—and written—but knowing when to stop is also part of the work.
