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
    business-id="123" auth-token="your-auth-token"
  ></justifi-order-terminals>
</body>

<script>
  (function () {
    const orderTerminals = document.querySelector('justifi-order-terminals');

    orderTerminals.addEventListener('error-event', (event) => {
      // here is where you would handle the error
      console.error('error-event', event.detail);
    });
  })();
</script>
</html>
`;
