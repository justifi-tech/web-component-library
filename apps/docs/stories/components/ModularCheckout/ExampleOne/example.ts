import { codeExampleHead } from '../../../utils';

export const codeExampleFull = `
<!DOCTYPE html>
<html dir="ltr" lang="en">

${codeExampleHead(
  'justifi-modular-checkout',
  `<style>
    ::part(font-family) {
      font-family: sans-serif;
    }

    ::part(color) {
      color: #333;
    }

    ::part(background-color) {
      background-color: transparent;
    }

    ::part(input) {
      border-color: #e0e0e0;
      border-width: 1px;
      border-radius: 4px;
      box-shadow: none;
      font-size: 14px;
      font-weight: normal;
      line-height: 1.5;
      padding: 12px;
    }

    ::part(input-focused) {
      border-color: #007bff;
      box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, 0.25);
    }

    ::part(input-invalid) {
      border-color: #dc3545;
      box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
    }

    ::part(input-invalid-and-focused) {
      box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
      border-color: #dc3545;
    }

    ::part(label) {
      font-size: 14px;
      color: #333;
      font-weight: 500;
      margin-bottom: 8px;
    }
  </style>`
)}

<body>
  <justifi-modular-checkout
    auth-token="authToken"
    account-id="acc_123"
    checkout-id="cho_123"
    save-payment-method="true"
  >
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      fontFamily: 'sans-serif',
      color: '#333'
    }}>
      <!-- Donation Total Header -->
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        fontSize: '16px',
        color: '#666'
      }}>
        <span>Donation Total</span>
        <span>$10.00</span>
      </div>

      <!-- Main Payment Form Container -->
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <!-- Header with Radio Button -->
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '20px',
          fontSize: '16px',
          color: '#333'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: '#28a745',
            marginRight: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'white'
            }}></div>
          </div>
          <span>Donate with Stripe Payment Element</span>
        </div>

        <!-- Payment Method Selection -->
        <div style={{
          display: 'flex',
          gap: '15px',
          marginBottom: '20px'
        }}>
          <div style={{
            flex: '1',
            border: '2px solid #007bff',
            borderRadius: '8px',
            padding: '15px',
            textAlign: 'center',
            backgroundColor: 'white',
            cursor: 'pointer'
          }}>
            <div style={{
              fontSize: '24px',
              marginBottom: '8px',
              color: '#007bff'
            }}>💳</div>
            <div style={{ fontSize: '14px', color: '#333' }}>Card</div>
          </div>
          <div style={{
            flex: '1',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '15px',
            textAlign: 'center',
            backgroundColor: 'white',
            cursor: 'pointer'
          }}>
            <div style={{
              fontSize: '24px',
              marginBottom: '8px',
              color: '#00d632'
            }}>$</div>
            <div style={{ fontSize: '14px', color: '#333' }}>Cash App Pay</div>
          </div>
          <div style={{
            flex: '1',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '15px',
            textAlign: 'center',
            backgroundColor: 'white',
            cursor: 'pointer'
          }}>
            <div style={{
              fontSize: '24px',
              marginBottom: '8px',
              color: '#666'
            }}>🏦</div>
            <div style={{ fontSize: '14px', color: '#333' }}>US bank account</div>
          </div>
        </div>

        <!-- Card Form -->
        <div style={{ marginBottom: '20px' }}>
          <justifi-card-form />
        </div>

        <!-- Country and ZIP Fields -->
        <div style={{
          display: 'flex',
          gap: '15px'
        }}>
          <div style={{ flex: '1' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              color: '#333',
              fontWeight: '500'
            }}>Country</label>
            <select style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              fontSize: '14px',
              backgroundColor: 'white',
              color: '#333'
            }}>
              <option>United States</option>
              <option>Canada</option>
              <option>United Kingdom</option>
              <option>Australia</option>
              <option>New Zealand</option>
              <option>Other</option>
            </select>
          </div>
          <div style={{ flex: '1' }}>
            <justifi-postal-code-form />
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <button 
        id="submit-button"
        style={{
          width: '100%',
          padding: '15px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer'
        }}
      >
        Donate Now
      </button>
    </div>
  </justifi-modular-checkout>
</body>

<script>
  (function() {
    const modularCheckout = document.querySelector('justifi-modular-checkout');
    const submitButton = document.querySelector('#submit-button');
    
    // Submit checkout
    submitButton.addEventListener('click', async () => {
      await modularCheckout.submitCheckout();
    });

    // Handle checkout completion
    modularCheckout.addEventListener('submit-event', (event) => {
      console.log('Checkout completed successfully!', event.detail);
    });

    // Handle errors
    modularCheckout.addEventListener('error-event', (event) => {
      console.error('Checkout error:', event.detail);
    });

    // Handle payment method changes
    modularCheckout.addEventListener('payment-method-changed', (event) => {
      console.log('Selected payment method changed to:', event.detail);
    });
  })();
</script>
</html>
`;
