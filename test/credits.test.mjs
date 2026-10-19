import { test } from 'node:test';
import assert from 'node:assert/strict';
import { read } from './support.mjs';
test('provenance sources receive linked licensed credit',()=>{const source=read('docs/PROVENANCE.md'),credits=read('CREDITS.md');const urls=[...new Set([...source.matchAll(/https:\/\/github\.com\/([\w.-]+\/[\w.-]+)/g)].map(m=>m[0].replace(/\.git$/,'')))];for(const url of urls){const row=credits.split('\n').find(l=>l.startsWith('|')&&l.includes(url));assert.ok(row,url);assert.match(row,/MIT|Apache|CC[- ]BY|Hippocratic|adaptation/i,url);}assert.match(read('README.md'),/\[[^\]]+\]\(CREDITS\.md\)/);});
