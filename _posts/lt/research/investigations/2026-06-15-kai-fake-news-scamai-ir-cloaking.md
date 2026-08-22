---
title: "Kai fake news, scamai ir cloaking susitinka vienoje vietoje."
description: "Tyrimas, kaip netikros naujienos, investicinis sukčiavimas ir cloaking sujungiami į vieną aukų atrankos bei monetizavimo infrastruktūrą."
date: 2026-06-15T14:21:51.923Z
lang: lt
translation_key: substack-kai-fake-news-scamai-ir-cloaking
permalink: /lt/tyrimai/kai-fake-news-scamai-ir-cloaking/
redirect_from:
  - /lt/research/kai-fake-news-scamai-ir-cloaking/
author: deividas-lis
content_type: investigation
confidence: moderate
tlp: clear
categories: ["fraud-scams", "information-operations"]
tags: ["cloaking", "investicinis sukčiavimas", "Facebook", "OSINT"]
featured: false
scope: "Sukčiavimo srauto, nukreipimo logikos ir turinio pateikimo skirtingoms auditorijoms analizė."
limitations: "Infrastruktūra greitai keičiasi, todėl domenai ir nukreipimo keliai yra konkretaus tyrimo momento vaizdas."
key_findings:
  - "Cloaking atskiria aukas nuo tyrėjų ir platformų kontrolės."
  - "Netikrų naujienų turinys veikia kaip pasitikėjimo bei srauto generavimo sluoksnis."
  - "Kampanijas patikimiau jungia infrastruktūros ir šablonų sutapimai, o ne vienas domenas."
image:
  path: /assets/img/posts/substack/kai-fake-news-scamai-ir-cloaking/01.webp
  alt: "Kai fake news, scamai ir cloaking susitinka vienoje vietoje."
  thumbnail: /assets/img/posts/substack/kai-fake-news-scamai-ir-cloaking/01-card.webp
  width: 1600
  height: 900
source_url: https://deivlis.substack.com/p/kai-fake-news-scamai-ir-cloaking
---
![Cloaking schema rodo, kaip tas pats URL tyrėjui pateikia saugų puslapį, o aukai – sukčiavimą.](/assets/img/posts/substack/kai-fake-news-scamai-ir-cloaking/01.webp)

*WeRedirect APT (tik nežinau kodėl čia pavadinta APT, kai realiai neatitinka APT sąvokos, nors iš vienos pusės kompanija turi infrastruktūrą, operatorius, cloaking, reklamų fermas, čia labiau tinka APT-like, persistent scam operation ar koks organized fraud actor na dar priliptų financially motivated threat actor) yra Debunk.org suteiktas pavadinimas kompanijai, kurioje sukčiai Lietuvoje ir kitose Europos šalyse kūrė klonuotus naujienų portalus, netikras Facebook paskyras, investicinių scamų landing pages ir naudojo cloaking, kad skirtingiems lankytojams būtų rodomas skirtingas turinys. Debunk.org part I nurodė 93 Facebook paskyras, 81 brand impersonation puslapius, 568 fake ads ir 7.5 mln. impressions, iš kurių daugiau nei 5.1 mln. parodymų teko Lietuvos Facebook vartotojams ir kitoms meta platformoms. (Debunk.org, 2023 Part I)*

*Svarbiausias techninis kampas, kad tas pats URL nėra tas pats įrodymas aka vienas žmogus gali matyt tuščią puslapį, kitas blogą, o žmogus iš Lietuvos (su tinkamu įrenginiu, kalba, referreriu ir IP reputacija) mato fake Delfi/LRT/Ignitis investicinį puslapį. Debunk part 3 aprašė, kad WeRedirect naudojo geolocation/IP-based redirection, skirtingus URL path variantus, low-quality puslapius ir pagal tai parinkdavo turinį (Debunk.org, 2023 Part III)*

---

## Kas yra Cloacking CTI kontekste

Cloaking phishing ir malvertising kontekste yra turinio pateikimo kontrolė pagal tam tikras lankytojo savybes. Security scanneriui, ad reviewer’iui, cloud sandbox’ui arba tyrėjui *(researcheriui arba kaip pavadinsi taip nepagadinsi)* parodomas “normalus” puslapis. Vartotojui į kurį taikomasi rodomas phishing, scam, crypto drainer, fake investment platforma, malware landing page, arba kažkoks fake installer. Varonis 2026 m. aprašytas 1Campaign atvėjis parodo, kad lygiai toks pats modelis vyksta ir Google Ads ekosistemoje t.y. realus varototoajs mato scam turinį, o ad platformos revieweriai ir automatizuoti scanneriai mato blank page, arba harmless page. (Varonis, 2026)

HUMAN Security 2025 m. malvertising analizėje cloaking pateikė kaip “split personality” reklamos modelį, kuris yra tas toks pat, kaip ir 1Campaign. (HUMAN Security, 2025)

