import { test } from 'node:test';
import assert from 'node:assert/strict';
import { check } from '../src/check/index.mjs';
import { ROOT,temporary,write,treeHash } from './support.mjs';
test('check leaves the source and a fixture byte-identical',async t=>{const fixture=temporary(t);write(fixture,'package.json',{name:'sample-tool',version:'1.0.0'});write(fixture,'README.md','# Sample\n');for(const root of [fixture,ROOT]){const before=treeHash(root);await check(root,{env:{}});assert.equal(treeHash(root),before);}});
