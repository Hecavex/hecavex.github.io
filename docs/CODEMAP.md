# Research code map

Start here for focused retrieval. Follow the entrypoint for the feature; do not load the complete site or generated `dist` into an agent context.

| Responsibility | Source | Verification |
| --- | --- | --- |
| Root language gateway | `src/pages/index.astro` | route, responsive and reader-journey audits |
| EN/LT home | `src/pages/[lang]/index.astro` | five-card parity and responsive checks |
| Research/profile catalogues | `src/pages/[lang]/[page].astro`, `src/data/page-context.ts` | content, action-rail, route assertions |
| Article assembly | `src/pages/[lang]/[section]/[slug].astro` | citations, evidence, publication browser checks |
| Publication eligibility and metadata | `src/lib/site.ts`, publication policy helpers | content validation; never bypass approval |
| Signal Brief chronology and discovery | bilingual `src/content/posts/*/bulletins/`, shared ordering in `src/lib/site.ts`, date display in `src/lib/briefing-record.mjs` | `scripts/signal-briefs.test.mjs`, `scripts/check-signal-briefs.mjs` |
| Cover/preview decision | `src/lib/publication-preview.mjs` | `scripts/publication-preview.test.mjs` |
| Reusable research card | `src/components/PostCard.astro` | responsive catalogue/home parity |
| Secondary speaking invitation | `src/components/SpeakingInvitation.astro` | route audit and bilingual link checks |
| Header, footer, SEO and policies | `src/components/SiteHeader.astro`, `SiteFooter.astro`, `ResourcePolicy.astro`, `src/layouts/BaseLayout.astro` | no-JS navigation, CSP, route audits |
| Reading position / contents | `src/components/ContentOutline.astro`, `public/assets/js/site.js` | publication browser + anchor checks |
| Stylesheet entrypoint | `public/assets/css/hecavex.css` | imports remain ordered; production bundling below |
| Foundation and shell | `public/assets/css/modules/foundation.css`, `navigation.css` | cross-property palette, type and shell contract |
| Cards and page layout | `modules/publication-cards.css`, `page-layouts.css` | compact home and catalogue parity |
| Reading / profile rails | `modules/reading-rails.css`, `article-reading.css` | full-width body, evidence tables, About justification |
| Root gateway, search and footer | `modules/gateway-search-footer.css` | search and footer target checks |
| Existing light theme / breakpoint rules | `modules/paper-theme.css`, `responsive.css` | cascade order intentionally preserved |
| Approved editorial redesign | `modules/editorial-design.css` | open heroes, readable labels, typographic cards |
| Fonts | `public/assets/css/fonts.css`, `public/assets/fonts/` | self-hosted Latin + Lithuanian extended glyphs |
| Production CSS bundling/release manifest | `scripts/finalize-build.mjs` | one minified CSS output; unchanged transfer budgets |

Paths beginning `modules/` are relative to `public/assets/css/`. Public CSS stays readable and split at semantic boundaries. The build bundles imports, so modular source does not add a chain of production stylesheet requests. Do not edit generated `dist`.

## Preview contract

Cards are typographic by default, with the real article title, summary, class, date and reading time. Legacy illustrative covers are retained on disk but not promoted on cards or in article openings. A genuine evidence preview requires explicit `image.presentation: evidence`. Images in article Markdown and retained evidence packages are untouched. Social images are edition-specific typography, not invented evidence.

## Change boundaries

- Preserve bilingual URLs, canonical/alternate links, article anchors and citation identifiers.
- Never infer approval from a file's existence or silently rewrite analytical conclusions.
- Do not modify immutable published research artifacts for presentation work.
- No external font service, account requirement or new tracking dependency.
- Full verification: `npm run verify`. Use Node 24 LTS (supported Node >=22.13).
- Screen-reader certification still requires an actual recorded human review; browser assertions are not a substitute.
