---
"@justifi/webcomponents": patch
---

Removed the npm registry version check that ran on every component load. It fetched `registry.npmjs.org` from the browser on every page, which produced Content-Security-Policy errors for consumers with a strict CSP and an uncaught promise rejection when the request was blocked or failed. Duplicate-version detection is unaffected — it is local and still runs, now under the clearer name `detectDuplicateVersion`.
