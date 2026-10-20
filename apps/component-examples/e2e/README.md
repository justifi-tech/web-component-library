# E2E Testing Guide

This guide covers patterns, helpers, and conventions for writing Playwright E2E tests for JustiFi web components.

## Setup

- **Framework**: Playwright v1.58+
- **Config**: `apps/component-examples/playwright.config.ts`
- **Base URL**: `http://localhost:3000` (Express server serving example pages)
- **Browser**: Chromium (Desktop Chrome)
- **Timeout**: 90s per test, 15s per `expect` (the 5s default is too tight for assertions that wait on a real API)
- **Parallelism**: `fullyParallel` — 4 workers on CI, 1 retry on CI
- **Traces**: Retained on failure for debugging

### Running Tests

```bash
pnpm test:e2e              # All tests
pnpm test:e2e:ui           # Interactive UI mode
pnpm test:e2e:headed       # Visible browser
```

---

## Architecture

Each test targets a **component example page** served by Express at `apps/component-examples/examples/`. These pages load the web component library and initialize components with auth tokens.

```
Test spec → navigates to → /checkout (example page)
                            ↓
                    justifi-checkout component
                            ↓
                    Hosted iframes for PCI fields
                    (card number, CVV, routing number, etc.)
```

**Key architectural detail**: Payment input fields (card number, expiration, CVV, routing/account numbers) are rendered inside **hosted iframes** for PCI compliance. You cannot interact with them using regular Playwright selectors — use the `fillIframeInput()` helper.

---

## Helpers (`helpers.ts`)

Import from `./helpers` in every test file:

```typescript
import { fillIframeInput, waitForComponent, listenForErrorEvent, TEST_DATA } from './helpers';
```

### `fillIframeInput(page, iframeName, value)`

Fills an input inside a hosted iframe identified by its `name` attribute.

```typescript
await fillIframeInput(page, 'cardNumber', TEST_DATA.card.number);
await fillIframeInput(page, 'routingNumber', TEST_DATA.bankAccount.routingNumber);
```

**Iframe names available**:
- Card: `cardNumber`, `expirationMonth`, `expirationYear`, `CVV`
- Bank: `routingNumber`, `accountNumber`

### `waitForComponent(page, tagName)`

Waits for the component's Stencil `hydrated` class. Iframe readiness is separate — `fillIframeInput()` / `waitForIframeInput()` handle that.

```typescript
await waitForComponent(page, 'justifi-checkout');
await waitForComponent(page, 'justifi-tokenize-payment-method');
```

**Always call this after `page.goto()`** before interacting with the component.

### `waitForIframeInput(page, iframeName)` / `waitForCardForm(page)` / `waitForBankAccountForm(page)`

Waits for hosted iframes to be **loaded**, not merely present. `waitForCardForm` and `waitForBankAccountForm` wait for every iframe of that form; prefer them over a single `waitForIframeInput` when you are about to call a component method, since the frames load independently.

These are also the signal that a payment-method toggle finished — the bank iframes only exist on the bank form, the card iframes only on the card form.

> ⚠️ **`validate()` and `tokenize()` hang — they do not fail — if the frames are not ready.**
> Both postMessage into the hosted field and await a reply with **no timeout**, so talking to a frame whose script has not registered its listener yet produces a 90-second test timeout rather than a readable error. `iframe-input` renders its wrapper as `visibility: hidden; height: 0` until the frame reports `iframeLoaded`, so **the iframe element becoming visible in the parent document** is the readiness signal these helpers use. Checking the input *inside* the frame is not enough: Playwright computes that visibility in the frame's own document, where it is visible long before the parent un-hides it.

### `waitForTableRows(page, tagName)` / `waitForTableRowChange(page, tagName, previousText)`

For list components. The table renders a single-cell `loading-state` / `empty-state` / `error-state` row while it has no data, so a row merely existing proves nothing. `waitForTableRows` waits for a real data row; `waitForTableRowChange` waits for the first row to settle on different content, ignoring the loading row that renders mid-fetch (asserting `not.toHaveText(previous)` on its own passes on that loading row).

### `waitForFieldsValid(page, tagName)`

Polls the component's own `validate()` until it reports valid. Hosted fields report their state back to the host component asynchronously, so a successful `fill()` does not mean the component has registered the value yet. Use this between filling a form and triggering tokenization.

### `listenForErrorEvent(page, componentName)`

Returns a promise that resolves when the component logs a console error event. Used with `Promise.race()` to detect failures during async operations.

**This only works if the example page logs a matching message.** The helper matches a console message of type `error` whose text contains `[<component-tag>] error-event`, so the page's listener must be:

```javascript
component.addEventListener('error-event', (event) => {
  console.error('[justifi-your-component] error-event', event.detail);
});
```

