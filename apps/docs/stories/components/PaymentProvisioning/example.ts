import { codeExampleHead } from '../../utils';

export default `<!DOCTYPE html>
<html dir="ltr" lang="en">

${codeExampleHead('justifi-payment-provisioning')}

<body>
  <justifi-payment-provisioning
    business-id="<BUSINESS_ID>"
    auth-token="<WEBCOMPONENT_AUTH_TOKEN>">
  </justifi-payment-provisioning>
</body>

<script>
  (function () {
    var paymentProvisioning = document.querySelector("justifi-payment-provisioning");

    paymentProvisioning.addEventListener("submitted", (data) => {
      /* this event is raised when the server response is received */
      console.log("server response received", data);
    });

    paymentProvisioning.addEventListener("form-step-completed", (data) => {
      /* this event is raised when a form step is completed */
      let serverResponse = data.detail.data;
      let completedFormStep = data.detail.formStep;
      console.log("data from server", serverResponse);
      console.log("completed form step", completedFormStep);
    }

    paymentProvisioning.addEventListener("click-event", (data) => {
      let name = data.detail.name;

      if (name == "nextStep") {
        console.log("This is a next step button click", data);
      } else if (name == "previousStep") {
        console.log("This is a previous step button click", data);
      }
      /* this event is also raised when buttons are clicked in the Owner's section of the form */
    });
  })();
</script>

</html>`;
