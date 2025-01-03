import { codeExampleHead } from "../../utils";

export default `<!DOCTYPE html>
<html dir="ltr" lang="en">

${codeExampleHead("justifi-payment-provisioning")}

<body>
  <justifi-payment-provisioning
    business-id="<BUSINESS_ID>"
    auth-token="<WEBCOMPONENT_AUTH_TOKEN>">
  </justifi-payment-provisioning>
</body>

<script>
  (function () {
    var paymentProvisioning = document.querySelector("justifi-payment-provisioning");

    paymentProvisioning.addEventListener("submit-event", (event) => {
      /* this event is raised when the server response at the end of the form, when the provisioning request is completed */
      console.log("server response received", event.detail);
    });

    paymentProvisioning.addEventListener("complete-form-step-event", (event) => {
      /* this event is raised when a form step is completed */

      let serverResponse = event.detail.data;
      let completedFormStep = event.detail.formStep;
      
      console.log("data from server", serverResponse);
      console.log("completed form step", completedFormStep);
    }

    paymentProvisioning.addEventListener("click-event", (event) => {
      let name = event.detail.name;

      if (name == "nextStep") {
        console.log("This is a next step button click", data);
      } else if (name == "previousStep") {
        console.log("This is a previous step button click", data);
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
