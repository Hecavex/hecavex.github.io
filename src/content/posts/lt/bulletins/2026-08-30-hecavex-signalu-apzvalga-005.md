---
title: "Signalų apžvalga #5: išnaudojamos kūrimo platformos, DI valdymo sluoksniai ir internetu pasiekiamos kameros"
card_title: "Signalų apžvalga #5: kūrimo platformos, DI valdymo sluoksniai ir internetu pasiekiamos kameros"
description: "Vienuolika naujų CISA KEV įrašų, atakos prieš DI gateway ir orchestration servisus, kamerų saugumo rekomendacijos ir Lietuvos phishing atvejis. Laikotarpis: 2026 m. rugpjūčio 22–30 d."
seo_description: "Apžvalga apie vienuolika CISA KEV papildymų, atakas prieš DI servisus, viešas kameras ir Lietuvos marketplace phishing atvejį."
seo_title: "Gitea, ownCloud ir DI gateway atakos | Apžvalga #5"
seo_keywords:
  - "Gitea CVE-2026-60004 išnaudojimas"
  - "ownCloud CVE-2023-49105"
  - "Oracle CVE-2026-21962"
  - "DI gateway atakos LiteLLM RAGFlow Kestra"
  - "CISA KEV 2026 rugpjūtis"
date: 2026-08-30 15:30:00 +0300
lang: lt
translation_key: hecavex-signal-brief-005
permalink: /lt/apzvalgos/2026-08-30/
author: deividas-lis
content_type: signal-brief
series: hecavex-signal-brief
issue: 5
coverage_start: 2026-08-22
coverage_end: 2026-08-30
information_cutoff: 2026-08-30 15:00:00 +0300
confidence: high
tlp: clear
categories: [security-briefings]
tags: [CISA KEV, CTI, phishing]
featured: false
draft: false
toc: true
comments: false
leading_topics:
  - Žinomas Gitea, Oracle ir ownCloud išnaudojimas
  - Skirtingos remediation eilės viename KEV pakete
  - DI gateway ir orchestration servisai kaip credentials saugyklos
  - Kamerų pasiekiamumas ir Lietuvos marketplace phishing atvejis
critical_count: 3
high_count: 4
watch_count: 2
scope: "Gynėjams aktualūs pokyčiai, paskelbti arba į CISA KEV įtraukti 2026 m. rugpjūčio 22–30 d., ir to paties laikotarpio oficiali Microsoft, Lietuvos institucijų bei policijos informacija."
limitations: "Tai prioritetizavimo apžvalga, ne visas grėsmių kraštovaizdis. KEV įrašas patvirtina išnaudojimą kažkur, bet ne konkrečioje organizacijoje. Gamintojo severity, CISA įtraukimas ir aktualumas Lietuvai vertinami atskirai."
key_findings:
  - "Kūrimo ir turinio platformos yra control plane: Gitea, Artifactory ir ownCloud reikia prioritetizuoti pagal prieigą, pasiekiamumą ir secrets ar duomenis, kuriuos jos gali pasiekti."
  - "DI gateway, retrieval servisai ir workflow orchestratoriai vienoje vietoje sukaupia provider keys, duomenų bazių prieigą ir vykdymo galimybes, todėl vienos aplikacijos kompromitavimo poveikis gali būti daug platesnis už vieną container."
  - "Fizinio saugumo telemetrija gali tapti žvalgybos rinkimu, o pažįstamas marketplace pokalbis vis tiek gali baigtis credentials surinkimo puslapyje."
image:
  path: /assets/img/series/hecavex-signal-brief.svg
  social: /assets/img/social/hecavex-signal-brief-005-lt.png
  alt: "Analitinis signalas kerta kūrimo platformas, DI valdymo sluoksnius, cloud saugyklas ir atviras kameras"
  thumbnail: /assets/img/series/hecavex-signal-brief.svg
updates:
  - date: 2026-08-30
    note: "Pirmoji publikacija. Informacijos riba – 15:00 EEST."
