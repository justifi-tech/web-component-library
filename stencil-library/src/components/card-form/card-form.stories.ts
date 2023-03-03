export default {
  title: 'Components/CardForm',
  component: 'justifi-card-form',
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

const paymentMethodData = {
  name: 'John Doe',
};

// IMPORTANT:
// Only use named functions when binding to event handlers. Otherwise, they will be bound multiple times
const handleValidateClick = () => {
  const cardForm = document.querySelector('justifi-card-form') as HTMLJustifiCardFormElement;
  cardForm.validate();
  console.log('validate');
}
const handleTokenizeClick = async () => {
  const cardForm = document.querySelector('justifi-card-form') as HTMLJustifiCardFormElement;
  const tokenizeResponse = await cardForm.tokenize('CLIENT_ID', paymentMethodData);
  console.log(tokenizeResponse);
}
const handleReadyClick = () => {
  const validateBtn = document.querySelector('#validate-btn');
  const tokenizeBtn = document.querySelector('#tokenize-btn');
  validateBtn?.addEventListener('click', handleValidateClick);
  tokenizeBtn?.addEventListener('click', handleTokenizeClick);
}
const addEvents = () => {
  addEventListener('cardFormReady', handleReadyClick);
}

const buttons = `
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
  "layout":{
    "padding":"0",
    "formControlSpacingHorizontal":".5rem",
    "formControlSpacingVertical":"1rem"
  },
  "formLabel":{
    "fontWeight":"700",
    "fontFamily":"sans-serif",
    "margin":"0 0 .5rem 0"
  },
  "formControl":{
    "backgroundColor":"#F4F4F6",
    "backgroundColorHover":"#EEEEF5",
    "borderColor":"rgba(0, 0, 0, 0.42)",
    "borderColorHover":"rgba(0, 0, 0, 0.62)",
    "borderColorFocus":"#fccc32",
    "borderColorError":"#C12727",
    "borderWidth":"0px",
    "borderBottomWidth":"1px",
    "borderRadius":"4px 4px 0 0",
    "borderStyle":"solid",
    "boxShadowErrorFocus":"none",
    "boxShadowFocus":"none",
    "color":"#212529",
    "fontSize":"1rem",
    "fontWeight":"400",
    "lineHeight":"2",
    "margin":"0",
    "padding":".5rem .875rem"
  },
  "errorMessage":{
    "color":"#C12727",
    "margin":".25rem 0 0 0",
    "fontSize":".875rem"
  }
};

const Template = ({ includeButtons, styleOverrides }: { includeButtons: boolean, styleOverrides?: object }) => {
  // // Alternate way of doing it
  // const cardForm = document.createElement('justifi-card-form') as HTMLJustifiCardFormElement;

  const parsedStyleOverrides = styleOverrides ? JSON.stringify(styleOverrides) : null;

  return (`
    <div>
      <justifi-card-form style-overrides='${parsedStyleOverrides || ''}' />
    </div>
    ${includeButtons ? buttons : ''}
  `);
};

export const Basic = Template.bind({});
Basic.args = {
  includeButtons: true
}

// export const Embedded = () => {
//   return `
//     <style>
//       #wrapper {
//         background-color: #aaaaaa;
//       }
//     </style>
//     <div id="wrapper" style="width: 50%;">
//       ${Template.bind({})}
//     </div>
//     ${buttons}
//   `;
// };

export const Embedded = Template.bind({});
Embedded.args = {
  includeButtons: true
}
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
  styleOverrides: storyStyleOverrides
}

