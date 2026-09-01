---
title: "Netikras Vinted ar Facebook Marketplace pirkėjas: kaip veikia phishing schema"
card_title: "Kaip veikia netikro Marketplace pirkėjo phishing"
description: "Praktinis vadovas apie netikrus pirkėjus, išorines kurjerio ir mokėjimo nuorodas, kortelės, banko bei Smart-ID riziką, įrodymus ir skubų reagavimą."
seo_title: "Netikras Marketplace pirkėjas ir mokėjimo phishing"
seo_description: "Kaip netikri Vinted ar Facebook Marketplace pirkėjai naudoja kurjerio bei mokėjimo nuorodas, kokius įrodymus saugoti ir kaip nedelsiant reaguoti."
seo_keywords:
  - "netikras Marketplace pirkėjas"
  - "Vinted phishing"
  - "Facebook Marketplace sukčiavimas"
  - "netikra kurjerio mokėjimo nuoroda"
  - "Smart-ID phishing schema"
  - "pardavėjo mokėjimo scam"
date: 2026-08-31 18:30:00 +0300
lang: lt
translation_key: marketplace-buyer-phishing
permalink: /lt/tyrimai/netikras-marketplace-pirkejas-phishing/
author: deividas-lis
content_type: technical-guide
publication_class: technical-assessment
confidence: high
tlp: clear
categories: [fraud-scams, social-engineering, tradecraft]
tags: [phishing, social engineering, payment fraud, incident response, Lithuania, smishing]
featured: false
draft: false
published: true
toc: true
comments: false
prose_width: wide
scope: "Pardavėjui skirtas gynybinis Marketplace phishing vadovas apie pokalbio perkėlimą į išorinį kurjerio, mokėjimo ar autentifikacijos puslapį, prevenciją, įrodymus ir reagavimą Lietuvoje."
limitations: "Marketplace funkcijos ir pranešimo sąsajos gali keistis. Įtartina žinutė, išorinė nuoroda ar nauja paskyra savaime neįrodo fraud. Vadove vertinamas transakcijos kelias ir prašomas veiksmas, o ne atribucuojamas operatorius."
methods:
  - "Oficialių prekyviečių ir autentifikacijos tiekėjo rekomendacijų peržiūra"
  - "Lietuvos policijos pranešimo peržiūra"
  - "Phishing transakcijos eigos modeliavimas"
  - "Incidento valdymo ir įrodymų išsaugojimo analizė"
evidence_basis: "2026 m. rugpjūčio 26 d. Panevėžio policijos pranešimas, apibendrintas Signalų apžvalgoje #5, oficialios Meta, Vinted ir Smart-ID saugumo rekomendacijos, Lietuvos banko pagalba nukentėjusiems bei NKSC pranešimų kanalai."
key_findings:
  - "Svarbiausia riba yra perėjimas iš pažįstamo Marketplace pokalbio į pirkėjo atsiųstą išorinį mokėjimo, kurjerio ar pagalbos puslapį."
  - "Norint gauti pinigus per įprastą platformos procesą, pardavėjui nereikia pirkėjo nuorodoje pateikti kortelės, interneto banko ar Smart-ID duomenų."
  - "Smart-ID, Mobile-ID ar OTP patvirtinimas yra konkretus veiksmas, o ne bendrinis tapatybės testas. Tekstas, suma ir gavėjas turi atitikti savarankiškai pradėtą operaciją."
  - "Suvedus duomenis ar ką nors patvirtinus, pirmiausia reikia oficialiu kanalu susisiekti su banku, o pokalbio, URL ir transakcijos įrodymus išsaugoti pranešimui."
image:
  path: /assets/img/posts/2026-08-31-marketplace-buyer-phishing/marketplace-buyer-phishing-hero-v2.webp
  social: /assets/img/social/marketplace-buyer-phishing-lt.png
  thumbnail: /assets/img/posts/2026-08-31-marketplace-buyer-phishing/marketplace-buyer-phishing-card-v2.webp
  alt: "Netikras Marketplace pirkėjas iš patikimo pokalbio nuveda pardavėją į išorinį mokėjimo puslapį, po kurio parodytas banko ir incidento valdymo kelias"
  width: 1600
  height: 900