---

Šios savaitės skubiausiame sąraše nėra vienos produktų šeimos. Jame yra sistemos, stovinčios neįprastai arti kodo, credentials ir duomenų: source-code platforma, Oracle web sluoksnis, failų dalinimosi sistema, artifact repository ir keli DI valdymo sluoksniai. Per apžvalgos laikotarpį CISA į Known Exploited Vulnerabilities katalogą įtraukė vienuolika pažeidžiamumų. Juos sieja išnaudojimo įrodymai, bet ne vienodos prielaidos, poveikis ar remediation kelias. Visų vienuolikos įrašų ryšį su žinomomis ransomware kampanijomis CISA žymi kaip "Unknown".

Šis skirtumas svarbus. Critical balas aprašo galimą poveikį nustatytomis sąlygomis. KEV įtraukimas sako, kad išnaudojimas buvo stebėtas. Nė vienas iš jų nepasako, ar jūsų instance buvo pasiekiamas, pažeidžiamas arba kompromituotas. Sakinį vis tiek turi užbaigti inventorius, pasiekiamumas ir įrodymai.

## Kūrimo ir turinio platformos

<section class="hx-signal-entry hx-signal-entry--critical" markdown="1">
<p class="hx-signal-label">KRITINIS · ŽINOMAS IŠNAUDOJIMAS · SOURCE-CODE INFRASTRUKTŪRA</p>

### CVE-2026-60004: repository write tampa komandų vykdymu Gitea serveryje

<dl><div><dt>Svarbiausios prielaidos</dt><dd>Git 2.32+, įjungtas diffpatch route, rašymui ir vykdymui tinkamas laikinasis katalogas</dd></div><div><dt>Reikalinga prieiga</dt><dd>Repository write; atvira registracija tik panaikina iš anksto turimos paskyros poreikį</dd></div></dl>

Rugpjūčio 25 d. CISA CVE-2026-60004 įtraukė į KEV. Gitea pranešime aprašytas code-injection kelias, kuriame užpuoliko valdomas patch turinys gali įrašyti vykdomą Git hook į laikiną bare clone. Rašydamas index, Git paleidžia hook ir leidžia vykdyti savavališkas shell komandas Gitea operacinės sistemos naudotojo teisėmis.

Formuluotė "reikia repository write prieigos" neturėtų automatiškai sumažinti prioriteto. Kai įjungta atvira registracija, lankytojas šią prieigą gali gauti susikūręs įprastą paskyrą ir repository. Sėkmingas kompromitavimas gali atverti `app.ini`, proceso secrets, prijungtus repository, duomenų bazės credentials, OAuth duomenis ir iš Gitea hosto pasiekiamus servisus. Paveiktos Gitea versijos nuo 1.17 iki ankstesnių nei 1.27.1.

**Ką daryti dabar:** rasti visas self-hosted Gitea sistemas, patikrinti jų versiją, registracijos politiką, pasiekiamumą iš interneto ir ar veikia `diffpatch` route. Atnaujinti į 1.27.1 arba naujesnę versiją. Tikrinti repository kūrimą, neįprastas patch užklausas, Git child process, pakeitimus laikinuose Git kataloguose ir Gitea service account paleistą shell veiklą. Jei išnaudojimo atmesti negalima, po įrodymų išsaugojimo pakeisti aplikacijos, duomenų bazės, OAuth ir integracijų secrets.

<p class="hx-signal-source"><a href="https://www.cisa.gov/news-events/alerts/2026/08/25/cisa-adds-one-known-exploited-vulnerability-catalog">CISA pranešimas apie išnaudojimą →</a> · <a href="https://github.com/go-gitea/gitea/security/advisories/GHSA-rcr6-4jqh-j84m">Gitea saugumo pranešimas →</a></p>
</section>

<section class="hx-signal-entry hx-signal-entry--critical" markdown="1">
<p class="hx-signal-label">KRITINIS · ŽINOMAS IŠNAUDOJIMAS · ORACLE WEB SLUOKSNIS</p>

