import { codeExampleHead } from '../utils';

export default `<DOCTYPE html>
<html dir="ltr" lang="en">

${codeExampleHead('justifi-gross-payment-chart')}

<body>
  <justifi-gross-payment-chart></justifi-gross-payment-chart>
</body>

<script>
  (function() {
    var justifiGrossPaymentChart = document.querySelector('justifi-gross-payment-chart');

    console.log('justifiGrossPaymentChart: ', justifiGrossPaymentChart);
    
    justifiGrossPaymentChart.addEventListener('tokenExpired', (data) => {
      // here is where you would handle the token expired event
      console.log('data');
    });
  })();
</script>
</html>`;
