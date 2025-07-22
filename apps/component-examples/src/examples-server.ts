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
            
            // Props management functionality
            window.componentProps = {};
            
            function updateProp(name, value, type) {
              if (type === 'number') {
                value = parseFloat(value);
              } else if (type === 'boolean') {
                value = Boolean(value);
              } else if (type === 'object') {
                try {
                  value = JSON.parse(value);
                } catch (e) {
                  console.error('Invalid JSON:', e);
                  return;
                }
              }
              
              window.componentProps[name] = value;
              updateComponentDisplay();
            }
            
            function updateComponentDisplay() {
              // This would be implemented to update the component
              // with the new props in real-time
              console.log('Props updated:', window.componentProps);
            }
            
            function resetProps() {
              window.componentProps = {};
              // Reset form fields to default values
              const form = document.querySelector('.props-form');
              if (form) {
                form.reset();
              }
            }
            
            function applyProps() {
              updateComponentDisplay();
            }
            
            function copyPropsToClipboard() {
              const propsStr = JSON.stringify(window.componentProps, null, 2);
              navigator.clipboard.writeText(propsStr).then(() => {
                console.log('Props copied to clipboard');
              });
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
