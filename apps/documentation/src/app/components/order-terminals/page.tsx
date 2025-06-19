export default function OrderTerminalsPage() {
  return (
    <div>
      <h1>Order Terminals</h1>
      <p className="lead">
        A component for ordering and managing payment terminals for your business.
      </p>

      <div className="mt-4">
        <h2>Overview</h2>
        <p>
          The Order Terminals component provides a streamlined interface for businesses to order 
          new payment terminals, track existing orders, and manage terminal inventory.
        </p>
      </div>

      <div className="mt-4">
        <h2>Usage</h2>
        <div className="bg-light p-3 rounded">
          <pre><code>{`import { JustifiOrderTerminals } from '@justifi/webcomponents';

function App() {
  return (
    <JustifiOrderTerminals 
      businessId="bus_123456789"
      onOrderSubmit={(order) => console.log('Order submitted:', order)}
    />
  );
}`}</code></pre>
        </div>
      </div>

      <div className="mt-4">
        <h2>Props</h2>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Prop</th>
                <th>Type</th>
                <th>Required</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>businessId</code></td>
                <td>string</td>
                <td>Yes</td>
                <td>Business identifier for the order</td>
              </tr>
              <tr>
                <td><code>onOrderSubmit</code></td>
                <td>function</td>
                <td>No</td>
                <td>Callback when order is submitted</td>
              </tr>
              <tr>
                <td><code>shippingAddress</code></td>
                <td>object</td>
                <td>No</td>
                <td>Default shipping address</td>
              </tr>
              <tr>
                <td><code>terminalTypes</code></td>
                <td>array</td>
                <td>No</td>
                <td>Available terminal types to display</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4">
        <h2>Features</h2>
        <ul>
          <li>Browse available terminal models</li>
          <li>Compare terminal features and pricing</li>
          <li>Configure terminal settings</li>
          <li>Select shipping options</li>
          <li>Track order status</li>
          <li>Manage existing terminal inventory</li>
        </ul>
      </div>

      <div className="mt-4">
        <h2>Examples</h2>
        
        <h3>With Shipping Address</h3>
        <div className="bg-light p-3 rounded">
          <pre><code>{`<JustifiOrderTerminals 
  businessId="bus_123456789"
  shippingAddress={{
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001"
  }}
/>`}</code></pre>
        </div>

        <h3>Filtered Terminal Types</h3>
        <div className="bg-light p-3 rounded">
          <pre><code>{`<JustifiOrderTerminals 
  businessId="bus_123456789"
  terminalTypes={['clover', 'poynt', 'verifone']}
/>`}</code></pre>
        </div>
      </div>
    </div>
  );
} 