import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join, posix } from 'node:path';
import { renderProjectsPopup } from './lib/projects-popup-render.mjs';
import { csp } from './security.mjs';
import { NAME } from '../src/constants.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = path => readFileSync(join(root, path), 'utf8');
const facts = JSON.parse(read('.repo-build/facts.json'));
const pkg = JSON.parse(read('package.json'));
const proof = JSON.parse(read('proof/results.json')).filter(row => row.package_version === pkg.version && Date.parse(row.expires) > Date.now());
const { rows } = JSON.parse(read('.repo-build/set.json'));
const origin = `https://${NAME}.aunysillyme.dev`;
const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const repository = facts.repository;
const npm = pkg.homepage;
const socialAlt = `${NAME}: skill pack that teaches your AI to build, release and launch a GitHub repository.`;
const popup = renderProjectsPopup({ rows, current: NAME, id: 'projects-popup', fallbackHref: 'https://aunysillyme.dev/#projects' });
const trace = '<svg class="card-trace" aria-hidden="true" focusable="false"><rect class="ray-tail" x=".5" y=".5" pathLength="100"/><rect class="ray-mid" x=".5" y=".5" pathLength="100"/><rect class="ray-tip" x=".5" y=".5" pathLength="100"/></svg>';

const landingMeta = {
  route: '/',
  h1: 'Build a repo. Make it readable.',
  title: `${NAME} | AI Skill Pack to Ship & Launch Repos`,
  description: facts.description
};

const docs = [
  {
    route: '/docs/install/',
    title: 'Install',
    seoTitle: `Install & Host Setup | ${NAME}`,
    description: `Install ${NAME} with npx for Claude Code, Codex or manual copy: preview planned file writes, confirm host paths and uninstall cleanly.`,
    text: 'Choose your host, preview the changes and confirm the install. The installation guide includes headless commands and manual copy routes.',
    source: 'docs/install.md'
  },
  {
    route: '/docs/checker/',
    title: 'Check a repository',
    seoTitle: `Read-Only Repository Checker CLI | ${NAME}`,
    description: `Run npx ${NAME} check . --json to audit README clarity, LICENSE, AGENTS.md, llms.txt, GitHub SEO/AEO metadata and release readiness.`,
    text: 'Run the read-only checker to inspect a repository. The result explains what failed, why it matters and the stage that teaches the fix.',
    source: 'docs/CHECKER.md',
    code: `npx ${NAME} check . --json`
  },
  {
    route: '/docs/method/',
    title: 'The method',
    seoTitle: `Repository Build & Launch Method | ${NAME}`,
    description: 'Stage-gated workflow teaching AI coding agents to frame a repository, pick a stack, write docs for humans and LLMs, publish with OIDC and maintain.',
    text: 'The skill pack covers the path from framing a repository through release, launch and maintenance. Each stage has inputs, outputs and gates.',
    source: 'docs/METHOD.md'
  },
  {
    route: '/docs/compatibility/',
    title: 'Host compatibility',
    seoTitle: `Supported AI Hosts & Evidence | ${NAME}`,
    description: `Check supported AI coding hosts, skill installation directories, Node.js 22+ requirements and dated loading evidence for ${NAME}.`,
    text: 'Check host-specific installation routes and loading evidence before choosing a host.',
    source: 'docs/COMPATIBILITY.md'
  }
];

const faqs = [
  {
    question: 'What does the checker do?',
    answerHtml: 'It inspects repository files and explains findings. Your AI applies the method and makes changes.',
    answerText: 'It inspects repository files and explains findings. Your AI applies the method and makes changes.'
  },
  {
    question: 'Who publishes the repository?',
    answerHtml: 'The owner completes publication and public visibility changes. The AI prepares the artifacts and checks.',
    answerText: 'The owner completes publication and public visibility changes. The AI prepares the artifacts and checks.'
  },
  {
    question: 'Where can I find host instructions?',
    answerHtml: 'Read the <a href="/docs/compatibility/">compatibility guide</a> for host-specific routes and loading evidence.',
    answerText: `Read the compatibility guide at ${origin}/docs/compatibility/ for host-specific routes and loading evidence.`
  }
];

