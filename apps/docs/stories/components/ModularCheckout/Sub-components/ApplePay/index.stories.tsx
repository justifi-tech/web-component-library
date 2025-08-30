import { Meta, StoryObj } from "@storybook/web-components";
import { customStoryDecorator, StoryBaseArgs } from "../../../../utils";
import { withActions } from "@storybook/addon-actions/decorator";

import "@justifi/webcomponents/dist/module/justifi-modular-checkout";
import "@justifi/webcomponents/dist/module/justifi-apple-pay";

type Story = StoryObj;

const storyBaseArgs = new StoryBaseArgs(["auth-token", "checkout-id"]);

const meta: Meta = {
  title: "Modular Checkout/Sub-components/Apple Pay",
  component: "justifi-apple-pay",
  args: {
    ...storyBaseArgs.args,
    "slot": () => `<justifi-apple-pay />`
  },
  argTypes: {
    ...storyBaseArgs.argTypes,
    countryCode: { table: { category: "props", defaultValue: { summary: "US" } } },
    merchantIdentifier: { table: { category: "props" } },
    merchantDisplayName: { table: { category: "props" } },
    initiativeContext: { table: { category: "props" } },
    buttonType: { table: { category: "props" } },
    buttonStyle: { table: { category: "props" } },
    disabled: { table: { category: "props" } },
    showSkeleton: { table: { category: "props", defaultValue: { summary: "true" } } },

    applePayStarted: { table: { category: "events" } },
    applePayCompleted: { table: { category: "events" } },
    applePayCancelled: { table: { category: "events" } },
    applePayError: { table: { category: "events" } },
  },
  parameters: {
    actions: {
      handles: [
        "applePayStarted",
        "applePayCompleted",
        "applePayCancelled",
        "applePayError",
      ]
    }
  },
  decorators: [
    customStoryDecorator,
    withActions,
  ]
};

export const Example: Story = {};

export default meta;

