import { codeExampleHead } from "../../utils";

export default `<!DOCTYPE html>
<html dir="ltr" lang="en">

${codeExampleHead("justifi-payment-form")}

  <body>
    <justifi-tokenize-payment-method
      auth-token="your-auth-token"
      account-id="acc_5Et9iXrSSAZR2KSouQGAWi"
    >
    </justifi-tokenize-payment-method>
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
  </script>

</html>`;
