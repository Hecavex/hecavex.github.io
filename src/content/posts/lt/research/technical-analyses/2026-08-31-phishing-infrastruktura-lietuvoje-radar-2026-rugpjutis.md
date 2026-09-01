---
title: "Phishing infrastruktūra Lietuvoje: 2026 m. rugpjūčio Radar bazinė apžvalga"
card_title: "Radar 2026 m. rugpjūčio phishing infrastruktūros apžvalga"
description: "Aprėptį įvertinanti 130 Lietuvos prekių ženklų impersonation kandidatų, jų įrodymų lygių, rinkimo būklės ir analitinių ribų apžvalga."
seo_title: "Phishing infrastruktūra Lietuvoje: Radar 2026 m. rugpjūtis"
seo_description: "2026 m. rugpjūčio HECAVEX Radar apžvalga: 130 Lietuvos prekių ženklų impersonation kandidatų, įrodymų lygiai, aprėptis ir ribos."
seo_keywords:
  - "phishing Lietuvoje"
  - "phishing domenai Lietuvoje"
  - "prekių ženklų impersonation"
  - "HECAVEX Radar"
  - "phishing domenų stebėjimas"
  - "Certificate Transparency Lietuva"
date: 2026-08-31 18:40:00 +0300
lang: lt
translation_key: lithuania-phishing-infrastructure-radar-2026-08
permalink: /lt/tyrimai/phishing-infrastruktura-lietuvoje-radar-2026-rugpjutis/
author: deividas-lis
content_type: technical-analysis
publication_class: primary-research
confidence: moderate
tlp: clear
categories: [threat-intelligence, investigations, fraud-scams, osint]
tags: [phishing, Lietuva, HECAVEX Radar, prekių ženklų impersonation, Certificate Transparency, URLScan, matavimas, duomenų kokybė]
featured: false
draft: false
published: true
toc: true
comments: false
prose_width: wide
scope: "Aprašomoji deduplikuoto viešo HECAVEX Radar kandidatų vaizdo ir agreguoto rinkimo būklės įrašo apžvalga pagal 2026 m. rugpjūčio 30 d. ribą."
limitations: "Radar yra imtinė aptikimo sistema. Suvestinėje nėra užbaigtų analitiko peržiūrų, o klausymosi aprėptis nepilna, todėl negalima vertinti phishing paplitimo, žalos aukoms, recall ar kandidatų precision."
methods:
  - "Deterministinė viešos Radar suvestinės agregacija"
  - "Šaltinių ir įrodymų lygių palyginimas"
  - "Rinkimo būklės vertinimas atsižvelgiant į aprėptį"
  - "Atkuriamas šaltinių hash fiksavimas"
evidence_basis: "2026 m. rugpjūčio 30 d. sukurti vieši radar.json ir pipeline-health.json įrašai, peržiūrėtas Radar prekių ženklų registras ir paskelbta metodologija."
research_bundle: /assets/data/radar-august-2026-baseline/README.md
key_findings:
  - "Nustatytu laiku buvo 130 deduplikuotų dabartinių kandidatų, susietų su 18 iš 46 registro prekių ženklų. Šis pasiskirstymas aprašo heuristinį vaizdą, o ne phishing paplitimą Lietuvoje."
  - "Pagal suvestinės įrodymų lygių taisykles tik du įrašai buvo patvirtinti papildomu šaltiniu, 128 liko vien pavadinimo kandidatai ir nė vienas nebuvo galutinai peržiūrėtas analitiko."
  - "Didžiąją dalį įrašų pateikė CertStream, tačiau 24 valandų klausymosi aprėptis siekė 62,78 %, o septynių dienų – 31,18 %, todėl neapdoroti dienos skaičiai netinka trendų ar dažnio teiginiams."
  - "Ši bazinė apžvalga naudinga kaip aptikimo eilė tik tada, kai prie kiekvieno skaičiaus matomi šaltinis, laikas, priežasties kodai, įrodymų lygis, naujumas ir peržiūros būsena."