ZeroFox nurodo tipinius cloaked phishing kit požymius: JavaScript rendering reikalavimas, User-Agent filtering, timing delays, IP blocklists, geo-blocking ir domain rotation/DGA. Taip pat pamini, kad phishing kits dažnai blokuoja web crawlerius, resercherius, botus ir kitus kas “nepageidaujami”. (ZeroFox, 2023)

Nuuuuu aš čia dar irgi įsikišiu *(kas kitas jei ne šuo pats sau pasilaižys…),* kai dar buvau NordVPN ThreatProtection’e rašėm ir mes šiek tiek apie cloaking ir gaudėm 2024 m. *(mano komanda rašė…likom tik NordVPN experts.. sad).* (NordVPN, 2024)

![Skirtingiems lankytojams pagal patikros signalus pateikiamas tikras arba fiktyvus turinys.](/assets/img/posts/substack/kai-fake-news-scamai-ir-cloaking/02.webp)

---

## Pagrindinės cloaking technikos

#### Technikos

| Technika | Kaip veikia | Ką mato analitikas | Kaip aptikti |
| --- | --- | --- | --- |
| Geo/IP filtering | Serveris sprendžia pagal IP šalį, regioną, ASN, residential/mobile/datacenter tipą | Iš cloud/VPN gali matyti white page arba 404 | Testuoti iš įvairių mobile/residential/datacenter profilių |
| ASN / hosting reputation filtering | Blokuoja Google, Microsoft, AWS, OVH, DigitalOcean, VPN, security vendors | Scanneriai gauna benign puslapį | Lyginti cloud vs residential/mobile atsakymus |
| User-Agent filtering | Tikrina Chrome/Safari/Firefox, OS, mobile/desktop, bot UA | Headless Chrome arba curl gauna kitokį HTML | Keisti UA, Accept-Language, platform headers |
| JavaScript rendering gate | Turinys sugeneruojamas tik su JS, cookies, localStorage, timers | Static scanner mato tuščią HTML | Naudoti Playwright/Chrome su HAR ir screenshots |
| Headless/browser fingerprint detection | Tikrina `navigator.webdriver`, plugins, fonts, WebGL, canvas, screen size | Automation gauna fasadą | Lyginti real browser ir headless rezultatus |
| Referer / ad-click gating | Tikra versija rodoma tik atėjus iš Meta/Google ad click | Tiesioginis URL atidarymas neveikia | Rinkti pilną ad URL su parametrais, refereriu ir redirect chain |
| Cookie/session gating | Pirmas apsilankymas rodo vieną turinį, pakartotinis kitą | Po kelių tyrimų puslapis „užsidaro“ | Naudoti švarias sesijas, naujus profilius, fiksuoti pirmą hitą |
| Time delay | Scam turinys atsiranda po 5–30 s arba po scroll/click | Greitas scanneris nespėja pamatyti | Ilginti wait time, fiksuoti DOM pokyčius |
| Path-based landers | Tas pats domenas turi daug lokalizuotų `/lander/lt...`, `/lander/se...` kelių | Vienas path neveikia, kitas rodo scam | Enumeruoti tik iš viešai matomų pathų, lyginti struktūrą |
| Shield pages | Pradinis landeris atrodo kaip low-quality news/gossip page | Scanneris mato pseudo portalą | Žiūrėti JS, redirect initiators, form actions, hidden links |
| Sample-rate cloaking | Malicious versija rodoma tik daliai sesijų | Vienas tyrimas gali nieko nerodyti | Kartoti iš skirtingų aplinkų, bet saugiai ir ribotai |
| Anti-debugging / DevTools detection | JS tikrina debug/DevTools požymius | Atidarius DevTools keičiasi elgsena | Rinkti HAR per proxy/browser API, ne tik rankiniu DevTools |
| Localization gating | Tikrina `Accept-Language`, timezone, currency, browser locale | Ne LT locale gauna fasadą | Testuoti iš įvairių timezone |
| CAPTCHA / challenge gating | Phishing atsiranda po challenge ar interaction | Scanneris sustoja challenge etape | Dokumentuoti challenge, nevesti asmeninių duomenų |
| Tracking / affiliate gating | Tikras landeris aktyvus tik su `fbclid`, `gclid`, UTM, affiliate ID | Nukirpus parametrus puslapis nebeveikia | Saugoti originalų URL su visais parametrais |
{: .hx-table-wide }

Šitoje vietoje svarbu ne tai, kad technika nera problema, o problemos atsiranda kai jau yra kombinacijos.

**Realiose kompanijose veikia ne viena logika, o jų kombinacijos:** *Meta ad → fake news profile → tracking URL → Geo/IP check → UA check → cookie check → JS redirect → localized fake article → investment form → callback/CRM/Telegram/affiliate backend’as.*

Tai sugaudyt, kurioje vietoje prasileidai… Uhhh smagumėlis.

