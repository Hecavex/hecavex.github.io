---
title: "Phishing infrastruktūros stebėjimas Lietuvoje: Radar 2026 m. rugsėjo bazinė apžvalga"
card_title: "Radar rugsėjo apžvalga: rinkimas atsistatė, peržiūros spraga liko"
description: "Rugsėjo Radar duomenys: 447 stebėti kandidatai, stabilesnis rinkimas ir analitiko peržiūros spraga, vis dar ribojanti gynybines išvadas."
seo_title: "Phishing stebėjimas Lietuvoje: Radar 2026 m. rugsėjis"
seo_description: "447 rugsėjo Radar kandidatai, atsistatęs rinkimas ir likusi peržiūros spraga. Atkuriami agregatai su aiškiomis įrodymų bei laiko ribomis."
seo_keywords:
  - "phishing stebėjimas Lietuvoje"
  - "HECAVEX Radar 2026 rugsėjis"
  - "prekių ženklų impersonation stebėjimas"
  - "Certificate Transparency aprėptis"
date: 2026-10-04 21:45:00 +0300
last_reviewed_at: 2026-10-04 21:45:00 +0300
lang: lt
translation_key: lithuania-phishing-infrastructure-radar-2026-09
permalink: /lt/tyrimai/phishing-infrastruktura-lietuvoje-radar-2026-rugsejis/
author: deividas-lis
content_type: technical-analysis
publication_class: primary-research
confidence: moderate
tlp: clear
categories: [threat-intelligence, investigations, fraud-scams, osint]
tags: [phishing, Lietuva, HECAVEX Radar, prekių ženklų impersonation, Certificate Transparency, matavimas, duomenų kokybė]
featured: false
draft: false
published: true
toc: true
comments: false
prose_width: wide
research_version: "1.0"
research_status: published
scope: "Retrospektyvi išlaikytų Radar šaltinių istorijos įvykių agregacija pagal stebėjimo laiką nuo 2026 m. rugsėjo 1 d. imtinai iki spalio 1 d. neimtinai, užfiksuota spalio 1 d. laidoje. Rinkimo telemetrija ir atskiras dabartinis vaizdas analizuojami su savais vardikliais."
limitations: "Imtinis, nuo publikavimo taisyklių priklausantis aptikimas nėra phishing paplitimas, žala aukoms ar aptikimo recall. Istoriniai įvykiai neišlaiko pilnos įrodymų lygių chronologijos. Nėra eksportuotų užbaigtų analitiko peržiūrų klasifikavimo precision įverčiui. Spalio suvestinė nėra rugsėjo kohorta."
methods:
  - "Nekintamų Git įvesčių atranka ir SHA-256 patikra"
  - "UTC ribomis apribota įvykių agregacija ir kandidatų ID deduplikacija"
  - "Užfiksuotų CertStream bandymų palyginimas su nustatytu rinkimo planu"
  - "Konservatyvios klausymosi laiko ribos ir atskiras suvestinės įrodymų vertinimas"
evidence_basis: "Trisdešimt rugsėjo dienų istorijos dalių ir sugeneruoti vieši agregatai iš Radar duomenų versijos 3d80a765404f50afbe50c3dc49472751a2e13b65, paskelbti generatoriaus versija 33075e4ca3fb5ab223fab61a92125bb2c797e2f5. Užfiksuota laida sugeneruota 2026 m. spalio 1 d. 00:40:26.566 UTC."
research_bundle: /assets/data/radar-september-2026-baseline/README.md
key_findings:
  - "Rugsėjo išlaikytoje šaltinių istorijoje yra 447 skirtingi kandidatų ID, susieti su 30 registro prekių ženklų. Sudėjus dienų unikalius skaičius gaunamos 508 kandidatų dienos, o ne 508 skirtingi kandidatai."
  - "Užfiksuota 2 419 CertStream bandymų iš 2 880 planuotų. Klausymosi ribos sudarė maždaug 44,791–44,795 % rugsėjo kalendorinio laiko, kai planuotos lubos buvo 53,333 %."
  - "Užfiksuotų bandymų santykis pakilo nuo 513 iš 960 rugsėjo 1–10 d. iki 1 906 iš 1 920 rugsėjo 11–30 d. Tai pagrindžia rinkimo atsistatymą, ne nusikalstamos veiklos pokyčio įvertį."
  - "Atskiroje spalio 1 d. suvestinėje liko 105 vien pavadinimu paremti kandidatai ir nebuvo eksportuotų užbaigtų analitiko peržiūrų. Jos įrodymų būsenos negalima retrospektyviai priskirti visiems 447 rugsėjo kandidatams."
---

## Ką iš tikrųjų parodė rugsėjis

