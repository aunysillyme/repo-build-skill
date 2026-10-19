# Acceptance checks

Use aun-acceptance to turn the owner's words into verifiable outcomes. It keeps a technically sound build aligned with the thing the owner asked for.

## Freeze the result

Quote each acceptance-critical ask verbatim in a private work record. Give it an id, a predicate on the final artifact, a scoped verifier and an expected result. Preserve the owner's firmness: a preference stays a preference and a must stays a requirement. Ask about missing build-changing decisions together, with a recommendation.

| Ask | Predicate | Verifier | Evidence |
|---|---|---|---|
| Owner's exact words | A visible behavior or artifact | Exact command, inspection or owner check | Saved output and status |

A verifier should be capable of showing the opposite. Checking that a file exists proves existence; running the packaged entrypoint proves it can start. For performance, measure the named property. For privacy, scan both publishable content and the relevant history.

## RED before build, replay after build

Run each required verifier before implementation and save the failing result. This confirms the check can detect the missing behavior. For an existing check that already fails, retain that output instead of creating another test. Match the check's cost to the risk of the change.

Replay the same verifiers against the final artifact, including its packaged form when that is what users install. Record PASS, FAIL, BLOCKED or UNVERIFIED and the path to evidence. A changed goal needs an explicit update from the owner; a passing substitute does not silently replace the original check.

## Keep the claim within the evidence

Report manual actions as owner's hands with an exact command or URL. A pending publish stays pending even when packaging passes. An unavailable live source stays UNVERIFIED while independent work continues. Review and venue gates alone may be WAIVED with owner, reason and date; keep the waiver visible in the receipt.

Reopen the original asks at completion and compare each to its verifier once. Keep private source words out of a public showcase unless the owner authorizes them. A public receipt can show the predicate, command, result and artifact hash.

Technique credit: [rookepoole/PARS](https://github.com/rookepoole/PARS), MIT. This card generalizes freezing checks from the owner's words and replaying them against the final artifact.
