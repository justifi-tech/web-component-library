---
"@justifi/webcomponents": patch
---

Add `useNativePaymentRequest` prop to `justifi-google-pay` for Android WebView embeds; routes Google Pay through the W3C Payment Request API instead of pay.js's `loadPaymentData` popup (blocked in WebViews, OR_BIBED_15).