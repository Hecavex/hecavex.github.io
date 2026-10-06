"""Offline investigation adapter. Python 3.10+, standard library only.

python consume.py --data-root /path/to/assets/data > investigation.json
Never fetches URLs, evaluates indicators or installs a blocking policy.
"""
import argparse
import csv
import hashlib
import io
import json
import re
from pathlib import Path


INPUTS = (
    ("adform-clipper-2026/iocs.csv", "451b33703f8240ba626aefc7138bb5349383058455ac2eef595da05119e9c538", "adform-iocs"),
    ("hostinger-pages-phishing-2026/indicators.csv", "25fe396a596a031b6cf3ee4a48a60d7d3b5bef45bfc7143dd1a8cf999e5d76af", "hostinger-indicators"),
    ("hostinger-pages-phishing-2026/hostinger-domain-inventory.csv", "68e49172d4627b92692574d606f1480fadc8062c7fd75b2fa74686fc9c6fd5c4", "hostinger-inventory"),
)


def normalize(row, kind, number, source):
    value = row.get("indicator", row.get("value"))
    if not value or not row.get("type") or not row.get("confidence"):
        raise ValueError(f"Incomplete source row {kind}:{number}")
    role = row.get("role", row.get("observed_roles"))
    if not role:
        raise ValueError(f"Missing source role {kind}:{number}")
    status = row.get("assessment", row.get("status"))
    blocking = row.get("safe_for_blocking")
    if blocking not in (None, "true", "false"):
        raise ValueError("Unknown source blocking flag")
    # A context host, exact malicious hash and historical receiver must not
    # collapse into one generic actionable indicator class.
    if status == "invalid":
        evidence_class = "invalid-observed-string"
    elif status in ("context-only", "benign-comparison") or kind == "hostinger-inventory":
        evidence_class = "context"
    elif "receiver" in role or "relay" in role or "destination" in role or "storage address" in role:
        evidence_class = "historical-receiver-or-transfer-context"
    elif row["type"] == "sha256" and (status == "malicious" or blocking == "true"):
        evidence_class = "exact-malicious-content-hash"
    else:
        evidence_class = "investigation-lead"
    return {
        "id": f"{kind}:{row.get('indicator_id', number)}",
        "type": row["type"], "value": value,
        "displayValue": re.sub(r"(?<!\[)\.(?!\])", "[.]", re.sub(r"^http", "hxxp", value))
            if row["type"] in ("domain", "ipv4", "network") else value,
        "role": role,
        "evidenceClass": evidence_class,
        "observationWindow": {"first": row.get("first_observed") or None, "last": row.get("last_observed") or None},
        "sourceStatus": status, "confidence": row["confidence"],
        "expiresAt": row.get("expires_at") or None,
        "sourceSafeForBlocking": None if blocking is None else blocking == "true",
        "automaticBlockingAuthorized": False,
        "source": source,
        "limits": [row.get("notes", ""), "Historical research, not a current verdict. Null dates mean unknown, not timeless validity."],
        "originalRecord": dict(row),
    }


def consume(root):
    records, sources = [], []
    root = Path(root).resolve()
    for relative, expected, kind in INPUTS:
        path = (root / relative).resolve()
        if not path.is_relative_to(root):
            raise ValueError("Input escapes data root")
        raw = path.read_bytes()
        canonical = raw.replace(b"\r\n", b"\n")
        digest = hashlib.sha256(canonical).hexdigest()
        if digest != expected:
            raise ValueError(f"Source content changed: {relative}")
        source = {"path": relative, "sha256": hashlib.sha256(raw).hexdigest(), "canonicalLfSha256": digest,
                  "publication": "https://hecavex.com/assets/data/" + relative,
                  "scope": "Pinned input file, not an assertion of whole-bundle version equivalence"}
        sources.append(source)
        rows = csv.DictReader(io.StringIO(canonical.decode("utf-8"), newline=""))
        for number, row in enumerate(rows, 1):
            if None in row or any(value is None for value in row.values()):
                raise ValueError(f"Malformed CSV row in {relative}")
            records.append(normalize(row, kind, number, source))
    return {"schemaVersion": "1.0.0", "purpose": "offline-investigation-context", "sources": sources, "records": records}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--data-root", required=True, type=Path)
    args = parser.parse_args()
    print(json.dumps(consume(args.data_root), ensure_ascii=False, indent=2))
