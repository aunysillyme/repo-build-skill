# Maintenance

## GOAL

Keep the installed artifact, public metadata and evidence aligned after release.

## NEEDS

The release receipt, facts, listing URLs, proof rows and launch ledger. Make the small missing prerequisite first.

## RE-CHECK

| Fact | Official source | Window |
|---|---|---|
| Dependency-update schema | [Dependabot configuration](https://docs.github.com/en/code-security/dependabot/working-with-dependabot/dependabot-options-reference) | 90 days |
| Deprecation and archive mechanics | The registry's official deprecation docs and [GitHub archiving](https://docs.github.com/en/repositories/archiving-a-github-repository/archiving-repositories) | 90 days |

Record each read in `.repo-build/work/sources.md` with claim, URL, source date, access date, window, expires and stage. Offline facts stay UNVERIFIED while work proceeds.

## DO

1. Triage outside pull requests through the published CLA or DCO path and preserve authorship, because contribution rights and credit remain part of maintenance.
2. Merge good work as the contributor wrote it or close with thanks, implement the idea afresh and credit it, so attribution matches the work actually used.
3. Finish each accepted fix with its tests and release, including copy-only updates when the registry serves packaged documentation, so users receive the correction.
4. Run weekly parity below and verify registry metadata after every release, because metadata can drift independently of code.
5. Refresh package proof before its expiry; expired rows warn and drop out of current claims until re-measured, so stale evidence prompts upkeep while installation and updates proceed.
6. Keep deterministic proof refresh in CI and model-dependent evaluations maintainer-run with dated conditions, because a scheduled job should have only the credentials it needs.
7. Run a monthly answer-engine sweep with the same category queries, record engine, date, cited URLs and observations, because retrieval changes over time.
8. Review launch follow-ups, broken links and dependency PRs; regenerate llms.txt from its source, so public entry points stay connected.
9. Before deprecation or archive, publish migration instructions and a final version or status notice, because users need a clear supported route.

### Weekly parity

Use aun-repo-health to compare GitHub About and topics, registry description and version, facts, llms.txt shape, homepage availability and the vendored set lock. Run `repo-build-skill check . --online --json` with the installed binary, or `npx repo-build-skill check . --online --json`.

Run set drift checks against committed local copies in CI. Refresh the canonical set only through an explicit maintainer-run `repo-build-skill set sync`; scheduled jobs keep their vendored input. Keep one rolling health issue: update it on a failing run and close it with the passing receipt after repair. The workflow run and issue are the watchers; verify who receives failures and record UNVERIFIED until notification delivery is checked.

## READERS

| Reader | What they get |
|---|---|
| People | A working issue path, current release and upstream credits. |
| Agents | Dependency PRs, CI checks and regenerated instructions. |
| Answer engines | Current llms.txt and dated retrieval observations. |
| Registries | Listing parity, support status and proof expiry. |

## OWNER'S HANDS

HANDS: decide deprecation, archival and any user-facing commitment. For npm, review the exact message before `npm deprecate "<package>@<range>" "<migration-message>"`. Archive only after approval using `gh repo archive "$REPO" --yes`.

## LEAVE

Leave current CHANGELOG.md and RELEASING.md, parity and proof receipts, dated answer-engine observations, resolved launch follow-ups and `.repo-build/work/receipts/09-maintain.json`.

## GATE

Rows begin BLOCKED. Attach actual output or a dated manual receipt before assigning PASS. Facts awaiting live reads stay UNVERIFIED. Record NOT APPLICABLE with a reason; WAIVED is reserved for review and venue gates with owner, reason and date.

<!-- gate:start -->
| Check | Reject condition | Evidence |
|---|---|---|
| F_PROOF | Unmet requirement: Each row records value, unit, command, measured, expires, package_version and subject package. | F_PROOF: checker receipt, initially BLOCKED |
| C_CREDITS | Unmet requirement: Credits rows contain project, link, licence and use, and README links CREDITS.md. | C_CREDITS: checker receipt, initially BLOCKED |
| S_DRIFT | Unmet requirement: README, llms.txt, renderer and check wrapper hashes equal the vendored contract. | S_DRIFT: checker receipt, initially BLOCKED |
| S_STALE | Unmet requirement: The fetched source hash equals the lock hash. | S_STALE: checker receipt, initially BLOCKED |
<!-- gate:end -->
