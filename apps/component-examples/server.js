require('dotenv').config({ path: '../../.env' });
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Shared static assets
app.use('/scripts', express.static(path.join(__dirname, 'node_modules/@justifi/webcomponents/dist/')));
app.use('/styles', express.static(path.join(__dirname, 'css/')));

// All component routes
const routes = [
  '/checkout',
  '/checkout-with-insurance',
  '/fill-billing-form',
  '/modular-checkout',
  '/dispute',
  '/business-form',
  '/business-details',
  '/payment-provisioning',
  '/tokenize-payment-method',
  '/refund-payment',
  '/payments-list',
  '/payments-list-with-filters',
  '/payouts-list',
  '/payouts-list-with-filters',
  '/checkouts-list',
  '/checkouts-list-with-filters',
  '/terminals-list',
  '/terminals-list-with-filters',
  '/terminal-orders-list',
  '/terminal-orders-list-with-filters',
  '/order-terminals',
  '/payment-details',
  '/payout-details',
  '/payment-transactions-list',
  '/payout-transactions-list',
];

routes.forEach((route) => {
  app.use(route, require(`./examples/${route.slice(1)}`));
});

// Index page listing all available components
app.get('/', (req, res) => {
  const links = routes
    .map((route) => `<li><a href="${route}">${route.slice(1)}</a></li>`)
    .join('\n          ');

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>JustiFi Component Examples</title>
        <link rel="stylesheet" href="/styles/example.css">
      </head>
      <body style="padding: 2rem; font-family: sans-serif;">
        <h1>JustiFi Component Examples</h1>
        <ul>
          ${links}
        </ul>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Component examples server listening on port ${port}`);
});
