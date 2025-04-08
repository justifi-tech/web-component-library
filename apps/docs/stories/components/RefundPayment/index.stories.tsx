import type { Meta } from "@storybook/web-components";
import { withActions } from "@storybook/addon-actions/decorator";
import { StoryBaseArgs, customStoryDecorator } from "../../utils";

import "@justifi/webcomponents/dist/module/justifi-refund-payment";
import { ThemeNames } from "../../themes";

const storyBaseArgs = new StoryBaseArgs([
  "payment-id",
  "account-id",
  "auth-token",
]);

const meta: Meta = {
  title: "Payment Facilitation/Refund Payment",
  component: "justifi-refund-payment",
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
    "hide-submit-button": {
      type: "boolean",
      description:
        "Boolean indicating if the internal submit button should be hidden. Can be used in combination with an external button and calling the `refundPayment` method directly",
      control: {
        type: "boolean",
      },
      table: {
        category: "props",
        defaultValue: { summary: "false" },
      },
    },
    "submit-event": {
      description: "Emitted upon successful refund of a payment",
      table: {
        category: "events",
        defaultValue: {
          summary: "Returns the full response of the submitted refund request as `event.detail.response`",
        },
      },
      action: true
    },
    "error-event": {
      description: "Emitted upon an error during component intitializtion, or refund of a payment",
      table: {
        category: "events",
        defaultValue: { summary: "Returns full error as `event.detail` and error message as `event.detail.message`" },
      },
      action: true,
    },
    refundPayment: {
      description: "Can be used to call the refundPayment method programmatically with an external button. Ideally used in conjunction with the `hide-submit-button` prop.",
      table: {
        category: "methods",
        defaultValue: { 
          summary: "`refundPayment() => Promise<RefundPaymentResponse>`",
          detail: "RefundPaymentResponse: { amount: number, created_at: string, updated_at: string, description: string | null, reason: string | null, metadata: any, id: string, payment_id: string, status: Enum: 'pending' 'succeeded' 'failed'}"
         }
      },
    },
  },
  parameters: {
    actions: {
      handles: ["submit-event", "error-event"],
    },
    chromatic: {
      delay: 2000,
    },
  },
  decorators: [
    customStoryDecorator,
    withActions
  ],
};

const Template = {};

export const Example = Template;

export default meta;
