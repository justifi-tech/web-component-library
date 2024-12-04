---
"@justifi/webcomponents": major
---

- Modified behavior of `submitted` event emitted from `justifi-payment-provisioning`
  - `submitted` is no longer emitted after each form step completion of the payment provisioning component. It is now emitted only once, at the end of the form flow, when a response is received from the provisioning API request. 
