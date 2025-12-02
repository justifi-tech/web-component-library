// SSR-safe browser globals detection
const isBrowser =
  typeof window !== 'undefined' && typeof document !== 'undefined';
const hasCustomElements = isBrowser && typeof customElements !== 'undefined';
const hasHTMLElement = isBrowser && typeof HTMLElement !== 'undefined';

// HTMLElement shim for SSR environments
// In SSR, we create a minimal class that satisfies the type system
// In browser, we use the real HTMLElement
const HTMLElementShim = hasHTMLElement
  ? HTMLElement
  : (class {
      // Minimal shim that satisfies TypeScript
      constructor() {}
      getAttribute(_name: string): string | null {
        return null;
      }
      setAttribute(_name: string, _value: string): void {
        // No-op in SSR
      }
      appendChild(_node: any): any {
        return null;
      }
    } as any as typeof HTMLElement);

// Global script loading state (shared across all component instances)
const globalScriptState: Record<
  string,
  { loaded: boolean; loading: boolean; error: string | null }
> = {};

interface MockEndpoint {
  pattern: string; // RegExp pattern as string
  response: any;
}

export class ComponentExampleElement extends HTMLElementShim {
  private container: HTMLDivElement | null = null;
  private originalFetch: typeof fetch | null = null;
  private checkInterval: ReturnType<typeof setInterval> | null = null;
  private scriptUrl: string = '';
  private mockEndpoints: MockEndpoint[] = [];

  static get observedAttributes() {
    return [
      'component-name',
      'component-tag',
      'script-url',
      'component-props',
      'mock-endpoints',
      'styles',
    ];
  }

  connectedCallback() {
    // Skip lifecycle logic in SSR
    if (!isBrowser) {
      return;
    }

    // Show loading state initially
    this.showLoading();
    this.initialize();
  }

  disconnectedCallback() {
    // Skip cleanup in SSR
    if (!isBrowser) {
      return;
    }

    this.cleanup();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    // Skip attribute changes in SSR
    if (!isBrowser) {
      return;
    }

    if (oldValue !== newValue) {
      this.initialize();
    }
  }

  private initialize() {
    // Guard against SSR
    if (!isBrowser || !document) {
      return;
    }

    const scriptUrl = this.getAttribute('script-url');
    if (!scriptUrl) {
      return;
    }

    this.scriptUrl = scriptUrl;

    // Parse mock endpoints
    const mockEndpointsAttr = this.getAttribute('mock-endpoints');
    if (mockEndpointsAttr) {
      try {
        this.mockEndpoints = JSON.parse(mockEndpointsAttr);
      } catch (e) {
        console.error('Failed to parse mock-endpoints:', e);
        this.mockEndpoints = [];
      }
    }

    // Setup fetch mocking
    this.setupFetchMocking();

    // Load script and render
    this.loadScript();
  }

  private setupFetchMocking() {
    // Guard against SSR - only mock fetch in browser
    if (!isBrowser || typeof window === 'undefined' || !window.fetch) {
      return;
    }

    // Store original fetch if not already stored
    if (!this.originalFetch) {
      this.originalFetch = window.fetch;
    }

    // Create mock fetch
    const mockFetch = async (
      input: RequestInfo | URL,
      init?: RequestInit
    ): Promise<Response> => {
      const url =
        typeof input === 'string'
          ? input
          : input instanceof URL
            ? input.toString()
            : input.url;

      // Check if this is an API call we should mock
      for (const endpoint of this.mockEndpoints) {
        try {
          const pattern = new RegExp(endpoint.pattern);
          if (pattern.test(url)) {
            // Return mocked response
            return new Response(JSON.stringify(endpoint.response), {
              status: 200,
              statusText: 'OK',
              headers: {
                'Content-Type': 'application/json',
              },
            });
          }
        } catch (e) {
          console.error('Invalid regex pattern:', endpoint.pattern, e);
        }
      }

      // For non-mocked requests, use original fetch
      if (this.originalFetch) {
        return this.originalFetch(input, init);
      }

      // Fallback (shouldn't happen)
      throw new Error('Original fetch not available');
    };

    // Replace global fetch (only in browser)
    window.fetch = mockFetch as typeof fetch;
  }

