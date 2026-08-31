---
title: "Suvedėte banko duomenis phishing puslapyje? Veikite dabar"
card_title: "Ką daryti po bankinio phishing"
description: "Skubi veiksmų seka, kai phishing puslapyje atskleisti kortelės ar banko duomenys, Smart-ID PIN, OTP kodas, sesija, atliktas pavedimas arba įdiegta programa."
seo_title: "Suvedžiau banko duomenis phishing puslapyje: ką daryti?"
seo_description: "Skubus planas po bankinio phishing: kortelės blokavimas, banko prisijungimas, Smart-ID, OTP, pavedimai, sesijos, įdiegtos programos ir pranešimas Lietuvoje."
seo_keywords:
  - "suvedžiau banko duomenis phishing puslapyje"
  - "ką daryti po phishing"
  - "bankinis phishing"
  - "Smart-ID phishing"
  - "pavogti kortelės duomenys"
  - "pranešti apie phishing Lietuvoje"
date: 2026-08-31 18:25:00 +0300
lang: lt
translation_key: post-phishing-banking-response
permalink: /lt/tyrimai/ka-daryti-suvedus-banko-duomenis-phishing-puslapyje/
author: deividas-lis
content_type: technical-guide
publication_class: technical-assessment
confidence: high
tlp: clear
categories: [fraud-scams, identity-security, social-engineering]
tags: [phishing, smishing, incident response, payment fraud, identity security, Smart-ID, Lithuania]
featured: false
draft: false
published: true
toc: true
comments: false
prose_width: wide
scope: "Skubūs gynybiniai veiksmai, kai žmogus phishing puslapyje suveda banko, kortelės ar autentifikavimo duomenis, patvirtina apgaulingą veiksmą arba įdiegia pasiūlytą programą."
limitations: "Šis gidas negali nustatyti, ar bankas sugrąžins konkrečią operaciją, ar įrenginys tikrai kompromituotas ir kokios sutartinės ar teisinės priemonės taikomos. Tai sprendžiama pagal konkretaus incidento įrodymus."
methods:
  - "Oficialių rekomendacijų peržiūra"
  - "Incidento skirstymas pagal atskleistą turtą"
  - "Paskyros ir įrenginio izoliavimo modeliavimas"
  - "Įrodymų išsaugojimo ribų vertinimas"
evidence_basis: "Dabartinės Lietuvos banko, Nacionalinio kibernetinio saugumo centro, Smart-ID ir Jungtinės Karalystės NCSC rekomendacijos bei susiję HECAVEX tyrimai."
key_findings:
  - "Pirmiausia paprastai reikia kreiptis į banką ar mokėjimo paslaugų teikėją nepriklausomai patikrintu kanalu, nes laikui bėgant mokėjimą sustabdyti ar atšaukti tampa sunkiau."
  - "Veiksmai priklauso nuo to, kas atskleista: kortelės duomenys, banko prisijungimas, pakartotinai naudojamas slaptažodis, autentifikavimo patvirtinimas, sesija, pavedimas ir įdiegta programa yra skirtingi incidentai."
  - "Vien slaptažodžio pakeitimas nebūtinai nutraukia pavogtas sesijas, atšaukia patikimus įrenginius, susigrąžina mokėjimą ar pašalina įrenginyje įdiegtą prieigą."
  - "Žinutę, URL ir operacijos duomenis reikia išsaugoti negrįžtant į phishing puslapį ir neatidėliojant incidento izoliavimo."
image:
  path: /assets/img/posts/2026-08-31-post-phishing-banking-response/post-phishing-banking-response-hero.svg
  social: /assets/img/social/post-phishing-banking-response-lt.png
  alt: "Skubūs veiksmai po phishing, kai atskleista kortelė, banko autentifikavimas, sesija, pavedimas ar įrenginys"
  thumbnail: /assets/img/posts/2026-08-31-post-phishing-banking-response/post-phishing-banking-response-hero.svg
  width: 1600
  height: 900
