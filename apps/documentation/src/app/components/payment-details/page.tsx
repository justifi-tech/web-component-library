export default function PaymentDetailsPage() {
  return (
    <div>
      <h1>Payment Details</h1>
      <p className="lead">
        A comprehensive component for viewing detailed payment information and transaction history.
      </p>

      <div className="mt-4">
        <h2>Overview</h2>
        <p>
          The Payment Details component displays complete information about a specific payment, 
          including transaction details, customer information, and processing history.
        </p>
      </div>

      <div className="mt-4">
        <h2>Usage</h2>
        <div className="bg-light p-3 rounded">
          <pre><code>{`import { JustifiPaymentDetails } from '@justifi/webcomponents';

function App() {
  return (
    <JustifiPaymentDetails 
      paymentId="pay_123456789"
      onRefund={(payment) => console.log('Refund initiated:', payment)}
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
                <td><code>paymentId</code></td>
                <td>string</td>
                <td>Yes</td>
                <td>Unique payment identifier</td>
              </tr>
              <tr>
                <td><code>onRefund</code></td>
                <td>function</td>
                <td>No</td>
                <td>Callback when refund is initiated</td>
              </tr>
              <tr>
                <td><code>showActions</code></td>
                <td>boolean</td>
                <td>No</td>
                <td>Show action buttons (refund, capture, etc.)</td>
              </tr>
              <tr>
                <td><code>readOnly</code></td>
                <td>boolean</td>
                <td>No</td>
                <td>Display in read-only mode</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4">
        <h2>Features</h2>
        <ul>
          <li>Display complete payment information</li>
          <li>Show transaction timeline and history</li>
          <li>Customer and billing details</li>
          <li>Processing and settlement information</li>
          <li>Refund and dispute management</li>
          <li>Export payment details</li>
        </ul>
      </div>

      <div className="mt-4">
        <h2>Examples</h2>
        
        <h3>Read-only Display</h3>
        <div className="bg-light p-3 rounded">
          <pre><code>{`<JustifiPaymentDetails 
  paymentId="pay_123456789"
  readOnly={true}
  showActions={false}
/>`}</code></pre>
        </div>

        <h3>With Actions Enabled</h3>
        <div className="bg-light p-3 rounded">
          <pre><code>{`<JustifiPaymentDetails 
  paymentId="pay_123456789"
  showActions={true}
  onRefund={(payment) => handleRefund(payment)}
/>`}</code></pre>
        </div>
      </div>
    </div>
  );
} 