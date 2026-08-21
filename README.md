# HECAVEX

This repository publishes [hecavex.com](https://hecavex.com), my independent bilingual cyber threat intelligence publication. It contains investigations, technical assessments, Signal Briefs, commentary and the public record behind each research package.

The site is generated with Jekyll, but its presentation is owned here: the layouts in `_layouts`, components in `_includes`, and the single CSS and JavaScript entry points in `assets/css/hecavex.css` and `assets/js/site.js`. It does not load a packaged or remote Jekyll theme.

## Run locally

Install Ruby, Bundler and Node.js 22, then run:

```sh
bundle install
npm ci
npm test
bundle exec jekyll serve --livereload
```

Jekyll writes the generated site to `_site`; do not edit that directory.

## Publish research

English and Lithuanian posts live in matching folders:

- `_posts/en/blogs/` and `_posts/lt/blogs/` for commentary
- `_posts/en/bulletins/` and `_posts/lt/bulletins/` for Signal Briefs
- `_posts/en/research/` and `_posts/lt/research/` for investigations and technical work

Start from the closest file in `_templates`. Paired translations use the same `translation_key`. Templates set both `draft: true` and `published: false`; keep both safeguards until the copy, citations, image descriptions and metadata have been checked, then change them to `draft: false` and `published: true` for release.

Primary research and technical assessments include a visible publication record with stable ID, version, evidence basis, methods, confidence, TLP marking and revision history. See [Editorial packages](docs/EDITORIAL-PACKAGES.md).

## Validate a release

```sh
bundle exec ruby tools/validate_content.rb
npm test
JEKYLL_ENV=production bundle exec jekyll build
bundle exec ruby tools/audit_site.rb _site
npm run audit:responsive
```

The deployment workflow runs the same content, frontend, SEO, accessibility, link and responsive checks before publishing GitHub Pages.

Measurement is disabled unless `HECAVEX_ANALYTICS_TOKEN` is set. The implementation and privacy boundary are documented in [Measurement](docs/MEASUREMENT.md).

## HECAVEX network

- [APT Notes](https://apt.hecavex.com) — structured threat-actor knowledge
- [HECAVEX Labs](https://labs.hecavex.com) — research tools and datasets
- [HECAVEX Radar](https://radar.hecavex.com) — recently observed potential phishing signals relevant to Lithuania

The sites deploy independently while sharing HECAVEX identity, editorial language and cross-navigation.

## Licensing

Website code and templates are available under the repository's [MIT license](LICENSE), including retained attribution for historically derived portions. Editorial work, evidence, datasets, media and third-party material are governed by the terms stated with each publication or research package; the software license does not relicense them.
