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

  const { access_token } = await response.json();
  return access_token;
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
          `read:account:${process.env.SUB_ACCOUNT_ID}`,
        ],
      }),
    }
  );

  const { access_token } = await response.json();
  return access_token;
}

app.get('/', async (req, res) => {
    const accountId = process.env.SUB_ACCOUNT_ID;
    const token = await getToken();
    const webComponentToken = await getWebComponentToken(token);  

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>JustiFi Terminals List Component</title>
        <script type="module" src="/scripts/webcomponents/webcomponents.esm.js"></script>
        <link rel="stylesheet" href="/styles/theme.css">
        <link rel="stylesheet" href="/styles/example.css">
      </head>
      <body>
        <div style="padding:25px;">
          <div>
            <justifi-terminals-list-filters></justifi-terminals-list-filters>
          </div>
          <div>
            <justifi-terminals-list auth-token="${webComponentToken}" account-id="${accountId}"></justifi-terminals-list>
          </div>
        </div>
        <script>
          const justifiTerminals = document.querySelector('justifi-terminals-list');

          justifiTerminals.addEventListener('error-event', (event) => {
            console.log(event);
          });

          justifiTerminals.addEventListener('row-clicked', (event) => {
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
