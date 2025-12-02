import { getReact } from './ComponentExample';

// Get React dynamically (available in MDX context)
const React = getReact();
const { useEffect, useRef, useState } = React;

// Global script loading state (shared across all component instances)
const globalScriptState: Record<string, { loaded: boolean; loading: boolean; error: string | null }> = {};

// Slot content for Layout 3
const slotContent = `
    <div class="checkout-container">
      <!-- Header Bar -->
      <div class="checkout-header">
        <div class="checkout-brand">
          <span class="checkout-back-arrow">←</span>
          <span class="checkout-brand-name">JustiFi Store</span>
        </div>
      </div>

      <!-- Main Container -->
      <div class="checkout-main-container">
        <!-- Left Column - Order Summary -->
        <div class="checkout-order-summary">
          <!-- Pay Header -->
          <div class="checkout-pay-header">
            <h1 class="checkout-pay-title">Pay JustiFi Store</h1>
            <div class="checkout-pay-amount">$39.99</div>
          </div>

          <!-- Product Item -->
          <div class="checkout-product-item">
            <div class="checkout-product-image">📚</div>
            <div class="checkout-product-details">
              <div class="checkout-product-name">Fintech Deployhandbook Test</div>
              <div class="checkout-product-description">How to deploy Fintech app...</div>
            </div>
            <div class="checkout-product-price">$39.99</div>
          </div>

          <!-- Summary Breakdown -->
          <div class="checkout-summary-breakdown">
            <div class="checkout-summary-row">
              <span>Subtotal</span>
              <span>$39.99</span>
            </div>
            <div class="checkout-summary-row tax">
              <div class="checkout-tax-info">
                <span>Tax</span>
                <span class="checkout-tax-icon">ⓘ</span>
              </div>
              <span class="checkout-tax-placeholder">Enter address to calculate</span>
            </div>
            <div class="checkout-summary-row total">
              <span>Total due</span>
              <span>$39.99</span>
            </div>
          </div>

          <!-- Footer -->
          <div class="checkout-footer">
            <div class="checkout-powered-by">
              Powered by <span class="checkout-justifi-text">JustiFi</span>
            </div>
            <div class="checkout-footer-links">
              <a href="#" class="checkout-footer-link">Terms</a>
              <a href="#" class="checkout-footer-link">Privacy</a>
            </div>
          </div>
        </div>

        <!-- Right Column - Payment Form -->
        <div class="checkout-payment-form">
          <h2 class="checkout-form-title">Pay with card</h2>

          <!-- Email Field -->
          <div class="checkout-form-field">
            <label class="checkout-form-label">Email</label>
            <input type="email" placeholder="Enter your email" class="checkout-form-input" />
          </div>

          <!-- Card Information -->
          <div class="checkout-form-field">
            <justifi-card-form></justifi-card-form>
            <justifi-card-billing-form-simple></justifi-card-billing-form-simple>
          </div>

          <!-- Name on Card -->
          <div class="checkout-form-field">
            <label class="checkout-form-label">Name on card</label>
            <input type="text" placeholder="Enter cardholder name" class="checkout-form-input" />
          </div>

          <!-- Billing Address -->
          <div class="checkout-form-field">
            <label class="checkout-form-label">Billing address</label>
            <div style="margin-bottom: 45px;">
              <select class="checkout-form-select">
                <option>United States</option>
                <option>Canada</option>
              </select>
            </div>
            <div style="margin-bottom: 15px;">
              <input type="text" placeholder="Address" class="checkout-form-input" />
            </div>
            <a href="#" class="checkout-manual-link">Enter address manually</a>
          </div>

          <!-- Save Info Checkbox -->
          <div class="checkout-checkbox-container">
            <justifi-save-new-payment-method label="Save this for next time"></justifi-save-new-payment-method>
          </div>

          <!-- Pay Button -->
          <button class="checkout-pay-button" id="submit-button">
            Pay
          </button>
        </div>
      </div>
    </div>
  `;

