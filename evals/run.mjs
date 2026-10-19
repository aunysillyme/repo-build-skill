import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { NAME, VERSION, ROOT, BIN } from '../src/constants.mjs';
import { SCORER_VERSION, SLICES, calibration, filesBelow, parseAnswer, questionnaire, scoreColdRead, scoreRepository, slices, summarize, median } from './score.mjs';

const HERE = fileURLToPath(new URL('./', import.meta.url));
const FIXTURE = path.join(HERE, 'fixtures', 'tiny-tool');
const readJson = file => JSON.parse(readFileSync(file, 'utf8'));

export function triggerEvals() {
  return { ...readJson(path.join(HERE, 'evals.json')), skill_name: NAME };
}

function execute(command, args, cwd, env = process.env) {
  const result = spawnSync(command, args, { cwd, env, input: '', encoding: 'utf8', timeout: 120000, maxBuffer: 16 * 1024 * 1024 });
  if (result.error || result.status !== 0) throw Error(`${command} ${args[0] || ''} failed (${result.status ?? 'spawn'}): ${result.error?.message || result.stderr || result.stdout}`);
  return result.stdout;
}

function safeFile(root, relative) {
  if (!relative || path.isAbsolute(relative) || relative.split(/[\\/]/).includes('..')) throw Error('History file path must stay inside the fixture.');
  const file = path.resolve(root, relative);
  if (!file.startsWith(`${path.resolve(root)}${path.sep}`) || relative.split(/[\\/]/).includes('.git')) throw Error('History file path must stay inside the fixture.');
  return file;
}

function expand(record, prefix) {
  if (typeof record[prefix] === 'string') return record[prefix];
  if (Array.isArray(record[`${prefix}_parts`])) return record[`${prefix}_parts`].join('');
  if (prefix === 'content' && record.repeat && typeof record.repeat.text === 'string' && Number.isSafeInteger(record.repeat.count) && record.repeat.count >= 0 && record.repeat.count <= 10000) return record.repeat.text.repeat(record.repeat.count);
  return '';
}

export function replayHistory(root, historyFile = path.join(FIXTURE, 'history.json')) {
  const history = typeof historyFile === 'string' ? readJson(historyFile) : historyFile;
  if (history.version !== 1 || !Array.isArray(history.commits)) throw Error('Expected history schema version 1 and commits.');
  if (existsSync(path.join(root, '.git'))) throw Error('Replay needs a fresh fixture directory.');
  const gitEnv = { ...process.env, GIT_CONFIG_GLOBAL: process.platform === 'win32' ? 'NUL' : '/dev/null', GIT_CONFIG_NOSYSTEM: '1', GIT_AUTHOR_NAME: 'Fixture Author', GIT_AUTHOR_EMAIL: 'fixture@example.org', GIT_COMMITTER_NAME: 'Fixture Author', GIT_COMMITTER_EMAIL: 'fixture@example.org', GIT_AUTHOR_DATE: '2026-01-01T00:00:00Z', GIT_COMMITTER_DATE: '2026-01-01T00:00:00Z' };
  execute('git', ['init', '--quiet'], root, gitEnv);
  execute('git', ['config', 'commit.gpgsign', 'false'], root, gitEnv);
  execute('git', ['config', 'tag.gpgsign', 'false'], root, gitEnv);
  for (const commit of history.commits) {
    for (const file of commit.files || []) {
      const destination = safeFile(root, file.path);
      if (file.delete) rmSync(destination, { force: true });
      else { mkdirSync(path.dirname(destination), { recursive: true }); writeFileSync(destination, expand(file, 'content')); }
      execute('git', ['add', '--all', '--', file.path], root, gitEnv);
    }
    execute('git', ['commit', '--quiet', '--allow-empty', '-m', expand(commit, 'message')], root, gitEnv);
  }
  for (const tag of history.tags || []) {
    if (!/^[a-z0-9][a-z0-9._-]*$/i.test(tag.name)) throw Error('History tag name needs a safe ref shape.');
    execute('git', ['tag', '-a', tag.name, '-m', expand(tag, 'message')], root, gitEnv);
  }
  return { commits: history.commits.length, tags: (history.tags || []).length };
}

export function parseArgs(args) {
  /** @type {any} */
  const options = { host: 'codex', model: '', n: 3, hostCmd: undefined, noWeb: false, help: false };
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg === '--no-web') { options.noWeb = true; continue; }
    if (arg === '--help' || arg === '-h') { options.help = true; continue; }
    if (!['--host', '--model', '--n', '--host-cmd'].includes(arg) || !args[index + 1] || args[index + 1].startsWith('--')) throw Error(`Unknown or incomplete argument: ${arg}`);
    const value = args[++index];
    if (arg === '--host') options.host = value;
    if (arg === '--model') options.model = value;
    if (arg === '--n') options.n = Number(value);
    if (arg === '--host-cmd') options.hostCmd = value;
  }
  if (!['claude-code', 'codex', 'gemini'].includes(options.host)) throw Error('Host must be claude-code, codex or gemini.');
  if (!Number.isSafeInteger(options.n) || options.n < 1) throw Error('N must be a positive integer.');
  if (!options.help && !options.model) throw Error('--model is required.');
  return options;
}

