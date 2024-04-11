import type { Meta, StoryObj } from '@storybook/web-components';
import { withActions } from '@storybook/addon-actions/decorator';
import { StoryBaseArgs, customStoryDecorator } from '../utils';

import '@justifi/webcomponents/dist/module/justifi-checkout';

const storyBaseArgs = new StoryBaseArgs(['auth-token', 'iframe-origin']);

const meta: Meta = {
  title: 'dev/Payment Facilitation/Payments/Checkout',
  component: 'justifi-checkout',
  args: {
    'auth-token': 'eyJraWQiOiJqdXN0aWZpLWUyNDgyMmU3ODE1MmEzZjRkMjU1IiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguanVzdGlmaS5haS8iLCJhenAiOiJ3Y3RfN2E3eVVOWkhUdUVzeGpObmhMUXhBRyIsInN1YiI6IndjdF83YTd5VU5aSFR1RXN4ak5uaExReEFHQHNlc3Npb25zIiwiYXVkIjoiaHR0cHM6Ly9hcGkuanVzdGlmaS5haS92MSIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsInBlcm1pc3Npb25zIjpbIndyaXRlOmNoZWNrb3V0OmNob183ZDNGbTZwVVVjS08xVVZQZElUVVk0Il0sImV4cCI6MTcxMjg2NTg0NywiaWF0IjoxNzEyODYyMjQ3LCJwbGF0Zm9ybV9hY2NvdW50X2lkIjoiYWNjXzNyZU5iNGFOWXkyaVdEWlFWY3pteDQifQ.fu8RVFVjt7_QIdUo8AFfo36DL9cWN-dgUvL5XcnvRRaMk9xdCAomVTl92EMcb0mZZuMd6ctP_ApubbsS6kq_J_vzJMkJCgyc9Xv7pPNSk_d9vsiMrZvDpMOxN8R9rwlpj7zKb_U_PllK3dQeSp_t5CEGibqOMlvkjfBVHBIOc3qgs6yCJipv7abkYzCTK32Aa1ee4pE44xYTILYoL467wibQlNEp7O1VZJrnLELSe_u5b0J3-oMV8i54syM5R9uNBfR6zABZf_uRnpFIX8m-ewX0217aBVycftqHAVgycL08TEiM-fEo-Pdqxd-2d57H6cDqfQiX6DFk-4auzQc2hw',
    'checkout-id': 'cho_7d3Fm6pUUcKO1UVPdITUY4'
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
  decorators: [customStoryDecorator, withActions],
}

export const Basic: StoryObj = {};

export default meta;
