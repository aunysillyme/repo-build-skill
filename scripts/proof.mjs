import { spawnSync } from 'node:child_process';
import { performance } from 'node:perf_hooks';
import { realpathSync,readFileSync,writeFileSync,mkdtempSync,rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROOT,VERSION,BIN } from '../src/constants.mjs';
import { check } from '../src/check/index.mjs';
export function packMetrics(root=ROOT) {
  const r=spawnSync(process.platform==='win32'?'npm.cmd':'npm',['pack','--dry-run','--json','--ignore-scripts','--offline'],{cwd:root,encoding:'utf8',env:{...process.env,npm_config_cache:join(tmpdir(),'repo-proof-npm-cache'),npm_config_update_notifier:'false'}});
  if(r.status!==0)throw Error(r.stderr||'Package inspection failed.');
  const parsed=JSON.parse(r.stdout);const rows=Array.isArray(parsed)?parsed:Object.values(parsed);const p=rows.find(x=>x&&typeof x==='object'&&typeof x.size==='number');
  if(!p)throw Error('Package inspection returned no size receipt.');
  return {packed:p.size,unpacked:p.unpackedSize,files:p.files};
}
export function helpMetrics(root=ROOT,n=5) {
  const pkg=JSON.parse(readFileSync(join(root,'package.json'),'utf8')),times=[];
  for(let i=0;i<n;i++){const start=performance.now(),r=spawnSync(process.execPath,[Object.values(pkg.bin)[0],'--help'],{cwd:root,encoding:'utf8'});if(r.status!==0)throw Error(r.stderr||r.stdout||'Help failed.');times.push(performance.now()-start);}
  times.sort((a,b)=>a-b);return times[Math.floor(times.length/2)];
}
// Milliseconds keep one decimal and bytes are whole numbers, so published values read cleanly.
export const roundValue=(value,unit)=>unit==='ms'?Math.round(value*10)/10:Math.round(value);
export async function measureProof(root=ROOT,{now=new Date()}={}) {
  const p=JSON.parse(readFileSync(join(root,'package.json'),'utf8')),size=packMetrics(root),help=helpMetrics(root),start=performance.now();
  const result=await check(join(root,'evals/fixtures/tiny-tool'),{env:{}});
  if(result.exitCode===2)throw Error(result.error);
  const checker=performance.now()-start,measured=new Date(now).toISOString(),expires=new Date(new Date(now).getTime()+90*24*60*60*1000).toISOString();
  return [['packed-size',size.packed,'bytes','npm pack --dry-run --json --ignore-scripts'],['unpacked-size',size.unpacked,'bytes','npm pack --dry-run --json --ignore-scripts'],['help-time',help,'ms','node scripts/proof.mjs --deterministic'],['checker-time',checker,'ms','node scripts/proof.mjs --deterministic']].map(([id,value,unit,command])=>({id,value:roundValue(value,unit),unit,command,measured,expires,package_version:p.version,subject:'package'}));
}
async function main(){const args=process.argv.slice(2);if(args.some(x=>x!=='--deterministic'))throw Error('Usage: node scripts/proof.mjs [--deterministic]');const file=join(process.cwd(),'proof/results.json');let prior=[];try{const j=JSON.parse(readFileSync(file,'utf8'));prior=Array.isArray(j)?j:j.results;}catch(e){if(e.code!=='ENOENT')throw e;}const rows=await measureProof(process.cwd()),ids=new Set(rows.map(r=>r.id));writeFileSync(file,JSON.stringify([...prior.filter(r=>!ids.has(r.id)),...rows],null,2)+'\n');console.log('Package measurements refreshed.');}
const isMain=(()=>{try{return !!process.argv[1]&&realpathSync(process.argv[1])===realpathSync(fileURLToPath(import.meta.url));}catch{return false;}})();
if(isMain)main().catch(e=>{console.error(e.stack||e.message);process.exitCode=2;});
