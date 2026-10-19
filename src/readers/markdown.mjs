export const slug = s => s.toLowerCase().replace(/<[^>]*>/g,'').replace(/[^\p{L}\p{N}_\s-]/gu,'').trim().replace(/\s/g,'-');
export function headings(text) {
  const seen = new Map(); let fence = false;
  return text.split('\n').flatMap((line,i) => {
    if (/^\s*(```|~~~)/.test(line)) { fence=!fence; return []; }
    const m = !fence && line.match(/^(#{1,6})\s+(.+?)\s*#*$/); if (!m) return [];
    const base = slug(m[2]), n = seen.get(base)||0; seen.set(base,n+1);
    return [{level:m[1].length,text:m[2],slug:base+(n?`-${n}`:''),line:i+1}];
  });
}
export const firstHeading = text => headings(text)[0]?.text;
export function links(text) {
  const found=[];
  for (const [i,line] of text.split('\n').entries()) {
    for (const m of line.matchAll(/!?\[[^\]]*\]\((<[^>]+>|[^\s)]+)(?:\s+['"][^)]*)?\)/g)) found.push({url:m[1].replace(/^<|>$/g,''),line:i+1});
    const ref=line.match(/^\s*\[[^\]]+\]:\s*(\S+)/); if(ref) found.push({url:ref[1],line:i+1});
  } return found;
}
export function frontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/); if(!m) return null;
  const result={};
  for(const line of m[1].split('\n')) { const p=line.match(/^([\w.-]+):\s*(.*)$/); if(p) result[p[1]]=p[2].replace(/^['"]|['"]$/g,''); }
  return result;
}
