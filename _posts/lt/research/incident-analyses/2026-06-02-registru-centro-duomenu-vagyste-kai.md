---
title: "Registrų centro duomenų vagystė, kai \"čia tik duomenys\" staiga tampa nacionalinio saugumo klausimu."
description: "Kodėl didelio masto Registrų centro duomenų vagystė nėra vien privatumo incidentas, o potencialus žvalgybos ir nacionalinio saugumo klausimas."
date: 2026-06-02T07:12:36.587Z
lang: lt
translation_key: substack-registru-centro-duomenu-vagyste-kai
permalink: /lt/tyrimai/registru-centro-duomenu-vagyste-kai/
redirect_from:
  - /lt/research/registru-centro-duomenu-vagyste-kai/
author: deividas-lis
content_type: incident-analysis
confidence: moderate
tlp: clear
categories: ["data-breaches", "threat-intelligence"]
tags: ["Registrų centras", "duomenų vagystė", "nacionalinis saugumas", "CTI"]
featured: false
scope: "Viešai paskelbtų faktų ir galimo pavogtų registrų duomenų panaudojimo grėsmių analizė."
limitations: "Viešai trūksta pilnos incidento laiko juostos, techninių indikatorių ir patvirtinto duomenų panaudojimo įrodymų."
key_findings:
  - "Registrų duomenys gali remti taikinių atranką, apsimetimą ir socialinę inžineriją."
  - "Incidento poveikis priklauso ne tik nuo įrašų skaičiaus, bet ir nuo jų tarpusavio jungiamumo."
  - "Nacionalinio saugumo vertinimui reikia atskirti patvirtintus faktus nuo galimų panaudojimo scenarijų."
series_key: centre-of-registers-data-theft
series_part: 1
image:
  path: /assets/img/posts/substack/registru-centro-duomenu-vagyste-kai/01.webp
  alt: "Registrų centro duomenų vagystė, kai \"čia tik duomenys\" staiga tampa nacionalinio saugumo klausimu."
  thumbnail: /assets/img/posts/substack/registru-centro-duomenu-vagyste-kai/01-card.webp
source_url: https://deivlis.substack.com/p/registru-centro-duomenu-vagyste-kai
---
![Registrų centro duomenų vagystės mastas ir galimas kelias iki nacionalinio saugumo poveikio.](/assets/img/posts/substack/registru-centro-duomenu-vagyste-kai/01.webp)

*Kitaip sakant labai seniai rašiau kažką, pagavau cinkelį, reikia kažką brūkštelt tokia įdomesne tema.. tai važiuojam, gero skaitymo, pažiūrėjau per CTI (Kibernetinių grėsmių žvalgymos) prizmę, nes nu.. visur vis skamba vieni dalykai, bet atribucijų ir kitų dalykų nier.*

