---
layout: page
lang: lt
translation_key: analytical-methodology
title: Įrodymų ir atribucijos metodika
description: Kaip HECAVEX atskiria stebėjimus, išvadas ir vertinimus, tikrina šaltinius, vertina infrastruktūros ryšius, nustato pasitikėjimą ir taiso analitines išvadas.
permalink: /lt/metodika/
last_modified_at: 2026-08-21 22:30:00 +0300
---

HECAVEX tyrimai remiasi nepilna, konkrečiu laiku surinkta ir kartais sąmoningai klaidinančia vieša informacija. Ši metodika paaiškina, kaip iš tokios medžiagos gaunamas analitinis vertinimas. Ji nereiškia, kad vieši šaltiniai gali atsakyti į kiekvieną žvalgybinį klausimą.

## Keturi teiginių tipai

Kiekvieną reikšmingą išvadą turėtų būti galima priskirti vienam iš keturių tipų:

| Tipas | Reikšmė | Pavyzdys |
| --- | --- | --- |
| Stebėjimas | Tai, kas tiesiogiai matoma surinktame įrodyme | Nurodytu laiku archyvuotas atsakas turi konkretų SHA-256. |
| Šaltinio teiginys | Aiškiai įvardyto išorinio šaltinio pateikta informacija | Tiekėjas nurodo, kad incidentas suvaldytas konkrečiu laiku. |
| Analitinė išvada | Ryšys, gautas iš vieno ar kelių stebėjimų | Du puslapiai stebėtu laikotarpiu atsisiuntė baitas į baitą tą patį skriptą. |
| Vertinimas | Analitiko sprendimas, atsakantis į žvalgybinį klausimą | Turimi duomenys atitinka bendros kampanijos infrastruktūros hipotezę. |

Šaltinio teiginys visada priskiriamas šaltiniui. Tikėtina išvada vien dėl gero skambesio netampa stebėjimu. Vertinimas turi nurodyti pasitikėjimą ir reikšmingas alternatyvas.

## Šaltinio patikimumas ir informacijos pagrįstumas

Šaltinio patikimumas ir konkretaus teiginio pagrįstumas vertinami atskirai. Paprastai patikimas leidėjas gali pateikti silpnai pagrįstą atskirą teiginį. Anksčiau nežinomas šaltinis gali pateikti autentišką pirminį įrodymą.

Vertinama:

- šaltinio artumas įvykiui ar įrodymui
- prieiga prie reikalingos telemetrijos
- medžiagos autentiškumas ir vientisumas
- nepriklausomumas nuo kitų cituojamų šaltinių
- ankstesnis patikimumas, jei jį galima nustatyti
- galimybė teiginį atkartoti ar patvirtinti
- interesai, konfliktai ir galimas šališkumas

Pirmenybė teikiama pirminiams techniniams įrodymams, tačiau jokia šaltinių kategorija savaime nėra teisinga.

## Pasitikėjimas

- **Aukštas:** vertinimą palaiko autoritetingas pirminis įrodymas arba keli nepriklausomi ir vienas kitą papildantys signalai. Reikšmingos alternatyvos apsvarstytos ir yra gerokai mažiau tikėtinos.
- **Vidutinis:** vertinimą palaiko patikimi duomenys, tačiau lieka svarbi informacijos spraga arba reali alternatyva.
- **Žemas:** vertinimas yra tikėtinas ir pakankamai svarbus užfiksuoti, bet remiasi ribotais, netiesioginiais ar silpnai išskiriančiais duomenimis.

Pasitikėjimas nusako įrodymų stiprumą, o ne poveikį, skubumą ar tikimybę, kad indikatorius šiuo metu tebėra kenkėjiškas.

## Infrastruktūros ir kodo sutapimai

Vien IP adreso, sertifikato, analytics ID, registratoriaus, vardų serverio, hostingo tiekėjo ar kodo fragmento neužtenka veiklai priskirti konkrečiam operatoriui. Shared services, perpardavimas, kompromituota infrastruktūra, nukopijuoti kit'ai ir sutapimai kuria klaidingus ryšius.

Stipresnis ryšys paprastai jungia kelis požymius:

- retą arba tikslų kodo sutapimą su suderinamu deployment kontekstu
- pasikartojančius infrastruktūros modelius laike
- vienodas konfigūracijas, path'us, parametrus ar operatoriaus workflow
- nuoseklų targeting ir lure dizainą
- laike suderinamus stebėjimus
- pasyvaus DNS, sertifikatų ar registracijos istorijos patvirtinimą
- nepriklausomai aprašytą aukos ar incidento telemetriją

Kiekviena grafo jungtis turi atskirti tiesioginį stebėjimą nuo analitinio ryšio.

## Veikėjų ir klasterių pavadinimai

HECAVEX gali suteikti laikiną analitinį pavadinimą susijusių stebėjimų rinkiniui, kad tyrime būtų įmanoma apie jį nuosekliai kalbėti. Toks pavadinimas nėra naujos grėsmių grupės paskelbimas.

Žinomo veikėjo atribucijai reikia gerokai daugiau nei bendro commodity įrankio ar infrastruktūros. Kai pateikiama tiekėjo ar valstybės institucijos atribucija, išsaugomas originalus šaltinis, formuluotė ir pasitikėjimo riba. Skirtingos naming sistemos nėra tyliai sujungiamos.

## Indikatorių gyvavimo ciklas

Indikatorius yra konkrečiu laiku padarytas stebėjimas. Cloud IP, hostingas, domenas ar shared service gali pakeisti savininką arba paskirtį. Todėl indikatoriams, kai įmanoma, pateikiama:

- pirmo ir paskutinio stebėjimo laikas
- indikatoriaus vaidmuo
- šaltinis ir surinkimo būdas
- pasitikėjimas
- current, expired, revoked, benign-comparison arba unknown būsena
- įspėjimas, jei indikatorius netinka nuolatiniam blokavimui

## Alternatyvios hipotezės ir ribotumai

Dideli tyrimai nurodo ir tai, ko įrodymai nepatvirtina. Reikšmingi alternatyvūs paaiškinimai paliekami tol, kol nauji duomenys juos padaro nepagrįstus. Kai matomumas nepilnas, įrodymo nebuvimas nelaikomas nebuvimo įrodymu.

## Atkartojamumas ir išsaugojimas

Kai tai saugu ir teisėta, prie tyrimo pateikiami machine-readable stebėjimai, įrodymų hash'ai, šaltinių sąrašas, atkartojimo pastabos ir pakeitimų istorija. Pavojingi payload'ai, credentials, asmens duomenys ir neproporcingą žalą galinti sukurti medžiaga nepublikuojami arba neutralizuojami.

## Pataisymai ir pervertinimas

Nauji įrodymai gali padidinti ar sumažinti pasitikėjimą, padalinti klasterį, padaryti indikatorių nebeaktualų arba pakeisti atribuciją. Reikšmingi pakeitimai datuojami straipsnyje ar tyrimo release ir registruojami [pataisymų puslapyje](/lt/pataisymai/). Tyliai pakeisti išvadą nėra tinkamas pataisymo procesas.

Šią metodiką reikia skaityti kartu su [redakciniais standartais](/lt/redakcija/) ir [bendru žvalgybos terminų žodynu](/lt/zodynas/), kuriame paaiškinta, kaip tos pačios sąvokos taikomos Research, Radar, APT Notes ir Labs.
