import type { Meta } from "@storybook/web-components";
import { withActions } from "@storybook/addon-actions/decorator";
import { StoryBaseArgs, customStoryDecorator } from "../../utils";

import "@justifi/webcomponents/dist/module/justifi-checkouts-list";
import { ThemeNames } from "../../themes";

const examplePayload = {
  "id": "cho_xyz",
  "account_id": "acc_xyz",
  "platform_account_id": "acc_xyz",
  "payment_amount": 10000,
  "payment_currency": "usd",
  "payment_description": "my_order_xyz",
  "payment_methods": [],
  "payment_method_group_id": "pmg_xyz",
  "status": "created",
  "mode": "test live",
  "successful_payment_id": "py_xyz",
  "statement_descriptor": "Big Business",
  "application_fees": {
    "card": {
      "amount": 300
    },
    "bank_account": {
      "amount": 150
    }
  },
  "payment_settings": {},
  "created_at": "2024-01-01T12:00:00Z",
  "updated_at": "2024-01-01T12:00:00Z"
};

const storyBaseArgs = new StoryBaseArgs(["account-id", "auth-token", "theme"]);

const meta: Meta = {
  title: "Merchant Tools/Checkouts List",
  component: "justifi-checkouts-list",
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
          summary: "Emits chosen Checkout object on row click",
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
          summary: "created_at,payment_amount,payment_description,payment_mode,status"
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
