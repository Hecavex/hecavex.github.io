---
title: "FakeGit, AI skills and the download that keeps moving"
card_title: "FakeGit and the AI skill supply chain"
description: "GitHub and passive IOC research into fake AI tooling, with original archive bytes and static hex/XOR, AES and RC4 recovery."
seo_description: "Pinned GitHub evidence, a separate OnionClaw payload replay, RC4 collector strings and 21 Polygon address updates, without executing malware."
date: 2026-10-09
last_modified_at: 2026-10-09
lang: en
translation_key: fakegit-ai-skills-mutable-downloads
permalink: /en/research/fakegit-ai-skills-mutable-downloads/
author: deividas-lis
content_type: investigation
publication_class: primary-research
categories: [malware, ai-security, osint]
tags: [github, supply-chain, ai-security, threat-hunting]
confidence: moderate
tlp: clear
featured: false
image:
  path: /assets/img/posts/fakegit-ai-skills/editorial-cover-hero-v3.webp
  thumbnail: /assets/img/posts/fakegit-ai-skills/editorial-cover-card-v3.webp
  presentation: illustration
  source_type: generated
  provenance_id: fakegit-ai-skills-mutable-downloads-cover-generated-v3
  alt: "AI-generated flat illustration of a repository document, a red redirect to a ZIP archive and a static inspection frame."
  width: 1600
  height: 900
  thumbnail_width: 720
  thumbnail_height: 405
draft: false
published: true
toc: true
comments: false
prose_width: wide
research_version: "1.1"
evidence_basis: "Pinned GitHub source. Three hash-matched archives across separate cases. Bounded Lua, PE and hex/XOR/AES/RC4 inspection. Public IOC lists. Installer/MCP source. Passive provider records and public-chain responses. No acquired code or embedded command was executed."
methods: ["Bounded public GitHub and IOC-driven OSINT", "Commit and directory-tree comparison", "Static archive, PE, Lua and hex/XOR/AES/RC4 inspection", "Static installer and MCP source review", "Public-list deduplication", "Passive reputation and blockchain checks"]
key_findings:
  - "An Island-listed skill repository has a README-only commit dated October 9 that redirected four Markdown destinations to an archive beside SKILL.md and also changed an image source to that archive."
  - "At the inspected upstream installer revision, its directory-copy path does not explicitly exclude a regular sibling ZIP. This supports a conditional copying inference, not automatic execution."
  - "The fixed, purposive sample of 14 previously published indicators returned seven readable GitHub repository resources and seven API 404 responses. It is not a takedown-rate estimate."
  - "Seven further Island-listed repositories had README-only archive-link changes recorded on October 8 or 9 across two separate follow-up samples."
  - "One committed input dataset contained 18 repository identities on published malware lists. Its saved README snippets contained ZIP links, but no actual indexing or recommendation was observed."
  - "In the initial static phase, I saved two archives and checked each against its reference hash. Static decoding recovered 292 different readable values from the known sample without running it."
  - "A separate four-query filename/hash pass returned two README files. One identity was already listed, and the other remains private."
  - "A separate reported OnionClaw case yielded two hash-matched task files. Static hex/XOR, AES and RC4 checks recovered the reported inner PE and three selected strings, including its collector address."
  - "Twenty-one explorer-seeded Polygon updates were checked. Two providers agreed on four contract/getter pairs at a fixed October 9 block. No complete-history claim."
scope: "Public GitHub and IOC research on October 9, 2026. Two pinned comparison lists. Installer/MCP source. Three retained archives across separate cases. Two pinned OnionClaw task files. Selected static byte transformations. 21 explorer-seeded Polygon updates and four two-provider getter checks."
limitations: "Bounded research, not a GitHub census or victim infection study. The earlier skill archives are not linked to the separate OnionClaw payload. No sample execution or C2 contact. Two earlier file reads failed. A later padded-byte read also failed for an unconfirmed reason and was not retried. Reported task-response keys conflict with the unchanged client. Historical chain reads use one provider and are not certified complete. API 404, shared infrastructure and absence from lists do not establish deletion, attribution or novelty."
---

I started with the download button. It is a small part of a repository, which is convenient if that is the part you want a reviewer to overlook.

A copied project can retain useful source code, an ordinary skill definition and months of visible history while its README sends a reader somewhere else. An AI agent looking for a tool encounters the same problem, with an extra question: what else does the installer copy when it installs the skill?

Apiiro's [October 6 investigation](https://apiiro.com/blog/never-deleted-only-re-pointed) reports 17,610 live lure repositories at its 07:41 UTC snapshot and calls download-target replacement "RePointing". Its 97% README-only figure concerns 441 recoverable sampled edits. Those are Apiiro's measurements. I did not reproduce that fleet count or obtain its complete inventory.

For this follow-up, I checked published indicators against current GitHub source, inspected installer and MCP code, and followed reported IOCs through public records. I looked for lure text in downstream datasets, then retained two selected archives for static review. A later expansion acquired a separate reported OnionClaw archive and two task files for the byte-level walkthrough below. The findings below distinguish recovered bytes and source content from observed behavior.

