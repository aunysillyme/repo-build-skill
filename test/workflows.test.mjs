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

const sha=ch=>ch.repeat(40);
const ruleById=Object.fromEntries(workflowRules.map(rule=>[rule.id,rule]));
const run=async(id,text)=>ruleById[id].run({workflows:[readWorkflow('w.yml',text)]});
const wf=(body,head='permissions:\n  contents: read\n')=>`name: t\non: push\n${head}jobs:\n${body}`;
const job=(steps,name='check',extra='')=>`  ${name}:\n    runs-on: ubuntu-latest\n${extra}    steps:\n${steps}`;
const pinned=(tail=' # v4.1.2')=>`      - uses: actions/checkout@${sha('a')}${tail}\n        with:\n          persist-credentials: false\n`;

const upload='actions/upload-artifact@cf430e030ddbb5b0abf93d22962f4752f3646cd9';
const download='actions/download-artifact@9000827ccba6bdab643e8b6fd33ac0654aef8333';
const releaseFiles=[['.github/workflows/release.yml'],['skills',NAME,'assets/workflows/release-npm.yml'],['skills',NAME,'assets/workflows/release-pypi.yml']].map(parts=>path.join(ROOT,...parts));
const forbiddenInPublish=/\b(?:npm\s+(?:ci|run|pack|test|build)\b|pip3?\s+install|python3?\s+-m\s+(?:build|pip)\b)/;
for(const file of releaseFiles){
  test(`${path.relative(ROOT,file)} builds and smoke-tests in verify, uploads one artifact, and publishes only the downloaded file`,async()=>{
    const text=await fs.readFile(file,'utf8'),parsed=parseWorkflow(text),jobs=parsed.data.jobs;
    assert.equal(parsed.unreadable,false);
    assert.ok(jobs.verify&&jobs.publish);assert.deepEqual(jobs.publish.needs,'verify');
    assert.equal(jobs.verify.permissions?.['id-token'],undefined,'verify holds no identity permission');
    assert.equal(jobs.publish.permissions['id-token'],'write');
    const uses=job=>(job.steps||[]).map(step=>step.uses||'');
    assert.ok(uses(jobs.verify).some(value=>value===upload),'verify uploads the artifact with the pinned action');
    assert.ok(uses(jobs.publish).some(value=>value===download),'publish downloads it with the pinned action');
    assert.ok(!uses(jobs.publish).some(value=>/^actions\/checkout@/.test(value)),'publish needs no source checkout');
    for(const step of jobs.publish.steps)assert.ok(!forbiddenInPublish.test(step.run||''),`publish runs ${step.run}`);
    assert.deepEqual(await ruleById.W_OIDC.run({workflows:[readWorkflow('w.yml',text)]}),[]);
    assert.ok(jobs.verify.steps.some(step=>/GITHUB_REF_NAME/.test(step.run||'')),'verify compares the tag with the version');
  });
}
test('W_OIDC fails a publish job that installs, builds, packs or runs a package script, and allows the pinned CLI install',async()=>{
  const publish=command=>wf(job(pinned()+`      - run: ${command}\n`,'publish','    permissions:\n      contents: read\n      id-token: write\n'));
  for(const command of ['npm ci','npm run build','npm pack','pip install build','python -m build','python3 -m build'])assert.equal((await run('W_OIDC',publish(command))).length,1,command);
  assert.deepEqual(await run('W_OIDC',publish('npm install -g npm@12.2.0 --ignore-scripts')),[]);
  assert.deepEqual(await run('W_OIDC',publish('npm publish "$PWD"/dist/*.tgz --provenance --access public')),[]);
  const verify=wf(job(pinned()+'      - run: npm ci\n      - run: npm run build\n','verify'));
  assert.deepEqual(await run('W_OIDC',verify),[]);
});
test('W_INJECT flags event, head_ref and input values in run lines and github-script bodies, and accepts environment indirection',async()=>{
  const step=line=>wf(job(`      - run: ${line}\n`));
  for(const expr of ['github.head_ref','github.event.issue.title','github.event.pull_request.head.ref','inputs.target','github.event.inputs.target','github.event_path'])assert.equal((await run('W_INJECT',step(`echo "\${{ ${expr} }}"`))).length,1,expr);
  const script=wf(job(`      - uses: actions/github-script@${sha('b')} # v8.0.0\n        with:\n          script: |\n            console.log("\${{ github.event.comment.body }}")\n`));
  assert.equal((await run('W_INJECT',script)).length,1);
  const indirect=wf(job('      - env:\n          TITLE: ${{ github.event.issue.title }}\n        run: echo "$TITLE"\n'));
  assert.deepEqual(await run('W_INJECT',indirect),[]);
  assert.deepEqual(await run('W_INJECT',step('echo "${{ github.sha }} ${{ runner.os }}"')),[]);
});
test('W_PERMS accepts read-only mappings, read-all and an empty mapping, and rejects write access',async()=>{
  for(const head of ['permissions: read-all\n','permissions: {}\n','permissions:\n  contents: read\n  id-token: none\n'])assert.deepEqual(await run('W_PERMS',wf(job('      - run: true\n'),head)),[],head);
  for(const head of ['permissions: write-all\n','permissions:\n  contents: write\n',''])assert.equal((await run('W_PERMS',wf(job('      - run: true\n'),head))).length,1,head);
});
test('W_PIN accepts vN, vN.N and vN.N.N comments and checks the comment on each uses line',async()=>{
  for(const tail of [' # v4',' # v4.1',' # v4.1.2'])assert.deepEqual(await run('W_PIN',wf(job(pinned(tail)))),[],tail);
  assert.equal((await run('W_PIN',wf(job(pinned(''))))).length,1);
  const second=wf(job(pinned()+pinned('')));
  const found=await run('W_PIN',second);
  assert.equal(found.length,1);assert.equal(second.split('\n')[found[0].line-1].includes('#'),false,'the finding points at the uncommented line');
});

