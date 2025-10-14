import { Meta, StoryObj } from "@storybook/web-components";
import { customStoryDecorator, StoryBaseArgs } from "../../../../utils";
import { withActions } from "@storybook/addon-actions/decorator";
import { getSlotContentExample3 } from "./slot-content";

import "@justifi/webcomponents/dist/module/justifi-modular-checkout";
import "@justifi/webcomponents/dist/module/justifi-card-form";
import "@justifi/webcomponents/dist/module/justifi-card-billing-form-simple";
import "@justifi/webcomponents/dist/module/justifi-save-new-payment-method";
import "./styles.css";

type Story = StoryObj;

const storyBaseArgs = new StoryBaseArgs(["auth-token", "checkout-id"]);

const meta: Meta = {
  title: "Modular Checkout/Complete Examples/Layout 3",
  component: "justifi-modular-checkout",
  args: {
    ...storyBaseArgs.args,
    "slot": getSlotContentExample3
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
