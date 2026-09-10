# Portable speaker and media kits

The English and Lithuanian files in `public/assets/media/` are standalone publication assets, not Astro content entries. Keep the HTML doctype first. Do not add frontmatter to them.

## Content boundary

The biographies, six appearance links, formats and photography note use the existing speaker/About pages as their factual source. Do not add employers, clients, event dates, testimonials or a press portrait by inference. The abstract avatar is not a headshot.

The short-biography attribution permission is carried into both HTML and text downloads. This does not relicense third-party recordings, articles, images or logos. See [Rights and reuse](RIGHTS.md).

## Editing and checking

Update each language's HTML and matching UTF-8 text download together. The focused browser check rejects biography drift and appearance links that differ from the corresponding speaker page. Keep source links absolute so they remain useful after text is copied into an editor's document.

Run `node scripts/generate-media-pdfs.mjs dist` after Astro build and before finalization/release hashing, then `node scripts/check-media-kit.mjs dist`. For isolated HTML/text asset work, the check accepts `public` before the publication build and explicitly does not check generated PDFs there. The final integration must use the built artifact.

The check covers both languages at 320, 390 and 1440 pixels, served and offline HTML with JavaScript disabled, real keyboard/touch text/PDF downloads, standards mode and four A4 PDF renders using Chromium. Test renders are inspected in memory. It does not open third-party appearances or send email. Browser/platform font differences can affect print pagination, so retain the one-page claim only while the supported print check passes.

## Generated PDF boundary

The generator writes only `dist/assets/media/hecavex-media-kit-en.pdf` and its Lithuanian counterpart. Do not commit PDFs under `public/`. Both PDFs come from the same built HTML, with JavaScript disabled and all offsite requests blocked. The generator waits for the local Inter and IBM Plex Mono fonts, checks both biographies and six links in the print-source DOM, and requires one A4 page plus embedded font data for both languages before writing either output. The final browser test checks the generated PDF structure and native downloaded byte equality.

These checks establish source-compatible printing and embedded fonts, not independent extraction of every PDF text glyph or universal PDF accessibility certification. The print source contains the existing author, biographies and appearance links, with no added portrait, history or testimonial. Chromium's creation metadata reflects generation time, not a fabricated historical publication date. Release hashing occurs after generation.

The HTML remains readable and printable offline with system fonts. Its text-download link must use an absolute canonical HTTPS URL, never a root-relative filesystem path. From a downloaded HTML copy it opens the online text file when a connection is available. The cross-origin `download` attribute need not force a download from a `file:` origin. Open the online kit to use self-hosted typefaces. The online speaker page links directly to the HTML and plain-text versions.

Chromium native downloads bypass Playwright request interception. The test server therefore maps the canonical origin to its loopback origin only in served HTML, preserving production-equivalent same-origin download semantics. The test checks real keyboard/touch completion and downloaded byte equality there. Separate raw-asset and offline checks require the unchanged canonical HTTPS URL, never a filesystem URL. This mirror does not prove live CDN delivery. After deployment, check the actual canonical HTML and native text downloads as well.
