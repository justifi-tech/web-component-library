# form-control-text

<!-- Auto Generated Below -->

## Properties

| Property       | Attribute       | Description | Type     | Default     |
| -------------- | --------------- | ----------- | -------- | ----------- |
| `iframeOrigin` | `iframe-origin` |             | `string` | `undefined` |
| `inputId`      | `input-id`      |             | `string` | `undefined` |
| `label`        | `label`         |             | `string` | `undefined` |

## Methods

### `tokenize(clientId: string, paymentMethodMetadata: any, account?: string) => Promise<any>`

#### Parameters

| Name                    | Type     | Description |
| ----------------------- | -------- | ----------- |
| `clientId`              | `string` |             |
| `paymentMethodMetadata` | `any`    |             |
| `account`               | `string` |             |

#### Returns

Type: `Promise<any>`

### `validate() => Promise<any>`

#### Returns

Type: `Promise<any>`

## Shadow Parts

| Part      | Description |
| --------- | ----------- |
| `"label"` |             |

## Dependencies

### Used by

- [justifi-additional-statement](../../components/dispute-management/counter-dispute)
- [justifi-cancellation-policy](../../components/dispute-management/counter-dispute)
- [justifi-customer-details](../../components/dispute-management/counter-dispute)
- [justifi-duplicate-charge](../../components/dispute-management/counter-dispute)
- [justifi-electronic-evidence](../../components/dispute-management/counter-dispute)
- [justifi-refund-policy](../../components/dispute-management/counter-dispute)
- [justifi-shipping-details](../../components/dispute-management/counter-dispute)

### Depends on

- [form-control-help-text](./form-helpers/form-control-help-text)

### Graph

```mermaid
graph TD;
  form-control-textarea --> form-control-help-text
  justifi-additional-statement --> form-control-textarea
  justifi-cancellation-policy --> form-control-textarea
  justifi-customer-details --> form-control-textarea
  justifi-duplicate-charge --> form-control-textarea
  justifi-electronic-evidence --> form-control-textarea
  justifi-refund-policy --> form-control-textarea
  justifi-shipping-details --> form-control-textarea
  style form-control-textarea fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
