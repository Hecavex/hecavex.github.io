---
title: "CTI Pivoting 101: profesionalus analitiko lauko vadovas"
card_title: "Pivoting 101: nuo vieno observable iki pagrįsto cluster'io"
description: "Profesionalus, hypothesis-driven CTI pivoting vadovas: evidence model, infrastruktūros ir malware pivotai, active recon OPSEC, temporal analizė, clustering, confidence ir attribution ribos."
date: 2026-08-13 18:00:00 +0300
last_modified_at: 2026-08-14 16:00:00 +0300
lang: lt
translation_key: infrastructure-pivoting-101-unipark
permalink: /lt/tyrimai/infrastrukturos-pivoting-101/
author: deividas-lis
content_type: technical-guide
confidence: high
tlp: clear
categories: [threat-intelligence, investigations, fraud-scams]
tags: [infrastructure pivoting, CTI, OSINT, OPSEC, active reconnaissance, phishing, malware research, URLScan, RDAP, DNS, Certificate Transparency, threat hunting]
featured: false
draft: false
toc: true
comments: false
scope: "Originali, vendor-neutral CTI pivoting mokomoji medžiaga. Metodika demonstruojama naudojant 2026 m. rugpjūčio UNIPARK smishing atvejį ir tuo metu išsaugotus viešus duomenis."
limitations: "Tai nėra aktyvaus pažeidžiamumų skenavimo, svetimų sistemų testavimo, malware vykdymo ar attribution pagal vieną techninį požymį vadovas."
key_findings:
- "Pivoting prasideda nuo intelligence requirement ir hipotezės, ne nuo pasirinkto portalo paieškos laukelio."
- "Kiekvienas graph edge turi turėti tipą, provenance, laiką ir įrodymą. Search result nėra relationship, kol analitikas nepaaiškino, ką jis sieja."
- "Candidate discovery, relationship confirmation, cluster membership ir attribution yra keturi skirtingi analitiniai lygiai."
- "Exact content hash gali būti stiprus deployment ryšys, bet net ir jis savaime neįrodo bendro operatoriaus, jei kit'as platinamas ar parduodamas keliems naudotojams."
- "OpenPhish, URLhaus ir MalwareBazaar yra papildomi šaltiniai konkrečiam pivotui. Jie nėra automatinė išvada ir šiame vadove nenaudojami malware atsisiuntimui ar detonavimui."
- "Autorizuotas active recon gali patvirtinti deployment ir service ryšius, bet jam reikia atskiro scope, rules of engagement, OPSEC, deconfliction ir abort sąlygų."
image:
  path: /assets/img/posts/2026-08-13-pivoting-101/pivoting-101-hero.svg
  social: /assets/img/social/infrastructure-pivoting-101-unipark-lt.png
  alt: "CTI pivoting analitinis ciklas nuo intelligence requirement ir seed iki patvirtintų ryšių, clusterio bei report"
  thumbnail: /assets/img/posts/2026-08-13-pivoting-101/pivoting-101-hero.svg
  width: 1600
  height: 900
---

## Pivoting nėra IOC dauginimas

[UNIPARK smishing tyrime](/lt/tyrimai/unipark-smishing-infrastrukturos-tyrimas/) pradėjau nuo vieno SMS URL:

```text
hxxps://unipark[.]fmqr[.]ink/com
```

Vieši duomenys vėliau susiejo 163 scan records, 126 unikalius hostus, kelis parkingo brand'us ir pakartotinai naudotą web kit'ą. Tai neįvyko todėl, kad vienas portalas turėjo mygtuką "Find the bad guys". Portalai pateikė observations. Ryšius tarp jų teko pagrįsti.

Tikras pivoting yra kontroliuojamas analitinis ciklas:

```text
decision need
  -> intelligence requirement
  -> seed qualification
  -> hypothesis
  -> discriminating pivot
  -> collection
  -> evidence preservation
  -> relationship assessment
  -> competing explanation
  -> confidence update
  -> next pivot arba stop
```

Jeigu procesas prasideda nuo "įmesk domeną į visus portalus", tai dar enrichment. Enrichment yra naudingas, bet jis nėra visas pivoting.

Šis vadovas skirtas CTI, incident response, fraud, malware ir security research analitikams. Jis yra originalus ir vendor-neutral. Įrankių UI keičiasi. Analitinis modelis turi išgyventi ilgiau negu nemokamas API planas.

![Hypothesis-led CTI pivoting ciklas nuo intelligence requirement iki sprendimo arba pagrįsto stop](/assets/img/posts/2026-08-13-pivoting-101/analytical-control-loop.svg)

## 1. Pirma nuspręsti, kokį sprendimą turi paremti tyrimas

Senior analitikas prieš rinkdamas duomenis klausia ne "ką dar galiu rasti", o "kokį sprendimą kažkas turės priimti".

Pavyzdžiui:

| Decision need | Intelligence requirement | Minimalus naudingas rezultatas |
| --- | --- | --- |
| blokuoti aktyvią kampaniją | kokie hostai ir URL šiuo metu dalijasi tuo pačiu patvirtintu deployment'u | timestamped IOC rinkinys su expiry ir confidence |
| išplėsti incident scope | kokie kiti objektai susiję su seed organizacijos telemetry laikotarpiu | patvirtinti ir probable objektai su relationship reason |
| inicijuoti takedown | kas hostina ir registruoja aktyvius objektus, kokie abuse kanalai | evidence paketas, provider, registrar, first ir last observed |
| parašyti strategic assessment | ar tai vienkartinis lure, parduodamas kit'as ar tęstinė kampanija | temporal ir behavioral pattern, alternative hypotheses |
| susieti malware delivery | kur tas pats payload ar loader buvo platinamas | exact hash ryšiai, delivery URLs, first ir last seen |

### Intelligence requirement turi ribas

Užrašau bent šiuos laukus:

```yaml
pir: Kokie objektai 2026-07-15–2026-08-13 dalijosi tuo pačiu UNIPARK phishing deployment'u?
decision: Blokavimas, scope expansion ir public research
deadline: 2026-08-14T12:00:00Z
allowed_collection: Passive sources ir jau išsaugoti public-scan artefaktai
prohibited: Form submission, credential entry, WebSocket interaction, auth bypass, malware download
confidence_target: High patvirtintam core, moderate platesniems candidate
stop_condition: Nauji pivotai nebekeičia blokavimo ar assessment per dvi iteracijas
```

Be šito tyrimas neturi stabdžių. Internetas visada turi dar vieną subdomain'ą.

### Trys analizės horizontai

Tas pats observable gali būti pivotinamas dėl skirtingo sprendimo. Prieš atidarant portalą verta žinoti, kuriame horizonte dirbame.

| Horizontas | Tipinis klausimas | Tinkamas detalumas | Dažniausia klaida |
| --- | --- | --- | --- |
| tactical | ką šiandien blokuoti ar hunt'inti | aktyvūs URL, hostai, failai, cert ir expiry | pasenusį IOC palikti be review datos |
| operational | kaip veikia kampanija ir ką dar ji apima | deployment, delivery, capability, victimology ir laiko seka | bendrą kit'ą pavadinti vienu operatoriumi |
| strategic | ką pattern reiškia organizacijai ar sektoriui | trend, access model, dependencies ir implications | vieną incidentą ekstrapoliuoti į visą grėsmės peizažą |

Senior darbas nėra visada pasiekti attribution. Senior darbas yra pasiekti tiek, kiek reikia sprendimui, ir tiksliai pasakyti, kur baigėsi evidence.

## 2. Naudoti teisingus objektus, o ne viską vadinti IOC

STIX požiūriu CTI yra graph, kuriame objektai yra nodes, o relationships yra edges. Praktikoje net nebūtina generuoti STIX JSON, bet mąstymo modelis labai naudingas.

| Sąvoka | Kas tai | Pavyzdys |
| --- | --- | --- |
| observable | techniškai stebima reikšmė | URL, domenas, IP, SHA-256, telefono numeris |
| artefact | išsaugotas objektas arba baitai | HTML, JS bundle, screenshot, HTTP response |
| observation | faktas, kad kažkas kažkur ir kažkada matyta | URLScan 2026-08-11 matė hostą ir response hash |
| indicator | detection arba hunting sąlyga | exact hash ir path kombinacija |
| entity | aukštesnio lygio objektas | infrastruktūra, kampanija, malware, organizacija |
| relationship | apibrėžtas ryšys tarp objektų | domain `resolved-to` IP tuo laiku |
| assessment | analitiko išvada iš kelių facts | hostai tikėtina naudojo tą patį deployment'ą |
| cluster | analitinis susijusių objektų rinkinys | HCVX-PARKING-KIT-2026 |

Vienas observable dar nėra IOC. IOC nėra actor. Cluster nėra attribution.

### Facts ir assessments laikyti atskirai

