---
"@justifi/webcomponents": minor
---

 - Repaired business-form-stepped component so it can be used to manage business/entity data.
 - Refactor each form step inside business-form-stepped to act as individual form, handle data retrieval and submission independent of their parent component.
 - Re-implement form step to business-form-stepped that manages owner data - refactored and fixed bugs that prevented changes to business owners.
 - If fetching or patching business data returns a server error - alert dialog is shown at the top of current step in business-form-stepped
 - Completing a form step in business-form-stepped emits a submitted event
 - Submitted event for business-form-stepped now contains a metadata property - currently used to specify which form step was completed
 - On the owner form step - Creating or editing an owner will also emit a submitted event
