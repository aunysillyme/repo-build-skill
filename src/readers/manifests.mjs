import { jsonOptional, readOptional } from '../io.mjs';
import { parseToml } from './toml-narrow.mjs';
export function readManifests(root) {
  const pkg=jsonOptional(root,'package.json');
  const py=readOptional(root,'pyproject.toml');
  return {pkg,pyproject:py?parseToml(py):null};
}
export default readManifests;
