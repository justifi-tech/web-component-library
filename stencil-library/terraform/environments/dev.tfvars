ENVIRONMENT = "dev"
ROOT_DOMAIN = "justifi-dev.com"

AUTH0_CLIENT_ID = "TVJgloFB8GxaJ4tYVzIK8e81ehv4E7tX"
AUTH0_DOMAIN    = "justifi-dev.us.auth0.com"
AUTH0_AUDIENCE  = "https://api.justifi.ai/v1"

CALLBACKS_LIST = [
  "http://localhost:3000",
  "http://192.168.99.100:3000",
  "http://192.168.99.101:3000",
  "http://localhost:3001"
]
ALLOWED_ORIGINS_LIST = []
ALLOWED_LOGOUT_URLS_LIST = [
  "http://localhost:3000",
  "http://192.168.99.100:3000/",
  "http://localhost:3001"
]
WEB_ORIGINS_LIST = [
  "http://localhost:3000",
  "http://192.168.99.100:3000",
  "http://192.168.99.101:3000",
  "http://localhost:3001"
]
