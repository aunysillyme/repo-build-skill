import { jsonOptional, readOptional } from '../io.mjs';
import { parseToml } from './toml-narrow.mjs';
export function readManifests(root) {
  const pkg=jsonOptional(root,'package.json');
  const py=readOptional(root,'pyproject.toml');
  let pyproject=null,pyprojectError=null;
  if(py){try{pyproject=parseToml(py);}catch(e){pyprojectError=e.message;}}
  return {pkg,pyproject,pyprojectError};
}
export default readManifests;
