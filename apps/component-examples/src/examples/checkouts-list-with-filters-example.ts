/// <reference path="../jsx.d.ts" />
import { renderToString } from '../utils/simple-jsx';
import { createExampleServer } from '../server/express-server';
import { BaseTemplate } from '../templates/base-template';
import {
  CheckoutsListWithFiltersComponent,
  CheckoutsListWithFiltersData,
} from '../components/CheckoutsListWithFiltersComponent';

// Load environment variables
require('dotenv').config({ path: '../../.env' });

// Create the JavaScript for the checkouts list with filters component
function createCheckoutsListWithFiltersScript(): string {
  return `
    const justifiCheckoutsList = document.querySelector('justifi-checkouts-list');

    function writeOutputToPage(event) {
      document.getElementById('output-pane').innerHTML = '<code><pre>' + JSON.stringify(event.detail, null, 2) + '</pre></code>';
    }

    justifiCheckoutsList.addEventListener('error-event', (event) => {
      console.log(event);
      writeOutputToPage(event);
    });

    justifiCheckoutsList.addEventListener('click-event', (event) => {
      console.log(event);
      writeOutputToPage(event);
    });
  `;
}

// Main checkouts list with filters example handler
async function handleCheckoutsListWithFiltersExample(
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
      `read:account:${subAccountId}`,
    ]);

    // Prepare component data
    const componentData: CheckoutsListWithFiltersData = {
      subAccountId,
      webComponentToken,
    };

    // Render the template using JSX and convert to HTML string
    const bodyContent = renderToString(
      CheckoutsListWithFiltersComponent(componentData)
    );
    const script = createCheckoutsListWithFiltersScript();

    const html = BaseTemplate({
      title: 'JustiFi Checkouts List Component',
      webComponentToken,
      bodyContent,
      scripts: [script],
    });

    res.send(html);
  } catch (error) {
    console.error('Error in checkouts list with filters example:', error);
    res.status(500).send('Internal Server Error');
  }
}

// Create and configure the server
const server = createExampleServer();

// Store server instance for route handlers to access
server.getApp().locals['server'] = server;

// Add the checkouts list with filters route
server.addRoute({
  path: '/',
  handler: handleCheckoutsListWithFiltersExample,
});

// Start the server
server.start();
