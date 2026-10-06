"""Offline synthetic regressions for the public monthly aggregation.

Copyright (c) 2026 Deividas Lis. SPDX-License-Identifier: MIT
"""
import copy
import hashlib
import importlib.util
import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SPEC = importlib.util.spec_from_file_location("radar_baseline_replay", ROOT / "replay.py")
replay = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(replay)


def event(number=1, identifier="1" * 20, day="2026-09-01", **updates):
    value = {"eventId": f"{number:032x}", "signalId": identifier,
             "domain": "fixture[.]example", "brand": "Synthetic fixture",
             "observedAt": day + "T00:00:00.000Z", "eventType": "observation",
             "previousStatus": None, "status": "suspected", "sources": ["CertStream"],
             "reasonCodes": []}
    value.update(updates)
    return value


def coverage_day(day="2026-09-01", lower=470.0, upper=480.0):
    return {"date": day, "collectorCoverage": {
        "windowSeconds": 86400, "recordedAttempts": 1, "scheduledSlots": 96,
        "healthyAttempts": 1, "listeningSeconds": lower,
        "coverageBounds": {"methodVersion": 2, "lowerSeconds": lower, "upperSeconds": upper,
                           "reportedWorkerSeconds": 490.0, "unknownAttempts": 0},
        "outcomes": {"healthy-empty": 1},
    }}


