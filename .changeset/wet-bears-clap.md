---
"@justifi/webcomponents": patch
---

Fix hide billing form props in `tokenize-payment-method component`. The `hide-card-billing-form` and `hide-bank-account-billing-form` props now properly control field visibility by using conditional rendering instead of hidden attributes, and added comprehensive test coverage for all billing form scenarios.
