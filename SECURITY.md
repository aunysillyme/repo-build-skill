# Security policy

## Report a vulnerability

Use the repository's [Security tab](https://github.com/aunysillyme/repo-build-skill/security) and select **Report a vulnerability** for a private report.
The enabled state is recorded in [REPO_SETTINGS.md](REPO_SETTINGS.md).

Include the affected version, host, command, expected behavior, actual behavior and a minimal reproduction.
Keep credentials and personal data out of attachments.
For an installer issue, include sanitized receipt fields and explain which file changed.
Please keep vulnerability details private while maintainers investigate.

## Supported releases

The latest published minor line, 0.1.x, is supported.
Report against the current published release and include whether the latest checkout reproduces it.
Maintainers aim to acknowledge reports within 7 days and provide a fix or status update within 30 days.
Maintainers investigate privately, agree on a disclosure timeline with the reporter and prepare a fix.
After a fix is available, maintainers coordinate disclosure with the reporter and identify the corrected version in release notes.

## Scope

The installer, uninstall behavior, file handling, checker and release workflows are in scope.
Public issue forms are for ordinary bugs and false positives.
Host account access and vendor services follow each vendor's own security policy.
