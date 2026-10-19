# Coding agents

Give an agent one authoritative entrypoint, runnable commands and a small route to the current task. A long instruction file consumes context on every turn; move detail into named references and load it when needed.

## AGENTS.md

Use two sections: **Use this skill** for consuming the repo and **Contribute** for changing it. Include the install or invocation path, how to locate facts, the build and test commands, generated-file boundaries and the expected report. Name the package scripts that actually exist. Keep local instructions near code when they override a broader rule.

Keep the root under 200 lines. Put an always-true requirement in a test, then point to that test instead of repeating the rule in several agent files. Preserve existing instructions when adding a marked installer block; ask the owner to resolve conflicting instructions.

For a host that imports CLAUDE.md, keep AGENTS.md the source:

```markdown
# Project instructions
Read AGENTS.md as the single source for project instructions.
@AGENTS.md
```

Re-check the host's current import and discovery rules on the ask date. A file at a plausible location proves installation; a real-client invocation proves loading. Use the host adapter's check to record the exact path opened and the action it enabled.

## Machine-readable context

Use `.repo-build/facts.json` for shared names, descriptions and URLs. Generate llms.txt and bundles from that source. Run `repo-build-skill check . --json` to get findings with code, severity, file, reason and learning link. The checker reads the repo; the AI owns the edits and reports their effect.

Keep work receipts and research under gitignored `.repo-build/work/`. Public receipts contain only the evidence a stranger needs to reproduce a claim. Scan paths, output and history for private data before publishing them.

## Verify the handoff

Ask a fresh agent to identify the source of truth, run one listed command and locate the reference for the assigned stage. Capture its observed actions. If a tool or web source is unavailable, keep that fact UNVERIFIED and finish independent work within scope.

Format source: [AGENTS.md](https://agents.md/). Host instructions govern their own loading behavior.
