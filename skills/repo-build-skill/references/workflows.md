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
