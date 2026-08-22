---
title: "Signalų apžvalga #2: N-central perėmimas, TeamCity išnaudojimas ir viešos valdymo sistemos"
card_title: "Signalų apžvalga #2: N-central, TeamCity ir viešos valdymo sistemos"
description: "Penki aktyviai išnaudojami pažeidžiamumų prioritetai, Adform JavaScript supply-chain incidentas ir konkretūs patikrinimai gynėjams. Laikotarpis: 2026 m. rugpjūčio 3–9 d."
date: 2026-08-09 12:00:00 +0300
lang: lt
translation_key: hecavex-signal-brief-002
permalink: /lt/apzvalgos/2026-08-09/
author: deividas-lis
content_type: signal-brief
series: hecavex-signal-brief
issue: 2
coverage_start: 2026-08-03
coverage_end: 2026-08-09
information_cutoff: 2026-08-09 11:30:00 +0300
confidence: high
tlp: clear
categories: [security-briefings]
tags: [CISA KEV, N-able, N-central, Langflow, TeamCity, Progress LoadMaster, Apache Tomcat, Adform, supply-chain]
featured: false
draft: false
toc: true
comments: false
leading_topics:
  - Penki išnaudojami pažeidžiamumai, kuriems reikia veiksmo
  - Valdymo ir build infrastruktūros pasiekiamumas
  - Adform JavaScript supply-chain kompromitavimas
critical_count: 4
high_count: 1
watch_count: 1
scope: "Gynėjams aktualūs pokyčiai, įtraukti į CISA KEV arba reikšmingai atnaujinti 2026 m. rugpjūčio 3–9 d., ir vienas savarankiškai analizuotas supply-chain incidentas."
limitations: "Tai prioritetizavimo apžvalga, ne visas grėsmių kraštovaizdis. Pasiekiamumą, paveiktas versijas, gamintojo rekomendacijas ir kompromitavimo požymius reikia tikrinti konkrečioje aplinkoje."
key_findings:
  - "Skubiausiame sąraše dominuoja nuotolinio valdymo, CI/CD ir apkrovos balansavimo sistemos, nes jų kompromitavimas suteikia pasiekiamumą gerokai už vieno serverio ribų."
  - "N-central primena, kad pirmo hotfix įdiegimas dar nereiškia incidento pabaigos: CVE-2026-18577 liko po nepilno pataisymo ir prireikė papildomos mitigacijos."
  - "Adform atvejis rodo, kad patikima browser-side priklausomybė gali keisti transakcijos duomenis net neįdiegdama persistentiško malware vartotojo įrenginyje."
image:
  path: /assets/img/series/hecavex-signal-brief.svg
  social: /assets/img/social/hecavex-signal-brief-002-lt.png
  alt: "Analitinis signalas kerta viešų valdymo sistemų, build infrastruktūros ir supply-chain priklausomybių radarą"
  thumbnail: /assets/img/series/hecavex-signal-brief.svg
updates:
  - date: 2026-08-09
    note: "Pirmoji publikacija. Informacijos riba 11:30 EEST."
---

Šią savaitę daugiausia kalbame apie sistemas, kuriomis gynėjai valdo kitas sistemas. Remote monitoring, CI/CD ir load balancing platformos naudingos todėl, kad turi platų pasiekiamumą. Lygiai tas pats pasiekiamumas tampa daugikliu užpuolikui, kai valdymo sluoksnis paliekamas viešai.

## Prioritetizuotini pažeidžiamumai

<section class="hx-signal-entry hx-signal-entry--critical" markdown="1">
<p class="hx-signal-label">KRITINIS · ŽINOMAS IŠNAUDOJIMAS · NEPILNAS PATAISYMAS</p>

### CVE-2026-18577 ir CVE-2026-18556: N-able N-central

<dl><div><dt>Paveiktas paviršius</dt><dd>N-central nuotolinio stebėjimo ir valdymo serveriai</dd></div><div><dt>Atakos rezultatas</dt><dd>Autentifikacijos apėjimas ir paskyros perėmimas</dd></div></dl>

CISA šią savaitę į KEV įtraukė abu autentifikacijos apėjimo pažeidžiamumus. CVE-2026-18577 buvo alternatyvus kelias, likęs po ankstesnio CVE-2026-18556 taisymo. Čia svarbu ne tik pats web app. N-central pagal paskirtį gali administruoti daugybę kitų endpointų, todėl vieno serverio kompromitavimas gana greitai nustoja būti vieno serverio problema.

**Ką daryti dabar:** vadovautis naujausiomis N-able rekomendacijomis ir diegti dabartinę papildomą mitigaciją, o ne sustoti ties pirmu hotfix. Patikrinti realų build, sumažinti pasiekiamumą iš interneto, peržiūrėti naujas ar pakeistas paskyras, remote sessions, scripts ir veiksmus prieš svarbiausias sistemas. Jei serveris buvo viešas ir nepataisytas, čia jau incidento scope klausimas.

