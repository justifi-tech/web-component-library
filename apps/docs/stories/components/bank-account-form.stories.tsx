import type { Meta, StoryObj } from '@storybook/web-components';
import '@justifi/webcomponents/dist/module/justifi-bank-account-form';
import { withActions } from '@storybook/addon-actions/decorator';
import { userEvent, within } from '@storybook/testing-library';
import { action } from '@storybook/addon-actions';
import { screen } from '@storybook/testing-library';
import { customStoryDecorator } from '../utils';
import { JustifiBankAccountForm } from '@justifi/webcomponents/dist/module/justifi-bank-account-form';

type Story = StoryObj;

const CSSVars = `
--jfi-load-google-font: 'Roboto Mono:wght@200;400;700;900&family=Agdasima';
--jfi-layout-font-family: Roboto Mono;
--jfi-layout-padding: 4px;
--jfi-layout-form-control-spacing-x: .5rem;
--jfi-layout-form-control-spacing-y: 1rem;
--jfi-form-label-font-weight: 700;
--jfi-form-label-font-family: sans-serif;
--jfi-form-label-margin: 0 0 .5rem 0;
--jfi-form-control-background-color: #F4F4F6;
--jfi-form-control-background-color-hover: #EEEEF5;
--jfi-form-control-border-color: rgba(0, 0, 0, 0.42);
--jfi-form-control-border-color-hover: rgba(0, 0, 0, 0.62);
--jfi-form-control-border-color-focus: #fccc32;
--jfi-form-control-border-color-error: #C12727;
--jfi-form-control-border-top-width: 0;
--jfi-form-control-border-left-width: 0;
--jfi-form-control-border-bottom-width: 1px;
--jfi-form-control-border-right-width: 0;
--jfi-form-control-border-radius: 4px 4px 0 0;
--jfi-form-control-border-style: solid;
--jfi-form-control-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
--jfi-form-control-box-shadow-focus: none;
--jfi-form-control-box-shadow-error-focus: none;
--jfi-form-control-border-style: solid;
--jfi-form-control-color: #212529;
--jfi-form-control-font-size: 1rem;
--jfi-form-control-font-weight: 400;
--jfi-form-control-line-height: 2;
--jfi-form-control-margin: 0;
--jfi-form-control-padding: .5rem .875rem;
--jfi-error-message-color: #C12727;
--jfi-error-message-margin: .25rem 0 0 0;
--jfi-error-message-font-size: .875rem;
`;

const meta: Meta = {
  title: 'Components/BankAccountForm',
  component: 'justifi-bank-account-form',
  args: {
    'data-testid': 'test-bank-form',
  },
  argTypes: {
    'test-id': {
      table: {
        disable: true
      },
    },
    'css-variables': {
      control: 'text',
      table: {
        category: 'props',
        defaultValue: CSSVars,
      },
    },
    'iframe-origin': {
      type: 'string',
      description: 'URL for the rendered iFrame. End-users need not use this.',
      control: {
        type: 'text',
      },
      table: {
        category: 'props'
      }
    },
    'validation-mode': {
      options: ['all', 'onBlur', 'onChange', 'onSubmit', 'onTouched'],
      control: { type: 'select'},
      description: 'When to trigger validation of the form.',
      table: {
        category: 'props'
      }
    },
    'bankAccountFormTokenize': {
      description: 'Triggered when the tokenize method is called on the component',
      table: {
        category: 'events'
      },
    },
    'bankAccountFormValidate': {
      description: 'Triggered when the validate method is called on the component',
      table: {
        category: 'events'
      },
      action: true
    },
    'ready': {
      description: 'Triggered when iframe has loaded',
      table: {
        category: 'events'
      }
    },
    'resize': {
      description: 'Deprecated: This method will be removed in future releases.',
      table: {
        category: 'methods',
      }
    },
    'tokenize': {
      description: 'Makes a tokenization request to the iframe',
      table: {
        category: 'methods'
      }
    },
    'validate': {
      description: 'Runs a validation on the form and shows errors if any',
      table: {
        category: 'methods'
      }
    }
  },
  parameters: {
    actions: {
      handles: [
        'bankAccountFormTokenize',
        'bankAccountFormValidate',
        'bankAccountFormReady'
      ]
    }
  },
  decorators: [
    customStoryDecorator,
    withActions
  ],
};

export const Basic: Story = {};

export const Tokenize: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const bankForm = canvas.getByTestId('test-bank-form') as JustifiBankAccountForm;
    bankForm.addEventListener('bankAccountFormReady', async () => {
      screen.debug();
      const routingNumber = canvas.getByLabelText('routing_number');
      await userEvent.type(routingNumber, 'bla bla')
    })

    
  }
}

export default meta;