# justifi-payment-form


## Examples
```html
<!DOCTYPE html>
<html dir="ltr" lang="en">

<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0" />
  <title>justifi-payment-form: Simple example</title>

  <!--
    If you are including the components via CDN the src should be the following:
    https://unpkg.com/@justifi/webcomponents@<version>/dist/webcomponents/webcomponents.esm.js
  -->
  <script type="module" src="/build/webcomponents.esm.js"></script>
  <script nomodule src="/build/webcomponents.js"></script>
</head>

<body>
  <h1>PaymentForm</h1>
  <hr>
  <justifi-payment-form></justifi-payment-form>
</body>

<script>
  (function () {})();
</script>

</html>
```

<!-- Auto Generated Below -->


## Properties

| Property             | Attribute             | Description | Type                                                           | Default     |
| -------------------- | --------------------- | ----------- | -------------------------------------------------------------- | ----------- |
| `validationStrategy` | `validation-strategy` |             | `"all" \| "onBlur" \| "onChange" \| "onSubmit" \| "onTouched"` | `undefined` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
