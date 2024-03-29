### Changelog

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
