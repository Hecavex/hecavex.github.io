# Research code map

Start here for focused retrieval. Follow the entrypoint for the feature; do not load the complete site or generated `dist` into an agent context.

Use [MAINTENANCE.md](MAINTENANCE.md) for reproducible setup, verification and release operations; the root README routes readers and contributors into this map.

| Responsibility | Source | Verification |
| --- | --- | --- |
| Root language gateway | `src/pages/index.astro` | route, responsive and reader-journey audits |
| EN/LT home | `src/pages/[lang]/index.astro` | five-card parity and responsive checks |
| Home reader-task routes and content date | `src/components/HomeTaskRoutes.astro` | `scripts/audit_responsive.mjs`: bilingual routes, real content-update time, accessible targets; static links work without JavaScript |
| Compact evergreen reading paths and citations | `src/components/ResearchPaths.astro`, `src/lib/publication-citations.mjs` | responsive discovery checks and `scripts/check-citations.mjs`; retain publication date and approved record |
| Research/profile catalogues | `src/pages/[lang]/[page].astro`, `src/data/page-context.ts` | content, action-rail, route assertions |
| Article assembly | `src/pages/[lang]/[section]/[slug].astro` | citations, evidence, publication browser checks |
| Publication eligibility and metadata | `src/lib/site.ts`, publication policy helpers | content validation; never bypass approval |
| Signal Brief chronology and discovery | bilingual `src/content/posts/*/bulletins/`, shared ordering in `src/lib/site.ts`, date display in `src/lib/briefing-record.mjs`, reviewed expectations in `scripts/signal-brief-editions.mjs` | `scripts/signal-briefs.test.mjs`, `scripts/check-signal-briefs.mjs`, `scripts/audit_responsive.mjs` |
| AI-skills evidence and bounded constant replay | `public/assets/data/fakegit-ai-skills-v1/`, bilingual October 9 AI-skills articles; `constant-replay/README.md` owns the fixed-data scope and licence; the EN/LT decoding sections keep original snippets/results visible, omit the advanced mathematical walkthrough and offer native expandable parser/check notes | `python -B public/assets/data/fakegit-ai-skills-v1/constant-replay/constant_replay.py`: fixed ciphertext/output digests and three altered-data controls; original Lua and all source bindings are outside this replay |
| AI-skills v2 static chain and passive pivots | `public/assets/data/fakegit-ai-skills-v2/README.md` owns the source-to-output chain, fixed-string replay scope and passive-only limitations; bilingual October 9 articles and `scripts/release-contract.mjs` publish the six support files | `python -B public/assets/data/fakegit-ai-skills-v2/spectrum-config-string-replay.py`: two fixed fixtures, RFC 6229 vector and six altered-data controls; source reacquisition, full-chain replay and runtime behavior are outside this check |
| September Radar monthly evidence | `public/assets/data/radar-september-2026-baseline/`, bilingual September research articles | `scripts/radar-baseline.test.mjs`, `scripts/check-radar-baseline.mjs`, bundle `replay_test.py`; full pinned-input reproduction: `python -B public/assets/data/radar-september-2026-baseline/replay.py` |
| Cover/preview decision, illustration/evidence label and responsive dimensions | `src/lib/publication-preview.mjs`, `src/lib/site.ts` | `scripts/publication-preview.test.mjs`; [editorial media workflow](EDITORIAL-MEDIA.md) |
| Media provenance and optimized asset gate | `src/data/editorial-media.json`, `scripts/check-editorial-media.mjs` | `scripts/editorial-media.test.mjs`, `npm run check:editorial-assets`; generated originals stay private |
| Repeated opening illustration and inline figure rendering | `src/lib/rehype-evidence-figures.mjs`, `src/lib/html-image-policy.mjs` | `scripts/evidence-figures.test.mjs`, `scripts/html-fragments.test.mjs`; analytical prose/citations and source evidence are retained |
| Reusable research card | `src/components/PostCard.astro` | responsive catalogue/home parity |
| Secondary speaking invitation | `src/components/SpeakingInvitation.astro` | route audit and bilingual link checks |
| Header, footer, SEO and policies | `src/components/SiteHeader.astro`, `SiteFooter.astro`, `ResourcePolicy.astro`, `src/layouts/BaseLayout.astro` | no-JS navigation, CSP, route audits |
| Reading position / contents | `src/components/ContentOutline.astro`, `public/assets/js/site.js` | publication browser + anchor checks |
| Stylesheet entrypoint | `public/assets/css/hecavex.css` | imports remain ordered; production bundling below |
| Foundation and shell | `public/assets/css/modules/foundation.css`, `navigation.css` | cross-property palette, type and shell contract |
| Cards and page layout | `modules/publication-cards.css`, `page-layouts.css` | compact home and catalogue parity |
| Reading / profile rails | `modules/reading-rails.css`, `article-reading.css` | full-width body, evidence tables, About justification |
| Root gateway, search and footer | `modules/gateway-search-footer.css` | search and footer target checks |
| Dark article/data surfaces and breakpoint rules | `modules/editorial-surfaces.css`, `responsive.css` | preserve article/data geometry without a paper-colour override |
| Approved editorial redesign | `modules/editorial-design.css` | compact home introduction, readable labels, image-led classified cards |
| Fonts | `public/assets/css/fonts.css`, `public/assets/fonts/` | self-hosted Latin + Lithuanian extended glyphs |
| Publication verification and deployment | `.github/workflows/pull-request-ci.yml` checks pull requests and exact `publish/**` heads; `.github/workflows/pages-deploy.yml` owns main deployment; [release contract](MAINTENANCE.md#release-contract) | Same `npm run verify` gate; exact-revision `scripts/check-live-release.mjs` after Pages deploy |
| Production CSS bundling/release manifest | `scripts/finalize-build.mjs` | one minified CSS output; unchanged transfer budgets |

Paths beginning `modules/` are relative to `public/assets/css/`. Public CSS stays readable and split at semantic boundaries. The build bundles imports, so modular source does not add a chain of production stylesheet requests. Do not edit generated `dist`.

## Preview contract

Classified publications, including Signal Briefs, show image-led cards and an article opening. `image.presentation: illustration` is labelled as editorial imagery, with a separate AI-generated label for new generated art. `image.presentation: evidence` has its own evidence label. Unclassified/no-image publications remain text-led. Briefing covers share the same responsive renderer and provenance gate, while their typographic social cards remain edition-specific. Retained cover bytes and rights remain unchanged. A duplicate opening illustration is suppressed in rendering while its caption/prose is retained. Social images remain edition-specific typography. [EDITORIAL-MEDIA.md](EDITORIAL-MEDIA.md) owns the metadata, provenance and future generation workflow.

## Change boundaries

- Preserve bilingual URLs, canonical/alternate links, article anchors and citation identifiers.
- Never infer approval from a file's existence or silently rewrite analytical conclusions.
- Do not modify immutable published research artifacts for presentation work.
- No external font service, account requirement or new tracking dependency.
- Full verification: `npm run verify`. Use Node 24 LTS (supported Node >=22.13).
- Screen-reader certification still requires an actual recorded human review; browser assertions are not a substitute.

## Dependency updates

`package.json` and `package-lock.json` own the reproducible toolchain. Astro and
`@astrojs/markdown-remark` must satisfy Astro's optional peer dependency together;
`.github/dependabot.yml` groups their updates as `astro-rendering`. Verify a clean
`npm ci` and the full `npm run verify` gate. Do not bypass an incompatible pair
with `--force` or `--legacy-peer-deps`.
