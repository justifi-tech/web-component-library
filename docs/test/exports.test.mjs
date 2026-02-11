/**
 * Tests to verify docs package exports work correctly after build.
 * Run with: node test/exports.test.mjs
 */

import { strict as assert } from 'node:assert';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

console.log('Running docs package export tests...\n');

// Test 1: Verify dist/index.js exists
console.log('Test 1: dist/index.js exists');
const indexPath = join(rootDir, 'dist/index.js');
assert(existsSync(indexPath), 'dist/index.js should exist');
console.log('  ✓ dist/index.js exists\n');

// Test 2: Verify dist/helpers files exist
console.log('Test 2: dist/helpers files exist');
const helperFiles = [
  'dist/helpers/index.js',
  'dist/helpers/version.js',
  'dist/helpers/getPropsFromDocs.js',
  'dist/helpers/getComponentParts.js',
];
for (const file of helperFiles) {
  const filePath = join(rootDir, file);
  assert(existsSync(filePath), `${file} should exist`);
}
console.log(`  ✓ ${helperFiles.length} helper files verified\n`);

// Test 3: Verify version.js works
console.log('Test 3: version.js returns valid version');
const versionModule = await import(join(rootDir, 'dist/helpers/version.js'));
const version = versionModule.getWebcomponentsVersion();
assert(version, 'getWebcomponentsVersion should return a value');
assert(typeof version === 'string', 'version should be a string');
console.log(`  ✓ getWebcomponentsVersion returns: ${version}\n`);

// Test 4: Verify docs.json exists and is valid JSON
console.log('Test 4: docs.json exists and is valid JSON');
const docsJsonPath = join(rootDir, 'docs.json');
assert(existsSync(docsJsonPath), 'docs.json should exist');
const docsJson = JSON.parse(readFileSync(docsJsonPath, 'utf-8'));
assert(docsJson.components, 'docs.json should have components array');
assert(Array.isArray(docsJson.components), 'docs.json.components should be an array');
console.log(`  ✓ docs.json contains ${docsJson.components.length} components\n`);

// Test 5: Verify component-tree.json exists and is valid JSON
console.log('Test 5: component-tree.json exists and is valid JSON');
const componentTreePath = join(rootDir, 'component-tree.json');
assert(existsSync(componentTreePath), 'component-tree.json should exist');
const componentTree = JSON.parse(readFileSync(componentTreePath, 'utf-8'));
assert(typeof componentTree === 'object', 'component-tree.json should be an object');
console.log('  ✓ component-tree.json verified\n');

// Test 6: Verify MDX files exist
console.log('Test 6: MDX documentation files exist');
const mdxFiles = [
  'introduction.mdx',
  'entities/entities.mdx',
  'frameworks/react.mdx',
];
for (const mdxFile of mdxFiles) {
  const mdxPath = join(rootDir, mdxFile);
  assert(existsSync(mdxPath), `${mdxFile} should exist`);
}
console.log(`  ✓ ${mdxFiles.length} MDX files verified\n`);

// Test 7: Verify dist/package.json exists (for version.js)
console.log('Test 7: dist/package.json exists');
const distPackageJsonPath = join(rootDir, 'dist/package.json');
assert(existsSync(distPackageJsonPath), 'dist/package.json should exist');
console.log('  ✓ dist/package.json exists\n');

console.log('All tests passed! ✓');