![Sprendimų medis vaizduoja IP, įrenginio, naršyklės ir elgsenos patikras prieš parenkant turinį.](/assets/img/posts/substack/kai-fake-news-scamai-ir-cloaking/03.webp)

---

## Kaip saugiai “decloakint” ir pasiekt tikrą phishing/scam turinį

Jei trumpai, tai pagrindas surinkt IOCs, screenshot’us, cloaking mechanizmą. Nevedam realių duomenų, nieko neperkam, nespaudžiam download, nevykdom payload’ų.. Neinteractinam su operatoriais daugiau nei reikia, kad pasitvirtint phishing’ą/scam’ą, jei formos reikalauja telefono numerio, banko kortelės duomenų nu nevedam aišku savo ar kieno kito *(realiai čia suveikia dummy duomenys dažnu atveju)*. Užfiksavom form fields, endpoint’us, DOM, screenshot’us ir network request’us.. and We are done.

**Praktinis workflow** ***(atrodo kažkaip taip):***

**Passive-first.** Pradedam nuo pasyvių šaltinių:

```
domain age ir registrar
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
URL path struktūra
UTM / affiliate / tracking ID
```

Debunk.org aprašė, kad WeRedirect atveju registracijos laikas ir domenų kūrimo klasteriai buvo naudingi *(na čia savaime aišku, kad pivoting is The King)*. Dalis domenų buvo sukurti labai panašiu metu. Debunk taip pat mini Cloudflare, DigitalOcean, hosting providers, Namecheap, Tucows, URL Solutions ir privatumą apsaugančias registravimo paslaugas kaip infrastruktūros sluoksnius, kurie apsunkino analizę. (Debunk.org, 2023 Part III)

**Differential fetch.** Tą patį URL tikrinam keliom sąlygom:

```
# Minimalus baseline
curl -i -L --max-redirs 10 "https://example[.]com/path" -o baseline.html

# Realistiškesnis Chrome desktop profilis
curl -i -L --max-redirs 10 \
  -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36" \
  -H "Accept-Language: lt-LT,lt;q=0.9,en-US;q=0.8,en;q=0.7" \
  "https://example[.]com/path" -o chrome_lt.html

# Bot / scanner
curl -i -L --max-redirs 10 \
  -A "Googlebot/2.1 (+http://www.google.com/bot.html)" \
  "https://example[.]com/path" -o bot.html
```

Šituo atvėju lyginam ar tas pats URL grąžina skirtingus codes, Location headers, HTML dydį, page title, JS Budle, cookies ar final URL.

**Browser-rendered collection.** Statinio ***curl*** dažnai nepakanka, šiuo atvėju ZeroFox išskiria JS rendering, timing delays ir User-Agent filtering kaip tipines cloaked phishing technikas, todėl reikia browser-rendered analizės irgi. (ZeroFox, 2023)

Naudojam izoliuotą VM, Playwright/Chromium, naują browser profile kiekvienam bandymui *(realiai turiu virš kelių šimtų asmeniškai browser profiles, kad sugaudyt cloaking)*, be realių accounts ir be realių duomenų:

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

*(neskriauskit dėl “mandro” python script’o, aš ne developeris..ai jo..ir čia nėra universalus decoderis tinkantis viskam, situacija situacijai nėra lygi)*

**Matrix-based decloacking**  
Vienas iš praktiškiausių būdų *(aš manau.. mano nuomonė)* yra ne “atidariau URL ir pažiūrėjau”, o susidaryt testavimui matricą, kitaip sakant.. tas pats URL turi būt patikrintas per kelis profilius, skirtumai tarp atsakymų jau gali būt įrodymu, kad vyksta content decision logic.

**Papraščiau tariant (imant Lietuvą):**

#### Testai

| Testas | IP / lokacija | Browser / UA | Kalba / timezone | Referer / parametrai | Ko ieškom |
| --- | --- | --- | --- | --- | --- |
| Baseline | Datacenter / EU | curl | default | none | Ar puslapis gyvas, kokie status codes |
| LT user | Lietuva | Chrome desktop | lt-LT / Europe/Vilnius | originalus URL | Ar rodo lokalizuotą scam / fake news |
| LT mobile | Lietuva | Android/iOS mobile | lt-LT / Europe/Vilnius | originalus URL | Ar kampanija mobile-first |
| Non-target user | US / NL / DE | Chrome | en-US | none | Ar rodo blank/facade/kitą turinį |
| Bot profile | bet kur | Googlebot / crawler UA | default | none | Ar botams rodomas harmless turinys |
| No JS | Lietuva | Chrome, JS off | lt-LT | originalus URL | Ar reikia JavaScript redirect’o |
| No params | Lietuva | Chrome | lt-LT | nukirpti fbclid/utm | Ar campaign tokenai būtini |
| Repeat visit | Lietuva | tas pats profile | lt-LT | originalus URL | Ar po kelių kartų užsidaro scam turinys |