### CVE-2026-21962: vieši Oracle proxy komponentai keliauja į eilės pradžią

<dl><div><dt>Paveiktas komponentas</dt><dd>Oracle HTTP Server ir WebLogic Server Proxy Plug-in</dd></div><div><dt>Gamintojo severity</dt><dd>CVSS 10.0, nuotolinis išnaudojimas be autentifikacijos</dd></div></dl>

Rugpjūčio 24 d. CISA įtraukė CVE-2026-21962. KEV įraše aprašyta netinkama Oracle HTTP Server ir WebLogic Server Proxy Plug-in prieigos kontrolė, galinti leisti neautentifikuotam nuotoliniam užpuolikui gauti pilną per paveiktą komponentą pasiekiamų duomenų prieigą ir juos keisti. Oracle pažeidžiamumą sutvarkė 2026 m. sausio Critical Patch Update ir nurodo paveiktas 12.2.1.4.0, 14.1.1.0.0 bei 14.1.2.0.0 šakas.

Proxy sluoksniui reikia atskiro inventoriaus dėmesio, nes jis gali būti valdomas kaip web infrastruktūra ir nebūti įrašytas šalia WebLogic aplikacijų, kurias aptarnauja. Pataisytas backend neatsako, ar kitame ingress taške vis dar pasiekiamas senesnis HTTP Server arba plug-in.

**Ką daryti dabar:** Oracle HTTP Server ir WebLogic proxy ieškoti ne tik aplikacijų inventoriuje, bet ir load balancer, reverse proxy bei DNS įrašuose. Patikrinti tikslų komponentą ir patch lygį, pašalinti nereikalingus viešus listener ir išsaugoti HTTP, proxy bei WebLogic logus. Peržiūrėti netikėtą administracinę prieigą, duomenų pakeitimus ir užklausas, kurios iki pataisymo pasiekė apsaugotus aplikacijos kelius.

<p class="hx-signal-source"><a href="https://www.cisa.gov/news-events/alerts/2026/08/24/cisa-adds-one-known-exploited-vulnerability-catalog">CISA pranešimas apie išnaudojimą →</a> · <a href="https://www.oracle.com/security-alerts/cpujan2026.html">Oracle 2026 m. sausio Critical Patch Update →</a></p>
</section>

<section class="hx-signal-entry hx-signal-entry--critical" markdown="1">
<p class="hx-signal-label">KRITINIS · ŽINOMAS IŠNAUDOJIMAS · FAILŲ DALINIMOSI DUOMENYS</p>

### CVE-2023-49105: senas ownCloud pažeidžiamumas grįžta į aktyvią eilę

<dl><div><dt>Paveiktos versijos</dt><dd>ownCloud Server 10.6.0–10.13.0</dd></div><div><dt>Galimas rezultatas</dt><dd>Failų peržiūra, keitimas arba trynimas be autentifikacijos</dd></div></dl>

Rugpjūčio 27 d. CISA į KEV įtraukė CVE-2023-49105, praėjus beveik trejiems metams po ownCloud pranešimo. Jei užpuolikas žino aukos username, o paskyroje nėra sukonfigūruoto signing key, WebDAV pre-signed URL klaida gali be autentifikacijos leisti pasiekti, keisti arba ištrinti naudotojo failus. ownCloud pažeidžiamumą vertina 9.8 balo ir rekomenduoja paveiktą Server atnaujinti į 10.13.3 arba pritaikyti gamintojo pataisą.

Amžius nėra saugumo kontrolė. Legacy servisas gali išlikti todėl, kad veikia tyliai, priklauso jau išėjusiam savininkui arba slepiasi po hostname, kurio nėra dabartiniame CMDB. KEV įtraukimas pakeičia klausimą iš "ar tai sena?" į "ar dar liko pažeidžiama sistema ir kokie įrodymai išliko?"

