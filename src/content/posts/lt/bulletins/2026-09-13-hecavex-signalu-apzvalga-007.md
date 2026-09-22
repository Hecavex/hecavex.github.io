---
published: true
title: "Signalų apžvalga #7: išnaudojami maršrutizatoriai, naršyklių pataisos ir Europos pranešimų laikrodis"
card_title: "Signalų apžvalga #7: maršrutizatoriai, naršyklės ir pranešimų terminai"
description: "MikroTik išnaudojimas, Chrome atnaujinimai, XenServer pasitikėjimo ribos, CRA pranešimai ir Lietuvos grėsmių analizės partnerystė. Laikotarpis: 2026 m. rugsėjo 7-13 d. Parengta retrospektyviai rugsėjo 22 d."
seo_description: "Šaltiniais pagrįsta apžvalga apie MikroTik ir Chrome išnaudojimą, XenServer pataisas, CRA pranešimus ir Lietuvos tarptautinę grėsmių analizę."
seo_title: "Maršrutizatorių išnaudojimas ir CRA | Apžvalga #7"
seo_keywords:
  - "MikroTik RouterOS 2026 rugsėjis"
  - "Chrome CVE-2026-87491"
  - "XenServer Terraform CVE-2026-83496"
  - "CRA pranešimai 2026 rugsėjis"
date: 2026-09-22 14:00:00 +0300
last_reviewed_at: 2026-09-22 14:00:00 +0300
research_version: "1.0"
research_status: published
lang: lt
translation_key: hecavex-signal-brief-007
permalink: /lt/apzvalgos/2026-09-13/
author: deividas-lis
content_type: signal-brief
series: hecavex-signal-brief
issue: 7
coverage_start: 2026-09-07
coverage_end: 2026-09-13
information_cutoff: 2026-09-13 23:59:59 +0000
confidence: moderate
tlp: clear
categories: [security-briefings]
tags: [CTI, MikroTik, Chrome, XenServer, Kibernetinio atsparumo aktas, Lithuania]
featured: false
draft: false
toc: true
comments: false
leading_topics:
  - MikroTik reikia kompromitavimo vertinimo, ne tik atnaujinimo
  - Chrome pataisos pristatymas ir naršyklės paleidimas iš naujo yra atskiros kontrolės
  - XenServer guest ir Terraform kerta skirtingas pasitikėjimo ribas
  - Prasideda CRA pranešimai, Lietuva plečia bendrą grėsmių analizę
critical_count: 2
high_count: 2
watch_count: 1
scope: "Penki pasirinkti pokyčiai, paskelbti arba reikšmingai papildyti 2026 m. rugsėjo 7-13 d. Ankstesni MikroTik pranešimai pateikia rugsėjo 10 d. perspėjimo kontekstą."
evidence_basis: "Datuotos gamintojų, nacionalinių CSIRT, Europos Komisijos ir NKSC publikacijos. Nevykdytas savarankiškas aukų telemetrijos rinkimas, išnaudojimo bandymai ar kampanijų atribucija."
methods: [pirminių šaltinių peržiūra, publikavimo datų tikrinimas, išnaudojimo prielaidų palyginimas, gynybos prioritetizavimas]
limitations: "Retrospektyviai parengta rugsėjo 22 d. pagal ne vėliau kaip rugsėjo 13 d. datuotą medžiagą. Vieši puslapiai gali keistis, tai nėra archyvinis kiekvienos ankstesnės jų versijos atkūrimas. Prioritetai yra redakciniai, ne CVSS balai ar kompromitavimo Lietuvoje įrodymas. CRA dalis yra operacinės gairės, ne teisinė konsultacija."
key_findings:
  - "Maršrutizatoriaus atnaujinimas, naršyklės pataisų diegimas ir kompromitavimo vertinimas atsako į skirtingus klausimus. Kiekvienam reikia atskiro užbaigimo įrodymo."
  - "Virtualizacijos saugumas apima ir hosto izoliaciją, ir valdymo ryšio autentiškumą."
  - "Pranešimų teikimui bei žvalgybos dalijimuisi reikia atsekamo sprendimo įrašo, ne vien didesnio indikatorių kiekio."
image:
  path: /assets/img/series/hecavex-signal-brief.svg
  social: /assets/img/social/hecavex-signal-brief-007-lt.png
  alt: "Signalų apžvalga 7: maršrutizatorių pasiekiamumas, naršyklių pataisos, virtualizacija ir Europos pranešimų sprendimai"
  thumbnail: /assets/img/series/hecavex-signal-brief.svg
updates:
  - date: 2026-09-22
    note: "Pirmoji retrospektyvi rugsėjo 7-13 d. apžvalgos publikacija. Publikavimo data ir informacijos riba sąmoningai atskirtos."
---

