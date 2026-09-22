---
published: true
title: "Signalų apžvalga #8: išnaudojama saugumo įranga, hostingo privilegijos ir DNS prieinamumas"
card_title: "Signalų apžvalga #8: saugumo įranga, hostingas ir DNS"
description: "Išnaudojami Cisco ISE ir el. pašto gateway, Acronis hostingo integracijos, trys Linux KEV papildymai, BIND pataisos ir Lietuvos CRA pranešimų kelias. Laikotarpis: 2026 m. rugsėjo 14–20 d."
seo_description: "Cisco ISE, Secure Email Gateway, Acronis, Linux ir BIND prioritetai gynėjams bei NKSC paaiškintas CRA pranešimų kelias."
seo_title: "Cisco, Linux ir DNS prioritetai | Signalų apžvalga #8"
seo_keywords: [CVE-2026-76460, CVE-2026-76461, CVE-2026-87886, Linux KEV, BIND, CRA Lietuva]
date: 2026-09-22 14:00:00 +0300
last_reviewed_at: 2026-09-22 14:00:00 +0300
lang: lt
translation_key: hecavex-signal-brief-008
permalink: /lt/apzvalgos/2026-09-20/
author: deividas-lis
content_type: signal-brief
series: hecavex-signal-brief
issue: 8
coverage_start: 2026-09-14
coverage_end: 2026-09-20
information_cutoff: 2026-09-20 23:59:59 +0000
confidence: moderate
tlp: clear
categories: [security-briefings]
tags: [Cisco, Linux, DNS, hosting, CISA KEV, Kibernetinio atsparumo aktas]
featured: false
draft: false
toc: true
comments: false
research_version: "1.0"
research_status: published
leading_topics:
  - Dvi išnaudojamos Cisco sistemos reikalauja skirtingų atkūrimo sprendimų
  - Hostingo atsarginės kopijos ir Linux branduolio prielaidos
  - DNS prieinamumas ir Lietuvos CRA pranešimų kelias
critical_count: 2
high_count: 3
watch_count: 1
scope: "Šeši pasirinkti gynybai aktualūs pokyčiai 2026 m. rugsėjo 14–20 d. Senesni techniniai įrašai naudojami tik paaiškinti pažeidžiamumus, kurių prioritetas pasikeitė šiuo laikotarpiu."
evidence_basis: "Datuoti gamintojų ir nacionalinių institucijų pranešimai, Cisco PSIRT ir ISC rekomendacijos, NKSC paaiškinimas bei iki informacijos ribos paskelbtos oficialių CISA ir CVE saugyklų versijos."
methods: [pirminių šaltinių peržiūra, saugumo pranešimų palyginimas, datomis apribota katalogo peržiūra]
limitations: "Retrospektyvi apžvalga parengta rugsėjo 22 d. pagal iki rugsėjo 20 d. prieinamą medžiagą, ne originalus incidento tyrimas. Neatlikta vietinių sistemų skenavimo, išnaudojimo bandymų ar nukentėjusiųjų telemetrijos analizės. Išnaudojimas kažkur nepatvirtina kompromitavimo Lietuvoje ar skaitytojo organizacijoje."
key_findings:
  - "ISE autentifikacijos apėjimas ir el. laiškų apdorojimo klaida turi skirtingus įėjimo kelius, bet abiem reikia ir pataisymo, ir kompromitavimo vertinimo."
  - "Lokalios prieigos sąlyga nemažina rizikos vien dėl savo pavadinimo, kai viename hostinge veikia keli klientai. Linux radinius vis tiek reikia skirti pagal posistemę ir užpuoliko poziciją."
  - "Atnaujinant DNS būtina išlaikyti paslaugos tęstinumą. Lietuvos gamintojams taip pat reikia veikiančio pranešimų proceso savininko, ne vien žinių apie CRA terminus."
image:
  path: /assets/img/series/hecavex-signal-brief.svg
  social: /assets/img/social/hecavex-signal-brief-008-lt.png
  alt: "Aštuntoji signalų apžvalga apie saugumo įrangą, hostingo privilegijas, DNS ir pasirengimą pranešti"
  thumbnail: /assets/img/series/hecavex-signal-brief.svg
