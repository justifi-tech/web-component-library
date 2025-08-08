/// <reference path="../jsx.d.ts" />
import { renderToString } from '../utils/simple-jsx';
import { createExampleServer } from '../server/express-server';
import { BaseTemplate } from '../templates/base-template';
import {
  PaymentDetailsComponent,
  PaymentDetailsData,
} from '../components/PaymentDetailsComponent';

// Load environment variables
require('dotenv').config({ path: '../../.env' });

// Create the JavaScript for the payment details component
function createPaymentDetailsScript(): string {
  return `
    const justifiPaymentDetails = document.querySelector('justifi-payment-details');

    function writeOutputToPage(event) {
      document.getElementById('output-pane').innerHTML = '<code><pre>' + JSON.stringify(event.detail, null, 2) + '</pre></code>';
    }

    justifiPaymentDetails.addEventListener('error-event', (event) => {
      console.log(event);
      writeOutputToPage(event);
    });
  `;
}

// Main payment details example handler
async function handlePaymentDetailsExample(req: any, res: any): Promise<void> {
  try {
    const server = req.app.locals['server'];
    const authService = server.getAuthService();

    // Get tokens
    const token = await authService.getAuthToken();
    const paymentId = process.env['PAYMENT_ID'] as string;
    const subAccountId = authService.getSubAccountId();

    if (!paymentId) {
      throw new Error('PAYMENT_ID environment variable is required');
    }

    // Get web component token
    const webComponentToken = await authService.getWebComponentToken(token, [
      `read:payments:${subAccountId}`,
    ]);

    // Prepare component data
    const componentData: PaymentDetailsData = {
      paymentId,
      webComponentToken,
    };

    // Render the template using JSX and convert to HTML string
    const bodyContent = renderToString(PaymentDetailsComponent(componentData));
    const script = createPaymentDetailsScript();

    const html = BaseTemplate({
      title: 'JustiFi Payment Details Component',
      webComponentToken,
      bodyContent,
      scripts: [script],
    });

    res.send(html);
  } catch (error) {
    console.error('Error in payment details example:', error);
    res.status(500).send('Internal Server Error');
  }
}

// Create and configure the server
const server = createExampleServer();

// Store server instance for route handlers to access
server.getApp().locals['server'] = server;

// Add the payment details route
server.addRoute({
  path: '/',
  handler: handlePaymentDetailsExample,
});

// Start the server
server.start();
