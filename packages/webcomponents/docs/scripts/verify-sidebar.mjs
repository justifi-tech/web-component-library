#!/usr/bin/env node
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const specifiers = [
  "@justifi/webcomponents/docs/sidebar",
  "@justifi/webcomponents/docs/helpers",
];

let hasError = false;

specifiers.forEach((specifier) => {
  try {
    const resolved = require.resolve(specifier, { paths: [process.cwd()] });
    console.log(`✔ ${specifier} resolved to ${resolved}`);
  } catch (error) {
    hasError = true;
    console.error(`✖ Unable to resolve ${specifier}`);
    console.error(error.message);
  }
});

if (hasError) {
  process.exit(1);
}

