# Documentation

- [Web component library](https://github.com/justifi-tech/web-component-library/tree/main/stencil-library)
  - [justifi-bank-account-form](https://github.com/justifi-tech/web-component-library/tree/main/stencil-library/src/components/bank-account-form#justifi-bank-account-form)
  - [justifi-card-form](https://github.com/justifi-tech/web-component-library/tree/main/stencil-library/src/components/card-form#justifi-card-form)
- React component library
  - Docs for this are not in place yet, but feel free to check out [sample-react-app.zip](https://github.com/justifi-tech/web-component-library/files/11125233/sample-react-app.zip)

# Environment Variables

This project uses environment variables to manage configurations for different environments like development, staging, and production. These variables were previously stored in `.env.dev`, `.env.staging`, and `.env.prod` files respectively, but for security and configuration management reasons, these files are no longer included in the repository and have been added to the `.gitignore` file.

To setup the project locally, you will need to create these `.env` files manually in the project root folder. Here is a basic setup for the `.env.dev` file (for the development environment):

`IFRAME_ORIGIN=value`

Repeat this process to create `.env.staging` and `.env.prod` for staging and production environments, respectively.

Before building the project, make sure to set the correct environment using the `NODE_ENV` variable. For example, if you're working in the development environment, you should set `NODE_ENV=dev`.

# For contributors:

Follow the semantic versioning guidelines found [here](https://semver.org/)

In order for `react-library` to build, you must first create a yarn symlink to `stencil-library` because it is a dependency.

To do this, do the following:

- From the `stencil-library` directory, run `yarn link`
- From the `react-library` run `yarn link "@justifi/webcomponents"`

## Getting Started

This project uses the Stencil testing framework for unit and end-to-end (E2E) tests, along with Storybook for UI component testing and auto-changelog to maintain a changelog based on git metadata.

Below are commands used for various testing and development scenarios.

## Build

Before building the project, make sure to set the correct environment using the `NODE_ENV` variable. The build scripts for different environments are:

- `yarn run build:dev` for development environment.
- `yarn run build:prod` for production environment.

## test

Runs unit tests using the Stencil's spec testing.

`yarn run test`

## test:watch

Runs unit tests in watch mode. Good for development.

`yarn run test:watch`

## test:e2e

Runs end-to-end tests using the Stencil's E2E testing.

`yarn run test:e2e`
