require('dotenv').config();

const express = require('express');
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

  const data = await response.json();

  return data.access_token;
}

async function getWebComponentToken(token) {
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
          `write:tokenize:${process.env.SUB_ACCOUNT_ID}`,
        ],
      }),
    }
  );
  const { access_token } = await response.json();
  return access_token;
}

app.get('/', async (req, res) => {
  const token = await getToken();
  const webComponentToken = await getWebComponentToken(token);

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>JustiFi TokenizePaymentMethod</title>
        <script type="module" src="/scripts/webcomponents/webcomponents.esm.js"></script>
        <link rel="stylesheet" href="/styles/theme.css">
        <link rel="stylesheet" href="/styles/example.css">
      </head>
      <body>
        <div>
          <justifi-tokenize-payment-method
            auth-token="${webComponentToken}"
            account-id="${process.env.SUB_ACCOUNT_ID}"
          >
          </justifi-tokenize-payment-method>
        </div>
        <div id="output-pane">
          <em>Tokenization output will appear here...</em>
        </div>
      </body>
      <script>
        const justifiTokenizePaymentMethod = document.querySelector('justifi-tokenize-payment-method');

        function writeOutputToPage(event) {
          document.getElementById('output-pane').innerHTML = '<code><pre>' + JSON.stringify(event.detail, null, 2) + '</pre></code>';
        }

        justifiTokenizePaymentMethod.addEventListener('submit-event', (event) => {
          console.log(event);
          writeOutputToPage(event);
        });

        justifiTokenizePaymentMethod.addEventListener('error-event', (event) => {
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
