/**
 * Every custom event name the library emits, in one place.
 *
 * Before this existed the names were string literals repeated across 131
 * `@Event()` declarations, plus a second hardcoded list in `api/Analytics.ts`.
 * Renaming anything meant finding every copy.
 *
 * One catch worth knowing before you use these: Stencil evaluates the
 * `@Event()` decorator statically at build time, so it CANNOT resolve an
 * imported constant. Writing `@Event({ eventName: INTERNAL_EVENTS.FOO })`
 * compiles without a warning and silently falls back to the property name.
 * Decorators must spell the literal out; everything else (addEventListener,
 * analytics, tests) should import from here. `api/test/event-containment.spec.ts`
 * is what keeps the literals and this file from drifting apart.
 */

/**
 * Merchant-facing events. The name IS the contract — renaming one is a
 * breaking change, so these keep bubbling and composing to the host page.
 *
 * These are the names as they ship today. A follow-up PR adds a `justifi-`
 * prefixed, kebab-case, suffix-free sibling for each one (`error-event` ->
 * `justifi-error`) and emits both until the next major, at which point the
 * names below become the legacy set and are removed.
 */
export const PUBLIC_EVENTS = {
  ERROR: 'error-event',
  CLICK: 'click-event',
  SUBMIT: 'submit-event',
  COMPLETE_FORM_STEP: 'complete-form-step-event',
  RECORD_CLICK: 'record-click-event',
  CHECKOUT_CHANGED: 'checkout-changed',
  CHECKOUT_LOADED: 'loaded',
  CHECKOUT_COMPLETED: 'checkout-completed',
  CHECKOUT_EXPIRED: 'checkout-expired',
  INSURANCE_UPDATED: 'insurance-updated',
  PAYMENT_METHOD_OPTION_SELECTED: 'paymentMethodOptionSelected',
  PLAID_ERROR: 'plaidError',
  PLAID_ERROR_RECOVERED: 'plaidErrorRecovered',
  PLAID_VERIFICATION_SUCCESS: 'plaidVerificationSuccess',
  PLAID_VERIFICATION_ERROR: 'plaidVerificationError',
  APPLE_PAY_STARTED: 'applePayStarted',
  APPLE_PAY_COMPLETED: 'applePayCompleted',
  APPLE_PAY_CANCELLED: 'applePayCancelled',
  APPLE_PAY_ERROR: 'applePayError',
  GOOGLE_PAY_STARTED: 'googlePayStarted',
  GOOGLE_PAY_COMPLETED: 'googlePayCompleted',
  GOOGLE_PAY_CANCELLED: 'googlePayCancelled',
  PAYPAL_STARTED: 'paypalStarted',
  PAYPAL_COMPLETED: 'paypalCompleted',
  PAYPAL_CANCELLED: 'paypalCancelled',
  PAYPAL_ERROR: 'paypalError',
} as const;

/**
 * Component-to-component plumbing. Contained: every emitter declares
 * `bubbles: false, composed: false`, so these never reach the merchant's page
 * and can be renamed freely.
 *
 * Consume one by listening on the emitting element directly — a JSX `onX` prop
 * or `addEventListener` on a ref. Never `@Listen`, which binds to the host and
 * needs the event to bubble.
 */
export const INTERNAL_EVENTS = {
  FORM_CONTROL_INPUT: 'form-control-input',
  FORM_CONTROL_BLUR: 'form-control-blur',
  FORM_LOADING: 'form-loading',
  FORM_COMPLETED: 'form-completed',
  OWNER_SUBMITTED: 'owner-submitted',
  POPPER_SHOW: 'popper-show',
  POPPER_HIDE: 'popper-hide',
  RADIO_CLICK: 'radio-click',
  CHECKBOX_CHANGED: 'checkbox-changed',
  FILE_SELECTED: 'file-selected',
  IFRAME_LOADED: 'iframe-loaded',
  SELECTED_QUANTITY_CHANGE: 'selected-quantity-change',
} as const;

export type PublicEventName = (typeof PUBLIC_EVENTS)[keyof typeof PUBLIC_EVENTS];
export type InternalEventName = (typeof INTERNAL_EVENTS)[keyof typeof INTERNAL_EVENTS];
