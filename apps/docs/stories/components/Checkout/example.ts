import { codeExampleHead } from '../../utils';

export default `<!DOCTYPE html>
<html dir="ltr" lang="en">

${codeExampleHead(
  'justifi-checkout',
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
  <justifi-checkout 
    checkout-id="cho_123"
    auth-token="authToken"
  >
    <!-- Optional: add the insurance slot and component -->
    <div slot="insurance">
      <!-- see the insurance component docs for the full list of props -->
      <justifi-season-interruption-insurance checkout-id="abc123"></justifi-season-interruption-insurance>
    </div>
  </justifi-checkout>
  <button id="fill-billing-form-button">Fill Billing Form</button>
</body>

<script>
  (function () {
    var checkoutForm = document.querySelector("justifi-checkout");

    checkoutForm.addEventListener("submit-event", (event) => {
      /* this event is raised when the server response is received */
      console.log("server response received", event.detail.response);
    });

    checkoutForm.addEventListener("error-event", (event) => {
      // here is where you would handle the error
      console.error('error-event', event.detail);
    });

    // loaded event is raised when the form is fully loaded
    checkoutForm.addEventListener("loaded", () => {
      console.log("checkout form loaded");
    });

    // fill billing form button click event
    document.getElementById("fill-billing-form-button").addEventListener("click", () => {
      checkoutForm.fillBillingForm({
        name: "John",
        address_line1: "123 Main St",
        address_line2: "Apt 1",
        address_city: "Anytown",
        address_state: "NY",
        address_postal_code: "12345",
      });
  })();
</script>
</html>`;
