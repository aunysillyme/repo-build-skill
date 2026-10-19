import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { renderBlocks, replaceBlock, renderSet, checkSet, syncSet, sha256, rendererBytes, validateSet, plainLine } from '../src/set.mjs';

const rows = [
  { name: 'alpha-tool', url: 'https://github.com/example/alpha', line: 'Alpha description.' },
  { name: 'beta-tool', url: 'https://github.com/example/beta', line: 'Beta description.' },
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
  assert.equal(blocks.readme, '<!-- set:start -->\n## Part of a set\n\n| Repo | What it gives you |\n|---|---|\n| **alpha-tool** | Alpha description. |\n| [beta-tool](https://github.com/example/beta) | Beta description. |\n<!-- set:end -->');
  assert.equal(blocks.llms, '<!-- set:start -->\n## Part of a set\n\n- [beta-tool](https://github.com/example/beta): Beta description.\n<!-- set:end -->');
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
test('vendored script runs through a symlinked directory and detects drift', t => {
  const root = fixture(t), parent = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-set-link-'));
  t.after(() => fs.rmSync(parent, { recursive: true, force: true }));
  const link = path.join(parent, 'repo');
  fs.symlinkSync(fs.realpathSync(root), link, 'dir');
  const script = path.join(link, '.repo-build/render-set.mjs');
  assert.throws(() => execFileSync(process.execPath, [script, '--check'], { cwd: link, stdio: 'pipe' }), error => error.status === 1 && /Set drift/.test(error.stdout));
  assert.match(execFileSync(process.execPath, [script], { cwd: link, encoding: 'utf8' }), /Set rendered/);
  assert.match(execFileSync(process.execPath, [script, '--check'], { cwd: link, encoding: 'utf8' }), /Set blocks match/);
});
test('malformed marker pairs and invalid schemas are refused', () => {
  for (const text of ['<!-- set:start -->', '<!-- set:end -->', '<!-- set:end --><!-- set:start -->', '<!-- set:start --><!-- set:start --><!-- set:end -->']) assert.throws(() => replaceBlock(text, 'replacement'));
  for (const value of [{}, { version: 2, rows }, { version: 1, rows: [{ ...rows[0], line: '' }] }, { version: 1, rows: [rows[0], rows[0]] }, { version: 1, rows: [{ ...rows[0], url: 'file:///tmp/data' }] }, { version: 1, rows: [{ ...rows[0], url: 'http://example.com/alpha' }] }]) assert.throws(() => validateSet(value));
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
    if (String(url).endsWith('/alpha-tool')) return response({ 'dist-tags': { latest: '1.2.3' }, versions: { '1.2.3': { description: 'Current alpha description.', repository: { type: 'git', url: 'git+https://github.com/example/alpha.git' } } } });
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

test('validateSet rejects row urls that could close or extend a Markdown link and lines that open an HTML comment', () => {
  const injected = 'https://example.com/a") [free money](https://evil.example';
  for (const url of [injected, 'https://example.com/a b', 'https://example.com/a)b', 'https://example.com/a<b', 'https://example.com/a>b', 'https://example.com/a"b', "https://example.com/a'b"]) assert.throws(() => validateSet({ version: 1, rows: [{ ...rows[0], url }] }), /Invalid set URL/, url);
  assert.throws(() => validateSet({ version: 1, rows: [{ ...rows[0], line: 'Fine <!-- set:end --> text' }] }), /comment/i);
  assert.doesNotThrow(() => validateSet({ version: 1, rows }));
});
test('plainLine reduces third-party text to short plain text', () => {
  const got = plainLine('  Fast <!-- set:end --> tool [click](https://evil.example) `code` <b>bold</b>\u0000\u0007\n\t  done  ');
  assert.equal(got.includes('<'), false); assert.equal(/[\[\]()`<>]/.test(got), false); assert.equal(/[\u0000-\u001f]/.test(got), false);
  assert.equal(got.includes('set:end'), false); assert.equal(got, got.replace(/\s+/g, ' ').trim());
  assert.equal(plainLine('x'.repeat(500)).length, 200);
});
function syncFixture(t, { registry }) {
  const root = fixture(t), source = 'https://raw.githubusercontent.com/example/collection/main/set.json';
  fs.writeFileSync(path.join(root, '.repo-build/config.json'), JSON.stringify({ set: { source } }));
  const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
  const fetchImpl = async url => {
    if (url === source) return response(JSON.stringify({ version: 1, rows }));
    if (String(url).startsWith('https://api.github.com/')) return response([{ sha: 'b'.repeat(40) }]);
    if (String(url).endsWith('/alpha-tool')) return response(registry);
    return response('unpublished', 404);
  };
  return { root, fetchImpl, readme };
}
const published = (description, repository) => ({ 'dist-tags': { latest: '2.0.0' }, versions: { '2.0.0': { description, ...(repository ? { repository } : {}) } } });
test('a registry description is neutralized and cannot break the set markers or add a link', async t => {
  const hostile = 'Great tool <!-- set:end --> [free money](https://evil.example) `x`\n<script>alert(1)</script>';
  const { root, fetchImpl } = syncFixture(t, { registry: published(hostile, 'git+https://github.com/example/alpha.git') });
  const got = await syncSet({ root, fetchImpl, now: new Date('2026-10-19T12:00:00Z'), env: {} });
  assert.equal(got.code, 0, got.message);
  const line = JSON.parse(fs.readFileSync(path.join(root, '.repo-build/set.json'), 'utf8')).rows[0].line;
  assert.equal(/<|>|\[|\]|\(|\)|`|set:end/.test(line), false, line);
  for (const file of ['README.md', 'llms.txt']) {
    const text = fs.readFileSync(path.join(root, file), 'utf8');
    assert.equal(text.split('<!-- set:end -->').length - 1, 1, file); assert.equal(/\]\(https:\/\/evil\.example/.test(text), false, file);
  }
  assert.equal(renderSet({ root, check: true }).code, 0);
});
test('a package whose repository does not match the row url keeps the canonical line', async t => {
  for (const repository of [undefined, 'git+https://github.com/other/alpha.git', { url: 'https://example.com/example/alpha' }]) {
    const { root, fetchImpl } = syncFixture(t, { registry: published('Replacement text from elsewhere.', repository) });
    const got = await syncSet({ root, fetchImpl, now: new Date('2026-10-19T12:00:00Z'), env: {} });
    assert.equal(got.code, 0, got.message);
    assert.equal(JSON.parse(fs.readFileSync(path.join(root, '.repo-build/set.json'), 'utf8')).rows[0].line, 'Alpha description.');
  }
  for (const repository of ['https://github.com/example/alpha', 'git+https://github.com/example/alpha.git', { type: 'git', url: 'https://github.com/Example/Alpha.git' }]) {
    const { root, fetchImpl } = syncFixture(t, { registry: published('Matched registry text.', repository) });
    assert.equal((await syncSet({ root, fetchImpl, now: new Date('2026-10-19T12:00:00Z'), env: {} })).code, 0);
    assert.equal(JSON.parse(fs.readFileSync(path.join(root, '.repo-build/set.json'), 'utf8')).rows[0].line, 'Matched registry text.');
  }
});
test('a source row url that injects a second link stops the sync before anything is written', async t => {
  const { root } = syncFixture(t, { registry: published('x') });
  const files = ['README.md', 'llms.txt', '.repo-build/set.json', '.repo-build/set.lock.json'], before = files.map(file => fs.readFileSync(path.join(root, file)));
  const source = 'https://raw.githubusercontent.com/example/collection/main/set.json';
  const bad = JSON.stringify({ version: 1, rows: [{ ...rows[0], url: 'https://example.com/a") [free money](https://evil.example' }, rows[1]] });
  const got = await syncSet({ root, fetchImpl: async url => (url === source ? response(bad) : response('no', 404)), now: new Date('2026-10-19T12:00:00Z'), env: {} });
  assert.notEqual(got.code, 0); assert.match(got.message, /Invalid set URL/);
  files.forEach((file, index) => assert.ok(fs.readFileSync(path.join(root, file)).equals(before[index]), file));
});
test('set files and the vendored renderer are refused through a symlink, naming the path only', t => {
  for (const rel of ['.repo-build/set.json', '.repo-build/set.lock.json', '.repo-build/render-set.mjs']) {
    const root = fixture(t), outside = path.join(root, '..', `outside-${path.basename(rel)}`), secret = 'SECRET-MARKER-' + path.basename(rel);
    fs.writeFileSync(outside, secret); t.after(() => fs.rmSync(outside, { force: true }));
    fs.rmSync(path.join(root, rel)); fs.symlinkSync(outside, path.join(root, rel));
    for (const result of [checkSet(root), (() => { try { return renderSet({ root, check: true }); } catch (error) { return { code: 2, message: error.message }; } })()]) {
      if (rel.endsWith('set.lock.json') && result.changed && result.code === 0) continue;
      assert.notEqual(result.code, 0, rel); assert.equal(result.message.includes(secret), false, `${rel}: ${result.message}`);
    }
    const checked = checkSet(root);
    assert.match(checked.message, /Symlink refused/); assert.ok(checked.message.includes(rel)); assert.equal(checked.message.includes(outside), false);
  }
});
test('a symlinked .repo-build directory is refused', t => {
  const root = fixture(t), moved = path.join(root, '..', `moved-${path.basename(root)}`);
  t.after(() => fs.rmSync(moved, { recursive: true, force: true }));
  fs.renameSync(path.join(root, '.repo-build'), moved); fs.symlinkSync(moved, path.join(root, '.repo-build'), 'dir');
  const got = checkSet(root); assert.equal(got.code, 1); assert.match(got.message, /Symlink refused/);
});
test('the stale-source check fetches the lock source only when it is an https URL', async t => {
  const { check } = await import('../src/check/index.mjs');
  const root = fixture(t); renderSet({ root });
  for (const source of ['http://example.com/set.json', 'file:///tmp/set.json', 'ftp://example.com/set.json']) {
    const lockFile = path.join(root, '.repo-build/set.lock.json'), value = JSON.parse(fs.readFileSync(lockFile, 'utf8'));
    fs.writeFileSync(lockFile, JSON.stringify({ ...value, source }));
    const requests = [];
    const report = await check(root, { online: true, env: {}, fetchImpl: async url => { requests.push(String(url)); return new Response('{}', { status: 200 }); } });
    const row = report.results.find(item => item.id === 'S_STALE');
    assert.equal(row.status, 'FAIL', source); assert.match(row.message, /https/);
    assert.equal(requests.includes(source), false, source);
  }
});
