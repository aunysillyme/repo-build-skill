import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createHash } from 'node:crypto';
import { renderSet, rendererBytes, sha256 } from '../src/set.mjs';

export const SAMPLE = Object.freeze({
  name: 'sample-tool', version: '1.0.0', lead: 'Sample tool turns a label into a greeting.',
  description: 'A greeting command with a small, readable interface.',
  homepage: 'https://example.com/sample-tool', repository: 'https://github.com/example/sample-tool.git',
  install: 'npx sample-tool', uninstall: 'npm uninstall -g sample-tool',
  topics: ['developer-tools'], keywords: ['developer-tools'], emails_allow: [], registry: 'npm', entity: 'sample-tool',
});
export const FIXED_NOW = '2026-10-19T12:00:00Z';
export const workflow = [
  'name: Fixture checks', 'on: [push]', 'permissions:', '  contents: read', 'jobs:', '  verify:', '    runs-on: ubuntu-latest', '    steps:',
  '      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1',
  '        with:', '          persist-credentials: false',
  '      - run: test "$GITHUB_REF_NAME" = "v$(node -p \'require("./package.json").version\')"',
  '  publish:', '    needs: verify', '    runs-on: ubuntu-latest', '    permissions:', '      contents: read', '      id-token: write', '    steps:',
  '      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1',
  '        with:', '          persist-credentials: false', '      - run: npm publish', '',
].join('\n');
export function writeFile(root, rel, text) {
  if (path.isAbsolute(rel) || rel.split('/').some(part => part === '..') || rel.includes('\\')) throw Error('Fixture file must be relative');
  const file = path.join(root, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, typeof text === 'string' || Buffer.isBuffer(text) ? text : JSON.stringify(text, null, 2) + '\n');
  return file;
}
export function tempRepo(t, prefix = 'checker-case-') {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), prefix)));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}
export function makeBaseline(root) {
  fs.mkdirSync(root, { recursive: true });
  const readme = [
    '# sample-tool', '', `**${SAMPLE.lead}**`, '', 'Turn a label into a greeting from the terminal.', '',
    `Install: \`${SAMPLE.install}\`.`, '', `Uninstall: \`${SAMPLE.uninstall}\`.`, '',
    '## Common questions', '', '### What does the command do?', 'It prints a greeting.', '',
    '### How do I use it?', 'Pass a label.', '', '### How do I run the tests?', 'Run npm test.', '',
    '### Who is it for?', 'People learning small command line tools.', '', '## Credits', '', '[Credits](CREDITS.md).', '',
  ].join('\n');
  const files = {
    'README.md': readme,
    'llms.txt': `# sample-tool\n\n> ${SAMPLE.lead}\n\n## Docs\n\n- [Repository guide](https://example.com/sample-tool/guide): Read the guide.\n`,
    'AGENTS.md': '# Agent guidance\n\n## Use\n\nRun `npm test` to verify the tool.\n\n## Contribute\n\nKeep command output clear.\n',
    'CLAUDE.md': '# Host guidance\n\n@AGENTS.md\n',
    'CREDITS.md': '# Credits\n\n| Project | Link | License | Use |\n|---|---|---|---|\n| Example guide | https://github.com/example/guide | MIT | Documentation format |\n',
    'REPO_SETTINGS.md': `# Repository settings\n\nDescription: ${SAMPLE.description}\n`,
    '.github/CODEOWNERS': '* @example\n',
    '.github/dependabot.yml': 'version: 2\nupdates: []\n',
    '.github/pull_request_template.md': 'Describe the change and its check.\n',
    '.github/ISSUE_TEMPLATE/bug.yml': 'name: Bug\ndescription: Report a defect\nbody: []\n',
    '.github/ISSUE_TEMPLATE/feature.yml': 'name: Feature\ndescription: Describe a useful change\nbody: []\n',
    '.github/ISSUE_TEMPLATE/config.yml': 'blank_issues_enabled: false\n',
    '.github/workflows/release.yml': workflow,
    'bin/sample.mjs': '#!/usr/bin/env node\nconsole.log(`Hello, ${process.argv[2] || "reader"}!`);\n',
    'skills/sample-skill/SKILL.md': '---\nname: sample-skill\ndescription: Teaches a small command line workflow.\nlicense: MIT\n---\n\n# Sample skill\n\n## When invoked\n\nRead the command help before choosing a step.\n',
    '.repo-build/private.local.txt': ['# Synthetic fixture terms.', 'private' + '-seed-marker', ''].join('\n'),
    '.gitignore': '.repo-build/private.local.txt\n',
  };
  for (const file of ['LICENSE', 'CHANGELOG.md', 'CONTRIBUTING.md', 'CODE_OF_CONDUCT.md', 'SECURITY.md', 'MAINTAINERS.md', 'RELEASING.md']) files[file] = '# Project guide\n\nThis file describes the project practice.\n';
  for (const [rel, text] of Object.entries(files)) writeFile(root, rel, text);
  writeFile(root, '.repo-build/facts.json', SAMPLE);
  writeFile(root, 'package.json', {
    name: SAMPLE.name, version: SAMPLE.version, description: SAMPLE.description, type: 'module',
    homepage: SAMPLE.homepage, repository: SAMPLE.repository, bugs: 'https://github.com/example/sample-tool/issues',
    license: 'MIT', keywords: SAMPLE.keywords, bin: { 'sample-tool': 'bin/sample.mjs' },
    files: ['bin', 'skills'], scripts: { test: 'node --test' },
  });
  writeFile(root, 'package-lock.json', { name: SAMPLE.name, version: SAMPLE.version, lockfileVersion: 3, packages: { '': { name: SAMPLE.name, version: SAMPLE.version } } });
  writeFile(root, '.claude-plugin/plugin.json', { name: SAMPLE.name, version: SAMPLE.version, description: SAMPLE.description });
  writeFile(root, '.claude-plugin/marketplace.json', { name: SAMPLE.name, metadata: { version: SAMPLE.version }, plugins: [{ name: SAMPLE.name, version: SAMPLE.version }] });
  writeFile(root, 'skills/sample-skill/manifest.json', { name: 'sample-skill', packageVersion: SAMPLE.version, assets: [] });
  writeFile(root, 'proof/results.json', [{ value: 1, unit: 'sample', command: 'node bin/sample.mjs reader', measured: '2026-10-01T00:00:00Z', expires: '2027-01-01T00:00:00Z', package_version: SAMPLE.version, subject: 'package' }]);
  writeFile(root, '.repo-build/set.json', { version: 1, rows: [
    { name: SAMPLE.name, url: 'https://github.com/example/sample-tool', line: SAMPLE.description },
    { name: 'peer-tool', url: 'https://github.com/example/peer-tool', line: 'Peer package.' },
  ] });
  writeFile(root, '.repo-build/render-set.mjs', rendererBytes());
  const setBytes = fs.readFileSync(path.join(root, '.repo-build/set.json'));
  writeFile(root, '.repo-build/set.lock.json', { source: 'https://example.com/set.json', commit: null, sha256: sha256(setBytes), vendored_sha256: sha256(setBytes), renderer_sha256: sha256(rendererBytes()), fetched: '2026-10-19' });
  writeFile(root, '.repo-build/config.json', { set: { source: 'https://example.com/set.json' } });
  renderSet({ root });
  return root;
}
export function valueOf(value) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    if (Array.isArray(value.parts)) return value.parts.map(valueOf).join('');
    if (Number.isInteger(value.repeat)) return String(value.value).repeat(value.repeat);
  }
  return value;
}
function applyOperation(root, operation) {
  const file = path.join(root, operation.file);
  if (operation.op === 'remove') { fs.rmSync(file, { recursive: true, force: true }); return; }
  if (operation.op === 'write') { writeFile(root, operation.file, valueOf(operation.value)); return; }
  if (operation.op === 'append') { fs.appendFileSync(file, valueOf(operation.value)); return; }
  if (operation.op === 'replace') {
    const before = fs.readFileSync(file, 'utf8'), find = valueOf(operation.find);
    if (!before.includes(find)) throw Error(`Fixture replace target is absent: ${operation.file}`);
    writeFile(root, operation.file, before.replace(find, valueOf(operation.value))); return;
  }
  if (operation.op === 'json') {
    const data = JSON.parse(fs.readFileSync(file, 'utf8')), keys = operation.keys;
    let parent = data;
    for (const key of keys.slice(0, -1)) parent = parent[key];
    if (operation.remove) delete parent[keys.at(-1)]; else parent[keys.at(-1)] = valueOf(operation.value);
    writeFile(root, operation.file, data); return;
  }
  throw Error(`Unknown fixture operation: ${operation.op}`);
}
export function fixtureFetch(root, overrides = {}) {
  return async url => {
    const target = String(url), facts = JSON.parse(fs.readFileSync(path.join(root, '.repo-build/facts.json'), 'utf8'));
    const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
    let data, raw = false;
    if (target === 'https://example.com/set.json') { data = overrides.source ?? fs.readFileSync(path.join(root, '.repo-build/set.json'), 'utf8'); raw = true; }
    else if (target === 'https://api.github.com/repos/example/sample-tool/private-vulnerability-reporting') data = { enabled: true, ...overrides.pvr };
    else if (target === 'https://api.github.com/repos/example/sample-tool') data = { description: facts.description, homepage: facts.homepage, topics: facts.topics, private: false, ...overrides.about };
    else if (target === 'https://registry.npmjs.org/sample-tool') data = {
      'dist-tags': { latest: SAMPLE.version },
      versions: { [SAMPLE.version]: { description: overrides.registryDescription ?? facts.description, dist: { attestations: { url: 'https://example.com/attestation' } } } },
      readme, ...overrides.registry,
    };
    else if (/^https:\/\/raw\.githubusercontent\.com\/example\/sample-tool\/v[^/]+\/README\.md$/.test(target)) { data = readme; raw = true; }
    else throw Error(`Unexpected offline fixture request: ${target}`);
    return new Response(raw ? String(data) : JSON.stringify(data), { status: 200, headers: { 'content-type': raw ? 'text/plain' : 'application/json' } });
  };
}
export function materializeFixture(fixtureDir, root) {
  const fixture = JSON.parse(fs.readFileSync(path.join(fixtureDir, 'fixture.json'), 'utf8'));
  makeBaseline(root);
  for (const operation of fixture.operations ?? []) applyOperation(root, operation);
  const fetchImpl = fixtureFetch(root, fixture.online ?? {});
  return { root, fixture, fetchImpl, options: { online: true, env: {}, now: FIXED_NOW, fetchImpl } };
}
export function treeHash(root) {
  const hash = createHash('sha256');
  const walk = rel => {
    for (const name of fs.readdirSync(path.join(root, rel)).sort()) {
      const child = rel ? `${rel}/${name}` : name, full = path.join(root, child), info = fs.lstatSync(full);
      hash.update(child + '\0');
      if (info.isSymbolicLink()) hash.update(fs.readlinkSync(full));
      else if (info.isDirectory()) walk(child);
      else if (info.isFile()) hash.update(fs.readFileSync(full));
    }
  };
  walk(''); return hash.digest('hex');
}
