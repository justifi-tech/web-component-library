import { codeExampleHead } from "../utils";

export default `<!DOCTYPE html>
<html dir="ltr" lang="en">

${codeExampleHead("justifi-business-form")}

<body>
  <justifi-business-form
    business-id="<BUSINESS_ID>"
    auth-token="<WEBCOMPONENT_AUTH_TOKEN>">
  </justifi-business-form>
</body>

<script>
  (function () {
    var businessForm = document.querySelector("justifi-business-form");

    businessForm.addEventListener("submitted", (data) => {
      /* this event is raised when the server response is received */
      console.log("server response received", data);
    });

    businessForm.addEventListener("click-event", (data) => {
      let name = data.detail.name;

      if (name == "submit") {
        console.log("This is a submit button click", data);
      } else {
        console.log("Not an event from the submit button");
      }
    });
  })();
</script>

</html>`;
