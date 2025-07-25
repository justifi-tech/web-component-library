### Changelog

## 5.7.5

### Patch Changes

- ad59f97: Fix: improve document uploading from `justifi-payment-provisioning` and `justifi-dispute-management` components. Ensures correct encoding when uploading files.

## 5.7.4

### Patch Changes

- 228c953: Fix alignment issues and useability of card form by adding field labels to both expiration fields

## 5.7.3

### Patch Changes

- fddf91e: Update the document upload requirements in `justifi-payment-provisioning`. Users now only need to upload either a `voided_check` or a `bank_statement` document to complete the form. Users are no longer required to upload both documents to proceed.

## 5.7.2

### Patch Changes

- c767321:
  - `justifi-payment-provisioning`: fixed issue causing network error when posting terms and conditions in the final form step
  - `justifi-business-details`: refactored component to stop sections from rendering when there is no appropriate data to render, improved general stability of component
- 56b7253: Return the validation error message on the error-event from the justifi-tokenize-payment-method component

## 5.7.1

### Patch Changes

- d3f1f73: - Show `expedited` value in `justfi-payment-details` web component
  - Show `settlement_priority` value in `justifi-payout-details` web component
- 1b1f2a3: Improved stability and efficiency initiating API requests across web component library.
- c74544f: Fixed bug where component cleanup triggered console error relating to component analytics.

## 5.7.0

### Minor Changes

- 1019007: - Add `tableHead`, `tableHeadRow`, `tableFoot`, `tableFootRow`, `tableFootCell`, `paginationButtonDisabled`, and `dropdownMenuButton` css parts
  - Rename `paginationItem*` css parts to `paginationButton*`
  - Refactor tables to use table UI components internally, for consistent assignment of css parts and classes

### Patch Changes

- 7b4b871: `justifi-payment-details` and `justifi-payout-details` will now only show `Metadata` section if payment or payout contains `metadata`.

## 5.6.1

### Patch Changes

- 700fb4d: Update tooltip and error text for `tax_id` (SSN / EIN) field in the first form step of the `justifi-payment-provisioning` component. Tooltip and error text has been updated to clarify that tax ID value must be entered without dashes or hyphens.
- e23dcf8: Add new CSS parts for list components to allow more control and customization when styling components: `table-row`, `pagination-item`, `pagination-item-text`, `pagination-item-icon`, `pagination-item-icon-next`, and `pagination-item-icon-previous`.

## 5.6.0

### Minor Changes

- 5b16225: Added new web component: `justifi-payment-transactions-list` allows users to list transactions associated with a given payment.
- 811eefa: Added new web component: `justifi-payout-transactions-list` allows users to list transactions associated with a given payout.

## 5.5.0

### Minor Changes

- a661718: Add new component: `justifi-refund-payment`. Can be used to render a form for partially or fully refunding a payment based on a provided payment ID.

### Patch Changes

- 97a2514: Use a more correct CSS part in the terminal-quantity-selector card compoonent on the Order Terminals to fix background issue
- 0c00f63: Add new CSS part `input-adornment` used to target and style input adornment shown on inputs related to monetary amounts.
- 79cb8d7: If showing `order_type` column on `justifi-terminal-orders-list`, display value will now be converted from snake_case to a more readable format. `boarding_only` will now display as `Boarding Only`, and `boarding_shipping` will now display as `Boarding & Shipping`
- cbd1981: `justifi-tokenize-payment-method` and `justifi-checkout`: Add new boolean prop `hide-bank-account-billing-form` which can be used to hide the billing form entirely when entering new bank account payment methods. While this prop will hide the inputs, account holder address information may still be required to successfully tokenize a new bank account payment method. Developers choosing to implement this new prop will need to programmatically call the `fillBillingForm` method on the component to successfully supply address information to the tokenize request payload.
- 1d298b0: `justifi-terminal-orders-list` shows new terminal order statuses returned from API response: `in_progress`, `on_hold`, `canceled`. The matching filter component `justifi-terminal-orders-list-filters` now also shows these options when filtering by order status.
- a06cac1: - `justifi-tokenize-payment-method` and `justifi-checkout`: If using `disable-credit-card` or `disable-bank-account` props then the payment method radio button input will be hidden.
  - `justifi-tokenize-payment-method` and `justifi-checkout`: added `validate()` method which can be programatically called on the component to trigger form validation on new card and bank account payments.
- 24b6637: Fix background issue by removing background part from inputCheckbox part

## 5.4.4

### Patch Changes

- cff6ebe: - Updated name of column on `justifi-terminals-list` from `Provider ID` to `Device ID`
  - Fixed bug in `justifi-order-terminals` where header for address section was not rendered correctly.

## 5.4.3

### Patch Changes

- 8b36dc5: Add new optional column to `justifi-terminal-orders-list`: `company_name` - which will show the name of the business associated with a given terminal order.
- bd84820: Add the `submitButtonText` prop to `justifi-order-terminals` component and change the Address header text when `shipping` is set to false.

## 5.4.2

### Patch Changes

- 1e592bd: Added the shipping address information to the justifi-order-terminals component and format phone number.

## 5.4.1

### Patch Changes

- 2e88842: - Add new filter input to `justifi-terminals-list-filters`, allowing users to filter terminals in the list according to a given terminal order ID.
  - Add new option to `status` filter input in `justifi-terminals-list-filters`: `pending_configuration`.
- 21a47db: Update the `justifi-order-terminals` component to not show an error state, but only emit the `error-event`.
- 40394dd: - Added new optional columns to render in `justifi-terminals-list`: `id`, `model_name`, and `provider`.

## 5.4.0

### Minor Changes

