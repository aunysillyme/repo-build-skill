import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CORE,read } from './support.mjs';
import { headings } from '../src/readers/markdown.mjs';
import { skillFindings } from '../src/check/rules/agents.mjs';
test('SKILL_SHAPE: invocation comes first in a portable router',()=>{const file=`${CORE}/SKILL.md`,text=read(file);assert.deepEqual(skillFindings(file,text),[]);assert.equal(headings(text).find(h=>h.level===2)?.text,'When invoked');assert.doesNotMatch(text,/^\s*\d+[.)]\s+(?:install|choose (?:a )?host|select (?:a )?host)/im);});
