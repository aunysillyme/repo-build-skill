import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { NAME, packageInfo } from '../src/constants.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'website/dist');
const origin = `https://${NAME}.aunysillyme.dev`;
const pages = [
  'index.html',
  'docs/install/index.html',
  'docs/checker/index.html',
  'docs/method/index.html',
  'docs/compatibility/index.html'
];
const mdTwins = [
  'index.md',
  'docs/install/index.md',
  'docs/checker/index.md',
  'docs/method/index.md',
  'docs/compatibility/index.md'
];

const assert = (cond, msg) => { if (!cond) throw Error(msg); };
const decodeAttr = s => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

execFileSync(process.execPath, [join(root, 'website/security.mjs'), '--check']);

const titles = new Set();
const descriptions = new Set();
const repoUrl = packageInfo.repository.replace(/^git\+/, '').replace(/\.git$/, '');

for (const path of pages) {
  const html = readFileSync(join(dist, path), 'utf8');
  assert(!html.includes('\u2014'), `${path}: contains em dash`);
  assert(!/<script\b(?![^>]*\bsrc=|[^>]*\btype="application\/ld\+json")/i.test(html), `${path}: unexpected inline executable script`);
  assert((html.match(/<h1\b/g) || []).length === 1, `${path}: expected exactly one H1`);

  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  assert(titleMatch, `${path}: missing <title>`);
  const title = decodeAttr(titleMatch[1]);
  assert(title.length > 0 && title.length <= 60, `${path}: title length ${title.length} exceeds 60 (${title})`);
  assert(!titles.has(title), `${path}: duplicate title ${title}`);
  titles.add(title);

  const descMatch = html.match(/<meta name="description" content="([^"]+)">/);
  assert(descMatch, `${path}: missing meta description`);
  const desc = decodeAttr(descMatch[1]);
  assert(desc.length >= 130 && desc.length <= 155, `${path}: description length ${desc.length} outside 130-155`);
  assert(!descriptions.has(desc), `${path}: duplicate description`);
  descriptions.add(desc);

  if (path === 'index.html') {
    const table = html.match(/<table\s+class="proof-table"[^>]*>([\s\S]*?)<\/table>/)?.[1] || '';
    assert(/<tbody>\s*<tr[\s>]/.test(table), `${path}: proof table has no rows`);
  }

  const route = path === 'index.html' ? '/' : `/${path.replace(/index\.html$/, '')}`;
  const requiredSubstrings = [
    'data-projects-trigger',
    'https://aunysillyme.dev/#projects',
    '/assets/projects-popup.js',
    '/assets/projects-popup.css',
    'aria-current="page"',
    repoUrl,
    packageInfo.homepage,
    `href="${origin}${route}"`,
    `href="${origin}${route}index.md"`,
    `href="${origin}/llms.txt"`,
    `href="${origin}/sitemap.xml"`,
    'href="/favicon.ico"',
    `content="${origin}/assets/social-preview.png"`,
    'property="og:site_name" content="AunySillyMe.dev"',
    'property="og:image:width" content="1200"',
    'property="og:image:height" content="630"',
    'name="twitter:card" content="summary_large_image"',
    'name="twitter:site" content="@AunySillyMe"',
    'type="application/ld+json"'
  ];
  for (const value of requiredSubstrings) {
    assert(html.includes(value), `${path}: missing ${value}`);
  }
  assert(!html.includes('noindex'), `${path}: unexpected noindex`);
  assert(!html.includes('<video'), `${path}: unexpected video`);

  const ldMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert(ldMatch, `${path}: missing JSON-LD block`);
  const ld = JSON.parse(ldMatch[1]);
  assert(Array.isArray(ld['@graph']) && ld['@graph'].length > 0, `${path}: invalid JSON-LD @graph`);
  const types = new Set(ld['@graph'].map(node => node['@type']));
  if (path === 'index.html') {
    for (const expectedType of ['SoftwareSourceCode', 'SoftwareApplication', 'Person', 'FAQPage']) {
      assert(types.has(expectedType), `${path}: JSON-LD missing ${expectedType}`);
    }
  } else {
    assert(types.has('BreadcrumbList'), `${path}: JSON-LD missing BreadcrumbList`);
  }
}

const notFound = readFileSync(join(dist, '404.html'), 'utf8');
assert(notFound.includes('name="robots" content="noindex"'), '404.html: missing noindex');

const requiredFiles = [
  'robots.txt',
  'sitemap.xml',
  'llms.txt',
  'llms-full.txt',
  'AGENTS.md',
  'agents.md',
  '404.html',
  'favicon.ico',
  ...mdTwins,
  'assets/social-preview.png',
  'assets/favicon.ico',
  'assets/site.css',
  'assets/projects-popup.js',
  'assets/projects-popup.css'
];
for (const path of requiredFiles) {
  assert(existsSync(join(dist, path)), `Missing ${path}`);
}

const robots = readFileSync(join(dist, 'robots.txt'), 'utf8');
assert(robots.includes('Allow: /') && !robots.includes('Disallow: /') && robots.includes(`Sitemap: ${origin}/sitemap.xml`), 'Invalid robots.txt');

const sitemap = readFileSync(join(dist, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
assert(locs.length === pages.length, `sitemap.xml expected ${pages.length} URLs, got ${locs.length}`);
assert(sitemap.includes('<lastmod>'), 'sitemap.xml missing <lastmod>');
assert(!locs.some(u => u.endsWith('.md') || u.endsWith('.txt') || u.includes('404')), 'sitemap.xml contains non-canonical URL');

for (const mdFile of [...mdTwins, 'llms.txt', 'llms-full.txt', 'AGENTS.md', 'agents.md']) {
  const text = readFileSync(join(dist, mdFile), 'utf8');
  assert(!text.includes('\u2014'), `${mdFile}: contains em dash`);
  assert(!/\]\((?!https?:\/\/)/i.test(text), `${mdFile}: contains relative Markdown link`);
}
for (const twin of mdTwins) {
  const text = readFileSync(join(dist, twin), 'utf8');
  assert(text.startsWith(`Canonical: ${origin}/`), `${twin}: missing Canonical header`);
}

console.log(`Site checks passed for ${pages.length} pages and all discovery endpoints`);
