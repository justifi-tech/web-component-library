---
"@justifi/webcomponents": minor
---

- `PaymentProvisioning` component now attempts to make POST request to provision payments product once the terms and conditions form step has been completed. 
- Upon response from the provisioning request, the component will emit `submitted` event. 
- When loading the component for a business that has already submitted a provisioning request, an `error-event` will be emitted with the error code: `provisioning-already-requested`, and the form buttons will be disabled. 