A page that logs `console.log(event)` produces the text `JSHandle@object`, which never matches — the returned promise then hangs forever and a `Promise.race()` built on it degrades into a 90-second test timeout instead of a readable failure. Likewise, have the page's `submit-event` listener call `console.log('submit-event', event.detail)` unconditionally, so `listenForSubmitEvent()` still resolves when the response carries an error rather than data.

Do not race `listenForErrorEvent()` against a step whose failure is intentionally mocked — the expected `error-event` will win the race and fail the test.

```typescript
const errorPromise = listenForErrorEvent(page, 'justifi-checkout');
const responsePromise = page.waitForResponse(/* ... */);

const result = await Promise.race([
  responsePromise.then(resp => ({ type: 'success' as const, resp })),
  errorPromise.then(err => ({ type: 'error' as const, err })),
]);

if (result.type === 'error') {
  throw new Error(`Operation failed: ${result.err}`);
}
```

---

## Test Data (`TEST_DATA`)

Predefined constants for all test scenarios:

```typescript
TEST_DATA.card.number           // '4242424242424242' (Visa test card)
TEST_DATA.card.expirationMonth  // '11'
TEST_DATA.card.expirationYear   // '30'
TEST_DATA.card.expiration       // '11/30'
TEST_DATA.card.cvv              // '123'

TEST_DATA.bankAccount.routingNumber  // '110000000'
TEST_DATA.bankAccount.accountNumber  // '000123456789'

TEST_DATA.postalCodes.minneapolis    // '55114'
TEST_DATA.postalCodes.newYork        // '10001'
TEST_DATA.postalCodes.losAngeles     // '90001'

TEST_DATA.billingAddress.line1       // '123 Main St'
TEST_DATA.billingAddress.line2       // 'Apt 4'
TEST_DATA.billingAddress.city        // 'Minneapolis'
TEST_DATA.billingAddress.state       // 'MN'
TEST_DATA.billingAddress.postalCode  // '55114'
TEST_DATA.billingAddress.country     // 'US'
```

**Always use `TEST_DATA` constants** — never hardcode test values directly.

---

## Common Patterns

### 1. Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { waitForComponent, fillIframeInput, TEST_DATA } from './helpers';

test.describe('Component Name', () => {
  test('should do something', async ({ page }) => {
    // 1. Navigate to example page
    await page.goto('/example-page');
    await waitForComponent(page, 'justifi-component-name');

    // 2. Interact with the component
    // ... (see patterns below)

    // 3. Assert expected outcome
    expect(result).toBe(expected);
  });
});
```

### 2. Filling Payment Forms

**Credit card**:
```typescript
await page.getByRole('radio', { name: 'New credit or debit card' }).click();
await fillIframeInput(page, 'cardNumber', TEST_DATA.card.number);
await fillIframeInput(page, 'expirationMonth', TEST_DATA.card.expirationMonth);
await fillIframeInput(page, 'expirationYear', TEST_DATA.card.expirationYear);
await fillIframeInput(page, 'CVV', TEST_DATA.card.cvv);
// Postal code is NOT in an iframe
await page.getByRole('textbox', { name: 'Postal Code' }).fill(TEST_DATA.postalCodes.minneapolis);
```

**Bank account**:
```typescript
await page.getByRole('radio', { name: 'New bank account' }).click();
await waitForIframeInput(page, 'routingNumber'); // the form switch finished
await fillIframeInput(page, 'routingNumber', TEST_DATA.bankAccount.routingNumber);
await fillIframeInput(page, 'accountNumber', TEST_DATA.bankAccount.accountNumber);
```

### 3. Intercepting API Responses

Monitor API calls to verify the component makes correct requests:

```typescript
const responsePromise = page.waitForResponse(
  (resp) =>
    resp.url().includes('/v1/checkouts/') &&
    resp.url().endsWith('/complete') &&
    resp.request().method() === 'POST',
);

await page.getByRole('button', { name: 'Pay', exact: true }).click();

const response = await responsePromise;
const body = await response.json();

expect(response.status()).toBe(201);
expect(body.data.id).toMatch(/^chc_/);
```

### 4. Mocking API Failures

Use `page.route()` to simulate backend errors:

```typescript
await page.route(
  '**/v1/checkouts/*/complete',
  async (route) => route.abort('failed'),
);
```

### 5. Calling Component Methods via `page.evaluate()`

Web components expose public methods (e.g., `validate()`, `fillBillingForm()`):

```typescript
const result = await page.evaluate(async () => {
  const el = document.querySelector('justifi-checkout');
  return el ? await (el as any).validate() : null;
});

expect(result).not.toBeNull();
expect(result).toHaveProperty('isValid');
```

### 6. Handling `Promise.race()` for Success/Error

The standard pattern for operations that can fail via error events:

```typescript
const errorPromise = listenForErrorEvent(page, 'justifi-checkout');
const successPromise = page.waitForResponse(/* ... */);

