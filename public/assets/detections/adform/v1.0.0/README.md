# Adform defensive examples

Version 1.0.0, published 10 September 2026. These language-neutral files supply
the executable examples in both editions of the
[Adform investigation](https://hecavex.com/en/research/adform-supply-chain-crypto-clipper/).
They contain defensive logic, not the malicious payload. No command here visits
campaign infrastructure.

| File | Dialect and required telemetry | Validation boundary |
| --- | --- | --- |
| `hunt.kql` | Kusto, Defender XDR DeviceNetworkEvents with Timestamp, RemoteIP/Port/Url and process/account fields | Required let-statement separators regression tested, not a KQL parser check. Named-engine execution and connector semantics NOT VERIFIED. RemoteUrl is not guaranteed to contain an HTTP path. Use proxy telemetry for path-level coverage. |
| `hunt.spl` | Splunk SPL, locally mapped proxy/web fields including response_sha256 | Engine execution NOT VERIFIED. Configure the search timezone to UTC and map fields before use. The broad legitimate script-path branch is a review lead, not a malicious verdict. |
| `telemetry.rules` | Suricata HTTP rule, complete plaintext HTTP request visibility on port 7744 | Suricata 8.0.3 syntax and seven offline synthetic cases passed on 10 September 2026. No production efficacy evaluation. Does not detect browser address replacement or HTTPS-blocked telemetry. |
| `structure.yar` | YARA, offline text or cache files smaller than 500KB | Engine execution NOT VERIFIED. A structural hunting candidate, not an automatic block. |
| `xor_decode.py` | Python 3, inert byte arrays supplied by the analyst | A decoding function, not an execution harness for JavaScript. |

The historical response/incident windows are fixed in the investigation. Matching
the distribution path alone is not exposure proof. Missing network telemetry is
not proof of no payload, especially when mixed-content policy blocked HTTP.

The English KQL and Suricata examples previously lost required separators. Both
editions also lacked the continuation characters needed to import the displayed
multiline Suricata rule. Native-engine testing identified and corrected that
separate defect.
[The material correction](https://hecavex.com/en/corrections/#adform-executable-examples)
records this change. Article version 1.2 corrects the presentation, not the
underlying incident counts, attribution or financial-loss assessment.

Validation levels are separate: source/parity checks, named-engine execution,
and operational effectiveness. No production efficacy is claimed.

## Reproduce the native Suricata test

The tested environment was local Ubuntu under WSL, package `suricata=1:8.0.3-1`,
engine 8.0.3. The background capture service was masked before installation. This
test only reads a generated PCAP. It does not send packets, probe an address or
run the captured malicious payload. Use a disposable local environment with
Suricata 8.0.3, its packaged configuration and Python 3:

```sh
python3 validate_suricata.py --config /etc/suricata/suricata.yaml
```

The script enforces the engine version, imports only `telemetry.rules` with `-S`,
runs the native `-T` syntax check and reads the generated PCAP with `-r`. It
checks EVE alert SID `420260801` against the source-port fixture IDs below.
`HOME_NET` is set to `10.0.0.0/8` for these examples. Real deployment requires
the local protected-network definition, HTTP parsing, complete TCP request
visibility and EVE alert output. No cloud connector is involved.

| Fixture ID | Source port | Expected and observed alerts |
| --- | --- | --- |
| positive | 41001 | 1 |
| duplicate-segment | 41002 | 1, TCP retransmission is not a second request |
| delayed-request-60s | 41003 | 1 |
| missing-u-field | 41004 | 0 |
| legitimate-other-destination | 41005 | 0 |
| no-http-request | 41006 | 0 |
| benign-intent-identical-wire-shape | 41007 | 1, deliberate discrimination limit |

The final case is important: benign intent with identical destination and HTTP
bytes still matches. The rule identifies a wire pattern, not intent. Historical
address reassignment can therefore create false positives. Conversely, missing
fields, capture gaps, TLS and browser-blocked HTTP can prevent matches. A
60-second delayed request is not a general guarantee about sensor timeouts.
Review the original time window and local evidence before action. KQL, SPL and
YARA native execution remain unverified. These results do not validate the
separate Evilginx or T1187 KQL bundles.