**Fact:** du public scan turi identišką SHA-256 atsakymą.

**Assessment:** abu hostai tuo metu pateikė byte-identical artefaktą.

**Dar neįrodyta:** juos valdė tas pats žmogus.

Tokio atskyrimo reikia kiekviename tyrime. Kitu atveju graph labai greitai tampa fan fiction su IP adresais.

## 3. Kiekvienas edge turi būti audituojamas

Relationship lentelėje neužtenka dviejų stulpelių `source,target`. Minimalus edge schema:

| Field | Reikšmė |
| --- | --- |
| source | objekto ID ir normalizuota reikšmė |
| relationship | tikslus veiksmažodis, pvz. `resolved-to`, `served`, `requested`, `same-bytes-as` |
| target | antro objekto ID ir reikšmė |
| observed_at | kada ryšį matė source provider arba sensor |
| collected_at | kada analitikas paėmė duomenis |
| source_name | RDAP, passive DNS, URLScan, internal telemetry |
| source_record | URL, record ID arba evidence failas |
| evidence | konkretus field, hash arba excerpt |
| confidence | confidence dėl relationship, ne dėl visos istorijos |
| status | candidate, supported, confirmed, rejected, expired |
| analyst_note | kodėl edge egzistuoja ir kokia alternatyva liko |

Naudingi relationship veiksmažodžiai:

```text
resolved-to       domain -> IP
announced-by      prefix -> ASN
registered-by     domain -> registrar arba registrant entity
used-nameserver   domain -> NS
issued-for        certificate -> domain
served            URL -> artefact hash
requested         page -> resource URL
redirected-to     URL -> URL
same-bytes-as     artefact -> artefact
similar-to        artefact -> artefact
communicated-with process ar sample -> endpoint
delivered         URL -> file hash
observed-at       observable -> source observation
part-of           object -> analytical cluster
```

`related-to` palieku tik tada, kai tikrai nežinau ryšio tipo. Jei pusė graph yra `related-to`, analitikas neaprašė, ką rado.

## 4. Laikas yra relationship dalis

CTI dažnai sugadina vienas žodis: "yra".

Domainas **yra** tame IP. Sertifikatas **yra** naudojamas. URL **yra** aktyvus. Po kelių valandų visa tai gali būti netiesa.

Skiriu keturis laikus:

1. **event time**, kada veikla realiai įvyko
2. **observation time**, kada sensor ar provider ją matė
3. **collection time**, kada analitikas pasiėmė record
4. **publication time**, kada provider ar tyrėjas tai paskelbė.

Pavyzdys:

```json
{
  "source": "domain:example.invalid",
  "relationship": "resolved-to",
  "target": "ip:192.0.2.10",
  "first_observed": "2026-08-04T11:12:00Z",
  "last_observed": "2026-08-06T03:20:00Z",
  "collected_at": "2026-08-13T17:44:12Z",
  "provider": "passive-dns-example"
}
```

Tai nereiškia, kad IP buvo susijęs rugpjūčio 13 dieną. Tai reiškia, kad provider turi observation apie rugpjūčio 4–6 dienas.

Negative evidence taip pat yra time ir coverage bound. "Provider nerado" reiškia tik tiek, kad tame provider, su tokiu planu ir tokiu query rezultato nebuvo.

## 5. Seed qualification prieš pirmą pivotą

Seed gali būti URL iš SMS, EDR telemetry, failo hash, vartotojo screenshot, SIEM alert ar trečios šalies report. Visi seed nėra vienodai patikimi.

### 5.1 Užfiksuoti originalą

Saugau:

- originalų tekstą arba baitus
- originalaus failo SHA-256
- gavimo laiką ir timezone
- kas pateikė ir kokiu kanalu
- ar vartotojas jau atidarė URL
- ar URL buvo perrašytas el. pašto security gateway
- ar screenshot apkarpytas
- TLP ir teisinius apribojimus.

### 5.2 Normalizuoti neprarandant originalo

```python
from urllib.parse import parse_qsl, urlsplit
import tldextract

raw = "hxxps://unipark[.]fmqr[.]ink/com"
refanged = raw.replace("hxxps://", "https://").replace("[.]", ".")
u = urlsplit(refanged)
ext = tldextract.extract(u.hostname or "")

seed = {
    "raw": raw,
    "normalized_url": u.geturl(),
    "scheme": u.scheme.lower(),
    "host": (u.hostname or "").lower(),
    "apex": ".".join(x for x in (ext.domain, ext.suffix) if x),
    "port": u.port,
    "path": u.path or "/",
    "query": parse_qsl(u.query, keep_blank_values=True),
}
print(seed)
```

Normalizavimas neturi sunaikinti case-sensitive path, query tvarkos ar originalaus encoding. Tyrimui saugau ir `raw`, ir canonical form.

### 5.3 Įvertinti contamination

Prieš pivotą klausiu:

- ar security product jau aplankė URL ir pakeitė backend state
- ar public submission paviešino privatų token
- ar sandbox pridėjo savo headers, cookies ar DNS observation
- ar redirect chain priklauso target, ar scanning provider
- ar screenshot rodo tikrą target, ar anti-bot interstitial
- ar seed yra production IOC, test URL ar sinkhole.

Jei provenance neaiški, seed nėra išmetamas. Jo reliability tiesiog mažesnė ir tai užrašoma.

## 6. Pivoting loop: klausimas, ne portalas

Kiekvieną iteraciją vykdau ta pačia forma.

### Gate A: hipotezė

```text
H1: hostas naudoja tą patį deployment'ą kaip seed.
H2: hostas tik dalijasi common hosting ar CDN.
```

### Gate B: discriminating observable

Koks požymis geriausiai atskirs H1 nuo H2?

- exact response hash yra geriau nei tas pats ASN
- keli exact asset hash yra geriau nei panašus screenshot
- tas pats uncommon application ID yra geriau nei tas pats `nginx`
- sutampantis path, bundle ir temporal window yra geriau nei vien path.

### Gate C: source selection

Renkantis source vertinu:

| Klausimas | Kodėl svarbu |
| --- | --- |
| ką provider realiai matuoja | scan, passive DNS, user submission, telemetry ar enrichment |
| kokia coverage | regionas, laikas, portai, protokolai, planas |
| ar result yra originalus | gal visi provider cituoja tą patį upstream |
| ar query paviešins seed | public submission gali contaminate case |
| ar source leidžia istoriją | current DNS negali atsakyti už praeitą savaitę |
| ar duomenys reproducible | result ID, raw JSON, timestamp, query |

### Gate D: evidence capture

Saugau raw response prieš filtruodamas ar gražindamas. Išsaugau query, response headers, collection timestamp ir SHA-256.

### Gate E: relationship assessment

Rezultatą dedu į vieną iš būsenų:

```text
candidate  -> vertas tikrinti
supported  -> bent vienas meaningful ryšys
confirmed  -> ryšys tiesiogiai stebėtas arba pakartotinai corroborated
rejected   -> competing explanation geriau paaiškina duomenis
expired    -> anksčiau galiojęs operational IOC nebelaikomas aktyviu
```

### Gate F: next best pivot arba stop

Kitas pivotas pasirenkamas pagal **expected information gain**. Ne pagal tai, kuriame portale dar turiu kreditų.

### Pivot queue, o ne browser tabs kolekcija

Kiekvieną galimą pivotą laikau queue su trumpu pagrindimu:

| Laukas | Ką užrašyti |
| --- | --- |
| question | kokią uncertainty šis pivotas mažina |
| target hypothesis | kurią H1, H2 ar H3 jis gali atskirti |
| expected result | kokio observable ar edge tikiuosi |
| diagnosticity | ar toks rezultatas būtų retas, jei H1 neteisinga |
| source coverage | laikas, regionas, protokolas, duomenų kilmė |
| collection risk | OPSEC, privacy, contamination ir legal ribos |
| cost | laikas, API quota, analyst effort |
| decision impact | ar rezultatas pakeistų block, scope, confidence arba stop |

Formalaus pseudo-mokslo čia nereikia. Pakanka kokybinės prioritizacijos:

```text
P1  exact JS SHA-256 URLScan istorijoje
    didelis information gain, mažas collection risk, tiesiogiai testuoja deployment reuse

P2  SPKI reuse tarp jau žinomų hostų
    vidutinis information gain, gali atskirti dedicated cert nuo shared issuance

P3  visas hosting ASN
    mažas information gain, didelė shared-service noise tikimybė
```

Jeigu neįsivaizduoju, koks rezultatas pakeistų assessment, query greičiausiai nėra vertas vykdyti.

## 7. Šešios pivotų šeimos

### 7.1 Infrastructure pivotai

Domain, IP, prefix, ASN, nameserver, registrar, certificate ir passive DNS.

Geriausiai atsako į klausimą **kur ir kada veikė infrastruktūra**.

