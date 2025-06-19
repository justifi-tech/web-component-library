export default function InstallationPage() {
  return (
    <div>
      <h1>Installation</h1>
      <p className="lead">
        Learn how to install and set up JustiFi Web Components in your project.
      </p>

      <div className="mt-4">
        <h2>Package Installation</h2>
        <p>
          Install the JustiFi Web Components library using your preferred package manager:
        </p>
        
        <div className="bg-light p-3 rounded mb-3">
          <h5>npm</h5>
          <code>npm install @justifi/webcomponents</code>
        </div>
        
        <div className="bg-light p-3 rounded mb-3">
          <h5>yarn</h5>
          <code>yarn add @justifi/webcomponents</code>
        </div>
        
        <div className="bg-light p-3 rounded mb-3">
          <h5>pnpm</h5>
          <code>pnpm add @justifi/webcomponents</code>
        </div>
      </div>

      <div className="mt-4">
        <h2>Basic Setup</h2>
        <p>
          After installation, you can import and use components in your application:
        </p>
        
        <div className="bg-light p-3 rounded">
          <pre><code>{`import { JustifiCheckout } from '@justifi/webcomponents';

function App() {
  return (
    <div>
      <JustifiCheckout />
    </div>
  );
}`}</code></pre>
        </div>
      </div>

      <div className="mt-4">
        <h2>Requirements</h2>
        <ul>
          <li>React 18.0.0 or higher</li>
          <li>Node.js 16.0.0 or higher</li>
          <li>Modern browser support (ES2015+)</li>
        </ul>
      </div>

      <div className="mt-4">
        <h2>Next Steps</h2>
        <p>
          Once you've installed the library, check out the <a href="/components/checkout">Checkout component</a> 
          for a complete example of how to use JustiFi Web Components in your application.
        </p>
      </div>
    </div>
  );
} 