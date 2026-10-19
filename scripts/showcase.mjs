import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { ROOT, CORE, BIN, VERSION } from '../src/constants.mjs';

export function showcase(root = ROOT) {
  const manifest = JSON.parse(readFileSync(join(root, CORE, 'manifest.json'), 'utf8'));
  const destination = join(root, 'docs', 'showcase', 'self');
  mkdirSync(destination, { recursive: true });
  for (const route of manifest.routes) {
    const file = join(destination, `${route.id}.json`);
    if (!existsSync(file)) writeFileSync(file, `${JSON.stringify({ stage: route.id, status: 'UNVERIFIED', reason: 'Checker snapshot pending.' }, null, 2)}\n`);
  }
  const run = spawnSync(process.execPath, [join(root, BIN), 'check', '.', '--json'], {
    cwd: root, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
  });
  if (run.error || ![0, 1].includes(run.status)) throw Error(run.error?.message || run.stderr || run.stdout);
  const report = JSON.parse(run.stdout);
  if (!Array.isArray(report.results)) throw Error('Checker returned no result rows.');
  const checked = new Date().toISOString();
  mkdirSync(destination, { recursive: true });
  for (const route of manifest.routes) {
    const manual = (manifest.gates[route.id]?.manual || []).map(row => ({
      check: row.check,
      status: row.check === 'SC_PUBLIC' ? 'UNVERIFIED' : 'BLOCKED',
      evidence: row.check === 'SC_PUBLIC'
        ? 'REPO_SETTINGS.md records targets; the public settings read-back awaits owner action.'
        : row.check === 'FR_ACCEPTANCE'
          ? 'Owner-quoted acceptance replay requires maintainer confirmation of the final artifact.'
          : row.check === 'RL_REVIEW'
            ? 'Independent review or a dated owner waiver awaits completion.'
            : row.check.startsWith('RL_')
              ? 'Registry publication and trust identity await owner completion and read-back.'
              : 'Submission or listing awaits owner completion and a public receipt.',
      hands: row.hands, waivable: row.waivable,
    }));
    const receipt = {
      schemaVersion: 1, stage: route.id, package_version: VERSION,
      command: 'check . --json', entrypoint: 'package bin declared in package.json',
      checked, checker_exit: run.status,
      automated: report.results.filter(row => row.stage === route.id), manual,
    };
    writeFileSync(join(destination, `${route.id}.json`), `${JSON.stringify(receipt, null, 2)}\n`);
  }
  return { stages: manifest.routes.length, checker_exit: run.status };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { console.log(JSON.stringify(showcase(), null, 2)); }
  catch (error) { console.error(error.stack || error.message); process.exitCode = 2; }
}
