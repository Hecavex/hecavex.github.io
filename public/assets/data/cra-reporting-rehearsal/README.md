# CRA Article 14: evidence-to-notification rehearsal

A fictional, offline companion to the [HECAVEX CRA guide](https://hecavex.com/en/research/cra-article-14-vulnerability-incident-reporting-guide/), prepared on 10 September 2026. [Lietuviškai](README.lt.md).

This is an internal-workflow exercise, **not an official SRP form, legal determination or real incident**. Every product, build, event and participant role is fictional. The exercise assumes an in-scope manufacturer and explicitly supplies awareness decisions; the code cannot determine legal scope, active exploitation or incident severity.

## Materials

[Scenario and expected results](scenario.json), [blank evidence/decision register](decision-template.csv), [offline rehearsal helper](rehearsal.mjs), [manifest](manifest.json).

Download the files together and run `node rehearsal.mjs` with Node 22 or newer. It reads the fictional scenario and prints the exercise's outer-time calculations. It performs no network requests, submissions or system changes. Preserve an approved real register privately rather than committing it beside this public example.

## Exercise

1. Read the three build records. Explain why component presence, enabled functionality and actual customer reachability are different facts.
2. Use E01–E03 to list what is known and what is still missing. A public exploitation report alone does not prove product-specific scope.
3. At E04 the fictional coordinator makes an explicit awareness decision. Record the supporting evidence and unresolved build 2.4.1 configuration. Do not wait for perfect attribution or silently reset awareness when another source arrives.
4. Follow the vulnerability path. The 24/72-hour outer times use awareness; the final-report example uses when the corrective measure becomes available.
5. Follow the separate severe-incident path. Its final-report example uses the **actual submission** of the incident notification, not the awareness date or patch date.
6. Prepare a minimal warning and a later enriched notification from the register. Identify missing fields, approval authority, evidence custody and affected-user communication. Do not send either.
7. Debrief: which missing fact delayed the decision, which assertion exceeded its evidence, and could another participant reconstruct why the decision was made?

The helper preserves null when a final-report trigger is unknown. It requires explicit valid UTC timestamps, rejects unknown paths, and refuses a month-end rollover that this bounded exercise does not resolve. It is not a general legal deadline calculator. “Without undue delay” remains relevant; an outer time is not permission to wait.

## Official handoff, not a replacement portal

Use ENISA's [SRP guidance index](https://www.enisa.europa.eu/topics/product-security/single-reporting-platform-srp) for registration, submission/update instructions and the glossary of official fields. Read the [current FAQ](https://www.enisa.europa.eu/topics/product-security/single-reporting-platform-srp/frequently-asked-questions), including the distinction between interface counters and reporting responsibility. The [Commission reporting page](https://digital-strategy.ec.europa.eu/en/policies/cra-reporting) explains the reporting start and paths.

The worksheet's names are internal aids, not claimed official field identifiers. The exact current portal URL, account role, relevant coordinating CSIRT, scope and notification fields must be confirmed through official guidance by the authorized representative. No SRP account is created and no real information is submitted by this package.

## Validation and boundaries

Tests check the two supplied paths, unknown triggers, invalid dates, actual-notification anchoring, month-end refusal and unchanged awareness arithmetic. A checked exercise result is not a human tabletop, legal review or demonstrated incident-response capability. Record any actual exercise participants, failures and outcomes separately; never populate those fields from this fictional scenario.

The source index and access dates are in scenario.json. New official guidance or a material scenario correction requires a new release identifier and manifest. Original companion text/data: CC BY 4.0; original code: repository MIT licence. Official documents retain their own rights.
