---
title: "Signalų apžvalga #4: atviri PLC, išnaudojamas Zimbra ir phishing per patikimas platformas"
card_title: "Signalų apžvalga #4: atviri PLC, Zimbra ir phishing per patikimas platformas"
description: "Aktyvi grėsmė viešiems PLC, devyni žinomi išnaudojami pažeidžiamumai, phishing per patikimas platformas, ransomware atkūrimo apgaulė ir Lietuvos pulsas. Laikotarpis: 2026 m. rugpjūčio 14–22 d."
seo_title: "Zimbra pažeidžiamumas ir Siemens S7 atakos: apžvalga #4"
seo_keywords:
  - "Zimbra pažeidžiamumas 2026"
  - "Siemens S7 PLC atakos"
  - "aktyviai išnaudojami pažeidžiamumai"
  - "phishing per patikimas platformas"
  - "ransomware atkūrimo apgaulė"
date: 2026-08-22 00:30:00 +0300
lang: lt
translation_key: hecavex-signal-brief-004
permalink: /lt/apzvalgos/2026-08-22/
author: deividas-lis
content_type: signal-brief
series: hecavex-signal-brief
issue: 4
coverage_start: 2026-08-14
coverage_end: 2026-08-22
information_cutoff: 2026-08-22 00:15:00 +0300
confidence: high
tlp: clear
categories: [security-briefings]
tags: [CISA KEV, operacinės technologijos, Siemens S7, Zimbra, Microsoft IKE, SharePoint, VMware vCenter, macOS, Ray, MLflow, TrueConf, phishing, ransomware, Lietuva]
featured: false
draft: false
toc: true
comments: false
leading_topics:
  - Aktyvus viešai pasiekiamų Siemens S7 PLC taikymasis
  - Išnaudojamas Zimbra ir perimetro programinė įranga
  - Ray ir MLflow kūrimo infrastruktūra
  - Phishing per patikimas platformas ir ransomware atkūrimo apgaulė
critical_count: 2
high_count: 2
watch_count: 3
scope: "Gynėjams aktualūs pokyčiai, paskelbti arba į CISA KEV įtraukti 2026 m. rugpjūčio 14–22 d., ir dvi to paties laikotarpio Lietuvos policijos suvestinės apie sukčiavimą."
limitations: "Tai prioritetizavimo apžvalga, ne visas grėsmių kraštovaizdis. Į JAV orientuota informacija neįrodo taikymosi į Lietuvą, o pavieniai policijos pranešimai neįrodo bendros kampanijos ar techninės pristatymo grandinės."
key_findings:
  - "Pasiekiamumas išlieka svarbiausiu kintamuoju: PLC, pašto serverius, su tapatybe susijusius servisus ir valdymo sistemas reikia vertinti pagal jų pasiekiamumą bei vaidmenį, ne pagal pažįstamą produkto pavadinimą."
  - "Lokalūs DI ir data-science servisai nėra izoliuoti vien todėl, kad juos savo kompiuteryje paleido programuotojas; naršyklė ir server-side užklausos gali peržengti tokią numanomą ribą."
  - "Atakos logika gali veikti teisėtoje bendradarbiavimo platformoje, todėl domeno reputaciją būtina papildyti naršyklės, endpoint ir identity įrodymais."
image:
  path: /assets/img/series/hecavex-signal-brief.svg
  social: /assets/img/social/hecavex-signal-brief-004-lt.png
  alt: "Analitinis signalas kerta viešas pramonines sistemas, pašto infrastruktūrą ir phishing kelius patikimose platformose"
  thumbnail: /assets/img/series/hecavex-signal-brief.svg
updates:
  - date: 2026-08-23
    note: "Patikslinta imtinio laikotarpio pradžia į rugpjūčio 14 d.; informacijos riba ir vertinti įvykiai nepasikeitė."
  - date: 2026-08-22
    note: "Pirmoji publikacija. Informacijos riba – 00:15 EEST."
---

Šios savaitės signalą sieja ne viena malware šeima, o vietos, kuriose sukuriama prieiga: viešas PLC, pašto serveris, valdymo servisas, lokaliai paleistas DI įrankis ar dokumentas patikimoje platformoje. Pažįstamas produktas ir geros reputacijos domenas suteikia kontekstą. Saugumo garantijos jie nesuteikia.

## Operacinės technologijos

