import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { ROOT, NAME } from '../src/constants.mjs';
import { parseWorkflow, readWorkflow } from '../src/readers/workflow.mjs';
import workflowRules from '../src/check/rules/workflows.mjs';
import { measureHealth, updateHealthIssue } from '../scripts/repo-health.mjs';

const workflowDirectory = path.join(ROOT, '.github', 'workflows');
const templateDirectory = path.join(ROOT, 'skills', NAME, 'assets', 'workflows');
const workflowFiles = (await fs.readdir(workflowDirectory)).filter(file => /\.ya?ml$/.test(file)).map(file => path.join(workflowDirectory, file));
const templateFiles = (await fs.readdir(templateDirectory)).filter(file => /\.ya?ml$/.test(file)).map(file => path.join(templateDirectory, file));

test('the maintained workflows and shipped templates cover the specified jobs', () => {
  assert.deepEqual(workflowFiles.map(file => path.basename(file)).sort(), ['check.yml', 'cla.yml', 'proof.yml', 'release.yml', 'repo-health.yml']);
  assert.deepEqual(templateFiles.map(file => path.basename(file)).sort(), ['check-minimal.yml', 'release-npm.yml', 'release-pypi.yml', 'repo-health.yml']);
  assert.deepEqual(workflowRules.map(rule => rule.id).sort(), ['W_CREDS', 'W_INJECT', 'W_OIDC', 'W_PERMS', 'W_PIN', 'W_TAG']);
});

for (const file of [...workflowFiles, ...templateFiles]) {
  const relative = path.relative(ROOT, file).split(path.sep).join('/');
  test(`${relative} parses and passes all workflow rules`, async () => {
    const text = await fs.readFile(file, 'utf8');
    const parsed = parseWorkflow(text);
    assert.equal(parsed.unreadable, false, `${relative}: ${parsed.error || 'parse failed'}`);
    assert.ok(parsed.data.jobs && Object.keys(parsed.data.jobs).length, 'A workflow has at least one job.');
    const workflow = readWorkflow(relative, text);
    assert.equal(workflow.unreadable, false);
    const context = { workflows: [workflow] };
    for (const rule of workflowRules) {
      assert.equal(rule.applies(context), true, `${rule.id} applies to this workflow.`);
      assert.deepEqual(await rule.run(context), [], `${rule.id} failed for ${relative}`);
    }
  });
}

async function healthFixture(t, facts = { homepage: 'https://homepage.example.org/' }) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'health-fixture-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  await fs.mkdir(path.join(root, '.repo-build'));
  await fs.writeFile(path.join(root, '.repo-build', 'facts.json'), JSON.stringify(facts));
  await fs.writeFile(path.join(root, '.repo-build', 'config.json'), JSON.stringify({ set: { source: 'https://set-source.example.org/set.json' } }));
  await fs.writeFile(path.join(root, 'package.json'), JSON.stringify({ name: 'tiny-fixture', version: '1.0.0', homepage: 'https://fallback.example.org/' }));
  return root;
}

function healthyReport() {
  return {
    version: '1.0.0', exitCode: 0,
    results: [
      { id: 'O_ABOUT', status: 'PASS' },
      { id: 'O_REGISTRY', status: 'PASS' },
      { id: 'S_DRIFT', status: 'PASS' },
      { id: 'S_STALE', status: 'NOT APPLICABLE', message: 'maintainer-run only' },
    ],
  };
}

const issueEnvironment = { GITHUB_REPOSITORY: 'example/tool', GITHUB_TOKEN: ['fixture', 'credential'].join('-') };
const failedHealth = {
  healthy: false, measured: '2026-10-19T00:00:00.000Z',
  findings: [{ id: 'O_ABOUT', status: 'FAIL', message: 'About text differs.' }],
};

function issueFetch(routes, calls) {
  return async (input, options = {}) => {
    const url = new URL(String(input));
    assert.equal(url.origin, 'https://api.github.com');
    assert.equal(options.headers.authorization, `Bearer ${issueEnvironment.GITHUB_TOKEN}`);
    const method = options.method || 'GET';
    const endpoint = `${url.pathname}${url.search}`;
    const key = `${method} ${endpoint}`;
    assert.ok(Object.hasOwn(routes, key), `Unexpected request: ${key}`);
    const body = options.body === undefined ? undefined : JSON.parse(options.body);
    calls.push({ method, endpoint, body });
    const route = routes[key];
    const result = typeof route === 'function' ? route(body) : route;
    return new Response(JSON.stringify(result), { status: 200, headers: { 'content-type': 'application/json' } });
  };
}

