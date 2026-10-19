// A comment starts at the first " #" outside a quoted token; one forward pass keeps long runs of spaces cheap.
function stripComment(value) {
  const flow=/^[\[{]/.test(value)&&!value.startsWith('${{');
  let quote=null;
  for(let i=0;i<value.length;i++){
    const ch=value[i];
    if(quote){ if(quote==='"'&&ch==='\\')i++; else if(ch===quote)quote=null; }
    else if((ch==='"'||ch==="'")&&(i===0||flow&&/[\s,[{:]/.test(value[i-1])))quote=ch;
    else if(ch==='#'&&i>0&&/\s/.test(value[i-1]))return value.slice(0,i).trimEnd();
  }
  return value;
}
function scalar(raw) {
  const value=stripComment(raw.trim());
  if(!value) return null;
  if(/^[&*!]|^<<:/.test(value)) throw Error('YAML aliases and tags need a full reader');
  if(value==='true') return true; if(value==='false') return false;
  if(value==='null'||value==='~') return null;
  if(/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  if(value.startsWith('"')) return JSON.parse(value);
  if(value.startsWith("'")) { if(!value.endsWith("'")) throw Error('Unclosed quote'); return value.slice(1,-1).replace(/''/g,"'"); }
  if(value.startsWith('[')) { if(!value.endsWith(']')) throw Error('Unclosed list'); return value.slice(1,-1).split(',').filter(Boolean).map(scalar); }
  if(value.startsWith('{') && !value.startsWith('${{')) {
    if(!value.endsWith('}')) throw Error('Unclosed mapping');
    return Object.fromEntries(value.slice(1,-1).split(',').filter(Boolean).map(part=>{const m=part.match(/^\s*([^:]+):\s*(.*)$/);if(!m)throw Error('Bad mapping');return [scalar(m[1]),scalar(m[2])];}));
  }
  if(/:\s/.test(value) && !value.includes('${{')) throw Error('Quote values containing colon-space');
  return value;
}
export function parseWorkflow(text) {
  try { const data=JSON.parse(text); if(!data || typeof data!=='object'||Array.isArray(data)||!data.jobs||typeof data.jobs!=='object') throw Error('Expected workflow mapping'); return {data,unreadable:false}; } catch {}
  try {
    const lines=text.split(/\r?\n/); let at=0;
    const blank=()=>{while(at<lines.length && /^\s*(#.*)?$/.test(lines[at]))at++;};
    const indent=s=>s.match(/^ */)[0].length;
    function block(level,same=false) {
      blank(); if(at>=lines.length)return {};
      const array=same||lines[at].slice(level).startsWith('- '), out=array?[]:{};
      function assign(obj,body,lineIndent) {
        const m=body.match(/^([^:]+):(?:\s+(.*)|\s*)$/); if(!m)throw Error('Expected mapping');
        const key=String(scalar(m[1])), value=m[2]||'';
        if(Object.hasOwn(obj,key)) throw Error('Duplicate YAML key');
        if(/^[|>][+-]?$/.test(value.trim())) {
          const chunks=[]; const folded=value[0]==='>'; let blockIndent=null;
          while(at<lines.length && (!lines[at].trim()||indent(lines[at])>lineIndent)) {
            if(lines[at].trim() && blockIndent===null)blockIndent=indent(lines[at]);
            chunks.push(lines[at++].slice(blockIndent??lineIndent+2));
          }
          obj[key]=chunks.join(folded?' ':'\n')+'\n';
        } else if(!value || /^#/.test(value)) {
          blank();
          if(at<lines.length && indent(lines[at])>lineIndent) obj[key]=block(indent(lines[at]));
          else if(at<lines.length && indent(lines[at])===lineIndent && lines[at].slice(lineIndent).startsWith('- ')) obj[key]=block(lineIndent,true);
          else obj[key]=null;
        } else obj[key]=scalar(value);
      }
      while(true) {
        blank(); if(at>=lines.length||indent(lines[at])<level)break;
        if(indent(lines[at])!==level||lines[at].includes('\t'))throw Error('Unexpected indentation');
        const body=lines[at].slice(level);
        if(same&&!body.startsWith('- '))break;
        at++;
        if(array) {
          if(!body.startsWith('- ')) throw Error('Mixed YAML collection');
          const tail=body.slice(2);
          if(/^[^:]+:(?:\s|$)/.test(tail)) {
            const obj={}; assign(obj,tail,level+2);
            blank(); if(at<lines.length && indent(lines[at])>level) {
              const rest=block(level+2); if(Array.isArray(rest))throw Error('Expected step mapping');
              for(const [k,v] of Object.entries(rest)){if(Object.hasOwn(obj,k))throw Error('Duplicate key'); obj[k]=v;}
            }
            out.push(obj);
          } else out.push(scalar(tail));
        } else { if(body.startsWith('- ')) throw Error('Mixed mapping'); assign(out,body,level); }
      } return out;
    }
    blank(); const data=block(0); blank();
    if(at!==lines.length || Array.isArray(data) || !data.jobs || typeof data.jobs!=='object')throw Error('Expected workflow jobs');
    return {data,unreadable:false};
  } catch(e) { return {data:null,unreadable:true,error:e.message}; }
}
export function readWorkflow(file,text) {
  const parsed=parseWorkflow(text), steps=[], lines=text.split('\n'); let cursor=0;
  const lineOf=step=>{
    const needle=typeof step.uses==='string'?step.uses:typeof step.run==='string'?step.run.split('\n')[0]:null;
    if(needle===null)return 1;
    for(let i=cursor;i<lines.length;i++)if(lines[i].includes(needle)){cursor=i+1;return i+1;}
    return 1;
  };
  for(const [job,value] of Object.entries(parsed.data?.jobs||{})) {
    if(!value || typeof value!=='object')return {file,text,...parsed,unreadable:true,error:'Expected job mapping',steps:[]};
    if(value.steps!==undefined&&!Array.isArray(value.steps))return {file,text,...parsed,unreadable:true,error:'Expected steps array',steps:[]};
    for(const step of value.steps||[]){
      if(!step||typeof step!=='object'||Array.isArray(step)||step.uses!==undefined&&typeof step.uses!=='string'||step.run!==undefined&&typeof step.run!=='string')return {file,text,...parsed,unreadable:true,error:'Expected a readable workflow step',steps:[]};
      steps.push({...step,job,line:lineOf(step)});
    }
  }
  return {file,text,...parsed,steps};
}
export default parseWorkflow;
