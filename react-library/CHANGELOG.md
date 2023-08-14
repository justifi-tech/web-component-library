### Changelog

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
- Hardcode production fallback `iframeOrigin` as it is not being set as intended via environment variables
- Use environment variables to set `iframeOrigin` in production build

#### 4.2.0

> 27 June 2023

- Add `resize` method to `CardForm` and `BankAccount` form


#### 1.0.0
> 31 March 2023

- Upgrade React dependencies and peer dependencies to React 18

#### 0.2.0
> 31 March 2023

- Update react-library with the most recent version of @justifi/web-components

#### 0.1.14

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
