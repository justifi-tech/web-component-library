---
"@justifi/webcomponents": patch
---

- Added legend text to Business Owners form step in `PaymentProvisioning` component
  - Adjusted weight and size of legend text that heads each individial owner form rendered in this step. 
- Removed duplicated styles and ensured top level `PaymentProvisioning` and `BusinessForm` are properly contained within shadow dom. 
  - children components of `PaymentProvisioning` and `BusinessForm` share style sheets where appropriate now, to improve styling logic and remove bloat. 
