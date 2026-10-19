// This reader accepts the manifest scalar and array forms used by the checker.
export function parseToml(text) {
  const out = {}; let section = out;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/\s+#.*$/, '').trim();
    if (!line || line.startsWith('#')) continue;
    const h = line.match(/^\[([\w.-]+)\]$/);
    if (h) { section = out; for (const key of h[1].split('.')) section = section[key] ||= {}; continue; }
    const m = line.match(/^([\w-]+)\s*=\s*(.+)$/);
    if (!m) throw Error('UNREADABLE TOML: use scalar or single-line array fields');
    let value;
    try { value = JSON.parse(m[2]); } catch { if (/^'[^']*'$/.test(m[2])) value=m[2].slice(1,-1); else throw Error('UNREADABLE TOML value'); }
    section[m[1]] = value;
  }
  return out;
}
export default parseToml;
