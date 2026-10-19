# Release with trusted publishing

## GOAL

Release a tested artifact and verify the registry serves the same version and listing.

## NEEDS

Final facts, version sites, changelog, acceptance checks and CI; load the release contract plus the chosen registry card. Make the small missing prerequisite first.

## RE-CHECK

| Fact | Official source | Window |
|---|---|---|
| Trusted publishing and visibility requirements | The registry's official trusted-publisher documentation | 30 days |
| Runtime and CLI floors, attestation tooling | The registry's official requirements and tool release pages | 30 days |
| Registry processing and metadata behavior | The registry's official API and a dated package probe | 30 days |

Record each read in `.repo-build/work/sources.md` with claim, URL, source date, access date, window, expires and stage. Offline facts stay UNVERIFIED while work proceeds.

## DO

1. Read the contract and replace the route's npm card with PyPI, binaries, Workers or skills-and-plugins as appropriate, so registry-specific behavior stays in one card.
2. List every version site in RELEASING.md, bump them together and prepare dated changelog notes, because tags, manifests and installed links must agree.
3. Run the final acceptance checks and the repo's scoped suite on the release artifact; resolve findings from aun-cross-review or record WAIVED with owner, reason and date, so release evidence describes the final result.
4. Build or pack once, install and test that artifact in a clean consumer directory, then publish that same artifact, because rebuilding can change what was tested.
5. Check that the tag equals the manifest version before publication and keep `id-token: write` only in the publish job, so the workflow proves a narrow release identity.
6. Prepare the first publish and exact trusted-publisher identity for the owner; record the workflow filename and environment, because a trust record can require re-creation after a rename.
7. Use short-lived OIDC credentials where the registry offers them and provenance or artifact attestations where supported; for a deployment follow its scoped credential and rollback procedure, so credentials match the delivery mechanism.
8. Query the exact version and attestation through the registry after publishing, polling within a stated deadline when processing lags, because a successful workflow is only one part of delivery.
9. Compare the registry README, description, bin, funding and homepage to the release tag, create the release page and record immutable identifiers, so users get the documented artifact.
10. Record a terminal demo from the published version outside the checkout; include copy-only edits in the next release, because registry pages commonly come from the published artifact.

## READERS

| Reader | What they get |
|---|---|
| People | Changelog, release notes and a published-package demo. |
| Agents | A version-pinned install and artifact receipt. |
| Answer engines | Provenance or attestations with dated evidence. |
| Registries | One tested artifact, matching tag and listing parity. |

## OWNER'S HANDS

HANDS: perform the first publish and trust setup through the chosen card's exact command and settings URL. For npm, the prepared command is `npm publish <packed-file.tgz> --access public`; set the exact workflow in `https://www.npmjs.com/package/<package>/access`. Authorize any public flip before its command runs.

## LEAVE

Leave RELEASING.md, CHANGELOG.md, artifact checksum, tag and registry identifiers, query output and `.repo-build/work/receipts/06-release.json`. A release-ready claim requires zero FAIL, BLOCKED and UNVERIFIED rows; a waiver is printed with owner, reason and date.

## GATE

Rows begin BLOCKED. Attach actual output or a dated manual receipt before assigning PASS. Facts awaiting live reads stay UNVERIFIED. Record NOT APPLICABLE with a reason; WAIVED is reserved for review and venue gates with owner, reason and date.

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
