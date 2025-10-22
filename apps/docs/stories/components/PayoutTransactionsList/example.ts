import { codeExampleHead } from '../../utils';

export const codeExampleFull = `
<!DOCTYPE html>
<html dir="ltr" lang="en">

${codeExampleHead(
  'justifi-payout-transactions-list',
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
  <justifi-payout-transactions-list 
    payout-id="po_123" 
    auth-token="authToken"
    columns="id,type,amount,created_at"
  />
</body>

<script>
  (function () {
    var payoutTransactionsList = document.querySelector('justifi-payout-transactions-list');

    payoutTransactionsList.addEventListener('click-event', (event) => {
      // here is where you would handle the click events
      console.log('click-event', event.detail);
    });

    payoutTransactionsList.addEventListener('error-event', (event) => {
      // here is where you would handle the error
      console.error('error-event', event.detail);
    });
  })();
</script>

</html>
`;
