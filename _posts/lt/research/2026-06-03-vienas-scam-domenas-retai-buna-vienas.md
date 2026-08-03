---
title: "Vienas scam domenas retai būna vienas. Kaip PIVOTING padeda atsekti sukčiavimo infrastruktūrą"
card_title: "Vienas scam domenas retai būna vienas"
description: "Praktinis infrastruktūros pivoting metodas, padedantis nuo vieno sukčiavimo domeno pereiti prie susijusių hostų, šablonų ir backend sistemų."
date: 2026-06-03T15:09:38.327Z
lang: lt
translation_key: substack-vienas-scam-domenas-retai-buna-vienas
permalink: /lt/tyrimai/vienas-scam-domenas-retai-buna-vienas/
redirect_from:
  - /lt/research/vienas-scam-domenas-retai-buna-vienas/
author: deividas-lis
content_type: technical-guide
confidence: moderate
tlp: clear
categories: ["fraud-scams", "tradecraft"]
tags: ["pivoting", "sukčiavimo infrastruktūra", "RDAP", "DNS", "OSINT"]
featured: true
scope: "Pasyvaus infrastruktūros tyrimo ir susijusių objektų koreliavimo metodika."
limitations: "Bendras hostingas, sertifikatai ar analitikos ID savaime neįrodo bendro valdymo; išvadoms reikia kelių sutampančių signalų."
key_findings:
  - "Galutinis URL dažnai slepia vertingesnius backend ir peradresavimo indikatorius."
  - "Favicon, DOM, TLS, DNS ir form action sutapimai padeda plėsti tyrimą."
  - "Pivoting rezultatas turi būti ryšių bei pasitikėjimo vertinimas, ne vien IOC sąrašas."
image:
  path: /assets/img/posts/substack/vienas-scam-domenas-retai-buna-vienas/01.webp
  alt: "Vienas scam domenas retai būna vienas. Kaip PIVOTING padeda atsekti sukčiavimo infrastruktūrą"
  thumbnail: /assets/img/posts/substack/vienas-scam-domenas-retai-buna-vienas/01-card.webp
source_url: https://deivlis.substack.com/p/vienas-scam-domenas-retai-buna-vienas
---
![Vienas sukčiavimo URL išplečiamas į susijusius domenus, IP adresus, sertifikatus ir puslapio artefaktus.](/assets/img/posts/substack/vienas-scam-domenas-retai-buna-vienas/01.webp)

*Kalbėsiu pagrinde apie sukčiavimo atvėjus, kaip iš vieno sugaut daugiau.. techninė sakyčiau daugiau rašliava. Nors ir apie sukčiavimus.. viską galima panaudot į brand impersonation ir phishing infrastruktūros gaudymus, keli niuansai, bet.. nesigilinsiu šiai dienai į tai.*

---

*Gavome įtartiną SMS linką.  
Patikrinome domeną.  
Pamatėme fake login puslapį.  
Pažymėjome kaip phishing.  
Užblokavome.  
Užsidėjome varnelę.*


Atrodo darbas jau kaip ir padarytas..

Problema tame, kad sukčiavimo / phishing infrastruktūra beveik niekada nepasibaigia ties vienu URL / Domenu.

Už vieno scam linko dažnai slepiasi **redirection chain, tracking parametrai, landing page, fake login forma, credential collection endpoint’as, backup domenai, Telegram bot’ai, payment fraud puslapiai, tie patys scam / phishing kit’ai, tas pats hosting account’as, tie patys TLS artefaktai, ir dar keliolika panašių domenų, kurie dar nebuvo panaudoti.**

Kitaip tariant, vienas scam domenas nereiškia, kad jau pabaiga. Sakyčiau tai yra **įėjimo taškas į infrastruktūros analizę.**