<p class="hx-signal-source"><a href="https://status.n-able.com/2026/08/06/n-central-2026-3-hotfix-2-additional-mitigation-for-cve-2026-18577/">N-able Hotfix 2 pranešimas →</a> · <a href="https://www.cisa.gov/known-exploited-vulnerabilities-catalog?search_api_fulltext=CVE-2026-18577">CISA KEV įrašas →</a></p>
</section>

<section class="hx-signal-entry hx-signal-entry--critical" markdown="1">
<p class="hx-signal-label">KRITINIS · ŽINOMAS IŠNAUDOJIMAS · RCE BE AUTENTIFIKACIJOS</p>

### CVE-2026-9198: IBM Langflow

<dl><div><dt>Paveiktas paviršius</dt><dd>Numatytos konfigūracijos Langflow instaliacijos</dd></div><div><dt>Atakos rezultatas</dt><dd>Kodo vykdymas be autentifikacijos</dd></div></dl>

CISA aprašo neautentifikuotą code injection kelią iki pilno remote code execution. AI workflow builder vis tiek yra serveris su credentials, integracijomis ir prieiga prie duomenų. Etiketė "AI įrankis" neatleidžia nuo visai neįdomaus, bet reikalingo exposure management.

**Ką daryti dabar:** surasti pasiekiamas Langflow instaliacijas, taikyti IBM nurodytą pataisymą, pašalinti nereikalingą viešą prieigą ir tikrinti process execution, outbound connections, secrets bei workflow pakeitimus. Jei servisas buvo pasiekiamas iki pataisymo, vien update neatsako, ar kas nors tuo pasinaudojo.

<p class="hx-signal-source"><a href="https://www.ibm.com/support/pages/node/7278927">IBM saugumo pranešimas →</a> · <a href="https://www.cisa.gov/known-exploited-vulnerabilities-catalog?search_api_fulltext=CVE-2026-9198">CISA KEV įrašas →</a></p>
</section>

<section class="hx-signal-entry hx-signal-entry--critical" markdown="1">
<p class="hx-signal-label">KRITINIS · AKTYVUS IŠNAUDOJIMAS · CI/CD</p>

### CVE-2026-63077: JetBrains TeamCity

<dl><div><dt>Paveiktas paviršius</dt><dd>Per HTTP(S) pasiekiamas TeamCity On-Premises</dd></div><div><dt>Atakos rezultatas</dt><dd>OS komandų vykdymas be autentifikacijos</dd></div></dl>

JetBrains jau praneša apie aktyvų ir bandytą nepataisytų serverių išnaudojimą. Pažeidžiamumas pasiekiamas per agent polling protocol. Sėkmingas išnaudojimas gali atverti saugomus credentials, pakeisti serverio būseną ir paliesti build artifacts ar tolesnį CI/CD pipeline.

**Ką daryti dabar:** atnaujinti į 2025.11.7 arba 2026.1.3. Jei iškart nepavyksta, taikyti security patch plugin. Loguose ieškoti `com.thoughtworks.xstream.converters.ConversionException`, peržiūrėti unauthorized agents, ypač vardus, prasidedančius `scan`, ir ištirti, kokius credentials galėjo pasiekti serveris bei jo buildai.

<p class="hx-signal-source"><a href="https://blog.jetbrains.com/teamcity/2026/08/cve-2026-63077-update/">JetBrains aktyvaus išnaudojimo atnaujinimas →</a> · <a href="https://www.cisa.gov/known-exploited-vulnerabilities-catalog?search_api_fulltext=CVE-2026-63077">CISA KEV įrašas →</a></p>
</section>

<section class="hx-signal-entry hx-signal-entry--critical" markdown="1">
<p class="hx-signal-label">KRITINIS · ŽINOMAS IŠNAUDOJIMAS · EDGE INFRASTRUKTŪRA</p>

### CVE-2026-8037: Progress Kemp LoadMaster

<dl><div><dt>Paveiktas paviršius</dt><dd>LoadMaster GA 7.2.63.1 ir senesnės; LTSF 7.2.54.17 ir senesnės versijos</dd></div><div><dt>Atakos rezultatas</dt><dd>Komandų vykdymas prieš autentifikaciją</dd></div></dl>

Pažeidžiamumas leidžia vykdyti savavališkas komandas per neišvalytą įvestį keliuose command endpointuose. Load balanceriai stovi labai patogioje tinklo vietoje: pasiekiami iš išorės, laikomi patikimais ir yra prieš aplikacijas, kurios iš tikrųjų rūpi.

