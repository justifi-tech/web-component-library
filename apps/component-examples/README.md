# Component Examples

Unified Express server hosting all JustiFi web component examples for development and E2E testing.

## Quick Start

```bash
# Start unified server (all components)
pnpm dev:server

# Run E2E tests
pnpm test:e2e
```

## Available Components

| Component                                | Route                                                                                         | File                                                                                           | Extra Env Vars                              |
| ---------------------------------------- | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `justifi-checkout`                       | [/checkout](http://localhost:3000/checkout)                                                   | [examples/checkout.js](examples/checkout.js)                                                   | `SUB_ACCOUNT_ID`, `PAYMENT_METHOD_GROUP_ID` |
| `justifi-checkout` + insurance           | [/checkout-with-insurance](http://localhost:3000/checkout-with-insurance)                     | [examples/checkout-with-insurance.js](examples/checkout-with-insurance.js)                     | `SUB_ACCOUNT_ID`, `PAYMENT_METHOD_GROUP_ID` |
| `justifi-modular-checkout`               | [/modular-checkout](http://localhost:3000/modular-checkout)                                   | [examples/modular-checkout.js](examples/modular-checkout.js)                                   | `SUB_ACCOUNT_ID`, `PAYMENT_METHOD_GROUP_ID` |
| `justifi-dispute-management`             | [/dispute](http://localhost:3000/dispute)                                                     | [examples/dispute.js](examples/dispute.js)                                                     | `DISPUTE_ID`                                |
| `justifi-business-form`                  | [/business-form](http://localhost:3000/business-form)                                         | [examples/business-form.js](examples/business-form.js)                                         |                                             |
| `justifi-business-details`               | [/business-details](http://localhost:3000/business-details)                                   | [examples/business-details.js](examples/business-details.js)                                   | `BUSINESS_ID`                               |
| `justifi-payment-provisioning`           | [/payment-provisioning](http://localhost:3000/payment-provisioning)                           | [examples/payment-provisioning.js](examples/payment-provisioning.js)                           |                                             |
| `justifi-tokenize-payment-method`        | [/tokenize-payment-method](http://localhost:3000/tokenize-payment-method)                     | [examples/tokenize-payment-method.js](examples/tokenize-payment-method.js)                     | `SUB_ACCOUNT_ID`                            |
| `justifi-refund-payment`                 | [/refund-payment](http://localhost:3000/refund-payment)                                       | [examples/refund-payment.js](examples/refund-payment.js)                                       | `SUB_ACCOUNT_ID`                            |
| `justifi-payments-list`                  | [/payments-list](http://localhost:3000/payments-list)                                         | [examples/payments-list.js](examples/payments-list.js)                                         | `SUB_ACCOUNT_ID`                            |
| `justifi-payments-list` + filters        | [/payments-list-with-filters](http://localhost:3000/payments-list-with-filters)               | [examples/payments-list-with-filters.js](examples/payments-list-with-filters.js)               | `SUB_ACCOUNT_ID`                            |
| `justifi-payouts-list`                   | [/payouts-list](http://localhost:3000/payouts-list)                                           | [examples/payouts-list.js](examples/payouts-list.js)                                           | `SUB_ACCOUNT_ID`                            |
| `justifi-payouts-list` + filters         | [/payouts-list-with-filters](http://localhost:3000/payouts-list-with-filters)                 | [examples/payouts-list-with-filters.js](examples/payouts-list-with-filters.js)                 | `SUB_ACCOUNT_ID`                            |
| `justifi-checkouts-list`                 | [/checkouts-list](http://localhost:3000/checkouts-list)                                       | [examples/checkouts-list.js](examples/checkouts-list.js)                                       | `SUB_ACCOUNT_ID`                            |
| `justifi-checkouts-list` + filters       | [/checkouts-list-with-filters](http://localhost:3000/checkouts-list-with-filters)             | [examples/checkouts-list-with-filters.js](examples/checkouts-list-with-filters.js)             | `SUB_ACCOUNT_ID`                            |
| `justifi-terminals-list`                 | [/terminals-list](http://localhost:3000/terminals-list)                                       | [examples/terminals-list.js](examples/terminals-list.js)                                       | `SUB_ACCOUNT_ID`                            |
| `justifi-terminals-list` + filters       | [/terminals-list-with-filters](http://localhost:3000/terminals-list-with-filters)             | [examples/terminals-list-with-filters.js](examples/terminals-list-with-filters.js)             | `SUB_ACCOUNT_ID`                            |
| `justifi-terminal-orders-list`           | [/terminal-orders-list](http://localhost:3000/terminal-orders-list)                           | [examples/terminal-orders-list.js](examples/terminal-orders-list.js)                           | `SUB_ACCOUNT_ID`                            |
| `justifi-terminal-orders-list` + filters | [/terminal-orders-list-with-filters](http://localhost:3000/terminal-orders-list-with-filters) | [examples/terminal-orders-list-with-filters.js](examples/terminal-orders-list-with-filters.js) | `SUB_ACCOUNT_ID`                            |
| `justifi-order-terminals`                | [/order-terminals](http://localhost:3000/order-terminals)                                     | [examples/order-terminals.js](examples/order-terminals.js)                                     | `SUB_ACCOUNT_ID`, `BUSINESS_ID`             |
| `justifi-payment-details`                | [/payment-details](http://localhost:3000/payment-details)                                     | [examples/payment-details.js](examples/payment-details.js)                                     | `SUB_ACCOUNT_ID`, `PAYMENT_ID`              |
| `justifi-payout-details`                 | [/payout-details](http://localhost:3000/payout-details)                                       | [examples/payout-details.js](examples/payout-details.js)                                       | `SUB_ACCOUNT_ID`, `PAYOUT_ID`               |
| `justifi-payment-transactions-list`      | [/payment-transactions-list](http://localhost:3000/payment-transactions-list)                 | [examples/payment-transactions-list.js](examples/payment-transactions-list.js)                 | `SUB_ACCOUNT_ID`                            |
| `justifi-payout-transactions-list`       | [/payout-transactions-list](http://localhost:3000/payout-transactions-list)                   | [examples/payout-transactions-list.js](examples/payout-transactions-list.js)                   | `SUB_ACCOUNT_ID`, `PAYOUT_ID`               |

## Architecture

```
server.js              # Unified Express server — mounts all routers
examples/
  checkout.js          # Router module (also runnable standalone)
  payments-list.js     # Router module (also runnable standalone)
  ...
utils/
  auth.js              # Shared getToken() and getWebComponentToken()
  api-paths.js         # API endpoint path constants
```

Each example file exports an `express.Router()` mounted by `server.js`, but can also run standalone via `node examples/checkout.js` for isolated development.
