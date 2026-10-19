import fs from 'node:fs/promises';
import { realpathSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { check } from '../src/check/index.mjs';

const HEALTH_CODES = new Set([
  'M_LLMS_SHAPE', 'M_LLMS_LEAD', 'M_ENTITY', 'R_DESC', 'R_META', 'R_VERSION',
  'O_ABOUT', 'O_REGISTRY', 'O_PVR', 'S_DRIFT',
]);

async function readJson(file) {
  try { return JSON.parse(await fs.readFile(file, 'utf8')); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}

export async function measureHealth(root, options = {}) {
  const env = options.env || process.env;
  const fetchImpl = options.fetchImpl || fetch;
  const report = await (options.checkImpl || check)(root, {
    online: true, env: { ...env, CI: 'true' }, fetchImpl,
  });
  const findings = report.results.filter(row => HEALTH_CODES.has(row.id)
    && ['FAIL', 'WARN', 'SKIPPED', 'UNREADABLE'].includes(String(row.status).toUpperCase()));
  if (report.exitCode === 3) findings.push({ id: 'ONLINE', status: 'UNVERIFIED', message: 'The online checker could not reach a required service.' });
  const facts = await readJson(path.join(root, '.repo-build', 'facts.json'));
  const metadata = await readJson(path.join(root, 'package.json'));
  const homepage = facts?.homepage || metadata?.homepage;
  if (!homepage) findings.push({ id: 'HOMEPAGE', status: 'UNVERIFIED', message: 'Set a homepage in facts or package metadata.' });
  else {
    try {
      const url = new URL(homepage);
      if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) throw new Error('Use an HTTP homepage URL with no embedded credentials.');
      const response = await fetchImpl(url.href, { redirect: 'follow', signal: AbortSignal.timeout(15000) });
      if (!response.ok) findings.push({ id: 'HOMEPAGE', status: 'FAIL', message: `Homepage returned HTTP ${response.status}.` });
      await response.body?.cancel();
    } catch (error) {
      findings.push({ id: 'HOMEPAGE', status: 'UNVERIFIED', message: `Homepage check failed: ${error.message}` });
    }
  }
  return { version: report.version, measured: new Date().toISOString(), findings, healthy: findings.length === 0 };
}

export async function updateHealthIssue(result, options = {}) {
  const env = options.env || process.env;
  const fetchImpl = options.fetchImpl || fetch;
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(env.GITHUB_REPOSITORY || '')) throw new Error('Set GITHUB_REPOSITORY to OWNER/NAME to maintain the health issue.');
  if (!env.GITHUB_TOKEN) throw new Error('Set GITHUB_TOKEN to maintain the health issue.');
  const base = `https://api.github.com/repos/${env.GITHUB_REPOSITORY}`;
  const headers = {
    authorization: `Bearer ${env.GITHUB_TOKEN}`,
    accept: 'application/vnd.github+json',
    'x-github-api-version': '2022-11-28',
    'content-type': 'application/json',
  };
  async function api(endpoint, method = 'GET', body) {
    const response = await fetchImpl(`${base}${endpoint}`, {
      method, headers, body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) throw new Error(`GitHub ${method} ${endpoint}: ${response.status} ${await response.text()}`);
    return response.status === 204 ? null : response.json();
  }
  const issues = (await api('/issues?labels=repo-health&state=open&per_page=100')).filter(issue => !issue.pull_request);
  if (result.healthy) {
    for (const issue of issues) await api(`/issues/${issue.number}`, 'PATCH', { state: 'closed', state_reason: 'completed' });
    return { action: issues.length ? 'closed' : 'clear', count: issues.length };
  }
  const body = [
    'Public listing and repository parity need a maintainer review.', '',
    ...result.findings.map(row => `- ${row.status} ${row.id}: ${row.message}`), '',
    `Measured: ${result.measured}`, '',
    'Run `node scripts/repo-health.mjs --check-only` to reproduce. The set lock is checked against the vendored files.',
  ].join('\n');
  if (!issues.length) {
    const labels = await api('/labels?per_page=100');
    if (!labels.some(label => label.name === 'repo-health')) await api('/labels', 'POST', { name: 'repo-health', color: 'd4c5f9', description: 'Repository and public listing parity' });
    const issue = await api('/issues', 'POST', { title: 'Repository health needs review', body, labels: ['repo-health'] });
    return { action: 'opened', number: issue.number };
  }
  await api(`/issues/${issues[0].number}`, 'PATCH', { title: 'Repository health needs review', body });
  for (const issue of issues.slice(1)) await api(`/issues/${issue.number}`, 'PATCH', { state: 'closed', state_reason: 'not_planned' });
  return { action: 'updated', number: issues[0].number };
}

async function main() {
  const args = process.argv.slice(2);
  if (args.some(arg => arg !== '--check-only')) throw new Error('Usage: node scripts/repo-health.mjs [--check-only]');
  const result = await measureHealth(process.cwd());
  const issue = args.includes('--check-only') ? null : await updateHealthIssue(result);
  console.log(JSON.stringify({ ...result, issue }, null, 2));
  process.exitCode = result.healthy ? 0 : 1;
}

const isMain = (() => {
  try { return !!process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url)); }
  catch { return false; }
})();
if (isMain) {
  main().catch(error => { console.error(error.stack || error.message); process.exitCode = 2; });
}