---

## Pirmiausia izoliuokite incidentą, tik tada analizuokite puslapį

Jeigu banko duomenis ką tik suvedėte phishing puslapyje, dabar svarbiau greitai apsaugoti paskyrą negu įrodyti, kaip veikė tas puslapis. Nutraukite pokalbį su siuntėju. Netvirtinkite jokios naujos Smart-ID, Mobile-ID, banko programėlės ar vienkartinio kodo užklausos, net jei skambinantis žmogus aiškina, kad dar vienas patvirtinimas „atšauks“ pirmąjį.

Jeigu įmanoma, naudokite kitą patikimą įrenginį. Atidarykite oficialią banko programėlę, adresą įrašykite patys, skambinkite ant kortelės nurodytu numeriu arba kontaktą raskite oficialioje banko svetainėje. Nenaudokite numerio, kurį pateikė įtartina žinutė ar puslapis.

<aside class="hx-callout warning"><strong>Skubus sąrašas</strong>1. Nepriklausomai patikrintu kanalu susisiekite su banku ar mokėjimo paslaugų teikėju. 2. Tiksliai pasakykite, ką suvedėte arba patvirtinote. 3. Paprašykite blokuoti susijusią mokėjimo priemonę, apsaugoti interneto banką, peržiūrėti aktyvias sesijas ir, jei taikoma, bandyti atšaukti mokėjimą. 4. Iš švaraus įrenginio pakeiskite paveiktus ir kitur kartotus slaptažodžius. 5. Išsaugokite įrodymus neatverdami phishing puslapio iš naujo. 6. Apie pinigų praradimą ar bandymą juos pavogti praneškite policijai, o apie phishing žinutę ar svetainę – NKSC.</aside>

