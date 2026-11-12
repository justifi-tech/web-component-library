---
"@justifi/webcomponents": minor
---

Bootstrap no longer escapes JustiFi components into the host page.

`StyledHost` renders a full Bootstrap 5.3.3 build in a `<style>` tag. Most components are `shadow: true`, so that sheet stays inside their shadow root — but `justifi-checkout` and `plaid-verification` are light DOM, so the sheet landed in the merchant's document and its 83 bare element selectors (`a`, `h1`–`h6`, `p`, `button`, `input`, `label`, `table`, `svg`, …) applied to the entire page. Because Bootstrap's rules are unlayered, they also beat the host page's own `@layer`-ed utility classes regardless of specificity, so a merchant's link colors and headings changed just by embedding a checkout. This has been true of every 6.x release since 6.0.0.

Every selector in `styled-host.css` is now prefixed with `:where(:host, .jfi-styled-host)`, and `StyledHost` adds the matching `jfi-styled-host` class to its host element. `:where()` contributes zero specificity, so the cascade inside components is unchanged — only the set of matched elements shrinks to the component's own subtree. Verified in Chrome: across a 62-element Bootstrap sample in a shadow root, all 2,046 computed-style comparisons and all 123 `--bs-*` custom properties are identical before and after.

Two visible changes, both inside light-DOM components only:

- `justifi-checkout` and `plaid-verification` now pick up Bootstrap's theme variables, which previously resolved to nothing in the light DOM because they were declared on `:host`. Links inside them render Bootstrap blue and body text Bootstrap's grey instead of inheriting the page's defaults.
- Host pages that were relying — knowingly or not — on JustiFi's Bootstrap styling their own markup will lose it. That styling was never intended to apply.

`scripts/scope-styled-host-css.mjs` performs the transform and is idempotent; re-run it after dropping in a new stock Bootstrap build.
