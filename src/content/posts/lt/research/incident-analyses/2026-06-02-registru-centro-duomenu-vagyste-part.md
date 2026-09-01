---
title: "Registrų centro duomenų vagystė — Part 2"
description: "Antroji Registrų centro duomenų vagystės analizės dalis apie pavogtos tapatybės, teisėtų prieigų ir aptikimo spragų reikšmę."
seo_title: "Registrų centro duomenų vagystė: tapatybės rizika"
seo_keywords:
  - "Registrų centro duomenų vagystė"
  - "Registrų centro duomenų nutekėjimas"
  - "tapatybės vagystės rizika"
  - "teisėtų prieigų piktnaudžiavimas"
  - "asmens duomenų saugumo pažeidimas"
date: 2026-06-02T07:23:26.412Z
lang: lt
translation_key: substack-registru-centro-duomenu-vagyste-part
permalink: /lt/tyrimai/registru-centro-duomenu-vagyste-part/
redirect_from:
  - /lt/research/registru-centro-duomenu-vagyste-part/
author: deividas-lis
content_type: incident-analysis
confidence: moderate
tlp: clear
categories: ["data-breaches", "identity-security"]
tags: ["Registrų centras", "duomenų vagystė", "tapatybės saugumas", "incidentų analizė"]
featured: false
scope: "Galimos prieigos grandinės ir pavogto darbuotojo skaitmeninio identiteto poveikio analizė pagal viešą informaciją."
limitations: "Pilni incidento techniniai duomenys nėra vieši, todėl dalis scenarijų yra analitinės hipotezės, o ne patvirtinti faktai."
key_findings:
  - "Pavogta tapatybė gali paversti neteisėtą veiklą išoriškai teisėtu naudojimu."
  - "Vien antivirusinės kontrolės nepakanka be elgsenos ir masinių užklausų stebėsenos."
  - "Incidento vertinimui būtina analizuoti naudotojo, sesijos, įrenginio ir duomenų veiksmus kartu."
series_key: centre-of-registers-data-theft
series_part: 2
image:
  path: /assets/img/posts/substack/registru-centro-duomenu-vagyste-part/01.webp
  alt: "Registrų centro duomenų vagystė — Part 2"
  thumbnail: /assets/img/posts/substack/registru-centro-duomenu-vagyste-part/01-card.webp
  width: 1280
  height: 719
source_url: https://deivlis.substack.com/p/registru-centro-duomenu-vagyste-part
---
![Registrų centro incidento analizės skydelis su pastato, duomenų ir įsilaužimo rodikliais.](/assets/img/posts/substack/registru-centro-duomenu-vagyste-part/01.webp)

## **Recap iš pirmojo blogo**

*Praeitame bloge rašiau, kad Registrų centro incidentas neturėtų būti vertinamas kaip eilinis "duomenų nutekėjimas". Kalbame apie daugiau nei 600 tūkst. galimai nukopijuotų Nekilnojamojo turto ir Juridinių asmenų registro įrašų, kurie gali būti naudingi ne tik sukčiams, bet ir žvalgybiniam kontekstui, socialinei inžinerijai bei hibridinėms operacijoms. Svarbiausia mintis buvo labai paprasta aka moderni ataka dažnai atrodo ne kaip "nulaužta sistema", o kaip teisėtas naudotojas, darantis labai neteisėtus dalykus.*

[Pirmoje dalyje pateiktas nacionalinio saugumo ir žvalgybos kontekstas](/lt/tyrimai/registru-centro-duomenu-vagyste-kai/). Šio scenarijaus identity sluoksnį papildo [MFA analizė, aiškinanti, kodėl pavogta sesija ar token gali apeiti pakartotinį prisijungimo patikrinimą](/lt/tyrimai/mfa-nera-panaceja-ir-laikas-nustoti/).

---

## **Šiai dienai naujausia žinoma informacija**

Per paskutines dienas atsirado kelios labai svarbios detalės, kurios incidentą mano manymu padaro gerokai rimtesnį nei pradžioje atrodė (*my bad.. šiaip rašau viską 2026-05-26 vakare po darbų, tai tikėtina informacija kažkuo pasipldys dar per ateinančias dienas*).

