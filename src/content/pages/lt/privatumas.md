---
layout: page
lang: lt
translation_key: privacy
title: Privatumas
description: HECAVEX privatumo, naršyklės saugyklos ir lankomumo matavimo politika.
permalink: /lt/privatumas/
---

Atnaujinta 2026 m. rugpjūčio 23 d.

## Taikymo sritis

Šis pranešimas apima viešą HECAVEX svetainių rinkinį: `hecavex.com`, `apt.hecavex.com`, `radar.hecavex.com` ir `labs.hecavex.com`. Kiekviena svetainė diegiama atskirai ir įkelia savo matavimo kodą.

Toliau aprašytas rankiniu būdu įdiegtas „Cloudflare Web Analytics“ matavimo kodas veikia visų keturių svetainių produkcinėse versijose. Jos naudoja tą pačią viešą svetainės žymą, todėl apibendrintus matavimus galima peržiūrėti kartu. Paspaudus svetainių rinkinio nuorodą kodas ar išsaugota būsena neperkeliami iš vienos svetainės į kitą; paskirties svetainė įkelia savo kodą. Labs taip pat turi atskirą, toliau aprašytą tik naršyklėje veikiančią darbo erdvę.

## Slapukai ir naršyklės saugykla

Pagrindinė publikacija nenustato pirmosios šalies reklaminių ar analitikos slapukų, nenaudoja rinkodaros pikselių, neįrašinėja sesijų ir nekuria lankytojų paskyrų. Jos sąsaja šiuo metu nesaugo kalbos ar privatumo pranešimo pasirinkimų `localStorage`; ankstesnis tokių reikšmių aprašymas buvo pasenęs ir pašalintas.

[„Cloudflare“ RUM matavimo kodo dokumentacijoje nurodo](https://developers.cloudflare.com/speed/observatory/rum-beacon/), kad jos Web Analytics kodas neskaito ir nerašo slapukų, `localStorage`, `sessionStorage` ar IndexedDB ir naršyklėje nesaugo nuolatinio analitikos identifikatoriaus. Konkretaus puslapio matavimas sukuriamas atmintyje ir susijęs su tuo metu peržiūrimu puslapiu.

HECAVEX Labs yra svetainių rinkinio išimtis. Jos ATT&CK darbo erdvė lankytojo įrenginio `localStorage` saugo pasirengimo vertinimus, incidentų laiko juostas, stebėjimų juodraščius ir jų darbo erdvės metaduomenis. Darbo erdvė šiuos duomenis naudoja vietoje ir išsaugotos darbo erdvės HECAVEX nesiunčia. Duomenys lieka, kol lankytojas juos išvalo Labs valdikliu arba pašalina svetainės duomenis naršyklėje.

## „Cloudflare Web Analytics“

Visos keturios produkcinės svetainės iš `static.cloudflareinsights.com` įkelia kliento pusėje veikiantį matavimo kodą. Jis „Cloudflare“ siunčia realių naudotojų puslapių veikimo ir apibendrintus lankomumo matavimus. Priklausomai nuo konkrečios svetainės pateikimo būdo, duomenys perduodami jos `/cdn-cgi/rum` adresu arba į `cloudflareinsights.com`.

Matavimai gali apimti:

- puslapių peržiūras, apsilankymus, hostą ir puslapio ar pirmojo puslapio kelią be užklausos parametrų;
- naršyklės pateiktą nukreipiančios svetainės ar puslapio informaciją;
- šalį, įrenginio tipą, naršyklę, operacinę sistemą ir navigacijos tipą;
- puslapio įkėlimo, išteklių veikimo ir „Core Web Vitals“ matavimus.

[„Cloudflare“ duomenų tvarkymo dokumentacijoje nurodo](https://developers.cloudflare.com/web-analytics/data-metrics/data-origin-and-collection/), kad gaunanti paslauga mato šaltinio IP adresą kaip įprasto HTTP duomenų perdavimo dalį, tačiau jį atmeta artimiausiame „Cloudflare“ duomenų centre ir nesaugo paslaugos pagrindinėse duomenų bazėse ar žurnaluose. „Cloudflare“ taip pat teigia, kad Web Analytics nekuria konkretaus žmogaus skaitmeninio atspaudo ir neseka jo skirtingose klientų svetainėse. Tai yra „Cloudflare“ pateiktas jos paslaugos aprašymas; „Cloudflare“ duomenų tvarkymui taikoma tuo metu galiojanti jos [privatumo politika](https://www.cloudflare.com/privacypolicy/).

HECAVEX gautą apibendrintą suvestinę naudoja suprasti, kurie tyrimai skaitomi, kaip lankytojai juos pasiekia, ar neveikia navigacijos keliai ir kaip puslapiai veikia tikruose įrenginiuose. HECAVEX šių matavimų nenaudoja individualiems lankytojų profiliams kurti, reklamai rodyti ar sprendimams apie konkretų žmogų priimti.

## Saugojimas ir prieiga

„Cloudflare“ šiuo metu nurodo, kad neatrinkti matavimo kodo duomenys saugomi septynias dienas, o vėliau ilgesniam saugojimui apibendrinami iki maždaug dešimties procentų. Web Analytics duomenys „Cloudflare“ suvestinėje pasiekiami už praėjusius šešis mėnesius. Atsižvelgdama į duomenų kiekį ir filtrus, „Cloudflare“ suvestinės ar API užklausoms gali taikyti atranką.

HECAVEX analitikos suvestinę gali pasiekti tik atitinkamos „Cloudflare“ paskyros įgalioti naudotojai. HECAVEX viešai neskelbia atskirų lankytojų matavimo kodo siunčiamų duomenų. Dėl tinklo maršrutizavimo „Cloudflare“ matavimus gali apdoroti kitoje šalyje ar regione nei yra lankytojas.

## Kliento pusės matavimo blokavimas

HECAVEX įkėlimo kodas neaktyvuoja analitikos, kai naršyklė perduoda `Do Not Track` reikšmę `1`. Matavimo kodą taip pat gali blokuoti naršyklės privatumo priemonės ir turinio blokatoriai. Šį kliento pusės matavimą galima sustabdyti išjungus „JavaScript“ šiai svetainei arba užblokavus užklausas į `static.cloudflareinsights.com` ir `cloudflareinsights.com`.

Šios priemonės taikomos kliento pusėje veikiančiam Web Analytics kodui. Jos nesustabdo įprastų HTTP užklausų metaduomenų, kuriuos hostingo, DNS, CDN ar tinklo paslaugų teikėjas turi apdoroti svetainei pateikti ir apsaugoti. Tokie paslaugų teikėjai taiko savo duomenų saugojimo ir privatumo sąlygas.

## Išorinės nuorodos

Straipsniuose gali būti nuorodų į išorinius šaltinius. Vien nuorodos pateikimas nereiškia, kad HECAVEX įkelia tų svetainių sekimo technologijas. Paspaudus išorinę nuorodą taikoma paskirties svetainės privatumo ir slapukų politika.

Šis pranešimas bus atnaujintas prieš sąmoningai įjungiant naują esminę sekimo priemonę ar trečiosios šalies įterpinį. Privatumo klausimus ar pataisymus galima siųsti adresu [info@hecavex.com](mailto:info@hecavex.com).
