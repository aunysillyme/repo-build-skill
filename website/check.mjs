import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'website/dist');
const pages = ['index.html', 'docs/install/index.html', 'docs/checker/index.html', 'docs/method/index.html', 'docs/compatibility/index.html'];
execFileSync(process.execPath, [join(root, 'website/security.mjs'), '--check']);
for (const path of pages) {
  const html = readFileSync(join(dist, path), 'utf8');
  for (const value of ['data-projects-trigger', 'https://aunysillyme.dev/#projects', '/assets/projects-popup.js', '/assets/projects-popup.css', 'aria-current="page"', 'https://github.com/aunysillyme/repo-build-skill', 'https://www.npmjs.com/package/repo-build-skill']) if (!html.includes(value)) throw Error(`${path}: missing ${value}`);
  if (html.includes('<video')) throw Error(`${path}: unexpected video`);
}
for (const path of ['robots.txt', 'sitemap.xml', 'llms.txt', 'assets/site.css', 'assets/projects-popup.js', 'assets/projects-popup.css']) if (!existsSync(join(dist, path))) throw Error(`Missing ${path}`);
console.log(`Site checks passed for ${pages.length} pages`);