Lietuvoje pradėtas ikiteisminis tyrimas dėl galimo neteisėto prisijungimo prie Registrų centro sistemų. Viešai skelbiama, kad galėjo būti neteisėtai nukopijuota daugiau nei 600 tūkst. registrų įrašų. Pagrindiniai taikiniais patapo Nekilnojamojo turto registras ir Juridinių asmenų registras. Pirminė žala vertinama ne mažiau kaip 111 tūkst. eurų. (**<https://www.lrt.lt/naujienos/verslas/4/2936321/duomenu-vagyste-is-registru-centro-nusiurbta-daugiau-nei-600-tukst-duomenu-irasu>**)

***Kitaip sakant... nutekėjo ne receptai cepelinams.***

Kalbame apie duomenis, kurie gali padėti išsiaiškinti žmonių turtą, įmonių struktūras, ryšius, adresus, nuosavybę ir verslus. Tokie duomenys patampa labai labai.. naudingi sukčiavimui, socialinei inžinerijai, taikinių profiliavimui ir žvalgybai.

Viešai patvirtintos atribucijos kol kas nėra. Todėl sakyti “padarė rusai” būtų per anksti. Bet sakyti, kad tokia versija yra nereali, būtų... irgi ne labai gerai.

Ypač kai tyrimo duomenys leidžia įtarti, kad dalis neteisėtų prisijungimų ir bandymų prisijungti buvo vykdyti iš užsienio valstybės ir per kitų institucijų administruojamas sistemas. Viešai taip pat nurodyta, kad galėjo būti pasinaudota vieno Nekilnojamojo turto registro duomenų gavėjo vartotojų prisijungimo duomenimis (tas pats source kaip ir aukščiau).

## **Pasižiūrim į platesnį kontekstą (kaip tikri CTI).**

Europos institucijos, NATO šalių organizacijos, viešasis sektorius, logistika, gynyba, transportas ir diplomatinės struktūros jau kurį laiką yra nuoseklūs Rusijai siejamų APT grupuočių taikiniai. CERT-EU 2025 m. grėsmių apžvalgoje nurodo, kad buvo stebėti 174 TA, o kibernetinis šnipinėjimas ir išankstinis pozicionavimas sudarė 38% stebėtos veiklos. Partnerių organizacijų analizėje viešasis administravimas sudarė 60% stebėtos veiklos (**<https://cert.europa.eu/publications/threat-intelligence/tlr2025/>**).

Tai dar nereiškia, kad Registrų centro incidentą padarė konkreti APT grupuotė.

Tai reiškia, kad valstybės registrų duomenys yra tokio tipo informacija, kuri domina ne tik sukčius. Ji gali dominti ir žvalgybą, ir hibridines operacijas.

## **O dabar apie realybę..**

**Rusijos GRU Unit 26165**, plačiau žinoma kaip **APT28 / Fancy Bear / Forest Blizzard**, bendrame CISA, NSA, FBI įspėjimuose aprašyti kaip vykdžiusi šnipinėjimo kampaniją prieš Vakarų logistikos ir technologijų organizacijas, susijusias su pagalbos Ukrainai koordinavimu, transportavimu ir pristatymu. Ten minimi metodai tokie kaip password spraying, spearphishing, Outlook NTLM ir Roundcube vulnerabilities, Microsoft Exchange pašto dėžučių teisių keitimas, EWS / IMAP duomenų rinkimas ir IP kamerų taikymas Ukrainoje bei pasienio NATO šalyse (**<https://www.cisa.gov/news-events/cybersecurity-advisories/aa25-141a>**).

![Fancy Bear grėsmių grupės profilis su veiklos ir taikinių žemėlapiu.](/assets/img/posts/substack/registru-centro-duomenu-vagyste-kai/02.webp)

Microsoft taip pat aprašė Rusijai siejamą **Void Blizzard / Laundry Bear**, kuris taikosi į NATO šalis, Ukrainą, valstybės institucijas, teisėsaugą, gynybą, transportą, žiniasklaidą, NGO ir sveikatos sektorių. Įdomiausia, kad dažnai naudojami ne "super nulaužimai" ar kažkokie 0day, ar šiaip CVSS 8-10 vulnerabilties, o pavogti prisijungimo duomenys, password sparying ir prieiga prie Exchange, SharePoint, Microsoft Graph ar kitų debesijų (**<https://www.microsoft.com/en-us/security/blog/2025/05/27/new-russia-affiliated-actor-void-blizzard-targets-critical-sectors-for-espionage/>**).

![Void Blizzard grėsmių grupės profilis su debesijos prieigos ir žvalgybos ryšiais.](/assets/img/posts/substack/registru-centro-duomenu-vagyste-kai/03.webp)

**Secret Blizzard / Turla** atveju Microsoft aprašė kampaniją prieš ambasadas Maskvoje, kur naudota AiTM (adversary-in-the-middle) ISP lygyje ir ApolloShadow malware. Galima sakyt, kad prieš diplomatinius ar valstybinius taikinius naudojami ne tik phishing laiškai, bet ir kur kas sudėtingesnė infrastruktūros kontrolė (**<https://www.microsoft.com/en-us/security/blog/2025/07/31/frozen-in-transit-secret-blizzards-aitm-campaign-against-diplomats/>**)

![Secret Blizzard grėsmių grupės profilis su taikiniais ir veiklos regionais.](/assets/img/posts/substack/registru-centro-duomenu-vagyste-kai/04.webp)

.***Kitaip tariant APT nebūtinai prasideda nuo nulaužto palydovo NASA.***

Kartais tai prasideda nuo pavogto slaptažodžio. Kartais nuo phishing laiško. Kartais nuo neprižiūrėtos prieigos. Kartais nuo sistemos, kurią visi žinojo, kad reikia sutvarkyti, bet kažkaip visada buvo “kitą ketvirtį” ir oops tas 7.8 CVSS ar prieš dvi dienas praneštas CVSS 10 palauks.

## **Kaip tai galima sudėlioti per Diamond Model (smagumo dalis CTI)**

Diamond Model of Intrusion Analysis incidentą vertina per keturis kampus t.y. **adversary**, **capability**, **infrastructure** ir **victim**. Kitaip sakant.. kas galėjo veikti, kokiais metodais, per kokią infrastruktūrą ir prieš kokį taikinį.

Šiuo atveju viešai žinomas paveikslas kol kas atrodytų taip:

**Victim (auka)** - Registrų centro valdomi registrai, ypač Nekilnojamojo turto ir Juridinių asmenų registrų duomenys. Tai nėra paprasta duomenų bazė. Tai valstybės infrastruktūra, kurioje matosi turtas, juridiniai ryšiai, įmonės ir ekonominiai santykiai.

**Capability (metodai / galimybės)** - Kol kas viešai kalbama apie galimą neteisėtą prisijungimą, pasinaudojimą vartotojų prisijungimo duomenimis ir masinį registro išrašų formavimą. Tai labai dera su tuo, ką dažnai matome realiose kampanijose. Kartais pakanka prieigos, teisėtų funkcijų ir per mažai kontrolės.

**Infrastructure (infrastruktūra)** -Viešai nurodyta, kad dalis veiksmų galėjo būti vykdyti iš užsienio valstybės ir per kitų institucijų administruojamas sistemas, atakose dažnai naudojama ne “tiesioginė” infrastruktūra, o tarpiniai šuoliai, kompromituotos sistemos, teisėtos paskyros ar trečiųjų šalių prieigos.

**Adversary (veikėjas)** - Čia reikia būti atsargiems (CTI remiasi tik tūrimais duomenimis jei ką..). Viešos atribucijos nėra (pakolkas). Tačiau dėl taikinio pobūdžio, geopolitinio konteksto ir panašių APT TTPs, rusiškų arba rusakalbių kibernetinių grupuočių versija yra realistiška tyrimo kryptis (tikėtina). Bet atribucija nėra “man atrodo”. Atribucija yra logai, infrastruktūra, TTP, prieigų keliai, forensic analyzės ir žvalgybinis kontekstas.

Šiaip Linkedin’e visi gali būt žvalgybos analitikais, bet tik iki pirmo klausymo “o kur įrodymai”?

![Deimanto modelis sieja priešininką, infrastruktūrą, gebėjimus ir auką.](/assets/img/posts/substack/registru-centro-duomenu-vagyste-kai/05.webp)

## **Jei žiūrim per Cyber Kill Chain**

Lockheed Martin Cyber Kill Chain modelis padeda incidentą vertinti kaip seką t.y. nuo reconnaissance, weaponization, delivery, exploitation, installation, command & control ir actions on objectives. Tai nėra tobulas modelis kiekvienam incidentui, bet jis gerai padeda užduoti teisingus klausimus (**<https://www.lockheedmartin.com/en-us/capabilities/cyber/cyber-kill-chain.html>**).. ir čia pasijungia mano buvusio Komisaro Inspektoriaus galva, kai tekdavo daryt tyrimus su nusikaltimais elektroninėje erdvėje ir ypač su duomenų bazėm (tikiuosi kažkas iš tyrėjų perskaitys ir pasinaudos klausimais).

**Reconnaissance** - Ar buvo naudoti pavogti prisijungimo duomenys? Ar buvo password spraying? Ar buvo phishing? Ar veikta per trečiųjų šalių prieigas? Ar naudotos kitų institucijų sistemos kaip tarpinis kelias?

**Exploitation -** Ar TAs pasinaudojo tik teisėtomis funkcijomis su neteisėtai gauta prieiga, ar buvo ir techninis pažeidžiamumas? Tai labai svarbus skirtumas. Nes viena yra “nulaužė sistemą”, kita yra kai sako “prisijungė kaip teisėtas naudotojas, tik tas naudotojas neturėjo būti jis”.

**Persistence -** Ar buvo bandyta išlaikyti prieigą? Ar buvo kuriami nauji naudotojai, keičiami slaptažodžiai, teisės, API prieigos, sesijos ar autentifikavimo mechanizmai?

**Command & Control -** Ar buvo techninė kontrolės infrastruktūra? Ar veikla vyko per įprastus protokolus ir teisėtas sistemas, kad atrodytų kaip normalus naudojimas?

**Actions on Objectives -** Galutinis tikslas, panašu, buvo duomenų nuskaitymas / kopijavimas. Ir čia svarbiausias klausimas turėtų būt ar tai buvo vienkartinis duomenų “nusiurbimas”, ar ilgesnė, lėtesnė, sunkiau pastebima veikla?

***Nes blogiausias scenarijus dažnai nėra tas, kai kažkas labai garsiai įsilaužia.***

***Blogiausias scenarijus yra tas, kai kažkas tyliai naudojasi prieiga ilgą laiką, o organizacija sužino tik tada, kai klausimas jau nebe “ar įvyko”, o “kiek išėjo”***

![Cyber Kill Chain etapai nuo žvalgybos iki tikslo įgyvendinimo.](/assets/img/posts/substack/registru-centro-duomenu-vagyste-kai/06.webp)

## **Ką verta daryti dabar**

Elementarūs dalykai..

**Gyventojams** tai tikrinti informaciją tik oficialiuose šaltiniuose, nespausti įtartinų nuorodų (prisimenu Citybee leak’ą, kai kažkas vesdavo savo duomenis... nu cmon), neatskleisti prisijungimo duomenų telefonu ar el. paštu, neskubėti vykdyti “labai skubių” prašymų, naudoti MFA ir stebėti banko sąskaitas bei galimus naujus įsipareigojimus.

**Įmonėms** tai klasika, kaip visad tik truputi smarkiau ruoštis įtikinamesnėms socialinės inžinerijos atakoms. Ypač prieš buhalteriją (MiTM), administraciją, vadovus, teisininkus, NT, tiekėjus ir klientų aptarnavimą.

Institucijoms (manau čia nereik aiškint, bet..) žiūrėti ne tik į vieną incidentą, o į visą prieigų grandinę.

Kas turi priegą? Kodėl turi prieigą? Kada paskutinį kartą ji peržiūrta? Ar prisijungimai stebimi? Ar masinis duomenų nuskaitymas kelia alert’us SOC’ui ir jis keliasi 2h nakties šeštadieni? Ar Third-party turi MFA? Ar įmanoma aptikti, kad teisėta paskyra staiga pradeda siurbt duomenys, ir kokie alert’ai turi būt, kad SOC’as keltųsi 2h nakties tikrint?

Elementarus priegos monotiringas, auditai, third-party kontrolės, incidentų valdymas / aptikimas...ir visiem labai smagus klausimas “Kas iš tikrųjų turi priegą prie mūsų sistemų?”.

Nes jaučiu.. bus tokių įmonių kur “Signalizaciją įdėjome tik po vagystės” (nu šits nepadeda..)
