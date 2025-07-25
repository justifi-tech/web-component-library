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
        // PropsManager for client-side props management
        class PropsManager {
          constructor() {
            this.props = {};
            this.schemas = new Map();
            this.listeners = new Map();
          }

          registerSchema(componentName, schema) {
            this.schemas.set(componentName, schema);
            if (!this.props[componentName]) {
              this.props[componentName] = this.getDefaultProps(schema);
            }
          }

          getDefaultProps(schema) {
            const defaults = {};
            schema.forEach(prop => {
              defaults[prop.name] = prop.defaultValue;
            });
            return defaults;
          }

          getProps(componentName) {
            return this.props[componentName] || {};
          }

          updateProp(componentName, propName, value, type) {
            if (!this.props[componentName]) {
              this.props[componentName] = {};
            }

            let convertedValue = value;
            switch (type) {
              case 'number':
                convertedValue = Number(value);
                if (isNaN(convertedValue)) return;
                break;
              case 'boolean':
                convertedValue = Boolean(value);
                break;
              case 'object':
                try {
                  convertedValue = typeof value === 'string' ? JSON.parse(value) : value;
                } catch (e) {
                  console.warn('Invalid JSON for object prop:', value);
                  return;
                }
                break;
            }

            this.props[componentName][propName] = convertedValue;
            this.notifyListeners(componentName);
          }

          prefillProps(componentName, props) {
            if (!this.props[componentName]) {
              this.props[componentName] = {};
            }

            Object.entries(props).forEach(([propName, value]) => {
              const schema = this.schemas.get(componentName);
              const propSchema = schema?.find(p => p.name === propName);
              
              if (propSchema) {
                let convertedValue = value;
                switch (propSchema.type) {
                  case 'number':
                    convertedValue = Number(value);
                    if (isNaN(convertedValue)) return;
                    break;
                  case 'boolean':
                    convertedValue = Boolean(value);
                    break;
                  case 'object':
                    try {
                      convertedValue = typeof value === 'string' ? JSON.parse(value) : value;
                    } catch (e) {
                      console.warn('Invalid JSON for object prop:', value);
                      return;
                    }
                    break;
                }

                this.props[componentName][propName] = convertedValue;
              }
            });

            this.notifyListeners(componentName);
          }

          resetProps(componentName) {
            const schema = this.schemas.get(componentName);
            if (schema) {
              this.props[componentName] = this.getDefaultProps(schema);
              this.notifyListeners(componentName);
            }
          }

          subscribe(componentName, callback) {
            if (!this.listeners.has(componentName)) {
              this.listeners.set(componentName, []);
            }
            this.listeners.get(componentName).push(callback);
            return () => {
              const listeners = this.listeners.get(componentName);
              if (listeners) {
                const index = listeners.indexOf(callback);
                if (index > -1) {
                  listeners.splice(index, 1);
                }
              }
            };
          }

          notifyListeners(componentName) {
            const listeners = this.listeners.get(componentName);
            if (listeners) {
              const props = this.getProps(componentName);
              listeners.forEach(callback => callback(props));
            }
          }
        }

        // Initialize PropsManager globally
        window.propsManager = new PropsManager();

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
            console.log(\`Updated \${componentName}.\${propName} = \${value}\`);
            
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
            console.log(\`Reset props for \${componentName}\`);
            
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
          
          // Find the existing checkout component
          const existingCheckout = container.querySelector('justifi-checkout');
          if (existingCheckout) {
            // Remove the existing component
            existingCheckout.remove();
            
            // Create a new component with updated props
            const newCheckout = document.createElement('justifi-checkout');
            newCheckout.authToken = props.authToken || '';
            newCheckout.checkoutId = props.checkoutId || '';
            newCheckout.disableCreditCard = props.disableCreditCard || false;
            newCheckout.disableBankAccount = props.disableBankAccount || false;
            newCheckout.disableBnpl = props.disableBnpl || false;
            newCheckout.disablePaymentMethodGroup = props.disablePaymentMethodGroup || false;
            newCheckout.hideCardBillingForm = props.hideCardBillingForm || false;
            newCheckout.hideBankAccountBillingForm = props.hideBankAccountBillingForm || false;
            
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

        // Register checkout component schema and prefill with actual values
        const checkoutSchema = [
          {
            name: 'authToken',
            type: 'string',
            label: 'Auth Token',
            defaultValue: '',
            placeholder: 'Enter auth token',
            description: 'Authentication token for API access (generated by server)',
            required: true,
            validation: {
              pattern: '^[a-zA-Z0-9._-]+$'
            }
          },
          {
            name: 'checkoutId',
            type: 'string',
            label: 'Checkout ID',
            defaultValue: '',
            placeholder: 'Enter checkout ID',
            description: 'Unique checkout session identifier (generated by server)',
            required: true,
            validation: {
              pattern: '^chk_[a-zA-Z0-9]+$'
            }
          },
          {
            name: 'disableCreditCard',
            type: 'boolean',
            label: 'Disable Credit Card',
            defaultValue: false,
            description: 'Hide credit card payment option'
          },
          {
            name: 'disableBankAccount',
            type: 'boolean',
            label: 'Disable Bank Account',
            defaultValue: false,
            description: 'Hide bank account payment option'
          },
          {
            name: 'disableBnpl',
            type: 'boolean',
            label: 'Disable BNPL',
            defaultValue: false,
            description: 'Hide Buy Now Pay Later option'
          },
          {
            name: 'disablePaymentMethodGroup',
            type: 'boolean',
            label: 'Disable Payment Method Group',
            defaultValue: false,
            description: 'Hide payment method group selection'
          },
          {
            name: 'hideCardBillingForm',
            type: 'boolean',
            label: 'Hide Card Billing Form',
            defaultValue: false,
            description: 'Hide billing form for credit card payments'
          },
          {
            name: 'hideBankAccountBillingForm',
            type: 'boolean',
            label: 'Hide Bank Account Billing Form',
            defaultValue: false,
            description: 'Hide billing form for bank account payments'
          }
        ];
        
        // Register schema and prefill with actual values
        window.propsManager.registerSchema('checkout', checkoutSchema);
        window.propsManager.prefillProps('checkout', {
            authToken: '${webComponentToken}',
            checkoutId: '${checkoutId}'
          });
        
        console.log('Checkout component schema registered and prefilled with actual values');
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
