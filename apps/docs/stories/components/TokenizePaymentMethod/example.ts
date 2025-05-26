import { codeExampleHead } from '../../utils';

export default `<!DOCTYPE html>
<html dir="ltr" lang="en">

${codeExampleHead(
  'justifi-payment-form',
  `<style>
    ::part(font-family) {
      font-family: georgia;
    }

    ::part(color) {
      color: darkslategray;
    }

    ::part(background-color) {
      background-color: transparent;
    }

    ::part(button) {
      padding: 0.375rem 0.75rem;
      font-size: 16px;
      box-shadow: none;
      border-radius: 0px;
      line-height: 1.5;
      text-transform: none;
    }

    ::part(button-disabled) {
      opacity: 0.5;
    }

    ::part(input) {
      border-color: #555;
      border-width: 1px;
      border-bottom-width: 1px;
      border-left-width: 1px;
      border-right-width: 1px;
      border-top-width: 1px;
      border-radius: 0;
      border-style: solid;
      box-shadow: none;
      font-size: 1rem;
      font-weight: normal;
      line-height: 1.5;
      padding: 0.375rem 0.75rem;
    }

    ::part(input-focused) {
      border-color: #333;
      box-shadow: 0 0 0 0.25rem rgba(0, 0, 0, 0.25);
    }

    ::part(input-invalid) {
      border-color: #8a2a35;
      box-shadow: 0 0 0 0.25rem rgba(244, 67, 54, 0.25);
    }

    ::part(input-invalid-and-focused) {
      box-shadow: 0 0 0 0.25rem rgba(244, 67, 54, 0.25);
      border-color: #8a2a35;
    }

    ::part(input-radio) {
      background-color: #fff;
      border-color: #333;
    }

    ::part(input-checkbox) {
      border-color: #333;
    }
    
    ::part(input-checkbox-checked) {
      background-color: #000;
      border-color: #333;
    }

    ::part(input-checkbox-checked-focused) {
      background-color: #000;
      box-shadow: 0 0 0 0.25rem rgba(0, 0, 0, 0.25);
    }

    ::part(input-checkbox-focused) {
      background-color: #fff;
      box-shadow: 0 0 0 0.25rem rgba(0, 0, 0, 0.25);
    }

    ::part(button-primary) {
      color: #333;
      background-color: transparent;
      border-color: #333;
    }

    ::part(button-primary):hover {
      background-color: rgba(0, 0, 0, .05);
      border-color: #333;
      color: #333;
    }

    ::part(radio-list-item) {
      border-bottom: 1px solid #ddd;
    }
    
    ::part(radio-list-item):hover {
      background-color: #f9f9f9;
      cursor: pointer;
    }
    </style>`
)}

  <body>
    <justifi-tokenize-payment-method
      account-id="acc_123"
      auth-token="authToken"
    />
  </body>

  <script>
    const justifiTokenizePaymentMethod = document.querySelector("justifi-tokenize-payment-method");

    justifiTokenizePaymentMethod.addEventListener("submit-event", (event) => {
      const token = event.detail.response.token;

      console.log("Token from tokenize response:", token);
    });

    justifiTokenizePaymentMethod.addEventListener("error-event", (event) => {
      console.log(event);
    });

    // tokenize, if built-in submit button is hidden
    document.getElementById("tokenize-button").addEventListener("click", () => {
      justifiTokenizePaymentMethod.tokenizePaymentMethod();
    });

    // fill billing form
    document.getElementById("fill-billing-form").addEventListener("click", () => {
      justifiTokenizePaymentMethod.fillBillingForm({
        name: "John",
        address_line1: "123 Main St",
        address_line2: "Apt 1",
        address_city: "Anytown",
        address_state: "NY", // Use 2-letter state code
        address_postal_code: "12345",
      });
    }); 

  </script>

</html>`;
