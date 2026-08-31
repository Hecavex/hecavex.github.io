---
title: "Signalų apžvalga #3: išnaudojamas Metabase, privačios cyber operacijos ir DI remiamas šnipinėjimas"
card_title: "Signalų apžvalga #3: Metabase, privačios cyber operacijos ir DI šnipinėjime"
description: "Trys išnaudojami CVE, du geopolitiniai cyber pokyčiai, trys duomenų nutekėjimo ir ransomware atvejai bei dvi šnipinėjimo kampanijos. Laikotarpis: 2026 m. rugpjūčio 10–14 d."
seo_description: "Apžvalga apie išnaudojamus CVE, geopolitinius cyber pokyčius, ransomware atvejus ir šnipinėjimo kampanijas 2026 m. rugpjūčio 10–14 d."
seo_title: "Metabase pažeidžiamumas ir DI šnipinėjimas: apžvalga #3"
seo_keywords:
  - "Metabase pažeidžiamumas 2026"
  - "CISA KEV rugpjūtis 2026"
  - "privačios kibernetinės operacijos"
  - "DI remiamas šnipinėjimas"
  - "Kimsuky Midnight Blizzard"
date: 2026-08-14 11:45:00 +0300
lang: lt
translation_key: hecavex-signal-brief-003
permalink: /lt/apzvalgos/2026-08-14/
author: deividas-lis
content_type: signal-brief
series: hecavex-signal-brief
issue: 3
coverage_start: 2026-08-10
coverage_end: 2026-08-14
information_cutoff: 2026-08-14 11:30:00 +0300
confidence: high
tlp: clear
categories: [security-briefings]
tags: [CISA KEV, Metabase, Windows, Cisco ASA, cyber politika, Taiwan, Trezor, CEVA Logistics, Gunra, Kimsuky, Midnight Blizzard]
featured: false
draft: false
toc: true
comments: false
leading_topics:
  - Trys išnaudojami pažeidžiamumai, kuriems reikia veiksmo
  - Valstybių naudojami autonominiai agentai ir privatūs cyber operatoriai
  - Logistikos tiekėjų duomenų nutekėjimai ir ransomware veikla
  - Kimsuky ir Midnight Blizzard šnipinėjimo metodai
critical_count: 1
high_count: 2
watch_count: 7
scope: "Gynėjams aktualūs pokyčiai, atrinkti iki 2026 m. rugpjūčio 14 d., prioritetą teikiant naujiems CISA KEV įrašams, dabartiniams nutekėjimams ir vis dar reikšmingai aptariamoms kampanijoms."
limitations: "Tai prioritetizavimo apžvalga, ne visas grėsmių kraštovaizdis. Kelių kampanijų tyrimai vis dar vyksta. Attribution žymos atspindi nurodytus šaltinius ir yra atskirtos nuo HECAVEX analizės."
key_findings:
  - "Vienas Metabase SQL injection gana greitai tampa tapatybių, credentials ir prijungtų duomenų bazių problema."
  - "DI agentai iš pagalbinio įrankio keliauja į realius intrusion workflow, bet vieši įrodymai vis dar nepagrindžia kiekvienos antraštės apie visiškai autonominį cyber karą."
  - "Logistikos duomenys tampa paruoštu social engineering kontekstu, o viešbučių tinklai rodo, kad priešiškas gali būti net kelias iki login puslapio."
image:
  path: /assets/img/series/hecavex-signal-brief.svg
  social: /assets/img/social/hecavex-signal-brief-003-lt.png
  alt: "Analitinis signalas kerta išnaudojamos programinės įrangos, geopolitinių cyber operacijų ir šnipinėjimo kampanijų radarą"
  thumbnail: /assets/img/series/hecavex-signal-brief.svg
updates:
  - date: 2026-08-14
    note: "Pirmoji publikacija. Informacijos riba 11:30 EEST."
---

Šią savaitę nėra vienos bendros kampanijos. Yra ta pati operacinė problema su skirtingais lipdukais: patikimos sistemos, patikimi tiekėjai ir patikimi tinklo keliai tampa užpuoliko svertu. Pirma tvarkome pažeidžiamą software, tada žiūrime į identity, third-party duomenis ir kelionių infrastruktūrą. Incidentui mūsų nubraižytos ribos paprastai nelabai rūpi.

## Prioritetizuotini pažeidžiamumai

<section class="hx-signal-entry hx-signal-entry--critical" markdown="1">
<p class="hx-signal-label">KRITINIS · ŽINOMAS IŠNAUDOJIMAS · SQL INJECTION PRIEŠ AUTENTIFIKACIJĄ</p>