updates:
  - date: 2026-09-22
    note: "Pirmoji retrospektyvi publikacija apie rugsėjo 14–20 d. Informacijos riba: 2026 m. rugsėjo 20 d., 23:59:59 UTC."
---

Šią savaitę naudingas klausimas yra ne "kiek kritinių pažeidžiamumų?", o "kuri pasitikėjimo riba gali sugriūti ir kuo po to dar galėsime pasitikėti?" Identity servisas, el. pašto gateway, atsarginių kopijų integracija ir DNS resolveris atsiduria skirtinguose inventoriuose. Tačiau vieno jų praradimas gali sutrikdyti kelias iš pirmo žvilgsnio nesusijusias paslaugas.

**Laikotarpis: 2026 m. rugsėjo 14–20 d. Parengta rugsėjo 22 d. pagal iki informacijos ribos paskelbtą medžiagą.** Žemiau pateikti šeši prioritetai yra redakcinės darbų eilės, ne šeši CVSS balai ir ne visas savaitės pažeidžiamumų sąrašas. "Ką daryti dabar" nurodo veiksmą pagal datuotus įrodymus. Vėliau veikianti komanda taip pat turi patikrinti dabartinę gamintojo palaikomą versiją.

**Metodas ir ribos:** datuoti gamintojų ir institucijų pranešimai palyginti su iki informacijos ribos paskelbtomis CISA bei CVE saugyklų versijomis. Tai šaltiniais paremtas vertinimas, ne HECAVEX incidentų telemetrija. Neatliktas skenavimas, exploit atkartojimas, aukų patvirtinimas ar nepriklausomas kampanijų masto matavimas. Rekomendacijos yra analizė, ne teisinė konsultacija ar gamintojo atkūrimo procedūros pakaitalas.

## Saugumo įranga: pataisymas ir atkūrimas yra atskiri sprendimai

<section class="hx-signal-entry hx-signal-entry--critical" markdown="1">
<p class="hx-signal-label">KRITINIS · PATVIRTINTAS IŠNAUDOJIMAS · IDENTITY INFRASTRUKTŪRA</p>

### Cisco ISE: API apėjimas neapsiriboja prisijungimo puslapiu

<dl><div><dt>Pažeidžiamumas</dt><dd>CVE-2026-76460</dd></div><div><dt>Pradinė sąlyga</dt><dd>Neautentifikuota prieiga prie paveikto API endpoint</dd></div></dl>

