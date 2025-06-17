"use client";

import Card from "react-bootstrap/Card";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Button from "react-bootstrap/Button";

export default function CheckoutComponentPage() {
  return (
    <div>
      <h1>Checkout</h1>
      <p className="lead">
        The <strong>Checkout</strong> component provides a unified payment experience for your users, supporting credit card, ACH, and more. Easily drop it into your app and configure it for your use case.
      </p>
      <Card className="mb-4 p-4 bg-secondary bg-opacity-10 border-0">
        <h5>Visual Example</h5>
        {/* Placeholder for the actual component demo */}
        <div className="my-3 p-3 bg-dark rounded text-center" style={{ minHeight: 120 }}>
          <span className="text-secondary">[Checkout component demo will render here]</span>
        </div>
      </Card>
      <h5>Code Samples</h5>
      <Tabs defaultActiveKey="js" className="mb-3">
        <Tab eventKey="js" title="JS">
          <pre className="bg-dark text-light p-3 rounded"><code>{`
import { JustifiCheckout } from '@justifi/webcomponents';

<JustifiCheckout checkoutId="123" authToken="sk_test_..." />
          `}</code></pre>
        </Tab>
        <Tab eventKey="ts" title="TS">
          <pre className="bg-dark text-light p-3 rounded"><code>{`
import { JustifiCheckout } from '@justifi/webcomponents';

<JustifiCheckout checkoutId={"123"} authToken={"sk_test_..."} />
          `}</code></pre>
        </Tab>
        <Tab eventKey="html" title="HTML">
          <pre className="bg-dark text-light p-3 rounded"><code>{`
<justifi-checkout checkout-id="123" auth-token="sk_test_..."></justifi-checkout>
          `}</code></pre>
        </Tab>
        <Tab eventKey="css" title="CSS">
          <pre className="bg-dark text-light p-3 rounded"><code>{`
justifi-checkout {
  --primary-color: #0052cc;
  --border-radius: 8px;
}
          `}</code></pre>
        </Tab>
      </Tabs>
    </div>
  );
} 