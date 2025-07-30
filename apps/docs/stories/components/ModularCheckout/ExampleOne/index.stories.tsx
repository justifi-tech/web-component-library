import { Meta, StoryObj } from "@storybook/web-components";
import { customStoryDecorator, StoryBaseArgs } from "../../../utils";
import { withActions } from "@storybook/addon-actions/decorator";

import "@justifi/webcomponents/dist/module/justifi-modular-checkout";
import "@justifi/webcomponents/dist/module/justifi-card-form";
import "@justifi/webcomponents/dist/module/justifi-postal-code-form";
import "./example.css";

type Story = StoryObj;

const storyBaseArgs = new StoryBaseArgs(["auth-token", "account-id", "checkout-id"]);

const meta: Meta = {
  title: "Modular Checkout/Examples/Layout 1",
  component: "justifi-modular-checkout",
  args: {
    ...storyBaseArgs.args,
    "save-payment-method": "true",
    "slot": () => `
      <div class="donation-container">
        <!-- Donation Total Header -->
        <div class="donation-header">
          <span>Donation Total</span>
          <span>$10.00</span>
        </div>

        <!-- Main Payment Form Container -->
        <div class="payment-form-container">
          <!-- Header with Radio Button -->
          <div class="payment-header">
            <div class="radio-button">
              <div class="radio-button-inner"></div>
            </div>
            <span>Donate with Stripe Payment Element</span>
          </div>

          <!-- Payment Method Selection -->
          <div class="payment-methods">
            <div class="payment-method-card">
              <div class="payment-method-icon">💳</div>
              <div class="payment-method-label">Card</div>
            </div>
            <div class="payment-method-card-inactive">
              <div class="payment-method-icon-cash">$</div>
              <div class="payment-method-label">Cash App Pay</div>
            </div>
            <div class="payment-method-card-inactive">
              <div class="payment-method-icon-bank">🏦</div>
              <div class="payment-method-label">US bank account</div>
            </div>
          </div>

          <!-- Card Form -->
          <div class="card-form-container">
            <justifi-card-form />
          </div>

          <!-- Country and ZIP Fields -->
          <div class="form-row">
            <div class="form-field">
              <label class="form-label">Country</label>
              <select class="form-select">
                <option>United States</option>
                <option>Canada</option>
                <option>United Kingdom</option>
                <option>Australia</option>
                <option>New Zealand</option>
                <option>Other</option>
              </select>
            </div>
            <div class="form-field">
              <justifi-postal-code-form />
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <button class="donate-button">
          Donate Now
        </button>
      </div>
    `
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
  ]
};

export const Example: Story = {};

export default meta;
