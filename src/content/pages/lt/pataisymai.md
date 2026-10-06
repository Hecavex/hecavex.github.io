---
layout: page
lang: lt
translation_key: corrections
title: Pataisymai
last_modified_at: 2026-09-10
description: HECAVEX pataisymų ir atnaujinimų politika.
permalink: /lt/pataisymai/
---

Esminiai pataisymai dokumentuojami atitinkamo straipsnio atnaujinimų istorijoje. Rašybos ar formatavimo klaidos gali būti ištaisytos be atskiro įrašo. Jei nauji įrodymai pakeičia vertinimą, aiškiai nurodoma pakeitimo data ir pobūdis.

<h2 id="adform-executable-examples">Adform kodo pavyzdžiai</h2>

**2026 m. rugsėjo 10 d. · straipsnis 1.1 → 1.2.** Angliško [Adform tyrimo](/lt/tyrimai/adform-supply-chain-crypto-clipper/) KQL ir Suricata pavyzdžiuose trūko būtinų skirtukų. Jie atkurti. Abi kalbinės versijos naudoja [bendrus versijuotus failus](/assets/detections/adform/v1.0.0/README.md), atskirai nurodant sintaksės, vykdymo variklio ir praktinio veiksmingumo patikrą. Pakeiskite anksčiau nukopijuotus angliškus pavyzdžius. Incidento skaičiai, payload'o išvados ir priskyrimas nepakeisti.

Patikra pačiame Suricata variklyje taip pat parodė, kad abiejose kalbinėse versijose daugiaeilei taisyklei trūko eilutės tęsinio ženklų. Bendrame faile jie pridėti. Pakeiskite anksčiau nukopijuotą daugiaeilę taisyklę iš bet kurios versijos. Prie kodo pateikti septyni sintetiniai atvejai, įskaitant teisėto ketinimo atvejį, kuris vis tiek sukelia perspėjimą.

## Labs naršyklės saugyklos aprašymas

**2026 m. rugsėjo 10 d. · privatumo pranešimas atnaujintas nuo rugpjūčio 23 d.** [Privatumo puslapis](/lt/privatumas/) nebepateikia pašalintos Labs pasirengimo darbo erdvės kaip dabartinės funkcijos. Laikini filtrai, sąmoningai bendrinamos nuorodos ir atsisiunčiami failai nėra localStorage. Senoje naršyklėje gali būti likusių reikšmių. Automatinis jų pašalinimas ar naujas duomenų rinkimas nėra teigiami.

## Hostinger paketo vientisumas

**2026 m. rugsėjo 7 d. · paketas 1.1.0 → 1.1.1.** [Hostinger tyrime](/lt/tyrimai/hostinger-pages-phishing-infrastrukturos-tyrimas/) pateiktas [pakavimo pataisymas](/assets/data/hostinger-pages-phishing-2026/CORRECTION.md). Senasis manifestas skaičiavo CRLF darbinio failo baitus, o Git pateikė LF baitus. Patikrintam atsisiuntimui naudokite pataisytą pagrindinį paketą. Domenų stebėjimai ir priskyrimas nepasikeitė. Istoriniai baitai išsaugoti.

<h2 id="radar-rugpjucio-bazes-atkurimo-ribos">Radar rugpjūčio bazės atkartojimo riba</h2>

**2026 m. rugsėjo 7 d. · originali bazė išsaugota.** [Bazės straipsnis](/lt/tyrimai/phishing-infrastruktura-lietuvoje-radar-2026-rugpjutis/) ir [paketo paaiškinimas](/assets/data/radar-august-2026-baseline/README.md) atskiria rastus, pagal hash sutampančius įvesties failus nuo pilnai patikrinto agregavimo atkartojimo. Pradinės reikšmės nepakeistos. Visos bazės negalima vadinti nepriklausomai atkartota iš išsaugotos komandos.
