/// <reference path="../jsx.d.ts" />
import { renderToString } from '../utils/simple-jsx';
import { createExampleServer } from '../server/express-server';
import { BaseTemplate } from '../templates/base-template';
import { API_PATHS } from '../utils/api-paths';
import {
  PaymentTransactionsListComponent,
  PaymentTransactionsListData,
} from '../components/PaymentTransactionsListComponent';

// Load environment variables
require('dotenv').config({ path: '../../.env' });

// Import UUID for idempotency key
const { v4: uuidv4 } = require('uuid');

// Create the JavaScript for the payment transactions list component
function createPaymentTransactionsListScript(): string {
  return `
    const justifiPaymentTransactionsList = document.querySelector('justifi-payment-transactions-list');

    function writeOutputToPage(event) {
      document.getElementById('output-pane').innerHTML = '<code><pre>' + JSON.stringify(event.detail, null, 2) + '</pre></code>';
    }

    justifiPaymentTransactionsList.addEventListener('error-event', (event) => {
      console.log(event);
      writeOutputToPage(event);
    });

    justifiPaymentTransactionsList.addEventListener('click-event', (event) => {
      console.log(event);
      writeOutputToPage(event);
    });
  `;
}

// Create a payment for the payment transactions list example
async function createPayment(
  token: string,
  apiOrigin: string,
  subAccountId: string
): Promise<string> {
  const createPaymentEndpoint = `${apiOrigin}/${API_PATHS.PAYMENTS}`;

  const requestBody = JSON.stringify({
    amount: 1000,
    currency: 'usd',
    capture_strategy: 'automatic',
    description: 'Test payment for refund example file',
    payment_method: {
      card: {
        name: 'Sylvia Fowles',
        number: '4242424242424242',
        verification: '123',
        month: '3',
        year: '2040',
        address_postal_code: '55555',
      },
    },
  });

  const response = await fetch(createPaymentEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'sub-account': subAccountId,
      'Idempotency-Key': uuidv4(),
    },
    body: requestBody,
  });

  if (!response.ok) {
    throw new Error(`Payment creation failed: ${response.status}`);
  }

  const { id } = await response.json();

  if (!id) {
    throw new Error('Payment creation failed: no payment ID returned');
  }

  return id;
}

// Main payment transactions list example handler
async function handlePaymentTransactionsListExample(
  req: any,
  res: any
): Promise<void> {
  try {
    const server = req.app.locals['server'];
    const authService = server.getAuthService();

    // Get tokens
    const token = await authService.getAuthToken();
    const apiOrigin = authService.getApiOrigin();
    const subAccountId = authService.getSubAccountId();

    // Create a payment for this example
    const paymentId = await createPayment(token, apiOrigin, subAccountId);

    // Get web component token
    const webComponentToken = await authService.getWebComponentToken(token, [
      `read:payments:${subAccountId}`,
    ]);

    // Prepare component data
    const componentData: PaymentTransactionsListData = {
      paymentId,
      webComponentToken,
    };

    // Render the template using JSX and convert to HTML string
    const bodyContent = renderToString(
      PaymentTransactionsListComponent(componentData)
    );
    const script = createPaymentTransactionsListScript();

    const html = BaseTemplate({
      title: 'JustiFi Payment Transactions List Component',
      webComponentToken,
      bodyContent,
      scripts: [script],
    });

    res.send(html);
  } catch (error) {
    console.error('Error in payment transactions list example:', error);
    res.status(500).send('Internal Server Error');
  }
}

// Create and configure the server
const server = createExampleServer();

// Store server instance for route handlers to access
server.getApp().locals['server'] = server;

// Add the payment transactions list route
server.addRoute({
  path: '/',
  handler: handlePaymentTransactionsListExample,
});

// Start the server
server.start();
