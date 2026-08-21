# Contributing

HECAVEX is an independently edited research publication. Corrections, broken-link reports, accessibility fixes, reproducible technical corrections and improvements to public research artefacts are welcome.

## Before opening a change

- Do not submit private, personal or unlawfully obtained data.
- Defang live malicious URLs in prose and evidence files unless a working URL is necessary for a cited defensive source.
- Preserve both language routes and the `translation_key` relationship when editing a translated publication.
- Separate verified observations, analytical assessments and unresolved hypotheses.
- Cite primary or authoritative sources as close as possible to the relevant claim.
- Follow the [Code of Conduct](CODE_OF_CONDUCT.md) and report sensitive security issues through [the security policy](SECURITY.md), not a public issue.

## Local checks

```sh
bundle install
npm ci
bundle exec ruby tools/validate_content.rb
npm test
JEKYLL_ENV=production bundle exec jekyll build
bundle exec ruby tools/audit_site.rb _site
npm run audit:responsive
```

Changes to routes, front matter, layouts or shared components should pass the complete sequence. A pull request should describe the reader-facing change, its evidence or reproduction steps, and any known limitation.
