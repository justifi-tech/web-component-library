"use client";

import Card from "react-bootstrap/Card";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

export default function BusinessFormPage() {
  return (
    <div>
      <h1>Business Form</h1>
      <p className="lead">
        The <strong>Business Form</strong> component helps you collect business information from your users in a structured and compliant way.
      </p>
      <Card className="mb-4 p-4 bg-secondary bg-opacity-10 border-0">
        <h5>Visual Example</h5>
        <div className="my-3 p-3 bg-dark rounded text-center" style={{ minHeight: 120 }}>
          <span className="text-secondary">[Business Form demo will render here]</span>
        </div>
      </Card>
      <h5>Code Samples</h5>
      <Tabs defaultActiveKey="js" className="mb-3">
        <Tab eventKey="js" title="JS">
          <pre className="bg-dark text-light p-3 rounded"><code>{`
import { JustifiBusinessForm } from '@justifi/webcomponents';

<JustifiBusinessForm />
          `}</code></pre>
        </Tab>
        <Tab eventKey="ts" title="TS">
          <pre className="bg-dark text-light p-3 rounded"><code>{`
import { JustifiBusinessForm } from '@justifi/webcomponents';

<JustifiBusinessForm />
          `}</code></pre>
        </Tab>
        <Tab eventKey="html" title="HTML">
          <pre className="bg-dark text-light p-3 rounded"><code>{`
<justifi-business-form></justifi-business-form>
          `}</code></pre>
        </Tab>
        <Tab eventKey="css" title="CSS">
          <pre className="bg-dark text-light p-3 rounded"><code>{`
justifi-business-form {
  --primary-color: #0052cc;
}
          `}</code></pre>
        </Tab>
      </Tabs>
    </div>
  );
} 