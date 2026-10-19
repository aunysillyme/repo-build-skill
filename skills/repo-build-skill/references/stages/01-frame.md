# Frame

## GOAL

Define the problem, audience and first release before choosing implementation.

## NEEDS

The owner's request and any existing `.repo-build/facts.json` and checker receipt. Make the small missing prerequisite first.

## RE-CHECK

| Fact | Official source | Window |
|---|---|---|
| Name availability | [GitHub search](https://github.com/search) and the target registry | 1 day |
| Comparable tools | Their official repos and release pages | 30 days |
| Name and similarity policy | [npm package names](https://docs.npmjs.com/package-name-guidelines) or the chosen registry | 90 days |

Record each read in `.repo-build/work/sources.md` with claim, URL, source date, access date, window, expires and stage. Offline facts stay UNVERIFIED while work proceeds.

## DO

1. Quote the owner's asks in `.repo-build/work/acceptance.md`, so the final result answers their request.
2. Write who has the problem and the smallest useful outcome, so the first release has a clear boundary.
3. Answer the first-screen questions: what problem is solved, what people get, and what they can do, so a visitor can decide quickly.
4. Search the exact name on GitHub, the registry and the web; save candidates and dates, because a free registry response leaves similarity review until publication.
5. Create `.repo-build/facts.json` with one name, category noun, lead, description, install route and entity, so every reader encounters the same product.
6. Apply aun-acceptance: turn each quoted ask into a check with its exact verifier; capture the failing baseline before building and replay it on the final artifact, so completion has evidence.
7. Write a distribution paragraph with audience, likely venues and the first useful demo, because presentation keeps visitors and distribution brings the first ones.
8. Choose private development followed by an owner-approved public flip after gates, so private material is checked before exposure.

Presentation is one part of discovery. Repos near the top of a presentation checklist can still be outranked in GitHub search for their own names, where stars drive best match. Earn attention through useful software, real users and suitable listings; use the Discover stage's evidence grades for ranking claims.

## READERS

| Reader | What they get |
|---|---|
| People | Problem, lead and first release boundary. |
| Agents | A precise “Use this when” trigger sentence. |
| Answer engines | A category noun and an answer-first definition. |
| Registries | A dated name check and publish-time similarity caveat. |

## OWNER'S HANDS

HANDS: approve the name, first release boundary and quoted acceptance checks. Open `https://github.com/search?q=<name>&type=repositories` and the chosen registry's name page together before deciding.

## LEAVE

Leave `.repo-build/facts.json`, `.repo-build/work/acceptance.md`, a dated source ledger and `.repo-build/work/receipts/01-frame.json`. Each acceptance row has the owner quote, predicate, verifier, baseline and final result.

## GATE

Rows begin BLOCKED. Attach actual output or a dated manual receipt before assigning PASS. Facts awaiting live reads stay UNVERIFIED. Record NOT APPLICABLE with a reason; WAIVED is reserved for review and venue gates with owner, reason and date.

<!-- gate:start -->
| Check | Reject condition | Evidence |
|---|---|---|
| H_LEAD | Unmet requirement: A bold lead in the first ten lines equals facts.lead. | H_LEAD: checker receipt, initially BLOCKED |
| FR_ACCEPTANCE | Acceptance checks lack verifiers. | Owner quotes and command output. |
<!-- gate:end -->