  private loadScript() {
    // Guard against SSR
    if (!isBrowser || !document || !document.head) {
      return;
    }

    if (!this.scriptUrl) {
      return;
    }

    // Initialize global script state if needed
    if (!globalScriptState[this.scriptUrl]) {
      globalScriptState[this.scriptUrl] = {
        loaded: false,
        loading: false,
        error: null,
      };
    }

    const scriptState = globalScriptState[this.scriptUrl];

    if (scriptState.loaded) {
      this.renderComponent();
    } else if (!scriptState.loading) {
      scriptState.loading = true;
      const script = document.createElement('script');
      script.type = 'module';
      script.src = this.scriptUrl;
      script.async = true;

      script.onload = () => {
        scriptState.loaded = true;
        scriptState.loading = false;
        this.renderComponent();
      };

      script.onerror = () => {
        const error = `Failed to load script: ${this.scriptUrl}`;
        scriptState.error = error;
        scriptState.loading = false;
        this.showError(error);
      };

      document.head.appendChild(script);
    } else {
      // Script is loading, wait for it (keep showing loading state)
      this.checkInterval = setInterval(() => {
        if (scriptState.loaded) {
          this.renderComponent();
          if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
          }
        } else if (scriptState.error) {
          this.showError(scriptState.error);
          if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
          }
        }
      }, 100);
    }
  }

  private renderComponent() {
    // Guard against SSR
    if (!isBrowser || !document) {
      return;
    }

    const componentTag = this.getAttribute('component-tag');
    if (!componentTag) {
      return;
    }

    // Create container if it doesn't exist
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.style.margin = '1rem 0';
      this.appendChild(this.container);
    }

    // Clear container
    this.container.innerHTML = '';

    // Inject styles if provided
    const styles = this.getAttribute('styles');
    if (styles) {
      const styleElement = document.createElement('style');
      styleElement.textContent = styles;
      this.container.appendChild(styleElement);
    }

    // Create web component element
    const element = document.createElement(componentTag);

    // Parse and set component props
    const componentPropsAttr = this.getAttribute('component-props');
    if (componentPropsAttr) {
      try {
        const componentProps = JSON.parse(componentPropsAttr);
        Object.entries(componentProps).forEach(([key, value]) => {
          if (typeof value === 'boolean') {
            if (value) {
              element.setAttribute(key, '');
            }
          } else {
            element.setAttribute(key, String(value));
          }
        });
      } catch (e) {
        console.error('Failed to parse component-props:', e);
      }
    }

    // Wrap the element in a div with the class component-example-children
    const wrapper = document.createElement('div');
    wrapper.className = 'component-example-children';
    wrapper.appendChild(element);
    this.container.appendChild(wrapper);
  }

  private showError(error: string) {
    // Guard against SSR
    if (!isBrowser || !document) {
      return;
    }

    if (!this.container) {
      this.container = document.createElement('div');
      this.appendChild(this.container);
    }

    this.container.innerHTML = `
      <div style="padding: 1rem; border: 1px solid #ff6b6b; border-radius: 4px; background-color: #ffe0e0;">
        <strong>Error loading component:</strong> ${error}
      </div>
    `;
  }

  private showLoading() {
    // Guard against SSR
    if (!isBrowser || !document) {
      return;
    }

    const componentName = this.getAttribute('component-name') || 'component';
    if (!this.container) {
      this.container = document.createElement('div');
      this.appendChild(this.container);
    }

    this.container.innerHTML = `
      <div style="padding: 1rem; text-align: center; color: #666;">
        Loading ${componentName}...
      </div>
    `;
  }

  private cleanup() {
    // Guard against SSR
    if (!isBrowser) {
      return;
    }

    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    // Restore original fetch (only if no other instances are using it)
    // Note: This is a simplified cleanup - in a real scenario, you might want
    // to track how many instances are using fetch mocking
    if (this.originalFetch && typeof window !== 'undefined' && window.fetch) {
      window.fetch = this.originalFetch;
      this.originalFetch = null;
    }
  }
}

// Register the custom element (only in browser with customElements support)
export function registerComponentExample() {
  // Guard against SSR - only register if customElements exists
  if (!hasCustomElements || !customElements) {
    return;
  }

  if (!customElements.get('component-example')) {
    customElements.define('component-example', ComponentExampleElement);
  }
}

// Auto-register if in browser environment with customElements support
// Only call if customElements exists (SSR-safe)
if (hasCustomElements) {
  registerComponentExample();
}

// Helper function to get React dynamically (available in MDX/Storybook context)
export function getReact() {
  // React is available in MDX/Storybook context, try to access it dynamically
  // Try multiple ways to access React (globalThis, window, require)
  let React: any;
  if (typeof globalThis !== 'undefined' && (globalThis as any).React) {
    React = (globalThis as any).React;
  } else if (typeof window !== 'undefined' && (window as any).React) {
    React = (window as any).React;
  } else if (typeof require !== 'undefined') {
    try {
      React = require('react');
    } catch (e) {
      // React not available via require
    }
  }

  if (!React) {
    throw new Error(
      'React is required but not available. Make sure you are using this in an MDX/React context where React is provided.'
    );
  }

  return React;
}

// Helper function to create component-example element without React dependency
// This uses React.createElement which is available in MDX/Storybook context
export function createComponentExample(props: {
  componentName: string;
  componentTag: string;
  scriptUrl: string;
  mockEndpoints: Array<{ pattern: string; response: any }>;
  componentProps?: Record<string, string | boolean>;
  styles?: string;
}) {
  const React = getReact();

  return React.createElement('component-example', {
    'component-name': props.componentName,
    'component-tag': props.componentTag,
    'script-url': props.scriptUrl,
    'mock-endpoints': JSON.stringify(props.mockEndpoints),
    'component-props': props.componentProps
      ? JSON.stringify(props.componentProps)
      : undefined,
    styles: props.styles,
  });
}
