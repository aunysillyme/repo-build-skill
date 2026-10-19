import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { check, rules } from '../src/check/index.mjs';
import { readWorkflow } from '../src/readers/workflow.mjs';
import { tempRepo, makeBaseline, materializeFixture, fixtureFetch, writeFile, treeHash, FIXED_NOW } from './helpers.mjs';

const fixtures = fileURLToPath(new URL('./fixtures/', import.meta.url));
const targetRows = (report, id) => report.results.filter(result => result.id === id);
const detail = report => JSON.stringify(report, null, 2);
function offlineOptions(root, extra = {}) { return { now: FIXED_NOW, env: {}, fetchImpl: fixtureFetch(root), ...extra }; }

test('checker defines exactly 37 complete, uniquely named rules', () => {
  assert.equal(rules.length, 37); assert.equal(new Set(rules.map(rule => rule.id)).size, 37);
  for (const rule of rules) {
    for (const key of ['id', 'reader', 'stage', 'severity', 'mode', 'title', 'why', 'pass', 'learn']) assert.equal(typeof rule[key], 'string', `${rule.id}.${key}`);
    assert.equal(typeof rule.house, 'boolean'); assert.equal(typeof rule.applies, 'function'); assert.equal(typeof rule.run, 'function');
  }
  const expected = ['H_LEAD','H_INSTALL','H_FENCE','H_FAQ','H_UNINSTALL','H_FLOOR','H_LINK','H_ABSENCE','A_AGENTS','A_IMPORT','A_CMD','A_SKILL_SPEC','M_LLMS_SHAPE','M_LLMS_LEAD','M_ENTITY','R_DESC','R_TOPICS','R_META','R_VERSION','R_FILES','W_PERMS','W_OIDC','W_PIN','W_CREDS','W_INJECT','W_TAG','P_PATH','P_EMAIL','P_TOKEN','P_LIST','F_PROOF','C_CREDITS','S_DRIFT','S_STALE','O_ABOUT','O_REGISTRY','O_PVR'];
  assert.deepEqual(rules.map(rule => rule.id).sort(), expected.sort());
});
test('the complete synthetic baseline passes every code with online reads stubbed', async t => {
  const root = tempRepo(t); makeBaseline(root);
  const before = treeHash(root);
  const report = await check(root, offlineOptions(root, { online: true, strict: true }));
  assert.equal(report.exitCode, 0, detail(report));
  assert.equal(report.results.length, 37, detail(report));
  assert.ok(report.results.every(row => row.status === 'PASS'), detail(report));
  assert.equal(treeHash(root), before);
});
for (const rule of rules) {
  for (const state of ['red', 'green']) {
    test(`${rule.id}: ${state.toUpperCase()} fixture exercises the rule`, async t => {
      const root = tempRepo(t);
      const loaded = materializeFixture(path.join(fixtures, rule.id, state), root);
      assert.equal(loaded.fixture.id, rule.id); assert.equal(loaded.fixture.state, state);
      const before = treeHash(root), report = await check(root, loaded.options), rows = targetRows(report, rule.id);
      assert.ok(rows.length > 0, detail(report));
      if (state === 'green') assert.ok(rows.every(row => row.status === 'PASS'), detail(report));
      else assert.ok(rows.some(row => row.status === 'FAIL' || row.status === 'WARN'), detail(report));
      assert.ok(rows.every(row => !['SKIPPED', 'NOT APPLICABLE', 'OFF'].includes(row.status)), detail(report));
      assert.equal(treeHash(root), before, `${rule.id} changed the checked tree`);
    });
  }
}
test('reasoned disables are printed OFF with their reason', async t => {
  const root = tempRepo(t); makeBaseline(root);
  const reason = 'The integration uses its own host entry point.';
  writeFile(root, '.repo-build/config.json', { disable: { A_IMPORT: reason } });
  const report = await check(root, offlineOptions(root));
  const row = targetRows(report, 'A_IMPORT')[0];
  assert.equal(row.status, 'OFF'); assert.equal(row.message, reason); assert.equal(report.summary.off, 1);
});
test('bare, empty and unknown disables return usage or configuration exit 2', async t => {
  for (const disable of [['A_IMPORT'], { A_IMPORT: '' }, { A_IMPORT: true }, { UNKNOWN_RULE: 'A reason.' }]) {
    const root = tempRepo(t); makeBaseline(root); writeFile(root, '.repo-build/config.json', { disable });
    const report = await check(root, offlineOptions(root));
    assert.equal(report.exitCode, 2, detail(report)); assert.ok(report.error);
  }
});
test('unresolved workflow constructs count as skips and strict fails', async t => {
  const root = tempRepo(t); makeBaseline(root);
  writeFile(root, '.github/workflows/release.yml', 'name: Fixture\npermissions: *shared\njobs: {}\n');
  const report = await check(root, offlineOptions(root, { strict: true }));
  assert.equal(report.exitCode, 1, detail(report));
  const rows = report.results.filter(row => row.id.startsWith('W_'));
  assert.equal(rows.length, 6); assert.ok(rows.every(row => row.status === 'SKIPPED' && row.message.startsWith('UNREADABLE:')));
  assert.equal(report.summary.skipped, 6);
});
test('JSON-form workflows use the JSON reader and avoid unreadable skips', async t => {
  const root = tempRepo(t); makeBaseline(root);
  const value = { name: 'Fixture JSON', on: ['push'], permissions: { contents: 'read' }, jobs: { check: { 'runs-on': 'ubuntu-latest', steps: [{ run: 'node --version' }] } } };
  const text = JSON.stringify(value), parsed = readWorkflow('.github/workflows/release.yml', text);
  assert.equal(parsed.unreadable, false); assert.deepEqual(parsed.data, value); assert.equal(parsed.steps.length, 1);
  writeFile(root, '.github/workflows/release.yml', text);
  const report = await check(root, offlineOptions(root));
  assert.ok(report.results.filter(row => row.id.startsWith('W_')).every(row => row.status === 'PASS'), detail(report));
});
test('offline runs omit online codes without adding skips', async t => {
  const root = tempRepo(t); makeBaseline(root);
  const report = await check(root, offlineOptions(root, { fetchImpl: async () => { throw Error('Online reads are disabled in this test.'); } }));
  assert.equal(report.exitCode, 0, detail(report)); assert.equal(report.summary.skipped, 0);
  assert.ok(report.results.every(row => !row.id.startsWith('O_') && row.id !== 'S_STALE'));
});
test('unreachable requested online reads return exit 3', async t => {
  const root = tempRepo(t); makeBaseline(root);
  const report = await check(root, offlineOptions(root, { online: true, fetchImpl: async () => { throw Error('Synthetic offline service.'); } }));
  assert.equal(report.exitCode, 3, detail(report));
  assert.ok(targetRows(report, 'O_ABOUT').every(row => row.status === 'SKIPPED'));
});
test('CI records the maintainer-only stale check as not applicable', async t => {
  const root = tempRepo(t); makeBaseline(root);
  const report = await check(root, offlineOptions(root, { online: true, env: { CI: 'true' } }));
  const row = targetRows(report, 'S_STALE')[0];
  assert.equal(row.status, 'NOT APPLICABLE'); assert.equal(row.message, 'maintainer-run only');
});
test('missing fact fields count as skips and strict fails', async t => {
  const root = tempRepo(t); makeBaseline(root);
  const facts = JSON.parse(fs.readFileSync(path.join(root, '.repo-build/facts.json'), 'utf8'));
  delete facts.install; writeFile(root, '.repo-build/facts.json', facts);
  const report = await check(root, offlineOptions(root, { strict: true }));
  assert.equal(report.exitCode, 1, detail(report)); assert.equal(targetRows(report, 'H_INSTALL')[0].status, 'SKIPPED');
});
test('house conventions warn by default and become errors under house mode', async t => {
  const root = tempRepo(t), loaded = materializeFixture(path.join(fixtures, 'H_FAQ', 'red'), root);
  const normal = await check(root, { ...loaded.options, online: false });
  assert.equal(targetRows(normal, 'H_FAQ')[0].status, 'WARN'); assert.equal(normal.exitCode, 0, detail(normal));
  const house = await check(root, { ...loaded.options, online: false, house: true });
  assert.equal(targetRows(house, 'H_FAQ')[0].status, 'FAIL'); assert.equal(house.exitCode, 1, detail(house));
});
