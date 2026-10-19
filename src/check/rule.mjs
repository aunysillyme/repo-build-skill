export const fail=(file,message,line=1,extra={})=>({status:'FAIL',file,line,message,...extra});
export const skip=message=>({status:'SKIPPED',file:null,line:null,message});
export function rule(id,reader,stage,title,why,pass,run,{house=false,severity='error',mode='offline',applies=()=>true,learn}={}) {
  return {id,reader,stage,severity:house?'warn':severity,house,mode,title,why,pass,learn:learn||`references/stages/${stage}.md#gate`,applies:id.startsWith('W_')?c=>c.workflows.length>0&&applies(c):applies,run};
}
export const missingFacts=(ctx,fields)=>fields.filter(f=>ctx.facts[f]===undefined||ctx.facts[f]===null||ctx.facts[f]==='');
export function need(ctx,fields,run) {const missing=missingFacts(ctx,fields); return missing.length?[skip(`Facts required: ${missing.join(', ')}`)]:run();}