---

## 30 sekundžių taisyklė pardavėjui

Pirkėjas sako, kad prekė puiki, nesidera ir pristatymu jau pasirūpino. Jums belieka atverti kurjerio nuorodą, "priimti mokėjimą" ir patvirtinti kortelę arba banką. Puslapis atrodo pažįstamas, laikmatis tiksi, žmogus laukia atsakymo.

Sustokite ties perėjimu į išorinį puslapį.

<aside class="hx-callout warning"><strong>Nenaudokite pirkėjo atsiųstos nuorodos pinigams gauti.</strong>Marketplace atverkite per jau įdiegtą programėlę arba pačių įvestą adresą. Patikrinkite, ar joje iš tikrųjų yra pardavimas, mokėjimas ir pristatymo instrukcija. Išoriniame puslapyje neveskite kortelės, interneto banko ar Smart-ID duomenų. Jeigu jau pateikėte duomenis ar ką nors patvirtinote, nutraukite bendravimą ir nedelsdami skambinkite bankui oficialiu numeriu.</aside>

Netikro Marketplace pirkėjo phishing suveikia todėl, kad pradžia atrodo visiškai normali. Paskelbta tikra prekė. Pardavėjas tikisi žinučių. Tada tariamas pirkėjas vieną svarbų žingsnį – mokėjimą, pristatymą, paskyros patvirtinimą ar "pagalbą" – perkelia už platformos patikimo proceso ribų.

