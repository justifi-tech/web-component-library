/// <reference path="../jsx.d.ts" />
import { renderToString } from '../utils/simple-jsx';
import { createExampleServer } from '../server/express-server';
import { BaseTemplate } from '../templates/base-template';
import { API_PATHS } from '../utils/api-paths';
import {
  PaymentProvisioningComponent,
  PaymentProvisioningData,
} from '../components/PaymentProvisioningComponent';

// Load environment variables
require('dotenv').config({ path: '../../.env' });

// Import the random business name generator
const {
  generateRandomLegalName,
} = require('../../utils/random-business-names');

// Create the JavaScript for the payment provisioning component
function createPaymentProvisioningScript(): string {
  return `
    const justifiPaymentProvisioning = document.querySelector('justifi-payment-provisioning');

    function writeOutputToPage(event) {
      document.getElementById('output-pane').innerHTML = '<code><pre>' + JSON.stringify(event.detail, null, 2) + '</pre></code>';
    }

    justifiPaymentProvisioning.addEventListener('submit-event', (event) => {
      console.log(event);
      writeOutputToPage(event);
    });

    justifiPaymentProvisioning.addEventListener('complete-form-step-event', (event) => {
      console.log(event);
      writeOutputToPage(event);
    });

    justifiPaymentProvisioning.addEventListener('click-event', (event) => {
      console.log(event);
      writeOutputToPage(event);
    });
    
    justifiPaymentProvisioning.addEventListener('error-event', (event) => {
      console.log(event);
      writeOutputToPage(event);
    });
  `;
}

// Create a business for the payment provisioning example
async function createBusiness(
  token: string,
  apiOrigin: string
): Promise<string> {
  const randomLegalName = generateRandomLegalName();
  const businessEndpoint = `${apiOrigin}/${API_PATHS.BUSINESS}`;

  const response = await fetch(businessEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      legal_name: randomLegalName,
    }),
  });

  if (!response.ok) {
    throw new Error(`Business creation failed: ${response.status}`);
  }

  const res = await response.json();

  if (!res.id) {
    throw new Error('Business creation failed: no business ID returned');
  }

  return res.id;
}

// Main payment provisioning example handler
async function handlePaymentProvisioningExample(
  req: any,
  res: any
): Promise<void> {
  try {
    const server = req.app.locals['server'];
    const authService = server.getAuthService();

    // Get tokens
    const token = await authService.getAuthToken();
    const apiOrigin = authService.getApiOrigin();

    // Create a business for this example
    const businessId = await createBusiness(token, apiOrigin);

    // Get web component token
    const webComponentToken = await authService.getWebComponentToken(token, [
      `write:business:${businessId}`,
    ]);

    // Prepare component data
    const componentData: PaymentProvisioningData = {
      businessId,
      webComponentToken,
    };

    // Render the template using JSX and convert to HTML string
    const bodyContent = renderToString(
      PaymentProvisioningComponent(componentData)
    );
    const script = createPaymentProvisioningScript();

    const html = BaseTemplate({
      title: 'JustiFi Payment Provisioning Component',
      webComponentToken,
      bodyContent,
      scripts: [script],
    });

    res.send(html);
  } catch (error) {
    console.error('Error in payment provisioning example:', error);
    res.status(500).send('Internal Server Error');
  }
}

// Create and configure the server
const server = createExampleServer();

// Store server instance for route handlers to access
server.getApp().locals['server'] = server;

// Add the payment provisioning route
server.addRoute({
  path: '/',
  handler: handlePaymentProvisioningExample,
});

// Start the server
server.start();
