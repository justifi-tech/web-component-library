---
"@justifi/webcomponents": minor
---

Bootstrap no longer escapes JustiFi components into the host page.

`StyledHost` renders a full Bootstrap 5.3.3 build in a `<style>` tag. Most components are `shadow: true`, so that sheet stays inside their shadow root — but `justifi-checkout` and `plaid-verification` are light DOM, so the sheet landed in the merchant's document and its 83 bare element selectors (`a`, `h1`–`h6`, `p`, `button`, `input`, `label`, `table`, `svg`, …) applied to the entire page. Because Bootstrap's rules are unlayered, they also beat the host page's own `@layer`-ed utility classes regardless of specificity, so a merchant's link colors and headings changed just by embedding a checkout. This has been true of every 6.x release since 6.0.0.

Every selector in `styled-host.css` is now scoped to `:host, .jfi-styled-host`, and `StyledHost` adds the matching `jfi-styled-host` class to its host element. Descendant selectors take the `:where()` form, which contributes zero specificity, so `p` is still (0,0,1) exactly as in an unscoped build. The four rules whose subject is the root itself take `:is()` instead — they carried `:host`'s own (0,1,0) before scoping, and `:where()` would have dropped them under every bare-element rule, which is visible for direct children of a `StyledHost` (a direct-child `<p>` would have taken Bootstrap's `margin-bottom: 1rem`). The cascade inside a component is therefore unchanged; only the set of matched elements shrinks to the component's own subtree. Verified in Chrome: across a 62-element Bootstrap sample in a shadow root, all 2,046 computed-style comparisons and all 123 `--bs-*` custom properties are identical before and after.

Three visible changes, all inside light-DOM components only:

- `justifi-checkout` and `plaid-verification` now pick up Bootstrap's theme variables, which previously resolved to nothing in the light DOM because they were declared on `:host`. Links inside them render Bootstrap blue and body text Bootstrap's grey instead of inheriting the page's defaults.
- For the same reason, those two now also get Bootstrap's root reset on their direct children (`margin: 0`, body font and color), which until now only shadow-DOM components received. The two rendering paths are the same again.
- Host pages that were relying — knowingly or not — on JustiFi's Bootstrap styling their own markup will lose it. That styling was never intended to apply.

Bootstrap dark mode keeps working from outside the component: `[data-bs-theme='dark']` is matched on the component element itself and on any ancestor of it, as well as on descendants, so a merchant who sets it on `<html>` still gets the dark palette in `justifi-checkout` and `plaid-verification`. Shadow-DOM components are unaffected either way — they declared the light palette on `:host` before this change too.

The stylesheet is a checked-in vendored Bootstrap build that this repo does not track upstream, so the prefixing is a one-time rewrite of that file rather than a build step.
