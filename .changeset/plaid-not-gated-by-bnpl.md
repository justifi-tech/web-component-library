---
"@justifi/webcomponents": patch
---

`disable-bnpl` no longer hides Plaid in `justifi-checkout`. The flag now gates only Sezzle, the BNPL method — Plaid stays visible whenever the checkout API offers it. `availablePaymentMethods` also mirrors the API response verbatim again; the prop is applied at render time instead of filtering the API list.
