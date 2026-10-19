import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ROOT,read } from './support.mjs';
import { publicFiles,textFile,digest } from '../src/io.mjs';
const tokens=s=>s.toLowerCase().split(/[^a-z0-9_.@~\/\p{L}\p{N}\p{S}-]+/u).map(s=>s.replace(/^\.+|\.+$/g,'')).filter(Boolean);
test('INTERNAL_TERMS: public tokens pass the hashed private vocabulary',()=>{const raw=read('test/terms.private.sha256').trim();assert.match(raw,/^[a-f0-9]{64}(?:\n[a-f0-9]{64})*$/);const hashes=new Set(raw.split('\n')),hits=[];for(const file of publicFiles(ROOT)){if(file==='test/terms.private.sha256')continue;const parts=tokens(file+'\n'+textFile(ROOT,file));for(let i=0;i<parts.length;i++)for(let n=1;n<=4&&i+n<=parts.length;n++)if(hashes.has(digest(parts.slice(i,i+n).join(' '))))hits.push(`${file}: private vocabulary`);}assert.deepEqual([...new Set(hits)],[]);});

test('private vocabulary hashes retain profile symbols and home-path qualifiers',()=>{
  const fingerprint=s=>digest(tokens(s).join(' '));
  assert.notEqual(fingerprint('Owner ♥'),fingerprint('Owner'));
  assert.notEqual(fingerprint('~/Host Name'),fingerprint('Host Name'));
  assert.equal(fingerprint('Private Tool'),fingerprint('private tool'));
  assert.notEqual(fingerprint('private-tool'),fingerprint('private tool'));
});
