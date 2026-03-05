# E2E Testing Guide

This guide covers patterns, helpers, and conventions for writing Playwright E2E tests for JustiFi web components.

## Setup

- **Framework**: Playwright v1.58+
- **Config**: `apps/component-examples/playwright.config.ts`
- **Base URL**: `http://localhost:3000` (Express server serving example pages)
- **Browser**: Chromium (Desktop Chrome)
- **Timeout**: 90s per test, single worker
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

Waits for a web component to appear in the DOM, then adds a 3-second delay for iframe initialization.

```typescript
await waitForComponent(page, 'justifi-checkout');
await waitForComponent(page, 'justifi-tokenize-payment-method');
```

**Always call this after `page.goto()`** before interacting with the component.

### `listenForErrorEvent(page, componentName)`

Returns a promise that resolves when the component logs a console error event. Used with `Promise.race()` to detect failures during async operations.

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
await page.waitForTimeout(2000); // Wait for form switch
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

Test that state persists across form switches:

```typescript
await page.getByRole('radio', { name: 'New bank account' }).click();
await page.waitForTimeout(500);
await page.getByRole('radio', { name: 'New credit or debit card' }).click();
await page.waitForTimeout(3000); // Allow iframe re-initialization
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

Due to iframe initialization and async component loading, explicit waits are necessary:

| Scenario | Wait |
|---|---|
| After `page.goto()` | `waitForComponent(page, tagName)` (includes 3s delay) |
| After toggling payment method | `page.waitForTimeout(500)` minimum |
| After toggling to form with iframes | `page.waitForTimeout(2000-3000)` for iframe init |
| Before clicking Pay | `page.waitForTimeout(2000)` for iframe JS init |
| After button click (error check) | `page.waitForTimeout(3000)` |

**Prefer** `waitForComponent()` and `waitForResponse()` over raw timeouts when possible.

---

## Writing New Tests Checklist

1. Identify the example page route (check `apps/component-examples/examples/`)
2. Use `waitForComponent()` after navigation
3. Use `fillIframeInput()` for PCI fields, regular locators for other fields
4. Use `TEST_DATA` constants for test values
5. Use `Promise.race()` pattern with `listenForErrorEvent()` for async operations
6. Add appropriate waits for iframe initialization
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