const sourceRoutes = new Map(docs.map(d => [d.source, d.route]));

function rewriteDocHref(href, source) {
  if (!href || /[\u0000-\u0020\u007f\\]/.test(href)) return '';
  if (href.startsWith('#')) return href;
  if (/^https?:\/\//i.test(href)) return href;
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(href)) return '';
  const [file, fragment] = href.split('#');
  const normalized = posix.normalize(file.startsWith('/') ? file.slice(1) : posix.join(posix.dirname(source), file));
  if (normalized === '..' || normalized.startsWith('../')) return '';
  const suffix = fragment ? `#${fragment}` : '';
  return sourceRoutes.has(normalized) ? `${sourceRoutes.get(normalized)}${suffix}` : `${repository}/blob/main/${normalized}${suffix}`;
}

function removeRepeated(text, pattern, replacement = '') {
  let previous;
  do { previous = text; text = text.replace(pattern, replacement); } while (text !== previous);
  return text;
}

function visibleText(html) {
  return removeRepeated(removeRepeated(html, /<!--[^]*?-->/g), /<(script|style)\b[^]*?<\/\1>/gi)
    .replace(/<\/?(?:a|code|strong|em|span|time|b)\b[^>]*>/gi, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&(?:amp|lt|gt|quot|#39);/g, entity => ({ '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" })[entity])
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(text, ids) {
  const base = visibleText(text).toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, '').trim().replace(/\s+/g, '-') || 'section';
  let id = base;
  let count = 0;
  while (ids.has(id)) id = `${base}-${++count}`;
  ids.add(id);
  return id;
}

function renderDocMarkdown(markdown, source) {
  const ids = new Set(['main', 'page-title']);
  let cleaned = removeRepeated(markdown.replace(/^# [^\n]+\n+/, ''), /<!--[^]*?-->/g);
  const inline = (value, tokens = []) => {
    const save = html => { tokens.push(html); return `\u0000${tokens.length - 1}\u0000`; };
    value = value.replace(/`([^`]+)`/g, (_, code) => save(`<code>${esc(code)}</code>`));
    value = removeRepeated(value, /<(script|style|iframe|object|svg)\b[^>]*>[^]*?<\/\1\s*>/gi);
    value = removeRepeated(value, /<\/?[a-z][^>]*>/gi);
    value = value.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, href) => {
      const url = rewriteDocHref(href, source);
      if (!url) return '';
      const ext = /^https?:\/\//i.test(url) ? ' target="_blank" rel="noopener noreferrer"' : '';
      return save(`<a href="${esc(url)}"${ext}>${esc(alt || 'View recording')} ↗</a>`);
    });
    value = value.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
      const url = rewriteDocHref(href, source);
      const rendered = inline(label, tokens);
      if (!rendered.trim() || !url) return save(rendered);
      const ext = /^https?:\/\//i.test(url) ? ' target="_blank" rel="noopener noreferrer"' : '';
      return save(`<a href="${esc(url)}"${ext}>${rendered}</a>`);
    });
    value = esc(value).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
    return value.replace(/\u0000(\d+)\u0000/g, (_, idx) => tokens[Number(idx)]);
  };

  const lines = cleaned.replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  for (let i = 0; i < lines.length;) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    if (/^\s*```/.test(line)) {
      const code = [];
      i++;
      while (i < lines.length && !/^\s*```/.test(lines[i])) code.push(lines[i++]);
      i++;
      blocks.push(`<pre><code>${esc(code.join('\n'))}</code></pre>`);
      continue;
    }
    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      const depth = Math.max(2, heading[1].length);
      const text = inline(heading[2]);
      blocks.push(`<h${depth} id="${slugify(text, ids)}">${text}</h${depth}>`);
      i++;
      continue;
    }
    if (/^\|/.test(line) && /^\|\s*:?-{3}/.test(lines[i + 1] || '')) {
      const cells = val => val.trim().replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map(c => inline(c.trim().replace(/\\\|/g, '|')));
      const headRow = cells(line);
      i += 2;
      const bodyRows = [];
      while (i < lines.length && /^\|/.test(lines[i])) bodyRows.push(cells(lines[i++]));
      blocks.push(`<div class="table-scroll"><table><thead><tr>${headRow.map(c => `<th scope="col">${c}</th>`).join('')}</tr></thead><tbody>${bodyRows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
      continue;
    }
    if (/^\s*(?:[-*]|\d+\.)\s+/.test(line)) {
      const ordered = /^\s*\d+\./.test(line);
      const pattern = ordered ? /^\s*\d+\.\s+/ : /^\s*[-*]\s+/;
      const items = [];
      while (i < lines.length && pattern.test(lines[i])) items.push(`<li>${inline(lines[i++].replace(pattern, ''))}</li>`);
      blocks.push(`<${ordered ? 'ol' : 'ul'}>${items.join('')}</${ordered ? 'ol' : 'ul'}>`);
      continue;
    }
    if (/^>/.test(line)) {
      const quote = [];
      while (i < lines.length && /^>/.test(lines[i])) quote.push(lines[i++].replace(/^>\s?/, ''));
      blocks.push(`<blockquote><p>${inline(quote.join('\n'))}</p></blockquote>`);
      continue;
    }
    const para = [lines[i++]];
    while (i < lines.length && lines[i].trim() && !/^(?:#{1,6}\s|\s*```|\||>|\s*[-*]\s|\s*\d+\.\s)/.test(lines[i])) para.push(lines[i++]);
    const rendered = inline(para.join('\n'));
    if (rendered.trim()) blocks.push(`<p>${rendered}</p>`);
  }
  return blocks.join('\n');
}

function buildJsonLd(route, docItem = null) {
  const graph = route === '/'
    ? [
        {
          '@type': 'SoftwareSourceCode',
          '@id': `${origin}/#source`,
          name: NAME,
          description: landingMeta.description,
          url: `${origin}/`,
          codeRepository: repository,
          programmingLanguage: 'JavaScript',
          runtimePlatform: 'Node.js',
          version: pkg.version,
          license: 'https://spdx.org/licenses/MIT.html',
          author: { '@id': 'https://aunysillyme.dev/#person' },
          sameAs: [repository, npm]
        },
        {
          '@type': 'SoftwareApplication',
          '@id': `${origin}/#software`,
          name: NAME,
          description: landingMeta.description,
          url: `${origin}/`,
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'macOS, Linux, Windows',
          softwareRequirements: 'Node.js 22 or later',
          softwareVersion: pkg.version,
          isAccessibleForFree: true,
          license: 'https://spdx.org/licenses/MIT.html',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          author: { '@id': 'https://aunysillyme.dev/#person' },
          sameAs: [repository, npm]
        },
        {
          '@type': 'Person',
          '@id': 'https://aunysillyme.dev/#person',
          name: 'Auny Hossain',
          alternateName: ['Auny', 'AunySillyMe'],
          url: 'https://aunysillyme.dev/',
          worksFor: {
            '@type': 'Organization',
            '@id': 'https://www.aunysillyme.com/#organization',
            name: 'AunySillyMe',
            legalName: 'Auny LLC',
            url: 'https://aunysillyme.com/'
          },
          sameAs: [
            'https://www.aunysillyme.com/#person',
            'https://aunysillyme.com/',
            'https://www.aunysillyme.com/',
            'https://github.com/aunysillyme',
            'https://github.com/aunysillyme-dev',
            'https://www.npmjs.com/~aunysillyme',
            'https://x.com/AunySillyMe'
          ]
        },
        {
          '@type': 'FAQPage',
          '@id': `${origin}/#faq`,
          mainEntity: faqs.map(item => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answerText
            }
          }))
        }
      ]
    : [
        {
          '@type': 'BreadcrumbList',
          '@id': `${origin}${route}#breadcrumb`,
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
            { '@type': 'ListItem', position: 2, name: docItem ? docItem.title : 'Documentation', item: `${origin}${route}` }
          ]
        }
      ];
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
}

function buildSidebar(route) {
  const docNav = docs.map(d => `<a href="${d.route}"${d.route === route ? ' class="active" aria-current="page"' : ''}>${esc(d.title)}</a>`).join('');
  const setNav = rows.filter(r => r.name !== facts.name).map(r => `<a href="https://${esc(r.name)}.aunysillyme.dev" target="_blank" rel="noopener noreferrer">${esc(r.name)} ↗</a>`).join('');
  return `<p class="side-label">${esc(NAME.toUpperCase())}</p><nav class="side-links" aria-label="Documentation"><a href="/#overview"${route === '/' ? ' class="active" aria-current="location"' : ''}>Overview</a><a href="/#how-it-works">How it works</a><a href="/#quickstart">Get started</a><a href="/#reference">Documentation</a>${docNav}</nav><p class="side-label">THE REST OF THE SET</p><nav class="side-links" aria-label="Related repositories">${setNav}</nav><div class="side-bottom"><a class="issue-button" href="${repository}/issues/new/choose" target="_blank" rel="noopener noreferrer">File an issue ↗</a><span>Open source · MIT license</span></div>`;
}

function buildHead({ seoTitle, description, route, docItem = null, notFound = false }) {
  const url = `${origin}${route}`;
  const discoveryAndSocial = notFound
    ? '<meta name="robots" content="noindex">'
    : `<link rel="canonical" href="${url}">
<link rel="alternate" type="text/markdown" href="${url}index.md">
<link rel="describedby" href="${origin}/llms.txt">
<link rel="sitemap" type="application/xml" href="${origin}/sitemap.xml">
<meta property="og:type" content="website">
<meta property="og:site_name" content="AunySillyMe.dev">
<meta property="og:title" content="${esc(seoTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${origin}/assets/social-preview.png">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(socialAlt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@AunySillyMe">
<meta name="twitter:creator" content="@AunySillyMe">
<meta name="twitter:title" content="${esc(seoTitle)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${origin}/assets/social-preview.png">
<meta name="twitter:image:alt" content="${esc(socialAlt)}">
<script type="application/ld+json">${buildJsonLd(route, docItem)}</script>`;

  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark">
<meta http-equiv="Content-Security-Policy" content="${esc(csp.replace("; frame-ancestors 'none'", ''))}">
<title>${esc(seoTitle)}</title>
<meta name="description" content="${esc(description)}">
${discoveryAndSocial}
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" href="/assets/avatar.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&amp;display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/site.css">
<link rel="stylesheet" href="/assets/projects-popup.css">
<script defer src="/assets/site.js"></script>
<script type="module" src="/assets/navigation.js"></script>
<script defer src="/assets/projects-popup.js"></script>`;
}

const header = `<a class="skip" href="#main">Skip to content</a><header class="top"><a class="brand" href="/"><img src="/assets/avatar.png" alt="AunySillyMe"><span>AunySillyMe.dev</span><span class="slash">/</span><b>${esc(NAME)}</b></a><nav class="topnav" aria-label="Project links">${popup}<a href="${repository}" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="${npm}" target="_blank" rel="noopener noreferrer">npm ↗</a></nav></header>`;
const section = (id, title, bodyHtml) => `<section class="content" id="${id}"><div class="section-title"><h2>${title}</h2></div>${bodyHtml}</section>`;
const cards = docs.map(d => `<a class="doc-link card" href="${d.route}">${trace}${esc(d.title)} ↗<span>${esc(d.text)}</span></a>`).join('');

const landingBody = `<div class="crumb"><a href="https://aunysillyme.dev/" target="_blank" rel="noopener noreferrer">Home</a><span>/</span><b>${esc(NAME)}</b></div><section class="hero" id="overview"><div><p class="eyebrow">A SKILL PACK FOR YOUR AI</p><h1>Build a repo.<br><em>Make it readable.</em></h1><p class="lede">${esc(facts.lead)}</p><div class="install card">${trace}<span class="dollar" aria-hidden="true">$</span><code id="install-command">${esc(facts.install)}</code><button class="copy card" type="button" data-copy="install-command" aria-label="Copy install command">⧉</button></div><p id="copy-status" role="status" class="sr-only" data-success="Copied" data-fallback="Select and copy the command"></p><div class="hero-actions"><a class="primary card" href="#quickstart">Get started ↓</a><a class="card" href="${repository}" target="_blank" rel="noopener noreferrer">Explore the source ↗</a></div></div><div class="routing card">${trace}<div class="routing-head"><span>FROM IDEA TO LAUNCH</span><span>THE METHOD</span></div><div class="route-core selected card">YOUR AI DOES THE WORK</div><div class="route-options"><div class="card"><b>People</b>README and About</div><div class="card"><b>Agents</b>Instructions and commands</div><div class="card"><b>AI search</b>Answers and sources</div></div></div></section><div class="trust"><span>Open source</span><span>MIT license</span><span>v${esc(pkg.version)}</span></div>${section('how-it-works', 'What your AI learns', `<div class="three"><article class="card">${trace}<div class="feature-num">01 / FRAME</div><h3>Start with the reader</h3><p>Define the problem, audience and acceptance checks.</p></article><article class="card">${trace}<div class="feature-num">02 / BUILD</div><h3>Prepare the repository</h3><p>Choose a stack, scaffold the project and write useful entry points.</p></article><article class="card">${trace}<div class="feature-num">03 / RELEASE</div><h3>Release and maintain</h3><p>Prepare publishing, launch and maintenance with stage gates.</p></article></div>`)}${section('quickstart', 'Get started', `<div class="docs-grid"><div><div class="step"><b>01</b><div>Install<p>Choose your host, review the preview and confirm the install.</p></div></div><div class="step"><b>02</b><div>Ask your AI<p>Ask it to read ${esc(NAME)} and prepare your repository for its first public release.</p></div></div><div class="step"><b>03</b><div>Check the result<p>Run the checker and review the stage receipts and owner actions.</p></div></div></div><div><div class="code card">${trace}<pre><code>npx ${esc(NAME)}\n\nnpx ${esc(NAME)} check . --json</code></pre></div><p class="note"><a href="/docs/install/">Installation guide ↗</a></p></div></div>`)}${section('reference', 'Documentation', `<div class="docs-links">${cards}</div>`)}${section('proof', 'What is measured', `<div class="proof-card card">${trace}<div class="table-scroll"><table class="proof-table"><thead><tr><th>Measurement</th><th>Value</th><th>Measured</th><th>Expires</th></tr></thead><tbody>${proof.map(row => `<tr><th scope="row">${esc(row.id)}</th><td>${esc(row.value)} ${esc(row.unit)}</td><td>${esc(row.measured.slice(0, 10))}</td><td>${esc(row.expires.slice(0, 10))}</td></tr>`).join('')}</tbody></table></div></div><p class="note">Measurements describe the package and machine used. <a href="${repository}/blob/main/proof/results.json" target="_blank" rel="noopener noreferrer">See commands and evidence ↗</a></p>`)}${section('releases', 'Release', `<div class="release"><strong>v${esc(pkg.version)}</strong><div class="release-copy"><p>Read the changes in the changelog.</p><a href="${repository}/blob/main/CHANGELOG.md" target="_blank" rel="noopener noreferrer">Changelog ↗</a></div></div>`)}${section('questions', 'Common questions', `<div class="faq">${faqs.map(item => `<details><summary>${esc(item.question)}</summary><p>${item.answerHtml}</p></details>`).join('')}</div>`)}${section('requirements', 'Requirements', `<div class="requirements"><article class="card">${trace}<h3>Node.js</h3><p>Node.js 22 or later is required.</p></article><article class="card">${trace}<h3>Your AI host</h3><p>Choose a supported host or use the manual copy route.</p></article></div>`)}${section('set', 'Part of a set', `<p class="note">${rows.filter(r => r.name !== facts.name).map(r => `<a href="https://${esc(r.name)}.aunysillyme.dev" target="_blank" rel="noopener noreferrer">${esc(r.name)} ↗</a>`).join(' · ')}</p>`)}`;

const footer = `<footer class="bottom"><span>Built by <a href="https://aunysillyme.dev/" target="_blank" rel="noopener noreferrer">AunySillyMe</a> · Open source</span><a href="${repository}" target="_blank" rel="noopener noreferrer">Repository ↗</a><a href="${repository}/blob/main/CREDITS.md" target="_blank" rel="noopener noreferrer">Credits ↗</a></footer>`;

function renderPage({ route, seoTitle, description, content, docItem = null, notFound = false }) {
  const template = read(route === '/' && !notFound ? 'website/landing.template.html' : 'website/doc.template.html');
  const values = {
    head: buildHead({ seoTitle, description, route, docItem, notFound }),
    header,
    sidebar: buildSidebar(route),
    mobileNav: `<details class="mobile-nav"><summary>Documentation</summary><nav aria-label="Mobile documentation">${docs.map(d => `<a href="${d.route}"${d.route === route ? ' class="active" aria-current="page"' : ''}>${esc(d.title)}</a>`).join('')}</nav></details>`,
    body: content,
    footer,
    pageClass: route === '/' && !notFound ? 'landing' : 'document'
  };
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (!(key in values)) throw Error(`Unknown slot ${key}`);
    return values[key];
  });
}

function decodeHtml(text) {
  return text.replace(/&(?:amp|lt|gt|quot|#39);/g, entity => ({ '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" })[entity]);
}

function markdownTwin(html, route) {
  let main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] || '';
  main = main
    .replace(/<details class="mobile-nav">[\s\S]*?<\/details>/g, '')
    .replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/g, '')
    .replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/g, '')
    .replace(/<div class="crumb">[\s\S]*?<\/div>/g, '')
    .replace(/<button\b[^>]*>[\s\S]*?<\/button>/g, '')
    .replace(/<p id="copy-status"[^>]*>[\s\S]*?<\/p>/g, '');
  main = main
    .replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/g, (_, depth, text) => `\n\n${'#'.repeat(Number(depth))} ${visibleText(text)}\n\n`)
    .replace(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, (_, rawHref, text) => {
      const cleanHref = rawHref.replace(/&amp;/g, '&');
      const fullHref = cleanHref.startsWith('#')
        ? `${origin}${route}${cleanHref}`
        : cleanHref.startsWith('/')
          ? `${origin}${cleanHref}`
          : cleanHref;
      return `[${visibleText(text)}](${fullHref})`;
    })
    .replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, (_, code) => `\n\n\`\`\`sh\n${decodeHtml(code)}\n\`\`\`\n\n`)
    .replace(/<code>([\s\S]*?)<\/code>/g, (_, code) => `\`${decodeHtml(code)}\``)
    .replace(/<\/(?:p|div|section|article|details|tr|li|figure|summary)>/g, '\n\n')
    .replace(/<\/(?:th|td)>/g, ' | ');
  main = removeRepeated(main, /<[^>]+>/g);
  return `Canonical: ${origin}${route}\n\n${decodeHtml(main).replace(/\n[ \t]+/g, '\n').replace(/\n{3,}/g, '\n\n').trim()}\n`;
}

let lastmod = '2026-11-17';
try {
  const gitDate = execFileSync('git', ['-C', root, 'log', '-1', '--format=%cs', 'HEAD'], { encoding: 'utf8' }).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(gitDate)) lastmod = gitDate;
} catch { /* fallback to current build date */ }

