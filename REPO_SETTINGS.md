# Repository settings

These values were set and read back with `gh api` in the public flip pass on 2026-10-19.
The npm row was read back after 0.1.1 published from GitHub Actions on 2026-10-19.

## Metadata

Description: Skill pack that teaches your AI to build, release and launch a GitHub repo: stack pick, README, AGENTS.md, llms.txt, repo SEO and AEO, trusted publishing.

Homepage: https://www.npmjs.com/package/repo-build-skill

Repository: https://github.com/aunysillyme/repo-build-skill

Topics: agent-skills, skill-pack, claude-skills, claude-code, codex, agents-md, llms-txt, readme, github, open-source, repository, github-seo, seo, aeo, npm, pypi, trusted-publishing, provenance, release-automation, developer-tools

Source of truth: [.repo-build/facts.json](.repo-build/facts.json) and [package.json](package.json).
Use GitHub's default repository link preview.

## Settings at the public flip

| Setting | Target | Read-back (2026-10-19) |
|---|---|---|
| Visibility | Public, after owner authorization and privacy checks | `public` |
| Private vulnerability reporting | Enabled | `{"enabled": true}` |
| Secret scanning | Enabled | `enabled` |
| Secret scanning push protection | Enabled | `enabled` |
| Dependabot alerts and security updates | Enabled | alerts `204`, security updates `enabled` |
| CodeQL default setup | Enabled for the supported language | `configured`; languages fill in after the first analysis run |
| Main branch protection | Force pushes and branch deletion disabled | force pushes `false`, deletions `false` |
| Required check | Repository checks | `["Repository checks"]` |
| Administrator enforcement | Disabled for maintainer-reviewed automation PRs | `false` |
| Sponsorships | Enabled with account-default funding links | `hasSponsorshipsEnabled: true` |
| Description and topics | Match package.json and facts.json | description equal, 20 topics |
| npm listing | Version, description, README, bin, funding and homepage match the tag | `0.1.1` equals tag `v0.1.1` (`scripts/verify-registry.sh` PASS), provenance attested |

The [Scaffold settings instructions](skills/repo-build-skill/references/stages/03-scaffold.md#settings-at-the-public-flip) provide the exact API commands.
Run `npx repo-build-skill check . --online` after setting the public values.
Community files and workflow settings are declared in the repository and checked by the suite.