Pagrindinė klaida yra shared service paversti ownership įrodymu. Cloudflare IP, AWS ASN ar populiarus registrar savaime beveik nieko nesieja.

### 7.2 Content ir code pivotai

HTML, JavaScript, CSS, images, source maps, favicon, DOM, exact response hash, TLSH, ssdeep, imphash, icon hash.

Geriausiai atsako į klausimą **ar objektai pateikė tą patį arba panašų artefaktą**.

Exact hash įrodo byte identity. Jis neįrodo bendro operatoriaus, jei artefaktas yra viešas template arba parduodamas kit'as.

### 7.3 Behavioral ir protocol pivotai

Redirect order, API routes, WebSocket path, form schema, headers, cookie names, request graph, command-and-control protocol, retry interval.

Geriausiai atsako į klausimą **ar deployment elgiasi taip pat**.

### 7.4 Identity ir account pivotai

Registrant, email, phone, username, repository account, analytics ID, bot token identifier, code-signing subject.

Čia reikia daugiausia privacy ir attribution disciplinos. Reused account gali būti reseller, compromised account, shared service ar tyčinis false flag.

### 7.5 Temporal pivotai

Registration burst, certificate issuance, DNS changes, first seen, lure delivery, payload rotation, takedown ir reactivation.

Laiko sutapimas sustiprina kitą ryšį. Vienodas mėnuo retai yra pakankamas ryšys.

### 7.6 Ecosystem pivotai

OpenPhish, URLhaus, MalwareBazaar, VirusTotal, URLScan, Censys, Shodan, passive DNS provider, CT logs, code search ir internal telemetry.

Provider verdict yra observation apie provider duomenis. Jis nėra outsourcing'as analitiniam judgement.

### 7.7 Pivot coverage audit

Jei case stringa, tikrinu ne "kokio tool dar nepanaudojau", o kokią evidence šeimą praleidau.

| Evidence šeima | Galimi pivot objektai | Ką gali patikrinti |
| --- | --- | --- |
| DNS ir naming | A/AAAA, CNAME, NS, MX, TXT, CAA, SOA, wildcard, reverse DNS | hosting, delegation, mail ir naming reuse laike |
| routing ir service | prefix, origin ASN, ROA, port, banner, SSH key, TLS key, JA4 | infrastructure coexistence ir dedicated service reuse |
| web application | redirect state, cookies, CSP, form schema, API, WebSocket, source map | shared build, backend contract ar deployment |
| cloud ir SaaS | tenant ID, cloud account ID, bucket name, OAuth app ID, analytics ar support widget ID | common control-plane ar service-account reuse |
| code ir build | repository, package, PDB path, compiler, source-map path, chunk ID, uncommon constant | source arba build lineage |
| malware | exact hash, imports, config, mutex, named pipe, service, signer, contacted endpoint | sample identity, family ir campaign relationship |
| delivery | email headers, Message-ID pattern, sender infrastructure, SMS sender, shortener, QR destination | delivery cluster ir victim targeting |
| content ir lure | title, copy, language errors, OCR, image, favicon, DOM, payment flow | kit reuse ir localization pattern |
| identity | stable platform UID, email, phone, username, repo account, certificate subject | account reuse su attribution apribojimais |
| chronology | registration, issuance, resolution, scan, delivery, rotation, takedown, reactivation | activity thread ir operational tempo |

Ne kiekvienam case reikia kiekvienos eilutės. Bet jeigu assessment remiasi tik vienos šeimos duomenimis, confidence turi tai atspindėti.

### 7.8 Analitiniai frame nėra dekoracijos

**Diamond Model** padeda patikrinti, per kurią event dalį judame: capability, infrastructure, victim ar adversary. Techninis pivotas dažniausiai plečia capability ir infrastructure. Jis savaime neužpildo adversary kampo.

**Activity thread** sujungia atskirus events laike. Registration, certificate issuance, SMS delivery, scan observation, payload rotation ir takedown sudaro seką. Tos sekos negalima pakeisti vienu gražiu graph.

**MITRE ATT&CK** padeda normalizuoti elgesį ir kalbėti apie techniques. Jis nėra actor lookup lentelė. Dvi grupės, naudojančios tą pačią technique, netampa viena grupe.

2026 m. naudojant ATT&CK reikia tikrinti dabartinį modelį, o ne kopijuoti seną kursų skaidrę. MITRE nurodo, kad Data Sources buvo deprecated ATT&CK v18 leidime 2025 m. spalį. Mapping turi remtis aktualiais ATT&CK objektų ir detection guidance laukais, o report turi fiksuoti naudotą ATT&CK versiją.

**Competing hypotheses** naudojamos ne report pabaigoje dėl formalumo, o prieš pasirenkant kitą pivotą. Geriausias kitas query yra tas, kuris labiausiai atskiria dvi realias alternatyvas.

### 7.9 Source reliability ir information credibility nėra tas pats

Šaltinis gali būti patikimas, bet neturėti coverage konkrečiam klausimui. Silpnesnės reputacijos source gali pateikti originalų artefaktą, kurį galima nepriklausomai patikrinti.

Vertinu atskirai:

| Ašis | Klausimas |
| --- | --- |
| source reliability | ar šaltinis anksčiau pateikė tikslius, audituojamus duomenis |
| access | ar šaltinis galėjo matyti tai, ką teigia matęs |
| information credibility | ar konkretų teiginį patvirtina raw evidence ir kiti observations |
| independence | ar keli source iš tikrųjų necituoja vieno upstream |
| coverage | kokį laiką, regioną, protokolą ir objektų tipą source apima |
| timeliness | ar duomenys pakankamai švieži sprendimui |

Trys portalai, visi importuojantys tą patį feed, yra vienas evidence lineage su trimis logotipais.

#### Source lineage registras

Corroboration skaičiuoju pagal nepriklausomą collection, o ne pagal rezultatų skaičių. Jei VirusTotal relationship, vendor blog ir downstream feed visi remiasi tuo pačiu URLScan result, tai nėra trys nepriklausomi observations.

Minimalus lineage record:

```json
{
  "claim_id": "claim-0042",
  "claim": "host served artefact sha256:...",
  "display_source": "vendor-report",
  "upstream_source": "urlscan-result:01abc...",
  "sensor_type": "public-web-scan",
  "observed_at": "2026-08-11T08:12:00Z",
  "published_at": "2026-08-12T10:00:00Z",
  "collected_at": "2026-08-13T17:44:12Z",
  "coverage_note": "single scan, one vantage point",
  "independence_group": "urlscan:01abc..."
}
```

Analitinis principas paprastas: du šaltiniai yra nepriklausomi tik tada, kai jų observation kelias nepriklauso nuo to paties upstream record, submission ar sensor.

## 8. Source matrix: kur eiti pagal seed

| Turimas seed | Pirmi klausimai | Aukšto precision pivotai | Platesni candidate pivotai |
| --- | --- | --- | --- |
| full URL | redirect, response, resources, path, query | exact response ir asset hash | path template, lure text, host pattern |
| domain | registration, DNS history, cert, URLs | exact cert fingerprint, rare NS + laikas | ASN, registrar, TLD |
| IP | kas ir kada rezolvino, services | dedicated cert, unique banner | netblock, ASN |
| certificate | fingerprint, SAN, issuance | same fingerprint | issuer, subject pattern |
| JavaScript | exact bytes, source map, API routes | SHA-256, uncommon constant | fuzzy hash, framework chunk name |
| file hash | metadata, delivery, family | exact SHA-256 | imphash, TLSH, filename |
| email ar phone | reuse, delivery context | exact rare reuse su kitais artefaktais | numbering plan, provider |
| screenshot | OCR, layout, resources | pixel ar perceptual match su code ryšiu | brand ir color similarity |

![CTI seed-to-pivot mind map nuo turimo URL, domeno, IP, sertifikato, web artefakto, failo ar account iki kito pagrįsto žingsnio](/assets/img/posts/2026-08-13-pivoting-101/seed-pivot-decision-map.svg)

### 8.1 URL seed

URL nėra vien string. Jį išskaidau į scheme, userinfo, host, port, path segments, query keys, query values, fragment ir encoding. Originalas lieka evidence, canonical forma naudojama paieškai.

Pirmas pivotų rinkinys:

```text
raw URL
  -> redirect chain su timestamp
  -> kiekvieno hop status, Location ir IP
  -> final response SHA-256
  -> request graph ir third-party resources
  -> exact asset hashes
  -> rare path, query-key schema ir route pattern
  -> same artefact kituose hostuose
```

Query value dažnai yra victim-specific token. Jo neviešinu, neindeksuoju ir nenaudoju public scan. Hunt'ui dažnai užtenka query **keys** bei path shape.

### 8.2 Domain ir hostname seed

Pradedu nuo FQDN ir apex atskyrimo. Tada tikrinu RDAP events, statuses, nameserver istoriją, current ir passive DNS, MX/TXT, CT SAN, URL observations ir artefaktus.

