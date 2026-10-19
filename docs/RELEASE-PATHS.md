# Release paths

Use [the common contract](../skills/repo-build-skill/references/release/contract.md) and the card for the artifact users receive.
The contract covers aligned version sites, tag equality, testing and publishing the same artifact, short-lived identity, provenance, owner's actions and registry read-back.

| Path | Card | Evidence |
|---|---|---|
| npm package and npx command | [npm](../skills/repo-build-skill/references/release/npm.md) | MEASURED |
| Python package and uvx or pip | [PyPI](../skills/repo-build-skill/references/release/pypi.md) | DOCUMENTED; read on the ask date |
| Download and Homebrew | [Binaries](../skills/repo-build-skill/references/release/binaries.md) | DOCUMENTED; read on the ask date |
| Hosted deployment | [Workers](../skills/repo-build-skill/references/release/workers.md) | DOCUMENTED; read on the ask date |
| Skill folder and plugin | [Skills and plugins](../skills/repo-build-skill/references/release/skills-and-plugins.md) | MEASURED for strict plugin validation; skills CLI trial pending |

Each card uses the same fields: mechanism, runtime and CLI floors, first publish, trust setup, workflow asset, verify command, version sites and gotchas.
These are the fields the AI fills with current official sources in the user's source ledger.
A path's evidence level describes the teaching basis; the user's release still needs its own artifact trial and read-back.

## Apply a card

Ask the AI to load the Release stage, contract and selected card.
Re-check the official registry or platform docs on the ask date.
Prepare the exact owner's steps for the first publish and identity setup.
Build once, test that artifact, publish that artifact and query the registry's named version.
Compare the published listing text with the tagged README and manifest.
Record the rollback reference before any authorized deployment or release change.

For this package's exact workflow, use [RELEASING.md](../RELEASING.md).
