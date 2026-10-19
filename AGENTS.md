# Agent instructions

## Use this skill

Read `skills/repo-build-skill/SKILL.md` and load only the current route.
This pack teaches your AI; your AI performs the repository work.
Run `npm run check` to inspect this checkout.
Keep the user's facts in `.repo-build/facts.json` and working receipts in `.repo-build/work/`.
A gate that depends on an unverified fact stays UNVERIFIED.
The owner completes publishing, public visibility changes and venue submissions.

## Contribute

Use `npm test` for tests, `npm run build` for generated content and `npm run typecheck` for JavaScript type checking.
Use `npm run proof` for deterministic package measurements and `npm run eval` for outcome runs with your own host access.
Read `CONTRIBUTING.md`, `RELEASING.md` and the applicable adapter before editing.
Update source stage content and rule objects, then regenerate derived files.
Keep release versions aligned across the package, lockfile, plugin and skill manifests.

## Enforced rules

| Rule | Test |
|---|---|
| Teach the AI and describe who does the work. | `test/copy.test.mjs` |
| Keep the checker read-only. | `test/readonly.test.mjs` |
| Preserve routes and context budgets. | `test/routes.test.mjs`, `test/budgets.test.mjs` |
| Keep generated output aligned with its sources. | `test/generated.test.mjs` |
| Link and license upstream techniques. | `test/credits.test.mjs` |
| Keep private terms and personal paths out of public files. | `test/internal-terms.test.mjs`, `test/privacy.test.mjs` |
| Preserve changed and pre-existing files during uninstall. | `test/installer.test.mjs` |
| Use positive headings and plain punctuation. | `test/prose.test.mjs` |

Always-true requirements belong in tests beside the behavior they protect.
Record the actual command and result when reporting validation.
