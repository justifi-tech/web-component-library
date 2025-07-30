import { Meta, StoryObj } from "@storybook/web-components";
import { customStoryDecorator, StoryBaseArgs } from "../../../utils";
import { withActions } from "@storybook/addon-actions/decorator";

import "@justifi/webcomponents/dist/module/justifi-modular-checkout";
import "@justifi/webcomponents/dist/module/justifi-card-form";
import "@justifi/webcomponents/dist/module/justifi-postal-code-form";

type Story = StoryObj;

const storyBaseArgs = new StoryBaseArgs(["auth-token", "account-id", "checkout-id"]);

const meta: Meta = {
  title: "Modular Checkout/Examples/Layout 3",
  component: "justifi-modular-checkout",
  args: {
    ...storyBaseArgs.args,
    "save-payment-method": "true",
    "slot": () => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; color: #333; min-height: 100vh;">
        <!-- Header Bar -->
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px 40px; background-color: white; border-bottom: 1px solid #e0e0e0;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 20px;">←</span>
            <span style="font-size: 18px; font-weight: 500;">JustiFi Store</span>
          </div>
          <div style="background-color: #ff6b35; color: white; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 500;">TEST MODE</div>
        </div>

        <!-- Main Container -->
        <div style="display: flex; max-width: 1200px; margin: 0 auto; padding: 40px 20px; gap: 40px;">
          <!-- Left Column - Order Summary -->
          <div style="flex: 0 0 40%; background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <!-- Pay Header -->
            <div style="margin-bottom: 30px;">
              <h1 style="font-size: 24px; font-weight: 600; color: #333; margin: 0 0 10px 0;">Pay JustiFi Store</h1>
              <div style="font-size: 32px; font-weight: bold; color: #333;">$39.99</div>
            </div>

            <!-- Product Item -->
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #e0e0e0;">
              <div style="width: 60px; height: 80px; background-color: #f8f9fa; border: 1px solid #e0e0e0; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #666;">📚</div>
              <div style="flex: 1;">
                <div style="font-weight: 500; color: #333; margin-bottom: 5px;">Fintech Deployhandbook Test</div>
                <div style="font-size: 14px; color: #666;">How to deploy Fintech app...</div>
              </div>
              <div style="font-weight: 600; color: #333;">$39.99</div>
            </div>

            <!-- Summary Breakdown -->
            <div style="margin-bottom: 30px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px;">
                <span>Subtotal</span>
                <span>$39.99</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; align-items: center;">
                <div style="display: flex; align-items: center; gap: 5px;">
                  <span>Tax</span>
                  <span style="font-size: 12px; color: #666;">ⓘ</span>
                </div>
                <span style="color: #666;">Enter address to calculate</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: bold; color: #333; padding-top: 10px; border-top: 1px solid #e0e0e0;">
                <span>Total due</span>
                <span>$39.99</span>
              </div>
            </div>

            <!-- Footer -->
            <div style="margin-top: auto; font-size: 12px; color: #666;">
              <div style="margin-bottom: 10px;">
                Powered by <span style="font-weight: 600;">JustiFi</span>
              </div>
              <div style="display: flex; gap: 20px;">
                <a href="#" style="color: #007bff; text-decoration: none;">Terms</a>
                <a href="#" style="color: #007bff; text-decoration: none;">Privacy</a>
              </div>
            </div>
          </div>

          <!-- Right Column - Payment Form -->
          <div style="flex: 0 0 60%; background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h2 style="font-size: 24px; font-weight: 600; color: #333; margin: 0 0 30px 0;">Pay with card</h2>

            <!-- Email Field -->
            <div style="margin-bottom: 25px;">
              <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: #333;">Email</label>
              <input type="email" placeholder="Enter your email" style="width: 100%; padding: 12px 15px; border: 1px solid #e0e0e0; border-radius: 6px; font-size: 14px; background-color: white;" />
            </div>

            <!-- Card Information -->
            <div style="margin-bottom: 25px;">
              <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: #333;">Debit/Credit Card information</label>
              <justifi-modular-checkout
                auth-token="authToken"
                account-id="acc_123"
                checkout-id="cho_123"
                save-payment-method="true"
              >
                <justifi-card-form />
                <justifi-postal-code-form />
              </justifi-modular-checkout>
            </div>

            <!-- Name on Card -->
            <div style="margin-bottom: 25px;">
              <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: #333;">Name on card</label>
              <input type="text" placeholder="Enter cardholder name" style="width: 100%; padding: 12px 15px; border: 1px solid #e0e0e0; border-radius: 6px; font-size: 14px; background-color: white;" />
            </div>

            <!-- Billing Address -->
            <div style="margin-bottom: 25px;">
              <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: #333;">Billing address</label>
              <div style="margin-bottom: 15px;">
                <select style="width: 100%; padding: 12px 15px; border: 1px solid #e0e0e0; border-radius: 6px; font-size: 14px; background-color: white; color: #333;">
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                  <option>Australia</option>
                </select>
              </div>
              <div style="margin-bottom: 10px;">
                <input type="text" placeholder="Address" style="width: 100%; padding: 12px 15px; border: 1px solid #e0e0e0; border-radius: 6px; font-size: 14px; background-color: white;" />
              </div>
              <a href="#" style="color: #007bff; text-decoration: none; font-size: 14px;">Enter address manually</a>
            </div>

            <!-- Save Info Checkbox -->
            <div style="margin-bottom: 30px;">
              <label style="display: flex; align-items: flex-start; gap: 10px; cursor: pointer;">
                <input type="checkbox" style="margin-top: 2px;" />
                <div>
                  <div style="font-size: 14px; color: #333; margin-bottom: 5px;">Save my info for secure 1-click checkout</div>
                  <div style="font-size: 12px; color: #666;">Pay faster on StakNine and thousands of sites.</div>
                </div>
              </label>
            </div>

            <!-- Pay Button -->
            <button style="width: 100%; background-color: #007bff; color: white; border: none; padding: 15px; border-radius: 6px; font-size: 16px; font-weight: 600; cursor: pointer;" id="submit-button">
              Pay
            </button>
          </div>
        </div>
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