The source observations, installer analysis and bounded constant recovery are my follow-up work. The Polygon history reproduces reported infrastructure evidence. Readers who need the response decisions first can jump to [the security-team triage table](#from-source-review-to-incident-triage).

## What I checked

The repository searches covered creation dates from July 11 through October 9, 2026. Seven ranked first pages returned 172 rows representing 162 unique repository identifiers. Six received source and tree triage. The 162 results are a discovery pool, not 162 completed audits.

I separately fixed a purposive sample of 14 repositories from Island's published examples and skill/MCP-related entries. Seven repository resources were readable through the GitHub API and seven returned 404. This sample deliberately favors relevant examples. It says nothing reliable about the survival rate of the whole campaign.

The comparison lists were pinned before counting:

| Input | Revision | What I counted |
| --- | --- | --- |
| Island's July repository/hash CSV | `72b77c0e2cc53cae92acd27258cf229077e1bfca` | 7,854 data rows, 7,600 unique repository strings, 7,115 distinct ZIP SHA-256 strings |
| Orchid's repository list | `5ffa27e2bc9dce7758379519aa6a272438b01192` | 9,330 unique repository strings |

The CSV rows are repository/hash associations. They are not downloads, people or infections, and the two researchers' lists overlap. Adding their headline counts would produce a large number with very little analytical value. The original [Island dataset](https://github.com/island-io/island-security-research-artifacts/blob/72b77c0e2cc53cae92acd27258cf229077e1bfca/agentbaiting/malicious-repositories-and-zip-hashes-2026-07.csv) and [Orchid list](https://github.com/orchidfiles/git-malware-finder/blob/5ffa27e2bc9dce7758379519aa6a272438b01192/full-list.txt) are the reproducible inputs.

The initial source phase used metadata and inert text. The first static phase retained two pinned ZIPs from GitHub, checked their hashes and inspected readable members as data. No sample, installer or embedded command was executed. Requests went to public source and intelligence services, not to the reported C2 addresses.

A separate expansion selected 14 related repository candidates. Eleven yielded readable commit/tree pairs, including six already in Island's list and five absent from both pinned lists. Three returned API 404. One additional project received a source review for downstream dataset use. These are separate samples with different selection rules. They should not be added into a campaign-size estimate.

## A skill README change dated October 9

One repository already named in Island's July data, `amanahmed2222 / skills`, was still available for source inspection. Its commit `84a4fdc3840133c30e283ee34adb730b49d3dff4` records October 9 at 13:37:13 UTC. The pinned text was recaptured at approximately 13:44:36 UTC. These are different timestamps with different meanings.

Only `README.md` changed. Four Markdown destinations moved from the repository page to a ZIP under the moving `main` branch. The README also changed one image source to the same ZIP. Calling this "five download links" would hide the difference between a hyperlink and an image request.

![README diff excerpts showing four links and one image source redirected to a ZIP.](/assets/img/posts/fakegit-ai-skills/chrome-readme-repoint-v2.webp)

*Four links and one image source now point to the same ZIP.*

The inspected tree puts these files together:

```text
skills/create-branch/
    SKILL.md
    Software_v2.0-alpha.3.zip
```

The archive entry is 487,650 bytes. The skill Markdown describes ordinary branch creation and issue linking. A case-insensitive source check found no `.zip`, `software_v`, `launcher` or `luajit` in that file. Reviewing those 25 lines alone therefore misses a file visible one level away in the directory tree.

Island previously classified the repository in its malicious-repository dataset. The initial source check established an exact README patch and an adjacent archive entry. During the later static phase, I retrieved that pinned archive. Its SHA-256 exactly matches Island's older entry. The static analysis below describes what those bytes establish.

Another Island-listed repository, `waynestimulative605 / docker-mcp-gateway`, has a README-only commit recorded at October 6, 06:14:03 UTC. Commit `6d3da0d79e7a3c6a2b8921bf6c7ba43b594e6b20` redirects two Markdown destinations into an archive under `main/docs/`. The tree lists 467,443 bytes at that path. Again, metadata establishes a file entry, not a successful current download or the contents of its bytes.

![Pinned revision and directory entries showing SKILL.md beside the ZIP archive.](/assets/img/posts/fakegit-ai-skills/chrome-skill-directory-v2.webp)

*SKILL.md and the ZIP archive in the same create-branch directory.*

The expansion found five more Island-listed repositories with README-only archive-link changes recorded after Apiiro's October 6 snapshot. A separate IOC-to-report-to-source follow-up added two more. They appear together below, with their separate selection rules retained in the supporting records:

| Previously listed repository | Recorded commit time, UTC | Commit |
| --- | --- | --- |
| `Sahilrajveer / reasonbench` | October 8, 06:02:16 | `f4dbdcd8fe37732369793cd5a27ae00d8ca7dd80` |
| `Alejandro920 / Zhouyi` | October 8, 06:13:03 | `31515265dd1bcf61ff9264d6582f3bf9f80ceabf` |
| `kaindrakonis / vibedev` | October 8, 06:13:20 | `6875a1eeac41adaaffa5338b8d70e4996bf121c3` |
| `lozforlife120 / hyprzoom` | October 9, 07:05:41 | `f5a79c7db98d8bc8a8edb7aff571f2edb50da74d` |
| `Adie0609 / suvadu` | October 9, 07:14:09 | `70de2dc5008f76d23f31cd7dc6b2712d448d9a8a` |
| `guiziinn1 / modulout-llc` | October 9, 07:01:21 | `5527079a8b63bb9aac7735fde88b19a1ba491661` |
| `Kalainilavann / takeout_downloader_script` | October 9, 13:25:05 | `a28cb23c7dafe882ba3182311f987084a69494a2` |

The patches redirected README destinations to ZIP paths. The corresponding trees retained archive entries. These are fresh observations of already reported identities, not seven newly discovered malware operations. A recorded commit timestamp also does not establish who performed the edit. Exact source references and tree metadata are in the supporting observations.

These observations fit the documented delivery pattern without requiring me to launch the advertised "tool" on a working laptop. The laptop already has enough jobs.

## From the archive entry to its bytes

At 14:18:40 UTC on October 9, I retrieved the ZIP from the pinned `amanahmed2222 / skills` commit. The 487,650 bytes matched both the tree's Git blob `f8ef6f6e39990c57cbc35ca540c8c0895bfa97c4` and Island's historical archive SHA-256, `06cd34cacbcc7046b7e0bac0cdfb6d94e79049cb974218dca247b28e619c59ac`. The first match fixes the GitHub object. The second connects the retained archive to the published older record.

The ZIP contained four members. Their acquisition hashes are below. The launcher, Lua and readable DLL were independently inspected. Windows later blocked an independent read of the executable, so its row retains the acquisition measurement only.

| Member | Bytes | Acquisition SHA-256 |
| --- | ---: | --- |
| `App.bat` | 29 | `a96ffc9f649333f9e84b7a7e1101cf85f7a5f143253db1d7853e6e48d46b3c72` |
| `icon16.txt` | 296,308 | `33250ded61c43128b6c29b01de7b1cc962b241b236933f54bc42b648afae2398` |
| `lua51.dll` | 390,144 | `c740061da4971cdf36a102637f80fc23dbff5769c1ec2156fcd90764237d51e2` |
| `resolver.exe` | 288,768 | `8fa25c75ee56eb3c4a2b0a6fe056c1e9f933e00596c6e3167e4727f01828168d` |

The launcher names the adjacent executable and passes `icon16.txt` as its argument. The text file contains one long line of Lua, with escaped strings, arithmetic hiding constants and a flattened numeric-state dispatch loop. That describes the retained files and their intended invocation. I did not launch them.

I opened unchanged copies of the complete Lua file and launcher. Their hashes, and the readable DLL's, still matched the acquisition record. The second image renders the DLL's bytes as hexadecimal text.

![Original obfuscated Lua opening above the unchanged App.bat launcher line.](/assets/img/posts/fakegit-ai-skills/vscode-original-files-v2.webp)

*The original Lua opening and its launcher.*

![DLL size and SHA-256 above a hexadecimal excerpt containing the MZ and PE signatures.](/assets/img/posts/fakegit-ai-skills/vscode-original-dll-bytes-v2.webp)

*The DLL hash and its MZ/PE header bytes.*

### Recorded analyst commands

The analysis used existing Python 3.12.8 and `pefile` 2024.8.26. These are recorded commands, with the private directory prefix replaced by `[analysis-directory]`. The Lua lines show the recorded argument vector as text:

```text
& 'C:\Python312\python.exe' '[analysis-directory]\static-acquire.py'
& 'C:\Python312\python.exe' '[analysis-directory]\static-pe-inspect.py'
C:\Python312\python.exe [analysis-directory]\static-analysis-private\static-lua-data.py
C:\Python312\python.exe [analysis-directory]\static-analysis-private\static-lua-straight-line.py
```

The collector read GitHub responses and ZIP members as data. The PE helper parsed bytes without loading the DLL. The Lua helpers tokenized text and transformed constant data. Process receipts retain timestamps, stdout, exit codes and tool hashes. The final constant-pair pass ran from 14:32:06 to 14:32:10 UTC with exit code 0 and empty stderr. Input hashes were unchanged. The PE helper's SHA-256 is `7be56d140bfc3e0c53c2af9c5ba40e7724e7f21734b4fc53c10e3075cf1882ec`, and the final straight-line helper's is `0c9f0dc8115c67d6b231d27f9b17e7d0f06aa26f20557a91b622d3b146200fd1`.

The readable DLL is an AMD64 PE32+ DLL with 129 parsed imports across 12 library names and 324 exports. Its exports and embedded strings are consistent with a LuaJIT 2.1.0-beta3 / Lua 5.1-compatible runtime. A separate byte-level PE review agreed. No trusted upstream binary comparison or cryptographic signature validation was performed, so this does not establish an authentic, unmodified runtime.

Windows rejected the executable's later independent hash-file read with a virus-or-potentially-unwanted-software message. The review stopped at that boundary. The error supplies neither a named detection signature nor a malware-family verdict. No alternate reader or protection-setting change was used.

### How I decoded the constants

The Lua file hides letters as numbers and splits words into chunks. I first used my own Python code to read those numbers and put the chunks back together. I did not run the Lua program.

Here is one example from the original file:

```text
AT({1;2,{"\099\117\114\114\101","\110\116\068\108\108\080\097\116\104"}})
```

`\099` means the letter `c`. Reading the two encoded chunks gives `curre` and `ntDllPath`. The list `[1, 2]` gives their joining order. The result is `currentDllPath`.

```python
indices = [1, 2]
chunks = [b"curre", b"ntDllPath"]
decoded = b"".join(chunks[i - 1] for i in indices)
# b"currentDllPath"
```

This Python example only joins the text chunks already read. It does not call the sample's Lua functions.

![Original escaped source excerpts beside the Python decimal-byte and chunk parsers.](/assets/img/posts/fakegit-ai-skills/vscode-source-parser-v2.webp)

*The escaped strings beside the Python parser.*

<details>

<summary>Python excerpt and original source location</summary>

The original excerpt is 73 bytes at `[267943, 268016)` in `icon16.txt`. Offsets start at zero and exclude the end. The first pass decoded 2,294 strings and 387 chunk-permutation sites.

This part of my `quoted_bytes` function in `safe_decode.py` reads a letter written as a number. The backslash and first digit have already been read into `char`. Only this branch is shown, without the surrounding parser checks. It accepts ASCII digits and rejects values above the byte limit of 255.

```python
digits = char
for _ in range(2):
    if pos < len(source) and '0' <= source[pos] <= '9':
        digits += source[pos]
        pos += 1
value = int(digits)
require(value <= 255, 'decimal byte escape exceeds 255')
out.append(value)
```

Lua numbers these chunks from one. Python starts at zero. That is why the joining example above subtracts one from each index. Commas and semicolons separate entries in the original Lua table.

</details>

Other strings needed more than joining letters. My Python decoder took the encoded text and a starting number found in the code, then used them to recover readable text. I recovered 292 distinct values. One was this JSON request template:

![The Python decoder beside the recovered JSON with placeholders.](/assets/img/posts/fakegit-ai-skills/vscode-transform-output-v2.webp)

*The decoder and recovered JSON.*

```json
{
    "jsonrpc": "2.0",
    "method": "eth_call",
    "params": [
        {
            "to": "%s",
            "data": "%s"
        },
        "latest"
    ],
    "id": 1
}
```

The `to` and `data` fields still contain `%s`: placeholders for values that would have to be filled in. This template gives me no actual contract, getter value, RPC provider or complete destination. It also does not independently connect these bytes to the Polygon contract discussed later.

You can check this one text-recovery step without downloading the malware sample. Save the [Python helper](/assets/data/fakegit-ai-skills-v1/constant-replay/constant_replay.py), [fixed fixture](/assets/data/fakegit-ai-skills-v1/constant-replay/fixture.json), [README](/assets/data/fakegit-ai-skills-v1/constant-replay/README.md) and [complete pinned license](/assets/data/fakegit-ai-skills-v1/constant-replay/LICENSE-Prometheus.txt) in one directory, then run:

```sh
python -B constant_replay.py
```

This example recovers one saved template and checks that the resulting bytes match. It does not run the Lua program or verify all 539 pairings against the original source.

<details>

<summary>Sources and result checks</summary>

The saved encrypted-text and starting-number pairs produced 539 outputs, with 292 distinct values. The first four manually checked pairs are included in that total. A separate reviewer reproduced all 539 outputs from the saved pairs without using my decoder and checked five selected pairings against the original source. That is not 539 independently source-verified locations. These checks do not identify every hidden function or establish whether the program would reach it at runtime.

I compared the text-recovery method with the [pinned Prometheus EncryptStrings implementation](https://github.com/prometheus-lua/Prometheus/blob/a4efc5f381c50ae2a111bdbb9272fa3203685be3/src/prometheus/steps/EncryptStrings.lua#L121). The comparison identified a compatible transform. It does not establish the sample's obfuscator version or operator. Attribution: "Based on Prometheus by Elias Oelschner, https://github.com/prometheus-lua/Prometheus". The [pinned Prometheus license](https://github.com/prometheus-lua/Prometheus/blob/a4efc5f381c50ae2a111bdbb9272fa3203685be3/LICENSE) applies.

The JSON shown here is exactly 174 bytes: UTF-8 text, LF line endings and one final LF. My Python check exited with code 0 and reproduced these hashes:

| Constant data | SHA-256 |
| --- | --- |
| Reconstructed ciphertext | `2807ea9e86ae814427e1c7ceb9c22aec73e63b70d8a94b0a9f30c9dd8f5d079b` |
| Recovered JSON bytes | `487190fca26fbf3acf04520ce3ab7e7447a4d11453003591edd2de51c0f4bf4c` |

The public Python example uses only the standard library. It checks the hashes of one input and its output. The replay passed, including controls with altered input, starting number and output. This is the same one template within the 539-output total. The helper does not obtain the original Lua file, recheck its source or excerpt hashes, or demonstrate execution. The accompanying README and [static-analysis observations](/assets/data/fakegit-ai-skills-v1/static-analysis.json) retain the exact input and limits.

</details>

Other recovered content includes WinINet API names, an 8,514-byte block of Windows PE/PEB/LDR declarations, screenshot-related names such as `BitBlt`, and scheduled-task/PowerShell command fragments. These are static contents. They do not establish an executed request, screenshot, injection or persistence operation. Full command fragments remain private.

### A second retained archive, with its identity withheld

A later filename pivot, described below, produced a second candidate archive. Its retained bytes matched the passive provider's selected SHA-256 and the pinned Git blob. A neighboring skill described an ordinary audit workflow and did not mention the archive among the explicit indicators checked. The candidate's name, hash and source references remain private.

Its Lua source shared the two literal-permutation structures and numeric-state scaffolding. The bounded parser decoded 3,830 quoted literals and 413 constant permutations. The number-sequence and previous-byte constants differed from the known sample's. No cipher plaintext or executed behavior was reconstructed for this candidate.

The first independent DLL byte read failed with `OSError: [Errno 22] Invalid argument`. PE comparison stopped before parsing that DLL or attempting the executable. The cause was not established, so this is not a confirmed antivirus detection. Shared scaffolding and a provider hash match do not establish a common operator, final payload or victim compromise.

The [static-analysis observations](/assets/data/fakegit-ai-skills-v1/static-analysis.json) retain the public hashes, process records, constant counts and access limits. The archives themselves remain private.

## The installer copies a directory

To check the exposure argument, I read the upstream `vercel-labs/skills` implementation at revision `e878c4502674f84094dc27b5ad94ddaf64f22551`.

Its [installation paths](https://github.com/vercel-labs/skills/blob/e878c4502674f84094dc27b5ad94ddaf64f22551/src/installer.ts#L371) pass `skill.path` to a directory-copy function. The [explicit exclusions](https://github.com/vercel-labs/skills/blob/e878c4502674f84094dc27b5ad94ddaf64f22551/src/installer.ts#L471) name `metadata.json`, `.git`, `__pycache__` and `__pypackages__`. The [copy loop](https://github.com/vercel-labs/skills/blob/e878c4502674f84094dc27b5ad94ddaf64f22551/src/installer.ts#L513) recurses into the remaining entries and copies files.

If that path installs the selected skill directory, a regular sibling ZIP is not among those exclusions. It qualifies for copying. This is a static inference from the inspected implementation, not a test of an infected endpoint or a claim about every skill installer.

Each step needs its own evidence:

| Event | Evidence required |
| --- | --- |
| A directory advertises a project | A dated listing or captured directory record |
| A repository contains an archive | A pinned tree or recovered bytes |
| An installer copies that archive | Applicable copy logic or an observed filesystem change |
| Someone extracts or launches it | Endpoint or execution evidence |
| A later stage compromises an account | Evidence of that stage and its account impact |

The current review establishes repository/archive presence and supports a conditional copying inference. It does not supply endpoint evidence for extraction or compromise. A skill can be dangerous because of instructions in its Markdown, executable dependencies, adjacent files or a changing remote service. These paths need different checks.

## A lure can survive in somebody else's dataset

Live repositories are only one place to look. In one public project, a committed JSON input dataset under a directory labelled "validated" contained 52 records representing 51 unique repository identities. Eighteen identities matched the pinned published inventories: eight in Island's list and ten in Orchid's. All eighteen saved README snippets contained ZIP links.

At the inspected revision, a fresh index build could combine an eligible README's first 300 characters with its name, description and language for embedding. Thirteen of the eighteen matching records contained a complete ZIP URL in that prefix.

I did not run the index or observe a recommendation. Other input files are processed, an existing index can bypass import, and an earlier duplicate URL can win. The final context formatter emits repository URLs and descriptions rather than README text or its ZIP links. The evidence establishes preservation in one input dataset and a conditional embedding path. It does not establish that these snippets were indexed, served to a model or executed.

The collector is not being labelled a malicious project. Its identity and underlying source are withheld pending editorial and disclosure review. Readers cannot independently reproduce this particular match count from the public excerpt alone. The finding warrants checking stored README snippets and recommendation inputs alongside live source. A directory named "validated" does not explain what was validated.

## More leads, with identities withheld

The date-bounded search also found two candidates absent from the two pinned comparison lists. Neither receives a public malware verdict here.

Candidate A claimed an official MCP integration. Its inspected tree contained a license, a README, an ignore file and a source stub consisting of a comment. The install instructions instead directed the reader to a password-protected archive, told them to disable protection and asked for administrator execution. GitHub maintains its [official MCP server](https://github.com/github/github-mcp-server) separately. A README's use of the word "official" does not establish that relationship.

Candidate B advertised open source, a license, a verified SHA-256 and a clean scan. At the inspected revision, the repository tree contained only its README. It supplied neither the claimed source and license nor a published digest or independent scan receipt. A badge whose label says "verified" proves that somebody chose that label.

These are useful triage findings. The binaries' behavior remains unknown. Publishing their names as confirmed malware would turn a reasonable lead into an unsupported accusation, so the identifying material stays in the private case record.

A control check also found an ordinary security skill without the campaign-style archive or downloader in the inspected material. Searching for "security", "MCP" or "Cursor" can return a project doing exactly what its name says. The query is a way to find things to inspect.

## The prerequisite can carry the instruction

The archive beside a skill is one exposure path. [Snyk's February 5, 2026 ToxicSkills report](https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/) describes another: the setup instruction itself. It names four skill paths in one GitHub repository. On October 9, I independently re-read three nested `SKILL.md` equivalents at commit `b857b9cb9154c9be6f63295cca91d331be28c250`: `clawhub`, `whatsapp-mgv` and `coding-agent-1gx`.

All three frame an external utility as required for ordinary functionality. Their Windows prerequisites request a password-protected release ZIP and execution of its utility. Their macOS prerequisites carry the same Base64 string. Decoding it as inert text exposes HTTP retrieval passed to a shell. The visible installer label names an HTTPS domain, while the decoded retrieval uses a different literal-IP HTTP destination. No executable command or active payload link is reproduced here. The [pinned source observations](/assets/data/fakegit-ai-skills-v1/toxicskills-source-observations.json) record the paths, blobs and line references.

![Skill prerequisite lines with the download destination and embedded command redacted.](/assets/img/posts/fakegit-ai-skills/chrome-toxic-skill-prerequisite-v2.webp)

*The skill prerequisite, with its download destination and command redacted.*

A later attempt to retrieve the reported Windows archive returned HTTP 404 and yielded no bytes. That failed request did not test the encoded macOS destination.

This is a current-source recheck of a previously reported lead. The commit's recorded date is February 26, not October 9, and I have not dated the prerequisite's introduction. Snyk's root-level paths are absent at the inspected head, while nested equivalents are present. That does not prove a move or rename. The fourth file was not read. The source text supports a concealed execution prerequisite, not an observed compromise, a verdict on the current maintainer's intent or a link to FakeGit.

## The same prerequisite in downstream skills

I then searched for the decoded IP, its distinctive path, the release filename and the prerequisite wording. Six native first-page queries returned 120 rows, representing 105 source files across 38 repositories. Four selected repositories received pinned source review. One was an explicit demonstration and was excluded.

The other three preserved dangerous prerequisites in a bot's skill directory, an application's agent-skills directory and an MCP skill library. The bot skill contained the identical encoded HTTP-fetch-and-shell instruction. The other two directed readers to a password ZIP and an external paste command. I did not visit those paste destinations, and the archive pointers do not prove byte equality.

The MCP library provided a source-level propagation path. In its filesystem mode, indexing accepts a skill with valid frontmatter. If that skill is selected, the loader reads its complete local Markdown and returns it as MCP tool content. The inspected path does not remove the prerequisite. The application can prefer a prebuilt bundle, whose contents were not inspected. I did not invoke the server, observe a client loading the file or show a model obeying it.

Earlier in the general hunt, I had read a defensive scanner skill in this same library. Its alarming vocabulary was detection guidance. A different file contained the dangerous prerequisite. Both observations survive scrutiny, and neither clears or condemns the whole library. The three candidate identities remain private while provenance and disclosure are reviewed. Their source text does not establish malicious maintainer intent or a relationship to FakeGit.

The separate general hunt reviewed six selected repositories after ten queries. A plugin-focused pass reviewed three cases after four code queries. The inspected paths included credential-read blockers, local helpers and disclosed callbacks. They did not establish a malicious publisher. The [source-hunt records](/assets/data/fakegit-ai-skills-v1/broader-ai-tooling-observations.json), [plugin observations](/assets/data/fakegit-ai-skills-v1/plugin-observations.json) and [anonymous sibling findings](/assets/data/fakegit-ai-skills-v1/toxicskills-sibling-observations.json) retain the distinct scopes. These small selections cannot measure ecosystem prevalence.

## Follow the IOC's role, not just its spelling

A SHA-256 for an obfuscated Lua member, a Git tree blob ID, an archive digest and a blockchain contract address identify different objects. Mixing them makes a pivot look stronger than it is.

For example, a tree's Git blob identifier does not establish that an archive matches an older SHA-256 recorded by another researcher. A public reputation result describes the service's record for particular bytes at a particular time. An isolated script that made no network requests during one sandbox run is not thereby harmless.

### What exact IOC searches returned

Eight quoted native GitHub code queries returned 61 first-page rows, representing 49 pinned files across 28 repositories. I verified one full source occurrence for each target literal, eight checks across four files. I did not inspect all 49 files. The earlier keyword helper had a different population and returned benign filename substrings as well as IOC context. Its rate-limit failures are recorded separately.

The selected literal contexts led mainly to reports and IOC lists. The getter also occurs in [unrelated QuillCTF Solidity code](https://github.com/DeFiHackLabs/Web3-CTF-Intensive-CoLearning/blob/d084f6026b05148455e50b3aae8c0750d1976327/Writeup/Tanner/src/QuillCTF/PseudoRandom.sol#L47). Following report context led to the two additional known repositories above. The native literal pass itself confirmed no new distribution repository. The [query and source observations](/assets/data/fakegit-ai-skills-v1/exact-ioc-github-observations.json) preserve that distinction.

### From a passive file relation back to a README

The passive VirusTotal view offered another route into GitHub source. Its "Communicating files" view displayed 547 relationships. I selected two filename/hash rows. That label does not mean I analyzed 547 files, and it does not prove that an unopened ZIP itself made a network request.

Four native GitHub queries searched two quoted filename references and two SHA-256 strings. They returned two rows, representing two README files in two repositories. Both hash-string queries returned zero rows. These were searches of indexed source text, not searches inside ZIP bodies. Both selected READMEs and their complete pinned trees were checked, and their current heads matched the search pins. This pass is separate from the eight IOC queries above.

One result, `nunzioaccording289 / ai-skill-hub`, was already in Island's pinned list. Its README-only commit `8da0c76fa95af93cf3975f927ebcea81857605c9`, recorded at October 9, 13:53:13 UTC, changed two Markdown destinations to a raw archive under the moving `main` branch. The tree retained `subpiston/hub_skill_ai_1.6.zip`, at 476,614 bytes. I did not retrieve this archive. Its historical Island/platform hash agreement does not establish the SHA-256 of that current Git blob.

The second result was absent from both pinned lists. One badge destination and two bare URL lines changed to an archive beside a skill. Its archive was later retained for the anonymous static comparison above. Its identity and the identifying filename/hash queries remain private, so the public excerpt cannot reproduce those two queries in full. Absence from the comparison files does not establish a first disclosure.

![VirusTotal Communicating Files table with the withheld candidate row redacted.](/assets/img/posts/fakegit-ai-skills/chrome-vt-related-files-v2.webp)

*File relations used for the next GitHub search. The candidate details are redacted.*

The [filename-pivot observations](/assets/data/fakegit-ai-skills-v1/vt-github-pivot-observations.json) retain this pass's four-query denominator and the known repository's source references. They do not turn a platform relationship into observed endpoint behavior.

### Read the pointer without visiting the returned address

The Polygon address reported in the FakeGit analyses returns a C2 location that can be inspected without requesting anything from the C2 itself. The reported contract is `0x1823A9a0Ec8e0C25dD957D0841e3D41a4474bAdc`, with getter selector `0x3bc5de30`.

I retrieved the two reported update transactions, checked their successful receipts and decoded their input. Read-only calls at the preceding and update block ends reproduced these values:

| Block timestamp, UTC | Update block | Preceding block value | Update block value |
| --- | --- | --- | --- |
| August 11, 2026, 08:06:16 | `91820366` | `hxxp://83.97.20[.]150` | `hxxp://194.48.248[.]94` |
| September 17, 2026, 19:33:16 | `93979042` | `hxxp://194.48.248[.]94` | `hxxp://185.10.68[.]110` |

The [August transaction](https://polygonscan.com/tx/0x88b650e20a3e22cf9eddb07fe66221bbd83f8e16dc58aa71fd5f52fe1546e98f) and [September transaction](https://polygonscan.com/tx/0x086f877cf8227cdc9ce2bcd905f121e0ea8449fb9216e38c506ccdbb16424fbf) provide public anchors. These are end-of-block comparisons, not execution traces immediately surrounding each transaction.

![September 17 Polygon transaction details showing status, block, time and update input.](/assets/img/posts/fakegit-ai-skills/chrome-polygon-transaction-v2.webp)

*The September 17 Polygon transaction: status, block, time and update input.*

In the earlier fixed-block check, dRPC and PublicNode independently returned `hxxp://185.10.68[.]110` at block `95232281`, timestamped October 9, 13:47:21 UTC. The block hash is `0x5bd844e2348bfd3ce6d868d98f66865baac5cabcebf7b0d40a3dfbc5e37d1c4e`. This reproduces pointer rotation and a dated value. Apiiro had already reported these destinations. I did not discover new servers or test their reachability.

[ThreatFox's two records](https://threatfox.abuse.ch/ioc/1954488/) have [first-seen dates of October 6](https://threatfox.abuse.ch/ioc/1954489/). That catalogue timing is later than the independently reproduced August and September state changes. It cannot date the campaign's beginning.

I also compared file hashes across reports. [Atomdrift's June 13 analysis](https://atomdrift.org/discoveries/2026/06/surf-byo-interpreter/) identifies the same `uix.txt` SHA-256 as Derp's March report. Atomdrift describes an instrumented run that recovered screenshot behavior. That is the author's dynamic evidence, not execution performed for this investigation, and it does not establish every possible later payload.

The reports also give conflicting descriptions of an interpreter with SHA-256 `f3e34c9e36f3be065d80d456281d31dd1cc85eb4980db7fa8c1b0eb6f29c25d8`. [Derp](https://www.derp.ca/research/fakegit-luajit-github-campaign/) lists it as the 878 KB V2a executable and characterizes the February 878 KB binary as trojanized. [Atomdrift](https://atomdrift.org/discoveries/2026/06/surf-byo-interpreter/) lists the same digest but describes an unmodified interpreter. I did not resolve that provenance disagreement. This is a different executable from the retained sample above, and neither description establishes the authenticity of the separately retained DLL.

A separate historical check reproduced Spectrum's block `95019999` value through dRPC. PublicNode refused that historical call. The expanded checks below retain this one-provider limitation.

Threat-intelligence timestamps need the same care. A platform's submission or "first seen" field can date its own record rather than the first day the infrastructure existed. An address changing in contract state also does not prove that every infected host switched at that moment. Cached stages and different client behavior can overlap.

## Following the next files

[DERP's March investigation](https://www.derp.ca/research/fakegit-luajit-github-campaign/) follows the loader into GitHub-hosted encoded files and an encrypted infostealer. I used that approach to check a later case already covered by [Spectrum](https://www.spectrum.security/blog/fake-onionclaw-infostealer). DERP's two older dead-drop repositories returned API 404 in this pass. Spectrum's pinned files were still available.

This is a separate OnionClaw case. I have not shown that the earlier skill archives download these files.

### From the ZIP to the encrypted payload

I retrieved the fake OnionClaw ZIP from commit `524d4aa245cdc172b894f68b9397c885bcfb985b` in `christinminor459 / OnionClaw`. Its SHA-256 matches Spectrum's record. The archive contains three files:

```text
Launcher.cmd     26 bytes
lua51.exe       872,448 bytes
rest.txt        299,679 bytes
```

The complete launcher is only this line:

```bat
start lua51.exe rest.txt
```

`rest.txt` is obfuscated Lua. The `.txt` extension is doing PR work here. The launcher passes it to an interpreter, so treating it as harmless text would miss its role. I read and hashed the archive members without launching them.

The chain below separates the files I verified from the handoffs reported by Spectrum:

| Stage | What the evidence establishes |
| --- | --- |
| Fake OnionClaw ZIP → interpreter and `rest.txt` | Original archive, member hashes and launcher line verified |
| Lua loader → Polygon resolver → task response | Reported by Spectrum. My separate reads verify resolver state, without executing the Lua |
| Task response → GitHub `22/cd.txt` and `22/ip.txt` | Task paths reported by Spectrum. Both pinned GitHub files acquired and hashed independently |
| Hex/XOR → another obfuscated Lua file and a native wrapper | Both full decoded-file hashes reproduced |
| Wrapper resource → Base64 → AES → inner PE | Resource bounds, key constants, PE structure and full inner-file hash verified |
| Inner encrypted strings → RC4 → collector address and other text | Three fixed strings independently reproduced. No connection or theft observed |

One handoff needs a warning: Spectrum's captured task replies use a different response key from the embedded client key. The unchanged client cannot parse those replies. Spectrum decoded the captured replies offline and separately used synthetic registrations. My work checks the acquired files offline. It does not demonstrate an uninterrupted victim infection.

### What the GitHub text files actually contain

Both files come from `Sydneycondemnatory52 / ssh`, commit `3a21ace0edddbc2f5163f08ea0c5ee1321c7a354`. The first 64 ASCII characters of `22/ip.txt` are:

```text
0819f53655474c524e756d328ea6746c8f394f694f553761086f74375a68626e
```

Those are hexadecimal characters. I converted them to bytes and applied the repeating XOR key published by Spectrum. This short excerpt shows that first step:

```python
encoded = "0819f53655474c524e756d328ea6746c8f394f694f553761086f74375a68626e"
key = b"ECe6VGLRJum2qYtl79OiOU7aHot7Zhbn"
cipher = bytes.fromhex(encoded)
plain = bytes(b ^ key[i % len(key)] for i, b in enumerate(cipher))
print(plain.hex())
```

Actual output:

```text
4d5a90000300000004000000ffff0000b8000000000000004000000000000000
```

The first two bytes spell `MZ`, a Windows executable header marker. That marker alone is not a malware verdict. Decoding the whole file gives a 1,211,392-byte PE wrapper whose complete hash matches the published sample. The same transform turns `cd.txt` into another obfuscated Lua file, beginning `local Xb=function(R)`. I reused the published XOR key. I did not recover it from this Lua program.

Keep separate hashes for the encoded download and the recovered file. The wrapper's hash will not match a copy of the original hex text.

Inside the wrapper, resource `101` holds Base64 text. Decoding it yields AES-encrypted bytes. The AES key is split across machine-code constants: I reconstructed the two stored pieces and combined them as the wrapper's XOR instruction specifies. The resulting key matches Spectrum's published key. Static disassembly reads instructions. It does not execute them.

AES-256-ECB decryption recovered the inner PE. Its section boundaries end at byte 634,880, followed by 32 identical `0x20` bytes. My initial padding check rejected that suffix before checking the PE. Checking the file structure separately exposed the valid payload, and its full hash matched.

| Recovered data | Bytes | SHA-256 |
| --- | ---: | --- |
| Lua from `cd.txt` | 198,438 | `06bed48e1b04e9bb0b8a62cc3c733fb52a4a44496f6461795623dae61952a26f` |
| PE wrapper from `ip.txt` | 1,211,392 | `e8a038fdb6adfbea7740e9654c3dff46f3d58cfa4c1eb08850912e5810b46b0a` |
| Inner PE | 634,880 | `d0bb735a344aab2dc5b874a9c928ce0bf5815c0e573ab313f8552b28aabc0601` |

### RC4: original string, decoder, result

I reused Spectrum's published string key, `MUdKjf9c8jzn5iJhFE`, then verified its exact literal at file offset `520216` in the inner PE. I used it on selected Base64 strings from the same bytes. Offsets below start at zero in the inner file:

| Offset | Exact original string | Decoded result |
| --- | --- | --- |
| `520624` | `YcboTgsXIXfPFG4ZYPI+cUThqas=` | `hxxp://144.31.57[.]121` |
| `527232` | `asD5X0Vd` | `create` |
| `520240` | `MOGufQBafwjPeC1fCYxIMAmq0+rQzA==` | `9S2C1bqN4XmuXPCvczHpRq` |

The last result is the separately reported network key. It has a different role from the key that decrypts these strings. The address has no trailing slash in the actual decoded bytes. I defanged it for display.

The small RC4 decoder used in the [offline replay](/assets/data/fakegit-ai-skills-v2/spectrum-config-string-replay.py) is:

```python
def rc4(key, data):
    s = list(range(256))
    j = 0
    for i in range(256):
        j = (j + s[i] + key[i % len(key)]) % 256
        s[i], s[j] = s[j], s[i]
    i = j = 0
    out = bytearray()
    for byte in data:
        i = (i + 1) % 256
        j = (j + s[i]) % 256
        s[i], s[j] = s[j], s[i]
        out.append(byte ^ s[(s[i] + s[j]) % 256])
    return bytes(out)
```

After Base64 decoding, this function turns the ciphertext into the text shown above. The downloadable replay has two fixed string examples, exact-byte hash checks, an RFC 6229 test vector and changed-input checks against fixed expected outputs. It needs no malware sample and makes no network request. A second reviewer independently reproduced all three table entries from the recovered inner PE.

These results verify content in the reported StealC-family payload. They do not establish its exact version, who operated it, or whether a victim sent anything to the collector. The [static-chain record](/assets/data/fakegit-ai-skills-v2/static-chain-observations.json) retains source pins, byte offsets and checks. The collector string is a separate finding from the address returned by the Polygon resolver.

### A longer address history

I extended the Polygon check from two updates to **21 recorded updates**, using the transaction hashes saved from the earlier explorer view. For each one I checked the receipt, decoded the submitted address and compared the getter's answer at the preceding and update block ends. All 21 receipts succeeded and the submitted values matched the update-block answers. This is a verified selection, not a certified complete history.

The outputs contain 20 distinct nonloopback IP addresses. They are addresses stored in a resolver, not 20 servers I contacted or proved active. A few useful points in the history are:

| Update time, UTC | Value after the update | Why retain it |
| --- | --- | --- |
| November 16, 2025, 11:37:19 | `hxxp://93.123.39[.]74` | First nonloopback output in the checked selection |
| February 27, 2026, 19:47:29 | `hxxp://89.169.12[.]241` | Matches the value DERP reported in March |
| April 22, 2026, 13:39:02 | `hxxp://89.169.12[.]149` | Also embedded in Spectrum's reported second Lua loader |
| May 3, 2026, 15:48:58 | `hxxp://89.169.12[.]140` | The next checked update after `.149` |
| September 17, 2026, 19:33:16 | `hxxp://185.10.68[.]110` | Latest update in the retained selection |

The April overlap helps join infrastructure records across reports. It does not identify the operator or show which address a victim used. An older embedded address and a newer contract value can coexist in one loader.

At block `95247366`, dated October 9, 20:04:50 UTC, dRPC and PublicNode returned the same bytes for four contract/getter pairs. V1 returned `hxxp://89.169.12[.]173`, V1's alternate returned `hxxp://158.78.56[.]52`, and V2 returned `hxxp://185.10.68[.]110`. The reported test contract returned loopback `127.0.0.1`, which is not a public C2 indicator. The [resolver records](/assets/data/fakegit-ai-skills-v2/resolver-observations.json) retain each contract, selector, transaction and value. Historical reads have one-provider confirmation. The fixed-block checks have two. I did not visit any returned address.

### Why a GitHub search can miss the files

I ran 20 distinct code queries through GitHub's REST API for distinctive keys, paths, hashes and loader patterns. I inspected eight selected text files from seven repositories. The useful matches mostly led to reports, blocklists and detection material. This pass confirmed no previously unreported distribution repository. The [search observations](/assets/data/fakegit-ai-skills-v2/github-pivot-observations.json) keep the query scope separate from inspected files.

There is a practical catch: the encoded `cd.txt` and `ip.txt` files are 396,876 and 2,422,784 bytes. Both exceed the REST search documentation's limit of less than 384 KB. The newer web Code Search documents a separate 350 KiB limit. Code search also excludes binary files and uses the default branch. A zero-result text search cannot clear these downloads. Follow a known task path into the pinned tree and check the blob itself. [REST search scope](https://docs.github.com/en/search-github/searching-on-github/searching-code), [web Code Search limits](https://docs.github.com/en/search-github/github-code-search/about-github-code-search#limitations)

A query containing a SHA-256 searches for text mentioning that hash. It does not calculate hashes of GitHub files. Searching a repository name in code also does not replace a direct repository or tree lookup.

The IOC pivots also reached old domains through Certificate Transparency and existing urlscan records. Two September captures of `layer1[.]icu` ended at Vercel-labelled 404 pages. That does not recreate its earlier service or establish who controls it now. The returned urlscan queries cover only 30 days. Zero results for another address are limited to that window. Shared hosting IPs from those pages do not belong in the campaign's blocklist. [Passive observations](/assets/data/fakegit-ai-skills-v2/passive-observations.json)

For a hunt, preserve the full GitHub account/path, downloaded-body hash, launching process and time. Join them to subsequent file writes and network events. A text-file download proves acquisition. A cached task or marker can show processing. Process creation and endpoint telemetry are still needed to establish execution and theft.

## Earlier reports explain different parts of the chain

Download-link replacement predates this particular investigation. Check Point's [July 2024 Stargazers report](https://research.checkpoint.com/2024/stargazers-ghost-network/) describes surviving lure repositories redirecting to replacement malicious releases. That is relevant prior art. It does not make Stargazers and FakeGit one operation.

The [January 2026 GitHub Community report](https://github.com/orgs/community/discussions/184751) gives a dated warning about README links moving to ZIPs. [Derp's March analysis](https://www.derp.ca/research/fakegit-luajit-github-campaign/) examines the LuaJIT package and Polygon resolution. [Hexastrike's April report](https://hexastrike.com/resources/blog/threat-intelligence/cloned-loaded-and-stolen-how-109-fake-github-repositories-delivered-smartloader-and-stealc/) traces a SmartLoader-to-StealC chain. These supply different kinds of evidence, not interchangeable campaign totals.

[ASEC's August 8, 2025 analysis](https://asec.ahnlab.com/en/89551/) follows SmartLoader into Rhadamanthys. The loader's name therefore does not identify its final payload. [Netskope's March 2026 investigation](https://www.netskope.com/blog/openclaw-trap-ai-assisted-lure-factory-targets-developers-gamers) also distinguishes useful copied scaffolding from the archive advertised by its download badge.

[Orchid's June work](https://orchidfiles.com/github-repositories-distributing-malware/) explains why GitHub event history can find repositories missed by a single text query. [Island's July AgentBaiting report](https://www.island.io/blog/agentbaiting-how-800-fake-ai-skills-and-mcp-servers-delivered-malware) follows the lures into AI discovery and records variable results in agent experiments. A model sometimes rejecting the lure matters as much as a screenshot of it accepting one.

## What I would change in the review workflow

Record the exact repository identity and commit before reviewing a skill. Follow the advertised download destination as data, then inspect the relevant directory tree. A legitimate upstream project name is a search term, not a publisher identity.

For installation, approve the files and dependency behavior that will arrive on disk. Review the installer version as well as the skill. A selected `SKILL.md` does not necessarily describe the complete copied directory.

Pin the boundaries you can actually pin. An exact repository commit stabilizes its tree. It does not freeze a README target that uses `main`, an independently replaceable release asset, a package resolved through a mutable tag or the behavior of a remote MCP service. Keep a digest for the approved bytes and recheck external destinations when they change.

For local MCP servers, inspect the command and arguments that will run. The [MCP project's security guidance](https://modelcontextprotocol.io/docs/draft/tutorials/security/security_best_practices) treats local execution as a system-access boundary and recommends clear consent and sandboxing. A friendly server name cannot describe the authority of its process. The [stdio transport specification](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports#stdio) says the client launches the server as a subprocess. Starting an untrusted local stdio MCP server to list its tools therefore crosses an execution boundary. I would inspect its source and launch configuration before any connection.

Treat assertions about antivirus results as claims requiring a report for the exact file. Password protection, an administrator request and instructions to disable protection deserve inspection, not a reflex click through the warning. None of those features alone identifies a malware family.

For hunt output, keep separate fields for discovery time, source commit time, report time and current observation time. Store each relationship with its evidence: the README points to an archive, a tree contains it, a published dataset labels an older hash, a contract returns an address. A list of adjacent indicators cannot replace those relationships.

## From source review to incident triage

The response depends on which boundary was crossed. When an approved download target changes, pause installation for review. A known archive on disk establishes that those bytes were present. Neither proves execution. Unexpected execution or a relevant endpoint alert belongs in the organisation's incident-response process. An encoded string is not an incident ticket with the boring parts already filled in.

| Owner | Review trigger | Evidence and next action | False positives and limits |
| --- | --- | --- | --- |
| AppSec / developer platform | An approved skill changes its download target, adds an archive or changes startup behavior | Preserve the pinned patch, relevant tree and approved file/dependency inventory. Hold the install or update while verifying the publisher and destination bytes. | Legitimate release migrations also change links. A README-only edit does not establish account theft or execution. |
| MCP platform owner | A local startup command, dependency, access scope or returned instruction changes | Compare the exact command, arguments, versions, permissions and approved metadata. Review source and configuration before starting an untrusted server. Reapprove the changed authority. | Normal upgrades change descriptors. A metadata digest does not pin binaries, dependencies or remote state. |
| SOC | A reported archive digest or attributable component appears on a host | Preserve the exact digest, source/referrer, path, host/user and times. Apply existing artifact-handling policy and establish whether extraction or execution occurred. | Labs and cached downloads can contain reported bytes without infection. A generic Lua DLL identifies a runtime, not a malware family. |
| SOC / incident response | An unexpected process uses an adjacent Lua/text payload, or protection reports relevant execution | Collect the image/hash, command line, parent, user/session and stable process identity. Investigate the process chain. Decide isolation and credential/session review under existing IR policy. | Games and approved automation can use Lua and text-named inputs. Similar filenames alone do not establish this chain. |
| SOC / network team | Outbound traffic is associated with the process under investigation | Correlate process-linked destination/time, actual hostname/IP and available HTTP visibility with endpoint evidence. Scope blocking to supported indicators and business context. | Blockchain RPC and `eth_call` are legitimate. TLS metadata does not reveal a contract or selector. A shared public RPC endpoint does not justify a blanket campaign block. |

These are proposed triage decisions, not detections evaluated in this investigation. I have no victim process trace or measured rule accuracy. For Windows hunts, [Sysmon](https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon) Event 1 supplies process context and configured hashes. Use ProcessGuid and timestamps rather than PID alone. Event 3 network collection and Event 7 image-load collection are disabled by default. Event 11 records creation or overwrite, not arbitrary reads. Event 22 records DNS queries. It cannot exclude a direct-IP connection. Check collection settings and retention before interpreting a missing event.

Test any correlation against approved Lua applications, legitimate encoded constants, ordinary ZIP resources and normal blockchain clients. Lua, PowerShell, `BitBlt` and `eth_call` each have benign uses. The useful signal is a supported relationship between provenance, authority and unexpected behavior.

## What remains unresolved

Later payloads for the earlier skill archives remain unverified. The separate OnionClaw walkthrough verifies archive members, two task-file transforms, the native wrapper and selected inner strings. It does not bridge Spectrum's broken client/reply boundary or show victim execution. Public commit metadata also cannot tell me who controlled an account, whether its owner noticed a change or how access was obtained.

The withheld candidates could have prior reporting outside the comparison lists. Apiiro's full inventory was not public, so I cannot claim they extend it. The confirmed contribution includes dated commit/tree changes, conditional installer analysis, the preserved dataset finding, a separate filename pivot, bounded static deobfuscation and independently reproduced pointer history. Further unpacking, any dynamic analysis and coordinated disclosure need their own records and review.

## Supporting observations and access limits

The [methodology](/assets/data/fakegit-ai-skills-v1/methodology.md), [sanitized GitHub observations](/assets/data/fakegit-ai-skills-v1/github-observations.json), [passive IOC observations](/assets/data/fakegit-ai-skills-v1/ioc-observations.json) and [figure provenance](/assets/data/fakegit-ai-skills-v1/figures.json) preserve the public parts of this review. They contain no malware archive and no unpublished candidate identity. Image hashes identify the captures, not the archive bytes or an infection.

I attempted every link in Apiiro's Prior Work section. The Trend Micro page did not yield a substantive body through the reader used here. The akj page blocked automated reading, which I respected. The [Reddit report](https://www.reddit.com/r/github/comments/1isxhas/if_youre_creating_new_repositories_they_are_being/) is an anecdotal early lead. [Rushter's source review](https://rushter.com/blog/github-malware/) offers hunt patterns, with a displayed last-update date rather than a proven first-publication date. Those access and source-type differences remain part of the evidence record.

The [follow-up bundle](/assets/data/fakegit-ai-skills-v2/README.md) adds the separate chain, query scopes and expanded resolver records. The original v1 evidence is retained unchanged.

## Sources

References used above and in the public source observations.

### Reports

- [Apiiro - Never Deleted, Only Re-Pointed](https://apiiro.com/blog/never-deleted-only-re-pointed)
- [Island - AgentBaiting](https://www.island.io/blog/agentbaiting-how-800-fake-ai-skills-and-mcp-servers-delivered-malware)
- [Snyk - ToxicSkills](https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/)
- [Derp - FakeGit and LuaJIT](https://www.derp.ca/research/fakegit-luajit-github-campaign/)
- [Hexastrike - SmartLoader and StealC](https://hexastrike.com/resources/blog/threat-intelligence/cloned-loaded-and-stolen-how-109-fake-github-repositories-delivered-smartloader-and-stealc/)
- [ASEC - SmartLoader analysis](https://asec.ahnlab.com/en/89551/)
- [Netskope - Developers in the Crosshairs](https://threatlabs.netskope.com/blog/2026/08/developers-in-the-crosshairs-fake-ai-tools-deliver-infostealer)
- [Netskope - OpenClaw lure factory](https://www.netskope.com/blog/openclaw-trap-ai-assisted-lure-factory-targets-developers-gamers)
- [Orchid - GitHub repositories distributing malware](https://orchidfiles.com/github-repositories-distributing-malware/)
- [Atomdrift - the surf package and bundled interpreter](https://atomdrift.org/discoveries/2026/06/surf-byo-interpreter/)
- [Spectrum - fake OnionClaw infostealer](https://www.spectrum.security/blog/fake-onionclaw-infostealer)
- [Check Point - Stargazers Ghost Network](https://research.checkpoint.com/2024/stargazers-ghost-network/)
- [Rushter - GitHub malware source review](https://rushter.com/blog/github-malware/)

### Pinned code and datasets

- [Island repository/hash dataset, revision 72b77c0](https://github.com/island-io/island-security-research-artifacts/blob/72b77c0e2cc53cae92acd27258cf229077e1bfca/agentbaiting/malicious-repositories-and-zip-hashes-2026-07.csv)
- [Orchid repository list, revision 5ffa27e](https://github.com/orchidfiles/git-malware-finder/blob/5ffa27e2bc9dce7758379519aa6a272438b01192/full-list.txt)
- [Vercel skills installer and directory copying, revision e878c45](https://github.com/vercel-labs/skills/blob/e878c4502674f84094dc27b5ad94ddaf64f22551/src/installer.ts#L371)
- [Prometheus EncryptStrings, revision a4efc5f](https://github.com/prometheus-lua/Prometheus/blob/a4efc5f381c50ae2a111bdbb9272fa3203685be3/src/prometheus/steps/EncryptStrings.lua#L121)
- [Prometheus attribution license, revision a4efc5f](https://github.com/prometheus-lua/Prometheus/blob/a4efc5f381c50ae2a111bdbb9272fa3203685be3/LICENSE)
- [QuillCTF selector counterexample, revision d084f60](https://github.com/DeFiHackLabs/Web3-CTF-Intensive-CoLearning/blob/d084f6026b05148455e50b3aae8c0750d1976327/Writeup/Tanner/src/QuillCTF/PseudoRandom.sol#L47)

- [Spectrum's published chain indicators](https://www.spectrum.security/posts/fake-onionclaw-infostealer/indicators.json)

### Official documentation and security advisories

- [GitHub - code-search scope](https://docs.github.com/en/search-github/searching-on-github/searching-code)
- [GitHub - web Code Search limits](https://docs.github.com/en/search-github/github-code-search/about-github-code-search#limitations)
- [RFC 6229 - RC4 test vectors](https://www.rfc-editor.org/rfc/rfc6229)

- [GitHub - official MCP server](https://github.com/github/github-mcp-server)
- [Model Context Protocol - security best practices](https://modelcontextprotocol.io/docs/draft/tutorials/security/security_best_practices)
- [Model Context Protocol - stdio transport](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports#stdio)
- [Microsoft - Sysmon](https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon)
- [Cursor advisory GHSA-pc9j-3qc2-95wv](https://github.com/cursor/cursor/security/advisories/GHSA-pc9j-3qc2-95wv)
- [Cursor advisory GHSA-hf2x-r83r-qw5q](https://github.com/cursor/cursor/security/advisories/GHSA-hf2x-r83r-qw5q)

### Public records and community leads

- [PolygonScan - August 11 update transaction](https://polygonscan.com/tx/0x88b650e20a3e22cf9eddb07fe66221bbd83f8e16dc58aa71fd5f52fe1546e98f)
- [PolygonScan - September 17 update transaction](https://polygonscan.com/tx/0x086f877cf8227cdc9ce2bcd905f121e0ea8449fb9216e38c506ccdbb16424fbf)
- [ThreatFox - record 1954488](https://threatfox.abuse.ch/ioc/1954488/)
- [ThreatFox - record 1954489](https://threatfox.abuse.ch/ioc/1954489/)
- [GitHub Community - README redirection report](https://github.com/orgs/community/discussions/184751)
- [Reddit - early repository-copying report](https://www.reddit.com/r/github/comments/1isxhas/if_youre_creating_new_repositories_they_are_being/)

### Provider observations

These records describe platform observations, not independently observed C2 communication.

- [VirusTotal - existing Communicating Files relations](https://www.virustotal.com/gui/ip-address/185.10.68.110/relations)
- [urlscan - existing scan record](https://urlscan.io/result/01a11335-62e8-74da-b047-058c3c79a3e7/)
