---
"@justifi/webcomponents": patch
---

- `BusinessForm` and `PaymentProvisioning` components: Added conditional logic to require SSN for representatives and owners if `ssn_last4` is missing or null.
  - Labels for SSN field conditionally update now. If `ssn_last4` is already defined for the given identity, the label shown will be `Change SSN (optional)` as opposed to `SSN`.

