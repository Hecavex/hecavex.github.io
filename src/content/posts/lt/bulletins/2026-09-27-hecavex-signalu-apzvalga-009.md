---
published: true
title: "Signalų apžvalga #9: išnaudojami gateway, pavogti tokenai ir debesijos naikinimas"
card_title: "Signalų apžvalga #9: gateway, tokenai ir debesijos prieiga"
description: "F5 APM, SharePoint ir NetScaler išnaudojimas, EvilTokens device-code phishing, destruktyvi veikla Azure ir ENISA grėsmių ataskaitos ribos. Laikotarpis: 2026 m. rugsėjo 21–27 d."
seo_description: "Šeši gynybos prioritetai: išnaudojami F5, SharePoint ir NetScaler, EvilTokens, Azure workload paskyros ir ENISA 2026 m. grėsmių ataskaita."
seo_title: "Gateway, tokenai ir debesijos prieiga | Signalų apžvalga #9"
seo_keywords: [CVE-2026-94127, CVE-2026-65660, CVE-2026-88771, CVE-2026-88772, EvilTokens, Storm-3168]
date: 2026-10-04 11:20:00 +0300
last_reviewed_at: 2026-10-04 11:20:00 +0300
lang: lt
translation_key: hecavex-signal-brief-009
permalink: /lt/apzvalgos/2026-09-27/
author: deividas-lis
content_type: signal-brief
series: hecavex-signal-brief
issue: 9
coverage_start: 2026-09-21
coverage_end: 2026-09-27
information_cutoff: 2026-09-27 23:59:59 +0000
confidence: moderate
tlp: clear
categories: [security-briefings]
tags: [CISA KEV, phishing, SharePoint, network security, ENISA, CTI]
featured: false
draft: false
toc: true
comments: false
research_version: "1.0"
research_status: published
leading_topics:
  - F5, SharePoint ir NetScaler pritaikomumą reikia vertinti atskirai
  - Device-code phishing ir aplikacijų paskyros atveria skirtingas debesijos prieigos ribas
  - Nauja ENISA ataskaita aprašo 2025 m. stebėjimus, ne dabartinę atakos tikimybę
critical_count: 3
high_count: 2
watch_count: 1
scope: "Šeši pasirinkti pokyčiai, paskelbti 2026 m. rugsėjo 21–27 d. Senesni pažeidžiamumai ir veikla įtraukti tik tada, kai šią savaitę pasirodė naujas pranešimas, išnaudojimo vertinimas ar tyrimas."
evidence_basis: "Datuoti gamintojų tyrimai, CERT-EU ir Kanados kibernetinio saugumo centro pranešimai, ENISA publikacijos paaiškinimas bei iki informacijos ribos paskelbtos nekintamos oficialių CISA KEV ir gamintojų CNA įrašų versijos."
methods: [pirminių šaltinių peržiūra, saugumo pranešimų palyginimas, datomis apribota katalogo peržiūra]
limitations: "Retrospektyvi apžvalga parengta spalio 4 d., laikantis rugsėjo 27 d. informacijos ribos. Keičiami pranešimai gali turėti vėlesnių papildymų. Jie nelaikomi istoriniais įrodymais. Neatliktas skenavimas, exploit vykdymas, originalios aukų telemetrijos analizė ar nepriklausoma atribucija."
key_findings:
  - "F5 OAuth vaidmens, SharePoint autentifikuoto įėjimo ir NetScaler konfigūracijos sąlygų negalima sujungti į vieną bendrą internetui atviro pažeidžiamumo aprašymą."
  - "Tikras prisijungimo puslapis neįrodo teisėto sesijos prašymo, o jau suteiktos aplikacijos teisės gali leisti destruktyvią veiklą be naujo programinės įrangos exploit."
  - "Naudojant grėsmių ataskaitą vietiniams sprendimams, turi likti matomos publikacijos datos, stebėjimo laikotarpis ir žinomas vardiklis."
