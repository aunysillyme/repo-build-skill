import { test } from 'node:test';
import assert from 'node:assert/strict';
import { node,read,json,CORE } from './support.mjs';
test('generated files equal a fresh build',()=>{const r=node(['scripts/build.mjs','--check']);assert.equal(r.status,0,r.stdout+r.stderr);});
test('chat bundle contains every stage and reference card',()=>{const m=json(`${CORE}/manifest.json`),bundle=read('docs/bundles/chat-upload.md');for(const a of m.assets.filter(a=>['stage','card'].includes(a.kind)||a.path==='SKILL.md'))assert.ok(bundle.includes(`<!-- source:${a.path} -->`),a.path);});
