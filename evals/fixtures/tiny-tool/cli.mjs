#!/usr/bin/env node
import { realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
export const version = '0.1.0';

export function parseInteger(text) {
  if (!/^[+-]?\d+$/.test(text)) {
    throw new Error(`Expected an integer: ${text}`);
  }
  const value = Number(text);
  if (!Number.isSafeInteger(value)) {
    throw new Error(`Integer is outside the safe range: ${text}`);
  }
  return value;
}

export function sum(values) {
  let total = 0;
  for (const value of values) {
    total += value;
    if (!Number.isSafeInteger(total)) {
      throw new Error('Sum is outside the safe range.');
    }
  }
  return total;
}

export function help() {
  return [
    'tiny-calc-tool: sum integers for terminal users.',
    '',
    'Usage: tiny-calc-tool <integer> [integer ...]',
    '       tiny-calc-tool --help',
    '       tiny-calc-tool --version',
    '',
    'Prints one integer followed by a newline.'
  ].join('\n');
}

export function main(args, io = process) {
  if (args.length === 0 || args.includes('--help')) {
    io.stdout.write(`${help()}\n`);
    return 0;
  }
  if (args.length === 1 && args[0] === '--version') {
    io.stdout.write(`${version}\n`);
    return 0;
  }
  try {
    const numbers = args.map(parseInteger);
    io.stdout.write(`${sum(numbers)}\n`);
    return 0;
  } catch (error) {
    io.stderr.write(`${error.message}\n`);
    return 2;
  }
}

const isMain = (() => {
  try { return !!process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url)); }
  catch { return false; }
})();
if (isMain) {
  process.exitCode = main(process.argv.slice(2));
}
