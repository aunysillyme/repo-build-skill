export const slug = s => s.toLowerCase().replace(/<[^>]*>/g,'').replace(/[^\p{L}\p{N}_\s-]/gu,'').trim().replace(/\s/g,'-');
// One forward scan: 1-6 hashes, a space, then the text without its trailing whitespace and closing hashes.
function heading(line) {
  let level = 0; while (level < line.length && line[level] === '#') level++;
  if (level < 1 || level > 6 || !/\s/.test(line[level] ?? '')) return null;
  let start = level; while (start < line.length && /\s/.test(line[start])) start++;
  let end = line.length; while (end > start && line[end-1] === '#') end--;
  while (end > start && /\s/.test(line[end-1])) end--;
  return end > start ? {level, text: line.slice(start, end)} : null;
}
export function headings(text) {
  const seen = new Map(); let fence = false;
  return text.split('\n').flatMap((line,i) => {
    if (/^\s*(```|~~~)/.test(line)) { fence=!fence; return []; }
    const m = fence ? null : heading(line); if (!m) return [];
    const base = slug(m.text), n = seen.get(base)||0; seen.set(base,n+1);
    return [{level:m.level,text:m.text,slug:base+(n?`-${n}`:''),line:i+1}];
  });
}
export const firstHeading = text => headings(text)[0]?.text;
// Memoised "next match at or after pos": each delimiter is searched once per run, so scanning stays a single pass.
function finder(line, pattern) {
  const re = new RegExp(pattern, 'g'); let from = Infinity, at = -1;
  return pos => {
    if (pos >= from && (at < 0 || pos <= at)) return at;
    re.lastIndex = pos; const m = re.exec(line); from = pos; at = m ? m.index : -1; return at;
  };
}
// Inline links and images as [text](destination "title"), found by one forward scan per line.
function inlineLinks(line) {
  const close = finder(line, '\\]'), paren = finder(line, '\\)'), angle = finder(line, '>'), stop = finder(line, '[\\s)]'), word = finder(line, '\\S');
  const tail = at => {
    if (line[at] === ')') return at + 1;
    if (at >= line.length || !/\s/.test(line[at])) return -1;
    const q = word(at); if (q < 0 || (line[q] !== '"' && line[q] !== "'")) return -1;
    const d = paren(q + 1); return d < 0 ? -1 : d + 1;
  };
  const found = [];
  let open = line.indexOf('[');
  while (open >= 0) {
    const end = close(open); if (end < 0) break;
    let match = null;
    if (line[end + 1] === '(') {
      const k = end + 2;
      if (line[k] === '<') { const g = angle(k + 1); if (g > k + 1) { const e = tail(g + 1); if (e >= 0) match = {url: line.slice(k, g + 1), end: e}; } }
      if (!match) { const b = stop(k); if (b > k) { const e = tail(b); if (e >= 0) match = {url: line.slice(k, b), end: e}; } }
    }
    if (match) { found.push(match.url.replace(/^<|>$/g, '')); open = line.indexOf('[', match.end); }
    else open = line.indexOf('[', end + 1);
  }
  return found;
}
export function links(text) {
  const found=[];
  for (const [i,line] of text.split('\n').entries()) {
    for (const url of inlineLinks(line)) found.push({url,line:i+1});
    const ref=line.match(/^\s*\[[^\]]+\]:\s*(\S+)/); if(ref) found.push({url:ref[1],line:i+1});
  } return found;
}
export function frontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/); if(!m) return null;
  const result={};
  for(const line of m[1].split('\n')) { const p=line.match(/^([\w.-]+):\s*(.*)$/); if(p) result[p[1]]=p[2].replace(/^['"]|['"]$/g,''); }
  return result;
}