Iš šitos pusės svarbu ne vienas testas, o jų *(testų)* koreliacija. Jei ***curl*** gauna 1.2KB HTML su tuščiu ***<body>***, Googlebot gauna kažkokį low-quality naujienų puslapį, LT mobile profilis gauna fake investicinį puslapį su forma.. galim sakyt, kad turim cloacking.

**Šiaip dar ką vertėtų lygint tai:**

```
# HTML dydžiai
wc -c baseline.html chrome_lt.html bot.html 

# Hash'ai, jeigu norim greitai pamatyti ar turinys identiškas
sha256sum baseline.html chrome_lt.html bot.html

# Greitas title / redirect / JS artefaktų grep'as
grep -Eoi "<title>.*</title>|window.location|document.location|location.href|setTimeout|atob|eval|gtm|f
```

Jei vieno profilio HTML turi ***form, phone, firstname, lastname, submit, pixel, fbq, gtm*** *(žinau keiksmažodžiai..)*, o kito profilio HTML yra tuščias arba rodo random blogą *(pvz mano)*, tai paranoją galima mest per langą, mes turim du veidus vienam puslapyje.

![CTI testavimo matrica lygina, kokį atsaką svetainė pateikia skirtingoms tyrimo aplinkoms.](/assets/img/posts/substack/kai-fake-news-scamai-ir-cloaking/04.webp)

---

## Ką konkrečiai lygint

Kai jau renkam tam tikrus evidence, neužtenka tik screenshot’o *(šitas tinka tik vadovams ir Linkedin’ui),* reikia ir šiokios tokios techninės analizės ir daugiau info.

**Jei jau man tenka pagaudyt galimus cloacking.. renku artifaktus:**

#### Artefaktai

| Artefaktas | Kodėl svarbu |
| --- | --- |
| Final URL | Parodo, kur realiai baigėsi redirect chain |
| HTTP status codes | 200/302/403/404 skirtumai tarp profilių rodo gating |
| Location headers | Padeda matyti server-side redirect’us |
| HTML body size | Blank vs full lander labai greitai matosi |
| Page title | Fake news / investment template identifikavimas |
| Cookies | Gali būti naudojami session gating |
| localStorage/sessionStorage | JS pagrįsti decision flag’ai |
| HAR file | Pilnas request/response medis |
| Screenshot | Vizualinis brand impersonation įrodymas |
| JS failai | Redirect, fingerprinting, tracking logika |
| Form action endpoint | Kur keliauja vartotojo duomenys |
| Tracking IDs | GA/GTM/Meta Pixel/affiliate clustering |
| Referer chain | Ar vartotojas turi ateiti iš Facebook/Google ad |
| DNS/ASN/SSL | Infrastruktūros pivoting |

Čia jau vienas geriausių signalų yra ne domenas, o pasikartojanti logika. Domenai visi žinom, kad keičiasi/rotuojasi *(tikiuosi visi žinom, jei ne tai nedėkokit už šitą info, čia po TLP:Amber paslėpta buvo)*, Landing pages keisis. Beeeettt.. kaip ir aname blog’e apie pivoting’ą minėjau operatoriai dažnai palieka tą patį redirect pattern’ą, tą patį JS fragmentą, tą patį form field naming, tą patį GTM containerį, tą patį affiliate parametrą arba tą pačią path struktūrą *(palieku tą didelį TLP:Amber apačioje, kas neskaitėt)*

Kitaip sakant.. IOCs miršta, o TTP gyvena toliau.

![Tyrimo darbo vietoje vienu metu analizuojami svetainės kodas, srautas ir puslapio vaizdas.](/assets/img/posts/substack/kai-fake-news-scamai-ir-cloaking/05.webp)

---

## Pagrindinės cloaking technikos

Viršuje jau išvardinau pagrindines technikas mandrame table, o dabar einam prie kaip kas kur ką.

Čia mistikos nelabai daug yra, cloacking nėra kažkoks super elitinis “APT Magic”, tai žemiški *(ir daug ko naudojami)* web kontrolės sluoksniai tik sujungti į vieną decision varykliuką.

**Geo/IP based cloacking.**  
Serveris tikrina, iš kokios šalies ateina lankytojas. Jei lankytojas iš Lietuvos *(čia visur imsiu Lietuvą, lengviau suprąst bus)* tai jam rodomas fake Delfi / Ignitis / Orlen / Investment puslapis. Jei lankytojas iš JAV ar kokio cloud datacenterio jam rodomas blank puslapis, harmless blogas arba low-quality random puslapis.

Šitoje vietoje labai patogu scameriams, nes daug security vendor’ių, sandbox’ų ir ad review sistemu veikia iš cloud infros arba iš regionų, kurie nėra jų kampanijos taikinys, todėl scanneriai mato nieko, o realūs žmonės pakliūna į scam.

