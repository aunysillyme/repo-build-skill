# repo-build-skill

[![npm version](https://img.shields.io/npm/v/repo-build-skill)](https://www.npmjs.com/package/repo-build-skill) [![Repository checks](https://github.com/aunysillyme/repo-build-skill/actions/workflows/check.yml/badge.svg)](https://github.com/aunysillyme/repo-build-skill/actions/workflows/check.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**A skill pack that teaches your AI to build, release and launch a repo that people, coding agents and AI search can all read. Your AI does the work.**

The problem: people, coding agents and AI search each read different files, so a repo that works can still go unfound.

What you get: one flow from first idea to launch day, nine stages, each with a gate.

What you can do: ask your AI to frame a new repo, bring an existing one to its first release, or plan a launch, then check the result.

`npx repo-build-skill`

## What your AI learns

| Stage | What your AI learns | What each reader gets |
|---|---|---|
| Frame | Define the problem, audience and acceptance checks. | A clear first screen and a name checked for the registry. |
| Stack card | Choose from the install path and measured budgets. | A short install and explicit runtime requirements. |
| Scaffold | Put the professional floor and safe workflows in place. | Contribution, security and maintenance routes. |
| README / AGENTS.md / llms.txt | Write from one source of facts. | A front page, agent commands and linked context. |
| SEO and AEO for repos | Connect repo metadata and answer common searches. | A consistent name, useful answers and discovery links. |
| Release with trusted publishing | Test the packed artifact and verify the registry. | A versioned install and provenance where offered. |
| Product site | Specify the discovery minimum and hand off the site. | An install page, entity links and indexed docs. |
| Launch venues | Check venue rules and prepare complete submissions. | Dated listings and a useful demo. |
| Maintenance | Refresh proof and compare public surfaces. | Current instructions, package listings and support routes. |

The stage table holds the trailer slot while the owner reviews a real demo and keyframes.
Read the [method](docs/METHOD.md) for stage inputs, outputs and gate statuses.

## Who reads a repo

| Reader | Starts with | Needs |
|---|---|---|
| People | README and About | The problem, the install command and a real result. |
| Agents | AGENTS.md and the installed skill | Commands that run, stage inputs and a gate. |
| AI search | Description, headings and llms.txt | Direct answers and labelled source links. |
| Registries | Package manifest and the published artifact | Matching versions, metadata and provenance. |

Each reader gets a useful entrance to the same project.
The facts file keeps the product name, description and install line together.

## After you install

Choose your host, review the preview and confirm the install.
Then give your AI this first prompt:

> Read repo-build-skill. Prepare this repository for its first public release. Run the checker, start at the earliest failing stage, and leave a receipt for each stage. Prepare the owner's actions for review.

For a new project, ask it to start at Frame and write the stack card before the first commit.
For an existing project, ask it to run `repo-build-skill check . --json` first.
For a launch plan, ask it to start at Launch venues and read the facts it needs.

This repo has a [self-application run](docs/showcase/self/README.md).
Its stage receipts group actual checker results and keep manual release actions visible.
Reproduce that run with `node scripts/showcase.mjs` from a checkout.

The [installation guide](docs/install.md) gives headless commands and manual copy routes.
The [compatibility page](docs/COMPATIBILITY.md) links each host's loading check.

<!-- set:start -->
## Part of a set

| Repo | What it gives you |
|---|---|
| [agent-personalizer](https://github.com/aunysillyme/agent-personalizer) | AI custom instructions from approved entries: a profile and rules for Claude Code, Codex, Cursor, Gemini CLI and ChatGPT, kept in sync from one source. |
| [model-orchestrator](https://github.com/aunysillyme/model-orchestrator) | Model router for AI coding agents: routes routine work to cheaper models with routing rules, 8 subagents, hooks and a CLI runner |
| [website-build-skill](https://github.com/aunysillyme/website-build-skill) | A skill pack that turns your AI into an expert website builder: current research, design, code, accessibility, speed, SEO and security, alone or as a team. |
<!-- set:end -->

## Check any repo

Run the read-only checker in the repository you want to inspect:

```sh
npx repo-build-skill check .
npx repo-build-skill check . --json
npx repo-build-skill explain W_PIN
```

Use `check path/to/repo` to inspect another directory.
The result explains what failed, why it matters and the stage that teaches the fix.

| Group | What it checks |
|---|---|
| People | Lead, install, links, questions and community files. |
| Agents | Instruction sources, commands and skill metadata. |
| Answer engines | llms.txt shape, definition and entity name. |
| Registries | Description, topics, metadata, versions and package files. |
| Workflows | Permissions, pins, credentials, event input and tag checks. |
| Privacy | Home paths, emails, token shapes and private term lists. |
| Proof | Reproduction commands, dates, expiry and package scope. |
| Credits | Linked projects, licences and the technique used. |
| Set | Generated set blocks and the vendored renderer. |
| Online | About, registry parity and private security reporting. |

`--online` requests live checks.
`--strict` treats a skipped check as incomplete.
`--house` raises the marked house conventions to errors.
`--history` also inspects committed content, messages and tags for privacy.

See [checker configuration and exit codes](docs/CHECKER.md) and the [generated rule reference](docs/RULES.md).
The checker reports observations; your AI applies the method and makes changes.

## Release paths

Choose the card for the artifact your users install.
Each path shares the [release contract](skills/repo-build-skill/references/release/contract.md).

| Path | Evidence level | What the card teaches |
|---|---|---|
| [npm](skills/repo-build-skill/references/release/npm.md) | MEASURED | First publish, trusted publisher, packed trial and registry read-back. |
| [PyPI](skills/repo-build-skill/references/release/pypi.md) | DOCUMENTED; read on the ask date | First publish, trust identity and wheel verification. |
| [Binaries](skills/repo-build-skill/references/release/binaries.md) | DOCUMENTED; read on the ask date | Release artifacts, checksums, attestations and platform trials. |
| [Workers](skills/repo-build-skill/references/release/workers.md) | DOCUMENTED; read on the ask date | Versioned deployment, scoped credentials and rollback. |
| [Skills and plugins](skills/repo-build-skill/references/release/skills-and-plugins.md) | MEASURED for plugin validation | Validate with `claude plugin validate --strict`; the skills CLI route awaits its trial. |

First publish, trust setup, the public flip and venue submissions are owner's actions.
The AI prepares exact steps and evidence for those actions.
Read [release paths](docs/RELEASE-PATHS.md) for the card fields and source policy.

## What is measured

Package measurements live in [proof/results.json](proof/results.json).
Each row carries its command, measurement date, expiry and package version.

| Measurement | Value | Measured | Expires |
|---|---|---|---|
| packed-size | 137713 bytes | 2026-10-19 | 2027-01-17 |
| unpacked-size | 439259 bytes | 2026-10-19 | 2027-01-17 |
| help-time | 31.6 ms | 2026-10-19 | 2027-01-17 |
| checker-time | 30.3 ms | 2026-10-19 | 2027-01-17 |

Run `npm run proof` to refresh deterministic package measurements.
Show current rows here; expired rows warn while work and releases continue.
Outcome studies use [OUT-1, OUT-2 and the no-web control](docs/EVALUATION.md).
Their dated rows enter this table when those runs are measured.

## Common questions

### How do I make my GitHub repo show up in Google and AI search?

Ask your AI to run the Discover stage, then run `npx repo-build-skill check . --online` to compare the public surfaces.
Use a clear description, useful question headings, matching metadata and listings people can actually use.

### What goes in AGENTS.md and llms.txt for a repo?

AGENTS.md gives use and contribution commands; llms.txt gives a definition and labelled absolute links to the right docs.
Run `npx repo-build-skill check . --json` and let your AI apply the Write stage to each finding.

### How do I publish to npm or PyPI with trusted publishing?

Ask your AI to apply the release contract and the matching registry card, then run `npx repo-build-skill explain W_OIDC` to inspect the CI credential rule.
The owner completes the first publish and trust setup; CI publishes the tested artifact and the registry query confirms it landed.

### Which language should my CLI use?

Start with the runtime your users already have and the install command they expect, then record budgets in the stack card.
Run `npx repo-build-skill check .` after your AI prepares that card and the repo files.

### Where do I launch an open-source developer tool?

Ask your AI to use Launch venues, check each venue's current rules and give every submission a follow-up date.
Run `npx repo-build-skill check .` before the owner submits the finished listing, and add `--strict` once a private list is in place.

### How is it different from website-build-skill?

repo-build-skill teaches repository structure, metadata, publishing and launch; website-build-skill teaches website work.
Use `npx repo-build-skill` for this pack and hand the Product site brief to website-build-skill when your repo needs a site.

## Uninstall

`npx repo-build-skill --uninstall`

Choose the host and scope used for installation, review the preview and confirm.
The installer removes owned files whose current hashes match their install receipts.
Edited files and pre-existing identical files stay in place.
For a headless example, see the [installer contract](docs/INSTALLER.md#uninstall).

## For agents

Start with [llms.txt](llms.txt) for linked context and [AGENTS.md](AGENTS.md) for contribution commands.
Load [SKILL.md](skills/repo-build-skill/SKILL.md) and only the current stage's route.
Use `repo-build-skill check . --json` for structured findings.
Keep working state in the user's `.repo-build/work/` directory.

## Read next

- [Docs index](docs/README.md): choose a task.
- [Method](docs/METHOD.md): stages, readers and evidence.
- [Install](docs/install.md): commands and host targets.
- [Checker](docs/CHECKER.md): configuration and result meanings.
- [Evaluation](docs/EVALUATION.md): reproduce outcome runs.
- [Release operations](RELEASING.md): release and maintenance workflows.

## Contributing

Bring a host adapter, a rule with RED and GREEN fixtures, a registry card or a reproducible false positive.
Read [CONTRIBUTING.md](CONTRIBUTING.md) and the [CLA](CLA.md) before opening a pull request.

## Credits

[CREDITS.md](CREDITS.md) names the public projects, their licences and the files that use each technique.
[Provenance](docs/PROVENANCE.md) explains the adaptations.

## License

[MIT](LICENSE), copyright Auny LLC and contributors.
