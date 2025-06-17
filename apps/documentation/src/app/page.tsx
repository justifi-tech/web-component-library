"use client";
import Image from "next/image";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

export default function Home() {
  return (
    <div>
      <h1 className="mb-3">JustiFi Web Components - Overview</h1>
      <p className="lead">
        JustiFi Web Components is a React component library for payment facilitation and fintech experiences. Use these components to quickly build robust, compliant, and beautiful payment flows.
      </p>
      <Card className="mb-4 bg-secondary bg-opacity-10 border-0">
        <Card.Body>
          <h5>Getting Started</h5>
          <ol>
            <li>Install the library: <code>pnpm add @justifi/webcomponents</code></li>
            <li>Import and use a component: <code>{`import { JustifiCheckout } from '@justifi/webcomponents'`}</code></li>
            <li>See the <a href="/components/checkout">Checkout</a> component for a full example.</li>
          </ol>
          <Button href="/components/checkout" variant="primary" className="mt-2">View Checkout Component</Button>
        </Card.Body>
      </Card>
      <p>
        For more details, see the Components section or the API reference in the sidebar.
      </p>
    </div>
  );
}
