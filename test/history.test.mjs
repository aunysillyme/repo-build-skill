import { test } from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { copyFileSync } from 'node:fs';
import { check } from '../src/check/index.mjs';
import { replayHistory } from '../evals/run.mjs';
import { ROOT,temporary,write } from './support.mjs';
test('history replay catches removed paths, private commit text and tag traps',async t=>{const root=temporary(t);replayHistory(root,join(ROOT,'evals/fixtures/tiny-tool/history.json'));copyFileSync(join(ROOT,'evals/fixtures/tiny-tool/private-list.txt'),join(root,'privacy.txt'));write(root,'.gitignore','privacy.txt\n');const r=await check(root,{history:true,env:{REPO_BUILD_PRIVATE_LISTS:join(root,'privacy.txt')}});assert.ok(r.results.some(x=>x.id==='P_PATH'&&x.status==='FAIL'&&x.file.startsWith('history:')));assert.ok(r.results.some(x=>x.id==='P_LIST'&&x.status==='FAIL'&&/message|tag:/.test(x.file)));});