Viešai jau patvirtinta, kad šimtai tūkstančių **Registrų centro duomenų buvo pavogti pasinaudojant Migracijos departamento paskyromis**. Lietuvos kriminalinės policijos biuro vadovas Arūnas Maskoliūnas žurnalistams tiesiogiai patvirtino, kad informacija apie Migracijos departamento paskyras yra teisinga. (**<https://www.lrytas.lt/lietuvosdiena/aktualijos/2026/05/26/news/po-skandalo-registru-centre-teisesaugos-zinia-del-migracijos-departamento-42580533>**, **<https://www.15min.lt/naujiena/aktualu/skandalas-registru-centre-nelegaliai-nusiurbti-daugiau-nei-600-tukst-duomenu-55-2689370>**)

Šioje vietoje.. atsiranda labai svarbus dalykas, kad preliminariai visa istorija jau atrodo ne kaip daug kas soc. medijoje (dažniausiai Facebook, nes ten nu labai daug susirenka žmonių suprantančių IT saugumą ir t.t.) rėkė, kad "nulaužė Registrų centrą", o labiau pereinama į "kažkas gavo teisėtą prieigą ir pradėjo elgtis labai neteisėtai".

Ir čia prasideda jau nemaloniausia kibernetinio saugumo dalis, nes šiuolaikinės atakos dažnai (sakyčiau per daug dažnai) atrodo labai.. normaliai (pažiūrint per RC prizmę, ar MD), kaip pvz.:

- Prisijungimas prie Outlook.
- SharePoint failų atidarymas.
- Registro išrašų formavimas.
- Prisijungimai per Microsoft365.
- Įprasti HTTPs srautai..

*(Darau prezumpciją, kad būtent naudojamas Outlook, SharePoint, M365...)*

Iš SIEM pusės atrodo normali darbo diena, tik vienas mažas skirtumas.. už paskyros sėdi ne tas žmogus, kuris turėtų.

Ir būtent todėl... tokios operacijos (ypač žvalgybinės informacijos rinkimas) tampa labai sunkiai pastebimos.

![Analitikas vertina galimas pradinės prieigos hipotezes ir jų įrodymus.](/assets/img/posts/substack/registru-centro-duomenu-vagyste-part/02.webp)

Dar viena sakyčiau svarbi detalė, kad jau dabar aišku, kad apie incidentą valstybės institucijos žinojo gerokai ankščiau nei visuomenė. Premjerės aplinka patvirtino, kad informacija apie duomenų vagystę buvo žinoma balandžio pradžioje, tačiau neviešinta dėl vykusio tyrimo.. *(pagal viską tai tyrimas ir dabar vyksta.. bet anyway.. geriau direktorių nušalint, o pačiai neprisiimt kaltės dėl šio kritinio incidento ir tylėjimo.. čia jau paliksiu žurnalistams šitą vietą, neturiu kompetencijos užtektinai, kad komentuočiau šiuos įvykius iš tos pusės, bet tikiuosi*  *ir*  *jau kažką daro..)*

Grįžtant atagal.. tai reiškia, kad tyrimas tikėtina jau kurį laiką analizuoja kompromituotų paskyrų grandinę, prisijungimų kilmę, naudojamus prieigos metodus, duomenų rinkimo mastą ir galimą platesnį infrastruktūros kompromitavimą *(.. kaip norėčiau gaut kelis IOCs bent infrastruktūrą paanalizuot, bet tikėtina šitie dalykai viešumos nepamatys.. nors realiai jau reikalo jų slėpt nėra, tyrimui nepakenks).*

Ir čia jau atsiranda smagesnis CTI aspektas.. Asmeniškai monitorinant rusakalbius forumus, Telegram kanalus, dark web marketplace’us (pavadinkim lai taip) ir Discord kanalus.. praktiškai nesimato aktyvaus RC duomenų dump’ų reklamavimo ar pardavinėjimo, kas yra gan neįprasta.

Jei tai būtų klasikinė "financial motivated" duomenų vagystė, tai labaiii tikėtina, jau matytumėm:

- "database for sale" postus.
- sample dump’us
- prieigų aukcijonus.
- initial access brokerių bandymus perparduot priegas.
- "exclusive access" pasiūlymus
- ir Telegram kanalus su "Lithuania DB leak" hype.

*(aišku nesakau, kad visus forumus, visus Telegram, Discord kanalus žinau ir visus stebiu, bet pagrindiniuose tylu)*

Paprasti cybercriminal’ai (pavadinkim juos taip, script kiddies ar wannabeHacker nevadinsiu, bus lengviau suprantama) labai mėgsta pinigus, ir labai mėgsta kai apie juos garsiai kalba (paimkim ShinyHunters.. oj tie velniai mėgsta, kai apie juos kalba).

APT grupės dažniau renkasi tyliai rinkti informaciją, išlaikyt prieigą, veikti ilgą laiką, nesukelt triukšmo, naudoti duomenis vėliau (kas jau matoma iš viešų duomenų.. jog galimai viskas vyko nuo Sausio/Vasario mėn.). Tai dar nėra įrodymas, kad čia jau veikė valstybės ramiama operacija, bet tai sakyčiau yra labai įdomus indikatorius į tą pusę

![Tyrėjas lygina paskyros, įrenginio ir tinklo telemetriją keliuose ekranuose.](/assets/img/posts/substack/registru-centro-duomenu-vagyste-part/03.webp)

---

## **Preliminarūs duomenų nutekėjimo scenarijai**

Pagal jau turimą informaciją (2026-05-26 dienos), vienas realistiškiausių scenarijų atrodo kompromituotos institucijos arba third-party paskyros (na šitas jau patvirtintas galimai).

Čia jau ne Holivudo filmas kur hackeris sėdi ir "Im in", nereikia "zero day", nereikia "super duper malware" ar tebunie palydovo nulaužimo.. šiuo atvėju užtenka vieno žmogus.

Vienas iš **galimų scenarijų** ką sugalvoju atrodo taip (na čia toks klasikinis labiau), kad darbuotojas gauna **phishing** laišką (valstybinėse įdomu ar kas vykdo phishing mokymus.. ar ne, žinant apie seimą tai tikrai ne). Laiškas pats tikėtina atrodo taip:

- Microsoft.
- VPN.
- Institucijos sitema.
- Teams kvietimas.
- SharePoint dokumentas.
- "saugumo atnaujinimas".

Na žmogelis nemokytas, paspaudžia nuorodą -> suveda prisijungimus -> galbūt patvirtina MFA/2FA (ar dar kokį velnią) -> perduoda duomenis.

Čia gal toks .. sakyčiau organizacijoms dalykas.. ir supratimas, kad turint MFA tai dar nereiškia, kad "esame saugūs"

![Prisijungimo bei vartotojo elgsenos duomenys nagrinėjami ieškant pavogtos tapatybės požymių.](/assets/img/posts/substack/registru-centro-duomenu-vagyste-part/04.webp)

**Kitas scenarijus yra infostealeriai.** Čia jau yra truputi rimtesnė problema, nes jie yra vienas iš svarbiausių ekosistemos dalių pavadinkim "underground’e" *(nesakysiu per daug čia, bet patikrinau kiek galimai valstybinių institucijų turi nuleakintus prisijungimų duomenis, sesijas hijackintas.. tai daug).*

**Apie infostealerius jei trumpai tai jie vagia:**

- Slaptažodžius.
- Browser cookies.
- VPN credentials.
- M365 tokenus.
- Aktyvias sesija.
- Autentifikacijos artefaktus.

Na ir tada užpuolikas (ar tas kas nusiperka) gaune ne patį "nulaužimą", o visą pavadinkim tai darbuotojo "skaitmeninį identitetą", o ką tai reiškia?

- Outlook atrodo teisėtas.
- SharePoint atrodo teisėtas.
- OneDrive atrodo teisėtas.
- Teams atrodo teisėtas.

Ką sistema mato.. tai "login successful", bet nesupranta kas prisijungė.. ar Zosė ten iš finansų ar Saša iš Maskvos.

Kartais blogiausia ataka atrodo kaip normalus darbuotojas, nebent Zosė yra labai pavyzdinga darbuotoja ir keliasi 3 val. nakties, kad pasidomėtų šimtais tūkstančių registro išrašų (nes nu darbo tai daug), arba Zosė nori tapt MVP ketvirčio.

![Tapatybės ir prieigos ekosistemos skydelis rodo paskyrų, sesijų ir kontrolės ryšius.](/assets/img/posts/substack/registru-centro-duomenu-vagyste-part/05.webp)

Dar vienas įdomesnis scenarijus tai yra **sesijų hijackinimas**.

Čia jau MFA/2FA ir kiti briedai nepadeda.

Jei hackeriai pavagia:

- session cookies.
- OAuth tokenus.
- Aktyvias M365 sesijas.

Daugumoje atvėjų jis gali naudotis sistema kaip teisėtas naudotojas t.y. be slaptažodžio, be papildomo login prompt’o, be "I’m in" filmų momento.

Pažiūrėjus į M365 aplinką ir gavus Outlook arba SharePoint priegą galima:

- Skaityt laiškus.
- Rinkt dokumentus.
- Stebėt komunikaciją.
- Matyt kontaktus.
- Ieškot prisijungimų instrukcijų.
- Ieškot sistemų nuorodų.
- Ir naudot organizacijos pasitikėjimą prieš ją pačią.

![Sesijos užgrobimo aptikimo skydelis išryškina neįprastą autentifikuotą veiklą.](/assets/img/posts/substack/registru-centro-duomenu-vagyste-part/06.webp)

**Toliau jau labai svarbus scenarijus – "low and slow".**

Jei duomenys buvo traukiami:

- Mažais kiekiais.
- Palaipsniui.
- Normaliomis darbo valandomis.
- Naudojant teisėtas paskyras.
- Iš įprastų sistemų.

visa veikla jau atrodo kaip normali veikla, tada problema tampa ne "ar buvo antivirusinė?" (šitą pavogiau iš Facebook komentarų), o ar buvo stebima naudotojų elgsema, ar buvo matomos anomalijos, ar buvo matomas masinis registro išrašų formavimas, ar buvo stebimi Outlook / Sharepoint aktyvimai, ar sistema suprato, kad paskyra pradėjo elgtis kaip pavadinkim "duomenų siurblys".

![Plati incidento laiko juosta koreliuoja vartotojo, duomenų ir infrastruktūros įvykius.](/assets/img/posts/substack/registru-centro-duomenu-vagyste-part/07.webp)

---

## **Preliminarūs TTP pagal naujausią informaciją**

| Taktika | Technika | Vertinimas |
| --- | --- | --- |
| **Initial Access** | T1566 – Phishing | Galimos fiktyvios "Microsoft" ar institucijų prisijungimo nuorodos. |
| **Initial Access** | T1078 – Valid Accounts | Kompromituotos teisėtos paskyros. |
| **Credential Access** | T1555 – Credentials from Password Stores | Informacijos vagių kenkėjiškas kodas galėjo rinkti naršyklės prisijungimo duomenis ir prieigos raktus. |
| **Credential Access** | T1539 – Steal Web Session Cookie | Galimas "Microsoft 365" sesijų perėmimas. |
| **Defense Evasion** | T1550 – Use Alternate Authentication Material | Prieigos raktų, slapukų ir aktyvių sesijų naudojimas. |
| **Collection** | T1114 – Email Collection | "Outlook" ar "Exchange" laiškų rinkimas. |
| **Collection** | T1213 – Data from Information Repositories | "SharePoint", registrų ir kitų saugyklų duomenų rinkimas. |
| **Persistence** | T1098 – Account Manipulation | "OAuth" programos, laiškų persiuntimas, papildomos sesijos ir delegacijos. |
{: .hx-table-wide }

![MITRE ATT&CK aprėpties matrica parodo aptikimo spragas skirtingose taktikose.](/assets/img/posts/substack/registru-centro-duomenu-vagyste-part/08.webp)

---

## **Rusijos grupuočių TTP persipinimas**

Na čia jau atsiranda įdomesnis momentas.

Scenarijai labai smarkai persidengia su tuo ką apie Rusijos siejamas grupuotes viešai aprašo Microsoft, CISA ir kt.

Pasikartosiu dar kartą, Microsoft viešai aprašė, kad **Void Blizzard / Laundry Bear** aktyviai naudojo vogtus prisijungimus iš infostealer ekosistemų ir rinko didelius kiekius el. laiškų bei failų iš organizacijų Europoje ir Šiaurės Amerikoje.

**APT28 / Fancy Bear** kampanijose buvo naudojami:

- Spearphishing.
- Password spraying.
- Exchange mailbox permissions.
- EWS / IMAP duomenų rinkimas.
- Teisėtų paskyrų naudojimas.

**Secret Blizzard / Turla** scenarijuose matomi:

- AiTM phishing.
- Sesijų perėmimas.
- Tokenų rinkimas.
- Ilgalaikės tyliai palaikomos prieigos.

Svarbiausia čia manau paminėt, kad TTP sutapimas nėra atribucija (be didesnio konteksto, infrastuktūros, visos informacijos tyrimo.. nelabai atribuciją padarysi, bet galimi scenarijai yra..).

Bet kai:

- Matome galimas kompromituotas paskyras.
- Prieigas per institucijų sistemas.
- Microsoft 365 / Outlook logiką.
- Tylų elgesį cybercrime forumuose.
- ir jokio aktyvaus dump pardavinėjimo.

APT arba žvalgybinio pobūdžio scenarijus pradeda atrodyti daug realistiškiau nei klasikinė "greitai parduokim DB" istorija.

![Tapatybės atakos ekosistema jungia pradinę prieigą, sesiją, duomenis ir poveikį.](/assets/img/posts/substack/registru-centro-duomenu-vagyste-part/09.webp)
