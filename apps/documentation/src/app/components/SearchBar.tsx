"use client";
import { useState, useEffect, useRef } from "react";
import { Search, X } from "react-bootstrap-icons";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import { useRouter } from "next/navigation";
import { searchData, SearchItem } from "../utils/searchData";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search functionality
  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      setIsOpen(false);
      setSelectedIndex(-1);
      return;
    }

    const filtered = searchData.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(query.toLowerCase()))
    );

    setResults(filtered);
    setIsOpen(filtered.length > 0);
    setSelectedIndex(-1);
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : results.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleSelect(results[selectedIndex].slug);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSelect = (slug: string) => {
    router.push(slug);
    setQuery("");
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  return (
    <div ref={searchRef} className="position-relative search-bar-container">
      <div className="position-relative">
        <Form.Control
          type="text"
          placeholder="Search components..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() !== "" && results.length > 0 && setIsOpen(true)}
          style={{ 
            width: "550px",
            paddingLeft: "40px",
            paddingRight: query ? "40px" : "12px"
          }}
        />
        <Search 
          className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
          style={{ zIndex: 1 }}
        />
        {query && (
          <button
            onClick={handleClear}
            className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 p-0"
            style={{ 
              color: "var(--navbar-text)",
              fontSize: "14px",
              zIndex: 1,
              border: "none",
              background: "none"
            }}
          >
            <X />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <Dropdown.Menu 
          show={isOpen}
          className="shadow-lg search-results-dropdown"
          style={{
            width: "300px",
            maxHeight: "400px",
            overflowY: "auto",
            marginTop: "4px"
          }}
        >
          {results.map((result, index) => (
            <Dropdown.Item
              key={index}
              onClick={() => handleSelect(result.slug)}
              className={`d-flex flex-column align-items-start py-2 ${
                index === selectedIndex ? 'active' : ''
              }`}
              style={{ cursor: "pointer" }}
            >
              <div className="fw-semibold">{result.label}</div>
              <small className="text-muted">{result.category}</small>
              {result.description && (
                <small className="text-muted mt-1" style={{ fontSize: "0.75rem" }}>
                  {result.description}
                </small>
              )}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      )}
    </div>
  );
} 