**Ką daryti dabar:** ownCloud Server ieškoti per DNS, certificates, reverse proxy ir package inventory. Atskirti classic ownCloud Server nuo Infinite Scale bei managed services, kurių gamintojas nelaiko paveiktais. Atnaujinti arba pritaikyti pataisą, tada peržiūrėti WebDAV prieigą ir failų pakeitimų istoriją dėl neįprasto pre-signed URL naudojimo. Audit įrašus išsaugoti iki tol, kol retention procesai pašalins exposure laikotarpį.

<p class="hx-signal-source"><a href="https://www.cisa.gov/news-events/alerts/2026/08/27/cisa-adds-three-known-exploited-vulnerabilities-catalog">CISA pranešimas apie išnaudojimą →</a> · <a href="https://owncloud.com/security-advisories/webdav-api-authentication-bypass-using-pre-signed-urls/">ownCloud saugumo pranešimas →</a> · <a href="https://owncloud.com/blogs/immediate-action-required-critical-security-updates-for-owncloud/">ownCloud remediation pranešimas →</a></p>
</section>

<section class="hx-signal-entry hx-signal-entry--high" markdown="1">
<p class="hx-signal-label">AUKŠTAS PRIORITETAS · ARTIFACT REPOSITORY · DVI ĮRODYMŲ EILĖS</p>

### Artifactory parodo, kodėl severity ir išnaudojimas yra skirtingi stulpeliai

<dl><div><dt>Žinomas išnaudojimas</dt><dd>CVE-2026-66384, autentifikuota path restriction klaida</dd></div><div><dt>Naujas critical pranešimas</dt><dd>CVE-2026-82329, galimas authentication bypass</dd></div></dl>

Rugpjūčio 27 d. CISA į KEV įtraukė **CVE-2026-66384**. JFrog jį aprašo kaip medium-severity sąlygą, kai autentifikuotas naudotojas tam tikrose remote repository konfigūracijose gali rašyti duomenis už numatyto Docker cache kelio ribų. Vidutinis gamintojo balas nepanaikina stebėto išnaudojimo signalo.

Rugpjūčio 28 d. JFrog atskirai paskelbė **CVE-2026-82329**, critical galimą authentication bypass, vedantį į Artifactory administratoriaus prieigą nurodytose 7.111, 7.117, 7.125, 7.133, 7.146 ir 7.161 release šakose. Informacijos ribos metu jo KEV nebuvo. Nebuvimas kataloge neįrodo, kad pažeidžiamumas neišnaudojamas. Tai reiškia, kad du pažeidžiamumai į eilę patenka dėl skirtingų priežasčių: vienam yra išnaudojimo įrodymų, kitam gamintojas nurodo didesnį galimą poveikį.

**Ką daryti dabar:** palyginti įdiegtą Artifactory release su dabartinėmis JFrog pataisytomis versijomis, peržiūrėti anonymous bei low-privilege prieigą ir sužymėti remote Docker repository bei cache kelius. Tikrinti naujus administratoriaus naudotojus ar token, permissions pakeitimus, netikėtą rašymą už repository ribų, pakeistus artifact ir downstream build, kurie juos panaudojo. Artifactory credentials saugoti kaip software supply-chain credentials, o ne kaip eilinio package cache paslaptį.

<p class="hx-signal-source"><a href="https://www.cisa.gov/news-events/alerts/2026/08/27/cisa-adds-three-known-exploited-vulnerabilities-catalog">CISA pranešimas apie išnaudojimą →</a> · <a href="https://docs.jfrog.com/releases/docs/jfrog-security-advisories">JFrog saugumo pranešimai →</a></p>
</section>

## Vienas KEV paketas, keli remediation keliai

<section class="hx-signal-entry hx-signal-entry--high" markdown="1">
<p class="hx-signal-label">AUKŠTAS PRIORITETAS · ŽINOMAS IŠNAUDOJIMAS · SVARBIOS PRIELAIDOS</p>

### Dar septyni įrašai neturėtų tapti vienu bendru patch ticket

