# Stack card

## GOAL

Pick a maintainable stack from the user's install path and measurable budgets.

## NEEDS

Frame facts and acceptance checks; use `assets/stack-card.md` and the installer card when files are installed. Make the small missing prerequisite first.

## RE-CHECK

| Fact | Official source | Window |
|---|---|---|
| Runtime support lines | [Node releases](https://nodejs.org/en/about/previous-releases) or [Python versions](https://devguide.python.org/versions/) | 90 days |
| Runner images and install tools | [GitHub runner images](https://github.com/actions/runner-images) and the tool's official docs | 90 days |

Record each read in `.repo-build/work/sources.md` with claim, URL, source date, access date, window, expires and stage. Offline facts stay UNVERIFIED while work proceeds.

## DO

1. Write `docs/STACK.md` before the first commit with Runs on, The user already has, Install path, Budgets, Pick and Budget tests, so the stack decision is visible before code.
2. Start from how the user gets the product, because the user pays for every runtime they do not already have.
3. Compare Node for an `npx` tool, Python for `uvx` or library-heavy work, browser delivery for a web app, and a binary for users with no runtime, so the distribution route leads the choice.
4. Set numerical limits for installed size, runtime dependencies, install steps, startup, resident memory when relevant, and uninstall residue, so efficiency becomes testable.
5. Prefer one command and one confirm for an installer, derive roles from the user's stack, and point to companions' official installation instructions, because third-party setup belongs to their owners.
6. For a close call, package the same small feature in each candidate with one builder per stack in parallel; install cleanly and measure, so the comparison tests delivery as well as execution.
7. Choose the simplest maintained stack meeting every budget; put a language outside the project's defaults before the owner with the card and tradeoff, so a rewrite is a deliberate decision.
8. Turn durable budgets into tests and record registry and runtime manifest fields, so growth cannot quietly change the installation cost.

## READERS

| Reader | What they get |
|---|---|
| People | An install line and explicit step budget. |
| Agents | Headless flags and the installer receipt contract. |
| Answer engines | Runtime and requirement facts. |
| Registries | Registry choice plus `engines` or `requires-python`. |

## OWNER'S HANDS

HANDS: choose any language outside the project's defaults after reviewing `docs/STACK.md`. Confirm the actual install route with the target users. Use the official runtime pages linked above to approve the support floor.

## LEAVE

Leave `docs/STACK.md` with the six labels, measurement commands and results; budget tests; selected registry and support floors in the manifest; `.repo-build/work/receipts/02-stack.json`.

## GATE

Rows begin BLOCKED. Attach actual output or a dated manual receipt before assigning PASS. Facts awaiting live reads stay UNVERIFIED. Record NOT APPLICABLE with a reason; WAIVED is reserved for review and venue gates with owner, reason and date.

<!-- gate:start -->
| Check | Reject condition | Evidence |
|---|---|---|
| H_UNINSTALL | Unmet requirement: An installer has an uninstall command in README. | H_UNINSTALL: checker receipt, initially BLOCKED |
<!-- gate:end -->
