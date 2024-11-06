---
"@justifi/webcomponents": minor
---

- Added new event to `payment-provisioning` component: `form-step-completed`
  - This event will be emitted at the end of every form step in the `payment-provisioning` component. 
  - Event payload contains server response, as well as the name of the completed form step.
