---
title: "Facebook cloaking: kaip apgaulingos reklamos slepia tikrąjį puslapį"
card_title: "Kaip Facebook cloaking slepia scam puslapius"
description: "Gynybinis Facebook cloaking paaiškinimas: sąlyginiai redirect, skirtingi tikrintojų ir aukų atsakymai, įrodymų išsaugojimas bei analitinės ribos."
seo_title: "Facebook cloaking: kaip slepiami scam puslapiai"
seo_description: "Kaip Facebook reklamos nukreipia tikrintojus ir aukas į skirtingus puslapius, kokius įrodymus saugoti ir kaip jų nepaversti nepagrįstu verdiktu."
seo_keywords:
  - "Facebook cloaking"
  - "Facebook reklamos sukčiavimas"
  - "paslėptas scam puslapis"
  - "cloaking phishing"
  - "sąlyginiai peradresavimai"
  - "apgaulingų reklamų tyrimas"
date: 2026-08-31 18:10:00 +0300
lang: lt
translation_key: facebook-cloaking-explained
permalink: /lt/tyrimai/facebook-cloaking-kaip-slepiami-puslapiai/
author: deividas-lis
content_type: technical-guide
publication_class: technical-assessment
confidence: high
tlp: clear
categories: [fraud-scams, social-engineering, tradecraft]
tags: [cloaking, Facebook, phishing, redirect chains, OSINT, CTI, incident response]
featured: false
draft: false
published: true
toc: true
comments: false
prose_width: wide
scope: "Pagal veikimo mechanizmą sudarytas gynybinis vadovas apie sąlyginį turinio pateikimą scam reklamose ir phishing, skirtas prekių ženklų komandoms, tyrėjams bei incidentų valdytojams."
limitations: "Skirtingi atsakymai savaime neįrodo kenkėjiško tikslo, kampanijos narystės ar operatoriaus tapatybės. Vadove nėra instrukcijų, kaip apeiti tikrinimo sistemas, prieigos kontrolę ar imituoti aukos profilį."
methods:
  - "HECAVEX pirmosios šalies atvejo įrodymų peržiūra"
  - "Standartų ir oficialios dokumentacijos peržiūra"
  - "Palyginamasis atsakymų įrodymų modeliavimas"
  - "Gynybinio rinkimo ribų analizė"
evidence_basis: "Esamas HECAVEX Facebook investicinio scam tyrimas, oficiali Google cloaking ir redirect dokumentacija, urlscan dokumentacija, HTTP standartai ir susietuose tyrimuose aprašyti išsaugoti vieši stebėjimai."
key_findings:
  - "Cloaking yra sprendimų sistema: tas pats URL pagal užklausos ir sesijos kontekstą gali grąžinti švarų puslapį, klaidą, patikrą arba scam turinį."
  - "Routing gali paveikti referrer, IP ir vietovės kontekstas, įrenginio požymiai, slapukai, laikas bei automatizavimo signalai, tačiau visi jie turi ir teisėtų paskirčių."
  - "Švarus atsakymas parodo, ką vienas stebėtojas gavo konkrečiu metu, bet neįrodo, kad visi lankytojai gavo tą patį."
  - "Naudingame pranešime išsaugomas pradinis taškas, redirect grandinė, atsako artefaktai, rinkimo kontekstas ir ribos, o techninis skirtumas nepaverčiamas nepagrįsta atribucija."
image:
  path: /assets/img/posts/2026-08-31-facebook-cloaking-explained/facebook-cloaking-explained-hero-v2.webp
  social: /assets/img/social/facebook-cloaking-explained-lt.png
  thumbnail: /assets/img/posts/2026-08-31-facebook-cloaking-explained/facebook-cloaking-explained-card-v2.webp
  alt: "Vienas reklamos URL pagal kontekstą nukreipiamas į švarų arba apgaulingą aukai skirtą atsakymą, o prieš vertinimą išsaugomi įrodymai"
  width: 1600
  height: 900
---

## Cloaking yra nukreipimo sprendimas, o ne ypatinga puslapio rūšis

