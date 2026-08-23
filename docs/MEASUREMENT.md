# Site measurement

HECAVEX can use Cloudflare Web Analytics to answer a few basic questions: which pages are being read, where referrals come from and whether the site is performing badly for real visitors.

It is deliberately optional. If the deployment variable is missing, no analytics beacon is loaded. The loader also stops when the browser sends a Do Not Track signal.

The setup does not add an HECAVEX analytics cookie or store an analytics ID in local storage. Cloudflare's own description of the data it collects is available in its [Web Analytics documentation](https://developers.cloudflare.com/web-analytics/data-metrics/data-origin-and-collection/).

## Enable it

Create a GitHub Actions variable named `HECAVEX_ANALYTICS_TOKEN` in each repository:

- `hecavex.github.io`
- `apt.hecavex.com`
- `labs.hecavex.com`

The value is embedded in the built HTML, so it is a variable rather than a secret. Use the same token if these three measured sites should appear in one view. Use separate tokens if you want separate dashboards. HECAVEX Radar deliberately has no first-party analytics.

## Disable it

Remove the variable and deploy again. The main site and APT Notes omit the loader. Labs removes its placeholder while staging the GitHub Pages artifact.
