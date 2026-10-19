# Stack card

Write this card before the first commit. Replace each bracketed field with the user's real constraints and a verifier. The install path comes before the language: every runtime the user lacks adds a step.

1. **Runs on:** [command line, browser, desktop, phone or server; supported systems and architectures].
2. **The user already has:** [runtime and tools already present; evidence from the intended user's stack].
3. **Install path:** [one advertised command, download or hosted URL; uninstall route; headless flags when applicable].
4. **Budgets:** [packed and installed bytes; runtime dependency count; install actions; cold start; memory for a long-running process; cleanup result].
5. **Pick:** [stack and reason; alternatives considered; owner decision for a language outside the project's defaults].
6. **Budget tests:** [exact command, environment, measured property and pass limit for every binding budget].

When two stacks fit, package the same small working feature in each. Measure against the same budgets in clean environments. Parallel implementations can reduce waiting; each needs the same input and distinct ownership. Pick the simplest maintainable option that meets every binding budget and save the comparison.
