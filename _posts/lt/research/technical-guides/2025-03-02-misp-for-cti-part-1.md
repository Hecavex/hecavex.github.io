---
title: "MISP grėsmių žvalgybai: diegimas, integracija ir automatizavimas [1 dalis]"
description: "Praktinis MISP diegimo su „Docker“, pagrindinių duomenų modelių, integracijų ir automatizavimo galimybių vadovas grėsmių žvalgybos komandoms."
date: 2025-03-02 14:00:00 +0300
last_modified_at: 2026-08-14 12:00:00 +0300
lang: lt
translation_key: misp-for-cti-part-1-001
categories: [threat-intelligence, tradecraft]
tags: [cti, misp, opencti]
author: deividas-lis
content_type: technical-guide
confidence: high
tlp: clear
image:
  path: /assets/img/posts/2025-03-02-misp-part-1/main/misp-picture.png
  alt: "MISP grėsmių žvalgybos platformos sąsaja"
  width: 1300
  height: 500
featured: false
draft: false
toc: true
comments: false
research_version: "1.1"
research_status: updated
key_findings:
  - MISP gali būti naudinga dalijimosi ir koreliacijos platforma, bet ji nepakeičia rinkimo reikalavimų, šaltinių vertinimo ir žvalgybos rengimo proceso.
  - Produkcinę vertę lemia duomenų modelis, platinimo taisyklės, galiojimas, prieigos kontrolė, priežiūra ir patikrintas atkūrimas, o ne vien veikiantis konteineris.
  - API automatizavimas turi išsaugoti kilmę ir pasitikėjimą, o kiekvienas importuotas indikatorius neturi automatiškai tapti blokavimo sprendimu.
scope: MISP diegimo principai, duomenų modelis, eksploatavimo kontrolės ir įvadinis „PyMISP“ automatizavimas CTI komandoms.
limitations: Tikslūs diegimo kintamieji ir palaikomos integracijos keičiasi tarp versijų. Prieš produkcinį naudojimą komandas reikia tikrinti pagal konkrečios versijos oficialią MISP dokumentaciją.
updates:
  - date: 2026-08-14
    note: Atnaujintas saugus diegimas, TLS ir API raktų naudojimas, duomenų kokybės kontrolės ir platformos atskyrimas nuo paties žvalgybos proceso.
---

## Įvadas

MISP – atvirojo kodo grėsmių informacijos platforma, padedanti organizacijoms struktūruotai rinkti, saugoti ir dalytis informacija apie kenkėjišką programinę įrangą, grėsmes ir pažeidžiamumus. CTI procese ji gali veikti kaip centrinė kompromitavimo indikatorių – IP adresų, domenų, failų maišų ir atakos požymių – saugykla bei koreliacijos variklis.

Taktinės CTI darbe MISP gali tapti labai naudingu įrankiu. Grėsmių veikėjai dažnai pakartotinai naudoja infrastruktūrą, technikas ir indikatorius, todėl patikimas dalijimasis žvalgyba leidžia gynėjams veikti kartu. Platforma standartizuoja duomenis, palengvina jų paiešką, praturtinimą ir sąsajų tarp skirtingų įvykių aptikimą.

![Lengvas intarpas: Boratas sako „nice“](/assets/img/posts/2025-03-02-misp-part-1/blog/borat-nice.jpg)

Šiame straipsnyje aptariami:

- MISP privalumai ir trūkumai;
- diegimas naudojant „Docker“;
- pagrindiniai naudojimo scenarijai;
- integravimo ir automatizavimo galimybės.

## MISP privalumai ir trūkumai

### Privalumai

1. **Bendruomenės kuriama žvalgyba.** MISP ekosistemoje veikia atviros dalijimosi grupės, industrijų ISAC ir valstybiniai CERT. Organizacija gali ir naudoti bendrą indikatorių bei konteksto bazę, ir pati ją papildyti.

2. **Atvirasis kodas.** Nėra licencijos mokesčio, platformą galima valdyti savo infrastruktūroje, modifikuoti ir integruoti į jau veikiančius procesus.

3. **Struktūruotas duomenų modelis.** MISP palaiko STIX, „OpenIOC“, taksonomijas ir objektų šablonus. Indikatoriai saugomi kaip įvykių atributai, o bendri atributai automatiškai koreliuojami.

