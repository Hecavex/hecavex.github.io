---
title: "ClickFix atakos: netikri CAPTCHA patikrinimai, PowerShell ir aptikimas"
card_title: "ClickFix: nuo netikro CAPTCHA iki PowerShell"
description: "Kaip ClickFix atakos netikrais CAPTCHA patikrinimais priverčia auką paleisti PowerShell ir kokius aptikimo bei reagavimo signalus turi matyti SOC."
seo_title: "ClickFix atakos: CAPTCHA, PowerShell ir aptikimas"
seo_keywords:
  - "ClickFix ataka"
  - "ClickFix PowerShell"
  - "netikras CAPTCHA"
  - "socialinės inžinerijos ataka"
  - "žalingos komandos vykdymas"
date: 2026-06-05T20:56:58.749Z
lang: lt
translation_key: substack-clickfix-kodel-siuolaikiniai-ta-nebeiesko
permalink: /lt/tyrimai/clickfix-kodel-siuolaikiniai-ta-nebeiesko/
redirect_from:
  - /lt/research/clickfix-kodel-siuolaikiniai-ta-nebeiesko/
author: deividas-lis
content_type: technical-analysis
confidence: moderate
tlp: clear
categories: ["malware", "social-engineering"]
tags: ["ClickFix", "pradinė prieiga", "PowerShell", "socialinė inžinerija"]
featured: true
scope: "ClickFix vykdymo grandinės, infrastruktūros, aptikimo galimybių ir organizacinės rizikos analizė."
limitations: "Kampanijų įrankiai ir komandos kinta. Pateikti pavyzdžiai nėra baigtinis visų ClickFix variantų sąrašas."
key_findings:
  - "Atakos sėkmė priklauso nuo įtikinamos instrukcijos, o ne programinio pažeidžiamumo."
  - "Naršyklės ir shell proceso ryšys suteikia stipresnius aptikimo signalus nei pavieniai domenai."
  - "ClickFix yra ne tik awareness, bet ir vykdymo kontrolės bei attack-surface problema."
image:
  path: /assets/img/posts/substack/clickfix-kodel-siuolaikiniai-ta-nebeiesko/01.webp
  alt: "ClickFix. Kodėl šiuolaikiniai TA nebeieško pažeidžiamumų, o ieško žmonių"
  thumbnail: /assets/img/posts/substack/clickfix-kodel-siuolaikiniai-ta-nebeiesko/01-card.webp
  width: 1600
  height: 900
source_url: https://deivlis.substack.com/p/clickfix-kodel-siuolaikiniai-ta-nebeiesko
---
*Per beveik dešimtmetį dirbant Cyber Crime Intelligence ir Cyber Threat Intelligence (aka Kibernetinių nusikaltimų žvalgyboje ir Kibernetinių grėsmių žvalgyboje.. realiai tas pats tik kitas.. rankoje) teko matyti daug skirtingų grėsmių etapų kaip pvz.:*

```
- Exploit kit'ai
- Office macros
- "Atidaryk fail'ą su sąskaita faktūra"
- Ransomware "industrializacija"
- MFA fatigue, session hijacking, infostealer logų ir Initial Access Broker'ių ekonomika
```

*o… dabar turime ClickFix.*

*Iš pirmo žvilgsnio pats ClickFix atrodo labai paprastas (na ir tikrai daug kam IT atrodo juokingas). Paprastam vartotojui (na visiem realiai kas naudojasi kompiuteriu ir internetu.. jei ne ten nueina) parodomas netikras klaidos, CAPTCHA ar verifikacijos langas, jis įtikina vartotoją nukopijuot komandą, atsidaryt Windows Run, PowerShell, Windows Terminal ar beleką kas gali daryt execution, įklijuot komandą.. ir važiuojam su Enter.*

*Realiai viskas. Jokių zero-day. Jokių exploit chain. Jokių sudėtingų privilege escalation. Tiesiog žmogus, naršyklė, clipboard ir… blogas sprendimas.*

*Ir vis dėl to būtent ši technika verta rimtos CTI analizės.*

*ClickFix man asmeniškai įdomus ne todėl, kad tai magiškai techniškai super duper sudėtinga ataka (…kur sėdi savaitę ir dar nesupranti per kur galai), o realiai priešingai, nes labai aiškiai parodo, kur juda šiuolaikiniai TAs. Na pavadinkim ne prie techninio kažkokio sudėtingumo, o juda link ekonomiškai efektyvių atakų.*

*Kitaip tariant, TAs suprato, kad pigiau ne apeit sistemą, o paprašyt žmogaus pačiam ją kompromituot. Ir… dažnu atveju žmogus sutinka, o kartais net labai tvarkingai, pagal pateiktas instrukcijas.*

![ClickFix atakos apžvalga rodo, kaip vartotojo veiksmas tampa kodo vykdymo sluoksniu.](/assets/img/posts/substack/clickfix-kodel-siuolaikiniai-ta-nebeiesko/01.webp)

---

## Kodėl apie ClickFix Lietuvoje kalbama per mažai?

Čia jau mano asmeninė nuomonė.

Lietuvos cyber erdvėje vis dar labai daug kalbama apie klasikinius phishing, slaptažodžius, MFA, "nespausk nuorodų", "neatidaryk priedų", "įsijunk 2FA" *(na okay, sutinku ir pats kalbu kartais…)*.

Realiai iš šitų dalykų viskas svarbu.

Bet.. peržiūrint į komentarus ar diskusijas *(akis tiesiai į Registrų Centro incidentą)..* diskusijos komentarai atrodo taip, lyg 2026 metais vis dar bandom laimėt 2018 metų karą su TAs.

Bendraujant su CTI *(na bent tais kas daro CTI ne Lietuvoje)* ClickFix jau seniai nėra toks nišinis dalykas. Microsoft, Proofpoint, ESET, Rapid7 ir kiti tyrėjai per 2024 - 2026 metus aprašė skirtingus ClickFix naudojimo atvejus, nuo TA571 ir ClearFake iki Booking.com apsimetimo kampanijų, WordPress kompromitavimo, infostealerių pristatymo ir didelio masto TDS valdomų operacijų. (Proofpoint 2024, Microsoft 2025, ESET 2025 ir Rapid7 2026)

O kas vyksta Lietuvoje?

Viešoje erdvėje apie tai vis dar matau mažai gilesnės diskusijos *(arba laikas pradėt lankytis InfoSec meet’uose..).*

