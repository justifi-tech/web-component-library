import React, { useEffect, useRef, useState } from 'react';

// Global script loading state (shared across all component instances)
const globalScriptState: Record<string, { loaded: boolean; loading: boolean; error: string | null }> = {};

// Slot content for Layout 2
const slotContent = `
    <div class="checkout-page">
      <!-- Header -->
      <div class="checkout-header">
        <div class="checkout-brand">
          <span class="checkout-brand-primary">JustiFi</span>
          <span class="checkout-brand-secondary">BREW</span>
        </div>
        <div class="checkout-nav">
          <a href="#" class="checkout-nav-link">SHOP</a>
          <a href="#" class="checkout-nav-link">LEARN</a>
          <div class="checkout-cart-icon">
            🛒
            <div class="checkout-cart-badge">1</div>
          </div>
        </div>
      </div>

      <!-- Main Container -->
      <div class="checkout-main">
        <!-- Checkout Section -->
        <div class="checkout-left-column">
          <h1 class="checkout-title">Checkout</h1>
          
          <hr class="checkout-divider" />
          
          <!-- Shipping Section -->
          <div class="checkout-section">
            <div class="checkout-section-header">
              <h2 class="checkout-section-title">Shipping</h2>
              <a href="#" class="checkout-edit-link">Edit</a>
            </div>
            <div class="checkout-shipping-info">
              <div>John Doe</div>
              <div>123 Main St, Anytown, USA</div>
              <div>Standard Shipping: Free</div>
              <div class="checkout-shipping-arrival">Arrive Thursday, October 31st</div>
            </div>
          </div>

          <hr class="checkout-divider" />

          <!-- Payment Method Section -->
          <div class="checkout-section">
            <h2 class="checkout-section-title">Payment Method</h2>
            
            <button class="checkout-apple-pay-button">
              <span>Apple Pay</span>
            </button>
            
            <div class="checkout-or-divider">
              <div class="checkout-or-line left"></div>
              <span class="checkout-or-text">or</span>
              <div class="checkout-or-line right"></div>
            </div>

            <div class="checkout-form-container">
              <justifi-card-form></justifi-card-form>
              <justifi-card-billing-form-simple></justifi-card-billing-form-simple>
            </div>

            <button class="checkout-submit-button" id="submit-button">
              PLACE ORDER
            </button>
            
            <div class="checkout-terms">
              By clicking Place Order you agree to the <a href="#" class="checkout-terms-link">Terms & Conditions.</a>
            </div>
          </div>
        </div>

        <!-- Shopping Cart Section -->
        <div class="checkout-right-column">
          <div class="checkout-cart-container">
            <div class="checkout-cart-header">
              <h2 class="checkout-cart-title">Shopping Cart</h2>
              <a href="#" class="checkout-edit-link">Edit</a>
            </div>
            
            <div class="checkout-summary">
              <div class="checkout-summary-row">
                <span>Subtotal</span>
                <span>$38.00</span>
              </div>
              <div class="checkout-summary-row">
                <span>Shipping Fee</span>
                <span>Free</span>
              </div>
              <div class="checkout-summary-row">
                <span>Tax</span>
                <span>$4.00</span>
              </div>
              <div class="checkout-summary-total">
                <span>Order Total</span>
                <span>$42.00</span>
              </div>
            </div>
            
            <div class="checkout-items-section">
              <div class="checkout-items-header">
                <span>ITEM</span>
                <span class="checkout-items-header-qty">QTY</span>
                <span class="checkout-items-header-price">PRICE</span>
              </div>
              <div class="checkout-item">
                <div>
                  <div class="checkout-item-name">Drip Coffee Funnel</div>
                  <div class="checkout-item-description">8 cups / 64 ounces</div>
                </div>
                <div class="checkout-item-qty">1</div>
                <div class="checkout-item-price">$38.00</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

// Styles for Layout 2
const styles = `
/* ExampleTwo Styles */
.checkout-page {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #ffffff;
  color: #000000;
}

.checkout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  border-bottom: 1px solid #e0e0e0;
}

.checkout-brand {
  font-size: 24px;
  font-weight: bold;
}

.checkout-brand-primary {
  color: #2d5a27;
}