Cisco rugsėjo 16 d. pranešimas patvirtina aktyvų ISE ir ISE-PIC autentifikacijos apėjimo išnaudojimą. Pažeidžiamumas nepriklauso nuo įrenginio konfigūracijos. Gamintojas įspėja apie galimą komandų vykdymą root teisėmis. Management srauto apribojimas yra laikina rizikos mažinimo priemonė, ne programinė pataisa. [Cisco PSIRT pranešimas](https://sec.cloudapps.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-ISE-ABP-VNSW7Tn5).

**Ką daryti dabar:** inventorizuoti kiekvieną mazgą, užrašyti jo šaką bei patch lygį ir riboti administravimo prieigą, kol diegiamas tinkamas atnaujinimas. Pataisos pagal šakas: 3.1 Patch 12, 3.2 Patch 11, 3.3 Patch 12, 3.4 Patch 7 ir ISE 3.5 Patch 4. Peržiūrėti prieigos ir išorinius tinklo logus, ne vien dabartinį įrenginio būsenos langą. [Kanados kibernetinio saugumo centro rekomendacijos](https://www.cyber.gc.ca/en/alerts-advisories/al26-021-vulnerabilities-impacting-cisco-identity-services-engine-ise-cisco-ise-passive-identity-connector-ise-pic-cve-2026-20192-cve-2026-76423-cve-2026-76460).

Yra ir palaikymo ciklo spąstai. Cisco nurodo, kad 3.4 yra paskutinė palaikoma ISE-PIC versija, o senesnės ISE 3.1 ir 3.2 šakos priežiūros etape gauna tik kritines pataisas. Skubus patch ir migracija į palaikomą šaką yra du skirtingi darbai. [Cisco hardening leidimas](https://sec.cloudapps.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-hardening-ise-XU5EwX5T).

**Vertinimas:** identity sistemos negalima laikyti saugia vien todėl, kad autentifikacija vis dar veikia. Reikia žinoti, kas atliks kompromitavimo peržiūrą, kokie nepriklausomi logai išliko ir kurias integracijas reikės patikrinti iš naujo, jei pasitikėjimas mazgu prarastas.

</section>

<section class="hx-signal-entry hx-signal-entry--critical" markdown="1">
<p class="hx-signal-label">KRITINIS · PATVIRTINTAS IŠNAUDOJIMAS · EL. LAIŠKŲ APDOROJIMAS</p>

### Cisco Secure Email Gateway: įėjimo kelias yra gaunamas laiškas

<dl><div><dt>Pažeidžiamumas</dt><dd>CVE-2026-76461</dd></div><div><dt>Atkūrimo riba</dt><dd>Atskiras įrenginys ir jo klasterio ryšiai</dd></div></dl>

Rugsėjo 14 d. Cisco paskelbė apie SQL injection per specialiai parengtą el. laišką, kuriam nereikia autentifikacijos ir kuris gali baigtis komandų vykdymu root teisėmis. Cisco patvirtino išnaudojimą. JPCERT/CC rugsėjo 15 d. paaiškino, kodėl vien gateway logų nepakanka, kai užpuolikas gali pašalinti pėdsakus. [JPCERT/CC pranešimas](https://www.jpcert.or.jp/at/2026/at260027.html).

Datuotuose pranešimuose nurodytos pataisytos AsyncOS versijos: 15.5.5-014, 16.0.4-302 ir 16.5.0-780. Tikrinti reikia ne tik versiją, bet ir produktą. Secure Email Gateway ir atskira jo valdymo sistema nėra tas pats. [Kanados kibernetinio saugumo centro biuletenis](https://www.cyber.gc.ca/en/alerts-advisories/cisco-security-advisory-av26-921).

Rugsėjo 17 d. Cisco papildymas svarbus atkūrimui: iš kompromituoto klasterio nario galima pasiekti tarpusavio autentifikacijai naudojamus SSH raktus. Todėl saugios būsenos atkūrimo rekomendacija apima klasterį. Įtariant virtualaus įrenginio išnaudojimą, prieš atkuriant sistemą ir keičiant prisijungimo bei kriptografinę medžiagą reikia išsaugoti incidento įrodymus. [Cisco pranešimas ir atkūrimo rekomendacijos](https://sec.cloudapps.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-esa-inj-2bLVGmhX).

**Ką daryti dabar:** prieš keičiant įrenginį sujungti el. pašto savininką, incidentų tyrėją ir tinklo komandą. Išsaugoti išlikusius pašto ir tinklo įrodymus, patikrinti kiekvieną klasterio narį, tada atskirti įprastą atnaujinimą nuo atkūrimo po incidento. Neviešas administravimo puslapis nepanaikina kelio, kuriuo klaida pasiekiama per numatytą el. pašto srautą.

</section>

## Hostingas: lokali prieiga gali būti paslaugos dalis

<section class="hx-signal-entry hx-signal-entry--high" markdown="1">
<p class="hx-signal-label">AUKŠTAS PRIORITETAS · PATVIRTINTAS IŠNAUDOJIMAS · BACKUP INTEGRACIJOS</p>

### Acronis: inventorizuoti papildinį, ne tik atsarginių kopijų prekės ženklą

<dl><div><dt>Pažeidžiamumas</dt><dd>CVE-2026-87886</dd></div><div><dt>Reikalinga pozicija</dt><dd>Lokali ribotų teisių prieiga paveiktame Linux hostinge</dd></div></dl>

Acronis praneša apie ribotą tikslinį išnaudojimą prieš cPanel &amp; WHM backup papildinį. Tai privilegijų pakėlimas dėl failų teisių, ne neautentifikuotas kodo vykdymas iš interneto. Pranešime nurodyti pataisyti build: cPanel &amp; WHM 1.9.3.1021, Plesk 1.8.11.638 ir DirectAdmin 1.2.3.238. Paveiktų produktų sąrašas platesnis už konkrečiai aprašytą išnaudojimą. [Acronis SEC-10986](https://security-advisory.acronis.com/advisories/SEC-10986) ir [datuotas Acronis CNA įrašas](https://github.com/CVEProject/cvelistV5/blob/f79fe51ea817130bfc292a98b00a954943a445a7/cves/2026/87xxx/CVE-2026-87886.json).

**Vertinimas:** bendrame hostinge kliento paskyra arba kompromituota svetainė jau gali suteikti lokalią pradinę prieigą. Sąlygą "reikia lokalios prieigos" būtina vertinti pagal klientų izoliavimo modelį, o ne naudoti kaip priežastį radinį ignoruoti.

**Ką daryti dabar:** paprašyti hostingo operatoriaus konkrečios integracijos ir jos build, įskaitant perparduodamas ar kitam tiekėjui deleguotas paslaugas. Tikrinti netikėtą privilegijuotą vykdymą ir backup konfigūracijos pokyčius. Turėti nepriklausomai apsaugotą atkūrimo kopiją. Sėkmingas suplanuotas backup neįrodo, kad hostas arba jo atkūrimo kelias išliko patikimas.

</section>

<section class="hx-signal-entry hx-signal-entry--high" markdown="1">
<p class="hx-signal-label">AUKŠTAS PRIORITETAS · ŽINOMAS IŠNAUDOJIMAS · BRANDUOLIO PRIELAIDOS</p>

### Trys Linux KEV papildymai nėra vienas nuotolinis exploit

<dl><div><dt>Prioriteto pokytis</dt><dd>Trys CISA KEV papildymai rugsėjo 18 d.</dd></div><div><dt>Sprendimo laukai</dt><dd>Veikiantis kernel, posistemė, užpuoliko prieiga ir distributyvo pataisa</dd></div></dl>

Datuotame CISA kataloge CVE-2025-39964, CVE-2026-53266 ir CVE-2025-39682 pažymėti kaip žinomai išnaudojami. Katalogas neįvardija kampanijos ar Lietuvos aukos. [Iki informacijos ribos paskelbta CISA katalogo versija](https://github.com/cisagov/kev-data/blob/8f26120eca10ef7425d7dc4154754b9276a8200a/known_exploited_vulnerabilities.json).

Linux CNA įrašai atskiria jų pradines sąlygas:

- **CVE-2025-39964:** lygiagretus AF_ALG rašymas, pasiekiamas lokaliam neprivilegijuotam procesui. [Linux CNA įrašas](https://github.com/CVEProject/cvelistV5/blob/30e3cd0ad298b1a308f341329800996ba1e2e525/cves/2025/39xxx/CVE-2025-39964.json).
- **CVE-2026-53266:** ebtables SNAT keliui reikia lokalios atitinkamo bridge konfigūracijos kontrolės ir reikiamų atminties sąlygų. Svarbios gali būti namespace ribose turimos `CAP_NET_ADMIN` teisės. Vien nuotolinis ARP srautas nėra aprašyta prielaida. [Linux CNA įrašas](https://github.com/CVEProject/cvelistV5/blob/30e3cd0ad298b1a308f341329800996ba1e2e525/cves/2026/53xxx/CVE-2026-53266.json).
- **CVE-2025-39682:** CNA aprašo per tinklą pasiekiamą priėmimo kelią socket, kuriame naudojamas kTLS. Visos grupės negalima pavadinti tik lokalia, o kiekvieno HTTPS serviso sutapatinti su kTLS priėmimu. [Linux CNA įrašas](https://github.com/CVEProject/cvelistV5/blob/30e3cd0ad298b1a308f341329800996ba1e2e525/cves/2025/39xxx/CVE-2025-39682.json).

**Ką daryti dabar:** priimti tris atskirus sprendimus dėl pritaikomumo. Veikiantį kernel palyginti su distributyvo pataisa, įvertinant backport ir dar neatliktą perkrovimą. Užrašyti, ar nepatikimi workload gali pasiekti reikiamas sąsajas. Appliance atveju gauti tiekėjo vertinimą, o ne pakeisti produkto palaikymo atsakymą vien upstream versijų palyginimu.

</section>

## DNS prieinamumas ir Lietuvos pasirengimas pranešti

<section class="hx-signal-entry hx-signal-entry--high" markdown="1">
<p class="hx-signal-label">AUKŠTAS PRIORITETAS · GAMINTOJO PATAISOS · DNS TĘSTINUMAS</p>

### BIND: DoH proceso lūžis ir resolverio išteklių išsekimas tikrinami skirtingai

<dl><div><dt>Pranešimų data</dt><dd>Rugsėjo 16 d.</dd></div><div><dt>Įrodymų būsena</dt><dd>ISC nurodė nežinanti apie aktyvų šių dviejų klaidų išnaudojimą</dd></div></dl>

ISC CVE-2026-77692 aprašo kaip nuotolinį `named` proceso nutraukimą per netinkamai suformuotą DNS-over-HTTPS srautą ir per anksti uždaromą ryšį. CVE-2026-81563 susijęs su išteklių išsekimu resolveriui apdorojant konkrečius SVCB/HTTPS įrašų ryšius. Pirmajai klaidai reikia DoH kelio. Antrosios negalima atmesti vien todėl, kad DoH išjungtas. [ISC DoH pranešimas](https://kb.isc.org/docs/cve-2026-77692), [ISC resolverio pranešimas](https://kb.isc.org/docs/cve-2026-81563).

ISC nurodo atitinkamas pataisytas 9.20.29 ir 9.21.26 versijas bei 9.20.29-S1 palaikomai preview šakai. Reikia tikrinti šaką ir distributyvo paketą, o ne perkelti produkcinį resolverį į kitą leidimų liniją vien dėl didesnio numerio. Resolverio pranešime įvardytos ir paveiktos 9.18 versijos, tačiau nauja 9.18 pataisa nesiūloma.

**Ką daryti dabar:** inventoriuje atskirti autoritetingus DNS serverius, rekursinius resolverius ir DoH listener. Atnaujinimus išdėstyti taip, kad dubliuojančios DNS paslaugos nebūtų perkrautos kartu. Iš priklausomų aplikacijų patikrinti vardų rezoliuciją, stebėti netikėtus proceso sustojimus, atminties spaudimą ir DNS klaidas. Tai tyrimo signalai, ne konkretaus exploit įrodymas.

</section>

<section class="hx-signal-entry hx-signal-entry--watch" markdown="1">
<p class="hx-signal-label">STEBĖTI · LIETUVA · PRANEŠIMŲ PROCESAS</p>

### NKSC paaiškina gamintojo pranešimo kelią

<dl><div><dt>Naujas vietinis paaiškinimas</dt><dd>NKSC, rugsėjo 14 d.</dd></div><div><dt>Operacinis klausimas</dt><dd>Kas gali pateikti įrodymais pagrįstą pirmą pranešimą?</dd></div></dl>

CRA pranešimų prievolių pradžia aptarta [apžvalgoje #7](/lt/apzvalgos/2026-09-13/). Šios savaitės Lietuvos paaiškinimas NKSC įvardija gamintojų, kurių pagrindinė buveinė Lietuvoje, pranešimų koordinatoriumi ir nurodo ENISA CRA-SRP kanalą. NKSC pažymi, kad registraciją galima atlikti teikiant pirmąjį ankstyvą perspėjimą. [NKSC rekomendacijos](https://nksc.lrv.lt/lt/naujienos/keiciasi-kibernetinio-saugumo-taisykles-gamintojams-isigalioja-naujos-pranesimu-teikimo-pareigos-pagal-kibernetinio-atsparumo-akta-RBA/).

**Ką daryti dabar:** paskirti savininką ir pavaduotoją, išbandyti prieigos procesą nepateikiant fiktyvaus incidento ir pasiruošti laukus produktui, versijoms, sužinojimo laikui, išnaudojimo įrodymams bei neatsakytiems klausimams. Stebėtus faktus atskirti nuo vertinimo. Naudojamos programinės įrangos pažeidžiamumų eilė nėra automatiškai jūsų gaminamo produkto pranešimų procesas. Pritaikomumą reikia įvertinti atskirai ir tai užrašyti.

</section>
