# AGENTS.md

Install the canonical folder for AGENTS.md, then confirm the host reads it. The skill teaches the AI the repository workflow; the AI performs the work in your authorized project.

## Install and invoke

Run from the project directory:

```sh
npx repo-build-skill --host agents-md --scope project --dir .
```

Review the preview and confirm once. The installer writes `.agents/skills/repo-build-skill/`, including SKILL.md, references, assets and `.repo-build-skill-receipt.json`. Supported scope: project. Use `--dry-run` to inspect the plan or `--yes` for a deliberate headless installation.

The installer also appends a marked pointer to the project's root `AGENTS.md`. It preserves surrounding instructions and stops on an existing conflicting marker. This host route supports project scope.

Give your file-reading agent a synthetic brief and ask it to follow the pointer in AGENTS.md. Re-check the chosen client's AGENTS.md discovery rules on the ask date; an instruction filename by itself cannot establish that client loading occurred.

## Check that it loaded

Native loading on this host is awaiting a real-client trial; the check below confirms it on yours.

Ask: "Use repo-build-skill to frame a small CLI. State the exact SKILL.md path you read, load only the Frame route, and show its acceptance checks. Keep live facts UNVERIFIED when web access is unavailable."

Record the client version, date, exact file opened, available tools and observed first action. Confirm it follows the route and creates work state in the user's repository. Installation read-back proves the files landed; this check confirms activation on your host. See [compatibility](../docs/COMPATIBILITY.md).

## Manual fallback

Copy the complete `skills/repo-build-skill/` folder from the reviewed release to `.agents/skills/repo-build-skill/` in the project. Preserve its relative files. If the host does not discover it, explicitly ask it to read `.agents/skills/repo-build-skill/SKILL.md`. For the AGENTS.md route, merge a pointer to that exact path into existing instructions. Keep unrelated content intact.

Manual copies have no installer receipt. Record the files you add so cleanup preserves your edits. The [chat bundle](chat-upload.md) is another route when the client can read an uploaded document.

## Uninstall

```sh
npx repo-build-skill --uninstall --host agents-md --scope project --dir .
```

Use the original scope and target directory. The saved install-time hashes preserve edited and pre-existing files; inspect retained paths and remove pointers you added by hand. Preview with `--dry-run`. Read the [installer contract](../docs/INSTALLER.md) for receipt ownership and cleanup behavior.
