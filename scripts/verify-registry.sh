#!/usr/bin/env bash
# Maintainer-run after publishing. Reads the registry and the tagged source.
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
if [ "${1:-}" = --help ]; then
  printf 'Usage: scripts/verify-registry.sh vX.Y.Z [--timeout-seconds 180] [--interval-seconds 10]\n'
  exit 0
fi
command -v node >/dev/null || { printf 'Required tool: node\n' >&2; exit 2; }
command -v npm >/dev/null || { printf 'Required tool: npm\n' >&2; exit 2; }
command -v git >/dev/null || { printf 'Required tool: git\n' >&2; exit 2; }
export REGISTRY_VERIFY_ROOT="$repo_root"
node --input-type=module - "$@" <<'NODE'
import { execFileSync } from 'node:child_process';
import { setTimeout as pause } from 'node:timers/promises';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const tag = args.shift();
if (!/^v\d+\.\d+\.\d+(?:[-+][A-Za-z0-9.-]+)?$/.test(tag || '')) {
  console.error('Usage: scripts/verify-registry.sh vX.Y.Z [--timeout-seconds 180] [--interval-seconds 10]');
  process.exit(2);
}
let timeout = 180;
let interval = 10;
while (args.length) {
  const flag = args.shift();
  const value = args.shift();
  if (!['--timeout-seconds', '--interval-seconds'].includes(flag) || !/^\d+$/.test(value || '') || Number(value) < 1) {
    console.error('Use positive integer timeout and interval options.');
    process.exit(2);
  }
  if (flag === '--timeout-seconds') timeout = Number(value);
  else interval = Number(value);
}
if (timeout <= 90) {
  console.error('The registry lag window needs a timeout greater than 90 seconds.');
  process.exit(2);
}
const root = process.env.REGISTRY_VERIFY_ROOT;
const source = file => execFileSync('git', ['show', `${tag}:${file}`], { cwd: root, encoding: 'utf8' });
const metadata = JSON.parse(source('package.json'));
const expectedReadme = source('README.md');
const version = tag.slice(1);
if (metadata.version !== version) throw new Error('The tag and tagged package version differ.');
const { npmCall } = await import(pathToFileURL(`${root}/src/npm.mjs`).href);
function view(spec, fields) {
  const call = npmCall(['view', spec, ...fields, '--prefer-online', '--json']);
  const output = execFileSync(call.command, call.args, {
    ...call.options, cwd: root, encoding: 'utf8', timeout: 30000, stdio: ['ignore', 'pipe', 'pipe'],
  });
  return JSON.parse(output);
}
function sorted(value) {
  if (Array.isArray(value)) return value.map(sorted);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(key => [key, sorted(value[key])]));
  return value;
}
const same = (left, right) => JSON.stringify(sorted(left)) === JSON.stringify(sorted(right));
const funding = value => (Array.isArray(value) ? value : [value]).filter(Boolean).map(row => typeof row === 'string' ? { url: row } : row);
const bins = value => typeof value === 'string' ? { [metadata.name.split('/').at(-1)]: value } : value;
const deadline = Date.now() + timeout * 1000;
let attempt = 0;
let problems = [];
do {
  attempt += 1;
  try {
    const published = view(`${metadata.name}@${version}`, ['version', 'dist.attestations', 'description', 'bin', 'funding', 'homepage']);
    const readme = view(metadata.name, ['readme']);
    const attestation = published['dist.attestations'] || published.dist?.attestations;
    problems = [];
    if (published.version !== version) problems.push('version differs');
    if (!attestation || (typeof attestation === 'object' && !Object.keys(attestation).length)) problems.push('attestation is pending');
    if (readme !== expectedReadme) problems.push('registry README differs from the tagged README');
    if (published.description !== metadata.description) problems.push('description differs');
    if (!same(bins(published.bin), bins(metadata.bin))) problems.push('bin differs');
    if (!same(funding(published.funding), funding(metadata.funding))) problems.push('funding differs');
    if (published.homepage !== metadata.homepage) problems.push('homepage differs');
    if (!problems.length) {
      console.log(`PASS ${metadata.name}@${version}: version, attestation, README, description, bin, funding and homepage match ${tag}.`);
      process.exit(0);
    }
  } catch (error) {
    problems = [error.stderr ? String(error.stderr).trim() : error.message];
  }
  const remaining = deadline - Date.now();
  console.error(`Registry attempt ${attempt}: ${problems.join('; ')}`);
  if (remaining <= 0) break;
  await pause(Math.min(interval * 1000, remaining));
} while (Date.now() <= deadline);
console.error(`FAIL registry parity after the ${timeout}-second lag window: ${problems.join('; ')}`);
process.exit(1);
NODE
