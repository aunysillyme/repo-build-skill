# Cloudflare Workers release

**Evidence: DOCUMENTED.** Read [Workers CI/CD](https://developers.cloudflare.com/workers/ci-cd/external-cicd/) and [versions and deployments](https://developers.cloudflare.com/workers/configuration/versions-and-deployments/) on the ask date. Record the current credential route, CLI requirements and rollback behavior before acting.

## Mechanism

A Worker is a deployed service. Build and test a version, record the current deployment id, upload the prepared bundle and promote that exact version. Smoke-test the public route and record its deployed identity. Separate infrastructure changes from application deployment when rollback behavior differs.

## Runtime and CLI floors

Pin the Wrangler version and a supported Node line. Set a deliberate compatibility date and required flags. Read current binding APIs, limits and migration behavior for the Worker in scope; do not infer them from a different service's deployment.

## First publish

The owner selects the account, service, routes, billing limits and bindings. Prepare `npx wrangler deploy --dry-run --outdir DIST` and test the bundle before handing over the approved deploy command. Record the service's current version first so rollback has a concrete target.

## Trust setup

Use the platform's documented CI integration or a narrowly scoped Cloudflare API token injected by the CI secret store. This credential route differs from registry OIDC exchange. Scope it to the intended account and deployment resources, keep it out of command arguments and logs, and record rotation ownership.

## Workflow asset

Create a Worker-specific workflow from the current Cloudflare documentation. Keep build/test and promotion explicit, retain artifact identity across jobs and grant only the permissions required for the chosen credential route. The npm registry upload asset is a reference for structure; this destination needs its own deployment steps.

## Verify command

```sh
npx wrangler deployments list
npx wrangler versions list
curl --fail https://PUBLIC_HOST/HEALTH_PATH
```

Replace the host and health path with an actual route. Compare the returned deployment to the intended version and save the smoke-test response. Use `npx wrangler rollback VERSION_ID` only after the owner approves the recorded rollback target and its effects.

## Version sites

List package version, Worker configuration, compatibility date, deployed version id, route mapping and release tag. Treat binding migrations as separate state with their own verification and rollback limits.

## Gotchas

A dry run proves bundle construction, not a live route. A successful promotion still needs public behavior verification. Record any storage migration that a code rollback cannot reverse. Keep secrets in bindings or the approved CI store.
