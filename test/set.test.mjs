import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { renderBlocks, replaceBlock, renderSet, checkSet, syncSet, sha256, rendererBytes, validateSet } from '../src/set.mjs';

const rows = [
  { name: 'alpha-tool', url: 'https://example.com/alpha', line: 'Alpha description.' },
  { name: 'beta-tool', url: 'https://example.com/beta', line: 'Beta description.' },
];
function fixture(t, { facts = false } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-set-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, '.repo-build'));
  fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify({ name: facts ? 'other-tool' : 'alpha-tool' }));
  if (facts) fs.writeFileSync(path.join(root, '.repo-build/facts.json'), JSON.stringify({ name: 'alpha-tool' }));
  fs.writeFileSync(path.join(root, 'README.md'), '# Alpha\n');
  fs.writeFileSync(path.join(root, 'llms.txt'), '# Alpha\n\n> Description.\n');
  fs.writeFileSync(path.join(root, '.repo-build/set.json'), JSON.stringify({ version: 1, rows }, null, 2) + '\n');
  fs.writeFileSync(path.join(root, '.repo-build/render-set.mjs'), rendererBytes());
  const source = 'https://example.com/set.json';
  fs.writeFileSync(path.join(root, '.repo-build/config.json'), JSON.stringify({ set: { source } }));
  lock(root, source);
  return root;
}
function lock(root, source = 'https://example.com/set.json') {
  const value = { source, commit: null, sha256: sha256(fs.readFileSync(path.join(root, '.repo-build/set.json'))), renderer_sha256: sha256(rendererBytes()), fetched: '2026-10-19' };
  fs.writeFileSync(path.join(root, '.repo-build/set.lock.json'), JSON.stringify(value));
}
const response = (data, status = 200) => new Response(typeof data === 'string' ? data : JSON.stringify(data), { status });
test('renderer follows row order, bolds current README row, omits current llms row', () => {
  const blocks = renderBlocks({ version: 1, rows }, 'alpha-tool');
  assert.equal(blocks.readme, '<!-- set:start -->\n## Part of a set\n\n| Repo | What it gives you |\n|---|---|\n| **alpha-tool** | Alpha description. |\n| [beta-tool](https://example.com/beta) | Beta description. |\n<!-- set:end -->');
  assert.equal(blocks.llms, '<!-- set:start -->\n## Part of a set\n\n- [beta-tool](https://example.com/beta): Beta description.\n<!-- set:end -->');
});
test('render and offline drift checks agree and stay read-only in check mode', t => {
  const root = fixture(t); const before = fs.readFileSync(path.join(root, 'README.md'));
  assert.equal(renderSet({ root, check: true }).code, 1);
  assert.ok(fs.readFileSync(path.join(root, 'README.md')).equals(before));
  assert.equal(renderSet({ root }).code, 0); assert.equal(checkSet(root).code, 0);
  fs.appendFileSync(path.join(root, '.repo-build/render-set.mjs'), '\n');
  assert.equal(checkSet(root).code, 1);
});
test('facts name takes precedence over package name', t => {
  const root = fixture(t, { facts: true }); renderSet({ root });
  assert.match(fs.readFileSync(path.join(root, 'README.md'), 'utf8'), /\*\*alpha-tool\*\*/);
});
test('vendored script runs alone and detects drift', t => {
  const root = fixture(t);
  const script = path.join(root, '.repo-build/render-set.mjs');
  execFileSync(process.execPath, [script], { cwd: root, stdio: 'pipe' });
  execFileSync(process.execPath, [script, '--check'], { cwd: root, stdio: 'pipe' });
  fs.writeFileSync(path.join(root, 'llms.txt'), '# Changed\n');
  assert.throws(() => execFileSync(process.execPath, [script, '--check'], { cwd: root, stdio: 'pipe' }), error => error.status === 1);
});
test('malformed marker pairs and invalid schemas are refused', () => {
  for (const text of ['<!-- set:start -->', '<!-- set:end -->', '<!-- set:end --><!-- set:start -->', '<!-- set:start --><!-- set:start --><!-- set:end -->']) assert.throws(() => replaceBlock(text, 'replacement'));
  for (const value of [{}, { version: 2, rows }, { version: 1, rows: [{ ...rows[0], line: '' }] }, { version: 1, rows: [rows[0], rows[0]] }, { version: 1, rows: [{ ...rows[0], url: 'file:///tmp/data' }] }]) assert.throws(() => validateSet(value));
});
test('set sync refreshes latest registry text, retains unpublished line, locks and renders', async t => {
  const root = fixture(t), calls = [];
  const source = 'https://raw.githubusercontent.com/example/collection/main/set.json';
  const canonical = JSON.stringify({ version: 1, rows });
  fs.writeFileSync(path.join(root, '.repo-build/config.json'), JSON.stringify({ set: { source } }));
  const fetchImpl = async url => {
    calls.push(String(url));
    if (url === source) return response(canonical);
    if (String(url).startsWith('https://api.github.com/')) return response([{ sha: 'a'.repeat(40) }]);
    if (String(url).endsWith('/alpha-tool')) return response({ 'dist-tags': { latest: '1.2.3' }, versions: { '1.2.3': { description: 'Current alpha description.' } } });
    return response('unpublished', 404);
  };
  const got = await syncSet({ root, fetchImpl, now: new Date('2026-10-19T12:00:00Z'), env: {} });
  assert.equal(got.code, 0, got.message); assert.equal(calls.length, 4);
  assert.equal(got.lock.commit, 'a'.repeat(40)); assert.equal(got.lock.sha256, sha256(canonical));
  assert.equal(got.lock.fetched, '2026-10-19'); assert.equal(got.lock.renderer_sha256, sha256(rendererBytes()));
  const vendored = fs.readFileSync(path.join(root, '.repo-build/set.json'));
  assert.equal(got.lock.vendored_sha256, sha256(vendored));
  assert.deepEqual(JSON.parse(vendored).rows.map(row => row.line), ['Current alpha description.', 'Beta description.']);
  assert.equal(checkSet(root).code, 0);
  fs.writeFileSync(path.join(root, '.repo-build/set.json'), JSON.stringify({ version: 1, rows }));
  assert.equal(checkSet(root).code, 1);
});
test('set sync requires configured source, runs outside CI, and never invents a default', async t => {
  const root = fixture(t);
  const fetchImpl = async () => { throw Error('fetch should not be called'); };
  fs.writeFileSync(path.join(root, '.repo-build/config.json'), '{}');
  assert.equal((await syncSet({ root, fetchImpl, env: {} })).code, 2);
  assert.equal((await syncSet({ root, fetchImpl, env: { CI: 'true' } })).code, 2);
});
test('fetch failure leaves all outputs untouched', async t => {
  const root = fixture(t);
  const files = ['README.md', 'llms.txt', '.repo-build/set.json', '.repo-build/set.lock.json', '.repo-build/render-set.mjs'];
  const before = files.map(file => fs.readFileSync(path.join(root, file)));
  const got = await syncSet({ root, fetchImpl: async () => { throw Error('network unavailable'); }, env: {} });
  assert.equal(got.code, 3);
  files.forEach((file, index) => assert.ok(fs.readFileSync(path.join(root, file)).equals(before[index])));
});
test('reference renderer and vendored renderer are byte-identical', () => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  assert.ok(fs.readFileSync(path.join(root, '.repo-build/render-set.mjs')).equals(rendererBytes()));
});

test('missing output is skipped while an existing unmarked output is drift', t => {
  const root = fixture(t);
  renderSet({ root });
  fs.rmSync(path.join(root, 'llms.txt'));
  assert.equal(renderSet({ root, check: true }).code, 0);
  fs.writeFileSync(path.join(root, 'llms.txt'), '# Replaced\n');
  assert.equal(renderSet({ root, check: true }).code, 1);
});
