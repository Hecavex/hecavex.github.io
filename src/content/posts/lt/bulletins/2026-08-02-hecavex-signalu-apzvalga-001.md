---
title: "Signalų apžvalga #1: išnaudojami tinklo įrenginiai, WordPress RCE grandinė ir DI vertinimo rizika"
description: "Penki CVE, kuriuos verta prioritetizuoti, Hugging Face modelių vertinimo incidentas ir naujos Kibernetinio atsparumo akto gairės. Laikotarpis: 2026 m. liepos 20 d.–rugpjūčio 2 d."
seo_description: "Prioritetinė apžvalga apie penkis CVE, WordPress RCE grandinę, Hugging Face incidentą ir CRA gaires nuo liepos 20 d. iki rugpjūčio 2 d."
seo_title: "Aktyviai išnaudojami pažeidžiamumai 2026: apžvalga #1"
seo_keywords:
  - "aktyviai išnaudojami pažeidžiamumai 2026"
  - "CISA KEV"
  - "WordPress RCE"
  - "tinklo įrenginių pažeidžiamumai"
  - "DI modelių saugumas"
date: 2026-08-02 20:00:00 +0300
lang: lt
translation_key: hecavex-signal-brief-001
permalink: /lt/apzvalgos/2026-08-02/
author: deividas-lis
content_type: signal-brief
series: hecavex-signal-brief
issue: 1
coverage_start: 2026-07-20
coverage_end: 2026-08-02
information_cutoff: 2026-08-02 18:00:00 +0300
confidence: high
tlp: clear
categories: [security-briefings]
tags: [CISA KEV, pažeidžiamumai, reagavimas į incidentus, DI saugumas, Kibernetinio atsparumo aktas, WordPress, Fortinet, Cisco, Arista]
featured: false
draft: false
toc: true
comments: false
leading_topics:
  - Penki prioritetizuotini CVE
  - DI modelių vertinimo saugumas
  - CRA įgyvendinimo gairės
critical_count: 2
high_count: 2
watch_count: 2
scope: "Gynėjams aktualūs įvykiai, paskelbti arba reikšmingai atnaujinti nuo 2026 m. liepos 20 d. iki rugpjūčio 2 d."
limitations: "Tai prioritetizavimo apžvalga, o ne visas grėsmių kraštovaizdis. Produkto pasiekiamumą, gamintojo rekomendacijas ir vėlesnius atnaujinimus būtina patikrinti savo aplinkoje."
key_findings:
  - "Internetu pasiekiamos valdymo sistemos išlieka aiškiausiu skubiu prioritetu: Cisco FMC, Arista VeloCloud Orchestrator ir paveikti FortiOS įrenginiai turi būti vertinami pagal realų pasiekiamumą."
  - "Du WordPress pažeidžiamumai numatytoje konfigūracijoje gali būti sujungti į autentifikacijos nereikalaujančią nuotolinio kodo vykdymo grandinę."
  - "Hugging Face incidentas parodė, kad pajėgūs modeliai vertinimo infrastruktūrą gali paversti atakos paviršiumi, o ne likti pasyviais testo objektais."
image:
  path: /assets/img/series/hecavex-signal-brief.svg
  social: /assets/img/social/hecavex-signal-brief-001-lt.png
  alt: "Analitinis signalas kerta kibernetinių grėsmių radarą ir susietus indikatorius"
  thumbnail: /assets/img/series/hecavex-signal-brief.svg
updates:
  - date: 2026-08-02
    note: "Pirmoji publikacija. Informacijos riba – 18:00 EEST."
---

Tai pirmoji **HECAVEX signalų apžvalga**: trumpai, remiantis pirminiais šaltiniais, apie tai, kam verta skirti dėmesį, ką tai reiškia praktiškai ir ką tikrinti toliau. Čia nebandau perrašyti visų savaitės kibernetinio saugumo naujienų. Dar vieno nuorodų sąvartyno, apsimetančio naujienlaiškiu, tikrai niekam netrūksta.

## Prioritetizuotini pažeidžiamumai

<section class="hx-signal-entry hx-signal-entry--high" markdown="1">
<p class="hx-signal-label">AUKŠTAS PRIORITETAS · ŽINOMAS IŠNAUDOJIMAS</p>

### CVE-2026-20316 — Cisco Secure Firewall Management Center

<dl><div><dt>Paveiktas paviršius</dt><dd>Cisco Secure FMC valdymo sąsaja</dd></div><div><dt>Kodėl svarbu</dt><dd>Autentifikacija naudojant įdiegtą slaptažodį</dd></div></dl>

