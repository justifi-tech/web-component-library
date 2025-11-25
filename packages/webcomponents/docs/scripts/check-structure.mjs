#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const REQUIRED_FRONTMATTER_KEYS = [
  'id',
  'title',
  'description',
  'sidebar_position',
];
const REQUIRED_SECTIONS = [
  '## Overview',
  '## Usage',
  '## Props, Events & Methods',
  '## Theming & Layout',
  '## Accessibility',
  '## Static examples',
];

const args = process.argv.slice(2);
const filesFlagIndex = args.indexOf('--files');
let files = [];

if (filesFlagIndex !== -1) {
  const value = args[filesFlagIndex + 1];
  if (!value) {
    console.error('Missing value for --files flag.');
    process.exit(1);
  }
  files = value
    .split(',')
    .map((file) => file.trim())
    .filter(Boolean);
}

if (!files.length) {
  const fixturesDir = path.resolve(
    'packages/webcomponents/docs/templates/__fixtures__'
  );
  files = fs
    .readdirSync(fixturesDir)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => path.join(fixturesDir, file));
}

let hasErrors = false;

files.forEach((filePath) => {
  const absolutePath = path.resolve(filePath);
  if (!fs.existsSync(absolutePath)) {
    console.error(`✖ File not found: ${filePath}`);
    hasErrors = true;
    return;
  }

  const content = fs.readFileSync(absolutePath, 'utf8');
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

  if (!frontmatterMatch) {
    console.error(`✖ Missing frontmatter block: ${filePath}`);
    hasErrors = true;
    return;
  }

  const frontmatterLines = frontmatterMatch[1]
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const frontmatterKeys = frontmatterLines.map((line) =>
    line.split(':')[0].trim()
  );

  REQUIRED_FRONTMATTER_KEYS.forEach((key) => {
    if (!frontmatterKeys.includes(key)) {
      console.error(`✖ Missing frontmatter key \\"${key}\\" in ${filePath}`);
      hasErrors = true;
    }
  });

  const missingSections = REQUIRED_SECTIONS.filter(
    (section) => !content.includes(section)
  );

  if (missingSections.length) {
    console.error(
      `✖ Missing required sections in ${filePath}: ${missingSections.join(', ')}`
    );
    hasErrors = true;
  } else {
    console.log(`✔ ${filePath} passed structure checks.`);
  }
});

if (hasErrors) {
  process.exit(1);
}
