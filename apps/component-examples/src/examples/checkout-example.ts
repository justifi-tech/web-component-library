/// <reference path="../jsx.d.ts" />
import { renderToString } from '../utils/simple-jsx';
import { BaseTemplate } from '../templates/base-template';
import { CheckoutComponent } from '../components/CheckoutComponent';
import { ExampleLayout } from '../components/ExampleLayout';
import { ComponentPreview } from '../components/ComponentPreview';
import { PropsEditor } from '../components/PropsEditor';
import { EventLogger } from '../components/EventLogger';
import { NavigationMenu } from '../components/NavigationMenu';

export async function createCheckoutExample(
  webComponentToken: string,
  checkoutId: string
) {
  const componentName = 'checkout';

  // Prefill the props manager with actual values before rendering
  const { propsManager } = await import('../utils/props-manager');
  const { getSchema } = await import('../utils/prop-schemas');

  const schema = getSchema(componentName);
  propsManager.registerSchema(componentName, schema);
  propsManager.prefillProps(componentName, {
    authToken: webComponentToken,
    checkoutId: checkoutId,
    disableBankAccount: false,
    disableCreditCard: false,
    disableBnpl: false,
    disablePaymentMethodGroup: false,
    hideCardBillingForm: false,
    hideBankAccountBillingForm: false,
  });

  // Create the component HTML using the existing CheckoutComponent
  const checkoutProps = {
    webComponentToken: webComponentToken,
    checkoutId: checkoutId,
    disableBankAccount: false,
    disableCreditCard: false,
    hideCardBillingForm: false,
    hideBankAccountBillingForm: false,
    billingFormFields: {},
  };

  const checkoutElement = CheckoutComponent(checkoutProps);

  // Build the component preview content
  const componentPreviewElement = ComponentPreview({
    componentElement: checkoutElement,
    showOutput: true,
    outputId: 'output-pane',
    testButtons: [
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
    ],
  });
  const componentPreviewContent = renderToString(componentPreviewElement);

  // Build the props editor content
  const propsContent = renderToString(
    PropsEditor({
      componentName: componentName,
      onPropsChange: 'updateComponentProps',
    })
  );

  // Build the event logger content
  const eventsContent = renderToString(
    EventLogger({
      events: [], // Will be populated by client-side JavaScript
      maxEvents: 50,
      showFilters: true,
      eventTypes: [
        'submit-event',
        'error-event',
        'validation-event',
        'payment-method-selected',
        'billing-form-updated',
      ],
    })
  );

  // Build the navigation content
  const navigationContent = renderToString(
    NavigationMenu({
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
      showCategories: true,
    })
  );

  // Build the main example layout
  const exampleLayoutElement = ExampleLayout({
    title: 'Checkout Component with Live Props',
    description:
      'A complete checkout experience with payment method selection and billing information collection. Features live props editing - change properties in the right panel to see real-time updates.',
    componentContent: componentPreviewContent,
    propsContent,
    eventsContent,
    navigationContent,
    scripts: [
      `
        // Store original values for fallback
        window.originalAuthToken = '${webComponentToken}';
        window.originalCheckoutId = '${checkoutId}';
        
        // Event logging functionality
        window.eventLog = [];
        window.maxEvents = 50;
        
        function logEvent(eventType, componentName, data, level = 'info') {
          const event = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            eventType,
            componentName,
            data,
            level
          };
          
          window.eventLog.unshift(event);
          if (window.eventLog.length > window.maxEvents) {
            window.eventLog = window.eventLog.slice(0, window.maxEvents);
          }
          
          updateEventDisplay();
        }
        
        function updateEventDisplay() {
          const eventList = document.getElementById('event-list');
          if (!eventList) return;
          
          // This would be updated by client-side JavaScript
          // to reflect the current events in the log
        }
        
        function clearEvents() {
          window.eventLog = [];
          updateEventDisplay();
        }
        
        function exportEvents() {
          const dataStr = JSON.stringify(window.eventLog, null, 2);
          const dataBlob = new Blob([dataStr], {type: 'application/json'});
          const url = URL.createObjectURL(dataBlob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'component-events.json';
          link.click();
        }
        
        // Props management functionality using PropsManager
        function updateProp(componentName, propName, value, type) {
          const propsManager = window.propsManager;
          if (propsManager) {
            propsManager.updateProp(componentName, propName, value, type);

            
            // Trigger live update immediately when prop changes
            const props = propsManager.getProps(componentName);
            const event = new CustomEvent('props-updated', { 
              detail: { componentName, props } 
            });
            document.dispatchEvent(event);
          }
        }
        
        function resetProps(componentName) {
          const propsManager = window.propsManager;
          if (propsManager) {
            propsManager.resetProps(componentName);

            
            // Update form fields to reflect reset values
            const props = propsManager.getProps(componentName);
            Object.entries(props).forEach(([propName, value]) => {
              const field = document.getElementById(\`prop-\${propName}\`);
              if (field) {
                if (field.type === 'checkbox') {
                  field.checked = Boolean(value);
                } else {
                  field.value = value;
                }
              }
            });
            
            // Trigger live update after reset
            const event = new CustomEvent('props-updated', { 
              detail: { componentName, props } 
            });
            document.dispatchEvent(event);
          }
        }

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
          const componentContainer = document.querySelector('.column-preview');
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
          const container = document.querySelector('.column-preview');
          if (!container) return;
          
          // Get the complete props from the props manager to ensure we have all values
          const propsManager = window.propsManager;
          const completeProps = propsManager ? propsManager.getProps('checkout') : props;
          
          // Find the existing checkout component
          const existingCheckout = container.querySelector('justifi-checkout');
          if (existingCheckout) {
            // Remove the existing component
            existingCheckout.remove();
            
            // Create a new component with updated props
            const newCheckout = document.createElement('justifi-checkout');
            
            // Always set the required auth-token and checkout-id attributes
            // Use the values from props manager, fallback to passed props, then to original values
            const authToken = completeProps.authToken || props.authToken || window.originalAuthToken || '';
            const checkoutId = completeProps.checkoutId || props.checkoutId || window.originalCheckoutId || '';
            

            
            // Set required attributes
            newCheckout.setAttribute('auth-token', authToken);
            newCheckout.setAttribute('checkout-id', checkoutId);
            
            // Set optional boolean attributes only if they are true
            if (completeProps.disableCreditCard) {
              newCheckout.setAttribute('disable-credit-card', 'true');
            }
            if (completeProps.disableBankAccount) {
              newCheckout.setAttribute('disable-bank-account', 'true');
            }
            if (completeProps.disableBnpl) {
              newCheckout.setAttribute('disable-bnpl', 'true');
            }
            if (completeProps.disablePaymentMethodGroup) {
              newCheckout.setAttribute('disable-payment-method-group', 'true');
            }
            if (completeProps.hideCardBillingForm) {
              newCheckout.setAttribute('hide-card-billing-form', 'true');
            }
            if (completeProps.hideBankAccountBillingForm) {
              newCheckout.setAttribute('hide-bank-account-billing-form', 'true');
            }
            
            // Add event listeners to the new component
            newCheckout.addEventListener('submit-event', function(event) {
              logEvent('submit-event', 'justifi-checkout', event.detail, 'success');
              writeOutputToPage(event);
            });
            
            newCheckout.addEventListener('error-event', function(event) {
              logEvent('error-event', 'justifi-checkout', event.detail, 'error');
              writeOutputToPage(event);
            });
            
            newCheckout.addEventListener('validation-event', function(event) {
              logEvent('validation-event', 'justifi-checkout', event.detail, 'info');
            });
            
            // Add the new component to the container
            container.appendChild(newCheckout);
          }
          
          // Add visual feedback
          container.style.transition = 'box-shadow 0.3s ease';
          container.style.boxShadow = '0 0 10px rgba(0, 123, 255, 0.5)';
          setTimeout(() => {
            container.style.boxShadow = '';
          }, 300);
        }
        
        // Listen for props-updated events
        document.addEventListener('props-updated', function(event) {
          if (event.detail.componentName === '${componentName}') {
            updateCheckoutComponent(event.detail.props);
          }
        });
      `,
    ],
  });

  const bodyContent = renderToString(exampleLayoutElement);

  // Return the HTML using BaseTemplate
  return BaseTemplate({
    title: 'JustiFi Checkout Example',
    webComponentToken,
    bodyContent,
    styles: ['/styles/example-app.css'],
  });
}
