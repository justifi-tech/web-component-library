export default {
  title: 'dev/Components/ProceedsList',
  component: 'justifi-proceeds-list',
  parameters: {},
  decorators: [
    (Story) => `
      ${Story()}
      <script>
        window.addEventListener('proceed-row-clicked', (e) => {
          console.log(e);
        })
      </script>
    `
  ]
};

class ProceedsListArgs {
  'auth-token': string;
  'account-id': string;

  constructor(args) {
    this['auth-token'] = args['auth-token'] || '';
    this['account-id'] = args['account-id'] || '';
  }
}

const Template = (args: ProceedsListArgs) => {
  return (`
    <justifi-proceeds-list
      data-testid="justifi-proceeds-list"
      auth-token="${args['auth-token']}"
      account-id="${args['account-id']}"
    />
  `);
};

export const Basic = Template.bind({});
Basic.args = new ProceedsListArgs({});

export const Styled = Template.bind({});
Styled.args = new ProceedsListArgs({});
Styled.decorators = [
  (Story) => `
    ${Story()}
    <style>
      justifi-proceeds-list::part(table-head-cell) {
        background-color: #F4F4F6;
      }
      justifi-proceeds-list::part(pagination-bar) {
        background-color: #F4F4F6;
      }
      justifi-proceeds-list::part(arrow) {
        --bs-btn-disabled-bg: #212529;
        --bs-btn-disabled-border-color: #212529;
        --bs-btn-bg: #212529;
        --bs-btn-border-color: #212529;
        --bs-btn-hover-bg: #fccc32;
        --bs-btn-hover-border-color: #fccc32;
      }
      justifi-proceeds-list::part(error-state) {
        color: red;
        background-color: #EEEEF5;
      }
      justifi-proceeds-list::part(loading-state-cell) {
        background-color: #EEEEF5;
      }
      justifi-proceeds-list::part(table-row) {
        background-color: #EEEEF5;
      }
      justifi-proceeds-list::part(table-row-even) {
        background-color: #F4F4F6;
      }
    </style>
  `
]
