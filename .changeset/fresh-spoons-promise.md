---
"@justifi/webcomponents": patch
---

- Added table to document upload form step in `PaymentProvisioning` component - shows already uploaded documents
- Adjusted validation logic for document upload form step to take into account already uploaded documents
  - Example: If a document, such as `voided_check`, has already been uploaded, then form validation will NOT fire and user will NOT be required to submit a new document to proceed. 