Žmogus paspaudžia Facebook reklaminį įrašą ir pamato klonuotą naujienų straipsnį, investavimo formą arba netikrą prisijungimą. Tikrintojas, atvėręs iš pažiūros tą patį adresą, gauna tuščią puslapį, nekaltą tinklaraštį, tikrą prekės ženklo svetainę arba klaidą. Abu stebėjimai gali būti tikri.

Tai praktinė **Facebook cloaking** problema. Pradinis URL nepasako visko, ką pateiks serveris. Redirect paslauga, serverio taisyklė ar naršyklėje vykdomas scenarijus įvertina kontekstą ir parenka atsakymą. Žalingas turinys gali pasirodyti tik atėjus iš reklamos, pasirinktoje šalyje, konkrečios rūšies įrenginyje, ribotu laiku arba pirmojo apsilankymo metu.

Oficialioje Google [spam politikoje cloaking apibrėžiamas](https://developers.google.com/search/docs/essentials/spam-policies#cloaking) kaip skirtingo turinio pateikimas žmonėms ir paieškos sistemoms siekiant manipuliuoti ar klaidinti. Ta pati dokumentacija skiria apgaulingą peradresavimą nuo įprastų redirect, naudojamų svetainės perkėlimui, lokalizacijai ar prisijungusio naudotojo navigacijai. Grėsmių žvalgyboje šis skirtumas būtinas: **skirtingas turinys yra stebėjimas, o apgaulingas tikslas – konteksto reikalaujantis vertinimas**.

Ilgesniame [HECAVEX Facebook cloaking tyrime](/lt/tyrimai/kai-fake-news-scamai-ir-cloaking/) dokumentuota tikra investicinio scam ekosistema, kurioje susijungė klonuota žiniasklaida, reklaminis srautas ir sąlyginis turinio pateikimas. Šio vadovo paskirtis siauresnė: paaiškinti mechanizmą, gynybinius klausimus ir įrodymus, bet nesukurti instrukcijos, kaip pergudrauti operatoriaus tikrinimus.

## Kas gali pakeisti pateikiamą atsakymą

Web užklausa turi daugiau konteksto negu adreso juostoje matomas URL. Dalį duomenų klientas išsiunčia tiesiogiai, dalis nustatoma apytiksliai, o kiti signalai atsiranda tik naršyklei įvykdžius kodą ar išsaugojus būseną.

| Kontekstas | Ką gali matyti paslauga | Teisėtas paaiškinimas | Saugumo reikšmė |
|---|---|---|---|
| referrer ir kampanijos parametrai | ar lankytojas atėjo iš reklamos, paieškos ar partnerio | atribucija ir kampanijos matavimas | tiesioginis vizitas gali gauti pakaitinį puslapį, o reklamos paspaudimas tęsti grandinę |
| IP ir tinklas | adresas, ASN, hosting ar prieigos tiekėjo kontekstas | piktnaudžiavimo kontrolė ir greičio ribojimas | žinomi scanner ar duomenų centrų tinklai gali gauti švarų atsakymą |
| vietovė | pagal tinklą nustatoma šalis ar apytikslis regionas | kalba, licencijos, mokesčiai ir paslaugos prieinamumas | kampanija gali būti rodoma tik pasirinktos rinkos žmonėms |
| įrenginys ir klientas | naršyklės šeima, operacinė sistema, ekrano klasė, antraštės | suderinamumas ir responsive dizainas | mobilusis lankytojas gali būti nukreiptas kitaip negu desktop tikrintojas |
| slapukai ir sesija | ankstesni apsilankymai, referral būsena ir lokalios reikšmės | prisijungimas, sutikimai ir pirkinių krepšelis | vienkartinis puslapis gali išnykti pakartojus vizitą |
| laikas ir veiksmų seka | laikas, užklausų tvarka, vykdomas JavaScript | našumas, anti-abuse ir aplikacijos eiga | turinys gali veikti tik kampanijos lange |
| automatizavimo požymiai | nepilna naršyklės elgsena ar įrankiams būdingi signalai | bot valdymas ir fraud prevencija | automatizuota peržiūra gali gauti patikrą, tuščią puslapį ar pakaitinį turinį |

Nė vienas iš šių laukų nėra savaime kenkėjiškas. Bankai naudoja rizika paremtą autentifikaciją, parduotuvės lokalizuoja kainas, reklamos sistemos matuoja kampanijas, o CDN blokuoja žalingą automatizavimą. Klausimas yra ne vien tai, ar puslapis kinta. Reikia nustatyti, **ar kaita naudojama nuo tikrintojų, prekės ženklo ar galimų aukų nuslėpti iš esmės kitokią ir žalingą paskirtį**.

## Pirmiausia modeliuokite request kelią

Matomas URL yra tik pirmas objektas. Audituojamas įrašas turi atskirti kelio sluoksnius, nes kiekvienas jų turi kitokią telemetriją ir kitą valdytoją.

| Sluoksnis | Įrodymo objektas | Naudingi laukai | Ką galima pagrįsti |
|---|---|---|---|
| platformos pradžia | reklama, Page, įrašas, žinutė ar bibliotekos įrašas | platformos ID, creative, matoma paskirtis, laikas | pradžios taško pateikimą ir teiginį |
| išeinanti užklausa | iš platformos išeinanti naršyklės užklausa | tikslus URL, metodas, `Referer`, user agent, išsiųsti slapukai, laikas | ko paprašė klientas |
| serverio redirect | HTTP atsakas | statusas, `Location`, antraštės, body hash, atsakiusio serverio IP | kur vienas serveris nurodė eiti klientui |
| kliento navigacija | naršyklėje įvykdytas perėjimas | inicijavęs script, meta refresh, navigacijos laikas, paskirties URL | kokį perėjimą sukėlė kliento pusės kodas |
| pateiktas atsakymas | galutinis dokumentas ir subresources | galutinis URL, title, screenshot, DOM ir atsakų hash, form action | ką gavo konkretus stebėtojas |
| naudotojo veiksmas | forma, failas ar autentifikacijos įvykis | rodyti laukai, paskirtis, laikas, autorizuotoje telemetrijoje matytas endpoint | kokio veiksmo prašyta arba kas atlikta |

HTTP `Referer` laukas gali perduoti ankstesnio resurso URI tiek, kiek leidžia privatumo ir referrer-policy kontrolė. Tai apibrėžia [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html#field.referer). Šiuolaikinės naršyklės taip pat gali siųsti Fetch Metadata antraštes, aprašančias request kontekstą, pavyzdžiui, svetainių ryšį, režimą ir paskirtį. Šiuos signalus serverio request izoliacijai apibrėžia [W3C Fetch Metadata specifikacija](https://www.w3.org/TR/fetch-metadata/). Jų buvimas parodo, ką paslauga galėjo vertinti. Jis neįrodo, kurį lauką naudojo konkretus operatorius.

DNS ir TLS stebėjimus laikykite atskirai nuo HTTP elgsenos. Hostas gali pakeisti IP, bet grąžinti tą patį dokumentą. Shared edge IP gali aptarnauti nesusijusius klientus. Sertifikatas gali parodyti, kad tam tikru metu vardui pateiktas raktas, bet ne tai, koks puslapis pateiktas. Request kelio teiginiams reikia request kelio įrodymų.

![Kontroliuojamas vieno URL palyginimas, parodantis, kaip užfiksuotos užklausos gali grąžinti skirtingus atsakymus](/assets/img/posts/2026-08-31-facebook-cloaking-explained/cloaking-request-comparison-lt.svg)

*Schema: Atsakymų skirtumas pagrindžiamas tik tada, kai išsaugotas užklausos kontekstas ir kiekvienas pakeistas rinkimo kintamasis.*

## Švarus ir aukai skirtas atsakymas yra analitinės etiketės

**Švarus atsakymas** – tai konkretaus stebėtojo gautas nekenksmingas, nepasiekiamas arba tikrosios paskirties neatspindintis turinys. Tai gali būti:

- tuščias dokumentas ar bendrinė klaida
- CAPTCHA, patikros arba sutikimo langas
- nekaltas straipsnis ar parking puslapis
- redirect į tikrą apsimetamo prekės ženklo svetainę
- reklamos taisykles atitinkantis puslapis be matomos scam formos.

**Aukai skirtas atsakymas** – su įtariamu žalingu tikslu susijęs turinys: klonuotas straipsnis, prisijungimo forma, mokėjimo puslapis, skambučio užsakymas, netikra prekybos sąsaja ar failo diegimo pasiūlymas.

Šios etiketės apibūdina atsakymo vaidmenį tyrime, bet neįrodo operatoriaus. Viešo scanner ekrano kopija su nekaltu puslapiu nepaneigia aukos ekrano kopijos. Aukos ekrano kopija neparodo visos redirect grandinės, backend, kampanijos masto ar trukmės. `403` neįrodo, kad operatorius atpažino tyrėją. Redirect į tikrą prekės ženklą gali būti tyčinis išėjimas, jau pašalintas deployment, platformos įspėjimas ar normali aplikacijos eiga.

Pirmiausia užrašykite, kas buvo grąžinta. Tik tada aiškinkite kodėl. Ši paprasta tvarka neleidžia perrašyti įrodymų pagal mėgstamiausią hipotezę.

## Facebook kontekstas nesuteikia pasitikėjimo išoriniam puslapiui

Pirmas kontaktas gali vykti pažįstamoje platformoje: reklaminiame įraše, Page, Messenger pokalbyje ar pasidalytame straipsnyje. Toks kontekstas mažina įtarumą, bet Facebook tapatybės ir saugumo ribos neperduoda išorinei svetainei.

Reklamos grandinėje gali būti keli sluoksniai:

1. matomas Page, kūrybinė medžiaga ir raginimas veikti
2. matavimo bei kampanijos parametrai
3. vienas ar keli redirect
4. sąlyginio routing logika
5. galutinis puslapis, forma arba perdavimas kitai sistemai.

Matomas nuorodos tekstas nebūtinai yra galutinis hostas. Pirmame žingsnyje gali būti teisėta analytics arba URL trumpinimo paslauga. Ir atvirkščiai: įtartina grandinė gali baigtis nepavojingu puslapiu. Išsaugokite seką. Pagal pirmą domeną nespręskite, kur laikomas phishing, o pagal bendrą platformą – kam priklauso kampanija.

Meta [saugaus apsipirkimo rekomendacijose](https://www.facebook.com/help/123884166448529/) šalia Marketplace naudojimo pateikia scam atpažinimo, pardavėjų patikros ir pranešimo galimybes. Tai naudinga vartotojo informacija, tačiau platformos kontekstas vis tiek nepatvirtina išorinės mokėjimo, investavimo ar credentials formos. Tariamas įvykis turi būti patikrintas oficialioje programėlėje ar pačių įvestu adresu.

## Saugus įrodymų išsaugojimo procesas

Daugumai gavėjų nereikia tirti cloaked puslapio. Reikia sustoti, išsaugoti žinutę ar reklamą, patikrinti teiginį oficialiu kanalu ir pranešti. Aktyvus rinkimas skirtas įgaliotai saugumo komandai, turinčiai patvirtintą aplinką, duomenų saugojimo tvarką ir aiškų sprendimą, kurį pakeis gautas rezultatas.

### 1. Išsaugokite pradžios tašką

Užfiksuokite reklamą ar žinutę tokią, kokia ji matoma: Page arba paskyros pavadinimą, tekstą, laiką, platformos vietą ir reklamos bibliotekos identifikatorių, jei jis pateikiamas. Tikslų URL laikykite privačiai. Jei jame yra el. paštas, telefono numeris ar ilgas token, viešam dalijimuisi sukurkite nuo asmeninių duomenų išvalytą ir defangintą kopiją.

### 2. Kiekvieną stebėjimą saugokite atskirai

Prie kiekvieno stebėjimo pridėkite:

- rinkimo laiką ir laiko juostą
- pradinį bei galutinį URL
- HTTP statusą ir `Location` reikšmes, jei jos išsaugotos
- ekrano kopiją, puslapio pavadinimą ir atsako arba DOM hash
- patvirtintos rinkimo sistemos naršyklės bei įrenginio klasę
- ar veikė JavaScript, slapukai ir redirect
- stebėjimo šaltinį: aukos įrenginį, organizacijos telemetriją, reklamos biblioteką ar trečiosios šalies archyvą
- trečiosios šalies paslaugos matomumo ir privatumo lygį.

[urlscan API dokumentacija](https://urlscan.io/docs/api/) patvirtina, kad skenas gali skirtis pagal šalį, user agent ir referrer, taip pat įspėja, kad viešas skenas tampa viešu įrašu. Šie nustatymai paaiškina rinkimo kontekstą, bet nėra kvietimas imituoti aukas ar apeiti puslapio kontrolę. Pirmiausia ieškokite jau esančių stebėjimų, pašalinkite asmeninius duomenis ir rinkitės mažiausią patvirtintam tikslui pakankamą matomumą.

### 3. Išsaugokite grandinę, ne tik paskutinę ekrano kopiją

HTTP peradresavimai yra normali web dalis. [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html#name-redirection-3xx) apibrėžia `3xx` semantiką, kuria klientas dažnai nukreipiamas į kitą vietą. Papildomus žingsnius gali sukurti JavaScript, meta refresh, deep link arba platformos tarpinis puslapis. Užrašykite juos kaip nuoseklius stebėjimus:

```text
reklama → matavimo URL → redirect → sąlyginis atsakymas → galutinis puslapis
```

Nepaverskite šios sekos teiginiu "Facebook laikė phishing puslapį" arba "shortener yra užpuolikas". Paslauga gali būti išnaudojama jos nesukompromitavus, o galutinis puslapis gali pasikeisti jau po pirmo pranešimo.

### 4. Skaičiuokite teisėtai išsaugotų artefaktų hash

Ekrano kopija naudinga apsimetimui prekės ženklu parodyti. Dokumento ar JavaScript hash padeda patvirtinti tikslų pakartotinį naudojimą. Favicon, formos laukų rinkinys ar kelio struktūra gali padėti rasti susijusią medžiagą. Visada parašykite, ką sutapimas reiškia. Tikslus failo hash gali pagrįsti kodo reuse, bet ne automatiškai bendrą savininką, nes kit'ai, šablonai ir kompromituotos svetainės gali būti dalijami.

Platesnį ryšių modelį pateikia [Infrastructure Pivoting 101](/lt/tyrimai/infrastrukturos-pivoting-101/). Jame paieškos rezultatas, patvirtintas techninis ryšys, cluster narystė ir atribucija paliekami keturiais skirtingais lygiais.

## Atkartojamas palyginimo protokolas

Palyginimas turi patikrinti ribotą teiginį, pavyzdžiui, "du to paties pradinio URL stebėjimai nurodytame laiko lange grąžino iš esmės skirtingą turinį". Tikslas nėra priversti serverį parodyti slepiamą puslapį.

### Apibrėžkite case ir rinkimo teisę

Užrašykite case ID, savininką, rinkimo tikslą, teisės pagrindą, pradžios bei pabaigos laiką, retention klasę ir abort sąlygas. Nurodykite, ar objektas gautas iš aukos pranešimo, organizacijos proxy, naršyklės istorijos, platformos bibliotekos, hosting tiekėjo ar viešo archyvo. Aukos screenshot ir naujos analitiko užklausos nevadinkite vienu stebėjimu.

### Užfiksuokite palyginimo manifestą

Prie kiekvieno stebėjimo laikykite machine-readable manifestą:

```text
case_id
observation_id
source_type
collected_at_utc
original_url_sha256
request_method
final_url
http_status_sequence
response_sha256
dom_sha256
screenshot_sha256
browser_family
network_context_class
referrer_state
cookie_state
javascript_state
collector_version
notes_and_unknowns
```

Tikslų jautrų URL laikykite ribotoje case saugykloje ir apskaičiuokite jo hash. Į paprastą ataskaitą dėkite redacted ir defangintą reikšmę. Hash padeda tikrinti vientisumą ir exact match, tačiau nepaverčia jautraus URL saugiu viešinti.

![Cloaking rinkimo manifestas, išsaugantis bylos tapatybę, rinkimo kontekstą, užklausą ir atsakymo hash](/assets/img/posts/2026-08-31-facebook-cloaking-explained/cloaking-capture-manifest-lt.svg)

*Schema: Manifestas surenkamas prieš interpretaciją, kad kitas analitikas galėtų atkurti palyginimą.*

### Lyginkite palyginamus objektus

Pirmiausia lyginkite stebėjimus, kurių pradinis URL, laiko langas ir rinkimo klasė sutampa. Tada aiškiai nurodykite visus nekontroliuotus kintamuosius. Aukos mobilioji naršyklė ir viešas cloud scanner skiriasi tinklu, klientu, referral būsena, slapukų istorija ir tikėtina laiku. Tokia pora gali parodyti atsakymų skirtumą, bet ne izoliuoti sprendžiantį kintamąjį.

| Laukas | Stebėjimas A | Stebėjimas B | Pagrįstas teiginys |
|---|---|---|---|
| šaltinis | organizacijos pranešimas | viešas archyvas | provenance skiriasi |
| pradinio URL hash | sutampa | sutampa | įrašyta pradžios reikšmė yra identiška |
| galutinis hostas | `news.example` | `brand.example` | keliai baigėsi skirtinguose hostuose |
| turinys | klonuotas straipsnis | tikras prekės ženklo puslapis | išsaugoti iš esmės skirtingi atsakymai |
| atsako hash | hash A | hash B | dokumentai nėra identiški |
| nekontroliuota būsena | referral žinomas | slapukai nežinomi | sprendimo taisyklė neizoliuota |

Kai vienu metu pasikeitė keli kintamieji, priežasties nepriskirkite vien šaliai, IP, įrenginiui ar referrer. "Stebėtas sąlyginis pateikimas" gali būti tvirtas teiginys. "Operatorius tyrėjus aptinka pagal būtent šią taisyklę" yra atskiras teiginys, kuriam daugelyje viešų case neužtenka kontroliuotų įrodymų.

![Cloaking palyginimo įrodymų riba, atskirianti pastovius duomenis, pakeistus kintamuosius ir išsaugotus rezultatus](/assets/img/posts/2026-08-31-facebook-cloaking-explained/cloaking-evidence-boundary-lt.svg)

*Schema: Palyginimas gali pagrįsti skirtingus rezultatus, bet nepasako, kuris nekontroliuotas kintamasis juos sukėlė.*

### Išsaugokite neigiamus rezultatus

Timeout, challenge, `403`, tuščias body ar redirect į teisėtą svetainę yra duomenų rinkinio dalis. Užrašykite resolver rezultatą, ryšio būseną, statusą, turinio ilgį ir laiką. Neišmeskite švarių ar nepavykusių stebėjimų vien todėl, kad jie silpnina pasirinktą paaiškinimą.

Nekartokite gavėjui unikalaus URL, nekeiskite parametrų, neautomatizuokite sąveikos ir neapeikite challenge vien tam, kad pasirodytų žalingas puslapis. Tokie veiksmai gali išduoti tyrimą, panaudoti vienkartinį token, paviešinti asmens duomenis arba peržengti leidimo ribą. Dingęs puslapis yra tyrimo apribojimas, o ne konkursas.

## False-positive kontrolė įprastai turinio kaitai

Iš pažiūros nesutampančias ekrano kopijas gali sukurti ir teisėtos sistemos:

- geografinis prieinamumas bei kalbos parinkimas
- prisijungusio ir neprisijungusio naudotojo vaizdai
- A/B testai ir etapinis atnaujinimų diegimas
- sutikimo bei amžiaus patikros
- anti-bot challenge
- pasibaigusi kampanija ar pašalintas puslapis
- cache skirtumai ir vėluojantis platformos enforcement.

Apgaulę vertinkite pagal skirtumą, tikslą ir kontekstą kartu. Stipresni įrodymai yra žalinga forma ar failas, nukopijuotas prekės ženklas, neatitinkantis reklamos pažadas, gavėjui unikalus token, patvirtintas credentials arba mokėjimo rinkimas, pakartotinai sutampantys artefaktai ir nuosekli grandinė nuo reklamos iki galutinio puslapio.

Prieš pavadindami modelį cloaking, patikrinkite mažiau kenkėjiškos intencijos reikalaujančius paaiškinimus:

- palyginkite cache antraštes, amžių ir CDN response ID, jei jie išsaugoti
- nustatykite, ar vienas stebėjimas buvo authenticated, o kitas anonymous
- patikrinkite, ar skirtumo nepaaiškina kalba, consent, amžiaus arba regiono kontrolė
- patikrinkite, ar tarp stebėjimų nesibaigė kampanija ir neįvyko enforcement
- atskirkite platformos warning puslapį nuo destination atsako
- lyginkite pilną response arba DOM hash, ne vien vizualinį panašumą
- patvirtinkite, kad pradinis URL su path ir token iš tikrųjų identiškas.

Atskiras [informacijos gamyklų prie Lietuvos tyrimas](/lt/tyrimai/informacijos-gamyklos-prie-lietuvos/) nustato dar vieną analitinę ribą. Klonuota žiniasklaida ir koordinuotas platinimas gali būti naudojami informacinėms operacijoms, finansiniam scam arba abiem tikslams. Panaši išvaizda neleidžia visko priskirti vienam veikėjui ar misijai. Pirmiausia įvardykite elgesį. Atribuciją pateikite tik tada, kai ją palaiko įrodymai.

## Praktinis gynybinis patvirtinimas

Cloaking vertinimą laikykite pagrįstu, kai yra trys elementai:

1. išsaugotas pradžios ryšys, jungiantis reklamą, žinutę ar platformos objektą su request keliu
2. bent vienas išsaugotas atsakas, turintis žalingą arba iš esmės apgaulingą funkciją
3. palyginimas arba taisyklės artefaktas, palaikantis sąlyginį pateikimą, kartu nurodant nekontroliuotus kintamuosius ir teisėtas alternatyvas.

Jei turite tik žalingą atsakymą, praneškite apie su pradžios tašku susietą phishing ar scam puslapį, bet nebūtinai apie cloaking. Jei turite tik du skirtingus nepavojingus atsakymus, praneškite apie variaciją. Jei kelias rekonstruotas iš atskirų viešų stebėjimų, vadinkite jį rekonstrukcija ir išsaugokite jo laiko ribas.

Organizacijos aplinkoje browser history, secure web gateway, DNS, endpoint ir identity telemetriją koreliuokite pagal naudotoją ir UTC laiką. Proxy įvykiai gali atkurti redirect grandinę net tada, kai puslapis jau dingęs. Suvestiems credentials ar užbaigtai autentifikacijai reikia identity ir incident response telemetrijos, ne dar vieno screenshot.

## Ką turėtų išsaugoti prekės ženklo, reklamos ir saugumo komandos

Skirtingoms komandoms reikia skirtingų to paties įrašo dalių:

- **brand protection:** apsimetamas pavadinimas, logotipai, ekrano kopijos, galutiniai hostai ir poveikis klientams
- **advertising trust and safety:** reklama, Page ar paskyros ID, kūrybinė medžiaga, paskirtis, laikas ir taisyklių neatitikimas
- **hosting ar platformos abuse:** tikslūs URL, atsakų įrodymai, laikas, hash ir jų valdomas paslaugos sluoksnis
- **SOC ir incident response:** paveiktas žmogus, naršyklės, proxy bei DNS telemetrija, suvesti duomenys ar patvirtinimai, atsisiuntimai ir containment
- **grėsmių žvalgyba:** provenance, laiko ribos, ryšiai, alternatyvūs paaiškinimai ir confidence.

Jei pateikti prisijungimo ar kortelės duomenys, autentifikacijos kodas arba mokėjimo patvirtinimas, rinkimas jau nėra pirmas prioritetas. Paskyrą reikia riboti oficialiais kanalais. [Įtartinos SMS vadove](/lt/tyrimai/kaip-saugiai-patikrinti-itartina-sms-nuoroda/#ka-daryti-po-paspaudimo-ar-duomenu-suvedimo) atskirti veiksmai po paprasto paspaudimo, slaptažodžio, mokėjimo duomenų, patvirtinimo ar įdiegto failo.

## Ko šie įrodymai vieni nepatvirtina

Cloaking įrodymai gali parodyti, kad du stebėtojai gavo skirtingą medžiagą ir kad žalingas puslapis buvo susijęs su konkrečia grandine. Vien jų neužtenka nustatyti:

- kiek žmonių gavo puslapį ar atliko veiksmą
- ar visi vienos šalies lankytojai matė tą patį
- kas sukūrė reklamą, redirect, puslapį ar backend
- ar reklamos, hosting arba CDN tiekėjas buvo sukompromituotas
- ar dvi kampanijos turi bendrą operatorių vien todėl, kad naudoja tą pačią populiarią paslaugą
- kodėl konkretus stebėtojas gavo švarų atsakymą
- ar turinys dar veiks rytoj.

Naudokite laiku apribotą kalbą: "stebėta", "pranešė", "išsaugotas atsakas", "galimas ryšys" ir "nenustatyta". Tokį pranešimą galima naudoti ir tada, kai infrastruktūra jau pasikeitė.

## Gynybinis kontrolinis sąrašas

- [ ] Išsaugota reklama ar žinutė, Page arba paskyros kontekstas, laikas ir tikslus pradinis URL.
- [ ] Dalijimuisi sukurta defanginta kopija be asmeninių duomenų.
- [ ] Kiekvienas redirect ir atsakas užrašytas kaip atskiras stebėjimas su šaltiniu.
- [ ] Rinkimo kontekstas laikomas kartu su screenshot, DOM, atsaku ir hash.
- [ ] Švarus atsakymas nepaverstas saugumo įrodymu.
- [ ] Sąlyginis pateikimas nepaverstas neįrodyta konkretaus filtro taisykle.
- [ ] Reklamos teiginys patikrintas nepriklausomai pasiektu oficialiu kanalu.
- [ ] Credentials, mokėjimai, patvirtinimai ar failai nedelsiant perduoti incident response.
- [ ] Pranešta tik toms šalims, kurios gali veikti savo paslaugos sluoksnyje.
- [ ] Nurodyti nežinomieji, alternatyvūs paaiškinimai ir laiko riba.

## Šaltiniai ir susijusi medžiaga

1. [Google Search Central: spam politika, cloaking ir apgaulingi redirect](https://developers.google.com/search/docs/essentials/spam-policies)
2. [RFC 9110: HTTP peradresavimo semantika](https://www.rfc-editor.org/rfc/rfc9110.html#name-redirection-3xx)
3. [urlscan.io API dokumentacija ir skenų matomumo rekomendacijos](https://urlscan.io/docs/api/)
4. [W3C: Fetch Metadata Request Headers](https://www.w3.org/TR/fetch-metadata/)
5. [Meta Help Center: saugaus apsipirkimo patarimai](https://www.facebook.com/help/123884166448529/)
6. [HECAVEX: Facebook cloaking, netikros naujienos ir investicinio scam infrastruktūra](/lt/tyrimai/kai-fake-news-scamai-ir-cloaking/)
7. [HECAVEX: Informacijos gamyklos prie Lietuvos](/lt/tyrimai/informacijos-gamyklos-prie-lietuvos/)
8. [HECAVEX: Infrastructure Pivoting 101](/lt/tyrimai/infrastrukturos-pivoting-101/)

_Šis vadovas yra gynybinis. Jame aiškinama, kaip išsaugoti ir vertinti įgaliotam tyrėjui jau prieinamus įrodymus. Jis nemoko apeiti prieigos kontrolės, atkartoti aukos tapatybės ar išvengti platformos tikrinimo._
