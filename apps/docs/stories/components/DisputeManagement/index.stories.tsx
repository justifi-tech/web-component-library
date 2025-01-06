import type { Meta, StoryObj } from "@storybook/web-components";
import { customStoryDecorator, StoryBaseArgs } from "../../utils";
import { ThemeNames } from "../../themes";

import "@justifi/webcomponents/dist/module/justifi-dispute-management";
import { withActions } from "@storybook/addon-actions/decorator";

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
    "submit-event": {
      description:
        "Emits the full server response upon form completion.  Will not be raised if form vailidation fails.",
      table: {
        category: "events",
      },
    },
    "complete-form-step-event": {
      description: "Emitted when a form step is completed after the user clicks 'Next'. Contains server response and name of completed form step.",
      table: {
        category: "events",
        defaultValue: {
          summary: "Example Payload",
          detail: `{ response: serverResponse, formStep: 'customer_details' }`
        },
      },
    },
    "click-event": {
      description:
        "Emitted when controls are clicked.  Control name is defined in `data.detail.name`.",
      table: {
        category: "events",
      },
    },
    "error-event": {
      description: "`ComponentError` - emitted when a network error occurs in the component.",
      table: {
        category: "events"
      }
    }
  },
  parameters: {
    actions: {
      handles: ["submit-event", "complete-form-step-event", "click-event", "error-event"],
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

export default meta;