Svarbu atskirti:

- `registered-with` nėra `controlled-by`
- `resolved-to` galioja observation lange
- `issued-for` nėra įrodymas, kad cert buvo panaudotas
- wildcard SAN gali sukurti daug pavadinimų, kurių hostai niekada neegzistavo
- NXDOMAIN šiandien nepaneigia vakar buvusio record.

### 8.3 IP, prefix ir ASN seed

IP be port, protocol ir time yra per platus seed. Pridedu RIR RDAP, origin prefix, ASN, BGP announcement istoriją, pDNS, observed services, cert, SSH host key ir banner artefaktus.

IPv4 kaimynystės pivotai yra candidate generation. `/24`, ASN ar cloud region nėra actor container. IPv6 atveju aklas prefix expansion dar mažiau prasmingas. Pirmiau ieškau reused service artefact, key arba cert, tada tikrinu, ar infrastructure dedicated.

### 8.4 Certificate ir public key seed

Skiriu tris skirtingus ryšius:

1. tas pats certificate SHA-256 reiškia tą patį DER objektą
2. tas pats SPKI SHA-256 reiškia tą patį public key, net jei certificate buvo perleistas
3. panašūs issuer, subject ar validity pattern yra tik candidate požymis.

Issuance laikas gaunamas iš CT ar certificate. Deployment laikas gaunamas iš service observation. Jie gali nesutapti.

### 8.5 HTML, JavaScript, CSS ir media seed

Pirmiausia lyginu exact bytes. Po to normalizuotą tekstą, DOM struktūrą, source map, route ir endpoint graph, uncommon constants, form field names, analytics identifiers, favicon ar image hash.

Minified bundle dažnai keičiasi dėl build ID. Todėl atskirai saugau:

- raw SHA-256
- tekstą po saugaus offline decode
- extracted URLs, hosts ir paths
- string ir identifier rinkinius
- normalized DOM ar AST fingerprint
- TLSH ar ssdeep tik candidate paieškai
- pHash ar OCR tik vizualiam corroboration.

### 8.6 File ar malware metadata seed

Exact MD5, SHA-1 ar SHA-256 pivotas ieško to paties failo. Imphash, import set, TLSH, ssdeep, section layout, signer, icon hash ir compiler artefaktai ieško giminingų failų. Tai skirtingi teiginiai.

Tada judu į delivery relationship:

```text
file hash
  -> first ir last seen
  -> delivery URL ir parent artefact
  -> contacted endpoint metadata
  -> signer ir certificate
  -> similar sample candidates
  -> campaign time window
```

Jei intelligence requirement atsakomas metadata, sample parsisiuntimas nėra privalomas profesionalumo ritualas.

### 8.7 Email, phone, username ir platform account seed

Account reuse gali būti labai diagnostic, bet attribution rizika čia didžiausia. Tikrinu exact reuse, platform UID, creation ir activity time, susietus repository ar infrastructure artefaktus ir ar account galėjo būti compromised, spoofed, resold arba shared.

Telefono šalies kodas yra numbering plan. Display name yra vartotojo kontroliuojamas tekstas. Abu yra prastas operatoriaus tapatybės įrodymas.

### 8.8 Victim, brand ir lure seed

Brand, kalba, valiuta, mokėjimo metodas, delivery kanalas ir victim geography padeda rasti campaign pattern. Bet populiarus brand generuoja copycat noise. Brand pivotą jungiu su code, infrastructure, time arba delivery artefaktu.

Victim duomenis modeliuoju atskirai nuo adversary infrastructure ir taikau minimalizavimą. Viešame report nereikia publikuoti aukos token, telefono, kortelės duomenų ar unikalaus URL vien todėl, kad jie buvo evidence pakete.

## 9. Web ir phishing infrastruktūros playbook

Ši seka nėra privalomas tool chain. Tai checklist, iš kurio pasirenkamas tas žingsnis, kuris labiausiai sumažins uncertainty.

### 9.1 Registration ir resource ownership

RDAP padeda nustatyti registrar, status, registration laiką, nameserver ir IP resource ownership.

```python
import requests

domain = "fmqr.ink"
record = requests.get(f"https://rdap.org/domain/{domain}", timeout=30).json()
print(record.get("handle"))
print(record.get("status"))
print(record.get("events"))
print(record.get("nameservers"))
```

Registration burst gali būti naudingas, jei sutampa laikas, registrar, nameserver, naming pattern ir content. Vien registrar yra silpnas signalas.

### 9.2 DNS ir passive DNS

Current DNS yra dabartinė nuotrauka. Passive DNS yra provider sukaupta istorija.

```python
import dns.resolver

for record_type in ("A", "AAAA", "CNAME", "MX", "NS", "TXT"):
    try:
        answers = dns.resolver.resolve("fmqr.ink", record_type)
        print(record_type, [str(x) for x in answers])
    except Exception as exc:
        print(record_type, type(exc).__name__)
```

Svarbūs edge yra `domain resolved-to IP during window` ir `domain used-nameserver NS during window`. Ne `domain belongs-to IP owner`.

### 9.3 Certificate Transparency

CT log gali parodyti SAN, wildcard ir issuance laiką. Jis nerodo privataus sertifikato, ne visada parodo realų deployment laiką ir neįrodo control, jei certificate automation ar shared platform generuoja cert visiems klientams.

### 9.4 Public scan ir response artefaktai

URLScan ar kitas public scan leidžia tirti jau užfiksuotą request graph, DOM, screenshot ir response hash. Privacy nustatymas pasirenkamas prieš submission. Privatus incident URL su token neturi automatiškai tapti public scan.

Query ladder:

```text
1. exact full response SHA-256
2. keli exact asset SHA-256
3. exact artefaktas siaurame date window
4. artefaktas + uncommon path ar request
5. uncommon string + technology
6. DOM, favicon ar visual similarity
7. certificate, IP, NS ar ASN tik su papildomu požymiu
```

Kiekvienas žingsnis žemyn didina recall ir mažina precision.

### 9.5 Static code analysis

Jau išsaugotuose HTML ir JS ieškau URL, paths, WebSocket, API routes, form fields, analytics IDs, source-map komentarų ir failų vardų. Kodo nevykdau.

```python
from pathlib import Path
import hashlib
import re

body = Path("case/raw/app.js").read_bytes()
text = body.decode("utf-8", errors="replace")

print("sha256", hashlib.sha256(body).hexdigest())
for pattern in (
    r"https?://[^\s'\"<>]+",
    r"wss?://[^\s'\"<>]+",
    r"/[A-Za-z0-9._~!$&'()*+,;=:@%/-]{3,}",
    r"sourceMappingURL=([^\s]+)",
):
    print(pattern, sorted(set(re.findall(pattern, text))))
```

Pastaba dėl `;` regex viduje paprasta. Tai URL character class, ne bandymas skambėti kaip konsultantui LinkedIn'e.

### 9.6 Evidence capture turi būti reproducible

Screenshot yra geras komunikacijai, bet prastas vienintelis evidence. Kiekvienam svarbiam response saugau raw body, metadata ir hash. Derived failas niekada neperrašo raw.

```python
from datetime import datetime, timezone
from hashlib import sha256
from pathlib import Path
import json

def register_file(path: str, source: str, query: str) -> dict:
    item = Path(path)
    digest = sha256(item.read_bytes()).hexdigest()
    record = {
        "path": item.as_posix(),
        "sha256": digest,
        "bytes": item.stat().st_size,
        "source": source,
        "query": query,
        "collected_at": datetime.now(timezone.utc).isoformat(),
    }
    with Path("case/evidence.jsonl").open("a", encoding="utf-8") as out:
        out.write(json.dumps(record, ensure_ascii=False) + "\n")
    return record
```

Evidence directory modelis:

```text
case/
  00-case.yaml              # PIR, scope, TLP, constraints
  raw/                      # originalūs provider responses ir artefaktai
  normalized/               # canonical URLs, extracted records
  derived/                  # graph, timelines, hashes, screenshots
  queries/                  # query text ir API parameters
  evidence.jsonl            # provenance registras
  assessments/              # hypotheses, confidence, stop notes
```

### 9.7 TLS pivotas neprisirišant prie vien certificate

Jau išsaugotame PEM galima offline apskaičiuoti certificate ir SPKI fingerprint. SPKI reuse dažnai išgyvena certificate renewal, bet shared reverse proxy arba valdymo platforma ir čia lieka alternatyva.

```python
from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from hashlib import sha256
from pathlib import Path

pem = Path("case/raw/server-cert.pem").read_bytes()
cert = x509.load_pem_x509_certificate(pem)
der = cert.public_bytes(serialization.Encoding.DER)
spki = cert.public_key().public_bytes(
    serialization.Encoding.DER,
    serialization.PublicFormat.SubjectPublicKeyInfo,
)

print("certificate_sha256", sha256(der).hexdigest())
print("spki_sha256", sha256(spki).hexdigest())
print("serial", hex(cert.serial_number))
print("not_before", cert.not_valid_before_utc.isoformat())
print("not_after", cert.not_valid_after_utc.isoformat())
```

