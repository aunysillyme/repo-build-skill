# Repository checks

## H_LEAD: One clear lead

Reader: people. Stage: 01-frame. Severity: error.

Why: The first screen gives the reader a definition.

Pass: A bold lead in the first ten lines equals facts.lead.

Learn: [Stage reference](https://github.com/aunysillyme/repo-build-skill/blob/v0.1.0/skills/repo-build-skill/references/stages/01-frame.md#gate)

## H_INSTALL: Install on the first screen

Reader: people. Stage: 04-write. Severity: error.

Why: A reader can try the project immediately.

Pass: The install command occurs in the first forty lines.

Learn: [Stage reference](https://github.com/aunysillyme/repo-build-skill/blob/v0.1.0/skills/repo-build-skill/references/stages/04-write.md#gate)

## H_FENCE: Short front-page examples

Reader: people. Stage: 04-write. Severity: warn.

Why: Short examples leave room for what the tool gives.

Pass: Fenced README blocks have at most eight lines or a reasoned allow marker.

Learn: [Stage reference](https://github.com/aunysillyme/repo-build-skill/blob/v0.1.0/skills/repo-build-skill/references/stages/04-write.md#gate)

## H_FAQ: Common questions answer searches

Reader: people. Stage: 04-write. Severity: warn.

Why: Question headings make answers easy to find.

Pass: Common questions contains four to six H3 headings.

Learn: [Stage reference](https://github.com/aunysillyme/repo-build-skill/blob/v0.1.0/skills/repo-build-skill/references/stages/04-write.md#gate)

## H_UNINSTALL: Explain removal

Reader: people. Stage: 02-stack. Severity: error.

Why: People can reverse an install.

Pass: An installer has an uninstall command in README.

Learn: [Stage reference](https://github.com/aunysillyme/repo-build-skill/blob/v0.1.0/skills/repo-build-skill/references/stages/02-stack.md#gate)

## H_FLOOR: Professional repository files

Reader: people. Stage: 03-scaffold. Severity: error.

Why: Community files explain use, contribution and maintenance.

Pass: Every floor file, issue form and check workflow is present and non-empty.

Learn: [Stage reference](https://github.com/aunysillyme/repo-build-skill/blob/v0.1.0/skills/repo-build-skill/references/stages/03-scaffold.md#gate)

## H_LINK: Local links resolve

Reader: people. Stage: 04-write. Severity: error.

Why: Readers can follow the promised next step.

Pass: Relative Markdown links and heading anchors exist.

Learn: [Stage reference](https://github.com/aunysillyme/repo-build-skill/blob/v0.1.0/skills/repo-build-skill/references/stages/04-write.md#gate)

## H_ABSENCE: Headings name useful content

Reader: people. Stage: 04-write. Severity: warn.

Why: Positive headings say what the reader gets.

Pass: Headings describe the content they give.

Learn: [Stage reference](https://github.com/aunysillyme/repo-build-skill/blob/v0.1.0/skills/repo-build-skill/references/stages/04-write.md#gate)

## A_AGENTS: Agent instructions cover use and contribution

Reader: agents. Stage: 04-write. Severity: error.

Why: Agents need commands and project context.

Pass: AGENTS.md has use and contribute headings and fewer than 200 lines.

Learn: [Stage reference](https://github.com/aunysillyme/repo-build-skill/blob/v0.1.0/skills/repo-build-skill/references/stages/04-write.md#gate)

## A_IMPORT: One agent instruction source

Reader: agents. Stage: 04-write. Severity: warn.

Why: An import keeps host instructions in sync.

Pass: CLAUDE.md includes the exact line @AGENTS.md.

Learn: [Stage reference](https://github.com/aunysillyme/repo-build-skill/blob/v0.1.0/skills/repo-build-skill/references/stages/04-write.md#gate)

## A_CMD: Documented script commands exist

Reader: agents. Stage: 04-write. Severity: error.

Why: A command should work when copied.

Pass: Every npm run command named in AGENTS.md exists in package scripts.

Learn: [Stage reference](https://github.com/aunysillyme/repo-build-skill/blob/v0.1.0/skills/repo-build-skill/references/stages/04-write.md#gate)

## A_SKILL_SPEC: Skills follow the portable format

Reader: agents. Stage: 03-scaffold. Severity: error.

Why: A host can identify a skill from its metadata.

Pass: Each SKILL.md has a valid name, description and size.

Learn: [Stage reference](https://github.com/aunysillyme/repo-build-skill/blob/v0.1.0/skills/repo-build-skill/references/stages/03-scaffold.md#gate)

## M_LLMS_SHAPE: A readable llms.txt index

Reader: answer-engines. Stage: 04-write. Severity: error.

Why: Agents and search readers get a labelled map.

Pass: An H1, blockquote and sections with labelled absolute links exist.

Learn: [Stage reference](https://github.com/aunysillyme/repo-build-skill/blob/v0.1.0/skills/repo-build-skill/references/stages/04-write.md#gate)

## M_LLMS_LEAD: One lead across readers

Reader: answer-engines. Stage: 04-write. Severity: error.

Why: A shared definition keeps summaries accurate.

Pass: The llms.txt blockquote equals facts.lead.

Learn: [Stage reference](https://github.com/aunysillyme/repo-build-skill/blob/v0.1.0/skills/repo-build-skill/references/stages/04-write.md#gate)

## M_ENTITY: One product name

Reader: answer-engines. Stage: 05-discover. Severity: error.

Why: One entity name keeps registry and repository answers aligned.

Pass: README and llms.txt H1 headings equal the manifest product name.

Learn: [Stage reference](https://github.com/aunysillyme/repo-build-skill/blob/v0.1.0/skills/repo-build-skill/references/stages/05-discover.md#gate)

## R_DESC: One compact description

Reader: registries. Stage: 05-discover. Severity: error.

Why: Search cards use the same definition as the package.

Pass: Description has at most 160 characters and all declared copies agree.

Learn: [Stage reference](https://github.com/aunysillyme/repo-build-skill/blob/v0.1.0/skills/repo-build-skill/references/stages/05-discover.md#gate)

## R_TOPICS: Search topics use registry keywords

Reader: registries. Stage: 05-discover. Severity: error.

Why: Topics describe the same package across surfaces.

Pass: At most twenty slug topics, each also a keyword.

Learn: [Stage reference](https://github.com/aunysillyme/repo-build-skill/blob/v0.1.0/skills/repo-build-skill/references/stages/05-discover.md#gate)

## R_META: Package metadata connects its surfaces

Reader: registries. Stage: 03-scaffold. Severity: error.

Why: People can find the project, license and support route.

Pass: Homepage, repository, bugs and license fields are present.

Learn: [Stage reference](https://github.com/aunysillyme/repo-build-skill/blob/v0.1.0/skills/repo-build-skill/references/stages/03-scaffold.md#gate)

## R_VERSION: Version sites agree

Reader: registries. Stage: 06-release. Severity: error.

Why: The same release is named on every package surface.

Pass: Manifest, lock and plugin versions equal package version.

Learn: [Stage reference](https://github.com/aunysillyme/repo-build-skill/blob/v0.1.0/skills/repo-build-skill/references/stages/06-release.md#gate)

## R_FILES: Publish only the reviewed files

Reader: registries. Stage: 06-release. Severity: error.

Why: An allowlist defines what a user receives.

Pass: A files allowlist covers binary targets and lifecycle install scripts are absent.

Learn: [Stage reference](https://github.com/aunysillyme/repo-build-skill/blob/v0.1.0/skills/repo-build-skill/references/stages/06-release.md#gate)

## W_PERMS: Declare least privilege

Reader: registries. Stage: 03-scaffold. Severity: error.

Why: A default read token limits a compromised step.

Pass: Every workflow declares read-only or empty default permissions.

Learn: [Stage reference](https://github.com/aunysillyme/repo-build-skill/blob/v0.1.0/skills/repo-build-skill/references/stages/03-scaffold.md#gate)

## W_OIDC: Publish identity stays in the publish job

Reader: registries. Stage: 06-release. Severity: error.

Why: Identity permission belongs to the release step that needs it.

Pass: Only a job named publish declares id-token: write.

Learn: [Stage reference](https://github.com/aunysillyme/repo-build-skill/blob/v0.1.0/skills/repo-build-skill/references/stages/06-release.md#gate)

## W_PIN: Actions use full SHA pins and version comments

Reader: registries. Stage: 03-scaffold. Severity: error.

Why: A commit pin identifies the exact action code.

Pass: Every remote action uses forty hex characters and a version comment.

Learn: [Stage reference](https://github.com/aunysillyme/repo-build-skill/blob/v0.1.0/skills/repo-build-skill/references/stages/03-scaffold.md#gate)

## W_CREDS: Checkout leaves credentials out of git

Reader: registries. Stage: 03-scaffold. Severity: error.

Why: Later commands need only their explicit permissions.

Pass: Each checkout step sets persist-credentials: false.

Learn: [Stage reference](https://github.com/aunysillyme/repo-build-skill/blob/v0.1.0/skills/repo-build-skill/references/stages/03-scaffold.md#gate)

## W_INJECT: Treat event values as data

Reader: registries. Stage: 03-scaffold. Severity: error.

Why: Untrusted event text must not become shell code.

Pass: No github.event interpolation appears in run values.

Learn: [Stage reference](https://github.com/aunysillyme/repo-build-skill/blob/v0.1.0/skills/repo-build-skill/references/stages/03-scaffold.md#gate)

## W_TAG: Check the release tag before publishing

Reader: registries. Stage: 06-release. Severity: error.

Why: A tag must identify the artifact version being published.

Pass: A version comparison precedes the publish job or publish command.

Learn: [Stage reference](https://github.com/aunysillyme/repo-build-skill/blob/v0.1.0/skills/repo-build-skill/references/stages/06-release.md#gate)

## P_PATH: Keep home paths private

Reader: registries. Stage: 03-scaffold. Severity: error.

Why: Local usernames are private environment details.

Pass: Home paths use placeholder usernames in contents and filenames.

Learn: [Stage reference](https://github.com/aunysillyme/repo-build-skill/blob/v0.1.0/skills/repo-build-skill/references/stages/03-scaffold.md#gate)

## P_EMAIL: Publish only approved contact addresses

Reader: registries. Stage: 03-scaffold. Severity: error.

Why: A contact address should be an explicit public choice.

Pass: Email addresses are in the allowlist or a standard example or noreply domain.

Learn: [Stage reference](https://github.com/aunysillyme/repo-build-skill/blob/v0.1.0/skills/repo-build-skill/references/stages/03-scaffold.md#gate)

## P_TOKEN: Keep token-shaped values private

Reader: registries. Stage: 03-scaffold. Severity: error.

Why: A public artifact must not carry access credentials.

Pass: Token-shaped strings and private key headers are absent.

Learn: [Stage reference](https://github.com/aunysillyme/repo-build-skill/blob/v0.1.0/skills/repo-build-skill/references/stages/03-scaffold.md#gate)

## P_LIST: Apply the maintainer privacy lists

Reader: registries. Stage: 03-scaffold. Severity: error.

Why: Private names are supplied locally by the maintainer.

Pass: Untracked list files contain no matches in the public tree or history.

Learn: [Stage reference](https://github.com/aunysillyme/repo-build-skill/blob/v0.1.0/skills/repo-build-skill/references/stages/03-scaffold.md#gate)

## F_PROOF: Dated package measurements

Reader: people. Stage: 09-maintain. Severity: error.

Why: A dated command lets a reader reproduce a number.

Pass: Each row records value, unit, command, measured, expires, package_version and subject package.

Learn: [Stage reference](https://github.com/aunysillyme/repo-build-skill/blob/v0.1.0/skills/repo-build-skill/references/stages/09-maintain.md#gate)

## C_CREDITS: Credit upstream work

Reader: people. Stage: 09-maintain. Severity: error.

Why: A licence and source link preserve the origin of a technique.

Pass: Credits rows contain project, link, licence and use, and README links CREDITS.md.

Learn: [Stage reference](https://github.com/aunysillyme/repo-build-skill/blob/v0.1.0/skills/repo-build-skill/references/stages/09-maintain.md#gate)

## S_DRIFT: Rendered set blocks match the vendor files

Reader: registries. Stage: 09-maintain. Severity: error.

Why: One renderer keeps related repository descriptions aligned.

Pass: README, llms.txt and renderer hash equal the vendored contract.

Learn: [Stage reference](https://github.com/aunysillyme/repo-build-skill/blob/v0.1.0/skills/repo-build-skill/references/stages/09-maintain.md#gate)

## S_STALE: The set lock matches its source

Reader: registries. Stage: 09-maintain. Severity: error.

Why: A maintainer can refresh an adopted set when its source changes.

Pass: The fetched source hash equals the lock hash.

Learn: [Stage reference](https://github.com/aunysillyme/repo-build-skill/blob/v0.1.0/skills/repo-build-skill/references/stages/09-maintain.md#gate)

## O_ABOUT: GitHub About matches facts

Reader: registries. Stage: 05-discover. Severity: error.

Why: Search readers see the same identity on GitHub.

Pass: Description, homepage and topics match the facts source.

Learn: [Stage reference](https://github.com/aunysillyme/repo-build-skill/blob/v0.1.0/skills/repo-build-skill/references/stages/05-discover.md#gate)

## O_REGISTRY: Registry listing matches its tag

Reader: registries. Stage: 06-release. Severity: error.

Why: A registry receipt proves the published artifact.

Pass: Version, description, tagged README and attestation agree.

Learn: [Stage reference](https://github.com/aunysillyme/repo-build-skill/blob/v0.1.0/skills/repo-build-skill/references/stages/06-release.md#gate)

## O_PVR: Private vulnerability reports are enabled

Reader: registries. Stage: 03-scaffold. Severity: error.

Why: Security reports have a private route.

Pass: Public GitHub repositories enable private vulnerability reporting.

Learn: [Stage reference](https://github.com/aunysillyme/repo-build-skill/blob/v0.1.0/skills/repo-build-skill/references/stages/03-scaffold.md#gate)
