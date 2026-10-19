# The repository method

The pack teaches your AI to turn an owner's goal into a repository people can understand, agents can work in and registries can publish.
Your AI does the work, records its evidence and prepares the actions the owner performs.

## The readers

| Reader | Entrance | Useful result |
|---|---|---|
| People | README, About and install line | A clear problem, result and next step. |
| Agents | AGENTS.md, skill router and receipts | Commands, inputs and a checkable gate. |
| Answer engines | Manifest description, question headings and llms.txt | One definition and source links. |
| Registries | Manifest, release workflow and artifact | Versions, metadata and provenance that agree. |

One facts file connects these surfaces.
A stage loads only its teaching file and the cards needed for that task.

## The stages

| Stage | Leave | Gate prefix |
|---|---|---|
| Frame | Definition, quoted asks, acceptance checks and distribution sketch | FR |
| Stack card | Runtime, install path, budgets, choice and budget tests | ST |
| Scaffold | Community floor, workflows and public settings handoff | SC |
| README / AGENTS.md / llms.txt | Approved first screen, working commands and linked context | WR |
| SEO and AEO for repos | Consistent metadata and evidence-labelled tactics | DI |
| Release with trusted publishing | Tested artifact, release card and registry verification | RL |
| Product site | Discovery minimum and website-build-skill handoff | PS |
| Launch venues | Dated venue cards, complete drafts and follow-up dates | LA |
| Maintenance | Public parity, refreshed proof and outside contribution paths | MA |

A new repo starts at Frame.
An existing repo starts with `npx repo-build-skill check . --json` and enters at the earliest failing stage.
A launch request starts at Launch venues and fills in the facts that stage needs.
The stack card comes before the first commit because runtime and install choices become expensive to change after release.

## What each stage contains

GOAL gives the outcome; NEEDS names earlier artifacts.
RE-CHECK names facts, official sources and freshness windows.
DO explains each action and its reason; READERS names the artifact for each audience.
OWNER'S HANDS gives exact actions for publishing, visibility and submissions.
LEAVE names the artifacts and fields; GATE records evidence for each required check.
The generated gate table comes from rule objects and the manifest's manual rows.

## Gates and evidence

| Status | Meaning |
|---|---|
| PASS | The verifier ran and its evidence satisfies the requirement. |
| FAIL | The observation contradicts the requirement. |
| BLOCKED | A required action or input still needs completion. |
| UNVERIFIED | A needed live fact has no current source confirmation. |
| NOT APPLICABLE | The row does not apply, with a reason. |
| WAIVED | Review or venue requirement waived with owner, reason and date. |

SKIPPED in checker output is counted and stays separate from PASS.
`--strict` fails when the checker skips a required observation.
Release-ready requires release-stage evidence with zero FAIL, BLOCKED and UNVERIFIED rows.
A useful offline run proceeds with its live facts marked UNVERIFIED and names each one in its receipt.

Evidence levels on release cards describe the mechanism's basis.
MEASURED means the described route has a recorded execution basis.
DOCUMENTED means the AI must read the official mechanism on the ask date before applying it.
Discovery tactics use CONFIRMED for official behavior, PRACTICE for a dated working method and REPORTED for a named outside finding.
A tactic label is a reason to investigate, not a promise of traffic.

## Presentation and distribution

Presentation keeps visitors; distribution brings the first ones.
Repositories near the top of a presentation checklist were still outranked in GitHub search for their own names, where stars drive best match.
The lesson is qualitative: clear files earn understanding, while real use and useful listings help the project reach readers.
Earn stars through useful work and legitimate discovery; GitHub's Acceptable Use rules prohibit rank abuse.

Write the distribution sketch at Frame and revisit it at Launch.
Give every venue a gate, cost, liveness check, submitter, queue rule and follow-up date.
Then compare facts, listing text and released artifacts during maintenance.
