import React, { useEffect, useRef, useState } from 'react';

// Global script loading state (shared across all component instances)
const globalScriptState: Record<string, { loaded: boolean; loading: boolean; error: string | null }> = {};

interface ComponentExampleProps {
  componentName: string;
  componentTag: string;
  scriptUrl: string;
  mockData: Record<string, any>;
  mockEndpoints: Array<{
    pattern: RegExp;
    response: any;
  }>;
  componentProps?: Record<string, string | boolean>;
  styles?: string;
  children?: React.ReactNode;
}

export const ComponentExample: React.FC<ComponentExampleProps> = ({
  componentName,
  componentTag,
  scriptUrl,
  mockData,
  mockEndpoints,
  componentProps = {},
  styles,
  children,
}) => {
  const [scriptLoaded, setScriptLoaded] = useState(globalScriptState[scriptUrl]?.loaded || false);
  const [scriptError, setScriptError] = useState<string | null>(globalScriptState[scriptUrl]?.error || null);
  const containerRef = useRef<HTMLDivElement>(null);
  const originalFetchRef = useRef<typeof fetch | null>(null);

  useEffect(() => {
    // Store original fetch
    originalFetchRef.current = window.fetch;

    // Create mock fetch
    const mockFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;

      // Check if this is an API call we should mock
      for (const endpoint of mockEndpoints) {
        if (endpoint.pattern.test(url)) {
          // Return mocked response
          return new Response(JSON.stringify(endpoint.response), {
            status: 200,
            statusText: 'OK',
            headers: {
              'Content-Type': 'application/json',
            },
          });
        }
      }

      // For non-mocked requests, use original fetch
      if (originalFetchRef.current) {
        return originalFetchRef.current(input, init);
      }

      // Fallback (shouldn't happen)
      throw new Error('Original fetch not available');
    };

    // Replace global fetch
    window.fetch = mockFetch as typeof fetch;

    // Load script if not already loaded (globally)
    if (!globalScriptState[scriptUrl]) {
      globalScriptState[scriptUrl] = { loaded: false, loading: false, error: null };
    }

    const scriptState = globalScriptState[scriptUrl];
    let checkInterval: NodeJS.Timeout | null = null;

    if (scriptState.loaded) {
      setScriptLoaded(true);
    } else if (!scriptState.loading) {
      scriptState.loading = true;
      const script = document.createElement('script');
      script.type = 'module';
      script.src = scriptUrl;
      script.async = true;

      script.onload = () => {
        scriptState.loaded = true;
        scriptState.loading = false;
        setScriptLoaded(true);
      };

      script.onerror = () => {
        const error = `Failed to load script: ${scriptUrl}`;
        scriptState.error = error;
        scriptState.loading = false;
        setScriptError(error);
      };

      document.head.appendChild(script);
    } else {
      // Script is loading, wait for it
      checkInterval = setInterval(() => {
        if (scriptState.loaded) {
          setScriptLoaded(true);
          if (checkInterval) clearInterval(checkInterval);
        } else if (scriptState.error) {
          setScriptError(scriptState.error);
          if (checkInterval) clearInterval(checkInterval);
        }
      }, 100);
    }

    // Cleanup function
    return () => {
      if (checkInterval) {
        clearInterval(checkInterval);
      }
      // Restore original fetch
      if (originalFetchRef.current) {
        window.fetch = originalFetchRef.current;
      }
    };
  }, [scriptUrl, mockEndpoints]);

  // Render component once script is loaded
  useEffect(() => {
    if (scriptLoaded && containerRef.current) {
      // Clear container
      containerRef.current.innerHTML = '';

      // Inject styles if provided
      if (styles) {
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        containerRef.current.appendChild(styleElement);
      }

      // Create web component element
      const element = document.createElement(componentTag);

      // Set props
      Object.entries(componentProps).forEach(([key, value]) => {
        if (typeof value === 'boolean') {
          if (value) {
            element.setAttribute(key, '');
          }
        } else {
          element.setAttribute(key, String(value));
        }
      });

      // wrap the element in a div with the class component-example-children
      const wrapper = document.createElement('div');
      wrapper.className = 'component-example-children';
      wrapper.appendChild(element);
      containerRef.current.appendChild(wrapper);
    }
  }, [scriptLoaded, componentTag, componentProps, styles]);

  if (scriptError) {
    return (
      <div style={{ padding: '1rem', border: '1px solid #ff6b6b', borderRadius: '4px', backgroundColor: '#ffe0e0' }}>
        <strong>Error loading component:</strong> {scriptError}
      </div>
    );
  }

  if (!scriptLoaded) {
    return (
      <div style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>
        Loading {componentName}...
      </div>
    );
  }

  return (
    <div>
      <div ref={containerRef} style={{ margin: '1rem 0' }} />
      {children}
    </div>
  );
};

