import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync,readFileSync,readdirSync,writeFileSync,chmodSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { check } from '../src/check/index.mjs';
import { walk } from '../src/io.mjs';
import { ROOT,temporary,write,treeHash } from './support.mjs';
test('check leaves the source and a fixture byte-identical',async t=>{const fixture=temporary(t);write(fixture,'package.json',{name:'sample-tool',version:'1.0.0'});write(fixture,'README.md','# Sample\n');for(const root of [fixture,ROOT]){const before=treeHash(root);await check(root,{env:{}});assert.equal(treeHash(root),before);}});
const gitIn=(root,...args)=>execFileSync('git',['-C',root,...args],{stdio:'pipe',env:{...process.env,GIT_CONFIG_GLOBAL:'/dev/null',GIT_AUTHOR_NAME:'t',GIT_AUTHOR_EMAIL:'t@example.com',GIT_COMMITTER_NAME:'t',GIT_COMMITTER_EMAIL:'t@example.com'}});
function hostileRepo(t){
  const outside=temporary(t),root=join(outside,'repo');
  write(root,'package.json',{name:'sample-tool',version:'1.0.0'});write(root,'README.md','# Sample\n');
  gitIn(root,'init','-q','.');gitIn(root,'add','README.md');gitIn(root,'commit','-q','-m','first');
  write(root,'untracked.txt','plain\n');
  const marker=join(outside,'marker.txt'),script=join(outside,'fsmonitor.sh');
  writeFileSync(script,`#!/bin/sh\necho ran > "${marker}"\n`);chmodSync(script,0o755);
  gitIn(root,'config','core.fsmonitor',script);gitIn(root,'config','core.hooksPath',outside);
  return {root,outside,marker};
}
const files=root=>walk(root).sort().map(f=>f+'\0'+readFileSync(join(root,f),'utf8')).join('\0');
const fingerprint=(root,outside)=>createHash('sha256').update(files(root)).digest('hex')+createHash('sha256').update(readFileSync(join(root,'.git/config'))).update(readdirSync(outside).sort().join('\0')).digest('hex');
test('a hostile git config runs nothing during check and leaves .git/config and the outside marker path untouched',async t=>{
  const {root,outside,marker}=hostileRepo(t),before=fingerprint(root,outside);
  await check(root,{env:{},history:true});
  assert.equal(existsSync(marker),false,'fsmonitor script ran');
  assert.equal(fingerprint(root,outside),before);
});
test('a hostile git config runs nothing while the privacy-list tracking check walks parent repositories',async t=>{
  const {root,outside,marker}=hostileRepo(t);
  write(root,'.repo-build/private.local.txt','synthetic-marker\n');
  await check(root,{env:{}});
  assert.equal(existsSync(marker),false,'fsmonitor script ran');
});
