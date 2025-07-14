/// <reference path="../jsx.d.ts" />
import { renderToString } from '../utils/simple-jsx';
import { createExampleServer } from '../server/express-server';
import { BaseTemplate } from '../templates/base-template';
import {
  PayoutTransactionsListComponent,
  PayoutTransactionsListData,
} from '../components/PayoutTransactionsListComponent';

// Load environment variables
require('dotenv').config({ path: '../../.env' });

// Create the JavaScript for the payout transactions list component
function createPayoutTransactionsListScript(): string {
  return `
    const justifiPayoutTransactionsList = document.querySelector('justifi-payout-transactions-list');

    function writeOutputToPage(event) {
      document.getElementById('output-pane').innerHTML = '<code><pre>' + JSON.stringify(event.detail, null, 2) + '</pre></code>';
    }

    justifiPayoutTransactionsList.addEventListener('error-event', (event) => {
      console.log(event);
      writeOutputToPage(event);
    });

    justifiPayoutTransactionsList.addEventListener('click-event', (event) => {
      console.log(event);
      writeOutputToPage(event);
    });
  `;
}

// Main payout transactions list example handler
async function handlePayoutTransactionsListExample(
  req: any,
  res: any
): Promise<void> {
  try {
    const server = req.app.locals['server'];
    const authService = server.getAuthService();

    // Get tokens
    const token = await authService.getAuthToken();
    const payoutId = process.env['PAYOUT_ID'] as string;
    const subAccountId = authService.getSubAccountId();

    if (!payoutId) {
      throw new Error('PAYOUT_ID environment variable is required');
    }

    // Get web component token
    const webComponentToken = await authService.getWebComponentToken(token, [
      `read:payments:${subAccountId}`,
    ]);

    // Prepare component data
    const componentData: PayoutTransactionsListData = {
      payoutId,
      webComponentToken,
    };

    // Render the template using JSX and convert to HTML string
    const bodyContent = renderToString(
      PayoutTransactionsListComponent(componentData)
    );
    const script = createPayoutTransactionsListScript();

    const html = BaseTemplate({
      title: 'JustiFi Payout Transactions List Component',
      webComponentToken,
      bodyContent,
      scripts: [script],
    });

    res.send(html);
  } catch (error) {
    console.error('Error in payout transactions list example:', error);
    res.status(500).send('Internal Server Error');
  }
}

// Create and configure the server
const server = createExampleServer();

// Store server instance for route handlers to access
server.getApp().locals['server'] = server;

// Add the payout transactions list route
server.addRoute({
  path: '/',
  handler: handlePayoutTransactionsListExample,
});

// Start the server
server.start();
