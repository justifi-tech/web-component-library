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

  render() {
    return (
      <div>
        <div class="row gy-3">
          <div class="col-12">
            <h1 class="h4">Counter dispute</h1>
          </div>

          <hr />

          <div class="col-12">
            <h2 class="h5">Why are you countering this dispute?</h2>
            <div class="row gy-3">
              <div class="col-12">
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="disputeReason" id="reason1" value="reason1" />
                  <label class="form-check-label" htmlFor="reason1">
                    The cardholder withdrew the dispute
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="disputeReason" id="reason2" value="reason2" />
                  <label class="form-check-label" htmlFor="reason2">
                    The cardholder received the product or service
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="disputeReason" id="reason3" value="reason3" />
                  <label class="form-check-label" htmlFor="reason3">
                    The cardholder was refunded
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="disputeReason" id="reason4" value="reason4" />
                  <label class="form-check-label" htmlFor="reason4">
                    The product, service, event or booking was cancelled or delayed due to a government order or other circumstances beyond your control
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="disputeReason" id="reason5" value="reason5" />
                  <label class="form-check-label" htmlFor="reason5">
                    Other
                  </label>
                </div>
              </div>
            </div>
          </div>

          <hr />

          <div class="col-12">
            <h2 class="h5">Upload evidence</h2>
            <p>
              Upload as much of the recommended evidence as possible to build the best case for your counter-dispute.
              If you have additional evidence you would like to provide you may upload it as well.
            </p>
            {this.evidence.map((index) => (
              <div class="row gy-3" key={index}>
                <div class="col-4">
                  <form-control-select
                    name="evidenceType"
                    defaultValue=""
                    options={evidenceTypeOptions}
                  />
                </div>
                <div class="col-8">
                  <form-control-file
                    name="evidence"
                    multiple={false}
                  />
                </div>
              </div>
            ))}
          </div>

          <div class="col-12">
            <button class="btn btn-secondary" onClick={() => {
              this.evidence = [...this.evidence, 1];
            }}>Add Evidence +</button>
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
            <div class="row gy-3">
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

          <div class="col-12">
            <form-control-checkbox label="I understand that I can only submit this information once and have provided as much evidence as possible"></form-control-checkbox>
          </div>
        </div>
        <div class="d-flex gap-2 mt-4 justify-content-end">
          <button class="btn btn-secondary">Cancel</button>
          <button class="btn btn-primary">Submit Counter Dispute</button>
        </div>
      </div>
    );
  }
};
