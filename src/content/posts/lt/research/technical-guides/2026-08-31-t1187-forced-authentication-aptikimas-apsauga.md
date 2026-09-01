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
  path: /assets/img/posts/2026-08-31-t1187-forced-authentication/t1187-forced-authentication-hero-v2.webp
  social: /assets/img/social/t1187-forced-authentication-lt.png
  thumbnail: /assets/img/posts/2026-08-31-t1187-forced-authentication/t1187-forced-authentication-card-v2.webp
  alt: "T1187 gynybinė įrodymų grandinė nuo nepatikimos nuorodos į nutolusį resursą iki outbound autentifikavimo ir endpoint, tinklo bei identity telemetrijos"
  width: 1600
  height: 900
---

## Pavojingą veiksmą gali atlikti pati sistema

Forced Authentication dažnai paaiškinama per grubiai: "failas pavagia slaptažodį". Toks sakinys neparodo nei Windows elgsenos, nei ribos tarp autentifikavimo bandymo ir realaus paskyros kompromitavimo. [MITRE ATT&CK T1187](https://attack.mitre.org/techniques/T1187/) aprašo situaciją, kai threat actor priverčia tikslinę sistemą autentifikuotis į jo stebimą infrastruktūrą. Žmogus gali atverti laišką, dokumentą ar katalogą, tačiau svarbią tinklo užklausą kartais sugeneruoja pati sistema, bandydama paimti nutolusį resursą.

Per NTLM challenge-response nėra siunčiamas atviras vartotojo slaptažodis. Vis dėlto gauta medžiaga gali būti vertinga offline guessing, relay ar kitam tolesniam piktnaudžiavimui. Šių etapų negalima suplakti. Ryšio bandymas, pilnas NTLM exchange, medžiagos gavimas, sėkmingas password cracking, relay ir vėlesnis prisijungimas yra skirtingi teiginiai, kuriems reikia skirtingų įrodymų.

Todėl geras T1187 procesas prasideda ne nuo dramatiško "credential stolen" alert'o. Jis prasideda nuo paprastesnių klausimų: kodėl šis įrenginys bandė Windows autentifikavimą į šį hostą, kas inicijavo ryšį, ar srautas buvo užblokuotas, kokia identity buvo eksponuota ir ar po to matome jos panaudojimą?

<aside class="hx-callout warning"><strong>Gynybinė riba</strong>Šiame vadove nėra failo ar lure konstravimo, challenge-response surinkimo, relay, slaptažodžio atkūrimo ar exploitation veiksmų. Tikslas yra neleisti elgsenai įvykti, ją aptikti ir korektiškai ištirti.</aside>

## Kaip atrodo pati grandinė

Patogu ją dalyti į keturias dalis:

1. **Yra trigger'is.** Laiškas, dokumentas, shortcut'as, kalendoriaus objektas, bendrinamo katalogo įrašas ar kitas artefaktas turi nuorodą į nutolusį resursą.
2. **Windows komponentas bando jį gauti.** Shell'as, programa ar service'as nori parodyti ikoną, template'ą, paveikslą ar kitą turinį. Atskiro prisijungimo lango vartotojas gali nematyti.
3. **Pasirenkamas tinklo protokolas.** SMB įprastai siejamas su TCP 445. Kai kuriuose Windows workflow'uose, SMB neveikiant, nutolęs resursas gali būti pasiekiamas per WebDAV, veikiantį virš HTTP arba HTTPS.
4. **Sistema bando autentifikuotis.** Priklausomai nuo politikos, paskirties ir aplinkos, gali būti suderėtas NTLM bei atskleista vartotojo ar kompiuterio identity.

Tai konceptualus modelis, ne attack recipe. Gynybai svarbu tai, kad atskirai paimtas procesas ar network connection gali atrodyti normaliai. Rizika atsiranda iš konteksto: procesas atidarė iš išorės gautą objektą ir tuoj pat inicijavo Windows autentifikavimą į nepatvirtintą Interneto paskirties tašką.

[Microsoft NTLM apžvalga](https://learn.microsoft.com/en-us/windows-server/security/kerberos/ntlm-overview) paaiškina, kodėl šis protokolas tebėra realiose organizacijose. Active Directory aplinkoje pageidaujamas Kerberos, tačiau workgroup'ai, lokalios paskyros, legacy sistemos ir dalis programų vis dar priklauso nuo NTLM. Todėl taisyklė "bet koks NTLM yra incidentas" paskandins SOC triukšme, o taisyklė "NTLM pas mus turbūt reikia" paliks aklą zoną.

![Forced authentication grandinė nuo nuotolinės nuorodos per Windows resurso apdorojimą iki išeinančio SMB ar WebDAV autentifikavimo](/assets/img/posts/2026-08-31-t1187-forced-authentication/t1187-authentication-path-lt.svg)

*Schema: Įtartinas požymis atsiranda visoje grandinėje, o ne atskirai vertinant dokumentą, procesą ar tinklo užklausą.*

### Vertinkite protokolo būseną, o ne vien paskirties portą

SMB įvykis tampa daug vertingesnis, kai sensorius atskiria transporto ryšį nuo autentifikavimo būsenos. SMB2 sesija dažniausiai prasideda `SMB2 NEGOTIATE`, o vėliau klientas ir serveris apsikeičia `SMB2 SESSION_SETUP` pranešimais. [Microsoft SMB2 specifikacijoje](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-smb2/c9efe8ca-ff34-44d0-bfbe-58a9b9db50d4) nurodyta, kad `SESSION_SETUP` perneša GSS saugumo žetonus ir autentifikavimui tęsiantis gali grąžinti `STATUS_MORE_PROCESSING_REQUIRED`. [SMB2 naudoja SPNEGO](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-smb2/06451bf2-578a-4b9d-94c0-8ce531bf14c4), kad būtų pasirinktas Kerberos, NTLM ar kitas suderintas mechanizmas.

Kai pasirenkamas NTLM, [MS-NLMP apibrėžia tris svarbius pranešimus](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-nlmp/907f519d-6217-45b1-b421-dca10fc8af0d): `NEGOTIATE_MESSAGE`, `CHALLENGE_MESSAGE` ir `AUTHENTICATE_MESSAGE`. Paskutiniame gali būti vartotojo domenas, paskyros identifikatorius ir atsakas, apskaičiuotas iš serverio challenge bei vartotojo paslapties. [NTLMv2 skaičiavime naudojami serverio ir kliento challenge, laikas bei target information](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-nlmp/c0250a97-2940-40c7-82fb-20d208c71e96). Nei atviras slaptažodis, nei NT password hash nėra siunčiami.

Todėl outbound SYN paketas nėra NTLM exchange. SMB derybos nėra `AUTHENTICATE_MESSAGE`. Net-NTLMv2 atsakas nėra NT hash ir jo negalima naudoti kaip Pass-the-Hash. Microsoft tą pačią ribą aiškiai nurodo [CVE-2023-23397 tyrimo rekomendacijose](https://www.microsoft.com/en-us/security/blog/2023/03/24/guidance-for-investigating-attacks-using-cve-2023-23397/), kartu pažymėdama, kad užfiksuotas atsakas vis tiek gali būti relay taikinys arba tikrinamas offline spėjimu.

Packet capture su NTLM autentifikavimo atsaku laikykite jautriu identity įrodymu. Ribokite prieigą, užfiksuokite hash, surinkimo laiką ir sensoriaus vietą. Autentifikavimo payload nekopijuokite į ticket'us ar viešas sandbox paslaugas.

### SMB ir WebDAV nėra tas pats įrodymas

Outbound SMB į viešą IP daugelyje workstation aplinkų yra pakankamai neįprastas, kad taptų stipria blokavimo ir detection vieta. Tačiau tai nėra visas technikos paviršius. MITRE mini WebDAV kaip kitą kelią, kuris gali veikti per HTTP arba HTTPS. Windows WebDAV Redirector priklauso nuo WebClient service, kaip aprašo [Microsoft WebDAV Redirector dokumentacija](https://learn.microsoft.com/en-us/iis/publish/using-webdav/using-the-webdav-redirector).

Nedarykite išvados, kad kiekviena išorinė WebDAV užklausa perduoda NTLM. WebClient naudoja WinHTTP saugumo zonų sprendimus. [Microsoft dokumentuoja, kad automatinis credential perdavimas įprastai taikomas intraneto svetainėms, o ne Interneto FQDN su tašku](https://learn.microsoft.com/en-us/troubleshoot/windows-server/networking/credentials-prompt-access-webdav-fqdn-sites), nebent sprendimą pakeičia proxy bypass, `AuthForwardServerList` ar kita politika. Plačios credential forwarding išimtys yra ir suderinamumo faktas, ir svarbus tyrimo signalas.

Ši riba ypač svarbi CVE-2023-23397 atveju. Microsoft tyrimo rekomendacijos nurodo, kad pažeidžiamas Outlook reminder kelias galėjo be vartotojo veiksmų inicijuoti išorinį SMB autentifikavimą. Tos pačios rekomendacijos aiškina, kad konkrečiame scenarijuje išorinis WebDAV Net-NTLMv2 nesiuntė, nes Interneto zonos politika to neleido. Bendros ATT&CK galimybės negalima paversti teiginiu apie credential ekspoziciją kiekviename produkto incidente.

TCP 443 ryšys nėra WebDAV įrodymas. WebDAV metodas neįrodo, kad credential buvo persiųsti. Užblokuotas TCP 445 bandymas nėra baigtas exchange. Reikia protokolo būsenos, proceso, destination, policy rezultato, autentifikavimo būsenos ir pirminio objekto konteksto.

## Prieš nustatydami severity naudokite įrodymų pakopas

| Pakopa | Ką patvirtina įrodymai | Kokį teiginį galima pagrįsti |
| --- | --- | --- |
| 0 | laiške ar faile yra nuoroda į nutolusį resursą | galimas forced-authentication trigger |
| 1 | matomas DNS arba connection attempt | endpoint bandė pasiekti destination |
| 2 | patvirtintas SMB arba WebDAV application traffic | endpoint derėjosi su atitinkamu service |
| 3 | matomas NTLM `AUTHENTICATE_MESSAGE` arba lygiavertis audit įrodymas | challenge-response medžiaga buvo išsiųsta |
| 4 | nepriklausomai patvirtintas relay priėmimas arba sėkmingas offline password recovery | eksponuota medžiaga paversta naudinga prieiga |
| 5 | authenticated veiksmai susieti su identity ir incidentu | galima aprašyti ir aprėpti patvirtintą impact |

Viena pakopa automatiškai neįrodo kitos. Firewall block pirmoje pakopoje gali būti sėkminga prevention kontrolė ir vertingas detection signalas. Pilnas trečios pakopos exchange pagrindžia identity containment, bet neįrodo, kad destination medžiagą išsaugojo ar vėlesnė prieiga pavyko. Ketvirtai ir penktai pakopoms reikia priimančio service, identity provider, paveikto resurso arba kito nepriklausomai išsaugoto šaltinio.

## Trys telemetrijos plokštumos

Praktiškas detection sieja endpoint, network ir authentication įvykius trumpame laiko lange. Kiekviena plokštuma atsako į kitą klausimą.

| Plokštuma | Ką turime sužinoti | Naudingi laukai |
| --- | --- | --- |
| endpoint | koks objektas sukurtas, atvertas, peržiūrėtas arba enumerated, koks procesas tai darė? | failo kilmė, attachment ID, parent ir child procesai, command-line kontekstas, vartotojas, device, download provenance |
| tinklas | koks procesas kur kreipėsi ir kokiu protokolu? | destination IP bei hostname, portas, URL ar metodas, procesas, įrenginys, proxy ir firewall action |
| autentifikavimas | ar NTLM buvo bandytas, leistas, audituotas ar užblokuotas, kas vyko po to? | account, workstation, target server, NTLM audit event, logon type, cloud sign-in ir risk signalai |

[Microsoft `DeviceNetworkEvents` dokumentacija](https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-devicenetworkevents-table) aprašo Defender XDR tinklo įvykių lentelę. Kiti EDR produktai turi analogišką informaciją. Svarbus ne produkto logotipas, o galimybė iš destination ir timestamp grįžti iki konkretaus proceso bei įrenginio. Perimeter firewall'as, kuriame lieka tik NAT adresas ir destination, gali srautą sustabdyti, bet dažnai nepasakys, kuris failas jį inicijavo.

NTLM matomumui Microsoft rekomenduoja auditą prieš blokavimą. [Defender for Identity Windows event collection](https://learn.microsoft.com/en-us/defender-for-identity/deploy/configure-windows-event-collection) aprašo NTLM auditing ir Event 8004 enrichment. Outgoing NTLM politikos audit bei block įvykiai taip pat registruojami `Microsoft-Windows-NTLM/Operational` žurnale. Tačiau event'ų vieta ir turinys priklauso nuo OS bei politikų, todėl aprėptį patikrinkite representative klientuose, serveriuose ir domain controller'iuose.

![Forced authentication telemetrija, sujungianti endpoint, tinklo ir tapatybės įrodymų plokštumas](/assets/img/posts/2026-08-31-t1187-forced-authentication/t1187-telemetry-join-lt.svg)

*Schema: Kiekviena telemetrijos plokštuma atsako į kitą incidento klausimą, o būseną atkuria tik jų ribotas sujungimas laike.*

### Rinkite laukus, iš kurių galima atkurti būseną

Endpoint lygiu [Sysmon Event ID 3](https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon) gali registruoti procesui priskirtus network connection, kai šis event tipas įjungtas. Windows Filtering Platform auditas leidžiamus ryšius gali registruoti [Event 5156](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-5156), o blokuotus ryšius Event 5157. Šie šaltiniai yra triukšmingi, todėl juos reikia filtruoti ir nukreipti tikslingai. Išsaugokite process path, process ID, source ir destination adresus, destination port, protokolą, device, user kontekstą ir filter action.

Defender XDR lentelėje `DeviceNetworkEvents` yra tokie laukai kaip `DeviceId`, `DeviceName`, `InitiatingProcessAccountName`, `InitiatingProcessFileName`, `InitiatingProcessCommandLine`, `RemoteIP`, `RemoteUrl`, `RemotePort`, `Protocol`, `ActionType` ir `Timestamp`. Schema priklauso nuo produkto, tačiau analitinis reikalavimas nesikeičia: tame pačiame įvykyje turi likti proceso identity ir network destination, kad juos būtų galima sieti su failo, el. pašto ir autentifikavimo įrašais.

Windows autentifikavimo pusėje rinkite `Microsoft-Windows-NTLM/Operational` kanalą ir praktiškai patikrinkite, ar Event 8004 pasiekia analitikos platformą. Kur laukai prieinami, išsaugokite account, client workstation, target server, procesą arba calling context, audit ar block rezultatą ir event source host. Event 8004 enrichment gali pridėti NTLM gavusį target server, tačiau nepakeičia client-side network įrašo.

Windows Security Event 4624 nenaudokite kaip universalaus outbound signalo. Jį sukuria logon priėmusi sistema. Jei destination nekontroliuojate, inicijavusiame workstation gali nebūti lokalaus 4624, kuris patvirtintų, ką priėmė nuotolinis serveris. Būtent todėl reikalinga client network telemetrija, NTLM Operational log'ai ir protokolą suprantantys sensoriai.

Packet arba NDR sensoriumi išsaugokite metadata, kuri atskiria TCP ryšį, SMB negotiation, SPNEGO pasirinkimą, NTLM challenge ir authentication response. Alert'as, kuriame yra tik `SMB to Internet`, turi likti pirmoje ar antroje įrodymų pakopoje, kol kitas šaltinis patvirtins trečią.

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

Praktišką koreliaciją galima pradėti nuo procesui priskirto srauto, o ne nuo IOC sąrašo:

```kusto
DeviceNetworkEvents
| where Timestamp > ago(14d)
| where RemotePort in (139, 445)
| project Timestamp, DeviceId, DeviceName, InitiatingProcessAccountName,
          InitiatingProcessFileName, InitiatingProcessCommandLine,
          RemoteIP, RemoteUrl, RemotePort, Protocol, ActionType, ReportId
```

Peržiūrėkite tenant'e realiai esančias `ActionType` reikšmes ir prieš paleisdami taisyklę patikrinkite jų prasmę. Viešus adresus enrich'inkite patvirtintu external SMB inventoriumi. Pagal `DeviceId` ir siaurą laiko langą junkite failo, el. pašto, browser ir NTLM audit įvykius. Malware verdict ar jaunas domenas neturi būti privaloma sąlyga. Svarbiausia, ar procesas ir destination yra tikėtini tam įrenginiui bei vartotojui.

### False positive nėra priežastis išjungti taisyklę

Programų diegimas, dokumentų valdymo sistemos, remote share'ai, intraneto sprendimai ir administravimo procesai gali teisėtai naudoti SMB, WebDAV ar NTLM. Tokį srautą reikia ne ignoruoti, o suregistruoti. Gera išimtis turi service owner'į, business purpose, aiškų source ir destination, numatytą protokolą bei review datą.

"Leisti visus cloud IP" arba "leisti visą 443" nėra tvari išimtis. Tai nauja akla zona. Allowlist'inkite mažiausią stabilų vienetą, kurį galite valdyti, ir periodiškai patikrinkite, ar priklausomybė dar egzistuoja.

## Apsauga: neleiskite nereikalingam autentifikavimui išeiti

### Ribokite outbound SMB endpoint ir network lygiu

Daugumai vartotojų workstation'ų nereikia inicijuoti SMB į viešą Internetą. Outbound TCP 445 bei legacy NetBIOS kelius blokuokite host firewall ir tinklo riboje, išskyrus dokumentuotus atvejus. Blokavimo event'us rinkite: prevention įvykis vis tiek rodo, kad kažkas bandė užmegzti ryšį.

Perimeter-only kontrolė neapsaugo roaming laptop'o namų tinkle ar split-tunnel VPN scenarijuje. Reikia host politikos ir, jei naudojama, secure access infrastruktūros. Patikrinkite IPv4, IPv6, guest network ir nuotolinio darbo kelius, o ne tik centrinio biuro egress.

### WebDAV vertinkite atskirai

Inventorizuokite, kam realiai reikalingas Windows WebClient service'as ar išorinis WebDAV. Jei nereikalingas, capability galima išjungti arba apriboti per normalų change procesą. Jei reikalingas, nustatykite leidžiamus destination ir rinkite web telemetriją, kuri atskirtų valdomą repository nuo atsitiktinio Interneto hosto.

Teiginys "445 užblokavome, finding closed" nėra tikslus. Uždarytas vienas kelias.

### NTLM mažinkite po audito, ne iš nuojautos

Microsoft [outgoing NTLM politikos apraše](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/jj852213%28v%3Dws.11%29) rekomenduoja pirmiausia `Audit all`, tada peržiūrėti reikalingus serverius ir tik tuomet pereiti prie deny su siauromis išimtimis. Naujesnė Windows versija taip pat gali [blokuoti NTLM outbound SMB ryšiuose](https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-ntlm-blocking), neatsisakant NTLM visoje aplinkoje vienu pavojingu pakeitimu.

Kiekvieną priklausomybę priskirkite programai ir owner'iui. Kur galima, pereikite prie Kerberos ar modern authentication. Išimtis laikykite technine skola su terminu. Skubus "deny all" be audito gali sulaužyti verslo procesus ir paskatinti administratorius kurti dar blogesnius workaround'us.

Nesumaišykite trijų skirtingų kontrolių. Outbound NTLM blocking neleidžia klientui naudoti NTLM tuose SMB ryšiuose, kuriems taikoma politika. SMB signing saugo SMB pranešimų vientisumą ir mažina relay į SMB service, kuriame signing privalomas. [Microsoft SMB signing dokumentacija](https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-signing) aprašo naujesnių Windows versijų numatytus reikalavimus. Signing nesustabdo NTLM atsako išsiuntimo, neapsaugo nuo offline guessing ir savaime neblokuoja relay į kitą protokolą.

Windows autentifikavimą priimantys service turi būti apsaugoti atskirai. [Microsoft IIS Extended Protection dokumentacija](https://learn.microsoft.com/en-gb/iis/configuration/system.webserver/security/authentication/windowsauthentication/extendedprotection/) aprašo channel binding ir service binding. Teisingai sukonfigūruota Extended Protection gali padaryti relay'intą autentifikavimą netinkamą konkrečiam service. Tai nėra vienas visos organizacijos jungiklis. Prieš enforcement testuokite kiekvieną priimantį service, load balancer, TLS termination kelią ir legacy klientą.

### Mažinkite eksponuotos medžiagos vertę

Ilgi, unikalūs slaptažodžiai apsunkina offline guessing, nors neišsprendžia relay ir kitų NTLM rizikų. Privileged account'ai neturėtų naršyti el. pašto ar bendrų katalogų iš administravimo darbo vietų. Lokalūs administratorių slaptažodžiai turi būti unikalūs ir valdomi, service account'ų secret'ai – ilgi, atsitiktiniai, su ribotomis logon teisėmis.

Cloud identity apsaugai taikykite phishing atsparią autentifikaciją ir Conditional Access, o ne manykite, kad kiekvienas credential incidentas baigiasi password reset'u. HECAVEX analizė [MFA nėra panacėja](/lt/tyrimai/mfa-nera-panaceja-ir-laikas-nustoti/) atskiria slaptažodį, MFA veiksmą ir session token'ą. Tai ypač svarbu, jei tas pats lure vedė ir į Windows forced authentication, ir į interaktyvų phishing.

![Sluoksniuotas forced authentication kontrolės modelis, apimantis turinio apdorojimą, protokolų ribojimą, išeinančio srauto blokavimą ir NTLM mažinimą](/assets/img/posts/2026-08-31-t1187-forced-authentication/t1187-control-map-lt.svg)

*Schema: Prevencija ir aptikimas persidengia visoje grandinėje, tačiau viena kontrolė neįrodo, kad uždaryti visi keliai.*

## Triage: įvardykite tai, ką įrodymai tikrai rodo

| Stebėjimas | Korektiškas teiginys | Veiksmas |
| --- | --- | --- |
| outbound ryšys užblokuotas prieš autentifikavimą | įrenginys bandė pasiekti nepatvirtintą resursą | išsaugoti trigger'į, ieškoti tokių pačių objektų ir destination, patikrinti policy coverage |
| NTLM bandymas audituotas į nepatikimą destination | autentifikavimo medžiaga galėjo būti eksponuota | pagal riziką izoliuoti ar riboti endpoint, įvertinti account kritiškumą, hunt'inti susijusią veiklą |
| patvirtintas pilnas exchange | serveris turėjo galimybę stebėti challenge-response medžiagą | eskaluoti identity containment, nustatyti visas eksponuotas user ir computer identities, tirti relay ar guessing požymius |
| po to matomas įtartinas paskyros naudojimas | ekspozicija galėjo pereiti į panaudojimą | valdyti kaip identity incidentą, stabdyti account'us ir sessions, saugoti log'us, tirti persistence bei impact |

Pradėkite nuo laiko, įrenginio, vartotojo ir objekto. Išsaugokite laišką su headers, attachment ar failo hash, endpoint timeline, DNS, proxy, firewall bei NTLM įvykius ir vėlesnę identity veiklą. Įtartiną objektą laikykite quarantine pagal įrodymų procedūrą. Neatidarinėkite jo analitiko workstation'e vien tam, kad "patvirtintumėte alert'ą".

Scope klausimai:

1. Kas dar gavo arba pasiekė tą patį objektą?
2. Kokie kiti įrenginiai jungėsi į tą patį destination ar susijusią infrastruktūrą?
3. Kokios user, computer ir privileged identities tuo metu buvo aktyvios?
4. Ar po bandymo matome password guessing, relay primenančią prieigą, naują prisijungimą, mailbox pakeitimą ar lateral movement?

Password reset gali būti reikalingas, bet jis turi atitikti įrodymus. Jei įtariamas cloud session abuse, revoke'inkite sessions ir naudokite identity provider token-theft playbook. Jei turite tik užblokuotą network attempt, taip ir parašykite. Per ankstyvas "account compromised" blogina tyrimo kokybę lygiai taip pat kaip rizikos ignoravimas.

### Patikrinkite aprėptį nerinkdami autentifikavimo medžiagos

Saugiam kontrolės testui nereikia credential receiver ar tikro coercion artefakto.

1. Patikrinkite effective firewall ir SMB client policy skirtingose Windows versijose, device grupėse, VPN būsenose, IPv4 bei IPv6 keliuose.
2. Naudokite valdomą test destination, kuris registruoja DNS ir TCP connection attempt, bet nutraukia ryšį prieš SMB session setup. Patikrinkite, ar endpoint, firewall, proxy, SIEM ir case management įrašai sutaria dėl laiko bei įrenginio.
3. Per analytic paleiskite sintetinius `DeviceNetworkEvents`, NTLM Operational ir file-origin event'us. Taip patikrinama correlation bei severity, bet nerenkama tikro vartotojo autentifikavimo medžiaga.
4. Atskirai patikrinkite leidžiamus external SMB ir WebDAV workflow. Saugi politika gali sukelti veiklos sutrikimą, jei teisėta priklausomybė nebuvo inventorizuota.
5. Įvertinkite, ką po testo gali įrodyti SOC. Komanda turi atskirti blocked connection, protocol negotiation ir NTLM authentication nežiūrėdama credential response turinio.
6. Testą kartokite po VPN, endpoint firewall, authentication policy arba EDR schemos pakeitimo.

Niekada nejunkite valdomo workstation prie authentication capture paslaugos vien tam, kad parodytumėte kontrolės veikimą. Testas, kuris tyčia priima darbuotojo challenge-response medžiagą, pats sukuria ekspoziciją, nuo kurios turėtų saugoti.

### Užbaikite incidentą kontrolės patikrinimu

Po containment neužtenka uždaryti alert'ą ir palikti vieną IOC blocklist'e. Patikrinkite, kodėl objektas pasiekė vartotoją, kuri kontrolė pirmoji jį sustabdė ir kuri telemetrija būtų dingusi, jei laptop'as tuo metu būtų buvęs už įmonės tinklo. Pakartotinai peržiūrėkite panašių žinučių gavėjus, endpoint policy status, firewall išimtis ir NTLM audito aprėptį. Jei tyrimas atskleidė teisėtą legacy priklausomybę, sukurkite jos migracijos owner'į bei terminą, o ne nuolatinę plačią išimtį.

Incidento įraše atskirkite prevention, detection ir response rezultatus. Pavyzdžiui: firewall sustabdė SMB, EDR susiejo ryšį su iš el. pašto gautu objektu, tačiau WebDAV ir roaming device aprėptis dar nepatvirtinta. Toks sakinys duoda komandai konkretų backlog. Vien "blocked, no impact" jo neduoda.

## Threat context nėra attribution įrodymas

Vieši šaltiniai T1187 sieja su skirtingais actor'iais ir pažeidžiamumais. APT Notes [APT28 dossier](https://apt.hecavex.com/actors/apt28/) išsaugo Microsoft attribution bei CVE-2023-23397 naudojimo kontekstą, o [Forced Authentication technikos įrašas](https://apt.hecavex.com/techniques/forced-authentication/) aiškiai parodo ATT&CK ryšį.

Tai nėra attribution shortcut'as. T1187 aptikimas jūsų aplinkoje nereiškia APT28. Techniką gali naudoti daug actor'ių, ją gali atkartoti security įrankis, o panašų network signalą gali sukurti klaidinga konfigūracija. HECAVEX [confidence metodika](/lt/tyrimai/pasitikejimas-yra-laukas/) leidžia pažymėti technikos stebėjimą high confidence, bet palikti actor claim'ą unsupported.

## Minimalus veikiančios kontrolės standartas

Organizacija yra geresnėje padėtyje, jei gali atsakyti "taip":

- ar outbound SMB iš valdomų endpoint'ų blokuojamas arba siaurai allowlist'inamas ir log'inamas?
- ar external WebDAV išjungtas, apribotas arba matomas?
- ar NTLM naudojimas inventorizuotas audito duomenimis?
- ar SOC gali nuo destination grįžti iki proceso ir pirminio objekto?
- ar privileged identity atskirta nuo kasdienio browsing ir messaging?
- ar password, session ir token containment procesai išbandyti?
- ar išimtys turi owner'į, galiojimo terminą ir įrodytą poreikį?

Tikslas nėra dashboard'as su užrašu "T1187 coverage 100%". Tikslas – užblokuoti dažniausią kelią, aptikti likutį, išsaugoti teisingus įrodymus ir neapsimesti, kad vienas event'as pasako visą istoriją.

## Oficialūs ir pirminiai šaltiniai

- [MITRE ATT&CK: Forced Authentication, T1187](https://attack.mitre.org/techniques/T1187/)
- [Microsoft Open Specifications: NTLM message syntax, MS-NLMP](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-nlmp/907f519d-6217-45b1-b421-dca10fc8af0d)
- [Microsoft Open Specifications: SMB2 SESSION_SETUP](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-smb2/c9efe8ca-ff34-44d0-bfbe-58a9b9db50d4)
- [Microsoft Learn: NTLM overview in Windows Server](https://learn.microsoft.com/en-us/windows-server/security/kerberos/ntlm-overview)
- [Microsoft Learn: Windows event auditing for Defender for Identity](https://learn.microsoft.com/en-us/defender-for-identity/deploy/configure-windows-event-collection)
- [Microsoft Learn: outgoing NTLM traffic restriction](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/jj852213%28v%3Dws.11%29)
- [Microsoft Learn: NTLM blocking for SMB](https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-ntlm-blocking)
- [Microsoft Learn: SMB signing](https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-signing)
- [Microsoft Learn: Extended Protection for Windows authentication in IIS](https://learn.microsoft.com/en-gb/iis/configuration/system.webserver/security/authentication/windowsauthentication/extendedprotection/)
- [Microsoft Security: CVE-2023-23397 tyrimo rekomendacijos](https://www.microsoft.com/en-us/security/blog/2023/03/24/guidance-for-investigating-attacks-using-cve-2023-23397/)
- [Microsoft Security Response Center: CVE-2023-23397](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2023-23397)
- [CISA ir partneriai: Russian GRU targeting Western logistics entities and technology companies, AA25-141A](https://www.cisa.gov/news-events/cybersecurity-advisories/aa25-141a)

_Vertinimo data: 2026 m. rugpjūčio 31 d. Dokumentuotai Windows elgsenai ir bendroms kontrolėms taikomas high confidence. Konkrečios organizacijos detectability priklauso nuo endpoint, network bei identity telemetrijos aprėpties._
