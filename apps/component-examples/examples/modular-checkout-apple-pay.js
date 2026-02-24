// Apple Pay Modular Checkout Example
//
// Setup:
//
// 1. Generate self-signed certs:
//    mkdir -p apps/component-examples/certs
//    openssl req -x509 -newkey rsa:2048 \
//      -keyout apps/component-examples/certs/key.pem \
//      -out apps/component-examples/certs/cert.pem \
//      -days 365 -nodes
//
// 2. Map verified domain in /etc/hosts:
//    127.0.0.1 checkout.justifi.tech
//
// 3. Set env vars in .env:
//    APPLE_PAY_DOMAIN=checkout.justifi.tech
//    HTTPS_PORT=8443
//
// 4. Run:
//    pnpm --filter @repo/component-examples start:modular-checkout-apple-pay
//
// 5. Open Safari: https://checkout.justifi.tech:8443

require('dotenv').config({ path: '../../.env' });
const https = require('https');
const fs = require('fs');
const path = require('path');
const express = require('express');
const { API_PATHS } = require('../utils/api-paths');

const app = express();
const port = process.env.HTTPS_PORT || 8443;
const applePayDomain = process.env.APPLE_PAY_DOMAIN || 'checkout.justifi.tech';
const checkoutEndpoint = `${process.env.API_ORIGIN}/${API_PATHS.CHECKOUT}`;
const authTokenEndpoint = `${process.env.API_ORIGIN}/${API_PATHS.AUTH_TOKEN}`;
const webComponentTokenEndpoint = `${process.env.API_ORIGIN}/${API_PATHS.WEB_COMPONENT_TOKEN}`;
const paymentMethodGroupId = process.env.PAYMENT_METHOD_GROUP_ID;
const subAccountId = process.env.SUB_ACCOUNT_ID;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const certsDir = path.join(__dirname, '..', 'certs');
const sslOptions = {
  key: fs.readFileSync(path.join(certsDir, 'key.pem')),
  cert: fs.readFileSync(path.join(certsDir, 'cert.pem')),
};

app.use(
  '/scripts',
  express.static(__dirname + '/../node_modules/@justifi/webcomponents/dist/'),
);
app.use('/styles', express.static(__dirname + '/../css/'));

async function getToken() {
  const requestBody = JSON.stringify({
    client_id: clientId,
    client_secret: clientSecret,
  });

  let response;
  try {
    response = await fetch(authTokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestBody,
    });
  } catch (error) {
    console.log('ERROR:', error);
  }

  const responseJson = await response.json();
  const { access_token } = responseJson;
  return access_token;
}

async function makeCheckout(token) {
  const response = await fetch(checkoutEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'Sub-Account': subAccountId,
    },
    body: JSON.stringify({
      amount: 1799,
      description: 'One Chocolate Donut',
      payment_method_group_id: paymentMethodGroupId,
      origin_url: `${applePayDomain}:${port}`,
    }),
  });
  const { data } = await response.json();
  return data;
}

async function getWebComponentToken(token, checkoutId) {
  const response = await fetch(webComponentTokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      resources: [
        `write:checkout:${checkoutId}`,
        `write:tokenize:${subAccountId}`,
      ],
    }),
  });
  const { access_token } = await response.json();

  return access_token;
}

app.get('/', async (req, res) => {
  const token = await getToken();
  const checkout = await makeCheckout(token);

  const webComponentToken = await getWebComponentToken(token, checkout.id);

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>JustiFi Modular Checkout - Apple Pay</title>
        <script type="module" src="/scripts/webcomponents/webcomponents.esm.js"></script>
        <link rel="stylesheet" href="/styles/theme.css">
        <link rel="stylesheet" href="/styles/example.css">
      </head>
      <body class="two-column-layout">
        <div class="column-preview">
          <justifi-modular-checkout auth-token="${webComponentToken}" checkout-id="${checkout.id}">
            <div style="display: flex; flex-direction: column; gap: 20px;">
              <justifi-summary></justifi-summary>
              <justifi-card-form></justifi-card-form>
              <justifi-apple-pay></justifi-apple-pay>
              <button
               id="submit-button"
               class="button"
               style="padding: 10px"
              >
                Submit Checkout
              </button>
            </div>
          </justifi-modular-checkout>
        </div>
      </body>
      <script>
        const submitButton = document.getElementById('submit-button');
        const checkoutWrapper = document.querySelector('justifi-modular-checkout');
        const applePay = document.querySelector('justifi-apple-pay');

        checkoutWrapper.preCompleteHook = (state, resolve, reject) => {
          console.log('preCompleteHook state: ', state);
          console.log('Apple Pay payment method ID: ', state.paymentToken);
          reject(new Error('Checkout cancelled by preCompleteHook'));
        };

        submitButton.addEventListener('click', async () => {
          await checkoutWrapper.submitCheckout({ address_postal_code: '12345' });
        });

        checkoutWrapper.addEventListener('submit-event', (e) => {
          console.log('submit-event: ', e);
        });

        checkoutWrapper.addEventListener('error-event', (e) => {
          console.log('error-event: ', e);
        });

        applePay.addEventListener('applePayCancelled', (e) => {
          console.log('applePayCancelled: ', e);
        });
      </script>
    </html>
  `);
});

https.createServer(sslOptions, app).listen(port, () => {
  console.log(`Apple Pay example running at https://${applePayDomain}:${port}`);
});
