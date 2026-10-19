import { mkdirSync,writeFileSync,readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { generated,manifest,CORE } from '../src/bundle.mjs';
import { readOptional,read,owned,digest } from '../src/io.mjs';
import { renderSet } from '../src/set.mjs';
const args=process.argv.slice(2),root=process.cwd();
try {
  if(args.some(x=>x.startsWith('--')&&!['--check','--terms','--rehash'].includes(x)))throw Error('Usage: build [--check] [--terms] [--rehash asset ...]');
  const check=args.includes('--check');
  if(check&&(args.includes('--terms')||args.includes('--rehash')))throw Error('--check does not write hashes.');
  const out=generated(root);let drift=false;
  for(const [file,body]of Object.entries(out)){if(readOptional(root,file)!==body){if(check){console.error(`DRIFT ${file}`);drift=true;}else{const full=owned(root,file,false);mkdirSync(dirname(full),{recursive:true});writeFileSync(full,body);}}}
  if(readOptional(root,'.repo-build/set.json')){const result=renderSet({root,check});if(result.code) {if(check)drift=true;else throw Error(result.message);}}
  if(args.includes('--terms')) {
    const tokens=s=>s.toLowerCase().split(/[^a-z0-9_.@~\/\p{L}\p{N}\p{S}-]+/u).map(x=>x.replace(/^\.+|\.+$/g,'')).filter(Boolean);
    const hashes=read(root,'.repo-build/private.local.txt').split(/\r?\n/).map(s=>s.trim()).filter(s=>s&&!s.startsWith('#')&&!s.startsWith('re:')&&!s.startsWith('allow:')).map(s=>digest(tokens(s).join(' ')));
    writeFileSync(owned(root,'test/terms.private.sha256',false),[...new Set(hashes)].sort().join('\n')+'\n');
  }
  if(args.includes('--rehash')) {
    const paths=args.slice(args.indexOf('--rehash')+1);if(!paths.length||paths.some(p=>p.startsWith('--')))throw Error('--rehash needs asset paths.');
    const m=manifest(root),updates=paths.map(path=>{const asset=m.assets.find(a=>a.path===path);if(!asset)throw Error(`Unknown asset: ${path}`);return [asset,digest(readFileSync(owned(root,`${CORE}/${path}`)))];});
    for(const [asset,sha256]of updates)asset.sha256=sha256;
    writeFileSync(owned(root,`${CORE}/manifest.json`),JSON.stringify(m,null,2)+'\n');
  }
  process.exitCode=drift?1:0;
}catch(e){console.error(e.message);process.exitCode=2;}
