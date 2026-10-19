import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync,realpathSync,symlinkSync } from 'node:fs';
import { join,delimiter } from 'node:path';
import { execFileSync } from 'node:child_process';
import { check } from '../src/check/index.mjs';
import { temporary,write } from './support.mjs';
import { pathHits,tokenHits } from '../src/check/rules/privacy.mjs';
const home=name=>['','Users',name,'file'].join('/');
const token=()=>['gh','p_', 'Z'.repeat(36)].join('');
const by=(r,id)=>r.results.filter(x=>x.id===id);
test('home path classes distinguish placeholder usernames and bare host names',()=>{for(const name of ['you','user','<user>','me','example','runner','name']){assert.equal(pathHits(home(name)).length,0);assert.equal(pathHits(['','home',name,'f'].join('/')).length,0);assert.equal(pathHits(['C:','Users',name,'f'].join('\\')).length,0);}assert.equal(pathHits('Claude Code').length,0);assert.equal(pathHits(home('private-person')).length,1);assert.equal(pathHits(['','home','private-person','f'].join('/')).length,1);assert.equal(pathHits(['C:','Users','private-person','f'].join('\\')).length,1);});
test('all token classes are recognized from runtime assembly',()=>{for(const parts of [['gh','p_','X'.repeat(36)],['github','_pat_','X'.repeat(60)],['np','m_','X'.repeat(36)],['s','k-proj-','X'.repeat(45)],['AK','IA','X'.repeat(16)],['xo','xb-','1'.repeat(30)],['-----BEGIN ','RSA PRIVATE KEY','-----'],['AI','za','X'.repeat(35)]])assert.ok(tokenHits(parts.join('')).length);});
test('public brand, domains and supported hosts pass the generic classes',async t=>{const root=temporary(t);write(root,'brand.md','Auny Auny LLC aunysillyme aunysillyme.com aunysillyme.dev Claude Code Codex Gemini Antigravity Cursor https://github.com/aunysillyme https://www.npmjs.com/~aunysillyme\n');write(root,'.repo-build/private.local.txt','# Local names\nsynthetic-quiet-marker\n');const r=await check(root,{env:{}});for(const id of ['P_PATH','P_EMAIL','P_TOKEN','P_LIST'])assert.equal(by(r,id)[0].status,'PASS',id);});
test('contents and filenames are scanned, including runtime token fixtures',async t=>{const root=temporary(t);write(root,'readme.md',home('private-person')+'\n'+token());write(root,'tree/'+home('another-person')+'/f.txt','Content');const r=await check(root,{env:{}});assert.ok(by(r,'P_PATH').some(x=>x.status==='FAIL'&&x.line===0));assert.ok(by(r,'P_TOKEN').some(x=>x.status==='FAIL'));});
test('email allowlists include explicit, example and provider noreply addresses',async t=>{const root=temporary(t);write(root,'.repo-build/facts.json',{emails_allow:['support@public.invalid']});write(root,'contacts.md','support@public.invalid noreply@anthropic.com noreply@openai.com person@users.noreply.github.com user@example.com user@example.org '+["'noreply",'@',"anthropic.com'"].join(''));assert.equal(by(await check(root,{env:{}}),'P_EMAIL')[0].status,'PASS');write(root,'contacts.md',['private','person','@','private.company'].join(''));assert.equal(by(await check(root,{env:{}}),'P_EMAIL')[0].status,'FAIL');});
test('multiple lists share allow spans and regex terms',async t=>{const root=temporary(t),external=temporary(t);write(root,'.repo-build/private.local.txt','synthetic-marker\nre:quiet[0-9]+\n');write(external,'allow.txt','allow:public synthetic-marker package\n');write(root,'README.md','Public synthetic-marker package\n');const env={REPO_BUILD_PRIVATE_LISTS:join(external,'allow.txt')};assert.equal(by(await check(root,{env}),'P_LIST')[0].status,'PASS');write(root,'README.md','quiet42');assert.equal(by(await check(root,{env}),'P_LIST')[0].status,'FAIL');});
test('privacy lists are excluded under a symlinked parent directory',async t=>{
  const parent=temporary(t),link=join(parent,'link');
  mkdirSync(join(parent,'real'));
  symlinkSync(realpathSync(join(parent,'real')),link,'dir');
  const root=join(link,'repo');
  write(root,'.repo-build/private.local.txt','synthetic-marker\n');
  write(root,'extra.txt','synthetic-external-marker\n');
  write(root,'README.md','Public package.\n');
  const env={REPO_BUILD_PRIVATE_LISTS:join(root,'extra.txt')};
  assert.equal(by(await check(root,{env}),'P_LIST')[0].status,'PASS');
  write(root,'README.md','synthetic-marker\nsynthetic-external-marker\n');
  assert.equal(by(await check(root,{env}),'P_LIST')[0].status,'FAIL');
});
test('a tracked privacy list fails while no list is counted as skipped',async t=>{const root=temporary(t);let r=await check(root,{env:{}});assert.equal(by(r,'P_LIST')[0].status,'SKIPPED');write(root,'.repo-build/private.local.txt','synthetic-marker\n');execFileSync('git',['init',root],{stdio:'pipe'});execFileSync('git',['-C',root,'add','.repo-build/private.local.txt'],{stdio:'pipe'});r=await check(root,{env:{}});assert.equal(by(r,'P_LIST')[0].status,'FAIL');});

