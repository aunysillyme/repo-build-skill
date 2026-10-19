import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { validateSet, renderSet, renderBlocks, replaceBlock, currentName, plainLine, repoKey, readRegular } from './render-set.mjs';

export { validateSet, renderSet, renderBlocks, replaceBlock, currentName, plainLine, repoKey };
export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const rendererPath = fileURLToPath(new URL('./render-set.mjs', import.meta.url));
export const rendererBytes = () => fs.readFileSync(rendererPath);
export function checkSet(root = process.cwd()) {
  try {
    const rendered = renderSet({ root, check: true });
    const lock = JSON.parse(readRegular(root, '.repo-build/set.lock.json').toString('utf8'));
    const renderer = readRegular(root, '.repo-build/render-set.mjs');
    if (sha256(renderer) !== lock.renderer_sha256) return { code: 1, message: 'Vendored set renderer differs from lock.', changed: [...rendered.changed, '.repo-build/render-set.mjs'] };
    if (lock.vendored_sha256 && sha256(readRegular(root, '.repo-build/set.json')) !== lock.vendored_sha256) return { code: 1, message: 'Vendored set data differs from lock.', changed: [...rendered.changed, '.repo-build/set.json'] };
    return rendered;
  } catch (error) { return { code: 1, message: error.message, changed: [] }; }
}
function safeOutput(root, rel) {
  const pieces = rel.split('/');
  let current = root;
  for (const piece of pieces) {
    current = path.join(current, piece);
    let info;
    try { info = fs.lstatSync(current); } catch (error) { if (error.code !== 'ENOENT') throw error; }
    if (info?.isSymbolicLink()) throw Error(`Symlink refused: ${rel}`);
  }
  return current;
}
async function request(fetchImpl, url, options = {}) {
  const response = await fetchImpl(url, { signal: AbortSignal.timeout(15000), ...options });
  if (!response.ok) {
    /** @type {any} */
    const error = Error(`HTTP ${response.status}: ${new URL(url).origin}`);
    error.status = response.status;
    throw error;
  }
  return response;
}
function commitURL(source) {
  const url = new URL(source);
  if (url.hostname !== 'raw.githubusercontent.com') return null;
  const [owner, repo, ref, ...file] = url.pathname.slice(1).split('/');
  if (!owner || !repo || !ref || !file.length) return null;
  return `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits?path=${encodeURIComponent(file.join('/'))}&sha=${encodeURIComponent(ref)}&per_page=1`;
}
export async function syncSet({ root = process.cwd(), fetchImpl = globalThis.fetch, now = new Date(), env = process.env } = {}) {
  try {
    if (env.CI) return { code: 2, message: 'Set sync is maintainer-run only; run it outside CI.' };
    const config = JSON.parse(fs.readFileSync(safeOutput(root, '.repo-build/config.json'), 'utf8'));
    const source = config.set?.source;
    if (typeof source !== 'string' || !source.trim()) return { code: 2, message: 'Set sync needs set.source in .repo-build/config.json.' };
    let url;
    try { url = new URL(source); } catch { return { code: 2, message: 'Set source must be an HTTP URL without credentials.' }; }
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) return { code: 2, message: 'Set source must be an HTTP URL without credentials.' };
    const response = await request(fetchImpl, source);
    const sourceBytes = Buffer.from(await response.arrayBuffer());
    const set = validateSet(JSON.parse(sourceBytes.toString('utf8')));
    for (const row of set.rows) {
      let registry;
      try { registry = await request(fetchImpl, `https://registry.npmjs.org/${encodeURIComponent(row.name)}`); }
      catch (error) { if (error.status === 404) continue; throw error; }
      const metadata = await registry.json();
      const latest = metadata.versions?.[metadata['dist-tags']?.latest] ?? metadata;
      const description = plainLine(latest.description), key = repoKey(row.url);
      if (description && key && key === repoKey(latest.repository ?? metadata.repository)) row.line = description;
    }
    validateSet(set);
    let commit = null;
    const api = commitURL(source);
    if (api) {
      const token = env.GITHUB_TOKEN;
      const commits = await (await request(fetchImpl, api, { headers: { Accept: 'application/vnd.github+json', ...(token ? { Authorization: `Bearer ${token}` } : {}) } })).json();
      commit = Array.isArray(commits) ? commits[0]?.sha ?? null : commits.sha ?? null;
      if (commit !== null && !/^[a-f0-9]{40,64}$/i.test(commit)) throw Error('GitHub returned an invalid set commit');
    }
    const bytes = Buffer.from(JSON.stringify(set, null, 2) + '\n'), renderer = rendererBytes();
    const lock = { source, commit, sha256: sha256(sourceBytes), vendored_sha256: sha256(bytes), renderer_sha256: sha256(renderer), fetched: new Date(now).toISOString().slice(0, 10) };
    const blocks = renderBlocks(set, currentName(root));
    const outputs = [
      ['.repo-build/set.json', bytes], ['.repo-build/render-set.mjs', renderer], ['.repo-build/set.lock.json', JSON.stringify(lock, null, 2) + '\n'],
      ...[['README.md', blocks.readme], ['llms.txt', blocks.llms]].map(([rel, block]) => [rel, replaceBlock(fs.readFileSync(safeOutput(root, rel), 'utf8'), block)]),
    ];
    for (const [rel] of outputs) safeOutput(root, rel);
    fs.mkdirSync(safeOutput(root, '.repo-build'), { recursive: true });
    for (const [rel, output] of outputs) fs.writeFileSync(safeOutput(root, rel), output);
    return { code: 0, message: 'Set synchronized and rendered.', lock };
  } catch (error) { return { code: error.code === 'ENOENT' || error instanceof SyntaxError ? 2 : 3, message: error.message }; }
}