### CVE-2026-72898: Metabase

<dl><div><dt>Paveiktas paviršius</dt><dd>Nepataisytos Metabase instaliacijos</dd></div><div><dt>Atakos rezultatas</dt><dd>SQL injection į aplikacijos duomenų bazę, administratoriaus prieiga ir prijungtų duomenų atskleidimas</dd></div></dl>

CISA CVE-2026-72898 į KEV įtraukė rugpjūčio 11 d. Neautentifikuotas užpuolikas gali įterpti SQL į Metabase aplikacijos duomenų bazę, gauti administratoriaus prieigą, pakeisti konfigūraciją, paimti prijungtų duomenų bazių credentials ir skaityti arba eksportuoti per jas pasiekiamus duomenis. Čia nėra tik dashboard bug. Metabase dažnai labai patogiai parodo, kur organizacija laiko įdomiausius duomenis.

**Ką daryti dabar:** atnaujinti į pataisytą Metabase versiją. Jei laikinai užblokavote reset-password endpointą, tai yra papildomas laikas, ne galutinis taisymas. Atšaukti aktyvias sesijas ir API keys, peržiūrėti administratorių pakeitimus bei query history. Jei negalite atmesti išnaudojimo, keisti prijungtų duomenų bazių credentials.

<p class="hx-signal-source"><a href="https://github.com/metabase/metabase/security/advisories/GHSA-vwf4-m7j8-wcjf">Metabase saugumo pranešimas →</a> · <a href="https://www.cisa.gov/known-exploited-vulnerabilities-catalog?search_api_fulltext=CVE-2026-72898">CISA KEV įrašas →</a></p>
</section>

<section class="hx-signal-entry hx-signal-entry--high" markdown="1">
<p class="hx-signal-label">AUKŠTAS PRIORITETAS · ŽINOMAS IŠNAUDOJIMAS · PRIVILEGIJŲ KĖLIMAS</p>

### CVE-2026-68820: Windows Ancillary Function Driver for WinSock

<dl><div><dt>Paveiktas paviršius</dt><dd>Microsoft rugpjūčio atnaujinimu dengiamos Windows sistemos</dd></div><div><dt>Atakos rezultatas</dt><dd>Jau autentifikuoto lokalaus užpuoliko privilegijų pakėlimas</dd></div></dl>

Windows AFD komponente esantis use-after-free nėra pradinis patekimas. Tai sekantis žingsnis po jo. Dėl to pažeidžiamumas aktualus ransomware, hands-on-keyboard ir malware grandinėse, kur žemų privilegijų prieigą reikia paversti pilna hosto kontrole. CISA pažeidžiamumą į KEV įtraukė rugpjūčio 11 d.

**Ką daryti dabar:** diegti atitinkamą Windows security update. Pirmiausia tvarkyti endpointus, kuriuose naršyklė, el. paštas ar viešas servisas suteikia realų initial-access kelią, ir ieškoti įtartinų privilege transition aplink naujus procesus bei servisus.

<p class="hx-signal-source"><a href="https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-68820">Microsoft saugumo pranešimas →</a> · <a href="https://www.cisa.gov/known-exploited-vulnerabilities-catalog?search_api_fulltext=CVE-2026-68820">CISA KEV įrašas →</a></p>
</section>

<section class="hx-signal-entry hx-signal-entry--high" markdown="1">
<p class="hx-signal-label">AUKŠTAS PRIORITETAS · ŽINOMAS IŠNAUDOJIMAS · NETWORK EDGE DOS</p>

### CVE-2026-20349: Cisco ASA ir FTD

<dl><div><dt>Paveiktas paviršius</dt><dd>Paveiktos konfigūracijos Cisco ASA ir Secure Firewall Threat Defense įrenginiai</dd></div><div><dt>Atakos rezultatas</dt><dd>Nuotolinis įrenginio perkrovimas be autentifikacijos ir denial of service</dd></div></dl>

Neautentifikuotas užpuolikas gali aktyvuoti heap inspection klaidą ir priversti paveiktą firewall persikrauti. Čia ne RCE, bet nuolat dingstantis interneto edge vis tiek yra incidentas. CISA nustatyta KEV sutvarkymo data buvo rugpjūčio 14 d., šiandienos apžvalgos informacijos riba.

**Ką daryti dabar:** pagal Cisco pranešimą patikrinti tikslų modelį, release ir viešai pasiekiamus servisus, įdiegti pataisytą software ir peržiūrėti nepaaiškinamus reload. Jei įrenginys yra HA poroje, patikrinti realų failover, o ne tikėtis, kad antras node viską tyliai sutvarkė.

