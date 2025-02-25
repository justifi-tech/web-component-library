require('dotenv').config({ path: '../../.env' });

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const authTokenEndpoint = process.env.AUTH_TOKEN_ENDPOINT;
const webComponentTokenEndpoint = process.env.WEB_COMPONENT_TOKEN_ENDPOINT;
const businessId = process.env.BUSINESS_ID;
const accountId = process.env.ACCOUNT_ID;
const subAccountId = process.env.SUB_ACCOUNT_ID;

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

async function getWebComponentToken(token, businessId) {
  try {
    const response = await fetch(webComponentTokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        resources: [
          `read:business:${businessId}`,
          `write:account:${accountId}`,
        ],
      }),
    });
    const responseJson = await response.json();

    return responseJson.access_token;
  } catch (error) {
    console.log('ERROR getWebComponentToken:', error);
    return { error };
  }
}

app.get('/', async (req, res) => {
  const token = await getToken();
  const webComponentToken = await getWebComponentToken(token, businessId);

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Order Terminals Example</title>
        <script type="module" src="/scripts/webcomponents/webcomponents.esm.js"></script>
        <link rel="stylesheet" href="/styles/theme.css">
        <link rel="stylesheet" href="/styles/example.css">
      </head>
      <body>
        <div style="margin:0 auto;max-width:700px;">
          <justifi-order-terminals
            auth-token="${webComponentToken}"
            business-id="${businessId}"
            account-id="${accountId}"
          ></justifi-order-terminals>
        </div>
        <script>
        </script>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
