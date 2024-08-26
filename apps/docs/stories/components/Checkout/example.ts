import { codeExampleHead } from '../../utils';

export default `<!DOCTYPE html>
<html dir="ltr" lang="en">

${codeExampleHead('justifi-checkout')}

<body>
  <justifi-checkout auth-token="token" checkout-id="abc123">
    <!-- Optional: add the insurance slot and component -->
    <div slot="insurance">
      <!-- see the insurance component docs for the full list of props -->
      <justifi-season-interruption-insurance checkout-id="abc123"></justifi-season-interruption-insurance>
    </div>
  </justifi-checkout>
</body>

<script>

</script>

</html>`;
