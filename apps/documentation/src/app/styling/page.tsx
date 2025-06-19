export default function StylingPage() {
  return (
    <div>
      <h1>Styling</h1>
      <p className="lead">
        Learn how to customize the appearance of JustiFi Web Components to match your application's design.
      </p>

      <div className="mt-4">
        <h2>CSS Custom Properties</h2>
        <p>
          JustiFi Web Components use CSS custom properties (CSS variables) for theming. 
          You can override these variables to customize the appearance:
        </p>
        
        <div className="bg-light p-3 rounded">
          <pre><code>{`:root {
  --jfi-primary-color: #0052cc;
  --jfi-secondary-color: #6c757d;
  --jfi-success-color: #28a745;
  --jfi-danger-color: #dc3545;
  --jfi-warning-color: #ffc107;
  --jfi-info-color: #17a2b8;
  --jfi-light-color: #f8f9fa;
  --jfi-dark-color: #343a40;
  --jfi-border-radius: 8px;
  --jfi-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}`}</code></pre>
        </div>
      </div>

      <div className="mt-4">
        <h2>Theme Integration</h2>
        <p>
          The components automatically adapt to your application's theme. 
          They support both light and dark modes:
        </p>
        
        <div className="bg-light p-3 rounded">
          <pre><code>{`/* Dark theme */
[data-theme="dark"] {
  --jfi-bg-color: #23272a;
  --jfi-text-color: #ededed;
  --jfi-border-color: #404040;
}

/* Light theme */
[data-theme="light"] {
  --jfi-bg-color: #ffffff;
  --jfi-text-color: #222222;
  --jfi-border-color: #e5e7eb;
}`}</code></pre>
        </div>
      </div>

      <div className="mt-4">
        <h2>Component-Specific Styling</h2>
        <p>
          Each component can be customized using CSS classes or inline styles:
        </p>
        
        <div className="bg-light p-3 rounded">
          <pre><code>{`// Using CSS classes
<JustifiCheckout className="custom-checkout" />

// Using inline styles
<JustifiCheckout style={{ 
  border: '2px solid #0052cc',
  borderRadius: '12px'
}} />`}</code></pre>
        </div>
      </div>

      <div className="mt-4">
        <h2>Responsive Design</h2>
        <p>
          All components are built with responsive design in mind and will adapt to different screen sizes:
        </p>
        
        <ul>
          <li>Mobile-first approach</li>
          <li>Flexible layouts that work on all devices</li>
          <li>Touch-friendly interactions</li>
          <li>Accessible design patterns</li>
        </ul>
      </div>

      <div className="mt-4">
        <h2>Custom CSS</h2>
        <p>
          You can also create custom CSS to override component styles:
        </p>
        
        <div className="bg-light p-3 rounded">
          <pre><code>{`/* Custom styles for checkout component */
.justifi-checkout {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.justifi-checkout .checkout-button {
  background: #28a745;
  border: none;
  font-weight: 600;
}`}</code></pre>
        </div>
      </div>

      <div className="mt-4">
        <h2>Best Practices</h2>
        <ul>
          <li>Use CSS custom properties for consistent theming</li>
          <li>Test your customizations in both light and dark modes</li>
          <li>Ensure sufficient color contrast for accessibility</li>
          <li>Maintain responsive behavior when customizing</li>
          <li>Use semantic class names for better maintainability</li>
        </ul>
      </div>
    </div>
  );
} 