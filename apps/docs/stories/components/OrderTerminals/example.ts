import { codeExampleHead } from '../../utils';

export const codeExampleFull = `
<!DOCTYPE html>
<html dir="ltr" lang="en">

${codeExampleHead(
  'justifi-order-terminals',
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
  <justifi-order-terminals
    business-id="biz_123" 
    account_id="acc_123"
    auth-token="your-auth-token"
    shipping="false"
    submit-button-text="Provision Terminals"
  ></justifi-order-terminals>
</body>

<script>
  (function () {
    const orderTerminals = document.querySelector('justifi-order-terminals');

    orderTerminals.addEventListener('error-event', (event) => {
      // here is where you would handle the error
      console.error('error-event', event.detail);
    });

    orderTerminals.addEventListener('submit-event', (event) => {
      // here is where you would handle the submit event
      console.log('submit-event', event.detail);
    });
  })();
</script>
</html>
`;
