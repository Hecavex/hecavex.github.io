---
title: "T1187 Forced Authentication: kaip aptikti ir suvaldyti NTLM autentifikavimo prievartą"
card_title: "T1187 Forced Authentication: aptikimas ir apsauga"
description: "Gynybinis T1187 vadovas apie priverstinį SMB ir WebDAV autentifikavimą, Windows įrodymus, NTLM auditą, egress kontrolę ir incidento valdymą."
seo_title: "T1187 Forced Authentication aptikimas ir apsauga"
seo_description: "Kaip aptikti T1187 priverstinį SMB ir WebDAV autentifikavimą, susieti Windows bei tinklo įrodymus ir suvaldyti galimą NTLM ekspoziciją."
seo_keywords:
  - "T1187 Forced Authentication"
  - "priverstinis NTLM autentifikavimas"
  - "outbound NTLM aptikimas"
  - "SMB autentifikavimo prievarta"
  - "WebDAV saugumas"
  - "Net-NTLMv2 incidentas"
date: 2026-08-31 18:15:00 +0300
lang: lt
translation_key: t1187-forced-authentication
permalink: /lt/tyrimai/t1187-forced-authentication-aptikimas-apsauga/
author: deividas-lis
content_type: technical-guide
publication_class: technical-assessment
confidence: high
tlp: clear
categories: [threat-intelligence, identity-security, tradecraft]
tags: [T1187, Forced Authentication, NTLM, SMB, WebDAV, Windows, credential access, detection engineering, incident response]
featured: false
draft: false
published: true
toc: true
comments: false
prose_width: wide
scope: "Windows aplinkų gynybinis procesas, skirtas aptikti, apriboti ir tirti priverstinį autentifikavimą per SMB arba WebDAV, siejant endpoint, tinklo bei identity įrodymus."
limitations: "Vadove nėra credential capture, relay, cracking, lure konstravimo ar exploitation instrukcijų. Telemetrija priklauso nuo Windows versijos, licencijų ir sensorių aprėpties, o vienas outbound autentifikavimo bandymas savaime neįrodo kompromitavimo."
methods:
  - "MITRE ATT&CK technikos ir detection strategijos analizė"
  - "Microsoft Windows autentifikavimo bei SMB hardening dokumentacijos analizė"
  - "Valstybinių institucijų advisories palyginimas"
  - "Gynybinės įrodymų grandinės modeliavimas"
evidence_basis: "MITRE ATT&CK T1187, aktuali Microsoft NTLM audito ir SMB hardening dokumentacija, Microsoft saugumo rekomendacijos bei vieši valstybiniai pranešimai apie stebėtą forced-authentication veiklą."
key_findings:
  - "Naudingas detection vienetas yra grandinė: pasiekiamas nepatikimas objektas, Windows komponentas bando gauti nutolusį resursą, o įrenginys siunčia NTLM autentifikavimą už patvirtintos ribos."
  - "Outbound TCP 445 blokavimas yra stipri kontrolė, tačiau neuždaro WebDAV kelio per HTTP ar HTTPS ir nepakeičia NTLM audito."
  - "Autentifikavimo bandymas yra ekspozicijos įrodymas, o ne automatinis patvirtinimas, kad medžiaga buvo gauta, nulaužta, relay'inta ar panaudota."
  - "Tvari apsauga jungia egress ribojimą, planingą NTLM mažinimą, stiprius slaptažodžius, phishing atsparią autentifikaciją, endpoint matomumą ir išbandytą identity containment procesą."
image:
  path: /assets/img/posts/2026-08-31-t1187-forced-authentication/t1187-forced-authentication-hero.svg
  social: /assets/img/social/t1187-forced-authentication-lt.png
  thumbnail: /assets/img/posts/2026-08-31-t1187-forced-authentication/t1187-forced-authentication-hero.svg
  alt: "T1187 gynybinė įrodymų grandinė nuo nepatikimos nuorodos į nutolusį resursą iki outbound autentifikavimo ir endpoint, tinklo bei identity telemetrijos"
  width: 1600
  height: 900
---

## Pavojingą veiksmą gali atlikti pati sistema

