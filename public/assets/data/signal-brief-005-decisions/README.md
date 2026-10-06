# Signal Brief 005: from advisory to decision

This is a small companion to [Signal Brief 005](https://hecavex.com/en/briefings/2026-08-30/), prepared on 10 September 2026. [Lietuviškai](README.lt.md).

Two source-backed vulnerability records and three **fictional** asset decisions show the missing step between “known exploited” and “what should this owner do?” The original brief's 30 August cutoff is preserved. This companion records a later 10 September source check; it does not rewrite the historical brief as a current feed.

## Files

- [records.json](records.json): selected vendor facts, exact references, source cutoffs and explicit unknown predictive scores.
- [records.csv](records.csv): flat source-backed export; dates and local-assessment requirements survive import.
- [worked-decisions.json](worked-decisions.json): fictional organization inventory, actions, owners and closure evidence.
- [decision-template.csv](decision-template.csv): blank local worksheet. Keep completed real inventories private.
- [consumer.mjs](consumer.mjs): offline version-range demonstration.
- [manifest.json](manifest.json): SHA-256 and byte count for every companion file.

Download all files into one directory and run `node consumer.mjs` with Node 22 or newer. The script reads only its adjacent fixtures, prints JSON and makes no network calls. It neither changes systems nor assigns a risk score. Compare each downloaded file with its manifest digest before use; for a durable citation, retain the manifest alongside the site's release identity or pinned repository revision.

## What the source records mean

The Gitea record preserves the vendor's affected/fixed range and prerequisites. The ownCloud record deliberately keeps its specific advisory's affected range separate from the broader remediation notice. Being outside a cited range is **not** a general safety verdict. Product variants, backports, unusual version strings and newly published guidance still need a real applicability decision.

KEV state is a dated observation from CISA's 9 September catalogue, accessed on 10 September. It says exploitation was known somewhere. It does not say that one of the fictional assets—or a reader's system—was compromised. The package does not adopt a CISA due date as a universal deadline. EPSS was not collected: null remains unknown, not zero. Historical fixed versions are evidence references, not advice to install an unsupported version today.

Primary references are listed by exact URL and locator in records.json: the [Gitea advisory](https://github.com/go-gitea/gitea/security/advisories/GHSA-rcr6-4jqh-j84m), [ownCloud advisory](https://owncloud.com/security-advisories/webdav-api-authentication-bypass-using-pre-signed-urls/), [ownCloud remediation notice](https://owncloud.com/blogs/immediate-action-required-critical-security-updates-for-owncloud/) and [CISA's official KEV data](https://github.com/cisagov/kev-data). Source facts are summarized; upstream pages and their terms remain authoritative.

## Work the decision, not just the number

The two Gitea examples have the same product version. One has an internet-reachable affected route and repository writers; the other has a verified isolated test role and disabled route. Their immediate exposure decisions differ. Neither control changes the vulnerability's identity, proves past safety or creates a permanent exception.

The ownCloud example has no established version. Its result is “unknown-version,” not “unaffected.” Its first work item is to resolve the inventory gap while preserving evidence.

For each example, identify the fact that would change the action. Then replace the invented inventory with authorized local evidence in a private copy of the blank template. Record who owns the decision, the reason for the target time, missing evidence and the test that closes the work. A patch ticket and a compromise assessment answer different questions.

## Validation and limitations

Automated tests exercise numeric version comparison, range boundaries, unknown/prerelease strings, explicit excluded products, safe CSV cells, source-reference integrity and manifest consistency. This is a tested data-handling example, not a production vulnerability scanner or a measured operational pilot. Fictional target times are exercise choices, not vendor or regulatory deadlines.

Changes require a new release identifier, update note and regenerated manifest. Preserve old bundles for historical comparison; do not silently overwrite an imported decision. No provider keys, exploit code, production assets, external scans or automatic reporting are required.

Original HECAVEX companion text/data: CC BY 4.0. Original companion code: MIT under the repository licence. Upstream sources retain their own rights. This release contains no real organization inventory.
