---
title: "Gavote įtartiną SMS? Kaip saugiai patikrinti phishing nuorodą"
card_title: "Kaip saugiai patikrinti įtartiną SMS nuorodą"
description: "Praktinis vadovas, kaip išsaugoti įtartiną SMS, neutralizuoti nuorodą, patikrinti domeną, shortener'į ir peradresavimus neatskleidžiant duomenų."
seo_title: "Kaip patikrinti įtartiną SMS ir phishing nuorodą"
seo_description: "Praktinis vadovas, kaip saugiai tikrinti įtartiną SMS, phishing nuorodą, domeną, shortener'į ir peradresavimus, o po paspaudimo greitai reaguoti."
seo_keywords:
  - "kaip patikrinti įtartiną SMS"
  - "kaip patikrinti phishing nuorodą"
  - "įtartina SMS nuoroda"
  - "smishing Lietuvoje"
  - "phishing SMS Lietuva"
  - "sutrumpintos nuorodos tikrinimas"
  - "kaip pranešti apie phishing NKSC"
date: 2026-08-31 18:00:00 +0300
lang: lt
translation_key: suspicious-sms-link-safety-guide
permalink: /lt/tyrimai/kaip-saugiai-patikrinti-itartina-sms-nuoroda/
author: deividas-lis
content_type: technical-guide
publication_class: technical-assessment
confidence: high
tlp: clear
categories: [fraud-scams, social-engineering, tradecraft]
tags: [SMS, smishing, phishing, scam, URL, defang, redirects, cloaking, NKSC, incident response, Lithuania]
featured: false
draft: false
published: true
toc: true
comments: false
prose_width: wide
scope: "Vartotojams ir organizacijų darbuotojams skirtas gynybinis įtartinų SMS bei jose esančių URL vertinimo procesas, nuo įrodymų išsaugojimo ir patikros oficialiu kanalu iki analitikams skirtos kontroliuojamos peradresavimų analizės."
limitations: "Vadovas nepaverčia vieno reputacijos rezultato saugumo verdiktu, nerekomenduoja atverti nežinomų nuorodų asmeniniame įrenginyje ir neapima aktyvaus svetimų sistemų testavimo, formų pildymo ar apsaugos mechanizmų apėjimo."
methods: [standards-aware URL parsing, evidence preservation, passive-source review, controlled local redirect demonstration, official-channel verification, incident-response triage]
evidence_basis: "IANA ir IETF URL standartai, ICANN RDAP informacija, NKSC, RRT, Lietuvos banko ir Lietuvos policijos rekomendacijos, oficiali urlscan.io, VirusTotal bei Google dokumentacija ir lokaliame 127.0.0.1 demonstratoriuje sukurti pavyzdžiai."
key_findings:
  - "Daugumai gavėjų saugiausia ne analizuoti puslapį, o išsaugoti žinutę ir nepriklausomai patikrinti tariamą įvykį oficialioje programėlėje ar pačių įvestoje svetainėje."
  - "Originalus URL yra įrodymas, o neutralizuota kopija skirta saugiai dalytis. Viena neturi pakeisti kitos."
  - "Sutrumpintos nuorodos galutinės paskirties patikimai nenustatysime be jau egzistuojančio viešo stebėjimo arba tinklo užklausos, kuri gali atskleisti gavėjo žymą ir pakeisti serverio elgesį."
  - "Lookup ir submission nėra tas pats. Pateikiant privatų URL trečiajai šaliai galima atskleisti telefono numeriui ar gavėjui unikalų token'ą, o viešas skenas tampa viešu įrašu."
  - "Redirects ir cloaking reiškia, kad vienas klientas, laikas ar regionas gali pamatyti kitą turinį. Vienas švarus screenshot'as neįrodo, kad URL saugus."
  - "Jeigu jau suvesti prisijungimo ar kortelės duomenys, patvirtintas Smart-ID prašymas arba įdiegta programa, analizę reikia nutraukti ir pereiti prie incidento valdymo."
image:
  path: /assets/img/posts/2026-08-31-suspicious-sms-guide/suspicious-sms-guide-hero.svg
  social: /assets/img/social/suspicious-sms-link-safety-guide-lt.png
  thumbnail: /assets/img/posts/2026-08-31-suspicious-sms-guide/suspicious-sms-guide-hero.svg
  alt: "Praktinis įtartinos SMS phishing nuorodos patikros procesas nuo išsaugojimo ir defang iki oficialaus patikrinimo bei incidento valdymo"
  width: 1600
  height: 900
---

## Pirmiausia: jums nebūtina tapti URL analitiku

Į telefoną ateina žinutė: siuntos nepavyko pristatyti, kelių mokestis neapmokėtas, banko paskyra bus užblokuota, mokesčių inspekcija turi grąžinti pinigus arba vaikas rašo iš "naujo numerio". Liko 30 minučių. Suma nedidelė. Nuoroda trumpa. Siuntėjo vardas pažįstamas.

Tai nebūtinai phishing. Tačiau nė vienas iš šių požymių neįrodo, kad žinutė tikra. SMS siuntėjo vardas, logotipas puslapyje, HTTPS spynelė ir taisyklinga lietuvių kalba yra pateikimo detalės, o ne siuntėjo tapatybės garantija.

Gera naujiena paprasta: **daugumai žmonių visai nereikia atverti SMS nuorodos, kad išsiaiškintų, ar prašymas tikras**. Siuntą galima rasti oficialioje kurjerio programėlėje, banko perspėjimą – banko programėlėje, baudą ar mokestį – pačių įvestoje institucijos svetainėje. Jei ten nieko nėra, žinutės sukurta skuba netampa jūsų problema.

Šiame vadove parodau dvi atskiras zonas:

