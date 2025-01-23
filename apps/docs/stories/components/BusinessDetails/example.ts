import { codeExampleHead } from '../../utils';

export const codeExampleFull = `
<!DOCTYPE html>
<html dir="ltr" lang="en">

${codeExampleHead(
  'justifi-business-details',
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
  <justifi-business-details
    business-id="123" auth-token="your-auth-token"
  ></justifi-business-details>
</body>

<script>
  (function () {
    const businessDetails = document.querySelector('justifi-business-details');

    businessDetails.addEventListener('error-event', (event) => {
      // here is where you would handle the error
      console.error('error-event', event.detail);
    });
  })();
</script>
</html>
`;
