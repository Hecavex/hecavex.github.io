#!/usr/bin/env python3
"""Replay one immutable public Radar month without visiting candidate hosts.

Copyright (c) 2026 Deividas Lis. SPDX-License-Identifier: MIT
See LICENSE-CODE.txt. Python 3.10+ standard library only.
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import io
import json
import re
from collections import Counter
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from decimal import Decimal
from pathlib import Path
from urllib.request import HTTPRedirectHandler, Request, build_opener

ROOT = Path(__file__).resolve().parent
REVISION = "3d80a765404f50afbe50c3dc49472751a2e13b65"
GENERATOR = "33075e4ca3fb5ab223fab61a92125bb2c797e2f5"
BASE = "https://raw.githubusercontent.com/Hecavex/radar.hecavex.com/"
GENERATED = "2026-10-01T00:40:26.566Z"
START = "2026-09-01T00:00:00.000Z"
END = "2026-10-01T00:00:00.000Z"
DAYS = [f"2026-09-{day:02d}" for day in range(1, 31)]
EVENT_PATHS = [f"data/history/daily/{day}/events.ndjson" for day in DAYS]
PUBLIC_PATHS = [f"public/data/{name}.json" for name in (
    "daily-trends", "history", "radar", "quality-metrics", "pipeline-health",
    "feed-manifest", "radar.index",
)]
EXPECTED_PATHS = set(EVENT_PATHS + PUBLIC_PATHS + ["radar-publication.json", "data/brands-lt.json"])
MAX_BYTES = 4 * 1024 * 1024


def require(condition: bool, message: str) -> None:
    if not condition:
        raise ValueError(message)


def timestamp(value: str) -> datetime:
    require(isinstance(value, str) and bool(re.fullmatch(
        r"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z", value)), "Non-canonical UTC timestamp")
    return datetime.fromisoformat(value[:-1] + "+00:00")


def in_month(value: str) -> bool:
    parsed = timestamp(value)
    return timestamp(START) <= parsed < timestamp(END)


def counts(values) -> dict:
    return dict(sorted(Counter(values).items(), key=lambda item: (-item[1], item[0])))


def total(values) -> float:
    return float(sum((Decimal(str(value)) for value in values), Decimal(0)))


def percentage(numerator: float, denominator: float) -> float:
    require(denominator > 0, "Empty denominator")
    return round(numerator * 100 / denominator, 6)


class NoRedirects(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        raise ValueError("Redirects are not allowed for pinned public inputs")


def validate_manifest(manifest: dict) -> list[dict]:
    require(manifest["publicationRevision"] == REVISION, "Unexpected publication revision")
    require(manifest["generatorRevision"] == GENERATOR, "Unexpected generator revision")
    require(manifest["releaseGeneratedAt"] == GENERATED, "Unexpected release timestamp")
    require(manifest["observationWindow"] == {"startInclusive": START, "endExclusive": END},
            "Unexpected observation window")
    entries = manifest["inputs"]
    require(len(entries) == len(EXPECTED_PATHS), "Missing or duplicated input")
    require({entry["path"] for entry in entries} == EXPECTED_PATHS, "Unexpected input path")
    for entry in entries:
        revision = GENERATOR if entry["path"] == "data/brands-lt.json" else REVISION
        require(entry["revision"] == revision, "Input revision does not match its role")
        require(entry["url"] == BASE + revision + "/" + entry["path"], "URL is not exactly allowlisted")
        require(type(entry["bytes"]) is int and 0 < entry["bytes"] <= MAX_BYTES, "Unsafe input size")
        require(bool(re.fullmatch(r"[0-9a-f]{64}", entry["sha256"])), "Invalid SHA-256")
    return entries


def verified_body(entry: dict, body: bytes) -> bytes:
    require(len(body) == entry["bytes"], "Byte length mismatch for " + entry["path"])
    require(hashlib.sha256(body).hexdigest() == entry["sha256"], "SHA-256 mismatch for " + entry["path"])
    return body


def fetch_input(entry: dict) -> tuple[str, object]:
    request = Request(entry["url"], headers={"User-Agent": "HECAVEX-public-baseline-replay/1.0"})
    with build_opener(NoRedirects()).open(request, timeout=45) as response:
        require(response.geturl() == entry["url"], "Unexpected final URL")
        body = verified_body(entry, response.read(entry["bytes"] + 1))
    text = body.decode("utf-8")
    if entry["path"].endswith(".ndjson"):
        parsed = [json.loads(line) for line in text.splitlines() if line]
    else:
        parsed = json.loads(text)
    return entry["path"], parsed


def aggregate_events(events: list[dict]) -> dict:
    """Deduplicate events, then hosts. Reject conflicting identity or brand mappings."""
    selected = [event for event in events if in_month(event["observedAt"])]
    by_event = {}
    by_host = {}
    domain_ids = {}
    for event in selected:
        event_id = event["eventId"]
        require(bool(re.fullmatch(r"[0-9a-f]{32}", event_id)), "Invalid event identifier")
        if event_id in by_event:
            require(by_event[event_id] == event, "Conflicting duplicate event")
            continue
        by_event[event_id] = event
        signal_id, domain, brand = event["signalId"], event["domain"], event["brand"]
        require(bool(re.fullmatch(r"[0-9a-f]{20}", signal_id)), "Invalid signal identifier")
        require(isinstance(domain, str) and domain == domain.strip().lower()
                and "[.]" in domain and not any(c in domain for c in "/:@? \t\r\n"),
                "Expected a normalized defanged hostname")
        require(isinstance(brand, str) and brand, "Missing brand label")
        require(domain_ids.setdefault(domain, signal_id) == signal_id, "One hostname has multiple identifiers")
        host = by_host.setdefault(signal_id, {"domain": domain, "brand": brand, "sources": set()})
        require(host["domain"] == domain, "One identifier maps to multiple hostnames")
        require(host["brand"] == brand, "One hostname has conflicting brand labels")
        require(event["eventType"] in {"observation", "status-transition"}, "Unsupported event type")
        require(set(event["sources"]) <= {"CertStream", "URLScan", "HECAVEX"}, "Unknown provider label")
        host["sources"].update(event["sources"])
    unique_events = list(by_event.values())
    publications = [event for event in unique_events if event["eventType"] == "status-transition"
                    and event["previousStatus"] is None and "first-publication" in event["reasonCodes"]]
    publication_ids = {event["signalId"] for event in publications}
    publication_counts = Counter(event["signalId"] for event in publications)
    require(all(count == 1 for count in publication_counts.values()), "Repeated first-publication marker for one host")
    return {"events": unique_events, "hosts": by_host, "publicationIds": publication_ids,
            "publicationEvents": publications}


def coverage_summary(days: list[dict]) -> dict:
    rows = [day["collectorCoverage"] for day in days]
    seconds = total(row["windowSeconds"] for row in rows)
    attempts = sum(row["recordedAttempts"] for row in rows)
    slots = sum(row["scheduledSlots"] for row in rows)
    lower = total(row["coverageBounds"]["lowerSeconds"] for row in rows)
    upper = total(row["coverageBounds"]["upperSeconds"] for row in rows)
    outcomes = Counter()
    for row in rows:
        require(row["coverageBounds"]["methodVersion"] == 2, "Expected coverage bounds method 2")
        require(0 <= row["coverageBounds"]["lowerSeconds"] <= row["coverageBounds"]["upperSeconds"]
                <= row["windowSeconds"], "Coverage bounds are outside the measurement window or reversed")
        require(row["listeningSeconds"] == row["coverageBounds"]["lowerSeconds"], "Listening value is not the lower bound")
        outcomes.update(row["outcomes"])
    return {
        "days": len(days), "windowSeconds": seconds, "scheduledSlots": slots,
        "recordedAttempts": attempts, "healthyAttempts": sum(row["healthyAttempts"] for row in rows),
        "attemptsRelativeToScheduledSlotsPercent": percentage(attempts, slots),
        "lowerListeningSeconds": lower, "upperListeningSeconds": upper,
        "lowerListeningHours": round(lower / 3600, 6), "upperListeningHours": round(upper / 3600, 6),
        "lowerWallClockPercent": percentage(lower, seconds), "upperWallClockPercent": percentage(upper, seconds),
        "plannedListeningCeilingPercent": percentage(slots * 480, seconds),
        "reportedWorkerSeconds": total(row["coverageBounds"]["reportedWorkerSeconds"] for row in rows),
        "unknownAttempts": sum(row["coverageBounds"]["unknownAttempts"] for row in rows),
        "outcomes": dict(sorted(outcomes.items())),
    }


def september_days(series: list[dict]) -> list[dict]:
    days = [row for row in series if row["date"] in DAYS]
    require([row["date"] for row in days] == DAYS, "Missing, reordered or duplicated September trend date")
    return days


def build_outputs(inputs: dict, manifest: dict) -> tuple[dict, list[dict], list[dict]]:
    for path in PUBLIC_PATHS:
        require(inputs[path]["generatedAt"] == GENERATED, "Mixed public releases: " + path)
    publication = inputs["radar-publication.json"]
    require(publication["generatedAt"] == GENERATED and publication["sourceRevision"] == GENERATOR,
            "Publication provenance mismatch")
    require(publication["inputDataRevision"] == manifest["inputDataRevision"], "Data revision mismatch")
    release_manifest = inputs["public/data/feed-manifest.json"]
    require(release_manifest["generator"]["revision"] == GENERATOR, "Generator mismatch")
    artifacts = {entry["path"]: entry for entry in release_manifest["artifacts"]}
    for entry in manifest["inputs"]:
        if entry["path"] in PUBLIC_PATHS and entry["path"] != "public/data/feed-manifest.json":
            artifact = artifacts[entry["path"].removeprefix("public")]
            require(artifact["bytes"] == entry["bytes"] and artifact["sha256"] == entry["sha256"],
                    "Input does not match the publisher manifest")
    raw_events = []
    for day, path in zip(DAYS, EVENT_PATHS):
        require(all(row["observedAt"][:10] == day for row in inputs[path]), "Event in wrong UTC date partition")
        raw_events.extend(inputs[path])
    aggregate = aggregate_events(raw_events)
    events, hosts = aggregate["events"], aggregate["hosts"]
    require(len(events) == len(raw_events), "Pinned partitions unexpectedly contain duplicate or out-of-window rows")
    pub_ids = aggregate["publicationIds"]
    history = inputs["public/data/history.json"]["signals"]
    history_by_id = {row["id"]: row for row in history}
    require(len(history_by_id) == len(history), "Duplicate history identifier")
    for identifier, host in hosts.items():
        require(identifier in history_by_id, "Monthly host missing from public history")
        record = history_by_id[identifier]
        require(record["domain"] == host["domain"] and record["brand"] == host["brand"], "History identity mismatch")
    first_seen_ids = {row["id"] for row in history if in_month(row["firstSeen"])}
    require(first_seen_ids == pub_ids, "First-seen cohort and publication-marked cohort differ in this release")
    trends = inputs["public/data/daily-trends.json"]
    require(trends["countingMethodVersion"] == 2, "Unexpected discovery method")
    require(trends["collectorSchedule"]["expectedIntervalSeconds"] == 900
            and trends["collectorSchedule"]["expectedListeningSeconds"] == 480, "Unexpected planned schedule")
    days = september_days(trends["series"])
    daily = []
    for row in days:
        require(not row["partialDay"] and row["collectorCoverage"]["windowSeconds"] == 86400,
                "Partial September day")
        day_events = [event for event in events if event["observedAt"][:10] == row["date"]]
        day_aggregate = aggregate_events(day_events)
        observations = sum(event["eventType"] == "observation" for event in day_events)
        changes = sum(event["eventType"] == "status-transition" and event["previousStatus"] is not None
                      for event in day_events)
        discovered = row["discovery"]
        for key, expected in {"events": len(day_events), "uniqueSignals": len(day_aggregate["hosts"]),
                              "observations": observations, "firstPublications": len(day_aggregate["publicationEvents"]),
                              "statusChanges": changes}.items():
            require(discovered[key] == expected, "Daily raw events do not reconcile: " + row["date"] + "/" + key)
        collection = row["collectorCoverage"]
        daily.append({"date": row["date"], "uniqueObservedHosts": len(day_aggregate["hosts"]),
                      "firstPublicationMarkedEvents": discovered["firstPublications"],
                      "observationEvents": observations, "allEvents": len(day_events),
                      "publishedReobservationClassification": discovered["reobservations"],
                      "scheduledSlots": collection["scheduledSlots"], "recordedAttempts": collection["recordedAttempts"],
                      "healthyAttempts": collection["healthyAttempts"],
                      "lowerListeningSeconds": collection["coverageBounds"]["lowerSeconds"],
                      "upperListeningSeconds": collection["coverageBounds"]["upperSeconds"],
                      "lowerWallClockPercent": percentage(collection["coverageBounds"]["lowerSeconds"], 86400),
                      "upperWallClockPercent": percentage(collection["coverageBounds"]["upperSeconds"], 86400)})
    brands = counts(host["brand"] for host in hosts.values())
    new_brands = counts(hosts[identifier]["brand"] for identifier in pub_ids)
    brand_rows = [{"brand": brand, "uniqueObservedHosts": count,
                   "firstPublicationMarkedHosts": new_brands.get(brand, 0),
                   "shareOfMonthlyObservedHostsPercent": percentage(count, len(hosts))}
                  for brand, count in brands.items()]
    snapshot = inputs["public/data/radar.json"]["signals"]
    index = inputs["public/data/radar.index.json"]
    require(index["signalCount"] == index["dashboardSignalCount"] == len(snapshot), "Snapshot is not complete indexed set")
    snapshot_ids = {row["id"] for row in snapshot}
    require(len(snapshot_ids) == len(snapshot), "Duplicate snapshot identifier")
    registry = inputs["data/brands-lt.json"]["entries"]
    quality = inputs["public/data/quality-metrics.json"]
    summary = {
        "schemaVersion": 1, "dataset": "radar-september-2026-baseline", "version": "1.0",
        "observationWindow": {"startInclusive": START, "endExclusive": END},
        "releaseGeneratedAt": GENERATED, "publicationRevision": REVISION, "generatorRevision": GENERATOR,
        "inputDataRevision": publication["inputDataRevision"], "inputFiles": len(manifest["inputs"]),
        "countingMethodVersion": 2, "coverageBoundsMethodVersion": 2,
        "monthlyActivity": {
            "uniqueObservedHosts": len(hosts), "representedBrandLabels": len(brands),
            "registryEntriesAtGeneratorRevision": len(registry), "allEvents": len(events),
            "observationEvents": sum(event["eventType"] == "observation" for event in events),
            "firstPublicationMarkedEvents": len(aggregate["publicationEvents"]),
            "firstPublicationMarkedHosts": len(pub_ids), "otherObservedHosts": len(set(hosts) - pub_ids),
            "firstSeenInSeptemberInPinnedHistory": len(first_seen_ids),
            "statusChangeEvents": sum(event["eventType"] == "status-transition" and event["previousStatus"] is not None for event in events),
            "sumOfDailyUniqueHostsSignalDays": sum(row["uniqueObservedHosts"] for row in daily),
            "sourceLabelsUniqueHosts": counts(source for host in hosts.values() for source in host["sources"]),
            "publishedReobservationClassificationEvents": sum(row["publishedReobservationClassification"] for row in daily),
            "statusAtPinnedHistory": counts(history_by_id[identifier]["latestStatus"] for identifier in hosts),
            "monthlyEvidenceTierDistributionAvailable": False,
        },
        "collection": coverage_summary(days),
        "collectionSubperiods": {"2026-09-01_to_2026-09-10": coverage_summary(days[:10]),
                                 "2026-09-11_to_2026-09-30": coverage_summary(days[10:])},
        "separatePostMonthSnapshot": {
            "generatedAt": GENERATED, "signals": len(snapshot), "monthlyCohortOverlap": len(snapshot_ids & set(hosts)),
            "outsideMonthlyCohort": len(snapshot_ids - set(hosts)),
            "firstSeenAfterMonth": sum(row["firstSeen"] >= END for row in snapshot),
            "lastSeenBeforeMonth": sum(row["lastSeen"] < START for row in snapshot),
            "brands": len({row["brand"] for row in snapshot}),
            "evidenceTiers": counts(row["evidenceTier"] for row in snapshot),
            "reviewStates": counts(row["reviewState"] for row in snapshot),
            "sourceLabels": counts(source for row in snapshot for source in row["sources"]),
            "ltRelevance": counts(row["ltRelevance"] for row in snapshot),
        },
        "publicReviewMetricsAtRelease": {
            "assessments": quality["reviewSample"]["assessments"],
            "assessedSignals": quality["reviewSample"]["uniqueSignals"],
            "precisionAvailable": quality["precision"]["available"],
            "eligiblePublishedSignalsAllRetainedHistory": quality["reviewCoverage"]["eligiblePublishedSignals"],
        },
        "limits": [
            "Source-observation timestamps date the monthly events, not domain registration, attack start or actual deployment.",
            "CertStream is the public source label shared by live collection and checkpointed CT search. It is not proof of exclusive live-stream discovery.",
            "Daily unique host counts sum to signal-days. Deduplicating all monthly signal identifiers gives the monthly host count.",
            "Brand labels describe registry matches, not compromised organizations, victims or verified Lithuanian targeting.",
            "Monthly archived events do not retain evidence tiers. The separate post-month snapshot cannot classify the whole month.",
            "Published reobservation classification depends on retained earlier provenance. It is not the arithmetic remainder after first-publication markers.",
            "Listening bounds measure recorded wall-clock sampling, not detection recall or completeness of upstream CT coverage.",
            "Daily attempt counts are end-time attributed, not a deduplicated census of cron slot identities.",
            "The frozen release preserves all 30 September daily partitions. The pinned generator's pre-correction trends projection lost older discovery detail after history compaction. This describes that historical implementation, not later corrected releases.",
            "The post-month release is 40 minutes and 26.566 seconds after the month boundary. Monthly event filtering excludes October timestamps.",
            "August's 130-row snapshot at August 30 17:20:26 UTC is not the same population as September monthly observed hosts.",
        ],
    }
    return summary, daily, brand_rows


def csv_bytes(rows: list[dict]) -> bytes:
    stream = io.StringIO(newline="")
    writer = csv.DictWriter(stream, fieldnames=list(rows[0]), lineterminator="\n")
    writer.writeheader()
    # Registry labels are not executable spreadsheet expressions.
    for row in rows:
        for value in row.values():
            if isinstance(value, str):
                require(not value.lstrip().startswith(("=", "+", "-", "@"))
                        and not any(character in value for character in "\r\n\t"),
                        "Unsafe spreadsheet string")
        writer.writerow(row)
    return stream.getvalue().encode("utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--write", action="store_true", help="Regenerate only the three adjacent aggregate output files")
    args = parser.parse_args()
    manifest = json.loads((ROOT / "source-manifest.json").read_text(encoding="utf-8"))
    entries = validate_manifest(manifest)
    with ThreadPoolExecutor(max_workers=6) as pool:
        inputs = dict(pool.map(fetch_input, entries))
    summary, daily, brands = build_outputs(inputs, manifest)
    outputs = {"summary.json": (json.dumps(summary, ensure_ascii=False, indent=2) + "\n").encode("utf-8"),
               "daily.csv": csv_bytes(daily), "brands.csv": csv_bytes(brands)}
    for name, body in outputs.items():
        target = ROOT / name
        if args.write:
            target.write_bytes(body)
        else:
            require(target.read_bytes() == body, "Replay differs from published aggregate: " + name)
        print(name, len(body), hashlib.sha256(body).hexdigest())
    print("Verified", len(entries), "immutable public inputs. Monthly hosts:", summary["monthlyActivity"]["uniqueObservedHosts"])


if __name__ == "__main__":
    main()
