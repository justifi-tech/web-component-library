import type { Meta } from "@storybook/web-components";
import { withActions } from "@storybook/addon-actions/decorator";
import { StoryBaseArgs, customStoryDecorator } from "../../utils";

import "@justifi/webcomponents/dist/module/justifi-terminals-list";

const themes = {
  basic: {},
  custom: {
    "justifi-terminals-list::part(label)": {
      color: "#212529",
      "font-family": "Calibri, sans-serif",
      "font-weight": "700",
      "font-size": ".8rem",
      margin: "0 0 .5rem 0",
    },
    "justifi-terminals-list::part(input)": {
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
    "justifi-terminals-list::part(input):focus": {
      color: "#212529",
      "border-color": "#fccc32",
      "box-shadow": "none",
    },
    "justifi-terminals-list::part(input-invalid)": {
      "border-color": "#C12727",
      "box-shadow": "0 2px 4px rgba(0, 0, 0, 0.2)",
    },
    "justifi-terminals-list::part(input-invalid):focus": {
      "border-color": "#C12727",
      "box-shadow": "none",
    },
    "justifi-terminals-list::part(table-head)": {},
    "justifi-terminals-list::part(table-head-row)": {},
    "justifi-terminals-list::part(table-head-cell)": {
      "background-color": "#fff",
      "font-weight": "600",
      "font-size": "0.8rem",
      "text-transform": "uppercase",
      "letter-spacing": "0.1em",
    },
    "justifi-terminals-list::part(table-body)": {},
    "justifi-terminals-list::part(table-row)": {},
    "justifi-terminals-list::part(table-row):hover": {
      cursor: "pointer",
    },
    "justifi-terminals-list::part(table-row-even)": {},
    "justifi-terminals-list::part(table-row-odd)": {},
    "justifi-terminals-list::part(table-cell)": {
      "background-color": "transparent",
      "font-weight": "normal",
      "font-size": "0.8rem",
    },
    "justifi-terminals-list::part(loading-state-cell)": {},
    "justifi-terminals-list::part(loading-state-spinner)": {
      color: "#ccc",
    },
    "justifi-terminals-list::part(error-state)": {},
    "justifi-terminals-list::part(empty-state)": {},
    "justifi-terminals-list::part(pagination-bar)": {
      "background-color": "#fff",
      "border-bottom": "none",
    },
    "justifi-terminals-list::part(page-button)": {
      border: "none",
      "background-color": "transparent",
      "text-transform": "uppercase",
      "font-weight": "normal",
      "font-size": "0.8rem",
    },
    "justifi-terminals-list::part(page-button-disabled)": {
      opacity: "0.5",
      cursor: "not-allowed",
    },
    "justifi-terminals-list::part(page-arrow)": {
      display: "none",
    },
    "justifi-terminals-list::part(page-button-text)": {},
  },
};

const storyBaseArgs = new StoryBaseArgs(["account-id", "auth-token", "theme"]);

const meta: Meta = {
  title: "Merchant Tools/Terminals List",
  component: "justifi-terminals-list",
  args: {
    ...storyBaseArgs.args
  },
  argTypes: {
    ...storyBaseArgs.argTypes,
    "terminal-row-clicked": {
      description: "`TerminalRowClicked`",
      table: {
        category: "events"
      },
      action: true
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
          summary: "nickname,provider_id,status"
        }
      },
      control: {
        type: "text",
      },
    }
  },
  parameters: {
    actions: {
      handles: ["terminal-row-clicked", "error-event"],
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
  ]
};

export const Example = {};

export default meta;
