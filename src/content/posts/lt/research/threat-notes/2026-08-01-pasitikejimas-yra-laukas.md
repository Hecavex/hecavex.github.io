---
title: "Analitinis pasitikėjimas yra laukas, o ne jausmas"
card_title: "Pasitikėjimas yra laukas"
description: "Kaip HECAVEX atskiria šaltinio patikimumą, įrodymų stiprumą ir analitinį pasitikėjimą, neslėpdamas neapibrėžtumo po viena etikete."
seo_title: "Analitinis pasitikėjimas CTI: šaltiniai ir įrodymai"
seo_keywords:
  - "analitinis pasitikėjimas CTI"
  - "šaltinio patikimumas"
  - "įrodymų stiprumas"
  - "žvalgybos analizės pasitikėjimo lygis"
  - "analitinis neapibrėžtumas"
date: 2026-08-01 13:00:00 +0300
last_modified_at: 2026-08-14 12:00:00 +0300
lang: lt
translation_key: confidence-method-001
categories: [tradecraft]
tags: [analizė, pasitikėjimas, metodika]
author: deividas-lis
content_type: threat-note
confidence: high
tlp: clear
featured: false
draft: false
toc: true
comments: false
image:
  path: /assets/img/posts/hecavex-editorial/confidence-field.svg
  social: /assets/img/social/confidence-method-001-lt.png
  alt: "Analitinis pasitikėjimas pavaizduotas įrodymų juostomis kalibruotame lauke"
  thumbnail: /assets/img/posts/hecavex-editorial/confidence-field.svg
---

Analitinis pasitikėjimas nusako, kaip gerai turimi įrodymai pagrindžia konkretų vertinimą. Jis nenusako, kaip stipriai analitikui patinka jo paties išvada, kaip rimtai skamba tema ar kiek svetainių pakartojo tą patį sakinį.

HECAVEX naudoja žemą, vidutinį ir aukštą pasitikėjimą tada, kai tai suteikia skaitytojui papildomos informacijos. Etiketė nepakeičia įrodymų, prielaidų, alternatyvų ir spragų.

## Trys skirtingi klausimai

Praktikoje į vieną žodį dažnai suplakami trys vertinimai:

1. **Kiek patikimas šaltinis?** Ar jis turėjo prieigą, reikiamą kompetenciją ir anksčiau teikė tikslią informaciją?
2. **Kiek patikimas konkretus teiginys?** Ar jis tiesioginis, nuoseklus ir patvirtintas kitais duomenimis?
3. **Kiek turimi įrodymai pagrindžia analitinę išvadą?** Ar vis dar lieka realių alternatyvių paaiškinimų?

Paprastai patikimas šaltinis gali paskelbti silpnai pagrįstą teiginį. Nežinomas šaltinis gali pateikti artefaktą, kurį pavyksta nepriklausomai patikrinti. Dešimt naujienų gali atrodyti kaip dešimt patvirtinimų, nors visos cituoja tą patį pirminį pranešimą.

Šaltinių skaičiavimas neatsekus jų kilmės yra gražiai atrodantis savęs apgaudinėjimas.

## Stebėjimas nėra atribucija

Tikslus indikatorius gali būti aukšto pasitikėjimo įrodymas, kad konkretus domenas tam tikru metu pateikė konkretų scenarijų. Tas pats faktas gali pagrįsti tik žemo pasitikėjimo priskyrimą operatoriui.

Bendras hostingas, kompromituota infrastruktūra, perparduodami phishing kit, nukopijuotas kodas ir sąmoninga imitacija sukuria sutapimus be bendros kontrolės. Koreliacija padeda suformuluoti kitą klausimą. Ji neatsako, kas sėdėjo už klaviatūros.

<aside class="hx-callout"><strong>Analitiko pastaba</strong>Reikia nurodyti, kam taikomas pasitikėjimas. Aukštas pasitikėjimas kodo elgsenos vertinimu ir žemas pasitikėjimas atribucija gali egzistuoti vienu metu.</aside>

## Kaip naudojami lygiai

**Aukštas pasitikėjimas** reiškia, kad išvadą pagrindžia keli stiprūs ir nuoseklūs įrodymai, įvertintos svarbiausios alternatyvos, o likusios spragos neturėtų pakeisti pagrindinės išvados.

**Vidutinis pasitikėjimas** reiškia, kad vertinimas yra pagrįstas ir praktiškai naudingas, tačiau lieka svarbių duomenų spragų, šaltinių ribotumų ar realių alternatyvų.

**Žemas pasitikėjimas** reiškia, kad vertinimas preliminarus. Įrodymai gali būti fragmentiški, netiesioginiai, sunkiai patikrinami arba suderinami su keliais paaiškinimais.

Žemas pasitikėjimas nereiškia, kad informacija bevertė. Jis reiškia, kad sprendimo priėmėjas turi matyti riziką elgtis taip, tarsi klausimas jau išspręstas.

## Kas keičia pasitikėjimą

Jį didina nepriklausomas patvirtinimas, pirminiai artefaktai, pakartojami techniniai stebėjimai ir duomenys, leidžiantys atmesti alternatyvas. Jį mažina paneigtas šaltinio teiginys, bendra infrastruktūra, nesutampantys laikai ar neatkuriama priežastinė grandinė.

Dėl to HECAVEX publikacijose nurodoma apimtis, apribojimai, metodai ir versijų istorija. Išvada turi galėti pasikeisti be bandymo apsimesti, kad ankstesni įrodymai neegzistavo.

## Paprastas testas

Prieš priskirdamas lygį analitikas turėtų gebėti užbaigti sakinį:

> **[Lygio]** pasitikėjimu vertinu, kad **[konkreti išvada]**, nes **[stipriausias įrodymas]**, tačiau lieka **[svarbiausia spraga arba alternatyva]**.

Jei šio sakinio nepavyksta užbaigti be miglos, problema greičiausiai ne etiketėje. Dar nebaigtas pats vertinimas.
