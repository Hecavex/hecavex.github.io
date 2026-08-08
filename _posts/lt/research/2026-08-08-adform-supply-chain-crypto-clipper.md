---
title: "Adform supply-chain ataka: kaip reklamos skriptas tapo crypto clipper’iu"
card_title: "Adform supply-chain: crypto adresų keitimas naršyklėje"
description: "Techninis Adform JavaScript supply-chain atakos tyrimas: keturi payload variantai, 83 exact-hash sesijos 59 hostuose, cache replay, piniginės ir hunting taisyklės."
date: 2026-08-08 10:30:00 +0300
last_modified_at: 2026-08-08 10:30:00 +0300
lang: lt
translation_key: adform-supply-chain-crypto-clipper
permalink: /lt/tyrimai/adform-supply-chain-crypto-clipper/
author: deividas-lis
content_type: malware-analysis
confidence: high
tlp: clear
categories: [malware, threat-intelligence, investigations]
tags: [Adform, supply-chain, JavaScript, crypto-clipper, threat-hunting, blockchain, Bitcoin, Ethereum]
featured: false
draft: false
toc: true
comments: false
scope: "2026 m. liepos 26–27 d. Adform Site Tracking JavaScript kompromitavimo statinė analizė, pasyvi ekspozicijos paieška, susijusių piniginių grandinės analizė ir gynybinės medžioklės rekomendacijos."
limitations: "Analizė remiasi viešais mėginiais, interneto archyvais, URLScan ir viešomis blokų grandinėmis. Ji nenustato visų paveiktų puslapių, lankytojų ar patvirtintai pavogtų lėšų ir nepriskiria operacijos konkrečiam žinomam veikėjui."
key_findings:
- "Kenkėjiškas kodas buvo tiesiog pridėtas prie tuo metu teisėto trackpoint-async.js failo; archyvuose nustatytos kelios greitai keistos payload versijos."
- "Pažangesnė versija keitė BTC ir ETH adresus DOM tekste, formų laukuose, programiniuose value setter’iuose bei copy, cut, paste ir input įvykiuose."
- "URLScan davė 83 exact-hash stebėjimus 59 hostuose: 55 hostai turėjo bent vieną variantą su veikiančiais BTC ir ETH replacement adresais, o 4 hostai tik ankstyvą variantą su netinkamomis adresų eilutėmis."
- "Liepos 30 d. exact-hash atsakas stebėtas per custom edge domeną su Cloudflare cache HIT ir 245023 sekundžių age, todėl cache tyrimas turi tęstis ilgiau už centrinio incidento langą."
- "Atkurtuose variantuose rasti galiojantys BTC ir ETH pakeitimo adresai, tačiau vien grandinės įplaukos neįrodo, kad lėšos pavogtos būtent per šį incidentą."
image:
  path: /assets/img/posts/2026-08-08-adform-clipper/adform-clipper-hero.png
  alt: "Patikimas trečiosios šalies JavaScript išsišakoja į svetaines, o naršyklėje crypto adresas nukreipiamas į svetimą piniginę"
  thumbnail: /assets/img/posts/2026-08-08-adform-clipper/adform-clipper-hero.png
  width: 1672
  height: 941
---

## Trumpai: reklamos skriptas nusprendė persikvalifikuoti

2026 m. liepos pabaigoje Adform platinamas `trackpoint-async.js` gavo funkciją, kurios niekas neužsakė. Prie normalaus tracking kodo kažkas prikabino browser-side crypto clipper’į. Atskirai laužti kiekvienos svetainės nereikėjo, užteko pakeisti bendrą trečiosios šalies failą. Vartotojui tuo metu užteko, kad puslapyje būtų parodytas, įrašytas, nukopijuotas ar įklijuotas crypto adresas.

