import type { Meta } from "@storybook/web-components";
import { withActions } from "@storybook/addon-actions/decorator";
import { StoryBaseArgs, customStoryDecorator } from "../../utils";

import "@justifi/webcomponents/dist/module/justifi-tokenize-payment-method";
import { ThemeNames } from "../../themes";

const storyBaseArgs = new StoryBaseArgs([
  "account-id",
  "auth-token",
]);

const meta: Meta = {
  title: "Payment Facilitation/Tokenize Payment Method",
  component: "justifi-tokenize-payment-method",
  args: {
    ...storyBaseArgs.args,
    Theme: ThemeNames.Light,
    email: "test@test.com",
    "submit-button-text": "Tokenize Payment Method",
    "disable-credit-card": false,
    "disable-bank-account": false,
    "hide-submit-button": false,
  },
  argTypes: {
    ...storyBaseArgs.argTypes,
    Theme: {
      description:
        "Select a theme to preview the component in. [See example](https://storybook.justifi.ai/?path=/docs/introduction--docs#styling)",
      options: Object.values(ThemeNames),
      control: {
        type: "select",
      },
    },
    "disable-bank-account": {
      type: "boolean",
      description:
        "Boolean indicating if the Payment Form should render Bank Account inputs `boolean`",
      control: {
        type: "boolean",
      },
      table: {
        category: "props",
      },
    },
    "disable-credit-card": {
      type: "boolean",
      description:
        "Boolean indicating if the Payment Form should render Card inputs `boolean`",
      control: {
        type: "boolean",
      },
      table: {
        category: "props",
      },
    },
    "hide-submit-button": {
      type: "boolean",
      description:
        "Boolean indicating if the internal submit button should be hidden. Can be used in combination with an external button and calling the `tokenizePaymentMethod` method directly",
      control: {
        type: "boolean",
      },
      table: {
        category: "props",
      },
    },
    "submit-button-text": {
      type: "string",
      control: {
        type: "text",
      },
      table: {
        category: "props",
      },
    },
    submitted: {
      description:
        "`BankAccountCreateResponse` `CardCreateResponse` `PaymentMethodErrorResponse`",
      table: {
        category: "events",
      },
      action: true
    },
    "error-event": {
      description: "`ComponentError`",
      table: {
        category: "events",
      },
      action: true,
    },
    fillBillingForm: {
      description:
        "`fillBillingForm(fields: BillingFormFields) => Promise<void>`",
      table: {
        category: "methods",
      },
    },
  },
  parameters: {
    actions: {
      handles: ["submitted", "error-event"],
    },
    chromatic: {
      delay: 2000,
    },
  },
  decorators: [
    customStoryDecorator,
    withActions
  ],
};

const Template = {};

export const Example = Template;

export default meta;
