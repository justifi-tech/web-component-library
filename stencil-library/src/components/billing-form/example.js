import { head } from "../../../storybook-pages/example-parts"

export default `<!DOCTYPE html>
<html dir="ltr" lang="en">

${head('justifi-billing-form')}

<body>
  <justifi-billing-form></justifi-billing-form>
  <button id="justifi-billing-form-submit">Submit</button>
</body>

<script>
  (async () => {
    await customElements.whenDefined('justifi-billing-form');

    // Billing form component
    var billingForm = document.querySelector('justifi-billing-form');
    var billingFormSubmitButton = document.querySelector('#justifi-billing-form-submit');
    billingFormSubmitButton.addEventListener('click', async (event) => {
      const billingFormValidation = await billingForm.validate();
    });
  })();
</script>

</html>`
