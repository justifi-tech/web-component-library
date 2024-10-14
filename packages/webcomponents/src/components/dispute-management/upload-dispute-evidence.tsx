import { Component, h, State } from "@stencil/core";

@Component({
  tag: 'justifi-upload-dispute-evidence',
})
export class UploadDisputeEvidence {
  @State() shippingAddressSameAsBilling = true;

  shippingAddressSameAsBillingChanged(name: string, value: boolean) {
    console.log('name', name);
    console.log('same?', value);
    this.shippingAddressSameAsBilling = value;
  }

  render() {
    return (
      <div>
        <div class="row gy-3">
          <div class="col-12">
            <h1 class="h4">Counter dispute</h1>
          </div>

          <div class="col-12">
            <h2 class="h5">Step 2: Upload evidence</h2>
            <p>
              Upload as much of the recommended evidence as possible to build the best case for your counter-dispute.
              If you have additional evidence you would like to provide you may upload it as well.
            </p>
            <ul>
              <li>Customer communication</li>
              <li>Customer signature</li>
              <li>Shipping documentation</li>
              <li>Receipt</li>
              <li>Other evidence</li>
            </ul>
            <form-control-file
              name="evidence"
              label="Upload files"
              multiple={true}
            />
          </div>

          <div class="col-12">
            <h2 class="h5">Customer details</h2>
            <div class="row gy-3">

              <div class="col-12">
                <form-control-text
                  name="email"
                  label="Email"
                />
              </div>
              <div class="col-12">
                <justifi-billing-form></justifi-billing-form>
              </div>
            </div>
          </div>

          <div class="col-12">
            <h2 class="h5">Shipping details</h2>
            <div class="row gy-3">
              <div class="col-12">
                <form-control-checkbox
                  name="shippingAddressSameAsBilling"
                  label="Shipping address same as billing"
                  defaultValue={this.shippingAddressSameAsBilling}
                  inputHandler={this.shippingAddressSameAsBillingChanged}
                />
              </div>
              {!this.shippingAddressSameAsBilling && (
                <div class="col-12">
                  <justifi-billing-form></justifi-billing-form>
                </div>
              )}
            </div>
          </div>

          <div class="col-12">
            <form-control-checkbox label="I understand that I can only submit this information once and have provided as much evidence as possible"></form-control-checkbox>
          </div>
        </div>
        <div class="d-flex gap-2 mt-4 justify-content-end">
          <button class="btn btn-primary">Submit Evidence</button>
        </div>
      </div>
    );
  }
};
