---
title: "FakeGit, DI įgūdžiai ir nuolat keičiamas atsisiuntimo kelias"
card_title: "FakeGit ir DI įgūdžių tiekimo grandinė"
description: "GitHub ir IOC tyrimas: netikri DI įrankiai, originalūs archyvų failai, hex/XOR, AES ir RC4 atkūrimas nepaleidžiant malware."
seo_description: "Konkrečios GitHub versijos, atskiras OnionClaw payload, RC4 paslėptas collector adresas ir 21 Polygon adreso pakeitimas."
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
research_version: "1.1"
evidence_basis: "Konkrečios GitHub versijos, trys atskirų atvejų archyvai su patikrintais hash, ribota Lua ir PE peržiūra, hex/XOR/AES/RC4 atkūrimas. Vieši IOC, diegiklio bei MCP kodas, pasyvūs teikėjų įrašai ir blockchain atsakymai. Gauto kodo ar įterptų komandų nepaleidau."
methods: ["Ribota vieša GitHub ir IOC paieška", "Commit ir katalogų medžių palyginimas", "Statinė ZIP, PE, Lua ir hex/XOR/AES/RC4 peržiūra", "Diegiklio ir MCP kodo peržiūra", "Viešų sąrašų palyginimas ir pasikartojimų pašalinimas", "Esamų reputacijos įrašų ir blockchain atsakymų patikra"]
key_findings:
  - "Island sąrašo repo spalio 9 d. commit pakeitė tik README. Keturios Markdown nuorodos ir vieno paveikslėlio šaltinis pakeisti į tą patį archyvą šalia SKILL.md."
  - "Peržiūrėtas pirminio diegiklio kodas šalia esančio įprasto ZIP neatmeta. Jei diegiama šiuo keliu, failas atitinka kopijavimo sąlygas. Tai neįrodo automatinio vykdymo."
  - "Iš 14 pasirinktų anksčiau paskelbtų repo septynių ištekliai buvo perskaitomi, o septyni grąžino API 404. Iš to negalima spręsti, kokia visos kampanijos dalis pašalinta."
  - "Dvi atskiros tolesnės paieškos rado dar septynias Island sąrašo repo. Jų spalio 8 arba 9 d. commit pakeitė tik README archyvų nuorodas."
  - "Viename konkrečiu commitu išsaugotame duomenų rinkinyje radau 18 repo iš viešų kenkėjiškų repo sąrašų. Jų išsaugotuose README fragmentuose buvo ZIP nuorodų. Ar tie duomenys iš tiesų buvo indeksuoti arba naudoti rekomendacijai, nestebėjau."
  - "Pradiniame statinės analizės etape išsaugojau du archyvus ir patikrinau jų hash. Iš žinomo pavyzdžio užkoduoto teksto atkūriau 292 skirtingas perskaitomas reikšmes. Pavyzdžio nepaleidau."
  - "Atskira keturių užklausų paieška pagal failų pavadinimus ir hash grąžino du README. Viena repo jau buvo sąraše, kitos tapatybė lieka privati."
  - "Atskirame paskelbtame OnionClaw atvejyje gavau du užduočių failus su sutampančiais hash. Hex/XOR, AES ir RC4 patikros atkūrė vidinį PE bei tris tekstus, įskaitant collector adresą."
  - "Patikrinau 21 pasirinktą Polygon pakeitimą. Du teikėjai sutiko dėl keturių contract/getter porų konkrečiame spalio 9 d. bloke. Visos istorijos pilnumo netvirtinu."
scope: "Viešo GitHub ir IOC patikra 2026 m. spalio 9 d. Du fiksuoti palyginimo sąrašai, diegiklio ir MCP kodas, trys atskirų atvejų archyvai, du konkretaus commit OnionClaw užduočių failai. Statinis baitų atkūrimas, 21 pasirinktas Polygon pakeitimas ir keturių getter atsakymai per du teikėjus."
limitations: "Ribotas tyrimas, ne viso GitHub ar aukų įrenginių patikra. Ankstesni skill archyvai nesusieti su atskiru OnionClaw payload. Malware nepaleidau, prie C2 nesijungiau. Du ankstesni failų skaitymai nepavyko. Vėlesnio iššifruotų baitų skaitymo klaidos priežastis nežinoma, bandymas nekartotas. Paskelbti užduočių atsakymų raktai nesutampa su nepakeistu klientu. Istoriją tikrinau per vieną teikėją, jos pilnumo netvirtinu. API 404, bendra infrastruktūra ir nebuvimas sąrašuose neįrodo ištrynimo, operatoriaus ar naujumo."
---

Pradėjau nuo atsisiuntimo mygtuko. Repozitorijoje jis užima nedaug vietos. Patogu, jei kaip tik į tą dalį nenorima atkreipti peržiūrinčio žmogaus dėmesio.

Nukopijuotame projekte gali būti naudingo kodo, įprastas įgūdžio aprašas ir kelių mėnesių istorija. O README nuoroda gali siųsti skaitytoją visai kitur. Įrankio ieškančiam DI agentui kyla ir kitas klausimas: ką diegiklis nukopijuoja kartu su įgūdžiu?

