---
title: "OSINT renka. CTI padeda priimti sprendimą."
card_title: "OSINT ir CTI nėra tas pats darbas"
description: "Kodėl atvirųjų šaltinių rinkimas ir kibernetinių grėsmių žvalgyba yra susijusios, bet skirtingos disciplinos, ir kaip viešą informaciją paversti pagrįstu saugumo sprendimu."
date: 2023-10-18 14:00:00 +0300
last_modified_at: 2026-08-14 12:00:00 +0300
lang: lt
translation_key: cti-osint-duo-001
categories: [threat-intelligence, osint]
tags: [osint, cti, žvalgybos-reikalavimai, analizė]
author: deividas-lis
content_type: commentary
confidence: moderate
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
---

## Įvadas

Organizacijos, norinčios apsaugoti savo aplinką, negali pasikliauti vien reakcija į jau įvykusį incidentą. Du svarbūs aktyvios gynybos įrankiai yra atvirųjų šaltinių žvalgyba (OSINT) ir kibernetinių grėsmių žvalgyba (CTI).

Grėsmių aplinka nuolat keičiasi. Derinant OSINT ir CTI galima ne tik sekti jau žinomus indikatorius, bet ir anksčiau pastebėti besiformuojančius veikimo būdus, pažeidžiamumus bei organizacijai aktualius signalus.

## OSINT ir CTI

Abi disciplinos suteikia metodus informacijai rinkti, vertinti ir jungti iš daugelio šaltinių. Vieši duomenys ir atrinkti išoriniai srautai gali padėti nustatyti kylančias grėsmes, sekti grėsmių veikėjų taktikas, technikas ir procedūras (TTP), atakos indikatorius bei kompromitavimo indikatorius (IOC).

Mano vertinimu, CTI analitikui stiprūs OSINT įgūdžiai nėra malonus priedas – tai viena iš pagrindinių kompetencijų. Ji leidžia ne tik priimti tiekėjo pateiktą įvertį, bet ir savarankiškai patikrinti kontekstą.

## Grėsmių aplinkos supratimas

Vienas svarbiausių OSINT ir CTI derinio privalumų – geresnis situacijos suvokimas. OSINT apima naujienas, viešas duomenų bazes, socialinius tinklus, forumus, tinklaraščius ir kitus prieinamus šaltinius. CTI procesas šiuos duomenis paverčia organizacijai aktualiu vertinimu.

Pavyzdžiui, paskelbiama, kad tam tikros industrijos įmonė buvo pažeista išnaudojant `CVE-2017-11882`. CTI analitikui neužtenka perrašyti naujienos. Reikia klausti:

- Ar nukentėjusi organizacija veikia mūsų sektoriuje?
- Kokius kitus sektorius ir regionus taiko grėsmių veikėjas?
- Kokie jo motyvai ir ryšiai su kitomis grupėmis?
- Ar pažeidžiamumas mūsų aplinkoje ištaisytas?
- Ar viešai prieinamas veikiantis išnaudojimo kodas?
- Ar šią techniką galėtų perimti kiti mums aktualūs veikėjai?

Čia OSINT padeda surinkti kontekstą, o CTI – nuspręsti, ką jis reiškia konkrečiai organizacijai.

## Ankstyvas grėsmių aptikimas

Viešuose ir specializuotuose šaltiniuose galima stebėti diskusijas apie IOC, TTP, pažeidžiamumus ar būsimus išnaudojimo būdus. Susiejus išorinę informaciją su vidiniais saugumo įvykiais, kylančią grėsmę kartais galima atpažinti anksčiau, nei ji tampa plataus masto incidentu.

Tai leidžia imtis prevencinių veiksmų: įdiegti pataisas, sukurti aptikimo taisykles, sustiprinti stebėseną ar patikrinti, ar konkretus atakos kelias apskritai veikia organizacijos aplinkoje.

## Aktyvios gynybos priemonės

Įsivaizduokime, kad viešame forume paskelbiamos dar neištaisyto „Microsoft Word“ pažeidžiamumo išnaudojimo instrukcijos. Žvalgybos komanda perduoda informaciją raudonajai, mėlynajai, pažeidžiamumų valdymo ir operacijų komandoms. Raudonoji komanda patikrina išnaudojimą, o gynybos komanda sukuria kompensuojančias kontrolės ir aptikimo priemones.

Po kelių savaičių saugumo operacijų komanda pastebi bandymą panaudoti tą pačią techniką. Ankstesnis OSINT signalas tapo CTI vertinimu, šis – gynybos veiksmu, o gynybos veiksmas padėjo suvaldyti realų bandymą.

<aside class="hx-callout key-finding"><strong>Pagrindinė išvada</strong>OSINT duomenys vertę įgauna ne tada, kai yra surenkami, o tada, kai patikrinami, susiejami su organizacijos rizika ir perduodami komandai, galinčiai veikti.</aside>

## Išvada

Geriausia gynyba dažnai yra aktyvi. Tačiau aktyvumas nereiškia beatodairiško kiekvieno indikatoriaus blokavimo. Jis reiškia gebėjimą anksti pastebėti signalą, suprasti jo kontekstą ir laiku priimti proporcingą sprendimą.