Taip, kartais pasirodo bendro pobūdžio perspėjimai. Taip, kažkas pasidalina "neveskite komandų iš interneto" tipo įrašu. Bet ClickFix retai aptariamas kaip platesnis reiškinys.. kaip cybercrime ekonomikos pokytis, kaip human execution model, kaip infostealer ekosistemos įėjimo taškas, kaip CISO lygio rizikos signalas.

Ir būtent čia *(mano manymu)* slypi problema.

ClickFix nėra tik "dar viena phishing technika". Čia jau yra signalas, kad TAs juda link modelio, kuriame žmogus tampa aktyvia kompromitavimo proceso dalim *(nu čia tie kur unintentional insider threat’ai).* Ne auka, kuri paspaudžia phishing’o nuorodą, o žmogus, kuris pats paleido komandą.

Labai modernu, beveik kaip self-service incident response, tik šiuo atvėju incidentą sukuria pats žmogus.

![Diskusijos scena prieš grėsmių, kurios jau vykdo kodą, techninę schemą.](/assets/img/posts/substack/clickfix-kodel-siuolaikiniai-ta-nebeiesko/02.webp)

---

## Kas yra ClickFix?

ClickFix jei trumpai tai yra socialinės inžinerijos technika, kurioje vartotojas įtikinamas pats įvykdyti tam tikrą kenkėjišką komandą savo įrenginyje.

**Scenarijai dažniausiai tokie:**

```
- Vartotojas patenka į svetainę:
  - Kompromituota teisėta svetainė
  - Phishing puslapis
  - Malvertising kampanijos landing page
  - Netikras dokumento peržiūros puslapis
```

**Kas vyksta toliau patekus į tokį atvejiį? Elementaru.. rodoma pranešimai** ***(dažniausiai)*****:**

```
"Verify you are human."
"Browser check failed."
"Cloudflare verification required."
"Document cannot be displayed."
"Fix required to continue."
```

**Žmogui pasiūlomas labai greitas "sprendimas":**

```
Paspausk Windows + R
Paspausk CTRL + V
Paspausk Enter
```

