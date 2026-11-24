/**
 * Render every component's props and parts table, check each one is structurally
 * intact, and write an HTML page you can open and look at.
 *
 * These tables are generated from `@Prop()` JSDoc via docs.json, so a comment can
 * break the page without touching a single .mdx file — a newline in a description
 * ends the markdown table row, truncating the table and spilling every prop below
 * it onto the page as raw text. Nothing in the normal build or test run notices.
 *
 *   node scripts/preview-tables.mjs            check only, exits 1 on a broken table
 *   node scripts/preview-tables.mjs --open     also write and open the HTML page
 *
 * Run `pnpm build` first — this reads the generated docs.json and dist/helpers.
 */
import { execFileSync } from "node:child_process";
import { existsSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = resolve(root, "tables-preview.html");
const open = process.argv.includes("--open");

for (const f of [
  "docs.json",
  "component-tree.json",
  "dist/helpers/PropsMarkdownTable.js",
]) {
  if (!existsSync(resolve(root, f))) {
    console.error(`missing ${f} — run \`pnpm build\` first`);
    process.exit(1);
  }
}

// Import the compiled helpers one by one, not through dist/helpers/index.js —
// esbuild leaves the barrel's re-exports pointing at the original .jsx paths.
const helper = (name) => import(resolve(root, `dist/helpers/${name}.js`));
const { PropsMarkdownTable } = await helper("PropsMarkdownTable");
const { PartsMarkdownTable } = await helper("PartsMarkdownTable");
const { getPropsFromDocs } = await helper("getPropsFromDocs");
const { getComponentParts } = await helper("getComponentParts");
const docsJson = (
  await import(resolve(root, "docs.json"), { with: { type: "json" } })
).default;
const treeJson = (
  await import(resolve(root, "component-tree.json"), { with: { type: "json" } })
).default;

/**
 * A rendered table is intact when every row made it inside <table> and nothing
 * leaked out after it. Both checks matter: a cell can break the table without
 * losing a row, and a lost row can hide inside a table that still closes.
 */
function check(label, html, expectedRows) {
  if (!html) return null;
  const rows = (html.match(/<tr>/g) || []).length;
  const after = (html.split("</table>")[1] || "").trim();
  if (rows === expectedRows && after === "") return null;
  return (
    `${label}: ${rows}/${expectedRows} rows` +
    (after ? `, ${after.length} chars outside the table` : "")
  );
}

const broken = [];
let body = "";

for (const { tag } of docsJson.components) {
  const props = getPropsFromDocs(tag, docsJson);
  let parts = [];
  try {
    parts = getComponentParts(tag, treeJson);
  } catch {
    // not every component is in the tree; parts are optional
  }
  if (!props.length && !parts.length) continue;

  const propsHtml = props.length
    ? renderToStaticMarkup(React.createElement(PropsMarkdownTable, { props }))
    : "";
  const partsHtml = parts.length
    ? renderToStaticMarkup(React.createElement(PartsMarkdownTable, { parts }))
    : "";

  for (const problem of [
    check(`${tag} props`, propsHtml, props.length + 1),
    check(`${tag} parts`, partsHtml, parts.length + 1),
  ]) {
    if (problem) broken.push(problem);
  }

  body += `<section><h2>${tag}</h2>${propsHtml}${partsHtml ? `<h3>Parts</h3>${partsHtml}` : ""}</section>`;
}

if (open) {
  writeFileSync(
    out,
    `<!doctype html><meta charset="utf-8"><title>Docs tables</title><style>
body{background:#111b26;color:#e6edf3;font:14px/1.6 system-ui;margin:0;padding:24px}
h2{font-size:15px;color:#f6b73c;margin:32px 0 4px}
h3{font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#8aa;margin:18px 0 4px}
table{border-collapse:collapse;width:100%;margin:8px 0 24px}
th{text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#8aa;padding:8px 12px;border-bottom:1px solid #35465c}
td{padding:8px 12px;border-bottom:1px solid #223042;vertical-align:top}
code{background:#223042;padding:2px 6px;border-radius:4px;font-size:12px}
</style>${body}`,
  );
  console.log(out);
  try {
    execFileSync("open", [out]);
  } catch {
    // headless or non-macOS — the path above is enough
  }
}

if (broken.length) {
  console.error(`\n${broken.length} broken table(s):`);
  for (const b of broken) console.error(`  ${b}`);
  console.error(
    "\nUsually a multi-line or pipe-bearing @Prop() comment. Check escapeGfmTableCell.",
  );
  process.exit(1);
}

console.log("all docs tables intact");
