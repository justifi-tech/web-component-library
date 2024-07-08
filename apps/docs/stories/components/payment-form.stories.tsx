import type { Meta } from '@storybook/web-components';
import { withActions } from '@storybook/addon-actions/decorator';
import { CSSVarsExample, StoryBaseArgs, getAttributesString } from '../utils';

import '@justifi/webcomponents/dist/module/justifi-payment-form';

const storyBaseArgs = new StoryBaseArgs(['account-id', 'client-id', 'auth-token', 'custom-styled']);

const meta: Meta = {
  title: 'Payment Facilitation/Payments/Payment Form',
  component: 'justifi-payment-form',
  args: {
    ...storyBaseArgs.args,
    'email': 'test@test.com',
    'submit-button-text': 'Submit Payment',
  },
  argTypes: {
    ...storyBaseArgs.argTypes,
    'bank-account': {
      type: 'boolean',
      description: 'Boolean indicating if the Payment Form should render Bank Account inputs `boolean`',
      control: {
        type: 'boolean'
      },
      table: {
        category: 'props'
      }
    },
    'card': {
      type: 'boolean',
      description: 'Boolean indicating if the Payment Form should render Card inputs `boolean`',
      control: {
        type: 'boolean'
      },
      table: {
        category: 'props'
      }
    },
    'email': {
      type: 'string',
      description: 'Email `string`',
      control: {
        type: 'text'
      },
      table: {
        category: 'props'
      }
    },
    'submit-button-text': {
      type: 'string',
      control: {
        type: 'text'
      },
      table: {
        category: 'props'
      }
    },
    'submitted': {
      description: '`BankAccountCreateResponse` `CardCreateResponse` `PaymentMethodErrorResponse`',
      table: {
        category: 'events'
      },
    },
    'error-event': {
      description: '`ComponentError`',
      table: {
        category: 'events'
      },
      action: true
    },
    'enableSubmitButton': {
      description: '`enableSubmitButton() => Promise<void>`',
      table: {
        category: 'methods'
      }
    },
    'disableSubmitButton': {
      description: '`disableSubmitButton() => Promise<void>`',
      table: {
        category: 'methods'
      }
    },
    'fillBillingForm': {
      description: '`fillBillingForm(fields: BillingFormFields) => Promise<void>`',
      table: {
        category: 'methods'
      }
    },
    'loadFontsOnParent': {
      description: '`loadFontsOnParent() => Promise<any>`',
      table: {
        category: 'methods'
      }
    },
  },
  parameters: {
    actions: {
      handles: [
        'submitted',
        'error-event'
      ]
    },
    chromatic: {
      delay: 2000,
    },
  },
  decorators: [
    // @ts-ignore
    withActions
  ],
}

const Template = (args: any) => {
  // The <div> here should be replaced by a `display` property in the cardForm potentially
  return `
    <div>
      <justifi-payment-form
        ${getAttributesString(args)}
      />
    </div>
    <style>
      :root {
        ${args['custom-styled'] ? args['css-variables'] : ''}
      }
    </style>
    <script>
    (async () => {
      await customElements.whenDefined('justifi-payment-form');
      const paymentForm = document.querySelector('justifi-payment-form');
      paymentForm.addEventListener('submitted', async (event) => {
        // here is where you would submit a payment with the token
        console.log(event.detail);
        // after the payment succeeds or fails, the form submit button can be enabled again
        await paymentForm.enableSubmitButton();
      });
    })()
    </script>
  `;
};

Template.args = {
  ...storyBaseArgs.args,
  'card': true,
  'bank-account': true,
  'css-variables': CSSVarsExample
};

export const Basic = Template;

export default meta;