1. **gavėjo zona**, kurioje žinutė išsaugoma, nuoroda neatveriama, o įvykis patikrinamas nepriklausomu kanalu
2. **analitiko zona**, kurioje, esant tikslui, įgaliojimui ir izoliacijai, galima tirti peradresavimus bei skirtingą serverio elgesį.

Jos neturi susimaišyti. Žmogui, norinčiam sužinoti, ar tikrai vėluoja jo siunta, nereikia namuose statytis phishing laboratorijos.

<aside class="hx-callout warning"><strong>Jeigu jau suvedėte duomenis</strong>Nebetęskite nuorodos analizės, jei pateikėte banko, kortelės ar prisijungimo duomenis, patvirtinote Smart-ID ar kitą MFA užklausą, pervedėte pinigų arba įdiegėte programą. Pereikite tiesiai prie incidento valdymo veiksmų šiame vadove.</aside>

## 30 sekundžių patikra prieš bet kokį paspaudimą

Užtenka penkių klausimų:

- **Ar laukiau tokio įvykio?** Jei ne, žinutė turi įrodyti savo teisėtumą kitu kanalu.
- **Ar žinutė skubina, grasina arba siūlo neįprastai lengvą naudą?** Skuba skirta sutrumpinti jūsų mąstymo laiką.
- **Ar prašoma prisijungti, pateikti kortelę, Smart-ID PIN, OTP, asmens kodą ar įdiegti programą?** Tai jau ne informacinė žinutė.
- **Ar tariamą įvykį galiu patikrinti neatverdamas nuorodos?** Dažniausiai taip.
- **Ar adresas tikrai priklauso organizacijai?** Skaitykite hostą, ne logotipą ir ne žodį URL pradžioje.

Greitas sprendimų medis:

```text
Netikėta SMS su nuoroda
  ├─ nieko nespaudžiau
  │    ├─ išsaugau žinutę ir ekrano kopiją
  │    ├─ tikrinu oficialioje programėlėje ar pačių įvestoje svetainėje
  │    └─ pranešu NKSC, tada blokuoju ir pašalinu
  └─ paspaudžiau arba pateikiau duomenis
       ├─ nutraukiu sąveiką
       ├─ pagal pateiktus duomenis kreipiuosi į banką, paskyros valdytoją ar IT
       ├─ išsaugau laiką, SMS ir matytus veiksmus
       └─ pranešu NKSC ir, jei nukentėjau nuo scam, policijai
```

![Kontroliuojamas įtartinos SMS pavyzdys su pažymėtu siuntėjo neapibrėžtumu, skubinimu, URL hostu ir jautrių duomenų prašymu](/assets/img/posts/2026-08-31-suspicious-sms-guide/sms-anatomy-lt.svg)
*Kontroliuojamas pavyzdys naudoja IANA rezervuotą `.example` vardą. Jis neatkuria realios kampanijos ir nėra aktyvi nuoroda.*

## Išsaugokite įrodymą prieš blokuodami siuntėją

Pranešimo kokybė priklauso ne nuo to, kiek portalų spėjote atverti, o nuo to, ar išsaugojote pirminį signalą. Prieš ištrindami žinutę užfiksuokite:

- visą SMS tekstą, jo nenukerpant
- rodomą siuntėjo vardą arba telefono numerį
- gavimo datą, laiką ir laiko juostą
- visą matomą URL
- žinutės ekrano kopiją
- ar nuoroda buvo paspausta
- ką tiksliai matėte ir kokius veiksmus atlikote
- jei nukentėjote, operacijų laiką, sumas ir banko ar paskyros perspėjimus.

Jei telefone nuoroda sutrumpinta ekrane, neskubėkite jos ilgai spausti vien dėl "Copy link". Kai kurios programėlės tokiu veiksmu gali atverti peržiūrą. Pirmiausia padarykite ekrano kopiją. Organizacijoje naudokite nustatytą pranešimo kanalą, nes įmonės mobiliojo įrenginio valdymas ar saugumo agentas gali turėti saugesnį originalo surinkimo būdą.

### Originalas ir defanginta kopija atlieka skirtingas funkcijas

**Originalus URL** turi likti privačiame įrodymų rinkinyje tiksliai toks, koks gautas. Jame gali būti gavėjo identifikatorius, kampanijos token'as, telefono numeris, el. paštas ar session reikšmė. Originalą keisdami prarandame informaciją.

**Defanginta kopija** skirta užrašams, pokalbiams ir ataskaitoms. Dažniausiai keičiama:

```text
Originalas privačiame įrodyme:
https://parcel-check.invalid/track?id=REDACTED

Neutralizuota kopija darbui:
hxxps://parcel-check[.]invalid/track?id=REDACTED
```

`https` pakeitimas į `hxxps` ir taško pakeitimas į `[.]` sumažina netyčinio paspaudimo riziką. Tačiau tai nėra šifravimas ir nepaslepia adreso nuo skaitytojo. Prieš dalydamiesi pašalinkite asmeninius query parametrus tik iš darbinės kopijos, o originalą išsaugokite pagal jūsų įrodymų tvarką.

![Lokaliame 127.0.0.1 demonstratoriuje parodytas originalo išsaugojimas, defanginta kopija ir URL laukų išskaidymas be DNS ar HTTP užklausos](/assets/img/posts/2026-08-31-suspicious-sms-guide/controlled-defang-lt.png)
*Ekrano kopija padaryta kontroliuojamoje vietinėje HECAVEX laboratorijoje. Pavyzdys nerezolvino viešo domeno ir nepateikė URL trečiajai šaliai.*

## Kaip skaityti URL, o ne jame parašytą istoriją

