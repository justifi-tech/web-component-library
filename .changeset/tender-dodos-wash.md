---
"@justifi/webcomponents": major
---

- Web component event names are now consistently named across the entire component library, and all updated to reflect present tense naming convention. 
 - Components that emitted `submitted` event now emit `submit-event`. This includes: `justifi-payment-provisioning`, `justifi-checkout`, `justifi-tokenize-payment-method`, `justifi-dispute-management` and `justifi-business-form`.
  - NOTE: In line with this change, the `submit-event` for `justifi-tokenize-payment-method` now returns the token value as `data`, instead of `token`. Going forward, users of this component will need to access this value via event.detail.data.
 - List components that emitted events for clicking on table rows will now emit `click-event` in line with other components that emit an event for user clicks actions. This includes `justifi-payments-list`, `justifi-payouts-list`, `justifi-terminals-list`, and `justifi-checkouts-list`. These components will no longer emit `payment-row-clicked`, `payout-row-clicked`, `terminal-row-clicked`, and `checkout-row-clicked` respectively. 
  - List components will also now emit `click-event` on pagination interaction (IE - clicking on `Next` or `Previous` page)
 - Form components `justifi-payment-provisioning` and `justifi-dispute-management` now emit `complete-form-step-event` instead of `form-step-completed`
