# Methodology: README re-pointing and AI capability packaging

Research date: **2026-10-09**. Supporting observations: [github-observations.json](github-observations.json) and [ioc-observations.json](ioc-observations.json). Figure sources and processing are recorded in [figures.json](figures.json).

This finite investigation re-checks public indicators, pinned README changes, installer source, downstream data and selected skill/MCP/plugin source. A later, separately recorded phase acquired two pinned archives for bounded static analysis. It does not claim a new malware family, a previously undisclosed campaign, an endpoint compromise or a GitHub-wide census.

## Collection boundary

**Earlier source phase:** collection used GitHub metadata, commit patches, recursive trees, release metadata and inert text files without requesting suspicious archive bytes. The original source-only JSON values describe that dated phase.

**Later authorized static phase:** two archives were acquired from pinned GitHub sources and opened as bounded data. Selected members were retained under inert names. The known K2 archive received the DLL/Lua review below. A second archive remains anonymous. A separate release-pointer attempt returned HTTP 404 and yielded no archive. The earlier no-download statement is not a description of the completed investigation.

No suspect package was installed, sample or recovered code executed, DLL loaded, Lua interpreter or sample virtual machine run, decoded C2 destination requested, or sample uploaded. Existing reputation pages were read without submitting a scan or Reanalyze action. No disclosure or other outreach was sent.

A tree entry establishes a path, Git blob identifier and provider-reported size at a source revision. It does not establish that a download currently succeeds or that current bytes match a historical archive hash. A Git blob SHA-1 and an archive SHA-256 are different identifiers and are labelled separately.

Commit timestamps are the times recorded in commit objects. Observation timestamps identify when this research retrieved evidence. Neither establishes a continuously monitored first-seen interval. The eight pinned commit/tree/text recaptures completed between **13:44:35.987 and 13:44:36.464 UTC on October 9**. Exact tree objects were additionally retrieved at **13:47:09 UTC**. The fixed repository sample was re-checked between **13:47:37.761 and 13:47:38.894 UTC**.

## Discovery searches

Seven first-page repository queries used the inclusive creation interval **2026-07-11 through 2026-10-09**:

| Query | Result rows |
| --- | ---: |
| `"mcp" created:2026-07-11..2026-10-09` | 30 |
| `"skill" created:2026-07-11..2026-10-09` | 20 |
| `"claude" "skill" created:2026-07-11..2026-10-09` | 30 |
| `"cursor" created:2026-07-11..2026-10-09` | 30 |
| `"mcp" "official" created:2026-07-11..2026-10-09 stars:<5` | 25 |
| `"skill" "security" created:2026-07-11..2026-10-09 stars:<5` | 25 |
| `"cursor-free-trial" created:2026-07-11..2026-10-09` | 12 |

These queries returned **172 result rows representing 162 unique repository identifiers**. The overlap was removed for that unique count. Ranked first pages are not exhaustive. Six repositories received source/tree triage. **162 is a search-result count, not an audit count**.

Two additional exploratory searches were not used to estimate scale. An unconstrained MCP/malicious repository query returned research and demo projects. A plain `software-v` code query produced unrelated substring matches. This connector's plain-keyword search did not reproduce GitHub's full regex/path-search interface, so the absence of a useful result was not treated as absence of the behavior.

## Reproducing the public list counts

