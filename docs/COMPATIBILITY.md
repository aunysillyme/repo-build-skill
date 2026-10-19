# Host compatibility

File installation and host activation are separate observations.
The install paths below match `src/catalog.mjs`; real-client loading evidence belongs with each adapter's check.
Documentation snapshot: 2026-10-19. Current vendor loading rules are re-checked on the ask date.

| Host | Project install route | Evidence level and date | Confirm |
|---|---|---|---|
| Claude Code | `npx repo-build-skill --host claude-code --dir . --yes` | Local install contract; snapshot 2026-10-19 | [Adapter check](../adapters/claude-code.md) |
| Codex | `npx repo-build-skill --host codex --dir . --yes` | Local install contract; snapshot 2026-10-19 | [Adapter check](../adapters/codex.md) |
| Gemini (via Antigravity CLI) | `npx repo-build-skill --host gemini-antigravity --dir . --yes` | Local install contract; snapshot 2026-10-19 | [Adapter check](../adapters/gemini-antigravity.md) |
| Cursor | `npx repo-build-skill --host cursor --dir . --yes` | Local install contract; snapshot 2026-10-19 | [Adapter check](../adapters/cursor.md) |
| AGENTS.md host | `npx repo-build-skill --host agents-md --dir . --yes` | Local marked-router contract; snapshot 2026-10-19 | [Adapter check](../adapters/agents-md.md) |
| File-capable chat | `npx repo-build-skill --host chat-upload` | Generated bundle contract; snapshot 2026-10-19 | [Adapter check](../adapters/chat-upload.md) |

Use `--scope project` explicitly when scripting; user scope is an explicit choice on supported hosts.
Each adapter states the real-client status at the place where you perform its loading check.
Record the host version, date, installed entrypoint and the stage it actually loaded after your trial.
A manual fallback supplies the SKILL.md path or uploads the generated bundle.

## Package and plugin routes

The package uses the runtime floor in `package.json`.
`claude plugin validate --strict .` validates plugin structure; this is the MEASURED mechanism described by the release card.
`npx skills add aunysillyme/repo-build-skill` is awaiting its public-layout trial.
The maintainer records the resulting target path and client loading result after that trial.

## Browser access

The skill reads current official sources through the AI host's available web tools.
Without those tools, it proceeds with UNVERIFIED re-check facts and related gates.
The local installer and offline checker work after package retrieval.
Online checker mode requests reachability and reports an online failure separately.
