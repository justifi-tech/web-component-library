/// <reference path="../jsx.d.ts" />
import { renderToString } from '../utils/simple-jsx';
import { createExampleServer } from '../server/express-server';
import { BaseTemplate } from '../templates/base-template';
import { DisputeComponent, DisputeData } from '../components/DisputeComponent';

// Load environment variables
require('dotenv').config({ path: '../../.env' });

// Create the JavaScript for the dispute component
function createDisputeScript(): string {
  return `
    const justifiDisputeManagement = document.querySelector('justifi-dispute-management');

    function writeOutputToPage(event) {
      document.getElementById('output-pane').innerHTML = '<code><pre>' + JSON.stringify(event.detail, null, 2) + '</pre></code>';
    }

    justifiDisputeManagement.addEventListener('submit-event', (event) => {
      console.log(event);
      writeOutputToPage(event);
    });

    justifiDisputeManagement.addEventListener('complete-form-step-event', (event) => {
      console.log(event);
      writeOutputToPage(event);
    });

    justifiDisputeManagement.addEventListener('click-event', (event) => {
      console.log(event);
      writeOutputToPage(event);
    });
    
    justifiDisputeManagement.addEventListener('error-event', (event) => {
      console.log(event);
      writeOutputToPage(event);
    });
  `;
}

// Main dispute example handler
async function handleDisputeExample(req: any, res: any): Promise<void> {
  try {
    const server = req.app.locals['server'];
    const authService = server.getAuthService();

    // Get tokens
    const token = await authService.getAuthToken();
    const disputeId = process.env['DISPUTE_ID'] as string;

    if (!disputeId) {
      throw new Error('DISPUTE_ID environment variable is required');
    }

    // Get web component token
    const webComponentToken = await authService.getWebComponentToken(token, [
      `write:dispute:${disputeId}`,
    ]);

    // Prepare component data
    const componentData: DisputeData = {
      disputeId,
      webComponentToken,
    };

    // Render the template using JSX and convert to HTML string
    const bodyContent = renderToString(DisputeComponent(componentData));
    const script = createDisputeScript();

    const html = BaseTemplate({
      title: 'JustiFi Dispute Component',
      webComponentToken,
      bodyContent,
      scripts: [script],
    });

    res.send(html);
  } catch (error) {
    console.error('Error in dispute example:', error);
    res.status(500).send('Internal Server Error');
  }
}

// Create and configure the server
const server = createExampleServer();

// Store server instance for route handlers to access
server.getApp().locals['server'] = server;

// Add the dispute route
server.addRoute({
  path: '/',
  handler: handleDisputeExample,
});

// Start the server
server.start();