// Styles for Layout 3
const styles = `
/* Checkout Layout Styles */

.checkout-container * {
  display: block;
  box-sizing: border-box;
}

.checkout-container {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f8f9fa;
  color: #333;
  min-height: 100vh;
}

/* Header Bar */
.checkout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
}

.checkout-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.checkout-back-arrow {
  font-size: 20px;
}

.checkout-brand-name {
  font-size: 18px;
  font-weight: 500;
}

/* Main Container */
.checkout-main-container {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  gap: 40px;
}

/* Left Column - Order Summary */
.checkout-order-summary {
  display: flex;
  flex-direction: column;
  gap: 30px;
  flex: 0 0 45%;
  padding: 15px;
}

.checkout-pay-header {
  margin-bottom: 30px;
}

.checkout-pay-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 10px 0;
}

.checkout-pay-amount {
  font-size: 32px;
  font-weight: bold;
  color: #333;
}

.checkout-product-item {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.checkout-product-image {
  width: 60px;
  height: 80px;
  background-color: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #666;
}

.checkout-product-details {
  flex: 1;
}

.checkout-product-name {
  font-weight: 500;
  color: #333;
  margin-bottom: 5px;
}

.checkout-product-description {
  font-size: 14px;
  color: #666;
}

.checkout-product-price {
  font-weight: 600;
  color: #333;
}

.checkout-summary-breakdown {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 30px;
}

.checkout-summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
}

.checkout-summary-row.tax {
  align-items: center;
}

.checkout-tax-info {
  display: flex;
  align-items: center;
  gap: 5px;
}

.checkout-tax-icon {
  font-size: 12px;
  color: #666;
}

.checkout-tax-placeholder {
  color: #666;
}

.checkout-summary-row.total {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  padding-top: 10px;
  border-top: 1px solid #e0e0e0;
}

.checkout-footer {
  margin-top: auto;
  font-size: 12px;
  color: #666;
}

.checkout-powered-by {
  margin-bottom: 10px;
}

.checkout-justifi-text {
  font-weight: 600;
}

.checkout-footer-links {
  display: flex;
  gap: 20px;
}

.checkout-footer-link {
  color: #007bff;
  text-decoration: none;
}

/* Right Column - Payment Form */
.checkout-form-field justifi-card-form {
  margin-bottom: 15px;
}

.checkout-payment-form {
  display: flex;
  flex-direction: column;
  flex: 0 0 50%;
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.checkout-form-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 30px 0;
}

.checkout-form-field:not(:first-of-type) {
  margin-bottom: 25px;
}

.checkout-form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.checkout-form-input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  background-color: white;
}

.checkout-form-select {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  background-color: white;
  color: #333;
}

.checkout-manual-link {
  color: #007bff;
  text-decoration: none;
  font-size: 14px;
}

.checkout-pay-button {
  width: 100%;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.checkout-pay-button:hover {
  background-color: #0056b3;
}

.checkout-checkbox-container {
  margin-bottom: 45px;
}

/* Web Component Parts Styling */
::part(font-family) {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

::part(color) {
  color: #333;
}

::part(background-color) {
  background-color: white;
}

::part(input) {
  border-color: #e0e0e0;
  border-width: 1px;
  border-radius: 6px;
  border-style: solid;
  box-shadow: none;
  font-size: 14px;
  font-weight: normal;
  line-height: 1.5;
  padding: 12px 15px;
  background-color: white;
}

::part(input-focused) {
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
}

::part(input-invalid) {
  border-color: #dc3545;
  box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.1);
}

::part(label) {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

::part(button) {
  padding: 12px 15px;
  font-size: 14px;
  box-shadow: none;
  border-radius: 6px;
  line-height: 1.5;
  text-transform: none;
}

::part(button-primary) {
  color: #ffffff;
  background-color: #007bff;
  border-color: #007bff;
}

::part(button-primary):hover {
  background-color: #0056b3;
  border-color: #0056b3;
  color: #ffffff;
}
`;

export const ModularCheckoutLayout3Example = () => {
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
        Loading Layout 3...
      </div>
    );
  }

  return (
    <div>
      <div ref={containerRef} style={{ margin: '1rem 0' }} />
    </div>
  );
};