4. **API ir automatizavimas.** REST API bei „PyMISP“ biblioteka leidžia automatizuoti masinį importą, eksportą, paiešką ir ryšius su SIEM, IDS/IPS ar EDR platformomis.

### Trūkumai

1. **Mokymosi kreivė.** Įvykių, atributų, objektų, taksonomijų ir platinimo modelis pradžioje gali atrodyti painus.

2. **Priežiūra.** Produkcinei sistemai reikia reguliarių atnaujinimų, duomenų bazės administravimo, atsarginių kopijų ir našumo stebėsenos.

3. **Duomenų kokybė ir triukšmas.** Iš skirtingų srautų gauti indikatoriai gali būti seni, klaidingi ar pateikti be konteksto. Būtini filtravimo, galiojimo ir pasitikėjimo procesai.

4. **Integracijų sudėtingumas.** Dalis jungčių reikalauja individualių scenarijų ar papildomų komponentų, ypač sudėtingoje saugumo architektūroje.

## Diegimas su „Docker“

Konteineriai supaprastina pradinį diegimą, nes pagrindinė programa, duomenų bazė ir priklausomybės pateikiamos kaip suderinti komponentai.

### Reikalavimai

- „Docker Engine“ ir „Docker Compose“ palaikomoje „Linux“ sistemoje;
- keli gigabaitai RAM ir pakankamai vietos augančiai duomenų bazei;
- laisvi TCP 80/443 prievadai, jei sąsaja bus pasiekiama iš išorės;
- TLS, atsarginių kopijų ir prieigos kontrolės planas prieš produkcinį naudojimą.

### Diegimo veiksmai

1. **Klonuokite oficialią MISP „Docker“ saugyklą.**

   ```bash
   git clone https://github.com/MISP/misp-docker.git
   cd misp-docker
   ```

2. **Paruoškite aplinkos kintamuosius.**

   ```bash
   cp template.env .env
   ```

   `.env` faile nustatykite `MISP_BASEURL`, duomenų bazės kredencialus ir kitus aplinkai reikalingus parametrus. Tikslūs laukų pavadinimai gali keistis kartu su projektu, todėl remkitės tos versijos oficialia dokumentacija.

3. **Atsisiųskite ir paleiskite konteinerius.**

   ```bash
   docker compose pull
   docker compose up -d
   ```

4. **Atverkite žiniatinklio sąsają.**

   Eikite į `https://<serverio-adresas>`. Bandomojoje aplinkoje gali būti naudojamas savarankiškai pasirašytas sertifikatas. Jei jūsų pasirinkta diegimo versija pateikia numatytuosius prisijungimo duomenis, pakeiskite juos nedelsdami ir patikrinkite oficialias diegimo pastabas.

5. **Atlikite pagrindinę konfigūraciją.**

   Administravimo dalyje nustatykite organizacijos vardą, bazinį URL, el. pašto bei foninių užduočių parametrus, duomenų srautus, naudotojus ir platinimo taisykles.

<aside class="hx-callout warning"><strong>Saugumo pastaba</strong>Produkcinei MISP sistemai neužtenka „paleisti konteinerį“. Apribokite administravimo prieigą, naudokite patikimą TLS, saugokite API raktus, reguliariai atnaujinkite vaizdus ir tikrinkite atsarginių kopijų atkūrimą.</aside>

### Trikčių diagnostika

- **Versijų nesuderinamumas:** atnaujinkite „Docker“ ir „Compose“, tada patikrinkite projekto palaikomas versijas.
- **Prievadų konfliktai:** įsitikinkite, kad 80 ir 443 prievadų nenaudoja kita paslauga.
- **Žurnalai:** klaidas tikrinkite komanda `docker compose logs <service>`.
- **Foninės užduotys:** jei koreliacija ar importas nevyksta, patikrinkite darbuotojų procesus ir eiles.

## MISP naudojimo scenarijai

### 1. Žvalgybos rinkimas ir praturtinimas

- indikatoriai iš atvirų, komercinių ir partnerių šaltinių;
- WHOIS, reputacijos ir kitų kontekstinių duomenų pridėjimas;
- automatinė koreliacija ir greitas perėjimas tarp susijusių atributų.

