---
title: "UNIPARK smishing: nuo vienos SMS iki 126 phishing hostų"
card_title: "UNIPARK smishing: vienas domenas, gerokai didesnis phishing kit'as"
description: "Pilnas UNIPARK vardu siųstos smishing žinutės CTI tyrimas: domeno rotacija, exact-hash pivotai, 126 susiję hostai, kortelės bei PIN rinkimas ir NKSC sinkhole."
date: 2026-08-11 11:30:00 +0300
last_modified_at: 2026-08-11 11:30:00 +0300
lang: lt
translation_key: unipark-smishing-campaign-infrastructure
permalink: /lt/tyrimai/unipark-smishing-infrastrukturos-tyrimas/
author: deividas-lis
content_type: investigation
confidence: high
tlp: clear
categories: [fraud-scams, threat-intelligence, investigations]
tags: [UNIPARK, smishing, phishing, SMS, payment fraud, infrastructure pivoting, OSINT, threat intelligence, Lithuania]
featured: false
draft: false
toc: true
comments: false
scope: "2026 m. rugpjūčio 11 d. gautos UNIPARK vardu siųstos SMS analizė, statinis phishing puslapio kodo tyrimas, domenų, sertifikatų ir viešų URLScan duomenų pivotai."
limitations: "Kenkėjiškas JavaScript nebuvo vykdomas, formos nebuvo pildomos, o backend nebuvo testuojamas. Tyrimas nepatvirtina konkretaus operatoriaus, sėkmingai apgautų žmonių skaičiaus ar telefono numerio tikrojo naudotojo."
key_findings:
- "fmqr.ink buvo registruotas likus mažiau nei parai iki SMS, o tyrimo metu UNIPARK hostas jau buvo nukreiptas į siena.nksc.lt."
- "Statinis kodas rodo visą credential theft flow: automobilio numerį, asmens duomenis, kortelę, CVV, OTP ir net keturių skaitmenų banko kortelės PIN."
- "Kortelės numerio, vardo, galiojimo datos ir CVV pakanka rimtam card-not-present sukčiavimui. EMV lusto klonavimui papildomai reikėtų track duomenų, kurių ši forma nerinko."
- "Keturi pagrindiniai JS ir CSS failai exact-hash sutampa su ankstesniu unipark.fxqro.xin deployment'u."
- "Bendras core bundle hash URLScan duomenyse matytas 163 skenuose ir 126 unikaliuose hostuose, apsimetusiuose RingGo, EyeParking, UNIPARK, EasyPark, Q-Park ir kitais parkingo brand'ais."
- "Iš 163 susietų skenų 121 puslapis buvo pateiktas per Cloudflare, o 42 tiesiogiai iš 12 AS132203 Aceville/Tencent Cloud IP. Visuose 163 matytas /console ryšys."
- "+63 numeris rodo Filipinų numeracijos planą, bet nėra patikimas operatoriaus lokacijos ar tapatybės įrodymas."
image:
  path: /assets/img/posts/2026-08-11-unipark-smishing/unipark-smishing-hero.svg
  alt: "UNIPARK vardu siunčiama smishing žinutė veda į naują domeną ir daugkartinio parkingo phishing rinkinio infrastruktūrą"
  thumbnail: /assets/img/posts/2026-08-11-unipark-smishing/unipark-smishing-hero.svg
  width: 1600
  height: 900
---

## Trumpai: viena SMS, bet tikrai ne vienas domenas

2026 m. rugpjūčio 11 d. 11:01 gavau SMS iš `+63 951 976 1812`. Žinutė apsimetė UNIPARK, pranešė apie neva neapmokėtą parkavimą ir siuntė į `unipark.fmqr[.]ink/com`. Dar pridėjo instrukciją atsakyti raide "T", jeigu nuoroda neatsidaro, o tada ją iš naujo atidaryti arba įklijuoti į Safari. Ankstesniame užraše domeno galūnę buvau įvedęs su typo. Ekrano nuotraukoje ir visame tyrime naudojamas tik čia matomas `.ink` adresas.

Kas gi gali būti oficialiau už lietuviško parkingo pranešimą iš Filipinų numerio, naują `.ink` domeną ir prašymą pirmiausia atrašyti sukčiui.

Bet įdomesnė dalis prasidėjo ne SMS tekste. `fmqr[.]ink` buvo užregistruotas **2026 m. rugpjūčio 10 d. 13:08 UTC**, mažiau nei para prieš žinutę. Puslapio kodas rinko ne tik automobilio numerį ar tariamą 3,75 Eur mokėjimą. Jame buvo pilnas flow nuo asmens duomenų ir kortelės iki OTP, banko programėlės patvirtinimo ir **keturių skaitmenų kortelės PIN, naudojamo bankomate ar mokėjimo terminale**.

Toliau gavosi dar smagiau. Keturi pagrindiniai statiniai failai exact-hash sutapo su ankstesniu `unipark.fxqro[.]xin` puslapiu. Bendras core bundle viešuose URLScan duomenyse pasirodė **163 skenuose ir 126 unikaliuose hostuose**. Tie hostai apsimetinėjo RingGo, EyeParking, UNIPARK, EasyPark, Q-Park, NCP ir kitomis parkavimo paslaugomis.

Šitam analitiniam cluster'iui naudosiu laikiną pavadinimą **HCVX-PARKING-KIT-2026**. Tai ne threat actor vardas. Nereikia iš vieno JavaScript failo išauginti naujos grupuotės su gyvūno logotipu ir Wikipedia puslapiu.