image:
  path: /assets/img/posts/2026-08-31-radar-august-baseline/radar-august-baseline-hero-v2.webp
  social: /assets/img/social/lithuania-phishing-infrastructure-radar-2026-08-lt.png
  alt: "Aprėptį įvertinanti HECAVEX Radar 2026 m. rugpjūčio apžvalga su kandidatų, prekių ženklų, įrodymų, peržiūros ir rinkimo būklės skaičiais"
  thumbnail: /assets/img/posts/2026-08-31-radar-august-baseline/radar-august-baseline-card-v2.webp
  width: 1600
  height: 900
---

## Bazinė apžvalga, o ne daugiausia atakuojamų prekių ženklų lentelė

**2026 m. rugpjūčio 30 d. 17:20:26 UTC** viešame [HECAVEX Radar](https://radar.hecavex.com/lt/) vaizde buvo **130 deduplikuotų kandidatų**, kuriuos atitikimo taisyklės siejo su **18 iš 46** peržiūrėtame registre esančių prekių ženklų. Du įrašai atitiko papildomais duomenimis pagrįstą įrodymų lygį. Kiti 128 buvo tik domeno pavadinimu paremti kandidatai. Nė vieno įrašo analitiko peržiūra nebuvo užbaigta.

Šie keturi sakiniai yra ir rezultatas, ir būtinas perspėjimas. Radar skirta rasti tai, ką verta tirti: neseniai stebėtus domenų vardus, viešus svetainių stebėjimus bei mažą vietoje peržiūrėtų įrašų dalį, galinčią būti susijusią su Lietuvos prekių ženklų impersonation. Kandidatas nėra automatiškai phishing svetainė. Kandidatų skaičius nėra aukų skaičius. Daugiau atitikmenų turintis prekių ženklas nebūtinai atakuojamas dažniau už mažiau atitikmenų turintį ženklą.

Šia publikacija nustatau atkuriamą rugpjūčio bazę vėlesniems palyginimams. Kartu su pagrindiniais skaičiais pateikiu rinkimo aprėptį, šaltinių šališkumą, įrodymų lygį, peržiūros būseną ir saugojimo laiką. Be šių laukų dashboard'o skaičius yra tik dekoracija. Su jais skaičius gali tapti pagrįsta tyrimo eile.

<aside class="hx-callout warning"><strong>Tai nėra phishing paplitimo matas.</strong>Suvestinė neparodo, kokią viso phishing Lietuvoje dalį aptiko Radar, kiek žmonių matė puslapį, ar buvo pateikti prisijungimo duomenys, kas valdė infrastruktūrą ir kokia žala padaryta. Jei URL nėra Radar, tai nėra jo saugumo įrodymas.</aside>

Atskirai paskelbti [agreguoti duomenys ir šaltinių hash](/assets/data/radar-august-2026-baseline/README.md), pagal kuriuos šią apžvalgą galima patikrinti. Gyvi Radar duomenų rinkiniai po nustatyto laiko toliau keičiasi.

## Ką iš tiesų matuoja rugpjūčio suvestinė

Matavimo vienetas yra **deduplikuotas dabartinis Radar kandidato įrašas**, o ne sertifikatas, DNS vardas, skenas, incidentas ar kampanija. Vienas kandidatas gali turėti kelių šaltinių įrodymų. Todėl 122 CertStream įrašų, devynių URLScan įrašų ir vieno HECAVEX įrašo negalima tiesiog sudėti ir paskelbti 132 atskirais domenais.

| Laukas nustatytu laiku | Reikšmė | Ką pagrįstai reiškia |
| --- | ---: | --- |
| dabartiniai kandidatai | 130 | dabartinių heuristikos ir publikavimo taisyklių išlaikyti įrašai |
| unikalūs domenai | 130 | šioje suvestinėje – vienas dabartinis įrašas vienam normalizuotam domenui |
| registre esantys prekių ženklai | 46 | vieša, peržiūrėta ir aiškiai nebaigtinė pradinė aprėptis |
| atvaizduoti prekių ženklai | 18 | bent vieną dabartinį kandidatą turėję ženklai |
| tik pavadinimu paremti įrodymai | 128 | aptikimas paremtas domeno kontekstu, ne papildomai patvirtintu turiniu |
| papildomai pagrįsti įrodymai | 2 | daugiau nei pavadinimo atitikmuo pagal suvestinės įrodymų taisykles |
| peržiūrėti įrašai | 0 | nėra baigtos žmogaus peržiūros, pagal kurią būtų galima vertinti precision |
| įrašai su hostingo kontekstu | 8 | išsaugotas ribotas viešas hosto ar tinklo kontekstas |
| įrašai su ekrano kopija arba šaltinio nuoroda | 9 | buvo susijęs viešas stebėjimas |
| įrašai su hash įrodymais | 5 | išsaugotas atsako ar artefakto hash |

![Trys įrodymų lygiai: 128 tik pavadinimu paremti kandidatai, du papildomai pagrįsti įrašai ir nė vienos užbaigtos analitiko peržiūros](/assets/img/posts/2026-08-31-radar-august-baseline/radar-evidence-profile-lt.svg)

*1 pav. Aptikimo lygis yra plačiausias, o stipresnių įrodymų lygiai gerokai siauresni. Schema rodo įrašų būseną nustatytu laiku, o ne kenkėjiškumo tikimybę.*

Santykiai leidžia tiksliau pamatyti įrodymų spragą. Papildomai pagrįsti įrašai sudarė **1,54 %** dabartinio vaizdo. Viešą ekrano kopiją arba šaltinio nuorodą turėjo **6,92 %**, hostingo kontekstą **6,15 %**, o išsaugotą hash **3,85 %** įrašų. Šios kategorijos persidengia, todėl jų negalima sudėti. Dar svarbiau, kad nėra nė vienos užbaigtos peržiūros. Be pažymėtos peržiūros imties negalima skaičiuoti stebimo precision, false-positive dažnio, sensitivity ar specificity.

Čia atsiranda du skirtingi inžineriniai klausimai. **Prioriteto kokybė** klausia, ar aukščiau eilėje esantys įrašai analitikui naudingesni už žemiau esančius. **Klasifikavimo kokybė** klausia, kaip dažnai galutinis sprendimas sutampa su peržiūrėta ground truth. Dabartiniai Radar duomenys leidžia tikrinti pirmą klausimą. Antrajam dar nėra peržiūrėto denominator'iaus. Būsimoje kokybės ataskaitoje reikėtų skelbti stratifikuotą imtį pagal ženklą, balo intervalą, priežasties kodą, šaltinį ir įrodymų lygį, o ne peržiūrėti vien akivaizdžiausius įrašus.

Visų dabartinių eilučių būsena buvo `suspected`. Ji žymi darbo eigos etapą, o ne išvadą, kad visi 130 domenų yra kenkėjiški. Radar [metodologija](https://radar.hecavex.com/lt/metodologija/) ir [duomenų sutartis](https://radar.hecavex.com/lt/duomenys/) sąmoningai atskiria etapus: rinkimas sukuria lead'us, enrichment prideda kontekstą, o peržiūrėtai išvadai reikia aiškaus analitiko sprendimo.

Dėl tos pačios priežasties balas nepakeičia verdict'o. Atitikimo balai buvo nuo 85 iki 100, vidurkis – 95,47. Jie parodo atitikimo stiprumą pagal konkrečią heuristiką. Tai nėra 85–100 % phishing tikimybė, numatoma žala ar analitiko pasitikėjimas.

## Prekių ženklų pasiskirstymas priklauso ir nuo detektoriaus

130 įrašų pasiskirstė taip:

| Galimas prekių ženklas | Kandidatai | Galimas prekių ženklas | Kandidatai |
| --- | ---: | --- | ---: |
| DHL | 53 | DPD | 4 |
| Revolut | 17 | Smart-ID | 4 |
| Telia | 9 | Bitė | 4 |
| Vinted | 9 | MAXIMA | 4 |
| VMI | 6 | Tele2 | 3 |
| Swedbank | 3 | ESO | 3 |
| SEB | 3 | ERGO | 2 |
| Luminor | 2 | Bigbank | 2 |
| Artea | 1 | BTA | 1 |

![Penki su galimais prekių ženklais susietų kandidatų skaičiai rugpjūčio duomenų pjūvyje, daugiausia siejami su DHL ir Revolut](/assets/img/posts/2026-08-31-radar-august-baseline/radar-brand-distribution-lt.svg)

*2 pav. Kandidatų koncentracija išlaikytame vaizde. Tai su galimais prekių ženklais susieti detektoriaus atitikmenys, o ne išmatuotos atakų, aukų ar kampanijų dalys.*

Akivaizdžiausias skaičius yra 53 DHL kandidatai. Tikslesnė analitinė išvada daug siauresnė: **DHL siejami pavadinimo pattern'ai buvo ypač dažni šiame išlaikytame vaizde**. Galimi keli paaiškinimai. Realios kampanijos apimtis galėjo būti didesnė. Registre esantys terminai galėjo atitikti produktyvų automatinio vardų kūrimo pattern'ą. Viena domenų serija galėjo išpūsti vienos šeimos skaičių. Saugojimo langas galėjo vieną kampaniją išlaikyti ilgiau. Kitas ženklas galėjo būti imituojamas kompromituotose svetainėse, socialiniuose tinkluose, shortener'iuose, IP adresuose arba naudojant registre nesančius žodžius.

DHL sudarė **40,77 %** išlaikytų kandidatų. Keturios didžiausios grupės, DHL, Revolut, Telia ir Vinted, sudarė **88 iš 130 įrašų, arba 67,69 %**. Tokia koncentracija naudinga skirstant enrichment darbą, nes kelios vardų šeimos gali užimti didžiąją eilės dalį. Jos nepakanka kampanijų paplitimui nustatyti. Vienas automatinio vardų kūrimo pattern'as gali sukurti daug sertifikatų vardų, o didelės žalos kampanija kompromituotuose teisėtuose puslapiuose gali nepatekti nė karto.

[Radar prekių ženklų registras](https://radar.hecavex.com/lt/prekes-zenklai/) yra vieša pradinė aprėptis, ne visų Lietuvos organizacijų surašymas. 46 jo įrašuose saugomi oficialūs domenai ir atpažįstami pavadinimai, padedantys mažinti akivaizdžius klaidingus atitikmenis. Detektorius neras termino, kurio nestebi, o domenų vardų detektorius nepamatys ženklo, esančio tik puslapio turinyje. Lygindami skaičius be registro ir šaltinių dizaino, rinkimo šališkumą paverstume klaidingu reitingu.

## Du papildomai pagrįsti įrašai ir 128 priežastys palikti neapibrėžtumą

Du papildomai pagrįsti įrašai buvo `wildcard[.]revolut-account[.]com` ir `revolut-casino-online[.]cz`. Abiejuose liko CertStream ir URLScan kontekstas. Du šaltinių keliai leidžia įrašus geriau patikrinti negu vien pavadinimo lead'ą, bet ir tai nėra universalus kenkėjiško puslapio įrodymas.

Sertifikato stebėjimas pagrindžia, kad vardas pateko į Certificate Transparency duomenis. URLScan rezultatas gali pagrįsti, ką konkreti viešo skenavimo sesija konkrečiu laiku užklausė ir gavo. Jis neįrodo, kad kiekvienas lankytojas gavo tą patį atsaką, kad forma buvo pateikta, kad duomenys buvo surinkti ar kad sertifikato užsakovas ir puslapio operatorius yra tas pats asmuo.

Priežasties kodai paaiškina, kodėl įrašai pateko į eilę. Dažniausi buvo įtartinas kontekstas, nuo oficialaus domeno besiskiriantis TLD, tikslus prekių ženklo token'as ir keli brūkšneliai. Rečiau pasitaikė prijungti affix'ai, padalinti token'ai, Punycode bei vizualiai panašūs Unicode ženklai. Tai naudingi prioriteto signalai, bet kartu dažni false positive šaltiniai:

- reseller'is, atsiliepimų svetainė ar vietos įmonė gali teisėtai vartoti ženklo žodį
- ženklo vardas gali būti bendrinis žodis, pavardė ar nesusijęs akronimas
- gynybiniai, žurnalistiniai ar abuse pranešimų puslapiai gali turėti įtartinai atrodančių terminų
- IDN vardai ir neįprasti TLD savaime nėra kenkėjiški
- neaktyvus ar parked domenas gali atrodyti įtartinai, nors nerodo phishing turinio
- kompromituota teisėta infrastruktūra gali rodyti phishing, nors jos hostas atrodo įprastas.

Todėl Radar reikia peržiūros eilės, o ne žalio ir raudono pranašo. Nustatytu laiku **129 įrašai buvo neperžiūrėti, vienam reikėjo peržiūros**. Užbaigtos peržiūros aprėptis buvo 0 %, tad observed precision įverčio nebuvo. Teiginys "130 kandidatų" yra pagrįstas. Teiginys "130 phishing domenų" – ne.

## Rinkimo būklė keičia dienos skaičių reikšmę

Paskutinis CertStream bandymas klausėsi numatytas 480 sekundžių ir apdorojo 147 776 pranešimus su 237 041 DNS vardu. Jis rado vieną atitikmenį ir sukūrė vieną naują archyvo įrašą. Tokia telemetrija leidžia atskirti mažą ar tuščią rezultatą nuo visai nepasileidusio rinktuvo.

Platesnio lango aprėptis buvo nepilna:

| Langas | Sėkmingi bandymai | Klausymosi aprėptis | Atitikmenys | Nauji archyvo įrašai |
| --- | ---: | ---: | ---: | ---: |
| ankstesnės 24 valandos | 113 | 62,78 % | 80 | 47 |
| ankstesnės 7 dienos | 405 | 31,18 % | 208 | 125 |

![CertStream, URLScan ir vietinės peržiūros aprėpties palyginimas rugpjūčio nustatytu laiku](/assets/img/posts/2026-08-31-radar-august-baseline/radar-source-coverage-lt.svg)

*3 pav. Kiekvienas šaltinis atsako į kitą klausimą. Sertifikato vardo stebėjimo, viešo puslapio stebėjimo ir analitiko peržiūros negalima sujungti į vieną bendrą "aprėpties" procentą.*

Aprėptis čia reiškia sėkmingų bandymų atstovaujamą numatyto klausymosi laiko dalį, o ne stebėtą visos pasaulio sertifikatų ekosistemos dalį. 31,18 % septynių dienų reikšmė reiškia, kad neapdorotų dienos kandidatų skaičių negalima laikyti stabiliu dažniu. Augimą gali lemti daugiau atitinkančių vardų, geresnis rinktuvo veikimas, sertifikatų išdavimo laikas, šaltinio atsigavimas arba keli veiksniai kartu.

Retuose `lastSeen` duomenyse buvo keturi kandidatai rugpjūčio 21 d., du – 22 d., vienas – 23 d., trys – 25 d., 15 – 27 d., 24 – 28 d., 41 – 29 d. ir 40 – 30 d. Praleistos datos nereiškia "phishing nebuvo". Tai dabartinių išlaikytų eilučių pasiskirstymas, ne pilna dienos įvykių seka, o rinkimo aprėptis skyrėsi.

URLScan pateikė devynis dabartinius įrašus. Checkpoint'as turėjo 65 užklausas: 64 užbaigtos, viena dalinė arba eilėje. URLScan yra viešų stebėjimų šaltinis su savo submit'intų puslapių populiacija ir matomumo ribomis, o ne atsitiktinė interneto imtis. crt.sh paieškos kelias baigėsi provider timeout, nors CertStream liko sveikas. Dėl to šaltinių būsenos ir turi būti rodomos atskirai, o ne paslėptos po vienu "sync pavyko" badge'u.

## Ką šis langas leidžia teigti

### Pagrįsti stebėjimai

- nustatytu laiku viešoje suvestinėje buvo 130 deduplikuotų dabartinių kandidatų
- buvo atvaizduota 18 registro prekių ženklų ir nurodytas jų kandidatų pasiskirstymas
- dauguma įrašų pateko iš CertStream aptikimo kelio
- tik du įrašai pasiekė papildomai pagrįstą lygį
- analitiko peržiūra dar nesukūrė precision imties
- rinkimo aprėptis buvo nepilna, o atskirų šaltinių būklė skyrėsi.

### Pagrįsti vertinimai

- pristatymo, finansų, telekomunikacijų, marketplace ir viešųjų paslaugų temos išlieka prasmingi Lietuvos impersonation stebėjimo prioritetai
- ankstyvam triage naudinga vien pavadinimu paremta paieška, bet jai ypač reikia false positive kontrolės
- prieš viešą išvadą verta pirmiausia enrich'inti didelės apimties ir keliuose šaltiniuose matomus klasterius
- vėlesni palyginimai turi normalizuoti arba bent rodyti klausymosi aprėptį ir registro pakeitimus.

### Nepagrįstos išvados

- DHL sudarė 40,8 % visų phishing atakų Lietuvoje
- egzistavo 130 incidentų, kampanijų arba aukų
- abu papildomai pagrįsti įrašai priklausė tam pačiam veikėjui
- registre nematomas ženklas nepatyrė phishing
- Radar nerastas domenas buvo saugus
- rugpjūčio dienų seka įrodo augantį trendą.

Ši įrodymų pakopa atitinka [UNIPARK smishing infrastruktūros tyrimo](/lt/tyrimai/unipark-smishing-infrastrukturos-tyrimas/) ir [Hostinger Pages phishing infrastruktūros tyrimo](/lt/tyrimai/hostinger-pages-phishing-infrastrukturos-tyrimas/) principą: stebėjimams, išvestiniams ryšiams ir atribucijai reikia skirtingų įrodymų. Radar gali perduoti lead'ą tyrimui, bet dashboard'as atgal nepaveldi tyrimo išvadų.

## Kaip šią bazę naudoti gynybai

Prekių ženklo savininkui naudingiausia ne blokuoti visas 130 eilučių. Kandidatus verta lyginti su oficialiais domenais, klientams matomais pavadinimais, dabartinėmis kampanijomis ir vidine telemetrija. Tada pirmiausia tikrinti įrašus su viešu turiniu, atsako hash, įtartinu hostingu, nauja registracija ar vartotojo pranešimu. Teisiniam ar abuse procesui tikslūs URL ir įrodymai saugomi privačiai, o viešinama tik būtina, defanginta informacija.

SOC komandai Radar gali praturtinti pranešimą arba pradėti retrospektyvią paiešką. To paties hosto radimas DNS, proxy, el. pašto, SMS pranešimų ar identity log'uose yra stipresnis už viešą kandidatą. Tada incidento klausimas tampa konkretus: kuris vartotojas gavo nuorodą, kas išsisprendė, koks atsakas grįžo, kokie duomenys buvo įvesti ir koks autentifikavimo ar mokėjimo įvykis sekė?

Tyrėjams ir žurnalistams [pokyčių žurnalas](https://radar.hecavex.com/lt/pokyciai/) yra geresnis šaltinis negu besikeičiančio pradinio puslapio screenshot'as. Jis atskiria pirmą publikaciją, vėlesnį stebėjimą, būsenos pakeitimą ir atšaukimą. Detalūs įvykiai saugomi 30 dienų, dienos santraukos – 730 dienų. Tai leidžia kurti ribotą chronologiją neapsimetant, kad dabartinis sąrašas amžinai išsaugo kiekvieną ankstesnę būseną.

Paprastam gavėjui Radar nepakeičia [saugaus įtartinos SMS patikrinimo](/lt/tyrimai/kaip-saugiai-patikrinti-itartina-sms-nuoroda/). Neatidarykite kandidato vien todėl, kad jis yra tyrimo indekse. Tariamus įvykius tikrinkite oficialioje organizacijos programėlėje arba pačių įvestu adresu. Jei jau pateikėte banko ar autentifikavimo duomenis, naudokite [veiksmų po phishing incidento gidą](/lt/tyrimai/ka-daryti-suvedus-banko-duomenis-phishing-puslapyje/), o ne tęskite nuorodos tyrimą.

## Atkuriamumas ir kitas palyginimas

Išvestiniame [summary JSON](/assets/data/radar-august-2026-baseline/summary.json) išsaugotos naudotos reikšmės, jų apibrėžimai, laiko riba, retention, šaltinių būklė ir dviejų lokalių šaltinio failų SHA-256. `radar.json` buvo 113 912 baitų, jo SHA-256 – `dcce36b0…83cce2`. `pipeline-health.json` buvo 4 604 baitų, jo SHA-256 – `28063e26…057d7`. Pilni hash palikti pakete.

Kita bazinė apžvalga turėtų lyginti palyginamus dalykus:

1. fiksuoti įvardytą cutoff ir šaltinių hash
2. atskleisti registro ar taisyklių pakeitimus
3. šalia skaičių rodyti klausymosi aprėptį ir provider klaidas
4. atskirti dabartinius kandidatus, naujus įvykius ir išlaikytą istoriją
5. nurodyti įrodymų lygius ir analitiko peržiūros aprėptį
6. įtraukti pataisymų bei atšaukimų poveikį
7. neskaičiuoti dažnio, kol denominator'ius ir stebėjimo procesas nėra stabilūs.

Taigi rugpjūčio rezultatas nėra "Lietuvoje buvo 130 phishing domenų". Tikslesnė ir naudingesnė išvada: **imtinė, aprėptį rodanti aptikimo sistema nustatytu laiku išlaikė 130 peržiūros kandidatų, daugumą tik su pavadinimo įrodymais**. To pakanka enrichment prioritetams ir būsimam matavimui. To nepakanka dirbtiniam užtikrintumui.

Kitoje bazinėje apžvalgoje keturi kokybės matai būtų vertingesni už dar didesnį antraštės skaičių:

- **peržiūros yield pagal balo intervalą**, skaičiuojamas kaip kenkėjiškais arba pagal politiką reikšmingais pripažintų įrašų dalis tarp visų tame intervale peržiūrėtų įrašų
- **laikas iki enrichment**, matuojamas nuo pirmo stebėjimo iki pirmo nepriklausomo viešo turinio, tinklo arba analitiko įrodymo
- **dubliuotų šeimų spaudimas**, kartu skelbiant įrašų ir suklasterintų vardų pattern'ų skaičių, kad vienas generatorius neatrodytų kaip daugybė nesusijusių kampanijų
- **pagal aprėptį normalizuotas įvykių tankis**, skelbiamas tik langams, pasiekusiems nustatytą minimalią klausymosi ribą, ir visada kartu su stebėtu klausymosi denominator'iumi.

## Šaltiniai ir duomenys

- [HECAVEX Radar apžvalga](https://radar.hecavex.com/lt/)
- [Radar metodologija ir publikavimo ribos](https://radar.hecavex.com/lt/metodologija/)
- [Radar duomenų rinkinio sutartis](https://radar.hecavex.com/lt/duomenys/)
- [Radar prekių ženklų registras](https://radar.hecavex.com/lt/prekes-zenklai/)
- [Radar viešas pokyčių žurnalas](https://radar.hecavex.com/lt/pokyciai/)
- [Publikavimui saugus agregatų ir provenance paketas](/assets/data/radar-august-2026-baseline/README.md)
