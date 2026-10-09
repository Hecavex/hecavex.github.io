# Editorial covers and article images

This workflow covers approved EN/LT publications. It does not authorize a new investigation, change its publication date or alter a released evidence package. See [Rights](RIGHTS.md) for asset-specific reuse limits and [visual review](EDITORIAL-VISUAL-REVIEW.md) for representative acceptance.

## Classification and rendering

An ordinary article may have an explicit `image.presentation: illustration` or `evidence`. An illustration identifies the topic. It does not establish a source observation, attribution, count or finding. Generated art always uses `presentation: illustration` and `source_type: generated`. A retained image means an already public asset whose existing rights remain unchanged, not newly verified ownership or a new licence grant.

Unclassified legacy strings or objects are text-led until classified. Signal Briefs remain text-led. Dedicated EN/LT typographic social cards remain the social fallback for every edition. Do not mark an illustration as evidence to make it appear.

`src/lib/publication-preview.mjs`, re-exported by `src/lib/site.ts`, owns `imagePath`, `imagePresentation`, `imageCaption`, `imageDimensions`, `imageSrcSet` and `imageSocialAlt`. The card and article renderers use the same decision. Generated figures receive a visible localized AI-generated/non-evidence label. Matching cover/card variants use actual intrinsic dimensions and a width-based `srcset`, provided their aspect ratios agree within rounding tolerance. A differing crop is not silently substituted. Social-image alt text describes the delivered typographic title card independently of the editorial cover.

The article renderer places the classified cover at the opening. `rehype-evidence-figures.mjs` removes only an identical illustration image repeated as the first Markdown image, preserving its caption, surrounding prose and source anchors. Evidence previews, later figures and mismatched images are never suppressed. `finalize-build.mjs` measures local raster/SVG assets and supplies intrinsic dimensions, lazy loading and asynchronous decoding for inline images.

## Prepare a useful image

1. Read the approved article and identify a real explanatory or discovery need. Prefer an existing suitable retained cover or an accurate source figure. Do not insert decorative images between every section.
2. For a new bitmap, use the installed built-in image generation tool. A static explanatory diagram should use the existing accessible SVG workflow instead. No additional image service, tracking dependency or API key is required.
3. Describe a symbolic editorial scene, with clear thumbnail composition and restrained near-black, graphite and teal materials. Avoid fabricated dashboards, numbers, charts, domain names, quotations, logos or evidence captures. Keep legible factual labels in authored HTML/SVG rather than generated art.
4. Inspect the delivered source. Retain originals and the generation receipt in the private maintainer workspace. Never add raw generated PNGs, local device paths or unpublished materials to this repository.
5. Export versioned optimized WebP derivatives. The current cover convention is 1600×900 plus a 720×405 thumbnail. An inline illustration can use 1200×675. Keep its aspect ratio, strip metadata and avoid unnecessary upscaling. The existing hard per-image budget is 384 KiB. The October 2026 additions use Pillow Lanczos resizing, a proportional center crop to 16:9 and WebP quality 82.
6. Add localized descriptive alt text and a visible illustration caption. Preserve dates, research versions, analytical text, citation IDs and immutable data. A layout/media-only change does not become a substantive research update.

The optional maintainer helper requires the already available Pillow library, not a website dependency. It refuses upscaling, unsafe destinations, oversized derivatives and overwriting a versioned asset. Run once for each needed size, then copy its dimensions/bytes/hashes into the catalogue:

```powershell
python scripts/prepare-editorial-image.py <private-source.png> /assets/img/posts/<article>/topic-hero-v1.webp 1600 900
python scripts/prepare-editorial-image.py <private-source.png> /assets/img/posts/<article>/topic-card-v1.webp 720 405
```

Example frontmatter:

```yaml
image:
  path: /assets/img/posts/<article>/topic-hero-v1.webp
  thumbnail: /assets/img/posts/<article>/topic-card-v1.webp
  presentation: illustration
  source_type: generated
  provenance_id: <translation-key>-cover-generated-v1
  alt: "Describe the symbolic scene in this edition's language"
  width: 1600
  height: 900
  thumbnail_width: 720
  thumbnail_height: 405
```

An inline Markdown figure uses descriptive alt text immediately followed by an italic caption beginning `AI-generated editorial illustration, not evidence` in English or `DI sukurta redakcinė iliustracija, ne įrodymas` in Lithuanian. The gate checks adjacency for every declared generated image. Generated-art links open the public full-size illustration, not the private original. Real evidence keeps its original context and capture limits.

## Record provenance and verify

`src/data/editorial-media.json` is the bounded media catalogue, keyed by stable `id` and `translation_key`. Each record specifies placement, presentation, source type, rights boundary and delivered paths with exact dimensions, bytes and SHA-256. Generated records also preserve the built-in tool identifier, request ID, prompt, recorded receipt time, original SHA-256 and processing steps. Do not invent an underlying model or internal generation time that the tool did not expose. Public hashes identify image bytes, not a real incident or original network evidence.

The catalogue stores no private paths or originals. `scripts/check-editorial-media.mjs` validates local path containment, actual image dimensions/hashes/bytes, classification, bilingual cover references and generated inline captions. It runs through the existing `npm run check:editorial-assets` build gate alongside the SVG palette contract. The SVG audit does not certify raster colour, rights or artistic quality.

```powershell
node --test scripts/publication-preview.test.mjs scripts/evidence-figures.test.mjs scripts/editorial-media.test.mjs
node scripts/check-editorial-media.mjs
npm run validate
npm run check:editorial-assets
```

Then run `npm run verify` and inspect EN/LT home, catalogue and representative article views at narrow and wide widths. Check image decoding, intrinsic ratio, selected responsive asset, visible distinction from evidence, keyboard/no-JS navigation and network requests. Use `node scripts/editorial-previews.mjs <private-output.html>` for a private comparative sheet. Automated checks do not establish legal ownership, improved click-through, accuracy of an image's fictional contents or human accessibility certification.
