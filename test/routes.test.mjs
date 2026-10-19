import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CORE,json,read } from './support.mjs';
import { headings } from '../src/readers/markdown.mjs';
test('nine routes retain their order, load set and gate',()=>{const m=json(`${CORE}/manifest.json`);assert.deepEqual(m.routes.map(r=>r.name),['Frame','Stack card','Scaffold','README / AGENTS.md / llms.txt','SEO and AEO for repos','Release with trusted publishing','Product site','Launch venues','Maintenance']);for(const r of m.routes){assert.ok(r.cards.length<=2);assert.ok(m.gates[r.id]);const t=read(`${CORE}/${r.file}`);assert.deepEqual(headings(t).filter(h=>h.level===2).map(h=>h.text),['GOAL','NEEDS','RE-CHECK','DO','READERS',"OWNER'S HANDS",'LEAVE','GATE']);assert.ok(t.includes('<!-- gate:start -->'));assert.ok(t.includes('| Check | Reject condition | Evidence |'));}});
