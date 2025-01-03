import type { Meta, StoryObj } from "@storybook/web-components";
import { withActions } from "@storybook/addon-actions/decorator";
import { customStoryDecorator, StoryBaseArgs } from "../../utils";
import { ThemeNames } from "../../themes";

import "@justifi/webcomponents/dist/module/justifi-checkout";
import "@justifi/webcomponents/dist/module/justifi-season-interruption-insurance";

const storyBaseArgs = new StoryBaseArgs(["auth-token"]);

const meta: Meta = {
  title: "Payment Facilitation/Unified Fintech Checkout™",
  component: "justifi-checkout",
  args: {
    ...storyBaseArgs.args,
    "checkout-id": "123",
    Theme: ThemeNames.Light,
  },
  argTypes: {
    ...storyBaseArgs.argTypes,
    Theme: {
      description:
        "Select a theme to preview the component in. [See example](https://storybook.justifi.ai/?path=/docs/introduction--docs#styling)",
      options: Object.values(ThemeNames),
      control: {
        type: "select",
      },
    },
    "withInsurance": {
      table: { disable: true }
    },
    "checkout-id": {
      description: "Checkout ID `string`",
      table: {
        category: "props",
      },
    },
    "disable-credit-card": {
      type: "boolean",
      control: {
        type: "boolean",
      },
      description: "Disable new credit card payment method option",
      table: {
        category: "props",
        defaultValue: { summary: "undefined" },
      },
    },
    "disable-bank-account": {
      type: "boolean",
      control: {
        type: "boolean",
      },
      description: "Disable new bank account payment method option",
      table: {
        category: "props",
        defaultValue: { summary: "undefined" },
      },
    },
    "disable-bnpl": {
      type: "boolean",
      control: {
        type: "boolean",
      },
      description: "Disable BNPL payment method option",
      table: {
        category: "props",
        defaultValue: { summary: "undefined" },
      },
    },
    "disable-payment-method-group": {
      type: "boolean",
      control: {
        type: "boolean",
      },
      description: "Disable saved payment methods option",
      table: {
        category: "props",
        defaultValue: { summary: "undefined" },
      },
    },
    fillBillingForm: {
      description:
        "`fillBillingForm(fields: BillingFormFields) => Promise<void>`",
      table: {
        category: "methods",
      },
    },
    "submit-event": {
      description:
        "Emitted when the server response is received after submitting.  Will not be raised if form vailidation fails.",
      table: {
        category: "events",
      },
      action: true,
    },
    "error-event": {
      description: "`ComponentError`",
      table: {
        category: "events",
      },
      action: true,
    },
    "loaded": {
      description:
        "Return the checkout status once checkout is loaded. It can be `'created' | 'completed' | 'attempted' | 'expired'`",
      table: {
        category: "events",
      },
      action: true,
    },
    loadFontsOnParent: {
      description: "`loadFontsOnParent() => Promise<any>`",
      table: {
        category: "methods",
      },
    },
  },
  parameters: {
    actions: {
      handles: ["submit-event", "loaded", "error-event"],
    },
    chromatic: {
      delay: 2000,
    },
  },
};

export const Example: StoryObj = {};
Example.decorators = [
  customStoryDecorator,
  // @ts-ignore
  withActions,
];

export const CheckoutInsurance: StoryObj = {
  args: {
    withInsurance: true,
    slot: (args: any) => {
      const checkoutId = args.find((arg: any) => arg.name === 'checkout-id').value;
      const authToken = args.find((arg: any) => arg.name === 'auth-token').value;
      return `
        <div slot="insurance">
          <justifi-season-interruption-insurance
            checkout-id="${checkoutId}"
            auth-token="${authToken}"
          />
        </div>
      `
    }
  }
};

CheckoutInsurance.decorators = [
  customStoryDecorator,
  // @ts-ignore
  withActions
];

export default meta;
