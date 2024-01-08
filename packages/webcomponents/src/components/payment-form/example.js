import { head } from '../../../storybook-pages/example-parts';

export default `<!DOCTYPE html>
<html dir="ltr" lang="en">

${head('justifi-payment-form')}

<body>
  <justifi-payment-form bank-account="true" card="true"></justifi-payment-form>
</body>

<script>
  (function () {
    var paymentForm = document.querySelector('justifi-payment-form');

    paymentForm.addEventListener('submitted', (data) => {
      // here is where you would submit a payment with the token
      console.log('data');
    });
  })();
</script>

</html>`;
