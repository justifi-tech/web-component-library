import { Meta, StoryObj } from "@storybook/web-components";
import { customStoryDecorator, StoryBaseArgs } from "../../../../utils";
import { withActions } from "@storybook/addon-actions/decorator";
import { getSlotContentExample1 } from "./slot-content";

import "@justifi/webcomponents/dist/module/justifi-modular-checkout";
import "@justifi/webcomponents/dist/module/justifi-card-form";
import "@justifi/webcomponents/dist/module/justifi-bank-account-form";
import "@justifi/webcomponents/dist/module/justifi-card-billing-form-simple";
import "./styles.css";

type Story = StoryObj;

const storyBaseArgs = new StoryBaseArgs(["auth-token", "account-id", "checkout-id"]);

// Custom decorator to handle payment method toggle
const withPaymentMethodToggle = (storyFn: any) => {
  const story = storyFn();

  // Wait for the component to be rendered
  setTimeout(() => {
    const container = document.querySelector('.donation-container');
    if (container) {
      const paymentMethodCards = container.querySelectorAll('.payment-method-card');
      const cardFormContainer = container.querySelector('[data-form-type="card"]');
      const bankFormContainer = container.querySelector('[data-form-type="bank"]');

      paymentMethodCards.forEach((card) => {
        card.addEventListener('click', () => {
          const paymentMethod = card.getAttribute('data-payment-method');

          // Skip Apple Pay for now
          if (paymentMethod === 'apple') {
            return;
          }

          // Update selected state
          paymentMethodCards.forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');

          // Toggle form visibility
          if (paymentMethod === 'card') {
            cardFormContainer?.setAttribute('style', 'display: block;');
            bankFormContainer?.setAttribute('style', 'display: none;');
          } else if (paymentMethod === 'bank') {
            cardFormContainer?.setAttribute('style', 'display: none;');
            bankFormContainer?.setAttribute('style', 'display: block;');
          }
        });
      });
    }
  }, 100);

  return story;
};

const meta: Meta = {
  title: "Modular Checkout/Complete Examples/Layout 1",
  component: "justifi-modular-checkout",
  args: {
    ...storyBaseArgs.args,
    "save-payment-method": "true",
    "slot": getSlotContentExample1
  },
  argTypes: {
    ...storyBaseArgs.argTypes,
    "save-payment-method": {
      description: "Enables the save payment method option, if there is a `payment_method_group_id` associated with the checkout.",
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
    "submit-event": {
      description: "`CheckoutCompleteEvent`",
      table: {
        category: "events",
      },
    },
    "payment-method-changed": {
      description: "Emitted when the selected payment method changes. Returns the selected payment method ID as a string.",
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
      description: "Programmatically set the selected payment method by ID",
      table: {
        category: "methods",
        defaultValue: { summary: "setSelectedPaymentMethod(paymentMethodId: string) => Promise<void>" }
      },
    }
  },
  parameters: {
    actions: {
      handles: [
        "error-event",
        "submit-event",
        "payment-method-changed",
      ]
    }
  },
  decorators: [
    customStoryDecorator,
    withActions,
    withPaymentMethodToggle,
  ]
};

export const Example: Story = {};

export default meta;
