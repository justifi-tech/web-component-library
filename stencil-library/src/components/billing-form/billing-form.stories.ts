export default {
  title: 'Components/BillingForm',
  component: 'justifi-billing-form',
  parameters: {},
};

type Args = {
  legend: string;
  "css-variables"?: string;
}

const Template = (args: Args) => {
  return (`
    <div>
      <style>
        :root {
          ${args['css-variables'] || ''}
        }
        </style>
      <justifi-billing-form
        data-testid="billing-form-iframe"
        legend="${args['legend'] || ''}"

      />
    </div>
  `);
};

export const Basic = Template.bind({});
Basic.args = {
  legend: 'Billing Form',
}

export const Styled = Template.bind({});
Styled.args = {
  legend: 'Styled Billing Form',
  'css-variables': `
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
  `
}
