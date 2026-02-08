const express = require('express');
const { getToken, getWebComponentToken } = require('../utils/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  const disputeId = process.env.DISPUTE_ID;
  const token = await getToken();
  const webComponentToken = await getWebComponentToken(token, [`write:dispute:${disputeId}`]);

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>JustiFi Dispute Component</title>
        <script type="module" src="/scripts/webcomponents/webcomponents.esm.js"></script>
        <link rel="stylesheet" href="/styles/theme.css">
        <link rel="stylesheet" href="/styles/example.css">
      </head>
      <body>
        <div style="margin:0 auto;max-width:700px;">
          <justifi-dispute-management
            dispute-id="${disputeId}"
            auth-token="${webComponentToken}">
          </justifi-dispute-management>
        </div>

        <script>
          const justifiDisputeManagement = document.querySelector('justifi-dispute-management');

          justifiDisputeManagement.addEventListener('submit-event', (event) => console.log(event));

          justifiDisputeManagement.addEventListener('complete-form-step-event', (event) => console.log(event));

          justifiDisputeManagement.addEventListener('click-event', (event) => console.log(event));

          justifiDisputeManagement.addEventListener('error-event', (event) => console.log(event));
        </script>
      </body>
    </html>
  `);
});

module.exports = router;

if (require.main === module) {
  require('dotenv').config({ path: '../../.env' });
  const app = express();
  const port = process.env.PORT || 3000;
  app.use('/scripts', express.static(__dirname + '/../node_modules/@justifi/webcomponents/dist/'));
  app.use('/styles', express.static(__dirname + '/../css/'));
  app.use('/', router);
  app.listen(port, () => console.log(`Example app listening on port ${port}`));
}
