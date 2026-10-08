# Research maintenance

Maintainer guide for this operated HECAVEX publication. [The repository README](../README.md) is the product entrypoint. Detailed field or legal rules stay in their existing owning documents.

## Local preparation and checks

Use the Node and npm requirements in `package.json` with the committed `package-lock.json`. Run `npm ci`, `npm run dev` for a local preview, and `npm run verify` for the complete release gate. Start feature changes from [CODEMAP.md](CODEMAP.md).

## Editorial operation

Publications are maintained in three localized collections:

- `blogs/` for commentary and publication notes;
- `bulletins/` for time-bounded Signal Briefs; and
- `research/` for investigations, malware analysis, technical assessments and guides.

English and Lithuanian counterparts use the same `translation_key`. Draft templates live in `templates/` and remain excluded from the public build until both `draft: false` and `published: true` are set. Evidence-bearing work includes a visible publication record covering scope, evidence basis, methods, confidence, TLP marking and revision history. The full contract is documented in [Publication format](EDITORIAL-PACKAGES.md).

Material corrections update the publication metadata and revision record; readers should not need Git history to discover that an assessment changed. Social cards, feeds, search indexes, structured data and route manifests are regenerated as part of the maintained release process.

Approved articles also provide version-aware [citation exports](CITATION-EXPORTS.md) in BibTeX and CSL-JSON. `/data/publications.json` links the bilingual catalogue without presenting translations as additional investigations. The [portable speaker kits](MEDIA-KIT.md) provide linked appearances, reusable biographies and offline-readable text copies.

## Release contract

The authoritative deployment is the GitHub Pages workflow on `main`. Every release is checked for content validity, Astro type safety, preserved public routes, internal-link and metadata integrity, accessibility, responsive behavior and payload budgets before the Pages artifact is published.

The same release gate is available to the maintainer as `npm run verify`. It is an operational control for this publication, not a promise that the repository is a supported downstream website package.

Each build emits `release.json` with the Git revision and delivered-file SHA-256 values for representative English/Lithuanian pages, both data catalogues, search indexes, feeds and the security contact. The post-deploy check requires that exact revision and those bytes, not merely successful HTTP responses.

Visual acceptance is separate from build validity. [The review contract](EDITORIAL-VISUAL-REVIEW.md) provides a private preview-sheet command, evidence-caption requirements and the boundary for measured Search Console decisions.

The production workflow requires the `HECAVEX_ANALYTICS_TOKEN` repository variable, includes the manually installed Cloudflare Web Analytics beacon and verifies that every generated shell page contains exactly one configured site tag. Local builds omit the beacon unless `PUBLIC_HECAVEX_ANALYTICS_TOKEN` is supplied. The loader honours `Do Not Track: 1`, and the implementation and portfolio boundaries are recorded in [Site measurement](MEASUREMENT.md).
