---
"@justifi/webcomponents": minor
---

- Added new event to `payment-provisioning` component: `form-step-completed`
  - This event will be emitted at the end of every form step in the `payment-provisioning` component. 
  - Event payload contains server response, as well as the name of the completed form step.
- Noted optional fields in the `document_upload` step of the `payment-provisioning` component by adding `(optional)` to the input label. 