<section class="hx-signal-entry hx-signal-entry--critical" markdown="1">
<p class="hx-signal-label">KRITINIS · AKTYVUS TAIKYMĄSIS · OPERACINĖS TECHNOLOGIJOS</p>

### Viešai pasiekiami Siemens S7 PLC yra aktyvus taikinys

<dl><div><dt>Įrodymai</dt><dd>Rugpjūčio 19 d. bendras CISA, NSA, FBI, DOE ir EPA pranešimas</dd></div><div><dt>Stebėta apimtis</dt><dd>Veikla prieš JAV įrenginius; pasiekiamumu paremta schema aktuali ir plačiau</dd></div></dl>

Institucijos praneša apie žvalgybą ir pajėgumų kūrimą prieš internetu pasiekiamus arba silpnai segmentuotus Siemens S7 PLC. Operatoriai naudoja su DI pagalba parengtus skriptus, paremtus `snap7.dll` ir `python-snap7`, pateikia juos kaip teisėtus stebėjimo įrankius ir per S7comm dirba su valdiklių atmintimi, konfigūracija bei ladder logic. Pranešimas apima S7-200, S7-300, S7-400, S7-1200 ir S7-1500 šeimas ir įspėja, kad platesnė veikla prieš PLC neapsiriboja Siemens.

Tai **neįrodo taikymosi į Lietuvos organizacijas**. Lietuvos gamybos, energetikos, vandens ir kitiems pramonės operatoriams informacija vis tiek tiesiogiai naudinga, nes paieška remiasi pasiekiamumu bei silpna segmentacija, ne vien geografija.

**Ką daryti dabar:** inventorizuoti PLC ir jų firmware, panaikinti tiesioginį pasiekiamumą iš interneto, patikrinti TCP/102 firewall taisykles, atskirti IT ir OT tinklus, leisti TIA Portal bei STEP 7 prieigą tik autorizuotoms engineering darbo vietoms ir peržiūrėti trečiųjų šalių nuotolinę prieigą. Ieškoti S7comm ryšių iš ne engineering sistemų, skaitymo ar rašymo ne darbo metu, nepatvirtintų Snap7 bibliotekų ir konfigūracijos pakeitimų be atitinkamo work order.

<p class="hx-signal-source"><a href="https://www.cisa.gov/news-events/cybersecurity-advisories/aa26-231a">Bendras pranešimas AA26-231A →</a></p>
</section>

## Išnaudojama infrastruktūra

<section class="hx-signal-entry hx-signal-entry--critical" markdown="1">
<p class="hx-signal-label">KRITINIS · ŽINOMAS IŠNAUDOJIMAS · PAŠTO INFRASTRUKTŪRA</p>

### CVE-2026-73570: komandų įterpimas į Zimbra

<dl><div><dt>Paveiktas kelias</dt><dd>SNMP stebėjimo komponentas, kai įjungti SNMP pranešimai</dd></div><div><dt>Atakos rezultatas</dt><dd>Operacinės sistemos komandos vykdomos Zimbra naudotojo teisėmis</dd></div></dl>

Rugpjūčio 21 d. CISA CVE-2026-73570 įtraukė į KEV. Katalogo įrašas aprašo neautentifikuotą užpuoliką, kuris specialiai suformuotomis SMTP užklausomis gali pasiekti savavališkų komandų vykdymą Zimbra naudotojo teisėmis. Zimbra nurodo, kad pažeidžiamumas yra SNMP stebėjimo komponente, kai įjungti pranešimai, ir 10.1.20 pateikia kaip pataisytą release.

**Ką daryti dabar:** patikrinti įdiegtą bei palaikomą šaką pagal naujausias Zimbra rekomendacijas ir pereiti į pataisytą release. Išsaugoti MTA, mailbox ir OS logus iki jų rotacijos; tikrinti Zimbra paskyros paleistus child process, naujus failus, scheduled tasks ir outbound connections. Jei pažeidžiamas servisas buvo pasiekiamas, upgrade atsako į remediation, bet ne į compromise klausimą.

<p class="hx-signal-source"><a href="https://www.cisa.gov/news-events/alerts/2026/08/21/cisa-adds-one-known-exploited-vulnerability-catalog">CISA pranešimas apie išnaudojimą →</a> · <a href="https://wiki.zimbra.com/wiki/Zimbra_Security_Advisories">Zimbra saugumo pranešimas →</a> · <a href="https://blog.zimbra.com/2026/07/patch-release-update-zimbra-10-1-20/">10.1.20 release pranešimas →</a></p>
</section>

