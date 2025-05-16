require('dotenv').config({ path: '../../.env' });
const express = require('express');
const { API_PATHS } = require('../utils/api-paths');

const app = express();
const port = process.env.PORT || 3000;
const authTokenEndpoint = `${process.env.API_ORIGIN}${API_PATHS.AUTH_TOKEN}`;
const webComponentTokenEndpoint = `${process.env.API_ORIGIN}${API_PATHS.WEB_COMPONENT_TOKEN}`;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const businessId = process.env.BUSINESS_ID;

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
      resources: [`read:business:${businessId}`],
    }),
  });

  const responseJson = await response.json();

  const { access_token } = responseJson;
  return access_token;
}

app.get('/', async (req, res) => {
  const token = await getToken();
  const webComponentToken = await getWebComponentToken(token);

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>JustiFi Business Details Component</title>
        <script type="module" src="/scripts/webcomponents/webcomponents.esm.js"></script>
        <link rel="stylesheet" href="/styles/theme.css">
        <link rel="stylesheet" href="/styles/example.css">
      </head>
      <body>
        <div class="list-component-wrapper">
          <justifi-business-details
            auth-token="${webComponentToken}"
            business-id="${businessId}"
          />
        </div>
        <script>
          const justifiBusinessDetails = document.querySelector('justifi-business-details');

          justifiBusinessDetails.addEventListener('error-event', (event) => {
            console.log(event);
          });
        </script>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
