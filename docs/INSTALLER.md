# Installer contract

`npx repo-build-skill` asks for a host, shows the intended paths and requests one confirmation.
It copies the complete skill folder, reads the files back and writes an ownership receipt.
Roles come from the tools the user has; the pack assigns no fixed model or agent count.
Third-party tools are linked for the owner to choose and install themselves.
The installer writes local files; host activation is confirmed with the adapter's real loading check.

## Targets

| Host | Project target | Adapter |
|---|---|---|
| Claude Code | `.claude/skills/repo-build-skill/` | [Claude Code](../adapters/claude-code.md) |
| Codex | `.agents/skills/repo-build-skill/` | [Codex](../adapters/codex.md) |
| Gemini (via Antigravity CLI) | `.agents/skills/repo-build-skill/` | [Gemini integration](../adapters/gemini-antigravity.md) |
| Cursor | `.cursor/skills/repo-build-skill/` | [Cursor](../adapters/cursor.md) |
| AGENTS.md | `.agents/skills/repo-build-skill/` and a marked router block | [Generic agent](../adapters/agents-md.md) |
| Chat upload | Generated bundle for upload | [Chat](../adapters/chat-upload.md) |

Project scope uses the existing directory passed with `--dir`.
User scope uses the user's home and requires explicit `--scope user`; the generic AGENTS.md and chat routes use project scope.
The installer leaves existing routers in place; only the generic target adds its own marked block.

## Command interface

```sh
npx repo-build-skill --host codex --scope project --dir . --dry-run
npx repo-build-skill --host codex --scope project --dir . --yes
npx repo-build-skill --host claude-code --scope user --yes
```

`--host` accepts the identifiers in the [install guide](install.md).
`--target` is an alias for `--host`; `--project` and `--user` select scope.
`--dry` is an alias for `--dry-run`.
A headless install supplies `--host` and `--yes`; EOF with an incomplete choice returns a usage error.
Dry-run writes nothing, including directories and receipts.
Preflight examines the whole intended file set before writing.
Conflicting bytes stop the operation; identical bytes are a no-op.
The package does not run vendor logins, install companion tools or write global vendor configuration.

## Upgrade and shared destinations

Running the installer again upgrades the package: an owned file whose bytes still equal the install-time digest in the receipt is replaced by the new version, and the receipt records the new digest.
A file you edited is a conflict; the installer stops before writing and names it.
Package files may be hard-linked by a package manager; installed files may not be.
Codex and Gemini (via Antigravity CLI) both read `.agents/skills/repo-build-skill/`, so they are one install.
The second host reports "already installed for" the first and records itself in the receipt's `hosts` list.
Uninstalling one of two registered hosts removes it from the list and keeps the files; the last host removes them.
The generic AGENTS.md route writes a router block as well, so it keeps its own receipt ownership.

## Receipts

The receipt sits inside the installed target as `.repo-build-skill-receipt.json`.
It names the package/version, host, scope, destination, install date and activation status.
Every owned path carries an install-time SHA-256 digest and its write action.
A pre-existing identical file is marked `identical` and remains the user's property.
The receipt records directories created and the generic router block when one is added.
The write pass reads installed bytes back before recording success.
Installation starts activation as UNVERIFIED; the host check supplies the separate activation evidence.
Keep working stage receipts in the user's `.repo-build/work/`, separate from install ownership.

## Uninstall

```sh
npx repo-build-skill --uninstall --host codex --scope project --dir . --dry-run
npx repo-build-skill --uninstall --host codex --scope project --dir . --yes
```

Use the same host, scope and destination as installation.
`--receipt` accepts a receipt path inside that target.
The destination is derived from explicit options, never trusted from an edited receipt.
The safe removal shape is:

1. Canonicalize the explicitly chosen root and validate receipt ownership before mutation.
2. Accept only safe relative paths inside the host's target; refuse traversal and absolute paths.
3. Refuse symlinks and shared file links in owned paths, and re-check paths when acting.
4. Remove only owned files whose current bytes match the install-time digest.
5. Preserve edited files, pre-existing identical files and files outside the receipt.
6. Remove only the unchanged marked router block; preserve the surrounding instructions.
7. Keep the receipt while edited owned content remains, and remove only empty created directories.
8. List every retained item and hand step so the owner can finish removal knowingly.

The installer validates all observed bytes before the first uninstall mutation and checks them again before each change.
Interrupted operations report what remained for review.
Chat bundles and manually added references are removed by the user.

## Manual copy and verification

Copy the whole `skills/repo-build-skill/` directory to the target in a new, empty destination.
Preserve existing conflicting files and compare them before installing.
Read the entrypoint and a stage file from the chosen host; use the adapter's loading check.
For chat, upload [the bundle](bundles/chat-upload.md) and ask the host to start at the current stage.
Manual copies have no installer receipt; the owner reviews their own changes before removing them.
`test/installer.test.mjs` covers dry-run, conflicts, receipts, symlinks, reruns and changed-file preservation.