Jei tau jau macOS ar Linux, tai scenarijus bus pritaikytas pagal OS. ESET H1 2025 ataskaita pažymi, kad ClickFix jau taikytas ne tik Windows, bet ir Linux bei macOS naudotojams, o kai kurios kampanijos nukreipė aukas į skirtingas instrukcijas pagal operacinę sistemą. ([ESET Threat Report H1 2025](https://web-assets.esetstatic.com/wls/en/papers/threat-reports/eset-threat-report-h12025.pdf))

**Techniškai viskas gan paprasta:**

```
Landing page turi JavaScript.
JavaScript laukia varototojo veiksmų.
Vartotojas paspaudžia "Verify", "Fix", "Continue" ar kažkokį panašų mygtuką
Malicious command nukopijuojama į clipboard
```

Tada vartotojui parodomos instrukcijos kaip paleist komandą.

Microsoft aprašė, kad ClickFix gali naudoti navigator.clipboard.writeText(), kai komanda nukopijuojama į operacinės sistemos clipboard. Senesni puslapiai gali dar naudot document.execCommand(), na jau šiai dienai deprecated, bet dar matomas (Microsoft, 2025).

Vartotojas galvoja, kad "sprendžia problemą", o realybėje jau paleistas execution.

Šitoje vietoje ClickFix yra genialus dalykas, TAs neprašo vartotojo (aukos) atsisiųst kažkokį failą *(kuris bus 100% blokuotas)*, o prašo "susitvarkyt problemą".

Na žmonės mėgsta tvarkyt problemas, ypač jei problema dega, trukdo kažką pasiekt *(puslapis, paskyra ar dar kas)*.

Trukdo darbui - reik greit spręst, geriausia šią sekundę.. negi rašysi į IT support’ą ir lauksi pakol tau sutvarkys kitą dieną.. Kas čia blogo pasidarys jei pats susitvarkysiu.

![ClickFix atakos grandinė nuo netikros svetainės klaidos iki kenkėjiško kodo vykdymo.](/assets/img/posts/substack/clickfix-kodel-siuolaikiniai-ta-nebeiesko/03.webp)

---

## Kodėl ClickFix toks shady velnias ir apgaulingas?

Okay ClickFix nėra efektyvus todėl, kad vartotojai kvaili *(čia labai pigus paaiškinimas, jei kur matėt.. tai pritaginkit mane)*. Jis efektyvus todėl, kad išnaudoja normalų žmogaus elgesį t.y. žmonės nori tęsti darbą, atidaryt dokumentus, patekt į puslapį, greit užbaigt darbus kuriuos pradėjo. Ir kai pati "sistema" sako .. "atlik šiuos tris veiksmus", daug.. žmonių tai padaro. Ypač jei iššokęs langas yra pažįstamas ypač kai CAPTCHA tapo mūsų rutinos dalimi, Claudflare patikrinimai vyksta dažnai… o žmonės nustojo skaityt kas vyksta, tiesiog automatu atliekam.

ClickFix būtent tai ir išnaudoja. Jis užpuola žmogu per rutiną, o kaip daug kas žino rutina yra labai stiprus ginklas.

Internetas realiai metų metus mus mokė spaust "I’m not a robot", bet TAs tiesiog prie šito pridėjo kelis naujus žingsnius *"Windows + R" → "CTRL + V" → "Enter" →* *Congratz*.. dabar jūs tikrai ne robotas, o tiesiog paleidot malware.

ESET savo H1 2025 ataskaitoje labai tiksliai aprašė šį fenomeną *"vartotojai priprato prie įvairių reCAPTCHA formų, todėl nedaugelis suabejoja naujo tipo "challenge", net jeigu jis prašo kopijuoti ir paleisti kažką savo įrenginyje" (*ESET, 2025).

Na čia yra social engineering aukso vidurys.. *"pakankamai keista, kad sukeltų veikmą, bet pakankamai pažįstama, kad nesukeltų panikos".*

![Netikra CAPTCHA patikra įtikina vartotoją nukopijuoti ir paleisti komandą.](/assets/img/posts/substack/clickfix-kodel-siuolaikiniai-ta-nebeiesko/04.webp)

---

## Techninė anatomija. Kas vyksta po "Verify"?

**ClickFix techninė grandinė skiriasi pagal kampaniją, bet tipinis modelis dažnai atrodo taip:**

```
Vartotojas paspaudžia "Verify“ arba "Fix“.
Landing page JavaScript nukopijuoja komandą į clipboard.
Vartotojui parodoma instrukcija atsidaryti Run dialog, PowerShell arba Terminal.
Vartotojas įklijuoja komandą.
Komanda paleidžia powershell, mshta, cmd, curl, wscript, rundll32 arba kitą native execution įrankį.
Pirmasis stager atsisiunčia antrą etapą.
Antras etapas gali būti obfuscated PowerShell, HTA, JavaScript, VBS, MSI ar PE failas.
Toliau seka loader, infostealer, RAT, backdoor arba papildomi payload.
```

Proofpoint 2024 m. aprašė TA571 kampaniją, kur HTML attachment imitavo Microsoft Word / OneDrive tipo puslapį. "How to fix" mygtukas nukopijuodavo Base64-encoded PowerShell komandą į clipboard, o vartotojui buvo pateikiamos instrukcijos atsidaryti PowerShell ir ją paleisti. Proofpoint taip pat stebėjo ClearFake grandines, kuriose kompromituotos svetainės įkeldavo malicious scripts, naudodavo TDS filtravimą, PowerShell grandines, sandbox check’us per WMI ir galiausiai galėjo pristatyti Lumma Stealer, Amadey, XMRig miner, clipboard hijacker ir kitus payload’us. (Proofpoint, 2024)

Šitoje vietoje atsiranda svarbus momentas, kad ClickFix nėra malware, o ClickFix yra execution pattern.

Tai reiškia, kad tas pats social engineering modelis gali pristatyt įvairius *(skirtingus)* payload’us.

Šiandien "Lumma", rytoj "StealC", poryt "NetSupport RAT", o po savaitės jau custom loader’is… na, o po mėnesio jau ransomware pre-stage.

Todėl kalbėt apie ClickFix tik kaip apie "fake CAPTCHA phishing" yra per siaura, tai yra user-assisted execution framework.. šitas skamba truputi rimčiau, ir mažiau patogiai security awareness prezentacijom… na realybė nėra toki patogi gi.

![Po mygtuku Verify paslėpta vykdymo grandinė su iškarpine, Run langu ir PowerShell.](/assets/img/posts/substack/clickfix-kodel-siuolaikiniai-ta-nebeiesko/05.webp)

---

## Realios kampanijos. Nuo TA571 iki Booking.com

Kad ClickFix neatrodytų kaip teorinė grėsmė, verta pažiūrėti į realias kampanijas.

Proofpoint 2024 m. aprašė vieną iš ankstyvų viešai dokumentuotų ClickFix tipo technikų. TA571 kampanijoje buvo siųsti HTML priedai, kurie imitavo Microsoft Word. Vartotojui buvo rodoma klaida, kad trūksta "Word Online" plėtinio, ir siūlomas "How to fix" mygtukas. Paspaudus jis nukopijuodavo PowerShell komandą, o toliau vartotojas pats inicijuodavo infekcijos grandinę. Proofpoint nurodė, kad TA571 naudojo šią techniką nuo 2024 m. kovo 1 d., kampanijoje su daugiau nei 100 000 žinučių, taikant į tūkstančius organizacijų globaliai. (Proofpoint, 2024)

ClearFake pavyzdžiuose Proofpoint matė kompromituotas svetaines, malicious JavaScript, EtherHiding per Binance Smart Chain contracts, Keitaro TDS filtravimą ir kelių etapų PowerShell grandinę. Vienoje grandinėje PowerShell flushino DNS cache, išvalė clipboard, rodė decoy žinutę, atsisiuntė papildomus PowerShell scriptus, atliko WMI pagrįstą sandbox / VM check’ą pagal system temperature duomenis, o vėliau vedė į AES-encrypted PowerShell ir ZIP paketą su legitimiais signed executables bei trojanized DLL side-loading *(nekenčiu DLL side-loading.. just me).*(Proofpoint, 2024)

***Čia nėra, kad "vartotojas paspaudė blogą mygtuką", o kelių etapų pipeline.***

Microsoft 2025 m. aprašė Storm-1865 kampaniją, kuri imitavo Booking.com ir taikėsi į hospitality sektorių. El. laiškai apsimesdavo Booking.com, naudodavo temas apie neigiamus svečių atsiliepimus, paskyros verifikaciją, potencialių svečių užklausas ar online promotion galimybes. Paspaudus nuorodą, auka patekdavo į puslapį su netikru Booking.com puslapiu ir fake CAPTCHA. Ši CAPTCHA naudojo ClickFix logiką t.y. vartotojui nurodoma atsidaryti Windows Run ir paleisti komandą, kuri per **mshta.exe** inicijuoja malicious code download. (Microsoft, 2025)

Microsoft nurodė, kad ši kampanija pristatė kelias commodity malware šeimas, tarp jų XWorm, Lumma Stealer, VenomRAT, AsyncRAT, Danabot ir NetSupport RAT. Visi šie payload’ai turėjo credential theft, financial data theft ar fraud-relevant funkcijas *(kaip nekeista.. pagalvojus apie Registrų Centrą.. gal čia ClickFix iš vieno iš APT???).(Microsoft, 2025)*

Iš CTI pusės čia labai svarbu ne tik malware pavadinimai, o svarbiausia tai, kad ClickFix tampa moduline pristatymo technika, kurią skirtingi aktoriai gali jungti prie skirtingų monetizacijos modelių. Na pavadinkim tai… kaip adapteris. Tik vietoje USB-C į HDMI turime fake CAPTCHA į infostealer.

![ClickFix kampanijų žemėlapis jungia prieigos kanalus, netikras CAPTCHA ir kenkėjiškas šeimas.](/assets/img/posts/substack/clickfix-kodel-siuolaikiniai-ta-nebeiesko/06.webp)

---

## WordPress, Ghost CMS ir teisėtų svetainių problema

ClickFix tampa dar pavojingesnis tada, kai jis ateina ne iš akivaizdžiai įtartino domeno, o iš teisėtos svetainės.

Rapid7 2026 m. aprašė didelio masto kampaniją, kurioje buvo kompromituota daugiau nei 250 WordPress svetainių. Priežastys galėjo būti silpni admin credentials, pasenę pluginai, temos ar kiti plačiai išnaudojami WordPress pažeidžiamumai. Kompromituotose svetainėse buvo įterpiamas fake Cloudflare CAPTCHA elementas. Vartotojui svetainė atrodydavo normali, bet pirmo apsilankymo metu buvo pateikiamas ClickFix tipo raginimas nukopijuoti ir paleisti komandą per "Windows Run". (Rapid7, 2026)

TechRadar apibendrindamas Rapid7 tyrimą nurodė, kad kampanija galėjo prasidėti 2025 m. gruodį ir paveikė įvairias svetaines, įskaitant regioninę žiniasklaidą, smulkų verslą ir net JAV Senato kandidato puslapį. (TechRadar / Rapid7, 2026)

Rapid7 taip pat pažymėjo, kad deobfuscavus JavaScript snippets buvo galima hunting’u atrasti daugiau kompromituotų svetainių, JavaScript hosting domenų ir fake CAPTCHA implant hosting domenų. (Rapid7, 2026)

Na čia jau mano CTI įsijungia.. jeigu matai tik vieną compromised website.. gali pagalvot **"wow incidentas izoliuotas → blocklist"**, bet jei matai JS implantų šablonus, hosting patterns, pasikartojantį obfuscation, locale-based instruction generation ir tą pačią command delivery logiką, pradedi matyti kampaniją.

Tai yra šioks toks skirtumas tapr security alert’o ir intelligence finding.

Na kaip ir dalis organizacijų vis dar mano, kad jeigu svetainė "legit" tai ji yra saugi. Skamba gražiai.. čia kaip vaikystėje tikėti, kad jei kortelė *(pokemonų)* atrodo labai graži, tai ji kažko verta *(per daug youtube pokemon card unbox’ingų žiūriu)*.

ClickFix per kompromituotas svetaines šį mitą tvarkingai palaidoja.

Legit svetainė gali tapti malicious delivery surface. Ir tai ypač aktualu organizacijoms, kurios turi daug marketinginių landing page’ų, WordPress instaliacijų, senų microsite’ų, event puslapių ar pamirštų projektų domenų. Tie puslapiai vadovybei dažnai atrodo kaip "marketingo turtas", o TA jie atrodo kaip nemokamas distribution network.

![Teisėtos ir sukompromituotos svetainės palyginimas parodo netikrą patikros sluoksnį.](/assets/img/posts/substack/clickfix-kodel-siuolaikiniai-ta-nebeiesko/07.webp)

---

## DriveSurge ir TDS. Kai ClickFix tampa infrastruktūros verslu

2026 m. birželį buvo aprašyta DriveSurge kampanija, kuri parodė, kaip ClickFix gali būti naudojamas masinio masto Initial Access Broker operacijoje. Pagal Silent Push tyrėjų duomenis, kuriuos apibendrino TechRadar, DriveSurge naudojo tūkstančius kompromituotų teisėtų svetainių. Į jas buvo įterpiami lightweight malicious scripts, kurie siųsdavo lankytojų duomenis į zTDS Traffic Distribution System. Ten lankytojai būdavo profiliuojami, ir tik tie, kurie atrodė vertingi, gaudavo ClickFix arba FakeUpdates overlay. (TechRadar / Silent Push, 2026)

Botams ir tyrėjams buvo rodomas normalus svetainės turinys, o tikriems taikiniams social engineering overlay.

Čia jau atsiranda brandos indikatorius, kai ClickFix tampa ne vienu puslapiu, o visa infrastruktūra t.y. nuo cloaking, geo-fencing, profiliavimo ir so on.

TDS leidžia operatoriams filtruoti srautą, vengti analizės, valdyti kampanijų efektyvumą, skirtingoms aukoms rodyti skirtingus lure’us ir rotuoti delivery logiką. Vieniems vartotojams gali būti pateikiamas ClickFix. Kitiems FakeUpdates. Dar kitiems nieko.

Kitaip tariant toks modelis DriveSurge ir TDS patapo sakyčiau marketing funnel’iu.

Skamba marketingistam juokingai, bet.. kodėl? **O bet tačiau nes:**

```
Lead generation.
Segmentation.
Conversion optimization.
```

Tik.. kad vietoj produkto pardavimo šiuo atveju turime backdoor diegimą ir access resale.

Manau jei toks modelis ateitų ar parodyčiau kokiai marketing komandai.. tikriausiai pasakytų, kad "gera funnel architektūra" *(reik susirąst kokį marketingistą komentarui…but anyway).*

Jei tokį modelį parodom CISO… tai jau pasidaro mažiau juokinga.

DriveSurge tipo kampanijos rodo, kad ClickFix gali būti naudojamas ne tik atskirai aukai kompromituoti, bet kaip scalable access acquisition model.

Tai jau tiesiogiai siejasi su Initial Access Broker ekonomika.

ClickFix → Backdoor → Access resale → Data theft / wire fraud / ransomware.

Šitoje vietoje jau nebe "fake CAPTCHA", o visas supply chain’as, tik tiekimas ..kad ir kaip skamba nusikalstamas.

![DriveSurge operacijos schema nuo sukompromituotos svetainės iki galutinio kenkėjiško krovinio.](/assets/img/posts/substack/clickfix-kodel-siuolaikiniai-ta-nebeiesko/08.webp)

---

## Malware šeimos. Svarbios, bet ne pagrindinė istorija

ClickFix kompanijos yra daug malware šeimų… "Lumma", "Vidar", "StealC", "DanaBot", "DarkGate", "Xworm", "VenomRat", "AsyncRat" ir visi kiti mandri dalykai, na ir kur kas be ko ransomware pre-stage’riai.

ESET H1 2025 ataskaita nurodo, kad ClickFix jau buvo naudojamas pristatyti infostealerius, ransomware, RAT, cryptominers, post-exploitation tools ir net custom malware iš nation-state-aligned aktorių *(čia vėl žiūriu į Registrų Centro duomenų nutekėjimą…)*. (ESET, 2025)

Tačiau po beveik dešimtmečio CTI srityje man malware pavadinimas dažnai nėra pagrindinis klausimas.

Malware keičiasi, o operatoriai išlieka tie patys.

Jei šiandien kampanija platina "Lumma", rytoj gali pereit prie "StealC"…\
Jei vienas loader’is tampa per daug matomas, affiliate’ai pereina prie kito..

Todėl jau žiūrint iš CTI pusės, pagrindinis klausimas nėra tik "kokia malware šeima?". o pagrindiniai klausimai turi būt "Kas valdo infrastruktūrą?", "Ar tai vienas operatorius, ar affiliate?", "Ar ClickFix landing pages generuojami builder’iu?", "Ar yra kampanijos šablonų?", "Ar tie patys JS implantai kartojasi kituose domenuos?", "Ar naudojamas tas pats TDS?", "Ar payload hosting sutampa su kitomis kompanijomis?", "Ar Telegram kanalai, wallet’ai, C2 ar hosting tiekėjai rodo persidengimą?".

Malware / infostealer’is ir visi kiti dalykai yra tik realiai simptomai.

Infrastruktūra ir monetizacija dažnai yra tik diagnozė.

Ir šitoje vietoje dažnai pastebiu, kad straipsniai sustoja per anksti… Pasako "Lumma" that’s it.. bet "Lumma" yra tik paskutinė dalis visoje grandyje.

Jei nori suprast grėsmę, turi suprast kelią iki "Lumma" ir kelią po "Lumma", nes po "Lumma" gali būt ir Initial Access Broker, o po access broker gali būt ransomware, po ransomware gali būt Board meeting su klausimu ***"Kodėl mes apie tai nežinojome ankščiau?"***. Ir tada visi staiga prisimena, kad PowerPoint prezentacijoje buvo parašyta ***"CYBER RISK IS MANAGED".***

Gražu.

![ClickFix centre esantis kenkėjiškų programų ekosistemos grafas.](/assets/img/posts/substack/clickfix-kodel-siuolaikiniai-ta-nebeiesko/09.webp)

---

## Kaip atrodo tikras CTI tyrimas gavus vieną ClickFix URL?

Čia yra vieta, kur dažniausiai matosi skirtumas tarp IOC kolekcionavimo ir realios žvalgybos.

**Gavus vieną ClickFix URL, silpnas tyrimas dažnai atrodo taip:**

```
Paimamas domenas.
Paimamas IP.
Paimamas hash.
Viskas įdedama į blokavimo sąrašą.
```

Ataskaita baigta.  
Labai tvarkinga.  
Labai greita.  
Labai paviršutiniška.

**O jau normalus tyrimas pereina taip..** Pirmas klausimas nėra "ką blokuoti?" Pirmas klausimas yra "ką šis artefaktas atveria?" Nuo vieno URL galima daryti kelis pivoting sluoksnius:

```
Pirmas sluoksnis yra domenas.
Kada registruotas?
Koks registrar?
Ar naudojamas privacy protection?
Ar domenas šviežias?
Ar istorijoje matyti ankstesni DNS įrašai?
Ar domenas turi sibling domains pagal naming pattern?
Ar tas pats registratorius, TLD ar naming convention kartojasi kituose lure’uose?

Antras sluoksnis yra DNS ir hosting.
Kokie A, AAAA, CNAME, NS įrašai?
Ar yra shared hosting?
Ar matosi bulletproof hosting požymių?
Ar domenas naudoja Cloudflare tik kaip reverse proxy?
Ar realus origin paslėptas, ar vis dar išduodamas per istorinius DNS?

Trečias sluoksnis yra TLS.
Koks sertifikato issuer?
Kokie SAN įrašai?
Ar sertifikatas self-signed?
Ar Let's Encrypt issued kartu su kitais panašiais domenais?
Ar cert transparency rodo papildomus susijusius hostus?

Ketvirtas sluoksnis yra HTML ir JavaScript.
Kokie scriptai įkeliami?
Ar JavaScript obfuscated?
Ar yra anti-debugging?
Ar yra locale detection?
Ar yra browser / OS detection?
Ar komanda hardcoded, ar traukiama iš remote resource?
Ar clipboard copy vyksta per navigator.clipboard.writeText()?
Ar naudojamas hidden iframe, postMessage, event listener ar paprastas click handler?

Penktas sluoksnis yra command analysis.
Ką komanda paleidžia?
PowerShell?
mshta?
cmd?
curl?
wscript?
rundll32?
Ar naudojamas Base64?
Ar yra compressed / encrypted payload?
Ar command line trumpinama dėl Windows Run MAX_PATH ribojimų?
```

*Microsoft analizėje pažymima, kad Windows Run dialog yra trusted shell input UI Windows Explorer kontekste, o jo įvestis turi praktinį ilgio limitą apie 259 simbolius, todėl kai kurios ClickFix kampanijos turi prisitaikyti prie šio apribojimo. (Microsoft, 2025)*

```
Šeštas sluoksnis yra payload hosting.
Kur kreipiasi stager?
GitHub?
Discord CDN?
Cloudflare Workers?
Compromised website?
Raw IP?
Paste service?
Object storage?
Telegram?

Septintas sluoksnis yra post-compromise.
Ką payload vagia?
Credentials?
Cookies?
Session tokens?
Crypto wallets?
Outlook data?
Browser profiles?
VPN artefaktus?
Ar yra persistence?
Ar yra C2?
Ar yra exfil endpoint?
Ar yra Telegram bot token?
Ar yra cryptocurrency wallet?

Aštuntas sluoksnis yra campaign clustering.
Ar tie patys komponentai kartojasi kitur?
Ar favicon hash sutampa?
Ar JavaScript struktūra sutampa?
Ar fake CAPTCHA template sutampa?
Ar instrukcijų vertimai sutampa?
Ar naudojami tie patys CSS class names?
Ar tie patys image assets?
Ar tas pats obfuscatorius?
Ar tas pats TDS?
```

Būtent šioje vietoje iš vieno URL galima išauginti tyrimą į visą infrastruktūros klasterį.

![CTI pivoting grafas plečia vieną ClickFix URL į domenų, sertifikatų ir infrastruktūros ryšius.](/assets/img/posts/substack/clickfix-kodel-siuolaikiniai-ta-nebeiesko/10.webp)

---

## Kodėl IOC-driven CTI tampa nepakankamas?

Tai viena svarbiausių pamokų.

Daugelis organizacijų vis dar matuoja CTI funkcijos brandą pagal IOC kiekį.

```
Kiek domenų surinkome?
Kiek IP pridėjome?
Kiek hash’ų išsiuntėme SOC komandai?
Kiek feedų integravome?
Kiek indikatorių įkėlėme į SIEM?
```

Visa tai turi vertę, bet tik ribotą.

ClickFix labai aiškiai parodo IOC-centric modelio problemą:

- Domenai keičiasi greitai.
- Payload’ai keičiasi greitai.
- Komandos keičiasi greitai.
- TDS sprendžia, kas ką matys.
- Tyrėjams rodomas vienas turinys.
- Aukoms rodomas kitas.

Kai kurios kampanijos naudoja kompromituotas teisėtas svetaines, kurios pačios nėra "malicious domain" klasikine prasme…Ką tada blokuosi? Pusę interneto? Geras planas.

Tik vartotojai gali nesuprasti, kodėl vat užblokuota ta ir ta.

Todėl brandi CTI funkcija turi judėti nuo IOC prie elgsenos ir infrastruktūros modelių.

***Reikia suprasti ne tik "kas bloga", bet reikia suprasti ir "kaip blogis veikia".***

**Šiuo atveju svarbu analizuoti:**

```
ClickFix lure modelius.
Clipboard abuse patterns.
Browser-to-terminal execution flow.
TDS naudojimą.
Compromised CMS patterns.
Payload hosting choices.
Malware-as-a-Service ryšius.
Access broker monetizaciją.
Attribution-lite clustering pagal techninius artefaktus.
```

Tai yra didesnės vertės žvalgyba, nes ji padeda ne tik reaguoti, bet padeda ir prognozuoti *(na aš kaip mėgstu sakyt "Hey guys, these are just assumptions that we have right now.. let’s see how it the line")*.

**O tai ir yra pagrindinis skirtumas tarp reportingo ir intelligence.**

**Reporting sako -** *"Šitas domenas blogas."*

**Intelligence sako -** *"Ši metodika greičiausiai bus adaptuota prieš mūsų sektorių, nes ji pigiai pristato infostealerius, apeina dalį awareness kontrolės ir leidžia operatoriams greitai monetizuoti prieigas."*

Vienas sakinys blokuoja domeną.  
Kitas keičia saugumo strategiją.

![IOC ir strateginės žvalgybos palyginimas: vakarykštis indikatorius prieš ilgalaikę kryptį.](/assets/img/posts/substack/clickfix-kodel-siuolaikiniai-ta-nebeiesko/11.webp)

---

## ClickFix ir cybercrime ekonomika

ClickFix reikia vertinti ekonomiškai…ne tik techniškai.

Cybercrime pasaulyje, kaip ir bet kuriame versle, svarbu ROI *(ROI KPIs SLAs man atrodo ir 60-ties sulaukęs galėsiu susakyt kas tas yra… jei nuo žvalgybos šarabanai nenuvažiuos):*

```
Kiek kainuoja ataka?
Kiek aukų pasiekiama?
Kiek jų konvertuoja?
Kiek logų pavagiama?
Kiek prieigų parduodama?
Kiek toliau nueina ransomware ar fraud operatoriai?
```

ClickFix yra ekonomiškai patrauklus, nes sumažina pradinės prieigos kainą…Nereikia zero-day, nereikia sudėtingo exploit development, nereikia apeiti visų naršyklės apsaugų, nereikia brangaus phishing kit’o su MFA proxy, o kartais užtenka kompromituotos svetainės, fake CAPTCHA template, JavaScript, clipboard copy ir stager.

Tai pigu, tai scalable, tai lengvai adaptuojama ir tai gali būti parduodama kaip builderis.

ESET H1 2025 ataskaita pažymi, kad dėl ClickFix efektyvumo threat actoriai pradėjo pardavinėti builders, kurie leidžia kitiems atakuotojams kurti ClickFix weaponized landing pages. (ESET, 2025)

Kai technika pereina į builderių, affiliate’ų ir MaaS ekosistemą, ji nustoja būti vieno operatoriaus triuku t.y. ji tampa paslauga, o cybercrime ecosystem mėgsta paslaugas *(Malware-as-a-Service, Phishing-as-a-Service, Initial-Access-as-a-Service)..* o dabar turime ir human-execution-as-a-Service logiką.

**ClickFix gali būti pirmasis grandinės etapas:**

```
ClickFix.
Infostealer.
Credential logs.
Access marketplace.
Initial Access Broker.
Ransomware affiliate.
Data extortion.
ICT Board-level incident.
```

Viskas prasidėjo nuo "Verify you are human".

Kažkaip šioje vietoje labai poetiška…Labai bloga prasme.

![ClickFix raida nuo netikros CAPTCHA iki tapatybės ir sesijos perėmimo.](/assets/img/posts/substack/clickfix-kodel-siuolaikiniai-ta-nebeiesko/12.webp)

---

## Kodėl tai CISO problema, o ne tik SOC problema?

ClickFix dažnai pristatomas kaip social engineering technika. Tai tiesa nemeluosiu, bet pažiūrėjus per Board/Executive tai per siaura vieta.

CISO lygmenyje ClickFix turėtų būti vertinamas kaip rizikos valdymo problema.

**Kodėl?**

Nes jis kelia klausimus apie organizacijos saugumo modelį.

```
Ar darbuotojai supranta, kad niekada neturėtų vykdyti komandų iš naršyklės instrukcijų?
Ar awareness programa vis dar orientuota tik į "nespausk nuorodų“?
Ar privilegijuoti vartotojai gali paleisti PowerShell, mshta ar kitus living-off-the-land įrankius be realaus poreikio?
Ar organizacija turi visibility į browser-to-shell elgseną?
Ar web filtering atpažįsta kompromituotas legit svetaines?
Ar tiekėjų ir marketingo svetainių rizika įtraukta į attack surface management?
Ar incident response playbook’ai apima infostealer logų ir session theft scenarijus?
Ar rizikos komitetas supranta, kad MFA nebūtinai apsaugo nuo pavogtų sesijų?
```

Čia ir prasideda security leadership.. jau nebe ***"kokį hash blokuoti?"***, O ***"kokia kontrolės architektūra neveikia, jei darbuotojas per naršyklę įtikinamas paleisti komandą?"***

**Tai daug svarbesnis klausimas.**

Dalis organizacijų turi brangius EDR, XDR, SIEM, SOAR, TIP ir dar kelis acronym’us, kurie gražiai atrodo biudžete… Tada žmogus pamato fake CAPTCHA ir per 15 sekundžių tampa initial access enabler. Ne todėl, kad technologijos bevertės. Jos reikalingos *(čia kas be ko)*, bet ClickFix primena, kad žmogus vis dar yra privilegijuotas sistemos komponentas…ir dažniausiai mažiausiai kontroliuojamas *(net nupurto pagalvojus apie BYOD..)*.

CISO turėtų žiūrėti į ClickFix kaip į testą t.y. ne tik endpoint testą, o saugumo kultūros testą, awareness brandos testą, privileged execution kontrolės testą, identity resilience testą, incident response brandos testą.

Jeigu organizacija į ClickFix atsako tik "įdėkime IOC į SIEM", sorry, bet neišlaikytas egzaminas sėsk 2 *(kaip tik šiandien ar tai vakar laikė matematikos egzaminus mokyklose.. kaži daug tokių bus neišlaikiusių kaip ir šitų testų..)*.

![Diskusijos dalyviai nagrinėja, kodėl ClickFix yra prieigos kontrolės, o ne vien SOC problema.](/assets/img/posts/substack/clickfix-kodel-siuolaikiniai-ta-nebeiesko/13.webp)

---

## MFA mitas, arba kodėl "įjunk 2FA" nėra strategija

Dabar šiek tiek nepatogi dalis.

Lietuvos saugumo diskusijose yra viena frazė, kuri pasirodo beveik visur.. "Reikėjo MFA.".. na taip tai nėra blogas patarimas. MFA yra būtina kontrolė, o problema prasideda tada, kai MFA pradedama laikyti strategija.

ClickFix dažnai nesiekia tik pavogti slaptažodžio..jis gali pristatyti infostealerį, o infostealeris gali pavogti browser cookies, session tokens, saved credentials, crypto wallets, VPN artefaktus, developer secrets, cloud tokens, Outlook duomenis ir kitus autentifikacijos artefaktus.

Tai reiškia, kad ataka nebūtinai kovoja su MFA, ji gali jį apeiti per sesiją.

MFA saugo tą patį autentifikacijos momentą, bet jei po autentifikacijos pavagiami artefaktai, diskusija tampa sudėtingesnė.

***Ir būtent čia baigiasi LinkedIn komentaro "įjunk 2FA" magija.***

**Realybėje reikia kalbėti apie:**

```
phishing-resistant MFA
session protection
token lifetime
device compliance
conditional access
browser isolation
endpoint hardening
least privilege
privileged access workstations
infostealer telemetry
credential reset workflows
session revocation
post-compromise identity response
```

Taip, žinau, čia tikrai mažiau patogu nei parašyti "naudokite MFA" *(tas man atrodo Registrų Centro incidentas su manim keliaus visus šituos likusius metus..)*

***ClickFix labai aiškiai primena, kad saugumas nėra viena kontrolė. Tai kontrolės architektūra. Ir jei architektūra priklauso nuo to, kad žmogus niekada nepadarys kvailo veiksmo, tai nėra architektūra.***

Tai viltis, o viltis nėra kontrolė ir visi puikiai žinom kieno motina yra viltis.

![MFA ir perimtos sesijos palyginimas pabrėžia, kad autentifikavimas nėra absoliuti apsauga.](/assets/img/posts/substack/clickfix-kodel-siuolaikiniai-ta-nebeiesko/14.webp)

---

## Ką ClickFix sako apie ateities grėsmes?

Mano vertinimu, ClickFix yra tik pradžia *(čia kaip 2022 rašiau medium’e, kad matysim AI enhanced vulnerability scanning and exploitation.. na ką 2026 turim Mythos)*.

Ne pabaiga.

Tai rodo platesnę tendenciją kai social engineering tampa vis labiau productized, automatizuotas ir pritaikomas pagal auką.

**Jau dabar matome:**

```
OS detection.
Skirtingas instrukcijas Windows, macOS ir Linux naudotojams.
Video instrukcijas.
Fake verification counters.
Timers.
Brand impersonation.
Malvertising.
SEO poisoning.
Compromised legit websites.
TDS profiling.
```

Microsoft analizė pažymi, kad ClickFix kampanijos taikėsi į tūkstančius enterprise ir end-user įrenginių globaliai kasdien ir buvo derinamos su phishing, malvertising bei drive-by compromises (Microsoft, 2025).

Tom’s Guide 2025 m. aprašė, kad ClickFix tipo atakos evoliucionavo iki video instrukcijų ir operacinės sistemos atpažinimo, kad aukai būtų pateikiamos labiau pritaikytos instrukcijos (Tom’s Guide, 2025).

Dar prie viso šito balagano pridedam AI..

**Tai kitas etapas gali atrodyt taip:**

```
AI sugeneruotas lure pagal aukos pareigas.
Personalizuotas "fix" pagal naršyklę, OS ir kalbą.
Real-time chat support imitacija.
Voice-assisted social engineering.
Deepfake IT support.
Localized ClickFix lietuvių kalba.
Automatiškai generuojami fake error puslapiai pagal organizacijos brandą.
```

Ir tada nebeužteks mokyti žmonių "nepasitikėkite įtartinais laiškais" *(vėl Registrų Centras.. okay baigiu, bet ten.. numeta info[at]rc[.]lt email’ą ir rašo, kad ten sukčių email’as.. Okay Radio Centras kokiais velniais ten užsiimat?? Pradėsiu meme puslapį daryt su tokiais pasireiškimais, jau turiu gerai parinkes medžiagos)*.

Nes ataka gali atrodyti ne kaip įtartinas laiškas, ji gali atrodyti kaip labai normalus techninis sutrikimas, o techniniai sutrikimai yra šiuolaikinio darbo dalis.

Žmonės į juos reaguoja ne kaip į grėsmę..jie reaguoja kaip į kliūtį irr būtent tai užpuolikai išnaudoja.

Ateities social engineering bus ne tik įtikinamesnė..ji bus labiau kontekstinė…labiau lokalizuota…labiau personalizuota…ir, deja, daug labiau žmogiška.

![Būsimos phishing atakos derina DI, patikimą infrastruktūrą ir naudotojo veiksmus.](/assets/img/posts/substack/clickfix-kodel-siuolaikiniai-ta-nebeiesko/15.webp)

---

## Ką turėtų daryti organizacijos?

Nenoriu šio blogo paversti detection engineering dokumentu *(nors galėčiau.. vien šian gal 30 detection rules surašiau)*, bet keli principai būtini.

**Pirmas principas:** saugumo mokymai turi keistis. Vien tik "nespausk nuorodų" nebeužtenka.\
**Reikia aiškios taisyklės:** Jokia svetainė, el. laiškas, dokumentas ar chat žinutė neturi prašyti vartotojo atsidaryti Run, PowerShell, Terminal ar vykdyti komandą. Jeigu prašo.. tai jau incidentas, ne instrukcija.

**Antras principas:** riboti nereikalingą execution.  
Jeigu darbuotojui nereikia Run dialog, PowerShell, mshta, wscript ar kitų living-off-the-land paviršių kasdieniam darbui, jie neturėtų būti lengvai prieinami be kontrolės.

**Trečias principas:** stebėti browser-to-shell grandines.  
chrome.exe → poweshell.exe, msedge.exe → mshta.exe, firefox.exe → cmd.exe.  
Tokei parent-child ryšiai ne visada yra blog, bet dažnai pakankamai reti, kad būtų verti tyrimo.

**Ketvirtas principas:** vertinti infostealer incidentus rimtai.  
Infostealer nėra "mažas virusas", infostealer gali būti ransomware pradžia.

**Penktas principas:** incident response turi apimti session revocation.  
Jeigu pavogti cookies ar tokens, slaptažodžio pakeitimas gali būti nepakankamas.

**Šeštas principas:** attack surface management turi apimti pamirštas svetaines.  
Marketingo landing page, senas WordPress, testinis projektas, paliktas subdomenas – visa tai gali tapti delivery infrastruktūra.

**Septintas principas:** CTI *(na arba Lietuvos atveju SOC ar kiti kas žiūri šituos dalykus)* turi kalbėti vadovybei suprantama kalba.  
Ne "HTML/FakeCaptcha detections increased", o "ši technika mažina mūsų awareness programos efektyvumą, didina infostealer riziką ir gali tapti pradiniu access broker grandinės tašku". Šiuo atveju vienas sakinys skirtas analitikams, o kitas skirtas vadovybei. Abu reikalingi.

![Praktinių organizacijos apsaugos veiksmų prieš ClickFix kontrolinis sąrašas.](/assets/img/posts/substack/clickfix-kodel-siuolaikiniai-ta-nebeiesko/16.webp)

---

## Šaltiniai

1. <span id="source-1"></span><span class="hx-source-entry"><a href="https://www.microsoft.com/en-us/security/blog/2025/08/21/think-before-you-clickfix-analyzing-the-clickfix-social-engineering-technique/">Microsoft Threat Intelligence. Think before you Click Fix : Analyzing the ClickFix social engineering technique. 2025</a> <span class="hx-source-type">Tiekėjo tyrimas</span></span>
2. <span id="source-2"></span><span class="hx-source-entry"><a href="https://www.microsoft.com/en-us/security/blog/2025/03/13/phishing-campaign-impersonates-booking-com-delivers-a-suite-of-credential-stealing-malware/">Microsoft Security Blog. Phishing campaign impersonates Booking.com, delivers a suite of credential-stealing malware. 2025</a> <span class="hx-source-type">Tiekėjo tyrimas</span></span>
3. <span id="source-3"></span><span class="hx-source-entry"><a href="https://www.proofpoint.com/us/blog/threat-insight/clipboard-compromise-powershell-self-pwn">Proofpoint Threat Research. From Clipboard to Compromise: A PowerShell Self-Pwn. 2024</a> <span class="hx-source-type">Tiekėjo tyrimas</span></span>
4. <span id="source-4"></span><span class="hx-source-entry"><a href="https://web-assets.esetstatic.com/wls/en/papers/threat-reports/eset-threat-report-h12025.pdf">ESET Threat Report H1 2025. ClickFix: Fake errors, real threats. 2025</a> <span class="hx-source-type">Išorinis šaltinis</span></span>
5. <span id="source-5"></span><span class="hx-source-entry"><a href="https://www.rapid7.com/blog/post/tr-malicious-websites-wordpress-compromise-advances-global-stealer-operation/">Rapid7. When Trusted Websites Turn Malicious: WordPress Compromises Advance Global Stealer Operation. 2026</a> <span class="hx-source-type">Išorinis šaltinis</span></span>
6. <span id="source-6"></span><span class="hx-source-entry"><a href="https://www.techradar.com/pro/security/thousands-of-compromised-websites-abused-by-drivesurge-in-active-clickfix-and-fakeupdates-campaigns">TechRadar / Silent Push. Thousands of compromised websites abused by DriveSurge in active ClickFix and FakeUpdates campaigns. 2026</a> <span class="hx-source-type">Išorinis šaltinis</span></span>
7. <span id="source-7"></span><span class="hx-source-entry"><a href="https://www.techradar.com/pro/security/hackers-hijack-wordpress-sites-to-spread-malware-using-fake-captcha">TechRadar / Rapid7. Hackers hijack WordPress sites to spread malware using fake CAPTCHA. 2026</a> <span class="hx-source-type">Išorinis šaltinis</span></span>
8. <span id="source-8"></span><span class="hx-source-entry"><a href="https://www.tomsguide.com/computing/malware-adware/clickfix-attacks-just-got-a-major-upgrade-to-trick-you-into-infecting-your-computer-with-malware-dont-fall-for-this">Tom’s Guide. ClickFix attacks now include video instructions and can recognize your operating system. 2025</a> <span class="hx-source-type">Išorinis šaltinis</span></span>
9. <span id="source-9"></span><span class="hx-source-entry"><a href="https://www.microsoft.com/en-us/corporate-responsibility/cybersecurity/microsoft-digital-defense-report-2025/">Microsoft Digital Defense Report 2025</a> <span class="hx-source-type">Tiekėjo tyrimas</span></span>

***Papildomai rekomenduoju dar perskaityt:***

1. <span class="hx-source-entry"><a href="https://www.hhs.gov/sites/default/files/clickfix-attacks-sector-alert-tlpclear.pdf">HHS HC3 ClickFix sector alert</a> <span class="hx-source-type">Pirminis šaltinis</span></span>
2. <span class="hx-source-entry"><a href="https://www.hhs.gov/sites/default/files/vidar-malware-analyst-note-tlpclear.pdf">HHS HC3 Vidar malware analyst note</a> <span class="hx-source-type">Pirminis šaltinis</span></span>
3. <span class="hx-source-entry"><a href="https://unit42.paloaltonetworks.com/preventing-clickfix-attack-vector/">Unit 42 ClickFix attack vector analysis</a> <span class="hx-source-type">Tiekėjo tyrimas</span></span>
4. <span class="hx-source-entry"><a href="https://www.recordedfuture.com/research/clickfix-campaigns-targeting-windows-and-macos">Recorded Future ClickFix campaigns targeting Windows and macOS</a> <span class="hx-source-type">Išorinis šaltinis</span></span>
5. <span class="hx-source-entry"><a href="https://www.sekoia.io/en/homepage">Sekoia — Homepage</a> <span class="hx-source-type">Išorinis šaltinis</span> <a href="https://www.huntress.com">Huntress — Source</a> <span class="hx-source-type">Išorinis šaltinis</span> <a href="https://reliaquest.com/">Reliaquest — Source</a> <span class="hx-source-type">Išorinis šaltinis</span></span>
