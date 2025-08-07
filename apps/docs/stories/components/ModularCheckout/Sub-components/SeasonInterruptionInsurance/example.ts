import { codeExampleHead } from '../../../../utils';

export const codeExampleFull = `
<!DOCTYPE html>
<html dir="ltr" lang="en">

${codeExampleHead(
  'justifi-season-interruption-insurance',
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

      ::part(input-radio) {
        background-color: #fff; 
        border-color: #333;
      }

      ::part(input-radio-checked) {
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="-5 -5 30 30" fill="white"><circle cx="10" cy="10" r="10"/></svg>');
        background-color: #000;
      }

      ::part(input-radio-focused) {
        background-color: #333;
        border-color: #333;
        box-shadow: 0 0 0 0.25rem rgba(0, 0, 0, 0.25);
      }

      ::part(input-radio-checked-focused) {
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="-5 -5 30 30" fill="white"><circle cx="10" cy="10" r="10"/></svg>');
        background-color: #000;
        border-color: #333;
        box-shadow: 0 0 0 0.25rem rgba(0, 0, 0, 0.25);
      }
    </style>`
)}

<body>
  <justifi-season-interruption-insurance 
    auth-token="your-auth-token"
    checkout-id="your-checkout-id"
    primary-identity-first-name="John"
    primary-identity-last-name="Doe"
    primary-identity-state="CA"
    primary-identity-postal-code="90210"
    primary-identity-country="US"
    primary-identity-email-address="john.doe@email.com"
    policy-attributes-insurable-amount="100000"
  />
</body>

</html>
`;

export const codeExampleEventHandling = `
  <justifi-season-interruption-insurance 
    auth-token="your-auth-token"
    checkout-id="your-checkout-id"
    primary-identity-first-name="John"
    primary-identity-last-name="Doe"
    primary-identity-state="CA"
    primary-identity-postal-code="90210"
    primary-identity-country="US"
    primary-identity-email-address="john.doe@email.com"
    policy-attributes-insurable-amount="100000"
  />

<script>
  (function() {
    // error event
    document.querySelector('justifi-season-interruption-insurance')
      .addEventListener('error-event', (event) => {
        console.log('error event', event.detail);
      });
  })();
</script>
`;
