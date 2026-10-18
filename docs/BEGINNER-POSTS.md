# Beginner posts: writing guide

Rašymo vadovas lietuviškai yra antroje dalyje: [Pradedantiesiems skirti straipsniai](#pradedantiesiems-skirti-straipsniai-lietuviškai).

A beginner post is an article for someone with no security background, such as a person who just received a suspicious text. It sits next to the in-depth research and is labelled "Beginner-friendly" on cards, in search and in the feed. It is not a shortened investigation. It is a different kind of article.

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

# Pradedantiesiems skirti straipsniai (lietuviškai)

Pradedantiesiems skirtas straipsnis rašomas žmogui, kuris nieko nenusimano apie kibernetinį saugumą, pavyzdžiui, ką tik gavusiam įtartiną žinutę. Jis skelbiamas šalia išsamių tyrimų, o kortelėse, paieškoje ir sklaidos kanale žymimas "Pradedantiesiems". Tai ne sutrumpintas tyrimas, o kito pobūdžio straipsnis.

## Skaitytojas

Rašykite sumaniam suaugusiam žmogui, kuris nerimauja, skuba ir neturi techninių žinių. Jis nori suprasti, kas vyksta ir ką daryti. Prieš imdamasis veiksmų jis neskaitys metodų skyriaus.

## Antraštinė dalis (frontmatter)

Pradėkite nuo `docs/templates/beginner-lt.md` (anglų kalbos leidimui naudokite `beginner-en.md`). Dvi eilutės paverčia straipsnį skirtu pradedantiesiems:

```yaml
audience: beginner
summary: "Vienas ar du aiškūs sakiniai, nuo 40 iki 280 ženklų."
```

- `summary` rodomas kaip dėžutė "Trumpai", puslapyje "Pradėkite čia", pagrindiniame puslapyje ir paieškoje. Su `audience: beginner` jis privalomas.
- `summary` rašomas vienoje eilutėje, su ASCII kabutėmis, be kabliataškių ir be nuorodų (net be "defanged" nuorodų).
- Signalų apžvalgos negali būti skirtos pradedantiesiems.
- `audience` abiejuose leidimuose turi sutapti. Tai patikrina `npm run validate`.
- Jei straipsnis skubus (skaitytojas galėjo ką tik būti apgautas), pridėkite `immediate_actions` su dviem ar trimis trumpais veiksmais liepiamąja nuosaka.

Jei straipsnį reikia rodyti nustatytoje vietoje puslapyje "Pradėkite čia", pridėkite jo `translation_key` prie `basics` faile `src/data/start-here.yml`. Kitu atveju jis atsiras automatiškai po išrinktųjų, naujausi pirmi.

## Aiškios kalbos taisyklės

- Trumpi sakiniai. Viena mintis sakinyje. Siekite mažiau nei 20 žodžių.
- Kreipkitės į skaitytoją "jūs". Rašykite veikiamąja rūšimi. Pirmiausia pasakykite, ką daryti.
- Vartokite kasdienius žodžius. Jei reikia techninio termino, vieną kartą paaiškinkite jį tame pačiame sakinyje ir toliau vartokite nuosekliai.
- Pirmą kartą paminėtą pagrindinę sąvoką susiekite su žodynu: `[phishing](/lt/zodynas/#phishing)`. Turimos sąvokos: phishing, smishing, malware, mfa, indicator, confidence, attribution, tlp. Naują sąvoką pridėkite faile `src/data/glossary.yml` (abiem kalbomis).
- Jokių nepaaiškintų santrumpų. Jokio žargono dėl įspūdžio.
- Negąsdinkite. Rašykite ramiai ir konkrečiai.
- Nekaltinkite skaitytojo.

## Struktūra

Naudokite šias keturias antraštes šia tvarka:

1. **Kas nutiko.** Situacija keliais sakiniais, taip, kaip ją mato skaitytojas.
2. **Kodėl tai svarbu.** Ko nori užpuolikas ir kas gali nutikti blogai.
3. **Ką daryti.** Sunumeruoti žingsniai, skubiausi pirma. Nurodykite, kam skambinti ir ką užblokuoti.
4. **Kur sužinoti daugiau.** Dvi ar trys nuorodos, geriausia į išsamų tyrimą ir žodyną.

Apimtis: nuo 400 iki 900 žodžių. Jei reikia daugiau, geriau pateikti nuorodą į išsamų tyrimą.

Įrodymų laukai (`scope`, `limitations`, `evidence_basis`, `methods`, `key_findings`) `technical-guide` tipui vis dar privalomi. Jie rodomi suskleistame skyriuje "Kaip tai ištirta", todėl įrodymai lieka vieši ir netrukdo skaitytojui.

## Apsauga ir grėsmių duomenys

- Niekada nerašykite veikiančios nuorodos į įtartiną ar kenkėjišką svetainę. Ją reikia "defang": `hxxps://example[.]com/pay`.
- Verčiau aprašykite požymį ("trumpa nuoroda su atsitiktiniu pavadinimu"), o ne cituokite adresą.
- Naudokite `example` pavadinimus, niekada tikros aukos, įmonės prisijungimo puslapio ar telefono numerio.
- Neatidarykite ir netikrinkite jokio tyrimo metu rasto domeno.

## Anglų ir lietuvių leidimų atitikimas

- Kiekvienas straipsnis egzistuoja abiem kalbomis su tuo pačiu `translation_key` ir tomis pačiomis `date`, `audience`, `categories`, `content_type`, `featured` bei `draft`/`published` reikšmėmis. Validatorius praneša apie skirtumus.
- Lietuviškas leidimas yra pilnavertis leidimas, o ne pažodinis vertimas. Išlaikykite tuos pačius žingsnius ta pačia tvarka, kad abu puslapius būtų galima palyginti eilutė po eilutės.
- Palikite skolinius, kuriuos vartoja skaitytojai (phishing, smishing), o pirmą kartą, jei padeda, pridėkite lietuvišką paaiškinimą skliausteliuose.

## Juodraščio peržiūra

Šablonai ir pavyzdžiai turi `draft: true` ir `published: false`, todėl jie neįtraukiami į jokią versiją, sklaidos kanalą, paieškos indeksą ar svetainės žemėlapį. Norėdami juos matyti rašydami, paleiskite kūrimo serverį su peržiūros vėliava:

```sh
HECAVEX_PREVIEW_DRAFTS=1 npm run dev
```

Windows PowerShell: `$env:HECAVEX_PREVIEW_DRAFTS = '1'; npm run dev`.

Vėliava veikia tik kūrimo serveryje. `npm run build` jos nepaiso. Nepaskelbta pavyzdinė pora yra `src/content/posts/{en,lt}/research/technical-guides/2026-10-18-*`, ją galima nukopijuoti kaip pradžią. Perrašykite kiekvieną skyrių, o kai straipsnis paruoštas, abiejuose leidimuose nustatykite `draft: false` ir `published: true`.

## Sąrašas prieš skelbiant

- [ ] Abiejuose leidimuose yra `audience: beginner` ir `summary`.
- [ ] Keturios antraštės ta pačia tvarka abiejuose leidimuose.
- [ ] Tik "defanged" rodikliai. Jokių veikiančių nuorodų į įtartinas svetaines.
- [ ] Pirmas kiekvienos pagrindinės sąvokos paminėjimas susietas su žodynu.
- [ ] `npm run validate` ir `npm run build` sėkmingi.
