"use client";
import { useState } from "react";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Collapse from "react-bootstrap/Collapse";
import { ChevronDown, ChevronRight } from "react-bootstrap-icons";

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
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    "Getting Started": true,
    "Components": true,
    "Component API": true,
  });

  const toggleSection = (sectionLabel: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionLabel]: !prev[sectionLabel]
    }));
  };

  const collapsedArrow = (isOpen: boolean) => {
    return isOpen ? <ChevronDown className="me-2" /> : <ChevronRight className="me-2" />;
  };

  return (
    <Col xs={12} md={3} lg={2} className="sidebar border-end p-0">
      <div className="p-3">
        {navSections.map((section) => (
          <div key={section.label}>
            <div 
              className="side-nav-section-header" 
              onClick={() => toggleSection(section.label)}
            >
              {collapsedArrow(openSections[section.label])}
              <span className="fw-bold">{section.label}</span>
            </div>
            <Collapse in={openSections[section.label]}>
              <div>
                <Nav className="nav-pills" variant="pills">
                  {section.links.map((link) => (
                    <Nav.Item key={link.href} className="w-100">
                      <Nav.Link href={link.href} className="ps-3 py-1">
                        {link.label}
                      </Nav.Link>
                    </Nav.Item>
                  ))}
                </Nav>
              </div>
            </Collapse>
          </div>
        ))}
      </div>
    </Col>
  );
} 