Dar tikrinu SAN set, issuer chain, key algorithm, validity trukmę, serial pattern ir CT issuance burst. Bendras Let's Encrypt issuer nėra ryšys. Tas pats uncommon SPKI tinkamu laiku jau yra daug įdomiau.

### 9.8 HTTP, redirect ir application fingerprint

Response similarity neturi apsiriboti page title. Iš jau surinktų records modeliuoju:

- status ir redirect seką
- header vardus, ne vien reikšmes
- cookie names ir flags
- content type, length ir compression
- body bei atskirų asset exact hash
- CSP, CORS ir cache policy
- HTML form action bei field schema
- API, WebSocket, GraphQL ir source-map paths
- error page ir framework-specific headers
- request dependency graph.

Vienas `Server: nginx` nieko neįrodo. Tas pats retas cookie vardas, identiška redirect state machine ir keli exact asset hash jau testuoja bendrą deployment.

### 9.9 Artefaktų similarity matuoti keliais sluoksniais

Similarity turi turėti feature set ir paaiškinimą. Paprastas Jaccard palyginimas gali būti naudingas triage, jei analyst mato, kokie elementai sutapo:

```python
def jaccard(left: set[str], right: set[str]) -> float:
    union = left | right
    return len(left & right) / len(union) if union else 1.0

a = {"/api/init", "/assets/app.js", "session_key", "parking_id"}
b = {"/api/init", "/assets/app.js", "session_key", "victim_id"}

print("similarity", round(jaccard(a, b), 3))
print("shared", sorted(a & b))
print("only_a", sorted(a - b))
print("only_b", sorted(b - a))
```

Threshold nėra universalus. Jį kalibruoju su known-positive ir known-negative pavyzdžiais. Library code, boilerplate ir CDN assets prieš lyginimą down-weight'inami arba pašalinami. Kitaip algoritmas puikiai atras, kad pusė interneto naudoja Bootstrap.

### 9.10 Network ir routing kontekstas

IP pivotui saugau ne tik ASN vardą. Svarbūs RIR allocation, origin prefix, BGP first ir last observed, announcement pokyčiai, ROA state, reverse DNS ir hosting modelis.

Naudingi klausimai:

- ar IP tuo metu buvo paskelbtas to paties origin ASN
- ar prefix perėjo kitam operatoriui
- ar host buvo CDN edge, shared hosting, VPS ar dedicated service
- ar keli suspicious services atsirado tuo pačiu siauru time window
- ar pDNS ir service observations turi persidengiantį laiką
- ar route collector coverage pakankama neigiamai išvadai.

BGP relationship yra control-plane kontekstas. Jis neįrodo application operatoriaus. IP geolocation yra provider assessment ir neturi būti naudojamas žmogaus lokacijai nustatyti.

### 9.11 Passive, active ir internal collection nemaišyti

Label'inu collection method:

```text
passive    RDAP, CT, pDNS, existing scan, feed, archived artefact
active     analyst initiated DNS, HTTP, TLS ar service interaction
internal   SIEM, EDR, proxy, mail gateway, DNS resolver telemetry
reported   trečios šalies claim be analitikui prieinamo raw observation
```

Kiekvienas metodas turi kitą visibility ir contamination riziką. Šiame vadove techniniai pavyzdžiai remiasi passive sources arba jau išsaugotais artefaktais. Authorization active collection darbams turi būti atskirai apibrėžtas.

### 9.12 Kada active recon iš tikrųjų pagerina pivoting

Passive duomenys dažnai parodo, ką kažkas matė vakar. Active collection gali patikrinti, ką target pateikia dabar, ar candidate dar galioja ir ar du hostai vienodai reaguoja į tą patį saugų request. Tai yra vertinga, kai atsakymas keičia cluster membership, incident scope arba confidence.

Tačiau internet-facing nėra sinonimas "gavau leidimą testuoti". Active DNS, HTTP ar TLS request jau yra interaction. Port scanning, virtual-host enumeration, directory discovery, malformed requests, authentication testing ir exploitation didina poveikį. Jiems reikia aiškaus owner authorization ir rules of engagement.

#### Collection escalation ladder

Judėjimas aukštyn nėra automatinis. Kiekvienas lygis turi atskirą gate.

| Lygis | Collection tipas | Ką gali duoti pivoting | Ko reikia prieš pradedant |
| --- | --- | --- | --- |
| 0 | passive records, archives, CT, pDNS, existing scans | candidate discovery ir istorinis kontekstas | case scope ir source-handling taisyklės |
| 1 | low-impact DNS, vienas TLS handshake, ribotas HEAD ar GET | dabartinis resolution, cert, redirect, header ir artefact validation | target allowlist, laiko langas, rate limit, evidence plan |
| 2 | platesnis service, vhost, route ar content discovery | hidden service, backend contract ir attack-surface relationship | rašytinis owner leidimas, request budget, monitoring ir abort kontaktas |
| 3 | state-changing test su test account ar synthetic data | patvirtina workflow, access boundary arba backend relationship | atskiras test plan, test data, rollback ir incident coordination |
| 4 | exploitation, payload delivery arba privilege testing | gali patvirtinti realų capability ir impact | aiškiai įvardytas exploitation scope, izoliuota infrastruktūra ir atsakingi asmenys |

CTI tyrime dažniausiai pakanka 0 arba 1 lygio. 2–4 lygiai jau artėja prie attack-surface assessment, penetration test arba red-team darbo. Tai gali praturtinti CTI, bet neturi tyliai atsirasti vien todėl, kad analyst moka naudoti Nmap ar Burp.

#### Minimalūs rules of engagement

Prieš active collection užrašau:

```yaml
authorizing_party: Turto savininkas arba aiškiai įgaliotas atstovas
scope:
  hosts: ["research.example.invalid"]
  ports: [443]
  protocols: ["dns", "tls", "https"]
allowed:
  - viena DNS rezoliucija
  - TLS certificate capture
  - HEAD ir ribotas GET į jau žinomus paths
prohibited:
  - credential guessing
  - form submission
  - file upload
  - persistence
  - denial of service
window_utc: "2026-08-14T18:00:00Z/2026-08-14T19:00:00Z"
rate_limit: "1 request/second, 100 requests maximum"
source_addresses: ["192.0.2.40"]
abort_contact: "security@example.invalid"
data_handling: "TLP:AMBER, encrypted evidence store, 30-day review"
```

Scope turi apibrėžti ne tik domeną. Reikia hostų, IP interpretavimo, portų, protokolų, cloud ar CDN ribų, test accounts, third-party dependencies ir ar redirect į kitą organizaciją turi būti sekamas. Automatinis redirect gali išvesti už scope greičiau, negu spėsi pasakyti "bet requests biblioteka pati".

#### OPSEC modelis analitikui

OPSEC tikslas nėra apsimesti threat actor. Tikslas yra kontroliuoti, ką collection atskleidžia, nepadaryti žalos ir gebėti atskirti savo traffic nuo adversary ar kitų tyrėjų traffic.

| Sritis | Kontrolė | Kokią klaidą apsaugo |
| --- | --- | --- |
| identity | nenaudoti personal account, browser profile, telefono ar kasdienio el. pašto | investigator tapatybės ir kitų case nutekėjimas |
| network | paskirtas egress, fiksuotas source IP, atskiras DNS resolver, IPv6 ir WebRTC kontrolė | netyčinis organizacijos ar home IP disclosure |
| endpoint | izoliuota VM ar container, atskiras browser profile, jokių asmeninių cookies | cross-case contamination ir drive-by rizika |
| application | JavaScript off pagal default, no form submit, download blokavimas, redirect cap | state change, payload gavimas ir out-of-scope request |
| credentials | test accounts ir synthetic data tik kai autorizuota | realių credentials ar victim duomenų contamination |
| timing | ROE window, UTC timestamps, jitter tik jei suderinta | operatoriaus alert ir nepaaiškinama telemetry |
| attribution | stabilus collector ID evidence faile, source address deconfliction | savo scan palaikymas threat activity |
| disclosure | public scan privacy patikrinta prieš submit | token, victim ar private hostname paviešinimas |

VPN yra transporto kontrolė, ne authorization ir ne nematomumo apsiaustas. DNS resolver, browser fingerprint, TLS handshake, cookies, API account, public-scan history, request timing ir vėlesnė publikacija vis tiek gali susieti veiksmus. Dedicated research egress turi būti suderintas su organizacijos legal ir incident-response komanda.

#### Offensive-security use cases pivoting procese

