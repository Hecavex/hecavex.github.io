# HECAVEX Research

Source for [hecavex.com](https://hecavex.com/), the English and Lithuanian cyber threat intelligence publication edited by Deividas Lis. Astro renders approved investigations, assessments, guides and Signal Briefs as a public static website.

## Read and explore

- [English](https://hecavex.com/en/) and [Lietuviškai](https://hecavex.com/lt/): publication entrypoints.
- [Research](https://hecavex.com/en/research/), [Signal Briefs](https://hecavex.com/en/briefings/) and [public data](https://hecavex.com/data/): investigations, dated coverage and reusable evidence.
- [Methodology](https://hecavex.com/en/methodology/), [author](https://hecavex.com/en/about/) and [corrections](https://hecavex.com/en/corrections/): scope, authorship and material changes.
- Related properties: [Radar](https://radar.hecavex.com/), [APT Notes](https://apt.hecavex.com/) and [Labs](https://labs.hecavex.com/).

## Find and change the source

Start with [the code map](docs/CODEMAP.md). Publications belong in `src/content/posts/en/` and `src/content/posts/lt/`; page copy in `src/content/pages/`; routes and layouts in `src/pages/`, `src/components/` and `src/layouts/`; browser styles and scripts in `public/assets/`.

| Task | Authoritative guide |
| --- | --- |
| Local setup, checks and release operation | [Maintenance](docs/MAINTENANCE.md) |
| Publication types, approval and bilingual metadata | [Editorial packages](docs/EDITORIAL-PACKAGES.md) and [templates](docs/templates/) |
| Citation exports and speaker material | [Citations](docs/CITATION-EXPORTS.md) and [media kit](docs/MEDIA-KIT.md) |
| Visual acceptance and payload limits | [Visual review](docs/EDITORIAL-VISUAL-REVIEW.md) and [performance budgets](docs/PERFORMANCE-BUDGETS.md) |
| Audience measurement and privacy | [Measurement](docs/MEASUREMENT.md) |

The maintainer release gate is `npm run verify`. This is the operated publication source; it is maintained for HECAVEX rather than offered as a supported website package. Generated output, dependencies, private editorial notes and credentials stay outside the publication record.

## Corrections, security and rights

Report corrections and accessibility problems through [contact](https://hecavex.com/en/contact/). Report vulnerabilities privately using [SECURITY.md](SECURITY.md).

Original software is [MIT](LICENSE). Article text carrying the published notice is CC BY 4.0; data, evidence, images, fonts and third-party material retain their own terms. [Rights and reuse](docs/RIGHTS.md) is the authoritative boundary. Package-level READMEs remain beside their evidence or font files because they carry release, reproduction and legal context.
