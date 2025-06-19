export default function PaymentProvisioningPage() {
  return (
    <div>
      <h1>Payment Provisioning</h1>
      <p className="lead">
        A component for setting up and configuring payment processing capabilities for your business.
      </p>

      <div className="mt-4">
        <h2>Overview</h2>
        <p>
          The Payment Provisioning component guides businesses through the process of setting up 
          payment processing, including account verification, compliance checks, and configuration.
        </p>
      </div>

      <div className="mt-4">
        <h2>Usage</h2>
        <div className="bg-light p-3 rounded">
          <pre><code>{`import { JustifiPaymentProvisioning } from '@justifi/webcomponents';

function App() {
  return (
    <JustifiPaymentProvisioning 
      businessId="bus_123456789"
      onProvisioningComplete={(config) => console.log('Setup complete:', config)}
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
                <td>Business identifier for provisioning</td>
              </tr>
              <tr>
                <td><code>onProvisioningComplete</code></td>
                <td>function</td>
                <td>No</td>
                <td>Callback when setup is complete</td>
              </tr>
              <tr>
                <td><code>step</code></td>
                <td>number</td>
                <td>No</td>
                <td>Initial step to start from</td>
              </tr>
              <tr>
                <td><code>skipVerification</code></td>
                <td>boolean</td>
                <td>No</td>
                <td>Skip verification steps</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4">
        <h2>Features</h2>
        <ul>
          <li>Step-by-step setup wizard</li>
          <li>Business verification and compliance</li>
          <li>Payment method configuration</li>
          <li>Account security setup</li>
          <li>Integration testing</li>
          <li>Progress tracking and resume capability</li>
        </ul>
      </div>

      <div className="mt-4">
        <h2>Examples</h2>
        
        <h3>Starting from Specific Step</h3>
        <div className="bg-light p-3 rounded">
          <pre><code>{`<JustifiPaymentProvisioning 
  businessId="bus_123456789"
  step={2} // Start from step 2
/>`}</code></pre>
        </div>

        <h3>Skip Verification</h3>
        <div className="bg-light p-3 rounded">
          <pre><code>{`<JustifiPaymentProvisioning 
  businessId="bus_123456789"
  skipVerification={true}
/>`}</code></pre>
        </div>
      </div>
    </div>
  );
} 