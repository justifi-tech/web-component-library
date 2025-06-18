"use client";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";

const navSections = [
  {
    label: "Getting Started",
    links: [
      { label: "Overview", href: "/" },
    ],
  },
  {
    label: "Components",
    links: [
      { label: "Checkout", href: "/components/checkout" },
      { label: "Tokenize Payment Method", href: "/components/tokenize-payment-method" },
      { label: "Business Form", href: "/components/business-form" },
      { label: "Terminals List", href: "/components/terminals-list" },
      { label: "Dispute Management", href: "/components/dispute-management" },
      { label: "Checkouts List", href: "/components/checkouts-list" },
      { label: "Order Terminals", href: "/components/order-terminals" },
      { label: "Refund Payment", href: "/components/refund-payment" },
      { label: "Payment Provisioning", href: "/components/payment-provisioning" },
      { label: "Payments List", href: "/components/payments-list" },
      { label: "Payment Details", href: "/components/payment-details" },
      { label: "Payouts List", href: "/components/payouts-list" },
      { label: "Payout Details", href: "/components/payout-details" },
      { label: "Terminal Orders List", href: "/components/terminal-orders-list" },
      { label: "Season Interruption Insurance", href: "/components/season-interruption-insurance" },
      { label: "Gross Payment Chart", href: "/components/gross-payment-chart" },
      { label: "Business Details", href: "/components/business-details" },
    ],
  },
  {
    label: "Component API",
    links: [
      { label: "Checkout API", href: "/component-api/checkout" },
      { label: "Tokenize Payment Method API", href: "/component-api/tokenize-payment-method" },
      { label: "Business Form API", href: "/component-api/business-form" },
      // ...add more as needed
    ],
  },
];

export default function SidebarComponent() {
  return (
    <Col xs={12} md={3} lg={2} className="sidebar border-end p-0">
      <Nav className="flex-column p-3" variant="pills">
        {navSections.map((section) => (
          <div key={section.label} className="mb-4">
            <div className="fw-bold text-uppercase small mb-2 text-secondary">{section.label}</div>
            {section.links.map((link) => (
              <Nav.Link key={link.href} href={link.href} className="ps-3 py-1">
                {link.label}
              </Nav.Link>
            ))}
          </div>
        ))}
      </Nav>
    </Col>
  );
} 