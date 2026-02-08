const express = require('express');
const { getToken, getWebComponentToken } = require('../utils/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  const subAccountId = process.env.SUB_ACCOUNT_ID;

  const token = await getToken();
  const webComponentToken = await getWebComponentToken(token, [`read:payments:${subAccountId}`]);

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>JustiFi Payouts List Component</title>
        <script type="module" src="/scripts/webcomponents/webcomponents.esm.js"></script>
        <link rel="stylesheet" href="/styles/theme.css">
        <link rel="stylesheet" href="/styles/example.css">
      </head>
      <body>
        <div class="list-component-wrapper">
          <div>
            <justifi-payouts-list-filters />
          </div>
          <div>
            <justifi-payouts-list
              account-id="${subAccountId}"
              auth-token="${webComponentToken}"
            />
          </div>
        </div>
        <script>
          const justifiPayoutsList = document.querySelector('justifi-payouts-list');

          justifiPayoutsList.addEventListener('error-event', (event) => {
            console.log(event);
          });

          justifiPayoutsList.addEventListener('click-event', (event) => {
            console.log(event);
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
