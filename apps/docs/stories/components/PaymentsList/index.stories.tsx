import type { Meta } from "@storybook/web-components";
import { withActions } from "@storybook/addon-actions/decorator";
import { StoryBaseArgs, customStoryDecorator } from "../../utils";

import "@justifi/webcomponents/dist/module/justifi-payments-list";
import { ThemeNames } from "../../themes";

const examplePayload = {
  "id": "py_xyz",
  "account_id": "acc_xyz",
  "amount": 10000,
  "amount_disputed": 0,
  "amount_refunded": 0,
  "amount_refundable": 10000,
  "balance": 99850,
  "fee_amount": 150,
  "financial_transaction_id": "ft_123xyz",
  "captured": true,
  "capture_strategy": "automatic",
  "currency": "usd",
  "description": "my_order_xyz",
  "disputed": false,
  "disputes": [ ],
  "error_code": "credit_card_number_invalid",
  "error_description": "Credit Card Number Invalid (Failed LUHN checksum)",
  "is_test": true,
  "metadata": { },
  "payment_intent_id": "pi_123xyz",
  "checkout_id": "cho_123",
  "payment_method": {},
  "application_fee": {},
  "refunded": false,
  "status": "pending",
  "payment_mode": "ecom",
  "created_at": "2021-01-01T12:00:00Z",
  "updated_at": "2021-01-01T12:00:00Z"
  };

const storyBaseArgs = new StoryBaseArgs(["account-id", "auth-token"]);

const meta: Meta = {
  title: "Merchant Tools/Payments List",
  component: "justifi-payments-list",
  args: {
    ...storyBaseArgs.args,
    Theme: ThemeNames.Light
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
    "row-clicked": {
      description: "`RowClicked`",
      table: {
        category: "events",
        defaultValue: {
          summary: "Emits chosen Payment object on row click",
          detail: JSON.stringify(examplePayload)
        }
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
    "columns": {
      description: "Columns to display in the table <br> Pass a comma separated list of columns to display in the table.",
      type: 'string',
      table: {
        category: "props",
        defaultValue: {
          summary: "created_at,amount,status,payment_type,description,payers_name,last_four_digits"
        }
      },
      control: {
        type: "text",
      },
    }
  },
  parameters: {
    actions: {
      handles: ["row-clicked", "error-event"],
    },
    chromatic: {
      delay: 2000,
    },
  },
  decorators: [
    customStoryDecorator,
    // @ts-ignore - Ignore Storybook bug (reference to bug issue)
    withActions, // https://github.com/storybookjs/storybook/issues/22384
  ],
};

export const Example = {};

export default meta;
