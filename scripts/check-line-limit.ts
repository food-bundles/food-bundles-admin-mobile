import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';

const ROOT = join(__dirname, '..', 'src');
const LIMIT = 200;
const EXTENSIONS = new Set(['.ts', '.tsx']);

function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    const stats = statSync(full);
    if (stats.isDirectory()) return walk(full);
    if (!EXTENSIONS.has(extname(full))) return [];
    return [full];
  });
}

function countLines(path: string): number {
  const content = readFileSync(path, 'utf8');
  return content.split('\n').length;
}

function main(): void {
  const files = walk(ROOT);
  const offenders = files
    .map((path) => ({ path, lines: countLines(path) }))
    .filter((file) => file.lines > LIMIT);

  if (offenders.length === 0) {
    console.log(`check-line-limit: ${files.length} files checked, all ≤ ${LIMIT} lines.`);
    return;
  }

  console.error(`check-line-limit: ${offenders.length} file(s) exceed ${LIMIT} lines:`);
  offenders
    .sort((a, b) => b.lines - a.lines)
    .forEach((file) => console.error(`  ${file.lines}\t${file.path}`));
  process.exit(1);
}

main();
