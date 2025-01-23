import type { Meta, StoryObj } from '@storybook/web-components';
import { withActions } from '@storybook/addon-actions/decorator';
import { StoryBaseArgs, customStoryDecorator } from '../../utils';

import '@justifi/webcomponents/dist/module/justifi-season-interruption-insurance';
import { ThemeNames } from '../../themes';

type Story = StoryObj;

const storyBaseArgs = new StoryBaseArgs(['auth-token', 'checkout-id']);

const meta: Meta = {
  title: 'Insurance/Season Interruption Insurance',
  component: 'justifi-season-interruption-insurance',
  args: {
    ...storyBaseArgs.args,
    Theme: ThemeNames.Light,
    primaryIdentityFirstName: 'John',
    primaryIdentityLastName: 'Doe',
    primaryIdentityState: 'CA',
    primaryIdentityPostalCode: '94105',
    primaryIdentityCountry: 'US',
    primaryIdentityEmailAddress: 'john.doe@email.com',
    policyAttributesInsurableAmount: 1000,
    policyAttributesStartDate: '2022-01-01',
    policyAttributesEndDate: '2022-12-31',
    coveredIdentityFirstName: 'Jane',
    coveredIdentityLastName: 'Doe',
  },
  argTypes: {
    ...storyBaseArgs.argTypes,
    Theme: {
      description: 'Select a theme to preview the component in. [See example](https://storybook.justifi.ai/?path=/docs/introduction--docs#styling)',
      options: Object.values(ThemeNames),
      control: {
        type: 'select',
      },
    },
    primaryIdentityFirstName: {
      description: 'The first name of the primary identity',
      control: {
        type: 'text',
      },
      table: {
        category: 'props',
      }
    },
    primaryIdentityLastName: {
      description: 'The last name of the primary identity',
      control: {
        type: 'text',
      },
      table: {
        category: 'props',
      }
    },
    primaryIdentityState: {
      description: 'The state of the primary identity',
      control: {
        type: 'text',
      },
      table: {
        category: 'props',
      }
    },
    primaryIdentityPostalCode: {
      description: 'The postal code of the primary identity',
      control: {
        type: 'text',
      },
      table: {
        category: 'props',
      }
    },
    primaryIdentityCountry: {
      description: 'The country of the primary identity',
      control: {
        type: 'text',
      },
      table: {
        category: 'props',
      }
    },
    primaryIdentityEmailAddress: {
      description: 'The email address of the primary identity',
      control: {
        type: 'text',
      },
      table: {
        category: 'props',
      }
    },
    policyAttributesInsurableAmount: {
      description: 'The amount that is insurable',
      control: {
        type: 'number',
      },
      table: {
        category: 'props',
      }
    },
    policyAttributesStartDate: {
      description: 'The start date of the policy',
      control: {
        type: 'date',
      },
      table: {
        category: 'props',
      }
    },
    policyAttributesEndDate: {
      description: 'The end date of the policy',
      control: {
        type: 'date',
      },
      table: {
        category: 'props',
      }
    },
    coveredIdentityFirstName: {
      description: 'The first name of the covered identity',
      control: {
        type: 'text',
      },
      table: {
        category: 'props',
      }
    },
    coveredIdentityLastName: {
      description: 'The last name of the covered identity',
      control: {
        type: 'text',
      },
      table: {
        category: 'props',
      }
    },
    'error-event': {
      description: '`ComponentError`',
      table: {
        category: 'events',
      },
      action: true,
    },
  },
  parameters: {
    actions: {
      handles: ['error-event'],
    },
    chromatic: {
      delay: 2000,
    },
  },
  decorators: [
    customStoryDecorator,
    // @ts-ignore - Ignore Storybook bug (reference to bug issue)
    withActions // https://github.com/storybookjs/storybook/issues/22384
  ],
};

export const Basic: Story = {};

export default meta;
