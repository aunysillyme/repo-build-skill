import { resolve,join } from 'node:path';
import { existsSync,statSync } from 'node:fs';
import { VERSION } from '../constants.mjs';
import { publicFiles,textFile,jsonOptional } from '../io.mjs';
import { readFacts } from '../facts.mjs';
import { readManifests } from '../readers/manifests.mjs';
import { readWorkflow } from '../readers/workflow.mjs';
import { loadPrivateLists,historyItems } from './rules/privacy.mjs';
import people from './rules/people.mjs';
import agents from './rules/agents.mjs';
import engines from './rules/answer-engines.mjs';
import registries from './rules/registries.mjs';
import workflows from './rules/workflows.mjs';
import privacy from './rules/privacy.mjs';
import proof from './rules/proof.mjs';
import credits from './rules/credits.mjs';
import set from './rules/set.mjs';
import online,{ OfflineError } from './online.mjs';
import { summarize } from './report.mjs';
export const rules=[...people,...agents,...engines,...registries,...workflows,...privacy,...proof,...credits,...set,...online];
export function createContext(root,options={}) {
  root=resolve(root);if(!existsSync(root)||!statSync(root).isDirectory())throw Error('Check path must be a directory.');
  const files=publicFiles(root),cache=new Map();
  const read=file=>{if(!files.includes(file))return '';if(!cache.has(file)){try{cache.set(file,textFile(root,file));}catch(e){if(e.code==='ENOENT')cache.set(file,'');else throw e;}}return cache.get(file);};
  const config=jsonOptional(root,'.repo-build/config.json',{});
  if(config.disable!==undefined&&(typeof config.disable!=='object'||!config.disable||Array.isArray(config.disable)))throw Error('disable must map rule codes to reasons.');
  for(const [id,reason]of Object.entries(config.disable||{})){if(!rules.some(r=>r.id===id))throw Error(`Unknown disabled code: ${id}`);if(typeof reason!=='string'||!reason.trim())throw Error(`Disabled code ${id} needs a reason.`);}
  const env=options.env||process.env,manifests=readManifests(root),privateLists=loadPrivateLists(root,env);
  return {root,files,read,exists:file=>files.includes(file),facts:readFacts(root),...manifests,config,privateLists,options,env,now:options.now?new Date(options.now).getTime():Date.now(),fetch:options.fetchImpl||options.fetch||globalThis.fetch,history:options.history&&existsSync(join(root,'.git'))?historyItems(root):[],workflows:files.filter(f=>/^\.github\/workflows\/.*\.ya?ml$/.test(f)).map(file=>readWorkflow(file,read(file)))};
}
export async function check(root='.',options={}) {
  let c;try{c=createContext(root,options);}catch(e){return {version:VERSION,profile:'invalid',results:[],summary:summarize([]),exitCode:2,error:e.message};}
  const results=[];let unreachable=false;
  for(const r of rules){
    if(r.mode==='online'&&!options.online)continue;
    const base={id:r.id,reader:r.reader,stage:r.stage,severity:options.house&&r.house?'error':r.severity,file:null,line:null,why:r.why,learn:r.learn};
    if(c.config.disable?.[r.id]){results.push({...base,status:'OFF',message:c.config.disable[r.id]});continue;}
    if(r.id==='S_STALE'&&c.env.CI){results.push({...base,status:'NOT APPLICABLE',message:'maintainer-run only'});continue;}
    if(!r.applies(c)){results.push({...base,status:'NOT APPLICABLE',message:'This artifact is outside the selected profile.'});continue;}
    if(r.id.startsWith('W_')&&c.workflows.some(w=>w.unreadable)){for(const w of c.workflows.filter(w=>w.unreadable))results.push({...base,status:'SKIPPED',file:w.file,message:`UNREADABLE: ${w.error}`});continue;}
    try{const findings=await r.run(c);if(!findings.length)results.push({...base,status:'PASS',message:r.pass});else for(const f of findings){const row={...base,...f};if(row.status==='FAIL'&&row.severity==='warn')row.status='WARN';results.push(row);}}
    catch(e){if(e instanceof OfflineError){unreachable=true;results.push({...base,status:'SKIPPED',message:e.message});}else results.push({...base,status:'SKIPPED',message:`UNREADABLE: ${e.message}`});}
  }
  const summary=summarize(results);return {version:VERSION,profile:c.pkg?'npm':c.pyproject?'pypi':'repository',results,summary,exitCode:unreachable?3:summary.fail||options.strict&&summary.skipped?1:0};
}
export const checkRepository=check;
export default check;