<section class="hx-signal-entry hx-signal-entry--high" markdown="1">
<p class="hx-signal-label">AUKŠTAS PRIORITETAS · ŽINOMAS IŠNAUDOJIMAS · VERTINIMAS PAGAL PASIEKIAMUMĄ</p>

### Viena diena, keturi skirtingi perimetro klausimai

Rugpjūčio 18 d. CISA į KEV įtraukė keturis pažeidžiamumus su aktyvaus išnaudojimo įrodymais. Jų nereikėtų tvarkyti kaip vieno bendro patch paketo:

- **CVE-2026-33824 — Microsoft IKE:** double-free klaida, galinti leisti nuotolinį kodo vykdymą. Patikrinkite, kur pasiekiamas IKE servisas, ir įdiekite atitinkamą Microsoft atnaujinimą.
- **CVE-2026-55040 — Microsoft SharePoint:** silpna autentifikacija, galinti leisti tinklo užpuolikui apeiti saugumo funkciją. Pirmiausia tvarkykite pasiekiamą on-premises SharePoint ir peržiūrėkite autentifikacijos bei administravimo pakeitimus.
- **CVE-2026-59310 — VMware vCenter:** path traversal pažeidžiamumas Syslog serveryje. Broadcom teigia, kad tinklo prieigą prie vCenter turintis užpuolikas gali vykdyti savavališką kodą; gamintojo pranešime pateiktos pataisytos versijos, workaround nėra.
- **CVE-2026-65400 — macOS Screen Sharing:** Apple nurodo, kad tinklo užpuolikas gali autentifikuotis Screen Sharing be galiojančių prisijungimo duomenų. Atnaujinkite paveiktas macOS sistemas, o nereikalingą Screen Sharing išjunkite arba apribokite.

Rugpjūčio 20 d. CISA papildomai įtraukė TrueConf Server pažeidžiamumus **CVE-2026-72529** ir **CVE-2026-72530**. Pirmasis leidžia TCP/4307 pasiekiančiam neautentifikuotam užpuolikui iškviesti kritinę funkciją ir vykdyti skriptą. Antrasis gali paversti kodo vykdymą izoliuotoje aplinkoje komandomis pačioje hosto OS. TrueConf kaip pataisytas versijas nurodo 5.3.9, 5.4.9 ir 5.5.5.

**Ką daryti dabar:** kiekvieną CVE susieti su realiu produktu, savininku, versija, tinklo keliu ir sistemos vaidmeniu. Pirmiausia taisyti pasiekiamas sistemas, tada atskirai spręsti, ar ankstesnis pasiekiamumas reikalauja kompromitavimo tyrimo. CISA terminai privalomi atitinkamoms JAV federalinėms institucijoms; kitoms organizacijoms prioritetą turėtų nustatyti išnaudojimo įrodymai, pasiekiamumas ir sistemos reikšmė.

<p class="hx-signal-source"><a href="https://www.cisa.gov/news-events/alerts/2026/08/18/cisa-adds-four-known-exploited-vulnerabilities-catalog">CISA keturių įrašų pranešimas →</a> · <a href="https://msrc.microsoft.com/update-guide/en-US/vulnerability/CVE-2026-33824">Microsoft IKE pranešimas →</a> · <a href="https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-55040">Microsoft SharePoint pranešimas →</a> · <a href="https://support.broadcom.com/web/ecx/support-content-notification/-/external/content/SecurityAdvisories/0/38017">Broadcom VMSA-2026-0006 →</a> · <a href="https://support.apple.com/en-us/148170">Apple saugumo pranešimas →</a> · <a href="https://www.cisa.gov/news-events/alerts/2026/08/20/cisa-adds-two-known-exploited-vulnerabilities-catalog">CISA TrueConf pranešimas →</a> · <a href="https://trueconf.com/blog/news/security-fixes-updates-and-advisories">TrueConf pažeidžiamumų lentelė →</a></p>
</section>

## Kūrimo ir DI infrastruktūra

<section class="hx-signal-entry hx-signal-entry--high" markdown="1">
<p class="hx-signal-label">AUKŠTAS PRIORITETAS · ŽINOMAS IŠNAUDOJIMAS · KŪRIMO SERVISAI</p>

### Ray ir MLflow laužo prielaidą, kad „lokalus“ reiškia „izoliuotas“

