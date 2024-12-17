import type { Meta, StoryObj } from "@storybook/web-components";
import { customStoryDecorator, StoryBaseArgs } from "../../utils";
import { ThemeNames } from "../../themes";

import "@justifi/webcomponents/dist/module/justifi-terminals-list";
import "@justifi/webcomponents/dist/module/justifi-terminals-list-filters";

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

type Story = StoryObj;

const storyBaseArgs = new StoryBaseArgs(["account-id", "auth-token"]);

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
        "Select a theme to preview the component in. [See example](https://storybook.justifi.ai/?path=/docs/introduction--docs#styling-components-with-variables)",
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
  ]
};

export const Example: Story = {};

export const ExampleWithFilters: Story = {
  args: {},
  render: (args) => `
    <div>
      <justifi-terminals-list-filters></justifi-terminals-list-filters>
      <justifi-terminals-list
        auth-token="${args["auth-token"]}"
        account-id="${args["account-id"]}">
      </justifi-terminals-list>
    </div>
  `
};

export default meta;
