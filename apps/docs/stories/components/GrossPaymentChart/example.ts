import { codeExampleHead } from '../../utils';

export default `<DOCTYPE html>
<html dir="ltr" lang="en">

${codeExampleHead('justifi-gross-payment-chart')}

<body>
  <justifi-gross-payment-chart
    account-id="acc_123"
    auth-token="authToken"
  />
</body>

<script>
  (function () {
    const grossPaymentChart = document.querySelector('justifi-gross-payment-chart');

    grossPaymentChart.addEventListener('error-event', (event) => {
      // here is where you would handle the error
      console.error('error-event', event.detail);
    });
  })();
</script>

</html>`;
