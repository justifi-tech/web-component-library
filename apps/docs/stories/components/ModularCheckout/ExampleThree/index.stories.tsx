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
  title: "Modular Checkout/Examples/Layout 3",
  component: "justifi-modular-checkout",
  args: {
    ...storyBaseArgs.args,
    "save-payment-method": "true",
    "slot": () => `
      <div class="checkout-page">
        <!-- Header Bar -->
        <div class="header-bar">
          <div class="header-left">
            <span class="back-arrow">←</span>
            <span class="store-name">JustiFi Store</span>
          </div>
          <div class="test-mode-badge">TEST MODE</div>
        </div>

        <!-- Main Container -->
        <div class="main-container">
          <!-- Left Column - Order Summary -->
          <div class="order-summary">
            <!-- Pay Header -->
            <div class="pay-header">
              <h1 class="pay-title">Pay JustiFi Store</h1>
              <div class="pay-amount">$39.99</div>
            </div>

            <!-- Product Item -->
            <div class="product-item">
              <div class="product-image">📚</div>
              <div class="product-details">
                <div class="product-name">Fintech Deployhandbook Test</div>
                <div class="product-description">How to deploy Fintech app...</div>
              </div>
              <div class="product-price">$39.99</div>
            </div>

            <!-- Summary Breakdown -->
            <div class="summary-breakdown">
              <div class="summary-row">
                <span>Subtotal</span>
                <span>$39.99</span>
              </div>
              <div class="summary-row-with-icon">
                <div class="tax-info">
                  <span>Tax</span>
                  <span class="info-icon">ⓘ</span>
                </div>
                <span class="tax-placeholder">Enter address to calculate</span>
              </div>
              <div class="summary-row-total">
                <span>Total due</span>
                <span>$39.99</span>
              </div>
            </div>

            <!-- Footer -->
            <div class="summary-footer">
              <div class="powered-by">
                Powered by <span class="powered-by-brand">JustiFi</span>
              </div>
              <div class="footer-links">
                <a href="#" class="footer-link">Terms</a>
                <a href="#" class="footer-link">Privacy</a>
              </div>
            </div>
          </div>

          <!-- Right Column - Payment Form -->
          <div class="payment-form">
            <h2 class="payment-title">Pay with card</h2>

            <!-- Email Field -->
            <div class="form-field">
              <label class="form-label">Email</label>
              <input type="email" placeholder="Enter your email" class="form-input" />
            </div>

            <!-- Card Information -->
            <div class="form-field">
              <label class="form-label">Debit/Credit Card information</label>
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
            <div class="form-field">
              <label class="form-label">Name on card</label>
              <input type="text" placeholder="Enter cardholder name" class="form-input" />
            </div>

            <!-- Billing Address -->
            <div class="form-field">
              <label class="form-label">Billing address</label>
              <div style="margin-bottom: 15px;">
                <select class="form-select">
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                  <option>Australia</option>
                </select>
              </div>
              <div style="margin-bottom: 10px;">
                <input type="text" placeholder="Address" class="form-input" />
              </div>
              <a href="#" class="manual-address-link">Enter address manually</a>
            </div>

            <!-- Save Info Checkbox -->
            <div class="checkbox-container">
              <label class="checkbox-label">
                <input type="checkbox" class="checkbox-input" />
                <div>
                  <div class="checkbox-text">Save my info for secure 1-click checkout</div>
                  <div class="checkbox-description">Pay faster on StakNine and thousands of sites.</div>
                </div>
              </label>
            </div>

            <!-- Pay Button -->
            <button class="pay-button" id="submit-button">
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
