/// <reference path="../jsx.d.ts" />
import { renderToString } from '../utils/simple-jsx';
import { createExampleServer } from '../server/express-server';
import { BaseTemplate } from '../templates/base-template';
import {
  OrderTerminalsComponent,
  OrderTerminalsData,
} from '../components/OrderTerminalsComponent';

// Load environment variables
require('dotenv').config({ path: '../../.env' });

// Create the JavaScript for the order terminals component
function createOrderTerminalsScript(): string {
  return `
    function writeOutputToPage(event) {
      document.getElementById('output-pane').innerHTML = '<code><pre>' + JSON.stringify(event.detail, null, 2) + '</pre></code>';
    }

    document.addEventListener('submit-event', (event) => {
      console.log('submit-event', event.detail);
      writeOutputToPage(event);
    });

    document.addEventListener('error-event', (event) => {
      console.log('error-event', event.detail);
      writeOutputToPage(event);
    });
  `;
}

// Main order terminals example handler
async function handleOrderTerminalsExample(req: any, res: any): Promise<void> {
  try {
    const server = req.app.locals['server'];
    const authService = server.getAuthService();

    // Get tokens
    const token = await authService.getAuthToken();
    const businessId = process.env['BUSINESS_ID'] as string;
    const accountId = authService.getSubAccountId();

    if (!businessId) {
      throw new Error('BUSINESS_ID environment variable is required');
    }

    // Get web component token
    const webComponentToken = await authService.getWebComponentToken(token, [
      `read:business:${businessId}`,
      `write:account:${accountId}`,
    ]);

    // Prepare component data
    const componentData: OrderTerminalsData = {
      accountId,
      businessId,
      webComponentToken,
      shipping: true,
    };

    // Render the template using JSX and convert to HTML string
    const bodyContent = renderToString(OrderTerminalsComponent(componentData));
    const script = createOrderTerminalsScript();

    const html = BaseTemplate({
      title: 'Order Terminals Example',
      webComponentToken,
      bodyContent,
      scripts: [script],
    });

    res.send(html);
  } catch (error) {
    console.error('Error in order terminals example:', error);
    res.status(500).send('Internal Server Error');
  }
}

// Create and configure the server
const server = createExampleServer();

// Store server instance for route handlers to access
server.getApp().locals['server'] = server;

// Add the order terminals route
server.addRoute({
  path: '/',
  handler: handleOrderTerminalsExample,
});

// Start the server
server.start();
