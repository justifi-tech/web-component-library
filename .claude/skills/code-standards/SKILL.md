---
name: code-standards
description: The code patterns every function in this library follows — size and parameter limits, where variables are declared, named constants, early returns, and the comment, try/catch, blank-line and ternary rules. Load this BEFORE writing or editing any .ts/.tsx file, not after: a new Stencil component or lifecycle method, a render helper, an api/ service, an actions/ maker, a utils/ function, a ui-component, a refactor, or a fix to existing code. Also use when a method is growing past a screen, when a third parameter is about to become a fourth, when a magic number or string literal is about to be inlined, when an if/else is about to nest a third level, when a ternary is about to wrap another ternary in JSX, and when a reviewer flags readability. Trigger even when nobody says the word "standards" — "clean this up", "refactor this", "make this readable", "why is this hard to follow" all mean these patterns apply. Not for test conventions (that is the testing skill).
---

# Code patterns

Nine rules. They are about one thing: a reader understands a function by reading
it top to bottom, once, without scrolling and without holding state in their
head. Apply them to the code you touch — components, services, actions,
ui-components and utils alike.

## 1. No method over 30 lines

A method longer than a screen is doing more than one thing. Extract the parts
that have a name. In a Stencil component this usually means pulling pieces of
`render()` into render helpers, and pulling data work out of lifecycle methods.

```tsx
// Wrong — render() fetches nothing but still runs 40+ lines of branching markup.
render() {
  return (
    <StyledHost>
      {this.loading.business ? <OrderTerminalsLoading /> : null}
      {this.error ? <div part={text}>{this.error.message}</div> : null}
      {/* …30 more lines of terminal rows, quantity selectors and totals */}
    </StyledHost>
  );
}

// Right — each piece is a named helper the reader can skip or open.
render() {
  if (this.loading.business) return <StyledHost><OrderTerminalsLoading /></StyledHost>;
  return (
    <StyledHost>
      {this.renderError()}
      {this.renderTerminalList()}
      {this.renderSubmit()}
    </StyledHost>
  );
}
```

## 2. No more than 3 parameters — prefer an object

Past three, the call site stops being readable and argument order becomes a
bug. Take a named object instead — the `makeX`/service shapes in `actions/` and
`api/services/` already do this.

```ts
// Wrong — the call site is unreadable and the two booleans are swappable.
function orderTerminals(businessId, authToken, accountId, models, shipping, notify) { /* … */ }
orderTerminals('biz_123', token, 'acc_456', models, true, false);

// Right — every argument names itself, and order stops mattering.
interface OrderTerminalsParams {
  businessId: string;
  authToken: string;
  accountId: string;
  models: TerminalModel[];
  shipping?: boolean;
  notify?: boolean;
}

function orderTerminals(params: OrderTerminalsParams): Promise<TerminalOrder> { /* … */ }

orderTerminals({
  businessId: 'biz_123',
  authToken: token,
  accountId: 'acc_456',
  models,
  shipping: true,
});
```

## 3. Declare a variable next to where it is used

A declaration at the top of a method is state the reader has to carry to the
bottom. Declare it where it first matters.

```ts
// Wrong — `formatted` is computed before the two paths that never read it.
private renderPhone(business: Business) {
  const formatted = formatPhoneNumber(business.phone);
  if (!business) return null;
  if (!business.phone) return <span part={text}>No phone on file</span>;
  return <span part={text}>{formatted}</span>;
}

// Right — it is declared on the only path that uses it.
private renderPhone(business: Business) {
  if (!business) return null;
  if (!business.phone) return <span part={text}>No phone on file</span>;
  const formatted = formatPhoneNumber(business.phone);
  return <span part={text}>{formatted}</span>;
}
```

## 4. Never an empty `try`/`catch`

An empty catch deletes the failure and leaves the host page with a component
that silently shows nothing. Handle it, emit `error-event`, or let it throw.

```ts
// Wrong — the component renders empty forever and the host never finds out.
try {
  this.terminalModels = await this.fetchTerminalModels();
} catch {}

// Right — the failure reaches the host page through the documented event.
try {
  this.terminalModels = await this.fetchTerminalModels();
} catch (error) {
  this.errorEvent.emit({
    errorCode: ComponentErrorCodes.FETCH_ERROR,
    message: error.message,
    severity: ComponentErrorSeverity.ERROR,
  });
}
```

