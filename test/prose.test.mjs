import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ROOT } from './support.mjs';
import { publicFiles,textFile } from '../src/io.mjs';
import { headings } from '../src/readers/markdown.mjs';
import { absence } from '../src/check/rules/people.mjs';
test('text follows the punctuation and heading rules',()=>{const hits=[];for(const f of publicFiles(ROOT)){const text=textFile(ROOT,f);if(text.includes(String.fromCodePoint(0x2014)))hits.push(`${f}: punctuation`);if(f.endsWith('.md'))for(const h of headings(text))if(absence.test(h.text))hits.push(`${f}:${h.line}: heading`);}assert.deepEqual(hits,[]);});
