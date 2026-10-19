import { test } from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { copyFileSync } from 'node:fs';
import { check } from '../src/check/index.mjs';
import { replayHistory } from '../evals/run.mjs';
import { ROOT,temporary,write } from './support.mjs';
test('history replay catches removed paths, private commit text and tag traps',async t=>{const root=temporary(t);replayHistory(root,join(ROOT,'evals/fixtures/tiny-tool/history.json'));copyFileSync(join(ROOT,'evals/fixtures/tiny-tool/private-list.txt'),join(root,'privacy.txt'));write(root,'.gitignore','privacy.txt\n');const r=await check(root,{history:true,env:{REPO_BUILD_PRIVATE_LISTS:join(root,'privacy.txt')}});assert.ok(r.results.some(x=>x.id==='P_PATH'&&x.status==='FAIL'&&x.file.startsWith('history:')));assert.ok(r.results.some(x=>x.id==='P_LIST'&&x.status==='FAIL'&&/message|tag:/.test(x.file)));});
import { spawnSync } from 'node:child_process';
import { performance } from 'node:perf_hooks';
function generatedHistory(root,commits,files){
  const lines=[],ts=1700000000,blob=text=>`data ${Buffer.byteLength(text)}\n${text}\n`;
  const secret=['gh','p_','Q'.repeat(36)].join('');
  for(let c=0;c<commits;c++){
    const msg=`change ${c}`;
    lines.push('commit refs/heads/main',`mark :${c+1}`,`author t <t@example.com> ${ts+c} +0000`,`committer t <t@example.com> ${ts+c} +0000`,`data ${msg.length}\n${msg}`);
    if(c)lines.push(`from :${c}`);
    const changed=c?[...new Set([c%files,(c*7+1)%files,...(c===40?[3]:[])])]:[...Array(files).keys()];
    for(const f of changed){let body=`file ${f} revision ${c}\n`;if(f===3&&c===40)body+=secret+'\n';lines.push(`M 100644 inline src/file-${f}.txt`,blob(body).trimEnd());}
    lines.push('');
  }
  const r=spawnSync('git',['-C',root,'fast-import','--quiet'],{input:lines.join('\n')+'\n',encoding:'utf8'});
  assert.equal(r.status,0,r.stderr);
}
test('history scanning a 100-commit by 200-file repository finishes in under ten seconds and reports a removed token once',async t=>{
  const root=temporary(t);spawnSync('git',['init','-q',root]);generatedHistory(root,100,200);
  const start=performance.now(),r=await check(root,{history:true,env:{}}),elapsed=performance.now()-start;
  assert.ok(elapsed<10000,`history took ${Math.round(elapsed)} ms`);
  const hits=r.results.filter(x=>x.id==='P_TOKEN'&&x.status==='FAIL');
  assert.equal(hits.length,1,JSON.stringify(hits));
  assert.match(hits[0].file,/^history:[a-f0-9]{40,64}:src\/file-3\.txt$/);
});