Ir ne, čia nebuvo tas labai kino industrijos mėgstamas malware, kuris įsirašo į `System32`, išjungia šviesas ir palieka kaukolę ekrane. Pagal [Adform incidento atnaujinimą](https://site.adform.com/resources/newsroom/security-incident-company-update/) kodas nepasilikdavo įrenginyje ir veikė tik tol, kol paveiktas puslapis buvo atidarytas. Bet vienai negrįžtamai blockchain transakcijai to visiškai pakanka.

Tai ką čia realiai tikrinau:

- statiškai išskyriau prie teisėtos bibliotekos pridėtą kodą ir jo versijas;
- XOR turinį iškodavau jo nevykdydamas;
- patikrinau BTC, ETH ir TRON pakeitimo reikšmių formatą;
- keturių tikslių response hash ieškojau URLScan duomenyse;
- rekonstravau archyvuotų payload’ų kaitą;
- patikrinau C2 infrastruktūrą ir blockchain adresų veiklą;
- paruošiau detection bei threat-hunting medžiagą.

Kad nereikėtų per visą tekstą rašinėt "tas Adform clipper’is", šitą analitinį cluster’į vadinsiu **HCVX-ADFORM-CLIPPER-2026**. Čia laikinas HECAVEX label’is, ne naujas skambus threat actor brand’as su logotipu, gyvūnu ir merchandise’u.

> **Trumpai:** dėl supply-chain kompromitavimo, payload elgsenos ir dviejų veikiančių replacement adresų confidence yra high. Kas buvo operatorius, iš kur jis ir kaip pateko į Adform distribuciją, duomenų neužtenka. Tikslaus pavogtų lėšų skaičiaus irgi neturim.
{: .prompt-info }

## Metodika ir saugumo ribos

Prieš einant į kodą, trumpa OPSEC dalis. Viešą mėginį iš [Max Maass paskelbto Gist](https://gist.github.com/malexmave/8ef5eabc7b6866698f1ea8a811c75b57) išsaugojau kaip tekstą atskiroje analizės direktorijoje. Jo **neimportavau į naršyklę, nepaleidau su Node, `eval`, headless browser ar bet kokiu kitu JavaScript runtime’u**. Dekodavimą atlikau baitų lygmeniu: palyginau failus, regex ištraukiau reikšmes ir atlikau XOR operaciją su pačiame mėginyje buvusiu raktu.

Čia ne vien gražus compliance sakinys. Tas kodas skirtas kabintis prie clipboard, DOM ir formų laukų. Paleist jį darbo aplinkoje "tik trumpam pažiūrėt" būtų gan geras būdas pačiam sau pasidaryt incidentą.

Kad skaičiai ir attribution neatsirastų iš oro, naudojau šiuos šaltinius:

| Šaltinis | Ką tikrinau | Veiksmo tipas |
| --- | --- | --- |
| Adform pranešimas ir dokumentacija | incidento langas, poveikis, skripto diegimo modelis | viešas skaitymas |
| Gist ir Wayback failai | statinis diff, hash, XOR, elgsena | pasyvus atsisiuntimas, nevykdyta |
| URLScan | exact response hash, response metadata ir screenshot’ai | pasyvi paieška |
| RIPE RDAP / RIPEstat | IP prefiksas, ASN ir registracijos kontekstas | pasyvus lookup |
| Mempool ir Blockscout | vieša BTC bei ETH grandinės veikla | pasyvus blockchain lookup |

Live įtartinų hostų nelankiau, C2 porto neskeneriavau ir jokių transakcijų nesiunčiau. Žodžiu, threat hunting, o ne "žiūrėkit, gavau shell’ą svetimoj sistemoj".

## Incidento laiko juosta

Adform [2026 m. rugpjūčio 5 d. atnaujinime](https://site.adform.com/resources/newsroom/security-incident-company-update/) nurodo, kad pirmoji kenkėjiška veikla prasidėjo **liepos 26 d. 23:49 CEST** (21:49 UTC), įtartina veikla aptikta **liepos 27 d. 03:00 CEST** (01:00 UTC), o po **19:16 CEST** (17:16 UTC) naujo kenkėjiško kodo platinimo nebepastebėta.

Oficiali laiko juosta yra viena dalis. Wayback ir URLScan dar parodė, kaip keitėsi payload’as ir kaip cache kopija išliko po oficialaus incidento lango:

![Adform incidento ir kenkėjiško JavaScript versijų laiko juosta](/assets/img/posts/2026-08-08-adform-clipper/adform-incident-timeline.svg)
_Laikai UTC. Mėlyni paskutinio taško akcentai žymi cached atsaką, o ne įrodytą tęstinę užpuoliko prieigą._

| Laikas UTC | Stebėjimas | Vertinimas |
| --- | --- | --- |
| 2026-07-26 21:49 | Pirma veikla pagal Adform retrospektyvią analizę | oficiali incidento pradžios riba |
| 2026-07-26 23:29 | Wayback failas turi pirmą bloką su C2 ir neveikiančiomis wallet reikšmėmis | ankstyvas arba sulūžęs etapas |
| 2026-07-27 00:00 | Atsiranda pažangesnis vieno bloko variantas | DOM, formos ir programinis `value` hook |
| 2026-07-27 00:41 | Archyve jau yra abu blokai | copy, cut, paste, input ir polling |
| 2026-07-27 01:00 | Adform aptinka įtartiną veiklą | prasideda containment |
| 2026-07-27 17:16 | Adform nebemato naujo kenkėjiško platinimo | centrinio incidento pabaigos riba |
| 2026-07-30 09:09 | URLScan gauna žinomą exact-hash variantą per `s1.matas.se` | Cloudflare `HIT`, stale cache objektas |
| 2026-08-08 | Dabartinis `s2.adform.net` failas sutampa su švariu mėginio prefiksu | tyrimo snapshot, ne amžinas allowlist |

## Kur tiksliai buvo payload’as

Pats diff’as čia gan paprastas. Viešai užfiksuoto failo pradžia baitas į baitą sutapo su 2026 m. rugpjūčio 8 d. parsisiųstu švariu `trackpoint-async.js`. Skirtumas prasidėjo tik po **82 727 baitų**. Prie teisėtos bibliotekos pabaigos buvo tiesiog priklijuota **6 945 baitų** kenkėjiška uodega.

```text
captured trackpoint-async.js
├── 82 727 B  legitimate Adform prefix
└──  6 945 B  appended malicious suffix
    ├── block A: clipboard poll + copy hook + HTTP telemetry
    └── block B: DOM walker + form/value hooks + clipboard events
```

Paprasčiau tariant, administratorius mato pažįstamą hostname, pažįstamą failo kelią ir normalų vendor’iaus skriptą. Tik failo gale laukia mažas bonusas, kurio marketingas tikriausiai neužsakė. Vienu pakeitimu gaunamas visai neblogas supply-chain fan-out’as.

[Adform diegimo dokumentacijoje](https://www.adformhelp.com/hc/en-us/articles/10023216886545-Custom-Naming-JavaScript) rašoma, kad tracking kodas gali būti naudojamas viename puslapyje, keliose sekcijose arba visoje svetainėje. Pakeitus bendrą distribucijos failą, kodas galėjo pasiekt daug tarpusavyje nesusijusių downstream puslapių. Tai atitinka [MITRE ATT&CK T1195.002: Compromise Software Supply Chain](https://attack.mitre.org/techniques/T1195/002/).

## Keturi failo variantai, o ne vienas "malware hash"

Incidento metu failas spėjo pasikeisti kelis kartus, todėl vieno SHA-256 čia neužtenka. Šiaip visai gera pamoka visiems, kurie IOC feed’e įmeta vieną hash ir iškilmingai uždaro incidentą.

| SHA-256 | Pirmas pasyvus laikas | Turinys |
| --- | --- | --- |
| `c03567ca…31a` | 07-26 23:29 UTC | pirmas blokas, HTTP C2, invalid pakeitimo reikšmės |
| `0674a58b…aa3` | 07-27 00:00 UTC | pažangesnis vienas blokas, valid BTC/ETH |
| `a04461bb…eb6` | 07-27 00:41 UTC | abu blokai, papildomi `paste` ir `input` hook’ai |
| `02ff86c7…c55` | 07-27 11:40 UTC | advanced-only pilno atsako variantas; matytas ir cache 07-30 |

Pilni hash ir kiti machine-readable indikatoriai: [atsisiųsti IOC CSV](/assets/data/adform-clipper-2026/iocs.csv).

Su `02ff86c7…` buvo įdomiau, todėl jo ryšį patikrinau baitų lygmeniu. Iš `a04461bb…` dviejų blokų atsako paėmus pirmus 82 721 baitus ir paskutinius 4 777 baitus gaunamas 87 498 baitų failas. Jo SHA-256 tiksliai yra `02ff86c7…`. Kitaip sakant, taip atsiskiria antrasis, pažangesnis replacement blokas. [Reprodukcijos veiksmai ir assert’ai pateikti atskirai](/assets/data/adform-clipper-2026/reproduction-notes.md). JavaScript dėl šito tikrai nereikėjo paleist.

Dar vienas mažas hash niuansas. Viešas Gist failas turi tyrėjo pridėtą komentaro eilutę, todėl viso atsisiųsto artefakto SHA-256 yra `e6943f22…729`, o pačios JavaScript body yra `a04461bb…eb6`. Abu hash teisingi, tik apskaičiuoti iš skirtingo turinio. Geriau tą užrašyt dabar, nei paskui pusvalandį aiškintis, kodėl "hash nesutampa".

## Deobfuscation: XOR, kuris labiau slepia nuo akies nei nuo analitiko

Pakeitimo reikšmės buvo saugomos kaip skaičių masyvai ir XOR’inamos šešių baitų raktu:

```text
4d 33 77 54 77 30  →  "M3wTw0"
```

Iškodavimui čia jokių stebuklų nereikėjo. Užtenka tokios logikos, be `eval`, DOM ar mėginio paleidimo:

```python
def xor_decode(values: list[int], key: bytes) -> str:
    return bytes(
        value ^ key[index % len(key)]
        for index, value in enumerate(values)
    ).decode("utf-8", errors="strict")
```

Obfuscation lygis maždaug toks: užtraukti užuolaidas ir tikėtis, kad namo nebėra. Vis dėlto automatiniam plain-text IOC skenavimui to gali pakakti, todėl verta hunt’inti ir struktūrą, ne tik galutinį wallet adresą. Elgsena taip pat atitinka [MITRE ATT&CK T1027: Obfuscated Files or Information](https://attack.mitre.org/techniques/T1027/).

## Pirmas blokas: clipboard polling ir HTTP telemetry

Ankstyvas blokas dar buvo gana grubus. Jis:

- registravo `copy` įvykį;
- kas keturias sekundes skaitė iškarpinę ir bandė joje pakeisti adresą;
- puslapio užkrovimo metu kūrė HTTP užklausą į `84.32.102[.]230:7744`;
- į `/p` parametrus dėjo puslapio hostname ir kelią.

Defangintas request modelis:

```text
hxxp://84.32.102[.]230:7744/p?h={location.hostname}&u={location.pathname}
```

Bet čia yra kabliukas. Šiame variante iškoduotos BTC, ETH ir TRON pakeitimo eilutės buvo netinkamos. BTC neatitiko Bech32 checksum, ETH nebuvo validus 20 baitų hex adresas, o TRON taip pat neatitiko formato. Kodas vis tiek galėjo sugadinti vartotojo įrašą ir sukelti nesėkmingą transakciją, bet negalėjo patikimai nukreipti lėšų į veikiančią piniginę.

Ar tai buvo testinis etapas, deployment klaida, sąmoningas sabotage ar tik archyve pagauta nepilna rotacija? Duomenų neužtenka. Vadinti jį "nekenksmingu", nes wallet string sulūžęs, irgi nereikėtų. Jis vis tiek modifikavo iškarpinę ir bandė siųsti puslapio kontekstą į išorinį hostą.

Adform vėliau patvirtino, kad HTTP puslapiuose toks request galėjo pasiekti išorinę infrastruktūrą ir atskleisti hostname, puslapio path bei source/public IP. HTTPS puslapiuose request’ą turėjo blokuoti browser mixed-content politika. Todėl **C2 log’o nebuvimas nėra payload’o nebuvimo įrodymas**. HTTPS atveju tinklo indikatorius galėjo tiesiog nepasirodyti.

## Antras blokas: čia jau normalus clipper’is

Pažangesnė versija jau nebelaukė vien `Ctrl+C`. Ji:

- su `TreeWalker` ėjo per DOM tekstinius node’us;
- tikrino `input`, `textarea` ir `contenteditable` elementus;
- perrašė `HTMLInputElement` ir `HTMLTextAreaElement` `value` setter’ius;
- kabinosi prie `copy`, `cut`, `paste` ir `input` įvykių;
- periodiškai kartojo patikrą kas tris sekundes;
- po pakeitimo bandė išlaikyti cursor/selection poziciją.

![Adform crypto clipper atakos grandinė](/assets/img/posts/2026-08-08-adform-clipper/adform-attack-chain.svg)
_Pakeitimas galėjo vykti rodomame tekste, formoje, programiniame `value` rašyme arba iškarpinėje._

Vien `Ctrl+C` čia nebuvo būtinas. Adresą galėjo pakeist rodomame tekste, formoje arba programinio `value` rašymo metu. Net pakartotinis kopijavimas nebuvo garantija, nes aktyvus puslapis galėjo adresą perrašyt dar kartą.

Iš pažangesnio bloko atkurtos reikšmės:

| Tinklas | Atkurta reikšmė | Validacija | Vertinimas |
| --- | --- | --- | --- |
| Bitcoin | `bc1qmplg…krrls` | validi Bech32 checksum | veikiantis pakeitimo adresas |
| Ethereum | `0xE798…c573` | validus 20 baitų adresas, atpažįstamas explorer’yje | veikiantis pakeitimo adresas |
| TRON | `TW4AgG…nJe` | netinkamas ilgis / checksum | neveikianti pakeitimo eilutė šiame mėginyje |

TRON regex kode yra, bet iš sulūžusios eilutės jis piniginės nepadaro. Trečio "confirmed wallet" čia nėra. Blockchain’ui gražiai atrodantis tekstas vis tiek yra tik tekstas.

## C2 infrastruktūra

`84.32.102.230` patenka į `84.32.102.0/24`. [RIPE RDAP](https://rdap.db.ripe.net/ip/84.32.102.230) rodo IPXO sub-allocated bloką, o [RIPEstat](https://stat.ripe.net/84.32.102.230) jį sieja su **AS59642 / UAB Cherry Servers**. PTR buvo `ip-84-32-102-230.009.ptr.cherryservers.net`.

Ir iškart stop su attribution. Čia yra infrastruktūros kontekstas, ne veikėjo tapatybė. VPS tiekėjas netampa operacijos dalyviu vien todėl, kad kažkas išsinuomojo serverį. Lygiai taip pat Lietuvos geografinė registracija nepadaro veikėjo lietuviu. IP geolocation nėra tautybės testas, kad ir kaip patogiai kartais atrodytų slide’uose.

Tyrimo metu `7744/tcp` aktyviai netikrinau. Dabartinė Shodan InternetDB informacija rodė kitus atvirus portus, bet ne 7744; tai tik vėlesnis pasyvus snapshot ir nieko nepasako apie incidento momento būseną.

## 59 hostai dar nereiškia 59 aukų

Dabar svarbiausia dalis, nes 59 hostai nėra tas pats, kas 59 patvirtintos aukos. Keturių kenkėjiškų SHA-256 exact-match paieška URLScan davė:

- **83** atskirus scan stebėjimus;
- **59** unikalius puslapių hostnames su vienu iš keturių kenkėjiškų variantų;
- **69** stebėjimus ir **55** unikalius hostus su variantu, kuriame buvo veikiantys BTC bei ETH replacement adresai;
- **4** hostus, kuriuose stebėtas tik ankstyvas variantas su netinkamomis replacement eilutėmis;
- laiką nuo 2026-07-26 23:29 UTC iki 2026-07-30 09:09 UTC.

Kaip tą tikrinau? Statinė archyvuotų failų analizė kiekvieną SHA-256 susieja su konkrečia elgsena ir atkurtais adresais. Tada [URLScan Search API dokumentacija](https://urlscan.io/docs/search/) patvirtina, kad `hash` laukas yra skenavimo metu atsisiųsto HTTP response SHA-256. URLScan screenshot’as čia tik kontekstas. Techninis įrodymas yra exact response hash, rodantis, kad sesija to puslapio kontekste atsisiuntė baitas į baitą tokį pat failą.

| Įrodymo sluoksnis | Ką jis įrodo | Ko jis neįrodo |
| --- | --- | --- |
| Archyvuoto failo SHA-256 ir statinė analizė | konkretaus failo clipboard, DOM, formų ir wallet replacement galimybes | kad failas buvo gautas konkrečiame puslapyje |
| URLScan `hash:<sha256>` rezultatas | kad skenavimo sesija konkretaus hosto kontekste atsisiuntė tą exact response | kad tokį pat atsaką gavo kiekvienas realus lankytojas |
| Abiejų sluoksnių sujungimas | kad 55 hostų skenavimo sesijose buvo gautas failas, galintis pakeisti BTC ir ETH adresus veikiančiomis reikšmėmis | kad handler’is realiai suveikė, vartotojas atliko transakciją ar patyrė nuostolį |

Mano įrodymų riba čia gana paprasta. Galiu rašyti, kad **55 hostų URLScan sesijos atsisiuntė kenkėjišką JavaScript variantą, galintį keisti BTC ir ETH adresus veikiančiais operatoriaus adresais**. Negaliu iš to padaryti 55 patvirtintų aukų ar teigti, kad visuose 55 puslapiuose realiam vartotojui adresas tikrai buvo pakeistas. Tam jau reikėtų origin, CDN ar vartotojo browser telemetry ir pačios transakcijos patvirtinimo.

Keturi hostai lieka atskirai: `betxchange.com`, `www.tsarino10.com`, `www.tsarino11.com` ir `www.tsars92.com`. Jų exact hash’ai vis tiek žymi kenkėjišką clipboard bei C2 kodą, bet tame variante atkurtos BTC, ETH ir TRON destination eilutės neveikė. Dėl to jų prie 55 hostų su veikiančiu wallet replacement nepridedu.

Tarp stebėtų hostų buvo, pavyzdžiui, `www.wizzair.com`, `www.ubs.com`, `www.keysight.com`, `www.eataly.com`, `www.groupon.pl`, `www.cinema-city.pl`, `www.mindbank.ai`, `www.zuora.com`, `www.kicks.se` ir įvairių gambling bei abejotinos reputacijos puslapių. Mišinys, švelniai tariant, platus. Čia ir matosi bendro trečiosios šalies resurso fan-out’as.

Kad nereikėtų tikėti skaičiais vien todėl, kad juos parašiau bold’u, palieku keturis machine-readable failus:

- [59 hostų santrauka](/assets/data/adform-clipper-2026/observed-hosts.csv);
- [griežtas 55 hostų su veikiančiu BTC ir ETH replacement variantu sąrašas](/assets/data/adform-clipper-2026/functioning-wallet-replacement-hosts.csv);
- [visos 83 exact-hash URLScan sesijos](/assets/data/adform-clipper-2026/urlscan-exact-hash-observations.csv), kur kiekviena eilutė turi laiką, hostname, response SHA-256, payload capability ir URLScan result nuorodą;
- [hash ir payload galimybių matrica](/assets/data/adform-clipper-2026/payload-capabilities.csv), kuri parodo, kurie variantai turėjo veikiančius BTC bei ETH replacement adresus.

![Mindbank puslapio URLScan ekrano kopija](/assets/img/posts/2026-08-08-adform-clipper/urlscan-mindbank.png)
_URLScan 2026-07-27 užfiksuotas `www.mindbank.ai` puslapis. Pačiame screenshot’e malware nesimato; techninis įrodymas yra sesijoje atsisiųsto `trackpoint-async.js` exact SHA-256. [Atidaryti URLScan įrodymą](https://urlscan.io/result/019fa2e5-24ab-743f-8612-6159350af896/)._

![UBS puslapio URLScan ekrano kopija](/assets/img/posts/2026-08-08-adform-clipper/urlscan-ubs.png)
_URLScan 2026-07-27 užfiksuotas UBS puslapis, kurio sesijoje `s2.adform.net` resursas turėjo žinomą `02ff86c7…` hash. Tai ekspozicijos signalas, ne lėšų vagystės įrodymas. [Atidaryti URLScan įrodymą](https://urlscan.io/result/019fa3c1-dcfd-73f4-a7ce-4983871fc0dc/)._

### Liepos 30-osios cache uodega

Man čia įdomiausias pasyvus radinys buvo ne dar vienas domenas, o response header’iai. [KICKS URLScan sesijoje](https://urlscan.io/result/019fb249-00f3-713f-910a-bdeaa0747b66/) 2026-07-30 09:09 UTC iš `s1.matas.se/banners/scripts/st/trackpoint-async.js` gautas exact `02ff86c7…` variantas turėjo:

```text
cf-cache-status: HIT
age: 245023
cache-control: public, max-age=604800
etag: "2c4f9056952481d2697d4e338b0caaf0"
last-modified: Mon, 27 Jul 2026 12:57:38 GMT
```

`245023` sekundės yra maždaug **2,84 dienos**, o `max-age=604800` reiškia septynias dienas. Tai gerai paaiškina, kaip žinomas kenkėjiškas atsakas dar buvo matomas po Adform nurodyto centrinio platinimo sustabdymo.

![KICKS puslapio URLScan ekrano kopija ir cached Adform resurso kontekstas](/assets/img/posts/2026-08-08-adform-clipper/urlscan-kicks-cached.png)
_URLScan puslapio vaizdas yra tik sesijos kontekstas. Pagrindinis radinys yra exact response hash ir cache metadata tinklo žurnale._

Ir ne, iš šito nereikia daryti išvados "Adform melavo, ataka tęsėsi". Matom stale edge cache objektą, ne įrodymą, kad threat actor vis dar turėjo prieigą. IR komandai išvada paprasta: iš origin failą išimti neužtenka. Reikia purge’inti CDN, custom CNAME ir browser cache, tada pasižiūrėti, kiek laiko objektas galėjo gyventi kiekviename sluoksnyje.

## Bitcoin piniginė

Atkurtas BTC adresas:

[`bc1qmplgt0hcg62jc2guz86wn2sms7tqrsulkkrrls`](https://mempool.space/address/bc1qmplgt0hcg62jc2guz86wn2sms7tqrsulkkrrls)

Ką Mempool rodė 2026-08-08:

| Metrika | Reikšmė |
| --- | ---: |
| Transakcijos | 81 |
| Iš viso gauta | 1.73854478 BTC |
| Iš viso išleista | 1.73838093 BTC |
| Likutis | 0.00016385 BTC |
| Gauta oficialiame incidento lange | 0.03239306 BTC per 9 įplaukas |

Adresas veikė dar **iki** oficialaus Adform incidento. Liepos 28 d. jis gavo 1.56008485 BTC, iš kurių viena įplauka buvo 1.55751290 BTC, o liepos 29 d. 1.59736145 BTC buvo konsoliduota į `bc1qjeky…sglm7` per [šią transakciją](https://mempool.space/tx/24eb95d4aabd7f31dbfec4637978cd7fa09ada4b0dccc063a6c42906a13c9d87).

Modelis panašus į collection-and-sweep, bet čia stop. Net jei adresas hardcoded į clipper’į ir operatoriaus kontrolė labai tikėtina, atskiros įplaukos savaime nepasako jų kilmės. Didelės liepos 28 d. transakcijos negalima tiesiog pavadinti "Adform pavogtais pinigais", kol neturim siuntėjo patvirtinimo, wallet telemetry ar kito nepriklausomo ryšio.

## Ethereum piniginė

Atkurtas ETH adresas:

[`0xE7983E69df17079ADb0aD7b3458488Cac0dBc573`](https://eth.blockscout.com/address/0xE7983E69df17079ADb0aD7b3458488Cac0dBc573)

Su ETH panašiai. Adresas veikė dar iki incidento, o viešoje grandinėje aktyvumas matomas nuo liepos 2 d. Oficialiu Adform incidento laiku, nuo 2026-07-26 21:49 iki 2026-07-27 17:16 UTC, jis gavo:

| Turtas | Įplaukos incidento lange |
| --- | ---: |
| ETH | 5.79608215429014 per 25 transakcijas |
| USDT | 2,581.032494 per 14 transfer’ių |
| USDC | 1,649.349165 per 5 transfer’ius |

Liepos 28 d. dviem transakcijomis maždaug **5.4994 ETH** buvo persiųsta į `0xaaa56521…f6dc9`. Vėliau matyti ir USDC/USDT outflow. Tai dera su aktyvia collection pinigine. Bet vėlgi, **dera** nėra tas pats, kas **įrodo**.

Grandinėje taip pat pilna nulinių transfer’ių ir netikrų homoglyph token’ų, apsimetančių ETH, USDC ar USDT. Juos iš sumų išmečiau. Jei explorer’yje susumuosim viską, kas turi gražų dolerio pavadinimą, gausim ne intelligence, o marketinginį skaičių.

Blockscout dar rodo, kad adresas šiuo metu naudoja [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702/) delegaciją į viešai verifikuotą `TrustWallet.Biz.v1.0.0` implementaciją. Tai aprašo smart-account mechaniką. Savaime tai nereiškia, kad Trust Wallet, implementacijos autorius ar jų infrastruktūra dalyvavo operacijoje.

## Ką galim pasakyti apie veikėją ir ko dar negalim

| Teiginys | Pasitikėjimas | Kodėl |
| --- | --- | --- |
| Operacija finansiškai motyvuota | aukštas | kodas kryptingai keičia crypto gavėjo adresus į hardcoded adresus |
| Naudotas software distribution / supply-chain kelias | aukštas | kenkėjiška uodega pateko į bendrą Adform tracking failą |
| Operatorius kontroliavo BTC ir ETH replacement adresus | aukštas | jie įdėti kaip galutinės pakeitimo reikšmės ir yra aktyvūs |
| Payload buvo iteruojamas incidento metu | aukštas | archyvuose matyti keli skirtingi exact hash ir hook rinkiniai |
| Naudota nuomota commodity infrastruktūra | vidutinis–aukštas | tiesioginis Cherry Servers/IPXO IP be domeno |
| Ta pati grupė veikė ir prieš Adform | vidutinis | abu adresai aktyvūs anksčiau, bet nėra nepriklausomo campaign ryšio |
| Veikėjas yra lietuvis ar susijęs su Lietuva | žemas / nepagrįstas | LT registruota IP infrastruktūra nėra operatoriaus kilmės įrodymas |
| Tai konkretus žinomas threat actor | nepakanka duomenų | nėra patikimo code reuse, infrastruktūros ar operacinio sutapimo su vardiniu cluster’iu |

Jei viską sudedu į vieną analitinį profilį, **HCVX-ADFORM-CLIPPER-2026** šiai dienai atrodo taip:

```text
Motivation:       financial
Capability:       browser-side JavaScript crypto clipping
Access vector:    compromised third-party distribution path
Operational pace: multiple payload variants within hours
Targeting:        opportunistic downstream exposure; selection unknown
Infrastructure:   direct-IP HTTP telemetry, commodity hosting
Attribution:      unattributed
Confidence:       high on behaviour, low on identity
```

Jei kas norėtų šitą cluster’į tempt toliau, verti pivot’ai būtų kitų mėginių su tuo pačiu šešių baitų XOR raktu paieška, identiško setter-hook kodo reuse, tų pačių wallet’ų ankstesni clipper campaign’ai, C2 serverio istoriniai TLS/SSH fingerprint’ai ir paslaugų tiekėjo turimi užsakymo bei prisijungimo logai. Pastarieji, aišku, iš gražių Google dork’ų neiškris.

Exact wallet, C2 ir XOR key paieškos 2026-08-08 jokio nepriklausomo ryšio su kitu vardiniu campaign’u ar žinomu actor cluster’iu nerado. Ir čia normalus rezultatas. Jis nereiškia, kad ryšio nėra, tik neduoda leidimo jį susikurti pagal nuotaiką.

## Threat hunting: gerai, o kur ieškoti?

### Laiko langas

Hunt’ą pradėčiau nuo šio lango:

```text
2026-07-26 21:49 UTC  →  2026-07-27 17:16 UTC
```

Hunt lango neapribočiau vien oficialiu incidento langu. Cache tyrimą tempčiau bent iki **2026-08-06**, nes pasyviai stebėtas objektas turėjo septynių dienų `max-age`. Browser cache artefaktus verta tikrinti pagal realų endpoint’o atsakymo laiką, ne vien pagal central incident timestamp.

### Proxy, SWG, CDN ir browser telemetry

Ieškočiau šitų dalykų:

- `/banners/scripts/st/trackpoint-async.js` request’ų į `s2.adform.net` ir custom CNAME hostus;
- atsakymo body SHA-256 sutapimų su keturiais kenkėjiškais hash;
- `ETag: "2c4f9056952481d2697d4e338b0caaf0"`;
- HTTP request’ų į `84.32.102.230:7744` su `/p?h=` ir `&u=`;
- cached kopijų endpointuose, web archive, service worker ir browser cache artefaktuose;
- kripto adresų įvedimo ar mokėjimo workflow tuo pačiu metu, tačiau tik jei organizacija tokią telemetriją teisėtai turi.

**Splunk pavyzdys:**

```plaintext
(index=proxy OR index=web) earliest="07/26/2026:21:49:00" latest="08/06/2026:23:59:59"
(
  (dest_ip="84.32.102.230" dest_port=7744 uri_path="/p")
  OR uri="*/banners/scripts/st/trackpoint-async.js*"
  OR response_sha256 IN (
    "c03567cac86046a9aa1c1c4b43e0c6de7703b43cf01b3d8229978314afc6e9da",
    "0674a58b224cca2ce840153d6c8d474f29f126f7af5054350ba1572c33233aa3",
    "a04461bbdccb15378182cdf77281ec29628f1c1386ae0fe89b62f359471fdeb6",
    "02ff86c7f9fe609a753ff15bda90baa3c3e0d4a2e559ec4fcf8a3de0954b7c55"
  )
)
| stats count min(_time) as first_seen max(_time) as last_seen
  values(url) values(response_sha256) by src_ip, user, dest_host
```

**Microsoft Defender / Sentinel KQL pavyzdys:**

```plaintext
let start = datetime(2026-07-26 21:49:00Z);
let stop  = datetime(2026-08-06 23:59:59Z);
DeviceNetworkEvents
| where Timestamp between (start .. stop)
| where (RemoteIP == "84.32.102.230" and RemotePort == 7744)
    or RemoteUrl has "/banners/scripts/st/trackpoint-async.js"
| project Timestamp, DeviceName, InitiatingProcessAccountName,
          RemoteIP, RemotePort, RemoteUrl, InitiatingProcessFileName
| order by Timestamp asc
```

**Suricata network taisyklė:**

```plaintext
alert http $HOME_NET any -> 84.32.102.230 7744 (
  msg:"HECAVEX Adform clipper telemetry attempt";
  flow:established,to_server;
  http.uri; content:"/p?h="; startswith;
  content:"&u="; distance:1;
  classtype:trojan-activity; sid:420260801; rev:1;
)
```

### Statinio turinio paieška

Exact-match’ui hash yra geriausias indikatorius. Bet pakeisk vieną baitą ir jis jau mirė. Todėl saugyklose, CDN export’uose bei browser cache ieškočiau ir kelių elgsenos eilučių kombinacijos.

```plaintext
rule HECAVEX_Adform_Clipper_2026
{
  meta:
    description = "Detects archived Adform browser crypto-clipper structure"
    author = "HECAVEX"
    date = "2026-08-08"
    tlp = "CLEAR"

  strings:
    $key  = "var _k=[0x4d,0x33,0x77,0x54,0x77,0x30]" ascii
    $c2   = "84.32.102.230:7744" ascii
    $clip = "navigator.clipboard.readText" ascii
    $hook = "Object.getOwnPropertyDescriptor(HTMLInputElement.prototype" ascii
    $walk = "document.createTreeWalker" ascii

  condition:
    filesize < 500KB and 3 of them
}
```

YARA taisyklę laikyčiau hunting rule, ne automatiniu production block. Vien browser API buvimas faile dar nėra nusikaltimo prisipažinimas. Signalą duoda jų kombinacija su key, C2 ir DOM rewrite struktūra.

## Jei čia būtų mano incident response

Mano eilė būtų tokia:

1. Išsaugočiau gautas `trackpoint-async.js` kopijas su response header’iais, laiku ir jų SHA-256.
2. Patikrinčiau origin, CDN, reverse proxy, custom CNAME, service worker ir browser cache sluoksnius.
3. Purge’inčiau objektą pagal visus cache key variantus, ne tik vieną URL.
4. Peržiūrėčiau CSP report’us ir proxy logus dėl `84.32.102.230:7744`.
5. Identifikuočiau vartotojus ir procesus, kurie incidento lange vykdė crypto mokėjimus ar administravo wallet adresus.
6. Tikrinčiau transakcijos gavėjo adresą pagal nepriklausomą šaltinį, ne pagal tuo metu ekrane rodomą lauką.
7. Rotuočiau Adform integracijos credentials ir peržiūrėčiau, kas galėjo keisti distribucijos objektą, jei tai mano valdoma integracija.
8. Atnaujinčiau third-party JavaScript kontrolę: CSP, Subresource Integrity ten, kur techniškai įmanoma, self-hosting rizikos vertinimą ir response integrity monitoring.

Subresource Integrity nėra magiškas sprendimas dinamiškai atnaujinamam vendor failui. Jei hash nuolat keičiasi, kažkas turės valdyti pinning ir update procesą. Bet "mes pasitikim vendor’iumi, todėl nieko nematuojam" irgi nėra kontrolė. Tai tik jausmas su invoice’u.

## IOC santrauka

| Tipas | Indikatorius | Pastaba |
| --- | --- | --- |
| C2 | `84.32.102[.]230:7744` | defangintas; incidento metu HTTP telemetry receiver |
| URI | `/p?h={hostname}&u={path}` | pirmo bloko request modelis |
| BTC | `bc1qmplgt0hcg62jc2guz86wn2sms7tqrsulkkrrls` | validus replacement adresas |
| ETH | `0xE7983E69df17079ADb0aD7b3458488Cac0dBc573` | validus replacement adresas |
| TRON | `TW4AgGnDc2Pk6YAynCtjCKzoKYWPg7nJe` | invalid string šiame mėginyje |
| XOR key | `M3wTw0` | struktūrinis hunting signalas |
| ETag | `"2c4f9056952481d2697d4e338b0caaf0"` | cached malicious `02ff…` atsakas |

`s2.adform.net` yra legitimus Adform domenas ir 2026-08-08 jau pateikė švarų failą. Tai nėra malicious domain’as, kurį dabar galima su pasididžiavimu įmesti į amžiną blocklist’ą. Incidentas buvo **time-bound content compromise**, todėl kombinacija `laikas + URL + response hash` yra daug tikslesnė už vien hostname.

## Ko dar nežinom

- Kaip užpuolikas gavo galimybę pakeisti distribucijos failą?
- Ar visi klientai gavo tą pačią versiją, ar vyko selektyvus edge/cookie/region targeting?
- Kiek realių page load’ų gavo kenkėjišką body?
- Kurios blockchain įplaukos, jei tokių buvo, patvirtintai kilo iš adresų pakeitimo?
- Ar tie patys wallet’ai ir setter-hook kodas naudoti kituose campaign’uose?
- Kiek custom CNAME ir browser cache kopijų liko po origin remediation?

Kol šitų atsakymų nėra, gražaus threat actor vardo nelipdau. Turim pakankamai įrodymų, kad 55 hostų URLScan sesijose buvo atsisiųstas variantas su veikiančiais BTC ir ETH pakeitimo adresais. Neturim 55 patvirtintų aukų. Tikslus aukų skaičius ir finansinis nuostolis yra **unknown**, ne nulis, bet taip pat ne skaičius, kurį patogu susumuoti iš visos wallet istorijos ir pavadinti incidento žala.

## Šaltiniai

1. [Adform: Security Incident, 2026-08-05 atnaujinimas](https://site.adform.com/resources/newsroom/security-incident-company-update/)
2. [Max Maass: užfiksuotas `trackpoint-async.js` mėginys](https://gist.github.com/malexmave/8ef5eabc7b6866698f1ea8a811c75b57)
3. [Kevin Beaumont: Adform compromised to serve crypto stealer](https://doublepulsar.com/adform-compromised-to-serve-crypto-stealer-via-supply-chain-attack-2f1ec024f33e)
4. [The Hacker News: Hackers Poison Adform Script](https://thehackernews.com/2026/08/hackers-poison-adform-script-to-swap.html)
5. [Adform: Custom Naming JavaScript dokumentacija](https://www.adformhelp.com/hc/en-us/articles/10023216886545-Custom-Naming-JavaScript)
6. [MITRE ATT&CK T1195.002: Compromise Software Supply Chain](https://attack.mitre.org/techniques/T1195/002/)
7. [MITRE ATT&CK T1027: Obfuscated Files or Information](https://attack.mitre.org/techniques/T1027/)
8. [RIPE RDAP: `84.32.102.230`](https://rdap.db.ripe.net/ip/84.32.102.230)
9. [Mempool: BTC replacement adresas](https://mempool.space/address/bc1qmplgt0hcg62jc2guz86wn2sms7tqrsulkkrrls)
10. [Blockscout: ETH replacement adresas](https://eth.blockscout.com/address/0xE7983E69df17079ADb0aD7b3458488Cac0dBc573)
11. [EIP-7702: Set Code for EOAs](https://eips.ethereum.org/EIPS/eip-7702)
12. [URLScan exact-hash paieška `a04461bb…`](https://urlscan.io/search/#hash:a04461bbdccb15378182cdf77281ec29628f1c1386ae0fe89b62f359471fdeb6)
13. [URLScan cached `02ff86c7…` stebėjimas](https://urlscan.io/result/019fb249-00f3-713f-910a-bdeaa0747b66/)

Duomenų snapshot: **2026-08-08**. Blockchain balansai, explorer žymos ir pasyvių paieškų rezultatai laikui bėgant gali pasikeisti.
