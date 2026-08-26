# HECAVEX Research

This is the maintained source and publication record for [hecavex.com](https://hecavex.com), the bilingual cyber threat intelligence publication edited by Deividas Lis. It is the production website repository, not a general-purpose theme or starter project.

## Published surface

HECAVEX Research publishes English and Lithuanian investigations, technical assessments, commentary and Signal Briefs. The site also holds the public methodology, author information, speaking and contact pages, taxonomies, feeds, search indexes and citable research artefacts attached to individual publications.

The production site is rendered as static HTML by Astro. It has no account system, content-management backend or application database. The interface uses the shared Cold Signal portfolio shell found across HECAVEX Research, Radar, APT Notes and Labs.

## Repository structure

- `src/content/posts/en/` and `src/content/posts/lt/` hold the canonical localized publications.
- `src/content/pages/` contains maintained English and Lithuanian page copy.
- `src/pages/` defines publication, feed, search, taxonomy and compatibility routes.
- `src/components/` and `src/layouts/` implement the HECAVEX Research interface and portfolio shell.
- `src/data/` contains editorial labels, taxonomy, glossary and project records.
- `public/assets/` contains self-hosted fonts, publication artwork, downloadable research records, CSS and browser JavaScript.
- `docs/` records the publication classes, editorial templates, measurement boundary and performance budgets.
- `scripts/production-sitemap-routes.txt` preserves the route contract from the website rebuild.

Generated output in `dist/`, Astro caches and dependency directories are operational by-products and are not part of the publication record.

## Editorial operation

Publications are maintained in three localized collections:

- `blogs/` for commentary and publication notes;
- `bulletins/` for time-bounded Signal Briefs; and
- `research/` for investigations, malware analysis, technical assessments and guides.

English and Lithuanian counterparts use the same `translation_key`. Draft templates live in `docs/templates/` and remain excluded from the public build until both `draft: false` and `published: true` are set. Evidence-bearing work includes a visible publication record covering scope, evidence basis, methods, confidence, TLP marking and revision history. The full contract is documented in [Publication format](docs/EDITORIAL-PACKAGES.md).

Material corrections update the publication metadata and revision record; readers should not need Git history to discover that an assessment changed. Social cards, feeds, search indexes, structured data and route manifests are regenerated as part of the maintained release process.

## Release contract

The authoritative deployment is the GitHub Pages workflow on `main`. Every release is checked for content validity, Astro type safety, preserved public routes, internal-link and metadata integrity, accessibility, responsive behavior and payload budgets before the Pages artifact is published.

The same release gate is available to the maintainer as `npm run verify`. It is an operational control for this publication, not a promise that the repository is a supported downstream website package.

The production workflow requires the `HECAVEX_ANALYTICS_TOKEN` repository variable, includes the manually installed Cloudflare Web Analytics beacon and verifies that every generated shell page contains exactly one configured site tag. Local builds omit the beacon unless `PUBLIC_HECAVEX_ANALYTICS_TOKEN` is supplied. The loader honours `Do Not Track: 1`, and the implementation and portfolio boundaries are recorded in [Site measurement](docs/MEASUREMENT.md).

## HECAVEX network

- [HECAVEX Radar](https://radar.hecavex.com) publishes screened potential phishing signals relevant to Lithuania.
- [APT Notes](https://apt.hecavex.com) maintains structured, source-backed threat-actor research.
- [HECAVEX Labs](https://labs.hecavex.com) exposes inspectable research workspaces and bounded datasets.
- [HECAVEX Data](https://hecavex.com/data/) is the portfolio catalogue for public machine-readable releases.

Each property deploys independently while sharing the Cold Signal visual, navigation and accessibility contract.

## Corrections, security and rights

Corrections, broken links and accessibility problems can be reported through the contact route on [hecavex.com](https://hecavex.com/en/contact/). Website vulnerabilities must be reported privately under [the security policy](SECURITY.md); sensitive evidence does not belong in a public issue.

Original website code is covered by the repository's [MIT license](LICENSE). Author-written article text carrying the visible page notice is available under CC BY 4.0. Datasets, evidence, artwork, fonts and third-party material retain their package- or asset-specific terms. The complete [rights and reuse boundary](docs/RIGHTS.md) explains which rule applies; the software licence does not relicense the publication archive.
