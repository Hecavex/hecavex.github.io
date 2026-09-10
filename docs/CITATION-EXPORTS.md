# Research citation exports

Every explicitly approved public article has a visible citation and static BibTeX and CSL-JSON downloads. They require no account or browser JavaScript. The per-edition routes follow `/citations/{language}/{section}/{slug}.bib` and `.json`.

The generated `/data/publications.json` directory links the complete approved catalogue and its language counterparts. `languageEditionCount` counts localized pages. `publicationCount` counts distinct translation keys, including briefings and commentary, not exclusively original investigations. Unknown research IDs, versions, statuses and substantive-review dates remain `null`. `researchId` means an explicitly recorded frontmatter ID. Some article pages display a generated fallback ID instead; every exported edition still has its canonical URL as its stable `id`.

## What the exports mean

- Original publication dates match the visible Europe/Vilnius calendar date, including timestamps crossing UTC midnight. A later page update never replaces the original date.
- Research version, article update, substantive review and an evidence package's independent release remain distinct. Only recorded values are exported. An unknown review date is never invented from publication or deployment time.
- CSL uses `webpage` and BibTeX uses `misc`. HECAVEX is not represented as a peer-reviewed journal, and exports contain no invented DOI, volume, issue, ORCID or access date.
- Titles and Lithuanian text retain their case and Unicode. BibTeX escapes TeX control syntax. Choose a Unicode-capable bibliography workflow for Lithuanian text.
- The directory is publication metadata, not an IOC feed or authorization to redistribute underlying evidence. Page and package reuse terms still govern those materials.
- New authors require an explicit author mapping. Drafts, unpublished records, full article bodies and arbitrary frontmatter fields are not exported.

The article header also exposes Dublin Core author/title/date/language/canonical metadata. Highwire `citation_title` is deliberately not used because Zotero's generic translator can infer `journalArticle` from that field. BibTeX/CSL download links supply explicit import formats instead. This implementation is not a claim of indexing, search ranking or citation growth.

The EN/LT author pages identify their visible primary person using `ProfilePage`/`mainEntity`. The personal LinkedIn profile belongs to the `Person`, not to the HECAVEX publisher. Speaking/contact pages remain ordinary web pages, without invented event, offer or booking-availability markup.

## Checks and primary references

`npm test` covers approval, author mapping, date/edition/version boundaries, metadata allowlisting and TeX escaping. `npm run check:citations` checks every built export against the public catalogue/search population and verifies browser downloads, metadata and mobile/no-JavaScript behavior. The release manifest includes the publication directory and representative EN/LT citations, plus both portable speaker kits, text copies and generated one-page PDFs.

- [Zotero metadata guidance](https://www.zotero.org/support/dev/exposing_metadata)
- [Zotero Embedded Metadata translator](https://github.com/zotero/translators/blob/master/Embedded%20Metadata.js)
- [CSL JSON input schema](https://github.com/citation-style-language/schema/blob/master/schemas/input/csl-data.json)
- [Google's profile-page structured-data guidance](https://developers.google.com/search/docs/appearance/structured-data/profile-page)
