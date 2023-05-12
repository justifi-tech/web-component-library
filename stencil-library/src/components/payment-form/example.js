export default
`<body>
  <justifi-payment-form bank-account="true" card="true"></justifi-payment-form>
</body>

<script>
  (function () {
    var paymentForm = document.querySelector('justifi-payment-form');

    paymentForm.addEventListener('onSubmitted', (data) => {
      // here is where you would submit a payment with the token
      console.log('data');
    });
  })();
</script>
`
