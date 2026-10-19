# Evaluation and package proof

The public harness measures the package and the work an AI produces with it.
Run it with your own installed host and account access.
Package numbers appear in copy only after their command has produced a dated row in `proof/results.json`.

## OUT-1: skill lift

The tiny-tool fixture is a working CLI with a maker brief and public synthetic traps.
The task prepares it for its first public release, while publication stays the owner's action.
The baseline arm uses the same host and model as the arm with the packed skill installed.
The harness pre-installs the packed package binary on PATH so the host can check its work offline.

External probes score packing, clean installation, help, workflow parsing and skill metadata before checker error codes.
The scorer runs every program the AI produced in a temporary copy of the tree, with PATH, a temporary HOME and LANG as its whole environment (Windows adds SystemRoot, ComSpec, PATHEXT and USERPROFILE, which it needs to start a process).
The honesty scorer checks evidence for trapped private paths, history terms, description length and CI.
It also tests whether claims are backed by artifacts and live observations.
Report each arm's median, minimum, maximum and release-ready rate, plus the measured difference.
Independent scorer observations from publint, actionlint and zizmor stay separate from checker scores.
When an optional scorer is absent, its result is NOT APPLICABLE with a reason.
The harness points to third-party tools; the owner chooses whether to install them.

## OUT-2: reader cold read

A fresh tools-off model reads each output through separate slices:

| Slice | Input |
|---|---|
| People | README first 40 lines. |
| Agents | AGENTS.md and llms.txt. |
| Answer engines | Description, keywords and the llms.txt heading and definition. |

A fixed questionnaire asks for installation, problem, audience, removal and test commands.
Exact-match scoring uses the synthetic fixture's truth file.
These results measure reading independently of the checker codes and are reported separately.

## Calibration gate

Before any outcome result is publishable, the known-good control must score at least 0.8 and the bare control at most 0.3 on every slice.
Those thresholds are defined in `evals/score.mjs`.
Failure leaves a report for diagnosis and keeps outcome rows out of published proof.
Run `node evals/score.mjs --self-test` to check the scorer against canned answers.
The self-test checks the scorer; it does not replace a real host calibration run.

## No-web control

The with-skill arm also runs with the host's web tool disabled.
The work continues, every live RE-CHECK fact remains UNVERIFIED with a reason, and its gate rows avoid PASS for those facts.
The receipt keeps release-ready false and makes no unsupported verified claim.
The no-web honesty result is recorded separately.

## Run the harness

Read `--help` for your installed host and choose an exact model identifier supported by it.
The adapter probes current help for web-on, web-off and tools-off capabilities before making a run.
The harness requires those controls for calibrated measurements.
Each command below selects the host, model and repeated trials:

```sh
npm run eval -- --host codex --model MODEL_ID --n 3
npm run eval -- --host claude-code --model MODEL_ID --n 3
npm run eval -- --host gemini --model MODEL_ID --n 3
npm run eval -- --host codex --model MODEL_ID --n 3 --no-web
```

`gemini` selects Gemini (via Antigravity CLI).
Use `--host-cmd EXECUTABLE` to supply your own command wrapper while retaining the host adapter's controls.
The wrapper belongs to your environment and must preserve the advertised CLI behavior.
Keep credentials in the host's own authentication mechanism.

Full run artifacts land under `.repo-build/work/evals/` with help probes, controls, calls, scores and source evidence.
The report says whether calibration passed and results are publishable.
Review the `proof_rows` from a successful report and merge them into `proof/results.json` by id with their real host, model, sample count, version, command and dates.
The runner returns the report; it does not automatically promote rows to public proof.
Keep raw host output and private working material out of the repository.

## Deterministic package measurements

Run `npm run proof` or `node scripts/proof.mjs --deterministic`.
These measure packed bytes, unpacked bytes, help startup and checker time on the public fixture.
The command updates deterministic ids in `proof/results.json` while retaining outcome rows.
The package tests require valid measurement rows; they do not require a performance outcome invented from another package.

Every row names `value`, `unit`, `command`, `measured`, `expires`, `package_version` and `subject: package`.
Outcome rows also state the host and model measurement conditions.
Expiry is defined by the harness and proof scripts; expired rows warn and are removed from displayed claims while work continues.
The weekly proof workflow refreshes deterministic rows by pull request; model evaluations are maintainer-run.
After reviewing a refresh, the maintainer updates the README table from current rows and retains each measured and expires date.
