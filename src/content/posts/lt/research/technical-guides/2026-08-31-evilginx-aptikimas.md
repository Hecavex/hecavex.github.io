---
title: "Evilginx aptikimas: reverse-proxy phishing ir pavogtų sesijų požymiai"
card_title: "Evilginx aptikimas identity aplinkoje"
description: "Gynybinis Evilginx ir reverse-proxy phishing vadovas apie domenų, HTTP, prisijungimų bei token telemetriją, session containment ir phishing atsparią MFA."
seo_title: "Evilginx aptikimas: reverse-proxy phishing požymiai"
seo_description: "Kaip aptikti Evilginx ir reverse-proxy phishing siejant domenų, HTTP, sign-in bei session telemetriją ir suvaldyti galimą token vagystę."
seo_keywords:
  - "Evilginx aptikimas"
  - "reverse proxy phishing"
  - "AiTM phishing požymiai"
  - "session cookie vagystė"
  - "MFA bypass phishing"
  - "token theft incidentas"
date: 2026-08-31 18:20:00 +0300
lang: lt
translation_key: evilginx-detection
permalink: /lt/tyrimai/evilginx-aptikimas/
author: deividas-lis
content_type: technical-guide
publication_class: technical-assessment
confidence: high
tlp: clear
categories: [threat-intelligence, identity-security, social-engineering]
tags: [Evilginx, AiTM, reverse proxy, phishing, session theft, MFA, identity security, detection engineering, incident response]
featured: false
draft: false
published: true
toc: true
comments: false
prose_width: wide
scope: "Evilginx siejamo ir nuo konkretaus įrankio nepriklausomo reverse-proxy phishing aptikimas bei incidento valdymas, naudojant laiško, web, domeno, sertifikato, autentifikavimo ir post-access telemetriją."
limitations: "Nėra diegimo, phishlet, lure, credential collection ar operacinės proxy konfigūracijos. Vieši infrastruktūros požymiai yra kintantys ir neunikalūs, o identity log'ų aprėptis priklauso nuo provider'io, licencijos, retention bei politikų."
methods:
  - "MITRE ATT&CK software ir technikų analizė"
  - "Microsoft threat-intelligence bei incident-response šaltinių analizė"
  - "Valstybinės phishing atsparios autentifikacijos guidance analizė"
  - "Kelių telemetrijos plokštumų įrodymų modeliavimas"
evidence_basis: "MITRE ATT&CK evilginx2 ir AiTM įrašai, Microsoft stebėtų Evilginx bei token-theft kampanijų analizė, Microsoft identity incidentų dokumentacija ir CISA autentifikavimo rekomendacijos."
key_findings:
  - "Reverse-proxy phishing gali rodyti aktualų teisėtos paslaugos turinį ir užbaigti tikrą MFA procesą, nors vartotojo naršyklė vis dar prisijungusi prie attacker valdomo hostname."
  - "Joks stabilus favicon, sertifikato issuer, response header ar hosting provider unikaliai neidentifikuoja Evilginx. Patikimas detection atsiranda susiejus lure, web ir identity įrodymus."
  - "Sėkmingas MFA event'as neįrodo, kad po jo sukurta sesija yra patikima. Reikia vertinti vėlesnį sign-in, token, mailbox, OAuth ir data-access kontekstą."
  - "Containment turi revoke'inti sessions ir tikrinti persistence, o ne tik pakeisti slaptažodį. Phishing atspari autentifikacija ir prie įrenginio pririšta prieiga mažina reusable-proxy kelią."
image:
  path: /assets/img/posts/2026-08-31-evilginx-detection/evilginx-detection-hero.svg
  social: /assets/img/social/evilginx-detection-lt.png
  thumbnail: /assets/img/posts/2026-08-31-evilginx-detection/evilginx-detection-hero.svg
  alt: "Reverse-proxy phishing įrodymų modelis, siejantis vartotoją, klaidinantį proxy ir teisėtą identity provider su lure, web, sign-in bei token telemetrija"
  width: 1600
  height: 900
---

## Prisijungimas gali būti tikras, nors naršyklė yra ne ten

Klasikinis phishing puslapis dažnai nukopijuoja prisijungimo formą ir išsiunčia įvestus duomenis į atskirą collection endpoint. Reverse-proxy phishing pakeičia tai, ką mato vartotojas ir defender'is. Tarp naršyklės bei tikro identity provider įterptas serveris persiunčia užklausas į abi puses. Prisijungimo ekranas gali būti aktualus, turėti tikrą organizacijos branding'ą ir normaliai reaguoti. Slaptažodį bei MFA iš tiesų gali priimti teisėta paslauga. Hostile dalis yra tarpinis hostname ir jo galimybė stebėti arba vėliau panaudoti autentifikuotos sesijos medžiagą.

