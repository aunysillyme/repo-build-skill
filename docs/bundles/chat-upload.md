# repo-build-skill chat bundle

Paths in source sections resolve from the named skill asset.

<!-- source:SKILL.md -->

---
name: repo-build-skill
description: "Teaches you to frame, pick a stack for, scaffold, write, release and launch a software repository for people, coding agents and AI search. Use for a new repo, an existing repo's first release, README, AGENTS.md or llms.txt, repo SEO or AEO, npm or PyPI trusted publishing, a product page or a launch plan. For one task, load only that stage."
license: MIT
compatibility: "Web access for each stage's live re-check; without it the work proceeds and marks those facts UNVERIFIED."
metadata:
  version: "0.1.2"
---

# Repository build skill

## When invoked

This pack teaches your AI the method. Your AI does the work.

1. Record the ask date using [ask-date.md](../../skills/repo-build-skill/references/ask-date.md). Keep it fixed for this request.
2. Find `.repo-build/facts.json` in the user's repo. Start Frame when it is absent.
3. On an existing repo, prefer the installed binary: `repo-build-skill check . --json`. Otherwise run `npx repo-build-skill check . --json`. Enter at the earliest stage with an error.
4. For one task, load only that route row. A launch request starts at Launch venues and fills the small Frame artifacts it needs.
5. Apply its RE-CHECK, do the work, and run its gate. Record actual statuses and evidence in `.repo-build/work/receipts/<stage>.json`.

## Routes

Paths below resolve inside this installed skill. Project artifacts resolve inside the user's repo.

| Stage | Files to load | Gate prefix |
|---|---|---|
| Frame | `references/stages/01-frame.md`, `references/readers/people.md`, `references/acceptance-checks.md` | FR |
| Stack card | `references/stages/02-stack.md`, `assets/stack-card.md`, `references/installer.md` | ST |
| Scaffold | `references/stages/03-scaffold.md`, `assets/github/SECURITY.md`, `assets/github/CONTRIBUTING.md` | SC |
| README / AGENTS.md / llms.txt | `references/stages/04-write.md`, `references/readers/agents.md`, `references/readers/answer-engines.md` | WR |
| SEO and AEO for repos | `references/stages/05-discover.md`, `references/discoverability.md` | DI |
| Release with trusted publishing | `references/stages/06-release.md`, `references/release/contract.md`, `references/release/npm.md` | RL |
| Product site | `references/stages/07-site.md`, `references/readers/answer-engines.md` | PS |
| Launch venues | `references/stages/08-launch.md`, `references/launch-venues.md` | LA |
| Maintenance | `references/stages/09-maintain.md`, `references/readers/registries.md` | MA |

For Release, replace the npm card with the chosen registry card; retain the contract and load at most two cards.
For Stack card, load the installer card when the product installs files.

## Working rules

1. **One facts source:** keep name, lead, description, install, uninstall and metadata in `.repo-build/facts.json`; derive each public surface from it.
2. **Real numbers:** every number comes from a command's real output or a definition in code. Package claims cite dated package proof.
3. **Plain public copy:** say what things are and give. Accuracy comes first; state support awaiting a trial once, positively, where the reader acts.
4. **Owner's hands:** mark publication, the public flip and venue submissions HANDS. Prepare exact commands or URLs, then let the owner complete those actions.
5. **aun-cross-review:** one independent review by a different model family before release, or WAIVED with owner, reason and date.
6. **Load the stage in use:** keep earlier receipts as context and open linked cards only for the active route.

## State

Work lives in `.repo-build/` in the user's repo, never in the installed skill folder.
Commit `facts.json` and `config.json`; a set also commits its vendored set data, renderer and lock.
Gitignore `.repo-build/work/`: it holds sources, receipts, acceptance checks, launch records and private notes.
Each source row records claim, URL, source date, access date, window, expiry and stage.

Gates start BLOCKED. Record PASS, FAIL, BLOCKED, UNVERIFIED, NOT APPLICABLE with a reason, or WAIVED with owner, reason and date for review and venue gates only.
A live fact without a current source remains UNVERIFIED while work proceeds.
Stage Release supports a release-ready claim only with zero FAIL, BLOCKED and UNVERIFIED rows.
For other runs, report the actual unresolved facts and their status.

<!-- source:references/ask-date.md -->

# Ask date

ASK DATE is the date the user asks, fixed at the start of the request. Facts must be current to that date, never to the model's training date or this package's release date. Keep later access dates separate.

Establish it without asking the user. Use a date explicitly supplied by the host, or run `date -u '+%Y-%m-%dT%H:%M:%SZ'`. Record the exact value and source in `.repo-build/work/sources.md`. A remembered date supplies no evidence.

Capture the HTTP `Date` header from the first research fetch as a cross-check. With a shell, use `curl --silent --show-error --dump-header - --output /dev/null '<official-source-url>'`. Retain requested and final URL, status, raw Date and cache/Age evidence; exclude cookies and credentials. A tool that hides headers cannot provide this evidence.

A local date wins over a conflicting fetched header; record both. With only HTTP available, corroborate the date on an independent host. A stale cached response or future date supplies no current-date proof. If no trustworthy date is available, record date provenance UNVERIFIED and proceed.

| Repo fact | Re-check window |
|---|---|
| Name availability | 1 day; repeat at publish |
| Competitors, security settings, release requirements, retrieval sources | 30 days |
| Runtime lines, registry policy, host loading, metadata limits, schemas | 90 days |
| Venue rules and liveness | 14 days |

Use a stage's narrower window where given. Save claim, official URL, source date, access date, window, expires and stage. Refresh expired facts before relying on them.

Without web access, mark each fact requiring a live read UNVERIFIED with its reason and exact follow-up URL. Continue the work. A dependent gate stays UNVERIFIED; release-ready claims wait for those reads.

