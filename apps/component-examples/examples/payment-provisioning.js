const express = require('express');
const { API_PATHS } = require('../utils/api-paths');
const { getToken, getWebComponentToken } = require('../utils/auth');
const { generateRandomLegalName } = require('../utils/random-business-names');
const { startStandaloneServer } = require('../utils/standalone-server');

const router = express.Router();

async function createBusiness(token, country = 'USA', accountId = null) {
  const businessEndpoint = `${process.env.API_ORIGIN}/${API_PATHS.BUSINESS}`;
  const randomLegalName = generateRandomLegalName();
  const response = await fetch(businessEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(accountId && { 'Sub-Account': accountId }),
    },
    body: JSON.stringify({
      legal_name: randomLegalName,
      country_of_establishment: country,
    }),
  });
  const res = await response.json();
  console.log('response from createBusiness', res);
  return res.id;
}

router.get('/', async (req, res) => {
  const country = req.query.country || 'USA';
  const isCanada = country === 'CAN';
  console.log('isCanada', isCanada);
  console.log('process.env.CAN_CLIENT_ID', process.env.CAN_CLIENT_ID);
  console.log('process.env.CAN_CLIENT_SECRET', process.env.CAN_CLIENT_SECRET);
  const token = isCanada
    ? await getToken(process.env.CAN_CLIENT_ID, process.env.CAN_CLIENT_SECRET)
    : await getToken();
  console.log('token', token);
  const accountId = isCanada ? process.env.CAN_ACCOUNT_ID : null;
  const businessId = await createBusiness(token, country, accountId);
  const webComponentToken = await getWebComponentToken(token, [
    `write:business:${businessId}`,
  ]);

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>JustiFi Payment Provisioning Component</title>
        <script type="module" src="/scripts/webcomponents/webcomponents.esm.js"></script>
        <link rel="stylesheet" href="/styles/theme.css">
        <link rel="stylesheet" href="/styles/example.css">
      </head>
      <body>
        <div style="margin:0 auto;max-width:700px;">
          <justifi-payment-provisioning
            business-id="${businessId}"
            auth-token="${webComponentToken}">
          </justifi-payment-provisioning>
        </div>

        <script>
          const justifiPaymentProvisioning = document.querySelector('justifi-payment-provisioning');

          justifiPaymentProvisioning.addEventListener('submit-event', (event) => console.log('submit-event', event.detail));

          justifiPaymentProvisioning.addEventListener('complete-form-step-event', (event) => console.log(event));

          justifiPaymentProvisioning.addEventListener('click-event', (event) => console.log(event));

          justifiPaymentProvisioning.addEventListener('error-event', (event) => console.log(event));
        </script>
      </body>
    </html>
  `);
});

module.exports = router;

if (require.main === module) {
  startStandaloneServer(router);
}
