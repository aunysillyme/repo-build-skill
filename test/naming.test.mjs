import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ROOT,NAME,CORE } from './support.mjs';
import { publicFiles,textFile } from '../src/io.mjs';
test('NAME_LITERAL: code reads the package name from one module',()=>{const allowed=new Set(['src/constants.mjs','src/check-set.mjs','scripts/check-set.mjs','package.json','package-lock.json','.repo-build/facts.json','.repo-build/set.json','.repo-build/set.lock.json',`${CORE}/manifest.json`]);const bad=publicFiles(ROOT).filter(f=>!allowed.has(f)&&!/^\.claude-plugin\/[^/]+\.json$/.test(f)&&!(/\.(?:md|txt)$/i.test(f))&&textFile(ROOT,f).includes(NAME));assert.deepEqual(bad,[]);});
