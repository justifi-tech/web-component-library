# justifi-payments-list



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute | Description | Type                                    | Default     |
| ------------------- | --------- | ----------- | --------------------------------------- | ----------- |
| `clearParams`       | --        |             | `() => void`                            | `undefined` |
| `params`            | `params`  |             | `any`                                   | `{}`        |
| `setParamsOnChange` | --        |             | `(name: string, value: string) => void` | `undefined` |


## Dependencies

### Used by

 - [payments-list-core](.)

### Depends on

- [table-filters-menu](../../ui-components/filters)
- [form-control-text](../form)
- [form-control-select](../form)
- [form-control-date](../form)

### Graph
```mermaid
graph TD;
  payments-list-filters --> table-filters-menu
  payments-list-filters --> form-control-text
  payments-list-filters --> form-control-select
  payments-list-filters --> form-control-date
  table-filters-menu --> custom-popper
  form-control-text --> form-control-help-text
  form-control-text --> form-control-error-text
  form-control-select --> form-control-help-text
  form-control-select --> form-control-error-text
  form-control-date --> form-control-help-text
  form-control-date --> form-control-error-text
  payments-list-core --> payments-list-filters
  style payments-list-filters fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
