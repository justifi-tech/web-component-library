require('dotenv').config({ path: '../../.env' });

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const authTokenEndpoint = process.env.AUTH_TOKEN_ENDPOINT;
const webComponentTokenEndpoint = process.env.WEB_COMPONENT_TOKEN_ENDPOINT;
const subAccountId = process.env.SUB_ACCOUNT_ID;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const disputeId = process.env.DISPUTE_ID;

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
      resources: [`write:dispute:${disputeId}`],
    }),
  });
  const { access_token } = await response.json();
  return access_token;
}

app.get('/', async (req, res) => {
  const token = await getToken();
  const webComponentToken = await getWebComponentToken(token, subAccountId);

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>JustiFi Dispute Component</title>
        <script type="module" src="/scripts/webcomponents/webcomponents.esm.js"></script>
        <link rel="stylesheet" href="/styles/theme.css">
        <link rel="stylesheet" href="/styles/example.css">
      </head>
      <body>
        <div style="margin:0 auto;max-width:700px;">
          <justifi-dispute-management
            dispute-id="${disputeId}"
            auth-token="${webComponentToken}">
          </justifi-dispute-management>
        </div>

        <script>
          const justifiDisputeManagement = document.querySelector('justifi-dispute-management');

          justifiDisputeManagement.addEventListener('submit-event', (event) => console.log(event));

          justifiDisputeManagement.addEventListener('complete-form-step-event', (event) => console.log(event));

          justifiDisputeManagement.addEventListener('click-event', (event) => console.log(event));
          
          justifiDisputeManagement.addEventListener('error-event', (event) => console.log(event));
        </script>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