test('a checker that cannot run is reported as an unhealthy finding',async t=>{
  const root=await healthFixture(t);
  await fs.writeFile(path.join(root,'.repo-build','config.json'),'{ not json');
  const result=await measureHealth(root,{fetchImpl:async()=>new Response('ready',{status:200})});
  assert.equal(result.healthy,false);
  assert.ok(result.findings.some(row=>row.id==='CHECK'&&row.status==='FAIL'&&row.message.length>0),JSON.stringify(result.findings));
  const stub=await measureHealth(root,{checkImpl:async()=>({version:'1.0.0',exitCode:2,results:[]}),fetchImpl:async()=>new Response('ready',{status:200})});
  assert.equal(stub.healthy,false);
});

test('the PyPI template publishes with the pinned official action and runs no install or build command',async()=>{
  const parsed=parseWorkflow(await fs.readFile(path.join(ROOT,'skills',NAME,'assets/workflows/release-pypi.yml'),'utf8')),steps=parsed.data.jobs.publish.steps;
  assert.equal(steps.length,2);
  assert.equal(steps[0].uses,download);
  assert.equal(steps[1].uses,'pypa/gh-action-pypi-publish@dc37677b2e1c63e2034f94d8a5b11f265b73ba33');
  assert.equal(steps[1].with['packages-dir'],'dist/');
  assert.ok(steps.every(step=>step.run===undefined),'the publish job has no run step');
  assert.equal(parsed.data.jobs.publish.permissions['id-token'],'write');
});

const setupStep = (action, key, lines = '') => `      - uses: actions/${action}@${sha('c')} # v7.1.0\n        with:\n          ${key}: 24\n${lines}`;
const tagged = (step, trigger = "  push:\n    tags: ['v*']\n") => `name: t\non:\n${trigger}permissions:\n  contents: read\njobs:\n${job(pinned() + step)}`;
test('W_CREDS fails a tag workflow whose setup step leaves package caching on, and passes with it off', async () => {
  const off = '          package-manager-cache: false\n';
  assert.equal((await run('W_CREDS', tagged(setupStep('setup-node', 'node-version')))).length, 1, 'omitted key');
  assert.equal((await run('W_CREDS', tagged(setupStep('setup-node', 'node-version', off + '          cache: npm\n')))).length, 1, 'explicit cache input');
  assert.deepEqual(await run('W_CREDS', tagged(setupStep('setup-node', 'node-version', off))), []);
  assert.equal((await run('W_CREDS', tagged(setupStep('setup-python', 'python-version', '          cache: pip\n')))).length, 1);
  assert.deepEqual(await run('W_CREDS', tagged(setupStep('setup-python', 'python-version'))), []);
  const branchOnly = tagged(setupStep('setup-node', 'node-version'), "  push:\n    branches: [main]\n");
  assert.deepEqual(await run('W_CREDS', branchOnly), [], 'a workflow without a tag trigger is outside this check');
});
