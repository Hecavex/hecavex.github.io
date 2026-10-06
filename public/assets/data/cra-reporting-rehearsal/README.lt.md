# CRA 14 straipsnis: nuo įrodymų iki pranešimo

Išgalvotas [HECAVEX CRA vadovo](https://hecavex.com/lt/tyrimai/cra-14-straipsnio-raportavimo-vadovas/) pratimas, parengtas 2026 m. rugsėjo 10 d. [English](README.md).

Tai **ne oficiali SRP forma, ne teisinė išvada ir ne tikras incidentas**. Produktas, versijos, įvykiai ir dalyvių vaidmenys išgalvoti. Pratime aiškiai daroma prielaida, kad gamintojas ir produktas patenka į reglamento taikymo sritį. Programa to nenustato ir nesprendžia, kada reali organizacija pasiekė reikiamą žinojimo lygį.

## Medžiaga

[Scenarijus ir numatyti rezultatai](scenario.json), [tuščias įrodymų bei sprendimų registras](decision-template.csv), [vietinė programa](rehearsal.mjs), [kontrolinės sumos](manifest.json).

Atsisiųskite failus į vieną aplanką. Su Node 22 ar naujesne versija paleiskite `node rehearsal.mjs`. Programa skaito išgalvotą scenarijų, pateikia rezultatą ir nesijungia prie tinklo. Ji nepraneša ENISA, nekeičia sistemų ir nesukuria paskyros. Tikro incidento registrą laikykite privačiai.

## Pratimo eiga

1. Palyginkite tris produkto versijas. Komponento buvimas, funkcijos įjungimas ir pasiekiamumas kliento aplinkoje nėra tas pats.
2. Iš E01–E03 sudarykite žinomų ir nežinomų aplinkybių sąrašą. Viešas išnaudojimo pranešimas dar nepatvirtina konkretaus produkto poveikio.
3. E04 pateikia aiškiai išgalvotą koordinatoriaus sprendimą. Užrašykite jo pagrindą ir neužpildytą 2.4.1 konfigūracijos spragą. Naujas šaltinis neturi tyliai perkelti pradinio žinojimo laiko.
4. Pažeidžiamumo kelyje atskirkite 24/72 valandų ribas nuo galutinio pranešimo pavyzdžio, siejamo su korekcinės priemonės prieinamumu.
5. Sunkaus incidento kelyje galutinio pranešimo pavyzdys siejamas su **faktiniu pranešimo pateikimu**, ne su pataisos data.
6. Iš registro parenkite ankstyvą įspėjimą ir vėlesnį išsamesnį pranešimą, bet jų nesiųskite. Nurodykite trūkstamus duomenis, sprendimo teisę ir įrodymų saugojimą.
7. Aptarkite, kokia spraga stabdė sprendimą ir ar kitas žmogus galėtų atkurti jo pagrindą.

`null` reiškia nežinomą galutinio termino atskaitos tašką. Programa priima tik aiškų UTC laiką ir atsisako pati spręsti mėnesio pabaigos teisinio skaičiavimo atvejus. Tai nėra universalus teisinių terminų skaičiuotuvas. Pranešti reikia nedelsiant, be nepagrįsto delsimo; išorinė riba nėra leidimas laukti.

## Oficialus kelias

Registraciją, pranešimo pateikimą ir laukų žodyną tikrinkite [ENISA SRP vadove](https://www.enisa.europa.eu/topics/product-security/single-reporting-platform-srp), [aktualiuose DUK](https://www.enisa.europa.eu/topics/product-security/single-reporting-platform-srp/frequently-asked-questions) ir [Europos Komisijos puslapyje](https://digital-strategy.ec.europa.eu/en/policies/cra-reporting). Sąsajos skaitiklis nepakeičia teisinės atsakomybės. Darbo lapo laukų pavadinimai yra vidaus priemonė, ne oficialios formos kopija.

Automatiniai testai tikrina pateikto scenarijaus skaičiavimus ir ribas. Jie neįrodo teisinės peržiūros ar tikrų organizacijos pratybų. Realius dalyvius, nesėkmes ir rezultatus registruokite tik po tikro pratimo. Originaliam tekstui ir duomenims taikoma CC BY 4.0, originaliam kodui – saugyklos MIT licencija; oficialių šaltinių teisės nekeičiamos.
