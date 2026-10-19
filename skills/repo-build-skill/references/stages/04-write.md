# README / AGENTS.md / llms.txt

## GOAL

Write connected entry points for people, coding agents and answer engines.

## NEEDS

Frame facts, acceptance checks, scaffold and the chosen command surface. Make the small missing prerequisite first.

## RE-CHECK

| Fact | Official source | Window |
|---|---|---|
| Host instruction loading | [AGENTS.md](https://agents.md/) and [Claude Code memory](https://code.claude.com/docs/en/memory) | 90 days |
| llms.txt format | [llms.txt proposal](https://llmstxt.org/) | 90 days |

Record each read in `.repo-build/work/sources.md` with claim, URL, source date, access date, window, expires and stage. Offline facts stay UNVERIFIED while work proceeds.

## DO

1. Show the owner a first-screen mock with title, badges, bold lead, problem, what people get, what they can do and install command, so positioning is approved before the full README.
2. Write the README in that order, then proof, capability table, activation and a real run, related set, feature commands, Common questions, uninstall, agent links, docs, contributions, credits and license, so depth follows the reader's decision.
3. Keep front-page fenced blocks at eight lines or fewer and move full output into docs, because a capability table is easier to scan than a terminal dump.
4. Quote every capability against the implementation and re-run each printed number, because clear copy still needs accurate evidence.
5. Write AGENTS.md under 200 lines with Use this skill or product and Contribute sections, exact existing commands and gotchas; put always-true rules in tests and link those tests, so instructions stay useful and enforceable.
6. Make CLAUDE.md an H1, a sentence naming AGENTS.md as the single source and the exact line `@AGENTS.md`, so the supported import route reads one instruction source.
7. Generate llms.txt with H1, facts lead as blockquote, install line and linked sections using labelled absolute release-tagged URLs, so agents can follow stable documents.
8. Write search-phrased Common questions with short answer-first paragraphs and the exact command; derive description and keywords from facts, so humans and retrieval systems see the same answers.
9. State support awaiting a real-client trial once, positively, at its action point, because the reader needs the evidence level before relying on it.
10. Apply the private name map and plan proof on screen below; check links and replay the acceptance checks, so public text and visual claims match the final product.

### Proof on screen

Plan a 10-15 s trailer: show the result, the real command and the useful outcome. Get keyframes approved before animation. Every command must exist; numbers come only from the package's `proof/results.json`. Use the stage or capability table in the trailer slot until the trailer exists.

Put the terminal recording beside installation details. Record the published package from a clean directory outside its own repo, using a version-pinned install such as `npx <package>@<version>`. A checkout can resolve its own package instead of the published one. Inspect the last frame and the hosted image before linking it.

### Private name map

Keep a private table under `.repo-build/work/` with internal name, public name and where it appears. Give your own tools one public prefix. Replace internal names in files, filenames and release text; public platform and third-party project names retain their identities.

A test reads only the internal column and fails on any hit in the public tree. Keep that column private; a committed test can store hashes of its terms instead. Allow public brand, official domains and credited upstream names. House writing rules become tests, so the next edit receives the same checks.

## READERS

| Reader | What they get |
|---|---|
| People | A first screen, useful feature table and a real example. |
| Agents | Use and contribute instructions with runnable commands. |
| Answer engines | Labelled absolute links and answer-first sections. |
| Registries | One description and keyword source. |

## OWNER'S HANDS

HANDS: approve the first-screen mock and trailer keyframes before final production. Read the actual rendered README on `https://github.com/<owner>/<repo>` after the public flip.

## LEAVE

Leave README.md, AGENTS.md, CLAUDE.md, generated llms.txt, linked docs, a private name map, a proof storyboard and `.repo-build/work/receipts/04-write.json`.

## GATE

Rows begin BLOCKED. Attach actual output or a dated manual receipt before assigning PASS. Facts awaiting live reads stay UNVERIFIED. Record NOT APPLICABLE with a reason; WAIVED is reserved for review and venue gates with owner, reason and date.

<!-- gate:start -->
| Check | Reject condition | Evidence |
|---|---|---|
| H_INSTALL | Unmet requirement: The install command occurs in the first forty lines. | H_INSTALL: checker receipt, initially BLOCKED |
| H_FENCE | Unmet requirement: Fenced README blocks have at most eight lines or a reasoned allow marker. | H_FENCE: checker receipt, initially BLOCKED |
| H_FAQ | Unmet requirement: Common questions contains four to six H3 headings. | H_FAQ: checker receipt, initially BLOCKED |
| H_LINK | Unmet requirement: Relative Markdown links and heading anchors exist. | H_LINK: checker receipt, initially BLOCKED |
| H_ABSENCE | Unmet requirement: Headings describe the content they give. | H_ABSENCE: checker receipt, initially BLOCKED |
| A_AGENTS | Unmet requirement: AGENTS.md has use and contribute headings and fewer than 200 lines. | A_AGENTS: checker receipt, initially BLOCKED |
| A_IMPORT | Unmet requirement: CLAUDE.md includes the exact line @AGENTS.md. | A_IMPORT: checker receipt, initially BLOCKED |
| A_CMD | Unmet requirement: Every npm run command named in AGENTS.md exists in package scripts. | A_CMD: checker receipt, initially BLOCKED |
| M_LLMS_SHAPE | Unmet requirement: An H1, blockquote and sections with labelled absolute links exist. | M_LLMS_SHAPE: checker receipt, initially BLOCKED |
| M_LLMS_LEAD | Unmet requirement: The llms.txt blockquote equals facts.lead. | M_LLMS_LEAD: checker receipt, initially BLOCKED |
<!-- gate:end -->
