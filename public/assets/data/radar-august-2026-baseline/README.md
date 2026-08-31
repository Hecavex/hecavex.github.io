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