<dl><div><dt>Per tinklą pasiekiami keliai</dt><dd>NetScaler denial of service, SQL Server kodo vykdymas ir Ajax.NET deserialization</dd></div><div><dt>Lokalūs privilege keliai</dt><dd>Dvi Red Hat ir dvi Linux kernel klaidos</dd></div></dl>

Likę septyni laikotarpio KEV įrašai prasideda iš skirtingų pozicijų:

- **CVE-2026-8452, NetScaler ADC ir Gateway:** out-of-bounds memory klaida, galinti sukelti denial of service. Cloud Software Group pateikia pataisytus palaikomų 13.1 ir 14.1 šakų build.
- **CVE-2019-1068, Microsoft SQL Server:** netinkamas funkcijų apdorojimas gali leisti nuotolinį kodo vykdymą Database Engine service account kontekste.
- **CVE-2021-23758, Ajax.NET Professional:** nesaugi deserialization gali leisti be autentifikacijos nuotoliniu būdu vykdyti kodą. Paveiktos versijos iki 21.11.29 imtinai, o 21.11.29.1 turi pataisymą.
- **CVE-2015-3246 ir CVE-2015-5287:** senesnės Red Hat libuser ir ABRT klaidos suteikia lokalų privilege arba failų manipuliavimo kelią, o ne neautentifikuotą interneto įėjimą.
- **CVE-2022-0995 ir CVE-2026-53362:** Linux kernel pažeidžiamumai suteikia lokalų privilege-escalation kelią jau turint tam tikrą prieigą prie hosto. Red Hat CVE-2026-53362 aprašo kaip IPv6 fragmentation klaidą, kurią lokalus container naudotojas paveiktame RHEL 10 gali sujungti į kernel memory prieigą, SELinux bypass ir host escape.

Visi septyni turi išnaudojimo įrodymų, bet "skubiai patchinti" nėra visas operacinis nurodymas. NetScaler ir SQL Server klausimai prasideda nuo pasiekiamų servisų. Lokalūs Linux ir Red Hat klausimai prasideda nuo paveikto kernel ar package ir užpuoliko galimybės vykdyti kodą lokaliai. Nebepalaikomas Ajax.NET reikalauja retirement sprendimo, o ne dar vienos amžinos išimties.

**Ką daryti dabar:** sukurti atskirus darbus su produkto savininku, tikslia versija, pasiekiamumu, reikiama užpuoliko pozicija, pataisyta versija ir įrodymų išsaugojimo poreikiu. Pirmiausia tvarkyti iš interneto pasiekiamus gateway bei database servisus, bet lokalių privilege klaidų neišmesti iš endpoint ir server baseline. Kiekvienam viešam pažeidžiamam servisui prieš uždarant ticket kaip "patched" nuspręsti, ar logai ir host telemetrija leidžia atlikti compromise assessment.

<p class="hx-signal-source"><a href="https://www.cisa.gov/news-events/alerts/2026/08/26/cisa-adds-six-known-exploited-vulnerabilities-catalog">CISA šešių įrašų pranešimas →</a> · <a href="https://support.citrix.com/external/article/CTX696604/netscaler-adc-and-netscaler-gateway-secu.html">NetScaler biuletenis →</a> · <a href="https://msrc.microsoft.com/update-guide/vulnerability/CVE-2019-1068">Microsoft SQL Server pranešimas →</a> · <a href="https://github.com/advisories/GHSA-6r7c-6w96-8pvw">Ajax.NET pranešimas →</a> · <a href="https://access.redhat.com/security/vulnerabilities/RHSB-2026-009">Red Hat IPv6 vertinimas →</a></p>
</section>

<section class="hx-signal-entry hx-signal-entry--high" markdown="1">
<p class="hx-signal-label">AUKŠTAS PRIORITETAS · AKTYVUS TAIKYMĄSIS · OT IR EDGE PASIEKIAMUMAS</p>

### Jungtinės Karalystės incidentai dar kartą parodo exposure svarbą

