import { codeExampleHead } from '../../utils';

export const codeExampleFull = `
<!DOCTYPE html>
<html dir="ltr" lang="en">

${codeExampleHead(
  'justifi-payout-details',
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
  <justifi-payout-details 
    payout-id="po_123" 
    auth-token="authToken"
    enable-record-click="true"
  />
</body>

<script>
  (function () {
    var payoutDetails = document.querySelector('justifi-payout-details');

    payoutDetails.addEventListener('error-event', (event) => {
      // here is where you would handle the error
      console.error('error-event', event.detail);
    });

    payoutDetails.addEventListener('record-click-event', (event) => {
      // Handle the record click event
      console.log('Record clicked:', event.detail);
      // event.detail.id contains the account ID
      // event.detail.type contains 'account'
      
      // Example: Navigate to account details page
      // window.location.href = '/accounts/' + event.detail.id;
    });
  })();
</script>

</html>
`;
