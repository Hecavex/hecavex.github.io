---
published: true
title: "Signalų apžvalga #10: išnaudojamos valdymo sistemos, kintantis phishing ir Baltijos rinkimų stebėsena"
card_title: "Signalų apžvalga #10: valdymo sistemos ir phishing"
description: "Cisco SD-WAN ir FortiMail išnaudojimas, atskira NetScaler SAML klaida, Star Blizzard, RMM piktnaudžiavimas ir Latvijos rinkimų stebėsena. Laikotarpis: rugsėjo 28–spalio 4 d., iki 08:00 UTC."
seo_description: "Šeši prioritetai: Cisco SD-WAN, FortiMail, NetScaler SAML, RedFlick, RMM phishing ir CERT.LV rinkimų stebėsena. Informacijos riba: spalio 4 d., 08:00 UTC."
seo_title: "Valdymo sistemos ir phishing | Signalų apžvalga #10"
seo_keywords: [CVE-2026-76504, CVE-2026-104286, CVE-2026-88779, Star Blizzard, RedFlick, CERT.LV]
date: 2026-10-04 11:20:00 +0300
last_reviewed_at: 2026-10-04 11:20:00 +0300
lang: lt
translation_key: hecavex-signal-brief-010
permalink: /lt/apzvalgos/2026-10-04/
author: deividas-lis
content_type: signal-brief
series: hecavex-signal-brief
issue: 10
coverage_start: 2026-09-28
coverage_end: 2026-10-04
information_cutoff: 2026-10-04 08:00:00 +0000
confidence: moderate
tlp: clear
categories: [security-briefings]
tags: [CISA KEV, Cisco, Fortinet, phishing, reagavimas į incidentus, CTI]
featured: false
draft: false
toc: true
comments: false
research_version: "1.0"
research_status: published
leading_topics:
  - Cisco ir FortiMail reikalauja skirtingų neatidėliotinų sprendimų
  - Naujos NetScaler SAML klaidos rugsėjo pataisos neuždaro
  - Kintantis phishing pristatymas ir apibrėžtas Baltijos rinkimų vertinimas
critical_count: 2
high_count: 3
watch_count: 1
scope: "Šeši pasirinkti pokyčiai, paskelbti ar iš esmės atnaujinti nuo 2026 m. rugsėjo 28 d. iki spalio 4 d., 08:00 UTC. Paskutinė UTC diena nepilna. Ankstesnė kampanijų veikla atskirta nuo jos paskelbimo datos."
evidence_basis: "Gamintojų saugumo pranešimai, datuoti Microsoft kampanijų tyrimai, Kanados kibernetinio saugumo centro pranešimai, iki informacijos ribos paskelbta CISA KEV versija, NetScaler CNA įrašas ir CERT.LV rinkimų atnaujinimai."
methods: [pirminių šaltinių peržiūra, saugumo pranešimų palyginimas, datomis apribota katalogo peržiūra]
limitations: "Šaltiniais paremta apžvalga, ne originali incidentų telemetrija ar visas savaitės incidentų skaičius. Neatlikta skenavimo, išnaudojimo, vietinių aukų tikrinimo ar nepriklausomo priskyrimo veikėjui. Dinaminiai pranešimai po nurodytos ribos gali keistis. Pataisų prieinamumas aprašytas pagal peržiūros metu matytą būseną."
key_findings:
  - "Cisco pataisos prieinamos, o Fortinet nurodytas FortiMail pataisas dar žymėjo kaip būsimas. Todėl gamintojo workaround yra neatidėliotinas sprendimas, ne užbaigtas patch darbas."
  - "Atskiram NetScaler SAML pažeidžiamumui reikia naujo pritaikomumo patikrinimo po rugsėjo atnaujinimų. Dokumentuotas poveikis yra paslaugos sutrikdymas, ne ankstesnių klaidų kodo vykdymas."
  - "Teisėtas programos parašas, pažįstamas siuntėjo domenas ar panaši svetainė nepakanka nustatyti, ar veikla leista, kenkėjiška arba priskirtina konkrečiam veikėjui."
