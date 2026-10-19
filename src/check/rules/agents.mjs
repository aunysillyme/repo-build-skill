import { posix } from 'node:path';
import { rule,fail } from '../rule.mjs';
import { frontmatter,headings } from '../../readers/markdown.mjs';
export function skillFindings(file,text) {
  const f=frontmatter(text), hits=[];
  if(!f) return [fail(file,'Add valid skill frontmatter.')];
  const folder=posix.basename(posix.dirname(file));
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(f.name||'')||f.name.length>64||f.name!==folder)hits.push(fail(file,'Skill name must match its folder and use lowercase words with hyphens.'));
  if(!f.description?.trim()||f.description.length>1024)hits.push(fail(file,'Skill description must contain one to 1024 characters.'));
  if(f.compatibility?.length>500)hits.push(fail(file,'Keep compatibility within 500 characters.'));
  if(text.split('\n').length>500)hits.push(fail(file,'Keep the skill router within 500 lines.'));
  return hits;
}
export default [
rule('A_AGENTS','agents','04-write','Agent instructions cover use and contribution','Agents need commands and project context.','AGENTS.md has use and contribute headings and fewer than 200 lines.',c=>{const t=c.read('AGENTS.md'),h=headings(t);return t.split('\n').length<200&&h.some(x=>/\buse\b/i.test(x.text))&&h.some(x=>/contribut/i.test(x.text))?[]:[fail('AGENTS.md','Add use and contribute sections within 200 lines.')];}),
rule('A_IMPORT','agents','04-write','One agent instruction source','An import keeps host instructions in sync.','CLAUDE.md includes the exact line @AGENTS.md.',c=>c.read('CLAUDE.md').split(/\r?\n/).includes('@AGENTS.md')?[]:[fail('CLAUDE.md','Import @AGENTS.md on its own line.')],{house:true,applies:c=>c.exists('CLAUDE.md')}),
rule('A_CMD','agents','04-write','Documented script commands exist','A command should work when copied.','Every npm run command named in AGENTS.md exists in package scripts.',c=>[...c.read('AGENTS.md').matchAll(/\bnpm\s+(?:run\s+([\w:-]+)|(test|start|stop|restart))\b/g)].filter(m=>!Object.hasOwn(c.pkg?.scripts||{},m[1]||m[2])).map(m=>fail('AGENTS.md',`Script is absent: ${m[1]||m[2]}`)),{applies:c=>Boolean(c.pkg)}),
rule('A_SKILL_SPEC','agents','03-scaffold','Skills follow the portable format','A host can identify a skill from its metadata.','Each SKILL.md has a valid name, description and size.',c=>c.files.filter(f=>/(^|\/)SKILL\.md$/.test(f)).flatMap(f=>skillFindings(f,c.read(f))),{applies:c=>c.files.some(f=>/(^|\/)SKILL\.md$/.test(f))})
];
