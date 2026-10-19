# Contributing

Contributions make the method easier to use on real repositories.
Start with a focused issue or a small pull request with reproducible evidence.

## Useful contributions

- Add a host adapter with its target directory, manual fallback and real-client loading check.
- Add a checker rule with a RED fixture, a GREEN fixture, a reason and a stage reference.
- Add a release card for another registry using the shared contract and card fields.
- Report a false positive with the checker code, command, sanitized input and steps to reproduce.

Use the repository's [issue forms](https://github.com/aunysillyme/repo-build-skill/issues/new/choose).
Keep personal details, credentials and private source material out of reports.
Use [private reporting](SECURITY.md) for vulnerabilities.

## Work locally

Use the Node version supported by `package.json`.
Run `npm ci`, `npm run build`, `npm test` and `npm run typecheck`.
A content change updates the source skill files; the build generates gates, bundles and llms.txt.
Rehash changed manifest assets with the documented build command in [RELEASING.md](RELEASING.md).
Supply the exact commands and results in your pull request.

## Evidence and attribution

Use official sources and record the ask date for facts that can change.
State a real-client trial at the point where a reader chooses a host.
Give each copied or adapted technique a linked licence row in [CREDITS.md](CREDITS.md).
Our own tools and concepts are named with the aun- prefix; internal names never ship, and the INTERNAL_TERMS test enforces it.

## Contributor agreement

Read [CLA.md](CLA.md) and tick the agreement checkbox in the pull request template.
You retain copyright in your work and grant the project the licences described there.
The [Code of Conduct](CODE_OF_CONDUCT.md) applies to project spaces.
Maintainers review changes according to scope, evidence, maintenance cost and the checks.
