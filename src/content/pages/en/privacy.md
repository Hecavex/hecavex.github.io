---
layout: page
lang: en
translation_key: privacy
title: Privacy
description: HECAVEX privacy, browser storage and audience measurement policy.
permalink: /en/privacy/
---

Last updated: 23 August 2026

## Scope

This notice covers the public HECAVEX portfolio: `hecavex.com`, `apt.hecavex.com`, `radar.hecavex.com` and `labs.hecavex.com`. Each property is deployed separately and loads its own measurement code.

The manually installed Cloudflare Web Analytics beacon described below is active in the production build of all four properties. They use the same public site tag so their aggregate measurements can be viewed together. Following a portfolio link does not carry code or stored state from one property to another; the destination loads its own beacon. Labs also has a separate browser-local workspace described below.

## Cookies and browser storage

The main publication does not set first-party advertising or analytics cookies, use marketing pixels, record sessions, or create visitor accounts. Its interface currently stores no language or privacy-notice preference in `localStorage`; earlier wording that described those values was obsolete and has been removed.

[Cloudflare states in its RUM beacon documentation](https://developers.cloudflare.com/speed/observatory/rum-beacon/) that its Web Analytics beacon does not read or write cookies, `localStorage`, `sessionStorage` or IndexedDB and does not keep a persistent analytics identifier in the browser. It generates the measurement in memory for the page currently being viewed.

HECAVEX Labs is the portfolio exception. Its ATT&CK workspace saves readiness assessments, incident timelines, observation drafts and their workspace metadata in `localStorage` on the visitor's device. The workspace uses that data locally rather than sending the saved workspace to HECAVEX. It remains until the visitor clears it with the Labs control or removes the site's browser data.

## Cloudflare Web Analytics

All four production properties load a client-side measurement script from `static.cloudflareinsights.com`. The script sends real-user performance and aggregate audience measurements to Cloudflare. Depending on how a property is delivered, the reporting endpoint is its `/cdn-cgi/rum` path or `cloudflareinsights.com`.

The measurements can include:

- page views, visits, host and page or landing path without query strings;
- referring site or page information supplied by the browser;
- country, device type, browser, operating system and navigation type;
- page-load, resource-timing and Core Web Vitals measurements.

[Cloudflare's data-handling documentation](https://developers.cloudflare.com/web-analytics/data-metrics/data-origin-and-collection/) says that the receiving service sees the source IP address as part of normal HTTP delivery but discards it at the nearest Cloudflare data centre instead of storing it in the service's core databases or logs. Cloudflare also states that Web Analytics does not fingerprint an individual or track that person across its customers' sites. These are Cloudflare's descriptions of its service; its current [privacy policy](https://www.cloudflare.com/privacypolicy/) governs Cloudflare's processing.

HECAVEX uses the resulting aggregate dashboard to understand which research is read, how visitors reach it, whether navigation paths are broken, and how pages perform on real devices. The measurements are not used by HECAVEX to build individual visitor profiles, serve advertising, or make decisions about a person.

## Retention and access

Cloudflare currently states that unsampled beacon data is retained for seven days and is then aggregated to around ten percent for longer-term storage. Web Analytics data is available in the Cloudflare dashboard for the previous six months. Cloudflare may sample dashboard or API queries depending on volume and filters.

Access to the HECAVEX analytics view is limited to authorised access to the relevant Cloudflare account. HECAVEX does not publish visitor-level beacon payloads. Cloudflare may process measurements in a country or region selected by its network routing, which may differ from the visitor's location.

## Blocking client-side measurement

The HECAVEX loader does not activate the analytics beacon when the browser sends a Do Not Track value of `1`. Browser privacy controls and content blockers may also block the beacon. A visitor can prevent this client-side measurement by disabling JavaScript for the site or blocking requests to `static.cloudflareinsights.com` and `cloudflareinsights.com`.

Those controls concern the client-side Web Analytics beacon. They do not prevent the ordinary HTTP request metadata that a hosting, DNS, CDN or network provider must process to deliver and protect a website. Such providers apply their own retention and privacy terms.

## External links

Articles may link to external sources. HECAVEX does not load tracking technology from those websites merely because a link appears on a page. If you follow an external link, the destination applies its own privacy and cookie practices.

This notice will be updated before a material new tracking or third-party embed is intentionally enabled. Privacy questions or corrections can be sent to [info@hecavex.com](mailto:info@hecavex.com).
