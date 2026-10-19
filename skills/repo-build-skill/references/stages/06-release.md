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

