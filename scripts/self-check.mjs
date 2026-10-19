import { spawnSync } from 'node:child_process';
import { check } from '../src/check/index.mjs';
import { textReport } from '../src/check/report.mjs';
const build=spawnSync(process.execPath,['scripts/build.mjs','--check'],{stdio:'inherit'});
if(build.status!==0)process.exitCode=build.status??2;
else {const r=await check('.',{house:true});console.log(textReport(r));process.exitCode=r.exitCode;}
