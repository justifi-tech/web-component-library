import type { Meta, StoryObj } from "@storybook/web-components";
import { withActions } from "@storybook/addon-actions/decorator";
import { customStoryDecorator, StoryBaseArgs } from "../../utils";

import "@justifi/webcomponents/dist/module/justifi-business-details";
import { ThemeNames } from "../../themes";

type Story = StoryObj;

const storyBaseArgs = new StoryBaseArgs(["business-id", "auth-token"]);

const meta: Meta = {
  title: "Entities/BusinessDetails",
  component: "justifi-business-details",
  args: {
    ...storyBaseArgs.args,
    Theme: ThemeNames.None,
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