[Lietuvos banko rekomendacijose nukentėjusiems](https://www.lb.lt/lt/pakliuvau-sukciams-ka-daryti) mokėjimo paslaugų teikėjas yra pirmas žingsnis, nes jis dar gali sustabdyti pavedimą, užblokuoti kortelę ar apriboti paskyrą. Atskirame [Lietuvos banko pranešime apie mokėjimo operacijų atšaukimą](https://www.lb.lt/lt/naujienos/lietuvos-bankas-finansu-istaigos-turi-aktyviai-ir-greitai-reaguoti-i-klientu-prasymus-atsaukti-mokejimo-operacijas) pabrėžiama greitos reakcijos svarba. Pranešimas negarantuoja pinigų grąžinimo, tačiau delsimas gali panaikinti dar likusias galimybes.

### Bankui pasakykite faktus, o ne vien „tapau phishing auka“

Paruoškite trumpą įvykių santrauką:

- kada gavote žinutę, paspaudėte, prisijungėte, patvirtinote ar atlikote pavedimą
- kuri banko paskyra, kortelė ar paslauga paveikta
- ar suvedėte kortelės numerį, galiojimo datą ir CVV
- ar suvedėte interneto banko naudotojo vardą, kodą ar slaptažodį
- ar atskleidėte Smart-ID PIN1, PIN2, Mobile-ID PIN arba SMS gautą kodą
- ar patvirtinote prisijungimą arba mokėjimą ir kokią sumą bei gavėją rodė patvirtinimo ekranas
- ar pinigai išėjo, buvo pridėtas gavėjas, pakeisti kontaktai arba atsirado naujas patikimas įrenginys
- ar įdiegėte programėlę, naršyklės plėtinį, konfigūracijos profilį, nuotolinės pagalbos įrankį arba failą.

Šios detalės keičia reagavimą. „Atidariau nuorodą“ ir „su PIN2 patvirtinau 1 900 eurų pavedimą“ nėra tas pats incidentas.

## Veiksmą parinkite pagal tai, kas buvo atskleista

| Kas įvyko | Ką daryti iš karto | Kokia rizika lieka |
| --- | --- | --- |
| Nuoroda atidaryta, bet niekas nesuvestas ir neįdiegta | uždarykite, išsaugokite žinutę, teiginį patikrinkite oficialiu kanalu, stebėkite tolesnius bandymus | sekimas, nauja socialinė inžinerija arba nepastebėtas atsisiuntimas |
| Suvestas kortelės numeris, galiojimo data ir CVV | paprašykite banko kortelę laikinai sustabdyti ar užblokuoti ir pakeisti, peržiūrėkite rezervacijas bei skaitmenines pinigines | pirkimai be fizinės kortelės, maži testiniai ir vėlesni mokėjimai |
| Suvesti interneto banko prisijungimo duomenys | su banku apsaugokite interneto banką, švariame įrenginyje pakeiskite slaptažodį, atšaukite sesijas ir nežinomus patikimus įrenginius | prisijungimai, profilio pakeitimai, nauji gavėjai ir sesijos panaudojimas |
| Suvestas kitur kartojamas slaptažodis | pirmiausia pakeiskite jį svarbiausioje paveiktoje paskyroje, tada visur, kur kartojote | bandymai prisijungti prie el. pašto, parduotuvių, socialinių tinklų ir darbo sistemų |
| Atskleistas Smart-ID PIN, Mobile-ID PIN, OTP ar patvirtinta push užklausa | kreipkitės į banką ir autentifikavimo paslaugos teikėją, nustatykite, ką patvirtinote, vykdykite blokavimo ar registravimo iš naujo nurodymus | užbaigtas prisijungimas, pakeitimas, parašas ar mokėjimas, o ne tik „nutekėjęs kodas“ |
| Galėjo būti pavogta prisijungusi sesija | atsijunkite visuose įrenginiuose, atšaukite patikimus įrenginius ir žetonus, peržiūrėkite saugumo įvykius | prieiga gali tęstis net pakeitus slaptažodį |
| Pavedimas ar kortelės mokėjimas atliktas | nedelsdami prašykite sustabdyti ar atšaukti, išsaugokite operacijos ID, gavėją, sumą ir laiką, praneškite policijai | pinigų pervedimas toliau, išgryninimas ir pakartotinis „susigrąžinimo“ sukčiavimas |
| Įdiegta programėlė, profilis, plėtinys ar nuotolinės prieigos įrankis | atjunkite įrenginį nuo tinklo, nebenaudokite jo bankui, kreipkitės į IT ar kvalifikuotą specialistą | slaptažodžių rinkimas, išliekanti prieiga, ekrano valdymas ir naujų duomenų vagystė |

Todėl bendras patarimas „pakeisk slaptažodį“ yra nepakankamas. Slaptažodžio pakeitimas automatiškai nepakeičia kortelės, neatšaukia pavedimo, nebūtinai nutraukia visas sesijas ir nepašalina įrenginyje paliktos prieigos.

## Kortelės duomenys: pakeisti saugiau negu tik stebėti

Kortelės numerio, galiojimo datos ir CVV pakanka daugeliui atsiskaitymų, kuriems fizinė kortelė nereikalinga. Nusikaltėlis gali pirmiausia atlikti mažą testinę rezervaciją, o didesnį mokėjimą bandyti vėliau. Jeigu banko programėlė leidžia, kortelę laikinai sustabdykite, tačiau vis tiek susisiekite su banku ir vykdykite jo nurodymus dėl blokavimo ar pakeitimo. Patikrinkite, ar kortelė nepridėta prie nežinomos mobiliosios piniginės ir ar nėra laukiančių rezervacijų.

Neviešinkite ekrano nuotraukos su visu kortelės numeriu. Bankui paveiktą kortelę nurodykite autentifikuotame kanale. Stebėkite išrašą ir vėliau, nes tai, kad mokėjimo iš karto nematyti, nereiškia, kad duomenys nebuvo surinkti.

## Interneto bankas ir kitur kartojami slaptažodžiai

Interneto banko slaptažodį keiskite oficialioje programėlėje ar savarankiškai įvestu banko adresu. Geriausia tai daryti įrenginyje, kuriuo phishing puslapis nebuvo atvertas ir iš kurio nieko neįdiegėte. Jeigu paslauga turi saugumo skiltį, nutraukite visas sesijas, pašalinkite nežinomus įrenginius, peržiūrėkite kontaktus, naujus gavėjus ir suplanuotus mokėjimus.

Jeigu tą patį slaptažodį naudojote el. paštui, pakeiskite ir jį. El. paštas dažnai yra kitų paskyrų atkūrimo kanalas. Tada pakeiskite slaptažodį visose kitose vietose, kur jis buvo kartojamas. Pirmumas tenka bankui, el. paštui, valstybės paslaugoms, darbui, debesijos saugykloms ir mobiliojo ryšio paskyrai. Slaptažodžių tvarkyklė leidžia kiekvienai paslaugai turėti atskirą reikšmę.

Slaptažodžio „pakeitimas“ tame pačiame phishing puslapyje arba per vėliau to paties „specialisto“ atsiųstą nuorodą nieko neizoliuoja. Grįžkite tik į nepriklausomai rastą oficialų kanalą.

## Smart-ID, OTP ir MFA: išsiaiškinkite, ką patvirtinote

Papildomas autentifikavimo veiksnys nėra universalus saugumo antspaudas. Adversary-in-the-middle puslapis gali realiu laiku perduoti prisijungimą į tikrą paslaugą ir paprašyti aukos patvirtinti tikrą užklausą. Svarbus klausimas yra ne „ar MFA suveikė?“, o „kokį veiksmą tas patvirtinimas leido atlikti?“ Apie perduodamas sesijas ir patvirtinimus plačiau rašoma analizėje [kodėl MFA nėra panacėja](/lt/tyrimai/mfa-nera-panaceja-ir-laikas-nustoti/).

[Smart-ID rekomendacijose apie sukčiavimą](https://www.smart-id.com/lt/security/scams/) nurodoma niekam neatskleisti PIN ir kreiptis į banką bei policiją, jeigu galėjo būti pasiekta sąskaita ar autentifikavimo priemonė. Netikėtą užklausą atmeskite. Telefone rodomą kontrolinį kodą, paslaugos pavadinimą ir operaciją palyginkite su veiksmu, kurį patys pradėjote. PIN1 paprastai skirtas autentifikavimui, PIN2 – pasirašymui, tačiau sprendimą lemia ekrane rodomas operacijos kontekstas.

Jeigu PIN suvedėte netikrame puslapyje, patvirtinote neprašytą užklausą arba užklausos kartojasi, kreipkitės į banką ir Smart-ID pagalbą. Vykdykite jų nurodymus dėl blokavimo ar registravimo iš naujo. Netvirtinkite dar kartą „kad atšauktumėte“. Antras patvirtinimas yra dar vienas autorizuotas veiksmas.

## Pavogta sesija gali išlikti pakeitus slaptažodį

Kai kurie phishing puslapiai veikia kaip tarpininkas tarp aukos ir tikros svetainės. Jie perima jau po MFA sukurtą autentifikuotą sesiją. Kiti įtikina užregistruoti naują įrenginį ar atiduoti atkūrimo kodą. Tokiu atveju užpuolikas gali turėti sesijos slapuką ar patikimo įrenginio žetoną, o ne daugkartinį slaptažodį.

Naudokite funkciją „atsijungti visur“, atšaukite sesijas, pašalinkite nepažįstamus įrenginius, atnaujinkite atkūrimo kodus ir peržiūrėkite naujausius saugumo įvykius. Banko paklauskite, ar jis gali centralizuotai panaikinti interneto banko sesijas. Jeigu dalyvavo el. pašto ar mobiliojo ryšio paskyra, sesijas atšaukite ir ten. Phishing svetainė gali dingti, o pavogta sesija likti veikianti.

## Pavedimai: nedelsdami prašykite sustabdyti ar atšaukti

Pirmiausia kreipkitės į mokėjimo paslaugų teikėją, o tik paskui skirkite laiką ekrano nuotraukoms, domeno registracijai ar viešam URL skenavimui. Nurodykite operacijos ID, sumą, valiutą, gavėją, laiką ir gavėjo finansų įstaigą, jei ji matoma. Paklauskite, ar mokėjimas dar laukia vykdymo, ar jį galima sustabdyti arba inicijuoti atšaukimą per gavėjo įstaigą. Užsirašykite banko bylos numerį.

Išsaugokite patvirtinimo ekraną ir išrašo įrašą. Nesusisiekite su gavėju naudodami nusikaltėlio pateiktus kontaktus. Nemokėkite „pinigų susigrąžinimo specialistui“, žadančiam garantuotą rezultatą. Nukentėję žmonės dažnai puolami dar kartą, apsimetant banku, policija, teisininku ar kriptoturto „atkūrėju“.

## Įdiegtos programėlės, profiliai ir nuotolinė prieiga

Jeigu puslapis liepė įdiegti programėlę, APK, naršyklės plėtinį, konfigūracijos profilį, sertifikatą, „saugumo atnaujinimą“ ar nuotolinės pagalbos įrankį, laikykite įrenginį galimai kompromituotu. Atjunkite Wi-Fi ir mobiliuosius duomenis. Jei turite kitą įrenginį, šiuo nebekeičiate slaptažodžių ir nebesijunkite prie banko.

Užrašykite programos ar failo pavadinimą, šaltinį, diegimo laiką ir prašytus leidimus. Darbo įrenginio nevalykite savarankiškai – nedelsdami praneškite IT ar saugumo komandai. Asmeniniam įrenginiui kreipkitės kvalifikuotos pagalbos arba vadovaukitės platformos gamintojo atkūrimo rekomendacijomis, įskaitant nežinomų įrenginio valdymo profilių pašalinimą ar atkūrimą, kai jis būtinas. Vien programėlės ištrynimas neįrodo, kad visa prieiga pašalinta.

[Jungtinės Karalystės NCSC phishing reagavimo rekomendacijos](https://www.ncsc.gov.uk/section/respond-recover/phishing) taip pat atskiria paprastą paspaudimą nuo atskleisto slaptažodžio, banko duomenų ir įdiegtos programos. Įdiegus programą rekomenduojamas visas antivirusinis patikrinimas, o darbo įrenginį reikia perduoti organizacijos IT. Jų pranešimo kanalai skirti Jungtinei Karalystei, Lietuvos kanalai pateikti toliau.

## Įrodymus saugokite negrįždami į puslapį

Izoliavimas yra pirmas, tačiau kompaktiškas įrodymų paketas padeda bankui, policijai ir incidento tyrėjams. Išsaugokite:

- visą žinutę ir rodomą siuntėją
- gavimo laiką ir laiko juostą
- tikslų originalų URL privačiai ir neutralizuotą kopiją dalijimuisi
- jau padarytas žinutės, phishing puslapio ir patvirtinimo ekrano nuotraukas
- tariamo „banko darbuotojo“ skambučių ir žinučių duomenis
- operacijų ID, gavėjus, sumas ir paskyros įspėjimus
- atsisiųstų failų vardus bei hash, jeigu juos saugiai gali surinkti specialistas
- banko, policijos ir NKSC registracijos numerius.

Neatidarykite nuorodos dar kartą vien dėl geresnės nuotraukos. Nesiųskite netikrų prisijungimų, neprovokuokite operatoriaus ir neviešinkite gavėjui unikalaus URL skenavimo tarnyboje. SMS nuorodos žetonas gali identifikuoti konkretų gavėją. [Įtartinos SMS nuorodos tikrinimo gidas](/lt/tyrimai/kaip-saugiai-patikrinti-itartina-sms-nuoroda/) paaiškina neutralizavimą, trumpųjų nuorodų atskleidimą ir cloaking ribas. [UNIPARK smishing tyrimas](/lt/tyrimai/unipark-smishing-infrastrukturos-tyrimas/) rodo, kodėl tvarkingas puslapis, HTTPS ir pažįstamas prekės ženklas nepatvirtina paskirties.

## Kur pranešti Lietuvoje

Nelaukite, kol viena institucija atsakys kitai. Veikite tokia seka:

1. **Bankas ar mokėjimo paslaugų teikėjas:** apsaugoti mokėjimo priemonę ir paskyrą, prašyti sustabdyti ar atšaukti operaciją.
2. **Lietuvos policija:** apie pinigų praradimą, bandymą juos pavogti ar tapatybės panaudojimą pranešti per [ePolicija](https://www.epolicija.lt/) arba skubios grėsmės atveju naudoti atitinkamą skubios pagalbos kanalą.
3. **Nacionalinis kibernetinio saugumo centras:** [NKSC pranešimo puslapyje](https://www.nksc.lt/pranesti.html) galima pateikti įtartiną svetainę, melagingą žinutę ar skambutį arba kibernetinį incidentą. NKSC sukčiavimo aukas nukreipia ir į policiją, o abejojantiems dėl formos pateikia `cert@nksc.lt`.
4. **Darbdavys ar paslaugos savininkas:** pranešti, jeigu dalyvavo darbo paskyra ar įrenginys, ir informuoti imituojamą organizaciją patikrintu saugumo kanalu.

Tas pats įrodymų rinkinys gali būti naudingas keliems pranešimams, tačiau jų funkcijos skiriasi. Bankas saugo mokėjimus, policija tiria nusikaltimą, NKSC priima kibernetinius pranešimus, o darbdavys saugo savo aplinką.

## Stebėkite ir po pirmojo skambučio

Artimiausiomis dienomis tikrinkite banko operacijas, kortelės rezervacijas, kontaktų pakeitimus, naujus gavėjus, slaptažodžio atkūrimo laiškus, Smart-ID ar banko programėlės užklausas, nepažįstamus įrenginius ir mobiliojo ryšio pasikeitimus. Įjunkite prisijungimo ir operacijų įspėjimus. Stebėkite el. paštą, nes per jį gali būti atkuriamos kitos paskyros.

Saugokite bylų numerius ir savo veiksmų laiko juostą. Jeigu jau apsaugojote paskyrą, o skambinantis žmogus aiškina, kad incidentas vis dar „neuždarytas“, padėkite ragelį ir pats susisiekite su įstaiga. Tikram darbuotojui nereikia jūsų PIN, OTP ar naujo patvirtinimo, kad „grąžintų“ pinigus.

Svarbiausia taisyklė paprasta: **reaguokite į atskleistą turtą, o ne į phishing puslapio išvaizdą**. Pirmiausia bankas, tada autentifikavimo ir sesijų izoliavimas, galimai paveikto įrenginio atjungimas, įrodymų išsaugojimas ir oficialūs pranešimai.

## Oficialios rekomendacijos ir šaltiniai

- [Lietuvos bankas: duomenų viliojimas](https://www.lb.lt/lt/duomenu-viliojimas)
- [Lietuvos bankas: pakliuvau sukčiams – ką daryti?](https://www.lb.lt/lt/pakliuvau-sukciams-ka-daryti)
- [Lietuvos bankas: finansų įstaigos turi greitai reaguoti į prašymus atšaukti operacijas](https://www.lb.lt/lt/naujienos/lietuvos-bankas-finansu-istaigos-turi-aktyviai-ir-greitai-reaguoti-i-klientu-prasymus-atsaukti-mokejimo-operacijas)
- [NKSC: pranešti apie kibernetinį įvykį](https://www.nksc.lt/pranesti.html)
- [Smart-ID: saugumas ir sukčiavimas](https://www.smart-id.com/lt/security/scams/)
- [Jungtinės Karalystės NCSC: reagavimas į phishing](https://www.ncsc.gov.uk/section/respond-recover/phishing)
