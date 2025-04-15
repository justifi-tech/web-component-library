---
"@justifi/webcomponents": patch
---

`justifi-tokenize-payment-method` and `justifi-checkout`: Add new boolean prop `hide-bank-account-billing-form` which can be used to hide the billing form entirely when entering new bank account payment methods. While this prop will hide the inputs, account holder address information may still be required to successfully tokenize a new bank account payment method. Developers choosing to implement this new prop will need to programitcally call the `fillBillingForm` method on the component to successfully supply address information to the tokenize request payload.
