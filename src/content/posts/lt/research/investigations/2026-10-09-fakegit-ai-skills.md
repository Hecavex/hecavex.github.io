---
title: "FakeGit, DI įgūdžiai ir nuolat keičiamas atsisiuntimo kelias"
card_title: "FakeGit ir DI įgūdžių tiekimo grandinė"
description: "GitHub ir pasyvus IOC tyrimas: kintantys README atsisiuntimai, archyvai šalia DI įgūdžių ir ribotos apimties statinis Lua išmaskavimas."
seo_description: "Fiksuoti GitHub commitai, du išsaugoti archyvai, statinis Lua dekodavimas ir pasyvi IOC patikra parodo, kaip netikri DI įrankiai keičia atsisiuntimų kelius."
date: 2026-10-09
last_modified_at: 2026-10-09
lang: lt
translation_key: fakegit-ai-skills-mutable-downloads
permalink: /lt/tyrimai/fakegit-ai-igudziai-kintantys-atsisiuntimai/
author: deividas-lis
content_type: investigation
publication_class: primary-research
categories: [malware, ai-security, osint]
tags: [github, supply-chain, ai-security, threat-hunting]
confidence: moderate
tlp: clear
featured: false
image:
  path: /assets/img/posts/fakegit-ai-skills/editorial-cover-hero-v3.webp
  thumbnail: /assets/img/posts/fakegit-ai-skills/editorial-cover-card-v3.webp
  presentation: illustration
  source_type: generated
  provenance_id: fakegit-ai-skills-mutable-downloads-cover-generated-v3
  alt: "DI sugeneruota plokščia iliustracija: repozitorijos dokumentas, raudonas nukreipimas į ZIP archyvą ir statinės analizės sritis."
  width: 1600
  height: 900
  thumbnail_width: 720
  thumbnail_height: 405
draft: false
published: true
toc: true
comments: false
prose_width: wide
research_version: "1.0"
evidence_basis: "Fiksuotų GitHub versijų šaltiniai, du pagal maišos reikšmes sutampantys archyvai, išsaugoti kaip duomenys, ribota statinė Lua ir perskaitomų PE peržiūra, vieši IOC sąrašai, pirminis diegiklio/MCP kodas ir pasyvūs viešos blokų grandinės atsakymai. Joks pavyzdys ar įterpta komanda nepaleisti."
methods: ["Ribotas viešas GitHub ir IOC pagrįstas OSINT", "Commitų ir katalogų medžių palyginimas", "Statinė archyvų, PE ir Lua peržiūra", "Statinė diegiklio ir MCP kodo peržiūra", "Viešų sąrašų pasikartojimų šalinimas", "Pasyvi reputacijos ir blokų grandinės patikra"]
key_findings:
  - "Island sąraše esanti įgūdžių repozitorija turi tik README pakeitusį commitą, datuotą spalio 9 d. Keturios Markdown nuorodos buvo nukreiptos į archyvą šalia SKILL.md, o vieno paveikslėlio šaltinis pakeistas į tą patį archyvą."
  - "Peržiūrėtoje pirminio diegiklio versijoje katalogo kopijavimo logika aiškiai neatmeta šalia esančio įprasto ZIP failo. Tai pagrindžia sąlyginę kopijavimo išvadą, bet ne automatinį vykdymą."
  - "Iš fiksuotos tikslinės 14 anksčiau paskelbtų indikatorių imties septynių GitHub repozitorijų ištekliai buvo perskaitomi, o septyni grąžino API 404 atsaką. Tai nėra pašalinimo dažnio įvertis."
  - "Dviejose atskirose tolesnės paieškos imtyse rastos dar septynios Island sąrašo repozitorijos su spalio 8 arba 9 d. įrašytais tik README archyvų nuorodų pakeitimais."
  - "Viename commitu išsaugotame įvesties duomenų rinkinyje buvo 18 repozitorijų, esančių viešuose kenkėjiškų repozitorijų sąrašuose. Išsaugotuose README fragmentuose buvo ZIP nuorodų, tačiau faktinis indeksavimas ar rekomendavimas nebuvo stebėtas."
  - "Du archyvai išsaugoti, jų maišos reikšmės sutapo. Žinomas pavyzdys davė 2 294 pažodines eilutes, 387 pastovius perstatymus ir 539 matematines pastovių porų transformacijas su 292 unikaliomis perskaitomomis reikšmėmis, nevykdant pavyzdžio."
  - "Atskira paieška, sudaryta iš keturių užklausų pagal failų pavadinimus ir maišos reikšmes, grąžino du README failus. Viena tapatybė jau buvo sąraše, kita lieka privati."
  - "Vieši Polygon įrašai leido atkurti du paskelbtus nuorodos reikšmės pakeitimus. Du paslaugų teikėjai pateikė tą pačią getter reikšmę fiksuotame spalio 9 d. bloke."
scope: "Viešo GitHub kodo ir metaduomenų patikra 2026 m. spalio 9 d., du fiksuoti palyginimo sąrašai, ribotos IOC ir failų pavadinimų paieškos, statinė diegiklio/MCP kodo peržiūra, du išsaugoti archyvai ir pasyvus paskelbtų SmartLoader indikatorių papildymas."
limitations: "Tai ribotos apimties tyrimas, ne viso GitHub surašymas ar galinių įrenginių užkrėtimo tyrimas. Du archyvai išsaugoti, jų maišos reikšmės sutapo. Statinė peržiūra apėmė tik perskaitomus failus. Vieną nepriklausomą vykdomojo failo skaitymą užblokavo Windows, o kito archyvo pirmas PE skaitymas nepavyko dėl nenustatytos priežasties. Vėlesni komponentai ir vykdymo elgesys nepatikrinti. API 404 neįrodo ištrynimo. Nebuvimas dviejuose sąrašuose neįrodo naujumo, o bendra infrastruktūra neįrodo bendro operatoriaus."
---

Pradėjau nuo atsisiuntimo mygtuko. Repozitorijoje jis užima nedaug vietos. Patogu, jei kaip tik į tą dalį nenorima atkreipti peržiūrinčio žmogaus dėmesio.

Nukopijuotas projektas gali turėti naudingą kodą, įprastą įgūdžio aprašą ir kelių mėnesių matomą istoriją, o README skaitytoją siųsti visai kitur. Įrankio ieškantis DI agentas susiduria su ta pačia problema ir dar vienu klausimu: ką, be paties įgūdžio, nukopijuoja diegiklis?

