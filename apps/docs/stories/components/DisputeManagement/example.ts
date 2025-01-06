import { codeExampleHead } from "../../utils";

export const codeExampleFull = `
<!DOCTYPE html>
<html dir="ltr" lang="en">

${codeExampleHead("justifi-dispute-management")}

<body>
  <justifi-dispute-management disputeId="disputeId" authToken="authToken">
  </justifi-dispute-management>
</body>

<script>
</script>

</html>`;

export const codeExampleEventHandling = `
<justifi-dispute-management />

<script>
  (function() {
    const disputeManagement = document.querySelector("justifi-dispute-management");
    
    disputeManagement.addEventListener("submit-event", (event) => {
      /* this event is raised when the server response is received at the end of the dispute response or when a dispute is accepted */
      console.log("server response received", event.detail.response);
    });

    disputeManagement.addEventListener("complete-form-step-event", (event) => {
      /* this event is raised when a form step is completed */

      let serverResponse = event.detail.response;
      let completedFormStep = event.detail.formStep;

      console.log("data from server", serverResponse);
      console.log("completed form step", completedFormStep);
    });

    disputeManagement.addEventListener("click-event", (event) => {
      let name = event.detail.name;
      
      console.log("Clicked item", event.detail);
      console.log("Clicked item name", name);
      
      /* Possible values for name are: nextStep, previousStep, cancelDispute, respondToDispute, and submit */
    });

    disputeManagement.addEventListener("error-event", (event) => {
      // here is where you would handle the error
      console.log("error-event", event.detail);
    });
  })();
`;