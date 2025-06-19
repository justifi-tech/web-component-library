export default function GrossPaymentChartPage() {
  return (
    <div>
      <h1>Gross Payment Chart</h1>
      <p className="lead">
        A data visualization component for displaying payment analytics and trends.
      </p>

      <div className="mt-4">
        <h2>Overview</h2>
        <p>
          The Gross Payment Chart component provides interactive charts and graphs to visualize 
          payment data, revenue trends, and business performance metrics.
        </p>
      </div>

      <div className="mt-4">
        <h2>Usage</h2>
        <div className="bg-light p-3 rounded">
          <pre><code>{`import { JustifiGrossPaymentChart } from '@justifi/webcomponents';

function App() {
  return (
    <JustifiGrossPaymentChart 
      businessId="bus_123456789"
      chartType="line"
      dateRange={{ start: '2024-01-01', end: '2024-12-31' }}
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
                <td>Business identifier for data filtering</td>
              </tr>
              <tr>
                <td><code>chartType</code></td>
                <td>string</td>
                <td>No</td>
                <td>Chart type: 'line', 'bar', 'area', 'pie'</td>
              </tr>
              <tr>
                <td><code>dateRange</code></td>
                <td>object</td>
                <td>No</td>
                <td>Date range for data display</td>
              </tr>
              <tr>
                <td><code>metrics</code></td>
                <td>array</td>
                <td>No</td>
                <td>Metrics to display in the chart</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4">
        <h2>Features</h2>
        <ul>
          <li>Multiple chart types (line, bar, area, pie)</li>
          <li>Interactive data visualization</li>
          <li>Real-time data updates</li>
          <li>Customizable date ranges</li>
          <li>Export charts as images</li>
          <li>Responsive design for all devices</li>
        </ul>
      </div>

      <div className="mt-4">
        <h2>Examples</h2>
        
        <h3>Bar Chart</h3>
        <div className="bg-light p-3 rounded">
          <pre><code>{`<JustifiGrossPaymentChart 
  businessId="bus_123456789"
  chartType="bar"
  metrics={['gross_payments', 'net_payments', 'fees']}
/>`}</code></pre>
        </div>

        <h3>Area Chart with Custom Range</h3>
        <div className="bg-light p-3 rounded">
          <pre><code>{`<JustifiGrossPaymentChart 
  businessId="bus_123456789"
  chartType="area"
  dateRange={{ 
    start: '2024-06-01', 
    end: '2024-06-30' 
  }}
  height={400}
/>`}</code></pre>
        </div>
      </div>
    </div>
  );
} 