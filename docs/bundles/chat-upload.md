# repo-build-skill chat bundle

Paths in source sections resolve from the named skill asset.

<!-- source:SKILL.md -->

---
name: repo-build-skill
description: "Teaches you to frame, pick a stack for, scaffold, write, release and launch a software repository for people, coding agents and AI search. Use for a new repo, an existing repo's first release, README, AGENTS.md or llms.txt, repo SEO or AEO, npm or PyPI trusted publishing, a product page or a launch plan. For one task, load only that stage."
license: MIT
compatibility: "Web access for each stage's live re-check; without it the work proceeds and marks those facts UNVERIFIED."
metadata:
  version: "0.1.0"
---

# Repository build skill

## When invoked

This section will hold the invocation steps for the selected stage.

## Routes

This section will hold the nine-stage route table.

## Working rules

This section will hold the facts, evidence and review rules.

## State

This section will name the files kept in the user's repository.

<!-- source:references/ask-date.md -->

# Ask date

This card will hold the steps and evidence for ask date.

<!-- source:references/stages/01-frame.md -->

# Frame

## GOAL

This section will hold the goal instructions for this stage.

## NEEDS

This section will hold the needs instructions for this stage.

## RE-CHECK

This section will hold the re-check instructions for this stage.

## DO

This section will hold the do instructions for this stage.

## READERS

This section will hold the readers instructions for this stage.

## OWNER'S HANDS

This section will hold the owner's hands instructions for this stage.

## LEAVE

This section will hold the leave instructions for this stage.

## GATE

<!-- gate:start -->
| Check | Reject condition | Evidence |
|---|---|---|
| H_LEAD | Unmet requirement: A bold lead in the first ten lines equals facts.lead. | H_LEAD: checker receipt, initially BLOCKED |
| FR_ACCEPTANCE | Acceptance checks lack verifiers. | Owner quotes and command output. |
<!-- gate:end -->

<!-- source:references/readers/people.md -->

# People

This card will hold the steps and evidence for people.

<!-- source:references/acceptance-checks.md -->

# Acceptance checks

This card will hold the steps and evidence for acceptance checks.

<!-- source:references/stages/02-stack.md -->

# Stack card

## GOAL

This section will hold the goal instructions for this stage.

## NEEDS

This section will hold the needs instructions for this stage.

## RE-CHECK

This section will hold the re-check instructions for this stage.

## DO

This section will hold the do instructions for this stage.

## READERS

This section will hold the readers instructions for this stage.

## OWNER'S HANDS

This section will hold the owner's hands instructions for this stage.

## LEAVE

This section will hold the leave instructions for this stage.

## GATE

<!-- gate:start -->
| Check | Reject condition | Evidence |
|---|---|---|
| H_UNINSTALL | Unmet requirement: An installer has an uninstall command in README. | H_UNINSTALL: checker receipt, initially BLOCKED |
<!-- gate:end -->

<!-- source:assets/stack-card.md -->

# Stack card

This template will hold the fields for stack card.

<!-- source:references/installer.md -->

# Installer

This card will hold the steps and evidence for installer.

<!-- source:references/stages/03-scaffold.md -->

# Scaffold

## GOAL

This section will hold the goal instructions for this stage.

## NEEDS

This section will hold the needs instructions for this stage.

## RE-CHECK

This section will hold the re-check instructions for this stage.

## DO

This section will hold the do instructions for this stage.

## READERS

This section will hold the readers instructions for this stage.

## OWNER'S HANDS

This section will hold the owner's hands instructions for this stage.

## LEAVE

This section will hold the leave instructions for this stage.

## GATE