image:
  path: /assets/img/posts/hecavex-signal-brief/session-trust-hero-v1.webp
  social: /assets/img/social/hecavex-signal-brief-009-lt.png
  alt: "Apgaulingas prisijungimo kelias simbolinį prieigos raktą nukreipia pro tapatybės patikrą į debesijos paslaugą."
  thumbnail: /assets/img/posts/hecavex-signal-brief/session-trust-card-v1.webp
  presentation: illustration
  source_type: generated
  provenance_id: hecavex-signal-brief-009-cover-generated-v1
  width: 1600
  height: 900
  thumbnail_width: 720
  thumbnail_height: 405
updates:
  - date: 2026-10-04
    note: "Pirmoji retrospektyvi publikacija apie rugsėjo 21–27 d. Informacijos riba: 2026 m. rugsėjo 27 d., 23:59:59 UTC."
---

Šią savaitę į skubią eilę pateko trys skirtingi įėjimo keliai: OAuth aptarnaujantis gateway, vietinis bendradarbiavimo serveris ir aplikacijų srautą valdantis įrenginys. Debesijos atvejai kitokie. Ten užpuolikui gali padėti patvirtinta sesija arba jau privilegijuota aplikacijos paskyra. Jei visas penkias problemas pavadinsime pataisų diegimu, dalis darbo liks be savininko.

**Laikotarpis: 2026 m. rugsėjo 21–27 d. Retrospektyviai parengta spalio 4 d. Informacijos riba: rugsėjo 27 d., 23:59:59 UTC.** Toliau pateikti šeši prioritetai yra redakciniai sprendimai, ne CVSS kategorijos ir ne visas pažeidžiamumų inventorius. Versijos nurodo datuotas pataisas. Dabar reaguojanti komanda turi tikrinti ir dabartines gamintojo rekomendacijas.

**Metodas ir ribos:** pirminiai pranešimai palyginti su datuotais perspėjimais ir konkrečiomis oficialių katalogų versijomis. Nelaikyta, kad keičiamas puslapis išsaugo visas istorines detales. Tai šaltiniais paremta analizė, ne HECAVEX incidentų telemetrija. Netvirtinama apie kompromitavimą Lietuvoje, exploit atkartojimą ar nepriklausomai atliktą atribuciją.

## Išnaudojamos sistemos: nustatyti tikrą įėjimo kelią

<section class="hx-signal-entry hx-signal-entry--critical" markdown="1">
<p class="hx-signal-label">KRITINIS · PATVIRTINTAS IŠNAUDOJIMAS · OAUTH GATEWAY</p>

### F5 BIG-IP APM: pritaikomumą lemia OAuth vaidmuo

<dl><div><dt>Pažeidžiamumas</dt><dd>CVE-2026-94127</dd></div><div><dt>Svarbi konfigūracija</dt><dd>APM prieigos politika ir OAuth autorizavimo serverio profilis</dd></div></dl>

