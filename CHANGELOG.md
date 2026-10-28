# Changelog

All notable changes to this project are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.3] - 2026-10-27

### Added

- A pinned OpenSSF Scorecard workflow asset and repository workflow publish weekly security scores and upload SARIF to code scanning, with setup guidance and a README badge.

### Changed

- `W_OIDC` permits Scorecard publishing jobs using only its allowed actions and `publish_results: true`, while keeping install, build and package scripts out of identity jobs.
- The professional file floor leaves dependency monitoring to the project, matching this repository's Snyk setup.

## [0.1.2] - 2026-10-19

### Added

- `set sync` vendors the set drift-check wrapper `scripts/check-set.mjs` and pins its sha256 as `check_sha256` in `.repo-build/set.lock.json`. The wrapper compares the renderer and set data hashes before it imports the renderer, then checks the README and llms.txt blocks offline.

### Changed

- `S_DRIFT` fails when the vendored wrapper differs from its pin, is missing or is a symlink. A lock written before 0.1.2 still passes and names the `set sync` upgrade.
- `set sync` checks that every destination is absent or a regular file before its first write, so a refused path leaves the tree untouched.

## [0.1.1] - 2026-10-19

### Changed

- Published from GitHub Actions with npm provenance through trusted publishing. The package contents match 0.1.0.

## [0.1.0] - 2026-10-19

### Added

- The 0.1.0 skill pack teaches framing, stack choice, scaffolding, writing, discovery, release, site planning, launch and maintenance.
- A read-only repository checker explains findings by reader and stage.
- Host adapters, install receipts and hash-based uninstall support local installation.
- Reader cards, release cards and reusable assets guide the AI's work.
- Generated discovery files and set blocks keep shared metadata aligned.
- Public synthetic outcome fixtures and dated package measurements make claims reproducible.
- Release, proof refresh and repository health workflows document the maintenance loop.

[Unreleased]: https://github.com/aunysillyme/repo-build-skill/compare/v0.1.3...HEAD
[0.1.3]: https://github.com/aunysillyme/repo-build-skill/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/aunysillyme/repo-build-skill/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/aunysillyme/repo-build-skill/compare/b10da76...v0.1.1
[0.1.0]: https://github.com/aunysillyme/repo-build-skill/tree/b10da76
