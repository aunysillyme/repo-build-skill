import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CORE,json,read } from './support.mjs';
import { headings } from '../src/readers/markdown.mjs';
test('every promised topic resolves to a shipped heading',()=>{const m=json(`${CORE}/manifest.json`);assert.deepEqual(Object.keys(m.topics).sort(),['floor','stack-card','settings-at-flip','installer','acceptance-checks','trailer','discoverability','release-contract','launch','maintenance'].sort());for(const [topic,value]of Object.entries(m.topics)){const [file,slug]=value.split('#');assert.ok(m.assets.some(a=>a.path===file),topic);assert.ok(headings(read(`${CORE}/${file}`)).some(h=>h.slug===slug),value);}});
