/// <reference path="../jsx.d.ts" />
import { renderToString } from '../utils/simple-jsx';
import { createExampleServer } from '../server/express-server';
import { BaseTemplate } from '../templates/base-template';
import {
  PayoutDetailsComponent,
  PayoutDetailsData,
} from '../components/PayoutDetailsComponent';

// Load environment variables
require('dotenv').config({ path: '../../.env' });

// Create the JavaScript for the payout details component
function createPayoutDetailsScript(): string {
  return `
    const justifiPayoutDetails = document.querySelector('justifi-payout-details');

    function writeOutputToPage(event) {
      document.getElementById('output-pane').innerHTML = '<code><pre>' + JSON.stringify(event.detail, null, 2) + '</pre></code>';
    }

    justifiPayoutDetails.addEventListener('error-event', (event) => {
      console.log(event);
      writeOutputToPage(event);
    });
  `;
}

// Main payout details example handler
async function handlePayoutDetailsExample(req: any, res: any): Promise<void> {
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
    const componentData: PayoutDetailsData = {
      payoutId,
      webComponentToken,
    };

    // Render the template using JSX and convert to HTML string
    const bodyContent = renderToString(PayoutDetailsComponent(componentData));
    const script = createPayoutDetailsScript();

    const html = BaseTemplate({
      title: 'JustiFi Payout Details Component',
      webComponentToken,
      bodyContent,
      scripts: [script],
    });

    res.send(html);
  } catch (error) {
    console.error('Error in payout details example:', error);
    res.status(500).send('Internal Server Error');
  }
}

// Create and configure the server
const server = createExampleServer();

// Store server instance for route handlers to access
server.getApp().locals['server'] = server;

// Add the payout details route
server.addRoute({
  path: '/',
  handler: handlePayoutDetailsExample,
});

// Start the server
server.start();
