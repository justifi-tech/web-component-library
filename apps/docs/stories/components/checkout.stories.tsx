import type { Meta, StoryObj } from '@storybook/web-components';
import { withActions } from '@storybook/addon-actions/decorator';
import { StoryBaseArgs } from '../utils';
import theme from '../theme';

import '@justifi/webcomponents/dist/module/justifi-checkout';

const storyBaseArgs = new StoryBaseArgs(['auth-token', 'iframe-origin']);

const meta: Meta = {
  title: 'dev/Payment Facilitation/Payments/Checkout',
  component: 'justifi-checkout',
  args: {
    'auth-token': 'eyJraWQiOiJqdXN0aWZpLWUyNDgyMmU3ODE1MmEzZjRkMjU1IiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguanVzdGlmaS5haS8iLCJhenAiOiJ3Y3RfMlViTXd2cWxKTjlLYml2QlhQSzdnTCIsInN1YiI6IndjdF8yVWJNd3ZxbEpOOUtiaXZCWFBLN2dMQHNlc3Npb25zIiwiYXVkIjoiaHR0cHM6Ly9hcGkuanVzdGlmaS5haS92MSIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsInBlcm1pc3Npb25zIjpbIndyaXRlOmNoZWNrb3V0OmNob183UHRuMDFjNFlqUU9GQWNmNTJnM094Il0sImV4cCI6MTcxMzU1NDMwOCwiaWF0IjoxNzEzNTUwNzA4LCJwbGF0Zm9ybV9hY2NvdW50X2lkIjoiYWNjXzNyZU5iNGFOWXkyaVdEWlFWY3pteDQifQ.ZNemzLjaHmxwJ8-okzcZT-R8x3coxRAhuuhsVhfNz73dmA7Jp_gF3xNRrYm_6a5ylp5_UhqN8zXoaFMACCLJHSP1WXeBdMIu0UY0RttSLmyje8c5pFqCpaLlBUazbVP_rgdzA1G_ChqhEXt-J9h6XF1GqI4-WCtwfYUxnj1joKszphREo9fbK4imd8I4SZeF4635lenMStxCMd8MMY-fSpyj1Blg-NsR2kWp4bFiJYWRv3rXuRocPuAMoIMDxrQzo6VE-eC_xONsFd6oagXzOxRTKJ2V88NgsVAnMr-oXeg6XAYiUKMO36ce8B663fLuFWbvopTAPbV-163sc4uSZA',
    'checkout-id': 'cho_7Ptn01c4YjQOFAcf52g3Ox'
  },
  argTypes: {
    ...storyBaseArgs.argTypes,
    'checkout-id': {
      description: 'tbd',
      table: {
        category: 'props'
      }
    },
    'submitted': {
      description: 'tbd',
      table: {
        category: 'events'
      },
      action: true
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
    return `<justifi-checkout auth-token="${args['auth-token']}" checkout-id="${args['checkout-id']}"></justifi-checkout>`;
  }
}

export const Basic: StoryObj = {};
Basic.decorators = [
  (story: any) => {
    // Import the style here to not pollute other framework stories
    const styleElement = document.createElement('style');
    styleElement.textContent = theme;

    return `${styleElement.outerHTML}${story()}`;
  },
  withActions
];

export default meta;
