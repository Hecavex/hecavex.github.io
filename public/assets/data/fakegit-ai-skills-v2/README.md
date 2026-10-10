# FakeGit follow-up evidence, 9 October 2026

This bundle extends the earlier `fakegit-ai-skills-v1` records. It covers a separate, previously reported OnionClaw package, static reconstruction of two GitHub-hosted task files, selected native strings, passive provider observations and additional Polygon reads. It does not establish a connection from the earlier skill archives to this payload.

## Contents

- `static-chain-observations.json`: archive/member hashes, pinned task files, actual source excerpts, resource coordinates, key provenance, decoded-file hashes and three independently checked RC4 strings.
- `spectrum-config-string-replay.py`: two fixed encrypted string examples, an RFC 6229 RC4 vector and six changed-input/output controls. No third-party Python dependencies.
- `resolver-observations.json`: four fixed-block contract/getter pairs checked through two providers, plus 21 explorer-seeded update transactions checked through one provider.
- `github-pivot-observations.json`: 20 distinct REST code queries, request/result counts, selection depth and search limitations. No newly confirmed malicious distributor.
- `passive-observations.json`: existing urlscan, certificate-log and allocation-record findings, including the returned 30-day search window and unreadable provider pages.

The fixed replay runs offline:

```sh
python -B spectrum-config-string-replay.py
```

It contains only small string fixtures and their key. It reads no sample, accepts no arbitrary file, downloads nothing, launches no subprocess and makes no network request. It reproduces two text transformations; it does not independently reacquire their source PE or replay the complete chain. Digests of decoded addresses are calculated before display defanging.

## Method and boundaries

GitHub bytes were acquired at the commits recorded in the JSON. Git blob identities and SHA-256 measurements were checked. Analysts used Python, `pefile` and `cryptography` to parse and transform data, and an isolated official Capstone wheel for static disassembly. The wheel's distribution metadata is version 5.0.9; its binding reports 5.0.7. No acquired program, Lua code, native sample or embedded command was executed, loaded or emulated.

The wrapper's AES key was reconstructed from actual instruction constants. The decrypted PE's extent was independently derived from its section ranges, and its complete hash matched the published inner payload. Thirty-two trailing bytes all have value `0x20`. An initial helper rejected the padding assumption before checking the valid PE prefix. That attempt wrote inert padded bytes; a later read failed for an unconfirmed reason and was not retried. Failed-attempt receipts remain private. No protection setting was changed.

The RC4 string key was first taken from published indicators, then verified as a literal at the recorded inner-file offset. A separate reviewer reproduced three exact strings, the AES key and the inner PE extent. This does not validate every printable scan candidate, runtime protocol behavior or a malware-family version.

Spectrum's captured task replies have a key mismatch with the unchanged client. Its later reconstruction used separate synthetic exchanges. HECAVEX made no C2 request, fake registration, file upload or scan submission. The offline byte matches do not demonstrate an uninterrupted victim infection. A collector string and a Polygon-resolved loader address are separate relationships.

The transaction sample uses hashes retained from an earlier explorer view. It is not certified complete. Historical comparisons are at consecutive block ends, not immediately before and after each transaction; an unsampled write could be missed. A getter returning an address does not prove that a server was active or used by a victim. Loopback is excluded from public C2 counts.

GitHub hash queries search for literal hash text; they do not calculate file hashes. Returned repositories, selected files and confirmed malicious distributors are separate counts. Old account dates, shared hosting, similar names and absence from comparison lists do not establish compromise, attribution or novelty.

## Sources

- [DERP: FakeGit and the LuaJIT GitHub campaign](https://www.derp.ca/research/fakegit-luajit-github-campaign/)
- [Spectrum: fake OnionClaw infostealer](https://www.spectrum.security/blog/fake-onionclaw-infostealer)
- [Spectrum's published indicator record](https://www.spectrum.security/posts/fake-onionclaw-infostealer/indicators.json)
- [GitHub: REST-era code-search scope](https://docs.github.com/en/search-github/searching-on-github/searching-code)
- [GitHub: web Code Search limits](https://docs.github.com/en/search-github/github-code-search/about-github-code-search#limitations)
- [RFC 6229: RC4 test vectors](https://www.rfc-editor.org/rfc/rfc6229)

Full malware files, private directory paths and unconfirmed candidate identities are excluded. The earlier v1 evidence remains unchanged.
