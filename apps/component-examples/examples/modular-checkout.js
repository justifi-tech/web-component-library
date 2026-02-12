const express = require("express");
const { API_PATHS } = require("../utils/api-paths");
const { getToken, getWebComponentToken } = require("../utils/auth");
const { startStandaloneServer } = require("../utils/standalone-server");

const router = express.Router();

async function makeCheckout(token) {
  const checkoutEndpoint = `${process.env.API_ORIGIN}/${API_PATHS.CHECKOUT}`;
  const subAccountId = process.env.SUB_ACCOUNT_ID;
  const paymentMethodGroupId = process.env.PAYMENT_METHOD_GROUP_ID;
  const port = process.env.PORT || 3000;

  const response = await fetch(checkoutEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Sub-Account": subAccountId,
    },
    body: JSON.stringify({
      amount: 1799,
      description: "One Chocolate Donut",
      payment_method_group_id: paymentMethodGroupId,
      origin_url: `localhost:${port}`,
    }),
  });
  const { data } = await response.json();
  return data;
}

router.get("/", async (req, res) => {
  const subAccountId = process.env.SUB_ACCOUNT_ID;

  const token = await getToken();
  const checkout = await makeCheckout(token);
  const resources = [
    `write:checkout:${checkout.id}`,
    `write:tokenize:${subAccountId}`,
  ];
  const webComponentToken = await getWebComponentToken(token, resources);

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>JustiFi Checkout Wrapper</title>
        <script type="module" src="/scripts/webcomponents/webcomponents.esm.js"></script>
        <link rel="stylesheet" href="/styles/theme.css">
        <link rel="stylesheet" href="/styles/example.css">
      </head>
      <body class="two-column-layout">
        <div class="column-preview">
          <justifi-modular-checkout auth-token="${webComponentToken}" checkout-id="${checkout.id}">
            <div style="display: flex; flex-direction: column; gap: 20px;">
              <justifi-summary></justifi-summary>
              <justifi-card-form></justifi-card-form>
              <justifi-google-pay></justifi-google-pay>
              <button
               id="submit-button"
               class="button"
               style="padding: 10px"
              >
                Submit Checkout
              </button>
            </div>
          </justifi-modular-checkout>
        </div>
      </body>
      <script>
        const submitButton = document.getElementById('submit-button');
        const checkoutWrapper = document.querySelector('justifi-modular-checkout');

        submitButton.addEventListener('click', async () => {
          await checkoutWrapper.submitCheckout({ address_postal_code: '12345' });
        });

        checkoutWrapper.addEventListener('submit-event', (e) => {
          console.log('submit-event: ', e);
        });

        checkoutWrapper.addEventListener('error-event', (e) => {
          console.log('error-event: ', e);
        });
      </script>
    </html>
  `);
});

module.exports = router;

if (require.main === module) {
  startStandaloneServer(router);
}
