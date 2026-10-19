import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CORE,NAME,json,read } from './support.mjs';
test('CLAIM_MAP: capability rows name a route, asset or CLI command',()=>{const m=json(`${CORE}/manifest.json`),text=read('README.md');const section=text.match(/## (?:What your AI learns|Capabilities)([\s\S]*?)(?=\n## |$)/i)?.[1];assert.ok(section,'README capability table is required');const rows=section.split('\n').filter(l=>/^\|/.test(l)&&!/^\|[\s|:-]+$/.test(l)).slice(1);assert.ok(rows.length);for(const row of rows)assert.ok(m.routes.some(r=>row.toLowerCase().includes(r.name.toLowerCase())||row.includes(r.file))||m.assets.some(a=>row.includes(a.path))||new RegExp(`${NAME} (?:check|explain|install|uninstall|set)`).test(row),row);});
