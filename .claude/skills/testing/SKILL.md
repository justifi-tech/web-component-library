---
name: testing
description: How tests are written in this monorepo — Stencil spec tests on `stencil test --spec` (Jest + Stencil's mock DOM) and Playwright E2E against the Express example app. Load this BEFORE writing or editing any test, not after: a new .spec.ts / .spec.tsx, another case in an existing suite, a failing or flaky test, a snapshot that needs updating, or the suites a component change just broke. Also use when picking which tier a behaviour belongs in, when reaching for newSpecPage, jest.mock on a service, mockData fixtures, checkoutStore, data-test-id selectors, e2e/helpers.ts, fillIframeInput or TEST_DATA, and when a reviewer flags a test. Trigger even when nobody says the word "test" — "add coverage for", "make sure this is covered", "verify the new component renders", "this suite is flaky", "the snapshot changed" all mean a test is about to be written or changed. Not for diagnosing CI infrastructure failures.
paths:
  - 'packages/webcomponents/src/**/*.spec.ts'
  - 'packages/webcomponents/src/**/*.spec.tsx'
  - 'packages/webcomponents/setupTests.js'
  - 'apps/component-examples/e2e/**/*.ts'
  - 'mockData/**'
---

# Testing

Two tiers. Use the cheaper one that can check your change. If the code is hard to test at that level, fix the code instead of moving up.

| Tier | Lives in | Runner | Observes |
| - | - | - | - |
| Spec (unit / component) | `packages/webcomponents/src/**` | `stencil test --spec` — Jest + Stencil's mock DOM | One concept: a util, an entity, an action factory, or one component's rendered output |
| E2E | `apps/component-examples/e2e/` | Playwright + Chromium | A real flow against the real API, driven through the Express example app |

`packages/types` and `docs` have no test script — nothing runs there.

`apps/component-examples/e2e/README.md` states the gate between the two: E2E covers cross-boundary interactions (API calls, navigation, iframe communication, multi-component flows). If rendering the component in isolation can verify it — rendered output, emitted events, disabled states — it is a spec test.

When you change component structure or behavior, check for tests that break, including ones you didn't write. Update outdated assertions instead of deleting them. Adding one test while leaving six existing assertions failing means the work isn't finished.

## Running tests

```bash
# whole spec suite
pnpm --filter @justifi/webcomponents test

# one file, or one test name
pnpm --filter @justifi/webcomponents test -- payments-list
pnpm --filter @justifi/webcomponents test -- -t "renders properly with fetched data"

# lint (must be clean — `--max-warnings 0`)
pnpm --filter @justifi/webcomponents lint

# E2E — starts the example server itself if :3000 is free. See the E2E section.
pnpm test:e2e

# live component work: Stencil watcher + examples server. Never exits — background it.
pnpm dev:server
```

Every package script is allowed, `build` and `dev:server` included. `format` and `clean` have wide blast radius — announce before running either.

Three traps, each of which has bitten someone:

- **Prefer the `--filter` form over root `pnpm test`.** Root `pnpm test` is `turbo run test`, and `turbo.json` declares `test` with `dependsOn: ["build"]`. It works, it is just slower for no benefit: spec tests compile their own sources through Stencil's Jest preset and never read `dist/`. Reach for root `pnpm test` when you want the build validated too.
- **`npx stencil test` does not work here** — `npm error could not determine executable to run`. Use `pnpm --filter` or `pnpm exec`.
- **Don't trust the exit code through a pipe.** `cmd | tail` reports `tail`'s status, not the runner's. Read the output and look for the `Tests:` line — its absence is the failure signal.

Test config lives in the `testing` block of `packages/webcomponents/stencil.config.ts` — `setupFiles` and an image `moduleNameMapper`. There is no separate Jest config; `stencil test --spec` would not read one.

Globals (`IFRAME_ORIGIN`, `PROXY_API_ORIGIN`, `API_ORIGIN`) come from `packages/webcomponents/setupTests.js`. It installs no Jest hooks, so **nothing is reset between tests by default** — no `clearMocks`, no `restoreMocks`. Reset your own mocks.

## How a test is written

- Arrange, Act, Assert — or Given, When, Then — in that order, and keep the three visibly separate.
- Setup shared by every test in a block goes in `beforeEach`, not copied into each test and not hoisted to `beforeAll`. The inputs that make *this* test different stay in the test body.
- One behaviour per test, named for that behaviour. A test asserting five unrelated things reports one failure and hides the other four.
- Tests must pass in isolation and in any order. The live hazard here is `checkoutStore` — see below.
- Don't make real network calls, don't use the real clock, don't modify a fixture in place. Mock at the boundaries listed below.

```ts
describe('formatCurrency', () => {
  it('formats cents as dollars with two decimals', () => {
    // Arrange
    const cents = 1799;

    // Act
    const formatted = formatCurrency(cents);

    // Assert — one behaviour, named in the title.
    expect(formatted).toBe('$17.99');
  });
});
```

Spec files live either in a `test/` subdirectory next to the component or alongside it. Both exist (`test/` is the larger group; `AGENTS.md` documents the co-located form). Match whatever the directory you are working in already does — don't introduce the other style.

## Spec tests

### Rendering

`newSpecPage` takes the component **classes** in `components`, and the **tag names** in the markup. Two forms are in use; both are fine.

```tsx
// JSX template — the common form, and the only one that can pass props as values.
const page = await newSpecPage({
  components: [JustifiPaymentsList, PaginationMenu],
  template: () => (
    <justifi-payments-list accountId="123" authToken="123" columns={defaultColumnsKeys} />
  ),
});
await page.waitForChanges();

// html string — used where the component takes no prop objects.
const page = await newSpecPage({
  components: [JustifiPaypal],
  html: `<justifi-paypal></justifi-paypal>`,
});
```

**Always `await` `waitForChanges()`.** A bare `page.waitForChanges();` is a floating promise and the assertions below it race the render. `@typescript-eslint/no-floating-promises` is turned off in this repo, so lint will not catch it — several existing specs have the bug.

Two gotchas that cost real debugging time:

```ts
// `newSpecPage` swaps the global window, so anything you hang off `window`
// must be installed AFTER the page exists, not before.
const page = await createPage();
(window as any).paypal = { createInstance };

// Stencil's mock window keeps native timers, so Jest fake timers don't reach it.
// Use the bridge, not `jest.useFakeTimers()` on its own.
// src/components/checkout/test/use-bridged-fake-timers.ts
const restore = useBridgedFakeTimers();
```

### Querying

Customer-facing `justifi-*` components use shadow DOM; internal components (`form-control-*`, `pagination-menu`) do not. That decides which root you query.

```ts
// justifi-* — go through the shadow root
const rows = page.root.shadowRoot.querySelectorAll('[data-test-id="table-row"]');

// internal component — light DOM
const input = page.root.querySelector('input');
```

Prefer `data-test-id` for anything you add — it is the most stable hook and the one the list components already use. A tag-plus-attribute selector (`form-control-text[name="customer_name"]`) is the other common idiom; follow whatever the surrounding spec does. There is **no `@testing-library`** in this repo — no `screen`, no `getByRole`. Don't import one.

Assert on rendered output and emitted events, not on the instance:

```ts
// Events: attach a spy, assert the detail.
const spy = jest.fn();
page.root.addEventListener('formControlInput', spy);
input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
await page.waitForChanges();
expect(spy).toHaveBeenCalledWith(
  expect.objectContaining({ detail: { name: 'email', value: 'other-user@example.com' } }),
);
```

`page.rootInstance` reaches into component internals — reading private state, calling handlers directly, injecting fake refs. The repo does this in hundreds of places and it is the main reason refactors break tests. Don't add more: a component that sets the right internal state and renders the wrong thing is still broken. Use `rootInstance` only when the behaviour genuinely has no rendered or emitted surface, and say so in a comment.

### Mocking

**The boundary is the service class** (`src/api/services/*.service.ts`), not `fetch` and not the `Api()` factory. Two patterns, picked by what you are testing:

```ts
// Component spec — automock the module, then stub the method on the prototype.
jest.mock('../../../api/services/payment.service');

PaymentService.prototype.fetchPayments = jest.fn().mockResolvedValue(mockPaymentsResponse);
// unhappy path: same seam, different outcome
PaymentService.prototype.fetchPayments = jest.fn().mockRejectedValue(new Error('Fetch error'));
```

```ts
// Action-factory spec — inject the mock through the factory. This is the shape
// `AGENTS.md` prescribes: interfaces at boundaries, DI over globals.
const mockService = { fetchPayments: jest.fn() } as unknown as jest.Mocked<PaymentService>;
mockService.fetchPayments.mockResolvedValue(mockResponse);

const getPayments = makeGetPayments({ id, authToken, service: mockService });
await getPayments({ params, onSuccess, onError, final });

expect(onSuccess).toHaveBeenCalledWith({
  payments: expect.arrayContaining([expect.any(Payment)]),
  pagingInfo: mockResponse.page_info,
});
expect(onError).not.toHaveBeenCalled();
```

Cover all three outcomes for an action factory: success, API error, thrown exception.

Never mock a component's own internals or the Stencil runtime to make a test pass.

Two pieces of required boilerplate:

```ts
// MUST be the first statement, above the imports. `styled-host.tsx` imports a .css
// file and the moduleNameMapper in stencil.config.ts maps images only, not CSS.
jest.mock('../../../ui-components/styled-host/styled-host.css', () => '');

// Analytics attaches listeners to elements that don't exist in the mock DOM.
beforeEach(() => {
  // @ts-ignore
  JustifiAnalytics.prototype.trackCustomEvents = jest.fn();
});
```

**`checkoutStore` is shared mutable module state.** It is the real "passes alone, fails in suite" hazard — `checkout`, `modular-checkout`, `paypal`, `sezzle`, `google-pay` and `saved-payment-methods` specs all write to the same object. Set every field your test depends on in `beforeEach` rather than relying on what a previous test left, and reset what you changed.

Since nothing resets automatically, put `jest.clearAllMocks()` in `beforeEach` and restore any spy you created in `afterEach`.

### Fixtures

Payloads come from the repo-root `mockData/` directory, imported by relative path.

```ts
import mockResponse from '../../../../../../mockData/mockPaymentsSuccess.json';

// Compose onto the fixture — never mutate it, other specs import the same object.
const withGrossType = { ...mockResponse, data: { ...mockResponse.data, payout_type: 'gross' } };

// Entity classes are constructed in the test, with a cast.
const business = new Business(mockBusinessDetails.data as unknown as IBusiness);
```

For data that varies per test, a factory beats a literal — `src/components/business-forms/payment-provisioning/test/mockBusiness.ts` is the model (`createMockBusinessData(countryCode)` plus spread overrides). Note `docs/mocks/` is a separate set used for documentation demos; it is not test data.

### Snapshots

`toMatchSnapshot()` is used in about 30 files, always as `expect(page.root).toMatchSnapshot()` and almost always *alongside* explicit assertions. Treat it that way: a snapshot is a backstop, never the only assertion in a test.

Snapshots currently total ~188,500 lines, and two files dominate — `order-terminals.spec.tsx.snap` at ~85,500 lines and `justifi-gross-payment-chart.spec.tsx.snap` at ~70,800. A CSS tweak churns all of them. So:

- Don't add a new snapshot to a large component. Assert the specific node you care about.
- When a snapshot diff appears, read it before updating. A styling change is expected churn; a missing row is a bug your change introduced.

## E2E tests

**Read `apps/component-examples/e2e/README.md` first** — `CLAUDE.md` requires it and it is authoritative for helpers, `TEST_DATA`, the iframe rules and the timing table. What follows is only what the README leaves out or gets wrong.

**Just run `pnpm test:e2e`.** `playwright.config.ts` declares `webServer: { command: 'pnpm start', url: 'http://localhost:3000', reuseExistingServer: true, timeout: 120000 }`, so Playwright brings the example server up itself when `:3000` is free and attaches to whatever is already there when it isn't. Allow up to two minutes for that first boot.

**That boot does not build.** `pnpm start` is just nodemon, and `server.js` serves the library from `node_modules/@justifi/webcomponents/dist/` — a workspace symlink to the built package. So E2E runs against **the last build**, not your working tree. If you changed component source, either `pnpm build` first, or keep `pnpm dev:server` in the background (Stencil watcher + examples server); `reuseExistingServer` means `pnpm test:e2e` then attaches to it instead of starting a second one. `dev:server` never exits — background it and don't wait on it.

Config facts worth knowing: `timeout: 90_000`, `workers: 1`, **no retries at all** (including CI), `trace: 'retain-on-failure'`, no screenshots or video. Default `expect` timeout is 5s, which is why specs pass `{ timeout: 15000 }` explicitly.

There is **no `e2e/fixtures.ts` and no extended `test`** here. Every spec imports from Playwright directly and takes helpers from the local module:

```ts
import { test, expect } from '@playwright/test';
import { waitForComponent, fillIframeInput, TEST_DATA } from './helpers';
```

Binary test assets live in `e2e/assets/` — `payment-provisioning-helpers.ts` exports `VOIDED_CHECK_FIXTURE` from there for the document-upload steps.

Playwright pierces open shadow roots automatically, so `getByRole`, `getByLabel` and CSS locators reach into `justifi-*` components without manual traversal. Prefer those. PCI fields are the exception — card and bank inputs live in hosted iframes and need `fillIframeInput()`.

**Raw `page.waitForTimeout` is sanctioned here**, unlike most repos: iframe initialisation has no observable signal and the README's timing table prescribes specific waits. It is still a last resort. `refund-payment.spec.ts` and `dispute.spec.ts` have zero raw timeouts and are the models — prefer `waitForResponse`, `waitForRequest`, `expect.poll`, and `expect(async () => …).toPass({ timeout })`.

**`listenForErrorEvent()` is live-broken on two routes.** It matches a console message containing `[<tag>] error-event`, so the example page's listener must be:

```js
component.addEventListener('error-event', (event) => {
  console.error('[justifi-your-component] error-event', event.detail);
});
```

`examples/checkout.js` and `examples/payment-provisioning.js` log `console.log(event)` instead, which produces `JSHandle@object` and never matches — the returned promise hangs and any `Promise.race()` built on it degrades into a 90-second timeout instead of a readable failure. `examples/refund-payment.js` is the compliant example. If you hit this, fix the example page; do not work around it in the spec.

**No conditional assertions.** `if (await el.count() > 0)` passes silently when the element is absent — that is a wish, not a test. The one in `checkout.spec.ts` that skips when no saved payment method is found is a known wart: it reads a failed page load as "no data" and skips green.

```ts
// Wrong — green when the row never rendered.
if ((await rows.count()) > 0) await expect(rows.first()).toContainText('…');

// Right — the assertion runs, or the test fails.
await expect(page.getByRole('row').first()).toContainText('…');
```

Use `test.fixme()` with a comment naming the issue for known-failing behaviour — `payments-list.spec.ts` has the pattern. Reserve `test.skip()` for a genuine environment precondition; `dispute.spec.ts` guards on `DISPUTE_ID`/`CLIENT_ID`/`CLIENT_SECRET` in `beforeEach` and is the only correct example.

**These tests hit the real API.** Tokens never appear in test code — each example page mints a scoped web component token server-side via `utils/auth.js` and interpolates it into the element. Credentials come from the repo-root `.env`. If they are missing, most specs do not skip: the example page 500s, so locators find nothing and assertions fail on their 5s `expect` timeout (or the whole test burns the 90s budget if something hangs). A wall of timeouts across unrelated specs usually means missing env, not a broken component.

Mock with `page.route()` only to force a failure you cannot produce otherwise (`route.abort()`, a fulfilled 402, or fetch-and-mutate to age a payment). It is not the default.

**Adding an E2E test for a new component** means adding to the example app first: an `examples/<route>.js` router that mints a scoped token and renders the tag, the route in `server.js`, the `#output-pane` / `#event-log` / `data-testid` hooks the spec will read, console listeners in the exact shapes `helpers.ts` matches, and any new env var in both `.env.example` and the E2E workflow.

## Before calling it done

Don't assume a green test proves anything. This repo keeps running into these:

- The runner never actually ran — no `Tests:` line, because the command was `npx stencil test` or the exit code came from a pipe.
- A bare `page.waitForChanges()` without `await`, so assertions raced the render.
- Asserting on `page.rootInstance` state when nothing rendered changed.
- A test that only passes because another spec left `checkoutStore` in the right shape.
- A snapshot updated without reading the diff.
- Conditional assertions, or a `test.skip()` that hides a failed page load.
- An E2E run that passed against the **last build** because the component change was never built — `pnpm build` first, or keep `pnpm dev:server` running.
- Existing assertions broken by your change and left failing.

Then run both, and read the output:

```bash
pnpm --filter @justifi/webcomponents test
pnpm --filter @justifi/webcomponents lint
```
