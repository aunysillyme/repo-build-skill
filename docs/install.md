# Install and start

Run `npx repo-build-skill` in the project you want your AI to work on.
Choose the host, inspect the paths and confirm once.
Then open that host and ask it to read the installed SKILL.md and select the current stage.
The [compatibility page](COMPATIBILITY.md) links the native-loading check for each host.

## Headless installation

```sh
npx repo-build-skill --host codex --scope project --dir . --dry-run
npx repo-build-skill --host codex --scope project --dir . --yes
```

| Host identifier | Integration |
|---|---|
| `claude-code` | Claude Code |
| `codex` | Codex |
| `gemini-antigravity` | Gemini (via Antigravity CLI) |
| `cursor` | Cursor |
| `agents-md` | Generic AGENTS.md router |
| `chat-upload` | Uploadable Markdown bundle |

Use `--scope user` only when you want user-wide installation on a host that supports it.
Pin a released version with `npx repo-build-skill@VERSION` when reproducing a receipt.
For chat upload, use `npx repo-build-skill --host chat-upload` and upload the bundle it names.
Read the [installer contract](INSTALLER.md) for path safety, receipts and removal.

## First request

> Read repo-build-skill and prepare this repo for its first release. Run the checker first. Use only the current stage's route and leave a receipt. Prepare the owner's publishing steps for review.

A new idea starts at Frame, with a stack card before the first commit.
An existing repo starts with `npx repo-build-skill check . --json`.
A launch-only request starts with Launch venues and fills in the facts it needs.
Without web access the AI continues and marks facts requiring current reads UNVERIFIED.

## Manual route

Copy the complete skill folder into the adapter's target directory, preserving existing files.
Then give your host the installed SKILL.md path explicitly and ask it to load a stage.
The chat bundle is a file upload alternative.
The separate `npx skills add aunysillyme/repo-build-skill` route awaits a published-layout trial.
Plugin validation uses `claude plugin validate --strict .` from a checkout.

## Removal

`npx repo-build-skill --uninstall` previews receipt-owned files and asks for confirmation.
Edited and pre-existing identical files stay in place.
See the [headless uninstall commands](INSTALLER.md#uninstall) for a chosen host.