Apiiro [spalio 6 d. tyrime](https://apiiro.com/blog/never-deleted-only-re-pointed) nurodo 17 610 veikiančių masalo repo, užfiksuotų 07:41 UTC. Atsisiuntimo adreso keitimą jie vadina "RePointing". Jų 97% rodiklis reiškia, kad pasikeitė tik README, ir taikomas 441 pakeitimui, kurį buvo galima atkurti. Tai Apiiro skaičiai. Pats šio repo tinklo nesuskaičiavau ir viso jo sąrašo negavau.

Patikrinau paskelbtus IOC pagal dabartinį GitHub kodą, perskaičiau diegiklio ir MCP kodą, peržiūrėjau viešus įrašus. Masalo teksto ieškojau ir kituose duomenų rinkiniuose. Vėliau išsaugojau du pasirinktus archyvus statinei peržiūrai. Papildomame etape gavau atskiro paskelbto OnionClaw atvejo archyvą ir du užduočių failus žemiau pateiktai analizei. Toliau atskiriu, ką rodo gauti baitai, ką nurodo kodas ir koks elgesys iš tiesų stebėtas.

Šiame darbe papildomai patikrinau šaltinius, diegiklį ir atkūriau dalį užkoduotų reikšmių. Polygon patikra atkartoja jau paskelbtus infrastruktūros duomenis. Jei pirmiausia reikia nuspręsti, kaip reaguoti, pereikite prie [saugumo komandos atrankos lentelės](#nuo-kodo-peržiūros-iki-incidento-tyrimo).

## Ką patikrinau

Repo paiešką apribojau sukūrimo datomis nuo 2026 m. liepos 11 d. iki spalio 9 d. Septynių paieškų pirmuose surikiuotuose rezultatų puslapiuose gavau 172 eilutes iš 162 skirtingų repo. Šešių pasirinktų repo peržiūrėjau kodą ir katalogų medį. Tai 162 paieškos rezultatai, ne 162 užbaigti auditai.

Atskirai pasirinkau 14 repo iš Island paskelbtų pavyzdžių ir su įgūdžiais bei MCP susijusių įrašų. Septynias galėjau perskaityti per GitHub API, kitos septynios grąžino 404. Rinkausi šiai temai svarbius pavyzdžius. Iš tokios imties negalima spręsti, kokia visos kampanijos dalis dar pasiekiama.

Palyginimui naudojau konkrečias sąrašų versijas:

| Įvestis | Versija | Ką skaičiavau |
| --- | --- | --- |
| Island liepos mėn. repo ir hash CSV | `72b77c0e2cc53cae92acd27258cf229077e1bfca` | 7 854 duomenų eilutės, 7 600 skirtingų repo pavadinimų, 7 115 skirtingų ZIP SHA-256 reikšmių |
| Orchid repo sąrašas | `5ffa27e2bc9dce7758379519aa6a272438b01192` | 9 330 skirtingų repo pavadinimų |

Kiekviena CSV eilutė susieja repo su hash. Ji neskaičiuoja atsisiuntimų, žmonių ar užkrėtimų. Be to, abiejų tyrėjų sąrašai persidengia. Sudėję jų antraščių skaičius gautume solidžiai atrodančią sumą, turinčią labai mažai analitinės vertės. Palyginimą galima pakartoti naudojant pirminį [Island duomenų rinkinį](https://github.com/island-io/island-security-research-artifacts/blob/72b77c0e2cc53cae92acd27258cf229077e1bfca/agentbaiting/malicious-repositories-and-zip-hashes-2026-07.csv) ir [Orchid sąrašą](https://github.com/orchidfiles/git-malware-finder/blob/5ffa27e2bc9dce7758379519aa6a272438b01192/full-list.txt).

Iš pradžių skaičiau tik metaduomenis ir tekstą. Pradiniame statinės analizės etape išsaugojau du ZIP iš konkrečių GitHub versijų. Patikrinau jų hash ir analizavau perskaitomus failus. Jokio pavyzdžio, diegiklio ar įterptos komandos nepaleidau. Užklausas siunčiau viešoms kodo ir grėsmių žvalgybos paslaugoms, ne paskelbtiems C2 adresams.

Išplėtęs paiešką atskirai pasirinkau 14 susijusių repo. Vienuolikai gavau perskaitomus commit ir jų katalogų medžius. Šešios jau buvo Island sąraše, penkių nebuvo nė viename iš dviejų fiksuotų sąrašų. Trys grąžino API 404. Dar vieno projekto kodą peržiūrėjau dėl toliau aptariamo duomenų rinkinio. Šias imtis atrinkau skirtingai. Jų sudėti ir sumos vadinti kampanijos dydžiu negalima.

## Įgūdžio README pakeitimas, datuotas spalio 9 d.

Viena Island liepos duomenyse jau nurodyta repo, `amanahmed2222 / skills`, dar buvo pasiekiama. Jos commit `84a4fdc3840133c30e283ee34adb730b49d3dff4` nurodo spalio 9 d. 13:37:13 UTC laiką. Konkrečios versijos tekstą dar kartą užfiksavau maždaug 13:44:36 UTC. Pirmas laikas yra commit metaduomenys, antras žymi mano patikrą.

Pasikeitė tik `README.md`. Keturios Markdown nuorodos iš repo puslapio pakeistos į ZIP kintančioje `main` šakoje. Vieno paveikslėlio šaltinis taip pat pakeistas į tą patį ZIP. Vadinti tai "penkiomis atsisiuntimo nuorodomis" būtų netikslu: viena jų yra paveikslėlio užklausa, kitos keturios yra nuorodos.

![README pakeitimų ištraukos: keturios nuorodos ir vieno paveikslėlio šaltinis nukreipti į ZIP.](/assets/img/posts/fakegit-ai-skills/chrome-readme-repoint-v2.webp)

*Keturios nuorodos ir vieno paveikslėlio šaltinis nukreipti į tą patį ZIP.*

Peržiūrėtame katalogų medyje šie failai yra kartu:

```text
skills/create-branch/
    SKILL.md
    Software_v2.0-alpha.3.zip
```

Katalogų medyje nurodytas archyvo dydis yra 487 650 baitų. Pats įgūdžio Markdown aprašo įprastą šakos kūrimą ir susiejimą su užduotimis. Tame faile, nepaisant didžiųjų ir mažųjų raidžių skirtumo, neradau `.zip`, `software_v`, `launcher` ar `luajit`. Peržiūrėjęs vien tas 25 eilutes, šalia esantį archyvą praleistum.

Island šią repo jau buvo įtraukusi į kenkėjiškų repo duomenų rinkinį. Pirmoji mano patikra patvirtino README pakeitimą ir archyvo įrašą kataloge. Vėliau gavau patį tos versijos archyvą statinei analizei. Jo SHA-256 tiksliai sutapo su senesniu Island įrašu. Toliau parodau, ką iš tų baitų pavyko patvirtinti nepaleidus failų.

Kitoje Island sąrašo repo, `waynestimulative605 / docker-mcp-gateway`, taip pat pakeistas tik README. Commit laikas nurodytas spalio 6 d. 06:14:03 UTC. Commit `6d3da0d79e7a3c6a2b8921bf6c7ba43b594e6b20` pakeičia dvi Markdown nuorodas į archyvą `main/docs/` kataloge. Katalogų medyje nurodytas 467 443 baitų dydis. Šie metaduomenys patvirtina failo įrašą kataloge. Jie nepatvirtina, kad archyvą dabar galima atsisiųsti ar kokie baitai būtų gauti.

![Fiksuota versija ir katalogo įrašai: SKILL.md greta ZIP archyvo.](/assets/img/posts/fakegit-ai-skills/chrome-skill-directory-v2.webp)

*SKILL.md ir ZIP archyvas tame pačiame create-branch kataloge.*

Išplėsta paieška rado dar penkias Island sąrašo repo. Jų commit pakeitė tik README archyvų nuorodas, o nurodyti laikai yra vėlesni nei Apiiro spalio 6 d. patikra. Atskirai sekdamas IOC, pranešimus ir pirminius šaltinius radau dar dvi. Lentelėje jas pateikiu kartu, o skirtingus atrankos būdus palieku papildomuose įrašuose:

| Anksčiau paskelbta repozitorija | Įrašytas commito laikas, UTC | Commitas |
| --- | --- | --- |
| `Sahilrajveer / reasonbench` | Spalio 8 d., 06:02:16 | `f4dbdcd8fe37732369793cd5a27ae00d8ca7dd80` |
| `Alejandro920 / Zhouyi` | Spalio 8 d., 06:13:03 | `31515265dd1bcf61ff9264d6582f3bf9f80ceabf` |
| `kaindrakonis / vibedev` | Spalio 8 d., 06:13:20 | `6875a1eeac41adaaffa5338b8d70e4996bf121c3` |
| `lozforlife120 / hyprzoom` | Spalio 9 d., 07:05:41 | `f5a79c7db98d8bc8a8edb7aff571f2edb50da74d` |
| `Adie0609 / suvadu` | Spalio 9 d., 07:14:09 | `70de2dc5008f76d23f31cd7dc6b2712d448d9a8a` |
| `guiziinn1 / modulout-llc` | Spalio 9 d., 07:01:21 | `5527079a8b63bb9aac7735fde88b19a1ba491661` |
| `Kalainilavann / takeout_downloader_script` | Spalio 9 d., 13:25:05 | `a28cb23c7dafe882ba3182311f987084a69494a2` |

Šie pakeitimai nukreipė README nuorodas į ZIP. Atitinkamų commit katalogų medžiuose buvo archyvų įrašai. Tai nauji stebėjimai apie jau paskelbtas repo, ne septynios naujai atrastos kenkėjiškos operacijos. Commit laikas nepasako, kas atliko pakeitimą. Tikslias šaltinių nuorodas ir katalogų medžių duomenis palikau papildomuose stebėjimuose.

Šie stebėjimai atitinka aprašytą platinimo modelį ir nereikalauja reklamuojamo "įrankio" paleisti darbiniame nešiojamajame kompiuteryje. Jis ir taip turi ką veikti.

## Nuo archyvo įrašo iki jo baitų

Spalio 9 d. 14:18:40 UTC gavau ZIP iš konkretaus `amanahmed2222 / skills` commit. Visi 487 650 baitų atitiko ir katalogų medžio Git blob `f8ef6f6e39990c57cbc35ca540c8c0895bfa97c4`, ir Island istorinį archyvo SHA-256 `06cd34cacbcc7046b7e0bac0cdfb6d94e79049cb974218dca247b28e619c59ac`. Pirmas sutapimas patvirtina, kad gavau būtent tą GitHub objektą. Antras patvirtina, kad tai tas pats archyvas, kurį anksčiau užfiksavo Island.

ZIP buvo keturi failai. Lentelėje pateikti jų gavimo metu apskaičiuoti hash. Paleidimo failas, Lua ir perskaitoma DLL taip pat peržiūrėti nepriklausomai. Vėliau Windows užblokavo nepriklausomą vykdomojo failo skaitymą. Todėl jo eilutėje pateiktas tik gavimo metu apskaičiuotas hash.

| Failas | Baitai | Gavimo metu apskaičiuota SHA-256 |
| --- | ---: | --- |
| `App.bat` | 29 | `a96ffc9f649333f9e84b7a7e1101cf85f7a5f143253db1d7853e6e48d46b3c72` |
| `icon16.txt` | 296 308 | `33250ded61c43128b6c29b01de7b1cc962b241b236933f54bc42b648afae2398` |
| `lua51.dll` | 390 144 | `c740061da4971cdf36a102637f80fc23dbff5769c1ec2156fcd90764237d51e2` |
| `resolver.exe` | 288 768 | `8fa25c75ee56eb3c4a2b0a6fe056c1e9f933e00596c6e3167e4727f01828168d` |

Paleidimo failas nurodo greta esantį vykdomąjį failą ir perduoda jam `icon16.txt` kaip argumentą. Tekstiniame faile yra viena ilga Lua eilutė. Jos tekstas užkoduotas, dalis reikšmių paslėpta skaičiavimuose, o programos eiga valdoma skaitinėmis būsenomis. Taip atrodo išsaugoti failai ir juose numatytas paleidimas. Jų nepaleidau.

Atidariau nepakeistas viso Lua failo ir paleidimo failo kopijas. Jų ir perskaitomos DLL hash vis dar sutapo su gavimo metu užfiksuotais hash. Antrame vaizde matoma DLL baitų ištrauka šešioliktainiu formatu.

![Pirminio užmaskuoto Lua pradžia, po ja nepakeista App.bat paleidimo eilutė.](/assets/img/posts/fakegit-ai-skills/vscode-original-files-v2.webp)

*Pirminio Lua pradžia ir jo paleidimo failas.*

![DLL dydis ir SHA-256 virš šešioliktainės ištraukos su MZ ir PE žymėmis.](/assets/img/posts/fakegit-ai-skills/vscode-original-dll-bytes-v2.webp)

*DLL hash ir MZ/PE antraštės baitai.*

### Įrašytos tyrėjo komandos

Analizei naudojau jau esančius Python 3.12.8 ir `pefile` 2024.8.26. Toliau pateiktos užfiksuotos komandos. Privataus katalogo pradžią pakeičiau į `[analysis-directory]`. Lua analizės komandų argumentai taip pat pateikti kaip tekstas:

```text
& 'C:\Python312\python.exe' '[analysis-directory]\static-acquire.py'
& 'C:\Python312\python.exe' '[analysis-directory]\static-pe-inspect.py'
C:\Python312\python.exe [analysis-directory]\static-analysis-private\static-lua-data.py
C:\Python312\python.exe [analysis-directory]\static-analysis-private\static-lua-straight-line.py
```

Gavimo įrankis GitHub atsakymus ir ZIP skaitė kaip duomenis. PE įrankis analizavo baitus neįkeldamas DLL. Lua analizatoriai skaidė tekstą į atskirus elementus ir atkūrė pastovias reikšmes. Procesų įrašuose išsaugojau laikus, stdout, grąžinamus kodus ir įrankių hash. Galutinis pastovių porų etapas vyko nuo 14:32:06 iki 14:32:10 UTC, baigėsi kodu 0 ir tuščiu stderr. Įvesties hash nepasikeitė. PE įrankio SHA-256 yra `7be56d140bfc3e0c53c2af9c5ba40e7724e7f21734b4fc53c10e3075cf1882ec`, galutinio tiesinio analizatoriaus `0c9f0dc8115c67d6b231d27f9b17e7d0f06aa26f20557a91b622d3b146200fd1`.

Perskaitoma DLL yra AMD64 PE32+ biblioteka su 129 importais iš 12 bibliotekų pavadinimų ir 324 eksportais. Jos eksportai ir failo tekstas atitinka LuaJIT 2.1.0-beta3 / Lua 5.1 suderinamo runtime požymius. Atskira PE baitų peržiūra patvirtino šiuos skaičius. Su patikimu pirminio projekto dvejetainiu failu nelyginau, kriptografinio parašo netikrinau. Todėl negaliu patvirtinti, kad tai originalus, nepakeistas runtime.

Vėliau bandant nepriklausomai perskaityti vykdomąjį failą ir apskaičiuoti hash, Windows parodė pranešimą apie virusą arba potencialiai nepageidaujamą programinę įrangą. Čia sustojau. Pranešimas nepateikia konkretaus aptikimo parašo ar malware šeimos. Kito skaitymo būdo nebandžiau, apsaugos nustatymų nekeičiau.

### Kaip dekodavau konstantas

Lua faile raidės buvo užrašytos skaičiais, o žodžiai išskaidyti į dalis. Pirmiausia savo Python kodu perskaičiau tuos skaičius ir sudėjau dalis į vietą. Pačios Lua programos nepaleidau.

Štai kaip viena tokia vieta atrodo originaliame faile:

```text
AT({1;2,{"\099\117\114\114\101","\110\116\068\108\108\080\097\116\104"}})
```

`\099` reiškia raidę `c`. Perskaičius abi užkoduotas dalis, gaunama `curre` ir `ntDllPath`. Sąrašas `[1, 2]` nurodo, kuria tvarka jas sujungti. Rezultatas: `currentDllPath`.

```python
indices = [1, 2]
chunks = [b"curre", b"ntDllPath"]
decoded = b"".join(chunks[i - 1] for i in indices)
# b"currentDllPath"
```

Šis Python pavyzdys tik sujungia jau perskaitytas teksto dalis. Jis nekviečia pavyzdžio Lua funkcijų.

![Pirminės užkoduoto šaltinio ištraukos greta Python dešimtainių baitų ir teksto dalių analizatorių.](/assets/img/posts/fakegit-ai-skills/vscode-source-parser-v2.webp)

*Užkoduotos eilutės greta Python analizatoriaus.*

<details>

<summary>Python kodo ištrauka ir originalo vieta</summary>

Originali ištrauka turi 73 baitus ir yra `icon16.txt` intervale `[267943, 268016)`. Poslinkiai skaičiuojami nuo nulio, intervalo pabaiga neįtraukiama. Pirmas peržiūros etapas iškodavo 2 294 eilutes ir 387 teksto dalių perstatymo vietas.

Ši mano `safe_decode.py` funkcijos `quoted_bytes` dalis perskaito skaičiumi užrašytą raidę. Prieš šią vietą jau perskaitytas pasvirasis brūkšnys ir pirmas skaitmuo į `char`. Rodoma tik ši funkcijos dalis, be aplinkinių parserio patikrų. Ji priima ASCII skaitmenis ir atmeta baito ribą, 255, viršijančias reikšmes.

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

Lua dalių numeracija prasideda nuo vieneto, Python nuo nulio. Todėl aukščiau pateiktame sujungime iš indekso atimamas vienetas. Kableliai ir kabliataškiai originalioje Lua lentelėje skiria įrašus.

</details>

Kitoms eilutėms vien sudėti raides neužteko. Mano Python dekoderis paėmė užkoduotą tekstą bei kode rastą pradinį skaičių ir pagal juos atkūrė perskaitomą tekstą. Iš viso gavau 292 skirtingas reikšmes. Viena jų buvo šis JSON užklausos šablonas:

![Python decoderis ir atkurtas JSON su neužpildytais laukais.](/assets/img/posts/fakegit-ai-skills/vscode-transform-output-v2.webp)

*Decoderis ir gautas JSON.*

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

`to` ir `data` laukuose liko `%s`: vietos, kur turėtų būti įrašytos konkrečios reikšmės. Iš šio šablono neatkūriau konkretaus smart contract, jo skaitymo funkcijos (`getter`), RPC paslaugos ar viso paskirties adreso. Vien šis JSON taip pat neįrodo ryšio su vėliau aptariamu Polygon kontraktu.

Šio vieno teksto atkūrimą galite patikrinti neatsisiųsdami paties kenkėjiško pavyzdžio. Į vieną katalogą išsaugokite [Python pagalbinį failą](/assets/data/fakegit-ai-skills-v1/constant-replay/constant_replay.py), [fiksuotą įvestį](/assets/data/fakegit-ai-skills-v1/constant-replay/fixture.json), [README](/assets/data/fakegit-ai-skills-v1/constant-replay/README.md) ir [visą fiksuotos versijos licenciją](/assets/data/fakegit-ai-skills-v1/constant-replay/LICENSE-Prometheus.txt), tada paleiskite:

```sh
python -B constant_replay.py
```

Šis pavyzdys atkuria vieną išsaugotą šabloną ir patikrina, ar gauti baitai sutampa. Jis nevykdo Lua programos ir nepatikrina visų 539 porų ryšio su originaliu failu.

<details>

<summary>Šaltiniai ir rezultato patikros</summary>

Išsaugotų užkoduoto teksto ir pradinių skaičių porų patikra davė 539 rezultatus, iš jų 292 skirtingus. Pradinės keturios ranka patikrintos poros įeina į bendrą skaičių. Kitas peržiūrėtojas atkūrė visus 539 rezultatus iš išsaugotų porų, nenaudodamas mano dekoderio, ir atskirai patikrino penkias pasirinktas poras originaliame faile. Tai nėra 539 nepriklausomai šaltinyje patikrintos vietos. Patikra nenustato visų užmaskuotų funkcijų ar to, ar jos būtų pasiektos programą paleidus.

Teksto atkūrimo būdą palyginau su [fiksuota Prometheus EncryptStrings versija](https://github.com/prometheus-lua/Prometheus/blob/a4efc5f381c50ae2a111bdbb9272fa3203685be3/src/prometheus/steps/EncryptStrings.lua#L121). Palyginimas parodė suderinamą transformaciją. Jis nenustato pavyzdžio maskavimo įrankio versijos ar operatoriaus. Autorystės nuoroda: "Based on Prometheus by Elias Oelschner, https://github.com/prometheus-lua/Prometheus". Taikomos [fiksuotos Prometheus licencijos sąlygos](https://github.com/prometheus-lua/Prometheus/blob/a4efc5f381c50ae2a111bdbb9272fa3203685be3/LICENSE).

Parodytas JSON turi 174 baitus: UTF-8 tekstas, LF eilučių pabaigos ir vienas galutinis LF. Mano Python patikra baigėsi kodu 0, o gautų baitų hash sutapo:

| Pastovūs duomenys | SHA-256 |
| --- | --- |
| Atkurtas šifruotas tekstas | `2807ea9e86ae814427e1c7ceb9c22aec73e63b70d8a94b0a9f30c9dd8f5d079b` |
| Atkurti JSON baitai | `487190fca26fbf3acf04520ce3ab7e7447a4d11453003591edd2de51c0f4bf4c` |

Viešas Python pavyzdys naudoja tik standartinę biblioteką. Jis patikrina vienos įvesties ir rezultato hash. Patikra ir kontroliniai bandymai su pakeista įvestimi, pradiniu skaičiumi bei rezultatu buvo sėkmingi. Tai tas pats vienas šablonas iš bendro 539 rezultatų skaičiaus. Pavyzdys neatsisiunčia originalaus Lua failo, netikrina jo ar jo ištraukų hash ir neįrodo programos vykdymo. Tiksli įvestis bei ribos nurodytos kartu pateiktame README ir [statinės analizės stebėjimuose](/assets/data/fakegit-ai-skills-v1/static-analysis.json).

</details>

Kitame atkurtame turinyje yra WinINet API pavadinimai, 8 514 baitų Windows PE/PEB/LDR deklaracijų blokas, su ekrano kopijomis susiję pavadinimai, tokie kaip `BitBlt`, ir suplanuotų užduočių bei PowerShell komandų fragmentai. Tai statinis turinys. Jis nepatvirtina įvykdytos užklausos, ekrano kopijos, kodo įterpimo ar įsitvirtinimo operacijos. Visi komandų fragmentai lieka privatūs.

### Antras išsaugotas archyvas, kurio tapatybė neviešinama

Toliau aprašyta paieška pagal failo pavadinimą davė antrą archyvą. Jo baitai atitiko pasyvaus teikėjo įraše pasirinktą SHA-256 ir konkrečios versijos Git blob. Greta esantis įgūdis aprašė įprastą audito eigą. Tikrintų archyvo požymių jo tekste nebuvo. Kandidato pavadinimas, hash ir šaltinio nuorodos lieka privatūs.

Jo Lua kode buvo tos pačios dvi užkoduotų teksto dalių perstatymo struktūros ir skaitinėmis būsenomis valdoma eiga. Ribotas analizatorius dekodavo 3 830 pažodinių eilučių ir 413 pastovių perstatymų. Skaičių sekų ir ankstesnio baito konstantos skyrėsi nuo žinomo pavyzdžio. Šio kandidato šifruoto turinio neatkūriau, vykdymo nestebėjau.

Pirmas nepriklausomas DLL baitų skaitymas baigėsi klaida `OSError: [Errno 22] Invalid argument`. PE palyginimą sustabdžiau: tos DLL neišanalizavau ir vykdomojo failo skaityti nebandžiau. Priežastis nežinoma, todėl klaidos nevadinu antivirusiniu aptikimu. Panaši struktūra ir sutampantis teikėjo hash neįrodo to paties operatoriaus, galutinio payload ar aukos kompromitavimo.

[Statinės analizės stebėjimuose](/assets/data/fakegit-ai-skills-v1/static-analysis.json) pateikti vieši hash, procesų įrašai, konstantų skaičiai ir tai, ko perskaityti nepavyko. Patys archyvai lieka privatūs.

## Diegiklis kopijuoja katalogą

Kad patikrinčiau, kaip toks archyvas galėtų patekti į įrenginį, perskaičiau pirminio `vercel-labs/skills` projekto kodą ties versija `e878c4502674f84094dc27b5ad94ddaf64f22551`.

Jo [diegimo keliai](https://github.com/vercel-labs/skills/blob/e878c4502674f84094dc27b5ad94ddaf64f22551/src/installer.ts#L371) perduoda `skill.path` katalogo kopijavimo funkcijai. [Aiškiai nurodytos išimtys](https://github.com/vercel-labs/skills/blob/e878c4502674f84094dc27b5ad94ddaf64f22551/src/installer.ts#L471) yra `metadata.json`, `.git`, `__pycache__` ir `__pypackages__`. [Kopijavimo ciklas](https://github.com/vercel-labs/skills/blob/e878c4502674f84094dc27b5ad94ddaf64f22551/src/installer.ts#L513) pereina likusius įrašus, taip pat vidinius katalogus, ir kopijuoja failus.

Jei pasirinktas įgūdžio katalogas diegiamas šiuo keliu, šalia esantis įprastas ZIP nepatenka tarp išimčių ir atitinka kopijavimo sąlygas. Tai išvada iš perskaityto kodo. Bandymo užkrėstame įrenginyje neatlikau ir neteigiu, kad taip veikia kiekvienas įgūdžių diegiklis.

Šiuos įvykius reikia tikrinti atskirai:

| Įvykis | Reikalingas įrodymas |
| --- | --- |
| Įrankių katalogas reklamuoja projektą | Datuotas arba išsaugotas katalogo įrašas |
| Repo yra archyvas | Konkrečios versijos katalogų medis arba gauti baitai |
| Diegiklis nukopijuoja archyvą | Tam tinkama kopijavimo logika arba užfiksuotas failų sistemos pakeitimas |
| Kas nors jį išpakuoja ar paleidžia | Įrenginio arba vykdymo įrodymai |
| Vėlesnis etapas kompromituoja paskyrą | To etapo ir jo poveikio paskyrai įrodymai |

Patvirtinau repo bei archyvo buvimą ir patikrinau, kokiomis sąlygomis diegiklis jį kopijuotų. Įrenginio įrodymų apie išpakavimą ar kompromitavimą neturiu. Pavojus gali slypėti Markdown instrukcijose, vykdomose priklausomybėse, greta esančiuose failuose ar besikeičiančioje nuotolinėje paslaugoje. Kiekvieną šių kelių reikia tikrinti atskirai.

## Masalas gali išlikti kito projekto duomenų rinkinyje

Verta tikrinti ir tai, kas liko kituose projektuose. Vieno viešo projekto commitu išsaugotame JSON duomenų rinkinyje radau 52 įrašus apie 51 skirtingą repo. Katalogas vadinosi "validated". Aštuoniolika repo sutapo su fiksuotais viešais sąrašais: aštuonios buvo Island, dešimt Orchid sąraše. Visuose aštuoniolikoje išsaugotų README fragmentų buvo ZIP nuorodų.

Peržiūrėtas kodas leidžia suprasti, kas galėtų nutikti kuriant naują indeksą. Pirmieji 300 tinkamo README fragmento simbolių galėtų būti sujungti su repo pavadinimu, aprašu ir programavimo kalba, o šis tekstas būtų naudojamas embedding kūrimui. Trylikoje iš aštuoniolikos sutapusių įrašų į tą fragmentą pateko visa ZIP URL nuoroda.

Indekso nepaleidau ir rekomendacijos nestebėjau. Kodas skaito ir kitus įvesties failus. Jei indeksas jau yra, importas gali būti praleistas. Jei tas pats URL įrašytas kelis kartus, pirmas gali būti pasirinktas ankstesnis įrašas. Galutinio konteksto funkcija pateikia repo URL ir aprašus, tačiau README teksto ir jo ZIP nuorodų nepateikia. Taigi tekstas išsaugotas duomenų rinkinyje ir yra sąlygos jam patekti į embedding. Ar šie fragmentai iš tiesų buvo indeksuoti, pateikti modeliui ar vykdyti, nenustačiau.

Duomenis rinkusio projekto kenkėjišku nevadinu. Jo tapatybė ir pirminis šaltinis neviešinami, kol vyksta redakcinė bei atsakingo atskleidimo peržiūra. Todėl iš viešos ištraukos skaitytojas negali pats perskaičiuoti šių konkrečių sutapimų. Radinys parodo, kodėl greta veikiančio kodo verta tikrinti išsaugotus README fragmentus ir rekomendacijoms naudojamus duomenis. Katalogo pavadinimas "validated" nepaaiškina, kas buvo patikrinta.

## Daugiau radinių, kurių tapatybės neviešinamos

Pagal datas apribota paieška rado ir dvi repo kandidates, kurių nebuvo nė viename iš dviejų fiksuotų sąrašų. Čia nė vienos nevadinu patvirtintai kenkėjiška.

Kandidatė A teigė esanti oficiali MCP integracija. Peržiūrėtame katalogų medyje buvo licencija, README, ignoruojamų failų sąrašas ir kodo ruošinys, kuriame buvo tik komentaras. Diegimo instrukcijos siuntė į slaptažodžiu apsaugotą archyvą, liepė išjungti apsaugą ir paleisti įrankį administratoriaus teisėmis. GitHub savo [oficialų MCP serverį](https://github.com/github/github-mcp-server) prižiūri atskirai. Žodis "official" README tekste tokio ryšio neįrodo.

Kandidatė B reklamavo atvirąjį kodą, licenciją, patikrintą SHA-256 ir švarų patikros rezultatą. Peržiūrėtoje repo versijoje buvo tik README. Nei žadėto kodo ir licencijos, nei paskelbto hash ar nepriklausomos patikros įrašo ji nepateikė. Ženklelis su užrašu "verified" įrodo, kad kažkas pasirinko tokį užrašą.

Šiuos radinius verta tirti toliau, bet dvejetainių failų elgesys nežinomas. Jei dabar paskelbčiau jų pavadinimus kaip patvirtintą malware, tyrimo kryptį paversčiau neparemtu kaltinimu. Todėl jų tapatybę atskleidžianti medžiaga lieka privačiame tyrimo įraše.

Kontrolinė patikra rado ir įprastą saugumo įgūdį. Peržiūrėtoje medžiagoje nebuvo šiai kampanijai būdingo archyvo ar downloader. Ieškant pagal "security", "MCP" ar "Cursor" galima rasti projektą, kuris daro kaip tik tai, ką žada jo pavadinimas. Paieškos rezultatas yra vieta patikrai pradėti.

## Instrukcija gali slypėti būtinoje priklausomybėje

Archyvas šalia įgūdžio yra vienas patekimo kelias. [Snyk 2026 m. vasario 5 d. ToxicSkills tyrimas](https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/) aprašo kitą: pačią paruošimo instrukciją. Snyk nurodo keturis įgūdžių kelius vienoje GitHub repo. Spalio 9 d. nepriklausomai perskaičiau tris atitinkamus `SKILL.md` failus vidiniuose kataloguose ties commitu `b857b9cb9154c9be6f63295cca91d331be28c250`: `clawhub`, `whatsapp-mgv` ir `coding-agent-1gx`.

Visi trys sako, kad normaliam veikimui būtinas išorinis įrankis. Windows instrukcijos prašo atsisiųsti slaptažodžiu apsaugotą release ZIP ir paleisti jo įrankį. macOS instrukcijose kartojasi ta pati Base64 eilutė. Dekodavus ją kaip tekstą, matyti HTTP atsisiuntimas ir jo perdavimas shell vykdymui. Matoma diegiklio etiketė rodo HTTPS domeną, o dekoduotas adresas yra kitas IP, naudojamas per HTTP. Pačios vykdomos komandos ir aktyvios payload nuorodos čia neskelbiu. [Fiksuotų versijų šaltinių stebėjimai](/assets/data/fakegit-ai-skills-v1/toxicskills-source-observations.json) pateikia kelius, blob ID ir eilutes.

![Įgūdžio paruošimo eilutės su uždengtu atsisiuntimo adresu ir įterpta komanda.](/assets/img/posts/fakegit-ai-skills/chrome-toxic-skill-prerequisite-v2.webp)

*Įgūdžio paruošimo instrukcija su uždengtu atsisiuntimo adresu ir komanda.*

Vėliau bandžiau gauti nurodytą Windows archyvą. Gavau HTTP 404, ne archyvo baitus. Ši užklausa netikrino užkoduoto macOS adreso.

Čia pagal jau paskelbtą tyrimą patikrinau dabar pasiekiamą kodą. Commit data yra vasario 26 d., ne spalio 9 d. Kada ši instrukcija įdėta pirmą kartą, nenustačiau. Peržiūrėtos versijos repo šaknyje Snyk nurodytų kelių nėra, bet atitinkami failai yra vidiniuose kataloguose. Tai neįrodo, kad jie buvo perkelti ar pervadinti. Ketvirto failo neskaičiau. Tekstas rodo paslėptą vykdymo sąlygą. Jis neįrodo užkrėtimo, dabartinio prižiūrėtojo ketinimų ar ryšio su FakeGit.

## Ta pati sąlyga kituose įgūdžių šaltiniuose

Toliau ieškojau dekoduoto IP, jam būdingo kelio, release failo pavadinimo ir teiginio apie būtiną priklausomybę. Šešios tiesioginės GitHub API užklausos grąžino 120 pirmųjų puslapių eilučių iš 105 failų 38 repo. Peržiūrėjau keturias pasirinktas repo ties konkrečiomis versijomis. Viena buvo aiškiai pažymėta demonstracija, todėl ją atmečiau.

Kitose trijose pavojingos paruošimo instrukcijos buvo likusios boto įgūdžių kataloge, programos agento įgūdžių kataloge ir MCP įgūdžių bibliotekoje. Boto įgūdyje buvo identiška užkoduota HTTP atsisiuntimo ir paleidimo per shell instrukcija. Kitos dvi siuntė į slaptažodžiu apsaugotą ZIP ir išorinį puslapį su komanda. Tų išorinių teksto adresų nelankiau. Vien archyvų nuorodos neįrodo, kad juose tie patys baitai.

MCP bibliotekos kode atsekiau, kaip instrukcija galėtų pasiekti klientą. Failų sistemos režimu indeksas priima įgūdį, jei tinka jo metaduomenys. Pasirinkus tą įgūdį, loader perskaito visą vietinį Markdown ir grąžina jį kaip MCP įrankio turinį. Šis kodo kelias paruošimo instrukcijos nepašalina. Tačiau programa gali rinktis iš anksto parengtą rinkinį, kurio turinio neperžiūrėjau. Serverio nekviečiau, kliento įkeliant šį failą nestebėjau ir modelio vykdant instrukciją neparodžiau.

Ankstesnėje bendroje paieškoje toje pačioje bibliotekoje skaičiau apsauginio skenerio įgūdį. Jo grėsmingai atrodantys žodžiai buvo aptikimo gairės. Kitame faile radau pavojingą paruošimo sąlygą. Abu radiniai pagrįsti, bet nė vienas nepasako, ar visa biblioteka saugi, ar kenkėjiška. Trijų kandidačių tapatybės lieka privačios, kol tikrinama kilmė ir galimybės informuoti. Jų tekstas neįrodo kenkėjiškų prižiūrėtojo ketinimų ar ryšio su FakeGit.

Atskiroje bendroje paieškoje po dešimties užklausų peržiūrėjau šešias pasirinktas repo. Papildinių paieškoje po keturių kodo užklausų patikrinau tris atvejus. Peržiūrėtas kodas blokavo prisijungimo duomenų skaitymą, veikė kaip vietinis pagalbinis įrankis arba pateikė aprašytas callback funkcijas. Kenkėjiško leidėjo nenustačiau. [Bendros paieškos įrašai](/assets/data/fakegit-ai-skills-v1/broader-ai-tooling-observations.json), [papildinių stebėjimai](/assets/data/fakegit-ai-skills-v1/plugin-observations.json) ir [anoniminiai susijusių įgūdžių radiniai](/assets/data/fakegit-ai-skills-v1/toxicskills-sibling-observations.json) išsaugo atskiras šių paieškų apimtis. Iš tokių mažų imčių negalima spręsti apie visą ekosistemą.

## Sekti IOC paskirtį, ne vien jo užrašą

Lua failo SHA-256, Git katalogų medžio blob ID, ZIP hash ir smart contract adresas žymi skirtingus objektus. Juos sumaišius galima padaryti išvadą apie ryšį, kurio įrodymai nepatvirtina.

Pavyzdžiui, vien Git blob ID nepatvirtina, kad archyvo SHA-256 sutampa su anksčiau kito tyrėjo užfiksuotu hash. Reputacijos paslaugos rezultatas parodo, ką ta paslauga žinojo apie konkrečius baitus konkrečiu metu. O jei per vieną bandymą sandbox aplinkoje skriptas nesikreipė į tinklą, tai dar neįrodo, kad jis nepavojingas.

### Ką grąžino paieška pagal pažodines IOC reikšmes

Aštuonios tiesioginės GitHub API kodo užklausos su IOC kabutėse grąžino 61 pirmųjų puslapių eilutę iš 49 konkrečių versijų failų 28 repo. Kiekvieną ieškotą reikšmę patikrinau viename visame šaltinio faile. Iš viso tai aštuonios patikros keturiuose failuose, ne visų 49 failų peržiūra. Ankstesnė pagalbinė paieška turėjo kitą imtį ir grąžino nesusijusių failų pavadinimų fragmentų. Jos rate limit klaidos užfiksuotos atskirai.

Pasirinkti tikslių reikšmių sutapimai daugiausia vedė į pranešimus ir IOC sąrašus. Getter pasitaiko ir [nesusijusiame QuillCTF Solidity kode](https://github.com/DeFiHackLabs/Web3-CTF-Intensive-CoLearning/blob/d084f6026b05148455e50b3aae8c0750d1976327/Writeup/Tanner/src/QuillCTF/PseudoRandom.sol#L47). Sekdamas pranešimus radau dvi jau žinomas repo, pateiktas aukščiau. Pati tiesioginė API paieška naujos platinimo repo nepatvirtino. [Užklausų ir šaltinių stebėjimai](/assets/data/fakegit-ai-skills-v1/exact-ioc-github-observations.json) išsaugo šį skirtumą.

### Nuo pasyvaus failų ryšio atgal iki README

Dar vieną kelią atgal į GitHub radau esamame VirusTotal įraše. Jo "Communicating files" vaizde buvo rodoma 547 ryšių. Pasirinkau dvi eilutes su failo pavadinimu ir hash. Tai nereiškia, kad išanalizavau 547 failus. Ši platformos žyma taip pat neįrodo, kad pats neatidarytas ZIP siuntė tinklo užklausą.

Keturios tiesioginės GitHub API užklausos ieškojo dviejų failų pavadinimų kabutėse ir dviejų SHA-256 reikšmių. Gavau dvi eilutes: du README failus dviejose repo. Abi hash paieškos grąžino nulį eilučių. Tai paieška indeksuotame failų tekste. ZIP turinio ji neieškojo. Patikrinau abu pasirinktus README ir visus jų konkrečių versijų katalogų medžius. Dabartinės versijos sutapo su rastomis paieškoje. Šis etapas atskiras nuo aštuonių anksčiau aprašytų IOC užklausų.

Vienas rezultatas, `nunzioaccording289 / ai-skill-hub`, jau buvo Island sąraše. Commit `8da0c76fa95af93cf3975f927ebcea81857605c9` pakeitė tik README ir nurodo spalio 9 d. 13:53:13 UTC laiką. Jame dvi Markdown nuorodos pakeistos į tiesioginį archyvą kintančioje `main` šakoje. Katalogų medyje buvo `subpiston/hub_skill_ai_1.6.zip`, kurio dydis 476 614 baitų. Šio archyvo negavau. Sutampantys senesnis Island ir platformos hash nepatvirtina dabartinio Git blob SHA-256.

Antro rezultato nebuvo nė viename fiksuotame sąraše. Vieno ženklelio nuoroda ir dvi atskiros URL eilutės pakeistos į archyvą šalia įgūdžio. Vėliau jį išsaugojau anksčiau pateiktam anoniminiam statiniam palyginimui. Tapatybė ir ją atskleidžiančios failo pavadinimo bei hash užklausos lieka privačios. Todėl viešai tų dviejų užklausų visiškai pakartoti negalima. Tai, kad repo nėra palyginimo sąrašuose, neįrodo pirmo atskleidimo.

![VirusTotal Communicating Files lentelė su uždengta neviešinamos kandidatės eilute.](/assets/img/posts/fakegit-ai-skills/chrome-vt-related-files-v2.webp)

*Failų ryšiai, panaudoti tolesnei GitHub paieškai. Kandidatės duomenys uždengti.*

[Paieškos pagal failų pavadinimus stebėjimai](/assets/data/fakegit-ai-skills-v1/vt-github-pivot-observations.json) pateikia atskirą keturių užklausų apimtį ir žinomos repo šaltinio nuorodas. Platformos įrašytas ryšys dar nėra įrenginyje stebėtas elgesys.

### Perskaityti rodyklę nelankant grąžinto adreso

FakeGit analizėse nurodytas Polygon smart contract leidžia perskaityti jo grąžinamą C2 adresą nesikreipiant į patį C2. Paskelbtas smart contract adresas yra `0x1823A9a0Ec8e0C25dD957D0841e3D41a4474bAdc`, jo getter selektorius `0x3bc5de30`.

Gavau dvi paskelbtas atnaujinimo transakcijas. Patikrinau, kad jos įvykdytos sėkmingai, ir dekodavau jų įvestį. Tada read-only užklausomis palyginau smart contract atsakymus ankstesnio bloko ir atnaujinimo bloko pabaigoje:

| Bloko laikas, UTC | Atnaujinimo blokas | Ankstesnio bloko reikšmė | Atnaujinimo bloko reikšmė |
| --- | --- | --- | --- |
| 2026 m. rugpjūčio 11 d., 08:06:16 | `91820366` | `hxxp://83.97.20[.]150` | `hxxp://194.48.248[.]94` |
| 2026 m. rugsėjo 17 d., 19:33:16 | `93979042` | `hxxp://194.48.248[.]94` | `hxxp://185.10.68[.]110` |

[Rugpjūčio transakcija](https://polygonscan.com/tx/0x88b650e20a3e22cf9eddb07fe66221bbd83f8e16dc58aa71fd5f52fe1546e98f) ir [rugsėjo transakcija](https://polygonscan.com/tx/0x086f877cf8227cdc9ce2bcd905f121e0ea8449fb9216e38c506ccdbb16424fbf) yra vieši įrašai šiai patikrai. Lyginau būseną blokų pabaigoje. Tai nėra vykdymo įrašas prieš pat transakciją ir iškart po jos.

![Rugsėjo 17 d. Polygon transakcijos duomenys: būsena, blokas, laikas ir atnaujinimo įvestis.](/assets/img/posts/fakegit-ai-skills/chrome-polygon-transaction-v2.webp)

*Rugsėjo 17 d. Polygon transakcija: būsena, blokas, laikas ir atnaujinimo įvestis.*

Ankstesnėje konkretaus bloko patikroje dRPC ir PublicNode atskirai grąžino `hxxp://185.10.68[.]110` bloke `95232281`. Jo laikas yra spalio 9 d. 13:47:21 UTC, bloko hash `0x5bd844e2348bfd3ce6d868d98f66865baac5cabcebf7b0d40a3dfbc5e37d1c4e`. Taip patikrinau, kaip keitėsi grąžinamas adresas ir koks jis buvo konkrečiu laiku. Apiiro šiuos adresus jau buvo paskelbusi. Naujų serverių neradau ir jų pasiekiamumo netikrinau.

[Dviejų ThreatFox įrašų](https://threatfox.abuse.ch/ioc/1954488/) ["first seen" lauke nurodyta spalio 6 d.](https://threatfox.abuse.ch/ioc/1954489/). Tai vėliau nei mano atkurti rugpjūčio ir rugsėjo būsenos pakeitimai. Šis katalogo laikas nepasako, kada prasidėjo kampanija.

Failų hash davė dar vieną paieškos kryptį. [Atomdrift birželio 13 d. analizė](https://atomdrift.org/discoveries/2026/06/surf-byo-interpreter/) nurodo tą patį `uix.txt` SHA-256 kaip kovo mėn. Derp tyrimas. Atomdrift aprašo vykdymo bandymą su stebėjimo priemonėmis, kuriame atskleistas ekrano kopijų darymas. Tai autoriaus dinaminės analizės rezultatai. Šiame tyrime tokio bandymo neatlikau, o jo rezultatai nepatvirtina visų galimų vėlesnių payload.

Šaltiniai skirtingai apibūdina interpretatorių, kurio SHA-256 yra `f3e34c9e36f3be065d80d456281d31dd1cc85eb4980db7fa8c1b0eb6f29c25d8`. [Derp](https://www.derp.ca/research/fakegit-luajit-github-campaign/) jį nurodo kaip 878 KB V2a vykdomąjį failą, o vasario 878 KB failą apibūdina kaip modifikuotą kenkėjiškiems tikslams. [Atomdrift](https://atomdrift.org/discoveries/2026/06/surf-byo-interpreter/) nurodo tą patį hash, bet interpretatorių vadina nemodifikuotu. Šio nesutarimo neišsprendžiau. Tai kitas vykdomasis failas nei anksčiau pateiktame išsaugotame pavyzdyje. Nė vienas apibūdinimas nepatvirtina mano atskirai išsaugotos DLL autentiškumo.

Atskirai per dRPC atkūriau Spectrum nurodyto istorinio bloko `95019999` reikšmę. PublicNode šios užklausos nepriėmė. Toliau pateiktoje išplėstoje patikroje šis vieno teikėjo ribojimas lieka.

Atsargiai vertinu ir grėsmių žvalgybos įrašų laikus. Pateikimo arba "first seen" laukas gali žymėti platformos įrašo sukūrimą, o ne pirmą infrastruktūros veikimo dieną. Pasikeitęs smart contract grąžinamas adresas neįrodo, kad tuo pačiu metu persijungė visi užkrėsti įrenginiai. Cache gali likti ankstesnių etapų failų, o klientai gali veikti skirtingai.

## Kur veda kiti failai

[DERP kovo tyrimas](https://www.derp.ca/research/fakegit-luajit-github-campaign/) seka loader kelią toliau: iki GitHub saugomų užkoduotų failų ir užšifruoto infostealer. Tuo pačiu keliu patikrinau vėlesnį OnionClaw atvejį, kurį jau aprašė [Spectrum](https://www.spectrum.security/blog/fake-onionclaw-infostealer). Abi senesnės DERP dead-drop repo šį kartą grąžino API 404. Spectrum nurodyti konkrečių versijų failai dar buvo pasiekiami.

Tai atskiras OnionClaw atvejis. Kad anksčiau peržiūrėti skill archyvai atsisiunčia būtent šiuos failus, neįrodžiau.

### Nuo ZIP iki paslėpto payload

Netikrą OnionClaw ZIP gavau iš `christinminor459 / OnionClaw` commit `524d4aa245cdc172b894f68b9397c885bcfb985b`. Archyvo SHA-256 sutapo su Spectrum įrašu. Viduje yra trys failai:

```text
Launcher.cmd     26 bytes
lua51.exe       872,448 bytes
rest.txt        299,679 bytes
```

Visas launcher telpa vienoje eilutėje:

```bat
start lua51.exe rest.txt
```

`rest.txt` yra obfuskuotas Lua kodas. `.txt` galūnė čia dirba viešųjų ryšių skyriuje. Launcher perduoda failą interpretatoriui, todėl "čia tik tekstas" būtų gana trumpa ir liūdna analizė. Archyvo failus perskaičiau ir patikrinau jų hash, jų nepaleidau.

Grandinėje atskyriau savo patikrintus failus nuo Spectrum aprašytų perėjimų:

| Etapas | Ką patvirtina turimi duomenys |
| --- | --- |
| Netikras OnionClaw ZIP → interpretatorius ir `rest.txt` | Patikrintas originalus archyvas, failų hash ir launcher eilutė |
| Lua loader → Polygon adresų rodyklė → užduoties atsakymas | Aprašė Spectrum. Atskirai tikrinau contract atsakymus, Lua nepaleidau |
| Užduotis → GitHub `22/cd.txt` ir `22/ip.txt` | Kelius nurodė Spectrum. Pats gavau konkretaus commit failus ir patikrinau hash |
| Hex/XOR → dar vienas obfuskuotas Lua ir native wrapper | Sutapo abiejų pilnai atkurtų failų hash |
| Wrapper resource → Base64 → AES → vidinis PE | Patikrintos resource ribos, rakto dalys, PE struktūra ir viso vidinio failo hash |
| Vidinio failo tekstas → RC4 → collector adresas ir kitas tekstas | Nepriklausomai pakartoti trys konkretūs rezultatai. Ryšio ar vagystės nestebėjau |

Vienas perėjimas turi kabliuką: Spectrum gautų užduoties atsakymų raktas nesutapo su kliente įrašytu raktu. Nepakeistas klientas tų atsakymų neperskaito. Spectrum gautus atsakymus dekodavo offline ir atskirai naudojo imituotas registracijas. Aš tikrinau gautus failus offline. Tai ne nenutrūkstamas užkrėtimo aukos įrenginyje įrašas.

### Kas iš tiesų yra GitHub tekstiniuose failuose

Abu failai yra `Sydneycondemnatory52 / ssh`, commit `3a21ace0edddbc2f5163f08ea0c5ee1321c7a354`. Pirmi 64 `22/ip.txt` ASCII simboliai atrodo taip:

```text
0819f53655474c524e756d328ea6746c8f394f694f553761086f74375a68626e
```

Tai hex tekstas. Jį pavertęs baitais pritaikiau Spectrum paskelbtą pasikartojantį XOR raktą. Šis trumpas pavyzdys parodo pirmą žingsnį:

```python
encoded = "0819f53655474c524e756d328ea6746c8f394f694f553761086f74375a68626e"
key = b"ECe6VGLRJum2qYtl79OiOU7aHot7Zhbn"
cipher = bytes.fromhex(encoded)
plain = bytes(b ^ key[i % len(key)] for i, b in enumerate(cipher))
print(plain.hex())
```

Tikras rezultatas:

```text
4d5a90000300000004000000ffff0000b8000000000000004000000000000000
```

Pirmi du baitai reiškia `MZ`, Windows vykdomojo failo antraštės žymą. Vien jos malware verdiktui neužtenka. Atkūrus visą failą gaunamas 1 211 392 baitų PE wrapper, kurio visas hash sutampa su paskelbtu pavyzdžiu. Taip pat apdorotas `cd.txt` tampa dar vienu obfuskuotu Lua failu, prasidedančiu `local Xb=function(R)`. XOR raktą paėmiau iš paskelbto tyrimo. Iš šio Lua jo pats neatkūriau.

Užkoduoto atsisiųsto failo ir atkurto failo hash reikia saugoti atskirai. Wrapper hash nesutaps su originalaus hex teksto kopija.

Wrapper viduje, resource `101`, yra Base64 tekstas. Jį dekodavus lieka AES užšifruoti baitai. AES raktas išskaidytas mašininio kodo konstantose: atkūriau dvi saugomas dalis ir sujungiau taip, kaip nurodo wrapper XOR instrukcija. Gautas raktas sutapo su Spectrum paskelbtu. Statinė disassembly peržiūra perskaito instrukcijas, jų nevykdo.

AES-256-ECB iššifravimas grąžino vidinį PE. Pagal jo struktūrą failas baigiasi ties 634 880 baitu, o už jo lieka 32 vienodi `0x20` baitai. Mano pradinis padding patikrinimas juos atmetė dar nepatikrinęs PE. Atskirai peržiūrėjus failo struktūrą paaiškėjo, kad payload atkurtas teisingai. Sutapo ir visas jo hash.

| Atkurti duomenys | Baitai | SHA-256 |
| --- | ---: | --- |
| Lua iš `cd.txt` | 198 438 | `06bed48e1b04e9bb0b8a62cc3c733fb52a4a44496f6461795623dae61952a26f` |
| PE wrapper iš `ip.txt` | 1 211 392 | `e8a038fdb6adfbea7740e9654c3dff46f3d58cfa4c1eb08850912e5810b46b0a` |
| Vidinis PE | 634 880 | `d0bb735a344aab2dc5b874a9c928ce0bf5815c0e573ab313f8552b28aabc0601` |

### RC4: originalas, decoder ir rezultatas

Naudojau Spectrum paskelbtą tekstinių eilučių raktą `MUdKjf9c8jzn5iJhFE`, tada jo tikslią reikšmę radau vidiniame PE, ties failo offset `520216`. Jį panaudojau kelioms Base64 eilutėms iš to paties failo. Offset čia skaičiuojami nuo nulio vidiniame faile:

| Offset | Tiksli originali eilutė | Atkurtas tekstas |
| --- | --- | --- |
| `520624` | `YcboTgsXIXfPFG4ZYPI+cUThqas=` | `hxxp://144.31.57[.]121` |
| `527232` | `asD5X0Vd` | `create` |
| `520240` | `MOGufQBafwjPeC1fCYxIMAmq0+rQzA==` | `9S2C1bqN4XmuXPCvczHpRq` |

Paskutinis rezultatas yra atskirai paskelbtas network raktas. Jo paskirtis skiriasi nuo rakto, kuriuo iššifruojamos šios eilutės. Tikruose adreso baitų duomenyse gale nėra `/`. Adresą tekste pateikiu defanged forma.

Trumpas RC4 decoder iš [offline pavyzdžio](/assets/data/fakegit-ai-skills-v2/spectrum-config-string-replay.py):

```python
def rc4(key, data):
    s = list(range(256))
    j = 0
    for i in range(256):
        j = (j + s[i] + key[i % len(key)]) % 256
        s[i], s[j] = s[j], s[i]
    i = j = 0
    out = bytearray()
    for byte in data:
        i = (i + 1) % 256
        j = (j + s[i]) % 256
        s[i], s[j] = s[j], s[i]
        out.append(byte ^ s[(s[i] + s[j]) % 256])
    return bytes(out)
```

Pirmiausia perskaitomas Base64, tada ši funkcija iš užšifruotų baitų atkuria lentelėje parodytą tekstą. Atsisiunčiamame pavyzdyje yra dvi fiksuotos eilutės, tikslių baitų hash patikros, RFC 6229 testas ir pakeistų duomenų palyginimas su tikėtinu rezultatu. Malware pavyzdžio nereikia, tinklo užklausų nėra. Antras peržiūrėtojas visas tris lentelės eilutes nepriklausomai atkūrė iš atkurto vidinio PE.

Taip patikrinau tekstą paskelbtame StealC šeimos payload. Tikslios jo versijos, operatoriaus ar to, kad auka kažką nusiuntė į collector, tai neįrodo. [Statinės analizės įraše](/assets/data/fakegit-ai-skills-v2/static-chain-observations.json) yra konkrečios šaltinių versijos, offset ir patikros. Collector adresą atkūriau iš vidinio PE, o Polygon adresą gavau atskirai iš contract. Tai skirtingų komponentų radiniai.

### Daugiau adresų pakeitimų

Polygon patikrą išplėčiau nuo dviejų iki **21 užfiksuoto pakeitimo**. Naudojau transaction hash iš anksčiau išsaugoto explorer vaizdo. Kiekvienam patikrinau rezultatą, perskaičiau siunčiamą adresą ir palyginau getter atsakymus ankstesnio bloko pabaigoje ir pakeitimo bloko pabaigoje. Visi 21 įrašai sėkmingi, o siunčiamas adresas sutapo su atsakymu po pakeitimo. Tai patikrinti pasirinkti įrašai. Kad sąrašas apima visą istoriją, netvirtinu.

Atsakymuose yra 20 skirtingų išorinių IP adresų. Tai contract saugotos reikšmės. Prie tų serverių nesijungiau ir jų veikimo netikrinau. Keli naudingi istorijos taškai:

| Pakeitimo laikas, UTC | Adresas po pakeitimo | Kodėl jį pasilikau |
| --- | --- | --- |
| 2025-11-16, 11:37:19 | `hxxp://93.123.39[.]74` | Pirmas išorinis adresas patikrintoje atrankoje |
| 2026-02-27, 19:47:29 | `hxxp://89.169.12[.]241` | Sutampa su DERP kovą aprašyta reikšme |
| 2026-04-22, 13:39:02 | `hxxp://89.169.12[.]149` | Spectrum tą patį adresą rado antrame Lua loader |
| 2026-05-03, 15:48:58 | `hxxp://89.169.12[.]140` | Kitas patikrintas pakeitimas po `.149` |
| 2026-09-17, 19:33:16 | `hxxp://185.10.68[.]110` | Naujausias pakeitimas išsaugotoje atrankoje |

Balandžio adresas padeda palyginti skirtingų tyrimų infrastruktūrą. Jis nepasako, kas yra operatorius ir kur kreipėsi konkreti auka. Senas kode įrašytas adresas ir naujesnis contract atsakymas gali būti tame pačiame loader.

Bloke `95247366`, 2026 m. spalio 9 d. 20:04:50 UTC, dRPC ir PublicNode grąžino tuos pačius keturių contract/getter porų atsakymus. V1 grąžino `hxxp://89.169.12[.]173`, jo alternatyva `hxxp://158.78.56[.]52`, o V2 `hxxp://185.10.68[.]110`. Tyrime nurodytas testinis contract grąžino `127.0.0.1`, todėl šios reikšmės prie viešų C2 adresų nededu. [Išsaugotuose įrašuose](/assets/data/fakegit-ai-skills-v2/resolver-observations.json) yra contract, selector, transaction ir kiekviena grąžinta reikšmė. Istorinius atsakymus patikrinau per vieną teikėją, šio bloko atsakymus per du. Prie grąžintų adresų nesijungiau.

### Kodėl GitHub paieška gali šių failų nerodyti

Per GitHub REST API atlikau dar 20 skirtingų kodo paieškos užklausų pagal konkrečius raktus, kelius, hash ir loader požymius. Patikrinau aštuonis pasirinktus tekstinius failus iš septynių repo. Naudingi rezultatai daugiausia vedė į tyrimus, blocklist ir detection medžiagą. Ši paieška nepatvirtino naujos, anksčiau nepaskelbtos platinimo repo. [Paieškos įrašuose](/assets/data/fakegit-ai-skills-v2/github-pivot-observations.json) atskirti rezultatai ir iš tikrųjų perskaityti failai.

Yra praktiškas kabliukas: užkoduoti `cd.txt` ir `ip.txt` yra 396 876 ir 2 422 784 baitų. Abu viršija REST paieškos dokumentacijoje nurodytą mažiau nei 384 KB ribą. Naujesnė web Code Search turi atskirą 350 KiB ribą. Kodo paieška taip pat neapima binary failų ir tikrina default branch. Nulis rezultatų čia nesuteikia pažymėjimo, kad failas švarus. Turint užduotyje nurodytą kelią, reikia tikrinti konkretaus commit katalogų medį ir patį blob. [REST paieškos ribos](https://docs.github.com/en/search-github/searching-on-github/searching-code), [web Code Search ribos](https://docs.github.com/en/search-github/github-code-search/about-github-code-search#limitations)

SHA-256 paieška ieško teksto, kuriame tas hash paminėtas. Ji neskaičiuoja GitHub failų hash. Repo pavadinimo paieška kode taip pat nepakeičia tiesioginės repo ir jos katalogų patikros.

Pagal IOC dar tikrinau senų domenų Certificate Transparency ir jau esamus urlscan įrašus. Du rugsėjo `layer1[.]icu` fiksavimai baigėsi Vercel pažymėtais 404 puslapiais. Iš to neatkursime seno serverio ir nesužinosime, kas domeną valdo dabar. Gautų urlscan užklausų langas yra tik 30 dienų. Jei kito adreso nėra rezultatuose, daugiau nei apie šį langą tai nepasako. Bendros hosting platformos IP į kampanijos blocklist nekeliu. [Pasyvios patikros įrašai](/assets/data/fakegit-ai-skills-v2/passive-observations.json)

Hunt metu verta išsaugoti visą GitHub account ir kelią, atsisiųsto failo hash, jį paleidusį procesą ir laiką. Tada jungti su vėlesniais failų įrašymais ir network įvykiais. Atsisiuntimas rodo gautą failą. Užduoties cache ar marker gali rodyti jos apdorojimą. Ar payload iš tiesų paleistas ir ar kas nors pavogta, jau turi parodyti procesai bei endpoint telemetrija.

## Ankstesni tyrimai paaiškina skirtingas grandinės dalis

Atsisiuntimo nuorodas keitė ir iki šio tyrimo. Check Point [2024 m. liepos Stargazers tyrimas](https://research.checkpoint.com/2024/stargazers-ghost-network/) aprašo išlikusias masalo repo, kurios nukreipia į pakaitinius kenkėjiškus release. Tai ankstesnis tokio veikimo pavyzdys. Vien panašus būdas nereiškia, kad Stargazers ir FakeGit yra viena operacija.

[2026 m. sausio GitHub Community pranešimas](https://github.com/orgs/community/discussions/184751) yra datuotas perspėjimas apie README nuorodas, pakeistas į ZIP. [Derp kovo analizė](https://www.derp.ca/research/fakegit-luajit-github-campaign/) nagrinėja LuaJIT paketą ir C2 adreso gavimą per Polygon. [Hexastrike balandžio tyrimas](https://hexastrike.com/resources/blog/threat-intelligence/cloned-loaded-and-stolen-how-109-fake-github-repositories-delivered-smartloader-and-stealc/) seka grandinę nuo SmartLoader iki StealC. Šie šaltiniai pateikia skirtingus įrodymus. Jų skelbiamų skaičių negalima sukeisti ir naudoti kaip tą patį kampanijos dydžio matą.

[ASEC 2025 m. rugpjūčio 8 d. analizė](https://asec.ahnlab.com/en/89551/) seka SmartLoader iki Rhadamanthys. Vien SmartLoader pavadinimas dar nepasako, koks bus galutinis payload. [Netskope 2026 m. kovo tyrimas](https://www.netskope.com/blog/openclaw-trap-ai-assisted-lure-factory-targets-developers-gamers) taip pat atskiria naudingą nukopijuotą projekto kodą nuo archyvo, reklamuojamo atsisiuntimo ženkleliu.

[Orchid birželio darbas](https://orchidfiles.com/github-repositories-distributing-malware/) paaiškina, kodėl GitHub įvykių istorijoje galima rasti repo, kurių neranda viena tekstinė paieška. [Island liepos AgentBaiting tyrimas](https://www.island.io/blog/agentbaiting-how-800-fake-ai-skills-and-mcp-servers-delivered-malware) seka masalus iki DI įrankių paieškos ir pateikia skirtingus agentų bandymų rezultatus. Tai, kad modelis kartais masalą atmeta, taip pat svarbu kaip ekrano kopija, kurioje jį priima.

## Ką keisčiau peržiūros procese

Prieš peržiūrėdami įgūdį užfiksuokite tikslią repo ir commit. Patikrinkite, kur veda reklamuojama atsisiuntimo nuoroda, nieko iš jos nepaleisdami. Tada peržiūrėkite atitinkamos versijos katalogų medį. Teisėto projekto pavadinimas padeda ieškoti. Jis nepatvirtina, kas paskelbė šią kopiją.

Prieš diegdami patikrinkite, kokie failai bus nukopijuoti į diską ir kaip veiks priklausomybės. Peržiūrėkite ir diegiklio versiją, ir patį įgūdį. Pasirinktas `SKILL.md` nebūtinai aprašo visą katalogą, kurį diegiklis kopijuos.

Repo commit nurodo konkrečią jos failų versiją. Tačiau tame README esanti nuoroda gali vesti į besikeičiančią `main` šaką, atskirai pakeičiamą release failą, paketą su kintančiu tag ar nuotolinę MCP paslaugą. Šių dalykų vien repo commit neužfiksuoja. Saugokite patvirtintų failų hash ir iš naujo tikrinkite išorinius adresus, kai jų turinys keičiasi.

Vietiniam MCP serveriui patikrinkite paleidimo komandą ir argumentus. [MCP projekto saugumo gairės](https://modelcontextprotocol.io/docs/draft/tutorials/security/security_best_practices) vietinį vykdymą laiko prieigos prie sistemos riba ir rekomenduoja aiškų sutikimą bei izoliavimą. Draugiškas serverio pavadinimas nepasako, kokias teises turės jo procesas. Pagal [stdio transporto specifikaciją](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports#stdio), klientas paleidžia serverį kaip atskirą procesą. Jei paleidžiate nepatikimą vietinį stdio MCP serverį tam, kad skeneris išvardytų jo įrankius, jo kodas jau paleistas. Prieš jungdamasis peržiūrėčiau kodą ir paleidimo konfigūraciją.

Jei projektas skelbia, kad antivirusinė patikra švari, prašykite konkretaus failo ataskaitos. Slaptažodžiu apsaugotas archyvas, administratoriaus teisių prašymas ir nurodymas išjungti apsaugą yra priežastys sustoti bei patikrinti. Nė vienas šių požymių atskirai nepasako malware šeimos.

Tikrinkite atskirai: kur veda README nuoroda, ar ZIP yra repo, ar jo hash minimas senesniame viešame įraše ir kokį adresą tuo metu grąžino smart contract. Išsaugokite kiekvienos patikros įrodymą. Vien IOC sąrašas šių patikrų neatstoja. Atskirai žymėkite radinio, commit, pranešimo ir savo patikros laikus.

## Nuo kodo peržiūros iki incidento tyrimo

Reaguokite pagal tai, kas įvyko. Pasikeitė patvirtinta atsisiuntimo nuoroda? Pristabdykite diegimą ir peržiūrėkite pakeitimą. Žinomas archyvas diske patvirtina, kad ten buvo tie baitai. Nei nuorodos pakeitimas, nei pats failas neįrodo vykdymo. Netikėtas procesas ar su vykdymu susijęs įrenginio apsaugos perspėjimas jau yra priežastis taikyti organizacijos incidentų valdymo procesą. Užkoduota eilutė nėra incidento bilietas, kuriame nuobodžioji dalis stebuklingai užsipildė pati.

| Atsakingi | Priežastis peržiūrėti | Įrodymai ir kitas veiksmas | Klaidingi suveikimai ir ribos |
| --- | --- | --- | --- |
| AppSec / kūrėjų platformos komanda | Patvirtintas įgūdis pakeičia atsisiuntimo nuorodą, prideda archyvą ar keičia paleidimą | Išsaugoti konkrečios versijos pakeitimą, katalogų medį ir patvirtintų failų bei priklausomybių sąrašą. Pristabdyti diegimą ar atnaujinimą, kol patikrintas leidėjas ir atsisiunčiamo failo baitai. | Nuorodos keičiasi ir teisėtai perkeliant release. Vien README pakeitimas neįrodo paskyros vagystės ar vykdymo. |
| MCP platformos prižiūrėtojas | Keičiasi vietinio paleidimo komanda, priklausomybė, prieigos apimtis ar grąžinama instrukcija | Palyginti tikslią komandą, argumentus, versijas, teises ir patvirtintus metaduomenis. Prieš paleidžiant nepatikimą serverį peržiūrėti kodą ir konfigūraciją. Pakeistas teises patvirtinti iš naujo. | Įrankių aprašai keičiasi ir per įprastus atnaujinimus. Metaduomenų hash neužfiksuoja dvejetainių failų, priklausomybių ar nuotolinės būsenos. |
| SOC | Įrenginyje randamas failas, atitinkantis paskelbtą archyvo hash, ar jam priskiriamas komponentas | Išsaugoti tikslų hash, gavimo šaltinį, kelią, įrenginį, naudotoją ir laikus. Taikyti esamą radinių tvarkymo politiką ir nustatyti, ar failai išpakuoti ar vykdyti. | Laboratorijoje ar atsisiuntimų cache gali būti tokių baitų be užkrėtimo. Įprasta Lua DLL rodo runtime, ne malware šeimą. |
| SOC / incidentų valdymo komanda | Netikėtas procesas naudoja gretimą Lua ar tekstinį failą arba apsauga praneša apie susijusį vykdymą | Surinkti proceso failą ir hash, komandų eilutę, parent procesą, naudotoją, sesiją ir stabilų proceso ID. Tirti procesų grandinę. Dėl izoliavimo ir prisijungimų ar sesijų peržiūros spręsti pagal esamą incidentų politiką. | Lua ir failus tekstiniais pavadinimais naudoja žaidimai bei patvirtinta automatika. Vien panašūs failų vardai šios grandinės nepatvirtina. |
| SOC / tinklo komanda | Išeinantis ryšys susiejamas su tiriamu procesu | Susieti ryšio paskirties adresą, laiką, faktinį domeną ar IP ir turimus HTTP duomenis su tuo procesu bei įrenginio įrodymais. Blokavimą grįsti patvirtintais IOC ir veiklos kontekstu. | Blockchain RPC ir `eth_call` turi teisėtų paskirčių. TLS metaduomenys neatskleidžia smart contract ar selektoriaus. Bendras viešas RPC adresas nepagrindžia viso jo blokavimo dėl kampanijos. |

Tai siūlomi sprendimai radinių patikrai. Aptikimo taisyklių šiame tyrime nevertinau, aukos procesų įrašų ir išmatuoto taisyklių tikslumo neturiu. Windows aplinkoje [Sysmon](https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon) 1 įvykis pateikia proceso kontekstą ir sukonfigūruotus hash. Įrašus siekite pagal ProcessGuid ir laikus, ne vien PID. Tinklo ryšių (3 įvykis) ir modulių įkėlimo (7 įvykis) rinkimas pagal numatytuosius nustatymus išjungtas. 11 įvykis fiksuoja sukūrimą ar perrašymą, ne bet kokį skaitymą. 22 įvykis fiksuoja DNS užklausas. DNS įrašo nebuvimas neatmeta tiesioginio ryšio su IP. Prieš darydami išvadą iš trūkstamo įvykio patikrinkite rinkimo nustatymus ir saugojimo trukmę.

Prieš remdamiesi tokiu ryšiu, palyginkite jį su patvirtintomis Lua programomis, teisėtomis užkoduotomis konstantomis, įprastais ZIP failais ir blockchain klientais. Lua, PowerShell, `BitBlt` ir `eth_call` naudojami ir teisėtai. Reikia įrodymų, kurie susietų failų kilmę, teises ir netikėtą elgesį.

## Kas lieka neatsakyta

Ankstesnių skill archyvų vėlesni payload lieka nepatikrinti. Atskirame OnionClaw atvejyje patikrinau archyvo failus, du užduočių failus, native wrapper ir pasirinktą vidinio PE tekstą. Tai neišsprendžia Spectrum aprašyto kliento ir atsakymo neatitikimo ir neparodo vykdymo aukos įrenginyje. Vieši commit metaduomenys taip pat nepasako, kas valdė paskyrą, ar savininkas pastebėjo pakeitimą ir kaip gauta prieiga.

Neviešinamos kandidatės galėjo būti aprašytos kituose šaltiniuose, kurių palyginimo sąrašai neapima. Visas Apiiro sąrašas nebuvo viešas, todėl negaliu teigti, kad jį papildžiau. Šiame darbe patvirtinau datuotus commit bei katalogų medžių pakeitimus, patikrinau galimą diegiklio kopijavimo kelią, radau išsaugotą masalo tekstą duomenų rinkinyje, atlikau atskirą paiešką pagal failų pavadinimus, ribotai dekodavau statinius duomenis ir nepriklausomai atkūriau paskelbtų adresų pasikeitimo istoriją. Tolesniam išpakavimui, dinaminei analizei ir koordinuotam atskleidimui reikės atskirų įrašų bei peržiūros.

## Papildomi stebėjimai ir prieigos ribos

[Metodika](/assets/data/fakegit-ai-skills-v1/methodology.md), [viešinimui parengti GitHub stebėjimai](/assets/data/fakegit-ai-skills-v1/github-observations.json), [pasyvūs IOC stebėjimai](/assets/data/fakegit-ai-skills-v1/ioc-observations.json) ir [vaizdų kilmės duomenys](/assets/data/fakegit-ai-skills-v1/figures.json) išsaugo viešą šios peržiūros medžiagą. Kenkėjiškų archyvų ir neviešinamų kandidačių tapatybių juose nėra. Vaizdų hash identifikuoja užfiksuotus vaizdus, ne archyvo baitus ar užkrėtimą.

Bandžiau pasiekti kiekvieną Apiiro "Prior Work" nuorodą. Trend Micro puslapis per naudotą skaitymo priemonę nepateikė viso turinio. akj puslapis blokavo automatinį skaitymą, šio ribojimo neapėjau. [Reddit pranešimas](https://www.reddit.com/r/github/comments/1isxhas/if_youre_creating_new_repositories_they_are_being/) yra ankstyvas atskiras liudijimas. [Rushter kodo peržiūra](https://rushter.com/blog/github-malware/) pateikia paieškos šablonus, bet rodo paskutinio atnaujinimo datą. Ji nepatvirtina pirmo paskelbimo datos. Šiuos prieigos ir šaltinių skirtumus užfiksavau tyrimo įraše.

[Papildomo tyrimo rinkinyje](/assets/data/fakegit-ai-skills-v2/README.md) yra atskira grandinė, paieškų apimtis ir daugiau adresų pakeitimų įrašų. Ankstesni v1 duomenys liko nepakeisti.

## Šaltiniai

Tekste ir viešuose tyrimo įrašuose naudoti šaltiniai.

### Tyrimai

- [Apiiro - Never Deleted, Only Re-Pointed](https://apiiro.com/blog/never-deleted-only-re-pointed)
- [Island - AgentBaiting](https://www.island.io/blog/agentbaiting-how-800-fake-ai-skills-and-mcp-servers-delivered-malware)
- [Snyk - ToxicSkills](https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/)
- [Derp - FakeGit ir LuaJIT](https://www.derp.ca/research/fakegit-luajit-github-campaign/)
- [Hexastrike - SmartLoader ir StealC](https://hexastrike.com/resources/blog/threat-intelligence/cloned-loaded-and-stolen-how-109-fake-github-repositories-delivered-smartloader-and-stealc/)
- [ASEC - SmartLoader analizė](https://asec.ahnlab.com/en/89551/)
- [Netskope - Developers in the Crosshairs](https://threatlabs.netskope.com/blog/2026/08/developers-in-the-crosshairs-fake-ai-tools-deliver-infostealer)
- [Netskope - OpenClaw masalų kūrimas](https://www.netskope.com/blog/openclaw-trap-ai-assisted-lure-factory-targets-developers-gamers)
- [Orchid - malware platinančios GitHub repo](https://orchidfiles.com/github-repositories-distributing-malware/)
- [Atomdrift - surf paketas ir pridėta vykdymo aplinka](https://atomdrift.org/discoveries/2026/06/surf-byo-interpreter/)
- [Spectrum - netikras OnionClaw ir duomenų vagystė](https://www.spectrum.security/blog/fake-onionclaw-infostealer)
- [Check Point - Stargazers Ghost Network](https://research.checkpoint.com/2024/stargazers-ghost-network/)
- [Rushter - kenkėjiško GitHub kodo peržiūra](https://rushter.com/blog/github-malware/)

### Fiksuotos kodo ir duomenų rinkinių versijos

- [Island repo ir hash rinkinys, versija 72b77c0](https://github.com/island-io/island-security-research-artifacts/blob/72b77c0e2cc53cae92acd27258cf229077e1bfca/agentbaiting/malicious-repositories-and-zip-hashes-2026-07.csv)
- [Orchid repo sąrašas, versija 5ffa27e](https://github.com/orchidfiles/git-malware-finder/blob/5ffa27e2bc9dce7758379519aa6a272438b01192/full-list.txt)
- [Vercel skills diegiklis ir katalogų kopijavimas, versija e878c45](https://github.com/vercel-labs/skills/blob/e878c4502674f84094dc27b5ad94ddaf64f22551/src/installer.ts#L371)
- [Prometheus EncryptStrings, versija a4efc5f](https://github.com/prometheus-lua/Prometheus/blob/a4efc5f381c50ae2a111bdbb9272fa3203685be3/src/prometheus/steps/EncryptStrings.lua#L121)
- [Prometheus autorystės licencija, versija a4efc5f](https://github.com/prometheus-lua/Prometheus/blob/a4efc5f381c50ae2a111bdbb9272fa3203685be3/LICENSE)
- [QuillCTF selektoriaus sutapimo pavyzdys, versija d084f60](https://github.com/DeFiHackLabs/Web3-CTF-Intensive-CoLearning/blob/d084f6026b05148455e50b3aae8c0750d1976327/Writeup/Tanner/src/QuillCTF/PseudoRandom.sol#L47)

- [Spectrum paskelbti grandinės indikatoriai](https://www.spectrum.security/posts/fake-onionclaw-infostealer/indicators.json)

### Oficiali dokumentacija ir saugumo pranešimai

- [GitHub - kodo paieškos ribos](https://docs.github.com/en/search-github/searching-on-github/searching-code)
- [GitHub - web Code Search ribos](https://docs.github.com/en/search-github/github-code-search/about-github-code-search#limitations)
- [RFC 6229 - RC4 testai](https://www.rfc-editor.org/rfc/rfc6229)

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

Tai platformų įrašai. Pats ryšio su C2 nestebėjau.

- [VirusTotal - esami Communicating Files ryšiai](https://www.virustotal.com/gui/ip-address/185.10.68.110/relations)
- [urlscan - esamas skenavimo įrašas](https://urlscan.io/result/01a11335-62e8-74da-b047-058c3c79a3e7/)
