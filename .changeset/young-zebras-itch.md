---
"@justifi/webcomponents": minor
---

- `PaymentProvisioning` component now attempts to make POST request to provision payments product once the terms and conditions form step has been completed. 
- Upon successful response from the provisioning request, the component will now emit `provision-submitted` event. 
- When loading the component for a business that has already submitted a provisioning request, an `error-event` will be emitted with the error code: `provision-already-requested`, and the form buttons will be disabled. 