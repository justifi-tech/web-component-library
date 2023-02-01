# Documentation
- [Web component library](https://github.com/justifi-tech/web-component-library/tree/framework-monorepo-structure/stencil-library)
  - [justifi-bank-account-form](https://github.com/justifi-tech/web-component-library/tree/main/stencil-library/src/components/bank-account-form#justifi-bank-account-form)
  - [justifi-card-form](https://github.com/justifi-tech/web-component-library/tree/main/stencil-library/src/components/card-form#justifi-card-form)
- [React component library](https://github.com/justifi-tech/web-component-library/tree/framework-monorepo-structure/react-library)
  - JustifiBankAccountForm is a work in progress
  - JustifiCardForm is a work in progress

# For contributors:
In order for `react-library` to build, you must first create a yarn symlink to `stencil-library` because it is a dependency.

To do this, do the following:
- From the `stencil-library` directory, run `yarn link`
- From the `react-library` run `yarn link "@justifi/webcomponents"`
