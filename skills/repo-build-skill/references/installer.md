# Installer

Teach an installer that gets a user to a working first action with one command and one confirm. Choose roles from the user's existing stack. Point to other people's tools and their official install instructions; never install those tools on the user's behalf.

## Install contract

Show the target scope, paths, file changes, retained data and real manual steps before confirmation. Support project scope by default when the host accepts it. Offer a deterministic headless route with explicit host, directory, scope and confirmation flags. A dry run prints the same plan as a real run while writing nothing.

Keep one canonical skill folder. Copy the complete folder so relative references resolve. Use a marked block when integrating with an existing instruction file. Preserve unrelated content and stop on a conflict. Test the installed package in a clean directory rather than only importing its source.

Write a receipt with package name and version, host, scope, destination, install timestamp, paths, actions and install-time hashes. Distinguish created files from identical pre-existing files and marked blocks. Read files back before reporting installation. Report host activation separately and give the user a small real-client loading check.

## Eight safe uninstall rules

1. Remove only files this install wrote and whose bytes still match their install-time hash. Later package versions must use the saved hash, because re-rendering can differ.
2. In a file the user already had, remove only the exact marked block and preserve surrounding text.
3. Refuse traversal, absolute paths and symlinks. Validate path ownership and re-probe before every removal.
4. Remove a directory only if this install created it and it is empty.
5. Remove the receipt or install manifest last. Retain it when edited content still needs review.
6. Make `--dry-run` describe the real removal plan, including preserved edits.
7. Treat a missing receipt as a usage error, exit 2, and name its path.
8. Print the manual steps for references or pasted instructions the user added by hand.

An uninstall test installs, removes and checks the resulting tree. Additional controls preserve edited files, pre-existing identical files, adjacent instructions and paths outside the target. A retry must still identify the remaining owned files.

## This pack's route

Run `npx repo-build-skill`, select the host, review the preview and confirm. For automation: `npx repo-build-skill --host codex --scope project --dir . --yes`. Preview removal with `npx repo-build-skill --uninstall --host codex --dry-run`; apply it with `npx repo-build-skill --uninstall --host codex --yes`.

The host adapter names the actual target. Each receipt lives inside that target as `.repo-build-skill-receipt.json`. Chat upload prints the bundle path and its removal step instead of writing host files.
