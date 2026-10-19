import { readFileSync, lstatSync, existsSync, realpathSync } from 'node:fs';
import { resolve, join, dirname, relative, delimiter } from 'node:path';
import { rule,fail,skip } from '../rule.mjs';
import { git } from '../../io.mjs';
const placeholder=/^(?:you|user|<user>|me|example|runner|name)$/i;
export function pathHits(text) {
  const hits=[];for(const m of text.matchAll(/(?:\/(?:Users|home)\/([^/\s]+)\/|[A-Za-z]:\\Users\\([^\\\s]+)\\)/g))if(!placeholder.test(m[1]||m[2]))hits.push(m.index);return hits;
}
const tokenPatterns=[/gh[pousr]_[A-Za-z0-9]{20,}/g,/github_pat_[A-Za-z0-9_]{20,}/g,/npm_[A-Za-z0-9]{20,}/g,/sk-(?:proj-)?[A-Za-z0-9_-]{20,}/g,/AKIA[A-Z0-9]{16}/g,/xox[baprs]-[A-Za-z0-9-]{20,}/g,/-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/g,/AIza[A-Za-z0-9_-]{30,}/g];
export const tokenHits=text=>tokenPatterns.flatMap(re=>[...text.matchAll(new RegExp(re.source,'g'))].map(m=>m.index));
export function loadPrivateLists(root,env=process.env) {
  const paths=[join(root,'.repo-build/private.local.txt'),...(env.REPO_BUILD_PRIVATE_LISTS||'').split(delimiter).filter(Boolean).map(p=>resolve(p))];
  const lists=[],terms=[],allow=[],problems=[];
  for(const [i,path] of [...new Set(paths)].entries()) {
    if(!existsSync(path)){if(i>0)throw Error('Configured private list is unavailable');continue;}
    if(lstatSync(path).isSymbolicLink()||!lstatSync(path).isFile())throw Error('Private list must be a regular file');
    const real=realpathSync(path);let current=dirname(real);
    while(true){if(existsSync(join(current,'.git'))&&git(current,['ls-files','-z','--cached','--',`:(literal)${relative(current,real)}`]).length)problems.push('A private list is tracked by git.');const p=dirname(current);if(p===current)break;current=p;}
    lists.push(real);
    for(const raw of readFileSync(real,'utf8').split(/\r?\n/)){
      const s=raw.trim();if(!s||s.startsWith('#'))continue;
      if(s.startsWith('allow:')){if(!s.slice(6).trim())throw Error('Empty private list allow entry');allow.push(s.slice(6).trim().toLowerCase());}
      else if(s.startsWith('re:')){try{terms.push(new RegExp(s.slice(3),'gi'));}catch{throw Error('Invalid private list regular expression');}}
      else terms.push(s.toLowerCase());
    }
  }
  return {paths:lists,terms,allow,problems};
}
export function listHits(text,list) {
  const lower=text.toLowerCase(),spans=[];
  for(const a of list.allow){let i=lower.indexOf(a);while(i>=0){spans.push([i,i+a.length]);i=lower.indexOf(a,i+1);}}
  const hits=[];
  for(const t of list.terms){const positions=typeof t==='string'?[...lower.matchAll(new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g'))].map(m=>[m.index,m[0].length]):[...text.matchAll(new RegExp(t.source,'gi'))].map(m=>[m.index,m[0].length]);for(const [i,n] of positions)if(!spans.some(([a,b])=>i>=a&&i+n<=b))hits.push(i);}
  return hits;
}
export function historyItems(root) {
  const items=[];
  for(const oid of git(root,['rev-list','--all']).trim().split('\n').filter(Boolean)) {
    items.push({file:`history:${oid}:message`,text:git(root,['show','-s','--format=%B',oid])});
    for(const rec of git(root,['ls-tree','-r','-z',oid]).split('\0').filter(Boolean)) {
      const m=rec.match(/^(\d+) (\w+) ([a-f0-9]+)\t([\s\S]*)$/);if(!m||m[2]!=='blob')continue;
      items.push({file:`history:${oid}:${m[4]}`,name:m[4],text:git(root,['cat-file','blob',m[3]])});
    }
  }
  for(const ref of git(root,['for-each-ref','--format=%(refname)','refs/tags']).trim().split('\n').filter(Boolean))items.push({file:`tag:${ref}`,name:ref,text:git(root,['cat-file','-p',ref])});
  return items;
}
function scan(c,probe,message,history=false) {
  const items=c.files.filter(f=>!c.privateLists.paths.includes(resolve(c.root,f))).map(file=>({file,name:file,text:c.read(file)}));
  if(history&&c.options.history)items.push(...c.history);
  const findings=[];
  for(const item of items){if(item.name&&probe(item.name).length)findings.push(fail(item.file,message+' (filename)',0));if(!item.text.includes('\0'))for(const [i,line]of item.text.split('\n').entries())if(probe(line).length)findings.push(fail(item.file,message,i+1));}
  return findings;
}
export default [
rule('P_PATH','registries','03-scaffold','Keep home paths private','Local usernames are private environment details.','Home paths use placeholder usernames in contents and filenames.',c=>scan(c,pathHits,'Replace the private home path with a placeholder.',true)),
rule('P_EMAIL','registries','03-scaffold','Publish only approved contact addresses','A contact address should be an explicit public choice.','Email addresses are in the allowlist or a standard example or noreply domain.',c=>scan(c,text=>[...text.matchAll(/[A-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)].filter(m=>{const s=m[0].toLowerCase(),domain=s.split('@')[1];return !(c.facts.emails_allow||[]).map(x=>x.toLowerCase()).includes(s)&&!['noreply@anthropic.com','noreply@openai.com'].includes(s)&&!['users.noreply.github.com','example.com','example.org'].includes(domain);}).map(m=>m.index),'Use an explicitly approved public email address.')),
rule('P_TOKEN','registries','03-scaffold','Keep token-shaped values private','A public artifact must not carry access credentials.','Token-shaped strings and private key headers are absent.',c=>scan(c,tokenHits,'Remove the token-shaped value.',true)),
rule('P_LIST','registries','03-scaffold','Apply the maintainer privacy lists','Private names are supplied locally by the maintainer.','Untracked list files contain no matches in the public tree or history.',c=>c.privateLists.problems.length?c.privateLists.problems.map(m=>fail('.repo-build/private.local.txt',m)):c.privateLists.paths.length?scan(c,text=>listHits(text,c.privateLists),'Remove the private-list match.',true):[skip('No maintainer private list supplied.')])
];
