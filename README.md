# Documentation

- [Web component library](https://github.com/justifi-tech/web-component-library/tree/main/stencil-library)
  - [justifi-bank-account-form](https://github.com/justifi-tech/web-component-library/tree/main/stencil-library/src/components/bank-account-form#justifi-bank-account-form)
  - [justifi-card-form](https://github.com/justifi-tech/web-component-library/tree/main/stencil-library/src/components/card-form#justifi-card-form)

## Getting Started

This project is a monorepo which uses `lerna` and npm workspaces. Lerna is aware of the workspaces within the mono repo as they are defined within the `workspaces` section of the `package.json`. When running a lerna command via `lerna run xyz`, lerna will run that command for each workspace as long as the command exists within the `scripts` section of the `package.json` for that workspace.

There are some project-wide tasks that can be run:
- To install all depenedencies across the repo, simply run `npm install` from the root of the project and dependencies will be installed for all of the workspaces as well as dependencies at the root level (such as lerna)
- To build the entire project for production, including all framework specific packages, run `npm run build`
- To run tests across the entire project, run `npm run test`

# Environment Variables

This project uses environment variables to manage configurations for different environments like development, staging, and production. These variables were previously stored in `.env.dev`, `.env.staging`, and `.env.prod` files respectively, but for security and configuration management reasons, these files are no longer included in the repository and have been added to the `.gitignore` file.

To setup the project locally, you will need to create these `.env` files manually in the project root folder. Here is a basic setup for the `.env.dev` file (for the development environment):

`IFRAME_ORIGIN=value`

Repeat this process to create `.env.staging` and `.env.prod` for staging and production environments, respectively.

Before building the project, make sure to set the correct environment using the `NODE_ENV` variable. For example, if you're working in the development environment, you should set `NODE_ENV=dev`.

## Building

Before building the project, make sure to set the correct environment using the `NODE_ENV` variable. The build scripts for different environments are:

- `npm run build:dev` for development environment.
- `npm run build:prod` for production environment.


## Testing
This project uses the Stencil testing framework for unit and end-to-end (E2E) tests, along with Storybook for UI component testing.

### test

Runs unit tests using the Stencil's spec testing.

`npm run test`

### test:watch

Runs unit tests in watch mode. Good for development.

`npm run test:watch`

### test:e2e

Runs end-to-end tests using the Stencil's E2E testing.

`npm run test:e2e`

## Deprecation Notice: Methods and Events

In the upcoming release of our web component library, we are deprecating certain methods and events. These deprecations aim to improve the component's API and provide a more consistent and intuitive usage experience. Please take note of the following changes and plan your migration accordingly.

### Deprecated Methods and Events:

1. `bankAccountFormReady` event

   - Deprecated in version 5.0.0
   - Will be renamed to `ready` in version 6.0.0

   **Reason for Deprecation:**
   The event name `bankAccountFormReady` is being updated to `ready` to align with industry standards and improve consistency across our components.

**Migration Example:**
Before (current usage):

```javascript
element.addEventListener('bankAccountFormReady', handleReady);
```

After (migrated usage):

```
element.addEventListener('ready', handleReady);
```

Please update your event listeners accordingly to ensure compatibility with future releases.

**Warning Message:** When using the deprecated `bankAccountFormReady` event, a warning will be logged in the console, indicating the upcoming change and the need for migration.

**Recommended Migration Version:** 6.0.0

## Additional Considerations:

- Make sure to update any code, documentation, or integrations that rely on the deprecated methods and events to prevent disruptions in functionality.
- Please note that starting from version 6.0.0, the `bankAccountFormReady` event will be completely removed from the component.
  We highly recommend migrating to the new event name `ready` as soon as possible to ensure a smooth transition and to leverage the latest improvements in our component library.

If you have any questions or need assistance with the migration process, please don't hesitate to reach out to our support team.
