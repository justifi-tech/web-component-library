require('dotenv').config({ path: '../../.env' });

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const authTokenEndpoint = process.env.AUTH_TOKEN_ENDPOINT;
const webComponentTokenEndpoint = process.env.WEB_COMPONENT_TOKEN_ENDPOINT;
const subAccountId = process.env.SUB_ACCOUNT_ID;
const paymentId = process.env.PAYMENT_ID;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

app.use('/scripts', express.static(__dirname + '/../node_modules/@justifi/webcomponents/dist/'));
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

async function getWebComponentToken(token) {
  const response = await fetch(webComponentTokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      resources: [`write:account:${subAccountId}`],
    }),
  });

  const { access_token } = await response.json();
  return access_token;
}

app.get('/', async (req, res) => {
  const token = await getToken();
  const webComponentToken = await getWebComponentToken(token);

  const hideSubmitButton = false;

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>JustiFi Refund Payment Component</title>
        <script type="module" src="/scripts/webcomponents/webcomponents.esm.js"></script>
        <link rel="stylesheet" href="/styles/theme.css">
        <link rel="stylesheet" href="/styles/example.css">
      </head>
      <body class="two-column-layout">
        <div class="column-preview">
          <justifi-refund-payment
            payment-id="${paymentId}"
            account-id="${subAccountId}"
            auth-token="${webComponentToken}"
            hide-submit-button="${hideSubmitButton}"
          />
          <button part="button" id="test-refund-button" ${hideSubmitButton ? '' : 'style="display: none;"'}>Refund</button>
        </div>
        <div class="column-output" id="output-pane">
          <em>Refund output will appear here...</em>
        </div>
        <script>
          const justifiRefundPayment = document.querySelector('justifi-refund-payment');
          const testSubmitButton = document.getElementById('test-refund-button');

          function writeOutputToPage(event) {
            document.getElementById('output-pane').innerHTML = '<code><pre>' + JSON.stringify(event.detail, null, 2) + '</pre></code>';
          };

          justifiRefundPayment.addEventListener('error-event', (event) => {
            console.log('Error-event', event);
            writeOutputToPage(event);
          });

          justifiRefundPayment.addEventListener('submit-event', (event) => {
            if (event.detail.response.data) {
              console.log('Response data from submit-event', event.detail.response.data);
            }

            if (event.detail.response.error) {
              console.log('Error from submit-event', event.detail.response.error);
            }

            writeOutputToPage(event);
          });

          testSubmitButton.addEventListener('click', async () => {
          const response = await justifiRefundPayment.refundPayment();
            if (response.data) {
              console.log('Response data from refund method', response.data);
            }
            
            if (response.error) {
              console.log('Error from refund method', response.error);
            };
          });
        </script>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
