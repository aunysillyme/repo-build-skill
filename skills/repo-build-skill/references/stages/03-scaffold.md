# Scaffold

## GOAL

Create the professional floor and a safe path to the public flip.

## NEEDS

Frame facts, `docs/STACK.md`, the selected manifest and acceptance checks. Make the small missing prerequisite first.

## RE-CHECK

| Fact | Official source | Window |
|---|---|---|
| Community health defaults | [GitHub community files](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/creating-a-default-community-health-file) | 30 days |
| Action versions and full SHAs | Each action's official releases and commit history | 30 days |
| Public visibility and security settings | [GitHub security documentation](https://docs.github.com/en/code-security) | 30 days |
| Code of conduct text and attribution | [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/) | Ask date |

Record each read in `.repo-build/work/sources.md` with claim, URL, source date, access date, window, expires and stage. Offline facts stay UNVERIFIED while work proceeds.

## DO

1. Create the floor below from the chosen templates, because contributors need predictable entry points.
2. Add `.repo-build/work/` to `.gitignore`; keep facts and configuration committed, because private working notes and CI inputs have different lifecycles.
3. Check the owner's account-level `.github` defaults for CONTRIBUTING, SECURITY, SUPPORT, forms and funding before adding overrides, because a repo override replaces that inherited file or form set.
4. Write local LICENSE and AGENTS.md; these need repo-specific copies. Explain the chosen CLA or DCO in CONTRIBUTING so contributors know the grant before contributing.
5. Fetch the chosen code of conduct from its official source on the ask date and keep its attribution block, so conduct guidance retains its provenance.
6. Give feature forms an Observable success check field and bugs reproduction steps, so incoming requests can be verified.
7. Pin remote actions to full commit SHAs with version comments, set read-only default permissions, disable checkout credential persistence and pass untrusted event data through environment variables, because workflows run contributed inputs.
8. Set a package `files` allowlist and verify bin targets are included, so the release contains only the intended product.
9. Prepare the public-flip commands below and read their results back after the owner acts, because account plan and visibility determine availability.

### Professional floor

Create README.md, LICENSE, CREDITS.md, CHANGELOG.md, CONTRIBUTING.md, CODE_OF_CONDUCT.md, SECURITY.md, MAINTAINERS.md, RELEASING.md, AGENTS.md, CLAUDE.md, llms.txt and docs/README.md. Add issue forms, a pull request template, CODEOWNERS, Dependabot and a check workflow under `.github/`.

A solo maintainer can defer a governance board, a separate public planning board and release milestones until they serve actual users. Keep ownership, security reporting and contribution instructions concrete.

### Settings at the public flip

Set `REPO=owner/repo` and use the actual default branch. Read the linked GitHub docs on the ask date before applying these owner-approved commands. Set private vulnerability reporting:

```sh
gh api --method PUT "repos/$REPO/private-vulnerability-reporting"
gh api "repos/$REPO/private-vulnerability-reporting"
```

Enable secret scanning and push protection, then read the values:

```sh
gh api --method PATCH "repos/$REPO" --input - <<'JSON'
{"security_and_analysis":{"secret_scanning":{"status":"enabled"},"secret_scanning_push_protection":{"status":"enabled"}}}
JSON
gh api "repos/$REPO" --jq .security_and_analysis
```

Enable Dependabot alerts and security updates; the GET/HEAD response verifies each switch:

```sh
gh api --method PUT "repos/$REPO/vulnerability-alerts"
gh api --method PUT "repos/$REPO/automated-security-fixes"
gh api --method GET "repos/$REPO/vulnerability-alerts" --include
gh api "repos/$REPO/automated-security-fixes"
```

Configure CodeQL default setup:

```sh
gh api --method PATCH "repos/$REPO/code-scanning/default-setup" -f state=configured
gh api "repos/$REPO/code-scanning/default-setup"
```

Protect the default branch against force-push and deletion. Replace the required check with its stable aggregate name:

```sh
gh api --method PUT "repos/$REPO/branches/main/protection" --input - <<'JSON'
{"required_status_checks":{"strict":true,"contexts":["Repository checks"]},"enforce_admins":false,"required_pull_request_reviews":null,"restrictions":null,"allow_force_pushes":false,"allow_deletions":false}
JSON
gh api "repos/$REPO/branches/main/protection"
```

Review Sponsorships in the repository settings, the package funding link and inherited FUNDING.yml together. Verify the public community profile with `gh api "repos/$REPO/community/profile"`.

## READERS

| Reader | What they get |
|---|---|
| People | Community files, forms and a docs index. |
| Agents | AGENTS.md as the instruction source with CLAUDE.md importing it. |
| Answer engines | An llms.txt skeleton with labelled links. |
| Registries | Metadata stubs and a package allowlist. |

## OWNER'S HANDS

HANDS: approve the public flip in `https://github.com/<owner>/<repo>/settings`. After approval, `gh repo edit "$REPO" --visibility public --accept-visibility-change-consequences` makes it public. Apply and read back the settings in Settings at the public flip in that same pass.

## LEAVE

Leave populated floor files, issue forms, pinned CI, manifest metadata and `.repo-build/work/receipts/03-scaffold.json`. Record each setting's command, response and access date in `REPO_SETTINGS.md`; unavailable settings remain UNVERIFIED.

## GATE

Rows begin BLOCKED. Attach actual output or a dated manual receipt before assigning PASS. Facts awaiting live reads stay UNVERIFIED. Record NOT APPLICABLE with a reason; WAIVED is reserved for review and venue gates with owner, reason and date.

<!-- gate:start -->
| Check | Reject condition | Evidence |
|---|---|---|
| H_FLOOR | Unmet requirement: Every floor file, issue form and check workflow is present and non-empty. | H_FLOOR: checker receipt, initially BLOCKED |
| A_SKILL_SPEC | Unmet requirement: Each SKILL.md has a valid name, description and size. | A_SKILL_SPEC: checker receipt, initially BLOCKED |
| R_META | Unmet requirement: Homepage, repository, bugs and license fields are present. | R_META: checker receipt, initially BLOCKED |
| W_PERMS | Unmet requirement: Every workflow declares read-only or empty default permissions. | W_PERMS: checker receipt, initially BLOCKED |
| W_PIN | Unmet requirement: Every remote action uses forty hex characters and a version comment. | W_PIN: checker receipt, initially BLOCKED |
| W_CREDS | Unmet requirement: Each checkout step sets persist-credentials: false, and a tag-triggered workflow turns package-manager caching off. | W_CREDS: checker receipt, initially BLOCKED |
| W_INJECT | Unmet requirement: No event, head_ref or input interpolation appears in run values or github-script bodies. | W_INJECT: checker receipt, initially BLOCKED |
| P_PATH | Unmet requirement: Home paths use placeholder usernames in contents and filenames. | P_PATH: checker receipt, initially BLOCKED |
| P_EMAIL | Unmet requirement: Email addresses are in the allowlist or a standard example or noreply domain. | P_EMAIL: checker receipt, initially BLOCKED |
| P_TOKEN | Unmet requirement: Token-shaped strings and private key headers are absent. | P_TOKEN: checker receipt, initially BLOCKED |
| P_LIST | Unmet requirement: Untracked list files contain no matches in the public tree or history. | P_LIST: checker receipt, initially BLOCKED |
| O_PVR | Unmet requirement: Public GitHub repositories enable private vulnerability reporting. | O_PVR: checker receipt, initially BLOCKED |
| SC_PUBLIC (HANDS) | The public flip settings await owner action. | Dated public settings read-back. |
<!-- gate:end -->
