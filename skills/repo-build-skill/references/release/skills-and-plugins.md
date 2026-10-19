# Skills and plugins release

**Evidence: MEASURED for `claude plugin validate --strict .`; `npx skills add` is awaiting a real-client trial.** Run the loading check on the user's host and record the result alongside its client version and date.

## Mechanism

Ship the canonical skill folder with SKILL.md, relative references and assets. A plugin adds its host's manifest and marketplace metadata. A directory listing points at a public release; validation and loading are separate checks.

## Runtime and CLI floors

Read the [Agent Skills specification](https://agentskills.io/specification), [Claude Code plugins guide](https://code.claude.com/docs/en/plugins) and [skills CLI documentation](https://github.com/vercel-labs/skills) on the ask date. Record the selected host version and the runtime required by its installer. Use the host adapter for target paths.

## First publish

The owner makes the repository or archive public after privacy checks. Prepare the plugin submission at `https://platform.claude.com/plugins/submit`; the owner reviews its terms and submits. For a skill directory, follow its current listing rules and verify the public listing afterward.

## Trust setup

Pin a release tag or commit in reproducible install instructions where the host supports it. Verify the manifest source, package contents and requested permissions. Host approval and marketplace review are distinct from local validation.

## Workflow asset

Run the pack's check workflow plus the selected host's validator. Generate bundles from the canonical folder and enforce hash and size checks. Retain the full reference tree so relative links resolve after installation.

## Verify command

```sh
claude plugin validate --strict .
npx skills add OWNER/NAME
```

Run the skills CLI in a disposable project with the intended host selected. Ask that host to load the skill, identify its SKILL.md path and follow the first stage on a synthetic brief. Record the actual action observed. File installation alone leaves activation UNVERIFIED.

## Version sites

List package version, skill manifest version, SKILL.md metadata.version, plugin manifest version and any marketplace manifest version. A marketplace archive and repository tag must identify the same content.

## Gotchas

A validator can accept a manifest while a host loads a different folder. Chat upload needs a complete generated bundle, while a native skill needs relative files intact. Keep installation roles tied to the user's own tools; point to third-party tools' instructions rather than installing them.
