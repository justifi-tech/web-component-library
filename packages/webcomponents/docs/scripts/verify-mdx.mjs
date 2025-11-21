#!/usr/bin/env node
import { createRequire } from 'node:module';
import fs from 'node:fs';

const require = createRequire(import.meta.url);
const mdxSpecifier =
  '@justifi/webcomponents/docs/components/tokenize-payment-method.mdx';

try {
  const resolved = require.resolve(mdxSpecifier, { paths: [process.cwd()] });
  fs.accessSync(resolved, fs.constants.R_OK);
  console.log(`✔ ${mdxSpecifier} resolved to ${resolved}`);
} catch (error) {
  console.error(`✖ Unable to resolve ${mdxSpecifier}`);
  console.error(error.message);
  process.exit(1);
}