HECAVEX Radar išlaikytoje rugsėjo istorijoje yra **447 skirtingi kandidatų ID, susieti su 30 registro prekių ženklų**. Po pirmųjų dešimties dienų rinkimas tapo gerokai stabilesnis. Stipriausia išvada yra operacinė: sistema įvykdė didesnę numatyto klausymosi plano dalį. Duomenys neįrodo, kad phishing išaugo, kad veikė 447 kenkėjiškos svetainės ar kad kiekvienas kandidatas taikėsi į Lietuvą.

Tai retrospektyvus vertinimas, paskelbtas spalio 4 d. Stebėjimo langas yra **nuo 2026 m. rugsėjo 1 d. 00:00 UTC iki spalio 1 d. 00:00 UTC, paskutinės ribos neįtraukiant**. Įvestys užfiksuotos laidoje, sugeneruotoje **spalio 1 d. 00:40:26.566 UTC**. Joje buvo visų 30 rugsėjo dienų archyvo dalys. Tai suteikia atkuriamą išlaikytą įrašą, bet nereiškia nenutrūkstamo rinkimo ar pilno grėsmių vaizdo. Skaičiai ir skaičiavimo įvestys išsaugoti [rugsėjo agregatų pakete](/assets/data/radar-september-2026-baseline/README.md).

## Trys populiacijos, kurių negalima suplakti

| Matas | Skaičius | Reikšmė |
| --- | ---: | --- |
| Skirtingi rugsėjo kandidatų ID | 447 | Deduplikuoti per visą mėnesio išlaikytą šaltinių stebėjimų istoriją |
| Sudėti dienų unikalūs kandidatai | 508 | Kandidatų dienos, įskaitant pasikartojimą skirtingomis datomis |
| ID su išlaikytu pirmo publikavimo perėjimu šiame lange | 437 | Pirmo publikavimo žymą turinti istorija, ne įrodytos domenų registracijos |
| Kiti stebėti kandidatų ID | 10 | Anksčiau žinomi kandidatai, matomi ir rugsėjį |
| Išlaikyti šaltinių istorijos įvykiai | 950 | 513 stebėjimo įrašų ir 437 pirmo publikavimo perėjimai |
| Atskira dabartinė suvestinė | 105 | Vėlesnis išlaikytas vaizdas spalio 1 d. laidoje |

Šie matai atsako į skirtingus klausimus. Sudėjus dienų unikalius skaičius, kitą dieną grįžęs kandidatas suskaičiuojamas dar kartą. Sudėjus stebėjimo ir būsenos perėjimo įvykius, sumuojami skirtingi įrašai apie tą patį kandidatą. Nė vienas veiksmas neduoda incidentų skaičiaus. Atėmus 437 iš 513 taip pat neatkuriamas atskirai apibrėžtas viešų pakartotinių stebėjimų matas. [Paketo apibrėžimai ir agregatai](/assets/data/radar-september-2026-baseline/summary.json) šiuos kiekius atskiria.