APWG savo 2025 m. pirmo ketvirčio phishing activity report summary nurodė daugiau nei 1 mln. stebėtų phishing atakų per ketvirtį, o online payment ir financial /banking sektoriai kartu sudarė 30,9%. Toje pačioje APWG santraukoje taip pat pažymėta, kad nusikaltėliai kasdien siunčia milijonus laiškų su QR kodais, vedančiais į phishing puslapius ar malware. Tai nėra tik “user awareness” problema, o sakyčiau yra infrastruktūros, operacijų, telemetrijos ir threat intelligence problema.(https://www.apwg.org/trendsreports/)

Pagal įdėją nuo šito taško prasideda sukčiavimų infrastruktūros pivoting.

Ne nuo *“ar šitas URL blogas”*?

O nuo *“Kiek dar tos pačios sukčiavimo operacijos paviršiaus mes dar nematome”*.

---

## Kas yra infrastructure pivoting?

*(Na galim pavadint šiuo atvėju “Kas yra scam infrastructure pivoting?”)*

Jei taip gražiai kalbant tai Infrastructure pivoting yra CTI metodas, ***kai nuo vieno žinomo artefakto sistemingai judama prie susijusių objektų, kol susiformuoja platesnis infrastruktūros vaizdas.***

Pradiniais taškais gali būt įvairūs dalykai, čia paminėsiu kelis:

#### Pagrindiniai taškai

| Seed objektas | Pavyzdys | Pirmi pivotai |
| --- | --- | --- |
| Scam URL | hxxps://parcel-fee-check.example/pay | redirect chain, final URL, root domain |
| SMS linkas | trumpintas URL | unshorten, redirector, landing domain |
| Fake ad URL | promo-investment-example.tld | landing page, tracking params, form action |
| Phishing email linkas | secure-login-example.tld | URL path, domain, DNS, TLS |
| Fake payment page | payment-confirm-example.tld | form fields, payment endpoint, backend |
| Telegram bot linkas | t.me/example\_support\_bot | bot username, linked domains, campaign text |
| QR code destination | hidden URL | redirect chain, mobile landing page |
| Favicon hash | mmh3/hash | pages using same visual asset |
| TLS certificate | SHA-256 fingerprint | related hosts and domains |
| HTML template | DOM / JS / CSS pattern | phishing kit reuse |

**Paprastas pivoting workflow atrodo maždaug taip:**

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

Šitoje vietoje svarbiausia tai, kad tikslas nėra surinkt kuo daugiau IOCs.

Kažkaip aiškiau pasistengsiu paaiškint, IOCs yra kaip inventorius, o CTI prasideda tada, kai tarp tų IOCs atsiranda ryšiai, laiko juosta, pasitikėjimo lygiai (low-mid-high) ir šioks toks analitinis paaiškinimas.

**Blogas output būtų:**

```
Found phishing / scam / brand impersonation URL. Blocked.
```

**Geresnis (mano manymu) output būtų kažkas panašaus į:**

```
The observed URL is part of a candidate scam / phishing / brand impersonation infrastructure cluster.
We identified 23 related domains, 3 redirectors, 2 collection endpoints,
1 repeated favicon hash, 1 repeated phishing kit template and 2 hosting providers.
Confidence: medium-high.
```

Šitoje vietoje jau atsiranda ne “paprastas blokavimas”, o šioks toks intelligence gathering.

---

## Kodėl vienas URL nieko nepasako?

Scam’ų URL gali atrodyt taip (ir jo čia gan dažnas atvėjis ką pastebėjau Lietuvoje):

```
hxxps://delivery-free-check.example/pay?id=839201
```

*(na taip šitas URL grynai iš tam tikros sukčiavimo bangos kur dabar gaudau.. per daug laisvo laiko turiu po darbo… tik pilno URL neatskleisiu).*

Paviršiuje matosi tik vienas domenas ir vienas path jam.

**Bet pažiūrint iš techninės pusės už jo gali būt keli sluoksniai:**

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

**Taiiiii reiškia, kad jau atliekamam tyrime reikia atskirti kelis objektus:**

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

Jei jau SOC / Analitikas / IR ar dar kažkas sustoja ties **final\_url**.. praleidžiam svarbų indiktoarių t.y. tikrasis backend’as.

**Pavyzdžiui:**

```
Naršyklėje matomas domenas:
hxxps://parcel-fee-check.example/pay

Forma realiai siunčia duomenis į:
hxxps://api-collect-secure.example/submit

Po submit naudotojas nukreipiamas į:
hxxps://legitimate-courier.example/
```

**Iš vartotojo pusės:** trumpas apmokėjimo procesas.

**Iš CTI pusės turim tris pivot taškus:**

```
landing domain
collection endpoint
post-submit redirect
```

Ir kiekvienas iš jų gali jungt tą patį scam campaign su kitais domenais.

---

## Pirmas etapas. URL Normalizacija

Na prieš bet kokį pivoting reikia sutvarkyt seed’ą.

**URL’ai gali ateit su įvairais formatais, pvz:**

```
hxxps://parcel-fee[.]example/pay
https://parcel-fee.example/pay?session=abc123
parcel-fee.example/pay
HTTP://PARCEL-FEE.EXAMPLE/PAY
https://bit.ly/example
```

**Normalizuotas objektas turėtų atrodyt kažkaip panašiai į šitą:**

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

**Jei jau normalizacija bloga, vėliau tas pats domenas grafe atrodys va taip:**

```
parcel-fee.example
http://parcel-fee.example
https://parcel-fee.example/
PARCEL-FEE.EXAMPLE
parcel-fee[.]example
```

Ir tada analitikas stebėsis, kodėl koreliacija neveikia.. *(been there done that, don’t recommend it).* Kitaip tariant.. neveikia, nes duomenys yra purvini, kaip mano ryžas katinas atbėgęs iš lauko po lietaus *(iki šiol nesuprantu kur miškuose laksto ir po kokius velnius)*.

---

## Antras etapas. URL expansion ir redirect chain

Nagrinėjant infrastruktūra pradinis URL ar domenas dažnai nėra final destination.

**Ypač jei kalbam apie SMS, QR, social media ads ir fake marketplace scam’us, o juose dažnai atsispindi:**

```
shortener
  -> redirector
  -> campaign tracking URL
  -> device / geo filter
  -> final scam landing page
```

**Redirection chain kažkaip panašiai:**

```
hxxps://short.example/a8sD9
  -> hxxps://track-campaign.example/click?id=839201
  -> hxxps://verify-device.example/check
  -> hxxps://parcel-fee-check.example/pay
```

Reiktų suprast, kad kiekvienas **redirect** yra atskiras pivot objektas.

**Tai renkam:**

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

**Elementarus redirect mapper’is:**

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

Čia truputi įmesiu OPSEC dėl map’erio.. toks request yra aktyvus jau prisilietimas prie infrastruktūros. Realioje aplinkoje naudojam izoliuota VM, controlled egress, VPN / research network’ą, arba naudojam public sandbox / URLscan rezultatus, kai jų reikia arba juos galim panaudot. Pats URLscan leidžia po scan UUID gaut rezultatus JSON, screenshot ir DOM snapshot, o Search API leidžia ieškot scan’ų per ElasticSearch sintakse (just fyi. <https://urlscan.io/docs/api/)>

---

## Trečias etapas. RDAP ir domenų registracijos analizės

Kai turim jau domeną, keliaujam į registration data.

**Kuo padeda registration data? Jei trumpai tai padeda atsakyt:**

```
Kada domenas sukurtas?
Kada atnaujintas?
Koks registrar?
Kokie nameserveriai?
Koks domain status?
Ar yra abuse contact?
Ar keli domenai sukurti tame pačiame laiko lange?
Ar kartojasi nameserveriai?
Ar registracijos pattern atrodo kaip domenų partija?
```

**Kaip pavyzdžiui:**

#### RDAP

| Domain | Created | Registrar | Nameserver | Pattern |
| --- | --- | --- | --- | --- |
| `parcel-fee-check.example` | 2026-05-01 | Registrar A | `ns1.host-x.example` | parcel + fee |
| `delivery-redelivery.example` | 2026-05-01 | Registrar A | `ns1.host-x.example` | delivery |
| `tax-refund-confirm.example` | 2026-05-02 | Registrar A | `ns1.host-x.example` | refund |
| `wallet-secure-check.example` | 2026-05-02 | Registrar A | `ns1.host-x.example` | wallet |
{:.hx-table-wide}

Turim vieną registrar, bet pilnam patvirtinimui, tai yra per silpnas signalas.

Tas pats registrar + tas pats nameserver + panašus sukūrimo laikas + panaši scam tematika + tie patys IP arba TLS artefaktai yra stipresnis signalas.

**Silpnas signalas:**

```
Same regisrar.
```

**Vidutinis jau būtų:**

```
Same registrar + same nameserver + created within 72 hours.
```

**O pats stipriausias:**

```
Same registrar + same nameserver + same pDNS window + same favicon + same collection endpoint.
```

Čia yra gan svarbi dalis, nes (paimkim scam) operatoriai dažnai registruoja domenus partijimos..t.y. šiandien vienas domenas bus panaudotas, o kiti laikomi kaip backup’as, o treti naudojami A/B testing, ketvirti jau nusiųsti į hosting’o abuse komandas ir pakeičiami naujais.

---

## Ketvirtas etapas. DNS ir passive DNS

Toliau keliaujama link DNS ir passive DNS t.y. *“Kur domenas rodo dabar ir kur rodė ankščiau”.*

**Aktyvus DNS:**

```
dig A parcel-fee-check.example
dig AAAA parcel-fee-check.example
dig NS parcel-fee-check.example
dig MX parcel-fee-check.example
dig TXT parcel-fee-check.example
```

Žiūrint infrastruktūrą svarbu tikrint ne tik A record.

MX gali rodyt email fraud arba reply-chain scam’us.  
TXT gali rodyt verification artefaktus.  
NS gali rodyt bendrą deploymnet pattern.  
CNAME gali rodyt hosting / platform layer.

**Passive DNS prideda truputi laiko:**

```
domain -> historical IPs
IP -> historical domains
first_seen
last_seen
source
```

**pDNS turėtų atrodyt taip:**

| Domain | IP | First seen | Last seen |
| --- | --- | --- | --- |
| parcel-fee-check[.]example | 203.0.113.10 | 2026-05-01 | 2026-05-05 |
| delivery-redelivery[.]example | 203.0.113.10 | 2026-05-01 | 2026-05-06 |
| tax-refund-confirm[.]example | 198.51.100.44 | 2026-05-02 | 2026-05-06 |
| wallet-secure-check[.]example | 198.51.100.44 | 2026-05-02 | 2026-05-07 |
{:.hx-table-wide}

Čia toks mažas disclaimer.. vienas IP dar nereiškia, kad bendra operacija. Jeigu IP priklauso didesniam shared hosting ar CDN, ten bus šimtai nesusijusių domenų.

Bet jei jau išlenda..:

```
kelis scam tematikos domenus
tą patį aktyvumo langą
tą patį nameserver pattern
tą patį favicon
tą patį collection endpoint
```

tada IP tampa naudingu pivot tašku infrastruktūroje.

**Pateiksiu tokį principą** ***(na kaip pavadinsim taip nepagadinsim)*****:** *“DNS ryšys be konteksto yra triukšmas. DNS ryšys su laiko, vizualinio, backend ir template reuse kontekstu tampa stipriu intelligence”*.

---

## Penktas etapas. IP, ASN ir hosting context

IP analizė turi atsakyt ne į klausimą *“ar IP blogas?”*, bet turi atsakyt į:

```
Ar šitas IP yra operacijos dalis, shared hosting triukšmas, CDN sluoksnis ar trumpalaikis scam deployment?
```

**Tikrinam:**

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

**Enrichment output’as (mini pavyzdys):**

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

**Silpnas signalas:**

```
same ASN
same country
same large cloud provider
same CDN
```

**Stipresnis signalas:**

```
same small VPS IP
same HTTP title
same favicon hash
same TLS cert
same redirect behavior
same form action backend
same campaign timing
```

Labaiii dažna klaida ką tenka matytm, tai kad *“Visi domenai yra tame pačiame ASN, vadinasi jie susiję”.*

Tai tiesiog populiarus ir pigus VPS providers.

As asmeniškai formuluoju kažkaip panašiai *“ASN overlap is a weak contextual signal. It becomes more meaningful only when combined with stronger indicators such as shared TLS certificate, same backend endpoint, same page template, same redirect chain or same temporal activity window”.*

---

## Šeštas etapas. TLS certificate pivoting

Asmeniškai laikau TLS sertifikatus vienu iš geresnių pivoting “sluoksnių”, bet tik tada kai nėra painiojami unikalūs cert’ai su shared CDN certais.

Censys certificate host history endpointas grąžina host observations pagal sertifikatą, todėl galima matyti, ant kokių hostų konkretus certificate fingerprint buvo stebėtas. Tai naudinga threat hunting ir timeline generation scenarijams. (https://docs.censys.com/reference/v3-threathunting-get-host-observations-with-certificate)

**Pavyzdys pivot’o:**

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

**Stiprus TLS signalas:**

```
sertifikatas nėra didelio CDN wildcard cert
sertifikatas matomas ribotame hostų rinkinyje
hostai turi susijusius scam domenus
aktyvumo laikas sutampa
tas pats cert pasirodo keliuose scam landing pages
```

**Silpnokas signalas:**

```
Cloudflare / Akamai / Fastly / Google / Microsoft shared cert
wildcard cert ant didelės platformos
sertifikatas naudojamas tūkstančiuose nesusijusių hostų
```

**Edge model, kurį teko matyt:**

```
src,dst,kind,weight,first_seen,last_seen,source
203.0.113.10,cert:9f3b-aa1,presents_certificate,0.75,2026-05-01,2026-05-06,censys
198.51.100.44,cert:9f3b-aa1,presents_certificate,0.75,2026-05-02,2026-05-07,censys
```

Na čia svarbu, ne tai, kad egzistuoja cert ryšys, o ant kiek jis yra unikalus.

---

## Septintas etapas. URLscan, DOM, requests ir screenshot

URLscan yra vienas praktiškiausių įrankių scam infrastruktūros analizei, nes leidžia tirti ne tik domeną, bet ir puslapio elgesį naršyklėje.

**Mano daugiausiai naudojami, ir laikau juos naudingiausiais artifaktais:**

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

Grįžtant prie URLscan, tai:

- Result API leidžia gaut scan rezultatą, screenshot ir DOM snapshot pagal UUID.
- Search API leidžia ieškot scan’ų naudojant ElasticSearch string’us ir sintaksę ir grąžina high-level metadata ir nuorodą į pilną scan rezultatą.

**Pavyzdys:**

```
parcel-fee-check[.]example
  -> page title: Payment Confirmation
  -> loads JS: /static/app.js
  -> loads CSS: /assets/main.css
  -> favicon hash: abcd1234
  -> form action: hxxps://api-collect-secure[.]example/submit
  -> final redirect: hxxps://legitimate-courier[.]example/
```

Na ir čia jau atsiranda klausimai, kuriuos analitikas / tyrėjas turi kelt:

```
Ar tas pats favicon kartojasi kituose domenuose?
Ar tas pats JS path kartojasi?
Ar DOM struktūra panaši?
Ar form field names kartojasi?
Ar forma siunčia duomenis į tą patį backendą?
Ar po submit vartotojas redirectinamas į legit puslapį?
Ar page title ir HTML comments rodo tą patį kitą?
```

“Form action” labai geras pivot taškas, nes vartotojas gali matyt vieną domeną, bet credential arba payment data gali būt siunčiami į visai kitą backendą.

```
<form method="POST" action="https://api-collect-secure[.]example/submit">
  <input name="card_number">
  <input name="expiry">
  <input name="cvv">
</form>
```

Jei jau ąį skirtingų scam domenų siunčia formą į tą patį backend, turim stiprų ryšį… net jei 15 domenų:

```
turi skirtingus IP
naudoja skirtingus registrarus
turi skirtingus TLS certus
naudoja skirtingus TLD
```

Beeeett.. jie turi bendrą form action backend, kas gali būt stipreiau nei DNS sutapimas.

---

## Aštuntas etapas: HTML, JS, favicon ir screenshot similarity

Ne visi ryšiai matomi per DNS ar TLS.

Kartais scam domenai neturi bendro IP, neturi bendro registrar, neturi to paties TLS cert. Bet jie naudoja tą patį scam kitą.

Tada reikia žiūrėti į puslapio vidų:

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

dnstwist dokumentacijoje nurodyta, kad įrankis gali generuoti domenų permutacijas, aptikti Unicode IDN variantus, naudoti dictionary permutations, eksportuoti CSV /JSON, tikrinti rogue MX, taip pat atlikti HTML similarity per fuzzy hashes ir screenshot visual similarity per perceptual hashes. (https://github.com/elceef/dnstwist)

**Pavyzdinis pHash / HTML similarity use case:**

```
domain_a screenshot pHash: ffeedd001122
domain_b screenshot pHash: ffeedd001123
visual similarity: high

domain_a HTML fuzzy hash similarity to domain_b: 91%
```

Tai rodo ne infrastruktūros lygio reuse, o **template / kit reuse**.

**Scam operatoriai dažnai pernaudoja:**

```
tą patį login template
tą patį payment form template
tą patį JS validation script
tą patį Telegram bot notification code
tą patį CSS framework
tą patį fake loader animation
tą patį post-submit redirect
```

Scam analizėj tai labai vertinga, nes operatorius gali keisti domenus ir IP, bet tingėti keisti kit’ą. Na.. ir reusable code kaip ir normalūs dev’ai scam’eriai naudoja dažnai, tik jų backlog šiek tiek labiau baudžiamasis.

---

## Devintas etapas. Phishing / scam kit požymių analizė

**Phishing kit’ai ir scam kit’ai turi pasikartojančius artifaktus, tai ieškom:**

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

**Kaip pavyzdžiui:**

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

## Dešimtas etapas. Graph modelis

**Šiai sekundei** ***(aceit)*** **turim IOC sąrašą tokį:**

```
parcel-fee-check[.]example
delivery-redelivery[.]example
203.0.113.10
198.51.100.44
cert:9f3b-aa1
favicon:abcd1234
api-collect-secure[.]example
```

Bet čia.. na ne intelligence, tiesiog *(tkaip ir prieš tai minėjau)* daiktų sąrašas.

**O intelligence prasideda nuo to kai pradedam rodyt ryšius:**

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

**Edges case:**

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

Na realiai viską galima jau toliau kelt į OpenCTI arba MISP, man asmeniškai patinka labiau MISP vien dėl automatic correlation, event graph, warninglist.. na ir REST API ir PyMISP.

---

## Vienuiliktas etapas. Ryšių svoriai ir confidence

Ryšiai nėra visi vienodi.

Tas pats TLD nėra tas pats, kas form action backend.  
Tas pats registrar nėra tas pats, kas phishing / scam kit.  
Tas pats ASN nėra tas pats, kas favicon + DOM + backend endpoint.

**Čia toks minimalus scoring modelis, realiai kiekvienam reikalui gali jis keistis, bet pas mane sukasi toks šiai dienai keliose projektuose:**

#### Scoring

| Signalas | Svoris | FP rizika | Komentaras |
| --- | --- | --- | --- |
| Tas pats form action backend | 0.95 | maža | labai stiprus operacinis reuse |
| Tas pats scam kit / HTML template | 0.90 | maža / vidutinė | stiprus capability signalas |
| Tas pats Telegram bot / chat ID | 0.90 | maža | labai stiprus backend ryšys |
| Tas pats favicon hash | 0.80 | vidutinė | geras asset reuse signalas |
| Aukštas screenshot similarity | 0.80 | vidutinė | stiprus vizualinis template reuse |
| Tas pats TLS cert fingerprint | 0.75 | priklauso nuo cert tipo | stipru, jei ne CDN |
| Tas pats redirect chain | 0.75 | vidutinė | geras workflow reuse |
| Tas pats small VPS IP | 0.65 | vidutinė | naudinga su kitais signalais |
| Tas pats nameserver pattern | 0.55 | vidutinė | deployment signalas |
| Tas pats registrar | 0.30 | didelė | silpnas signalas |
| Tas pats TLD | 0.20 | labai didelė | beveik triukšmas |
| Tik scam keyword domene | 0.15 | labai didelė | reikia papildomų įrodymų |
{:.hx-table-wide}

**Paprasta formulė:**

```
cluster_score =
  Σ(edge_weight × source_reliability × temporal_overlap × evidence_quality)
  - false_positive_penalty
```

**Na (aš mėgstu python) python:**

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

Šitoj vietoj.. matematika nėra tobula, tobulai scam domenų pagaut su 0.01% ar ten žemesniu / aukštesniu mano nuomone neįmanoma.

**Esmė čia jau analitinė disciplina, o kiekvienas graph edge turi turėt:**

```
relationship_type
source
first_seen
last_seen
confidence
false_positive_notes
analyst_comment
```

Jei grafe ten tik linijos be konteksto, tai sveikinu gažus piešinys., smagu bet nulis naudos.

---

## Dvyliktas etapas. Phishing feeds ir verification šaltiniai

Scam analizėje feedai padeda, bet jie neturi tapti vieninteliu sprendimo pagrindu.

PhishTank API leidžia tikrinti URL per HTTP POST ir gauti atsakymą apie URL statusą jų duomenų bazėje. API gali grąžinti, ar URL yra duomenų bazėje, ar jis verified, ar valid, taip pat phish detail page ir timestamps, nors Lietuvoje esančių scam retai aptinku, bet bent šiokia tokia informacija. (https://phishtank.org/api\_info.php)

**Kaip papildomas kontekstas naudinga:**

```
Ar URL jau žinomas?
Ar jis verified?
Kada submitted?
Ar vis dar valid?
```

**Bet čia jau reikia turėt ribas:**

```
Feed coverage nėra pilnas internetas.
Nauji scam domenai gali dar nebūti feeduose.
Kai kurie feedai vėluoja.
Kai kurie domenai gali būti false positive.
Vien feed hit nėra infrastruktūros analizė.
```

Geresnis feed’ų naudojimas tai *“feed\_hit = supporting evidence”*, o ne *“feed\_hit = final intelligence product”.* Kitaip tariant.. feed’as sako, kad kažkas buvo pastebėta, o pivoting su kuo tai susiję.

---

## Tryliktas etapas. Takedown ir abuse output

Scam pivoting rezultatas jau turi būt panaudotas, kaip galima tai:

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

Tekę matyt abuse report tokių "*“Hello, this domain is scam. Please remove it”* *(damn reddit what are you doing)*.

**Geriausias abuse report’as sakyčiau toks** ***(aišku ne visi provideriai priima kaip abuse report, nes jiem dar reik kažkokių nepaaiškiniamų dalykų, arba ten tiesiog sėdi žmonės prie abuse report’ų, kurie išvis niekur nesigaudo.. bet anyway..):***

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

## Keturioliktas etapas. False positive rizikos.

Ne kiekvienas domenas su žodžiu "*“payment”* yra scam.  
Ne kiekvienas naujai registruotas domenas yra blogas.  
Ne kiekvienas shared hosting IP rodo bendrą operaciją.  
Ne kiekvienas panašus puslapis yra phishing.

**Legit scenarijai:**

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

Tai šitoje vietoje reik atskirt lygius..

**Silpnas:**

```
domain contains payment keyword
```

**Vidutinis:**

```
newly registered + payment keyword + suspicious redirect chain
```

**Stiprokas:**

```
newly registered + scam landing page + same form action backend + same favicon + same HTML template + same active window
```

**Pats geriausias:**

```
internal user telemetry confirms access
+ page collected sensitive data
+ backend reused across multiple domains
+ infrastructure observed in public phishing reports
```

**NA o tikrai gera CTI išvada pivoting turi turėt gerą confidence:**

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

## Mano template, galit pasiimt už sub

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

## OPSEC ir ribos

Naaa… pivoting turi likt defensive ribose.

**Tinkami veiksmai:**

```
passive DNS
RDAP lookup
urlscan analizė
savo DNS/proxy/email telemetry analizė
sandboxed page rendering
screenshot comparison
HTML/DOM analizė
MISP / TIP koreliacija
abuse reporting
takedown coordination
```

**Ko nedaryt be leidimo:**

```
aktyvaus scanning prieš trečiųjų šalių sistemas
bandymų prisijungti
formų pildymo realiais duomenimis
credential collection testavimo
agresyvaus enumeration
neautorizuoto exploitation
```

Čia įdėsiu tik kelius dalykus dėl šito.. Kas aš toks kad jum aiškinčiau, ką daryt ir ko nedaryt.. jei 100% scam domenas.. spėkit kiek Telegram / Discord bot’ų jau išguldžiau.

Matau, kad jau čia skaitymo bus 17 min. tai tiek jau daugiau ir rašymo.
