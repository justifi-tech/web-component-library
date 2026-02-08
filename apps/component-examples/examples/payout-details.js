const express = require('express');
const { getToken, getWebComponentToken } = require('../utils/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  const subAccountId = process.env.SUB_ACCOUNT_ID;
  const payoutId = process.env.PAYOUT_ID;
  const token = await getToken();
  const webComponentToken = await getWebComponentToken(token, [`read:payments:${subAccountId}`]);
  const enableRecordClick = true;

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>JustiFi Payout Details Component</title>
        <script type="module" src="/scripts/webcomponents/webcomponents.esm.js"></script>
        <link rel="stylesheet" href="/styles/theme.css">
        <link rel="stylesheet" href="/styles/example.css">
      </head>
      <body>
        <div class="list-component-wrapper">
          <justifi-payout-details
            auth-token="${webComponentToken}"
            payout-id="${payoutId}"
            enable-record-click="${enableRecordClick}"
          />
        </div>
        <script>
          const justifiPayoutDetails = document.querySelector('justifi-payout-details');

          justifiPayoutDetails.addEventListener('error-event', (event) => {
            console.log(event);
          });

          justifiPayoutDetails.addEventListener('record-click-event', ({detail}) => {
            console.log('record-click-event', detail);
          });
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
