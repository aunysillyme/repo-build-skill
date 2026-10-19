import { test } from 'node:test';
import assert from 'node:assert/strict';
import { read,json,CORE } from './support.mjs';
const OVERCLAIM=/builds? (?:it|the repo|your repo) for you|guaranteed|rank first|go viral|automatically (?:launches|publishes|builds)/i;
test('copy teaches the AI and assigns the work accurately',()=>{
  const p=json('package.json'),skill=read(`${CORE}/SKILL.md`),readme=read('README.md'),llms=read('llms.txt');
  assert.match(p.description,/teaches your AI/);
  for(const [label,text]of [['README',readme],['llms',llms],['skill',skill],['package',p.description]]){assert.doesNotMatch(text,OVERCLAIM,label);assert.match(text,/teach/i,label);}
  for(const text of [readme,llms]){assert.ok(text.includes('teaches your AI'));assert.ok(text.includes('Your AI does the work.'));}
});
