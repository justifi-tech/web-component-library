require('dotenv').config({ path: '../../.env' });
const express = require('express');
const { API_PATHS } = require('../utils/api-paths');

const fs = require('fs');
const https = require('https');

const app = express();
const port = process.env.PORT || 3000;
const checkoutEndpoint = `https://api.justifi-staging.com/v1/checkouts`;
const authTokenEndpoint = `https://api.justifi-staging.com/oauth/token`;
const webComponentTokenEndpoint = `https://api.justifi-staging.com/v1/web_component_tokens`;
const paymentMethodGroupId = process.env.PAYMENT_METHOD_GROUP_ID;
const subAccountId = "acc_323sM3WDAUnHH0fJD7re9h";
const clientId = "test_eohVQllq0mJy34T14dsZJlHjXKr7rKyH";
const clientSecret = "test_OZK_PtLPuTS6NM2X9aX9qI6FQpxhuWaCBMWGPpJw0Y3haKiOi-5GECGMNRQ-d22Z";

app.use(
  '/scripts',
  express.static(__dirname + '/../node_modules/@justifi/webcomponents/dist/')
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
      origin_url: `localhost:${port}`,
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
        <title>JustiFi Checkout Wrapper</title>
        <script type="module" src="/scripts/webcomponents/webcomponents.esm.js"></script>
        <link rel="stylesheet" href="/styles/theme.css">
        <link rel="stylesheet" href="/styles/example.css">
        <script crossorigin 
          src="https://applepay.cdn-apple.com/jsapi/1.latest/apple-pay-sdk.js" crossorigin="anonymous"> 
        </script>
      </head>
      <body class="two-column-layout">
        <div class="column-preview">
          <justifi-modular-checkout auth-token="${webComponentToken}" checkout-id="${checkout.id}">
              <justifi-apple-pay
                button-style="black"
                button-type="plain"
                merchant-identifier="merchant.tech.justifi.checkout"
                merchant-display-name="JustiFi Checkout"
              />
          </justifi-modular-checkout>
        </div>
      </body>
    </html>
  `);
});

var server = https.createServer({
  key: fs.readFileSync("/Users/caio/Documents/web-component-library/server.key"),
  cert: fs.readFileSync("/Users/caio/Documents/web-component-library/server.cert"),
}, app)

server.listen(443, () => {
  console.log("Running https")
})
