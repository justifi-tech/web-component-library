import type { Meta, StoryObj } from '@storybook/web-components';
import { withActions } from '@storybook/addon-actions/decorator';
import { StoryBaseArgs } from '../utils';
import themes, { ThemeNames } from '../themes';
import { setUpMocks } from '../utils/mockAllServices';

import '@justifi/webcomponents/dist/module/justifi-checkout';
import '@justifi/webcomponents/dist/module/justifi-season-interruption-insurance';

const storyBaseArgs = new StoryBaseArgs(['auth-token']);

const meta: Meta = {
  title: 'Payment Facilitation/Payments/Checkout',
  component: 'justifi-checkout',
  args: {
    ...storyBaseArgs.args,
    'checkout-id': '123',
    'Theme': ThemeNames.Light
  },
  argTypes: {
    ...storyBaseArgs.argTypes,
    'Theme': {
      description: 'Select a theme to preview the component in',
      options: Object.values(ThemeNames),
      control: {
        type: 'select',
      }
    },
    'checkout-id': {
      description: 'Checkout ID `string`',
      table: {
        category: 'props'
      }
    },
    'disable-credit-card': {
      type: 'boolean',
      control: {
        type: 'boolean',
      },
      description: 'Disable new credit card payment method option',
      table: {
        category: 'props',
        defaultValue: { summary: 'undefined' }
      }
    },
    'disable-bank-account': {
      type: 'boolean',
      control: {
        type: 'boolean',
      },
      description: 'Disable new bank account payment method option',
      table: {
        category: 'props',
        defaultValue: { summary: 'undefined' }
      }
    },
    'disable-bnpl': {
      type: 'boolean',
      control: {
        type: 'boolean',
      },
      description: 'Disable BNPL payment method option',
      table: {
        category: 'props',
        defaultValue: { summary: 'undefined' }
      }
    },
    'disable-payment-method-group': {
      type: 'boolean',
      control: {
        type: 'boolean',
      },
      description: 'Disable saved payment methods option',
      table: {
        category: 'props',
        defaultValue: { summary: 'undefined' }
      }
    },
    'submitted': {
      description: 'Emitted when the server response is received after submitting.  Will not be raised if form vailidation fails.',
      table: {
        category: 'events'
      },
      action: true
    },
    'error-event': {
      description: '`ComponentError`',
      table: {
        category: 'events',
      },
      action: true,
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
        'submitted'
      ]
    },
    chromatic: {
      delay: 1000
    },
  },
  render: ({ label, ...args }) => {
    let component = `<justifi-checkout 
    auth-token="${args['auth-token']}" 
    checkout-id="${args['checkout-id']}"`;

    if (args['disable-credit-card']) {
      component += ` disable-credit-card`;
    }

    if (args['disable-bank-account']) {
      component += ` disable-bank-account`;
    }

    if (args['disable-bnpl']) {
      component += ` disable-bnpl`;
    }

    if (args['disable-payment-method-group']) {
      component += ` disable-payment-method-group`;
    }

    component += `>`;

    if (args.withInsurance) {
      console.log('inserting insurance slot')

      component += `
        <div slot="insurance">
          <justifi-season-interruption-insurance
            checkout-id="${args['checkout-id']}"
            auth-token="${args['auth-token']}"
          />
        </div>
      `;
    }

    component += `</justifi-checkout>`;
    return component;
  }
}

export const Basic: StoryObj = {};
Basic.decorators = [
  (story: any, storyArgs: any) => {
    setUpMocks();

    // Import the style here to not pollute other framework stories
    const selectedTheme = storyArgs.args['Theme'] as ThemeNames;
    const styleElement = document.createElement('style');
    styleElement.textContent = themes[selectedTheme];

    return `${styleElement.outerHTML}${story()}`;
  },
  // @ts-ignore
  withActions
];

export const CheckoutInsurance: StoryObj = { args: { withInsurance: true } };
CheckoutInsurance.decorators = [
  (story: any, storyArgs: any) => {
    setUpMocks();

    // Import the style here to not pollute other framework stories
    const selectedTheme = storyArgs.args['Theme'] as ThemeNames;
    const styleElement = document.createElement('style');
    styleElement.textContent = themes[selectedTheme];

    return `${styleElement.outerHTML}${story()}`;
  },
  // @ts-ignore
  withActions
];


export default meta;
