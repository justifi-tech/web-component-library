import { codeExampleHead } from '../../utils';

export const codeExampleFull = `
<!DOCTYPE html>
<html dir="ltr" lang="en">

${codeExampleHead(
  'justifi-payment-transactions-list',
  `<style>
      ::part(font-family) {
        font-family: georgia;   
      }
        
      ::part(color) {
        color: darkslategray;
      }

      ::part(background-color) {
        background-color: transparent;
      }
    </style>`
)}

<body>
  <justifi-payment-transactions-list 
    payment-id="py_123" 
    auth-token="authToken"
    columns="id,type,amount,created_at"
  />
</body>

<script>
  (function () {
    var paymentTransactionsList = document.querySelector('justifi-payment-transactions-list');

    paymentTransactionsList.addEventListener('click-event', (event) => {
      // here is where you would handle the click events
      console.log('click-event', event.detail);
    });

    paymentTransactionsList.addEventListener('error-event', (event) => {
      // here is where you would handle the error
      console.error('error-event', event.detail);
    });
  })();
</script>

</html>
`;
