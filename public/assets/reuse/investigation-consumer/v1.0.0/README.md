# Offline investigation consumer 1.0.0

This additive Python adapter joins three pinned public CSV inputs into one JSON contract. It does not modify the original Adform or Hostinger packages. It is an executable example consumer, not an external analyst evaluation or a blocking feed.

Download [consume.py](consume.py), then use Python 3.10 or later with the standard library:

```sh
python consume.py --data-root /path/to/hecavex/assets/data > investigation.json
```

The data root must contain `adform-clipper-2026/iocs.csv`, `hostinger-pages-phishing-2026/indicators.csv` and `hostinger-pages-phishing-2026/hostinger-domain-inventory.csv`. Obtain those files deliberately from their public packages. The adapter makes no network requests and fails closed if pinned content changes. LF and CRLF serializations are accepted only when their canonical LF bytes match the expected hash. Both the actual byte hash and canonical hash are emitted, avoiding a false claim that different line endings have the same checksum.

Every record retains its original fields, source path and hashes, role, confidence, status, notes and observation window. Null dates and expiry mean the input does not specify them. The incident window is not assigned to every Adform row: some blockchain activity predates the incident. An Adform distribution host remains context, a historical receiver remains historical context, and an exact malicious content hash remains distinct. Source blocking advice is preserved separately, but `automaticBlockingAuthorized` is always false. Current ownership, validity and local telemetry still need review. Values are data, not navigation links: consumers must not auto-fetch or auto-link them.

Use `displayValue` for human-readable network values: domain dots and HTTP schemes are defanged. The original `value` and `originalRecord` remain available for lossless offline comparison, not automatic navigation.

The adapter has a reproducible first-party test consumer that checks all source rows, roles, hashes, line endings and fail-closed behavior. Independent consumer usefulness and production outcomes have not been evaluated. A downstream integration should retain the source and `originalRecord`, not flatten these records into a list of domains.
