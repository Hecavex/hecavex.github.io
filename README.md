# HECAVEX

HECAVEX is a bilingual cyber threat intelligence and digital investigations publication built on Jekyll and Chirpy.

## Local setup

Requirements: Ruby 3.1–3.4 (3.4 in CI), Bundler, and Node.js 22.

```sh
bundle install
npm ci
npm run build
bundle exec jekyll serve --livereload
```

The production-equivalent checks are:

```sh
bundle exec ruby tools/validate_content.rb
npm test
npm run build
JEKYLL_ENV=production bundle exec jekyll build
bundle exec htmlproofer _site --disable-external
```

On PowerShell, set production mode with `$env:JEKYLL_ENV='production'` before the Jekyll command.

## Creating content

English and Lithuanian posts use the same source structure under `_posts/en/` and `_posts/lt/`:

- `blogs/` — commentary, publication notes, and other author-led blog posts (`content_type: commentary`).
- `bulletins/` — numbered HECAVEX Signal Brief issues (`content_type: signal-brief`).
- `research/` — investigations, incident and malware analysis, technical analysis and guides, and threat notes.

Folder placement is for editorial organisation; public URLs are controlled by front matter and the permalink defaults in `_config.yml`. Copy a suitable file from `_templates/`. Every public post requires `title`, `description`, `lang`, `translation_key`, a valid canonical `categories` value, and `author`.

Use the same `translation_key` on the English and Lithuanian versions. The language switcher resolves the paired post directly. A post without a pair stays publishable and shows a localized availability notice. Set `featured: true` for homepage placement. Set `draft: true` until publication and keep `comments: false` unless a configured provider is intentionally enabled.

Cover images use:

```yaml
image:
  path: /assets/img/posts/example/cover.webp
  alt: A factual description in the article language
```

Add canonical category identifiers and localized labels in `_data/taxonomy.yml`. Author records are in `_data/authors.yml`; do not invent contact details or credentials.

CTI front matter supports `content_type`, `confidence`, `tlp`, and bilingual `updates`. Styled callouts can use `<aside class="hx-callout key-finding">` with a leading `<strong>Key finding</strong>`; variants include `warning` and the default informational style.

## Brand assets

SVG logos live under `assets/img/brand/`; favicons under `assets/img/favicons/`; social images under `assets/img/og/`. Brand and typography tokens are centralized at the end of `assets/css/jekyll-theme-chirpy.scss`. The mark is intentionally one-colour-capable and should be used instead of the wordmark below approximately 96px.

## Deployment

The canonical production URL is `https://hecavex.com`; `CNAME` configures the GitHub Pages custom domain. `.github/workflows/pages-deploy.yml` validates content, builds Node assets, builds Jekyll in production mode, runs HTMLProofer and deploys only after success. Configure the repository Pages source as GitHub Actions and provision DNS outside this repository.

Real values still required before publishing contact features: a verified public/security contact and any optional social profiles. Analytics and comments are deliberately disabled.

See `CUSTOMIZATIONS.md` for the upgrade map.
