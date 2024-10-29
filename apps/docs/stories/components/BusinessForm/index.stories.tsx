import type { Meta, StoryObj } from "@storybook/web-components";
import { withActions } from "@storybook/addon-actions/decorator";
import { StoryBaseArgs, customStoryDecorator } from "../../utils";

import "@justifi/webcomponents/dist/module/justifi-business-form";
import { ThemeNames } from "../../themes";

type Story = StoryObj;

const storyBaseArgs = new StoryBaseArgs(["auth-token", "business-id"]);

const meta: Meta = {
  title: "Entities/BusinessForm",
  component: "justifi-business-form",
  args: {
    ...storyBaseArgs.args,
    "test-mode": true,
    Theme: ThemeNames.Light,
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
    "form-title": {
      type: "string",
      description:
        "This prop updates the value of the title displayed at the top of the form.",
      control: {
        type: "text",
      },
      table: {
        category: "props",
        defaultValue: { summary: "Business Information" },
      },
    },
    "remove-title": {
      type: "boolean",
      description:
        "This prop removes the title displayed at the top of the form.",
      control: {
        type: "boolean",
      },
      table: {
        category: "props",
        defaultValue: { summary: "false" },
      },
    },
    "hide-errors": {
      type: "boolean",
      description:
        "When set to `true`, this prop will hide all error alerts from the form, allowing developers more control over how they wish to handle errors.",
      control: {
        type: "boolean",
      },
      table: {
        category: "props",
        defaultValue: { summary: "false" },
      },
    },
    submitted: {
      description:
        "Emitted when the server response is received.  Will not be raised if form vailidation fails.",
      table: {
        category: "events",
      },
    },
    "click-event": {
      description:
        "Emitted when controls are clicked.  Control name is defined in `data.detail.name`.",
      table: {
        category: "events",
      },
    },
    clickEvent: {
      description:
        "Emitted when controls are clicked.  Control name is defined in `data.detail.name`. This event will be deprecated in favor of the `click-event` event.",
      table: {
        category: "events",
      },
    },
  },
  parameters: {
    actions: {
      handles: ["submitted", "click-event", "clickEvent"],
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