image:
  path: /assets/img/series/hecavex-signal-brief.svg
  social: /assets/img/social/hecavex-signal-brief-010-lt.png
  alt: "Dešimtoji signalų apžvalga apie valdymo sistemų pažeidžiamumus, phishing metodus ir Baltijos rinkimų stebėseną"
  thumbnail: /assets/img/series/hecavex-signal-brief.svg
updates:
  - date: 2026-10-04
    note: "Pirmoji publikacija apie rugsėjo 28–spalio 4 d. Informacijos riba: 2026 m. spalio 4 d., 08:00 UTC. Paskutinė UTC diena nepilna."
---

Dvi skubios saugumo įrangos problemos nereiškia vienodo pakeitimo uždavinio: vienai jau yra pataisytos versijos, kitai vis dar reikia laikinos priemonės. Trečia klaida pasirodė po to, kai administratoriai jau buvo atnaujinę NetScaler. Tuo metu nauji kampanijų tyrimai parodo, kodėl patikimai atrodantis kvietimas ar pasirašytas nuotolinio valdymo installer reikalauja daugiau dėmesio nei jo failo pavadinimas.

**Laikotarpis: 2026 m. rugsėjo 28–spalio 4 d., pagal spalio 4 d. 08:00 UTC (11:00 Lietuvos laiku) turėtą informaciją. Paskutinė diena nepilna.** Šie šeši prioritetai yra redakcinės darbų eilės, ne CVSS kategorijos ar visas savaitės incidentų sąrašas. Naujai paskelbtuose tyrimuose aprašyta senesnė veikla žemiau datuojama atskirai.

**Metodas ir ribos:** palyginti pirminiai saugumo pranešimai, tyrimai ir oficialių katalogų įrašai. HECAVEX neatliko skenavimo, exploit atkartojimo, aukų tikrinimo ar nepriklausomo priskyrimo veikėjui. Gamintojo patvirtintas išnaudojimas neįrodo kompromitavimo Lietuvoje. Veikiant vėliau būtina tikrinti dabartines gamintojo instrukcijas, ypač kai pataisos dar laukiama.

## Išnaudojama infrastruktūra: viena pataisa prieinama, kitos dar laukiama

<section class="hx-signal-entry hx-signal-entry--critical" markdown="1">
<p class="hx-signal-label">KRITINIS · PATVIRTINTAS IŠNAUDOJIMAS · TINKLO VALDYMO SISTEMA</p>

### Cisco SD-WAN Manager: API prieiga gali tapti administratoriaus prieiga

<dl><div><dt>Pažeidžiamumas</dt><dd>CVE-2026-76504</dd></div><div><dt>Paskelbta</dt><dd>Rugsėjo 30 d., gamintojo atnaujinta spalio 2 d.</dd></div></dl>

