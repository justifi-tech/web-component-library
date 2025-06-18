"use client";
import { useContext } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Image from "next/image";
import { Sun, Moon, CircleHalf } from "react-bootstrap-icons";
import { ThemeContext } from "../ThemeProvider";
import Dropdown from "react-bootstrap/Dropdown";

function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext);
  const themeOptions = [
    { key: "light", label: "Light", icon: <Sun className="me-2" /> },
    { key: "dark", label: "Dark", icon: <Moon className="me-2" /> },
    { key: "auto", label: "Auto", icon: <CircleHalf className="me-2" /> },
  ];
  const current = themeOptions.find((opt) => opt.key === theme) || themeOptions[0];
  return (
    <Dropdown align="end">
      <Dropdown.Toggle
        variant="link"
        id="theme-dropdown"
        style={{
          background: "none",
          border: "none",
          color: "var(--navbar-text)",
          fontSize: 22,
          cursor: "pointer",
          marginLeft: 16,
          lineHeight: 1,
          display: "flex",
          alignItems: "center",
        }}
        aria-label="Toggle theme menu"
      >
        {current.icon}
      </Dropdown.Toggle>
      <Dropdown.Menu className="shadow" data-bs-theme="dark">
        {themeOptions.map((opt) => (
          <Dropdown.Item
            as="button"
            key={opt.key}
            active={theme === opt.key}
            onClick={() => setTheme(opt.key)}
            className="d-flex align-items-center"
          >
            {opt.icon}
            <span className="flex-grow-1">{opt.label}</span>
            {theme === opt.key && (
              <span className="ms-2" aria-label="Selected">✓</span>
            )}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default function NavbarComponent() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="border-bottom border-secondary navbar">
      <Container fluid>
        <Navbar.Brand href="/" className="d-flex align-items-center gap-2">
          <Image src="/justifi-logo-light.png" alt="JustiFi Logo" width={74.5} height={32} />
          <span>JustiFi Web Components</span>
        </Navbar.Brand>
        <div className="ms-auto d-flex align-items-center">
          <ThemeToggle />
        </div>
      </Container>
    </Navbar>
  );
} 