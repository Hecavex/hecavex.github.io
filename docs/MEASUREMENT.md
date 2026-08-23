# Site measurement

The production build of `hecavex.com` uses a manually installed Cloudflare Web Analytics beacon. Its narrow purpose is to show which publications are read, how readers reach them, whether navigation paths fail and how the static pages perform on real devices.

This is an operating note for the maintained HECAVEX publication. The reader-facing disclosure is available in [English](https://hecavex.com/en/privacy/) and [Lithuanian](https://hecavex.com/lt/privatumas/).

## Production contract

The shared Astro component reads `PUBLIC_HECAVEX_ANALYTICS_TOKEN` at build time. When the value is present, every generated HECAVEX shell document contains exactly one loader immediately before the closing `body` tag. The loader:

- stops before making an analytics request when the browser reports `Do Not Track: 1`;
- creates the Cloudflare script as a JavaScript module;
- loads only `https://static.cloudflareinsights.com/beacon.min.js`; and
- passes the configured site tag through `data-cf-beacon`.

The Pages workflow requires the repository variable `HECAVEX_ANALYTICS_TOKEN`. That value is visible in generated HTML by design and is not an API key or authentication secret. Keeping it behind the build variable makes replacement explicit without pretending it can be concealed from visitors.

The release audit requires one beacon URL and one configured site-tag reference in every generated shell page. The Pages gate also checks the deployed entry document without printing the tag. A production build therefore cannot silently publish without the measurement code while the public policy says it is active.

Local and pull-request builds remain keyless unless `PUBLIC_HECAVEX_ANALYTICS_TOKEN` is supplied. In that mode the component emits nothing, and the same audit requires zero beacon references.

Cloudflare's automatic Web Analytics injection must remain disabled for this property. Enabling both the dashboard injection and the manual component could send duplicate page-load measurements.

## Data boundary

Cloudflare documents the beacon as browser-based real-user measurement. It can collect page and landing paths without query strings, referrer, host, country, device, browser, operating system, navigation type, page-load and resource timings, and Core Web Vitals.

Cloudflare states that Web Analytics does not use cookies, `localStorage`, `sessionStorage` or IndexedDB, does not keep a persistent browser identifier, and does not fingerprint an individual or track that person across its customers' sites. It also says that the receiving service discards source IP addresses at the nearest Cloudflare data centre rather than storing them in its core databases or logs.

Cloudflare currently documents seven days of unsampled data before longer-term aggregation to around ten percent, six months of dashboard availability and possible query sampling. Its network may process a request in a country or region different from the visitor's location. Content blockers may prevent delivery, so the dashboard is directional rather than a complete readership ledger.

Primary provider references:

- [Data origin and collection](https://developers.cloudflare.com/web-analytics/data-metrics/data-origin-and-collection/)
- [RUM beacon data and privacy boundary](https://developers.cloudflare.com/speed/observatory/rum-beacon/)
- [Available dimensions](https://developers.cloudflare.com/web-analytics/data-metrics/dimensions/)
- [Web Analytics FAQ](https://developers.cloudflare.com/web-analytics/faq/)
- [Cloudflare privacy policy](https://www.cloudflare.com/privacypolicy/)

## Portfolio scope

All four production properties—HECAVEX Research, APT Notes, Radar and Labs—load the same Cloudflare Web Analytics site tag. Each repository installs its own beacon; navigating between properties does not transfer the script or browser state from one deployment to another.

Labs' ATT&CK workspace is a distinct feature. It separately stores readiness assessments, incident timelines, observation drafts and workspace metadata in the visitor's `localStorage`; that workspace can be cleared in Labs or through browser site-data controls. Cloudflare Web Analytics does not use that workspace data.

Changes in another repository must be reviewed against the public privacy wording before deployment.

## Security boundary

This site currently publishes no Content Security Policy, so no CSP allowlist was expanded for the beacon. If a policy is introduced later:

- authorize the inline loader with a nonce or hash rather than broadly enabling unsafe inline scripts;
- add only `https://static.cloudflareinsights.com/beacon.min.js` to `script-src`; and
- add only `https://cloudflareinsights.com` to `connect-src` where the manual reporting endpoint requires it. A proxied same-origin `/cdn-cgi/rum` request is already covered by `self`.

Cloudflare does not currently offer a stable versioned beacon URL suitable for Subresource Integrity. Do not invent an integrity hash for the moving `beacon.min.js` target.

## Changing or disabling measurement

Replacing the site tag requires updating the repository variable and rebuilding. Disabling production measurement is a publication-policy change, not only a configuration edit: remove the production requirement, update both public privacy pages to describe the new behavior, then deploy. The release audit should remain in place so the configured and generated states cannot diverge.
