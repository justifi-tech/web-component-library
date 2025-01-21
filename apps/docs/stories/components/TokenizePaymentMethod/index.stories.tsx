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
    "submit-button-text": "Tokenize Payment Method",
    "disable-credit-card": false,
    "disable-bank-account": false,
    "hide-submit-button": false,
    "hide-card-billing-form": false,
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
    "submit-button-text": {
      type: "string",
      description: "Alternate text to display on the submit button",
      control: {
        type: "text",
      },
      table: {
        category: "props",
        defaultValue: { summary: "Tokenize Payment Method" },
      },
    },
    "payment-method-group-id": {
      type: "string",
      description: "An existing payment method group ID may be used to save the tokenized payment method to an existing group",
      control: {
        type: "text",
      },
      table: {
        category: "props",
        "defaultValue": { summary: "undefined" },
      },
    },
    "disable-credit-card": {
      type: "boolean",
      description:
        "Boolean indicating if the Payment Form should render Card inputs",
      control: {
        type: "boolean",
      },
      table: {
        category: "props",
        defaultValue: { summary: "false" },
      },
    },
    "disable-bank-account": {
      type: "boolean",
      description:
        "Boolean indicating if the Payment Form should render Bank Account inputs",
      control: {
        type: "boolean",
      },
      table: {
        category: "props",
        defaultValue: { summary: "false" },
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
        defaultValue: { summary: "false" },
      },
    },
    "hide-card-billing-form": {
      type: "boolean",
      control: {
        type: "boolean",
      },
      description: "For use with new credit card payment methods only, renders an alternate billing form with only the address_postal_code field present",
      table: {
        category: "props",
        defaultValue: { summary: "false" },
      },
    },
    "submit-event": {
      description: "Emitted upon successful tokenization of a payment method",
      table: {
        category: "events",
        defaultValue: { summary: "Returns payment token as `event.detail.response.token`" },
      },
      action: true
    },
    "error-event": {
      description: "Emitted upon an error during component intitializtion, or tokenization of a payment method",
      table: {
        category: "events",
        defaultValue: { summary: "Returns full error as `event.detail` and error message as `event.detail.message`" },
      },
      action: true,
    },
    fillBillingForm: {
      description:"Fill the billing form with the provided fields",
      table: {
        category: "methods",
        defaultValue: { summary: "`fillBillingForm(fields: BillingFormFields) => Promise<void>`" }
      },
    },
    tokenizePaymentMethod: {
      description: "Can be used to call the tokenizePaymentMethod method directly",
      table: {
        category: "methods",
        defaultValue: { summary: "`tokenizePaymentMethod() => Promise<void>`" }
      },
    },
  },
  parameters: {
    actions: {
      handles: ["submit-event", "error-event"],
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
