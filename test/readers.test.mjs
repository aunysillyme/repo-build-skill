import { test } from 'node:test';
import assert from 'node:assert/strict';
import { performance } from 'node:perf_hooks';
import { check } from '../src/check/index.mjs';
import { parseWorkflow,readWorkflow } from '../src/readers/workflow.mjs';
import { headings,links } from '../src/readers/markdown.mjs';
import { parseToml } from '../src/readers/toml-narrow.mjs';
import { temporary,write } from './support.mjs';
import { workflow } from './helpers.mjs';
const by=(r,id)=>r.results.filter(x=>x.id===id);
const timed=fn=>{const start=performance.now(),value=fn();return {value,ms:performance.now()-start};};
test('a long run of spaces parses in a single pass in a workflow value and a Markdown heading',()=>{
  const gap=' '.repeat(80000);
  const wf=timed(()=>parseWorkflow(`name: a${gap}b\njobs:\n  x:\n    runs-on: ubuntu-latest\n`));
  assert.equal(wf.value.unreadable,false);assert.ok(wf.ms<200,`workflow ${Math.round(wf.ms)} ms`);
  const md=timed(()=>headings(`# Title${gap}x\n`));
  assert.equal(md.value.length,1);assert.ok(md.ms<200,`heading ${Math.round(md.ms)} ms`);
  const trailing=timed(()=>headings(`# ${'#'.repeat(1)}${gap}`));assert.ok(trailing.ms<200,`trailing ${Math.round(trailing.ms)} ms`);
});
test('workflow comments stop at the first space-hash outside quotes and headings keep their text',()=>{
  const wf=parseWorkflow(['name: "keep # this" # comment','on: push','jobs:','  x:','    runs-on: ubuntu-latest # trailing','    steps:',"      - run: 'echo # quoted'","      - uses: a/b@"+'a'.repeat(40)+' # v1'].join('\n'));
  assert.equal(wf.unreadable,false,wf.error);assert.equal(wf.data.name,'keep # this');
  assert.equal(wf.data.jobs.x['runs-on'],'ubuntu-latest');assert.equal(wf.data.jobs.x.steps[0].run,'echo # quoted');assert.equal(wf.data.jobs.x.steps[1].uses,'a/b@'+'a'.repeat(40));
  assert.deepEqual(headings('# One #\n## Two ##\n### C#\n#### plain\n####### seven\n').map(h=>[h.level,h.text]),[[1,'One'],[2,'Two'],[3,'C'],[4,'plain']]);
});
const base=['name: a','on:','  push:','    branches:','    - main','permissions:','  contents: read','jobs:','  v:','    runs-on: ubuntu-latest','    steps:','    - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1','      with:','        persist-credentials: false','    - run: node --version',''].join('\n');
test('a sequence at the same indent as its key is readable',()=>{
  const wf=readWorkflow('a.yml',base);
  assert.equal(wf.unreadable,false,wf.error);assert.deepEqual(wf.data.on.push.branches,['main']);
  assert.equal(wf.steps.length,2);assert.equal(wf.steps[0].uses.split('@')[0],'actions/checkout');assert.equal(wf.steps[1].run,'node --version');
  const top=parseWorkflow('on: push\njobs:\n  v:\n    needs:\n    - a\n    - b\n    runs-on: ubuntu-latest\n');
  assert.equal(top.unreadable,false,top.error);assert.deepEqual(top.data.jobs.v.needs,['a','b']);
  const root=parseWorkflow('tags:\n- v1\n- v2\njobs:\n  v:\n    runs-on: x\n');assert.equal(root.unreadable,false,root.error);assert.deepEqual(root.data.tags,['v1','v2']);
});
test('one unreadable workflow is its own counted skip and the other workflows still run every rule',async t=>{
  const root=temporary(t);
  write(root,'.github/workflows/a.yml',base);
  write(root,'.github/workflows/b.yml',base.replace('actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1','actions/checkout@v7'));
  write(root,'.github/workflows/c.yml','name: c\npermissions: *shared\njobs: {}\n');
  const r=await check(root,{env:{},strict:true});
  const pin=by(r,'W_PIN');
  assert.ok(pin.some(x=>x.status==='FAIL'&&x.file==='.github/workflows/b.yml'),JSON.stringify(pin));
  assert.ok(pin.some(x=>x.status==='SKIPPED'&&x.file==='.github/workflows/c.yml'&&x.message.startsWith('UNREADABLE:')),JSON.stringify(pin));
  assert.ok(!pin.some(x=>x.file==='.github/workflows/a.yml'&&x.status!=='PASS'),'a.yml is readable and clean');
  assert.equal(r.exitCode,1);
  const aOnly=temporary(t);write(aOnly,'.github/workflows/a.yml',base);
  assert.ok(by(await check(aOnly,{env:{}}),'W_PIN').every(x=>x.status==='PASS'));
});
test('an unparseable pyproject value skips the manifest rules with a reason and the check still completes',async t=>{
  for(const text of ['[project]\nname = "sample"\nversion = "1.0.0"\ndescription = "Learn C # basics"\ndependencies = [\n  "requests>=2",\n  "rich",\n]\n','[project]\nname = "sample"\nversion = """1.0"""\n']){
    const root=temporary(t);write(root,'pyproject.toml',text);
    const r=await check(root,{env:{}});
    assert.notEqual(r.exitCode,2,r.error);
    if(text.includes('"""')){
      const skipped=r.results.filter(x=>x.status==='SKIPPED'&&/UNREADABLE: pyproject\.toml/.test(x.message));
      assert.ok(skipped.length>=1,JSON.stringify(r.results.filter(x=>x.status==='SKIPPED')));assert.ok(r.summary.skipped>=skipped.length);
    }
  }
});
test('the narrow TOML reader handles multi-line arrays and hash characters inside quoted strings',()=>{
  const out=parseToml('[project]\nname = "sample"\ndescription = "Learn C # basics" # real comment\nkeywords = [\n  "a", # first\n  \'b # c\',\n]\ndependencies = ["x"]\nrequires-python = ">=3.10"\n[project.urls]\nHomepage = "https://example.com/#top"\n');
  assert.equal(out.project.description,'Learn C # basics');assert.deepEqual(out.project.keywords,['a','b # c']);assert.deepEqual(out.project.dependencies,['x']);
  assert.equal(out.project.urls.Homepage,'https://example.com/#top');
  assert.throws(()=>parseToml('[project]\nname = """x"""\n'),/Unsupported TOML/);
  assert.throws(()=>parseToml('[project]\nkeywords = [\n"a",\n'),/Unsupported TOML/);
});
test('link scanning stays fast on a long run of opening brackets and keeps its results',()=>{
  const long=timed(()=>links('['.repeat(80000)));
  assert.equal(long.value.length,0);assert.ok(long.ms<200,`links ${Math.round(long.ms)} ms`);
  const mixed=timed(()=>links('['.repeat(40000)+'](x'+'['.repeat(40000)));assert.ok(mixed.ms<200,`mixed ${Math.round(mixed.ms)} ms`);
  assert.deepEqual(links('See [a](https://x.test/a), ![i](<https://x.test/i j>) and [b](https://x.test/b "t").\n[ref]: https://x.test/r\n[no](two words)').map(l=>[l.url,l.line]),[['https://x.test/a',1],['https://x.test/i j',1],['https://x.test/b',1],['https://x.test/r',2]]);
});