test('health forces CI mode and fetches only the homepage when checker reads are stubbed', async t => {
  const root = await healthFixture(t);
  const requests = [];
  const env = { CI: '', GITHUB_REPOSITORY: 'example/tool' };
  let checked = false;
  const fetchImpl = async input => {
    requests.push(String(input));
    assert.equal(String(input), 'https://homepage.example.org/');
    return new Response('ready', { status: 200 });
  };
  const result = await measureHealth(root, {
    env, fetchImpl,
    checkImpl: async (directory, options) => {
      checked = true;
      assert.equal(directory, root);
      assert.equal(options.online, true);
      assert.equal(options.env.CI, 'true');
      assert.equal(options.fetchImpl, fetchImpl);
      return healthyReport();
    },
  });
  assert.equal(checked, true);
  assert.equal(env.CI, '', 'The caller environment remains unchanged.');
  assert.deepEqual(requests, ['https://homepage.example.org/']);
  assert.equal(result.healthy, true);
  assert.deepEqual(result.findings, []);
});

test('a homepage HTTP failure becomes a health finding', async t => {
  const root = await healthFixture(t);
  const result = await measureHealth(root, {
    checkImpl: async () => healthyReport(),
    fetchImpl: async input => {
      assert.equal(String(input), 'https://homepage.example.org/');
      return new Response('unavailable', { status: 503 });
    },
  });
  assert.equal(result.healthy, false);
  assert.deepEqual(result.findings.map(row => [row.id, row.status]), [['HOMEPAGE', 'FAIL']]);
  assert.match(result.findings[0].message, /503/);
});

test('online reachability and parity failures remain visible in the health result', async t => {
  const root = await healthFixture(t);
  const result = await measureHealth(root, {
    checkImpl: async () => ({
      ...healthyReport(), exitCode: 3,
      results: [{ id: 'O_REGISTRY', status: 'SKIPPED', message: 'Registry is unreachable.' }],
    }),
    fetchImpl: async () => new Response('ready', { status: 200 }),
  });
  assert.equal(result.healthy, false);
  assert.deepEqual(result.findings.map(row => row.id), ['O_REGISTRY', 'ONLINE']);
});

test('a healthy run closes its health issue and ignores pull requests', async () => {
  const calls = [];
  const fetchImpl = issueFetch({
    'GET /repos/example/tool/issues?labels=repo-health&state=open&per_page=100': [{ number: 7 }, { number: 8, pull_request: {} }],
    'PATCH /repos/example/tool/issues/7': body => {
      assert.deepEqual(body, { state: 'closed', state_reason: 'completed' });
      return { number: 7, state: 'closed' };
    },
  }, calls);
  const result = await updateHealthIssue({ healthy: true, findings: [] }, { env: issueEnvironment, fetchImpl });
  assert.deepEqual(result, { action: 'closed', count: 1 });
  assert.equal(calls.length, 2);
});

test('a failed run creates a label and exactly one health issue', async () => {
  const calls = [];
  const fetchImpl = issueFetch({
    'GET /repos/example/tool/issues?labels=repo-health&state=open&per_page=100': [],
    'GET /repos/example/tool/labels?per_page=100': [],
    'POST /repos/example/tool/labels': body => {
      assert.equal(body.name, 'repo-health');
      return { name: body.name };
    },
    'POST /repos/example/tool/issues': body => {
      assert.deepEqual(body.labels, ['repo-health']);
      assert.match(body.body, /FAIL O_ABOUT: About text differs\./);
      return { number: 9 };
    },
  }, calls);
  const result = await updateHealthIssue(failedHealth, { env: issueEnvironment, fetchImpl });
  assert.deepEqual(result, { action: 'opened', number: 9 });
  assert.equal(calls.filter(call => call.method === 'POST' && call.endpoint.endsWith('/issues')).length, 1);
});

test('a failed run updates one existing issue and closes a duplicate', async () => {
  const calls = [];
  const fetchImpl = issueFetch({
    'GET /repos/example/tool/issues?labels=repo-health&state=open&per_page=100': [{ number: 9 }, { number: 10 }],
    'PATCH /repos/example/tool/issues/9': body => {
      assert.equal(body.title, 'Repository health needs review');
      assert.match(body.body, /O_ABOUT/);
      assert.equal(body.state, undefined);
      return { number: 9 };
    },
    'PATCH /repos/example/tool/issues/10': body => {
      assert.deepEqual(body, { state: 'closed', state_reason: 'not_planned' });
      return { number: 10, state: 'closed' };
    },
  }, calls);
  const result = await updateHealthIssue(failedHealth, { env: issueEnvironment, fetchImpl });
  assert.deepEqual(result, { action: 'updated', number: 9 });
  assert.equal(calls.filter(call => call.method === 'POST').length, 0);
  assert.equal(calls.length, 3);
});

test('an issue API HTTP failure returns the complete error', async () => {
  await assert.rejects(updateHealthIssue(failedHealth, {
    env: issueEnvironment,
    fetchImpl: async () => new Response('fixture service unavailable', { status: 503 }),
  }), /503 fixture service unavailable/);
});
