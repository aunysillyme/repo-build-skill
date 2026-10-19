# Stack card

Written before the first commit. Each line is a decision the rest of the repo builds on, and each budget that must keep holding is a test.

1. **Runs on:** the command line (Node) for the installer, the checker, set sync and the evals; any AI host that reads Markdown for the skill itself.
2. **The user already has:** Node, for most people who use AI coding hosts. People who work in a chat app paste the zero-install bundle and need nothing else. Each host's current install route is a dated fact, re-checked on the day of the ask.
3. **Install path:** `npx repo-build-skill`; `npx skills add aunysillyme/repo-build-skill`; the Claude plugin marketplace from the repo root; the zero-install bundle.
4. **Budgets:** 0 runtime dependencies; 1 install command and 1 confirm; packed tarball at most 300 KB and unpacked at most 1 MB; `--help` cold start at most 300 ms on the CI Ubuntu runner; `check` offline on a 2,000-file repo in under 2 s; skill folder at most 204,800 bytes, with the largest route (SKILL.md, the date rule, one stage and two cards) at most 26,624 bytes; uninstall leaves 0 files it wrote.
5. **Pick:** JavaScript ESM, type-checked by `tsc --noEmit --checkJs`, with TypeScript and Node's type definitions (@types/node) as the only devDependencies. No build step, so the published files are the reviewed files. `engines.node >=22`; CI runs Node 22, 24 and 26. Node 22 is maintained to 2027-04-30, a dated fact re-checked before that date.
6. **Budget tests:** `test/budgets.test.mjs` checks the dependency count, the packed size from `npm pack --dry-run --json`, the `--help` timing and the skill byte caps from the manifest; `test/installer.test.mjs` checks that uninstall leaves nothing it wrote.
