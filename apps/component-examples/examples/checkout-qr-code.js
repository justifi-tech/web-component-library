const express = require("express");
const { API_PATHS } = require("../utils/api-paths");
const { getToken } = require("../utils/auth");
const { startStandaloneServer } = require("../utils/standalone-server");

const router = express.Router();

async function makeCheckout(token) {
  const checkoutEndpoint = `${process.env.API_ORIGIN}/${API_PATHS.CHECKOUT}`;
  const subAccountId = process.env.SUB_ACCOUNT_ID;
  const port = process.env.PORT || 3000;

  const response = await fetch(checkoutEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Sub-Account": subAccountId,
    },
    body: JSON.stringify({ amount: 1799, description: "QR Code Demo", origin_url: `localhost:${port}` }),
  });

  const json = await response.json();
  if (!json.data) {
    throw new Error(`Checkout creation failed: ${JSON.stringify(json)}`);
  }
  return json.data;
}

router.get("/", async (req, res) => {
  try {
    const token = await getToken();
    const checkout = await makeCheckout(token);

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>JustiFi Checkout QR Code</title>
          <script type="module" src="/scripts/webcomponents/webcomponents.esm.js"></script>
          <link rel="stylesheet" href="/styles/theme.css">
          <link rel="stylesheet" href="/styles/example.css">
        </head>
        <body class="two-column-layout">
          <div class="column-preview">
            <justifi-checkout-qr-code
              checkout-id="${checkout.id}"
            ></justifi-checkout-qr-code>
          </div>
          <div class="column-output">
            <p><strong>Checkout ID:</strong> ${checkout.id}</p>
            <p><strong>Amount:</strong> $17.99</p>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send(`<pre>${err.message}</pre>`);
  }
});

module.exports = router;

if (require.main === module) {
  startStandaloneServer(router);
}
