require('dotenv').config({ path: '../../.env' });

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const proxyApiOrigin = process.env.PROXY_API_ORIGIN;
const authTokenEndpoint = process.env.AUTH_TOKEN_ENDPOINT;
const webcomponentTokenEndpoint = process.env.WEB_COMPONENT_TOKEN_ENDPOINT;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const subAccountId = process.env.SUB_ACCOUNT_ID;
const paymentMethodId = process.env.PAYMENT_METHOD_ID;

app.use(
  '/scripts',
  express.static(__dirname + '/../node_modules/@justifi/webcomponents/dist/')
);
app.use('/styles', express.static(__dirname + '/../css/'));

const insurance = {
  primary_identity: {
    state: 'MN',
    email: 'test@justifi.tech',
    first_name: 'John',
    last_name: 'Doe',
    postal_code: '55401',
    country: 'US',
  },
  policy_attributes: {
    insurable_amount: 1000,
    start_date: '2024-12-01',
    end_date: '2024-12-31',
    covered_identity: {
      first_name: 'John',
      last_name: 'Doe',
    },
  },
};

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

  const { access_token } = await response.json();
  return access_token;
}

async function makeCheckout(token) {
  const response = await fetch(`${proxyApiOrigin}/v1/checkouts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'Sub-Account': subAccountId,
    },
    body: JSON.stringify({
      amount: 1799,
      description: 'One Chocolate Donut',
      payment_method_group_id: paymentMethodId,
      origin_url: `http://localhost:${port}`,
    }),
  });
  const responseJson = await response.json();
  console.log('responseJson:', responseJson);
  const { data } = responseJson;
  return data;
}

async function getWebComponentToken(token, checkoutId) {
  const response = await fetch(webcomponentTokenEndpoint, {
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
        <title>JustiFi Checkout</title>
        <script type="module" src="/scripts/webcomponents/webcomponents.esm.js"></script>
        <link rel="stylesheet" href="/styles/theme.css">
        <link rel="stylesheet" href="/styles/example.css">
      </head>
      <body>
        <div>
          <justifi-checkout auth-token="${webComponentToken}" checkout-id="${checkout.id}">
            <div slot="insurance">
              <justifi-season-interruption-insurance
                auth-token="${webComponentToken}"
                checkout-id="${checkout.id}"
                primary-identity-first-name="${insurance.primary_identity.first_name}"
                primary-identity-last-name="${insurance.primary_identity.last_name}"
                primary-identity-state="${insurance.primary_identity.state}"
                primary-identity-country="${insurance.primary_identity.country}"
                primary-identity-postal-code="${insurance.primary_identity.postal_code}"
                primary-identity-email-address="${insurance.primary_identity.email}"
                policy-attributes-insurable-amount="${insurance.policy_attributes.insurable_amount}"
                policy-attributes-start-date="${insurance.policy_attributes.start_date}"
                policy-attributes-end-date="${insurance.policy_attributes.end_date}"
                covered-identity-first-name="${insurance.policy_attributes.covered_identity.first_name}"
                covered-identity-last-name="${insurance.policy_attributes.covered_identity.last_name}">
              </justifi-season-interruption-insurance>
            </div>
          </justifi-checkout>
        </div>
        <div id="output-pane"><em>Checkout output will appear here...</em></div>
      </body>
      <script>
        const justifiCheckout = document.querySelector('justifi-checkout');

        function writeOutputToPage(event) {
          document.getElementById('output-pane').innerHTML = '<code><pre>' + JSON.stringify(event.detail, null, 2) + '</pre></code>';
        }

        justifiCheckout.addEventListener('submit-event', (event) => {
          console.log(event);
          writeOutputToPage(event);
        });

        justifiCheckout.addEventListener('error-event', (event) => {
          console.log(event);
          writeOutputToPage(event);
        });
      </script>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
