import type { Meta } from "@storybook/web-components";
import { withActions } from "@storybook/addon-actions/decorator";
import { CSSVarsExample, StoryBaseArgs, getAttributesString, themedStoryDecorator } from "../../utils";

import "@justifi/webcomponents/dist/module/justifi-payment-form";
import themes, { ThemeNames } from "../../themes";

const storyBaseArgs = new StoryBaseArgs([
  "account-id",
  "client-id",
  "auth-token",
  "theme",
]);

const meta: Meta = {
  title: "Payment Facilitation/Payments/Payment Form",
  component: "justifi-payment-form",
  args: {
    ...storyBaseArgs.args,
    Theme: ThemeNames.Light,
    email: "test@test.com",
    "submit-button-text": "Submit Payment",
    card: true,
    "bank-account": true,
  },
  argTypes: {
    ...storyBaseArgs.argTypes,
    Theme: {
      description:
        "Select a theme to preview the component in. [See example](https://storybook.justifi.ai/?path=/docs/introduction--docs#styling-components-with-variables)",
      options: Object.values(ThemeNames),
      control: {
        type: "select",
      },
    },
    "bank-account": {
      type: "boolean",
      description:
        "Boolean indicating if the Payment Form should render Bank Account inputs `boolean`",
      control: {
        type: "boolean",
      },
      table: {
        category: "props",
      },
    },
    card: {
      type: "boolean",
      description:
        "Boolean indicating if the Payment Form should render Card inputs `boolean`",
      control: {
        type: "boolean",
      },
      table: {
        category: "props",
      },
    },
    email: {
      type: "string",
      description: "Email `string`",
      control: {
        type: "text",
      },
      table: {
        category: "props",
      },
    },
    "submit-button-text": {
      type: "string",
      control: {
        type: "text",
      },
      table: {
        category: "props",
      },
    },
    submitted: {
      description:
        "`BankAccountCreateResponse` `CardCreateResponse` `PaymentMethodErrorResponse`",
      table: {
        category: "events",
      },
    },
    "error-event": {
      description: "`ComponentError`",
      table: {
        category: "events",
      },
      action: true,
    },
    enableSubmitButton: {
      description: "`enableSubmitButton() => Promise<void>`",
      table: {
        category: "methods",
      },
    },
    disableSubmitButton: {
      description: "`disableSubmitButton() => Promise<void>`",
      table: {
        category: "methods",
      },
    },
    fillBillingForm: {
      description:
        "`fillBillingForm(fields: BillingFormFields) => Promise<void>`",
      table: {
        category: "methods",
      },
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
      handles: ["submitted", "error-event"],
    },
    chromatic: {
      delay: 2000,
    },
  },
  decorators: [
    withActions
  ],
};

const Template = (args: any) => {
  // The <div> here should be replaced by a `display` property in the cardForm potentially
  return `
    <justifi-payment-form ${getAttributesString(args)}></justifi-payment-form>
    <style>
      ${themes[args['Theme']]}
    </style>
    <script>
    (async () => {
      await customElements.whenDefined('justifi-payment-form');
      const paymentForm = document.querySelector('justifi-payment-form');
      paymentForm.addEventListener('submitted', async (event) => {
        // here is where you would submit a payment with the token
        console.log(event.detail);
        // after the payment succeeds or fails, the form submit button can be enabled again
        await paymentForm.enableSubmitButton();
      });
    })()
    </script>
  `;
};

export const Example = Template;

export default meta;