- 1c7ae3e: - Added new web components for ordering and managing terminal devices.
  - `justifi-order-terminals` will render a form that can be used to order new terminal devices for a given account.
  - `justifi-terminal-orders-list` will render a list of existing terminal orders for a given account.
    - The list component can be rendered alongside the optional `justifi-terminal-orders-list-filters` which can be used to sort orders by status, type, and date.

## 5.3.6

### Patch Changes

- 9f3e33b: - Fixed submit error that sometimes occured in `justifi-payment-provisioning` component's final form step.
- a2217b4: Fix bug with the justifi-checkout, card-form and bank-account not loading due to malformed iframe-origin URL

## 5.3.5

### Patch Changes

- 6a62246: - Reverted change introduced in 5.3.3 to `justifi-terminals-list` - aa808c7
  - The table column that displays the `provider_id` value has had its column header restored to it's original value: `Provider ID`.
  - Added new table column to display `provider_serial_number` property from terminal response.
  - `provider_serial_number` column is now loaded by default in the table, replacing `provider_id` column.
    - `provider_id` column is no longer shown by default on the component, but is still available to use when using the `columns` prop to configure the columns shown in the table.
- b603433: - Fixes issue in `justifi-checkouts-list-filters` where the Payment Mode filter sends incorrect value and returns an API error. Payment Mode filter now correctly sends `ecom` or `bnpl` when input selection is made.
- e61f36a: - Surface `justifi-dispute-response` file pre-signing errors in the UI
  - Fix typos in `justifi-dispute-notification` messages
  - Fix `justifi-dispute-response` evidence type name: `cancellation_policy_file` -> `cancellation_policy`
  - Update `justifi-dispute-response` "Service Date" to use a date selector
  - Clear/replace file selections in `justifi-dispute-response` when file selection changes. Change handler for file inputs has been abstracted for consistency.

## 5.3.4

### Patch Changes

- 2c1248e: - Internal improvements and minor refactors for component library.

## 5.3.3

### Patch Changes

- 6ef218e: - Added new optional props to `justifi-terminals-list-filters` allowing prescribed filter selections. The following props are now available: `terminal-status` and `terminal-id`.
  - Values passed via these props will be automatically applied to the `justifi-terminals-list`'s API requests as query params.
  - If a value is passed to these props, the corresponding input in the filter menu UI will be disabled.
  - Add new CSS parts to `justifi-terminals-list-filters` to allow for more customization. The following parts have been added: `terminals-list-filter-menu`, `terminals-status-terminals-list-filter-param`, and `terminal-id-terminals-list-filter-param`.
- c39e6a2: - Added new optional props to `justifi-checkouts-list-filters` allowing prescribed filter selections. The following props are now available: `checkout-status` and `payment-mode`.
  - Values passed via these props will be automatically applied to the `justifi-checkouts-list`'s API requests as query params.
  - If a value is passed to these props, the corresponding input in the filter menu UI will be disabled.
  - Add new CSS parts to `justifi-checkouts-list-filters` to allow for more customization. The following parts have been added: `checkouts-list-filter-menu`, `checkout-status-checkouts-list-filter-param`, and `payment-mode-checkouts-list-filter-param`.
- 685bd08: - Added new optional props to `justifi-payouts-list-filters` allowing prescribed filter selections. The following props are now available: `created-before` and `created-after`.
  - Values passed via these props will be automatically applied to the `justifi-payouts-list`'s API requests as query params.
  - If a value is passed to these props, the corresponding input in the filter menu UI will be disabled.
  - Add new CSS parts to `justifi-payouts-list-filters` to allow for more customization. The following parts have been added: `payouts-list-filter-menu`, `created-after-payouts-list-filter-param`, and `created-before-payouts-list-filter-param`.
  - Resolved bug in `justifi-payments-list-filters` where values passed as `created-before` prop were not correctly applied to component API requests.
- aa808c7: - Updated data column header in `justifi-terminals-list` from `Provider ID` to `Serial Number`
- 8fba7cc: - Fixed bug in `justifi-payouts-list` where downloading the payout CSV could return an error from a bad request.
  - Updated behavior of `click-event` in `justifi-payouts-list` to not emit when clicking on the CSV download link.

## 5.3.2

### Patch Changes

- eeca5f7: - Updated `justifi-tokenize-payment-method` so that calling `tokenizePaymentMethod()` method now returns the full response or error from the request, instead of `void`.
- f5696d9: - Updated `justifi-payment-provisioning` bank account form step. The account number field's minimum character count has been reduced to 4 to allow for shorter bank account numbers to be entered.

## 5.3.1

### Patch Changes

- Internal refactors and improvements to improve component stability.

## 5.3.0

### Minor Changes

- e14badd: - Removed document upload form step from `justifi-payment-provisioning` component.
  - Adds file upload inputs for `voided_check` and `bank_statement` to the bank account form step in `justifi-payment-provisioning`
- dd9af3e: - Updated terms and conditions form step in `justifi-payment-provisioning` component. Removed terms / agreement text from the form and replaced with link to merchant agreement page on Justifi Website: `https://justifi.tech/merchant-agreement/` which contains the same text.

### Patch Changes

- 9a8c0eb: - Added new optional props to `justifi-payments-list-filters` allowing prescribed filter selections. The following props are now available: `payment-id`, `terminal-id`, `payment-status`, `created-after`, and `created-before`.
  - Values passed via these props will be automatically applied to the `justifi-payments-list`'s API requests as query params.
  - If a value is passed to these props, the corresponding input in the filter menu UI will be disabled.
  - Add new CSS parts to `justifi-payments-list-filters` to allow for more customization. The following parts have been added: `filter-menu`, `payment-id-payments-list-filter-param`, `terminal-id-payments-list-filter-param`, `payment-status-payments-list-filter-param`, `created-after-payments-list-filter-param`, `created-before-payments-list-filter-param`

