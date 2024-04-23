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
    'auth-token': 'eyJraWQiOiJqdXN0aWZpLWUyNDgyMmU3ODE1MmEzZjRkMjU1IiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguanVzdGlmaS5haS8iLCJhenAiOiJ3Y3RfNUYyclhKVGZaaGhXV1o5amF6ejVncCIsInN1YiI6IndjdF81RjJyWEpUZlpoaFdXWjlqYXp6NWdwQHNlc3Npb25zIiwiYXVkIjoiaHR0cHM6Ly9hcGkuanVzdGlmaS5haS92MSIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsInBlcm1pc3Npb25zIjpbIndyaXRlOmNoZWNrb3V0OmNob180OGNES1RoWjVXc2xJSmN0N0tFNTdPIl0sImV4cCI6MTcxMzgzNDEwMiwiaWF0IjoxNzEzODMwNTAyLCJwbGF0Zm9ybV9hY2NvdW50X2lkIjoiYWNjXzNyZU5iNGFOWXkyaVdEWlFWY3pteDQifQ.mUcsUGRMhwhdmwTq69Z4-Ulxt9HeTgNk9s4VlbE9J5fi8ePc5d-Nb1BQzirxcoIIuTg0vbu8s8zGfpEb9Eg-5BqLY6Fp5f-t649Eky-bjMFQz5h4uyO2M7laVaXKjm76qhrHR0ZHmebLjxNqaXBJv6zzbLyaCp-Mj-RYqe8X89l8HoGvE4BD7HaA8TB_KBnrYY1tVUj8CmXpE8r4NVcpQeFJ1Pi98sHTIsulqovKojZOY9cANHNZtjkU7bfp8IErKNbuHb7hxGAoYeJNwgB7C1QUOQs9U4MSeT8xYn6YTVkGueLtF1jAbJHv8ZrseMTLTRGrqbHytrfz9hE-LgtOVw',
    'checkout-id': 'cho_48cDKThZ5WslIJct7KE57O'
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
