import { getReact } from './ComponentExample';

// Get React dynamically (available in MDX context)
const React = getReact();
const { useEffect, useRef, useState } = React;

// Global script loading state (shared across all component instances)
const globalScriptState: Record<string, { loaded: boolean; loading: boolean; error: string | null }> = {};

// Slot content for Layout 1
const slotContent = `
    <div class="donation-container">
      <!-- Donation Total Header -->
      <div class="donation-header">
        <span>Donation Total</span>
        <span>$10.00</span>
      </div>

      <!-- Main Payment Form Container -->
      <div class="payment-form-container">
        <!-- Payment Method Selection -->
        <div class="payment-method-selection">
          <div class="payment-method-card selected" data-payment-method="card">
            <div class="payment-method-text">Card</div>
          </div>
          <div class="payment-method-card" data-payment-method="bank">
            <div class="payment-method-text">Bank account</div>
          </div>
          <div class="payment-method-card dark" data-payment-method="apple">
            <div class="payment-method-text">Apple Pay</div>
          </div>
        </div>

        <!-- Card Form -->
        <div class="card-form-container" data-form-type="card">
          <justifi-card-form></justifi-card-form>
        </div>

        <!-- Bank Account Form -->
        <div class="bank-account-form-container" data-form-type="bank" style="display: none;">
          <justifi-bank-account-form></justifi-bank-account-form>
        </div>

        <!-- Country and ZIP Fields -->
          <div class="country-zip-container">
          <div class="country-field">
            <label class="form-label">Country</label>
            <select class="form-select">
              <option>United States</option>
              <option>Canada</option>
            </select>
          </div>
          <div class="zip-field">
            <justifi-card-billing-form-simple></justifi-card-billing-form-simple>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <button class="submit-button">
        <span>Donate Now</span>
      </button>
    </div>
  `;

// Styles for Layout 1
const styles = `
/* ExampleOne Styles */
.donation-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
  max-width: 600px;
  margin: 0 auto;
  font-family: sans-serif;
  color: #333;
}

.donation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 16px;
  color: #666;
}

.payment-form-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.payment-header {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 20px;
  font-size: 16px;
  color: #333;
}

.radio-button {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #28a745;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.radio-button-inner {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: white;
}

.payment-method-selection {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.payment-method-card {
  flex: 1;
  border: 2px solid #007bff;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.payment-method-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.payment-method-card.dark {
  background-color: #333;
}

.payment-method-card.dark .payment-method-text {
  color: white;
  font-weight: 600;
}

.payment-method-card.selected {
  border: 2px solid #007bff;
  background-color: #f8f9ff;
}

.payment-method-card:not(.selected) {
  border: 1px solid #e0e0e0;
}

.payment-method-text {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.card-form-container {
  margin-bottom: 20px;
}

.bank-account-form-container {
  margin-bottom: 20px;
}

.country-zip-container {
  display: flex;
  gap: 15px;
}

.country-field {
  flex: 1;
}

.zip-field {
  flex: 1;
}

.form-label {
  font-family: -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
  display: block;
  margin-bottom: 10px;
  font-size: 1rem;
  color: #333;
  font-weight: 500;
  line-height: 1.5;
}

.form-select {
  width: 100%;
  padding: 0.325rem 0.75rem;
  padding-right: 2.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  background-color: white;
  color: #333;
  /* Reset Safari default styles */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  /* Ensure consistent styling */
  font-family: inherit;
  line-height: 1.5;
  /* Remove Safari's default focus outline */
  outline: none;
  /* Custom dropdown arrow */
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1em;
}

/* Custom dropdown arrow for webkit browsers */
.form-select::-ms-expand {
  display: none;
}

.submit-button {
  width: 100%;
  padding: 15px;
  background-color: #28a745;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.submit-button:hover {
  background-color: #218838;
}
`;

export const ModularCheckoutLayout1Example = () => {
  const scriptUrl = 'https://cdn.jsdelivr.net/npm/@justifi/webcomponents@latest/dist/webcomponents/webcomponents.esm.js';
  const [scriptLoaded, setScriptLoaded] = useState(globalScriptState[scriptUrl]?.loaded || false);
  const [scriptError, setScriptError] = useState<string | null>(globalScriptState[scriptUrl]?.error || null);
  const containerRef = useRef<HTMLDivElement>(null);
  const originalFetchRef = useRef<typeof fetch | null>(null);

  // Mock checkout endpoints
  const checkoutGetPattern = /\/v1\/checkouts\/[^/]+$/;
  const checkoutPostPattern = /\/v1\/checkouts\/[^/]+\/complete$/;
  
  // Import mock data - we'll need to fetch it or inline it
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
        Loading Layout 1...
      </div>
    );
  }

  return (
    <div>
      <div ref={containerRef} style={{ margin: '1rem 0' }} />
    </div>
  );
};