Liepos 29 d. CISA įtraukė šį pažeidžiamumą į Known Exploited Vulnerabilities katalogą. Nuotolinis neautentifikuotas užpuolikas, pasinaudojęs įdiegtu slaptažodžiu, gali prisijungti prie mažų teisių paskyros ir pasiekti jautrią informaciją. **Pavyzdys:** viešai pasiekiama valdymo sąsaja suteikia galiojantį pradinį priėjimą net nevagiant administratoriaus slaptažodžio.

**Ką daryti:** rasti internetu pasiekiamus FMC, vadovautis Cisco šalinimo rekomendacijomis, apriboti valdymo prieigą ir patikrinti neįprastas mažų teisių sesijas.

<p class="hx-signal-source"><a href="https://www.cisa.gov/known-exploited-vulnerabilities-catalog?search_api_fulltext=CVE-2026-20316">CISA KEV įrašas →</a></p>
</section>

<section class="hx-signal-entry hx-signal-entry--critical" markdown="1">
<p class="hx-signal-label">KRITINIS · PRANEŠAMA APIE AKTYVŲ IŠNAUDOJIMĄ</p>

### CVE-2026-16812 — Arista VeloCloud Orchestrator

<dl><div><dt>Paveiktas paviršius</dt><dd>Lokaliai diegiamas VeloCloud Orchestrator</dd></div><div><dt>Rimtingumas</dt><dd>CVSS 10,0, nereikia prisijungimo duomenų</dd></div></dl>

Arista praneša apie aktyvų operacinės sistemos komandų įterpimo pažeidžiamumo išnaudojimą. Specialiai suformuota užklausa gali leisti vykdyti savavališkas komandas. **Pavyzdys:** viešai pasiekiamas orkestratorius gali tapti pirmu užvaldytu mazgu aplinkoje, kuri juo pasitiki valdydama padalinių ryšį.

**Ką daryti:** atnaujinti bent į 5.2.3.14, 6.1.3.4, 6.4.2.4 arba 7.0.0.1 – pagal naudojamą šaką – ir patikrinti gamintojo nurodytus kompromitavimo indikatorius. Atnaujinimas nėra tyrimo pabaiga, jei sistema jau galėjo būti pasiekiama.

<p class="hx-signal-source"><a href="https://www.arista.com/en/support/advisories-notices/security-advisory/24364-security-advisory-0144">Arista saugumo pranešimas 0144 →</a></p>
</section>

<section class="hx-signal-entry hx-signal-entry--high" markdown="1">
<p class="hx-signal-label">AUKŠTAS PRIORITETAS · ŽINOMAS IŠNAUDOJIMAS</p>

### CVE-2025-68686 — FortiOS SSL-VPN išlikimo apėjimas

<dl><div><dt>Paveistos versijos</dt><dd>FortiOS 7.6.0–7.6.1 ir 7.4.0–7.4.6</dd></div><div><dt>Būtina sąlyga</dt><dd>Ankstesnis failų sistemos lygio kompromitavimas</dd></div></dl>

Pažeidžiamumas gali leisti ankstesnio įsilaužimo metu sukurtai kenksmingai simbolinei nuorodai išlikti po pirminio gamintojo taisymo. Liepos 27 d. CISA įtraukė CVE į KEV – vėliau nei vasarį ir kovą atnaujintas Fortinet pranešimas, kuriame tuo metu žinomo išnaudojimo nebuvo. Tai gera pamoka: grėsmės būsena yra judantis laukas, o ne publikavimo dieną amžiams priklijuota etiketė.

**Ką daryti:** diegti pataisytą versiją, atlikti Fortinet rekomenduojamas vientisumo patikras ir ieškoti pirminio kompromitavimo požymių. Naudojantiems senesnes 7.2, 7.0 ir 6.4 šakas reikia migruoti.

<p class="hx-signal-source"><a href="https://www.fortiguard.com/psirt/FG-IR-25-934">Fortinet pranešimas FG-IR-25-934 →</a></p>
</section>

<section class="hx-signal-entry hx-signal-entry--critical" markdown="1">
<p class="hx-signal-label">KRITINĖ GRANDINĖ · ŽINOMAS IŠNAUDOJIMAS</p>

### CVE-2026-60137 + CVE-2026-63030 — WordPress Core

<dl><div><dt>Atakos kelias</dt><dd>SQL injection ir interpretavimo neatitikimas</dd></div><div><dt>Rezultatas</dt><dd>Nuotolinis kodo vykdymas be autentifikacijos</dd></div></dl>

