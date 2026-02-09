const express = require("express");
const crypto = require("crypto");
const { API_PATHS } = require("../utils/api-paths");
const { getToken, getWebComponentToken } = require("../utils/auth");
const { startStandaloneServer } = require("../utils/standalone-server");

const router = express.Router();

async function createPayment(token) {
  const createPaymentEndpoint = `${process.env.API_ORIGIN}/${API_PATHS.PAYMENTS}`;
  const subAccountId = process.env.SUB_ACCOUNT_ID;

  const requestBody = JSON.stringify({
    amount: 1000,
    currency: "usd",
    capture_strategy: "automatic",
    description: "Test payment for refund example file",
    payment_method: {
      card: {
        name: "Sylvia Fowles",
        number: "4242424242424242",
        verification: "123",
        month: "3",
        year: "2040",
        address_postal_code: "55555",
      },
    },
  });

  const response = await fetch(createPaymentEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "sub-account": subAccountId,
      "Idempotency-Key": crypto.randomUUID(),
    },
    body: requestBody,
  });
  const { id } = await response.json();
  return id;
}

router.get("/", async (req, res) => {
  const subAccountId = process.env.SUB_ACCOUNT_ID;

  const token = await getToken();
  const paymentId = await createPayment(token);
  const webComponentToken = await getWebComponentToken(token, [
    `read:payments:${subAccountId}`,
  ]);

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>JustiFi Payment Transactions List Component</title>
        <script type="module" src="/scripts/webcomponents/webcomponents.esm.js"></script>
        <link rel="stylesheet" href="/styles/theme.css">
        <link rel="stylesheet" href="/styles/example.css">
      </head>
      <body>
        <div class="list-component-wrapper">
          <justifi-payment-transactions-list
            payment-id="${paymentId}"
            auth-token="${webComponentToken}"
          />
        </div>
        <script>
          const justifiPaymentTransactionsList = document.querySelector('justifi-payment-transactions-list');

          justifiPaymentTransactionsList.addEventListener('error-event', (event) => {
            console.log(event);
          });

          justifiPaymentTransactionsList.addEventListener('click-event', (event) => {
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
