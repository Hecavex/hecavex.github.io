---
title: "MFA nėra panacėja ir laikas nustoti apsimetinėti kad yra"
description: "Kodėl MFA yra būtina, bet nepakankama apsauga nuo session theft, AiTM, token replay, OAuth abuse ir šiuolaikinio account takeover."
seo_title: "MFA apėjimas: AiTM phishing ir sesijos vagystė"
seo_keywords:
  - "MFA apėjimas per AiTM phishing"
  - "kelių veiksnių autentifikavimas"
  - "sesijos token vagystė"
  - "OAuth piktnaudžiavimas"
  - "paskyros perėmimas"
date: 2026-06-02T07:30:41.443Z
lang: lt
translation_key: substack-mfa-nera-panaceja-ir-laikas-nustoti
permalink: /lt/tyrimai/mfa-nera-panaceja-ir-laikas-nustoti/
redirect_from:
  - /lt/research/mfa-nera-panaceja-ir-laikas-nustoti/
author: deividas-lis
content_type: technical-analysis
confidence: moderate
tlp: clear
categories: ["identity-security", "social-engineering"]
tags: ["MFA", "AiTM", "session theft", "OAuth", "identiteto saugumas"]
featured: false
scope: "Viešų incidentų ir techninės dokumentacijos analizė apie MFA apeinančius arba sesiją perimančius metodus."
limitations: "MFA efektyvumas priklauso nuo metodo, įgyvendinimo ir aplinkinių kontrolės priemonių; straipsnis nevertina vienos konkrečios organizacijos."
key_findings:
  - "MFA ženkliai mažina slaptažodžiais paremtas atakas, bet neapsaugo pavogtos sesijos."
  - "Phishing-resistant FIDO2 metodai yra stipresni už push ar TOTP modelius."
  - "Containment turi apimti tokenų, OAuth leidimų, sesijų, taisyklių ir įrenginių peržiūrą."
image:
  path: /assets/img/posts/substack/mfa-nera-panaceja-ir-laikas-nustoti/01.webp
  alt: "MFA nėra panacėja ir laikas nustoti apsimetinėti kad yra"
  thumbnail: /assets/img/posts/substack/mfa-nera-panaceja-ir-laikas-nustoti/01-card.webp
  width: 1280
  height: 719
source_url: https://deivlis.substack.com/p/mfa-nera-panaceja-ir-laikas-nustoti
---
![Prisijungimo ekranas ir žaibo plyšys iliustruoja teiginį, kad MFA būtina, bet nėra panacėja.](/assets/img/posts/substack/mfa-nera-panaceja-ir-laikas-nustoti/01.webp)

