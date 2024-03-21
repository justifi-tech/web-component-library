import { codeExampleHead } from '../utils';

export const codeExampleFull = (`
<!DOCTYPE html>
<html dir="ltr" lang="en">

${codeExampleHead('justifi-payment-details')}

<body>
  <justifi-payment-details payment-id="123" auth-token="your-auth-token"></justifi-payment-details>
</body>

<script>
  (function () {
    var paymentDetails = document.querySelector('justifi-payment-details');

    console.log('paymentDetails: ', paymentDetails);

    paymentDetails.addEventListener('tokenExpired', (data) => {
      // here is where you would handle the token expired event
      console.log('data');
    });
  })();
</script>
</html>
`);