[HECAVEX Signalų apžvalgoje #5](/lt/apzvalgos/2026-08-30/) pateikta Lietuvos policijos pranešta bendra seka: žmogus Facebook paskelbė parduodamą daiktą, tariamas pirkėjas su juo susisiekė, pardavėjas atvėrė galimai netikrą puslapį ir suvedė banko duomenis, o vėliau pranešė apie 1 490 eurų nuostolį. Policijos suvestinė neįvardija URL, phishing kit ar autentifikacijos eigos. Šis vadovas tų trūkstamų faktų neprideda. Jis paaiškina pasikartojantį gynybinį modelį.

## Netikro pirkėjo schema

Žodžiai ir platforma keičiasi, bet transakcija dažnai turi tuos pačius etapus:

1. **Tikras skelbimas sukuria kontekstą.** Pardavėjas laukia pirkėjo ir pristatymo sprendimo.
2. **Pirkėjas parašo labai greitai.** Jis gali nesidomėti preke, iškart sutikti su kaina arba tvirtinti, kad jau sumokėjo.
3. **Pokalbyje atsiranda išorinis procesas.** Neva kurjeriui, mokėjimo paslaugai, bankui ar Marketplace "pagalbai" reikia pardavėjo veiksmo.
4. **Nuoroda arba QR kodas išveda iš platformos.** Jis gali ateiti pokalbyje, SMS, el. paštu arba kaip paveikslėlis.
5. **Išorinis puslapis prašo to, ko tikras pardavimas neturėtų reikalauti.** Tai gali būti kortelės duomenys, interneto banko prisijungimas, paskyros slaptažodis, vienkartinis kodas ar autentifikacijos patvirtinimas.
6. **Skuba neleidžia patikrinti savarankiškai.** Mokėjimas tuoj baigs galioti, kurjeris laukia, užsakymas bus atšauktas arba paskyra užblokuota.
7. **Duomenis gavęs žmogus tęsia pokalbį.** Pirmas bandymas neva nepavyko, todėl prašoma kitos kortelės, dar vieno patvirtinimo arba "grąžinimo" procedūros.

Kiekvienas etapas atskirai gali skambėti logiškai. Visa grandinė parodo riziką: **Marketplace pasitikėjimas panaudojamas svetainei, kurios Marketplace nekontroliuoja, patvirtinti**.

![Netikro Marketplace pirkėjo perėjimas nuo patikimos platformos pokalbio į išorinį mokėjimo ar tapatybės duomenų rinkimo puslapį](/assets/img/posts/2026-08-31-marketplace-buyer-phishing/marketplace-handoff-chain-lt.svg)

*Schema: Esminė saugumo riba peržengiama tada, kai pirkėjas mokėjimą ar pristatymą iškelia už Marketplace ribų.*

## Modeliuokite transakciją, ne pirkėjo istoriją

Tyrėjas turėtų atskirti penkis objektus, kuriuos pokalbis bando sujungti:

| Objektas | Autoritetingas šaltinis | Gynybinis klausimas |
|---|---|---|
| skelbimas ir pirkėjo kontaktas | Marketplace programėlė | ar profilis ir pokalbis egzistuoja platformos įraše? |
| užsakymas | Marketplace order būsena | ar be atsiųstos nuorodos matomas order ID, prekė, pirkėjas ir statusas? |
| pristatymas | savarankiškai pasiekta Marketplace arba kurjerio sistema | ar platforma sukūrė šią siuntą ir lipduką? |
| mokėjimas ar išmoka | Marketplace ir banko ledger | ar pinigai laukia, gauti, grąžinti, ar jų nėra? |
| autentifikacija | banko, el. pašto arba Marketplace identity telemetrija | koks prisijungimas, mokėjimas ar paskyros pakeitimas iš tikrųjų patvirtintas? |

Pirkėjas valdo pokalbį. Marketplace valdo savo order būseną. Bankas valdo paskyrą ir mokėjimo būseną. Kurjeris valdo siuntos įrašą. Patikra turi kreiptis tiesiai į autoritetingą šaltinį, o ne į pirkėjo parinktą screenshot ar svetainę.

Phishing puslapis šiuos objektus sujungia į vieną vizualią seką. Jis teigia, kad Marketplace užsakymas egzistuoja, kurjeris laukia, mokėjimas finansuotas, o bankui reikia autentifikacijos. Puslapis gali imituoti visas keturias sistemas, nors nekontroliuoja nė vieno jų ledger.

## Kodėl pardavėjo prašoma "patvirtinti" mokėjimą

Norint gauti pinigus, paprastai nereikia atskleisti apsaugos priemonių, naudojamų pinigams išleisti. Teisėta Marketplace gali prašyti paskyros nustatymų, tapatybės patikros ar išmokėjimo duomenų savo programėlėje. Tai nėra tas pats, kas nepažįstamo žmogaus puslapis, prašantis:

- viso kortelės numerio, galiojimo datos ir CVV
- interneto banko naudotojo ID ar slaptažodžio
- PIN kodų arba OTP
- Smart-ID ar Mobile-ID patvirtinimo
- nedidelio "aktyvavimo", "draudimo" ar "kurjerio" mokėjimo
- el. pašto credentials užsakymui atlaisvinti
- nuotolinės pagalbos programos.

Oficialiose Vinted [phishing atpažinimo rekomendacijose](https://www.vinted.lt/help/628-zo-herken-je-spoof-en-phishing-berichten) nurodoma, kad norint patvirtinti mokėjimą ar gauti užsakymą nereikia palikti Vinted, o checkout, pristatymą ir pokalbį rekomenduojama laikyti platformoje. Vinted taip pat įspėja dėl nuorodų, QR priedų, asmeninių duomenų prašymų ir žinučių, spaudžiančių veikti greitai.

Meta Marketplace scam atpažinimą, pardavėjų tikrinimą ir pranešimus pateikia savo [saugaus apsipirkimo rekomendacijose](https://www.facebook.com/help/123884166448529/). Konkrečios funkcijos skirtingose šalyse gali skirtis ir keistis. Pastovi taisyklė daug paprastesnė: procesą pradėkite oficialioje programėlėje, užsakymą tikrinkite joje ir neleiskite kitai pokalbio šaliai sukurti pakaitinės tvarkos.

## Išorinis kurjerio puslapis yra saugumo riba

Kurjerio pavadinimas prašymui suteikia operacinio tikrumo: reikia atspausdinti lipduką, pirkėjas jau parinko pristatymą arba pardavėjas turi priimti siuntos mokėjimą. Tačiau logotipas ir dizainas nepatvirtina, kas valdo hostą.

Nieko neatverdami užduokite tris klausimus:

1. Ar transakcija matoma oficialioje Marketplace programėlėje?
2. Ar pati platforma nurodo naudoti tokį pristatymo būdą?
3. Ar tą pačią instrukciją galima pasiekti savarankiškai atvėrus oficialią kurjerio arba Marketplace svetainę?

Jeigu atsakymas neigiamas, pirkėjo skuba nesuteikia teisėtumo. Kurjeriui nereikia jūsų interneto banko slaptažodžio. Pirkėjui nereikia kortelės CVV, kad galėtų jums sumokėti. Pagalbos darbuotojui nereikia vienkartinio autentifikacijos kodo.

Jei nuoroda atėjo SMS, išsaugojimo ir defang procesą pateikia [įtartinos SMS vadovas](/lt/tyrimai/kaip-saugiai-patikrinti-itartina-sms-nuoroda/). Gavėjui unikalaus kelio nedėkite į viešą scanner ar socialinį įrašą: URL gali būti el. paštas, telefono numeris, skelbimo ID arba vienkartinis token.

## Kortelės, banko ir Smart-ID rizika nėra vienoda

Reagavimas priklauso nuo to, kas buvo atskleista arba patvirtinta.

### Kortelės duomenys

Kortelės numeris, galiojimo data ir CVV gali būti panaudoti mokėjimams, kuriuose kortelė fiziškai nepateikiama. Nedidelis nuskaitymas gali būti tikra vagystė, kortelės patikra arba žingsnis prieš didesnę operaciją. Jei šie laukai suvesti, nedelsdami skambinkite kortelę išdavusiam bankui, prašykite ją blokuoti ar pakeisti ir peržiūrėkite naujausias operacijas. Pokalbio ištrynimas jau surinktų duomenų nepanaikina.

### Interneto banko prisijungimas

Naudotojo ID, asmens kodas ar slaptažodis gali atverti banko prisijungimo eigą. Net jei užpuolikui dar reikia papildomo faktoriaus, credentials laikykite kompromituotais. Susisiekite su banku, vykdykite jo nurodytus containment veiksmus ir iš patikimo įrenginio pakeiskite visur pakartotą slaptažodį. Nenaudokite phishing puslapio "atšaukimo" ar "refund" mygtuko.

### Marketplace ar el. pašto slaptažodis

El. pašto paskyra gali būti Marketplace, banko įspėjimų ir kitų paslaugų recovery kelias. Slaptažodį pakeiskite tik oficialioje paslaugoje, nutraukite kitas sesijas, peržiūrėkite atkūrimo duomenis, persiuntimo taisykles ir pakeistus kontaktus. Pakeiskite visas pakartotinai naudotas to paties slaptažodžio kopijas.

### Smart-ID, Mobile-ID ir vienkartiniai kodai

Autentifikacijos langas nėra nekaltas testas, kad esate žmogus. Jis patvirtina prisijungimą, parašą arba transakciją. Oficialioje Smart-ID [saugumo informacijoje](https://www.smart-id.com/security/scams/) rekomenduojama nepatvirtinti veiksmų, kurių pats naudotojas nepradėjo, ir tikrinti, kas patvirtinama. PIN kodų negalima vesti į svetainę ar perduoti pokalbyje bei telefonu.

Perskaitykite patvirtinimo tekstą: paslaugą, veiksmą, sumą, gavėją ir kontrolinį kodą. Jei tai neatitinka veiksmo, kurį savarankiškai pradėjote oficialioje programėlėje, atmeskite. Jei jau patvirtinote, nedelsdami skambinkite bankui ir pasakykite tikslų rodytą tekstą, laiką bei sumą. Vien slaptažodžio pakeitimas gali neatšaukti patvirtinto mokėjimo ar jau išduotos sesijos.

## Įspėjamieji pokalbio požymiai

Viena rašybos klaida neįrodo scam, o sklandi lietuvių kalba nepatvirtina teisėtumo. Vertinkite, kas kontroliuoja procesą:

- pirkėjas be klausimų sutinka su neįprastai didele kaina
- jis primygtinai renkasi už skelbimo ribų veikiantį kurjerį ar mokėjimą
- pokalbis perkeliamas į SMS, el. paštą, WhatsApp ar kitą paslaugą
- pinigams "gauti" būtina išorinė nuoroda arba QR kodas
- puslapis prašo mokesčio, lėšų atrakinimo ar refund patvirtinimo
- pirkėjas prašo el. pašto, telefono ar banko duomenų, kuriuos paprastai valdo platforma
- skuba pakeičia oficialioje programėlėje matomą užsakymo būseną
- "support" pasiekiamas tik per pirkėjo nuorodą
- po kiekvienos tariamos klaidos prašoma dar vieno duomens ar patvirtinimo.

Sena paskyra, profilio nuotrauka, įvertinimas ar draugiškas bendravimas gali sumažinti įtarimą, bet nepatvirtina išorinio hosto. Paskyra gali būti nauja, nukopijuota, nupirkta arba kompromituota. Vertinkite prašomą veiksmą, o ne istorijos užtikrintumą.

## Laikykite transakciją oficialiame kelyje

Saugiausias pardavėjo procesas yra tyčia nuobodus:

1. Marketplace atverkite iš įdiegtos programėlės arba patikimo bookmark.
2. Joje patikrinkite pirkėją, užsakymą, mokėjimą ir pristatymo žingsnį.
3. Naudokite tik platformoje pateiktą checkout ir siuntimo eigą.
4. Prieš pereidami į kitą svetainę perskaitykite platformos įspėjimą.
5. Neleiskite pirkėjui parinkti banko pagalbos ar paskyros atkūrimo kanalo.
6. Kilus abejonėms sustabdykite sandorį ir kreipkitės į support iš pačios programėlės.

Tikras pirkėjas gali palaukti, kol patikrinsite mokėjimą. Tikras užsakymas lieka matomas ir be pirkėjo nuorodos. Prarasti vieną pardavimą pigiau negu perduoti nepažįstamajam autentifikacijos kelią.

## Sudarykite įvykių ledger prieš blokuodami paskyrą

Nebendraukite ilgiau vien tam, kad surinktumėte daugiau įrodymų. Išsaugokite tai, kas jau gauta, tada praneškite ir blokuokite.

Seką saugokite kaip įvykių ledger. Vėliau parašytas pasakojimas neturi pakeisti timestamp.

| Įvykis | Minimalūs laukai | Tikėtinas šaltinis |
|---|---|---|
| skelbimas sukurtas | skelbimo ID, prekė, kaina, paskyra, UTC laikas | Marketplace įrašas |
| pirkėjas parašė | profilio ID ar URL, message ID, pilna žinutė, UTC laikas | chat export arba nuoseklūs screenshots |
| perduotas išorinis kelias | tikslus URL ar QR paveikslas, kanalas, message ID, UTC laikas | chat, SMS ar el. paštas |
| pasiektas puslapis | pradinio URL hash, galutinis URL, browser history laikas, screenshot, downloads | naršyklės ir įrenginio telemetrija |
| suvesti duomenys | suvestų laukų klasės, bet ne slaptos reikšmės, UTC laikas | nukentėjusiojo paaiškinimas ir autorizuota browser telemetrija |
| autentifikacijos prašymas | paslauga, veiksmas, kontrolinis kodas, suma, gavėjas, UTC laikas | Smart-ID, Mobile-ID ar banko programėlės įrašas |
| mokėjimo įvykis | transakcijos ID, statusas, suma, gavėjas, paskyra, UTC laikas | banko ledger ir perspėjimas |
| containment | kortelės blokavimas, sesijos atšaukimas, slaptažodžio keitimas, pranešimo ID, UTC laikas | banko, platformos ir incidento įrašas |

Naudinga papildomai išsaugoti:

- visą chat export arba nuoseklias ekrano kopijas, ne vieną iškirptą žinutę
- profilio vardą, profilio URL ar nario ID ir skelbimo URL
- tikslų žinučių laiką bei naudotą platformą
- originalų URL ar QR paveikslėlį privačiame įrodymų rinkinyje
- defangintą ir nuo asmens duomenų išvalytą kopiją kasdieniam dalijimuisi
- el. pašto arba SMS siuntėją ir laiško antraštes, jei jos prieinamos
- išorinio puslapio screenshot, nevedant daugiau duomenų
- banko perspėjimus, operacijos laiką, sumą, gavėją ir mokėjimo paskirtį
- tikslų Smart-ID, Mobile-ID ar OTP lango tekstą ir laiką
- ką suvedėte, atsisiuntėte arba patvirtinote
- Marketplace, bankui, NKSC ir policijai pateiktų pranešimų informaciją.

Neviešinkite aukos el. pašto, telefono, užsakymo token, kortelės skaitmenų ar transakcijos ID. Tvarkingame evidence pakete privati incidento medžiaga atskiriama nuo sanitizuoto indikatoriaus, kuriuo galima dalytis su saugumo komanda.

Chat export, screenshot ir browser history failų hash skaičiuokite jiems patekus į case saugyklą. Originalus laikykite read-only ir užrašykite, kas bei kada juos surinko. Pokalbio screenshot naudingas, tačiau platformos export su stabiliais ID ir timestamp yra stipresnis, jei tokia funkcija prieinama. Jei export nėra, naudokite nuoseklius kadrus su matomu paskyros kontekstu ir laiku.

Organizacijos valdomame įrenginyje secure web gateway, DNS, endpoint, browser ir identity įrašus koreliuokite pagal naudotoją ir UTC laiką. Redirect hostas gali likti web telemetrijoje, autentifikacija identity loguose, o mokėjimas tik banko ledger. Nė viena sistema neturi visos grandinės.

![Marketplace phishing įrodymų žurnalas, pagal identifikatorius ir laiką sujungiantis pokalbį, žiniatinklio kelią ir finansinius įrašus](/assets/img/posts/2026-08-31-marketplace-buyer-phishing/marketplace-evidence-ledger-lt.svg)

*Schema: Vienas žurnalas sulygiuoja skirtingus identifikatorius ir laikrodžius, bet neapsimeta, kad visa seka matoma viename šaltinyje.*

## Skubūs veiksmai suvedus duomenis ar patvirtinus operaciją

[Lietuvos bankas nukentėjusiems](https://www.lb.lt/lt/pakliuvau-sukciams-ka-daryti) pirmiausia rekomenduoja nutraukti bendravimą su sukčiais ir nedelsiant kreiptis į mokėjimo paslaugų teikėją. Bankas dar gali sustabdyti dalį mokėjimų, o atskleisti kortelės duomenys reikalauja greito blokavimo.

| Kas įvyko | Pirmi veiksmai |
|---|---|
| nuoroda atverta, nieko nesuvesta ir neįdiegta | užverkite, išsaugokite laiką ir hostą, patikrinkite downloads bei leidimus, praneškite apie URL |
| suvesti kortelės duomenys | skambinkite bankui, blokuokite ar keiskite kortelę, peržiūrėkite operacijas ir perspėjimus |
| suvesti interneto banko credentials | skambinkite bankui, vykdykite paskyros containment nurodymus, patikimame įrenginyje pakeiskite kartotus slaptažodžius |
| patvirtintas Smart-ID, Mobile-ID, OTP ar mokėjimas | nedelsdami skambinkite bankui, tiksliai pasakykite, kas ir kada patvirtinta, klauskite dėl mokėjimo stabdymo bei prieigos apsaugos |
| suvestas Marketplace ar el. pašto slaptažodis | pakeiskite oficialioje paslaugoje, atšaukite sesijas, tikrinkite recovery nustatymus ir saugokite kitas paskyras |
| įdiegtas failas, profilis ar remote-support programa | nebenaudokite įrenginio bankui, jei saugu – atjunkite tinklą, iš kito įrenginio kreipkitės į IT ar incident response |
| pervesti ar prarasti pinigai | pirmiausia susisiekite su banku, tada su išsaugotais transakcijos įrodymais praneškite policijai |

Nesigėdykite paspaudimo. Tikslus laikas yra vertingesnis už gražesnę istoriją. Bankui arba saugumo komandai pasakykite, kas tiksliai įvyko, įskaitant patvirtinimus, kurie atrodė nesėkmingi.

![Reagavimo į Marketplace phishing šakos po paspaudimo, kortelės atskleidimo, autentifikacijos, mokėjimo ar įrenginio paveikimo](/assets/img/posts/2026-08-31-marketplace-buyer-phishing/marketplace-response-branches-lt.svg)

*Schema: Pirmas veiksmas priklauso nuo atskleisto turto ir atliekamas dar prieš papildomą puslapio tyrimą.*

## Kur pranešti Lietuvoje

Kiekvieną sluoksnį perduokite šaliai, kuri gali jame veikti:

1. **Marketplace:** programėlės reporting funkcija praneškite profilį, žinutę, skelbimą ir išorinę nuorodą. Vinted prašo pridėti screenshots, nario duomenis, siuntėjo informaciją ir banko pavedimo duomenis, jei jie svarbūs.
2. **Bankas arba mokėjimo paslaugų teikėjas:** naudokite numerį oficialioje programėlėje, kortelėje arba savarankiškai pasiektoje svetainėje.
3. **NKSC:** [centriniame pranešimų puslapyje](https://www.nksc.lt/pranesti.html) pasirinkite pranešimą apie phishing svetainę, įtartiną žinutę arba kibernetinį incidentą. Tikslų URL pateikite tam skirtoje formoje, ne viešame komentare.
4. **Policija:** jei pavogti pinigai ar duomenys, praneškite per [ePolicija](https://www.epolicija.lt/) ir išsaugokite įvykio numerį bei priedus.
5. **Kurjeris ar kitas apsimetamas prekės ženklas:** kreipkitės per oficialų abuse arba support kanalą, ne per kontaktus įtartiname puslapyje.

[HECAVEX Radar](https://radar.hecavex.com/lt/) gali rodyti atrinktus Lietuvos prekių ženklų impersonation kandidatus, tačiau tai nėra pagalbos nukentėjusiems ar automatinio verdikto paslauga. Tai, kad domeno Radar nėra, neįrodo jo saugumo.

## False-positive kontrolė ir praktinis patvirtinimas

Atsargus pirkėjas, išorinis kurjeris ir prašymas naudoti platformos funkciją gali būti teisėti. Nevadinkite žmogaus sukčiumi vien todėl, kad paskyra nauja, kalba netaisyklinga ar transakcija skubi.

Workflow tikrinkite per nepriklausomą būseną:

1. be atsiųstos nuorodos atverkite Marketplace programėlę ir raskite order ID
2. patikrinkite mokėjimo statusą Marketplace ledger ir, jei aktualu, banko ledger
3. kurjerį pasiekite per oficialią programėlę arba ranka įvestą domeną ir raskite siuntą
4. palyginkite prašomą veiksmą su platformos paskelbtu procesu
5. patikrinkite, ar autentifikacijos prašymas atitinka pardavėjo savarankiškai pradėtą veiksmą.

Case laikykite didelės rizikos, kai pirkėjo kelias yra vienintelė vieta, kur egzistuoja užsakymas, pristatymas ar mokėjimas, ypač jei prašoma paslapties arba patvirtinimo. Phishing incidentą laikykite patvirtintu, kai išsaugotas turinys apsimeta paslauga ir prašo credentials, kortelės duomenų ar nesusijusio patvirtinimo. Finansinį poveikį patvirtinkite tik banko arba mokėjimo paslaugos įrašu.

Teisėta išorinė paslauga automatiškai nepatvirtina pirkėjo. Open redirect, kompromituota svetainė ar išnaudota forma gali įtraukti atpažįstamą domeną į grandinę. Ir atvirkščiai, naujas domenas yra kontekstas, bet ne įrodymas. Prašoma transakcija ir autoritetingi ledger turi didesnį svorį negu domeno amžius ar vizualinė kokybė.

## Ko vienas pranešimas nepatvirtina

Pokalbis ir phishing puslapis gali patvirtinti praneštą kelią bei prašytą veiksmą. Jie automatiškai neįrodo platesnės kampanijos, operatoriaus šalies, paskyros savininko, Marketplace ar kurjerio kompromitavimo ir bendro aukų skaičiaus. Shared hosting, populiarus puslapio šablonas ar tas pats mokėjimo logotipas atribucijai nepakankami.

Naudokite tikslią kalbą: "tariamas pirkėjas atsiuntė", "pardavėjas pranešė", "puslapis prašė", "banko įspėjime nurodyta" ir "nenustatyta". Atskirkite Marketplace paskyrą, redirect paslaugą, galutinį puslapį, mokėjimo gavėją ir juos valdantį asmenį. Jie gali būti susiję, bet kiekvieną ryšį turi parodyti įrodymai.

## Pardavėjo kontrolinis sąrašas

- [ ] Užsakymas ir mokėjimas matomi oficialioje Marketplace programėlėje.
- [ ] Pristatymo instrukciją pateikė platforma, ne vien pirkėjas.
- [ ] Išoriniame puslapyje nevesti kortelės, banko, el. pašto ar Marketplace credentials.
- [ ] Autentifikacijos prašymas nepatvirtintas, jei jo savarankiškai nepradėjote ir visiškai nesupratote.
- [ ] Pirkėjo nuoroda ar QR kodas nenaudoti pinigams "gauti".
- [ ] Įtartinas pokalbis, profilis, URL ir laikas išsaugoti prieš blokavimą.
- [ ] Atskleisti finansiniai duomenys ar patvirtinimai nedelsiant pranešti bankui.
- [ ] Marketplace ir NKSC gavo jiems svarbius phishing įrodymus.
- [ ] Finansinis nuostolis praneštas policijai.
- [ ] Viešai dalijami tik defanginti indikatoriai be aukos token ir asmens duomenų.

## Šaltiniai ir susijusi medžiaga

1. [Panevėžio policija: 2026 m. rugpjūčio 26 d. įvykių suvestinė](https://panevezys.policija.lrv.lt/lt/ivykiu-suvestines/2026-08-26-suvestine-4zp7/)
2. [Vinted: kaip atpažinti ir pranešti phishing](https://www.vinted.lt/help/628-zo-herken-je-spoof-en-phishing-berichten)
3. [Meta Help Center: saugaus apsipirkimo patarimai](https://www.facebook.com/help/123884166448529/)
4. [Smart-ID: scam ir saugumo rekomendacijos](https://www.smart-id.com/security/scams/)
5. [Lietuvos bankas: ką daryti pakliuvus sukčiams](https://www.lb.lt/lt/pakliuvau-sukciams-ka-daryti)
6. [NKSC: pranešti apie phishing svetainę, žinutę ar incidentą](https://www.nksc.lt/pranesti.html)
7. [HECAVEX Signalų apžvalga #5](/lt/apzvalgos/2026-08-30/)
8. [HECAVEX: kaip saugiai patikrinti įtartiną SMS nuorodą](/lt/tyrimai/kaip-saugiai-patikrinti-itartina-sms-nuoroda/)

_Šis vadovas skirtas gynybai, prevencijai, įrodymų išsaugojimui ir incidento valdymui. Be konkretaus atvejo įrodymų jis nenustato, kad konkreti paskyra ar nuoroda yra apgaulinga._
