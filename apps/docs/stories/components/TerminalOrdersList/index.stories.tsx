import type { Meta, StoryObj } from "@storybook/web-components";
import { withActions } from "@storybook/addon-actions/decorator";
import { StoryBaseArgs, customStoryDecorator } from "../../utils";
import { ThemeNames } from "../../themes";

import "@justifi/webcomponents/dist/module/justifi-terminal-orders-list";
import "@justifi/webcomponents/dist/module/justifi-terminal-orders-list-filters";

type Story = StoryObj;

const storyBaseArgs = new StoryBaseArgs(["account-id", "auth-token"]);

const meta: Meta = {
  title: "Merchant Tools/Terminal Orders List",
  component: "justifi-terminal-orders-list",
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
    "click-event": {
      description:
        "Emitted when controls or table rows are clicked.  Control name is defined in `event.detail.name`.",
      table: {
        category: "events",
      },
      action: true
    },
    "error-event": {
      description: "`ComponentError` - emitted when a network error occurs in the component.",
      table: {
        category: "events",
      },
      action: true
    },
    "columns": {
      description: "Columns to display in the table <br> Pass a comma separated list of columns to display in the table.",
      type: "string",
      table: {
        category: "props",
        defaultValue: {
          summary: "created_at,updated_at,order_status,quantity",
          detail: "The following values are available to pass to the columns prop as a comma separated string: `created_at`, `updated_at`, `order_status` and `quantity`"
        }
      },
      control: {
        type: "text",
      },
    }
  },
  parameters: {
    actions: {
      handles: ["click-event", "error-event"],
    },
    chromatic: {
      delay: 2000,
    },
  },
  decorators: [
    customStoryDecorator,
    withActions
  ]
};

export const Example: Story = {};

export const ExampleWithFilters: Story = {
  args: {},
  render: (args) => `
  <div>
    <justifi-terminal-orders-list-filters></justifi-terminal-orders-list-filters>
    <justifi-terminal-orders-list
      account-id="${args["account-id"]}"
      auth-token="${args["auth-token"]}"
    ></justifi-terminal-orders-list>
  </div>
  `
};

export default meta;
