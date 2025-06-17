"use client";

import Card from "react-bootstrap/Card";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

export default function DisputeManagementPage() {
  return (
    <div>
      <h1>Dispute Management</h1>
      <p className="lead">
        The <strong>Dispute Management</strong> component helps you display and manage payment disputes for your users.
      </p>
      <Card className="mb-4 p-4 bg-secondary bg-opacity-10 border-0">
        <h5>Visual Example</h5>
        <div className="my-3 p-3 bg-dark rounded text-center" style={{ minHeight: 120 }}>
          <span className="text-secondary">[Dispute Management demo will render here]</span>
        </div>
      </Card>
      <h5>Code Samples</h5>
      <Tabs defaultActiveKey="js" className="mb-3">
        <Tab eventKey="js" title="JS">
          <pre className="bg-dark text-light p-3 rounded"><code>{`
import { JustifiDisputeManagement } from '@justifi/webcomponents';

<JustifiDisputeManagement />
          `}</code></pre>
        </Tab>
        <Tab eventKey="ts" title="TS">
          <pre className="bg-dark text-light p-3 rounded"><code>{`
import { JustifiDisputeManagement } from '@justifi/webcomponents';

<JustifiDisputeManagement />
          `}</code></pre>
        </Tab>
        <Tab eventKey="html" title="HTML">
          <pre className="bg-dark text-light p-3 rounded"><code>{`
<justifi-dispute-management></justifi-dispute-management>
          `}</code></pre>
        </Tab>
        <Tab eventKey="css" title="CSS">
          <pre className="bg-dark text-light p-3 rounded"><code>{`
justifi-dispute-management {
  --primary-color: #0052cc;
}
          `}</code></pre>
        </Tab>
      </Tabs>
    </div>
  );
} 