import { spawnSync } from 'node:child_process';

const has = (help, flag) => new RegExp(`(^|[\\s,])${flag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=[\\s,=]|$)`, 'm').test(help);
const flagLine = (help, flag) => help.split('\n').find(line => has(line, flag)) || '';

export function probeHost(kind, command = kind === 'claude-code' ? 'claude' : kind, run = spawnSync) {
  const requests = kind === 'codex' ? [['--help'], ['exec', '--help']] : [['--help']];
  const probes = requests.map(args => {
    const result = run(command, args, { encoding: 'utf8', timeout: 15000, maxBuffer: 4 * 1024 * 1024 });
    if (result.error || result.status !== 0) throw Error(`Cannot read ${command} ${args.join(' ')}: ${result.error?.message || result.stderr || result.status}`);
    return { args, output: `${result.stdout || ''}\n${result.stderr || ''}` };
  });
  const help = probes.map(row => row.output).join('\n');
  const options = new Set([...help.matchAll(/(?:^|\s)(--[a-z][a-z0-9-]*)/g)].map(match => match[1]));
  const web = discoverWebFlags(help, kind);
  const toolsOff = has(help, '--no-tools') ? ['--no-tools'] : has(help, '--tools') ? ['--tools', ''] : null;
  return { kind, command, help, probes, options: [...options], web, toolsOff };
}

export function discoverWebFlags(help, kind) {
  if (has(help, '--web-on') && has(help, '--web-off')) return { on: ['--web-on'], off: ['--web-off'], placement: 'command' };
  if (has(help, '--web') && has(help, '--no-web')) return { on: ['--web'], off: ['--no-web'], placement: 'command' };
  if (has(help, '--search') && has(help, '--no-search')) return { on: ['--search'], off: ['--no-search'], placement: kind === 'codex' ? 'global' : 'command' };
  if (has(help, '--tools') && /WebSearch|WebFetch/.test(help)) {
    const basic = ['Bash', 'Read', 'Write', 'Edit', 'Glob', 'Grep'];
    return { on: ['--tools', [...basic, 'WebSearch', 'WebFetch'].join(',')], off: ['--tools', basic.join(',')], placement: 'command' };
  }
  if (has(help, '--search') && /web_search[^\n]*disabled|disabled[^\n]*web_search/.test(help) && has(help, '--config')) {
    return { on: ['--search'], off: ['--config', 'web_search="disabled"'], placement: 'global' };
  }
  return { on: null, off: null, reason: 'The live help does not document both web modes. Use a wrapper whose help exposes --web-on and --web-off.' };
}

export function invocation(probe, { model, prompt, web = true, tools = true }) {
  const flags = web ? probe.web.on : probe.web.off;
  if (!flags) throw Error(probe.web.reason);
  if (!tools && !probe.toolsOff) throw Error('The live help does not document a tools-off mode for cold reads.');
  const args = probe.kind === 'codex' ? ['exec'] : [];
  if (probe.kind === 'codex' && has(probe.help, '--sandbox')) args.push('--sandbox', tools ? 'workspace-write' : 'read-only');
  if (probe.kind === 'codex' && !tools && has(probe.help, '--skip-git-repo-check')) args.push('--skip-git-repo-check');
  if (probe.kind === 'claude-code') {
    if (!has(probe.help, '--print')) throw Error('The live help does not document --print.');
    args.push('--print');
    if (has(probe.help, '--no-session-persistence')) args.push('--no-session-persistence');
    if (tools && has(probe.help, '--permission-mode') && /acceptEdits/.test(probe.help)) args.push('--permission-mode', 'acceptEdits');
  }
  if (probe.kind === 'gemini' && tools && has(probe.help, '--approval-mode') && /auto_edit/.test(probe.help)) args.push('--approval-mode', 'auto_edit');
  if (!has(probe.help, '--model')) throw Error('The live help does not document --model.');
  args.push('--model', model);
  if (probe.web.placement === 'global') args.unshift(...flags);
  else args.push(...flags);
  if (!tools) args.push(...probe.toolsOff);
  if (has(probe.help, '--prompt')) args.push('--prompt', prompt);
  else if (probe.kind === 'codex' || /\[prompt\]|\[PROMPT\]|<prompt>|<PROMPT>/.test(probe.help)) args.push(prompt);
  else throw Error('The live help does not document a prompt argument.');
  return { command: probe.command, args };
}

export function createHost(kind) {
  return {
    probe: (command, run) => probeHost(kind, command, run),
    run({ probe, cwd, model, prompt, web = true, tools = true, env = process.env, timeout = 900000, run = spawnSync }) {
      const call = invocation(probe, { model, prompt, web, tools });
      const result = run(call.command, call.args, { cwd, env, input: '', encoding: 'utf8', timeout, maxBuffer: 16 * 1024 * 1024 });
      return { command: call.command, args: call.args, exitCode: result.status ?? 1, stdout: result.stdout || '', stderr: result.stderr || '', error: result.error?.message || null };
    }
  };
}

export { flagLine };
