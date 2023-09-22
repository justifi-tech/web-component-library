export default {
  title: 'Components/BusinessList',
  component: 'justifi-business-list',
  parameters: {},
  argTypes: {
    'client-id': {
      control: 'text',
      table: {
        category: 'props',
      }
    },
  },
};

class BusinessListArgs {
  'auth-token': string;
  'account-id': string;
  'client-id': string;

  constructor(args) {
    this['auth-token'] = args['auth-token'] || '';
    this['account-id'] = args['account-id'] || '';
    this['client-id'] = args['client-id'] || '';
  }
}

const Template = (args: BusinessListArgs) => {
  return (`
    <justifi-business-list
      data-testid="justifi-business-list"
      auth-token="${args['auth-token']}"
      account-id="${args['account-id']}"
      client-id="${args['client-id']}"
    />
  `);
};

export const Basic = Template.bind({});
Basic.args = new BusinessListArgs({});

export const Styled = Template.bind({});
Styled.args = new BusinessListArgs({});
Styled.decorators = [
  (Story) => `
    ${Story()}
    <style>
      justifi-business-list::part(table-head-cell) {
        background-color: #F4F4F6;
      }
      justifi-business-list::part(pagination-bar) {
        background-color: #F4F4F6;
      }
      justifi-business-list::part(arrow) {
        --bs-btn-disabled-bg: #212529;
        --bs-btn-disabled-border-color: #212529;
        --bs-btn-bg: #212529;
        --bs-btn-border-color: #212529;
        --bs-btn-hover-bg: #fccc32;
        --bs-btn-hover-border-color: #fccc32;
      }
      justifi-business-list::part(error-state) {
        color: red;
        background-color: #EEEEF5;
      }
      justifi-business-list::part(loading-state-cell) {
        background-color: #EEEEF5;
      }
      justifi-business-list::part(table-row) {
        background-color: #EEEEF5;
      }
      justifi-business-list::part(table-row-even) {
        background-color: #F4F4F6;
      }
    </style>
  `
]

export const Contained = Template.bind({});
Contained.decorators = [
  (Story) => `
    <div style="position: relative; width: 900px; height: 300px; overflow-x: hidden;">
      ${Story()}
    </div>
  `
]
Contained.args = new BusinessListArgs({});
