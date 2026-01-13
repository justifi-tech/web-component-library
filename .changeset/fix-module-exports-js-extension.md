---
"@justifi/webcomponents": patch
---

Support module imports with or without `.js` file extension

Adds backwards compatibility for imports from `/dist/module` to work both with and without the `.js` suffix. Both of the following import styles now work:

```js
// With .js extension
import '@justifi/webcomponents/dist/module/justifi-checkout.js';

// Without .js extension
import '@justifi/webcomponents/dist/module/justifi-checkout';
```
