import { Meta, StoryObj } from "@storybook/web-components";
import { customStoryDecorator, StoryBaseArgs } from "../../utils";
import { withActions } from "@storybook/addon-actions/decorator";

import "@justifi/webcomponents/dist/module/justifi-modular-checkout";
import "@justifi/webcomponents/dist/module/justifi-card-form";

type Story = StoryObj;

const storyBaseArgs = new StoryBaseArgs(["auth-token", "checkout-id"]);

const meta: Meta = {
  title: "Modular Checkout",
  component: "justifi-modular-checkout",
  args: {
    ...storyBaseArgs.args,
    "slot": () => `<justifi-card-form />`
  },
  argTypes: {
    ...storyBaseArgs.argTypes,
    "error-event": {
      description: "`ComponentError`",
      table: {
        category: "events",
      },
    },
    "submit-event": {
      description: "`CheckoutCompleteEvent`",
      table: {
        category: "events",
      },
    },
    "checkout-changed": {
      description: "Emitted when the checkout state changes. Includes available payment methods, selected payment method, and saved methods.",
      table: {
        category: "events",
      },
    },
    validate: {
      description: "Validate the payment method and billing form fields",
      table: {
        category: "methods",
        defaultValue: { summary: "validate() => Promise<boolean>" }
      },
    },
    submitCheckout: {
      description: "Submit the checkout. Optionally accepts an object with billing information data.",
      table: {
        category: "methods",
        defaultValue: { summary: "submitCheckout(billingInfo?: IBillingInfo) => Promise<void>" }
      },
    },
    setSelectedPaymentMethod: {
      description: "Programmatically set the selected payment method",
      table: {
        category: "methods",
        defaultValue: { summary: "setSelectedPaymentMethod(paymentMethod: SelectedPaymentMethod) => Promise<void>" }
      },
    },
    preSubmitHook: {
      description: "Optional hook that executes before payment submission. Receives checkout state and allows inspection before proceeding or canceling.",
      table: {
        category: "props",
        type: { summary: "Hook<CheckoutState>" }
      },
    }
  },
  parameters: {
    actions: {
      handles: [
        "error-event",
        "submit-event",
        "checkout-changed",
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
