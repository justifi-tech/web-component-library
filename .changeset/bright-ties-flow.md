---
"@justifi/webcomponents": minor
---

 - Repaired business-form-stepped component so it can be used to manage business/entity data:
  - Refactor each form step inside business-form-stepped to act as individual form, handle data retrieval and submission independent of their parent component.
  - Re-implement form step to business-form-stepped that manages owner data.
    - Owner identities are now updated using sub forms that use the `identities` endpoint
    - Upon submit the `business-owner-form-step` component patches the list of identity IDs associated with the business
    - On the owner form step creating or editing an owner will emit a submitted event
  - If fetching or patching business data returns a server error an alert dialog is shown at the top of current step in business-form-stepped
  - Completing a form step in business-form-stepped emits a submitted event which contains a metadata property used to specify which form step was completed
