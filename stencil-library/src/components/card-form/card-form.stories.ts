import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

interface CardFormStoryArgs {
  iframeOrigin: string,
  singleLine: boolean,
  styleOverrides: object,
  validationMode: string
}

export default {
  title: 'Components/CardForm',
  component: 'justifi-payment-method-form',
  argTypes: {
    iframeOrigin: {
      control: 'text',
      table: {
        category: 'Props'
      }
    },
    singleLine: {
      control: 'boolean',
      table: {
        category: 'Props'
      }
    },
    styleOverrides: {
      control: 'object',
      table: {
        category: 'Props'
      }
    },
    validationMode: {
      control: { type: 'select'},
      options: ['onSubmit', 'onBlur', 'onChange', 'onTouched', 'all'],
      table: {
        category: 'Props'
      }
    }
  },
  parameters: {
    actions: {
      handles: [
        'cardFormReady',
        'cardFormValidate',
        'cardFormTokenize'
      ],
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
    }
  </style>
  <div class="button-bar">
    <button id="validate-btn">Validate</button>
    <button id="tokenize-btn">Tokenize</button>
  </div>
`

const storyStyleOverrides = {
  "layout": {
    "padding": "100px",
    "formControlSpacingHorizontal": ".5rem",
    "formControlSpacingVertical": "1rem"
  },
  "formLabel": {
    "fontWeight": "700",
    "fontFamily": "sans-serif",
    "margin": "0 0 .5rem 0"
  },
  "formControl": {
    "backgroundColor": "#00F4F6",
    "backgroundColorHover": "#EEEEF5",
    "borderColor": "rgba(0, 0, 0, 0.42)",
    "borderColorHover": "rgba(0, 0, 0, 0.62)",
    "borderColorFocus": "#fccc32",
    "borderColorError": "#C12727",
    "borderWidth": "0px",
    "borderBottomWidth": "1px",
    "borderRadius": "40px 4px 0 0",
    "borderStyle": "solid",
    "boxShadowErrorFocus": "none",
    "boxShadowFocus": "none",
    "color": "#212529",
    "fontSize": "1rem",
    "fontWeight": "400",
    "lineHeight": "2",
    "margin": "0",
    "padding": ".5rem .875rem"
  },
  "errorMessage": {
    "color": "#C12727",
    "margin": ".25rem 0 0 0",
    "fontSize": ".875rem"
  }
};

const Template = (args: CardFormStoryArgs) => {
  const parsedStyleOverrides = args.styleOverrides ? JSON.stringify(args.styleOverrides) : null;
  const includeButtons = true;

  return (`
    <div>
      <justifi-card-form 
        data-testid="card-form-iframe" 
        validation-mode='${args.validationMode || 'onSubmit'}'
        style-overrides='${parsedStyleOverrides || ''}' 
        iframe-origin='${args.iframeOrigin}'
        single-line='${args.singleLine}'
      />
    </div>
    ${includeButtons ? FormButtons : ''}
  `);
};

export const Basic = Template.bind({});
Basic.args = {
  iframeOrigin: '',
  singleLine: false,
  validationMode: 'onSubmit'
}

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
  styleOverrides: storyStyleOverrides,
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

