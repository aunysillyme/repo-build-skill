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
