require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const authTokenEndpoint = process.env.AUTH_TOKEN_ENDPOINT || 'https://api.justifi.ai/oauth/token';
const webComponentTokenEndpoint = process.env.WEB_COMPONENT_TOKEN_ENDPOINT || 'https://api.justifi.ai/v1/web_component_tokens';
const subAccountId = process.env.SUB_ACCOUNT_ID;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

app.use(
  '/scripts',
  express.static(__dirname + '/../node_modules/@justifi/webcomponents/dist/')
);
app.use('/styles', express.static(__dirname + '/../css/'));

console.log('authTokenEndpoint', authTokenEndpoint);
console.log('webComponentTokenEndpoint', webComponentTokenEndpoint);

async function getToken() {
  const requestBody = JSON.stringify({
    client_id: clientId,
    client_secret: clientSecret
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

  const data = await response.json();
  console.log('getToken response', data);
  return data.access_token;
}

async function getWebComponentToken(token) {
  const response = await fetch(
    webComponentTokenEndpoint,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        resources: [
          `write:tokenize:${subAccountId}`,
        ],
      }),
    }
  );
  const { access_token } = await response.json();
  console.log('getWebComponentToken response', access_token);
  return access_token;
}

app.get('/', async (req, res) => {
  const token = await getToken();
  const webComponentToken = await getWebComponentToken(token);

  const hideCardBillingForm = true;
  const hideSubmitButton = false;

  const billingFormFields = {
    name: 'John Doe',
    address_line1: 'Main St',
    address_line2: 'Apt 1',
    address_city: 'Beverly Hills',
    address_state: 'CA',
    address_postal_code: '90210',
  };

  const postalFormFields = {
    address_postal_code: '90210',
  };

  let fields = hideCardBillingForm ? postalFormFields : billingFormFields;

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>JustiFi TokenizePaymentMethod</title>
        <script type="module" src="/scripts/webcomponents/webcomponents.esm.js"></script>
        <link rel="stylesheet" href="/styles/theme.css">
        <link rel="stylesheet" href="/styles/example.css">
      </head>
      <body class="two-column-layout">
        <div class="column-preview">
          <justifi-tokenize-payment-method
            auth-token="${webComponentToken}"
            account-id="${subAccountId}"
            hide-card-billing-form="${hideCardBillingForm}"
            hide-submit-button="${hideSubmitButton}"
          />
          <button id="fill-billing-form-button">Test Fill Billing Form</button>
          <button id="test-submit-button" ${hideSubmitButton ? '' : 'style="display: none;"'}>Test Submit</button>
        </div>
        <div class="column-output" id="output-pane">
          <em>Tokenization output will appear here...</em>
        </div>
      </body>
      <script>
        const justifiTokenizePaymentMethod = document.querySelector('justifi-tokenize-payment-method');
        const fillBillingFormButton = document.getElementById('fill-billing-form-button');
        const testSubmitButton = document.getElementById('test-submit-button');

        function writeOutputToPage(event) {
          document.getElementById('output-pane').innerHTML = '<code><pre>' + JSON.stringify(event.detail, null, 2) + '</pre></code>';
        }

        justifiTokenizePaymentMethod.addEventListener('submit-event', (event) => {
          console.log(event);
          console.log('token', event.detail.response.token);
          writeOutputToPage(event);
        });

        justifiTokenizePaymentMethod.addEventListener('error-event', (event) => {
          console.log(event);
          writeOutputToPage(event);
        });

        fillBillingFormButton.addEventListener('click', () => {
          justifiTokenizePaymentMethod.fillBillingForm(${JSON.stringify(fields)});
        });

        testSubmitButton.addEventListener('click', () => {
          justifiTokenizePaymentMethod.tokenizePaymentMethod();
        });
      </script>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
