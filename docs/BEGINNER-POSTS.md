# Beginner posts: writing guide

Rašymo vadovas lietuviškai yra antroje dalyje: [Straipsniai pradedantiesiems: rašymo vadovas](#straipsniai-pradedantiesiems-rašymo-vadovas).

A beginner post is an article for someone with no security background, such as a person who just received a suspicious text. It sits next to the in-depth research and is labelled "Beginner-friendly" on cards, in search and in the RSS feed. It is not a shortened investigation. It is a different kind of article.

## The reader

Write for a capable adult who is worried, in a hurry and not technical. They want to know what is going on and what to do. They will not read a methods section before they act.

## Frontmatter

Start from `docs/templates/beginner-en.md` (and `beginner-lt.md` for the Lithuanian edition). Two fields make a post a beginner post:

```yaml
audience: beginner
summary: "One or two plain sentences, 40 to 280 characters."
```

- `summary` is shown as the "In short" box, on the Start here page, on the home page and in search. It is required for `audience: beginner`.
- Keep `summary` on one line, with ASCII quotes, no semicolons and no links (not even defanged ones).
- Signal Briefs cannot be beginner posts.
- `audience` must be identical in both editions. `npm run validate` checks all of this.
- If the post is urgent (the reader may have just been scammed), add `immediate_actions` with two or three short imperative steps.

To list a post in a fixed position on Start here, add its `translation_key` to `basics` in `src/data/start-here.yml`. Without that, it appears automatically after the curated ones, newest first.

## Plain-language rules

- Short sentences. One idea each. Aim for fewer than 20 words.
- Use "you". Use the active voice. Say what to do first.
- Use everyday words. If you need a technical term, explain it once in the same sentence, then use it consistently.
- Link the first use of a basic term to the glossary: `[phishing](/en/glossary/#phishing)`. Available beginner terms: phishing, smishing, malware, mfa, indicator, confidence, attribution, tlp. To add a term, edit `src/data/glossary.yml` (both languages).
- No unexplained abbreviations. No jargon for effect.
- Do not frighten. Be calm and concrete.
- Do not blame the reader.

## Structure

Use these four headings, in this order:

1. **What happened.** The situation in a few sentences, as the reader would see it.
2. **Why it matters.** What the attacker wants and what can go wrong.
3. **What to do.** Numbered steps, most urgent first. Name who to call and what to block.
4. **Where to learn more.** Two or three links, ideally to an in-depth post and the glossary.

Length: 400 to 900 words. A beginner post that needs more should link to an in-depth post instead.

The evidence fields (`scope`, `limitations`, `evidence_basis`, `methods`, `key_findings`) are still required for `technical-guide`. They appear in a collapsed "How this was researched" section, so the evidence stays public without getting in the reader's way.

## Defanging and threat data

- Never write a live link to a suspicious or malicious site. Defang it: `hxxps://example[.]com/pay`.
- Prefer describing the sign ("a short link with a random name") over quoting the address.
- Use `example` names, never a real victim, company login page or phone number.
- Do not fetch or open any domain you find while researching.

## English and Lithuanian parity

- Every post exists in both languages with the same `translation_key`, the same `date`, `audience`, `categories`, `content_type`, `featured` and `draft`/`published` values. The validator reports a difference.
- The Lithuanian edition is a proper edition, not a literal translation. Keep the same steps in the same order, so the two pages can be compared line by line.
- Keep Lithuanian loanwords where readers use them (phishing, smishing) and add a Lithuanian gloss in brackets the first time if it helps.

## Preview a draft

Templates and examples use `draft: true` and `published: false`, so they are left out of every build, feed, search index and sitemap. To see them while writing, run the dev server with a preview flag:

```sh
HECAVEX_PREVIEW_DRAFTS=1 npm run dev
```

On Windows PowerShell: `$env:HECAVEX_PREVIEW_DRAFTS = '1'; npm run dev`.

The flag only works in the dev server. `npm run build` ignores it. An unpublished example pair lives at `src/content/posts/{en,lt}/research/technical-guides/2026-10-18-*` and can be copied as a starting point. Rewrite every section, then set `draft: false` and `published: true` on both editions when the post is ready.

## Checklist before publishing

- [ ] `audience: beginner` and a `summary` in both editions.
- [ ] Four headings in the same order in both editions.
- [ ] Defanged indicators only. No live links to suspicious sites.
- [ ] First use of each basic term links to the glossary.
- [ ] `npm run validate` and `npm run build` pass.

---

# Straipsniai pradedantiesiems: rašymo vadovas

Straipsnis pradedantiesiems skirtas žmogui, kuris nieko neišmano apie kibernetinį saugumą, pavyzdžiui, ką tik gavusiam įtartiną žinutę. Jis skelbiamas šalia išsamių tyrimų, o kortelėse, paieškoje ir RSS sraute pažymimas žyma "Pradedantiesiems". Tai ne sutrumpintas tyrimas, o kitokio pobūdžio straipsnis.

## Skaitytojas

Rašykite protingam suaugusiam žmogui, kuris nerimauja, skuba ir nėra technikos žinovas. Jis nori suprasti, kas vyksta, ir sužinoti, ką daryti. Prieš ką nors darydamas jis neskaitys skyriaus apie metodus.

## Frontmatter (straipsnio metaduomenys)

Pradėkite nuo `docs/templates/beginner-lt.md` (angliškam leidimui yra `beginner-en.md`). Straipsnis tampa skirtas pradedantiesiems, kai jame yra šie du laukai:

```yaml
audience: beginner
summary: "Vienas ar du aiškūs sakiniai, nuo 40 iki 280 ženklų."
```

- `summary` rodomas langelyje "Trumpai", puslapyje "Pradėkite čia", pagrindiniame puslapyje ir paieškoje. Kai nurodyta `audience: beginner`, šis laukas privalomas.
- `summary` rašykite vienoje eilutėje, su ASCII kabutėmis, be kabliataškių ir be nuorodų (net nukenksmintų).
- Signalų apžvalgos negali būti skirtos pradedantiesiems.
- `audience` abiejuose leidimuose turi būti vienodas. Visa tai tikrina `npm run validate`.
- Jei straipsnis skubus (skaitytojas galbūt ką tik buvo apgautas), pridėkite `immediate_actions`: du ar tris trumpus nurodymus liepiamąja nuosaka.

Jei norite, kad straipsnis puslapyje "Pradėkite čia" būtų rodomas nustatytoje vietoje, įrašykite jo `translation_key` į `basics` sąrašą faile `src/data/start-here.yml`. Kitaip jis automatiškai atsiras po atrinktųjų, nuo naujausio.

## Aiškios kalbos taisyklės

- Trumpi sakiniai, viename sakinyje viena mintis. Stenkitės neviršyti 20 žodžių.
- Kreipkitės į skaitytoją "jūs". Rašykite, kas ką daro, o ne beasmeniškai. Pirmiausia pasakykite, ką daryti.
- Vartokite kasdienius žodžius. Jei be techninio termino neapsieinate, paaiškinkite jį tame pačiame sakinyje, kuriame jis pavartotas pirmą kartą, ir toliau vartokite tą patį žodį.
- Pirmą kartą pavartotą pagrindinę sąvoką susiekite su žodynu: `[phishing](/lt/zodynas/#phishing)`. Žodyne jau yra šios sąvokos pradedantiesiems: phishing, smishing, malware, mfa, indicator, confidence, attribution, tlp. Naują sąvoką pridėkite faile `src/data/glossary.yml` (abiem kalbomis).
- Nevartokite nepaaiškintų santrumpų ir žargono vien dėl įspūdžio.
- Negąsdinkite. Rašykite ramiai ir konkrečiai.
- Nekaltinkite skaitytojo.

## Struktūra

Naudokite šias keturias antraštes šia tvarka:

1. **Kas nutiko.** Keli sakiniai apie situaciją taip, kaip ją mato skaitytojas.
2. **Kodėl tai svarbu.** Ko siekia užpuolikas ir kas gali nutikti.
3. **Ką daryti.** Sunumeruoti žingsniai, skubiausi pirmiausia. Nurodykite, kam skambinti ir ką užblokuoti.
4. **Kur sužinoti daugiau.** Dvi ar trys nuorodos, geriausia į išsamų tyrimą ir į žodyną.

Apimtis: nuo 400 iki 900 žodžių. Jei to neužtenka, geriau pateikite nuorodą į išsamų tyrimą.

`technical-guide` tipui įrodymų laukai (`scope`, `limitations`, `evidence_basis`, `methods`, `key_findings`) vis tiek privalomi. Jie rodomi suskleistame skyriuje "Kaip tai ištirta", todėl įrodymai lieka vieši, bet skaitytojui netrukdo.

## Nukenksminimas ir grėsmių duomenys

- Niekada nerašykite veikiančios nuorodos į įtartiną ar kenkėjišką svetainę. Nukenksminkite ją (angl. defang): `hxxps://example[.]com/pay`.
- Geriau aprašykite požymį ("trumpa nuoroda atsitiktiniu pavadinimu"), nei cituokite adresą.
- Naudokite pavyzdinius `example` pavadinimus. Niekada nenurodykite tikros aukos, tikros įmonės prisijungimo puslapio ar tikro telefono numerio.
- Tyrimo metu rastų domenų neatidarykite ir nesiųskite iš jų jokio turinio.

## Anglų ir lietuvių leidimų atitikimas

- Kiekvienas straipsnis skelbiamas abiem kalbomis su tuo pačiu `translation_key` ir tomis pačiomis `date`, `audience`, `categories`, `content_type`, `featured` bei `draft`/`published` reikšmėmis. Jei kas nors skiriasi, validatorius apie tai praneša.
- Lietuviškas leidimas yra visavertis tekstas, o ne pažodinis vertimas. Išlaikykite tuos pačius žingsnius ta pačia tvarka, kad abu puslapius būtų galima palyginti eilutė po eilutės.
- Palikite skolinius, kuriuos vartoja skaitytojai (phishing, smishing). Jei padeda, pirmą kartą skliausteliuose pridėkite lietuvišką paaiškinimą.

## Juodraščio peržiūra

Šablonai ir pavyzdžiai turi `draft: true` ir `published: false`, todėl jie nepatenka į sugeneruotą svetainę, RSS srautą, paieškos indeksą ir svetainės žemėlapį. Kad matytumėte juos rašydami, paleiskite kūrimo serverį su peržiūros aplinkos kintamuoju:

```sh
HECAVEX_PREVIEW_DRAFTS=1 npm run dev
```

Windows PowerShell: `$env:HECAVEX_PREVIEW_DRAFTS = '1'; npm run dev`.

Šis kintamasis veikia tik kūrimo serveryje, `npm run build` jo nepaiso. Nepaskelbta pavyzdinė pora yra `src/content/posts/{en,lt}/research/technical-guides/2026-10-18-*`. Ją galite nukopijuoti ir naudoti kaip pradžią. Perrašykite kiekvieną skyrių, o kai straipsnis bus paruoštas, abiejuose leidimuose nustatykite `draft: false` ir `published: true`.

## Prieš skelbdami patikrinkite

- [ ] Abiejuose leidimuose yra `audience: beginner` ir `summary`.
- [ ] Abiejuose leidimuose tos pačios keturios antraštės ta pačia tvarka.
- [ ] Visi indikatoriai nukenksminti. Nėra veikiančių nuorodų į įtartinas svetaines.
- [ ] Pirmą kartą pavartota kiekviena pagrindinė sąvoka susieta su žodynu.
- [ ] `npm run validate` ir `npm run build` praeina be klaidų.
