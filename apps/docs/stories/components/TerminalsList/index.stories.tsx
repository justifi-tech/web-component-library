import type { Meta } from "@storybook/web-components";
import { withActions } from "@storybook/addon-actions/decorator";
import { StoryBaseArgs, customStoryDecorator } from "../../utils";

import "@justifi/webcomponents/dist/module/justifi-terminals-list";
import { ThemeNames } from "../../themes";

const examplePayload = {
  "id": "trm_abc123",
  "account_id": "449e7a5c-69d3-4b8a-aaaf-5c9b713ebc65",
  "provider": "verifone",
  "status": "disconnected",
  "provider_id": "123-456-789",
  "nickname": "My Favorite Terminal",
  "verified_at": "2024-01-01T15:00:00Z",
  "created_at": "2021-01-01T12:00:00Z",
  "updated_at": "2021-01-01T12:00:00Z"
};

const storyBaseArgs = new StoryBaseArgs(["account-id", "auth-token", "theme"]);

const meta: Meta = {
  title: "Merchant Tools/Terminals List",
  component: "justifi-terminals-list",
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
    "row-clicked": {
      description: "`RowClicked`",
      table: {
        category: "events",
        defaultValue: {
          summary: "Emits chosen Terminal object on row click",
          detail: JSON.stringify(examplePayload)
        }
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
      handles: ["row-clicked", "error-event"],
    },
    chromatic: {
      delay: 2000,
    },
  },
  decorators: [
    customStoryDecorator,
    // @ts-ignore - Ignore Storybook bug (reference to bug issue)
    withActions, // https://github.com/storybookjs/storybook/issues/22384
  ]
};

export const Example = {};

export default meta;