Credit: [website-build-skill](https://github.com/aunysillyme/website-build-skill), MIT.

<!-- source:references/stages/01-frame.md -->

# Frame

## GOAL

Define the problem, audience and first release before choosing implementation.

## NEEDS

The owner's request and any existing `.repo-build/facts.json` and checker receipt. Make the small missing prerequisite first.

## RE-CHECK

| Fact | Official source | Window |
|---|---|---|
| Name availability | [GitHub search](https://github.com/search) and the target registry | 1 day |
| Comparable tools | Their official repos and release pages | 30 days |
| Name and similarity policy | [npm package names](https://docs.npmjs.com/package-name-guidelines) or the chosen registry | 90 days |

Record each read in `.repo-build/work/sources.md` with claim, URL, source date, access date, window, expires and stage. Offline facts stay UNVERIFIED while work proceeds.

## DO

1. Quote the owner's asks in `.repo-build/work/acceptance.md`, so the final result answers their request.
2. Write who has the problem and the smallest useful outcome, so the first release has a clear boundary.
3. Answer the first-screen questions: what problem is solved, what people get, and what they can do, so a visitor can decide quickly.
4. Search the exact name on GitHub, the registry and the web; save candidates and dates, because a free registry response leaves similarity review until publication.
5. Create `.repo-build/facts.json` with one name, category noun, lead, description, install route and entity, so every reader encounters the same product.
6. Apply aun-acceptance: turn each quoted ask into a check with its exact verifier; capture the failing baseline before building and replay it on the final artifact, so completion has evidence.
7. Write a distribution paragraph with audience, likely venues and the first useful demo, because presentation keeps visitors and distribution brings the first ones.
8. Choose private development followed by an owner-approved public flip after gates, so private material is checked before exposure.

Presentation is one part of discovery. Repos near the top of a presentation checklist can still be outranked in GitHub search for their own names, where stars drive best match. Earn attention through useful software, real users and suitable listings; use the Discover stage's evidence grades for ranking claims.

## READERS

| Reader | What they get |
|---|---|
| People | Problem, lead and first release boundary. |
| Agents | A precise “Use this when” trigger sentence. |
| Answer engines | A category noun and an answer-first definition. |
| Registries | A dated name check and publish-time similarity caveat. |

## OWNER'S HANDS

HANDS: approve the name, first release boundary and quoted acceptance checks. Open `https://github.com/search?q=<name>&type=repositories` and the chosen registry's name page together before deciding.

## LEAVE

Leave `.repo-build/facts.json`, `.repo-build/work/acceptance.md`, a dated source ledger and `.repo-build/work/receipts/01-frame.json`. Each acceptance row has the owner quote, predicate, verifier, baseline and final result.

## GATE

Rows begin BLOCKED. Attach actual output or a dated manual receipt before assigning PASS. Facts awaiting live reads stay UNVERIFIED. Record NOT APPLICABLE with a reason; WAIVED is reserved for review and venue gates with owner, reason and date.

<!-- gate:start -->
| Check | Reject condition | Evidence |
|---|---|---|
| H_LEAD | Unmet requirement: A bold lead in the first ten lines equals facts.lead. | H_LEAD: checker receipt, initially BLOCKED |
| FR_ACCEPTANCE | Acceptance checks lack verifiers. | Owner quotes and command output. |
<!-- gate:end -->

<!-- source:references/readers/people.md -->

# People

Give a visitor enough information to decide, try the tool and recover from a failed attempt. Read the first screen as someone who has arrived from a search result.

## First screen

Answer these questions in plain words: what problem does this solve, what does the reader get, and what can they do with it? Use a concrete category noun in the lead. Put the install command beside the result it enables. Ask the owner to approve this small mock before writing the rest of the README, because a polished page can still frame the wrong product.

Follow with a real result, a short capability table and the next action. Until a real trailer exists, a table can carry that slot. Label the runtime and prerequisites beside install. Link detailed output and long examples from the docs instead of making visitors read them first.

## A usable path

- **Try:** copy the published install command in a clean temporary project.
- **Use:** show a command that exists and the artifact or behavior it produces.
- **Recover:** put uninstall next to install and describe what user edits are preserved.
- **Trust:** link the licence, security reporting, measured proof and upstream credits.
- **Contribute:** offer specific work and a small reproduction path for bugs.

Write headings in the words readers search for. Answer each common question first, then give the exact command and a link for depth. Keep code fences short enough to copy as one action. Put numbers in copy only when a saved command output supports them; show measured and expiry dates beside time-sensitive claims.

## Cold read

Give a fresh reader only the first screen. Ask them to find the problem, audience, install command and next action. Record their answers separately from checker results. Fix an unclear sentence at its source in facts or README; a green structural check cannot measure comprehension.

Presentation keeps a visitor who has arrived. A distribution plan brings the first visitors. Write both at Frame, then track referrers and dated searches as observations rather than promises about rank.

<!-- source:references/acceptance-checks.md -->

# Acceptance checks

Use aun-acceptance to turn the owner's words into verifiable outcomes. It keeps a technically sound build aligned with the thing the owner asked for.

## Freeze the result

Quote each acceptance-critical ask verbatim in a private work record. Give it an id, a predicate on the final artifact, a scoped verifier and an expected result. Preserve the owner's firmness: a preference stays a preference and a must stays a requirement. Ask about missing build-changing decisions together, with a recommendation.

| Ask | Predicate | Verifier | Evidence |
|---|---|---|---|
| Owner's exact words | A visible behavior or artifact | Exact command, inspection or owner check | Saved output and status |

A verifier should be capable of showing the opposite. Checking that a file exists proves existence; running the packaged entrypoint proves it can start. For performance, measure the named property. For privacy, scan both publishable content and the relevant history.

## RED before build, replay after build

Run each required verifier before implementation and save the failing result. This confirms the check can detect the missing behavior. For an existing check that already fails, retain that output instead of creating another test. Match the check's cost to the risk of the change.

Replay the same verifiers against the final artifact, including its packaged form when that is what users install. Record PASS, FAIL, BLOCKED or UNVERIFIED and the path to evidence. A changed goal needs an explicit update from the owner; a passing substitute does not silently replace the original check.

## Keep the claim within the evidence

Report manual actions as owner's hands with an exact command or URL. A pending publish stays pending even when packaging passes. An unavailable live source stays UNVERIFIED while independent work continues. Review and venue gates alone may be WAIVED with owner, reason and date; keep the waiver visible in the receipt.

Reopen the original asks at completion and compare each to its verifier once. Keep private source words out of a public showcase unless the owner authorizes them. A public receipt can show the predicate, command, result and artifact hash.

Technique credit: [rookepoole/PARS](https://github.com/rookepoole/PARS), MIT. This card generalizes freezing checks from the owner's words and replaying them against the final artifact.

<!-- source:references/stages/02-stack.md -->

# Stack card

## GOAL

Pick a maintainable stack from the user's install path and measurable budgets.

## NEEDS

Frame facts and acceptance checks; use `assets/stack-card.md` and the installer card when files are installed. Make the small missing prerequisite first.

## RE-CHECK

| Fact | Official source | Window |
|---|---|---|
| Runtime support lines | [Node releases](https://nodejs.org/en/about/previous-releases) or [Python versions](https://devguide.python.org/versions/) | 90 days |
| Runner images and install tools | [GitHub runner images](https://github.com/actions/runner-images) and the tool's official docs | 90 days |

Record each read in `.repo-build/work/sources.md` with claim, URL, source date, access date, window, expires and stage. Offline facts stay UNVERIFIED while work proceeds.

## DO

1. Write `docs/STACK.md` before the first commit with Runs on, The user already has, Install path, Budgets, Pick and Budget tests, so the stack decision is visible before code.
2. Start from how the user gets the product, because the user pays for every runtime they do not already have.
3. Compare Node for an `npx` tool, Python for `uvx` or library-heavy work, browser delivery for a web app, and a binary for users with no runtime, so the distribution route leads the choice.
4. Set numerical limits for installed size, runtime dependencies, install steps, startup, resident memory when relevant, and uninstall residue, so efficiency becomes testable.
5. Prefer one command and one confirm for an installer, derive roles from the user's stack, and point to companions' official installation instructions, because third-party setup belongs to their owners.
6. For a close call, package the same small feature in each candidate with one builder per stack in parallel; install cleanly and measure, so the comparison tests delivery as well as execution.
7. Choose the simplest maintained stack meeting every budget; put a language outside the project's defaults before the owner with the card and tradeoff, so a rewrite is a deliberate decision.
8. Turn durable budgets into tests and record registry and runtime manifest fields, so growth cannot quietly change the installation cost.

## READERS

| Reader | What they get |
|---|---|
| People | An install line and explicit step budget. |
| Agents | Headless flags and the installer receipt contract. |
| Answer engines | Runtime and requirement facts. |
| Registries | Registry choice plus `engines` or `requires-python`. |

## OWNER'S HANDS

HANDS: choose any language outside the project's defaults after reviewing `docs/STACK.md`. Confirm the actual install route with the target users. Use the official runtime pages linked above to approve the support floor.

## LEAVE

Leave `docs/STACK.md` with the six labels, measurement commands and results; budget tests; selected registry and support floors in the manifest; `.repo-build/work/receipts/02-stack.json`.

## GATE

Rows begin BLOCKED. Attach actual output or a dated manual receipt before assigning PASS. Facts awaiting live reads stay UNVERIFIED. Record NOT APPLICABLE with a reason; WAIVED is reserved for review and venue gates with owner, reason and date.

<!-- gate:start -->
| Check | Reject condition | Evidence |
|---|---|---|
| H_UNINSTALL | Unmet requirement: An installer has an uninstall command in README. | H_UNINSTALL: checker receipt, initially BLOCKED |
<!-- gate:end -->

<!-- source:assets/stack-card.md -->

# Stack card

Write this card before the first commit. Replace each bracketed field with the user's real constraints and a verifier. The install path comes before the language: every runtime the user lacks adds a step.

1. **Runs on:** [command line, browser, desktop, phone or server; supported systems and architectures].
2. **The user already has:** [runtime and tools already present; evidence from the intended user's stack].
3. **Install path:** [one advertised command, download or hosted URL; uninstall route; headless flags when applicable].
4. **Budgets:** [packed and installed bytes; runtime dependency count; install actions; cold start; memory for a long-running process; cleanup result].
5. **Pick:** [stack and reason; alternatives considered; owner decision for a language outside the project's defaults].
6. **Budget tests:** [exact command, environment, measured property and pass limit for every binding budget].

When two stacks fit, package the same small working feature in each. Measure against the same budgets in clean environments. Parallel implementations can reduce waiting; each needs the same input and distinct ownership. Pick the simplest maintainable option that meets every binding budget and save the comparison.

<!-- source:references/installer.md -->

# Installer

Teach an installer that gets a user to a working first action with one command and one confirm. Choose roles from the user's existing stack. Point to other people's tools and their official install instructions; never install those tools on the user's behalf.

## Install contract

Show the target scope, paths, file changes, retained data and real manual steps before confirmation. Support project scope by default when the host accepts it. Offer a deterministic headless route with explicit host, directory, scope and confirmation flags. A dry run prints the same plan as a real run while writing nothing.

Keep one canonical skill folder. Copy the complete folder so relative references resolve. Use a marked block when integrating with an existing instruction file. Preserve unrelated content and stop on a conflict. Test the installed package in a clean directory rather than only importing its source.

Write a receipt with package name and version, host, scope, destination, install timestamp, paths, actions and install-time hashes. Distinguish created files from identical pre-existing files and marked blocks. Read files back before reporting installation. Report host activation separately and give the user a small real-client loading check.

## Eight safe uninstall rules

1. Remove only files this install wrote and whose bytes still match their install-time hash. Later package versions must use the saved hash, because re-rendering can differ.
2. In a file the user already had, remove only the exact marked block and preserve surrounding text.
3. Refuse traversal, absolute paths and symlinks. Validate path ownership and re-probe before every removal.
4. Remove a directory only if this install created it and it is empty.
5. Remove the receipt or install manifest last. Retain it when edited content still needs review.
6. Make `--dry-run` describe the real removal plan, including preserved edits.
7. Treat a missing receipt as a usage error, exit 2, and name its path.
8. Print the manual steps for references or pasted instructions the user added by hand.

An uninstall test installs, removes and checks the resulting tree. Additional controls preserve edited files, pre-existing identical files, adjacent instructions and paths outside the target. A retry must still identify the remaining owned files.

## This pack's route

Run `npx repo-build-skill`, select the host, review the preview and confirm. For automation: `npx repo-build-skill --host codex --scope project --dir . --yes`. Preview removal with `npx repo-build-skill --uninstall --host codex --dry-run`; apply it with `npx repo-build-skill --uninstall --host codex --yes`.

The host adapter names the actual target. Each receipt lives inside that target as `.repo-build-skill-receipt.json`. Chat upload prints the bundle path and its removal step instead of writing host files.

<!-- source:references/stages/03-scaffold.md -->

# Scaffold

## GOAL

Create the professional floor and a safe path to the public flip.

## NEEDS

Frame facts, `docs/STACK.md`, the selected manifest and acceptance checks. Make the small missing prerequisite first.

## RE-CHECK

| Fact | Official source | Window |
|---|---|---|
| Community health defaults | [GitHub community files](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/creating-a-default-community-health-file) | 30 days |
| Action versions and full SHAs | Each action's official releases and commit history | 30 days |
| Public visibility and security settings | [GitHub security documentation](https://docs.github.com/en/code-security) | 30 days |
| Code of conduct text and attribution | [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/) | Ask date |

Record each read in `.repo-build/work/sources.md` with claim, URL, source date, access date, window, expires and stage. Offline facts stay UNVERIFIED while work proceeds.

## DO

1. Create the floor below from the chosen templates, because contributors need predictable entry points.
2. Add `.repo-build/work/` to `.gitignore`; keep facts and configuration committed, because private working notes and CI inputs have different lifecycles.
3. Check the owner's account-level `.github` defaults for CONTRIBUTING, SECURITY, SUPPORT, forms and funding before adding overrides, because a repo override replaces that inherited file or form set.
4. Write local LICENSE and AGENTS.md; these need repo-specific copies. Explain the chosen CLA or DCO in CONTRIBUTING so contributors know the grant before contributing.
5. Fetch the chosen code of conduct from its official source on the ask date and keep its attribution block, so conduct guidance retains its provenance.
6. Give feature forms an Observable success check field and bugs reproduction steps, so incoming requests can be verified.
7. Pin remote actions to full commit SHAs with version comments, set read-only default permissions, disable checkout credential persistence and pass untrusted event data through environment variables, because workflows run contributed inputs.
8. Set a package `files` allowlist and verify bin targets are included, so the release contains only the intended product.
9. Prepare the public-flip commands below and read their results back after the owner acts, because account plan and visibility determine availability.

### Professional floor

Create README.md, LICENSE, CREDITS.md, CHANGELOG.md, CONTRIBUTING.md, CODE_OF_CONDUCT.md, SECURITY.md, MAINTAINERS.md, RELEASING.md, AGENTS.md, CLAUDE.md, llms.txt and docs/README.md. Add issue forms, a pull request template, CODEOWNERS and a check workflow under `.github/`. Choose dependency monitoring for the project. Add Scorecard to every repo using the [workflow assets](../../skills/repo-build-skill/references/workflows.md#scorecard).

A solo maintainer can defer a governance board, a separate public planning board and release milestones until they serve actual users. Keep ownership, security reporting and contribution instructions concrete.

### Settings at the public flip

Set `REPO=owner/repo` and use the actual default branch. Read the linked GitHub docs on the ask date before applying these owner-approved commands. Set private vulnerability reporting:

```sh
gh api --method PUT "repos/$REPO/private-vulnerability-reporting"
gh api "repos/$REPO/private-vulnerability-reporting"
```

Enable secret scanning and push protection, then read the values:

```sh
gh api --method PATCH "repos/$REPO" --input - <<'JSON'
{"security_and_analysis":{"secret_scanning":{"status":"enabled"},"secret_scanning_push_protection":{"status":"enabled"}}}
JSON
gh api "repos/$REPO" --jq .security_and_analysis
```

Enable Dependabot alerts and security updates; the GET/HEAD response verifies each switch:

```sh
gh api --method PUT "repos/$REPO/vulnerability-alerts"
gh api --method PUT "repos/$REPO/automated-security-fixes"
gh api --method GET "repos/$REPO/vulnerability-alerts" --include
gh api "repos/$REPO/automated-security-fixes"
```

Configure CodeQL default setup:

```sh
gh api --method PATCH "repos/$REPO/code-scanning/default-setup" -f state=configured
gh api "repos/$REPO/code-scanning/default-setup"
```

Protect the default branch against force-push and deletion. Replace the required check with its stable aggregate name:

```sh
gh api --method PUT "repos/$REPO/branches/main/protection" --input - <<'JSON'
{"required_status_checks":{"strict":true,"contexts":["Repository checks"]},"enforce_admins":false,"required_pull_request_reviews":null,"restrictions":null,"allow_force_pushes":false,"allow_deletions":false}
JSON
gh api "repos/$REPO/branches/main/protection"
```

Review Sponsorships in the repository settings, the package funding link and inherited FUNDING.yml together. Verify the public community profile with `gh api "repos/$REPO/community/profile"`.

## READERS

| Reader | What they get |
|---|---|
| People | Community files, forms and a docs index. |
| Agents | AGENTS.md as the instruction source with CLAUDE.md importing it. |
| Answer engines | An llms.txt skeleton with labelled links. |
| Registries | Metadata stubs and a package allowlist. |

## OWNER'S HANDS

HANDS: approve the public flip in `https://github.com/<owner>/<repo>/settings`. After approval, `gh repo edit "$REPO" --visibility public --accept-visibility-change-consequences` makes it public. Apply and read back the settings in Settings at the public flip in that same pass.

## LEAVE

Leave populated floor files, issue forms, pinned CI, manifest metadata and `.repo-build/work/receipts/03-scaffold.json`. Record each setting's command, response and access date in `REPO_SETTINGS.md`; unavailable settings remain UNVERIFIED.

## GATE

Rows begin BLOCKED. Attach actual output or a dated manual receipt before assigning PASS. Facts awaiting live reads stay UNVERIFIED. Record NOT APPLICABLE with a reason; WAIVED is reserved for review and venue gates with owner, reason and date.

<!-- gate:start -->
| Check | Reject condition | Evidence |
|---|---|---|
| H_FLOOR | Unmet requirement: Every floor file, issue form and check workflow is present and non-empty. | H_FLOOR: checker receipt, initially BLOCKED |
| A_SKILL_SPEC | Unmet requirement: Each SKILL.md has a valid name, description and size. | A_SKILL_SPEC: checker receipt, initially BLOCKED |
| R_META | Unmet requirement: Homepage, repository, bugs and license fields are present. | R_META: checker receipt, initially BLOCKED |
| W_PERMS | Unmet requirement: Every workflow declares read-only or empty default permissions. | W_PERMS: checker receipt, initially BLOCKED |
| W_PIN | Unmet requirement: Every remote action uses forty hex characters and a version comment. | W_PIN: checker receipt, initially BLOCKED |
| W_CREDS | Unmet requirement: Each checkout step sets persist-credentials: false, and a tag-triggered workflow turns package-manager caching off. | W_CREDS: checker receipt, initially BLOCKED |
| W_INJECT | Unmet requirement: No event, head_ref or input interpolation appears in run values or github-script bodies. | W_INJECT: checker receipt, initially BLOCKED |
| P_PATH | Unmet requirement: Home paths use placeholder usernames in contents and filenames. | P_PATH: checker receipt, initially BLOCKED |
| P_EMAIL | Unmet requirement: Email addresses are in the allowlist or a standard example or noreply domain. | P_EMAIL: checker receipt, initially BLOCKED |
| P_TOKEN | Unmet requirement: Token-shaped strings and private key headers are absent. | P_TOKEN: checker receipt, initially BLOCKED |
| P_LIST | Unmet requirement: Untracked list files contain no matches in the public tree or history. | P_LIST: checker receipt, initially BLOCKED |
| O_PVR | Unmet requirement: Public GitHub repositories enable private vulnerability reporting. | O_PVR: checker receipt, initially BLOCKED |
| SC_PUBLIC (HANDS) | The public flip settings await owner action. | Dated public settings read-back. |
<!-- gate:end -->

<!-- source:assets/github/SECURITY.md -->

# Security policy

## Supported versions

Security fixes target [supported release line]. Install the current release using [documented command]. Maintainers list a dated support change in the changelog.

## Report a vulnerability

Use [private vulnerability reporting](https://github.com/OWNER/NAME/security/advisories/new) from the repository's Security tab. Describe the affected version, expected and observed behavior, impact and a minimal reproduction. Remove personal data and credentials from the example.

Keep exploit details private while maintainers assess the report. Maintainers acknowledge it through the advisory, confirm the scope, coordinate a correction and publish an advisory when appropriate. Response targets belong here only after the owner adopts them.

## Verify the reporting path

At the public flip, enable private vulnerability reporting and open the report link signed out to confirm its destination. Put general bugs through the issue forms. Review runtime dependencies, workflow permissions and credential handling before each release.

<!-- source:assets/github/CONTRIBUTING.md -->

# Contributing

Help with a reproducible bug, a clearer example, a false positive, a supported integration or a documented release path. Open the matching issue form with the result you want and an observable success check.

## Make a change

Read AGENTS.md for the real install, build, test and generation commands. Use a focused branch, keep the change within its stated scope and preserve related public links. Pair a checker rule with a failing synthetic control and a passing control. A bug report should include the exact command, runtime, complete error and minimal example.

## Submit a pull request

Describe the user-visible problem and resulting behavior. Include the checks you ran and their results, updated docs and any remaining manual verification. Credit every upstream technique or copied passage by project, URL, licence and use in CREDITS.md.

## Contribution terms

The owner selects a CLA or Developer Certificate of Origin before accepting contributions. Link the chosen policy here and configure the matching check. Accepting a contribution must preserve its original licence and attribution obligations.

Our own tools and concepts use one public prefix. Keep the private name map out of the published tree and enforce its internal column with a test.

<!-- source:references/stages/04-write.md -->

# README / AGENTS.md / llms.txt

## GOAL

Write connected entry points for people, coding agents and answer engines.

## NEEDS

Frame facts, acceptance checks, scaffold and the chosen command surface. Make the small missing prerequisite first.

## RE-CHECK

| Fact | Official source | Window |
|---|---|---|
| Host instruction loading | [AGENTS.md](https://agents.md/) and [Claude Code memory](https://code.claude.com/docs/en/memory) | 90 days |
| llms.txt format | [llms.txt proposal](https://llmstxt.org/) | 90 days |

Record each read in `.repo-build/work/sources.md` with claim, URL, source date, access date, window, expires and stage. Offline facts stay UNVERIFIED while work proceeds.

## DO

1. Show the owner a first-screen mock with title, badges, bold lead, problem, what people get, what they can do and install command, so positioning is approved before the full README.
2. Write the README in that order, then proof, capability table, activation and a real run, related set, feature commands, Common questions, uninstall, agent links, docs, contributions, credits and license, so depth follows the reader's decision.
3. Keep front-page fenced blocks at eight lines or fewer and move full output into docs, because a capability table is easier to scan than a terminal dump.
4. Quote every capability against the implementation and re-run each printed number, because clear copy still needs accurate evidence.
5. Write AGENTS.md under 200 lines with Use this skill or product and Contribute sections, exact existing commands and gotchas; put always-true rules in tests and link those tests, so instructions stay useful and enforceable.
6. Make CLAUDE.md an H1, a sentence naming AGENTS.md as the single source and the exact line `@AGENTS.md`, so the supported import route reads one instruction source.
7. Generate llms.txt with H1, facts lead as blockquote, install line and linked sections using labelled absolute release-tagged URLs, so agents can follow stable documents.
8. Write search-phrased Common questions with short answer-first paragraphs and the exact command; derive description and keywords from facts, so humans and retrieval systems see the same answers.
9. State support awaiting a real-client trial once, positively, at its action point, because the reader needs the evidence level before relying on it.
10. Apply the private name map and plan proof on screen below; check links and replay the acceptance checks, so public text and visual claims match the final product.

### Proof on screen

Plan a 10-15 s trailer: show the result, the real command and the useful outcome. Get keyframes approved before animation. Every command must exist; numbers come only from the package's `proof/results.json`. Use the stage or capability table in the trailer slot until the trailer exists.

Put the terminal recording beside installation details. Record the published package from a clean directory outside its own repo, using a version-pinned install such as `npx <package>@<version>`. A checkout can resolve its own package instead of the published one. Inspect the last frame and the hosted image before linking it.

### Private name map

Keep a private table under `.repo-build/work/` with internal name, public name and where it appears. Give your own tools one public prefix. Replace internal names in files, filenames and release text; public platform and third-party project names retain their identities.

A test reads only the internal column and fails on any hit in the public tree. Keep that column private; a committed test can store hashes of its terms instead. Allow public brand, official domains and credited upstream names. House writing rules become tests, so the next edit receives the same checks.

## READERS

| Reader | What they get |
|---|---|
| People | A first screen, useful feature table and a real example. |
| Agents | Use and contribute instructions with runnable commands. |
| Answer engines | Labelled absolute links and answer-first sections. |
| Registries | One description and keyword source. |

## OWNER'S HANDS

HANDS: approve the first-screen mock and trailer keyframes before final production. Read the actual rendered README on `https://github.com/<owner>/<repo>` after the public flip.

## LEAVE

Leave README.md, AGENTS.md, CLAUDE.md, generated llms.txt, linked docs, a private name map, a proof storyboard and `.repo-build/work/receipts/04-write.json`.

## GATE

Rows begin BLOCKED. Attach actual output or a dated manual receipt before assigning PASS. Facts awaiting live reads stay UNVERIFIED. Record NOT APPLICABLE with a reason; WAIVED is reserved for review and venue gates with owner, reason and date.

<!-- gate:start -->
| Check | Reject condition | Evidence |
|---|---|---|
| H_INSTALL | Unmet requirement: The install command occurs in the first forty lines. | H_INSTALL: checker receipt, initially BLOCKED |
| H_FENCE | Unmet requirement: Fenced README blocks have at most eight lines or a reasoned allow marker. | H_FENCE: checker receipt, initially BLOCKED |
| H_FAQ | Unmet requirement: Common questions contains four to six H3 headings. | H_FAQ: checker receipt, initially BLOCKED |
| H_LINK | Unmet requirement: Relative Markdown links and heading anchors exist. | H_LINK: checker receipt, initially BLOCKED |
| H_ABSENCE | Unmet requirement: Headings describe the content they give. | H_ABSENCE: checker receipt, initially BLOCKED |
| A_AGENTS | Unmet requirement: AGENTS.md has use and contribute headings and fewer than 200 lines. | A_AGENTS: checker receipt, initially BLOCKED |
| A_IMPORT | Unmet requirement: CLAUDE.md includes the exact line @AGENTS.md. | A_IMPORT: checker receipt, initially BLOCKED |
| A_CMD | Unmet requirement: Every npm run command named in AGENTS.md exists in package scripts. | A_CMD: checker receipt, initially BLOCKED |
| M_LLMS_SHAPE | Unmet requirement: An H1, blockquote and sections with labelled absolute links exist. | M_LLMS_SHAPE: checker receipt, initially BLOCKED |
| M_LLMS_LEAD | Unmet requirement: The llms.txt blockquote equals facts.lead. | M_LLMS_LEAD: checker receipt, initially BLOCKED |
<!-- gate:end -->

<!-- source:references/readers/agents.md -->

# Coding agents

Give an agent one authoritative entrypoint, runnable commands and a small route to the current task. A long instruction file consumes context on every turn; move detail into named references and load it when needed.

## AGENTS.md

Use two sections: **Use this skill** for consuming the repo and **Contribute** for changing it. Include the install or invocation path, how to locate facts, the build and test commands, generated-file boundaries and the expected report. Name the package scripts that actually exist. Keep local instructions near code when they override a broader rule.

Keep the root under 200 lines. Put an always-true requirement in a test, then point to that test instead of repeating the rule in several agent files. Preserve existing instructions when adding a marked installer block; ask the owner to resolve conflicting instructions.

For a host that imports CLAUDE.md, keep AGENTS.md the source:

```markdown
# Project instructions
Read AGENTS.md as the single source for project instructions.
@AGENTS.md
```

Re-check the host's current import and discovery rules on the ask date. A file at a plausible location proves installation; a real-client invocation proves loading. Use the host adapter's check to record the exact path opened and the action it enabled.

## Machine-readable context

Use `.repo-build/facts.json` for shared names, descriptions and URLs. Generate llms.txt and bundles from that source. Run `repo-build-skill check . --json` to get findings with code, severity, file, reason and learning link. The checker reads the repo; the AI owns the edits and reports their effect.

Keep work receipts and research under gitignored `.repo-build/work/`. Public receipts contain only the evidence a stranger needs to reproduce a claim. Scan paths, output and history for private data before publishing them.

## Verify the handoff

Ask a fresh agent to identify the source of truth, run one listed command and locate the reference for the assigned stage. Capture its observed actions. If a tool or web source is unavailable, keep that fact UNVERIFIED and finish independent work within scope.

Format source: [AGENTS.md](https://agents.md/). Host instructions govern their own loading behavior.

<!-- source:references/readers/answer-engines.md -->

# Answer engines

Make the repository easy to identify, quote and link. Structured files help a reader retrieve the right facts; they do not promise search placement.

## One identity

Use the same name, lead, description and canonical URLs in README, package metadata, GitHub About and llms.txt. Keep them in `.repo-build/facts.json` and generate repeated surfaces. Use a clear category noun and say what the product gives. Label the canonical repository, package page, documentation and site so a reader can connect the entity across surfaces.

## llms.txt

Follow the [llms.txt proposal](https://llmstxt.org/): an H1, a short blockquote describing the project, useful context and grouped Markdown links. Give every link a descriptive label and an absolute URL. For released instructions use a tag-pinned path; use the package registry for current version queries.

Generate llms.txt from facts and docs headings. Check its lead against the README and its links against shipped files. Treat it as an index, then keep authoritative explanations in the linked documents. Agents may read it during installation even when direct crawler traffic is low.

## Answers worth citing

Write question headings that match a real task. Start with a direct answer, give the runnable command, then link the supporting reference. Separate a measured package result from a documented procedure and a reported field observation. Put dates and expiry beside measurements so an engine can distinguish a current result from an old one.

Provide a comparison only when it helps a decision and each statement has a source. A working install path and a public issue with a reproduction are stronger evidence than a list of keywords.

## Product site handoff

Pass facts to the site's builder. The minimum includes canonical links, crawlable documentation, sitemap, robots policy and relevant structured data. For a software tool, check SoftwareApplication fields such as name, description, applicationCategory, operatingSystem, softwareVersion and license against the published artifact. Use a linked SoftwareSourceCode entity for codeRepository and verify the current schema before generating it. Add offers only when pricing exists and the owner approves it.

Read search-engine and structured-data documentation on the ask date. Record Search Console and Bing Webmaster verification as owner's hands. Track answer-engine queries, returned sources and dates as observations, with failed or empty retrievals included.

<!-- source:references/stages/05-discover.md -->

# SEO and AEO for repos

## GOAL

Make each repository surface accurately describe the same searchable product.

## NEEDS

Facts, README, agent entry points and generated llms.txt; load `references/discoverability.md`. Make the small missing prerequisite first.

## RE-CHECK

| Fact | Official source | Window |
|---|---|---|
| Topics, preview and README limits | [GitHub repository documentation](https://docs.github.com/en/repositories) | 90 days |
| Registry metadata fields | The selected registry's official publishing docs | 90 days |
| Answer-engine retrieval sources | The answer engine's official search documentation | 30 days |
| Rank-abuse policy | [GitHub Acceptable Use](https://docs.github.com/en/site-policy/acceptable-use-policies/github-acceptable-use-policies) | Ask date |

Record each read in `.repo-build/work/sources.md` with claim, URL, source date, access date, window, expires and stage. Offline facts stay UNVERIFIED while work proceeds.

## DO

1. Label tactics CONFIRMED, PRACTICE or REPORTED in the source ledger, because documented behavior and field observations support different claims.
2. Synchronize the About description, homepage, topics, registry keywords and plugin metadata from facts, so a search card answers the same question everywhere.
3. Choose relevant category and use-case terms for topics and headings; retain the product name on the command, because people search both the task and the brand.
4. Check the current GitHub topic and social-preview limits before applying metadata; use the default link preview when it clearly identifies the repo, so presentation remains familiar.
5. Add direct use-case answers, comparisons with named alternatives and “when to use” guidance, because readers need distinctions they can act on.
6. Validate skill and plugin manifests and make llms.txt links descriptive and absolute, so installation and retrieval follow real files.
7. Connect the repo, registry, documentation and owner's public entity links consistently, so citations resolve to the same product.
8. Earn stars through use, useful releases and fitting listings; follow GitHub's prohibition on rank abuse such as automated starring or following, so distribution serves real readers.
9. Record dated search observations separately from package proof, because rankings and citations are observations rather than a promised result.

## READERS

| Reader | What they get |
|---|---|
| People | Accurate About box, topics and Common questions. |
| Agents | Valid manifests and linked install instructions. |
| Answer engines | One entity, comparison pages and direct answers. |
| Registries | Keywords, homepage, repository and funding parity. |

## OWNER'S HANDS

HANDS: approve the public metadata and any owner identity links. After the flip, use `gh repo edit "$REPO" --description "<facts-description>" --homepage "<facts-homepage>"` and `gh api "repos/$REPO"` to read them back; apply topics from the facts array with `gh api --method PUT "repos/$REPO/topics" --input <topics-json-file>`.

## LEAVE

Leave synchronized facts and metadata, a dated tactics ledger with grades, resolved links and `.repo-build/work/receipts/05-discover.json`.

## GATE

Rows begin BLOCKED. Attach actual output or a dated manual receipt before assigning PASS. Facts awaiting live reads stay UNVERIFIED. Record NOT APPLICABLE with a reason; WAIVED is reserved for review and venue gates with owner, reason and date.

<!-- gate:start -->
| Check | Reject condition | Evidence |
|---|---|---|
| M_ENTITY | Unmet requirement: README and llms.txt H1 headings equal the manifest product name. | M_ENTITY: checker receipt, initially BLOCKED |
| R_DESC | Unmet requirement: Description has at most 160 characters and all declared copies agree. | R_DESC: checker receipt, initially BLOCKED |
| R_TOPICS | Unmet requirement: At most twenty slug topics, each also a keyword. | R_TOPICS: checker receipt, initially BLOCKED |
| O_ABOUT | Unmet requirement: Description, homepage and topics match the facts source. | O_ABOUT: checker receipt, initially BLOCKED |
<!-- gate:end -->

<!-- source:references/discoverability.md -->

# Discoverability

Improve the files each reader sees, then find the places those readers already use. Presentation keeps visitors; distribution brings the first ones. Strong presentation can still be outranked in GitHub search for a repo's own name, where stars influence best match.

## Evidence grades

- **CONFIRMED:** an official source states the platform behavior. Save its URL, source date, access date and expiry.
- **PRACTICE:** a useful procedure supported by a dated observation. Record the query and result; its effect on rank stays a separate claim.
- **REPORTED:** a named external study or provider reports the effect. Read that source and preserve its scope before presenting it as advice.

## Repository surfaces

| Grade | Tactic | Source and action |
|---|---|---|
| CONFIRMED | Use relevant GitHub topics, at most 20 and at most 50 characters each. | [GitHub topics](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics); re-check limits before setting them. |
| CONFIRMED | Keep the social preview image under 1 MB. | [Social preview](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview); inspect the rendered preview. |
| CONFIRMED | Keep the useful README first; GitHub truncates content beyond 500 KiB. | [About READMEs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes); link long guides from the index. |
| PRACTICE | Keep About, package description, lead and canonical URLs in one facts source. | Run the checker and compare published metadata to the tag after each release. This reduces conflicting descriptions. |
| PRACTICE | Put search terms in descriptive headings and brand on the command. | Capture a dated cold read and search baseline; assess whether readers can find the right task. |
| PRACTICE | Use question headings, concise answers and sourced comparisons. | Check comprehension separately from rank. Publish a comparison when it helps the reader choose. |
| PRACTICE | Generate llms.txt with labelled absolute links. | Follow the [proposal](https://llmstxt.org/); test agent retrieval and link resolution. |
| REPORTED | Question and comparison pages can be cited more often by answer engines. | Read the repo-GEO synthesis in [github-morestar-skill](https://github.com/everest-an/github-morestar-skill) and the evidence-labelled findings in [legends-github](https://github.com/avalonreset/legends-github) on the ask date. Follow their cited studies and record each corpus and method before making a causal claim. |
| REPORTED | Bing results can feed ChatGPT search. | Re-check the provider's [search documentation](https://help.openai.com/en/articles/9237897-chatgpt-search); include Bing Webmaster verification in the site handoff when applicable. |
| REPORTED | llms.txt may receive little direct crawler traffic. | Treat the observations in [legends-github](https://github.com/avalonreset/legends-github) as reported; follow their original sources on the ask date. Measure actual request logs and keep agent-index usefulness separate from traffic. |

Read official limits within the Discover stage's window. When web access is unavailable, keep the research rows UNVERIFIED while preparing metadata and copy.

## Earn discovery

Earn stars through useful releases, reproducible examples and relevant listings. GitHub's [Acceptable Use Policies](https://docs.github.com/en/site-policy/acceptable-use-policies/github-acceptable-use-policies) prohibit rank abuse, including automated starring or following. Never buy stars, exchange them or ask for coordinated votes.

Keep a dated search log: exact query, engine, returned source, rank when visible and access date. Track referrers and registry downloads as observations, including their collection limits and automation noise. A before/after change alone does not establish cause.

<!-- source:references/stages/06-release.md -->

# Release with trusted publishing

## GOAL

Release a tested artifact and verify the registry serves the same version and listing.

## NEEDS

Final facts, version sites, changelog, acceptance checks and CI; load the release contract plus the chosen registry card. Make the small missing prerequisite first.

## RE-CHECK

| Fact | Official source | Window |
|---|---|---|
| Trusted publishing and visibility requirements | The registry's official trusted-publisher documentation | 30 days |
| Runtime and CLI floors, attestation tooling | The registry's official requirements and tool release pages | 30 days |
| Registry processing and metadata behavior | The registry's official API and a dated package probe | 30 days |

Record each read in `.repo-build/work/sources.md` with claim, URL, source date, access date, window, expires and stage. Offline facts stay UNVERIFIED while work proceeds.

## DO

1. Read the contract and replace the route's npm card with PyPI, binaries, Workers or skills-and-plugins as appropriate, so registry-specific behavior stays in one card.
2. List every version site in RELEASING.md, bump them together and prepare dated changelog notes, because tags, manifests and installed links must agree.
3. Run the final acceptance checks and the repo's scoped suite on the release artifact; resolve findings from aun-cross-review or record WAIVED with owner, reason and date, so release evidence describes the final result.
4. Build or pack once, install and test that artifact in a clean consumer directory, then publish that same artifact, because rebuilding can change what was tested.
5. Check that the tag equals the manifest version before publication and keep `id-token: write` only in the publish job, so the workflow proves a narrow release identity.
6. Prepare the first publish and exact trusted-publisher identity for the owner; record the workflow filename and environment, because a trust record can require re-creation after a rename.
7. Use short-lived OIDC credentials where the registry offers them and provenance or artifact attestations where supported; for a deployment follow its scoped credential and rollback procedure, so credentials match the delivery mechanism.
8. Query the exact version and attestation through the registry after publishing, polling within a stated deadline when processing lags, because a successful workflow is only one part of delivery.
9. Compare the registry README, description, bin, funding and homepage to the release tag, create the release page and record immutable identifiers, so users get the documented artifact.
10. Record a terminal demo from the published version outside the checkout; include copy-only edits in the next release, because registry pages commonly come from the published artifact.

## READERS

| Reader | What they get |
|---|---|
| People | Changelog, release notes and a published-package demo. |
| Agents | A version-pinned install and artifact receipt. |
| Answer engines | Provenance or attestations with dated evidence. |
| Registries | One tested artifact, matching tag and listing parity. |

## OWNER'S HANDS

HANDS: perform the first publish and trust setup through the chosen card's exact command and settings URL. For npm, the prepared command is `npm publish <packed-file.tgz> --access public`; set the exact workflow in `https://www.npmjs.com/package/<package>/access`. Authorize any public flip before its command runs.

## LEAVE

Leave RELEASING.md, CHANGELOG.md, artifact checksum, tag and registry identifiers, query output and `.repo-build/work/receipts/06-release.json`. A release-ready claim requires zero FAIL, BLOCKED and UNVERIFIED rows; a waiver is printed with owner, reason and date.

## GATE

Rows begin BLOCKED. Attach actual output or a dated manual receipt before assigning PASS. Facts awaiting live reads stay UNVERIFIED. Record NOT APPLICABLE with a reason; WAIVED is reserved for review and venue gates with owner, reason and date.

<!-- gate:start -->
| Check | Reject condition | Evidence |
|---|---|---|
| R_VERSION | Unmet requirement: Manifest, lock and plugin versions equal package version. | R_VERSION: checker receipt, initially BLOCKED |
| R_FILES | Unmet requirement: A files allowlist covers binary targets and lifecycle install scripts are absent. | R_FILES: checker receipt, initially BLOCKED |
| W_OIDC | Unmet requirement: Only publish or a job using only Scorecard-allowed actions with ossf/scorecard-action publish_results: true declares id-token: write; these jobs run no install, build or package script. | W_OIDC: checker receipt, initially BLOCKED |
| W_TAG | Unmet requirement: A version comparison precedes the publish job or publish command. | W_TAG: checker receipt, initially BLOCKED |
| O_REGISTRY | Unmet requirement: Version, description, tagged README and attestation agree. | O_REGISTRY: checker receipt, initially BLOCKED |
| RL_FIRST (HANDS) | The first registry publish awaits owner action. | Registry version response. |
| RL_TRUST (HANDS) | Trusted publisher setup awaits owner action. | Exact workflow identity and trust read-back. |
| RL_REVIEW | Independent review is unresolved. | Review result or owner, reason and date for WAIVED. Status WAIVED needs owner, reason and date. |
<!-- gate:end -->

<!-- source:references/release/contract.md -->

# Release contract

Use this contract for every release path, then load the one card for the chosen destination. The AI prepares and verifies the release; the owner performs the public flip, first publish and trust setup.

## One release identity

List every version site before editing: package manifest, lockfile, plugin manifest, skill manifest and any generated version field. Change them together. The tag without its `v` prefix must equal the package version. Keep a changelog section that describes user-visible results and credits upstream work.

Build once, inspect the archive, install it in a clean project and test that artifact. Publish those exact bytes. Package an explicit allowlist, because a local build directory can hold private notes and unrelated output. Record hashes so a registry download can be compared with the tested artifact.

## Identity and permission

Prefer short-lived OIDC credentials from CI where the destination supports them. Grant identity and write permissions only to the publish job. Pin third-party actions to full commit SHAs with version comments. A platform that requires a scoped credential must use its narrow deployment route rather than a stored broad account token.

Make the repository public before a trusted publish when provenance depends on visibility. The trust record names the owner, repository, exact workflow filename and any environment. Re-create the trust record when its identity changes; a renamed workflow is a changed publisher.

## Verify the destination

Query the registry's own API or CLI after publishing. Verify version, archive identity, provenance or attestation where offered, README, description, entrypoints and links against the tag. Poll boundedly for propagation, record the result and leave a clear pending status when propagation is still unresolved. A green CI run alone cannot prove registry parity.

Capture a rollback or deprecation route before the owner publishes. For deployments, record the previous version id first and smoke-test the public URL afterward. For immutable registry versions, publish a corrected version and use the destination's documented deprecation procedure.

## Evidence and handoff

Each release card names mechanism, runtime and CLI floors, first publish, trust setup, workflow asset, verify command, version sites and gotchas. Read its official docs on the ask date and put source date, access date and expiry in the research ledger. Without a live read, continue preparation with the fact UNVERIFIED; a release-ready claim needs confirmed release facts and resolved gates.

Run aun-cross-review: one independent review by a different model family before release, or WAIVED with owner, reason and date. Hand the owner the exact publish command or settings URL, the tested artifact and the remaining manual checks.

<!-- source:references/release/npm.md -->

# npm release

**Evidence: MEASURED.** The trusted-publishing and provenance route has been exercised on public npm packages. Re-check [npm trusted publishers](https://docs.npmjs.com/trusted-publishers/) and [provenance](https://docs.npmjs.com/generating-provenance-statements/) on the ask date before applying it to a new package.

## Mechanism

GitHub Actions exchanges its OIDC identity for a short-lived npm publish credential. Publish the tested tarball with provenance. The repository and package metadata must identify the public source correctly.

## Runtime and CLI floors

The documented floor carried into this card is Node 22.14.0 and npm 11.5.1. Confirm current support on the ask date. Pin the exact npm version used by CI; the supplied asset pins npm 12.2.0. Read the runtime's current maintenance dates before choosing its line.

## First publish

The owner creates the initial package using `npm publish PACKAGE.tgz --access public` after the public flip and checks `npm view NAME@VERSION version --prefer-online`. A free name lookup is preliminary: npm similarity rules are enforced at publish time. Agree on a scoped fallback before the first attempt.

## Trust setup

The owner opens `https://www.npmjs.com/package/NAME/access` and adds the GitHub Actions trusted publisher with the exact repository, workflow filename and environment. Follow the registry's current settings route if it has moved. A publisher connection is re-created when its identity changes.

## Workflow asset

Adapt `assets/workflows/release-npm.yml`. The verify job (read-only token) checks tag/version equality, installs, tests, builds, packs once, installs that tarball in a temporary project and uploads it as an artifact. The publish job holds `id-token: write`, runs no install, build or package script, downloads the artifact and publishes that exact file with `npm publish ./release/PACKAGE.tgz --provenance --access public`.

## Verify command

```sh
npm view NAME@VERSION version dist.attestations --prefer-online
npm view NAME@VERSION description bin homepage repository funding --json
npm view NAME@VERSION readme
```

Compare the returned README and metadata to the release tag and save the attestation response. Test the published command outside the source checkout after propagation.

## Version sites

Update `package.json`, both version fields in `package-lock.json`, and any plugin or skill version fields the package ships. Require `vVERSION` to identify those values.

## Gotchas

A private repository cannot supply npm provenance through this route. A successful job can precede registry propagation. A copy-only correction still needs a release so the registry README catches up. Keep registry verification separate from CI status.

<!-- source:references/release/binaries.md -->

# Binary releases

**Evidence: DOCUMENTED.** Read [GitHub artifact attestations](https://docs.github.com/en/actions/security-for-github-actions/using-artifact-attestations) and the selected [Homebrew tap guidance](https://docs.brew.sh/How-to-Create-and-Maintain-a-Tap) on the ask date. Record live support and runtime requirements before acting.

## Mechanism

Build one archive for each supported operating system and architecture, test each artifact on its target, generate checksums and attest those bytes where supported. Publish them as assets on the matching GitHub release. A Homebrew tap is a separate distribution surface whose formula must point at those exact assets and hashes.

## Runtime and CLI floors

Use the compiler and target versions chosen on the stack card. Confirm current runner images, cross-compilation support, signing requirements and any system-library floor. Ask the owner about a compiled language outside the project's defaults before selecting it.

## First publish

The owner reviews assets, checksums, signing scope and rollback route before running `gh release create vVERSION --verify-tag --notes-file RELEASE_NOTES ASSET...`. Produce RELEASE_NOTES from the changelog. For a tap, prepare the formula and let the owner approve the repository or submission path.

## Trust setup

Use GitHub's workflow identity for artifact attestations where available. Limit `contents: write`, `attestations: write` and `id-token: write` to the jobs that need them. Keep signing credentials and platform notarization in their documented narrow trust route.

## Workflow asset

Use the release contract and the selected compiler's official packaging example. This pack's npm and PyPI assets demonstrate tag equality, artifact testing and narrow permissions; adapt those principles to the actual targets rather than renaming an incompatible workflow.

## Verify command

```sh
gh release view vVERSION --repo OWNER/NAME --json assets,tagName
gh release download vVERSION --repo OWNER/NAME --dir TRIAL_DIR
gh attestation verify TRIAL_DIR/ASSET --repo OWNER/NAME
```

Verify checksums, extract into an isolated directory and run the downloaded executable's advertised help or smoke test. For a tap run `brew audit --strict FORMULA` and test installation from that tap on a clean target.

## Version sites

List the language manifest, lockfile when versioned, embedded version string, release tag and tap formula version and checksums. Verify the executable reports the intended version.

## Gotchas

A cross-compiled artifact needs a target runtime test. Checksums establish byte equality; an attestation establishes a claimed build identity. Confirm both properties separately. Keep the previous assets available and document upgrades and rollback by version.

<!-- source:references/release/pypi.md -->

# PyPI release

**Evidence: DOCUMENTED.** Read [PyPI trusted publishing](https://docs.pypi.org/trusted-publishers/) and [its GitHub Actions guide](https://docs.pypi.org/trusted-publishers/using-a-publisher/) on the ask date. Record that read before acting; unread live facts remain UNVERIFIED.

## Mechanism

A configured publisher exchanges GitHub's short-lived OIDC identity for a short-lived upload credential. Build a wheel and source distribution once, check them, test the wheel in a clean environment and upload those exact distributions. Read the current attestation support and retain the registry's response.

## Runtime and CLI floors

Choose a supported Python runtime matching `requires-python`. The workflow asset reads TOML with the standard library, requiring Python 3.11 or later for that step. Its build tools are pinned to `build==1.3.0` and `twine==6.2.0`; re-check their supported runtimes and current PyPI requirements before release.

## First publish

The owner can configure a pending publisher at `https://pypi.org/manage/account/publishing/` before the project exists. Confirm the normalized project name and pending publisher fields, then authorize the first tagged workflow. Use TestPyPI for an isolated rehearsal with its own publisher record and destination.

## Trust setup

At the project's Publishing settings, the owner names the exact GitHub owner, repository, workflow filename and optional environment. Grant `id-token: write` only to the upload job. Keep the environment in CI and the trust record identical.

## Workflow asset

Adapt `assets/workflows/release-pypi.yml`. The verify job (read-only token) checks tag/version equality, runs tests, builds distributions, runs `twine check`, installs the wheel in an isolated environment and uploads the distributions as an artifact. The publish job holds `id-token: write`, installs and builds nothing, downloads the artifact into `dist/` and runs only PyPA's official trusted-publishing action, pinned to a full SHA, with `packages-dir: dist/`. Add the package's real entrypoint smoke test to the artifact check.

## Verify command

```sh
curl --fail https://pypi.org/pypi/NAME/VERSION/json
python -m pip index versions NAME
uvx --from NAME==VERSION COMMAND --help
```

Read returned version, URLs, hashes and metadata; compare the registry README to the tag. Replace COMMAND with the declared console script, or test an import for a library. Use an isolated installation for the verification.

## Version sites

List `pyproject.toml`, the package's version source if separate, lock metadata and generated distribution metadata. Confirm the wheel's installed version equals the tag.

## Gotchas

PyPI and TestPyPI identities are distinct. A rejected or reused version needs the documented correction route, typically a new version. Dependency resolution can hide a broken wheel, so inspect distribution contents as well as testing the source tree.

<!-- source:references/release/skills-and-plugins.md -->

# Skills and plugins release

**Evidence: MEASURED for `claude plugin validate --strict .`; `npx skills add` is awaiting a real-client trial.** Run the loading check on the user's host and record the result alongside its client version and date.

## Mechanism

Ship the canonical skill folder with SKILL.md, relative references and assets. A plugin adds its host's manifest and marketplace metadata. A directory listing points at a public release; validation and loading are separate checks.

## Runtime and CLI floors

Read the [Agent Skills specification](https://agentskills.io/specification), [Claude Code plugins guide](https://code.claude.com/docs/en/plugins) and [skills CLI documentation](https://github.com/vercel-labs/skills) on the ask date. Record the selected host version and the runtime required by its installer. Use the host adapter for target paths.

## First publish

The owner makes the repository or archive public after privacy checks. Prepare the plugin submission at `https://platform.claude.com/plugins/submit`; the owner reviews its terms and submits. For a skill directory, follow its current listing rules and verify the public listing afterward.

## Trust setup

Pin a release tag or commit in reproducible install instructions where the host supports it. Verify the manifest source, package contents and requested permissions. Host approval and marketplace review are distinct from local validation.

## Workflow asset

Run the pack's check workflow plus the selected host's validator. Generate bundles from the canonical folder and enforce hash and size checks. Retain the full reference tree so relative links resolve after installation.

## Verify command

```sh
claude plugin validate --strict .
npx skills add OWNER/NAME
```

Run the skills CLI in a disposable project with the intended host selected. Ask that host to load the skill, identify its SKILL.md path and follow the first stage on a synthetic brief. Record the actual action observed. File installation alone leaves activation UNVERIFIED.

## Version sites

List package version, skill manifest version, SKILL.md metadata.version, plugin manifest version and any marketplace manifest version. A marketplace archive and repository tag must identify the same content.

## Gotchas

A validator can accept a manifest while a host loads a different folder. Chat upload needs a complete generated bundle, while a native skill needs relative files intact. Keep installation roles tied to the user's own tools; point to third-party tools' instructions rather than installing them.

<!-- source:references/release/workers.md -->

# Cloudflare Workers release

**Evidence: DOCUMENTED.** Read [Workers CI/CD](https://developers.cloudflare.com/workers/ci-cd/external-cicd/) and [versions and deployments](https://developers.cloudflare.com/workers/configuration/versions-and-deployments/) on the ask date. Record the current credential route, CLI requirements and rollback behavior before acting.

## Mechanism

A Worker is a deployed service. Build and test a version, record the current deployment id, upload the prepared bundle and promote that exact version. Smoke-test the public route and record its deployed identity. Separate infrastructure changes from application deployment when rollback behavior differs.

## Runtime and CLI floors

Pin the Wrangler version and a supported Node line. Set a deliberate compatibility date and required flags. Read current binding APIs, limits and migration behavior for the Worker in scope; do not infer them from a different service's deployment.

## First publish

The owner selects the account, service, routes, billing limits and bindings. Prepare `npx wrangler deploy --dry-run --outdir DIST` and test the bundle before handing over the approved deploy command. Record the service's current version first so rollback has a concrete target.

## Trust setup

Use the platform's documented CI integration or a narrowly scoped Cloudflare API token injected by the CI secret store. This credential route differs from registry OIDC exchange. Scope it to the intended account and deployment resources, keep it out of command arguments and logs, and record rotation ownership.

## Workflow asset

Create a Worker-specific workflow from the current Cloudflare documentation. Keep build/test and promotion explicit, retain artifact identity across jobs and grant only the permissions required for the chosen credential route. The npm registry upload asset is a reference for structure; this destination needs its own deployment steps.

## Verify command

```sh
npx wrangler deployments list
npx wrangler versions list
curl --fail https://PUBLIC_HOST/HEALTH_PATH
```

Replace the host and health path with an actual route. Compare the returned deployment to the intended version and save the smoke-test response. Use `npx wrangler rollback VERSION_ID` only after the owner approves the recorded rollback target and its effects.

## Version sites

List package version, Worker configuration, compatibility date, deployed version id, route mapping and release tag. Treat binding migrations as separate state with their own verification and rollback limits.

## Gotchas

A dry run proves bundle construction, not a live route. A successful promotion still needs public behavior verification. Record any storage migration that a code rollback cannot reverse. Keep secrets in bindings or the approved CI store.

<!-- source:references/stages/07-site.md -->

# Product site

## GOAL

Prepare the minimum site brief and hand website construction to its owning method.

## NEEDS

Facts, release or planned release, proof rows and stable documentation URLs. Make the small missing prerequisite first.

## RE-CHECK

| Fact | Official source | Window |
|---|---|---|
| SoftwareApplication properties | [Schema.org SoftwareApplication](https://schema.org/SoftwareApplication) | 90 days |
| Search Console and Bing verification | [Search Console](https://search.google.com/search-console/about) and [Bing Webmaster Tools](https://www.bing.com/webmasters/about) | 90 days |
| IndexNow submission and discovery files | [IndexNow documentation](https://www.indexnow.org/documentation) | 90 days |

Record each read in `.repo-build/work/sources.md` with claim, URL, source date, access date, window, expires and stage. Offline facts stay UNVERIFIED while work proceeds.

## DO

1. Decide with the owner when a product site serves users and record the release it belongs to, so site scope follows the product.
2. Prepare the per-reader minimum: clear lead, install command, current proof and links to docs, because a landing page should move a visitor into real use.
3. Pass `.repo-build/facts.json` as the brief to website-build-skill when installed, so the website method owns design and implementation.
4. Otherwise reference that project's release-tagged SEO/AEO and structured-data documents below, so the repo method links to maintained guidance instead of duplicating it.
5. Specify SoftwareApplication JSON-LD with name, description, URL, application category, operating system, software version, license and author linked to one Person entity, so structured data agrees with the visible product.
6. Include canonical URLs, sitemap, robots rules, llms.txt and a documentation mirror plan, because crawlers and agents need stable paths.
7. Offer Search Console, Bing Webmaster and IndexNow verification steps to the owner; label claims about downstream answer-engine use REPORTED, because a submission supplies discovery rather than a ranking promise.
8. Update repository and registry homepage fields together after the site is live and test its install and docs links, so every product entry reaches the same current destination.

Choose the installed website-build-skill's manifest release tag for reference links. The public reference entry points are [SEO and AEO](https://github.com/aunysillyme/website-build-skill/blob/v0.1.20/skills/website-build-skill/prompts/08-seo-aeo.md) and [structured data and llms.txt](https://github.com/aunysillyme/website-build-skill/blob/v0.1.20/skills/website-build-skill/playbooks/structured-data-and-llms.md). Read their availability and selected release before relying on them.

## READERS

| Reader | What they get |
|---|---|
| People | A landing page with install line and current proof. |
| Agents | A docs mirror and llms.txt. |
| Answer engines | SoftwareApplication data and an explicit author entity. |
| Registries | A homepage that resolves to the product. |

## OWNER'S HANDS

HANDS: approve the site scope, domain and publication. Complete verification at `https://search.google.com/search-console` and `https://www.bing.com/webmasters/`. A Wikidata item is a REPORTED option for the owner to assess against `https://www.wikidata.org/wiki/Wikidata:Notability`.

## LEAVE

Leave `.repo-build/work/site-brief.md` with facts path, owner decision, website-method handoff, domain, structured-data fields, discovery files and verification status; `.repo-build/work/receipts/07-site.json`. A deferred site is NOT APPLICABLE with its owner-approved reason.

## GATE

Rows begin BLOCKED. Attach actual output or a dated manual receipt before assigning PASS. Facts awaiting live reads stay UNVERIFIED. Record NOT APPLICABLE with a reason; WAIVED is reserved for review and venue gates with owner, reason and date.

<!-- gate:start -->
| Check | Reject condition | Evidence |
|---|---|---|

<!-- gate:end -->

<!-- source:references/stages/08-launch.md -->

# Launch venues

## GOAL

Prepare venue-specific submissions with current gates and a dated follow-up.

## NEEDS

Facts, public release status, install proof, a demo and a distribution sketch; load `references/launch-venues.md`. Make the small missing prerequisite first.

## RE-CHECK

| Fact | Official source | Window |
|---|---|---|
| Venue eligibility, rules and liveness | Each venue's own submission page, CONTRIBUTING file and recent accepted entries | 14 days |
| Listing asset and validation requirements | Each marketplace's official submission documentation | 14 days |

Record each read in `.repo-build/work/sources.md` with claim, URL, source date, access date, window, expires and stage. Offline facts stay UNVERIFIED while work proceeds.

## DO

1. Choose venues where the intended user already looks for this category, because category fit matters more than a long submission list.
2. Create one card per venue with gate, cost, liveness date, who submits, one-at-a-time rules and follow-up date, so eligibility and next action are explicit.
3. Read each venue's own rules and recent accepted submissions before drafting, because an old list can preserve a closed or changed venue.
4. Check age, activity, license, cost and author participation against evidence; retain the exact qualifying date when a gate uses time, so a scheduled submission is justified.
5. Draft a plain factual title and description with the real install line and useful demo; tailor them to the venue, because a link drop rarely answers its audience's questions.
6. Prepare the complete marketplace listing before submission: required logo, captured demo, trailer when required, setup instructions and checked claims, so the first review sees the usable product.
7. Queue one-at-a-time venues across the owner's projects and mark the maker's submission HANDS, so overlapping recommendations respect the venue's rule.
8. Save submitted URLs, dates and follow-up dates in the launch ledger; inspect closed or unanswered submissions on that date, because closure can happen without a notification.
9. Record referrers, installs, feedback and dated search observations after launch; distinguish these observations from package measurements, so attention is reported honestly.

## READERS

| Reader | What they get |
|---|---|
| People | Venue-specific drafts, a real demo and a clear install line. |
| Agents | Accurate skill-directory and plugin listings. |
| Answer engines | Relevant curated pages and consistent entity links. |
| Registries | Complete listing fields and checked public metadata. |

## OWNER'S HANDS

HANDS: the owner submits as themselves. Use the exact URL in each venue card, such as `https://news.ycombinator.com/submit` for an eligible Show HN, `https://platform.claude.com/plugins/submit` for a validated Claude plugin, or the list's current human-filed issue form. Confirm any fee before payment.

## LEAVE

Leave `.repo-build/work/launch-ledger.md` with every card, draft, eligibility result, submission URL, owner and follow-up date; `.repo-build/work/receipts/08-launch.json`. Venue waivers carry owner, reason and date. Listing submission remains a separate HANDS row.

## GATE

Rows begin BLOCKED. Attach actual output or a dated manual receipt before assigning PASS. Facts awaiting live reads stay UNVERIFIED. Record NOT APPLICABLE with a reason; WAIVED is reserved for review and venue gates with owner, reason and date.

<!-- gate:start -->
| Check | Reject condition | Evidence |
|---|---|---|
| LA_VENUE (HANDS) | Venue submissions await owner action. | Submission URL or owner, reason and date for WAIVED. Status WAIVED needs owner, reason and date. |
| LA_LISTING (HANDS) | Marketplace listing awaits owner submission. | Complete listing and submission receipt. |
<!-- gate:end -->

<!-- source:references/launch-venues.md -->

# Launch venues

Choose venues by category fit and current rules. The owner submits; the AI prepares factual drafts, a real demo and the follow-up plan. Re-read each venue's rules and recent accepted submissions within 14 days of posting.

## Venue card

Keep one card per candidate in `.repo-build/work/launch-ledger.md`:

| Field | Record |
|---|---|
| Venue and URL | Public rules, submission path and category |
| Gate | Required age, content, format, licence or validation |
| Cost | Current listing charge and optional promotion, separately |
| Liveness date | Date checked, recent accepted example and source |
| Who submits | Owner; name the final action and exact URL |
| One-at-a-time rules | Per-account queue, duplicate and repost constraints |
| Follow-up date | Calendar date to check the result and reply |
| Evidence | Draft, submission URL, outcome and next action |

A submission receipt is evidence of submission. Acceptance needs its own public read-back. Check a closed issue's reason before treating it as accepted. Review and venue gates can be WAIVED with owner, reason and date; retain that status in the receipt.

## Dated public starter list

Prepared 2026-10-18. These are research starting points; liveness and current cost are UNVERIFIED until read on the run's ask date. Use the linked public rules to complete the card before recommending a submission.

| Venue | Gate to read | Cost to confirm | Submitter and queue | Liveness / follow-up |
|---|---|---|---|---|
| [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code/blob/main/CONTRIBUTING.md) | Category fit, age or adoption requirement, factual description and human-filed recommendation form | Free listing route | Owner uses the linked issue form; check one recommendation at a time and wait for disposition | UNVERIFIED; record ask-date check and follow-up date |
| [Claude community plugins](https://platform.claude.com/plugins/submit) | Current plugin validator, safety review and submission terms | Confirm listing terms | Owner submits after `claude plugin validate --strict .`; inspect active submissions before another | UNVERIFIED; record ask-date check and follow-up date |
| [skills.sh](https://skills.sh/) | Public skill layout, actual installation and directory indexing rules | Confirm current terms | Verify listing after a real `npx skills add OWNER/NAME` trial; read whether a submission action exists | UNVERIFIED; record ask-date check and follow-up date |
| [Show HN](https://news.ycombinator.com/showhn.html) | Runnable project, useful demonstration and author available to discuss | Confirm current terms | Owner posts one project; read repost and voting rules | UNVERIFIED; record ask-date check and follow-up date |
| [DEV](https://dev.to/terms) | Substantial useful article with a real method or measured result | Confirm current terms | Owner posts; avoid duplicate link drops and answer comments | UNVERIFIED; record ask-date check and follow-up date |
| [r/ClaudeCode](https://www.reddit.com/r/ClaudeCode/about/rules/) | Current showcase thread, disclosure and posting format | Confirm current terms | Owner posts; read per-thread project and update rules | UNVERIFIED; record ask-date check and follow-up date |
| [Agensi](https://www.agensi.io/) | Complete skill listing, permissions, real demo, logo, archive and review terms | Owner sets price after reading current fees | Owner submits; finish one draft before starting another when the UI requires it | UNVERIFIED; record ask-date check and follow-up date |

## Complete the listing first

Upload the final archive before checking auto-filled copy. Compare every claim, permission, requirement and compatibility line with the release. Check that the demo video plays from a signed-out browser and the docs URL resolves. A paid listing's price, terms and publication remain the owner's decision.

Use the same accurate lead and description across listings. Adapt the explanation to the venue's readers. Record a follow-up for every post and a later dated search/referrer check. Keep personal posting history and private account information out of public artifacts.

<!-- source:references/stages/09-maintain.md -->

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

<!-- source:references/readers/registries.md -->

# Registries

A registry reads the built artifact and its metadata. A repository's default branch can look correct while the published listing still describes a different version.

## Metadata contract

Set name, version, description, licence, repository and homepage in the package manifest. Set the runtime floor and actual entrypoints. For npm, check `bin`, `exports`, `files` and keywords; for Python, check `requires-python`, scripts, URLs and distribution contents. Put optional funding and support links where the registry accepts them.

Use facts as the shared source for public copy. A topic should describe a real capability; include the same term in package keywords when it fits. The tagged README is the listing source. Refresh it as part of a release, including a copy-only correction, so installs and registry pages tell the same story.

## Artifact check

1. List every version site before changing versions, because a tag must identify one release.
2. Build once and inspect the resulting archive, because source tests cannot prove what ships.
3. Install that archive in a clean project and run its advertised entrypoint, because a local workspace can hide omitted files.
4. Publish that exact artifact after the owner completes initial trust setup.
5. Query the registry's own version, metadata and provenance response, because a successful CI job is only part of the evidence.

For npm, use `npm pack --dry-run --json` to inspect the allowlist and `npm view NAME@VERSION version dist.attestations --prefer-online` to read the published release. Compare description, README, homepage, repository, entrypoints and funding against the tag. Use the selected release card for other registries.

## Continuing parity

Run aun-repo-health weekly to compare public metadata, generated discovery files, homepage response and vendored set lock. A maintainer refreshes set data deliberately; CI checks the vendored copy offline. Keep one issue for current drift and close it after evidence shows parity.

Refresh measurements before their expiry. Expired proof warns and leaves current promotional copy; it keeps the software runnable and updateable. Mark a registry read UNVERIFIED when network access fails, and retain the command for a later probe.

<!-- source:references/workflows.md -->

# Workflow assets

Copy these assets into `.github/workflows/` and adapt project commands before running them.
`assets/workflows/check-minimal.yml` runs the repository checks; `assets/workflows/repo-health.yml` checks public metadata parity.
The release cards explain `release-npm.yml` and `release-pypi.yml`.

## Scorecard

Add `assets/workflows/scorecard.yml` to every repository during scaffolding. It grades repository security posture weekly and on push to `main`, publishes the score to the Scorecard API and uploads SARIF to GitHub code scanning. It fixes nothing; review the findings and make changes separately.

Add this README badge, replacing `{owner}` and `{repo}`:

```md
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/{owner}/{repo}/badge)](https://scorecard.dev/viewer/?uri=github.com/{owner}/{repo})
```

Publishing requires read-only workflow permissions, an Ubuntu runner and `id-token: write` only in the Scorecard job. Keep top-level `env` and `defaults`, job-level `env` and containers absent. Every action in that job must be one of `actions/checkout`, `actions/upload-artifact`, `github/codeql-action/upload-sarif`, `ossf/scorecard-action` or `step-security/harden-runner`. Set `publish_results: true` on the Scorecard step. The API supports only the default branch; adapt `main` to that branch when needed.

Private repositories need GitHub Advanced Security for the code-scanning upload; otherwise run the `scorecard` CLI.
Re-check the [upstream reference workflow](https://github.com/ossf/scorecard/blob/main/.github/workflows/scorecard.yml) and [Scorecard action publishing restrictions](https://github.com/ossf/scorecard-action#publishing-results) before adapting the pins or permissions. The supplied reference and restrictions are dated 2026-10-27; live verification remains UNVERIFIED in this offline change.
