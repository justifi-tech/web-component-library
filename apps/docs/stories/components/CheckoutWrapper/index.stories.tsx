import { Meta, StoryObj } from "@storybook/web-components";
import { customStoryDecorator, StoryBaseArgs } from "../../utils";
import { withActions } from "@storybook/addon-actions/decorator";

import "@justifi/webcomponents/dist/module/justifi-checkout-wrapper";
import "@justifi/webcomponents/dist/module/justifi-card-form";

type Story = StoryObj;

const storyBaseArgs = new StoryBaseArgs(["auth-token", "account-id", "checkout-id"]);

const meta: Meta = {
  title: "Modular Checkout/Checkout Wrapper",
  component: "justifi-checkout-wrapper",
  args: {
    ...storyBaseArgs.args,
    "save-payment-method": "true",
    "slot": () => `<justifi-card-form />`
  },
  argTypes: {
    ...storyBaseArgs.argTypes,
    "save-payment-method": {
      description: "Enables the save payment method option.",
      table: {
        category: "props",
        defaultValue: {
          summary: "false",
        }
      },
      control: {
        type: "boolean",
      },
    },
    "error-event": {
      description: "`ComponentError`",
      table: {
        category: "events",
      },
    },
    "checkout-complete-event": {
      description: "`CheckoutCompleteEvent`",
      table: {
        category: "events",
      },
    },
    validate: {
      description: "Validate the payment method and billing form fields",
      table: {
        category: "methods",
        defaultValue: { summary: "validate() => Promise<{ isValid: boolean; errors: { [key: string]: any } }>" }
      },
    },
    submitCheckout: {
      description: "Submit the checkout. Optionally accepts an object with billing information data.",
      table: {
        category: "methods",
        defaultValue: { summary: "submitCheckout(billingInfo?: IBillingInfo) => Promise<void>" }
      },
    }
  },
  parameters: {
    actions: {
      handles: [
        "error-event",
        "checkout-complete-event",
      ]
    }
  },
  decorators: [
    customStoryDecorator,
    withActions,
  ]
};

export const Example: Story = {};

export default meta;