Istorijoje kandidato tapatumas paremtas normalizuotu hostu. Pirmo publikavimo perėjimo `observedAt` saugo šaltinio stebėjimo ribą, ne patikrintą diegimo ar registracijos laiką. Pagal ją negalima nustatyti, kada operatorius įsigijo domeną ar kada jį pirmąkart pamatė auka. [Užfiksuota istorijos sutartis](https://github.com/Hecavex/radar.hecavex.com/blob/33075e4ca3fb5ab223fab61a92125bb2c797e2f5/docs/HISTORY.md) taip pat atskiria išlaikytą istoriją nuo dabartinėmis taisyklėmis filtruojamo publikavimo vaizdo.

[Rugpjūčio bazėje](/lt/tyrimai/phishing-infrastruktura-lietuvoje-radar-2026-rugpjutis/) buvo 130 dabartinių kandidatų pagal rugpjūčio 30 d. ribą. Lyginant tą momentinį likutį su 447 viso rugsėjo ID būtų maišomos populiacijos. Procentinio augimo antraštė klaidintų net tada, jei abu sudėti skaičiai būtų aritmetiškai teisingi.

## Rinkimas atsistatė, bet planas nebuvo nenutrūkstamas

| UTC laikotarpis | Užfiksuoti / planuoti bandymai | Santykis su planuotu skaičiumi | Klausymosi dalis kalendoriniame laike, konservatyvi apatinė riba |
| --- | ---: | ---: | ---: |
| Rugsėjo 1–10 d. | 513 / 960 | 53,44 % | 28,50 % |
| Rugsėjo 11–30 d. | 1 906 / 1 920 | 99,27 % | 52,94 % |
| Visas rugsėjis | 2 419 / 2 880 | 83,99 % | 44,79 % |

Nustatytas CertStream planas buvo aštuonių minučių klausymosi langas kas penkiolika minučių. Net nepriekaištingai jį vykdant būtų padengta **53,33 % kalendorinio laiko**, ne visa para. Rugsėjo klausymosi ribos buvo **1 160 977,181–1 161 090,024 sekundės**, maždaug **44,791–44,795 %** mėnesio 720 valandų. Tai klausymosi laiko ribos, ne aptiktų aktualių sertifikatų procentas. [Skaičiavimo įrašas](/assets/data/radar-september-2026-baseline/summary.json).

Visi 2 419 išlaikytų CertStream bandymų įrašų nurodo sveiką rezultatą: 2 001 nerado atitinkančių kandidatų, 418 rado atitikmenų. Sėkmingas tuščias bandymas rodo apdorotą įvestį be heuristikos atitikmens. Neužfiksuotas bandymas yra kas kita. Šis įrašas neįrodo, kad užfiksuotas kiekvienas galimas paleidimo gedimas, o bandymų santykis savaime nepatvirtina atskirų suplanuotų laiko langų įvykdymo.

[Rugsėjo 10 d. atkūrimo įrašas](https://github.com/Hecavex/radar.hecavex.com/blob/33075e4ca3fb5ab223fab61a92125bb2c797e2f5/docs/COLLECTION-RECOVERY-2026-09-10.md) dokumentuoja relay klaidą: dubliuotas užbaigimo įvykis galėjo atšaukti laukiantį teisėtą perdavimą ir paskui pats būti praleistas. Lygiagretumo valdymą perkėlus į priimtą vykdyti užduotį, šis gedimas pataisytas. Vėlesnių dvidešimties dienų bandymų įrašas pagrindžia rinkimo atsistatymą. Jis neatkuria praleistų rugsėjo klausymosi langų.

Skaičiavimui taip pat reikia versijų. Rugsėjo 7 d. pataisa pakeitė pakartotinių stebėjimų skaičiavimą. Atskira rugsėjo 10 d. pataisa sumavimą su viršutine riba pakeitė konservatyviomis intervalų ribomis. Jos įvertina laiko langų apkirpimą ir galimą persidengimą, neišgalvodamos pakartotinio prisijungimo momentų. Ši apžvalga naudoja užfiksuotos laidos metodus, ne procentus iš senų ekrano kopijų. [Metodų pakeitimai](https://github.com/Hecavex/radar.hecavex.com/blob/33075e4ca3fb5ab223fab61a92125bb2c797e2f5/docs/TRENDS-CORRECTIONS.md).

## Prekių ženklų koncentracija aprašo atitikmenis, ne žalą

| Registro prekių ženklas | Skirtingi rugsėjo kandidatai |
| --- | ---: |
| DHL | 79 |
| Revolut | 62 |
| Tele2 | 42 |
| Lidl Lietuva | 33 |
| Bitė | 30 |
| Vinted | 24 |
| SEB | 20 |
| DPD | 18 |
| ESO | 16 |
| MAXIMA | 15 |

Tai dešimt didžiausių [mėnesio prekių ženklų agregato](/assets/data/radar-september-2026-baseline/brands.csv) grupių. Pirmosios penkios sudaro 246 iš 447 kandidatų, arba 55,03 %. Tai naudinga skirstant tyrimo darbą. Tai nėra organizacijų kompromitavimo, klientų nuostolių ar sėkmingo apsimetimo reitingas.

Koncentraciją gali sukurti keli dalykai: produktyvūs vardų šablonai, pasikartojantis sertifikatų aktyvumas, stebimas žodynas ir tikros kampanijos. Šis agregatas jų neatskiria. Vertingas kitas tyrimas tikrintų, ar daug hostų dalijasi puslapio šablonu arba duomenų surinkimo adresu, užuot iš daugybės atitinkančių vardų daręs išvadą apie daugybę atskirų operacijų.

Visų 447 kandidatų rugsėjo stebėjimuose yra tik `CertStream` šaltinio žyma. Ji neatskiria gyvo srauto nuo indeksuotos CT paieškos kilmės. Ji taip pat neįrodo visą mėnesį trukusio kitų tiekėjų gedimo. Ryšys su registre esančiu ženklu nėra taikymosi į Lietuvą įrodymas. [Užfiksuota duomenų sutartis](https://github.com/Hecavex/radar.hecavex.com/blob/33075e4ca3fb5ab223fab61a92125bb2c797e2f5/docs/DATA-CONTRACT.md) atskiria tiekėją, aptikimo kilmę ir geografinį aktualumą.

## Ribojantis etapas lieka peržiūra

Atskiroje spalio laidos suvestinėje buvo **105 vien pavadinimu paremti kandidatai**: 104 neperžiūrėti ir vienas pažymėtas kaip reikalaujantis peržiūros. Nebuvo eksportuotų užbaigtų analitiko peržiūrų, kuriomis būtų galima pagrįsti precision įvertį. Šaltinių pasiskirstymas buvo 104 CertStream ir vienas HECAVEX įrašas, apimantis 20 registro prekių ženklų. [Suvestinės agregatas](/assets/data/radar-september-2026-baseline/summary.json).

Su rugsėjo kohorta sutampa tik 103 iš tų ID. Kiti du yra spalio stebėjimas ir senesnis HECAVEX įrašas. Dar svarbiau, suvestinės įrodymų būsena nėra istorinis visų 447 mėnesio kandidatų įvertinimas. Išlaikyti įvykiai nesuteikia pilnos įrodymų lygių chronologijos. Teigti, kad visi rugsėjo kandidatai buvo paremti tik pavadinimu, reikštų peržengti atkurtų duomenų ribas.

Praktinę spragą galima parodyti neišgalvojant verdikto. Rinkimas sukuria kandidatus. Prieš matuojant klasifikavimo kokybę vis dar reikia nepriklausomų įrodymų ir aiškių analitiko sprendimų. Eksportuotos peržiūros nebuvimas neįrodo nei kandidato saugumo, nei to, kad niekas jo netyrė privačiai. Jis reiškia, kad viešas įrašas nepagrindžia trūkstamos išvados.

## Užfiksuotas agregatas, ne besikeičiančio dashboard'o nuotrauka

[Straipsnio įrodymų pakete](/assets/data/radar-september-2026-baseline/README.md) užfiksuota duomenų versija `3d80a765404f50afbe50c3dc49472751a2e13b65` ir generatoriaus versija `33075e4ca3fb5ab223fab61a92125bb2c797e2f5`. Jame nurodytos įvesčių tapatybės, UTC filtras, agregatų apibrėžimai ir atkūrimo procedūra. Aptikimo skaičiai atkuriami iš dienų istorijos. Aprėptis agreguoja jau paskelbtas antros metodikos versijos ribas, neteigiant, kad kiekvienas prisijungimas atkurtas iš pirminių rinktuvo žurnalų. Viešas rezultatas yra agreguoti matai, ne naujas kandidatų sąrašas ar privačios duomenų bazės kopija.

Tai svarbu naudojant [Radar tendencijas](https://radar.hecavex.com/lt/tendencijos/). Saugojimo terminai, pataisos ir dabartinės publikavimo taisyklės gali keisti vėlesnius vaizdus. Vėliau atsisiųstas failas nėra automatiškai tie patys rugsėjo įrodymai. Šiam straipsniui naudokite užfiksuotą paketą, o dabartiniam sistemos veikimui suprasti skirtus [duomenų vadovą](https://radar.hecavex.com/lt/duomenys/) ir [metodologiją](https://radar.hecavex.com/lt/metodologija/).

## Kokį gynybos darbą šis įrašas pagrindžia

Prekių ženklo apsaugos komanda gali pradėti nuo savo kandidatų grupės ir prieš eskalavimą atskirti leidžiamus domenus, teisėtas nuorodas į ženklą bei dublikatus. Išsaugokite priežastį, kodėl kandidatas atitiko taisykles. Sertifikato vardo lead'as be puslapio įrodymų neturėtų gauti patvirtinto prisijungimo duomenų rinkimo incidento etiketės.

SOC komandai verta pagal esamas duomenų tvarkymo taisykles lyginti kandidatų stebėjimus su aktualiais vidiniais DNS, proxy, el. pašto ar identity įrašais. Vidinis susidūrimas pakeičia tyrimo klausimą: kuris vartotojas gavo masalą, kas išsisprendė, koks atsakas grįžo ir ar po to sekė autentifikavimo arba mokėjimo veiksmai. Nepaverskite visos mėnesio populiacijos automatiniu blokavimo sąrašu.

Kitai peržiūros partijai atrinkite imtį iš skirtingų prekių ženklų ir rinkimo laikotarpių, ne tik akivaizdžiausius pavadinimus. Užrašykite atrankos taisyklę, patikrintus įrodymus, neapibrėžtumą ir sprendimą. Šalia rezultatyvumo rodykite peržiūrėtų įrašų vardiklį, o negautus įrodymus atskirkite nuo neigiamo radinio. Tada vėlesnis precision teiginys turėtų patikrinamą pagrindą. Dar didesnis kandidatų skaičius jo nesuteiktų.