Pagal [RFC 3986](https://www.rfc-editor.org/rfc/rfc3986.html) ir naršyklėse taikomą [WHATWG URL standartą](https://url.spec.whatwg.org/) URL sudaro atskiri komponentai:

```text
schema://userinfo@host:port/path?query#fragment
```

Svarbiausias vartotojui yra **host**. Jis yra tarp `//` ir pirmojo `/`, `?` ar `#`, atmetus galimą `userinfo@` dalį bei portą. Kelias, query ir fragmentas gali turėti bet kokį prekės ženklo pavadinimą, bet neperduoda tam prekės ženklui domeno kontrolės.

Palyginkime saugius, rezervuotus pavyzdžius:

| Defangintas URL | Tikrasis hostas | Kas gali suklaidinti |
| --- | --- | --- |
| `hxxps://bankas[.]example/login` | `bankas.example` | žodis `bankas` nėra realaus banko nuosavybės įrodymas |
| `hxxps://bankas.lt.login-check[.]example/` | `bankas.lt.login-check.example` | `bankas.lt` čia yra tik ilgesnio hosto pradžia |
| `hxxps://bankas.lt@verify[.]example/session` | `verify.example` | tekstas prieš `@` yra `userinfo`, ne paskirties hostas |
| `hxxps://parcel[.]example/https/bankas.lt` | `parcel.example` | tikro domeno tekstas įrašytas į kelią |
| `hxxps://xn--.../` | naršyklės iškoduojamas IDN hostas | panašūs Unicode simboliai gali būti sunkiai atskiriami |

Praktiniai principai:

1. skaitykite hostą iš dešinės į kairę, bet registruojamo domeno ribą tikrinkite pagal viešą suffix informaciją, o ne spėkite vien iš taškų skaičiaus
2. atkreipkite dėmesį į `@`, netikėtą portą, IP adresą vietoje vardo, labai ilgą subdomeną ir `xn--` formą
3. nevertinkite vien TLD, nes ir `.lt`, ir bet kuris kitas domenas gali būti panaudotas piktavališkai arba sukompromituotas
4. HTTPS reiškia šifruotą ryšį su tuo hostu, kurį atvėrėte. Jis nepatvirtina, kad hostas priklauso žinutėje minimam bankui ar kurjeriui.

Registracijos kontekstui geriau naudoti [ICANN RDAP informaciją](https://www.icann.org/rdap/) ir [ICANN Lookup](https://lookup.icann.org/) negu pasikliauti atsitiktine WHOIS svetaine. RDAP gali parodyti registratorių, būsenas, vardų serverius ir registracijos laiką, tačiau dalis duomenų teisėtai slepiama. Naujas domenas gali stiprinti įtarimą, bet senas domenas gali būti perimtas ar sukompromituotas. Registracijos amžius yra signalas, ne nuosprendis.

Šio vadovo iliustracijose naudojami `.example` ir `.invalid`, kuriuos [IANA rezervavo dokumentacijai ir testams](https://www.iana.org/assignments/special-use-domain-names). Tai daug saugiau negu mokomajame pavyzdyje sugalvoti realiai užregistruojamą vardą ir po metų netyčia nusiųsti skaitytojus jo naujam savininkui.

## Trumpa nuoroda yra analizės riba, ne automatinis blogio ženklas

Nuorodų trumpinimo paslaugos naudojamos teisėtai rinkodarai, bilietams, apklausoms ir pranešimų ilgiui sumažinti. Jos taip pat slepia galutinį hostą. Gavėjas iš `short.example/8Qv2` teksto negali patikimai žinoti, ar po jo yra oficiali svetainė, dar trys redirect'ai, individuali gavėjo žyma ar phishing puslapis.

Čia svarbus techninis faktas: **shortener'io paskirties nenustatysime vien "iššifravę" tekstą**. Reikia vieno iš dviejų dalykų:

- jau egzistuojančio, patikimo viešo stebėjimo, kuriame tas pats tikslus URL buvo išspręstas anksčiau
- naujos tinklo užklausos į trumpinimo paslaugą.

Antroji parinktis jau yra aktyvus veiksmas. Serveris gali gauti šaltinio IP, laiką, naršyklės požymius ir unikalų token'ą. Vienkartinė nuoroda gali būti pažymėta kaip panaudota. Operatorius gali pakeisti paskirties puslapį, o jūsų užklausa gali atskleisti, kad kampanija tiriama. Todėl vartotojui nerekomenduoju "expandinti" įtartinos nuorodos savo telefone ar asmeniniame kompiuteryje.

Google Mandiant yra dokumentavusi, kaip [shortener'iai, vietovės tikrinimas, CAPTCHA ir analytics priemonės buvo panaudotos nukreipimo grandinėse](https://cloud.google.com/blog/topics/threat-intelligence/how-attackers-weaponize-digital-analytics-tools). Tai nepadaro visų shortener'ių kenkėjiškais. Tai paaiškina, kodėl trumpa nuoroda savaime nepateikia pakankamai informacijos saugumo sprendimui.

## Keturi analizės lygiai: sustokite ties žemiausiu pakankamu

![Keturių lygių saugios SMS nuorodos patikros eiga nuo išsaugojimo be tinklo iki kontroliuojamo atvėrimo analitikams](/assets/img/posts/2026-08-31-suspicious-sms-guide/safe-check-workflow-lt.svg)
*Daugumai gavėjų pakanka pirmų dviejų lygių. Trečias reikalauja privatumo sprendimo, ketvirtas – izoliuotos ir įgaliotos analitiko aplinkos.*

### 1 lygis: žinutė ir URL be tinklo

Tikslas – suprasti, ką gavote, niekur nesikreipiant.

- išsaugokite įrodymą
- sukurkite defangintą darbinę kopiją
- atskirkite schema, host, portą, path, query ir fragmentą
- pažymėkite skubinimą, prašomą veiksmą ir jautrius duomenis
- patikrinkite, ar query gali turėti gavėjo identifikatorių
- užrašykite hipotezę ir alternatyvą, pavyzdžiui, "galimas kurjerio impersonation" ir "galimas klaidingai suformatuotas teisėtas pranešimas".

Šiame lygyje nedaroma DNS užklausa, neatveriamas shortener'is, URL neįklijuojamas į paiešką ar skenerį. Vien URL teksto dažnai pakanka nuspręsti jo nenaudoti, bet ne visada pakanka viešai paskelbti, kad infrastruktūra kenkėjiška.

### 2 lygis: nepriklausomas organizacijos patikrinimas

Tai didžiausią praktinę vertę turintis žingsnis.

- atverkite jau įdiegtą oficialią programėlę
- naršyklėje patys įveskite jums žinomą oficialų adresą arba naudokite patikimą bookmark
- paskambinkite numeriu, esančiu mokėjimo kortelėje, oficialioje svetainėje ar sutartyje
- siuntos kodą įveskite tik oficialioje kurjerio sistemoje, jei pats kodas nelaikomas jautriu jūsų situacijoje
- paklauskite organizacijos, ar ji siunčia tokio tipo pranešimus ir ar mato nurodytą veiksmą jūsų paskyroje.

Nenaudokite SMS pateikto telefono numerio, atsakymo adreso ar "pagalbos" mygtuko. Jei banko programėlėje nėra mokėjimo, prisijungimo ar įspėjimo, jums nereikia įrodyti, kas valdo nuorodą, kad jos neatvertumėte.

[Lietuvos bankas apie duomenų viliojimą](https://www.lb.lt/lt/duomenu-viliojimas) rekomenduoja neskubėti, nespausti įtartinų SMS nuorodų ir neatskleisti PIN, CVV, kortelės bei interneto banko duomenų. Svarbi detalė: banko ar Smart-ID patvirtinimo lange skaitykite, **kokį veiksmą ir kokiai sumai tvirtinate**, o ne vien tai, kas jums sakoma telefonu ar puslapyje.

### 3 lygis: pasyvus kontekstas su privatumo sprendimu

Šis lygis tinka žmogui, kuris supranta, ką konkreti užklausa atskleis, arba organizacijos saugumo komandai. Galima tikrinti:

- ar domenas turi jau egzistuojantį RDAP įrašą ir kada registruotas
- ar viešuose Certificate Transparency duomenyse matyti sertifikatų vardai
- ar paieškos sistemoje, HECAVEX Radar ar kituose **jau surinktuose** šaltiniuose yra tas pats hostas
- ar saugumo paslauga jau turi rezultatą tam pačiam URL ar domenui
- ar organizacija paskelbė perspėjimą apie kampaniją.

Čia reikia atskirti tris skirtingus veiksmus:

| Veiksmas | Kas vyksta | Pagrindinė riba |
| --- | --- | --- |
| vietinis URL išskaidymas | tekstas analizuojamas jūsų įrenginyje | jokio kontakto su hostu ar trečiąja šalimi |
| esamo įrašo paieška | klausiama trečiosios šalies duomenų bazės | paieškos teikėjas mato jūsų užklausą, bet puslapis nebūtinai atveriamas |
| naujas pateikimas arba skenas | trečioji šalis gauna URL ir gali jį atverti | galimas URL, token'o, PII bei tyrimo intereso atskleidimas |

Nulinis aptikimų skaičius nereiškia "saugu". Domenas gali būti naujas, puslapis gali veikti tik viename regione arba reputacijos paslauga dar gali neturėti stebėjimo. Teigiamas rezultatas irgi turi laiką, aprėptį bei klasifikavimo priežastį. Vieno tiekėjo etiketė nėra teismo nuosprendis.

### Lookup nėra submission: prieš įklijuodami URL sustokite

[VirusTotal paaiškina](https://docs.virustotal.com/docs/how-it-works), kad standartiniu būdu pateiktų failų ir URL pagrindiniai rezultatai dalijami su analizės partneriais. Privatūs URL yra atskira, specialių teisių reikalaujanti [Private Scanning](https://docs.virustotal.com/docs/private-scanning) funkcija. Vadinasi, "įmesiu į VirusTotal pažiūrėti" nėra neutralus vietinis veiksmas.

urlscan.io turi tris matomumo lygius. Pagal [oficialią matomumo dokumentaciją](https://docs.urlscan.io/pages/visibility):

- **Public** skenas matomas viešame puslapyje ir paieškoje
- **Unlisted** nematomas viešoje paieškoje, bet gali būti matomas patikrintiems urlscan Pro naudotojams
- **Private** skirtas tik pateikėjui ir jo pasirinktiems gavėjams pagal paskyros sąlygas.

![Oficiali urlscan.io dokumentacija apie Public, Unlisted ir Private skenų matomumą](/assets/img/posts/2026-08-31-suspicious-sms-guide/urlscan-visibility-levels.png)
*Dokumentacijos ekranas užfiksuotas 2026 m. rugpjūčio 31 d. Prieš pateikdami URL patikrinkite dabartines paslaugos sąlygas ir paskyros konfigūraciją.*

Jei URL query yra `?phone=...`, `?email=...`, `?parcel=...`, `?session=...` arba atrodo kaip ilgas unikalus token'as, viešas pateikimas gali paskelbti asmeninę ar vienkartinę reikšmę. Vien hosto paieška kartais yra proporcingesnė už viso URL pateikimą, bet ji gali prarasti konkretų path signalą. Tai analitinis ir privatumo sprendimas, ne automatinis copy-paste.

Google Safe Browsing leidžia programas tikrinti pagal žinomų nesaugių išteklių sąrašus, tačiau [oficiali dokumentacija](https://developers.google.com/safe-browsing/reference/rest) aiškiai apibrėžia paslaugos paskirtį ir naudojimo sąlygas. Toks lookup parodo, ar resursas žinomas konkrečiam sąrašui tuo metu. Jis neįrodo, kad nežinomas resursas saugus.

### 4 lygis: kontroliuojamas atvėrimas tik analitikams

Aktyvus atvėrimas turi prasmę tik tada, kai rezultatas pakeis apsaugos, incidento, tyrimo ar pranešimo sprendimą. Reikia bent:

- aiškaus įgaliojimo ir scope
- vienkartinės izoliuotos aplinkos be asmeninių paskyrų, slapukų, naršyklės plėtinių ir slaptažodžių
- kontroliuojamo DNS ir tinklo, laiko sinchronizacijos bei išsaugojamų logų
- draudimo pildyti formas, pateikti OTP, mokėjimo ar tikrus prisijungimo duomenis
- abort sąlygų atsisiuntimui, naršyklės exploit požymiams, netikėtam išoriniam hostui ar autentifikavimo prašymui
- įrodymų provenance, kas, kada, iš kur ir kokia konfigūracija stebėjo rezultatą.

Tai nėra rekomendacija atverti URL virtualioje mašinoje, prijungtoje prie jūsų namų tinklo. "VM" savaime nepašalina IP, fingerprint, vienkartinio token'o, teisinių ir operacinių ribų.

## Redirects ir cloaking: kodėl kitas žmogus gali pamatyti kitą puslapį

HTTP `301`, `302`, `303`, `307` ar `308` atsakymas gali nurodyti kitą vietą. Peradresuoti gali ir JavaScript, meta refresh, programėlė ar platformos tarpinis puslapis. Keli redirect'ai nėra savaime kenkėjiški. Juos teisėtai naudoja prisijungimo sistemos, kampanijų matavimas ir kalbos pasirinkimas.

Rizika atsiranda tada, kai grandinė slepia galutinę paskirtį arba turinį parenka pagal lankytojo požymius. Gynybine prasme cloaking gali remtis:

- IP adresu, šalimi, ASN ar duomenų centro reputacija
- `User-Agent`, įrenginiu, operacine sistema ir kalba
- `Referer` bei tuo, ar atėjote iš SMS, reklamos ar konkretaus puslapio
- query token'u, slapuku, sesija ir ankstesniu apsilankymu
- data, valanda, kampanijos limitu arba vienkartiniu panaudojimu
- automatizavimo, headless naršyklės ar security scanner požymiais
- CAPTCHA, tarpiniu puslapiu arba reikalavimu pirmiausia atlikti gestą.

[Google cloaking apibrėžia](https://developers.google.com/search/docs/essentials/spam-policies#cloaking) kaip skirtingo turinio pateikimą siekiant klaidinti, o Mandiant aprašyti atvejai rodo, kaip [impersonation, cloaking ir redirects naudojami kenkėjiškose nukreipimo grandinėse](https://cloud.google.com/blog/topics/threat-intelligence/detecting-disrupting-malvertising-backdoors). Tie patys techniniai signalai gali turėti teisėtą paskirtį. Išvada turi remtis turiniu, elgesiu, laiku ir kontekstu, ne vien faktu, kad serveris tikrina šalį.

![Gynybinė redirect ir cloaking schema, rodanti, kaip tas pats SMS URL pagal tokeną, klientą, vietovę ar laiką gali pateikti skirtingą rezultatą](/assets/img/posts/2026-08-31-suspicious-sms-guide/redirect-cloaking-lt.svg)
*Vienas švarus atsakas į vieną užklausą apibūdina tik tą stebėjimą. Jis neįrodo, kad kitas gavėjas, įrenginys ar laikas gaus tą patį.*

Kontroliuojamame 127.0.0.1 demonstratoriuje trumpa nuoroda grąžino du `302`, tada vietinį `200`. Tai parodo, ką matė konkretus klientas, bet ne ką pamatytų kitas klientas.

![Vietinėje laboratorijoje parodyta trijų žingsnių 302, 302 ir 200 peradresavimų grandinė be kontakto su vieša infrastruktūra](/assets/img/posts/2026-08-31-suspicious-sms-guide/controlled-redirect-trace-lt.png)
*Ši ekrano kopija nėra realaus phishing puslapio analizė. Grandinė sukurta tik `127.0.0.1`, nenaudojo gavėjo token'o ir nekontaktavo jokio viešo hosto.*

Jei norite giliau suprasti šį reiškinį, [HECAVEX cloaking tyrimas](/lt/tyrimai/kai-fake-news-scamai-ir-cloaking/) nagrinėja stebėjimo matricą ir analitines ribas. Jeigu tikslas yra iš vieno domeno pereiti prie susijusios infrastruktūros, pradėkite nuo vadovo [kodėl vienas scam domenas retai būna vienas](/lt/tyrimai/vienas-scam-domenas-retai-buna-vienas/), o ne nuo nekontroliuojamo URL atidarinėjimo.

## Ką daryti po paspaudimo ar duomenų suvedimo

Vien nuorodos atvėrimas nereiškia, kad telefonas automatiškai perimtas. Poveikis priklauso nuo to, kas įvyko toliau. Nesigėdykite ir neslėpkite fakto, kad paspaudėte. Laikas svarbesnis už norą atrodyti neklystančiam.

| Kas įvyko | Veiksmai dabar | Ko nedaryti |
| --- | --- | --- |
| tik perskaitėte SMS | išsaugokite, patikrinkite oficialiu kanalu, praneškite, blokuokite | neatsakykite siuntėjui ir neatverkite "patikrinti" |
| atvėrėte puslapį, bet nieko nevedėte ir neįdiegėte | užverkite, užfiksuokite laiką bei matytą hostą, patikrinkite downloads ir suteiktus leidimus, atnaujinkite įrenginį | negrįžkite daryti screenshot'ų asmeniniame įrenginyje ir nespauskite CAPTCHA instrukcijų |
| įvedėte paskyros slaptažodį | iš patikimo įrenginio atverkite oficialią svetainę, pakeiskite slaptažodį, atšaukite aktyvias sesijas, patikrinkite recovery duomenis ir įjunkite MFA | nekeiskite slaptažodžio per SMS nuorodą ir nepatvirtinkite netikėtos MFA užklausos |
| įvedėte darbo paskyros duomenis | nedelsdami skambinkite savo IT arba SOC, pateikite laiką ir paskyros vardą, vykdykite jų incidento ribojimo veiksmus | nelaukite ryto ir nebandykite patys "išvalyti" audit logų |
| įvedėte kortelės ar banko duomenis | skubiai susisiekite su banku oficialiu numeriu, blokuokite kortelę, peržiūrėkite operacijas ir nurodykite, ką patvirtinote | nesiderėkite su siuntėju ir netvirtinkite "atšaukimo" per Smart-ID |
| patvirtinote Smart-ID, OTP, mokėjimą ar naują įrenginį | nedelsdami skambinkite bankui ar paskyros valdytojui, pasakykite tikslų patvirtinimo tekstą ir laiką, inicijuokite policijos pranešimą | nepasikliaukite vien slaptažodžio pakeitimu, nes sesija ar operacija jau galėjo būti patvirtinta |
| atsisiuntėte failą, bet neatvėrėte | neatverkite, išsaugokite pavadinimą ir šaltinį, darbo įrenginyje perduokite IT pagal procedūrą | nekelkite privataus failo į viešą skenerį neįvertinę duomenų atskleidimo |
| įdiegėte programą, profilį ar suteikėte Accessibility, Device Admin ar nuotolinės prieigos teises | atjunkite įrenginį nuo tinklo, kitu patikimu kanalu kreipkitės į IT ar kvalifikuotą pagalbą, iš kito įrenginio apsaugokite paskyras | nenaudokite galimai paveikto įrenginio bankui ar slaptažodžių keitimui, kol jis neįvertintas |

[Lietuvos bankas nukentėjusiems rekomenduoja](https://www.lb.lt/lt/pakliuvau-sukciams-ka-daryti) nutraukti bendravimą su sukčiais, nedelsiant kreiptis į mokėjimo paslaugų teikėją, kortelės duomenų vagystės atveju ją skubiai blokuoti ir informuoti policiją. Banko numerį imkite iš kortelės, oficialios programėlės arba pačių atvertos svetainės, ne iš gautos SMS.

## Kur tiksliai pranešti Lietuvoje

### 1. NKSC, kai gavote įtartiną nuorodą ar melagingą žinutę

Atverkite **patys**, ne per SMS, [NKSC pranešimų puslapį](https://www.nksc.lt/pranesti.html). Dabartiniame puslapyje situacijos atskirtos:

- **"Gavau nuorodą į įtartiną svetainę"** → [pranešti apie phishing svetainę](https://www.nksc.lt/pranesti-svetaine.html)
- **"Gavau melagingą žinutę / skambutį"** → [pranešti apie žinutę ar skambutį](https://www.nksc.lt/pranesti-zinute.html)
- jei jau patyrėte techninį poveikį, [praneškite apie kibernetinį incidentą](https://www.nksc.lt/pranesti-incidenta.html).

NKSC taip pat nurodo `cert@nksc.lt` ir numerį `1843`, jei nežinote, kurią formą pasirinkti. RRT 2026 m. rugpjūčio rekomendacijoje taip pat ragina [apie įtartiną žinutę ar galimai kenkėjišką nuorodą pranešti NKSC](https://rrt.lt/naujienos/rrt-apgaulingu-skambuciu-ir-sms-mazeja-taciau-sukciai-aktyviai-naudojasi-bendravimo-programelemis).

![NKSC forma, skirta pranešti apie phishing ir kitam scam naudojamą svetainę](/assets/img/posts/2026-08-31-suspicious-sms-guide/nksc-report-phishing-form.png)
*NKSC formos ekranas užfiksuotas 2026 m. rugpjūčio 31 d. Formos išvaizda gali keistis, todėl naudokite nuolat atnaujinamą `nksc.lt/pranesti.html` pradžios puslapį.*

Pateikite originalų URL formoje, kuriai jis skirtas, ir pridėkite siuntėjo numerį, laiką bei kontekstą. Viešame socialinio tinklo įraše ar komentare naudokite tik defangintą, nuo asmeninių token'ų išvalytą kopiją.

### 2. Bankas arba kitas paskyros valdytojas, jei pateikėte duomenis

Susisiekite oficialiu kanalu nedelsdami. Pasakykite:

- kada gavote ir atvėrėte žinutę
- kokius laukus pildėte
- ar vedėte PIN1, PIN2, OTP, CVV ar kortelės PIN
- ką tiksliai rodė patvirtinimo langas
- ar įdiegėte programą arba suteikėte leidimus
- kokias nežinomas operacijas jau matote.

Nevadinkite visko tiesiog "nulaužė telefoną", jei to nežinote. Tikslus veiksmų aprašymas leidžia bankui ar saugumo komandai greičiau pasirinkti tinkamą incidento ribojimą.

### 3. Lietuvos policija, jei nukentėjote nuo scam

NKSC savo pranešimų puslapyje aiškiai nurodo, kad nuo scam nukentėję asmenys turėtų kreiptis į Lietuvos policiją per [ePolicija](https://www.epolicija.lt/). Jei kyla tiesioginis pavojus žmogui arba vyksta skubus įvykis, naudokite bendrąjį pagalbos numerį 112. Paprastam įtartinos nuorodos persiuntimui 112 nėra URL reputacijos linija.

### 4. Darbo įrenginys ar paskyra

Praneškite organizacijos Service Desk, SOC, CERT, incident response arba kitam jūsų taisyklėse nurodytam kontaktui. Įtraukite darbo ir asmeninį telefoną tik tiek, kiek būtina incidentui. Nesiųskite aktyvios nuorodos dešimčiai kolegų su klausimu "ar čia virusas?" – taip phishing kampanija gauna nemokamą vidinį platinimą.

## Darbo vietos pranešimo šablonas

Trumpas, bet naudingas pranešimas:

```text
Tema: Įtartina SMS / galimas phishing

Gauta: 2026-08-31 14:22 EEST
Įrenginys: organizacijos / asmeninis
Siuntėjas: rodomas vardas arba numeris
Veiksmai: nuoroda nepaspausta / paspausta 14:24 / suvestas tik el. paštas
Prašymas: patikrinti ir informuoti, ar reikia papildomų incidento ribojimo veiksmų
Priedai: originali ekrano kopija, defanginta URL kopija
Originalus URL: perduotas tik patvirtintu incidento kanalu
```

Jeigu paspaudėte, parašykite tiesiai. Saugumo komandai "nieko nedariau" po to, kai proxy loguose matomas jūsų įrenginys, sutaupo lygiai nulį laiko.

## Analitiko kontroliuojama juosta

Toliau pateikti principai skirti komandai, kuri turi įgaliojimą analizuoti išorinį phishing ir aiškias duomenų rinkimo taisykles. Tai nėra instrukcija aukai tęsti tyrimą.

### Suformuluokite klausimą prieš užklausą

Ne "kas ten yra?", o, pavyzdžiui:

- koks buvo galutinis hostas konkrečiu laiku
- ar grandinė bandė surinkti prisijungimo arba mokėjimo duomenis
- ar URL token'as buvo individualus
- ar serveris pateikė skirtingą atsaką pagal regioną arba klientą
- kokį minimalų IOC rinkinį reikia blokuoti
- kuriai institucijai ar paslaugos teikėjui siųsti įrodymą.

Tada nustatykite mažiausią duomenų rinkimo lygį, kuris gali atsakyti. Jei atsakymą jau pateikia archyvuotas viešas stebėjimas, naujo kontakto gali nereikėti.

### Fiksuokite kiekvieną stebėjimą, o ne vien "galutinį URL"

Minimalus įrašas:

```yaml
observed_at: 2026-08-31T11:24:18Z
source: controlled-browser
source_ip_class: documented-egress
client_profile: mobile-safari-emulation-v1
input_url_storage: restricted
request_method: GET
status: 302
location: hxxps://next-hop[.]invalid/gate
content_hash: null
network_contact: true
form_submitted: false
confidence: observed-for-this-client
```

Vienas `302` yra vienas stebėjimas. Tiksliau sakyti "šis klientas tuo metu gavo šią grandinę" negu "nuoroda visada veda ten". Jeigu cloaking hipotezė svarbi, palyginimai turi keisti po vieną kintamąjį ir turėti iš anksto nustatytą stop sąlygą. Neapeidinėkite autentifikavimo, CAPTCHA ar kitų kontrolės priemonių.

### Atskirkite keturias išvadų pakopas

- **observed** – tiesiogiai išsaugotas atsakas, DOM, sertifikatas arba redirect
- **derived** – iš observed duomenų apskaičiuotas hostas, registruojamas domenas, hash arba laiko intervalas
- **assessed** – analitiko išvada, kad turinys tikėtina skirtas credential theft ar brand impersonation
- **attributed** – teiginys apie operatorių, grupę ar kampanijos valdytoją, kuriam reikia gerokai daugiau nepriklausomų įrodymų.

Šių pakopų suplakimas yra dažnesnė problema negu neteisingai perskaitytas TLD. [UNIPARK smishing tyrime](/lt/tyrimai/unipark-smishing-infrastrukturos-tyrimas/) vienas SMS signalas buvo išplėstas per exact-hash ir viešus stebėjimus į didesnį parkingo phishing kit'o cluster'į, bet tai nebuvo paversta nepagrįstu operatoriaus tapatybės teiginiu. Išsamesnį procesą pateikia [phishing infrastruktūros pivoting vadovas](/lt/tyrimai/infrastrukturos-pivoting-101/).

## Ko šis metodas negali pasakyti

- Gerai atrodantis ar "švarus" puslapis vieno patikrinimo metu neįrodo, kad kitas gavėjas nematė phishing.
- Domeno registracijos šalis, IP geolokacija ar telefono šalies kodas neįrodo operatoriaus vietos ar pilietybės.
- Bendras hostingas, TLS issuer, analytics ID ar favicon gali būti naudingi pivotai, bet savaime neįrodo bendro valdytojo.
- HTTPS ir galiojantis sertifikatas neįrodo teisėto prekės ženklo ryšio.
- Reputacijos rezultato nebuvimas neįrodo saugumo, o vieno tiekėjo verdiktas nepaaiškina visos kampanijos.
- Screenshot'as neparodo nematomų request'ų, anksčiau vykusių redirect'ų, formos backend ar to, ką serveris pateiks rytoj.
- Nuorodos neatvėrimas neleidžia nustatyti galutinio shortener'io tikslo. Kartais tai yra sąmoningai pasirinkta ir teisinga analizės riba.

## Dažniausi klausimai

### Ar saugu nukopijuoti SMS nuorodą?

Kopijavimas paprastai nėra tas pats, kas atvėrimas, bet konkreti programėlė gali rodyti preview arba turėti kitą elgesį. Pirmiausia padarykite ekrano kopiją. Jei kopijuojate, originalą laikykite privačiai, o dalijimuisi naudokite defangintą kopiją be asmeninių parametrų.

### Ar galima URL tiesiog įklijuoti į Google?

Paieškos sistema tada gauna jūsų užklausą, o unikalus URL gali turėti telefono numerį ar kampanijos token'ą. Pirmiausia ieškokite tik hosto ar organizacijos perspėjimo. Neįklijuokite viso privataus URL aklai.

### Ar 0/90 VirusTotal reiškia, kad puslapis saugus?

Ne. Tai reiškia, kad konkretaus rezultato metu konkrečios sistemos nepateikė aptikimo. Naujas, cloaked, jau išjungtas arba tik vienam token'ui veikiantis puslapis gali neturėti detekcijų. Vertinkite rezultatą kaip vieną laiko žymą turintį signalą.

### Ar `.lt` domenas patikimesnis už kitą TLD?

Ne automatiškai. Domeno galūnė gali būti konteksto dalis, bet teisėtas domenas gali būti sukompromituotas, o naują vardą gali užregistruoti piktavalis. Svarbu visas hostas, oficialus organizacijos kanalas, registracijos ir elgesio kontekstas.

### Ar galiu pats patikrinti shortener'į su `curl -I`?

Komanda vis tiek siunčia tinklo užklausą. Ji gali atskleisti IP ir token'ą, pažymėti vienkartinę nuorodą kaip panaudotą, o serveris gali skirtingai elgtis su `curl` ir mobiliąja naršykle. Vartotojui saugesnis kelias yra oficialus patikrinimas ir pranešimas. Analitikui reikia izoliuotos, dokumentuotos aplinkos bei aiškaus duomenų rinkimo tikslo.

### Atvėriau puslapį, bet nieko nesuvedžiau. Ar reikia atkurti telefoną gamykliniais nustatymais?

Ne automatiškai. Uždarykite puslapį, patikrinkite downloads ir suteiktus leidimus, atnaujinkite sistemą ir praneškite, jei įrenginys darbinis. Jei buvo atsisiųstas ar įdiegtas turinys, suteiktos aukštos teisės, naršyklė rodė neįprastą elgesį arba organizacijos saugumo komanda mato exploit požymius, tada reikia atskiro įrenginio vertinimo.

### Kur pranešti, jei nieko nepraradau?

Apie įtartiną svetainę ar melagingą žinutę praneškite [NKSC](https://www.nksc.lt/pranesti.html). Jei dėl scam patyrėte žalą ar perdavėte pinigus, papildomai kreipkitės į banką ir [ePolicija](https://www.epolicija.lt/). Darbo žinutę visada perduokite vidiniam saugumo kontaktui.

## Pabaigos kontrolinis sąrašas

```text
[ ] Ekrano kopija ir gavimo laikas išsaugoti
[ ] Originalus URL liko privačiame įrodymų rinkinyje
[ ] Darbinė kopija defanginta, asmeniniai token'ai redacted
[ ] Hostas atskirtas nuo path, query ir teksto prieš @
[ ] Įvykis patikrintas oficialioje programėlėje ar pačių įvestoje svetainėje
[ ] Lookup atskirtas nuo naujo submission
[ ] Vienas reputacijos rezultatas nepaverstas verdiktu
[ ] Jei suvesti duomenys, analizė sustabdyta ir pradėtas incident response
[ ] Apie nuorodą ar melagingą žinutę pranešta NKSC
[ ] Jei patirta žala, informuotas bankas ir policija
[ ] Darbo atveju informuotas IT, SOC ar CERT
```

Saugus rezultatas nėra "aš įrodžiau, kad puslapis blogas". Dažnai geriausias rezultatas yra daug kuklesnis: išsaugojote signalą, neatskleidėte savo token'o, neperdavėte duomenų, nepridėjote dar vieno apsilankymo kampanijai ir pateikėte pakankamai informacijos tiems, kurie gali veikti.

## Oficialūs ir techniniai šaltiniai

- [NKSC: pranešti apie įtartiną svetainę, melagingą žinutę ar kibernetinį incidentą](https://www.nksc.lt/pranesti.html)
- [RRT: apie įtartinas SMS ir nuorodas rekomenduojama pranešti NKSC](https://rrt.lt/naujienos/rrt-apgaulingu-skambuciu-ir-sms-mazeja-taciau-sukciai-aktyviai-naudojasi-bendravimo-programelemis)
- [Lietuvos bankas: duomenų viliojimas](https://www.lb.lt/lt/duomenu-viliojimas)
- [Lietuvos bankas: pakliuvau sukčiams – ką daryti](https://www.lb.lt/lt/pakliuvau-sukciams-ka-daryti)
- [Lietuvos policijos elektroninių paslaugų sistema](https://www.epolicija.lt/)
- [RFC 3986: URI Generic Syntax](https://www.rfc-editor.org/rfc/rfc3986.html)
- [WHATWG URL Standard](https://url.spec.whatwg.org/)
- [IANA Special-Use Domain Names](https://www.iana.org/assignments/special-use-domain-names)
- [ICANN: Registration Data Access Protocol](https://www.icann.org/rdap/)
- [urlscan.io: Scan Visibility Levels](https://docs.urlscan.io/pages/visibility)
- [VirusTotal: How it works](https://docs.virustotal.com/docs/how-it-works)
- [VirusTotal: Private Scanning](https://docs.virustotal.com/docs/private-scanning)
- [Google Safe Browsing API](https://developers.google.com/safe-browsing/reference/rest)
- [Google Search Central: cloaking apibrėžimas](https://developers.google.com/search/docs/essentials/spam-policies#cloaking)
- [Google Mandiant: kaip grėsmių veikėjai naudoja shortener'ius, vietovę ir analytics](https://cloud.google.com/blog/topics/threat-intelligence/how-attackers-weaponize-digital-analytics-tools)
