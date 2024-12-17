import type { Meta, StoryObj } from "@storybook/web-components";
import { customStoryDecorator, StoryBaseArgs } from "../../utils";
import { ThemeNames } from "../../themes";

import "@justifi/webcomponents/dist/module/justifi-payouts-list";
import "@justifi/webcomponents/dist/module/justifi-payouts-list-filters";

const examplePayload = {
  "id": "po_xyz",
  "account_id": "449e7a5c-69d3-4b8a-aaaf-5c9b713ebc65",
  "amount": 100000,
  "bank_account": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "full_name": "string",
    "bank_name": "string",
    "account_number_last4": 1111,
    "routing_number": "string",
    "country": "US",
    "currency": "usd",
    "nickname": "string",
    "account_type": "checking"
    },
  "currency": "usd",
  "delivery_method": "standard",
  "description": "string",
  "deposits_at": "2021-01-01T12:00:00Z",
  "fees_total": 5000,
  "refunds_count": 5,
  "refunds_total": 10000,
  "payments_count": 50,
  "payments_total": 110000,
  "payout_type": "ach cc",
  "other_total": 100,
  "status": "paid",
  "metadata": {
    "customer_payout_id": "cp_12345"
  },
  "created_at": "2021-01-01T12:00:00Z",
  "updated_at": "2021-01-01T12:00:00Z"
  }

type Story = StoryObj;

const storyBaseArgs = new StoryBaseArgs(["account-id", "auth-token"]);

const meta: Meta = {
  title: "Merchant Tools/Payouts List",
  component: "justifi-payouts-list",
  args: {
    ...storyBaseArgs.args,
    Theme: ThemeNames.Light
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
    "row-clicked": {
      description: "`RowClicked`",
      table: {
        category: "events",
        defaultValue: {
          summary: "Emits chosen Payout object on row click",
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
          summary: "created_at,amount,status,payments_total,refunds_total,fees_total,other_total,csv"
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
  ]
};

export const Example: Story = {};

export const ExampleWithFilters: Story = {
  args: {},
  render: (args) => `
    <div>
      <justifi-payouts-list-filters></justifi-payouts-list-filters>
      <justifi-payouts-list
        auth-token="${args["auth-token"]}"
        account-id="${args["account-id"]}">
      </justifi-payouts-list>
    </div>
  `
};

export default meta;