.checkout-brand-secondary {
  color: #4a7c59;
}

.checkout-nav {
  display: flex;
  align-items: center;
  gap: 30px;
}

.checkout-nav-link {
  text-decoration: none;
  color: #000000;
  font-weight: 500;
  text-transform: uppercase;
  font-size: 14px;
}

.checkout-cart-icon {
  position: relative;
  cursor: pointer;
}

.checkout-cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #000000;
  color: #ffffff;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.checkout-main {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  gap: 40px;
}

.checkout-left-column {
  flex: 2;
}

.checkout-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 30px;
  color: #000000;
}

.checkout-divider {
  margin: 30px 0;
  border: none;
  border-top: 1px solid #e0e0e0;
}

.checkout-section {
  margin-bottom: 30px;
}

.checkout-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.checkout-section-title {
  font-size: 18px;
  font-weight: bold;
  color: #000000;
}

.checkout-edit-link {
  color: #2d5a27;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
}

.checkout-shipping-info {
  line-height: 1.6;
  color: #000000;
}

.checkout-shipping-arrival {
  font-weight: bold;
}

.checkout-apple-pay-button {
  width: 100%;
  background-color: #000000;
  border: none;
  padding: 15px;
  border-radius: 4px;
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.checkout-or-divider {
  text-align: center;
  margin: 20px 0;
  position: relative;
}

.checkout-or-line {
  position: absolute;
  top: 50%;
  height: 1px;
  background-color: #e0e0e0;
  width: 30%;
}

.checkout-or-line.left {
  left: 15%;
}

.checkout-or-line.right {
  right: 15%;
}

.checkout-or-text {
  background-color: #ffffff;
  padding: 0 15px;
  color: #666666;
  font-size: 14px;
}

.checkout-form-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.checkout-submit-button {
  width: 100%;
  background-color: #2d5a27;
  border: none;
  padding: 15px;
  border-radius: 4px;
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  margin-top: 20px;
}

.checkout-terms {
  font-size: 12px;
  color: #666666;
  margin-top: 10px;
  text-align: center;
}

.checkout-terms-link {
  color: #2d5a27;
  text-decoration: none;
}

.checkout-right-column {
  flex: 1;
}

.checkout-cart-container {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 20px;
  background-color: #ffffff;
}

.checkout-cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.checkout-cart-title {
  font-size: 18px;
  font-weight: bold;
  color: #000000;
}

.checkout-summary {
  margin-bottom: 20px;
}

.checkout-summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.checkout-summary-total {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  font-size: 16px;
  border-top: 1px solid #e0e0e0;
  padding-top: 10px;
  margin-top: 10px;
}

.checkout-items-section {
  border-top: 1px solid #e0e0e0;
  padding-top: 15px;
}

.checkout-items-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 10px;
  margin-bottom: 15px;
  font-size: 12px;
  color: #666666;
  text-transform: uppercase;
  font-weight: 500;
}

.checkout-items-header-qty {
  text-align: center;
}

.checkout-items-header-price {
  text-align: right;
}

.checkout-item {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 10px;
  align-items: start;
}

.checkout-item-name {
  font-weight: 500;
  color: #000000;
}

.checkout-item-description {
  font-size: 12px;
  color: #666666;
  margin-top: 2px;
}

.checkout-item-qty {
  text-align: center;
  color: #000000;
}

