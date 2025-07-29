import { Meta, StoryObj } from "@storybook/web-components";
import { customStoryDecorator, StoryBaseArgs } from "../../../utils";
import { withActions } from "@storybook/addon-actions/decorator";

import "@justifi/webcomponents/dist/module/justifi-modular-checkout";
import "@justifi/webcomponents/dist/module/justifi-card-form";
import "@justifi/webcomponents/dist/module/justifi-postal-code-form";

type Story = StoryObj;

const storyBaseArgs = new StoryBaseArgs(["auth-token", "account-id", "checkout-id"]);

const meta: Meta = {
  title: "Modular Checkout/Examples/Layout 2",
  component: "justifi-modular-checkout",
  args: {
    ...storyBaseArgs.args,
    "save-payment-method": "true",
    "slot": () => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #ffffff; color: #000000;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px 40px; border-bottom: 1px solid #e0e0e0;">
          <div style="font-size: 24px; font-weight: bold;">
            <span style="color: #2d5a27;">JustiFi</span>
            <span style="color: #4a7c59;">BREW</span>
          </div>
          <div style="display: flex; align-items: center; gap: 30px;">
            <a href="#" style="text-decoration: none; color: #000000; font-weight: 500; text-transform: uppercase; font-size: 14px;">SHOP</a>
            <a href="#" style="text-decoration: none; color: #000000; font-weight: 500; text-transform: uppercase; font-size: 14px;">LEARN</a>
            <div style="position: relative; cursor: pointer;">
              🛒
              <div style="position: absolute; top: -8px; right: -8px; background-color: #000000; color: #ffffff; border-radius: 50%; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">1</div>
            </div>
          </div>
        </div>

        <!-- Main Container -->
        <div style="display: flex; max-width: 1200px; margin: 0 auto; padding: 40px 20px; gap: 40px;">
          <!-- Checkout Section -->
          <div style="flex: 2;">
            <h1 style="font-size: 28px; font-weight: bold; margin-bottom: 30px; color: #000000;">Checkout</h1>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;" />
            
            <!-- Shipping Section -->
            <div style="margin-bottom: 30px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h2 style="font-size: 18px; font-weight: bold; color: #000000;">Shipping</h2>
                <a href="#" style="color: #2d5a27; text-decoration: none; font-size: 14px; cursor: pointer;">Edit</a>
              </div>
              <div style="line-height: 1.6; color: #000000;">
                <div>John Doe</div>
                <div>123 Main St, Anytown, USA</div>
                <div>Standard Shipping: Free</div>
                <div style="font-weight: bold;">Arrive Thursday, October 31st</div>
              </div>
            </div>

            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;" />

            <!-- Payment Method Section -->
            <div style="margin-bottom: 30px;">
              <h2 style="font-size: 18px; font-weight: bold; color: #000000;">Payment Method</h2>
              
              <button style="width: 100%; background-color: #ffc439; border: none; padding: 15px; border-radius: 4px; color: #ffffff; font-size: 16px; font-weight: bold; cursor: pointer; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; gap: 10px;">
                <span>PayPal</span>
              </button>
              
              <div style="text-align: center; margin: 20px 0; position: relative;">
                <div style="position: absolute; top: 50%; left: 15%; height: 1px; background-color: #e0e0e0; width: 30%;"></div>
                <span style="background-color: #ffffff; padding: 0 15px; color: #666666; font-size: 14px;">or</span>
                <div style="position: absolute; top: 50%; right: 15%; height: 1px; background-color: #e0e0e0; width: 30%;"></div>
              </div>

              <div style="display: flex; flex-direction: column; gap: 15px; margin-bottom: 20px;">
                <justifi-card-form></justifi-card-form>
                <justifi-postal-code-form></justifi-postal-code-form>
              </div>

              <button style="width: 100%; background-color: #2d5a27; border: none; padding: 15px; border-radius: 4px; color: #ffffff; font-size: 16px; font-weight: bold; text-transform: uppercase; cursor: pointer; margin-top: 20px;" id="submit-button">
                PLACE ORDER
              </button>
              
              <div style="font-size: 12px; color: #666666; margin-top: 10px; text-align: center;">
                By clicking Place Order you agree to the <a href="#" style="color: #2d5a27; text-decoration: none;">Terms & Conditions.</a>
              </div>
            </div>
          </div>

          <!-- Shopping Cart Section -->
          <div style="flex: 1;">
            <div style="border: 1px solid #e0e0e0; border-radius: 4px; padding: 20px; background-color: #ffffff;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="font-size: 18px; font-weight: bold; color: #000000;">Shopping Cart</h2>
                <a href="#" style="color: #2d5a27; text-decoration: none; font-size: 14px; cursor: pointer;">Edit</a>
              </div>
              
              <div style="margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
                  <span>Subtotal</span>
                  <span>$38.00</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
                  <span>Shipping Fee</span>
                  <span>Free</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
                  <span>Tax</span>
                  <span>$4.00</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 16px; border-top: 1px solid #e0e0e0; padding-top: 10px; margin-top: 10px;">
                  <span>Order Total</span>
                  <span>$42.00</span>
                </div>
              </div>
              
              <div style="border-top: 1px solid #e0e0e0; padding-top: 15px;">
                <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 10px; margin-bottom: 15px; font-size: 12px; color: #666666; text-transform: uppercase; font-weight: 500;">
                  <span>ITEM</span>
                  <span style="text-align: center;">QTY</span>
                  <span style="text-align: right;">PRICE</span>
                </div>
                <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 10px; align-items: start;">
                  <div>
                    <div style="font-weight: 500; color: #000000;">Drip Coffee Funnel</div>
                    <div style="font-size: 12px; color: #666666; margin-top: 2px;">8 cups / 64 ounces</div>
                  </div>
                  <div style="text-align: center; color: #000000;">1</div>
                  <div style="text-align: right; color: #000000;">$38.00</div>
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
