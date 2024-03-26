import { codeExampleHead } from '../utils';

export const codeExampleFull = (`
<!DOCTYPE html>
<html dir="ltr" lang="en">

${codeExampleHead('justifi-payout-details')}

<body>
  <justifi-payout-details payout-id="123" auth-token="your-auth-token"></justifi-payout-details>
</body>

<script>
  (function() {
    var payoutDetails = document.querySelector('justifi-payout-details');

    payoutDetails.addEventListener('tokenExpired', (data) => {
      console.log(data);
    });
  })()
</script>

</html>
`);