<dl><div><dt>Informacijos šaltinis</dt><dd>Jungtinės Karalystės NCSC, rugpjūčio 27 d.</dd></div><div><dt>Stebėtas rezultatas</dt><dd>Ribotas realus veiklos sutrikdymas keliuose sektoriuose</dd></div></dl>

Jungtinės Karalystės NCSC praneša apie dažnesnį taikymąsi į internetu pasiekiamas operational technology sistemas, įskaitant veiklą, kuri keliuose sektoriuose sukėlė ribotą realų sutrikdymą. Šiuos incidentus NCSC vertina platesniame kontekste, kuriame valstybiniai ir nevalstybiniai veikėjai taikosi į viešai pasiekiamas sistemas bei edge įrenginius. Publikacija nenurodo vieno CVE ir nepatvirtina kampanijos Lietuvoje. Jos vertė yra pasikartojanti pradinė sąlyga: sistemos tapo praktiškais taikiniais, nes control ar management paviršiai buvo pasiekiami ir silpnai apsaugoti.

Tai praplečia ankstesnės Signalų apžvalgos PLC perspėjimą už vieno gamintojo ribų. Viešas HMI, remote engineering interface, VPN appliance arba pamirštas edge įrenginys gali turėti kitą produkto pavadinimą, bet atverti tą pačią operacinę priklausomybę. Remediation vienetas yra pasiekiamas kelias ir jo pasekmė, o ne logotipas ant įrenginio.

**Ką daryti dabar:** galutinį inventorių sudaryti iš external discovery, firewall taisyklių ir engineering įrašų. Patikrinti, kad PLC, HMI bei management interfaces nėra tiesiogiai vieši, pašalinti default credentials, nuotolinei prieigai reikalauti MFA ir segmentuoti OT, management bei business tinklus. Atsisakyti Telnet ir SNMPv1/v2, aprašyti normalius engineering kelius, įspėti apie configuration pakeitimus iš netikėtų sistemų ir išbandyti recovery pagal tikrą operacinį scenarijų.

<p class="hx-signal-source"><a href="https://www.ncsc.gov.uk/news/disruptive-cyber-activity-highlights-risk-from-internet-exposed-systems-and-edge-devices">Jungtinės Karalystės NCSC perspėjimas →</a></p>
</section>

## DI infrastruktūra tampa taikiniu

<section class="hx-signal-entry hx-signal-entry--high" markdown="1">
<p class="hx-signal-label">AUKŠTAS PRIORITETAS · UŽFIKSUOTI KOMPROMITAVIMO ATVEJAI · CREDENTIALS KONCENTRACIJA</p>

### LiteLLM, RAGFlow ir Kestra buvo atakuojami kaip control plane

<dl><div><dt>Stebėti tikslai</dt><dd>Secrets vagystė, persistence ir cryptomining</dd></div><div><dt>Vertingi duomenys</dt><dd>Provider keys, database strings, virtual keys, workflow ir container secrets</dd></div></dl>

Rugpjūčio 26 d. Microsoft paskelbė apie tris užfiksuotus kompromitavimo atvejus. LiteLLM atveju bendrovė su high confidence vertina, kad pradinei prieigai greičiausiai buvo išnaudotas viešas gateway paviršius, susijęs su CVE-2026-42271 ir galimu chain su CVE-2026-48710. Užpuolikas skaitė gateway proceso environment, pasiekė LiteLLM PostgreSQL įrašus, sukūrė persistence ir paleido XMRig. Proceso kontekste buvo model provider credentials, master bei virtual keys, database strings ir tenant konfigūracija.

RAGFlow veikla nuo galimo SSRF tipo reconnaissance perėjo prie aplikacijos pakeitimo ir LLM credentials perėmimo. Microsoft šio įsilaužimo nepriskyrė vienam konkrečiam pažeidžiamumui. Kestra aplinkoje workflow vykdymas nuvedė į shell prieigą, container bei environment discovery ir cryptomining. Skirtingi įėjimo keliai davė tą patį platų rezultatą: sistemas jungti skirta aplikacija tapo keliu į jų credentials ir compute.

