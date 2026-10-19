import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync,writeFileSync,realpathSync } from 'node:fs';
import { join } from 'node:path';
import { externalProbes,platformEnv } from '../evals/score.mjs';
import { temporary } from './support.mjs';
const canaries=['SCRUB_PROBE_ONE','SCRUB_PROBE_TWO'];
test('scorer executions of produced code see only PATH, a temporary HOME and LANG, from a temporary copy',t=>{
  const root=realpathSync(temporary(t));
  mkdirSync(join(root,'bin'));
  writeFileSync(join(root,'package.json'),JSON.stringify({name:'probe-tool',version:'1.0.0',bin:{'probe-tool':'bin/probe.mjs'},files:['bin']}));
  writeFileSync(join(root,'bin/probe.mjs'),'#!/usr/bin/env node\nconsole.log(JSON.stringify({keys:Object.keys(process.env).sort(),home:process.env.HOME,cwd:process.cwd()}));\n');
  for(const key of canaries)process.env[key]='leaks';
  let rows;try{rows=externalProbes(root);}finally{for(const key of canaries)delete process.env[key];}
  const help=rows.find(row=>row.id==='binary-help'&&row.probe?.stdout);
  assert.ok(help,JSON.stringify(rows.map(r=>[r.id,r.status,r.message])));
  const seen=JSON.parse(help.probe.stdout.trim().split('\n').at(-1));
  // The operating system adds its own profile variables to every child: one on macOS, several on Windows.
  const osAdded=process.platform==='win32'?['HOMEDRIVE','HOMEPATH','LOGONSERVER','SYSTEMDRIVE','TEMP','TMP','USERDOMAIN','USERNAME','WINDIR']:['__CF_USER_TEXT_ENCODING'];
  assert.deepEqual(seen.keys.filter(key=>!['PATH','HOME','LANG',...osAdded,...Object.keys(platformEnv('home'))].includes(key)),[],'no variable beyond PATH, HOME, LANG and what the operating system adds itself');
  for(const key of canaries)assert.ok(!seen.keys.includes(key),key);
  assert.ok(seen.keys.includes('PATH'));assert.notEqual(seen.home,process.env.HOME);
  assert.ok(!seen.cwd.startsWith(root),`cwd ${seen.cwd} is not the checked tree`);
});
test('Windows adds only the four variables a process needs, and other platforms add none',()=>{
  const source={SystemRoot:'C:\\Windows',ComSpec:'cmd.exe',PATHEXT:'.EXE',TOKEN_LIKE:'leaks'};
  assert.deepEqual(platformEnv('H','win32',source),{SystemRoot:'C:\\Windows',ComSpec:'cmd.exe',PATHEXT:'.EXE',USERPROFILE:'H'});
  assert.deepEqual(platformEnv('H','linux',source),{});
});
