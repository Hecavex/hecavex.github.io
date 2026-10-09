# Bounded harmless constant replay

This mathematical reimplementation is based on Prometheus. **Based on Prometheus by Elias Oelschner, https://github.com/prometheus-lua/Prometheus**

The complete pinned custom license is included in `LICENSE-Prometheus.txt`. It is not the standard MIT license. The primary comparison is `src/prometheus/steps/EncryptStrings.lua` at commit `a4efc5f381c50ae2a111bdbb9272fa3203685be3` in the Prometheus repository.

`constant_replay.py` uses Python's standard library. It reads only the adjacent authored `fixture.json`, checks its fixed ciphertext digest, applies bounded integer arithmetic and checks the exact 174-byte placeholders-only JSON template. It makes no network request, starts no process and does not load a Lua program, DLL, archive or sample helper. It also checks that changed ciphertext, a changed seed and changed output fail the expected result.

Run `python -B constant_replay.py` from this directory. It checks the fixed ciphertext and output digests, displays the exact placeholder template and reports the three altered-data controls.

The fixture records original byte offsets and hashes as provenance metadata. This helper does not obtain or revalidate the original Lua, permutation excerpt or source spans. Its ciphertext is the 174-byte constant obtained by the earlier bounded literal/chunk permutation, not the complete source excerpt or payload. The original lexical call is opaque. This replay proves this arithmetic relation only. It does not resolve the callee, show runtime reachability, identify a contract or destination, or reproduce the entire program.

The broader review independently reproduced arithmetic outputs for 539 saved constant pairs, with 292 unique readable values. Five original source pairings were separately checked. That source-pair review is a different scope from recomputing all 539 saved transformations. This example exposes only one harmless pair and does not increase either denominator.

The four accompanying files are `constant_replay.py`, `fixture.json`, this README and the complete `LICENSE-Prometheus.txt`. They contain no full Lua, malware archive, recovered command fragments or unpublished repository identities.
