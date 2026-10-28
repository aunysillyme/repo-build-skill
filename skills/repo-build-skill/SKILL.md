---
name: repo-build-skill
description: "Teaches you to frame, pick a stack for, scaffold, write, release and launch a software repository for people, coding agents and AI search. Use for a new repo, an existing repo's first release, README, AGENTS.md or llms.txt, repo SEO or AEO, npm or PyPI trusted publishing, a product page or a launch plan. For one task, load only that stage."
license: MIT
compatibility: "Web access for each stage's live re-check; without it the work proceeds and marks those facts UNVERIFIED."
metadata:
  version: "0.1.3"
---

# Repository build skill

## When invoked

This pack teaches your AI the method. Your AI does the work.

1. Record the ask date using [ask-date.md](references/ask-date.md). Keep it fixed for this request.
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
