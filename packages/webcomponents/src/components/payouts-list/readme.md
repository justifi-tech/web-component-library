# justifi-payouts-list



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute | Description | Type                                    | Default     |
| ------------------- | --------- | ----------- | --------------------------------------- | ----------- |
| `clearParams`       | --        |             | `() => void`                            | `undefined` |
| `params`            | --        |             | `PayoutsTableFilterParams`              | `{}`        |
| `setParamsOnChange` | --        |             | `(name: string, value: string) => void` | `undefined` |


## Dependencies

### Used by

 - [payouts-list-core](.)

### Depends on

- [table-filters-menu](../../ui-components/filters)
- [form-control-date](../../ui-components/form)

### Graph
```mermaid
graph TD;
  payouts-list-filters --> table-filters-menu
  payouts-list-filters --> form-control-date
  table-filters-menu --> custom-popper
  form-control-date --> form-control-tooltip
  form-control-date --> form-control-error-text
  form-control-tooltip --> custom-popper
  payouts-list-core --> payouts-list-filters
  style payouts-list-filters fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
