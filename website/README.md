# repo-build-skill website

The site uses the current lean-computer-use layout and builds its shared Projects menu and related repository links from `.repo-build/set.json`. Product facts come from `.repo-build/facts.json` and `package.json`.

Run `node website/build.mjs` followed by `node website/check.mjs` to build and check `website/dist`. Run `node website/security.mjs --write` after changing the security policy, then check the generated `vercel.json` with `node website/security.mjs --check`. The approved Projects popup files are copied from the shared component and should remain in sync with it.

The owner creates the hosting project and domain and completes publication. Live search and structured-data requirements remain subject to current-source verification.
