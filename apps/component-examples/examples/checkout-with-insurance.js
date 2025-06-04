require('dotenv').config({ path: '../../.env' });

const express = require('express');
const { API_PATHS } = require('../utils/api-paths');

const app = express();
const port = process.env.PORT || 3000;
const checkoutEndpoint = `${process.env.API_ORIGIN}/${API_PATHS.CHECKOUT}`;
const authTokenEndpoint = `${process.env.API_ORIGIN}/${API_PATHS.AUTH_TOKEN}`;
const webComponentTokenEndpoint = `${process.env.API_ORIGIN}/${API_PATHS.WEB_COMPONENT_TOKEN}`;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const subAccountId = process.env.SUB_ACCOUNT_ID;
const paymentMethodId = process.env.PAYMENT_METHOD_ID;

app.use(
  '/scripts',
  express.static(__dirname + '/../node_modules/@justifi/webcomponents/dist/')
);
app.use('/styles', express.static(__dirname + '/../css/'));

const startDate = new Date();
const startDateString = startDate.toISOString().split('T')[0];

const endDate = new Date();
endDate.setFullYear(endDate.getFullYear() + 1);
const endDateString = endDate.toISOString().split('T')[0];

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
    start_date: startDateString,
    end_date: endDateString,
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
      payment_method_group_id: paymentMethodId,
      origin_url: `localhost:${port}`,
    }),
  });
  const responseJson = await response.json();
  const { data } = responseJson;
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
        <title>JustiFi Checkout</title>
        <script type="module" src="/scripts/webcomponents/webcomponents.esm.js"></script>
        <link rel="stylesheet" href="/styles/theme.css">
        <link rel="stylesheet" href="/styles/example.css">
      </head>
      <body>
        <div id="component-wrapper" class="container" style="max-width: 800px; margin: auto; padding: 20px;">
          <justifi-checkout auth-token="${webComponentToken}" checkout-id="${checkout.id}">
            <div slot="insurance">
              <justifi-season-interruption-insurance
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
          <div id="output-pane" style="padding: 20px"><em>Checkout output will appear here...</em></div>
        </div>
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
