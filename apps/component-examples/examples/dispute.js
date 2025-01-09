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
    response = await fetch(`${process.env.API_ORIGIN}/oauth/token`, {
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

async function getWebComponentToken(token, accountId) {
  const response = await fetch(
    `${process.env.API_ORIGIN}/v1/web_component_tokens`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        resources: [
          `write:account:${accountId}`,
        ],
      }),
    }
  );
  const { access_token } = await response.json();
  return access_token;
}

app.get('/', async (req, res) => {
  const token = await getToken();
  const disputeId = process.env.DISPUTE_ID;
  const webComponentToken = await getWebComponentToken(token, process.env.SUB_ACCOUNT_ID);

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
