const { API_PATHS } = require('./api-paths');

async function getToken() {
  const authTokenEndpoint = `${process.env.API_ORIGIN}/${API_PATHS.AUTH_TOKEN}`;

  let response;
  try {
    response = await fetch(authTokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
      }),
    });
  } catch (error) {
    console.log('ERROR:', error);
  }

  const responseJson = await response.json();
  const { access_token } = responseJson;
  return access_token;
}

async function getWebComponentToken(token, resources) {
  const webComponentTokenEndpoint = `${process.env.API_ORIGIN}/${API_PATHS.WEB_COMPONENT_TOKEN}`;

  const response = await fetch(webComponentTokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ resources }),
  });

  const responseJson = await response.json();
  const { access_token } = responseJson;
  return access_token;
}

module.exports = { getToken, getWebComponentToken };