## 5.2.0

### Minor Changes

- 73fa260: Increments the `justifi-tokenize-payment-method` `submit-event` payload to return also the full api's `payment-methods` payload response

## 5.1.0

### Minor Changes

- be401fb: - Added new prop `hideCardBillingForm` to `justifi-checkout` and `justifi-tokenize-payment-method` components. When this prop is passed to either component, new credit card payment methods will render with an alternate billing form that only renders the `address_postal_code` field.

### Patch Changes

- 607ce8f: - List and detail components that show monetary amounts will now always include the currency returned from the API response.
- 0d956c0: Added loading skeletons for all components. The skeletons can be styled using the `skeleton` part
- f172279: Update detail and list components to use new Badge ui component which helps to enforce consistent assignment of css parts to badges
- 8a7ec70: Adds a `checkout-summary` part so the Summary section on the `justifi-checkout` can be hidden
- ec52599: - Fixed broken prop on `justifi-tokenize-payment-method` - `hide-submit-button` will now correctly prevent the default submit button from rendering.
- 5e852d6: - Improved stability of bank-account form step in `justifi-payment-provisioning` component.

## 5.0.0

### Major Changes

- d86c3a4: Refactored the styling approach for web components by introducing CSS parts to enable more customizable and modular styling.
- 0d5b0e6: Removed the `justifi-payment-form`. Please use `justifi-tokenize-payment-method` component instead.
- c980c4a: Updated list components by abstracting filter menus to their own components which can be rendered optionally alongside their respective list components. Allowing more customization and flexibility when it comes to implementing list components by allowing independent placement of filter menus.
  - `justifi-payments-list` can now be rendered with `justifi-payments-list-filters`
  - `justifi-payouts-list` can now be rendered with `justifi-payouts-list-filters`
  - `justifi-terminals-list` can now be rendered with `justifi-terminals-list-filters`
  - `justifi-checkouts-list` can now be rendered with `justifi-checkouts-list-filters`
- a44d4f5: - Web component event names are now consistently named across the entire component library, and all updated to reflect present tense naming convention.
  - Components that emitted `submitted` event now emit `submit-event`. This includes: `justifi-payment-provisioning`, `justifi-checkout`, `justifi-tokenize-payment-method`, `justifi-dispute-management` and `justifi-business-form`.
    - 41af0ca: - `submit-event` no longer returns response as `event.detail.data` and now returns server response as `event.detail.response`.
    - e6d0715: - Modified behavior of `submit-event` event emitted from `justifi-payment-provisioning`
      - `submit-event` is no longer emitted after each form step completion of `justifi-payment-provisioning`. It is now emitted only once, at the end of the form flow, when a response is received from the provisioning API request.
    - NOTE: In line with this change, the `submit-event` for `justifi-tokenize-payment-method` now returns the entire server response instead of just the token. Going forward, users of this component will be able to access the token via `event.detail.response.token`.
  - List components that emitted events for clicking on table rows will now emit `click-event` in line with other components that emit an event for user clicks actions.
  - `justifi-payments-list` no longer emits `payment-row-clicked` - use `click-event` to listen for table row clicks
  - `justifi-payouts-list` no longer emits `payout-row-clicked` - use `click-event` to listen for table row clicks
  - `justifi-checkouts-list` no longer emits `checkout-row-clicked` - use `click-event` to listen for table row clicks
  - `justifi-terminals-list` no longer emits `terminal-row-clicked` - use `click-event` to listen for table row clicks
  - List components will also now emit `click-event` on pagination interaction (IE - clicking on `Next` or `Previous` page)
  - Form components `justifi-payment-provisioning` and `justifi-dispute-management` now emit `complete-form-step-event` instead of `form-step-completed` on step completion.
    - If applicable, server responses will now be returned in this event as `response`. If needed, the response can be accessed via `event.detail.response`.
  - `justifi-business-form` no longer emits deprecated `clickEvent` - only emits `click-event` in line with other components.

### Minor Changes

- c1839e9: Add `justifi-dispute-management`, `justifi-dispute-notification`, and `justifi-dispute-response` components
- a5fc8db: Add new `CardForm` and `BankAccountForm` components with individual iframes for each input field

## 4.23.1

### Patch Changes

- 6705772: - Adjusted minimum character length for bank account number field in bank account form step of `justifi-payment-provisioning` component. The minimum character length has been adjusted from 8 to 7.

## 4.23.0

### Minor Changes

- c070ca4: - Add new optional prop to `justifi-payments-list` component: `columns`.
  - This prop allows implementers manually set the columns shown when the table is rendered by passing a comma separated string of keys. Columns can be set to show or hide via this prop, or re-ordered.
- 4d43aaa: - Refactored `justifi-payouts-list` component.
  - Adjusted column names and layout - removed certain columns such as `Type`, and `Paid Out To`.
  - Removed column header for `Actions` column, and updated CSV download icon to link displaying `CSV`
  - Added new optional prop: `columns` - can be used to sort order of columns, and manually hide/show columns.
  - Added new filter menu, moved start and end date filters inside menu.
- 295d768: - Updated validation for multiple fields in `justifi-payment-provisioning` component - most text fields will now allow special characters in addition to alphanumerical characters.

### Patch Changes

- 03da843: - Improved functionality of date inputs across component library.

## 4.22.2

### Patch Changes

- 1e07117: - Updated validation for account owner field in bank account form step of `justifi-payment-provisioning` component - this field will now accept numbers and some special characters.

## 4.22.1

### Patch Changes

- 4b3ea18: - Refactor render timing for list components that use new `columns` prop

## 4.22.0

### Minor Changes

