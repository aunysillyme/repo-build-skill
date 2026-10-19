import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const START = '<!-- set:start -->';
export const END = '<!-- set:end -->';
export function validateSet(value) {
  if (!value || value.version !== 1 || !Array.isArray(value.rows)) throw Error('set.json needs version 1 and rows');
  const names = new Set();
  for (const row of value.rows) {
    if (!row || !['name', 'url', 'line'].every(key => typeof row[key] === 'string' && row[key].trim() && !/[\r\n]/.test(row[key]))) throw Error('Each set row needs name, url and line strings');
    if (names.has(row.name)) throw Error(`Duplicate set row: ${row.name}`);
    const url = new URL(row.url);
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) throw Error(`Invalid set URL: ${row.name}`);
    names.add(row.name);
  }
  return value;
}
const cell = value => value.replaceAll('|', '\\|');
export function renderBlocks(value, currentName) {
  const set = validateSet(value);
  const readmeRows = set.rows.map(row => `| ${row.name === currentName ? `**${cell(row.name)}**` : `[${cell(row.name)}](${row.url})`} | ${cell(row.line)} |`);
  const llmsRows = set.rows.filter(row => row.name !== currentName).map(row => `- [${row.name}](${row.url}): ${row.line}`);
  return {
    readme: [START, '## Part of a set', '', '| Repo | What it gives you |', '|---|---|', ...readmeRows, END].join('\n'),
    llms: [START, '## Part of a set', '', ...llmsRows, END].join('\n'),
  };
}
export function replaceBlock(text, block) {
  const starts = text.split(START).length - 1, ends = text.split(END).length - 1;
  if (!starts && !ends) return `${text.trimEnd()}\n\n${block}\n`;
  if (starts !== 1 || ends !== 1 || text.indexOf(END) < text.indexOf(START)) throw Error('Expected one ordered pair of set markers');
  return text.slice(0, text.indexOf(START)) + block + text.slice(text.indexOf(END) + END.length);
}
export function currentName(root) {
  for (const rel of ['.repo-build/facts.json', 'package.json']) {
    const full = path.join(root, rel);
    if (!fs.existsSync(full)) continue;
    const value = JSON.parse(fs.readFileSync(full, 'utf8'));
    if (typeof value.name === 'string' && value.name) return value.name;
  }
  throw Error('Set rendering needs a name in facts.json or package.json');
}
export function renderSet({ root = process.cwd(), check = false } = {}) {
  const set = JSON.parse(fs.readFileSync(path.join(root, '.repo-build/set.json'), 'utf8'));
  const blocks = renderBlocks(set, currentName(root)), changed = [];
  const outputs = [];
  for (const [file, block] of [['README.md', blocks.readme], ['llms.txt', blocks.llms]]) {
    const full = path.join(root, file);
    if (!fs.existsSync(full)) throw Error(`Set rendering needs ${file}`);
    if (!fs.lstatSync(full).isFile() || fs.lstatSync(full).isSymbolicLink()) throw Error(`Expected regular file: ${file}`);
    const before = fs.readFileSync(full, 'utf8'), after = replaceBlock(before, block);
    if (before !== after) { changed.push(file); outputs.push({ full, after }); }
  }
  if (!check) for (const output of outputs) fs.writeFileSync(output.full, output.after);
  return { code: check && changed.length ? 1 : 0, changed, blocks, message: changed.length ? `${check ? 'Set drift' : 'Set rendered'}: ${changed.join(', ')}` : 'Set blocks match.' };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  try {
    if (args.some(arg => arg !== '--check')) throw Error('Usage: node .repo-build/render-set.mjs [--check]');
    const result = renderSet({ check: args.includes('--check') });
    console.log(result.message);
    process.exitCode = result.code;
  } catch (error) { console.error(error.message); process.exitCode = 2; }
}
