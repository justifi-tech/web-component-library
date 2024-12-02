import type { Meta } from "@storybook/web-components";
import { withActions } from "@storybook/addon-actions/decorator";
import { StoryBaseArgs, customStoryDecorator } from "../../utils";

import "@justifi/webcomponents/dist/module/justifi-checkouts-list";

const examplePayload = {
  "id": "cho_xyz",
  "account_id": "acc_xyz",
  "platform_account_id": "acc_xyz",
  "payment_amount": 10000,
  "payment_currency": "usd",
  "payment_description": "my_order_xyz",
  "payment_methods": [ ],
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
  "payment_settings": { },
  "created_at": "2024-01-01T12:00:00Z",
  "updated_at": "2024-01-01T12:00:00Z"
  };

const themes = {
  basic: {},
  custom: {
    "justifi-checkouts-list::part(label)": {
      color: "#212529",
      "font-family": "Calibri, sans-serif",
      "font-weight": "700",
      "font-size": ".8rem",
      margin: "0 0 .5rem 0",
    },
    "justifi-checkouts-list::part(input)": {
      "background-color": "#F4F4F6",
      "border-color": "rgba(0, 0, 0, 0.42)",
      "border-bottom-width": "1px",
      "border-left-width": "0",
      "border-right-width": "0",
      "border-top-width": "0",
      "border-radius": "4px 4px 0 0",
      "border-style": "solid",
      "box-shadow": "0 2px 4px rgba(0, 0, 0, 0.2)",
      color: "#212529",
      "font-size": ".8rem",
      "font-weight": "400",
      "line-height": "2",
      margin: "0",
      padding: ".5rem .875rem",
    },
    "justifi-checkouts-list::part(input):focus": {
      color: "#212529",
      "border-color": "#fccc32",
      "box-shadow": "none",
    },
    "justifi-checkouts-list::part(input-invalid)": {
      "border-color": "#C12727",
      "box-shadow": "0 2px 4px rgba(0, 0, 0, 0.2)",
    },
    "justifi-checkouts-list::part(input-invalid):focus": {
      "border-color": "#C12727",
      "box-shadow": "none",
    },
    "justifi-checkouts-list::part(table-head)": {},
    "justifi-checkouts-list::part(table-head-row)": {},
    "justifi-checkouts-list::part(table-head-cell)": {
      "background-color": "#fff",
      "font-weight": "600",
      "font-size": "0.8rem",
      "text-transform": "uppercase",
      "letter-spacing": "0.1em",
    },
    "justifi-checkouts-list::part(table-body)": {},
    "justifi-checkouts-list::part(table-row)": {},
    "justifi-checkouts-list::part(table-row):hover": {
      cursor: "pointer",
    },
    "justifi-checkouts-list::part(table-row-even)": {},
    "justifi-checkouts-list::part(table-row-odd)": {},
    "justifi-checkouts-list::part(table-cell)": {
      "background-color": "transparent",
      "font-weight": "normal",
      "font-size": "0.8rem",
    },
    "justifi-checkouts-list::part(loading-state-cell)": {},
    "justifi-checkouts-list::part(loading-state-spinner)": {
      color: "#ccc",
    },
    "justifi-checkouts-list::part(error-state)": {},
    "justifi-checkouts-list::part(empty-state)": {},
    "justifi-checkouts-list::part(pagination-bar)": {
      "background-color": "#fff",
      "border-bottom": "none",
    },
    "justifi-checkouts-list::part(page-button)": {
      border: "none",
      "background-color": "transparent",
      "text-transform": "uppercase",
      "font-weight": "normal",
      "font-size": "0.8rem",
    },
    "justifi-checkouts-list::part(page-button-disabled)": {
      opacity: "0.5",
      cursor: "not-allowed",
    },
    "justifi-checkouts-list::part(page-arrow)": {
      display: "none",
    },
    "justifi-checkouts-list::part(page-button-text)": {},
  },
};

const storyBaseArgs = new StoryBaseArgs(["account-id", "auth-token", "theme"]);

const meta: Meta = {
  title: "Merchant Tools/Checkouts List",
  component: "justifi-checkouts-list",
  args: {
    ...storyBaseArgs.args,
  },
  argTypes: {
    ...storyBaseArgs.argTypes,
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
    themes,
  },
  decorators: [
    customStoryDecorator,
    // @ts-ignore - Ignore Storybook bug (reference to bug issue)
    withActions, // https://github.com/storybookjs/storybook/issues/22384
  ],
};

export const Example = {};

export default meta;
