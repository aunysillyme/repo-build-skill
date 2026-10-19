import { test } from 'node:test';
import assert from 'node:assert/strict';
import { npmCall } from '../src/npm.mjs';
test('npm runs directly off Windows and through its own CLI on Windows, without a shell',()=>{
  assert.deepEqual(npmCall(['pack','--json'],{platform:'linux'}),{command:'npm',args:['pack','--json'],options:{}});
  const found=npmCall(['pack','--json'],{platform:'win32',execPath:'C:\\node\\node.exe',exists:()=>true});
  assert.equal(found.command,'C:\\node\\node.exe');assert.equal(found.options.shell,undefined);
  assert.ok(/npm-cli\.js$/.test(found.args[0]));assert.deepEqual(found.args.slice(1),['pack','--json']);
});
test('without the bundled CLI, Windows runs npm.cmd through a shell with only fixed, quoted arguments',()=>{
  const call=npmCall(['install','--prefix','C:\\Work\\a b\\p'],{platform:'win32',exists:()=>false});
  assert.equal(call.command,'npm.cmd');assert.equal(call.options.shell,true);
  assert.deepEqual(call.args,['"install"','"--prefix"','"C:\\Work\\a b\\p"']);
  for(const bad of ['x & calc','a|b','"q"','%PATH%','a\nb'])assert.throws(()=>npmCall([bad],{platform:'win32',exists:()=>false}),/metacharacter/,bad);
});
