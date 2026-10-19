#!/usr/bin/env bash
# Maintainer-run after publishing. Uses existing npx, asciinema and agg tools.
# The published package runs in a temporary project outside this repository.
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
if [ "${1:-}" = --help ]; then
  printf 'Usage: scripts/record-demo.sh [published-version]\n'
  exit 0
fi
for tool in node npx asciinema agg; do
  command -v "$tool" >/dev/null || { printf 'Required tool: %s\n' "$tool" >&2; exit 2; }
done
package_name="$(cd "$repo_root" && node -p "require('./package.json').name")"
package_version="${1:-$(cd "$repo_root" && node -p "require('./package.json').version")}"
case "$package_version" in
  *[!A-Za-z0-9.+-]*|'') printf 'Use a published version number.\n' >&2; exit 2 ;;
esac
demo_work="$(mktemp -d "${TMPDIR:-/tmp}/skill-demo.XXXXXX")"
trap 'rm -rf "$demo_work"' EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
export SKILL_DEMO_NAME="$package_name"
export SKILL_DEMO_SPEC="$package_name@$package_version"
export SKILL_DEMO_WORK="$demo_work"
node --input-type=module - "$repo_root" "$demo_work" <<'CHECK'
import path from 'node:path';
import fs from 'node:fs';
const [root, work] = process.argv.slice(2).map(file => fs.realpathSync(file));
const relative = path.relative(root, work);
if (!relative || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative))) {
  throw new Error('Choose a temporary directory outside the source repository.');
}
CHECK

cat > "$demo_work/session.sh" <<'SESSION'
#!/usr/bin/env bash
set -euo pipefail
cd "$SKILL_DEMO_WORK"
mkdir project

run_package() {
  printf '\n$ npx --yes %s' "$SKILL_DEMO_SPEC"
  printf ' %s' "$@"
  printf '\n'
  local result=0
  npx --yes "$SKILL_DEMO_SPEC" "$@" > command.log 2>&1 || result=$?
  node --input-type=module - <<'DISPLAY'
import fs from 'node:fs';
const output = fs.readFileSync('command.log', 'utf8');
process.stdout.write(output.split(process.cwd()).join('<demo>'));
DISPLAY
  return "$result"
}

run_package install --host codex --dir ./project --scope project --dry-run --yes
run_package install --host codex --dir ./project --scope project --yes
printf '\n$ Read and verify the install receipt\n'
node --input-type=module - <<'RECEIPT'
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
const root = path.resolve('project');
const target = path.join(root, '.agents', 'skills');
const receipts = [];
function visit(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error('The demo install contains a symlink.');
    if (entry.isDirectory()) visit(file);
    else if (entry.name.endsWith('-receipt.json')) receipts.push(file);
  }
}
visit(target);
if (receipts.length !== 1) throw new Error('Expected one install receipt.');
const receipt = JSON.parse(fs.readFileSync(receipts[0], 'utf8'));
if (receipt.package?.name !== process.env.SKILL_DEMO_NAME || receipt.host !== 'codex'
  || receipt.scope !== 'project' || !Array.isArray(receipt.files) || !receipt.files.length) {
  throw new Error('Unexpected install receipt.');
}
for (const file of receipt.files) {
  if (path.isAbsolute(file.path) || file.path.split(/[\\/]/).includes('..')) throw new Error('Receipt path leaves the demo project.');
  const destination = path.resolve(root, file.path);
  const relative = path.relative(root, destination);
  if (!relative || relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) throw new Error('Receipt path leaves the demo project.');
  let cursor = root;
  for (const part of relative.split(path.sep)) {
    cursor = path.join(cursor, part);
    if (fs.lstatSync(cursor).isSymbolicLink()) throw new Error('Receipt target is a symlink.');
  }
  const digest = createHash('sha256').update(fs.readFileSync(destination)).digest('hex');
  if (digest !== file.sha256) throw new Error(`Read-back differs: ${relative}`);
}
console.log(`Package: ${receipt.package.name}@${receipt.package.version}`);
console.log(`Host: ${receipt.host}; scope: ${receipt.scope}`);
console.log(`Read-back verified: ${receipt.files.length} files`);
console.log(`Receipt: ${path.relative(root, receipts[0])}`);
RECEIPT
run_package uninstall --host codex --dir ./project --scope project --yes
SESSION

asciinema rec --return --output-format asciicast-v2 --window-size 100x28 \
  --idle-time-limit 1 --title "$package_name: preview, install, receipt" \
  --command 'bash "$SKILL_DEMO_WORK/session.sh"' "$demo_work/demo.cast"
agg --theme github-dark --idle-time-limit 1 --last-frame-duration 4 \
  "$demo_work/demo.cast" "$demo_work/demo.gif"
mkdir -p "$repo_root/docs"
mv "$demo_work/demo.gif" "$repo_root/docs/demo.gif"
printf 'Recorded docs/demo.gif from %s\n' "$SKILL_DEMO_SPEC"
