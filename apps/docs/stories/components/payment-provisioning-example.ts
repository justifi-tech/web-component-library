import { codeExampleHead } from '../utils';

export default `<!DOCTYPE html>
<html dir="ltr" lang="en">

${codeExampleHead('justifi-payment-provisioning')}

<body>
  <justifi-payment-provisioning
    business-id="<BUSINESS_ID>"
    auth-token="<WEBCOMPONENT_AUTH_TOKEN>">
  </justifi-payment-provisioning>
</body>

</html>`;
