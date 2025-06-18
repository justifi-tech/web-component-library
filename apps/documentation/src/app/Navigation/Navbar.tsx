"use client";
import { useContext } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Image from "next/image";
import { Sun, Moon } from "react-bootstrap-icons";
import { ThemeContext } from "../ThemeProvider";

function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext);
  console.log("ThemeToggle context:", theme, setTheme);
  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
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
    >
      {theme === "light" ? (
        <Moon title="Switch to dark mode" />
      ) : (
        <Sun title="Switch to light mode" />
      )}
    </button>
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