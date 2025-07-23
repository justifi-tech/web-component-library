import { createExampleServer } from './server/express-server';
import { API_PATHS } from './utils/api-paths';
import { createCheckoutExample } from './examples/checkout-example';
import { BaseTemplate } from './templates/base-template';
import { NavigationMenu } from './components/NavigationMenu';
import { renderToString } from './utils/simple-jsx';

// Load environment variables
require('dotenv').config({ path: '../../.env' });

// Create the server using the existing infrastructure
const server = createExampleServer();

// Landing page route
server.addRoute({
  path: '/',
  handler: async (_req, res) => {
    try {
      // Define navigation items for available examples
      const navigationData = {
        items: [
          {
            id: 'checkout',
            title: 'Checkout Component',
            description:
              'Complete checkout experience with payment method selection and billing information collection. Features live props editing and real-time event logging.',
            category: 'Payment',
            url: '/checkout',
            isActive: false,
          },
          {
            id: 'business-details',
            title: 'Business Details',
            description:
              'Display business information with interactive editing capabilities and comprehensive event tracking.',
            category: 'Business',
            url: '/business-details',
            isActive: false,
          },
          {
            id: 'payment-details',
            title: 'Payment Details',
            description:
              'Payment information display with real-time updates and detailed event logging.',
            category: 'Payment',
            url: '/payment-details',
            isActive: false,
          },
        ],
        currentPath: '/',
        showCategories: true,
      };

      // Render the NavigationMenu component
      const navigationContent = renderToString(NavigationMenu(navigationData));

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>JustiFi Component Examples</title>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="stylesheet" href="/styles/example-app.css" />
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>JustiFi Component Examples</h1>
                <p>Enhanced component examples with live props editing and event logging</p>
              </div>
              ${navigationContent}
            </div>
          </body>
        </html>
      `;
      res.send(html);
    } catch (error) {
      console.error('Error serving landing page:', error);
      res.status(500).send('Internal Server Error');
    }
  },
});

// Enhanced checkout example route
server.addRoute({
  path: '/checkout',
  handler: async (_req, res) => {
    try {
      const authService = server.getAuthService();

      // Get tokens
      const token = await authService.getAuthToken();

      // Create checkout
      const checkoutEndpoint = `${authService.getApiOrigin()}/${API_PATHS.CHECKOUT}`;
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

      // Generate the enhanced checkout example
      const exampleContent = await createCheckoutExample(
        webComponentToken,
        checkout.id
      );

      // Wrap with BaseTemplate for proper HTML structure
      const jsxRenderer = server.getJSXRenderer();
      const html = jsxRenderer.renderTemplate(BaseTemplate, {
        title: 'JustiFi Checkout Example',
        webComponentToken,
        bodyContent: exampleContent,
        styles: ['/styles/example-app.css'],
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
              }
            }
            
            function applyProps(componentName) {
              const propsManager = window.propsManager;
              if (propsManager) {
                const props = propsManager.getProps(componentName);
                console.log(\`Applying props for \${componentName}:\`, props);
                
                // Trigger live update if component is registered
                if (window.registerLiveComponent && window.livePropsClient) {
                  window.livePropsClient.triggerLiveUpdate(componentName);
                }
              }
            }
            
            function copyPropsToClipboard(componentName) {
              const propsManager = window.propsManager;
              if (propsManager) {
                const props = propsManager.getProps(componentName);
                const propsStr = JSON.stringify(props, null, 2);
                navigator.clipboard.writeText(propsStr).then(() => {
                  console.log(\`Props for \${componentName} copied to clipboard\`);
                });
              }
            }
            
            // Output management
            function clearOutput() {
              const outputPane = document.getElementById('output-pane');
              if (outputPane) {
                outputPane.innerHTML = '<em>Component output will appear here...</em>';
              }
            }
            
            // Navigation functionality
            function toggleNavigation() {
              const nav = document.querySelector('.navigation-menu');
              if (nav) {
                nav.classList.toggle('collapsed');
              }
            }
            
            // Initialize when DOM is loaded
            document.addEventListener('DOMContentLoaded', function() {
              console.log('Example template initialized');
              
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
                  checkoutId: '${checkout.id}'
                });
              
              console.log('Checkout component schema registered and prefilled with actual values');
            });
          `,
        ],
      });

      res.send(html);
    } catch (error) {
      console.error('Error in enhanced checkout example:', error);
      res.status(500).send(`
        <html>
          <head><title>Error</title></head>
          <body>
            <h1>Error</h1>
            <p>Failed to load checkout example: ${error instanceof Error ? error.message : 'Unknown error'}</p>
            <p>Please check your environment variables and API configuration.</p>
            <a href="/">← Back to Home</a>
          </body>
        </html>
      `);
    }
  },
});

// Placeholder routes for other examples
server.addRoute({
  path: '/business-details',
  handler: async (_req, res) => {
    res.send(`
      <html>
        <head><title>Business Details - Coming Soon</title></head>
        <body>
          <h1>Business Details Example</h1>
          <p>This example is coming soon with the enhanced template system.</p>
          <a href="/">← Back to Home</a>
        </body>
      </html>
    `);
  },
});

server.addRoute({
  path: '/payment-details',
  handler: async (_req, res) => {
    res.send(`
      <html>
        <head><title>Payment Details - Coming Soon</title></head>
        <body>
          <h1>Payment Details Example</h1>
          <p>This example is coming soon with the enhanced template system.</p>
          <a href="/">← Back to Home</a>
        </body>
      </html>
    `);
  },
});

// Start the server
server.start();

console.log(
  `🚀 Enhanced Component Examples Server running on http://localhost:${process.env['PORT'] || 3000}`
);
console.log(
  `📖 Checkout Example: http://localhost:${process.env['PORT'] || 3000}/checkout`
);
console.log(
  `🏠 Landing Page: http://localhost:${process.env['PORT'] || 3000}/`
);