Apiiro [spalio 6 d. tyrime](https://apiiro.com/blog/never-deleted-only-re-pointed) nurodo 17 610 veikiančių masalo repozitorijų 07:41 UTC momentinės būsenos metu ir atsisiuntimo paskirties keitimą vadina "RePointing". Jų 97% tik README pakeitimų rodiklis taikomas 441 atkuriamam imties pakeitimui. Tai Apiiro matavimai. Šio repozitorijų tinklo skaičiaus neatkūriau ir viso jo sąrašo negavau.

Tad patikrinau paskelbtus indikatorius pagal dabartinį GitHub kodą, perskaičiau diegiklio ir MCP kodą, pasekiau paskelbtus IOC viešuose įrašuose. Masalo teksto ieškojau kituose duomenų rinkiniuose, tada išsaugojau du atrinktus archyvus statinei peržiūrai. Toliau atskirai žiūriu į gautus baitus, šaltinio turinį ir stebėtą elgesį.

Šio tęstinio darbo dalis yra šaltinių stebėjimai, diegiklio analizė ir ribotas pastovių reikšmių atkūrimas. Polygon istorija atkuria jau paskelbtus infrastruktūros įrodymus. Kam pirmiausia reikia reagavimo sprendimų, gali pereiti prie [saugumo komandos atrankos lentelės](#nuo-kodo-peržiūros-iki-incidento-tyrimo).

## Ką patikrinau

Repozitorijų paieška apėmė sukūrimo datas nuo 2026 m. liepos 11 d. iki spalio 9 d. Septynių paieškų pirmuosiuose surikiuotuose rezultatų puslapiuose gavau 172 eilutes, atitinkančias 162 unikalius repozitorijų identifikatorius. Šešioms atlikau atrankinę kodo ir katalogų medžio peržiūrą. Šie 162 rezultatai yra paieškos radiniai, ne 162 užbaigti auditai.

Atskirai sudariau fiksuotą tikslinę 14 repozitorijų imtį iš Island paskelbtų pavyzdžių ir su įgūdžiais bei MCP susijusių įrašų. Septynių repozitorijų ištekliai buvo perskaitomi per GitHub API, o septyni grąžino 404. Imčiai sąmoningai rinkausi temai svarbius pavyzdžius. Iš jos negalima patikimai spręsti, kokia visos kampanijos dalis tebėra pasiekiama.

Prieš skaičiuodamas palyginimo sąrašus susiejau su konkrečiomis versijomis:

| Įvestis | Versija | Ką skaičiavau |
| --- | --- | --- |
| Island liepos mėn. repozitorijų ir maišos reikšmių CSV | `72b77c0e2cc53cae92acd27258cf229077e1bfca` | 7 854 duomenų eilutės, 7 600 unikalių repozitorijų pavadinimų, 7 115 skirtingų ZIP SHA-256 reikšmių |
| Orchid repozitorijų sąrašas | `5ffa27e2bc9dce7758379519aa6a272438b01192` | 9 330 unikalių repozitorijų pavadinimų |

CSV eilutės susieja repozitoriją ir maišos reikšmę. Tai nėra atsisiuntimai, žmonės ar užkrėtimai, o abiejų tyrėjų sąrašai persidengia. Sudėję jų antraštėse minimus skaičius gautume solidžiai atrodančią sumą, turinčią labai mažai analitinės vertės. Atkuriamos įvestys yra pirminis [Island duomenų rinkinys](https://github.com/island-io/island-security-research-artifacts/blob/72b77c0e2cc53cae92acd27258cf229077e1bfca/agentbaiting/malicious-repositories-and-zip-hashes-2026-07.csv) ir [Orchid sąrašas](https://github.com/orchidfiles/git-malware-finder/blob/5ffa27e2bc9dce7758379519aa6a272438b01192/full-list.txt).

Pradiniame etape metaduomenis ir tekstą skaičiau kaip duomenis. Vėliau, atskirai užfiksuotame statinės analizės etape, išsaugojau du fiksuotų GitHub versijų ZIP, patikrinau jų maišos reikšmes ir perskaitomus failus analizavau kaip duomenis. Joks pavyzdys, diegiklis ar įterpta komanda nepaleisti. Užklausos siųstos viešoms kodo ir žvalgybos paslaugoms, ne paskelbtiems C2 adresams.

Išplėtęs paiešką atskirai atrinkau 14 susijusių repozitorijų kandidačių. Vienuolikai gavau perskaitomas commito ir katalogų medžio poras. Šešios jau buvo Island sąraše, o penkių nebuvo nė viename iš dviejų fiksuotų sąrašų. Trys grąžino API 404. Dar vieno projekto kodas peržiūrėtas dėl duomenų rinkinio naudojimo vėlesniame etape. Šios imtys turi skirtingas atrankos taisykles, todėl jų negalima sudėti ir gautą sumą vadinti kampanijos dydžio įverčiu.

## Įgūdžio README pakeitimas, datuotas spalio 9 d.

Viena Island liepos duomenyse jau įvardyta repozitorija, `amanahmed2222 / skills`, tebebuvo pasiekiama kodo peržiūrai. Jos commitas `84a4fdc3840133c30e283ee34adb730b49d3dff4` įrašo spalio 9 d. 13:37:13 UTC laiką. Fiksuotos versijos tekstas pakartotinai užfiksuotas maždaug 13:44:36 UTC. Šie laikai žymi skirtingus dalykus.

Pasikeitė tik `README.md`. Keturios Markdown nuorodos iš repozitorijos puslapio perkeltos į ZIP kintančioje `main` šakoje. README taip pat pakeistas vieno paveikslėlio šaltinis į tą patį ZIP. Pavadinus tai "penkiomis atsisiuntimo nuorodomis" dingtų skirtumas tarp hipersaito ir paveikslėlio užklausos.

![README pakeitimų ištraukos: keturios nuorodos ir vieno paveikslėlio šaltinis nukreipti į ZIP.](/assets/img/posts/fakegit-ai-skills/chrome-readme-repoint-v2.webp)

*Keturios nuorodos ir vieno paveikslėlio šaltinis nukreipti į tą patį ZIP.*

Peržiūrėtame katalogų medyje šie failai yra kartu:

```text
skills/create-branch/
    SKILL.md
    Software_v2.0-alpha.3.zip
```

Archyvo įrašo dydis yra 487 650 baitų. Įgūdžio Markdown aprašo įprastą šakos kūrimą ir susiejimą su užduotimis. Didžiųjų ir mažųjų raidžių skirtumo nepaisanti kodo paieška tame faile nerado `.zip`, `software_v`, `launcher` ar `luajit`. Vadinasi, perskaičius vien tas 25 eilutes, šalia katalogų medyje matomas failas lieka už peržiūros ribų.

Island anksčiau įtraukė repozitoriją į kenkėjiškų repozitorijų duomenų rinkinį. Pradinė šaltinių patikra patvirtino tikslų README pakeitimą ir šalia esančio archyvo įrašą. Vėlesniame statinės analizės etape gavau tą fiksuotos versijos archyvą. Jo SHA-256 tiksliai sutampa su senesniu Island įrašu. Toliau parodau, ką iš šių baitų pavyko patvirtinti statine analize.

Kita Island sąrašo repozitorija, `waynestimulative605 / docker-mcp-gateway`, turi tik README pakeitusį commitą, kurio laikas įrašytas spalio 6 d. 06:14:03 UTC. Commitas `6d3da0d79e7a3c6a2b8921bf6c7ba43b594e6b20` nukreipia dvi Markdown nuorodas į archyvą `main/docs/` kataloge. To kelio įrašo dydis katalogų medyje yra 467 443 baitai. Ir čia metaduomenys patvirtina failo įrašą, ne sėkmingą dabartinį atsisiuntimą ar jo baitų turinį.

![Fiksuota versija ir katalogo įrašai: SKILL.md greta ZIP archyvo.](/assets/img/posts/fakegit-ai-skills/chrome-skill-directory-v2.webp)

*SKILL.md ir ZIP archyvas tame pačiame create-branch kataloge.*

Išplėsta paieška rado dar penkias Island sąrašo repozitorijas, kurių tik README archyvų nuorodas pakeitę commitai įrašyti po Apiiro spalio 6 d. momentinės būsenos. Atskira IOC, pranešimo ir pirminio šaltinio paieškos seka pridėjo dar dvi. Toliau jas pateikiu kartu, o atskiras atrankos taisykles palieku papildomuose įrašuose:

| Anksčiau paskelbta repozitorija | Įrašytas commito laikas, UTC | Commitas |
| --- | --- | --- |
| `Sahilrajveer / reasonbench` | Spalio 8 d., 06:02:16 | `f4dbdcd8fe37732369793cd5a27ae00d8ca7dd80` |
| `Alejandro920 / Zhouyi` | Spalio 8 d., 06:13:03 | `31515265dd1bcf61ff9264d6582f3bf9f80ceabf` |
| `kaindrakonis / vibedev` | Spalio 8 d., 06:13:20 | `6875a1eeac41adaaffa5338b8d70e4996bf121c3` |
| `lozforlife120 / hyprzoom` | Spalio 9 d., 07:05:41 | `f5a79c7db98d8bc8a8edb7aff571f2edb50da74d` |
| `Adie0609 / suvadu` | Spalio 9 d., 07:14:09 | `70de2dc5008f76d23f31cd7dc6b2712d448d9a8a` |
| `guiziinn1 / modulout-llc` | Spalio 9 d., 07:01:21 | `5527079a8b63bb9aac7735fde88b19a1ba491661` |
| `Kalainilavann / takeout_downloader_script` | Spalio 9 d., 13:25:05 | `a28cb23c7dafe882ba3182311f987084a69494a2` |

Pakeitimai nukreipė README nuorodas į ZIP kelius. Atitinkamuose katalogų medžiuose liko archyvų įrašai. Tai nauji stebėjimai apie jau paskelbtas repozitorijas, ne septynios naujai atrastos kenkėjiškos operacijos. Įrašytas commito laikas taip pat neatskleidžia, kas atliko pakeitimą. Tikslias šaltinių nuorodas ir katalogų medžių metaduomenis palikau papildomuose stebėjimuose.

Šie stebėjimai atitinka aprašytą platinimo modelį ir nereikalauja reklamuojamo "įrankio" paleisti darbiniame nešiojamajame kompiuteryje. Jis ir taip turi ką veikti.

## Nuo archyvo įrašo iki jo baitų

Spalio 9 d. 14:18:40 UTC gavau ZIP iš fiksuoto `amanahmed2222 / skills` commito. Visi 487 650 baitų atitiko ir katalogų medžio Git blob `f8ef6f6e39990c57cbc35ca540c8c0895bfa97c4`, ir Island istorinę archyvo SHA-256 reikšmę `06cd34cacbcc7046b7e0bac0cdfb6d94e79049cb974218dca247b28e619c59ac`. Pirmas sutapimas patvirtina GitHub objektą. Antras susieja išsaugotą archyvą su senesniu viešu įrašu.

ZIP turėjo keturis failus. Toliau pateiktos jų gavimo metu apskaičiuotos maišos reikšmės. Paleidimo failas, Lua ir perskaitoma DLL peržiūrėti nepriklausomai. Vėliau Windows užblokavo nepriklausomą vykdomojo failo skaitymą, todėl jo eilutėje lieka tik gavimo metu atliktas matavimas.

| Failas | Baitai | Gavimo metu apskaičiuota SHA-256 |
| --- | ---: | --- |
| `App.bat` | 29 | `a96ffc9f649333f9e84b7a7e1101cf85f7a5f143253db1d7853e6e48d46b3c72` |
| `icon16.txt` | 296 308 | `33250ded61c43128b6c29b01de7b1cc962b241b236933f54bc42b648afae2398` |
| `lua51.dll` | 390 144 | `c740061da4971cdf36a102637f80fc23dbff5769c1ec2156fcd90764237d51e2` |
| `resolver.exe` | 288 768 | `8fa25c75ee56eb3c4a2b0a6fe056c1e9f933e00596c6e3167e4727f01828168d` |

Paleidimo failas nurodo greta esantį vykdomąjį failą ir perduoda jam `icon16.txt` kaip argumentą. Tekstiniame faile yra viena ilga Lua eilutė su užkoduotomis eilutėmis, konstantas slepiančia aritmetika ir skaitinėmis būsenomis valdomu vykdymo srautu. Tai apibūdina išsaugotus failus ir numatytą jų paleidimą. Jų nepaleidau.

Atidariau nepakeistas viso Lua failo ir paleidimo failo kopijas. Jų ir perskaitomos DLL maišos reikšmės vis dar sutapo su gavimo metu įrašytomis reikšmėmis. Antrame vaizde DLL baitai pateikti šešioliktainiu tekstu.

![Pirminio užmaskuoto Lua pradžia, po ja nepakeista App.bat paleidimo eilutė.](/assets/img/posts/fakegit-ai-skills/vscode-original-files-v2.webp)

*Pirminio Lua pradžia ir jo paleidimo failas.*

![DLL dydis ir SHA-256 virš šešioliktainės ištraukos su MZ ir PE žymėmis.](/assets/img/posts/fakegit-ai-skills/vscode-original-dll-bytes-v2.webp)

*DLL maišos reikšmė ir MZ/PE antraštės baitai.*

### Įrašytos tyrėjo komandos

Analizei naudoti jau esantys Python 3.12.8 ir `pefile` 2024.8.26. Tai įrašytos komandos, kurių privataus katalogo pradžia pakeista į `[analysis-directory]`. Lua eilutėse tekstu pateikti įrašyti komandų argumentai:

```text
& 'C:\Python312\python.exe' '[analysis-directory]\static-acquire.py'
& 'C:\Python312\python.exe' '[analysis-directory]\static-pe-inspect.py'
C:\Python312\python.exe [analysis-directory]\static-analysis-private\static-lua-data.py
C:\Python312\python.exe [analysis-directory]\static-analysis-private\static-lua-straight-line.py
```

Gavimo įrankis GitHub atsakymus ir ZIP failus skaitė kaip duomenis. PE įrankis analizavo baitus neįkeldamas DLL. Lua įrankiai skaidė tekstą į leksinius vienetus ir transformavo pastovius duomenis. Procesų įrašuose išsaugoti laikai, stdout, grąžinami kodai ir įrankių maišos reikšmės. Galutinis pastovių porų etapas vyko nuo 14:32:06 iki 14:32:10 UTC, baigėsi kodu 0 ir tuščiu stderr. Įvesties maišos reikšmės nepasikeitė. PE įrankio SHA-256 yra `7be56d140bfc3e0c53c2af9c5ba40e7724e7f21734b4fc53c10e3075cf1882ec`, galutinio tiesinio analizatoriaus `0c9f0dc8115c67d6b231d27f9b17e7d0f06aa26f20557a91b622d3b146200fd1`.

Perskaitoma DLL yra AMD64 PE32+ biblioteka su 129 importais iš 12 bibliotekų pavadinimų ir 324 eksportais. Jos eksportai ir įterptos eilutės atitinka LuaJIT 2.1.0-beta3 / Lua 5.1 suderinamos vykdymo aplinkos požymius. Atskira PE baitų peržiūra patvirtino šiuos matavimus. Palyginimas su patikimu pirminio projekto dvejetainiu failu ir kriptografinio parašo patikra neatlikti, todėl autentiška, nepakeista vykdymo aplinka nepatvirtinta.

Windows atmetė vėlesnį nepriklausomą vykdomojo failo skaitymą maišos reikšmei skaičiuoti su pranešimu apie virusą arba potencialiai nepageidaujamą programinę įrangą. Čia peržiūrą sustabdžiau. Klaida nepateikia konkretaus aptikimo parašo ar kenkėjiškos programinės įrangos šeimos verdikto. Kito skaitymo būdo nebandžiau ir apsaugos nustatymų nekeičiau.

### Kaip dekodavau konstantas

Pirmasis etapas dekodavo 2 294 pažodines eilutes ir 387 pastovių teksto dalių perstatymo vietas. Lua sintaksę skaičiau kaip duomenis, nevertindamas pačios Lua programos. Štai tikslūs 73 pirminiai baitai iš `icon16.txt` intervalo `[267943, 268016)` prieš dekodavimą. Poslinkiai skaičiuojami nuo nulio, intervalo pabaiga neįtraukiama:

```text
AT({1;2,{"\099\117\114\114\101","\110\116\068\108\108\080\097\116\104"}})
```

Analizatorius perskaito `\099` kaip dešimtainį baitą 99, ASCII raidę `c`. Lua dešimtainis kodas sunaudoja iki trijų skaitmenų. Tai mano `safe_decode.py` funkcijos `quoted_bytes` dešimtainio baito apdorojimo šaka be aplinkinių analizatoriaus patikrų. Ji jau perskaitė atgalinį pasvirąjį brūkšnį ir pirmą ASCII skaitmenį į `char`. Šaka priima tik ASCII skaitmenis ir atmeta reikšmes, didesnes nei 255:

```python
digits = char
for _ in range(2):
    if pos < len(source) and '0' <= source[pos] <= '9':
        digits += source[pos]
        pos += 1
value = int(digits)
require(value <= 255, 'decimal byte escape exceeds 255')
out.append(value)
```

Dvi kabutėmis apribotos dalys dekoduojamos į `curre` ir `ntDllPath`. Peržiūrėtos pagalbinės funkcijos pažodinių duomenų struktūroje tvarka `[1, 2]` parenka šias dalis pagal nuo vieneto skaičiuojamus indeksus. Kableliai ir kabliataškiai skiria lentelės įrašus. Mano Python atkūrimas iš kiekvieno indekso atima vienetą:

```python
indices = [1, 2]
chunks = [b"curre", b"ntDllPath"]
decoded = b"".join(chunks[i - 1] for i in indices)
# b"currentDllPath"
```

Duomenų kelias eina per `quoted_bytes`, kuri apdoroja užkoduotus baitus, `literal_at`, kuri sujungia indeksais parinktas dalis, pastovios pradinės reikšmės skaitymą ir matematinę transformaciją `constant_transform`. Rezultatą tikrinu JSON ir maišos reikšmių patikromis. Šios Python funkcijos yra mano. Pavyzdžio Lua funkcijų jos nekviečia.

![Pirminės užkoduoto šaltinio ištraukos greta Python dešimtainių baitų ir teksto dalių analizatorių.](/assets/img/posts/fakegit-ai-skills/vscode-source-parser-v2.webp)

*Užkoduotos eilutės greta Python analizatoriaus.*

Toliau jo eilučių transformacijos aritmetiką palyginau su [fiksuotos Prometheus EncryptStrings versijos](https://github.com/prometheus-lua/Prometheus/blob/a4efc5f381c50ae2a111bdbb9272fa3203685be3/src/prometheus/steps/EncryptStrings.lua#L121) struktūra. Palyginimas apima pradinės reikšmės nustatymą, dvi rekursines skaičių sekas, pasuktą 32 bitų žodį ir ankstesnio baito naudojimą. Autorystės nuoroda: "Based on Prometheus by Elias Oelschner, https://github.com/prometheus-lua/Prometheus". Fiksuota [Prometheus licencija](https://github.com/prometheus-lua/Prometheus/blob/a4efc5f381c50ae2a111bdbb9272fa3203685be3/LICENSE) nurodo autorių teisių ir autorystės pažymėjimo sąlygas. Tai suderinamos transformacijos nustatymas, ne pavyzdžio kodo maskavimo įrankio versijos ar operatoriaus identifikavimas.

Toliau pateiktas mano supaprastintas matematinės transformacijos pseudokodas, ne visas analizatorius ar kviečiama pavyzdžio funkcija. `ROR32` suka 32 bitų beženklį žodį į dešinę. Keturi baitai saugomi nuo jaunesniojo iki vyresniojo ir imami nuo galo, todėl vyresnysis baitas naudojamas pirmas:

```text
s45 = seed % (1 << 45)
s8 = seed % 255 + 2
previous = 68
pending = []
for encrypted_byte in ciphertext:
    if pending is empty:
        s45 = (s45 * 241 + 31330050365433) % (1 << 45)
        repeat up to 256 times:
            s8 = (s8 * 186) % 257
            if s8 != 1: break
        if no accepted state: reject pair
        r = s8 % 32
        shift = 13 - (s8 - r) / 32
        word = floor(s45 / 2**shift) % (1 << 32)
        rnd = ROR32(word, r)
        pending = [rnd & 255, (rnd >> 8) & 255,
                   (rnd >> 16) & 255, (rnd >> 24) & 255]
    previous = (encrypted_byte + pop_last(pending) + previous) % 256
    append_output_byte(previous)
```

Priėmiau tik pastovius šifruoto teksto ir pradinės reikšmės argumentus. Analizatorius nesekė vykdymo būsenų. Jo konservatyvios išvalymo taisyklės pseudokodu:

```text
at branch, join, loop or function boundary: clear(bindings)
at unsupported assignment: invalidate(assigned_bindings)
at simultaneous assignment: clear(bindings)
after opaque call: clear(bindings)
```

Pritaikius šią matematinę transformaciją 539 galimoms konstantų poroms, gautos 292 unikalios perskaitomos reikšmės. Pradinės keturios rankiniu būdu patikrintos poros įeina į šį skaičių. Nepriklausomos sveikųjų skaičių pasukimo ir slankiojo kablelio išraiškų realizacijos sutapo kiekvienam transformuotam baitui. Atskiras peržiūrėtojas atkūrė visus 539 rezultatus iš išsaugotų šifruoto teksto ir pradinės reikšmės porų, neimportuodamas mano dekoderio. Jis nepriklausomai patikrino penkias pasirinktas pirminio šaltinio poras. Skaičius 539 žymi matematinius rezultatus, o ne 539 nepriklausomai šaltinyje patikrintas kvietimo vietas. Ribota gramatika sąmoningai palieka reikšmes, kertančias nustatytą ribą, neišspręstas. Ji neįrodo kiekvienos kviečiamos funkcijos tapatybės, kai jos semantika neatkurta, ar to, kad atkurta reikšmė pasiekiama vykdymo metu.

Matematiniam etapui naudojau vieną išsaugotą konstantų porą. Šifruoto teksto dalių perstatymas ties `[176790, 177673)` atkuria 174 baitus iš 34 kabutėmis apribotų dalių. Pradinės reikšmės priskyrimas ties `[176754, 176781)` taip pat yra pirminiame šaltinyje:

```text
xT=28217191079822-(-616966)
```

Perskaičius tik šią pastovią atimtį gaunama `28217191079822 - (-616966) = 28217191696788`. Ankstesnis leksinis įrodymas susieja konstantas su `B(yT,xT)` ties `[177688, 177696)`. Jis nenustato neperprastos kviečiamos funkcijos tapatybės ir neįrodo, kad šis kvietimas pasiekiamas vykdymo metu.

![Ribota matematinė transformacija greta išsaugotos išvesties ir JSON su vietaženkliais.](/assets/img/posts/fakegit-ai-skills/vscode-transform-output-v2.webp)

*Transformacija ir jos išsaugotas rezultatas.*

Pritaikius patikrintą matematinę transformaciją šiems baitams ir šiai pradinei reikšmei gaunama tiksli 174 baitų reikšmė, užkoduota UTF-8, su LF eilučių pabaigomis ir vienu galutiniu LF:

```json
{
    "jsonrpc": "2.0",
    "method": "eth_call",
    "params": [
        {
            "to": "%s",
            "data": "%s"
        },
        "latest"
    ],
    "id": 1
}
```

| Pastovūs duomenys | SHA-256 |
| --- | --- |
| Atkurtas šifruotas tekstas | `2807ea9e86ae814427e1c7ceb9c22aec73e63b70d8a94b0a9f30c9dd8f5d079b` |
| Atkurti JSON baitai | `487190fca26fbf3acf04520ce3ab7e7447a4d11453003591edd2de51c0f4bf4c` |

Šių vietaženklių praleisti negalima: konkretus kontraktas, getter reikšmė, RPC teikėjas ar visas paskirties adresas čia neatkurti. Šis šablonas savarankiškai nesusieja šių baitų su vėliau aptariamu Polygon kontraktu.

Pakartotinai paleistas mano Python pavyzdys baigėsi kodu 0 ir atkūrė abi maišos reikšmes. Paleistas tik mano dekoderis, skaitantis išsaugotas teksto ištraukas.

Pasirinktą pastovią reikšmę dabar galima atkurti negaunant paties pavyzdžio. Į vieną katalogą išsaugokite [Python pagalbinį failą](/assets/data/fakegit-ai-skills-v1/constant-replay/constant_replay.py), [fiksuotą įvestį](/assets/data/fakegit-ai-skills-v1/constant-replay/fixture.json), [README](/assets/data/fakegit-ai-skills-v1/constant-replay/README.md) ir [visą fiksuotos versijos licenciją](/assets/data/fakegit-ai-skills-v1/constant-replay/LICENSE-Prometheus.txt), tada paleiskite:

```sh
python -B constant_replay.py
```

Šis tik standartinę biblioteką naudojantis failas patikrina šifruotų baitų maišą, atlieka sveikųjų skaičių transformaciją ir patikrina tikslią išvesties maišą. Pakartotinis paleidimas buvo sėkmingas. Pavyko ir kontroliniai bandymai su pakeistais šifruotais baitais, pradine reikšme ir išvestimi. Įvestyje yra vienas šablonas su vietaženkliais. Jis neprideda naujo rezultato prie 539 skaičiaus. Pirminio Lua failo ir jo fragmentų maišos reikšmės čia pateiktos kaip kilmės metaduomenys. Šis kodas tų failų negauna ir pakartotinai netikrina. Pastovios reikšmės aritmetikos atkūrimas nenustato užmaskuotos kviečiamos funkcijos ir neparodo vykdymo.

Kitame atkurtame turinyje yra WinINet API pavadinimai, 8 514 baitų Windows PE/PEB/LDR deklaracijų blokas, su ekrano kopijomis susiję pavadinimai, tokie kaip `BitBlt`, ir suplanuotų užduočių bei PowerShell komandų fragmentai. Tai statinis turinys. Jis nepatvirtina įvykdytos užklausos, ekrano kopijos, kodo įterpimo ar įsitvirtinimo operacijos. Visi komandų fragmentai lieka privatūs.

### Antras išsaugotas archyvas, kurio tapatybė neviešinama

Vėlesnė paieška pagal failo pavadinimą, aprašyta toliau, davė antrą kandidato archyvą. Jo išsaugoti baitai sutapo su pasyvaus teikėjo pasirinkta SHA-256 reikšme ir fiksuotu Git blob. Gretimas įgūdis aprašė įprastą audito eigą ir neminėjo archyvo tarp tikrintų aiškių indikatorių. Kandidato pavadinimas, maišos reikšmė ir šaltinio nuorodos lieka privatūs.

Jo Lua šaltinyje buvo tos pačios dvi pažodinių dalių perstatymo struktūros ir skaitinių būsenų pagrindas. Ribotas analizatorius dekodavo 3 830 pažodinių eilučių ir 413 pastovių perstatymų. Skaičių sekų ir ankstesnio baito konstantos skyrėsi nuo žinomo pavyzdžio. Šiam kandidatui šifruotas turinys ar vykdytas elgesys neatkurti.

Pirmasis nepriklausomas DLL baitų skaitymas baigėsi klaida `OSError: [Errno 22] Invalid argument`. PE palyginimas sustabdytas neišanalizavus tos DLL ir nebandžius skaityti vykdomojo failo. Priežastis nenustatyta, todėl tai nėra patvirtintas antivirusinis aptikimas. Bendra struktūra ir teikėjo maišos reikšmės sutapimas neįrodo bendro operatoriaus, galutinio kenkėjiško komponento ar aukos kompromitavimo.

[Statinės analizės stebėjimai](/assets/data/fakegit-ai-skills-v1/static-analysis.json) išsaugo viešas maišos reikšmes, procesų įrašus, konstantų skaičius ir prieigos ribas. Patys archyvai lieka privatūs.

## Diegiklis kopijuoja katalogą

Norėdamas patikrinti, kuo pagrįstas galimas patekimas į įrenginį, perskaičiau pirminio `vercel-labs/skills` projekto įgyvendinimą ties versija `e878c4502674f84094dc27b5ad94ddaf64f22551`.

Jo [diegimo keliai](https://github.com/vercel-labs/skills/blob/e878c4502674f84094dc27b5ad94ddaf64f22551/src/installer.ts#L371) perduoda `skill.path` katalogo kopijavimo funkcijai. [Aiškiai nurodytos išimtys](https://github.com/vercel-labs/skills/blob/e878c4502674f84094dc27b5ad94ddaf64f22551/src/installer.ts#L471) yra `metadata.json`, `.git`, `__pycache__` ir `__pypackages__`. [Kopijavimo ciklas](https://github.com/vercel-labs/skills/blob/e878c4502674f84094dc27b5ad94ddaf64f22551/src/installer.ts#L513) rekursyviai pereina likusius įrašus ir kopijuoja failus.

Jei šiuo keliu diegiamas pasirinktas įgūdžio katalogas, šalia esantis įprastas ZIP failas nepatenka tarp išimčių. Jis atitinka kopijavimo sąlygas. Tai statinė išvada iš peržiūrėto įgyvendinimo, ne užkrėsto galinio įrenginio bandymas ar teiginys apie kiekvieną įgūdžių diegiklį.

Šiame kelyje yra keli atskiri įvykiai:

| Įvykis | Reikalingas įrodymas |
| --- | --- |
| Įrankių katalogas reklamuoja projektą | Datuotas įrašas arba užfiksuotas katalogo įrašas |
| Repozitorijoje yra archyvas | Fiksuotas katalogų medis arba gauti baitai |
| Diegiklis nukopijuoja archyvą | Taikoma kopijavimo logika arba stebėtas failų sistemos pakeitimas |
| Kas nors jį išskleidžia ar paleidžia | Galinio įrenginio arba vykdymo įrodymai |
| Vėlesnis etapas kompromituoja paskyrą | To etapo ir jo poveikio paskyrai įrodymai |

Šia peržiūra patvirtinau repozitorijos bei archyvo buvimą ir pagrindžiau sąlyginę kopijavimo išvadą. Galinio įrenginio įrodymų apie išskleidimą ar kompromitavimą neturiu. Įgūdis gali kelti pavojų dėl Markdown instrukcijų, vykdomųjų priklausomybių, šalia esančių failų ar besikeičiančios nuotolinės paslaugos. Šiems keliams reikia skirtingų patikrų.

## Masalas gali išlikti kito projekto duomenų rinkinyje

Veikiančios repozitorijos nėra vienintelė vieta, kurią verta tikrinti. Viename viešame projekte commitu išsaugotas JSON įvesties duomenų rinkinys kataloge, pavadintame "validated", turėjo 52 įrašus apie 51 unikalią repozitoriją. Aštuoniolika repozitorijų sutapo su fiksuotais viešais sąrašais: aštuonios buvo Island, dešimt Orchid sąraše. Visuose aštuoniolikoje išsaugotų README fragmentų buvo ZIP nuorodų.

Peržiūrėtoje versijoje, kuriant naują indeksą, pirmieji 300 tinkamo README fragmento simbolių galėtų būti sujungti su pavadinimu, aprašu ir programavimo kalba vektoriniam atvaizdui kurti. Trylikoje iš aštuoniolikos sutapusių įrašų šiame fragmente buvo visa ZIP URL nuoroda.

Indekso nepaleidau ir rekomendacijos nestebėjau. Apdorojami ir kiti įvesties failai, jau esantis indeksas gali praleisti importą, o ankstesnis įrašas su tuo pačiu URL gali būti pasirinktas pirmas. Galutinio konteksto formavimo funkcija pateikia repozitorijų URL ir aprašus, o ne README tekstą ar jo ZIP nuorodas. Įrodymai patvirtina teksto išsaugojimą viename įvesties duomenų rinkinyje ir sąlyginį kelią į vektorinį atvaizdą. Jie nepatvirtina, kad šie fragmentai buvo indeksuoti, pateikti modeliui ar vykdyti.

Duomenis rinkusio projekto kenkėjišku nevadinu. Jo tapatybė ir pirminis šaltinis neviešinami, kol vyksta redakcinė bei atsakingo atskleidimo peržiūra. Vien pagal viešą ištrauką skaitytojas negali savarankiškai atkurti šio konkretaus sutapimų skaičiaus. Šis radinys yra priežastis greta veikiančio kodo tikrinti išsaugotus README fragmentus ir rekomendavimo įvestis. Katalogo pavadinimas "validated" nepaaiškina, kas buvo patikrinta.

## Daugiau radinių, kurių tapatybės neviešinamos

Pagal datas apribota paieška taip pat rado dvi kandidates, kurių nebuvo nė viename iš dviejų fiksuotų palyginimo sąrašų. Nė vienai čia neskelbiamas viešas kenkėjiškumo verdiktas.

Kandidatė A teigė esanti oficiali MCP integracija. Peržiūrėtame katalogų medyje buvo licencija, README, ignoruojamų failų sąrašas ir kodo ruošinys, sudarytas iš komentaro. Tačiau diegimo instrukcijos nukreipė skaitytoją į slaptažodžiu apsaugotą archyvą, liepė išjungti apsaugą ir prašė paleisti administratoriaus teisėmis. GitHub savo [oficialų MCP serverį](https://github.com/github/github-mcp-server) prižiūri atskirai. Žodis "official" README tekste tokio ryšio neįrodo.

Kandidatė B reklamavo atvirąjį kodą, licenciją, patikrintą SHA-256 ir švarų patikros rezultatą. Peržiūrėtoje versijoje repozitorijos medyje buvo tik README. Ji nepateikė nei deklaruoto kodo ir licencijos, nei paskelbtos maišos reikšmės ar nepriklausomos patikros įrašo. Ženklelis su užrašu "verified" įrodo, kad kažkas pasirinko tokį užrašą.

Šiuos radinius verta peržiūrėti toliau. Dvejetainių failų elgesys lieka nežinomas. Jei dabar paskelbčiau jų pavadinimus kaip patvirtintą kenkėjišką programinę įrangą, pagrįstą tyrimo kryptį paversčiau neparemtu kaltinimu. Todėl identifikuojanti medžiaga lieka privačiame tyrimo įraše.

Kontrolinė patikra taip pat rado įprastą saugumo įgūdį be šiai kampanijai būdingo archyvo ar atsisiuntiklio peržiūrėtoje medžiagoje. Paieška pagal "security", "MCP" ar "Cursor" gali grąžinti projektą, kuris daro kaip tik tai, ką žada jo pavadinimas. Užklausa padeda rasti, ką peržiūrėti.

## Instrukcija gali slypėti būtinoje priklausomybėje

Archyvas šalia įgūdžio yra vienas patekimo kelias. [Snyk 2026 m. vasario 5 d. ToxicSkills tyrimas](https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/) aprašo kitą: pačią paruošimo instrukciją. Jame įvardyti keturi įgūdžių keliai vienoje GitHub repozitorijoje. Spalio 9 d. nepriklausomai perskaičiau tris atitinkamus įdėtų katalogų `SKILL.md` failus ties commitu `b857b9cb9154c9be6f63295cca91d331be28c250`: `clawhub`, `whatsapp-mgv` ir `coding-agent-1gx`.

Visi trys pateikia išorinį įrankį kaip būtiną įprastam veikimui. Windows paruošimo instrukcijos prašo slaptažodžiu apsaugoto leidimo ZIP ir jo įrankio paleidimo. macOS instrukcijose yra ta pati Base64 eilutė. Dekoduojant ją vien kaip tekstą matyti HTTP atsisiuntimas, perduodamas komandų interpretatoriui. Matoma diegiklio etiketė nurodo HTTPS domeną, o dekoduota paskirtis yra kitas pažodinis IP adresas per HTTP. Vykdomoji komanda ar aktyvi kenkėjiško komponento nuoroda čia nepateikiama. [Fiksuotų versijų šaltinių stebėjimai](/assets/data/fakegit-ai-skills-v1/toxicskills-source-observations.json) nurodo kelius, blob identifikatorius ir eilutes.

![Įgūdžio paruošimo eilutės su uždengtu atsisiuntimo adresu ir įterpta komanda.](/assets/img/posts/fakegit-ai-skills/chrome-toxic-skill-prerequisite-v2.webp)

*Įgūdžio paruošimo instrukcija su uždengtu atsisiuntimo adresu ir komanda.*

Vėlesnis bandymas gauti paskelbtą Windows archyvą grąžino HTTP 404 ir nedavė baitų. Ši nepavykusi užklausa netikrino užkoduotos macOS paskirties.

Čia patikrinau dabartinį šaltinį pagal jau paskelbtą tyrimo kryptį. Įrašyta commito data yra vasario 26 d., ne spalio 9 d. Pradinės šios instrukcijos įtraukimo datos nenustačiau. Snyk nurodytų kelių repozitorijos šaknyje peržiūrėtoje versijoje nėra, tačiau atitinkami įdėtų katalogų keliai yra. Tai neįrodo perkėlimo ar pervadinimo. Ketvirtas failas neskaitytas. Tekstas pagrindžia paslėptą vykdymo sąlygą, ne stebėtą kompromitavimą, išvadą apie dabartinio prižiūrėtojo ketinimus ar ryšį su FakeGit.

## Ta pati sąlyga kituose įgūdžių šaltiniuose

Toliau ieškojau dekoduoto IP, jam būdingo kelio, leidimo failo pavadinimo ir būtinos priklausomybės formuluotės. Šešios tiesioginės GitHub API užklausos grąžino 120 pirmųjų puslapių eilučių, atitinkančių 105 šaltinio failus 38 repozitorijose. Peržiūrėtos keturių atrinktų repozitorijų fiksuotos versijos. Viena buvo aiškiai pažymėta demonstracija ir atmesta.

Kitose trijose pavojingos paruošimo instrukcijos išliko boto įgūdžių kataloge, programos agento įgūdžių kataloge ir MCP įgūdžių bibliotekoje. Boto įgūdyje buvo identiška užkoduota HTTP atsisiuntimo ir paleidimo komandų interpretatoriumi instrukcija. Kitos dvi nukreipė į slaptažodžiu apsaugotą ZIP ir išorinį komandos įrašą. Šių išorinių teksto paskirčių nelankiau. Archyvų nuorodos neįrodo baitų sutapimo.

MCP bibliotekoje atsektas plitimo kelias šaltinio kode. Failų sistemos režimu indeksavimas priima įgūdį su tinkamais metaduomenimis. Pasirinkus tą įgūdį, įkėliklis perskaito visą vietinį Markdown failą ir grąžina jį kaip MCP įrankio turinį. Peržiūrėtas kelias paruošimo instrukcijos nepašalina. Programa gali teikti pirmenybę iš anksto parengtam rinkiniui, kurio turinys neperžiūrėtas. Serverio nekviečiau, nestebėjau kliento įkeliant šį failą ir neparodžiau modelio vykdant instrukciją.

Ankstesnėje bendroje paieškoje toje pačioje bibliotekoje perskaičiau apsauginio skenerio įgūdį. Jo grėsmingas žodynas buvo aptikimo gairės. Kitame faile buvo pavojinga paruošimo sąlyga. Abu stebėjimai pagrįsti, tačiau nė vienas nepatvirtina visos bibliotekos saugumo ar kenkėjiškumo. Trijų kandidačių tapatybės lieka privačios, kol peržiūrima kilmė ir informavimo galimybės. Jų tekstas neįrodo kenkėjiškų prižiūrėtojo ketinimų ar ryšio su FakeGit.

Atskiroje bendroje paieškoje po dešimties užklausų peržiūrėtos šešios atrinktos repozitorijos. Papildinių paieškoje po keturių kodo užklausų peržiūrėti trys atvejai. Peržiūrėti keliai pasirodė esantys prisijungimo duomenų skaitymo blokavimo kodas, vietiniai pagalbiniai įrankiai ar atskleistos grįžtamųjų užklausų funkcijos. Kenkėjiškas leidėjas nenustatytas. [Bendros paieškos įrašai](/assets/data/fakegit-ai-skills-v1/broader-ai-tooling-observations.json), [papildinių stebėjimai](/assets/data/fakegit-ai-skills-v1/plugin-observations.json) ir [anoniminiai susijusių įgūdžių radiniai](/assets/data/fakegit-ai-skills-v1/toxicskills-sibling-observations.json) išsaugo atskiras apimtis. Iš šių mažų imčių negalima spręsti apie paplitimą visoje ekosistemoje.

## Sekti IOC paskirtį, ne vien jo užrašą

Užmaskuoto Lua archyvo nario SHA-256, Git medžio blob identifikatorius, archyvo maišos reikšmė ir blokų grandinės kontrakto adresas nurodo skirtingus objektus. Juos sumaišius lengva pamatyti stipresnį ryšį, nei leidžia įrodymai.

Pavyzdžiui, medžio Git blob identifikatorius neįrodo, kad archyvas sutampa su senesniu kito tyrėjo užfiksuotu SHA-256. Viešos reputacijos patikros rezultatas aprašo tos paslaugos įrašą apie konkrečius baitus konkrečiu metu. Jei vieno bandymo izoliuotoje aplinkoje metu scenarijus nesikreipė į tinklą, tai dar neįrodo, kad jis nepavojingas.

### Ką grąžino paieška pagal pažodines IOC reikšmes

Aštuonios tiesioginės GitHub API kodo užklausos su kabutėse įrašytais IOC grąžino 61 pirmųjų puslapių eilutę, atitinkančią 49 fiksuotų versijų failus 28 repozitorijose. Kiekvieną ieškotą reikšmę patikrinau viename visame šaltinio tekste. Tai aštuonios patikros keturiuose failuose, ne visų 49 failų peržiūra. Ankstesnė pagalbinė paieška turėjo kitą imtį ir grąžino nesusijusių failų pavadinimų fragmentų. Jos dažnio ribojimo klaidos įrašytos atskirai.

Atrinkti pažodinių reikšmių kontekstai daugiausia vedė į pranešimus ir IOC sąrašus. Getter taip pat pasitaiko [nesusijusiame QuillCTF Solidity kode](https://github.com/DeFiHackLabs/Web3-CTF-Intensive-CoLearning/blob/d084f6026b05148455e50b3aae8c0750d1976327/Writeup/Tanner/src/QuillCTF/PseudoRandom.sol#L47). Sekant pranešimų kontekstą pasiektos dvi papildomos jau žinomos repozitorijos, pateiktos aukščiau. Pati tiesioginės API paieška naujos platinimo repozitorijos nepatvirtino. [Užklausų ir šaltinių stebėjimai](/assets/data/fakegit-ai-skills-v1/exact-ioc-github-observations.json) išsaugo šį skirtumą.

### Nuo pasyvaus failų ryšio atgal iki README

Pasyviame VirusTotal vaizde radau dar vieną kelią atgal į GitHub šaltinius. Jo "Communicating files" vaizde buvo rodoma 547 ryšių. Atrinkau dvi failo pavadinimo ir maišos reikšmės eilutes. Ši žyma nereiškia, kad išanalizavau 547 failus, ir neįrodo, kad pats neatidarytas ZIP siuntė tinklo užklausą.

Keturios pirminės GitHub API užklausos ieškojo dviejų kabutėmis apribotų failų pavadinimų paminėjimų ir dviejų SHA-256 reikšmių. Jos grąžino dvi eilutes, atitinkančias du README failus dviejose repozitorijose. Abi maišos reikšmių paieškos grąžino nulį eilučių. Tai indeksuoto šaltinio teksto paieška, ne paieška ZIP turinyje. Patikrinti abu atrinkti README ir jų išsamūs fiksuotų versijų medžiai. Dabartinės versijos sutapo su paieškos fiksuotomis versijomis. Šis etapas atskiras nuo aštuonių anksčiau aprašytų IOC užklausų.

Vienas rezultatas, `nunzioaccording289 / ai-skill-hub`, jau buvo Island fiksuotame sąraše. Jo tik README pakeitęs commitas `8da0c76fa95af93cf3975f927ebcea81857605c9`, kurio laikas įrašytas spalio 9 d. 13:53:13 UTC, pakeitė dvi Markdown paskirtis į tiesioginį archyvą kintančioje `main` šakoje. Medyje liko `subpiston/hub_skill_ai_1.6.zip`, kurio dydis 476 614 baitų. Šio archyvo negavau. Istorinės Island ir platformos maišos reikšmės sutapimas nepatvirtina dabartinio Git blob SHA-256.

Antro rezultato nebuvo nė viename fiksuotame sąraše. Vieno ženklelio paskirtis ir dvi atskiros URL eilutės pakeistos į archyvą šalia įgūdžio. Jo archyvas vėliau išsaugotas anksčiau pateiktam anoniminiam statiniam palyginimui. Tapatybė ir ją atskleidžiančios failo pavadinimo bei maišos reikšmės užklausos lieka privačios, todėl vieša ištrauka neleidžia visiškai atkurti tų dviejų užklausų. Nebuvimas palyginimo failuose neįrodo pirmo atskleidimo.

![VirusTotal Communicating Files lentelė su uždengta neviešinamos kandidatės eilute.](/assets/img/posts/fakegit-ai-skills/chrome-vt-related-files-v2.webp)

*Failų ryšiai, panaudoti tolesnei GitHub paieškai. Kandidatės duomenys uždengti.*

[Paieškos pagal failų pavadinimus stebėjimai](/assets/data/fakegit-ai-skills-v1/vt-github-pivot-observations.json) išsaugo atskirą keturių užklausų apimtį ir žinomos repozitorijos šaltinio nuorodas. Platformos ryšys dėl to netampa stebėtu galinio įrenginio elgesiu.

### Perskaityti rodyklę nelankant grąžinto adreso

FakeGit analizėse nurodytas Polygon adresas ypač naudingas, nes jo grąžinamą C2 vietą galima patikrinti nieko neprašant iš paties C2. Paskelbtas kontraktas yra `0x1823A9a0Ec8e0C25dD957D0841e3D41a4474bAdc`, jo getter selektorius `0x3bc5de30`.

Gavau dvi paskelbtas atnaujinimo transakcijas, patikrinau jų sėkmingo įvykdymo įrašus ir dekodavau įvestį. Tik skaitymo užklausos ankstesnio bei atnaujinimo blokų pabaigoje atkūrė šias reikšmes:

| Bloko laikas, UTC | Atnaujinimo blokas | Ankstesnio bloko reikšmė | Atnaujinimo bloko reikšmė |
| --- | --- | --- | --- |
| 2026 m. rugpjūčio 11 d., 08:06:16 | `91820366` | `hxxp://83.97.20[.]150` | `hxxp://194.48.248[.]94` |
| 2026 m. rugsėjo 17 d., 19:33:16 | `93979042` | `hxxp://194.48.248[.]94` | `hxxp://185.10.68[.]110` |

[Rugpjūčio transakcija](https://polygonscan.com/tx/0x88b650e20a3e22cf9eddb07fe66221bbd83f8e16dc58aa71fd5f52fe1546e98f) ir [rugsėjo transakcija](https://polygonscan.com/tx/0x086f877cf8227cdc9ce2bcd905f121e0ea8449fb9216e38c506ccdbb16424fbf) yra vieši atskaitos taškai. Tai būsenų palyginimas blokų pabaigoje, ne vykdymo pėdsakai prieš pat kiekvieną transakciją ir iškart po jos.

![Rugsėjo 17 d. Polygon transakcijos duomenys: būsena, blokas, laikas ir atnaujinimo įvestis.](/assets/img/posts/fakegit-ai-skills/chrome-polygon-transaction-v2.webp)

*Rugsėjo 17 d. Polygon transakcija: būsena, blokas, laikas ir atnaujinimo įvestis.*

Dabartinei patikrai dRPC ir PublicNode nepriklausomai grąžino `hxxp://185.10.68[.]110` bloke `95232281`, kurio laikas yra spalio 9 d. 13:47:21 UTC. Bloko maišos reikšmė yra `0x5bd844e2348bfd3ce6d868d98f66865baac5cabcebf7b0d40a3dfbc5e37d1c4e`. Tai atkuria nuorodos reikšmės kaitą ir dabartinę reikšmę konkrečiu laiku. Apiiro šias paskirtis jau buvo paskelbusi. Naujų serverių neatradau ir jų pasiekiamumo netikrinau.

[Dviejų ThreatFox įrašų](https://threatfox.abuse.ch/ioc/1954488/) ["first seen" lauke nurodyta spalio 6 d.](https://threatfox.abuse.ch/ioc/1954489/). Šis katalogo laikas vėlesnis nei nepriklausomai atkurti rugpjūčio ir rugsėjo būsenų pakeitimai. Jis negali nurodyti kampanijos pradžios.

Failų maišos reikšmės suteikė dar vieną naudingą paieškos kryptį. [Atomdrift birželio 13 d. analizė](https://atomdrift.org/discoveries/2026/06/surf-byo-interpreter/) nurodo tą patį `uix.txt` SHA-256 kaip kovo mėn. Derp tyrimas. Atomdrift aprašo vykdymą su stebėjimo instrumentais, kurio metu atskleistas ekrano kopijų darymo elgesys. Tai autoriaus dinaminiai įrodymai, ne vykdymas, atliktas šiame tyrime. Jie taip pat nepatvirtina visų galimų vėlesnių kenkėjiškų komponentų.

Pranešimai skirtingai apibūdina interpretatorių, kurio SHA-256 yra `f3e34c9e36f3be065d80d456281d31dd1cc85eb4980db7fa8c1b0eb6f29c25d8`. [Derp](https://www.derp.ca/research/fakegit-luajit-github-campaign/) jį pateikia kaip 878 KB V2a vykdomąjį failą, o vasario 878 KB dvejetainį failą apibūdina kaip modifikuotą kenkėjiškiems tikslams. [Atomdrift](https://atomdrift.org/discoveries/2026/06/surf-byo-interpreter/) nurodo tą pačią maišos reikšmę, bet interpretatorių vadina nemodifikuotu. Šio nesutarimo dėl kilmės neišsprendžiau. Tai kitas vykdomasis failas nei anksčiau pateiktame išsaugotame pavyzdyje. Nė vienas apibūdinimas nepatvirtina šiame tyrime atskirai išsaugoto DLL autentiškumo.

[Spectrum spalio 8 d. tęsinys](https://www.spectrum.security/blog/fake-onionclaw-infostealer) nurodo tą patį kontraktą ir getter netikrame OnionClaw pakete bei atkuria StealC šeimos grandinę. Jame taip pat aprašyti atkuriant grandinę nesutapę atsakymų raktai. Šių stebėjimų negalima pateikti kaip nenutrūkstamo vykdymo aukos įrenginyje pėdsako. Mano istorinė patikra per dRPC atkūrė ten nurodyto bloko `95019999` reikšmę. PublicNode šios istorinės užklausos nepriėmė, todėl dviejų teikėjų sutapimas patvirtintas tik fiksuoto dabartinio bloko rezultatui.

Grėsmių žvalgybos laiko žymas skaitau taip pat atsargiai. Platformos pateikimo arba "first seen" laukas gali nurodyti jos pačios įrašo laiką, o ne pirmą infrastruktūros gyvavimo dieną. Adreso pasikeitimas kontrakto būsenoje taip pat neįrodo, kad tuo metu persijungė visi užkrėsti įrenginiai. Talpykloje gali likti senesnių etapų, o klientai gali veikti skirtingai.

## Ankstesni tyrimai paaiškina skirtingas grandinės dalis

Atsisiuntimo nuorodų pakeitimas atsirado anksčiau nei šis tyrimas. Check Point [2024 m. liepos Stargazers tyrimas](https://research.checkpoint.com/2024/stargazers-ghost-network/) aprašo išlikusias masalo repozitorijas, nukreipiančias į pakaitinius kenkėjiškus leidimus. Tai svarbus ankstesnis pavyzdys, bet dėl jo Stargazers ir FakeGit netampa viena operacija.

[2026 m. sausio GitHub Community pranešimas](https://github.com/orgs/community/discussions/184751) pateikia datuotą perspėjimą apie README nuorodas, perkeliamas į ZIP failus. [Derp kovo analizė](https://www.derp.ca/research/fakegit-luajit-github-campaign/) nagrinėja LuaJIT paketą ir paskirties gavimą per Polygon. [Hexastrike balandžio tyrimas](https://hexastrike.com/resources/blog/threat-intelligence/cloned-loaded-and-stolen-how-109-fake-github-repositories-delivered-smartloader-and-stealc/) seka grandinę nuo SmartLoader iki StealC. Šie šaltiniai suteikia skirtingų rūšių įrodymus, ne tarpusavyje sukeičiamus kampanijos dydžio skaičius.

[ASEC 2025 m. rugpjūčio 8 d. analizė](https://asec.ahnlab.com/en/89551/) seka SmartLoader iki Rhadamanthys. Taigi SmartLoader pavadinimas savaime nenurodo galutinio kenkėjiško komponento. [Netskope 2026 m. kovo tyrimas](https://www.netskope.com/blog/openclaw-trap-ai-assisted-lure-factory-targets-developers-gamers) taip pat atskiria naudingą nukopijuotą projekto pagrindą nuo archyvo, reklamuojamo atsisiuntimo ženkleliu.

[Orchid birželio darbas](https://orchidfiles.com/github-repositories-distributing-malware/) paaiškina, kodėl GitHub įvykių istorija gali padėti rasti repozitorijas, kurių nepastebi viena teksto užklausa. [Island liepos AgentBaiting tyrimas](https://www.island.io/blog/agentbaiting-how-800-fake-ai-skills-and-mcp-servers-delivered-malware) seka masalus į DI įrankių paiešką ir fiksuoja skirtingus agentų eksperimentų rezultatus. Tai, kad modelis kartais atmeta masalą, taip pat svarbu kaip ekrano kopija, kurioje jis jį priima.

## Ką keisčiau peržiūros procese

Prieš peržiūrėdami įgūdį užfiksuokite tikslią repozitoriją ir commitą. Reklamuojamą atsisiuntimo paskirtį nagrinėkite kaip duomenis, tada patikrinkite atitinkamą katalogų medį. Teisėto pirminio projekto pavadinimas yra paieškos terminas, ne leidėjo tapatybė.

Diegdami patikrinkite, kokie failai pasieks diską ir kaip veiks priklausomybės. Peržiūrėkite ir diegiklio versiją, ir patį įgūdį. Pasirinktas `SKILL.md` nebūtinai aprašo visą kopijuojamą katalogą.

Fiksuokite tas ribas, kurias iš tiesų galite užfiksuoti. Konkretus repozitorijos commitas stabilizuoja jos medį. Jis neužfiksuoja README paskirties, naudojančios `main`, atskirai pakeičiamo leidimo failo, paketo, parenkamo pagal kintančią žymą, ar nuotolinės MCP paslaugos elgesio. Saugokite patvirtintų baitų maišos reikšmę ir pakartotinai tikrinkite išorines paskirtis, kai jos keičiasi.

Vietinių MCP serverių atveju peržiūrėkite paleidžiamą komandą ir argumentus. [MCP projekto saugumo gairės](https://modelcontextprotocol.io/docs/draft/tutorials/security/security_best_practices) vietinį vykdymą laiko prieigos prie sistemos riba ir rekomenduoja aiškų sutikimą bei izoliavimą. Draugiškas serverio pavadinimas neaprašo jo proceso teisių. Pagal [stdio transporto specifikaciją](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports#stdio), klientas paleidžia serverį kaip atskirą procesą. Paleisti nepatikimą vietinį stdio MCP serverį vien tam, kad skeneris išvardytų jo įrankius, jau reiškia peržengti vykdymo ribą. Prieš jungdamasis peržiūrėčiau šaltinį ir paleidimo konfigūraciją.

Teiginiams apie antivirusinės patikros rezultatus reikalaukite ataskaitos apie konkretų failą. Slaptažodžio apsauga, administratoriaus teisių prašymas ir nurodymas išjungti apsaugą yra priežastys sustoti ir peržiūrėti, užuot automatiškai praleidus perspėjimą. Nė vienas šių požymių atskirai nenustato kenkėjiškos programinės įrangos šeimos.

Paieškos rezultatuose atskirkite atradimo, šaltinio commito, pranešimo ir dabartinio stebėjimo laikus. Kiekvieną ryšį saugokite kartu su jo įrodymu: README nukreipia į archyvą, medyje jis yra, viešas duomenų rinkinys pažymi senesnę maišos reikšmę, kontraktas grąžina adresą. Greta išvardyti indikatoriai negali pakeisti šių ryšių.

## Nuo kodo peržiūros iki incidento tyrimo

Reakcija priklauso nuo to, kuri riba peržengta. Pasikeitus patvirtintai atsisiuntimo paskirčiai, pristabdykite diegimą ir peržiūrėkite pakeitimą. Žinomas archyvas diske patvirtina, kad ten buvo tie baitai. Nei viena, nei kita neįrodo vykdymo. Netikėtas vykdymas ar susijęs galinio įrenginio apsaugos perspėjimas jau priklauso organizacijos incidentų valdymo procesui. Užkoduota eilutė nėra incidento bilietas, kuriame nuobodžioji dalis stebuklingai užsipildė pati.

| Atsakingi | Priežastis peržiūrėti | Įrodymai ir kitas veiksmas | Klaidingi suveikimai ir ribos |
| --- | --- | --- | --- |
| AppSec / kūrėjų platformos komanda | Patvirtintas įgūdis pakeičia atsisiuntimo paskirtį, prideda archyvą ar keičia paleidimą | Išsaugoti fiksuotos versijos pakeitimą, susijusį katalogų medį ir patvirtintų failų bei priklausomybių sąrašą. Pristabdyti diegimą ar atnaujinimą, kol patikrintas leidėjas ir paskirties baitai. | Nuorodas keičia ir teisėti leidimų perkėlimai. Vien README pakeitimas neįrodo paskyros vagystės ar vykdymo. |
| MCP platformos prižiūrėtojas | Keičiasi vietinio paleidimo komanda, priklausomybė, prieigos apimtis ar grąžinamas nurodymas | Palyginti tikslią komandą, argumentus, versijas, teises ir patvirtintus metaduomenis. Prieš paleidžiant nepatikimą serverį peržiūrėti kodą ir konfigūraciją. Iš naujo patvirtinti pakeistas teises. | Įrankių aprašai keičiasi ir per įprastus atnaujinimus. Metaduomenų maiša neužfiksuoja dvejetainių failų, priklausomybių ar nuotolinės būsenos. |
| SOC | Įrenginyje randama paskelbta archyvo maiša ar jam priskiriamas komponentas | Išsaugoti tikslią maišą, gavimo šaltinį, kelią, įrenginį, naudotoją ir laikus. Taikyti esamą radinių tvarkymo politiką ir nustatyti, ar failai išpakuoti ar vykdyti. | Laboratorijose ir atsisiuntimų podėlyje gali būti tokių baitų be užkrėtimo. Įprasta Lua DLL nurodo vykdymo aplinką, ne kenkėjiškos programos šeimą. |
| SOC / incidentų valdymo komanda | Netikėtas procesas naudoja gretimą Lua ar tekstinį failą arba apsauga praneša apie susijusį vykdymą | Surinkti proceso failą ir maišą, komandų eilutę, tėvinį procesą, naudotoją, sesiją ir stabilų proceso identifikatorių. Tirti procesų grandinę. Dėl izoliavimo ir prisijungimų ar sesijų peržiūros spręsti pagal esamą incidentų politiką. | Lua ir tekstinio pavadinimo įvestis naudoja žaidimai bei patvirtinta automatika. Vien panašūs failų vardai nepatvirtina šios grandinės. |
| SOC / tinklo komanda | Išeinantis ryšys susiejamas su tiriamu procesu | Susieti su procesu susieto ryšio paskirties adresą ir laiką, faktinį vardą ar IP bei turimą HTTP matomumą su įrenginio įrodymais. Blokavimą grįsti patvirtintais indikatoriais ir veiklos kontekstu. | Blockchain RPC ir `eth_call` turi teisėtų paskirčių. TLS metaduomenys neatskleidžia kontrakto ar selektoriaus. Bendras viešas RPC adresas nepagrindžia viso jo blokavimo dėl kampanijos. |

Tai siūlomi atrankos sprendimai, ne šiame tyrime įvertintos aptikimo taisyklės. Neturiu aukos procesų įrašo ar išmatuoto taisyklės tikslumo. Windows paieškoms [Sysmon](https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon) 1 įvykis pateikia proceso kontekstą ir sukonfigūruotas maišas. Ryšiams naudokite ProcessGuid ir laikus, ne vien PID. Tinklo ryšių (3 įvykis) ir modulių įkėlimo (7 įvykis) duomenų rinkimas pagal numatytuosius nustatymus išjungtas. 11 įvykis fiksuoja sukūrimą ar perrašymą, ne bet kokį skaitymą. 22 įvykis fiksuoja DNS užklausas. Jis neatmeta tiesioginio ryšio su IP. Prieš aiškindami trūkstamą įvykį patikrinkite rinkimo nustatymus ir saugojimo trukmę.

Bet kokį susiejimą patikrinkite su patvirtintomis Lua programomis, teisėtomis užkoduotomis konstantomis, įprastais ZIP ištekliais ir blockchain klientais. Lua, PowerShell, `BitBlt` ir `eth_call` turi teisėtų panaudojimo būdų. Vertingas signalas yra įrodymais pagrįstas ryšys tarp kilmės, teisių ir netikėto elgesio.

## Kas lieka neatsakyta

Vėlesnių komponentų baitai, bet koks vykdymas aukos įrenginyje ir pradinė prieiga, leidusi pakeisti repozitorijos priežiūrą, lieka nežinomi. Du fiksuotų versijų archyvai išsaugoti ir jų maišos reikšmės sutapo. Jų perskaitomiems paleidimo failams ir Lua atlikta ribota statinė peržiūra. PE analizuota tik žinomo pavyzdžio perskaitoma DLL. Nė vienam vykdomajam failui nepriklausoma PE analizė neatlikta. Vieši commitų metaduomenys nepasako, kas valdė paskyrą, ar savininkas pastebėjo pakeitimą ir kaip gauti prisijungimo duomenys.

Neviešinamos kandidatės galėjo būti aprašytos kituose šaltiniuose už palyginimo sąrašų ribų. Visas Apiiro sąrašas nebuvo viešas, todėl negaliu teigti, kad jos jį išplečia. Patvirtintas šio darbo indėlis apima datuotus commitų ir medžių pakeitimus, sąlyginę diegiklio analizę, išsaugoto duomenų rinkinio radinį, atskirą paiešką pagal failų pavadinimus, ribotą statinį išmaskavimą ir nepriklausomai atkurtą nuorodos reikšmių istoriją. Tolesniam išpakavimui, dinaminei analizei ir koordinuotam atskleidimui reikia atskirų įrašų ir peržiūros.

## Papildomi stebėjimai ir prieigos ribos

[Metodika](/assets/data/fakegit-ai-skills-v1/methodology.md), [viešinimui parengti GitHub stebėjimai](/assets/data/fakegit-ai-skills-v1/github-observations.json), [pasyvūs IOC stebėjimai](/assets/data/fakegit-ai-skills-v1/ioc-observations.json) ir [vaizdų kilmės duomenys](/assets/data/fakegit-ai-skills-v1/figures.json) išsaugo viešąsias šios peržiūros dalis. Juose nėra kenkėjiško archyvo ar neviešintos kandidatės tapatybės. Vaizdų maišos reikšmės identifikuoja fiksacijas, ne archyvo baitus ar užkrėtimą.

Bandžiau pasiekti kiekvieną nuorodą Apiiro skiltyje "Prior Work". Trend Micro puslapis per čia naudotą skaitymo priemonę nepateikė išsamaus turinio. akj puslapis blokavo automatizuotą skaitymą, ir šio apribojimo laikiausi. [Reddit pranešimas](https://www.reddit.com/r/github/comments/1isxhas/if_youre_creating_new_repositories_they_are_being/) yra ankstyvas atskiras liudijimas. [Rushter kodo peržiūra](https://rushter.com/blog/github-malware/) pateikia paieškos šablonus, tačiau rodo paskutinio atnaujinimo datą, ne įrodytą pirmo paskelbimo datą. Šiuos prieigos ir šaltinių pobūdžio skirtumus palikau įrodymų įraše.

## Šaltiniai

Šaltiniai, naudoti tekste ir viešuose šaltinių stebėjimuose.

### Tyrimai

- [Apiiro - Never Deleted, Only Re-Pointed](https://apiiro.com/blog/never-deleted-only-re-pointed)
- [Island - AgentBaiting](https://www.island.io/blog/agentbaiting-how-800-fake-ai-skills-and-mcp-servers-delivered-malware)
- [Snyk - ToxicSkills](https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/)
- [Derp - FakeGit ir LuaJIT](https://www.derp.ca/research/fakegit-luajit-github-campaign/)
- [Hexastrike - SmartLoader ir StealC](https://hexastrike.com/resources/blog/threat-intelligence/cloned-loaded-and-stolen-how-109-fake-github-repositories-delivered-smartloader-and-stealc/)
- [ASEC - SmartLoader analizė](https://asec.ahnlab.com/en/89551/)
- [Netskope - OpenClaw masalų kūrimas](https://www.netskope.com/blog/openclaw-trap-ai-assisted-lure-factory-targets-developers-gamers)
- [Orchid - kenkėjišką programinę įrangą platinančios GitHub repozitorijos](https://orchidfiles.com/github-repositories-distributing-malware/)
- [Atomdrift - surf paketas ir pridėta vykdymo aplinka](https://atomdrift.org/discoveries/2026/06/surf-byo-interpreter/)
- [Spectrum - netikras OnionClaw ir duomenų vagystė](https://www.spectrum.security/blog/fake-onionclaw-infostealer)
- [Check Point - Stargazers Ghost Network](https://research.checkpoint.com/2024/stargazers-ghost-network/)
- [Rushter - kenkėjiško GitHub kodo peržiūra](https://rushter.com/blog/github-malware/)

### Fiksuotos kodo ir duomenų rinkinių versijos

- [Island repozitorijų ir maišos reikšmių rinkinys, versija 72b77c0](https://github.com/island-io/island-security-research-artifacts/blob/72b77c0e2cc53cae92acd27258cf229077e1bfca/agentbaiting/malicious-repositories-and-zip-hashes-2026-07.csv)
- [Orchid repozitorijų sąrašas, versija 5ffa27e](https://github.com/orchidfiles/git-malware-finder/blob/5ffa27e2bc9dce7758379519aa6a272438b01192/full-list.txt)
- [Vercel skills diegiklis ir katalogų kopijavimas, versija e878c45](https://github.com/vercel-labs/skills/blob/e878c4502674f84094dc27b5ad94ddaf64f22551/src/installer.ts#L371)
- [Prometheus EncryptStrings, versija a4efc5f](https://github.com/prometheus-lua/Prometheus/blob/a4efc5f381c50ae2a111bdbb9272fa3203685be3/src/prometheus/steps/EncryptStrings.lua#L121)
- [Prometheus autorystės licencija, versija a4efc5f](https://github.com/prometheus-lua/Prometheus/blob/a4efc5f381c50ae2a111bdbb9272fa3203685be3/LICENSE)
- [QuillCTF selektoriaus sutapimo pavyzdys, versija d084f60](https://github.com/DeFiHackLabs/Web3-CTF-Intensive-CoLearning/blob/d084f6026b05148455e50b3aae8c0750d1976327/Writeup/Tanner/src/QuillCTF/PseudoRandom.sol#L47)

### Oficiali dokumentacija ir saugumo pranešimai

- [GitHub - oficialus MCP serveris](https://github.com/github/github-mcp-server)
- [Model Context Protocol - saugumo gairės](https://modelcontextprotocol.io/docs/draft/tutorials/security/security_best_practices)
- [Model Context Protocol - stdio transport](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports#stdio)
- [Microsoft - Sysmon](https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon)
- [Cursor saugumo pranešimas GHSA-pc9j-3qc2-95wv](https://github.com/cursor/cursor/security/advisories/GHSA-pc9j-3qc2-95wv)
- [Cursor saugumo pranešimas GHSA-hf2x-r83r-qw5q](https://github.com/cursor/cursor/security/advisories/GHSA-hf2x-r83r-qw5q)

### Vieši įrašai ir bendruomenės pranešimai

- [PolygonScan - rugpjūčio 11 d. atnaujinimo transakcija](https://polygonscan.com/tx/0x88b650e20a3e22cf9eddb07fe66221bbd83f8e16dc58aa71fd5f52fe1546e98f)
- [PolygonScan - rugsėjo 17 d. atnaujinimo transakcija](https://polygonscan.com/tx/0x086f877cf8227cdc9ce2bcd905f121e0ea8449fb9216e38c506ccdbb16424fbf)
- [ThreatFox - įrašas 1954488](https://threatfox.abuse.ch/ioc/1954488/)
- [ThreatFox - įrašas 1954489](https://threatfox.abuse.ch/ioc/1954489/)
- [GitHub Community - pranešimas apie README nukreipimus](https://github.com/orgs/community/discussions/184751)
- [Reddit - ankstyvas pranešimas apie repozitorijų kopijavimą](https://www.reddit.com/r/github/comments/1isxhas/if_youre_creating_new_repositories_they_are_being/)

### Teikėjų stebėjimai

Šie įrašai aprašo platformų stebėjimus, ne nepriklausomai stebėtą ryšį su C2.

- [VirusTotal - esami Communicating Files ryšiai](https://www.virustotal.com/gui/ip-address/185.10.68.110/relations)
- [urlscan - esamas skenavimo įrašas](https://urlscan.io/result/01a11335-62e8-74da-b047-058c3c79a3e7/)
