import { test } from 'node:test';
import assert from 'node:assert/strict';
import { read } from './support.mjs';
import { FLOOR } from '../src/check/rules/people.mjs';
test('professional floor files carry content',()=>{for(const file of [...FLOOR,'CREDITS.md','CLA.md','REPO_SETTINGS.md','docs/README.md'])assert.ok(read(file).trim(),file);});
