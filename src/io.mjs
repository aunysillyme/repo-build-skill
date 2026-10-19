import { readFileSync, readdirSync, lstatSync, readlinkSync, existsSync } from 'node:fs';
import { resolve, relative, sep, join, dirname } from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
export const digest = bytes => createHash('sha256').update(bytes).digest('hex');
export function owned(root, file, mustExist = true) {
  if (typeof file !== 'string' || !file || file.includes('\\') || file.split('/').includes('..') || /^[A-Za-z]:|^\//.test(file)) throw Error('Expected a relative owned path');
  const base = resolve(root), full = resolve(base, file);
  if (full !== base && !full.startsWith(base + sep)) throw Error('Path leaves root');
  let current = base;
  for (const part of ['', ...relative(base, full).split(sep).filter(Boolean)]) {
    current = part ? join(current, part) : current;
    try { if (lstatSync(current).isSymbolicLink()) throw Error('Symlink path refused'); }
    catch (e) { if (e.code !== 'ENOENT' || mustExist) throw e; }
  }
  return full;
}
export const read = (root, file) => readFileSync(owned(root, file), 'utf8');
export function readOptional(root, file) { try { return read(root, file); } catch (e) { if (e.code === 'ENOENT') return ''; throw e; } }
export function jsonOptional(root, file, fallback = null) { const s = readOptional(root, file); return s ? JSON.parse(s) : fallback; }
export function walk(root, dir = '') {
  const files = [];
  for (const item of readdirSync(join(root, dir), {withFileTypes:true}).sort((a,b) => a.name.localeCompare(b.name))) {
    if (['.git','node_modules','.venv','dist','build','.test-work'].includes(item.name)) continue;
    const file = dir ? `${dir}/${item.name}` : item.name;
    if (item.isDirectory()) files.push(...walk(root,file));
    else files.push(file);
  }
  return files;
}
export function git(root, args) { return execFileSync('git', ['-C', root, ...args], {encoding:'utf8', maxBuffer:64*1024*1024,stdio:['ignore','pipe','pipe']}); }
export function publicFiles(root) {
  let current = resolve(root);
  while (!existsSync(join(current,'.git'))) {
    const parent = dirname(current);
    if (parent === current) return walk(root);
    current = parent;
  }
  return [...new Set(git(root,['ls-files','-z','--cached','--others','--exclude-standard']).split('\0').filter(Boolean))];
}
export function textFile(root,file) {
  const full = join(root,file), st = lstatSync(full);
  const bytes = st.isSymbolicLink() ? Buffer.from(readlinkSync(full)) : readFileSync(owned(root,file));
  return bytes.includes(0) ? '' : bytes.toString('utf8');
}