| Use case | Active veiksmas | Koks relationship tikrinamas | Svarbi riba |
| --- | --- | --- | --- |
| candidate validation | ribotas DNS, TLS ir HTTP capture | `host currently-serves artefact` | dabartinė būsena nepakeičia istorinės observation |
| CDN ar origin atskyrimas | autorizuotas SNI ir Host palyginimas žinomuose endpoint | `hostname routed-to service` | nebandyti išvengti security control be leidimo |
| virtual-host patikra | konkretūs, iš passive evidence gauti hostnames | `IP served hostname during collection` | brute-force wordlist reikia platesnio scope |
| application fingerprint | saugūs request į jau žinomus paths | `deployment behaves-like deployment` | malformed ir state-changing request yra aukštesnis lygis |
| route ir API mapping | source map bei JS rastų read-only endpoint validation | `artefact references reachable endpoint` | nekurti account, nesiųsti PII ar fake payment |
| authentication boundary | test account ir iš anksto aprašytas workflow | `service shares identity backend` | jokio password spray ar realių account |
| vulnerability correlation | version ir configuration observation | `service may-be-affected-by CVE` | version match nėra exploitation proof |
| controlled exploitation | vienas aiškiai scope'intas proof su stop condition | `exposure enables capability` | tik atskiro pentest ar red-team authorization ribose |

Offensive technique geriausiai padeda tada, kai ji testuoja konkretų competing explanation. Pavyzdžiui, saugus SNI palyginimas gali parodyti, kad du hostai dalijasi tik CDN edge, o ne backend. Exact response ir cookie-state palyginimas gali parodyti tą patį deployment. Akla viso prefix scan greičiausiai pagamins daugiau triukšmo negu intelligence.

#### Bounded active collector pavyzdys

Žemiau esantis pavyzdys skirtas tik iš anksto autorizuotam hostui. Jis turi hard allowlist, neleidžia automatinio redirect, riboja body dydį ir nevykdo JavaScript.

```python
from hashlib import sha256
from urllib.parse import urlsplit
import time
import requests

ALLOWED_HOSTS = {"research.example.invalid"}
MAX_BODY = 1_000_000

def collect(url: str) -> dict:
    parsed = urlsplit(url)
    if parsed.scheme != "https" or parsed.hostname not in ALLOWED_HOSTS:
        raise ValueError("target is outside the written allowlist")

    response = requests.get(
        url,
        headers={"User-Agent": "Authorised-Research/1.0"},
        timeout=(5, 15),
        allow_redirects=False,
        stream=True,
    )

    body = bytearray()
    for chunk in response.iter_content(16_384):
        body.extend(chunk)
        if len(body) > MAX_BODY:
            raise ValueError("response exceeded collection limit")

    time.sleep(1)
    return {
        "url": url,
        "status": response.status_code,
        "location": response.headers.get("Location"),
        "headers": dict(response.headers),
        "body_sha256": sha256(body).hexdigest(),
        "bytes": len(body),
    }
```

Real case'e collector papildomai rašo UTC collection time, source address, collector version, request ID ir raw evidence path. Redirect vertinamas kaip naujas target. Jis sekamas tik tada, jei patenka į allowlist.

#### Recon contamination ir deconfliction

Active collection gali:

- sukurti naują access log observation
- aktyvuoti vienkartinį token arba kit'o state
- pakeisti first-seen laiką downstream provider
- išprovokuoti payload rotation, geoblocking arba takedown
- paleisti WAF, IDS ar fraud automation
- būti nuskenuotas kito provider ir vėliau grįžti kaip "naujas threat signal".

Todėl savo source IP, User-Agent, collection window ir request ID laikau deconfliction registre. Derived intelligence turi pažymėti, kurie observations egzistavo prieš analitiko interaction ir kurie galėjo atsirasti dėl jo.

Abortinu collection, jei target išeina už scope, service sveikata blogėja, atsiranda netikėti sensitive duomenys, gaunamas provider ar owner prašymas sustoti, suveikia rate limit arba kitas request nebeturi decision value.

## 10. OpenPhish, URLhaus ir MalwareBazaar kaip papildomi pivotai

Šie šaltiniai naudojami tada, kai jų coverage atitinka klausimą. Ne todėl, kad jie egzistuoja bookmark'uose.

### 10.1 OpenPhish

