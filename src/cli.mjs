import { NAME,VERSION } from './constants.mjs';
export const help=`${NAME} ${VERSION}
Usage: ${NAME} [install] [--host HOST] [--scope project|user] [--dir PATH] [--yes] [--dry-run]
       ${NAME} uninstall [--host HOST] [--scope project|user] [--dir PATH] [--dry-run]
       ${NAME} check [path] [--json] [--online] [--strict] [--history] [--house]
       ${NAME} explain CODE
       ${NAME} set sync|check
       ${NAME} --help | --version
Hosts: claude-code, codex, gemini-antigravity, cursor, agents-md, chat-upload`;
export async function main(args=process.argv.slice(2),io={}) {
  try {
    if(args.length===1&&args[0]==='--help')return {code:0,message:help};
    if(args.length===1&&args[0]==='--version')return {code:0,message:VERSION};
    if(args[0]==='explain') {
      if(args.length!==2)throw Error('Usage: explain CODE');
      const {rules}=await import('./check/index.mjs');const r=rules.find(r=>r.id===args[1]);
      if(!r)throw Error('Unknown checker code.');
      return {code:0,message:`${r.id}: ${r.title}\nWhy: ${r.why}\nPass: ${r.pass}\nLearn: ${r.learn}`};
    }
    if(args[0]==='check') {
      const options={},paths=[],seen=new Set();
      for(const s of args.slice(1)){if(s.startsWith('--')){if(!['--json','--online','--strict','--history','--house'].includes(s)||seen.has(s))throw Error(`Invalid check option: ${s}`);seen.add(s);options[s.slice(2)]=true;}else paths.push(s);}
      if(paths.length>1)throw Error('Usage: check [path] [options]');
      const {check}=await import('./check/index.mjs');const report=await check(paths[0]||'.',options);
      const {textReport}=await import('./check/report.mjs');
      return {code:report.exitCode,message:options.json?JSON.stringify({version:report.version,profile:report.profile,results:report.results,...(report.error?{error:report.error}:{})},null,2):report.error||textReport(report)};
    }
    if(args[0]==='set') {
      if(args.length!==2||!['sync','check'].includes(args[1]))throw Error('Usage: set sync|check');
      const {syncSet,checkSet}=await import('./set.mjs');return args[1]==='sync'?await syncSet({root:process.cwd()}):checkSet(process.cwd());
    }
    const {runInstaller}=await import('./install.mjs');
    return await runInstaller(args,io);
  }catch(e){return {code:2,message:e.message};}
}
export default main;
