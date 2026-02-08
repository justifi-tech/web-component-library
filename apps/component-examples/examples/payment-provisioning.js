const express = require('express');
const { API_PATHS } = require('../utils/api-paths');
const { getToken, getWebComponentToken } = require('../utils/auth');
const { generateRandomLegalName } = require('../utils/random-business-names');

const router = express.Router();

async function createBusiness(token) {
  const businessEndpoint = `${process.env.API_ORIGIN}/${API_PATHS.BUSINESS}`;
  const randomLegalName = generateRandomLegalName();
  const response = await fetch(businessEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      legal_name: randomLegalName,
      country_of_establishment: 'USA',
    }),
  });
  const res = await response.json();
  console.log('response from createBusiness', res);
  return res.id;
}

router.get('/', async (req, res) => {
  const token = await getToken();
  const businessId = 'biz_4G7XkdwIXbm1I3Bmy0ixld'; //await createBusiness(token);
  const webComponentToken = await getWebComponentToken(token, [`write:business:${businessId}`]);

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

          justifiPaymentProvisioning.addEventListener('submit-event', (event) => console.log(event));

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
  require('dotenv').config({ path: '../../.env' });
  const app = express();
  const port = process.env.PORT || 3000;
  app.use('/scripts', express.static(__dirname + '/../node_modules/@justifi/webcomponents/dist/'));
  app.use('/styles', express.static(__dirname + '/../css/'));
  app.use('/', router);
  app.listen(port, () => console.log(`Example app listening on port ${port}`));
}