<p class="hx-signal-source"><a href="https://sec.cloudapps.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-asaftd-vpn-dos-dzv4mQFF">Cisco saugumo pranešimas →</a> · <a href="https://www.cisa.gov/known-exploited-vulnerabilities-catalog?search_api_fulltext=CVE-2026-20349">CISA KEV įrašas →</a></p>
</section>

## Geopolitiniai cyber signalai

<section class="hx-signal-entry hx-signal-entry--watch" markdown="1">
<p class="hx-signal-label">STEBĖTI · DI REMIAMAS ĮSILAUŽIMAS · RIBOTA ATTRIBUTION</p>

### Taivano ataskaitose autonominiai agentai jau dalyvauja valstybiniame įsilaužime

Šią savaitę paskelbtas tyrimas aprašo keturias dienas trukusią kampaniją prieš Taivano valstybines sistemas. Orchestration stack buvo sukurtas aplink open-source Hermes ir OpenClaw agentus. Dream išvadomis paremtoje medžiagoje nurodoma, kad sistema išžvalgė 21 sistemą, perėmė bent 85 paskyras ir gavo daugiau nei 2 500 darbuotojų įrašų, vienu metu naudodama iki aštuonių agentų.

Įrodymai įdomūs, bet su formuluotėmis nereikia pradėti lenktynių. Vieša informacija pagrindžia DI remiamą ir stipriai automatizuotą intrusion activity. Ji savarankiškai neįrodo įtariamos sąsajos su Kinija, neatskleidžia naudoto modelio ir neparodo, kad kiekvieną sprendimą priėmė autonominis agentas. Taivanas taip pat patvirtino liepos mėnesio įsilaužimą su AI-agent pagalba, tačiau viešai neįrodyta, kad abu aprašymai yra tas pats incidentas.

**Ką stebėti:** agent execution logus, viešas orchestration paneles, neįprastą lygiagretų autentifikacijos ir reconnaissance srautą bei situacijas, kai nepavykęs kelias labai greitai kartojamas jau visiškai kitu metodu.

<p class="hx-signal-source"><a href="https://www.tomshardware.com/tech-industry/cyber-security/suspected-china-linked-hackers-used-ai-to-run-the-first-ever-end-to-end-autonomous-cyberattack-on-taiwans-government-israeli-firm-says-open-source-built-tool-continuously-devised-effective-hack-strategies-in-real-time">Ataskaita apie Dream išvadas →</a></p>
</section>

<section class="hx-signal-entry hx-signal-entry--watch" markdown="1">
<p class="hx-signal-label">STEBĖTI · CYBER POLITIKA · PRIVATŪS OPERATORIAI</p>

### JAV kuria valstybės kontroliuojamą kelią privačioms offensive cyber operacijoms

Naujas JAV memorandumas kuria sistemą, pagal kurią patikrintos įmonės, kontroliuojamos ir prižiūrimos federalinės valdžios, galėtų vykdyti cyber surveillance ir cyber effects operacijas prieš užsienyje veikiančias cyber-enabled transnational criminal organizacijas. Tai nėra bendras leidimas įmonėms imtis "hack back". Tai bandymas privačius pajėgumus įdėti į valstybės tyrimo ir infrastruktūros trikdymo operacijas.

Svarbiausi klausimai yra ne tokie gražūs antraštėje: kas atsako už attribution, kaip veiksmai derinami su žvalgybos operacijomis, kas nutinka pataikius į shared infrastructure ir kam lieka atsakomybė, kai taikinys pasirodo ne toks, kaip atrodė pirmame intelligence report.

**Ką stebėti:** įgyvendinimo taisykles, dalyvių vetting, ataskaitų teikimą, operacinę priežiūrą ir kaip ši sistema atskirs kriminalinę infrastruktūrą nuo valstybės valdomos veiklos.

<p class="hx-signal-source"><a href="https://techcrunch.com/2026/08/13/in-a-first-us-will-allow-some-private-firms-to-carry-out-cyberattacks/">Dabartinė informacija apie memorandumą →</a> · <a href="https://www.whitehouse.gov/presidential-actions/2026/03/combating-cybercrime-fraud-and-predatory-schemes-against-american-citizens/">Ankstesnis Baltųjų rūmų įsakymas →</a></p>
</section>

## Duomenų nutekėjimai, extortion ir ransomware

<section class="hx-signal-entry hx-signal-entry--watch" markdown="1">
<p class="hx-signal-label">STEBĖTI · THIRD-PARTY NUTEKĖJIMAS · TIKSLINIS PHISHING</p>