- 78cc46c: - Added new component: `justifi-checkouts-list` allows users to list and filter checkout sessions associated with their account.
- 77f76aa: - Added new component: `justifi-tokenize-payment-method` allows tokenization of payment methods without creating a payment. This component will replace `justifi-payment-form` in the next major release.
- 47b5b47: - Added new component: `justifi-terminals-list` allows users to list and filter terminal data associated with a particular account.

## 4.21.0

### Minor Changes

- 0415586: - Refactored several form input labels in `payment-provisioning` component
  - Optional fields now include `(optional)` in their form input labels
  - Added tooltips to several fields in the `payment-provisioning` component. Tooltips render as a bootstrap SVG icon that will display help text when hovered with a mouse.
- 7d565b9: - Implemented small conditional render logic to the `additional_questions` form step of the `payment-provisioning` component.
  - `business_recurring_payments_percentage` field is only shown if the value of `business_recurring_payments` === `Yes`
- dfa05d2: - Committed the following updates to the `payments-list` component:
  - Removed `Payment ID` column
  - Updated column name `Card Holder` to now say `Account Holder`
  - Now showing currency type in `Amount` column
  - Added `Type` column to show Card and ACH payments
  - Changed wording of `Successful` payment status badge to `Succeeded`
  - Added `Canceled` payment status badge for canceled payments
  - Updated start and end date filter inputs to allow user to choose times, allowing for even more granular payment filtering
- da46c7a: - Added new event to `payment-provisioning` component: `form-step-completed`
  - This event will be emitted at the end of every form step in the `payment-provisioning` component.
  - Event payload contains server response, as well as the name of the completed form step.
  - Noted optional fields in the `document_upload` step of the `payment-provisioning` component by adding `(optional)` to the input label.

## 4.20.1

### Patch Changes

- fc3c4c6: - Added `payment_id` search filter to table filter menu in `payments-list` component. Users may now filter the list down to a specific payment based on a provided `payment_id`.

## 4.20.0

### Minor Changes

- 62ca009: - Add new filter menu to `payments-list` component. Contains previously shown start and end date filters, along with two new filters: terminal_id and payment_status.
  - Add lodash as a project dependency for debouncing input handlers.
  - Add popper.js as a project dependency.

## 4.19.3

### Patch Changes

- b48f8a0: Use environment variables and point iframe components to `iframe-components` application rather than `payments-js`

## 4.19.2

### Patch Changes

- 33fb666: Refactor POST/PUT/PATCH api calls so that payloads are stringified in the Api.ts rather than each instance

## 4.19.1

### Patch Changes

- 092528d: - Updated option label for Business Classification in `PaymentProvisioning` component. The option labeled `Limited` is now displayed as `Limited Liability Company (LLC)`

## 4.19.0

### Minor Changes

- 1055ae0: - Ensure `error-event` is being emitted appropriately from each step and is of type `ComponentError`
  - Optimized render logic and stability of `PaymentProvisioning` form steps

### Patch Changes

- 016af86: Create a Button ui component abstraction and use it in place of some of our submit buttons with loading states
- fa9acf6: Fix Safari style bug on payment-method-form
- 45eab05: -Fix bug in `PaymentProvisioning` component's document upload step where loading state is not removed if document upload request fails.
- b2b37a4: Sends data to analytics from season-interrption-insurance component

## 4.18.0

### Minor Changes

- e17c1a4: Added a date range filter on PaymentsList and PayoutsList components
- ca31471: Adds a button for exporting payout details in a CSV files to payout details and payouts list pages

### Patch Changes

- 764dec4: - Fixed bug in `PaymentProvisioning` and `BusinessForm` components preventing users from submitting entity data if data contains `associated_account` or `terms_conditions_accepted` properties.
- bce7242: Fix issues with PaymentProvisioning theming capabilities

## 4.17.0

### Minor Changes

- d1d9654: - Added new feature to `Checkout` component that allows users to save new payment methods. If the checkout session has an associated `payment_method_group_id` then users will see a checkbox allowing them to save a new Credit Card or Bank Account payment method for future use.
- 4b0f66b: Add `fillBillingAddress` method to Checkout component
- 3150b9a: - Moved `insurance` option above payment methods in `Checkout` component
  - Disable BNPL payment method in `Checkout` component if insurance is accepted by user.
- f6b1e74: - Updated field labels in `PaymentProvisioning` component.
  - `Tax ID` field label has been updated to `Tax ID (EIN or SSN)`
  - `SSN` field label no longer changes to `Update SSN (optional)` if submitting this form step again after the first time.

### Patch Changes

- 3d20448: Hides saved credit card/bank account payment methods when `disable-credit-card` or `disable-bank-account` props are true
- a495cbc: - Fixed mispelled word in the additional questions form step for the `PaymentProvisioning` component. `activies` => `activities`
- 15c714d: - Fixed bug in `Checkout` component with insurance where checkout session could be "completed" without making an insurance selection. It is now required to accept or decline insurance before completing a checkout with insurance.

## 4.16.0

### Minor Changes

- 1ef4956: - Updated `BusinessForm` and `PaymentProvisioning` components to incorporate new business `classification` property, replaces fields for deprecated properties `business_structure` and `business_type`.
- ea4eff5: - Updated error handling for network requests in `PaymentProvisioning` component.
  -Component no longer renders visible alert in cases where network requests fail. It now emits an event, `error-event`, in line with other web components, allowing implementing developers to handle server errors as they see fit.
  - Removed prop `hideErrors` from `PaymentProvisioning` as it is no longer applicable.
- f549265: - Added new form step to `PaymentProvisioning` component to accept JustiFi terms and conditions.
- c2a2f56: Add new season-interruption-insurance component
- b8c422b: `PaymentProvisioning` - added form step for uploading documents required for provisioning payments product.
- c745fe4: - Optimized render logic in `PaymentProvisioning` for better efficiency, stability, and performance.
  - Removes prop `removeTitle` from `PaymentProvisioning` component.
    - The `formTitle` prop can be used to remove the title by passing an empty string.
