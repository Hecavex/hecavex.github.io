---
title: "Certificate Transparency prekių ženklų stebėjimas be automatinių nuosprendžių"
card_title: "Prekių ženklų stebėjimas per Certificate Transparency"
description: "Praktinė sistema prekių ženklus primenantiems sertifikatų vardams stebėti: SAN analizė, IDN, paaiškinamos taisyklės, klaidingi sutapimai, enrichment ribos ir GitHub-only publikavimas."
seo_title: "Certificate Transparency prekių ženklų stebėjimo gidas"
seo_description: "Kaip stebėti phishing domenų kandidatus per CT logus: SAN, fuzzy ir affix taisyklės, Punycode, klaidingi sutapimai, enrichment ir GitHub Actions."
seo_keywords:
  - "Certificate Transparency prekių ženklų stebėjimas"
  - "CT log domenų stebėjimas"
  - "CertStream phishing aptikimas"
  - "prekės ženklą imituojantys domenai"
  - "Punycode phishing"
  - "GitHub Actions grėsmių žvalgyba"
date: 2026-08-31 18:35:00 +0300
lang: lt
translation_key: certificate-transparency-brand-monitoring
permalink: /lt/tyrimai/certificate-transparency-prekiu-zenklu-stebejimas/
author: deividas-lis
content_type: technical-guide
publication_class: technical-assessment
confidence: high
tlp: clear
categories: [threat-intelligence, osint, tradecraft]
tags: [Certificate Transparency, infrastructure pivoting, CTI, OSINT, phishing, RDAP, DNS, threat hunting]
featured: false
draft: false
published: true
toc: true
comments: false
prose_width: wide
scope: "Gynybinė ir paaiškinama sistema, kuri viešuose sertifikatų duomenyse randa stebimus prekių ženklus galinčius priminti DNS vardus ir GitHub aplinkoje publikuoja peržiūrimus kandidatus."
limitations: "Certificate Transparency neapima domenų be viešai užregistruoto sertifikato, neįrodo, kad vardas turi DNS atsaką ar svetainę, ir nenustato kenkėjiško ketinimo. GitHub Actions tvarkaraštis yra best-effort, todėl neužtikrina stebėjimo realiuoju laiku."
methods:
  - "Certificate Transparency ir IDNA standartų peržiūra"
  - "SAN normalizavimo ir heuristikų projektavimas"
  - "Klaidingų sutapimų ir įrodymų ribų modeliavimas"
  - "GitHub-only publikavimo architektūros peržiūra"
evidence_basis: "RFC 9162, RFC 5280, RFC 5890, Unicode saugumo rekomendacijos, Certificate Transparency projektas ir GitHub Actions dokumentacija, pritaikyti HECAVEX Radar gynybinio publikavimo modeliui."
key_findings:
  - "CT įrašas įrodo, kad sertifikatas ar precertificate su DNS vardu buvo pateiktas viešam logui, tačiau neįrodo veikiančios svetainės, phishing ar prekės ženklo nuosavybės."
  - "Naudingas stebėjimas prasideda nuo teisingo SAN išrinkimo ir IDN normalizavimo, tada taikomos paaiškinamos exact, affix, token ir fuzzy taisyklės pagal prižiūrimą prekės ženklo modelį."
  - "Sertifikato faktai, apskaičiuotas panašumas ir analitiko vertinimas turi likti atskiruose laukuose, kad kandidatą būtų galima patikrinti ir pataisyti."
  - "GitHub-only stebėjimas gali teikti vertingas periodines iškarpas, tačiau workflow vėlavimai, praleisti paleidimai ir būsenos saugojimas turi būti matomi, o ne pateikiami kaip nenutrūkstama aprėptis."
image:
  path: /assets/img/posts/2026-08-31-certificate-transparency-brand-monitoring/certificate-transparency-brand-monitoring-hero.svg
  social: /assets/img/social/certificate-transparency-brand-monitoring-lt.png
  alt: "Certificate Transparency srautas viešus logų įrašus paverčia išrinktais SAN vardais, paaiškinamais prekių ženklų sutapimais ir peržiūrimais GitHub įrašais"
  thumbnail: /assets/img/posts/2026-08-31-certificate-transparency-brand-monitoring/certificate-transparency-brand-monitoring-hero.svg
  width: 1600
  height: 900
---

## Sertifikatas yra stebėjimas, o ne kenkėjiškumo nuosprendis