.checkout-item-price {
  text-align: right;
  color: #000000;
}
`;

export const ModularCheckoutLayout2Example: React.FC = () => {
  const scriptUrl = 'https://cdn.jsdelivr.net/npm/@justifi/webcomponents@latest/dist/webcomponents/webcomponents.esm.js';
  const [scriptLoaded, setScriptLoaded] = useState(globalScriptState[scriptUrl]?.loaded || false);
  const [scriptError, setScriptError] = useState<string | null>(globalScriptState[scriptUrl]?.error || null);
  const containerRef = useRef<HTMLDivElement>(null);
  const originalFetchRef = useRef<typeof fetch | null>(null);

  // Mock checkout endpoints
  const checkoutGetPattern = /\/v1\/checkouts\/[^/]+$/;
  const checkoutPostPattern = /\/v1\/checkouts\/[^/]+\/complete$/;
  
  const mockGetCheckout = {
    "id": "cho_qkHk4NXnSV0PVulNY4M8J",
    "type": "checkout",
    "page_info": null,
    "data": {
      "id": "cho_qkHk4NXnSV0PVulNY4M8J",
      "payment_intent_id": null,
      "account_id": "acc_5Et9iXrSSAZR2KSouQGAWi",
      "platform_account_id": "acc_3reNb4aNYy2iWDZQVczmx4",
      "payment_amount": 1799,
      "payment_currency": "USD",
      "payment_description": "One Chocolate Donut",
      "payment_methods": [],
      "payment_method_group_id": "pmg_12TH1LBNpsrdEXxWyxFjQv",
      "status": "expired",
      "mode": "test",
      "payment_settings": {
        "ach_payments": true,
        "bnpl_payments": true,
        "credit_card_payments": true
      },
      "successful_payment_id": null,
      "statement_descriptor": null,
      "application_fees": null,
      "created_at": "2024-08-08T15:47:45.376Z",
      "updated_at": "2024-08-27T14:31:35.549Z",
      "total_amount": 1799,
      "insurance_amount": 0,
      "payment_client_id": "test_e94e298293426cacb29c953b2047d6e8",
      "completions": []
    }
  };

  const mockPostCheckout = {
    "id": "cho_qkHk4NXnSV0PVulNY4M8J",
    "type": "checkout",
    "page_info": null,
    "data": {
      "id": "cho_qkHk4NXnSV0PVulNY4M8J",
      "payment_intent_id": null,
      "account_id": "acc_5Et9iXrSSAZR2KSouQGAWi",
      "platform_account_id": "acc_3reNb4aNYy2iWDZQVczmx4",
      "payment_amount": 1799,
      "payment_currency": "USD",
      "payment_description": "One Chocolate Donut",
      "payment_methods": [],
      "payment_method_group_id": "pmg_12TH1LBNpsrdEXxWyxFjQv",
      "status": "expired",
      "mode": "test",
      "payment_settings": {
        "ach_payments": true,
        "bnpl_payments": true,
        "credit_card_payments": true,
        "insurance_payments": true
      },
      "successful_payment_id": null,
      "statement_descriptor": null,
      "application_fees": null,
      "created_at": "2024-08-08T15:47:45.376Z",
      "updated_at": "2024-08-27T14:31:35.549Z",
      "total_amount": 1799,
      "insurance_amount": 0,
      "payment_client_id": "test_e94e298293426cacb29c953b2047d6e8",
      "completions": []
    }
  };

  useEffect(() => {
    // Store original fetch
    originalFetchRef.current = window.fetch;

    // Create mock fetch
    const mockFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;

      // Mock checkout GET endpoint
      if (checkoutGetPattern.test(url)) {
        return new Response(JSON.stringify(mockGetCheckout), {
          status: 200,
          statusText: 'OK',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      // Mock checkout POST endpoint
      if (checkoutPostPattern.test(url)) {
        return new Response(JSON.stringify(mockPostCheckout), {
          status: 200,
          statusText: 'OK',
          headers: {
            'Content-Type': 'application/json',
          },
        });
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
  }, [scriptUrl]);

  // Render component once script is loaded
  useEffect(() => {
    if (scriptLoaded && containerRef.current) {
      // Clear container
      containerRef.current.innerHTML = '';

      // Inject styles
      const styleElement = document.createElement('style');
      styleElement.textContent = styles;
      containerRef.current.appendChild(styleElement);

      // Create web component element
      const element = document.createElement('justifi-modular-checkout');
      element.setAttribute('auth-token', 'mock-token');
      element.setAttribute('checkout-id', 'cho_123');

      // Inject slot content
      element.innerHTML = slotContent;

      // Wrap the element in a div with the class component-example-children
      const wrapper = document.createElement('div');
      wrapper.className = 'component-example-children';
      wrapper.appendChild(element);
      containerRef.current.appendChild(wrapper);
    }
  }, [scriptLoaded]);

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
        Loading Layout 2...
      </div>
    );
  }

  return (
    <div>
      <div ref={containerRef} style={{ margin: '1rem 0' }} />
    </div>
  );
};

