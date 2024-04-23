const theme = `
  body {
    background-color: rgb(247, 247, 247);
  }

  justifi-checkout {
    display: block;
    margin: 0 auto;
    max-width: 450px;
    padding: 20px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  justifi-checkout::part(summary-heading) {
    margin-top: 10px;
  }
  justifi-checkout::part(payment-description) {
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 2px dotted rgba(0, 0, 0, 0.3);
  }
  justifi-checkout::part(payment-total) {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }
  justifi-checkout::part(payment-total-label),
  justifi-checkout::part(payment-total-amount) {
    font-size: 16px;
    font-weight: bold;
    line-height: 20px;
    display: block;
    background-color: white;
  }
  justifi-checkout::part(pay-button) {
    width: 80%;
    margin: 0 auto;
    font-weight: bold;
  }
`;

export default theme;