**Retrospektyvus leidimas, parengtas 2026 m. rugsėjo 22 d.** Apžvalga apima rugsėjo 7-13 d. ir remiasi iki nurodytos informacijos ribos datuota medžiaga. Tai nėra tekstas, tariamai publikuotas rugsėjo 13 d. Operacinės rekomendacijos yra HECAVEX šios medžiagos vertinimas, ne naujo incidento tyrimo įrodymai.

Bendra savaitės problema yra tarpas tarp techninio įvykio ir užbaigto sprendimo. Gamintojas išleidžia pataisą, bet pažeidžiamas procesas lieka veikti. Administratorius atnaujina maršrutizatorių, bet nepatikrina, ar prieš tai kas nors nepakeitė jo konfigūracijos. Pranešimas pasiekia pašto dėžutę, bet niekas neužfiksuoja, kada organizacija sužinojo apie įvykį ir kas turi apie jį pranešti.

Todėl penkiuose įrašuose atskirta, **ką patvirtina šaltinis**, **kas lieka nežinoma** ir **ką gynėjas turi užbaigti**. Du kritiniai prioritetai pagrįsti praneštu išnaudojimu. Du aukšti prioritetai susiję su svarbia pasitikėjimo riba ir jau taikoma pranešimų pareiga. Stebėjimo įrašas yra institucinis pokytis, ne perspėjimas apie ataką.

## Išnaudojimas ir užbaigimo įrodymai

<section class="hx-signal-entry hx-signal-entry--critical" markdown="1">
<p class="hx-signal-label">KRITINIS PRIORITETAS · ŽINOMAS IŠNAUDOJIMAS · MARŠRUTIZATORIŲ VALDYMAS</p>

### MikroTik: pataisytas maršrutizatorius dar nėra patikimas maršrutizatorius

