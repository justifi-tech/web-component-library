require('dotenv').config({ path: '../../.env' });
const express = require('express');
const { API_PATHS } = require('../utils/api-paths');

const app = express();
const port = process.env.PORT || 3000;
const checkoutEndpoint = `${process.env.API_ORIGIN}/${API_PATHS.CHECKOUT}`;
const authTokenEndpoint = `${process.env.API_ORIGIN}/${API_PATHS.AUTH_TOKEN}`;
const webComponentTokenEndpoint = `${process.env.API_ORIGIN}/${API_PATHS.WEB_COMPONENT_TOKEN}`;
const paymentMethodGroupId = process.env.PAYMENT_METHOD_GROUP_ID;
const subAccountId = process.env.SUB_ACCOUNT_ID;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

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
      payment_method_group_id: paymentMethodGroupId,
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
  // const checkout = await makeCheckout(token);

  // const webComponentToken = await getWebComponentToken(token, checkout.id);

  const checkoutId = 'cho_6OK63ufCvS2RpKG7Vx0XuA'
  const webComponentToken = await getWebComponentToken(token, checkoutId);

  // console.log(`http://localhost:3003/checkout/1-column?checkout_id=${checkout.id}&account_id=${checkout.account_id}&auth_token=${webComponentToken}`)

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>JustiFi Checkout Wrapper</title>
        <script type="module" src="/scripts/webcomponents/webcomponents.esm.js"></script>
        <link rel="stylesheet" href="/styles/theme.css">
        <link rel="stylesheet" href="/styles/example.css">
      </head>
      <body class="two-column-layout">
        <div class="column-preview">
          <justifi-modular-checkout 
            auth-token="${webComponentToken}" 
            account-id="${subAccountId}"
            checkout-id="${checkoutId}"
          >
            <justifi-card-form></justifi-card-form>
            <justifi-postal-code-form></justifi-postal-code-form>
            <div style="margin-top: 20px">
              <button
               id="submit-button" 
               class="button"
               style="padding:10px"
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

        checkoutWrapper.addEventListener('error-event', (e) => {
          console.log('error-event: ', e);
        });

        submitButton.addEventListener('click', async () => {
          const { id } = await checkoutWrapper.submitCheckout();
          console.log('token: ', id);
        });
      </script>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