<!-- gate:start -->
| Check | Reject condition | Evidence |
|---|---|---|
| H_FLOOR | Unmet requirement: Every floor file, issue form and check workflow is present and non-empty. | H_FLOOR: checker receipt, initially BLOCKED |
| A_SKILL_SPEC | Unmet requirement: Each SKILL.md has a valid name, description and size. | A_SKILL_SPEC: checker receipt, initially BLOCKED |
| R_META | Unmet requirement: Homepage, repository, bugs and license fields are present. | R_META: checker receipt, initially BLOCKED |
| W_PERMS | Unmet requirement: Every workflow declares read-only or empty default permissions. | W_PERMS: checker receipt, initially BLOCKED |
| W_PIN | Unmet requirement: Every remote action uses forty hex characters and a version comment. | W_PIN: checker receipt, initially BLOCKED |
| W_CREDS | Unmet requirement: Each checkout step sets persist-credentials: false. | W_CREDS: checker receipt, initially BLOCKED |
| W_INJECT | Unmet requirement: No github.event interpolation appears in run values. | W_INJECT: checker receipt, initially BLOCKED |
| P_PATH | Unmet requirement: Home paths use placeholder usernames in contents and filenames. | P_PATH: checker receipt, initially BLOCKED |
| P_EMAIL | Unmet requirement: Email addresses are in the allowlist or a standard example or noreply domain. | P_EMAIL: checker receipt, initially BLOCKED |
| P_TOKEN | Unmet requirement: Token-shaped strings and private key headers are absent. | P_TOKEN: checker receipt, initially BLOCKED |
| P_LIST | Unmet requirement: Untracked list files contain no matches in the public tree or history. | P_LIST: checker receipt, initially BLOCKED |
| O_PVR | Unmet requirement: Public GitHub repositories enable private vulnerability reporting. | O_PVR: checker receipt, initially BLOCKED |
| SC_PUBLIC (HANDS) | The public flip settings await owner action. | Dated public settings read-back. |
<!-- gate:end -->

<!-- source:assets/github/SECURITY.md -->

# Security policy

This template will hold the fields for security policy.

<!-- source:assets/github/CONTRIBUTING.md -->

# Contributing

This template will hold the fields for contributing.

<!-- source:references/stages/04-write.md -->

# README / AGENTS.md / llms.txt

## GOAL

This section will hold the goal instructions for this stage.

## NEEDS

This section will hold the needs instructions for this stage.

## RE-CHECK

This section will hold the re-check instructions for this stage.

## DO

This section will hold the do instructions for this stage.

## READERS

This section will hold the readers instructions for this stage.

## OWNER'S HANDS

This section will hold the owner's hands instructions for this stage.

## LEAVE

This section will hold the leave instructions for this stage.

## GATE

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

# Agents

This card will hold the steps and evidence for agents.

<!-- source:references/readers/answer-engines.md -->

# Answer Engines

This card will hold the steps and evidence for answer engines.

<!-- source:references/stages/05-discover.md -->

# SEO and AEO for repos

## GOAL

This section will hold the goal instructions for this stage.

## NEEDS

This section will hold the needs instructions for this stage.

## RE-CHECK

This section will hold the re-check instructions for this stage.

## DO

This section will hold the do instructions for this stage.

## READERS

This section will hold the readers instructions for this stage.

## OWNER'S HANDS

This section will hold the owner's hands instructions for this stage.

## LEAVE

This section will hold the leave instructions for this stage.

## GATE

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

This card will hold the steps and evidence for discoverability.

<!-- source:references/stages/06-release.md -->

# Release with trusted publishing

## GOAL

This section will hold the goal instructions for this stage.

## NEEDS

This section will hold the needs instructions for this stage.

## RE-CHECK

This section will hold the re-check instructions for this stage.

## DO

This section will hold the do instructions for this stage.

## READERS

This section will hold the readers instructions for this stage.

## OWNER'S HANDS

This section will hold the owner's hands instructions for this stage.

## LEAVE

This section will hold the leave instructions for this stage.

## GATE

<!-- gate:start -->
| Check | Reject condition | Evidence |
|---|---|---|
| R_VERSION | Unmet requirement: Manifest, lock and plugin versions equal package version. | R_VERSION: checker receipt, initially BLOCKED |
| R_FILES | Unmet requirement: A files allowlist covers binary targets and lifecycle install scripts are absent. | R_FILES: checker receipt, initially BLOCKED |
| W_OIDC | Unmet requirement: Only a job named publish declares id-token: write. | W_OIDC: checker receipt, initially BLOCKED |
| W_TAG | Unmet requirement: A version comparison precedes the publish job or publish command. | W_TAG: checker receipt, initially BLOCKED |
| O_REGISTRY | Unmet requirement: Version, description, tagged README and attestation agree. | O_REGISTRY: checker receipt, initially BLOCKED |
| RL_FIRST (HANDS) | The first registry publish awaits owner action. | Registry version response. |
| RL_TRUST (HANDS) | Trusted publisher setup awaits owner action. | Exact workflow identity and trust read-back. |
| RL_REVIEW | Independent review is unresolved. | Review result or owner, reason and date for WAIVED. Status WAIVED needs owner, reason and date. |
<!-- gate:end -->

