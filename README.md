# Documentation

- [Web component library](https://github.com/justifi-tech/web-component-library/tree/main/stencil-library)
  - [justifi-bank-account-form](https://github.com/justifi-tech/web-component-library/tree/main/stencil-library/src/components/bank-account-form#justifi-bank-account-form)
  - [justifi-card-form](https://github.com/justifi-tech/web-component-library/tree/main/stencil-library/src/components/card-form#justifi-card-form)
- React component library
  - Docs for this are not in place yet, but feel free to check out [sample-react-app.zip](https://github.com/justifi-tech/web-component-library/files/11125233/sample-react-app.zip)

# For contributors:

Follow the semantic versioning guidelines found [here](https://semver.org/)

In order for `react-library` to build, you must first create a yarn symlink to `stencil-library` because it is a dependency.

To do this, do the following:

- From the `stencil-library` directory, run `yarn link`
- From the `react-library` run `yarn link "@justifi/webcomponents"`

# Project Testing Guide

## Getting Started

This project uses the Stencil testing framework for unit and end-to-end (E2E) tests, along with Storybook for UI component testing and auto-changelog to maintain a changelog based on git metadata.

Below are commands used for various testing and development scenarios.

## test

Runs unit tests using the Stencil's spec testing.

`yarn run test`

## test:watch

Runs unit tests in watch mode. Good for development.

`yarn run test:watch`

## test:e2e

Runs end-to-end tests using the Stencil's E2E testing.

`yarn run test:e2e`