const result = await Promise.race([
  successPromise.then(resp => ({ type: 'success' as const, resp })),
  errorPromise.then(err => ({ type: 'error' as const, err })),
]);

if (result.type === 'error') {
  throw new Error(`Failed: ${result.err}`);
}
```

### 7. Toggling Payment Methods

Test that state persists across form switches. Wait for each form's own iframes — both forms render a Postal Code field, so asserting on shared fields without waiting can match the form you just left:

```typescript
await page.getByRole('radio', { name: 'New bank account' }).click();
await waitForIframeInput(page, 'routingNumber');
await page.getByRole('radio', { name: 'New credit or debit card' }).click();
await waitForIframeInput(page, 'cardNumber');
```

### 8. Tracking Page Errors

Monitor for unexpected JavaScript errors:

```typescript
const pageErrors: Error[] = [];
page.on('pageerror', (err) => pageErrors.push(err));
// ... run test ...
expect(pageErrors).toHaveLength(0);
```

---

## Timing & Waits

**Do not use `page.waitForTimeout()`.** Every sleep is standing in for a condition — wait on the
condition instead. Sleeps cost the same whether or not they were needed, and they hide real
regressions: a sleep that is 500ms too short becomes a flake, and one that is 3s too long becomes
six minutes of CI. Removing them is what took this suite from 6m19s to the time it takes now.

| Scenario | Wait on |
|---|---|
| After `page.goto()` | `waitForComponent(page, tagName)` |
| Before calling a component method or clicking Submit | `waitForCardForm(page)` / `waitForBankAccountForm(page)` |
| After toggling payment method | `waitForCardForm(page)` / `waitForBankAccountForm(page)` |
| After filling a form, before tokenizing | `waitForFieldsValid(page, tagName)` |
| After clicking the billing-fill button | `expect(locator).toHaveValue(...)` |
| After a button click | the assertion itself — `expect()` auto-retries |
| Before reading list rows | `waitForTableRows(page, tagName)` |
| After pagination | `waitForTableRowChange(page, tagName, previousText)` |
| For an API call | `page.waitForResponse(...)` |

**`waitForComponent()` is hydration only.** It returns as soon as Stencil stamps `hydrated`, which is the component's *first* render — the loading state. Anything that reads data, calls a component method, or clicks a control the component owns needs a second wait for the thing it actually depends on. The buttons on the example pages (`#fill-billing-form-button`, `#test-submit-button`) are plain page markup and are clickable long before the component can answer.

**Watch for assertions that pass vacuously.** `expect(submitButton).toBeEnabled()` straight after a click passes against the pre-click state. Assert the outcome you are waiting for first (the error in the event log, the response), then assert the button came back.

Four sleeps are left in the suite, each with a comment saying what it waits for and why nothing
exposes it: component teardown, a field registering its value before a provisioning step advances,
a row click that produces no observable effect, and the one `validate()` test that cannot use
`validate()` as its own wait condition. If you need a fifth, write the same kind of comment — or
find the condition.

### Freshly created payments are not immediately refundable

A payment created by an example page is rejected by `POST /payments/:id/refunds` with `payment_not_available_for_refund` for the first several seconds of its life, even though the payment already reads back as `succeeded` with `captured: true` and a full `amount_refundable`. No field or endpoint exposes the window, so example pages that need a refundable payment gate rendering on the payment's age (see `examples/refund-payment.js`). Voids are unaffected.

---

## Writing New Tests Checklist

1. **Determine if the test belongs here or as a unit test.** E2E tests should cover cross-boundary interactions (API calls, navigation, iframe communication, multi-component flows). If the behavior can be verified by rendering the component in isolation (e.g., checking rendered output, emitted events, disabled states), write a unit test in the component's own `spec` file instead.
2. Identify the example page route (check `apps/component-examples/examples/`)
2. Use `waitForComponent()` after navigation
3. Use `fillIframeInput()` for PCI fields, regular locators for other fields
4. Use `TEST_DATA` constants for test values
5. Use `Promise.race()` pattern with `listenForErrorEvent()` for async operations
6. Wait on conditions, never `page.waitForTimeout()` — see Timing & Waits
7. Assert on API response status, body structure, and component state
8. Track page errors if testing for absence of JS exceptions

---

## Test Annotations

- `test.fixme()` — Known failing test, documents expected behavior not yet implemented
- `test.skip()` — Conditional skip (e.g., requires specific env vars)

```typescript
// Skip when env var not set
if (conditionNotMet) {
  test.skip(true, 'Reason for skipping');
}

// Known issue, not yet fixed
test.fixme('description', async ({ page }) => { /* ... */ });
```