Tai nėra priežastis kiekvieną DI servisą vien dėl pavadinimo vadinti "Tier 0". Tai priežastis klasifikuoti deployment pagal tai, ką jis gali skaityti, vykdyti ir pasiekti. Provider keys ir duomenų bazės prieigą turinčio DI gateway blast radius skiriasi nuo izoliuoto inference endpoint.

**Ką daryti dabar:** inventorizuoti LiteLLM, RAGFlow, Kestra ir panašius gateway ar orchestrator, įskaitant developer deployment. Pašalinti viešus management paviršius, atnaujinti palaikomą programinę įrangą, reikalauti autentifikacijos, naudoti ribotus virtual keys ir managed secret stores, izoliuoti duomenų bazes, apriboti Docker socket bei outbound srautą. Ieškoti aplikacijos paleistų shell, `/proc/1/environ` skaitymo, Python aplikacijos failų pakeitimų, SSH `authorized_keys`, cron įrašų, paslėptų vykdomųjų failų ir ryšių su mining pool.

<p class="hx-signal-source"><a href="https://www.microsoft.com/en-us/security/blog/2026/08/26/when-ai-infrastructure-becomes-target-securing-gateways-control-points/">Microsoft stebėtų atakų analizė →</a></p>
</section>

## Lietuvos pulsas

<section class="hx-signal-entry hx-signal-entry--watch" markdown="1">
<p class="hx-signal-label">STEBĖTI · LIETUVA · FIZINIO SAUGUMO TELEMETRIJA</p>

### Vaizdo stebėjimo kamera gali tapti žvalgybos rinkimo įrankiu

<dl><div><dt>Rekomendacijų data</dt><dd>Rugpjūčio 26 d., parengė NKSC, AOTD ir VSD</dd></div><div><dt>Rizikos riba</dt><dd>Privatumas, tinklo prieiga ir nacionalinio saugumo žvalgyba</dd></div></dl>

Lietuvos NKSC, AOTD ir VSD paskelbė bendras vaizdo stebėjimo kamerų rekomendacijas. Institucijos įspėja, kad prieiga net prie vienos kameros gali atskleisti gamybos, logistikos, energetikos, transporto ar fizinio saugumo modelius. Ilgesnis stebėjimas gali parodyti maršrutus, darbo laiką, procesų silpnybes, dokumentus ir ekranus, o kompromituotas įrenginys gali tapti įėjimu į šalia esantį tinklą.

Rekomendacijose minima, kad Rusijos veikėjai internetu pasiekiamas kameras naudojo su Ukraina susijusiai intelligence collection. Šis kontekstas neįrodo, kad kiekviena atvira Lietuvos kamera šiuo metu yra taikinys. Jis parodo, kodėl kamera nėra tik low-value IoT įrenginys, kai jos matymo laukas arba tinklo vieta atskleidžia jautrias operacijas.

**Ką daryti dabar:** panaikinti tiesioginį pasiekiamumą iš interneto, naudoti valdomą gamintojo kelią arba VPN, nustatyti unikalius administratoriaus slaptažodžius, diegti firmware atnaujinimus ir pakeisti end-of-life įrenginius. Išjungti nereikalingus UPnP, SSH, Bonjour, FTP ir Telnet servisus bei nesaugią HTTP ar RTSP prieigą. Pašalinti nenaudojamas paskyras, įjungti MFA, kai palaikoma, segmentuoti kamerų tinklą, tikrinti outbound connections ir susiaurinti matymo lauką arba taikyti privacy masking, kai fiksuojama nereikalinga informacija.

<p class="hx-signal-source"><a href="https://www.nksc.lt/naujienos/nuo_privatumo_iki_nacionalinio_saugumo_ko_708b9bc5.html">NKSC pranešimas →</a> · <a href="https://www.nksc.lt/rekomendacijos.html">Bendros rekomendacijos →</a></p>
</section>

