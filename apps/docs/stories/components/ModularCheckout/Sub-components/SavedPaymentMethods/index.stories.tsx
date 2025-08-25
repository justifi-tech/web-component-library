import type { Meta, StoryObj } from "@storybook/web-components";
import { withActions } from "@storybook/addon-actions/decorator";
import { customStoryDecorator } from "../../../../utils";

import "@justifi/webcomponents/dist/module/justifi-saved-payment-methods";
import { ThemeNames } from "../../../../themes";

type Story = StoryObj;

const meta: Meta = {
  title: "Modular Checkout/Sub-components/Saved Payment Methods",
  component: "justifi-saved-payment-methods",
  args: {
    Theme: ThemeNames.Light,
  },
  argTypes: {
    Theme: {
      description:
        "Select a theme to preview the component in. [See example](https://storybook.justifi.ai/?path=/docs/introduction--docs#styling)",
      options: Object.values(ThemeNames),
      control: {
        type: "select",
      },
    },
  },
  parameters: {
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
