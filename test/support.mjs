import { mkdtempSync,mkdirSync,readFileSync,writeFileSync,rmSync } from 'node:fs';
import { join,dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { ROOT,CORE,BIN,NAME } from '../src/constants.mjs';
import { publicFiles,textFile,digest } from '../src/io.mjs';
export { ROOT,CORE,BIN,NAME };
export const read=file=>readFileSync(join(ROOT,file),'utf8');
export const json=file=>JSON.parse(read(file));
export function temporary(t){const dir=mkdtempSync(join(tmpdir(),'repo-build-test-'));t.after(()=>rmSync(dir,{recursive:true,force:true}));return dir;}
export function write(root,file,text){mkdirSync(dirname(join(root,file)),{recursive:true});writeFileSync(join(root,file),typeof text==='string'?text:JSON.stringify(text,null,2)+'\n');}
export function treeHash(root){return digest(publicFiles(root).sort().map(f=>f+'\0'+textFile(root,f)).join('\0'));}
export function node(args,options={}){return spawnSync(process.execPath,args,{cwd:ROOT,encoding:'utf8',...options});}
