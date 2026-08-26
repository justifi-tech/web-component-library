const express = require("express");
const crypto = require("crypto");
const { API_PATHS } = require("../utils/api-paths");
const { getToken, getWebComponentToken } = require("../utils/auth");
const { startStandaloneServer } = require("../utils/standalone-server");

const router = express.Router();

const PAYMENT_READY_POLL_INTERVAL_MS = 500;
const PAYMENT_READY_MAX_ATTEMPTS = 30;

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

// The API rejects both void and refund with "The payment is still being
// processed, please try again later" while a payment sits in `pending`, so the
// page must not render until the payment settles.
async function waitForPaymentToSettle(token, paymentId) {
  const endpoint = `${process.env.API_ORIGIN}/${API_PATHS.PAYMENTS}/${paymentId}`;
  const subAccountId = process.env.SUB_ACCOUNT_ID;

  for (let attempt = 0; attempt < PAYMENT_READY_MAX_ATTEMPTS; attempt++) {
    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
        "sub-account": subAccountId,
      },
    });
    const { data } = await response.json();

    if (data && data.status !== "pending") {
      return;
    }

    await new Promise((resolve) =>
      setTimeout(resolve, PAYMENT_READY_POLL_INTERVAL_MS),
    );
  }

  console.warn(
    `Payment ${paymentId} still pending after ${PAYMENT_READY_MAX_ATTEMPTS * PAYMENT_READY_POLL_INTERVAL_MS}ms; rendering anyway`,
  );
}

router.get("/", async (req, res) => {
  const subAccountId = process.env.SUB_ACCOUNT_ID;

  const token = await getToken();
  const paymentId = await createPayment(token);
  await waitForPaymentToSettle(token, paymentId);
  const webComponentToken = await getWebComponentToken(token, [
    `write:account:${subAccountId}`,
  ]);

  const hideSubmitButton = false;

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>JustiFi Refund Payment Component</title>
        <script type="module" src="/scripts/webcomponents/webcomponents.esm.js"></script>
        <link rel="stylesheet" href="/styles/theme.css">
        <link rel="stylesheet" href="/styles/example.css">
      </head>
      <body class="two-column-layout">
        <div class="column-preview">
          <justifi-refund-payment
            payment-id="${paymentId}"
            account-id="${subAccountId}"
            auth-token="${webComponentToken}"
            hide-submit-button="${hideSubmitButton}"
          >
          </justifi-refund-payment>
          <button id="test-refund-button" ${hideSubmitButton ? "" : 'style="display: none;"'}>Refund</button>
        </div>
        <div class="column-output" id="output-pane">
          <em>Refund output will appear here...</em>
        </div>
      </body>
      <script>
        const justifiRefundPayment = document.querySelector('justifi-refund-payment');
        const testSubmitButton = document.getElementById('test-refund-button');

        function writeOutputToPage(event) {
          document.getElementById('output-pane').innerHTML = '<code><pre>' + JSON.stringify(event.detail, null, 2) + '</pre></code>';
        };

        justifiRefundPayment.addEventListener('error-event', (event) => {
          console.error('[justifi-refund-payment] error-event', event.detail);
          writeOutputToPage(event);
        });

        justifiRefundPayment.addEventListener('submit-event', (event) => {
          console.log('submit-event', event.detail);

          if (event.detail.response.data) {
            console.log('Response data from submit-event', event.detail.response.data);
          }

          if (event.detail.response.error) {
            console.log('Error from submit-event', event.detail.response.error);
          }

          writeOutputToPage(event);
        });

        testSubmitButton.addEventListener('click', async () => {
          const refundData = await justifiRefundPayment.refundPayment();
          console.log('Refund data', refundData);
        });
      </script>
    </html>
  `);
});

module.exports = router;

if (require.main === module) {
  startStandaloneServer(router);
}