Forced Authentication dažnai paaiškinama per grubiai: „failas pavagia slaptažodį“. Toks sakinys neparodo nei Windows elgsenos, nei ribos tarp autentifikavimo bandymo ir realaus paskyros kompromitavimo. [MITRE ATT&CK T1187](https://attack.mitre.org/techniques/T1187/) aprašo situaciją, kai threat actor priverčia tikslinę sistemą autentifikuotis į jo stebimą infrastruktūrą. Žmogus gali atverti laišką, dokumentą ar katalogą, tačiau svarbią tinklo užklausą kartais sugeneruoja pati sistema, bandydama paimti nutolusį resursą.

Per NTLM challenge-response nėra siunčiamas atviras vartotojo slaptažodis. Vis dėlto gauta medžiaga gali būti vertinga offline guessing, relay ar kitam tolesniam piktnaudžiavimui. Šių etapų negalima suplakti. Ryšio bandymas, pilnas NTLM exchange, medžiagos gavimas, sėkmingas password cracking, relay ir vėlesnis prisijungimas yra skirtingi teiginiai, kuriems reikia skirtingų įrodymų.

Todėl geras T1187 procesas prasideda ne nuo dramatiško „credential stolen“ alert'o. Jis prasideda nuo paprastesnių klausimų: kodėl šis įrenginys bandė Windows autentifikavimą į šį hostą, kas inicijavo ryšį, ar srautas buvo užblokuotas, kokia identity buvo eksponuota ir ar po to matome jos panaudojimą?

<aside class="hx-callout warning"><strong>Gynybinė riba</strong>Šiame vadove nėra failo ar lure konstravimo, challenge-response surinkimo, relay, slaptažodžio atkūrimo ar exploitation veiksmų. Tikslas yra neleisti elgsenai įvykti, ją aptikti ir korektiškai ištirti.</aside>

## Kaip atrodo pati grandinė

Patogu ją dalyti į keturias dalis:

1. **Yra trigger'is.** Laiškas, dokumentas, shortcut'as, kalendoriaus objektas, bendrinamo katalogo įrašas ar kitas artefaktas turi nuorodą į nutolusį resursą.
2. **Windows komponentas bando jį gauti.** Shell'as, programa ar service'as nori parodyti ikoną, template'ą, paveikslą ar kitą turinį. Atskiro prisijungimo lango vartotojas gali nematyti.
3. **Pasirenkamas tinklo protokolas.** SMB įprastai siejamas su TCP 445. Kai kuriuose Windows workflow'uose, SMB neveikiant, nutolęs resursas gali būti pasiekiamas per WebDAV, veikiantį virš HTTP arba HTTPS.
4. **Sistema bando autentifikuotis.** Priklausomai nuo politikos, paskirties ir aplinkos, gali būti suderėtas NTLM bei atskleista vartotojo ar kompiuterio identity.

Tai konceptualus modelis, ne attack recipe. Gynybai svarbu tai, kad atskirai paimtas procesas ar network connection gali atrodyti normaliai. Rizika atsiranda iš konteksto: procesas atidarė iš išorės gautą objektą ir tuoj pat inicijavo Windows autentifikavimą į nepatvirtintą Interneto paskirties tašką.

[Microsoft NTLM apžvalga](https://learn.microsoft.com/en-us/windows-server/security/kerberos/ntlm-overview) paaiškina, kodėl šis protokolas tebėra realiose organizacijose. Active Directory aplinkoje pageidaujamas Kerberos, tačiau workgroup'ai, lokalios paskyros, legacy sistemos ir dalis programų vis dar priklauso nuo NTLM. Todėl taisyklė „bet koks NTLM yra incidentas“ paskandins SOC triukšme, o taisyklė „NTLM pas mus turbūt reikia“ paliks aklą zoną.

### SMB ir WebDAV nėra tas pats įrodymas

Outbound SMB į viešą IP daugelyje workstation aplinkų yra pakankamai neįprastas, kad taptų stipria blokavimo ir detection vieta. Tačiau tai nėra visas T1187 paviršius. MITRE nurodo, kad WebDAV gali būti alternatyvus kelias per web srautui įprastus portus. Vadinasi, TCP 445 blokavimas gali uždaryti SMB, bet ne būtinai nutraukti autentifikavimo kelią per HTTP ar HTTPS.

Kita vertus, kiekvienas TCP 443 ryšys nėra WebDAV, o kiekvienas WebDAV naudojimas nėra kenkėjiškas. Reikia matyti protokolą, procesą, destination, autentifikavimą ir objektą, nuo kurio prasidėjo veiksmas. Portas yra filtras, ne verdict'as.

## Trys telemetrijos plokštumos

Praktiškas detection sieja endpoint, network ir authentication įvykius trumpame laiko lange. Kiekviena plokštuma atsako į kitą klausimą.

| Plokštuma | Ką turime sužinoti | Naudingi laukai |
| --- | --- | --- |
| endpoint | koks objektas sukurtas, atvertas, peržiūrėtas arba enumerated, koks procesas tai darė? | failo kilmė, attachment ID, parent ir child procesai, command-line kontekstas, vartotojas, device, download provenance |
| tinklas | koks procesas kur kreipėsi ir kokiu protokolu? | destination IP bei hostname, portas, URL ar metodas, procesas, įrenginys, proxy ir firewall action |
| autentifikavimas | ar NTLM buvo bandytas, leistas, audituotas ar užblokuotas, kas vyko po to? | account, workstation, target server, NTLM audit event, logon type, cloud sign-in ir risk signalai |

[Microsoft `DeviceNetworkEvents` dokumentacija](https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-devicenetworkevents-table) aprašo Defender XDR tinklo įvykių lentelę. Kiti EDR produktai turi analogišką informaciją. Svarbus ne produkto logotipas, o galimybė iš destination ir timestamp grįžti iki konkretaus proceso bei įrenginio. Perimeter firewall'as, kuriame lieka tik NAT adresas ir destination, gali srautą sustabdyti, bet dažnai nepasakys, kuris failas jį inicijavo.

NTLM matomumui Microsoft rekomenduoja auditą prieš blokavimą. [Defender for Identity Windows event collection](https://learn.microsoft.com/en-us/defender-for-identity/deploy/configure-windows-event-collection) aprašo NTLM auditing ir Event 8004 enrichment. Outgoing NTLM politikos audit bei block įvykiai taip pat registruojami `Microsoft-Windows-NTLM/Operational` žurnale. Tačiau event'ų vieta ir turinys priklauso nuo OS bei politikų, todėl aprėptį patikrinkite representative klientuose, serveriuose ir domain controller'iuose.

### Detection logika be produkto pririšimo

```text
Trumpame laiko lange tame pačiame įrenginyje ir user kontekste:
  pasiekiamas iš išorės gautas arba neįprastas objektas
  IR procesas bando gauti nutolusį resursą
  IR SMB arba WebDAV pasiekia nepatvirtintą destination
  IR NTLM bandymas audituojamas, leidžiamas arba blokuojamas

Prioritetą didina:
  viešas ar pirmą kartą matomas destination
  objektas gautas per el. paštą, chat arba download
  tą patį destination pasiekia keli vartotojai ar įrenginiai
  įtrauktas administratoriaus account'as ar PAW
  vėliau matomi neįprasti identity veiksmai
```

Ši koreliacija taip pat primena, kodėl negalima tiesiog ištrinti laiško ar failo uždarius network alert'ą. Originalus objektas, jo delivery metadata ir hash gali būti vienintelė patikima grandis iki kitų gavėjų.

### False positive nėra priežastis išjungti taisyklę

Programų diegimas, dokumentų valdymo sistemos, remote share'ai, intraneto sprendimai ir administravimo procesai gali teisėtai naudoti SMB, WebDAV ar NTLM. Tokį srautą reikia ne ignoruoti, o suregistruoti. Gera išimtis turi service owner'į, business purpose, aiškų source ir destination, numatytą protokolą bei review datą.

„Leisti visus cloud IP“ arba „leisti visą 443“ nėra tvari išimtis. Tai nauja akla zona. Allowlist'inkite mažiausią stabilų vienetą, kurį galite valdyti, ir periodiškai patikrinkite, ar priklausomybė dar egzistuoja.

## Apsauga: neleiskite nereikalingam autentifikavimui išeiti

### Ribokite outbound SMB endpoint ir network lygiu

Daugumai vartotojų workstation'ų nereikia inicijuoti SMB į viešą Internetą. Outbound TCP 445 bei legacy NetBIOS kelius blokuokite host firewall ir tinklo riboje, išskyrus dokumentuotus atvejus. Blokavimo event'us rinkite: prevention įvykis vis tiek rodo, kad kažkas bandė užmegzti ryšį.

Perimeter-only kontrolė neapsaugo roaming laptop'o namų tinkle ar split-tunnel VPN scenarijuje. Reikia host politikos ir, jei naudojama, secure access infrastruktūros. Patikrinkite IPv4, IPv6, guest network ir nuotolinio darbo kelius, o ne tik centrinio biuro egress.

### WebDAV vertinkite atskirai

Inventorizuokite, kam realiai reikalingas Windows WebClient service'as ar išorinis WebDAV. Jei nereikalingas, capability galima išjungti arba apriboti per normalų change procesą. Jei reikalingas, nustatykite leidžiamus destination ir rinkite web telemetriją, kuri atskirtų valdomą repository nuo atsitiktinio Interneto hosto.

Teiginys „445 užblokavome, finding closed“ nėra tikslus. Uždarytas vienas kelias.

### NTLM mažinkite po audito, ne iš nuojautos

Microsoft [outgoing NTLM politikos apraše](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/jj852213%28v%3Dws.11%29) rekomenduoja pirmiausia `Audit all`, tada peržiūrėti reikalingus serverius ir tik tuomet pereiti prie deny su siauromis išimtimis. Naujesnė Windows versija taip pat gali [blokuoti NTLM outbound SMB ryšiuose](https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-ntlm-blocking), neatsisakant NTLM visoje aplinkoje vienu pavojingu pakeitimu.

Kiekvieną priklausomybę priskirkite programai ir owner'iui. Kur galima, pereikite prie Kerberos ar modern authentication. Išimtis laikykite technine skola su terminu. Skubus „deny all“ be audito gali sulaužyti verslo procesus ir paskatinti administratorius kurti dar blogesnius workaround'us.

### Mažinkite eksponuotos medžiagos vertę

Ilgi, unikalūs slaptažodžiai apsunkina offline guessing, nors neišsprendžia relay ir kitų NTLM rizikų. Privileged account'ai neturėtų naršyti el. pašto ar bendrų katalogų iš administravimo darbo vietų. Lokalūs administratorių slaptažodžiai turi būti unikalūs ir valdomi, service account'ų secret'ai – ilgi, atsitiktiniai, su ribotomis logon teisėmis.

Cloud identity apsaugai taikykite phishing atsparią autentifikaciją ir Conditional Access, o ne manykite, kad kiekvienas credential incidentas baigiasi password reset'u. HECAVEX analizė [MFA nėra panacėja](/lt/tyrimai/mfa-nera-panaceja-ir-laikas-nustoti/) atskiria slaptažodį, MFA veiksmą ir session token'ą. Tai ypač svarbu, jei tas pats lure vedė ir į Windows forced authentication, ir į interaktyvų phishing.

## Triage: įvardykite tai, ką įrodymai tikrai rodo

| Stebėjimas | Korektiškas teiginys | Veiksmas |
| --- | --- | --- |
| outbound ryšys užblokuotas prieš autentifikavimą | įrenginys bandė pasiekti nepatvirtintą resursą | išsaugoti trigger'į, ieškoti tokių pačių objektų ir destination, patikrinti policy coverage |
| NTLM bandymas audituotas į nepatikimą destination | autentifikavimo medžiaga galėjo būti eksponuota | pagal riziką izoliuoti ar riboti endpoint, įvertinti account kritiškumą, hunt'inti susijusią veiklą |
| patvirtintas pilnas exchange | serveris turėjo galimybę stebėti challenge-response medžiagą | eskaluoti identity containment, nustatyti visas eksponuotas user ir computer identities, tirti relay ar guessing požymius |
| po to matomas įtartinas paskyros naudojimas | ekspozicija galėjo pereiti į panaudojimą | valdyti kaip identity incidentą, stabdyti account'us ir sessions, saugoti log'us, tirti persistence bei impact |

Pradėkite nuo laiko, įrenginio, vartotojo ir objekto. Išsaugokite laišką su headers, attachment ar failo hash, endpoint timeline, DNS, proxy, firewall bei NTLM įvykius ir vėlesnę identity veiklą. Įtartiną objektą laikykite quarantine pagal įrodymų procedūrą. Neatidarinėkite jo analitiko workstation'e vien tam, kad „patvirtintumėte alert'ą“.

Scope klausimai:

1. Kas dar gavo arba pasiekė tą patį objektą?
2. Kokie kiti įrenginiai jungėsi į tą patį destination ar susijusią infrastruktūrą?
3. Kokios user, computer ir privileged identities tuo metu buvo aktyvios?
4. Ar po bandymo matome password guessing, relay primenančią prieigą, naują prisijungimą, mailbox pakeitimą ar lateral movement?

Password reset gali būti reikalingas, bet jis turi atitikti įrodymus. Jei įtariamas cloud session abuse, revoke'inkite sessions ir naudokite identity provider token-theft playbook. Jei turite tik užblokuotą network attempt, taip ir parašykite. Per ankstyvas „account compromised“ blogina tyrimo kokybę lygiai taip pat kaip rizikos ignoravimas.

### Užbaikite incidentą kontrolės patikrinimu

Po containment neužtenka uždaryti alert'ą ir palikti vieną IOC blocklist'e. Patikrinkite, kodėl objektas pasiekė vartotoją, kuri kontrolė pirmoji jį sustabdė ir kuri telemetrija būtų dingusi, jei laptop'as tuo metu būtų buvęs už įmonės tinklo. Pakartotinai peržiūrėkite panašių žinučių gavėjus, endpoint policy status, firewall išimtis ir NTLM audito aprėptį. Jei tyrimas atskleidė teisėtą legacy priklausomybę, sukurkite jos migracijos owner'į bei terminą, o ne nuolatinę plačią išimtį.

Incidento įraše atskirkite prevention, detection ir response rezultatus. Pavyzdžiui: firewall sustabdė SMB, EDR susiejo ryšį su iš el. pašto gautu objektu, tačiau WebDAV ir roaming device aprėptis dar nepatvirtinta. Toks sakinys duoda komandai konkretų backlog. Vien „blocked, no impact“ jo neduoda.

## Threat context nėra attribution įrodymas

Vieši šaltiniai T1187 sieja su skirtingais actor'iais ir pažeidžiamumais. APT Notes [APT28 dossier](https://apt.hecavex.com/actors/apt28/) išsaugo Microsoft attribution bei CVE-2023-23397 naudojimo kontekstą, o [Forced Authentication technikos įrašas](https://apt.hecavex.com/techniques/forced-authentication/) aiškiai parodo ATT&CK ryšį.

Tai nėra attribution shortcut'as. T1187 aptikimas jūsų aplinkoje nereiškia APT28. Techniką gali naudoti daug actor'ių, ją gali atkartoti security įrankis, o panašų network signalą gali sukurti klaidinga konfigūracija. HECAVEX [confidence metodika](/lt/tyrimai/pasitikejimas-yra-laukas/) leidžia pažymėti technikos stebėjimą high confidence, bet palikti actor claim'ą unsupported.

## Minimalus veikiančios kontrolės standartas

Organizacija yra geresnėje padėtyje, jei gali atsakyti „taip“:

- ar outbound SMB iš valdomų endpoint'ų blokuojamas arba siaurai allowlist'inamas ir log'inamas?
- ar external WebDAV išjungtas, apribotas arba matomas?
- ar NTLM naudojimas inventorizuotas audito duomenimis?
- ar SOC gali nuo destination grįžti iki proceso ir pirminio objekto?
- ar privileged identity atskirta nuo kasdienio browsing ir messaging?
- ar password, session ir token containment procesai išbandyti?
- ar išimtys turi owner'į, galiojimo terminą ir įrodytą poreikį?

Tikslas nėra dashboard'as su užrašu „T1187 coverage 100%“. Tikslas – užblokuoti dažniausią kelią, aptikti likutį, išsaugoti teisingus įrodymus ir neapsimesti, kad vienas event'as pasako visą istoriją.

## Oficialūs ir pirminiai šaltiniai

- [MITRE ATT&CK: Forced Authentication, T1187](https://attack.mitre.org/techniques/T1187/)
- [Microsoft Learn: NTLM overview in Windows Server](https://learn.microsoft.com/en-us/windows-server/security/kerberos/ntlm-overview)
- [Microsoft Learn: Windows event auditing for Defender for Identity](https://learn.microsoft.com/en-us/defender-for-identity/deploy/configure-windows-event-collection)
- [Microsoft Learn: outgoing NTLM traffic restriction](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/jj852213%28v%3Dws.11%29)
- [Microsoft Learn: NTLM blocking for SMB](https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-ntlm-blocking)
- [Microsoft Learn: SMB security hardening](https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-security-hardening)
- [Microsoft Security Response Center: CVE-2023-23397](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2023-23397)
- [CISA ir partneriai: Russian GRU targeting Western logistics entities and technology companies, AA25-141A](https://www.cisa.gov/news-events/cybersecurity-advisories/aa25-141a)

_Vertinimo data: 2026 m. rugpjūčio 31 d. Dokumentuotai Windows elgsenai ir bendroms kontrolėms taikomas high confidence. Konkrečios organizacijos detectability priklauso nuo endpoint, network bei identity telemetrijos aprėpties._
