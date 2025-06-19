export default function BusinessDetailsPage() {
  return (
    <div>
      <h1>Business Details</h1>
      <p className="lead">
        A comprehensive component for displaying and managing business profile information.
      </p>

      <div className="mt-4">
        <h2>Overview</h2>
        <p>
          The Business Details component provides a complete interface for viewing and editing 
          business information including company details, contact information, and business settings.
        </p>
      </div>

      <div className="mt-4">
        <h2>Usage</h2>
        <div className="bg-light p-3 rounded">
          <pre><code>{`import { JustifiBusinessDetails } from '@justifi/webcomponents';

function App() {
  return (
    <JustifiBusinessDetails 
      businessId="bus_123456789"
      onUpdate={(data) => console.log('Business updated:', data)}
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
                <td>Unique identifier for the business</td>
              </tr>
              <tr>
                <td><code>onUpdate</code></td>
                <td>function</td>
                <td>No</td>
                <td>Callback when business details are updated</td>
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
          <li>Display business profile information</li>
          <li>Edit business details with validation</li>
          <li>Upload and manage business documents</li>
          <li>View business verification status</li>
          <li>Manage business settings and preferences</li>
        </ul>
      </div>

      <div className="mt-4">
        <h2>Examples</h2>
        
        <h3>Read-only Display</h3>
        <div className="bg-light p-3 rounded">
          <pre><code>{`<JustifiBusinessDetails 
  businessId="bus_123456789"
  readOnly={true}
/>`}</code></pre>
        </div>

        <h3>With Custom Styling</h3>
        <div className="bg-light p-3 rounded">
          <pre><code>{`<JustifiBusinessDetails 
  businessId="bus_123456789"
  className="custom-business-details"
  style={{ maxWidth: '800px' }}
/>`}</code></pre>
        </div>
      </div>
    </div>
  );
} 