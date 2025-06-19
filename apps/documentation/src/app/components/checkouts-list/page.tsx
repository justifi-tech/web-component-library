export default function CheckoutsListPage() {
  return (
    <div>
      <h1>Checkouts List</h1>
      <p className="lead">
        A component for displaying and managing a list of checkout sessions.
      </p>

      <div className="mt-4">
        <h2>Overview</h2>
        <p>
          The Checkouts List component provides a comprehensive interface for viewing, 
          filtering, and managing checkout sessions with real-time updates and search capabilities.
        </p>
      </div>

      <div className="mt-4">
        <h2>Usage</h2>
        <div className="bg-light p-3 rounded">
          <pre><code>{`import { JustifiCheckoutsList } from '@justifi/webcomponents';

function App() {
  return (
    <JustifiCheckoutsList 
      businessId="bus_123456789"
      onCheckoutSelect={(checkout) => console.log('Selected:', checkout)}
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
                <td>Business identifier to filter checkouts</td>
              </tr>
              <tr>
                <td><code>onCheckoutSelect</code></td>
                <td>function</td>
                <td>No</td>
                <td>Callback when a checkout is selected</td>
              </tr>
              <tr>
                <td><code>filters</code></td>
                <td>object</td>
                <td>No</td>
                <td>Initial filter settings</td>
              </tr>
              <tr>
                <td><code>refreshInterval</code></td>
                <td>number</td>
                <td>No</td>
                <td>Auto-refresh interval in milliseconds</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4">
        <h2>Features</h2>
        <ul>
          <li>Display checkout sessions in a paginated list</li>
          <li>Real-time updates and auto-refresh</li>
          <li>Advanced filtering and search</li>
          <li>Sort by date, amount, status, etc.</li>
          <li>Export functionality</li>
          <li>Bulk actions for multiple checkouts</li>
        </ul>
      </div>

      <div className="mt-4">
        <h2>Examples</h2>
        
        <h3>With Filters</h3>
        <div className="bg-light p-3 rounded">
          <pre><code>{`<JustifiCheckoutsList 
  businessId="bus_123456789"
  filters={{
    status: 'completed',
    dateRange: { start: '2024-01-01', end: '2024-12-31' },
    minAmount: 100
  }}
/>`}</code></pre>
        </div>

        <h3>With Auto-refresh</h3>
        <div className="bg-light p-3 rounded">
          <pre><code>{`<JustifiCheckoutsList 
  businessId="bus_123456789"
  refreshInterval={30000} // 30 seconds
/>`}</code></pre>
        </div>
      </div>
    </div>
  );
} 