**ASN / Hosting reputation filtering.** Šitoje vietoje įsijungia ne tik šalis, o tinklo tipas. Serveris gali tikrinti ar lankytojo IP priklauso AWS, Google Cloud, Microsoft Azure, DigitalOcean, OVH, Hetzner, VPN provider’iui *(ypač kai VPN provideriai viešai skelbia savo IPs)* ar kažkokiam žinomam security vendor’iui.

Jei IP atrodo kaip analitiko arba scannerio aplinka tai rodomos harmless turinys.  
Jei IP atrodo kaip residential arba mobile user’is tai rodomas tikras puslapis.

Dėl to vien “patikrinau per VPS” dažnai reiškia, kad “patikrinau taip, kaip attacker’is tikėjosi, kad tikrins researcheris”.

**User-Agent filtering**  
Čia jau klasika. Serveris arba JavaScript žiūri ar lankytojas ateina su realistišku Chrome/Safari/Firefox User-Agent ar su ***curl, python-requests, HeadlessChrome, GoogleBot, BingBot, facebookexternalhit, Go-http-client*** ir panašūs mandri pavadinimai.

**Keli pavyzdžiai:**

```
curl/8.0 → blank page
Googlebot → facade page
Chrome on Windows → fake article
Mobile Chrome on Android → fake investment form
```

Čia dažnai visi tyrimai prasideda ir susimauna ties ***curl***, gauna blank page ir tuo pasibaigia.

**JavaScript rendering gate.** Kai kuriuose puslapiuose pirminis HTML beveik tuščias, tikrasis turinys atsiranda tada kai jau pasileidžia JavaScript.

**Taiiii reiškia, kad statinis scanneris matys:**

```
<html>
    <body>
        <script src="/assets/app.js"></script>
    </body>
</html>
```

O realiai browseris po kelių sekundžiu jau turi pilną DOM su fake straipsniu, forma, tracking pixeliais ir redirect’u.

Toooodėėėlll.. Playwright/Chomium arba kiti browser-rendered collection tampa būtini. Ne dėl visiem taip mėgstamo fancy automation, o todėl, kad modernesnis scam turinys dažnai neegzistuoja statiniam HTML.

**Headless browser detection**  
Kai operatoriai nori būti dar labiau erzinantys *(šitie mane labiausiai nervina jei ką)*, jie tikrina, ar browseris atrodo automatizuotas..

**Tipiniai signalai:**

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

Jei jau puslapis “mato”, kad browseris headless arba “per daug švarus”, gali rody fake puslapį, todėl čia jau tiklas nėra “nulaužiam” cloaking’ą, o susikuriam kelis skirtingus rinkimo profilius ir dokumentuojam, kaip turinys keičiasi pagal aplinkas.

Čia nereik jau patapt developeriu automatizacijos magistru ir kurt kažkokius stealth bypass framework’us kaip scammerių QA. Reliai užtenka emuliuoti realaus vartotojo sąlygas ir rinkt skirtumus.

**Referer / ad-click gating**  
Kai kurios kompanijos tikrą landing page rodo tik tada, kai vartotojas ateina iš reklamos.

**Kaip pvz:**

```
facebook.com → l.facebook.com → tracking URL → cloaking gate → fake article
```

Jei tą patį URL atidarom per tiesiogiai browser’į, be referer ir be campaign parametrų galim gaut blank page.. O kodėl per Ads’us leidžia.. Nuostabus dalykas tas telefonas, nueini į scam puslapį tarkim Delfi, o pačio URL tai nerodo labai gerai.

**Čia jau svarbu išsaugot originalų URL su visais parametrais:**

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

Jei nevyniojant į vatą labai tai būtent ***clickid*** arba ***subid*** gali būt raktas į tikrą scam puslapį, nukripai šituos .. nebėr puslapio.

**Cookie / session gating**  
**Kai kurios sistemos sprendžia pagal tai, ar vartotojas jau lankėsi ankščiau.. tai yra:**

```
Pirmas kartas - scam.
Antras kartas - scam
...
Penktas kartas - netikras puslapis.
..
Dešimtas kartas - tuščias (blank) puslapis.
```