class ReplayTests(unittest.TestCase):
    def test_exact_utc_month_boundaries(self):
        self.assertFalse(replay.in_month("2026-08-31T23:59:59.999Z"))
        self.assertTrue(replay.in_month("2026-09-01T00:00:00.000Z"))
        self.assertTrue(replay.in_month("2026-09-30T23:59:59.999Z"))
        self.assertFalse(replay.in_month("2026-10-01T00:00:00.000Z"))

    def test_non_utc_timestamp_rejected(self):
        with self.assertRaises(ValueError):
            replay.in_month("2026-09-01T03:00:00.000+03:00")

    def test_duplicate_event_does_not_duplicate_host_or_observation(self):
        one = event()
        result = replay.aggregate_events([one, copy.deepcopy(one)])
        self.assertEqual(len(result["events"]), 1)
        self.assertEqual(len(result["hosts"]), 1)

    def test_conflicting_duplicate_event_rejected(self):
        with self.assertRaises(ValueError):
            replay.aggregate_events([event(), event(brand="Changed")])

    def test_multiple_days_are_one_monthly_host(self):
        result = replay.aggregate_events([event(), event(2, day="2026-09-02")])
        self.assertEqual(len(result["events"]), 2)
        self.assertEqual(len(result["hosts"]), 1)

    def test_publication_pair_is_two_events_one_host(self):
        result = replay.aggregate_events([event(), event(2, eventType="status-transition",
                                                        reasonCodes=["first-publication"])])
        self.assertEqual(len(result["events"]), 2)
        self.assertEqual(len(result["hosts"]), 1)
        self.assertEqual(len(result["publicationIds"]), 1)

    def test_repeated_publication_marker_rejected(self):
        first = event(eventType="status-transition", reasonCodes=["first-publication"])
        second = event(2, eventType="status-transition", reasonCodes=["first-publication"])
        with self.assertRaises(ValueError):
            replay.aggregate_events([first, second])

    def test_one_id_cannot_represent_two_hosts(self):
        with self.assertRaises(ValueError):
            replay.aggregate_events([event(), event(2, domain="other[.]example")])

    def test_one_host_cannot_have_two_ids(self):
        with self.assertRaises(ValueError):
            replay.aggregate_events([event(), event(2, identifier="2" * 20)])

    def test_one_host_cannot_have_two_brand_labels(self):
        with self.assertRaises(ValueError):
            replay.aggregate_events([event(), event(2, brand="Another brand")])

    def test_refanged_hostname_rejected(self):
        with self.assertRaises(ValueError):
            replay.aggregate_events([event(domain="fixture.example")])

    def test_source_union_is_not_event_sum(self):
        result = replay.aggregate_events([event(), event(2, sources=["URLScan"])])
        self.assertEqual(result["hosts"]["1" * 20]["sources"], {"CertStream", "URLScan"})

    def test_out_of_month_events_excluded(self):
        result = replay.aggregate_events([event(), event(2, day="2026-10-01")])
        self.assertEqual(len(result["events"]), 1)

    def test_byte_hash_mismatch_rejected(self):
        payload = b"test"
        entry = {"path": "fixture", "bytes": 4, "sha256": hashlib.sha256(payload).hexdigest()}
        self.assertEqual(replay.verified_body(entry, payload), payload)
        with self.assertRaises(ValueError):
            replay.verified_body(entry, b"tEst")
        with self.assertRaises(ValueError):
            replay.verified_body(entry, b"test+")

    def test_manifest_only_exact_pinned_urls(self):
        manifest = json.loads((ROOT / "source-manifest.json").read_text(encoding="utf-8"))
        self.assertEqual(len(replay.validate_manifest(manifest)), 39)
        manifest["inputs"][0]["url"] += "?redirect=elsewhere"
        with self.assertRaises(ValueError):
            replay.validate_manifest(manifest)

    def test_redirects_rejected(self):
        with self.assertRaises(ValueError):
            replay.NoRedirects().redirect_request(None, None, 302, "Found", {}, "https://example.org/")

    def test_csv_injection_rejected(self):
        for label in ("=1+1", "+1", " -1", "@SUM(A1)", "Name\tCell"):
            with self.subTest(label=label), self.assertRaises(ValueError):
                replay.csv_bytes([{"brand": label, "count": 1}])
        self.assertIn("Bitė".encode(), replay.csv_bytes([{"brand": "Bitė", "count": 1}]))

    def test_decimal_second_sums_are_stable(self):
        self.assertEqual(replay.total([0.1, 0.2]), 0.3)

    def test_coverage_sums_bounds_not_worker_totals(self):
        result = replay.coverage_summary([coverage_day(), coverage_day("2026-09-02", 460, 475)])
        self.assertEqual(result["lowerListeningSeconds"], 930)
        self.assertEqual(result["upperListeningSeconds"], 955)
        self.assertEqual(result["reportedWorkerSeconds"], 980)
        self.assertEqual(result["recordedAttempts"], 2)
        self.assertEqual(result["windowSeconds"], 172800)
        self.assertEqual(result["lowerWallClockPercent"], round(930 / 172800 * 100, 6))

    def test_coverage_rejects_reversed_or_out_of_window_bounds(self):
        for lower, upper in [(-1, 1), (100, 99), (86400, 86401)]:
            with self.subTest(lower=lower, upper=upper), self.assertRaises(ValueError):
                replay.coverage_summary([coverage_day(lower=lower, upper=upper)])

    def test_coverage_rejects_legacy_method(self):
        row = coverage_day()
        row["collectorCoverage"]["coverageBounds"]["methodVersion"] = 1
        with self.assertRaises(ValueError):
            replay.coverage_summary([row])

    def test_coverage_listening_value_must_equal_lower_bound(self):
        row = coverage_day()
        row["collectorCoverage"]["listeningSeconds"] = 480
        with self.assertRaises(ValueError):
            replay.coverage_summary([row])

    def test_month_coverage_excludes_adjacent_utc_dates(self):
        rows = [coverage_day("2026-08-31")] + [coverage_day(day) for day in replay.DAYS]
        rows.append(coverage_day("2026-10-01"))
        result = replay.coverage_summary(replay.september_days(rows))
        self.assertEqual(result["days"], 30)
        self.assertEqual(result["recordedAttempts"], 30)
        self.assertEqual(result["lowerListeningSeconds"], 30 * 470)

    def test_missing_reordered_or_duplicate_month_days_rejected(self):
        complete = [coverage_day(day) for day in replay.DAYS]
        for rows in (complete[:-1], list(reversed(complete)), complete + [complete[-1]]):
            with self.subTest(length=len(rows)), self.assertRaises(ValueError):
                replay.september_days(rows)


if __name__ == "__main__":
    unittest.main()
