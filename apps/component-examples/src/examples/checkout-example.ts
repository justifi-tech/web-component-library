/// <reference path="../jsx.d.ts" />
import { JSXRendererService } from '../server/jsx-renderer';
import { ExampleTemplate } from '../templates/example-template';
import { CheckoutComponent } from '../components/CheckoutComponent';
import { BaseTemplate } from '../templates/base-template';

export async function createCheckoutExample(
  webComponentToken: string,
  checkoutId: string
) {
  const jsxRenderer = new JSXRendererService();

  // Create the component HTML using the existing CheckoutComponent
  const checkoutElement = CheckoutComponent({
    checkoutId,
    webComponentToken,
    disableBankAccount: false,
    disableCreditCard: false,
    hideCardBillingForm: false,
    hideBankAccountBillingForm: false,
    billingFormFields: {},
  });

  console.log('checkoutElement', checkoutElement);

  const componentHtml = jsxRenderer.renderTemplate(CheckoutComponent, {
    title: 'Checkout Component',
    webComponentToken,
    checkoutId,
    disableBankAccount: false,
    disableCreditCard: false,
    hideCardBillingForm: false,
    hideBankAccountBillingForm: false,
    billingFormFields: {},
  });

  // Define props configuration for live editing
  const propsConfig = {
    props: [
      {
        name: 'checkoutId',
        type: 'string' as const,
        label: 'Checkout ID',
        value: checkoutId,
        description: 'The unique identifier for this checkout session',
      },
      {
        name: 'disableBankAccount',
        type: 'boolean' as const,
        label: 'Disable Bank Account',
        value: false,
        description: 'Hide bank account payment option',
      },
      {
        name: 'disableCreditCard',
        type: 'boolean' as const,
        label: 'Disable Credit Card',
        value: false,
        description: 'Hide credit card payment option',
      },
      {
        name: 'hideCardBillingForm',
        type: 'boolean' as const,
        label: 'Hide Card Billing Form',
        value: false,
        description: 'Hide billing form for credit card payments',
      },
      {
        name: 'hideBankAccountBillingForm',
        type: 'boolean' as const,
        label: 'Hide Bank Account Billing Form',
        value: false,
        description: 'Hide billing form for bank account payments',
      },
    ],
  };

  // Define events configuration
  const eventsConfig = {
    eventTypes: [
      'submit-event',
      'error-event',
      'validation-event',
      'payment-method-selected',
      'billing-form-updated',
    ],
    maxEvents: 50,
  };

  // Define navigation configuration
  const navigationConfig = {
    items: [
      {
        id: 'checkout',
        title: 'Checkout',
        description: 'Basic checkout component',
        category: 'Payment',
        url: '/checkout',
        isActive: true,
      },
      {
        id: 'checkout-with-insurance',
        title: 'Checkout with Insurance',
        description: 'Checkout with season interruption insurance',
        category: 'Payment',
        url: '/checkout-with-insurance',
        isActive: false,
      },
      {
        id: 'business-details',
        title: 'Business Details',
        description: 'Business information display',
        category: 'Business',
        url: '/business-details',
        isActive: false,
      },
    ],
  };

  // Define test buttons
  const testButtons = [
    {
      id: 'fill-billing-form-button',
      text: 'Test Fill Billing Form',
      hidden: true,
    },
    {
      id: 'test-validate-button',
      text: 'Test Validate',
      hidden: true,
    },
  ];

  // Define example-specific scripts
  const exampleScripts = [
    `
      // Example-specific event handlers
      document.addEventListener('DOMContentLoaded', function() {
        const checkout = document.querySelector('justifi-checkout');
        
        if (checkout) {
          checkout.addEventListener('submit-event', function(event) {
            logEvent('submit-event', 'justifi-checkout', event.detail, 'success');
            writeOutputToPage(event);
          });
          
          checkout.addEventListener('error-event', function(event) {
            logEvent('error-event', 'justifi-checkout', event.detail, 'error');
            writeOutputToPage(event);
          });
          
          checkout.addEventListener('validation-event', function(event) {
            logEvent('validation-event', 'justifi-checkout', event.detail, 'info');
          });
        }
      });
      
      function writeOutputToPage(event) {
        const outputPane = document.getElementById('output-pane');
        if (outputPane) {
          outputPane.innerHTML = '<code><pre>' + JSON.stringify(event.detail, null, 2) + '</pre></code>';
        }
      }
    `,
  ];

  // Create the example template data
  const templateData = {
    title: 'JustiFi Checkout Example',
    webComponentToken,
    exampleTitle: 'Checkout Component',
    exampleDescription:
      'A complete checkout experience with payment method selection and billing information collection.',
    componentHtml,
    propsConfig,
    eventsConfig,
    navigationConfig,
    testButtons,
    exampleScripts,
  };

  // Render the template
  return jsxRenderer.renderTemplate(ExampleTemplate, templateData);
}