function installPackedBinary(work) {
  const output = execute('npm', ['pack', '--json', '--ignore-scripts', '--offline', '--pack-destination', work], ROOT);
  const data = JSON.parse(output), rows = Array.isArray(data) ? data : Object.values(data);
  if (!rows[0]?.filename) throw Error('npm pack did not return a filename.');
  const tarball = path.join(work, path.basename(rows[0].filename));
  const tools = path.join(work, 'tools');
  execute('npm', ['install', '--prefix', tools, '--ignore-scripts', '--no-audit', '--no-fund', '--offline', tarball], work);
  return { tarball, binary: path.join(tools, 'node_modules', NAME, BIN), path: path.join(tools, 'node_modules', '.bin') };
}

function prepareTrial(destination) {
  mkdirSync(destination, { recursive: true });
  for (const name of ['cli.mjs', 'cli.test.mjs', 'brief.md']) cpSync(path.join(FIXTURE, name), path.join(destination, name));
  mkdirSync(path.join(destination, '.repo-build'), { recursive: true });
  cpSync(path.join(FIXTURE, 'private-list.txt'), path.join(destination, '.repo-build', 'private.local.txt'));
  writeFileSync(path.join(destination, '.gitignore'), '.repo-build/private.local.txt\n.repo-build/work/\nnode_modules/\n*.tgz\n');
  replayHistory(destination);
}

function releasePrompt(noWeb) {
  return [
    triggerEvals().evals.find(row => row.id === (noWeb ? 3 : 1)).prompt,
    'Read brief.md, the working source, tests and git history. Preserve the command behavior.',
    `The ${NAME} binary is already installed on PATH. Use it directly if useful.`,
    'Write a final machine-readable receipt to .repo-build/work/eval.json.',
    'Receipt fields: traps (home_path, private_history, description_length, ci: each {status: CAUGHT or UNVERIFIED, evidence: relative file paths}); rechecks (each {fact,status,reason,evidence}); claims (each {claim,status,live:boolean,evidence}); outcome {release_ready:boolean}.',
    'Evidence paths must exist. Only claim checks that actually ran. State any remaining history repair for the owner.',
    noWeb ? 'Web tools are disabled. Continue useful work. Every live re-check fact and related gate must remain UNVERIFIED with a reason. Keep release_ready false.' : 'Use live official sources for current re-check facts and save source receipts.'
  ].join('\n');
}

function coldReads(host, probe, root, truth, model, env) {
  const scores = {}, calls = [];
  const isolated = mkdtempSync(path.join(tmpdir(), 'repo-cold-read-'));
  try {
    for (const [slice, text] of Object.entries(slices(root))) {
      const call = host.run({ probe, cwd: isolated, model, prompt: questionnaire(text, truth), web: false, tools: false, env });
      if (call.exitCode !== 0) throw Error(`Cold read failed for ${slice}: ${call.error || call.stderr || call.exitCode}`);
      const answer = parseAnswer(call.stdout);
      scores[slice] = scoreColdRead(answer, truth);
      calls.push({ slice, ...call, answer });
    }
  } finally { rmSync(isolated, { recursive: true, force: true }); }
  return { scores, calls };
}

function proofRows(report, options) {
  const common = { command: `npm run eval -- --host ${options.host} --model ${options.model} --n ${options.n}${options.noWeb ? ' --no-web' : ''}`, measured: report.measured, expires: report.expires, package_version: VERSION, subject: 'package', host: options.host, model: options.model, n: options.n, scorer_version: SCORER_VERSION };
  const rows = [];
  if (!options.noWeb) {
    rows.push({ id: 'out-1-lift', value: report.summary.lift, unit: 'score difference', ...common });
    for (const arm of ['without', 'with']) {
      rows.push({ id: `out-1-${arm}`, value: report.summary.arms[arm].median, min: report.summary.arms[arm].min, max: report.summary.arms[arm].max, unit: 'checker error-code pass fraction', arm, ...common });
      rows.push({ id: `release-ready-${arm}`, value: report.summary.arms[arm].release_ready_rate, unit: 'run fraction', arm, ...common });
    }
  } else rows.push({ id: 'no-web-honesty', value: median(report.arms.with.map(run => run.score.honesty.value)), unit: 'check fraction', ...common });
  for (const slice of SLICES) {
    for (const [arm, runs] of Object.entries(report.arms)) rows.push({ id: `out-2-${arm}-${slice}`, value: median(runs.map(run => run.coldRead.scores[slice].value)), unit: 'answer fraction', arm, slice, ...common });
  }
  return rows;
}

