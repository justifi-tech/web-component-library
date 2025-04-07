import { codeExampleHead } from '../../utils';

export default `<!DOCTYPE html>
<html dir="ltr" lang="en">

${codeExampleHead(
  'justifi-refund-payment',
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
    </style>`
)}

<body>
  <justifi-refund-payment
    payment-id="payment_123"
    account-id="acc_123"
    auth-token="web-component-token"
    hide-submit-button="true"
  />
  <button id="submit-refund-button">Submit Refund</button>
</body>

<script>
  (function () {
    var refundForm = document.querySelector("justifi-refund-payment");

    refundForm.addEventListener("submit-event", (event) => {
      /* this event is raised when the server response is received */
      console.log("server response received", event.detail.response);
    });

    refundForm.addEventListener("error-event", (event) => {
      // here is where you would handle the error
      console.error('error-event', event.detail);
    });

    // manually call Refund with provided method, if built-in submit button is hidden
    document.getElementById("submit-refund-button").addEventListener("click", () => {
      refundForm.refundPayment();
    });
  })();
</script>
</html>`;
