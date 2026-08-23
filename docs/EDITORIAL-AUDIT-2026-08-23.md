# Bilingual editorial audit — 23 August 2026

## Scope

This pass reviewed the canonical HECAVEX publication archive rather than generated HTML: 42 Markdown records representing 21 English/Lithuanian publication pairs. It checked pair identity, publication metadata, source-link presence, media references, obvious encoding damage, legacy template syntax and clear language defects. It did not silently change conclusions, attribution, confidence in evidence-bearing research or canonical URLs.

## Result

- Every `translation_key` has one English and one Lithuanian record.
- Paired records now have an enforced contract for date, modification date, content type, category, author, confidence, TLP, publication state, series and Signal Brief coverage fields.
- Shared hero and thumbnail paths must match across an English/Lithuanian pair; localized alt text and social-card paths remain independent.
- All 42 records pass the content schema. Public URLs and redirects were unchanged.
- Signal Brief #4 now states the requested inclusive coverage period, 14–22 August 2026, in both metadata and visible summaries.
- The Lithuanian OSINT/CTI article now covers the same analytical argument and sections as the newer English edition instead of presenting an older, substantially different essay under the same translation key.
- Clear English defects were corrected in the older Centre of Registers, cloaking, ClickFix, MFA, scam-domain and information-operations articles. The edits preserve the author's humour and first-person voice while removing mistranslated clauses, duplicated words and ambiguous instructions.
- A malformed Censys documentation URL and one mixed-language analytical ladder in the Lithuanian pivoting guide were corrected.
- The Lithuanian MISP guide now carries the current official project links, deployment-validation warning and environment-variable API-key example used by the safer English edition.

## Structural differences deliberately retained

Translation parity does not require matching word or heading counts. Several older pairs were written or expanded separately and use different section granularity, notably the 2024 GitHub malware article, Google dorking guide, MISP guide and long infrastructure-pivoting guide. Their publication identity and core subject match, but flattening their structure automatically would change the author's composition and can create false translation confidence.

Those editions should receive a human side-by-side language review when they are substantively revised. Until then, the validator protects the fields that must not drift while allowing legitimate localized structure, tags, examples and source-language links.

## Media inventory

The build now reads the real file signature and intrinsic dimensions of every raster and SVG asset under `assets/img`. This matters because some imported legacy files contain WebP data despite a `.png` filename. Final article HTML receives actual `width` and `height` attributes together with the existing lazy-loading and asynchronous-decoding policy. The site audit rejects an article image missing that geometry, which reduces layout shift without changing a crop or source file.

## Ongoing editorial rule

Quiet spelling and formatting corrections may be made directly. A change to a source, factual claim, assessment, confidence level or conclusion must update the publication's revision metadata and visible change record. A full translation refresh should keep the same `translation_key` and canonical URLs and should be reviewed as editorial work, not hidden inside a layout change.
