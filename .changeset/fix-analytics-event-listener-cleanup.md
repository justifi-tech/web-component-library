---
"@justifi/webcomponents": patch
---

Fix event listener cleanup bug in Analytics.ts to prevent memory leaks. Event listeners are now properly removed on component disconnect by storing bound handler references in a Map.
