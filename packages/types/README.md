<p align="center">
  <a href="https://justifi.tech/" rel="noopener" target="_blank"><img width="150" height="133" src="https://justifi.tech/wp-content/uploads/2022/07/Light-BG-1.svg" alt="JustiFi logo"></a>
</p>

<h1 align="center">@justifi/types</h1>

Shared TypeScript types, interfaces, and entity classes for JustiFi applications. This package provides type definitions for the JustiFi API and is used internally by `@justifi/webcomponents`.

## Installation

```bash
npm install @justifi/types
# or
pnpm add @justifi/types
```

## Usage

### Import All Types

```typescript
import { IPayment, Payment, PaymentStatuses } from '@justifi/types';
```

### Import by Category

The package provides subpath exports for more targeted imports:

```typescript
// API response types
import { IApiResponse, IErrorObject } from '@justifi/types/api';

// Entity classes and interfaces
import { Payment, Payout, Checkout } from '@justifi/types/entities';

// Business onboarding types
import { Business, Address, Owner } from '@justifi/types/business';

// Utility functions and types
import { CountryCode, StateOptions, filterNumber } from '@justifi/types/utils';
```

## Export Categories

| Path | Description |
|------|-------------|
| `@justifi/types` | All exports combined |
| `@justifi/types/api` | API response types, error types, billing info |
| `@justifi/types/entities` | Entity classes (Payment, Payout, Checkout, etc.) |
| `@justifi/types/business` | Business onboarding types (Business, Address, Owner, etc.) |
| `@justifi/types/utils` | Utility functions and enums (CountryCode, StateOptions, etc.) |

## TypeScript Naming & Collision Avoidance (Critical Rules)

### 1) Use PascalCase for all type-level symbols
- `interface`, `type`, `enum`, `class`: **PascalCase**
- No prefixes like `I*`, `T*`, `E*`

### 2) Reserve the "bare noun" for the primary value symbol
- Use `Button` for the component/class/function (the main exported value)
- Avoid exporting a type with the exact same name as a value (`type Button` + `class Button`)

### 3) Make names collision-resistant with meaning-based suffixes
Use these suffixes consistently:
- UI: `...Props`, `...State`
- Config: `...Options`, `...Config`
- API: `...Dto`, `...Request`, `...Response`, `...Params`, `...Payload`
- Domain: `...Model`, `...Entity`, `...ViewModel`
- Errors: `...Error`
- Functions: `...Handler`

### 4) Don't export internal types
- If it's not part of the public API: **don't export it**
- Internal naming: `...Internal...` (unexported)

### 5) Avoid "mega barrel" exports
- Do **not** `export *` from many modules into a single `index.ts` for public APIs
- Prefer **domain/subpath exports** (import from specific module paths)

### 6) Prefer type-only imports/exports
- Always use `import type { X } ...` and `export type { X } ...` when applicable

### 7) Use explicit names in shared packages
- Shared/core packages must avoid generic names like `Config`, `Options`, `State`, `Result`
- Use domain-qualified names: `AuthConfig`, `LoggingOptions`, `UserDto`

### 8) Enums and unions: be specific and singular
- Enums: `ButtonSize`, `SortDirection` (singular)
- Unions: `ButtonVariant`, `HttpMethod` (descriptive)

## Documentation

Visit [https://docs.justifi.tech/web-components/introduction](https://docs.justifi.tech/web-components/introduction) for full documentation.

## License

MIT
