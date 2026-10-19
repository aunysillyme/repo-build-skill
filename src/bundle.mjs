import { readFileSync } from 'node:fs';
import { posix } from 'node:path';
import { CORE,NAME } from './constants.mjs';
import { read,jsonOptional,digest,owned } from './io.mjs';
import { readFacts } from './facts.mjs';
import { firstHeading } from './readers/markdown.mjs';
import { rules } from './check/index.mjs';
import { renderBlocks,replaceBlock } from './render-set.mjs';
export { CORE,digest,owned };
export const manifest=root=>JSON.parse(read(root,`${CORE}/manifest.json`));
export function rebase(text,source,target) {
  return text.replace(/(!?\[[^\]\n]+\]\()([^\s)]+)(\))/g,(_,a,url,b)=>{
    if(/^[a-z][a-z0-9+.-]*:|^\/\//i.test(url))return a+url+b;
    const [path,anchor]=url.split('#'),dest=path?posix.normalize(posix.join(posix.dirname(source),path)):source;
    return a+posix.relative(posix.dirname(target),dest)+(anchor===undefined?'':'#'+anchor)+b;
  });
}
export function gateTable(m,stage) {
  const cell=s=>String(s).replace(/\|/g,'\\|').replace(/\n/g,' ');
  const rows=rules.filter(r=>r.stage===stage).map(r=>[r.id,`Unmet requirement: ${r.pass}`,`${r.id}: checker receipt, initially BLOCKED`]);
  for(const r of m.gates[stage]?.manual||[])rows.push([r.check+(r.hands?' (HANDS)':''),r.reject,r.evidence+(r.waivable?' Status WAIVED needs owner, reason and date.':'')]);
  return '| Check | Reject condition | Evidence |\n|---|---|---|\n'+rows.map(row=>'| '+row.map(cell).join(' | ')+' |').join('\n')+'\n';
}
export function replaceGate(text,table) {
  const start='<!-- gate:start -->',end='<!-- gate:end -->';
  if(text.split(start).length!==2||text.split(end).length!==2)throw Error('Expected exactly one gate marker pair');
  return text.replace(/<!-- gate:start -->[\s\S]*?<!-- gate:end -->/,`${start}\n${table}${end}`);
}
export function generated(root) {
  const m=manifest(root),facts=readFacts(root),pkg=jsonOptional(root,'package.json'),out={};
  const repository=(typeof pkg.repository==='string'?pkg.repository:pkg.repository.url).replace(/^git\+/,'').replace(/\.git$/,'');
  const pinned=path=>`${repository}/blob/v${pkg.version}/${path}`;
  for(const route of m.routes){const f=`${CORE}/${route.file}`;out[f]=replaceGate(read(root,f),gateTable(m,route.id));}
  const routeOrder=m.routes.flatMap(r=>[r.file,...r.cards,...(r.id==='06-release'?m.assets.filter(a=>a.path.startsWith('references/release/')).map(a=>a.path):[])]);
  const ordered=[...new Set(['SKILL.md','references/ask-date.md',...routeOrder,...m.assets.filter(a=>a.kind==='card').map(a=>a.path)])];
  const target='docs/bundles/chat-upload.md';let bundle=`# ${pkg.name} chat bundle\n\nPaths in source sections resolve from the named skill asset.\n`;
  for(const path of ordered){const f=`${CORE}/${path}`;bundle+=`\n<!-- source:${path} -->\n\n`+rebase(out[f]||read(root,f),f,target).trimEnd()+'\n';}
  out[target]=bundle;
  let index=`# ${facts.name||pkg.name}\n\n> ${facts.lead||pkg.description}\n\nInstall: \`${facts.install||'npx '+pkg.name}\`\n`;
  const categories=[['Docs',['README.md','docs/README.md','docs/INSTALLER.md','docs/CHECKER.md','docs/EVALUATION.md','docs/RULES.md','docs/STACK.md']],['Reference',m.assets.filter(a=>a.kind==='stage'||a.kind==='card'||a.path==='SKILL.md').map(a=>`${CORE}/${a.path}`)],['Optional',['CREDITS.md','CONTRIBUTING.md','docs/PROVENANCE.md',target]]];
  const rulesDoc='# Repository checks\n\n'+rules.map(r=>`## ${r.id}: ${r.title}\n\nReader: ${r.reader}. Stage: ${r.stage}. Severity: ${r.severity}.\n\nWhy: ${r.why}\n\nPass: ${r.pass}\n\nLearn: [Stage reference](${pinned(`${CORE}/${r.learn}`)})\n`).join('\n');
  out['docs/RULES.md']=rulesDoc;
  for(const [heading,files]of categories){index+=`\n## ${heading}\n\n`;for(const f of files){let label;try{label=firstHeading(out[f]||read(root,f));}catch{}label||=posix.basename(f).replace(/\.[^.]+$/,'').replace(/[-_]/g,' ');index+=`- [${label}](${pinned(f)}): ${label}\n`;}}
  const set=jsonOptional(root,'.repo-build/set.json');
  out['llms.txt']=set?replaceBlock(index,renderBlocks(set,facts.name||pkg.name).llms):index;
  return out;
}
