export default {
  title: 'Components/BillingForm',
  component: 'justifi-billing-form',
  parameters: {},
};

const Template = ({ styleOverrides }: { styleOverrides?: object }) => {
  const parsedStyleOverrides = styleOverrides ? JSON.stringify(styleOverrides) : null;

  return (`
    <div>
      <justifi-billing-form data-testid="billing-form-iframe" style-overrides='${parsedStyleOverrides || ''}' />
    </div>
  `);
};

export const Basic = Template.bind({});
