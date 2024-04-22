import { codeExampleHead } from '../utils';

export const codeExampleFull = `
<!DOCTYPE html>
<html dir="ltr" lang="en">

${codeExampleHead('justifi-business-details')}

<body>
  <justifi-business-details
    business-id="123" auth-token="your-auth-token"
  ></justifi-business-details>
</body>

<script>
  (function () {
    const businessDetails = document.querySelector('justifi-business-details');

    businessDetails.addEventListener('errorEvent', (event) => {
      // here is where you would handle the error
      console.error('errorEvent', event.detail);
    });
  })();
</script>
</html>
`;
