# Project instructions

## Use this skill

Read [the documentation index](https://github.com/OWNER/NAME/blob/vVERSION/docs/README.md) and the reference for the assigned task. Locate `.repo-build/facts.json` before repeating public facts. State the task scope and the artifact that will prove completion.

- **Install:** [exact supported command and runtime].
- **Invoke:** [exact command or host prompt].
- **Check:** [existing package script or documented verifier].
- **State:** keep private working notes and receipts under gitignored `.repo-build/work/`.

## Contribute

Read the relevant code and nearby instructions before editing. Use the existing stack and naming. Preserve unrelated working changes.

- **Build:** [existing package script].
- **Test:** [existing scoped test command].
- **Generate:** [existing generator command and its owned outputs].
- **Verify:** [artifact probe in a clean environment].
- **Report:** changed behavior, evidence paths, results and remaining manual actions.

Replace placeholders with commands that run. Keep this file under 200 lines. Move always-true rules into tests and link each rule to its enforcing test here. Keep generated outputs tied to their generator rather than editing them by hand.
