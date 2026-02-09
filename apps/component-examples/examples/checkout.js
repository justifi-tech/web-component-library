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

  let response;
  try {
    response = await fetch(checkoutEndpoint, {
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
  } catch (error) {
    console.log("ERROR:", error);
  }

  const responseJson = await response.json();
  const { data } = responseJson;
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

  const disableBankAccount = false;
  const disableCreditCard = false;
  const hideCardBillingForm = true;
  const hideBankAccountBillingForm = false;

  const billingFormFields = {
    name: "John Doe",
    address_line1: "Main St",
    address_line2: "Apt 1",
    address_city: "Beverly Hills",
    address_state: "CA",
    address_postal_code: "90210",
  };

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>JustiFi Checkout</title>
        <script type="module" src="/scripts/webcomponents/webcomponents.esm.js"></script>
        <link rel="stylesheet" href="/styles/theme.css">
        <link rel="stylesheet" href="/styles/example.css">
      </head>
      <body class="two-column-layout">
        <div class="column-preview">
          <justifi-checkout
            auth-token="${webComponentToken}"
            checkout-id="${checkout.id}"
            disable-bank-account="${disableBankAccount}"
            disable-credit-card="${disableCreditCard}"
            hide-bank-account-billing-form="${hideBankAccountBillingForm}"
            hide-card-billing-form="${hideCardBillingForm}"
          >
          </justifi-checkout>
          <button id="fill-billing-form-button" hidden>Test Fill Billing Form</button>
          <button id="test-validate-button" hidden>Test Validate</button>
        </div>
        <div class="column-output" id="output-pane"><em>Checkout output will appear here...</em></div>
        <div id="checkout-changed-pane" hidden></div>
      </body>
      <script>
        const justifiCheckout = document.querySelector('justifi-checkout');
        const fillBillingFormButton = document.getElementById('fill-billing-form-button');
        const testValidateButton = document.getElementById('test-validate-button');

        function preCompleteHook(state, resolve, reject) {
          resolve(state);
        }

        // Assign function as a DOM property (functions cannot be passed via HTML attributes)
        justifiCheckout.preCompleteHook = preCompleteHook;

        function writeOutputToPage(elementId, event) {
          document.getElementById(elementId).innerHTML = '<code><pre>' + JSON.stringify(event.detail, null, 2) + '</pre></code>';
        }

        justifiCheckout.addEventListener('submit-event', (event) => {
          console.log(event);
          writeOutputToPage('output-pane', event);
        });

        justifiCheckout.addEventListener('error-event', (event) => {
          console.log(event);
          writeOutputToPage('output-pane', event);
        });

        fillBillingFormButton.addEventListener('click', () => {
          justifiCheckout.fillBillingForm(${JSON.stringify(billingFormFields)});
        });

        justifiCheckout.addEventListener('checkout-changed', (event) => {
          console.log('Checkout changed', event);
          writeOutputToPage('checkout-changed-pane', event);
        });

        testValidateButton.addEventListener('click', async () => {
          const response = await justifiCheckout.validate();
          console.log('Validate response', response);
        });
      </script>
    </html>
  `);
});

module.exports = router;

if (require.main === module) {
  startStandaloneServer(router);
}