### Trezor klientų duomenys nutekėjo per ShipMonk

Trezor nurodo, kad neautorizuota prieiga logistikos tiekėjo ShipMonk sistemose paveikė 13 689 klientus. 11 742 žmonių pilnas duomenų rinkinys apėmė vardą, el. paštą, telefono numerį ir pristatymo adresą. Dar 1 947 atvejais nutekėjo vardas, miestas ir el. paštas. Trezor sistemos, įrenginiai ir wallet backup nebuvo kompromituoti.

Operacinė rizika yra kontekstas. Žinutei, kuri žino, kad gavėjas pirko hardware wallet ir gali pakartoti jo adresą, nereikia vogto seed. Jai reikia, kad žmogus jį pateiktų dabar.

**Ką daryti dabar:** paveikti vartotojai turėtų nepasitikėti support, delivery ir firmware-update žinutėmis, Trezor puslapį atidaryti per žinomą bookmark ir niekada neatskleisti wallet backup. Organizacijų help desk verta pasiruošti skambučiams, kuriuose bus cituojami tikri užsakymo duomenys.

<p class="hx-signal-source"><a href="https://trezor.io/blog/news/recent-customer-data-exposed-in-shipping-provider-incident">Trezor incidento pranešimas →</a></p>
</section>

<section class="hx-signal-entry hx-signal-entry--watch" markdown="1">
<p class="hx-signal-label">STEBĖTI · LOGISTIKOS SUPPLY CHAIN · PRISTATYMO DUOMENYS</p>

### CEVA Logistics incidentas pasiekė Valve hardware klientus

Valve informavo Europos hardware klientus po to, kai liepos 29 d. ir rugpjūčio 1 d. laikotarpiu buvo atakuotas logistikos partneris CEVA Logistics. Galimai paveikti duomenys apima vardus, adresus, pašto kodus, telefono numerius, el. pašto adresus ir užsakytas prekes. Valve teigia, kad slaptažodžiai, mokėjimo informacija ir Steam Guard kodai nepateko į incidentą.

Tai paruošta medžiaga antram kampanijos etapui. Netikras muito mokestis, praleisto pristatymo SMS ar account-verification skambutis skamba gerokai įtikinamiau, kai siuntėjas žino, ką žmogus iš tikrųjų užsisakė.

**Ką daryti dabar:** žinutes apie naujausius Steam hardware užsakymus laikyti nepatikimomis net tada, kai jose pateikti teisingi pristatymo duomenys. Organizacijoms verta žinoti, kurie logistikos tiekėjai saugo klientų duomenis, kiek laiko ir kokiu keliu praneša apie incidentą.

<p class="hx-signal-source"><a href="https://www.pcgamer.com/gaming-industry/steam-user-data-may-have-been-compromised-by-a-cyberattack-targeting-valves-european-shipping-partner/">Valve patvirtintos incidento detalės →</a></p>
</section>

<section class="hx-signal-entry hx-signal-entry--watch" markdown="1">
<p class="hx-signal-label">STEBĖTI · RANSOMWARE · VALSTYBĖS IR CYBERCRIME PERSIDENGIMAS</p>

### Gunra plečiasi, o attribution riba lieka nepatogiai neryški

JAV ir Pietų Korėjos šaltiniais paremti šios savaitės pranešimai įspėjo apie Gunra ransomware veiklą prieš valstybinius ir critical-infrastructure sektorius. Operacija naudoja double extortion modelį, cross-platform locker ir affiliate įrankius, kuriems įtaką padarė nutekėjęs Conti kodas. Atskirame bendrame Pietų Korėjos institucijų pranešime Operation Double Barrel vardu aprašomas valstybės remiamos intrusion grupės ir su Gunra siejamos veiklos persidengimas.

Persidengimas dar nėra tapatybė. Tie patys pažeidžiamumai, infrastruktūra ar access path gali reikšti bendradarbiavimą, access broker, įrankių pernaudojimą arba tiesiog du operatorius prie to paties silpno perimeter. "State actor plius ransomware" yra hipotezė, kurią reikia tikrinti, o ne etiketė kiekvienam Gunra incidentui.

**Ką daryti dabar:** prioritetizuoti viešą remote-access infrastruktūrą, išsaugoti įrodymus dar prieš tai, kai šifravimo response juos sunaikins, ir atskirti initial access, hands-on-keyboard, exfiltration bei locker deployment stebėjimus. Tie etapai nebūtinai priklauso vienam operatoriui.

