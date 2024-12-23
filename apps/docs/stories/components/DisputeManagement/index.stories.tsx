import type { Meta, StoryObj } from "@storybook/web-components";
import { customStoryDecorator, StoryBaseArgs } from "../../utils";
import { ThemeNames } from "../../themes";

import "@justifi/webcomponents/dist/module/justifi-dispute-management";

type Story = StoryObj;

const storyBaseArgs = new StoryBaseArgs(["auth-token"]);

const meta: Meta = {
  title: "Payment Facilitation/Dispute Management",
  component: "justifi-dispute-management",
  args: {
    ...storyBaseArgs.args,
    "dispute-id": "123",
    Theme: ThemeNames.Light,
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
    "dispute-id": {
      description: "Dispute ID `string`",
      table: {
        category: "props",
      },
    },
    "error-event": {
      description: "`ComponentError`",
      table: {
        category: "events",
      },
    }
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
    customStoryDecorator
  ]
};

export const Example: Story = {};

export default meta;
