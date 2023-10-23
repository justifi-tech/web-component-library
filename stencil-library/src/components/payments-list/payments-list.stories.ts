export default {
  title: 'Pre-release Components/PaymentsList',
  component: 'justifi-payments-list',
  parameters: {},
  decorators: [
    (Story) => `
      ${Story()}
      <script>
        window.addEventListener('payment-row-clicked', (e) => {
          console.log(e);
        })
      </script>
    `
  ]
};

class PaymentsListArgs {
  'auth-token': string;
  'account-id': string;

  constructor(args) {
    this['auth-token'] = args['auth-token'] || 'eyJraWQiOiJqdXN0aWZpLWUyNDgyMmU3ODE1MmEzZjRkMjU1IiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguanVzdGlmaS5haS8iLCJhenAiOiJvYXNfMkJMRHpaOHF6dDZndnNvQkxBZnFCbyIsInN1YiI6Im9hc18yQkxEelo4cXp0Nmd2c29CTEFmcUJvQHNlc3Npb25zIiwiYXVkIjoiaHR0cHM6Ly9hcGkuanVzdGlmaS5haS92MSIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsInBlcm1pc3Npb25zIjpbeyJyb2xlIjoicmVhZDphY2NvdW50IiwicmVzb3VyY2VfaWQiOiJhY2NfMUdCS1Mycmc3bUxsMnIzRHM0TlBQWSJ9XSwiZXhwIjoxNzAwNDExOTYyLCJpYXQiOjE2OTc4MTk5NjIsInBsYXRmb3JtX2FjY291bnRfaWQiOiJhY2NfN2NWbmc3ZXNDdmZIZXZXUUxTd2xuayJ9.Xcafn_lBJAPoZf36CITUyENHuIQLgDCXTpkos2ZIufr8tqXN1jVb5_vmd4OYYuxQjfgAjPiQ5KF_-Zn14NsELihth-fAHagOeyFQ4hQNezULOy7oVhf7BpsUMPlMPcIM3beomTY--xqULxeSbTTo9Kt-Pu9sPIARb2wT7WpPlw1Xskm9jHjVRgM_QPxMxaqGa6YFXfivQpdWxCz4H9eD6eijUV2DIOvzkZ8UTRTul6AzIeIXFItynfjXeetrzBihBeirVOWMxlfIgOYNUeGo_IgnriHdyratxF1o3JZQb-mZS5AS-YYIYENm41I9sY6t7slAza3IhwZ400t6_lceww';
    this['account-id'] = args['account-id'] || 'acc_1GBKS2rg7mLl2r3Ds4NPPY';
  }
}

const Template = (args: PaymentsListArgs) => {
  return (`
    <justifi-payments-list
      data-testid="justifi-payments-list"
      auth-token="${args['auth-token']}"
      account-id="${args['account-id']}"
    />
  `);
};

export const Basic = Template.bind({});
Basic.args = new PaymentsListArgs({});

export const Styled = Template.bind({});
Styled.args = new PaymentsListArgs({});
Styled.decorators = [
  (Story) => `
    ${Story()}
    <style>
      justifi-payments-list::part(table-head-cell) {
        background-color: #F4F4F6;
      }
      justifi-payments-list::part(pagination-bar) {
        background-color: #F4F4F6;
      }
      justifi-payments-list::part(arrow) {
        --bs-btn-disabled-bg: #212529;
        --bs-btn-disabled-border-color: #212529;
        --bs-btn-bg: #212529;
        --bs-btn-border-color: #212529;
        --bs-btn-hover-bg: #fccc32;
        --bs-btn-hover-border-color: #fccc32;
      }
      justifi-payments-list::part(error-state) {
        color: red;
        background-color: #EEEEF5;
      }
      justifi-payments-list::part(loading-state-cell) {
        background-color: #EEEEF5;
      }
      justifi-payments-list::part(table-row) {
        background-color: #EEEEF5;
      }
      justifi-payments-list::part(table-row-even) {
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
Contained.args = new PaymentsListArgs({});
