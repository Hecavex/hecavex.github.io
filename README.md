# HECAVEX Research

This repository publishes [hecavex.com](https://hecavex.com), the bilingual cyber threat intelligence publication by Deividas Lis. It contains investigations, technical assessments, Signal Briefs, commentary and the public record behind each research package.

The site is a static Astro build. It has no CMS, account system, server runtime or inherited theme. Astro renders the Markdown archive at build time; the browser receives ordinary HTML, CSS and a small progressive-enhancement script. The shared two-row header implements the same HECAVEX portfolio shell used by Radar, APT Notes and Labs.

## Repository map

- `src/content/posts/en/` and `src/content/posts/lt/` — the 42 canonical localized publications
- `src/content/pages/` — maintained English and Lithuanian page copy
- `src/pages/` — Astro routes, feeds, search indexes, taxonomy pages and redirects
- `src/components/` and `src/layouts/` — the publication interface and portfolio shell
- `src/data/` — editorial labels, taxonomy, glossary and project records
- `public/assets/` — self-hosted fonts, images, downloads, social cards, CSS and browser JavaScript
- `tests/fixtures/production-sitemap-routes.txt` — the 128-route migration contract captured before the rebuild

## Run locally

Use Node.js 22 or newer:

```sh
npm ci
npm run dev
```

Astro prints the local address, normally `http://localhost:4321/`. Build output is written to `dist`; do not edit it.

## Publish research

English and Lithuanian posts live in matching Astro content folders:

- `src/content/posts/en/blogs/` and `src/content/posts/lt/blogs/` for commentary
- `src/content/posts/en/bulletins/` and `src/content/posts/lt/bulletins/` for Signal Briefs
- `src/content/posts/en/research/` and `src/content/posts/lt/research/` for investigations and technical work

Start from the closest file in `docs/templates`. Paired translations use the same `translation_key`. Templates set both `draft: true` and `published: false`; keep both safeguards until copy, citations, image descriptions and metadata have been checked, then set `draft: false` and `published: true` for release.

Primary research and technical assessments include a visible publication record with stable ID, evidence basis, methods, confidence, TLP marking and revision history. See [Editorial packages](docs/EDITORIAL-PACKAGES.md).

After adding or renaming a public post, regenerate its localized social card:

```sh
npm run generate:social
```

The generator renders deterministic, self-hosted 1200×630 PNG previews. Article diagrams remain local static SVGs; the published site does not load diagram or mathematics runtimes.

## Validate a release

```sh
npm run verify
```

The release gate:

- validates all localized front matter and draft exclusions;
- type-checks and builds Astro;
- confirms all 128 pre-migration sitemap URLs and 317 HTML artifacts still exist;
- verifies feeds, search JSON, redirects, 404s, security endpoints and downloads;
- audits canonical, hreflang, social, schema, accessibility and internal links;
- enforces deterministic payload limits; and
- tests the shared shell from 320 to 1440 px, including keyboard and no-JavaScript navigation.

Measurement is absent unless `PUBLIC_HECAVEX_ANALYTICS_TOKEN` is supplied at build time. GitHub Actions maps the optional `HECAVEX_ANALYTICS_TOKEN` repository variable to it. The privacy boundary is documented in [Measurement](docs/MEASUREMENT.md).

## HECAVEX network

- [HECAVEX Radar](https://radar.hecavex.com) — potential phishing signals relevant to Lithuania
- [APT Notes](https://apt.hecavex.com) — structured threat-actor knowledge
- [HECAVEX Labs](https://labs.hecavex.com) — inspectable research tools and datasets
- [HECAVEX Data](https://labs.hecavex.com/data/) — citable public research releases

The properties deploy independently while sharing the Cold Signal design system, portfolio navigation, typography, spacing and accessibility contract.

## Licensing

Original website code and templates are available under the repository's [MIT license](LICENSE). Editorial work, evidence, datasets, media and third-party material are governed by the terms stated with each publication or research package; the software license does not relicense them.