Cisco patvirtina neautentifikuoto API autentifikacijos apėjimo išnaudojimą Catalyst SD-WAN Manager. Klaida nepriklauso nuo konfigūracijos ir gali suteikti administratoriaus lygio API prieigą. Spalio 2 d. papildyme Live Protect skydas aprašytas kaip laikina, dalinė apsauga, ne atnaujinimo pakaitalas. [Cisco pranešimas, versija 1.1](https://www.cisco.com/c/en/us/support/docs/csa/cisco-sa-sdwan-webauth-xr8beuuU.html).

Pataisos pagal šakas: 20.9.10.1, 20.12.8.2, 20.15.6.1, 20.18.4.1, 26.1.2.1 ir 26.2.1. [Kanados kibernetinio saugumo centro biuletenis](https://www.cyber.gc.ca/en/alerts-advisories/cisco-security-advisory-av26-978). CISA klaidą įtraukė rugsėjo 30 d. [Datuotas KEV katalogas](https://github.com/cisagov/kev-data/blob/7009facc2019306d41f6d6df6c8a057b99b4b468/known_exploited_vulnerabilities.json).

**Ką daryti dabar:** valdymo sistemos savininkas turi pateikti du rezultatus: palaikomą pataisytą build ir dokumentuotą kompromitavimo peržiūrą. Patikrinti, kad iš išorės pasiekiamas egzempliorius tikrai yra tas, kuris atnaujintas. Išsaugoti ankstesnę konfigūraciją ir nepriklausomus tinklo įrašus palyginimui su leistais administravimo veiksmais.

**Vertinimas:** valdiklio tyrimo riba platesnė už vieną web servisą. Kokias tolesnių sistemų konfigūracijas ir prieigos ryšius jis galėjo pakeisti? Žalia atnaujinimo būsena atsako į programinės įrangos klausimą, bet nepasako, kas API naudojo iki atnaujinimo.

</section>

<section class="hx-signal-entry hx-signal-entry--critical" markdown="1">
<p class="hx-signal-label">KRITINIS · PATVIRTINTAS IŠNAUDOJIMAS · PAŠTO ŠIFRAVIMO SERVISAS</p>

### FortiMail: būsima versija nėra jau įdiegta pataisa

<dl><div><dt>Pažeidžiamumas</dt><dd>CVE-2026-104286</dd></div><div><dt>Neatidėliotinas sprendimas</dt><dd>Gamintojo workaround, kol laukiama pataisytų build</dd></div></dl>

Fortinet spalio 1 d. pranešimas aprašo neautentifikuotą savavališką failų įrašymą ir patvirtina išnaudojimą. Peržiūros metu 8.0.2, 7.6.7 ir 7.4.9 pataisos vis dar pažymėtos kaip **būsimos**. 7.2 šakai reikia migracijos. Rekomenduojamas workaround yra IBE išjungimas, tarp alternatyvų nurodyta webmail prieigos kontrolė. [Fortinet FG-IR-26-175](https://www.fortiguard.com/psirt/FG-IR-26-175).

CISA pažeidžiamumą įtraukė spalio 1 d. Tai patvirtina žinomą išnaudojimą, ne įvardytą kampaniją ar Lietuvos auką. [Iki informacijos ribos paskelbta KEV versija](https://github.com/cisagov/kev-data/blob/7009facc2019306d41f6d6df6c8a057b99b4b468/known_exploited_vulnerabilities.json).

**Ką daryti dabar:** pašto savininkui įvertinti IBE išjungimo poveikį paslaugai ir pritaikyti gamintojo palaikomą apribojimo variantą. Užrašyti, kuri kontrolė pakeista, kada ji pradėjo veikti ir kas inicijuos atnaujinimą atsiradus pataisai. Pakeitimo užduotis neturi likti būsenoje "laukiame patch", kai už pasiekiamą riziką niekas neatsako.

**Vertinimas:** apribojimo sprendimas ir ankstesnio kompromitavimo klausimas sprendžiami lygiagrečiai. Kai įmanoma, prieš trikdančius pakeitimus išsaugoti susijusius įrodymus. Radus nepaaiškintų konfigūracijos ar privilegijuotos veiklos pokyčių, taikyti incidento procesą. Įėjimo funkcijos išjungimas savaime neįrodo, kad ankstesni neleistini pakeitimai išnyko.

</section>

## NetScaler tęsinys: SAML klaidai reikia atskiro pritaikomumo patikrinimo

<section class="hx-signal-entry hx-signal-entry--high" markdown="1">
<p class="hx-signal-label">AUKŠTAS PRIORITETAS · TIKSLINIS PASLAUGOS SUTRIKDYMAS · TĘSINYS</p>

### Rugsėjo NetScaler atnaujinimas neuždaro CVE-2026-88779

<dl><div><dt>Naujas pažeidžiamumas</dt><dd>CVE-2026-88779</dd></div><div><dt>Aktuali konfigūracija</dt><dd>NetScaler ADC arba Gateway su SAML SP ar IdP funkcija</dd></div></dl>

[Apžvalgoje #9](/lt/apzvalgos/2026-09-27/) aptarti CVE-2026-88771 ir CVE-2026-88772. Ši klaida atskira. Citrix praneša apie tikslines paslaugos sutrikdymo atakas prieš neapsaugotas sistemas su atitinkama SAML konfigūracija. Savo analizėje gamintojas nenustatė poveikio duomenų vientisumui. Ankstesnių klaidų kodo vykdymo aprašymo čia perkelti negalima. [Citrix techninės rekomendacijos](https://community.citrix.com/techzone-blogs/110_security-updates/understanding-and-addressing-cve-2026-88779-in-citrix-netscaler-adc-and-citrix-netscaler-gateway/) ir [saugumo biuletenis CTX697174](https://support.citrix.com/support-home/kbsearch/article?articleNumber=CTX697174).

CNA įrašas paskelbtas spalio 4 d. 02:35 UTC, iki šios apžvalgos informacijos ribos. Pataisytos šakos: 14.1-73.41 ir 13.1-64.28, o atitinkamiems FIPS/NDcPP build – 14.1-73.41 FIPS ir 13.1-37.282. [Datuotas NetScaler CNA įrašas](https://github.com/CVEProject/cvelistV5/blob/ea37e3b42faa2c7dcfa81cc5e3c3b28e8f6ecda2/cves/2026/88xxx/CVE-2026-88779.json).

**Ką daryti dabar:** iš naujo priimti pritaikomumo sprendimą pagal tikrą autentifikacijos konfigūraciją ir šio pranešimo pataisytą build, ne praėjusios savaitės užduoties būseną. Dubliuojamai porai planuoti pakeitimus pagal patikrintą autentifikacijos tęstinumą. Atskirai registruoti nepaaiškintus proceso lūžius ir ankstesnį kompromitavimo tyrimą: patch užbaigimas, prieinamumo atkūrimas ir incidento uždarymas turi skirtingus priėmimo kriterijus.

</section>

## Phishing: vertinti vykdymo kelią, ne pažįstamą išvaizdą

<section class="hx-signal-entry hx-signal-entry--high" markdown="1">
<p class="hx-signal-label">AUKŠTAS PRIORITETAS · PASKELBTAS KAMPANIJOS TYRIMAS · SU UKRAINA SUSIJĘ TAIKINIAI</p>

### Star Blizzard RedFlick tyrimas keičia naudingos paieškos kryptį

<dl><div><dt>Tyrimas paskelbtas</dt><dd>Rugsėjo 29 d.</dd></div><div><dt>Aprašyta veikla</dt><dd>Nuo 2026 m. sausio stebėta metodų kaita</dd></div></dl>

Microsoft aprašytą veiklą priskiria Star Blizzard ir nurodo platesnes phishing kampanijas prieš su Ukraina susijusias institucijas bei rėmėjus. Kompromituotos svetainės naudotos siuntėjų paskyroms. Pristatymas keistas į RedFlick suplanuotas užduotis ir CosmicPulse backdoor. Tai naujas ankstesnės veiklos tyrimas, ne įrodymas, kad kampanija prasidėjo šią savaitę. [Originalus Microsoft tyrimas](https://www.microsoft.com/en-us/security/blog/2026/09/29/star-blizzard-refines-phishing-and-malware-delivery-with-the-redflick-technique/).

**Vertinimas:** Ukrainą remiančiai Lietuvos organizacijai sektoriaus ir ryšių sutapimas pagrindžia aktualių kontrolių patikrinimą. Jis nepagrindžia teiginio, kad organizacija buvo taikinys. Gamintojo priskyrimas veikėjui, gamintojo stebėjimai ir jūsų pačių įrodymai turi likti atskirti.

**Ką daryti dabar:** peržiūrėti, kaip darbuotojai tikrina konferencijų kvietimus ir vėliau atsiųstus archyvus iš anksčiau nepažįstamų korespondentų. Gavus konkretų įtartiną pranešimą, prieš priskiriant veikėjui sujungti laiško, atsisiuntimo ir endpoint vykdymo įrašus į vieną laiko juostą. Vien suplanuotos užduoties pavadinimas ar pažįstamas domenas yra silpnas pagrindas išvadai. Užrašyti proceso kilmę, sukūrusią paskyrą ir paskirties adresą, tada palyginti su numatytais administravimo darbais. Neaiškius sutapimus laikyti tyrimo signalais, ne skelbti patvirtintu šnipinėjimu.

</section>

<section class="hx-signal-entry hx-signal-entry--high" markdown="1">
<p class="hx-signal-label">AUKŠTAS PRIORITETAS · RMM PIKTNAUDŽIAVIMAS · NEPRISKIRTA VEIKLA</p>

### Pašalinus vieną nuotolinės prieigos agentą, gali likti kitas

<dl><div><dt>Tyrimas paskelbtas</dt><dd>Rugsėjo 29 d., aprašyti liepos stebėjimai</dd></div><div><dt>Stebėtas ryšys</dt><dd>MSP360 RMM įdiegė ScreenConnect klientą</dd></div></dl>

Microsoft aprašo phishing, kuriuo teisėtas MSP360 installer pristatytas klaidinančiais failų pavadinimais, o vėliau per ScreenConnect sukurtas antras nuotolinės prieigos kanalas. Sėkmingam diegimui reikėjo pakeltų teisių. Microsoft nestebėjo paties ScreenConnect pažeidžiamumo išnaudojimo ir veiklos nepriskyrė įvardytam veikėjui. [Microsoft RMM tyrimas](https://www.microsoft.com/en-us/security/blog/2026/09/29/phishing-abuses-rmm-tools-persistent-access/).

**Vertinimas:** galiojantis parašas atsako į leidėjo vientisumo klausimą, nepasako, kas leido šį egzempliorių arba valdo jo nuotolinį servisą. Tačiau vien RMM produkto buvimas irgi neįrodo kompromitavimo: daug organizacijų nuo jo teisėtai priklauso.

**Ką daryti dabar:** kiekvienam įdiegtam nuotolinio valdymo egzemplioriui susieti savininką, leistiną serviso endpoint ir diegimo įrašą. Jei egzempliorius neleistinas, atsako ribą nustatyti pagal visą jo veikimo laikotarpį ir papildomą prieigą, kurią jis galėjo sukurti. Išimtis derinti su pagalbos tarnyba bei paslaugos teikėju, o ne masiškai šalinti agentus. Užbaigimo įrodymai turi apimti ir pradinį diegimą, ir vėlesnius prieigos kanalus. Pirmojo vykdomojo failo pašalinimas nėra toks įrodymas.

</section>

## Baltijos stebėsena: tiksliai įvardyti stebėtą poveikį rinkimams

<section class="hx-signal-entry hx-signal-entry--watch" markdown="1">
<p class="hx-signal-label">STEBĖTI · LATVIJA · STEBĖJIMAS IR IŠVADA</p>

### CERT.LV: panašios svetainės stebėtos, ne automatiškai paskelbtos kenkėjiškomis

<dl><div><dt>Naujausias įtrauktas atnaujinimas</dt><dd>Spalio 4 d., 09:30 Latvijos laiku / 06:30 UTC</dd></div><div><dt>Įrodymų riba</dt><dd>CERT.LV rinkimų stebėsena, ne visuotinis saugumo garantas</dd></div></dl>

CERT.LV pranešė nestebėjusi su rinkimais susijusių kibernetinių incidentų ar poveikio rinkimų naktį ir skaičiuojant balsus. Spalio 3 d. vakaro papildyme atskirai aprašyti nesėkmingi bandymai ieškoti spragų bei į institucijų, žiniasklaidos ir rinkimų komisijos svetaines panašūs tinklalapiai, kuriuose kenkėjiško turinio neaptikta. Stebėsena tęsta. [CERT.LV situacijos atnaujinimai su laiku](https://cert.gov.lv/lv/2026/09/latvijas-kibertelpas-apskats-pirmsvelesanu-nedela-un-velesanu-laika).

**Vertinimas:** "poveikio nestebėta" yra apibrėžtas įrodymas, ne teiginys, kad priešiškų ketinimų nėra. Taip pat panašus domenas yra rinkimo signalas, ne kišimosi įrodymas. Analitikas neturi aukštesnio bendro grėsmių lygio paversti išgalvotu incidentų skaičiumi.

**Ką daryti dabar:** ataskaitose atskirti domeno panašumą, stebėtą turinį, pristatytą payload, naudotojo veiksmą ir patvirtintą pasekmę. Kiekvienam klasifikacijos pokyčiui išsaugoti stebėjimo laiką ir šaltinį. Pristatant ne techninei auditorijai, prieš darant išvadą apie rinkimus ar instituciją pasakyti, kas patikrinta ir kas vis dar nežinoma.

</section>
