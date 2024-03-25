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
    var businessDetails = document.querySelector('justifi-business-details');

    console.log('businessDetails: ', businessDetails);

    businessDetails.addEventListener('tokenExpired', (data) => {
      // here is where you would handle the token expired event
      console.log('data');
    });
  })();
</script>

</html>
`;
