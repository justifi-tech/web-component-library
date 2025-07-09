require('dotenv').config({ path: '../../.env' });
const express = require('express');
const { API_PATHS } = require('../utils/api-paths');

const app = express();
const port = process.env.PORT || 3000;
const authTokenEndpoint = `${process.env.API_ORIGIN}/${API_PATHS.AUTH_TOKEN}`;
const webComponentTokenEndpoint = `${process.env.API_ORIGIN}/${API_PATHS.WEB_COMPONENT_TOKEN}`;
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

  const data = await response.json();
  return data.access_token;
}

async function getWebComponentToken(token) {
  const response = await fetch(webComponentTokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      resources: [`write:tokenize:${subAccountId}`],
    }),
  });
  const { access_token } = await response.json();
  return access_token;
}

app.get('/', async (req, res) => {
  const token = await getToken();
  const webComponentToken = await getWebComponentToken(token);

  const disableBankAccount = false;
  const disableCreditCard = false;
  const hideCardBillingForm = false;
  const hideBankAccountBillingForm = false;
  const hideSubmitButton = false;
  const paymentMethodGroupId = undefined;

  const billingFormFields = {
    name: 'John Doe',
    address_line1: 'Main St',
    address_line2: 'Apt 1',
    address_city: 'Beverly Hills',
    address_state: 'CA',
    address_postal_code: '90210',
  };

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>JustiFi TokenizePaymentMethod</title>
        <script type="module" src="/scripts/webcomponents/webcomponents.esm.js"></script>
        <link rel="stylesheet" href="/styles/theme.css">
        <link rel="stylesheet" href="/styles/example.css">
        <style>
          .component-wrapper {
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 5px;
          }

          .monospace {
            font-family: monospace;
          }

          .column-output {
            display: flex;
            flex-direction: column;
            height: 100%;
          }
          
          .column-output > div {
            flex: 1;
            min-height: 50%;
          }
        </style>
      </head>
      <body class="two-column-layout">
        <div class="column-preview">
          <div class="component-wrapper">
            <justifi-tokenize-payment-method
              auth-token="${webComponentToken}"
              account-id="${subAccountId}"
              disable-bank-account="${disableBankAccount}"
              disable-credit-card="${disableCreditCard}"
              hide-bank-account-billing-form="${hideBankAccountBillingForm}"
              hide-card-billing-form="${hideCardBillingForm}"
              hide-submit-button="${hideSubmitButton}"
              ${paymentMethodGroupId ? `payment-method-group-id="${paymentMethodGroupId}"` : ''}
            >
            </justifi-tokenize-payment-method>
          </div>
          <div class="component-wrapper flex-column">
            <h5 class="mb-3">Test Methods</h5>
            <div class="d-flex flex-column gap-2">
              <button class="btn btn-secondary" id="fill-billing-form-button">
                <span class="monospace">fillBillingForm()</span>
              </button>
              <button class="btn btn-secondary" id="test-validate-button">
                <span class="monospace">validate()</span>
              </button>
              <button class="btn btn-secondary" id="test-submit-button" ${!hideSubmitButton ? 'hidden' : ''}>
                <span class="monospace">tokenizePaymentMethod()</span>
              </button>
            </div>
          </div>
        </div>
        <div class="column-output">
          <div id="output-pane">
            <em>Tokenization output will appear here...</em>
          </div>
          <div id="event-messages" style="padding: 20px; border: 1px solid #ddd; background-color: #f9f9f9;">
            <h3 style="margin-top: 0;">Event Messages</h3>
            <div id="event-log" style="max-height: 300px; overflow-y: auto; border: 1px solid #ccc; padding: 10px; background-color: white;"><em>Event messages will appear here...</em></div>
          </div>
        </div>
      </body>
      <script>
        const justifiTokenizePaymentMethod = document.querySelector('justifi-tokenize-payment-method');
        const fillBillingFormButton = document.getElementById('fill-billing-form-button');
        const testValidateButton = document.getElementById('test-validate-button');
        const testSubmitButton = document.getElementById('test-submit-button');

        function writeOutputToPage(event) {
          document.getElementById('output-pane').innerHTML = '<code><pre>' + JSON.stringify(event.detail, null, 2) + '</pre></code>';
        }

        function logEventMessage(eventType, eventData) {
          const timestamp = new Date().toLocaleTimeString();
          const eventLog = document.getElementById('event-log');
          const eventMessage = document.createElement('div');
          eventMessage.style.cssText = 'margin-bottom: 10px; padding: 8px; border-left: 3px solid #007bff; background-color: #f8f9fa;';
          eventMessage.innerHTML = 
            '<strong>[' + timestamp + '] ' + eventType + ':</strong><br>' +
            '<code style="font-size: 12px;">' + JSON.stringify(eventData, null, 2) + '</code>';
          
          // Clear the initial message if it's still there
          if (eventLog.innerHTML.includes('Event messages will appear here...')) {
            eventLog.innerHTML = '';
          }
          
          eventLog.appendChild(eventMessage);
          eventLog.scrollTop = eventLog.scrollHeight; // Auto-scroll to bottom
        }

        justifiTokenizePaymentMethod.addEventListener('submit-event', (event) => {
          console.log('submit-event', event);

          if (event.detail.response.token) {
            console.log('Token from submit-event', event.detail.response.token);
          }

          if (event.detail.response.error) {
            console.log('Error from submit-event', event.detail.response.error);
          }
          writeOutputToPage(event);
          logEventMessage('submit-event', event.detail);
        });

        justifiTokenizePaymentMethod.addEventListener('error-event', (event) => {
          console.log('Error-event', event);
          writeOutputToPage(event);
          logEventMessage('error-event', event.detail);
        });

        fillBillingFormButton.addEventListener('click', () => {
          justifiTokenizePaymentMethod.fillBillingForm(${JSON.stringify(billingFormFields)});
        });

        testSubmitButton.addEventListener('click', async () => {
          const response = await justifiTokenizePaymentMethod.tokenizePaymentMethod();
          if (response.token) {
            console.log('Token from tokenize method', response.token);
          }
          
          if (response.error) {
            console.log('Error from tokenize method', response.error);
          };
        });
      
        testValidateButton.addEventListener('click', async () => {
          const response = await justifiTokenizePaymentMethod.validate();
          console.log('Validate response', response);
        });
      </script>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
