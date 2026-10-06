const express = require("express");
const crypto = require("crypto");
const { API_PATHS } = require("../utils/api-paths");
const { getToken, getWebComponentToken } = require("../utils/auth");
const { startStandaloneServer } = require("../utils/standalone-server");

const router = express.Router();

// For the first few seconds of a payment's life the API rejects refunds with
// `payment_not_available_for_refund` ("The payment is still being processed,
// please try again later"). Nothing on the payment resource exposes this window
// — status is already `succeeded`, `captured` is true and `amount_refundable` is
// the full amount — and capturing manually doesn't shorten it, so elapsed time
// is the only signal available. Rejections have been observed up to ~6s after
// creation. Keep this comfortably above that but well under Playwright's 30s
// navigation timeout, since the page response blocks on it.
const REFUND_READY_AGE_MS = 12000;

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

async function waitUntilRefundable(paymentCreatedAt) {
  const remainingMs = REFUND_READY_AGE_MS - (Date.now() - paymentCreatedAt);
  if (remainingMs <= 0) return;

  await new Promise((resolve) => setTimeout(resolve, remainingMs));
}

router.get("/", async (req, res) => {
  const subAccountId = process.env.SUB_ACCOUNT_ID;

  const token = await getToken();
  const paymentId = await createPayment(token);
  const paymentCreatedAt = Date.now();
  const webComponentToken = await getWebComponentToken(token, [
    `write:account:${subAccountId}`,
  ]);
  await waitUntilRefundable(paymentCreatedAt);

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
