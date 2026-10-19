import { NAME } from './constants.mjs';

export const hosts = Object.freeze({
  'claude-code': { label: 'Claude Code', target: `.claude/skills/${NAME}`, scopes: ['project', 'user'] },
  codex: { label: 'Codex', target: `.agents/skills/${NAME}`, scopes: ['project', 'user'] },
  'gemini-antigravity': { label: 'Gemini / Antigravity', target: `.agents/skills/${NAME}`, scopes: ['project', 'user'] },
  cursor: { label: 'Cursor', target: `.cursor/skills/${NAME}`, scopes: ['project', 'user'] },
  'agents-md': { label: 'AGENTS.md', target: `.agents/skills/${NAME}`, scopes: ['project'] },
  'chat-upload': { label: 'Chat upload', target: null, scopes: ['project'] },
});
export const targets = Object.freeze(Object.fromEntries(Object.entries(hosts).map(([id, host]) => [id, host.target])));
export const status = 'UNVERIFIED: file installation does not establish host activation.';
