import { readFileSync, lstatSync, existsSync, realpathSync } from 'node:fs';
import { resolve, join, dirname, relative, delimiter } from 'node:path';
import { rule,fail,skip } from '../rule.mjs';
import { git } from '../../io.mjs';
const placeholder=/^(?:you|user|<user>|me|example|runner|name)$/i;
const homeName=/\/(?:Users|home)\/([^/\\\s"'`)\]},;]+)|[A-Za-z]:\\{1,2}Users\\{1,2}([^\\\s"'`)\]},;]+)/g;
export function pathHits(text) {
  const hits=[];for(const m of text.matchAll(homeName)){const name=(m[1]||m[2]).replace(/[.:!?]+$/,'');if(name&&!placeholder.test(name))hits.push(m.index);}return hits;
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
// Each blob is read once by object id and keeps the path where it was first seen.
function blobsOnce(root) {
  const firstPath=new Map();
  for(const line of git(root,['rev-list','--objects','--all']).split('\n')){const at=line.indexOf(' ');if(at>0&&!firstPath.has(line.slice(0,at)))firstPath.set(line.slice(0,at),line.slice(at+1));else if(at<0&&line&&!firstPath.has(line))firstPath.set(line,'');}
  const oids=[...firstPath.keys()];if(!oids.length)return [];
  const sizes=git(root,['cat-file','--batch-check=%(objectname) %(objecttype) %(objectsize)'],{input:oids.join('\n')+'\n'}).split('\n').filter(Boolean).map(row=>row.split(' ')).filter(row=>row[1]==='blob');
  const batches=[];let current=[],total=0;
  for(const [oid,,size] of sizes){current.push(oid);total+=Number(size);if(total>=32*1024*1024||current.length>=5000){batches.push(current);current=[];total=0;}}
  if(current.length)batches.push(current);
  const items=[];
  for(const batch of batches){
    const out=git(root,['cat-file','--batch'],{input:Buffer.from(batch.join('\n')+'\n'),encoding:'buffer',maxBuffer:1024*1024*1024});
    let at=0;
    for(const oid of batch){
      const eol=out.indexOf(10,at),size=Number(out.toString('utf8',at,eol).split(' ')[2]);
      items.push({file:`history:${oid}:${firstPath.get(oid)}`,name:firstPath.get(oid),text:out.toString('utf8',eol+1,eol+1+size)});
      at=eol+1+size+1;
    }
  }
  return items;
}
export function historyItems(root) {
  const items=[];
  for(const record of git(root,['log','--all','-z','--no-textconv','--no-ext-diff','--format=%H%n%B']).split('\0').filter(Boolean)){const eol=record.indexOf('\n');items.push({file:`history:${record.slice(0,eol).trim()}:message`,text:record.slice(eol+1)});}
  items.push(...blobsOnce(root));
  for(const ref of git(root,['for-each-ref','--format=%(refname)','refs/tags']).trim().split('\n').filter(Boolean))items.push({file:`tag:${ref}`,name:ref,text:git(root,['cat-file','-p',ref])});
  return items;
}
function scan(c,probe,message,history=false) {
  const items=[],findings=[];
  for(const file of c.files){
    try{if(c.privateLists.paths.includes(realpathSync(resolve(c.root,file))))continue;}catch{}
    try{items.push({file,name:file,text:c.read(file)});}
    catch(e){findings.push(fail(file,`Unreadable path, so it was not scanned (${e.code||e.message}).`,0));}
  }
  if(history&&c.options.history)items.push(...c.history);
  for(const item of items){if(item.name&&probe(item.name).length)findings.push(fail(item.file,message+' (filename)',0));if(!item.text.includes('\0'))for(const [i,line]of item.text.split('\n').entries())if(probe(line).length)findings.push(fail(item.file,message,i+1));}
  return findings;
}
const fileDomain=/(?:^|\.)(?:md|txt|json|js|mjs|cjs|ts|yml|yaml|toml|py|sh)$/;
// A file reference has no mailbox name: "`@AGENTS.md`", or the escaped newline in a quoted "\n@AGENTS.md" source string.
const fileReference=(m,text)=>{const local=m[0].split('@')[0];return !/[A-Za-z0-9]/.test(local)||local==='n'&&text[m.index-1]==='\\';};
export function emailHits(text,facts={}) {
  const allow=(facts.emails_allow||[]).map(x=>x.toLowerCase());
  return [...text.matchAll(/[A-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)].filter(m=>{
    const raw=m[0].toLowerCase(),s=raw.startsWith("'")&&text[m.index+m[0].length]==="'"?raw.slice(1):raw,domain=s.split('@')[1];
    return !allow.includes(s)&&!['noreply@anthropic.com','noreply@openai.com'].includes(s)&&!['users.noreply.github.com','example.com','example.org','example.net'].includes(domain)&&!/(?:^|\.)(?:invalid|test|example|localhost)$/.test(domain)&&!(fileDomain.test(domain)&&fileReference(m,text));
  }).map(m=>m.index);
}
export default [
rule('P_PATH','registries','03-scaffold','Keep home paths private','Local usernames are private environment details.','Home paths use placeholder usernames in contents and filenames.',c=>scan(c,pathHits,'Replace the private home path with a placeholder.',true)),
rule('P_EMAIL','registries','03-scaffold','Publish only approved contact addresses','A contact address should be an explicit public choice.','Email addresses are in the allowlist or a standard example or noreply domain.',c=>scan(c,text=>emailHits(text,c.facts),'Use an explicitly approved public email address.')),
rule('P_TOKEN','registries','03-scaffold','Keep token-shaped values private','A public artifact must not carry access credentials.','Token-shaped strings and private key headers are absent.',c=>scan(c,tokenHits,'Remove the token-shaped value.',true)),
rule('P_LIST','registries','03-scaffold','Apply the maintainer privacy lists','Private names are supplied locally by the maintainer.','Untracked list files contain no matches in the public tree or history.',c=>c.privateLists.problems.length?c.privateLists.problems.map(m=>fail('.repo-build/private.local.txt',m)):c.privateLists.paths.length?scan(c,text=>listHits(text,c.privateLists),'Remove the private-list match.',true):[skip('No maintainer private list supplied.')])
];
