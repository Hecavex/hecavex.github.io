# Signalų apžvalga 005: nuo pažeidžiamumo iki sprendimo

[Apžvalgos Nr. 005](https://hecavex.com/lt/apzvalgos/2026-08-30/) priedas, parengtas 2026 m. rugsėjo 10 d. [English](README.md).

Du šaltiniais pagrįsti pažeidžiamumų įrašai ir trys **išgalvoti** organizacijos sprendimai parodo, ko trūksta tarp „išnaudojamas“ ir „ką daryti šios sistemos savininkui“. Apžvalgos rugpjūčio 30 d. informacijos riba nekeičiama. Priede atskirai nurodyta vėlesnė šaltinių patikra.

## Failai ir naudojimas

[JSON įrašai](records.json), [CSV lentelė](records.csv), [išgalvoti sprendimai](worked-decisions.json), [tuščias darbo lapas](decision-template.csv), [vietinis pavyzdys](consumer.mjs) ir [kontrolinės sumos](manifest.json).

Atsisiųskite failus į vieną aplanką. Su Node 22 ar naujesne versija paleiskite `node consumer.mjs`. Programa skaito tik šalia esančius pavyzdžius, pateikia JSON ir nesijungia prie tinklo. Ji nieko neskaito iš jūsų sistemų inventoriaus, nekeičia konfigūracijos ir nepriskiria rizikos balo. Patikrinkite atsisiųstų failų kontrolines sumas.

JSON laukų pavadinimai bendri abiem kalboms. `unknown-version` reiškia nenustatytą versiją; `inside-cited-version-range` – patekimą į cituojamą versijų intervalą. Tai dar ne vietinio išnaudojimo patvirtinimas.

## Ribos, kurių negalima prarasti

KEV būsena užfiksuota pagal rugsėjo 9 d. katalogą, patikrintą rugsėjo 10 d. Išnaudojimas kažkur nėra įrodymas, kad pažeista konkreti organizacija. CISA terminas nėra automatiškai taikomas kiekvienam skaitytojui. EPSS duomenys nerinkti: `null` nėra nulis.

Gitea ir ownCloud faktų šaltiniai, versijos ir konkretūs dokumentų skyriai yra records.json. ownCloud konkretaus pažeidžiamumo paveiktų versijų intervalas atskirtas nuo platesnio taisymo pranešimo. Istorinė pataisyta versija nėra siūlymas šiandien diegti nebepalaikomą programinę įrangą. Naujausią palaikomą taisymo kelią tikrinkite pas gamintoją.

## Atlikite sprendimo pratimą

Dviejuose Gitea pavyzdžiuose versija vienoda, tačiau skiriasi pasiekiamumas ir patikrintos kontrolės. Izoliacija nekeičia pažeidžiamumo ir neįrodo, kad anksčiau nieko neįvyko. Ji tik pakeičia konkrečią dabartinio poveikio prielaidą.

ownCloud pavyzdyje versija nenustatyta. Pirmas darbas – užpildyti inventoriaus spragą ir išsaugoti įrodymus, o ne pažymėti „nepaveikta“.

Kiekvienam sprendimui nurodykite faktą, kuris jį pakeistų, atsakingą asmenį, termino pagrindą, nežinomus dalykus ir užbaigimo įrodymą. Tikrą inventorių pildykite privačioje darbo lapo kopijoje. Pataisos įdiegimas ir galimo įsilaužimo vertinimas nėra tas pats uždavinys.

Automatiniai testai tikrina duomenų apdorojimą, versijų intervalus, nežinomas reikšmes ir kontrolines sumas. Tai nėra veiksmingumo realioje organizacijoje įrodymas. Visi organizacijų pavadinimai, sprendimai ir terminai išgalvoti. Originaliam tekstui ir duomenims taikoma CC BY 4.0, originaliam kodui – saugyklos MIT licencija; šaltinių teisės išlieka jų savininkams.
