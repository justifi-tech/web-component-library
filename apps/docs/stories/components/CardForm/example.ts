import { codeExampleHead } from '../../utils';

export default `<!DOCTYPE html>
<html dir="ltr" lang="en">

${codeExampleHead('justifi-card-form')}

<body>
  <justifi-card-form></justifi-card-form>
  <button type="submit" id="card-submit-button">Tokenize</button>
  <button type="submit" id="card-validate-button">Validate</button>
</body>

<script>
  (function () {
    // Card form component
    var cardForm = document.querySelector('justifi-card-form');
    var cardSubmitButton = document.querySelector('#card-submit-button');
    var cardValidateButton = document.querySelector('#card-validate-button');

    cardForm.addEventListener('cardFormReady', function () {
      console.log('justifi-card-form ready');
    });

    cardSubmitButton.addEventListener('click', (event) => {
      console.log('card form tokenize button clicked');
      // All of this information would come from your form instead of being hard coded
      // Card number, expiration and cvv are collected on our iframe
      const paymentMethodData = {
        name: 'John Doe',
        address_line1: '123 Broadway', // optional
        address_line2: '', // optional
        address_city: 'Minneapolis', // optional
        address_state: 'MN', // optional
        address_postal_code: '55413',
        address_country: 'US', // optional
        metadata: { something: "somevalue" } // optional
      };

      /*
        * ACCOUNT_ID is the sub account for which you are tokenizing
        * AUTH-TOKEN can be used in place of CLIENT_ID.  AUTH-TOKENs are 
        * created using JusitFi's API as described above.
      */

      cardForm.tokenize('CLIENT_ID/AUTH-TOKEN', paymentMethodData, 'ACCOUNT_ID')
        .then((data) => {
          // This is where you can submit the form and use the payment method token
          // on your backend
          console.log('justifi-card-form tokenized: ', data);
        });
    });

    cardValidateButton.addEventListener('click', (event) => {
      console.log('card validate button clicked');
      cardForm.validate()
        .then((data) => {
          console.log('justifi-card-form validated. Is valid? ', data.isValid);
        });
    });
  })();
</script>

</html>`;
