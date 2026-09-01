---
title: "OSINT renka. CTI padeda priimti sprendimą."
card_title: "OSINT ir CTI nėra tas pats darbas"
description: "Kodėl atvirųjų šaltinių rinkimas ir kibernetinių grėsmių žvalgyba yra susijusios, bet skirtingos disciplinos, ir kaip viešą informaciją paversti pagrįstu saugumo sprendimu."
seo_description: "Kuo skiriasi OSINT rinkimas ir CTI analizė bei kaip viešą informaciją paversti aiškiai pagrįstu kibernetinio saugumo sprendimu."
seo_title: "CTI ir OSINT skirtumai: nuo duomenų iki sprendimo"
seo_keywords:
  - "CTI ir OSINT skirtumai"
  - "kas yra OSINT"
  - "kibernetinių grėsmių žvalgyba"
  - "žvalgybos reikalavimai"
  - "OSINT analizė"
date: 2023-10-18 14:00:00 +0300
last_modified_at: 2026-08-23 12:00:00 +0300
lang: lt
translation_key: cti-osint-duo-001
categories: [threat-intelligence, osint]
tags: [osint, cti, žvalgybos-reikalavimai, analizė]
author: deividas-lis
content_type: commentary
confidence: high
tlp: clear
image:
  path: /assets/img/posts/2023-10-18-cti-osint/1_img.png
  alt: "Iliustracija apie OSINT ir CTI procesų derinimą"
  width: 577
  height: 433
featured: false
draft: false
toc: true
comments: false
updates:
  - date: 2026-08-23
    note: Lietuviškas leidimas sulygintas su dabartine analitine angliško leidimo struktūra.
---

OSINT ir kibernetinių grėsmių žvalgyba dažnai minimos viename sakinyje taip, lyg būtų tas pats dalykas. Nėra.

OSINT yra rinkimo disciplina. Ji suteikia metodus viešai ir komerciškai prieinamai informacijai rasti, išsaugoti bei įvertinti. CTI yra sprendimų palaikymo funkcija. Ji sujungia aktualius įrodymus, įskaitant, bet neapsiribojant OSINT, kad sumažintų neapibrėžtumą priimant konkretų saugumo sprendimą.

Šis skirtumas nėra akademinis. Nuo jo priklauso, ar komanda kuria žvalgybą, ar tik brangią nuorodų krūvą.

Praktinis workflow gali prasidėti nuo [pakartojamų "Google" paieškos operatorių](/lt/tyrimai/google-dorking/), teiginius vertinti pagal [aiškias analitinio pasitikėjimo taisykles](/lt/tyrimai/pasitikejimas-yra-laukas/) ir struktūruotus stebėjimus saugoti [MISP, nepainiojant platformos su pačiu žvalgybos procesu](/lt/tyrimai/misp-for-cti-part-1/).

## Rinkimas prasideda nuo reikalavimo

"Stebėti ransomware" nėra žvalgybos reikalavimas. Jame nėra saugomo turto, sprendimo, laiko horizonto ar veiksmų slenksčio.

Naudingesnis reikalavimas atrodytų taip:

> Kurios ransomware grupės per artimiausias 90 dienų yra parodžiusios gebėjimą ir ketinimą taikytis į Europos logistikos organizacijas, naudojančias mūsų aplinkoje veikiančias technologijas?

Dabar rinkimas turi ribas. Analitikas gali tikrinti viešas ataskaitas, nutekintų duomenų svetaines, malware saugyklas, pažeidžiamumų išnaudojimo įrašus ir infrastruktūros duomenis. Vidinės komandos gali pridėti turto inventorių, pasiekiamumą, telemetriją ir incidentų istoriją.

OSINT padeda gauti išorinius įrodymus. Ji nenusprendžia, ką tie įrodymai reiškia organizacijai.

## Virsmas į CTI

Tarkime, paskelbiama, kad to paties sektoriaus organizacija buvo kompromituota išnaudojant žinomą pažeidžiamumą. CVE ir grėsmių veikėjo pavadinimo nukopijavimas į srautą yra informacijos pernešimas. Žvalgybos darbas užduoda kitus klausimus:

- Ar paveiktas produktas įdiegtas mūsų aplinkoje ir pasiekiamas iš išorės?
- Ar pažeidžiama funkcija įjungta mūsų naudojamoje versijoje?
- Ar išnaudojimas stebėtas prieš pataisos paskelbimą, ar po jo?
- Ar veikėjas taikosi į mūsų sektorių, regioną arba technologijų rinkinį?
- Kokio elgesio jau dabar galime ieškoti savo telemetrijoje?
- Koks sprendimas pasikeistų, jei vertinimas yra teisingas?

