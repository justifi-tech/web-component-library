import { codeExampleHead } from '../../utils';

export default `<!DOCTYPE html>
<html dir="ltr" lang="en">

${codeExampleHead(
  'justifi-business-form',
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
  <justifi-business-form
    business-id="biz_123"
    auth-token="authToken"
  />
</body>

<script>
  (function () {
    var businessForm = document.querySelector("justifi-business-form");

    businessForm.addEventListener("submit-event", (event) => {
      /* this event is raised when the server response is received */
      console.log("server response received", event.detail.response);
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
