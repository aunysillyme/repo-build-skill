# Chat upload

Use a generated single-file bundle in a chat that accepts documents. The skill teaches the AI how to frame, write, release and launch a repository; give the AI access to the project or exchange the named artifacts as the work proceeds.

## Open the bundle

```sh
npx repo-build-skill --host chat-upload
```

This route prints the packaged bundle path under `docs/bundles/`; it writes no host files and needs no confirmation. Upload the indicated Markdown file, then ask the chat to use repo-build-skill for the one stage you need. Use the same reviewed release for the bundle and any attached assets.

## Check that it loaded

Native loading on this host is awaiting a real-client trial; the check below confirms it on yours.

Ask the chat to identify the uploaded bundle, state the selected route, quote that route's GOAL and identify the artifacts it needs. Give it a synthetic brief and confirm it starts with the route's checks. Record the client, date, file version, available tools and observed action.

If the chat cannot reach the web, it marks live facts UNVERIFIED and continues the independent work. If it cannot read or edit a repository, supply the requested file bodies and save its concrete output yourself. Each gate still needs evidence from the actual project.

## Manual fallback

Open the release's `docs/bundles/` directory and upload its generated Markdown bundle directly. If uploading is unavailable, paste the bundle in labelled parts with filenames and ask the chat to confirm it has every part before starting. Keep facts and working receipts in the user's repository rather than modifying the uploaded skill.

## Uninstall

Remove the uploaded document and any instructions you pasted into the chat or its persistent settings. The `--uninstall --host chat-upload` route prints that manual step. Project artifacts created during the work belong to the project; review them individually when removing them.

See [the installer](../docs/INSTALLER.md) and [compatibility](../docs/COMPATIBILITY.md) for the distinction between installing files and observing a host load.