> **Verdiktas:** confidence yra high, kad tai UNIPARK brandą naudojanti smishing ir payment phishing kampanija bei pakartotinai deploy'inamas parkingo phishing kit'as. Confidence yra tik medium, kad visi susiję domenai valdomi vieno operatoriaus, ir low bet kokiai geografinei ar asmens attribution.
{: .prompt-danger }

## Pati SMS

![Atkurtas gautos UNIPARK smishing žinutės vaizdas](/assets/img/posts/2026-08-11-unipark-smishing/sms-lure-reconstruction.svg)
_Tai sutrumpintas perpiešimas pagal pateiktą ekrano nuotrauką. URL sąmoningai defangintas, o ne naujas "tikras SMS screenshot'as"._

SMS naudojo kelis normalius social engineering kabliukus vienu metu:

1. pažįstamas vietinis brand'as
2. neapibrėžta skola, kurios žmogus negali iškart patikrinti iš žinutės
3. skubinimas ir papildomų mokesčių grėsmė
4. prašymas įvesti automobilio numerį, kuris atrodo kaip nekaltas pradinis patikrinimas
5. instrukcija atsakyti siuntėjui ir ranka atidaryti nuorodą Safari.

Paskutinis punktas nėra vien UX pagalba. Atsakymas patvirtina, kad numeris aktyvus. Be to, [Apple nurodo](https://support.apple.com/en-gb/guide/iphone/iph3f94d910d/ios), kad atrašius į žinutę jos jau nebegalima pateikti per "Report Spam" funkciją. Ar konkrečioje iOS ir operatoriaus kombinacijoje atsakymas dar ir aktyvintų nuorodą, iš vienos ekrano nuotraukos neįrodysiu. Bet pačiam sukčiui atsakymas tikrai nėra bloga žinia.

## Tyrimo metodika ir ribos

Šį kartą nedariau "pažiūrėkim, kas bus paspaudus Submit" eksperimento. Kenkėjiškas JavaScript **nebuvo paleistas** nei naršyklėje, nei headless aplinkoje, nei su Node. Formos nebuvo pildomos, WebSocket ryšys nebuvo inicijuotas, į backend nesiunčiau nei testinių kortelių, nei šiukšlių.

Nesiunčiau ir "random" duomenų vien tam, kad pažiūrėčiau, kur jie išlįs. Toks testas galėtų užteršti panelės duomenis, perspėti operatorių, sukurti nereikalingą sąveiką su svetima sistema ir vis tiek neįrodytų, kad kiti įrašai priklauso realioms aukoms. Collection kelią galima atkurti iš kliento kodo ir viešų network artefaktų jo neliečiant.

Atlikau:

- pateiktos SMS transkripciją ir lure analizę
- RDAP, DNS, Certificate Transparency ir pasyvių šaltinių patikrą
- raw HTML, JavaScript ir CSS parsisiuntimą kaip baitus
- statinį obfuskuotų string lentelių dekodavimą, nevykdant aplikacijos
- SHA-256 skaičiavimą ir exact-hash paiešką URLScan
- pivotus pagal asset vardus, hash, brandą, URL struktūrą, registrarą ir vardų serverius
- viešą telefono numerio paiešką bei numeracijos plano patikrą.

Tyrimo snapshot'as yra **2026 m. rugpjūčio 11 d. apie 08:10 UTC**. Infrastruktūra keitėsi realiu laiku, todėl po kelių valandų DNS vaizdas jau gali būti kitas.

## Laiko juosta

| Laikas UTC | Įvykis | Ką tai reiškia |
| --- | --- | --- |
| 2026-06-30 09:27 | URLScan pirmą kartą mato bendrą core bundle hash | viešai matoma kit'o šeimos pradžios riba, ne būtinai tikroji pradžia |
| 2026-07-16 15:36 | nuskenuotas `unipark.cxmpvqtr[.]club/com/` | pirmas mano rastas ankstesnis UNIPARK deployment'as |
| 2026-08-03 13:59 | nuskenuotas `unipark.novorb[.]xyz/com/` | kitas to paties core kit'o UNIPARK hostas |
| 2026-08-04 07:00 | nuskenuotas `unipark.fxqro[.]xin/com/` | vėliau exact-hash sutapęs su dabartiniu puslapiu |
| 2026-08-10 13:08 | užregistruotas `fmqr[.]ink` | naujas root domainas |
| 2026-08-11 05:11 ir 05:58 | išduoti wildcard sertifikatai `*.fmqr.ink` | infrastruktūra paruošta Cloudflare krašte |
| 2026-08-11 06:03 | pakeistas RDAP įrašas | sutampa su greitu infrastruktūros pokyčiu ir containment langu |
| apie 2026-08-11 08:01 | gauta SMS, pagal pateiktą 11:01 vietos laiką | realus lure pristatymas Lietuvoje |
| apie 2026-08-11 08:10 | `unipark.fmqr[.]ink` jau rodo į `siena.nksc.lt` | hostas jau sinkholintas arba neutralizuotas |

Sertifikatų laikai gaunami iš Certificate Transparency, o ne iš serverio pasakojimo apie save. `fmqr[.]ink` gavo wildcard sertifikatą, todėl vien CT logas neatskleidžia visų subdomenų. Jis tik parodo, kad operatorius galėjo greitai kurti skirtingus brandinius hostus po tuo pačiu root'u.

## Domeno ir infrastruktūros anatomija

`fmqr[.]ink` registracijos duomenys:

| Laukas | Reikšmė | Vertinimas |
| --- | --- | --- |
| registruotas | 2026-08-10 13:08:18 UTC | mažiau nei para prieš SMS |
| galiojimas | iki 2027-08-10 | standartinis vienerių metų registravimas |
| registraras | Dominet (HK) Limited | tas pats ir kituose UNIPARK cluster'io domenuose |
| vardų serveriai | `trevor.ns.cloudflare.com`, `paris.ns.cloudflare.com` | Cloudflare slepia origin ir suteikia greitą edge deployment'ą |
| TLS | wildcard `*.fmqr.ink` ir `fmqr.ink` | tinkamas daugeliui brandinių subdomenų |
| dabartinis CNAME | `siena.nksc.lt` | Lietuvos NKSC valdomo domeno kryptis, ne attacker origin |

Google viešas DNS dar turėjo ankstesnius Cloudflare edge adresus `104.21.54[.]13` ir `172.67.222[.]52`. Tai nėra naudingi blocklist IOC, nes tie IP yra bendra Cloudflare infrastruktūra. Lygiai taip pat `195.182.64[.]102`, į kurį rezolvinosi `siena.nksc.lt`, **nėra kenkėjiškas adresas** ir jo blokuoti nereikia.

Origin serverio iš viešų duomenų patikimai nenustačiau. MX ir prasmingų TXT įrašų taip pat nebuvo. Kitaip tariant, Cloudflare savo darbą atliko, o spėlioti origin pagal bendrus edge IP būtų tiesiog triukšmas.

## Ką darė phishing puslapis

HTML atrodė mažas, tik 2 553 baitai. Visa logika buvo trijuose JavaScript bundle'uose. Pagrindinis puslapis papildomai hotlinkino oficialiame `unipark.lt` esančius fontus bei chevron paveikslą. Tai geras brand cloning įrodymas, bet ne UNIPARK infrastruktūros kompromitavimo įrodymas. Sukčius gali hotlinkinti viešą failą lygiai taip pat, kaip bet kuris kitas lankytojas.

![Ankstesnio exact-hash sutampančio UNIPARK phishing puslapio URLScan ekrano nuotrauka](/assets/img/posts/2026-08-11-unipark-smishing/urlscan-unipark-fxqro.png)
_Vieša URLScan ekrano nuotrauka iš 2026 m. rugpjūčio 4 d. `unipark.fxqro[.]xin` skeno. Tai ankstesnis exact-hash sutampantis deployment'as, o ne mano užpildyta forma ar aktyvi sesija su operatoriumi._

Statinis dekodavimas atkūrė tokią aukos kelionę:

![Atkurtas duomenų rinkimo flow nuo SMS iki kortelės PIN](/assets/img/posts/2026-08-11-unipark-smishing/credential-theft-chain.svg)

1. **Automobilio numeris.** Pirmas puslapis prašo valstybinio numerio ir išsaugo jį naršyklėje.
2. **Tariama skola.** Rodoma 3,75 Eur suma ir fiksuotas reference `4947295570`.
3. **Asmens duomenys.** Vardas, adresas, miestas, regionas, pašto kodas, telefonas ir el. paštas.
4. **Kortelė.** Kortelės turėtojas, numeris, galiojimas ir CVV.
5. **Patvirtinimas.** Kit'as turi atskirus flow telefono OTP, el. pašto kodo, banko programėlės patvirtinimo ir custom code užklausoms.
6. **Kortelės PIN.** Puslapis tiesiai prašo keturių skaitmenų PIN ir meluoja, kad tai yra 3D Secure proceso dalis.

Vienas deobfuskuotas tekstas sako:

```text
Jūsų PIN kodas yra tas pats, kurį naudojate bankomatuose
ar mokėjimo terminaluose.
```

Tai pašalina bet kokią abejonę, ar "pin" kintamasis galėjo reikšti kokį nors vidinį kodą. Ne, kit'as prašo tikro kortelės PIN. Yra ir klaidos būsena "Įvestas PIN kodas neteisingas. Bandykite dar kartą", todėl operatorius gali bandyti surinkti daugiau nei vieną variantą.

### Ką realiai galima padaryti su surinktais kortelės duomenimis

Jeigu operatorius gauna kortelės numerį, vardą ir pavardę, galiojimo datą bei CVV, jis turi praktiškai pilną statinių duomenų rinkinį card-not-present mokėjimams. [Visa card-not-present sukčiavimą](https://corporate.visa.com/en/solutions/visa-protect/insights/ecommerce-fraud.html) apibrėžia kaip situaciją, kai pirkimui fizinės kortelės nereikia. Todėl pirmas ir realiausias monetizavimo kelias čia yra internetiniai pirkimai, kortelės patikrinimai maža suma ir bandymai apeiti arba social engineering būdu išvilioti papildomą banko patvirtinimą.

PIN šį rinkinį padaro dar pavojingesnį, bet čia svarbu neperšokti per techniką. Vien kortelės numerio, vardo, galiojimo datos, CVV ir PIN **neužtenka nukopijuoti EMV lusto**. [EMVCo paaiškina](https://www.emvco.com/knowledge-hub/how-do-emv-chip-specifications-tackle-card-fraud/), kad lustas kiekvienai operacijai naudoja dinaminius kriptografinius duomenis ir yra labai sunkiai padirbamas.

Fizinei counterfeit kortelei paprastai reikia magnetic-stripe arba pilnų track duomenų. [PCI SSC](https://www.pcisecuritystandards.org/glossary/) atskirai skiria kortelės turėtojo duomenis nuo sensitive authentication data, kur patenka CVV, pilni track duomenys ir PIN. [Europol aprašytuose skimming atvejuose](https://www.europol.europa.eu/crime-areas/online-fraud-schemes/fraud-against-payment-systems) klonuotos kortelės buvo gaminamos būtent iš nukopijuotos magnetinės juostos, o PIN naudotas išgryninimui ar mokėjimams terminaluose.

Šiame puslapyje nemačiau track duomenų rinkimo, todėl teiginys "sukčius gali nuklonuoti tavo EMV kortelę vien iš formos" būtų per stiprus. Tikslus verdict'as toks: surinktų duomenų pakanka rimtam internetinio mokėjimo sukčiavimui. Jeigu tas pats operatorius track duomenis gauna kitu kanalu, PIN gali padėti panaudoti counterfeit kortelę ten, kur dar priimama magnetinė juosta arba veikia fallback scenarijus.

## Phishing kit'o reverse engineering

Čia jau nebeužteko `strings` ir kelių `grep`. Abu obfuskuotus aplikacijos bundle'us išskleidžiau, atkūriau jų custom Base64 lookup lenteles ir statiškai pakeičiau **19 075 string lookup iškvietimus**. Iš viso gavau 3 495 iškoduotas reikšmes. Bundle'ų neimportavau ir nevykdžiau. Kitaip tariant, perskaičiau mechanizmą jo neįjungdamas.

![Reverse engineered parking phishing kit architecture](/assets/img/posts/2026-08-11-unipark-smishing/kit-architecture.svg)

Architektūra susideda iš trijų aiškių sluoksnių:

| Failas | Dydis | Ką jis daro |
| --- | ---: | --- |
| `CMjzun1n.js` | 53 382 B | plonas UNIPARK brand'o sluoksnis su tekstais, 3,75 Eur suma, puslapiais ir renkamų asmens laukų sąrašu |
| `BD53Kn13.js` | 684 970 B | bendras phishing engine su formomis, validacija, kortelių logotipais, saugojimu, operatoriaus state machine ir anti-analysis |
| `DDXZMe5D.js` | 182 967 B | Vue runtime ir Socket.IO bei Engine.IO klientas |

Tai svarbus skirtumas. Čia ne vienkartinis UNIPARK puslapis, kurį kažkas sulipdė per vakarą. UNIPARK dalis yra skin'as ant bendro engine. Serveris dar gali atsiųsti `userSiteConfig`, pakeisti nustatymus ir nurodyti kitą `backUrl`. Tas pats pagrindas todėl gana pigiai perrengiamas RingGo, EasyPark ar kitu brand'u.

### Ką tikrina ir saugo klientas

Kortelės numeriui taikomas Luhn patikrinimas, leidžiama 15 arba 16 skaitmenų, o brand'as parenkamas pagal BIN pradžią. Galiojimo data turi būti `MM/YY` formato ir nepasibaigusi. CVV laukas priima tris arba keturis skaitmenis. Formose yra browser autocomplete reikšmės `cc-number`, `cc-exp` ir `cc-csc`.

Renkami duomenys laikomi reaktyviame bendrame objekte ir periodiškai išsaugomi naršyklėje. `localStorage` ir `sessionStorage` reikšmės užšifruojamos AES-CBC, o saugojimo raktų pavadinimai pakeičiami MD5 reikšmėmis. Tam naudojama statinė, tiesiai klientui atiduodama rakto medžiaga. Tai nėra reali apsauga nuo tyrėjo, bet paprastam vartotojui DevTools lange duomenys neatrodo kaip aiškus JSON.

Įdomus reuse indikatorius yra ir tai, ko UNIPARK flow nenaudoja. Bendrame engine likę banko sąskaitos, filialo numerio, SSN, American Express papildomo CVV ir custom code komponentai. Vadinasi, framework'as kurtas daugiau nei vienam parkingo scenarijui.

### Operatorius renkasi kitą ekraną

Kai auka pateikia duomenis, frontend nelaukia vieno galutinio `success`. Jis priima `operation` būseną ir pagal ją perjungia puslapį:

| Serverio būsena | Aukos ekrane |
| --- | --- |
| `rejected` | kortelės klaida ir grįžimas į mokėjimą |
| `rejectedCode` | neteisingo kodo klaida |
| `waitVerificationPhone` | telefono OTP |
| `waitVerificationEmail` | el. pašto kodas |
| `waitVerificationPin` | kortelės PIN |
| `waitVerificationExpressCvv` | papildomas American Express CVV |
| `waitVerificationApp` | banko programėlės patvirtinimas |
| `waitVerificationCustomCode` | operatoriaus aprašytas papildomas kodas |
| `completed` | sėkmės puslapis |

`resendCode`, `confirmedApp` ir `notReceivedApp` pranešimai leidžia operatoriui matyti, ką auka daro tarp ekranų. Tai ne automatinis checkout'as. Tai interaktyvus credential harvesting flow.

### Anti-analysis nėra dekoracija

Engine skaičiuoja headless riziką pagal `navigator.webdriver`, ChromeDriver ir CDP artefaktus, Playwright bei Puppeteer požymius, User-Agent, WebGL renderer'į, plugin'us, kalbas, worker neatitikimus, canvas, audio, WebRTC, media devices, permissions, battery ir lango matmenis.

Svarbiausia radinio dalis yra ne pats signalų sąrašas. Kai galutinis score pasiekia **0,31**, aplikacija pažymi lankytoją kaip `isSpider` ir praleidžia normalų konfigūracijos bei Socket.IO inicializavimą. Taigi automatinis scanner'is gali gauti puslapio failus, bet nepamatyti tokio pat backend flow kaip realus mobilus lankytojas. Ankstesnį atsargesnį vertinimą čia galiu pataisyti: šiame build'e anti-analysis rezultatas tikrai daro įtaką vykdymo keliui.

Tai taip pat paaiškina, kodėl vien screenshot'u ar DOM snapshot'u pasikliauti negalima. Static bundle analizė šiuo atveju davė daugiau nei bandymas apsimesti naršykle.

## Backend ir operatoriaus valdomas flow

Frontend jungiasi prie **to paties hosto** per Socket.IO, naudodamas WebSocket arba polling transportą ir kelią `/console`. Default adresas surenkamas iš `window.location.protocol` ir `window.location.host`, todėl kode nėra atskiro hardcoded C2 domeno. Prisijungimo query turi `uuid` ir `shopHost`, o klientas siunčia `changleField`, `submitData` bei `notice` tipo įvykius. Taip, `changleField` parašytas būtent taip. Net phishing panelė turi savo typo.

Pranešimų turinys šifruojamas AES-CBC su statiniais raktų duomenimis, įrašytais pačiame bundle'e. Serverio `config` atsakymas gali pateikti `userSiteConfig` ir `backUrl`, todėl backend adresas teoriškai gali būti pakeistas dinamiškai, nors šiame statiniame deployment'e atskiros reikšmės nebuvo.

Šifravimas čia nepadaro puslapio saugaus. Jis tik apsunkina network telemetry analizę, nors raktas vis tiek atiduodamas kiekvienam lankytojui kartu su JavaScript.

Kodas siunčia laukų pakeitimus backend'ui ir priima operatoriaus `operation` pranešimus. Pagal juos auka gali būti perjungiama į:

- telefono OTP
- el. pašto OTP
- banko programėlės patvirtinimą
- kortelės PIN
- CVV ar kitą custom code
- klaidos ir pakartotinio bandymo būseną.

Tai labiau panašu į operatoriaus prižiūrimą phishing panelę nei į vieną statišką HTML formą. Galutinis tikslas gali keistis pagal tai, kokią kortelę ar banką įveda auka.

Čia svarbus skirtumas tarp inference ir fakto. Victim bundle'e nėra operatoriaus dashboard URL, prisijungimo formos ar admin panelės kodo. Panelės egzistavimą vertinu pagal abipusį `operation` flow, būsenų valdymą ir operatoriaus galimybę parinkti kitą aukos ekraną. `/console` yra Socket.IO collection ir control kelias, o ne įrodytas viešas admin puslapis.

URLScan padėjo patikrinti, ar `/console` tebuvo nenaudojamas kodas. Paieška `filename:console AND filename:DDXZMe5D.js` grąžino **visus 163** su core hash susietus skenus. Vadinasi, scan'ų metu naršyklės realiai kreipėsi į šį kelią.

Anti-analysis modulio vieta vykdymo grandinėje aprašyta aukščiau. Jis ne tik renka signalus. Jo rezultatas sprendžia, ar bus inicijuota normali konfigūracija ir `/console` ryšys.

### Telegram patikra

Dviejuose obfuskuotuose aplikacijos bundle'uose iškodavau **3 495 string'us**. Tarp jų nebuvo `api.telegram.org`, bot token, `chat_id`, `sendMessage`, Telegram kanalo, admin URL ar dashboard kelio. URLScan kombinacijos su `api.telegram.org`, `telegram.org`, `sendMessage` ir `bot` taip pat grąžino nulį.

Taigi client-side Telegram integracijos įrodymų nėra. Tai nereiškia, kad operatorius negalėjo iš serverio persiųsti įrašų į Telegram ar kitą platformą. Backend kodo nematome, todėl toks teiginys liktų spėjimas. Publikacijoje jo kaip fakto nededu.

### Ar `/console` leidžia rasti visą infrastruktūrą?

Vien `/console` nėra pakankamai unikalus IOC. Tokį kelią gali naudoti ir teisėtos aplikacijos, todėl akla paieška prigamintų false positives. Naudingas rezultatas gavosi tik sujungus kelią su kit'o artefaktu:

```text
filename:console AND filename:DDXZMe5D.js
```

Ši URLScan užklausa grąžino 163 įrašus. Tai buvo tas pats 163 skenų rinkinys, kurį gavau pagal core bundle hash. Toks sutapimas patvirtina, kad `/console` yra aktyvus šios kit'o šeimos network požymis, bet ne atskiras būdas stebuklingai pamatyti visą backend.

Praktiškas hunting derinys yra `/console`, core response hash, statinių failų vardai, `changleField` typo, URL keliai, brand'o šablonas, serverio header ir laiko langas. Taip galima rasti viešai nuskenuotus deployment'us ir sekti naujus. Negalima garantuoti, kad radome "visą infrastruktūrą". URLScan nemato privačių hostų, nenuskenuotų domenų, Cloudflare paslėpto origin, server-side relay ar operatoriaus dashboard, jeigu jis laikomas kitame tinkle.

## Kaip vienas domenas tapo 126 hostais

Čia buvo svarbiausias pivotas. Dabartinių failų raw SHA-256 palyginau su URLScan response hash indeksu.

| Failas | SHA-256 | Viešas sutapimas |
| --- | --- | --- |
| `CMjzun1n.js` | `8d5e6597ebac3ca5419ad4fe5c422fb59f98948d5fa32365b1730bdd06f005dc` | `unipark.fxqro[.]xin` |
| `BD53Kn13.js` | `0bdd6862589aeb9603ba1d3a8f3efe85ed987f16a954816ad85debd13c39919a` | `unipark.fxqro[.]xin` |
| `BbPeY660.css` | `34008efeed81b1f951e7ce4e95760293729ae1e84affe5115570317d3f2d4c26` | `unipark.fxqro[.]xin` |
| `C6NDXE1b.css` | `b38ea1ff18118191c1ccdd92a882ac5d2132e2393fddb4c2132476b25924e922` | `unipark.fxqro[.]xin` |
| `DDXZMe5D.js` | `7068d7b09a8afb99b051847dd65602e054f69c33d0cd8161ab986eae71538a2b` | 163 URLScan įrašai |

Pirmi keturi exact hash sutapimai rodo, kad `unipark.fmqr[.]ink` ir `unipark.fxqro[.]xin` yra praktiškai tas pats frontend deployment'as. Penktas bundle'as yra bendras platesnei kit'o šeimai.

![UNIPARK domeno ir platesnio parkingo phishing kit'o pivotas](/assets/img/posts/2026-08-11-unipark-smishing/campaign-pivot.svg)

![To paties core kit'o RingGo varianto vieša URLScan ekrano nuotrauka](/assets/img/posts/2026-08-11-unipark-smishing/urlscan-ringgo-zqmk.png)
_2026 m. rugpjūčio 11 d. URLScan užfiksuotas `ringgo.zqmk[.]cloud/com` variantas. Struktūra liko ta pati. Pasikeitė brand'as, spalvos ir tekstas._

URLScan paieška pagal bendrą `DDXZMe5D.js` hash nuo 2026 m. birželio 30 d. iki rugpjūčio 11 d. grąžino:

| Brandinis hostname prefiksas | Skenų skaičius | Pavyzdžiai |
| --- | ---: | --- |
| RingGo | 59 | `ringgo.zqmk[.]cloud`, `ringgo.mqrka[.]ink` |
| EyeParking | 55 | `eyeparking.nqzro[.]ink`, `eyeparking.mxwle[.]club` |
| UNIPARK | 3 ankstesni | `cxmpvqtr[.]club`, `novorb[.]xyz`, `fxqro[.]xin` |
| kiti parkingo brand'ai | 46 | EasyPark, Q-Park, NCP ir generiniai parkingo hostai |

Iš viso tai buvo **163 scan records ir 126 unikalūs hostname'ai**. Dabartinis `unipark.fmqr[.]ink` į tą skaičių neįtrauktas, nes URLScan jo dar nebuvo indeksavęs.

Ankstesni UNIPARK hostai:

```text
hxxps://unipark[.]cxmpvqtr[.]club/com/
hxxps://unipark[.]novorb[.]xyz/com/
hxxps://unipark[.]fxqro[.]xin/com/
hxxps://unipark[.]fmqr[.]ink/com/      # šiame incidente
```

Visi keturi root domenai registruoti per Dominet (HK) Limited, naudojo Cloudflare vardų serverius, atsitiktinai atrodančius vardus, brandą subdomene ir tą patį `/com/` kelią. Trys naujausi hostai dabar rodo į `siena.nksc.lt`. Seniausias neberezolvina.

Dar viena graži kodo liekana yra localStorage raktas:

```text
uk_ringgo_fine_plate
```

UNIPARK puslapyje paliktas `RingGo` vardas bei angliški RingGo fallback tekstai rodo, kad lietuviška versija nebuvo kurta nuo nulio. Brandas pakeistas, parkingo kit'as paliktas. Kinų kalbos developer label'iai, tokie kaip `PIN验证页`, irgi liko bundle'e, bet tai **nėra attribution Kinijai**. Tai gali būti builder'io, autoriaus, vertėjo ar nukopijuoto komponento pėdsakas.

Svarbiausia analitinė riba: exact hash patikimai sieja programinį artefaktą. Jis savaime neįrodo, kad visus 126 hostus valdė tas pats žmogus. Kit'as gali būti nuomojamas, parduodamas arba kopijuojamas. Todėl "same kit family" confidence yra high, o "same operator" lieka medium.

## IP pivotas: už Cloudflare buvo ir tiesioginis sluoksnis

Vien hash rezultatų domenų sąrašas neparodo, kaip kit'as buvo hostinamas. Suskirsčius visus 163 URLScan įrašus pagal ASN ir web serverį gavosi du aiškūs modeliai:

| Delivery modelis | Skenai | Unikalūs hostai | Matoma infrastruktūra |
| --- | ---: | ---: | --- |
| Cloudflare | 121 | 101 | AS13335, bendri Cloudflare edge IP |
| tiesioginis OpenResty | 41 | 24 | AS132203 Aceville/Tencent Cloud |
| tiesioginis nginx | 1 | 1 | AS132203 Aceville/Tencent Cloud |

![Parking phishing kit'o Cloudflare ir tiesioginio hostingo sluoksniai](/assets/img/posts/2026-08-11-unipark-smishing/infrastructure-layers.svg)

AS132203 adresų RDAP objektai priklauso `ACEVILLEPTELTD-SG`. [Tencent Cloud dokumentuose](https://intl.cloud.tencent.com/document/product/1033/32281?lang=en&amp;pg=) Aceville Pte Limited nurodoma kaip Tencent Cloud grupės paslaugų subjektas. Tai hosting provider kontekstas, ne operatoriaus attribution Kinijai ar Singapūrui.

Hash susietoje imtyje buvo 12 tiesioginių IP:

```text
43.153.54[.]89      43.135.161[.]140    170.106.154[.]69
43.157.97[.]37      101.32.47[.]254     43.160.226[.]55
43.165.174[.]107    43.172.91[.]66      43.162.121[.]115
43.160.238[.]159    43.156.224[.]182    43.162.103[.]2
```

Keli IP buvo naudojami labai kryptingoms domenų grupėms:

| Tiesioginis IP | Hash susieti skenai | Visi vieši kaimyniniai domenai | Ryškiausias pattern'as |
| --- | ---: | ---: | --- |
| `43.153.54[.]89` | 11 | 30 | parkingas, DPD, Australia Post, SingPost, government ir traffic lure'ai |
| `170.106.154[.]69` | 5 | 73 | didelė RingGo vardų rotacija, taip pat Evri ir Royal Mail |
| `43.172.91[.]66` | 2 | 53 | beveik vien RingGo typo domenai |
| `43.135.161[.]140` | 7 | 5 | EasyPark variantai |
| `43.157.97[.]37` | 4 | 7 | Q-Park variantai |
| `43.165.174[.]107` | 3 | 6 | Q-Park variantai |
| `101.32.47[.]254` | 3 | 10 | EasyPark, GLS ir mokesčių tarnybos imitacijos |
| `43.156.224[.]182` | 1 | 33 | RingGo ir DPD Local imitacijos |

Paieška per visus 12 IP grąžino **402 viešus skenus ir 249 unikalius kaimyninius domenus**. Pagal vardus 121 buvo RingGo, 29 Q-Park, 13 kitų parkingo brand'ų, 27 delivery, 13 government, tax ar police lure'ai, o 46 liko kitose kategorijose.

Šitie 249 nėra "249 patvirtinti tos pačios kampanijos domenai". IP kaimynystė yra silpnesnis ryšys nei exact hash, ypač public cloud aplinkoje. Vis dėlto daug vienodo formato brand typo domenų tame pačiame tiesioginiame IP, tuo pačiu metu ir su tuo pačiu OpenResty stack'u yra geras kandidatų sąrašas tolesniam hunting'ui.

### URL struktūra ir DNS modeliai

Kit'as nebuvo pririštas prie vieno kelio. Viešuose įrašuose matėsi `/com/`, `/uk/`, `/dk/`, `/cz/`, `/pay/`, `/d/` ir root variantai. UNIPARK, RingGo bei EyeParking dažnai naudojo brandą subdomene ir atsitiktinį root domeną. Kiti deployment'ai dėjo brandą tiesiai į root, pavyzdžiui `ringgo??-co[.]shop` ar `q-park??[.]top`.

Tiesioginiai AS132203 hostai dažnai naudojo `ns7.alidns.com` ir `ns8.alidns.com` arba HiChina DNS poras. Cloudflare-fronted grupėje dažniau matėsi Dominet registraras ir Cloudflare vardų serveriai. Tai du naudingi infrastruktūros šablonai, tačiau ne unikalūs actor fingerprint'ai.

## Telefono numerio pivotas

`+63` pagal [ITU numeracijos planą](https://www.itu.int/oth/T0202.aspx?lang=en&parent=T0202) yra Filipinų šalies kodas, o po jo einantis `9` atitinka mobiliojo numerio formatą. Viešoje paieškoje tiksliam `+639519761812` numeriui neradau ankstesnių pranešimų, profilių ar patikimo subscriber įrašo.

Iš to galima pasakyti tik tiek:

- ekrane rodomas numeris atitinka Filipinų mobiliojo numerio formatą
- numeris galėjo būti reali SIM, SMS gateway, roaming numeris arba spoofintas sender ID
- numerio prefiksas neparodo dabartinio operatoriaus dėl numerių perkėlimo
- jis neįrodo, kad kampanijos operatorius yra Filipinuose.

Telefono numerį laikau **delivery IOC**, bet ne attribution IOC. Blokuoti ir raportuoti verta. Kurti iš jo operatoriaus biografiją neverta.

## Attribution ir ką galime pasakyti sąžiningai

| Teiginys | Confidence | Kodėl |
| --- | --- | --- |
| SMS ir puslapis yra phishing | high | brand mismatch, naujas domenas, credential flow, kortelės PIN rinkimas |
| `fmqr` ir `fxqro` yra tas pats frontend build | high | keturi exact JS/CSS hash sutapimai |
| visi 126 hostai priklauso tai pačiai kit'o šeimai | high | identiškas core bundle hash ir bendra aplikacijos struktūra |
| UNIPARK domenai yra koordinuotos rotacijos dalis | medium-high | tas pats brandas, kelias, registraras, Cloudflare ir bundle |
| viską valdo vienas operatorius | medium | įmanomas bendras panelės operatorius, bet kit'as gali būti perparduodamas |
| operatorius yra Filipinuose arba Kinijoje | low | telefono ir developer string pėdsakai nėra patikima geografija |
| buvo sėkmingai pavogti pinigai | unknown | neturime aukų, bankų ar backend logų |

## IOC ir tyrimo pivotai

Kenkėjiškus URL palieku defangintus. Šaltinių ir oficialių institucijų URL žemiau yra normaliai paspaudžiami.

| Tipas | Reikšmė | Pastaba |
| --- | --- | --- |
| SMS siuntėjas | `+63 951 976 1812` | stebėtas šiame incidente. Nuosavybė nepatvirtinta |
| URL | `hxxps://unipark[.]fmqr[.]ink/com` | pateiktas SMS |
| ankstesnis URL | `hxxps://unipark[.]fxqro[.]xin/com/` | full frontend exact-hash clone |
| ankstesni URL | `unipark[.]novorb[.]xyz/com/`, `unipark[.]cxmpvqtr[.]club/com/` | tas pats core kit'as |
| Socket.IO path | `/console` | same-origin C2 kanalas |
| klientas → serveris | `changleField`, `submitData`, `notice` | duomenų ir būsenos įvykiai |
| serveris → klientas | `config`, `operation` | konfigūracija ir operatoriaus valdomi ekranai |
| localStorage | `uk_ringgo_fine_plate` | RingGo kit'o reuse pėdsakas |
| HTML marker | `Aff2dfwOEgleoYXZnKahKIPfXahqbYL3ErZahQ27wc00bAjz` | paslėptas puslapio elementas |
| core SHA-256 | `7068d7b09a8afb99b051847dd65602e054f69c33d0cd8161ab986eae71538a2b` | plačiausias kit'o pivotas |
| tiesioginis hostingas | 12 aukščiau išvardytų AS132203 IP | tikrinti kartu su domenu, SNI ir laiku |

Cloudflare edge IP ir `siena.nksc.lt` adresų į blocklist nedėčiau. Pirmi yra shared infrastruktūra. Antras yra containment kryptis.

## Šaltiniai

1. Pirminis šaltinis: 2026 m. rugpjūčio 11 d. gautos SMS ekrano nuotrauka, pateikta šiam tyrimui.
2. [fmqr.ink RDAP registracijos įrašas](https://rdap.org/domain/fmqr.ink)
3. [fxqro.xin RDAP registracijos įrašas](https://rdap.org/domain/fxqro.xin)
4. [novorb.xyz RDAP registracijos įrašas](https://rdap.org/domain/novorb.xyz)
5. [Certificate Transparency įrašai per Cert Spotter](https://api.certspotter.com/v1/issuances?domain=fmqr.ink&amp;include_subdomains=true&amp;expand=dns_names&amp;expand=issuer)
6. [URLScan exact core hash paieška](https://urlscan.io/search/#hash%3A7068d7b09a8afb99b051847dd65602e054f69c33d0cd8161ab986eae71538a2b)
7. [Ankstesnio unipark.fxqro.xin deployment'o URLScan įrašas](https://urlscan.io/result/019fcb92-a594-7294-870a-6ddf2467fe86/)
8. [Ankstesnio unipark.novorb.xyz deployment'o URLScan įrašas](https://urlscan.io/result/019fc7ec-3431-7364-9b50-04ae1b2830e3/)
9. [URLScan paieška, jungianti core bundle ir /console request'ą](https://urlscan.io/search/#filename%3Aconsole%20AND%20filename%3ADDXZMe5D.js)
10. [URLScan vieši įrašai IP 43.153.54.89](https://urlscan.io/search/#ip%3A43.153.54.89)
11. [APNIC RDAP objektas IP 43.153.54.89](https://rdap.apnic.net/ip/43.153.54.89)
12. [Tencent Cloud dokumentai, nurodantys Aceville Pte Limited](https://intl.cloud.tencent.com/document/product/1033/32281?lang=en&amp;pg=)
13. [NKSC forma pranešti apie sukčiavimo svetainę](https://www.nksc.lt/pranesti-svetaine.html)
14. [UNIPARK kontaktai ir oficialūs mokėjimo kanalai](https://unipark.lt/kontaktai-ir-duk/)
15. [Apple: kaip atpažinti phishing žinutes](https://support.apple.com/en-gb/102568)
16. [Apple: kaip pranešti apie spam ir blokuoti siuntėją](https://support.apple.com/en-gb/guide/iphone/iph3f94d910d/ios)
17. [ITU nacionalinių numeracijos planų sąrašas](https://www.itu.int/oth/T0202.aspx?lang=en&amp;parent=T0202)
18. [PCI SSC mokėjimo kortelių duomenų terminų žodynas](https://www.pcisecuritystandards.org/glossary/)
19. [Visa apie card-not-present sukčiavimą](https://corporate.visa.com/en/solutions/visa-protect/insights/ecommerce-fraud.html)
20. [EMVCo apie EMV lusto apsaugą nuo counterfeit kortelių](https://www.emvco.com/knowledge-hub/how-do-emv-chip-specifications-tackle-card-fraud/)
21. [Europol apie card-not-present sukčiavimą, skimming ir counterfeit korteles](https://www.europol.europa.eu/crime-areas/online-fraud-schemes/fraud-against-payment-systems)
22. [RingGo varianto `ringgo.zqmk.cloud` URLScan įrašas](https://urlscan.io/result/019fef6c-3238-7223-9b8c-08efa2358ac9/)

_Šis tyrimas dokumentuoja nusikalstamos infrastruktūros požymius ir gynybinius pivotus. UNIPARK, RingGo, EyeParking, EasyPark, Q-Park, NCP, Cloudflare ir kiti paminėti teisėti paslaugų teikėjai nėra laikomi kampanijos dalyviais vien todėl, kad jų vardai ar infrastruktūra buvo panaudoti arba imituoti._