- 722b929: - `PaymentProvisioning` - added new form step for posting bank account data.
- aa11b6e: - `PaymentProvisioning` component now attempts to make POST request to provision payments product once the terms and conditions form step has been completed.
  - Upon response from the provisioning request, the component will emit `submitted` event.
  - When loading the component for a business that has already submitted a provisioning request, an `error-event` will be emitted with the error code: `provisioning-already-requested`, and the form buttons will be disabled.
- Default `justifi-season-interruption-insurance` loading state to `true`
- Move `validate` functionality to `justifi-season-interruption-insurance-core` and call it using a ref from within `justifi-season-interruption-insurance`
- Update `insurance-state.ts` exports to include `insuranceValuesStore` and `insuranceErrorsStore`

### Patch Changes

- 9745efb: Fix a console error caused by Analytics
- d11298e: - Added table to document upload form step in `PaymentProvisioning` component - shows already uploaded documents
  - Adjusted validation logic for document upload form step to take into account already uploaded documents
    - Example: If a document, such as `voided_check`, has already been uploaded, then form validation will NOT fire and user will NOT be required to submit a new document to proceed.
- f2e7847: - Added legend text to Business Owners form step in `PaymentProvisioning` component
  - Adjusted weight and size of legend text that heads each individial owner form rendered in this step.
  - Removed duplicated styles and ensured top level `PaymentProvisioning` and `BusinessForm` are properly contained within shadow dom.
    - children components of `PaymentProvisioning` and `BusinessForm` share style sheets where appropriate now, to improve styling logic and remove bloat.
- 8cdabd8: - Improved internal component testing for form input components to ensure reliabiltiy and performance.
  - Optimized render logic for form specific components for greater efficiency.
  - General project improvements such as removing dead code, merging duplicate files, etc.

## 4.15.0

### Minor Changes

- 4f834b7: - Added new props to `Checkout` component:
  - `disable-credit-card`: Disables new credit card payment method option
  - `disable-bank-account`: Disable new bank account payment method option
  - `disable-bnpl`: Disable BNPL payment method option
  - `disable-payment-method-group`: Disable saved payment methods option

### Patch Changes

- 5820727: - `BusinessForm` and `PaymentProvisioning` components: Added conditional logic to require SSN for representatives and owners if `ssn_last4` is missing or null.
  - Labels for SSN field conditionally update now. If `ssn_last4` is already defined for the given identity, the label shown will be `Change SSN (optional)` as opposed to `SSN`.
- f304a5e: - Improved form validations for billing form fields in `PaymentForm` and `Checkout` components
- d9b1e8c: - Fully resolved issue with the `PaymentForm` component props that show the bank-account form.

## 4.14.0

### Minor Changes

- 0183890: Add `authToken` prop to PaymentForm
  Update `Authorization` section in docs

### Patch Changes

- 0189492: Fix issue with PaymentForm where card form is being shown instead of bank account form when card prop is false and bank-account prop is true

## 4.13.0

### Minor Changes

- 548148c: Add 'error' and 'submitted' events to Checkout component
- 30e7011: - Add: Handle Checkout component errors from tokenize calls (new payment methods)
  - Add: Handle Checkout component errors from checkout.complete calls (paying the checkout, possibly with the token from tokenize)
  - Fix: Reset Checkout component isLoading state when new-payment-method form has client-side errors
- `BusinessForm` and `PaymentProvisioning` components: Updated Additional Questions form section
  - removed existing input fields meant to capture `business_dispute_volume` and `business_receivable_volume`
  - Updated questions / labels to be more clear for fields capturing `business_revenue` and `business_payment_volume`
  - Added input fields to capture the following data: `business_when_service_received`, `business_recurring_payments`, `business_recurring_payments_percentage`, `business_seasonal`, and `business_other_payment_details`
  - Improved form validation for each input field in this section.

### Patch Changes

- bad4f86: - `PaymentProvisioning` and `BusinessForm` components: updated address validation to prevent users from submitting PO Box addresses.

## 4.13.0-rc.0

### Minor Changes

- 548148c: Add 'error' and 'submitted' events to Checkout component

### Patch Changes

- bad4f86: - `PaymentProvisioning` and `BusinessForm` components: updated address validation to prevent users from submitting PO Box addresses.

## 4.12.2

### Patch Changes

- 44bef77: - Fixed bug preventing `CardForm` and `BankAccountForm` from consistently emitting `ready` event.
- 7eb227a: - `BusinessForm` and `PaymentProvisioning` - revert change that removed `business_structure` option from form in.

## 4.12.1

### Patch Changes

- 2cdfe07: - BusinessForm and PaymentProvisioning - Improved form validations for representative and owner sections.
- a445df6: - BusinessForm and PaymentProvisioning - fix bug preventing `identity.identification_number` from being included in data submitted via forms.

## 4.12.0

### Minor Changes

- b94482f: Add new CSS variables and styling capabilities to Checkout component:
  ```
    --jfi-body-color
    --jfi-header-color
    --jfi-header-border
    --jfi-radio-button-box-shadow-focus
    --jfi-radio-button-border-color-focus
    --jfi-radio-button-group-color
    --jfi-radio-button-group-color-hover
    --jfi-radio-button-group-divider
    --jfi-radio-button-group-background-color
    --jfi-radio-button-group-background-color-hover
    --jfi-submit-button-line-height
    --jfi-submit-button-text-transform
    --jfi-error-message-color
  ```
- b0eb85b: - BusinessForm and PaymentProvisioning - added new optional prop, `form-title`, which allows devs to add their own custom title to override the default `Business Information`.
  - BusinessForm and PaymentProvisioning - added new optional prop, `removeTitle`, which allows devs to remove the existing title altogether.
