/// <reference path="../jsx.d.ts" />
import { renderToString } from '../utils/simple-jsx';
import { createExampleServer } from '../server/express-server';
import { BaseTemplate } from '../templates/base-template';
import {
  TokenizePaymentMethodComponent,
  TokenizePaymentMethodData,
  BillingFormFields,
} from '../components/TokenizePaymentMethodComponent';

// Load environment variables
require('dotenv').config({ path: '../../.env' });

// Create the JavaScript for the tokenize payment method component
function createTokenizePaymentMethodScript(
  billingFormFields: BillingFormFields
): string {
  return `
    const justifiTokenizePaymentMethod = document.querySelector('justifi-tokenize-payment-method');
    const fillBillingFormButton = document.getElementById('fill-billing-form-button');
    const testValidateButton = document.getElementById('test-validate-button');
    const testSubmitButton = document.getElementById('test-submit-button');

    function writeOutputToPage(event) {
      document.getElementById('output-pane').innerHTML = '<code><pre>' + JSON.stringify(event.detail, null, 2) + '</pre></code>';
    }

    justifiTokenizePaymentMethod.addEventListener('submit-event', (event) => {
      console.log('submit-event', event);

      if (event.detail.response.token) {
        console.log('Token from submit-event', event.detail.response.token);
      }

      if (event.detail.response.error) {
        console.log('Error from submit-event', event.detail.response.error);
      }
      writeOutputToPage(event);
    });

    justifiTokenizePaymentMethod.addEventListener('error-event', (event) => {
      console.log('Error-event', event);
      writeOutputToPage(event);
    });

    fillBillingFormButton.addEventListener('click', () => {
      justifiTokenizePaymentMethod.fillBillingForm(${JSON.stringify(billingFormFields)});
    });

    testSubmitButton.addEventListener('click', async () => {
      const response = await justifiTokenizePaymentMethod.tokenizePaymentMethod();
      if (response.token) {
        console.log('Token from tokenize method', response.token);
      }
      
      if (response.error) {
        console.log('Error from tokenize method', response.error);
      }
    });
  
    testValidateButton.addEventListener('click', async () => {
      const response = await justifiTokenizePaymentMethod.validate();
      console.log('Validate response', response);
    });
  `;
}

// Main tokenize payment method example handler
async function handleTokenizePaymentMethodExample(
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
      `write:tokenize:${subAccountId}`,
    ]);

    // Configuration options
    const disableBankAccount = false;
    const disableCreditCard = false;
    const hideCardBillingForm = false;
    const hideBankAccountBillingForm = false;
    const hideSubmitButton = false;

    // Billing form fields
    const billingFormFields: BillingFormFields = {
      name: 'John Doe',
      address_line1: 'Main St',
      address_line2: 'Apt 1',
      address_city: 'Beverly Hills',
      address_state: 'CA',
      address_postal_code: '90210',
    };

    // Prepare component data
    const componentData: TokenizePaymentMethodData = {
      subAccountId,
      webComponentToken,
      disableBankAccount,
      disableCreditCard,
      hideCardBillingForm,
      hideBankAccountBillingForm,
      hideSubmitButton,
      billingFormFields,
    };

    // Render the template using JSX and convert to HTML string
    const bodyContent = renderToString(
      TokenizePaymentMethodComponent(componentData)
    );
    const script = createTokenizePaymentMethodScript(billingFormFields);

    const html = BaseTemplate({
      title: 'JustiFi TokenizePaymentMethod',
      webComponentToken,
      bodyContent,
      scripts: [script],
    });

    res.send(html);
  } catch (error) {
    console.error('Error in tokenize payment method example:', error);
    res.status(500).send('Internal Server Error');
  }
}

// Create and configure the server
const server = createExampleServer();

// Store server instance for route handlers to access
server.getApp().locals['server'] = server;

// Add the tokenize payment method route
server.addRoute({
  path: '/',
  handler: handleTokenizePaymentMethodExample,
});

// Start the server
server.start();
