# Registries

A registry reads the built artifact and its metadata. A repository's default branch can look correct while the published listing still describes a different version.

## Metadata contract

Set name, version, description, licence, repository and homepage in the package manifest. Set the runtime floor and actual entrypoints. For npm, check `bin`, `exports`, `files` and keywords; for Python, check `requires-python`, scripts, URLs and distribution contents. Put optional funding and support links where the registry accepts them.

Use facts as the shared source for public copy. A topic should describe a real capability; include the same term in package keywords when it fits. The tagged README is the listing source. Refresh it as part of a release, including a copy-only correction, so installs and registry pages tell the same story.

## Artifact check

1. List every version site before changing versions, because a tag must identify one release.
2. Build once and inspect the resulting archive, because source tests cannot prove what ships.
3. Install that archive in a clean project and run its advertised entrypoint, because a local workspace can hide omitted files.
4. Publish that exact artifact after the owner completes initial trust setup.
5. Query the registry's own version, metadata and provenance response, because a successful CI job is only part of the evidence.

For npm, use `npm pack --dry-run --json` to inspect the allowlist and `npm view NAME@VERSION version dist.attestations --prefer-online` to read the published release. Compare description, README, homepage, repository, entrypoints and funding against the tag. Use the selected release card for other registries.

## Continuing parity

Run aun-repo-health weekly to compare public metadata, generated discovery files, homepage response and vendored set lock. A maintainer refreshes set data deliberately; CI checks the vendored copy offline. Keep one issue for current drift and close it after evidence shows parity.

Refresh measurements before their expiry. Expired proof warns and leaves current promotional copy; it keeps the software runnable and updateable. Mark a registry read UNVERIFIED when network access fails, and retain the command for a later probe.
