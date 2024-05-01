---
"@justifi/webcomponents": patch
---

 - Added documentation support for events emitted by PaymentProvisoning component: `submitted`, and `click-event`.
 - Updated event naming for BusinessForm - `click-event` is now available to use in place of `clickEvent`. 
   - `clickEvent` is still available for now, but will be deprecated in a future release in favor of `click-event`
 - BusinessForm and PaymentProvisoning - updated docs to show `hide-errors` prop for both components. 
   - Default is `false`.
   - When set to `true` - hides error alerts from appearing in form, allowing developers more control over how they handle errors communicating from the form to the Justifi API.  