[OpenPhish Community Feed](https://openphish.com/phishing_feeds.html) yra ribotas tekstinis active-phishing URL feed, atnaujinamas kas 12 valandų. Jis naudingas:

- exact seed ar host corroboration
- to paties apex kitų path paieškai
- lure ir hosting pattern candidate discovery
- brand abuse trend stebėjimui.

Seed nebuvimas nėra clean verdict. Feed nėra pilnas istorinis archyvas ir URL nereikia atidarinėti.

```python
from urllib.parse import urlsplit
import requests

feed = requests.get("https://openphish.com/feed.txt", timeout=30)
feed.raise_for_status()

hosts = {
    (urlsplit(line.strip()).hostname or "").lower()
    for line in feed.text.splitlines()
    if line.strip() and not line.startswith("#")
}
print("seed host present:", "unipark.fmqr.ink" in hosts)
```

Šis kodas atlieka vieną request į OpenPhish feed. Jis neatlieka request į feed'e esančius URL.

### 10.2 URLhaus

[URLhaus](https://urlhaus.abuse.ch/about/) skirtas URL, kurie tiesiogiai platina malware. Credential phishing puslapis be payload nepatenka į tą patį use case.

URLhaus naudoju, kai jau turiu:

- payload download URL
- exact payload hash
- host ar IP, apie kurį reikia malware delivery history
- filename, signature, TLSH, ssdeep ar imphash.

Ryšio grandinė:

```text
download request
  -> URLhaus URL observation
  -> exact payload SHA-256
  -> kiti URL, serve'inę tą patį payload
  -> delivery host ir IP istorija
  -> MalwareBazaar metadata
```

API versija ir authentication gali keistis, todėl endpoint imu iš [dabartinės URLhaus API dokumentacijos](https://urlhaus.abuse.ch/api/). Payload nesiunčiu ir neparsisiunčiu.

### 10.3 MalwareBazaar

[MalwareBazaar](https://bazaar.abuse.ch/api/) šiame workflow naudojamas tik jau turimo MD5, SHA-1 ar SHA-256 metadata query.

```python
import os
import requests

sha256 = "0" * 64  # pakeisti jau turimu hash
response = requests.post(
    "https://mb-api.abuse.ch/api/v1/",
    headers={"Auth-Key": os.environ["ABUSECH_AUTH_KEY"]},
    data={"query": "get_info", "hash": sha256},
    timeout=30,
)
response.raise_for_status()
metadata = response.json()
```

Toliau pivotinu per exact SHA-256, imphash, TLSH, icon dhash, signature, code-signing certificate ir first ar last seen. Exact hash yra exact file ryšys. TLSH ar imphash yra candidate-generating ryšys.

Šioje laboratorijoje:

```text
nenaudoti query=get_file
neparsisiųsti recent ar batch samples
neatidaryti payload URL
nevykdyti ir nedetonuoti failo
nevadinti fuzzy match exact match
```

## 11. Candidate discovery nėra cluster membership

Objektai pereina per keturis skirtingus lygius.

### Level 1: candidate

Objektas turi vieną silpną ar vidutinį bendrą požymį. Pavyzdžiui tas pats ASN ar panašus path.

### Level 2: supported relationship

Yra meaningful edge, pavyzdžiui exact asset hash arba domain-to-IP observation tinkamu laiku.

### Level 3: cluster membership

Keli nepriklausomi arba vienas labai stiprus ir kontekstinis relationship atitinka cluster inclusion rule.

### Level 4: attribution

Cluster susiejamas su operatoriumi, persona ar intrusion set. Tam paprastai reikia daugiau nei techninio infrastructure reuse.

### Inclusion rule užrašyti prieš clustering

UNIPARK atveju core inclusion rule galėjo būti:

```text
CONFIRMED CORE, jei public scan turi exact core JS SHA-256
IR bent du iš:
  exact papildomo JS ar CSS SHA-256
  tą patį uncommon /console request pattern
  tą pačią application route ir build struktūrą
  tą patį deployment temporal window
```

Broad candidate rule galėjo būti:

```text
CANDIDATE, jei yra panašus parking lure, layout ar path
IR bent vienas infrastructure ar code požymis
BET nėra exact core artefakto
```

Rule nėra gamtos dėsnis. Jis yra audituojamas tyrimo sprendimas.

## 12. Nenaudoti aklo balų skaičiavimo

`same ASN = 1`, `same favicon = 2`, `same hash = 5` atrodo patogu, bet skaičiai gali paslėpti blogą logiką. Penki correlated weak signals netampa penkiais independent sources.

Geriau naudoti evidence klasę:

| Klasė | Pavyzdys | Naudojimas |
| --- | --- | --- |
| direct | scan response turi exact hash | patvirtina observation |
| strong | keli exact deployment artefaktai | core cluster membership |
| supporting | sutampantis uncommon path ir laikas | sustiprina strong edge |
| contextual | ASN, registrar, TLD | paaiškina aplinką |
| contradictory | skirtingas core code ir nesutampantis laikas | mažina membership confidence |

Svarbiausia yra ne balų suma, o **diagnosticity**. Ar šis įrodymas būtų tikėtinas ir tuo atveju, jei H1 būtų neteisinga?

## 13. Graph analizė be gražios apgaulės

Graph padeda matyti struktūrą, bet jis taip pat lengvai sukuria iliuziją, kad visi nodes centre priklauso tam pačiam actor.

Minimalus modelis Python:

```python
import networkx as nx

g = nx.MultiDiGraph()
g.add_node("host:unipark.fmqr.ink", kind="hostname", status="seed")
g.add_node("sha256:7068...", kind="file-hash", status="observed")
g.add_edge(
    "host:unipark.fmqr.ink",
    "sha256:7068...",
    relationship="served",
    observed_at="2026-08-11T08:12:00Z",
    source="urlscan",
    evidence="case/raw/urlscan-result.json",
    confidence="high",
)
nx.write_graphml(g, "case/derived/pivot.graphml")
```

Graph QA:

- ar kiekvienas edge turi veiksmažodį
- ar edge turi timestamp
- ar source yra originalus, ar provider echo
- ar node status atskiria candidate nuo confirmed
- ar shared provider node nesukūrė dirbtinio mega-cluster
- ar transitive ryšys nebuvo automatiškai paverstas direct ryšiu
- ar rejected nodes liko audit trail.

Jei A dalijasi IP su B, o B dalijasi favicon su C, tai nereiškia, kad A susijęs su C. Graph traversal nėra įrodymas.

### 13.1 Graph turi būti typed, temporal ir provenance-aware

Viename plane sumetęs domain, IP, hash, actor ir report gausiu gražų, bet analitiškai nešvarų spaghetti. Naudoju object types ir leidžiamus edge tipus. Pavyzdžiui `domain resolved-to IP`, o ne `domain linked-to actor` per tris nematomus žingsnius.

Praktiškai laikau bent tris views:

1. **evidence graph**, kuriame yra visi observations, provider records ir lineage
2. **analytical graph**, kuriame tik supported bei confirmed relationships
3. **operational view**, kuriame tik dar aktyvūs detection ar blocking objektai.

Tai apsaugo nuo situacijos, kai expired DNS edge vis dar vizualiai laiko cluster kartu.

### 13.2 High-degree nodes down-weight'inti

Cloudflare IP, Google Analytics ID iš bendro template, populiarus favicon ar public resolver gali turėti tūkstančius edges. Jie yra hub ne todėl, kad yra campaign centras.

Prieš community detection arba projection:

- pažymiu shared-provider nodes
- skaičiuoju feature prevalence background rinkinyje
- retus features vertinu stipriau negu dažnus
- nedarau host-to-host projection per generic nodes
- peržiūriu, kuris konkretus edge sujungė communities.

Connected component atsako tik "ar egzistuoja kelias". Ji neatsako "ar visi objektai priklauso tai pačiai operacijai". Degree centrality gali parodyti populiarų service. Betweenness gali parodyti artefaktą, per kurį du cluster atrodo sujungti. Nei viena metrika pati nėra attribution.

### 13.3 Temporal slicing prieš clustering

Graph skaidau į laiko langus pagal kampanijos greitį. Fast-flux ar smishing gali reikalauti valandų ar dienų. Ilgalaikė malware infrastructure gali reikalauti savaičių.

```python
from collections import defaultdict
from datetime import datetime, timezone

events = [
    {"object": "host:a", "observed_at": "2026-08-04T08:12:00Z"},
    {"object": "host:b", "observed_at": "2026-08-04T19:42:00Z"},
]

by_day = defaultdict(list)
for event in events:
    ts = datetime.fromisoformat(event["observed_at"].replace("Z", "+00:00"))
    by_day[ts.astimezone(timezone.utc).date().isoformat()].append(event["object"])

for day, objects in sorted(by_day.items()):
    print(day, sorted(objects))
```

Ieškau registration ir issuance burst, synchronized DNS changes, asset rotation, quiet period ir reactivation. Temporal co-occurrence sustiprina kitą uncommon ryšį. Vienodas first-seen provider gali reikšti tik batch ingestion.

### 13.4 Negative evidence yra source-bound

"Nėra pDNS" turi būti perrašyta į "provider X pagal query Y 2026-08-14 negrąžino observations". Negative result vertė priklauso nuo:

- provider retention ir sensor coverage
- account tier bei result limits
- query normalizavimo
- ar ieškota host, apex, URL ar hash
- kada record galėjo būti ingest'intas
- ar target naudojo protokolą, kurį source apskritai mato.

Negative evidence gali silpninti hipotezę tik tada, kai source turėjo realią galimybę pamatyti laukiamą signalą.

## 14. Competing hypotheses ir disconfirmation

Kiekvienam svarbiam assessment užrašau bent vieną alternatyvą.

| Hipotezė | Tikėtini observations | Kas ją silpnintų |
| --- | --- | --- |
| H1 tas pats operatorius | reuse across accounts, timing, control artefacts, operational behavior | kit'as viešai parduodamas, skirtingi operatorių identifiers |
| H2 tas pats phishing kit'as, keli operatoriai | exact code, skirtinga delivery ir account infrastruktūra | bendri private control artefaktai ir koordinuotas laikas |
| H3 shared hosting coincidence | tas pats IP ar ASN, skirtingas content | keli exact uncommon artefaktai |
| H4 scanner contamination | requests ir headers būdingi scanner | tie patys požymiai internal telemetry ar kituose independent scans |

Analitikas turi aktyviai ieškoti to, kas jo mėgstamą hipotezę sugadintų. Confirmation bias irgi moka naudotis URLScan.

### ACH-lite matrica sprendimui, ne dekoracijai

Dideliame tyrime evidence dedu prieš visas realias hipotezes. Žymėjimas rodo consistency, o ne matematinę tikimybę.

| Evidence | H1 tas pats deployment | H2 bendras kit'as | H3 shared provider | H4 scanner contamination |
| --- | --- | --- | --- | --- |
| keturi exact build artefaktai | ++ | ++ | -- | - |
| skirtingi account identifiers | - | ++ | 0 | 0 |
| tas pats dedicated SPKI tuo pačiu metu | ++ | + | - | - |
| tik tas pats ASN | 0 | 0 | ++ | 0 |
| signalas matomas tik vieno scanner requests | 0 | 0 | 0 | ++ |
| internal telemetry patvirtina endpoint | ++ | + | - | -- |

`++` stipriai consistent, `+` consistent, `0` nediskriminuoja, `-` inconsistent, `--` stipriai inconsistent.

Svarbiausia ieškoti ne hipotezės su daugiausia pliusų, o hipotezės, kuri turi mažiausiai sunkiai paaiškinamų prieštaravimų. Evidence įrašai turi rodyti tą patį raw šaltinį tik vieną kartą, net jei jį pakartojo penki portalai.

## 15. Confidence rašyti apie konkretų judgement

Confidence nėra source reputation žvaigždučių vidurkis. Jis apibūdina, kiek tvirtas konkretus judgement pagal evidence kokybę, corroboration, gaps ir alternatyvas.

### High confidence

Keli aukštos kokybės, pakankamai nepriklausomi įrodymai. Alternatyvos apsvarstytos ir silpniau paaiškina facts.

### Moderate confidence

Evidence patikimas, bet coverage ribota, trūksta vieno svarbaus ryšio arba lieka reali alternatyva.

### Low confidence

Fragmentiški, netiesioginiai ar vieno provider duomenys. Judgement naudingas kaip hypothesis, ne kaip faktas.

Rašau taip:

> Su high confidence vertinu, kad 126 hostai viešų scan metu pateikė tą patį core web artefaktą. Su moderate confidence vertinu, kad didelė jų dalis priklausė tam pačiam kit family. Neturiu pakankamai duomenų teigti, kad visus hostus valdė vienas operatorius.

Tai trys skirtingi judgement. Vienas bendras `confidence: high` visam report būtų per daug patogus.

## 16. Attribution ladder

Attribution daroma pakopomis:

```text
same observable
  -> same artefact
  -> same deployment
  -> same infrastructure cluster
  -> same campaign
  -> same operational persona
  -> same operator or organisation
  -> state-sponsorship assessment
```

Kiekviena pakopa reikalauja naujos rūšies evidence. Exact JS hash gali priartinti prie `same deployment`, bet neperšoka iki žmogaus ar valstybės.

Telefono šalies kodas parodo numbering plan. IP geolocation parodo duomenų bazės assessment apie IP. Abu dalykai labai prastai skaito pasus.

## 17. Kada nustoti pivotinti

Stop nėra tinginystė. Tai collection discipline.

Stoju, kai:

- PIR atsakytas pakankamu confidence
- nauji rezultatai dvi iteracijas nekeičia sprendimo
- lieka tik shared hosting ar generic technology pivotai
- kitas žingsnis peržengtų legal, OPSEC ar authorization ribą
- collection cost viršija expected information gain
- candidate queue auga, bet precision nebeauga
- operational IOC paseno ir reikia pereiti į monitoring.

Stabdymo note:

```text
Stopped 2026-08-13T20:30Z.
Reason: exact artefact set stabilizavosi, nauji ASN pivotai generavo tik shared-hosting candidates.
Remaining gap: nėra patikimo operator identity evidence.
Revisit trigger: naujas exact core hash sighting, payload hash arba control-account reuse.
```

### IOC ir relationship lifecycle

IOC nėra amžina tatuiruotė. Kiekvienam operational objektui priskiriu lifecycle:

```text
candidate -> validated -> active -> monitor -> expired
                         \-> sinkholed
                         \-> false-positive
                         \-> superseded
```

`last_seen` nėra automatinė expiry data. Review interval priklauso nuo observable tipo ir infrastructure greičio. URL gali būti naudingas valandas, dedicated certificate mėnesius, o technique lieka knowledge base ilgiau. Historical relationship graph objekte išlaikomas net tada, kai blocking sąraše jo nebėra.

Revisit trigger gali būti naujas sighting, DNS change, cert issuance, payload relationship, source correction arba reikšmingas collection coverage pasikeitimas.

## 18. UNIPARK case study: kaip turi atrodyti analitinis kelias

![UNIPARK smishing tyrimo pivot graph nuo seed iki platesnio kit'o clusterio](/assets/img/posts/2026-08-13-pivoting-101/unipark-pivot-graph.svg)

### Iteracija 1: seed qualification

Seed buvo SMS URL su brand lure. Originalas išsaugotas. Aktyvus form submission uždraustas. PIR buvo surasti susijusius deployment'us, o ne nustatyti SMS siuntėjo pilietybę.

### Iteracija 2: root ir infrastructure context

URL išskaidytas į host, apex ir path. RDAP, DNS bei CT suteikė registration, resolution ir certificate kontekstą. Šie signalai suformavo candidate queue, bet ne core cluster.

### Iteracija 3: strongest available artefact

Iš public scan response buvo išsaugoti HTML, JS ir CSS hash. Keturi sutampantys build artefaktai turėjo daug didesnę diagnostic value negu ASN ar registrar.

### Iteracija 4: exact hash expansion

URLScan exact response hash paieška davė 163 scan records ir 126 unikalius hostus. Claim buvo tiksliai apribotas:

> 126 hostai viešuose scan records pateikė tą patį core artefaktą.

Ne 126 aukos. Ne 126 operatoriai. Ne 126 pavogtos kortelės.

### Iteracija 5: behavioral corroboration

Uncommon `/console` request kartu su konkrečiu bundle ir kitais asset hash sustiprino deployment relationship. Vienas `/console` path būtų per platus.

### Iteracija 6: cluster separation

Exact core grupė atskirta nuo broader parking-lure kandidatų. Panašūs screenshot, shared provider ir IP neighborhood liko contextual arba candidate lygmenyje.

### Iteracija 7: competing explanation

Likusi alternatyva buvo multi-tenant arba parduodamas kit'as. Todėl assessment apsiribojo kit family ir deployment reuse. Single-operator attribution nebuvo daroma.

### Iteracija 8: stop ir monitoring

Tolesni ASN ir registrar pivotai mažino precision. Stop condition pasiekta. Revisit trigger paliktas naujam exact hash, payload ar account reuse.

## 19. Produkto struktūra

Geras CTI deliverable turi kelis sluoksnius.

### Executive judgement

Trumpai atsako, kas įvyko, ką tai reiškia, koks confidence ir ką daryti.

### Analytical body

Paaiškina evidence, relationships, alternative hypotheses, gaps ir chronology.

### IOC annex

Machine-readable objektai su:

- type ir value
- first ir last observed
- source
- confidence
- cluster status
- expiration arba review date
- detection ar blocking suitability.

### Evidence index

Raw filenames, SHA-256, query, source URL, collection timestamp ir analyst note.

### Collection gaps

Kas nebuvo matoma, kokių planų ar sensor coverage trūko ir ko negalima teigti.

### Peer review ir deconfliction

Prieš release kitas analitikas turi sugebėti:

- atkurti svarbiausius query iš evidence index
- paaiškinti kiekvieną high-impact edge
- rasti, kurie source nėra nepriklausomi
- patikrinti inclusion ir exclusion taisykles
- perskaityti judgement be IOC priedo ir suprasti confidence
- identifikuoti, kur fact buvo paverstas assessment
- patvirtinti, kad report nepaviešina victim, token ar sensitive source duomenų.

Jei organizacijoje keli analitikai tiria tą pačią infrastruktūrą, deconfliction apsaugo nuo dvigubo collection, public submission contamination ir situacijos, kai dvi komandos viena kitos scan pavadina threat actor aktyvumu.

## Analitiko checklist

```text
[ ] Žinau decision need ir PIR
[ ] Užfiksavau collection bei prohibited actions
[ ] Išsaugojau originalų seed ir provenance
[ ] Atskyriau observation nuo assessment
[ ] Kiekvienas edge turi tipą, laiką, source ir evidence
[ ] Candidate nėra automatiškai cluster member
[ ] Current state nepavadinau istorija
[ ] Provider absence nepavadinau clean verdict
[ ] Patikrinau source independence
[ ] Užrašiau bent vieną competing hypothesis
[ ] Confidence priskyriau konkrečiam judgement
[ ] Exact artefact nepaverčiau operator attribution
[ ] IOC turi expiry arba review date
[ ] Žinau, kodėl sustojau ir kas trigger'ins revisit
```

## Pagrindinė pamoka

Profesionalus pivoting nėra kuo daugiau rows surinkimo varžybos.

Geras graph nėra didžiausias. Geras graph yra tas, kuriame gali paaiškinti kiekvieną edge, jo laiką, source, alternatyvą ir kodėl jis reikalingas sprendimui.

Įrankis suranda result. Analitikas nusprendžia, ar tai observation, relationship, cluster evidence, ar tiesiog dar vienas interneto kaimynas.

## Šaltiniai ir metodikos pagrindas

1. [Pilnas HECAVEX UNIPARK smishing tyrimas](/lt/tyrimai/unipark-smishing-infrastrukturos-tyrimas/)
2. [OASIS STIX 2.1, graph, observable ir relationship modelis](https://docs.oasis-open.org/cti/stix/v2.1/stix-v2.1.html)
3. [ODNI ICD 203 Analytic Standards](https://www.odni.gov/files/documents/ICD/ICD-203.pdf)
4. [NIST SP 800-150 Guide to Cyber Threat Information Sharing](https://csrc.nist.gov/pubs/sp/800/150/final)
5. [FIRST Traffic Light Protocol 2.0](https://www.first.org/tlp/)
6. [RDAP.org naudojimo aprašymas](https://about.rdap.org/)
7. [URLScan Search API dokumentacija](https://urlscan.io/docs/search/)
8. [URLScan API ir safe-submission gairės](https://urlscan.io/docs/api/)
9. [OpenPhish Community Feed aprašymas](https://openphish.com/phishing_feeds.html)
10. [OpenPhish coverage paaiškinimas](https://openphish.com/kb.html)
11. [URLhaus paskirtis ir Community API](https://urlhaus.abuse.ch/api/)
12. [MalwareBazaar hash metadata API](https://bazaar.abuse.ch/api/)
13. [VirusTotal object relationships](https://docs.virustotal.com/reference/relationships)
14. [Censys Query Language](https://docs.censys.com/docs/censys-query-language)
15. [Shodan API dokumentacija](https://developer.shodan.io/api)
16. [IETF RFC 9082 ir RFC 9083, standartizuotas RDAP query bei JSON modelis](https://www.rfc-editor.org/rfc/rfc9082.html)
17. [IETF RFC 9162, Certificate Transparency 2.0](https://www.rfc-editor.org/rfc/rfc9162.html)
18. [MITRE ATT&CK Data & Tools](https://attack.mitre.org/resources/attack-data-and-tools/)
19. [Caltagirone, Pendergast ir Betz, The Diamond Model of Intrusion Analysis](https://www.activeresponse.org/wp-content/uploads/2013/07/diamond.pdf)
20. [NIST SP 800-115 Technical Guide to Information Security Testing and Assessment](https://csrc.nist.gov/pubs/sp/800/115/final)
21. [OWASP Web Security Testing Guide, Attack Surface Identification](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/01-Information_Gathering/04-Attack_Surface_Identification)