**Ką daryti dabar:** taikyti naujausią Progress pataisymą, riboti administravimo prieigą ir peržiūrėti appliance logus, konfigūracijos pakeitimus, naujas paskyras, netikėtą outbound traffic bei bandymus judėti į už LoadMaster esančias sistemas.

<p class="hx-signal-source"><a href="https://community.progress.com/s/article/LoadMaster-Critical-Security-Bulletin-June-2026-CVE-2026-8037-CVE-2026-33691">Progress saugumo pranešimas →</a> · <a href="https://www.cisa.gov/known-exploited-vulnerabilities-catalog?search_api_fulltext=CVE-2026-8037">CISA KEV įrašas →</a></p>
</section>

<section class="hx-signal-entry hx-signal-entry--high" markdown="1">
<p class="hx-signal-label">AUKŠTAS PRIORITETAS · ŽINOMAS IŠNAUDOJIMAS · CLUSTER SAUGUMAS</p>

### CVE-2026-34486: Apache Tomcat EncryptInterceptor apėjimas

<dl><div><dt>Paveikta sąlyga</dt><dd>Tomcat clustering su paveiktu EncryptInterceptor</dd></div><div><dt>Kodėl svarbu</dt><dd>Ankstesnį saugumo taisymą buvo galima apeiti</dd></div></dl>

Apache nurodo, kad CVE-2026-29146 pataisymo klaida leido apeiti EncryptInterceptor apsaugą. CISA taip pat pažymi galimą grandinę su CVE-2025-24813. Šitas variantas priklauso nuo konfigūracijos, todėl klausimas nėra vien "ar turime Tomcat?". Reikia žinoti, ar naudojamas konkretus clustering kelias, kokiose versijose ir per kokią trust boundary.

**Ką daryti dabar:** inventorizuoti Tomcat clusterius ir versijas, pereiti į pataisytą palaikomos šakos release, patikrinti EncryptInterceptor konfigūraciją ir neleisti cluster traffic keliauti per nepatikimus tinklus.

<p class="hx-signal-source"><a href="https://tomcat.apache.org/security-9.html">Apache Tomcat pažeidžiamumų įrašas →</a> · <a href="https://www.cisa.gov/known-exploited-vulnerabilities-catalog?search_api_fulltext=CVE-2026-34486">CISA KEV įrašas →</a></p>
</section>

## Pokytis, kurį verta stebėti

<section class="hx-signal-entry hx-signal-entry--watch" markdown="1">
<p class="hx-signal-label">STEBĖTI · SOFTWARE SUPPLY CHAIN · BROWSER-SIDE POVEIKIS</p>

### Adform bendras JavaScript tapo crypto clipper

Kompromituotam `trackpoint-async.js` nereikėjo diegti malware kiekvienam lankytojui. Kol paveiktas puslapis buvo atidarytas, pridėtas kodas galėjo pakeisti Bitcoin ir Ethereum adresus puslapio tekste, formų laukuose bei su clipboard susijusiuose įvykiuose. Analizėje atkūriau keturis payload variantus ir radau 83 exact-hash stebėjimus 59 hostuose. 55 hostai gavo bent vieną variantą su veikiančiomis replacement piniginėmis, 4 hostai gavo tik ankstyvą variantą su netinkamomis adresų eilutėmis.

**Ką daryti dabar:** nustatyti, kur skriptas buvo kraunamas, tikrinti cached ir edge-served atsakus už centrinio incidento lango ribų, išsaugoti paveiktą JavaScript bei browser evidence ir peržiūrėti crypto procesus, kurie pasitikėjo naršyklėje rodomu adresu. Švarus origin atsakas šiandien neįrodo, kad visi tarpiniai cache buvo švarūs vakar.

<p class="hx-signal-source"><a href="/lt/tyrimai/adform-supply-chain-crypto-clipper/">Visas HECAVEX tyrimas →</a> · <a href="https://site.adform.com/resources/newsroom/security-incident-company-update/">Adform incidento atnaujinimas →</a></p>
</section>

## Esmė

Pradėkite nuo **pasiekiamumo ir blast radius**. N-central, TeamCity ir LoadMaster gali paveikti gerokai daugiau nei pirmą kompromituotą procesą. Patikrinkite, ar įdiegtas tikrai naujausias fix, tada žiūrėkite atgal ir ieškokite išnaudojimo, o ne skelbkite pergalę pasibaigus update wizard. Adform atveju į tyrimo scope įtraukite browser-side priklausomybes ir užsilikusį cache.

Visi pažeidžiamumų prioritetai iki nurodytos informacijos ribos buvo CISA KEV kataloge. Gamintojų rekomendacijos ir išnaudojimo detalės po publikavimo gali keistis.
