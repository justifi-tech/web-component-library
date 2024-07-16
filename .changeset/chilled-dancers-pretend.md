---
"@justifi/webcomponents": minor
---

- Updated error handling for network requests in `PaymentProvisioning` component. 
  -Component no longer renders visible alert in cases where network requests fail. It now emits an event, `error-event`, in line with other web components, allowing implementing developers to handle server errors as they see fit. 
  - Removed prop `hideErrors` from `PaymentProvisioning` as it is no longer applicable. 