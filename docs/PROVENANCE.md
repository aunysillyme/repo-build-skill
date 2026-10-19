# Provenance

This pack generalizes repository craft into a method an owner's AI can apply.
Original checker and guard code is written for public use.
The public method, reusable templates and package receipts are distinct from private working notes.

## Public foundations

The [credit table](../CREDITS.md) names the licence and exact file for every technique below.
The supplied source record checked licences on 2026-10-18; current external source reads are UNVERIFIED in this offline writing pass.

- [aunysillyme/website-build-skill](https://github.com/aunysillyme/website-build-skill): Router, ask-date adaptation, installer shape and generators: `skills/repo-build-skill/SKILL.md`, `references/ask-date.md`, `src/install.mjs`, `src/bundle.mjs`; root CLA and conduct adaptation.
- [aunysillyme/model-orchestrator](https://github.com/aunysillyme/model-orchestrator): Expiring package proof and prose checks: `proof/results.json`, `scripts/proof.mjs`, `test/prose.test.mjs`, `test/copy.test.mjs`.
- [aunysillyme/agent-personalizer](https://github.com/aunysillyme/agent-personalizer): Private-list checks and install-time hash uninstall: `src/check/rules/privacy.mjs`, `src/install.mjs`.
- [aunysillyme-dev/aunx-skills](https://github.com/aunysillyme-dev/aunx-skills): Commit-text scrub technique, written fresh: `src/check/rules/privacy.mjs`.
- [rookepoole/PARS](https://github.com/rookepoole/PARS): Owner-quoted acceptance checks, verifiers and final replay: `skills/repo-build-skill/references/acceptance-checks.md`.
- [trailofbits/skills](https://github.com/trailofbits/skills): Open-sourcing scope comparison and release principles, technique only: `skills/repo-build-skill/references/release/contract.md`; no text copied.
- [github/opensource.guide](https://github.com/github/opensource.guide): Pre-launch checklist idea: `skills/repo-build-skill/references/stages/01-frame.md`.
- [todogroup/repolinter](https://github.com/todogroup/repolinter): Configurable repository linting idea, fresh implementation: `src/check/index.mjs`.
- [ossf/scorecard](https://github.com/ossf/scorecard): Workflow permission and pin-check ideas: `src/check/rules/workflows.mjs`.
- [NVIDIA/SkillEvaluator](https://github.com/NVIDIA/SkillEvaluator): With-and-without skill outcome comparison: `evals/run.mjs`.
- [publint/publint](https://github.com/publint/publint): Independent package scorer, invoked when available: `evals/score.mjs`.
- [rhysd/actionlint](https://github.com/rhysd/actionlint): Independent workflow scorer, invoked when available: `evals/score.mjs`.
- [zizmorcore/zizmor](https://github.com/zizmorcore/zizmor): Independent workflow security scorer, invoked when available: `evals/score.mjs`.
- [agentsmd/agents.md](https://github.com/agentsmd/agents.md): Agent instruction format: `AGENTS.md` and `skills/repo-build-skill/references/readers/agents.md`.
- [AnswerDotAI/llms-txt](https://github.com/AnswerDotAI/llms-txt): Linked context format: `src/bundle.mjs` and `skills/repo-build-skill/references/readers/answer-engines.md`.
- [agentskills/agentskills](https://github.com/agentskills/agentskills): Skill frontmatter rules: `skills/repo-build-skill/SKILL.md`, `src/check/rules/agents.mjs`.
- [vercel-labs/skills](https://github.com/vercel-labs/skills): Skills install route and target layout: `skills/repo-build-skill/references/release/skills-and-plugins.md`.
- [olivierlacan/keep-a-changelog](https://github.com/olivierlacan/keep-a-changelog): Changelog structure: `CHANGELOG.md`.
- [EthicalSource/contributor_covenant](https://github.com/EthicalSource/contributor_covenant): Contributor Covenant 2.1 conduct adaptation: `CODE_OF_CONDUCT.md`; attribution block retained.
- [semver/semver](https://github.com/semver/semver): Semantic Versioning rules: `RELEASING.md`.
- [wheresryan22/anatomy](https://github.com/wheresryan22/anatomy): Lead with a real result and concise reproduction: `README.md`, via website-build-skill.

- [everest-an/github-morestar-skill](https://github.com/everest-an/github-morestar-skill): repo discovery and launch research synthesis in `references/discoverability.md`, labelled REPORTED and requiring ask-date reads.
- [avalonreset/legends-github](https://github.com/avalonreset/legends-github): evidence-labelled reported discovery observations in that card; no text copied.

## Public concept names

- **aun-acceptance:** quote the owner's asks, turn each into a check with a verifier, observe failure before the build and replay the final artifact.
- **aun-cross-review:** one independent review by a different model family before release, or WAIVED with owner, reason and date.
- **aun-privacy-gate:** public pattern checks plus private local term lists, applied to the intended public files and history.
- **aun-repo-health:** compare facts, listings and discovery files on a schedule; keep an actionable issue open until the discrepancy is resolved.

These names describe the techniques taught here. Private source names and paths stay private.
The relevant stages teach the reasons and the verification steps with owner-neutral examples.

## Evidence boundaries

Package measurements belong in `proof/results.json` with their command, version, measurement date and expiry.
Outcome fixtures are newly written public synthetic inputs.
Historical measurements from other packages are context for the method and are kept out of this package's proof rows.
Host and model fields in outcome proof describe the measurement condition.
Self-application receipts show actual checker output and manual statuses, with personal paths removed.

## Adapted text

The CLA and Contributor Covenant 2.1 policy are ported through website-build-skill.
The conduct policy retains its attribution block, original source links and adaptation notice.
No Contributor Covenant 3.0 text is included.
Release principles studied from trailofbits/skills are described in fresh wording.
Third-party tools used as independent scorers are invoked separately and retain their own licences.
