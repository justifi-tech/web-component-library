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
      { label: "Introduction", href: "/" },
      { label: "Installation", href: "/installation" },
      { label: "Styling", href: "/styling" },
    ],
  },
  {
    label: "Components",
    links: [
      { label: "Business Details", href: "/components/business-details" },
      { label: "Business Form", href: "/components/business-form" },
      { label: "Checkout", href: "/components/checkout" },
      { label: "Checkouts List", href: "/components/checkouts-list" },
      { label: "Dispute Management", href: "/components/dispute-management" },
      { label: "Gross Payment Chart", href: "/components/gross-payment-chart" },
      { label: "Order Terminals", href: "/components/order-terminals" },
      { label: "Payment Details", href: "/components/payment-details" },
      { label: "Payment Provisioning", href: "/components/payment-provisioning" },
      { label: "Payments List", href: "/components/payments-list" },
      { label: "Payout Details", href: "/components/payout-details" },
      { label: "Payouts List", href: "/components/payouts-list" },
      { label: "Refund Payment", href: "/components/refund-payment" },
      { label: "Season Interruption Insurance", href: "/components/season-interruption-insurance" },
      { label: "Terminal Orders List", href: "/components/terminal-orders-list" },
      { label: "Terminals List", href: "/components/terminals-list" },
      { label: "Tokenize Payment Method", href: "/components/tokenize-payment-method" },
    ],
  }
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