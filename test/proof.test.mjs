import { test } from 'node:test';
import assert from 'node:assert/strict';
import { check } from '../src/check/index.mjs';
import { json,temporary,write } from './support.mjs';
test('proof rows carry reproducible package receipts',()=>{const rows=json('proof/results.json');assert.ok(Array.isArray(rows)&&rows.length>=4,'Measure deterministic package rows before release.');for(const row of rows){for(const key of ['value','unit','command','measured','expires','package_version'])assert.notEqual(row[key],undefined,key);assert.equal(row.subject,'package');assert.ok(Number.isFinite(Date.parse(row.measured)));assert.ok(Number.isFinite(Date.parse(row.expires)));}});
test('an expired row warns and does not block the checker',async t=>{const root=temporary(t);write(root,'proof/results.json',[{value:1,unit:'bytes',command:'npm pack',measured:'2020-01-01',expires:'2020-04-01',package_version:'1.0.0',subject:'package'}]);const report=await check(root,{env:{},house:true});const rows=report.results.filter(r=>r.id==='F_PROOF');assert.equal(rows[0].status,'WARN');assert.equal(rows[0].severity,'warn');});