*Jeigu iš šito straipsnio reikia išsinešti vieną mintį, ji labai paprasta. MFA ir 2FA yra būtini. Be jų organizacija ir žmogus lieka praktiškai nuogi prieš password spraying, password reuse, credential stuffing ir didelę dalį automatinio account takeover. Microsoft savo dokumentacijoje ir blog’uose ne kartą pabrėžė, kad MFA labai smarkiai sumažina account compromise riziką, o MFA vadina vienu iš svarbiausių identity hardening sluoksnių. Ta dalis yra tiesa. (**<https://www.microsoft.com/en-us/security/blog/2019/08/20/one-simple-action-you-can-take-to-prevent-99-9-percent-of-account-attacks/>**)*

*Bet iš to dar nereiškia kita, labai mėgstama LinkedIn “PowerPoint IAM school” išvada. Ne, “turime MFA” nereiškia, kad paskyrų vagystės pasibaigė, kad unauthorized sign-ins nebeįmanomi, ir kad visa identity security programa dabar telpa į vieną checkbox’ą. Microsoft, MITRE, OWASP, Cloudflare, Cisco Talos ir FIDO Alliance visi bloguose rodo tą pačią realybę t.y. modernūs attacker’iai (TAs/APTs.. sakyčiau net script kiddies) seniai išmoko ne tik pavogti password’ą... jie vagia session cookies, refresh tokens, access tokens, OAuth consent, arba tiesiog kompromituoja endpoint’ą ir pasiima jau autentifikuotą sesiją. (**<https://www.microsoft.com/en-us/security/blog/2022/07/12/from-cookie-theft-to-bec-attackers-use-aitm-phishing-sites-as-entry-point-to-further-financial-fraud/>**)*

*Todėl rimtas atsakymas į account takeover 2026 metais nėra “įjunkit MFA”. Sakyčiau atsakymas yra layered defense. Phishing-resistant authentication, endpoint protection, token protection, session controls, OAuth app governance, sign-in monitoring, IR playbooks ir greitas containment’as. Kitaip tariant, ne LinkedIn komentarai iš “wannabe Ethical hacker” ar tų “Kibernetio saugumo specialistų” (kur ten žiniasklaidoj reiškiasi nedirbę gyvenime su kibernetiniu saugumu), o reali gynyba.*

[Registrų centro incidento analizė](/lt/tyrimai/registru-centro-duomenu-vagyste-kai/) ir jos [identity sluoksniui skirta antra dalis](/lt/tyrimai/registru-centro-duomenu-vagyste-part/) parodo, kodėl šis skirtumas svarbus praktiškai: per patikimą paskyrą vykdoma veikla gali atrodyti normali, kol nesukoreliuojami identity, session, įrenginio ir duomenų prieigos įrodymai.

---

## **Kodėl turime MFA nėra strategija**

Lietuviškoje medijoje *(žiūriu tiesiai į Delfi straipsnius ir tą kai seimo nariai pastarosiom dienom pasisakė ir wannabe Ethical hackeriai...)* yra viena nuostabi tradicija. Įvyksta account compromise. Nuteka mailbox’as. Iš kompromituotos paskyros išsiunčiami invoice fraud laiškai *(tarkim)*. Kažkas praranda Teams, M365 ar social account’ą. Ir tada komentaruose visada atsiranda tas pats digital filosofas *(ar kaip tu ten jį/juos pavadinsi..)*, kuris visą IAM sutraukia į septynis žodžius “O buvo įjungtas 2FA”. Jeigu nebuvo, visi jaučiasi išsprendę incidentą. Jeigu buvo, prasideda tyla, nes tada jau tenka kalbėti apie session hijacking, token replay, OAuth abuse ir endpoint compromise *(na čia jiem jau keiksmažodžiai prasideda.. nemaloni tiesa)*. O čia jau nebeužtenka vieno ar kelių buzzword’ų ir „ethical hacker“ bio aprašyme ar LinkedIn title.

Bėda ne ta, kad MFA perdėtai giriama. Bėda ta, kad ji dažnai giriama taip, lyg spręstų daugiau, nei iš tiesų sprendžia. MFA puikiai mažina klasikinių credential-based atakų sėkmės ratio. Microsoft nurodo, kad MFA gali blokuoti daugiau nei 99.9% account compromise atakų, kurios remiasi password’u kaip pagrindiniu entry point. Kitaip tariant, jei organizacija vis dar sėdi ant password-only auth, tai čia net ne “maturity gap”.. čia tiesiog palikta atrakinta durų spyna su užrašu “please be ethical”.

Tačiau modernus identity threat landscape nebėra vien apie password’ą. Microsoft Entra dokumentacija labai aiškiai atskiria sign-in session tokens nuo app sessions ir paaiškina, kad tokie artifact’ai kaip PRT ir refresh token gali gyventi savaites ar mėnesius, o app auth cookies gyvena pagal pačios aplikacijos logiką. Kai toks artifact’as pavagiamas, attacker’iui nebereikia vėl “įveikti MFA”. Jam reikia tik sėkmingai suvaidinti jau autentifikuotą vartotoją. OWASP ir MITRE šitą aprašo taip pat tiesiai. Session ID, web session cookie ar application access token gali leisti pilnai impersonate’inti user’į be naujo login’o. (**<https://learn.microsoft.com/en-us/entra/identity/devices/concept-tokens-microsoft-entra-id>**)

Ir būtent čia užstringa paviršutiniškas “MFA is magic” naratyvas. Jis kalba apie login screen. O realus CTI ir incident response dažnai kalba apie tai, kas vyksta po login screen. Session reuse. Non-interactive sign-ins. Added MFA methods. Mailbox forwarding rules. OAuth grants. App permissions. Suspicious downloads. BEC follow-on activity. Microsoft token theft playbook net aiškiai sako, kad jei activity negali būti patvirtinta kaip valid, reikia manyti breach ir eiti į containment, o ne guostis tuo, kad “bet juk mes turėjom MFA”. (**<https://learn.microsoft.com/en-us/security/operations/token-theft-playbook>**)

![MFA įjungtos paskyros apsaugos ir likusių atakos kelių palyginimas.](/assets/img/posts/substack/mfa-nera-panaceja-ir-laikas-nustoti/02.webp)

---

### **Kaip veikia modernus account takeover**

Paprasčiausias būdas suprasti problemą yra atskirti tris dalykus, kuriuos LinkedIn pseudo ekspertų pasaulyje dažnai suplaka į vieną smoothie.

***Pirmas yra authentication.***

***Antras yra session.***

***Trečias yra token.***

Authentication atsako į klausimą, ar tu esi tas, kuo sakaisi. Session ir tokenai atsako į visai kitą klausimą. Ar sistema jau tavimi pasitiki ir kiek ilgai tas pasitikėjimas galios. Microsoft aiškiai nurodo, kad PRT ir refresh token gali būti atnaujinami rolling modeliu, access token paprastai gyvena apie 60–90 minučių, o app auth cookie gyvavimas priklauso nuo pačios aplikacijos. Būtent todėl token theft yra toks vertingas attacker’iui. (**<https://learn.microsoft.com/en-us/entra/identity/devices/concept-tokens-microsoft-entra-id>**)

Dar blogiau, session cookies galima rasti diske, browser proceso atmintyje ir tinklo sraute, o MITRE tiesiogiai pažymi, kad jų vagystė gali leisti apeiti kai kuriuos MFA protokolus. OWASP taip pat pabrėžia, kad active session negalima laikyti savaime patikima vien todėl, kad vartotojas kažkada sėkmingai autentifikavosi. Kitaip tariant, MFA nebūtinai “sugenda”. Užpuolikas tiesiog pavagia tą sėkmingą autentifikavimą. (**<https://attack.mitre.org/techniques/T1539/>**)

Nuorodoje supaprastintas AiTM flow, tai nėr stebuklas..tiesiog labai gerai išnaudoja tai, kad žmonės ir dalis komentatorių vis dar mąsto prisijungimais, o ne sesijomis (**[FlowChart](https://mermaid.live/view#pako:eNpNkU1u2zAQha8y4FoxZEeSZS0K-DdxkQBGXHRR2YuxNJYZS6IwpPxTw8uepzfoKr1XacVpzA054PfezCNPIlEpiUisc7VPNsgGnl4WJdjVj7_bUhn1ihoyrEuEaiP1RpYZ5DXTEu7uvsAgfqFUMiVGMSCvsLmDCjNavvsMGm4Yj3cyz2R5ACMrBUw7Ym1BVofjlRw25Ch-okwamKazd8M54hxyZbW3tqMGHt8O-fZ7R6mdErXeK06v4LgBJ7dghWYn2Ugb6XnSv3KThnu4dtfEO5kQZPz26--fC6lJa6lKSJTaSgLJYNSWylpf9Q-N_jGeXRJBRSwLtAGMXGNi_lOPDTWN-8ZgsiX7ZmZbs_y017hTsGK1txMcXz_SThvZ1_gZZb5SB8AksbwD3wgLu83tz9FMydI4MBgPHUjRIJgNrc1SOCJjmYrIcE2OKIgLvJTidLFeCEsVtBCRPabI24VYlGerqbD8oVTxIWNVZxsRrTHXtqor24BGEjPGT4TKlHio6tKIqO13Gw8RncRBREG3FfqB67k93_PDXug54iiiThC02t1e1wv9e7_tBx3_7IifTVe31WsHHbftBl7ohe59Jzz_Ay_m3dU)**).

MITRE evilginx2 aprašo kaip open-source AiTM framework’ą, kuris veikia kaip reverse proxy tarp aukos ir legit service’o ir geba perimti credentials, authentication tokens ir session cookies. Microsoft 2022 AiTM analizė parodė tą pačią logiką praktikoje. Tarp user ir legit login’o įterpiamas proxy, kuris surenka ne tik password’ą, bet ir authenticated session artifactus, po ko užpuolikas gali sign-inti į Exchange Online ar kitus resursus tarsi būtų pats vartotojas. Ir jei kam nors žodis phishlets skamba kaip koks cyber woodoo... Tai target-specific config files, kurie apibrėžia reverse proxy elgseną konkrečiam login flow. Tiesiog industrialized phishing... ir nesakysiu kur Lietuvoje išmėginau, kiek išmėginau.. bet visus tokens/session cookies nusiemiau.. tik su phishlets teko padirbt pakol įkaliau gerai.. *(gal jau save laikyt Ethical hacker, nes AiTM sugebu?? Ir užsirašyt LinkedIn “Ethical Hacker”..?)* (**<https://attack.mitre.org/software/S9003/>**, **<https://www.microsoft.com/en-us/security/blog/2022/07/12/from-cookie-theft-to-bec-attackers-use-aitm-phishing-sites-as-entry-point-to-further-financial-fraud/>**)

Svarbu pabrėžti vieną niuansą čia, kurį Microsoft pati suformuluoja labai aiškiai. AiTM nėra MFA vulnerability. Tai nėra “nulaužtas MFA”. Tai session theft. Užpuolikas gauna authenticated session on behalf of the user, nepriklausomai nuo to, kokiu metodu user’is ten sėkmingai prisijungė. Šitas skirtumas labai svarbus, nes kitaip diskusija virsta elementariu ginču “tai vadinasi MFA neveikia”. Ne. Veikia. Tiesiog ne viena.

Iš IR pusės tai reiškia ir kitą dalulą... Kai pamatai anomalous token, unfamiliar non-interactive sign-in, added MFA credential, mailbox forwarding rule arba keistą data download activity, nebeužtenka pasakyti vartotojui “pasikeisk password’ą ir būsi safe”.. Microsoft token theft playbook rekomenduoja containment metu ne tik keisti password, bet ir blokuoti vartotoją, revoke’inti access, žymėti account’ą kaip compromised, peržiūrėti apps, devices, inbox rules, tuomet revoke’inti current tokens ir šalinti nežinomas MFA opcijas ar device’enroll’inimus. Kitaip tariant, jei sesija pavogta, vien password reset nėra stebuklingas exorcism. (**<https://learn.microsoft.com/en-us/security/operations/token-theft-playbook>**)

![Adversary-in-the-middle phishing grandinė perima kredencialus, MFA kodą ir sesijos slapuką.](/assets/img/posts/substack/mfa-nera-panaceja-ir-laikas-nustoti/03.webp)

---

### **Incidentai ir kampanijos kurios sugriauna MFA mitą**

Pradėkime nuo Microsoft tyrimo, nes tai vienas iš švariausių pavyzdžių, kaip atrodo realus AiTM gyvenime. 2022 metų liepą Microsoft aprašė didelę kampaniją, kuri nuo 2021 metų rugsėjo mėnesio bandė taikytis į daugiau nei 10 000 organizacijų. Flow buvo labai (sakyčiau..) “enterprise grade”. Phishing lure, redirector pages, Evilginx2 phishing site, pavogti credentials, pavogta session, tada mailbox access ir follow-on BEC. Čia jau ne “hakeris siunčia vieną fake login page”. Tai visa grandinė, su lures, gatekeeper puslapiais, brandingu ir sesijos užgrobimu po sėkmingo MFA. (**<https://www.microsoft.com/en-us/security/blog/2022/07/12/from-cookie-theft-to-bec-attackers-use-aitm-phishing-sites-as-entry-point-to-further-financial-fraud/>**)

![Autentifikuotų artefaktų vagystės būdai ir jų panaudojimas apeinant prisijungimą.](/assets/img/posts/substack/mfa-nera-panaceja-ir-laikas-nustoti/04.webp)

TTP požiūriu kampanija buvo “nice”. Redirector validuodavo URL fragmentus, automatiškai užpildydavo user’io email’ą, o phishing landing page proxy’indavo tikrą Azure AD sign-in puslapį, net su organizacijos brandingu. User’is įveda credentials, atlieka MFA, tada fone attacker’is gauna credentials ir authenticated session. Microsoft tiesiogiai rašo apie prieigą prie mailbox’ų ir follow-on financial fraud per BEC. Rekomenduotos mitigacijos taip pat kalba ne apie “įjunk vieną papildomą checkbox’ą ant MFA”, o apie advanced anti-phishing, suspicious sign-in monitoring, Identity Protection anomalous token alerts, Continuous Access Evaluation ir Conditional Access signalus, tarp jų IP, device state ir kitas identity-driven sąlygas.

Toliau turime Cisco 2022 incidentą, kuris labai gražiai parodo, kad push-based MFA gali būti labai padori apsauga iki momento, kol žmogus tampa exhausted pop-up manager’iu. Cisco tapo aware apie potencialų compromise 2022 metų gegužės 24 dieną. Tyrimas parodė, kad employee credentials buvo kompromituoti po to, kai attacker’is perėmė personal Google account, kuriame browser’is synchronicino išsaugotus prisijungimus. Tada sekė vishing ir MFA push bombardavimas, kol vartotojas galiausiai patvirtino push request’ą ir attacker’ius gavo VPN access to the user context. Šitas atvejis svarbus todėl, kad čia nebuvo nei nulinės dienos exploit’o, nei kokios mistinės nation-state teleportacijos per firewall’ą. Buvo browser-synced creds, social engineering, push fatigue ir žmogus, kuris vienu momentu paspaudė ne tą mygtuką. (**<https://blog.talosintelligence.com/recent-cyber-attack/>**)

![Netikras prisijungimas ir pavogta sesija palyginti su saugiu phishingui atspariu prisijungimu.](/assets/img/posts/substack/mfa-nera-panaceja-ir-laikas-nustoti/05.webp)

Cloudflare 2022 yra priešingas pavyzdys ir būtent todėl toks vertingas. Po Twilio bangos labai panaši SMS phishing kampanija taikėsi į daugiau nei 130 kompanijų, tarp jų ir Cloudflare. Trims darbuotojams užteko social engineering, kad jie įvestų credentials į phishing page. Jei ten būtų buvęs TOTP modelis, viskas galėjo pasibaigti labai nejuokingai, nes Cloudflare nustatė, kad credentials buvo real time relayed per Telegram, o TOTP kodas būtų leidęs attacker’iui autentifikuotis, kol šis dar neexpired. Tačiau Cloudflare naudojo FIDO2-compliant hardware security keys su origin binding, todėl net ir tokiu atveju attacker’is negalėjo sėkmingai logintis į jų sistemas. Šitas case’as yra tobulas atsakymas visiems, kurie mėgsta sakyti “MFA yra MFA”. Ne. Nėra. Cloudflare parodė, kad TOTP būtų buvęs žymiai silpnesnis variantas, o FIDO2 su origin binding iš esmės nukerta real-time phishing proxy vertę. (**<https://blog.cloudflare.com/making-phishing-defense-seamless-cloudflare-yubico/>**)

Dar viena tema yra OAuth consent abuse. Microsoft dar 2021 metais rašė apie didėjantį phishing kiekį, kuriame vartotojui nereikia suvesti password’o fake puslapyje. Priešingai, user sign-in vyksta per legitimate identity provider’į, o žmogus tiesiog „Allow“ paspaudimu suteikia attacker-owned app’ui permissions. Tada app’as gauna access token ir gali daryti API calls vartotojo vardu, pasiekti email, files, contacts ir kitus duomenis. Microsoft tiesiogiai pabrėžia, kad tokios atakos dažnai “even do not involve password theft”, bet vis tiek leidžia išlaikyti persistence and reconnaissance target organizacijoje. Tai yra viena iš priežasčių, kodėl sakinys “bet mes turime MFA” (nu RC momentu nebuvo MFA..) čia skamba kaip žmogus, kuris bando liepsną gesinti tuo, kad turi labai pilną vandens butelį. (**<https://www.microsoft.com/en-us/security/blog/2021/07/14/microsoft-delivers-comprehensive-solution-to-battle-rise-in-consent-phishing-emails/>**)

OAuth abuse nesibaigė 2021 metais. 2026 metų kovą Microsoft aprašė phishing kampanijas, kurios išnaudojo OAuth redirection mechanizmus, kūrė malicious applications su redirect URI į attacker-controlled domain’ą ir naudojo intentionally invalid scopes bei prompt=none, kad per trusted identity provider domain’ą nutemptų vartotojus į phishing ar malware delivery landing puslapius. Šis mechanizmas net nebandė vogti tokenų silent auth fazėje, o jo tikslas buvo abuse’inti trusted redirect behavior ir pasiekti follow-on phishing arba endpoint compromise. Microsoft rekomendacijos čia labai tiesios. Riboti user consent, reguliariai review’inti app permissions, šalinti overprivileged ar unused apps, naudoti app governance, identity protection, cross-domain detection ir weekly review’inti consent grants. (**<https://www.microsoft.com/en-us/security/blog/2026/03/02/oauth-redirection-abuse-enables-phishing-malware-delivery/>**)

Ir tada prieiname prie infostealerių, kurie gražiausiai sudaužo mitą, kad “MFA užrakina account’ą”. Ne. Infostealeris net nebando “laužti MFA”. Jis ateina į endpoint’ą ir pasiima tai, kas jau leidžia autentifikuotai sesijai gyvuoti. Microsoft 2025 ir 2026 tyrimai apie infostealerius rodo labai aiškią kryptį. Malware kampanijos masiškai renka browser credentials, session cookies, authentication tokens, wallet data ir kitus secrets, naudoja phishing, malvertising, abuse of trusted platforms, ClickFix ir net WhatsApp ar fake PDF tools kaip delivery. 2025 metų Microsoft malvertising kampanija paveikė beveik milijoną įrenginių, o 2025 metų Lumma tyrimas aprašė gana industrialized distribution ekosistemą. (**<https://www.microsoft.com/en-us/security/blog/2025/03/06/malvertising-campaign-leads-to-info-stealers-hosted-on-github/>**)

Jeigu pažvelgtume į konkrečias šeimas, vaizdas tampa dar aiškesnis. **Lumma**, pagal Microsoft, vogia saved passwords, session cookies ir autofill duomenis iš Chromium, Mozilla ir Gecko browser’ių, o 2025 metų kampanijose buvo platinama per malvertising, phishing, drive-by compromise ir ClickFix fake CAPTCHA flow. Microsoft taip pat nurodo, kad 2025 metų kovo ir gegužės laikotarpiu užfiksavo daugiau nei 394 000 infekuotų Windows įrenginių visame pasaulyje. **RedLine** pagal SonicWall taikosi į saved passwords, cookies, VPN credentials, Discord tokens, wallet’us ir browser SQLite duomenis. **StealC**, Microsoft ir Huntress aprašymu, vagia credential tokens, sessions ir browser-stored data ir gali būti naudojama prieš initial access operations. **Vidar 2.0**, pagal Trend Micro, 2025 metų spalį perėjo į C rewrite, naudojo multithreaded architektūrą ir net bandė apeiti browser security features per direct memory injection. **Raccoon**, pagal Microsoft, renka passwords, browser cookies, autofill, wallet data ir screen capture’us. Tai nėra nišinė egzotika. Tai commodity economy.

![Infostealer kenkėjiškų programų ekosistema ir jos vagiami naršyklės bei tapatybės duomenys.](/assets/img/posts/substack/mfa-nera-panaceja-ir-laikas-nustoti/06.webp)

Impact iš tokios veiklos vėlgi nėra tik "pavogė vieną password’ą". Stolen cookies ir refresh tokens gali duoti SSO session takeover, mailbox prieigą, document access, internal phishing, BEC, cloud compromise, developer secret theft ir net ransomware follow-on activity. Microsoft tiesiogiai rašo, kad token theft gali pasireikšti per anomalous tokens, unfamiliar non-interactive sign-ins, added MFA methods, mailbox rule changes ir unusual downloads, o successful compromise atveju reikia ne tik rotate’inti secrets, bet ir remediainti įrenginį, revoke’inti tokens, nuimti nežinomas devices ar MFA options ir kartais net pilnai atstatyti sistemą. Jei kas nors po to vis dar rašo "tiesiog įsijunk MFA ir nesiparink", tai problema jau ne technologijoje,, o problema tame, kad žmogus painioja awareness poster’į su incident response.

---

## **Kuris MFA yra iš tikro stiprus**

Šitoje vietoje labai norisi šiek tiek sarkazmo, nes dalis viešosios erdvės kalbėjimo apie MFA atrodo lyg visos technologijos būtų vienodos, tik skirtingos spalvos. Lyg SMS kodas, TOTP, push, number matching, FIDO2 ir passkeys būtų tas pats dalykas, tik su skirtingu UX. Ne.

Lentelė žemiau yra sintezė iš NCSC rekomendacijų, Microsoft number matching guidance ir FIDO Alliance passkey modelio. Ji nėra “vienintelė tiesa visatoje”, bet labai gerai parodo, kodėl sakinys “mes turime MFA” be konteksto yra beveik bevertis.

![Lentelė lygina MFA metodus, jų atsparumą phishingui ir likusias rizikas.](/assets/img/posts/substack/mfa-nera-panaceja-ir-laikas-nustoti/07.webp)

Svarbiausi niuansai čia yra du. **Pirmas**, Microsoft aiškiai sako, kad number matching yra security upgrade palyginti su tradiciniu push. **Antras**, NCSC apie challenge-based apps kalba atsargiai ir pažymi tik partial phishing resistance, nes prompt fatigue vis dar egzistuoja. FIDO2 ir passkeys čia stovi visai kitoje lygoje, nes jie remiasi public key cryptography, origin binding ir neturi reusable shared secret, kurį galima perleisti per phishing proxy. FIDO Alliance tiesiogiai rašo, kad passkeys yra phishing resistant by design ir saugesnės už tradicinį authentication + MFA modelį. (**[Microsoft](https://learn.microsoft.com/en-us/entra/identity/authentication/how-to-mfa-number-match?tabs=iOS)**, **[FIDO](https://fidoalliance.org/passkeys/)**, **[NCSC](https://www.ncsc.gov.uk/collection/mfa-for-your-corporate-online-services/recommended-types-of-mfa)**)

Tai nereiškia, kad visi rytoj turi išmesti TOTP ir bėgti pirkti hardware keys kiekvienai močiutei. Tai reiškia, kad security controls reikia matuoti pagal threat model. Jei saugai high-value admin accounts, finance, M365 admins, privileged access, developer access ir executives, FIDO2 arba passkeys turėtų būti ne “nice to have”, o default. Cloudflare case’as labai gerai parodė, kodėl. FIDO2 nutraukė breach ten, kur TOTP realiai būtų buvęs silpnesnis. (**<https://blog.cloudflare.com/2022-07-sms-phishing-attacks/>**)

---

## **Pabaigai**

Trumpa išvada būtų tokia. MFA nėra melas. Melas yra tas saldus, social media auditorijai patogus supaprastinimas, kad MFA yra pabaiga. Realybėje ji yra pradžia. Jei tavo visa cyber hygiene telpa į sakinį “mes turime 2FA”, tu neturi strategijos.. Tu turi sakinį.... O attacker’iai, deja, turi visą kill chain.