<section class="hx-signal-entry hx-signal-entry--watch" markdown="1">
<p class="hx-signal-label">STEBĖTI · LIETUVA · MARKETPLACE PHISHING</p>

### Tariamas Facebook pirkėjas nuvedė į galimai netikrą puslapį

<dl><div><dt>Pranešta seka</dt><dd>Pirkėjo žinutė, galimai netikro puslapio nuoroda, suvesti banko duomenys</dd></div><div><dt>Praneštas nuostolis</dt><dd>1 490 eurų</dd></div></dl>

Rugpjūčio 26 d. Panevėžio policija užfiksavo 2008 m. gimusio žmogaus pranešimą. Jis Facebook buvo paskelbęs apie parduodamą daiktą. Tariamas pirkėjas susisiekė su pardavėju, kuris paspaudė galimai netikro puslapio nuorodą ir suvedė banko duomenis. Vėliau nukentėjusysis pranešė apie 1 490 eurų nuostolį.

Policijos suvestinė patvirtina praneštą seką ir nuostolį. Ji neįvardija domeno, phishing kit, beneficiary, autentifikacijos flow ar platesnės kampanijos. Šie trūkstami laukai svarbūs. Marketplace phishing dažnai suveikia todėl, kad pokalbis prasideda pažįstamoje platformoje, o pardavėjas į išorinį "mokėjimo" arba "pristatymo" puslapį nuvedamas tuo metu, kai sandoris atrodo laukiamas.

Praktinis tyrimo kelias pateiktas tekste [Vienas scam domenas retai būna vienas](/lt/tyrimai/vienas-scam-domenas-retai-buna-vienas/). Kai naudojamos socialinės reklamos, cloned media ir lankytojų atranka, atskirą palyginimo kontekstą pateikia [Facebook cloaking tyrimas](/lt/tyrimai/kai-fake-news-scamai-ir-cloaking/), bet tai nėra teiginys, kad šis policijos pranešimas priklauso tai kampanijai.

**Ką daryti dabar:** pirkėjo atsiųstas mokėjimo ir pristatymo nuorodas laikyti nepatikimomis, kol jos nepatikrintos nepriklausomai. Pardavėjas banką arba marketplace turėtų atidaryti per išsaugotą aplikaciją ar ranka įvestą adresą, ne per pokalbio nuorodą. Tyrimui išsaugoti visą chat export, tikslų URL, puslapio screenshots, SMS arba app prompt, beneficiary ir transaction identifiers bei naršyklės istoriją dar prieš nusprendžiant, kaip buvo surinkti credentials ar patvirtinimas.

<p class="hx-signal-source"><a href="https://panevezys.policija.lrv.lt/lt/ivykiu-suvestines/2026-08-26-suvestine-4zp7/">Panevėžio policijos suvestinė →</a></p>
</section>

## Esmė

Pradėkite nuo sistemų, kurios iš tikrųjų veikia aplinkoje ir yra arčiausiai kodo, credentials arba jautrių duomenų. Gitea, Oracle HTTP Server, ownCloud ir Artifactory reikia konkrečiam produktui pritaikytų veiksmų, ne vieno bendro vulnerability ticket. Likusiai KEV grupei reikia tos pačios disciplinos: atskirti interneto įėjimą nuo lokalaus privilege escalation ir pataisytą versiją nuo įrodymo, kad sistema niekada nebuvo išnaudota.

Ilgesnis signalas yra architektūrinis. DI gateway ir orchestrator paveldi kiekvieno prijungto secret bei execution path vertę. Kameros paveldi jautrumą to, ką gali matyti ir kokį tinklą pasiekia. Marketplace pokalbis nepaveldi pasitikėjimo vien todėl, kad prasidėjo pažįstamoje platformoje. Pataisykite įvardytus produktus, bet kartu mažinkite prieigos ir įrodymų spragas, dėl kurių kiekvienas šių kelių tapo vertingas.