[MITRE ATT&CK evilginx2 įrašas S9003](https://attack.mitre.org/software/S9003/) aprašo open-source adversary-in-the-middle framework'ą, kuris veikia kaip reverse proxy ir gali perimti credentials, authentication tokens bei session cookies. Pavadinimas svarbus threat context, tačiau gynybą reikia statyti elgsenos klasei. Kitas framework'as, private fork'as ar phishing-as-a-service platforma gali pasiekti tokį pat rezultatą.

Todėl šis vadovas neieško vieno stebuklingo header'io, kuris visada reiškia Evilginx. Jis atsako į tvaresnį klausimą: **kokie įrodymai rodo, kad autentifikavimo kelias buvo perduotas per klaidinantį origin ir kad po sėkmingo login'o sukurta identity sesija galėjo išeiti iš vartotojo kontrolės?**

<aside class="hx-callout warning"><strong>Gynybinė riba</strong>Čia nėra diegimo, phishlet sintaksės, lure kūrimo, credential interception, proxy konfigūracijos ar evasion instrukcijų. Netikrinkite įtartino puslapio pateikdami tikrus ar testinius prisijungimo duomenis. Saugokite įrodymus ir naudokite autorizuotas kontrolės priemones.</aside>

## Reverse proxy pakeičia „fake login page“ sąvoką

Supaprastintas AiTM phishing procesas atrodo taip:

1. lure nukreipia vartotoją į attacker valdomą hostname
2. tas serveris atidaro atskirą ryšį su teisėtu identity provider
3. užklausos ir atsakymai persiunčiami per dvi atskiras TLS sesijas
4. vartotojas per tarpininką atlieka tikrą provider'io autentifikaciją
5. po sėkmingo proceso teisėta paslauga išduoda session medžiagą
6. tarpininkas gali stebėti proxied flow pasiekiamus artefaktus, o attacker'is – bandyti juos replay'inti kitame kontekste.

[Microsoft 2022 m. analizė](https://www.microsoft.com/en-us/security/blog/2022/07/12/from-cookie-theft-to-bec-attackers-use-aitm-phishing-sites-as-entry-point-to-further-financial-fraud/) aprašė su Evilginx2 siejamas kampanijas, kurios taikėsi į daugiau kaip 10 000 organizacijų, ir vėlesnę mailbox prieigą bei payment fraud. Teisinga išvada nėra „MFA bevertė“. MFA sustabdo didelę dalį password-only atakų. Problema ta, kad bearer session, gauta _po_ sėkmingo MFA, tampa kitu autentifikavimo objektu.

HECAVEX straipsnyje [MFA nėra panacėja](/lt/tyrimai/mfa-nera-panaceja-ir-laikas-nustoti/) atskiriamas slaptažodis, MFA faktorius ir autentifikuota sesija. Šias tris vertybes saugo ne visiškai tos pačios kontrolės, o incidento metu negalima jų suplakti į bendrą „credentials“ žodį.

## Trys tiesos plokštumos

Reverse-proxy phishing retai turi vieną universalią signatūrą. Patikimas detection sujungia tris plokštumas, kurias turi pereiti kampanija.

| Plokštuma | Ką ji gali patvirtinti | Tipiniai įrodymai |
| --- | --- | --- |
| lure ir delivery | kaip taikinys buvo pasirinktas ir nukreiptas | message headers, sender, paslėpta nuoroda, attachment, QR kodas, click telemetrija, recipient ir delivery time |
| web ir infrastruktūra | kokį origin pasiekė naršyklė ir kaip jis elgėsi | exact URL, redirect chain, DNS, sertifikatas, hosting, HTTP response, page resources, proxy arba browser telemetrija |
| identity ir impact | ar autentifikavimas ir paskyros naudojimas nukrypo nuo vartotojo konteksto | sign-in bei risk log'ai, token ir session įvykiai, device claims, mailbox audit, OAuth grants, MFA pakeitimai, downloads, admin veiksmai |

Šis skirstymas saugo nuo overclaiming. Įtartinas domenas be recipient interaction yra infrastruktūros signalas. Successful sign-in po click'o yra stipriau, bet dar neįrodo token theft. Replay primenantis prisijungimas, po kurio sukuriama inbox rule ir trinami išsiųsti laiškai, jau yra gerokai aiškesnė incidento grandinė.

### Išsaugokite tikslų vartotojo kelią

Išsaugokite originalų laišką su pilnais headers ir exact URL privačioje evidence saugykloje. Užrašykite click bei autentifikavimo laiką, naršyklę, įrenginį, patvirtintus prompt'us, galutinį puslapį ir perspėjimus. Surinkite secure web gateway, email security ir endpoint click įrašus.

Recipient-specific URL nekelkite į atsitiktinius public scanner'ius. Query parametrai gali identifikuoti taikinį, o submission gali tapti viešu bei ilgaamžiu įrašu. HECAVEX [įtartinos SMS nuorodos vadove](/lt/tyrimai/kaip-saugiai-patikrinti-itartina-sms-nuoroda/) atskiriamas lookup nuo submission bei exact private original nuo defanged working copy. El. pašto nuorodai taikoma ta pati taisyklė.

## Domeno, sertifikato ir HTTP požymiai

Address bar lieka vienu svarbiausių signalų, nes proxy reikia savo pasiekiamo origin. Likęs puslapio turinys gali būti realiu laiku gaunamas iš teisėtos paslaugos.

### Domenas ir DNS

Ieškokite registruojamo domeno, kuris nepriklauso organizacijai, brand žodžio subdomain'e, vizualiai panašių simbolių, neseniai atsiradusio DNS, neįprastų nameserver'ių ir su imituojama paslauga nesusijusio hosting. Redirector ir final proxy gali naudoti skirtingus domenus ar provider'ius.

Nė vienas požymis nėra verdict. Naujas domenas gali priklausyti teisėtam projektui, o commodity cloud vienodai aptarnauja normalų ir abusive turinį. Lyginkite su identity ir application owner patvirtintais known-good hostname, ne su tuo, kaip „Microsoft login“ atrodo Google paieškoje.

Certificate Transparency ir passive DNS gali atskleisti gretimus vardus, bet pivoting turi likti pririštas prie įrodymo. [HECAVEX infrastruktūros pivoting vadovas](/lt/tyrimai/infrastrukturos-pivoting-101/) atskiria exact match, pagrįstą sąsają ir spekuliatyvų išplėtimą.

### TLS sertifikatas

Galiojantis HTTPS sertifikatas patvirtina, kad naršyklė priėmė sertifikatą tam hostname pagal savo trust taisykles. Jis nepatvirtina, kad hostname priklauso puslapyje rodomam brand'ui. Vertinkite certificate names, issuance time ir ryšį su DNS chronologija. Sertifikatas, išduotas prieš pat targeted delivery, gali sustiprinti timeline, bet issuer nėra Evilginx signature.

Certificate Transparency puikiai tinka discovery bei chronology ir blogai tinka automatiniam „malicious“ verdict. Tą pačią candidate-versus-verdict ribą taiko [HECAVEX Radar metodologija](https://radar.hecavex.com/lt/metodologija/).

### HTTP ir puslapio elgsena

Keli vertingi, bet neunikalūs clues:

- puslapis rodo aktualų tenant branding, nors browser lieka nepatvirtintame origin
- response ar scripts jungia kelis teisėtus authentication origin su vienu nepatvirtintu hostname
- cookie, redirect, `Origin` arba `Referer` elgsena neatitinka žinomo organizacijos login kelio
- paprastas request gauna benign puslapį ar denial, o recipient-specific URL rodo kitą flow
- turinys priklauso nuo tikslaus path ar query token ir neatsidaro iš bare domain
- scanner'is, kitas regionas ar neįprastas User-Agent gauna kitą turinį
- po autentifikavimo vartotojas nukreipiamas į tikrą dokumentą arba neutralią svetainę, todėl ankstesnis etapas atrodo kaip paprastas glitch.

Tokie požymiai pasitaiko ir teisėtoje federation, application proxy, WAF, CDN ar marketing redirect infrastruktūroje. Lyginkite su patvirtinta architektūra. Iš vieno favicon ar header neidentifikuokite framework'o.

## Identity telemetrija parodo, ar signalas tapo incidentu

Vertingiausi įrodymai dažnai atsiranda tada, kai phishing puslapis jau išjungtas. Microsoft [token theft playbook](https://learn.microsoft.com/en-us/security/operations/token-theft-playbook) rekomenduoja Entra sign-in ir audit log'us, Office activity bei risk detections. Juos saugokite greitai, nes retention priklauso nuo workload ir licencijos.

### Authentication ir session signalai

Su vartotojo nurodytu click bei login laiku koreliuokite:

- sėkmingą sign-in iš vartotojo konteksto, po kurio greitai atsiranda prieiga iš kito IP, device ar User-Agent
- unfamiliar sign-in properties, anonymous infrastructure arba device claim, neatitinkantį managed endpoint
- non-interactive veiklą ar token panaudojimą be tikėtino ankstesnio device ir interactive-auth konteksto
- risk lygio, session property arba Conditional Access rezultato pokytį
- kitos application prieigą ta pačia identity netrukus po lure.

Impossible travel gali padėti, bet nėra būtina ar pakankama sąlyga. VPN, mobile network ir global proxy kuria teisėtus location pokyčius. Attacker'is taip pat gali naudoti geografiškai artimą infrastruktūrą. Device identity, token properties, applications seka ir follow-on action dažnai vertingesni nei vien atstumas.

### Post-access signalai

Microsoft AiTM ir BEC tyrimuose kartojasi mailbox search, inbox ar forwarding rule, sent-message deletion, vidinis phishing, OAuth pakeitimai ir finansinių pokalbių reconnaissance. Taip pat tikrinkite:

- naujus authentication methods, devices arba recovery details
- neįprastus consent grants, service principals ir app permissions
- mailbox delegates, transport bei inbox rules
- masinius ar netipinius SharePoint, OneDrive bei email veiksmus
- administrator role ir Conditional Access pakeitimus
- trusted kontaktams išsiųstus ir po to ištrintus laiškus
- invoice ar payment thread access bei pakeistus mokėjimo duomenis.

Vieno požymio nebuvimas account'o neišteisina. Attacker'is gali sesiją panaudoti trumpai, parduoti, palaukti arba pasirinkti kitą application.

## Detection modelis, kuris išgyvena framework update

Vietoj vieno trapaus Evilginx IOC sąrašo naudokite koreliacijas:

```text
Delivery grandinė:
  vartotojui pristatoma nauja ar įtartina nuoroda
  tada browser pasiekia nepatvirtintą authentication origin
  tada identity provider užregistruoja sėkmingą autentifikavimą

Session grandinė:
  autentifikavimas siejamas su vartotojo device ir laiku
  tada sesija panaudojama iš reikšmingai kito konteksto
  tada pasiekiamas jautrus app, mailbox, OAuth arba data veiksmas

Infrastruktūros grandinė:
  deceptive hostname ar certificate atsiranda prieš delivery
  ir rodo login flow arba target-gated redirect elgseną
  ir yra matomas recipient ar gateway telemetrijoje
```

Vertinkite bendrą grandinę. Certificate age ar vienas HTTP header neturi būti mandatory. Alert'e išsaugokite, kodėl kiekvienas signalas prisidėjo, kad analitikas galėtų jį paaiškinti ir saugiai tune'inti teisėtus identity proxies.

## Kontrolės, kurios keičia rezultatą

### Phishing atspari autentifikacija

CISA rekomenduoja phishing-resistant MFA ir FIDO/WebAuthn nurodo kaip plačiai prieinamą phishing atsparų metodą. Microsoft Entra [authentication strengths](https://learn.microsoft.com/en-us/entra/identity/authentication/concept-authentication-strengths) leidžia jautriems resursams reikalauti FIDO2 security key, Windows Hello for Business ar multifactor certificate-based authentication.

Svarbi savybė yra origin binding: authenticator ceremony pririšama prie teisėto origin, o vartotojui neduodamas per tarpininką perrašomas kodas. Pradėkite nuo administratorių ir high-risk user'ių, tada plėskite pagal device bei recovery pasirengimą. Break-glass account'ai turi būti griežtai valdomi ir stebimi.

### Device ir session kontrolės

Kur palaikoma, jautriai prieigai reikalaukite managed arba compliant device, naudokite risk-based Conditional Access ir įvertinkite token protection ar binding. Tai sluoksniai su konkrečia coverage, o ne marketingo checkbox'ai. Reikia patikrinti klientus, legacy protokolus ir recovery flow.

Jautriems veiksmams reikalaukite fresh phishing-resistant authentication, ribokite persistentiškas sesijas, stebėkite MFA method, OAuth grant ir device pokyčius. Legacy authentication, negalinti tenkinti modernių kontrolės priemonių, turi būti išjungta arba aiškiai izoliuota.

### Delivery ir web kontrolės

Inbound nuorodas galima detonuoti ar rewrite'inti patvirtintomis security paslaugomis, bet originalus evidence turi likti. Authentication-shaped puslapius ant naujų ar uncategorised domenų kelkite aukščiau. Vartotojams aiškinkite, kad address bar, password manager origin match ir security-key prompt yra stipresni signalai už logotipą. Reporting kelias turi vienu veiksmu perduoti originalų laišką defender'iui, ne liepti žmogui pačiam „patikrinti, ar virusas“.

## Containment ir įrodymų išsaugojimas

Jei vartotojas autentifikavosi per įtariamą reverse proxy, kol neįrodyta kitaip laikykite, kad slaptažodis ir session medžiaga galėjo būti eksponuoti.

1. **Išsaugokite prieš retention pabaigą.** Eksportuokite sign-in, audit, mailbox, OAuth, endpoint, email ir secure-web log'us.
2. **Pagal riziką blokuokite ar ribokite account'ą.** Neleiskite adversary tęsti veiklos, kol renkama evidence.
3. **Revoke'inkite sessions ir refresh tokens.** Password change savaime neuždaro kiekvienos autentifikuotos sesijos.
4. **Keiskite credentials per trusted device ir channel.** Patikrinkite recovery bei MFA methods, pašalinkite neautorizuotas registracijas.
5. **Tirkite persistence ir impact.** Peržiūrėkite mailbox rules, delegates, OAuth grants, devices, apps, administracinius pakeitimus, failus ir laiškus.
6. **Nustatykite kampanijos scope.** Ieškokite lure, sender, URL dalių, domeno ir click activity per visus recipient'us. Pivot'inkite tik ten, kur leidžia įrodymai.
7. **Confidence fiksuokite atskirai.** Skirkite attempted visit, credential submission, successful MFA, possible session exposure, confirmed replay ir confirmed impact.

Neprašykite vartotojo dar kartą atverti puslapio. Nepateikite credential bandydami patvirtinti proxy. Nesitikėkite, kad domenas liks gyvas. Recipient ir identity-provider telemetrija paprastai išlieka vertingesnė už vėlesnį public scan.

## Threat context be attribution pagal įrankį

APT Notes [Evilginx įrašas](https://apt.hecavex.com/tools/evilginx/) sieja software su source-backed procedūromis. [Star Blizzard](https://apt.hecavex.com/actors/star-blizzard/) ir [Void Blizzard](https://apt.hecavex.com/actors/void-blizzard/) dossier dokumentuoja viešai aprašytą naudojimą prieš Europos, NATO bei Ukrainos tematikos taikinius. Atskiras [Adversary-in-the-Middle technikos įrašas](https://apt.hecavex.com/techniques/adversary-in-the-middle/) saugo elgseną nesuplakdamas jos su actor identity.

Evilginx primenanti elgsena nepriskiria incidento nė vienam actor'iui. Open-source tools, bendros paslaugos ir nukopijuotas tradecraft nėra unikalūs fingerprint'ai. Attribution reikia victimology, chronology, infrastructure, operational behaviour ir source-specific reporting, kuris atlaiko alternatyvas.

## Oficialūs ir pirminiai šaltiniai

- [MITRE ATT&CK: evilginx2, S9003](https://attack.mitre.org/software/S9003/)
- [MITRE ATT&CK: Adversary-in-the-Middle, T1557](https://attack.mitre.org/techniques/T1557/)
- [Microsoft Security: From cookie theft to BEC](https://www.microsoft.com/en-us/security/blog/2022/07/12/from-cookie-theft-to-bec-attackers-use-aitm-phishing-sites-as-entry-point-to-further-financial-fraud/)
- [Microsoft Security: Detecting and mitigating a multi-stage AiTM phishing and BEC campaign](https://www.microsoft.com/en-us/security/blog/2023/06/08/detecting-and-mitigating-a-multi-stage-aitm-phishing-and-bec-campaign/)
- [Microsoft Security: Token tactics](https://www.microsoft.com/en-us/security/blog/2022/11/16/token-tactics-how-to-prevent-detect-and-respond-to-cloud-token-theft/)
- [Microsoft Learn: Token theft playbook](https://learn.microsoft.com/en-us/security/operations/token-theft-playbook)
- [Microsoft Learn: Conditional Access authentication strengths](https://learn.microsoft.com/en-us/entra/identity/authentication/concept-authentication-strengths)
- [CISA: More than a Password](https://www.cisa.gov/ncas/tips/st05-012)

_Vertinimo data: 2026 m. rugpjūčio 31 d. Reverse-proxy session-theft modeliui ir cituotoms kontrolėms taikomas high confidence. Framework identifikavimas ar account compromise išvada lieka konkretaus incidento teiginys, kuriam reikia koreliuotų įrodymų._