<!-- source:references/release/contract.md -->

# Release contract

This card will hold the steps and evidence for release contract.

<!-- source:references/release/npm.md -->

# Release npm

This card will hold the steps and evidence for release npm.

<!-- source:references/release/binaries.md -->

# Release binaries

This card will hold the steps and evidence for release binaries.

<!-- source:references/release/pypi.md -->

# Release pypi

This card will hold the steps and evidence for release pypi.

<!-- source:references/release/skills-and-plugins.md -->

# Release skills and plugins

This card will hold the steps and evidence for release skills and plugins.

<!-- source:references/release/workers.md -->

# Release workers

This card will hold the steps and evidence for release workers.

<!-- source:references/stages/07-site.md -->

# Product site

## GOAL

This section will hold the goal instructions for this stage.

## NEEDS

This section will hold the needs instructions for this stage.

## RE-CHECK

This section will hold the re-check instructions for this stage.

## DO

This section will hold the do instructions for this stage.

## READERS

This section will hold the readers instructions for this stage.

## OWNER'S HANDS

This section will hold the owner's hands instructions for this stage.

## LEAVE

This section will hold the leave instructions for this stage.

## GATE

<!-- gate:start -->
| Check | Reject condition | Evidence |
|---|---|---|

<!-- gate:end -->

<!-- source:references/stages/08-launch.md -->

# Launch venues

## GOAL

This section will hold the goal instructions for this stage.

## NEEDS

This section will hold the needs instructions for this stage.

## RE-CHECK

This section will hold the re-check instructions for this stage.

## DO

This section will hold the do instructions for this stage.

## READERS

This section will hold the readers instructions for this stage.

## OWNER'S HANDS

This section will hold the owner's hands instructions for this stage.

## LEAVE

This section will hold the leave instructions for this stage.

## GATE

<!-- gate:start -->
| Check | Reject condition | Evidence |
|---|---|---|
| LA_VENUE (HANDS) | Venue submissions await owner action. | Submission URL or owner, reason and date for WAIVED. Status WAIVED needs owner, reason and date. |
| LA_LISTING (HANDS) | Marketplace listing awaits owner submission. | Complete listing and submission receipt. |
<!-- gate:end -->

<!-- source:references/launch-venues.md -->

# Launch venues

This card will hold the steps and evidence for launch venues.

<!-- source:references/stages/09-maintain.md -->

# Maintenance

## GOAL

This section will hold the goal instructions for this stage.

## NEEDS

This section will hold the needs instructions for this stage.

## RE-CHECK

This section will hold the re-check instructions for this stage.

## DO

This section will hold the do instructions for this stage.

## READERS

This section will hold the readers instructions for this stage.

## OWNER'S HANDS

This section will hold the owner's hands instructions for this stage.

## LEAVE

This section will hold the leave instructions for this stage.

## GATE

<!-- gate:start -->
| Check | Reject condition | Evidence |
|---|---|---|
| F_PROOF | Unmet requirement: Each row records value, unit, command, measured, expires, package_version and subject package. | F_PROOF: checker receipt, initially BLOCKED |
| C_CREDITS | Unmet requirement: Credits rows contain project, link, licence and use, and README links CREDITS.md. | C_CREDITS: checker receipt, initially BLOCKED |
| S_DRIFT | Unmet requirement: README, llms.txt and renderer hash equal the vendored contract. | S_DRIFT: checker receipt, initially BLOCKED |
| S_STALE | Unmet requirement: The fetched source hash equals the lock hash. | S_STALE: checker receipt, initially BLOCKED |
<!-- gate:end -->

<!-- source:references/readers/registries.md -->

# Registries

This card will hold the steps and evidence for registries.