The [Island artifact at revision 72b77c0](https://github.com/island-io/island-security-research-artifacts/blob/72b77c0e2cc53cae92acd27258cf229077e1bfca/agentbaiting/malicious-repositories-and-zip-hashes-2026-07.csv) contains **7,854 data rows**, **7,600 unique repository strings** and **7,115 distinct archive SHA-256 strings**. Read the CSV header, count nonempty data rows, and deduplicate each column separately. Rows describe repository/hash associations. They are not download or victim counts.

The [Orchid list at revision 5ffa27e](https://github.com/orchidfiles/git-malware-finder/blob/5ffa27e2bc9dce7758379519aa6a272438b01192/full-list.txt) contains **9,330 nonempty repository strings**, all unique in this revision. Count nonempty lines and deduplicate them. This result describes the retrieved revision rather than the older article's headline.

Two anonymous candidates were absent from these exact list revisions. That establishes absence from two comparison sets only. It does not establish maliciousness, campaign membership or prior nondisclosure. A complete Apiiro indicator set was not available publicly for comparison.

## Fixed known-indicator sample

The sample comprises six examples named in Island's article plus eight manually selected skill/MCP names among the first 35 name-matched CSV rows. It is purposive, not random or representative. Exact defanged repository strings, timestamps and outcomes appear in the JSON.

Of **14** sampled repository metadata requests, **7 were readable** and **7 returned API 404**. Readable refers to metadata access through the connection used. A 404 can reflect removal, privacy, rename, permissions or another unavailable state. It cannot by itself prove a takedown or the containment of a campaign. No GitHub moderation success rate is inferred.

## Two pinned observations

**K1** is an already reported MCP-themed indicator. Its October 6 commit changes README.md only, replacing **two Markdown destinations** that previously led to the repository page with a branch-based raw ZIP path. The pinned tree lists the archive at **467,443 bytes**. The exact commit, parent, tree object, archive path and Git blob SHA-1 are in the JSON. The earlier Island archive SHA-256 is retained as `reported_old_sha256`, with `current_bytes_hash_verified: false`.

**K2** is an already reported skill repository. Its October 9 commit changes README.md only, replacing **four Markdown destinations** and **one image source** with a branch-based ZIP path. The pinned tree lists a **487,650-byte** archive in the same directory as a branch-creation SKILL.md. That skill's 25 decoded lines describe branch validation and creation. A case-insensitive search found no `.zip`, `software_v`, `launcher` or `luajit` terms. This proves a documentation/inventory gap in the inspected material, not endpoint execution.

Earlier malware classification is attributed to Island. At the original source-phase observation time, neither K1 nor K2 had an independently verified archive hash. The later K2 acquisition provides a separate byte comparison, rather than rewriting the original observation. No later K1 archive analysis is claimed. No payload destination is provided as an active link.

## Installer source review

The upstream [vercel-labs/skills installer source at e878c450](https://github.com/vercel-labs/skills/blob/e878c4502674f84094dc27b5ad94ddaf64f22551/src/installer.ts) was read at a fixed revision:

- Lines 371–402 pass the selected skill directory into directory-copy paths.
- Lines 471–478 exclude `metadata.json` and the directories `.git`, `__pycache__` and `__pypackages__`.
- Lines 513–547 recurse through remaining entries and copy files.

The conditional inference is narrow: **if this directory-copy path installs a selected skill, a regular sibling ZIP is not among those exclusions and qualifies for copying**. This is static source analysis. [Existing upstream test source](https://github.com/vercel-labs/skills/blob/e878c4502674f84094dc27b5ad94ddaf64f22551/tests/installer-copy.test.ts) was read, not run. The observation does not establish an installer vulnerability, automatic execution, a zero-click exploit or compromise.

## Anonymous candidates and uncertainty

One candidate claims official MCP provenance while its inspected tree has no server implementation. Its documentation directs the reader toward a password-protected installer, antivirus disabling and administrator execution. A second README-only candidate advertises open-source, license, digest and clean-scan assurances without the corresponding source or independent receipts in its inspected tree.

These are evidence-backed observations about claims and installation guidance. **Binary behavior, attribution and novelty remain unconfirmed.** Identities, commit identifiers, asset hashes, exact filenames and identifying timestamps are withheld from the public account. No allegation that these two candidates contain malware is made.

Copied files, recovered strings, executed bytes and compromised sessions are different events. Source observations and later static findings are labelled separately. Neither establishes victim execution or compromise.


## Separate connected expansion

A second finite pass used four repository queries and 23 code/source queries. Public query receipts omit six searches containing withheld candidate identities or the withheld collector's source. Returned-result counts are local search entries, not global totals.

This pass selected **14 repository candidates**. **11** returned readable exact commit/tree pairs: **6** already named in Island's pinned inventory and **5** absent from both pinned lists. **3** selected resources returned API 404. One additional project received a source review for downstream dataset use. These denominators remain separate from the initial six source triages and the fixed 14-repository metadata sample.

Of the six listed cases, five pinned commits record October 8–9 changes, after Apiiro's October 6 snapshot. The sixth is a historical February example. The supporting JSON supplies their exact commit, parent and Git tree identifiers, archive path, Git blob SHA-1 and provider-reported size as defanged source facts. Changes affect the README only. Reported additions/deletions count changed lines, **not URL destinations**. One line can contain several URLs. A pinned commit found through search is not necessarily the current branch head.

The source receipt was saved at **2026-10-09 13:52:48.876 UTC**. Per-request fetch timestamps were not retained in that compact receipt. This save time must not be misrepresented as each source request's time.

The five absent-list candidates remain unconfirmed and anonymous. Their identity, exact source references, identifying timestamps and archive details are omitted. No fresh binary-family or campaign-membership verdict is made. Missing API resources are unavailable references, not proof of removal or maliciousness.

## Anonymous downstream corpus observation

One committed JSON input file in a public project contained **52 records representing 51 unique repository identities**. **18 distinct identities** exactly matched the pinned published inventories: **8 Island**, **10 Orchid**, none in both. All 18 complete saved README snippets contained ZIP-looking download links. **13** retained a complete ZIP URL in the first **300 characters** used by the source's embedding-document builder.

This is one input file, not the project's entire corpus and not a measured built index. Static source review found that an existing populated collection can bypass import. JSONL inputs precede JSON inputs. And first-URL deduplication can prefer another record. For eligible records in a fresh build, README prefixes are combined with name, description and language for embedding.

Retrieval returns metadata and distances. The final context formatter emits repository names, URLs and descriptions rather than the README document or its ZIP links. A conditional static call path uses that metadata context to construct a generation prompt. No index was run. No retrieved result, model response, archive URL in a final prompt, download, execution or compromise was observed.

The collector's identity and underlying source are withheld for editorial and disclosure review. **The public excerpt alone cannot independently reproduce this match count.** The pinned source and local calculation receipts were independently peer-checked privately. No malicious intent is attributed to the collector owner. This finding supports inspecting stored README snippets and recommendation inputs alongside live repositories.

## Passive IOC observations are separate evidence

Read-only Polygon transition/state observations are supplied in a separate IOC artifact. End-of-block state comparisons are not transaction-level execution traces. Fixed current-block provider agreement does not make all historical reads independently multi-provider. No decoded destination was requested. Catalogue dates, source commit dates, block timestamps and observation times retain their separate meanings.


## Separate supporting artifacts

The selections and observation times differ. Their counts must not be added into a campaign population.

| Artifact | Scope |
| --- | --- |
| [exact-ioc-github-observations.json](exact-ioc-github-observations.json) | Separate exact-indicator searches and additional pinned known-list source changes |
| [toxicskills-source-observations.json](toxicskills-source-observations.json) | Pinned source inspection of an already reported malicious-skill case outside the FakeGit baseline |
| [toxicskills-sibling-observations.json](toxicskills-sibling-observations.json) | Anonymous related-source metadata, with identity and behavior limits |
| [broader-ai-tooling-observations.json](broader-ai-tooling-observations.json) | Separate discovery and six focused skill/MCP/plugin source triages |
| [plugin-observations.json](plugin-observations.json) | Separate plugin-hook queries and three pinned source cases |
| [reputation-observations.json](reputation-observations.json) | Existing provider records, connector limits and separately dated browser observations |
| [vt-github-pivot-observations.json](vt-github-pivot-observations.json) | Anonymous provider-to-GitHub comparison, without treating platform relationships as behavior |
| [static-analysis.json](static-analysis.json) | Later acquisition/inventory, readable DLL and Lua findings, access limits and anonymous second-archive comparison |

The exact-indicator artifact retains its own query/result denominators. Code-file results, repository rows and unique repositories are different units. Its pinned commit/tree records do not establish an archive-byte comparison. Anonymous source identities and archive details remain withheld where maliciousness or linkage is unconfirmed.

## Broader skills, MCP and plugin source searches

A separate **ten-query** hunt returned **40 repository rows** and **160 code-file rows**. These represent 40 unique repository-search identities, 160 unique code files and **181 unique repositories across both result sets**. **Six purposive source triages covered 17 text files**. Only the two repository queries carried recent-creation bounds. The eight global code queries did not. Search-result totals are not audited populations.

The inspected signals resolved into scanner detection text, a disclosed local provider bridge, requested credential provisioning, a secret-named-file check, local encoded hook helpers and explicit webhook functionality. No credible hidden credential-exfiltration chain was established in those selected paths. This bounded negative result is not benign certification or evidence that the wider search pool is safe.

A separate plugin pass used **four GitHub code queries and two primary-source web lead searches**. GitHub first pages returned **33 distinct files across 28 repositories**. Three pinned cases and one Python helper referenced by a hook command produced ten retained source texts. The helper was read as source, not run. Apparent warning terms belonged to a permission-deny prompt, a credential-read blocker and a documented dependency installation step. No malicious publisher was established. Filename matches included unrelated hooks/workflows, so provider totals are not plugin counts. [Cursor's workspace-hook advisory](https://github.com/cursor/cursor/security/advisories/GHSA-pc9j-3qc2-95wv) supports scrutiny of this execution boundary, not attribution of the selected cases to an attack.

The separately reported outside-campaign skill case was inspected as inert text at a pinned commit. Encoded command text was decoded as data without running it or requesting its destination. Preservation in a repository or mirror does not attribute malicious intent to its maintainers. Anonymous sibling metadata remains separate from a binary verdict or campaign-membership claim.

## Later authorized archive and static-analysis phase

Two archive acquisitions succeeded. The collector restricted HTTPS redirects to GitHub hosts, bounded download/member/total sizes and member counts, verified pinned size/blob identity, and read ZIP members as data with CRC checks. Archive names were not used as execution targets. The known K2 archive was received at **14:18:40.101 UTC on October 9**. The second archive's identifying metadata stays private. A separate mutable release-pointer request returned HTTP 404 and obtained no archive bytes.

The acquired **K2** archive is **487,650 bytes**, SHA-256 `06cd34cacbcc7046b7e0bac0cdfb6d94e79049cb974218dca247b28e619c59ac`. Its Git blob SHA-1 matches the pinned tree and its archive SHA-256 matches Island's historical entry. This establishes artifact continuity for this acquisition, rather than current availability of every branch link or victim execution.

K2 contains four members. Its 29-byte launcher names the adjacent executable and passes the text-named Lua source as an argument. That is intended invocation in an artifact, not an observed process launch. The readable DLL's PE32+ AMD64 headers, 324 exports including 147 Lua-prefixed names, and runtime strings are consistent with a LuaJIT/Lua-compatible component. They do not establish upstream authenticity, benignness, reached APIs or a final payload family. An empty certificate directory is not a complete signature trust assessment. Archive/COFF dates remain untrusted metadata.

The 296,308-byte, one-line Lua source received two distinct data-analysis passes. A trusted parser decoded **2,294 quoted literals and 387 constant chunk permutations**. Later, bounded lexical constant propagation and pure-mathematical decryption recovered **539 candidate constant-pair outputs comprising 292 unique printable UTF-8 values**. Bindings were discarded at control-flow/function boundaries and opaque calls. No target helper, recovered command or virtual machine was executed.

Recovered content includes an 8,514-byte Windows declaration block, WinINet names, scheduled-task/PowerShell fragments and an `eth_call` JSON template whose `to`/`data` values are placeholders. The template's `latest` tag does not supply a concrete endpoint, contract or getter. A dotted browser version was rejected as an IP IOC. Comparison with [pinned EncryptStrings source](https://github.com/prometheus-lua/Prometheus/blob/a4efc5f381c50ae2a111bdbb9272fa3203685be3/src/prometheus/steps/EncryptStrings.lua) does not establish obfuscator attribution. Independent review reproduced all 539 recorded transformations and directly checked five original source pairings. Other callee identities and reachable behavior remain unresolved.

Windows protection blocked a later independent read of K2's executable. Its earlier acquisition hash is not presented as an independently remeasured or reverse-engineered executable. The restriction was respected without another copy/read route, exclusions or protection changes. The second anonymous archive matched its pinned Git blob and an existing platform file hash. Its text-named member received a separate bounded literal-data review. The first DLL read returned local OSError Invalid argument, so no PE parse succeeded and no executable read was then attempted. That error's cause was not established and is not labelled as a named antivirus detection. The artifact's identity, source, exact hashes, filenames, size and identifying timestamps remain private. Similar source structure does not establish a shared operator or family. Neither access limitation is an execution result.

The static artifact separates acquisition identity, readable-component results, constant content and unresolved behavior. No executable was reverse-engineered past a protection block, and no successful exfiltration, persistence, process injection or endpoint compromise was observed.

## Public bounded constant replay

The [constant-replay README](constant-replay/README.md), [standard-library Python helper](constant-replay/constant_replay.py), [fixed fixture](constant-replay/fixture.json) and [complete pinned custom license](constant-replay/LICENSE-Prometheus.txt) expose one selected arithmetic relation. The helper validates a fixed 174-byte ciphertext and the exact 174-byte UTF-8 JSON template, with LF line endings and one final LF. The template contains `%s` placeholders, not a contract, selector, RPC provider or destination. It has no recovered command fragments.

The fresh Python replay passed. Changed ciphertext, changed seed and changed-output controls fail the expected result. Independent review reconstructed the ciphertext from the original 34 chunks, checked the seed expression and reproduced the transform separately. The public helper rechecks ciphertext and output digests only. Original Lua/source-span hashes remain provenance metadata; readers cannot use this bundle to independently revalidate the full source or every extracted pairing. This is one existing pair, not a new result added to 539 transformations or five separately checked original source pairings. The opaque callee and runtime reachability remain unresolved. No Lua program, sample helper, DLL, archive, network request or subprocess is used by the helper.

This mathematical reimplementation is based on Prometheus. **Based on Prometheus by Elias Oelschner, https://github.com/prometheus-lua/Prometheus**. The complete license is retained, including its attribution and derivative-statement requirements. File hashes are recorded in [static-analysis.json](static-analysis.json).

## Existing reputation records

The reputation artifact preserves the eight-request connector pass separately from later browser observations. Four VirusTotal GETs returned application shells without verdict data. Four urlscan searches exposed a 30-day search limit. Zero records within that limit do not establish all-time absence or safety. One existing urlscan root-page record returned 404, which does not test another path, POST body or malware protocol.

A later Chrome view of one existing IP report showed **3 of 92 vendors** marking it malicious. Capture time and provider analysis time are labelled separately. This IP reputation ratio is neither infection evidence nor a probability. Provider relation counts and archive/file associations are platform observations, not campaign totals, common-actor proof or evidence that a file ran. No scan, Reanalyze, upload or C2 request was submitted to obtain them.

## Identity and disclosure boundary

Unsupported provenance/security claims and hazardous installation guidance are documented as observations. Unconfirmed candidates, related siblings, the downstream collector and the second acquired archive remain anonymous. Their source identities, refs, exact identifying hashes/names/timestamps and raw command content remain private. Absence from two lists is not proof of novelty. No campaign linkage, operator attribution or malicious intent is inferred from keywords, shared runtime components, provider associations or missing API resources. Any disclosure remains a private draft until separately authorized.