Certificate Transparency (CT) leidžia aptikti DNS vardus anksčiau negu daugelis turiniu paremtų šaltinių. Tačiau jo reikšmę lengva išpūsti. Jeigu viešame loge atsiranda sertifikatas ar precertificate su `brand-support.example`, žinome, kad toks vardas buvo pateiktas su sertifikato medžiaga. Vien iš to nežinome, ar vardas turi DNS atsaką, ar svetainė buvo įdiegta, ar ji rinko prisijungimus, ar vardą valdo minimas prekės ženklas ir ar pareiškėjas turėjo kenkėjišką tikslą.

[RFC 9162](https://www.rfc-editor.org/rfc/rfc9162.html) CT apibrėžia kaip viešai audituojamų, append-only logų sistemą TLS sertifikatams. Logai priima ir registruoja įrašus. Monitoriai juos skaito. Naršyklės ir auditoriai gali tikrinti logų nuoseklumą. Taigi logas yra sertifikatų įrodymų šaltinis, ne phishing detektorius.

Šį skirtumą būtina išlaikyti visuose pipeline etapuose:

| Sluoksnis | Ką galima pagrįstai teigti | Ko nereikėtų teigti |
| --- | --- | --- |
| stebėta | loge tokiu laiku buvo įrašas su šiuo DNS vardu | domenas buvo registruotas log timestamp metu |
| apskaičiuota | normalizuotas vardas atitiko taisyklę `brand-affix-v2` | vardas yra impersonation domenas |
| papildyta | DNS ar RDAP užklausa tuo metu grąžino šias reikšmes | infrastruktūra priklauso konkrečiam operatoriui |
| įvertinta | analitikas su priežastimi pažymėjo kandidatą įtariamu, patvirtintu papildomu šaltiniu ar atmestu | CT įrodė phishing |

Toks įrodymų kontraktas yra [HECAVEX Radar](https://radar.hecavex.com/lt/) pagrindas: kiekviena eilutė yra užuomina, ne nuosprendis. Sistema tampa naudingesnė, kai paaiškina, kodėl kandidatas atsirado, ir mažiau naudinga, kai vienas nepermatomas balas apsimeta nustatantis ketinimą.

## Ką Certificate Transparency parodo

CT įraše gali būti sertifikatas ar precertificate, log timestamp ir sertifikato laukai, pateikti logui. Stebint prekių ženklus svarbiausia įvestis paprastai yra DNS vardai **Subject Alternative Name** plėtinyje. [RFC 5280 4.2.1.6 dalis](https://www.rfc-editor.org/rfc/rfc5280.html#section-4.2.1.6) apibrėžia hostų tapatybėms naudojamą `dNSName` formą.

Naudinga išsaugoti:

- logo tapatybę ir stabilų įrašo indeksą ar kitą nuorodą
- logo timestamp
- sertifikato fingerprint, kai prieinamas galutinis sertifikatas
- išdavusią sertifikavimo instituciją
- `notBefore` ir `notAfter` galiojimo laukus
- visus DNS SAN, ne vien certificate subject ar common name
- ar šaltinis yra precertificate, ar galutinis sertifikatas
- pirminio šaltinio nuorodą, kurios pakanka stebėjimui atkartoti.

Vienas įrašas gali turėti wildcard ir daug tarpusavyje nesusijusių SAN. Tas pats DNS vardas gali kartotis keliuose loguose ir kiekvieno sertifikato atnaujinimo metu. Monitorius turi išlaikyti provenance, bet publikavimo įrašus deduplikuoti. Viena žinutė nėra būtinai vienas domenas, o dešimt logo stebėjimų nėra dešimt kampanijų.

### Ko CT neparodo

CT nepateikia registranto, dabartinio DNS atsako, hosting account, puslapio, redirect grandinės, JavaScript, credential receiver, aukų skaičiaus ar operatoriaus tapatybės. Jis nenustato ir domeno registravimo datos. Sertifikato galiojimo datos nėra registracijos datos, o logo timestamp nėra pirmojo panaudojimo įrodymas.

Dalis veiklos į CT apskritai nepateks. Domenas gali neturėti TLS sertifikato, naudoti pasirinkto šaltinio dar nematytą sertifikatą, veikti per IP adresą, būti kompromituoto teisėto hosto dalis arba atsirasti tik redirect pabaigoje. Priešingai, loge esantis vardas gali niekada neturėti DNS atsako arba būti teisėta staging aplinka. Aprėptį reikia vadinti stebimu sertifikatų srautu, o ne „visais phishing domenais“.

## Logai, monitoriai ir CertStream nėra tas pats

[Certificate Transparency projektas](https://certificate.transparency.dev/howctworks/) atskiria append-only logus nuo monitorių ir auditorių. Logas registruoja pateiktą medžiagą. Monitorius stebi logus ir ieško rūpimų vardų ar sertifikatų. Toks srautas kaip CertStream suteikia patogią įvykių sąsają CT stebėjimams, tačiau nėra visas CT pasitikėjimo modelis ir neturėtų tapti vieninteliu atkuriamu šaltiniu.

Atspari sistema išsaugo tiek informacijos, kad spragą būtų galima replay ar backfill būdu užpildyti. Stream rinkimas mažina vėlavimą, o periodinė ribota užklausa gali atkurti praleistus įrašus. Jeigu stream nutrūko aštuonioms minutėms, teisinga būsena yra „collection gap“, kol backfill pavyks, o ne „nulis sutapimų“. Sveikatos telemetrijoje atskirai rodykite:

- planuotą workflow laiką ir faktinę pradžią
- prisijungimo prie šaltinio laiką ir planuotą klausymosi langą
- apdorotų žinučių, sertifikatų ir DNS vardų skaičių
- parse klaidas ir atmestus įrašus
- sukurtų kandidatų skaičių
- apimtą cursor ar checkpoint intervalą
- paskutinį sėkmingą publikavimą ir paskutinį duomenų pasikeitimą.

Nulinis rezultatas yra sveikas tik tada, kai numatyta įvestis tikrai apdorota. Workflow, kuris neprisijungė prie šaltinio, nėra „healthy empty“.

## Prieš lyginimą išrinkite kiekvieną SAN

Lyginant žalią event eilutę, tyliai praleidžiami vardai ir kuriami dublikatai. Kiekvieną sertifikatą laikykite konteineriu, išrinkite visus `dNSName` ir kiekvieną kandidatą normalizuokite deterministiškai.

Praktinė seka:

1. tiksliai išsaugoti originalų SAN
2. palyginimui pašalinti aplinkinį whitespace ir galinį root tašką
3. ASCII palyginimo formą paversti mažosiomis raidėmis, nes DNS vardai nėra jautrūs raidžių dydžiui
4. tik pradinį wildcard `*.` pašalinti į atskirą `wildcard` lauką
5. internacionalizuotus label konvertuoti į A-label ir Unicode rodymo formas
6. tikrinti label bei viso vardo ilgį, o netinkamą įvestį išlaikyti kaip atmestą stebėjimą
7. Public Suffix List palaikančia biblioteka nustatyti public suffix ir registruojamą domeną
8. pašalinti normalizuoto vardo dublikatus įraše ir tarp įrašų neprarandant šaltinio nuorodų.

Netrinkite visų skyrybos ženklų, nesujunkite visų brūkšneliais atskirtų dalių ir nesuplokite label prieš išsaugodami originalą. Tokios transformacijos gali būti naudingi požymiai, tačiau jos nėra canonical hostname. Laikykite jas derived laukuose kartu su taisyklės versija.

## IDN, Punycode ir panašūs simboliai turi turėti atskirą kelią

[RFC 5890](https://www.rfc-editor.org/rfc/rfc5890.html) skiria ASCII **A-label**, paprastai prasidedantį `xn--`, nuo Unicode **U-label**. Saugokite ir lyginkite abi formas. Rodant tik Unicode galima paslėpti tikslų wire representation, rodant tik Punycode – nepamatyti vizualios imitacijos, kuri svarbi analitikui.

Unicode skeleton ir confusable patikros padeda rasti vardus, kurie skirtinguose rašmenyse primena saugomą label. Vis dėlto [Unicode Technical Standard #39](https://www.unicode.org/reports/tr39/) aprašo kelias panašumo klases ir parodo, kad rezultatą reikia vertinti kontekste. [Unicode saugumo DUK](https://www.unicode.org/faq/security.html) taip pat primena, kad confusable simboliai sudaro tik mažą phishing dalį. Paprastas ASCII vardas `brand-login-secure` gali būti dažnesnis už sudėtingą homografą.

Confusable rezultatą naudokite kaip peržiūros priežastį, ne kaip įrodymą. Įrašykite originalų U-label, A-label, skeleton, naudotas rašto sistemas ir tikslią suveikusią taisyklę. Mixed-script ir whole-script rezultatai turi būti paaiškinti skirtingai.

## Prieš fuzzy palyginimą sukurkite prižiūrimą prekės ženklo modelį

Prekės ženklas nėra viena tekstinė eilutė. Naudingame modelyje yra:

- oficialūs registruojami domenai ir žinomi paslaugų subdomenai
- canonical rodomas pavadinimas
- stabilūs produktų vardai ir naudojamos santrumpos
- su ženklu dažnai jungiami rizikingi žodžiai, pavyzdžiui, login, verify, support ar payment
- token, kurie yra per daug bendri naudoti atskirai
- žinomi teisėti partneriai ir deleguotų paslaugų domenai
- realiai naudojamos kitų kalbų formos
- aiškios išimtys, paremtos pasikartojančių klaidingų sutapimų peržiūra.

Oficialius domenus laikykite atskirai nuo matching token. Tikslus oficialaus domeno sutapimas dažniau yra inventoriaus ar netikėto sertifikato išdavimo stebėjimas, o ne phishing kandidatas. Oficialus domenas, parodytas kaip kito registruojamo domeno subdomeno dalis, yra visai kitas atvejis: `bank.example.verify.invalid` kontroliuojamas ties `verify.invalid`, ne ties `bank.example`.

## Taikykite paaiškinamas heuristikų grupes

Vienas distance score neturi spręsti publikavimo. Naudokite mažas, pavadintas taisyklių grupes ir saugokite jų rezultatus.

### Exact ir ribas suprantančios taisyklės

- tikslus stebimas registruojamas domenas: numatytas inventorius arba netikėtas sertifikato išdavimas tikram domenui
- tikslus prekės ženklo token kaip atskiras label: `brand-login.example`
- oficialus domenas prieš kitą registruojamą ribą: `brand.example.verify.invalid`
- prekės ženklas su rizikingu veiksmu: login, auth, secure, invoice, parcel ar payment
- wildcard SAN, apimantis ženklą primenantį parent.

Ribas suprantantis tokenizavimas neleidžia trumpam `art` sutapti su kiekvienu žodžiu, kuriame yra tos raidės. Taisyklė turi suprasti label, brūkšnelio ir registruojamo domeno ribas, o ne ieškoti vienoje suplotoje eilutėje.

### Affix ir edit taisyklės

Prefix ir suffix formos randa `mybrand`, `brand24` ar `brand-support`. Damerau-Levenshtein atstumas aptinka įterpimą, pašalinimą, pakeitimą ir sukeitimą, tačiau slenkstis turi priklausyti nuo label ilgio. Vieno simbolio atstumas svarbus išskirtiniam šešių simbolių vardui ir beveik bevertis dviejų raidžių santrumpai.

Klaviatūros kaimynystės ar praleisto simbolio taisyklės naudingos tada, kai tiksliai pasako, kas pasikeitė. Nekurkite milžiniško typo žodyno, kuriame visi rezultatai vienodi. Skaičiuokite pagal realiai stebimą vardą, išsaugokite canonical token ir edit operacijas.

### Token ir konteksto taisyklės

Bendriniai žodžiai vertę įgyja kombinacijose. `secure-payment` vienas gali būti įprastas. Išskirtinis stebimo ženklo token kartu su `secure-payment`, nauju CT timestamp ir kitu registruojamu domenu jau vertas peržiūros. Balas gali padėti rikiuoti eilę, tačiau viešame įraše vis tiek rodykite prisidėjusius požymius, o ne vien „92/100“.

## Klaidingi sutapimai yra produkto dalis

Stebėjimas ras teisėtus perpardavėjus, bendruomenes, partnerius, tiekėjus, dokumentaciją, saugumo testus, staging sistemas ir nesusijusius žodyninius vardus. Shared hosting sertifikatas gali turėti daugelio klientų vardus. Atnaujintas sertifikatas gali iš naujo parodyti jau atmestą vardą. Sertifikavimo institucija gali į logą įkelti precertificate, kurio išdavimas vėliau nutraukiamas.

Tai spręskite būsena, ne trynimu:

- **observed:** logo faktas išlieka
- **suspected:** vardas pateisina peržiūrą, bet nėra nepriklausomo patvirtinimo
- **corroborated:** papildomas viešas šaltinis palaiko phishing ar impersonation vertinimą
- **dismissed:** įrodymai rodo teisėtą ar nereikšmingą paaiškinimą
- **expired/unresolved:** dabartinė DNS būsena pasikeitė, istorinis stebėjimas išlieka
- **retracted:** publikuotas vertinimas buvo klaidingas, o pataisymas matomas.

Suppressions turi būti siauros, versijuojamos ir, kai įmanoma, su galiojimo pabaiga. „Ignoruoti viską šiame hostingo paslaugų teikėjuje“ sunaikina aprėptį. „Iki partnerystės peržiūros datos nerodyti šio tikslaus partnerio domeno“ yra patikrinama išimtis.

## Enrichment suteikia kontekstą, ne nuosavybę

Po pavadinimo sutapimo ribotas enrichment gali surinkti DNS atsakymus, nameserver, RDAP registracijos duomenis, sertifikato grandinę, autonominės sistemos kontekstą ir jau viešus skenavimo stebėjimus. Kiekvienas šaltinis turi atskirą timestamp ir ribas. Tai, kad reputacijos paslauga nieko nežino, nėra „švaru“; RDAP registranto nebuvimas neįrodo slėpimosi; Cloudflare IP nėra origin serveris.

Neatidarykite kiekvieno kandidato automatiškai iš asmeninio ar produkcinio tinklo. Naujas nuotolinis skenavimas kontaktuoja su taikiniu ir gali paviešinti URL. Unikalios query reikšmės gali identifikuoti gavėją. Vadovaukitės OPSEC seka iš [Infrastruktūros pivoting 101](/lt/tyrimai/infrastrukturos-pivoting-101/): pradėkite nuo jau esančių viešų įrašų, atskirkite trečiosios šalies lookup nuo aktyvaus skenavimo ir eskaluokite tik turėdami leidimą bei konkretų įrodymo poreikį.

[Hostinger Pages phishing infrastruktūros tyrimas](/lt/tyrimai/hostinger-pages-phishing-infrastrukturos-tyrimas/) parodo, kodėl tikslūs dokumento ir JavaScript stebėjimai yra stipresni už vien į prekės ženklą panašų vardą. [UNIPARK smishing tyrime](/lt/tyrimai/unipark-smishing-infrastrukturos-tyrimas/) nuo vienos žinutės pereita prie hash susietos infrastruktūros, bet išlaikyta riba tarp bendrų artefaktų ir operatoriaus attribution.

## GitHub-only stebėjimo ir publikavimo architektūra

Sistema be VPS gali būti vertinga, jeigu ją sąžiningai pateikiame kaip periodinį publikavimą, o ne kaip nenutrūkstamą sensorių.

```text
scheduled / manual workflow
  → ribota CT įvestis arba atkuriamas stream langas
  → schemos tikrinimas ir SAN normalizavimas
  → versijuotos prekių ženklų taisyklės
  → kandidatų vertinimas ir deduplikavimas
  → ribotas pasyvus enrichment
  → nekintamas žalias stebėjimas + sanitizuotas viešas įrašas
  → testai, snapshot build ir statinis deploy
```

Konfigūraciją, schemas, prekių ženklų aprašus ir publikavimo kodą laikykite repozitorijoje. Saugokite patikrinamą ir atkuriamą checkpoint, pavyzdžiui, paskutinį apimtą šaltinio intervalą bei kompaktišką deduplikavimo indeksą. Žalius stebėjimus galima laikyti release assets ar data branch, jeigu leidžia saugojimo apimtis, o viešoje svetainėje turi likti tik sanitizuoti laukai. Niekada necommitinkite API paslapčių ar gavėjui unikalių URL.

Workflow turėtų turėti:

- `workflow_dispatch` rankiniam atkūrimui ir ribotam backfill
- tvarkaraštį ne pačią valandos pradžią
- aiškius timeout ir concurrency, kad persidengę rinkikliai nesugadintų būsenos
- least-privilege `permissions`, atskiriant skaitymą ir analizę nuo mažo duomenis įrašančio job
- konkrečiomis revision reikšmėmis prisegtus actions ir dependency lockfile
- schema, dublikatų, nuorodų ir build testus prieš deploy
- no-change kelią, kuris įrašo rinkimo sveikatą, bet negeneruoja triukšmingų commit
- matomą stale būseną, kai rinkimas ar publikavimas praleidžia numatytą langą
- deterministinį rezultatą, kad ta pati įvestis sukurtų tą patį viešą įrašą.

[GitHub workflow įvykių dokumentacijoje](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule) nurodoma, kad scheduled workflow gali vėluoti dėl didelės apkrovos, o eilėje esantys job gali būti praleisti, ypač valandos pradžioje. Trumpiausias intervalas yra penkios minutės, tvarkaraštis vykdomas iš naujausios default branch versijos, o viešoje repozitorijoje gali būti išjungtas po 60 dienų be aktyvumo. Todėl `cron` laikas yra ketinimas, ne įrodymas, kad rinkimas vyko.

Publikuokite ir `scheduled_at`, ir `started_at`, įvesties skaičius, apimtą šaltinio intervalą, paskutinį sėkmingą bandymą bei duomenų pasikeitimo laiką. Vartotojas tada atskirs pasenusią automatiką nuo tikro nulinio rezultato. Po gedimo rankinis backfill turi atkurti žinomą praleistą intervalą, o ne vien paleisti rinkimą „nuo dabar“.

## Laukai, kurie kandidatą padaro patikrinamą

Mažiausiai reikėtų išsaugoti:

- stabilų kandidato ID ir schemos versiją
- žalią bei normalizuotą DNS vardą, wildcard flag, A-label ir U-label
- CT logo ar šaltinio nuorodą, stebėjimo laiką, issuer ir sertifikato fingerprint, kai prieinamas
- naudotą oficialų prekės ženklo modelį ir jo versiją
- visas suveikusias taisykles su įvestimis ir apskaičiuotomis reikšmėmis
- enrichment faktus su savarankiškais stebėjimo timestamp
- vertinimo būseną, confidence, priežastį ir reviewer ar automatizuoto šaltinio žymą
- first-seen, last-seen ir publikavimo laiką
- pataisymus, atšaukimus ir ankstesnę būseną.

Viešai hostname galima rodyti neutralizuota forma, kad jis netaptų netyčia paspaudžiama nuoroda, tačiau machine-readable duomenys turi išlikti sintaksiškai vienareikšmiai. Istorinių būsenų neperrašykite tyliai. Tai, kad šiandien DNS nebeatsako, yra laiko juostos įvykis, o ne įrodymas, kad domenas buvo kenkėjiškas arba grėsmė baigėsi.

## Praktinė peržiūros tvarka

Pirmiausia peržiūrėkite kandidatus, kurie jungia išskirtinį prekės ženklo sutapimą su kitu registruojamu domenu, rizikingais veiksmo žodžiais, nauju sertifikato įrašu ir papildomu viešu stebėjimu. Žemiau rikiuokite žinomus oficialius domenus, tikslius partnerius ir bendrinių token sutapimus. Prieš puslapio dizainą patikrinkite registruojamo domeno ribą. Prieš žodį „naujas“ patikrinkite timestamp reikšmes. Bendrą infrastruktūrą atskirkite nuo nuosavybės. Užrašykite, kas vertinimą paneigtų.

CT stebėjimas stipriausias kaip ankstyvas vardų sensorius, perduodantis kandidatus disciplinuotai analizei. Jis silpniausias tada, kai „sertifikate yra prekės ženklas“ publikuojama kaip „phishing domenas“. Teisingas SAN išrinkimas, aiškios taisyklės, matoma automatikos sveikata ir įrodymus gerbianti peržiūra triukšmingą viešą srautą paverčia pagrįsta grėsmių žvalgyba.

## Oficialūs standartai ir dokumentacija

- [RFC 9162: Certificate Transparency Version 2.0](https://www.rfc-editor.org/rfc/rfc9162.html)
- [RFC 5280: Subject Alternative Name](https://www.rfc-editor.org/rfc/rfc5280.html#section-4.2.1.6)
- [Certificate Transparency: kaip veikia CT](https://certificate.transparency.dev/howctworks/)
- [Certificate Transparency: žinomi logai](https://certificate.transparency.dev/logs/)
- [Certificate Transparency: monitoring](https://certificate.transparency.dev/monitors/)
- [RFC 5890: IDNA apibrėžimai](https://www.rfc-editor.org/rfc/rfc5890.html)
- [Unicode Technical Standard #39: Unicode saugumo mechanizmai](https://www.unicode.org/reports/tr39/)
- [GitHub Actions: scheduled workflow įvykiai](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule)
