const express = require("express");
const { getToken, getWebComponentToken } = require("../utils/auth");
const { startStandaloneServer } = require("../utils/standalone-server");

const router = express.Router();

router.get("/", async (req, res) => {
  const businessId = process.env.BUSINESS_ID;
  const accountId = process.env.SUB_ACCOUNT_ID;
  const token = await getToken();
  const webComponentToken = await getWebComponentToken(token, [
    `read:business:${businessId}`,
    `write:account:${accountId}`,
  ]);

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
        <div id="component-wrapper" style="margin:0 auto;max-width:700px;">
          <justifi-order-terminals
            account-id="${accountId}"
            auth-token="${webComponentToken}"
            business-id="${businessId}"
            shipping="true"
          ></justifi-order-terminals>
        </div>
        <script>

          document.addEventListener('submit-event', (event) => {
            const message = document.createElement('div');
            console.log('submit-event', event.detail);
            message.textContent = 'Order ID: ' + event.detail.id;
            document.body.appendChild(message);
          });

          document.addEventListener('error-event', (event) => {
            const message = document.createElement('div');
            console.log('error-event', event.detail);
            message.textContent = 'Error: ' + event.detail.message;
            document.body.appendChild(message);
          });

        </script>
      </body>
    </html>
  `);
});

module.exports = router;

if (require.main === module) {
  startStandaloneServer(router);
}
