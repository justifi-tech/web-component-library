# justifi-business-info



<!-- Auto Generated Below -->


## Properties

| Property              | Attribute               | Description | Type      | Default                  |
| --------------------- | ----------------------- | ----------- | --------- | ------------------------ |
| `allowOptionalFields` | `allow-optional-fields` |             | `boolean` | `false`                  |
| `authToken`           | `auth-token`            |             | `string`  | `undefined`              |
| `businessId`          | `business-id`           |             | `string`  | `undefined`              |
| `formTitle`           | `form-title`            |             | `string`  | `'Business Information'` |
| `hideErrors`          | `hide-errors`           |             | `boolean` | `false`                  |
| `removeTitle`         | `remove-title`          |             | `boolean` | `false`                  |
| `testMode`            | `test-mode`             |             | `boolean` | `false`                  |


## Events

| Event         | Description | Type                                  |
| ------------- | ----------- | ------------------------------------- |
| `click-event` |             | `CustomEvent<BusinessFormClickEvent>` |


## Dependencies

### Depends on

- [justifi-business-core-info-form-step](business-core-info)
- [justifi-legal-address-form-step](legal-address-form)
- [justifi-additional-questions-form-step](additional-questions)
- [justifi-business-representative-form-step](business-representative)
- [justifi-business-owners-form-step](business-owners)
- [justifi-business-bank-account-form-step](bank-account)
- [justifi-business-document-upload-form-step](document-uploads)
- [justifi-business-terms-conditions-form-step](terms-and-conditions)
- [form-alert](../../form/form-helpers/form-alert)

### Graph
```mermaid
graph TD;
  justifi-payment-provisioning --> justifi-business-core-info-form-step
  justifi-payment-provisioning --> justifi-legal-address-form-step
  justifi-payment-provisioning --> justifi-additional-questions-form-step
  justifi-payment-provisioning --> justifi-business-representative-form-step
  justifi-payment-provisioning --> justifi-business-owners-form-step
  justifi-payment-provisioning --> justifi-business-bank-account-form-step
  justifi-payment-provisioning --> justifi-business-document-upload-form-step
  justifi-payment-provisioning --> justifi-business-terms-conditions-form-step
  justifi-payment-provisioning --> form-alert
  justifi-business-core-info-form-step --> form-control-text
  justifi-business-core-info-form-step --> form-control-select
  justifi-business-core-info-form-step --> form-control-date
  justifi-business-core-info-form-step --> form-control-number-masked
  form-control-text --> form-control-help-text
  form-control-text --> form-control-error-text
  form-control-select --> form-control-help-text
  form-control-select --> form-control-error-text
  form-control-date --> form-control-help-text
  form-control-date --> form-control-error-text
  form-control-number-masked --> form-control-help-text
  form-control-number-masked --> form-control-error-text
  justifi-legal-address-form-step --> form-control-text
  justifi-legal-address-form-step --> form-control-select
  justifi-additional-questions-form-step --> form-control-monetary
  justifi-additional-questions-form-step --> form-control-select
  justifi-additional-questions-form-step --> form-control-text
  form-control-monetary --> form-control-help-text
  form-control-monetary --> form-control-error-text
  justifi-business-representative-form-step --> form-control-text
  justifi-business-representative-form-step --> form-control-number-masked
  justifi-business-representative-form-step --> form-control-date
  justifi-business-representative-form-step --> justifi-identity-address-form
  justifi-identity-address-form --> form-control-text
  justifi-identity-address-form --> form-control-select
  justifi-business-owners-form-step --> justifi-owner-form
  justifi-owner-form --> form-control-text
  justifi-owner-form --> form-control-number-masked
  justifi-owner-form --> form-control-date
  justifi-owner-form --> justifi-identity-address-form
  justifi-business-bank-account-form-step --> form-control-text
  justifi-business-bank-account-form-step --> form-control-select
  justifi-business-document-upload-form-step --> justifi-skeleton
  justifi-business-document-upload-form-step --> justifi-business-documents-on-file
  justifi-business-document-upload-form-step --> justifi-business-document-upload-input-group
  justifi-business-document-upload-input-group --> form-control-file
  form-control-file --> form-control-help-text
  form-control-file --> form-control-error-text
  justifi-business-terms-conditions-form-step --> justifi-business-terms-conditions-text
  justifi-business-terms-conditions-form-step --> form-control-checkbox
  form-control-checkbox --> form-control-help-text
  form-control-checkbox --> form-control-error-text
  style justifi-payment-provisioning fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