CERT-EU rugsėjo 22 d. perspėjime nurodytas aktyvus išnaudojimas. Datuotas F5 CNA patikslinimas pažeidžiamą konfigūraciją apriboja APM, veikiančiu kaip OAuth **autorizavimo serveris**, ne vien klientas ar išteklių serveris. Neautentifikuoto kodo vykdymo klaida veikia duomenų, ne administravimo lygmenį. [CERT-EU perspėjimas](https://cert.europa.eu/publications/security-advisories/2026-013/), [F5 CNA versija](https://github.com/CVEProject/cvelistV5/blob/80247b1f62424a8110c2fdd447910e4b8f69de31/cves/2026/94xxx/CVE-2026-94127.json).

**Ką daryti dabar:** patikrinti virtualaus serverio konfigūraciją ir iš F5 gauti konkrečiai šakai skirtą engineering hotfix. CERT-EU rekomenduoja prieš pakeitimus išsaugoti įrodymus ir vertinti kompromitavimą. Naudinga seka apima OAuth nesėkmes, įtartinas audito komandas ir po jų įvykstantį TMM lūžį. Vien lūžis nepatvirtina išnaudojimo. [Datuotos reagavimo rekomendacijos](https://cert.europa.eu/publications/security-advisories/2026-013/).

**Vertinimas:** apribota administravimo sąsaja neuždaro pažeidžiamos paslaugos, kuri priima numatytą aplikacijos srautą. Perduodant užduotį turi būti įvardyti paveiktas listener, konfigūracija, pataisos savininkas ir įrodymų savininkas. Jei inventorius pasako tik "įdiegtas F5", sprendimas dėl pritaikomumo dar nepriimtas.

</section>

<section class="hx-signal-entry hx-signal-entry--critical" markdown="1">
<p class="hx-signal-label">KRITINIS · ŽINOMAS IŠNAUDOJIMAS · VIETINIS SHAREPOINT</p>

### SharePoint: rugpjūčio pataisa tampa rugsėjo incidentų prioritetu

<dl><div><dt>Pažeidžiamumas</dt><dd>CVE-2026-65660</dd></div><div><dt>Naujas prioritetas</dt><dd>Rugsėjo 24 d. perspėjimas ir rugsėjo 25 d. KEV papildymas</dd></div></dl>

Kanados kibernetinio saugumo centro rugsėjo 24 d. perspėjimas patvirtina rugpjūčio 11 d. paskelbtos klaidos išnaudojimą. Bazinė klaida leidžia autentifikuotą kodo vykdymą. Perspėjimas apie kelią iki autentifikacijos susietas su kitais SharePoint pažeidžiamumais ir anonimine prieiga, o ne kiekvienu diegimu. [Kanados perspėjimas](https://www.cyber.gc.ca/en/alerts-advisories/al26-023-vulnerability-impacting-microsoft-sharepoint-server-cve-2026-65660).

CISA ją įtraukė **rugsėjo 25 d.**, kaip rodo [iki informacijos ribos paskelbta KEV versija](https://github.com/cisagov/kev-data/blob/4d1aff213a881341db8a276c89802e05bf69481c/known_exploited_vulnerabilities.json). Gamintojo CNA nurodo pataisytas ribas: Server 2016 – 16.0.5565.1001, Server 2019 – 16.0.10417.20198, Subscription Edition – 16.0.19725.20522. Tai istorinės pataisų nuorodos, ne produkto palaikymo rekomendacija. [Microsoft CNA versija](https://github.com/CVEProject/cvelistV5/blob/1d0322c45d85b2435c572e56f0a1971061e79310/cves/2026/65xxx/CVE-2026-65660.json).

**Ką daryti dabar:** grįžti prie atidėtų rugpjūčio užduočių ir užrašyti faktiškai įdiegtą farm build. Pataisos sprendimą atskirti nuo ankstesnės prieigos peržiūros. Kiekvieno serverio pataisymo laiką palyginti su išlikusiais autentifikacijos, IIS ir endpoint įrodymais. Patvirtinta pakeitimo užduotis įrodo leidimą atnaujinti, ne sėkmingą diegimą ar ankstesnio kompromitavimo nebuvimą. Neatsakytiems įrodymų klausimams paskirti savininką, o ne laikyti visą farm saugia todėl, kad vienas mazgas jau atnaujintas.

</section>

<section class="hx-signal-entry hx-signal-entry--critical" markdown="1">
<p class="hx-signal-label">KRITINIS · ŽINOMAS IŠNAUDOJIMAS · APLIKACIJŲ PRIEIGA</p>

### NetScaler: dviejų išnaudojamų klaidų nesuvesti į DTLS patikrą

<dl><div><dt>Pažeidžiamumai</dt><dd>CVE-2026-88771 ir CVE-2026-88772</dd></div><div><dt>Paskelbimo riba</dt><dd>Rugsėjo 27 d. pranešimai ir tos pačios dienos KEV įrašai</dd></div></dl>

Citrix rugsėjo 27 d. pranešime CVE-2026-88771 aprašytas kaip neautentifikuotas komandų vykdymas, kuriam nereikia papildomos funkcijos. CVE-2026-88772 reikia DTLS, įjungto pagal nutylėjimą VPN virtualiuose serveriuose. Abu buvo [CISA rugsėjo 27 d. kataloge](https://github.com/cisagov/kev-data/blob/4d1aff213a881341db8a276c89802e05bf69481c/known_exploited_vulnerabilities.json). [Citrix pranešimas](https://community.citrix.com/techzone-blogs/110_security-updates/netscaler-adc-and-netscaler-gateway-security-bulletin-for-cve-2026-88771-through-cve-2026-88778/).

Iki informacijos ribos paskelbti gamintojo įrašai įprastoms šakoms nurodo 14.1-73.37 ir 13.1-64.23 pataisytas ribas, o FIPS ir NDcPP – atskirus build. Rinktis reikia tinkamą šaką, ne didžiausią numerį. [NetScaler CNA įrašas](https://github.com/CVEProject/cvelistV5/blob/6dee57bc64de2c78a5beaefa323ecfda583854b3/cves/2026/88xxx/CVE-2026-88771.json).

**Ką daryti dabar:** įtraukti abu kiekvienos įrenginių poros narius, išsaugoti turimus įrodymus ir įdiegti tinkamą palaikomą atnaujinimą. Užrašyti, kurios verslo paslaugos netektų prieigos prireikus izoliuoti įrenginį ir kas turi teisę priimti tokį sprendimą. Neigiamas DTLS patikros rezultatas neatmeta pirmosios klaidos. Sėkmingas programinės įrangos atnaujinimas taip pat nėra išvada apie ankstesnį kompromitavimą. Šį klausimą reikia išlaikyti atskiroje incidento užduotyje ir, kur įmanoma, tikrinti nepriklausoma telemetrija.

</section>

## Debesijos prieiga: svarbi ir sesija, ir paskyra

<section class="hx-signal-entry hx-signal-entry--high" markdown="1">
<p class="hx-signal-label">AUKŠTAS PRIORITETAS · DEVICE-CODE PHISHING · PASKYROS ATKŪRIMAS</p>

### EvilTokens: tikras prisijungimo puslapis gali patvirtinti svetimą sesiją

<dl><div><dt>Nauja informacija</dt><dd>Microsoft techninis tyrimas ir veiklos sutrikdymo pranešimas, rugsėjo 22 d.</dd></div><div><dt>Gynybos riba</dt><dd>Prašoma sesija, tokenai ir pokyčiai po prisijungimo</dd></div></dl>

Microsoft aprašo EvilTokens piktnaudžiavimą įrenginio kodo autentifikacija: auka teisėtame prisijungimo procese patvirtina užpuoliko pradėtą sesiją. Digital Crimes Unit paskelbė sutrikdžiusi infrastruktūros veiklą ir su paslauga susiejo daugiau kaip 12 000 kompromituotų pašto dėžučių. Tai Microsoft matytas mastas, ne Lietuvos aukų skaičius. [Techninis tyrimas](https://www.microsoft.com/en-us/security/blog/2026/09/22/unmasking-eviltokens-getting-to-the-root-of-device-code-phishing/), [veiklos sutrikdymo pranešimas](https://blogs.microsoft.com/on-the-issues/2026/09/22/disrupting-eviltokens-the-ai-chatbot-built-for-cybercrime/).

Microsoft rekomenduoja device-code srautą palikti tik būtinam naudojimui. Reagavimo rekomendacijoje įspėjama, kad refresh token atšaukimas gali laikinai palikti galiojančius access token. Incidento suvaldymui siūloma svarstyti paskyros išjungimą. [Paskyros prieigos stabdymo rekomendacijos](https://www.microsoft.com/en-us/security/blog/2026/09/22/unmasking-eviltokens-getting-to-the-root-of-device-code-phishing/).

**Vertinimas ir veiksmas:** "nuoroda buvo Microsoft" nepakanka incidentui uždaryti. Reikia klausti, kurią aplikaciją ir įrenginį darbuotojas ketino autorizuoti. Prisijungimą, vėlesnes įrenginių registracijas ir pašto dėžutės pokyčius sudėti į vieną laiko juostą. Nežinomus įrašus įvertinti prieš pašalinant. Kiekviena būtina autentifikacijos srauto išimtis turi turėti atsakingą savininką. Paslaugos veiklos sutrikdymas neįrodo, kad konkrečios aukos neteisėta prieiga atšaukta ar pašto dėžutė atkurta.

</section>

<section class="hx-signal-entry hx-signal-entry--high" markdown="1">
<p class="hx-signal-label">AUKŠTAS PRIORITETAS · DEBESIJOS WORKLOAD PASKYROS · NAIKINIMAS</p>

### Storm-3168: įvertinti, ką aplikacijos paskyra gali ištrinti

<dl><div><dt>Tyrimo data</dt><dd>Rugsėjo 25 d., aprašoma birželio tenant veikla</dd></div><div><dt>Reikalinga peržiūra</dt><dd>Faktinės teisės ir atskirai apsaugotas atkūrimas</dd></div></dl>

Microsoft Storm-3168 tyrimas aprašo kompromituotus Azure service principal, kurie rinko informaciją apie išteklius, juos trynė ir rinko prisijungimo medžiagą. Destruktyvi seka truko apie septynias minutes. Svarbi riba: Microsoft **nepatvirtino** pradinės prieigos kelio, sėkmingo duomenų išnešimo ar išpirkos reikalavimo. Viešai atskleista paslaptis yra galima ekspozicija, ne įrodytas įsilaužimo kelias. [Microsoft tyrimas](https://www.microsoft.com/en-us/security/blog/2026/09/25/storm-3168-agentic-driven-cloud-attacks-using-compromised-service-principals/).

**Vertinimas:** praktinė problema yra paskyrai jau suteiktos teisės. Nei veiksmų greitis, nei grėsmės veikėjo pavadinimas neįrodo, kad kiekvieną žingsnį savarankiškai suplanavo AI sistema. Gynybai naudingas klausimas: ar viena aplikacijos paskyra gali sunaikinti produkcinius duomenis ir sutrikdyti jų atkūrimą?

**Ką daryti dabar:** faktines teises, įskaitant paveldėtas, palyginti su dokumentuota aplikacijos paskirtimi. Kontroliuojamoje ir testavimui patvirtintoje aplinkoje surepetuoti veiksmų perdavimą, imituojant paskyros kompromitavimą. Patikrinti, kas gali sustabdyti prieigą, kurie priklausomi workload sustoja ir ar atkūrimas išlieka prieinamas kitam patikimam operatoriui. Debesijos audito įrašus saugoti už tos pačios administravimo rizikos ribos. Sėkminga backup užduotis ir nepriklausomai atkuriama paslauga yra skirtingi bandymo rezultatai.

</section>

## Europos grėsmių vertinimas: nepalikti procento be vardiklio

<section class="hx-signal-entry hx-signal-entry--watch" markdown="1">
<p class="hx-signal-label">STEBĖTI · EUROPA · ANALITINIS ATSKAITOS TAŠKAS</p>

### ENISA Threat Landscape 2026 aprašo 2025 m. stebėjimus

<dl><div><dt>Publikacija</dt><dd>2026 m. rugsėjo 22 d.</dd></div><div><dt>Stebėjimo laikotarpis</dt><dd>2025 m. sausio 1 d.–gruodžio 31 d.</dd></div></dl>

Naujoje ENISA ataskaitoje derinami atvirų šaltinių įvykiai ir anonimizuoti pateikti duomenys. Lydinčiame pranešime pažeidžiamumų išnaudojimas nurodomas maždaug 60 % neteisėtos prieigos atvejų, **kai įėjimo vektorius buvo žinomas**. Šis žinomo vektoriaus pogrupis sudarė tik maždaug 5 % neteisėtos prieigos incidentų. Pašalinus sąlygą, ribotas stebėjimas virsta klaidinančiu bendru rodikliu. [ENISA publikacija](https://www.enisa.europa.eu/publications/enisa-threat-landscape-2026), [datuotas paaiškinimas](https://www.enisa.europa.eu/news/exploring-the-evolution-of-the-cyber-threat-landscape-how-dependencies-weaken-our-digital-resilience).

**Vertinimas ir veiksmas:** naudoti ataskaitą klausimams apie savo aplinką, ne kaip Lietuvos organizacijos atakos tikimybės skaičiuoklę. Pasirinkti vieną svarbią verslo paslaugą ir pažymėti jos tapatybės tiekėją, hostingą, nuotolinį administravimą bei atkūrimo priklausomybes. Kiekvienai reikia savininko ir išbandyto atsarginio kelio. Pristatant išvadas organizacijoje, prie kiekvieno procento palikti stebėjimo datas, rinkimo ribas ir vardiklį. Suskaičiuoti incidentai, finansinis poveikis ir konkrečios paslaugos praradimo pasekmės atsako į skirtingus vadovybės klausimus.

</section>