const out = join(root, 'website/dist');
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(join(root, 'website/assets'), join(out, 'assets'), { recursive: true });
copyFileSync(join(root, 'website/assets/favicon.ico'), join(out, 'favicon.ico'));

const renderedPages = [];
const landingHtml = renderPage({
  route: '/',
  seoTitle: landingMeta.title,
  description: landingMeta.description,
  content: landingBody
});
writeFileSync(join(out, 'index.html'), landingHtml);
renderedPages.push({ route: '/', h1: 'Overview', description: landingMeta.description, html: landingHtml });

for (const doc of docs) {
  const dir = join(out, doc.route);
  mkdirSync(dir, { recursive: true });
  const docHtmlBody = `<nav class="crumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span>Documentation</span><span>/</span><span aria-current="page">${esc(doc.title)}</span></nav><p class="source-note">Read on GitHub: <a href="${repository}/blob/main/${doc.source}" target="_blank" rel="noopener noreferrer">${esc(doc.source)} ↗</a></p><h1 class="document-title" id="page-title">${esc(doc.title)}</h1><article class="markdown">${renderDocMarkdown(read(doc.source), doc.source)}</article>`;
  const html = renderPage({
    route: doc.route,
    seoTitle: doc.seoTitle,
    description: doc.description,
    content: docHtmlBody,
    docItem: doc
  });
  writeFileSync(join(dir, 'index.html'), html);
  renderedPages.push({ route: doc.route, h1: doc.title, description: doc.description, html });
}

