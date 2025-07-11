/// <reference path="../jsx.d.ts" />
import { renderToString } from '../utils/simple-jsx';
import { createExampleServer } from '../server/express-server';
import { BaseTemplate } from '../templates/base-template';
import { API_PATHS } from '../utils/api-paths';
import {
  CheckoutComponent,
  CheckoutData,
} from '../components/CheckoutComponent';

// Load environment variables
require('dotenv').config({ path: '../../.env' });

// Create the JavaScript for the checkout component
function createCheckoutScript(data: CheckoutData): string {
  const { billingFormFields } = data;

  return `
    const justifiCheckout = document.querySelector('justifi-checkout');
    const fillBillingFormButton = document.getElementById('fill-billing-form-button');
    const testValidateButton = document.getElementById('test-validate-button');

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
    
    fillBillingFormButton.addEventListener('click', () => {
      justifiCheckout.fillBillingForm(${JSON.stringify(billingFormFields)});
    });

    testValidateButton.addEventListener('click', async () => {
      const response = await justifiCheckout.validate();
      console.log('Validate response', response);
    });
  `;
}

// Main checkout example handler
async function handleCheckoutExample(req: any, res: any): Promise<void> {
  try {
    const server = req.app.locals['server'];
    const authService = server.getAuthService();

    // Get tokens
    const token = await authService.getAuthToken();

    // Create checkout
    const checkoutEndpoint = `${process.env['API_ORIGIN']}/${API_PATHS.CHECKOUT}`;
    const paymentMethodGroupId = process.env['PAYMENT_METHOD_GROUP_ID'];
    const subAccountId = authService.getSubAccountId();

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

    // Get web component token
    const webComponentToken = await authService.getWebComponentToken(token, [
      `write:checkout:${checkout.id}`,
      `write:tokenize:${subAccountId}`,
    ]);

    // Prepare component data
    const componentData: CheckoutData = {
      checkoutId: checkout.id,
      webComponentToken,
      disableBankAccount: true,
      disableCreditCard: false,
      hideCardBillingForm: true,
      hideBankAccountBillingForm: false,
      billingFormFields: {
        name: 'John Doe',
        address_line1: 'Main St',
        address_line2: 'Apt 1',
        address_city: 'Beverly Hills',
        address_state: 'CA',
        address_postal_code: '90210',
      },
    };

    // Render the template using JSX and convert to HTML string
    const bodyContent = renderToString(CheckoutComponent(componentData));
    const script = createCheckoutScript(componentData);

    const html = BaseTemplate({
      title: 'JustiFi Checkout',
      webComponentToken,
      bodyContent,
      scripts: [script],
    });

    res.send(html);
  } catch (error) {
    console.error('Error in checkout example:', error);
    res.status(500).send('Internal Server Error');
  }
}

// Create and configure the server
const server = createExampleServer();

// Store server instance for route handlers to access
server.getApp().locals['server'] = server;

// Add the checkout route
server.addRoute({
  path: '/',
  handler: handleCheckoutExample,
});

// Start the server
server.start();
