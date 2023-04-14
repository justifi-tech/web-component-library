// import { userEvent, waitFor, within } from '@storybook/testing-library';
// import { expect } from '@storybook/jest';

// import { FormButtons, handleReady } from "../../../storybook-utils";

export default {
  title: 'Components/BillingForm',
  component: 'justifi-billing-form',
  parameters: {
    // actions: {
    //   handles: [
    //     'cardFormReady',
    //     'cardFormValidate',
    //     'cardFormTokenize'
    //   ],
    // },
  },
  decorators: [
    (story) => `
      ${story()}
      <script>${addEvents()}</script>
    `,
  ],
};

const addEvents = () => {
  // addEventListener('cardFormReady', handleReady);
}

// const storyStyleOverrides = {
//   "layout": {
//     "padding": "100px",
//     "formControlSpacingHorizontal": ".5rem",
//     "formControlSpacingVertical": "1rem"
//   },
//   "formLabel": {
//     "fontWeight": "700",
//     "fontFamily": "sans-serif",
//     "margin": "0 0 .5rem 0"
//   },
//   "formControl": {
//     "backgroundColor": "#00F4F6",
//     "backgroundColorHover": "#EEEEF5",
//     "borderColor": "rgba(0, 0, 0, 0.42)",
//     "borderColorHover": "rgba(0, 0, 0, 0.62)",
//     "borderColorFocus": "#fccc32",
//     "borderColorError": "#C12727",
//     "borderWidth": "0px",
//     "borderBottomWidth": "1px",
//     "borderRadius": "40px 4px 0 0",
//     "borderStyle": "solid",
//     "boxShadowErrorFocus": "none",
//     "boxShadowFocus": "none",
//     "color": "#212529",
//     "fontSize": "1rem",
//     "fontWeight": "400",
//     "lineHeight": "2",
//     "margin": "0",
//     "padding": ".5rem .875rem"
//   },
//   "errorMessage": {
//     "color": "#C12727",
//     "margin": ".25rem 0 0 0",
//     "fontSize": ".875rem"
//   }
// };

const Template = ({
  includeButtons = true,
  styleOverrides
}: {
  includeButtons: boolean,
  styleOverrides?: object
}) => {
  const parsedStyleOverrides = styleOverrides ? JSON.stringify(styleOverrides) : null;

  return (`
    <div>
      <justifi-billing-form data-testid="billing-form-iframe" style-overrides='${parsedStyleOverrides || ''}' />
    </div>
  `);
};

export const Basic = Template.bind({});
