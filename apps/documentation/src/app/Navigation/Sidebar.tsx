"use client";
import { useState } from "react";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Collapse from "react-bootstrap/Collapse";
import { ChevronDown, ChevronRight } from "react-bootstrap-icons";
import { navSections } from "./NavSections";

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