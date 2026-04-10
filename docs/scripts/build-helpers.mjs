import { build } from 'esbuild';
import { cpSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// 1. Transpile all helpers
await build({
  // Only globs that match files today (empty globs make esbuild warn)
  entryPoints: ['helpers/**/*.jsx', 'helpers/**/*.js'],
  outdir: 'dist/helpers',
  format: 'esm',
  jsx: 'automatic',
  platform: 'node',
  target: 'es2020',
  absWorkingDir: root,
});

// 2. Write cleaned package.json to dist/ (for consumers)
const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
delete pkg.scripts;
delete pkg.devDependencies;
mkdirSync(resolve(root, 'dist'), { recursive: true });
writeFileSync(resolve(root, 'dist/package.json'), JSON.stringify(pkg, null, 2));

// 3. Copy mocks
cpSync(resolve(root, 'mocks'), resolve(root, 'dist/mocks'), { recursive: true });
