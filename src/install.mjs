import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createInterface } from 'node:readline/promises';
import { NAME, VERSION, ROOT } from './constants.mjs';
import { hosts } from './catalog.mjs';
import { receiptName, digest, stat, canonical, safePath, readBytes, readReceipt, writeNew, replaceExact } from './receipt.mjs';

const result = (code, message, extra = {}) => ({ code, message, ...extra });
function context(options) {
  const host = options.host ?? options.target;
  if (!Object.hasOwn(hosts, host)) throw Error(`Choose a host: ${Object.keys(hosts).join(', ')}`);
  const scope = options.scope ?? 'project';
  if (!hosts[host].scopes.includes(scope)) throw Error(`${host} supports ${hosts[host].scopes.join(', ')} scope`);
  const root = canonical(scope === 'user' ? (options.home ?? os.homedir()) : (options.dir ?? process.cwd()));
  const destination = hosts[host].target;
  const receipt = options.receipt ?? (destination ? `${destination}/${receiptName}` : null);
  if (destination) safePath(root, destination, 'dir');
  if (receipt) {
    safePath(root, receipt);
    if (!receipt.startsWith(`${destination}/`)) throw Error('Receipt must be inside the skill target');
  }
  return { host, scope, root, destination, receipt };
}
function sourceFiles(root) {
  const output = [];
  // Directories are walked separately so safePath can enforce their kind.
  const visit = rel => {
    for (const name of fs.readdirSync(rel ? path.join(root, rel) : root).sort()) {
      const child = rel ? `${rel}/${name}` : name;
      const full = path.join(root, child), info = stat(full);
      if (info?.isSymbolicLink()) throw Error(`Symlink refused in package: ${child}`);
      if (info?.isDirectory()) { safePath(root, child, 'dir'); visit(child); }
      else if (info?.isFile()) output.push({ rel: child, bytes: readBytes(root, child) });
      else throw Error(`Expected package file: ${child}`);
    }
  };
  visit('');
  return output;
}
function blockFor(destination) {
  return `<!-- ${NAME}:start -->\nRead ${destination}/SKILL.md when preparing a repository build, release or launch.\n<!-- ${NAME}:end -->`;
}
function planInstall(options, ctx) {
  const sourceRoot = canonical(options.sourceRoot ?? path.join(ROOT, 'skills', NAME));
  const prior = stat(path.join(ctx.root, ctx.receipt)) ? readReceipt(ctx.root, ctx.receipt, ctx) : null;
  const owned = new Map((prior?.receipt.files ?? []).map(entry => [entry.path, entry]));
  /** @type {Array<{path:string,bytes:Buffer,before:Buffer|null,sha256:string,action:string,block?:string,separator?:string,created?:boolean,carried?:boolean}>} */
  const entries = sourceFiles(sourceRoot).map(file => {
    const rel = `${ctx.destination}/${file.rel}`, before = readBytes(ctx.root, rel);
    if (rel === ctx.receipt) throw Error('Receipt collides with skill content');
    if (before && !before.equals(file.bytes)) throw Error(`Install conflict: ${rel}`);
    return { path: rel, bytes: file.bytes, before, sha256: digest(file.bytes), action: before ? (owned.get(rel)?.action ?? 'identical') : 'written' };
  });
  if (!entries.length) throw Error('The skill folder is empty');
  if (ctx.host === 'agents-md') {
    const rel = 'AGENTS.md', before = readBytes(ctx.root, rel), block = blockFor(ctx.destination);
    const old = owned.get(rel);
    if (old) {
      if (!before || !before.toString('utf8').includes(`${old.separator}${old.block}\n`) || digest(Buffer.from(old.block)) !== old.sha256) throw Error(`Install conflict: ${rel}`);
      entries.push({ ...old, bytes: before, before });
    } else {
      const text = before?.toString('utf8') ?? '';
      if (text.includes(`<!-- ${NAME}:`)) throw Error(`Review existing markers in ${rel}`);
      const separator = text ? (text.endsWith('\n') ? '\n' : '\n\n') : '';
      entries.push({ path: rel, before, bytes: Buffer.from(`${text}${separator}${block}\n`), block, separator, sha256: digest(Buffer.from(block)), action: 'block', created: !before });
    }
  }
  for (const old of prior?.receipt.files ?? []) {
    if (entries.some(entry => entry.path === old.path)) continue;
    entries.push({ ...old, bytes: readBytes(ctx.root, old.path), before: readBytes(ctx.root, old.path), carried: true });
  }
  return { entries, prior };
}
/** @param {any} [options] */
export function install(options = {}) {
  if (options.uninstall) return uninstall(options);
  let ctx, planned;
  try {
    ctx = context(options);
    if (ctx.host === 'chat-upload') {
      const bundleRoot = path.join(ROOT, 'docs', 'bundles');
      const bundles = fs.existsSync(bundleRoot) ? fs.readdirSync(bundleRoot).filter(name => name.endsWith('.md')).sort() : [];
      if (!bundles.length) return result(2, 'Generate the chat bundle with the package build command first.');
      return result(0, `Upload this bundle to your chat: ${path.join(bundleRoot, bundles[0])}\nManual step: remove the uploaded bundle from your chat when finished.`);
    }
    planned = planInstall(options, ctx);
  } catch (error) { return result(2, error.message); }
  const { entries, prior } = planned;
  const operations = entries.filter(e => !e.carried && !e.before?.equals(e.bytes)).map(e => `${e.before ? 'update' : 'write'}: ${e.path}`);
  operations.push(`write receipt: ${ctx.receipt}`);
  if (options.dryRun ?? options.dry) return result(0, `Dry run; no files changed.\n${operations.join('\n')}`, { operations });
  const made = [...(prior?.receipt.directories ?? [])], landed = [];
  try {
    for (const entry of entries) {
      if (entry.carried || entry.before?.equals(entry.bytes)) continue;
      if (entry.before) replaceExact(ctx.root, entry.path, entry.before, entry.bytes);
      else writeNew(ctx.root, entry.path, entry.bytes, made);
      landed.push(entry.path);
    }
    for (const entry of entries.filter(e => !e.carried)) {
      if (!readBytes(ctx.root, entry.path)?.equals(entry.bytes)) throw Error(`Install read-back failed: ${entry.path}`);
    }
    const receipt = {
      schemaVersion: 1, package: { name: NAME, version: VERSION }, host: ctx.host, scope: ctx.scope,
      destination: ctx.destination, installed: new Date().toISOString(), activation: 'UNVERIFIED',
      files: entries.filter(e => e.bytes).map(({ path: rel, sha256, action, block, separator, created }) => ({ path: rel, sha256, action, ...(block ? { block, separator, created } : {}) })),
      directories: [...new Set(made)],
    };
    const bytes = Buffer.from(JSON.stringify(receipt, null, 2) + '\n');
    if (prior) replaceExact(ctx.root, ctx.receipt, prior.bytes, bytes);
    else writeNew(ctx.root, ctx.receipt, bytes, made);
    return result(0, `Install complete. Host activation: UNVERIFIED.\n${operations.join('\n')}\nManual step: open the skill in your host and confirm it is available.`, { operations, receipt: ctx.receipt });
  } catch (error) {
    const retained = [];
    for (const rel of [...landed].reverse()) {
      const entry = entries.find(item => item.path === rel);
      try {
        if (!readBytes(ctx.root, rel)?.equals(entry.bytes)) { retained.push(rel); continue; }
        if (entry.before) replaceExact(ctx.root, rel, entry.bytes, entry.before);
        else fs.unlinkSync(safePath(ctx.root, rel));
      } catch { retained.push(rel); }
    }
    for (const rel of [...made].reverse()) {
      if (prior?.receipt.directories.includes(rel)) continue;
      try { const full = safePath(ctx.root, rel, 'dir'); if (stat(full)?.isDirectory() && !fs.readdirSync(full).length) fs.rmdirSync(full); } catch { /* Keep paths that changed. */ }
    }
    return result(1, `Install interrupted: ${error.message}\nRetained paths: ${retained.join(', ') || 'none'}\nManual step: review retained paths before retrying.`, { operations });
  }
}
/** @param {any} [options] */
export function uninstall(options = {}) {
  let ctx, saved, plans;
  try {
    ctx = context(options);
    if (!ctx.destination) return result(0, 'Manual step: remove the uploaded bundle from your chat.');
    saved = readReceipt(ctx.root, ctx.receipt, ctx);
    plans = saved.receipt.files.map(entry => {
      const before = readBytes(ctx.root, entry.path);
      if (!before) return { entry, before, action: 'absent' };
      if (entry.action === 'identical') return { entry, before, action: 'keep', reason: 'pre-existing file' };
      if (entry.action === 'block') {
        const needle = `${entry.separator}${entry.block}\n`, text = before.toString('utf8');
        const at = text.indexOf(needle);
        if (at < 0 || text.indexOf(needle, at + needle.length) >= 0 || digest(Buffer.from(entry.block)) !== entry.sha256) return { entry, before, action: 'keep', reason: 'edited block' };
        const after = Buffer.from(text.slice(0, at) + text.slice(at + needle.length));
        return { entry, before, action: entry.created && !after.length ? 'remove' : 'strip', after };
      }
      return { entry, before, action: digest(before) === entry.sha256 ? 'remove' : 'keep', reason: 'edited file' };
    });
  } catch (error) { return result(2, error.message); }
  const operations = plans.filter(p => p.action !== 'absent').map(p => `${p.action}: ${p.entry.path}${p.action === 'keep' ? ` (${p.reason})` : ''}`);
  const retained = plans.some(p => p.action === 'keep' && p.entry.action !== 'identical');
  operations.push(`${retained ? 'keep' : 'remove'} receipt: ${ctx.receipt}`);
  operations.push('Manual step: remove any references or pasted instructions you added yourself.');
  if (options.dryRun ?? options.dry) return result(0, `Dry run; no files changed.\n${operations.join('\n')}`, { operations });
  try {
    // Validate all observed bytes before the first mutation, then re-probe each path.
    for (const plan of plans) if (plan.before && !readBytes(ctx.root, plan.entry.path)?.equals(plan.before)) throw Error(`File changed during preflight: ${plan.entry.path}`);
    if (!readBytes(ctx.root, ctx.receipt)?.equals(saved.bytes)) throw Error('Receipt changed during preflight');
    for (const plan of plans) {
      if (!['remove', 'strip'].includes(plan.action)) continue;
      const full = safePath(ctx.root, plan.entry.path);
      if (!readBytes(ctx.root, plan.entry.path)?.equals(plan.before)) throw Error(`File changed before removal: ${plan.entry.path}`);
      if (plan.action === 'remove') fs.unlinkSync(safePath(ctx.root, plan.entry.path));
      else replaceExact(ctx.root, plan.entry.path, plan.before, plan.after);
    }
    if (!retained) {
      if (!readBytes(ctx.root, ctx.receipt)?.equals(saved.bytes)) throw Error('Receipt changed before removal');
      fs.unlinkSync(safePath(ctx.root, ctx.receipt));
    }
    for (const rel of [...new Set(saved.receipt.directories)].sort((a, b) => b.split('/').length - a.split('/').length)) {
      const full = safePath(ctx.root, rel, 'dir');
      if (stat(full)?.isDirectory() && fs.readdirSync(full).length === 0) fs.rmdirSync(safePath(ctx.root, rel, 'dir'));
    }
    return result(0, operations.join('\n'), { operations });
  } catch (error) { return result(1, `Uninstall interrupted: ${error.message}\nManual step: review the retained receipt and paths.`, { operations }); }
}
/** @param {string[]} [args] @param {any} [io] */
export async function runInstaller(args = [], io = {}) {
  /** @type {any} */
  const options = {};
  const values = new Map([['--host', 'host'], ['--target', 'host'], ['--scope', 'scope'], ['--dir', 'dir'], ['--receipt', 'receipt']]);
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg === 'install') continue;
    if (arg === 'uninstall' || arg === '--uninstall') options.uninstall = true;
    else if (arg === '--yes') options.yes = true;
    else if (arg === '--dry-run' || arg === '--dry') options.dryRun = true;
    else if (arg === '--user') options.scope = 'user';
    else if (arg === '--project') options.scope = 'project';
    else if (values.has(arg)) {
      const value = args[++index];
      if (!value || value.startsWith('--')) return result(2, `${arg} needs a value`);
      options[values.get(arg)] = value;
    } else return result(2, `Unknown installer option: ${arg}`);
  }
  let readline;
  const question = io.question ?? (async prompt => {
    if (!process.stdin.isTTY) throw Error('Use --host and --yes for a headless install.');
    readline ??= createInterface({ input: process.stdin, output: process.stdout });
    return readline.question(prompt);
  });
  try {
    if (!options.host) options.host = (await question(`Choose host (${Object.keys(hosts).join(', ')}): `)).trim();
    const preview = options.uninstall ? uninstall({ ...options, dryRun: true }) : install({ ...options, dryRun: true });
    if (preview.code || options.dryRun || options.host === 'chat-upload') return preview;
    if (!options.yes && !/^(y|yes)$/i.test((await question(`${preview.message}\nContinue? [y/N] `)).trim())) return result(0, 'Cancelled; no files changed.');
    return options.uninstall ? uninstall(options) : install(options);
  } catch (error) { return result(2, error.message); }
  finally { readline?.close(); }
}