Kanados kibernetinio saugumo centro rugsėjo 10 d. perspėjimas papildė ankstesnius MikroTik pranešimus ir nurodė, kad tą dieną CISA į KEV įtraukė CVE-2026-67277 bei CVE-2026-86060. Pataisos įvardytos RouterOS 6.49.21, 7.23.4 long-term, 7.24.2 stable ir 7.25 beta 3. Tai istorinės atskaitos versijos, ne rekomendacija gamybinę aplinką perkelti į beta kanalą. [Kanados centro perspėjimas](https://www.cyber.gc.ca/en/alerts-advisories/al26-020-vulnerabilities-impacting-mikrotik-routeros-cve-2026-67276-cve-2026-67277-cve-2026-86060).

CERT Polska jau buvo pranešusi apie su SSH susijusios MikroTrick grandinės, apimančios CVE-2026-67276 ir CVE-2026-86060, išnaudojimą. CVE-2026-67277 susijęs su atskiru bandwidth-test servisu. Gamintojas rekomenduoja riboti nepatikimą SSH prieigą ir po atnaujinimo tikrinti neatpažįstamą konfigūraciją. CERT Polska taip pat perspėja, kad "Flagged" žymos nebuvimas neatmeta kompromitavimo. Uždarytas įėjimo kelias ir patikima įrenginio būsena yra du skirtingi klausimai. [CERT Polska analizė](https://cert.pl/en/posts/2026/09/vulnerabilities-in-mikrotik-routeros-actively-exploited/), [MikroTik pranešimas](https://mikrotik.com/supportsec/september-2026-vulnerability/).

**Ką daryti dabar:** atnaujinimui paskirti savininką, o kompromitavimo vertinimui sukurti atskirą darbą. Užfiksuoti viešo pasiekiamumo laikotarpį, įdiegtą versiją ir valdymo kelius. Prieš atkūrimą, kuris sunaikintų įrodymus, išsaugoti logus ir konfigūraciją. Su patikimu etalonu palyginti paskyras, suplanuotas užduotis, tunelius, proxy nustatymus ir skriptus. Nepaaiškinamus privilegijuotus pakeitimus perduoti incidentų tyrimui, o ne uždaryti kartu su pataisos darbu. Pasirinkti numatytam įrenginio kanalui tinkamą, palaikomą pataisytą leidimą.

**Riba:** šaltiniai nenustato aukų skaičiaus Lietuvoje. Regioninį aktualumą lemia produktas ir valdymo pasiekiamumas, ne prielaida apie kampaniją prieš Lietuvą.
</section>

<section class="hx-signal-entry hx-signal-entry--critical" markdown="1">
<p class="hx-signal-label">KRITINIS PRIORITETAS · PRANEŠTAS IŠNAUDOJIMAS · NARŠYKLIŲ PARKAS</p>

### Chrome: matuoti veikiančią versiją, ne diegimo pranešimą

Google rugsėjo 8 d. Chrome 153 pranešime nurodo realiai naudojamą CVE-2026-87491 exploit. Tai V8 out-of-bounds write klaida, pranešime įvertinta kaip medium. Stalinių sistemų leidimai buvo 153.0.8010.36 Linux ir 153.0.8010.36/.37 Windows bei macOS. Gamintojo severity ir išnaudojimo įrodymai yra atskiri laukai. [Chrome leidimo pranešimas](https://chromereleases.googleblog.com/2026/09/stable-channel-update-for-desktop_0808145027.html).

Tą pačią dieną Google pradėjo dviejų savaičių Stable ciklą. Extended Stable atskirtas nuo šio ritmo: pagrindiniai leidimai išlieka kas aštuonias savaites, o saugumo pataisos perkeliamos savaitiniu grafiku. Vien mažesnis pagrindinės versijos numeris neįrodo, kad konkrečiame Extended Stable leidime nėra konkrečios pataisos. [Google leidimų ciklo paaiškinimas](https://developer.chrome.com/blog/chrome-two-week-start).

**Ką daryti dabar:** kartu matuoti naršyklės kanalą, įdiegtą build, veikiantį build ir laiką nuo paskutinio paleidimo iš naujo. Atskirti neprisijungusius nešiojamuosius kompiuterius, kioskus ir nevaldomus įrenginius nuo sėkmingai atnaujintų endpoint. Negalintiems persikrauti įrenginiams paskirti išimties savininką ir terminą. Svarbiausias vidines aplikacijas nuolat bandyti mažoje pilotinėje grupėje, kad suderinamumo darbas netaptų nuolatine priežastimi atidėti saugumo leidimus.

**Vertinimas:** naudingas rodiklis yra aktyvių naršyklių, vis dar vykdančių paveiktą build, dalis, ne sėkmingų diegimo užduočių procentas. Pranešimas patvirtina išnaudojimą kažkur. Jis neparodo, kurie jūsų naudotojai su juo susidūrė, ir nenustato konkretaus veikėjo.
</section>

## Infrastruktūros ir pranešimų savininkai

<section class="hx-signal-entry hx-signal-entry--high" markdown="1">
<p class="hx-signal-label">AUKŠTAS PRIORITETAS · VIRTUALIZACIJA · ATSKIROS PASITIKĖJIMO RIBOS</p>

### XenServer: guest riba ir automatizavimo ryšys reikalauja skirtingų pataisų

Cloud Software Group rugsėjo 8 d. biuletenis aprašo XenServer 8.4 ir 9 klaidas, dėl kurių privilegijuotas guest naudotojas gali kompromituoti hostą arba sutrikdyti jo veikimą. Atskirai įvardyta CVE-2026-83496 ankstesnėse nei 0.3.0 Terraform provider versijose, leidžianti perimti provider ir hosto ryšį. Hosto pataisos paskelbtos atitinkamuose atnaujinimų kanaluose. [XenServer biuletenis CTX697038](https://support.citrix.com/external/article/CTX697038/xenserver-security-update-for-multiple-i.html).

Provider 0.3.0 leidimas pagal nutylėjimą įjungia TLS sertifikato tikrinimą ir ryšiams su hostu naudoja HTTPS. Galima nurodyti patikimos CA sertifikato kelią. `insecure` išimtis numatyta kūrimui ar bandymams, ne gamybinės aplinkos pasitikėjimo klaidai "sutvarkyti". [Provider 0.3.0 leidimas](https://github.com/xenserver/terraform-provider-xenserver/releases/tag/v0.3.0).

**Ką daryti dabar:** darbus padalinti virtualizacijos ir automatizavimo savininkams. Patvirtinti atnaujinimą visame hostų telkinyje ir įvykdyti konkrečiam leidimui būtinus užbaigimo veiksmus. Atskirai tikrinti provider versijų fiksavimą kodo saugyklose ir deployment runner iš tikrųjų naudojamus vykdomuosius failus. Kontroliuojamame bandyme patikrinti CA grandinę ir pašalinti produkcinio sertifikatų tikrinimo apėjimus. Sėkmingas Terraform plan neįrodo, kad ryšys autentifikavo numatytą hostą.

**Vertinimas:** pirmiausia tikrinti aplinkas, kuriose guest administratoriai priklauso skirtingoms pasitikėjimo sritims. Biuletenyje nurodyta guest prieigos prielaida svarbi. Jos negalima perrašyti į neautentifikuotą perėmimą iš interneto. Cituojama gamintojo medžiaga neteigia, kad šios klaidos stebėtos realiose atakose.
</section>

<section class="hx-signal-entry hx-signal-entry--high" markdown="1">
<p class="hx-signal-label">AUKŠTAS PRIORITETAS · EUROPA · PRODUKTO SAUGUMO PRANEŠIMAI</p>

### CRA: laikrodis prasideda sužinojus, ne užbaigus tyrimą

Nuo rugsėjo 11 d. gamintojų CRA pareigos apima aktyviai išnaudojamus pažeidžiamumus ir rimtus produkto saugumo incidentus. Pranešti reikia be nepagrįsto delsimo, o ankstyvą perspėjimą ir pranešimą pateikti ne vėliau kaip per 24 ir 72 valandas nuo sužinojimo. Galutiniai terminai skiriasi: pažeidžiamumams, per 14 dienų nuo korekcinės ar poveikį mažinančios priemonės atsiradimo, incidentams, per mėnesį nuo 72 valandų pranešimo. Atvirojo kodo programinės įrangos valdytojų atitinkamos pareigos prasideda 2027 m. gruodžio 11 d. [Komisijos gairės, atnaujintos rugsėjo 11 d.](https://digital-strategy.ec.europa.eu/en/policies/cra-reporting), [CRA 14 straipsnis](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L_202402847).

ENISA instrukcija atskiria išsaugotą juodraštį nuo pateikto perspėjimo ir aprašo atskirus ankstyvo perspėjimo, 72 valandų bei galutinio pranešimo etapus. Šį operacinį skirtumą verta patikrinti iki incidento, ne artėjant pirmajam terminui. [ENISA pateikimo instrukcija, atnaujinta rugsėjo 12 d.](https://www.enisa.europa.eu/topics/product-security/single-reporting-platform-srp/cra-srp-guidance-ar-notification-submission-and-update).

**Ką daryti dabar:** produkto saugumo ir teisiniams savininkams patvirtinus taikymą, išbandyti fiktyvų scenarijų nepateikiant tikro pranešimo. Užfiksuoti gautus įrodymus, sužinojimo laiką, produkto ribą, sprendimą dėl pranešimo ir atsakingą atstovą. Patikrinti, kas pavaduoja savaitgaliais ar žmogui nesant. Nežinomybę įrašyti aiškiai, o ne laukti tobulo pasakojimo. Pateikimo patvirtinimą saugoti prie sprendimo įrašo, ne vien žmogaus pašto dėžutėje.

**Riba:** kalbama apie produkto saugumo pranešimus. Tai nereiškia, kad kiekvienas organizacijos CVE ar SOC alert automatiškai įjungia 14 straipsnį. Teisinį taikymą reikia kvalifikuotai įvertinti. Scenarijaus pratybos yra operacinė kontrolė, ne teisinės atitikties patvirtinimas.
</section>

## Lietuvos pulsas

<section class="hx-signal-entry hx-signal-entry--watch" markdown="1">
<p class="hx-signal-label">STEBĖTI · LIETUVA · ŽVALGYBOS BENDRADARBIAVIMAS</p>

### NKSC platforma didina dalijamo analitinio rezultato kokybės svarbą

Rugsėjo 7 d. NKSC paskelbė, kad Regioninis kibernetinės gynybos centras tampa Tarptautine kibernetinių grėsmių analizės platforma. Nurodytos kryptys yra bendra grėsmių paieška, analizė ir tyrimai. Tarybos susitikimo dalyviais įvardytos Lietuva, Lenkija, Ukraina, Čekija ir JAV. Tai bendradarbiavimo pokytis, ne naujai atskleistas įsilaužimas. [NKSC pranešimas](https://nksc.lrv.lt/lt/naujienos/nksc-koordinuojamas-regioninis-kibernetines-gynybos-centras-tampa-tarptautine-kibernetiniu-gresmiu-analizes-platforma-SPI/).

**Vertinimas:** Lietuvos CTI komandai praktinė pamoka nėra pagaminti didesnį indikatorių srautą. Reikia padaryti analitinį rezultatą naudojamą už jį surinkusios organizacijos ribų. Hostname be stebėjimo laiko, rinkimo metodo ar neapibrėžtumo priverčia gavėją analitinį darbą atkurti iš naujo. Trumpa hipotezė su įrodymais ir aiškia jos paneigimo sąlyga suteikia kitai komandai tai, ką galima patikrinti.

**Ką daryti dabar:** parengti dalijimosi šabloną su šaltiniu, stebėjimo laiku, elgsena, paveikta technologija, pasitikėjimo lygiu, alternatyviu paaiškinimu ir platinimo ribomis. Pridėti klausimą, į kurį turėtų atsakyti partneris. Jautrių klientų duomenų neįtraukti, kol nesuderintas teisėtas dalijimosi kelias ir gavėjas. Matuoti, ar pasidalinta žvalgyba pakeitė paiešką, kontrolę arba sprendimą. Pranešimas neįrodo, kad nepriklausomas leidėjas turi prieigą prie platformos ar kad dalyvavimas atviras visiems.
</section>
