/**
 * Scopes styled-host.css so Bootstrap cannot escape the StyledHost subtree.
 *
 * styled-host.css is a vendored Bootstrap build. `justifi-checkout` and
 * `plaid-verification` render StyledHost in the LIGHT DOM, so every unscoped
 * selector in it (`a`, `h1`-`h6`, `p`, `.btn`, ...) applies to the merchant's
 * whole page. This prefixes every selector with a scope root.
 *
 * The prefix uses :where(), which contributes ZERO specificity, so the cascade
 * inside components is unchanged -- only the set of matched elements shrinks.
 *
 * Idempotent. After upgrading Bootstrap, drop in the stock build and re-run:
 *   node scripts/scope-styled-host-css.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const CSS = path.join(HERE, '../src/ui-components/styled-host/styled-host.css');

// :host matches in shadow roots; .jfi-styled-host matches the light-DOM host.
const SCOPE = ':where(:host, .jfi-styled-host)';

const inKeyframes = (rule) => {
  for (let p = rule.parent; p; p = p.parent) {
    if (p.type === 'atrule' && /keyframes$/.test(p.name)) return true;
  }
  return false;
};

const scopeSelector = (sel) => {
  const s = sel.trim();
  if (s.startsWith(SCOPE)) return s; // already scoped
  // Universal selectors must cover the scope root itself AND its descendants.
  const universal = s.match(/^\*(::?[a-z-]+)?$/);
  if (universal) {
    const pseudo = universal[1] ?? '';
    return `${SCOPE}${pseudo}, ${SCOPE} *${pseudo}`;
  }
  // Rules already anchored to the host: swap :host for the scope root so they
  // also apply when StyledHost is in the light DOM.
  if (s === ':host' || s.startsWith(':host:') || /^:host\s*[>+~ ]/.test(s)) {
    return SCOPE + s.slice(':host'.length);
  }
  return `${SCOPE} ${s}`;
};

const css = fs.readFileSync(CSS, 'utf8');
const root = postcss.parse(css, { from: CSS });

let rules = 0;
let skipped = 0;
root.walkRules((rule) => {
  if (inKeyframes(rule)) { skipped++; return; }
  rule.selectors = rule.selectors.map(scopeSelector);
  rules++;
});

const out = root.toString();

// --- invariants -------------------------------------------------------------
const decls = (src) => { let n = 0; postcss.parse(src, { from: CSS }).walkDecls(() => n++); return n; };
const ruleCount = (src) => { let n = 0; postcss.parse(src, { from: CSS }).walkRules(() => n++); return n; };
const atRules = (src) => { let n = 0; postcss.parse(src, { from: CSS }).walkAtRules(() => n++); return n; };

const checks = [
  ['declaration count', decls(css), decls(out)],
  ['rule count', ruleCount(css), ruleCount(out)],
  ['at-rule count', atRules(css), atRules(out)],
];
for (const [what, before, after] of checks) {
  if (before !== after) throw new Error(`${what} changed: ${before} -> ${after}`);
}

postcss.parse(out, { from: CSS }).walkRules((rule) => {
  if (inKeyframes(rule)) return;
  for (const s of rule.selectors) {
    if (!s.trim().startsWith(SCOPE)) throw new Error(`unscoped selector survived: ${s}`);
  }
});

fs.writeFileSync(CSS, out);
console.log(`scoped ${rules} rules (${skipped} keyframe rules untouched) -> ${path.relative(process.cwd(), CSS)}`);
