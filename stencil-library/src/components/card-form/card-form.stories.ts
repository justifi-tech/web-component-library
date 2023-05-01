import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
interface CardFormStoryArgs {
  'iframe-origin': string,
  'single-line': boolean,
  'validation-mode': string,
  'css-variables': string
}

const isDev = process.env.NODE_ENV === 'development';

export default {
  title: 'Components/CardForm',
  component: 'justifi-card-form',
  argTypes: {
    'iframe-origin': {
      control: 'text',
      table: {
        disable: isDev ? false : true,
        category: 'props',
      }
    },
  },
  decorators: [
    (story) => `
      ${story()}
      <script>${addEvents()}</script>
    `,
  ],
};

const handleValidateClick = async (cardForm: HTMLJustifiCardFormElement) => {
  const valid = await cardForm.validate();
  console.log(valid);
}
const handleTokenizeClick = async (cardForm: HTMLJustifiCardFormElement, paymentMethodData) => {
  const tokenizeResponse = await cardForm.tokenize('CLIENT_ID', paymentMethodData);
  console.log(tokenizeResponse);
}
const handleReady = () => {
  console.log('card form is ready');
  const cardForm = document.querySelector('justifi-card-form') as HTMLJustifiCardFormElement;
  const validateBtn = document.querySelector('#validate-btn');
  const tokenizeBtn = document.querySelector('#tokenize-btn');
  validateBtn?.addEventListener('click', () => { handleValidateClick(cardForm) });
  tokenizeBtn?.addEventListener('click', () => { handleTokenizeClick(cardForm, {}) });
}

const addEvents = () => {
  addEventListener('cardFormReady', handleReady);
}

const FormButtons = `
  <style>
    .button-bar {
      display: flex;
      aligin-items: center;
      padding: 10px;
    }
    .button-bar button {
      margin-right: 10px;
      border-radius: 3px;
      border: 1px solid black;
    }
  </style>
  <div class="button-bar">
    <button id="validate-btn">Validate</button>
    <button id="tokenize-btn">Tokenize</button>
  </div>`

const Template = (args: CardFormStoryArgs) => {
  const includeButtons = true;

  return (`
    <div>
      <style>
      :root {
        ${args['css-variables'] || ''}
      }
      </style>
      <justifi-card-form
        data-testid="card-form-iframe"
        validation-mode='${args['validation-mode'] || 'onSubmit'}'
        iframe-origin='${args['iframe-origin'] || ''}'
        single-line='${args['single-line']}'
      />
    </div>
    ${includeButtons ? FormButtons : ''}
  `);
};

export const Basic = Template.bind({});
Basic.args = {
  'validation-mode': 'onSubmit',
  'single-line': false,
};

export const SingleLine = Template.bind({});
SingleLine.args = {
  iframeOrigin: '',
  singleLine: true,
  validationMode: 'onSubmit'
}

export const Embedded = Template.bind({});
Embedded.decorators = [
  (story) => `
    <style>
      #wrapper {
        background-color: #aaaaaa;
      }
    </style>
    <div id="wrapper" style="width: 50%;">
      ${story()}
    </div>
  `,
]

export const Styled = Template.bind({});
Styled.args = {
  cssVariables: (`
  --jfi-layout-padding: 0;
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
  `)
}

export const Completed = Template.bind({});
Completed.play = async ({ canvasElement, step }) => {
  // Need to wait for iFrame to load
  addEventListener('cardFormReady', async () => {
    const canvas = within(canvasElement);

    await step('CardForm is rendered', async () => {
      expect(canvas.getByTestId('card-form-iframe')).toBeDefined()
    });

    await step('Validate form when empty shows errors', async () => {
      userEvent.click(canvas.getByRole('button', { name: 'Validate' }));
    });

    // Expect errors to show up, but can't figure out how to get them

    await step('Call tokenize with empty form shows errors', async () => {
      userEvent.click(canvas.getByRole('button', { name: 'Tokenize' }));
    });

    // Expect errors to show up, but can't figure out how to get them

    // Fill form
  });
};