A catch that genuinely has nothing to do carries a comment saying why.

## 5. No blank lines inside a method

Blank lines inside a body are a sign the method has sections — and sections are
methods. Keep the body one continuous block; put the break between methods
instead.

```ts
// Wrong — three paragraphs inside one method.
private async submitOrder() {
  this.submitting = true;

  const payload = this.buildOrderPayload();

  await this.terminalService.order(payload);
}

// Right — one block, and anything that wanted its own paragraph became its own method.
private async submitOrder() {
  this.submitting = true;
  await this.terminalService.order(this.buildOrderPayload());
  this.submitting = false;
}
```

## 6. No comment the code could have said itself

A comment that restates the next line goes stale and earns nothing. Rename the
thing instead. Keep comments for *why* — a browser quirk, an upstream API
oddity, a decision.

```ts
// Wrong — the comment says what the line already says.
// check if there are terminals
if (this.terminalModels.length > 0) { /* … */ }

// Right — the name carries the intent; no comment needed.
if (this.hasTerminalModels()) { /* … */ }

// Right — a comment that says something the code cannot.
// Safari < 16.4 fires `input` before the masked value is committed, so read
// the element on the next frame rather than from the event.
requestAnimationFrame(() => this.syncMaskedValue(input));
```

## 7. Give meaningful numbers and strings a named constant

A bare literal in an expression is a fact nobody can search for, and a typo
nobody can see.

```ts
// Wrong — what is 30000? why 'card'?
if (Date.now() - this.tokenIssuedAt > 30000) this.refreshToken();
if (paymentMethod.type === 'card') this.showCardForm();

// Right — the name is the explanation, and both are greppable.
const TOKEN_TTL_MS = 30_000;
const CARD_PAYMENT_METHOD = 'card' as const;

if (Date.now() - this.tokenIssuedAt > TOKEN_TTL_MS) this.refreshToken();
if (paymentMethod.type === CARD_PAYMENT_METHOD) this.showCardForm();
```

## 8. Never nest `if`/`else` more than two deep — return early

Guard clauses flatten a method. Deep nesting forces the reader to track which
branch they are in.

```ts
// Wrong — the happy path is four levels in and the conditions are inverted.
private resolveOrderLimit(business: Business | null) {
  if (business) {
    if (business.terminals_enabled) {
      if (business.order_limit != null) {
        return business.order_limit;
      } else {
        return DEFAULT_ORDER_LIMIT;
      }
    } else {
      return 0;
    }
  } else {
    return 0;
  }
}

// Right — every exception leaves immediately; the happy path is last and flat.
private resolveOrderLimit(business: Business | null): number {
  if (!business) return 0;
  if (!business.terminals_enabled) return 0;
  return business.order_limit ?? DEFAULT_ORDER_LIMIT;
}
```

## 9. Never nest a ternary inside a ternary

Two levels of `?:` have no reading order a human agrees on — and in JSX they
are the hardest thing in the file to read. Use a lookup, a guarded return, or a
render helper.

```tsx
// Wrong — nobody parses this correctly on the first read.
{this.loading
  ? <OrderTerminalsLoading />
  : this.error
    ? <div part={text}>{this.error.message}</div>
    : this.terminalModels.length ? this.renderTerminalList() : <EmptyState />}

// Right — guarded returns in a render helper; each state is one line to read.
private renderBody() {
  if (this.loading) return <OrderTerminalsLoading />;
  if (this.error) return <div part={text}>{this.error.message}</div>;
  if (!this.terminalModels.length) return <EmptyState />;
  return this.renderTerminalList();
}
```

A single ternary is fine — `{this.loading ? <Spinner /> : this.renderTable()}`.
It is the second level that is banned.

## Before calling it done

Re-read the methods you touched and check each one: under 30 lines, at most
three parameters, no blank line in the body, no empty catch, no literal that
needed a name, no third level of `if`, no ternary inside a ternary. If a rule
is hard to satisfy, the method is doing too much — split it rather than making
an exception.
