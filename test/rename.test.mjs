import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { ROOT, NAME } from '../src/constants.mjs';
import { publicFiles } from '../src/io.mjs';
import { makeBaseline, SAMPLE, tempRepo, writeFile } from './helpers.mjs';

const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const rootProse = [
  'README.md', 'AGENTS.md', 'CLAUDE.md', 'CREDITS.md', 'REPO_SETTINGS.md',
  'LICENSE', 'CHANGELOG.md', 'CONTRIBUTING.md', 'CODE_OF_CONDUCT.md',
  'SECURITY.md', 'MAINTAINERS.md', 'RELEASING.md',
];

function copyPublicTree(destination) {
  for (const file of publicFiles(ROOT)) {
    if (file === '.repo-build/private.local.txt' || file.startsWith('.repo-build/work/')) continue;
    if (file.split('/').some(part => ['.git', 'node_modules', '.venv', 'dist', 'build'].includes(part))) continue;
    const source = path.join(ROOT, file);
    assert.equal(fs.lstatSync(source).isSymbolicLink(), false, `Copy regular public files: ${file}`);
    writeFile(destination, file, fs.readFileSync(source));
  }
}

function fillProseControl(root, baseline) {
  const metadata = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const factsFile = path.join(root, '.repo-build', 'facts.json');
  const existing = fs.existsSync(factsFile) ? JSON.parse(fs.readFileSync(factsFile, 'utf8')) : {};
  const facts = {
    ...SAMPLE,
    name: metadata.name, entity: metadata.name, lead: metadata.description,
    description: metadata.description, install: `npx ${metadata.name}`,
    uninstall: `npx ${metadata.name} uninstall`, homepage: metadata.homepage,
    repository: typeof metadata.repository === 'string' ? metadata.repository : metadata.repository.url,
    keywords: metadata.keywords, topics: metadata.keywords.slice(0, 20),
    ...existing,
  };
  writeFile(root, '.repo-build/facts.json', facts);
  const replacements = [
    [SAMPLE.uninstall, facts.uninstall], [SAMPLE.install, facts.install],
    [SAMPLE.lead, facts.lead], [SAMPLE.description, facts.description], [SAMPLE.name, metadata.name],
  ];
  for (const file of rootProse) {
    const target = path.join(root, file);
    if (fs.existsSync(target) && fs.readFileSync(target, 'utf8').trim()) continue;
    let text = fs.readFileSync(path.join(baseline, file), 'utf8');
    for (const [from, to] of replacements) text = text.split(from).join(to);
    writeFile(root, file, text);
  }
  writeFile(root, '.repo-build/private.local.txt', fs.readFileSync(path.join(baseline, '.repo-build', 'private.local.txt')));
  for (const file of ['.repo-build/set.json', '.repo-build/set.lock.json', '.repo-build/render-set.mjs', '.repo-build/config.json']) {
    if (fs.existsSync(path.join(root, file))) continue;
    const text = fs.readFileSync(path.join(baseline, file), 'utf8').split(SAMPLE.name).join(metadata.name);
    writeFile(root, file, text);
  }
  if (!fs.existsSync(path.join(root, 'proof', 'results.json'))) {
    const rows = JSON.parse(fs.readFileSync(path.join(baseline, 'proof', 'results.json'), 'utf8'));
    for (const row of rows) row.package_version = metadata.version;
    writeFile(root, 'proof/results.json', rows);
  }
}

function renameTree(root, from, to) {
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const source = path.join(root, entry.name);
    if (entry.isDirectory()) renameTree(source, from, to);
    else {
      assert.equal(entry.isSymbolicLink(), false, 'The rename control uses regular files.');
      const bytes = fs.readFileSync(source);
      if (!bytes.includes(0)) fs.writeFileSync(source, bytes.toString('utf8').split(from).join(to));
    }
    const renamed = entry.name.split(from).join(to);
    if (renamed !== entry.name) {
      const target = path.join(root, renamed);
      assert.equal(fs.existsSync(target), false, 'Renamed paths do not collide.');
      fs.renameSync(source, target);
    }
  }
}

function runNode(root, args) {
  const result = spawnSync(process.execPath, args, {
    cwd: root, encoding: 'utf8', timeout: 30000, maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, REPO_BUILD_PRIVATE_LISTS: '', CI: 'true' },
  });
  assert.equal(result.error, undefined, result.error?.message);
  assert.equal(result.status, 0, `${args.join(' ')}\n${result.stdout || ''}${result.stderr || ''}`);
  return result.stdout;
}

test('a renamed copy keeps the real package code and skill, rebuilds and checks green', t => {
  const work = tempRepo(t, 'renamed-package-');
  const baseline = makeBaseline(path.join(work, 'baseline'));
  const root = path.join(work, 'candidate');
  fs.mkdirSync(root);
  copyPublicTree(root);
  fillProseControl(root, baseline);
  const renamed = 'other-skill';
  renameTree(root, NAME, renamed);
  const metadata = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  assert.equal(metadata.name, renamed);
  assert.deepEqual(Object.keys(metadata.bin), [renamed]);
  assert.equal(fs.existsSync(path.join(root, 'skills', NAME)), false);
  assert.equal(fs.existsSync(path.join(root, 'bin', `${NAME}.mjs`)), false);
  const skillRoot = path.join(root, 'skills', renamed);
  const expectedSkill = fs.readFileSync(path.join(ROOT, 'skills', NAME, 'SKILL.md'), 'utf8').split(NAME).join(renamed);
  assert.equal(fs.readFileSync(path.join(skillRoot, 'SKILL.md'), 'utf8'), expectedSkill);
  const expectedCli = fs.readFileSync(path.join(ROOT, 'src', 'cli.mjs'), 'utf8').split(NAME).join(renamed);
  assert.equal(fs.readFileSync(path.join(root, 'src', 'cli.mjs'), 'utf8'), expectedCli);

  const setBytes = fs.readFileSync(path.join(root, '.repo-build', 'set.json'));
  const lockFile = path.join(root, '.repo-build', 'set.lock.json');
  const lock = JSON.parse(fs.readFileSync(lockFile, 'utf8'));
  lock.sha256 = hash(setBytes);
  lock.vendored_sha256 = hash(setBytes);
  lock.renderer_sha256 = hash(fs.readFileSync(path.join(root, '.repo-build', 'render-set.mjs')));
  fs.writeFileSync(lockFile, JSON.stringify(lock, null, 2) + '\n');
  const manifest = JSON.parse(fs.readFileSync(path.join(skillRoot, 'manifest.json'), 'utf8'));
  assert.equal(manifest.name, renamed);
  assert.ok(manifest.assets.length, 'Rehash every real skill asset explicitly.');
  runNode(root, ['scripts/build.mjs', '--rehash', ...manifest.assets.map(asset => asset.path)]);
  runNode(root, ['scripts/build.mjs', '--check']);
  const binary = Object.values(metadata.bin)[0];
  assert.match(runNode(root, [binary, '--help']), /^other-skill\s/m);
  const report = JSON.parse(runNode(root, [binary, 'check', '.', '--json', '--house', '--strict']));
  assert.equal(report.results.filter(row => row.status === 'FAIL' && row.severity === 'error').length, 0);
  assert.equal(report.results.filter(row => ['SKIPPED', 'UNREADABLE'].includes(row.status)).length, 0);
  assert.ok(report.results.some(row => row.id === 'S_DRIFT' && row.status === 'PASS'));
});
