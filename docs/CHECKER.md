# Repository checker

`npx repo-build-skill check [path]` reads a repository and groups findings by reader.
It writes nothing into the checked tree.
Use `--json` for structured findings and `npx repo-build-skill explain CODE` for a rule's reason, pass condition and teaching reference.

## Commands and modes

```sh
npx repo-build-skill check . --json
npx repo-build-skill check . --strict --house
npx repo-build-skill check . --history
npx repo-build-skill check . --online
npx repo-build-skill explain H_LEAD
```

`--strict` exits with failure on any counted skip.
`--house` raises marked house conventions to errors.
`--history` extends privacy checks to committed blobs, filenames, messages and tags.
`--online` requests live About, registry, security-reporting and set-source observations.
Offline mode is the default; CI checks the vendored set without fetching the canonical source.

## Severity and status

Objective defects use error severity; heuristic and house conventions use warn.
Warnings give advice while ordinary checking can complete.
House codes are `H_FENCE`, `H_FAQ`, `H_ABSENCE` and `A_IMPORT`; topic-to-keyword parity also raises under `--house`.
Expired proof stays warn under house mode.

| Status | Meaning |
|---|---|
| PASS | The rule ran and its requirement held. |
| FAIL | An error-level requirement failed. |
| WARN | A warning-level observation needs review. |
| SKIPPED | Needed facts or a readable input were unavailable. |
| OFF | Configuration disabled this code with a stated reason. |
| NOT APPLICABLE | The artifact falls outside this check's selected profile. |

UNREADABLE input is reported as a counted SKIPPED observation.
The workflow reader parses JSON-form YAML first, then its supported block-YAML patterns.
A construct the reader cannot resolve stays visible as UNREADABLE.

## Codes by reader

The [generated rule reference](RULES.md) supplies the authoritative title, reason, pass condition and stage link for each code.

| Group | Codes and coverage |
|---|---|
| People | `H_LEAD`: bold first-screen lead; `H_INSTALL`: first-screen install; `H_FENCE`: short examples; `H_FAQ`: common questions; `H_UNINSTALL`: removal command; `H_FLOOR`: community files; `H_LINK`: local links and anchors; `H_ABSENCE`: useful headings. |
| Agents | `A_AGENTS`: use and contribute instructions; `A_IMPORT`: one instruction source; `A_CMD`: declared scripts; `A_SKILL_SPEC`: portable skill metadata. |
| Answer engines | `M_LLMS_SHAPE`: linked context format; `M_LLMS_LEAD`: shared definition; `M_ENTITY`: consistent product name. |
| Registries | `R_DESC`: description parity; `R_TOPICS`: valid topics and keywords; `R_META`: discovery fields; `R_VERSION`: aligned version sites; `R_FILES`: published allowlist and binary. |
| Workflows | `W_PERMS`: declared permissions; `W_OIDC`: publish-only identity permission; `W_PIN`: full action SHA; `W_CREDS`: checkout credential policy; `W_INJECT`: event-data handling; `W_TAG`: tag/version equality. |
| Privacy | `P_PATH`, `P_EMAIL`, `P_TOKEN`, `P_LIST`: see aun-privacy-gate below. |
| Proof | `F_PROOF`: dated, reproducible package measurements and expiry warnings. |
| Credits | `C_CREDITS`: linked projects, licences and the technique used. |
| Set | `S_DRIFT`: local generated blocks and renderer lock; `S_STALE`: maintainer-run online source comparison. |
| Online | `O_ABOUT`: About/topics parity; `O_REGISTRY`: published listing/version/attestation; `O_PVR`: private vulnerability reporting. |

`S_STALE` is NOT APPLICABLE when `CI` is set.
Rules that need facts report the missing facts as SKIPPED.
A project with no matching artifact reports NOT APPLICABLE with a reason.

## aun-privacy-gate

Public pattern checks and owner-supplied private lists work together:

- `P_PATH` finds home-directory paths in file contents and filenames across supported OS path shapes.
- `P_EMAIL` checks addresses against `emails_allow`; reserved example domains and file-reference extensions have safe treatment.
- `P_TOKEN` finds credential-shaped strings; test fixtures assemble synthetic token shapes at runtime.
- `P_LIST` loads private lists from gitignored local files or `REPO_BUILD_PRIVATE_LISTS` and fails when a loaded list is tracked.

In a git work tree the scanner reads tracked files and untracked files Git would ship, respecting ignored paths.
Loaded private list files supply terms and are excluded from term scanning themselves.
Keep private lists and `.repo-build/work/` gitignored.
Use synthetic terms in reports and fixtures; public brand names and public host names are valid copy.
History mode applies the privacy classes that support it to every recorded commit, message and tag.
A clean current tree does not replace the history check before a public flip.

## Configuration and facts

Place public fields in `.repo-build/facts.json` using the shipped facts template.
With no explicit facts file, the checker derives available metadata from `package.json` or `pyproject.toml`.
Keep disabling decisions in `.repo-build/config.json`:

```json
{"disable":{"H_FAQ":"This library uses a linked API reference as its question entrypoint."}}
```

Each disabled code needs a nonempty reason and appears as OFF.
Unknown codes and malformed configuration return a usage/config error.
Private list paths come from the private-list environment variable, split with the platform path delimiter.
Optional `GITHUB_TOKEN` authenticates live GitHub reads; keep it in the environment and out of logs.

## Exit codes and JSON

| Exit | Meaning |
|---|---|
| 0 | No error-level failure; warnings can remain. |
| 1 | Error-level failures, or counted skips under strict mode. |
| 2 | Invalid usage, directory or configuration. |
| 3 | Online checking was requested and a required service was unreachable. |

JSON includes `version`, `profile` and `results`.
Each result includes its code, reader, stage, severity, status, location, message, reason and learning link.
Invalid requests may include `error`.
Text output ends with pass, fail, warn, skipped and off counts.
Include the exact command, version, code and sanitized reproduction when filing a false positive.
