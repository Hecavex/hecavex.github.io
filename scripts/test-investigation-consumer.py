"""Run from the repository root: python scripts/test-investigation-consumer.py."""
import csv
import importlib.util
import io
from pathlib import Path
import tempfile
import unittest
import sys

sys.dont_write_bytecode = True

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("consumer", ROOT / "public/assets/reuse/investigation-consumer/v1.0.0/consume.py")
consumer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(consumer)


class ConsumerTests(unittest.TestCase):
    def test_lossless_all_records_and_context(self):
        output = consumer.consume(ROOT / "public/assets/data")
        expected = []
        for relative, _, _ in consumer.INPUTS:
            expected.extend(csv.DictReader(io.StringIO((ROOT / "public/assets/data" / relative).read_text(encoding="utf-8"))))
        self.assertEqual([r["originalRecord"] for r in output["records"]], expected)
        self.assertTrue(all(not r["automaticBlockingAuthorized"] for r in output["records"]))
        by_value = {r["value"]: r for r in output["records"]}
        self.assertEqual(by_value["s2.adform.net"]["evidenceClass"], "context")
        self.assertEqual(by_value["84.32.102.230"]["evidenceClass"], "historical-receiver-or-transfer-context")
        self.assertEqual(by_value["84.32.102.230"]["observationWindow"], {"first": None, "last": None})
        self.assertEqual(by_value["84.32.102.230"]["displayValue"], "84[.]32[.]102[.]230")
        self.assertTrue(by_value["http://84.32.102.230:7744/p?h={hostname}&u={path}"]["displayValue"].startswith("hxxp://"))
        self.assertEqual(by_value["c03567cac86046a9aa1c1c4b43e0c6de7703b43cf01b3d8229978314afc6e9da"]["evidenceClass"], "exact-malicious-content-hash")

    def test_line_endings_and_changed_content(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            for relative, _, _ in consumer.INPUTS:
                path = root / relative
                path.parent.mkdir(parents=True, exist_ok=True)
                raw = (ROOT / "public/assets/data" / relative).read_bytes().replace(b"\r\n", b"\n")
                path.write_bytes(raw.replace(b"\n", b"\r\n"))
            self.assertTrue(consumer.consume(root)["records"])
            path.write_bytes(path.read_bytes() + b"tampered")
            with self.assertRaisesRegex(ValueError, "Source content changed"):
                consumer.consume(root)

    def test_missing_telemetry_is_not_filled(self):
        with self.assertRaises(ValueError):
            consumer.normalize({"type": "domain", "value": "example.invalid"}, "test", 1, {})


if __name__ == "__main__":
    unittest.main()
