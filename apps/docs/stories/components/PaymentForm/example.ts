import { codeExampleHead } from '../../utils';

export default `<!DOCTYPE html>
<html dir="ltr" lang="en">

${codeExampleHead('justifi-payment-form')}

/*
* Props definition:
*
* client-id OR web-component-token: use either for authorization (see Authorization section above)
* account-id is the merchant sub account that you intend to tokenize the payment method on
*/

<body>
  <justifi-payment-form
    client-id="test_df97f04afebc3c018de30df3562d7cdd" // auth-token="your-auth-token"
    account-id="acc_5Et9iXrSSAZR2KSouQGAWi"
    bank-account="true"
    card="true"
    email="test@email.com"
    submit-button-text="Something you want here"
  ></justifi-payment-form>
</body>

<script>
  (function () {
    const paymentForm = document.querySelector('justifi-payment-form');

    paymentForm.addEventListener('submitted', (event) => {
      // here is where you would submit a payment with the token
      console.log('Submitted data:', event.detail);
    });

    paymentForm.addEventListener('error-event', (event) => {
      console.error('error-event:', event.detail);
    });

  })();
</script>

</html>`;
