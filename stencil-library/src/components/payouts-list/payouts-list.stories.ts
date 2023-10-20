export default {
  title: 'Components/PayoutsList',
  component: 'justifi-payouts-list',
  parameters: {},
  decorators: [
    (Story) => `
      ${Story()}
      <script>
        window.addEventListener('payout-row-clicked', (e) => {
          console.log(e);
        })
      </script>
    `
  ]
};

class PayoutsListArgs {
  'auth-token': string;
  'account-id': string;

  constructor(args) {
    this['auth-token'] = args['auth-token'] || 'eyJraWQiOiJqdXN0aWZpLWUyNDgyMmU3ODE1MmEzZjRkMjU1IiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguanVzdGlmaS5haS8iLCJhenAiOiJvYXNfMkJMRHpaOHF6dDZndnNvQkxBZnFCbyIsInN1YiI6Im9hc18yQkxEelo4cXp0Nmd2c29CTEFmcUJvQHNlc3Npb25zIiwiYXVkIjoiaHR0cHM6Ly9hcGkuanVzdGlmaS5haS92MSIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsInBlcm1pc3Npb25zIjpbeyJyb2xlIjoicmVhZDphY2NvdW50IiwicmVzb3VyY2VfaWQiOiJhY2NfMUdCS1Mycmc3bUxsMnIzRHM0TlBQWSJ9XSwiZXhwIjoxNzAwNDExOTYyLCJpYXQiOjE2OTc4MTk5NjIsInBsYXRmb3JtX2FjY291bnRfaWQiOiJhY2NfN2NWbmc3ZXNDdmZIZXZXUUxTd2xuayJ9.Xcafn_lBJAPoZf36CITUyENHuIQLgDCXTpkos2ZIufr8tqXN1jVb5_vmd4OYYuxQjfgAjPiQ5KF_-Zn14NsELihth-fAHagOeyFQ4hQNezULOy7oVhf7BpsUMPlMPcIM3beomTY--xqULxeSbTTo9Kt-Pu9sPIARb2wT7WpPlw1Xskm9jHjVRgM_QPxMxaqGa6YFXfivQpdWxCz4H9eD6eijUV2DIOvzkZ8UTRTul6AzIeIXFItynfjXeetrzBihBeirVOWMxlfIgOYNUeGo_IgnriHdyratxF1o3JZQb-mZS5AS-YYIYENm41I9sY6t7slAza3IhwZ400t6_lceww';
    this['account-id'] = args['account-id'] || 'acc_1GBKS2rg7mLl2r3Ds4NPPY';
  }
}

const Template = (args: PayoutsListArgs) => {
  return (`
    <justifi-payouts-list
      data-testid="justifi-payouts-list"
      auth-token="${args['auth-token']}"
      account-id="${args['account-id']}"
    />
  `);
};

export const Basic = Template.bind({});
Basic.args = new PayoutsListArgs({});

export const Styled = Template.bind({});
Styled.args = new PayoutsListArgs({});
Styled.decorators = [
  (Story) => `
    ${Story()}
    <style>
      justifi-payouts-list::part(table-head-cell) {
        background-color: #F4F4F6;
      }
      justifi-payouts-list::part(pagination-bar) {
        background-color: #F4F4F6;
      }
      justifi-payouts-list::part(arrow) {
        --bs-btn-disabled-bg: #212529;
        --bs-btn-disabled-border-color: #212529;
        --bs-btn-bg: #212529;
        --bs-btn-border-color: #212529;
        --bs-btn-hover-bg: #fccc32;
        --bs-btn-hover-border-color: #fccc32;
      }
      justifi-payouts-list::part(error-state) {
        color: red;
        background-color: #EEEEF5;
      }
      justifi-payouts-list::part(loading-state-cell) {
        background-color: #EEEEF5;
      }
      justifi-payouts-list::part(table-row) {
        background-color: #EEEEF5;
      }
      justifi-payouts-list::part(table-row-even) {
        background-color: #F4F4F6;
      }
    </style>
  `
]
