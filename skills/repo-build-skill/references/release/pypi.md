# PyPI release

**Evidence: DOCUMENTED.** Read [PyPI trusted publishing](https://docs.pypi.org/trusted-publishers/) and [its GitHub Actions guide](https://docs.pypi.org/trusted-publishers/using-a-publisher/) on the ask date. Record that read before acting; unread live facts remain UNVERIFIED.

## Mechanism

A configured publisher exchanges GitHub's short-lived OIDC identity for a short-lived upload credential. Build a wheel and source distribution once, check them, test the wheel in a clean environment and upload those exact distributions. Read the current attestation support and retain the registry's response.

## Runtime and CLI floors

Choose a supported Python runtime matching `requires-python`. The workflow asset reads TOML with the standard library, requiring Python 3.11 or later for that step. Its build tools are pinned to `build==1.3.0` and `twine==6.2.0`; re-check their supported runtimes and current PyPI requirements before release.

## First publish

The owner can configure a pending publisher at `https://pypi.org/manage/account/publishing/` before the project exists. Confirm the normalized project name and pending publisher fields, then authorize the first tagged workflow. Use TestPyPI for an isolated rehearsal with its own publisher record and destination.

## Trust setup

At the project's Publishing settings, the owner names the exact GitHub owner, repository, workflow filename and optional environment. Grant `id-token: write` only to the upload job. Keep the environment in CI and the trust record identical.

## Workflow asset

Adapt `assets/workflows/release-pypi.yml`. The verify job (read-only token) checks tag/version equality, runs tests, builds distributions, runs `twine check`, installs the wheel in an isolated environment and uploads the distributions as an artifact. The publish job holds `id-token: write`, installs and builds nothing, downloads the artifact into `dist/` and runs only PyPA's official trusted-publishing action, pinned to a full SHA, with `packages-dir: dist/`. Add the package's real entrypoint smoke test to the artifact check.

## Verify command

```sh
curl --fail https://pypi.org/pypi/NAME/VERSION/json
python -m pip index versions NAME
uvx --from NAME==VERSION COMMAND --help
```

Read returned version, URLs, hashes and metadata; compare the registry README to the tag. Replace COMMAND with the declared console script, or test an import for a library. Use an isolated installation for the verification.

## Version sites

List `pyproject.toml`, the package's version source if separate, lock metadata and generated distribution metadata. Confirm the wheel's installed version equals the tag.

## Gotchas

PyPI and TestPyPI identities are distinct. A rejected or reused version needs the documented correction route, typically a new version. Dependency resolution can hide a broken wheel, so inspect distribution contents as well as testing the source tree.