const notFoundHtml = renderPage({
  route: '/404.html',
  seoTitle: `Page Not Found | ${NAME}`,
  description: `The requested page was not found on ${origin}. Browse the overview and documentation guides.`,
  content: `<h1 class="document-title">Page not found</h1><p>Open the <a href="/">overview</a> or choose a guide from the documentation navigation.</p>`,
  notFound: true
});
writeFileSync(join(out, '404.html'), notFoundHtml);

const twins = renderedPages.map(item => {
  const md = markdownTwin(item.html, item.route);
  const relOut = item.route === '/' ? 'index.md' : `${item.route.slice(1)}index.md`;
  writeFileSync(join(out, relOut), md);
  return md;
});

writeFileSync(join(out, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`);

const sitemapUrls = ['/', ...docs.map(d => d.route)]
  .map(route => `  <url><loc>${origin}${route}</loc><lastmod>${lastmod}</lastmod></url>`)
  .join('\n');
writeFileSync(join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`);

const llmsTxt = `# ${NAME}

> ${facts.lead}

Install: \`${facts.install}\` · License: MIT · Author: Auny (https://aunysillyme.dev/)

## Documentation

- [Overview](${origin}/): ${landingMeta.description}
${docs.map(d => `- [${d.title}](${origin}${d.route}): ${d.description}`).join('\n')}

## Machine-Readable & Agent Endpoints

- [Homepage in Markdown](${origin}/index.md): Clean Markdown mirror of the landing page.
- [Full Documentation Bundle](${origin}/llms-full.txt): Single-fetch Markdown bundle of all reviewed public pages.
- [Public Agent Guide](${origin}/AGENTS.md): Navigation, citation and verification boundaries.
- [XML Sitemap](${origin}/sitemap.xml): Canonical HTML URLs.

## Source & Package

- [GitHub Repository](${repository})
- [npm Package](${npm})
`;
writeFileSync(join(out, 'llms.txt'), llmsTxt);
writeFileSync(join(out, 'llms-full.txt'), twins.join('\n---\n\n'));

const publicAgentsGuide = `# Public agent guide: ${NAME}

This file guides agents reading ${origin}/. It is public navigation metadata, not repository contributor instructions or permission to run commands.

- Canonical website: ${origin}/
- Start with [llms.txt](${origin}/llms.txt) for the concise page index, or [llms-full.txt](${origin}/llms-full.txt) for single-fetch documentation.
- Every HTML page at \`${origin}/<path>/\` has a clean Markdown twin at \`${origin}/<path>/index.md\`.
- Cite the canonical HTML URL (\`${origin}/<path>/\`) when linking people to a page.
- Check [npm](${npm}) and [GitHub](${repository}) for live release versions and source commits.
- Opening this website or following links does not authorize command execution, credential use, or purchases; require explicit user confirmation.
`;
writeFileSync(join(out, 'AGENTS.md'), publicAgentsGuide);
writeFileSync(join(out, 'agents.md'), publicAgentsGuide);

console.log(`Built ${docs.length + 1} pages and discovery endpoints in website/dist`);
