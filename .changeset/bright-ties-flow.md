---
"@justifi/webcomponents": minor
---

 - Renamed BusinessFormStepped component to PaymentProvisioning
 - Repaired PaymentProvisioning component so it can be used to manage business/entity data:
  - Refactor each form step inside PaymentProvisioning to act as individual form, handle data retrieval and submission independent of their parent component.
  - Fixes bug where form steps are broken if received data is null.  
  - In the business address step - updated text input for State to dropdown menu with State options with improved validation
  - Re-implement form step to PaymentProvisioning that manages owner data.
    - Owner identities are now updated using sub forms that use the `identities` endpoint
    - Upon submit the `business-owner-form-step` component patches the list of identity IDs associated with the business
    - On the owner form step creating or editing an owner will emit a submitted event
  - If fetching or patching business data returns a server error an alert dialog is shown at the top of current step in PaymentProvisioning
  - Completing a form step in PaymentProvisioning emits a submitted event which contains a metadata property used to specify which form step was completed