### 2. Dalijimasis grėsmių informacija

- bendradarbiavimas su ISAC, CERT ir patikimais partneriais;
- įvykių sinchronizavimas tarp MISP instancijų;
- matomumo valdymas platinimo lygiais ir dalijimosi grupėmis;
- TLP ir kitų taksonomijų naudojimas informacijai valdyti.

### 3. Automatizavimas ir reagavimas į incidentus

- indikatorių importas ir eksportas per REST API ar „PyMISP“;
- aptikimo bei blokavimo sąrašų perdavimas į SIEM, IDS/IPS ar EDR;
- incidentų duomenų koreliacija su istoriniais MISP įvykiais.

### 4. Integracija su kitais įrankiais

„TheHive“, „Splunk“ ir kitos platformos turi oficialias arba bendruomenės kuriamas MISP jungtis. Tai leidžia perduoti kontekstą į incidentų valdymo procesą ir iš jo grąžinti patvirtintus rezultatus.

## API ir „PyMISP“

„PyMISP“ yra „Python“ klientas MISP API. Juo galima:

- masiškai pridėti indikatorius iš srautų ar CSV;
- ieškoti įvykių ir atributų;
- automatizuoti koreliacijos bei praturtinimo užduotis;
- kurti individualius duomenų apdorojimo procesus.

### Paprastas pavyzdys

```python
from pymisp import PyMISP

misp_url = "https://<serverio-adresas>"
misp_key = "API_RAKTAS"
misp = PyMISP(misp_url, misp_key, ssl=True)

# Pastarųjų 24 valandų įvykiai
recent_events = misp.search(controller="events", last="24h")
for event in recent_events:
    item = event.get("Event")
    print(f"Rastas įvykis: [{item['id']}] {item['info']}")

# Naujas MISP įvykis ir domeno atributas
new_event = misp.add_event({"info": "Nauja žvalgybos informacija", "distribution": 0})
if new_event:
    event_id = new_event["Event"]["id"]
    misp.add_attribute(event_id, {"type": "domain", "value": "malicious.example.com"})
```

Nenaudokite `ssl=False` produkcijoje vien tam, kad apeitumėte sertifikato klaidą. API raktas suteikia jautrią prieigą, todėl jis neturi būti įrašytas į viešą kodą ar versijų valdymo sistemą.

## Ryšiai su kitomis platformomis

- **„TheHive“** – incidentų ir bylų valdymo platforma, su kuria MISP gali keistis indikatoriais bei kontekstu.
- **„OpenCTI“** – atvirojo kodo platforma, orientuota į platesnį žinių grafą, objektų ryšius ir strateginį kontekstą. Ji gali papildyti, bet nebūtinai pakeisti MISP.
- **SIEM ir SOAR** – MISP indikatoriai gali būti perduodami aptikimui ir reagavimo orkestravimui, tačiau prieš blokavimą reikalingi kokybės bei galiojimo filtrai.
- **„Elasticsearch“ / ELK** – eksportas gali padėti išplėsti paiešką, vizualizaciją ir koreliaciją.

## Išvada

MISP išsiskiria kaip lanksti grėsmių informacijos dalijimosi ir valdymo platforma. Atvirasis kodas, aktyvi bendruomenė ir integracijų galimybės daro ją tinkamą tiek pradedančioms, tiek patyrusioms CTI, SOC ar CERT komandoms.

Tačiau pati platforma nėra žvalgybos procesas. Vertę sukuria aiškus duomenų modelis, šaltinių vertinimas, galiojimo terminai, platinimo taisyklės ir ryšys su komandomis, kurios gali veikti.

### Pagrindinės išvados

- MISP padeda rinkti, struktūruoti ir dalytis grėsmių duomenimis.
- API ir integracijos taupo analitikų laiką, jei duomenys prieš tai tinkamai filtruojami.
- Prižiūrima MISP instancija gali tapti svarbiu CTI, SOC ar CERT informacijos centru.
- Produkcinis diegimas reikalauja saugumo, atsarginių kopijų ir duomenų kokybės valdymo – ne vien veikiančių konteinerių.

Kitoje dalyje verta išsamiau palyginti MISP ir „OpenCTI“ duomenų modelius bei parodyti, kur šios platformos papildo viena kitą.