Rugpjūčio 17 d. CISA įtraukė Ray pažeidžiamumą **CVE-2025-62593**. Projekto pranešime aprašomas DNS rebinding kelias: Firefox arba Safari naudojančio programuotojo lokalus Ray servisas gali tapti nuotolinio kodo vykdymo taikiniu po apsilankymo kenksmingame puslapyje ar parodytos malicious reklamos. Paveiktos ankstesnės nei 2.52.0 Ray versijos.

Rugpjūčio 19 d. į KEV pateko **CVE-2026-64849** MLflow. Numatytos konfigūracijos Tracking Server per model registry webhook gali atverti neautentifikuotą full-read server-side request forgery kelią. Redirect ir DNS rebinding elgsena gali leisti užpuolikui pasiekti vidinius servisus ar cloud metadata ir gauti jų atsakymą. MLflow 3.15.0 turi pataisymą.

Tai skirtingi pažeidžiamumai su ta pačia architektūrine pamoka: `localhost`, development etiketė ir vidinis hostname nėra trust boundary, jei juos gali peržengti naršyklė ar server-side užklausų funkcija.

**Ką daryti dabar:** atnaujinti Ray ir MLflow, rasti, kas juos naudoja už valdomo production inventoriaus ribų, bindinti servisus tik prie reikalingų interfeisų, pridėti autentifikaciją ir tinklo kontrolę bei įvertinti, ar buvo pasiekiami cloud metadata ar lokalūs secrets. Jei pasiekiamumo negalima atmesti, keisti paveiktus credentials, o ne manyti, kad versijos atnaujinimas pašalino įrodymus.

<p class="hx-signal-source"><a href="https://www.cisa.gov/news-events/alerts/2026/08/17/cisa-adds-one-known-exploited-vulnerability-catalog">CISA Ray pranešimas →</a> · <a href="https://github.com/ray-project/ray/security/advisories/GHSA-q279-jhrf-cc6v">Ray projekto pranešimas →</a> · <a href="https://www.cisa.gov/news-events/alerts/2026/08/19/cisa-adds-one-known-exploited-vulnerability-catalog">CISA MLflow pranešimas →</a> · <a href="https://github.com/advisories/GHSA-7gwp-5pfp-969j">MLflow pranešimas →</a></p>
</section>

## Social engineering ir reagavimas į incidentus

<section class="hx-signal-entry hx-signal-entry--watch" markdown="1">
<p class="hx-signal-label">STEBĖTI · PATIKIMOS PLATFORMOS IŠNAUDOJIMAS · ATVEJO ANALIZĖ</p>

### Teisėtas Google Doc talpino užkrėtimo workflow

Huntress aprašė po DEF CON prasidėjusį kontaktą: užpuolikas per X tiesiogines žinutes naudojo netikrą konferencijos planavimo pretekstą. Jis pateikė Google Doc, kurio Apps Script sidebar rodė ClickFix tipo instrukcijas ir rankinio atsisiuntimo variantą. Antras kelias imitavo DocSend diegimo programą. Huntress macOS kelyje stebėjo AMOS infostealer, o Windows kelyje – NetSupport RAT, Ledger wallet implant ir srautą perimantį proxy.

Tai vienas ištirtas kontaktas, ne įrodymas, kad kiekvienas konferencijos follow-up ar Google dokumentas yra kenksmingas. Gynybinė išvada siauresnė ir ilgiau galiojanti: teisėtas domenas gali talpinti dokumentą ir skriptą, kuriuose veikia pati ataka. Vien domeno reputacija šio skirtumo neparodys.

**Ką daryti dabar:** naudotojams ir help desk aiškiai pasakyti, kad bendrinamas dokumentas neturi prašyti kopijuoti komandų į terminalą ar Run dialogą. Pranešant apie atvejį išsaugoti visą žinučių grandinę, dokumento URL, skriptą ir atsisiuntimo kelią. Koreliuoti naršyklės, endpoint ir identity veiklą; phishing domenų feed yra tik vienas tyrimo sluoksnis.

<p class="hx-signal-source"><a href="https://www.huntress.com/blog/defcon-phishing-google-doc-malware">Huntress atvejo analizė →</a></p>
</section>

<section class="hx-signal-entry hx-signal-entry--watch" markdown="1">
<p class="hx-signal-label">STEBĖTI · RANSOMWARE · ANTRINIS EXTORTION</p>

