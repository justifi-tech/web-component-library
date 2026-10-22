const { API_PATHS } = require('./api-paths');

// Platform tokens are reusable, so cache them — a parallel E2E run otherwise
// hammers /oauth/token. Web component tokens are not: they are single-resource.
const TOKEN_TTL_MS = 10 * 60 * 1000;
const tokenCache = new Map();

async function getToken(clientId, clientSecret) {
  const authTokenEndpoint = `${process.env.API_ORIGIN}/${API_PATHS.AUTH_TOKEN}`;
  const id = clientId ?? process.env.CLIENT_ID;
  const secret = clientSecret ?? process.env.CLIENT_SECRET;

  const cached = tokenCache.get(id);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.promise;
  }

  const promise = fetchToken(authTokenEndpoint, id, secret);
  const entry = { promise, expiresAt: Date.now() + TOKEN_TTL_MS };
  tokenCache.set(id, entry);
  // A failed mint must not be cached, or every later request reuses the failure.
  promise.catch(() => {
    if (tokenCache.get(id) === entry) tokenCache.delete(id);
  });
  return promise;
}

async function fetchToken(authTokenEndpoint, id, secret) {
  let response;
  try {
    response = await fetch(authTokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: id,
        client_secret: secret,
      }),
    });
  } catch (error) {
    console.log('ERROR:', error);
  }

  const responseJson = await response.json();
  const { access_token } = responseJson;
  if (!access_token) {
    throw new Error(
      `No access_token in auth response: ${JSON.stringify(responseJson)}`,
    );
  }
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
