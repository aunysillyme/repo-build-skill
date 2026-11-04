import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

const shellSafe = /^[^"\r\n%^&|<>!]*$/;
/**
 * The command, arguments and spawn options that run npm on this platform.
 * Windows refuses to spawn a .cmd file directly, so npm's own CLI runs through node when it is installed
 * beside it; otherwise npm.cmd runs through the shell with fixed, double-quoted arguments.
 * @param {string[]} args
 * @param {{platform?:string, execPath?:string, exists?:(file:string)=>boolean}} [env]
 * @returns {{command:string, args:string[], options:{shell?:boolean}}}
 */
export function npmCall(args, { platform = process.platform, execPath = process.execPath, exists = existsSync } = {}) {
  if (platform !== 'win32') return { command: 'npm', args, options: {} };
  const cli = join(dirname(execPath), 'node_modules', 'npm', 'bin', 'npm-cli.js');
  if (exists(cli)) return { command: execPath, args: [cli, ...args], options: {} };
  if (!args.every(arg => shellSafe.test(arg))) throw Error('An npm argument contains a shell metacharacter.');
  return { command: 'npm.cmd', args: args.map(arg => `"${arg}"`), options: { shell: true } };
}
