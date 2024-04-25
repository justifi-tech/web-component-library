---
"@justifi/webcomponents": minor
---

 - Made improvements to input logic and validation in address forms found in BusinessForm and PaymentProvisioning components:
   - Show `country` field in address forms for Representative and Owners. Field is disabled currently, but autofills with `USA`.
   - In BusinessForm - converted text input for `state` value to dropdown / select menu. Now matches input on PaymentProvisioning.
   - Improved validation logic for various address fields: Street Address Line 1, Street Address Line 2, City, and Postal Code
   - Postal Code fields - limited to 5 characters and numerical values only. 