test('reserved email domains and file references pass while public contact needs approval',async t=>{const root=temporary(t);write(root,'references.md','person@private.invalid person@private.test person@private.example person@private.localhost '+String.raw`"\n@AGENTS.md"`+' '+['md','txt','json','js','mjs','cjs','ts','yml','yaml','toml','py','sh'].map(ext=>String.raw`\n`+'@FILE.'+ext).join(' '));assert.equal(by(await check(root,{env:{}}),'P_EMAIL')[0].status,'PASS');write(root,'references.md',['person','@','private.company'].join(''));assert.equal(by(await check(root,{env:{}}),'P_EMAIL')[0].status,'FAIL');});
test('gitignored files and nested work trees stay outside the public scan',async t=>{const root=temporary(t);execFileSync('git',['init',root],{stdio:'pipe'});write(root,'.gitignore','notes/\n');write(root,'notes/private.md',home('private-person')+'\n'+token());write(root,'nested/README.md','Public tool.');const r=await check(root,{env:{}});for(const id of ['P_PATH','P_TOKEN'])assert.equal(by(r,id)[0].status,'PASS',id);const nested=await check(join(root,'notes'),{env:{}});assert.equal(by(nested,'P_PATH')[0].status,'PASS');});

const gitIn=(root,...args)=>execFileSync('git',['-C',root,...args],{stdio:'pipe',env:{...process.env,GIT_CONFIG_GLOBAL:'/dev/null',GIT_AUTHOR_NAME:'t',GIT_AUTHOR_EMAIL:'t@example.com',GIT_COMMITTER_NAME:'t',GIT_COMMITTER_EMAIL:'t@example.com'}});
test('an unreadable tracked path becomes its own failure and the other files are still scanned',async t=>{
  const root=temporary(t);gitIn(root,'init','-q','.');
  write(root,'leak.txt',token()+'\n');
  const sub=join(root,'sub');mkdirSync(sub);
  gitIn(root,'update-index','--add','--cacheinfo','160000,'+'1'.repeat(40)+',sub');
  gitIn(root,'add','leak.txt');
  const r=await check(root,{env:{}});
  assert.ok(by(r,'P_TOKEN').some(x=>x.status==='FAIL'&&x.file==='leak.txt'),JSON.stringify(by(r,'P_TOKEN')));
  for(const id of ['P_PATH','P_EMAIL','P_TOKEN'])assert.ok(by(r,id).every(x=>x.status!=='SKIPPED'),id);
});
test('a tracked path the reader cannot open is named in a failure and does not hide a token elsewhere',async t=>{
  const root=temporary(t);gitIn(root,'init','-q','.');
  write(root,'leak.txt',token()+'\n');
  write(root,'odd\\name.txt','x\n');
  gitIn(root,'add','.');
  const r=await check(root,{env:{}}),rows=by(r,'P_TOKEN');
  assert.ok(rows.some(x=>x.status==='FAIL'&&x.file==='leak.txt'),JSON.stringify(rows));
  assert.ok(rows.some(x=>x.status==='FAIL'&&x.file==='odd\\name.txt'&&/unreadable/i.test(x.message)),JSON.stringify(rows));
  assert.ok(rows.every(x=>x.status!=='SKIPPED'));
});
const posix=(top,name,tail='')=>['',top,name].join('/')+tail;
test('home paths fail with or without a trailing separator, and with doubled backslashes',()=>{
  for(const text of ['export HOME='+posix('Users','jdoe'),'cd '+posix('home','jdoe'),'"'+posix('Users','jdoe')+'"',posix('Users','jdoe')+'.',posix('home','jdoe',','),'C:'+String.raw`\\Users\\jdoe\\x`,'C:'+String.raw`\Users\jdoe`,'{"path":"C:'+String.raw`\\Users\\jdoe\\x`+'"}'])assert.equal(pathHits(text).length,1,text);
  for(const name of ['you','user','<user>','me','example','runner','name']){for(const text of ['export HOME='+posix('Users',name),'cd '+posix('home',name),posix('Users',name)+'.','C:'+String.raw`\\Users\\`+name])assert.equal(pathHits(text).length,0,text);}
  assert.equal(pathHits('Claude Code').length,0);assert.equal(pathHits('Users home').length,0);
});
test('email file references pass only as the backslash-n source form while real addresses on file-like domains fail',async t=>{
  const root=temporary(t),mail=(local,domain)=>[local,'@',domain].join('');
  const escaped='\\n';
  write(root,'refs.md','Use the line `@AGENTS.md` or (@README.md) or "@CLAUDE.md" '+['"',escaped,'@AGENTS.md" '].join('')+['md','txt','json','js','mjs','cjs','ts','yml','yaml','toml','py','sh'].map(ext=>escaped+'@FILE.'+ext).join(' '));
  assert.equal(by(await check(root,{env:{}}),'P_EMAIL')[0].status,'PASS');
  for(const address of [mail('maintainer','acme.sh'),mail('dev','startup.py'),mail('dev','site.md'),mail('team','tools.ts'),mail('n','FILE.md')]){
    write(root,'refs.md','Contact '+address+' for help\n');
    assert.equal(by(await check(root,{env:{}}),'P_EMAIL')[0].status,'FAIL',address);
  }
});
