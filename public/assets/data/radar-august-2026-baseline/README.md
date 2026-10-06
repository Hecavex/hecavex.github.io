# HECAVEX Radar August 2026 baseline

This bundle preserves the aggregate values used by the bilingual HECAVEX Research baseline published on 31 August 2026. The source cutoff is `2026-08-30T17:20:26.330Z`.

## Files

- `summary.json` — publication-safe aggregate counts, source health, retention, semantics and SHA-256 provenance for the two source snapshots.

## Evidence boundary

The bundle is derived from the public HECAVEX Radar snapshot and pipeline-health record. It intentionally does not duplicate the live candidate inventory. A candidate is a discovery lead, not a maliciousness verdict. Counts do not measure Lithuanian phishing prevalence, confirmed incidents, victims, actor infrastructure or losses.

Source record counts are not additive because the public view deduplicates candidates while retaining evidence from multiple sources. Missing days in the sparse `dailyLastSeen` object do not establish that no collection or threat activity occurred.

## Canonical sources

- Radar snapshot: <https://radar.hecavex.com/data/radar.json>
- Pipeline health: <https://radar.hecavex.com/data/pipeline-health.json>
- Methodology: <https://radar.hecavex.com/methodology/>
- Dataset contract: <https://radar.hecavex.com/dataset/>
- Brand registry: <https://radar.hecavex.com/brands/>
- Change record: <https://radar.hecavex.com/changes/>

The SHA-256 values in `summary.json` identify the exact local source files used for the aggregate. The live URLs can change after later synchronization.

## Replay clarification - 7 September 2026

The preserved aggregate values can be inspected and cited, but complete independent replay of this release is not available as a tested procedure. Both exact input files have now been located in immutable repository history: [radar.json](https://github.com/Hecavex/radar.hecavex/blob/6a9327ff77a03e25d2be37e5a775f877a4da3183/public/data/radar.json) and [pipeline-health.json](https://github.com/Hecavex/radar.hecavex/blob/6a9327ff77a03e25d2be37e5a775f877a4da3183/public/data/pipeline-health.json). Their byte lengths and SHA-256 values match this bundle. A hash check establishes input identity, not a complete reconstruction of every derived field. No retained, tested aggregation command accompanies the original release. The original `summary.json` is preserved byte-for-byte. Its scope sentence calling the aggregate reproducible is historical wording and is superseded by this clarification. This correction does not change any aggregate value or claim a new collection. The live URLs above are context, not the fixed inputs for this baseline.
