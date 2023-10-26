### Changelog

### 4.6.0

> (insert date here upon release)

- Added `PaymentBalanceTransactions`

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

#### 4.4.1

> 23 Aug 2023

- Update `package.json` to contain the correct `main` file entry

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
