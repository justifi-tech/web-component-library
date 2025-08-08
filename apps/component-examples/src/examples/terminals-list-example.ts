/// <reference path="../jsx.d.ts" />
import { renderToString } from '../utils/simple-jsx';
import { createExampleServer } from '../server/express-server';
import { BaseTemplate } from '../templates/base-template';
import {
  TerminalsListComponent,
  TerminalsListData,
} from '../components/TerminalsListComponent';

// Load environment variables
require('dotenv').config({ path: '../../.env' });

// Create the JavaScript for the terminals list component
function createTerminalsListScript(): string {
  return `
    const justifiTerminalsList = document.querySelector('justifi-terminals-list');

    function writeOutputToPage(event) {
      document.getElementById('output-pane').innerHTML = '<code><pre>' + JSON.stringify(event.detail, null, 2) + '</pre></code>';
    }

    justifiTerminalsList.addEventListener('error-event', (event) => {
      console.log(event);
      writeOutputToPage(event);
    });

    justifiTerminalsList.addEventListener('click-event', (event) => {
      console.log(event);
      writeOutputToPage(event);
    });
  `;
}

// Main terminals list example handler
async function handleTerminalsListExample(req: any, res: any): Promise<void> {
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
    const componentData: TerminalsListData = {
      subAccountId,
      webComponentToken,
    };

    // Render the template using JSX and convert to HTML string
    const bodyContent = renderToString(TerminalsListComponent(componentData));
    const script = createTerminalsListScript();

    const html = BaseTemplate({
      title: 'JustiFi Terminals List Component',
      webComponentToken,
      bodyContent,
      scripts: [script],
    });

    res.send(html);
  } catch (error) {
    console.error('Error in terminals list example:', error);
    res.status(500).send('Internal Server Error');
  }
}

// Create and configure the server
const server = createExampleServer();

// Store server instance for route handlers to access
server.getApp().locals['server'] = server;

// Add the terminals list route
server.addRoute({
  path: '/',
  handler: handleTerminalsListExample,
});

// Start the server
server.start();
