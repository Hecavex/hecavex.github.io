# Radar September 2026 baseline, aggregate package 1.0

This package reproduces the September activity described in the English and Lithuanian HECAVEX Radar baseline. It is a measurement of a bounded collection and publication system, not a count of successful attacks, victims or all phishing in Lithuania.

## Window and frozen source

The event window is **2026-09-01 00:00:00 UTC inclusive to 2026-10-01 00:00:00 UTC exclusive**. The frozen release was generated at **2026-10-01 00:40:26.566 UTC**. October event timestamps are excluded from the monthly calculation.

- Publication/data snapshot: [`3d80a765404f50afbe50c3dc49472751a2e13b65`](https://github.com/Hecavex/radar.hecavex.com/tree/3d80a765404f50afbe50c3dc49472751a2e13b65).
- Generator source: [`33075e4ca3fb5ab223fab61a92125bb2c797e2f5`](https://github.com/Hecavex/radar.hecavex.com/tree/33075e4ca3fb5ab223fab61a92125bb2c797e2f5).
- Declared input-data revision: `e703afd425b4e0c74aac9f19efdc9d7b9dcbcae9`, recorded by the pinned `radar-publication.json`.
- Discovery counting method: 2. Listening-coverage bounds method: 2.

All 30 September UTC daily event partitions remain in this release. History compaction compares UTC calendar dates, so the 00:40 generation time does not trim the first 40 minutes of the September 1 partition. Retaining each partition does not establish complete collection of upstream certificates, all workflow attempts or all relevant phishing.

## Files

| File | Purpose |
| --- | --- |
| [summary.json](summary.json) | Monthly distinct-host and event counts, coverage, separate snapshot context and explicit limits |
| [daily.csv](daily.csv) | All 30 UTC dates, daily distinct hosts, event counts, attempts and listening bounds |
| [brands.csv](brands.csv) | Distinct monthly hosts and first-publication-marked hosts by registry label |
| [source-manifest.json](source-manifest.json) | Exact URL, revision, original byte count and SHA-256 for each of 39 inputs |
| [replay.py](replay.py) | Standard-library calculation and exact-byte comparison against the three aggregate outputs |
| [replay_test.py](replay_test.py) | Offline synthetic boundary, deduplication, provenance and export-safety tests |
| [LICENSE-CODE.txt](LICENSE-CODE.txt) | MIT terms for the original replay and test code |

The released outputs contain no candidate domains, URLs, signal identifiers or raw observation inventory. The replay reads already public, defanged Radar records in memory. It never resolves, browses, scans or otherwise connects to a candidate host. Its only network destinations are the exact immutable official GitHub raw URLs listed in the manifest. Redirects, unexpected paths, oversized responses and byte/hash mismatches fail closed.

## Reproduce

Download this directory's files together. Python 3.10 or later is sufficient. No external Python packages, API credentials or private database are needed.

```text
python -B replay_test.py
python -B replay.py
```

The first command runs 24 offline synthetic tests. The second downloads 39 pinned public inputs, validates their bytes and SHA-256, reconciles the publisher manifest, recomputes the aggregates, and requires exact matches with `summary.json`, `daily.csv` and `brands.csv`. It leaves the downloaded host-level records in memory only. `python -B replay.py --write` regenerates only those three adjacent aggregate files.

The publication-time replay passed against all 39 immutable inputs and all 24 synthetic tests passed. The code checks both directions of the signal-ID/normalized-hostname mapping, rejects conflicting brand labels, rejects conflicting or repeated first-publication events, checks every daily partition and compares daily counts with the pinned trends release. Coverage tests preserve the distinction between bounds and worker totals, reject invalid bounds and verify that adjacent UTC dates cannot enter the September aggregate. Brand strings beginning with spreadsheet formula prefixes are rejected before CSV export.

Expected aggregate hashes:

```text
793bc61c2ee6a5f1f093babd142659bc252d4fe5bf6466e0e1d22bf895cdd141  summary.json
004e91d9d422808985c7834e165db585b9236c96453276bb170292b2646e26b3  daily.csv
55e8045f9d4605f7463a5b41901e9c4d115204e687d2bde31261a3e4e68f6176  brands.csv
```

These hashes prove byte agreement with this package. They do not prove maliciousness or upstream completeness.

## What each denominator means

| Measurement | Result | Denominator and interpretation |
| --- | ---: | --- |
| Monthly observed hosts | 447 | Distinct signal IDs across all September events, with one-to-one normalized-host mapping verified |
| First-publication-marked hosts | 437 | Distinct IDs in `status-transition` events with null previous status and `first-publication` reason |
| Other observed hosts | 10 | Monthly hosts without a first-publication marker inside September, already represented earlier in pinned history |
| Observation events | 513 | Deduplicated `observation` events, not unique hosts |
| All events | 950 | 513 observations plus 437 first-publication-marked transitions |
| Other status transitions | 0 | Events whose previous status is non-null, not evidence of zero takedowns |
| Daily unique-count sum | 508 | Host-days, because one host can appear on several UTC dates |
| Brand labels represented | 30 | 46 entries in the generator's registry, not a population of all Lithuanian brands |
| Recorded attempts | 2,419 | 2,880 planned 15-minute intervals over 30 days, a ratio of 83.993056% |
| Listening lower bound | 1,160,977.181 seconds | 322.493661 of 720 wall-clock hours, or 44.790786% |
| Listening upper bound | 1,161,090.024 seconds | 322.525007 of 720 wall-clock hours, or 44.795140% |
| Planned listening ceiling | 53.333333% | Four planned eight-minute listening periods per hour, not continuous coverage |

The first-publication marker is dated using the exported observation timestamp. It is not a domain-registration date, proof of a newly established attack, or an exact timestamp of the GitHub Pages deployment. In this particular release the 437 first-publication-marked IDs exactly equal the public-history cohort whose `firstSeen` falls within September. That equality is tested, not assumed as a universal contract.

Brand rows are additive here because the replay verifies one non-conflicting registry label for each monthly host. Source labels are set membership and can overlap in general. In this month's exported events all 447 hosts have the `CertStream` label. That label is shared by the live stream and checkpointed CT-search archive. The archived history does not support splitting the 447 hosts between those collection paths.

The pinned trends artifact classifies 63 observation events as reobservations. This is not `513 - 437`. Its classification depends on the generator's retained earlier publication provenance and current inventory, and some older provenance is unavailable to that calculation. This package preserves that published field but does not relabel the arithmetic remainder or use it to infer the number of returning campaigns.

## Collection coverage

The collection totals aggregate the original method-2 bounds in the pinned `daily-trends.json`, not newly invented listening intervals. The replay independently reconciles discovery counts against raw public daily history. It does **not** claim to independently rerun the collector or reconstruct every connection interval from raw worker logs.

The producer bounds unique listening time using each attempt's start/end envelope and accumulated connected seconds. Overlap and reconnect gaps cannot safely be reconstructed from a total alone. Daily `listeningSeconds` is the conservative lower bound. This package sums the bounds across disjoint UTC days and retains the upper bound separately. Worker-second totals are a different measure and are not substituted for wall-clock coverage.

Attempts are counted once by their end-time attribution. A midnight-spanning attempt can contribute clipped listening time on both UTC dates. Attempt counts relative to planned slots do not prove that each distinct scheduled slot executed exactly once. All 2,419 persisted attempts have healthy outcomes in this release, with 2,001 `healthy-empty` and 418 `healthy-matches`. This is not a claim that cancelled, missing or uncommitted workflow runs never occurred.

September 1–10 contains 513 recorded attempts against 960 planned slots and 28.501541% lower-bound listening coverage. September 11–30 contains 1,906 against 1,920 and 52.935409% lower-bound coverage. This is a collection-state comparison. It does not establish a corresponding change in the underlying amount of phishing.

## Separate snapshot, evidence and review limits

The 00:40 October 1 live snapshot contains 105 rows, not the 447-host monthly cohort. Its source records use bounded live input retention. Of those 105 rows, 103 overlap the monthly cohort. One was first observed on October 1 and one older HECAVEX review-export record was last observed on August 25.

All 105 snapshot rows are `name-only`. There are 104 `unreviewed` rows and one `needs-review` row, with 104 CertStream source memberships and one HECAVEX membership. These are snapshot-only statistics. Archived monthly history events do not preserve evidence-tier fields, so assigning the same tiers to all 447 historical hosts would invent evidence.

The pinned public review metrics contain zero completed exported assessments and no available population-precision estimate. Their 606 eligible-history records belong to the broader retained-history denominator, not September's 447 hosts. An absent review is not a benign verdict, and an automated `suspected` status is not a confirmed incident.

## Historical interpretation

Do not use a later mutable `daily-trends.json` as the frozen source for this article. The pinned generator retained daily history detail for 30 days before compaction. Its pre-correction trends builder read those daily partitions but not the compacted discovery summaries. The October 4 pre-correction projection consequently reported zero discovery for September 1–3 even though the immutable monthly partitions contain 16, 19 and 17 daily distinct hosts. Recorded attempt telemetry remained available separately. Those zeros were a historical retention defect, not evidence that nothing was observed on the original dates. This describes the implementation at generator revision `33075e4ca3fb5ab223fab61a92125bb2c797e2f5`, not the behaviour of later corrected Radar releases.

The August article measured a 130-row snapshot at **August 30 17:20:26 UTC**, not a complete calendar month's deduplicated activity. Comparing 130 directly with September's 447 would mix snapshot stock with monthly activity. Registry and matcher changes, collection-path differences, sampling gaps, retention, status policy and delayed upstream indexing also limit month-to-month inference.

This package provides no maliciousness precision, victim count, verified Lithuania-targeting rate, actor attribution or domain-blocking recommendation. The frozen release can contain later-normalized metadata and excludes observations that were never collected or admitted by that release's publication policy. It is a reproducible public-source measurement, not an exhaustive reconstruction of September's threat environment.

## Reuse

Original aggregate outputs, `source-manifest.json` and this README are by Deividas Lis / HECAVEX and available under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Cite the article and package version, preserve the observation window and source revision, and retain the limits above. Original replay/test code is MIT-licensed under `LICENSE-CODE.txt`. Upstream Radar code and records retain their applicable original terms. This package does not relicense third-party observations or authorize automated blocking.
