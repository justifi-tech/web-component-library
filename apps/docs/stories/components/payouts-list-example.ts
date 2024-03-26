import { codeExampleHead } from '../utils';

export default `<!DOCTYPE html>
<html dir="ltr" lang="en">

${codeExampleHead('justifi-payouts-list')}

<body>
  <justifi-payouts-list></justifi-payouts-list>
</body>

<script>
  (function() {
    var payoutsList = document.querySelector('justifi-payouts-list');
    payoutsList.addEventListener('tokenExpired', (data) => {
      console.log(data)
    });
  })();
</script>

</html>`;
