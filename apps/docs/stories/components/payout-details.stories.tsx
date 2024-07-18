import type { Meta, StoryObj } from "@storybook/web-components";
import { withActions } from "@storybook/addon-actions/decorator";
import { StoryBaseArgs, customStoryDecorator } from "../utils";

import "@justifi/webcomponents/dist/module/justifi-payout-details";

type Story = StoryObj;

const storyBaseArgs = new StoryBaseArgs(["payout-id", "auth-token"]);

const meta: Meta = {
  title: "Payment Facilitation/Merchant Tools/Payout Details",
  component: "justifi-payout-details",
  args: {
    ...storyBaseArgs.args,
  },
  argTypes: {
    ...storyBaseArgs.argTypes,
    "error-event": {
      description: "`ComponentError`",
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
