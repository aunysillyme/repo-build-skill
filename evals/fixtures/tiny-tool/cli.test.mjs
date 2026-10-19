import test from 'node:test';
import assert from 'node:assert/strict';
import { main, parseInteger, sum } from './cli.mjs';

test('sums signed integers and rejects ambiguous or unsafe inputs', () => {
  assert.equal(sum([parseInteger('4'), parseInteger('-7'), parseInteger('+5')]), 2);
  assert.throws(() => parseInteger('1.5'));
  assert.throws(() => parseInteger('1e3'));
  assert.throws(() => parseInteger('9007199254740992'));
  assert.throws(() => sum([Number.MAX_SAFE_INTEGER, 1]));
});

test('CLI returns help, a sum and actionable input failures', () => {
  let stdout = '', stderr = '';
  const io = { stdout: { write: text => { stdout += text; } }, stderr: { write: text => { stderr += text; } } };
  assert.equal(main(['3', '-8'], io), 0);
  assert.equal(stdout, '-5\n');
  assert.equal(main(['--help'], io), 0);
  assert.match(stdout, /Usage:/);
  assert.equal(main(['--wat'], io), 2);
  assert.match(stderr, /Expected an integer/);
});
