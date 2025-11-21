#!/usr/bin/env node
import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);
const hasFilesFlag = args.includes("--files");

function run(command, commandArgs) {
  const result = spawnSync(command, commandArgs, {
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

if (hasFilesFlag) {
  run("node", ["packages/webcomponents/docs/scripts/check-structure.mjs", ...args]);
} else {
  run("pnpm", ["--filter", "@justifi/webcomponents", "docs:lint"]);
  run("node", ["packages/webcomponents/docs/scripts/check-structure.mjs"]);
}

