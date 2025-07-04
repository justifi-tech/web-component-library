/// <reference path="../jsx.d.ts" />
import { renderToString } from '../utils/simple-jsx';
import { createExampleServer } from '../server/express-server';
import { BaseTemplate } from '../templates/base-template';
import { API_PATHS } from '../utils/api-paths';
import {
  CheckoutWithInsuranceComponent,
  CheckoutWithInsuranceData,
  InsuranceData,
} from '../components/CheckoutWithInsuranceComponent';

// Load environment variables
require('dotenv').config({ path: '../../.env' });

// Create the JavaScript for the checkout with insurance component
function createCheckoutWithInsuranceScript(): string {
  return `
    const justifiCheckout = document.querySelector('justifi-checkout');

    function writeOutputToPage(event) {
      document.getElementById('output-pane').innerHTML = '<code><pre>' + JSON.stringify(event.detail, null, 2) + '</pre></code>';
    }

    justifiCheckout.addEventListener('submit-event', (event) => {
      console.log(event);
      writeOutputToPage(event);
    });

    justifiCheckout.addEventListener('error-event', (event) => {
      console.log(event);
      writeOutputToPage(event);
    });
  `;
}

// Main checkout with insurance example handler
async function handleCheckoutWithInsuranceExample(
  req: any,
  res: any
): Promise<void> {
  try {
    const server = req.app.locals['server'];
    const authService = server.getAuthService();

    // Get tokens
    const token = await authService.getAuthToken();

    // Create checkout
    const checkoutEndpoint = `${authService.getApiOrigin()}/${API_PATHS.CHECKOUT}`;
    const paymentMethodGroupId = process.env[
      'PAYMENT_METHOD_GROUP_ID'
    ] as string;
    const subAccountId = authService.getSubAccountId();

    if (!paymentMethodGroupId) {
      throw new Error('PAYMENT_METHOD_ID environment variable is required');
    }

    const checkoutResponse = await fetch(checkoutEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'Sub-Account': subAccountId,
      },
      body: JSON.stringify({
        amount: 1799,
        description: 'One Chocolate Donut',
        payment_method_group_id: paymentMethodGroupId,
        origin_url: `localhost:${process.env['PORT'] || 3000}`,
      }),
    });

    if (!checkoutResponse.ok) {
      throw new Error(`Checkout creation failed: ${checkoutResponse.status}`);
    }

    const checkoutData = await checkoutResponse.json();
    const checkout = checkoutData.data;

    if (!checkout?.id) {
      throw new Error('Checkout creation failed: no checkout ID returned');
    }

    // Get web component token
    const webComponentToken = await authService.getWebComponentToken(token, [
      `write:checkout:${checkout.id}`,
      `write:tokenize:${subAccountId}`,
    ]);

    // Prepare insurance data
    const startDate = new Date();
    const startDateString = startDate.toISOString().split('T')[0];

    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1);
    const endDateString = endDate.toISOString().split('T')[0];

    const insurance: InsuranceData = {
      primary_identity: {
        state: 'MN',
        email: 'test@justifi.tech',
        first_name: 'John',
        last_name: 'Doe',
        postal_code: '55401',
        country: 'US',
      },
      policy_attributes: {
        insurable_amount: 1000,
        start_date: startDateString,
        end_date: endDateString,
        covered_identity: {
          first_name: 'John',
          last_name: 'Doe',
        },
      },
    };

    // Prepare component data
    const componentData: CheckoutWithInsuranceData = {
      checkoutId: checkout.id,
      webComponentToken,
      insurance,
    };

    // Render the template using JSX and convert to HTML string
    const bodyContent = renderToString(
      CheckoutWithInsuranceComponent(componentData)
    );
    const script = createCheckoutWithInsuranceScript();

    const html = BaseTemplate({
      title: 'JustiFi Checkout with Insurance',
      webComponentToken,
      bodyContent,
      scripts: [script],
    });

    res.send(html);
  } catch (error) {
    console.error('Error in checkout with insurance example:', error);
    res.status(500).send('Internal Server Error');
  }
}

// Create and configure the server
const server = createExampleServer();

// Store server instance for route handlers to access
server.getApp().locals['server'] = server;

// Add the checkout with insurance route
server.addRoute({
  path: '/',
  handler: handleCheckoutWithInsuranceExample,
});

// Start the server
server.start();
