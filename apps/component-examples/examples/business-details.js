const express = require("express");
const { getToken, getWebComponentToken } = require("../utils/auth");
const { startStandaloneServer } = require("../utils/standalone-server");

const router = express.Router();

router.get("/", async (req, res) => {
  const businessId = process.env.BUSINESS_ID;
  const token = await getToken();
  const webComponentToken = await getWebComponentToken(token, [
    `read:business:${businessId}`,
  ]);

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

module.exports = router;

if (require.main === module) {
  startStandaloneServer(router);
}