Išorinis pranešimas duoda užuominą. Turto kontekstas, telemetrija ir operacinė atsakomybė parodo, ar ji tampa prioritetu.

## Kur OSINT suteikia pranašumą

Stiprus darbas su viešais šaltiniais gali atskleisti:

- viešai aprašytų įsilaužimo grupių vardų bei ryšių persidengimą.
- domenus, sertifikatus, hostingo modelius ir pakartotinai naudojamą web turinį.
- kelių tyrėjų aprašytas malware galimybes bei pristatymo kelius.
- taikymosi modelius, matomus aukų pranešimuose ir teisiniuose dokumentuose.
- pažeidžiamumų išnaudojimo laiko juostas.
- naratyvus ir jų platinimo infrastruktūrą informacinėse operacijose.

OSINT taip pat kuria spąstus. Tiekėjų vardų sistemos persidengia netiksliai. Vieši indikatoriai greitai sensta. Nukopijuotas teiginys gali atrodyti nepriklausomai patvirtintas, kai jį pakartoja dešimt svetainių. Paieškoje geriau matoma tai, kas populiaru ir indeksuojama, o ne tai, kas reprezentatyvu.

Analitikui vienodai reikia rinkimo įgūdžių ir skepticizmo šaltinių atžvilgiu.

## Vidiniai įrodymai pakeičia atsakymą

Viešose ataskaitose technika gali būti vadinama populiarėjančia, nors vidinė telemetrija rodo, kad atitinkamas produktas organizacijoje nenaudojamas. Grėsmių veikėjas gali globaliai taikytis į sektorių, bet konkrečios organizacijos ekspozicija gali būti maža. Ir atvirkščiai: silpnas išorinis signalas tampa skubus, kai su juo sutampa autentifikacijos logai, endpoint elgesys ir tinklo įrodymai.

Todėl komercinis srautas, OSINT paieška ir CTI produktas nėra sinonimai. Produktas turi paaiškinti, kas stebėta, apie ką pranešta, kas vertinama, koks vertinimo pasitikėjimas ir kokį sprendimą jis palaiko.

## Praktinis procesas

```text
sprendimas
→ žvalgybos reikalavimas
→ rinkimo planas
→ OSINT ir vidinis rinkimas
→ šaltinių bei įrodymų vertinimas
→ alternatyvų analizė
→ vertinimas su pasitikėjimo lygiu
→ veiksmas, grįžtamasis ryšys ir peržiūra
```

Grįžtamojo ryšio žingsnis dažnai praleidžiamas. Jei informacijos gavėjas nesiėmė veiksmų, analitikas turėtų patikrinti, ar vertinimas nepasirodė per vėlai, nebuvo per bendras arba atsakė į ne tą klausimą. Daugiau duomenų nėra automatinis vaistas.

## Kaip atrodo geras rezultatas

Naudingas CTI vertinimas turi aiškiai parodyti keturis dalykus:

1. **Kas pasikeitė.** Naujas stebėjimas arba pokytis.
2. **Kodėl tai svarbu čia.** Ryšys su organizacijos turtu, tapatybėmis, technologijomis arba verslo ekspozicija.
3. **Kiek tvirtas vertinimas.** Įrodymų kokybė, nuoseklumas, spragos ir alternatyvos.
4. **Kokį sprendimą galima priimti.** Taisyti, ieškoti, stebėti, riboti, komunikuoti arba priimti riziką.

Indikatoriai gali padėti sukurti tokį rezultatą. Jie neturi tapti visu rezultatu.

## Mano pozicija

CTI analitikas turi mokėti dirbti su OSINT, nes savarankiškas rinkimas ir tikrinimas mažina priklausomybę nuo tiekėjų santraukų. Tačiau vien OSINT įgūdžiai darbo žvalgyba nepaverčia. Darbas baigtas tik tada, kai surinkta informacija įvertinta kontekste ir sumažina neapibrėžtumą žmogui, galinčiam veikti.

Todėl naudinga pora nėra įrankių "dinamiškas duetas". Tai disciplinuota grandinė nuo klausimo prie įrodymo ir sprendimo. Nutraukus bet kurią grandį, komanda arba ieško be tikslo, arba vertina be faktų.
