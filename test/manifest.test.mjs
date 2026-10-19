import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync,readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT,CORE,NAME,json } from './support.mjs';
import { digest } from '../src/io.mjs';
test('manifest lists each portable skill asset with its installed hash',()=>{const m=json(`${CORE}/manifest.json`);assert.equal(m.name,NAME);assert.equal(m.packageVersion,json('package.json').version);assert.ok(m.assets.length);assert.equal(new Set(m.assets.map(a=>a.path)).size,m.assets.length);for(const a of m.assets){assert.ok(existsSync(join(ROOT,CORE,a.path)),a.path);assert.equal(a.sha256,digest(readFileSync(join(ROOT,CORE,a.path))),a.path);}for(const f of ['src/install.mjs','src/catalog.mjs','llms.txt',...['claude-code','codex','gemini-antigravity','cursor','agents-md','chat-upload'].map(x=>`adapters/${x}.md`)])assert.ok(existsSync(join(ROOT,f)),f);});
