---
"@justifi/webcomponents": patch
---

- Default `justifi-season-interruption-insurance` loading state to `true`
- Move `validate` functionality to `justifi-season-interruption-insurance-core` and call it using a ref from within `justifi-season-interruption-insurance`
- Update `insurance-state.ts` exports to include `insuranceValuesStore` and `insuranceErrorsStore`
