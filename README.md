# HECAVEX

This repository contains [hecavex.com](https://hecavex.com), my bilingual cyber threat intelligence publication. I use it for investigations, technical analysis, short signal briefings and the occasional opinion that needed more room than a LinkedIn post.

The site runs on Jekyll. It started from Chirpy, but most of the publishing structure and visual work is now specific to HECAVEX.

## Run it locally

You need Ruby, Bundler and Node.js 22.

```sh
bundle install
npm ci
npm run build
bundle exec jekyll serve --livereload
```

Do not edit `_site`. Jekyll rebuilds it from the source files.

## Writing a post

Posts are kept in matching English and Lithuanian folders:

- `_posts/en/blogs/` and `_posts/lt/blogs/` for commentary
- `_posts/en/bulletins/` and `_posts/lt/bulletins/` for Signal Briefs
- `_posts/en/research/` and `_posts/lt/research/` for investigations and technical work

Start from the nearest file in `_templates/`. Paired translations must use the same `translation_key`. Keep `draft: true` until the text, links, image description and metadata have been checked.

Research posts also carry a visible publication record. It shows the version, evidence basis, methods, confidence, TLP marking and revision history. The format is described in [docs/EDITORIAL-PACKAGES.md](docs/EDITORIAL-PACKAGES.md).

## Check before publishing

```sh
bundle exec ruby tools/validate_content.rb
npm test
npm run build
JEKYLL_ENV=production bundle exec jekyll build
bundle exec ruby tools/audit_site.rb _site
bundle exec htmlproofer _site --disable-external
```

In PowerShell, set production mode first:

```powershell
$env:JEKYLL_ENV = "production"
```

The GitHub Actions workflow runs the same checks before it deploys the site. A broken internal link, incomplete social preview, malformed schema or missing accessibility label should stop the deployment instead of becoming a production surprise.

## Measurement

Measurement is optional. When `HECAVEX_ANALYTICS_TOKEN` is not configured, the analytics script is not added to the site. More detail is in [docs/MEASUREMENT.md](docs/MEASUREMENT.md).

## Related sites

- [APT Notes](https://apt.hecavex.com) contains the structured threat-actor knowledge base.
- [HECAVEX Labs](https://labs.hecavex.com) contains datasets and small browser-based research tools.
- [HECAVEX Radar](https://radar.hecavex.com) contains recently observed, defanged potential phishing signals relevant to Lithuania.

All four are separate deployments, but they share the same HECAVEX and author identity in navigation and structured data.
