# Historical packaging correction

Recorded 7 September 2026. This directory preserves the historical v1.1.0 mirror. Its data and manifest have not been silently replaced.

Use the [corrected canonical v1.1.1 package](https://github.com/Hecavex/research-artifacts/tree/main/releases/hostinger-pages-phishing-2026/v1.1.1) for current reproducible downloads. Read the [full errata](https://github.com/Hecavex/research-artifacts/blob/main/docs/ERRATA-2026-09-07.md).

The historical manifest hashed the CRLF working copy of `hostinger-domain-inventory.csv`, while Git published normalized LF bytes:

| Representation | Bytes | SHA-256 |
| --- | ---: | --- |
| Original CRLF working copy, recorded in the manifest | 114854 | `388ece72f4f1201a4e763da9d930190543ba0fd16c2f328721f04e28a6ec0ca1` |
| Published LF Git file | 114550 | `68e49172d4627b92692574d606f1480fadc8062c7fd75b2fa74686fc9c6fd5c4` |

Normalizing CRLF to LF makes the files identical. This is a packaging/checksum discrepancy, not different domain observations. The patch package corrects delivered-byte integrity without adding observations, changing attribution or implying a new collection.

This notice does not waive verification of any other file or future change. Historical manifests remain historical records, not a successful integrity check of this mirror.
