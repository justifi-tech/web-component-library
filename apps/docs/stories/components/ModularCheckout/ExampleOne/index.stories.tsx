import { Meta, StoryObj } from "@storybook/web-components";
import { customStoryDecorator, StoryBaseArgs } from "../../../utils";
import { withActions } from "@storybook/addon-actions/decorator";

import "@justifi/webcomponents/dist/module/justifi-modular-checkout";
import "@justifi/webcomponents/dist/module/justifi-card-form";
import "@justifi/webcomponents/dist/module/justifi-postal-code-form";

type Story = StoryObj;

const storyBaseArgs = new StoryBaseArgs(["auth-token", "account-id", "checkout-id"]);

const meta: Meta = {
  title: "Modular Checkout/Examples/Layout 1",
  component: "justifi-modular-checkout",
  args: {
    ...storyBaseArgs.args,
    "save-payment-method": "true",
    "slot": () => `
      <div style="
        max-width: 600px;
        margin: 0 auto;
        font-family: sans-serif;
        color: #333;
      ">
        <!-- Donation Total Header -->
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          font-size: 16px;
          color: #666;
        ">
          <span>Donation Total</span>
          <span>$10.00</span>
        </div>

        <!-- Main Payment Form Container -->
        <div style="
          background-color: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        ">
          <!-- Header with Radio Button -->
          <div style="
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            font-size: 16px;
            color: #333;
          ">
            <div style="
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background-color: #28a745;
              margin-right: 10px;
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <div style="
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background-color: white;
              "></div>
            </div>
            <span>Donate with Stripe Payment Element</span>
          </div>

          <!-- Payment Method Selection -->
          <div style="
            display: flex;
            gap: 15px;
            margin-bottom: 20px;
          ">
            <div style="
              flex: 1;
              border: 2px solid #007bff;
              border-radius: 8px;
              padding: 15px;
              text-align: center;
              background-color: white;
              cursor: pointer;
            ">
              <div style="
                font-size: 24px;
                margin-bottom: 8px;
                color: #007bff;
              ">💳</div>
              <div style="
                font-size: 14px;
                color: #333;
              ">Card</div>
            </div>
            <div style="
              flex: 1;
              border: 1px solid #e0e0e0;
              border-radius: 8px;
              padding: 15px;
              text-align: center;
              background-color: white;
              cursor: pointer;
            ">
              <div style="
                font-size: 24px;
                margin-bottom: 8px;
                color: #00d632;
              ">$</div>
              <div style="
                font-size: 14px;
                color: #333;
              ">Cash App Pay</div>
            </div>
            <div style="
              flex: 1;
              border: 1px solid #e0e0e0;
              border-radius: 8px;
              padding: 15px;
              text-align: center;
              background-color: white;
              cursor: pointer;
            ">
              <div style="
                font-size: 24px;
                margin-bottom: 8px;
                color: #666;
              ">🏦</div>
              <div style="
                font-size: 14px;
                color: #333;
              ">US bank account</div>
            </div>
          </div>

          <!-- Card Form -->
          <div style="
            margin-bottom: 20px;
          ">
            <justifi-card-form />
          </div>

          <!-- Country and ZIP Fields -->
          <div style="
            display: flex;
            gap: 15px;
          ">
            <div style="
              flex: 1;
            ">
              <label style="
                display: block;
                margin-bottom: 12px;
                font-size: 1.1rem;
                color: #333;
                font-weight: 500;
              ">Country</label>
              <select style="
                width: 100%;
                padding: 0.475rem 0.75rem;
                border: 1px solid #e0e0e0;
                border-radius: 6px;
                font-size: 1rem;
                background-color: white;
                color: #333;
              ">
                <option>United States</option>
                <option>Canada</option>
                <option>United Kingdom</option>
                <option>Australia</option>
                <option>New Zealand</option>
                <option>Other</option>
              </select>
            </div>
            <div style="
              flex: 1;
            ">
              <justifi-postal-code-form />
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <button style=" 
          width: 100%;
          padding: 15px;
          background-color: #28a745;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
        ">
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
