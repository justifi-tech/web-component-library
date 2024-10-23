import { Component, h, State } from "@stencil/core";

const evidenceTypeOptions = [
  { label: "Evidence type", value: "" },
  { label: "Customer communication", value: "" },
  { label: "Customer signature", value: "" },
  { label: "Shipping documentation", value: "" },
  { label: "Receipt", value: "" },
  { label: "Other evidence", value: "" }
]

@Component({
  tag: 'justifi-upload-dispute-evidence',
})
export class UploadDisputeEvidence {
  @State() addShippingAddress: boolean = false;
  @State() addCustomerDetails: boolean = false;
  @State() evidence = [];

  addCustomerDetailsChanged(name: string, value: boolean) {
    console.log(name, value);
    this.addCustomerDetails = value;
  }

  addShippingAddressChanged(name: string, value: boolean) {
    console.log(name, value);
    this.addShippingAddress = value;
  }

  addEvidence() {
    this.evidence = [...this.evidence, { type: '', file: null }];
  }

  removeEvidence(index) {
    this.evidence.splice(index, 1);
    this.evidence = [...this.evidence];
  }

  render() {
    return (
      <div>
        <div class="row gy-3">
          <div class="col-12">
            <h1 class="h4">Counter dispute</h1>
          </div>

          <hr />

          <div class="col-12">
            <h2 class="h5">Upload evidence</h2>
            <p>
              Upload as much of the recommended evidence as possible to build the best case for your counter-dispute.
              If you have additional evidence you would like to provide you may upload it as well.
            </p>
            {this.evidence.map((item, index) => (
              <div class="row gy-3 gx-2" key={index}>
                <div class="col-4">
                  <form-control-select
                    name="evidenceType"
                    defaultValue={item.type}
                    options={evidenceTypeOptions}
                  />
                </div>
                <div class="col-6">
                  <form-control-file
                    name="evidence"
                    multiple={false}
                  />
                </div>
                <div class="col-2">
                  {/* mt-2 is a temp fix because our form controls do not hide empty labels which have a margin on them */}
                  <button
                    class="btn btn-danger mt-2"
                    onClick={() => this.removeEvidence(index)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div class="col-12">
            <button class="btn btn-secondary" onClick={() => this.addEvidence()}>Add Evidence +</button>
          </div>

          <hr />

          <div class="col-12">
            <div class="row gy-3">
              <div class="col-12">
                <form-control-checkbox
                  name="addCustomerDetails"
                  label="I would like to add information about the customer"
                  defaultValue={this.addCustomerDetails}
                  inputHandler={(name, value) => this.addCustomerDetailsChanged(name, value)}
                />
              </div>
              {this.addCustomerDetails && (
                <div class="col-12">
                  <h2 class="h5">Customer information</h2>
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
              )}
            </div>
          </div>

          <div class="col-12">
            <div class="row gy-3 gx-2">
              <div class="col-12">
                <form-control-checkbox
                  name="addShippingAddress"
                  label="I would like to add a shipping address"
                  defaultValue={this.addShippingAddress}
                  inputHandler={(name, value) => this.addShippingAddressChanged(name, value)}
                />
              </div>
              {this.addShippingAddress && (
                <div class="col-12">
                  <h2 class="h5">Shipping address</h2>
                  <justifi-billing-form></justifi-billing-form>
                </div>
              )}
            </div>
          </div>
        </div>

        <div class="alert alert-light" role="alert">
          <form-control-checkbox label="I understand that I can only submit this information once and have provided as much evidence as possible"></form-control-checkbox>
        </div>

        <div class="d-flex gap-2 mt-4 justify-content-end">
          <button class="btn btn-secondary">Cancel</button>
          <button class="btn btn-primary">Submit Counter Dispute</button>
        </div>
      </div>
    );
  }
};
