/// <reference path="../jsx.d.ts" />
import { renderToString } from '../utils/simple-jsx';
import { createExampleServer } from '../server/express-server';
import { BaseTemplate } from '../templates/base-template';
import {
  TerminalOrdersListWithFiltersComponent,
  TerminalOrdersListWithFiltersData,
} from '../components/TerminalOrdersListWithFiltersComponent';

// Load environment variables
require('dotenv').config({ path: '../../.env' });

// Create the JavaScript for the terminal orders list with filters component
function createTerminalOrdersListWithFiltersScript(): string {
  return `
    const justifiTerminalOrdersList = document.querySelector('justifi-terminal-orders-list');

    function writeOutputToPage(event) {
      document.getElementById('output-pane').innerHTML = '<code><pre>' + JSON.stringify(event.detail, null, 2) + '</pre></code>';
    }

    justifiTerminalOrdersList.addEventListener('error-event', (event) => {
      console.log(event);
      writeOutputToPage(event);
    });

    justifiTerminalOrdersList.addEventListener('click-event', (event) => {
      console.log(event);
      writeOutputToPage(event);
    });
  `;
}

// Main terminal orders list with filters example handler
async function handleTerminalOrdersListWithFiltersExample(
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
      `write:account:${subAccountId}`,
    ]);

    // Prepare component data
    const componentData: TerminalOrdersListWithFiltersData = {
      subAccountId,
      webComponentToken,
    };

    // Render the template using JSX and convert to HTML string
    const bodyContent = renderToString(
      TerminalOrdersListWithFiltersComponent(componentData)
    );
    const script = createTerminalOrdersListWithFiltersScript();

    const html = BaseTemplate({
      title: 'JustiFi Terminal Orders List Component',
      webComponentToken,
      bodyContent,
      scripts: [script],
    });

    res.send(html);
  } catch (error) {
    console.error('Error in terminal orders list with filters example:', error);
    res.status(500).send('Internal Server Error');
  }
}

// Create and configure the server
const server = createExampleServer();

// Store server instance for route handlers to access
server.getApp().locals['server'] = server;

// Add the terminal orders list with filters route
server.addRoute({
  path: '/',
  handler: handleTerminalOrdersListWithFiltersExample,
});

// Start the server
server.start();
