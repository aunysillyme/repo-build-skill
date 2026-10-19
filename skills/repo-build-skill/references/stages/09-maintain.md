# Maintenance

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
| F_PROOF | Unmet requirement: Each row records value, unit, command, measured, expires, package_version and subject package. | F_PROOF: checker receipt, initially BLOCKED |
| C_CREDITS | Unmet requirement: Credits rows contain project, link, licence and use, and README links CREDITS.md. | C_CREDITS: checker receipt, initially BLOCKED |
| S_DRIFT | Unmet requirement: README, llms.txt and renderer hash equal the vendored contract. | S_DRIFT: checker receipt, initially BLOCKED |
| S_STALE | Unmet requirement: The fetched source hash equals the lock hash. | S_STALE: checker receipt, initially BLOCKED |
<!-- gate:end -->

