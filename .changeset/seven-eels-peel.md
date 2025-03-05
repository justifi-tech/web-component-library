---
"@justifi/webcomponents": patch
---

- Surface `justifi-dispute-response` file pre-signing errors in the UI
- Fix typos in `justifi-dispute-notification` messages
- Fix `justifi-dispute-response` evidence type name: `cancellation_policy_file` -> `cancellation_policy`
- Update `justifi-dispute-response` "Service Date" to use a date selector
- Clear/replace file selections in `justifi-dispute-response` when file selection changes. Change handler for file inputs has been abstracted for consistency.