### Nekviesta „duomenų atkūrimo įmonė“ gali būti įsilaužimo dalis

GuidePoint praneša apie kelis ransomware atvejus, kuriuose **Ransom Busters** vardu veikianti persona susisiekė su aukomis dar iki viešo incidento paskelbimo ir už 20 000–60 000 JAV dolerių siūlė atkurti arba ištrinti pavogtus duomenis. Dviejų atvejų forensics parodė sutampančius reconnaissance, exfiltration, remote-management ir persistence sprendimus. GuidePoint su vidutiniu confidence vertina, kad tai yra per kelias ransomware-as-a-service operacijas dirbantis affiliate, o ne nepriklausoma atkūrimo įmonė.

Tai GuidePoint vertinimas; vieši įrodymai nepatvirtina, kad už kiekvieno nekviesto atkūrimo pasiūlymo stovi tas pats operatorius. Jie patvirtina kitą dalyką: žinutė su neviešomis incidento detalėmis yra įrodymas, o ne customer support.

**Ką daryti dabar:** išsaugoti žinutę, headers, mokėjimo instrukcijas ir pateiktus proof-of-data; kontaktą perduoti jau incidentą valdančiam incident-response, teisiniam ir teisėsaugos procesui. Neperkelti pokalbio į nevaldomą kanalą ir nelaikyti mokėjimo įrodymu, kad nebeliks kitos duomenų kopijos.

<p class="hx-signal-source"><a href="https://www.guidepointsecurity.com/blog/beware-ransom-busters/">GuidePoint Ransom Busters analizė →</a></p>
</section>

## Lietuvos pulsas

<section class="hx-signal-entry hx-signal-entry--watch" markdown="1">
<p class="hx-signal-label">STEBĖTI · LIETUVA · PRANEŠTA APIE SUKČIAVIMĄ</p>

### Du nuostoliai, bet nėra pagrindo vienos kampanijos istorijai

Rugpjūčio 18 d. Marijampolės policija užfiksavo pranešimą apie žmogų, kuris kelis kartus nesėkmingai bandė prisijungti prie elektroninės bankininkystės, o vėliau rado 700 eurų pervedimą į nežinomo asmens sąskaitą. Suvestinėje nurodyta įvykių seka ir nuostolis, bet nenustatytas prisijungimo duomenų perėmimo būdas, phishing domenas ar visa transakcijos autorizavimo grandinė.

Rugpjūčio 19 d. Lietuvos policijos suvestinėje atskirai užfiksuotas Vilniaus gyventojo pranešimas apie 15 145 eurų nuostolį investuojant per internetinę platformą rugpjūčio 3–18 d. Suvestinė nesusieja šio atvejo su bankininkystės incidentu ir nenurodo bendros techninės kampanijos.

Praktinė pamoka čia yra apie įrodymus: pranešimai apie nuostolius parodo žalą, ne attribution. Iki darant išvadą apie sukčiavimo kelią reikia išsaugoti SMS ir susirašinėjimą, pilną URL, transakcijos bei autentifikavimo prompt, gavėjo duomenis ir įrenginio bei naršyklės informaciją.

<p class="hx-signal-source"><a href="https://marijampole.policija.lrv.lt/lt/ivykiu-suvestines/2026-08-18-ivykiu-suvestine-CRHm/">Marijampolės policijos suvestinė →</a> · <a href="https://policija.lrv.lt/lt/ivykiu-suvestines/2026-08-19-suvestine-sTI5/">Lietuvos policijos suvestinė →</a></p>
</section>

## Esmė

Skubiausiame sąraše yra vieši PLC, Zimbra ir tie šios savaitės KEV produktai, kurie iš tikrųjų veikia jūsų aplinkoje. Platesnis signalas – „vidinis“ ir „patikimas“ yra sąlyginės būsenos. Naršyklė gali pasiekti lokalų development servisą, žinoma dokumentų platforma gali talpinti kenksmingą logiką, o tariama atkūrimo įmonė gali būti dar vienas extortion kelias.

Įrodymų kategorijų nesuplakite. JAV taikymasis vien dėl panašumo netampa taikymusi į Lietuvą, o du Lietuvos sukčiavimo pranešimai netampa kampanija todėl, kad pasirodė tą pačią savaitę. Prioritetizuokite tai, kas pasiekiama, išsaugokite tai, kas gali parodyti kelią, ir aiškiai įvardykite, kas dar nežinoma.
