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
    response = await fetch(process.env.AUTH_TOKEN_ENDPOINT, {
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
    const response = await fetch(process.env.WEB_COMPONENT_TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
      body: JSON.stringify({
        resources: [`write:business:${businessId}`],
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
  const businessId = process.env.BUSINESS_ID;
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
          ></justifi-order-terminals>
        </div>
        <script>
          console.log('token', '${token}');
          console.log('webComponentToken', '${webComponentToken}');
        </script>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
