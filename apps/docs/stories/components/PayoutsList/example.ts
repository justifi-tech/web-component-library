import { codeExampleHead } from '../../utils';

export default `<!DOCTYPE html>
<html dir="ltr" lang="en">

${codeExampleHead('justifi-payouts-list')}

<body>
  <justifi-payouts-list></justifi-payouts-list>
</body>

<script>
  (function () {
    const payoutsList = document.querySelector('justifi-payouts-list');

    payoutsList.addEventListener('error-event', (event) => {
      // here is where you would handle the error
      console.error('error-event', event.detail);
    });

    payoutsList.addEventListener('row-clicked', (event) => {
      // here is where you would handle the event
      console.log('row-clicked', event.detail);
    });
  })();
</script>

</html>`;
