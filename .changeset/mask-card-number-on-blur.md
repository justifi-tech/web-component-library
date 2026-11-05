---
"@justifi/webcomponents": patch
"@justifi/webcomponents-docs": patch
---

Add `mask-card-number` to `justifi-card-form`, `justifi-tokenize-payment-method` and `justifi-modular-checkout`. When set, the card number collapses to its last four digits once the field loses focus, with an eye toggle to reveal it again. Defaults to `false`, so existing integrations are unchanged.

The masking happens in the hosted field, which must be deployed before this ships. It is a shoulder-surfing deterrent, not a PCI control.