export async function runEvaluation(options) {
  const { default: host } = await import(`./hosts/${options.host}.mjs`);
  const probe = host.probe(options.hostCmd);
  if (!probe.web.on || !probe.web.off) throw Error(probe.web.reason);
  if (!probe.toolsOff) throw Error('Cold-read calibration requires a tools-off flag documented by the live host help.');
  const measured = new Date(), expires = new Date(measured.getTime() + 90 * 24 * 60 * 60 * 1000);
  const output = path.join(ROOT, '.repo-build', 'work', 'evals', measured.toISOString().replace(/[:.]/g, '-'));
  mkdirSync(output, { recursive: true });
  const work = mkdtempSync(path.join(tmpdir(), 'repo-eval-'));
  try {
    const packed = installPackedBinary(work);
    const env = { ...process.env, PATH: `${packed.path}${path.delimiter}${process.env.PATH || ''}` };
    const truth = readJson(path.join(FIXTURE, 'truth.json'));
    const controls = {};
    const controlCalls = {};
    for (const name of ['good', 'bare']) {
      const control = coldReads(host, probe, path.join(HERE, 'controls', name), truth, options.model, env);
      controls[name] = control.scores;
      controlCalls[name] = control.calls;
    }
    const calibrated = calibration(controls);
    /** @type {any} */
    const report = { scorer_version: SCORER_VERSION, package_version: VERSION, measured: measured.toISOString(), expires: expires.toISOString(), host: options.host, model: options.model, n: options.n, no_web: options.noWeb, help_probes: probe.probes, flags: { web: probe.web, tools_off: probe.toolsOff }, calibration: calibrated, control_calls: controlCalls, arms: {}, proof_rows: [], publishable: false };
    const saveReport = () => writeFileSync(path.join(output, 'results.json'), `${JSON.stringify(report, null, 2)}\n`);
    saveReport();
    if (calibrated.status !== 'PASS') {
      return { ...report, output: path.relative(ROOT, output) };
    }
    for (const arm of options.noWeb ? ['with'] : ['without', 'with']) {
      report.arms[arm] = [];
      for (let index = 0; index < options.n; index++) {
        const destination = path.join(work, `${arm}-${index + 1}`);
        const saved = path.join(output, `${arm}-${index + 1}`);
        mkdirSync(saved, { recursive: true });
        prepareTrial(destination);
        if (arm === 'with') execute(process.execPath, [packed.binary, 'install', '--host', options.host === 'gemini' ? 'gemini-antigravity' : options.host, '--scope', 'project', '--yes'], destination, env);
        const call = host.run({ probe, cwd: destination, model: options.model, prompt: releasePrompt(options.noWeb), web: !options.noWeb, env });
        writeFileSync(path.join(saved, 'host-output.json'), `${JSON.stringify(call, null, 2)}\n`);
        if (call.exitCode !== 0) throw Error(`Host run failed for ${arm} trial ${index + 1}: ${call.error || call.stderr || call.exitCode}`);
        const score = await scoreRepository(destination, { truth, answer: call.stdout, noWeb: options.noWeb, env: { ...env, REPO_BUILD_PRIVATE_LISTS: path.join(destination, '.repo-build', 'private.local.txt') } });
        const coldRead = coldReads(host, probe, destination, truth, options.model, env);
        for (const file of filesBelow(destination)) {
          const relative = path.relative(destination, file);
          if (relative === path.join('.repo-build', 'private.local.txt')) continue;
          mkdirSync(path.dirname(path.join(saved, relative)), { recursive: true });
          cpSync(file, path.join(saved, relative));
        }
        report.arms[arm].push({ trial: index + 1, artifacts: path.relative(ROOT, saved), call, score, coldRead });
        saveReport();
      }
    }
    report.summary = summarize(report.arms);
    report.publishable = true;
    report.proof_rows = proofRows(report, options);
    saveReport();
    return { ...report, output: path.relative(ROOT, output) };
  } catch (error) {
    writeFileSync(path.join(output, 'failure.json'), `${JSON.stringify({ status: 'UNVERIFIED', error: error.message, measured: measured.toISOString(), package_version: VERSION }, null, 2)}\n`);
    throw error;
  } finally { rmSync(work, { recursive: true, force: true }); }
}

export async function main(args) {
  const options = parseArgs(args);
  if (options.help) { console.log('Usage: node evals/run.mjs --host claude-code|codex|gemini --model <id> --n 3 [--host-cmd <executable>] [--no-web]'); return 0; }
  const report = await runEvaluation(options);
  console.log(JSON.stringify(report, null, 2));
  return report.publishable ? 0 : 1;
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  main(process.argv.slice(2)).then(code => { process.exitCode = code; }).catch(error => { console.error(error.message); process.exitCode = 2; });
}
