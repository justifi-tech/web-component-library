import type { Meta, StoryObj } from "@storybook/web-components";
import { withActions } from "@storybook/addon-actions/decorator";
import { customStoryDecorator, StoryBaseArgs } from "../../utils";

import "@justifi/webcomponents/dist/module/justifi-order-terminals";
import { ThemeNames } from "../../themes";

type Story = StoryObj;

const storyBaseArgs = new StoryBaseArgs(["business-id", "account-id", "auth-token"]);

const meta: Meta = {
  title: "Merchant Tools/Order Terminals",
  component: "justifi-order-terminals",
  args: {
    ...storyBaseArgs.args,
    shipping: false,
    "submit-button-text": "Order Terminals",
    Theme: ThemeNames.Light,
  },
  argTypes: {
    ...storyBaseArgs.argTypes,
    shipping: {
      description: "Defines the `order_type`; can be set to `boarding_shipping` or `boarding_only`",
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
    "submit-button-text": {
      description: "Text for the submit button.",
      table: {
        category: "props",
        defaultValue: {
          summary: "Submit Order",
        }
      },
      control: {
        type: "text",

      },
    },
    Theme: {
      description:
        "Select a theme to preview the component in. [See example](https://storybook.justifi.ai/?path=/docs/introduction--docs#styling)",
      options: Object.values(ThemeNames),
      control: {
        type: "select",
      },
    },
    "error-event": {
      description: "`ComponentError`",
      table: {
        category: "events",
      },
      action: true,
    },
    "submit-event": {
      description: "`TerminalOrder`",
      table: {
        category: "events",
      },
      action: true,
    },
  },
  parameters: {
    actions: {
      handles: ["error-event"],
    },
    chromatic: {
      delay: 2000,
    },
  },
  decorators: [
    customStoryDecorator,
    // @ts-ignore
    withActions, // https://github.com/storybookjs/storybook/issues/22384
  ],
};

export const Example: Story = {};

export default meta;
