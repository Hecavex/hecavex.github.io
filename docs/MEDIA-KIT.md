# Portable speaker and media kits

The English and Lithuanian files in `public/assets/media/` are standalone publication assets, not Astro content entries. Keep the HTML doctype first. Do not add frontmatter to them.

## Content boundary

The biographies, six appearance links, formats and photography note use the existing speaker/About pages as their factual source. Do not add employers, clients, event dates, testimonials or a press portrait by inference. The abstract avatar is not a headshot.

The short-biography attribution permission is carried into both HTML and text downloads. This does not relicense third-party recordings, articles, images or logos. See [Rights and reuse](RIGHTS.md).

## Editing and checking

Update each language's HTML and matching UTF-8 text download together. The focused browser check rejects biography drift and appearance links that differ from the corresponding speaker page. Keep source links absolute so they remain useful after text is copied into an editor's document.

Run `node scripts/check-media-kit.mjs dist` after building. For isolated asset work, the same command accepts `public` before the publication build. The final integration must use the built artifact.

The check covers both languages at 320, 390 and 1440 pixels, served and offline HTML with JavaScript disabled, real keyboard/touch text downloads, standards mode and four A4 PDF renders using Chromium. PDFs are inspected in memory, not committed. It does not open third-party appearances or send email. Browser/platform font differences can affect print pagination, so retain the one-page claim only while the supported print check passes.

The HTML remains readable and printable offline with system fonts. Its text-download link must use an absolute canonical HTTPS URL, never a root-relative filesystem path. From a downloaded HTML copy it opens the online text file when a connection is available. The cross-origin `download` attribute need not force a download from a `file:` origin. Open the online kit to use self-hosted typefaces. The online speaker page links directly to the HTML and plain-text versions.

Chromium native downloads bypass Playwright request interception. The test server therefore maps the canonical origin to its loopback origin only in served HTML, preserving production-equivalent same-origin download semantics. The test checks real keyboard/touch completion and downloaded byte equality there. Separate raw-asset and offline checks require the unchanged canonical HTTPS URL, never a filesystem URL. This mirror does not prove live CDN delivery. After deployment, check the actual canonical HTML and native text downloads as well.
