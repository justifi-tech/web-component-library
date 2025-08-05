---
"@justifi/webcomponents": patch
---

Fixes issues with hide billing form props on `tokenize-payment-method component`. The `hide-card-billing-form` and `hide-bank-account-billing-form` props now properly control field visibility by using conditional rendering instead of hidden attributes, and added comprehensive test coverage for all billing form scenarios. The `postal_code` field is required for tokenizing cards and `account_owner_name` ("Full Name") is required for tokenizing bank accounts, and required fields will always be displayed.
