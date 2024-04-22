import { codeExampleHead } from '../utils';

export const codeExampleFull = `
<!DOCTYPE html>
<html dir="ltr" lang="en">

${codeExampleHead('justifi-payment-details')}

<body>
  <justifi-payment-details payment-id="123" auth-token="your-auth-token"></justifi-payment-details>
</body>

<script>
  (function () {
    const paymentDetails = document.querySelector('justifi-payment-details');

    paymentDetails.addEventListener('errorEvent', (event) => {
      // here is where you would handle the error
      console.error('errorEvent', event.detail);
    });
  })();
</script>

</html>
`;