- b5d079e: - Improved validation rules for first section of BusinessForm and PaymentProvisioning components.
  - Removed `business_structure` input field from both BusinessForm and PaymentProvisioning components.
  - Removed `business_structure` property from BusinessDetails component.
  - `tax_id` is now required by default for both BusinessForm and PaymentProvisioning components.

### Patch Changes

- eb300a4: - PaymentProvisioning component - fixed bug that allowed individual owner form to be submitted without proper form validation.
- b2839c8: - BusinessForm and PaymentProvisioning components: added single date input to replace 3 separate date inputs used to manage birth day, birth month, and birth year.

## 4.11.0

### Minor Changes

- 3b0a6af: Added disableSubmitButton method to PaymentForm
- fc2121d: PaymentProvisioning - allow users to return to previous step without needing to validate and submit data on their current form step.
- df2d640: - Made improvements to input logic and validation in address forms found in BusinessForm and PaymentProvisioning components:
  - Show `country` field in address forms for Representative and Owners. Field is disabled currently, but autofills with `USA`.
  - In BusinessForm - converted text input for `state` value to dropdown / select menu. Now matches input on PaymentProvisioning.
  - Improved validation logic for various address fields: Street Address Line 1, Street Address Line 2, City, and Postal Code
  - Postal Code fields - limited to 5 characters and numerical values only.
- 79a6924: Added an error-event to all components
- eb9efb6: PaymentProvisioning component - Added optional prop, `allow-optional-fields`, to allow for quicker form completion with less strict validation requirements.

### Patch Changes

- 5b2b354: PaymentProvisioning and BusinessForm - updated Select Menu labeled Prefix in Representative and Owner Forms to now be Text Input labeled Title
- 5532595: - Added documentation support for events emitted by PaymentProvisoning component: `submitted`, and `click-event`.
  - Updated event naming for BusinessForm - `click-event` is now available to use in place of `clickEvent`.
    - `clickEvent` is still available for now, but will be deprecated in a future release in favor of `click-event`
  - BusinessForm and PaymentProvisoning - updated docs to show `hide-errors` prop for both components.
    - Default is `false`.
    - When set to `true` - hides error alerts from appearing in form, allowing developers more control over how they handle errors communicating from the form to the Justifi API.

## 4.10.0

### Minor Changes

- b997fa1: - Renamed BusinessFormStepped component to PaymentProvisioning
  - Repaired PaymentProvisioning component so it can be used to manage business/entity data:
  - Refactor each form step inside PaymentProvisioning to act as individual form, handle data retrieval and submission independent of their parent component.
  - Fixes bug where form steps are broken if received data is null.
  - In the business address step - updated text input for State to dropdown menu with State options with improved validation
  - Re-implement form step to PaymentProvisioning that manages owner data.
    - Owner identities are now updated using sub forms that use the `identities` endpoint
    - Upon submit the `business-owner-form-step` component patches the list of identity IDs associated with the business
    - On the owner form step creating or editing an owner will emit a submitted event
  - If fetching or patching business data returns a server error an alert dialog is shown at the top of current step in PaymentProvisioning
  - Completing a form step in PaymentProvisioning emits a submitted event which contains a metadata property used to specify which form step was completed

### Patch Changes

- b997fa1: - Consolidate directories for Business Form Components - business-form and payment-provisioning now exist in a parent directory with helpers, schemas, utils shared between them.
  - Updated method names in address form components to fix console warning from Stencil

## 4.10.0-rc.0

### Minor Changes

- b997fa1: - Repaired business-form-stepped component so it can be used to manage business/entity data:
  - Refactor each form step inside business-form-stepped to act as individual form, handle data retrieval and submission independent of their parent component.
  - Re-implement form step to business-form-stepped that manages owner data.
    - Owner identities are now updated using sub forms that use the `identities` endpoint
    - Upon submit the `business-owner-form-step` component patches the list of identity IDs associated with the business
    - On the owner form step creating or editing an owner will emit a submitted event
  - If fetching or patching business data returns a server error an alert dialog is shown at the top of current step in business-form-stepped
  - Completing a form step in business-form-stepped emits a submitted event which contains a metadata property used to specify which form step was completed

### Patch Changes

- b997fa1: - Consolidate directories for Business Form Components - business-form and business-form-stepped now exist in a parent directory with helpers, schemas, utils shared between them.
  - Updated method names in address form components to fix console warning from Stencil

## 4.9.1

### Patch Changes

- 1aa8164: Update Checkout component Summary such that hard-coded mock data is replaced with real checkout data

## 4.9.0

### Minor Changes

- 9d8a9e4: Added new MVP Checkout component which make make client-side payments using saved payment methods or newly tokenized payment methods

### Patch Changes

- 9838108: Changed the `justifi-business-details` component to handle business created via API and without some attributes. This change will prevent the component from breaking because of missing properties.

## 4.8.3

### Patch Changes

- e4c9343: Change BusinessForm label from SSN/EIN to SSN

## 4.8.2

### Patch Changes

- 215fd59: Better handle country fallback option for business class in business forms

## 4.8.1

### Patch Changes

- a6885c6: Add 'USA' as fallback option for business legal address country in cases where country is null.

## 4.8.0

### Minor Changes

- 902b037: Implement error alerts to form components triggered on server error - alerts can be hidden via new optional prop: hideErrors.
- 44f6f11: - BusinessForm and BusinessFormStepped components require a `business-id` prop. The business will be loaded into the form and updated upon submit.
  - Removed POST (create) functionality from BusinessForm and BusinessFormStepped

### Patch Changes

