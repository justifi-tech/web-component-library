import { Meta, StoryObj } from "@storybook/web-components";
import { customStoryDecorator, StoryBaseArgs } from "../../../utils";
import { withActions } from "@storybook/addon-actions/decorator";

import "@justifi/webcomponents/dist/module/justifi-modular-checkout";
import "@justifi/webcomponents/dist/module/justifi-card-form";
import "@justifi/webcomponents/dist/module/justifi-postal-code-form";
import "./styles.css";

type Story = StoryObj;

const storyBaseArgs = new StoryBaseArgs(["auth-token", "account-id", "checkout-id"]);

const meta: Meta = {
  title: "Modular Checkout/Examples/Layout 2",
  component: "justifi-modular-checkout",
  args: {
    ...storyBaseArgs.args,
    "save-payment-method": "true",
    "slot": () => `
      <div class="checkout-page">
        <!-- Header -->
        <div class="checkout-header">
          <div class="checkout-brand">
            <span class="checkout-brand-primary">JustiFi</span>
            <span class="checkout-brand-secondary">BREW</span>
          </div>
          <div class="checkout-nav">
            <a href="#" class="checkout-nav-link">SHOP</a>
            <a href="#" class="checkout-nav-link">LEARN</a>
            <div class="checkout-cart-icon">
              🛒
              <div class="checkout-cart-badge">1</div>
            </div>
          </div>
        </div>

        <!-- Main Container -->
        <div class="checkout-main">
          <!-- Checkout Section -->
          <div class="checkout-left-column">
            <h1 class="checkout-title">Checkout</h1>
            
            <hr class="checkout-divider" />
            
            <!-- Shipping Section -->
            <div class="checkout-section">
              <div class="checkout-section-header">
                <h2 class="checkout-section-title">Shipping</h2>
                <a href="#" class="checkout-edit-link">Edit</a>
              </div>
              <div class="checkout-shipping-info">
                <div>John Doe</div>
                <div>123 Main St, Anytown, USA</div>
                <div>Standard Shipping: Free</div>
                <div class="checkout-shipping-arrival">Arrive Thursday, October 31st</div>
              </div>
            </div>

            <hr class="checkout-divider" />

            <!-- Payment Method Section -->
            <div class="checkout-section">
              <h2 class="checkout-section-title">Payment Method</h2>
              
              <button class="checkout-paypal-button">
                <span>PayPal</span>
              </button>
              
              <div class="checkout-or-divider">
                <div class="checkout-or-line left"></div>
                <span class="checkout-or-text">or</span>
                <div class="checkout-or-line right"></div>
              </div>

              <div class="checkout-form-container">
                <justifi-card-form></justifi-card-form>
                <justifi-postal-code-form></justifi-postal-code-form>
              </div>

              <button class="checkout-submit-button" id="submit-button">
                PLACE ORDER
              </button>
              
              <div class="checkout-terms">
                By clicking Place Order you agree to the <a href="#" class="checkout-terms-link">Terms & Conditions.</a>
              </div>
            </div>
          </div>

          <!-- Shopping Cart Section -->
          <div class="checkout-right-column">
            <div class="checkout-cart-container">
              <div class="checkout-cart-header">
                <h2 class="checkout-cart-title">Shopping Cart</h2>
                <a href="#" class="checkout-edit-link">Edit</a>
              </div>
              
              <div class="checkout-summary">
                <div class="checkout-summary-row">
                  <span>Subtotal</span>
                  <span>$38.00</span>
                </div>
                <div class="checkout-summary-row">
                  <span>Shipping Fee</span>
                  <span>Free</span>
                </div>
                <div class="checkout-summary-row">
                  <span>Tax</span>
                  <span>$4.00</span>
                </div>
                <div class="checkout-summary-total">
                  <span>Order Total</span>
                  <span>$42.00</span>
                </div>
              </div>
              
              <div class="checkout-items-section">
                <div class="checkout-items-header">
                  <span>ITEM</span>
                  <span class="checkout-items-header-qty">QTY</span>
                  <span class="checkout-items-header-price">PRICE</span>
                </div>
                <div class="checkout-item">
                  <div>
                    <div class="checkout-item-name">Drip Coffee Funnel</div>
                    <div class="checkout-item-description">8 cups / 64 ounces</div>
                  </div>
                  <div class="checkout-item-qty">1</div>
                  <div class="checkout-item-price">$38.00</div>
                </div>
              </div>
            </div>
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
