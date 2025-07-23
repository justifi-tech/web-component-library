/// <reference path="../jsx.d.ts" />
import { renderToString } from '../utils/simple-jsx';
import { createExampleServer } from '../server/express-server';
import { BaseTemplate } from '../templates/base-template';
import { API_PATHS } from '../utils/api-paths';
import {
  BusinessFormComponent,
  BusinessFormData,
} from '../components/BusinessFormComponent';

// Load environment variables
require('dotenv').config({ path: '../../.env' });

// Generate random business name (simplified version)
function generateRandomLegalName(): string {
  const prefixes = ['Acme', 'Global', 'Tech', 'Innovation', 'Dynamic', 'Elite'];
  const suffixes = ['Corp', 'Inc', 'LLC', 'Enterprises', 'Solutions', 'Group'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  return `${prefix} ${suffix}`;
}

// Create the JavaScript for the business form component
function createBusinessFormScript(): string {
  return `
    const justifiBusinessForm = document.querySelector('justifi-business-form');

    justifiBusinessForm.addEventListener('submit-event', (event) => {
      console.log('Submit event:', event);
      document.getElementById('output-pane').innerHTML = '<code><pre>' + JSON.stringify(event.detail, null, 2) + '</pre></code>';
    });

    justifiBusinessForm.addEventListener('click-event', (event) => {
      console.log('Click event:', event);
    });
    
    justifiBusinessForm.addEventListener('error-event', (event) => {
      console.log('Error event:', event);
      document.getElementById('output-pane').innerHTML = '<code><pre style="color: red;">' + JSON.stringify(event.detail, null, 2) + '</pre></code>';
    });
  `;
}

// Main business form example handler
async function handleBusinessFormExample(req: any, res: any): Promise<void> {
  try {
    const server = req.app.locals['server'];
    const authService = server.getAuthService();

    const token = await authService.getAuthToken();

    const businessEndpoint = `${authService.getApiOrigin()}/${API_PATHS.BUSINESS}`;
    const randomLegalName = generateRandomLegalName();

    const businessResponse = await fetch(businessEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        legal_name: randomLegalName,
      }),
    });

    if (!businessResponse.ok) {
      throw new Error(`Business creation failed: ${businessResponse.status}`);
    }

    const businessData = await businessResponse.json();
    const businessId = businessData.id;

    const webComponentToken = await authService.getWebComponentToken(token, [
      `write:business:${businessId}`,
    ]);

    // Prepare component data
    const componentData: BusinessFormData = {
      businessId,
      webComponentToken,
    };

    // Render the template using JSX and convert to HTML string
    const bodyContent = renderToString(BusinessFormComponent(componentData));
    const script = createBusinessFormScript();

    const html = BaseTemplate({
      title: 'JustiFi Business Form Component',
      webComponentToken,
      bodyContent,
      scripts: [script],
    });

    res.send(html);
  } catch (error) {
    console.error('Error in business form example:', error);
    res.status(500).send('Internal Server Error');
  }
}

// Create and configure the server
const server = createExampleServer();

// Store server instance for route handlers to access
server.getApp().locals['server'] = server;

// Add the business form route
server.addRoute({
  path: '/',
  handler: handleBusinessFormExample,
});

// Start the server
server.start();
