import { jsonOptional } from './io.mjs';
import { readManifests } from './readers/manifests.mjs';
export function readFacts(root) {
  const explicit=jsonOptional(root,'.repo-build/facts.json');
  if(explicit) return explicit;
  const {pkg,pyproject}=readManifests(root), p=pyproject?.project;
  if(pkg) return {name:pkg.name,description:pkg.description,homepage:pkg.homepage,repository:typeof pkg.repository==='string'?pkg.repository:pkg.repository?.url,keywords:pkg.keywords,bin:pkg.bin,registry:'npm'};
  return p?{name:p.name,description:p.description,homepage:p.urls?.Homepage,repository:p.urls?.Repository,keywords:p.keywords,bin:p.scripts,registry:'pypi'}:{};
}
export default readFacts;
