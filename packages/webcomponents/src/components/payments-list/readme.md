# justifi-payments-list

<!-- Auto Generated Below -->

## Properties

| Property            | Attribute | Description | Type                                    | Default     |
| ------------------- | --------- | ----------- | --------------------------------------- | ----------- |
| `clearParams`       | --        |             | `() => void`                            | `undefined` |
| `params`            | --        |             | `PaymentsParams`                        | `{}`        |
| `setParamsOnChange` | --        |             | `(name: string, value: string) => void` | `undefined` |

## Dependencies

### Used by

- [payments-list-core](.)

### Depends on

- [table-filters-menu](../../ui-components/filters)
- [form-control-text](../../ui-components/form)
- [form-control-select](../../ui-components/form)
- [form-control-date](../../ui-components/form)

### Graph

```mermaid
graph TD;
  payments-list-filters --> table-filters-menu
  payments-list-filters --> form-control-text
  payments-list-filters --> form-control-select
  payments-list-filters --> form-control-date
  table-filters-menu --> custom-popper
  form-control-text --> form-control-tooltip
  form-control-tooltip --> custom-popper
  form-control-select --> form-control-tooltip
  form-control-date --> form-control-tooltip
  payments-list-core --> payments-list-filters
  style payments-list-filters fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