<p class="hx-signal-source"><a href="https://www.itpro.com/security/ransomware/warning-issued-over-gunra-ransomware-gang-as-attacks-ramp-up-globally">Dabartinis įspėjimas apie Gunra →</a> · <a href="https://asec.ahnlab.com/en/94696/">Operation Double Barrel analizė →</a></p>
</section>

## Šnipinėjimo kampanijos

<section class="hx-signal-entry hx-signal-entry--watch" markdown="1">
<p class="hx-signal-label">STEBĖTI · KIMSUKY · LOKALUS DI WORKBENCH</p>

### Operation GitPower rodo Kimsuky kuriamą DI remiamą workflow

Genians praneša, kad Kimsuky operatoriai kūrė lokalų LLM setup su Ollama, GPT4All ir Msty, RAG, agentų bei speech-to-text komponentais. Platesnėje operacijoje GitHub ir GitLab naudoti kaip command-and-control kanalai, taip pat matyti šifruoti AsyncRAT payload, LNK failai, PowerShell ir DI generuotas decoy turinys. Taikiniai apėmė diplomatines atstovybes, kariuomenę, saugumo ir virtualaus turto sektorius.

Pagrįsta išvada yra ta, kad Kimsuky integruoja ir testuoja DI jau turimame workflow. Tai neįrodo, kad grupė apmokė savo modelį ar visą operaciją perdavė autonominiam agentui. Senas tradecraft niekur nedingo. Jis tiesiog gavo greitesnį research ir content-production sluoksnį.

**Ką stebėti:** developer tipo lokalius AI įrankius sistemose, kurioms jų nereikia, neįprastą GitHub ar GitLab API srautą, LNK-to-PowerShell grandines, šifruotą RAT staging ir decoy dokumentus, kurių kalbos kokybė geresnė už visą likusį operatoriaus OPSEC.

<p class="hx-signal-source"><a href="https://www.genians.co.kr/en/blog/threat_intelligence/kimsuky_ai_llm">Genians Operation GitPower analizė →</a></p>
</section>

<section class="hx-signal-entry hx-signal-entry--watch" markdown="1">
<p class="hx-signal-label">STEBĖTI · MIDNIGHT BLIZZARD · PRIEŠIŠKI KELIONIŲ TINKLAI</p>

### CaptiveCrunch viešbučio Wi-Fi paverčia šnipinėjimo pristatymo keliu

Microsoft CaptiveCrunch priskiria Storm-2945, kurį vertina kaip Midnight Blizzard operacinį sub-cluster. Nuo gegužės operatorius kompromitavo hospitality captive-portal infrastruktūrą ir keitė DNS bei HTTP srautą, nukreipdamas keliautojus per savo sistemas. Netikri login ir update langai naudoti credentials vagystei bei surveillance-capable malware, įskaitant CornFlake, pristatymui.

Svarbiausia čia yra vieta, kur sugenda pasitikėjimas. Viešbučio pavadinimas gali būti tikras, Wi-Fi gali būti tas, kurį davė registratūra, o portalą vis tiek gali valdyti užpuolikas. Diplomatams, vadovams ir tyrėjams kelionių tinklas yra threat model dalis, ne patogumo nustatymas.

**Ką daryti dabar:** kai įmanoma, naudoti valdomą mobilų ryšį, jautrioms paskyroms reikalauti phishing-resistant autentifikacijos, neleisti diegti browser update iš captive portal ir po kelionės tikrinti galimą token reuse. Hospitality operatoriams portalų konfigūracija, DNS pakeitimai ir administravimo prieiga turi būti security-critical infrastruktūra.

<p class="hx-signal-source"><a href="https://www.microsoft.com/en-us/security/blog/2026/07/31/captivecrunch-midnight-blizzard-targets-travelers-worldwide-for-malware-delivery-and-credential-theft/">Microsoft CaptiveCrunch analizė →</a></p>
</section>

## Esmė

Skubus sąrašas paprastas: pataisyti Metabase, Windows ir paveiktus Cisco edge įrenginius, tada patikrinti, ar pažeidžiama būsena buvo išnaudota. Platesnis signalas yra apie trust boundaries. Logistikos tiekėjai žino pakankamai, kad phishing skambėtų įtikinamai. Viešbučio tinklas gali pakeisti srautą dar iki tikro serviso. DI agentai gali sutrumpinti reconnaissance ir execution laiką, bet attribution nuo to lengvesnė netampa.

Nereikia visko suplakti į vieną dramatišką istoriją. Laikykite įrodymus atskirai, fiksuokite confidence ir veikite pagal tai, ką iš tikrųjų galite patikrinti.