Kodėl? Elementaru Vatsonai.. Nes tyrėjas dažnai kartoja testus, realus vartotojas dažniausiai ateina vieną ar du kartus. Per dažnai apsilankai iš to pačio profilio reiškia signalas sukčiam, kad čia jau nebe būsima auka *(o Deividas už ekrano :(.. )*.

Dėl to realiai kiekvienam tokiam didesniam tyrimui ar research kur darau naudoju švarias sesijas, ir jas realiai reiktų..

```
naujas browser context
nauji cookies
naujas localStorage
naujas profile
atskiras HAR
timestamp kiekvienam bandymui
```

**Timing delay.** Kai kurie puslapiai ne taip greit kraunasi.. t.y. neskuba, jei palaukia 5, 10, 15 ar 30 sekundžiu *(ilgiausiai teko matyt 34 sekundas)* ir redirect vyksta tik po scroll, mouse move arba elementaraus click.

Kas vyduje vyksta tai scanneris, kuris laukia 3 sekundes ir uždaro puslapį nieko nemato, žmogus, kuris realiai skaito fake straipsnį, po 10 sekundžių yra nukreipiamas į registravimo formą.

**Čia jau reiktų jai jau naudojam Playwright’ą tai užmęst ilgesnį wait:**

```
page.goto(target, wait_until="networkidle", timeout=45000)
page.wait_for_timeout(15000)
```

**O išvis tobula fiksuot DOM keliais laiko komentais:**

```
for i in [3, 10, 20]:
    page.wait_for_timeout(i * 1000)
    (out / f"{prof['name']}_{i}s.html").write_text(page.content(), encoding="utf-8")
    page.screenshot(path=str(out / f"{prof['name']}_{i}s.png"), full_page=True)
```

Matosi kaip puslapis keičiasi po delay ar išvis keičiasi.

**Path-based landers**  
Grįžtant prie WeRedirect atvėjo tai gan įdomi vieta yra path struktūra. Domenas atrodo kaip random low-quality puslapis, bet konkretus path aktyvuoja scam template.

**Pavyzdžiui:**

```
example[.]com/lander/lt9-vlad/
example[.]com/lander/se1-vlad/
example[.]com/igns/
example[.]com/oil-profit/
```

Čia nereiktų bruteforcint path’ų, o analizuot jau viešai matomus path’us iš reklamų, social įrašų, HAR failų, URLscan, public sandbox rezultatų ir panašiai.

Jei keli skirtingi domenai turi tą pačią path struktūra, tą patį naming convention arba tą patį DOM template galim sakyt, kad turim clustering’ą.

**Facade pages**  
Facade page yra puslapis, kuris egzistuoja tik tam, kad atrodytų normaliai *(čia kaip aš darbo meet’uose be Dragon Ball maikės, o su normalia)*. Dažnai čia būna prastos kokybės naujenų puslapiai, gyvenimo būdo ar dar kažkoks e-commerce puslapis.

**Dažniausia tokie puslapiai turi:**

```
random straipsnius
neveikiančias kategorijas
copy-paste tekstus
generic stock images
fake author names
netikrą footerį
jokio realaus brand history
prastą kalbą
daug tracking
keistą domain age
```

Šių puslapių tikslas yr paprast, kai Meta reviewer’is, scanneris arba researcheris atidaro puslapį, jis mato kažką, kas nėra akivaizdus scam. Nuuuu ne gerą puslapį, o tiesiog pakankamai neblogą, kad nebūtų iškart domentas nušautas ar scam kompanija.

---

## Kaip atrodo realus tyrimo flow

Praktiškai tyrimas gali atrodyt taip:

```
1. Randam fake Facebook ad arba gaunam pranešimą iš vartotojo
2. Išsaugom screenshot’ą ir originalų URL su visais parametrais
3. Patikrinam Meta Ad Library / social page istoriją
4. Atliekam passive DNS / WHOIS / CT / ASN analizę
5. Paleidžiam differential fetch per kelis profilius
6. Surenkam HAR, HTML, screenshot’us ir final URL
7. Lyginam turinio skirtumus tarp profilių
8. Ištraukiam form endpoints, JS artefaktus, tracking IDs
9. Pivotinam per domenus, SSL, favicon, ASN, path’us, DOM similarity
10. Paruošiam IOCs
11. Reportinam platformai / brandui / CERT-LT / OpenPhish / ScamAdvisor / GSB ar dar kažkam
```

Mano akim čia labai paprastas flow ir truputi atskiria "aš radau scam puslapį” nuo “aš atlikau tyrimą ir nustačiau, kad čia scam”.

![Įtartino peradresavimo grandinė nuo reklamos ir sutrumpintos nuorodos iki sukčiavimo puslapio.](/assets/img/posts/substack/kai-fake-news-scamai-ir-cloaking/06.webp)

---

## Techniniai indikatoriai, kurie yra verti dėmesio

Jei jau daryčiau *(nesakau, kad dabar nedarau)* panašau scam tipo kompanijos analizę, IOC lentelėje neitų vien domenai.. Domenai miršta greit, reikia priplaukt prie platesnių indikatorių.

#### Artefaktai

| IOC / artefaktas | Pavyzdys | Kam naudinga |
| --- | --- | --- |
| Domain | fake brand / news domain | blokavimui, takedown |
| URL path | /lander/lt..., /igns/ | template clustering |
| Registrar | Namecheap, Tucows, kiti | registration pattern |
| Nameserver | pasikartojantys NS | infrastructure grouping |
| ASN | hosting / CDN | blokavimui ir pivoting |
| SSL cert | SAN, issuer, validity | certificate pivoting |
| HTML title | fake news headline | content clustering |
| OG tags | og:title, og:image | social preview abuse |
| JS hash | redirect / fingerprint script | campaign clustering |
| Favicon hash | copied brand favicon | brand impersonation detection |
| Form action | endpoint collecting leads | backend mapping |
| Tracking ID | GTM/GA/Meta Pixel | operator / affiliate link |
| Affiliate params | subid, clickid, affid | monetization chain |
| Social page ID | fake page / renamed page | distribution layer |
| Ad creative | headline/image/copy | social engineering narrative |
| Screenshot | fake brand evidence | reporting and takedown |

Čia reiktų pabrėžt, kad domenas yra vienkartinis. Tracking ID, form endpoint, JS hash arba path convention dažnai gyvena žymiai ilgiau.

**Infrastructure clustering.** Infrastructure clustering šitoje temoje yra labai svarbus, nes operatoriai dažnai kuria daug vienkartinių domenų. Jei žiūrim tik į vieną URL, matom vieną scam. Jei pivotinam, galim pamatyti visą kampaniją.

**Domenų registracijos laikas.** Jei 20 domenų sukurti per tą pačią savaitę, naudojant tą patį registratorių ir panašų naming pattern, tai jau signalas.

**Nameservers**  
Tie patys nameserveriai tarp kelių brand impersonation domenų gali rodyti bendrą operatorių arba tą patį setup’ą.

**Certificate Transparency.** CT logs leidžia pamatyti, kokie sertifikatai buvo išduoti domenams. Jei viename sertifikate yra keli susiję SAN įrašai arba keli domenai turi labai panašų issuance pattern, galima pivotinti toliau.

**Favicon hash.** Jei scammeriai kopijuoja brand puslapį, jie dažnai nukopijuoja ir favicon. Favicon hash leidžia ieškoti kitų puslapių, kurie naudoja tą patį vizualinį artefaktą.

**HTML/DOM similarity.** Labai stiprus metodas. **Net jei domenai skirtingi, template gali būti tas pats:**

```
tas pats header layout
tie patys CSS class names
tie patys fake comments
tas pats footer
tie patys form field names
tas pats countdown timer
tas pats review block
tas pats JavaScript redirect pattern
```

**Tracking IDs  
J**eigu keli puslapiai turi tą patį GTM, GA, Meta Pixel, TikTok Pixel ar affiliate tracking ID, tai vienas stipriausių clustering indikatorių.

Aišku, reikia atsargumo: kartais tas pats third-party script gali būti bendras ir benign. Bet jei kartu sutampa domenų amžius, path struktūra, fake brand theme ir form endpoint’ai turim gan stiprų signalą.

**Form endpoints.** Investment scams dažnai turi lead collection mechanizmą. **Puslapio forma gali siųsti duomenis į:**

```
/api/register
/lead
/send.php
/form.php
/api/v1/lead
/crm
```

Jei keli skirtingi fake brand landeriai siunčia duomenis į tą patį endpointą arba panašų backend pattern we got jackpot.

![Cloaking metodai išdėstyti aplink turinio parinkimo mechanizmą.](/assets/img/posts/substack/kai-fake-news-scamai-ir-cloaking/07.webp)

---

## Monetizacija.. Kur ji?

Svarbu suprasti, kad WeRedirect tipo kampanijoje gali būti keli dalyviai. Nebūtinai tas pats žmogus kuria fake Facebook page, perka ads, rašo fake straipsnį, hostina landerį, valdo CRM ir skambina aukai.

**Dažniausiai ekosistema yra tokia:**

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

Čia dėl to ir atsiranda affiliate parametrai: ***subid, clickid, affid, utm\_campaign***. Jie padeda operatoriams suprasti, kuris traffic source atnešė auką. Kitaip tariant, net scam turi savo performance marketing’ą *(niekur nepabėgsi nuo corporate nesąmonių..)*. Nes, aišku, jei jau vagi pinigus, tai norisi attribution modelio.

Kaip čia pasakius… Marketingas, tik su baudžiamuoju kodeksu.

---

## MITRE ATT&CK mapping

Pabrėšiu čia, kad tai nėra tobulas ATT&CK pritaikymas, nes MITRE yra labiau orentuotas į intrusion lifecycle, o čia kalbam apie fraud/malvertising ekosystemą. Bet ATT&CK stiliaus smegenys mano truputi padeda strukturizuot TTP.

#### Galimas mapping

| Taktika | Technika / analogas | Kaip pasireiškia |
| --- | --- | --- |
| Reconnaissance | Search Open Websites/Domains | Brandų, žiniasklaidos, viešų asmenų pasirinkimas |
| Resource Development | Acquire Infrastructure | Domenai, hostingas, redirect infrastruktūra |
| Resource Development | Establish Accounts | Fake Facebook paskyros, reklamos account’ai |
| Resource Development | Develop Capabilities | Cloaking logic, lander templates |
| Initial Access / Delivery | Phishing / Malvertising analogas | Paid ads su fake news lure |
| Defense Evasion | Masquerading | Fake Delfi/LRT/Ignitis puslapiai |
| Defense Evasion | Impair Defenses analogas | Scannerių/ad review apėjimas per cloaking |
| Command and Control analogas | Web Service / Redirector logic | Redirect chain ir campaign routing |
| Collection | Input Capture analogas | Formos, lead collection |
| Impact | Financial Theft / Fraud | Fake investment scam monetizacija |

---

## Kill Chain

**Kompanijos realiai turi gan panašius kill chain’us, ir juos aprašyt galima kažkaip panašiai:**

```
1. Brand / narrative selection
   Pasirenkamas žinomas brandas, naujienų portalas arba viešas asmuo.
2. Infrastructure setup
   Registruojami domenai, paruošiami nameserveriai, SSL, hostingas, CDN/proxy.
3. Content templating
   Sukuriamas fake article, fake comments, fake investment page, fake reviews.
4. Social distribution
   Sukuriamos arba perimamos Facebook paskyros, paleidžiamos reklamos.
5. Cloaking gate
   Serveris/JS sprendžia, ką rodyti pagal IP, UA, referer, cookies, locale.
6. Victim routing
   Tinkamas vartotojas nukreipiamas į lokalizuotą fake news/investment flow.
7. Lead capture
   Forma renka vardą, telefoną, el. paštą, kartais kitus finansinius duomenis.
8. Monetization
   Auką perima fake broker / call center / scam operatorius.
9. Rotation
   Domenai, reklamos, paskyros ir landeriai keičiami, kai prasideda blokavimai.
10. Reuse
   Tas pats template pritaikomas kitai šaliai, kitam brandui, kitai istorijai.
```

![Sukčiavimo kampanijos grandinė nuo reklamos iki aukos duomenų perdavimo operatoriui.](/assets/img/posts/substack/kai-fake-news-scamai-ir-cloaking/08.webp)

---

## Rizikos

Kaip gi be truputi streso ir kaip gi organizacijoms duodamos rizikos.

**Pirma**. Reputacinė. Jei vartotojas mato tavo logotipą fake investicinėje reklamoje, jam nebūtinai aišku, kad tu nesi kaltas. Brand impersonation visada kerta per pasitikėjimą.

**Antra.** Klientų apsauga. Bankai, energetikos įmonės, kurjeriai, valstybės institucijos ir žiniasklaida dažnai tampa tokio tipo scamų “pasitikėjimo donorais”. Sukčius neturi kurti pasitikėjimo nuo nulio. Jis tiesiog pavagia tavo brandą.

**Trečia.** Incident response ribos. Daug organizacijų vis dar galvoja, kad jei incidentas nevyksta jų infrastruktūroje, tai “ne mūsų incidentas”. Techniškai gal ir taip. Reputaciškai jau nebe.

**Ketvirta.** Jei tavo brand monitoring vendor tikrina URL iš vieno cloud regiono, jis gali nematyti cloaked turinio. Tada gauni gražią ataskaitą, kad viskas švaru, o vartotojai tuo metu pildo fake investment formas.

**Čia ir yra nemaloni pamoka.** Brand abuse monitoring be cloaking-aware collection yra pusiau aklas.

![Tas pats URL veda į skirtingą turinį aukai, tyrėjui ir reklamos platformai.](/assets/img/posts/substack/kai-fake-news-scamai-ir-cloaking/09.webp)

---

## **Sources**

1. <span id="source-1"></span><span class="hx-source-entry"><a href="https://www.debunk.org/the-largest-disinformation-and-scam-attack-ever-recorded-in-lithuania-part-i">Debunk Part I</a> <span class="hx-source-type">Išorinis šaltinis</span></span>
2. <span id="source-2"></span><span class="hx-source-entry"><a href="https://www.debunk.org/weredirect-apt-the-large-scale-scam-attack-exposing-the-elaborate-tactics-of-online-scams-part-iii">Debunk Part III</a> <span class="hx-source-type">Išorinis šaltinis</span></span>
3. <span id="source-3"></span><span class="hx-source-entry"><a href="https://www.varonis.com/blog/1campaign">Varonis</a> <span class="hx-source-type">Išorinis šaltinis</span></span>
4. <span id="source-4"></span><span class="hx-source-entry"><a href="https://nordvpn.com/blog/threat-protection-cloaking-techniques/">NordVPN</a> <span class="hx-source-type">Išorinis šaltinis</span></span>
5. <span id="source-5"></span><span class="hx-source-entry"><a href="https://www.zerofox.com/blog/phishing-kits-with-cloaked-techniques-the-next-generation-of-phishing-attacks/">ZeroFox</a> <span class="hx-source-type">Išorinis šaltinis</span></span>
6. <span id="source-6"></span><span class="hx-source-entry"><a href="https://www.humansecurity.com/learn/blog/digital-disguise-understanding-cloakings-role-in-malvertising/">HUMAN Security</a> <span class="hx-source-type">Išorinis šaltinis</span></span>
