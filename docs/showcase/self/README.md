# This pack applied to itself

Run `node scripts/showcase.mjs` from the checkout to record the current offline checker run by stage.
The script invokes the declared package binary with `check . --json` and writes a receipt for each manifest route.
The receipts contain the real result rows and checker exit code.
Manual rows keep their status separate from automated checks.

| Stage | Receipt |
|---|---|
| Frame | [01-frame.json](01-frame.json) |
| Stack card | [02-stack.json](02-stack.json) |
| Scaffold | [03-scaffold.json](03-scaffold.json) |
| Write | [04-write.json](04-write.json) |
| Discover | [05-discover.json](05-discover.json) |
| Release | [06-release.json](06-release.json) |
| Product site | [07-site.json](07-site.json) |
| Launch | [08-launch.json](08-launch.json) |
| Maintain | [09-maintain.json](09-maintain.json) |

The source checkout has its stack card in [docs/STACK.md](../../STACK.md).
The root facts file supplies the definition and public metadata.
The skill route files and generated gates form the method this repo publishes.

## Read the evidence

PASS means the corresponding automated check ran and held on that snapshot.
The public settings observation is UNVERIFIED until its live read-back exists.
First publish, trust setup, independent review, acceptance replay and venue submissions stay BLOCKED until their own evidence is recorded.
The generator records these manual rows conservatively; a maintainer updates their real evidence during the release and launch pass.
A receipt with automated PASS rows and manual BLOCKED rows is a useful preparation record.
Release-ready requires the release-stage manual work and current live sources too.

Receipts carry no private authoring setup or model choice.
The package tarball excludes this showcase folder; the public repository keeps it as a reproducible example.
Review the receipts and [privacy checks](../../CHECKER.md#aun-privacy-gate) before committing an updated snapshot.
