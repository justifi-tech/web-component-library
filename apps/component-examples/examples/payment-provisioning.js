require('dotenv').config();

const express = require('express');
const { generateRandomLegalName } = require('../utils/random-business-names');
const app = express();
const port = process.env.PORT || 3000;

app.use(
  '/scripts',
  express.static(__dirname + '/../node_modules/@justifi/webcomponents/dist/')
);
app.use('/styles', express.static(__dirname + '/../css/'));

async function getToken() {
  const requestBody = JSON.stringify({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
  });

  let response;
  try {
    response = await fetch('https://api.justifi.ai/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestBody,
    });
  } catch (error) {
    console.log('ERROR:', error);
  }

  const { access_token } = await response.json();
  console.log('response from getToken', access_token);

  return access_token;
}

async function createBusiness(token) {
  const randomLegalName = generateRandomLegalName();
  const response = await fetch('https://api.justifi.ai/v1/entities/business', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      legal_name: randomLegalName,
    }),
  });
  const res = await response.json();
  console.log('response from createBusiness', res);
  return res.id;
};

async function getWebComponentToken(token, businessId) {
  const response = await fetch(
    'https://api.justifi.ai/v1/web_component_tokens',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        resources: [
          `write:business:${businessId}`,
        ],
      }),
    }
  );

  const res = await response.json();
  console.log('response from getWebComponentToken', res);

  return res.access_token;
}

app.get('/', async (req, res) => {
  const token = await getToken();
  const businessId = await createBusiness(token);
  const webComponentToken = await getWebComponentToken(token, businessId);

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
