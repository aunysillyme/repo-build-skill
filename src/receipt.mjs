import fs from 'node:fs';
import path from 'node:path';
import { createHash, randomBytes } from 'node:crypto';
import { NAME } from './constants.mjs';

export const receiptName = `.${NAME}-receipt.json`;
export const digest = bytes => createHash('sha256').update(bytes).digest('hex');
export function stat(file) {
  try { return fs.lstatSync(file); } catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}
export function relativePath(value) {
  if (typeof value !== 'string' || !value || path.isAbsolute(value) || /^[a-z]:/i.test(value) || value.includes('\\') || value.includes('\0') || value.split('/').some(p => !p || p === '.' || p === '..')) {
    throw Error(`Unsafe relative path: ${JSON.stringify(value)}`);
  }
  return value;
}
export function canonical(value) {
  const full = path.resolve(value);
  const info = stat(full);
  if (!info?.isDirectory() && !info?.isSymbolicLink()) throw Error(`Select an existing directory: ${full}`);
  return fs.realpathSync(full);
}
export function safePath(root, rel, kind = 'file') {
  relativePath(rel);
  const base = stat(root);
  if (!base?.isDirectory() || base.isSymbolicLink()) throw Error(`Root changed or is a symlink: ${root}`);
  let current = root;
  const parts = rel.split('/');
  for (let index = 0; index < parts.length; index++) {
    current = path.join(current, parts[index]);
    const info = stat(current);
    if (!info) continue;
    if (info.isSymbolicLink()) throw Error(`Symlink refused: ${rel}`);
    if ((index < parts.length - 1 || kind === 'dir') && !info.isDirectory()) throw Error(`Expected directory: ${rel}`);
    if (index === parts.length - 1 && kind === 'file' && (!info.isFile() || info.nlink !== 1)) throw Error(`Expected unshared regular file: ${rel}`);
  }
  return current;
}
export function readBytes(root, rel) {
  const full = safePath(root, rel);
  if (!stat(full)) return null;
  const fd = fs.openSync(full, fs.constants.O_RDONLY | (fs.constants.O_NOFOLLOW ?? 0));
  try {
    const before = fs.lstatSync(full), opened = fs.fstatSync(fd);
    if (before.dev !== opened.dev || before.ino !== opened.ino || !opened.isFile() || opened.nlink !== 1) throw Error(`File changed during read: ${rel}`);
    return fs.readFileSync(fd);
  } finally { fs.closeSync(fd); }
}
export function readReceipt(root, rel, expected) {
  const bytes = readBytes(root, rel);
  if (!bytes) throw Error(`Missing receipt: ${path.join(root, rel)}`);
  const receipt = JSON.parse(bytes.toString('utf8'));
  if (receipt.schemaVersion !== 1 || receipt.package?.name !== NAME || receipt.host !== expected.host || receipt.scope !== expected.scope || receipt.destination !== expected.destination || !Array.isArray(receipt.files) || !Array.isArray(receipt.directories)) throw Error('Invalid receipt ownership');
  const seen = new Set();
  for (const entry of receipt.files) {
    relativePath(entry.path);
    if (entry.path === rel || seen.has(entry.path) || !/^[a-f0-9]{64}$/.test(entry.sha256) || !['written', 'identical', 'block'].includes(entry.action)) throw Error('Invalid receipt file');
    const belongs = entry.path.startsWith(`${expected.destination}/`) || (expected.host === 'agents-md' && entry.path === 'AGENTS.md' && entry.action === 'block');
    if (!belongs) throw Error('Receipt file is outside the skill target');
    if (entry.action === 'block' && (typeof entry.block !== 'string' || !entry.block || !['', '\n', '\n\n'].includes(entry.separator))) throw Error('Invalid receipt block');
    safePath(root, entry.path);
    seen.add(entry.path);
  }
  for (const directory of receipt.directories) {
    relativePath(directory);
    if (!(directory === expected.destination || expected.destination.startsWith(`${directory}/`) || directory.startsWith(`${expected.destination}/`))) throw Error('Invalid receipt directory');
    safePath(root, directory, 'dir');
  }
  return { receipt, bytes };
}
export function makeParents(root, rel, made) {
  safePath(root, rel);
  const parts = rel.split('/').slice(0, -1);
  let current = '';
  for (const part of parts) {
    current = current ? `${current}/${part}` : part;
    const full = safePath(root, current, 'dir');
    if (!stat(full)) { fs.mkdirSync(full); made.push(current); }
  }
}
export function writeNew(root, rel, bytes, made) {
  makeParents(root, rel, made);
  const fd = fs.openSync(safePath(root, rel), fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_EXCL | (fs.constants.O_NOFOLLOW ?? 0), 0o644);
  try { fs.writeFileSync(fd, bytes); } finally { fs.closeSync(fd); }
}
export function replaceExact(root, rel, before, after) {
  const full = safePath(root, rel);
  const bytes = readBytes(root, rel);
  if (!bytes?.equals(before)) throw Error(`File changed before update: ${rel}`);
  const mode = fs.lstatSync(full).mode & 0o777;
  const tempRel = `${rel}.${randomBytes(8).toString('hex')}.tmp`;
  try {
    writeNew(root, tempRel, after, []);
    fs.chmodSync(safePath(root, tempRel), mode);
    if (!readBytes(root, rel)?.equals(before)) throw Error(`File changed before update: ${rel}`);
    fs.renameSync(safePath(root, tempRel), safePath(root, rel));
  } finally {
    if (stat(path.join(root, tempRel))) fs.unlinkSync(safePath(root, tempRel));
  }
}
