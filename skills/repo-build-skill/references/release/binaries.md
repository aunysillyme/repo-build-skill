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