CISA teigia, kad abu pažeidžiamumai numatytoje konfigūracijoje gali būti sujungti į autentifikacijos nereikalaujančią nuotolinio kodo vykdymo grandinę. **Pavyzdys:** vieša WordPress svetainė, kuri atrodo „tik informacinė“, vis tiek gali tapti vykdomąja infrastruktūra, peradresavimo mazgu ar keliu į gretimus hostingo resursus.

**Ką daryti:** atnaujinti WordPress Core, inventorizuoti visas viešai pasiekiamas instaliacijas – taip, įskaitant seniai pamirštus kampanijų puslapius – ir ieškoti netikėtų duomenų bazės pakeitimų, naujų naudotojų, modifikuotų įskiepių ar viešai pasiekiamų failų.

<p class="hx-signal-source"><a href="https://www.cisa.gov/known-exploited-vulnerabilities-catalog?search_api_fulltext=CVE-2026-60137">CVE-2026-60137 CISA KEV →</a> · <a href="https://www.cisa.gov/known-exploited-vulnerabilities-catalog?search_api_fulltext=CVE-2026-63030">CVE-2026-63030 CISA KEV →</a></p>
</section>

## Pokyčiai, kuriuos verta stebėti

<section class="hx-signal-entry hx-signal-entry--watch" markdown="1">
<p class="hx-signal-label">STEBĖTI · DI SAUGUMAS</p>

### Modelio vertinimas virto infrastruktūros saugumo incidentu

OpenAI ir Hugging Face paskelbė, kad apribotoje vertinimo aplinkoje veikę modeliai išnaudojo iki tol nežinomą Artifactory proxy pažeidžiamumą, išplėtė prieigą ir galiausiai kompromitavo Hugging Face produkcinę aplinką, kad pasiektų benchmark atsakymus. Abi organizacijos incidentą suvaldė ir tyrė.

Praktinė išvada platesnė už vieną testą: **pajėgių modelių vertinimo infrastruktūrai reikia tokios pačios izoliacijos, minimalių teisių, stebėsenos ir priešiško testavimo kaip bet kuriai nepatikimo kodo vykdymo aplinkai.** „Čia tik testas“ išlieka vienu brangesnių sakinių saugumo srityje.

<p class="hx-signal-source"><a href="https://openai.com/index/hugging-face-model-evaluation-security-incident/">OpenAI incidento ataskaita ir atnaujinimai →</a></p>
</section>

<section class="hx-signal-entry hx-signal-entry--watch" markdown="1">
<p class="hx-signal-label">STEBĖTI · REGULIAVIMAS / PRODUKTŲ SAUGUMAS</p>

### Europos Komisija paskelbė CRA įgyvendinimo gaires

Liepos 27 d. Komisija paskelbė neprivalomas Kibernetinio atsparumo akto taikymo gaires dėl taikymo srities, esminio pakeitimo, palaikymo laikotarpio, rizikos vertinimo ir raportavimo. Laikas svarbus: 14 straipsnio pažeidžiamumų ir incidentų pranešimų pareigos įsigalios **2026 m. rugsėjo 11 d.**, anksčiau nei dauguma kitų CRA reikalavimų.

Gamintojams naudingiausias kitas žingsnis yra operacinis, ne ceremoninis: sujungti produkto inventorių, SBOM, pasiekiamumo analizę, telemetriją, PSIRT sprendimus ir raportavimo atsakomybę dar iki 24 valandų laikmačio pradžios.

<p class="hx-signal-source"><a href="https://digital-strategy.ec.europa.eu/en/library/commission-publishes-new-guidance-support-timely-cyber-resilience-act-implementation/">Europos Komisijos gairių apžvalga →</a></p>
</section>

## Esmė

Prioritetizuokite pagal **pasiekiamumą, išnaudojimo įrodymus ir sistemos vaidmenį**, ne vien pagal CVSS. Pradėkite nuo pasiekiamų valdymo sistemų ir WordPress grandinės, tada įvertinkite, ar kartu su atnaujinimu būtinas kompromitavimo tyrimas. Atskirai: DI vertinimo aplinką laikykite nepatikimo kodo infrastruktūra, o CRA raportavimą – operaciniu terminu, ne dar vieno dokumento parengimo data.

Visos aukščiau pateiktos nuorodos veda į pirminius šaltinius. Apžvalga atspindi iki nurodytos informacijos ribos turėtus duomenis, gamintojų ir institucijų rekomendacijos po publikavimo gali keistis.
