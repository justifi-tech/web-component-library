import type { Meta, StoryObj } from '@storybook/web-components';
import { withActions } from '@storybook/addon-actions/decorator';
import { StoryBaseArgs, customStoryDecorator } from '../utils';

import '@justifi/webcomponents/dist/module/justifi-checkout';

const storyBaseArgs = new StoryBaseArgs(['auth-token', 'iframe-origin']);

const meta: Meta = {
  title: 'dev/Payment Facilitation/Payments/Checkout',
  component: 'justifi-checkout',
  args: {
    'auth-token': 'eyJraWQiOiJqdXN0aWZpLWUyNDgyMmU3ODE1MmEzZjRkMjU1IiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguanVzdGlmaS5haS8iLCJhenAiOiJ3Y3RfMjJnZEllUkV6MEMyQjBtdkhXQTcyVSIsInN1YiI6IndjdF8yMmdkSWVSRXowQzJCMG12SFdBNzJVQHNlc3Npb25zIiwiYXVkIjoiaHR0cHM6Ly9hcGkuanVzdGlmaS5haS92MSIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsInBlcm1pc3Npb25zIjpbIndyaXRlOmNoZWNrb3V0OmNob182MDRtbWZhVnVmZzBXblRBQjRoM2oiXSwiZXhwIjoxNzEyODY5NTA5LCJpYXQiOjE3MTI4NjU5MDksInBsYXRmb3JtX2FjY291bnRfaWQiOiJhY2NfM3JlTmI0YU5ZeTJpV0RaUVZjem14NCJ9.iqd3Ugb2JIY00h4mOyyPcrTm9Zo0XiEOFKyf_AiBcZKi9Ht9H-HIkSVQO5kK93Xk0FFUgszG18og8rg2OS8bke0zaylfj151fkiycTEx_rE95wGMeXpG_itkohxX-OiFEds_SPSk9FsvlAVGt34NzD9b078Kv4qiXre6qtFszm0wn_6elLbTOC2rNVYzFlQsG9gU7bGgrr6w0GHDPTfRpoSLCPwZhJ53wRaip13nMMq9Od2XDDVMZBgouNuYW5JNvjE1SNd1-lDSgOWchuRvAoDWEmoonu4n5tEH2jmZmQ41mi2W-1IuvGt94qippi3G-u8MZxNlbbaFgDzPJvLFiA',
    'checkout-id': 'cho_604mmfaVufg0WnTAB4h3j'
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
