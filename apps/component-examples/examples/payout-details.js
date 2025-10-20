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
const payoutId = process.env.PAYOUT_ID;

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

  const responseJson = await response.json();

  const { access_token } = responseJson;
  return access_token;
}

app.get('/', async (req, res) => {
  const token = await getToken();
  const webComponentToken = await getWebComponentToken(token);
  const enableRecordClick = true;

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>JustiFi Payout Details Component</title>
        <script type="module" src="/scripts/webcomponents/webcomponents.esm.js"></script>
        <link rel="stylesheet" href="/styles/theme.css">
        <link rel="stylesheet" href="/styles/example.css">
      </head>
      <body>
        <div class="list-component-wrapper">
          <justifi-payout-details
            auth-token="${webComponentToken}"
            payout-id="${payoutId}"
            enable-record-click="${enableRecordClick}"
          />
        </div>
        <script>
          const justifiPayoutDetails = document.querySelector('justifi-payout-details');

          justifiPayoutDetails.addEventListener('error-event', (event) => {
            console.log(event);
          });

          justifiPayoutDetails.addEventListener('record-click-event', ({detail}) => {
            console.log('record-click-event', detail);
          });
        </script>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
