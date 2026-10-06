---
"@justifi/webcomponents": patch
---

Sezzle (BNPL) checkouts now work. Before this fix, submitting with Sezzle selected failed with "Payment token not found." because the Sezzle popup was never opened. `justifi-modular-checkout` now opens the Sezzle popup on submit and, once the customer approves, completes the checkout with `payment_mode: bnpl` and no payment token. If the customer cancels, submitting resets with no error, and a Sezzle failure emits an `error-event`. `justifi-sezzle-payment-method` loads the Sezzle SDK reliably (including when it is already on the page), updates the installment plan when the amount changes, and supports retrying after a cancel. `justifi-save-new-payment-method` is hidden while Sezzle is selected.
