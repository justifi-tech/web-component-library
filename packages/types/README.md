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

## Documentation

Visit [https://docs.justifi.tech/web-components/introduction](https://docs.justifi.tech/web-components/introduction) for full documentation.

## License

MIT
