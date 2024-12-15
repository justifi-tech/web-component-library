import type { Meta } from "@storybook/web-components";
import { withActions } from "@storybook/addon-actions/decorator";
import { StoryBaseArgs, customStoryDecorator } from "../../utils";

import "@justifi/webcomponents/dist/module/justifi-payments-list";
import { ThemeNames } from "../../themes";

const storyBaseArgs = new StoryBaseArgs(["account-id", "auth-token"]);

const meta: Meta = {
  title: "Merchant Tools/Payments List",
  component: "justifi-payments-list",
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
  },
  decorators: [
    customStoryDecorator,
    // @ts-ignore - Ignore Storybook bug (reference to bug issue)
    withActions, // https://github.com/storybookjs/storybook/issues/22384
  ],
};

export const Example = {};

export default meta;