- 902b037: Added event emitters to 'business-form' and 'business-form-stepped' for submit and click events
- aa5fbe9: Default `BusinessForm` legal address country to 'USA', and update select option value to 'USA' instead of 'US'
- 66e2266: Added the Bin Details to the Card-Form Tokenize response/event. The change will trickle down to the Payment-Form component. The addition of Bin Details is passing through the response from the Payment Method API call.
- 902b037: Fixed tax id field filling value from data
- 9f9dbc1: Fix BusinessGeneric info prefill when business is loaded
- 902b037: Improved table component render logic and unit test coverage for table component
- 7afac17: - Fix `BusinessForm` validations by using `Business` class to create a business instance on load and update validation schema

### 4.7.6

> 12 Feb 2024

- Remove `account-id` from BusinessFormStepped. This is not a breaking change as the `account-id` does not have an impact on loading a business, and will not error if left as a prop after upgrading

### 4.7.5

> 2 Feb 2024

- Fixed: events for `bankAccountFormValidate`, `bankAccountFormTokenize`, `cardFormValidate`, and `cardFormTokenize` are now being properly emitted

### 4.7.4

> 18 Jan 2024

- Fixed: added missing css parts for tables
- Fixed: prevent clicks on disabled pagination buttons

### 4.7.3

> 18 Jan 2024

- Fixed: added missing next-button pagination css part

### 4.7.2

> 16 Jan 2024

- Fixed text wrapping on Detail views
- Adjusted table component screen responsiveness
- Improved NPM Readme
- Added `GrossPaymentChart` component
- Added Storybook stories and documentation for `BusinessForm` components, and `GrossPaymentChart` component
- Refactored `Payment` and `Payout` types and classes
- Refactored render logic for `Payment` and `Payout` details and list components
- Improved error handling for all components

### 4.7.1

> 3 Jan 2024

- Remove sourcemaps from production build
- Fix CDN link version in readme

### 4.7.0

> 18 December 2023

- Added `BusinessDetails`
- Added `BusinessFormStepped`
- Updated `BusinessForm` layout (section spacing and headings)
- Removed console.log from `PaymentMethodForm` component
- Refactored `BusinessList` removing the mapping functions

### 4.6.4

> 12 December 2023

- Fallback to wc proxy when process is undefined in Api.ts

### 4.6.3

> 12 December 2023

- Fallback to wc proxy when process is undefined in Api.ts

### 4.6.2

> 1 December 2023

- Convert `README.mdx` to `README.md` to republish readme to NPM registry

### 4.6.1

> 30 November 2023

- Update `README.md` to have correct version in CDN link

### 4.6.0

> 23 October 2023

- Updated API enpoint to proxy service
- Updated `PaymentsList` to handle display of ACH payments

### 4.5.1

> 13 October 2023

- Fix iframe resize issue

#### 4.5.0

> 4 October 2023

- Added `PaymentDetails`
- Added `PayoutDetails`
- Added `ProceedsList`
- Added `BusinessList`
- Added `BusinessDetail`
- Added `AdditionalQuestions` and `LegalAddressForm` sub-form components to `BusinessForm`
- Updated `BusinessForm` to create a new business entity as well as load an existing one and update it
- Updated table pagination to use proper bootstrap pagination styles
- Updated `PaymentsList` and `PayoutsList` table headers and status badges to have descriptions on hover
- Updated `PaymentsList` and `PayoutsList` to emit events when a table row is clicked

#### 4.4.0

> 27 July 2023

- Added prop and event deprecation warnings to `CardForm` and `BankAccountForm` components
- Add font customizability to `CardForm`, `BankAccountForm`, and `PaymentForm` through the `--jfi-load-google-font` variable, allowing to load any font available in Google fonts.
- Add a `<slot name="insurance">` to the `PaymentForm` in order to embed insurance components later on.
- Add `PayoutsList` component (not production ready)
- `PaymentsList` component (not production ready)
  - added loading and error states
  - added bootstrap styling and exportparts for style overrides
  - added pagination
- `BusinessForm` component (not production ready)
  - added representative sub-form
  - added generic business info sub-form
  - changed `FormController` to be observable / rxjs based so that sub-components can subscribe to changes
  - added new select and text input form controls that are compatible with refactored `FormController`

#### 4.2.2

> 03 July 2023

- Hardcode production fallback `iframeOrigin` as it is not being set as intended via environment variables

#### 4.2.1

> 30 June 2023

- Use environment variables to set `iframeOrigin` in production build

#### 4.2.0

> 27 June 2023

- Add `resize` method to `CardForm` and `BankAccountForm`

#### 4.1.6

> 23 June 2023

- Add spinner indicator when `PaymmentForm` is submitting.
- Add `--jfi-submit-button-color-loading`, `--jfi-submit-button-background-color-loading` and `--jfi-submit-button-border-color-loading` variables to style the new loading state.

#### 4.0.0

> 08 May 2023

- Changed: `CardForm.tokenize`, `BankAccountForm.tokenize` and `PaymentForm.submitted` will now return the full response from the `payment_methods` endpoint instead of just `errors` or `token`. See the API documentation to see payment method CREATE sample responses: https://developer.justifi.ai/tag/Payment-Methods#operation/CreatePaymentMethod

Migration notes:

- Errors - instead of getting errors via `data.errors[0]`, which was an error code, you will now need to use `data.error.code`. There is also now a human readable message (`data.error.message`)
- Success/created payment method - instead of getting the token via `data.token`, it is nested within a full payment method response. In order to get the token you will need to use `data.card.token` or `data.bank_account.token` depending on what payment method type is being tokenized

#### 3.3.5

> 11 May 2023

- Add `:active` state to Submit button for `PaymentForm`

#### 3.2.5

> 11 May 2023

- Add styling and variables for radio buttons and submit button in `PaymentForm`

