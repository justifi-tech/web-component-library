import type { Meta, StoryObj } from '@storybook/web-components';
import { withActions } from '@storybook/addon-actions/decorator';
import { StoryBaseArgs, customStoryDecorator } from '../utils';

import '@justifi/webcomponents/dist/module/justifi-checkout';

const storyBaseArgs = new StoryBaseArgs(['auth-token', 'iframe-origin']);

const meta: Meta = {
  title: 'Payment Facilitation/Payments/Checkout',
  component: 'justifi-checkout',
  args: {
    'auth-token': 'eyJraWQiOiJqdXN0aWZpLWUyNDgyMmU3ODE1MmEzZjRkMjU1IiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguanVzdGlmaS5haS8iLCJhenAiOiJ3Y3RfMWFLV1JBSWxuTTJpYUU5Vnc4bzhQQSIsInN1YiI6IndjdF8xYUtXUkFJbG5NMmlhRTlWdzhvOFBBQHNlc3Npb25zIiwiYXVkIjoiaHR0cHM6Ly9hcGkuanVzdGlmaS5haS92MSIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsInBlcm1pc3Npb25zIjpbIndyaXRlOmNoZWNrb3V0OmNob183OEJRMko4dWN4ZDJydU80aFZSWUtIIl0sImV4cCI6MTcxMTM5OTE4NiwiaWF0IjoxNzExMzk1NTg2LCJwbGF0Zm9ybV9hY2NvdW50X2lkIjoiYWNjXzNyZU5iNGFOWXkyaVdEWlFWY3pteDQifQ.cGzwKW7qHic-fxZWm5g1gJoGf6htjwiJ-qBskvCZLNMkfq0mkF7swAjG0I4GEZLuU27RdMMMg29TxZYhxXYrQvgNGapU74af-ppdRcosJ7dQsZGd4412MBFm6gbUHpnKYXmsQhLQYV3yS-ADzeVsUF0mODWyQXcHu_xaXiZcpI72Qwf6_Wj2Uj1qFLr0TrGSaJfIlBx16r-Aduu_H1k3SYecM6neL0HZ7nt-bCVz9z1onCoEhQfvVdOpwaBK_sh1pGUMXRqHrzPVQSF78dl9VlQgruMLzCt6JGtKhOzqFpdirhfH8gbriqKekdBuSG0z0y7U9qatwA6sI4Ehj5zCeQ',
    'checkout-id': 'cho_78BQ2J8ucxd2ruO4hVRYKH'
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
