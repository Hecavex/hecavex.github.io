---
title: "OSINT galimybės: pažangioji „Google“ paieška"
description: "Pažangūs „Google“ paieškos operatoriai padeda aptikti įprastoje paieškoje sunkiai randamą informaciją ir yra naudingi OSINT, saugumo tyrimams bei analizei."
seo_title: "Google dorking OSINT: pažangūs paieškos operatoriai"
seo_keywords:
  - "Google dorking OSINT"
  - "Google paieškos operatoriai"
  - "pažangioji Google paieška"
  - "OSINT paieška"
  - "site ir filetype operatoriai"
date: 2023-10-12 14:00:00 +0300
last_modified_at: 2026-08-14 12:00:00 +0300
lang: lt
translation_key: google-dorking-001
categories: [osint, tradecraft]
tags: [osint, paieška]
author: deividas-lis
content_type: technical-guide
confidence: high
tlp: clear
image:
  path: /assets/img/posts/2023-10-11-google-dorking/main/1_img.png
  alt: "„Google“ paieškos langas, iliustruojantis pažangiąsias OSINT užklausas"
  width: 593
  height: 356
featured: false
draft: false
toc: true
comments: false
research_version: "2.0"
research_status: updated
key_findings:
  - Pažangioji paieška daugiausia vertės suteikia tada, kai platus klausimas suskaidomas į objektus, šaltinių ribas, dokumentų tipus ir laiko intervalus.
  - Paieškos rezultatas yra tyrimo pradinis taškas, o ne įrodymas, kol neatvertas, neišsaugotas ir kontekste neįvertintas pirminis puslapis.
  - Operatorių palaikymas, reitingavimas ir rezultatų skaičius keičiasi, todėl reikia fiksuoti užklausą, paieškos sistemą, datą ir rastą šaltinį.
scope: Teisėtas viešojo žiniatinklio turinio aptikimas naudojant pagrindinius paieškos operatorius OSINT ir CTI užduotims.
limitations: Paieškos sistemos rodo nepilną ir nuolat kintantį indeksą. Nerastas rezultatas neįrodo, kad informacija ar ryšys neegzistuoja.
updates:
  - date: 2026-08-14
    note: Tekstas pertvarkytas į pakartojamą OSINT rinkimo metodą, pridėtas paieškos žurnalas, įrodymų išsaugojimas ir dabartiniai operatorių apribojimai.
---

## Įvadas

Tikriausiai esate girdėję sakant, kad internete nepavyko rasti informacijos apie konkretų žmogų ar temą. Paieškos sistemos – „Google“, „Bing“, „Yahoo!“, „Yandex“ ir kitos – yra vartai į milžinišką informacijos kiekį, tačiau paprasta užklausa ne visada nuveda ten, kur reikia.

Viena iš paiešką išplečiančių technikų vadinama **„Google dorking“**, arba pažangiąja „Google“ paieška. Ji gali būti naudinga ir kasdien, ir atliekant struktūruotą OSINT tyrimą.

Tai yra platesnio [OSINT ir CTI workflow rinkimo sluoksnis](/lt/tyrimai/cti-osint-duo/). Prieš paieškos rezultatui tampant pagrįsta išvada, jo šaltinį ir įrodymus dar reikia įvertinti pagal [aiškų analitinio pasitikėjimo modelį](/lt/tyrimai/pasitikejimas-yra-laukas/).

## Kas yra pažangioji „Google“ paieška

Tai pažangių paieškos operatorių naudojimas konkrečiai, įprastais būdais sunkiau aptinkamai informacijai rasti. Kitaip tariant, tinkamai suformuota užklausa nurodo paieškos sistemai ne tik ko ieškoti, bet ir kur bei kokiu formatu to ieškoti.

### Kam ji naudojama

Ši technika tinka informacijos rinkimui, saugumo tyrimams, įsiskverbimo testavimui, konkurencinei analizei ir viešos informacijos apie asmenis paieškai. Pastarasis atvejis taip pat gali būti išnaudotas socialinės inžinerijos atakose, todėl svarbu laikytis teisinių ir etinių ribų.

### Informacijos aptikimas

Tarkime, saugumo tyrėjas ieško viešai prieinamų dokumentų apie „Hive“ išpirkos reikalavimo paslaugą. Galima pradėti nuo:

```text
intext:"Hive RaaS"
```

Ši užklausa ieško puslapių, kurių turinyje yra tiksli frazė. Paiešką galima susiaurinti iki PDF dokumentų:

```text
filetype:pdf intext:"Hive RaaS"
```

### Tyrimai ir konkurencinė analizė

Analitikai gali ieškoti konkrečių rinkos tendencijų, klientų nuomonių ar konkurentų veiklos. Pavyzdžiui:

```text
site:example.com "industry trends" OR "customer preferences" OR "product reviews"
```

Užklausą galima papildyti konkrečios industrijos terminais ar produktų pavadinimais. Tai tik keli teisėto ir etiško taikymo pavyzdžiai – viešas pasiekiamumas savaime nereiškia, kad informaciją galima naudoti nepaisant privatumo ar teisės.

## Praktinis pavyzdys

Tarkime, norime rasti naujesnės informacijos apie „Rhysida RaaS“. Paprasta paieška pateikia daug rezultatų:

![Pradiniai „Google“ paieškos rezultatai](/assets/img/posts/2023-10-11-google-dorking/blog_images/2_img.png)

Pridėjus pažangius operatorius rezultatai tampa tikslesni:

![Rezultatai panaudojus pažangius paieškos operatorius](/assets/img/posts/2023-10-11-google-dorking/blog_images/3_img.png)

Papildomas `site:` operatorius gali susiaurinti paiešką iki konkrečių šaltinių:

![Paieška susiaurinta iki dviejų rezultatų](/assets/img/posts/2023-10-11-google-dorking/blog_images/4_img.png)

Šiame pavyzdyje rezultatų skaičius sumažėjo nuo 8150 iki dviejų.

## Dažniausiai naudojamos užklausos

Tiksli frazė:

```text
"Kontekstas"
```

Tiksli frazė konkrečioje svetainėje:

```text
site:svetaine.lt "Kontekstas"
```

PDF dokumentai, kurių pavadinime yra ieškomas tekstas:

```text
filetype:pdf intitle:"Kontekstas"
```

Keli dokumentų formatai:

```text
(filetype:pdf OR filetype:docx OR filetype:ppt) "Kontekstas"
```

Paieška pasirinktose socialinėse platformose:

```text
(site:tinklas1.example OR site:tinklas2.example) "Kontekstas"
```

Rezultatai pasirinktame datos intervale:

```text
"Kontekstas" after:YYYY-MM-DD before:YYYY-MM-DD
```

Datos intervalas pasirinktose svetainėse:

```text
(site:tinklarastis1.example OR site:tinklarastis2.example) after:YYYY-MM-DD before:YYYY-MM-DD "Kontekstas"
```

`cache:` operatorius istoriškai galėjo parodyti paieškos sistemos išsaugotą puslapio kopiją, tačiau jo prieinamumas ir veikimas laikui bėgant keitėsi. Tyrime verta patikrinti ir specializuotas interneto archyvavimo paslaugas.

<aside class="hx-callout warning"><strong>Apribojimas</strong>Paieškos operatorių palaikymas ir rezultatų skaičius keičiasi. Prieš dokumentuojant išvadą užklausą verta pakartoti ir išsaugoti paieškos datą.</aside>

## Paieškos žurnalas

Jei rezultatas vėliau bus naudojamas tyrime ar analitiniame vertinime, vien nuorodos neužtenka. Reikėtų fiksuoti bent šiuos laukus:

| Laukas | Ką išsaugoti |
|---|---|
| Tyrimo klausimas | Kokią hipotezę ar sprendimą tikrina užklausa |
| Užklausa | Tiksli paieškos sistemai pateikta eilutė |
| Paieškos sistema | „Google“, „Bing“ ar kitas indeksas |
| Paieškos laikas | Data, laikas ir laiko juosta |
| Rezultato URL | Pirminis puslapis, o ne paieškos rezultatų puslapis |
| Išsaugojimas | Vietinė kopija, archyvo nuoroda ar ekrano kopija, kai tai teisėta |
| Vertinimas | Kodėl šaltinis svarbus ir kiek jis patikimas |

Paieškos sistemos rodomas rezultatų skaičius retai tinka kaip patikimas matavimas. Jis gali būti apytikslis, kisti tarp užklausų ir sumažėti perėjus į paskutinius puslapius. Jei išvada priklauso nuo skaičiaus, reikia surinkti, normalizuoti ir pašalinti pasikartojančius rezultatus.

## Nuo rezultato iki įrodymo

Rezultatas tampa naudingas tik patikrinus pirminį puslapį. Kas jį paskelbė? Kada? Ar pateikiami pirminiai dokumentai? Ar puslapis nebuvo pakeistas? Ar teiginį patvirtina kitas, nepriklausomas šaltinis?

Čia ir atsiranda skirtumas tarp „radau per Google“ ir normaliai dokumentuoto OSINT darbo. Paieškos sistema padeda rasti pradines kryptis. Įrodymų vertinimo už analitiką ji neatlieka.

## Dažniausios klaidos

- Per anksti pridedama per daug apribojimų ir prarandami sinonimai bei naudingi šaltiniai.
- Aukšta rezultato pozicija supainiojama su patikimumu.
- Nieko neradus padaroma išvada, kad informacija ar ryšys neegzistuoja.
- Naudojami nebeveikiantys operatoriai ir nepatikrinama, kaip jie elgiasi dabar.
- Nuorodos kaupiamos neturint aiškaus tyrimo klausimo.
- Įtartini rezultatai atveriami įprastoje darbo sistemoje, nors tam reikėtų izoliuotos tyrimo aplinkos.

## Trumpas darbo modelis

```text
objektas arba išskirtinė frazė
→ sinonimas ar alias
→ šaltinio riba
→ dokumento formatas
→ laiko intervalas
→ pirminio šaltinio išsaugojimas
→ patikimumo ir reikšmės vertinimas
```

Operatorius galima išmokti per keliolika minučių. Sunkesnė dalis yra žinoti, kokį klausimą kiekviena užklausa tikrina, ko paieškos indeksas nerodo ir ką būtina išsaugoti, kad rezultatas vėliau išlaikytų analitinį svorį.