#### 3.1.5

> 04 May 2023

- Add missing dependencies.

#### 3.1.4

> 04 May 2023

- Fix missing url to show recently added introduction page.

#### 3.0.4

> 08 May 2023

- Add Storybook landing page with general info

#### 3.0.3

> 04 May 2023

- Fix unscoped reset styles issue, where bootstrap \_reboot.scss was being included in webcomponents.css

#### 3.0.2

> 04 May 2023

- Fix output pointing to empty file for stencil dist.

#### 3.0.1

> 3 May 2023

- Fix type error where `contentWindow` is `undefined`

#### 3.0.0

> 27 April 2023

- Remove `submit` method
- Add internal submit button with disabled state
- Add `submitted` event and emit when form is submitted and a response comes back from payment methods endpoint

#### 2.0.2

> 25 April 2023

- Improved documentation for `BankAccountForm`
- Improved documentation for `CardForm`
- Fix how controls and props are displayed and work for `CardForm`

#### 2.0.1

> 24 April 2023

- Fix: PaymentForm submit action in storybook
- Fix: include input-invalid css parts, and export them

#### 2.0.0

> 24 April 2023

- Remove prop `styleOverrides` from `CardForm`, `BankAccountForm` and `PaymentMethodForm` components
- Add CSS variable theming for `CardForm`, `BankAccountForm`, `PaymentMethodForm` and `PaymentForm`
- Add CSS `part` and `exportparts` to `TextInput` and `SelectInput`
- Add `exportparts` to `BillingForm` so that `TextInput` and `SelectInput` CSS `exportparts` are forwarded

#### 1.0.0

> 24 April 2023

- Fix broken prop controller in Storybook UI for card-form component
- rename variable `validationStrategy` and prop `validation-strategy` to `validationMode` and `validation-mode` respectively

#### 0.6.1

> 24 April 2023

- Remove hardcoded `iframeOrigin` from `PaymentForm` story

#### 0.6.0

> 21 April 2023

- Add `@stencil/sass` plugin `stencil-library`
- Add Twitter Bootstrap to `stencil-library`
- Add Bootstrap styling to `TextInput`, `SelectInput`, `BillingForm`, `PaymentForm`, and `PaymentMethodSelector`

#### 0.5.0

> 21 April 2023

- Allow `singleLine` to be passed to `CardForm` to render a single-line variant of `CardForm`

#### 0.4.0

> 18 April 2023

- Allow `legend` to be passed and conditionally rendered for `BillingForm`

#### 0.3.2

> 12 April 2023

- Add `PaymentForm` component
- Allow `iframeOrigin` to be passed to `PaymentForm`, `CardForm`, `BankAccountForm`, and `PaymentMethodForm`

#### 0.2.2

> 6 April 2023

- Update documentation and documentation examples to use cdn.jsdelivr instead of unpkg

#### 0.2.1

> 28 March 2023

- Pass component version along to tokenize calls so that it can be used in error reporting

#### 0.2.0

> 13 March 2023

- Add BillingForm component poc
- Add TextInput component
- Add SelectInput component

#### 0.1.15

> 14 February 2023

- FE-48 Add the LICENSE [`#26`](https://github.com/justifi-tech/web-component-library/pull/26)
- update PR templates main README, and add changelogs [`#23`](https://github.com/justifi-tech/web-component-library/pull/23)
- Yarn upgrade [`#22`](https://github.com/justifi-tech/web-component-library/pull/22)
- Add missing properties to theme [`#21`](https://github.com/justifi-tech/web-component-library/pull/21)
- Bump decode-uri-component from 0.2.0 to 0.2.2 in /react-library [`#6`](https://github.com/justifi-tech/web-component-library/pull/6)
- Update examples to include payment method metadata and code comments [`#19`](https://github.com/justifi-tech/web-component-library/pull/19)
- Check for styleOverrides before attempting to parse [`#18`](https://github.com/justifi-tech/web-component-library/pull/18)
- Update README files [`#17`](https://github.com/justifi-tech/web-component-library/pull/17)
- Update READMEs and release new react-library version [`#16`](https://github.com/justifi-tech/web-component-library/pull/16)
- Allow styleOverrides to be passed into cardForm and bankAccountForm [`#15`](https://github.com/justifi-tech/web-component-library/pull/15)
- FE-18: Iframe content height reporting [`#14`](https://github.com/justifi-tech/web-component-library/pull/14)
- Update web component props for `v2` payments-js [`#13`](https://github.com/justifi-tech/web-component-library/pull/13)
- Fix react components [`#11`](https://github.com/justifi-tech/web-component-library/pull/11)
- Fix card form component events [`#10`](https://github.com/justifi-tech/web-component-library/pull/10)
- Eng-2080: Add bank account web component [`#7`](https://github.com/justifi-tech/web-component-library/pull/7)
- ENG-1960 publish libraries to npmjs.org [`#4`](https://github.com/justifi-tech/web-component-library/pull/4)
- Package & Publish libraries [`#3`](https://github.com/justifi-tech/web-component-library/pull/3)
- Restructure project and link react and stencil libraries [`#2`](https://github.com/justifi-tech/web-component-library/pull/2)
- Terraform and GitHub Actions [`#1`](https://github.com/justifi-tech/web-component-library/pull/1)
- init [`27806f7`](https://github.com/justifi-tech/web-component-library/commit/27806f7bff97247033800c7743570ebeec4080d7)
- add: release-it package [`e0b3711`](https://github.com/justifi-tech/web-component-library/commit/e0b371184774dd7dead0243cd645640175d6b87f)
- initial commit [`c147b58`](https://github.com/justifi-tech/web-component-library/commit/c147b580aaf95eb22ffe6ad9b0217954890dd1d4)
