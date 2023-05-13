import { head } from "../../../storybook-pages/example-parts"

export default `<!DOCTYPE html>
<html dir="ltr" lang="en">

${head('bank-account-form')}

<body>
  <justifi-bank-account-form></justifi-bank-account-form>
  <button type="submit" id="bank-submit-button">Tokenize</button>
  <button type="submit" id="bank-validate-button">Validate</button>
</body>

<script>
  (function () {
    // Bank account form component
    var bankAccountForm = document.querySelector('justifi-bank-account-form');
    var bankAccountSubmitButton = document.querySelector('#bank-submit-button');
    var bankAccountValidateButton = document.querySelector('#bank-validate-button');

    bankAccountForm.addEventListener('bankAccountFormReady', function () {
      console.log('justifi-bank-account-form ready');
    });

    bankAccountSubmitButton.addEventListener('click', (event) => {
      console.log('bank account form tokenize button clicked');
      // All of this information would come from your form instead of being hard coded
      // Account / routing number are collected on our iframe
      const paymentMethodData = {
        name: 'John Doe', // can also pass account_owner_name
        account_type: 'checking', // checking or savings
        account_owner_type: 'individual' // individual or company
      };
      // ACCOUNT_ID is optional, currently required for platforms
      // ACCOUNT_ID is the seller account for which you are tokenizing
      bankAccountForm.tokenize('CLIENT_ID', paymentMethodData, 'ACCOUNT_ID')
        .then((data) => {
          // This is where you can submit the form and use the payment method token
          // on your backend
          console.log('justifi-bank-account-form tokenized: ', data);
        })
    });

    bankAccountValidateButton.addEventListener('click', (event) => {
      console.log('bank account validate button clicked');
      bankAccountForm.validate()
        .then((data) => {
          console.log('justifi-bank-account-form validated. Is valid? ', data.isValid);
        });
    });
  })();
</script>

</html>`
