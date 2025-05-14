require('dotenv').config({ path: '../../.env' });
const express = require('express');
const { API_PATHS } = require('../utils/api-paths');

const app = express();
const { v4: uuidv4 } = require('uuid');
const port = process.env.PORT || 3000;
const authTokenEndpoint = `${process.env.API_ORIGIN}${API_PATHS.AUTH_TOKEN}`;
const paymentsEndpoint = `${process.env.API_ORIGIN}${API_PATHS.PAYMENTS}`;
const webComponentTokenEndpoint = `${process.env.API_ORIGIN}${API_PATHS.WEB_COMPONENT_TOKEN}`;
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

  const { access_token } = await response.json();
  return access_token;
}

async function createPayment(token) {
  const requestBody = JSON.stringify({
    amount: 1000,
    currency: 'usd',
    capture_strategy: 'automatic',
    description: 'Test payment for refund example file',
    payment_method: {
      card: {
        name: 'Sylvia Fowles',
        number: '4242424242424242',
        verification: '123',
        month: '3',
        year: '2040',
        address_postal_code: '55555',
      },
    },
  });

  const response = await fetch(paymentsEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'sub-account': subAccountId,
      'Idempotency-Key': uuidv4(),
    },
    body: requestBody,
  });
  const { id } = await response.json();
  return id;
}

async function getWebComponentToken(token) {
  const response = await fetch(webComponentTokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      resources: [`read:payments:${subAccountId}`],
    }),
  });

  const { access_token } = await response.json();
  return access_token;
}

app.get('/', async (req, res) => {
  const token = await getToken();
  const paymentId = await createPayment(token);
  const webComponentToken = await getWebComponentToken(token);

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>JustiFi Payment Transactions List Component</title>
        <script type="module" src="/scripts/webcomponents/webcomponents.esm.js"></script>
        <link rel="stylesheet" href="/styles/theme.css">
        <link rel="stylesheet" href="/styles/example.css">
      </head>
      <body>
        <div class="list-component-wrapper">
          <justifi-payment-transactions-list
            payment-id="${paymentId}"
            auth-token="${webComponentToken}"
          />
        </div>
        <script>
          const justifiPaymentTransactionsList = document.querySelector('justifi-payment-transactions-list');

          justifiPaymentTransactionsList.addEventListener('error-event', (event) => {
            console.log(event);
          });

          justifiPaymentTransactionsList.addEventListener('click-event', (event) => {
            console.log(event);
          });
        </script>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
