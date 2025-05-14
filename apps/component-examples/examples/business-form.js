require('dotenv').config({ path: '../../.env' });

const express = require('express');
const { generateRandomLegalName } = require('../utils/random-business-names');
const app = express();
const port = process.env.PORT || 3000;
const authTokenEndpoint = process.env.AUTH_TOKEN_ENDPOINT;
const businessEndpoint = process.env.BUSINESS_ENDPOINT;
const webComponentTokenEndpoint = process.env.WEB_COMPONENT_TOKEN_ENDPOINT;
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

  const { access_token } = await response.json();
  console.log('response from getToken', access_token);

  return access_token;
}

async function createBusiness(token) {
  const randomLegalName = generateRandomLegalName();
  const response = await fetch(businessEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      legal_name: randomLegalName,
    }),
  });
  const res = await response.json();
  console.log('response from createBusiness', res);
  return res.id;
}

async function getWebComponentToken(token, businessId) {
  const response = await fetch(webComponentTokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        resources: [`write:business:${businessId}`],
      }),
    }
  );

  const res = await response.json();
  console.log('response from getWebComponentToken', res);

  return res.access_token;
}

app.get('/', async (req, res) => {
  const token = await getToken();
  const businessId = await createBusiness(token);
  const webComponentToken = await getWebComponentToken(token, businessId);

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>JustiFi Business Form Component</title>
        <script type="module" src="/scripts/webcomponents/webcomponents.esm.js"></script>
        <link rel="stylesheet" href="/styles/theme.css">
        <link rel="stylesheet" href="/styles/example.css">
      </head>
      <body>
        <div style="margin:0 auto;max-width:700px;">
          <justifi-business-form
            business-id="${businessId}"
            auth-token="${webComponentToken}"
          >
          </justifi-business-form>
        </div>

        <script>
          const justifiBusinessForm = document.querySelector('justifi-business-form');

          justifiBusinessForm.addEventListener('submit-event', (event) => console.log(event));

          justifiBusinessForm.addEventListener('click-event', (event) => console.log(event));
          
          justifiBusinessForm.addEventListener('error-event', (event) => console.log(event));
        </script>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
