import { test } from 'node:test';
import assert from 'node:assert/strict';
import { read } from './support.mjs';
import { FLOOR } from '../src/check/rules/people.mjs';
import { check } from '../src/check/index.mjs';
import { makeBaseline,tempRepo } from './helpers.mjs';
import { rmSync } from 'node:fs';
import { join } from 'node:path';
test('professional floor files carry content',()=>{for(const file of [...FLOOR,'CREDITS.md','CLA.md','REPO_SETTINGS.md','docs/README.md'])assert.ok(read(file).trim(),file);});
test('the professional floor supports projects using other dependency monitoring',async t=>{
  const root=tempRepo(t);makeBaseline(root);
  rmSync(join(root,'.github/dependabot.yml'));
  const report=await check(root,{env:{}});
  assert.ok(report.results.filter(row=>row.id==='H_FLOOR').every(row=>row.status==='PASS'));
});
