---
"@justifi/webcomponents": patch
---

- `justifi-tokenize-payment-method` and `justifi-checkout`: If using `disable-credit-card` or `disable-bank-account` props then the payment method radio button input will be hidden.
- `justifi-tokenize-payment-method` and `justifi-checkout`: added `validate()` method which can be programatically called on the component to trigger form validation on new card and bank account payments.