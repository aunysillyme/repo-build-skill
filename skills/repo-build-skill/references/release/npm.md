# npm release

**Evidence: MEASURED.** The trusted-publishing and provenance route has been exercised on public npm packages. Re-check [npm trusted publishers](https://docs.npmjs.com/trusted-publishers/) and [provenance](https://docs.npmjs.com/generating-provenance-statements/) on the ask date before applying it to a new package.

## Mechanism

GitHub Actions exchanges its OIDC identity for a short-lived npm publish credential. Publish the tested tarball with provenance. The repository and package metadata must identify the public source correctly.

## Runtime and CLI floors

The documented floor carried into this card is Node 22.14.0 and npm 11.5.1. Confirm current support on the ask date. Pin the exact npm version used by CI; the supplied asset pins npm 12.2.0. Read the runtime's current maintenance dates before choosing its line.

## First publish

The owner creates the initial package using `npm publish PACKAGE.tgz --access public` after the public flip and checks `npm view NAME@VERSION version --prefer-online`. A free name lookup is preliminary: npm similarity rules are enforced at publish time. Agree on a scoped fallback before the first attempt.

## Trust setup

The owner opens `https://www.npmjs.com/package/NAME/access` and adds the GitHub Actions trusted publisher with the exact repository, workflow filename and environment. Follow the registry's current settings route if it has moved. A publisher connection is re-created when its identity changes.

## Workflow asset

Adapt `assets/workflows/release-npm.yml`. The verify job (read-only token) checks tag/version equality, installs, tests, builds, packs once, installs that tarball in a temporary project and uploads it as an artifact. The publish job holds `id-token: write`, runs no install, build or package script, downloads the artifact and publishes that exact file with `npm publish ./release/PACKAGE.tgz --provenance --access public`.

## Verify command

```sh
npm view NAME@VERSION version dist.attestations --prefer-online
npm view NAME@VERSION description bin homepage repository funding --json
npm view NAME@VERSION readme
```

Compare the returned README and metadata to the release tag and save the attestation response. Test the published command outside the source checkout after propagation.

## Version sites

Update `package.json`, both version fields in `package-lock.json`, and any plugin or skill version fields the package ships. Require `vVERSION` to identify those values.

## Gotchas

A private repository cannot supply npm provenance through this route. A successful job can precede registry propagation. A copy-only correction still needs a release so the registry README catches up. Keep registry verification separate from CI status.
