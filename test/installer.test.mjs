import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { NAME } from '../src/constants.mjs';
import { install, uninstall, runInstaller } from '../src/install.mjs';
import { hosts } from '../src/catalog.mjs';
import { digest, receiptName, relativePath } from '../src/receipt.mjs';

function fixture(t, host = 'codex') {
  const temp = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'skill-install-')));
  t.after(() => fs.rmSync(temp, { recursive: true, force: true }));
  const dir = path.join(temp, 'project'), sourceRoot = path.join(temp, 'source');
  fs.mkdirSync(dir); fs.mkdirSync(sourceRoot);
  fs.mkdirSync(path.join(sourceRoot, 'references'));
  fs.writeFileSync(path.join(sourceRoot, 'SKILL.md'), '# Sample skill\n');
  fs.writeFileSync(path.join(sourceRoot, 'references/card.md'), '# Card\n');
  const options = { dir, sourceRoot, host, yes: true };
  const target = path.join(dir, hosts[host].target);
  const receipt = path.join(target, receiptName);
  return { temp, dir, sourceRoot, options, target, receipt };
}
function mustInstall(f) { const got = install(f.options); assert.equal(got.code, 0, got.message); return got; }
function editReceipt(f, change) {
  const value = JSON.parse(fs.readFileSync(f.receipt, 'utf8'));
  change(value);
  fs.writeFileSync(f.receipt, JSON.stringify(value));
}
test('install and uninstall remove only created files and created empty directories', t => {
  const f = fixture(t); mustInstall(f);
  const receipt = JSON.parse(fs.readFileSync(f.receipt, 'utf8'));
  assert.equal(receipt.package.name, NAME);
  assert.equal(receipt.files[0].sha256, digest(fs.readFileSync(path.join(f.dir, receipt.files[0].path))));
  for (const key of ['model', 'effort', 'buildLane']) assert.equal(Object.hasOwn(receipt, key), false);
  const got = uninstall(f.options); assert.equal(got.code, 0, got.message);
  assert.deepEqual(fs.readdirSync(f.dir), []);
  assert.match(got.message, /Manual step:/);
});
test('dry-run has the real operation plan and leaves tree alone', t => {
  const f = fixture(t);
  const preview = install({ ...f.options, dryRun: true });
  assert.equal(preview.code, 0, preview.message); assert.deepEqual(fs.readdirSync(f.dir), []);
  assert.deepEqual(mustInstall(f).operations, preview.operations);
  const before = fs.readFileSync(f.receipt);
  const remove = uninstall({ ...f.options, dryRun: true });
  assert.ok(fs.readFileSync(f.receipt).equals(before));
  assert.deepEqual(uninstall(f.options).operations, remove.operations);
});
test('install-time hashes survive a different package source', t => {
  const f = fixture(t); mustInstall(f);
  fs.writeFileSync(path.join(f.sourceRoot, 'SKILL.md'), '# New package version\n');
  assert.equal(uninstall(f.options).code, 0);
  assert.deepEqual(fs.readdirSync(f.dir), []);
});
test('edited files and receipt stay available for manual review', t => {
  const f = fixture(t); mustInstall(f);
  fs.writeFileSync(path.join(f.target, 'SKILL.md'), '# Owner edit\n');
  const got = uninstall(f.options); assert.equal(got.code, 0, got.message);
  assert.equal(fs.readFileSync(path.join(f.target, 'SKILL.md'), 'utf8'), '# Owner edit\n');
  assert.ok(fs.existsSync(f.receipt));
  assert.equal(fs.existsSync(path.join(f.target, 'references/card.md')), false);
});
test('identical pre-existing files and directories remain', t => {
  const f = fixture(t);
  fs.mkdirSync(f.target, { recursive: true });
  fs.writeFileSync(path.join(f.target, 'SKILL.md'), '# Sample skill\n');
  mustInstall(f);
  assert.equal(uninstall(f.options).code, 0);
  assert.equal(fs.readFileSync(path.join(f.target, 'SKILL.md'), 'utf8'), '# Sample skill\n');
  assert.ok(fs.existsSync(f.target)); assert.equal(fs.existsSync(f.receipt), false);
});
test('reinstall retains ownership of files from the first run', t => {
  const f = fixture(t); mustInstall(f); mustInstall(f);
  assert.equal(uninstall(f.options).code, 0); assert.deepEqual(fs.readdirSync(f.dir), []);
});
test('unlisted files prevent their directory from being removed', t => {
  const f = fixture(t); mustInstall(f);
  fs.writeFileSync(path.join(f.target, 'personal.txt'), 'owner\n');
  assert.equal(uninstall(f.options).code, 0);
  assert.equal(fs.readFileSync(path.join(f.target, 'personal.txt'), 'utf8'), 'owner\n');
});
test('missing receipt returns 2 and identifies the expected path', t => {
  const f = fixture(t); const got = uninstall(f.options);
  assert.equal(got.code, 2); assert.ok(got.message.includes(f.receipt));
});
test('AGENTS integration restores exact pre-existing bytes and preserves outside edits', t => {
  const f = fixture(t, 'agents-md');
  const file = path.join(f.dir, 'AGENTS.md'); fs.writeFileSync(file, '# Owner rules');
  mustInstall(f);
  fs.appendFileSync(file, '\nOwner addition.\n');
  assert.equal(uninstall(f.options).code, 0);
  assert.equal(fs.readFileSync(file, 'utf8'), '# Owner rules\nOwner addition.\n');
});
test('new AGENTS file is removed when its block is untouched', t => {
  const f = fixture(t, 'agents-md'); mustInstall(f);
  assert.equal(uninstall(f.options).code, 0);
  assert.deepEqual(fs.readdirSync(f.dir), []);
});
test('an edited marked block is kept', t => {
  const f = fixture(t, 'agents-md'); mustInstall(f);
  const file = path.join(f.dir, 'AGENTS.md');
  fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace('Read ', 'Load '));
  assert.equal(uninstall(f.options).code, 0); assert.ok(fs.existsSync(file)); assert.ok(fs.existsSync(f.receipt));
});
test('receipt traversal, absolute, Windows and duplicate paths refuse before removal', t => {
  for (const bad of ['../outside.txt', '/outside.txt', 'C:' + '\\outside.txt', 'sub/../outside.txt']) {
    const f = fixture(t); mustInstall(f);
    editReceipt(f, value => { value.files[0].path = bad; });
    assert.equal(uninstall(f.options).code, 2, bad);
    assert.ok(fs.existsSync(path.join(f.target, 'SKILL.md')));
  }
  const f = fixture(t); mustInstall(f);
  editReceipt(f, value => value.files.push(value.files[0]));
  assert.equal(uninstall(f.options).code, 2);
});
test('every unsafe relative shape is rejected', () => {
  for (const value of ['', '.', '..', 'x//y', './x', 'x/../y', 'x\\y']) assert.throws(() => relativePath(value));
});
test('symlink targets and parent symlinks refuse before removing any file', t => {
  const f = fixture(t); mustInstall(f);
  const file = path.join(f.target, 'SKILL.md'), outside = path.join(f.temp, 'outside.md');
  fs.writeFileSync(outside, '# Outside\n'); fs.unlinkSync(file);
  try { fs.symlinkSync(outside, file); } catch (error) { if (error.code === 'EPERM') return t.skip('File symlinks require host privileges'); throw error; }
  assert.equal(uninstall(f.options).code, 2);
  assert.equal(fs.readFileSync(outside, 'utf8'), '# Outside\n');
  assert.ok(fs.existsSync(path.join(f.target, 'references/card.md')));
});
test('directory symlink and receipt symlink are refused', t => {
  const f = fixture(t); mustInstall(f);
  const saved = fs.readFileSync(f.receipt), outside = path.join(f.temp, 'saved.json');
  fs.writeFileSync(outside, saved); fs.unlinkSync(f.receipt);
  try { fs.symlinkSync(outside, f.receipt); } catch (error) { if (error.code === 'EPERM') return t.skip('File symlinks require host privileges'); throw error; }
  assert.equal(uninstall(f.options).code, 2);
  assert.ok(fs.existsSync(path.join(f.target, 'SKILL.md')));
});
test('a symlinked parent is refused before deletion or installation', t => {
  const f = fixture(t); mustInstall(f);
  const from = path.join(f.target, 'references'), outside = path.join(f.temp, 'outside');
  fs.renameSync(from, outside);
  try { fs.symlinkSync(outside, from, process.platform === 'win32' ? 'junction' : 'dir'); }
  catch (error) { if (error.code === 'EPERM') return t.skip('Directory symlinks require host privileges'); throw error; }
  assert.equal(uninstall(f.options).code, 2);
  assert.ok(fs.existsSync(path.join(f.target, 'SKILL.md')));
  assert.equal(install(f.options).code, 2);
  assert.equal(fs.readFileSync(path.join(outside, 'card.md'), 'utf8'), '# Card\n');
});
test('hard-linked files are refused without touching the other link', t => {
  const f = fixture(t); mustInstall(f);
  const outside = path.join(f.temp, 'hardlink.md'); fs.linkSync(path.join(f.target, 'SKILL.md'), outside);
  assert.equal(uninstall(f.options).code, 2); assert.equal(fs.readFileSync(outside, 'utf8'), '# Sample skill\n');
});
test('every unlink is re-probed and the receipt is the final file removed', t => {
  const f = fixture(t); mustInstall(f);
  const original = fs.unlinkSync, removed = [];
  fs.unlinkSync = file => { removed.push(String(file)); return original(file); };
  let got;
  try { got = uninstall(f.options); } finally { fs.unlinkSync = original; }
  assert.equal(got.code, 0, got.message); assert.equal(removed.at(-1), f.receipt);
});
test('a file replaced after preflight is kept and removal stops', t => {
  const f = fixture(t); mustInstall(f);
  const original = fs.unlinkSync, victim = path.join(f.target, 'references/card.md');
  let changed = false;
  fs.unlinkSync = file => {
    const result = original(file);
    if (!changed && String(file).endsWith('SKILL.md')) { changed = true; fs.writeFileSync(victim, '# Concurrent owner edit\n'); }
    return result;
  };
  let got;
  try { got = uninstall(f.options); } finally { fs.unlinkSync = original; }
  assert.equal(got.code, 1, got.message); assert.ok(fs.existsSync(f.receipt));
  assert.equal(fs.readFileSync(victim, 'utf8'), '# Concurrent owner edit\n');
});
test('host destinations and user scope stay under the selected root', t => {
  for (const host of ['claude-code', 'codex', 'gemini-antigravity', 'cursor']) {
    const f = fixture(t, host);
    const got = install({ ...f.options, scope: 'user', home: f.dir }); assert.equal(got.code, 0, got.message);
    assert.ok(fs.existsSync(path.join(f.target, 'SKILL.md')));
    assert.equal(uninstall({ ...f.options, scope: 'user', home: f.dir }).code, 0);
  }
});
test('one host question and one confirmation, headless flags skip both', async t => {
  const f = fixture(t);
  const prompts = [], replies = ['codex', 'no'];
  const got = await runInstaller(['--dir', f.dir], { question: async prompt => { prompts.push(prompt); return replies.shift(); } });
  assert.equal(got.code, 0); assert.equal(prompts.length, 2); assert.deepEqual(fs.readdirSync(f.dir), []);
  const bad = await runInstaller(['--host']); assert.equal(bad.code, 2);
});
