# Scaffold

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
| H_FLOOR | Unmet requirement: Every floor file, issue form and check workflow is present and non-empty. | H_FLOOR: checker receipt, initially BLOCKED |
| A_SKILL_SPEC | Unmet requirement: Each SKILL.md has a valid name, description and size. | A_SKILL_SPEC: checker receipt, initially BLOCKED |
| R_META | Unmet requirement: Homepage, repository, bugs and license fields are present. | R_META: checker receipt, initially BLOCKED |
| W_PERMS | Unmet requirement: Every workflow declares read-only or empty default permissions. | W_PERMS: checker receipt, initially BLOCKED |
| W_PIN | Unmet requirement: Every remote action uses forty hex characters and a version comment. | W_PIN: checker receipt, initially BLOCKED |
| W_CREDS | Unmet requirement: Each checkout step sets persist-credentials: false. | W_CREDS: checker receipt, initially BLOCKED |
| W_INJECT | Unmet requirement: No github.event interpolation appears in run values. | W_INJECT: checker receipt, initially BLOCKED |
| P_PATH | Unmet requirement: Home paths use placeholder usernames in contents and filenames. | P_PATH: checker receipt, initially BLOCKED |
| P_EMAIL | Unmet requirement: Email addresses are in the allowlist or a standard example or noreply domain. | P_EMAIL: checker receipt, initially BLOCKED |
| P_TOKEN | Unmet requirement: Token-shaped strings and private key headers are absent. | P_TOKEN: checker receipt, initially BLOCKED |
| P_LIST | Unmet requirement: Untracked list files contain no matches in the public tree or history. | P_LIST: checker receipt, initially BLOCKED |
| O_PVR | Unmet requirement: Public GitHub repositories enable private vulnerability reporting. | O_PVR: checker receipt, initially BLOCKED |
| SC_PUBLIC (HANDS) | The public flip settings await owner action. | Dated public settings read-back. |
<!-- gate:end -->

