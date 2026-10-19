// This reader accepts the manifest forms the checker needs: tables, scalars and single- or multi-line arrays.
// Anything else is reported as unsupported so the caller can skip the rules that need the manifest.
class Incomplete extends Error {}
const unsafe = new Set(['__proto__', 'constructor', 'prototype']);
function skip(s, i, multi) {
  while (i < s.length) {
    const ch = s[i];
    if (ch === ' ' || ch === '\t' || (multi && (ch === '\n' || ch === '\r'))) i++;
    else if (multi && ch === '#') { while (i < s.length && s[i] !== '\n') i++; }
    else break;
  }
  return i;
}
function parseValue(s, start, multi) {
  const i = skip(s, start, multi);
  if (i >= s.length) throw new Incomplete();
  const ch = s[i];
  if (ch === '"' || ch === "'") {
    if (s.startsWith(ch.repeat(3), i)) throw Error('Unsupported TOML value: multi-line string');
    let j = i + 1;
    for (; j < s.length && s[j] !== ch; j++) { if (ch === '"' && s[j] === '\\') j++; if (s[j] === '\n') throw Error('Unsupported TOML value: unterminated string'); }
    if (j >= s.length) throw Error('Unsupported TOML value: unterminated string');
    const body = s.slice(i, j + 1);
    if (ch === "'") return [body.slice(1, -1), j + 1];
    try { return [JSON.parse(body), j + 1]; } catch { throw Error('Unsupported TOML value: string escape'); }
  }
  if (ch === '[') {
    const out = []; let at = i + 1;
    for (;;) {
      at = skip(s, at, true);
      if (at >= s.length) throw new Incomplete();
      if (s[at] === ']') return [out, at + 1];
      const [item, next] = parseValue(s, at, true);
      out.push(item); at = skip(s, next, true);
      if (at >= s.length) throw new Incomplete();
      if (s[at] === ',') at++; else if (s[at] !== ']') throw Error('Unsupported TOML value: array');
    }
  }
  const word = s.slice(i).match(/^(?:true|false)(?![\w-])/);
  if (word) return [word[0] === 'true', i + word[0].length];
  const number = s.slice(i).match(/^[+-]?\d[\d_]*(?:\.\d[\d_]*)?(?:[eE][+-]?\d+)?(?![\w.-])/);
  if (number) return [Number(number[0].replaceAll('_', '')), i + number[0].length];
  throw Error('Unsupported TOML value');
}
function descend(root, keys) {
  let node = root;
  for (const key of keys) {
    if (unsafe.has(key)) throw Error('Unsupported TOML key');
    node = Array.isArray(node[key]) ? node[key].at(-1) : (node[key] ||= {});
  }
  return node;
}
export function parseToml(text) {
  const out = {}; let section = out;
  const lines = text.split(/\r?\n/);
  for (let n = 0; n < lines.length; n++) {
    const line = lines[n].trim();
    if (!line || line.startsWith('#')) continue;
    const table = line.match(/^\[\[([\w.-]+)\]\]\s*(?:#.*)?$/);
    if (table) {
      const keys = table[1].split('.'), last = keys.pop();
      if (unsafe.has(last)) throw Error('Unsupported TOML key');
      const parent = descend(out, keys);
      if (parent[last] !== undefined && !Array.isArray(parent[last])) throw Error('Unsupported TOML table');
      section = {}; (parent[last] ||= []).push(section); continue;
    }
    const header = line.match(/^\[([\w.-]+)\]\s*(?:#.*)?$/);
    if (header) { section = descend(out, header[1].split('.')); continue; }
    const m = line.match(/^([\w-]+)\s*=\s*(.*)$/);
    if (!m || unsafe.has(m[1])) throw Error(`Unsupported TOML at line ${n + 1}: use plain keys with scalar or array values`);
    let chunk = m[2];
    if (!chunk.trim()) throw Error(`Unsupported TOML at line ${n + 1}: the value must follow the key on the same line`);
    for (;;) {
      try {
        const [value, end] = parseValue(chunk, 0, false);
        const rest = chunk.slice(end).trim();
        if (rest && !rest.startsWith('#')) throw Error(`Unsupported TOML at line ${n + 1}: text after the value`);
        section[m[1]] = value; break;
      } catch (error) {
        if (!(error instanceof Incomplete)) throw error;
        if (n + 1 >= lines.length) throw Error(`Unsupported TOML at line ${n + 1}: unterminated value`);
        chunk += '\n' + lines[++n];
      }
    }
  }
  return out;
}
export default parseToml;
