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
  title: "Modular Checkout/Examples/Layout 2",
  component: "justifi-modular-checkout",
  args: {
    ...storyBaseArgs.args,
    "save-payment-method": "true",
    "slot": () => `
      <div class="checkout-container">
        <!-- Header -->
        <div class="checkout-header">
          <div class="brand-logo">
            <span class="brand-logo-primary">JustiFi</span>
            <span class="brand-logo-secondary">BREW</span>
          </div>
          <div class="header-nav">
            <a href="#" class="nav-link">SHOP</a>
            <a href="#" class="nav-link">LEARN</a>
            <div class="cart-icon">
              🛒
              <div class="cart-badge">1</div>
            </div>
          </div>
        </div>

        <!-- Main Container -->
        <div class="main-container">
          <!-- Checkout Section -->
          <div class="checkout-section">
            <h1 class="checkout-title">Checkout</h1>
            
            <hr class="divider" />
            
            <!-- Shipping Section -->
            <div class="section">
              <div class="section-header">
                <h2 class="section-title">Shipping</h2>
                <a href="#" class="edit-link">Edit</a>
              </div>
              <div class="section-content">
                <div>John Doe</div>
                <div>123 Main St, Anytown, USA</div>
                <div>Standard Shipping: Free</div>
                <div class="section-content-bold">Arrive Thursday, October 31st</div>
              </div>
            </div>

            <hr class="divider" />

            <!-- Payment Method Section -->
            <div class="section">
              <h2 class="section-title">Payment Method</h2>
              
              <button class="paypal-button">
                <span>PayPal</span>
              </button>
              
              <div class="divider-container">
                <div class="divider-line divider-line-left"></div>
                <span class="divider-text">or</span>
                <div class="divider-line divider-line-right"></div>
              </div>

              <div class="payment-forms">
                <justifi-card-form></justifi-card-form>
                <justifi-postal-code-form></justifi-postal-code-form>
              </div>

              <button class="place-order-button" id="submit-button">
                PLACE ORDER
              </button>
              
              <div class="terms-text">
                By clicking Place Order you agree to the <a href="#" class="terms-link">Terms & Conditions.</a>
              </div>
            </div>
          </div>

          <!-- Shopping Cart Section -->
          <div class="cart-section">
            <div class="cart-container">
              <div class="cart-header">
                <h2 class="cart-title">Shopping Cart</h2>
                <a href="#" class="edit-link">Edit</a>
              </div>
              
              <div class="cart-summary">
                <div class="summary-row">
                  <span>Subtotal</span>
                  <span>$38.00</span>
                </div>
                <div class="summary-row">
                  <span>Shipping Fee</span>
                  <span>Free</span>
                </div>
                <div class="summary-row">
                  <span>Tax</span>
                  <span>$4.00</span>
                </div>
                <div class="summary-row-total">
                  <span>Order Total</span>
                  <span>$42.00</span>
                </div>
              </div>
              
              <div class="cart-items">
                <div class="items-header">
                  <span>ITEM</span>
                  <span class="items-header-center">QTY</span>
                  <span class="items-header-right">PRICE</span>
                </div>
                <div class="item-row">
                  <div>
                    <div class="item-name">Drip Coffee Funnel</div>
                    <div class="item-description">8 cups / 64 ounces</div>
                  </div>
                  <div class="item-quantity">1</div>
                  <div class="item-price">$38.00</div>
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
