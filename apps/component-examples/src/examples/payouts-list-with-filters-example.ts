/// <reference path="../jsx.d.ts" />
import { renderToString } from '../utils/simple-jsx';
import { createExampleServer } from '../server/express-server';
import { BaseTemplate } from '../templates/base-template';
import {
  PayoutsListWithFiltersComponent,
  PayoutsListWithFiltersData,
} from '../components/PayoutsListWithFiltersComponent';

// Load environment variables
require('dotenv').config({ path: '../../.env' });

// Create the JavaScript for the payouts list with filters component
function createPayoutsListWithFiltersScript(): string {
  return `
    const justifiPayoutsList = document.querySelector('justifi-payouts-list');

    function writeOutputToPage(event) {
      document.getElementById('output-pane').innerHTML = '<code><pre>' + JSON.stringify(event.detail, null, 2) + '</pre></code>';
    }

    justifiPayoutsList.addEventListener('error-event', (event) => {
      console.log(event);
      writeOutputToPage(event);
    });

    justifiPayoutsList.addEventListener('click-event', (event) => {
      console.log(event);
      writeOutputToPage(event);
    });
  `;
}

// Main payouts list with filters example handler
async function handlePayoutsListWithFiltersExample(
  req: any,
  res: any
): Promise<void> {
  try {
    const server = req.app.locals['server'];
    const authService = server.getAuthService();

    // Get tokens
    const token = await authService.getAuthToken();
    const subAccountId = authService.getSubAccountId();

    // Get web component token
    const webComponentToken = await authService.getWebComponentToken(token, [
      `read:payments:${subAccountId}`,
    ]);

    // Prepare component data
    const componentData: PayoutsListWithFiltersData = {
      subAccountId,
      webComponentToken,
    };

    // Render the template using JSX and convert to HTML string
    const bodyContent = renderToString(
      PayoutsListWithFiltersComponent(componentData)
    );
    const script = createPayoutsListWithFiltersScript();

    const html = BaseTemplate({
      title: 'JustiFi Payouts List Component',
      webComponentToken,
      bodyContent,
      scripts: [script],
    });

    res.send(html);
  } catch (error) {
    console.error('Error in payouts list with filters example:', error);
    res.status(500).send('Internal Server Error');
  }
}

// Create and configure the server
const server = createExampleServer();

// Store server instance for route handlers to access
server.getApp().locals['server'] = server;

// Add the payouts list with filters route
server.addRoute({
  path: '/',
  handler: handlePayoutsListWithFiltersExample,
});

// Start the server
server.start();
