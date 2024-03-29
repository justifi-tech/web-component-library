import { codeExampleHead } from "../utils";

export default `<!DOCTYPE html>
<html dir="ltr" lang="en">

${codeExampleHead("justifi-payment-form")}

/*
* Props definition:
*
* client-id is your JustiFi API Credential Client Id
* account-id is the merchant subaccount that you intend to tokenize the payment on.
*/

<body>
  <justifi-payment-form
    client-id="test_df97f04afebc3c018de30df3562d7cdd"
    account-id="acc_5Et9iXrSSAZR2KSouQGAWi"
    bank-account="true"
    card="true"
    email="test@email.com"
    submit-button-text="Something you want here"
  ></justifi-payment-form>
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
