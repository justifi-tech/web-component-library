import { codeExampleHead } from '../../utils';

export default `<!DOCTYPE html>
<html dir="ltr" lang="en">

${codeExampleHead(
  'justifi-payment-provisioning',
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
        
      ::part(button) {
        padding: 0.375rem 0.75rem;
        font-size: 16px;
        box-shadow: none;
        border-radius: 0px;
        line-height: 1.5;
        text-transform: none;
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

      ::part(button-disabled) {
        opacity: 0.5;
      }

      ::part(tooltip-inner) {
        color: #fff;
      }
    </style>`
)}

<body>
  <justifi-payment-provisioning
    business-id="biz_123"
    auth-token="authToken"
  />
</body>

<script>
  (function () {
    var paymentProvisioning = document.querySelector("justifi-payment-provisioning");

    paymentProvisioning.addEventListener("submit-event", (event) => {
      /* this event is raised when the server response at the end of the form, when the provisioning request is completed */
      console.log("server response received", event.detail.response);
    });

    paymentProvisioning.addEventListener("complete-form-step-event", (event) => {
      /* this event is raised when a form step is completed */

      let serverResponse = event.detail.response;
      let completedFormStep = event.detail.formStep;
      
      console.log("data from server", serverResponse);
      console.log("completed form step", completedFormStep);
    }

    paymentProvisioning.addEventListener("click-event", (event) => {
      let name = event.detail.name;

      if (name == "nextStep") {
        console.log("This is a next step button click");
      } else if (name == "previousStep") {
        console.log("This is a previous step button click");
      }
      /* this event is also raised when buttons are clicked in the Owner's section of the form */
    });

    paymentProvisioning.addEventListener("error-event", (event) => {
      // here is where you would handle the error
      console.log("error-event", event.detail);
    });
  })();
</script>

</html>`;
