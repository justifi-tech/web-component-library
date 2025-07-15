/// <reference path="../jsx.d.ts" />
import { JSXRendererService } from '../server/jsx-renderer';
import { ExampleTemplate } from '../templates/example-template';
import { CheckoutComponent } from '../components/CheckoutComponent';
import { propsManager } from '../utils/props-manager';
import { getSchema } from '../utils/prop-schemas';

export async function createCheckoutExample(
  webComponentToken: string,
  checkoutId: string
) {
  const jsxRenderer = new JSXRendererService();
  const componentName = 'checkout';

  // Register the component schema
  const schema = getSchema(componentName);
  propsManager.registerSchema(componentName, schema);

  // Prefill props with actual server-generated values
  propsManager.prefillProps(componentName, {
    authToken: webComponentToken,
    checkoutId: checkoutId,
  });

  // Get the prefilled props
  const initialProps = propsManager.getProps(componentName);

  // Verify the prefilled values are set
  const checkoutProps = {
    webComponentToken: webComponentToken, // Keep the original prop name for CheckoutComponent
    checkoutId: checkoutId,
    disableBankAccount: false,
    disableCreditCard: false,
    hideCardBillingForm: false,
    hideBankAccountBillingForm: false,
    billingFormFields: {},
    ...initialProps, // Include any other props from the schema
  };

  // Create the component HTML using the existing CheckoutComponent
  const checkoutElement = CheckoutComponent(checkoutProps);

  // Define props configuration for live editing using the new schema system
  const propsConfig = {
    componentName: componentName,
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

  // Define example-specific scripts with live props support
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
        
        // Register the component for live updates
        const componentContainer = document.getElementById('output-pane');
        if (componentContainer) {
          registerLiveComponent('${componentName}', componentContainer, function(newProps) {
            updateCheckoutComponent(newProps);
          });
        }
      });
      
      function writeOutputToPage(event) {
        const outputPane = document.getElementById('output-pane');
        if (outputPane) {
          outputPane.innerHTML = '<code><pre>' + JSON.stringify(event.detail, null, 2) + '</pre></code>';
        }
      }
      
      // Function to update the checkout component with new props
      function updateCheckoutComponent(props) {
        const container = document.getElementById('output-pane');
        if (!container) return;
        
        // Clear the container
        container.innerHTML = '';
        
        // Create new component with updated props
        const newComponent = createCheckoutComponent(props);
        container.appendChild(newComponent);
        
        // Add visual feedback
        container.style.transition = 'box-shadow 0.3s ease';
        container.style.boxShadow = '0 0 10px rgba(0, 123, 255, 0.5)';
        setTimeout(() => {
          container.style.boxShadow = '';
        }, 300);
      }
      
      // Function to create checkout component (simplified for demo)
      function createCheckoutComponent(props) {
        const div = document.createElement('div');
        div.className = 'checkout-component';
        div.innerHTML = \`
          <div class="checkout-container" style="padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h3>Checkout Component</h3>
            <div class="checkout-details">
              <p><strong>Amount:</strong> $\${props.amount || 100}</p>
              <p><strong>Currency:</strong> \${props.currency || 'USD'}</p>
              <p><strong>Description:</strong> \${props.description || 'Sample payment'}</p>
              <p><strong>Show Insurance:</strong> \${props.showInsurance ? 'Yes' : 'No'}</p>
              <p><strong>Theme:</strong> \${props.theme || 'light'}</p>
            </div>
            \${props.showInsurance ? '<div class="insurance-section" style="margin-top: 15px; padding: 10px; background: #f8f9fa;"><p>Insurance options would appear here</p></div>' : ''}
            <button style="margin-top: 15px; padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Process Payment</button>
          </div>
        \`;
        return div;
      }
    `,
  ];

  // Create the example template data
  const templateData = {
    title: 'JustiFi Checkout Example',
    webComponentToken,
    bodyContent: '', // This will be filled by the template
    exampleTitle: 'Checkout Component with Live Props',
    exampleDescription:
      'A complete checkout experience with payment method selection and billing information collection. Features live props editing - change properties in the right panel to see real-time updates.',
    componentElement: checkoutElement,
    propsConfig,
    eventsConfig,
    navigationConfig,
    testButtons,
    exampleScripts,
  };

  // Render the template
  return jsxRenderer.renderTemplate(ExampleTemplate, templateData);
}
