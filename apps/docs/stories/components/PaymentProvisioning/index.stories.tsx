import type { Meta, StoryObj } from "@storybook/web-components";
import { withActions } from "@storybook/addon-actions/decorator";
import { StoryBaseArgs, customStoryDecorator } from "../../utils";
import { ThemeNames } from "../../themes";

import "@justifi/webcomponents/dist/module/justifi-payment-provisioning";

type Story = StoryObj;

const storyBaseArgs = new StoryBaseArgs(["auth-token", "business-id"]);

const meta: Meta = {
  title: "Entities/Payment Provisioning",
  component: "justifi-payment-provisioning",
  args: {
    ...storyBaseArgs.args,
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
    "form-title": {
      type: "string",
      description:
        'This prop updates the value of the title displayed at the top of the form. Pass an empty string to remove the title.',
      control: {
        type: "text",
      },
      table: {
        category: "props",
        defaultValue: { summary: "Business Information" },
      },
    },
    "allow-optional-fields": {
      type: "boolean",
      description:
        "When set to `true`, this prop allows most fields in each form step to be nullable, allowing for quicker form completion. Note - the following fields are still required: `business.legal_name`, `representative.name`, `owner.name`.",
      control: {
        type: "boolean",
      },
      table: {
        category: "props",
        defaultValue: { summary: "false" },
      },
    },
    "submit-event": {
      description:
        "Emitted when the server response is received, and contains server response.  Will not be raised if form vailidation fails.",
      table: {
        category: "events",
      },
    },
    "form-step-completed": {
      description: "Emitted when a form step is completed after the user clicks 'Next'. Contains data from that form step's server response. The name of the completed form step is defined in `data.detail.formStep`.",
      table: {
        category: 'events',
        defaultValue: {
          summary: "Example Payload",
          detail: `{ data: serverResponse, formStep: 'legal_address' }`
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
    'error-event': {
      description: '`ComponentError` - emitted when a network error occurs in the component.',
      table: {
        category: 'events'
      }
    }
  },
  parameters: {
    actions: {
      handles: ["submit-event", "form-step-completed", "click-event", "error-event"],
    },
    chromatic: {
      delay: 2000,
    },
  },
  decorators: [
    customStoryDecorator,
    withActions, // https://github.com/storybookjs/storybook/issues/22384
  ],
};

export const Example: Story = {};

export default meta;
