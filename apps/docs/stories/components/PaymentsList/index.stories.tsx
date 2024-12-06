import type { Meta } from "@storybook/web-components";
import { withActions } from "@storybook/addon-actions/decorator";
import { StoryBaseArgs, customStoryDecorator } from "../../utils";

import "@justifi/webcomponents/dist/module/justifi-payments-list";

const themes = {
  basic: {},
  custom: {
    "justifi-payments-list::part(label)": {
      color: "#212529",
      "font-family": "Calibri, sans-serif",
      "font-weight": "700",
      "font-size": ".8rem",
      margin: "0 0 .5rem 0",
    },
    "justifi-payments-list::part(input)": {
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
    "justifi-payments-list::part(input):focus": {
      color: "#212529",
      "border-color": "#fccc32",
      "box-shadow": "none",
    },
    "justifi-payments-list::part(input-invalid)": {
      "border-color": "#C12727",
      "box-shadow": "0 2px 4px rgba(0, 0, 0, 0.2)",
    },
    "justifi-payments-list::part(input-invalid):focus": {
      "border-color": "#C12727",
      "box-shadow": "none",
    },
    "justifi-payments-list::part(table-head)": {},
    "justifi-payments-list::part(table-head-row)": {},
    "justifi-payments-list::part(table-head-cell)": {
      "background-color": "#fff",
      "font-weight": "600",
      "font-size": "0.8rem",
      "text-transform": "uppercase",
      "letter-spacing": "0.1em",
    },
    "justifi-payments-list::part(table-body)": {},
    "justifi-payments-list::part(table-row)": {},
    "justifi-payments-list::part(table-row):hover": {
      cursor: "pointer",
    },
    "justifi-payments-list::part(table-row-even)": {},
    "justifi-payments-list::part(table-row-odd)": {},
    "justifi-payments-list::part(table-cell)": {
      "background-color": "transparent",
      "font-weight": "normal",
      "font-size": "0.8rem",
    },
    "justifi-payments-list::part(loading-state-cell)": {},
    "justifi-payments-list::part(loading-state-spinner)": {
      color: "#ccc",
    },
    "justifi-payments-list::part(error-state)": {},
    "justifi-payments-list::part(empty-state)": {},
    "justifi-payments-list::part(pagination-bar)": {
      "background-color": "#fff",
      "border-bottom": "none",
    },
    "justifi-payments-list::part(page-button)": {
      border: "none",
      "background-color": "transparent",
      "text-transform": "uppercase",
      "font-weight": "normal",
      "font-size": "0.8rem",
    },
    "justifi-payments-list::part(page-button-disabled)": {
      opacity: "0.5",
      cursor: "not-allowed",
    },
    "justifi-payments-list::part(page-arrow)": {
      display: "none",
    },
    "justifi-payments-list::part(page-button-text)": {},
  },
};

const storyBaseArgs = new StoryBaseArgs(["account-id", "auth-token", "theme"]);

const meta: Meta = {
  title: "Merchant Tools/Payments List",
  component: "justifi-payments-list",
  args: {
    ...storyBaseArgs.args,
  },
  argTypes: {
    ...storyBaseArgs.argTypes,
    "payment-row-clicked": {
      description: "`PaymentRowClicked`",
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
      handles: ["payment-row-clicked", "error-event"],
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
